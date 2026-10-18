import React from 'react';
import { Info, TrendingUp } from 'lucide-react';
import { Difficulty } from '@/game/types';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';

interface NextRoundPanelProps {
  currentDifficulty: Difficulty;
  nextDifficulty: Difficulty;
  adaptationReason?: string;
  isCompleted?: boolean;
}

export const NextRoundPanel: React.FC<NextRoundPanelProps> = ({
  currentDifficulty,
  nextDifficulty,
  adaptationReason,
  isCompleted = false,
}) => {
  const displayText = adaptationReason || (
    isCompleted
      ? `Performance assessed! Next round set to ${nextDifficulty.toUpperCase()}.`
      : currentDifficulty === 'hard'
      ? 'Hard mode active (0.65s delay, no preview). Finish in ≤ 12 moves or ≤ 45s to maintain mastery!'
      : currentDifficulty === 'medium'
      ? 'Medium active (1.2s preview). Finish in ≤ 12 moves or ≤ 45s to unlock Hard mode!'
      : 'Play accurately in 8–12 moves or under 60s to unlock higher difficulty.'
  );

  return (
    <GlassPanel className="p-3 sm:p-3.5 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          Next Round
        </h2>
        {nextDifficulty && <Badge difficulty={nextDifficulty} size="sm" />}
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-blue-500/[0.08] p-2 sm:p-2.5 border border-blue-400/20">
        <div className="flex-shrink-0 mt-0.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-cyan-300">
            <Info className="h-3 w-3" />
          </div>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-200 dark:text-slate-200 light:text-slate-700 leading-snug">
          <strong className="text-white dark:text-white light:text-slate-900 capitalize">
            {nextDifficulty !== currentDifficulty ? `Next: ${nextDifficulty}` : 'Maintaining level'}:
          </strong>{' '}
          {displayText}
        </p>
      </div>
    </GlassPanel>
  );
};
