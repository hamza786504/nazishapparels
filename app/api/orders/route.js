import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Customer from '@/models/Customer';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const fulfillmentStatus = searchParams.get('fulfillmentStatus') || '';
    const orderStatus = searchParams.get('orderStatus') || 'active';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const filter = {};

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
      ];
    }

    if (paymentStatus && paymentStatus !== 'All') {
      filter.paymentStatus = paymentStatus;
    }

    if (fulfillmentStatus && fulfillmentStatus !== 'All') {
      filter.fulfillmentStatus = fulfillmentStatus;
    }

    if (orderStatus && orderStatus !== 'All') {
      filter.status = orderStatus;
    }

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      { success: true, orders, totalOrders, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Auto-generate orderId if not provided
    if (!body.orderId) {
      body.orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;
    }

    const order = await Order.create(body);

    // Upsert customer profile
    if (body.customer?.email) {
      const nameParts = (body.customer.name || '').split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || '';

      await Customer.findOneAndUpdate(
        { email: body.customer.email.toLowerCase() },
        {
          $setOnInsert: { firstName, lastName, status: 'active' },
          $set: {
            phone: body.phone || '',
            address: [body.address, body.apartment, body.city, body.country]
              .filter(Boolean)
              .join(', '),
          },
          $inc: { ordersCount: 1, totalSpent: body.total || 0 },
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    if (body.ids && Array.isArray(body.ids)) {
      const result = await Order.deleteMany({ _id: { $in: body.ids } });
      return NextResponse.json({ success: true, message: `${result.deletedCount} orders deleted successfully` }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: 'No order IDs provided' }, { status: 400 });
  } catch (error) {
    console.error('Error in bulk delete orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    if (body.ids && Array.isArray(body.ids)) {
      const { status, paymentStatus, fulfillmentStatus } = body;
      const updateData = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;
      
      const result = await Order.updateMany({ _id: { $in: body.ids } }, { $set: updateData });
      return NextResponse.json({ success: true, message: `${result.modifiedCount} orders updated successfully` }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: 'No order IDs provided' }, { status: 400 });
  } catch (error) {
    console.error('Error in bulk update orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
