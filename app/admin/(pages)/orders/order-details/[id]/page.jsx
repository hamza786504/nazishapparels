'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import Button from '../../../../../_components/Admin/Button';
import {
  MdArrowBack,
  MdCheck,
  MdEdit,
  MdLocalShipping,
  MdCreditCard,
  MdError,
  MdSchedule,
  MdArchive,
  MdUnarchive,
  MdPrint,
  MdDoneAll,
  MdTrackChanges,
} from 'react-icons/md';

const getStatusBadge = (status) => {
  const styles = {
    Paid: 'bg-primary-container/20 text-primary-container',
    'Partially Paid': 'bg-surface-container-high text-on-surface-variant',
    Pending: 'bg-tertiary-container/20 text-tertiary',
    Refunded: 'bg-error-container/20 text-error',
    Unfulfilled: 'bg-tertiary-container/20 text-tertiary',
    Fulfilled: 'bg-primary-container/20 text-primary-container',
    Returned: 'bg-error-container/20 text-error',
    Delivered: 'bg-primary-container/20 text-primary-container',
    Cancelled: 'bg-error-container/20 text-error',
  };
  return styles[status] || 'bg-surface-container-high text-on-surface-variant';
};

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const OrderDetailPage = () => {
  const params = useParams();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);

  useEffect(() => {
    if (!id) return;
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
        if (active) {
          setOrder(data.order);
          setTrackingCarrier(data.order.trackingCarrier || '');
          setTrackingNumber(data.order.trackingNumber || '');
        }
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
  }, [id]);

  if (loading) {
    return (
      <main className="pt-4 px-margin-desktop pb-20">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center py-40">
          <span className="text-on-surface-variant font-body-md">Loading order…</span>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="pt-4 px-margin-desktop pb-20">
        <div className="max-w-[1400px] mx-auto">
          <Link
            className="text-primary hover:underline flex items-center gap-1 font-body-sm text-body-sm mb-6"
            href="/admin/orders"
          >
            <MdArrowBack size={16} />
            Back to Orders
          </Link>
          <div className="bg-error-container/20 border border-error/30 text-error p-6 rounded">
            <p className="font-bold mb-1">Order not found</p>
            <p className="text-body-sm">{error || 'This order does not exist.'}</p>
          </div>
        </div>
      </main>
    );
  }

  const lineItems = order.lineItems || order.items || [];
  const customer = order.customer || {};
  const isPaid = order.paymentStatus === 'Paid' || order.paymentStatus === 'Partially Paid';
  const isFulfilled = (order.fulfillmentStatus) === 'Fulfilled' || order.fulfillmentStatus === 'Delivered';
  const isRefunded = order.paymentStatus === 'Refunded';
  const isCancelled = order.fulfillmentStatus === 'Cancelled' || order.status === 'cancelled';
  const customerInitials = (customer.name || order.email || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleMarkFulfilled = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: 'Fulfilled' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to update order');
      }
      setOrder({ ...order, fulfillmentStatus: 'Fulfilled' });
    } catch (err) {
      console.error('Mark as Fulfilled error:', err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleApprovePayment = async () => {
    setApproving(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to approve order');
      }
      setOrder({ ...order, paymentStatus: 'Paid', fulfillmentStatus: 'Fulfilled' });
    } catch (err) {
      console.error('Approve payment error:', err);
      alert(err.message);
    } finally {
      setApproving(false);
    }
  };

  const handleArchive = async () => {
    const newStatus = order.status === 'archived' ? 'active' : 'archived';
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to update order');
      }
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error('Archive error:', err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!window.confirm('Refund this order? Payment status will be set to Refunded.')) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'Refunded' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to update order');
      }
      setOrder({ ...order, paymentStatus: 'Refunded' });
    } catch (err) {
      console.error('Refund error:', err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkCompleted = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: 'Delivered' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to mark order as completed');
      }
      setOrder({ ...order, fulfillmentStatus: 'Delivered' });
    } catch (err) {
      console.error('Mark completed error:', err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTracking = async () => {
    setSavingTracking(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCarrier: trackingCarrier.trim(),
          trackingNumber: trackingNumber.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to save tracking');
      }
      setOrder({ ...order, trackingCarrier: trackingCarrier.trim(), trackingNumber: trackingNumber.trim() });
    } catch (err) {
      console.error('Save tracking error:', err);
      alert(err.message);
    } finally {
      setSavingTracking(false);
    }
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!printWindow) return;
    const itemsRows = lineItems
      .map(
        (item, idx) => `<tr>
          <td>${idx + 1}</td>
          <td>${item.title}${item.size ? ` (Size: ${item.size})` : ''}${item.color ? ` — ${item.color}` : ''}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${item.quantity}</td>
          <td style="text-align:right">${formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</td>
        </tr>`
      )
      .join('');
    const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${order.orderId}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #222; padding: 40px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .muted { color: #777; font-size: 13px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 24px; }
    .section { margin-bottom: 20px; }
    .section h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px; color: #444; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; border-bottom: 1px solid #ccc; padding: 8px 6px; color: #444; }
    td { padding: 8px 6px; border-bottom: 1px solid #eee; }
    .totals { width: 100%; margin-top: 16px; }
    .totals td { border: none; padding: 4px 6px; }
    .totals .grand { font-size: 15px; font-weight: bold; border-top: 2px solid #111; }
    .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Nazish Apparels</h1>
      <p class="muted">Invoice</p>
    </div>
    <div style="text-align:right">
      <h1>${order.orderId}</h1>
      <p class="muted">${formatDate(order.date || order.createdAt)}</p>
    </div>
  </div>
  <div class="section">
    <h3>Bill To</h3>
    <div>
      <div><strong>${customer.name || order.email || '—'}</strong></div>
      <div>${order.email || customer.email || ''}</div>
      <div>${order.phone || ''}</div>
      ${[order.address, order.apartment, [order.city, order.postalCode].filter(Boolean).join(', '), order.country].filter(Boolean).map((l) => `<div>${l}</div>`).join('')}
    </div>
  </div>
  <div class="section">
    <h3>Items</h3>
    <table>
      <thead>
        <tr><th>#</th><th>Product</th><th>Price</th><th>Qty</th><th style="text-align:right">Total</th></tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
  </div>
  <table class="totals">
    <tr><td>Subtotal</td><td style="text-align:right">${formatCurrency(lineItems.reduce((acc, i) => acc + (Number(i.price) * Number(i.quantity)), 0))}</td></tr>
    ${order.coupon ? `<tr><td>Discount (${order.coupon.code})</td><td style="text-align:right">-${formatCurrency(order.coupon.discountAmount)}</td></tr>` : ''}
    <tr><td>Shipping</td><td style="text-align:right">${formatCurrency(order.shipping || 0)}</td></tr>
    <tr><td>Tax</td><td style="text-align:right">${formatCurrency(order.tax || 0)}</td></tr>
    <tr class="grand"><td>Total</td><td style="text-align:right">${formatCurrency(order.total)}</td></tr>
  </table>
  <div class="footer">Thank you for shopping with Nazish Apparels</div>
</body>
</html>`;
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  const shippingLines = [
    customer.name,
    order.address,
    order.apartment,
    [order.city, order.postalCode].filter(Boolean).join(', '),
    order.country,
  ].filter(Boolean);

  return (
    <>
      {/* Main Content Canvas */}
      <main className="pt-4 px-margin-desktop pb-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  className="text-primary hover:underline flex items-center gap-1 font-body-sm text-body-sm"
                  href="/admin/orders"
                >
                  <MdArrowBack size={16} />
                  Back to Orders
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <h2 className="font-headline-lg text-headline-lg font-black">Order {order.orderId}</h2>
                <span className={`px-2 py-1 ${getStatusBadge(order.paymentStatus)} font-label-md text-label-md rounded`}>
                  {order.paymentStatus || 'Pending'}
                </span>
                {isCancelled && (
                  <span className={`px-2 py-1 ${getStatusBadge('Cancelled')} font-label-md text-label-md rounded`}>
                    Cancelled
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {formatDate(order.date || order.createdAt)} at {formatTime(order.date || order.createdAt)} from{' '}
                {order.channel || 'Online Store'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleArchive}
                disabled={updating}
                icon={order.status === 'archived' ? <MdUnarchive size={16} /> : <MdArchive size={16} />}
              >
                {order.status === 'archived' ? 'Unarchive' : 'Archive'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrintInvoice} icon={<MdPrint size={16} />}>
                Print Invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleMarkCompleted}
                disabled={updating || order.fulfillmentStatus === 'Delivered' || isCancelled}
                icon={<MdDoneAll size={16} />}
              >
                {order.fulfillmentStatus === 'Delivered' ? 'Completed' : 'Mark as Completed'}
              </Button>
            </div>
          </div>

          {isCancelled && (
            <div className="bg-error-container/20 border border-error/30 text-error p-4 rounded mb-lg flex items-start gap-3">
              <MdError size={20} className="mt-0.5" />
              <div>
                <p className="font-bold">Order cancelled</p>
                <p className="text-body-sm">
                  This order was cancelled by the customer and will not be fulfilled.
                </p>
              </div>
            </div>
          )}

          {/* Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-lg">
              {/* Order Items Card */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded overflow-hidden">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                  <h3 className="font-headline-md text-headline-md">Order items</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-md text-body-md">
                    <thead>
                      <tr className="bg-surface-container-low/50">
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant">Product</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant">Price</th>
                        <th className="p-4 font-label-md text-label-md text-on-surface-variant">Quantity</th>
                        <th className="p-4 text-right font-label-md text-label-md text-on-surface-variant">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {lineItems.length === 0 && (
                        <tr>
                          <td className="p-4 text-on-surface-variant" colSpan={4}>
                            No items recorded for this order.
                          </td>
                        </tr>
                      )}
                      {lineItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-bold">{item.title}</p>
                              {(item.size || item.color) && (
                                <p className="text-body-sm text-on-surface-variant">
                                  {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">{formatCurrency(item.price)}</td>
                          <td className="p-4">{item.quantity}</td>
                          <td className="p-4 text-right font-bold">
                            {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <h3 className="font-headline-md text-headline-md mb-6">Order timeline</h3>
                <div className="relative">
                  <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-outline-variant"></div>
                  <div className="space-y-8">
                    {/* Step 1 — placed */}
                    <div className="relative flex items-start pl-8">
                      <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                        <MdCheck size={14} className="text-on-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold">Order placed</p>
                          <p className="text-body-sm text-on-surface-variant">
                            {formatDate(order.date || order.createdAt)} {formatTime(order.date || order.createdAt)}
                          </p>
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                          Customer placed an order via the {order.channel || 'Online Store'}.
                        </p>
                      </div>
                    </div>

                    {isCancelled && (
                      <div className="relative flex items-start pl-8">
                        <div className="absolute left-0 w-6 h-6 rounded-full bg-error flex items-center justify-center z-10">
                          <MdError size={14} className="text-on-error" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-error">Order cancelled</p>
                            <p className="text-body-sm text-on-surface-variant">Current</p>
                          </div>
                          <p className="text-body-sm text-on-surface-variant">
                            The customer cancelled this order. It will not be fulfilled.
                          </p>
                        </div>
                      </div>
                    )}

                    {!isCancelled && (
                    <>
                    {/* Step 2 — payment */}
                    <div className="relative flex items-start pl-8">
                      {isPaid ? (
                        <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                          <MdCheck size={14} className="text-on-primary" />
                        </div>
                      ) : (
                        <div className="absolute left-0 w-6 h-6 rounded-full border-2 border-primary bg-surface-container-lowest flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold">Payment {isPaid ? 'processed' : 'pending'}</p>
                          <p className="text-body-sm text-on-surface-variant">
                            {isPaid ? order.paymentStatus : 'Awaiting payment'}
                          </p>
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                          {isPaid
                            ? `Transaction approved. Total ${formatCurrency(order.total)}.`
                            : `Payment method: ${order.paymentMethod || '—'}.`}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 — fulfillment */}
                    <div className="relative flex items-start pl-8">
                      {order.fulfillmentStatus === 'Fulfilled' || order.fulfillmentStatus === 'Delivered' ? (
                        <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                          <MdCheck size={14} className="text-on-primary" />
                        </div>
                      ) : (
                        <div className="absolute left-0 w-6 h-6 rounded-full border-2 border-primary bg-surface-container-lowest flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-primary">
                            {order.fulfillmentStatus === 'Delivered'
                              ? 'Delivered'
                              : order.fulfillmentStatus === 'Fulfilled'
                              ? 'Fulfilled'
                              : 'Pending fulfillment'}
                          </p>
                          <p className="text-body-sm text-on-surface-variant">
                            {order.fulfillmentStatus === 'Delivered'
                              ? 'Complete'
                              : order.fulfillmentStatus === 'Fulfilled'
                              ? 'Shipped'
                              : 'Current'}
                          </p>
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                          {order.fulfillmentStatus === 'Delivered'
                            ? 'Order delivered to the customer.'
                            : order.fulfillmentStatus === 'Fulfilled'
                            ? 'The order has been packed and shipped.'
                            : 'The order is ready to be picked and packed.'}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-body-sm text-on-surface-variant mt-1">
                            Tracking: {order.trackingCarrier ? `${order.trackingCarrier} · ` : ''}
                            {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    </>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <h3 className="font-headline-md text-headline-md mb-4">Notes</h3>
                <textarea
                  className="w-full h-32 p-3 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded font-body-md text-body-md"
                  placeholder="Add a note to this order..."
                  defaultValue={order.note || ''}
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity rounded active:scale-[0.98]">
                    Save Note
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-lg">
              {/* Fulfillment Card */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <h3 className="font-headline-md text-headline-md mb-4">Fulfillment</h3>
                <p className="text-body-sm text-on-surface-variant mb-6">
                  {lineItems.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0)} item(s) ·{' '}
                  {order.fulfillmentStatus || 'Unfulfilled'}.
                </p>
                <div className="space-y-3">
                  {isCancelled ? (
                    <button
                      disabled
                      className="w-full py-3 font-bold text-body-md rounded bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                    >
                      Cancelled
                    </button>
                  ) : (
                  <>
                  <button
                    onClick={handleMarkFulfilled}
                    disabled={isFulfilled || updating}
                    className={`w-full py-3 font-bold text-body-md transition-opacity rounded shadow-sm active:scale-[0.98] ${
                      isFulfilled
                        ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                        : 'bg-primary text-on-primary hover:opacity-90'
                    }`}
                  >
                    {updating ? 'Updating…' : isFulfilled ? 'Fulfilled' : 'Mark as Fulfilled'}
                  </button>
                  {isPaid && (
                    <button
                      onClick={handleRefund}
                      disabled={updating || isRefunded}
                      className={`w-full py-3 border font-bold text-body-md rounded active:scale-[0.98] ${
                        isRefunded
                          ? 'border-outline-variant text-on-surface-variant bg-surface-container-high cursor-not-allowed'
                          : 'border-error text-error hover:bg-error-container/10 transition-colors'
                      }`}
                    >
                      {isRefunded ? 'Refunded' : 'Refund'}
                    </button>
                  )}
                  </>
                  )}
                </div>
              </div>

              {/* Tracking Card */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <h3 className="font-headline-md text-headline-md mb-1">Tracking</h3>
                <p className="text-body-sm text-on-surface-variant mb-4">
                  {order.fulfillmentStatus === 'Delivered'
                    ? 'Delivered to customer.'
                    : order.fulfillmentStatus === 'Fulfilled'
                    ? 'Shipped — share the tracking number below.'
                    : 'Add tracking once the order ships.'}
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant mb-1 block">Carrier</label>
                    <input
                      type="text"
                      value={trackingCarrier}
                      onChange={(e) => setTrackingCarrier(e.target.value)}
                      placeholder="e.g. TCS, Leopards, Trax"
                      className="w-full p-3 border border-outline-variant rounded font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant mb-1 block">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. TCS1234567890"
                      className="w-full p-3 border border-outline-variant rounded font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={handleSaveTracking}
                    disabled={savingTracking}
                    className="w-full py-3 bg-primary text-on-primary font-bold text-body-md hover:opacity-90 transition-opacity rounded shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <MdTrackChanges size={18} />
                    {savingTracking ? 'Saving…' : 'Save Tracking'}
                  </button>
                </div>
              </div>

              {/* Customer Card */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md">Customer</h3>
                  <Link className="text-primary font-label-md text-label-md hover:underline" href="#">
                    Edit
                  </Link>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-secondary">
                    {customer.avatar || customerInitials}
                  </div>
                  <div>
                    <p className="font-bold">{customer.name || '—'}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {lineItems.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0)} item(s) · {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-outline-variant">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Email</p>
                    <p className="font-body-md text-body-md text-primary">{order.email || customer.email || '—'}</p>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1">Phone</p>
                    <p className="font-body-md text-body-md">{order.phone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md">Shipping Address</h3>
                  <MdEdit className="text-on-surface-variant cursor-pointer" size={18} />
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {shippingLines.length > 0 ? (
                    shippingLines.map((line, idx) => <p key={idx}>{line}</p>)
                  ) : (
                    <p>—</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdLocalShipping size={18} />
                    <p className="font-body-sm text-body-sm">
                      {order.shippingMethod || 'Standard Shipping'} · {order.fulfillmentStatus || 'Unfulfilled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Receipt — shown when customer uploaded one */}
              {order.receiptUrl && (
                <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                  <h3 className="font-headline-md text-headline-md mb-4">Payment Receipt</h3>
                  <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={order.receiptUrl}
                      alt="Payment receipt"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto rounded border border-outline-variant object-contain max-h-64"
                    />
                  </a>
                  {order.paymentStatus !== 'Paid' && (
                    <button
                      onClick={handleApprovePayment}
                      disabled={approving}
                      className="w-full mt-4 py-3 bg-primary text-on-primary font-bold text-body-md hover:opacity-90 transition-opacity rounded shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {approving ? 'Approving…' : 'Approve Payment'}
                    </button>
                  )}
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded p-lg">
                <h3 className="font-headline-md text-headline-md mb-4">Payment Summary</h3>
                <div className="space-y-3 font-body-md text-body-md">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Subtotal</span>
                    {/* Reverse engineer subtotal by adding back discount if total was used for subtotal. Note order.total includes discount. 
                        Actually we should just show the order.total + discount as subtotal if we didn't save subtotal, 
                        or since order.total is the final amount, it's safer to re-calculate subtotal from items */}
                    <span>{formatCurrency(lineItems.reduce((acc, i) => acc + (Number(i.price) * Number(i.quantity)), 0))}</span>
                  </div>
                  
                  {order.coupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({order.coupon.code})</span>
                      <span>-{formatCurrency(order.coupon.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span>{formatCurrency(order.shipping || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tax</span>
                    <span>{formatCurrency(order.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-outline-variant font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3 p-3 bg-surface-container-low rounded">
                  <MdCreditCard className="text-primary" size={20} />
                  <div>
                    <p className="font-label-md text-label-md capitalize">
                      {order.paymentMethod === 'bank' ? 'Bank Deposit' : 'Cash on Delivery'}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {order.paymentStatus || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </>
  );
};

export default OrderDetailPage;
