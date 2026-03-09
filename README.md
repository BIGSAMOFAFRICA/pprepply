# Preppy — GitHub Profile Analyzer

A modern SaaS application built with Next.js that analyzes GitHub profiles, generates Developer Scores, and provides actionable insights to help developers improve their portfolios.

## ✨ Features

- **Developer Score** — 0–100 score based on repositories, activity, language diversity, documentation quality, and community
- **Language Analytics** — Visual breakdown of programming language usage
- **Contribution Trends** — 90-day activity chart showing commit patterns
- **Repository Insights** — Deep dive into your most impactful projects
- **Smart Suggestions** — AI-powered recommendations to improve your GitHub profile
- **Saved Reports** — Persist analyses to track progress over time
- **Auth** — Secure authentication with Clerk (Google, GitHub OAuth, email)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | PostgreSQL + Prisma |
| Charts | Recharts |
| API | GitHub REST API |

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Fill in your credentials:

**Clerk** — Create an app at [dashboard.clerk.com](https://dashboard.clerk.com):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Database** — Create a PostgreSQL database (e.g., [Supabase](https://supabase.com), [Railway](https://railway.app), [Neon](https://neon.tech)):
- `DATABASE_URL=postgresql://user:password@host:5432/preppy`

**GitHub API** — Create a Personal Access Token at [github.com/settings/tokens](https://github.com/settings/tokens) with `public_repo` and `read:user` scopes:
- `GITHUB_TOKEN=ghp_...`

### 3. Set up the database
```bash
npm run db:generate
npm run db:push
```

### 4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
preppy/
├── app/
│   ├── page.tsx                   # Landing page
│   ├── (auth)/                    # Sign-in/Sign-up pages
│   ├── dashboard/                 # Protected dashboard
│   │   ├── page.tsx               # Overview
│   │   ├── analyze/               # Profile analyzer
│   │   └── reports/               # Saved reports
│   └── api/
│       ├── github/analyze/        # GitHub analysis endpoint
│       └── reports/               # Reports CRUD
├── components/
│   ├── landing/                   # Landing page components
│   └── dashboard/                 # Dashboard components
├── lib/
│   ├── github.ts                  # GitHub API client
│   ├── scoring.ts                 # Developer Score algorithm
│   ├── db.ts                      # Prisma client
│   └── utils.ts                   # Utilities
├── prisma/
│   └── schema.prisma              # Database schema
└── types/
    └── index.ts                   # TypeScript types
```

## 🎯 Developer Score Algorithm

The score is calculated across 5 dimensions (max 100):

| Dimension | Max Points | Factors |
|-----------|-----------|---------|
| Repositories | 25 | Count, stars, forks |
| Activity | 25 | Recent commits & updates (6 months) |
| Language Diversity | 20 | Number of languages used |
| Documentation | 20 | READMEs, descriptions, topics |
| Community | 10 | Followers, profile completeness |

Score labels: **Beginner** (0–39) → **Developing** (40–54) → **Proficient** (55–69) → **Advanced** (70–84) → **Elite** (85–100)

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Options
- [Neon](https://neon.tech) — Serverless PostgreSQL (free tier)
- [Supabase](https://supabase.com) — PostgreSQL with extras (free tier)
- [Railway](https://railway.app) — Simple PostgreSQL hosting

## 📝 License

MIT
