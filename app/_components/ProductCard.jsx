// components/ProductCard.jsx
'use client';

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "../store/cartContext"
import { useFavorites } from "../store/favoritesContext"
import { Star, Heart } from "lucide-react"

// ── Star Rating display (read-only) ──────────────────────────────────────────
function StarRating({ avg = 0, count = 0 }) {
    if (!count) return null;
    const filled = Math.round(avg);
    return (
        <div className="flex items-center gap-1 mt-0.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3 h-3 ${star <= filled ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                    />
                ))}
            </div>
            <span className="text-[10px] text-gray-500 font-medium leading-none">
                {avg.toFixed(1)} <span className="text-gray-400">({count})</span>
            </span>
        </div>
    );
}

export default function ProductCard({
    id,
    title,
    price,
    priceNumeric,
    compareAtPrice,
    image,
    type,
    sizes = [],
    colors = [],
    isAccessory = false,
    slug = "",
    reviewAvg = 0,
    reviewCount = 0,
}) {
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [justAdded, setJustAdded] = useState(false);
    const favorited = isFavorite(id);

    // Product images are always full URLs (Sanity CDN), so just pass through
    const passthroughLoader = ({ src }) => src;

    const handleQuickAdd = () => {
        const numericPrice = typeof priceNumeric === 'number'
            ? priceNumeric
            : typeof price === 'number'
                ? price
                : Number(String(price).replace(/[^0-9.]/g, ''));

        addToCart(slug, sizes?.[0], colors?.[0], 1, {
            _id: id,
            title,
            price: numericPrice,
            sizes,
            colors,
            images: [image],
            productType: type,
            isAccessory,
        });

        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };

    // ── Discount percentage ────────────────────────────────────────────────────
    const compareNum = typeof compareAtPrice === 'number' ? compareAtPrice
        : typeof compareAtPrice === 'string' ? Number(String(compareAtPrice).replace(/[^0-9.]/g, ''))
        : null;

    const saleNum = typeof priceNumeric === 'number' ? priceNumeric
        : Number(String(price).replace(/[^0-9.]/g, ''));

    const discountPct = compareNum && compareNum > saleNum && saleNum > 0
        ? Math.round((1 - saleNum / compareNum) * 100)
        : null;

    // Format compare-at price for display
    const compareDisplay = compareNum && compareNum > saleNum
        ? `PKR ${Number(compareNum).toLocaleString()}`
        : null;

    return (
        <div className="overflow-hidden product-card group cursor-pointer block">
            {/* ── Image container ──────────────────────────────────────────── */}
            <div
                className="relative overflow-hidden bg-surface-container-low"
                style={{ aspectRatio: '3/4' }}
            >
                <Link href={`/product/${slug}`} className="absolute inset-0 block">
                    <Image
                        loader={passthroughLoader}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={image}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized={image.startsWith('http')}
                    />
                </Link>

                {/* Discount badge — top-left */}
                {discountPct && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm leading-tight select-none">
                        -{discountPct}%
                    </div>
                )}

                {/* Wishlist heart — top-right */}
                <button
                    type="button"
                    aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite({
                            id,
                            slug,
                            title,
                            price,
                            priceNumeric,
                            compareAtPrice,
                            image,
                            type,
                            sizes,
                            colors,
                        });
                    }}
                    className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                        favorited
                            ? 'bg-red-500 opacity-100'
                            : 'bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-white'
                    }`}
                >
                    <Heart
                        className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
                            favorited ? 'fill-white text-white scale-110' : 'text-gray-500'
                        }`}
                    />
                </button>

                {/* Quick Add — slides up on hover */}
                <button
                    type="button"
                    onClick={handleQuickAdd}
                    className="absolute bottom-0 left-0 z-10 w-full bg-primary text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 font-label-md tracking-widest text-center text-sm border-none cursor-pointer"
                >
                    {justAdded ? 'ADDED ✓' : 'QUICK ADD'}
                </button>
            </div>

            {/* ── Info area ────────────────────────────────────────────────── */}
            <div className="mt-2 md:mt-3 flex flex-col gap-0.5 px-0.5">
                {/* Product type label */}
                {type && (
                    <p className="text-[10px] sm:text-label-sm font-label-sm text-on-surface-variant/70 uppercase tracking-widest">
                        {type}
                    </p>
                )}

                {/* Title */}
                <Link
                    href={`/product/${slug}`}
                    className="text-sm md:text-base md:text-body-lg font-body-lg text-primary font-medium group-hover:text-secondary transition-colors line-clamp-2 leading-snug"
                >
                    {title}
                </Link>

                {/* Pricing row */}
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    {/* Sale price */}
                    <p className={`text-[13px] sm:text-base font-semibold ${discountPct ? 'text-red-600' : 'text-secondary'}`}>
                        {price}
                    </p>
                    {/* Strike-through original */}
                    {compareDisplay && (
                        <p className="text-[11px] sm:text-sm text-gray-400 line-through">
                            {compareDisplay}
                        </p>
                    )}
                </div>

                {/* Star rating */}
                <StarRating avg={reviewAvg} count={reviewCount} />

                {/* Sizes */}
                {sizes && sizes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {sizes.map((size) => (
                            <span
                                key={size}
                                className="text-[10px] font-label-sm font-bold text-on-surface-variant/80 border border-secondary/20 px-2 py-0.5 rounded-sm hover:border-secondary hover:text-secondary transition-colors"
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
