import { GitHubUser, GitHubRepo, LanguageStat, ScoreBreakdown, Suggestion } from '@/types';

export function calculateDeveloperScore(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageStat[]
): { score: number; breakdown: ScoreBreakdown } {
  // Repo score (0-25): based on repo count, stars, forks
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);
  const repoCountScore = Math.min(repos.length / 30, 1) * 10;
  const starsScore = Math.min(totalStars / 100, 1) * 10;
  const forksScore = Math.min(totalForks / 50, 1) * 5;
  const repoScore = Math.round(repoCountScore + starsScore + forksScore);

  // Activity score (0-25): recent commits / updates
  const recentRepos = repos.filter((r) => {
    const updated = new Date(r.updated_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return updated > sixMonthsAgo;
  });
  const commitScore = Math.round(Math.min(recentRepos.length / 15, 1) * 25);

  // Language diversity (0-20)
  const langCount = languages.length;
  const languageScore = Math.round(Math.min(langCount / 8, 1) * 20);

  // Documentation score (0-20): READMEs, descriptions, topics
  const reposWithReadme = repos.filter((r) => r.has_readme || r.description).length;
  const reposWithTopics = repos.filter((r) => r.topics && r.topics.length > 0).length;
  const docPct = repos.length > 0 ? reposWithReadme / repos.length : 0;
  const topicPct = repos.length > 0 ? reposWithTopics / repos.length : 0;
  const documentationScore = Math.round((docPct * 0.7 + topicPct * 0.3) * 20);

  // Community score (0-10): followers, bio, blog
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

export function generateSuggestions(
  user: GitHubUser,
  repos: GitHubRepo[],
  breakdown: ScoreBreakdown
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Profile suggestions
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

  // Documentation suggestions
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

  // Topics/tags
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

  // Activity suggestions
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

  // Language diversity
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

  // Community
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

  // Profile README
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
