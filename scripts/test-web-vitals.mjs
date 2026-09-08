/**
 * test-web-vitals.mjs
 * Verify that Web Vitals metrics are being captured in the dataLayer
 */
import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3000/blog/getting-started-with-ga4.html';

const browser = await puppeteer.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

// Listen for console messages
const consoleLogs = [];
page.on('console', (msg) => {
  const text = msg.text();
  if (text.includes('web-vitals') || text.includes('dataLayer') || text.includes('vitals')) {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${text}`);
  }
});

console.log(`Loading: ${url}`);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for Web Vitals metrics to fire (they fire between 5-15 seconds)
console.log('Waiting 15 seconds for Web Vitals metrics to fire...');
await new Promise(resolve => setTimeout(resolve, 15000));

// Check if window.webVitals exists and try calling the functions
const hasPolyfill = await page.evaluate(() => {
  return typeof window.webVitals !== 'undefined';
});
console.log(`✓ Web Vitals polyfill loaded: ${hasPolyfill}`);

// Test calling the polyfill functions to see if callbacks fire
await page.evaluate(() => {
  window.webVitalsCallbackTests = {
    clsCalled: false,
    lcpCalled: false,
    inpCalled: false
  };

  window.webVitals.getCLS(function(metric) {
    window.webVitalsCallbackTests.clsCalled = true;
    console.log('[TEST] CLS callback fired:', metric);
  });

  window.webVitals.getLCP(function(metric) {
    window.webVitalsCallbackTests.lcpCalled = true;
    console.log('[TEST] LCP callback fired:', metric);
  });

  window.webVitals.getINP(function(metric) {
    window.webVitalsCallbackTests.inpCalled = true;
    console.log('[TEST] INP callback fired:', metric);
  });
});

// Check for dataLayer and tracking script
const diagnostics = await page.evaluate(() => {
  return {
    hasDataLayer: typeof window.dataLayer !== 'undefined',
    dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
    dataLayerSample: window.dataLayer ? window.dataLayer.slice(0, 3) : [],
    hasGetCLS: typeof window.webVitals?.getCLS === 'function',
    hasGetLCP: typeof window.webVitals?.getLCP === 'function',
    hasGetINP: typeof window.webVitals?.getINP === 'function'
  };
});

console.log('\nDiagnostics:');
console.log(`✓ dataLayer exists: ${diagnostics.hasDataLayer}`);
console.log(`✓ dataLayer has ${diagnostics.dataLayerLength} events`);
console.log(`✓ window.webVitals.getCLS: ${diagnostics.hasGetCLS}`);
console.log(`✓ window.webVitals.getLCP: ${diagnostics.hasGetLCP}`);
console.log(`✓ window.webVitals.getINP: ${diagnostics.hasGetINP}`);

// Check if test callbacks were fired
const callbackTests = await page.evaluate(() => window.webVitalsCallbackTests || {});
console.log(`✓ Test CLS callback fired: ${callbackTests.clsCalled || false}`);
console.log(`✓ Test LCP callback fired: ${callbackTests.lcpCalled || false}`);
console.log(`✓ Test INP callback fired: ${callbackTests.inpCalled || false}`);

console.log('\nAll dataLayer events:');
diagnostics.dataLayerSample.forEach((event, idx) => {
  console.log(`  ${idx}: ${event.event || JSON.stringify(event).substring(0, 60)}`);
});

// Extract dataLayer events
const webVitalsEvents = await page.evaluate(() => {
  if (!window.dataLayer) return null;

  return window.dataLayer.filter(event => event.event === 'web_vitals');
});

console.log('\nWeb Vitals events captured:');
if (!webVitalsEvents || webVitalsEvents.length === 0) {
  console.log('✗ No web_vitals events found in dataLayer');
} else {
  console.log(`✓ Found ${webVitalsEvents.length} web_vitals events:\n`);

  webVitalsEvents.forEach((event, idx) => {
    console.log(`Event ${idx + 1}:`);
    console.log(`  - Metric: ${event.metric_name}`);
    console.log(`  - Value: ${event.metric_value}`);
    console.log(`  - Rating: ${event.metric_rating}`);
    console.log();
  });

  // Check for required metrics
  const metrics = new Set(webVitalsEvents.map(e => e.metric_name));
  const required = ['LCP', 'INP', 'CLS'];
  const missing = required.filter(m => !metrics.has(m));

  if (missing.length === 0) {
    console.log('✓ All required metrics (LCP, INP, CLS) are present!');
  } else {
    console.log(`✗ Missing metrics: ${missing.join(', ')}`);
  }
}

if (consoleLogs.length > 0) {
  console.log('\nConsole logs related to web-vitals:');
  consoleLogs.forEach(log => console.log(`  ${log}`));
}

await browser.close();
