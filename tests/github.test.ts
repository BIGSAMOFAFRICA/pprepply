import test from 'node:test';
import assert from 'node:assert/strict';
import { AnalyzeRequestSchema, QualifyRequestSchema } from '../lib/github-schema';
import {
  GitHubError,
  GitHubNotFoundError,
  GitHubRateLimitError,
  GitHubTimeoutError,
} from '../lib/errors';

test('AnalyzeRequestSchema validates good usernames', () => {
  const valid1 = AnalyzeRequestSchema.safeParse({ username: 'torvalds' });
  assert.ok(valid1.success);
  assert.strictEqual(valid1.data.username, 'torvalds');

  const valid2 = AnalyzeRequestSchema.safeParse({ username: 'gaearon', save: true });
  assert.ok(valid2.success);
  assert.strictEqual(valid2.data.save, true);
});

test('AnalyzeRequestSchema rejects invalid usernames', () => {
  const empty = AnalyzeRequestSchema.safeParse({ username: '' });
  assert.strictEqual(empty.success, false);

  const spaces = AnalyzeRequestSchema.safeParse({ username: '   ' });
  assert.strictEqual(spaces.success, false);

  const invalidChars = AnalyzeRequestSchema.safeParse({ username: 'user name!@#' });
  assert.strictEqual(invalidChars.success, false);
});

test('QualifyRequestSchema validates company qualification input', () => {
  const valid = QualifyRequestSchema.safeParse({ username: 'shadcn', companyName: 'Vercel' });
  assert.ok(valid.success);

  const missingCompany = QualifyRequestSchema.safeParse({ username: 'shadcn', companyName: '' });
  assert.strictEqual(missingCompany.success, false);
});

test('GitHubRateLimitError formats reset epoch into human friendly minutes', () => {
  const inTenMinutes = Math.floor(Date.now() / 1000) + 600;
  const rateLimitErr = new GitHubRateLimitError(inTenMinutes, null);
  assert.strictEqual(rateLimitErr.statusCode, 429);
  assert.strictEqual(rateLimitErr.code, 'RATE_LIMIT_EXCEEDED');
  assert.ok(rateLimitErr.message.includes('minute'));
});

test('GitHubNotFoundError returns 404 status and friendly message', () => {
  const notFound = new GitHubNotFoundError('User');
  assert.strictEqual(notFound.statusCode, 404);
  assert.strictEqual(notFound.code, 'NOT_FOUND');
  assert.ok(notFound.message.includes('not found'));
});

test('GitHubTimeoutError returns 504 status and friendly message', () => {
  const timeout = new GitHubTimeoutError();
  assert.strictEqual(timeout.statusCode, 504);
  assert.strictEqual(timeout.code, 'TIMEOUT');
});
