'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee } from 'lucide-react';
import DonationModal from '@/components/DonationModal';

export default function CTA() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-glow-accent opacity-50" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Ready to see your{' '}
            <span className="shimmer-text">Developer Score?</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers who use Preppy to understand and improve their GitHub presence.
            Your first analysis is free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-text-primary border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all font-medium"
            >
              <Coffee className="w-4 h-4" />
              Support Preppy
            </button>
          </div>
          <p className="text-text-muted text-sm">No credit card required • Instant setup</p>
        </div>
      </section>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </>
  );
}
