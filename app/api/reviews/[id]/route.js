import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const review = await Review.findById(id).populate('productId', 'title images');
    
    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, review }, { status: 200 });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const review = await Review.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, review }, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
