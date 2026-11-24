'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Bell, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader() {
  const { user } = useUser();
  const firstName = user?.firstName || 'Developer';

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
          {greeting}, {firstName} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
          Here is your GitHub portfolio health and intelligence breakdown.
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <Link
          href="/dashboard/analyze"
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-line bg-white text-xs font-medium text-ink hover:bg-bg transition-colors shadow-soft"
        >
          <Search className="w-3.5 h-3.5 text-ink-muted" />
          <span>Search profile</span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-subtle text-[10px] text-ink-muted font-mono border border-line">⌘K</kbd>
        </Link>

        {/* Notifications Icon Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-xl bg-white border border-line text-ink-muted hover:text-ink hover:bg-bg flex items-center justify-center transition-colors shadow-soft"
        >
          <Bell className="w-4 h-4 stroke-[1.8]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
        </button>

        {/* User profile controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-line">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-line shadow-soft">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 rounded-lg',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
