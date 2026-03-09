import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { BLOG_CATEGORIES } from '@/types'
import { analytics } from '@/lib/analytics'
import type { BlogPost } from '@/types'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cat         = BLOG_CATEGORIES[post.category]
  const badgeVariant =
    post.category === 'analytics'         ? 'accent'  :
    post.category === 'design'            ? 'primary' :
    post.category === 'league-of-legends' ? 'lol'     : 'padel'

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block"
        onClick={() => analytics.blogPostView(post.slug, post.category, post.readingTime)}
      >
        <article className="surface-card overflow-hidden grid md:grid-cols-2 hover:border-white/20 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {/* Image */}
          {post.coverImage && (
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F1629]/60" />
            </div>
          )}

          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={badgeVariant}>{cat.label}</Badge>
              <span className="flex items-center gap-1 text-xs text-[#4D5E87]">
                <Clock size={11} /> {post.readingTime}
              </span>
            </div>
            <h3 className="font-display font-bold text-[#F0F4FF] text-2xl leading-snug mb-3 group-hover:text-[#00CFFF] transition-[color] duration-200">
              {post.title}
            </h3>
            <p className="text-[#8A9CC8] text-sm leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-[#4D5E87]">{formatDate(post.date)}</time>
              <span className="flex items-center gap-1 text-sm font-medium text-[#00CFFF] group-hover:gap-2 transition-all duration-200">
                Read <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full"
      onClick={() => analytics.blogPostView(post.slug, post.category, post.readingTime)}
    >
      <article className="surface-card h-full flex flex-col overflow-hidden hover:border-white/20 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden shrink-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/60 to-transparent" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2.5 mb-3">
            <Badge variant={badgeVariant}>{cat.label}</Badge>
            <span className="flex items-center gap-1 text-xs text-[#4D5E87]">
              <Clock size={11} /> {post.readingTime}
            </span>
          </div>
          <h3 className="font-display font-bold text-[#F0F4FF] text-lg leading-snug mb-2 group-hover:text-[#00CFFF] transition-[color] duration-200">
            {post.title}
          </h3>
          <p className="text-sm text-[#8A9CC8] leading-relaxed flex-1 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <time className="text-xs text-[#4D5E87]">{formatDate(post.date)}</time>
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
