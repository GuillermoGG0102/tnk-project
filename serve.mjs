import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleSupabaseApi } from './supabase-proxy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

// Security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://tagmanager.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://hdfyjbyoodfpjopvxddv.supabase.co https://www.googletagmanager.com; frame-src 'self' https://www.googletagmanager.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-no-referrer-when-downgrade',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()'
};

http.createServer(async (req, res) => {
  let urlPath = req.url.split('?')[0];
  const queryString = req.url.split('?')[1] || '';
  const queryParams = new URLSearchParams(queryString);

  // Handle API routes
  if (urlPath.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200, securityHeaders);
      res.end();
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const bodyData = body ? JSON.parse(body) : {};
        const result = await handleSupabaseApi(urlPath, Object.fromEntries(queryParams), bodyData);
        res.writeHead(200, securityHeaders);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, securityHeaders);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Serve static files
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, securityHeaders);
      res.end('Not found: ' + urlPath);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType, ...securityHeaders });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`✓ Serving at http://localhost:${PORT}`);
  console.log(`✓ Security headers enabled`);
  console.log(`✓ Supabase API proxy ready`);
});
