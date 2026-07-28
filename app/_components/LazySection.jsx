'use client';

import { useState, useEffect, useRef } from 'react';

export default function LazySection({ children, minHeight = '250px', rootMargin = '600px 0px' }) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [isVisible, rootMargin]);

    return (
        <div ref={containerRef} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
            {isVisible ? (
                children
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50/30 rounded-2xl animate-pulse" />
            )}
        </div>
    );
}
