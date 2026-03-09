import { Code2, TrendingUp, Star, Lightbulb, Shield, BarChart2 } from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Developer Score',
    description: 'Get a comprehensive score from 0–100 based on repositories, contributions, language diversity, and documentation quality.',
    color: '#00E5A0',
  },
  {
    icon: Code2,
    title: 'Language Analytics',
    description: 'Visual breakdown of your programming language usage across all repositories with trend analysis.',
    color: '#22D3EE',
  },
  {
    icon: TrendingUp,
    title: 'Contribution Trends',
    description: 'Track your commit frequency, activity streaks, and identify peak coding periods over time.',
    color: '#818CF8',
  },
  {
    icon: Star,
    title: 'Repository Insights',
    description: 'Deep dive into your most impactful projects — stars, forks, open issues, and community engagement.',
    color: '#FBBF24',
  },
  {
    icon: Lightbulb,
    title: 'Smart Suggestions',
    description: 'AI-generated, actionable recommendations to improve your profile visibility and portfolio quality.',
    color: '#F472B6',
  },
  {
    icon: Shield,
    title: 'Saved Reports',
    description: 'Save analysis snapshots to track your progress over time and share with recruiters or teams.',
    color: '#34D399',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-text-secondary text-xs font-mono mb-6">
            FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Everything you need to{' '}
            <span className="shimmer-text">level up</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Comprehensive analysis tools built for developers who care about their craft.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-white/[0.06] bg-bg-secondary card-hover cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-text-primary font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${feature.color}08 0%, transparent 60%)` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
