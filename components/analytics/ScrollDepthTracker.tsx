'use client'

import { useEffect, useRef } from 'react'
import { analytics } from '@/lib/analytics'

const CHECKPOINTS = [25, 50, 75, 100] as const

export function ScrollDepthTracker() {
  const fired = useRef(new Set<number>())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      const scrolled     = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

      for (const checkpoint of CHECKPOINTS) {
        if (scrolled >= checkpoint && !fired.current.has(checkpoint)) {
          fired.current.add(checkpoint)
          analytics.scrollDepth(checkpoint)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}
