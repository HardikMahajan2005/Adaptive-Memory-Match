import React from 'react';
import { Zap } from 'lucide-react';
import { Difficulty } from '@/game/types';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';

interface AdaptiveDifficultyPanelProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty?: (difficulty: Difficulty) => void;
}

export const AdaptiveDifficultyPanel: React.FC<AdaptiveDifficultyPanelProps> = ({
  currentDifficulty,
  onSelectDifficulty,
}) => {
  const steps: { key: Difficulty; label: string; range: string; dotColor: string; activeClass: string }[] = [
    {
      key: 'easy',
      label: 'Easy',
      range: '2.5s preview',
      dotColor: 'bg-emerald-400',
      activeClass: 'border-emerald-400/80 shadow-[0_0_16px_rgba(52,211,153,0.5)] ring-2 ring-emerald-400/50 bg-emerald-950/40',
    },
    {
      key: 'medium',
      label: 'Medium',
      range: '1.2s preview',
      dotColor: 'bg-sky-400',
      activeClass: 'border-sky-400/80 shadow-[0_0_16px_rgba(56,189,248,0.5)] ring-2 ring-sky-400/50 bg-sky-950/40',
    },
    {
      key: 'hard',
      label: 'Hard',
      range: '0.65s delay',
      dotColor: 'bg-purple-400',
      activeClass: 'border-purple-400/80 shadow-[0_0_16px_rgba(168,85,247,0.6)] ring-2 ring-purple-400/50 bg-purple-950/40',
    },
  ];

  return (
    <GlassPanel className="p-3.5 sm:p-4 flex flex-col gap-2.5">
      {/* Header */}
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        Adaptive Difficulty
      </h2>

      {/* Description */}
      <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-snug">
        Next round adapts to your speed and moves. Click any level to switch manually.
      </p>

      {/* Threshold Stepper Slider */}
      <div className="relative pt-1.5 pb-0.5">
        {/* Connecting Line */}
        <div className="absolute top-[22px] left-8 right-8 h-0.5 bg-white/20 dark:bg-white/20 light:bg-slate-300" aria-hidden="true" />

        <div className="relative flex justify-between items-start" role="radiogroup" aria-label="Difficulty levels">
          {steps.map((step) => {
            const isCurrent = step.key === currentDifficulty;

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onSelectDifficulty?.(step.key)}
                className="group flex flex-col items-center gap-1.5 z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl p-1 hover:bg-white/[0.04] transition-all"
                aria-label={`Select ${step.label} difficulty (${step.range})`}
                aria-checked={isCurrent}
                role="radio"
                title={`Click to switch to ${step.label} (${step.range})`}
              >
                <div
                  className={cn(
                    'h-7 w-7 rounded-full border flex items-center justify-center transition-all duration-300',
                    'bg-[#0d1527] dark:bg-[#0d1527] light:bg-white group-hover:scale-110',
                    isCurrent
                      ? step.activeClass
                      : 'border-white/20 dark:border-white/20 light:border-slate-300 group-hover:border-cyan-400/50'
                  )}
                >
                  <span className={cn('h-2.5 w-2.5 rounded-full', step.dotColor)} />
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      'block text-xs font-semibold group-hover:text-cyan-300 transition-colors',
                      isCurrent
                        ? step.key === 'hard'
                          ? 'text-white dark:text-white light:text-slate-900 underline decoration-purple-400 decoration-2 underline-offset-4'
                          : step.key === 'medium'
                          ? 'text-white dark:text-white light:text-slate-900 underline decoration-sky-400 decoration-2 underline-offset-4'
                          : 'text-white dark:text-white light:text-slate-900 underline decoration-emerald-400 decoration-2 underline-offset-4'
                        : 'text-slate-400 dark:text-slate-400 light:text-slate-500'
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">
                    {step.range}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </GlassPanel>
  );
};
