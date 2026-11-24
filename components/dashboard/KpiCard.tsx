import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Card } from '@/components/ui/Card';

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  progress: number; // 0 - 100
  color?: string;
  trackColor?: string;
}

export function KpiCard({
  label,
  value,
  sublabel,
  icon: Icon,
  progress,
  color = '#5B5BD6',
  trackColor = '#ECEBFA',
}: KpiCardProps) {
  return (
    <Card
      radius="xl"
      className="p-5 flex items-center justify-between hover:shadow-soft-md transition-shadow duration-200 border-[#E7E6F0]"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Small icon tile */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-muted truncate mb-0.5">{label}</p>
          <p className="text-2xl font-bold text-ink tabular-nums tracking-tight">{value}</p>
          {sublabel && (
            <p className="text-[11px] text-ink-muted mt-0.5 truncate">{sublabel}</p>
          )}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex-shrink-0 pl-2">
        <ProgressRing
          progress={progress}
          size={44}
          strokeWidth={4}
          color={color}
          trackColor={trackColor}
        />
      </div>
    </Card>
  );
}
