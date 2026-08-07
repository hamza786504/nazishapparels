// app/admin/analytics/page.jsx
'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  ShoppingCart,
  Users,
  MousePointerClick,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useSlotData from '../../../_components/Admin/DashboardSlots/useSlotData';

// Theme-aware palette (fallbacks match the default admin palette so charts stay
// consistent even before a custom theme is saved).
const COLORS = {
  primary: '#006c50',
  secondary: '#5d5e60',
  tertiary: '#8f3f37',
  error: '#ba1a1a',
  grid: '#eef1f5',
  axis: '#3e4944',
  tick: '#6e7a73',
};

const PKR = (val) => `Rs ${Number(val || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-xl rounded-lg p-4 border border-outline-variant">
        <p className="text-sm font-bold text-on-surface mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-on-surface-variant">
            <span style={{ color: entry.color || COLORS.primary }}>{entry.name}: </span>
            {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartSkeleton = ({ height = 300 }) => (
  <div className="bg-surface-container-low animate-pulse rounded-lg w-full" style={{ height }} />
);

const EmptyState = ({ message, height = 300 }) => (
  <div
    className="flex items-center justify-center text-on-surface-variant text-sm bg-surface-container-low rounded-lg w-full"
    style={{ height }}
  >
    {message}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-outline-variant p-3 md:p-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-start mb-lg gap-3">
    <div>
      <h6 className="font-headline-md text-headline-md text-on-surface">{title}</h6>
      {subtitle && <p className="text-body-sm text-on-surface-variant mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const stockBadge = (inventory) => {
  if (inventory === null || inventory === undefined) return { label: 'Untracked', className: 'bg-surface-container-high text-on-surface-variant' };
  if (inventory <= 0) return { label: 'Out of Stock', className: 'bg-error-container text-error' };
  if (inventory <= 5) return { label: 'Low Stock', className: 'bg-error-container/60 text-error' };
  return { label: 'In Stock', className: 'text-primary bg-primary-container/10' };
};

const statusBadge = (status) => {
  const styles = {
    active: 'text-primary bg-primary-container/10',
    draft: 'bg-surface-variant text-on-surface-variant',
    archived: 'bg-error-container text-error',
  };
  return styles[status] || 'bg-surface-variant text-on-surface-variant';
};

// Payment / fulfillment status badge (mirrors the dashboard OrderStatus slot).
const getStatusBadge = (status) => {
  const s = (status || '').toUpperCase();
  const styles = {
    PAID: 'bg-primary-container/10 text-primary',
    PENDING: 'bg-surface-container-high text-on-surface-variant',
    REFUNDED: 'bg-error-container/20 text-error',
    FULFILLED: 'bg-primary-container/10 text-primary',
    DELIVERED: 'bg-primary-container/10 text-primary',
    UNFULFILLED: 'bg-surface-container-high text-on-surface-variant',
    'PARTIALLY PAID': 'bg-surface-container-high text-on-surface-variant',
    RETURNED: 'bg-error-container/20 text-error',
    CANCELLED: 'bg-error-container/20 text-error',
  };
  return styles[s] || 'bg-surface-container-high text-on-surface-variant';
};

const AnalyticsPage = () => {
  const [activeTimeView, setActiveTimeView] = useState('Daily');

  const { data, loading, refreshing, lastUpdated, refetch } = useSlotData('/api/dashboard/stats', 20000);

  const timeViews = ['Daily', 'Monthly'];

  const metricsData = data?.metrics;
  const salesTrendData = data?.salesTrendData || [];
  const monthlyRevenue = data?.monthlyRevenue || [];
  const categoryData = data?.categoryData || [];
  const revenueByStatus = data?.revenueByStatus || [];
  const orderStatusBreakdown = data?.orderStatusBreakdown || {};
  const fulfillmentBreakdown = data?.fulfillmentBreakdown || {};
  const topProducts = data?.topProductsByValue || [];
  const lowStockCount = data?.lowStockCount || 0;
  const ordersCount = metricsData?.ordersCount || 0;

  // "Daily" shows the last 15 days of real orders; "Monthly" shows the last 6
  // months. Both are backed by the API — no separate weekly rollup exists.
  const trendChartData =
    activeTimeView === 'Daily'
      ? salesTrendData
      : monthlyRevenue.map((m) => ({ date: m.month, sales: m.revenue, orders: m.orders }));

  const totalProductsInView = categoryData.reduce((sum, c) => sum + c.value, 0);

  const metrics = metricsData
    ? [
        {
          title: 'Total Sales',
          value: PKR(metricsData.totalSales),
          change: `${metricsData.salesChange >= 0 ? '+' : ''}${metricsData.salesChange}%`,
          positive: metricsData.salesChange >= 0,
          comparison: 'vs previous 30 days',
          iconKey: 'dollar',
          bgColor: 'bg-primary-container/10',
          textColor: 'text-primary',
        },
        {
          title: 'Total Orders',
          value: metricsData.ordersCount.toLocaleString(),
          change: `${metricsData.ordersChange >= 0 ? '+' : ''}${metricsData.ordersChange}%`,
          positive: metricsData.ordersChange >= 0,
          comparison: 'vs previous 30 days',
          iconKey: 'cart',
          bgColor: 'bg-tertiary-container/10',
          textColor: 'text-tertiary',
        },
        {
          title: 'Avg. Order Value',
          value: PKR(metricsData.avgOrderValue),
          change: `${metricsData.avgOrderChange >= 0 ? '+' : ''}${metricsData.avgOrderChange}%`,
          positive: metricsData.avgOrderChange >= 0,
          comparison: 'per unique transaction',
          iconKey: 'click',
          bgColor: 'bg-secondary-container/30',
          textColor: 'text-secondary',
        },
        {
          title: 'Total Customers',
          value: metricsData.customersCount.toLocaleString(),
          change: `${metricsData.customersChange >= 0 ? '+' : ''}${metricsData.customersChange}%`,
          positive: metricsData.customersChange >= 0,
          comparison: `${metricsData.newCustomersCurrent} new in last 30 days`,
          iconKey: 'users',
          bgColor: 'bg-secondary-fixed/40',
          textColor: 'text-secondary',
        },
        {
          title: 'Total Products',
          value: metricsData.productsCount.toLocaleString(),
          change: lowStockCount > 0 ? `${lowStockCount} Low Stock` : 'All Stocked',
          positive: lowStockCount === 0,
          comparison: 'across all collections',
          iconKey: 'package',
          bgColor: 'bg-primary-fixed/30',
          textColor: 'text-primary',
        },
      ]
    : [];

  const iconMap = {
    dollar: DollarSign,
    cart: ShoppingCart,
    users: Users,
    click: MousePointerClick,
    package: Package,
  };

  return (
    <div className="px-3 max-w-7xl mx-auto space-y-lg">
      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Analytics Overview</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Real-time performance and shop health data.
            {lastUpdated && <span className="ml-2 opacity-70">Updated: {lastUpdated}</span>}
          </p>
        </div>
       
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-md">
        {(loading || metrics.length === 0 ? Array.from({ length: 5 }) : metrics).map((metric, index) => {
          const Icon = metric?.iconKey ? iconMap[metric.iconKey] : DollarSign;
          return (
            <div
              key={index}
              className="bg-white p-3 md:p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all"
            >
              {metric ? (
                <>
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant">{metric.title}</p>
                      <h5 className="font-headline-lg text-headline-lg text-on-surface mt-xs">{metric.value}</h5>
                      <p className="text-body-sm text-on-surface-variant mt-xs">{metric.comparison}</p>
                    </div>
                    <div className={`p-sm rounded-lg ${metric.bgColor} ${metric.textColor}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="flex items-center gap-xs">
                    {metric.positive ? (
                      <TrendingUp size={16} className="text-primary" />
                    ) : (
                      <TrendingDown size={16} className="text-error" />
                    )}
                    <span className={`font-label-md ${metric.positive ? 'text-primary' : 'text-error'}`}>
                      {metric.change}
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-3 animate-pulse">
                  <div className="h-3 w-20 bg-surface-container-high rounded" />
                  <div className="h-7 w-28 bg-surface-container-high rounded mt-2" />
                  <div className="h-3 w-32 bg-surface-container-high rounded" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bento Charts */}
      <div className="grid grid-cols-12 gap-3 md:gap-lg">
        {/* Sales Over Time */}
        <Card className="col-span-12 lg:col-span-8 flex flex-col">
          <CardHeader
            title="Sales Over Time"
            subtitle="Revenue trend for the selected period"
            action={
              <div className="flex gap-1 bg-surface-container rounded-lg p-1">
                {timeViews.map((view) => (
                  <button
                    key={view}
                    className={`text-[11px] font-bold px-4 py-2 rounded-md transition-all ${
                      activeTimeView === view
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                    onClick={() => setActiveTimeView(view)}
                  >
                    {view}
                  </button>
                ))}
              </div>
            }
          />
          <div className="flex-grow min-h-[350px]">
            {loading ? (
              <ChartSkeleton height={350} />
            ) : trendChartData.length === 0 ? (
              <EmptyState message="No orders yet — this chart will populate as sales come in." height={350} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: COLORS.tick }}
                    tickLine={false}
                    axisLine={{ stroke: COLORS.grid }}
                    interval={activeTimeView === 'Daily' ? 2 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: COLORS.tick }}
                    tickLine={false}
                    axisLine={{ stroke: COLORS.grid }}
                    tickFormatter={(value) => `Rs ${value}`}
                  />
                  <Tooltip content={<CustomTooltip formatter={PKR} />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Revenue"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    dot={{ r: 4, fill: COLORS.primary, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: COLORS.primary, strokeWidth: 3, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Products by Collection */}
        <Card className="col-span-12 lg:col-span-4 flex flex-col">
          <CardHeader title="Products by Collection" subtitle="Distribution across collections" />
          <div className="relative flex-grow flex items-center justify-center min-h-[300px]">
            {loading ? (
              <ChartSkeleton height={300} />
            ) : categoryData.length === 0 ? (
              <EmptyState message="No products yet." height={300} />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip formatter={(v) => `${v} products`} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Total Products
                  </span>
                  <span className="font-headline-lg text-headline-lg">{totalProductsInView}</span>
                </div>
              </>
            )}
          </div>
          {!loading && categoryData.length > 0 && (
            <div className="mt-lg space-y-3">
              {categoryData.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="font-body-sm text-body-sm text-on-surface">{source.name}</span>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">{source.value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Revenue by Payment Status */}
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Revenue by Payment Status" subtitle="Revenue grouped by payment state" />
          {loading ? (
            <ChartSkeleton height={300} />
          ) : revenueByStatus.length === 0 ? (
            <EmptyState message="No orders yet." height={300} />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: COLORS.tick }} tickLine={false} axisLine={{ stroke: COLORS.grid }} />
                <YAxis tick={{ fontSize: 12, fill: COLORS.tick }} tickLine={false} axisLine={{ stroke: COLORS.grid }} tickFormatter={(value) => `Rs ${value}`} />
                <Tooltip content={<CustomTooltip formatter={PKR} />} />
                <Bar dataKey="revenue" name="Revenue" fill={COLORS.primary} radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Order Status Breakdown */}
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Order Status" subtitle="Payment & fulfillment breakdown" />
          <div className="space-y-md">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Payment</p>
              <div className="space-y-2">
                {Object.entries(orderStatusBreakdown).length > 0 ? (
                  Object.entries(orderStatusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(status)}`}>
                          {status === 'Paid' ? <CheckCircle size={12} /> : status === 'Refunded' ? <AlertCircle size={12} /> : <Clock size={12} />}
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${ordersCount > 0 ? (count / ordersCount) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="font-label-md text-on-surface w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-body-sm text-on-surface-variant">No orders yet</p>
                )}
              </div>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider">Fulfillment</p>
              <div className="space-y-2">
                {Object.entries(fulfillmentBreakdown).length > 0 ? (
                  Object.entries(fulfillmentBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(status)}`}>
                          {status === 'Fulfilled' || status === 'Delivered' ? <CheckCircle size={12} /> : status === 'Returned' || status === 'Cancelled' ? <AlertCircle size={12} /> : <Clock size={12} />}
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-tertiary rounded-full"
                            style={{ width: `${ordersCount > 0 ? (count / ordersCount) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="font-label-md text-on-surface w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-body-sm text-on-surface-variant">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Top Products by Inventory Value */}
        <Card className="col-span-12 overflow-hidden p-0">
          <div className="px-3 md:px-lg py-4 flex justify-between items-center border-b border-outline-variant">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">Top Products by Inventory Value</h4>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Price × stock on hand — highest tied-up value first
              </p>
            </div>
            <Link className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1" href="/admin/products">
              View all inventory
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-3 md:px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Product</th>
                  <th className="px-3 md:px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">SKU</th>
                  <th className="px-3 md:px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Price</th>
                  <th className="px-3 md:px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Inventory</th>
                  <th className="px-3 md:px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Inventory Value</th>
                  <th className="px-3 md:px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-3 md:px-lg py-4" colSpan={6}>
                        <div className="h-12 bg-surface-container-low animate-pulse rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : topProducts.length === 0 ? (
                  <tr>
                    <td className="px-3 md:px-lg py-10 text-center text-on-surface-variant" colSpan={6}>
                      No products yet — add products to see them ranked here.
                    </td>
                  </tr>
                ) : (
                  topProducts.map((product) => {
                    const stock = stockBadge(product.inventory);
                    return (
                      <tr key={product._id} className="hover:bg-surface-container-low transition-colors duration-150">
                        <td className="px-3 md:px-lg py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden shadow-sm shrink-0">
                              <Image
                                className="object-cover"
                                alt={product.title}
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                fill
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="font-body-md text-body-md text-on-surface font-bold">{product.title}</p>
                              <p className="text-[11px] text-on-surface-variant">{product.productType || 'General'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-lg py-4 font-body-sm text-body-sm text-on-surface-variant">
                          <span className="bg-surface-container px-2 py-1 rounded text-xs">{product.SKU || '—'}</span>
                        </td>
                        <td className="px-3 md:px-lg py-4 font-body-sm text-body-sm text-right font-bold text-on-surface">{PKR(product.price)}</td>
                        <td className="px-3 md:px-lg py-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-[10px] font-bold ${stock.className}`}>
                            {product.inventory} · {stock.label}
                          </span>
                        </td>
                        <td className="px-3 md:px-lg py-4 font-body-md text-body-md text-right font-bold text-on-surface">{PKR(product.inventoryValue)}</td>
                        <td className="px-3 md:px-lg py-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-[10px] font-bold ${statusBadge(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
