import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F5FB] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[24px] shadow-soft border border-[#E7E6F0] p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <Logo variant="full" size="md" />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#ECEBFA] text-[#5B5BD6] flex items-center justify-center mx-auto mb-5">
          <Icon icon={FileQuestion} size={24} strokeWidth={2} decorative />
        </div>

        <h1 className="text-2xl font-bold text-[#1F2340] mb-2">Page Not Found</h1>
        <p className="text-sm text-[#6B7089] mb-6">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B5BD6] text-white text-sm font-medium hover:bg-[#4D4DBF] transition-colors shadow-pill"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
