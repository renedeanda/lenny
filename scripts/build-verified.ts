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
  quotes: Quote[];
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
  
  const files = fs.readdirSync(verifiedDir)
    .filter(f => f.endsWith('.json') && f !== 'verified-content.json'); // Skip the generated registry
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
  return episodes.flatMap(ep => {
    const quotes = ep.quotes || [];
    return quotes;
  });
}

function validateZoneReferences(quotes: Quote[]): void {
  const quoteIds = new Set(quotes.filter(q => q && q.id).map(q => q.id));
  const errors: string[] = [];
  
  for (const [zoneId, zone] of Object.entries(zones)) {
    if (!zone) {
      errors.push(`Zone '${zoneId}' is undefined`);
      continue;
    }
    
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
  const quoteIds = new Set(quotes.filter(q => q && q.id).map(q => q.id));
  const errors: string[] = [];
  
  for (const contradiction of contradictions) {
    // Check if episodeSlug exists in verified episodes
    if (contradiction.sideA.episodeSlug) {
      const hasQuotes = quotes.some(q => q && q.source && q.source.slug === contradiction.sideA.episodeSlug);
      if (!hasQuotes) {
        errors.push(`Contradiction '${contradiction.id}' sideA references unverified episode: ${contradiction.sideA.episodeSlug}`);
      }
    }
    
    if (contradiction.sideB.episodeSlug) {
      const hasQuotes = quotes.some(q => q && q.source && q.source.slug === contradiction.sideB.episodeSlug);
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

function detectDuplicateQuotes(quotes: Quote[]): void {
  const warnings: string[] = [];
  const seenTexts = new Map<string, string>(); // text -> quoteId
  
  for (const quote of quotes) {
    const normalizedText = quote.text.trim().toLowerCase().replace(/\s+/g, ' ');
    
    // Check for exact duplicates
    const existingQuoteId = seenTexts.get(normalizedText);
    if (existingQuoteId) {
      warnings.push(`Duplicate quote detected: ${quote.id} matches ${existingQuoteId}`);
    } else {
      seenTexts.set(normalizedText, quote.id);
    }
    
    // Flag quotes from first 5 minutes (likely highlights)
    const timestamp = quote.timestamp || '';
    // Handle both HH:MM:SS and MM:SS formats
    const timestampMatch = timestamp.match(/^(?:(\d+):)?(\d+):(\d+)$/);
    if (timestampMatch) {
      const hours = timestampMatch[1] ? parseInt(timestampMatch[1]) : 0;
      const minutes = parseInt(timestampMatch[2]);
      const totalMinutes = (hours * 60) + minutes;
      if (totalMinutes < 5) {
        warnings.push(`Quote ${quote.id} is from first 5 minutes (${timestamp}) - may be highlight duplicate`);
      }
    }
    
    // Flag very short quotes (higher duplicate risk)
    if (quote.text.length < 150) {
      warnings.push(`Quote ${quote.id} is very short (${quote.text.length} chars) - review for duplicates`);
    }
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  Duplicate quote warnings:');
    warnings.slice(0, 10).forEach(warn => console.warn(`  - ${warn}`));
    if (warnings.length > 10) {
      console.warn(`  ... and ${warnings.length - 10} more warnings`);
    }
  }
}

function validateTranscriptReferences(episodes: EpisodeEnrichment[]): void {
  const errors: string[] = [];
  
  for (const episode of episodes) {
    const quotes = (episode as any).quotes || [];
    const episodeSlug = (episode as any).slug || (episode as any).episode_slug;
    
    if (!episodeSlug) {
      errors.push(`Episode missing slug: ${JSON.stringify(episode).substring(0, 100)}...`);
      continue;
    }
    
    for (const quote of quotes) {
      // Handle both old (path) and new (episode_slug) source formats
      let transcriptPath: string;
      
      if (quote.source && quote.source.path) {
        // Old format: has explicit path
        transcriptPath = path.join(process.cwd(), quote.source.path);
      } else {
        // New format: construct path from episode slug
        transcriptPath = path.join(process.cwd(), 'episodes', episodeSlug, 'transcript.md');
      }
      
      if (!fs.existsSync(transcriptPath)) {
        errors.push(`Quote ${quote.id} references non-existent transcript: ${transcriptPath}`);
        continue;
      }
      
      try {
        const content = fs.readFileSync(transcriptPath, 'utf-8');
        const lines = content.split('\n');
        
        const lineStart = quote.source.lineStart || quote.source.line_start;
        const lineEnd = quote.source.lineEnd || quote.source.line_end;
        
        if (lineStart > lines.length || lineEnd > lines.length) {
          errors.push(`Quote ${quote.id} line range (${lineStart}-${lineEnd}) exceeds transcript length (${lines.length})`);
        }
      } catch (err) {
        errors.push(`Quote ${quote.id}: Failed to read transcript at ${transcriptPath}`);
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
      const quotes = (episode as any).quotes || [];
      const episodeSlug = (episode as any).slug || (episode as any).episode_slug;
      
      for (const quote of quotes) {
        if (quote.zones.includes(zone)) {
          episodeSlugs.add(episodeSlug);
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
  
  // Detect duplicate quotes (warnings only)
  detectDuplicateQuotes(quotes);
  console.log('✓ Duplicate quote check completed');
  
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
  
  // Show coverage stats
  const TOTAL_EPISODES = 303;
  const coveragePercent = ((registry.episodes.length / TOTAL_EPISODES) * 100).toFixed(1);
  console.log(`\n📊 Coverage Statistics:`);
  console.log(`   Episodes curated: ${registry.episodes.length}/${TOTAL_EPISODES} (${coveragePercent}%)`);
  console.log(`   Quotes extracted: ${registry.quotes.length}`);
  console.log(`   Avg quotes/episode: ${(registry.quotes.length / registry.episodes.length).toFixed(1)}`);
  
  // Show zone coverage gaps
  const minEpisodesPerZone = 10; // Target
  const underservedZones = Object.entries(zoneCounts)
    .filter(([_, count]) => count < minEpisodesPerZone)
    .sort((a, b) => a[1] - b[1]);
  
  if (underservedZones.length > 0) {
    console.log(`\n⚠️  Zones needing more coverage (target: ${minEpisodesPerZone}+ episodes):`);
    underservedZones.forEach(([zone, count]) => {
      console.log(`   - ${zone}: ${count} episodes (need ${minEpisodesPerZone - count} more)`);
    });
  }
  
  // Generate TypeScript constants
  const tsContent = `// Auto-generated by scripts/build-verified.ts
// DO NOT EDIT MANUALLY

export const VERIFIED_EPISODE_COUNT = ${episodes.length};
export const VERIFIED_QUOTE_COUNT = ${quotes.length};

export const ZONE_EPISODE_COUNTS = ${JSON.stringify(zoneCounts, null, 2)} as const;

export const VERIFIED_EPISODE_SLUGS = ${JSON.stringify(episodes.map(e => (e as any).slug || (e as any).episode_slug), null, 2)} as const;
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
