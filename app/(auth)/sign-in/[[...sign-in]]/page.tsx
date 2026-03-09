import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
      <div className="absolute inset-0 bg-glow-accent" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-bg font-bold font-mono">P</span>
            </div>
            <span className="font-bold text-text-primary text-2xl">Preppy<span className="text-accent">.</span></span>
          </div>
          <p className="text-text-secondary">Welcome back, developer</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: 'bg-bg-secondary border border-white/[0.08] shadow-none',
              headerTitle: 'text-text-primary font-syne',
              headerSubtitle: 'text-text-secondary',
              formButtonPrimary: 'btn-primary w-full py-3 rounded-xl',
              formFieldInput: 'bg-bg border border-white/10 text-text-primary rounded-lg focus:border-accent/50',
              formFieldLabel: 'text-text-secondary',
              identityPreviewText: 'text-text-secondary',
              formResendCodeLink: 'text-accent',
              footerActionLink: 'text-accent hover:text-accent-dim',
              dividerLine: 'bg-white/10',
              dividerText: 'text-text-muted',
              socialButtonsBlockButton: 'border border-white/10 bg-white/[0.03] text-text-primary hover:bg-white/[0.06]',
            },
          }}
        />
      </div>
    </div>
  );
}
