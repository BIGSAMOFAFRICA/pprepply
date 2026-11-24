'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';

const STATS = [
  { value: '10K+', label: 'Profiles Evaluated' },
  { value: '96%', label: 'Signal Accuracy' },
  { value: '5 Dimensions', label: 'Score Breakdown' },
  { value: '< 5s', label: 'Instant Audit' },
];

export default function Hero() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-28 pb-16 bg-[#F6F5FB]">
      {/* Soft badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Objective GitHub Portfolio Intelligence</span>
      </div>

      {/* Main Headline */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink tracking-tight leading-tight mb-4">
          Know how engineering teams read your <span className="text-primary">GitHub</span>.
        </h1>
        <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto">
          Get an algorithmic Developer Score, language concentration analysis, and actionable steps to turn your profile into a hiring asset.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-16">
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button variant="primary" size="lg" className="gap-2 px-8">
            Analyze My Profile
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg" className="px-6">
            Explore Metrics
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-line text-center shadow-soft">
            <div className="text-xl sm:text-2xl font-bold text-ink tabular-nums">{stat.value}</div>
            <div className="text-xs text-ink-muted mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
