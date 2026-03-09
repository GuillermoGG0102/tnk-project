import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { BlogPost, Project } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const BLOG_DIR    = path.join(CONTENT_DIR, 'blog')
const PROJECT_DIR = path.join(CONTENT_DIR, 'projects')

// ─── Blog ─────────────────────────────────────────────────────────

function getBlogPostFilePaths(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter(f => /\.mdx?$/.test(f))
}

function parseBlogPost(filename: string): BlogPost | null {
  const slug = filename.replace(/\.mdx?$/, '')
  const filePath = path.join(BLOG_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  if (!data.published) return null

  return {
    slug,
    title:       data.title       ?? '',
    excerpt:     data.excerpt      ?? '',
    date:        data.date         ?? '',
    category:    data.category     ?? 'design',
    tags:        data.tags         ?? [],
    readingTime: readingTime(content).text,
    coverImage:  data.coverImage,
    author:      data.author ?? defaultAuthor,
    published:   data.published,
  }
}

export function getAllBlogPosts(): BlogPost[] {
  return getBlogPostFilePaths()
    .map(parseBlogPost)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    frontmatter: {
      ...data,
      readingTime: readingTime(content).text,
      author: data.author ?? defaultAuthor,
    },
    content,
  }
}

// ─── Projects ─────────────────────────────────────────────────────

function getProjectFilePaths(): string[] {
  if (!fs.existsSync(PROJECT_DIR)) return []
  return fs.readdirSync(PROJECT_DIR).filter(f => /\.mdx?$/.test(f))
}

function parseProject(filename: string): Project | null {
  const slug = filename.replace(/\.mdx?$/, '')
  const filePath = path.join(PROJECT_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  if (!data.published) return null

  return {
    slug,
    title:            data.title            ?? '',
    shortDescription: data.shortDescription ?? '',
    description:      data.description      ?? '',
    category:         data.category         ?? 'analytics',
    tags:             data.tags             ?? [],
    tools:            data.tools            ?? [],
    coverImage:       data.coverImage,
    results:          data.results,
    impact:           data.impact,
    year:             data.year             ?? '',
    link:             data.link,
    featured:         data.featured         ?? false,
  }
}

export function getAllProjects(): Project[] {
  return getProjectFilePaths()
    .map(parseProject)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.year.localeCompare(a.year))
}

export function getProjectBySlug(slug: string) {
  const filePath = path.join(PROJECT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { slug, frontmatter: data, content }
}

// ─── Author ───────────────────────────────────────────────────────

const defaultAuthor = {
  name:      'Guillermo García',
  bio:       'Digital Analytics Specialist & Designer. Turning data into decisions and pixels into stories.',
  avatar:    undefined,
  linkedin:  'https://www.linkedin.com/in/guillermo-garc%C3%ADa-gonz%C3%A1lez-l%C3%B3pez/',
  instagram: 'https://www.instagram.com/tnkdesigns_/',
}
