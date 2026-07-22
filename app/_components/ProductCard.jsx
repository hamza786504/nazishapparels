// components/ProductCard.jsx
'use client';

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "../store/cartContext"
import { useFavorites } from "../store/favoritesContext"
import { Star, Heart, ShoppingBag, Play, Zap } from "lucide-react"

// ── Helper to resolve product review rating & count from database ─────────────
function getRatingData(reviewAvg, reviewCount) {
    const avgNum = Number(reviewAvg) || 0;
    const countNum = Number(reviewCount) || 0;

    return {
        avg: avgNum > 0 ? avgNum.toFixed(1) : "0.0",
        count: countNum > 999 ? '1k+' : `${countNum}`
    };
}

export default function ProductCard({
    id,
    title,
    price,
    priceNumeric,
    compareAtPrice,
    image,
    type,
    brand = "",
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

    const handleQuickAdd = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
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

    // Price displays
    const displayPrice = typeof price === 'number'
        ? `PKR ${price.toLocaleString()}`
        : price
            ? (String(price).startsWith('PKR') ? price : `PKR ${price}`)
            : saleNum ? `PKR ${saleNum.toLocaleString()}` : '';

    const compareDisplay = compareNum && compareNum > saleNum
        ? `PKR ${Number(compareNum).toLocaleString()}`
        : null;

    // Display brand or fallback from type/title
    const brandName = brand || type || "Nazish";

    // Dynamic rating & review count per product from database
    const { avg: ratingVal, count: ratingCountStr } = getRatingData(reviewAvg, reviewCount);

    return (
        <div className="product-card group cursor-pointer block">
            {/* ── Image container ──────────────────────────────────────────── */}
            <div
                className="relative overflow-hidden rounded-xl bg-gray-100"
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

                {/* Discount badge — bottom-left pill */}
                {discountPct && (
                    <div className="absolute bottom-2.5 left-2.5 md:bottom-3 md:left-3 z-10 bg-[#e52e2e] text-white text-xs font-semibold px-2 py-2 rounded-md leading-none select-none shadow-sm">
                        UpTo - {discountPct}% OFF
                    </div>
                )}

                {/* Wishlist heart — top-right */}
                <button
                    type="button"
                    aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
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
                    className="absolute top-2.5 right-2.5 z-10 p-1 rounded-full text-white drop-shadow-md hover:scale-110 transition-transform"
                >
                    <Heart
                        className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-white stroke-[2.2]'}`}
                    />
                </button>

                
            </div>

            {/* ── Info area ────────────────────────────────────────────────── */}
            <div className="mt-2.5 flex flex-col px-0.5">
                {/* Price Row + Cart Button */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                        <span className={`text-base sm:text-[17px] font-bold leading-tight ${discountPct ? 'text-[#d32f2f]' : 'text-gray-900'}`}>
                            {displayPrice}
                        </span>
                        {compareDisplay && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through mt-0.5">
                                {compareDisplay}
                            </span>
                        )}
                    </div>

                    {/* Circular Add to Cart Button */}
                    <button
                        type="button"
                        aria-label="Add to cart"
                        onClick={handleQuickAdd}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${justAdded
                                ? 'bg-black text-white border-black'
                                : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-black bg-white shadow-xs'
                            }`}
                    >
                        {justAdded ? (
                            <span className="text-xs font-bold">✓</span>
                        ) : (
                            <ShoppingBag className="w-4 h-4 stroke-[2]" />
                        )}
                    </button>
                </div>

                {/* Brand • Title */}
                <Link href={`/product/${slug}`} className="mt-1">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-1">
                        {brandName} <span className="text-gray-400">•</span> {title}
                    </p>
                </Link>

                {/* Express & Rating Badges */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {/* Express Badge */}
                    <div className="bg-[#0066ff] text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 leading-tight select-none">
                        <Zap className="w-3 h-3 fill-white text-white italic" />
                        <span>Express</span>
                    </div>

                    {/* Rating Badge */}
                    <div className="bg-[#fff8e1] text-gray-800 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200/60 leading-tight select-none">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{ratingVal} ({ratingCountStr})</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

