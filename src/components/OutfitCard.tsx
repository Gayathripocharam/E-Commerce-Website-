"use client";

import React, { useState } from 'react';
import { Heart, ExternalLink, Bookmark, Check, ChevronDown } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/useStore';

interface OutfitCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export default function OutfitCard({ product, onOpenDetails }: OutfitCardProps) {
  const { savedProductIds, toggleSaveProduct, boards, saveProductToBoard, trackAmazonClick } = useStore();
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [justSavedBoard, setJustSavedBoard] = useState<string | null>(null);

  const isSaved = savedProductIds.includes(product.id);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveProduct(product.id);
  };

  const handleBoardSave = (e: React.MouseEvent, boardId: string, boardTitle: string) => {
    e.stopPropagation();
    saveProductToBoard(product.id, boardId);
    setJustSavedBoard(boardTitle);
    setShowBoardDropdown(false);
    setTimeout(() => setJustSavedBoard(null), 2500);
  };



  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="masonry-item group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-brand-pink/15 bg-brand-champagne/45 flex flex-col animate-fade-in-up"
    >
      {/* Product Image Wrapper */}
      <div className="relative overflow-hidden w-full aspect-[2/3] hover-zoom bg-brand-pink-light/20">
        <img
          src={product.image_urls[0]}
          alt={product.title}
          className="w-full h-full object-cover rounded-t-3xl"
          loading="lazy"
        />

        {/* Dynamic Glass Overlay (Reveals on Hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy/80 via-brand-slate/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
          
          {/* Top Actions: Board Pinner */}
          <div className="flex justify-between items-center w-full relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBoardDropdown(!showBoardDropdown);
              }}
              className="flex items-center gap-1.5 bg-brand-cream/90 hover:bg-brand-cream border border-brand-pink/35 text-brand-burgundy text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105"
            >
              <Bookmark size={13} className="fill-brand-pink-light" />
              <span>Pin to Board</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${showBoardDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Board Selection Dropdown */}
            {showBoardDropdown && (
              <div className="absolute left-0 top-10 w-48 rounded-2xl bg-brand-champagne/95 backdrop-blur-md border border-brand-pink/40 shadow-xl p-2 z-50 flex flex-col gap-1 text-left">
                <p className="text-[10px] uppercase font-bold tracking-wider text-brand-pink-dark px-2.5 py-1">Save to Board</p>
                <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5">
                  {boards.map(b => (
                    <button
                      key={b.id}
                      onClick={(e) => handleBoardSave(e, b.id, b.title)}
                      className="w-full text-left text-xs font-medium text-brand-slate hover:text-brand-burgundy hover:bg-brand-pink-light/50 px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all"
                    >
                      <span className="truncate">{b.title}</span>
                      {b.savedProductIds.includes(product.id) && <Check size={12} className="text-brand-burgundy font-bold" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Quick Button */}
            <button
              onClick={handleSaveToggle}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cream/90 hover:bg-brand-cream text-brand-burgundy shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <Heart
                size={16}
                className={`${isSaved ? 'fill-brand-burgundy text-brand-burgundy' : 'text-brand-pink-dark'}`}
              />
            </button>
          </div>

          {/* Toast style board success pin alert */}
          {justSavedBoard && (
            <div className="absolute top-14 left-4 right-4 bg-brand-burgundy/90 text-brand-cream text-[11px] py-1.5 px-3 rounded-xl border border-brand-pink/30 flex items-center gap-1.5 shadow-md animate-pulse">
              <Check size={12} className="text-brand-pink" />
              <span className="truncate">Pinned to <strong>{justSavedBoard}</strong>!</span>
            </div>
          )}

          {/* Bottom Actions: Shop Redirect & Title */}
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[10px] uppercase tracking-widest text-brand-pink font-bold">
              {product.brand}
            </span>
            <h4 className="text-sm font-semibold text-brand-cream line-clamp-1 leading-snug">
              {product.title}
            </h4>
            
            <div className="flex items-center justify-between mt-1 pt-2 border-t border-brand-pink-light/20">
              <span className="text-brand-cream font-bold text-sm">
                ₹{product.discount_price.toLocaleString('en-IN')}
              </span>

              <a
                href={product.affiliate_url}
                target="_blank"
                rel="nofollow sponsored noopener"
                onClick={(e) => {
                  e.stopPropagation();
                  trackAmazonClick(product.id);
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-brand-pink to-brand-pink-dark hover:from-brand-pink-dark hover:to-brand-burgundy-light text-brand-cream text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 border border-brand-pink-light/25 select-none text-center cursor-pointer"
              >
                <span>Shop Now</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Static Visual Info (Shows when not hovered) */}
      <div className="p-4 flex flex-col gap-1 justify-between flex-grow">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-pink-dark font-bold">
            {product.brand}
          </span>
          <span className="text-[10px] font-semibold text-brand-burgundy/60 bg-brand-pink-light/30 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-sm font-semibold text-brand-slate line-clamp-1 leading-snug">
          {product.title}
        </h3>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-brand-pink/10">
          <span className="text-brand-burgundy font-bold text-sm">
            ₹{product.discount_price.toLocaleString('en-IN')}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-brand-pink capitalize px-1.5 py-0.5 border border-brand-pink/20 rounded">
              {product.color.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
}
