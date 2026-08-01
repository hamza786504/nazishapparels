"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../store/cartContext';
import { X, ArrowRight, ShieldCheck, Truck, ShoppingBag, ArrowLeft } from 'lucide-react';


// Quantity Selector Component
const QuantitySelector = ({ quantity, onQuantityChange }) => {
  const handleDecrease = useCallback(() => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  }, [quantity, onQuantityChange]);

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

// Cart Item Card Component - 1 Liner Design
const CartItemCard = ({ item, onRemove, onQuantityChange, onSizeChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-secondary/10 group transition-all duration-500 hover:border-secondary/30">
      {/* Desktop: Single Row Layout */}
      <div className="hidden md:flex items-center gap-6 p-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
          <Image
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            src={item.image}
            alt={item.imageAlt || item.title || item.name || ''}
            fill
            sizes="96px"
          />
        </div>

        {/* Product Info */}
        <div className="flex-grow min-w-0">
          <h3 className="font-headline-sm text-black truncate">{item.title || item.name}</h3>
          <p className="font-label-sm text-secondary">{item.category}</p>
        </div>

        {/* Size/Color Selector */}
        <div className="w-32">
          {item.type === 'clothing' ? (
            <select
              value={item.size}
              onChange={(e) => onSizeChange(item.id, e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 font-body-md py-2 px-3 focus:border-secondary focus:ring-0 appearance-none rounded-none cursor-pointer"
            >
              {['Small', 'Medium', 'Large', 'Custom', 'S', 'M', 'L', 'XL'].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center space-x-2 h-[42px]">
              <div className="w-6 h-6 rounded-full bg-[#F5F5DC] border border-outline-variant/50 ring-2 ring-secondary ring-offset-2 flex-shrink-0" />
              <span className="font-body-md text-on-surface-variant">{item.color}</span>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="w-32">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(newQty) => onQuantityChange(item.id, newQty)}
          />
        </div>

        {/* Price */}
        <div className="w-32 text-right">
          <span className="font-headline-sm text-secondary">
            PKR {item.price.toLocaleString()}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-outline hover:text-error transition-colors p-1 bg-transparent border-none cursor-pointer flex-shrink-0"
          aria-label={`Remove ${item.title || item.name} from cart`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile: Condensed Layout */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden">
            <Image
              className="object-cover"
              src={item.image}
              alt={item.imageAlt || item.title || item.name || ''}
              fill
              sizes="80px"
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-grow">
                <h3 className="font-headline-sm text-black truncate pr-2">{item.title || item.name}</h3>
                <p className="font-label-sm text-secondary">{item.category}</p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-outline hover:text-error transition-colors p-1 bg-transparent border-none cursor-pointer flex-shrink-0"
                aria-label={`Remove ${item.title || item.name} from cart`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-3">
              {item.type === 'clothing' ? (
                <select
                  value={item.size}
                  onChange={(e) => onSizeChange(item.id, e.target.value)}
                  className="w-24 bg-surface border border-outline-variant/30 font-body-md py-1.5 px-2 text-sm focus:border-secondary focus:ring-0 appearance-none rounded-none cursor-pointer"
                >
                  {['Small', 'Medium', 'Large', 'Custom'].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 rounded-full bg-[#F5F5DC] border border-outline-variant/50 ring-2 ring-secondary ring-offset-2 flex-shrink-0" />
                  <span className="font-body-md text-sm text-on-surface-variant">{item.color}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Quantity and Price */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-28">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={(newQty) => onQuantityChange(item.id, newQty)}
            />
          </div>
          <span className="font-headline-sm text-secondary">
            PKR {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ subtotal, tax, total, appliedCoupon, onRemoveCoupon }) => {
  return (
    <div className="bg-white p-4 md:p-8 border border-secondary/20 shadow-sm">
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
          <span className="text-on-surface-variant italic font-body-md">
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
    <div className="mt-6 p-3 md:p-6 border border-secondary/10 bg-surface-container-low">
      <label
        htmlFor="promo-code"
        className="block font-label-sm text-black mb-3 uppercase tracking-widest"
      >
        Promotion Code
      </label>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          id="promo-code"
          className="flex-grow bg-white border border-outline-variant/30 px-4 py-2 font-label-sm focus:border-secondary focus:ring-0 rounded-none uppercase"
          placeholder="ENTER CODE"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={isApplying}
          className="bg-secondary text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-secondary-container transition-colors disabled:opacity-50"
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
      <main className="max-w-container-max mx-auto p-2 overflowy-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Items List */}
          <div className={`${cartItems.length === 0 ? 'col-span-12' : 'col-span-8'} space-y-4`}>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
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
              <>
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onQuantityChange={handleQuantityChange}
                    onSizeChange={handleSizeChange}
                  />
                ))}
                <div className="pt-8 flex justify-between items-center">
                  <Link
                    className="text-sm text-black flex items-center group hover:text-secondary transition-colors"
                    href="/collection/lawn"
                  >
                    <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
                    CONTINUE SHOPPING
                  </Link>
                </div>
                <aside className="lg:col-span-4 sticky top-32">
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
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Cart;