import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';

    const filter = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status && status !== 'All Statuses') {
      filter.status = status.toLowerCase();
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, customers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = await Customer.create(body);
    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No customer IDs provided' }, { status: 400 });
    }

    await Customer.deleteMany({ _id: { $in: ids } });
    
    return NextResponse.json({ success: true, message: `${ids.length} customers deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
