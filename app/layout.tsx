import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Preppy — GitHub Profile & Portfolio Analyzer',
  description: 'Clean developer portfolio intelligence. Understand your code activity, track developer scores, and improve hiring outcomes.',
  keywords: ['github', 'developer', 'portfolio', 'analyzer', 'coding', 'profile'],
  openGraph: {
    title: 'Preppy — GitHub Profile Analyzer',
    description: 'Understand your GitHub profile with actionable developer metrics',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-[#F6F5FB] text-[#1F2340] selection:bg-[#ECEBFA] selection:text-[#5B5BD6]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
