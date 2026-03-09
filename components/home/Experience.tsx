'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import type { ExperienceItem } from '@/types'

const EXPERIENCE: ExperienceItem[] = [
  {
    company:   'Digital Agency XYZ',
    role:      'Senior Digital Analytics Consultant',
    startDate: '2022',
    endDate:   null,
    description: [
      'Led analytics implementation for 10+ enterprise clients across e-commerce, BFSI and media.',
      'Designed and deployed GA4 migration strategies with custom event schemas and measurement frameworks.',
      'Delivered A/B testing programmes that generated +18% average conversion uplift.',
    ],
    tags: ['GA4', 'GTM', 'BigQuery', 'Looker Studio', 'A/B Testing'],
  },
  {
    company:   'Performance Growth Co.',
    role:      'Analytics & CRO Specialist',
    startDate: '2020',
    endDate:   '2022',
    description: [
      'Owned the full analytics stack (tagging, QA, reporting) for a portfolio of 15 digital brands.',
      'Designed data visualisation dashboards consumed by C-suite stakeholders.',
      'Reduced tracking error rate from 23% to under 2% through systematic audit processes.',
    ],
    tags: ['GA Universal → GA4', 'Hotjar', 'Optimizely', 'Tableau', 'Python'],
  },
  {
    company:   'Creative Studio TNK',
    role:      'Founder & UX/UI Designer',
    startDate: '2018',
    endDate:   '2020',
    description: [
      'Founded a boutique design studio focusing on brand identity, web design and digital campaigns.',
      'Delivered end-to-end brand projects for 20+ SMBs across Spain and LATAM.',
      'Developed a design system used across 8 client projects, reducing delivery time by 40%.',
    ],
    tags: ['Figma', 'Brand Identity', 'Webflow', 'Motion Design', 'CSS'],
  },
  {
    company:   'Marketing Agency Pro',
    role:      'Junior Digital Analyst',
    startDate: '2017',
    endDate:   '2018',
    description: [
      'Supported analytics implementations for paid media and SEO campaigns.',
      'Built weekly performance reports in Google Data Studio for account managers.',
    ],
    tags: ['Google Analytics', 'Google Ads', 'Data Studio', 'Excel'],
  },
]

export function Experience() {
  return (
    <section id="experience" className="section-padding bg-[#0F1629]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Work history"
          title="Where I've worked"
          description="A timeline of roles that shaped my perspective at the intersection of data and design."
          className="mb-16"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-[calc(50%-1px)] top-0 bottom-0 w-px bg-gradient-to-b from-[#00CFFF]/40 via-white/10 to-transparent hidden md:block" />

          <div className="flex flex-col gap-12">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${exp.startDate}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                  i % 2 === 0 ? '' : 'md:[direction:rtl]'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute hidden md:flex left-[calc(50%-6px)] top-6 w-3 h-3 rounded-full bg-[#00CFFF] shadow-[0_0_12px_rgba(0,207,255,0.5)]" />

                {/* Card */}
                <div className={`surface-card p-6 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10 md:[direction:ltr]'}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-[#F0F4FF] text-lg leading-tight mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-[#00CFFF] text-sm font-medium">{exp.company}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs text-[#4D5E87] bg-white/5 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {exp.startDate} – {exp.endDate ?? 'Present'}
                      </span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-5">
                    {exp.description.map((d, j) => (
                      <li key={j} className="flex gap-2 text-sm text-[#8A9CC8] leading-relaxed">
                        <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#00CFFF]/60" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map(tag => (
                      <Badge key={tag} variant="neutral">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Spacer (opposite side) */}
                <div />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
