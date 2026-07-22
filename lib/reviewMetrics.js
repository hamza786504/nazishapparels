import client from '@/lib/sanityClient';

/**
 * Recalculate and update reviewCount and reviewAvg fields on a product document in Sanity.
 * @param {string} productId - Sanity document _id of the product
 */
export async function updateProductReviewMetrics(productId) {
    if (!productId || typeof productId !== 'string') return null;

    try {
        // Fetch all approved reviews for this product
        const approvedReviews = await client.fetch(
            `*[_type == "review" && (productId == $productId || productId._ref == $productId || product._ref == $productId) && status == "approved"]{ rating }`,
            { productId }
        );

        const count = Array.isArray(approvedReviews) ? approvedReviews.length : 0;
        const sum = count > 0 ? approvedReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) : 0;
        const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;

        // Patch product document with updated review metrics
        await client
            .patch(productId)
            .set({
                reviewCount: count,
                reviewAvg: avg,
            })
            .commit();

        return { reviewCount: count, reviewAvg: avg };
    } catch (error) {
        console.error(`Error updating review metrics for product ${productId}:`, error);
        return null;
    }
}
