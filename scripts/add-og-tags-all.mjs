#!/usr/bin/env node
/**
 * Add Open Graph meta tags to ALL HTML pages for complete SEO coverage
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Files to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.git',
  'temporary',
  'archive/'
];

// Map page paths to friendly descriptions
const PAGE_DESCRIPTIONS = {
  'index.html': 'Implementation, governance, and data quality in digital Web and App environments.',
  'blog.html': 'Analytics, AI & Digital Insights — Deep dives into analytics strategies, AI trends, design thinking, and competitive insights.',
  'projects.html': 'Web & App design, analytics implementation, and data governance solutions.',
  'contact.html': 'Get in touch with TNK for design and analytics solutions.',
  'measurement_plan/measurement_plan.html': 'Complete measurement plan with 6 GA4 events and 30+ parameters for analytics governance.',
  'measurement_plan/measurement_plan_standalone.html': 'Complete measurement plan with 6 GA4 events and 30+ parameters for analytics governance.',
  'tools/ga4-dashboard-background.html': 'GA4 Dashboard design mockup - backend visualization.',
  'tools/ga4-dashboard-mockup.html': 'GA4 Dashboard design mockup - interactive visualization.',
  'tools/linkedin-visual.html': 'LinkedIn visual content generator for TNK.',
  'projects/tnk-designs.html': 'TNK Design Portfolio - Web and App design projects.',
  'projects/tnk-portfolio-web.html': 'TNK Portfolio Website - Digital solutions and case studies.',
  'assets/brand/branding_guide.html': 'TNK Brand Guidelines - Logo, colors, typography, and design standards.'
};

function generateOGTags(title, description, urlPath) {
  const url = `https://tnkproject.com${urlPath}`;
  const ogImage = `https://tnkproject.com/assets/og/og-image.png`;

  return `<meta name="description" content="${description}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${ogImage}" />`;
}

function getUrlPath(filePath) {
  const relative = path.relative(projectRoot, filePath);
  const normalized = relative.replace(/\\/g, '/');

  if (normalized === 'index.html') {
    return '/';
  }
  return '/' + normalized;
}

// Find all HTML files
const allFiles = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Skip patterns
    if (SKIP_PATTERNS.some(pattern => fullPath.includes(pattern))) {
      return;
    }

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

  // Skip if already has OG tags
  if (content.includes('og:title') && content.includes('og:image')) {
    skipped++;
    return;
  }

  // Extract title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    console.log(`⚠️  ${fileName} — No title tag`);
    return;
  }

  const fullTitle = titleMatch[1];

  // Get description from PAGE_DESCRIPTIONS or from meta tag
  let description = PAGE_DESCRIPTIONS[fileName];

  if (!description) {
    // Try to extract from meta description tag
    const metaDescMatch = content.match(/<meta name="description" content="([^"]+)"/);
    if (metaDescMatch) {
      description = metaDescMatch[1];
    } else {
      // Fallback
      description = fullTitle;
    }
  }

  // Generate URL path
  const urlPath = getUrlPath(filePath);

  // Generate OG tags
  const ogTags = generateOGTags(fullTitle, description, urlPath);

  // Remove old meta description if it exists (but not the OG tags yet)
  content = content.replace(/<meta name="description" content="[^"]*"[^>]*>\n?/g, '');

  // Find </title> and insert OG tags after it
  const titleEndIndex = content.indexOf('</title>');
  if (titleEndIndex === -1) {
    console.log(`❌ ${fileName} — Could not find </title>`);
    return;
  }

  const newContent =
    content.substring(0, titleEndIndex + 8) +
    '\n' + ogTags + '\n' +
    content.substring(titleEndIndex + 8);

  fs.writeFileSync(filePath, newContent);
  updated++;
  console.log(`✅ ${fileName}`);
});

console.log(`\n✨ Complete!`);
console.log(`  Updated: ${updated}`);
console.log(`  Already had OG tags: ${skipped}`);
console.log(`  Total: ${allFiles.length}`);
