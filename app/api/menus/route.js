import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/models/Menu';

function toHandle(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// GET /api/menus — list all menus (summary, no full item tree)
// ?position=header  → returns only the menu assigned to that position (single)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const positionFilter = searchParams.get('position');

    const query = positionFilter ? { position: positionFilter } : {};

    const menus = await Menu.find(query)
      .select('name handle position items createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    // Add item count without sending full tree
    const summary = menus.map((m) => ({
      ...m,
      itemCount: (m.items || []).length,
    }));

    // If filtering by position, return the single menu directly for convenience
    if (positionFilter) {
      const menu = summary[0] || null;
      return NextResponse.json({ success: true, menu, menus: summary }, { status: 200 });
    }

    return NextResponse.json({ success: true, menus: summary }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/menus — create new menu
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, position = 'none' } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Menu name is required' }, { status: 400 });
    }

    const handle = toHandle(name.trim());

    // Ensure handle is unique
    const existing = await Menu.findOne({ handle });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `A menu with handle "${handle}" already exists` },
        { status: 409 }
      );
    }

    // If position is header/footer/sidebar, unset that position on other menus first
    if (position !== 'none') {
      await Menu.updateMany({ position }, { $set: { position: 'none' } });
    }

    const menu = await Menu.create({ name: name.trim(), handle, position, items: [] });
    return NextResponse.json({ success: true, menu }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
