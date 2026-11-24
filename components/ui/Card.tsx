import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'flat';
  radius?: 'lg' | 'xl' | '2xl' | '3xl';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', radius = '2xl', ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-line shadow-soft',
      surface: 'bg-bg-subtle border border-line-soft',
      flat: 'bg-white border border-line-soft',
    };

    const radii = {
      lg: 'rounded-[16px]',
      xl: 'rounded-[20px]',
      '2xl': 'rounded-[24px]',
      '3xl': 'rounded-[28px]',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], radii[radius], className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
