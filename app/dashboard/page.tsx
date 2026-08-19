'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Package, User, CheckCircle2, Clock, Truck, Shield } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const orderSuccess = searchParams.get('order_success');
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (!userData.user) {
        router.push('/auth');
        return;
      }
      setUser(userData.user);

      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
    } catch {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-32 text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {orderSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-6 rounded-3xl flex items-center space-x-4 shadow-lg">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 flex-shrink-0" />
          <div>
            <h3 className="font-black text-emerald-900 dark:text-emerald-200 text-lg">Order Placed Successfully!</h3>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs">Your order number is <span className="font-bold underline">{orderSuccess}</span>. We have sent a confirmation email with tracking details.</p>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-3xl shadow-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
            <p className="text-slate-500 text-xs">{user?.email} • {user?.phone || 'No phone'}</p>
            <p className="text-slate-400 text-xs mt-1">📍 {user?.address || 'No address set'}</p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={() => router.push('/admin')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
          >
            <Shield className="w-5 h-5" />
            <span>Open Admin Panel</span>
          </button>
        )}
      </div>

      {/* Order History */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Order History & Tracking ({orders.length})</h2>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-sm">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-black text-slate-900 dark:text-white text-base">Order #{order.order_number}</h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        order.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total Amount</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">${order.total_amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.product_name}</p>
                          <p className="text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment info */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between text-xs text-slate-500 gap-2">
                  <p>Shipping to: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.shipping_address}</span></p>
                  <p>Payment: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.payment_method} ({order.payment_status})</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-32 text-slate-400">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
