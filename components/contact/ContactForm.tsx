'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'

interface FormState {
  name:    string
  email:   string
  subject: string
  message: string
}

const SUBJECTS = [
  'Analytics Implementation',
  'A/B Testing / CRO',
  'UI / UX Design',
  'Data Strategy',
  'Just saying hi',
  'Other',
]

const inputClass = [
  'w-full px-4 py-3 rounded-xl text-sm',
  'bg-[#0F1629] border border-white/[0.08]',
  'text-[#F0F4FF] placeholder:text-[#4D5E87]',
  'focus:outline-none focus-visible:border-[#00CFFF]/60 focus-visible:ring-1 focus-visible:ring-[#00CFFF]/40',
  'hover:border-white/14',
  'transition-[border-color] duration-200',
  'disabled:opacity-50',
].join(' ')

export function ContactForm() {
  const [form,   setForm]   = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error,  setError]  = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        analytics.contactSubmit('contact-page')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="surface-card p-8">
      <h2 className="font-display font-bold text-[#F0F4FF] text-2xl mb-2">Send a message</h2>
      <p className="text-sm text-[#4D5E87] mb-8">Fields marked with * are required.</p>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#00FFB3]/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-[#00FFB3]" />
            </div>
            <h3 className="font-display font-bold text-[#F0F4FF] text-xl">Message sent!</h3>
            <p className="text-[#8A9CC8] text-sm text-center max-w-xs">
              Thanks for reaching out. I'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-xs text-[#00CFFF] hover:underline focus-ring"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium text-[#8A9CC8]">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  disabled={status === 'loading'}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-[#8A9CC8]">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={status === 'loading'}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-medium text-[#8A9CC8]">Subject *</label>
              <select
                id="subject"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={inputClass}
              >
                <option value="" disabled>Select a topic…</option>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-medium text-[#8A9CC8]">Message *</label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project, timeline, and budget…"
                disabled={status === 'loading'}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Error */}
            {status === 'error' && error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-400"
              >
                <AlertCircle size={15} />
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={status === 'loading'}
              className="w-full mt-2"
            >
              <Send size={17} />
              Send message
            </Button>

            <p className="text-xs text-[#4D5E87] text-center">
              Your information is kept private and never shared.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
