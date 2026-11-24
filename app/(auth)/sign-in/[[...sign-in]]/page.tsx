import { SignIn } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F6F5FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo variant="full" size="lg" priority className="mb-3" />
          <p className="text-xs sm:text-sm text-[#6B7089]">Sign in to access your developer portfolio dashboard</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: 'bg-white border border-[#E7E6F0] rounded-[24px] shadow-soft p-6 sm:p-8',
              headerTitle: 'text-[#1F2340] font-bold text-xl',
              headerSubtitle: 'text-[#6B7089] text-xs',
              formButtonPrimary: 'bg-[#5B5BD6] hover:bg-[#4D4DBF] text-white py-3 rounded-xl font-medium shadow-pill transition-all',
              formFieldInput: 'bg-[#F6F5FB] border border-[#E7E6F0] text-[#1F2340] rounded-xl focus:border-[#5B5BD6] focus:bg-white',
              formFieldLabel: 'text-[#1F2340] text-xs font-semibold',
              identityPreviewText: 'text-[#1F2340]',
              footerActionLink: 'text-[#5B5BD6] hover:underline font-medium',
              dividerLine: 'bg-[#E7E6F0]',
              dividerText: 'text-[#6B7089] text-xs',
              socialButtonsBlockButton: 'border border-[#E7E6F0] bg-white text-[#1F2340] hover:bg-[#F6F5FB] rounded-xl transition-colors',
            },
          }}
        />
      </div>
    </div>
  );
}
