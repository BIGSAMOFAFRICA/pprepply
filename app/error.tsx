'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, LayoutDashboard } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-sm border border-[#E7E6F0] p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#1F2340] mb-2">Application error</h2>
        <p className="text-sm text-[#6B7089] mb-6">
          {error.message || 'An error occurred while loading this view.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B5BD6] text-white text-sm font-medium hover:bg-[#4D4DBF] transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7E6F0] bg-white text-[#1F2340] text-sm font-medium hover:bg-[#F6F5FB] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
