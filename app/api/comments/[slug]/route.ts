import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json([])

  const { data, error } = await supabase
    .from('post_comments')
    .select('id, author_name, content, created_at')
    .eq('post_slug', params.slug)
    .eq('approved', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[comments] GET error:', error)
    return NextResponse.json([])
  }

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { author_name, content } = await req.json()

    if (!author_name || typeof author_name !== 'string' || !author_name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 })
    }
    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'Comment must be under 1000 characters.' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const { error } = await supabase
      .from('post_comments')
      .insert({
        post_slug:   params.slug,
        author_name: author_name.trim(),
        content:     content.trim(),
        approved:    false,
      })

    if (error) {
      console.error('[comments] POST error:', error)
      return NextResponse.json({ error: 'Failed to submit comment.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Comment submitted! It will appear after approval.' })
  } catch (err) {
    console.error('[comments] Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
