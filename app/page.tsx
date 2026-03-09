import type { Metadata } from 'next'
import { Hero }             from '@/components/home/Hero'
import { About }            from '@/components/home/About'
import { Experience }       from '@/components/home/Experience'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Skills }           from '@/components/home/Skills'
import { BlogPreview }      from '@/components/home/BlogPreview'
import { ContactCTA }       from '@/components/home/ContactCTA'
import { getAllBlogPosts }   from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'TNK – Design & Analytics',
  description:
    'Personal portfolio and blog of Guillermo García — Digital Analytics Specialist & Designer. GA4, GTM, experimentation, UI design.',
}

export default function HomePage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <FeaturedProjects />
      <Skills />
      <BlogPreview posts={posts} />
      <ContactCTA />
    </>
  )
}
