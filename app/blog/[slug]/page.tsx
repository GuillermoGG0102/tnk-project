import type { Metadata } from 'next'
import { notFound }        from 'next/navigation'
import Link                from 'next/link'
import { ArrowLeft, Clock, Calendar, Tag, Linkedin, Instagram } from 'lucide-react'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/mdx'
import { NewsletterForm } from '@/components/blog/NewsletterForm'
import { Comments } from '@/components/blog/Comments'
import { Badge }          from '@/components/ui/Badge'
import { BlogCard }       from '@/components/blog/BlogCard'
import { formatDate }     from '@/lib/utils'
import { BLOG_CATEGORIES } from '@/types'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)
  if (!post) return {}

  const { frontmatter: fm } = post
  return {
    title:       fm.title,
    description: fm.excerpt,
    openGraph: {
      title:       fm.title,
      description: fm.excerpt,
      type:        'article',
      publishedTime: fm.date,
      authors:     [fm.author?.name ?? 'Guillermo García'],
      images:      fm.coverImage ? [{ url: fm.coverImage }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const postData = getBlogPostBySlug(params.slug)
  if (!postData) notFound()

  const { frontmatter: fm } = postData
  const allPosts             = getAllBlogPosts()
  const related              = allPosts
    .filter(p => p.slug !== params.slug && p.category === fm.category)
    .slice(0, 3)

  const cat          = BLOG_CATEGORIES[fm.category as keyof typeof BLOG_CATEGORIES]
  const badgeVariant =
    fm.category === 'analytics'         ? 'accent'  :
    fm.category === 'design'            ? 'primary' :
    fm.category === 'league-of-legends' ? 'lol'     : 'padel'

  // Dynamic MDX import
  const { default: PostContent } = await import(`@/content/blog/${params.slug}.mdx`)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#8A9CC8] hover:text-[#F0F4FF] transition-[color] duration-200 mb-10 focus-ring"
        >
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge variant={badgeVariant}>{cat?.label ?? fm.category}</Badge>
            <span className="flex items-center gap-1.5 text-xs text-[#4D5E87]">
              <Clock size={12} /> {fm.readingTime}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#4D5E87]">
              <Calendar size={12} /> {formatDate(fm.date)}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#F0F4FF] leading-tight tracking-tight mb-5">
            {fm.title}
          </h1>
          <p className="text-[#8A9CC8] text-xl leading-relaxed">{fm.excerpt}</p>
        </header>

        {/* Cover image */}
        {fm.coverImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-white/[0.06]">
            <img
              src={fm.coverImage}
              alt={fm.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/40 to-transparent" />
          </div>
        )}

        {/* Author */}
        {fm.author && (
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0F1629] border border-white/[0.08] mb-12">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00CFFF] to-[#00FFB3] flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-[#0A0F1E] text-lg">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#F0F4FF] text-sm">{fm.author.name}</div>
              <div className="text-xs text-[#8A9CC8] truncate">{fm.author.bio}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {fm.author.linkedin && (
                <a href={fm.author.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#4D5E87] hover:text-[#00CFFF] transition-[color] duration-200 focus-ring">
                  <Linkedin size={16} />
                </a>
              )}
              {fm.author.instagram && (
                <a href={fm.author.instagram} target="_blank" rel="noopener noreferrer" className="text-[#4D5E87] hover:text-[#00CFFF] transition-[color] duration-200 focus-ring">
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <article className="prose-tnk mb-14">
          <PostContent />
        </article>

        {/* Tags */}
        {fm.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-16 pt-8 border-t border-white/[0.06]">
            <Tag size={14} className="text-[#4D5E87]" />
            {fm.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-xs text-[#8A9CC8] bg-white/5 border border-white/[0.08] hover:border-white/20 hover:text-[#F0F4FF] transition-[color,border-color] duration-200 focus-ring"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Comments */}
        <Comments postSlug={params.slug} postTitle={fm.title} />

        {/* Newsletter */}
        <div className="mb-16">
          <NewsletterForm source={`blog-post-${params.slug}`} />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-[#F0F4FF] text-2xl mb-8">Related posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
