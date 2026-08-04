'use client';
import { useEffect, useRef } from 'react';
import Navbar from '../_components/Navbar';
import MobileBottomNav from '../_components/MobileBottomNav';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';
import useHideOnScroll from '../_components/useHideOnScroll';

export default function LayoutWrapper({ children }) {
    const bottomNavRef = useRef(null);
    const { hidden: bottomNavHidden } = useHideOnScroll();

    // Slide the fixed bottom nav out of view when scrolling down, back when scrolling up.
    useEffect(() => {
        const nav = bottomNavRef.current;
        if (nav) nav.style.transform = bottomNavHidden ? 'translateY(100%)' : 'translateY(0)';
    }, [bottomNavHidden]);

    // The mobile header is a fixed overlay; reserve its exact height (published by
    // Navbar via `--mobile-header-h`) so content isn't hidden behind it at the top.
    // When scrolled, the header stays sticky over the content and no space is reserved.
    return (
        <>
            <div className="md:z-50">
                <Navbar />
            </div>

            <div
                className="flex-1 flex flex-col overflow-hidden"
                style={{
                    paddingTop: 'var(--mobile-header-h, 0px)',
                    transition: 'padding-top 0.3s ease-in-out',
                }}
            >
                {children}
            </div>

            {/* Fixed bottom nav – slides away on scroll down */}
            <div
                ref={bottomNavRef}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{ transition: 'transform 0.3s ease-in-out', transform: 'translateY(0)' }}
            >
                <MobileBottomNav />
            </div>

            {/* Bottom spacer so content isn't hidden behind the fixed bottom nav */}
            <div className="md:hidden" style={{ height: '65px' }} />
        </>
    );
}