# Commit with Measurement

Automated git workflow that captures measurements, screenshots, and commits changes with proper messaging and analytics coverage.

## Usage

Run this skill when you're ready to commit and push your changes. It intelligently handles:
- Frontend changes (with screenshots + measurement)
- Content changes (blog, projects)
- Configuration changes
- Analytics integrations

## What It Does

1. **Analyzes changed files** to detect what you modified
2. **For frontend changes**:
   - Runs `/screenshot` skill (captures current state)
   - Runs `/measurement` skill (validates analytics coverage)
   - Waits for your approval
3. **For analytics changes**:
   - Verifies `analytics-event` skill was run
   - Checks measurement_plan.html was updated
   - Validates dataLayer code exists
4. **Prepares commit message** with:
   - Type: feat, fix, refactor, docs, style, analytics
   - Scope: component/feature name
   - Description: what changed and why
   - Reference screenshots and measurements
5. **Requests approval** before committing
6. **Executes**:
   ```bash
   git add .
   git commit -m "..."
   git push -u origin <current-branch>
   ```
7. **Provides feedback**:
   - Git status after push
   - Link to PR if created
   - Any warnings about uncommitted files

## Output

```
✅ Changes detected:
  - components/Header.tsx (modified)
  - measurement_plan.html (modified)
  - assets/images/header.png (added)

📸 Screenshot captured: temporary screenshots/screenshot-N.png
📊 Measurement validated: analytics_event.csv updated
✓ Measurement plan version: v2.0
✓ Standalone file regenerated

📝 Commit message prepared:
  feat(header): Add animated navigation with analytics tracking
  
  - Added Framer Motion transitions
  - Integrated nav_interaction event tracking
  - Updated measurement plan v2.0
  
  Screenshots: screenshot-47.png
  Measurement: nav_interaction (select_content)

🔍 Review & Approve (y/n)?
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat` - New feature (new component, new page)
- `fix` - Bug fix
- `refactor` - Code reorganization (no feature change)
- `docs` - Documentation (README, comments)
- `style` - CSS/styling changes
- `analytics` - Measurement/tracking changes
- `content` - Blog posts, project pages
- `chore` - Dependencies, config

### Scope
- Component or feature name (Header, BlogPost, measurement)
- Feature area (analytics, homepage, blog)

### Subject
- Imperative mood: "Add" not "Added" or "Adds"
- 50 characters or less
- No period at end
- What changed, not how

### Body
- Bullet points of what changed
- Screenshots reference: `Screenshots: screenshot-N.png`
- Measurement reference: `Measurement: event_name (event_type)`

### Example
```
feat(blog): Add reading time estimate with analytics

- Calculate reading time from word count
- Display in post header
- Track as post_engagement event
- Updated measurement plan v2.1

Screenshots: screenshot-52.png
Measurement: post_read_engagement (post_engagement)
```

## Before Running

Make sure:
- [ ] Your changes are complete and tested locally
- [ ] Screenshots match your design (if frontend change)
- [ ] Analytics is integrated (if analytics change)
- [ ] You're on the correct branch (e.g., `claude/locate-skills-directory-QVRMn`)

## Workflow Examples

### Example 1: Frontend Component
```
You run: /commit

Skill detects: components/Card.tsx modified
Skill runs: /screenshot
Skill runs: /measurement
Skill prepares commit message
You approve
Git commits and pushes
```

### Example 2: Blog Post
```
You run: /commit

Skill detects: content/blog/my-post.mdx added
Skill skips screenshot (not frontend UI change)
Skill skips measurement (content, not analytics)
Skill prepares commit message
You approve
Git commits and pushes
```

### Example 3: Analytics Integration
```
You run: /commit

Skill detects: 
  - .tsx file modified (with dataLayer.push)
  - measurement_plan.html modified
  - analytics-event.csv modified
Skill runs: /screenshot (if UI changed)
Skill verifies: measurement updates match dataLayer code
Skill prepares commit with event reference
You approve
Git commits and pushes
```

## Intelligent Detection

The skill automatically identifies:

| Change Type | Actions |
|------------|---------|
| `.tsx`, `.jsx`, `.css` modified | Screenshot + Measurement validation |
| `.mdx` file in `/content/` | Skip screenshot, format content |
| `measurement_plan.html` modified | Verify dataLayer code exists |
| `analytics-event.csv` modified | Validate event name and parameters |
| `package.json` modified | Flag dependency change for review |
| `.env.example` modified | Prompt for env var documentation |
| Multiple file types | Composite message (frontend + content) |

## Safety Checks

The skill prevents:
- ❌ Committing without measurement (frontend changes require it per CLAUDE.md)
- ❌ Orphaned dataLayer code (analytics code without measurement_plan entry)
- ❌ Measurement plan versions mismatched (standalone file out of sync)
- ❌ Pushing to wrong branch (prompts confirmation if not on feature branch)

## Post-Commit

After successful push:
```
✅ Committed to: claude/locate-skills-directory-QVRMn
✅ Pushed: origin/claude/locate-skills-directory-QVRMn

PR Status: Not yet created (use gh pr create if ready)
Next steps:
  1. Wait for CI checks to pass
  2. Request review: gh pr create
  3. Address review comments
  4. Merge when approved
```

## Troubleshooting

- **"Changes not staged"** - Use `git status` to see uncommitted files, stage them, try again
- **"Wrong branch"** - Skill detects and prompts before pushing to main/master
- **"Measurement missing"** - For frontend changes, run `/analytics-event` skill first
- **"Push rejected"** - Check if origin branch exists; skill handles `git push -u origin`
- **"Screenshot conflicts"** - Automatically names screenshots, no overwrites

## Integration with Other Skills

This skill orchestrates others:
```
/commit
  ├─ calls /screenshot (if frontend change)
  ├─ calls /measurement (if analytics involved)
  ├─ validates output from /analytics-event (if events added)
  └─ creates git commit + push
```

---

**Meta skill that automates your entire change workflow.** Saves time on repetitive git + measurement steps. Always use for consistency.

**Branch**: Always check you're on your feature branch (e.g., `claude/locate-skills-directory-QVRMn`) before running.
