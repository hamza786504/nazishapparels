import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

// GET /api/notifications — paginated, searchable, filterable
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('q') || '';
    const isReadParam = searchParams.get('isRead'); // 'true' | 'false' | null = all
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    if (isReadParam === 'true') filter.isRead = true;
    else if (isReadParam === 'false') filter.isRead = false;

    if (type && type !== 'all') {
      filter.type = type;
    }

    const total = await Notification.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(
      { success: true, notifications, total, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/notifications — mark isRead for given ids (or all if markAll=true)
export async function PATCH(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    const { ids, isRead = true, markAll = false } = body;

    if (markAll) {
      const result = await Notification.updateMany({}, { $set: { isRead } });
      return NextResponse.json(
        { success: true, message: `${result.modifiedCount} notifications updated` },
        { status: 200 }
      );
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No notification IDs provided' },
        { status: 400 }
      );
    }

    const result = await Notification.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead } }
    );

    return NextResponse.json(
      { success: true, message: `${result.modifiedCount} notifications updated` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/notifications — delete by ids
export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No notification IDs provided' },
        { status: 400 }
      );
    }

    const result = await Notification.deleteMany({ _id: { $in: ids } });
    return NextResponse.json(
      { success: true, message: `${result.deletedCount} notifications deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
