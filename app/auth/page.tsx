'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/blog'

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage({
        type: 'error',
        text: error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : error.message,
      })
      setLoading(false)
    } else {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'user_login', method: 'email' })
      router.push(redirectTo)
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    } else if (data.user && !data.session) {
      setMessage({
        type: 'success',
        text: 'Revisa tu email para confirmar tu cuenta. Después podrás iniciar sesión.',
      })
      setLoading(false)
    } else {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'user_register', method: 'email' })
      router.push(redirectTo)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0A0F1E' }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#0F1629',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 36px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #00CFFF, #00FFB3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '14px', color: '#0A0F1E',
          }}>T</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F0F4FF' }}>TNK</span>
        </Link>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setMessage(null) }}
              style={{
                flex: 1, padding: '9px 16px', border: 'none', borderRadius: '9px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500,
                background: tab === t ? 'rgba(0,207,255,0.12)' : 'transparent',
                color: tab === t ? '#00CFFF' : '#4D5E87',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, color: '#F0F4FF', marginBottom: '6px' }}>
              Bienvenido de vuelta
            </p>
            <p style={{ fontSize: '14px', color: '#4D5E87', marginBottom: '24px', lineHeight: 1.5 }}>
              Inicia sesión para comentar en los posts.
            </p>
            <form onSubmit={handleLogin}>
              <Field label="Email" name="email" type="email" placeholder="tu@email.com" autoComplete="email" />
              <Field label="Contraseña" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
              <SubmitBtn loading={loading}>Iniciar sesión</SubmitBtn>
            </form>
          </>
        ) : (
          <>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, color: '#F0F4FF', marginBottom: '6px' }}>
              Crear cuenta
            </p>
            <p style={{ fontSize: '14px', color: '#4D5E87', marginBottom: '24px', lineHeight: 1.5 }}>
              Regístrate para participar en la conversación.
            </p>
            <form onSubmit={handleRegister}>
              <Field label="Nombre" name="name" type="text" placeholder="Tu nombre" autoComplete="name" />
              <Field label="Email" name="email" type="email" placeholder="tu@email.com" autoComplete="email" />
              <Field label="Contraseña" name="password" type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password" minLength={6} />
              <SubmitBtn loading={loading}>Crear cuenta</SubmitBtn>
            </form>
          </>
        )}

        {message && (
          <div style={{
            marginTop: '16px', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', lineHeight: 1.5,
            background: message.type === 'success' ? 'rgba(0,255,179,0.08)' : 'rgba(255,77,109,0.08)',
            border: `1px solid ${message.type === 'success' ? 'rgba(0,255,179,0.2)' : 'rgba(255,77,109,0.2)'}`,
            color: message.type === 'success' ? '#00FFB3' : '#FF4D6D',
          }}>
            {message.text}
          </div>
        )}

        <Link href="/blog" style={{ display: 'block', textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#4D5E87', textDecoration: 'none' }}>
          ← Volver al blog
        </Link>
      </div>
    </div>
  )
}

function Field({ label, name, type, placeholder, autoComplete, minLength }: {
  label: string; name: string; type: string; placeholder: string; autoComplete: string; minLength?: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#8A9CC8' }}>{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        style={{
          padding: '11px 14px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
          color: '#F0F4FF', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'rgba(0,207,255,0.4)' }}
        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
      />
    </div>
  )
}

function SubmitBtn({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%', padding: '12px', background: '#00CFFF', color: '#0A0F1E',
        border: 'none', borderRadius: '10px', fontFamily: 'Inter, sans-serif',
        fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '8px', opacity: loading ? 0.5 : 1, transition: 'background 0.15s',
      }}
      onMouseOver={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#00b8e6' }}
      onMouseOut={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#00CFFF' }}
    >
      {loading ? 'Cargando...' : children}
    </button>
  )
}

declare global {
  interface Window { dataLayer: Record<string, unknown>[] }
}
