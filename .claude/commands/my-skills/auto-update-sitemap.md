# Auto-Update Sitemap Skill

Regenerate the sitemap.xml automatically whenever HTML pages are added or modified.

## How it works

The system includes two components:

### 1. **Manual Command** (`update-sitemap`)
Run at any time to refresh the sitemap:
```bash
node scripts/generate-sitemap.mjs
```

### 2. **Automatic Hook**
The `.claude/hooks/post-file-edit.sh` hook monitors for HTML file changes and automatically runs the sitemap generator.

## What gets indexed

The sitemap automatically discovers and indexes:
- **Homepage** (`index.html`) - Priority 1.0
- **Blog listing** (`blog.html`) - Priority 0.9
- **Blog posts** (`blog/*.html`) - Priority 0.8, with publication dates extracted
- **Projects listing** (`projects.html`) - Priority 0.9
- **Project pages** (`projects/*.html`) - Priority 0.8
- **Other pages** (`contact.html`, etc.) - Priority 0.5

## Date extraction

The script automatically extracts publication dates from HTML content in the format:
- `Month Day, Year` (e.g., "March 15, 2024")

If a date is found, it's added to the sitemap's `<lastmod>` tag for better SEO.

## Best practices

1. **After creating new pages**: The sitemap updates automatically on commit
2. **Manual updates**: Run `node scripts/generate-sitemap.mjs` if you need immediate updates
3. **Date format**: Use "Month Day, Year" format in your HTML for automatic date extraction
4. **No configuration needed**: The script works out of the box

## Files involved

- `scripts/generate-sitemap.mjs` - The main generator script
- `.claude/hooks/post-file-edit.sh` - Automatic trigger hook
- `.claude/commands/update-sitemap.md` - Command documentation
