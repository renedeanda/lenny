/**
 * Google Analytics event tracking for PM Philosophy Map
 *
 * Tracks key user journey milestones without being invasive.
 * All events are anonymous and focused on product improvement.
 */

// Type-safe event tracking
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config',
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// ============================================
// Quiz Journey Events
// ============================================

/**
 * User started the quiz from landing page
 */
export function trackQuizStarted() {
  trackEvent('quiz_started', {
    event_category: 'quiz',
    event_label: 'Quiz initiated from landing',
  });
}

/**
 * User completed a quiz question
 */
export function trackQuizProgress(questionNumber: number, totalQuestions: number) {
  trackEvent('quiz_progress', {
    event_category: 'quiz',
    question_number: questionNumber,
    progress_percent: Math.round((questionNumber / totalQuestions) * 100),
  });
}

/**
 * User completed the entire quiz and received results
 */
export function trackQuizCompleted(primaryZone: string, secondaryZone: string) {
  trackEvent('quiz_completed', {
    event_category: 'quiz',
    event_label: 'Quiz finished',
    primary_zone: primaryZone,
    secondary_zone: secondaryZone,
  });
}

/**
 * User abandoned quiz (navigated away before completion)
 */
export function trackQuizAbandoned(lastQuestion: number, totalQuestions: number) {
  trackEvent('quiz_abandoned', {
    event_category: 'quiz',
    last_question: lastQuestion,
    progress_percent: Math.round((lastQuestion / totalQuestions) * 100),
  });
}

// ============================================
// Recommendation Events
// ============================================

/**
 * User clicked on a recommended episode
 */
export function trackRecommendationClicked(
  episodeSlug: string,
  variant: 'primary' | 'contrarian',
  source: 'results' | 'explore'
) {
  trackEvent('recommendation_clicked', {
    event_category: 'recommendations',
    episode_slug: episodeSlug,
    recommendation_type: variant,
    source_page: source,
  });
}

/**
 * User expanded recommendations section on explore page
 */
export function trackRecommendationsExpanded() {
  trackEvent('recommendations_expanded', {
    event_category: 'recommendations',
    event_label: 'User viewed personalized recommendations',
  });
}

// ============================================
// Episode Engagement Events
// ============================================

/**
 * User viewed an episode page
 */
export function trackEpisodeViewed(
  episodeSlug: string,
  hasVerifiedQuotes: boolean
) {
  trackEvent('episode_viewed', {
    event_category: 'episodes',
    episode_slug: episodeSlug,
    has_verified_quotes: hasVerifiedQuotes,
  });
}

/**
 * User clicked to listen to episode (YouTube/Spotify link)
 */
export function trackEpisodeListen(episodeSlug: string, platform: 'youtube' | 'spotify' | 'apple') {
  trackEvent('episode_listen', {
    event_category: 'episodes',
    episode_slug: episodeSlug,
    platform: platform,
  });
}

// ============================================
// Exploration Events
// ============================================

/**
 * User searched for episodes
 */
export function trackEpisodeSearch(searchTerm: string, resultCount: number) {
  trackEvent('episode_search', {
    event_category: 'explore',
    search_term: searchTerm.substring(0, 50), // Limit length
    result_count: resultCount,
  });
}

/**
 * User filtered episodes by zone
 */
export function trackZoneFilter(zoneName: string) {
  trackEvent('zone_filter', {
    event_category: 'explore',
    zone_name: zoneName,
  });
}

// ============================================
// Share & Social Events
// ============================================

/**
 * User shared their results
 */
export function trackResultsShared(method: 'native_share' | 'copy_link') {
  trackEvent('results_shared', {
    event_category: 'social',
    share_method: method,
  });
}

/**
 * User downloaded their results as an image
 */
export function trackResultsDownloaded(primaryZone: string) {
  trackEvent('results_downloaded', {
    event_category: 'social',
    primary_zone: primaryZone,
  });
}
