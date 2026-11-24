import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { fetchGitHubUser, fetchUserRepos, fetchLanguages, fetchContributions } from '@/lib/github';
import {
  calculateDeveloperScore,
  generateSuggestions,
  buildFallbackAIAnalysis,
} from '@/lib/scoring';
import { prisma } from '@/lib/db';
import { AnalysisResult, RepoInsight } from '@/types';
import { AnalyzeRequestSchema } from '@/lib/github-schema';
import { GitHubError, GitHubNotFoundError, GitHubRateLimitError, GitHubAuthError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to analyze profiles.', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body', code: 'BAD_REQUEST' }, { status: 400 });
    }

    const parseResult = AnalyzeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid username';
      return NextResponse.json({ error: firstError, code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const { username: cleanUsername, save } = parseResult.data;

    // Fetch user profile and repositories
    const [user, repos] = await Promise.all([
      fetchGitHubUser(cleanUsername),
      fetchUserRepos(cleanUsername),
    ]);

    // Fetch languages and contribution events
    const [languages, contributions] = await Promise.all([
      fetchLanguages(cleanUsername, repos),
      fetchContributions(cleanUsername),
    ]);

    const { score, breakdown } = calculateDeveloperScore(user, repos, languages);
    const suggestions = generateSuggestions(user, repos, breakdown);

    const topRepos: RepoInsight[] = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || null,
        description: r.description || null,
        url: r.html_url,
        updatedAt: r.updated_at,
        hasReadme: !!r.has_readme || !!r.description,
        topics: r.topics || [],
      }));

    const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);

    const fallback = buildFallbackAIAnalysis(user, repos, languages, score, breakdown);
    const aiSummary = fallback.summary;
    const keyStrengths = fallback.keyStrengths;
    const risks = fallback.risks;
    const actionPlan = fallback.actionPlan;
    const companyMatches = fallback.companyMatches;

    const result: AnalysisResult = {
      user,
      languages,
      topRepos,
      contributions,
      scoreBreakdown: breakdown,
      developerScore: score,
      suggestions,
      totalStars,
      totalForks,
      aiSummary,
      keyStrengths,
      risks,
      actionPlan,
      companyMatches,
    };

    if (save) {
      try {
        let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!dbUser) {
          const authUser = await currentUser();
          dbUser = await prisma.user.create({
            data: {
              clerkId: userId,
              email: authUser?.emailAddresses[0]?.emailAddress || `${userId}@preppy.app`,
              name: authUser?.fullName || null,
            },
          });
        }

        await prisma.report.create({
          data: {
            userId: dbUser.id,
            githubUsername: user.login,
            avatarUrl: user.avatar_url,
            name: user.name,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            publicRepos: user.public_repos,
            totalStars,
            totalForks,
            developerScore: score,
            scoreBreakdown: breakdown as object,
            languages: languages as object[],
            topRepos: topRepos as object[],
            contributions: contributions as object[],
            suggestions: suggestions as object[],
            aiSummary,
            keyStrengths: keyStrengths as object,
            risks: risks as object,
            actionPlan: actionPlan as object,
            companyMatches: companyMatches as object,
          },
        });
      } catch (dbErr) {
        // Log on server only; do not fail the user's active analysis if DB is offline
        console.error('[Analyze API] DB persistence error:', dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[Analyze API] Execution error:', error);

    if (error instanceof GitHubNotFoundError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }

    if (error instanceof GitHubRateLimitError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          resetAt: error.resetAt,
          retryAfterSeconds: error.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    if (error instanceof GitHubAuthError) {
      return NextResponse.json(
        { error: 'GitHub authorization error. Check server token configuration.', code: error.code },
        { status: 401 }
      );
    }

    if (error instanceof GitHubError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode || 500 }
      );
    }

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message, code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
