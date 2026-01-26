#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Parse all 295 episode transcripts from the episodes directory
 * Extract comprehensive data including metadata, quotes, timestamps
 */

function getAllEpisodeDirectories() {
  const episodesDir = path.join(__dirname, '../episodes');
  const entries = fs.readdirSync(episodesDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(episodesDir, entry.name));
}

function parseTranscript(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: metadata, content: transcript } = matter(content);

  // Extract dialogue entries
  // Match both speaker patterns like "Lenny Rachitsky (00:00:00):" and continuation timestamps like "(00:01:27):"
  const speakerPattern = /^(.+?)\s+\((\d{1,2}:\d{2}:\d{2})\):/gm;
  const continuationPattern = /^\((\d{1,2}:\d{2}:\d{2})\):/gm;

  const matches = [];
  let match;

  // First, collect all speaker matches
  while ((match = speakerPattern.exec(transcript)) !== null) {
    matches.push({
      speaker: match[1].trim(),
      timestamp: match[2],
      index: match.index,
      isContinuation: false
    });
  }

  // Then, collect continuation timestamp matches
  while ((match = continuationPattern.exec(transcript)) !== null) {
    // Only add if this isn't already captured by speakerPattern
    const alreadyMatched = matches.some(m => m.index === match.index);
    if (!alreadyMatched) {
      matches.push({
        speaker: null, // Will inherit from previous section
        timestamp: match[1],
        index: match.index,
        isContinuation: true
      });
    }
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Extract text between matches
  const dialogue = [];
  let currentSpeaker = '';

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    // Update current speaker if this is not a continuation
    if (!current.isContinuation && current.speaker) {
      currentSpeaker = current.speaker;
    }

    const startIndex = current.index + transcript.substring(current.index).indexOf(':') + 1;
    const endIndex = next ? next.index : transcript.length;

    let text = transcript.substring(startIndex, endIndex).trim();

    // Remove duplicate timestamp at the beginning of text
    text = text.replace(/^\d{2}:\d{2}\):\s*/, '');

    // Only add if there's actual text content
    if (text && text.length > 0) {
      dialogue.push({
        speaker: current.isContinuation ? currentSpeaker : (current.speaker || currentSpeaker),
        timestamp: current.timestamp,
        text: text
      });
    }
  }

  return {
    metadata,
    dialogue,
    transcriptLength: dialogue.length
  };
}

function extractKeyQuotes(dialogue, minLength = 100, maxLength = 500) {
  // Simple heuristic: longer statements are likely more substantive
  return dialogue
    .filter(d => {
      const length = d.text.length;
      return length >= minLength && length <= maxLength;
    })
    .map(d => ({
      speaker: d.speaker,
      timestamp: d.timestamp,
      quote: d.text,
      length: d.text.length
    }));
}

function detectContrarianPatterns(dialogue) {
  // Look for contrarian/debate indicators
  const indicators = [
    'disagree',
    'actually',
    'but',
    'however',
    'on the other hand',
    'i think differently',
    'not necessarily',
    'i would argue',
    'pushback'
  ];

  return dialogue.filter(d => {
    const lower = d.text.toLowerCase();
    return indicators.some(indicator => lower.includes(indicator));
  });
}

