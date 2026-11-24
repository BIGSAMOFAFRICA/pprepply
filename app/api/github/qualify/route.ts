import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchGitHubUser, fetchUserRepos, fetchLanguages } from '@/lib/github';
import { calculateDeveloperScore, buildQualificationResult } from '@/lib/scoring';
import { getOpenAICompanyQualification } from '@/lib/openai';
import { QualifyRequestSchema } from '@/lib/github-schema';
import { GitHubError, GitHubNotFoundError, GitHubRateLimitError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body', code: 'BAD_REQUEST' }, { status: 400 });
    }

    const parseResult = QualifyRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues[0]?.message || 'Invalid input', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const { username: cleanUsername, companyName } = parseResult.data;

    const [user, repos] = await Promise.all([
      fetchGitHubUser(cleanUsername),
      fetchUserRepos(cleanUsername),
    ]);

    const languages = await fetchLanguages(cleanUsername, repos);
    const { score } = calculateDeveloperScore(user, repos, languages);

    let outcome = buildQualificationResult(companyName, user, repos, languages, score);

    try {
      const aiQualification = await getOpenAICompanyQualification({
        user: {
          login: user.login,
          name: user.name,
          bio: user.bio,
          followers: user.followers,
          public_repos: user.public_repos,
          company: user.company,
        },
        score,
        breakdown: {
          repoScore: score,
          commitScore: score,
          languageScore: score,
          documentationScore: score,
          communityScore: score,
          total: score,
        },
        languages: languages.slice(0, 8).map((language) => ({ name: language.name, percentage: language.percentage })),
        topRepos: repos.slice(0, 6).map((repo) => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
        })),
        companyName,
      });

      if (aiQualification) {
        outcome = {
          company: aiQualification.company || companyName,
          probability: aiQualification.probability ?? outcome.probability,
          verdict: aiQualification.verdict || outcome.verdict,
          message: aiQualification.message || outcome.message,
        };
      }
    } catch (error) {
      console.warn('[Qualify API] AI company evaluation fallback:', error);
    }

    return NextResponse.json(outcome);
  } catch (error: unknown) {
    if (error instanceof GitHubNotFoundError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 404 });
    }
    if (error instanceof GitHubRateLimitError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 429 });
    }
    if (error instanceof GitHubError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : 'Company qualification failed';
    return NextResponse.json({ error: message, code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
