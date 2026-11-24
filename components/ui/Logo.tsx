import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
  href?: string | null;
  alt?: string;
}

const DIMENSIONS = {
  full: {
    sm: { width: 104, height: 32 },
    md: { width: 128, height: 40 },
    lg: { width: 160, height: 50 },
    xl: { width: 200, height: 62 },
  },
  mark: {
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 44, height: 44 },
    xl: { width: 56, height: 56 },
  },
};

export function Logo({
  variant = 'full',
  size = 'md',
  className,
  priority = false,
  href = '/',
  alt,
}: LogoProps) {
  const { width, height } = DIMENSIONS[variant][size];
  const altText = alt || (variant === 'full' ? 'Preppy — GitHub Profile Analyzer' : 'Preppy Logo Mark');

  const content = (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden flex-shrink-0 transition-opacity hover:opacity-95',
        variant === 'mark' ? 'rounded-xl' : 'rounded-lg',
        className
      )}
      style={{ width, height }}
    >
      <Image
        src="/logo/prepply.png"
        alt={altText}
        width={1264}
        height={848}
        priority={priority}
        className={cn(
          'w-full h-full select-none pointer-events-none',
          variant === 'mark' ? 'object-cover object-center' : 'object-contain object-left'
        )}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl transition-all"
        aria-label="Preppy Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
