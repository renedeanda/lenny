const fs = require('fs');
const path = require('path');

/**
 * AI Contradiction Extraction Script
 * 
 * This script analyzes all 303 Lenny's Podcast transcripts to identify
 * genuine contradictory viewpoints between guests on product management topics.
 * 
 * REQUIREMENTS:
 * - Claude API key in ANTHROPIC_API_KEY environment variable
 * - OR manual review process using extracted candidates
 * 
 * APPROACH:
 * 1. Define key PM topics/themes to search for contradictions
 * 2. For each topic, find relevant episodes using keyword matching
 * 3. Extract viewpoints from those episodes
 * 4. Use AI to identify genuine contradictions
 * 5. Generate structured data with proper quotes, timestamps, and context
 */

// Key PM topics to search for contradictions
const PM_TOPICS = [
  {
    id: 'planning',
    name: 'Planning vs Execution',
    keywords: ['roadmap', 'planning', 'strategy', 'execution', 'ship', 'iterate'],
  },
  {
    id: 'data',
    name: 'Data vs Intuition',
    keywords: ['data', 'metrics', 'analytics', 'intuition', 'gut', 'instinct', 'qualitative'],
  },
  {
    id: 'speed',
    name: 'Speed vs Quality',
    keywords: ['fast', 'quick', 'velocity', 'speed', 'quality', 'polish', 'craft', 'details'],
  },
  {
    id: 'users',
    name: 'User Research vs Vision',
    keywords: ['user research', 'customer', 'interview', 'vision', 'conviction', 'opinionated'],
  },
  {
    id: 'leadership',
    name: 'Leadership Style',
    keywords: ['micromanage', 'delegate', 'empower', 'trust', 'details', 'hands-on', 'autonomous'],
  },
  {
    id: 'growth',
    name: 'Growth Tactics',
    keywords: ['growth', 'viral', 'organic', 'paid', 'acquisition', 'retention', 'activation'],
  },
  {
    id: 'product',
    name: 'Product Development',
    keywords: ['feature', 'MVP', 'prototype', 'beta', 'launch', 'iteration', 'experiment'],
  },
  {
    id: 'team',
    name: 'Team Structure',
    keywords: ['team', 'hire', 'organization', 'structure', 'culture', 'cross-functional'],
  },
];

// Load all episodes
const episodesDir = path.join(__dirname, '../episodes');
const allEpisodeSlugs = fs.readdirSync(episodesDir).filter(f => {
  const stat = fs.statSync(path.join(episodesDir, f));
  return stat.isDirectory();
});

console.log(`Found ${allEpisodeSlugs.length} episodes`);

/**
 * Extract metadata and content from transcript
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
  
  // Parse key fields
  const guestMatch = yamlContent.match(/guest:\s*["']?([^"'\n]+)["']?/);
  const titleMatch = yamlContent.match(/title:\s*["']?([^"'\n]+)["']?/);
  const keywordsMatch = yamlContent.match(/keywords:\s*\[([\s\S]*?)\]/);
  
  if (guestMatch) metadata.guest = guestMatch[1].trim();
  if (titleMatch) metadata.title = titleMatch[1].trim();
  if (keywordsMatch) {
    metadata.keywords = keywordsMatch[1]
      .split(',')
      .map(k => k.trim().replace(/['"]/g, ''))
      .filter(k => k.length > 0);
  }
  
  // Extract transcript content (after frontmatter)
  const transcriptContent = content.substring(yamlMatch[0].length).trim();
  
  return {
    slug,
    metadata,
    content: transcriptContent,
  };
}

/**
 * Find episodes relevant to a topic based on keywords
 */
