import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'secondary', size = 'md', fullWidth = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none rounded-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    }[size];

    const variantClasses = {
      primary: cn(
        'text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500',
        'hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_24px_rgba(56,189,248,0.5)]',
        'border border-blue-400/40 shadow-lg shadow-blue-500/20'
      ),
      secondary: cn(
        'text-slate-200 dark:text-slate-200 light:text-slate-700',
        'bg-white/[0.07] dark:bg-white/[0.07] light:bg-black/[0.04]',
        'hover:bg-white/[0.14] dark:hover:bg-white/[0.14] light:hover:bg-black/[0.08]',
        'border border-white/15 dark:border-white/15 light:border-slate-300/70',
        'backdrop-blur-md shadow-sm'
      ),
      ghost: cn(
        'text-slate-300 dark:text-slate-300 light:text-slate-600',
        'hover:text-white dark:hover:text-white light:hover:text-slate-900',
        'hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5'
      ),
      danger: cn(
        'text-white bg-rose-600/80 hover:bg-rose-600',
        'border border-rose-500/40 shadow-md shadow-rose-900/30'
      ),
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseClasses, sizeClasses, variantClasses, fullWidth && 'w-full', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
