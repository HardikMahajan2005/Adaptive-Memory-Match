import React from 'react';
import { Card, GamePhase, Difficulty } from '@/game/types';
import { MemoryCard } from './MemoryCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import { Eye, Zap } from 'lucide-react';

interface GameBoardProps {
  deck: Card[];
  phase: GamePhase;
  onCardClick: (cardId: string) => void;
  previewRemainingSec?: number;
  difficulty?: Difficulty;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  deck,
  phase,
  onCardClick,
  previewRemainingSec,
  difficulty = 'easy',
}) => {
  // Interaction is locked during mismatch resolution and preview phase
  const isInteractionLocked = phase === 'resolvingMismatch' || phase === 'previewing' || phase === 'completed';

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-xl mx-auto" aria-label="Game Board">
      {/* Title & Subtitle from visual reference */}
      <div className="text-center mb-2 sm:mb-2.5">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 dark:from-white dark:to-slate-300 light:from-slate-900 light:to-slate-700">
          Adaptive Memory Match
        </h1>
        <p className="mt-0.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 font-medium">
          Find all matching pairs. The game adapts to your performance.
        </p>

        {/* Opening preview status banner */}
        {phase === 'previewing' && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold animate-pulse">
            <Eye className="w-3.5 h-3.5" />
            <span>
              Memorize cards! Preview: {previewRemainingSec ? previewRemainingSec.toFixed(1) : '2.0'}s
            </span>
          </div>
        )}

        {/* Hard Mode active status banner giving immediate feedback */}
        {phase === 'idle' && difficulty === 'hard' && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-semibold animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
            <span>
              Hard Mode Active: 0.65s flip delay, cards face-down. Click to begin!
            </span>
          </div>
        )}
      </div>

      {/* 4x4 Grid Enclosure - Enlarged to fill center space */}
      <GlassPanel
        className={cn(
          'w-full max-w-[370px] sm:max-w-[410px] md:max-w-[440px] lg:max-w-[460px] xl:max-w-[485px] p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border-white/20 shadow-glass',
          'transition-all duration-300'
        )}
      >
        <div
          role="grid"
          aria-label="4 by 4 memory cards grid"
          aria-rowcount={4}
          aria-colcount={4}
          className="grid grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3"
        >
          {deck.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={onCardClick}
              disabled={isInteractionLocked}
            />
          ))}
        </div>
      </GlassPanel>
    </section>
  );
};
