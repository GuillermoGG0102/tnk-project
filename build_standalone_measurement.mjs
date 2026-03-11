import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const htmlPath   = 'measurement_plan/measurement_plan.html';
const screensDir = 'measurement_plan/screenshots';
const outPath    = 'measurement_plan/measurement_plan_standalone.html';

const map = {};
for (const file of readdirSync(screensDir)) {
  const ext  = extname(file).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue;
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  map[file] = `data:${mime};base64,` + readFileSync(join(screensDir, file)).toString('base64');
}

let html = readFileSync(htmlPath, 'utf8');

// 1. Inject screenshots map before </head>
html = html.replace('</head>', `<script>window.SCREENSHOTS=${JSON.stringify(map)};</script>\n</head>`);

// 2. Replace shot() using exact string match — NOT regex.
//    The original uses a template literal with ${file} inside, so any regex with [\s\S]*?
//    would stop at the first '}' inside ${file} and produce broken JS.
const originalShot = `function shot(file, alt) {
  return \`<div class="shot-wrap"><img src="screenshots/\${file}" alt="\${alt}" onerror="showZipBanner();this.parentElement.innerHTML='<div class=shot-missing>screenshot/\${file}</div>'"></div>\`;
}`;

const standaloneShot = `function shot(file, alt) {
  const src = (window.SCREENSHOTS && window.SCREENSHOTS[file]) || ('screenshots/' + file);
  return '<div class="shot-wrap"><img src="' + src + '" alt="' + alt + '"></div>';
}`;

if (!html.includes(originalShot)) {
  console.warn('WARNING: could not find shot() function — screenshot patch skipped. Check for changes in measurement_plan.html.');
} else {
  html = html.replace(originalShot, standaloneShot);
}

// 3. Hide the banner — screenshots are embedded, no download needed
html = html.replace('id="zip-banner"', 'id="zip-banner" style="display:none"');

writeFileSync(outPath, html, 'utf8');
const mb = (Buffer.byteLength(html, 'utf8') / 1024 / 1024).toFixed(1);
console.log(`Done. ${Object.keys(map).length} images embedded. Output: ${outPath} (${mb} MB)`);
