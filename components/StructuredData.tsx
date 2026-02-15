/**
 * JSON-LD Structured Data components for SEO
 * These generate Schema.org markup that enables rich Google results,
 * knowledge panels, FAQ snippets, and featured snippets.
 */

import { Quote, EpisodeEnrichment } from '@/lib/types';
import { Episode } from '@/lib/allEpisodes';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lenny.productbuilder.net';

/**
 * Safely serialize schema to JSON, stripping undefined values
 * and escaping </script> tags that would break the HTML context
 */
export function safeJsonLd(schema: Record<string, unknown>): string {
  const json = JSON.stringify(schema, (_, value) => (value === undefined ? undefined : value));
  // Prevent </script> from breaking out of the JSON-LD script tag
  return json.replace(/<\/script/gi, '<\\/script');
}

/**
 * WebSite schema - enables sitelinks search box in Google
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Lenny's Podcast PM Philosophy",
    alternateName: 'PM Philosophy Quiz',
    url: BASE_URL,
    description: "Discover your product management philosophy through Lenny's Podcast episodes. Take a quiz, get personalized episode recommendations based on verified quotes.",
    publisher: {
      '@type': 'Organization',
      name: "Lenny's Podcast PM Philosophy",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

/**
 * PodcastEpisode schema for individual episode pages
 * This enables rich episode results in Google with guest, duration, etc.
 */
export function PodcastEpisodeSchema({
  episode,
  enrichment,
}: {
  episode: Episode;
  enrichment?: EpisodeEnrichment;
}) {
  const episodeUrl = `${BASE_URL}/episodes/${episode.slug}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: `${episode.guest} - ${episode.title}`,
    description: episode.description || `${episode.guest} shares insights on product management, strategy, and leadership on Lenny's Podcast.`,
    url: episodeUrl,
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: "Lenny's Podcast",
      url: 'https://www.lennyspodcast.com',
    },
    performer: {
      '@type': 'Person',
      name: episode.guest,
    },
  };

  // Only add fields that have values (avoid undefined in JSON)
  if (episode.publishDate) {
    schema.datePublished = episode.publishDate;
  }

  if (episode.duration) {
    schema.timeRequired = `PT${parseDurationToISO(episode.duration)}`;
  }

  if (episode.youtubeUrl) {
    const video: Record<string, unknown> = {
      '@type': 'VideoObject',
      name: episode.title,
      description: episode.description || `${episode.guest} on Lenny's Podcast`,
      thumbnailUrl: `${BASE_URL}/og/${episode.slug}.png`,
      contentUrl: episode.youtubeUrl,
    };
    if (episode.publishDate) video.uploadDate = episode.publishDate;
    if (episode.videoId) video.embedUrl = `https://www.youtube.com/embed/${episode.videoId}`;
    if (episode.duration) video.duration = `PT${parseDurationToISO(episode.duration)}`;
    if (episode.viewCount && episode.viewCount > 0) {
      video.interactionStatistic = {
        '@type': 'InteractionCounter',
        interactionType: { '@type': 'WatchAction' },
        userInteractionCount: episode.viewCount,
      };
    }
    schema.associatedMedia = video;
  }

  // Add keywords as about topics
  if (episode.keywords && episode.keywords.length > 0) {
    schema.about = episode.keywords.map(kw => ({
      '@type': 'Thing',
      name: kw,
    }));
  }

  // Add key takeaways as text if enrichment exists
  if (enrichment?.takeaways && enrichment.takeaways.length > 0) {
    schema.abstract = enrichment.takeaways.join(' ');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

/**
 * FAQ schema using episode takeaways and quotes
 * This enables expandable FAQ results in Google search
 */
export function EpisodeFAQSchema({
  episode,
  enrichment,
}: {
  episode: Episode;
  enrichment: EpisodeEnrichment;
}) {
  const questions: Array<{ question: string; answer: string }> = [];

  // Convert takeaways into Q&A format
  if (enrichment.takeaways && enrichment.takeaways.length > 0) {
    questions.push({
      question: `What are the key takeaways from ${episode.guest}'s episode on Lenny's Podcast?`,
      answer: enrichment.takeaways.map((t, i) => `${i + 1}. ${t}`).join(' '),
    });
  }

  // Convert top quotes into Q&A format
  const topQuotes = enrichment.quotes?.slice(0, 3) || [];
  if (topQuotes.length > 0) {
    const themes = enrichment.themes?.slice(0, 2).join(' and ') || 'product management';
    questions.push({
      question: `What does ${episode.guest} say about ${themes}?`,
      answer: topQuotes.map(q => `"${q.text}" - ${q.speaker}`).join(' '),
    });
  }

  // Add theme-specific questions
  if (enrichment.themes && enrichment.themes.length > 0) {
    const mainThemes = enrichment.themes.slice(0, 3);
    const themeQuotes = enrichment.quotes?.filter(q =>
      q.themes.some(t => mainThemes.includes(t))
    ).slice(0, 2) || [];

    if (themeQuotes.length > 0) {
      questions.push({
        question: `What are ${episode.guest}'s views on ${mainThemes.join(', ')}?`,
        answer: themeQuotes.map(q => `${q.speaker}: "${q.text}"`).join(' '),
      });
    }
  }

  // Don't render empty FAQ schema — Google will flag it
  if (questions.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

/**
 * BreadcrumbList schema for navigation
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  if (items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

/**
 * ItemList schema for collection pages (explore, insights)
 * Enables carousel/list results in Google
 */
export function EpisodeListSchema({
  episodes,
  listName,
  listDescription,
}: {
  episodes: Array<{ slug: string; guest: string; title: string }>;
  listName: string;
  listDescription: string;
}) {
  if (episodes.length === 0) return null;

  // Limit to 20 and report accurate count
  const displayEpisodes = episodes.slice(0, 20);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    numberOfItems: displayEpisodes.length,
    itemListElement: displayEpisodes.map((ep, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/episodes/${ep.slug}`,
      name: `${ep.guest} - ${ep.title}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

/**
 * Parse "1:23:45" or "45:30" duration format to ISO 8601 duration parts
 */
function parseDurationToISO(duration: string): string {
  const parts = duration.split(':').map(Number);
  if (parts.some(isNaN)) return '0S';
  if (parts.length === 3) {
    return `${parts[0]}H${parts[1]}M${parts[2]}S`;
  } else if (parts.length === 2) {
    return `${parts[0]}M${parts[1]}S`;
  }
  return '0S';
}
