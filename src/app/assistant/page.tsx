"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash2, Heart, ExternalLink, Bookmark, Check } from 'lucide-react';
import { useStore, ChatMessage } from '@/context/useStore';
import { Product, products } from '@/data/products';
import OutfitDetailModal from '@/components/OutfitDetailModal';

export default function AssistantPage() {
  const { chatHistory, addChatMessage, clearChatHistory, toggleSaveProduct, savedProductIds } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  const handleOpenDetails = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  const handleCloseDetails = () => {
    setActiveDetailProduct(null);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const presetQueries = [
    { text: "Suggest a wedding guest outfit", icon: "👑" },
    { text: "College looks under ₹2000", icon: "🎒" },
    { text: "What goes with a pink top?", icon: "🌸" },
    { text: "Show me party wear under ₹5000", icon: "🍷" }
  ];

  // Core Style Parsing Engine (NLP simulation matching seed database)
  const processQuery = (query: string) => {
    setIsTyping(true);
    
    // 1. Record user's query
    addChatMessage('user', query);

    setTimeout(() => {
      const q = query.toLowerCase();
      let matchedItems: Product[] = [];
      let replyText = '';

      // Occasion parser
      let targetOccasion: string | null = null;
      if (q.includes('wedding') || q.includes('marriage') || q.includes('reception') || q.includes('shaadi')) targetOccasion = 'Wedding';
      else if (q.includes('party') || q.includes('night out') || q.includes('clubbing')) targetOccasion = 'Party';
      else if (q.includes('college') || q.includes('class') || q.includes('lectures') || q.includes('uni')) targetOccasion = 'College';
      else if (q.includes('office') || q.includes('work') || q.includes('formal') || q.includes('interview')) targetOccasion = 'Office';
      else if (q.includes('summer') || q.includes('beach') || q.includes('holiday') || q.includes('vacation')) targetOccasion = 'Summer';
      else if (q.includes('casual') || q.includes('daily') || q.includes('chill') || q.includes('weekend')) targetOccasion = 'Casual';

      // Price threshold parser (e.g. "under 2000" or "below 5000")
      let priceCap = Infinity;
      const priceMatch = q.match(/(?:under|below|less than|within|₹|\b)\s?(\d{4,5})\b/);
      if (priceMatch && priceMatch[1]) {
        priceCap = parseInt(priceMatch[1]);
      }

      // Color parser
      let targetColor: string | null = null;
      if (q.includes('pink') || q.includes('rose')) targetColor = 'pink';
      else if (q.includes('green') || q.includes('emerald') || q.includes('sage')) targetColor = 'green';
      else if (q.includes('black') || q.includes('midnight') || q.includes('dark')) targetColor = 'black';
      else if (q.includes('blue') || q.includes('denim')) targetColor = 'blue';
      else if (q.includes('red') || q.includes('scarlet') || q.includes('crimson')) targetColor = 'red';
      else if (q.includes('gold') || q.includes('yellow') || q.includes('champagne')) targetColor = 'gold';
      else if (q.includes('beige') || q.includes('sand') || q.includes('brown') || q.includes('tan')) targetColor = 'neutral';
      else if (q.includes('white') || q.includes('ivory')) targetColor = 'white';
      else if (q.includes('lavender') || q.includes('purple')) targetColor = 'lavender';

      // 2. Query product database
      matchedItems = products.filter(p => {
        // Occasion filter
        const matchOccasion = !targetOccasion || p.occasion === targetOccasion || p.category.includes(targetOccasion);
        
        // Price filter
        const matchPrice = p.price <= priceCap;

        // Color filter (approximate group)
        let matchColor = true;
        if (targetColor) {
          const colorName = p.color.toLowerCase();
          if (targetColor === 'neutral') matchColor = colorName.includes('beige') || colorName.includes('sand') || colorName.includes('brown') || colorName.includes('tan');
          else matchColor = colorName.includes(targetColor);
        }

        return matchOccasion && matchPrice && matchColor;
      });

      // Sort matched suggestions by highest price first
      matchedItems.sort((a, b) => b.discount_price - a.discount_price);

      // Return top 3 matched styling products
      matchedItems = matchedItems.slice(0, 3);

      // 3. Compose customized style stylist critiques
      if (matchedItems.length > 0) {
        let occasionContext = targetOccasion ? `for ${targetOccasion} settings` : "to elevate your wardrobe";
        let priceContext = priceCap !== Infinity ? ` matching your budget under ₹${priceCap}` : "";
        let colorContext = targetColor ? ` highlighting elegant ${targetColor} hues` : "";

        replyText = `✨ Here are some style suggestions I curated especially for you ${occasionContext}${priceContext}${colorContext}!\n\n`;

        if (targetOccasion === 'Wedding') {
          replyText += `For weddings, heavy georgettes or silks with rich embroidery set a marvelous traditional tone. Complete the aesthetic with embellished Mojaris and metallic bags.`;
        } else if (targetOccasion === 'College') {
          replyText += `For college, Chikankari Kurtis or linen crop shirts are both super breathable and extremely trendy. Match them with comfortable platform sneakers for an effortless day on campus.`;
        } else if (targetOccasion === 'Party') {
          replyText += `For a night out, velvet tunics, satin midi skirts, or sequined gowns create stunning silhouettes. Accentuate with stilettos to capture the glamorous vibe!`;
        } else if (q.includes('pink') && q.includes('goes with')) {
          replyText += `A pink top coordinates beautifully with high-waisted denim for a casual look, sand pleated trousers for a workspace chic aesthetic, or gold brocade bottoms for custom festive flair.`;
        } else {
          replyText += `These curated coordinates carry beautiful silhouettes and balance. Click any product to explore detailed sizing, outfit pairings, and official shop links.`;
        }
      } else {
        // Fallback if no items match query
        replyText = `✨ I love that query! While we don't have items that perfectly match *all* of those filters at this exact moment, here are some of our trending seasonal outfit finds that match that styling aesthetic:`;
        matchedItems = products.filter(p => ['Dresses', 'Kurtis', 'Sarees'].includes(p.category)).slice(0, 3);
      }

      // Add assistant response to history
      addChatMessage('assistant', replyText, matchedItems.map(item => item.id));
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processQuery(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-h-[82vh] h-[82vh] pb-6 animate-fade-in-up">
      
      {/* LEFT COLUMN: Presets & Tips Panel (4 Columns on Desktop) */}
      <div className="hidden md:flex md:w-1/3 flex-col gap-5 text-left h-full">
        <div className="rounded-[2.5rem] glassmorphism p-6 border border-brand-pink/25 bg-brand-champagne/45 flex flex-col gap-5 h-full overflow-y-auto">
          
          <div className="flex items-center gap-2 pb-2 border-b border-brand-pink/15">
            <Sparkles size={16} className="text-brand-pink animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-burgundy">AI Stylist Guide</h3>
          </div>

          <div>
            <h4 className="text-xs font-bold text-brand-slate/60 uppercase">Popular Prompts</h4>
            <p className="text-xs text-brand-slate/50 mt-0.5 leading-normal">
              Click any style chip to query the AI assistant immediately:
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-col gap-2">
            {presetQueries.map((preset, i) => (
              <button
                key={i}
                onClick={() => processQuery(preset.text)}
                disabled={isTyping}
                className="w-full text-left bg-brand-cream/80 hover:bg-brand-pink-light/35 border border-brand-pink/15 hover:border-brand-pink/35 px-4 py-3 rounded-2xl text-xs font-semibold text-brand-slate hover:text-brand-burgundy transition-all flex items-center gap-2.5 disabled:opacity-50"
              >
                <span className="text-base">{preset.icon}</span>
                <span className="truncate">{preset.text}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto bg-brand-pink-light/20 border border-brand-pink/10 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-brand-burgundy uppercase">Styling Commands</h4>
            <ul className="text-[11px] text-brand-slate/75 mt-2 flex flex-col gap-1.5 list-disc pl-4 leading-relaxed">
              <li>Type **"under ₹XXXX"** to search specific budget ranges.</li>
              <li>Include occasions like **wedding**, **college**, or **party**.</li>
              <li>Ask for matches like **"goes with a pink top"** or **"goes with black skirt"**.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Chat Room (8 Columns on Desktop) */}
      <div className="w-full md:w-2/3 flex flex-col h-full bg-brand-champagne/45 rounded-[2.5rem] border border-brand-pink/25 glassmorphism shadow-lg overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-brand-pink/20 bg-brand-cream/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-burgundy to-brand-pink-dark flex items-center justify-center text-brand-cream border border-brand-pink/35 shadow-md">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-slate leading-none">HerCloset AI Stylist</h3>
              <span className="text-[10px] text-brand-pink-dark font-semibold tracking-wide mt-1 block">ONLINE • PRO STYLING ADVICE</span>
            </div>
          </div>

          <button
            onClick={clearChatHistory}
            className="text-brand-slate/40 hover:text-brand-burgundy p-2 rounded-xl hover:bg-brand-pink-light/35 transition-all"
            title="Clear conversation"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 scrollbar-none">
          {chatHistory.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  isAssistant ? 'self-start text-left' : 'self-end text-right'
                }`}
              >
                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isAssistant
                      ? 'bg-brand-cream border border-brand-pink/20 text-brand-slate'
                      : 'bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light text-brand-cream'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  {/* Inline Shoppable Products Embedded Carousel (Only for Assistant recommendation messages) */}
                  {isAssistant && msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-brand-pink/15">
                      {products
                        .filter(p => msg.recommendedProductIds!.includes(p.id))
                        .map(item => {
                          const isSaved = savedProductIds.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => setActiveDetailProduct(item)}
                              className="bg-brand-champagne/90 rounded-2xl p-2 border border-brand-pink/20 hover:border-brand-pink/40 shadow-sm cursor-pointer hover:shadow transition-all group flex flex-col gap-1"
                            >
                              {/* Image */}
                              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-brand-pink-light/10 relative">
                                <img src={item.image_urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                
                                {/* Quick save Heart badge */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaveProduct(item.id);
                                  }}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-brand-cream flex items-center justify-center shadow"
                                >
                                  <Heart size={12} className={isSaved ? 'fill-brand-burgundy text-brand-burgundy' : 'text-brand-pink'} />
                                </button>
                              </div>
                              
                              {/* Meta */}
                              <span className="text-[8px] uppercase tracking-widest text-brand-pink-dark font-extrabold">{item.brand}</span>
                              <h4 className="text-[10px] font-bold text-brand-slate line-clamp-1 leading-snug">{item.title}</h4>
                              <div className="flex justify-between items-center mt-1 pt-1 border-t border-brand-pink/10">
                                <span className="text-[10px] font-bold text-brand-burgundy">₹{item.price}</span>
                                <span className="text-[8px] font-bold text-brand-pink capitalize">{item.color.split(' ')[0]}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                </div>
                {/* Timestamp */}
                <span className="text-[9px] text-brand-slate/40 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="self-start text-left max-w-[80%] flex flex-col gap-1">
              <div className="bg-brand-cream border border-brand-pink/20 text-brand-slate rounded-2xl px-4.5 py-3.5 flex items-center gap-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Message Area */}
        <div className="p-4 border-t border-brand-pink/20 bg-brand-cream/30 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask AI Stylist... (e.g. Suggest wedding dresses under ₹5000)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              className="flex-grow rounded-2xl bg-brand-cream/80 border border-brand-pink/25 focus:border-brand-pink text-xs font-semibold text-brand-slate px-4 py-3.5 focus:outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-to-r from-brand-burgundy to-brand-burgundy-light hover:from-brand-burgundy-light hover:to-brand-pink-dark text-brand-cream font-bold px-4.5 rounded-2xl shadow border border-brand-pink/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100"
            >
              <Send size={15} />
            </button>
          </form>
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
