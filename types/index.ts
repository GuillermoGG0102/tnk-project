// ─── Blog ─────────────────────────────────────────────────────────
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: BlogCategory
  tags: string[]
  readingTime: string
  coverImage?: string
  author: Author
  published: boolean
}

export type BlogCategory =
  | 'design'
  | 'analytics'
  | 'league-of-legends'
  | 'padel'

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; color: string }> = {
  'design':            { label: 'Design',            color: '#00CFFF' },
  'analytics':         { label: 'Analytics',         color: '#00FFB3' },
  'league-of-legends': { label: 'League of Legends', color: '#C89B3C' },
  'padel':             { label: 'Padel',             color: '#FF6B6B' },
}

// ─── Projects ─────────────────────────────────────────────────────
export interface Project {
  slug: string
  title: string
  shortDescription: string
  description: string
  category: ProjectCategory
  tags: string[]
  tools: string[]
  coverImage?: string
  results?: string[]
  impact?: string
  year: string
  link?: string
  featured: boolean
}

export type ProjectCategory = 'design' | 'analytics' | 'experimentation'

export const PROJECT_CATEGORIES: Record<ProjectCategory, { label: string; color: string }> = {
  'design':          { label: 'Design',          color: '#00CFFF' },
  'analytics':       { label: 'Analytics',       color: '#00FFB3' },
  'experimentation': { label: 'Experimentation', color: '#B77FFF' },
}

// ─── Experience ───────────────────────────────────────────────────
export interface ExperienceItem {
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string[]
  tags: string[]
  logo?: string
}

// ─── Author ───────────────────────────────────────────────────────
export interface Author {
  name: string
  bio: string
  avatar?: string
  linkedin?: string
  instagram?: string
}

// ─── Newsletter ───────────────────────────────────────────────────
export interface SubscribePayload {
  email: string
  source?: string
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ─── Analytics / DataLayer ────────────────────────────────────────
export interface GTMEvent {
  event: string
  [key: string]: unknown
}

export type TrackingEventName =
  | 'cta_click'
  | 'blog_subscribe'
  | 'contact_submit'
  | 'project_view'
  | 'blog_post_view'
  | 'scroll_depth'
  | 'theme_toggle'
  | 'nav_click'
  | 'social_click'
  | 'filter_change'
  | 'search_query'
