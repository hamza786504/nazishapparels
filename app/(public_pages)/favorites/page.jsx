'use client';

import { useFavorites } from '../../store/favoritesContext';
import { useCart } from '../../store/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { useState } from 'react';

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, show }) {
    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-medium shadow-xl transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
            {message}
        </div>
    );
}

// ── Single wishlist item card ─────────────────────────────────────────────────
function FavoriteItem({ item, onRemove }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(item.slug, item.sizes?.[0], item.colors?.[0], 1, {
            _id: item.id,
            title: item.title,
            price: item.priceNumeric,
            sizes: item.sizes,
            colors: item.colors,
            images: [item.image],
            productType: item.type,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    // Discount badge
    const compareNum = typeof item.compareAtPrice === 'number' ? item.compareAtPrice : null;
    const saleNum = item.priceNumeric || 0;
    const discountPct = compareNum && compareNum > saleNum && saleNum > 0
        ? Math.round((1 - saleNum / compareNum) * 100)
        : null;

    return (
        <div className="group flex gap-4 p-4 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 rounded-sm">
            {/* Product image */}
            <Link href={`/product/${item.slug}`} className="relative flex-shrink-0 w-28 h-36 sm:w-32 sm:h-40 overflow-hidden bg-gray-50 rounded-sm">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={item.image?.startsWith('http')}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <PackageOpen className="w-8 h-8 text-gray-300" />
                    </div>
                )}
                {discountPct && (
                    <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                        -{discountPct}%
                    </span>
                )}
            </Link>

            {/* Product info */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                <div>
                    {item.type && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.type}</p>
                    )}
                    <Link
                        href={`/product/${item.slug}`}
                        className="text-sm sm:text-base font-medium text-gray-900 hover:text-secondary transition-colors line-clamp-2 leading-snug"
                    >
                        {item.title}
                    </Link>

                    {/* Prices */}
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-sm sm:text-base font-semibold ${discountPct ? 'text-red-600' : 'text-gray-800'}`}>
                            {item.price}
                        </span>
                        {compareNum && compareNum > saleNum && (
                            <span className="text-xs text-gray-400 line-through">
                                PKR {Number(compareNum).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Available sizes */}
                    {item.sizes && item.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {item.sizes.map((s) => (
                                <span key={s} className="text-[10px] border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded-sm">{s}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action row */}
                <div className="flex items-center gap-2 mt-3">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 border ${
                            added
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-primary text-white border-primary hover:bg-primary/90'
                        }`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {added ? 'Added!' : 'Add to Cart'}
                    </button>
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        aria-label="Remove from wishlist"
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-sm flex-shrink-0"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyWishlist() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-red-50 rounded-full" />
                <Heart className="absolute inset-0 m-auto w-10 h-10 text-red-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm max-w-[400px] mb-8">
                Save products you love by tapping the heart icon — find them here anytime.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 font-medium uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors"
            >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

// ── Main Favorites Page ───────────────────────────────────────────────────────
export default function FavoritesPage() {
    const { favorites, favoritesCount, removeFavorite, clearFavorites } = useFavorites();
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 2000);
    };

    const handleRemove = (id) => {
        removeFavorite(id);
        showToast('Removed from wishlist');
    };

    const handleClearAll = () => {
        clearFavorites();
        showToast('Wishlist cleared');
    };

    return (
        <>
            <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">

                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                            </div>
                            <p className="text-sm text-gray-500">
                                {favoritesCount === 0
                                    ? 'No saved items'
                                    : `${favoritesCount} saved item${favoritesCount !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                        {favoritesCount > 0 && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    {favoritesCount === 0 ? (
                        <EmptyWishlist />
                    ) : (
                        <>
                            {/* Items list */}
                            <div className="flex flex-col gap-3">
                                {favorites.map((item) => (
                                    <FavoriteItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </div>

                            {/* Footer CTA */}
                            <div className="mt-8 p-5 bg-white border border-gray-100 rounded-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {favoritesCount} item{favoritesCount !== 1 ? 's' : ''} saved
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">Items are saved locally on this device</p>
                                    </div>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 text-sm text-secondary font-medium hover:underline underline-offset-4"
                                    >
                                        Continue Shopping
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Toast message={toast.message} show={toast.show} />
        </>
    );
}
