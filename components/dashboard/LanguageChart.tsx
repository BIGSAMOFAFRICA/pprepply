'use client';
import { LanguageStat } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  languages: LanguageStat[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: LanguageStat }> }) => {
  if (active && payload && payload.length) {
    const lang = payload[0].payload;
    return (
      <div className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm">
        <p className="text-text-primary font-medium">{lang.name}</p>
        <p className="text-text-secondary font-mono">{lang.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function LanguageChart({ languages }: Props) {
  if (!languages.length) return null;

  const top5 = languages.slice(0, 5);
  const others = languages.slice(5);
  const othersPct = others.reduce((a, l) => a + l.percentage, 0);

  const chartData = [
    ...top5,
    ...(othersPct > 0 ? [{ name: 'Others', percentage: Math.round(othersPct * 10) / 10, bytes: 0, color: '#4A5568' }] : []),
  ];

  return (
    <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
      <h2 className="text-sm font-medium text-text-secondary mb-6 uppercase tracking-widest font-mono">
        Language Distribution
      </h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Donut */}
        <div className="flex-shrink-0 w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                dataKey="percentage"
                paddingAngle={2}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 w-full">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: lang.color }} />
              <span className="text-sm text-text-secondary flex-1 min-w-0 truncate">{lang.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${lang.percentage}%`, background: lang.color }}
                  />
                </div>
                <span className="text-sm font-mono text-text-primary w-10 text-right">
                  {lang.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
