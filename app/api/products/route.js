import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import Collection from '../../../models/Collection';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';
    const collectionId = searchParams.get('collectionId') || '';
    const productType = searchParams.get('type') || '';
    const vendor = searchParams.get('vendor') || '';
    const slug = searchParams.get('slug') || '';
    
    // Build query filter
    const filter = {};
    
    // If slug is provided, return single product by slug
    if (slug) {
      const product = await Product.findOne({ slug }).populate('collectionId', 'name slug');
      if (!product) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product }, { status: 200 });
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { SKU: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status && status !== 'All Statuses') {
      filter.status = status.toLowerCase();
    }
    
    if (collectionId) {
      filter.collectionId = collectionId;
    }
    
    if (productType && productType !== 'All Types') {
      filter.productType = productType;
    }
    
    if (vendor && vendor !== 'All Vendors') {
      filter.vendor = vendor;
    }

    const products = await Product.find(filter)
      .populate('collectionId', 'name slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // If collectionId is empty string, set it to null
    if (body.collectionId === '') {
      body.collectionId = null;
    }

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    if (body.ids && Array.isArray(body.ids)) {
      const result = await Product.deleteMany({ _id: { $in: body.ids } });
      return NextResponse.json({ success: true, message: `${result.deletedCount} products deleted successfully` }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: 'No product IDs provided' }, { status: 400 });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
