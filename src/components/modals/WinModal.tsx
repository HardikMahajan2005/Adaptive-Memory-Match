import React from 'react';
import { Trophy, Clock, ArrowLeftRight, Target, Sparkles, Play, RotateCcw } from 'lucide-react';
import { Difficulty } from '@/game/types';
import { Modal } from '@/components/ui/Modal';
import { GlassButton } from '@/components/ui/GlassButton';
import { Badge } from '@/components/ui/Badge';
import { formatTime } from '@/lib/utils';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  elapsedMs: number;
  currentDifficulty: Difficulty;
  nextDifficulty: Difficulty;
  adaptationReason: string;
  onPlayNextRound: () => void;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  onClose,
  moves,
  elapsedMs,
  currentDifficulty,
  nextDifficulty,
  adaptationReason,
  onPlayNextRound,
  onRestart,
}) => {
  const accuracy = Math.round((8 / Math.max(8, moves)) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Round Complete!" maxWidth="md">
      <div className="flex flex-col items-center text-center gap-4">
        {/* Glowing Trophy Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 animate-bounce">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0d1424]">
            <Trophy className="h-8 w-8 text-amber-400" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Congratulations!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 mt-0.5">
            You successfully cleared all 8 matching pairs!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full my-2">
          {/* Moves */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.05] dark:bg-white/[0.05] light:bg-black/[0.04] border border-white/10">
            <ArrowLeftRight className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">Moves</span>
            <span className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900 font-mono">
              {moves}
            </span>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.05] dark:bg-white/[0.05] light:bg-black/[0.04] border border-white/10">
            <Clock className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">Time</span>
            <span className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900 font-mono">
              {formatTime(elapsedMs)}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.05] dark:bg-white/[0.05] light:bg-black/[0.04] border border-white/10">
            <Target className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">Efficiency</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Adaptive Result Banner */}
        <div className="w-full rounded-xl bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-cyan-600/15 p-3.5 border border-blue-400/25 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Adaptive Difficulty Update
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Current:</span>
              <Badge difficulty={currentDifficulty} size="sm" />
              <span className="text-slate-400 text-xs">→</span>
              <Badge difficulty={nextDifficulty} size="sm" />
            </div>
          </div>
          <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed">
            {adaptationReason}
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
          <GlassButton
            variant="primary"
            size="md"
            fullWidth
            onClick={onPlayNextRound}
            aria-label="Play next round with adapted difficulty"
          >
            <Play className="w-4 h-4 fill-current mr-1" />
            Play Next Round ({nextDifficulty.toUpperCase()})
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="md"
            fullWidth
            onClick={onRestart}
            aria-label="Replay current difficulty"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Replay Current
          </GlassButton>
        </div>
      </div>
    </Modal>
  );
};
