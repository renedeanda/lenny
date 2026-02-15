import { describe, it, expect } from 'vitest';
import {
  TOPIC_PAGES,
  getQuotesForTopic,
  getEpisodesForTopic,
  getAllTopicSlugs,
} from '@/lib/topics';

describe('TOPIC_PAGES', () => {
  it('should have at least 10 topics defined', () => {
    expect(TOPIC_PAGES.length).toBeGreaterThanOrEqual(10);
  });

  it('should have unique slugs', () => {
    const slugs = TOPIC_PAGES.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('should have all required fields', () => {
    for (const topic of TOPIC_PAGES) {
      expect(topic.slug).toBeTruthy();
      expect(topic.name).toBeTruthy();
      expect(topic.description).toBeTruthy();
      expect(topic.description.length).toBeGreaterThan(20);
      expect(Array.isArray(topic.relatedTopics)).toBe(true);
      expect(topic.relatedTopics.length).toBeGreaterThan(0);
    }
  });

  it('should not have self-referencing relatedTopics', () => {
    for (const topic of TOPIC_PAGES) {
      expect(topic.relatedTopics).not.toContain(topic.slug);
    }
  });
});

describe('getQuotesForTopic', () => {
  it('should return quotes for a valid topic', () => {
    const quotes = getQuotesForTopic('leadership');
    expect(quotes.length).toBeGreaterThan(0);
  });

  it('should return empty array for unknown topic', () => {
    const quotes = getQuotesForTopic('nonexistent-topic-xyz');
    expect(quotes).toEqual([]);
  });

  it('should return unique quotes (no duplicates)', () => {
    const quotes = getQuotesForTopic('strategy');
    const ids = quotes.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should include quotes from related topics', () => {
    // Leadership includes 'management', 'hiring', 'culture', 'team-building'
    const quotes = getQuotesForTopic('leadership');
    const themes = new Set(quotes.flatMap(q => q.themes));
    // Should have matches beyond just 'leadership'
    const hasRelated = ['management', 'hiring', 'culture', 'team-building'].some(t => themes.has(t));
    expect(hasRelated).toBe(true);
  });

  it('should have quotes with valid structure', () => {
    const quotes = getQuotesForTopic('growth');
    for (const quote of quotes.slice(0, 5)) {
      expect(quote.id).toBeTruthy();
      expect(quote.speaker).toBeTruthy();
      expect(quote.text).toBeTruthy();
      expect(quote.text.length).toBeGreaterThan(10);
      expect(quote.source).toBeTruthy();
      expect(quote.source.slug).toBeTruthy();
      expect(Array.isArray(quote.themes)).toBe(true);
      expect(Array.isArray(quote.zones)).toBe(true);
    }
  });
});

describe('getEpisodesForTopic', () => {
  it('should return episodes for valid topic', () => {
    const episodes = getEpisodesForTopic('leadership');
    expect(episodes.length).toBeGreaterThan(0);
  });

  it('should return empty array for unknown topic', () => {
    const episodes = getEpisodesForTopic('nonexistent-xyz');
    expect(episodes).toEqual([]);
  });

  it('should be sorted by quote count descending', () => {
    const episodes = getEpisodesForTopic('strategy');
    for (let i = 1; i < episodes.length; i++) {
      expect(episodes[i - 1].quoteCount).toBeGreaterThanOrEqual(episodes[i].quoteCount);
    }
  });

  it('should have valid episode structure', () => {
    const episodes = getEpisodesForTopic('growth');
    for (const ep of episodes.slice(0, 5)) {
      expect(ep.slug).toBeTruthy();
      expect(ep.guest).toBeTruthy();
      expect(typeof ep.quoteCount).toBe('number');
      expect(ep.quoteCount).toBeGreaterThan(0);
    }
  });

  it('should not have duplicate episodes', () => {
    const episodes = getEpisodesForTopic('decision-making');
    const slugs = episodes.map(e => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getAllTopicSlugs', () => {
  it('should return all topic slugs', () => {
    const slugs = getAllTopicSlugs();
    expect(slugs.length).toBe(TOPIC_PAGES.length);
    for (const topic of TOPIC_PAGES) {
      expect(slugs).toContain(topic.slug);
    }
  });
});
