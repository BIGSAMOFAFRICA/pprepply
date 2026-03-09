import { GitHubUser, GitHubRepo, LanguageStat, ContributionData } from '@/types';

const GITHUB_API = 'https://api.github.com';
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  C: '#555555', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
  Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Vue: '#41b883', Solidity: '#AA6746', R: '#198CE7',
  Scala: '#c22d40', Elixir: '#6e4a7e', Haskell: '#5e5086',
};

function getHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function ghFetch(path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('GitHub user not found');
    if (res.status === 403) throw new Error('GitHub API rate limit exceeded');
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return ghFetch(`/users/${username}`);
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  while (page <= 5) {
    const data = await ghFetch(`/users/${username}/repos?per_page=100&page=${page}&sort=updated`);
    if (!data.length) break;
    repos.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return repos.filter((r: GitHubRepo) => !r.fork);
}

export async function fetchLanguages(username: string, repos: GitHubRepo[]): Promise<LanguageStat[]> {
  const topRepos = repos.slice(0, 20);
  const langBytes: Record<string, number> = {};

  await Promise.all(
    topRepos.map(async (repo) => {
      try {
        const data = await ghFetch(`/repos/${username}/${repo.name}/languages`);
        Object.entries(data).forEach(([lang, bytes]) => {
          langBytes[lang] = (langBytes[lang] || 0) + (bytes as number);
        });
      } catch {}
    })
  );

  const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 100 * 10) / 10,
      color: LANG_COLORS[name] || '#8899AA',
    }));
}

export async function fetchContributions(username: string): Promise<ContributionData[]> {
  // Use the contributions API via GitHub GraphQL or approximate via events
  try {
    const events = await ghFetch(`/users/${username}/events/public?per_page=100`);
    const countByDate: Record<string, number> = {};
    
    events.forEach((event: { created_at: string; type: string }) => {
      if (['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
        const date = event.created_at.split('T')[0];
        countByDate[date] = (countByDate[date] || 0) + 1;
      }
    });

    // Generate last 90 days
    const result: ContributionData[] = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result.push({ date: dateStr, count: countByDate[dateStr] || 0 });
    }
    return result;
  } catch {
    return [];
  }
}

export function getLangColor(lang: string): string {
  return LANG_COLORS[lang] || '#8899AA';
}
