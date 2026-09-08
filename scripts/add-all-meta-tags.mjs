#!/usr/bin/env node
/**
 * Add comprehensive meta tags to all HTML pages
 * Includes: SEO, Security, Social, Performance, Accessibility, PWA, Analytics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const SKIP_PATTERNS = ['node_modules', '.git', 'temporary', 'archive/'];

function getUrlPath(filePath) {
  const relative = path.relative(projectRoot, filePath);
  const normalized = relative.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  return '/' + normalized;
}

function generateComprehensiveMeta(title, description, urlPath, isArticle = false) {
  const url = `https://tnkproject.com${urlPath}`;
  const ogImage = `https://tnkproject.com/assets/og/og-image.png`;

  let meta = '';

  // ═══ SEO TAGS ═══
  meta += `
<!-- SEO Meta Tags -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<link rel="canonical" href="${url}" />
<link rel="sitemap" href="https://tnkproject.com/sitemap.xml" />`;

  if (isArticle) {
    meta += `
<meta property="article:published_time" content="2024-09-08" />
<meta property="article:modified_time" content="2024-09-08" />
<meta property="article:author" content="https://tnkproject.com" />`;
  }

  // ═══ SECURITY TAGS ═══
  meta += `
<!-- Security Meta Tags -->
<meta name="referrer" content="strict-no-referrer-when-downgrade" />`;

  // ═══ DEVICE & BROWSER TAGS ═══
  meta += `
<!-- Device & Browser Tags -->
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<meta name="theme-color" content="#00CFFF" />
<meta name="color-scheme" content="dark light" />
<meta name="msapplication-config" content="/browserconfig.xml" />
<meta name="msapplication-TileColor" content="#0A0F1E" />`;

  // ═══ PWA & MANIFEST ═══
  meta += `
<!-- Progressive Web App -->
<link rel="manifest" href="/site.webmanifest" />`;

  // ═══ PERFORMANCE TAGS ═══
  meta += `
<!-- Performance Optimization -->
<link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`;

  // ═══ SOCIAL MEDIA EXTENDED ═══
  meta += `
<!-- Social Media Meta Tags -->
<meta property="og:locale" content="es_ES" />
<meta property="og:site_name" content="TNK – Design & Analytics" />
<meta name="twitter:creator" content="@tnkproject" />
<meta name="twitter:site" content="@tnkproject" />`;

  // ═══ STRUCTURED DATA ═══
  meta += `
<!-- Schema.org Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${isArticle ? 'BlogPosting' : 'WebPage'}",
  "name": "${title.replace(/"/g, '\\"')}",
  "description": "${description.replace(/"/g, '\\"')}",
  "url": "${url}",
  "image": "${ogImage}",
  "publisher": {
    "@type": "Organization",
    "name": "TNK – Design & Analytics",
    "url": "https://tnkproject.com",
    "logo": "https://tnkproject.com/assets/og/og-image.png"
  }${isArticle ? `,
  "author": {
    "@type": "Organization",
    "name": "TNK – Design & Analytics"
  },
  "datePublished": "2024-09-08",
  "dateModified": "2024-09-08"` : ''}
}
</script>`;

  // ═══ OTHER USEFUL TAGS ═══
  meta += `
<!-- Additional Meta Tags -->
<meta name="format-detection" content="telephone=no" />
<meta name="copyright" content="© 2024 TNK. All rights reserved." />
<meta name="author" content="TNK – Design & Analytics" />
<meta name="reply-to" content="hola@tnkproject.com" />`;

  return meta;
}

// Find all HTML files
const allFiles = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (SKIP_PATTERNS.some(pattern => fullPath.includes(pattern))) return;

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      allFiles.push(fullPath);
    }
  });
}

walkDir(projectRoot);

console.log(`Processing ${allFiles.length} HTML files...\n`);

let updated = 0;
let skipped = 0;

allFiles.forEach((filePath) => {
  const fileName = path.relative(projectRoot, filePath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    console.log(`⚠️  ${fileName} — No title tag`);
    return;
  }

  const fullTitle = titleMatch[1];

  // Extract description
  let description = '';
  const metaDescMatch = content.match(/<meta name="description" content="([^"]+)"/);
  if (metaDescMatch) {
    description = metaDescMatch[1];
  } else {
    description = fullTitle;
  }

  // Check if already has comprehensive meta (look for Schema.org)
  if (content.includes('schema.org') && content.includes('@type')) {
    skipped++;
    return;
  }

  const urlPath = getUrlPath(filePath);
  const isArticle = filePath.includes('/blog/') && !filePath.includes('blog.html');

  // Generate new meta tags
  const newMeta = generateComprehensiveMeta(fullTitle, description, urlPath, isArticle);

  // Remove old meta description
  content = content.replace(/<meta name="description"[^>]*>\n?/g, '');

  // Remove old OG tags and schema (keep only title, then add comprehensive set)
  content = content.replace(/<meta property="og:[^"]*"[^>]*>\n?/g, '');
  content = content.replace(/<meta name="twitter:[^"]*"[^>]*>\n?/g, '');
  content = content.replace(/<link rel="canonical"[^>]*>\n?/g, '');
  content = content.replace(/<link rel="sitemap"[^>]*>\n?/g, '');
  content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');

  // Find </title> and insert meta tags
  const titleEndIndex = content.indexOf('</title>');
  if (titleEndIndex === -1) {
    console.log(`❌ ${fileName} — Could not find </title>`);
    return;
  }

  const newContent =
    content.substring(0, titleEndIndex + 8) +
    '\n' + newMeta + '\n' +
    content.substring(titleEndIndex + 8);

  fs.writeFileSync(filePath, newContent);
  updated++;
  console.log(`✅ ${fileName}`);
});

console.log(`\n✨ Complete!`);
console.log(`  Updated: ${updated}`);
console.log(`  Already had comprehensive meta: ${skipped}`);
console.log(`  Total: ${allFiles.length}`);
