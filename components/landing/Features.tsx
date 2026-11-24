import { Code2, TrendingUp, Star, Lightbulb, Shield, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/Icon';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Developer Score',
    description: 'A calibrated 0–100 index based on repository density, activity recency, documentation, and community traction.',
    color: '#5B5BD6',
  },
  {
    icon: Code2,
    title: 'Stack Concentration',
    description: 'Visual breakdown of programming languages used across public projects with primary stack detection.',
    color: '#3F9B7A',
  },
  {
    icon: TrendingUp,
    title: 'Contribution Momentum',
    description: '90-day activity timeline tracking active days, weekly consistency, and release velocity.',
    color: '#5B5BD6',
  },
  {
    icon: Star,
    title: 'Repository Highlights',
    description: 'Deep dive into your most impactful open source work, star velocity, and project documentation.',
    color: '#C98A2B',
  },
  {
    icon: Lightbulb,
    title: 'Portfolio Suggestions',
    description: 'Prioritized recommendations to polish READMEs, tags, topics, and profile positioning.',
    color: '#C98A2B',
  },
  {
    icon: Shield,
    title: 'Saved Reports',
    description: 'Archive snapshots to track your portfolio evolution over months and share with recruiters.',
    color: '#3F9B7A',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 bg-white border-y border-line">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary-soft px-3 py-1 rounded-full">
            Key Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-3 mb-2">
            Clear signal without the fluff
          </h2>
          <p className="text-sm text-ink-muted">
            Engineered to give you actionable clarity on your GitHub portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              radius="2xl"
              className="p-6 border-line hover:border-primary/40 hover:shadow-soft-md transition-all duration-200 flex flex-col items-start"
            >
              {/* Soft tinted icon tile matching reference image */}
              <IconTile icon={f.icon} size="md" color={f.color} className="mb-4" />
              <h3 className="text-base font-bold text-ink mb-2">{f.title}</h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
