import { Code2, TrendingUp, Star, Lightbulb, Shield, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Developer Score',
    description: 'A calibrated 0–100 index based on repository density, activity recency, documentation, and community traction.',
  },
  {
    icon: Code2,
    title: 'Stack Concentration',
    description: 'Visual breakdown of programming languages used across public projects with primary stack detection.',
  },
  {
    icon: TrendingUp,
    title: 'Contribution Momentum',
    description: '90-day activity timeline tracking active days, weekly consistency, and release velocity.',
  },
  {
    icon: Star,
    title: 'Repository Highlights',
    description: 'Deep dive into your most impactful open source work, star velocity, and project documentation.',
  },
  {
    icon: Lightbulb,
    title: 'Portfolio Suggestions',
    description: 'Prioritized recommendations to polish READMEs, tags, topics, and profile positioning.',
  },
  {
    icon: Shield,
    title: 'Saved Reports',
    description: 'Archive snapshots to track your portfolio evolution over months and share with recruiters.',
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
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                radius="2xl"
                className="p-6 border-line hover:border-primary/40 hover:shadow-soft-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{f.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
