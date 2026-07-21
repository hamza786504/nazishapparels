import { unstable_cache } from 'next/cache';
import { publicClient } from './sanityClientPublic';
import { CARD_PROJECTION } from './sanityQueries';

export const getShowcaseProducts = unstable_cache(
    async (collectionSlug) => {
        if (!collectionSlug) return [];
        try {
            const collection = await publicClient.fetch(
                `*[_type == "collection" && slug == $slug][0]{ _id }`,
                { slug: collectionSlug }
            );
            if (!collection) return [];
            const products = await publicClient.fetch(
                `*[_type == "product" && status == "active" && collectionId == $collectionId] | order(_createdAt desc) [0...4] ${CARD_PROJECTION}`,
                { collectionId: collection._id }
            );
            return products || [];
        } catch (err) {
            console.error(`[getShowcaseProducts] Error fetching collection ${collectionSlug}:`, err);
            return [];
        }
    },
    ['showcase-products'],
    { revalidate: 300, tags: ['showcase-products', 'products'] }
);
