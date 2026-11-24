export class GitHubError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code = 'GITHUB_ERROR', details?: unknown) {
    super(message);
    this.name = 'GitHubError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class GitHubNotFoundError extends GitHubError {
  constructor(entity: string = 'User') {
    super(`GitHub ${entity.toLowerCase()} not found. Please verify the username.`, 404, 'NOT_FOUND');
    this.name = 'GitHubNotFoundError';
  }
}

export class GitHubRateLimitError extends GitHubError {
  resetAt?: string;
  retryAfterSeconds?: number;

  constructor(resetEpochSeconds?: number | null, retryAfterSeconds?: number | null) {
    let message = 'GitHub API rate limit exceeded.';
    let resetDateStr: string | undefined;

    if (resetEpochSeconds) {
      const resetDate = new Date(resetEpochSeconds * 1000);
      resetDateStr = resetDate.toISOString();
      const diffMinutes = Math.max(1, Math.ceil((resetDate.getTime() - Date.now()) / 60000));
      message = `GitHub API rate limit reached. Please wait ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} before retrying.`;
    } else if (retryAfterSeconds) {
      message = `GitHub API rate limit reached. Please retry in ${retryAfterSeconds} seconds.`;
    }

    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'GitHubRateLimitError';
    this.resetAt = resetDateStr;
    this.retryAfterSeconds = retryAfterSeconds || undefined;
  }
}

export class GitHubAuthError extends GitHubError {
  constructor(message = 'GitHub API authorization failed. Check your token scopes.') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'GitHubAuthError';
  }
}

export class GitHubTimeoutError extends GitHubError {
  constructor(message = 'GitHub API request timed out. Please try again.') {
    super(message, 504, 'TIMEOUT');
    this.name = 'GitHubTimeoutError';
  }
}
