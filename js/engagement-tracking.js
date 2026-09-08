// Engagement Tracking
// Tracks scroll depth, active reading time, and code copy events
(function() {
  var contentId = window.TNK_PAGE?.name || 'unknown';
  var contentCategory = window.TNK_PAGE?.category || 'unknown';
  var startTime = Date.now();
  var scrollTracked = {};
  var isTabActive = true;

  // Track scroll depth (25%, 50%, 75%, 100%)
  var scrollThresholds = [25, 50, 75, 100];
  window.addEventListener('scroll', function() {
    var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

    scrollThresholds.forEach(function(threshold) {
      if (scrollPercent >= threshold && !scrollTracked[threshold]) {
        scrollTracked[threshold] = true;
        var timeToScroll = Math.round((Date.now() - startTime) / 1000);

        window.dataLayer.push({
          event: 'scroll_depth',
          scroll_percentage: threshold,
          content_id: contentId,
          time_to_scroll: timeToScroll
        });
      }
    });
  }, { passive: true });

  // Track tab visibility changes
  document.addEventListener('visibilitychange', function() {
    isTabActive = !document.hidden;
  });

  // Track engagement time when user leaves the page
  window.addEventListener('beforeunload', function() {
    var totalEngagementTime = Math.round((Date.now() - startTime) / 1000);

    // Only track if user spent more than 5 seconds on the page
    if (totalEngagementTime > 5) {
      window.dataLayer.push({
        event: 'engagement_time',
        engagement_duration_seconds: totalEngagementTime,
        content_id: contentId,
        content_category: contentCategory
      });
    }
  });

  // Inject copy buttons into all code blocks
  function injectCopyButtons() {
    var codeBlocks = document.querySelectorAll('pre code');
    var snippetIndex = 0;

    codeBlocks.forEach(function(codeBlock) {
      var pre = codeBlock.parentElement;

      // Skip if button already exists
      if (pre.querySelector('.code-copy-btn')) return;

      // Detect language from class (e.g., language-javascript)
      var language = 'unknown';
      var classList = codeBlock.className || '';
      var langMatch = classList.match(/language-(\w+)/);
      if (langMatch) {
        language = langMatch[1];
      }

      // Create button
      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = 'Copy';
      btn.dataset.language = language;
      btn.dataset.snippetIndex = snippetIndex++;
      btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:6px 12px;background:#00CFFF;color:#0A0F1E;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;z-index:10;transition:all 0.2s;';

      // Make pre relative if not already
      if (getComputedStyle(pre).position === 'static') {
        pre.style.position = 'relative';
      }

      // Insert button
      pre.insertBefore(btn, pre.firstChild);
    });
  }

  // Inject buttons when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCopyButtons);
  } else {
    injectCopyButtons();
  }

  // Track code copy events
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.code-copy-btn');
    if (!btn) return;

    e.preventDefault();
    var pre = btn.closest('pre');
    var codeBlock = pre ? pre.querySelector('code') : null;
    if (!codeBlock) return;

    var text = codeBlock.textContent;
    var lines = text.split('\n').filter(function(line) { return line.trim().length > 0; }).length;
    var language = btn.dataset.language || 'unknown';
    var snippetIndex = btn.dataset.snippetIndex || '0';

    navigator.clipboard.writeText(text).then(function() {
      // Visual feedback
      var originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = 'rgba(0, 255, 179, 0.2)';
      btn.style.borderColor = 'rgba(0, 255, 179, 0.5)';

      setTimeout(function() {
        btn.textContent = originalText;
        btn.style.background = '#00CFFF';
        btn.style.borderColor = '';
      }, 2000);

      // Track event
      window.dataLayer.push({
        event: 'code_copy',
        code_language: language,
        code_lines: lines,
        content_id: contentId,
        snippet_index: snippetIndex
      });
    }).catch(function(err) {
      console.warn('Clipboard copy failed:', err);
    });
  });
})();
