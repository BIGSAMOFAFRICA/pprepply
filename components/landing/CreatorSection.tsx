'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Code,
  Rocket,
  Target,
  Cpu,
  Database,
  Globe,
  Zap,
  Heart,
  Star,
  ArrowRight,
  ExternalLink,
  Shield
} from 'lucide-react';

const SKILLS = [
  { name: 'Next.js', icon: Globe, color: 'text-blue-400' },
  { name: 'React', icon: Code, color: 'text-cyan-400' },
  { name: 'TypeScript', icon: Cpu, color: 'text-blue-500' },
  { name: 'Tailwind CSS', icon: Zap, color: 'text-teal-400' },
  { name: 'Prisma', icon: Database, color: 'text-indigo-400' },
  { name: 'PostgreSQL', icon: Database, color: 'text-blue-600' },
  { name: 'Supabase', icon: Database, color: 'text-green-400' },
  { name: 'Clerk API', icon: Shield, color: 'text-purple-400' },
  { name: 'GitHub API', icon: Github, color: 'text-gray-300' },
];

const PROJECTS = [
  'Developer Tools',
  'AI-Powered Apps',
  'SaaS Products',
  'Open-Source Tools'
];

const PRINCIPLES = [
  { icon: Rocket, text: 'Learn by building', desc: 'Every project is a learning opportunity' },
  { icon: Zap, text: 'Ship fast, improve constantly', desc: 'Launch early, iterate quickly' },
  { icon: Target, text: 'Solve real problems', desc: 'Build tools that developers actually need' },
  { icon: Heart, text: 'Build tools for developers', desc: 'Create with the community in mind' }
];

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com', color: 'hover:text-gray-300' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:text-blue-400' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:text-blue-500' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@example.com', color: 'hover:text-green-400' }
];

export default function CreatorSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto">
        {/* Hero Introduction */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent-subtle text-accent text-sm font-mono mb-8">
            <Star className="w-3.5 h-3.5" />
            <span>Behind the Code</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Meet the <span className="shimmer-text">Creator</span>
          </h2>

          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A teenage developer passionate about building useful tools for developers.
            Driven by curiosity, fueled by code, and committed to creating products that make a difference.
          </p>
        </div>

        {/* Creator Story */}
        <div className={`mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-bg-secondary rounded-2xl border border-white/[0.06] overflow-hidden card-hover">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-80 md:h-full min-h-96">
                <Image
                  src="/resized_IMG_4462.jpeg.jpg"
                  alt="Olabisi Samuel Ayomide"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-text-primary mb-2">Olabisi Samuel Ayomide</h3>
                  <p className="text-accent font-medium">Passionate Developer & Technology Enthusiast</p>
                </div>

                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    I&#39;m a developer with a unique journey. Once a student at <span className="text-accent font-medium">SQI College of ICT</span> studying Biology, 
                    I discovered that my true passion wasn&#39;t just in the sciences—it was in solving problems through technology.
                  </p>

                  <p>
                    What started as curiosity about how apps get built quickly evolved into a deep passion for software development. 
                    Those early days exploring GitHub, learning web frameworks, and building my first projects taught me that the best way to learn 
                    is by <span className="text-accent font-medium">building</span>.
                  </p>

                  <p>
                    Today, I focus on creating modern web applications and tools that genuinely help developers. 
                    Preppy is my answer to a real problem: helping developers showcase their GitHub activity as a powerful, 
                    professional portfolio that tells the story of their growth and contributions.
                  </p>

                  <p className="pt-2">
                    I believe in shipping fast, improving constantly, and building with the developer community in mind. 
                    Every project is a learning opportunity, and I&#39;m always pushing my limits to create tools that make a real impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className={`mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Why Preppy Exists</h3>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Building tools that help developers showcase their talent and stand out in a competitive landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Showcase Better',
                description: 'Help developers transform their GitHub activity into compelling professional portfolios that tell their story.'
              },
              {
                icon: Star,
                title: 'Stand Out',
                description: 'Give developers the tools to differentiate themselves to recruiters, teams, and the broader tech community.'
              },
              {
                icon: Rocket,
                title: 'Accelerate Growth',
                description: 'Provide actionable insights and recommendations to help developers improve their profiles and skills.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-bg-secondary rounded-xl border border-white/[0.06] p-6 card-hover">
                  <div className="w-12 h-12 rounded-lg bg-accent-subtle border border-accent/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills & Technologies */}
        <div className={`mb-20 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Tech Stack</h3>
            <p className="text-text-secondary text-lg">The tools and technologies powering this journey</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {SKILLS.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={index}
                  className="bg-bg-secondary rounded-lg border border-white/[0.06] p-4 text-center card-hover group"
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${skill.color} group-hover:scale-110 transition-transform`} />
                  <p className="text-xs font-medium text-text-primary">{skill.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* What Im Building */}
        <div className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">What I&#39;m Building</h3>
            <p className="text-text-secondary text-lg">Current projects and interests shaping the future</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((project, index) => (
              <div key={index} className="bg-bg-secondary rounded-xl border border-white/[0.06] p-6 text-center card-hover">
                <div className="w-12 h-12 rounded-lg bg-accent-subtle border border-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-lg font-semibold text-text-primary">{project}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <div className={`mb-20 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Philosophy</h3>
            <p className="text-text-secondary text-lg">Principles that guide every line of code</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PRINCIPLES.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div key={index} className="bg-bg-secondary rounded-xl border border-white/[0.06] p-6 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-subtle border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">{principle.text}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed">{principle.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Links */}
        <div className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-2">Let&#39;s Connect</h3>
            <p className="text-text-secondary">Follow the journey and join the conversation</p>
          </div>

          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-lg border border-white/[0.06] bg-bg-secondary flex items-center justify-center text-text-muted transition-all hover:bg-white/[0.05] ${social.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-accent/10 via-cyan-500/10 to-accent/10 rounded-2xl border border-accent/20 p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to Build Something <span className="shimmer-text">Amazing?</span>
            </h3>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Whether you&#39;re just starting your coding journey or looking to level up your skills,
              let&#39;s build the future of developer tools together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold"
              >
                Try Preppy
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-text-primary border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all font-medium"
              >
                <Github className="w-5 h-5" />
                View Source
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-text-muted text-sm mt-6">
              Every great developer started somewhere. Your journey begins with a single commit. 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}