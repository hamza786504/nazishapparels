'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../../_components/ProductCard';
import CategorySidebar from '../../../_components/CategorySidebar';
import { SlidersHorizontal, ChevronRight, ChevronLeft, ChevronDown, X, Check } from 'lucide-react';

const PAGE_SIZE = 20;

function mapProduct(p) {
    return {
        id: p._id,
        _id: p._id,
        title: p.title,
        slug: p.slug,
        price: `PKR ${Number(p.price).toLocaleString()}`,
        priceNumeric: p.price,
        compareAtPrice: p.compareAtPrice || null,
        type: p.productType || '',
        fabric: p.productType || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        inStock: p.status === 'active' || p.inStock === true,
        createdAt: p.createdAt,
        primaryImage: p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=700&fit=crop',
        reviewAvg: p.reviewAvg || 0,
        reviewCount: p.reviewCount || 0,
    };
}

// ── Price Range Popover Component ─────────────────────────────────────────────
function PriceRangeFilter({ min, max, step = 500, initialMin, initialMax, onChange, onClose }) {
    const [localMin, setLocalMin] = useState(initialMin);
    const [localMax, setLocalMax] = useState(initialMax);

    useEffect(() => { setLocalMin(initialMin); }, [initialMin]);
    useEffect(() => { setLocalMax(initialMax); }, [initialMax]);

    const handleApply = () => {
        onChange(localMin, localMax);
        onClose();
    };

    return (
        <div className="p-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 space-y-4 relative z-[999]">
            <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-gray-700">Filter by Price</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>
            <div className="relative w-full h-6 flex items-center">
                <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
                <div
                    className="absolute h-1 bg-black rounded-full"
                    style={{
                        left: `${((localMin - min) / (max - min || 1)) * 100}%`,
                        right: `${100 - ((localMax - min) / (max - min || 1)) * 100}%`,
                    }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localMin}
                    onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax - step))}
                    className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localMax}
                    onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin + step))}
                    className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                />
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                <span>PKR {localMin.toLocaleString()}</span>
                <span>PKR {localMax.toLocaleString()}</span>
            </div>
            <button onClick={handleApply} className="w-full py-2 bg-black text-white text-xs font-semibold rounded-md hover:bg-gray-800 transition">
                Apply Price
            </button>
        </div>
    );
}

