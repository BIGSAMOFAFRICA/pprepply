'use client';

import { Suggestion } from '@/types';
import { Lightbulb, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Props {
  suggestions: Suggestion[];
}

export default function Suggestions({ suggestions }: Props) {
  const [open, setOpen] = useState<string | null>(suggestions[0]?.id || null);

  if (!suggestions.length) return null;

  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-status-warning-soft text-status-warning flex items-center justify-center">
          <Lightbulb className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-ink">Actionable Improvements</h3>
          <p className="text-xs text-ink-muted">Prioritized steps to elevate your GitHub positioning</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((s) => {
          const isOpen = open === s.id;
          const priorityVariant =
            s.priority === 'high' ? 'danger' : s.priority === 'medium' ? 'warning' : 'default';

          return (
            <div
              key={s.id}
              className={cn(
                'rounded-xl border transition-all duration-150',
                isOpen
                  ? 'border-primary/30 bg-primary-subtle/50'
                  : 'border-line bg-white hover:border-[#D8D6E4]'
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="w-full flex items-center gap-3 p-4 text-left min-h-[44px]"
              >
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold', isOpen ? 'text-primary' : 'text-ink')}>
                    {s.title}
                  </p>
                </div>
                <Badge variant={priorityVariant} className="uppercase text-[10px] tracking-wider">
                  {s.priority}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-ink-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-muted flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 pt-1 border-t border-line/60">
                  <p className="text-xs text-ink-muted leading-relaxed">{s.description}</p>
                  <div className="space-y-2">
                    {s.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-ink">
                        <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
