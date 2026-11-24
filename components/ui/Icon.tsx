import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: 16 | 20 | 24;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  decorative?: boolean;
}

export function Icon({
  icon: IconComponent,
  size = 20,
  strokeWidth = 2,
  className,
  'aria-label': ariaLabel,
  decorative = true,
  ...props
}: IconProps) {
  if (!IconComponent) return null;

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={cn('flex-shrink-0 stroke-current', className)}
      aria-hidden={decorative && !ariaLabel ? 'true' : undefined}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      {...props}
    />
  );
}

export interface IconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  tintBg?: string;
}

export function IconTile({
  icon: IconComponent,
  size = 'md',
  color = '#5B5BD6',
  tintBg,
  className,
  ...props
}: IconTileProps) {
  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const iconSizes: Record<string, 16 | 20 | 24> = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const bgStyle = tintBg ? { backgroundColor: tintBg } : { backgroundColor: `${color}15` };

  return (
    <div
      className={cn('flex items-center justify-center flex-shrink-0 transition-transform', sizes[size], className)}
      style={{ ...bgStyle, color }}
      aria-hidden="true"
      {...props}
    >
      <Icon icon={IconComponent} size={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}
