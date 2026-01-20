#!/usr/bin/env node
/**
 * scripts/propose-quotes.ts
 * 
 * Reads a transcript file and proposes candidate quotes for manual curation.
 * Outputs to data/candidates/{slug}.json
 * 
 * Usage: npm run propose-quotes -- brian-chesky
 */

import fs from 'fs';
import path from 'path';

interface Candidate {
  id: string;
  speaker: string;
  text: string;
  timestamp?: string;
  lineStart: number;
  lineEnd: number;
  lengthChars: number;
  suggestedThemes: string[];
  suggestedZones: string[];
}

interface TranscriptLine {
  lineNum: number;
  speaker?: string;
  timestamp?: string;
  text: string;
}

const SPONSOR_PATTERNS = [
  /this episode is brought to you by/i,
  /today's episode is brought/i,
  /if you enjoy this podcast/i,
  /don't forget to subscribe/i,
  /head on over to lenny/i,
  /get \$\d+ off at/i,
  /check it out at/i,
  /visit.*\.com/i,
];

const THEME_KEYWORDS = {
  leadership: ['leader', 'ceo', 'founder', 'manage', 'delegate', 'empower', 'team', 'hire'],
  product: ['product', 'feature', 'build', 'ship', 'roadmap', 'priorit', 'design'],
  growth: ['growth', 'scale', 'metric', 'experiment', 'conversion', 'retention'],
  strategy: ['strategy', 'vision', 'mission', 'compete', 'market', 'position'],
  culture: ['culture', 'value', 'principle', 'trust', 'alignment', 'collaboration'],
  velocity: ['speed', 'fast', 'ship', 'iterate', 'velocity', 'momentum'],
  quality: ['quality', 'detail', 'polish', 'craft', 'excellence', 'perfect'],
  data: ['data', 'metric', 'measure', 'analyt', 'experiment', 'test'],
  intuition: ['intuition', 'gut', 'instinct', 'taste', 'conviction', 'vision'],
  users: ['user', 'customer', 'research', 'feedback', 'interview', 'talk to'],
};

const ZONE_KEYWORDS = {
  velocity: ['ship fast', 'iterate', 'speed compounds', 'velocity', 'move quickly'],
  perfection: ['detail', 'polish', 'craft', 'perfect', 'quality', 'excellence'],
  discovery: ['user research', 'customer', 'talk to users', 'validate', 'feedback'],
  data: ['data', 'metric', 'measure', 'experiment', 'analytics', 'test'],
  intuition: ['gut', 'intuition', 'taste', 'vision', 'conviction', 'instinct'],
  alignment: ['alignment', 'stakeholder', 'consensus', 'buy-in', 'bring along'],
  chaos: ['chaos', 'uncertainty', 'adapt', 'pivot', 'experiment', 'try things'],
  focus: ['focus', 'ruthless', 'priorit', 'say no', 'constraint', 'one thing'],
};

function isSponsorContent(text: string): boolean {
  return SPONSOR_PATTERNS.some(pattern => pattern.test(text));
}

function suggestThemes(text: string): string[] {
  const lowerText = text.toLowerCase();
  const themes: string[] = [];
  
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      themes.push(theme);
    }
  }
  
  return themes;
}

function suggestZones(text: string): string[] {
  const lowerText = text.toLowerCase();
  const zones: string[] = [];
  
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      zones.push(zone);
    }
  }
  
  return zones;
}

function parseTranscript(filePath: string): TranscriptLine[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const transcriptLines: TranscriptLine[] = [];
  let inTranscript = false;
  let currentSpeaker: string | undefined;
  let currentTimestamp: string | undefined;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Start parsing after the transcript header
    if (line.includes('## Transcript')) {
      inTranscript = true;
      continue;
    }
    
    if (!inTranscript) continue;
    
    // Parse speaker + timestamp lines like: "Brian Chesky (00:00:00):"
    const speakerMatch = line.match(/^(.+?)\s+\((\d{2}:\d{2}:\d{2})\):/);
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1].trim();
      currentTimestamp = speakerMatch[2];
      continue;
    }
    
    // Collect actual content lines
    if (line.trim() && currentSpeaker) {
      transcriptLines.push({
        lineNum: i + 1,
        speaker: currentSpeaker,
        timestamp: currentTimestamp,
        text: line.trim(),
      });
    }
  }
  
  return transcriptLines;
}

