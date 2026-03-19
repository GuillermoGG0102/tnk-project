export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  const RESEND_KEY   = process.env.RESEND_API_KEY;
  const TO_EMAIL     = process.env.CONTACT_EMAIL || 'guillermogg0102@gmail.com';

  // 1. Insert into Supabase
  const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      name,
      email,
      subject: subject || '(no subject)',
      message,
    }),
  });

  if (!dbRes.ok) {
    const detail = await dbRes.text();
    console.error('[contact] Supabase insert failed:', detail);
    return res.status(500).json({ error: 'Failed to save submission', detail });
  }

  // 2. Send email notification via Resend
  let emailResult = { sent: false, skipped: true };

  if (RESEND_KEY) {
    emailResult = { sent: false, skipped: false };
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: 'TNK Contact Form <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `[TNK Contact] ${subject || 'New message'} — from ${name}`,
        html: `
          <h2 style="font-family:sans-serif;">New contact form submission</h2>
          <table style="font-family:sans-serif;border-collapse:collapse;">
            <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600;">Name</td><td>${name}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600;">Subject</td><td>${subject || '—'}</td></tr>
          </table>
          <p style="font-family:sans-serif;margin-top:16px;color:#333;">${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (emailRes.ok) {
      emailResult = { sent: true };
    } else {
      const detail = await emailRes.text();
      console.error('[contact] Resend failed:', detail);
      emailResult = { sent: false, error: detail };
    }
  } else {
    console.log('[contact] RESEND_API_KEY not set — skipping email');
  }

  return res.status(200).json({ ok: true, email: emailResult });
}
