import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Collection from '@/models/Collection';

// Static pages list — extend as needed
const STATIC_PAGES = [
  { label: 'Home',        url: '/',              slug: ''          },
  { label: 'About',       url: '/about',         slug: 'about'     },
  { label: 'Contact',     url: '/contact',       slug: 'contact'   },
  { label: 'Shop All',    url: '/collection/all',slug: 'all'       },
  { label: 'New Arrivals',url: '/collection/new-arrivals', slug: 'new-arrivals' },
  { label: 'Cart',        url: '/cart',          slug: 'cart'      },
  { label: 'Login',       url: '/login',         slug: 'login'     },
  { label: 'FAQ',         url: '/pages/faq',     slug: 'faq'       },
  { label: 'Privacy Policy', url: '/pages/privacy', slug: 'privacy' },
  { label: 'Terms',       url: '/pages/terms',   slug: 'terms'     },
];

// GET /api/menus/search?q=keyword
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q || q.length < 1) {
      return NextResponse.json({ success: true, results: [] }, { status: 200 });
    }

    await dbConnect();
    const regex = { $regex: q, $options: 'i' };

    // Run all three in parallel
    const [products, collections] = await Promise.all([
      Product.find({ title: regex, status: 'active' })
        .select('title slug')
        .limit(5)
        .lean(),
      Collection.find({ $or: [{ name: regex }, { slug: regex }] })
        .select('name slug')
        .limit(5)
        .lean(),
    ]);

    // Match static pages
    const pageResults = STATIC_PAGES.filter(
      (p) =>
        p.label.toLowerCase().includes(q.toLowerCase()) ||
        p.slug.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 4);

    const results = [
      ...products.map((p) => ({
        type: 'product',
        label: p.title,
        url: `/product/${p.slug || p._id}`,
        slug: p.slug || String(p._id),
        id: String(p._id),
      })),
      ...collections.map((c) => ({
        type: 'collection',
        label: c.name,
        url: `/collection/${c.slug}`,
        slug: c.slug,
        id: String(c._id),
      })),
      ...pageResults.map((p) => ({
        type: 'page',
        label: p.label,
        url: p.url,
        slug: p.slug,
        id: p.slug,
      })),
    ];

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error('Menu search error:', error);
    return NextResponse.json({ success: false, results: [], error: error.message }, { status: 500 });
  }
}
