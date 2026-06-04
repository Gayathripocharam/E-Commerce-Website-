"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FolderHeart, Heart, Sparkles, PlusCircle, Check, Trash2, ArrowLeft, ArrowUpRight, FolderOpen } from 'lucide-react';
import { useStore, Board, CreatedOutfit } from '@/context/useStore';
import { Product, products } from '@/data/products';
import OutfitCard from '@/components/OutfitCard';
import OutfitDetailModal from '@/components/OutfitDetailModal';

function BoardsPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'boards';

  const {
    savedProductIds,
    boards,
    createdOutfits,
    createBoard,
    removeProductFromBoard,
    deleteCreatedOutfit
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // New Board Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newBoardCover, setNewBoardCover] = useState('');

  // Active Selected Board Deep-Dive
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Sync tab from search params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Load Saved Favorites Products
  const savedFavorites = React.useMemo(() => {
    return products.filter(p => savedProductIds.includes(p.id));
  }, [savedProductIds]);

  const handleCreateBoardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    createBoard(
      newBoardTitle.trim(),
      newBoardDesc.trim(),
      newBoardCover.trim() || undefined
    );

    // Reset Form
    setNewBoardTitle('');
    setNewBoardDesc('');
    setNewBoardCover('');
    setShowCreateModal(false);
  };

  const handleOpenDetails = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  const handleCloseDetails = () => {
    setActiveDetailProduct(null);
  };

  // Preset Board Cover Images
  const coverPresets = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in-up">
      {/* 1. Header Details */}
      {!selectedBoard ? (
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-pink-dark uppercase">MY STYLING VAULT</span>
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-brand-slate tracking-wide">
            My Closet & Boards
          </h1>
          <p className="text-xs md:text-sm text-brand-slate/60 max-w-xl mt-1 leading-relaxed">
            Manage your style boards, favorites list, and custom outfit coordinates in a unified aesthetic lookbook.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setSelectedBoard(null)}
            className="flex items-center gap-1 text-xs font-bold text-brand-pink-dark hover:text-brand-burgundy transition-all uppercase"
          >
            <ArrowLeft size={14} />
            <span>Back to Closet Hub</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-brand-pink/15">
            <div className="text-left">
              <span className="text-[10px] font-bold tracking-widest text-brand-pink-dark uppercase">STYLE BOARD PREVIEW</span>
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-brand-slate leading-tight mt-1">
                {selectedBoard.title}
              </h1>
              <p className="text-xs md:text-sm text-brand-slate/60 mt-1 max-w-xl leading-relaxed">
                {selectedBoard.description}
              </p>
            </div>
            <span className="text-xs font-bold text-brand-burgundy bg-brand-pink-light/50 border border-brand-pink/25 px-4 py-1.5 rounded-full shrink-0">
              {selectedBoard.savedProductIds.length} Saved Outfits
            </span>
          </div>
        </div>
      )}

      {/* 2. Closet Tabs Bar (Only shown when not deep-diving into a single board) */}
      {!selectedBoard && (
        <div className="flex border-b border-brand-pink/20 gap-2 md:gap-6">
          <button
            onClick={() => setActiveTab('boards')}
            className={`pb-4 text-sm font-semibold tracking-wide relative transition-all ${
              activeTab === 'boards' ? 'text-brand-burgundy' : 'text-brand-slate/50 hover:text-brand-burgundy'
            }`}
          >
            <span className="flex items-center gap-2">
              <FolderHeart size={16} />
              <span>Style Boards</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-pink-light/35 text-brand-pink font-semibold">
                {boards.length}
              </span>
            </span>
            {activeTab === 'boards' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-pink to-brand-burgundy" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 text-sm font-semibold tracking-wide relative transition-all ${
              activeTab === 'favorites' ? 'text-brand-burgundy' : 'text-brand-slate/50 hover:text-brand-burgundy'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart size={16} />
              <span>Saved Items</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-pink-light/35 text-brand-pink font-semibold">
                {savedFavorites.length}
              </span>
            </span>
            {activeTab === 'favorites' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-pink to-brand-burgundy" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('outfits')}
            className={`pb-4 text-sm font-semibold tracking-wide relative transition-all ${
              activeTab === 'outfits' ? 'text-brand-burgundy' : 'text-brand-slate/50 hover:text-brand-burgundy'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Custom Outfits</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-pink-light/35 text-brand-pink font-semibold">
                {createdOutfits.length}
              </span>
            </span>
            {activeTab === 'outfits' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-pink to-brand-burgundy" />
            )}
          </button>
        </div>
      )}

      {/* 3. Render Tab Content OR Single Board Deep Dive */}
      {selectedBoard ? (
        /* Single Board Deep Dive View */
        <div className="flex flex-col gap-6">
          {selectedBoard.savedProductIds.length > 0 ? (
            <div className="masonry-grid">
              {products
                .filter(p => selectedBoard.savedProductIds.includes(p.id))
                .map(product => (
                  <div key={product.id} className="relative group">
                    <OutfitCard
                      product={product}
                      onOpenDetails={handleOpenDetails}
                    />
                    {/* Board Unpin Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProductFromBoard(product.id, selectedBoard.id);
                        // Refresh the current active board view state
                        setSelectedBoard(prev => prev ? {
                          ...prev,
                          savedProductIds: prev.savedProductIds.filter(id => id !== product.id)
                        } : null);
                      }}
                      className="absolute top-3 left-3 z-20 hidden group-hover:flex items-center justify-center w-8 h-8 rounded-full bg-brand-burgundy hover:bg-brand-burgundy-light text-brand-cream border border-brand-pink/30 shadow-md backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                      title="Remove from board"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-16 text-center gap-4 bg-brand-champagne/40 rounded-3xl border border-brand-pink/20 border-dashed">
              <div className="w-12 h-12 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-burgundy">
                <FolderOpen size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-slate">No outfits in this board</h4>
                <p className="text-xs text-brand-slate/60 max-w-xs mt-1 leading-relaxed">
                  Go to our Discover Feed or AI Stylist, hover over style items, and pin them to <strong>{selectedBoard.title}</strong>!
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* General Tab Views */
        <div className="flex flex-col gap-6">
          
          {/* TAB A: MY STYLE BOARDS */}
          {activeTab === 'boards' && (
            <div className="flex flex-col gap-6">
              {/* Creator Trigger */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light hover:from-brand-burgundy-light hover:to-brand-pink-dark text-brand-cream font-semibold px-4.5 py-2.5 rounded-xl shadow-md border border-brand-pink/25 transition-all hover:scale-105 active:scale-95"
                >
                  <PlusCircle size={15} />
                  <span className="text-xs uppercase tracking-wider font-bold">New Board</span>
                </button>
              </div>

              {/* Boards List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {boards.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBoard(b)}
                    className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-brand-pink/15 bg-brand-champagne/45 flex flex-col aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(to bottom, rgba(44, 44, 44, 0.1), rgba(44, 44, 44, 0.75)), url(${b.cover_image})` }}
                  >
                    {/* Info Container */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pink">
                        {b.savedProductIds.length} Items Saved
                      </span>
                      <h3 className="text-xl font-display font-semibold text-brand-cream line-clamp-1 leading-snug mt-1 group-hover:underline">
                        {b.title}
                      </h3>
                      <p className="text-xs text-brand-cream/80 line-clamp-1 mt-1 leading-normal">
                        {b.description}
                      </p>
                    </div>
                    {/* Hover Glow borders */}
                    <div className="absolute inset-0 border-2 border-brand-pink/0 group-hover:border-brand-pink/40 rounded-3xl transition-all duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB B: SAVED ITEMS (FAVORITES) */}
          {activeTab === 'favorites' && (
            <div>
              {savedFavorites.length > 0 ? (
                <div className="masonry-grid">
                  {savedFavorites.map(product => (
                    <OutfitCard
                      key={product.id}
                      product={product}
                      onOpenDetails={handleOpenDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-16 text-center gap-4 bg-brand-champagne/40 rounded-3xl border border-brand-pink/20 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-burgundy">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-slate">No saved closet items</h4>
                    <p className="text-xs text-brand-slate/60 max-w-xs mt-1 leading-relaxed">
                      Start browsing our fashion catalogs and pin your favorite kurtis, tops, jeans, and shoes to populate your digital closet!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB C: CUSTOM CREATED OUTFITS */}
          {activeTab === 'outfits' && (
            <div className="flex flex-col gap-6 text-left">
              {createdOutfits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {createdOutfits.map(outfit => {
                    const topItem = products.find(p => p.id === outfit.topId);
                    const bottomItem = products.find(p => p.id === outfit.bottomId);
                    const footwearItem = products.find(p => p.id === outfit.footwearId);

                    return (
                      <div
                        key={outfit.id}
                        className="rounded-3xl glassmorphism bg-brand-champagne/45 p-5 border border-brand-pink/20 shadow-md flex flex-col gap-4 relative overflow-hidden group"
                      >
                        {/* Title details & delete */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="text-left">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-brand-pink-dark">CUSTOM DESIGNED STYLE</span>
                            <h3 className="text-lg font-semibold text-brand-slate mt-0.5 line-clamp-1">{outfit.title}</h3>
                            <span className="text-[10px] text-brand-slate/50 font-medium">Styled on {outfit.dateCreated}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Harmony badge */}
                            <div className="bg-brand-burgundy text-brand-cream text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-brand-pink/35 shadow-sm">
                              {outfit.harmonyScore}% Score
                            </div>
                            
                            {/* Trash action */}
                            <button
                              onClick={() => deleteCreatedOutfit(outfit.id)}
                              className="text-brand-slate/40 hover:text-brand-burgundy p-1.5 rounded-lg hover:bg-brand-pink-light/30 transition-all"
                              title="Delete outfit"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Collaged Outfit components */}
                        <div className="grid grid-cols-3 gap-2 bg-brand-pink-light/10 p-2 rounded-2xl border border-brand-pink/10">
                          {topItem && (
                            <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => handleOpenDetails(topItem)}>
                              <img src={topItem.image_urls[0]} className="aspect-square w-full object-cover rounded-xl border border-brand-pink/15 shadow-sm" />
                              <span className="text-[9px] font-bold text-brand-slate/60 truncate w-full text-center mt-1">{topItem.title}</span>
                            </div>
                          )}
                          {bottomItem && (
                            <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => handleOpenDetails(bottomItem)}>
                              <img src={bottomItem.image_urls[0]} className="aspect-square w-full object-cover rounded-xl border border-brand-pink/15 shadow-sm" />
                              <span className="text-[9px] font-bold text-brand-slate/60 truncate w-full text-center mt-1">{bottomItem.title}</span>
                            </div>
                          )}
                          {footwearItem && (
                            <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => handleOpenDetails(footwearItem)}>
                              <img src={footwearItem.image_urls[0]} className="aspect-square w-full object-cover rounded-xl border border-brand-pink/15 shadow-sm" />
                              <span className="text-[9px] font-bold text-brand-slate/60 truncate w-full text-center mt-1">{footwearItem.title}</span>
                            </div>
                          )}
                        </div>

                        {/* AI Stylist remark quote */}
                        <div className="bg-brand-cream/80 border border-brand-pink/15 rounded-2xl p-4 flex flex-col gap-1.5 text-left">
                          <span className="text-[9px] uppercase tracking-wider text-brand-burgundy font-extrabold flex items-center gap-1 leading-none">
                            <Sparkles size={11} className="text-brand-pink" />
                            <span>AI Stylist Critique</span>
                          </span>
                          <p className="text-xs text-brand-slate/85 leading-normal italic line-clamp-3">
                            "{outfit.stylistReview}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-16 text-center gap-4 bg-brand-champagne/40 rounded-3xl border border-brand-pink/20 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-burgundy">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-slate">No custom styled outfits</h4>
                    <p className="text-xs text-brand-slate/60 max-w-xs mt-1 leading-relaxed">
                      Go to the Outfit Builder tab to mix, match, generate coordination scores, and save your high-fashion combinations!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* POPUP MODAL: CREATE NEW STYLE BOARD */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-burgundy/40 backdrop-blur-md animate-fade-in-up">
          <div className="w-full max-w-md bg-brand-champagne border border-brand-pink/35 rounded-3xl shadow-2xl p-6 relative">
            <h2 className="text-2xl font-display font-semibold text-brand-burgundy mb-4 text-left">Create New Board</h2>
            
            <form onSubmit={handleCreateBoardSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-pink-dark">Board Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream Date Aesthetic, Work Essentials"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl bg-brand-cream/80 border border-brand-pink/25 focus:border-brand-pink text-brand-slate px-3.5 py-3 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-pink-dark">Mood Description</label>
                <textarea
                  placeholder="Optional: What styles, outfits, or feelings go here?"
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-medium rounded-xl bg-brand-cream/80 border border-brand-pink/25 focus:border-brand-pink text-brand-slate px-3.5 py-3 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Cover Presets selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-pink-dark">Select Mood Cover Card</label>
                <div className="flex gap-2">
                  {coverPresets.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setNewBoardCover(imgUrl)}
                      className={`relative flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        newBoardCover === imgUrl ? 'border-brand-burgundy scale-95 shadow' : 'border-brand-pink/15 hover:border-brand-pink/40'
                      }`}
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" />
                      {newBoardCover === imgUrl && (
                        <div className="absolute inset-0 bg-brand-burgundy/25 flex items-center justify-center">
                          <Check size={16} className="text-brand-cream font-bold" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-brand-pink/15">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-brand-pink/30 hover:bg-brand-pink-light/20 text-brand-slate font-semibold text-xs py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light hover:from-brand-burgundy-light hover:to-brand-pink-dark text-brand-cream font-semibold text-xs py-3 rounded-xl transition-all shadow-md"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Details Modal Overlay */}
      {activeDetailProduct && (
        <OutfitDetailModal
          product={activeDetailProduct}
          onClose={handleCloseDetails}
          onOpenAnotherProduct={handleOpenDetails}
        />
      )}

    </div>
  );
}

export default function BoardsPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh] text-brand-burgundy">
        <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
      </div>
    }>
      <BoardsPageContent />
    </React.Suspense>
  );
}
