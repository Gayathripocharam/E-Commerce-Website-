"use client";

import React, { useState } from 'react';
import { Search, UploadCloud, CheckCircle, Palette, Flame, HelpCircle } from 'lucide-react';
import { useStore } from '@/context/useStore';
import { Product, products } from '@/data/products';
import OutfitCard from '@/components/OutfitCard';
import OutfitDetailModal from '@/components/OutfitDetailModal';

export default function VisualSearchPage() {
  const [selectedDemoImage, setSelectedDemoImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedTags, setExtractedTags] = useState<{ colors: string[]; style: string; category: string } | null>(null);
  const [similarResults, setSimilarResults] = useState<Product[]>([]);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // 4 Demo seeding assets for quick portfolio testing
  const demoStyleSeeds = [
    {
      title: "Festive Emerald Look",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80",
      dominantColor: "Emerald Green",
      style: "Traditional",
      category: "Wedding Collection"
    },
    {
      title: "Sunny Summer Vibe",
      url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&auto=format&fit=crop&q=80",
      dominantColor: "Yellow / Gold",
      style: "Boho",
      category: "Summer Collection"
    },
    {
      title: "Sleek Workspace Vest",
      url: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&auto=format&fit=crop&q=80",
      dominantColor: "Beige / Neutral",
      style: "Professional",
      category: "Office Wear"
    },
    {
      title: "Chic Street Denim",
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80",
      dominantColor: "Blue / Denim",
      style: "Chic",
      category: "Casual Outfits"
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local object URL for preview
    const objectUrl = URL.createObjectURL(file);
    triggerScanning(objectUrl, "Custom Upload", "Chic", "Western Wear", "Red");
  };

  const selectDemoSeed = (seed: typeof demoStyleSeeds[0]) => {
    let cleanColor = seed.dominantColor.split(' ')[0];
    triggerScanning(seed.url, seed.title, seed.style, seed.category, cleanColor);
  };

  // Triggers the visual scanner scan lines animation and does pixel color coordination
  const triggerScanning = (
    imgUrl: string,
    title: string,
    style: string,
    category: string,
    colorGroup: string
  ) => {
    setSelectedDemoImage(imgUrl);
    setIsScanning(true);
    setExtractedTags(null);
    setSimilarResults([]);

    setTimeout(() => {
      // 1. Compile simulated extracted color swatches and style descriptors
      const colorGroups: Record<string, string[]> = {
        'Emerald': ['#097969', '#E0A899', '#FAF6F0'],
        'Yellow': ['#FFD700', '#F5F5DC', '#2C2C2C'],
        'Beige': ['#F5F5DC', '#8B4513', '#FAF6F0'],
        'Blue': ['#4682B4', '#1A202C', '#FFFFFF'],
        'Red': ['#FF0000', '#000000', '#FAF6F0']
      };

      const matchedSwatches = colorGroups[colorGroup] || ['#E0A899', '#4A0E17', '#FAF6F0'];
      
      setExtractedTags({
        colors: matchedSwatches,
        style,
        category
      });

      // 2. Query products for visual matches using tags and color rules
      const matches = products.filter(p => {
        let similarity = 0;
        
        // Match style category
        if (p.style === style) similarity += 3;
        if (p.category === category) similarity += 3;
        
        // Match color bounds
        const pColor = p.color.toLowerCase();
        const cGroup = colorGroup.toLowerCase();
        if (pColor.includes(cGroup)) similarity += 4;
        
        return similarity > 0;
      });

      // Sort matching results descending
      matches.sort((a, b) => {
        const aColor = a.color.toLowerCase().includes(colorGroup.toLowerCase()) ? 1 : 0;
        const bColor = b.color.toLowerCase().includes(colorGroup.toLowerCase()) ? 1 : 0;
        return bColor - aColor;
      });

      setSimilarResults(matches.slice(0, 4));
      setIsScanning(false);
    }, 1800);
  };

  const handleOpenDetails = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  const handleCloseDetails = () => {
    setActiveDetailProduct(null);
  };

  return (
    <div className="flex flex-col gap-8 pb-16 animate-fade-in-up">
      {/* Title */}
      <div>
        <span className="text-xs font-bold tracking-widest text-brand-pink-dark uppercase">AI COMPUTER VISION</span>
        <h1 className="text-3xl md:text-5xl font-display font-semibold text-brand-slate tracking-wide">
          Similar Outfit Search
        </h1>
        <p className="text-xs md:text-sm text-brand-slate/60 max-w-xl mt-1 leading-relaxed">
          Upload any dress image, or pick one of our style seeds. Our AI parses the color palettes, style tags, and retrieves visually similar outfits instantly!
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Image Uploader & Scanner Frame (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Uploader Card */}
          <div className="rounded-[2.5rem] glassmorphism p-6 border border-brand-pink/25 bg-brand-champagne/45 flex flex-col gap-5 relative overflow-hidden">
            
            {/* Visual scan animation layer */}
            {isScanning && (
              <div className="absolute inset-0 bg-brand-burgundy/10 z-20 pointer-events-none">
                {/* Scanning green line */}
                <div className="w-full h-1 bg-gradient-to-r from-brand-pink to-brand-gold absolute left-0 top-0 shadow-lg animate-bounce" style={{ animationDuration: '2.5s' }} />
              </div>
            )}

            <div className="flex items-center justify-between pb-2 border-b border-brand-pink/15">
              <span className="text-xs font-bold tracking-wider text-brand-burgundy uppercase flex items-center gap-1">
                <Search size={14} className="text-brand-pink" />
                <span>Upload Reference Style</span>
              </span>
            </div>

            {/* Drag & Drop File Selector area */}
            {!selectedDemoImage ? (
              <label className="relative border-2 border-dashed border-brand-pink/20 hover:border-brand-pink/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer bg-brand-pink-light/10 hover:bg-brand-pink-light/20 transition-all aspect-[4/3]">
                <UploadCloud size={38} className="text-brand-pink-dark animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-brand-slate uppercase">Drag & Drop Image</h4>
                  <p className="text-[10px] text-brand-slate/50 mt-1">PNG, JPG or WEBP formats accepted</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              /* Preview Area */
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-brand-pink/30 shadow-md">
                <img
                  src={selectedDemoImage}
                  alt="Reference Style Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Reset preview button */}
                <button
                  onClick={() => {
                    setSelectedDemoImage(null);
                    setExtractedTags(null);
                    setSimilarResults([]);
                  }}
                  className="absolute bottom-3 right-3 bg-brand-cream hover:bg-brand-pink-light text-brand-burgundy font-semibold text-[10px] px-3.5 py-1.5 rounded-full border border-brand-pink/35 shadow-md z-30 uppercase"
                >
                  Clear Upload
                </button>

                {isScanning && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-brand-cream gap-2 z-15">
                    <div className="w-6 h-6 border-2 border-brand-pink border-t-brand-cream rounded-full animate-spin" />
                    <p className="text-[10px] uppercase font-bold tracking-widest text-brand-pink">Running CLIP Embeddings Analysis</p>
                  </div>
                )}
              </div>
            )}

            {/* Presets Grid */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-[10px] font-bold text-brand-slate/50 uppercase text-left">Or Select a Style Seed</h4>
              <div className="grid grid-cols-4 gap-2">
                {demoStyleSeeds.map((seed, i) => (
                  <div
                    key={i}
                    onClick={() => selectDemoSeed(seed)}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-brand-pink/15 hover:border-brand-pink/50 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    title={seed.title}
                  >
                    <img src={seed.url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* EXTRACTED STYLING DATA (Triggered after scan) */}
          {extractedTags && (
            <div className="rounded-[2.5rem] glassmorphism p-6 border border-brand-pink/25 bg-brand-champagne/45 flex flex-col gap-4 animate-fade-in-up text-left">
              
              <div className="flex items-center gap-1.5 pb-2 border-b border-brand-pink/15">
                <CheckCircle size={15} className="text-brand-burgundy" />
                <span className="text-xs font-bold tracking-wider text-brand-burgundy uppercase">Analysis Complete</span>
              </div>

              {/* Dominant Colors swatches list */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Extracted Color Palette</span>
                <div className="flex gap-2">
                  {extractedTags.colors.map((colorHex, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border border-brand-pink/20 shadow-inner flex items-center justify-center group relative cursor-pointer"
                      style={{ backgroundColor: colorHex }}
                      title={colorHex}
                    >
                      <span className="hidden group-hover:block absolute bottom-10 bg-brand-burgundy text-brand-cream text-[9px] px-1.5 py-0.5 rounded leading-none border border-brand-pink/30 shadow z-50">
                        {colorHex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted descriptors tags list */}
              <div className="flex flex-col gap-2 pt-2 border-t border-brand-pink/10">
                <span className="text-[10px] font-bold tracking-wider text-brand-pink-dark uppercase">Visual Classifier Attributes</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold text-brand-burgundy bg-brand-pink-light/50 border border-brand-pink/20 px-2.5 py-1 rounded-full">
                    Aesthetic: **{extractedTags.style}**
                  </span>
                  <span className="text-[10px] font-bold text-brand-burgundy bg-brand-pink-light/50 border border-brand-pink/20 px-2.5 py-1 rounded-full">
                    Structure: **{extractedTags.category}**
                  </span>
                  <span className="text-[10px] font-bold text-brand-burgundy bg-brand-pink-light/50 border border-brand-pink/20 px-2.5 py-1 rounded-full">
                    Tone matches: **Color Vector 0.89**
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Visual Similar Match Results (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between py-2 border-b border-brand-pink/15">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-brand-burgundy" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-slate/60">
                Visually Similar Matches
              </h3>
            </div>
            
            {similarResults.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-pink bg-brand-pink-light/35 border border-brand-pink/20 rounded-full px-2.5 py-0.5">
                <Flame size={11} className="text-brand-burgundy" />
                <span>Found {similarResults.length} matches</span>
              </div>
            )}
          </div>

          {similarResults.length > 0 ? (
            /* Results grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarResults.map((product) => (
                <OutfitCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                />
              ))}
            </div>
          ) : (
            /* Blank state */
            <div className="w-full flex flex-col items-center justify-center py-20 text-center gap-4 bg-brand-champagne/40 rounded-[2rem] border border-brand-pink/20 border-dashed min-h-[50vh]">
              <div className="w-12 h-12 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-burgundy">
                <Search size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-slate">No visual matches loaded</h4>
                <p className="text-xs text-brand-slate/60 max-w-sm mt-1 leading-relaxed px-6">
                  Select one of our preset styling seed boxes on the left, or upload your own fashion image file to search visually similar outfits in the catalog immediately!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

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
