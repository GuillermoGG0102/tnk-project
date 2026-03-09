import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { analytics } from '@/lib/analytics'
import { PROJECT_CATEGORIES } from '@/types'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cat = PROJECT_CATEGORIES[project.category]

  const badgeVariant =
    project.category === 'analytics'       ? 'accent' :
    project.category === 'experimentation' ? 'neutral' : 'primary'

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full"
      onClick={() => analytics.projectView(project.slug, project.category)}
    >
      <article
        className="surface-card h-full flex flex-col overflow-hidden hover:border-white/20 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        style={{ '--accent': cat.color } as React.CSSProperties}
      >
        {/* Cover */}
        {project.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden shrink-0">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/70 to-transparent" />
            <div
              className="absolute inset-0 mix-blend-overlay opacity-20"
              style={{ background: cat.color }}
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          {/* Meta */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant={badgeVariant}>{cat.label}</Badge>
            <span className="flex items-center gap-1 text-xs text-[#4D5E87]">
              <Calendar size={11} /> {project.year}
            </span>
          </div>

          <h3
            className="font-display font-bold text-[#F0F4FF] text-xl mb-2 leading-snug transition-[color] duration-200"
            style={{ '--tw-text-opacity': 1 } as React.CSSProperties}
          >
            <span className="group-hover:text-[var(--accent)] transition-[color] duration-200">
              {project.title}
            </span>
          </h3>

          <p className="text-sm text-[#8A9CC8] leading-relaxed flex-1 mb-4">
            {project.shortDescription}
          </p>

          {/* Impact */}
          {project.impact && (
            <p
              className="text-xs font-medium px-3 py-2 rounded-lg mb-4"
              style={{ background: `${cat.color}10`, color: cat.color }}
            >
              {project.impact}
            </p>
          )}

          {/* Tools */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tools.slice(0, 4).map(tool => (
              <Badge key={tool} variant="neutral">{tool}</Badge>
            ))}
            {project.tools.length > 4 && (
              <Badge variant="neutral">+{project.tools.length - 4}</Badge>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#4D5E87] group-hover:text-[#00CFFF] transition-[color] duration-200 mt-auto">
            View project
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  )
}
