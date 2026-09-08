// Resource Download Tracking
// Tracks clicks to downloadable resources (Google Sheets templates, etc.)
(function() {
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[data-track-resource]');
    if (!link) return;

    var resource = link.getAttribute('data-track-resource');

    if (resource === 'utm_template') {
      window.dataLayer.push({
        event: 'resource_download',
        content_type: 'utm_template',
        destination_url: link.href,
        template_type: 'utm_generator',
        section: link.getAttribute('data-section') || 'article_body'
      });
    }
  });
})();
