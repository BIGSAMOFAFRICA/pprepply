import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, Search, TrendingUp, Star, GitFork, Users, FileText } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import { getScoreLabel } from '@/lib/scoring';
import { SavedReport } from '@/types';

async function getRecentReports(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return [];
    return await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();
  const reports = userId ? await getRecentReports(userId) : [];

  const firstName = user?.firstName || 'Developer';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {firstName} <span className="text-accent">👋</span>
          </h1>
          <p className="text-text-secondary mt-1">
            {reports.length > 0
              ? `You have ${reports.length} saved ${reports.length === 1 ? 'report' : 'reports'}`
              : 'Start by analyzing a GitHub profile'}
          </p>
        </div>
        <Link
          href="/dashboard/analyze"
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Search className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      {/* Quick stats if reports exist */}
      {reports.length > 0 && (() => {
        const latest = reports[0];
        const score = getScoreLabel(latest.developerScore);
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Latest Score', value: `${Math.round(latest.developerScore)}`, sub: score.label, color: score.color, icon: TrendingUp },
              { label: 'Public Repos', value: formatNumber(latest.publicRepos), sub: 'repositories', color: '#22D3EE', icon: GitFork },
              { label: 'Total Stars', value: formatNumber(latest.totalStars), sub: 'earned', color: '#FBBF24', icon: Star },
              { label: 'Followers', value: formatNumber(latest.followers), sub: 'followers', color: '#818CF8', icon: Users },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-bg-secondary rounded-xl p-5 border border-white/[0.06] card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-text-secondary text-xs font-medium">{stat.label}</p>
                    <Icon className="w-4 h-4 text-text-muted" />
                  </div>
                  <p className="text-2xl font-bold text-text-primary font-mono" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-text-muted text-xs mt-1">{stat.sub}</p>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Reports list / Empty state */}
      {reports.length === 0 ? (
        <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent/20 flex items-center justify-center mx-auto mb-6">
            <Search className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">No analyses yet</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Analyze your first GitHub profile to see your Developer Score, language breakdown, and personalized suggestions.
          </p>
          <Link
            href="/dashboard/analyze"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
          >
            Analyze a Profile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Recent Reports</h2>
            <Link href="/dashboard/reports" className="text-sm text-accent hover:text-accent-dim transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {reports.map((report) => {
              const score = getScoreLabel(report.developerScore);
              return (
                <Link
                  key={report.id}
                  href={`/dashboard/reports?id=${report.id}`}
                  className="flex items-center gap-4 p-4 bg-bg-secondary rounded-xl border border-white/[0.06] card-hover group"
                >
                  <div className="w-10 h-10 rounded-full bg-bg-hover border border-white/[0.06] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {report.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={report.avatarUrl} alt={report.githubUsername} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                      @{report.githubUsername}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{formatDate(report.createdAt.toString())}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold font-mono" style={{ color: score.color }}>
                      {Math.round(report.developerScore)}
                    </div>
                    <div className="text-xs" style={{ color: score.color }}>
                      {score.label}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
