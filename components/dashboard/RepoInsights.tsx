'use client';

import { RepoInsight } from '@/types';
import { Star, GitFork, ExternalLink, Calendar } from 'lucide-react';
import { timeAgo, formatNumber } from '@/lib/utils';
import { getLangColor } from '@/lib/github';
import { Card } from '@/components/ui/Card';

interface Props {
  repos: RepoInsight[];
}

export default function RepoInsights({ repos }: Props) {
  if (!repos.length) return null;

  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink">Impactful Repositories</h3>
          <p className="text-xs text-ink-muted">Key projects driving portfolio signal</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bg-subtle text-ink-muted">
          {repos.length} Repositories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.slice(0, 6).map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl border border-line bg-white hover:border-primary/40 hover:shadow-soft transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="font-semibold text-ink group-hover:text-primary transition-colors text-sm truncate">
                {repo.name}
              </h4>
              <ExternalLink className="w-3.5 h-3.5 text-ink-faint group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
            </div>

            {repo.description && (
              <p className="text-xs text-ink-muted mb-3 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
            )}

            <div className="flex items-center gap-3.5 text-xs text-ink-muted flex-wrap mt-auto">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getLangColor(repo.language) }}
                  />
                  <span>{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-status-warning" />
                <span className="tabular-nums">{formatNumber(repo.stars)}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-ink-faint" />
                <span className="tabular-nums">{formatNumber(repo.forks)}</span>
              </div>
              <span className="ml-auto text-[11px] text-ink-faint">
                {timeAgo(repo.updatedAt)}
              </span>
            </div>

            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-line-soft">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-bg-subtle text-ink-muted"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </Card>
  );
}
