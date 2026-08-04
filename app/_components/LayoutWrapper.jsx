'use client';
import Navbar from '../_components/Navbar';
import MobileBottomNav from '../_components/MobileBottomNav';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';

export default function LayoutWrapper({ children }) {
    return (
        <>
            <div className="md:z-50">
                <Navbar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <MobileBottomNav />
            </div>

            {/* Permanent bottom spacer so content isn't hidden behind the bottom nav */}
            <div
                className="md:hidden shrink-0"
                style={{ height: '65px' }}
            />
        </>
    );
}
