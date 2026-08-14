import { NextResponse } from 'next/server';
import client from '@/lib/sanityClient';
import { sendEmail, buildOrderCancellationEmail } from '@/lib/email';

const ORDER_PROJECTION = `{
  ...,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
}`;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = await client.fetch(`*[_type == "order" && _id == $id][0]${ORDER_PROJECTION}`, { id });

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
    const { id } = await params;
    const body = await request.json();

    const existing = await client.fetch(`*[_type == "order" && _id == $id][0]{_id}`, { id });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    await client.patch(id).set(body).commit();
    const order = await client.fetch(`*[_type == "order" && _id == $id][0]${ORDER_PROJECTION}`, { id });

    // Best-effort cancellation email — a mail failure must never break the update.
    if (body.fulfillmentStatus === 'Cancelled') {
      try {
        const recipient = order.email || order.customer?.email;
        if (recipient) {
          const { html, text } = buildOrderCancellationEmail({ order });
          sendEmail({
            to: recipient.toLowerCase(),
            subject: `Your ${process.env.STORE_NAME || 'NazishApparels'} order ${order.orderId} has been cancelled`,
            html,
            text,
          });
        }
      } catch (mailErr) {
        console.error('Order cancellation email failed:', mailErr);
      }
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await client.fetch(`*[_type == "order" && _id == $id][0]{_id}`, { id });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    await client.delete(id);

    return NextResponse.json({ success: true, message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
