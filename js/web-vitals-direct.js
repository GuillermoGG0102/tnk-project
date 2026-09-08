// Web Vitals Tracking - Direct PerformanceObserver implementation
// Captures Core Web Vitals: LCP, INP, CLS using native browser APIs
(function() {
  if (!window.dataLayer) {
    console.warn('dataLayer not available');
    return;
  }

  var thresholds = {
    'LCP': { good: 2500, poor: 4000 },
    'INP': { good: 200, poor: 500 },
    'CLS': { good: 0.1, poor: 0.25 }
  };

  function getRating(metricName, value) {
    var threshold = thresholds[metricName];
    if (!threshold) return 'unknown';
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs_improvement';
    return 'poor';
  }

  function pushEvent(eventData) {
    if (!window.dataLayer) {
      setTimeout(() => pushEvent(eventData), 100);
      return;
    }
    window.dataLayer.push(eventData);
  }

  // Track LCP directly
  if ('PerformanceObserver' in window) {
    try {
      var lcpValue = 0;
      var lcpReported = false;

      var lcpObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        var lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.renderTime || lastEntry.loadTime;
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Report LCP on page load or after delay
      var reportLCP = function() {
        if (!lcpReported && lcpValue > 0) {
          lcpReported = true;
          lcpObserver.disconnect();
          pushEvent({
            event: 'web_vitals',
            metric_name: 'LCP',
            metric_value: Math.round(lcpValue),
            metric_rating: getRating('LCP', lcpValue)
          });
        }
      };

      window.addEventListener('load', function() {
        setTimeout(reportLCP, 0);
      });

      setTimeout(function() {
        if (!lcpReported && lcpValue > 0) {
          reportLCP();
        }
      }, 5000);
    } catch (e) {
      console.warn('LCP tracking failed:', e);
    }
  }

  // Track CLS directly
  if ('PerformanceObserver' in window) {
    try {
      var clsValue = 0;
      var clsReported = false;
      var sessionValue = 0;
      var sessionEntries = [];

      var clsObserver = new PerformanceObserver(function(list) {
        for (var i = 0; i < list.getEntries().length; i++) {
          var entry = list.getEntries()[i];
          if (!entry.hadRecentInput) {
            var firstSessionEntry = sessionEntries[0];
            var lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              entry.startTime - (lastSessionEntry ? lastSessionEntry.startTime : 0) < 1000 &&
              entry.startTime - (firstSessionEntry ? firstSessionEntry.startTime : 0) < 5000
            ) {
              sessionEntries.push(entry);
              sessionValue += entry.value;
            } else {
              sessionEntries = [entry];
              sessionValue = entry.value;
            }
            clsValue = Math.max(clsValue, sessionValue);
          }
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      var reportCLS = function() {
        if (!clsReported) {
          clsReported = true;
          clsObserver.disconnect();
          pushEvent({
            event: 'web_vitals',
            metric_name: 'CLS',
            metric_value: Math.round(clsValue * 1000) / 1000,
            metric_rating: getRating('CLS', clsValue)
          });
        }
      };

      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
          reportCLS();
        }
      });

      window.addEventListener('beforeunload', reportCLS);
      setTimeout(reportCLS, 5000);
    } catch (e) {
      console.warn('CLS tracking failed:', e);
    }
  }

  // Track INP directly - requires PerformanceObserver for 'event' entries
  if ('PerformanceObserver' in window && 'PerformanceEventTiming' in window) {
    try {
      var maxINP = 0;
      var inpReported = false;
      var numInteractions = 0;

      var inpObserver = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.processingDuration && entry.processingDuration > maxINP) {
            maxINP = entry.processingDuration;
            numInteractions++;
          }
        }
      });

      try {
        inpObserver.observe({ entryTypes: ['event'], durationThreshold: 0 });
      } catch (e1) {
        try {
          inpObserver.observe({ type: 'event', buffered: true });
        } catch (e2) {
          inpObserver = null;
        }
      }

      var reportINP = function() {
        if (!inpReported && inpObserver) {
          inpReported = true;
          inpObserver.disconnect();
          if (maxINP > 0) {
            pushEvent({
              event: 'web_vitals',
              metric_name: 'INP',
              metric_value: Math.round(maxINP),
              metric_rating: getRating('INP', maxINP)
            });
          }
        }
      };

      window.addEventListener('beforeunload', reportINP);
      setTimeout(reportINP, 5000);
    } catch (e) {
      console.warn('INP tracking failed:', e);
    }
  }
})();
