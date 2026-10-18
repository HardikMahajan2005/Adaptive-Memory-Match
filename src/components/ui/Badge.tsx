import React from 'react';
import { cn } from '@/lib/utils';
import { Difficulty } from '@/game/types';

interface BadgeProps {
  difficulty: Difficulty;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ difficulty, className, size = 'md' }) => {
  const styles = {
    easy: {
      bg: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      label: 'Easy',
    },
    medium: {
      bg: 'bg-sky-500/15 border-sky-400/30 text-sky-400',
      dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]',
      label: 'Medium',
    },
    hard: {
      bg: 'bg-purple-500/15 border-purple-400/30 text-purple-400',
      dot: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
      label: 'Hard',
    },
  }[difficulty];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md',
        styles.bg,
        sizeClasses,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} aria-hidden="true" />
      {styles.label}
    </span>
  );
};
