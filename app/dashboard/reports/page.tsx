'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Trash2,
  ExternalLink,
  Search,
  ArrowLeft,
  Calendar,
  Star,
  GitFork,
  Users,
  FolderGit2,
} from 'lucide-react';
import Link from 'next/link';
import { SavedReport } from '@/types';
import { formatNumber, formatDate } from '@/lib/utils';
import { getScoreLabel } from '@/lib/scoring';
import DeveloperScore from '@/components/dashboard/DeveloperScore';
import LanguageChart from '@/components/dashboard/LanguageChart';
import RepoInsights from '@/components/dashboard/RepoInsights';
import Suggestions from '@/components/dashboard/Suggestions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SavedReport | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d) => {
        const list = d.reports || [];
        setReports(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch((err) => console.warn('[Reports] Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const deleteReport = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
      const updated = reports.filter((r) => r.id !== id);
      setReports(updated);
      if (selected?.id === id) {
        setSelected(updated[0] || null);
        setShowMobileDetail(false);
      }
    } catch (err) {
      console.warn('[Reports] Delete error:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <Card radius="2xl" className="p-10 border-[#E7E6F0]">
        <EmptyState
          icon={FileText}
          title="No saved reports"
          description="Analyze any developer profile and bookmark it to view long-term score trends and audit history here."
          actionLabel="Analyze a Profile"
          actionHref="/dashboard/analyze"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Saved Reports</h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            {reports.length} profile {reports.length === 1 ? 'audit' : 'audits'} archived
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Search className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Report List (Hidden on mobile when viewing detail) */}
        <div
          className={cn(
            'lg:col-span-4 space-y-2.5',
            showMobileDetail ? 'hidden lg:block' : 'block'
          )}
        >
          {reports.map((report) => {
            const isSelected = selected?.id === report.id;
            const score = Math.round(report.developerScore);
            const scoreLabel = getScoreLabel(score);

            return (
              <button
                key={report.id}
                type="button"
                onClick={() => {
                  setSelected(report);
                  setShowMobileDetail(true);
                }}
                className={cn(
                  'w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-center gap-3.5 min-h-[44px]',
                  isSelected
                    ? 'border-primary bg-primary-soft/50 shadow-soft'
                    : 'border-line bg-white hover:border-[#D8D6E4] hover:bg-bg/40'
                )}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-bg-subtle border border-line overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {report.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={report.avatarUrl}
                      alt={report.githubUsername}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-primary">
                      {report.githubUsername.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    @{report.githubUsername}
                  </p>
                  <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-ink-faint" />
                    <span>{formatDate(report.createdAt)}</span>
                  </p>
                </div>

                {/* Score Pill */}
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-bold text-ink tabular-nums">{score}</span>
                  <p className="text-[10px] font-semibold" style={{ color: scoreLabel.color }}>
                    {scoreLabel.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detailed Report Inspection (Mobile responsive) */}
        {selected && (
          <div
            className={cn(
              'lg:col-span-8 space-y-6',
              showMobileDetail ? 'block' : 'hidden lg:block'
            )}
          >
            {/* Mobile Back Button */}
            <div className="lg:hidden mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileDetail(false)}
                className="gap-1.5 text-ink-muted"
              >
                <ArrowLeft className="w-4 h-4" /> Back to list
              </Button>
            </div>

            {/* Profile Detail Header */}
            <Card radius="2xl" className="p-6 border-[#E7E6F0]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-bg-subtle border border-line overflow-hidden flex-shrink-0">
                    {selected.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selected.avatarUrl}
                        alt={selected.githubUsername}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                        {selected.githubUsername.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">@{selected.githubUsername}</h3>
                    <p className="text-xs text-ink-muted">
                      Snapshot taken on {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={`https://github.com/${selected.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      GitHub
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReport(selected.id)}
                    disabled={deleting === selected.id}
                    loading={deleting === selected.id}
                    className="border-status-danger/30 text-status-danger hover:bg-status-danger-soft gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-line">
                <div className="p-3 rounded-xl bg-bg-subtle">
                  <span className="text-[11px] text-ink-muted">Public Repos</span>
                  <p className="text-base font-bold text-ink tabular-nums">
                    {formatNumber(selected.publicRepos)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-bg-subtle">
                  <span className="text-[11px] text-ink-muted">Total Stars</span>
                  <p className="text-base font-bold text-ink tabular-nums">
                    {formatNumber(selected.totalStars)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-bg-subtle">
                  <span className="text-[11px] text-ink-muted">Total Forks</span>
                  <p className="text-base font-bold text-ink tabular-nums">
                    {formatNumber(selected.totalForks)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-bg-subtle">
                  <span className="text-[11px] text-ink-muted">Followers</span>
                  <p className="text-base font-bold text-ink tabular-nums">
                    {formatNumber(selected.followers)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Score Breakdown */}
            {selected.scoreBreakdown && (
              <DeveloperScore
                score={selected.developerScore}
                breakdown={selected.scoreBreakdown}
              />
            )}

            {/* Languages and Repos */}
            {selected.languages && selected.languages.length > 0 && (
              <LanguageChart languages={selected.languages} />
            )}

            {selected.topRepos && selected.topRepos.length > 0 && (
              <RepoInsights repos={selected.topRepos} />
            )}

            {selected.suggestions && selected.suggestions.length > 0 && (
              <Suggestions suggestions={selected.suggestions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
