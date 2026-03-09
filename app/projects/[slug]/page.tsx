import type { Metadata } from 'next'
import { notFound }        from 'next/navigation'
import Link                from 'next/link'
import { ArrowLeft, ExternalLink, CheckCircle2, Wrench, Calendar, Tag } from 'lucide-react'
import { getProjectBySlug, getAllProjects } from '@/lib/mdx'
import { Badge }           from '@/components/ui/Badge'
import { Button }          from '@/components/ui/Button'
import { analytics }       from '@/lib/analytics'
import { PROJECT_CATEGORIES } from '@/types'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}
  const fm = project.frontmatter
  return {
    title:       fm.title,
    description: fm.shortDescription,
    openGraph: {
      title:       fm.title,
      description: fm.shortDescription,
      type:        'article',
      images:      fm.coverImage ? [{ url: fm.coverImage }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const projectData = getProjectBySlug(params.slug)
  if (!projectData) notFound()

  const fm  = projectData.frontmatter
  const cat = PROJECT_CATEGORIES[fm.category as keyof typeof PROJECT_CATEGORIES]

  const badgeVariant =
    fm.category === 'analytics'       ? 'accent'  :
    fm.category === 'experimentation' ? 'neutral' : 'primary'

  const { default: ProjectContent } = await import(`@/content/projects/${params.slug}.mdx`)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#8A9CC8] hover:text-[#F0F4FF] transition-[color] duration-200 mb-10 focus-ring"
        >
          <ArrowLeft size={15} /> Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge variant={badgeVariant}>{cat?.label ?? fm.category}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-[#4D5E87]">
              <Calendar size={12} /> {fm.year}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F0F4FF] leading-tight tracking-tight mb-4">
            {fm.title}
          </h1>
          <p className="text-[#8A9CC8] text-xl leading-relaxed max-w-3xl">{fm.shortDescription}</p>

          {fm.link && (
            <div className="mt-6">
              <Button
                variant="primary"
                size="md"
                onClick={() => analytics.ctaClick('View Live Project', params.slug)}
              >
                <a href={fm.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  View live project <ExternalLink size={15} />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Cover */}
        {fm.coverImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-white/[0.06]">
            <img src={fm.coverImage} alt={fm.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/40 to-transparent" />
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Tools */}
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={14} className="text-[#4D5E87]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#4D5E87]">Tools</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fm.tools?.map((tool: string) => (
                <Badge key={tool} variant="neutral">{tool}</Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={14} className="text-[#4D5E87]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#4D5E87]">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fm.tags?.map((tag: string) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Impact */}
          {fm.results?.length > 0 && (
            <div className="surface-card p-5" style={{ borderColor: `${cat?.color}20` }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} style={{ color: cat?.color }} />
                <span className="text-xs font-semibold uppercase tracking-wide text-[#4D5E87]">Results</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {fm.results.map((r: string) => (
                  <li key={r} className="flex items-start gap-2 text-xs text-[#8A9CC8]">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: cat?.color }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Content */}
        <article className="prose-tnk mb-14">
          <ProjectContent />
        </article>

        {/* CTA */}
        <div className="pt-10 border-t border-white/[0.06] flex flex-wrap gap-4">
          <Button variant="primary" size="lg" onClick={() => analytics.ctaClick('Contact After Project', params.slug)}>
            <Link href="/contact">Work with me</Link>
          </Button>
          <Button variant="ghost" size="lg">
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft size={16} /> More projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
