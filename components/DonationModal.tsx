'use client';

import { useState } from 'react';
import { Coffee, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconTile, Icon } from '@/components/ui/Icon';

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

      window.location.href = data.authorization_url;
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] border border-line p-6 sm:p-8 w-full max-w-md shadow-floating relative animate-fade-in">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon icon={X} size={16} strokeWidth={2} decorative />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <IconTile icon={Coffee} size="md" color="#5B5BD6" />
          <div>
            <h3 className="text-base font-bold text-ink">Support Preppy</h3>
            <p className="text-xs text-ink-muted">Independent developer portfolio intelligence</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-ink mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-bg border border-line text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="developer@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-ink mb-1.5">
              Donation Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-bg border border-line text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="1000"
              min="100"
              step="100"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-status-danger p-2.5 rounded-lg bg-status-danger-soft border border-status-danger/20">
              {error}
            </p>
          )}

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              className="flex-1"
            >
              Proceed to Pay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
