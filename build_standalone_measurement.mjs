import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';

const htmlPath    = 'measurement_plan/measurement_plan.html';
const screensDir  = 'measurement_plan/screenshots';
const outPath     = 'measurement_plan/measurement_plan_standalone.html';

// 1. Build base64 map for every PNG in screenshots/
const screenshotMap = {};
const files = readdirSync(screensDir);
for (const file of files) {
  const ext  = extname(file).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue;
  const mime = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png';
  const data = readFileSync(join(screensDir, file)).toString('base64');
  screenshotMap[file] = `data:${mime};base64,${data}`;
}
console.log(`Encoded ${Object.keys(screenshotMap).length} images.`);

// 2. Build the injected <script> block
const mapJson = JSON.stringify(screenshotMap);
const injectScript = `<script>window.SCREENSHOTS=${mapJson};</script>`;

// 3. Read HTML and patch the shot() function
let html = readFileSync(htmlPath, 'utf8');

// Replace the shot() function to use the embedded map when available
const oldShot = `function shot(file, alt) {
  return \`<div class="shot-wrap"><img src="screenshots/\${file}" alt="\${alt}" onerror="this.parentElement.innerHTML='<div class=shot-missing>screenshot/\${file}</div>'"></div>\`;
}`;

const newShot = `function shot(file, alt) {
  const src = (window.SCREENSHOTS && window.SCREENSHOTS[file]) || ('screenshots/' + file);
  return '<div class="shot-wrap"><img src="' + src + '" alt="' + alt + '" onerror="this.parentElement.innerHTML=\'<div class=shot-missing>screenshot/' + file + '</div>\'"></div>';
}`;

if (!html.includes(oldShot.replace(/\r\n/g, '\n'))) {
  // Try a more flexible match
  html = html.replace(
    /function shot\(file,\s*alt\)\s*\{[\s\S]*?\}/,
    newShot
  );
} else {
  html = html.replace(oldShot, newShot);
}

// 4. Inject the screenshots map right before </head> (or before first <script> in body)
html = html.replace('</head>', injectScript + '\n</head>');

// 5. Write output
writeFileSync(outPath, html, 'utf8');

const sizeMB = (Buffer.byteLength(html, 'utf8') / 1024 / 1024).toFixed(1);
console.log(`Output: ${outPath} (${sizeMB} MB)`);
console.log('Done. Open measurement_plan_standalone.html directly in a browser — no server needed.');
