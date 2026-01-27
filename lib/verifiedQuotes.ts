import { Quote, EpisodeEnrichment } from './types';
import verifiedContent from '../data/verified/verified-content.json';

// In-memory cache of the verified content
const registry = verifiedContent as unknown as {
  episodes: EpisodeEnrichment[];
  quotes: Quote[];
  lastUpdated: string;
};

/**
 * Get all verified quotes
 */
export function getAllVerifiedQuotes(): Quote[] {
  return registry.quotes;
}

/**
 * Get quote by ID
 */
export function getQuoteById(quoteId: string): Quote | undefined {
  return registry.quotes.find(q => q.id === quoteId);
}

/**
 * Get all quotes for an episode
 */
export function getQuotesByEpisode(slug: string): Quote[] {
  return registry.quotes.filter(q => q.source.slug === slug);
}

/**
 * Get episode enrichment data
 */
export function getEpisodeEnrichment(slug: string): EpisodeEnrichment | undefined {
  return registry.episodes.find(ep => ep.slug === slug);
}

/**
 * Get all verified episode slugs
 */
export function getVerifiedEpisodeSlugs(): string[] {
  return registry.episodes.map(ep => ep.slug).filter(Boolean);
}

/**
 * Check if episode has verified content
 */
export function hasVerifiedContent(slug: string): boolean {
  return registry.episodes.some(ep => ep.slug === slug);
}

/**
 * Get quotes by zone
 */
export function getQuotesByZone(zoneId: string): Quote[] {
  return registry.quotes.filter(q => q.zones.includes(zoneId as any));
}

/**
 * Get quotes by theme
 */
export function getQuotesByTheme(theme: string): Quote[] {
  return registry.quotes.filter(q => q.themes.includes(theme));
}

/**
 * Get registry metadata
 */
export function getRegistryInfo() {
  return {
    episodeCount: registry.episodes.length,
    quoteCount: registry.quotes.length,
    lastUpdated: registry.lastUpdated,
  };
}

/**
 * Get all contrarian quotes with their explanations
 */
export function getContrarianQuotes(): Array<{
  quote: Quote;
  why: string;
  episodeSlug: string;
  guest: string;
}> {
  const contrarians: Array<{
    quote: Quote;
    why: string;
    episodeSlug: string;
    guest: string;
  }> = [];

  for (const episode of registry.episodes) {
    if (episode.contrarian_candidates && episode.contrarian_candidates.length > 0) {
      for (const candidate of episode.contrarian_candidates) {
        const quote = registry.quotes.find(q => q.id === candidate.quoteId);
        if (quote) {
          contrarians.push({
            quote,
            why: candidate.why,
            episodeSlug: episode.slug,
            guest: quote.speaker
          });
        }
      }
    }
  }

  return contrarians;
}
