"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Sparkles, FolderHeart, LayoutGrid, Palette, Search, BarChart3, X, ArrowUpRight, Flame, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/useStore';
import { Product, products } from '../data/products';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { savedProductIds, isAdminDashboardOpen, setIsAdminDashboardOpen } = useStore();
  
  // Search Overlay States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin password gate states
  const [isAdminGateOpen, setIsAdminGateOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_PASSWORD = 'admin@hercloset';

  useEffect(() => {
    if (isAdminGateOpen && passwordInputRef.current) {
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    }
  }, [isAdminGateOpen]);

  const handleAdminButtonClick = () => {
    if (isAdminDashboardOpen) {
      // Already open — just close
      setIsAdminDashboardOpen(false);
      return;
    }
    if (adminUnlocked) {
      // Already authenticated this session
      setIsAdminDashboardOpen(true);
      return;
    }
    // Show password gate
    setIsAdminGateOpen(true);
    setAdminPassword('');
    setAdminLoginError(false);
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setIsAdminGateOpen(false);
      setAdminLoginError(false);
      setAdminPassword('');
      setIsAdminDashboardOpen(true);
    } else {
      setAdminLoginError(true);
      setAdminPassword('');
    }
  };

  const navItems = [
    { name: 'Discover Feed', href: '/', icon: LayoutGrid, mobileName: 'Feed' },
    { name: 'Outfit Builder', href: '/outfit-builder', icon: Palette, mobileName: 'Builder' },
    { name: 'My Closet & Boards', href: '/boards', icon: FolderHeart, mobileName: 'Closet' },
    { name: 'AI Stylist', href: '/assistant', icon: Sparkles, mobileName: 'AI Stylist' },
    { name: 'Visual Search', href: '/visual-search', icon: Search, mobileName: 'Search' },
  ];

  // Quick Preset Search suggestions
  const searchPresets = [
    "Kurtis under 1000",
    "Wedding Saree",
    "Summer Dresses",
    "Satin Skirt",
    "Gold Jhumkas"
  ];

  // Dynamic search matching algorithms
  const matchedSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const q = searchQuery.toLowerCase();
    
    // Price cap parser (e.g. "under 1000")
    let priceCap = Infinity;
    const priceMatch = q.match(/(?:under|below|less than|within|₹|\b)\s?(\d{3,5})\b/);
    if (priceMatch && priceMatch[1]) {
      priceCap = parseInt(priceMatch[1]);
    }

    return products.filter(p => {
      const matchTitle = p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchColor = p.color.toLowerCase().includes(q);
      const matchOccasion = p.occasion.toLowerCase().includes(q);
      const matchStyle = p.style.toLowerCase().includes(q);
      const matchPrice = p.price <= priceCap || p.discount_price <= priceCap;

      // Filter logic: if price cap is parsed, evaluate matching bounds
      if (priceCap !== Infinity) {
        const queryWithoutPrice = q.replace(/(?:under|below|less than|within|₹|\b)\s?(\d{3,5})\b/, '').trim();
        if (queryWithoutPrice) {
          return matchPrice && (
            p.title.toLowerCase().includes(queryWithoutPrice) || 
            p.category.toLowerCase().includes(queryWithoutPrice) ||
            p.color.toLowerCase().includes(queryWithoutPrice)
          );
        }
        return matchPrice;
      }

      return matchTitle || matchCategory || matchColor || matchOccasion || matchStyle;
    }).slice(0, 6); // Limit search tray results to 6 items
  }, [searchQuery]);

  const handlePresetSearchClick = (preset: string) => {
    setSearchQuery(preset);
  };

  const handleResultClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/product/${productId}`);
  };

  return (
    <>
      {/* ── NAVBAR: fade down from top ── */}
      <motion.header
        className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 transition-all duration-300"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto max-w-7xl rounded-2xl glassmorphism px-6 py-3 flex items-center justify-between shadow-sm">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-display font-semibold tracking-wider bg-gradient-to-r from-brand-burgundy to-brand-pink-dark bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              HerCloset
            </span>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest text-brand-pink font-semibold border border-brand-pink/30 px-2 py-0.5 rounded-full">
              Associates
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium tracking-wide flex items-center gap-2 transition-all duration-300 ${
                    isActive
                      ? 'text-brand-burgundy font-semibold'
                      : 'text-brand-slate/75 hover:text-brand-burgundy hover:bg-brand-pink-light/30'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-brand-burgundy' : 'text-brand-pink'} />
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-burgundy" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Launcher */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-pink-light/30 hover:bg-brand-pink-light/60 border border-brand-pink/15 text-brand-burgundy transition-all hover:scale-105"
              title="Search Catalog"
            >
              <Search size={16} />
            </button>

            {/* Admin Toggle button — password gated */}
            <button
              onClick={handleAdminButtonClick}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-xl border text-xs font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 ${
                isAdminDashboardOpen
                  ? 'bg-brand-burgundy border-brand-burgundy text-brand-cream shadow'
                  : 'bg-brand-pink-light/35 border-brand-pink/20 hover:border-brand-pink/45 text-brand-burgundy'
              }`}
              title="Admin Dashboard"
            >
              {adminUnlocked
                ? <BarChart3 size={15} className={isAdminDashboardOpen ? 'animate-pulse' : ''} />
                : <Lock size={15} />}
              <span className="hidden md:inline">{adminUnlocked ? 'Dashboard' : 'Admin'}</span>
            </button>

            {/* Favorites Counter Closet */}
            <Link
              href="/boards?tab=favorites"
              className="flex items-center gap-2 bg-brand-burgundy/10 hover:bg-brand-burgundy/15 border border-brand-burgundy/10 px-3.5 py-1.8 rounded-full text-brand-burgundy transition-all duration-300 group"
            >
              <Heart
                size={16}
                className={`text-brand-burgundy transition-all duration-300 group-hover:scale-110 ${
                  savedProductIds.length > 0 ? 'fill-brand-burgundy text-brand-burgundy' : 'text-brand-pink-dark'
                }`}
              />
              <span className="text-xs font-semibold tracking-wide hidden sm:inline">My Closet</span>
              {savedProductIds.length > 0 && (
                <span className="flex items-center justify-center bg-brand-burgundy text-brand-cream text-[10px] font-bold rounded-full w-5 h-5 transition-transform duration-300 scale-100 group-hover:scale-105">
                  {savedProductIds.length}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* Mobile Sticky Navigation (Bottom sheet) */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
          <div className="rounded-2xl glassmorphism px-4 py-2.5 flex justify-around items-center shadow-lg border border-brand-pink/30">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
                    isActive ? 'text-brand-burgundy scale-110' : 'text-brand-slate/60 hover:text-brand-burgundy'
                  }`}
                >
                  <Icon size={19} className={isActive ? 'text-brand-burgundy' : 'text-brand-pink'} />
                  <span className="text-[9px] font-semibold tracking-wide">
                    {item.mobileName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.header>

      {/* FULL-SCREEN GLASSMORPHIC SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-brand-burgundy/50 backdrop-blur-lg flex flex-col p-6 md:p-12 animate-fade-in-up">
          <div className="mx-auto max-w-3xl w-full flex flex-col gap-6">
            
            {/* Search Input block & Close button */}
            <div className="flex items-center gap-3">
              <div className="flex-grow relative rounded-2xl glassmorphism p-1 flex items-center border border-brand-pink/30 shadow-lg">
                <Search className="text-brand-pink ml-4 shrink-0" size={20} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search kurtis, wedding sarees, accessories under ₹1500..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-brand-slate px-4 py-3.5 focus:outline-none placeholder-brand-slate/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-brand-slate/40 hover:text-brand-burgundy p-2 rounded-xl"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-cream hover:bg-brand-pink-light text-brand-burgundy border border-brand-pink/30 shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preset Query Chips (Shown when query is empty) */}
            {!searchQuery.trim() && (
              <div className="text-left flex flex-col gap-3 p-4 rounded-3xl bg-brand-cream/80 border border-brand-pink/15">
                <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Trending Quick Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {searchPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetSearchClick(preset)}
                      className="text-xs font-semibold bg-brand-cream hover:bg-brand-pink-light/35 border border-brand-pink/20 hover:border-brand-pink/40 px-4 py-2.5 rounded-xl text-brand-slate hover:text-brand-burgundy transition-all flex items-center gap-1"
                    >
                      <Flame size={12} className="text-brand-pink animate-pulse" />
                      <span>{preset}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Display */}
            {searchQuery.trim() && (
              <div className="text-left bg-brand-champagne/95 rounded-[2rem] border border-brand-pink/30 shadow-2xl p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
                <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase border-b border-brand-pink/15 pb-2">
                  Matching Fashion Catalog Finds ({matchedSearchResults.length})
                </h4>

                {matchedSearchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {matchedSearchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleResultClick(prod.id)}
                        className="bg-brand-cream/50 hover:bg-brand-pink-light/20 p-2.5 rounded-2xl border border-brand-pink/15 hover:border-brand-pink/40 shadow-sm cursor-pointer hover:shadow flex gap-3 transition-all duration-300"
                      >
                        <div className="w-14 h-18 rounded-xl overflow-hidden shrink-0 border border-brand-pink/15 bg-brand-pink-light/10">
                          <img src={prod.image_urls[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between text-left py-0.5">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-brand-pink-dark font-extrabold">{prod.brand}</span>
                            <h4 className="text-xs font-bold text-brand-slate line-clamp-1 leading-snug mt-0.5">{prod.title}</h4>
                            <span className="text-[10px] font-semibold text-brand-slate/50 bg-brand-pink-light/35 px-2 py-0.2 rounded-full mt-1.5 inline-block">
                              {prod.category}
                            </span>
                          </div>
                          
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xs font-extrabold text-brand-burgundy">₹{prod.discount_price}</span>
                            <span className="text-[10px] text-brand-slate/40 line-through">₹{prod.price}</span>
                          </div>
                        </div>
                        
                        <div className="ml-auto flex items-center pr-2">
                          <ArrowUpRight size={14} className="text-brand-pink-dark" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-brand-slate/40 text-xs font-medium leading-relaxed">
                    No products matching "{searchQuery}" in our discover logs.<br />
                    Try searching **"kurti under 2000"** or **"saree"**.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADMIN PASSWORD GATE MODAL */}
      {isAdminGateOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-6"
          style={{ background: 'rgba(80,20,30,0.55)', backdropFilter: 'blur(18px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setIsAdminGateOpen(false); setAdminLoginError(false); }}}
        >
          <div className="relative w-full max-w-sm rounded-3xl border border-brand-pink/25 shadow-2xl overflow-hidden animate-fade-in-up"
            style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #fdeef2 100%)' }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-pink via-brand-burgundy to-brand-pink" />

            <div className="p-8 flex flex-col items-center gap-5">
              {/* Lock icon badge */}
              <div className="w-16 h-16 rounded-2xl bg-brand-burgundy/10 border border-brand-burgundy/15 flex items-center justify-center">
                <Lock size={28} className="text-brand-burgundy" />
              </div>

              <div className="text-center">
                <h2 className="text-xl font-display font-bold text-brand-burgundy tracking-wide">Admin Access</h2>
                <p className="text-xs text-brand-slate/60 mt-1 font-medium">This area is private. Enter your password to continue.</p>
              </div>

              <form onSubmit={handleAdminPasswordSubmit} className="w-full flex flex-col gap-3">
                <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 bg-white/70 transition-all ${
                  adminLoginError
                    ? 'border-red-400 shadow-sm shadow-red-200'
                    : 'border-brand-pink/30 focus-within:border-brand-burgundy/50'
                }`}>
                  <Lock size={15} className="text-brand-pink-dark shrink-0" />
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setAdminLoginError(false); }}
                    className="flex-1 bg-transparent text-sm font-semibold text-brand-slate focus:outline-none placeholder-brand-slate/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-brand-slate/40 hover:text-brand-burgundy transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {adminLoginError && (
                  <p className="text-[11px] text-red-500 font-semibold text-center animate-fade-in-up">
                    ✗ Incorrect password. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-brand-burgundy text-brand-cream text-sm font-bold tracking-wide hover:bg-brand-burgundy/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  Unlock Dashboard
                </button>
              </form>

              <button
                onClick={() => { setIsAdminGateOpen(false); setAdminLoginError(false); }}
                className="text-[11px] text-brand-slate/40 hover:text-brand-slate/70 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
