#!/usr/bin/env node
/**
 * Update all blog posts to use the secure Supabase backend proxy client
 * Replaces direct Supabase calls with backend API calls
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, '../blog');

// Posts already updated
const UPDATED_POSTS = ['getting-started-with-ga4.html'];

// Pattern to find and replace: the old Supabase script + code
const OLD_SUPABASE_PATTERN = /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2.*?<\/script>/s;

// New secure client script
const NEW_CLIENT_SCRIPT = '<script src="/js/likes-client.js"></script>';

// Function to extract POST_SLUG and POST_TITLE from the old code
function extractPostInfo(htmlContent) {
  const slugMatch = htmlContent.match(/var POST_SLUG='([^']+)'/);
  const titleMatch = htmlContent.match(/var POST_TITLE='([^']+)'/);
  return {
    slug: slugMatch ? slugMatch[1] : 'unknown',
    title: titleMatch ? titleMatch[1] : 'Unknown Title'
  };
}

// Generate new secure client code
function generateNewClientCode(slug, title) {
  return `<script src="/js/likes-client.js"></script>
<script>
(function(){
  var POST_SLUG='${slug}';
  var POST_TITLE='${title}';

  // Initialize likes from backend proxy
  window.initLikes(POST_SLUG);`;
}

// Find files to update
const files = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html') && !UPDATED_POSTS.includes(f))
  .map(f => path.join(blogDir, f));

console.log(`Found ${files.length} blog posts to update\n`);

files.forEach((filePath, idx) => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract post info before replacement
  const postInfo = extractPostInfo(content);

  // Find the Supabase script block and get the old code
  const supabaseMatch = content.match(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2[^>]*><\/script>\s*<script>([\s\S]*?)function renderComment/);

  if (supabaseMatch) {
    // Remove the Supabase CDN script and old code
    content = content.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2[^>]*><\/script>/, '');

    // Replace the old initialization code with the new secure client
    const newInit = generateNewClientCode(postInfo.slug, postInfo.title);
    content = content.replace(/<script>\s*\(function\(\)\{[\s\S]*?function renderComment/, newInit + `
  function renderComment`);

    fs.writeFileSync(filePath, content);
    console.log(`✅ ${fileName} — Updated (slug: ${postInfo.slug})`);
  } else {
    console.log(`⚠️  ${fileName} — Could not find old Supabase code, skipping`);
  }
});

console.log(`\n✅ Update complete!`);
