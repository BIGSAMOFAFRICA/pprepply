import { z } from 'zod';

export const GitHubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable().optional(),
  avatar_url: z.string(),
  bio: z.string().nullable().optional(),
  public_repos: z.number().default(0),
  followers: z.number().default(0),
  following: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
  html_url: z.string(),
  blog: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string().optional().default(''),
  description: z.string().nullable().optional(),
  html_url: z.string(),
  stargazers_count: z.number().default(0),
  forks_count: z.number().default(0),
  language: z.string().nullable().optional(),
  topics: z.array(z.string()).optional().default([]),
  updated_at: z.string(),
  created_at: z.string().optional().default(new Date().toISOString()),
  size: z.number().optional().default(0),
  has_readme: z.boolean().optional().default(false),
  default_branch: z.string().optional().default('main'),
  open_issues_count: z.number().optional().default(0),
  fork: z.boolean().default(false),
});

export const AnalyzeRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username cannot be empty')
    .max(39, 'GitHub usernames cannot exceed 39 characters')
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, 'Invalid GitHub username format'),
  save: z.boolean().optional().default(false),
});

export const QualifyRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username cannot be empty')
    .max(39, 'GitHub usernames cannot exceed 39 characters'),
  companyName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(100, 'Company name is too long'),
});
