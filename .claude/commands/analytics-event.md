# Analytics Event Integrator

Integrates analytics events into your TNK project with automated updates to dataLayer, measurement plan, and versioning.

## Usage

Run this skill when adding a new tracked interaction or event to your website. It handles:
- dataLayer push code generation
- Measurement plan updates
- Version management
- Automated script execution

## What It Does

1. **Collects event metadata**:
   - Event name (e.g., `blog_post_read`, `contact_form_submit`)
   - Event type (page_view, select_content, generate_lead, orbit_interaction, search, post_engagement)
   - Parameters to track (e.g., post_slug, form_field, query_string)

2. **Generates dataLayer code** for your component:
   ```javascript
   dataLayer.push({
     event: 'blog_post_read',
     post_slug: 'my-post',
     post_category: 'Design'
   });
   ```

3. **Updates measurement_plan.html** with:
   - Event description
   - Parameters list
   - Implementation location
   - Status (Live, Testing, Planned)

4. **Updates measurement CSVs** (`measurement_plan/{event_type}.csv`):
   - Adds new row with event details
   - Maps to correct GA4 event

5. **Suggests version bump** if:
   - New event type added
   - New parameter added to existing event
   - Event renamed or removed
   - Tracking approach changed

6. **Executes automation**:
   ```bash
   node scripts/capture_measurement.mjs
   node scripts/build_standalone_measurement.mjs
   ```

7. **Creates commit** with measurement updates

## Output

After running:
1. ✅ dataLayer code snippet (ready to paste)
2. ✅ Updated `measurement_plan.html` with event entry
3. ✅ Updated CSV in `measurement_plan/{type}.csv`
4. ✅ Version bump (if applicable) with archive of previous version
5. ✅ Generated `measurement_plan/archive/measurement_plan_vN.html`
6. ✅ Rebuilt standalone measurement file

## Event Types

TNK project supports these event categories:

| Type | Description | Use Case |
|------|-------------|----------|
| `page_view` | Page navigation/load | Blog post view, project page load |
| `select_content` | Content interaction | Blog filter, category selection |
| `generate_lead` | Lead generation | Newsletter signup, contact form |
| `orbit_interaction` | Community engagement | Comment, mention, share |
| `search` | Search queries | Site search, filter |
| `post_engagement` | Content engagement | Scroll depth, time on page |

## Before You Start

Have ready:
1. **Event name**: What are you tracking? (e.g., `newsletter_signup`)
2. **Event type**: Pick from list above
3. **Parameters**: What details matter? (e.g., `email_domain`, `form_location`)
4. **Location**: Where does this trigger? (e.g., "Contact.tsx line 45", "Header.tsx")
5. **GA4 mapping**: What GA4 event does this map to?

## Example Workflow

```markdown
**Tracking newsletter signups**

Event name: newsletter_signup
Type: generate_lead
Parameters: 
  - email_domain (extract from email)
  - signup_source (form vs footer)
  - timestamp (auto)
Location: components/NewsletterForm.tsx
GA4 event: generate_lead
```

## Measurement Plan Versioning

When you add events:
- **Minor changes** (fixes, screenshots, docs): No version bump
- **Major changes** (new event, parameter added, event renamed):
  1. Previous version archived: `measurement_plan/archive/measurement_plan_vN.html`
  2. Version incremented: v1 → v2
  3. Changelog added to Version History tab
  4. Standalone file regenerated

Example:
```
Current: measurement_plan_v1.html
Add new event → Skill archives v1 → Updates to v2
```

## Post-Integration Checklist

After running the skill:

- [ ] Review generated dataLayer code
- [ ] Find the correct file/component for code insertion
- [ ] Copy snippet into the handler function
- [ ] Test event fires in Google Tag Manager preview mode
- [ ] Verify measurement_plan.html updated correctly
- [ ] Check version bump was appropriate
- [ ] Commit changes: `/commit`
- [ ] Push to branch: `git push`

## Common Events (TNK Templates)

Ready-to-use event templates for quick setup:

### Blog Post View
```
Name: blog_post_read
Type: page_view
Parameters: post_slug, post_category, read_time
```

### Contact Form Submit
```
Name: contact_form_submit
Type: generate_lead
Parameters: form_field_name, form_location, submission_status
```

### Newsletter Signup
```
Name: newsletter_signup
Type: generate_lead
Parameters: email_domain, signup_source, form_location
```

### Project Filter
```
Name: project_filter
Type: select_content
Parameters: filter_type, filter_value, project_count
```

### Site Search
```
Name: site_search
Type: search
Parameters: search_query, search_results_count, result_clicked
```

## Troubleshooting

- **"Event already exists"** - Modify existing event instead; use `/analytics-event` again and select "Update event"
- **"Parameter conflicts"** - Some parameters are reserved (event, timestamp, user_id); avoid these names
- **"Version bump rejected"** - If you're unsure about versioning, skill prompts confirmation before bumping
- **"Script execution failed"** - Check that `node scripts/capture_measurement.mjs` runs without errors

## Important Notes

- Every frontend change must have measurement coverage (per CLAUDE.md)
- Always run this skill BEFORE committing analytics changes
- Verify dataLayer fires in GTM preview mode
- CSVs are the source of truth for tracking mapping
- Standalone measurement file must always stay in sync with main plan

---

**This skill ensures consistent, documented analytics integration across TNK.** Always use it for new events—never manually edit measurement files without running this skill.
