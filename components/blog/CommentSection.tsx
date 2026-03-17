'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'
import { formatDate } from '@/lib/utils'

interface Comment {
  id:          string
  author_name: string
  content:     string
  created_at:  string
}

interface CommentSectionProps {
  slug: string
}

export function CommentSection({ slug }: CommentSectionProps) {
  const [comments,    setComments]    = useState<Comment[]>([])
  const [authorName,  setAuthorName]  = useState('')
  const [content,     setContent]     = useState('')
  const [status,      setStatus]      = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message,     setMessage]     = useState('')
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then(r => r.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingList(false))
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim() || status === 'loading') return

    setStatus('loading')
    try {
      const res  = await fetch(`/api/comments/${slug}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ author_name: authorName.trim(), content: content.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? 'Comment submitted! It will appear after approval.')
        analytics.blogComment(slug, content.trim().length)
        setAuthorName('')
        setContent('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Failed to submit. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="mt-16 pt-12 border-t border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <MessageCircle size={20} className="text-[#00CFFF]" />
        <h2 className="font-display font-bold text-[#F0F4FF] text-2xl">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-base font-normal text-[#4D5E87]">({comments.length})</span>
          )}
        </h2>
      </div>

      {/* Existing comments */}
      {loadingList ? (
        <div className="space-y-4 mb-10">
          {[1, 2].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4 mb-10">
          {comments.map(comment => (
            <li
              key={comment.id}
              className="p-5 rounded-2xl bg-[#0F1629] border border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00CFFF]/30 to-[#00FFB3]/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#00CFFF]">
                    {comment.author_name[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#F0F4FF]">{comment.author_name}</span>
                <span className="text-xs text-[#4D5E87] ml-auto">{formatDate(comment.created_at)}</span>
              </div>
              <p className="text-sm text-[#8A9CC8] leading-relaxed pl-9">{comment.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#4D5E87] mb-10">No comments yet. Be the first!</p>
      )}

      {/* Comment form */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[#0F1629] rounded-2xl border border-white/[0.08]" />
        <div className="relative z-10 p-6">
          <h3 className="font-semibold text-[#F0F4FF] text-sm mb-5">Leave a comment</h3>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-[#00FFB3] text-sm font-medium py-4"
              >
                <CheckCircle2 size={18} />
                {message}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="Your name"
                  maxLength={80}
                  disabled={status === 'loading'}
                  className={[
                    'w-full px-4 py-2.5 rounded-lg text-sm',
                    'bg-white/5 border border-white/10',
                    'text-[#F0F4FF] placeholder:text-[#4D5E87]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00CFFF]',
                    'transition-[border-color] duration-200 hover:border-white/20',
                    'disabled:opacity-50',
                  ].join(' ')}
                />
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Share your thoughts…"
                  maxLength={1000}
                  rows={4}
                  disabled={status === 'loading'}
                  className={[
                    'w-full px-4 py-2.5 rounded-lg text-sm resize-none',
                    'bg-white/5 border border-white/10',
                    'text-[#F0F4FF] placeholder:text-[#4D5E87]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00CFFF]',
                    'transition-[border-color] duration-200 hover:border-white/20',
                    'disabled:opacity-50',
                  ].join(' ')}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4D5E87]">
                    {content.length}/1000
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={status === 'loading'}
                  >
                    <Send size={13} className="mr-1.5" />
                    Submit
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 mt-3 text-xs text-red-400"
            >
              <AlertCircle size={13} />
              {message}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
