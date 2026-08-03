'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Returns `true` when mobile header/navs should be hidden:
 *   – Scrolling DOWN → hide
 *   – Scrolling UP   → show
 *   – At the very top → always show
 * Always returns false on desktop (>= 768px).
 */
export default function useHideOnScroll() {
    const [hidden, setHidden] = useState(false);
    const pathname = usePathname();
    const s = useRef({ lastY: 0, ticking: false, prevWidth: 0 });

    useEffect(() => {
        const state = s.current;
        state.lastY = 0;
        state.ticking = false;
        state.prevWidth = window.innerWidth;

        // ── Core direction logic ───────────────────────────────────────────────
        const process = (y) => {
            const clamped = Math.max(0, y);
            if (clamped <= 15) {
                // Near the very top → always visible
                setHidden(false);
            } else {
                const delta = clamped - state.lastY;
                if (delta > 4) {
                    setHidden(true);       // scrolling down → hide
                } else if (delta < -4) {
                    setHidden(false);      // scrolling up   → show
                }
                // |delta| ≤ 4  →  ignore micro-jitter, keep current state
            }
            state.lastY = clamped;
        };

        // ── Scroll handler ─────────────────────────────────────────────────────
        const onScroll = (e) => {
            // Skip on desktop
            if (window.innerWidth >= 768) return;
            // One RAF at a time
            if (state.ticking) return;
            state.ticking = true;

            // Capture target reference BEFORE the async RAF
            const target = e ? e.target : null;

            requestAnimationFrame(() => {
                state.ticking = false;

                let y = null;

                // Case 1: document / document-level scroll
                if (
                    !target ||
                    target === document ||
                    target === document.documentElement ||
                    target === document.body ||
                    target === document.scrollingElement
                ) {
                    y = window.scrollY ?? document.documentElement.scrollTop ?? 0;
                } else {
                    // Case 2: overflow container scroll.
                    // Use getComputedStyle (reliable regardless of CSS source).
                    // Only react to elements > 200 px tall to skip tiny dropdowns.
                    const style = window.getComputedStyle(target);
                    const oy = style.overflowY;
                    if ((oy === 'auto' || oy === 'scroll') && target.clientHeight > 200) {
                        y = target.scrollTop;
                    }
                }

                if (y !== null) process(y);
            });
        };

        // ── Resize: only reset on true mobile↔desktop crossing ────────────────
        // Mobile browsers fire resize when the URL bar hides/shows — ignore those.
        const onResize = () => {
            const w = window.innerWidth;
            const wasMobile = state.prevWidth < 768;
            const isMobile  = w < 768;
            state.prevWidth = w;
            if (wasMobile !== isMobile) setHidden(false);
        };

        // capture: true → receives scroll events from every element in the tree
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll, { capture: true });
            window.removeEventListener('resize', onResize);
        };
    }, [pathname]);

    // Always show navs when navigating to a new page
    useEffect(() => {
        setHidden(false);
        s.current.lastY = 0;
    }, [pathname]);

    return hidden;
}
