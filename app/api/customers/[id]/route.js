import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, customer }, { status: 200 });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const customer = await Customer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, customer }, { status: 200 });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const customer = await Customer.findByIdAndDelete(id);
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Customer deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
