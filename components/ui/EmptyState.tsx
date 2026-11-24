import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12 px-6 flex flex-col items-center justify-center', className)}>
      <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button variant="primary" size="md">
              {actionLabel}
            </Button>
          </a>
        ) : (
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
