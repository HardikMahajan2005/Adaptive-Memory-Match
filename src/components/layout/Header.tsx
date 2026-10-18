import React from 'react';
import { Brain, HelpCircle, BarChart3, Play } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  activeTab?: 'play' | 'how-to-play' | 'stats';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowToPlay,
  onOpenStats,
  activeTab = 'play',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-4 pt-2 pb-1 max-w-7xl mx-auto">
      <GlassPanel className="px-3.5 py-1.5 sm:py-2 flex items-center justify-between shadow-glass rounded-xl sm:rounded-2xl border-white/15">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-0.5 shadow-md shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0d1424] dark:bg-[#0d1424] light:bg-white">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 dark:text-cyan-400 light:text-blue-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white dark:text-white light:text-slate-900">
              Adaptive Memory Match
            </span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigation Pills */}
          <nav className="flex items-center gap-1 bg-white/[0.05] dark:bg-white/[0.05] light:bg-black/[0.04] p-1 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-300">
            <button
              onClick={() => {}}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all',
                activeTab === 'play'
                  ? 'bg-blue-600/80 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-300 hover:text-white'
              )}
              aria-label="Play game view"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span className="hidden xs:inline">Play</span>
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Open how to play instructions"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">How to Play</span>
            </button>

            <button
              onClick={onOpenStats}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Open statistics and session history"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stats</span>
            </button>
          </nav>
        </div>
      </GlassPanel>
    </header>
  );
};
