'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../store/authContext';
import { ArrowLeft, Loader, AlertCircle, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const STATUS_COLORS = {
    Delivered: 'bg-surface-container-highest text-on-surface',
    Processing: 'bg-primary-fixed text-on-primary-fixed-variant',
    Shipped: 'bg-secondary-fixed text-on-secondary-fixed',
    Cancelled: 'bg-error-container text-on-error-container',
    Pending: 'bg-tertiary-container/20 text-tertiary',
    'Partially Paid': 'bg-surface-container-highest text-on-surface',
    Refunded: 'bg-error-container text-on-error-container',
    Unfulfilled: 'bg-tertiary-container/20 text-tertiary',
    Fulfilled: 'bg-primary-fixed text-on-primary-fixed-variant',
    Returned: 'bg-error-container text-on-error-container',
};

const getStatusColor = (status) =>
    STATUS_COLORS[status] || 'bg-surface-container-highest text-on-surface';

const formatTotal = (value) =>
    `Rs. ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${formatDate(dateStr)} at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function OrderDetail() {
    const params = useParams();
    const id = params?.id;
    const { customer, isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !id) return;
        let active = true;
        setLoading(true);
        setError('');

        const load = async () => {
            try {
                const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' });
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || data.error || 'Failed to load order.');
                }
                // Ownership check: a customer may only view their own order.
                const ownerEmail = (data.order?.customer?.email || data.order?.email || '').toLowerCase();
                if (customer?.email && ownerEmail && ownerEmail !== customer.email.toLowerCase()) {
                    throw new Error('You do not have permission to view this order.');
                }
                if (active) setOrder(data.order);
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [isAuthenticated, id, customer?.email]);

    const lineItems = order?.lineItems || order?.items || [];
    const orderCustomer = order?.customer || {};
    const shippingLines = [
        orderCustomer.name || order?.email,
        order?.address,
        order?.apartment,
        [order?.city, order?.postalCode].filter(Boolean).join(', '),
        order?.country,
    ].filter(Boolean);

    const canCancel =
        !cancelling &&
        order &&
        order.fulfillmentStatus !== 'Cancelled' &&
        order.fulfillmentStatus !== 'Fulfilled' &&
        order.fulfillmentStatus !== 'Delivered' &&
        order.status !== 'cancelled';

    const handleCancelOrder = async () => {
        if (!order) return;
        if (!showConfirm) {
            setShowConfirm(true);
            // Auto reset confirmation state after 4 seconds if not clicked again
            setTimeout(() => setShowConfirm(false), 4000);
            return;
        }
        setCancelling(true);
        try {
            const res = await fetch(`/api/orders/${order._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fulfillmentStatus: 'Cancelled' }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || 'Failed to cancel order.');
            }
            setOrder({ ...order, fulfillmentStatus: 'Cancelled' });
        } catch (err) {
            alert(err.message);
        } finally {
            setCancelling(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="space-y-stack-md">
            <div className="flex items-center gap-3 mb-stack-sm">
                <Link
                    href="/orders"
                    className="flex items-center gap-1 text-primary hover:text-secondary transition-colors font-label-sm text-label-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader className="animate-spin w-9 h-9 text-secondary" />
                </div>
            ) : error || !order ? (
                <div className="bg-error-container/20 border border-error/30 p-8 text-center">
                    <AlertCircle className="w-9 h-9 text-error mb-4 block mx-auto" />
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                        Order not found
                    </h3>
                    <p className="text-on-surface-variant mb-6">{error || 'This order does not exist.'}</p>
                    <Link
                        href="/orders"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 font-label-md text-label-md uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all border border-secondary/20"
                    >
                        View All Orders
                    </Link>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <section className="border-b premium-border pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="font-display-lg text-headline-md text-primary">
                                    Order {order.orderId}
                                </h2>
                                <p className="text-label-sm text-on-surface-variant mt-1">
                                    Placed {formatDateTime(order.date || order.createdAt)} ·{' '}
                                    {order.channel || 'Online Store'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm ${getStatusColor(
                                        order.fulfillmentStatus || order.status
                                    )}`}
                                >
                                    {order.fulfillmentStatus || order.status || 'Processing'}
                                </span>
                                {canCancel && (
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={cancelling}
                                        className={`inline-flex items-center gap-2 border px-4 py-1.5 font-label-md text-label-md font-bold transition-all rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                                            showConfirm
                                                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 animate-pulse'
                                                : 'border-error text-error hover:bg-error-container/10'
                                        }`}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {cancelling ? 'Cancelling…' : showConfirm ? 'Confirm Cancellation' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                        {/* Left: Items */}
                        <div className="lg:col-span-8 space-y-stack-sm">
                            <div className="border premium-border bg-white overflow-hidden">
                                <div className="p-4 border-b premium-border bg-surface-container-low">
                                    <h3 className="font-headline-sm text-headline-sm text-primary">
                                        Order items
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead>
                                            <tr className="bg-surface-container-lowest border-b premium-border">
                                                <th className="p-4 font-label-sm text-label-sm text-primary uppercase tracking-tighter">
                                                    Product
                                                </th>
                                                <th className="p-4 font-label-sm text-label-sm text-primary uppercase tracking-tighter">
                                                    Price
                                                </th>
                                                <th className="p-4 font-label-sm text-label-sm text-primary uppercase tracking-tighter">
                                                    Qty
                                                </th>
                                                <th className="p-4 text-right font-label-sm text-label-sm text-primary uppercase tracking-tighter">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-body-md text-body-md divide-y premium-border">
                                            {lineItems.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-4 text-on-surface-variant">
                                                        No items recorded for this order.
                                                    </td>
                                                </tr>
                                            )}
                                            {lineItems.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-medium text-primary">{item.title}</p>
                                                        {(item.size || item.color) && (
                                                            <p className="text-label-sm text-on-surface-variant">
                                                                {[
                                                                    item.size && `Size: ${item.size}`,
                                                                    item.color && `Color: ${item.color}`,
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(', ')}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-on-surface-variant">
                                                        {formatTotal(item.price)}
                                                    </td>
                                                    <td className="p-4 text-on-surface-variant">{item.quantity}</td>
                                                    <td className="p-4 text-right font-medium text-primary">
                                                        {formatTotal(
                                                            Number(item.price || 0) * Number(item.quantity || 0)
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="border premium-border bg-white p-stack-sm">
                                <h3 className="font-headline-sm text-headline-sm text-primary mb-4">
                                    Order status
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-primary" />
                                        <div>
                                            <p className="font-medium text-primary">Order placed</p>
                                            <p className="text-label-sm text-on-surface-variant">
                                                {formatDateTime(order.date || order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {order.fulfillmentStatus === 'Cancelled' && (
                                        <div className="flex items-start gap-3">
                                            <XCircle className="w-6 h-6 text-error" />
                                            <div>
                                                <p className="font-medium text-error">Order cancelled</p>
                                                <p className="text-label-sm text-on-surface-variant">
                                                    This order was cancelled and will not be fulfilled.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        {order.paymentStatus === 'Paid'
                                            ? <CheckCircle className="w-6 h-6 text-primary" />
                                            : <Clock className="w-6 h-6 text-on-surface-variant" />
                                        }
                                        <div>
                                            <p className="font-medium text-primary">
                                                Payment {order.paymentStatus === 'Paid' ? 'received' : 'pending'}
                                            </p>
                                            <p className="text-label-sm text-on-surface-variant">
                                                {order.paymentMethod === 'bank' ? 'Bank Deposit' : 'Cash on Delivery'} ·{' '}
                                                {order.paymentStatus || 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    {order.fulfillmentStatus !== 'Cancelled' && (
                                    <div className="flex items-start gap-3">
                                        {(order.fulfillmentStatus === 'Fulfilled' || order.fulfillmentStatus === 'Delivered')
                                            ? <CheckCircle className="w-6 h-6 text-primary" />
                                            : <Truck className="w-6 h-6 text-on-surface-variant" />
                                        }
                                        <div>
                                            <p className="font-medium text-primary">
                                                {order.fulfillmentStatus === 'Delivered'
                                                    ? 'Delivered'
                                                    : order.fulfillmentStatus === 'Fulfilled'
                                                    ? 'Fulfilled'
                                                    : 'Pending fulfillment'}
                                            </p>
                                            <p className="text-label-sm text-on-surface-variant">
                                                {order.shippingMethod || 'Standard Shipping'}
                                            </p>
                                            {order.trackingNumber && (
                                                <p className="text-label-sm text-secondary mt-1">
                                                    {order.trackingCarrier ? `${order.trackingCarrier}: ` : 'Tracking: '}
                                                    {order.trackingNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Summary cards */}
                        <div className="lg:col-span-4 space-y-stack-sm">
                            {/* Payment Summary */}
                            <div className="border premium-border bg-white p-stack-sm">
                                <h3 className="font-headline-sm text-headline-sm text-primary mb-4">
                                    Payment Summary
                                </h3>
                                <div className="space-y-3 font-body-md text-body-md">
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Subtotal</span>
                                        <span>{formatTotal(order.total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Shipping</span>
                                        <span>{formatTotal(order.shipping || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-on-surface-variant">Tax</span>
                                        <span>{formatTotal(order.tax || 0)}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t premium-border font-bold">
                                        <span>Total</span>
                                        <span>{formatTotal(order.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="border premium-border bg-white p-stack-sm">
                                <h3 className="font-headline-sm text-headline-sm text-primary mb-4">
                                    Shipping Address
                                </h3>
                                <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    {shippingLines.length > 0 ? (
                                        shippingLines.map((line, idx) => <p key={idx}>{line}</p>)
                                    ) : (
                                        <p>—</p>
                                    )}
                                </div>
                            </div>

                            {/* Tracking */}
                            {order.trackingNumber && (
                                <div className="border premium-border bg-white p-stack-sm">
                                    <h3 className="font-headline-sm text-headline-sm text-primary mb-4">
                                        Tracking
                                    </h3>
                                    <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                        {order.trackingCarrier && (
                                            <p className="font-medium text-primary">{order.trackingCarrier}</p>
                                        )}
                                        <p>{order.trackingNumber}</p>
                                        <p className="mt-2 text-label-sm">
                                            {order.fulfillmentStatus === 'Delivered'
                                                ? 'Delivered'
                                                : order.fulfillmentStatus === 'Fulfilled'
                                                ? 'Shipped'
                                                : 'In transit'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Customer */}
                            <div className="border premium-border bg-white p-stack-sm">
                                <h3 className="font-headline-sm text-headline-sm text-primary mb-4">
                                    Customer
                                </h3>
                                <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    <p className="font-medium text-primary">
                                        {orderCustomer.name || order?.email || '—'}
                                    </p>
                                    <p>{order?.email || orderCustomer.email || '—'}</p>
                                    {order?.phone && <p className="mt-2 text-label-sm">{order.phone}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
