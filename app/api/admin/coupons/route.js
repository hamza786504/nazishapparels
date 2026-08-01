import { NextResponse } from 'next/server';
import client from '@/lib/sanityClient';

export async function GET(request) {
  try {
    const coupons = await client.fetch(`*[_type == "coupon"] | order(_createdAt desc)`);
    return NextResponse.json({ success: true, coupons }, { status: 200 });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Ensure code is uppercase
    if (body.code) {
      body.code = body.code.toUpperCase();
    }

    // Check for duplicate code
    const existing = await client.fetch(`*[_type == "coupon" && code == $code][0]`, { code: body.code });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists.' }, { status: 400 });
    }

    const doc = {
      _type: 'coupon',
      code: body.code,
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue) || 0,
      isActive: body.isActive ?? true,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      usedCount: 0,
      expiryDate: body.expiryDate || null,
    };

    const newCoupon = await client.create(doc);
    return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
