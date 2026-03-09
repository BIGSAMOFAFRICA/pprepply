'use client';
import { ScoreBreakdown } from '@/types';
import { getScoreLabel } from '@/lib/scoring';

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
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
      <h2 className="text-sm font-medium text-text-secondary mb-6 uppercase tracking-widest font-mono">
        Developer Score
      </h2>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Circle */}
        <div className="relative flex-shrink-0">
          <svg width="200" height="200" className="score-ring">
            {/* Background track */}
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="12"
            />
            {/* Progress */}
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold font-mono" style={{ color }}>
              {Math.round(score)}
            </span>
            <span className="text-sm font-medium mt-1" style={{ color }}>
              {label}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3 w-full">
          {DIMENSIONS.map(({ key, label, max }) => {
            const val = breakdown[key];
            const pct = (val / max) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-sm font-mono font-medium text-text-primary">
                    {val}<span className="text-text-muted">/{max}</span>
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      background: pct > 70 ? '#00E5A0' : pct > 40 ? '#22D3EE' : '#FBBF24',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
