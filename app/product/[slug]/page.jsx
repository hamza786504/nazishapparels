'use client';

import { useState } from 'react';
// Sample product data (replace with your actual data/API call)
const productData = {
    id: 'emerald-bloom',
    title: 'Emerald Bloom Embroidered Chiffon',
    category: 'Festive Unstitched \'24',
    price: 'PKR 18,500',
    description:
        'A masterpiece of artisanal craftsmanship, the Emerald Bloom features delicate tilla work and sequins meticulously hand-laid on premium crinkle chiffon. The set includes a heavily embroidered front, luxury silk trousers, and an intricately bordered dupatta that captures the essence of contemporary heritage.',
    mainImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAXGdEpP8gsZ6a7rZpwnE36LrCvSGdZ3gRGAhPsAsaoQLMbHc3Pa8pDyJO-lGJX4qIf-k1pmnsMdd13iNDp5Hxu3xXY4ROGgjOm0fOmI7JuN-w9i50ZcCUJX6oGwfGdP3bbUJWwW2r-5XnSFGMgLd1vIchW0ea1bgaiknR1_3d5KZl6O-Z2zriGqj9O-Qq9mTodhQ7rxn01dyXoCOOosHaAsQxj1-hrrQ4EGtpRblOWJEuk3Dksp-Rq-9aS1HMlnWPCSZqK5r3okWvX',
    thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBJrcAvHYoT9Y4XYCle2l2R1R20L-QuMsDULrQn6LWLJnGnUpCKg0xi3clPMtMXedLRtWq3XFXMyy8oxzeqK4Crqayc6bMGv2-6PIXQMQnYQM-RSJzgJhs5tDSqXCPiT0jLgJONlQO_fX9CiFmtChpuNrfIKbOfrtgasFRVne5n2LGht3ms4VcfOBtt8XSkaJmfeBqUyrRkOnuPTNW9fKFx7oPLbp29TS1xoA7hWmqHQWD2YmvRbbUn9et_981JfNHkk2BbVOdajEXu',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArV46JFMI7Bfo4i6igLlxVxwOGPAaYWBzHwKuE_ErvOMVch_FB6wS2PxX2hwtVbQoSUCYZcXC7gj3HD_trIgq72fDtSp6iE_oS2G5LltPL_PQ7HbLPf3GM_HEt8hliEamUH9cz1762Gl8Y7P386QuBSgUohPHNvZEe0q5o3lhQ-Ek1A-sKmYHHECusXGE8LqpyN7-QFRr4GPIMM9hdlwLXjOnog4tVvWywTI65XhyOJtcjEAqNti0iZVncvhCKM4JfXFXmtxgisi8P',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBKVxsx6QfbiQpOZYOPaNIK16PufeEWiFSYY5uQrM3GCSvdpRIugiuNDgEeVYdC3Gse-kIYvKptg1TdRaqo7tAo_PxOiFPq50px_ZJwLSG6p2JCpVxuyMwdb7EodcwpEM6nfZs_pUfmSGGm8sTymgaauqDpRUVDcE2G7NOaq0PuovA6tqc4l91jViLS5COhWmWDR2HTRB4SOP5JaMgyALbrshQmpKuRQhe-ntAZmDAsUyPP6Ad2p42wG3MO3o2YU5db46Dr8CxzIa2S',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWvuWP2UNUQFEl05t9ApUdVBp7uduQLgXXhNxsZxIGwNqQBQrerlcHdW0qIyTeBFXEoQbp-2y4V-Q7l_x2gO9CH3RNSgg6bwekMf-C_78dwqEWByLO7rY67JIlKcjfzScwZR2s5U4M59osSXUK8BgPGxnSo9X8m1Z1d3h0CdheEL5pURWKPnHiwNTh09P_bu153TGi2N5TyLDr-NpZhuCX2JnqWfVACjowdyw-h4CRnSxqk9uGsuzbDIYSJN8PjhgNewMY-3VYl7aM',
    ],
    relatedProducts: [
        {
            id: 'r1',
            title: 'Gilded Pearl Khussa',
            price: 'PKR 4,500',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCmVxZ0wFlRaY4vTG68alnSCjY7jj6IJc4YKh6sEF9SczoOTX9O_tEVmxvG3fzIs8W2yNVUhpCgmn2VyZXpuj9LF3mB1-fvelfCQ3ELng810h-3boii6PiqTyDcEBIEoQfvdyDhsasl3ok-xkdFEid2GjPdnoRJDmXwqmrjGS7XEzCOFDb4t3pgSBvfn8SBtvQzrhmIdyneduuCY9UhP3kjNZfN6_s44l_bUcfYYLq--11PwUAH0DKiaR46WJgKpbldsqt2uQMhZUv7',
        },
        {
            id: 'r2',
            title: 'Emerald Drop Jhumkas',
            price: 'PKR 3,200',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDDvzY_rrm9g55mehAsXWpnyejnGfRI4dtaX3WDzo3ktxjCe_vIUb4q7kVs5SrSzMTd5SseeUIOQiAVnEX9SHW6GRMOrbiHXBS4UuQn2ZY86_GlFgLBMEXtVqojv_SdEa25BGwQK7ePhPFixm0eetI3fA4EoNyClHSqVnMQN5uo3-vwXQ3iRupDBV4hJGAS5tyNRxOl11zeWEZZm3Lze1JlVbYj2oS8K9l82zOUe0YoXDUFkKRRwjrf5KHKjiPBZtxZv1n7cgrXr3aI',
        },
        {
            id: 'r3',
            title: 'Silk Zardozi Potli',
            price: 'PKR 5,800',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDigYpVG3UGp_8cwV7Ae1nwL04D1U2xKur6-aIis7VIH5wmDzdUP6gn-JGYY0GoQykFT4H_knC0YBQu8AonezByMUbAhLgYR6ttWOFjqw1dMUHcldPYPrBOFgeCAYO1z-Db7JJsaKpHyeLG9-cgG2kFe4sFNh_QyXkwsk8cC2huuM0X-V7QNWYfsFYSyvjBlYhd-k8znPBf-VI02CJ9ebnSDK3txAJF5RhjxN1iRb1COPpj6FHL8d_GBDJ1f-sZP8VP3e4khiYmRDC8',
        },
        {
            id: 'r4',
            title: 'Blush Organza Wrap',
            price: 'PKR 2,900',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA1-c7XKwPJ3HuhKQwBMmXKj-b2WFC5mSQVKTAwN5rMfS__vbz9qmVTMHxGHuxw8zlfSxDrCIi6TlPzaFXkLf6QTlvbJadpRCKCzfRQLaFGLr2Gfrp4uWmbxD8ugHWSqYMNxhgDGVlOJTok0d5CyH9ys1krLEYydmr7l_v1JmdwT6E9KlCizD8ip4KQ4bpnjadVqFIF3J6ro-arYYBDpS6hq703gNRP5jmM556R5bIK7gqgOWhwZDxzqJYeQL5oBNf0xrdygoTSjThF',
        },
    ],
    colors: ['#023C32', '#4A0404', '#1A1A1A'],
    sizes: ['XS', 'S', 'M', 'L'],
};

