import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

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

    // ── 1. Store in Supabase (always runs — never lose a submission) ──
    const supabase = getSupabase()
    if (supabase) {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({ name, email, subject, message })

      if (dbError) {
        console.error('[contact] Supabase insert error:', dbError)
      }
    }

    // ── 2. Email notification via Resend (runs when key is set) ──
    const resendKey    = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL ?? 'guillermogg0102@gmail.com'

    if (resendKey) {
      const { Resend } = await import('resend')
      const resend     = new Resend(resendKey)

      await resend.emails.send({
        from:    'onboarding@resend.dev',
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
    } else {
      console.log('[contact] No RESEND_API_KEY — saved to Supabase only:', { name, email, subject })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
