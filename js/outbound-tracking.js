// Outbound Link Tracking
// Automatically detects and tracks clicks to external links
(function() {
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    try {
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      var destinationUrl = new URL(href, window.location.href);
      var isExternal = destinationUrl.hostname !== window.location.hostname;

      if (isExternal) {
        var section = link.getAttribute('data-section') ||
                      (link.closest('.article-footer') ? 'article_footer' :
                       link.closest('.prose') ? 'article_body' :
                       'other');

        window.dataLayer.push({
          event: 'outbound_click',
          destination_domain: destinationUrl.hostname,
          destination_url: href,
          link_text: link.textContent.trim().substring(0, 100),
          section: section
        });
      }
    } catch (err) {
      // Invalid URL, ignore
    }
  });
})();
