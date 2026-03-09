import type { Metadata } from 'next'
import { Suspense }       from 'react'
import { getAllProjects }  from '@/lib/mdx'
import { ProjectCard }    from '@/components/projects/ProjectCard'
import { ProjectFilter }  from '@/components/projects/ProjectFilter'
import type { ProjectCategory } from '@/types'

export const metadata: Metadata = {
  title:       'Projects',
  description: 'Analytics implementations, design systems, and experimentation programmes by Guillermo García.',
}

interface ProjectsPageProps {
  searchParams: { category?: ProjectCategory }
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const all      = getAllProjects()
  const filtered = searchParams.category
    ? all.filter(p => p.category === searchParams.category)
    : all

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#00CFFF] mb-3">Portfolio</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gradient-primary tracking-tight mb-5">
            Selected work
          </h1>
          <p className="text-[#8A9CC8] text-lg max-w-2xl">
            A curated collection of analytics implementations, design projects, and experimentation programmes
            — each built to solve real problems with measurable outcomes.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-12">
          <Suspense>
            <ProjectFilter />
          </Suspense>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#4D5E87]">
            <p className="text-2xl font-display font-bold mb-2">No projects here yet</p>
            <p className="text-sm">Check back soon or browse all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
