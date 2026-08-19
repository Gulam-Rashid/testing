'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders?all=true');
    const data = await res.json();
    if (data.orders) setOrders(data.orders);
  };

  const updateStatus = async (id: number, order_status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status })
    });
    const data = await res.json();
    if (data.success) fetchOrders();
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Order Management</h1>
        <p className="text-slate-400 text-xs mt-1">Review customer orders and update fulfillment status</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-black text-white text-base">Order #{order.order_number}</h3>
                  <span className="text-xs text-slate-400">• {order.customer_name} ({order.customer_email})</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={order.order_status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold focus:outline-none border border-slate-700"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span className="text-lg font-black text-white">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-800" />
                    <div>
                      <p className="font-bold text-white">{item.product_name}</p>
                      <p className="text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-2">
              <p>Shipping Address: <span className="text-white font-semibold">{order.shipping_address}</span></p>
              <p>Payment: <span className="text-white font-semibold">{order.payment_method} ({order.payment_status})</span></p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