function processAllEpisodes() {
  const episodeDirs = getAllEpisodeDirectories();
  console.log(`Found ${episodeDirs.length} episode directories`);

  const allEpisodes = [];
  let successCount = 0;
  let errorCount = 0;

  for (const dir of episodeDirs) {
    const transcriptPath = path.join(dir, 'transcript.md');

    if (!fs.existsSync(transcriptPath)) {
      console.warn(`⚠️  Missing transcript: ${dir}`);
      errorCount++;
      continue;
    }

    try {
      const parsed = parseTranscript(transcriptPath);
      const slug = path.basename(dir);

      // Extract key quotes
      const quotes = extractKeyQuotes(parsed.dialogue);
      const contrarian = detectContrarianPatterns(parsed.dialogue);

      // Handle view_count - convert "n/a" to null
      const rawViewCount = parsed.metadata.view_count;
      const viewCount = (rawViewCount && rawViewCount !== 'n/a' && typeof rawViewCount === 'number')
        ? rawViewCount
        : null;

      const episode = {
        slug,
        guest: parsed.metadata.guest || 'Unknown',
        title: parsed.metadata.title || '',
        publishDate: parsed.metadata.publish_date || null,
        duration: parsed.metadata.duration || null,
        durationSeconds: parsed.metadata.duration_seconds || null,
        viewCount: viewCount,
        youtubeUrl: parsed.metadata.youtube_url || null,
        videoId: parsed.metadata.video_id || null,
        description: parsed.metadata.description || '',
        keywords: parsed.metadata.keywords || [],
        dialogueCount: parsed.transcriptLength,
        keyQuotesCount: quotes.length,
        contrarianCount: contrarian.length,
        // Store sample quotes (limit to avoid huge file)
        sampleQuotes: quotes.slice(0, 10),
        sampleContrarian: contrarian.slice(0, 5)
      };

      allEpisodes.push(episode);
      successCount++;

      if (successCount % 50 === 0) {
        console.log(`Processed ${successCount} episodes...`);
      }

    } catch (error) {
      console.error(`❌ Error parsing ${dir}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Successfully parsed: ${successCount} episodes`);
  console.log(`❌ Errors: ${errorCount} episodes`);

  return allEpisodes;
}

function generateTypeScriptFile(episodes) {
  const sorted = episodes.sort((a, b) => {
    if (!a.publishDate || !b.publishDate) return 0;
    return new Date(b.publishDate) - new Date(a.publishDate);
  });

  const ts = `// All 295 episode transcripts - COMPREHENSIVELY PARSED
// Auto-generated by scripts/parse-all-episodes.js
// DO NOT EDIT MANUALLY

export interface Episode {
  slug: string;
  guest: string;
  title: string;
  publishDate: string | null;
  duration: string | null;
  durationSeconds: number | null;
  viewCount: number | null;
  youtubeUrl: string | null;
  videoId: string | null;
  description: string;
  keywords: string[];
  dialogueCount: number;
  keyQuotesCount: number;
  contrarianCount: number;
  sampleQuotes?: Array<{
    speaker: string;
    timestamp: string;
    quote: string;
    length: number;
  }>;
  sampleContrarian?: Array<{
    speaker: string;
    timestamp: string;
    text: string;
  }>;
}

export const allEpisodes: Episode[] = ${JSON.stringify(sorted, null, 2)};

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return allEpisodes.find(ep => ep.slug === slug);
}

export function getEpisodesByGuest(guest: string): Episode[] {
  return allEpisodes.filter(ep =>
    ep.guest.toLowerCase().includes(guest.toLowerCase())
  );
}

export function getAllKeywords(): string[] {
  const keywordSet = new Set<string>();
  allEpisodes.forEach(ep => {
    ep.keywords.forEach(kw => keywordSet.add(kw));
  });
  return Array.from(keywordSet).sort();
}

export function searchEpisodes(query: string, filters: {
  keywords?: string[];
  dateRange?: { start: string; end: string };
  minDuration?: number;
  minViews?: number;
} = {}): Episode[] {
  const lowerQuery = query.toLowerCase().trim();

  return allEpisodes.filter(episode => {
    // Text search
    const matchesQuery = !lowerQuery || (
      episode.guest.toLowerCase().includes(lowerQuery) ||
      episode.title.toLowerCase().includes(lowerQuery) ||
      episode.description.toLowerCase().includes(lowerQuery) ||
      episode.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
    );

    if (!matchesQuery) return false;

    // Keyword filter
    if (filters.keywords && filters.keywords.length > 0) {
      const hasKeyword = filters.keywords.some(kw =>
        episode.keywords.some(epKw => epKw.toLowerCase() === kw.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    // Date range filter
    if (filters.dateRange && episode.publishDate) {
      const pubDate = new Date(episode.publishDate);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      if (pubDate < start || pubDate > end) return false;
    }

    // Duration filter
    if (filters.minDuration && episode.durationSeconds) {
      if (episode.durationSeconds < filters.minDuration) return false;
    }

    // View count filter
    if (filters.minViews && episode.viewCount) {
      if (episode.viewCount < filters.minViews) return false;
    }

    return true;
  });
}

export type SortOption = 'date-desc' | 'date-asc' | 'views-desc' | 'guest-asc' | 'duration-desc';

export function sortEpisodes(episodes: Episode[], sortBy: SortOption): Episode[] {
  const sorted = [...episodes];

  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => {
        if (!a.publishDate || !b.publishDate) return 0;
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
    case 'date-asc':
      return sorted.sort((a, b) => {
        if (!a.publishDate || !b.publishDate) return 0;
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      });
    case 'views-desc':
      return sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    case 'duration-desc':
      return sorted.sort((a, b) => (b.durationSeconds || 0) - (a.durationSeconds || 0));
    case 'guest-asc':
      return sorted.sort((a, b) => a.guest.localeCompare(b.guest));
    default:
      return sorted;
  }
}

// Stats
export const episodeStats = {
  total: allEpisodes.length,
  totalDialogue: allEpisodes.reduce((sum, ep) => sum + ep.dialogueCount, 0),
  totalKeyQuotes: allEpisodes.reduce((sum, ep) => sum + ep.keyQuotesCount, 0),
  totalContrarian: allEpisodes.reduce((sum, ep) => sum + ep.contrarianCount, 0),
  uniqueKeywords: getAllKeywords().length,
  avgDialoguePerEpisode: Math.round(
    allEpisodes.reduce((sum, ep) => sum + ep.dialogueCount, 0) / allEpisodes.length
  ),
};
`;

  const outputPath = path.join(__dirname, '../lib/allEpisodes.ts');
  fs.writeFileSync(outputPath, ts, 'utf-8');

  return outputPath;
}

function generateStats(episodes) {
  const totalDialogue = episodes.reduce((sum, ep) => sum + ep.dialogueCount, 0);
  const totalKeyQuotes = episodes.reduce((sum, ep) => sum + ep.keyQuotesCount, 0);
  const totalContrarian = episodes.reduce((sum, ep) => sum + ep.contrarianCount, 0);

  const allKeywords = new Set();
  episodes.forEach(ep => ep.keywords.forEach(kw => allKeywords.add(kw)));

  console.log('\n📊 COMPREHENSIVE STATS:');
  console.log('==================');
  console.log(`Total Episodes: ${episodes.length}`);
  console.log(`Total Dialogue Entries: ${totalDialogue.toLocaleString()}`);
  console.log(`Total Key Quotes: ${totalKeyQuotes.toLocaleString()}`);
  console.log(`Total Contrarian Statements: ${totalContrarian.toLocaleString()}`);
  console.log(`Unique Keywords: ${allKeywords.size}`);
  console.log(`Avg Dialogue per Episode: ${Math.round(totalDialogue / episodes.length)}`);
  console.log(`Avg Key Quotes per Episode: ${Math.round(totalKeyQuotes / episodes.length)}`);
}

// Main execution
try {
  console.log('🚀 Parsing all 295 episode transcripts...\n');

  const episodes = processAllEpisodes();

  if (episodes.length === 0) {
    console.error('❌ No episodes parsed successfully');
    process.exit(1);
  }

  console.log('\n📝 Generating TypeScript file...');
  const outputPath = generateTypeScriptFile(episodes);
  console.log(`✅ Generated: ${outputPath}`);

  generateStats(episodes);

  console.log('\n🎉 COMPLETE! All episodes parsed and ready to use.');

} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}
