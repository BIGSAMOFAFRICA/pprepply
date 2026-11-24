import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeveloperScore, getScoreLabel, generateSuggestions } from '../lib/scoring';
import { GitHubUser, GitHubRepo, LanguageStat } from '../types';

const mockUser: GitHubUser = {
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://avatars.githubusercontent.com/u/583231',
  bio: 'GitHub mascot',
  public_repos: 8,
  followers: 4500,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
  updated_at: '2024-01-01T00:00:00Z',
  html_url: 'https://github.com/octocat',
  blog: 'https://github.blog',
  company: '@github',
  location: 'San Francisco',
};

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'Spoon-Knife',
    full_name: 'octocat/Spoon-Knife',
    description: 'This repo is for spoon-knife practice',
    html_url: 'https://github.com/octocat/Spoon-Knife',
    stargazers_count: 12000,
    forks_count: 14000,
    language: 'HTML',
    topics: ['git', 'starter'],
    updated_at: new Date().toISOString(),
    created_at: '2011-01-25T18:44:36Z',
    size: 100,
    has_readme: true,
    default_branch: 'main',
    open_issues_count: 2,
    fork: false,
  },
  {
    id: 2,
    name: 'octocat.github.io',
    full_name: 'octocat/octocat.github.io',
    description: 'Personal web page',
    html_url: 'https://github.com/octocat/octocat.github.io',
    stargazers_count: 500,
    forks_count: 200,
    language: 'TypeScript',
    topics: ['portfolio'],
    updated_at: new Date().toISOString(),
    created_at: '2013-01-01T00:00:00Z',
    size: 200,
    has_readme: true,
    default_branch: 'master',
    open_issues_count: 0,
    fork: false,
  },
];

const mockLanguages: LanguageStat[] = [
  { name: 'TypeScript', bytes: 50000, percentage: 60, color: '#3178c6' },
  { name: 'HTML', bytes: 30000, percentage: 40, color: '#e34c26' },
];

test('calculateDeveloperScore returns expected score structure and bounds', () => {
  const result = calculateDeveloperScore(mockUser, mockRepos, mockLanguages);
  assert.ok(result.score >= 0 && result.score <= 100, 'Score must be between 0 and 100');
  assert.ok(result.breakdown.repoScore <= 25, 'Repo score max 25');
  assert.ok(result.breakdown.commitScore <= 25, 'Commit score max 25');
  assert.ok(result.breakdown.languageScore <= 20, 'Language score max 20');
  assert.ok(result.breakdown.documentationScore <= 20, 'Doc score max 20');
  assert.ok(result.breakdown.communityScore <= 10, 'Community score max 10');
});

test('calculateDeveloperScore handles empty repos and languages without crashing', () => {
  const emptyUser: GitHubUser = { ...mockUser, public_repos: 0, followers: 0, bio: null, blog: null, company: null };
  const result = calculateDeveloperScore(emptyUser, [], []);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.breakdown.total, 0);
});

test('getScoreLabel returns proper tier and color', () => {
  const elite = getScoreLabel(95);
  assert.strictEqual(elite.label, 'Elite');
  const advanced = getScoreLabel(80);
  assert.strictEqual(advanced.label, 'Advanced');
  const beginner = getScoreLabel(35);
  assert.strictEqual(beginner.label, 'Beginner');
});

test('generateSuggestions produces actionable recommendations', () => {
  const emptyUser: GitHubUser = { ...mockUser, bio: null, blog: null };
  const suggestions = generateSuggestions(emptyUser, [], {
    repoScore: 0,
    commitScore: 0,
    languageScore: 0,
    documentationScore: 0,
    communityScore: 0,
    total: 0,
  });
  assert.ok(Array.isArray(suggestions));
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions[0].actionItems.length > 0);
});
