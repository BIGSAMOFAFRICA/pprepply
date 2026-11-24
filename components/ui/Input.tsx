'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-ink-muted pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'w-full h-11 px-3.5 rounded-xl bg-white border border-line text-ink text-sm placeholder:text-ink-faint transition-all duration-150',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10',
              'disabled:bg-bg-subtle disabled:opacity-60',
              icon && 'pl-10',
              error && 'border-status-danger focus:border-status-danger focus:ring-status-danger/10',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-status-danger mt-1.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
