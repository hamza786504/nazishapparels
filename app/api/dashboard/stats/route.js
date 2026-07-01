import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db.js';
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import Customer from '../../../../models/Customer';
import Review from '../../../../models/Review';
import Collection from '../../../../models/Collection';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const prevThirtyDaysAgo = new Date(thirtyDaysAgo);
    prevThirtyDaysAgo.setDate(prevThirtyDaysAgo.getDate() - 30);

    // ─── PHASE 1: Run all independent queries in PARALLEL ───
    const [
      productsCount,
      customersCount,
      reviewsCount,
      ordersCount,
      salesAggregation,
      currentPeriodSales,
      prevPeriodSales,
      newCustomersCurrent,
      newCustomersPrev,
      orderStatusBreakdown,
      fulfillmentBreakdown,
      productStatusBreakdown,
      lowStockProducts,
      totalInventoryAgg,
      revenueByStatus,
      recentCustomers,
      recentOrders,
      collections,
      // Single aggregation for sales trend (replaces 15 separate queries)
      salesTrendAgg,
      // Single aggregation for monthly revenue (replaces 6 separate queries)
      monthlyRevenueAgg,
      // Products grouped by collection (replaces N+1 queries)
      productsByCollection,
    ] = await Promise.all([
      // Core counts
      Product.countDocuments({}),
      Customer.countDocuments({}),
      Review.countDocuments({}),
      Order.countDocuments({}),

      // Total sales (all time)
      Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$total' } } }
      ]),

      // Current period sales (last 30 days)
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
      ]),

      // Previous period sales (30-60 days ago)
      Order.aggregate([
        { $match: { createdAt: { $gte: prevThirtyDaysAgo, $lt: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
      ]),

      // New customers this period
      Customer.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      // New customers previous period
      Customer.countDocuments({ createdAt: { $gte: prevThirtyDaysAgo, $lt: thirtyDaysAgo } }),

      // Order status breakdown
      Order.aggregate([
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
      ]),

      // Fulfillment breakdown
      Order.aggregate([
        { $group: { _id: '$fulfillmentStatus', count: { $sum: 1 } } }
      ]),

      // Product status breakdown
      Product.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Low stock products
      Product.find({ inventory: { $lte: 5 } })
        .select('title inventory slug')
        .sort({ inventory: 1 })
        .limit(5)
        .lean(),

      // Total inventory + avg price
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$inventory' }, avgPrice: { $avg: '$price' } } }
      ]),

      // Revenue by payment status
      Order.aggregate([
        { $group: { _id: '$paymentStatus', revenue: { $sum: '$total' }, count: { $sum: 1 } } }
      ]),

      // Recent customers
      Customer.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email createdAt ordersCount totalSpent')
        .lean(),

      // Recent orders
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),

      // Collections
      Collection.find({}).lean(),

      // ─── Sales Trend: SINGLE aggregation replacing 15 separate queries ───
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 14))
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            sales: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // ─── Monthly Revenue: SINGLE aggregation replacing 6 separate queries ───
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),

      // ─── Products by Collection: SINGLE aggregation replacing N+1 queries ───
      Product.aggregate([
        { $group: { _id: '$collectionId', count: { $sum: 1 } } }
      ]),
    ]);

    // ─── PHASE 2: Compute derived values (no DB calls) ───

    const totalSales = salesAggregation[0]?.totalSales || 0;
    const currentSales = currentPeriodSales[0]?.total || 0;
    const currentOrders = currentPeriodSales[0]?.count || 0;
    const prevSales = prevPeriodSales[0]?.total || 0;
    const prevOrders = prevPeriodSales[0]?.count || 0;

    const salesChange = prevSales > 0 ? (((currentSales - prevSales) / prevSales) * 100).toFixed(1) : (currentSales > 0 ? 100 : 0);
    const ordersChange = prevOrders > 0 ? (((currentOrders - prevOrders) / prevOrders) * 100).toFixed(1) : (currentOrders > 0 ? 100 : 0);
    const customersChange = newCustomersPrev > 0 ? (((newCustomersCurrent - newCustomersPrev) / newCustomersPrev) * 100).toFixed(1) : (newCustomersCurrent > 0 ? 100 : 0);

    const avgOrderValue = ordersCount > 0 ? (totalSales / ordersCount) : 0;
    const currentAvgOrderValue = currentOrders > 0 ? (currentSales / currentOrders) : 0;
    const prevAvgOrderValue = prevOrders > 0 ? (prevSales / prevOrders) : 0;
    const avgOrderChange = prevAvgOrderValue > 0 ? (((currentAvgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100).toFixed(1) : (currentAvgOrderValue > 0 ? 100 : 0);

    // Build category data from the single aggregation + collections
    const colors = ['#006c50', '#5d5e60', '#8f3f37', '#bdc9c2', '#e1e3e5'];
    const collectionMap = {};
    for (const coll of collections) {
      collectionMap[coll._id.toString()] = coll;
    }
    const categoryData = [];
    for (const item of productsByCollection) {
      if (item._id === null) {
        categoryData.push({ name: 'Unassigned', value: item.count, color: '#bdbdbd' });
      } else {
        const coll = collectionMap[item._id.toString()];
        if (coll) {
          categoryData.push({ name: coll.name, value: item.count, color: colors[categoryData.length % colors.length] });
        }
      }
    }

    // Build sales trend from single aggregation (fill gaps for days with no orders)
    const salesTrend = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isoDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
      const dayData = salesTrendAgg.find(d => d._id === isoDate);
      salesTrend.push({
        date: dateStr,
        sales: dayData?.sales || 0,
        orders: dayData?.orders || 0
      });
    }

    // Build monthly revenue from single aggregation
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const year = monthStart.getFullYear();
      const month = monthStart.getMonth() + 1;
      const monthData = monthlyRevenueAgg.find(d => d._id.year === year && d._id.month === month);
      monthlyRevenue.push({
        month: monthLabel,
        revenue: monthData?.revenue || 0,
        orders: monthData?.orders || 0
      });
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalSales,
        ordersCount,
        productsCount,
        customersCount,
        reviewsCount,
        avgOrderValue,
        currentPeriodSales,
        newCustomersCurrent,
        salesChange: parseFloat(salesChange),
        ordersChange: parseFloat(ordersChange),
        customersChange: parseFloat(customersChange),
        avgOrderChange: parseFloat(avgOrderChange),
      },
      orderStatusBreakdown: orderStatusBreakdown.reduce((acc, item) => {
        acc[item._id || 'Unknown'] = item.count;
        return acc;
      }, {}),
      fulfillmentBreakdown: fulfillmentBreakdown.reduce((acc, item) => {
        acc[item._id || 'Unknown'] = item.count;
        return acc;
      }, {}),
      productStatusBreakdown: productStatusBreakdown.reduce((acc, item) => {
        acc[item._id || 'Unknown'] = item.count;
        return acc;
      }, {}),
      revenueByStatus: revenueByStatus.map(item => ({
        status: item._id || 'Unknown',
        revenue: item.revenue,
        count: item.count
      })),
      lowStockProducts,
      recentCustomers,
      recentOrders,
      categoryData,
      salesTrendData: salesTrend,
      monthlyRevenue,
      totalInventory: totalInventoryAgg[0]?.total || 0,
      avgPrice: totalInventoryAgg[0]?.avgPrice || 0,
      lastUpdated: now.toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating dashboard stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
