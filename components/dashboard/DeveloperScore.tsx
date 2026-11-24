'use client';

import { ScoreBreakdown } from '@/types';
import { getScoreLabel } from '@/lib/scoring';
import { Card } from '@/components/ui/Card';

interface Props {
  score: number;
  breakdown: ScoreBreakdown;
}

const DIMENSIONS = [
  { key: 'repoScore', label: 'Repositories', max: 25 },
  { key: 'commitScore', label: 'Activity', max: 25 },
  { key: 'languageScore', label: 'Language Diversity', max: 20 },
  { key: 'documentationScore', label: 'Documentation', max: 20 },
  { key: 'communityScore', label: 'Community', max: 10 },
] as const;

export default function DeveloperScore({ score, breakdown }: Props) {
  const { label, color } = getScoreLabel(score);
  const radius = 75;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-ink">Developer Score Breakdown</h3>
          <p className="text-xs text-ink-muted">Algorithmic evaluation across 5 key dimensions</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Radial Score Meter */}
        <div className="relative flex-shrink-0">
          <svg width="180" height="180">
            {/* Background Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#ECEBFA"
              strokeWidth={strokeWidth}
            />
            {/* Progress Stroke */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 90 90)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Figure */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-ink tabular-nums">
              {Math.round(score)}
            </span>
            <span className="text-xs font-medium text-ink-muted mt-0.5">/ 100</span>
          </div>
        </div>

        {/* 5-Dimensional Breakdown Bars */}
        <div className="flex-1 space-y-3.5 w-full">
          {DIMENSIONS.map(({ key, label: dimLabel, max }) => {
            const val = breakdown[key] || 0;
            const pct = Math.min(100, Math.max(0, (val / max) * 100));

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-medium text-ink">{dimLabel}</span>
                  <span className="font-semibold text-ink tabular-nums">
                    {val} <span className="text-ink-muted font-normal">/ {max}</span>
                  </span>
                </div>
                <div className="h-2 bg-[#ECEBFA] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct >= 80 ? '#3F9B7A' : pct >= 50 ? '#5B5BD6' : '#C98A2B',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
