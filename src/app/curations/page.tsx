"use client";

import React from 'react';
import { ArrowLeft, BookOpen, Compass, ArrowRight, Sparkles, Pin } from 'lucide-react';
import Link from 'next/link';

export default function CurationsPage() {
  
  // Curated collections that double as high-SEO Pinterest Landingcampaign hubs
  const curations = [
    {
      slug: "summer-dresses-under-999",
      title: "Top Summer dresses & Sundresses Under ₹999",
      description: "Stay cool and extremely trendy without breaking the bank. Discover flowy tiered cotton dresses and floral sundresses under ₹999 on Amazon India.",
      cover: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      itemCount: "3 Items",
      readingTime: "3 min read",
      keywords: ["Summer Dresses", "Sundress Deals", "Amazon India Fashion", "Under 999"]
    },
    {
      slug: "best-amazon-kurtis",
      title: "Best Lucknowi & Cotton Kurtis for College Girls",
      description: "The ultimate compilation of hand-embroidered Lucknowi Chikankari short kurtis and organic cotton Anarkali tunics. Daily campus grace simplified.",
      cover: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop&q=80",
      itemCount: "4 Items",
      readingTime: "4 min read",
      keywords: ["Chikankari Kurta", "College Styling", "Cotton Kurtis", "Amazon Finds"]
    },
    {
      slug: "wedding-guest-outfits",
      title: "Stunning Wedding Guest Outfits & Sarees",
      description: "Make a striking statement at receptions and mehendi rituals. Handpicked designer georgette sarees, silk Anarkalis, and handcrafted leather Zardozi juttis.",
      cover: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      itemCount: "5 Items",
      readingTime: "5 min read",
      keywords: ["Wedding Saree", "Designer Lehenga", "Festive Juttis", "Indian Wedding Guest"]
    },
    {
      slug: "office-wear-essentials",
      title: "Corporate Chic: Elegant Office Wear For Women",
      description: "Look sharp and authoritative at seminars and boardrooms. Structured pleated neutral beige trousers, striped cotton shirts, and cognac leather block heels.",
      cover: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&auto=format&fit=crop&q=80",
      itemCount: "4 Items",
      readingTime: "4 min read",
      keywords: ["Office Outfits", "Pleated Pants", "Workspace Chic", "Corporate Fashion"]
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in-up text-left">
      
      {/* Header */}
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
            <span className="text-[10px] font-bold tracking-widest text-brand-pink-dark uppercase">EDITORIAL LOOKBOOKS</span>
            <h1 className="text-3xl md:text-5xl font-display font-semibold text-brand-slate leading-tight mt-1">
              Curated Style Guides
            </h1>
            <p className="text-xs md:text-sm text-brand-slate/60 mt-1 max-w-xl leading-relaxed">
              We compile multiple related products under thematic fashion landers. Hover, open guides, browse styled coordinates, and check out straight on Amazon India.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-burgundy bg-brand-pink-light/50 border border-brand-pink/25 px-4 py-1.5 rounded-full shrink-0">
            {curations.length} Campaign Boards
          </span>
        </div>
      </div>

      {/* Campaign Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {curations.map(c => (
          <Link
            key={c.slug}
            href={`/curations/${c.slug}`}
            className="group rounded-3xl overflow-hidden glassmorphism bg-brand-champagne/45 border border-brand-pink/20 hover:border-brand-pink/50 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row min-h-[14rem]"
          >
            {/* Cover Image */}
            <div className="w-full md:w-2/5 aspect-square md:aspect-auto md:h-full relative overflow-hidden bg-brand-pink-light/10">
              <img
                src={c.cover}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-brand-burgundy text-brand-cream text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border border-brand-pink/35 shadow-sm">
                Guide
              </div>
            </div>

            {/* Content Details */}
            <div className="w-full md:w-3/5 p-6 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between text-[9px] font-bold text-brand-pink-dark uppercase">
                  <span>{c.readingTime}</span>
                  <span>•</span>
                  <span>{c.itemCount}</span>
                </div>
                
                <h3 className="text-lg font-display font-semibold text-brand-slate leading-snug group-hover:text-brand-burgundy mt-1.5 line-clamp-2">
                  {c.title}
                </h3>
                
                <p className="text-xs text-brand-slate/60 mt-2 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>
              </div>

              {/* Keywords Tagging list */}
              <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-brand-pink/10">
                {c.keywords.slice(0, 3).map(k => (
                  <span key={k} className="text-[9px] font-semibold text-brand-slate/40 bg-brand-pink-light/30 border border-brand-pink/10 px-2 py-0.2 rounded-full">
                    #{k.replace(' ', '')}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
