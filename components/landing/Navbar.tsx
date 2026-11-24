'use client';

import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-line shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo with priority loading */}
        <Logo variant="full" size="md" priority />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-ink-muted">
          <Link href="#features" className="hover:text-ink transition-colors">Features</Link>
          <Link href="/dashboard" className="hover:text-ink transition-colors">Analyzer</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
