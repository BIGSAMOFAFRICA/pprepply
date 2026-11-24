'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface GaugeCardProps {
  score: number;
  label: string;
  description: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  onPrimaryAction?: () => void;
}

export function GaugeCard({
  score,
  label,
  description,
  primaryActionLabel = 'Analyze Profile',
  primaryActionHref = '/dashboard/analyze',
  onPrimaryAction,
}: GaugeCardProps) {
  // SVG semi-circle gauge calculation
  const radius = 68;
  const strokeWidth = 10;
  const arcLength = Math.PI * radius; // Half circumference
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = arcLength - (clampedScore / 100) * arcLength;

  const color =
    clampedScore >= 80 ? '#3F9B7A' : clampedScore >= 60 ? '#5B5BD6' : clampedScore >= 40 ? '#C98A2B' : '#C0524F';

  return (
    <Card radius="2xl" className="p-6 flex flex-col justify-between border-[#E7E6F0] relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
            Overall Readiness Gauge
          </span>
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {label}
          </span>
        </div>

        {/* Semi-circular gauge visual */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <svg width="160" height="95" className="overflow-visible">
            {/* Background semi-circle */}
            <path
              d="M 12 85 A 68 68 0 0 1 148 85"
              fill="none"
              stroke="#ECEBFA"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress semi-circle */}
            <path
              d="M 12 85 A 68 68 0 0 1 148 85"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-ink tabular-nums">{Math.round(clampedScore)}</span>
            <span className="text-[11px] text-ink-muted font-medium">/ 100 Index</span>
          </div>
        </div>

        <p className="text-xs text-ink-muted text-center mt-3 leading-relaxed px-2">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-line">
        {primaryActionHref ? (
          <Link href={primaryActionHref} className="w-full block">
            <Button variant="primary" size="md" className="w-full gap-2">
              <span>{primaryActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="md" className="w-full gap-2" onClick={onPrimaryAction}>
            <span>{primaryActionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
