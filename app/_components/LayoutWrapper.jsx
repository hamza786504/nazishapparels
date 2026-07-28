'use client';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../_components/Navbar';
import MobileBottomNav from '../_components/MobileBottomNav';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';

export default function LayoutWrapper({ children }) {
    const [bottomNavHidden, setBottomNavHidden] = useState(false);
    const lastScrollYRef = useRef(0);
    const tickingRef = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;
                const prev = lastScrollYRef.current;
                const mobile = window.innerWidth < 768;

                if (mobile) {
                    if (y <= 10) {
                        // Back at top — show bottom nav
                        setBottomNavHidden(false);
                    } else if (y > prev + 5) {
                        // Scrolling down — hide bottom nav
                        setBottomNavHidden(true);
                    } else if (y < prev - 5) {
                        // Scrolling up — show bottom nav
                        setBottomNavHidden(false);
                    }
                } else {
                    setBottomNavHidden(false);
                }

                lastScrollYRef.current = y;
                tickingRef.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
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
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{
                    transform: bottomNavHidden ? 'translateY(100%)' : 'translateY(0)',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <MobileBottomNav />
            </div>

        </>
    );
}
