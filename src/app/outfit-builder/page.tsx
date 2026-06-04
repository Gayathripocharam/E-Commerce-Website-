"use client";

import React, { useState, useMemo } from 'react';
import { Layers, Palette, Sparkles, Check, Bookmark, ArrowRight, RefreshCw, ShoppingCart } from 'lucide-react';
import { useStore } from '@/context/useStore';
import { Product, products } from '@/data/products';

function getProductType(product: Product): 'top' | 'bottom' | 'footwear' | 'other' {
  const cat = product.category;
  if (cat === 'Tops' || cat === 'Kurtis' || cat === 'Sarees' || cat === 'Dresses') return 'top';
  if (cat === 'Bottom Wear') return 'bottom';
  if (cat === 'Footwear') return 'footwear';
  return 'other';
}

export default function OutfitBuilder() {
  const { saveCreatedOutfit, boards, saveProductToBoard } = useStore();
  const [activeTab, setActiveTab] = useState<'top' | 'bottom' | 'footwear'>('top');
  
  // Selected builder slots
  const [selectedTop, setSelectedTop] = useState<Product | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(null);
  const [selectedFootwear, setSelectedFootwear] = useState<Product | null>(null);

  // Custom metadata input for saving look
  const [outfitTitle, setOutfitTitle] = useState('');
  const [outfitDescription, setOutfitDescription] = useState('');
  const [targetBoardId, setTargetBoardId] = useState('');
  
  // Stylist review states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{ score: number; text: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter catalog items by slot type
  const tops = useMemo(() => products.filter(p => getProductType(p) === 'top'), []);
  const bottoms = useMemo(() => products.filter(p => getProductType(p) === 'bottom'), []);
  const footwear = useMemo(() => products.filter(p => getProductType(p) === 'footwear'), []);

  const activeCatalog = useMemo(() => {
    if (activeTab === 'top') return tops;
    if (activeTab === 'bottom') return bottoms;
    return footwear;
  }, [activeTab, tops, bottoms, footwear]);

  const selectItem = (product: Product) => {
    setReviewResult(null); // Reset review when selection changes
    setSaveSuccess(false);
    const pType = getProductType(product);
    if (pType === 'top') setSelectedTop(product);
    else if (pType === 'bottom') setSelectedBottom(product);
    else if (pType === 'footwear') setSelectedFootwear(product);
  };

  const clearCanvas = () => {
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedFootwear(null);
    setReviewResult(null);
    setOutfitTitle('');
    setOutfitDescription('');
    setSaveSuccess(false);
  };

  // Automated style-matching analysis engine
  const handleAnalyzeOutfit = () => {
    if (!selectedTop || !selectedBottom || !selectedFootwear) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      // Programmatic evaluation logic based on occasions, colors, styles
      let harmonyScore = 75; // baseline
      
      const occasions = [selectedTop.occasion, selectedBottom.occasion, selectedFootwear.occasion];
      const styles = [selectedTop.style, selectedBottom.style, selectedFootwear.style];
      const colors = [selectedTop.color.toLowerCase(), selectedBottom.color.toLowerCase(), selectedFootwear.color.toLowerCase()];

      // 1. Check occasion consistency
      const uniqueOccasions = new Set(occasions);
      if (uniqueOccasions.size === 1) harmonyScore += 15; // perfect matching occasion
      else if (uniqueOccasions.size === 2) harmonyScore += 8;

      // 2. Check styling consistency
      const uniqueStyles = new Set(styles);
      if (uniqueStyles.size === 1) harmonyScore += 10;
      else if (uniqueStyles.size === 2) harmonyScore += 5;

      // 3. Color coordination
      const isMonochrome = new Set(colors.map(c => c.split(' ')[0])).size === 1;
      const hasGoldAccent = colors.some(c => c.includes('gold') || c.includes('champagne'));
      const hasPinkAccent = colors.some(c => c.includes('pink') || c.includes('rose'));
      const hasNeutralAccent = colors.some(c => c.includes('beige') || c.includes('white') || c.includes('sand'));

      if (isMonochrome) harmonyScore += 8;
      if (hasGoldAccent && (occasions.includes('Wedding') || occasions.includes('Party'))) harmonyScore += 7;
      if (hasPinkAccent && hasNeutralAccent) harmonyScore += 6;

      // Caps out at 99
      harmonyScore = Math.min(harmonyScore, 99);

      // Generate customized critique text
      let critiqueText = '';
      
      if (harmonyScore >= 90) {
        critiqueText = `Outstanding coordination! 🌟 Combining the "${selectedTop.title}" and the "${selectedBottom.title}" creates an exceptionally unified silhouette. Pairing these with the "${selectedFootwear.title}" anchors the look with high-fashion credentials. The ${selectedTop.color} accents offset the ${selectedBottom.color} bottoms beautifully, establishing an elegant, premium mood ideal for ${selectedTop.occasion} atmospheres.`;
      } else if (harmonyScore >= 80) {
        critiqueText = `Beautifully put together! 💫 The aesthetic balance of this outfit is highly chic. Pairing the "${selectedTop.style}" top with "${selectedBottom.style}" bottoms works marvelously, and adding the ${selectedFootwear.title} rounds out the set nicely. This look speaks of smart curation, perfect for ${selectedTop.occasion} or transitional ${selectedBottom.occasion} days.`;
      } else {
        critiqueText = `A creative, daring outfit choice! 🎨 Combining different styles—specifically a ${selectedTop.style} top with ${selectedBottom.style} bottoms—offers a refreshing, non-traditional edge. The ${selectedFootwear.title} adds high-contrast character. This fusion is fun, eclectic, and showcases individual confidence. Excellent choice for custom experimental outfits!`;
      }

      setReviewResult({
        score: harmonyScore,
        text: critiqueText
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSaveOutfit = () => {
    if (!selectedTop || !selectedBottom || !selectedFootwear || !reviewResult) return;

    const title = outfitTitle.trim() || `My Styled Look - ${new Date().toLocaleDateString()}`;
    const description = outfitDescription.trim() || `A customized combination featuring a ${selectedTop.color} top and ${selectedBottom.color} bottoms.`;

    // Save custom outfit to Closet Store
    saveCreatedOutfit({
      title,
      topId: selectedTop.id,
      bottomId: selectedBottom.id,
      footwearId: selectedFootwear.id,
      harmonyScore: reviewResult.score,
      stylistReview: reviewResult.text
    });

    // If a board is selected, pin the components to that board!
    if (targetBoardId) {
      saveProductToBoard(selectedTop.id, targetBoardId);
      saveProductToBoard(selectedBottom.id, targetBoardId);
      saveProductToBoard(selectedFootwear.id, targetBoardId);
    }

    setSaveSuccess(true);
  };

  const allSelected = selectedTop && selectedBottom && selectedFootwear;

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in-up">
      {/* Editorial Title */}
      <div>
        <span className="text-xs font-bold tracking-widest text-brand-pink-dark uppercase">MIX & MATCH LABORATORY</span>
        <h1 className="text-3xl md:text-5xl font-display font-semibold text-brand-slate tracking-wide">
          Interactive Outfit Builder
        </h1>
        <p className="text-xs md:text-sm text-brand-slate/60 max-w-xl mt-1 leading-relaxed">
          Select items from our virtual catalog, place them onto the mannequin board, and trigger our AI Stylist to grade your fashion match!
        </p>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Catalog Selector (6 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Builder Step Tabs */}
          <div className="flex rounded-2xl glassmorphism p-1 border border-brand-pink/20 bg-brand-champagne/40">
            {(['top', 'bottom', 'footwear'] as const).map((tab) => {
              const count = tab === 'top' ? tops.length : tab === 'bottom' ? bottoms.length : footwear.length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light text-brand-cream shadow-md'
                      : 'text-brand-slate/70 hover:text-brand-burgundy hover:bg-brand-pink-light/35'
                  }`}
                >
                  {tab}s
                  <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-brand-pink-light/20 text-brand-pink font-semibold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Catalog Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1 pb-4">
            {activeCatalog.map((item) => {
              const isSelected = 
                selectedTop?.id === item.id || 
                selectedBottom?.id === item.id || 
                selectedFootwear?.id === item.id;
              
              return (
                <div
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={`group relative rounded-2xl p-2.5 cursor-pointer bg-brand-champagne/40 border transition-all duration-300 hover:shadow-md flex flex-col gap-2 ${
                    isSelected
                      ? 'border-brand-burgundy bg-brand-pink-light/30 shadow-sm scale-[0.98]'
                      : 'border-brand-pink/15 hover:border-brand-pink/40'
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-brand-pink-light/10 relative">
                    <img
                      src={item.image_urls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-burgundy/20 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-8 h-8 rounded-full bg-brand-burgundy text-brand-cream flex items-center justify-center shadow-lg border border-brand-pink/40">
                          <Check size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-col gap-0.5 px-1 justify-between flex-grow">
                    <span className="text-[9px] uppercase tracking-widest text-brand-pink-dark font-bold leading-none">
                      {item.brand}
                    </span>
                    <h3 className="text-xs font-semibold text-brand-slate line-clamp-1 mt-0.5">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-brand-pink/10">
                      <span className="text-xs font-bold text-brand-burgundy">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-semibold text-brand-slate/50 bg-brand-pink-light/30 px-1.5 py-0.5 rounded-full capitalize">
                        {item.color.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Mannequin Frame (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-[2rem] glassmorphism p-6 border border-brand-pink/25 bg-brand-champagne/45 flex flex-col gap-6 relative overflow-hidden">
            
            {/* Mannequin Background Details */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex justify-center items-center">
              <span className="text-[12rem] font-display select-none">M</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-brand-pink/15">
              <span className="text-xs font-bold tracking-wider text-brand-burgundy uppercase flex items-center gap-1.5">
                <Palette size={14} className="text-brand-pink animate-pulse" />
                <span>Virtual Closet Fitting</span>
              </span>
              <button
                onClick={clearCanvas}
                className="text-[10px] font-bold text-brand-pink-dark hover:text-brand-burgundy transition-all uppercase flex items-center gap-1"
              >
                <RefreshCw size={10} />
                <span>Reset fitting</span>
              </button>
            </div>

            {/* Mannequin Slots Layout */}
            <div className="flex flex-col gap-4 py-2">
              
              {/* TOP SLOT */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-pink w-12 text-right">TOP</span>
                <div className={`flex-grow rounded-2xl p-2.5 min-h-[5.5rem] border flex items-center gap-3 transition-all ${
                  selectedTop 
                    ? 'bg-brand-cream border-brand-pink/40 shadow-sm'
                    : 'bg-brand-pink-light/10 border-brand-pink/20 border-dashed justify-center text-brand-slate/30'
                }`}>
                  {selectedTop ? (
                    <>
                      <img src={selectedTop.image_urls[0]} className="w-14 h-14 object-cover rounded-lg border border-brand-pink/20" />
                      <div className="flex-grow text-left">
                        <p className="text-[9px] uppercase tracking-wider text-brand-pink-dark font-bold leading-none">{selectedTop.brand}</p>
                        <h4 className="text-xs font-semibold text-brand-slate line-clamp-1 mt-0.5">{selectedTop.title}</h4>
                        <p className="text-[11px] font-bold text-brand-burgundy mt-1">₹{selectedTop.discount_price.toLocaleString('en-IN')}</p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-medium tracking-wide">Select a Top clothing</span>
                  )}
                </div>
              </div>

              {/* BOTTOM SLOT */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-pink w-12 text-right">BOTTOM</span>
                <div className={`flex-grow rounded-2xl p-2.5 min-h-[5.5rem] border flex items-center gap-3 transition-all ${
                  selectedBottom
                    ? 'bg-brand-cream border-brand-pink/40 shadow-sm'
                    : 'bg-brand-pink-light/10 border-brand-pink/20 border-dashed justify-center text-brand-slate/30'
                }`}>
                  {selectedBottom ? (
                    <>
                      <img src={selectedBottom.image_urls[0]} className="w-14 h-14 object-cover rounded-lg border border-brand-pink/20" />
                      <div className="flex-grow text-left">
                        <p className="text-[9px] uppercase tracking-wider text-brand-pink-dark font-bold leading-none">{selectedBottom.brand}</p>
                        <h4 className="text-xs font-semibold text-brand-slate line-clamp-1 mt-0.5">{selectedBottom.title}</h4>
                        <p className="text-[11px] font-bold text-brand-burgundy mt-1">₹{selectedBottom.discount_price.toLocaleString('en-IN')}</p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-medium tracking-wide">Select a Bottom clothing</span>
                  )}
                </div>
              </div>

              {/* FOOTWEAR SLOT */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-pink w-12 text-right">SHOES</span>
                <div className={`flex-grow rounded-2xl p-2.5 min-h-[5.5rem] border flex items-center gap-3 transition-all ${
                  selectedFootwear
                    ? 'bg-brand-cream border-brand-pink/40 shadow-sm'
                    : 'bg-brand-pink-light/10 border-brand-pink/20 border-dashed justify-center text-brand-slate/30'
                }`}>
                  {selectedFootwear ? (
                    <>
                      <img src={selectedFootwear.image_urls[0]} className="w-14 h-14 object-cover rounded-lg border border-brand-pink/20" />
                      <div className="flex-grow text-left">
                        <p className="text-[9px] uppercase tracking-wider text-brand-pink-dark font-bold leading-none">{selectedFootwear.brand}</p>
                        <h4 className="text-xs font-semibold text-brand-slate line-clamp-1 mt-0.5">{selectedFootwear.title}</h4>
                        <p className="text-[11px] font-bold text-brand-burgundy mt-1">₹{selectedFootwear.discount_price.toLocaleString('en-IN')}</p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-medium tracking-wide">Select matching Footwear</span>
                  )}
                </div>
              </div>

            </div>

            {/* Price Total */}
            {allSelected && (
              <div className="flex justify-between items-center py-3 border-t border-brand-pink/15">
                <span className="text-xs font-bold text-brand-slate/50">TOTAL EST. OUTLET SET VALUE</span>
                <span className="text-xl font-bold text-brand-burgundy">
                  ₹{((selectedTop?.discount_price || 0) + (selectedBottom?.discount_price || 0) + (selectedFootwear?.discount_price || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* AI Review Action */}
            <button
              onClick={handleAnalyzeOutfit}
              disabled={!allSelected || isAnalyzing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light hover:from-brand-burgundy-light hover:to-brand-pink-dark text-brand-cream font-bold py-3.5 rounded-2xl shadow-lg border border-brand-pink/20 transition-all disabled:opacity-40 disabled:scale-100 hover:scale-[1.01] active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand-pink border-t-brand-cream rounded-full animate-spin" />
                  <span>Reviewing Coordinate Harmony...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Ask AI Stylist for Review</span>
                </>
              )}
            </button>
          </div>

          {/* AI STYLIST REVIEW PANEL (Only appears after analysis) */}
          {reviewResult && (
            <div className="rounded-[2rem] glassmorphism p-6 border border-brand-pink/30 bg-brand-champagne/45 flex flex-col gap-4 animate-fade-in-up shadow-xl relative overflow-hidden">
              
              {/* Floating aesthetic border */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-brand-pink/20 rounded-full blur-2xl" />

              <div className="flex justify-between items-center pb-2 border-b border-brand-pink/15">
                <span className="text-xs font-bold tracking-wider text-brand-burgundy uppercase flex items-center gap-1">
                  <Sparkles size={14} className="text-brand-pink" />
                  <span>AI Stylist Critique</span>
                </span>
                
                {/* Harmony circular badge */}
                <div className="flex items-center gap-1.5 bg-brand-burgundy text-brand-cream text-xs font-bold rounded-full px-3 py-1 border border-brand-pink/30 shadow-md">
                  <span>Harmony:</span>
                  <span className="text-brand-pink font-extrabold">{reviewResult.score}%</span>
                </div>
              </div>

              <p className="text-sm text-brand-slate/85 leading-relaxed text-left italic">
                "{reviewResult.text}"
              </p>

              {/* Save Closet Form */}
              {!saveSuccess ? (
                <div className="mt-2 pt-4 border-t border-brand-pink/15 flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-pink-dark text-left">Save Outfit combination</h4>
                  
                  <input
                    type="text"
                    placeholder="Give this look a name... (e.g. Lavender Picnic)"
                    value={outfitTitle}
                    onChange={(e) => setOutfitTitle(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl bg-brand-cream/80 border border-brand-pink/25 focus:border-brand-pink text-brand-slate px-3.5 py-2.5 focus:outline-none transition-all"
                  />

                  <textarea
                    placeholder="Optional: Description or styling remarks..."
                    value={outfitDescription}
                    onChange={(e) => setOutfitDescription(e.target.value)}
                    rows={2}
                    className="w-full text-xs font-medium rounded-xl bg-brand-cream/80 border border-brand-pink/25 focus:border-brand-pink text-brand-slate px-3.5 py-2.5 focus:outline-none transition-all resize-none"
                  />

                  {/* Optional Board Selection */}
                  <select
                    value={targetBoardId}
                    onChange={(e) => setTargetBoardId(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl bg-brand-cream/80 border border-brand-pink/25 focus:border-brand-pink text-brand-slate px-3.5 py-2.5 focus:outline-none transition-all"
                  >
                    <option value="">Choose closet board to pin components (Optional)...</option>
                    {boards.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleSaveOutfit}
                    className="w-full flex items-center justify-center gap-1.5 bg-brand-cream hover:bg-brand-pink-light/45 border border-brand-pink/35 text-brand-burgundy font-bold text-xs py-3 rounded-xl transition-all"
                  >
                    <Bookmark size={14} />
                    <span>Save Look to Closet Portfolio</span>
                  </button>
                </div>
              ) : (
                <div className="mt-2 pt-4 border-t border-brand-pink/15 bg-brand-pink-light/35 rounded-2xl p-4 border border-brand-pink/20 flex flex-col items-center gap-2 animate-fade-in-up text-center">
                  <div className="w-10 h-10 rounded-full bg-brand-burgundy text-brand-cream flex items-center justify-center border border-brand-pink/40 shadow-md">
                    <Check size={20} />
                  </div>
                  <h5 className="text-sm font-semibold text-brand-burgundy">Outfit successfully Saved!</h5>
                  <p className="text-xs text-brand-slate/60 leading-normal max-w-xs">
                    This combination has been stored in your custom Closet. You can browse, review, and shop it anytime in the 'My Closet' section.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
