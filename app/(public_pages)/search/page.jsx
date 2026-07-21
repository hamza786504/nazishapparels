'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../_components/ProductCard';
import { Search, X } from 'lucide-react';

const PAGE_SIZE = 20;

function mapProduct(p) {
  return {
    id: p._id,
    _id: p._id,
    title: p.title,
    slug: p.slug,
    price: `PKR ${Number(p.price).toLocaleString()}`,
    priceNumeric: p.price,
    type: p.productType || 'Product',
    sizes: p.sizes || [],
    colors: p.colors || [],
    createdAt: p.createdAt,
    primaryImage:
      p.images?.[0] ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=700&fit=crop',
  };
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery    = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [inputValue, setInputValue]   = useState(initialQuery);
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal]             = useState(0);
  const [offset, setOffset]           = useState(0);
  const [hasMore, setHasMore]         = useState(false);
  const [searched, setSearched]       = useState(false); // have we ever fired a search?
  const sentinelRef = useRef(null);
  const currentQueryRef = useRef('');

  // ── Core fetch ───────────────────────────────────────────────────────────────
  const doSearch = useCallback(async (q, cat, freshStart = true) => {
    if (!q.trim()) return;

    const currentOffset = freshStart ? 0 : offset;
    if (freshStart) {
      setLoading(true);
      setProducts([]);
      setOffset(0);
      setHasMore(false);
    } else {
      setLoadingMore(true);
    }

    const params = new URLSearchParams({
      q,
      status: 'active',
      limit: PAGE_SIZE,
      offset: currentOffset,
    });
    if (cat) params.set('category', cat);

    try {
      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        const mapped = data.products.map(mapProduct);
        setProducts((prev) => (freshStart ? mapped : [...prev, ...mapped]));
        setTotal(data.pagination?.total ?? data.products.length);
        setHasMore(data.pagination?.hasMore ?? false);
        setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (err) {
      console.error('[search] fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSearched(true);
    }
  }, [offset]);

  // ── Fire search when URL query changes (user navigated from navbar) ───────────
  useEffect(() => {
    const q   = searchParams.get('q')   || '';
    const cat = searchParams.get('category') || '';
    setInputValue(q);
    currentQueryRef.current = q;
    if (q.trim()) {
      doSearch(q, cat, true);
    } else {
      setProducts([]);
      setSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Infinite scroll sentinel ─────────────────────────────────────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const q   = searchParams.get('q')        || '';
          const cat = searchParams.get('category') || '';
          doSearch(q, cat, false);
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, doSearch, searchParams]);

  // ── Search from the page's own input (re-navigate to update URL) ──────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const cat = searchParams.get('category') || '';
    const params = new URLSearchParams({ q: trimmed });
    if (cat) params.set('category', cat);
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    setInputValue('');
    setProducts([]);
    setSearched(false);
    router.push('/search');
  };

  const queryLabel = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Search hero strip ─────────────────────────────────────────────── */}
      <section className="bg-surface-container border-b border-secondary/10 py-8 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="font-display-lg text-primary mb-4 text-2xl md:text-3xl">
            {queryLabel ? (
              <>Search results for <em className="not-italic font-bold">&ldquo;{queryLabel}&rdquo;</em></>
            ) : (
              'Search Products'
            )}
          </h1>

          {/* Inline search form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-xl">
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-3 gap-2 shadow-sm focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/20 transition-all">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products, collections…"
                className="flex-1 py-2.5 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
                autoFocus
              />
              {inputValue && (
                <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Results area ──────────────────────────────────────────────────── */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">

        {/* Not yet searched */}
        {!searched && !loading && (
          <div className="text-center py-24 text-on-surface-variant">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Enter a keyword above to search products</p>
            <p className="text-sm mt-1 opacity-70">Try product names, categories, or fabric types</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-[3/4] mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            {/* Result count */}
            {total > 0 && (
              <p className="text-sm text-on-surface-variant mb-6">
                Showing <strong>{products.length}</strong> of <strong>{total}</strong> results
                {queryLabel && <> for <strong>&ldquo;{queryLabel}&rdquo;</strong></>}
              </p>
            )}

            {products.length === 0 ? (
              <div className="text-center py-24">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30 text-on-surface-variant" />
                <h2 className="text-xl font-semibold text-primary mb-2">No results found</h2>
                <p className="text-on-surface-variant text-sm mb-6">
                  We couldn&apos;t find any products matching &ldquo;{queryLabel}&rdquo;.
                  <br />Try different keywords or browse our collections.
                </p>
                <a
                  href="/collection/all"
                  className="inline-block bg-secondary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
                >
                  Browse All Products
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    title={product.title}
                    price={product.price}
                    priceNumeric={product.priceNumeric}
                    image={product.primaryImage}
                    type={product.type}
                    sizes={product.sizes}
                    colors={product.colors}
                  />
                ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="py-8 text-center">
              {loadingMore && (
                <div className="flex items-center justify-center gap-3 text-on-surface-variant">
                  <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading more…</span>
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
                  All {total} results shown
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
