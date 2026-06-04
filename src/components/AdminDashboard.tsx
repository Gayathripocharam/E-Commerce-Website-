"use client";

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, X, Eye, ShoppingCart, TrendingUp, Mail, Pin, 
  CheckCircle2, RotateCcw, AlertTriangle, Copy, Check, Info, 
  Settings, Link as LinkIcon, Compass, Sparkles
} from 'lucide-react';
import { useStore } from '../context/useStore';
import { products } from '../data/products';
import { generatePinterestVariations } from '../utils/pinterestGenerator';

export default function AdminDashboard() {
  const {
    analytics,
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    resetAnalytics,
    simulatePinterestTraffic,
    subscribers,
    pinterestLinkStrategy,
    setPinterestLinkStrategy,
    postedPinIds,
    togglePinPosted
  } = useStore();

  const [isPostingPin, setIsPostingPin] = useState(false);
  const [pinPostSuccess, setPinPostSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'strategy' | 'pinterest' | 'subscribers'>('metrics');
  
  // Pin Generator Hub states
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [activePinIndex, setActivePinIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculate live affiliate conversions
  const totalViews = Object.values(analytics.productViews).reduce((a, b) => a + b, 0) +
                     Object.values(analytics.categoryViews).reduce((a, b) => a + b, 0) +
                     Object.values(analytics.curationViews).reduce((a, b) => a + b, 0);

  const totalClicks = Object.values(analytics.amazonClicks).reduce((a, b) => a + b, 0);
  
  // Calculate CTR
  const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  // Estimated average commission in INR
  const averagePrice = 2200;
  const commissionRate = 0.08;
  const estimatedPurchases = Math.round(totalClicks * 0.06);
  const estimatedCommission = Math.round(estimatedPurchases * averagePrice * commissionRate);

  // Active featured product for the simulator
  const featuredPinterestProduct = products[0];

  const handleSimulateAutoPin = () => {
    setIsPostingPin(true);
    setPinPostSuccess(false);

    setTimeout(() => {
      setIsPostingPin(false);
      setPinPostSuccess(true);
      simulatePinterestTraffic();
      setTimeout(() => setPinPostSuccess(false), 3000);
    }, 2000);
  };

  // Selected product object for Generator Hub
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Generate 10 variations & 20 keywords for the selected product
  const generatedPins = useMemo(() => {
    if (!selectedProduct) return null;
    return generatePinterestVariations(selectedProduct);
  }, [selectedProduct]);

  // Target URL based on active strategy
  const getTargetUrlForProduct = (prodId: string, affiliateUrl: string) => {
    return pinterestLinkStrategy === 'direct' 
      ? affiliateUrl 
      : `https://HerCloset.in/product/${prodId}`;
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isAdminDashboardOpen) return null;

  return (
    <div className="w-full bg-brand-slate text-brand-cream border-b border-brand-pink/35 shadow-2xl relative z-40 transition-all duration-500 animate-fade-in-up font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col gap-6 text-left">
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-center border-b border-brand-pink-light/10 pb-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="text-brand-pink animate-pulse" size={22} />
            <div>
              <h2 className="text-lg font-semibold tracking-wide font-display bg-gradient-to-r from-brand-pink to-brand-cream bg-clip-text text-transparent">
                HerCloset Creator & Performance Dashboard
              </h2>
              <p className="text-[10px] text-brand-pink/60 uppercase font-semibold tracking-wider mt-0.5">
                Aesthetic Affiliate Hub & Pinterest SEO Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAnalytics}
              className="flex items-center gap-1 text-[10px] font-bold text-brand-pink hover:text-brand-cream transition-all uppercase border border-brand-pink/20 hover:border-brand-pink/60 px-2.5 py-1.5 rounded-lg"
              title="Reset conversions to zero"
            >
              <RotateCcw size={11} />
              <span>Reset Logs</span>
            </button>
            
            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-cream/10 hover:bg-brand-cream/25 text-brand-cream transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex border-b border-brand-pink-light/10 gap-6 text-xs font-bold uppercase tracking-wider pb-0.5 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-2 relative transition-all whitespace-nowrap ${
              activeTab === 'metrics' ? 'text-brand-pink' : 'text-brand-cream/50 hover:text-brand-pink'
            }`}
          >
            Affiliate Metrics & CTR
            {activeTab === 'metrics' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />}
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`pb-2 relative transition-all whitespace-nowrap ${
              activeTab === 'strategy' ? 'text-brand-pink' : 'text-brand-cream/50 hover:text-brand-pink'
            }`}
          >
            Pinterest Strategy & Simulator
            {activeTab === 'strategy' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />}
          </button>
          
          <button
            onClick={() => setActiveTab('pinterest')}
            className={`pb-2 relative transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pinterest' ? 'text-brand-pink' : 'text-brand-cream/50 hover:text-brand-pink'
            }`}
          >
            <Sparkles size={12} className="text-brand-pink animate-pulse" />
            <span>AI Pin Generator Hub</span>
            {activeTab === 'pinterest' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />}
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-2 relative transition-all whitespace-nowrap ${
              activeTab === 'subscribers' ? 'text-brand-pink' : 'text-brand-cream/50 hover:text-brand-pink'
            }`}
          >
            Newsletter Leads ({subscribers.length})
            {activeTab === 'subscribers' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink" />}
          </button>
        </div>

        {/* TAB 1: METRICS PANEL */}
        {activeTab === 'metrics' && (
          <div className="flex flex-col gap-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* CARD A: Total Views */}
              <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block">Website Visits</span>
                  <span className="text-2xl font-bold font-display mt-1 block">{totalViews}</span>
                  <span className="text-[10px] text-brand-cream/40 mt-1 block">Views across catalog</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <Eye size={18} />
                </div>
              </div>

              {/* CARD B: Amazon Affiliate Clicks */}
              <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block">Amazon Clicks</span>
                  <span className="text-2xl font-bold font-display mt-1 block">{totalClicks}</span>
                  <span className="text-[10px] text-brand-cream/40 mt-1 block">Affiliate link redirects</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <ShoppingCart size={18} />
                </div>
              </div>

              {/* CARD C: Click-through CTR Ratio */}
              <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block">Conversion (CTR)</span>
                  <span className="text-2xl font-bold font-display mt-1 block">{clickThroughRate}%</span>
                  <span className="text-[10px] text-brand-cream/40 mt-1 block">Click to view efficiency</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <TrendingUp size={18} />
                </div>
              </div>

              {/* CARD D: Total Pins Generated */}
              <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block">Pins Generated</span>
                  <span className="text-2xl font-bold font-display mt-1 block">{products.length * 10}</span>
                  <span className="text-[10px] text-brand-cream/40 mt-1 block">10 unique options per item</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <Sparkles size={18} />
                </div>
              </div>

              {/* CARD E: Total Pins Posted */}
              <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block">Total Pins Posted</span>
                  <span className="text-2xl font-bold font-display mt-1 block">{postedPinIds.length}</span>
                  <span className="text-[10px] text-brand-cream/40 mt-1 block">Published checklist count</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <Pin size={18} className="rotate-45" />
                </div>
              </div>

              {/* CARD F: Est. Commissions */}
              <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block">Est. Commission</span>
                  <span className="text-2xl font-bold font-display text-brand-gold mt-1 block">₹{estimatedCommission.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-brand-cream/40 mt-1 block">At standard ~6% purchase</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                  <span className="text-sm font-black font-display">₹</span>
                </div>
              </div>
            </div>

            {/* Top Performing Products Section */}
            <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-brand-pink uppercase tracking-widest border-b border-brand-pink-light/10 pb-2.5 mb-3 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-brand-pink animate-bounce" />
                <span>Top Performing Catalog Products (Pinterest & Amazon Funnel)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[600px]">
                  <thead>
                    <tr className="text-brand-pink/60 uppercase text-[9px] border-b border-brand-pink-light/10">
                      <th className="py-2.5 pl-2">Product Name</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5 text-center">Views</th>
                      <th className="py-2.5 text-center">Amazon Clicks</th>
                      <th className="py-2.5 text-right pr-2">Calculated CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .map(p => {
                        const views = analytics.productViews[p.id] || 0;
                        const clicks = analytics.amazonClicks[p.id] || 0;
                        const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";
                        return { ...p, views, clicks, ctr: parseFloat(ctr) };
                      })
                      .sort((a, b) => b.clicks - a.clicks)
                      .slice(0, 5)
                      .map((p, idx) => (
                        <tr key={p.id} className="border-b border-brand-pink-light/5 hover:bg-brand-cream/5 transition-all">
                          <td className="py-3 pl-2 flex items-center gap-3">
                            <span className="text-[10px] text-brand-pink/40 font-bold">#{idx + 1}</span>
                            <div className="w-8 h-10 rounded overflow-hidden bg-brand-pink-light/10 shrink-0">
                              <img src={p.image_urls[0]} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-brand-cream truncate max-w-[250px]">{p.title}</span>
                          </td>
                          <td className="py-3 text-brand-cream/75">{p.category}</td>
                          <td className="py-3 text-center text-brand-cream/75">{p.views}</td>
                          <td className="py-3 text-center font-bold text-brand-pink">{p.clicks}</td>
                          <td className="py-3 text-right font-bold text-brand-gold pr-2">{p.ctr}%</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGY & SIMULATOR */}
        {activeTab === 'strategy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up text-left items-stretch">
            {/* Strategy Selector (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-brand-cream/5 border border-brand-pink-light/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 pb-2 border-b border-brand-pink/20">
                <Settings size={16} className="text-brand-pink" />
                <h4 className="text-xs font-bold text-brand-pink uppercase tracking-widest">
                  Pinterest Affiliate Routing Strategy
                </h4>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <button
                  onClick={() => setPinterestLinkStrategy('direct')}
                  className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                    pinterestLinkStrategy === 'direct'
                      ? 'bg-brand-pink/15 border-brand-pink text-brand-cream shadow-md'
                      : 'bg-brand-cream/5 border-brand-pink-light/15 hover:border-brand-pink/40 text-brand-cream/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold">Option 1: Direct Affiliate</span>
                    <span className="text-[8px] uppercase tracking-wider bg-brand-burgundy px-1.5 py-0.2 rounded font-extrabold text-brand-cream">
                      Recommended
                    </span>
                  </div>
                  <span className="text-[10px] leading-relaxed text-brand-cream/80">
                    Pins link directly to Amazon.in with your tag. Eliminates friction and maximizes short-term conversions.
                  </span>
                </button>

                <button
                  onClick={() => setPinterestLinkStrategy('website')}
                  className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                    pinterestLinkStrategy === 'website'
                      ? 'bg-brand-pink/15 border-brand-pink text-brand-cream shadow-md'
                      : 'bg-brand-cream/5 border-brand-pink-light/15 hover:border-brand-pink/40 text-brand-cream/70'
                  }`}
                >
                  <span className="text-xs font-bold">Option 2: Website Bridge</span>
                  <span className="text-[10px] leading-relaxed text-brand-cream/80">
                    Pins link to your HerCloset product pages first, then users click through to Amazon. Builds long-term traffic, email lists, and site SEO.
                  </span>
                </button>
              </div>

              <div className="bg-brand-pink/5 border border-brand-pink/10 rounded-xl p-3.5 flex items-start gap-2.5 mt-2">
                <Info size={16} className="text-brand-pink shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-brand-cream/85">
                  <strong>Strategic Insight:</strong> Direct linking (Option 1) is ideal for scaling early clicks and revenue. To support this at scale, use the **AI Pin Generator Hub** to create 10 unique SEO variations per product, ensuring Pinterest does not flag identical links as spam.
                </div>
              </div>
            </div>

            {/* Simulated Publisher Funnel (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-brand-cream/5 border border-brand-pink-light/10 p-5 rounded-2xl">
              <div>
                <h4 className="text-[10px] font-bold text-brand-pink uppercase tracking-widest flex items-center gap-1">
                  <Pin size={12} className="rotate-45" />
                  <span>Pinterest Funnel Simulator</span>
                </h4>
                
                <div className="flex flex-col gap-2 mt-4 text-xs">
                  <div>
                    <span className="text-brand-pink/50 block font-bold text-[8px] uppercase">Active Target URL</span>
                    <p className="font-mono text-brand-gold text-[10px] truncate bg-black/35 px-2.5 py-1.5 rounded-lg border border-brand-pink/10 mt-1">
                      {getTargetUrlForProduct(featuredPinterestProduct.id, featuredPinterestProduct.affiliate_url)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center bg-brand-cream/5 px-3 py-2 rounded-xl border border-brand-pink-light/5 mt-1">
                    <div>
                      <span className="text-[8px] text-brand-pink/60 uppercase block">Total Referral Views</span>
                      <span className="text-xl font-bold font-display">{analytics.pinterestTraffic} hits</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-brand-pink/60 uppercase block">Funnel Contribution</span>
                      <span className="text-xs font-semibold text-brand-pink">
                        {((analytics.pinterestTraffic / (totalViews || 1)) * 100).toFixed(0)}% of traffic
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {!pinPostSuccess ? (
                  <button
                    onClick={handleSimulateAutoPin}
                    disabled={isPostingPin}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-dark hover:from-brand-pink-dark hover:to-brand-pink text-brand-cream font-bold py-3 rounded-xl disabled:opacity-40 transition-all border border-brand-pink-light/25 shadow-lg text-xs uppercase tracking-wider"
                  >
                    {isPostingPin ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-brand-cream border-t-brand-pink rounded-full animate-spin" />
                        <span>Publishing to Pinterest API...</span>
                      </>
                    ) : (
                      <>
                        <Pin size={13} className="rotate-45" />
                        <span>Simulate Pin & Generate Traffic</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full bg-brand-pink-light/10 border border-brand-pink/30 rounded-xl p-3 flex items-center justify-center gap-2 animate-pulse text-brand-pink">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Pin Published! Funnel Active (+24 Traffic)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI PIN GENERATOR HUB */}
        {activeTab === 'pinterest' && generatedPins && (
          <div className="flex flex-col gap-5 animate-fade-in-up">
            
            {/* Product Selector Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-brand-cream/5 border border-brand-pink-light/10 p-4 rounded-xl font-sans text-xs">
              <div className="flex flex-col gap-1 text-left w-full md:w-auto">
                <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest">Active Catalog Product</span>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setActivePinIndex(0);
                  }}
                  className="bg-brand-slate border border-brand-pink/30 rounded-xl px-3 py-2 text-xs text-brand-cream focus:outline-none focus:border-brand-pink w-full md:w-80 font-semibold cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {p.brand} - {p.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Active strategy indicator */}
              <div className="flex items-center gap-3 bg-brand-cream/5 border border-brand-pink-light/15 px-4 py-2.5 rounded-xl shrink-0">
                <LinkIcon size={14} className="text-brand-pink" />
                <div className="text-left leading-tight">
                  <span className="text-[8px] text-brand-pink/60 uppercase block">Active Target URL Strategy</span>
                  <span className="text-xs font-bold text-brand-cream">
                    {pinterestLinkStrategy === 'direct' ? 'Option 1: Direct Amazon Link' : 'Option 2: Website Bridge URL'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Variations & Details Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Product Info Card & Variation Pills Selector (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4.5 rounded-2xl text-left flex gap-3.5">
                  <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 border border-brand-pink/15 bg-brand-pink-light/10">
                    <img src={selectedProduct.image_urls[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-brand-pink-dark font-extrabold">{selectedProduct.brand}</span>
                      <h4 className="text-xs font-bold text-brand-cream line-clamp-2 leading-snug mt-0.5">{selectedProduct.title}</h4>
                    </div>
                    <span className="text-xs font-extrabold text-brand-gold mt-1.5">
                      ₹{selectedProduct.discount_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Variation Selection Index Pills */}
                <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-4 rounded-2xl text-left">
                  <span className="text-[9px] font-bold text-brand-pink uppercase tracking-widest block mb-3">
                    Select Pin Variation (10 Available)
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePinIndex(i)}
                        className={`w-full aspect-square rounded-xl text-xs font-bold transition-all border relative flex items-center justify-center ${
                          activePinIndex === i
                            ? 'bg-brand-pink border-brand-pink text-brand-slate shadow-md scale-105'
                            : 'bg-brand-cream/5 border-brand-pink-light/15 hover:border-brand-pink/40 text-brand-cream/80'
                        }`}
                      >
                        <span>{i + 1}</span>
                        {postedPinIds.includes(`${selectedProduct.id}-${i}`) && (
                          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-brand-slate text-[7px] leading-none shrink-0 font-extrabold">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-brand-cream/40 mt-3.5 leading-normal">
                    Generate and publish different titles/descriptions to scale daily content without spamming identical pins.
                  </p>
                </div>
              </div>

              {/* Active Variation Details Editor & Copy Panel (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col gap-4 text-left">
                <div className="bg-brand-cream/5 border border-brand-pink-light/15 p-6 rounded-2xl flex flex-col gap-4 relative">
                  <div className="flex justify-between items-center pb-2.5 border-b border-brand-pink-light/10">
                    <span className="text-xs font-bold text-brand-pink uppercase tracking-wider flex items-center gap-1.5">
                      <Pin size={12} className="rotate-45" />
                      <span>Active Pinterest Variation #{activePinIndex + 1}</span>
                    </span>
                    <span className="text-[9px] font-bold text-brand-cream/40 uppercase">
                      SEO Copy Desk
                    </span>
                  </div>

                  {/* Variation Title */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-brand-pink/70 uppercase">Pin Title</span>
                      <button
                        onClick={() => handleCopyText(generatedPins.variations[activePinIndex].title, `title-${activePinIndex}`)}
                        className="text-[10px] text-brand-pink hover:text-brand-cream flex items-center gap-1 transition-all"
                      >
                        {copiedKey === `title-${activePinIndex}` ? <Check size={11} className="stroke-[2.5px]" /> : <Copy size={11} />}
                        <span>{copiedKey === `title-${activePinIndex}` ? 'Copied!' : 'Copy Title'}</span>
                      </button>
                    </div>
                    <div className="bg-black/25 border border-brand-pink-light/10 rounded-xl p-3 text-xs font-semibold text-brand-cream select-all">
                      {generatedPins.variations[activePinIndex].title}
                    </div>
                  </div>

                  {/* Variation Description */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-brand-pink/70 uppercase">Pin Description</span>
                      <button
                        onClick={() => handleCopyText(generatedPins.variations[activePinIndex].description, `desc-${activePinIndex}`)}
                        className="text-[10px] text-brand-pink hover:text-brand-cream flex items-center gap-1 transition-all"
                      >
                        {copiedKey === `desc-${activePinIndex}` ? <Check size={11} className="stroke-[2.5px]" /> : <Copy size={11} />}
                        <span>{copiedKey === `desc-${activePinIndex}` ? 'Copied!' : 'Copy Description'}</span>
                      </button>
                    </div>
                    <div className="bg-black/25 border border-brand-pink-light/10 rounded-xl p-3 text-xs leading-relaxed text-brand-cream/90 select-all min-h-[4.5rem]">
                      {generatedPins.variations[activePinIndex].description}
                    </div>
                  </div>

                  {/* Target link */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-brand-pink/70 uppercase">Affiliate Destination Link</span>
                      <button
                        onClick={() => handleCopyText(getTargetUrlForProduct(selectedProduct.id, selectedProduct.affiliate_url), `link-${activePinIndex}`)}
                        className="text-[10px] text-brand-pink hover:text-brand-cream flex items-center gap-1 transition-all"
                      >
                        {copiedKey === `link-${activePinIndex}` ? <Check size={11} className="stroke-[2.5px]" /> : <Copy size={11} />}
                        <span>{copiedKey === `link-${activePinIndex}` ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                    <div className="bg-black/25 border border-brand-pink-light/10 rounded-xl p-3 text-xs font-mono text-brand-gold select-all truncate">
                      {getTargetUrlForProduct(selectedProduct.id, selectedProduct.affiliate_url)}
                    </div>
                  </div>

                  {/* Mark as Posted toggle */}
                  <div className="flex justify-between items-center bg-brand-cream/5 px-4 py-2.5 rounded-xl border border-brand-pink-light/5 mt-1">
                    <div className="flex items-center gap-2">
                      <Pin size={12} className="rotate-45 text-brand-pink animate-pulse" />
                      <span className="text-xs font-semibold text-brand-cream">Mark this Pin as Posted</span>
                    </div>
                    <button
                      onClick={() => togglePinPosted(selectedProduct.id, activePinIndex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        postedPinIds.includes(`${selectedProduct.id}-${activePinIndex}`)
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow'
                          : 'bg-brand-cream/5 border-brand-pink-light/15 hover:border-brand-pink/45 text-brand-cream/75'
                      }`}
                    >
                      {postedPinIds.includes(`${selectedProduct.id}-${activePinIndex}`) ? (
                        <>
                          <Check size={11} className="stroke-[3px]" />
                          <span>Posted!</span>
                        </>
                      ) : (
                        <span>Mark Posted</span>
                      )}
                    </button>
                  </div>

                </div>

                {/* 20 Keywords block */}
                <div className="bg-brand-cream/5 border border-brand-pink-light/10 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-brand-pink-light/10 pb-2">
                    <span className="text-[10px] font-bold text-brand-pink uppercase tracking-widest">
                      20 SEO Keywords & Tags
                    </span>
                    <button
                      onClick={() => handleCopyText(generatedPins.keywords.map(k => `#${k.replace(/\s+/g, '')}`).join(' '), 'keywords')}
                      className="text-[10px] text-brand-pink hover:text-brand-cream flex items-center gap-1 transition-all"
                    >
                      {copiedKey === 'keywords' ? <Check size={11} className="stroke-[2.5px]" /> : <Copy size={11} />}
                      <span>{copiedKey === 'keywords' ? 'Copied Block!' : 'Copy Tag Block'}</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPins.keywords.map(keyword => (
                      <span 
                        key={keyword} 
                        className="bg-brand-pink/15 text-brand-pink border border-brand-pink/25 px-2 py-0.8 rounded-lg text-[10px] font-semibold"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: NEWSLETTER LEADS REGISTER */}
        {activeTab === 'subscribers' && (
          <div className="flex flex-col gap-3 animate-fade-in-up text-left">
            <h4 className="text-[10px] font-bold text-brand-pink uppercase tracking-widest">
              Collected Weekly Newsletter Subscribers Leads ({subscribers.length})
            </h4>
            
            {subscribers.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto mt-1">
                {subscribers.map(email => (
                  <span
                    key={email}
                    className="bg-brand-cream/10 border border-brand-pink-light/15 px-3 py-1.5 rounded-xl text-xs font-semibold font-mono text-brand-cream flex items-center gap-1.5"
                  >
                    <Mail size={12} className="text-brand-pink" />
                    <span>{email}</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="py-8 bg-brand-cream/5 border border-brand-pink-light/10 border-dashed rounded-2xl flex items-center justify-center gap-2 text-brand-cream/50 text-xs font-medium">
                <AlertTriangle size={15} />
                <span>No subscriber contacts captured yet. Register using the footer form below!</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
