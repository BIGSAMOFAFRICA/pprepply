'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  FileText,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/analyze', icon: Search, label: 'Analyze' },
  { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Floating Pill Sidebar */}
      <aside className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center">
        <div className="bg-white/95 backdrop-blur-md border border-line rounded-pill p-3 shadow-floating flex flex-col items-center gap-6">
          {/* Logo Brand Icon */}
          <Link
            href="/dashboard"
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-pill hover:bg-primary-hover transition-colors"
            title="Preppy"
          >
            P
          </Link>

          {/* Navigation Pill Items */}
          <nav className="flex flex-col items-center gap-2">
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  title={label}
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 relative group',
                    active
                      ? 'bg-primary text-white shadow-pill'
                      : 'text-ink-muted hover:text-ink hover:bg-bg'
                  )}
                >
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                  {/* Tooltip on hover */}
                  <span className="absolute left-14 px-2.5 py-1 bg-ink text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-md">
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile / Tablet Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-md border border-line rounded-pill px-6 py-2.5 shadow-floating flex items-center justify-around">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-full transition-all text-xs font-medium min-h-[44px] justify-center',
                active ? 'text-primary' : 'text-ink-muted hover:text-ink'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  active && 'bg-primary-soft text-primary'
                )}
              >
                <Icon className="w-4 h-4 stroke-[1.8]" />
              </div>
              <span className="text-[11px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
