import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  TrendingUp,
  FolderGit2,
  Star,
  Users,
  Search,
  ArrowRight,
} from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import { getScoreLabel } from '@/lib/scoring';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { GaugeCard } from '@/components/dashboard/GaugeCard';
import { OverviewCharts } from '@/components/dashboard/OverviewCharts';
import { CompactListCard } from '@/components/dashboard/CompactListCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';

async function getRecentReports(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return [];
    return await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
  } catch (err) {
    console.warn('[Dashboard] Could not fetch reports:', err);
    return [];
  }
}

export default async function DashboardPage() {
  const { userId } = auth();
  const reports = userId ? await getRecentReports(userId) : [];

  const latest = reports.length > 0 ? reports[0] : null;
  const score = latest ? Math.round(latest.developerScore) : 0;
  const scoreInfo = getScoreLabel(score);

  // Extract contribution / language data from latest report if available
  const rawContributions = (latest?.contributions as Array<{ date: string; count: number }> | null) || [];
  const activityData = rawContributions.slice(-14);

  const rawLanguages = (latest?.languages as Array<{ name: string; percentage: number }> | null) || [];
  const languageData = rawLanguages.slice(0, 5);

  const rawTopRepos = (latest?.topRepos as Array<{ name: string; stars: number; language: string | null; description: string | null }> | null) || [];

  return (
    <div className="space-y-8">
      {/* Row of 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          label="Developer Score"
          value={latest ? `${score}` : '—'}
          sublabel={latest ? `${scoreInfo.label} status` : 'Run analysis'}
          icon={TrendingUp}
          progress={score}
          color="#5B5BD6"
          trackColor="#ECEBFA"
        />
        <KpiCard
          label="Public Repos"
          value={latest ? formatNumber(latest.publicRepos) : '—'}
          sublabel="Tracked repositories"
          icon={FolderGit2}
          progress={latest ? Math.min(100, (latest.publicRepos / 30) * 100) : 0}
          color="#3F9B7A"
          trackColor="#EAF6F1"
        />
        <KpiCard
          label="Total Stars"
          value={latest ? formatNumber(latest.totalStars) : '—'}
          sublabel="Community appreciation"
          icon={Star}
          progress={latest ? Math.min(100, (latest.totalStars / 50) * 100) : 0}
          color="#C98A2B"
          trackColor="#FDF6EB"
        />
        <KpiCard
          label="Followers"
          value={latest ? formatNumber(latest.followers) : '—'}
          sublabel="Developer network"
          icon={Users}
          progress={latest ? Math.min(100, (latest.followers / 50) * 100) : 0}
          color="#6B7089"
          trackColor="#F0EFF6"
        />
      </div>

      {reports.length === 0 ? (
        /* Honest empty state when user hasn't analyzed any profiles yet */
        <Card radius="2xl" className="p-10 border-[#E7E6F0]">
          <EmptyState
            icon={Search}
            title="No profile analyses yet"
            description="Analyze any public GitHub profile to see Developer Scores, contribution momentum, and language distribution."
            actionLabel="Start Your First Analysis"
            actionHref="/dashboard/analyze"
          />
        </Card>
      ) : (
        <>
          {/* Middle Layout: Charts & Gauge Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Smooth Area Chart & Bar Chart (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <OverviewCharts
                activityData={activityData}
                languageData={languageData}
              />
            </div>

            {/* Gauge-style metric card with description and primary button (4 cols) */}
            <div className="lg:col-span-4 flex flex-col">
              <GaugeCard
                score={score}
                label={scoreInfo.label}
                description={
                  score >= 80
                    ? 'Your GitHub signal is in the top bracket. Keep shipping consistent open-source work and clean documentation.'
                    : score >= 60
                    ? 'Solid foundation with consistent commits. Improve repository topics and project READMEs to boost profile score.'
                    : 'Portfolio requires more recent active commits and clear project descriptions to stand out to recruiters.'
                }
                primaryActionLabel="Run New Profile Audit"
                primaryActionHref="/dashboard/analyze"
              />
            </div>
          </div>

          {/* Bottom Section: Compact List Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reports List */}
            <CompactListCard
              title="Recent Saved Reports"
              actionHref="/dashboard/reports"
              actionLabel="View all reports"
              items={reports.map((r) => ({
                id: r.id,
                title: `@${r.githubUsername}`,
                subtitle: `Analyzed on ${formatDate(r.createdAt.toString())}`,
                value: `${Math.round(r.developerScore)}/100`,
                valueLabel: getScoreLabel(r.developerScore).label,
                thumbnailUrl: r.avatarUrl,
                href: `/dashboard/reports?id=${r.id}`,
              }))}
            />

            {/* Top Repositories from Latest Report */}
            <CompactListCard
              title="Featured Repositories"
              actionHref="/dashboard/analyze"
              actionLabel="Analyze more"
              items={rawTopRepos.slice(0, 5).map((repo, i) => ({
                id: `repo-${i}`,
                title: repo.name,
                subtitle: repo.language || repo.description || 'Open source project',
                value: `★ ${formatNumber(repo.stars)}`,
                valueLabel: 'Stars',
                thumbnailUrl: null,
              }))}
              emptyMessage="No repositories available for this profile"
            />
          </div>
        </>
      )}
    </div>
  );
}
