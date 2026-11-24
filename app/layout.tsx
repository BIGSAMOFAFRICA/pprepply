import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#5B5BD6',
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Preppy — GitHub Profile & Portfolio Analyzer',
  description: 'Clean developer portfolio intelligence. Understand your code activity, track developer scores, and improve hiring outcomes.',
  keywords: ['github', 'developer', 'portfolio', 'analyzer', 'coding', 'profile'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo/logo.jpg', sizes: 'any' },
    ],
    apple: [
      { url: '/logo/logo.jpg', sizes: '180x180' },
    ],
    shortcut: '/logo/logo.jpg',
  },
  openGraph: {
    title: 'Preppy — GitHub Profile Analyzer',
    description: 'Understand your GitHub profile with actionable developer metrics',
    type: 'website',
    images: [
      {
        url: '/logo/logo.jpg',
        width: 1264,
        height: 848,
        alt: 'Preppy — GitHub Profile Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preppy — GitHub Profile Analyzer',
    description: 'Understand your GitHub profile with actionable developer metrics',
    images: ['/logo/logo.jpg'],
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
