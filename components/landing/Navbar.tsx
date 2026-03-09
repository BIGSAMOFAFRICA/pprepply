'use client';
import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-xl border-b border-white/[0.06]' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-bg font-bold text-sm font-mono">P</span>
          </div>
          <span className="font-bold text-text-primary text-lg tracking-tight">
            Preppy
            <span className="text-accent ml-0.5">.</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-text-primary transition-colors">How it works</Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
