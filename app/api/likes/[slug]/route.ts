import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const browserId = req.nextUrl.searchParams.get('browser_id') ?? ''

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ count: 0, liked: false })

  const { count } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_slug', slug)

  let liked = false
  if (browserId) {
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_slug', slug)
      .eq('browser_id', browserId)
      .maybeSingle()
    liked = !!data
  }

  return NextResponse.json({ count: count ?? 0, liked })
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const { browser_id } = await req.json()

    if (!browser_id) {
      return NextResponse.json({ error: 'browser_id is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_slug', slug)
      .eq('browser_id', browser_id)
      .maybeSingle()

    if (existing) {
      // Unlike: delete the row
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_slug', slug)
        .eq('browser_id', browser_id)
    } else {
      // Like: insert a row
      await supabase
        .from('post_likes')
        .insert({ post_slug: slug, browser_id })
    }

    // Return updated count and state
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_slug', slug)

    return NextResponse.json({ count: count ?? 0, liked: !existing })
  } catch (err) {
    console.error('[likes] Error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
