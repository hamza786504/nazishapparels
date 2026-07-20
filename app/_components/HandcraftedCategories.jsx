'use client'
import Link from 'next/link';
import Image from 'next/image';

// components/HandcraftedCategories.jsx
const categories = [
    {
        name: 'New Arrivals',
        //  image:
            //  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwHhdg66Yq_NMjsR6kN6j8AfUsr_XOMnrg83jzZk6f72hed8JY1f-vLfZQAg6gjt7hT9L9YPeSOJcOIiMd8Kegz2k9TkwgtqPCUsQgUeEF8JkMM3r6ZMMRg_zxDC-_pmgci6s4U-Ycj7ggYcMUbacTTCGJyN9z1_2G2aWxS2JpDglOKM41vEYTramXOIKpkTVhWbvIuegw1kk3V3C9wjCz34fICWnUedCS-K-TMebrNsJXKTWlhh2X1RPt4_lpZ85_h8iofyk8mADG',
        image: '/newarrivals-collection.jpg',
        link: "/newsarrivals"
    },
    {
        name: 'Lawn',
        // image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB5_nbeSUuvzHimPlmt_cFINZO84DWow_zEg7MJm_BQQbTjjhy7F03EhL-7bgSuwtjSfSSHsDxZEHRFb-Xaotz6gxraZtv0D4M9Q1F4MvDi2IbE1V-hZxQqbdA7JRa0yWCYwseh3Nfp7kFBh15ZQcEHjwmK6rHSKnDBPHYErlBzTUaVMno9cPvZfsCNtBW0K1LlglV2797B7u8cmb7nEScTag_M8BuWtRSmxM7DVfuqT7V2Plwk2_h5b5vCr7EMfbl-k66ai8j8LYR',
        image: '/lawn-collection.jpg',
        link: "/lawn"
    },
    {
        name: 'Chiffon',
        link: '/chiffon',
        // image:
        //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
        image:
            '/chiffon-collection.jpg',
    },
       {
        name: '2PC',
        link: '/2pc',
        // image:
        //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
        image:
            '/2pc-collection.jpg',
    },
       {
        name: '3PC',
        link: '/3pc',
        // image:
        //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
        image:
            '/3pc-collection.jpg',
    },
    
    {
        name: 'Stiched',
        image: '/stiched-collection.jpg',
        link: '/stitched',
    },
];

export default function HandcraftedCategories() {
    return (
        <section className="p-1 max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="font-bold text-headline-lg font-headline-lg">Popular Categories</h2>
                    <p className="text-label-md font-label-md text-on-surface-variant tracking-widest uppercase mt-2">
                        Explore Our Signature Style
                    </p>
                </div>
            </div>

            <div className="relative group">
                <div id="category-carousel" className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth carousel-container md:justify-center md:flex-wrap md:overflow-hidden touch-pan-x">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            className="flex-none w-32 group/cat text-center rounded-full md:w-40 select-none"
                            href={`/collection/${cat.link.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <div className="relative aspect-square rounded-full overflow-hidden border border-secondary/20 transition-all duration-500 group-hover/cat:scale-105 group-hover/cat:border-secondary shadow-sm">
                                <Image
                                    alt={cat.name}
                                    className="w-full rounded-full h-full object-cover"
                                    src={cat.image}
                                    width={160}
                                    height={160}
                                    draggable={false}
                                />
                            </div>
                            <h3 className="text-xs mt-3 font-headline-sm uppercase tracking-widest text-primary">
                                {cat.name}
                            </h3>
                        </Link>
                    ))}
                </div>

                {/* Minimalist Controls (mobile only) */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
                    <button
                        className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white shadow-md text-primary hover:bg-secondary hover:text-white transition-all rounded-full"
                        onClick={() => {
                            const el = document.getElementById('category-carousel');
                            if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white shadow-md text-primary hover:bg-secondary hover:text-white transition-all rounded-full"
                        onClick={() => {
                            const el = document.getElementById('category-carousel');
                            if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        </section>
    );
}