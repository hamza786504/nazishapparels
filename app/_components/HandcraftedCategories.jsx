'use client'
import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// components/HandcraftedCategories.jsx
const categories = [
    {
        name: 'New Arrivals',
        image: '/newarrivals-collection.JPG',
        link: "/newsarrivals"
    },
    {
        name: 'Lawn',
        image: '/lawn-collection.JPG',
        link: "/lawn"
    },
    {
        name: 'Chiffon',
        link: '/chiffon',
        image: '/chiffon-collection.JPG',
    },
    {
        name: '2PC',
        link: '/2pc',
        image: '/2pc-collection.JPG',
    },
    {
        name: '3PC',
        link: '/3pc',
        image: '/3pc-collection.JPG',
    },
    {
        name: 'Bags',
        link: '/hands-bag',
        image: 'https://cdn.sanity.io/images/kb41e1az/production/b63a5bf3764dacd65840844a65bd309148a5fc1d-1204x1600.jpg',
    },
    {
        name: 'Stiched',
        image: '/stiched-collection.JPG',
        link: '/stitched',
    },
    {
        name: 'Silk',
        image: '/2pc-collection.JPG',
        link: '/silk',
    },
    {
        name: 'Organza',
        image: '/3pc-collection.JPG',
        link: '/organza',
    },
];

export default function HandcraftedCategories() {
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateArrows = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();
        const el = carouselRef.current;
        if (!el) return;
        // Recompute when layout/resize changes.
        const ro = new ResizeObserver(updateArrows);
        ro.observe(el);
        window.addEventListener('resize', updateArrows);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateArrows);
        };
    }, [updateArrows]);

    const scrollByCard = (dir) => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = (el.querySelector('.category-item')?.getBoundingClientRect().width || 160) + 16;
        el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    return (
        <section className="p-1 px-0 max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="font-[600] !text-black text-[1.12rem] md:text-[1.4rem] mb-2 leading-tight">Popular Categories</h2>
                    <p className="text-label-md font-label-md text-on-surface-variant tracking-widest uppercase mt-2">
                        Explore Our Signature Style
                    </p>
                </div>

                {/* Arrows – desktop only, shown when content overflows */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Scroll categories left"
                        disabled={!canScrollLeft}
                        onClick={() => scrollByCard(-1)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
                            canScrollLeft
                                ? 'border-secondary/30 text-primary hover:bg-secondary hover:text-white cursor-pointer'
                                : 'border-secondary/10 text-on-surface-variant/30 cursor-not-allowed'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Scroll categories right"
                        disabled={!canScrollRight}
                        onClick={() => scrollByCard(1)}
                        className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
                            canScrollRight
                                ? 'border-secondary/30 text-primary hover:bg-secondary hover:text-white cursor-pointer'
                                : 'border-secondary/10 text-on-surface-variant/30 cursor-not-allowed'
                        }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div ref={carouselRef} onScroll={updateArrows} className="overflow-x-auto no-scrollbar">
                <div className="relative group">
                    {/* 2-row grid with horizontal scroll */}
                    {/* don't need full width */}
                    <div
                        id="category-carousel"
                        className="grid md:grid-rows-1 grid-rows-2 grid-flow-col inline-grid gap-4 w-auto overflow-x-auto no-scrollbar pb-4 scroll-smooth carousel-container"
                    >                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                className="category-item w-36 group/cat text-center overflow-hidden rounded-full select-none"
                                href={`/collection/${cat.link.toLowerCase().replace(/^\//, '').replace(/\s+/g, '-')}`}
                            >
                                <div className="relative aspect-square rounded-[50%] overflow-hidden border border-secondary/20 transition-all duration-500 group-hover/cat:border-secondary shadow-sm">
                                    <Image
                                        alt={cat.name}
                                        className="w-full rounded-full overflow-hidden h-full object-cover"
                                        src={cat.image}
                                        width={160}
                                        height={160}
                                        draggable={false}
                                    />
                                </div>
                                <h3 className="text-xs mt-3 font-bold uppercase tracking-widest text-primary">
                                    {cat.name}
                                </h3>
                            </Link>
                        ))}
                    </div>


                </div>
            </div>
        </section>
    );
}