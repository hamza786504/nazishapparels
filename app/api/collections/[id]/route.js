import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const collection = await Collection.findById(id);
    
    if (!collection) {
      return NextResponse.json({ success: false, message: 'Collection not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, collection }, { status: 200 });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const collection = await Collection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!collection) {
      return NextResponse.json({ success: false, message: 'Collection not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, collection }, { status: 200 });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const collection = await Collection.findByIdAndDelete(id);
    
    if (!collection) {
      return NextResponse.json({ success: false, message: 'Collection not found' }, { status: 404 });
    }
    
    // Dissociate products from this collection
    await Product.updateMany({ collectionId: id }, { collectionId: null });
    
    return NextResponse.json({ success: true, message: 'Collection deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
