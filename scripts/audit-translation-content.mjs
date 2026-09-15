#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Función para extraer texto de HTML manteniendo estructura
function extractTranslatableContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Remove script tags, style tags, comments
  let cleaned = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/data-track='[^']*'/g, ''); // Remove tracking attrs

  // Extract text nodes (simplified)
  const textPattern = />[^<]*</g;
  const matches = cleaned.match(textPattern) || [];

  const textNodes = matches
    .map(m => m.slice(1, -1).trim())
    .filter(t => t.length > 0 && t.length < 500 && !t.match(/^[\s\d\-_.,]*$/));

  return textNodes;
}

// Get all HTML files
const htmlFiles = [];
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file.endsWith('.html')) {
      htmlFiles.push(fullPath);
    } else if (fs.statSync(fullPath).isDirectory() && !file.startsWith('.')) {
      walkDir(fullPath);
    }
  });
}

walkDir(projectRoot);

console.log(`\n📊 TRANSLATION CONTENT AUDIT\n`);
console.log(`Total HTML files: ${htmlFiles.length}\n`);

const summary = {
  totalFiles: htmlFiles.length,
  filesWithContent: [],
  totalTextNodes: 0,
  contentByFile: {}
};

htmlFiles.forEach(filePath => {
  const relPath = path.relative(projectRoot, filePath);
  try {
    const content = extractTranslatableContent(filePath);

    if (content.length > 0) {
      summary.filesWithContent.push({
        file: relPath,
        textNodeCount: content.length
      });
      summary.totalTextNodes += content.length;
      summary.contentByFile[relPath] = content.slice(0, 5); // First 5 items

      console.log(`✅ ${relPath}`);
      console.log(`   Found ${content.length} text nodes`);
      console.log(`   Samples: ${content.slice(0, 2).join(' | ')}\n`);
    }
  } catch (e) {
    console.log(`❌ ${relPath} - Error: ${e.message}\n`);
  }
});

console.log(`\n📈 SUMMARY`);
console.log(`Files with translatable content: ${summary.filesWithContent.length}`);
console.log(`Total text nodes found: ${summary.totalTextNodes}`);
console.log(`Average text nodes per file: ${Math.round(summary.totalTextNodes / summary.filesWithContent.length)}`);

// Save summary
fs.writeFileSync(
  path.join(projectRoot, 'scripts/audit-results.json'),
  JSON.stringify(summary, null, 2)
);

console.log(`\n✅ Results saved to scripts/audit-results.json`);
