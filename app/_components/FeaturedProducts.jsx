'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

const PAGE_SIZE = 20;
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=700&fit=crop';

export default function FeaturedProducts({ collectionSlug, title, initialProducts = null }) {
    const mapProduct = useCallback((p) => ({
        ...p,
        displayImage: p.image || PLACEHOLDER_IMAGE,
        priceFormatted: `PKR ${Number(p.price).toLocaleString()}`,
    }), []);

    const [products, setProducts] = useState(() => initialProducts ? initialProducts.map(mapProduct) : []);
    const [loading, setLoading] = useState(!initialProducts);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(initialProducts ? initialProducts.length : 0);
    const sentinelRef = useRef(null);
    const fetched = useRef(false);
    const initialDone = useRef(!!initialProducts);

    useEffect(() => {
        if (!collectionSlug) return;
        if (initialProducts || initialDone.current) return;
        if (fetched.current) return;
        fetched.current = true;

        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/showcase?collectionSlug=${encodeURIComponent(collectionSlug)}&limit=${PAGE_SIZE}&offset=0`);
                const data = await res.json();
                if (data.success) {
                    const mapped = data.products.map(mapProduct);
                    setProducts(mapped);
                    setHasMore(data.pagination?.hasMore ?? false);
                    setOffset(PAGE_SIZE);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setHasMore(false);
            } finally {
                setLoading(false);
                initialDone.current = true;
            }
        };
        fetchProducts();
    }, [collectionSlug, initialProducts, mapProduct]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);

        try {
            const res = await fetch(`/api/showcase?collectionSlug=${encodeURIComponent(collectionSlug)}&limit=${PAGE_SIZE}&offset=${offset}`);
            const data = await res.json();
            if (data.success) {
                const mapped = data.products.map(mapProduct);
                setProducts(prev => [...prev, ...mapped]);
                setHasMore(data.pagination?.hasMore ?? false);
                setOffset(prev => prev + PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more products:', error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, offset, collectionSlug]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { rootMargin: '300px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore, hasMore]);

    if (loading) {
        return (
            <section className="py-0 max-w-container-max mx-auto">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="font-[600] !text-black text-[1.12rem] md:text-[1.4rem] mb-4 leading-tight">{title || collectionSlug}</h2>
                        <p className="text-label-md font-label-md text-on-surface-variant tracking-widest uppercase mt-2">
                            Season&apos;s Most Desired
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 gap-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-surface-container-low animate-pulse h-80 rounded" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-2 px-0 max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="font-[600] !text-black text-[1.12rem] md:text-[1.4rem] mb-0 leading-tight">{title || collectionSlug}</h2>
                    <p className="text-label-md font-label-md text-on-surface-variant tracking-widest uppercase mt-2">
                        Season&apos;s Most Desired
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5 gap-y-2">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            title={product.title}
                            price={product.priceFormatted || `PKR ${Number(product.price).toLocaleString()}`}
                            priceNumeric={typeof product.price === 'number' ? product.price : Number(product.price)}
                            compareAtPrice={product.compareAtPrice}
                            image={product.displayImage}
                            slug={product.slug}
                            type={product.type || product.productType}
                            sizes={product.sizes}
                            colors={product.colors}
                            reviewAvg={product.reviewAvg || 0}
                            reviewCount={product.reviewCount || 0}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-on-surface-variant">
                        No products found in {title || collectionSlug}
                    </p>
                )}
            </div>

            <div ref={sentinelRef} className="py-0 text-center">
                {loadingMore && (
                    <div className="flex items-center justify-center gap-3 text-on-surface-variant">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="font-label-md text-sm">Loading more products…</span>
                    </div>
                )}
            </div>
        </section>
    );
}