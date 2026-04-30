# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.
- To check: `lsof -i :3000 | grep LISTEN` — if output is returned, server is already running.

## Read Discipline
- Before reading any file >30KB in full, use `Grep` to locate the specific section first, then read with `limit`/`offset`.
- For searches spanning multiple unknown files, use the Explore subagent — large reads stay out of the main context.

## Sub-Agents Optimized by Model
- **Haiku 4.5** (fast, cheap): Code search, file navigation, reading, grep queries, quick lookups, task validation
- **Sonnet 4.6** (balanced): Writing code, documentation, normal implementations, refactoring, test creation
- **Opus 4.7** (powerful): Architecture reviews, critical decisions, complex refactors, security/performance analysis, system design
- **Rule:** Never spawn Opus for simple tasks or Haiku for writing. Match subagent model to task complexity.

## Screenshot Workflow
- **Always screenshot from localhost:** `node scripts/screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node scripts/screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in `scripts/`. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>` — use an inline `tailwind.config = { theme: { extend: { colors: {...} } } }` block for custom brand colors. Never rely on the default palette.
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Blog Article Creation Checklist
**CRITICAL: Follow this exact process to avoid mismatched articles.**

### Step 1: Create Article File (`/blog/article-slug.html`)
Use `getting-started-with-ga4.html` as the exact template. **Copy its entire structure**, then update:
- `<title>` tag — your article title + "| TNK – Design & Analytics"
- `<meta name="description">` — 155 chars, include SEO keywords
- `window.TNK_PAGE.name` — your article title
- Head tags: `<script>` for GTM, `<meta>` tags
- Navbar links (all point up one level with `../`)
- Back button href: `../blog.html`
- Header section: tags (use `tag-primary` or `tag-accent`), read time, date
- H1 title + description paragraph
- Cover image: `<img src="https://placehold.co/1200x600/0F1629/00CFFF?text=Your+Text">`
- Author card: name, title, LinkedIn link
- Article body: wrap in `<div class="prose">` — **this class handles all styling**
  - Use h2 for major sections, h3 for subsections
  - Use `<p>`, `<ul>`, `<li>`, `<strong>`, `<em>`, `<code>`, `<pre>`, `<blockquote>`, `<hr />`
  - All styling is inherited from `.prose` CSS — do NOT add inline styles to content

### Step 2: Add Card to `/blog.html`
Find `#posts-grid` div. Before the "Coming soon cards" comment, add:
```html
<article class="card post-card" onclick="tnkNavigate('blog/SLUG.html',{content_type:'blog_card',content_id:'SLUG',content_name:'Article Title',item_list_name:'blog_listing'})" data-category="CATEGORY" style="overflow:hidden;display:flex;flex-direction:column;">
  <div style="position:relative;aspect-ratio:16/9;overflow:hidden;flex-shrink:0;background:#0d1528;display:flex;align-items:center;justify-content:center;padding:20px;">
    <!-- Visual preview: code snippet, diagram, or image -->
  </div>
  <div style="padding:22px 22px;flex:1;display:flex;flex-direction:column;">
    <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
      <span class="tag-primary">Category</span>
      <span class="tag-neutral" style="font-size:10px;">Tag</span>
      <span style="font-size:11px;color:#4D5E87;">X min read</span>
    </div>
    <h3 style="font-size:17px;font-weight:700;color:#F0F4FF;line-height:1.35;margin:0 0 10px 0;">Article Title</h3>
    <p style="font-size:13px;color:#8A9CC8;line-height:1.6;flex:1;margin:0 0 16px 0;">Description/excerpt</p>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
      <time style="font-size:12px;color:#4D5E87;">Published date</time>
      <span style="font-size:12px;color:#4D5E87;">Read →</span>
    </div>
  </div>
</article>
```

### Step 3: Theme & Colors (DO NOT CHANGE)
- **Background:** #0A0F1E (dark navy)
- **Text:** #F0F4FF (light)
- **Secondary text:** #8A9CC8 (muted blue)
- **Primary accent:** #00CFFF (cyan)
- **Secondary accent:** #00FFB3 (green)
- **Code background:** #162038 (slightly lighter navy)
- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (code)

### Step 4: Commit & Push
```bash
git add blog/SLUG.html blog.html
git commit -m "Add blog article: [Title]"
git push origin main
```

**REMEMBER:** The `.prose` class handles all article content styling. Do NOT add inline styles to h2, h3, p, ul, code, etc. within the prose div.

## Brand Assets
- Always check the `assets/brand/` folder before designing. It contains the logo, color guide, and style guide.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.
- Other assets: `assets/logos/` (company logos), `assets/profile/` (portrait photos), `assets/images/` (project images).

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Measurement-First Rule
- **Every time any change is made to the website** (new page, new section, new interaction, new form, new button, content update), you MUST:
  1. Ask the user how the change should be measured (or propose a measurement approach)
  2. Implement the appropriate `dataLayer` push(es) in the affected HTML/JS files
  3. Update `measurement_plan/measurement_plan.html` and the relevant CSV in `measurement_plan/` to reflect the new event or parameter (CSV map: page_view→tab3, select_content→tab4, generate_lead→tab5, orbit_interaction→tab6, search→tab7, post_engagement→tab8)
  4. Re-run `node scripts/capture_measurement.mjs` if screenshots are affected
  5. **Always regenerate the standalone file** by running `node scripts/build_standalone_measurement.mjs` — this is the canonical shareable reference (fully self-contained with embedded screenshots); must stay in sync with `measurement_plan.html`, no exceptions.
- Do NOT ship any frontend change without confirming the analytics coverage first.

## Measurement Plan Versioning
- The measurement plan uses semantic versioning: **v1, v2, v3…**
- **Before any significant update** to `measurement_plan/measurement_plan.html`:
  1. Copy the current file to `measurement_plan/archive/measurement_plan_vN.html` (where N is the current version number)
  2. Increment the version badge in the header of `measurement_plan.html`
  3. Add a changelog entry to the **Version History** tab inside `measurement_plan.html` (date, version, summary of changes)
- Minor fixes (typos, broken links, screenshot refreshes) do NOT require a version bump
- Major changes that require a bump: new event added, existing event removed or renamed, new parameter added/removed, tracking approach changed

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
