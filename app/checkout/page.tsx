'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserDataAndCart();
  }, []);

  const fetchUserDataAndCart = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData.user) {
        setName(userData.user.name || '');
        setEmail(userData.user.email || '');
        setPhone(userData.user.phone || '');
        setAddress(userData.user.address || '');
      }

      const cartRes = await fetch('/api/cart');
      const cartData = await cartRes.json();
      setItems(cartData.items || []);
    } catch {}
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) {
      alert('Please fill in all required shipping details');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          payment_method: paymentMethod
        })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        window.dispatchEvent(new Event('zyvra_update'));
        router.push(`/dashboard?order_success=${data.order.order_number}`);
      }
    } catch {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Secure Checkout</h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center space-x-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <span>Shipping & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Shipping Address</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Payment Method</span>
            </h3>

            <div className="space-y-4">
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                paymentMethod === 'Online Payment' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={() => setPaymentMethod('Online Payment')}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Online Payment (Stripe / Razorpay Simulation)</p>
                    <p className="text-xs text-slate-500">Secure instant payment via credit card, UPI or NetBanking</p>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                paymentMethod === 'Cash on Delivery' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Cash on Delivery (COD)</p>
                    <p className="text-xs text-slate-500">Pay with cash upon delivery at your doorstep</p>
                  </div>
                </div>
                <Truck className="w-6 h-6 text-indigo-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 h-fit">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Order Summary</h3>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping</span>
              <span className="font-bold text-slate-900 dark:text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Total Amount</span>
              <span className="text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
          >
            {loading ? <span>Processing Order...</span> : <span>Place Order Now</span>}
          </button>
        </div>

      </form>
    </div>
  );
}