function findRelevantEpisodes(topic, maxEpisodes = 20) {
  const relevantEpisodes = [];
  
  for (const slug of allEpisodeSlugs) {
    const episode = parseTranscript(slug);
    if (!episode) continue;
    
    const episodeKeywords = episode.metadata.keywords || [];
    const content = episode.content.toLowerCase();
    
    // Check if any topic keywords appear in episode keywords or content
    let relevanceScore = 0;
    for (const keyword of topic.keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Higher score for keyword matches
      if (episodeKeywords.some(k => k.toLowerCase().includes(keywordLower))) {
        relevanceScore += 3;
      }
      
      // Lower score for content matches
      if (content.includes(keywordLower)) {
        relevanceScore += 1;
      }
    }
    
    if (relevanceScore > 0) {
      relevantEpisodes.push({
        ...episode,
        relevanceScore,
      });
    }
  }
  
  // Sort by relevance and return top episodes
  return relevantEpisodes
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxEpisodes);
}

/**
 * Extract strong viewpoints from transcript content
 */
function extractViewpoints(episode, topic) {
  const content = episode.content;
  const lines = content.split('\n');
  const viewpoints = [];
  
  // Look for strong statements that might indicate a viewpoint
  const strongIndicators = [
    'I think',
    'I believe',
    'My philosophy',
    'The key is',
    'You have to',
    'You need to',
    'You should',
    'You must',
    'The best',
    'The worst',
    'Always',
    'Never',
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Check if line contains topic keywords and strong indicators
    const hasTopicKeyword = topic.keywords.some(k => 
      lineLower.includes(k.toLowerCase())
    );
    const hasStrongIndicator = strongIndicators.some(ind =>
      lineLower.includes(ind.toLowerCase())
    );
    
    if (hasTopicKeyword && hasStrongIndicator && line.length > 50) {
      // Extract speaker and timestamp
      const speakerMatch = line.match(/^([^:]+):\s*\[(\d{2}:\d{2}:\d{2})\]/);
      if (speakerMatch) {
        const speaker = speakerMatch[1].trim();
        const timestamp = speakerMatch[2];
        const text = line.substring(speakerMatch[0].length).trim();
        
        // Get context (previous and next lines)
        const context = [
          i > 0 ? lines[i - 1] : '',
          line,
          i < lines.length - 1 ? lines[i + 1] : '',
        ].join(' ').substring(0, 500);
        
        viewpoints.push({
          speaker,
          timestamp,
          text,
          context,
          episode: episode.slug,
          guest: episode.metadata.guest,
        });
      }
    }
  }
  
  return viewpoints;
}

/**
 * Main extraction process
 */
async function main() {
  console.log('\\n=== PM Philosophy Contradiction Extraction ===\\n');
  
  const allCandidates = [];
  
  for (const topic of PM_TOPICS) {
    console.log(`\\n📊 Topic: ${topic.name}`);
    console.log(`Keywords: ${topic.keywords.join(', ')}`);
    
    // Find relevant episodes
    const relevantEpisodes = findRelevantEpisodes(topic, 15);
    console.log(`Found ${relevantEpisodes.length} relevant episodes`);
    
    // Extract viewpoints from each episode
    const topicViewpoints = [];
    for (const episode of relevantEpisodes) {
      const viewpoints = extractViewpoints(episode, topic);
      topicViewpoints.push(...viewpoints);
    }
    
    console.log(`Extracted ${topicViewpoints.length} potential viewpoints`);
    
    if (topicViewpoints.length >= 2) {
      allCandidates.push({
        topic,
        viewpoints: topicViewpoints.slice(0, 20), // Top 20 viewpoints
      });
    }
  }
  
  // Save candidates to file for manual review
  const outputPath = path.join(__dirname, '../data/contradiction-candidates.json');
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(allCandidates, null, 2),
    'utf-8'
  );
  
  console.log(`\\n✅ Saved ${allCandidates.length} topic candidates to ${outputPath}`);
  console.log('\\n📝 NEXT STEPS:');
  console.log('1. Review contradiction-candidates.json manually');
  console.log('2. Identify pairs of genuinely contradictory viewpoints');
  console.log('3. Extract clean quotes and verify timestamps');
  console.log('4. Add to lib/contradictions.ts with proper structure');
  console.log('\\n💡 TIP: Look for viewpoints that:');
  console.log('   - Make opposite claims on the same topic');
  console.log('   - Come from different guests with strong reputations');
  console.log('   - Have clear, quotable statements (100-200 chars)');
  console.log('   - Include specific examples or reasoning');
}

main().catch(console.error);
