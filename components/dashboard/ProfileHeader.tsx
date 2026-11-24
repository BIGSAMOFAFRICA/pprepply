'use client';

import { GitHubUser } from '@/types';
import { MapPin, Globe, Calendar, Star, GitFork, Users } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface Props {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
}

export default function ProfileHeader({ user, totalStars, totalForks }: Props) {
  return (
    <Card radius="2xl" className="p-6 border-[#E7E6F0]">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-line bg-bg-subtle shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-ink">{user.name || user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:text-primary-hover bg-primary-soft px-2.5 py-1 rounded-full transition-colors"
            >
              @{user.login}
            </a>
          </div>

          {user.bio && (
            <p className="text-xs sm:text-sm text-ink-muted mb-3 leading-relaxed max-w-2xl">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-ink-faint" /> {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-ink-faint" /> {user.blog}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-ink-faint" /> Joined {formatDate(user.created_at)}
            </span>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="flex sm:flex-col gap-4 sm:gap-2 self-stretch sm:self-auto justify-between sm:text-right border-t sm:border-t-0 sm:border-l border-line pt-3 sm:pt-0 sm:pl-5">
          <div>
            <div className="text-base sm:text-lg font-bold text-ink tabular-nums">{formatNumber(user.followers)}</div>
            <div className="text-[11px] text-ink-muted">Followers</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-ink tabular-nums">{formatNumber(totalStars)}</div>
            <div className="text-[11px] text-ink-muted">Total Stars</div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-ink tabular-nums">{formatNumber(user.public_repos)}</div>
            <div className="text-[11px] text-ink-muted">Repositories</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
