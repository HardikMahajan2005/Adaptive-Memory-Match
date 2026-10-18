import React, { useState } from 'react';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { Header } from '@/components/layout/Header';
import { GameBoard } from '@/components/game/GameBoard';
import { GameStatusPanel } from '@/components/game/GameStatusPanel';
import { NextRoundPanel } from '@/components/game/NextRoundPanel';
import { GameControls } from '@/components/game/GameControls';
import { RecentResultsPanel } from '@/components/dashboard/RecentResultsPanel';
import { AdaptiveDifficultyPanel } from '@/components/dashboard/AdaptiveDifficultyPanel';
import { ProTipPanel } from '@/components/dashboard/ProTipPanel';
import { WinModal } from '@/components/modals/WinModal';
import { HowToPlayModal } from '@/components/modals/HowToPlayModal';
import { StatsModal } from '@/components/modals/StatsModal';
import { LiveAnnouncer } from '@/components/ui/LiveAnnouncer';
import { useGame } from '@/hooks/useGame';

function GameDashboard(): React.JSX.Element {
  const {
    state,
    stats,
    history,
    previewRemainingSec,
    isWinModalOpen,
    setIsWinModalOpen,
    selectCard,
    restartGame,
    startNewRound,
    changeDifficulty,
    clearHistoryData,
  } = useGame();

  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between selection:bg-blue-500 selection:text-white pb-3 lg:pb-1">
      <AmbientBackground />

      <LiveAnnouncer
        phase={state.phase}
        pairsFound={state.pairsFound}
        moves={state.moves}
        difficulty={state.difficulty}
      />

      {/* Top Header */}
      <Header
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Main Responsive 3-Column Dashboard */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-2 flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4 items-center">
          {/* Left Column (Game Status, Next Round, Controls) */}
          <aside className="lg:col-span-3 flex flex-col gap-2.5 xl:gap-3 order-2 lg:order-1" aria-label="Game Status and Controls">
            <GameStatusPanel
              moves={state.moves}
              pairsFound={state.pairsFound}
              elapsedMs={state.elapsedMs}
              difficulty={state.difficulty}
              onSelectDifficulty={changeDifficulty}
            />

            <NextRoundPanel
              currentDifficulty={state.difficulty}
              nextDifficulty={state.nextDifficulty}
              adaptationReason={state.adaptationReason}
              isCompleted={state.isCompleted}
            />

            <GameControls
              onNewRound={startNewRound}
              onRestart={() => restartGame()}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            />
          </aside>

          {/* Center Column (4x4 Game Board) - Prominent Focal Point */}
          <section className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 my-1 lg:my-0">
            <GameBoard
              deck={state.deck}
              phase={state.phase}
              difficulty={state.difficulty}
              onCardClick={selectCard}
              previewRemainingSec={previewRemainingSec}
            />
          </section>

          {/* Right Column (Recent Results, Adaptive Difficulty, Pro Tip) */}
          <aside className="lg:col-span-3 flex flex-col gap-3 xl:gap-3.5 order-3" aria-label="Game Analytics and Adaptation Info">
            <RecentResultsPanel
              recentResults={history}
              onViewAll={() => setIsStatsOpen(true)}
            />

            <AdaptiveDifficultyPanel
              currentDifficulty={state.difficulty}
              onSelectDifficulty={changeDifficulty}
            />

            <ProTipPanel />
          </aside>
        </div>
      </main>

      {/* Modals */}
      <WinModal
        isOpen={isWinModalOpen}
        onClose={() => setIsWinModalOpen(false)}
        moves={state.moves}
        elapsedMs={state.elapsedMs}
        currentDifficulty={state.difficulty}
        nextDifficulty={state.nextDifficulty}
        adaptationReason={state.adaptationReason}
        onPlayNextRound={startNewRound}
        onRestart={() => restartGame()}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        history={history}
        onClearHistory={clearHistoryData}
      />
    </div>
  );
}

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <GameDashboard />
    </ThemeProvider>
  );
}
