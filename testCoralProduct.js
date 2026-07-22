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
        console.log('Fetching "Coral Comfort Lycra Cotton Churidar" from Sanity...');
        const products = await client.fetch('*[_type == "product" && title match "Coral Comfort*"]');
        console.log('Found products matching title:', products.length);
        if (products.length > 0) {
            const p = products[0];
            console.log('Product details:', {
                _id: p._id,
                title: p.title,
                reviewCount: p.reviewCount,
                reviewAvg: p.reviewAvg,
            });

            // Check reviews table for this product
            const reviews = await client.fetch('*[_type == "review" && (productId == $id || productId._ref == $id || product._ref == $id)]', { id: p._id });
            console.log('Reviews for this product in DB:', reviews);
        } else {
            console.log('All products titles:');
            const allP = await client.fetch('*[_type == "product"]{ _id, title, reviewCount, reviewAvg }');
            console.log(allP);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
