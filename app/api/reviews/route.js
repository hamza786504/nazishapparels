import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');

    const filter = {};
    if (productId) filter.productId = productId;
    if (status && status !== 'All') filter.status = status.toLowerCase();

    const reviews = await Review.find(filter)
      .populate('productId', 'title images')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Bulk operations
    if (body.action === 'bulk-approve' && body.ids) {
      const result = await Review.updateMany(
        { _id: { $in: body.ids } },
        { $set: { status: 'approved' } }
      );
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 });
    }

    if (body.action === 'bulk-delete' && body.ids) {
      const result = await Review.deleteMany({ _id: { $in: body.ids } });
      return NextResponse.json({ success: true, deletedCount: result.deletedCount }, { status: 200 });
    }

    // Single review creation
    const review = await Review.create(body);
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('Error processing review request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
