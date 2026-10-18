import React from 'react';
import { Card } from '@/game/types';
import { CardSymbolDisplay } from './CardSymbols';
import { SYMBOL_CONFIGS } from '@/game/constants';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
  card: Card;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, disabled = false }) => {
  const row = Math.floor(card.position / 4) + 1;
  const col = (card.position % 4) + 1;
  const symbolConfig = SYMBOL_CONFIGS[card.symbol];

  const handleClick = () => {
    if (!disabled && !card.isMatched && !card.isFlipped) {
      onClick(card.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Screen-reader friendly accessible description (does NOT reveal hidden symbols)
  const accessibleLabel = card.isMatched
    ? `Row ${row}, Column ${col}: Matched ${symbolConfig.label}`
    : card.isFlipped
    ? `Row ${row}, Column ${col}: Revealed ${symbolConfig.label}`
    : `Row ${row}, Column ${col}: Hidden card`;

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || card.isMatched}
      aria-label={accessibleLabel}
      aria-pressed={card.isFlipped}
      className={cn(
        'group relative aspect-square w-full select-none rounded-2xl p-1 sm:p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B18]',
        'liquid-glass-card transition-transform duration-200 active:scale-[0.97]',
        disabled && 'cursor-not-allowed',
        card.isMatched && 'cursor-default'
      )}
    >
      <div className={cn('card-inner', card.isFlipped && 'flipped')}>
        {/* Face Down Surface */}
        <div
          className={cn(
            'card-front flex items-center justify-center rounded-2xl border transition-all duration-300',
            'bg-[#121c33]/80 dark:bg-[#121c33]/80 light:bg-white/85',
            'border-white/15 dark:border-white/15 light:border-slate-300/80',
            'backdrop-blur-md shadow-glass-sm',
            'group-hover:border-blue-400/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]',
            'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/15 before:to-transparent before:pointer-events-none'
          )}
        >
          {/* Centered concentric geometric diamond motif from reference */}
          <div className="relative flex items-center justify-center" aria-hidden="true">
            <div className="h-7 w-7 sm:h-9 sm:w-9 rotate-45 rounded-sm border border-white/20 dark:border-white/20 light:border-slate-400/40 transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-400/50" />
            <div className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-45 rounded-[2px] border border-white/30 dark:border-white/30 light:border-slate-400/60 bg-white/5 dark:bg-white/5 light:bg-slate-300/30" />
            <div className="absolute h-1.5 w-1.5 rotate-45 rounded-[1px] bg-cyan-400/60" />
          </div>
        </div>

        {/* Face Up Revealed / Matched Surface */}
        <div
          className={cn(
            'card-back flex items-center justify-center rounded-2xl border transition-all duration-300',
            'bg-gradient-to-br backdrop-blur-xl',
            symbolConfig.bgGradient,
            symbolConfig.glowClass,
            card.isMatched && 'ring-2 ring-emerald-400/60 ring-offset-1 ring-offset-[#070B18]/50',
            'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-white/25 before:to-transparent before:pointer-events-none'
          )}
        >
          <CardSymbolDisplay symbol={card.symbol} />
        </div>
      </div>
    </button>
  );
};
