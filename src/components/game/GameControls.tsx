import React from 'react';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';

interface GameControlsProps {
  onNewRound: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewRound,
  onRestart,
  onOpenHowToPlay,
}) => {
  return (
    <GlassPanel className="p-3 sm:p-3.5 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
        Game Controls
      </h2>

      <div className="flex flex-col gap-1.5">
        {/* New Round - Electric blue primary button */}
        <GlassButton
          variant="primary"
          size="sm"
          fullWidth
          onClick={onNewRound}
          className="shadow-[0_0_20px_rgba(59,130,246,0.35)] py-2"
          aria-label="Start new round"
        >
          <Play className="h-3.5 w-3.5 fill-current mr-1" />
          <span>New Round</span>
        </GlassButton>

        {/* Restart current game */}
        <GlassButton
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onRestart}
          className="py-1.5"
          aria-label="Restart current game"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          <span>Restart</span>
        </GlassButton>

        {/* How to Play modal opener */}
        <GlassButton
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onOpenHowToPlay}
          className="py-1.5"
          aria-label="Open how to play instructions"
        >
          <HelpCircle className="h-3.5 w-3.5 mr-1" />
          <span>How to Play</span>
        </GlassButton>
      </div>
    </GlassPanel>
  );
};
