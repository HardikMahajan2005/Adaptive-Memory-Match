import React from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';
import { SessionResult } from '@/game/types';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { formatTime, formatDate } from '@/lib/utils';

interface RecentResultsPanelProps {
  recentResults: SessionResult[];
  onViewAll: () => void;
}

export const RecentResultsPanel: React.FC<RecentResultsPanelProps> = ({
  recentResults,
  onViewAll,
}) => {
  // Show up to 4 most recent results to balance right sidebar height
  const displayResults = recentResults.slice(0, 4);

  return (
    <GlassPanel className="p-3.5 sm:p-4 flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          Recent Results
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 dark:text-cyan-400 light:text-blue-600 flex items-center gap-1 transition-colors focus:outline-none focus-visible:underline"
          aria-label="View all game history statistics"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {displayResults.length === 0 ? (
          <div className="py-4 px-3 flex flex-col items-center justify-center text-center rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-slate-300 font-medium">No games recorded yet</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Finish a match to view your pace and accuracy stats!</span>
          </div>
        ) : (
          displayResults.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] px-3 py-2 border border-white/5 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700"
            >
              <div className="flex items-center gap-2">
                <Badge difficulty={result.difficulty} size="sm" />
                <span className="font-medium text-xs text-slate-300 dark:text-slate-300 light:text-slate-600">
                  {result.matchedPairs}/8 pairs
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-xs text-white dark:text-white light:text-slate-900">
                  {formatTime(result.elapsedMs)}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">
                  {formatDate(result.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
};
