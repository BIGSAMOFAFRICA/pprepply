import {
  ActionPlanItem,
  CompanyMatch,
  CompanyQualification,
  GitHubUser,
  GitHubRepo,
  LanguageStat,
  ScoreBreakdown,
  Suggestion,
} from '@/types';

export const COMPANY_PIPELINE = [
  { name: 'Google', domain: 'google.com', logoUrl: 'https://logo.clearbit.com/google.com', stack: ['typescript', 'python', 'java', 'go', 'cloud', 'javascript'] },
  { name: 'Microsoft', domain: 'microsoft.com', logoUrl: 'https://logo.clearbit.com/microsoft.com', stack: ['typescript', 'python', 'csharp', 'azure', 'javascript', 'go'] },
  { name: 'Meta', domain: 'meta.com', logoUrl: 'https://logo.clearbit.com/meta.com', stack: ['javascript', 'typescript', 'python', 'react', 'graphql', 'android'] },
  { name: 'Amazon', domain: 'amazon.com', logoUrl: 'https://logo.clearbit.com/amazon.com', stack: ['java', 'javascript', 'python', 'aws', 'kubernetes', 'typescript'] },
  { name: 'Stripe', domain: 'stripe.com', logoUrl: 'https://logo.clearbit.com/stripe.com', stack: ['javascript', 'typescript', 'ruby', 'python', 'react'] },
  { name: 'GitHub', domain: 'github.com', logoUrl: 'https://logo.clearbit.com/github.com', stack: ['javascript', 'typescript', 'ruby', 'go', 'python', 'react'] },
  { name: 'Netflix', domain: 'netflix.com', logoUrl: 'https://logo.clearbit.com/netflix.com', stack: ['java', 'javascript', 'python', 'kubernetes', 'scala'] },
  { name: 'Linear', domain: 'linear.app', logoUrl: 'https://logo.clearbit.com/linear.app', stack: ['typescript', 'react', 'javascript', 'node', 'go'] },
];

export function calculateDeveloperScore(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageStat[]
): { score: number; breakdown: ScoreBreakdown } {
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);
  const repoCountScore = Math.min(repos.length / 30, 1) * 10;
  const starsScore = Math.min(totalStars / 100, 1) * 10;
  const forksScore = Math.min(totalForks / 50, 1) * 5;
  const repoScore = Math.round(repoCountScore + starsScore + forksScore);

  const recentRepos = repos.filter((r) => {
    const updated = new Date(r.updated_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return updated > sixMonthsAgo;
  });
  const commitScore = Math.round(Math.min(recentRepos.length / 15, 1) * 25);

  const langCount = languages.length;
  const languageScore = Math.round(Math.min(langCount / 8, 1) * 20);

  const reposWithReadme = repos.filter((r) => r.has_readme || r.description).length;
  const reposWithTopics = repos.filter((r) => r.topics && r.topics.length > 0).length;
  const docPct = repos.length > 0 ? reposWithReadme / repos.length : 0;
  const topicPct = repos.length > 0 ? reposWithTopics / repos.length : 0;
  const documentationScore = Math.round((docPct * 0.7 + topicPct * 0.3) * 20);

  const followerScore = Math.min(user.followers / 100, 1) * 5;
  const profileScore =
    (user.bio ? 1 : 0) * 2 + (user.blog ? 1 : 0) * 2 + (user.company ? 0.5 : 0);
  const communityScore = Math.round(followerScore + Math.min(profileScore, 5));

  const total = Math.min(
    repoScore + commitScore + languageScore + documentationScore + communityScore,
    100
  );

  return {
    score: total,
    breakdown: {
      repoScore: Math.min(repoScore, 25),
      commitScore: Math.min(commitScore, 25),
      languageScore: Math.min(languageScore, 20),
      documentationScore: Math.min(documentationScore, 20),
      communityScore: Math.min(communityScore, 10),
      total,
    },
  };
}

export function buildCompanyMatches(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageStat[],
  score: number
): CompanyMatch[] {
  const languageSet = new Set(languages.map((lang) => lang.name.toLowerCase()));
  const repoSignal = repos.map((repo) => `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase());

  const matches = COMPANY_PIPELINE.map((company) => {
    const matchedKeywords = company.stack.filter((keyword) => {
      return languageSet.has(keyword) || repoSignal.some((text) => text.includes(keyword));
    });

    const stackMatch = Math.min((matchedKeywords.length / company.stack.length) * 100, 100);
    const fitScore = Math.round((stackMatch * 0.6) + (score * 0.4));

    const reason = matchedKeywords.length > 0
      ? `Strong alignment with ${matchedKeywords.slice(0, 2).join(' + ')} and active project output.`
      : 'Solid enough profile to be considered if the portfolio is tightened up.';

    return {
      name: company.name,
      domain: company.domain,
      logoUrl: `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${company.domain}&size=128`,
      fitScore,
      reason,
    };
  }).filter((item) => item.fitScore >= 55)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4);

  if (matches.length === 0) {
    return [{
      name: 'GitHub',
      domain: 'github.com',
      logoUrl: `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://github.com&size=128`,
      fitScore: 60,
      reason: 'Your profile is showing early traction but needs clearer positioning and stronger proof points.',
    }];
  }

  return matches;
}

