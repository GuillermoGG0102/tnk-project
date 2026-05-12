import XLSX from 'xlsx';

// Crear un nuevo workbook
const wb = XLSX.utils.book_new();

// ==================== SHEET 1: OVERVIEW ====================
const overviewData = [
  ['TNK Designs - Analytics Labeling Guide', '', '', ''],
  ['', '', '', ''],
  ['Event Overview', '', '', ''],
  ['#', 'Event Name', 'GA4 Event Code', 'Description'],
  ['01', 'Page View', 'page_view', 'Fired on every page load with page metadata'],
  ['02', 'Select Content', 'select_content', 'Fired when user clicks on content items (links, cards, buttons)'],
  ['03', 'Generate Lead', 'generate_lead', 'Fired when user submits a contact form'],
  ['04', 'Orbit Interaction', 'orbit_interaction', 'Fired when user interacts with Orbit widget'],
  ['05', 'Search', 'search', 'Fired when user performs a search'],
  ['06', 'Post Engagement', 'post_engagement', 'Fired when user likes/comments on blog posts'],
];

const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
overviewSheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 40 }];
XLSX.utils.book_append_sheet(wb, overviewSheet, 'Overview');

// ==================== SHEET 2: PAGE VIEW ====================
const pageViewData = [
  ['PAGE VIEW Event', '', '', ''],
  ['', '', '', ''],
  ['Event Code', 'page_view'],
  ['Event Type', 'Standard GA4 event'],
  ['Trigger', 'Every page load'],
  ['', '', '', ''],
  ['Custom Dimensions (Page Metadata)', '', '', ''],
  ['Parameter', 'Display Name', 'Type', 'Example Value'],
  ['page_name', 'Page Name', 'String', 'TNK Portfolio - Design Principles for Data Products'],
  ['page_category', 'Page Category', 'String', 'Blog, Portfolio, Home, Contact'],
  ['page_type', 'Page Type', 'String', 'Article, Project, Landing'],
  ['content_group', 'Content Group', 'String', 'Editorial, Case Study, Service'],
  ['page_author', 'Page Author', 'String', 'Guillermo García'],
  ['', '', '', ''],
  ['dataLayer Push Example', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "page_view",', '', ''],
  ['', '  page_name: "TNK Portfolio - Design Principles",', '', ''],
  ['', '  page_category: "Blog",', '', ''],
  ['', '  page_type: "Article",', '', ''],
  ['', '  content_group: "Editorial",', '', ''],
  ['', '  page_author: "Guillermo García"', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['Implementation Notes', '', '', ''],
  ['', 'Push this event on window load (GTM fires automatically on page load)'],
  ['', 'Use consistent page_name values across all pages'],
  ['', 'page_category must be one of: Blog, Portfolio, Home, Contact, etc.'],
  ['', 'page_type classifies the content structure, not the category'],
];

const pageViewSheet = XLSX.utils.aoa_to_sheet(pageViewData);
pageViewSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, pageViewSheet, 'Page View');

// ==================== SHEET 3: SELECT CONTENT ====================
const selectContentData = [
  ['SELECT CONTENT Event', '', '', ''],
  ['', '', '', ''],
  ['Event Code', 'select_content'],
  ['Event Type', 'Standard GA4 event'],
  ['Trigger', 'When user clicks on content items'],
  ['', '', '', ''],
  ['Parameters Required', '', '', ''],
  ['Parameter', 'Display Name', 'Type', 'Example Value'],
  ['content_type', 'Content Type', 'String', 'blog_card, nav_link, hero_cta, project_card'],
  ['content_id', 'Content ID', 'String', 'beautiful_dashboards, design_principles_data'],
  ['content_name', 'Content Name', 'String', 'Beautiful Dashboards', 'Beautiful Dashboards'],
  ['item_list_name', 'Item List Name', 'String', 'blog_listing, footer_nav, hero_section'],
  ['destination_url', 'Destination URL', 'String', 'https://tnkproject.com/blog/beautiful-dashboards.html'],
  ['', '', '', ''],
  ['dataLayer Push Example', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "select_content",', '', ''],
  ['', '  content_type: "blog_card",', '', ''],
  ['', '  content_id: "beautiful_dashboards",', '', ''],
  ['', '  content_name: "Beautiful Dashboards",', '', ''],
  ['', '  item_list_name: "blog_listing",', '', ''],
  ['', '  destination_url: window.location.href', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['Implementation Notes', '', '', ''],
  ['', 'Use underscores in content_id and item_list_name (no hyphens)'],
  ['', 'content_type must clearly indicate the UI element type'],
  ['', 'item_list_name identifies the container/section where the click happened'],
  ['', 'destination_url should be the target URL or current page URL'],
  ['', 'Push on click event (onClick handler or event listener)'],
];

const selectContentSheet = XLSX.utils.aoa_to_sheet(selectContentData);
selectContentSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, selectContentSheet, 'Select Content');

// ==================== SHEET 4: GENERATE LEAD ====================
const generateLeadData = [
  ['GENERATE LEAD Event', '', '', ''],
  ['', '', '', ''],
  ['Event Code', 'generate_lead'],
  ['Event Type', 'Standard GA4 event + CONVERSION'],
  ['Trigger', 'When user submits contact form'],
  ['', '', '', ''],
  ['Parameters Required', '', '', ''],
  ['Parameter', 'Display Name', 'Type', 'Example Value'],
  ['form_name', 'Form Name', 'String', 'Contact Form', 'Contact Form'],
  ['form_id', 'Form ID', 'String', 'contact_form_main'],
  ['subject', 'Subject', 'String', 'Website Redesign Project'],
  ['budget', 'Budget', 'String', '$10,000 - $25,000', '$10,000 - $25,000'],
  ['message_word_count', 'Message Word Count', 'Integer', '150'],
  ['message_char_count', 'Message Char Count', 'Integer', '847'],
  ['message_filled', 'Message Filled', 'Boolean', 'true, false'],
  ['email_sha256', 'Email SHA-256', 'String', 'a1b2c3d4e5f6... (hashed)'],
  ['', '', '', ''],
  ['dataLayer Push Example', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "generate_lead",', '', ''],
  ['', '  form_name: "Contact Form",', '', ''],
  ['', '  form_id: "contact_form_main",', '', ''],
  ['', '  subject: "Website Redesign",', '', ''],
  ['', '  budget: "$10,000 - $25,000",', '', ''],
  ['', '  message_word_count: 150,', '', ''],
  ['', '  message_char_count: 847,', '', ''],
  ['', '  message_filled: true,', '', ''],
  ['', '  email_sha256: hashEmailSHA256(emailValue)', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['Implementation Notes', '', '', ''],
  ['', 'Fired on form submission (before or after server validation)'],
  ['', 'email_sha256: Hash the email with SHA-256 for privacy compliance'],
  ['', 'message_word_count: Count words in message field'],
  ['', 'message_char_count: Count characters in message field'],
  ['', 'budget: Use predefined ranges or "Not specified"'],
  ['', 'Mark "generate_lead" as a conversion in GA4 Admin'],
];

const generateLeadSheet = XLSX.utils.aoa_to_sheet(generateLeadData);
generateLeadSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, generateLeadSheet, 'Generate Lead');

// ==================== SHEET 5: ORBIT INTERACTION ====================
const orbitData = [
  ['ORBIT INTERACTION Event', '', '', ''],
  ['', '', '', ''],
  ['Event Code', 'orbit_interaction'],
  ['Event Type', 'Standard GA4 event'],
  ['Trigger', 'When user interacts with Orbit widget'],
  ['', '', '', ''],
  ['Parameters Required', '', '', ''],
  ['Parameter', 'Display Name', 'Type', 'Example Value'],
  ['orbit_pause', 'Orbit Pause', 'Boolean', 'true, false'],
  ['skill_hover', 'Skill Hover', 'String', 'design_thinking, data_analysis'],
  ['', '', '', ''],
  ['dataLayer Push Example', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "orbit_interaction",', '', ''],
  ['', '  orbit_pause: true,', '', ''],
  ['', '  skill_hover: "design_thinking"', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['Implementation Notes', '', '', ''],
  ['', 'orbit_pause: true when user pauses the animation, false when resumed'],
  ['', 'skill_hover: skill name when user hovers over an orbit skill item'],
  ['', 'Can push both parameters in same event or separately'],
  ['', 'Use consistent skill names across the widget'],
];

const orbitSheet = XLSX.utils.aoa_to_sheet(orbitData);
orbitSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, orbitSheet, 'Orbit Interaction');

// ==================== SHEET 6: SEARCH ====================
const searchData = [
  ['SEARCH Event', '', '', ''],
  ['', '', '', ''],
  ['Event Code', 'search'],
  ['Event Type', 'Standard GA4 event'],
  ['Trigger', 'When user performs a search'],
  ['', '', '', ''],
  ['Parameters Required', '', '', ''],
  ['Parameter', 'Display Name', 'Type', 'Example Value'],
  ['search_term', 'Search Term', 'String', 'Claude Tips'],
  ['search_results_count', 'Search Results Count', 'Integer', '12'],
  ['search_has_results', 'Search Has Results', 'Boolean', 'true, false'],
  ['search_term_length', 'Search Term Length', 'Integer', '12'],
  ['search_section', 'Search Section', 'String', 'blog, portfolio, all'],
  ['search_active_filter', 'Search Active Filter', 'String', 'tag:claude, category:guide'],
  ['', '', '', ''],
  ['dataLayer Push Example', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "search",', '', ''],
  ['', '  search_term: "Claude Tips",', '', ''],
  ['', '  search_results_count: 12,', '', ''],
  ['', '  search_has_results: true,', '', ''],
  ['', '  search_term_length: 12,', '', ''],
  ['', '  search_section: "blog",', '', ''],
  ['', '  search_active_filter: "tag:claude"', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['Implementation Notes', '', '', ''],
  ['', 'search_term: The exact text entered by the user'],
  ['', 'search_results_count: Number of results returned'],
  ['', 'search_has_results: true if count > 0, false if no results'],
  ['', 'search_term_length: Character count of search_term'],
  ['', 'search_section: Which part of site was searched (blog, portfolio, all)'],
  ['', 'search_active_filter: Any active filters applied to results'],
  ['', 'Fire after search results are rendered/displayed'],
];

const searchSheet = XLSX.utils.aoa_to_sheet(searchData);
searchSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, searchSheet, 'Search');

// ==================== SHEET 7: POST ENGAGEMENT ====================
const postEngagementData = [
  ['POST ENGAGEMENT Event', '', '', ''],
  ['', '', '', ''],
  ['Event Code', 'post_engagement'],
  ['Event Type', 'Standard GA4 event'],
  ['Trigger', 'When user likes/unlikes or comments on blog post'],
  ['', '', '', ''],
  ['Parameters Required', '', '', ''],
  ['Parameter', 'Display Name', 'Type', 'Example Value'],
  ['content_id', 'Content ID', 'String', 'beautiful_dashboards, claude_tips'],
  ['content_name', 'Content Name', 'String', 'Beautiful Dashboards'],
  ['action', 'Engagement Action', 'Enum', 'like | unlike | comment'],
  ['', '', '', ''],
  ['dataLayer Push Example - Like', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "post_engagement",', '', ''],
  ['', '  content_id: "beautiful_dashboards",', '', ''],
  ['', '  content_name: "Beautiful Dashboards",', '', ''],
  ['', '  action: "like"', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['dataLayer Push Example - Comment', '', '', ''],
  ['Code Snippet', 'window.dataLayer.push({', '', ''],
  ['', '  event: "post_engagement",', '', ''],
  ['', '  content_id: "beautiful_dashboards",', '', ''],
  ['', '  content_name: "Beautiful Dashboards",', '', ''],
  ['', '  action: "comment"', '', ''],
  ['', '});', '', ''],
  ['', '', '', ''],
  ['Implementation Notes', '', '', ''],
  ['', 'action values: "like", "unlike", or "comment"'],
  ['', 'content_id must use underscores (e.g., beautiful_dashboards)'],
  ['', 'Fire immediately on user action (click like button, post comment)'],
  ['', 'Backend: Supabase tables post_likes and post_comments store data'],
  ['', 'Like is togglable - fire both "like" and "unlike" events'],
  ['', 'Comment fired only when form is submitted'],
];

const postEngagementSheet = XLSX.utils.aoa_to_sheet(postEngagementData);
postEngagementSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 35 }];
XLSX.utils.book_append_sheet(wb, postEngagementSheet, 'Post Engagement');

// ==================== SHEET 8: GA4 DIMENSIONS ====================
const dimensionsData = [
  ['GA4 Custom Dimensions Reference', '', '', ''],
  ['22 Event-Scoped Custom Dimensions', '', '', ''],
  ['', '', '', ''],
  ['#', 'Display Name', 'Event Parameter', 'Category'],
  ['01', 'Page Name', 'page_name', 'Page'],
  ['02', 'Page Category', 'page_category', 'Page'],
  ['03', 'Page Type', 'page_type', 'Page'],
  ['04', 'Content Group', 'content_group', 'Page'],
  ['05', 'Page Author', 'page_author', 'Page'],
  ['06', 'Content Type', 'content_type', 'Navigation / Clicks'],
  ['07', 'Content ID', 'content_id', 'Navigation / Clicks'],
  ['08', 'Content Name', 'content_name', 'Navigation / Clicks'],
  ['09', 'Item List Name', 'item_list_name', 'Navigation / Clicks'],
  ['10', 'Destination URL', 'destination_url', 'Navigation / Clicks'],
  ['11', 'Form Name', 'form_name', 'Lead Form'],
  ['12', 'Form ID', 'form_id', 'Lead Form'],
  ['13', 'Subject', 'subject', 'Lead Form'],
  ['14', 'Budget', 'budget', 'Lead Form'],
  ['15', 'Message Filled', 'message_filled', 'Lead Form'],
  ['16', 'Email SHA-256', 'email_sha256', 'Lead Form'],
  ['17', 'Orbit Pause', 'orbit_pause', 'Skills / Orbit'],
  ['18', 'Skill Hover', 'skill_hover', 'Skills / Orbit'],
  ['19', 'Search Has Results', 'search_has_results', 'Search'],
  ['20', 'Search Section', 'search_section', 'Search'],
  ['21', 'Search Active Filter', 'search_active_filter', 'Search'],
  ['22', 'Engagement Action', 'action', 'Post Engagement'],
  ['', '', '', ''],
  ['Setup Instructions', '', '', ''],
  ['', 'All dimensions must be registered in GA4 Admin → Custom definitions → Dimensions'],
  ['', 'Scope: Event (all dimensions are event-scoped)'],
  ['', 'Parameter name must match exactly (case-sensitive)'],
];

const dimensionsSheet = XLSX.utils.aoa_to_sheet(dimensionsData);
dimensionsSheet['!cols'] = [{ wch: 4 }, { wch: 25 }, { wch: 22 }, { wch: 25 }];
XLSX.utils.book_append_sheet(wb, dimensionsSheet, 'GA4 Dimensions');

// ==================== SHEET 9: GA4 METRICS ====================
const metricsData = [
  ['GA4 Custom Metrics Reference', '', '', ''],
  ['4 Event-Scoped Custom Metrics', '', '', ''],
  ['', '', '', ''],
  ['#', 'Display Name', 'Event Parameter', 'Unit'],
  ['01', 'Message Word Count', 'message_word_count', 'Standard (integer)'],
  ['02', 'Message Char Count', 'message_char_count', 'Standard (integer)'],
  ['03', 'Search Results Count', 'search_results_count', 'Standard (integer)'],
  ['04', 'Search Term Length', 'search_term_length', 'Standard (integer)'],
  ['', '', '', ''],
  ['Setup Instructions', '', '', ''],
  ['', 'All metrics must be registered in GA4 Admin → Custom definitions → Metrics'],
  ['', 'Scope: Event (all metrics are event-scoped)'],
  ['', 'Unit: All are Standard (integer) type'],
  ['', 'Parameter name must match exactly (case-sensitive)'],
  ['', 'These metrics are automatically aggregated and can be used in reports'],
];

const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
metricsSheet['!cols'] = [{ wch: 4 }, { wch: 25 }, { wch: 22 }, { wch: 25 }];
XLSX.utils.book_append_sheet(wb, metricsSheet, 'GA4 Metrics');

// ==================== SHEET 10: IMPLEMENTATION CHECKLIST ====================
const checklistData = [
  ['TNK Designs - Analytics Implementation Checklist', '', '', ''],
  ['', '', '', ''],
  ['Pre-Implementation', '', '', ''],
  ['✓', 'Task', 'Status', 'Notes'],
  ['☐', 'Create GTM Container', 'Pending', 'Container ID: GTM-KW97DTMV (already exists)'],
  ['☐', 'Create GA4 Property', 'Pending', 'Property ID: G-25V933JKJD (already exists)'],
  ['☐', 'Register GA4 Custom Dimensions', 'Pending', '22 dimensions required (see GA4 Dimensions sheet)'],
  ['☐', 'Register GA4 Custom Metrics', 'Pending', '4 metrics required (see GA4 Metrics sheet)'],
  ['☐', 'Mark generate_lead as Conversion', 'Pending', 'In GA4 Admin → Data Display → Events'],
  ['', '', '', ''],
  ['Implementation', '', '', ''],
  ['☐', 'Add GTM Script to Page', 'Pending', 'Add to <head> and noscript in body (see GTM Setup)'],
  ['☐', 'Implement page_view Event', 'Pending', 'Fire on page load with page metadata'],
  ['☐', 'Implement select_content Event', 'Pending', 'Add onClick handlers to all clickable content'],
  ['☐', 'Implement generate_lead Event', 'Pending', 'Fire on form submission with form data'],
  ['☐', 'Implement orbit_interaction Event', 'Pending', 'Wire to Orbit widget pause & hover events'],
  ['☐', 'Implement search Event', 'Pending', 'Fire when search results are displayed'],
  ['☐', 'Implement post_engagement Event', 'Pending', 'Wire to like/unlike and comment buttons (Supabase)'],
  ['', '', '', ''],
  ['Testing & Validation', '', '', ''],
  ['☐', 'Test all events in GA4 Real-time', 'Pending', 'Verify events fire with correct parameters'],
  ['☐', 'Verify all dimensions populate', 'Pending', 'Check GA4 Custom Dimensions report'],
  ['☐', 'Verify all metrics aggregate', 'Pending', 'Check GA4 Custom Metrics report'],
  ['☐', 'Validate generate_lead Conversion', 'Pending', 'Check Conversions report shows leads'],
  ['☐', 'Check for dataLayer errors', 'Pending', 'Use browser console and GTM preview'],
  ['☐', 'Monitor for PII leakage', 'Pending', 'Ensure no raw emails (use email_sha256)'],
  ['', '', '', ''],
  ['Documentation', '', '', ''],
  ['☐', 'Create analytics documentation', 'Pending', 'Document event triggers and parameter mapping'],
  ['☐', 'Share measurement plan with team', 'Pending', 'Point to measurement_plan.html'],
  ['☐', 'Set up Looker Studio dashboard', 'Pending', 'Connect to GA4 for daily monitoring'],
];

const checklistSheet = XLSX.utils.aoa_to_sheet(checklistData);
checklistSheet['!cols'] = [{ wch: 4 }, { wch: 30 }, { wch: 15 }, { wch: 40 }];
XLSX.utils.book_append_sheet(wb, checklistSheet, 'Implementation Checklist');

// ==================== Save Workbook ====================
XLSX.writeFile(wb, 'TNK_Labeling_Guide.xlsx');
console.log('✅ Excel file created: TNK_Labeling_Guide.xlsx');
