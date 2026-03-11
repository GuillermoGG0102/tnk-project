'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
}

interface CommentsProps {
  postSlug: string
  postTitle: string
}

export function Comments({ postSlug, postTitle }: CommentsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadComments = useCallback(async () => {
    setLoadingComments(true)
    const { data } = await supabase
      .from('post_comments')
      .select('id, author_name, content, created_at')
      .eq('post_slug', postSlug)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
    setLoadingComments(false)
  }, [postSlug])

  useEffect(() => { loadComments() }, [loadComments])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMsg(null)
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const text = (form.elements.namedItem('text') as HTMLTextAreaElement).value.trim()

    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_slug: postSlug, author_name: name, content: text, user_id: user?.id })
      .select()
      .single()

    if (error || !data) {
      setSubmitMsg({ type: 'error', text: 'Error al publicar el comentario. Inténtalo de nuevo.' })
    } else {
      setComments((prev) => [...prev, data])
      form.reset()
      if (user?.user_metadata?.full_name) {
        (form.elements.namedItem('name') as HTMLInputElement).value = user.user_metadata.full_name
      }
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'post_engagement', content_id: postSlug, content_name: postTitle, action: 'comment' })
    }
    setSubmitting(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  const authUrl = `/auth?redirect=${encodeURIComponent(pathname)}`

  return (
    <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4D5E87', margin: '0 0 28px 0' }}>
        Comments
      </p>

      {/* Comments list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px', minHeight: '20px' }}>
        {loadingComments ? (
          <p style={{ fontSize: '14px', color: '#4D5E87', margin: 0 }}>Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#4D5E87', margin: 0 }}>No hay comentarios aún. ¡Sé el primero!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} style={{ background: '#0F1629', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 600, color: '#F0F4FF' }}>
                  {c.author_name}
                </span>
                <span style={{ fontSize: '12px', color: '#4D5E87', fontFamily: "'JetBrains Mono', monospace" }}>
                  {new Date(c.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p style={{ fontSize: '15px', color: '#8A9CC8', margin: 0, lineHeight: 1.7 }}>{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Auth gate or comment form */}
      {user ? (
        <div style={{ background: '#0F1629', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 600, color: '#F0F4FF', margin: 0 }}>
              Dejar un comentario
            </p>
            <button
              onClick={handleSignOut}
              style={{ fontSize: '12px', color: '#4D5E87', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Cerrar sesión
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <input
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              maxLength={80}
              defaultValue={user.user_metadata?.full_name ?? ''}
              style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F0F4FF', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(0,207,255,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
            />
            <textarea
              name="text"
              required
              placeholder="Comparte tu opinión..."
              maxLength={1000}
              rows={4}
              style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F0F4FF', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(0,207,255,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
            />
            {submitMsg && (
              <div style={{
                padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                background: submitMsg.type === 'success' ? 'rgba(0,255,179,0.08)' : 'rgba(255,77,109,0.08)',
                border: `1px solid ${submitMsg.type === 'success' ? 'rgba(0,255,179,0.2)' : 'rgba(255,77,109,0.2)'}`,
                color: submitMsg.type === 'success' ? '#00FFB3' : '#FF4D6D',
              }}>
                {submitMsg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={{ alignSelf: 'flex-start', padding: '10px 24px', background: '#00CFFF', color: '#0A0F1E', fontWeight: 600, fontSize: '14px', border: 'none', borderRadius: '10px', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: submitting ? 0.5 : 1 }}
              onMouseOver={(e) => { if (!submitting) (e.target as HTMLButtonElement).style.background = '#00b8e6' }}
              onMouseOut={(e) => { if (!submitting) (e.target as HTMLButtonElement).style.background = '#00CFFF' }}
            >
              {submitting ? 'Publicando...' : 'Publicar comentario'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ background: '#0F1629', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#8A9CC8', margin: '0 0 16px 0' }}>
            Inicia sesión para dejar un comentario
          </p>
          <Link
            href={authUrl}
            style={{ display: 'inline-block', padding: '10px 24px', background: '#00CFFF', color: '#0A0F1E', fontWeight: 600, fontSize: '14px', borderRadius: '10px', textDecoration: 'none' }}
            onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#00b8e6' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#00CFFF' }}
          >
            Iniciar sesión / Registrarse
          </Link>
        </div>
      )}
    </div>
  )
}

declare global {
  interface Window { dataLayer: Record<string, unknown>[] }
}
