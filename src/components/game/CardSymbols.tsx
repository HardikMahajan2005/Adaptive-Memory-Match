import React from 'react';
import { CardSymbol } from '@/game/types';
import { SYMBOL_CONFIGS } from '@/game/constants';
import { cn } from '@/lib/utils';

interface CardSymbolDisplayProps {
  symbol: CardSymbol;
  className?: string;
  iconClassName?: string;
}

export const CardSymbolDisplay: React.FC<CardSymbolDisplayProps> = ({
  symbol,
  className,
  iconClassName,
}) => {
  const config = SYMBOL_CONFIGS[symbol];
  const IconComponent = config.icon;

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <IconComponent className={cn('w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11', config.colorClass, iconClassName)} aria-hidden="true" />
    </div>
  );
};
