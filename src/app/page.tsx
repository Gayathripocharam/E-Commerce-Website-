"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, Flame, BookOpen } from 'lucide-react';
import { useStore } from '../context/useStore';
import { Product, products } from '../data/products';
import OutfitCard from '../components/OutfitCard';
import FashionTicker from '../components/FashionTicker';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Typing Effect Hook ─────────────────────────────────────────
function useTypingEffect(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// ─── Count-Up Hook ───────────────────────────────────────────────
function useCountUp(target: number, duration = 1.5, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration, start]);
  return value;
}

// ─── Magnetic Button Component ──────────────────────────────────
function MagneticButton({ children, onClick, className }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ─── Mouse Blob Component ────────────────────────────────────────
function MouseBlob() {
  const blobX = useMotionValue(0);
  const blobY = useMotionValue(0);
  const springX = useSpring(blobX, { stiffness: 60, damping: 18 });
  const springY = useSpring(blobY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      blobX.set(e.clientX - 200);
      blobY.set(e.clientY - 200);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [blobX, blobY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
      style={{
        x: springX,
        y: springY,
        background: 'radial-gradient(circle, rgba(224,168,153,0.13) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  );
}

// ─── Stat Chip with Count-Up ─────────────────────────────────────
function StatChip({ label, val, numericVal, started }: {
  label: string;
  val: string;
  numericVal?: number;
  started: boolean;
}) {
  const count = useCountUp(numericVal ?? 0, 1.6, started && !!numericVal);
  const display = numericVal ? `${count}+` : val;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, type: 'spring', stiffness: 220, damping: 18 }}
      className="flex flex-col items-center bg-brand-cream/10 border border-brand-pink/20 rounded-xl px-4 py-2 backdrop-blur-sm"
    >
      <span className="text-base font-extrabold text-brand-cream">{display}</span>
      <span className="text-[9px] uppercase tracking-widest text-brand-pink/80 font-semibold">{label}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const router = useRouter();
  const { getPersonalizedFeed, analytics } = useStore();
  const [statsStarted, setStatsStarted] = useState(false);

  const typingWords = ['Style Muse', 'Fashion Finds', 'Your Wardrobe', 'Dream Closet'];
  const typedText = useTypingEffect(typingWords, 75, 1800);

  const categories = [
    { name: 'Kurtis',      icon: '🎒', count: 'College Style' },
    { name: 'Sarees',      icon: '👑', count: 'Festive Wear' },
    { name: 'Dresses',     icon: '👗', count: 'Summer Sundress' },
    { name: 'Tops',        icon: '🌸', count: 'Casual Chic' },
    { name: 'Bottom Wear', icon: '👖', count: 'Pleated Pants' },
    { name: 'Footwear',    icon: '👠', count: 'Block Heels' },
    { name: 'Handbags',    icon: '👜', count: 'Hobo Purses' },
    { name: 'Jewelry',     icon: '✨', count: 'Kundan Jhumkas' },
    { name: 'Beauty',      icon: '💄', count: 'Velvet Lipcolor' },
  ];

  const lookbooks = [
    {
      slug: 'summer-dresses-under-999',
      title: 'Summer Dresses Under ₹999',
      desc: 'Light floral tiered midis.',
      cover: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop&q=80',
    },
    {
      slug: 'best-amazon-kurtis',
      title: 'Best Amazon Kurtis',
      desc: 'Chikankari & cotton Anarkalis.',
      cover: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=400&auto=format&fit=crop&q=80',
    },
    {
      slug: 'wedding-guest-outfits',
      title: 'Wedding Guest Outfits',
      desc: 'Lavish sarees & juttis.',
      cover: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const personalizedFeed = getPersonalizedFeed();

  const trendingTodayProducts = useMemo(() => {
    return [...products]
      .map(p => {
        const clicks = analytics.amazonClicks[p.id] || 0;
        const views  = analytics.productViews[p.id] || 0;
        return { product: p, score: clicks * 4 + views };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.product);
  }, [analytics]);

  const handleOpenDetails = (prod: Product) => {
    router.push(`/product/${prod.id}`);
  };

  // Start count-up after 1.4s (when stats chips appear)
  useEffect(() => {
    const t = setTimeout(() => setStatsStarted(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) => ({
    initial:  { opacity: 0, y: 40 },
    animate:  { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  const popIn = (delay = 0) => ({
    initial:  { opacity: 0, scale: 0.7 },
    animate:  { opacity: 1, scale: 1 },
    transition: { duration: 0.45, delay, type: 'spring' as const, stiffness: 220, damping: 18 },
  });

  // Infinite float offsets — each card gets a different phase
  const floatAnim = (delay = 0) => ({
    animate: { y: [0, -12, 0] },
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay },
  });

  return (
    <>
      {/* Mouse-following gradient blob (global, behind everything) */}
      <MouseBlob />

      <div className="flex flex-col gap-10 pb-16">

        {/* ══════════════════════════════════════════════════════
            1.  ANIMATED HERO
        ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden rounded-[2.5rem] text-brand-cream border border-brand-pink/20 shadow-2xl flex flex-col md:flex-row items-center gap-8 justify-between min-h-[460px] p-8 md:p-14">

          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-[2.5rem]"
            animate={{
              background: [
                'linear-gradient(135deg, #4A0E17 0%, #722F37 50%, #C98B7C 100%)',
                'linear-gradient(135deg, #722F37 0%, #4A0E17 50%, #E0A899 100%)',
                'linear-gradient(135deg, #4A0E17 0%, #722F37 50%, #C98B7C 100%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Pulsing glow orb 1 */}
          <motion.div
            className="absolute right-0 top-0 w-96 h-96 rounded-full bg-brand-pink/25 blur-[120px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Pulsing glow orb 2 */}
          <motion.div
            className="absolute left-1/4 bottom-0 w-64 h-64 rounded-full bg-brand-gold/20 blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* ── LEFT: text ── */}
          <div className="flex flex-col gap-5 md:w-3/5 text-left relative z-10">

            {/* Badge */}
            <motion.div {...fadeUp(0.1)}
              className="flex items-center gap-2 bg-brand-cream/10 border border-brand-pink-light/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-brand-pink"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
              >
                <Sparkles size={11} />
              </motion.span>
              AMAZON INDIA AFFILIATE PLATFORM
            </motion.div>

            {/* Headline — word-by-word stagger */}
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] tracking-wide text-brand-cream">
              {['Discover', 'Your', 'Next'].map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
              <br className="hidden md:block" />
              {/* Typing effect for the brand tagline */}
              <motion.span
                className="bg-gradient-to-r from-brand-pink to-brand-cream bg-clip-text text-transparent italic font-light inline-block min-w-[2ch]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="not-italic text-brand-pink ml-0.5"
                >|</motion.span>
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p {...fadeUp(0.9)}
              className="text-xs md:text-sm text-brand-cream/80 max-w-lg leading-relaxed"
            >
              A premium fashion discovery &amp; shopping inspiration platform. Explore curated Amazon India picks, save styles to mood boards, and complete the look dynamically. ✨
            </motion.p>

            {/* CTA Buttons — Magnetic + normal */}
            <motion.div {...fadeUp(1.05)} className="flex flex-wrap gap-3">
              <MagneticButton
                onClick={() => document.getElementById('feed-start')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-dark text-brand-cream font-bold px-6 py-3.5 rounded-2xl shadow-lg border border-brand-pink-light/20 text-xs uppercase tracking-wider group cursor-pointer"
              >
                Discover Feed
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/curations"
                  className="flex items-center gap-2 bg-brand-cream/10 hover:bg-brand-cream/20 text-brand-cream font-bold px-6 py-3.5 rounded-2xl border border-brand-pink-light/25 text-xs uppercase tracking-wider"
                >
                  <BookOpen size={14} />
                  Browse Lookbooks
                </Link>
              </motion.div>
            </motion.div>

            {/* Count-up stats */}
            <motion.div
              className="flex gap-3 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <StatChip label="Products"     val={`${products.length}+`} numericVal={products.length} started={statsStarted} />
              <StatChip label="Categories"   val="9"                     numericVal={9}                started={statsStarted} />
              <StatChip label="Amazon Deals" val="Daily"                                              started={statsStarted} />
            </motion.div>
          </div>

          {/* ── RIGHT: stacked floating product cards ── */}
          <div className="hidden md:flex items-center justify-center md:w-2/5 relative h-80">

            {/* Left back card — floats with phase offset */}
            <motion.div
              initial={{ opacity: 0, x: -70, rotate: -8 }}
              animate={{ opacity: 1, x: 0, rotate: -6 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: -2, scale: 1.06 }}
              onClick={() => router.push('/product/midnight-bloom-dress')}
              className="absolute w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-brand-pink/25 shadow-xl bg-brand-burgundy/40 cursor-pointer"
              style={{ top: '22px', left: '4%' }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="w-full h-full"
              >
                <img src={products[5]?.image_urls[0]} alt={products[5]?.title} className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>

            {/* Right back card */}
            <motion.div
              initial={{ opacity: 0, x: 70, rotate: 8 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: 2, scale: 1.06 }}
              onClick={() => router.push('/product/sunshine-blossom-dress')}
              className="absolute w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-brand-pink/25 shadow-xl bg-brand-burgundy/40 cursor-pointer"
              style={{ top: '22px', right: '4%' }}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="w-full h-full"
              >
                <img src={products[6]?.image_urls[0]} alt={products[6]?.title} className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>

            {/* Main center card */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: 0, scale: 1.06 }}
              onClick={() => router.push('/product/coastal-paisley-dress')}
              className="absolute w-52 aspect-[3/4] rounded-3xl overflow-hidden border-2 border-brand-pink/40 shadow-2xl bg-brand-burgundy/40 cursor-pointer z-10"
              style={{ top: '0px', left: '50%', marginLeft: '-6.5rem' }}
            >
              {/* Infinite float on the center card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <img src={products[2]?.image_urls[0]} alt={products[2]?.title} className="w-full h-full object-cover" />
              </motion.div>
              <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-brand-burgundy/88 backdrop-blur-sm text-brand-cream border border-brand-pink/30 p-2.5 flex justify-between items-center">
                <div>
                  <span className="text-[7px] uppercase tracking-widest text-brand-pink font-extrabold block">TrendBelle</span>
                  <p className="text-[10px] font-semibold text-brand-cream mt-0.5 line-clamp-1">{products[2]?.title}</p>
                </div>
                <span className="text-[10px] font-bold text-brand-gold bg-brand-cream/10 px-2 py-0.5 rounded border border-brand-pink/20">
                  ₹{products[2]?.discount_price?.toLocaleString('en-IN')}
                </span>
              </div>
            </motion.div>

            {/* Floating badge @hercloset */}
            <motion.div
              {...popIn(1.1)}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
              className="absolute top-1 right-3 z-20 bg-brand-cream text-brand-burgundy text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-brand-pink/25"
            >
              <span className="w-4 h-4 rounded-full bg-brand-burgundy text-brand-cream text-[8px] flex items-center justify-center font-black">H</span>
              @hercloset
            </motion.div>

            {/* Floating badge Trending */}
            <motion.div
              {...popIn(1.3)}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              className="absolute bottom-14 left-0 z-20 bg-brand-pink text-brand-cream text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
            >
              <Sparkles size={10} />
              Trending Now
            </motion.div>

            {/* Floating badge deal */}
            <motion.div
              {...popIn(1.5)}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute bottom-3 right-1 z-20 bg-brand-gold text-brand-slate text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg"
            >
              🔥 Up to 50% Off
            </motion.div>
          </div>

        </section>

        {/* Fashion Ticker */}
        <FashionTicker />

        {/* ══════════════════════════════════════════════════════
            2.  CATEGORIES — stagger pop-in on scroll
        ══════════════════════════════════════════════════════ */}
        <motion.section
          className="flex flex-col gap-4 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-pink-dark uppercase">DEPARTMENT HUB</span>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-brand-slate tracking-wide">
              Browse Curation Departments
            </h2>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4 md:-mx-8 md:px-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/category/${cat.name}`} className="snap-start flex flex-col items-center gap-2 min-w-[5.5rem] group">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-brand-champagne/80 hover:bg-brand-pink-light/35 border border-brand-pink/15 group-hover:border-brand-pink/55 flex items-center justify-center text-2xl shadow-sm transition-colors duration-300"
                    whileHover={{ scale: 1.14, rotate: [0, -8, 8, 0] }}
                    whileTap={{ scale: 0.94 }}
                  >
                    {cat.icon}
                  </motion.div>
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xs font-bold text-brand-slate group-hover:text-brand-burgundy transition-all">{cat.name}</span>
                    <span className="text-[8px] text-brand-slate/40 mt-1 font-bold">{cat.count}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            3.  TRENDING TODAY — scroll reveal + hover lift
        ══════════════════════════════════════════════════════ */}
        {trendingTodayProducts.length > 0 && (
          <motion.section
            className="flex flex-col gap-5 text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between border-b border-brand-pink/15 pb-2">
              <div className="flex items-center gap-1.5">
                <Flame size={18} className="text-brand-burgundy animate-pulse" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-brand-slate/60">
                  Trending on Amazon Today
                </h2>
              </div>
              <span className="text-[9px] font-bold text-brand-pink bg-brand-pink-light/35 border border-brand-pink/20 rounded-full px-2.5 py-0.5">
                Popularity Graded
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingTodayProducts.map((prod, index) => {
                const discountPercent = Math.round(((prod.price - prod.discount_price) / prod.price) * 100);
                return (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => router.push(`/product/${prod.id}`)}
                    className="group flex flex-col gap-2 cursor-pointer bg-brand-champagne/30 rounded-3xl p-2.5 border border-brand-pink/15 hover:border-brand-pink/45 hover:shadow-lg transition-colors duration-300 relative"
                  >
                    <span className="absolute top-4 left-4 z-20 bg-brand-burgundy text-brand-cream text-[9px] font-extrabold w-6 h-6 rounded-full border border-brand-pink/35 flex items-center justify-center shadow-md">
                      #{index + 1}
                    </span>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-pink-light/10 relative">
                      <img src={prod.image_urls[0]} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
                    </div>
                    <div className="px-1.5 flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-brand-pink-dark font-extrabold block leading-none">{prod.brand}</span>
                        <h4 className="text-xs font-bold text-brand-slate line-clamp-1 leading-snug mt-0.5 group-hover:underline">{prod.title}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-brand-pink/10">
                        <span className="text-xs font-extrabold text-brand-burgundy">₹{prod.discount_price.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] font-extrabold text-brand-pink-dark bg-brand-pink-light/40 px-2 rounded-full leading-none border border-brand-pink/10">
                          {discountPercent}% Off
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ══════════════════════════════════════════════════════
            4.  LOOKBOOKS — 3D tilt + hover zoom
        ══════════════════════════════════════════════════════ */}
        <motion.section
          className="flex flex-col gap-4 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-pink-dark uppercase">CAMPAIGN LOOKBOOKS</span>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-brand-slate tracking-wide">
              Pinterest Curation Landers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lookbooks.map((book, i) => (
              <motion.div
                key={book.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/curations/${book.slug}`}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500 border border-brand-pink/15 flex flex-col aspect-[16/10]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(44,44,44,0.1), rgba(44,44,44,0.75)), url(${book.cover})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Zoom on hover via scale of pseudo-bg */}
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${book.cover})`, zIndex: -1 }}
                  />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-left z-10">
                    <span className="text-[8px] uppercase tracking-widest text-brand-pink font-bold block leading-none">Pinterest Lander Campaign</span>
                    <h3 className="text-lg font-display font-semibold text-brand-cream mt-1 leading-snug group-hover:underline">{book.title}</h3>
                    <p className="text-[11px] text-brand-cream/80 line-clamp-1 mt-0.5">{book.desc}</p>
                  </div>
                  <div className="absolute inset-0 border-2 border-brand-pink/0 group-hover:border-brand-pink/45 rounded-3xl transition-all duration-300 pointer-events-none" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            5.  FEED
        ══════════════════════════════════════════════════════ */}
        <section id="feed-start" className="flex flex-col gap-6 text-left">
          <div className="flex justify-between items-center py-2 border-b border-brand-pink/15">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-brand-burgundy" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate/60">
                Personalized Fashion Discoveries
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-brand-pink-dark bg-brand-pink-light/40 border border-brand-pink/20 rounded-full px-3 py-1">
              <Flame size={12} className="text-brand-burgundy" />
              <span>AI Sorting Active</span>
            </div>
          </div>

          <div className="masonry-grid">
            {personalizedFeed.map((product) => (
              <OutfitCard
                key={product.id}
                product={product}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
