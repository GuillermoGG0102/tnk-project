import type { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllProjects } from '@/lib/mdx'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tnk.design'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts    = getAllBlogPosts()
  const projects = getAllProjects()

  const static_routes: MetadataRoute.Sitemap = [
    { url: SITE_URL,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${SITE_URL}/blog`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const blog_routes: MetadataRoute.Sitemap = posts.map(post => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    new Date(post.date),
    changeFrequency: 'monthly',
    priority:        0.8,
  }))

  const project_routes: MetadataRoute.Sitemap = projects.map(project => ({
    url:             `${SITE_URL}/projects/${project.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  return [...static_routes, ...blog_routes, ...project_routes]
}
