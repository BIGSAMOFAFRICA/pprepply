import Link from 'next/link';
import { CheckCircle2, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DonationSuccess() {
  return (
    <div className="min-h-screen bg-[#F6F5FB] flex items-center justify-center p-4">
      <Card radius="3xl" className="max-w-md w-full p-8 text-center border-[#E7E6F0] shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-status-success-soft text-status-success flex items-center justify-center mx-auto mb-5 shadow-soft">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">Thank you for your support!</h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
          Your contribution directly helps keep Preppy independent, maintained, and free for developers worldwide.
        </p>

        <div className="bg-bg-subtle rounded-2xl p-4 mb-6 border border-line text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-2">
            <Heart className="w-4 h-4 fill-current" />
            <span>What happens next?</span>
          </div>
          <ul className="text-xs text-ink-muted space-y-1.5">
            <li>• A transaction receipt has been sent to your email.</li>
            <li>• Your support covers ongoing server & API rate quota.</li>
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
