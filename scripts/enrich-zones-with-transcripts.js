const fs = require('fs');
const path = require('path');

/**
 * Zone Enrichment Script
 * 
 * This script validates and enriches the 8 PM philosophy zones with REAL data
 * from the 303 Lenny's Podcast transcripts.
 * 
 * GOALS:
 * 1. Find actual quotes from real guests that exemplify each zone's philosophy
 * 2. Verify guest associations are accurate based on their actual statements
 * 3. Calculate accurate episode counts for each zone
 * 4. Replace generic placeholders with real, grounded content
 * 
 * APPROACH:
 * - For each zone, search transcripts for statements matching that philosophy
 * - Extract real quotes with proper attribution, timestamps, and episodes
 * - Rank guests by how strongly they represent each zone
 * - Output enriched zone data with confidence scores
 */

// Zone philosophies to search for
const ZONE_PHILOSOPHIES = {
  velocity: {
    name: 'Velocity Nebula',
    keywords: ['ship fast', 'velocity', 'speed', 'iterate', 'move quickly', 'rapid', 'weekly releases', 'continuous deployment'],
    philosophyPatterns: [
      'speed compound',
      'ship every',
      'faster than',
      'velocity',
      'quick iteration',
      'move fast',
      'rapid development',
    ],
    contrastWith: ['polish', 'perfect', 'slow down', 'take time'],
  },
  perfection: {
    name: 'Perfection Peak',
    keywords: ['details', 'craft', 'polish', 'quality', 'perfection', 'attention to detail', 'obsess', 'sweat the details'],
    philosophyPatterns: [
      'in the details',
      'obsess',
      'craft',
      'polish',
      'quality',
      'perfect',
      'first impression',
      'attention to detail',
    ],
    contrastWith: ['ship fast', 'move quickly', 'good enough'],
  },
  discovery: {
    name: 'Discovery Station',
    keywords: ['user research', 'customer', 'interview', 'talk to users', 'validate', 'feedback', 'user testing'],
    philosophyPatterns: [
      'talk to customers',
      'user research',
      'customer interview',
      'validate',
      'test with users',
      'listen to',
      'learn from users',
    ],
    contrastWith: ['vision', 'intuition', 'gut'],
  },
  data: {
    name: 'Data Constellation',
    keywords: ['data', 'metrics', 'analytics', 'measure', 'A/B test', 'experiment', 'quantitative'],
    philosophyPatterns: [
      'data shows',
      'metrics',
      'measure',
      'experiment',
      'A/B test',
      'analytics',
      'numbers',
      'data-driven',
    ],
    contrastWith: ['gut', 'intuition', 'feeling'],
  },
  intuition: {
    name: 'Intuition Vortex',
    keywords: ['intuition', 'gut', 'instinct', 'vision', 'taste', 'conviction', 'feel'],
    philosophyPatterns: [
      'trust your gut',
      'intuition',
      'instinct',
      'taste',
      'vision',
      'conviction',
      'feel',
      'sense',
    ],
    contrastWith: ['data', 'metrics', 'test', 'validate'],
  },
  alignment: {
    name: 'Alignment Galaxy',
    keywords: ['alignment', 'stakeholder', 'buy-in', 'consensus', 'communicate', 'persuade', 'get everyone'],
    philosophyPatterns: [
      'get alignment',
      'stakeholder',
      'buy-in',
      'everyone aligned',
      'bring people along',
      'consensus',
      'persuade',
    ],
    contrastWith: ['move fast', 'just ship', 'ignore politics'],
  },
  chaos: {
    name: 'Chaos Cluster',
    keywords: ['chaos', 'uncertainty', 'adapt', 'flexible', 'pivot', 'embrace change', 'no plan'],
    philosophyPatterns: [
      'embrace chaos',
      'no plan',
      'adapt',
      'flexible',
      'uncertainty',
      'change constantly',
      'just start',
      'figure it out',
    ],
    contrastWith: ['plan', 'roadmap', 'structure', 'process'],
  },
  focus: {
    name: 'Focus Singularity',
    keywords: ['focus', 'say no', 'one thing', 'narrow', 'constraints', 'ruthless', 'prioritize'],
    philosophyPatterns: [
      'say no',
      'focus on one',
      'ruthless prioritization',
      'constraints',
      'narrow',
      'one thing',
      'do less',
    ],
    contrastWith: ['expand', 'try everything', 'broad'],
  },
};

// Load episodes
const episodesDir = path.join(__dirname, '../episodes');
const allEpisodeSlugs = fs.readdirSync(episodesDir).filter(f => {
  const stat = fs.statSync(path.join(episodesDir, f));
  return stat.isDirectory();
});

console.log(`📚 Loading ${allEpisodeSlugs.length} episodes...`);

/**
 * Parse transcript with metadata
 */
function parseTranscript(slug) {
  const transcriptPath = path.join(episodesDir, slug, 'transcript.md');
  if (!fs.existsSync(transcriptPath)) return null;
  
  const content = fs.readFileSync(transcriptPath, 'utf-8');
  
  // Extract YAML frontmatter
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!yamlMatch) return null;
  
  const yamlContent = yamlMatch[1];
  const metadata = {};
  
  // Parse guest and title
  const guestMatch = yamlContent.match(/guest:\s*["']?([^"'\n]+)["']?/);
  const titleMatch = yamlContent.match(/title:\s*["']?([^"'\n]+)["']?/);
  
  if (guestMatch) metadata.guest = guestMatch[1].trim();
  if (titleMatch) metadata.title = titleMatch[1].trim();
  
  // Get transcript content
  const transcriptContent = content.substring(yamlMatch[0].length).trim();
  
  return {
    slug,
    metadata,
    content: transcriptContent.toLowerCase(), // Lowercase for matching
    originalContent: transcriptContent, // Keep original for extraction
  };
}

