"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, products } from '../data/products';

export interface Board {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  savedProductIds: string[];
  savedOutfitIds: string[];
}

export interface CreatedOutfit {
  id: string;
  title: string;
  topId: string;
  bottomId: string;
  footwearId: string;
  harmonyScore: number;
  stylistReview: string;
  dateCreated: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProductIds?: string[];
  timestamp: string;
}

export interface PersonalizationProfile {
  categories: Record<string, number>;
  colors: Record<string, number>;
}

export interface AnalyticsData {
  productViews: Record<string, number>;
  categoryViews: Record<string, number>;
  curationViews: Record<string, number>;
  amazonClicks: Record<string, number>;
  pinterestTraffic: number;
}

interface StoreContextType {
  savedProductIds: string[];
  boards: Board[];
  createdOutfits: CreatedOutfit[];
  chatHistory: ChatMessage[];
  profile: PersonalizationProfile;
  subscribers: string[];
  analytics: AnalyticsData;
  isAdminDashboardOpen: boolean;
  
  toggleSaveProduct: (productId: string) => void;
  createBoard: (title: string, description: string, coverImage?: string) => string;
  saveProductToBoard: (productId: string, boardId: string) => void;
  removeProductFromBoard: (productId: string, boardId: string) => void;
  saveCreatedOutfit: (outfit: Omit<CreatedOutfit, 'id' | 'dateCreated'>) => void;
  deleteCreatedOutfit: (outfitId: string) => void;
  addChatMessage: (sender: 'user' | 'assistant', text: string, recommendedProductIds?: string[]) => void;
  clearChatHistory: () => void;
  trackInteraction: (category: string, color: string) => void;
  getPersonalizedFeed: () => Product[];
  
  // Analytics & Newsletter
  trackProductView: (productId: string) => void;
  trackCategoryView: (categoryName: string) => void;
  trackCurationView: (curationSlug: string) => void;
  trackAmazonClick: (productId: string) => void;
  simulatePinterestTraffic: () => void;
  subscribeNewsletter: (email: string) => boolean;
  setIsAdminDashboardOpen: (isOpen: boolean) => void;
  resetAnalytics: () => void;
  
  pinterestLinkStrategy: 'direct' | 'website';
  setPinterestLinkStrategy: (strategy: 'direct' | 'website') => void;
  
