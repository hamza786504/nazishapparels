"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../store/cartContext';
import { X, ArrowRight, ShieldCheck, Truck, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';


// Quantity Selector Component (Desktop)
const QuantitySelector = ({ quantity, onQuantityChange, onRemove }) => {
  const handleDecrease = useCallback(() => {
    if (quantity <= 1) {
      if (onRemove) onRemove();
    } else {
      onQuantityChange(quantity - 1);
    }
  }, [quantity, onQuantityChange, onRemove]);

  const handleIncrease = useCallback(() => {
    onQuantityChange(quantity + 1);
  }, [quantity, onQuantityChange]);

  return (
    <div className="flex items-center border border-outline-variant/30 bg-surface h-[42px]">
      <button
        onClick={handleDecrease}
        className="w-10 h-full hover:bg-surface-container transition-colors"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="flex-grow text-center font-body-md">{quantity}</span>
      <button
        onClick={handleIncrease}
        className="w-10 h-full hover:bg-surface-container transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

// Cart Item Card Component — Unified drawer-style design for all breakpoints
const CartItemCard = ({ item, onRemove, onQuantityChange, onSizeChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-secondary/10 group transition-all duration-500 hover:border-secondary/30">
      <div className="flex gap-3 p-3">
        {/* Square thumbnail — 64×64 */}
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-sm bg-surface-container">
          <Image
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src={item.image}
            alt={item.imageAlt || item.title || item.name || ''}
            width={64}
            height={64}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-between flex-grow min-w-0">
          {/* Top: title + remove */}
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm font-medium leading-snug line-clamp-2 text-black">
                {item.title || item.name}
              </h3>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label={`Remove ${item.title || item.name} from cart`}
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Size: {item.size || item.category}
            </p>
          </div>

          {/* Bottom: stepper + price */}
          <div className="flex justify-between items-end mt-1">
            <div className="flex items-center border border-gray-200 rounded-sm">
              <button
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (item.quantity <= 1) {
                    onRemove(item.id);
                  } else {
                    onQuantityChange(item.id, item.quantity - 1);
                  }
                }}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium w-7 text-center">{item.quantity}</span>
              <button
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-black">
              PKR {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ subtotal, tax, total, appliedCoupon, onRemoveCoupon }) => {
  return (
    <div className="bg-white p-3 md:p-5 py-8 border border-secondary/20 shadow-sm">
      <h2 className="font-headline-sm text-black mb-8 text-center uppercase tracking-wider">
        Order Summary
      </h2>
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant font-body-md">Subtotal</span>
          <span className="text-black text-base font-bold">PKR {subtotal.toLocaleString()}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-green-600 font-body-md font-semibold flex items-center">
                Discount ({appliedCoupon.code})
              </span>
              <button onClick={onRemoveCoupon} className="text-xs text-secondary underline text-left mt-1">Remove</button>
            </div>
            <span className="text-green-600 font-bold">
              -PKR {appliedCoupon.discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant font-body-md">Shipping Estimate</span>
          <span className="text-right text-on-surface-variant italic font-body-md">
            Calculated at checkout
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant font-body-md">Tax</span>
          <span className="text-black font-bold">PKR {tax.toLocaleString()}</span>
        </div>
        <div className="luxury-line" />
        <div className="flex justify-between items-center pt-2">
          <span className="text-black font-bold text-lg">Total</span>
          <span className="text-secondary font-bold text-lg">
            PKR {total.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <Link href="/checkout" className="w-full bg-black text-white py-4 text-sm tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center">
          PROCEED TO CHECKOUT
          <ArrowRight className="ml-2 w-3.5 h-3.5" />
        </Link>
        <p className="text-center text-[10px] text-outline-variant uppercase tracking-tighter leading-relaxed">
          Complimentary shipping on orders above PKR 10,000. All prices are inclusive of
          luxury VAT where applicable.
        </p>
      </div>
      <div className="mt-8 pt-8 border-t border-secondary/10 space-y-4">
        <div className="flex items-center text-on-surface-variant text-sm">
          <ShieldCheck className="mr-3 text-secondary" />
          SECURE PREMIUM CHECKOUT
        </div>
        <div className="flex items-center text-on-surface-variant text-sm">
          <Truck className="mr-3 text-secondary" />
          EXPRESS GLOBAL COURIER
        </div>
      </div>
    </div>
  );
};

// Promo Code Section Component
const PromoCodeSection = ({ onApplyPromo, isApplying, error }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onApplyPromo(code.trim());
  };

  return (
    <div className="mt-6 p-3 md:p-6 border border-secondary/10 bg-white">
      <label
        htmlFor="promo-code"
        className="block font-label-sm text-black mb-3 uppercase tracking-widest"
      >
        Promotion Code
      </label>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          id="promo-code"
          className="min-w-[160px] bg-white border border-outline-variant/30 px-4 py-2 font-label-sm focus:border-secondary focus:ring-0 rounded-none uppercase"
          placeholder="ENTER CODE"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={isApplying}
          className="bg-black text-white px-6 py-3 text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
        >
          {isApplying ? 'APPLYING...' : 'APPLY'}
        </button>
      </form>
      {error && <p className="text-error font-label-sm mt-2">{error}</p>}
    </div>
  );
};

// Main Cart Component
function Cart() {
  const { cartItems, appliedCoupon, applyCoupon, removeCoupon, removeFromCart, updateQuantity, updateSize } = useCart();
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleRemoveItem = useCallback((id) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const handleQuantityChange = useCallback((id, quantity) => {
    updateQuantity(id, quantity);
  }, [updateQuantity]);

  const handleSizeChange = useCallback((id, size) => {
    updateSize(id, size);
  }, [updateSize]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'fixed_amount') {
      discountAmount = appliedCoupon.discountValue;
    }
    // Cap discount at subtotal
    if (discountAmount > subtotal) discountAmount = subtotal;
    // Add discountAmount to context object for easier rendering
    appliedCoupon.discountAmount = discountAmount;
  }

  const handleApplyPromo = async (code) => {
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        applyCoupon(data.coupon);
      } else {
        setCouponError(data.error || 'Invalid coupon.');
      }
    } catch (err) {
      setCouponError('Network error while applying coupon.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const tax = 0;
  const total = subtotal - discountAmount + tax;

  return (
    <>
      <main className="flex-1 overflow-y-auto px-3 py-2">
        {cartItems.length === 0 ? (
          /* ── Empty State ─────────────────────────────────── */
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto w-16 h-16 text-outline-variant mb-4" />
            <h2 className="font-headline-sm text-black mb-2">Cart is empty</h2>
            <p className="text-on-surface-variant mb-6">
              Discover our latest Eastern luxury collections
            </p>
            <Link
              href="/new-arrivals"
              className="inline-block bg-black text-white px-8 py-3 text-sm tracking-widest uppercase transition-colors"
            >
              Shop New Arrivals
            </Link>
          </div>
        ) : (
          /* ── Cart with items ─────────────────────────────── */
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-start">
            {/* Items list — grows to fill available width */}
            <div className="w-full lg:flex-1 min-w-0 space-y-3">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                  onSizeChange={handleSizeChange}
                />
              ))}
              <div className="pt-1 md:pt-5 flex justify-between items-center">
                <Link
                  className="text-sm text-black flex items-center group hover:text-secondary transition-colors"
                  href="/collection/new-arrivals"
                >
                  <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>

            {/* Order Summary sidebar */}
            <aside className="mt-3 md:mt-0 w-full lg:w-[380px] lg:flex-shrink-0 lg:sticky">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                appliedCoupon={appliedCoupon}
                onRemoveCoupon={() => {
                  removeCoupon();
                  setCouponError('');
                }}
              />
              {!appliedCoupon && (
                <PromoCodeSection
                  onApplyPromo={handleApplyPromo}
                  isApplying={isApplyingCoupon}
                  error={couponError}
                />
              )}
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export default Cart;