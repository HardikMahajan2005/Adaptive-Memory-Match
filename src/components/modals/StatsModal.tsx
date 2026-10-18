import React, { useState } from 'react';
import { Trophy, Clock, ArrowLeftRight, Trash2, ShieldAlert } from 'lucide-react';
import { HistoryStatistics, SessionResult } from '@/game/types';
import { Modal } from '@/components/ui/Modal';
import { GlassButton } from '@/components/ui/GlassButton';
import { Badge } from '@/components/ui/Badge';
import { formatTime, formatDate } from '@/lib/utils';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: HistoryStatistics;
  history: SessionResult[];
  onClearHistory: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  onClearHistory,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Analytics & Records" maxWidth="xl">
      <div className="flex flex-col gap-5">
        {/* High-level stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Total Games */}
          <div className="flex flex-col p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[11px] text-slate-400">Total Games</span>
            <span className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 font-mono mt-0.5">
              {stats.totalGames}
            </span>
          </div>

          {/* Best Moves */}
          <div className="flex flex-col p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best Moves
            </span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono mt-0.5">
              {stats.bestMoves !== null ? stats.bestMoves : '—'}
            </span>
          </div>

          {/* Best Time */}
          <div className="flex flex-col p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Best Time
            </span>
            <span className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono mt-0.5">
              {stats.bestTimeMs !== null ? formatTime(stats.bestTimeMs) : '—'}
            </span>
          </div>

          {/* Average Moves */}
          <div className="flex flex-col p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ArrowLeftRight className="w-3 h-3 text-blue-400" /> Avg Moves
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-400 font-mono mt-0.5">
              {stats.totalGames > 0 ? stats.averageMoves : '—'}
            </span>
          </div>
        </div>

        {/* Difficulty Distribution Breakdown */}
        <div className="rounded-xl bg-white/[0.03] p-3.5 border border-white/10 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Completed Games by Difficulty
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-xs">
              <span className="text-emerald-400 font-medium">Easy</span>
              <span className="font-mono font-bold text-white dark:text-white light:text-slate-900">
                {stats.difficultyDistribution.easy}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-xs">
              <span className="text-sky-400 font-medium">Medium</span>
              <span className="font-mono font-bold text-white dark:text-white light:text-slate-900">
                {stats.difficultyDistribution.medium}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-400/20 text-xs">
              <span className="text-purple-400 font-medium">Hard</span>
              <span className="font-mono font-bold text-white dark:text-white light:text-slate-900">
                {stats.difficultyDistribution.hard}
              </span>
            </div>
          </div>
        </div>

        {/* Session History Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Session History ({history.length})
            </span>
            {history.length > 0 && !showClearConfirm && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                aria-label="Clear session history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {/* Confirmation Prompt */}
          {showClearConfirm && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Are you sure you want to delete all saved session history?</span>
              </div>
              <div className="flex items-center gap-2">
                <GlassButton variant="danger" size="sm" onClick={handleConfirmClear}>
                  Confirm Delete
                </GlassButton>
                <GlassButton variant="secondary" size="sm" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </GlassButton>
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-black/20">
            {history.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No session history recorded yet. Complete a round to see detailed logs!
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#0c1322] border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Date</th>
                    <th className="py-2.5 px-3 font-semibold">Difficulty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Moves</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Time</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Efficiency</th>
                    <th className="py-2.5 px-3 font-semibold">Adaptation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {history.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                        {formatDate(s.timestamp)}
                      </td>
                      <td className="py-2 px-3">
                        <Badge difficulty={s.difficulty} size="sm" />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {s.moves}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {formatTime(s.elapsedMs)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-400">
                        {s.accuracyPercentage}%
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-300 max-w-xs truncate" title={s.adaptationReason}>
                        {s.adaptationReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="pt-2">
          <GlassButton variant="secondary" fullWidth onClick={onClose}>
            Close
          </GlassButton>
        </div>
      </div>
    </Modal>
  );
};
