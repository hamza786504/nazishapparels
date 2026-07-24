import Image from 'next/image';
import HeroCarousel from '../_components/HeroCarousel';
import NewArrivals from '../_components/NewArrivals';
import CategoryShowcase from '../_components/CategoryShowcase';
import HandcraftedCategories from '../_components/HandcraftedCategories';
import BrandStory from '../_components/BrandStory';
import FeaturedProductsSection from '../_components/FeaturedProductsSection';
import HandcraftedAccessories from '../_components/HandcraftedAccessories';
import Newsletter from '../_components/Newsletter';
import Testimonials from '../_components/Testimonials';
import ScrollAnimations from '../_components/ScrollAnimations';
import CategorySidebar from '../_components/CategorySidebar';
import LazySection from '../_components/LazySection';
import { getShowcaseProducts } from '@/lib/getShowcaseProducts';
import { publicClient } from '@/lib/sanityClientPublic';

export const revalidate = 300;

export const metadata = {
    title: 'NazishApparels | Luxury Clothing & Accessories',
    description: 'Discover handcrafted dresses, suits, and accessories from NazishApparels.',
};

export default async function Home() {
    const initialProducts = await getShowcaseProducts('chiffon');
    const collections = await publicClient.fetch(
        `*[_type == "collection"] | order(name asc){slug, name, "productCount": count(*[_type == "product" && collectionId == ^._id])}`
    );

    return (
        <main className="h-full overflow-hidden">
            <ScrollAnimations />

            {/* Flex container that takes full height */}
            <div className="flex h-full max-w-container-max mx-auto">
                {/* Sidebar - scrollable */}
                <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-secondary/10 overflow-y-auto h-full">
                    <CategorySidebar initialCollections={collections} />
                </aside>
                
                {/* Main content - scrollable */}
                <div className="flex-1 min-w-0 overflow-y-auto px-2 md:px-5 md:pt-5">
                    <div className="lg:rounded-3xl overflow-hidden relative w-full aspect-[21/9] sm:aspect-[24/9]">
                        <Image
                            src="/banner.png"
                            alt="NazishApparels Featured Collection"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1200px"
                            className="object-cover"
                        />
                    </div>

                    <div className="px-0 md:px-3 lg:px-0 pb-8">
                        <NewArrivals />

                        <LazySection minHeight="200px">
                            <HandcraftedCategories />
                        </LazySection>

                        <LazySection minHeight="400px">
                            <FeaturedProductsSection initialProducts={initialProducts} />
                        </LazySection>
                    </div>
                </div>
            </div>
        </main>
    );
}