import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

// GET /api/notifications/unread-count — lightweight count for header badge
export async function GET() {
  try {
    await dbConnect();
    const count = await Notification.countDocuments({ isRead: false });
    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ success: false, count: 0, error: error.message }, { status: 500 });
  }
}
