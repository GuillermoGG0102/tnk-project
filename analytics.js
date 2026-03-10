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
  // Dynamically collects non-PII fields + SHA-256 hashed email (for GA4 enhanced conversions).
  // Skips: password, tel, hidden types + fields matching PII name patterns (except email, which is hashed).
  // Textareas: captured as word_count + char_count, never raw content.
  var PII_TYPES   = ['password', 'tel', 'hidden'];
  var PII_PATTERN = /^(name|firstname|lastname|surname|nombre|apellido|phone|tel|address|direccion)$/i;

  // SHA-256 via Web Crypto API — returns hex string promise
  function sha256(str) {
    var bytes = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', bytes).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-track-form]');
    if (!form) return;

    var payload = {
      event:     'generate_lead',
      form_name: form.getAttribute('data-track-form') || 'contact_form',
      form_id:   form.id || 'unknown',
    };

    // Find email field to hash separately
    var emailEl = form.querySelector('input[type="email"], input[name="email"]');
    var emailRaw = emailEl ? emailEl.value.trim().toLowerCase() : '';

    Array.from(form.elements).forEach(function (el) {
      var key = el.name || el.id;
      if (!key) return;
      if (PII_TYPES.indexOf(el.type) !== -1) return;           // skip password/tel/hidden
      if (el.type === 'email') return;                          // handled separately via hash
      if (PII_PATTERN.test(key)) return;                        // skip name/phone/address
      if (el.type === 'submit' || el.tagName === 'BUTTON') return;

      if (el.tagName === 'TEXTAREA') {
        var txt = (el.value || '').trim();
        payload[key + '_word_count'] = txt ? txt.split(/\s+/).length : 0;
        payload[key + '_char_count'] = txt.length;
        payload[key + '_filled']     = txt.length > 0;
      } else if (el.type === 'checkbox') {
        payload[key] = el.checked;
      } else if (el.type === 'radio') {
        if (el.checked) payload[key] = el.value;
      } else {
        payload[key] = el.value || '(not set)';
      }
    });

    if (emailRaw) {
      // Hash email then push — crypto.subtle is always available in modern browsers
      sha256(emailRaw).then(function (hash) {
        payload.email_sha256 = hash;
        window.dataLayer.push(payload);
      }).catch(function () {
        // Crypto unavailable (e.g. non-HTTPS dev env) — push without hash
        window.dataLayer.push(payload);
      });
    } else {
      window.dataLayer.push(payload);
    }
  });

})();
