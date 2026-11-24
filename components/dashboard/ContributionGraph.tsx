'use client';

import { ContributionData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/ui/Card';

interface Props {
  contributions: ContributionData[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E7E6F0] rounded-xl px-3 py-2 text-xs shadow-soft-md">
        <p className="text-ink-muted text-[11px]">{label}</p>
        <p className="text-primary font-bold tabular-nums">{payload[0].value} public events</p>
      </div>
    );
  }
  return null;
};

export default function ContributionGraph({ contributions }: Props) {
  if (!contributions.length) return null;

  // Weekly aggregation for clean display
  const weekly: Record<string, number> = {};
  contributions.forEach(({ date, count }) => {
    try {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weekly[key] = (weekly[key] || 0) + count;
    } catch {}
  });

  const chartData = Object.entries(weekly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => {
      let formattedDate = date;
      try {
        formattedDate = format(parseISO(date), 'MMM d');
      } catch {}
      return {
        date: formattedDate,
        count,
      };
    });

  const totalEvents = contributions.reduce((a, c) => a + c.count, 0);
  const activeDays = contributions.filter((c) => c.count > 0).length;

  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-ink">90-Day Contribution History</h3>
          <p className="text-xs text-ink-muted">Public commit and repository activity events</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-bg-subtle px-3 py-1.5 rounded-xl border border-line">
            <span className="text-ink-muted">Events: </span>
            <span className="font-bold text-ink tabular-nums">{totalEvents}</span>
          </div>
          <div className="bg-bg-subtle px-3 py-1.5 rounded-xl border border-line">
            <span className="text-ink-muted">Active Days: </span>
            <span className="font-bold text-status-success tabular-nums">{activeDays}</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={10} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EFF6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#6B7089' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6B7089' }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(91, 91, 214, 0.04)' }} />
            <Bar
              dataKey="count"
              fill="#5B5BD6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
