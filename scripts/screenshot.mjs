/**
 * screenshot.mjs
 * Takes a full-page screenshot of a URL and saves it to ./temporary screenshots/
 * Usage:  node screenshot.mjs <url> [label]
 * Output: ./temporary screenshots/screenshot-N.png
 *         ./temporary screenshots/screenshot-N-label.png  (if label provided)
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const dir   = './temporary screenshots';

fs.mkdirSync(dir, { recursive: true });

// Find the next available auto-increment index (never overwrite)
let n = 1;
while (fs.existsSync(path.join(dir, label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`))) n++;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath  = path.join(dir, filename);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page    = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
