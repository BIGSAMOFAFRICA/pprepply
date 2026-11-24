'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error Caught]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#F6F5FB] text-[#1F2340] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-[24px] shadow-sm border border-[#E7E6F0] p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm text-[#6B7089] mb-6">
            An unexpected application error occurred. We have logged the error details.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B5BD6] text-white text-sm font-medium hover:bg-[#4D4DBF] transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7E6F0] bg-white text-[#1F2340] text-sm font-medium hover:bg-[#F6F5FB] transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
