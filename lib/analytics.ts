import type { GTMEvent, TrackingEventName } from '@/types'

/**
 * Push an event to the GTM dataLayer.
 * Safe to call server-side (no-ops) and before GTM loads (queues events).
 */
export function pushEvent(eventName: TrackingEventName, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer ?? []

  const event: GTMEvent = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_title: document.title,
    ...payload,
  }

  window.dataLayer.push(event)

  if (process.env.NODE_ENV === 'development') {
    console.group(`[Analytics] ${eventName}`)
    console.table(event)
    console.groupEnd()
  }
}

// ─── Typed event helpers ───────────────────────────────────────────

export const analytics = {
  ctaClick: (ctaLabel: string, ctaLocation: string) =>
    pushEvent('cta_click', { cta_label: ctaLabel, cta_location: ctaLocation }),

  blogSubscribe: (source: string) =>
    pushEvent('blog_subscribe', { subscription_source: source }),

  contactSubmit: (formId: string) =>
    pushEvent('contact_submit', { form_id: formId }),

  projectView: (projectSlug: string, projectCategory: string) =>
    pushEvent('project_view', { project_slug: projectSlug, project_category: projectCategory }),

  blogPostView: (postSlug: string, postCategory: string, readingTime: string) =>
    pushEvent('blog_post_view', {
      post_slug: postSlug,
      post_category: postCategory,
      reading_time: readingTime,
    }),

  scrollDepth: (depth: 25 | 50 | 75 | 100) =>
    pushEvent('scroll_depth', { scroll_percentage: depth }),

  themeToggle: (theme: 'dark' | 'light') =>
    pushEvent('theme_toggle', { selected_theme: theme }),

  navClick: (label: string, url: string) =>
    pushEvent('nav_click', { nav_label: label, nav_url: url }),

  socialClick: (platform: string, url: string) =>
    pushEvent('social_click', { social_platform: platform, social_url: url }),

  filterChange: (filterType: string, filterValue: string) =>
    pushEvent('filter_change', { filter_type: filterType, filter_value: filterValue }),

  searchQuery: (query: string, resultsCount: number) =>
    pushEvent('search_query', { search_term: query, results_count: resultsCount }),

  blogLike: (postSlug: string, action: 'like' | 'unlike') =>
    pushEvent('blog_like', { post_slug: postSlug, like_action: action }),

  blogComment: (postSlug: string, commentLength: number) =>
    pushEvent('blog_comment', { post_slug: postSlug, comment_length: commentLength }),
}

// ─── DataLayer type augmentation ──────────────────────────────────
declare global {
  interface Window {
    dataLayer: GTMEvent[]
  }
}
