# Blog Post Generator

Generates a new blog post with correct MDX structure and frontmatter.

## Usage

Run this skill when you want to create a new blog post. The skill will:
1. Ask for post metadata (title, excerpt, category, tags)
2. Generate a slug automatically from the title
3. Create `content/blog/{slug}.mdx` with proper frontmatter
4. Prepare the post for editing with a template structure

## What You'll Be Asked

- **Title** - The post title (e.g., "My Amazing Journey")
- **Excerpt** - A short summary (e.g., "A reflection on design and analytics")
- **Category** - Post category (e.g., "Design", "Analytics", "Tutorial")
- **Tags** - Comma-separated tags (e.g., "design, ux, process")

## Output

A new file at: `/home/user/tnk-project/content/blog/{auto-generated-slug}.mdx`

With this structure:
```markdown
---
title: "Your Title Here"
excerpt: "Your excerpt here"
date: "YYYY-MM-DD" (today's date)
category: "Your Category"
tags: ["tag1", "tag2"]
coverImage: "/images/placeholder.jpg"
published: true
---

## Introduction

[Add your introduction here...]

## Main Content

[Add main content sections...]

## Conclusion

[Add conclusion here...]
```

## Post-Generation

After the file is created:
1. Open it for immediate editing
2. Replace placeholder `coverImage` with your actual image path
3. Write your content in the prepared sections
4. Set `published: false` if it's a draft
5. Commit when ready: `/commit`

## Requirements

- Blog post title (required)
- Excerpt (required)
- Valid category (optional, defaults to "Uncategorized")
- Tags format: comma-separated, no special characters (optional)

## Troubleshooting

- **Slug collision**: If a post with that slug exists, the tool will alert you to choose a different title
- **Invalid characters**: Titles with special characters will be auto-converted to kebab-case (e.g., "C++ & Design" → "cpp-and-design")
- **Date**: Always uses today's date. Edit the YAML frontmatter if you need a different date

---

**Next Steps**: After creation, you can reference this same skill to quickly generate future posts. Edit the metadata in the file's frontmatter to customize further.
