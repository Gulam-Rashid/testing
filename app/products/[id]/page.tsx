'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
        setActiveImage(data.product.image);
        setReviews(data.reviews || []);
      }
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        if (data.error.includes('login')) router.push('/auth');
      } else {
        setAdded(true);
        window.dispatchEvent(new Event('zyvra_update'));
        setTimeout(() => setAdded(false), 3000);
      }
    } catch {
      alert('Failed to add item to cart');
    }
  };

  if (loading) {
    return <div className="text-center py-32 text-slate-400">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => router.push('/products')} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">
          Back to Shop
        </button>
      </div>
    );
  }

  let images = [product.image];
  try {
    if (product.images) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) images = parsed;
    }
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Images */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg h-96 sm:h-[450px]">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${
                    activeImage === img ? 'border-indigo-600 shadow-md' : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {product.category_name || 'Zyvra Collection'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 mb-3">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-amber-500 text-sm font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-400">({product.reviews_count} customer reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-lg text-slate-400 line-through">${product.compare_price.toFixed(2)}</span>
            )}
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
              In Stock ({product.stock} available)
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900">
              <Truck className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">100% Secure</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900">
              <RotateCcw className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">30-Day Return</span>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Customer Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-slate-500 text-sm">No reviews yet for this product. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{r.user_name || 'Verified Customer'}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
