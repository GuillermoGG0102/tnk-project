'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'
import { formatDate } from '@/lib/utils'
import { BLOG_CATEGORIES } from '@/types'
import type { BlogPost } from '@/types'

interface BlogPreviewProps {
  posts: BlogPost[]
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const displayed = posts.slice(0, 3)

  return (
    <section id="blog" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <SectionHeader
            eyebrow="Writing"
            title="Latest posts"
            description="Thoughts on analytics, design, gaming and life on the padel court."
          />
          <Link
            href="/blog"
            className="shrink-0 flex items-center gap-1.5 text-sm text-[#00CFFF] hover:text-[#1AD5FF] transition-[color] duration-200 focus-ring"
            onClick={() => analytics.ctaClick('View All Posts', 'blog-preview')}
          >
            All posts <ArrowRight size={16} />
          </Link>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-20 text-[#4D5E87]">
            <p className="text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayed.map((post, i) => {
              const cat = BLOG_CATEGORIES[post.category]
              const badgeVariant =
                post.category === 'analytics'         ? 'accent' :
                post.category === 'design'            ? 'primary' :
                post.category === 'league-of-legends' ? 'lol' : 'padel'

              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                  className="group"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full"
                    onClick={() => analytics.blogPostView(post.slug, post.category, post.readingTime)}
                  >
                    <div className="surface-card h-full flex flex-col overflow-hidden hover:border-white/20 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                      {/* Cover */}
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
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={badgeVariant}>{cat.label}</Badge>
                          <span className="flex items-center gap-1 text-xs text-[#4D5E87]">
                            <Clock size={11} />
                            {post.readingTime}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-[#F0F4FF] text-lg leading-snug mb-2 group-hover:text-[#00CFFF] transition-[color] duration-200">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#8A9CC8] leading-relaxed flex-1 mb-5">
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                          <time className="text-xs text-[#4D5E87]">
                            {formatDate(post.date)}
                          </time>
                          <span className="flex items-center gap-1 text-xs font-medium text-[#4D5E87] group-hover:text-[#00CFFF] transition-[color] duration-200">
                            Read <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={() => analytics.ctaClick('Go To Blog CTA', 'blog-preview')}
          >
            <Link href="/blog">Browse all articles</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