// Mock reviews
const reviews = [
    {
        id: 1,
        name: 'Ayesha K.',
        date: 'Oct 12, 2024',
        verified: true,
        rating: 5,
        comment:
            'The embroidery on this chiffon is absolutely breathtaking. The emerald color is even richer in person. It fits perfectly and the silk trousers are so comfortable. Truly a masterpiece for the festive season.',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuArV46JFMI7Bfo4i6igLlxVxwOGPAaYWBzHwKuE_ErvOMVch_FB6wS2PxX2hwtVbQoSUCYZcXC7gj3HD_trIgq72fDtSp6iE_oS2G5LltPL_PQ7HbLPf3GM_HEt8hliEamUH9cz1762Gl8Y7P386QuBSgUohPHNvZEe0q5o3lhQ-Ek1A-sKmYHHECusXGE8LqpyN7-QFRr4GPIMM9hdlwLXjOnog4tVvWywTI65XhyOJtcjEAqNti0iZVncvhCKM4JfXFXmtxgisi8P',
        helpful: 12,
    },
    {
        id: 2,
        name: 'Zainab M.',
        date: 'Sep 28, 2024',
        verified: true,
        rating: 5,
        comment:
            'Exceeded my expectations. The crinkle chiffon is high quality and the tilla work doesn\'t scratch at all. Shipping was very fast too.',
        helpful: 4,
    },
];