  postedPinIds: string[];
  togglePinPosted: (productId: string, pinIndex: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_BOARDS: Board[] = [
  {
    id: "board-default-1",
    title: "College Outfit Ideas",
    description: "Effortless, comfortable, and trendy styling for daily classes.",
    cover_image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
    savedProductIds: ["short-kurti", "linen-trousers"],
    savedOutfitIds: []
  },
  {
    id: "board-default-2",
    title: "Weekend Vibe Outfits",
    description: "Glamorous and elegant chic options for daily outings and parties.",
    cover_image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
    savedProductIds: ["midnight-bloom-dress", "top-co-ord"],
    savedOutfitIds: []
  },
  {
    id: "board-default-3",
    title: "Summer Aesthetic",
    description: "Breezy dresses, pastel shades, and sun-kissed styles.",
    cover_image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop&q=80",
    savedProductIds: ["sunshine-blossom-dress", "coastal-paisley-dress"],
    savedOutfitIds: []
  }
];

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: "chat-msg-1",
    sender: "assistant",
    text: "Hello, fashion lover! ✨ I am your HerCloset AI Stylist, powered by dynamic coordinate matching. Ask me anything!\n\nFor example:\n• *'Suggest a summer outfit'*\n• *'Show me dresses under ₹2000'*\n• *'What goes with linen trousers?'*",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

// Seed Analytics with highly attractive conversion statistics for portfolio showcase
const DEFAULT_ANALYTICS: AnalyticsData = {
  productViews: {
    "midnight-bloom-dress": 245,
    "coastal-paisley-dress": 210,
    "linen-trousers": 195,
    "ivory-co-ord": 142,
    "sunshine-blossom-dress": 154,
    "top-co-ord": 87,
    "short-kurti": 76
  },
  categoryViews: {
    "Kurtis": 84,
    "Dresses": 115,
    "Tops": 58,
    "Bottom Wear": 42
  },
  curationViews: {
    "summer-dresses-under-999": 210,
    "best-amazon-kurtis": 164,
    "wedding-guest-outfits": 182
  },
  amazonClicks: {
    "midnight-bloom-dress": 54,
    "coastal-paisley-dress": 42,
    "linen-trousers": 38,
    "ivory-co-ord": 28,
    "sunshine-blossom-dress": 34,
    "top-co-ord": 14,
    "short-kurti": 11
  },
  pinterestTraffic: 384
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [createdOutfits, setCreatedOutfits] = useState<CreatedOutfit[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [profile, setProfile] = useState<PersonalizationProfile>({ categories: {}, colors: {} });
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(DEFAULT_ANALYTICS);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [pinterestLinkStrategy, setPinterestLinkStrategy] = useState<'direct' | 'website'>('direct');
  const [postedPinIds, setPostedPinIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedIds = localStorage.getItem('HerCloset_saved_ids');
      const savedBoards = localStorage.getItem('HerCloset_boards');
      const savedOutfits = localStorage.getItem('HerCloset_outfits');
      const savedChat = localStorage.getItem('HerCloset_chat');
      const savedProfile = localStorage.getItem('HerCloset_profile');
      const savedSubscribers = localStorage.getItem('HerCloset_subscribers');
      const savedAnalytics = localStorage.getItem('HerCloset_analytics');
      const savedStrategy = localStorage.getItem('HerCloset_pinterest_strategy');
      const savedPostedPins = localStorage.getItem('HerCloset_posted_pins');
      
      if (savedStrategy) setPinterestLinkStrategy(savedStrategy as 'direct' | 'website');
      if (savedPostedPins) setPostedPinIds(JSON.parse(savedPostedPins));

      if (savedIds) setSavedProductIds(JSON.parse(savedIds));
      if (savedBoards) {
        setBoards(JSON.parse(savedBoards));
      } else {
        setBoards(DEFAULT_BOARDS);
      }
      if (savedOutfits) setCreatedOutfits(JSON.parse(savedOutfits));
      if (savedChat) {
        setChatHistory(JSON.parse(savedChat));
      } else {
        setChatHistory(DEFAULT_CHAT);
      }
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedSubscribers) setSubscribers(JSON.parse(savedSubscribers));
      if (savedAnalytics) {
        const parsed = JSON.parse(savedAnalytics);
        if (parsed.productViews && !parsed.productViews["midnight-bloom-dress"]) {
          parsed.productViews["midnight-bloom-dress"] = DEFAULT_ANALYTICS.productViews["midnight-bloom-dress"];
        }
        if (parsed.productViews && !parsed.productViews["coastal-paisley-dress"]) {
          parsed.productViews["coastal-paisley-dress"] = DEFAULT_ANALYTICS.productViews["coastal-paisley-dress"];
        }
        if (parsed.productViews && !parsed.productViews["linen-trousers"]) {
          parsed.productViews["linen-trousers"] = DEFAULT_ANALYTICS.productViews["linen-trousers"];
        }
        if (parsed.amazonClicks && !parsed.amazonClicks["midnight-bloom-dress"]) {
          parsed.amazonClicks["midnight-bloom-dress"] = DEFAULT_ANALYTICS.amazonClicks["midnight-bloom-dress"];
        }
        if (parsed.amazonClicks && !parsed.amazonClicks["coastal-paisley-dress"]) {
          parsed.amazonClicks["coastal-paisley-dress"] = DEFAULT_ANALYTICS.amazonClicks["coastal-paisley-dress"];
        }
        if (parsed.amazonClicks && !parsed.amazonClicks["linen-trousers"]) {
          parsed.amazonClicks["linen-trousers"] = DEFAULT_ANALYTICS.amazonClicks["linen-trousers"];
        }
        setAnalytics(parsed);
      } else {
        setAnalytics(DEFAULT_ANALYTICS);
      }
    } catch (e) {
      console.error("Failed to load local storage state", e);
      setBoards(DEFAULT_BOARDS);
      setChatHistory(DEFAULT_CHAT);
      setAnalytics(DEFAULT_ANALYTICS);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_saved_ids', JSON.stringify(savedProductIds));
  }, [savedProductIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_boards', JSON.stringify(boards));
  }, [boards, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_outfits', JSON.stringify(createdOutfits));
  }, [createdOutfits, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_chat', JSON.stringify(chatHistory));
  }, [chatHistory, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_profile', JSON.stringify(profile));
  }, [profile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_subscribers', JSON.stringify(subscribers));
  }, [subscribers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_analytics', JSON.stringify(analytics));
  }, [analytics, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_pinterest_strategy', pinterestLinkStrategy);
  }, [pinterestLinkStrategy, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('HerCloset_posted_pins', JSON.stringify(postedPinIds));
  }, [postedPinIds, isLoaded]);

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds(prev => {
      const isSaved = prev.includes(productId);
      const updated = isSaved ? prev.filter(id => id !== productId) : [...prev, productId];
      
      if (!isSaved) {
        const prod = products.find(p => p.id === productId);
        if (prod) {
          trackInteraction(prod.category, prod.color);
        }
      }
      return updated;
    });
  };

