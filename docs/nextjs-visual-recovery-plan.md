# Rollback vs. Preserve Next.js: Visual Recovery Plan

## Situation recap

- You fixed `sitemap.xml` by moving to a real Next.js route (`app/sitemap.ts`), which resolved the prior 404 behavior for sitemap generation.
- After those changes, the site no longer visually matches the old static version under `legacy/`.

## Recommendation (short answer)

Do **not** do a full rollback of `main`.

Instead, keep the Next.js foundation and recover the old look with a **selective rollback + component parity pass**:

1. Keep Next.js routing/SEO/runtime fixes (including sitemap and robots routes).
2. Recover old visual styles section-by-section from `legacy/*.html` into current `components/*`.
3. Validate each section against screenshots before merging.

A full rollback would likely reintroduce the sitemap issue and undo structural improvements.

## Why this approach is safer

A full rollback is high risk because it mixes two concerns:

- **Platform/runtime correctness** (Next.js routing, server rendering, sitemap route, API routes)
- **Visual parity** (typography, spacing, component styling, hero/layout details)

You only want to undo the second concern.

## Practical recovery workflow

### 1) Branch from current working state

```bash
git checkout -b fix/visual-parity
```

### 2) Generate side-by-side references

- Capture screenshots of the old static pages from `legacy/`.
- Capture screenshots of current Next.js pages (`/`, `/projects`, `/blog`, `/contact`).
- Compare spacing, colors, typography, and component hierarchy.

### 3) Port visuals in strict order

1. Global styles (`app/globals.css`)
2. Navbar/Footer (`components/layout/*`)
3. Home sections (`components/home/*`)
4. Projects/Blog cards and list layouts
5. Mobile breakpoints and interactions

This ordering minimizes cascading regressions.

### 4) Use selective restore when needed

If a specific area got worse, restore only related files from a known good commit:

```bash
git restore --source <good-commit-sha> -- app/globals.css components/layout/Navbar.tsx
```

Then re-apply sitemap/runtime fixes if those files overlap.

### 5) Verification gates before merge

- `npm run build` passes.
- `/sitemap.xml` loads.
- `/robots.txt` loads.
- Home/projects/blog/contact visually match reference screenshots.
- Mobile menu and theme toggle still function.

## Decision rule: when to rollback fully

Only do a full rollback if **all** are true:

1. You cannot isolate visual regressions with file-level restore.
2. The broken branch has widespread architectural issues beyond styling.
3. You have a clean plan to re-apply sitemap/runtime fixes immediately after rollback.

If any of the above is false, selective rollback is better.

## 48-hour action plan

- Day 1: lock visual references + fix global styles and navbar/footer.
- Day 2: fix page sections and mobile parity, then run build and do final QA.

## Suggested release strategy

- Ship in two PRs:
  1. **PR A**: runtime/SEO correctness (sitemap, robots, metadata)
  2. **PR B**: visual parity fixes only

This makes regression debugging much easier and reduces risk in production.

## Publishing note (important)

This repository guide is local only until you push the branch to GitHub and open a PR there.

Typical flow:

```bash
git push -u origin <branch-name>
# then open: https://github.com/<owner>/<repo>/compare/<base>...<branch-name>
```

If your base branch is `main`, use `main...<branch-name>` in the compare URL.
