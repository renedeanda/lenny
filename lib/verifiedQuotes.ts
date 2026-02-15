import { Quote, EpisodeEnrichment, GuestType } from './types';
import { allEpisodes } from './allEpisodes';
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

/**
 * Get all takeaways with episode context
 */
export function getAllTakeaways(): Array<{
  text: string;
  episodeSlug: string;
  guest: string;
}> {
  const episodeMap = new Map<string, string>();
  for (const ep of allEpisodes) {
    episodeMap.set(ep.slug, ep.guest);
  }

  const takeaways: Array<{
    text: string;
    episodeSlug: string;
    guest: string;
  }> = [];

  for (const episode of registry.episodes) {
    if (episode.takeaways && episode.takeaways.length > 0) {
      const guest = episodeMap.get(episode.slug) || episode.slug;
      for (const text of episode.takeaways) {
        takeaways.push({ text, episodeSlug: episode.slug, guest });
      }
    }
  }

  return takeaways;
}

/**
 * Get takeaways relevant to a topic (by matching theme keywords in takeaway text)
 */
export function getTakeawaysForTopic(topicSlug: string): Array<{
  text: string;
  episodeSlug: string;
  guest: string;
}> {
  const episodeMap = new Map<string, string>();
  for (const ep of allEpisodes) {
    episodeMap.set(ep.slug, ep.guest);
  }

  const results: Array<{ text: string; episodeSlug: string; guest: string }> = [];

  for (const episode of registry.episodes) {
    if (!episode.takeaways || episode.takeaways.length === 0) continue;
    if (!episode.themes?.some(t => t === topicSlug)) continue;

    const guest = episodeMap.get(episode.slug) || episode.slug;
    for (const text of episode.takeaways) {
      results.push({ text, episodeSlug: episode.slug, guest });
    }
  }

  return results;
}

/**
 * Normalize raw guest_type values (e.g. "founder-coach", "investor-founder")
 * to the 5 canonical GuestType categories used in UI filters.
 */
const GUEST_TYPE_CANONICAL: Record<string, GuestType> = {
  founder: 'founder',
  operator: 'operator',
  investor: 'investor',
  advisor: 'advisor',
  academic: 'academic',
};

function normalizeGuestType(raw: string): GuestType {
  // Direct match
  if (raw in GUEST_TYPE_CANONICAL) return GUEST_TYPE_CANONICAL[raw];

  // Compound types: check each segment (e.g. "founder-coach" → "founder")
  for (const segment of raw.split('-')) {
    if (segment in GUEST_TYPE_CANONICAL) return GUEST_TYPE_CANONICAL[segment];
  }

  // Map common non-canonical types to closest category
  const FALLBACK_MAP: Record<string, GuestType> = {
    author: 'advisor',
    coach: 'advisor',
    consultant: 'advisor',
    educator: 'academic',
    executive: 'operator',
    expert: 'advisor',
    practitioner: 'operator',
    researcher: 'academic',
    'product-leader': 'operator',
    'growth-leader': 'operator',
    'design-leader': 'operator',
    'media-executive': 'operator',
    'thought-leader': 'advisor',
    'executive-coach': 'advisor',
  };
  return FALLBACK_MAP[raw] || 'operator';
}

/**
 * Get guest type for a given episode slug
 */
export function getGuestType(slug: string): GuestType | undefined {
  const episode = registry.episodes.find(ep => ep.slug === slug);
  const raw = episode?.guest_metadata?.guest_type;
  return raw ? normalizeGuestType(raw) : undefined;
}

/**
 * Get a map of all episode slugs to their guest type
 */
let _guestTypeMap: Map<string, GuestType> | null = null;
export function getGuestTypeMap(): Map<string, GuestType> {
  if (_guestTypeMap) return _guestTypeMap;
  _guestTypeMap = new Map();
  for (const episode of registry.episodes) {
    const raw = episode.guest_metadata?.guest_type;
    if (raw) {
      _guestTypeMap.set(episode.slug, normalizeGuestType(raw));
    }
  }
  return _guestTypeMap;
}
