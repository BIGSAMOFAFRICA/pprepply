export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  blog: string | null;
  company: string | null;
  location: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  size: number;
  has_readme: boolean;
  default_branch: string;
  open_issues_count: number;
  fork: boolean;
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface RepoInsight {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  url: string;
  updatedAt: string;
  hasReadme: boolean;
  topics: string[];
}

export interface ContributionData {
  date: string;
  count: number;
}

export interface ScoreBreakdown {
  repoScore: number;
  commitScore: number;
  languageScore: number;
  documentationScore: number;
  communityScore: number;
  total: number;
}

export interface Suggestion {
  id: string;
  category: 'documentation' | 'activity' | 'diversity' | 'community' | 'profile';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
}

export interface ActionPlanItem {
  title: string;
  description: string;
  steps: string[];
}

export interface CompanyMatch {
  name: string;
  domain: string;
  logoUrl: string;
  fitScore: number;
  reason: string;
}

export interface CompanyQualification {
  company: string;
  probability: number;
  verdict: string;
  message: string;
}

export interface AnalysisResult {
  user: GitHubUser;
  languages: LanguageStat[];
  topRepos: RepoInsight[];
  contributions: ContributionData[];
  scoreBreakdown: ScoreBreakdown;
  developerScore: number;
  suggestions: Suggestion[];
  totalStars: number;
  totalForks: number;
  aiSummary: string;
  keyStrengths: string[];
  risks: string[];
  actionPlan: ActionPlanItem[];
  companyMatches: CompanyMatch[];
  companyQualification?: CompanyQualification;
}

export interface SavedReport {
  id: string;
  githubUsername: string;
  avatarUrl: string | null;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  developerScore: number;
  scoreBreakdown: ScoreBreakdown | null;
  languages: LanguageStat[] | null;
  topRepos: RepoInsight[] | null;
  contributions: ContributionData[] | null;
  suggestions: Suggestion[] | null;
  aiSummary?: string | null;
  keyStrengths?: string[] | null;
  risks?: string[] | null;
  actionPlan?: ActionPlanItem[] | null;
  companyMatches?: CompanyMatch[] | null;
  companyQualification?: CompanyQualification | null;
  createdAt: string;
}
