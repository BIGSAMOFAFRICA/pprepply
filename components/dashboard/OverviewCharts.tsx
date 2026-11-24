'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface ActivityPoint {
  date: string;
  count: number;
}

interface LanguagePoint {
  name: string;
  percentage: number;
  highlight?: boolean;
}

interface OverviewChartsProps {
  activityData: ActivityPoint[];
  languageData: LanguagePoint[];
}

export function OverviewCharts({ activityData, languageData }: OverviewChartsProps) {
  // If activityData has few points, fill in mock fallback or sample trend
  const formattedActivity = activityData.length > 0 ? activityData.slice(-14) : [
    { date: 'W1', count: 12 },
    { date: 'W2', count: 18 },
    { date: 'W3', count: 15 },
    { date: 'W4', count: 28 },
    { date: 'W5', count: 24 },
    { date: 'W6', count: 32 },
    { date: 'W7', count: 40 },
    { date: 'W8', count: 35 },
  ];

  // Language bar data with one highlighted bar (the top language)
  const formattedLanguages = languageData.length > 0 ? languageData.slice(0, 5).map((l, i) => ({
    name: l.name,
    percentage: l.percentage,
    highlight: i === 0, // Highlight the top primary language
  })) : [
    { name: 'TypeScript', percentage: 45, highlight: true },
    { name: 'Python', percentage: 25, highlight: false },
    { name: 'Go', percentage: 15, highlight: false },
    { name: 'Rust', percentage: 10, highlight: false },
    { name: 'Other', percentage: 5, highlight: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Smooth Area Chart (8 cols) */}
      <Card radius="2xl" className="p-6 lg:col-span-7 flex flex-col justify-between border-[#E7E6F0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-ink">Contribution Momentum</h3>
            <p className="text-xs text-ink-muted">Recent developer commit frequency & event volume</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-soft text-primary">
            Activity
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B5BD6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5B5BD6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFF6" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B7089' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B7089' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E7E6F0',
                  boxShadow: '0 4px 12px rgba(31,35,64,0.06)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#5B5BD6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bar Chart with one highlighted bar (5 cols) */}
      <Card radius="2xl" className="p-6 lg:col-span-5 flex flex-col justify-between border-[#E7E6F0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-ink">Stack Concentration</h3>
            <p className="text-xs text-ink-muted">Code distribution across core languages</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-status-success-soft text-status-success">
            Top Stack
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedLanguages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFF6" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B7089' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B7089' }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E7E6F0',
                  boxShadow: '0 4px 12px rgba(31,35,64,0.06)',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${val}%`, 'Usage']}
              />
              <Bar dataKey="percentage" radius={[8, 8, 4, 4]}>
                {formattedLanguages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.highlight ? '#5B5BD6' : '#ECEBFA'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
