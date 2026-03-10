(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  // ─── Page view ─────────────────────────────────────────────────────────────
  // Each page defines window.TNK_PAGE before this script runs.
  document.addEventListener('DOMContentLoaded', function () {
    var p = window.TNK_PAGE || {};
    window.dataLayer.push({
      event:         'page_view',
      page_name:     p.name     || document.title,
      page_category: p.category || 'unknown',
      page_type:     p.type     || 'unknown',
      content_group: p.group    || p.category || 'unknown',
      page_author:   'Guillermo García',
    });
  });

  // ─── Helpers ───────────────────────────────────────────────────────────────

  // Generic dataLayer push helper
  window.tnkTrack = function (data) {
    window.dataLayer.push(Object.assign({ event: 'select_content' }, data));
  };

  // Push select_content then navigate after a brief delay so GTM can fire the hit
  window.tnkNavigate = function (url, data) {
    window.tnkTrack(data);
    setTimeout(function () { window.location.href = url; }, 60);
  };

  // ─── Delegation: <a data-track="..."> ──────────────────────────────────────
  // Any anchor with a data-track attribute (JSON string) gets auto-tracked on click.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[data-track]');
    if (!el) return;

    var data;
    try { data = JSON.parse(el.getAttribute('data-track')); } catch (_) { data = {}; }
    window.tnkTrack(data);

    // For same-origin links (not mailto / tel / _blank / anchor), delay navigation
    var href = el.href || '';
    var isExternal = el.target === '_blank'
      || href.startsWith('mailto:')
      || href.startsWith('tel:')
      || (href.startsWith('http') && !href.includes(window.location.hostname));
    var isAnchor = href.split('#')[0] === window.location.href.split('#')[0] && href.includes('#');

    if (!isExternal && !isAnchor && href) {
      e.preventDefault();
      setTimeout(function () { window.location.href = href; }, 60);
    }
  });

  // ─── Contact form ──────────────────────────────────────────────────────────
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-track-form]');
    if (!form) return;
    window.dataLayer.push({
      event:     'generate_lead',
      form_name: form.getAttribute('data-track-form') || 'contact_form',
      form_id:   form.id || 'unknown',
    });
  });

})();
