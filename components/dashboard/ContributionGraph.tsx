'use client';
import { ContributionData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

interface Props {
  contributions: ContributionData[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm">
        <p className="text-text-secondary text-xs">{label}</p>
        <p className="text-accent font-mono font-semibold">{payload[0].value} events</p>
      </div>
    );
  }
  return null;
};

export default function ContributionGraph({ contributions }: Props) {
  if (!contributions.length) return null;

  // Weekly aggregation for cleaner display
  const weekly: Record<string, number> = {};
  contributions.forEach(({ date, count }) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weekly[key] = (weekly[key] || 0) + count;
  });

  const chartData = Object.entries(weekly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: format(parseISO(date), 'MMM d'),
      count,
    }));

  const totalEvents = contributions.reduce((a, c) => a + c.count, 0);
  const activeDays = contributions.filter((c) => c.count > 0).length;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest font-mono">
          Contribution Activity
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="text-text-muted text-xs">Events (90d)</p>
            <p className="font-mono font-semibold text-accent">{totalEvents}</p>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-xs">Active Days</p>
            <p className="font-mono font-semibold text-cyan-accent">{activeDays}</p>
          </div>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#4A5568', fontFamily: 'var(--font-jetbrains)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#4A5568', fontFamily: 'var(--font-jetbrains)' }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,229,160,0.05)' }} />
            <Bar
              dataKey="count"
              fill="#00E5A0"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
