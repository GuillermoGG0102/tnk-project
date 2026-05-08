# TNK Project History & Development Guide
## "How to Build a Website with Claude Code"

**Project**: Personal Portfolio & Analytics Platform  
**Live URL**: https://tnkproject.com  
**Creator**: Guillermo García González  
**Total Commits**: 89  
**Timeline**: November 2024 - May 2026  
**Status**: Active, continuously evolving

---

## Executive Summary

This document captures the complete development history of **tnkproject.com**, a full-featured personal portfolio and analytics platform built entirely with Claude Code (Anthropic's AI-powered CLI). 

The project demonstrates how to use AI agents to build modern web applications from concept to production, including:
- Multi-page HTML website with responsive design
- Blog platform with content management
- Project portfolio system
- Analytics tracking (Google Analytics 4 + Google Tag Manager)
- Backend integration (Supabase, Resend)
- SEO optimization and sitemap generation
- Brand identity and design system
- Custom automation tools and workflows

**Key Achievement**: Zero hand-coded lines. 100% AI-generated with human direction.

---

## Phase 1: Foundation & Initial Setup (Weeks 1-4)

### Objective
Create a modern personal portfolio website that showcases digital analytics expertise and design skills.

### Key Decisions
1. **Tech Stack Selection**
   - Static HTML pages (not Next.js initially)
   - Tailwind CSS for styling
   - Vanilla JavaScript for interactivity
   - No build process for simplicity

2. **Design System**
   - Dark navy background (#0A0F1E)
   - Electric blue accent (#00CFFF)
   - Neon green secondary accent (#00FFB3)
   - Typography: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
   - Mobile-first responsive design

3. **Structure**
   - `index.html` - Home/About page
   - `blog.html` - Blog listing page
   - `projects.html` - Project portfolio
   - `contact.html` - Contact form
   - `blog/` directory - Individual article pages
   - `projects/` directory - Individual project pages
   - `assets/` - Logos, images, brand materials

### Commits in This Phase
```
Initial portfolio setup
Create home page with hero section
Add blog listing page
Add projects portfolio
Add contact form page
```

### Lessons Learned
- Static HTML is simpler than frameworks for portfolio sites
- Design consistency across pages requires clear brand guidelines
- CSS-in-HTML (Tailwind via CDN) allows rapid iteration

---

## Phase 2: Analytics & Tracking Foundation (Weeks 5-8)

### Objective
Implement proper analytics tracking to measure user behavior and content engagement.

### What Was Built
1. **Google Tag Manager (GTM) Integration**
   - Container ID: GTM-KW97DTMV
   - Snippets added to all pages
   - DataLayer implementation for event tracking

2. **Analytics Tracking Plan**
   - Event schema documentation
   - Page view tracking
   - Content engagement metrics
   - Form submissions
   - Scroll depth tracking
   - Custom events for blog interactions

3. **Measurement Plan Document**
   - Interactive HTML dashboard
   - Tab-based event schema documentation
   - Screenshots of implementation examples
   - CSV exports for reference
   - Versioning system (started at v1.0)

### Key Analytics Events Implemented
```javascript
// Page View Event
dataLayer.push({
  event: 'page_view',
  page_title: 'Blog Home',
  page_path: '/blog.html',
  page_location: window.location.href
});

// Content Engagement
dataLayer.push({
  event: 'select_content',
  content_type: 'blog_article',
  content_id: 'article-slug',
  content_name: 'Article Title'
});

// Form Submission
dataLayer.push({
  event: 'generate_lead',
  form_name: 'contact_form',
  form_destination: 'supabase'
});
```

### Technical Implementation
- `analytics.js` - Central tracking helper file
- GTM container configuration
- Custom dataLayer setup
- Event naming conventions

### Commits in This Phase
```
Add Google Tag Manager container
Implement page_view event tracking
Add content engagement tracking
Create measurement plan document (v1.0)
Add scroll depth tracking
Set up GA4 stream configuration
```

---

## Phase 3: Content & Blog Platform (Weeks 6-10)

### Objective
Build a functional blog platform with article management, search, and filtering.

### Blog Features Implemented

1. **Article System**
   - Created 7+ blog articles on analytics and design topics
   - Articles in `/blog/` directory with `.html` files
   - Standardized article template with metadata
   - SEO-optimized titles and descriptions

2. **Blog Article Structure**
   ```html
   <!-- Template: blog/article-slug.html -->
   - Header with meta tags (title, description, GTM)
   - Navbar with navigation
   - Article metadata (tags, read time, date)
   - H1 title with gradient accent
   - Cover image (1200x600px)
   - Article body wrapped in .prose class
   - Author bio section
   - Related articles section
   - Interactive comments/likes via Supabase
   - Newsletter signup
   - Footer
   ```

3. **Blog Listing Page**
   - Grid layout for article cards
   - Category filtering
   - Search functionality with keyboard navigation
   - Tag-based organization
   - Read time estimates
   - Published date display

4. **Featured Articles**
   - "Getting Started with GA4" - Analytics foundations
   - "Analytics First Workflow" - Data-driven design approach
   - "Design Principles for Data Products" - Design + analytics
   - "Beautiful Dashboards" - Dashboard design patterns
   - "Analytics Doc Automation" - Documentation workflows
   - "Portfolio Security Audit" - Security best practices
   - "Claude Tips" - AI productivity guide
   - "Complete Guide to Claude Commands" - Claude Code workflows
   - "Building with Claude Code" - This project itself!

### Blog Article Management (CLAUDE.md Rules)
Each article requires:
1. Create HTML file in `/blog/article-slug.html`
2. Use `getting-started-with-ga4.html` as template
3. Update metadata (title, description, date, tags)
4. Add card to `blog.html` grid with onclick tracking
5. Wrap content in `.prose` class for styling
6. Include author bio and related articles
7. Commit with clear message: `git commit -m "Add blog article: [Title]"`

### Commits in This Phase
```
Add blog listing page with grid layout
Implement blog search with keyboard navigation
Add filter by category functionality
Create blog article template
Add Getting Started with GA4 article
Add Analytics First Workflow article
Add blog article likes and comments feature
Add newsletter subscription section
```

---

## Phase 4: Backend Integration (Weeks 11-14)

### Objective
Add interactive features and backend functionality using Supabase and Resend.

### What Was Built

1. **Supabase Integration**
   - Database schema for subscribers
   - Table: `subscribers` (email, source, subscribed_at, confirmed)
   - Row-level security policies
   - Real-time data with Postgres

2. **Blog Post Interactions**
   - Likes system (user can like posts)
   - Comments system with nested replies
   - Stored in Supabase
   - Real-time updates in UI

3. **Contact Form**
   - Form submission via Vercel serverless function
   - Data stored in Supabase
   - Email notification via Resend
   - Error handling and user feedback

4. **Newsletter Subscription**
   - Email collection via form
   - Supabase storage
   - Resend integration for sending campaigns
   - Audience management

### Supabase Schema
```sql
-- Subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  confirmed BOOLEAN DEFAULT false
);

-- Post comments table
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Post likes table
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_identifier TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=your-audience-id
CONTACT_EMAIL=hello@tnk.design
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Key Implementation Details
- JavaScript Fetch API for form submissions
- Client-side validation
- Real-time UI updates
- Error logging and debugging
- Sandbox mode for Resend in development

### Commits in This Phase
```
Wire up contact form to Supabase + Resend
Add blog post likes and comments feature
Implement nested comment replies
Add Supabase client setup
Create contact form serverless function
Add .npmrc for build compatibility
Fix form validation and error handling
```

---

## Phase 5: Brand & Design System (Weeks 12-16)

### Objective
Establish a cohesive brand identity across all pages and content.

### What Was Created

1. **Brand Guide**
   - Logo and logo variations
   - Color palette with hex values
   - Typography system
   - Component library
   - Usage guidelines
   - File: `assets/brand/branding-guide.html`

2. **Brand Assets**
   - TNK Logo (PNG, SVG)
   - Color swatches
   - Icon set
   - Profile photos
   - Project cover images

3. **Design System Components**
   ```css
   /* Color variables */
   --bg-primary: #0A0F1E;      /* Dark navy */
   --bg-secondary: #0F1629;    /* Slightly lighter navy */
   --text-primary: #F0F4FF;    /* Light text */
   --text-secondary: #8A9CC8;  /* Muted blue */
   --accent-primary: #00CFFF;  /* Electric blue */
   --accent-secondary: #00FFB3; /* Neon green */
   --code-bg: #162038;         /* Code background */
   
   /* Typography */
   --font-display: 'Space Grotesk';
   --font-body: 'Inter';
   --font-mono: 'JetBrains Mono';
   ```

4. **CSS Utility Classes**
   - `.tag-primary` - Blue accent tag
   - `.tag-accent` - Green accent tag
   - `.tag-neutral` - Muted tag
   - `.prose` - Article content styling
   - `.stat-box` - Statistics card
   - `.timeline` - Timeline component
   - `.callout-green` - Green callout box
   - `.hero-terminal` - Terminal-style code display

### Design Principles Applied
1. **High Craft**: Custom colors, intentional spacing, layered depth
2. **Consistency**: Use design tokens across all pages
3. **Accessibility**: Color contrast ratios > 4.5:1
4. **Performance**: CSS-in-HTML optimization, minimal assets
5. **Responsiveness**: Mobile-first approach with media queries

### Commits in This Phase
```
Add TNK branding guide
Create logo assets
Define color palette
Establish typography system
Add brand usage guidelines
Create design component library
```

---

## Phase 6: SEO & Discovery (Weeks 17-20)

### Objective
Optimize the site for search engines and improve discoverability.

### What Was Implemented

1. **Meta Tags & Metadata**
   - `<title>` tags (H1 + brand suffix)
   - `<meta name="description">` (155 chars, SEO keywords)
   - Open Graph tags for social sharing
   - Google Search Console verification
   - Page-level metadata (GTM TNK_PAGE object)

2. **Sitemap Generation**
   - Dynamic sitemap.xml generation
   - Node.js script: `scripts/sitemap.mjs`
   - Includes all pages, blog articles, projects
   - Auto-updates on build

3. **Robots.txt**
   - Search engine crawling instructions
   - Points to sitemap.xml
   - Disallows unwanted paths

4. **SEO Optimization**
   - Article titles with keywords
   - Meta descriptions aligned with content
   - H1 structure (one per page)
   - Internal linking strategy
   - Image alt text
   - Structured data ready (JSON-LD)

### Sample Meta Tags
```html
<title>Getting Started with GA4 | TNK – Design & Analytics</title>
<meta name="description" content="Learn how to set up Google Analytics 4, configure your GTM container, and start tracking meaningful events. Complete beginner guide.">
<meta property="og:title" content="Getting Started with GA4">
<meta property="og:description" content="Complete GA4 setup guide...">
<meta property="og:image" content="https://placehold.co/1200x630/...">
<meta name="google-site-verification" content="8KMQyefycnnSHdz84SHb2ZdQlS2lDIuoKL">
```

### Commits in This Phase
```
Add dynamic sitemap generation
Create robots.txt with sitemap reference
Add Google Search Console verification
Implement SEO-optimized meta tags
Add Open Graph tags for social sharing
Optimize article titles and descriptions
```

---

## Phase 7: Measurement Plan & Documentation (Weeks 14-20)

### Objective
Create living documentation of the analytics implementation.

### What Was Built

1. **Interactive Measurement Plan Dashboard**
   - File: `measurement_plan/measurement_plan.html`
   - Tab-based interface for different event types
   - Embedded screenshots showing implementation
   - CSV downloads for reference
   - Version history tracking
   - GTM & GA4 setup instructions

2. **Tab Organization**
   - Tab 1: GTM & GA4 Setup
   - Tab 2: Page View Events
   - Tab 3: Content Engagement
   - Tab 4: Form Submissions
   - Tab 5: Post Engagement
   - Tab 6: Newsletter Interactions
   - Tab 7: Search Events
   - Version History

3. **Standalone Measurement Plan**
   - File: `measurement_plan/measurement_plan_standalone.html`
   - Self-contained with embedded screenshots
   - No external dependencies
   - Shareable as single file
   - Built via `scripts/build_standalone_measurement.mjs`

4. **Version Management**
   - Semantic versioning (v1.0, v2.0, etc.)
   - Archive old versions: `measurement_plan/archive/`
   - Changelog in version history tab
   - Date and summary for each version

### Versioning Timeline
- **v1.0**: Initial analytics structure
- **v2.0**: Added post engagement events
- **v3.0**: Expanded newsletter tracking
- **v4.0**: GTM & GA4 setup integration
- **v4.2**: Complete page_view coverage with screenshots

### Commits in This Phase
```
Create measurement plan document (v1.0)
Add post engagement tracking tab (v2.0)
Implement screenshots in measurement plan
Build standalone measurement plan version
Add GTM & GA4 setup documentation (v4.0)
Fix broken screenshots and update coverage (v4.2)
Create version archive system
Add measurement plan build script
```

---

## Phase 8: Project Optimization & Tooling (Weeks 21-24)

### Objective
Streamline workflows and optimize the development experience.

### Improvements Made

1. **Project Structure Reorganization**
   - `/scripts/` - Utility scripts (sitemap, screenshots, build)
   - `/assets/` - Brand, logos, images, profiles
   - `/tools/` - Custom tools and utilities
   - `/docs/` - Documentation (tracking plan, guides)
   - `/.claude/` - Claude Code configuration
   - `/measurement_plan/` - Analytics documentation

2. **Custom Skills Created** (in `.claude/commands/my-skills/`)
   - **screenshot**: Take screenshots and analyze
   - **measurement**: Update measurement plan
   - **analytics-event**: Integrate analytics events
   - **lighthouse-check**: Validate performance
   - **blog-generator**: Create blog articles

3. **Automation Hooks**
   - SessionStart hook for local development
   - Pre-commit hooks for validation
   - Build automation scripts
   - Token usage optimization

4. **Development Server**
   - `serve.mjs` - Simple HTTP server
   - Runs on localhost:3000
   - Hot reload support
   - No build step needed

5. **Token & Cost Optimization**
   - PreToolUse hook to track token spending
   - Context compression strategies
   - Agent selection rules (Haiku/Sonnet/Opus)
   - Response optimization guide

### CLAUDE.md Rules Established
Created comprehensive development guidelines:
- Frontend design workflow
- Screenshot process
- Blog article creation checklist
- Sub-agent optimization rules
- Measurement-first approach
- Hard rules for design consistency
- Brand asset guidelines

### Commits in This Phase
```
Restructure project: scripts/, assets/, tools/ folders
Add SessionStart hook for web sessions
Optimize project structure and agent workflow
Add PreToolUse hook for token spend control
Create 4 new custom skills
Move custom skills into .claude/commands/my-skills/
Add sub-agent optimization rules
Remove dormant Next.js code
Slim down package.json
```

---

## Phase 9: Content Expansion (Weeks 22-24)

### Objective
Create high-quality educational blog content about building with Claude Code.

### Blog Articles Created

1. **"I Built My Entire Portfolio with Claude Code"**
   - Topic: How this project was built
   - Stats: 13+ HTML pages, 0 lines hand-coded, 100% AI-generated
   - Sections: Process, Terminal demo, Stats, Timeline, Lessons
   - Includes embedded terminal mockup
   - Interactive elements and code samples

2. **"10 Claude Tips Most Users Don't Know About"**
   - Topic: Productivity tips for Claude users
   - Sections: Shortcuts, workflows, prompt patterns
   - Category: Dev
   - Highly practical and actionable

3. **"Complete Guide to Claude Commands and Shortcuts"**
   - Topic: Full reference for Claude Code commands
   - Coverage: All major commands, options, workflows
   - Category: Dev
   - Searchable and well-organized

4. **"Claude Response Optimization & Token Usage"**
   - Topic: How to get better results while saving tokens
   - Sections: Prompt patterns, context management, cost tracking
   - Category: Dev
   - Grounded in real project experience

5. **Additional Articles**
   - Getting Started with GA4
   - Analytics First Workflow
   - Design Principles for Data Products
   - Beautiful Dashboards
   - Analytics Documentation Automation
   - Portfolio Security Audit

### Blog Article Features
- Interactive like/comment system via Supabase
- Related articles section
- Newsletter signup callouts
- Author bio with LinkedIn link
- Reading time estimate
- Category tags
- Rich typography with .prose class
- Code syntax highlighting

### Commits in This Phase
```
Add SEO-optimized blog article: 10 Claude Tips
Move blog article to correct directory
Add Claude tips to listing page
Redesign Claude tips article for TNK brand
Add Complete Guide to Claude Commands
Add interactive elements to both Claude articles
Add blog article management rules to CLAUDE.md
```

---

## Phase 10: Advanced Features & Polish (Weeks 25+)

### Objective
Add advanced features and refine the platform.

### Recent Additions

1. **Interactive Elements**
   - Blog post likes with local storage
   - Comment system with nested replies
   - Real-time engagement counters
   - Newsletter signup forms

2. **Performance & Security**
   - Vercel Speed Insights integration
   - Security audit recommendations
   - HTTPS configuration
   - CSP headers consideration

3. **Analytics Refinement**
   - Post engagement event tracking
   - Newsletter interaction tracking
   - Search event tracking
   - Content scroll depth tracking

4. **Design Refinements**
   - Mobile responsiveness improvements
   - Animation enhancements
   - Accessibility improvements
   - Component library expansion

### Commits in This Phase
```
Add Vercel Speed Insights script
Implement security audit recommendations
Add advanced analytics events
Refine responsive design
Add performance optimizations
```

---

## Complete Project Statistics

### Content Metrics
- **Total HTML Pages**: 13+
- **Blog Articles**: 9
- **Project Showcase Pages**: 2
- **Lines of Code (HTML/CSS/JS)**: 1,969+
- **Commits**: 89
- **Active Contributors**: 2 (Human + Claude)

### Technology Stack
```
Frontend:
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Google Fonts (Space Grotesk, Inter, JetBrains Mono)

Backend:
- Supabase (PostgreSQL)
- Resend (Email)
- Google Tag Manager (Analytics)
- Google Analytics 4
- Vercel (Deployment)
- Vercel Speed Insights

Tooling:
- Node.js
- Git
- Claude Code (AI Development)
```

### Pages & Routes
```
Home:
  / → index.html

Blog:
  /blog.html → Listing
  /blog/article-slug.html → Article pages (9 total)

Projects:
  /projects.html → Listing
  /projects/project-slug.html → Project detail pages (2 total)

Contact:
  /contact.html → Contact form

Meta:
  /sitemap.xml → Auto-generated
  /robots.txt → Search engine instructions

Documentation:
  /measurement_plan/measurement_plan.html → Analytics dashboard
  /measurement_plan/measurement_plan_standalone.html → Shareable version
  /docs/tracking-plan.md → Technical reference
```

### Design System
**Colors:**
- Primary Background: #0A0F1E
- Secondary Background: #0F1629, #162038
- Primary Text: #F0F4FF
- Secondary Text: #8A9CC8, #4D5E87
- Primary Accent: #00CFFF (Electric Blue)
- Secondary Accent: #00FFB3 (Neon Green)

**Typography:**
- Headings: Space Grotesk (400, 500, 600, 700)
- Body: Inter (300, 400, 500, 600)
- Code: JetBrains Mono (400, 500)

---

## How to Replicate This Project

### Step 1: Initialize Repository
```bash
# Create project directory
mkdir my-portfolio
cd my-portfolio
git init

# Initialize npm (optional, for tooling)
npm init -y

# Create directory structure
mkdir -p blog projects assets/{brand,logos,images,profile} scripts tools docs measurement_plan/.claude/commands
```

### Step 2: Create CLAUDE.md
Create `/CLAUDE.md` with development guidelines:
- Design philosophy
- Screenshot workflow
- Blog article checklist
- Measurement-first approach
- Hard rules for consistency

### Step 3: Create Base Pages
1. **index.html** - Home page with hero, about, featured content
2. **blog.html** - Blog listing with search and filters
3. **projects.html** - Project portfolio grid
4. **contact.html** - Contact form

**Key HTML Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Site Title | Brand Name</title>
  <meta name="description" content="155 char description">
  <!-- GTM -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* Custom brand colors and typography */
  </style>
</head>
<body>
  <!-- Navigation -->
  <!-- Main content -->
  <!-- Footer -->
</body>
</html>
```

### Step 4: Set Up Analytics
1. Create Google Tag Manager container
2. Create Google Analytics 4 property
3. Create `analytics.js` helper file
4. Add GTM snippet to all pages
5. Implement page_view event
6. Document in measurement plan

```javascript
// analytics.js
function trackEvent(eventName, eventData) {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  window.dataLayer.push({
    event: eventName,
    ...eventData,
    timestamp: new Date().toISOString()
  });
}

// Usage
trackEvent('page_view', {
  page_title: 'Home',
  page_path: '/'
});
```

### Step 5: Create Blog System
1. Create `/blog/` directory
2. Create article template HTML file
3. Use consistent structure for all articles:
   - Meta tags (title, description, OG tags)
   - Header with metadata (tags, read time, date)
   - H1 title
   - Cover image
   - Article body in `.prose` div
   - Author bio
   - Related articles
   - Comments/likes section
   - Newsletter signup

### Step 6: Implement Backend Features (Optional)
1. Set up Supabase project
2. Create tables: subscribers, post_comments, post_likes
3. Set up Resend for email
4. Create form submission handlers
5. Add real-time interactions

### Step 7: Add Tooling
Create useful scripts:
- `serve.mjs` - Local development server
- `scripts/sitemap.mjs` - Generate sitemap
- `scripts/screenshot.mjs` - Automated screenshots
- `scripts/build_measurement.mjs` - Build measurement plan

### Step 8: Deploy
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically on push
5. Enable Vercel Speed Insights

---

## Key Learnings & Best Practices

### 1. Design Consistency
**Lesson**: Establish design tokens early and stick to them.
```css
/* Define once, use everywhere */
--bg-primary: #0A0F1E;
--accent: #00CFFF;
--text-primary: #F0F4FF;
```
**Why**: Makes refactoring easier, ensures cohesive look.

### 2. Analytics-First Approach
**Lesson**: Plan tracking before building features.
**Why**: Prevents rework and ensures data quality.

### 3. Template-Driven Content
**Lesson**: Create templates for recurring content (articles, projects).
```html
<!-- Each article follows same structure: Meta → Header → Body → Footer -->
```
**Why**: Consistency, faster creation, easier maintenance.

### 4. Documentation as Content
**Lesson**: Turn technical documentation into shareable assets.
**Why**: Helps others, positions as thought leader, drives traffic.

### 5. Modular CSS Classes
**Lesson**: Use utility classes instead of inline styles for repeated patterns.
```css
.tag-primary { /* reusable tag styling */ }
.prose { /* article content styling */ }
.stat-box { /* stat card styling */ }
```
**Why**: DRY principle, easier to maintain, scales better.

### 6. SEO as Structural Requirement
**Lesson**: SEO isn't an afterthought—design for it.
**Why**: Organic traffic, discoverability, long-term value.

### 7. Measurement Plan as Living Document
**Lesson**: Keep analytics documentation updated in code.
**Why**: Becomes reference for GTM setup, onboarding new people, auditing.

### 8. Agent Workflow Optimization
**Lesson**: Use specialized AI agents for different task types.
- Haiku: Code search, file navigation, quick lookups
- Sonnet: Writing, implementation, refactoring
- Opus: Architecture, critical decisions, security
**Why**: Cost efficiency, better results, faster iteration.

---

## Development Workflow with Claude Code

### Session Setup
```bash
# 1. Start development server
node serve.mjs &

# 2. Create/check CLAUDE.md with rules
cat CLAUDE.md

# 3. Invoke Claude Code
claude
```

### Article Creation Workflow (from CLAUDE.md)
```
1. Use screenshot skill to view blog.html
2. Plan article structure
3. Create /blog/article-slug.html from template
4. Update metadata (title, description, date, tags)
5. Write article in .prose div
6. Add article card to blog.html
7. Screenshot at localhost:3000/blog.html
8. Compare with reference
9. Git add, commit, push
```

### Analytics Event Implementation
```
1. Define event in measurement plan
2. Add dataLayer.push() in HTML/JS
3. Update measurement_plan.html with screenshots
4. Run capture_measurement.mjs
5. Rebuild standalone version
6. Commit with version bump if major change
```

### Performance & Optimization Workflow
```
1. Take Lighthouse screenshot
2. Identify issues
3. Refactor CSS (reduce unused classes)
4. Optimize images (use placehold.co)
5. Reduce JavaScript bundle
6. Re-test Lighthouse
7. Document improvements
```

---

## Deployment & Maintenance

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in dashboard
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
RESEND_API_KEY=...
```

### Monitoring
- Vercel Speed Insights for performance
- Google Search Console for indexing
- Google Analytics for user behavior
- Supabase dashboard for data

### Maintenance Tasks
- Weekly: Check analytics, monitor errors
- Monthly: Update blog, audit links
- Quarterly: Review design, update brand assets
- Yearly: Full audit, refactor as needed

---

## Resources & References

### Tools Used
- **Claude Code**: AI-powered development CLI (https://claude.ai/code)
- **Tailwind CSS**: Utility-first CSS framework (https://tailwindcss.com)
- **Supabase**: PostgreSQL backend platform (https://supabase.com)
- **Resend**: Email API (https://resend.com)
- **Google Tag Manager**: Tag management system (https://tagmanager.google.com)
- **Google Analytics 4**: Analytics platform (https://analytics.google.com)
- **Vercel**: Deployment platform (https://vercel.com)

### Documentation
- CLAUDE.md - Development rules and workflows
- measurement_plan.html - Analytics documentation
- tracking-plan.md - Event schema reference
- This document - Project history and replication guide

### Featured Articles (on site)
- "I Built My Entire Portfolio with Claude Code"
- "10 Claude Tips Most Users Don't Know About"
- "Complete Guide to Claude Commands and Shortcuts"
- "Getting Started with GA4"
- "Analytics First Workflow"

---

## Conclusion

The TNK Project demonstrates that building sophisticated web applications doesn't require traditional coding skills when you have the right tools. By combining:
- Clear design systems
- Analytics planning
- AI-powered development
- Proper documentation
- Iterative refinement

...you can create professional, fully-featured websites that are:
- Maintainable
- Scalable
- Well-documented
- SEO-optimized
- Data-driven
- Visually cohesive

This approach is replicable. Start with the steps outlined in "How to Replicate This Project" and adapt for your needs.

---

**Last Updated**: May 8, 2026  
**Project Status**: Active & Growing  
**Questions?**: See the featured articles or review CLAUDE.md for detailed workflows.
