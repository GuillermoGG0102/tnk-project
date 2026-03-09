import type { Metadata } from 'next'
import { Suspense }       from 'react'
import { Search }         from 'lucide-react'
import { getAllBlogPosts } from '@/lib/mdx'
import { BlogCard }        from '@/components/blog/BlogCard'
import { CategoryFilter }  from '@/components/blog/CategoryFilter'
import { NewsletterForm }  from '@/components/blog/NewsletterForm'
import type { BlogCategory } from '@/types'

export const metadata: Metadata = {
  title:       'Blog',
  description: 'Articles on digital analytics, UI design, League of Legends, and padel. Insights from the intersection of data and creativity.',
}

interface BlogPageProps {
  searchParams: {
    category?: BlogCategory
    search?:   string
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const allPosts = getAllBlogPosts()

  // Filter by category
  const categoryFiltered = searchParams.category
    ? allPosts.filter(p => p.category === searchParams.category)
    : allPosts

  // Filter by search
  const query   = (searchParams.search ?? '').toLowerCase()
  const filtered = query
    ? categoryFiltered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query)),
      )
    : categoryFiltered

  const featured = filtered[0]
  const rest      = filtered.slice(1)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#00CFFF] mb-3">
            Writing
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gradient-primary tracking-tight mb-5">
            The blog
          </h1>
          <p className="text-[#8A9CC8] text-lg max-w-xl">
            Thoughts on analytics, design, competitive gaming, and life on the padel court.
          </p>
        </div>

        {/* Filters & search row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
          <Suspense>
            <CategoryFilter />
          </Suspense>

          <form
            method="GET"
            className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F1629] border border-white/[0.08] focus-within:border-[#00CFFF]/40 transition-[border-color] duration-200"
          >
            <Search size={15} className="text-[#4D5E87] shrink-0" />
            <input
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search articles…"
              className="bg-transparent text-sm text-[#F0F4FF] placeholder:text-[#4D5E87] outline-none w-44"
            />
            {searchParams.category && (
              <input type="hidden" name="category" value={searchParams.category} />
            )}
          </form>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#4D5E87]">
            <p className="text-2xl font-display font-bold mb-2">No posts found</p>
            <p className="text-sm">Try a different category or search term.</p>
          </div>
        ) : (
          <>
            {/* Featured / first post */}
            {featured && !query && !searchParams.category && (
              <div className="mb-10">
                <BlogCard post={featured} featured />
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {(query || searchParams.category ? filtered : rest).map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}

        {/* Newsletter */}
        <NewsletterForm source="blog-page" />
      </div>
    </div>
  )
}
