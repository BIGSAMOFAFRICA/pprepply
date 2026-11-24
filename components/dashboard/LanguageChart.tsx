'use client';

import { LanguageStat } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';

interface Props {
  languages: LanguageStat[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: LanguageStat }> }) => {
  if (active && payload && payload.length) {
    const lang = payload[0].payload;
    return (
      <div className="bg-white border border-[#E7E6F0] rounded-xl px-3 py-2 text-xs shadow-soft-md">
        <p className="text-ink font-semibold">{lang.name}</p>
        <p className="text-ink-muted tabular-nums">{lang.percentage}% of codebase</p>
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
    ...(othersPct > 0 ? [{ name: 'Other', percentage: Math.round(othersPct * 10) / 10, bytes: 0, color: '#9EA3B8' }] : []),
  ];

  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink">Language Breakdown</h3>
          <p className="text-xs text-ink-muted">Code composition across public repositories</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* Donut Chart */}
        <div className="flex-shrink-0 w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="percentage"
                paddingAngle={3}
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
          {languages.slice(0, 6).map((lang) => {
            const langLower = lang.name.toLowerCase();
            const brandLogo =
              langLower === 'typescript' ? '/icons/brands/typescript.svg' :
              langLower === 'javascript' ? '/icons/brands/javascript.svg' :
              langLower === 'python' ? '/icons/brands/python.svg' :
              langLower === 'go' ? '/icons/brands/go.svg' :
              langLower === 'rust' ? '/icons/brands/rust.svg' : null;

            return (
              <div key={lang.name} className="flex items-center gap-3 text-xs">
                {brandLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brandLogo} alt="" className="w-3.5 h-3.5 object-contain flex-shrink-0" aria-hidden="true" />
                ) : (
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                )}
                <span className="text-ink font-medium flex-1 truncate">{lang.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[#ECEBFA] rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    />
                  </div>
                  <span className="font-semibold text-ink tabular-nums w-10 text-right">
                    {lang.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
