'use client';
import { useState } from 'react';
import { Search, Loader2, Save, RefreshCw, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '@/types';
import DeveloperScore from './DeveloperScore';
import LanguageChart from './LanguageChart';
import RepoInsights from './RepoInsights';
import ContributionGraph from './ContributionGraph';
import Suggestions from './Suggestions';
import ProfileHeader from './ProfileHeader';

export default function AnalyzeForm() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);

  const analyze = async (save = false) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), save }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
      if (save) setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async () => {
    if (!result || saved) return;
    setSaving(true);
    try {
      const res = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: result.user.login, save: true }),
      });
      if (res.ok) setSaved(true);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Analyze GitHub Profile</h1>
        <p className="text-text-secondary mb-6">Measure portfolio quality, map real hiring fit, and check whether a company is realistic.</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-mono text-lg">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze(false)}
              placeholder="github-username"
              className="w-full bg-bg border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-text-primary placeholder-text-muted font-mono text-sm focus:outline-none focus:border-accent/50 focus:shadow-glow-sm transition-all"
            />
          </div>
          <button
            onClick={() => analyze(false)}
            disabled={loading || !username.trim()}
            className="btn-primary flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Search className="w-4 h-4" /> Analyze</>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary text-sm">
              Analysis complete for <span className="text-accent font-mono">@{result.user.login}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => analyze(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-all text-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                onClick={saveReport}
                disabled={saved || saving}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  saved
                    ? 'border border-accent/30 bg-accent-subtle text-accent'
                    : 'border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                }`}
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saved ? 'Saved!' : 'Save Report'}
              </button>
            </div>
          </div>

          <ProfileHeader user={result.user} totalStars={result.totalStars} totalForks={result.totalForks} />
          <DeveloperScore score={result.developerScore} breakdown={result.scoreBreakdown} />

          <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest font-mono">AI Summary</h2>
            </div>
            <p className="text-base text-text-primary leading-relaxed">{result.aiSummary}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Key strengths</h3>
                <ul className="space-y-2">
                  {result.keyStrengths.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Main risks</h3>
                <ul className="space-y-2">
                  {result.risks.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-text-secondary">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest font-mono">Best-fit companies</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {result.companyMatches.map((company) => (
                <div key={company.name} className="rounded-xl border border-white/[0.06] bg-bg p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img src={company.logoUrl} alt={company.name} className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1" />
                      <div>
                        <p className="font-semibold text-text-primary">{company.name}</p>
                        <p className="text-xs text-text-muted">{company.domain}</p>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-accent">{company.fitScore}%</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{company.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <LanguageChart languages={result.languages} />
            <ContributionGraph contributions={result.contributions} />
          </div>
          <RepoInsights repos={result.topRepos} />
          <Suggestions suggestions={result.suggestions} />

          {result.actionPlan.length > 0 && (
            <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest font-mono">Action plan</h2>
              </div>
              <div className="space-y-4">
                {result.actionPlan.map((plan) => (
                  <div key={plan.title} className="rounded-xl border border-white/[0.06] bg-bg p-4">
                    <h3 className="font-semibold text-text-primary mb-1">{plan.title}</h3>
                    <p className="text-sm text-text-secondary mb-3">{plan.description}</p>
                    <ul className="space-y-2">
                      {plan.steps.map((step) => (
                        <li key={step} className="flex gap-2 text-sm text-text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
