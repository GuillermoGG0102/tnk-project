# Lighthouse Validator

Runs Lighthouse performance audits and validates against TNK project thresholds before deployment.

## Usage

Run this skill before pushing to production or when you want to validate frontend performance metrics.

## What It Does

1. **Checks server status** - Verifies localhost:3000 is running, starts it if needed
2. **Runs Lighthouse audit** - Audits the homepage at `http://localhost:3000`
3. **Validates thresholds** - Checks metrics against project requirements:
   - **Performance** ≥ 90
   - **SEO** = 100
   - **Accessibility** ≥ 95
   - **Cumulative Layout Shift (CLS)** < 0.1
   - **Largest Contentful Paint (LCP)** < 2.5s
4. **Generates report** - Creates an HTML report with:
   - ✅ Passed metrics (with scores)
   - ⚠️ Failed metrics (with improvement suggestions)
   - 🔴 Blockers that prevent deployment
5. **Provides recommendations** - Specific fixes for failures

## Output

A Lighthouse report saved to: `/home/user/tnk-project/lighthouse-report-{timestamp}.html`

Console output shows:
```
🔍 Lighthouse Audit Results
─────────────────────────────

✅ Performance:        95/100 ✓
✅ SEO:               100/100 ✓
✅ Accessibility:      97/100 ✓
⚠️  CLS:              0.15 (threshold: <0.1)
✅ LCP:               2.1s (threshold: <2.5s)

Status: ⚠️  REVIEW REQUIRED
Blockers: 1
```

## When to Use

- **Before deployment** - Ensure no regressions in performance
- **After major CSS changes** - Validate layout stability (CLS)
- **After image optimization** - Check LCP improvements
- **Post-content addition** - Confirm SEO metrics remain at 100
- **Weekly review** - Track performance trends

## Requirements

- Node.js with npm packages installed
- Local dev server accessible (`node serve.mjs`)
- Lighthouse CLI (will be auto-installed if missing)

## Examples

```bash
# Run full audit
/lighthouse-check

# The skill will:
# 1. ✓ Start server if not running
# 2. ✓ Run Lighthouse on http://localhost:3000
# 3. ✓ Validate against TNK thresholds
# 4. ✓ Generate report with suggestions
# 5. ✓ Flag blockers if any
```

## Pre-Deployment Checklist

Use this skill as part of your pre-deployment flow:

- [ ] Run `/lighthouse-check`
- [ ] Review the generated report
- [ ] Fix any 🔴 Blockers before pushing
- [ ] Address ⚠️ Warnings if possible
- [ ] Commit fixes: `/commit`
- [ ] Push to branch: `git push`

## Troubleshooting

- **"Server not running"** - Skill will auto-start `node serve.mjs` in background
- **"Lighthouse timeout"** - Increase timeout or check localhost:3000 manually
- **"Port 3000 already in use"** - Stop existing server: `lsof -i :3000 | grep node | awk '{print $2}' | xargs kill`

## Project Thresholds

These are the TNK project standards (non-negotiable pre-deployment):

| Metric | Threshold | Type |
|--------|-----------|------|
| Performance | ≥ 90 | Score |
| SEO | = 100 | Score |
| Accessibility | ≥ 95 | Score |
| CLS | < 0.1 | Duration |
| LCP | < 2.5s | Duration |

If any metric fails, the skill flags it as a blocker. Fix before deployment.

---

**Part of the TNK quality gates system.** Always run before `git push` to production.