function extractCandidates(lines: TranscriptLine[], slug: string): Candidate[] {
  const candidates: Candidate[] = [];
  let candidateId = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip short lines
    if (line.text.length < 120) continue;
    
    // Skip sponsor content
    if (isSponsorContent(line.text)) continue;
    
    // Skip if speaker is not the guest (heuristic: Lenny is usually asking questions)
    if (line.speaker?.toLowerCase().includes('lenny')) continue;
    
    // Single-line quote
    if (line.text.length >= 120 && line.text.length <= 400) {
      candidates.push({
        id: `${slug}-q${String(candidateId++).padStart(3, '0')}`,
        speaker: line.speaker || 'Unknown',
        text: line.text,
        timestamp: line.timestamp,
        lineStart: line.lineNum,
        lineEnd: line.lineNum,
        lengthChars: line.text.length,
        suggestedThemes: suggestThemes(line.text),
        suggestedZones: suggestZones(line.text),
      });
    }
    
    // Multi-line quote (combine up to 3 consecutive lines from same speaker)
    if (i + 1 < lines.length && lines[i + 1].speaker === line.speaker) {
      const combined = [line.text];
      let j = i + 1;
      
      while (j < lines.length && j < i + 3 && lines[j].speaker === line.speaker) {
        combined.push(lines[j].text);
        j++;
      }
      
      const fullText = combined.join(' ');
      if (fullText.length >= 150 && fullText.length <= 500) {
        candidates.push({
          id: `${slug}-q${String(candidateId++).padStart(3, '0')}`,
          speaker: line.speaker || 'Unknown',
          text: fullText,
          timestamp: line.timestamp,
          lineStart: line.lineNum,
          lineEnd: lines[j - 1].lineNum,
          lengthChars: fullText.length,
          suggestedThemes: suggestThemes(fullText),
          suggestedZones: suggestZones(fullText),
        });
      }
    }
  }
  
  return candidates;
}

function main() {
  const slug = process.argv[2];
  
  if (!slug) {
    console.error('Usage: npm run propose-quotes -- <episode-slug>');
    process.exit(1);
  }
  
  const transcriptPath = path.join(process.cwd(), 'episodes', slug, 'transcript.md');
  
  if (!fs.existsSync(transcriptPath)) {
    console.error(`Transcript not found: ${transcriptPath}`);
    process.exit(1);
  }
  
  console.log(`Parsing transcript: ${transcriptPath}`);
  const lines = parseTranscript(transcriptPath);
  console.log(`Parsed ${lines.length} lines`);
  
  const candidates = extractCandidates(lines, slug);
  console.log(`Extracted ${candidates.length} candidate quotes`);
  
  // Sort by length and theme relevance
  candidates.sort((a, b) => {
    const scoreA = a.suggestedThemes.length + a.suggestedZones.length;
    const scoreB = b.suggestedThemes.length + b.suggestedZones.length;
    return scoreB - scoreA;
  });
  
  const outputPath = path.join(process.cwd(), 'data', 'candidates', `${slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify({ slug, candidates }, null, 2));
  
  console.log(`\nWrote ${candidates.length} candidates to: ${outputPath}`);
  console.log('\nTop 5 candidates:');
  candidates.slice(0, 5).forEach((c, i) => {
    console.log(`\n${i + 1}. ${c.speaker} (${c.timestamp || 'unknown'}) [${c.lengthChars} chars]`);
    console.log(`   Themes: ${c.suggestedThemes.join(', ') || 'none'}`);
    console.log(`   Zones: ${c.suggestedZones.join(', ') || 'none'}`);
    console.log(`   "${c.text.substring(0, 100)}..."`);
  });
}

main();
