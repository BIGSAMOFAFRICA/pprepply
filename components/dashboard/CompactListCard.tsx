import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface CompactListItem {
  id: string;
  title: string;
  subtitle: string;
  value: string | number;
  valueLabel?: string;
  thumbnailUrl?: string | null;
  href?: string;
}

interface CompactListCardProps {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  items: CompactListItem[];
  emptyMessage?: string;
}

export function CompactListCard({
  title,
  actionHref,
  actionLabel = 'View all',
  items,
  emptyMessage = 'No items found',
}: CompactListCardProps) {
  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {actionHref && (
          <Link
            href={actionHref}
            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
          >
            <span>{actionLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-ink-muted py-6 text-center">{emptyMessage}</p>
      ) : (
        <div className="divide-y divide-line-soft">
          {items.map((item) => {
            const content = (
              <div className="py-3 flex items-center justify-between gap-3 group hover:bg-bg/50 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-xl bg-bg-subtle border border-line flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-primary">
                        {item.title.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-ink-muted truncate">{item.subtitle}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-ink tabular-nums">{item.value}</p>
                  {item.valueLabel && (
                    <p className="text-[10px] text-ink-muted">{item.valueLabel}</p>
                  )}
                </div>
              </div>
            );

            return item.href ? (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
