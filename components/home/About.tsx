'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Gamepad2, Dumbbell, BarChart3, Palette } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const INTERESTS = [
  { Icon: BarChart3, label: 'Analytics',        color: '#00CFFF' },
  { Icon: Palette,   label: 'Design',           color: '#00FFB3' },
  { Icon: Gamepad2,  label: 'League of Legends', color: '#C89B3C' },
  { Icon: Dumbbell,  label: 'Padel',            color: '#FF6B6B' },
]

export function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeader
              eyebrow="About me"
              title="Data meets craft"
              description="I'm a Digital Analytics Specialist with a designer's eye. I help companies understand their users through clean tracking implementations, robust measurement frameworks, and data visualisations — while keeping the experience sharp."
            />

            <div className="mt-8 space-y-4 text-[#8A9CC8] leading-relaxed">
              <p>
                My journey started in design — building brands and interfaces from scratch. Over time,
                I became obsessed with understanding <em className="text-[#F0F4FF] not-italic">why</em> certain
                designs convert and others don't. That obsession led me to analytics.
              </p>
              <p>
                Today I sit at the intersection: I implement tracking that captures real user behaviour,
                design experiments to test hypotheses, and translate data into strategic decisions.
                Tools are just tools — the thinking is what matters.
              </p>
              <p>
                Outside of work you'll find me on a padel court, deep in a ranked League of Legends
                session, or exploring the latest creative direction in motion design.
              </p>
            </div>

            {/* Interests */}
            <div className="mt-10 flex flex-wrap gap-3">
              {INTERESTS.map(({ Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1629] border border-white/[0.08] text-sm text-[#8A9CC8]"
                >
                  <Icon size={15} style={{ color }} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative"
          >
            {/* Photo placeholder */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://placehold.co/600x750/0F1629/00CFFF?text=Guillermo"
                alt="Guillermo García"
                fill
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/70 via-transparent to-transparent" />
              {/* Color treatment */}
              <div className="absolute inset-0 bg-[#00CFFF]/5 mix-blend-overlay" />
            </div>

            {/* Floating info card */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-[#0F1629]/95 backdrop-blur-sm border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="text-xs text-[#4D5E87] mb-1">Current focus</div>
              <div className="text-sm font-semibold text-[#F0F4FF]">Analytics & Experimentation</div>
              <div className="text-xs text-[#00CFFF] mt-1">GA4 · GTM · A/B Testing</div>
            </motion.div>

            {/* Decorative corner gradient */}
            <div
              aria-hidden
              className="absolute -top-6 -right-6 w-40 h-40 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,255,179,0.12) 0%, transparent 70%)' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
