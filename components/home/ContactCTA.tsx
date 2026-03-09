'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'

export function ContactCTA() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F1629] via-[#162038] to-[#0F1629]" />

          {/* Radial glows */}
          <div
            aria-hidden
            className="absolute top-0 left-0 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.08) 0%, transparent 70%)' }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,179,0.06) 0%, transparent 70%)' }}
          />

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />

          <div className="relative z-10 px-8 sm:px-16 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#00CFFF] mb-4">
              Let's work together
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-primary mb-6 tracking-tight">
              Ready to level up<br className="hidden sm:block" /> your analytics?
            </h2>
            <p className="text-[#8A9CC8] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you need a robust tracking implementation, a data strategy overhaul,
              or a beautiful interface — let's talk.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => analytics.ctaClick('Get In Touch', 'contact-cta')}
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Mail size={18} />
                  Get in touch
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => analytics.ctaClick('View Projects Bottom', 'contact-cta')}
              >
                <Link href="/projects" className="flex items-center gap-2">
                  View projects <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
