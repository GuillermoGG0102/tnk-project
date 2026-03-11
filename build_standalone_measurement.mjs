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

// Inject screenshots map before </head>
html = html.replace('</head>', `<script>window.SCREENSHOTS=${JSON.stringify(map)};</script>\n</head>`);

// Patch shot() to use embedded map
html = html.replace(
  /function shot\(file,\s*alt\)\s*\{[\s\S]*?\}/,
  `function shot(file, alt) {
  const src = (window.SCREENSHOTS && window.SCREENSHOTS[file]) || ('screenshots/' + file);
  return '<div class="shot-wrap"><img src="' + src + '" alt="' + alt + '"></div>';
}`
);

writeFileSync(outPath, html, 'utf8');
const mb = (Buffer.byteLength(html, 'utf8') / 1024 / 1024).toFixed(1);
console.log(`Done. ${Object.keys(map).length} images embedded. Output: ${outPath} (${mb} MB)`);
