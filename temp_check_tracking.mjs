import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

// Capture dataLayer events
await page.evaluateOnNewDocument(() => {
  window._capturedEvents = [];
  const originalPush = Array.prototype.push;
  window.dataLayer = window.dataLayer || [];
  const handler = {
    push: function(...args) {
      if (args[0]?.event) {
        window._capturedEvents.push(args[0]);
      }
      return originalPush.apply(this, args);
    }
  };
  Object.assign(window.dataLayer, handler);
  window.dataLayer.push = handler.push.bind(window.dataLayer);
});

await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 20000 });

// Wait a bit
await new Promise(r => setTimeout(r, 1000));

// Check what's on the page
const navLinks = await page.evaluate(() => {
  const links = document.querySelectorAll('a[data-track]');
  return Array.from(links).map(l => ({
    href: l.href,
    text: l.textContent.trim(),
    dataTrack: l.getAttribute('data-track')
  })).slice(0, 5);
});

console.log('Navigation Links Found:');
navLinks.forEach(link => {
  console.log(`Text: ${link.text}`);
  console.log(`DataTrack: ${link.dataTrack}\n`);
});

await browser.close();
