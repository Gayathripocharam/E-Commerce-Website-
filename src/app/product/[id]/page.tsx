"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { useStore } from '@/context/useStore';
import { Product, products } from '@/data/products';
import OutfitCard from '@/components/OutfitCard';
import { ArrowLeft, ShoppingCart, Heart, Bookmark, Check, Star, Pin, Sparkles, ExternalLink, ArrowRight, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generatePinterestVariations } from '@/utils/pinterestGenerator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const {
    savedProductIds,
    toggleSaveProduct,
    boards,
    saveProductToBoard,
    trackProductView,
    trackAmazonClick,
    simulatePinterestTraffic,
    pinterestLinkStrategy,
    postedPinIds,
    togglePinPosted
  } = useStore();

  // Find target product
  const product = useMemo(() => {
    return products.find(p => p.id === productId) || null;
  }, [productId]);

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState<string>('');

  // Setup form states
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [isSavedToBoard, setIsSavedToBoard] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate 10 variations and 20 keywords
  const generatedPins = useMemo(() => {
    if (!product) return null;
    return generatePinterestVariations(product);
  }, [product]);

  // Hydrate image and log product view hits in Analytics Engine
  useEffect(() => {
    if (product) {
      setActiveImage(product.image_urls[0]);
      trackProductView(product.id);
    }
  }, [product]);


  // Automated board pinner
  const handleSaveToBoard = () => {
    if (!product || !selectedBoardId) return;
    saveProductToBoard(product.id, selectedBoardId);
    setIsSavedToBoard(true);
    setTimeout(() => setIsSavedToBoard(false), 2000);
  };

  // --- DYNAMIC AI COMPLETE THE LOOK COORDINATE MATCHING ENGINE (No Hardcoding) ---
  const dynamicCoordinates = useMemo(() => {
    if (!product) return [];

    // Helper functions to get complementing colors
    const getColorComplements = (c: string): string[] => {
      const col = c.toLowerCase();
      if (col.includes('white') || col.includes('ivory')) return ['blue', 'pink', 'gold', 'black', 'lavender'];
      if (col.includes('blue') || col.includes('denim')) return ['white', 'gold', 'neutral', 'pink'];
      if (col.includes('red') || col.includes('crimson') || col.includes('burgundy')) return ['gold', 'black', 'neutral', 'white'];
      if (col.includes('lavender')) return ['gold', 'white', 'neutral', 'silver'];
      if (col.includes('pink') || col.includes('rose')) return ['white', 'blue', 'neutral', 'gold'];
      if (col.includes('gold') || col.includes('yellow')) return ['white', 'black', 'red', 'emerald', 'green', 'neutral'];
      if (col.includes('green') || col.includes('emerald')) return ['gold', 'white', 'neutral', 'black'];
      return ['gold', 'white', 'black', 'neutral']; // fallback
    };

    const complements = getColorComplements(product.color);

    // Filter items of complementing accessory categories
    // Kurti/Saree/Dress -> fetch Footwear, Handbags, Jewelry
    // Handbag/Footwear/Jewelry -> fetch main clothes (Kurtis, Sarees, Dresses)
    const targetCategories: Product['category'][] = [];
    if (['Kurtis', 'Sarees', 'Dresses', 'Tops'].includes(product.category)) {
      targetCategories.push('Footwear', 'Handbags', 'Jewelry');
    } else {
      targetCategories.push('Kurtis', 'Sarees', 'Dresses');
    }

    return targetCategories.map(cat => {
      // Find the best match inside this category
      const matched = products
        .filter(p => p.id !== product.id && p.category === cat)
        .map(p => {
          let score = 0;
          
          // Occasion matches carry highest weights
          if (p.occasion === product.occasion) score += 10;
          
          // Style consistency weight
          if (p.style === product.style) score += 6;

          // Color harmony complement matching weight
          const pColor = p.color.toLowerCase();
          const hasComplement = complements.some(comp => pColor.includes(comp));
          if (hasComplement) score += 8;

          return { product: p, score };
        })
        .sort((a, b) => b.score - a.score)[0]?.product || null;

      return matched;
    }).filter((p): p is Product => p !== null);
  }, [product]);

  // Dynamic matching similar items tray (same category)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product]);

  const handleSimulatePin = () => {
    setPinSuccess(true);
    simulatePinterestTraffic();
    setTimeout(() => setPinSuccess(false), 3000);
  };

  if (!product) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center gap-4 bg-brand-champagne/40 rounded-3xl border border-brand-pink/20 border-dashed">
        <h4 className="font-semibold text-brand-slate">Product not found</h4>
        <Link href="/" className="bg-brand-burgundy text-brand-cream text-xs font-semibold px-5 py-2.5 rounded-xl">
          Return to Feed
        </Link>
      </div>
    );
  }

  const isSaved = savedProductIds.includes(product.id);
  const discountPercent = Math.round(((product.price - product.discount_price) / product.price) * 100);

  return (
    <div className="flex flex-col gap-10 pb-16 animate-fade-in-up text-left">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between border-b border-brand-pink/15 pb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-bold text-brand-pink-dark hover:text-brand-burgundy transition-all uppercase"
        >
          <ArrowLeft size={14} />
          <span>Back to Feed</span>
        </Link>
        <span className="text-[10px] font-bold text-brand-pink border border-brand-pink/35 px-2.5 py-0.5 rounded uppercase">
          Asin: {product.amazon_asin}
        </span>
      </div>

      {/* 2. Core Product Showcase Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Visual Gallery Grid (6 Columns) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Main Active image container */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-brand-pink-light/10 border border-brand-pink/20 shadow-md">
            <img
              src={activeImage || product.image_urls[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-brand-burgundy text-brand-cream text-[10px] font-extrabold px-3 py-1 rounded-full border border-brand-pink/35 shadow-md">
                {discountPercent}% Off Slay Deal
              </span>
            )}
          </div>

          {/* Miniature Thumbnails slider selector (Only shown if product has multiple images) */}
          {product.image_urls.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.image_urls.map((imgUrl, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActiveImage(imgUrl)}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm ${
                    activeImage === imgUrl ? 'border-brand-burgundy scale-95' : 'border-brand-pink/15 hover:border-brand-pink/50'
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Columns: Styling Information & Affiliate CTAs (6 Columns) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Brand & Stars Rating */}
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-pink-dark">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5 text-brand-gold bg-brand-champagne border border-brand-pink/20 rounded-full px-3 py-1 shadow-sm text-xs font-bold">
              <span className="flex text-brand-gold text-[10px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className={i < Math.round(product.rating) ? 'fill-brand-gold' : 'text-brand-pink-light'} />
                ))}
              </span>
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Heading Title */}
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-brand-slate leading-tight tracking-wide">
            {product.title}
          </h1>

          {/* Pricing structures */}
          <div className="flex items-center gap-4 py-4 border-y border-brand-pink/15">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-brand-slate/40 font-bold uppercase tracking-wider">AMAZON INDIA DEAL PRICE</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-brand-burgundy">
                  ₹{product.discount_price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-brand-slate/40 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-brand-pink-light/30 border border-brand-pink/25 rounded-2xl px-3 py-2 text-brand-burgundy font-bold text-xs text-center shrink-0">
              Save ₹{(product.price - product.discount_price).toLocaleString('en-IN')} Instantly
            </div>
          </div>

          {/* Product Description */}
          <div className="text-left">
            <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Styling Summary</h4>
            <p className="text-xs md:text-sm text-brand-slate/85 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Visual classifications Tags */}
          <div className="grid grid-cols-3 gap-2.5 bg-brand-pink-light/10 p-4 rounded-2xl border border-brand-pink/10 text-xs">
            <div>
              <span className="text-[9px] text-brand-slate/40 block font-bold">OCCASION</span>
              <span className="font-bold text-brand-slate">{product.occasion} Wear</span>
            </div>
            <div>
              <span className="text-[9px] text-brand-slate/40 block font-bold">STYLE MOOD</span>
              <span className="font-bold text-brand-slate">{product.style}</span>
            </div>
            <div>
              <span className="text-[9px] text-brand-slate/40 block font-bold">COLOR SCHEME</span>
              <span className="font-bold text-brand-slate capitalize">{product.color}</span>
            </div>
          </div>

          {/* Save to Closet Board */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Add to Custom Board</h4>
            <div className="flex gap-2">
              <select
                value={selectedBoardId}
                onChange={(e) => {
                  setSelectedBoardId(e.target.value);
                  setIsSavedToBoard(false);
                }}
                className="flex-grow rounded-xl bg-brand-cream/80 border border-brand-pink/25 text-xs font-semibold text-brand-slate px-3.5 py-3 focus:outline-none focus:border-brand-pink transition-all"
              >
                <option value="">Choose closet board to pin...</option>
                {boards.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>

              <button
                onClick={handleSaveToBoard}
                disabled={!selectedBoardId}
                className="flex items-center justify-center gap-1.5 bg-brand-cream hover:bg-brand-pink-light text-brand-burgundy border border-brand-pink/30 hover:border-brand-pink/60 text-xs font-bold px-4 py-3 rounded-xl disabled:opacity-40 transition-all shrink-0 shadow-sm"
              >
                {isSavedToBoard ? <Check size={14} className="text-brand-burgundy" /> : <Bookmark size={14} />}
                <span>{isSavedToBoard ? 'Pinned' : 'Pin to Board'}</span>
              </button>
            </div>
          </div>

          {/* Large, Glowing Amazon India Direct Affiliate portal CTA */}
          <div className="flex gap-3 mt-2">
            {/* Quick Favorite */}
            <button
              onClick={() => toggleSaveProduct(product.id)}
              className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-all ${
                isSaved 
                  ? 'bg-brand-pink-light/35 border-brand-pink text-brand-burgundy scale-95 shadow'
                  : 'bg-brand-cream hover:bg-brand-pink-light border-brand-pink/30 text-brand-pink-dark hover:border-brand-pink/60 hover:scale-105'
              }`}
              title="Add to Closet wish-list"
            >
              <Heart size={20} className={isSaved ? 'fill-brand-burgundy text-brand-burgundy' : ''} />
            </button>

            {/* Shop Button */}
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={() => {
                trackAmazonClick(product.id);
              }}
              className="flex-grow flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF9900] to-[#E47911] hover:from-[#E47911] hover:to-[#FF9900] text-brand-slate font-bold py-4 rounded-2xl shadow-lg border border-[#FF9900]/25 transition-all duration-300 hover:scale-[1.01] active:scale-95 text-sm uppercase tracking-wider select-none text-center cursor-pointer"
            >
              <ShoppingCart size={18} />
              <span>Shop on Amazon India</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* 3. PINTEREST CREATOR HUB & AUTOPUBLISH TOOL */}
          {generatedPins && (
            <div className="rounded-[2rem] glassmorphism bg-brand-cream/80 border border-brand-pink/20 p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-[0.03] pointer-events-none">
                <Pin size={60} />
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-brand-pink/15">
                <span className="text-[10px] font-bold tracking-widest text-brand-burgundy uppercase flex items-center gap-1.5 leading-none">
                  <Pin size={12} className="rotate-45 text-brand-pink" />
                  <span>AI Pinterest Generator Tool</span>
                </span>
                
                <span className="text-[8px] uppercase tracking-widest bg-brand-pink-light/50 text-brand-pink font-bold border border-brand-pink/20 px-2 py-0.2 rounded-full leading-none">
                  {pinterestLinkStrategy === 'direct' ? 'Option 1: Direct Link' : 'Option 2: Bridge URL'}
                </span>
              </div>

              {/* Variation Selection Index Pills */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-brand-pink-dark uppercase">Select Pin Variation</span>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePinIndex(i)}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold border transition-all relative flex items-center justify-center ${
                        activePinIndex === i
                          ? 'bg-brand-burgundy border-brand-burgundy text-brand-cream shadow-sm scale-105'
                          : 'bg-brand-cream hover:bg-brand-pink-light/35 border-brand-pink/15 text-brand-slate/75'
                      }`}
                    >
                      <span>Pin {i + 1}</span>
                      {product && postedPinIds.includes(`${product.id}-${i}`) && (
                        <span className="absolute -top-1.5 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-brand-pink text-[6px] leading-none shrink-0 font-extrabold">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Variation Box */}
              <div className="flex flex-col gap-3 bg-brand-champagne/45 p-4 rounded-2xl border border-brand-pink/10">
                {/* Title */}
                <div className="flex flex-col gap-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-brand-pink-dark uppercase">Pin Title</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPins.variations[activePinIndex].title);
                        setCopiedKey(`title-${activePinIndex}`);
                        setTimeout(() => setCopiedKey(null), 2000);
                      }}
                      className="text-[9px] font-bold text-brand-burgundy hover:text-brand-pink-dark flex items-center gap-1 transition-all"
                    >
                      {copiedKey === `title-${activePinIndex}` ? <Check size={10} /> : <Copy size={10} />}
                      <span>{copiedKey === `title-${activePinIndex}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-bold text-brand-slate">{generatedPins.variations[activePinIndex].title}</p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 text-left border-t border-brand-pink/10 pt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-brand-pink-dark uppercase">Pin Description</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPins.variations[activePinIndex].description);
                        setCopiedKey(`desc-${activePinIndex}`);
                        setTimeout(() => setCopiedKey(null), 2000);
                      }}
                      className="text-[9px] font-bold text-brand-burgundy hover:text-brand-pink-dark flex items-center gap-1 transition-all"
                    >
                      {copiedKey === `desc-${activePinIndex}` ? <Check size={10} /> : <Copy size={10} />}
                      <span>{copiedKey === `desc-${activePinIndex}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-brand-slate/85 leading-relaxed">{generatedPins.variations[activePinIndex].description}</p>
                </div>

                {/* Destination Link */}
                <div className="flex flex-col gap-1 text-left border-t border-brand-pink/10 pt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-brand-pink-dark uppercase">Target Link (Affiliate)</span>
                    <button
                      onClick={() => {
                        const targetUrl = pinterestLinkStrategy === 'direct' ? product.affiliate_url : `https://hercloset.in/product/${product.id}`;
                        navigator.clipboard.writeText(targetUrl);
                        setCopiedKey(`link-${activePinIndex}`);
                        setTimeout(() => setCopiedKey(null), 2000);
                      }}
                      className="text-[9px] font-bold text-brand-burgundy hover:text-brand-pink-dark flex items-center gap-1 transition-all"
                    >
                      {copiedKey === `link-${activePinIndex}` ? <Check size={10} /> : <Copy size={10} />}
                      <span>{copiedKey === `link-${activePinIndex}` ? 'Copied Link' : 'Copy Link'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-brand-burgundy truncate">
                    {pinterestLinkStrategy === 'direct' ? product.affiliate_url : `https://hercloset.in/product/${product.id}`}
                  </p>
                </div>

                {/* Published Status Toggle */}
                <div className="flex justify-between items-center bg-brand-champagne/60 px-4 py-2 rounded-xl border border-brand-pink/15 mt-1.5">
                  <span className="text-[10px] font-bold text-brand-pink-dark uppercase">Publishing Status</span>
                  <button
                    onClick={() => togglePinPosted(product.id, activePinIndex)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                      postedPinIds.includes(`${product.id}-${activePinIndex}`)
                        ? 'bg-emerald-600/10 border-emerald-600 text-emerald-700 shadow-sm'
                        : 'bg-brand-cream hover:bg-brand-pink-light/35 border-brand-pink/20 text-brand-burgundy'
                    }`}
                  >
                    {postedPinIds.includes(`${product.id}-${activePinIndex}`) ? (
                      <>
                        <Check size={9} className="stroke-[3px]" />
                        <span>Posted</span>
                      </>
                    ) : (
                      <span>Mark Posted</span>
                    )}
                  </button>
                </div>
              </div>

              {/* SEO Hashtags tag block */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-brand-pink-dark uppercase">SEO Tags</span>
                  <button
                    onClick={() => {
                      const tagsText = generatedPins.keywords.map(k => `#${k.replace(/\s+/g, '')}`).join(' ');
                      navigator.clipboard.writeText(tagsText);
                      setCopiedKey('tags');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="text-[9px] font-bold text-brand-burgundy hover:text-brand-pink-dark flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'tags' ? <Check size={10} /> : <Copy size={10} />}
                    <span>{copiedKey === 'tags' ? 'Copied Block' : 'Copy Tag Block'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {generatedPins.keywords.map(keyword => (
                    <span key={keyword} className="bg-brand-pink-light/40 border border-brand-pink/15 text-brand-burgundy px-1.5 py-0.2 rounded text-[9px] font-bold">
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>

              {!pinSuccess ? (
                <button
                  onClick={handleSimulatePin}
                  className="mt-2 w-full bg-brand-cream hover:bg-brand-pink-light/45 border border-brand-pink/35 text-brand-burgundy font-bold text-[10px] uppercase py-2.5 rounded-xl transition-all"
                >
                  Simulate Pin Broadcast
                </button>
              ) : (
                <div className="mt-2 w-full bg-brand-pink-light/25 border border-brand-pink/35 rounded-xl py-2 flex items-center justify-center gap-1.5 animate-pulse text-brand-pink">
                  <Check size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pin Broadcasted & Conversion traffic generated!</span>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* 4. DYNAMIC AI COMPLETE THE LOOK COMPLEMENT MATCHES */}
      {dynamicCoordinates.length > 0 && (
        <section className="mt-6 pt-10 border-t border-brand-pink/15 flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-widest text-brand-pink-dark uppercase">FITTING MANNEQUIN</span>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-brand-slate tracking-wide flex items-center gap-1.5">
              <Sparkles size={18} className="text-brand-pink animate-pulse" />
              <span>Complete the Look with AI Coordinator</span>
            </h2>
            <p className="text-xs text-brand-slate/50 max-w-xl">
              Our tag coordination algorithm dynamically parses style indices, occasions, and color palettes to pair accessories with your main garment!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
            {dynamicCoordinates.map(accessory => (
              <div
                key={accessory.id}
                onClick={() => router.push(`/product/${accessory.id}`)}
                className="group rounded-3xl glassmorphism bg-brand-champagne/45 p-4 border border-brand-pink/20 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col gap-3"
              >
                {/* Accessory image thumbnail */}
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-brand-pink-light/10 relative">
                  <img
                    src={accessory.image_urls[0]}
                    alt={accessory.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-brand-burgundy text-brand-cream text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-brand-pink/35 shadow">
                    AI Match
                  </div>
                </div>

                {/* Accessory Meta */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-brand-pink-dark font-extrabold">
                    {accessory.brand} • {accessory.category}
                  </span>
                  <h4 className="text-xs font-bold text-brand-slate line-clamp-1 leading-snug group-hover:underline">
                    {accessory.title}
                  </h4>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-brand-pink/10">
                    <span className="text-xs font-extrabold text-brand-burgundy">
                      ₹{accessory.discount_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-bold text-brand-pink bg-brand-pink-light/35 px-2 py-0.2 rounded-full capitalize">
                      {accessory.color.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Similar Products tray */}
      {similarProducts.length > 0 && (
        <section className="mt-6 pt-10 border-t border-brand-pink/15 flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-brand-slate tracking-wide">
              Similar Amazon India Discoveries
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => router.push(`/product/${prod.id}`)}
                className="group flex flex-col gap-2 cursor-pointer bg-brand-cream/40 rounded-3xl p-2 border border-brand-pink/10 hover:border-brand-pink/40 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-pink-light/10 relative">
                  <img
                    src={prod.image_urls[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-1.5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-brand-pink-dark font-extrabold leading-none">
                      {prod.brand}
                    </span>
                    <h4 className="text-xs font-bold text-brand-slate line-clamp-1 leading-snug mt-0.5">
                      {prod.title}
                    </h4>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-brand-pink/10">
                    <span className="text-xs font-extrabold text-brand-burgundy">
                      ₹{prod.discount_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-bold text-brand-pink bg-brand-pink-light/35 px-2 py-0.2 rounded-full capitalize">
                      {prod.color.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
