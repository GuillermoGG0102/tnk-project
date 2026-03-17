'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface LikeButtonProps {
  slug: string
}

function getBrowserId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'tnk_browser_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [count,   setCount]   = useState(0)
  const [liked,   setLiked]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const browserId = getBrowserId()
    fetch(`/api/likes/${slug}?browser_id=${encodeURIComponent(browserId)}`)
      .then(r => r.json())
      .then(data => {
        setCount(data.count ?? 0)
        setLiked(data.liked ?? false)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const handleClick = async () => {
    if (loading) return
    const browserId = getBrowserId()
    const nextLiked = !liked
    // Optimistic update
    setLiked(nextLiked)
    setCount(c => c + (nextLiked ? 1 : -1))

    try {
      const res  = await fetch(`/api/likes/${slug}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ browser_id: browserId }),
      })
      const data = await res.json()
      if (res.ok) {
        setCount(data.count ?? 0)
        setLiked(data.liked ?? nextLiked)
        analytics.blogLike(slug, data.liked ? 'like' : 'unlike')
      } else {
        // Revert on error
        setLiked(!nextLiked)
        setCount(c => c + (nextLiked ? -1 : 1))
      }
    } catch {
      // Revert on network error
      setLiked(!nextLiked)
      setCount(c => c + (nextLiked ? -1 : 1))
    }
  }

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label={liked ? 'Unlike this post' : 'Like this post'}
        aria-pressed={liked}
        className={[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
          'border transition-[color,border-color,background-color] duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CFFF]',
          liked
            ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/40 text-[#FF6B6B] hover:bg-[#FF6B6B]/15'
            : 'bg-white/[0.04] border-white/10 text-[#8A9CC8] hover:border-white/20 hover:text-[#F0F4FF]',
        ].join(' ')}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={16}
            className={liked ? 'fill-[#FF6B6B]' : ''}
          />
        </motion.span>
        <span>{loading ? '—' : count}</span>
      </motion.button>
      <span className="text-xs text-[#4D5E87]">
        {count === 1 ? '1 like' : `${loading ? '—' : count} likes`}
      </span>
    </div>
  )
}
