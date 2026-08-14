'use client';
import FeaturedProducts from './FeaturedProducts';
import LazySection from './LazySection';

const SECTIONS = [
    { collectionSlug: 'new-arrivals', title: 'New Arrivals' },
    { collectionSlug: 'chiffon', title: 'Chiffon' },
    { collectionSlug: 'lawn', title: 'Lawn' },
    { collectionSlug: 'hands-bag', title: 'Bags' },
    { collectionSlug: 'stiched', title: 'Stiched' },
    { collectionSlug: '2pc', title: '2PC' },
    { collectionSlug: '3pc', title: '3PC' },
];

export default function FeaturedProductsSection({ initialProducts }) {
    return (
        <>
            {SECTIONS.map((section, index) => {
                if (index === 0) {
                    return (
                        <FeaturedProducts
                            key={section.collectionSlug}
                            collectionSlug={section.collectionSlug}
                            title={section.title}
                            initialProducts={initialProducts}
                        />
                    );
                }

                return (
                    <LazySection key={section.collectionSlug} minHeight="350px">
                        <FeaturedProducts
                            collectionSlug={section.collectionSlug}
                            title={section.title}
                            initialProducts={null}
                        />
                    </LazySection>
                );
            })}
        </>
    );
}