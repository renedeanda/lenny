import { describe, it, expect } from 'vitest';
import {
  getAllVerifiedQuotes,
  getRegistryInfo,
  getAllTakeaways,
  getContrarianQuotes,
  getGuestTypeMap,
  getGuestType,
  getTakeawaysForTopic,
  getEpisodeEnrichment,
  getVerifiedEpisodeSlugs,
  hasVerifiedContent,
  getQuotesByEpisode,
} from '../verifiedQuotes';

describe('verifiedQuotes', () => {
  describe('getAllVerifiedQuotes', () => {
    it('returns an array of quotes', () => {
      const quotes = getAllVerifiedQuotes();
      expect(Array.isArray(quotes)).toBe(true);
      expect(quotes.length).toBeGreaterThan(0);
    });

    it('each quote has required fields', () => {
      const quotes = getAllVerifiedQuotes();
      const sample = quotes[0];
      expect(sample).toHaveProperty('id');
      expect(sample).toHaveProperty('speaker');
      expect(sample).toHaveProperty('text');
      expect(sample).toHaveProperty('source');
      expect(sample).toHaveProperty('themes');
      expect(sample).toHaveProperty('zones');
      expect(sample.source).toHaveProperty('slug');
      expect(typeof sample.text).toBe('string');
      expect(sample.text.length).toBeGreaterThan(0);
    });
  });

  describe('getRegistryInfo', () => {
    it('returns correct structure with positive counts', () => {
      const info = getRegistryInfo();
      expect(info.episodeCount).toBeGreaterThan(0);
      expect(info.quoteCount).toBeGreaterThan(0);
      expect(typeof info.lastUpdated).toBe('string');
    });

    it('quote count matches getAllVerifiedQuotes length', () => {
      const info = getRegistryInfo();
      const quotes = getAllVerifiedQuotes();
      expect(info.quoteCount).toBe(quotes.length);
    });
  });

  describe('getAllTakeaways', () => {
    it('returns an array of takeaways with episode context', () => {
      const takeaways = getAllTakeaways();
      expect(Array.isArray(takeaways)).toBe(true);
      expect(takeaways.length).toBeGreaterThan(0);
    });

    it('each takeaway has text, episodeSlug, and guest', () => {
      const takeaways = getAllTakeaways();
      const sample = takeaways[0];
      expect(typeof sample.text).toBe('string');
      expect(typeof sample.episodeSlug).toBe('string');
      expect(typeof sample.guest).toBe('string');
      expect(sample.text.length).toBeGreaterThan(0);
      expect(sample.episodeSlug.length).toBeGreaterThan(0);
    });

    it('has multiple takeaways per episode', () => {
      const takeaways = getAllTakeaways();
      const byEpisode = new Map<string, number>();
      for (const t of takeaways) {
        byEpisode.set(t.episodeSlug, (byEpisode.get(t.episodeSlug) || 0) + 1);
      }
      // Most curated episodes have 4-5 takeaways
      const counts = Array.from(byEpisode.values());
      expect(counts.some(c => c >= 4)).toBe(true);
    });
  });

  describe('getContrarianQuotes', () => {
    it('returns contrarian quotes with explanations', () => {
      const contrarians = getContrarianQuotes();
      expect(Array.isArray(contrarians)).toBe(true);
      expect(contrarians.length).toBeGreaterThan(0);
    });

    it('each contrarian has quote, why, episodeSlug, and guest', () => {
      const contrarians = getContrarianQuotes();
      const sample = contrarians[0];
      expect(sample.quote).toHaveProperty('id');
      expect(sample.quote).toHaveProperty('text');
      expect(typeof sample.why).toBe('string');
      expect(sample.why.length).toBeGreaterThan(0);
      expect(typeof sample.episodeSlug).toBe('string');
      expect(typeof sample.guest).toBe('string');
    });

    it('contrarian quote IDs match real quotes', () => {
      const contrarians = getContrarianQuotes();
      const allQuotes = getAllVerifiedQuotes();
      const quoteIds = new Set(allQuotes.map(q => q.id));

      for (const c of contrarians) {
        expect(quoteIds.has(c.quote.id)).toBe(true);
      }
    });
  });

  describe('getGuestTypeMap', () => {
    it('returns a Map of slug to guest type', () => {
      const map = getGuestTypeMap();
      expect(map).toBeInstanceOf(Map);
      expect(map.size).toBeGreaterThan(0);
    });

    it('values are valid guest types', () => {
      const validTypes = new Set(['founder', 'operator', 'investor', 'advisor', 'academic']);
      const map = getGuestTypeMap();
      for (const [, guestType] of map) {
        expect(validTypes.has(guestType)).toBe(true);
      }
    });
  });

  describe('getGuestType', () => {
    it('returns guest type for known episode', () => {
      const map = getGuestTypeMap();
      const firstSlug = Array.from(map.keys())[0];
      const type = getGuestType(firstSlug);
      expect(type).toBeDefined();
    });

    it('returns undefined for unknown episode', () => {
      const type = getGuestType('nonexistent-episode-slug');
      expect(type).toBeUndefined();
    });
  });

  describe('getTakeawaysForTopic', () => {
    it('returns takeaways matching topic theme', () => {
      const takeaways = getTakeawaysForTopic('leadership');
      expect(Array.isArray(takeaways)).toBe(true);
      // Leadership should have some takeaways since it's a major topic
      expect(takeaways.length).toBeGreaterThan(0);
    });

    it('returns empty array for nonexistent topic', () => {
      const takeaways = getTakeawaysForTopic('definitely-not-a-topic-slug');
      expect(takeaways).toEqual([]);
    });

    it('takeaways come from episodes tagged with that topic', () => {
      const takeaways = getTakeawaysForTopic('leadership');
      for (const t of takeaways) {
        const enrichment = getEpisodeEnrichment(t.episodeSlug);
        expect(enrichment).toBeDefined();
        expect(enrichment?.themes).toContain('leadership');
      }
    });
  });

  describe('getVerifiedEpisodeSlugs', () => {
    it('returns array of valid slugs', () => {
      const slugs = getVerifiedEpisodeSlugs();
      expect(slugs.length).toBeGreaterThan(0);
      for (const slug of slugs) {
        expect(typeof slug).toBe('string');
        expect(slug.length).toBeGreaterThan(0);
      }
    });
  });

  describe('hasVerifiedContent', () => {
    it('returns true for verified episodes', () => {
      const slugs = getVerifiedEpisodeSlugs();
      expect(hasVerifiedContent(slugs[0])).toBe(true);
    });

    it('returns false for unknown episodes', () => {
      expect(hasVerifiedContent('fake-episode')).toBe(false);
    });
  });

  describe('getQuotesByEpisode', () => {
    it('returns quotes for a verified episode', () => {
      const slugs = getVerifiedEpisodeSlugs();
      const quotes = getQuotesByEpisode(slugs[0]);
      expect(quotes.length).toBeGreaterThan(0);
      for (const q of quotes) {
        expect(q.source.slug).toBe(slugs[0]);
      }
    });

    it('returns empty for unknown episode', () => {
      expect(getQuotesByEpisode('fake')).toEqual([]);
    });
  });
});
