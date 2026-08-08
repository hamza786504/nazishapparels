'use client'
import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// components/HandcraftedCategories.jsx
const categories = [
    {
        name: 'New Arrivals',
        //  image:
        //  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwHhdg66Yq_NMjsR6kN6j8AfUsr_XOMnrg83jzZk6f72hed8JY1f-vLfZQAg6gjt7hT9L9YPeSOJcOIiMd8Kegz2k9TkwgtqPCUsQgUeEF8JkMM3r6ZMMRg_zxDC-_pmgci6s4U-Ycj7ggYcMUbacTTCGJyN9z1_2G2aWxS2JpDglOKM41vEYTramXOIKpkTVhWbvIuegw1kk3V3C9wjCz34fICWnUedCS-K-TMebrNsJXKTWlhh2X1RPt4_lpZ85_h8iofyk8mADG',
        image: '/newarrivals-collection.JPG',
        link: "/newsarrivals"
    },
    {
        name: 'Lawn',
        // image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB5_nbeSUuvzHimPlmt_cFINZO84DWow_zEg7MJm_BQQbTjjhy7F03EhL-7bgSuwtjSfSSHsDxZEHRFb-Xaotz6gxraZtv0D4M9Q1F4MvDi2IbE1V-hZxQqbdA7JRa0yWCYwseh3Nfp7kFBh15ZQcEHjwmK6rHSKnDBPHYErlBzTUaVMno9cPvZfsCNtBW0K1LlglV2797B7u8cmb7nEScTag_M8BuWtRSmxM7DVfuqT7V2Plwk2_h5b5vCr7EMfbl-k66ai8j8LYR',
        image: '/lawn-collection.JPG',
        link: "/lawn"
    },
    {
        name: 'Chiffon',
        link: '/chiffon',
        // image:
        //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
        image:
            '/chiffon-collection.JPG',
    },
    {
        name: '2PC',
        link: '/2pc',
        // image:
        //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
        image:
            '/2pc-collection.JPG',
    },
    {
        name: '3PC',
        link: '/3pc',
        // image:
        //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
        image:
            '/3pc-collection.JPG',
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
                                href={`/collection/${cat.link.toLowerCase().replace(/\s+/g, '-')}`}
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