'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Returns `{ hidden, atTop }` for mobile header/navs:
 *   `hidden` – `true` when header/navs should be hidden:
 *       – Scrolling DOWN → hide
 *       – Scrolling UP   → show
 *       – At the very top → always show
 *   `atTop`  – `true` only when the user is scrolled back to the very top.
 * Always returns `hidden: false` on desktop (>= 768px).
 */
export default function useHideOnScroll() {
    const [hidden, setHidden] = useState(false);
    const [atTop, setAtTop] = useState(true);
    const pathname = usePathname();
    const state = useRef({ ticking: false, prevWidth: 0 });
    // WeakMap stores: target -> { lastY, lastX, lastCH, lastSH }
    const trackingMap = useRef(new WeakMap());

    useEffect(() => {
        const s = state.current;
        s.ticking = false;
        s.prevWidth = window.innerWidth;

        // ── Scroll handler ─────────────────────────────────────────────────────
        const onScroll = (e) => {
            // Skip on desktop
            if (window.innerWidth >= 768) return;
            // One RAF at a time
            if (s.ticking) return;
            s.ticking = true;

            // Capture target reference BEFORE the async RAF
            const target = e ? e.target : null;

            requestAnimationFrame(() => {
                s.ticking = false;

                let y = null;
                let x = null;
                let scrollElement = target;
                let ch = 0;
                let sh = 0;

                // Case 1: document / document-level scroll
                if (
                    !target ||
                    target === document ||
                    target === document.documentElement ||
                    target === document.body ||
                    target === document.scrollingElement
                ) {
                    y = window.scrollY ?? document.documentElement.scrollTop ?? 0;
                    x = window.scrollX ?? document.documentElement.scrollLeft ?? 0;
                    scrollElement = document.documentElement;
                    ch = window.innerHeight;
                    sh = document.documentElement.scrollHeight;
                } else {
                    // Case 2: overflow container scroll.
                    if (target.nodeType === 1) { // Ensure it's an Element
                        const style = window.getComputedStyle(target);
                        const oy = style.overflowY;
                        
                        // We only care about containers that *can* scroll vertically
                        if ((oy === 'auto' || oy === 'scroll') && target.clientHeight > 200) {
                            y = target.scrollTop;
                            x = target.scrollLeft;
                            ch = target.clientHeight;
                            sh = target.scrollHeight;
                        } else {
                            return; // ignore horizontal or non-scroll containers
                        }
                    } else {
                        return;
                    }
                }

                if (y !== null && x !== null && scrollElement) {
                    const clampedY = Math.max(0, y);
                    const clampedX = Math.max(0, x);
                    const tracked = trackingMap.current.get(scrollElement) || { lastY: 0, lastX: 0, lastCH: ch, lastSH: sh };
                    
                    // If the container's height changed, this scroll event is likely a synthetic
                    // layout adjustment caused by the navbars themselves showing/hiding.
                    // We MUST ignore this event to prevent infinite jitter loops.
                    if (tracked.lastCH !== ch || tracked.lastSH !== sh) {
                        trackingMap.current.set(scrollElement, { lastY: clampedY, lastX: clampedX, lastCH: ch, lastSH: sh });
                        return; // Bail out!
                    }

                    const deltaY = clampedY - tracked.lastY;
                    const deltaX = clampedX - tracked.lastX;

                    // Update tracking map first so the next event has correct previous values
                    trackingMap.current.set(scrollElement, { lastY: clampedY, lastX: clampedX, lastCH: ch, lastSH: sh });

                    // Ignore scroll events that are predominantly horizontal
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        return;
                    }

                    if (clampedY <= 15) {
                        // Near the very top → always visible
                        setHidden(false);
                        setAtTop(true);
                    } else {
                        setAtTop(false);
                        if (deltaY > 4) {
                            setHidden(true);       // scrolling down → hide
                        } else if (deltaY < -4) {
                            setHidden(false);      // scrolling up   → show
                        }
                        // |delta| ≤ 4  →  ignore micro-jitter
                    }
                }
            });
        };

        // ── Resize: only reset on true mobile↔desktop crossing ────────────────
        const onResize = () => {
            const w = window.innerWidth;
            const wasMobile = s.prevWidth < 768;
            const isMobile = w < 768;
            s.prevWidth = w;
            if (wasMobile !== isMobile) {
                setHidden(false);
                setAtTop(true);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll, { capture: true });
            window.removeEventListener('resize', onResize);
        };
    }, [pathname]);

    // Always show navs when navigating to a new page.
    // Adjust state during render (React-documented pattern) instead of in an effect.
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setHidden(false);
        setAtTop(true);
    }

    return { hidden, atTop };
}
