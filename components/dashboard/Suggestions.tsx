'use client';
import { Suggestion } from '@/types';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  suggestions: Suggestion[];
}

const PRIORITY_STYLES = {
  high: { label: 'High', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  medium: { label: 'Medium', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  low: { label: 'Low', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const CATEGORY_ICONS: Record<string, string> = {
  documentation: '📝',
  activity: '⚡',
  diversity: '🌐',
  community: '👥',
  profile: '✨',
};

export default function Suggestions({ suggestions }: Props) {
  const [open, setOpen] = useState<string | null>(suggestions[0]?.id || null);

  if (!suggestions.length) return null;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest font-mono">
          Improvement Suggestions
        </h2>
      </div>

      <div className="space-y-2">
        {suggestions.map((s) => {
          const pStyle = PRIORITY_STYLES[s.priority];
          const isOpen = open === s.id;
          return (
            <div
              key={s.id}
              className={cn(
                'rounded-xl border transition-all duration-200',
                isOpen ? 'border-accent/20 bg-accent-subtle' : 'border-white/[0.06] bg-bg hover:border-white/[0.12]'
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[s.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium text-sm', isOpen ? 'text-accent' : 'text-text-primary')}>
                    {s.title}
                  </p>
                </div>
                <div className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border flex-shrink-0', pStyle.bg, pStyle.text, pStyle.border)}>
                  {pStyle.label}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-text-secondary leading-relaxed">{s.description}</p>
                  <div className="space-y-1.5">
                    {s.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                        <span className="text-xs text-text-secondary leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
