# TNK – Design & Analytics

Personal portfolio, blog, and analytics test environment for **Guillermo García** — Digital Analytics Specialist & Designer.

Live at: [tnk.design](https://tnk.design)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Blog | MDX (next/mdx + gray-matter) |
| Database | Supabase (newsletter subscribers) |
| Email | Resend |
| Analytics | Google Analytics 4 via GTM |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### 1. Clone and install

```bash
git clone https://github.com/your-username/tnk-website.git
cd tnk-website
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Google Tag Manager
GTM_ID=GTM-XXXXXXX

# Supabase (for newsletter)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend (for email)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=your-audience-id
CONTACT_EMAIL=hello@tnk.design

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** The app works without these env vars — analytics and email will log to console in dev.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, GTM, theme)
│   ├── page.tsx            # Home page
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Blog post
│   ├── projects/
│   │   ├── page.tsx        # Projects listing
│   │   └── [slug]/page.tsx # Project detail
│   ├── contact/page.tsx    # Contact page
│   ├── api/
│   │   ├── subscribe/      # Newsletter API
│   │   └── contact/        # Contact form API
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # robots.txt
│
├── components/
│   ├── analytics/          # GTM, scroll depth tracker
│   ├── blog/               # BlogCard, CategoryFilter, NewsletterForm
│   ├── contact/            # ContactForm
│   ├── home/               # Hero, About, Experience, Skills, etc.
│   ├── layout/             # Navbar, Footer
│   ├── providers/          # ThemeProvider
│   └── ui/                 # Button, Badge, Card, SectionHeader
│
├── content/
│   ├── blog/               # MDX blog posts
│   └── projects/           # MDX project pages
│
├── docs/
│   └── tracking-plan.md    # Analytics tracking plan & event schema
│
├── lib/
│   ├── analytics.ts        # Typed analytics helper
│   ├── mdx.ts              # MDX content utilities
│   └── utils.ts            # cn(), formatDate(), etc.
│
└── types/
    └── index.ts            # Shared TypeScript types
```

---

## Adding Content

### New Blog Post

Create `content/blog/your-post-slug.mdx`:

```mdx
---
title: "Your Post Title"
excerpt: "A one-sentence summary."
date: "2024-04-01"
category: analytics   # analytics | design | league-of-legends | padel
tags: ["Tag 1", "Tag 2"]
coverImage: "https://placehold.co/1200x630/0F1629/00CFFF?text=Cover"
published: true
author:
  name: Guillermo García
  bio: Digital Analytics Specialist & Designer.
---

Your MDX content here...
```

### New Project

Create `content/projects/your-project-slug.mdx`:

```mdx
---
title: "Project Title"
shortDescription: "One-line summary for the card."
category: analytics   # analytics | design | experimentation
tags: ["Tag 1"]
tools: ["Tool 1", "Tool 2"]
coverImage: "https://placehold.co/1200x630/0F1629/00CFFF?text=Project"
results:
  - "Result 1"
  - "Result 2"
year: "2024"
featured: false
published: true
---

Project content...
```

---

## Supabase Schema

For newsletter subscriptions, create this table in your Supabase project:

```sql
create table subscribers (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  source         text,
  subscribed_at  timestamptz default now(),
  confirmed      boolean default false
);

-- Row-level security
alter table subscribers enable row level security;

create policy "Service role only"
  on subscribers
  for all
  using (auth.role() = 'service_role');
```

---

## Analytics

See [`docs/tracking-plan.md`](docs/tracking-plan.md) for the complete event schema, DataLayer documentation, and GTM container structure.

---

## Deployment

### Vercel (recommended)

```bash
vercel deploy
```

Set environment variables in the Vercel dashboard.

### Build

```bash
npm run build
npm run start
```

---

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 90+ |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 95+ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

---

## License

MIT — feel free to use as a starting point for your own portfolio.
