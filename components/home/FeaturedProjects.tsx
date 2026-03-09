'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'
import type { Project } from '@/types'

// Static featured projects (augment later with MDX content)
const FEATURED_PROJECTS: Pick<Project, 'slug' | 'title' | 'shortDescription' | 'category' | 'tags' | 'coverImage' | 'impact' | 'year'>[] = [
  {
    slug:             'ga4-migration-framework',
    title:            'GA4 Migration Framework',
    shortDescription: 'End-to-end migration strategy from Universal Analytics to GA4 for a 3M+ sessions/month e-commerce platform.',
    category:         'analytics',
    tags:             ['GA4', 'GTM', 'BigQuery', 'Data Schema'],
    coverImage:       'https://placehold.co/800x500/0F1629/00CFFF?text=GA4+Migration',
    impact:           '+40% data coverage · 0 tracking gaps · Delivered on time',
    year:             '2023',
  },
  {
    slug:             'ab-testing-programme',
    title:            'CRO & A/B Testing Programme',
    shortDescription: 'Structured experimentation roadmap that generated +22% checkout conversion rate across 6 months.',
    category:         'experimentation',
    tags:             ['Optimizely', 'VWO', 'Statistics', 'CRO'],
    coverImage:       'https://placehold.co/800x500/0F1629/B77FFF?text=A%2FB+Testing',
    impact:           '+22% conversion · 48 experiments · €2M revenue uplift',
    year:             '2023',
  },
  {
    slug:             'design-system',
    title:            'Brand Design System',
    shortDescription: 'Comprehensive design system and component library for a SaaS startup — from tokens to documentation.',
    category:         'design',
    tags:             ['Figma', 'Design Tokens', 'Component Library', 'Storybook'],
    coverImage:       'https://placehold.co/800x500/0F1629/00FFB3?text=Design+System',
    impact:           '200+ components · 40% faster delivery · Used by 6-person team',
    year:             '2022',
  },
]

const CATEGORY_COLORS = {
  analytics:       '#00CFFF',
  experimentation: '#B77FFF',
  design:          '#00FFB3',
}

export function FeaturedProjects() {
  return (
    <section id="projects" className="section-padding bg-[#0F1629]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <SectionHeader
            eyebrow="Featured work"
            title="Selected projects"
            description="A curated selection of projects across analytics, design, and experimentation."
          />
          <Link
            href="/projects"
            className="shrink-0 flex items-center gap-1.5 text-sm text-[#00CFFF] hover:text-[#1AD5FF] transition-[color] duration-200 focus-ring"
            onClick={() => analytics.ctaClick('View All Projects', 'featured-projects')}
          >
            All projects <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FEATURED_PROJECTS.map((project, i) => {
            const accentColor = CATEGORY_COLORS[project.category]
            return (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="group"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="block"
                  onClick={() => analytics.projectView(project.slug, project.category)}
                >
                  <div className="surface-card overflow-hidden hover:border-white/20 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                    {/* Cover image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.coverImage!}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/80 via-transparent to-transparent" />
                      <div className="absolute inset-0" style={{ background: `${accentColor}08`, mixBlendMode: 'overlay' }} />

                      {/* Year badge */}
                      <div className="absolute top-3 right-3 text-xs font-mono px-2 py-1 rounded-md bg-[#0A0F1E]/80 backdrop-blur-sm text-[#8A9CC8] border border-white/10">
                        {project.year}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      {/* Category */}
                      <div className="mb-3">
                        <span
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: accentColor }}
                        >
                          {project.category}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-[#F0F4FF] text-xl mb-2 group-hover:text-gradient-primary transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#8A9CC8] leading-relaxed mb-4">
                        {project.shortDescription}
                      </p>

                      {/* Impact */}
                      {project.impact && (
                        <p
                          className="text-xs font-medium px-3 py-2 rounded-lg mb-4"
                          style={{ background: `${accentColor}10`, color: accentColor }}
                        >
                          {project.impact}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="neutral">{tag}</Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="neutral">+{project.tags.length - 3}</Badge>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-[#4D5E87] group-hover:text-[#00CFFF] transition-[color] duration-200">
                        View project <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => analytics.ctaClick('View All Projects CTA', 'featured-projects')}
          >
            <Link href="/projects" className="flex items-center gap-2">
              Explore all projects <ExternalLink size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
