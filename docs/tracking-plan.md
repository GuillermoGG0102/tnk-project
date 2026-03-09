# TNK Design & Analytics — Tracking Plan

> **Version:** 1.0
> **Last updated:** 2024-03
> **Author:** Guillermo García
> **GTM Container:** GTM-XXXXXXX
> **GA4 Property:** G-XXXXXXXXXX

---

## 1. Overview

This document defines the complete analytics implementation for `tnk.design`. It covers:
- Event naming conventions
- DataLayer schema
- Conversion hierarchy
- Custom dimension / metric registration
- Testing & QA process

---

## 2. Event Naming Convention

```
{object}_{action}

Examples:
✅ cta_click
✅ blog_subscribe
✅ contact_submit
✅ project_view
✅ scroll_depth
✅ theme_toggle

❌ clickedButton      (camelCase)
❌ Button Click       (spaces)
❌ CTAButtonClickHero (too specific — use parameters)
```

**Rules:**
- Lowercase, underscores only
- Object first, action second
- Be generic — use parameters for specifics
- Max 40 characters

---

## 3. Event Schema

### 3.1 Core Events (all pages)

| Event Name | Trigger | Parameters |
|---|---|---|
| `page_view` | All pages | `page_path`, `page_title`, `page_referrer` |
| `scroll_depth` | 25/50/75/100% scroll | `scroll_percentage` |
| `theme_toggle` | Dark/Light mode switch | `selected_theme` |
| `nav_click` | Navigation link click | `nav_label`, `nav_url` |
| `social_click` | Social media link click | `social_platform`, `social_url` |

### 3.2 Engagement Events

| Event Name | Trigger | Parameters |
|---|---|---|
| `cta_click` | CTA button click | `cta_label`, `cta_location` |
| `filter_change` | Category filter selected | `filter_type`, `filter_value` |
| `search_query` | Search form submitted | `search_term`, `results_count` |

### 3.3 Conversion Events

| Event Name | Trigger | Priority | Parameters |
|---|---|---|---|
| `blog_subscribe` | Newsletter form submitted | P1 | `subscription_source` |
| `contact_submit` | Contact form submitted | P1 | `form_id` |
| `project_view` | Project page opened | P2 | `project_slug`, `project_category` |
| `blog_post_view` | Blog post opened | P3 | `post_slug`, `post_category`, `reading_time` |

---

## 4. DataLayer Schema

### Standard Push Structure

```javascript
window.dataLayer = window.dataLayer || []

// All events follow this schema:
window.dataLayer.push({
  event:      'event_name',          // required — matches event table above
  timestamp:  '2024-03-01T10:00:00Z', // ISO 8601
  page_path:  '/blog/getting-started-with-ga4', // current page
  page_title: 'Getting Started with GA4 | TNK',  // document title
  // ... event-specific parameters
})
```

### Example: CTA Click

```javascript
window.dataLayer.push({
  event:        'cta_click',
  cta_label:    'View Projects',
  cta_location: 'hero',
  timestamp:    new Date().toISOString(),
  page_path:    window.location.pathname,
  page_title:   document.title,
})
```

### Example: Blog Subscribe

```javascript
window.dataLayer.push({
  event:               'blog_subscribe',
  subscription_source: 'blog-post-getting-started-with-ga4',
  timestamp:           new Date().toISOString(),
  page_path:           window.location.pathname,
  page_title:          document.title,
})
```

---

## 5. GA4 Custom Dimensions & Metrics

Register these in **GA4 Admin → Custom Definitions** before using in reports.

### Custom Dimensions (Event-scoped)

| Parameter Name | Display Name | Scope | Description |
|---|---|---|---|
| `cta_label` | CTA Label | Event | Text of the CTA that was clicked |
| `cta_location` | CTA Location | Event | Section/component where CTA appears |
| `post_category` | Post Category | Event | Blog post category |
| `post_slug` | Post Slug | Event | Blog post URL slug |
| `project_category` | Project Category | Event | Project type |
| `project_slug` | Project Slug | Event | Project URL slug |
| `subscription_source` | Subscription Source | Event | Where the newsletter subscription originated |
| `scroll_percentage` | Scroll Depth % | Event | Scroll depth checkpoint (25/50/75/100) |
| `selected_theme` | Selected Theme | Event | dark or light |

### Custom Dimensions (User-scoped)

| Parameter Name | Display Name | Description |
|---|---|---|
| `user_theme` | Preferred Theme | User's theme preference |

### Custom Metrics

| Parameter Name | Display Name | Unit |
|---|---|---|
| `reading_time_minutes` | Reading Time | Standard |

---

## 6. Conversions

Configure these events as conversions in **GA4 Admin → Conversions**:

| Event | Conversion Name | Value Assignment |
|---|---|---|
| `blog_subscribe` | Newsletter Subscribe | $0 (engagement) |
| `contact_submit` | Contact Form Submit | $0 (lead) |

---

## 7. GTM Container Structure

```
Tags/
├── GA4 Config (all pages)
├── Events/
│   ├── CTA Click
│   ├── Blog Subscribe
│   ├── Contact Submit
│   ├── Project View
│   ├── Blog Post View
│   ├── Scroll Depth
│   ├── Theme Toggle
│   ├── Nav Click
│   ├── Social Click
│   ├── Filter Change
│   └── Search Query
└── Utilities/
    └── DataLayer Initialiser

Triggers/
├── All Pages
├── DataLayer Events/
│   ├── cta_click
│   ├── blog_subscribe
│   ├── contact_submit
│   ├── project_view
│   ├── blog_post_view
│   ├── scroll_depth
│   ├── theme_toggle
│   ├── nav_click
│   ├── social_click
│   ├── filter_change
│   └── search_query

Variables/
├── GA4 Measurement ID (constant)
├── DL - event (dataLayer variable)
├── DL - cta_label
├── DL - cta_location
├── DL - post_slug
├── DL - post_category
├── DL - project_slug
├── DL - project_category
├── DL - subscription_source
├── DL - scroll_percentage
├── DL - selected_theme
├── DL - nav_label
├── DL - social_platform
├── DL - filter_type
├── DL - filter_value
├── DL - search_term
└── DL - results_count
```

---

## 8. Testing & QA Checklist

### Before Publishing

- [ ] GTM Preview Mode shows correct triggers firing
- [ ] GA4 DebugView shows events with correct parameters
- [ ] No PII (email, name, phone) in any event parameter
- [ ] All parameters match registered custom dimensions
- [ ] Conversions marked in GA4 Admin

### After Publishing

- [ ] Real-time report shows `page_view` firing
- [ ] Test each CTA and confirm `cta_click` in DebugView
- [ ] Submit newsletter form and confirm `blog_subscribe`
- [ ] Submit contact form and confirm `contact_submit`
- [ ] Scroll to 90% and confirm `scroll_depth` with `scroll_percentage: 75` and `100`
- [ ] Toggle theme and confirm `theme_toggle`
- [ ] 48-hour data sanity check: sessions, bounce rate, top pages

---

## 9. Data Governance

- **No PII collection**: Do not include names, emails, phone numbers, or addresses in event parameters.
- **Data retention**: Set to 14 months in GA4 Admin.
- **BigQuery export**: Enable daily export for long-term analysis.
- **Consent Mode**: Implement Google Consent Mode v2 before activating personalised ads.

---

## 10. Changelog

| Date | Version | Change |
|---|---|---|
| 2024-03 | 1.0 | Initial tracking plan |
