import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/models/Menu';

// GET /api/menus/[handle] — full menu with items
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { handle } = await params;
    const menu = await Menu.findOne({ handle }).lean();

    if (!menu) {
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, menu }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/menus/[handle] — update menu (name, position, items)
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { handle } = await params;
    const body = await request.json();
    const { name, position, items } = body;

    const menu = await Menu.findOne({ handle });
    if (!menu) {
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    // If changing position to a named slot, clear it from other menus
    if (position && position !== 'none' && position !== menu.position) {
      await Menu.updateMany(
        { _id: { $ne: menu._id }, position },
        { $set: { position: 'none' } }
      );
    }

    if (name !== undefined) menu.name = name.trim();
    if (position !== undefined) menu.position = position;
    if (items !== undefined) menu.items = items;

    await menu.save();

    return NextResponse.json({ success: true, menu }, { status: 200 });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/menus/[handle]
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { handle } = await params;
    const result = await Menu.findOneAndDelete({ handle });

    if (!result) {
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Menu deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
