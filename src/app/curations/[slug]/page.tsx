"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { useStore } from '@/context/useStore';
import { Product, products } from '@/data/products';
import OutfitCard from '@/components/OutfitCard';
import OutfitDetailModal from '@/components/OutfitDetailModal';
import { ArrowLeft, BookOpen, Compass, Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CurationDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { trackCurationView } = useStore();

  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Track curation view hit in Analytics Engine
  useEffect(() => {
    if (slug) {
      trackCurationView(slug);
    }
  }, [slug]);

  // Decode active lookbook parameters
  const curationDetails = useMemo(() => {
    const data: Record<string, {
      title: string;
      subtitle: string;
      banner: string;
      content: string;
      collectionTag: Product['collections'][0];
    }> = {
      "summer-dresses-under-999": {
        title: "Breezy & Beautiful: Top Summer Dresses Under ₹999",
        subtitle: "Stay cool, chic, and budget-friendly with Amazon's top floral sundresses.",
        banner: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&auto=format&fit=crop&q=80",
        collectionTag: "Under ₹999",
        content: "Summer styling is all about capturing lightweight silhouettes and breathable textures. This season, loose-fitting organic cotton sundresses and flared tiered dresses are taking center stage on Pinterest. Pairing a flowy floral sundress with chunky white sneakers creates an effortless, retro-aesthetic look that is perfect for park picnics or beach trips. Best of all, these handpicked Amazon finds are all under ₹999, proving you can slay the heat without burning a hole in your pocket! Scroll down to explore the collection."
      },
      "best-amazon-kurtis": {
        title: "The Daily Grace: Best Amazon Indian Kurtis for Campus & College",
        subtitle: "Lucknowi Chikankaris and soft cotton Anarkalis that define elegant simplicity.",
        banner: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=1000&auto=format&fit=crop&q=80",
        collectionTag: "Trending Today",
        content: "For Indian university girls, the short kurti is a sacred wardrobe staple. Traditional hand-embroidered Lucknowi Chikankari georgette kurtis combine ancient craftsmanship with modern comfort. Pairing an ivory white Chikankari with high-waisted wide-leg denim establishes an effortless, Indo-western chic look that stands out in lectures. Accentuate with flat leather juttis and oxidized silver jhumkas to complete the graceful ensemble. Browse our top Amazon India picks below."
      },
      "wedding-guest-outfits": {
        title: "Stunning Wedding Guest Outfits & Sarees",
        subtitle: "Capture reception glamour with emerald silk sarees and scallop borders.",
        banner: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80",
        collectionTag: "Wedding Collection",
        content: "Wedding guest couture demands high-impact elegance and rich fabrics. Lavender designer sarees featuring silver scalloped sequined borders, or heavy emerald green silk Anarkalis, represent high-fashion credentials. To look like a royal guest, pair these draping fabrics with handcrafted leather zardozi juttis and gold-plated Kundan drop earrings. Discover our top-tier Amazon Associate suggestions below."
      },
      "office-wear-essentials": {
        title: "Corporate Chic: Reimagining the Workspace Wardrobe",
        subtitle: "pleated neutral beige trousers and sharp collars for an elevated presence.",
        banner: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1000&auto=format&fit=crop&q=80",
        collectionTag: "Office Wear",
        content: "Dressing for success doesn't mean wearing generic office colors. Combining pleated sand beige wide trousers with striped linen button-ups creates a sophisticated, authoritative presence. Layer with tan cognac leather block heels and aesthetic hobo shoulder purses to look polished during key seminars. Explore our selected work coordinates below."
      }
    };

    return data[slug] || {
      title: "Seasonal Lookbook Curation",
      subtitle: "Discover curated collection grids matching trending fashion directives.",
      banner: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80",
      collectionTag: "Trending Today",
      content: "Explore HerCloset's dynamic style lookbooks curated under the Amazon India Associate Program. Click items to browse coordinates and shop the deals on Amazon."
    };
  }, [slug]);

  // Query shoppable outfits matching this collection tag
  const collectionProducts = useMemo(() => {
    return products.filter(p => p.collections.includes(curationDetails.collectionTag));
  }, [curationDetails, products]);

  const handleOpenDetails = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  const handleCloseDetails = () => {
    setActiveDetailProduct(null);
  };

  const handleOpenAnotherProduct = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  return (
    <div className="flex flex-col gap-10 pb-16 animate-fade-in-up text-left">
      
      {/* 1. Header Navigation */}
      <div className="flex flex-col gap-4">
        <Link
          href="/curations"
          className="flex items-center gap-1 text-xs font-bold text-brand-pink-dark hover:text-brand-burgundy transition-all uppercase"
        >
          <ArrowLeft size={14} />
          <span>Back to Lookbooks</span>
        </Link>
      </div>

      {/* 2. Breathtaking Editorial Article Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-brand-pink/20 shadow-2xl flex flex-col min-h-[22rem] bg-cover bg-center"
               style={{ backgroundImage: `linear-gradient(to bottom, rgba(4a, 14, 23, 0.4), rgba(44, 44, 44, 0.85)), url(${curationDetails.banner})` }}>
        
        {/* Floating background overlay */}
        <div className="absolute inset-0 bg-brand-burgundy/25 backdrop-blur-[0.5px]" />
        
        <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end text-left z-10 max-w-4xl gap-4">
          <div className="flex items-center gap-2 bg-brand-cream/15 border border-brand-pink-light/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-brand-pink animate-pulse">
            <Sparkles size={11} />
            <span>PINTEREST EDITORIAL SELECTION</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight tracking-wide text-brand-cream">
            {curationDetails.title}
          </h1>
          
          <p className="text-sm md:text-base text-brand-cream/90 font-medium italic">
            "{curationDetails.subtitle}"
          </p>
        </div>
      </section>

      {/* 3. Article Core Text block */}
      <section className="rounded-3xl glassmorphism bg-brand-champagne/45 p-6 md:p-8 border border-brand-pink/20 shadow-sm flex flex-col gap-4 text-left">
        <span className="text-xs font-bold tracking-wider text-brand-burgundy uppercase flex items-center gap-1.5 leading-none">
          <BookOpen size={14} className="text-brand-pink" />
          <span>Stylist Editorial Critique</span>
        </span>
        <p className="text-xs md:text-sm text-brand-slate/85 leading-relaxed">
          {curationDetails.content}
        </p>
      </section>

      {/* 4. Shoppable Curated Products Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-brand-pink/15 pb-2">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-brand-burgundy animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate/60">
              Shop this Curated Lookbook ({collectionProducts.length})
            </h3>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] font-bold text-brand-pink bg-brand-pink-light/35 border border-brand-pink/20 rounded-full px-2.5 py-0.5">
            <Flame size={11} className="text-brand-burgundy" />
            <span>Amazon India Program Active</span>
          </div>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="masonry-grid">
            {collectionProducts.map((product) => (
              <OutfitCard
                key={product.id}
                product={product}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-brand-slate/40 text-xs font-medium">
            No items in this collection tray yet.
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
