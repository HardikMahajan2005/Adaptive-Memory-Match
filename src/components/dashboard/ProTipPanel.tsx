import React from 'react';
import { Lightbulb, Target } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

export const ProTipPanel: React.FC = () => {
  return (
    <GlassPanel className="p-3.5 sm:p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center gap-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
        Pro Tip
      </h2>

      <div className="flex flex-col gap-1.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600">
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/[0.08] p-2 border border-amber-400/20">
          <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md bg-amber-400/20 text-amber-300">
            <Target className="h-2.5 w-2.5" />
          </div>
          <p className="text-[11px] leading-snug text-slate-200 dark:text-slate-200 light:text-slate-700">
            <strong className="text-white dark:text-white light:text-slate-900">Spatial Anchoring:</strong> Mentally map corner landmarks to reduce wasted moves by ~40%.
          </p>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 leading-snug pl-1">
          💡 Finish in ≤ 12 moves or under 45s to level up to the next difficulty tier!
        </p>
      </div>
    </GlassPanel>
  );
};
