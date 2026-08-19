'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Global Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Secure Payment</h4>
              <p className="text-xs text-slate-400">100% secure checkout & COD</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">30-Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 AI Support</h4>
              <p className="text-xs text-slate-400">Instant expert assistance</p>
            </div>
          </div>
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                Z
              </div>
              <span className="text-xl font-black text-white">ZYVRA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Zyvra is a premier next-generation e-commerce platform delivering high-end electronics, designer apparel, and lifestyle innovations with robust admin control.
            </p>
            <div className="text-xs text-indigo-400 font-semibold">
              👑 Admin Panel: <Link href="/admin" className="underline hover:text-indigo-300">/admin</Link> (admin@zyvra.com / admin123)
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-indigo-400 transition">Home Page</Link></li>
              <li><Link href="/products" className="hover:text-indigo-400 transition">All Products & Shop</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-400 transition">Shopping Cart</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition">User Dashboard</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400 transition">About & Contact</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=electronics" className="hover:text-indigo-400 transition">Electronics & Gadgets</Link></li>
              <li><Link href="/products?category=fashion" className="hover:text-indigo-400 transition">Fashion & Apparel</Link></li>
              <li><Link href="/products?category=home-living" className="hover:text-indigo-400 transition">Home & Living</Link></li>
              <li><Link href="/products?category=fitness" className="hover:text-indigo-400 transition">Fitness & Health</Link></li>
              <li><Link href="/products?category=beauty" className="hover:text-indigo-400 transition">Beauty & Skincare</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Newsletter</h5>
            <p className="text-xs text-slate-400 mb-4">Subscribe to receive exclusive deals, VIP coupon drops, and new product releases.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully to Zyvra Newsletter!'); }} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="bg-slate-800 text-slate-200 px-3 py-2 rounded-l-xl text-xs focus:outline-none w-full border border-slate-700"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-xl text-xs font-semibold transition">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Zyvra E-commerce Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Powered by Next.js & SQLite | Secure SSL Encrypted</p>
        </div>

      </div>
    </footer>
  );
}
