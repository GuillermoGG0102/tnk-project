/**
 * capture_pe_screenshots.mjs
 * Captures the 3 post_engagement screenshots using Playwright.
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright/index.js');
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';
const OUT  = './measurement_plan/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const delay = ms => new Promise(r => setTimeout(r, ms));

async function shoot(page, { url, file, label, selector, scrollToBottom }) {
  try {
    await page.goto(BASE + url, { waitUntil: 'commit', timeout: 20000 });
    await delay(1200);

    if (scrollToBottom) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(500);
    }

    if (selector) {
      const found = await page.evaluate(sel => {
        const el = document.querySelector(sel);
        if (!el) return false;
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      }, selector);
      if (!found) console.warn(`  ⚠  not found: ${selector}`);
      await delay(300);

      await page.evaluate(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const pad = 6;
        const div = document.createElement('div');
        div.id = '__hl__';
        div.style.cssText = [
          'position:fixed',
          `top:${r.top - pad}px`,
          `left:${r.left - pad}px`,
          `width:${r.width + pad * 2}px`,
          `height:${r.height + pad * 2}px`,
          'border:3px solid #FF3B3B',
          'border-radius:6px',
          'pointer-events:none',
          'z-index:2147483647',
          'box-shadow:0 0 0 4px rgba(255,59,59,0.2)',
        ].join(';');
        document.body.appendChild(div);
      }, selector);
    }

    await page.screenshot({ path: path.join(OUT, file), fullPage: false, timeout: 0 });

    if (selector) {
      await page.evaluate(() => { const e = document.getElementById('__hl__'); if (e) e.remove(); });
    }

    console.log(`✓  ${label}`);
  } catch (err) {
    console.warn(`✗  ${label} — ${err.message.split('\n')[0]}`);
  }
}

(async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process'],
    timeout: 30000,
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('\n── post_engagement ────────────────────────────────────────────');

  // pe_like.png — heart button in default (unliked) state
  await shoot(page, {
    url: '/blog/beautiful-dashboards.html',
    file: 'pe_like.png',
    label: 'post_engagement — Like button (unliked state)',
    selector: '#like-btn',
  });

  // pe_unlike.png — heart button in active (liked) state
  await page.goto(BASE + '/blog/beautiful-dashboards.html', { waitUntil: 'commit', timeout: 20000 });
  await delay(1200);
  await page.evaluate(() => {
    const btn  = document.getElementById('like-btn');
    const icon = document.getElementById('heart-icon');
    const count = document.getElementById('like-count');
    if (btn)  { btn.style.borderColor = 'rgba(255,77,109,0.6)'; btn.style.color = '#FF4D6D'; }
    if (icon) { icon.style.fill = '#FF4D6D'; icon.style.stroke = '#FF4D6D'; }
    if (count) count.textContent = '1 like';
  });
  await delay(200);
  await page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, '#like-btn');
  await delay(300);
  await page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 6;
    const div = document.createElement('div');
    div.id = '__hl__';
    div.style.cssText = [
      'position:fixed',
      `top:${r.top - pad}px`,
      `left:${r.left - pad}px`,
      `width:${r.width + pad * 2}px`,
      `height:${r.height + pad * 2}px`,
      'border:3px solid #FF3B3B',
      'border-radius:6px',
      'pointer-events:none',
      'z-index:2147483647',
      'box-shadow:0 0 0 4px rgba(255,59,59,0.2)',
    ].join(';');
    document.body.appendChild(div);
  }, '#like-btn');
  await page.screenshot({ path: path.join(OUT, 'pe_unlike.png'), fullPage: false, timeout: 0 });
  await page.evaluate(() => { const e = document.getElementById('__hl__'); if (e) e.remove(); });
  console.log('✓  post_engagement — Like button (liked/active state, ready to unlike)');

  // pe_comment.png — comment form
  await shoot(page, {
    url: '/blog/analytics-first-workflow.html',
    file: 'pe_comment.png',
    label: 'post_engagement — Comment form',
    selector: '#comment-form',
    scrollToBottom: true,
  });

  await browser.close();
  console.log('\n✅  PE screenshots saved to', OUT);
})();
