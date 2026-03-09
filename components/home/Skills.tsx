'use client'

import { motion } from 'framer-motion'
import {
  BarChart3, Target, FlaskConical, Database, Code2,
  Palette, Layers, Pen, Monitor, Wand2,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const ANALYTICS_SKILLS = [
  { Icon: BarChart3,    label: 'GA4 / Universal Analytics', level: 95 },
  { Icon: Target,       label: 'Google Tag Manager',         level: 92 },
  { Icon: FlaskConical, label: 'A/B Testing & Experimentation', level: 85 },
  { Icon: Database,     label: 'BigQuery & SQL',             level: 78 },
  { Icon: Monitor,      label: 'Looker Studio / Tableau',    level: 88 },
  { Icon: Code2,        label: 'Python for Analytics',       level: 70 },
]

const DESIGN_SKILLS = [
  { Icon: Palette,  label: 'UI / UX Design',     level: 90 },
  { Icon: Layers,   label: 'Figma',              level: 95 },
  { Icon: Pen,      label: 'Brand Identity',     level: 85 },
  { Icon: Wand2,    label: 'Motion Design',      level: 72 },
  { Icon: Code2,    label: 'HTML / CSS / Tailwind', level: 88 },
  { Icon: Monitor,  label: 'Webflow / Next.js',  level: 80 },
]

interface SkillBarProps {
  Icon: React.ElementType
  label: string
  level: number
  color: string
  delay: number
}

function SkillBar({ Icon, label, level, color, delay }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon size={16} style={{ color }} />
          <span className="text-sm text-[#8A9CC8] font-medium">{label}</span>
        </div>
        <span className="text-xs font-mono text-[#4D5E87]">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + 0.1 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </motion.div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Expertise"
          title="Skills & tools"
          description="Two distinct but complementary skill sets — data-driven thinking and visual craft."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics pillar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="surface-card p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-[#00CFFF]/10">
                <BarChart3 size={20} className="text-[#00CFFF]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#F0F4FF] text-lg">Digital Analytics</h3>
                <p className="text-xs text-[#4D5E87]">Data strategy & measurement</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {ANALYTICS_SKILLS.map(({ Icon, label, level }, i) => (
                <SkillBar
                  key={label}
                  Icon={Icon}
                  label={label}
                  level={level}
                  color="#00CFFF"
                  delay={i * 0.06}
                />
              ))}
            </div>
          </motion.div>

          {/* Design pillar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="surface-card p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-[#00FFB3]/10">
                <Palette size={20} className="text-[#00FFB3]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#F0F4FF] text-lg">Design</h3>
                <p className="text-xs text-[#4D5E87]">Visual craft & interaction</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {DESIGN_SKILLS.map(({ Icon, label, level }, i) => (
                <SkillBar
                  key={label}
                  Icon={Icon}
                  label={label}
                  level={level}
                  color="#00FFB3"
                  delay={i * 0.06}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tool logos row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 p-6 rounded-2xl bg-[#0F1629]/60 border border-white/[0.06]"
        >
          <p className="text-xs text-[#4D5E87] text-center mb-6 uppercase tracking-widest">Also familiar with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Hotjar', 'Optimizely', 'Amplitude', 'Segment', 'dbt', 'Snowflake',
              'Webflow', 'WordPress', 'Adobe XD', 'After Effects', 'Notion', 'Linear',
            ].map(tool => (
              <span
                key={tool}
                className="px-3 py-1.5 rounded-lg text-xs text-[#8A9CC8] bg-white/5 border border-white/[0.06] hover:border-white/10 hover:text-[#F0F4FF] transition-[color,border-color] duration-200"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
