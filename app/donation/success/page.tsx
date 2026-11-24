import Link from 'next/link';
import { ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';

export default function DonationSuccess() {
  return (
    <div className="min-h-screen bg-[#F6F5FB] flex items-center justify-center p-4">
      <Card radius="3xl" className="max-w-md w-full p-8 text-center border-[#E7E6F0] shadow-soft">
        <div className="mb-6 flex justify-center">
          <Logo variant="full" size="md" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-status-success-soft text-status-success flex items-center justify-center mx-auto mb-5 shadow-soft">
          <Icon icon={CheckCircle2} size={24} strokeWidth={2} decorative />
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">Thank you for your support!</h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
          Your contribution directly helps keep Preppy independent, maintained, and free for developers worldwide.
        </p>

        <div className="bg-bg-subtle rounded-2xl p-4 mb-6 border border-line text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-3">
            <Heart className="w-4 h-4 fill-current" />
            <span>Confirmation & Next Steps</span>
          </div>
          <ul className="text-xs text-ink-muted space-y-2">
            <li className="flex items-center gap-2">
              <Icon icon={CheckCircle2} size={16} strokeWidth={2} className="text-status-success" decorative />
              <span>A transaction receipt has been sent to your email.</span>
            </li>
            <li className="flex items-center gap-2">
              <Icon icon={CheckCircle2} size={16} strokeWidth={2} className="text-status-success" decorative />
              <span>Your support covers ongoing server & API rate quota.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard" className="flex-1">
            <Button variant="primary" size="md" className="w-full gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" size="md" className="w-full">
              Back Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
