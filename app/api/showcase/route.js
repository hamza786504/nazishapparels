import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/sanityClientPublic';
import { CARD_PROJECTION } from '@/lib/sanityQueries';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const collectionSlug = searchParams.get('collectionSlug');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 50);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    if (!collectionSlug) {
        return NextResponse.json({ success: false, error: 'collectionSlug is required' }, { status: 400 });
    }

    try {
        const fetchLimit = limit + 1;
        let results;

        if (collectionSlug === 'new-arrivals') {
            results = await publicClient.fetch(
                `*[_type == "product" && status == "active"] | order(_createdAt desc) [${offset}...${offset + fetchLimit}] ${CARD_PROJECTION}`
            );
        } else {
            const collection = await publicClient.fetch(
                `*[_type == "collection" && slug == $slug][0]{ _id }`,
                { slug: collectionSlug }
            );
            if (!collection) {
                return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
            }
            results = await publicClient.fetch(
                `*[_type == "product" && status == "active" && collectionId == $collectionId] | order(_createdAt desc) [${offset}...${offset + fetchLimit}] ${CARD_PROJECTION}`,
                { collectionId: collection._id }
            );
        }

        const hasMore = results.length > limit;
        const products = hasMore ? results.slice(0, limit) : (results || []);

        return NextResponse.json(
            { success: true, products, pagination: { offset, limit, hasMore } },
            { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=30' } }
        );
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