// ── Main Collection Page Component ────────────────────────────────────────────
export default function CollectionPage() {
    const { slug } = useParams();

    // Products & pagination state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [collectionId, setCollectionId] = useState(undefined);

    // Track if initial load has been done
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Client-side Filter States
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('Featured');

    // Filter metadata fetched from database
    const [allTypes, setAllTypes] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [filterPriceRange, setFilterPriceRange] = useState({ min: 0, max: 10000 });

    // Popover visibility dropdown states
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Dropdown anchor positions (position:fixed coords)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const sortBtnRef = useRef(null);
    const fabricBtnRef = useRef(null);
    const priceBtnRef = useRef(null);
    const sizeBtnRef = useRef(null);

    const tagsScrollRef = useRef(null);
    const filtersScrollRef = useRef(null);
    const sentinelRef = useRef(null);

    // Ref to prevent duplicate loads
    const isLoadingRef = useRef(false);
    const loadMoreRef = useRef(false);

    // Horizontal scroll arrow visibility
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const el = filtersScrollRef.current;
        if (!el) return;
        const check = () => {
            setCanScrollLeft(el.scrollLeft > 4);
            setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        };
        check();
        el.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check);
        return () => {
            el.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };
    }, []);

    // Helper: open a dropdown and record the button's screen position
    const openDropdown = (name, btnRef) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
            return;
        }
        if (btnRef?.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setDropdownPos({ top: rect.bottom + 6, left: rect.left });
        }
        setActiveDropdown(name);
    };

    // Close dropdown on outside click
    useEffect(() => {
        if (!activeDropdown) return;
        const handler = (e) => {
            const refs = [sortBtnRef, fabricBtnRef, priceBtnRef, sizeBtnRef];
            if (refs.every(r => !r.current?.contains(e.target))) {
                // check if click is inside a dropdown panel
                const panel = document.getElementById('filter-dropdown-panel');
                if (!panel || !panel.contains(e.target)) {
                    setActiveDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [activeDropdown]);

    // Fetch filter metadata from database
    const loadFilters = useCallback(async (resolvedId) => {
        const p = new URLSearchParams();
        if (resolvedId) p.set('collectionId', resolvedId);
        try {
            const res = await fetch(`/api/products/filters?${p}`);
            const data = await res.json();
            if (data.success) {
                setAllTypes(data.filters.types);
                setAllSizes(data.filters.sizes);
                setFilterPriceRange(data.filters.priceRange);
            }
        } catch (err) {
            console.error('[collection] filter fetch error:', err);
        }
    }, []);

    // Resolve Collection ID - only once
    useEffect(() => {
        if (!slug || collectionId !== undefined) return;

        const normalizedSlug = slug.toLowerCase();

        if (normalizedSlug === 'new-arrivals' || normalizedSlug === 'all') {
            setCollectionId(null);
            return;
        }

        fetch('/api/collections')
            .then(r => r.json())
            .then(data => {
                const found = data.success
                    ? data.collections.find(c => c.slug === normalizedSlug || c.name.toLowerCase() === normalizedSlug)
                    : null;
                setCollectionId(found ? found._id : '');
            })
            .catch(() => setCollectionId(''));
    }, [slug, collectionId]);

    // Fetch initial products - only once
    const loadInitial = useCallback(async (resolvedId) => {
        // Prevent multiple simultaneous loads
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;

        setLoading(true);
        setProducts([]);
        setOffset(0);
        setHasMore(true);
        setInitialLoadDone(false);

        const p = new URLSearchParams({ limit: PAGE_SIZE, offset: 0, status: 'active' });
        if (resolvedId) p.set('collectionId', resolvedId);

        try {
            const res = await fetch(`/api/products?${p}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products.map(mapProduct));
                setTotal(data.pagination?.total ?? data.products.length);
                setHasMore(data.pagination?.hasMore ?? false);
                setOffset(PAGE_SIZE);
                setInitialLoadDone(true);
            }
        } catch (err) {
            console.error('[collection] initial fetch error:', err);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
            // Reset filters after loading
            setSelectedFabrics([]);
            setSelectedSizes([]);
            setSelectedTag(null);
            setMinPrice('');
            setMaxPrice('');
            setInStockOnly(false);
        }
    }, []);

    // Trigger initial load only when collectionId is resolved and not loaded yet
    useEffect(() => {
        if (collectionId === undefined || initialLoadDone) return;
        loadInitial(collectionId);
        loadFilters(collectionId);
    }, [collectionId, initialLoadDone, loadInitial, loadFilters]);

    // Load next page on scroll - prevent duplicate loads
    const loadMore = useCallback(async () => {
        if (isLoadingRef.current || loadMoreRef.current || loadingMore || !hasMore || collectionId === undefined) return;
        loadMoreRef.current = true;
        setLoadingMore(true);

        const p = new URLSearchParams({ limit: PAGE_SIZE, offset, status: 'active' });
        if (collectionId) p.set('collectionId', collectionId);

        try {
            const res = await fetch(`/api/products?${p}`);
            const data = await res.json();
            if (data.success) {
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    return [...prev, ...data.products.map(mapProduct).filter(p => !existingIds.has(p.id))];
                });
                setHasMore(data.pagination?.hasMore ?? false);
                setOffset(prev => prev + PAGE_SIZE);
            }
        } catch (err) {
            console.error('[collection] loadMore error:', err);
        } finally {
            setLoadingMore(false);
            loadMoreRef.current = false;
        }
    }, [loadingMore, hasMore, offset, collectionId]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && !loadMoreRef.current) {
                    loadMore();
                }
            },
            { rootMargin: '300px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore, hasMore, loadingMore]);

    // Client Filter Logic
    const availableFabrics = allTypes;
    const availableSizes = allSizes;
    const priceBounds = filterPriceRange;

    const minPriceVal = minPrice !== '' ? Number(minPrice) : priceBounds.min;
    const maxPriceVal = maxPrice !== '' ? Number(maxPrice) : priceBounds.max;
    const minActive = minPrice !== '' && minPriceVal > priceBounds.min;
    const maxActive = maxPrice !== '' && maxPriceVal < priceBounds.max;

    const toggleFabric = (f) => setSelectedFabrics(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    const toggleSize = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (inStockOnly && !p.inStock) return false;
            if (selectedTag && !p.title.toLowerCase().includes(selectedTag.toLowerCase()) && p.type.toLowerCase() !== selectedTag.toLowerCase()) return false;
            if (selectedFabrics.length > 0 && !selectedFabrics.includes(p.fabric)) return false;
            if (selectedSizes.length > 0 && !p.sizes.some(s => selectedSizes.includes(s))) return false;
            if (minActive && p.priceNumeric < minPriceVal) return false;
            if (maxActive && p.priceNumeric > maxPriceVal) return false;
            return true;
        });
    }, [products, inStockOnly, selectedTag, selectedFabrics, selectedSizes, minActive, maxActive, minPriceVal, maxPriceVal]);

    const sortedProducts = useMemo(() => {
        const arr = [...filteredProducts];
        if (sortBy === 'Price: Low to High') arr.sort((a, b) => a.priceNumeric - b.priceNumeric);
        else if (sortBy === 'Price: High to Low') arr.sort((a, b) => b.priceNumeric - a.priceNumeric);
        else arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return arr;
    }, [filteredProducts, sortBy]);

    const resetFilters = () => {
        setSelectedFabrics([]);
        setSelectedSizes([]);
        setSelectedTag(null);
        setMinPrice('');
        setMaxPrice('');
        setInStockOnly(false);
        setSortBy('Featured');
    };

    const activeFiltersCount = selectedFabrics.length + selectedSizes.length + (minActive ? 1 : 0) + (maxActive ? 1 : 0) + (inStockOnly ? 1 : 0) + (selectedTag ? 1 : 0);

    const collectionTitle = slug ? slug.replace(/-/g, ' ') : 'Collection';

    const scrollHorizontally = (ref, distance) => {
        if (ref.current) ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    };

    return (
        <>
            {/* ── Right Content Area - scrollable ──────────────────────── */}
            <main className="flex-1 min-w-0 overflow-y-auto px-2 md:px-6 pb-8">

                {/* Header */}
                <div className="flex flex-row items-center justify-between md:flex-col md:justify-start md:items-start mb-0 md:mb-6 pt-1 md:pt-4">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 capitalize tracking-tight">
                        {collectionTitle}
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
                        {total.toLocaleString()} Items
                    </p>
                </div>

                {/* Horizontal Filter Bar - Sticky within scroll container */}
                <div className="sticky top-0 bg-white z-40">
                    <div className="relative flex items-center gap-3 border-y border-gray-100 py mb-0 md:mb-6">
                        {canScrollLeft && (
                            <button
                                type="button"
                                onClick={() => scrollHorizontally(filtersScrollRef, -150)}
                                className="w-7 h-7 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-gray-500 hover:text-black shrink-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        )}
                        <div
                            ref={filtersScrollRef}
                            className="flex items-center gap-3 py-1 scroll-smooth flex-1 overflow-x-auto no-scrollbar"
                        >
                           
                            {/* Sort By Dropdown */}
                            <div className="shrink-0">
                                <button
                                    ref={sortBtnRef}
                                    type="button"
                                    onClick={() => openDropdown('sort', sortBtnRef)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-black whitespace-nowrap"
                                >
                                    <span>Sort By: <span className="text-black font-bold">{sortBy}</span></span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            </div>

                            {/* In-Stock Toggle Pill */}
                            <button
                                type="button"
                                onClick={() => setInStockOnly(!inStockOnly)}
                                className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-xs font-semibold shrink-0 transition-colors whitespace-nowrap ${inStockOnly ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'
                                    }`}
                            >
                                <span>In-stock</span>
                                <span className={`w-3.5 h-3.5 rounded-full border transition-all ${inStockOnly ? 'bg-white border-white' : 'border-gray-400 bg-transparent'}`} />
                            </button>

                            {/* Type Dropdown */}
                            {availableFabrics.length > 0 && (
                                <div className="shrink-0">
                                    <button
                                        ref={fabricBtnRef}
                                        type="button"
                                        onClick={() => openDropdown('fabric', fabricBtnRef)}
                                        className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-xs font-semibold whitespace-nowrap ${selectedFabrics.length > 0 ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'
                                            }`}
                                    >
                                        <span>Type {selectedFabrics.length > 0 && `(${selectedFabrics.length})`}</span>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* Price Dropdown */}
                            <div className="shrink-0">
                                <button
                                    ref={priceBtnRef}
                                    type="button"
                                    onClick={() => openDropdown('price', priceBtnRef)}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-xs font-semibold whitespace-nowrap ${minActive || maxActive ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'
                                        }`}
                                >
                                    <span>Price</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Size Dropdown */}
                            {availableSizes.length > 0 && (
                                <div className="shrink-0">
                                    <button
                                        ref={sizeBtnRef}
                                        type="button"
                                        onClick={() => openDropdown('size', sizeBtnRef)}
                                        className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-xs font-semibold whitespace-nowrap ${selectedSizes.length > 0 ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'
                                            }`}
                                    >
                                        <span>Size {selectedSizes.length > 0 && `(${selectedSizes.length})`}</span>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {canScrollRight && (
                            <button
                                type="button"
                                onClick={() => scrollHorizontally(filtersScrollRef, 150)}
                                className="w-7 h-7 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-gray-500 hover:text-black shrink-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Active Filters Bar */}
                    {activeFiltersCount > 0 && (
                        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
                            <span className="text-xs text-gray-500 font-semibold mr-1">Active Filters:</span>
                            {selectedTag && (
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-black px-2.5 py-1 rounded-md text-xs font-semibold">
                                    Tag: {selectedTag}
                                    <button onClick={() => setSelectedTag(null)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedFabrics.map(f => (
                                <span key={f} className="inline-flex items-center gap-1.5 bg-gray-100 text-black px-2.5 py-1 rounded-md text-xs font-semibold">
                                    {f}
                                    <button onClick={() => toggleFabric(f)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {selectedSizes.map(s => (
                                <span key={s} className="inline-flex items-center gap-1.5 bg-gray-100 text-black px-2.5 py-1 rounded-md text-xs font-semibold">
                                    Size: {s}
                                    <button onClick={() => toggleSize(s)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {inStockOnly && (
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-black px-2.5 py-1 rounded-md text-xs font-semibold">
                                    In Stock
                                    <button onClick={() => setInStockOnly(false)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {(minActive || maxActive) && (
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-black px-2.5 py-1 rounded-md text-xs font-semibold">
                                    Price: PKR {minPriceVal.toLocaleString()} - PKR {maxPriceVal.toLocaleString()}
                                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            <button onClick={resetFilters} className="text-xs text-red-600 hover:underline font-semibold ml-2">
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Product Grid ─────────────────────────────── */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-3">
                                <div className="bg-gray-200 aspect-[3/4] rounded-xl" />
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Products Found</h3>
                        <p className="text-xs text-gray-500 mb-4">Try clearing your filters to see more results.</p>
                        <button onClick={resetFilters} className="px-5 py-2 bg-black text-white rounded-lg text-xs font-semibold">
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                slug={product.slug}
                                title={product.title}
                                price={product.price}
                                priceNumeric={product.priceNumeric}
                                compareAtPrice={product.compareAtPrice}
                                image={product.primaryImage}
                                type={product.type}
                                sizes={product.sizes}
                                colors={product.colors}
                                reviewAvg={product.reviewAvg}
                                reviewCount={product.reviewCount}
                            />
                        ))}
                    </div>
                )}

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="py-12 text-center">
                    {loadingMore && (
                        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Loading more items…</span>
                        </div>
                    )}
                    {!hasMore && products.length > 0 && (
                        <p className="text-xs text-gray-400 font-medium">
                            Showing all {sortedProducts.length} items
                        </p>
                    )}
                </div>

            </main>

            {/* ── Fixed-position Dropdown Panels ─────────────────────────────────
                Rendered outside the overflow-x-auto scroll container so they
                are never clipped. Position is calculated from the trigger
                button's getBoundingClientRect() each time a dropdown opens.
            ─────────────────────────────────────────────────────────────────── */}
            {activeDropdown && (
                <div
                    id="filter-dropdown-panel"
                    style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
                >
                    {/* Sort By Panel */}
                    {activeDropdown === 'sort' && (
                        <div className="w-48 bg-white border border-gray-100 rounded-xl shadow-2xl p-1">
                            {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setSortBy(opt); setActiveDropdown(null); }}
                                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between ${sortBy === opt ? 'bg-gray-100 text-black font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span>{opt}</span>
                                    {sortBy === opt && <Check className="w-3.5 h-3.5 text-black" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Type / Fabric Panel */}
                    {activeDropdown === 'fabric' && (
                        <div className="w-52 bg-white border border-gray-100 rounded-xl shadow-2xl p-3 space-y-2 max-h-60 overflow-y-auto">
                            {availableFabrics.map((f) => (
                                <label key={f} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer hover:text-black">
                                    <input
                                        type="checkbox"
                                        checked={selectedFabrics.includes(f)}
                                        onChange={() => toggleFabric(f)}
                                        className="rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span>{f}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Price Panel */}
                    {activeDropdown === 'price' && (
                        <PriceRangeFilter
                            min={priceBounds.min}
                            max={priceBounds.max}
                            initialMin={minPriceVal}
                            initialMax={maxPriceVal}
                            onChange={(a, b) => { setMinPrice(a); setMaxPrice(b); }}
                            onClose={() => setActiveDropdown(null)}
                        />
                    )}

                    {/* Size Panel */}
                    {activeDropdown === 'size' && (
                        <div className="w-52 bg-white border border-gray-100 rounded-xl shadow-2xl p-3 flex flex-wrap gap-2">
                            {availableSizes.map((sz) => (
                                <button
                                    key={sz}
                                    type="button"
                                    onClick={() => toggleSize(sz)}
                                    className={`px-3 py-1.5 border text-xs font-semibold rounded-md transition ${selectedSizes.includes(sz) ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700 hover:border-black'}`}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>

    );
}