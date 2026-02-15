import { describe, it, expect } from 'vitest';
import { generateRecommendations, getBlindSpotDescription } from '@/lib/recommendations';
import { QuizAnswers, ZoneId } from '@/lib/types';

// Sample quiz answers that favor different zones
const velocityAnswers: QuizAnswers = {
  q1: 'a', // velocity+3
  q2: 'a',
  q3: 'a',
  q4: 'a',
  q5: 'a',
  q6: 'a',
  q7: 'a',
  q8: 'a',
  q9: 'a',
  q10: 'a',
};

const mixedAnswers: QuizAnswers = {
  q1: 'a',
  q2: 'b',
  q3: 'c',
  q4: 'a',
  q5: 'b',
  q6: 'c',
  q7: 'a',
  q8: 'b',
  q9: 'c',
  q10: 'a',
};

const minimalAnswers: QuizAnswers = {
  q1: 'a',
  q2: 'b',
  q3: 'c',
  q4: 'a',
  q5: 'b',
  q6: 'c',
  q7: 'a',
};

describe('generateRecommendations', () => {
  it('should return valid recommendation structure', () => {
    const recs = generateRecommendations(velocityAnswers);

    expect(recs).toBeTruthy();
    expect(recs.userProfile).toBeTruthy();
    expect(Array.isArray(recs.primary)).toBe(true);
    expect(Array.isArray(recs.contrarian)).toBe(true);
    expect(recs.byZone).toBeTruthy();
  });

  it('should return up to 12 primary recommendations', () => {
    const recs = generateRecommendations(velocityAnswers);
    expect(recs.primary.length).toBeGreaterThan(0);
    expect(recs.primary.length).toBeLessThanOrEqual(12);
  });

  it('should return up to 6 contrarian recommendations', () => {
    const recs = generateRecommendations(mixedAnswers);
    expect(recs.contrarian.length).toBeLessThanOrEqual(6);
  });

  it('should have primary recommendations sorted by alignment score', () => {
    const recs = generateRecommendations(velocityAnswers);
    for (let i = 1; i < recs.primary.length; i++) {
      expect(recs.primary[i - 1].alignmentScore).toBeGreaterThanOrEqual(recs.primary[i].alignmentScore);
    }
  });

  it('should have no duplicate slugs across primary recommendations', () => {
    const recs = generateRecommendations(mixedAnswers);
    const slugs = recs.primary.map(r => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('should have no overlap between primary and contrarian', () => {
    const recs = generateRecommendations(mixedAnswers);
    const primarySlugs = new Set(recs.primary.map(r => r.slug));
    for (const c of recs.contrarian) {
      expect(primarySlugs.has(c.slug)).toBe(false);
    }
  });

  it('should work with minimal answers (7 questions)', () => {
    const recs = generateRecommendations(minimalAnswers);
    expect(recs.primary.length).toBeGreaterThan(0);
    expect(recs.userProfile.primaryZone).toBeTruthy();
  });

  it('should populate byZone with episodes for each zone', () => {
    const recs = generateRecommendations(velocityAnswers);
    const allZones: ZoneId[] = ['velocity', 'perfection', 'discovery', 'data', 'intuition', 'alignment', 'chaos', 'focus'];

    for (const zone of allZones) {
      expect(Array.isArray(recs.byZone[zone])).toBe(true);
      // Each zone should have at most 3 episodes
      expect(recs.byZone[zone].length).toBeLessThanOrEqual(3);
    }
  });

  it('should include matching quotes in primary recommendations', () => {
    const recs = generateRecommendations(velocityAnswers);
    for (const rec of recs.primary) {
      expect(Array.isArray(rec.matchingQuotes)).toBe(true);
    }
  });

  it('should include contrarian data with why explanation', () => {
    const recs = generateRecommendations(mixedAnswers);
    for (const rec of recs.contrarian) {
      if (rec.contrarian) {
        expect(rec.contrarian.why).toBeTruthy();
        expect(rec.contrarian.quote).toBeTruthy();
      }
    }
  });

  it('should produce valid user profile', () => {
    const recs = generateRecommendations(mixedAnswers);
    const profile = recs.userProfile;

    expect(profile.primaryZone).toBeTruthy();
    expect(profile.secondaryZone).toBeTruthy();
    expect(profile.blindSpotZone).toBeTruthy();
    expect(profile.primaryZone).not.toBe(profile.blindSpotZone);
    expect(profile.topZones.length).toBeGreaterThanOrEqual(2);

    // Zone percentages should sum to approximately 100
    const total = Object.values(profile.zonePercentages).reduce((a, b) => a + b, 0);
    // Allow some rounding tolerance
    expect(total).toBeGreaterThanOrEqual(95);
    expect(total).toBeLessThanOrEqual(105);
  });
});

describe('getBlindSpotDescription', () => {
  it('should return a description for each zone', () => {
    const allZones: ZoneId[] = ['velocity', 'perfection', 'discovery', 'data', 'intuition', 'alignment', 'chaos', 'focus'];

    for (const zone of allZones) {
      const desc = getBlindSpotDescription(zone);
      expect(desc).toBeTruthy();
      expect(desc.length).toBeGreaterThan(10);
    }
  });
});
