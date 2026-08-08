'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useSiteSettings } from '../store/siteSettingsContext';

// Product images are always full URLs (Sanity CDN), so just pass them through
// next/image's loader unchanged (same approach as ProductCard.jsx).
const passthroughLoader = ({ src }) => src;

// Defaults used when the admin hasn't saved any recentPurchase adapter config.
const DEFAULT_SETTINGS = {
  enabled: true,
  position: 'bottom-left',
  minDelaySeconds: 6,
  maxDelaySeconds: 14,
};

// Mock buyers — same Pakistani-city flavor as the rest of the site's demo data.
const MOCK_BUYERS = [
    { name: 'Ayesha K.', city: 'Lahore' },
    { name: 'Zainab M.', city: 'Karachi' },
    { name: 'Sara A.', city: 'Islamabad' },
    { name: 'Nadia H.', city: 'Lahore' },
    { name: 'Fatima R.', city: 'Rawalpindi' },
    { name: 'Mahnoor S.', city: 'Faisalabad' },
    { name: 'Hira T.', city: 'Multan' },
    { name: 'Iqra N.', city: 'Karachi' },
    { name: 'Sana J.', city: 'Peshawar' },
    { name: 'Amna Q.', city: 'Lahore' },
];

const TIME_AGO_OPTIONS = ['Just now', '2 minutes ago', '5 minutes ago', '8 minutes ago', '14 minutes ago'];

const INITIAL_DELAY_MS = 4000;
const VISIBLE_DURATION_MS = 6000;

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function RecentPurchasePopup() {
    const settings = useSiteSettings();
    // Context settings come from the server layout and can be stale (ISR /
    // unstable_cache). We verify against the live settings API on mount so a
    // just-disabled adapter stops showing immediately instead of waiting for the
    // server cache to expire.
    const contextAdapter = { ...DEFAULT_SETTINGS, ...(settings?.adapters?.recentPurchase || {}) };
    const [adapter, setAdapter] = useState(contextAdapter);
    const [products, setProducts] = useState([]);
    const [notification, setNotification] = useState(null);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/settings/general', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled && data?.success) {
                    setAdapter({ ...DEFAULT_SETTINGS, ...(data.settings?.adapters?.recentPurchase || {}) });
                }
            })
            .catch(() => {
                // Keep the context value — the API is a best-effort freshness check.
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        // Adapter is turned off — no products, no popups.
        if (!adapter.enabled) {
            setNotification(null);
            setVisible(false);
            setProducts([]);
            return () => {
                cancelled = true;
            };
        }

        fetch('/api/products?status=active')
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled && data?.success && Array.isArray(data.products)) {
                    setProducts(data.products.filter((p) => p.images?.[0]));
                }
            })
            .catch(() => {
                // Non-critical decorative widget — fail silently.
            });

        return () => {
            cancelled = true;
        };
    }, [adapter.enabled]);

    useEffect(() => {
        if (products.length === 0) return undefined;

        const minGapMs = Math.max(1000, (Number(adapter.minDelaySeconds) || DEFAULT_SETTINGS.minDelaySeconds) * 1000);
        const maxGapMs = Math.max(minGapMs, (Number(adapter.maxDelaySeconds) || DEFAULT_SETTINGS.maxDelaySeconds) * 1000);

        const scheduleNext = (delay) => {
            timerRef.current = setTimeout(() => {
                const product = randomFrom(products);
                const buyer = randomFrom(MOCK_BUYERS);
                setNotification({
                    product,
                    buyer,
                    quantity: Math.floor(1 + Math.random() * 2), // 1 or 2
                    timeAgo: randomFrom(TIME_AGO_OPTIONS),
                });
                setVisible(true);

                timerRef.current = setTimeout(() => {
                    setVisible(false);
                    scheduleNext(minGapMs + Math.random() * (maxGapMs - minGapMs));
                }, VISIBLE_DURATION_MS);
            }, delay);
        };

        scheduleNext(INITIAL_DELAY_MS);

        return () => clearTimeout(timerRef.current);
    }, [products, adapter.minDelaySeconds, adapter.maxDelaySeconds]);

    if (!notification) return null;

    const { product, buyer, quantity, timeAgo } = notification;
    const positionClass = adapter.position === 'bottom-right'
        ? 'right-1'
        : 'left-1';

    return (
        <div
            className={`fixed bottom-1 ${positionClass} z-[90] w-[300px] max-w-[calc(100vw-2rem)] transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
            <div className="relative bg-white rounded-lg shadow-2xl border border-secondary/15 flex items-center gap-3 p-3 pr-5">
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    aria-label="Dismiss notification"
                    className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low transition-colors bg-transparent border-none cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                <Link href={`/product/${product.slug || product._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Image
                        loader={passthroughLoader}
                        src={product.images[0]}
                        alt={product.title}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-surface-container-low"
                    />
                    <div className="min-w-0">
                        <p className="text-[13px] leading-snug text-black">
                            <span className="font-semibold">{buyer.name}</span> from {buyer.city} purchased{' '}
                            {quantity > 1 ? `${quantity}x ` : ''}
                            <span className="font-semibold line-clamp-1">{product.title}</span>
                        </p>
                        <p className="text-[11px] text-on-surface-variant/60 mt-0.5">{timeAgo}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
