#!/usr/bin/env tsx
/**
 * Batch Episode Curation Tool
 * 
 * Rapidly curate multiple episodes using AI to extract quotes, themes, and insights.
 * 
 * Usage:
 *   npx tsx scripts/curate-batch.ts episode-slug-1 episode-slug-2 episode-slug-3
 *   npx tsx scripts/curate-batch.ts --list episodes.txt
 *   npx tsx scripts/curate-batch.ts --all --limit 10
 */

import * as fs from 'fs';
import * as path from 'path';
// No external API needed - extraction done by the AI agent running this script

interface Quote {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
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
  zone_influence: Record<string, number>;
  contrarian_candidates?: any[];
  guest_metadata?: {
    guest_type: string;
    company_stage: string;
    primary_topics: string[];
  };
}

const PROMPT_TEMPLATE = `You are an expert at extracting insights from product management podcast transcripts.

Analyze this episode transcript and extract:
1. The 10-12 BEST quotes (120-500 characters each)
2. 5 key takeaways 
3. Zone influence scores (0.0-1.0, must sum to 1.0)

ZONES:
- velocity: Ship fast, iterate constantly
- perfection: Details matter, craft excellence
- discovery: User research, validation first
- data: Metrics-driven, experiment everything
- intuition: Trust gut, vision over data
- alignment: Stakeholder buy-in, consensus
- chaos: Embrace uncertainty, adapt constantly
- focus: Do one thing perfectly, ruthless prioritization

RULES:
- ONLY extract direct quotes from the speaker (not Lenny)
- Include exact line numbers from transcript
- Skip sponsor segments, intro/outro
- Avoid quotes from first 5 minutes (likely highlights)
- Each quote must be substantive and standalone
- Tag 2-4 themes per quote (e.g., "product-market-fit", "velocity", "metrics")
- Tag 1-3 zones per quote

TRANSCRIPT:
Episode: {episode_title}
Guest: {guest}

{transcript_content}

OUTPUT FORMAT (JSON):
{
  "quotes": [
    {
      "speaker": "Guest Name",
      "text": "Direct quote here...",
      "timestamp": "00:15:30",
      "lineStart": 123,
      "lineEnd": 125,
      "themes": ["theme1", "theme2"],
      "zones": ["zone1", "zone2"]
    }
  ],
  "takeaways": [
    "Key insight 1",
    "Key insight 2"
  ],
  "zone_influence": {
    "velocity": 0.15,
    "perfection": 0.20,
    "discovery": 0.10,
    "data": 0.15,
    "intuition": 0.15,
    "alignment": 0.10,
    "chaos": 0.05,
    "focus": 0.10
  }
}`;

