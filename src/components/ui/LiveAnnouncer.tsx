import React, { useEffect, useState } from 'react';
import { GamePhase, Difficulty } from '@/game/types';

interface LiveAnnouncerProps {
  phase: GamePhase;
  pairsFound: number;
  moves: number;
  difficulty: Difficulty;
}

export const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({
  phase,
  pairsFound,
  moves,
  difficulty,
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (phase === 'previewing') {
      setAnnouncement(`Game starting on ${difficulty} difficulty. Previewing cards.`);
    } else if (phase === 'resolvingMismatch') {
      setAnnouncement(`Cards do not match. Move ${moves}.`);
    } else if (pairsFound > 0 && phase === 'playing') {
      setAnnouncement(`Match found! ${pairsFound} of 8 pairs matched. Total moves: ${moves}.`);
    } else if (phase === 'completed') {
      setAnnouncement(`Congratulations! All 8 pairs matched in ${moves} moves. Round completed.`);
    }
  }, [phase, pairsFound, moves, difficulty]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
