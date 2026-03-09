'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'

interface NewsletterFormProps {
  source?: string
  variant?: 'default' | 'compact'
}

export function NewsletterForm({ source = 'blog', variant = 'default' }: NewsletterFormProps) {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, source }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'You're subscribed! Check your inbox.')
        analytics.blogSubscribe(source)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (variant === 'compact') {
    return (
      <div className="p-6 rounded-2xl bg-[#0F1629] border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={16} className="text-[#00CFFF]" />
          <span className="font-semibold text-[#F0F4FF] text-sm">Newsletter</span>
        </div>
        <p className="text-xs text-[#8A9CC8] mb-4">Analytics & design insights, directly to your inbox.</p>
        <CompactForm
          email={email}
          setEmail={setEmail}
          status={status}
          message={message}
          onSubmit={handleSubmit}
        />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1629] via-[#162038] to-[#0F1629]" />
      <div
        aria-hidden
        className="absolute top-0 left-0 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.06) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />

      <div className="relative z-10 px-8 sm:px-12 py-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#00CFFF]/10 mb-6">
          <Mail size={22} className="text-[#00CFFF]" />
        </div>
        <h3 className="font-display font-bold text-[#F0F4FF] text-2xl mb-2">
          Stay in the loop
        </h3>
        <p className="text-[#8A9CC8] text-sm leading-relaxed max-w-md mx-auto mb-8">
          Get analytics insights, design experiments, and occasional musings from the padel court —
          delivered to your inbox. No spam, unsubscribe anytime.
        </p>

        <CompactForm
          email={email}
          setEmail={setEmail}
          status={status}
          message={message}
          onSubmit={handleSubmit}
          wide
        />
      </div>
    </div>
  )
}

interface CompactFormProps {
  email:    string
  setEmail: (v: string) => void
  status:   'idle' | 'loading' | 'success' | 'error'
  message:  string
  onSubmit: (e: React.FormEvent) => void
  wide?:    boolean
}

function CompactForm({ email, setEmail, status, message, onSubmit, wide }: CompactFormProps) {
  return (
    <>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-[#00FFB3] text-sm font-medium py-3"
          >
            <CheckCircle2 size={18} />
            {message}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className={`flex flex-col sm:flex-row gap-3 ${wide ? 'max-w-md mx-auto' : ''}`}
          >
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className={[
                'flex-1 px-4 py-2.5 rounded-lg text-sm',
                'bg-white/5 border border-white/10',
                'text-[#F0F4FF] placeholder:text-[#4D5E87]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00CFFF]',
                'transition-[border-color] duration-200',
                'hover:border-white/20',
                'disabled:opacity-50',
              ].join(' ')}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={status === 'loading'}
              className="shrink-0"
            >
              Subscribe
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 mt-3 text-xs text-red-400"
        >
          <AlertCircle size={13} />
          {message}
        </motion.p>
      )}
    </>
  )
}
