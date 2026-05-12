# Update Sitemap

Automatically detects all HTML pages in the project and updates `sitemap.xml` to include them with proper priorities and timestamps.

## What it does
- Scans `blog/`, `projects/`, and root directory for new HTML files
- Extracts publication dates from page content
- Generates an updated `sitemap.xml` with proper SEO metadata
- Detects new pages automatically and adds them without manual configuration

## When to use
- After adding new blog posts
- After creating new project pages
- Manually refresh the sitemap

## Usage
Run this command before committing:
```bash
node scripts/generate-sitemap.mjs
```

## Configuration
The script is self-contained and requires no configuration. It automatically:
- Sets homepage priority to 1.0
- Sets listing pages (blog.html, projects.html) priority to 0.9
- Sets content pages priority to 0.8
- Sets other pages priority to 0.5
- Extracts dates in format "Month Day, Year" (e.g., "Mar 1, 2024")
