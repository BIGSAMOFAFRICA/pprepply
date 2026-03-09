'use client';
import { useState, useEffect } from 'react';
import { FileText, Trash2, ExternalLink, TrendingUp, Star, GitFork, Users, Search } from 'lucide-react';
import Link from 'next/link';
import { SavedReport } from '@/types';
import { formatNumber, formatDate } from '@/lib/utils';
import { getScoreLabel } from '@/lib/scoring';
import DeveloperScore from '@/components/dashboard/DeveloperScore';
import LanguageChart from '@/components/dashboard/LanguageChart';
import RepoInsights from '@/components/dashboard/RepoInsights';
import Suggestions from '@/components/dashboard/Suggestions';

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SavedReport | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(d => {
        setReports(d.reports || []);
        if (d.reports?.length) setSelected(d.reports[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteReport = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      if (selected?.id === id) setSelected(updated[0] || null);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent/20 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-7 h-7 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">No saved reports</h2>
        <p className="text-text-secondary mb-6">Analyze a profile and save it to view it here later</p>
        <Link href="/dashboard/analyze" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm">
          <Search className="w-4 h-4" /> Analyze a Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar list */}
      <div className="w-72 flex-shrink-0 space-y-2">
        <h1 className="text-xl font-bold text-text-primary mb-4">Saved Reports</h1>
        {reports.map(report => {
          const score = getScoreLabel(report.developerScore);
          const isSelected = selected?.id === report.id;
          return (
            <button
              key={report.id}
              onClick={() => setSelected(report)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all group ${
                isSelected
                  ? 'border-accent/30 bg-accent-subtle'
                  : 'border-white/[0.06] bg-bg-secondary hover:border-white/[0.12]'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-bg-hover border border-white/[0.06] overflow-hidden flex-shrink-0">
                {report.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={report.avatarUrl} alt={report.githubUsername} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">👤</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                  @{report.githubUsername}
                </p>
                <p className="text-xs text-text-muted">{formatDate(report.createdAt)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold font-mono" style={{ color: score.color }}>
                  {Math.round(report.developerScore)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail view */}
      {selected && (
        <div className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/[0.06]">
                {selected.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.avatarUrl} alt={selected.githubUsername} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-bg-hover flex items-center justify-center">👤</div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-text-primary">@{selected.githubUsername}</h2>
                <p className="text-xs text-text-muted">Saved {formatDate(selected.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://github.com/${selected.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-all text-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                GitHub
              </a>
              <button
                onClick={() => deleteReport(selected.id)}
                disabled={deleting === selected.id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Repos', value: selected.publicRepos, icon: '📁', color: '#22D3EE' },
              { label: 'Stars', value: selected.totalStars, icon: '⭐', color: '#FBBF24' },
              { label: 'Forks', value: selected.totalForks, icon: '🍴', color: '#818CF8' },
              { label: 'Followers', value: selected.followers, icon: '👥', color: '#34D399' },
            ].map(stat => (
              <div key={stat.label} className="bg-bg-secondary rounded-xl p-4 border border-white/[0.06]">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-xl font-bold font-mono" style={{ color: stat.color }}>
                  {formatNumber(stat.value)}
                </div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {selected.scoreBreakdown && (
            <DeveloperScore score={selected.developerScore} breakdown={selected.scoreBreakdown} />
          )}
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
  );
}
