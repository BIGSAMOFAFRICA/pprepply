import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchGitHubUser, fetchUserRepos, fetchLanguages } from '@/lib/github';
import { calculateDeveloperScore, buildQualificationResult } from '@/lib/scoring';
import { getOpenAICompanyQualification } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, companyName } = await req.json();
    if (!username || !companyName) {
      return NextResponse.json({ error: 'Username and company name are required' }, { status: 400 });
    }

    const cleanUsername = String(username).trim().replace(/^@/, '');
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
      console.warn('OpenAI company evaluation unavailable.', error);
    }

    return NextResponse.json(outcome);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Company qualification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
