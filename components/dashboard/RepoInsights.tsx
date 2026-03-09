'use client';
import { RepoInsight } from '@/types';
import { Star, GitFork, ExternalLink, Tag } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { getLangColor } from '@/lib/github';

interface Props {
  repos: RepoInsight[];
}

export default function RepoInsights({ repos }: Props) {
  if (!repos.length) return null;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
      <h2 className="text-sm font-medium text-text-secondary mb-6 uppercase tracking-widest font-mono">
        Top Repositories
      </h2>
      <div className="grid md:grid-cols-2 gap-3">
        {repos.slice(0, 6).map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl border border-white/[0.06] bg-bg hover:border-accent/20 transition-all hover:shadow-glow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors text-sm truncate">
                {repo.name}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-0.5" />
            </div>
            {repo.description && (
              <p className="text-xs text-text-secondary mb-3 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              {repo.language && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: getLangColor(repo.language) }} />
                  <span className="text-xs text-text-secondary">{repo.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-text-muted">
                <Star className="w-3 h-3" />
                <span className="text-xs font-mono">{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1 text-text-muted">
                <GitFork className="w-3 h-3" />
                <span className="text-xs font-mono">{repo.forks}</span>
              </div>
              <span className="text-xs text-text-muted ml-auto">{timeAgo(repo.updatedAt)}</span>
            </div>
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-accent-subtle text-accent/70 font-mono"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
