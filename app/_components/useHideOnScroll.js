'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

function isMainScrollTarget(target) {
    if (!target) return false;
    if (target === document || target === document.scrollingElement) return true;
    if (!target.classList) return false;
    return (
        (target.classList.contains('overflow-y-auto') || target.classList.contains('overflow-auto')) &&
        target.scrollHeight > target.clientHeight + 1
    );
}

// Returns `true` when the mobile header/navs should be hidden:
// scrolling down on mobile hides them, scrolling up (or reaching the top)
// reveals them again. Always visible on desktop.
export default function useHideOnScroll() {
    const [hidden, setHidden] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        let lastY = 0;
        let lastMobile = window.innerWidth < 768;
        let ticking = false;

        const onScroll = (e) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const target = e.target;
                if (isMainScrollTarget(target)) {
                    const y = Math.max(0, target === document ? window.scrollY : target.scrollTop);
                    const mobile = window.innerWidth < 768;
                    let hide = false;
                    if (mobile && y > 20 && Math.abs(y - lastY) > 20) {
                        // Only hide while scrolling down; reveal only while scrolling back up
                        hide = y > lastY;
                    }
                    lastY = y;
                    setHidden((prev) => (prev === hide ? prev : hide));
                }
                ticking = false;
            });
        };

        // Only reset when crossing the mobile/desktop breakpoint. Mobile browsers fire
        // `resize` when the URL bar collapses while scrolling, which must NOT reveal the navs.
        const onResize = () => {
            const mobile = window.innerWidth < 768;
            if (mobile !== lastMobile) {
                lastMobile = mobile;
                setHidden(false);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll, { capture: true });
            window.removeEventListener('resize', onResize);
        };
    }, [pathname]);

    // Show the navs again when landing on a fresh page (scroll resets to top)
    useEffect(() => {
        const t = setTimeout(() => setHidden(false), 0);
        return () => clearTimeout(t);
    }, [pathname]);

    return hidden;
}
