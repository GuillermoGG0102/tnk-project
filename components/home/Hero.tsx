'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BarChart3, Palette, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'

const FLOATING_TAGS = [
  { label: 'GA4',            Icon: BarChart3, delay: 0,    top: '15%', left: '5%'  },
  { label: 'Framer',         Icon: Palette,   delay: 0.15, top: '70%', left: '2%'  },
  { label: 'A/B Testing',    Icon: Zap,       delay: 0.3,  top: '20%', right: '3%' },
  { label: 'GTM',            Icon: BarChart3, delay: 0.45, top: '75%', right: '4%' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0A0F1E]" />

      {/* Radial glow 1 — primary */}
      <div
        aria-hidden
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-4xl max-h-4xl rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 65%)',
        }}
      />
      {/* Radial glow 2 — accent */}
      <div
        aria-hidden
        className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-3xl max-h-3xl rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,179,0.05) 0%, transparent 65%)',
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating tag labels (desktop only) */}
      {FLOATING_TAGS.map(({ label, Icon, delay, ...pos }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#8A9CC8] bg-[#0F1629]/80 backdrop-blur-sm border border-white/[0.08]"
          style={pos as React.CSSProperties}
        >
          <Icon size={12} className="text-[#00CFFF]" />
          {label}
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB3] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FFB3]" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#8A9CC8]">
                Available for new opportunities
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-[-0.04em] mb-6"
          >
            <span className="text-[#F0F4FF]">Design meets</span>
            <br />
            <span className="text-gradient-primary">Analytics.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-[#8A9CC8] leading-relaxed max-w-2xl mb-4"
          >
            Hi, I'm <span className="text-[#F0F4FF] font-medium">Guillermo García</span> — Digital Analytics Specialist & Designer.
            I bridge the gap between data strategy and creative vision to build experiences that are
            both measurable and beautiful.
          </motion.p>

          <motion.p variants={item} className="text-sm text-[#4D5E87] mb-10">
            GA4 · GTM · A/B Testing · Data Strategy · UI Design · Branding
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="primary"
              asChild
              onClick={() => analytics.ctaClick('View Projects', 'hero')}
            >
              <Link href="/projects" className="flex items-center gap-2">
                View Projects
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => analytics.ctaClick('Read Blog', 'hero')}
            >
              <Link href="/blog" className="flex items-center gap-2">
                Read the Blog
              </Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="mt-16 pt-10 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { value: '5+',   label: 'Years in Analytics' },
              { value: '30+',  label: 'Projects Delivered' },
              { value: '100%', label: 'Data-Driven' },
              { value: '∞',    label: 'Curiosity' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-3xl font-bold text-gradient-primary mb-1">{value}</div>
                <div className="text-xs text-[#4D5E87] uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0F1E] to-transparent pointer-events-none" />
    </section>
  )
}
