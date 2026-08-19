'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Shield, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user || data.user.role !== 'admin') {
        router.push('/auth');
      } else {
        setIsAdmin(true);
      }
    } catch {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-32 text-slate-400">Verifying Admin Access...</div>;
  }

  if (!isAdmin) return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Product Management', icon: Package },
    { href: '/admin/orders', label: 'Order Management', icon: ShoppingCart },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/coupons', label: 'Coupons & Discounts', icon: Tag },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              👑
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-wider">ZYVRA ADMIN</span>
              <p className="text-[10px] text-indigo-400 font-semibold">Secure Control Center</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
