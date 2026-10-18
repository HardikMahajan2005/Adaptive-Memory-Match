import React from 'react';
import { ArrowLeftRight, Trophy, Clock, BarChart2 } from 'lucide-react';
import { Difficulty } from '@/game/types';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { formatTime, cn } from '@/lib/utils';

interface GameStatusPanelProps {
  moves: number;
  pairsFound: number;
  elapsedMs: number;
  difficulty: Difficulty;
  onSelectDifficulty?: (difficulty: Difficulty) => void;
}

export const GameStatusPanel: React.FC<GameStatusPanelProps> = ({
  moves,
  pairsFound,
  elapsedMs,
  difficulty,
  onSelectDifficulty,
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <GlassPanel className="p-3 sm:p-3.5 flex flex-col gap-2">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
        Game Status
      </h2>

      <div className="flex flex-col gap-1.5">
        {/* Moves Counter (1 move = 1 pair attempt) */}
        <div className="flex items-center justify-between rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] px-2.5 py-1.5 border border-white/5">
          <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium">Moves</span>
          </div>
          <span
            data-testid="moves-counter"
            className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900"
            aria-live="polite"
          >
            {moves}
          </span>
        </div>

        {/* Pairs Found */}
        <div className="flex items-center justify-between rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] px-2.5 py-1.5 border border-white/5">
          <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <Trophy className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium">Pairs Found</span>
          </div>
          <span
            data-testid="pairs-counter"
            className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900"
            aria-live="polite"
          >
            {pairsFound} / 8
          </span>
        </div>

        {/* Elapsed Active Time */}
        <div className="flex items-center justify-between rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] px-2.5 py-1.5 border border-white/5">
          <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium">Time</span>
          </div>
          <span
            data-testid="time-counter"
            className="text-sm sm:text-base font-bold font-mono text-white dark:text-white light:text-slate-900"
            aria-live="off"
          >
            {formatTime(elapsedMs)}
          </span>
        </div>

        {/* Current Difficulty & Interactive Segmented Level Switcher */}
        <div className="flex flex-col gap-1.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] p-2 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <BarChart2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium">Difficulty</span>
            </div>
            <Badge difficulty={difficulty} size="sm" />
          </div>

          {/* 3-way Interactive Segmented Switcher */}
          <div
            className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5"
            role="radiogroup"
            aria-label="Select difficulty level"
          >
            {difficulties.map((diff) => {
              const isSelected = difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onSelectDifficulty?.(diff)}
                  className={cn(
                    'py-1 px-1.5 text-[11px] font-semibold rounded-lg transition-all capitalize text-center select-none',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                    isSelected
                      ? diff === 'easy'
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-sm'
                        : diff === 'medium'
                        ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 shadow-sm'
                        : 'bg-purple-500/25 text-purple-300 border border-purple-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5'
                  )}
                  aria-checked={isSelected}
                  role="radio"
                  title={`Switch difficulty to ${diff.toUpperCase()}`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};
