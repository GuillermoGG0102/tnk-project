// Web Vitals Polyfill
// Local implementation of Core Web Vitals measurement using native browser APIs
// No external library dependency

(function() {
  'use strict';

  // Create window.webVitals object with the three core metrics
  window.webVitals = window.webVitals || {};

  // ─── Largest Contentful Paint (LCP) ──────────────────────────────────────
  window.webVitals.getLCP = function(callback) {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    let lastEntryTime = 0;
    let reported = false;

    try {
      const observer = new PerformanceObserver(function(list) {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (lastEntry.renderTime || lastEntry.loadTime) {
          lastEntryTime = lastEntry.renderTime || lastEntry.loadTime;
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Report LCP after page load + timeout
      window.addEventListener('load', function() {
        setTimeout(function() {
          if (!reported) {
            reported = true;
            observer.disconnect();
            if (lastEntryTime > 0) {
              callback({
                name: 'LCP',
                value: lastEntryTime,
                rating: getRating('LCP', lastEntryTime)
              });
            }
          }
        }, 0);
      });

      // Safety timeout
      setTimeout(function() {
        if (!reported) {
          reported = true;
          observer.disconnect();
          if (lastEntryTime > 0) {
            callback({
              name: 'LCP',
              value: lastEntryTime,
              rating: getRating('LCP', lastEntryTime)
            });
          }
        }
      }, 60000);
    } catch (e) {
      console.warn('LCP measurement failed:', e);
    }
  };

  // ─── Interaction to Next Paint (INP) ────────────────────────────────────
  window.webVitals.getINP = function(callback) {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    let maxINP = 0;
    let reported = false;

    try {
      const observer = new PerformanceObserver(function(list) {
        for (const entry of list.getEntries()) {
          if (entry.processingDuration > maxINP) {
            maxINP = entry.processingDuration;
          }
        }
      });

      observer.observe({ entryTypes: ['event'], durationThreshold: 0 });

      // Report INP on page unload
      function reportINP() {
        if (!reported) {
          reported = true;
          observer.disconnect();
          if (maxINP > 0) {
            callback({
              name: 'INP',
              value: maxINP,
              rating: getRating('INP', maxINP)
            });
          }
        }
      }

      window.addEventListener('beforeunload', reportINP);

      // Safety timeout
      setTimeout(function() {
        if (!reported) {
          reportINP();
        }
      }, 60000);
    } catch (e) {
      console.warn('INP measurement failed:', e);
    }
  };

  // ─── Cumulative Layout Shift (CLS) ──────────────────────────────────────
  window.webVitals.getCLS = function(callback) {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    let clsValue = 0;
    let reported = false;
    let sessionValue = 0;
    let sessionEntries = [];

    try {
      const observer = new PerformanceObserver(function(list) {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

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

      observer.observe({ entryTypes: ['layout-shift'] });

      // Report CLS periodically and on page unload
      function reportCLS() {
        if (!reported) {
          reported = true;
          observer.disconnect();
          callback({
            name: 'CLS',
            value: Math.round(clsValue * 1000) / 1000,
            rating: getRating('CLS', clsValue)
          });
        }
      }

      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
          reportCLS();
        }
      });

      window.addEventListener('beforeunload', reportCLS);

      // Safety timeout
      setTimeout(reportCLS, 60000);
    } catch (e) {
      console.warn('CLS measurement failed:', e);
    }
  };

  // ─── Helper: Get rating classification ──────────────────────────────────
  function getRating(metricName, value) {
    var thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'INP': { good: 200, poor: 500 },
      'CLS': { good: 0.1, poor: 0.25 }
    };

    var threshold = thresholds[metricName];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs_improvement';
    return 'poor';
  }
})();
