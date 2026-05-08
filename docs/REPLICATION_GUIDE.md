# How to Build a Website with Claude Code
## Step-by-Step Replication Guide

**Target Time**: 4-6 weeks  
**Difficulty**: Intermediate  
**Prerequisites**: Basic HTML/CSS understanding, GitHub account, Vercel account, Claude Code access

---

## Table of Contents
1. [Week 1: Foundation](#week-1-foundation)
2. [Week 2-3: Content & Features](#weeks-2-3-content--features)
3. [Week 4-5: Backend & Analytics](#weeks-4-5-backend--analytics)
4. [Week 6: Polish & Deploy](#week-6-polish--deploy)

---

## Week 1: Foundation

### Day 1: Setup & Planning

**1.1 Create Repository**
```bash
# Create directory
mkdir my-portfolio
cd my-portfolio
git init

# Create structure
mkdir -p blog projects assets/{brand,logos,images,profile} scripts tools docs .claude/commands measurement_plan

# Initialize npm (for tooling)
npm init -y
npm install --save-dev puppeteer-core
```

**1.2 Define Your Brand**
Before coding, establish:
- **Color Palette**: Pick 5-8 colors (primary bg, secondary bg, text, accent 1, accent 2)
- **Typography**: Choose 3 fonts (heading, body, code)
- **Logo & Assets**: Create or source brand assets
- **Brand Values**: 2-3 words describing your brand

Example (TNK Brand):
```
Colors:
  - Primary BG: #0A0F1E (dark navy)
  - Text: #F0F4FF (light)
  - Accent 1: #00CFFF (electric blue)
  - Accent 2: #00FFB3 (neon green)

Typography:
  - Headings: Space Grotesk (bold, tight tracking)
  - Body: Inter (clean, readable)
  - Code: JetBrains Mono (technical)

Values: Modern, Data-Driven, Creative
```

**1.3 Create CLAUDE.md**
This is your development rulebook. Create `/CLAUDE.md` with:

```markdown
# Development Rules

## Design
- Primary colors and hex values
- Typography system
- Component library
- Screenshot workflow

## Blog Articles
- Template structure
- Metadata requirements
- Content guidelines
- Analytics tracking

## Development
- Folder structure
- Naming conventions
- File organization
- Git workflow

## Measurement
- Event types
- DataLayer structure
- Tracking rules
- GA4 setup
```

### Day 2: Build Home Page

**2.1 Create index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Name | Portfolio</title>
  <meta name="description" content="[155 chars] Brief description with keywords">
  <!-- Google Tag Manager -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      background: #0A0F1E;
      color: #F0F4FF;
      font-family: 'Inter', sans-serif;
    }
    h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
    a { color: #00CFFF; text-decoration: none; }
    a:hover { color: #00FFB3; }
  </style>
</head>
<body>
  <!-- Navbar -->
  <header style="position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,15,30,0.9); backdrop-filter: blur(20px);">
    <nav style="max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 64px;">
      <a href="/" style="font-weight: 700; font-size: 18px;">YourBrand</a>
      <div style="display: flex; gap: 4px;">
        <a href="/" style="padding: 8px 14px; border-radius: 8px;">Home</a>
        <a href="/blog.html" style="padding: 8px 14px; border-radius: 8px;">Blog</a>
        <a href="/projects.html" style="padding: 8px 14px; border-radius: 8px;">Projects</a>
        <a href="/contact.html" style="padding: 8px 14px; border-radius: 8px; background: rgba(0,207,255,0.1); border: 1px solid rgba(0,207,255,0.2);">Get in touch</a>
      </div>
    </nav>
  </header>

  <!-- Hero Section -->
  <section style="max-width: 1280px; margin: 0 auto; padding: 120px 24px 80px;">
    <h1 style="font-size: clamp(32px, 5vw, 56px); font-weight: 700; letter-spacing: -0.04em; margin: 0 0 20px 0;">
      Welcome to My Portfolio
    </h1>
    <p style="font-size: 20px; color: #8A9CC8; margin: 0 0 40px 0; max-width: 600px;">
      I build beautiful, data-driven digital experiences. Let's create something amazing together.
    </p>
    <a href="/contact.html" style="display: inline-block; padding: 14px 28px; background: #00CFFF; color: #0A0F1E; border-radius: 8px; font-weight: 600;">
      Start a Project
    </a>
  </section>

  <!-- About Section -->
  <section style="max-width: 1280px; margin: 0 auto; padding: 60px 24px;">
    <h2 style="font-size: 32px; margin: 0 0 40px 0;">About Me</h2>
    <p style="color: #8A9CC8; line-height: 1.8; font-size: 18px; max-width: 800px;">
      Your background, expertise, and what you're passionate about...
    </p>
  </section>

  <!-- Featured Work -->
  <section style="max-width: 1280px; margin: 0 auto; padding: 60px 24px;">
    <h2 style="font-size: 32px; margin: 0 0 40px 0;">Featured Work</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
      <!-- Project cards here -->
    </div>
  </section>

  <!-- Footer -->
  <footer style="background: #0F1629; padding: 40px 24px; text-align: center; color: #8A9CC8;">
    <p>&copy; 2026 Your Name. All rights reserved.</p>
  </footer>
</body>
</html>
```

### Days 3-4: Build Supporting Pages

**3.1 Create blog.html** (structure below)
**3.2 Create projects.html** (structure below)
**3.3 Create contact.html** (structure below)

```html
<!-- blog.html structure -->
<main style="max-width: 1280px; margin: 0 auto; padding: 120px 24px 80px;">
  <h1>Blog</h1>
  
  <!-- Search -->
  <input type="text" id="search" placeholder="Search articles..." style="width: 100%; max-width: 400px; padding: 12px 16px; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #F0F4FF;">
  
  <!-- Category Filters -->
  <div style="display: flex; gap: 8px; margin: 24px 0; flex-wrap: wrap;">
    <button data-filter="all">All</button>
    <button data-filter="analytics">Analytics</button>
    <button data-filter="design">Design</button>
    <button data-filter="dev">Dev</button>
  </div>
  
  <!-- Articles Grid -->
  <div id="posts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
    <!-- Articles loaded here -->
  </div>
</main>
```

**Days 3-4 Checklist:**
- [ ] blog.html with search & filters
- [ ] projects.html with portfolio grid
- [ ] contact.html with form
- [ ] All pages linked in navbar
- [ ] Mobile responsive tested
- [ ] Consistent styling across pages

---

## Weeks 2-3: Content & Features

### Week 2: Analytics Setup

**4.1 Create Google Tag Manager Account**
1. Go to https://tagmanager.google.com
2. Create new container
3. Get Container ID (GTM-XXXXXXX)
4. Save in `.env` or at top of document

**4.2 Add GTM to All Pages**
Add this to `<head>` of all HTML files:
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','YOUR_GTM_ID');</script>
<!-- End Google Tag Manager -->
```

**4.3 Create analytics.js**
```javascript
// analytics.js
function trackEvent(eventName, eventData) {
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    });
  }
}

// Page View
function trackPageView() {
  trackEvent('page_view', {
    page_title: document.title,
    page_path: window.location.pathname,
    page_location: window.location.href
  });
}

// Content Engagement
function trackContentClick(contentType, contentId, contentName) {
  trackEvent('select_content', {
    content_type: contentType,
    content_id: contentId,
    content_name: contentName
  });
}

// Form Submit
function trackFormSubmit(formName) {
  trackEvent('generate_lead', {
    form_name: formName
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', trackPageView);
```

Add to every page: `<script src="/analytics.js"></script>`

**4.4 Create measurement_plan.html**
Simple version to document events:
```html
<!-- measurement_plan.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Analytics Measurement Plan</title>
  <style>
    body { background: #0A0F1E; color: #F0F4FF; font-family: Inter, sans-serif; padding: 40px; }
    h1 { color: #00CFFF; }
    .event { background: #0F1629; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 3px solid #00CFFF; }
    .event h3 { margin-top: 0; }
    code { background: #162038; padding: 2px 6px; border-radius: 4px; color: #00FFB3; }
  </style>
</head>
<body>
  <h1>📊 Analytics Measurement Plan</h1>
  
  <div class="event">
    <h3>page_view</h3>
    <p>Fired on every page load</p>
    <code>dataLayer.push({ event: 'page_view', page_title: '...', page_path: '...' })</code>
  </div>
  
  <div class="event">
    <h3>select_content</h3>
    <p>Fired when user clicks on content (blog, project)</p>
    <code>dataLayer.push({ event: 'select_content', content_type: '...', content_id: '...', content_name: '...' })</code>
  </div>
  
  <div class="event">
    <h3>generate_lead</h3>
    <p>Fired when contact form is submitted</p>
    <code>dataLayer.push({ event: 'generate_lead', form_name: 'contact' })</code>
  </div>
</body>
</html>
```

### Week 3: Blog System

**5.1 Create Blog Article Template**
Create `/blog/first-article.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Article Title | Your Brand</title>
  <meta name="description" content="155 character description...">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { background: #0A0F1E; color: #F0F4FF; font-family: Inter, sans-serif; }
    h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
    .prose { max-width: 780px; margin: 0 auto; color: #8A9CC8; line-height: 1.8; }
    .prose h2 { color: #F0F4FF; font-size: 28px; margin: 2em 0 0.8em; }
    .prose h3 { color: #F0F4FF; font-size: 22px; margin: 1.5em 0 0.6em; }
    .prose p { margin: 0 0 1.5em; }
    .prose strong { color: #F0F4FF; font-weight: 600; }
    .prose code { background: #162038; color: #00FFB3; padding: 2px 6px; border-radius: 4px; }
    .prose pre { background: #0F1629; padding: 16px; border-radius: 8px; overflow-x: auto; }
    .tag-primary { background: rgba(0,207,255,0.1); color: #00CFFF; border: 1px solid rgba(0,207,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; margin-right: 8px; }
  </style>
</head>
<body>
  <!-- Navbar -->
  <header style="position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,15,30,0.9);">
    <nav style="max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 64px;">
      <a href="../" style="font-weight: 700;">YourBrand</a>
      <div style="display: flex; gap: 4px;">
        <a href="../index.html" style="padding: 8px 14px;">Home</a>
        <a href="../blog.html" style="padding: 8px 14px;">Blog</a>
        <a href="../projects.html" style="padding: 8px 14px;">Projects</a>
        <a href="../contact.html" style="padding: 8px 14px; background: rgba(0,207,255,0.1);">Contact</a>
      </div>
    </nav>
  </header>

  <main style="max-width: 780px; margin: 0 auto; padding: 120px 24px 80px;">
    <a href="../blog.html" style="font-size: 14px; color: #8A9CC8; text-decoration: none; margin-bottom: 40px; display: block;">← Back to Blog</a>

    <!-- Meta -->
    <div style="margin-bottom: 30px;">
      <span class="tag-primary">Analytics</span>
      <span style="font-size: 12px; color: #4D5E87;">5 min read</span>
      <span style="font-size: 12px; color: #4D5E87;">·</span>
      <time style="font-size: 12px; color: #4D5E87;">May 8, 2026</time>
    </div>

    <!-- Title -->
    <h1 style="font-size: 42px; font-weight: 700; letter-spacing: -0.04em; color: #F0F4FF; margin: 0 0 20px 0; line-height: 1.2;">
      Your Article Title Goes Here
    </h1>

    <!-- Description -->
    <p style="font-size: 18px; color: #8A9CC8; line-height: 1.7; margin: 0 0 40px 0;">
      A compelling one or two sentence summary of what this article covers.
    </p>

    <!-- Cover Image -->
    <img src="https://placehold.co/780x450/0F1629/00CFFF?text=Article+Cover" alt="Article Cover" style="width: 100%; border-radius: 12px; margin: 40px 0;">

    <!-- Article Content -->
    <div class="prose">
      <h2>Introduction</h2>
      <p>Your article content starts here. Write naturally, focusing on providing value to readers.</p>

      <h2>Main Section 1</h2>
      <p>Use h2 for major sections.</p>
      <h3>Subsection</h3>
      <p>Use h3 for subsections within a major section.</p>

      <h2>Main Section 2</h2>
      <p>Continue writing your content...</p>

      <h2>Conclusion</h2>
      <p>Wrap up with key takeaways.</p>
    </div>

    <!-- Author -->
    <div style="background: #0F1629; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 24px; margin: 60px 0;">
      <h3 style="color: #F0F4FF; margin-top: 0;">About the Author</h3>
      <p style="color: #8A9CC8; margin: 0;">Your bio and expertise here.</p>
      <a href="https://linkedin.com/in/yourprofile" style="color: #00CFFF; text-decoration: none;">→ Connect on LinkedIn</a>
    </div>

    <!-- Newsletter Signup -->
    <div style="background: rgba(0,207,255,0.05); border: 1px solid rgba(0,207,255,0.2); border-radius: 12px; padding: 32px; margin: 60px 0; text-align: center;">
      <h3 style="color: #F0F4FF; margin-top: 0;">Subscribe to My Newsletter</h3>
      <p style="color: #8A9CC8;">Get insights on analytics, design, and building with AI.</p>
      <form style="display: flex; gap: 8px;">
        <input type="email" placeholder="your@email.com" style="flex: 1; padding: 12px 16px; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #F0F4FF;">
        <button type="submit" style="padding: 12px 28px; background: #00CFFF; color: #0A0F1E; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Subscribe</button>
      </form>
    </div>
  </main>

  <script src="../analytics.js"></script>
  <script>
    // Track article view
    trackEvent('select_content', {
      content_type: 'blog_article',
      content_id: 'first-article',
      content_name: 'Article Title'
    });
  </script>
</body>
</html>
```

**5.2 Add Article Card to blog.html**
```html
<!-- Add to #posts-grid in blog.html -->
<article onclick="location.href='blog/first-article.html'; trackEvent('select_content', {content_type:'blog_card',content_id:'first-article',content_name:'Article Title',item_list_name:'blog_listing'})" style="background: #0F1629; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 24px; cursor: pointer; overflow: hidden; display: flex; flex-direction: column;">
  <div style="aspect-ratio: 16/9; background: #162038; border-radius: 8px; margin: -24px -24px 16px; display: flex; align-items: center; justify-content: center; color: #4D5E87;">
    [Article Preview]
  </div>
  <div style="display: flex; gap: 8px; margin-bottom: 12px;">
    <span class="tag-primary">Analytics</span>
    <span style="font-size: 11px; color: #4D5E87;">5 min read</span>
  </div>
  <h3 style="color: #F0F4FF; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">Article Title</h3>
  <p style="color: #8A9CC8; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0; flex: 1;">Brief description or excerpt of the article.</p>
  <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
    <time style="font-size: 12px; color: #4D5E87;">May 8, 2026</time>
    <span style="font-size: 12px; color: #4D5E87;">Read →</span>
  </div>
</article>
```

---

## Weeks 4-5: Backend & Analytics

### Week 4: Supabase Setup

**6.1 Create Supabase Account**
1. Go to https://supabase.com
2. Create new project
3. Copy API URL and anon key

**6.2 Create Database Tables**
```sql
-- Subscribers table
CREATE TABLE subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  subscribed_at timestamptz default now(),
  confirmed boolean default false
);

-- Post comments table
CREATE TABLE post_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  comment_text text not null,
  created_at timestamptz default now()
);

-- Post likes table
CREATE TABLE post_likes (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  user_identifier text,
  created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies (anon can insert)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON post_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON post_likes
  FOR INSERT WITH CHECK (true);
```

**6.3 Add Supabase Client to Blog Articles**
```html
<!-- Add before closing </body> in article pages -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<script>
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  // Like button function
  async function toggleLike(postSlug) {
    const { data, error } = await supabaseClient
      .from('post_likes')
      .insert([{ post_slug: postSlug, user_identifier: 'anonymous' }])
      .select();
    if (!error) {
      document.querySelector(`[data-likes="${postSlug}"]`).textContent = 
        parseInt(document.querySelector(`[data-likes="${postSlug}"]`).textContent) + 1;
    }
  }

  // Comment submission
  async function submitComment(postSlug, commentText) {
    const { data, error } = await supabaseClient
      .from('post_comments')
      .insert([{ post_slug: postSlug, comment_text: commentText }])
      .select();
    if (!error) {
      alert('Comment added!');
      location.reload();
    }
  }
</script>
```

### Week 5: Advanced Features

**7.1 Create Resend Account** (for email)
1. Go to https://resend.com
2. Create account
3. Get API key

**7.2 Create Contact Form Handler**
Simple HTML form that works without backend:
```html
<!-- contact.html -->
<form onsubmit="handleContactSubmit(event)" style="max-width: 600px; margin: 0 auto;">
  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 8px; color: #F0F4FF; font-weight: 500;">Name</label>
    <input type="text" name="name" required style="width: 100%; padding: 12px 16px; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #F0F4FF;">
  </div>

  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 8px; color: #F0F4FF; font-weight: 500;">Email</label>
    <input type="email" name="email" required style="width: 100%; padding: 12px 16px; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #F0F4FF;">
  </div>

  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 8px; color: #F0F4FF; font-weight: 500;">Message</label>
    <textarea name="message" required rows="6" style="width: 100%; padding: 12px 16px; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #F0F4FF; font-family: inherit;"></textarea>
  </div>

  <button type="submit" style="padding: 12px 28px; background: #00CFFF; color: #0A0F1E; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Send Message</button>
</form>

<script>
async function handleContactSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  // Simple approach: store in localStorage for demo
  // In production, send to backend/Supabase
  const submission = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    timestamp: new Date().toISOString()
  };
  
  // Track event
  trackEvent('generate_lead', {
    form_name: 'contact_form',
    form_destination: 'email'
  });
  
  alert('Thank you! I\'ll get back to you soon.');
  e.target.reset();
}
</script>
```

---

## Week 6: Polish & Deploy

### Day 1-2: SEO & Meta Tags

**8.1 Add SEO to All Pages**
```html
<!-- Head of each page -->
<title>Page Title | Your Brand</title>
<meta name="description" content="155 character description with keywords...">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description...">
<meta property="og:image" content="https://placehold.co/1200x630/...">
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">
```

**8.2 Create sitemap.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2026-05-08</lastmod>
  </url>
  <url>
    <loc>https://yoursite.com/blog.html</loc>
  </url>
  <url>
    <loc>https://yoursite.com/blog/article-1.html</loc>
  </url>
  <!-- Add all pages -->
</urlset>
```

**8.3 Create robots.txt**
```
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

### Day 3-4: Testing & Optimization

**9.1 Test on Mobile**
- Use Chrome DevTools (F12 → Toggle device toolbar)
- Test all pages at 375px, 768px, 1280px widths
- Check touch targets (min 48px)
- Verify readability

**9.2 Lighthouse Audit**
- Right-click → Inspect → Lighthouse tab
- Aim for: Performance >85, SEO 100, Accessibility >90
- Fix any reported issues

**9.3 Test Analytics**
1. Open DevTools (F12)
2. Go to Console
3. Type `dataLayer` and press Enter
4. Verify events appear as you navigate

### Day 5-7: Deployment

**10.1 Push to GitHub**
```bash
git add .
git commit -m "Initial portfolio launch"
git branch -M main
git remote add origin https://github.com/yourname/your-portfolio.git
git push -u origin main
```

**10.2 Deploy to Vercel**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Done! Site is live at `yourname.vercel.app`

**10.3 Connect Custom Domain** (optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records at your registrar
4. Wait 24-48 hours for propagation

**10.4 Set Environment Variables** (if using backend)
1. Go to Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
3. Redeploy

---

## Timeline Checklist

### Week 1 ✓
- [ ] Repository created
- [ ] Directory structure set up
- [ ] CLAUDE.md created with brand guidelines
- [ ] index.html built and styled
- [ ] blog.html, projects.html, contact.html built
- [ ] All pages responsive
- [ ] Navigation working

### Week 2-3 ✓
- [ ] GTM account created and snippet added
- [ ] analytics.js created
- [ ] page_view events tracking
- [ ] measurement_plan.html created
- [ ] Blog article template created
- [ ] 3+ articles written and published
- [ ] Blog search working
- [ ] Blog filters working

### Week 4-5 ✓
- [ ] Supabase account created
- [ ] Database tables created
- [ ] Blog likes working
- [ ] Blog comments working
- [ ] Newsletter form created
- [ ] Contact form functional
- [ ] All interactive features tested

### Week 6 ✓
- [ ] SEO tags added to all pages
- [ ] sitemap.xml created
- [ ] robots.txt created
- [ ] Mobile testing complete
- [ ] Lighthouse audit passed
- [ ] Analytics verified working
- [ ] Code committed to GitHub
- [ ] Deployed to Vercel
- [ ] Live at custom domain (if applicable)

---

## Estimated Time Investment

| Task | Time |
|------|------|
| Setup & Planning | 4 hours |
| Home Page | 6 hours |
| Supporting Pages | 8 hours |
| Analytics Setup | 4 hours |
| Blog System | 12 hours |
| Content Writing | 20 hours |
| Backend Integration | 8 hours |
| Testing & Polish | 8 hours |
| Deployment | 4 hours |
| **TOTAL** | **74 hours (9.25 days)** |

**Part-time pace**: 2-3 hours/day = 4-6 weeks  
**Full-time pace**: 8 hours/day = ~10 days

---

## Common Mistakes to Avoid

1. **Don't** hardcode colors—use CSS variables or Tailwind utilities
2. **Don't** skip mobile testing—build mobile-first
3. **Don't** add analytics later—plan from the start
4. **Don't** copy other people's copy—write your own voice
5. **Don't** use generic stock photos—use Unsplash or create custom visuals
6. **Don't** forget SEO meta tags—essential for discoverability
7. **Don't** deploy without testing forms—especially contact & email
8. **Don't** ignore accessibility—test with keyboard navigation

---

## Next Steps After Launch

1. **Write 1-2 articles per month** on your expertise
2. **Monitor analytics** in Google Analytics 4
3. **Update SEO** based on search patterns
4. **Gather feedback** from visitors
5. **Iterate on design** based on user behavior
6. **Expand features** (portfolio filters, project detail, etc.)
7. **Build email list** through newsletter
8. **Promote content** on LinkedIn, Twitter, etc.

---

## Resources

- **Claude Code**: https://claude.ai/code (get started here!)
- **Tailwind CSS**: https://tailwindcss.com
- **Google Fonts**: https://fonts.google.com
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GTM Setup**: https://tagmanager.google.com
- **Placehold.co** (images): https://placehold.co

---

**Good luck building! You've got this.** 🚀
