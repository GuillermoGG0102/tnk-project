import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const resendKey   = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL ?? 'hello@tnk.design'

    if (resendKey) {
      const { Resend } = await import('resend')
      const resend     = new Resend(resendKey)

      // Notify Guillermo
      await resend.emails.send({
        from:    'TNK Contact <noreply@tnk.design>',
        to:      contactEmail,
        replyTo: email,
        subject: `[TNK Contact] ${subject} — from ${name}`,
        html: `
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      })

      // Auto-reply to sender
      await resend.emails.send({
        from:    'Guillermo @ TNK <hello@tnk.design>',
        to:      email,
        subject: 'Got your message — talk soon',
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for reaching out! I've received your message about
          <em>"${subject}"</em> and will get back to you within 24 hours.</p>
          <p>— Guillermo</p>
        `,
      })
    } else {
      // Dev fallback: log to console
      console.log('[contact]', { name, email, subject, message })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
