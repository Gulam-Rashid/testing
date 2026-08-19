import Link from 'next/link';
import db from '@/lib/db';
import { ArrowRight, Star, ShieldCheck, Zap, Sparkles, ShoppingBag } from 'lucide-react';

export default function Home() {
  const categories = db.prepare('SELECT * FROM categories').all() as any[];
  const featuredProducts = db.prepare('SELECT * FROM products WHERE is_featured = 1 LIMIT 8').all() as any[];
  const trendingProducts = db.prepare('SELECT * FROM products WHERE is_trending = 1 LIMIT 4').all() as any[];
  const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1').all() as any[];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-full text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Zyvra Spring 2026 Collection</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                Elevate Your Lifestyle with <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Zyvra</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Discover world-class electronics, artisan home decor, and cutting-edge fashion curated for modern tastemakers.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/products"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/admin"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-8 py-4 rounded-2xl flex items-center space-x-2 transition"
                >
                  <span>Admin Panel 👑</span>
                </Link>
              </div>
            </div>

            {/* Hero Image / Card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-600 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-2xl">
                <img
                  src={banners[0]?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                  alt="Zyvra Featured"
                  className="w-full h-80 object-cover rounded-2xl shadow-md mb-6"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-indigo-400 font-semibold text-xs uppercase tracking-widest">Featured Device</span>
                    <h3 className="text-white font-bold text-lg">Zyvra Apex Pro ANC Headphones</h3>
                  </div>
                  <Link href="/products/zyvra-apex-pro-headphones" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition">
                    <ShoppingBag className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shop by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Explore curated collections designed for your world</p>
          </div>
          <Link href="/products" className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition transform hover:-translate-y-1 text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-indigo-600 transition">{cat.name}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Top Rated & Featured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Featured Products</h2>
          </div>
          <Link href="/products" className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline flex items-center space-x-1">
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 dark:border-slate-800 transition flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {product.compare_price && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                    Sale
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviews_count})</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-indigo-600 transition">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                    {product.compare_price && (
                      <span className="text-xs text-slate-400 line-through ml-2">${product.compare_price.toFixed(2)}</span>
                    )}
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-4 max-w-xl z-10 mb-6 md:mb-0">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Zyvra AI Smart Recommendation Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Need help picking the perfect gear?</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Our AI assistant analyzes thousands of reviews and user preferences to recommend tailored products instantly. Try asking our 24/7 AI chat widget below!
            </p>
          </div>
          <div className="z-10">
            <Link
              href="/products"
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition inline-flex items-center space-x-2"
            >
              <span>Explore AI Picks</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
