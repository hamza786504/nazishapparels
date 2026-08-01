import { NextResponse } from 'next/server';
import client from '@/lib/sanityClient';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData = {};
    if (body.code) updateData.code = body.code.toUpperCase();
    if (body.discountType) updateData.discountType = body.discountType;
    if (body.discountValue !== undefined) updateData.discountValue = Number(body.discountValue);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit ? Number(body.usageLimit) : null;
    if (body.expiryDate !== undefined) updateData.expiryDate = body.expiryDate || null;

    const updatedCoupon = await client.patch(id).set(updateData).commit();

    return NextResponse.json({ success: true, coupon: updatedCoupon }, { status: 200 });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await client.delete(id);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
