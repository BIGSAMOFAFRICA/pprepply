'use client';
import Link from 'next/link';
import { ArrowRight, Github, Sparkles, BarChart3, Zap } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const STATS = [
  { value: '10K+', label: 'Profiles Analyzed' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '50+', label: 'Metrics Tracked' },
  { value: '< 30s', label: 'Analysis Time' },
];

export default function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      {/* Background grid + glows */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
      <div className="absolute inset-0 bg-glow-accent" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-glow-cyan" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent-glow blur-3xl opacity-30" />

      {/* Badge */}
      <div className="relative z-10 animate-fade-up mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent-subtle text-accent text-sm font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Developer Intelligence</span>
        </div>
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-up delay-100">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-6">
          <span className="text-text-primary block">Decode Your</span>
          <span className="shimmer-text block">GitHub DNA</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
          Transform your GitHub profile into actionable insights. Get your Developer Score, 
          analyze contributions, and level up your portfolio.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-10 animate-fade-up delay-200">
        <Link
          href={isSignedIn ? '/dashboard' : '/sign-up'}
          className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold"
        >
          Analyze My Profile
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="#features"
          className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-medium text-text-primary border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
        >
          See How It Works
        </Link>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-full max-w-3xl animate-fade-up delay-300">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-accent font-mono mb-1">{stat.value}</div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Terminal Preview */}
      <div className="relative z-10 mt-16 w-full max-w-2xl animate-fade-up delay-400">
        <div className="card-glass rounded-2xl overflow-hidden shadow-glow-md border border-white/[0.06]">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            <div className="ml-3 flex-1 text-center">
              <span className="text-xs text-text-muted font-mono">preppy analyze</span>
            </div>
          </div>
          <div className="p-6 font-mono text-sm space-y-2">
            <div className="text-text-secondary">
              <span className="text-accent">$</span> preppy analyze <span className="text-cyan-accent">torvalds</span>
            </div>
            <div className="text-text-muted">→ Fetching GitHub profile...</div>
            <div className="text-text-muted">→ Analyzing 228 repositories...</div>
            <div className="text-text-muted">→ Processing language distribution...</div>
            <div className="text-text-muted">→ Calculating Developer Score...</div>
            <div className="mt-3 p-3 rounded-lg bg-accent-subtle border border-accent/20">
              <div className="text-accent font-semibold">✓ Analysis complete!</div>
              <div className="text-text-secondary mt-1">
                Developer Score: <span className="text-accent font-bold text-lg">94</span>
                <span className="ml-2 text-accent/60 text-xs">/ 100 · Elite</span>
              </div>
            </div>
          </div>
        </div>
        {/* Glow effect under terminal */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-accent/10 blur-2xl rounded-full" />
      </div>
    </section>
  );
}