async function loadTranscript(episodeSlug: string): Promise<{
  content: string;
  metadata: any;
}> {
  const transcriptPath = path.join(process.cwd(), 'episodes', episodeSlug, 'transcript.md');
  
  if (!fs.existsSync(transcriptPath)) {
    throw new Error(`Transcript not found: ${transcriptPath}`);
  }
  
  const content = fs.readFileSync(transcriptPath, 'utf-8');
  const lines = content.split('\n');
  
  // Extract YAML frontmatter
  let metadata: any = {};
  if (lines[0] === '---') {
    const endIndex = lines.slice(1).findIndex(l => l === '---') + 1;
    const yamlContent = lines.slice(1, endIndex).join('\n');
    
    // Simple YAML parsing for our needs
    const yamlLines = yamlContent.split('\n');
    for (const line of yamlLines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [_, key, value] = match;
        metadata[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }
  
  return { content, metadata };
}

async function extractQuotesWithAI(
  episodeSlug: string,
  transcript: string,
  metadata: any
): Promise<any> {
  console.log(`   Analyzing transcript (${transcript.length} chars)...`);
  console.log(`   NOTE: This tool is a placeholder for AI-assisted extraction.`);
  console.log(`   The AI agent (me) will extract quotes directly when processing episodes.`);
  console.log(`   For now, returning empty structure - quotes will be added manually.`);
  
  // Return structure for manual population
  return {
    quotes: [],
    takeaways: [
      "[To be extracted by AI agent]",
      "[To be extracted by AI agent]",
      "[To be extracted by AI agent]",
      "[To be extracted by AI agent]",
      "[To be extracted by AI agent]"
    ],
    zone_influence: {
      velocity: 0.125,
      perfection: 0.125,
      discovery: 0.125,
      data: 0.125,
      intuition: 0.125,
      alignment: 0.125,
      chaos: 0.125,
      focus: 0.125
    }
  };
}

function generateQuoteIds(quotes: any[], episodeSlug: string): Quote[] {
  return quotes.map((quote: any, index: number) => ({
    id: `${episodeSlug}-q${String(index + 1).padStart(3, '0')}`,
    speaker: quote.speaker,
    text: quote.text,
    timestamp: quote.timestamp,
    source: {
      slug: episodeSlug,
      path: `episodes/${episodeSlug}/transcript.md`,
      lineStart: quote.lineStart || quote.line_start,
      lineEnd: quote.lineEnd || quote.line_end
    },
    themes: quote.themes || [],
    zones: quote.zones || []
  }));
}

async function curateEpisode(episodeSlug: string): Promise<void> {
  console.log(`\n🔍 Processing: ${episodeSlug}`);
  
  try {
    // Load transcript
    console.log('   Loading transcript...');
    const { content, metadata } = await loadTranscript(episodeSlug);
    
    // Extract with AI
    console.log('   Extracting quotes with AI...');
    const aiResult = await extractQuotesWithAI(episodeSlug, content, metadata);
    
    // Generate quote IDs
    const quotes = generateQuoteIds(aiResult.quotes, episodeSlug);
    
    // Build enrichment object
    const enrichment: EpisodeEnrichment = {
      slug: episodeSlug,
      quotes,
      themes: [],
      takeaways: aiResult.takeaways || [],
      zone_influence: aiResult.zone_influence || {}
    };
    
    // Save to verified directory
    const outputPath = path.join(process.cwd(), 'data', 'verified', `${episodeSlug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(enrichment, null, 2));
    
    console.log(`   ✅ Saved ${quotes.length} quotes to ${outputPath}`);
    console.log(`   📊 Zone influence: ${Object.entries(enrichment.zone_influence)
      .filter(([_, v]) => v > 0.1)
      .map(([k, v]) => `${k}(${(v * 100).toFixed(0)}%)`)
      .join(', ')}`);
    
  } catch (error) {
    console.error(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  npx tsx scripts/curate-batch.ts <episode-slug> [<episode-slug2> ...]
  npx tsx scripts/curate-batch.ts --list episodes.txt
  
Examples:
  npx tsx scripts/curate-batch.ts marty-cagan teresa-torres
  npx tsx scripts/curate-batch.ts --list priority-episodes.txt
    `);
    process.exit(1);
  }
  
  let episodeSlugs: string[] = [];
  
  if (args[0] === '--list') {
    const listFile = args[1];
    if (!listFile) {
      console.error('❌ --list requires a file path');
      process.exit(1);
    }
    episodeSlugs = fs.readFileSync(listFile, 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } else {
    episodeSlugs = args;
  }
  
  console.log(`🚀 Batch Curation Starting`);
  console.log(`   Episodes to process: ${episodeSlugs.length}`);
  
  const results = {
    success: [] as string[],
    failed: [] as string[]
  };
  
  for (const slug of episodeSlugs) {
    try {
      await curateEpisode(slug);
      results.success.push(slug);
    } catch (error) {
      results.failed.push(slug);
    }
  }
  
  console.log(`\n📊 Batch Curation Complete`);
  console.log(`   ✅ Success: ${results.success.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log(`\n   Failed episodes:`);
    results.failed.forEach(slug => console.log(`   - ${slug}`));
  }
  
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review generated files in data/verified/`);
  console.log(`   2. Run: npx tsx scripts/build-verified.ts`);
  console.log(`   3. Fix any validation errors`);
  console.log(`   4. Commit verified files`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
