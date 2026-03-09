import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, source = 'unknown' } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Supabase integration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase
        .from('subscribers')
        .upsert(
          { email: email.toLowerCase().trim(), source, subscribed_at: new Date().toISOString() },
          { onConflict: 'email', ignoreDuplicates: false }
        )

      if (error && !error.message.includes('duplicate')) {
        console.error('[subscribe] Supabase error:', error)
        return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
      }
    }

    // Resend email (optional)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const { Resend } = await import('resend')
      const resend     = new Resend(resendKey)

      await resend.emails.send({
        from:    'TNK <hello@tnk.design>',
        to:      email,
        subject: 'Welcome to TNK – Design & Analytics ✦',
        html: `
          <p>Hey there,</p>
          <p>You're officially subscribed to the TNK newsletter. Expect analytics insights,
          design experiments, and the occasional padel update landing in your inbox.</p>
          <p>— Guillermo</p>
        `,
      })
    }

    return NextResponse.json({ success: true, message: 'You\'re subscribed! Check your inbox.' })
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
