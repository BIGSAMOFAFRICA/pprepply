'use client';

import { useState } from 'react';
import {
  Search,
  Loader2,
  Bookmark,
  Check,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { AnalysisResult } from '@/types';
import DeveloperScore from './DeveloperScore';
import LanguageChart from './LanguageChart';
import RepoInsights from './RepoInsights';
import ContributionGraph from './ContributionGraph';
import Suggestions from './Suggestions';
import ProfileHeader from './ProfileHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AnalyzeForm() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string; resetAt?: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);

  const analyze = async (save = false) => {
    const trimmed = username.trim().replace(/^@/, '');
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed, save }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError({
          message: data.error || 'Failed to analyze profile.',
          code: data.code,
          resetAt: data.resetAt,
        });
        return;
      }

      setResult(data);
      if (save) setSaved(true);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Network error occurred. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async () => {
    if (!result || saved || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: result.user.login, save: true }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (err) {
      console.warn('[AnalyzeForm] Save report error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <Card radius="2xl" className="p-6 sm:p-8 border-[#E7E6F0]">
        <div className="max-w-2xl mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Analyze GitHub Profile
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
            Enter any public GitHub handle to inspect portfolio credibility, tech stack balance, and calculate an objective Developer Score.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            analyze(false);
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint font-semibold text-sm">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. torvalds, shadcn, gaearon"
              className="w-full h-12 pl-9 pr-4 rounded-xl bg-bg border border-line text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !username.trim()}
            loading={loading}
            className="h-12 px-6 flex-shrink-0"
          >
            <Search className="w-4 h-4 mr-1.5" />
            Analyze Profile
          </Button>
        </form>

        {/* Actionable Error State with Retry Button */}
        {error && (
          <div className="mt-5 p-4 rounded-xl bg-status-danger-soft border border-status-danger/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-status-danger animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error.message}</p>
                {error.code === 'RATE_LIMIT_EXCEEDED' && (
                  <p className="text-xs text-status-danger/80 mt-0.5">
                    GitHub limits unauthenticated queries. If you are hosting the app, ensure GITHUB_TOKEN is configured in your environment.
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => analyze(false)}
              className="border-status-danger/30 text-status-danger hover:bg-status-danger/10 whitespace-nowrap self-end sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </div>
        )}
      </Card>

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-6">
          <Card radius="2xl" className="p-6 border-[#E7E6F0]">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-72" />
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card radius="2xl" className="p-6 border-[#E7E6F0] space-y-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </Card>
            <Card radius="2xl" className="p-6 border-[#E7E6F0] space-y-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </Card>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Top Results Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-subtle p-3.5 rounded-xl border border-line">
            <p className="text-xs sm:text-sm text-ink-muted">
              Report generated for <span className="font-bold text-ink">@{result.user.login}</span>
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => analyze(false)}
                className="gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
              <Button
                variant={saved ? 'secondary' : 'primary'}
                size="sm"
                onClick={saveReport}
                disabled={saved || saving}
                className="gap-1.5"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saved ? (
                  <Check className="w-3.5 h-3.5 text-status-success" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
                {saved ? 'Saved' : 'Save Report'}
              </Button>
            </div>
          </div>

          {/* Profile Header & Developer Score */}
          <ProfileHeader
            user={result.user}
            totalStars={result.totalStars}
            totalForks={result.totalForks}
          />

          <DeveloperScore
            score={result.developerScore}
            breakdown={result.scoreBreakdown}
          />

          {/* AI Synthesis Summary Card */}
          <Card radius="2xl" className="p-6 sm:p-8 border-[#E7E6F0]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-ink">Portfolio Intelligence Summary</h3>
            </div>

            <p className="text-sm text-ink leading-relaxed mb-6">
              {result.aiSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-line">
              <div>
                <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  Key Strengths
                </h4>
                <ul className="space-y-2.5">
                  {result.keyStrengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-ink">
                      <CheckCircle2 className="w-4 h-4 text-status-success mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  Identified Risks
                </h4>
                <ul className="space-y-2.5">
                  {result.risks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-ink">
                      <AlertTriangle className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Target Company Fit Matches */}
          {result.companyMatches && result.companyMatches.length > 0 && (
            <Card radius="2xl" className="p-6 border-[#E7E6F0]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Target Company Alignment</h3>
                  <p className="text-xs text-ink-muted">Tech stack and repository relevance match</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {result.companyMatches.map((company) => (
                  <div
                    key={company.name}
                    className="p-4 rounded-xl border border-line bg-bg hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-ink">{company.name}</span>
                      <span className="text-xs font-bold text-primary tabular-nums">
                        {company.fitScore}% Fit
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted line-clamp-2">{company.reason}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Languages & Activity Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguageChart languages={result.languages} />
            <ContributionGraph contributions={result.contributions} />
          </div>

          {/* Repositories and Suggestions */}
          <RepoInsights repos={result.topRepos} />
          <Suggestions suggestions={result.suggestions} />
        </div>
      )}
    </div>
  );
}
