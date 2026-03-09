import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CreatorSection from '@/components/landing/CreatorSection';
import CTA from '@/components/landing/CTA';
import Navbar from '@/components/landing/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CreatorSection />
        <CTA />
      </main>
    </div>
  );
}
