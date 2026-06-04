"use client";

import React, { useState } from 'react';
import { Mail, Check, Sparkles, Pin, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/useStore';
import Link from 'next/link';

export default function NewsletterFooter() {
  const { subscribeNewsletter } = useStore();
  const [email, setEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubError(false);

    const isSubscribed = subscribeNewsletter(email.trim());
    if (isSubscribed) {
      setSubSuccess(true);
      setEmail('');
      setTimeout(() => setSubSuccess(false), 4000);
    } else {
      setSubError(true);
    }
  };

  const footerLinks = {
    discover: [
      { name: 'Trending Today', href: '/#feed-start' },
      { name: 'Summer Collection', href: '/category/Dresses' },
      { name: 'Wedding Collection', href: '/category/Sarees' },
      { name: 'Office Wear Essentials', href: '/category/Bottom Wear' }
    ],
    curations: [
      { name: 'Summer Dresses Under ₹999', href: '/curations/summer-dresses-under-999' },
      { name: 'Best Amazon Indian Kurtis', href: '/curations/best-amazon-kurtis' },
      { name: 'Wedding Guest Guest Outfits', href: '/curations/wedding-guest-outfits' }
    ],
    features: [
      { name: 'AI Stylist Chat Room', href: '/assistant' },
      { name: 'Interactive Outfit Builder', href: '/outfit-builder' },
      { name: 'Visual Outfit Similar Search', href: '/visual-search' }
    ]
  };

  return (
    <footer className="w-full bg-brand-champagne/70 border-t border-brand-pink/25 glassmorphism pt-14 pb-8 mt-16 relative z-10 text-left">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-12">
        
        {/* Newsletter Section */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light p-6 md:p-10 text-brand-cream border border-brand-pink/25 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="lg:w-1/2 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-brand-pink uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Sparkles size={11} className="animate-pulse" />
              <span>Weekly HerCloset Digests</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-brand-cream tracking-wide">
              Get Weekly Amazon Fashion Finds
            </h3>
            <p className="text-xs md:text-sm text-brand-cream/80 max-w-sm leading-relaxed">
              Subscribe to unlock curated clothing under ₹999, top-trending wedding sarees, and seasonal budget slays.
            </p>
          </div>

          <div className="lg:w-1/2 w-full flex flex-col gap-2">
            {!subSuccess ? (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <div className="flex-grow relative rounded-2xl bg-brand-cream/10 border border-brand-pink-light/25 focus-within:border-brand-pink p-1 flex items-center transition-all">
                  <Mail size={16} className="text-brand-pink ml-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your fashion email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-brand-cream px-3 py-3 focus:outline-none placeholder-brand-cream/50"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-brand-pink to-brand-pink-dark hover:from-brand-pink-dark hover:to-brand-pink text-brand-cream font-bold px-6 rounded-2xl text-xs uppercase tracking-wider shadow border border-brand-pink-light/20 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  Join Slay
                </button>
              </form>
            ) : (
              <div className="w-full bg-brand-cream/10 border border-brand-pink/40 rounded-2xl p-4.5 flex items-center justify-center gap-2.5 text-brand-pink animate-pulse">
                <div className="w-6 h-6 rounded-full bg-brand-cream text-brand-burgundy flex items-center justify-center shadow">
                  <Check size={14} className="font-black" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-wider">HerCloset unlocked! Subscribed successfully.</span>
              </div>
            )}
            
            {subError && (
              <span className="text-[10px] text-red-300 font-bold text-left ml-2">
                * Please input a valid style email address.
              </span>
            )}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 border-b border-brand-pink/15 pb-10">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-2xl font-display font-semibold tracking-wider text-brand-burgundy">
              HerCloset
            </span>
            <p className="text-xs text-brand-slate/60 leading-relaxed max-w-xs">
              Curating women's fashion gems under the Amazon Associates India affiliate program. Discover sarees, elegant kurtis, dresses, and styling coordinates.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-pink-dark bg-brand-pink-light/35 border border-brand-pink/20 rounded-full px-3 py-1 w-fit">
              <ShieldCheck size={12} className="text-brand-burgundy animate-pulse" />
              <span>Amazon Associate Partner</span>
            </div>
          </div>

          {/* Links Discover */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Trending Sections</h4>
            <div className="flex flex-col gap-2">
              {footerLinks.discover.map(l => (
                <Link key={l.name} href={l.href} className="text-xs text-brand-slate/75 hover:text-brand-burgundy hover:underline transition-all">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Curations */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Pinterest Landers</h4>
            <div className="flex flex-col gap-2">
              {footerLinks.curations.map(l => (
                <Link key={l.name} href={l.href} className="text-xs text-brand-slate/75 hover:text-brand-burgundy hover:underline transition-all">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Features */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">AI Features Portfolio</h4>
            <div className="flex flex-col gap-2">
              {footerLinks.features.map(l => (
                <Link key={l.name} href={l.href} className="text-xs text-brand-slate/75 hover:text-brand-burgundy hover:underline transition-all">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom disclaimers */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[11px] text-brand-slate/40 leading-relaxed font-medium">
          <p className="max-w-xl">
            <strong>Affiliate Disclosure:</strong> As an Amazon Associate, HerCloset earns from qualifying purchases made on Amazon India. Products link directly to amazon.in with ASIN tags. All commissions generated support server hosting and catalog curations.
          </p>
          <div className="flex items-center gap-1 font-semibold text-brand-burgundy/60 shrink-0">
            <span>Made with</span>
            <Heart size={10} className="fill-brand-pink text-brand-pink" />
            <span>in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
