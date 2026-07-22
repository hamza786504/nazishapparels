const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'kb41e1az',
    dataset: 'production',
    apiVersion: '2025-01-01',
    token: 'skSYZHeTPrTjAlezgC6BzOJ8y8qiyxeTk6xET2IAjxVAck0fOBGQq9g9JvBpcyhan1odAdb1bNAcgvpDL4ksNNSzw74KZalNKnLSyqZ4Geh6EdW0hJIOaYFfsy0EVfyVTJzhsecNGgRQaLxhvkcLIgo3IU539hdemn0fixNKiSNXJwlbe1nH',
    useCdn: false,
    perspective: 'raw',
});

async function main() {
    try {
        console.log('1. Approving pending reviews for test...');
        const pendingReviews = await client.fetch('*[_type == "review" && status == "pending"]');
        console.log('Pending reviews count:', pendingReviews.length);

        // Approve all pending reviews so they show up
        for (const rev of pendingReviews) {
            await client.patch(rev._id).set({ status: 'approved' }).commit();
            console.log(`Approved review ${rev._id} for product ${rev.productId}`);
        }

        console.log('\n2. Recalculating reviewCount and reviewAvg for all products...');
        const products = await client.fetch('*[_type == "product"]{ _id, title }');

        for (const p of products) {
            const reviews = await client.fetch(
                `*[_type == "review" && (productId == $id || productId._ref == $id || product._ref == $id) && status == "approved"]{ rating }`,
                { id: p._id }
            );

            const count = reviews.length;
            const sum = count > 0 ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) : 0;
            const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;

            await client.patch(p._id).set({ reviewCount: count, reviewAvg: avg }).commit();
            if (count > 0) {
                console.log(`Updated "${p.title}": ${avg} (${count} reviews)`);
            }
        }
        console.log('\nSUCCESS! All product review metrics synced in Sanity.');
    } catch (err) {
        console.error('Error syncing product metrics:', err);
    }
}

main();
