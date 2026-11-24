import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function checkRequiredEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    missing.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }
  if (!process.env.CLERK_SECRET_KEY) {
    missing.push('CLERK_SECRET_KEY');
  }
  return {
    valid: missing.length === 0,
    missing,
  };
}