export function buildFallbackAIAnalysis(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageStat[],
  score: number,
  breakdown: ScoreBreakdown
): {
  summary: string;
  keyStrengths: string[];
  risks: string[];
  actionPlan: ActionPlanItem[];
  companyMatches: CompanyMatch[];
} {
  const companyMatches = buildCompanyMatches(user, repos, languages, score);
  const strongestLangs = languages.slice(0, 3).map((lang) => lang.name).join(', ');

  const summary = score >= 80
    ? `This profile looks strong enough to be taken seriously by product and platform teams. The work is technically credible, and the main issue is not skill depth but signal quality.`
    : score >= 60
      ? `The profile is solid but still reads as mid-level rather than elite. There is a real base here, but the portfolio needs sharper proof and stronger positioning.`
      : `This profile has potential, but it still needs a more consistent signal. The portfolio is not yet convincing enough to sell a high-end engineering story.`;

  const keyStrengths = [
    `Core stack is concentrated around ${strongestLangs || 'modern web tooling'}.`,
    repos.length > 4 ? `You have enough public work to demonstrate repeated output and iteration.` : 'The repository count is still limited, so quality matters more than quantity.',
    score >= 60 ? 'The profile has enough traction to be relevant to serious engineering hiring conversations.' : 'There is potential, but the overall proof needs to be tightened up.'
  ];

  const risks = [
    !user.bio ? 'No clear professional positioning in the bio yet.' : 'The bio is present, but it still needs sharper positioning.',
    repos.filter((repo) => !repo.description).length > 2 ? 'Several repos lack useful descriptions, which hides intent and weakens discovery.' : 'The documentation is mostly usable, but more polish would make the profile easier to trust.',
    breakdown.commitScore < 15 ? 'Recent activity is not strong enough to show sustained momentum.' : 'The activity level is decent, but consistent shipping is still the real differentiator.'
  ];

  const actionPlan: ActionPlanItem[] = [
    {
      title: 'Tighten the hiring narrative',
      description: 'Frame the profile around specific strengths and the problems you solve, not just raw repo count.',
      steps: [
        'Write a short bio that names your core stack and the type of products you build.',
        'Add top projects to a pinned profile section with clean descriptions.',
        'Link a portfolio or résumé so hiring managers can validate the story quickly.'
      ],
    },
    {
      title: 'Improve proof quality',
      description: 'The strongest candidates do not just code; they make the signal obvious.',
      steps: [
        'Write clear README files and add project screenshots or architecture summaries.',
        'Improve repository descriptions and metadata to explain value, not just tech names.',
        'Focus on one or two high-signal projects instead of a long list of unfinished work.'
      ],
    },
    {
      title: 'Increase momentum',
      description: 'Hiring teams reward sustained output and visible improvement over time.',
      steps: [
        'Ship one meaningful project every 2-4 weeks and keep it visible.',
        'Contribute to open-source or team projects to show collaboration and execution.',
        'Keep the contribution graph active with regular, purposeful commits.'
      ],
    }
  ];

  return {
    summary,
    keyStrengths,
    risks,
    actionPlan,
    companyMatches,
  };
}

export function buildQualificationResult(
  companyName: string,
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageStat[],
  score: number
): CompanyQualification {
  const languageCount = languages.length;
  const portfolioStrength = Math.min(40, repos.length * 2 + Math.min(user.followers, 30) * 0.3);
  const languageStrength = Math.min(25, languageCount * 4);
  const scoreStrength = Math.min(35, score * 0.35);
  const probability = Math.min(95, Math.max(15, Math.round(portfolioStrength + languageStrength + scoreStrength)));

  const verdict = probability >= 75
    ? 'Realistic shot'
    : probability >= 50
      ? 'Possible, but you need more polish'
      : 'Not realistic yet';

  const message = probability >= 75
    ? `This is a credible fit for ${companyName} if your portfolio, communication, and interview prep line up. The profile already has enough signal to be taken seriously.`
    : probability >= 50
      ? `The profile is not bad, but ${companyName} is still a stretch unless you sharpen the portfolio and show more production-level depth.`
      : `This is not a realistic target yet for ${companyName}. The profile still needs stronger proof, more polish, and a more convincing delivery story.`;

  return {
    company: companyName,
    probability,
    verdict,
    message,
  };
}

