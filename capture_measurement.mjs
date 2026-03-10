/**
 * capture_measurement.mjs — v2
 * Captures screenshots for the measurement plan.
 * select_content: highlights the tracked element with a red box.
 * Run: node capture_measurement.mjs
 * Requires: node serve.mjs running on port 3000
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';
const OUT  = './measurement_plan/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const delay = ms => new Promise(r => setTimeout(r, ms));

// ── Highlight helper ────────────────────────────────────────────────────────
// Draws a red box around selector after optional scroll, then screenshots.
async function shoot(page, { url, file, label, selector, scrollY, scrollToBottom, preScroll }) {
  try {
    await page.goto(BASE + url, { waitUntil: 'networkidle0', timeout: 20000 });
    await delay(500);

    // 1. optional manual scroll first (for sections that need a bit of offset)
    if (scrollToBottom) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(300);
    } else if (preScroll != null) {
      await page.evaluate(y => window.scrollTo(0, y), preScroll);
      await delay(300);
    }

    // 2. scroll selected element into view (centre of viewport)
    if (selector) {
      const found = await page.evaluate(sel => {
        const el = document.querySelector(sel);
        if (!el) return false;
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      }, selector);
      if (!found) console.warn(`  ⚠  not found: ${selector}`);
      await delay(250);
    }

    // 3. paint red highlight
    if (selector) {
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

    // cleanup
    if (selector) {
      await page.evaluate(() => { const e = document.getElementById('__hl__'); if (e) e.remove(); });
    }

    console.log(`✓  ${label}`);
  } catch (err) {
    console.warn(`✗  ${label} — ${err.message}`);
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ── PAGE VIEW — only pages that actually exist ────────────────────────────
  const PV = [
    { url: '/',                                         file: 'pv_home.png',            label: 'page_view — Home' },
    { url: '/blog.html',                                file: 'pv_blog.png',             label: 'page_view — Blog' },
    { url: '/contact.html',                             file: 'pv_contact.png',          label: 'page_view — Contact' },
    { url: '/projects.html',                            file: 'pv_projects.png',         label: 'page_view — Projects' },
    { url: '/projects/tnk-designs.html',                file: 'pv_proj_tnk.png',         label: 'page_view — TNK Designs' },
    { url: '/projects/tnk-portfolio-web.html',          file: 'pv_proj_port.png',        label: 'page_view — TNK Portfolio Web' },
    { url: '/blog/getting-started-with-ga4.html',       file: 'pv_blog_ga4.png',         label: 'page_view — Getting Started with GA4' },
    { url: '/blog/design-principles-for-data-products.html', file: 'pv_blog_design.png', label: 'page_view — Design Principles' },
    { url: '/blog/building-with-claude-code.html',      file: 'pv_blog_claude.png',      label: 'page_view — Building with Claude Code' },
    { url: '/blog/beautiful-dashboards.html',           file: 'pv_blog_dashboards.png',  label: 'page_view — Beautiful Dashboards' },
    { url: '/blog/datalayer-medicion-robusta.html',     file: 'pv_blog_datalayer.png',   label: 'page_view — DataLayer Medición Robusta' },
    { url: '/blog/analytics-first-workflow.html',       file: 'pv_blog_analytics_wf.png', label: 'page_view — Analytics-First Workflow' },
  ];
  console.log('\n── page_view ──────────────────────────────────────────────────');
  for (const s of PV) await shoot(page, s);

  // ── SELECT CONTENT — element highlighted per shot ─────────────────────────
  console.log('\n── select_content ─────────────────────────────────────────────');
  const SC = [
    // Nav links
    { url: '/', file: 'sc_nav_projects.png', label: 'select_content — Nav: Projects',
      selector: 'a[href="projects.html"][data-track]' },
    { url: '/', file: 'sc_nav_blog.png',     label: 'select_content — Nav: Blog',
      selector: 'a[href="blog.html"][data-track]' },
    { url: '/', file: 'sc_nav_contact.png',  label: 'select_content — Nav: Contact',
      selector: 'a[href="contact.html"][data-track*="nav_link"]' },
    { url: '/', file: 'sc_nav_cta.png',      label: 'select_content — Nav: Get in touch CTA',
      selector: 'a[href="contact.html"][data-track*="cta"]' },

    // Hero CTAs
    { url: '/', file: 'sc_hero_projects.png', label: 'select_content — Hero: View Projects',
      selector: 'a[href="#projects"]', preScroll: 0 },
    { url: '/', file: 'sc_hero_blog.png',     label: 'select_content — Hero: Read the Blog',
      selector: 'a[href="#blog"]', preScroll: 0 },

    // Featured projects section
    { url: '/', file: 'sc_all_projects.png',   label: 'select_content — All projects →',
      selector: 'a[data-track*="projects-all"]' },
    { url: '/', file: 'sc_card_tnk.png',       label: 'select_content — Project card: TNK Designs',
      selector: 'article.card[onclick*="tnk-designs"]' },
    { url: '/', file: 'sc_card_port.png',      label: 'select_content — Project card: TNK Portfolio Web',
      selector: 'article.card[onclick*="tnk-portfolio-web"]' },

    // Blog section (home)
    { url: '/', file: 'sc_all_posts.png',      label: 'select_content — All posts →',
      selector: 'a[data-track*="blog-all"]' },
    { url: '/', file: 'sc_blog_card_ga4.png',  label: 'select_content — Blog card: Getting Started with GA4',
      selector: 'article.card[onclick*="getting-started-with-ga4"]' },
    { url: '/', file: 'sc_blog_card_design.png', label: 'select_content — Blog card: Design Principles',
      selector: 'article.card[onclick*="design-principles"]' },

    // Footer socials
    { url: '/', file: 'sc_footer_linkedin.png', label: 'select_content — Footer: LinkedIn',
      selector: 'a[data-track*=\'"content_id":"linkedin"\']', scrollToBottom: true },
    { url: '/', file: 'sc_footer_instagram.png', label: 'select_content — Footer: Instagram',
      selector: 'a[data-track*=\'"content_id":"instagram"\']', scrollToBottom: true },
    { url: '/', file: 'sc_footer_email.png',    label: 'select_content — Footer: Email',
      selector: 'a[data-track*=\'"content_id":"email"\']', scrollToBottom: true },

    // Blog listing — featured card
    { url: '/blog.html', file: 'sc_blog_featured.png', label: 'select_content — Blog: Featured card',
      selector: '#featured' },
    // Blog listing — grid cards
    { url: '/blog.html', file: 'sc_blog_card_ga4_list.png',   label: 'select_content — Blog listing: Getting Started',
      selector: 'article.card[onclick*="getting-started-with-ga4"]' },
    { url: '/blog.html', file: 'sc_blog_card_design_list.png', label: 'select_content — Blog listing: Design Principles',
      selector: 'article.card[onclick*="design-principles"]' },
    { url: '/blog.html', file: 'sc_blog_card_claude.png',     label: 'select_content — Blog listing: Building with Claude',
      selector: 'article.card[onclick*="building-with-claude"]' },
    { url: '/blog.html', file: 'sc_blog_card_dash.png',       label: 'select_content — Blog listing: Beautiful Dashboards',
      selector: 'article.card[onclick*="beautiful-dashboards"]' },
    { url: '/blog.html', file: 'sc_blog_card_analytics_wf.png', label: 'select_content — Blog listing: Analytics-First Workflow',
      selector: 'article.card[onclick*="analytics-first-workflow"]' },

    // Filter pills
    { url: '/blog.html', file: 'sc_filter_all.png',       label: 'select_content — Filter: All',
      selector: '.filter-btn.active' },
    { url: '/blog.html', file: 'sc_filter_analytics.png', label: 'select_content — Filter: Analytics',
      selector: '.filter-btn[onclick*="analytics"]' },
    { url: '/blog.html', file: 'sc_filter_design.png',    label: 'select_content — Filter: Design',
      selector: '.filter-btn[onclick*="design"]' },
    { url: '/blog.html', file: 'sc_filter_lol.png',       label: 'select_content — Filter: League of Legends',
      selector: '.filter-btn[onclick*="league"]' },
    { url: '/blog.html', file: 'sc_filter_padel.png',     label: 'select_content — Filter: Padel',
      selector: '.filter-btn[onclick*="padel"]' },

    // Projects listing
    { url: '/projects.html', file: 'sc_proj_tnk.png',  label: 'select_content — Projects: TNK Designs card',
      selector: 'article.card[onclick*="tnk-designs"]' },
    { url: '/projects.html', file: 'sc_proj_port.png', label: 'select_content — Projects: TNK Portfolio card',
      selector: 'article.card[onclick*="tnk-portfolio-web"]' },

    // Contact socials
    { url: '/contact.html', file: 'sc_contact_linkedin.png',  label: 'select_content — Contact: LinkedIn',
      selector: 'a.social-link[href*="linkedin"]' },
    { url: '/contact.html', file: 'sc_contact_instagram.png', label: 'select_content — Contact: Instagram',
      selector: 'a.social-link[href*="instagram"]' },
  ];
  for (const s of SC) await shoot(page, s);

  // ── GENERATE LEAD ─────────────────────────────────────────────────────────
  console.log('\n── generate_lead ──────────────────────────────────────────────');
  await shoot(page, { url: '/contact.html', file: 'gl_form.png', label: 'generate_lead — Contact form',
    selector: 'form#contact-form' });

  // ── ORBIT INTERACTION ─────────────────────────────────────────────────────
  console.log('\n── orbit_interaction ──────────────────────────────────────────');
  // Full orbit stage shot (no highlight — showing the whole section)
  await shoot(page, { url: '/', file: 'oi_orbit_full.png',  label: 'orbit_interaction — Full orbit section',
    selector: '#orbit-stage' });
  // Highlight just the stage border (for orbit_pause)
  await shoot(page, { url: '/', file: 'oi_orbit_pause.png', label: 'orbit_interaction — Stage hover (orbit_pause)',
    selector: '#orbit-stage' });
  // Highlight a specific skill icon for skill_hover
  await shoot(page, { url: '/', file: 'oi_skill_hover.png', label: 'orbit_interaction — Skill icon hover',
    selector: '.o-icon:first-child' });

  // ── SEARCH ────────────────────────────────────────────────────────────────
  console.log('\n── search ─────────────────────────────────────────────────────');
  // Type a query to show suggestions
  await page.goto(BASE + '/blog.html', { waitUntil: 'networkidle0' });
  await delay(500);
  const searchInput = await page.$('#blog-search');
  if (searchInput) {
    await searchInput.click();
    await searchInput.type('ga4', { delay: 80 });
    await delay(600);
  }
  await shoot(page, { url: '/blog.html', file: 'se_search_typing.png', label: 'search — Typing query (suggestions visible)',
    selector: '#blog-search' });

  // Re-navigate and show empty state
  await page.goto(BASE + '/blog.html', { waitUntil: 'networkidle0' });
  await delay(500);
  const si2 = await page.$('#blog-search');
  if (si2) {
    await si2.click();
    await si2.type('xyznotfound', { delay: 60 });
    await delay(700);
  }
  await page.screenshot({ path: path.join(OUT, 'se_no_results.png') });
  console.log('✓  search — No results state');

  await browser.close();
  console.log('\n✅  All screenshots saved to', OUT);
})();
