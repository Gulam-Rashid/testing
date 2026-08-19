'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
        setLowStock(data.lowStockProducts || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading admin analytics...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard 👑</h1>
          <p className="text-slate-400 text-xs mt-1">Real-time system overview and performance metrics</p>
        </div>
        <div className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-xl text-xs font-bold">
          Admin Credentials: admin@zyvra.com / admin123
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">${(stats?.revenue || 0).toFixed(2)}</h3>
          <p className="text-[10px] text-emerald-400 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-1" /> +14.2% from last month
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Orders</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.orders || 0}</h3>
          <p className="text-[10px] text-indigo-400">Active fulfillment tracking</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Registered Customers</span>
            <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.users || 0}</h3>
          <p className="text-[10px] text-violet-400">Verified buyer accounts</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Catalog Products</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.products || 0}</h3>
          <p className="text-[10px] text-amber-400">Across 5 active categories</p>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Low Stock Alerts */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Stock Alerts ({lowStock.length})</span>
            </h3>
            <Link href="/admin/products" className="text-indigo-400 text-xs hover:underline">Manage Products</Link>
          </div>

          {lowStock.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">All products have healthy inventory levels.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 text-xs">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full font-bold">
                    Stock: {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Recent Orders</h3>
            <Link href="/admin/orders" className="text-indigo-400 text-xs hover:underline">View All Orders</Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 text-xs">
                <div>
                  <p className="font-bold text-white">#{order.order_number} • {order.customer_name}</p>
                  <p className="text-slate-400 text-[10px]">{order.payment_method}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">${order.total_amount.toFixed(2)}</p>
                  <span className="text-[10px] text-indigo-400">{order.order_status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
