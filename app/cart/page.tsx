'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cart_item_id: number, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id, quantity })
      });
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        window.dispatchEvent(new Event('zyvra_update'));
      }
    } catch {
      alert('Failed to update cart');
    }
  };

  const removeItem = async (cart_item_id: number) => {
    try {
      const res = await fetch(`/api/cart?id=${cart_item_id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCart();
        window.dispatchEvent(new Event('zyvra_update'));
      }
    } catch {
      alert('Failed to remove item');
    }
  };

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    try {
      const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cart_subtotal: subtotal })
      });
      const data = await res.json();
      if (data.error) {
        setCouponError(data.error);
      } else {
        setAppliedCoupon(data.coupon);
        setDiscount(data.discount);
      }
    } catch {
      setCouponError('Failed to apply coupon');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shipping);

  if (loading) {
    return <div className="text-center py-32 text-slate-400">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">Looks like you haven't added any products to your Zyvra cart yet. Explore our catalog and find something special!</p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-slate-800 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 h-fit">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Order Summary</h3>

          {/* Coupon Form */}
          <form onSubmit={applyCoupon} className="space-y-2">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Coupon (e.g. ZYVRA20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold uppercase focus:outline-none"
                />
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition">
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-red-500">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Coupon {appliedCoupon.code} applied (-${discount.toFixed(2)})</span>
              </p>
            )}
          </form>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-bold">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900 dark:text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
}
