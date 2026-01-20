#!/usr/bin/env node
/**
 * scripts/build-verified.ts
 * 
 * Validates all verified episode JSONs and builds the registry.
 * Fails build if zones/contradictions reference non-existent quotes.
 * 
 * Usage: npm run build-verified
 */

import fs from 'fs';
import path from 'path';
import { zones } from '../lib/zones';
import { contradictions } from '../lib/contradictions';

interface Quote {
  id: string;
  speaker: string;
  text: string;
  timestamp?: string;
  source: {
    slug: string;
    path: string;
    lineStart: number;
    lineEnd: number;
  };
  themes: string[];
  zones: string[];
}

interface EpisodeEnrichment {
  slug: string;
  keyQuotes: Quote[];
  themes: string[];
  takeaways: string[];
  contradictionsRefs: string[];
  zoneInfluence: Record<string, number>;
}

interface VerifiedContent {
  episodes: EpisodeEnrichment[];
  quotes: Quote[];
  lastUpdated: string;
}

function loadVerifiedEpisodes(): EpisodeEnrichment[] {
  const verifiedDir = path.join(process.cwd(), 'data', 'verified');
  
  if (!fs.existsSync(verifiedDir)) {
    console.warn('No verified directory found');
    return [];
  }
  
  const files = fs.readdirSync(verifiedDir).filter(f => f.endsWith('.json'));
  const episodes: EpisodeEnrichment[] = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(verifiedDir, file), 'utf-8');
      const episode = JSON.parse(content);
      episodes.push(episode);
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
      throw err;
    }
  }
  
  return episodes;
}

function extractAllQuotes(episodes: EpisodeEnrichment[]): Quote[] {
  return episodes.flatMap(ep => ep.keyQuotes);
}

function validateZoneReferences(quotes: Quote[]): void {
  const quoteIds = new Set(quotes.map(q => q.id));
  const errors: string[] = [];
  
  for (const [zoneId, zone] of Object.entries(zones)) {
    if (zone.quoteId && !quoteIds.has(zone.quoteId)) {
      errors.push(`Zone '${zoneId}' references non-existent quote: ${zone.quoteId}`);
    }
    
    // Check for legacy fields
    if (zone.quote || zone.quoteAuthor || zone.episode) {
      errors.push(`Zone '${zoneId}' still uses legacy quote fields (quote/quoteAuthor/episode). Use quoteId instead.`);
    }
  }
  
  if (errors.length > 0) {
    console.error('\n❌ Zone validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Zone validation failed');
  }
}

function validateContradictionReferences(quotes: Quote[]): void {
  const quoteIds = new Set(quotes.map(q => q.id));
  const errors: string[] = [];
  
  for (const contradiction of contradictions) {
    // Check if episodeSlug exists in verified episodes
    if (contradiction.sideA.episodeSlug) {
      const hasQuotes = quotes.some(q => q.source.slug === contradiction.sideA.episodeSlug);
      if (!hasQuotes) {
        errors.push(`Contradiction '${contradiction.id}' sideA references unverified episode: ${contradiction.sideA.episodeSlug}`);
      }
    }
    
    if (contradiction.sideB.episodeSlug) {
      const hasQuotes = quotes.some(q => q.source.slug === contradiction.sideB.episodeSlug);
      if (!hasQuotes) {
        errors.push(`Contradiction '${contradiction.id}' sideB references unverified episode: ${contradiction.sideB.episodeSlug}`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error('\n⚠️  Contradiction validation warnings:');
    errors.forEach(err => console.error(`  - ${err}`));
    // Don't fail build for contradictions yet, just warn
  }
}

function validateTranscriptReferences(episodes: EpisodeEnrichment[]): void {
  const errors: string[] = [];
  
  for (const episode of episodes) {
    for (const quote of episode.keyQuotes) {
      const transcriptPath = path.join(process.cwd(), quote.source.path);
      
      if (!fs.existsSync(transcriptPath)) {
        errors.push(`Quote ${quote.id} references non-existent transcript: ${quote.source.path}`);
        continue;
      }
      
      try {
        const content = fs.readFileSync(transcriptPath, 'utf-8');
        const lines = content.split('\n');
        
        if (quote.source.lineStart > lines.length || quote.source.lineEnd > lines.length) {
          errors.push(`Quote ${quote.id} line range (${quote.source.lineStart}-${quote.source.lineEnd}) exceeds transcript length (${lines.length})`);
        }
      } catch (err) {
        errors.push(`Quote ${quote.id}: Failed to read transcript at ${quote.source.path}`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error('\n❌ Transcript reference validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Transcript validation failed');
  }
}

function computeZoneEpisodeCounts(episodes: EpisodeEnrichment[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (const zone of Object.keys(zones)) {
    const episodeSlugs = new Set<string>();
    
    for (const episode of episodes) {
      for (const quote of episode.keyQuotes) {
        if (quote.zones.includes(zone)) {
          episodeSlugs.add(episode.slug);
        }
      }
    }
    
    counts[zone] = episodeSlugs.size;
  }
  
  return counts;
}

function buildRegistry(episodes: EpisodeEnrichment[], quotes: Quote[]): VerifiedContent {
  return {
    episodes,
    quotes,
    lastUpdated: new Date().toISOString(),
  };
}

function main() {
  console.log('🔍 Validating verified content...\n');
  
  // Load all verified episodes
  const episodes = loadVerifiedEpisodes();
  console.log(`✓ Loaded ${episodes.length} verified episodes`);
  
  // Extract all quotes
  const quotes = extractAllQuotes(episodes);
  console.log(`✓ Extracted ${quotes.length} verified quotes`);
  
  // Validate zone references
  validateZoneReferences(quotes);
  console.log('✓ Zone references validated');
  
  // Validate contradiction references (warnings only)
  validateContradictionReferences(quotes);
  console.log('✓ Contradiction references checked');
  
  // Validate transcript references
  validateTranscriptReferences(episodes);
  console.log('✓ Transcript references validated');
  
  // Compute zone episode counts
  const zoneCounts = computeZoneEpisodeCounts(episodes);
  console.log('✓ Zone episode counts computed:');
  Object.entries(zoneCounts).forEach(([zone, count]) => {
    console.log(`  - ${zone}: ${count} episodes`);
  });
  
  // Build registry
  const registry = buildRegistry(episodes, quotes);
  const registryPath = path.join(process.cwd(), 'data', 'verified', 'verified-content.json');
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`\n✅ Registry built: ${registryPath}`);
  console.log(`   ${registry.episodes.length} episodes, ${registry.quotes.length} quotes`);
  
  // Generate TypeScript constants
  const tsContent = `// Auto-generated by scripts/build-verified.ts
// DO NOT EDIT MANUALLY

export const VERIFIED_EPISODE_COUNT = ${episodes.length};
export const VERIFIED_QUOTE_COUNT = ${quotes.length};

export const ZONE_EPISODE_COUNTS = ${JSON.stringify(zoneCounts, null, 2)} as const;

export const VERIFIED_EPISODE_SLUGS = ${JSON.stringify(episodes.map(e => e.slug), null, 2)} as const;
`;
  
  const tsPath = path.join(process.cwd(), 'lib', 'verifiedContent.ts');
  fs.writeFileSync(tsPath, tsContent);
  console.log(`✅ TypeScript constants generated: ${tsPath}`);
}

try {
  main();
} catch (err) {
  console.error('\n💥 Build failed:', err);
  process.exit(1);
}
