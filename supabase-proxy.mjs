/**
 * Supabase Backend Proxy
 * Handles all Supabase requests server-side to keep credentials secure
 * Credentials are loaded from .env, not exposed to client
 */

import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  Supabase credentials not configured in .env');
}

/**
 * GET /api/likes/:post_slug
 * Get like count and user like status for a post
 */
export async function getPostLikes(postSlug, browserId) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Supabase not configured', count: 0, userLiked: false };
  }

  try {
    // Get total like count
    const countRes = await fetch(`${SUPABASE_URL}/rest/v1/post_likes?post_slug=eq.${postSlug}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });

    const countData = await countRes.json();
    const count = countRes.headers.get('content-range')?.split('/')[1] || 0;

    // Check if user liked this post
    let userLiked = false;
    if (browserId) {
      const userRes = await fetch(
        `${SUPABASE_URL}/rest/v1/post_likes?post_slug=eq.${postSlug}&browser_id=eq.${browserId}`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const userData = await userRes.json();
      userLiked = Array.isArray(userData) && userData.length > 0;
    }

    return {
      count: parseInt(count) || 0,
      userLiked,
      success: true
    };
  } catch (error) {
    console.error('Error fetching likes:', error);
    return { error: error.message, count: 0, userLiked: false };
  }
}

/**
 * POST /api/likes/:post_slug/toggle
 * Toggle like for a post
 */
export async function togglePostLike(postSlug, browserId, action) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'Supabase not configured', success: false };
  }

  try {
    if (action === 'unlike') {
      // Delete like
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/post_likes?post_slug=eq.${postSlug}&browser_id=eq.${browserId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: res.ok };
    } else {
      // Add like
      const res = await fetch(`${SUPABASE_URL}/rest/v1/post_likes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          post_slug: postSlug,
          browser_id: browserId
        })
      });
      return { success: res.ok || res.status === 201 };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { error: error.message, success: false };
  }
}

/**
 * HTTP Route Handler
 * Use this in your server to handle API requests
 */
export function handleSupabaseApi(pathname, queryParams, body) {
  // GET /api/likes/:post_slug
  if (pathname.startsWith('/api/likes/') && !pathname.endsWith('/toggle')) {
    const postSlug = pathname.split('/')[3];
    const browserId = queryParams?.browser_id;
    return getPostLikes(postSlug, browserId);
  }

  // POST /api/likes/:post_slug/toggle
  if (pathname.includes('/api/likes/') && pathname.endsWith('/toggle')) {
    const postSlug = pathname.split('/')[3];
    const browserId = body?.browser_id;
    const action = body?.action || 'like';
    return togglePostLike(postSlug, browserId, action);
  }

  return { error: 'Not found' };
}
