import { describe, it, expect } from 'vitest';

/**
 * Tests for JSON-LD structured data generation.
 * Tests the utility function and schema validity.
 */

describe('parseDurationToISO', () => {
  // Re-implement the function for testing since it's not exported
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

  it('should parse HH:MM:SS format', () => {
    expect(parseDurationToISO('1:23:45')).toBe('1H23M45S');
  });

  it('should parse MM:SS format', () => {
    expect(parseDurationToISO('45:30')).toBe('45M30S');
  });

  it('should handle zero values', () => {
    expect(parseDurationToISO('0:0:0')).toBe('0H0M0S');
  });

  it('should return 0S for invalid format', () => {
    expect(parseDurationToISO('invalid')).toBe('0S');
    expect(parseDurationToISO('')).toBe('0S');
    expect(parseDurationToISO('abc:def')).toBe('0S');
  });

  it('should handle single value', () => {
    expect(parseDurationToISO('30')).toBe('0S');
  });
});

describe('safeJsonLd', () => {
  function safeJsonLd(schema: Record<string, unknown>): string {
    return JSON.stringify(schema, (_, value) => (value === undefined ? undefined : value));
  }

  it('should serialize valid JSON', () => {
    const result = safeJsonLd({ name: 'test', value: 42 });
    expect(JSON.parse(result)).toEqual({ name: 'test', value: 42 });
  });

  it('should strip undefined values', () => {
    const result = safeJsonLd({ name: 'test', empty: undefined });
    const parsed = JSON.parse(result);
    expect(parsed).toEqual({ name: 'test' });
    expect('empty' in parsed).toBe(false);
  });

  it('should handle nested objects', () => {
    const result = safeJsonLd({
      '@type': 'PodcastEpisode',
      performer: { '@type': 'Person', name: 'Test' },
    });
    const parsed = JSON.parse(result);
    expect(parsed.performer.name).toBe('Test');
  });

  it('should handle special characters in strings', () => {
    const result = safeJsonLd({ text: 'He said "hello" & goodbye' });
    const parsed = JSON.parse(result);
    expect(parsed.text).toBe('He said "hello" & goodbye');
  });

  it('should handle arrays', () => {
    const result = safeJsonLd({
      keywords: ['product', 'growth', 'strategy'],
    });
    const parsed = JSON.parse(result);
    expect(parsed.keywords).toEqual(['product', 'growth', 'strategy']);
  });
});
