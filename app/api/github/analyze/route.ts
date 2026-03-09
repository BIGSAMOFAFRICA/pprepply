import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchGitHubUser, fetchUserRepos, fetchLanguages, fetchContributions } from '@/lib/github';
import { calculateDeveloperScore, generateSuggestions } from '@/lib/scoring';
import { prisma } from '@/lib/db';
import { AnalysisResult, RepoInsight } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, save = false } = await req.json();
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const cleanUsername = username.trim().replace(/^@/, '');

    // Fetch GitHub data
    const [user, repos] = await Promise.all([
      fetchGitHubUser(cleanUsername),
      fetchUserRepos(cleanUsername),
    ]);

    const [languages, contributions] = await Promise.all([
      fetchLanguages(cleanUsername, repos),
      fetchContributions(cleanUsername),
    ]);

    // Calculate scores
    const { score, breakdown } = calculateDeveloperScore(user, repos, languages);

    // Generate suggestions
    const suggestions = generateSuggestions(user, repos, breakdown);

    // Top repos
    const topRepos: RepoInsight[] = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        description: r.description,
        url: r.html_url,
        updatedAt: r.updated_at,
        hasReadme: !!r.description,
        topics: r.topics || [],
      }));

    const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
    const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);

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
    };

    // Optionally save to DB
    if (save) {
      try {
        let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!dbUser) {
          const authUser = await import('@clerk/nextjs/server').then(m => m.currentUser());
          dbUser = await prisma.user.create({
            data: {
              clerkId: userId,
              email: authUser?.emailAddresses[0]?.emailAddress || `${userId}@preppy.app`,
              name: authUser?.fullName,
            },
          });
        }

        await prisma.report.create({
          data: {
            userId: dbUser.id,
            githubUsername: cleanUsername,
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
          },
        });
      } catch (dbErr) {
        console.error('DB save error:', dbErr);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
