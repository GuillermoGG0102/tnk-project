/**
 * Likes Client
 * Client-side library for post likes
 * Uses backend proxy instead of direct Supabase calls (credentials stay secure)
 */

(function() {
  'use strict';

  // Browser ID for tracking user likes (unique per browser)
  function getBrowserId() {
    let id = localStorage.getItem('tnk_browser_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('tnk_browser_id', id);
    }
    return id;
  }

  // Update UI based on like status
  function setLikeUI(likeCount, isLiked) {
    const btn = document.getElementById('like-btn');
    const icon = document.getElementById('heart-icon');
    const el = document.getElementById('like-count');

    if (!btn || !icon || !el) return;

    el.textContent = likeCount === 1 ? '1 like' : likeCount + ' likes';

    if (isLiked) {
      icon.setAttribute('fill', '#FF4D6D');
      icon.setAttribute('stroke', '#FF4D6D');
      btn.style.background = 'rgba(255,77,109,0.1)';
      btn.style.borderColor = 'rgba(255,77,109,0.35)';
      btn.style.color = '#FF4D6D';
    } else {
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      btn.style.background = 'rgba(255,255,255,0.04)';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';
      btn.style.color = '#8A9CC8';
    }
  }

  // Load likes from backend
  async function loadLikes(postSlug) {
    try {
      const response = await fetch(`/api/likes/${postSlug}?browser_id=${getBrowserId()}`);
      const data = await response.json();

      if (data.success !== false) {
        setLikeUI(data.count || 0, data.userLiked || false);
        window._liked = data.userLiked || false;
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  }

  // Toggle like for post
  window.toggleLike = async function(postSlug, postTitle) {
    if (!postSlug) return;

    const el = document.getElementById('like-count');
    const currentCount = parseInt(el?.textContent) || 0;

    try {
      const action = window._liked ? 'unlike' : 'like';
      const response = await fetch(`/api/likes/${postSlug}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          browser_id: getBrowserId(),
          action: action
        })
      });

      const result = await response.json();

      if (result.success) {
        if (action === 'unlike') {
          window._liked = false;
          setLikeUI(Math.max(0, currentCount - 1), false);
        } else {
          window._liked = true;
          setLikeUI(currentCount + 1, true);
        }

        // Track in dataLayer
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'post_engagement',
            content_id: postSlug,
            content_name: postTitle,
            action: action
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Initialize likes on page load
  window.initLikes = function(postSlug) {
    if (postSlug) {
      loadLikes(postSlug);
    }
  };

  // Global state
  window._liked = false;
})();
