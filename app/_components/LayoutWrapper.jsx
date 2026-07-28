'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../_components/Navbar';
import MobileBottomNav from '../_components/MobileBottomNav';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';

export default function LayoutWrapper({ children }) {
    const bottomNavRef = useRef(null);
    const lastScrollYRef = useRef(0);
    const tickingRef = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;

            requestAnimationFrame(() => {
                const y = Math.max(0, window.scrollY);
                const prev = lastScrollYRef.current;
                const mobile = window.innerWidth < 768;

                if (mobile && bottomNavRef.current) {
                    if (y <= 20) {
                        // Back at top — show bottom nav
                        bottomNavRef.current.style.transform = 'translateY(0)';
                        lastScrollYRef.current = y;
                    } else if (Math.abs(y - prev) > 20) {
                        // Only trigger if scrolled more than 20px
                        if (y > prev) {
                            // Scrolling down — hide bottom nav
                            bottomNavRef.current.style.transform = 'translateY(100%)';
                        } else {
                            // Scrolling up — show bottom nav
                            bottomNavRef.current.style.transform = 'translateY(0)';
                        }
                        // Only update the reference point when a large enough scroll happens
                        lastScrollYRef.current = y;
                    }
                } else if (!mobile && bottomNavRef.current) {
                    bottomNavRef.current.style.transform = 'translateY(0)';
                    lastScrollYRef.current = y;
                }

                tickingRef.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // Set initial state
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <div className="md:z-50">
                <Navbar />
            </div>

            <div className="flex-1">
                {children}
            </div>

            <div
                ref={bottomNavRef}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{
                    transition: 'transform 0.3s ease-in-out',
                    transform: 'translateY(0)', // Default visible
                }}
            >
                <MobileBottomNav />
            </div>

            {/* Bottom spacer so content isn't hidden behind the bottom nav */}
            <div className="h-[65px] md:hidden" />
        </>
    );
}
