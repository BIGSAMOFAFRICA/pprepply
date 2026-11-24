import { GitHubUser, GitHubRepo, LanguageStat, ContributionData } from '@/types';
import {
  GitHubError,
  GitHubNotFoundError,
  GitHubRateLimitError,
  GitHubAuthError,
  GitHubTimeoutError,
} from './errors';
import { GitHubUserSchema, GitHubRepoSchema } from './github-schema';

const GITHUB_API = 'https://api.github.com';
const TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;

// In-memory cache for profiles and repos to protect rate limits across duplicate requests
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T, ttlMs = CACHE_TTL_MS) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  // Limit cache size to prevent memory bloat
  if (cache.size > 500) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Solidity: '#AA6746',
  R: '#198CE7',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
};

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Preppy-GitHub-Analyzer/1.0',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }
  return headers;
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Concurrency pool helper to run async tasks with a maximum concurrency limit
async function mapConcurrent<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      try {
        results[idx] = await fn(items[idx]);
      } catch (err) {
        // Log individual item error without failing the whole batch
        console.warn(`[GitHub Worker] Item ${idx} failed:`, err);
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results.filter(Boolean);
}

export async function ghFetch<T>(path: string, options: { bypassCache?: boolean } = {}): Promise<T> {
  const cacheKey = `gh:${path}`;
  if (!options.bypassCache) {
    const cached = getCached<T>(cacheKey);
    if (cached) return cached;
  }

  const url = `${GITHUB_API}${path}`;
  const headers = getHeaders();

  let attempt = 0;
  while (attempt <= MAX_RETRIES) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Handle rate limits (403 or 429)
      if (res.status === 403 || res.status === 429) {
        const remaining = res.headers.get('x-ratelimit-remaining');
        const resetHeader = res.headers.get('x-ratelimit-reset');
        const retryAfterHeader = res.headers.get('retry-after');

        const resetEpoch = resetHeader ? parseInt(resetHeader, 10) : null;
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;

        if (remaining === '0' || resetEpoch || retryAfter) {
          throw new GitHubRateLimitError(resetEpoch, retryAfter);
        }

        // Secondary rate limit or abuse detection often responds 403 with specific message
        const bodyText = await res.text().catch(() => '');
        if (bodyText.includes('rate limit') || bodyText.includes('secondary rate limit')) {
          throw new GitHubRateLimitError(resetEpoch, retryAfter);
        }
        throw new GitHubError(`GitHub access forbidden: ${bodyText || 'Permission denied'}`, 403, 'FORBIDDEN');
      }

      if (res.status === 401) {
        throw new GitHubAuthError();
      }

      if (res.status === 404) {
        throw new GitHubNotFoundError();
      }

      if (res.status === 401) {
        throw new GitHubAuthError();
      }

      // Retry on transient 5xx server errors
      if (res.status >= 500 && attempt <= MAX_RETRIES) {
        console.warn(`[GitHub API] 5xx error (${res.status}) on attempt ${attempt}. Retrying...`);
        const jitter = Math.random() * 200;
        await wait(500 * Math.pow(2, attempt) + jitter);
        continue;
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new GitHubError(`GitHub API error (${res.status}): ${errorText}`, res.status, 'API_ERROR');
      }

      const json = await res.json();
      setCached(cacheKey, json);
      return json as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof GitHubError) {
        throw err;
      }

      if (err instanceof Error && err.name === 'AbortError') {
        if (attempt <= MAX_RETRIES) {
          console.warn(`[GitHub API] Request timed out on attempt ${attempt}. Retrying...`);
          await wait(500 * attempt);
          continue;
        }
        throw new GitHubTimeoutError();
      }

      // Network disconnect / DNS failure
      if (attempt <= MAX_RETRIES) {
        await wait(500 * attempt);
        continue;
      }

      throw new GitHubError(
        err instanceof Error ? err.message : 'Failed to connect to GitHub API',
        500,
        'NETWORK_ERROR'
      );
    }
  }

  throw new GitHubError('Exceeded maximum retry attempts', 500, 'MAX_RETRIES_EXCEEDED');
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const cleanUsername = encodeURIComponent(username.trim().replace(/^@/, ''));
  const rawData = await ghFetch<unknown>(`/users/${cleanUsername}`);
  const parsed = GitHubUserSchema.safeParse(rawData);
  if (!parsed.success) {
    console.warn('[GitHub API] User schema validation warning:', parsed.error.issues);
    return rawData as GitHubUser;
  }
  return parsed.data as GitHubUser;
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const cleanUsername = encodeURIComponent(username.trim().replace(/^@/, ''));
  const repos: GitHubRepo[] = [];
  let page = 1;
  const maxPages = 4; // Fetch up to 400 repos (plenty of signal, avoids secondary rate limits)

  while (page <= maxPages) {
    try {
      const data = await ghFetch<unknown[]>(
        `/users/${cleanUsername}/repos?per_page=100&page=${page}&sort=updated`
      );
      if (!Array.isArray(data) || data.length === 0) break;

      for (const item of data) {
        const parsed = GitHubRepoSchema.safeParse(item);
        if (parsed.success) {
          repos.push(parsed.data as GitHubRepo);
        } else {
          repos.push(item as GitHubRepo);
        }
      }

      if (data.length < 100) break;
      page++;
    } catch (err) {
      if (repos.length > 0) {
        // If we already have some repos, return what we have instead of failing completely
        console.warn(`[GitHub API] Error on page ${page}, returning ${repos.length} accumulated repos:`, err);
        break;
      }
      throw err;
    }
  }

  // Filter out forks for authentic developer score analysis
  return repos.filter((r) => !r.fork);
}

