'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../_components/Navbar';
import MobileBottomNav from '../_components/MobileBottomNav';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';

export default function LayoutWrapper({ children }) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const headerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            }
            else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        let timeoutId;
        const throttledScroll = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                handleScroll();
                timeoutId = null;
            }, 100);
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [lastScrollY]);

    return (
        <>
            {/* Navbar - fixed top, hides on scroll down */}
            <div
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <Navbar />
            </div>

            {/* Spacer for fixed header */}
            <div className="h-[210px] md:h-[120px]" />

            {/* Main content area */}
            <div className="flex-1 min-h-0">
                {children}
            </div>

            {/* Bottom Navigation - fixed bottom, hides on scroll down */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
                    isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <MobileBottomNav />
            </div>

            {/* Spacer for fixed bottom nav on mobile */}
            <div className="h-[65px] md:hidden" />

            <RecentPurchasePopup />
        </>
    );
}
