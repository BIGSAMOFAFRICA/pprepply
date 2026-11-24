import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-bg-subtle text-ink-muted border-line',
    primary: 'bg-primary-soft text-primary border-transparent',
    success: 'bg-status-success-soft text-status-success border-transparent',
    warning: 'bg-status-warning-soft text-status-warning border-transparent',
    danger: 'bg-status-danger-soft text-status-danger border-transparent',
    neutral: 'bg-white text-ink border-line shadow-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
