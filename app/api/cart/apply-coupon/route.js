import { NextResponse } from 'next/server';
import client from '@/lib/sanityClient';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required.' }, { status: 400 });
    }

    const upperCode = code.toUpperCase();

    const coupon = await client.fetch(`*[_type == "coupon" && code == $code][0]`, { code: upperCode });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code.' }, { status: 400 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'This coupon is no longer active.' }, { status: 400 });
    }

    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its usage limit.' }, { status: 400 });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, error: 'This coupon has expired.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json({ success: false, error: 'Failed to apply coupon.' }, { status: 500 });
  }
}
