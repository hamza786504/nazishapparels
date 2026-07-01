import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
