'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">About Zyvra</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Redefining Online Shopping with Innovation & Precision
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Founded with a vision to deliver uncompromising quality, Zyvra brings together state-of-the-art consumer electronics, trendsetting apparel, and artisan home decor. Backed by our powerful real-time admin control panel and AI-powered customer support, we ensure an exceptional shopping journey from click to doorstep.
          </p>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
            alt="About Zyvra"
            className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
          />
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Info */}
        <div className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 dark:text-white text-xl">Get in Touch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Have questions about our products, orders, or partnership opportunities? Reach out to our 24/7 support team.</p>
          
          <div className="space-y-4 pt-4 text-xs">
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>101 Tech Avenue, Silicon Valley, CA 94025</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>support@zyvra.com</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>+1 (800) 555-ZYVRA</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-6">Send Us a Message</h3>

          {sent && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 p-4 rounded-2xl mb-6 flex items-center space-x-3 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you! Your message has been sent successfully. We will reply within 24 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Your Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