export function generateSuggestions(
  user: GitHubUser,
  repos: GitHubRepo[],
  breakdown: ScoreBreakdown
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (!user.bio) {
    suggestions.push({
      id: 'bio',
      category: 'profile',
      priority: 'high',
      title: 'Add a Professional Bio',
      description: 'Your GitHub profile is missing a bio. A compelling bio helps recruiters and collaborators understand who you are and what you do.',
      actionItems: [
        'Go to GitHub Settings → Profile',
        'Write 2-3 sentences about your expertise, interests, and what you\'re working on',
        'Include your tech stack or specialization',
      ],
    });
  }

  if (!user.blog) {
    suggestions.push({
      id: 'website',
      category: 'profile',
      priority: 'medium',
      title: 'Link Your Portfolio or Website',
      description: 'Adding a website/portfolio link to your GitHub profile increases your professional visibility.',
      actionItems: [
        'Build a portfolio site (try Vercel, Netlify, or GitHub Pages)',
        'Add the URL to your GitHub profile settings',
        'Include your best projects and contact information',
      ],
    });
  }

  const reposWithoutDesc = repos.filter((r) => !r.description).slice(0, 3);
  if (reposWithoutDesc.length > 2) {
    suggestions.push({
      id: 'descriptions',
      category: 'documentation',
      priority: 'high',
      title: 'Add Repository Descriptions',
      description: `${reposWithoutDesc.length} repositories lack descriptions. Descriptions are the first thing people read and significantly improve discoverability.`,
      actionItems: reposWithoutDesc.map((r) => `Add description to "${r.name}"`).concat([
        'Use action verbs: "A React dashboard for...", "CLI tool that..."',
      ]),
    });
  }

  const reposWithoutTopics = repos.filter((r) => !r.topics || r.topics.length === 0);
  if (reposWithoutTopics.length > repos.length * 0.5) {
    suggestions.push({
      id: 'topics',
      category: 'documentation',
      priority: 'medium',
      title: 'Add Repository Topics',
      description: 'Topics make your repositories discoverable in GitHub searches. Add relevant tags to improve your profile\'s reach.',
      actionItems: [
        'Click on a repository → click the gear icon next to "About"',
        'Add 3-5 relevant topics (e.g., "react", "typescript", "open-source")',
        'Use standard technology names as topics',
      ],
    });
  }

  const recentRepos = repos.filter((r) => {
    const updated = new Date(r.updated_at);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return updated > threeMonthsAgo;
  });

  if (recentRepos.length < 3) {
    suggestions.push({
      id: 'activity',
      category: 'activity',
      priority: 'high',
      title: 'Increase Contribution Activity',
      description: 'Your recent activity is low. Consistent contributions signal active engagement and keep your profile visible to recruiters.',
      actionItems: [
        'Commit to contributing at least 3-4 times per week',
        'Work on open-source projects or create new ones',
        'Pin your best 6 repositories to your profile',
        'Enable the contribution graph on your profile',
      ],
    });
  }

  if (breakdown.languageScore < 10) {
    suggestions.push({
      id: 'diversity',
      category: 'diversity',
      priority: 'medium',
      title: 'Diversify Your Tech Stack',
      description: 'A broader language portfolio demonstrates versatility. Consider exploring adjacent technologies.',
      actionItems: [
        'Try building a project in a language adjacent to your primary stack',
        'Explore infrastructure as code (Terraform, Docker)',
        'Contribute to open-source projects in different languages',
      ],
    });
  }

  if (user.followers < 20 && repos.length > 5) {
    suggestions.push({
      id: 'community',
      category: 'community',
      priority: 'low',
      title: 'Grow Your GitHub Following',
      description: 'Building a community around your work amplifies your professional reach.',
      actionItems: [
        'Share your projects on Twitter/X and LinkedIn',
        'Write blog posts or tutorials about things you\'ve built',
        'Engage with others by reviewing PRs in open-source projects',
        'Create a GitHub profile README to showcase your work',
      ],
    });
  }

  const hasProfileReadme = repos.some((r) => r.name === user.login);
  if (!hasProfileReadme) {
    suggestions.push({
      id: 'profile-readme',
      category: 'profile',
      priority: 'medium',
      title: 'Create a Profile README',
      description: 'A GitHub profile README is prime real estate. It\'s the first thing visitors see and can powerfully showcase your brand.',
      actionItems: [
        `Create a new repository named "${user.login}"`,
        'Add a README.md with your skills, projects, and contact info',
        'Include badges, stats widgets, or project showcases',
        'Tools: github-readme-stats, shields.io, readme.so',
      ],
    });
  }

  return suggestions.slice(0, 6);
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Elite', color: '#00E5A0' };
  if (score >= 70) return { label: 'Advanced', color: '#22D3EE' };
  if (score >= 55) return { label: 'Proficient', color: '#818CF8' };
  if (score >= 40) return { label: 'Developing', color: '#FBBF24' };
  return { label: 'Beginner', color: '#F87171' };
}
