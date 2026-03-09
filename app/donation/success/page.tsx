import Link from 'next/link';
import { CheckCircle, ArrowRight, Heart } from 'lucide-react';

export default function DonationSuccess() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Thank You! <span className="text-green-400">🎉</span>
        </h1>

        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          Your support means the world to me! Preppy is now powered by amazing people like you.
          Your contribution helps keep the service running and improving.
        </p>

        <div className="bg-bg-secondary rounded-xl border border-white/[0.06] p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-accent mb-3">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-medium">What happens next?</span>
          </div>
          <ul className="text-sm text-text-secondary space-y-2 text-left">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              You&#39;ll receive a confirmation email
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              Your donation supports ongoing development
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              Help more developers discover their potential
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sign-up"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-text-primary border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all font-medium"
          >
            Try Preppy Free
          </Link>
        </div>

        <p className="text-text-muted text-sm mt-6">
          Questions? Feel free to reach out anytime.
        </p>
      </div>
    </div>
  );
}