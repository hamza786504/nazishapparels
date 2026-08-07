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


export const revalidate = 300;

export const metadata = {
    title: 'NazishApparels | Luxury Clothing & Accessories',
    description: 'Discover handcrafted dresses, suits, and accessories from NazishApparels.',
};

export default async function Home() {
    const initialProducts = await getShowcaseProducts('chiffon');

    return (
        <>
            {/* Main content - scrollable */}
            <div className="flex-1 min-w-0 overflow-y-auto">
                {/* Hero - full width, edge to edge */}
                <div className="relative w-full overflow-hidden rounded-3xl">
                    <HeroCarousel />
                </div>

                <div className="px-2 md:px-5 md:pt-0">
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
        </>

    );
}