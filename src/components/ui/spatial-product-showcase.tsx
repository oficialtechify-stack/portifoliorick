'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import {
  Battery,
  Sliders,
  ChevronRight,
  Zap,
  Bluetooth,
  Wifi,
  Music,
  LucideIcon,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { ShaderBackground } from "./liquid-metal-vortex";

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'left' | 'right';

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string; // Display name for the switcher
  title: string;
  description: string;
  image: string;
  colors: {
    gradient: string; // Tailwind gradient classes
    glow: string;     // Tailwind color class for accents
    ring: string;     // Tailwind border color for rings
    hue: number;      // Shader hue
  };
  stats: {
    connectionStatus: string;
    batteryLevel: number;
  };
  features: FeatureMetric[];
  projectUrl?: string;
}

// Default Data (Easy to Modify Here)
const PRODUCT_DATA: Record<ProductId, ProductData> = {
  left: {
    id: 'left',
    label: 'Audio',
    title: 'Spatial Anchor',
    description: 'The primary node for binaural synchronization. Handles low-latency transmission and anchors the spatial audio soundstage.',
    // Updated with high-quality isolated earbud image (AirPods Pro style)
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop',
    colors: {
      gradient: 'from-blue-900/40 to-black',
      glow: 'bg-blue-500',
      ring: 'border-blue-500/50',
      hue: 220,
    },
    stats: { connectionStatus: 'Live', batteryLevel: 98 },
    features: [
      { label: 'Latency', value: 12, icon: Zap },
      { label: 'Sync Rate', value: 98, icon: Wifi },
    ],
    projectUrl: 'https://wa.me/558199130885',
  },
  right: {
    id: 'right',
    label: 'Voice',
    title: 'Vocal Clarity',
    description: 'Optimized for high-frequency detail and voice pickup. Contains the beamforming microphone array for crystal clear calls.',
    // Updated with high-quality isolated right earbud image (AirPods Pro style)
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1000&auto=format&fit=crop',
    colors: {
      gradient: 'from-red-900/40 to-black',
      glow: 'bg-primary',
      ring: 'border-primary/50',
      hue: 0,
    },
    stats: { connectionStatus: 'Active', batteryLevel: 100 },
    features: [
      { label: 'Bitrate', value: 94, icon: Bluetooth },
      { label: 'Clarifier', value: 88, icon: Music },
    ],
    projectUrl: 'https://wa.me/558199130885',
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
    },
    exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  },
  image: (isLeft: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.5,
      filter: 'blur(15px)',
      rotate: isLeft ? -30 : 30,
      x: isLeft ? -80 : 80,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      rotate: 0,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: 'blur(20px)',
      transition: { duration: 0.25 },
    },
  }),
};

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const ProductVisual = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => (
  <motion.div layout="position" className="relative group shrink-0">
    {/* Animated Rings */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className={`absolute inset-[-20%] rounded-full border border-dashed border-white/10 ${data.colors.ring}`}
    />
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-40`}
    />

    {/* Image Container */}
    <div className="relative h-64 w-64 md:h-[400px] md:w-[400px] rounded-full border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={data.id}
            src={data.image}
            alt={`${data.title}`}
            variants={ANIMATIONS.image(isLeft)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4"
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>

    {/* Status Label */}
    <motion.div
      layout="position"
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 bg-black/80 px-4 py-2 rounded-full border border-white/5 backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full ${data.colors.glow} animate-pulse`} />
        {data.stats.connectionStatus}
      </div>
    </motion.div>
  </motion.div>
);

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  const alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';
  const flexDirClass = isLeft ? 'flex-row' : 'flex-row-reverse';
  const barColorClass = isLeft ? 'left-0 bg-primary' : 'right-0 bg-primary';

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass}`}
    >
      <motion.p variants={ANIMATIONS.item} className="text-[10px] font-black italic uppercase tracking-[0.2em] text-primary mb-2">
        {data.label} Module
      </motion.p>
      <motion.h1 variants={ANIMATIONS.item} className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-white">
        {data.title}
      </motion.h1>
      <motion.p variants={ANIMATIONS.item} className={`text-zinc-400 text-sm md:text-base font-medium mb-8 max-w-sm leading-relaxed ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
        {data.description}
      </motion.p>

      {/* Feature Grid */}
      <motion.div variants={ANIMATIONS.item} className="w-full space-y-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group">
            <div className={`flex items-center justify-between mb-3 text-sm ${flexDirClass}`}>
              <div className={`flex items-center gap-2 font-black italic uppercase tracking-widest ${feature.value > 50 ? 'text-zinc-200' : 'text-zinc-400'}`}>
                <feature.icon size={14} className="text-primary" /> <span className="text-[10px]">{feature.label}</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">{feature.value}%</span>
            </div>
            <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.value}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 ${barColorClass} opacity-80`}
              />
            </div>
          </div>
        ))}

        <div className={`pt-4 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
          <button 
            type="button" 
            onClick={() => data.projectUrl && window.open(data.projectUrl, "_blank")}
            className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-widest text-zinc-300 hover:text-primary transition-colors group"
          >
            <ExternalLink size={12} /> Ver Projeto
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Battery */}
      <motion.div variants={ANIMATIONS.item} className={`mt-6 flex items-center gap-3 text-zinc-500 ${flexDirClass}`}>
        <Battery size={14} className="text-primary" />
        <span className="text-[10px] font-black italic uppercase tracking-widest">Nível de Otimização: {data.stats.batteryLevel}%</span>
      </motion.div>
    </motion.div>
  );
};

const Switcher = ({ 
  activeId, 
  onToggle 
}: { 
  activeId: ProductId; 
  onToggle: (id: ProductId) => void 
}) => {
  const options = Object.values(PRODUCT_DATA).map(p => ({ id: p.id, label: p.label }));

  return (
    <div className="flex justify-center mt-12">
      <motion.div layout className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-2.5 rounded-full text-[10px] font-black italic uppercase tracking-widest transition-all duration-300 ${
              activeId === opt.id ? 'text-black' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {activeId === opt.id && (
              <motion.div
                layoutId="switcher-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {opt.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function EarbudShowcase() {
  const [activeSide, setActiveSide] = useState<ProductId>('left');
  
  const currentData = PRODUCT_DATA[activeSide];
  const isLeft = activeSide === 'left';

  return (
    <div className="relative w-full py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden min-h-[800px]">
      
      {/* Visual background hint with ShaderBackground */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <ShaderBackground 
              hue={currentData.colors.hue} 
              complexity={0.8} 
              speed={0.2} 
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 lg:gap-32 w-full ${
            isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Visuals */}
          <ProductVisual data={currentData} isLeft={isLeft} />

          {/* Content */}
          <motion.div layout="position" className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <ProductDetails 
                key={activeSide}
                data={currentData} 
                isLeft={isLeft} 
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <Switcher activeId={activeSide} onToggle={setActiveSide} />
      </div>
    </div>
  );
}