export default function ProductPage() {
    const [mainImage, setMainImage] = useState(productData.mainImage);
    const [activeThumb, setActiveThumb] = useState(0);
    const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
    const [selectedSize, setSelectedSize] = useState(productData.sizes[1]); // S
    const [accordionOpen, setAccordionOpen] = useState(null); // null or index
    const [isAddingToBag, setIsAddingToBag] = useState(false);
    const [bagAdded, setBagAdded] = useState(false);

    // Thumbnail click handler
    const handleThumbClick = (src, index) => {
        setMainImage(src);
        setActiveThumb(index);
    };

    // Accordion toggle
    const toggleAccordion = (index) => {
        setAccordionOpen(accordionOpen === index ? null : index);
    };

    // Add to bag
    const handleAddToBag = () => {
        setIsAddingToBag(true);
        setTimeout(() => {
            setIsAddingToBag(false);
            setBagAdded(true);
            setTimeout(() => {
                setBagAdded(false);
            }, 2000);
        }, 1000);
    };

    return (
        <>
            <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                    {/* Image Gallery Section */}
                    <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
                        <div className="flex-1 relative aspect-[3/4] overflow-hidden  group image-zoom">
                            <img
                                src={mainImage}
                                alt="Main Product View"
                                className="w-full h-[580px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="text-label-sm text-primary uppercase tracking-widest">New Arrival</span>
                            </div>
                        </div>
                        <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-24 shrink-0">
                            {productData.thumbnails.map((thumb, idx) => (
                                <button
                                    key={idx}
                                    className={`aspect-[3/4] w-20 md:w-full shrink-0 overflow-hidden bg-surface-container transition-colors ${
                                        activeThumb === idx
                                            ? 'border-2 border-secondary'
                                            : 'border border-outline-variant hover:border-secondary'
                                    }`}
                                    onClick={() => handleThumbClick(thumb, idx)}
                                >
                                    <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Information Section */}
                    <div className="lg:col-span-5 flex flex-col gap-8 fade-in">
                        <header className="flex flex-col gap-2">
                            <p className="text-label-md text-secondary uppercase tracking-[0.2em]">{productData.category}</p>
                            <h1 className="font-headline-md text-display-lg-mobile md:text-headline-md text-primary leading-tight">
                                {productData.title}
                            </h1>
                            <p className="text-headline-sm font-headline-sm text-secondary">{productData.price}</p>
                        </header>

                        <div className="flex flex-col gap-6">
                            <p className="text-body-md text-on-surface-variant leading-relaxed">{productData.description}</p>

                            {/* Color */}
                            <div className="flex flex-col gap-3">
                                <span className="text-label-md text-primary uppercase">
                                    Select Color: <span className="font-normal text-on-surface-variant">Deep Emerald</span>
                                </span>
                                <div className="flex gap-4">
                                    {productData.colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                selectedColor === color
                                                    ? 'border-secondary ring-2 ring-offset-2 ring-transparent'
                                                    : 'border-outline-variant hover:border-secondary'
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-label-md text-primary uppercase">Select Size</span>
                                    <button className="text-label-sm text-secondary underline underline-offset-4 uppercase">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {productData.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`py-3 text-label-md text-primary transition-all ${
                                                selectedSize === size
                                                    ? 'border-2 border-secondary bg-surface-container font-bold'
                                                    : 'border border-outline-variant hover:border-secondary hover:bg-surface-container'
                                            }`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col gap-4 pt-4">
                                <button
                                    className={`cursor-pointer w-full py-5 text-white font-label-md uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2 border border-secondary ${
                                        bagAdded ? 'bg-secondary' : 'bg-primary hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                    onClick={handleAddToBag}
                                    disabled={isAddingToBag}
                                >
                                    {isAddingToBag ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            Adding...
                                        </>
                                    ) : bagAdded ? (
                                        <>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button className="cursor-pointer w-full py-5 border border-secondary text-primary font-label-md uppercase tracking-widest hover:bg-surface-container-low transition-all">
                                    Buy Now
                                </button>
                            </div>

                            {/* Accordion Specs */}
                            <div className="flex flex-col border-t border-outline-variant mt-8">
                                {['Product Details', 'Care Instructions', 'Shipping & Returns'].map((label, idx) => {
                                    const content = [
                                        <div key="details" className="pb-6 text-body-md text-on-surface-variant flex flex-col gap-2">
                                            <p>• Embroidered Chiffon Front (1.25m)</p>
                                            <p>• Plain Chiffon Back (1.25m)</p>
                                            <p>• Embroidered Chiffon Sleeves (0.75m)</p>
                                            <p>• Dyed Raw Silk Trouser (2.5m)</p>
                                            <p>• Embroidered Net Dupatta (2.5m)</p>
                                        </div>,
                                        <div key="care" className="pb-6 text-body-md text-on-surface-variant">
                                            Dry clean only. Store in a cool, dry place. Avoid contact with perfume or chemicals to preserve the metallic embroidery.
                                        </div>,
                                        <div key="shipping" className="pb-6 text-body-md text-on-surface-variant">
                                            Complimentary shipping on all domestic orders above PKR 10,000. Returns accepted within 7 days in original condition.
                                        </div>,
                                    ];
                                    return (
                                        <div key={idx} className="accordion-item border-b border-outline-variant">
                                            <button
                                                className="w-full py-6 flex justify-between items-center group"
                                                onClick={() => toggleAccordion(idx)}
                                            >
                                                <span className="font-label-md text-primary uppercase">{label}</span>
                                                <span
                                                    className={`material-symbols-outlined transition-transform duration-300 ${
                                                        accordionOpen === idx ? 'rotate-180' : ''
                                                    }`}
                                                >
                                                    expand_more
                                                </span>
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-max-height duration-300 ease-out ${
                                                    accordionOpen === idx ? 'max-h-96' : 'max-h-0'
                                                }`}
                                            >
                                                {content[idx]}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <section className="mt-stack-lg border-t border-secondary/30 pt-stack-md">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-headline-md text-headline-md text-primary">Complete the Look</h2>
                            <p className="text-body-md text-on-surface-variant">Elevate your ensemble with these essentials.</p>
                        </div>
                        <a className="text-label-md text-secondary border-b border-secondary pb-1 hidden md:block" href="#">
                            View Collection
                        </a>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {productData.relatedProducts.map((item) => (
                            <div key={item.id} className="flex flex-col gap-4 group">
                                <div className="aspect-[3/4] overflow-hidden bg-surface-container relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <button className="cursor-pointer absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-2 text-label-sm text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Quick Add
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-body-md text-primary">{item.title}</h3>
                                    <p className="font-headline-sm text-secondary text-base">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="mt-stack-lg border-t border-secondary/30 pt-stack-md">
                    <div className="flex flex-col gap-12">
                        {/* Reviews Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-headline-md text-headline-md text-primary">Voices of our Community</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex text-secondary">
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                        <span className="material-symbols-outlined">star</span>
                                    </div>
                                    <span className="text-body-md text-on-surface-variant">4.9/5 based on 128 reviews</span>
                                </div>
                            </div>
                            <div className="w-full md:w-72 flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-label-sm w-4">5</span>
                                    <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full w-[92%]" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-label-sm w-4">4</span>
                                    <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full w-[6%]" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-label-sm w-4">3</span>
                                    <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full w-[2%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Write a Review Form */}
                        <div className="accordion-item border border-outline-variant/30 rounded-lg overflow-hidden">
                            <button
                                className="w-full py-6 px-6 flex justify-between items-center bg-surface-container-low group"
                                onClick={() => toggleAccordion('review-form')}
                            >
                                <span className="font-label-md text-primary uppercase tracking-widest">Share Your Experience</span>
                                <span
                                    className={`material-symbols-outlined transition-transform duration-300 ${
                                        accordionOpen === 'review-form' ? 'rotate-180' : ''
                                    }`}
                                >
                                    expand_more
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-max-height duration-300 ease-out ${
                                    accordionOpen === 'review-form' ? 'max-h-[600px]' : 'max-h-0'
                                }`}
                            >
                                <div className="p-6 flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-label-sm text-primary uppercase">Your Rating</label>
                                        <div className="flex gap-1 text-secondary">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} className="material-symbols-outlined">
                                                    star
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-label-sm text-primary uppercase">Your Review</label>
                                        <textarea
                                            className="w-full bg-transparent border border-outline-variant p-4 focus:border-secondary focus:ring-0 text-body-md min-h-[120px]"
                                            placeholder="Tell us about the fit, fabric, and feel..."
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-label-sm text-primary uppercase">Upload Photos</label>
                                        <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-secondary transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-on-surface-variant">add_a_photo</span>
                                            <span className="text-label-sm text-on-surface-variant">Drag and drop or click to upload</span>
                                        </div>
                                    </div>
                                    <button className="w-full md:w-auto px-12 py-4 bg-primary text-white font-label-md uppercase tracking-widest hover:scale-[1.02] transition-all border border-secondary">
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="flex flex-col gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="flex flex-col gap-4 pb-8 border-b border-outline-variant/30">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-label-md text-primary">{review.name}</span>
                                                {review.verified && (
                                                    <span className="flex items-center gap-1 text-[10px] bg-surface-container px-2 py-0.5 rounded-full text-secondary uppercase font-bold tracking-tighter">
                                                        <span className="material-symbols-outlined text-[12px]">verified</span>
                                                        Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex text-secondary scale-75 origin-left">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined">
                                                        {i < review.rating ? 'star' : 'star_outline'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-label-sm text-on-tertiary-container">{review.date}</span>
                                    </div>
                                    <p className="text-body-md text-on-surface-variant leading-relaxed">{review.comment}</p>
                                    {review.image && (
                                        <div className="flex gap-3">
                                            <div className="w-20 h-20 rounded overflow-hidden bg-surface-container">
                                                <img src={review.image} alt="Customer photo" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    )}
                                    <button className="flex items-center gap-2 text-label-sm text-on-surface-variant hover:text-secondary transition-colors">
                                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                                        Helpful ({review.helpful})
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}