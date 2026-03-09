import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Preppy — GitHub Profile Analyzer',
  description: 'Analyze your GitHub profile, understand your coding activity, and get actionable insights to improve your developer portfolio.',
  keywords: ['github', 'developer', 'portfolio', 'analyzer', 'coding', 'profile'],
  openGraph: {
    title: 'Preppy — GitHub Profile Analyzer',
    description: 'Analyze your GitHub profile and get a Developer Score',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
