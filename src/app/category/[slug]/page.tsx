"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { useStore } from '@/context/useStore';
import { Product, products } from '@/data/products';
import OutfitCard from '@/components/OutfitCard';
import OutfitDetailModal from '@/components/OutfitDetailModal';
import { ArrowLeft, SlidersHorizontal, FolderOpen, Tag, Compass } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(rawSlug);
  const router = useRouter();

  const { trackCategoryView } = useStore();
  
  // State variables
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');

  // Track category page hit views in Analytics Engine
  useEffect(() => {
    if (decodedSlug) {
      trackCategoryView(decodedSlug);
    }
  }, [decodedSlug]);

  // Decode active category products catalog list
  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category.toLowerCase() === decodedSlug.toLowerCase());
  }, [decodedSlug]);

  // Clean title presentation
  const categoryTitle = useMemo(() => {
    if (decodedSlug.toLowerCase() === 'bottom wear') return "Bottom Wear";
    return decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
  }, [decodedSlug]);

  // Dynamic filter lists
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(p => {
      const matchPrice = p.discount_price <= priceRange;
      const matchStyle = selectedStyle === 'all' || p.style === selectedStyle;
      const matchOccasion = selectedOccasion === 'all' || p.occasion === selectedOccasion;
      return matchPrice && matchStyle && matchOccasion;
    });
  }, [categoryProducts, priceRange, selectedStyle, selectedOccasion]);

  const handleOpenDetails = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  const handleCloseDetails = () => {
    setActiveDetailProduct(null);
  };

  const handleOpenAnotherProduct = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  // Preset styles & occasion lists
  const stylePresets = ['all', 'Traditional', 'Boho', 'Glamorous', 'Chic', 'Professional'];
  const occasionPresets = ['all', 'Wedding', 'Festival', 'Casual', 'Office', 'Summer'];

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in-up">
      {/* 1. Header Navigation */}
      <div className="flex flex-col gap-4 text-left">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-bold text-brand-pink-dark hover:text-brand-burgundy transition-all uppercase"
        >
          <ArrowLeft size={14} />
          <span>Back to Feed</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-brand-pink/15">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-pink-dark uppercase">DEPARTMENT DIRECTORY</span>
            <h1 className="text-3xl md:text-5xl font-display font-semibold text-brand-slate leading-tight mt-1">
              Curated {categoryTitle}
            </h1>
            <p className="text-xs md:text-sm text-brand-slate/60 mt-1 max-w-xl leading-relaxed">
              Explore professional Amazon India picks in {categoryTitle}. Find coordinating heels, bags, and ornaments, and pin them to your custom mood boards.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-burgundy bg-brand-pink-light/50 border border-brand-pink/25 px-4 py-1.5 rounded-full shrink-0">
            {categoryProducts.length} Items Listed
          </span>
        </div>
      </div>

      {/* 2. Filter Dashboard Control panel */}
      {categoryProducts.length > 0 && (
        <div className="rounded-3xl glassmorphism bg-brand-champagne/45 p-6 border border-brand-pink/20 shadow-sm flex flex-col gap-5 text-left">
          <span className="text-xs font-bold tracking-wider text-brand-burgundy uppercase flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-brand-pink" />
            <span>Search & Filter Specifications</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Slide */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-pink-dark flex justify-between">
                <span>Maximum Budget Price</span>
                <span className="text-brand-burgundy font-extrabold">₹{priceRange.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-pink-light/45 rounded-lg appearance-none cursor-pointer accent-brand-burgundy"
              />
              <div className="flex justify-between text-[9px] font-bold text-brand-slate/40">
                <span>₹300</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Style Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-pink-dark">Filter Style Aesthetic</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="rounded-xl bg-brand-cream/80 border border-brand-pink/25 text-xs font-medium text-brand-slate px-3.5 py-2.5 focus:outline-none focus:border-brand-pink transition-all"
              >
                {stylePresets.map(style => (
                  <option key={style} value={style}>
                    {style === 'all' ? 'All style aesthetics' : style}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-pink-dark">Filter Occasion Wear</label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="rounded-xl bg-brand-cream/80 border border-brand-pink/25 text-xs font-medium text-brand-slate px-3.5 py-2.5 focus:outline-none focus:border-brand-pink transition-all"
              >
                {occasionPresets.map(occ => (
                  <option key={occ} value={occ}>
                    {occ === 'all' ? 'All occasion logs' : occ}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      )}

      {/* 3. Products Catalog Masonry Feed */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-brand-pink/15 pb-2">
          <Compass size={16} className="text-brand-burgundy animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate/60">
            Discover {categoryTitle} Grid ({filteredProducts.length})
          </h3>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="masonry-grid">
            {filteredProducts.map((product) => (
              <OutfitCard
                key={product.id}
                product={product}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 text-center gap-4 bg-brand-champagne/40 rounded-3xl border border-brand-pink/20 border-dashed">
            <div className="w-12 h-12 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-burgundy">
              <FolderOpen size={22} />
            </div>
            <div>
              <h4 className="font-semibold text-brand-slate">No matching items found</h4>
              <p className="text-xs text-brand-slate/60 max-w-xs mt-1 leading-relaxed">
                Try widening your price range slider or resetting the Style and Occasion filters to search more in this category!
              </p>
            </div>
            <button
              onClick={() => {
                setPriceRange(10000);
                setSelectedStyle('all');
                setSelectedOccasion('all');
              }}
              className="bg-brand-burgundy text-brand-cream text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-burgundy-light shadow transition-all uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Global Details Modal Overlay */}
      {activeDetailProduct && (
        <OutfitDetailModal
          product={activeDetailProduct}
          onClose={handleCloseDetails}
          onOpenAnotherProduct={handleOpenAnotherProduct}
        />
      )}

    </div>
  );
}
