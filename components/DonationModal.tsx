'use client';

import { useState } from 'react';
import { Coffee, Loader2 } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount < 100) {
        setError('Minimum donation amount is ₦100');
        return;
      }

      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numAmount,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to initialize payment');
        return;
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-subtle border border-accent/20 flex items-center justify-center">
            <Coffee className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Support Preppy</h3>
            <p className="text-sm text-text-secondary">Your support helps keep the lights on</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-bg-card border border-white/[0.06] rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-2">
              Donation Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-bg-card border border-white/[0.06] rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              placeholder="1000"
              min="100"
              step="100"
              required
            />
            <p className="text-xs text-text-muted mt-1">Minimum: ₦100</p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-text-secondary border border-white/[0.06] rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Coffee className="w-4 h-4" />
                  Donate
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-xs text-text-muted text-center mt-4">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
}