/**
 * Find quotes that exemplify a zone's philosophy
 */
function findZoneQuotes(episode, zoneId, zonePhil) {
  const lines = episode.originalContent.split('\n');
  const matches = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Skip if line is too short or is a heading
    if (line.length < 50 || line.startsWith('#')) continue;
    
    // Check if line contains philosophy patterns
    let matchScore = 0;
    for (const pattern of zonePhil.philosophyPatterns) {
      if (lineLower.includes(pattern.toLowerCase())) {
        matchScore += 2;
      }
    }
    
    // Bonus for keywords
    for (const keyword of zonePhil.keywords) {
      if (lineLower.includes(keyword.toLowerCase())) {
        matchScore += 1;
      }
    }
    
    // Penalty for contrasting concepts
    for (const contrast of zonePhil.contrastWith) {
      if (lineLower.includes(contrast.toLowerCase())) {
        matchScore -= 1;
      }
    }
    
    if (matchScore >= 2) {
      // Extract speaker and timestamp
      const speakerMatch = line.match(/^([^:]+):\s*\((\d{2}:\d{2}:\d{2})\)/);
      if (speakerMatch) {
        const speaker = speakerMatch[1].trim();
        const timestamp = speakerMatch[2];
        const text = line.substring(speakerMatch[0].length).trim();
        
        // Get context (surrounding lines)
        const contextLines = [];
        for (let j = Math.max(0, i - 1); j <= Math.min(lines.length - 1, i + 1); j++) {
          contextLines.push(lines[j]);
        }
        
        matches.push({
          quote: text.substring(0, 300), // Limit length
          speaker,
          timestamp,
          context: contextLines.join(' ').substring(0, 500),
          episode: episode.slug,
          guest: episode.metadata.guest,
          title: episode.metadata.title,
          matchScore,
        });
      }
    }
  }
  
  return matches;
}

/**
 * Main enrichment process
 */
async function main() {
  console.log('\n=== PM Philosophy Zone Enrichment ===\n');
  
  const zoneEnrichment = {};
  
  // Process each zone
  for (const [zoneId, zonePhil] of Object.entries(ZONE_PHILOSOPHIES)) {
    console.log(`\n🎯 Analyzing: ${zonePhil.name}`);
    console.log(`Keywords: ${zonePhil.keywords.slice(0, 5).join(', ')}...`);
    
    const allQuotes = [];
    const guestScores = {}; // Track which guests best represent this zone
    
    // Search all episodes
    for (const slug of allEpisodeSlugs) {
      const episode = parseTranscript(slug);
      if (!episode) continue;
      
      const quotes = findZoneQuotes(episode, zoneId, zonePhil);
      
      if (quotes.length > 0) {
        allQuotes.push(...quotes);
        
        // Track guest representation
        const guestName = episode.metadata.guest;
        if (!guestScores[guestName]) {
          guestScores[guestName] = {
            guest: guestName,
            slug: episode.slug,
            quoteCount: 0,
            totalScore: 0,
          };
        }
        guestScores[guestName].quoteCount += quotes.length;
        guestScores[guestName].totalScore += quotes.reduce((sum, q) => sum + q.matchScore, 0);
      }
    }
    
    // Sort quotes by match score
    allQuotes.sort((a, b) => b.matchScore - a.matchScore);
    
    // Sort guests by representation
    const topGuests = Object.values(guestScores)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
    
    console.log(`✓ Found ${allQuotes.length} matching quotes`);
    console.log(`✓ ${topGuests.length} guests strongly represent this zone`);
    
    // Calculate episode count (episodes with at least 2 relevant quotes)
    const episodesBySlug = {};
    for (const quote of allQuotes) {
      if (!episodesBySlug[quote.episode]) {
        episodesBySlug[quote.episode] = 0;
      }
      episodesBySlug[quote.episode]++;
    }
    const relevantEpisodeCount = Object.values(episodesBySlug).filter(count => count >= 2).length;
    
    zoneEnrichment[zoneId] = {
      zoneId,
      zoneName: zonePhil.name,
      topQuotes: allQuotes.slice(0, 5), // Top 5 quotes
      topGuests: topGuests.slice(0, 5), // Top 5 guests
      relevantEpisodeCount,
      totalQuotes: allQuotes.length,
    };
  }
  
  // Save enrichment data
  const outputPath = path.join(__dirname, '../data/zone-enrichment.json');
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(zoneEnrichment, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ Zone enrichment data saved to ${outputPath}`);
  console.log('\n📊 SUMMARY:');
  for (const [zoneId, data] of Object.entries(zoneEnrichment)) {
    console.log(`\n${data.zoneName}:`);
    console.log(`  - ${data.totalQuotes} total quotes found`);
    console.log(`  - ${data.relevantEpisodeCount} episodes cover this zone`);
    console.log(`  - Top guest: ${data.topGuests[0]?.guest || 'N/A'}`);
  }
  
  console.log('\n📝 NEXT STEPS:');
  console.log('1. Review data/zone-enrichment.json');
  console.log('2. Replace generic quotes in lib/zones.ts with real quotes');
  console.log('3. Update associatedGuests with verified top guests');
  console.log('4. Update episodeCount with calculated values');
  console.log('5. Ensure all quotes have proper episode attribution');
}

main().catch(console.error);
