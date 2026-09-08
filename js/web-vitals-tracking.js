// Web Vitals Tracking
// Tracks Core Web Vitals: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)
(function() {
  if (!window.webVitals) {
    console.warn('web-vitals library not loaded');
    return;
  }

  // Thresholds for rating classification (good/needs_improvement/poor)
  var thresholds = {
    'LCP': { good: 2500, poor: 4000 },      // ms
    'INP': { good: 200, poor: 500 },        // ms
    'CLS': { good: 0.1, poor: 0.25 }        // unitless
  };

  function getRating(metricName, value) {
    var threshold = thresholds[metricName];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs_improvement';
    return 'poor';
  }

  function formatValue(metricName, value) {
    if (metricName === 'CLS') {
      // CLS is unitless, round to 3 decimals
      return Math.round(value * 1000) / 1000;
    } else {
      // LCP and INP are in milliseconds, round to nearest integer
      return Math.round(value);
    }
  }

  // Helper to push events with retry logic if dataLayer not ready yet
  function pushEvent(eventData) {
    if (!window.dataLayer) {
      console.warn('dataLayer not ready, retrying web_vitals event...');
      setTimeout(() => pushEvent(eventData), 100);
      return;
    }
    window.dataLayer.push(eventData);
  }

  // Track Cumulative Layout Shift (CLS)
  window.webVitals.getCLS(function(metric) {
    var formattedValue = formatValue('CLS', metric.value);
    pushEvent({
      event: 'web_vitals',
      metric_name: 'CLS',
      metric_value: formattedValue,
      metric_rating: getRating('CLS', metric.value)
    });
  });

  // Track Largest Contentful Paint (LCP)
  window.webVitals.getLCP(function(metric) {
    var formattedValue = formatValue('LCP', metric.value);
    pushEvent({
      event: 'web_vitals',
      metric_name: 'LCP',
      metric_value: formattedValue,
      metric_rating: getRating('LCP', metric.value)
    });
  });

  // Track Interaction to Next Paint (INP)
  window.webVitals.getINP(function(metric) {
    var formattedValue = formatValue('INP', metric.value);
    pushEvent({
      event: 'web_vitals',
      metric_name: 'INP',
      metric_value: formattedValue,
      metric_rating: getRating('INP', metric.value)
    });
  });
})();
