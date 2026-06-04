"use client";

import React, { useState, useEffect } from 'react';
import { X, Heart, ExternalLink, Bookmark, Check, ChevronRight } from 'lucide-react';
import { Product, products } from '../data/products';
import { useStore } from '../context/useStore';

interface OutfitDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenAnotherProduct: (product: Product) => void;
}

export default function OutfitDetailModal({ product, onClose, onOpenAnotherProduct }: OutfitDetailModalProps) {
  const { savedProductIds, toggleSaveProduct, boards, saveProductToBoard, trackInteraction, trackAmazonClick } = useStore();
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [isSavedToBoard, setIsSavedToBoard] = useState(false);


  // Track interaction when modal opens
  useEffect(() => {
    if (product) {
      trackInteraction(product.category, product.color);
    }
  }, [product]);

  if (!product) return null;

  const isSaved = savedProductIds.includes(product.id);

  // Dynamic recommendation algorithm for "Similar Outfits"
  const getSimilarOutfits = (): Product[] => {
    return products
      .filter(p => p.id !== product.id) // exclude current item
      .map(p => {
        let score = 0;
        if (p.category === product.category) score += 4;
        if (p.occasion === product.occasion) score += 3;
        if (p.style === product.style) score += 2;
        
        // Approximate color match
        const baseColor = (c: string) => c.toLowerCase().split(' ')[0];
        if (baseColor(p.color) === baseColor(product.color)) score += 3;

        return { product: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4) // return top 4 similar items
      .map(item => item.product);
  };

  const similarItems = getSimilarOutfits();

  const handleSaveToBoard = () => {
    if (!selectedBoardId) return;
    saveProductToBoard(product.id, selectedBoardId);
    setIsSavedToBoard(true);
    setTimeout(() => setIsSavedToBoard(false), 2000);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-burgundy/40 backdrop-blur-md animate-fade-in-up">
      {/* Modal Card container */}
      <div className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] bg-brand-champagne/95 border border-brand-pink/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-brand-cream hover:bg-brand-pink-light text-brand-burgundy border border-brand-pink/35 shadow-md transition-transform hover:scale-110 active:scale-95"
        >
          <X size={20} />
        </button>

        {/* Left Half: Product Image */}
        <div className="relative w-full md:w-1/2 h-2/5 md:h-full bg-brand-pink-light/20 flex items-center justify-center border-b md:border-b-0 md:border-r border-brand-pink/20">
          <img
            src={product.image_urls[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent hidden md:block" />
        </div>

        {/* Right Half: Details & Controls */}
        <div className="w-full md:w-1/2 h-3/5 md:h-full flex flex-col p-6 md:p-8 overflow-y-auto">
          {/* Category & Brand */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-pink-dark">
              {product.brand}
            </span>
            <span className="text-xs font-semibold text-brand-burgundy bg-brand-pink-light/50 px-3 py-1 rounded-full border border-brand-pink/20">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-brand-slate tracking-wide mb-4">
            {product.title}
          </h2>

          {/* Price & Favorite Action */}
          <div className="flex items-center justify-between py-3 border-y border-brand-pink/15 mb-4">
            <div>
              <span className="text-xs text-brand-slate/50 block font-medium tracking-wide">ESTIMATED PRICE</span>
              <span className="text-2xl font-bold text-brand-burgundy">
                ₹{product.discount_price.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => toggleSaveProduct(product.id)}
              className="flex items-center gap-2 bg-brand-cream hover:bg-brand-pink-light/35 border border-brand-pink/20 hover:border-brand-pink/40 px-4 py-2 rounded-full text-sm font-semibold text-brand-burgundy transition-all hover:scale-105"
            >
              <Heart size={16} className={isSaved ? 'fill-brand-burgundy text-brand-burgundy' : 'text-brand-pink-dark'} />
              <span>{isSaved ? 'In Closet' : 'Save to Closet'}</span>
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-pink-dark mb-1">Description</h3>
            <p className="text-sm text-brand-slate/85 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Style Attributes & Tags */}
          <div className="grid grid-cols-2 gap-3 mb-6 bg-brand-pink-light/20 p-4 rounded-2xl border border-brand-pink/10">
            <div>
              <span className="text-[10px] text-brand-slate/50 block font-bold">OCCASION</span>
              <span className="text-sm font-semibold text-brand-slate">{product.occasion}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-slate/50 block font-bold">STYLE AESTHETIC</span>
              <span className="text-sm font-semibold text-brand-slate">{product.style}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-slate/50 block font-bold">COLOR TONALITY</span>
              <span className="text-sm font-semibold text-brand-slate">{product.color}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-slate/50 block font-bold">AFFILIATE CHANNEL</span>
              <span className="text-sm font-semibold text-brand-burgundy font-medium tracking-wide">
                {product.affiliate_url.replace('https://www.', '')}
              </span>
            </div>
          </div>

          {/* Save to Custom Boards */}
          <div className="mb-6 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-pink-dark">Organize into Board</h3>
            <div className="flex gap-2">
              <select
                value={selectedBoardId}
                onChange={(e) => {
                  setSelectedBoardId(e.target.value);
                  setIsSavedToBoard(false);
                }}
                className="flex-grow rounded-xl bg-brand-cream/80 border border-brand-pink/30 text-xs font-medium text-brand-slate px-3 py-2 focus:outline-none focus:border-brand-pink transition-all"
              >
                <option value="">Select a style board...</option>
                {boards.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveToBoard}
                disabled={!selectedBoardId}
                className="flex items-center gap-1.5 bg-brand-cream hover:bg-brand-pink-light text-brand-burgundy border border-brand-pink/30 hover:border-brand-pink/60 text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-40 disabled:hover:bg-brand-cream transition-all shrink-0"
              >
                {isSavedToBoard ? <Check size={14} className="text-brand-burgundy" /> : <Bookmark size={14} />}
                <span>{isSavedToBoard ? 'Pinned!' : 'Pin'}</span>
              </button>
            </div>
          </div>

          {/* Shop Affiliate Button */}
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener"
            onClick={() => {
              trackAmazonClick(product.id);
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light hover:from-brand-burgundy-light hover:to-brand-pink-dark text-brand-cream font-semibold py-3.5 rounded-2xl shadow-lg border border-brand-pink/20 hover:scale-[1.01] transition-all duration-300 select-none text-center cursor-pointer"
          >
            <span>Shop this Product</span>
            <ExternalLink size={16} />
          </a>

          {/* Similar Items (Pinterest styled visual search inline recommendations) */}
          {similarItems.length > 0 && (
            <div className="mt-8 pt-6 border-t border-brand-pink/15">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-pink-dark mb-3 flex items-center gap-1">
                <span>Similar Outfits We Love</span>
                <ChevronRight size={14} />
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onOpenAnotherProduct(item)}
                    className="group flex flex-col gap-1 cursor-pointer bg-brand-cream/40 rounded-2xl p-1.5 border border-brand-pink/10 hover:border-brand-pink/40 hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-brand-pink-light/10">
                      <img
                        src={item.image_urls[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-brand-pink-dark font-bold leading-none mt-1">
                      {item.brand}
                    </span>
                    <h4 className="text-[11px] font-semibold text-brand-slate line-clamp-1 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-10px font-bold text-brand-burgundy">
                      ₹{item.discount_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>



    </div>
  );
}