export async function fetchLanguages(username: string, repos: GitHubRepo[]): Promise<LanguageStat[]> {
  const cleanUsername = encodeURIComponent(username.trim().replace(/^@/, ''));
  // Focus on top 12 active / starred repositories to stay well within secondary rate limits
  const topRepos = repos.slice(0, 12);
  const langBytes: Record<string, number> = {};

  // Run with concurrency limit of 3 to avoid GitHub secondary rate limiting
  await mapConcurrent(topRepos, 3, async (repo) => {
    try {
      const encodedRepo = encodeURIComponent(repo.name);
      const data = await ghFetch<Record<string, number>>(`/repos/${cleanUsername}/${encodedRepo}/languages`);
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([lang, bytes]) => {
          if (typeof bytes === 'number') {
            langBytes[lang] = (langBytes[lang] || 0) + bytes;
          }
        });
      }
    } catch (err) {
      // Swallowing individual repo language fetch failure gracefully
      console.warn(`[GitHub API] Could not fetch languages for ${repo.name}:`, err);
    }
  });

  const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
  if (total === 0) {
    // Fallback: estimate from repo primary language if languages endpoint didn't yield bytes
    const langCounts: Record<string, number> = {};
    for (const r of repos) {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    }
    const countTotal = Object.values(langCounts).reduce((a, b) => a + b, 0);
    if (countTotal === 0) return [];
    return Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        bytes: count * 10000,
        percentage: Math.round((count / countTotal) * 100 * 10) / 10,
        color: LANG_COLORS[name] || '#6B7089',
      }));
  }

  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 100 * 10) / 10,
      color: LANG_COLORS[name] || '#6B7089',
    }));
}

export async function fetchContributions(username: string): Promise<ContributionData[]> {
  const cleanUsername = encodeURIComponent(username.trim().replace(/^@/, ''));
  try {
    const events = await ghFetch<Array<{ created_at?: string; type?: string }>>(
      `/users/${cleanUsername}/events/public?per_page=100`
    );
    const countByDate: Record<string, number> = {};

    if (Array.isArray(events)) {
      events.forEach((event) => {
        if (
          event?.created_at &&
          ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'CommitCommentEvent'].includes(
            event.type || ''
          )
        ) {
          const date = event.created_at.split('T')[0];
          countByDate[date] = (countByDate[date] || 0) + 1;
        }
      });
    }

    // Generate last 90 days series
    const result: ContributionData[] = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({ date: dateStr, count: countByDate[dateStr] || 0 });
    }
    return result;
  } catch (err) {
    console.warn(`[GitHub API] Could not fetch public events for ${username}:`, err);
    // Return flat empty series so graph still renders gracefully without crashing
    const result: ContributionData[] = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push({ date: d.toISOString().split('T')[0], count: 0 });
    }
    return result;
  }
}

export function getLangColor(lang: string): string {
  return LANG_COLORS[lang] || '#6B7089';
}

export function clearGitHubCache() {
  cache.clear();
}
