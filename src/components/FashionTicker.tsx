"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { products } from '../data/products';

// Pick clothing-only items for the ticker (anything with an image that looks good in a portrait card)
const TICKER_PRODUCTS = products.slice(0, 12); // use first 12 products

export default function FashionTicker() {
  const router = useRouter();

  // Duplicate the list so the seamless loop never shows a gap
  const doubled = [...TICKER_PRODUCTS, ...TICKER_PRODUCTS];

  return (
    <section className="relative flex flex-col gap-3 -mx-4 md:-mx-8">
      {/* Section label */}
      <div className="px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-brand-pink-dark uppercase">
            New Arrivals · Scroll to Explore
          </span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-[10px] font-bold text-brand-burgundy/60 hover:text-brand-burgundy transition-colors tracking-wide"
        >
          View All →
        </button>
      </div>

      {/* Ticker wrap — fades edges */}
      <div className="fashion-ticker-wrap py-1">
        <div className="fashion-ticker-track gap-4 px-2">
          {doubled.map((prod, idx) => {
            const off = Math.round(((prod.price - prod.discount_price) / prod.price) * 100);
            return (
              <button
                key={`${prod.id}-${idx}`}
                onClick={() => router.push(`/product/${prod.id}`)}
                className="group shrink-0 w-36 sm:w-44 flex flex-col gap-2 text-left focus:outline-none"
                title={prod.title}
              >
                {/* Product image card */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-brand-pink/20 shadow-sm bg-brand-pink-light/20 group-hover:border-brand-pink/50 group-hover:shadow-md transition-all duration-300">
                  <img
                    src={prod.image_urls[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Discount badge */}
                  {off > 0 && (
                    <span className="absolute top-2 left-2 bg-brand-burgundy text-brand-cream text-[8px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      {off}% OFF
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-brand-cream text-[10px] font-bold leading-tight line-clamp-2">
                      {prod.title}
                    </span>
                  </div>
                </div>

                {/* Price row */}
                <div className="flex items-baseline gap-1.5 px-0.5">
                  <span className="text-xs font-extrabold text-brand-burgundy">
                    ₹{prod.discount_price.toLocaleString('en-IN')}
                  </span>
                  {prod.price !== prod.discount_price && (
                    <span className="text-[9px] text-brand-slate/40 line-through">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Brand */}
                <span className="text-[8px] uppercase tracking-widest font-extrabold text-brand-pink-dark px-0.5 -mt-1.5 truncate">
                  {prod.brand}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
