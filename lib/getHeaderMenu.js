import dbConnect from '@/lib/db';
import Menu from '@/models/Menu';

// ── Static fallback nav (used if DB fetch fails or no header menu assigned) ──
export const FALLBACK_NAV_ITEMS = [
  { id: 'f-home',    title: 'Home',         url: '/',                        children: [] },
  { id: 'f-shop',    title: 'Shop',         url: '/collection/all',          children: [] },
  { id: 'f-new',     title: 'New Arrivals', url: '/collection/new-arrivals', children: [] },
  { id: 'f-about',   title: 'About',        url: '/about',                   children: [] },
  { id: 'f-contact', title: 'Contact',      url: '/contact',                 children: [] },
];

// Fetches the menu assigned to the 'header' position directly from the DB,
// server-side, so pages render with the real nav on first paint (no client flash).
export async function getHeaderMenuItems() {
  try {
    await dbConnect();
    const menu = await Menu.findOne({ position: 'header' })
      .select('items')
      .lean();

    if (menu?.items?.length) {
      return JSON.parse(JSON.stringify(menu.items));
    }
    return FALLBACK_NAV_ITEMS;
  } catch (error) {
    console.error('Error fetching header menu:', error);
    return FALLBACK_NAV_ITEMS;
  }
}