  const createBoard = (title: string, description: string, coverImage?: string) => {
    const id = `board-${Date.now()}`;
    const newBoard: Board = {
      id,
      title,
      description,
      cover_image: coverImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80",
      savedProductIds: [],
      savedOutfitIds: []
    };
    setBoards(prev => [newBoard, ...prev]);
    return id;
  };

  const saveProductToBoard = (productId: string, boardId: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        if (!b.savedProductIds.includes(productId)) {
          if (!savedProductIds.includes(productId)) {
            setSavedProductIds(f => [...f, productId]);
          }
          const prod = products.find(p => p.id === productId);
          if (prod) {
            trackInteraction(prod.category, prod.color);
          }
          return {
            ...b,
            savedProductIds: [...b.savedProductIds, productId]
          };
        }
      }
      return b;
    }));
  };

  const removeProductFromBoard = (productId: string, boardId: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          savedProductIds: b.savedProductIds.filter(id => id !== productId)
        };
      }
      return b;
    }));
  };

  const saveCreatedOutfit = (outfit: Omit<CreatedOutfit, 'id' | 'dateCreated'>) => {
    const id = `outfit-${Date.now()}`;
    const newOutfit: CreatedOutfit = {
      ...outfit,
      id,
      dateCreated: new Date().toLocaleDateString()
    };
    setCreatedOutfits(prev => [newOutfit, ...prev]);
  };

  const deleteCreatedOutfit = (outfitId: string) => {
    setCreatedOutfits(prev => prev.filter(o => o.id !== outfitId));
  };

  const addChatMessage = (sender: 'user' | 'assistant', text: string, recommendedProductIds?: string[]) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      recommendedProductIds,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, newMsg]);
  };

  const clearChatHistory = () => {
    setChatHistory(DEFAULT_CHAT);
  };

  const trackInteraction = (category: string, color: string) => {
    setProfile(prev => {
      const cats = { ...prev.categories };
      const cols = { ...prev.colors };
      
      cats[category] = (cats[category] || 0) + 1;
      
      let baseColor = color.split(' ')[0];
      cols[baseColor] = (cols[baseColor] || 0) + 1;

      return { categories: cats, colors: cols };
    });
  };

  // Analytics Incrementers
  const trackProductView = (productId: string) => {
    setAnalytics(prev => {
      const views = { ...prev.productViews };
      views[productId] = (views[productId] || 0) + 1;
      return { ...prev, productViews: views };
    });
  };

  const trackCategoryView = (categoryName: string) => {
    setAnalytics(prev => {
      const views = { ...prev.categoryViews };
      views[categoryName] = (views[categoryName] || 0) + 1;
      return { ...prev, categoryViews: views };
    });
  };

  const trackCurationView = (curationSlug: string) => {
    setAnalytics(prev => {
      const views = { ...prev.curationViews };
      views[curationSlug] = (views[curationSlug] || 0) + 1;
      return { ...prev, curationViews: views };
    });
  };

  const trackAmazonClick = (productId: string) => {
    setAnalytics(prev => {
      const clicks = { ...prev.amazonClicks };
      clicks[productId] = (clicks[productId] || 0) + 1;
      return { ...prev, amazonClicks: clicks };
    });
  };

  const simulatePinterestTraffic = () => {
    setAnalytics(prev => {
      const clicks = { ...prev.amazonClicks };
      if (pinterestLinkStrategy === 'direct') {
        // Pick a random product from seed data to receive the direct affiliate click
        const randomProd = products[Math.floor(Math.random() * products.length)];
        if (randomProd) {
          clicks[randomProd.id] = (clicks[randomProd.id] || 0) + 1;
        }
      }
      return {
        ...prev,
        pinterestTraffic: prev.pinterestTraffic + 1,
        amazonClicks: clicks
      };
    });
  };

  const togglePinPosted = (productId: string, pinIndex: number) => {
    const id = `${productId}-${pinIndex}`;
    setPostedPinIds(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(p => p !== id) : [...prev, id];
    });
  };

  const subscribeNewsletter = (email: string) => {
    if (!email || !email.includes('@')) return false;
    if (subscribers.includes(email)) return true; // already subbed
    setSubscribers(prev => [...prev, email]);
    return true;
  };

  const resetAnalytics = () => {
    setAnalytics({
      productViews: {},
      categoryViews: {},
      curationViews: {},
      amazonClicks: {},
      pinterestTraffic: 0
    });
  };

  const getPersonalizedFeed = () => {
    // Determine dynamic trends (Most Clicked Today) from analytics data
    const getTrendingScore = (prodId: string) => {
      const clicks = analytics.amazonClicks[prodId] || 0;
      const views = analytics.productViews[prodId] || 0;
      return clicks * 5 + views; // click holds higher trending weight
    };

    // Personalized Sort matching affinity score
    return [...products].sort((a, b) => {
      let scoreA = getTrendingScore(a.id);
      let scoreB = getTrendingScore(b.id);

      // Category interaction weights
      if (profile.categories[a.category]) {
        scoreA += profile.categories[a.category] * 12; 
      }
      if (profile.categories[b.category]) {
        scoreB += profile.categories[b.category] * 12;
      }

      // Color weights
      const colorA = a.color.split(' ')[0];
      const colorB = b.color.split(' ')[0];
      if (profile.colors[colorA]) scoreA += profile.colors[colorA] * 8;
      if (profile.colors[colorB]) scoreB += profile.colors[colorB] * 8;

      return scoreB - scoreA;
    });
  };

  return (
    <StoreContext.Provider value={{
      savedProductIds,
      boards,
      createdOutfits,
      chatHistory,
      profile,
      subscribers,
      analytics,
      isAdminDashboardOpen,
      
      toggleSaveProduct,
      createBoard,
      saveProductToBoard,
      removeProductFromBoard,
      saveCreatedOutfit,
      deleteCreatedOutfit,
      addChatMessage,
      clearChatHistory,
      trackInteraction,
      getPersonalizedFeed,
      
      trackProductView,
      trackCategoryView,
      trackCurationView,
      trackAmazonClick,
      simulatePinterestTraffic,
      subscribeNewsletter,
      setIsAdminDashboardOpen,
      resetAnalytics,
      
      pinterestLinkStrategy,
      setPinterestLinkStrategy,
      
      postedPinIds,
      togglePinPosted
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
