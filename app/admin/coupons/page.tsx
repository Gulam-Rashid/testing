'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await fetch('/api/coupons');
    const data = await res.json();
    if (data.coupons) setCoupons(data.coupons);
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Coupons & Discount System</h1>
        <p className="text-slate-400 text-xs mt-1">Active promotional discount codes</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Spend</th>
              <th className="p-4">Status</th>
              <th className="p-4">Expires At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/30 transition">
                <td className="p-4 font-mono font-bold text-white text-sm">{c.code}</td>
                <td className="p-4 text-indigo-400 font-bold">
                  {c.discount_percent ? `${c.discount_percent}% OFF` : `$${c.discount_amount} OFF`}
                </td>
                <td className="p-4 text-slate-300">${c.min_spend}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    Active
                  </span>
                </td>
                <td className="p-4 text-slate-400">{c.expires_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
