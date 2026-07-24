'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CategorySidebar({ activeSlug, initialCollections = null }) {
    const pathname = usePathname();
    const [collections, setCollections] = useState(initialCollections || []);
    const [loading, setLoading] = useState(!initialCollections);

    const active = activeSlug || pathname.split('/').pop() || '';

    useEffect(() => {
        if (initialCollections) return;
        fetch('/api/collections')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setCollections(data.collections || []);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [initialCollections]);

    // Top virtual collections
    const topItems = [
        { slug: 'new-arrivals', name: 'New Arrivals' },
    ];

    return (
        <nav className="bg-white min-h-full ps-4 pt-4 py-2 text-sm font-sans sidebar-scroll">
            <style jsx>{`
                .sidebar-scroll::-webkit-scrollbar {
                    width: 10px !important;
                }

                /* Track */
                .sidebar-scroll::-webkit-scrollbar-track {
                    background: #f1f1f1 !important;
                    }
                    
                /* Handle */
                .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: #888 !important;
                    border-radius: 10px;
                }

                /* Handle on hover */
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: #555 !important;
                }

                .sidebar-scroll {
                    max-height: calc(100vh - 100px);
                    overflow-y: auto;
                }
            `}</style>

            {loading ? (
                <div className="space-y-3 px-1">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-6 bg-white animate-pulse rounded" />
                    ))}
                </div>
            ) : (
                <div className="space-y-0">
                    {/* Top items */}
                    {topItems.map((item) => {
                        const isActive = active === item.slug;
                        return (
                            <Link
                                key={item.slug}
                                href={`/collection/${item.slug}`}
                                className={`flex items-center justify-between py-2 pl-5 pr-2.5 rounded-lg text-base font-medium transition-colors ${
                                    isActive
                                        ? 'font-bold text-black bg-white'
                                        : 'text-gray-800'
                                }`}
                            >
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Database Collections */}
                    {collections.length > 0 ? (
                        <div className="pt-0">
                            <div className="space-y-0.5 mt-0">
                                {collections.map((cat) => {
                                    const isActive = active === cat.slug;
                                    return (
                                        <Link
                                            key={cat._id || cat.slug}
                                            href={`/collection/${cat.slug}`}
                                            className={`flex items-center justify-between py-2 pl-5 pr-2.5 rounded-lg text-base font-medium transition-colors ${
                                                isActive
                                                    ? 'font-bold text-black bg-gray-100'
                                                    : 'text-gray-800 '
                                            }`}
                                        >
                                            <span className="capitalize">{cat.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        ''
                    )}

                

                </div>
            )}
        </nav>
    );
}