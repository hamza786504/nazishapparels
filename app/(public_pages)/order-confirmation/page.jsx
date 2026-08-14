'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../store/authContext';
import { CheckCircle, Loader, Package, Truck, MapPin } from 'lucide-react';

const formatPrice = (price) => `Rs. ${Number(price || 0).toLocaleString()}`;

function readStoredOrder() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.sessionStorage.getItem('lastOrder');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function OrderConfirmationPage() {
    const router = useRouter();
    const { refresh, isAuthenticated } = useAuth();
    const [order] = useState(readStoredOrder);
    const [tracking, setTracking] = useState(false);

    const handleTrackOrder = useCallback(async () => {
        if (!order?.orderRef) return;
        setTracking(true);
        try {
            // The orders API sets the customer session cookie when a new account
            // is created at checkout, so refresh the auth state to pick it up and
            // guarantee the track page (behind AuthGuard) lets the user in.
            await refresh();
            router.push(`/orders/${order.orderRef}`);
        } finally {
            setTracking(false);
        }
    }, [order, refresh, router]);

    useEffect(() => {
        if (typeof window === 'undefined' || !order) return;
        
        const timer = setTimeout(() => {
            const itemsText = (order.items || []).map((item, index) => {
                const productUrl = `${window.location.origin}/product/${item.slug}`;
                return `${index + 1}. *${item.title}*\n   Size: ${item.size || 'One Size'}\n   Color: ${item.color || 'Default'}\n   Qty: ${item.quantity}\n   Price: Rs. ${Number(item.price).toLocaleString()}\n   Link: ${productUrl}`;
            }).join('\n\n');

            const message = `*New Order Placed on NazishApparels* 🛍️\n\n` +
                `*Order ID:* ${order.orderId}\n` +
                `*Total Bill:* Rs. ${Number(order.total).toLocaleString()}\n\n` +
                `*Client Details:*\n` +
                `• Name: ${order.name}\n` +
                `• Phone: ${order.phone || '—'}\n` +
                `• Address: ${order.address || '—'}\n\n` +
                `*Items Ordered:*\n${itemsText || 'No items'}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/+923124190029?text=${encodedMessage}`;
            window.location.href = whatsappUrl;
        }, 3000);

        return () => clearTimeout(timer);
    }, [order]);

    return (
        <div className="bg-background text-on-surface font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
            <main className="flex items-center justify-center px-4 sm:px-6 py-12 md:py-20">
                <div className="w-full max-w-[560px]">
                    {/* Success Card */}
                    <div className="bg-white border border-secondary/10 shadow-xl text-center p-6 sm:p-10 md:p-14">
                        <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-secondary" />
                        </div>

                        <span className="font-label-md text-sm text-secondary uppercase tracking-[0.25em] block mb-4">
                            NazishApparels
                        </span>
                        <h1 className="font-display-lg text-3xl md:text-5xl text-primary mb-4">
                            Thank You
                        </h1>
                        <p className="text-body-md text-on-surface-variant leading-relaxed">
                            Your order has been placed successfully. Our concierge team will
                            contact you shortly to confirm your delivery details.
                        </p>

                        {order ? (
                            <div className="mt-8 text-left border border-secondary/10 divide-y divide-secondary/10">
                                <div className="flex justify-between items-center p-4 md:p-5">
                                    <span className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
                                        Order ID
                                    </span>
                                    <span className="font-label-md font-bold text-primary">
                                        {order.orderId}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 md:p-5">
                                    <span className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
                                        Order Total
                                    </span>
                                    <span className="font-headline-sm text-secondary">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                                {order.name && (
                                    <div className="flex justify-between items-center p-4 md:p-5">
                                        <span className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
                                            Customer
                                        </span>
                                        <span className="text-body-md text-primary text-right max-w-[60%]">
                                            {order.name}
                                        </span>
                                    </div>
                                )}
                                {order.address && (
                                    <div className="flex justify-between items-start p-4 md:p-5">
                                        <span className="flex items-center gap-2 font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            Ship To
                                        </span>
                                        <span className="text-body-md text-primary text-right max-w-[60%]">
                                            {order.address}
                                        </span>
                                    </div>
                                )}
                                {order.email && (
                                    <div className="flex justify-between items-center p-4 md:p-5">
                                        <span className="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">
                                            Confirmation to
                                        </span>
                                        <span className="text-body-md text-primary text-right max-w-[60%]">
                                            {order.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8 flex items-center justify-center gap-2 text-on-surface-variant">
                                <Loader className="w-5 h-5 animate-spin" />
                                <span className="font-label-sm">Loading order details…</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            onClick={handleTrackOrder}
                            disabled={!order?.orderRef || tracking}
                            className="flex-1 bg-primary text-on-primary py-5 font-label-md text-label-md uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all border border-secondary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {tracking ? (
                                <>
                                    <Loader className="w-[18px] h-[18px] animate-spin" />
                                    Logging you in…
                                </>
                            ) : (
                                <>
                                    <Truck className="w-5 h-5" />
                                    Track Order
                                </>
                            )}
                        </button>
                        <Link
                            href="/"
                            className="flex-1 border border-primary text-primary px-8 py-5 font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-center"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    <p className="mt-6 flex items-center justify-center gap-2 text-label-sm text-on-surface-variant">
                        <Package className="w-4 h-4" />
                        A copy of your order details has been saved to your account.
                    </p>
                </div>
            </main>
        </div>
    );
}