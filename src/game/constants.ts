import React from 'react';
import {
  Heart,
  Star,
  Leaf,
  Moon,
  Sun,
  Gem,
  Zap,
  Navigation,
} from 'lucide-react';
import { CardSymbol } from '@/game/types';

export interface SymbolConfig {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  label: string;
  colorClass: string;
  glowClass: string;
  bgGradient: string;
}

export const SYMBOL_CONFIGS: Record<CardSymbol, SymbolConfig> = {
  heart: {
    icon: Heart,
    label: 'Heart',
    colorClass: 'text-rose-400 fill-rose-400',
    glowClass: 'shadow-card-glow-coral',
    bgGradient: 'from-rose-500/30 to-pink-600/20 border-rose-400/40',
  },
  star: {
    icon: Star,
    label: 'Star',
    colorClass: 'text-amber-300 fill-amber-300',
    glowClass: 'shadow-card-glow-amber',
    bgGradient: 'from-amber-500/30 to-yellow-600/20 border-amber-400/40',
  },
  leaf: {
    icon: Leaf,
    label: 'Leaf',
    colorClass: 'text-emerald-400 fill-emerald-400',
    glowClass: 'shadow-card-glow-mint',
    bgGradient: 'from-emerald-500/30 to-teal-600/20 border-emerald-400/40',
  },
  moon: {
    icon: Moon,
    label: 'Moon',
    colorClass: 'text-indigo-300 fill-indigo-300',
    glowClass: 'shadow-card-glow-violet',
    bgGradient: 'from-indigo-500/30 to-purple-600/20 border-indigo-400/40',
  },
  sun: {
    icon: Sun,
    label: 'Sun',
    colorClass: 'text-yellow-300 fill-yellow-300',
    glowClass: 'shadow-[0_0_25px_-4px_rgba(253,224,71,0.6)]',
    bgGradient: 'from-yellow-500/30 to-amber-600/20 border-yellow-400/40',
  },
  diamond: {
    icon: Gem,
    label: 'Diamond',
    colorClass: 'text-cyan-300 fill-cyan-300',
    glowClass: 'shadow-card-glow-blue',
    bgGradient: 'from-cyan-500/30 to-blue-600/20 border-cyan-400/40',
  },
  lightning: {
    icon: Zap,
    label: 'Lightning',
    colorClass: 'text-amber-400 fill-amber-400',
    glowClass: 'shadow-[0_0_25px_-4px_rgba(251,191,36,0.6)]',
    bgGradient: 'from-amber-600/30 to-orange-600/20 border-amber-500/40',
  },
  'paper-plane': {
    icon: Navigation,
    label: 'Paper Plane',
    colorClass: 'text-sky-300 fill-sky-300',
    glowClass: 'shadow-card-glow-blue',
    bgGradient: 'from-sky-500/30 to-blue-600/20 border-sky-400/40',
  },
};
