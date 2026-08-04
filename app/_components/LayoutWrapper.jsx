'use client';
import { useEffect, useRef } from 'react';
import Navbar from '../_components/Navbar';
import MobileBottomNav from '../_components/MobileBottomNav';
import useHideOnScroll from '../_components/useHideOnScroll';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';

export default function LayoutWrapper({ children }) {
    const bottomNavRef = useRef(null);
    const bottomSpacerRef = useRef(null);
    const bottomNavHidden = useHideOnScroll();

    // Slide the fixed bottom nav away and collapse its spacer when hidden,
    // so the flex-1 content reclaims the reserved space
    useEffect(() => {
        const nav = bottomNavRef.current;
        if (nav) nav.style.transform = bottomNavHidden ? 'translateY(100%)' : 'translateY(0)';
        const spacer = bottomSpacerRef.current;
        if (spacer) spacer.style.height = bottomNavHidden ? '0px' : '65px';
    }, [bottomNavHidden]);

    return (
        <>
            <div className="md:z-50">
                <Navbar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
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
            <div
                ref={bottomSpacerRef}
                className="md:hidden"
                style={{ height: '65px', transition: 'height 0.3s ease-in-out' }}
            />
        </>
    );
}
