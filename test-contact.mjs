// Diagnostic script — run after deploying to see the exact Resend result
// Usage: node test-contact.mjs [BASE_URL]
const BASE = process.argv[2] || 'https://tnk-project-guillermogg0102s-projects.vercel.app';

console.log(`\nPOST ${BASE}/api/contact\n`);

const res = await fetch(`${BASE}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name:    'Test User',
    email:   'guillermogg0102@gmail.com',
    subject: 'Diagnostic test',
    message: 'Automated test — safe to delete this row in Supabase.',
  }),
});

const body = await res.json();
console.log('HTTP', res.status);
console.log(JSON.stringify(body, null, 2));

if (body.email?.sent)           console.log('\n✓ Email sent — check your inbox');
if (body.email?.skipped)        console.warn('\n⚠ RESEND_API_KEY is not set in Vercel env vars');
if (body.email?.error)          console.error('\n✗ Resend error:', body.email.error);
