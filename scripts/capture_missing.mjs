/**
 * capture_missing.mjs — captures only the screenshots missing from the last task
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';
const OUT  = './measurement_plan/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const delay = ms => new Promise(r => setTimeout(r, ms));

async function shoot(page, { url, file, label, selector }) {
  try {
    await page.goto(BASE + url, { waitUntil: 'networkidle0', timeout: 20000 });
    await delay(600);

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

    await page.screenshot({ path: path.join(OUT, file), fullPage: false });

    if (selector) {
      await page.evaluate(() => { const e = document.getElementById('__hl__'); if (e) e.remove(); });
    }

    console.log(`✓  ${label}`);
  } catch (err) {
    console.warn(`✗  ${label} — ${err.message}`);
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const shots = [
    // PAGE VIEW — missing blog posts
    { url: '/blog/analytics-doc-automation.html',  file: 'pv_blog_doc_automation.png',  label: 'page_view — Analytics Doc Automation' },
    { url: '/blog/portfolio-security-audit.html',  file: 'pv_blog_security.png',         label: 'page_view — Portfolio Security Audit' },
    // SELECT CONTENT — new blog card in listing
    {
      url: '/blog.html',
      file: 'sc_blog_card_doc_auto.png',
      label: 'select_content — Blog card: Analytics Doc Automation',
      selector: 'article[onclick*="analytics-doc-automation"]',
    },
  ];

  for (const s of shots) await shoot(page, s);

  await browser.close();
  console.log('\nDone.');
})();
