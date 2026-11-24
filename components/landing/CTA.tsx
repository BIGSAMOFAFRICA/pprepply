'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee } from 'lucide-react';
import DonationModal from '@/components/DonationModal';
import { Button } from '@/components/ui/Button';

export default function CTA() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <>
      <section className="py-24 px-4 bg-[#F6F5FB]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-4">
            Ready to evaluate your profile?
          </h2>
          <p className="text-sm sm:text-base text-ink-muted mb-8 max-w-md mx-auto">
            Run an instant portfolio audit and see your Developer Score in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/sign-up">
              <Button variant="primary" size="lg" className="px-8 gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsDonationModalOpen(true)}
              className="gap-2"
            >
              <Coffee className="w-4 h-4 text-ink-muted" />
              Support Preppy
            </Button>
          </div>
        </div>
      </section>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </>
  );
}
