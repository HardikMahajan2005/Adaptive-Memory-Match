import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'blue' | 'purple' | 'cyan';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  glow = 'none',
  ...props
}) => {
  const glowClasses = {
    none: '',
    blue: 'shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
    purple: 'shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]',
    cyan: 'shadow-[0_0_40px_-10px_rgba(56,189,248,0.3)]',
  }[glow];

  return (
    <div
      className={cn(
        'relative rounded-2xl border transition-all duration-300',
        'bg-[#10182B]/75 dark:bg-[#10182B]/75 light:bg-white/80',
        'border-white/12 dark:border-white/12 light:border-slate-200/90',
        'backdrop-blur-xl',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/10 dark:before:border-white/10 light:before:border-white/60 before:content-[""]',
        glowClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
