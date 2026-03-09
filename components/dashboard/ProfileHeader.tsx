'use client';
import { GitHubUser } from '@/types';
import { MapPin, Link2, Users, GitFork } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
}

export default function ProfileHeader({ user, totalStars, totalForks }: Props) {
  return (
    <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Image
            src={user.avatar_url}
            alt={user.login}
            width={80}
            height={80}
            className="rounded-2xl"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent border-2 border-bg-secondary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-text-primary">{user.name || user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors"
            >
              <span className="text-sm font-mono">@{user.login}</span>
            </a>
          </div>
          {user.bio && (
            <p className="text-text-secondary text-sm mb-3 leading-relaxed">{user.bio}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            {user.company && (
              <span className="flex items-center gap-1.5">
                <span>🏢</span> {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" /> {user.blog}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              📅 Joined {formatDate(user.created_at)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:flex-col sm:text-right flex-shrink-0">
          {[
            { label: 'Followers', value: formatNumber(user.followers), icon: '👥' },
            { label: 'Stars', value: formatNumber(totalStars), icon: '⭐' },
            { label: 'Repos', value: user.public_repos.toString(), icon: '📁' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center sm:text-right">
              <div className="text-lg font-bold font-mono text-text-primary">{value}</div>
              <div className="text-xs text-text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
