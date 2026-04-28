#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://tnkproject.com';

// Parse date strings like "Mar 1, 2024" or "Feb 15, 2024" to ISO format
function parseDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\w+)\s+(\d+),\s+(\d{4})/);
  if (!match) return null;
  const [, month, day, year] = match;
  const months = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  return `${year}-${months[month]}-${day.padStart(2, '0')}`;
}

// Extract the first date-like string from HTML
function extractDateFromHTML(content) {
  const patterns = [
    /(\w+)\s+(\d+),\s+(\d{4})/g,  // "Mar 1, 2024"
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return parseDate(match[0]);
    }
  }
  return null;
}

// Build sitemap entry
function createSitemapEntry(url, lastmod, priority = '0.8') {
  let entry = `  <url>\n    <loc>${url}</loc>\n`;
  if (lastmod) {
    entry += `    <lastmod>${lastmod}</lastmod>\n`;
  }
  entry += `    <changefreq>weekly</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;
  entry += `  </url>\n`;
  return entry;
}

// Main generation
async function generateSitemap() {
  const entries = [];

  // Homepage
  entries.push(createSitemapEntry(DOMAIN, null, '1.0'));

  // Blog listing page
  entries.push(createSitemapEntry(`${DOMAIN}/blog.html`, null, '0.9'));

  // Blog posts
  const blogDir = path.join(ROOT, 'blog');
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir)
      .filter(f => f.endsWith('.html') && f !== 'index.html')
      .sort();

    for (const file of files) {
      const slug = file.replace('.html', '');
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const date = extractDateFromHTML(content);

      entries.push(createSitemapEntry(`${DOMAIN}/blog/${slug}.html`, date, '0.8'));
    }
  }

  // Projects listing page
  entries.push(createSitemapEntry(`${DOMAIN}/projects.html`, null, '0.9'));

  // Project pages
  const projectsDir = path.join(ROOT, 'projects');
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir)
      .filter(f => f.endsWith('.html') && f !== 'index.html')
      .sort();

    for (const file of files) {
      const slug = file.replace('.html', '');
      const filePath = path.join(projectsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const date = extractDateFromHTML(content);

      entries.push(createSitemapEntry(`${DOMAIN}/projects/${slug}.html`, date, '0.8'));
    }
  }

  // Contact page
  entries.push(createSitemapEntry(`${DOMAIN}/contact.html`, null, '0.5'));

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}</urlset>`;

  const outputPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');

  console.log(`✓ Generated sitemap.xml with ${entries.length} entries`);
  console.log(`  Output: ${outputPath}`);
}

generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
