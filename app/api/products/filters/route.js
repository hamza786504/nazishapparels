import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/sanityClientPublic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId') || '';

    try {
        const conditions = ['_type == "product"', 'status == "active"'];
        const params = {};

        if (collectionId) {
            conditions.push('collectionId == $collectionId');
            params.collectionId = collectionId;
        }

        const where = conditions.join(' && ');

        const [sizesResult, typesResult, priceResult] = await Promise.all([
            publicClient.fetch(
                `*[${where}]{sizes}`
            ),
            publicClient.fetch(
                `*[${where}]{productType}`
            ),
            publicClient.fetch(
                `*[${where}]{price}`
            ),
        ]);

        const allSizes = [...new Set(sizesResult.flatMap(p => p.sizes || []).filter(Boolean))].sort();
        const allTypes = [...new Set(typesResult.map(p => p.productType).filter(Boolean))].sort();

        const prices = priceResult.map(p => Number(p.price)).filter(n => !isNaN(n));
        const priceBounds = prices.length > 0
            ? { min: Math.min(...prices), max: Math.max(...prices) }
            : { min: 0, max: 10000 };

        return NextResponse.json({
            success: true,
            filters: {
                sizes: allSizes,
                types: allTypes,
                priceRange: priceBounds,
            },
        });
    } catch (error) {
        console.error('Error fetching product filters:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}