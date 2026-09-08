#!/usr/bin/env node
/**
 * Add Open Graph meta tags to all blog posts for better SEO and social sharing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, '../blog');

// Pattern to find title tag
const TITLE_PATTERN = /<title>([^<]+)<\/title>/;
const META_DESCRIPTION_PATTERN = /<meta name="description" content="([^"]+)"/;

// OG tags template
function generateOGTags(title, description, slug) {
  const url = `https://tnkproject.com/blog/${slug}`;
  const ogImage = `https://tnkproject.com/assets/og/og-image.png`;

  return `<meta name="description" content="${description}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:url" content="${url}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${ogImage}" />`;
}

// Get all HTML files in blog directory
const files = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(blogDir, f));

console.log(`Processing ${files.length} blog posts...\n`);

files.forEach((filePath) => {
  const fileName = path.basename(filePath);
  const slug = fileName.replace('.html', '');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract title from <title> tag
  const titleMatch = content.match(TITLE_PATTERN);
  if (!titleMatch) {
    console.log(`⚠️  ${fileName} — No title tag found, skipping`);
    return;
  }

  const fullTitle = titleMatch[1];
  const title = fullTitle.replace(' | TNK – Design & Analytics', '').trim();

  // Extract description from meta tag
  let description = '';
  const descMatch = content.match(META_DESCRIPTION_PATTERN);
  if (descMatch) {
    description = descMatch[1];
  } else {
    // Fallback: use first 155 characters from first paragraph
    const pMatch = content.match(/<p>([^<]+)<\/p>/);
    if (pMatch) {
      description = pMatch[1].substring(0, 155);
    } else {
      description = 'Read this article on TNK – Design & Analytics';
    }
  }

  // Check if OG tags already exist
  if (content.includes('og:title') && content.includes('og:image')) {
    console.log(`✓ ${fileName} — Already has OG tags`);
    return;
  }

  // Generate new OG tags
  const ogTags = generateOGTags(title, description, slug);

  // Find where to insert OG tags (after <title> tag)
  const titleEndIndex = content.indexOf('</title>');
  if (titleEndIndex === -1) {
    console.log(`❌ ${fileName} — Could not find </title> tag`);
    return;
  }

  // Remove old meta description if exists
  content = content.replace(/<meta name="description"[^>]*>\n?/g, '');

  // Insert OG tags after </title>
  const newContent =
    content.substring(0, titleEndIndex + 8) +
    '\n' + ogTags + '\n' +
    content.substring(titleEndIndex + 8);

  fs.writeFileSync(filePath, newContent);
  console.log(`✅ ${fileName} — OG tags added`);
});

console.log(`\n✨ Complete! All blog posts now have Open Graph tags.`);
