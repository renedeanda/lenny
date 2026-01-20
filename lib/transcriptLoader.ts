import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface TranscriptContent {
  slug: string;
  metadata: {
    guest: string;
    title: string;
    youtube_url: string;
    video_id: string;
    publish_date: string;
    description: string;
    duration_seconds: number;
    duration: string;
    view_count: number;
    channel: string;
    keywords: string[];
  };
  content: string;
  sections: TranscriptSection[];
}

export interface TranscriptSection {
  speaker: string;
  timestamp: string;
  text: string;
  lineStart: number;  // Line number where this section starts
  lineEnd: number;    // Line number where this section ends
}

const EPISODES_DIR = path.join(process.cwd(), 'episodes');

export async function getTranscriptBySlug(slug: string): Promise<TranscriptContent | null> {
  try {
    const transcriptPath = path.join(EPISODES_DIR, slug, 'transcript.md');
    
    if (!fs.existsSync(transcriptPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(transcriptPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Parse content into sections (speaker + timestamp + text)
    const sections = parseTranscriptSections(content);

    return {
      slug,
      metadata: data as TranscriptContent['metadata'],
      content,
      sections
    };
  } catch (error) {
    console.error(`Error loading transcript ${slug}:`, error);
    return null;
  }
}

function parseTranscriptSections(content: string): TranscriptSection[] {
  const sections: TranscriptSection[] = [];
  const lines = content.split('\n');

  // Match speaker patterns like "Lenny Rachitsky (00:00:00):" or "Brian Chesky (00:05:04):"
  const speakerRegex = /^(.+?)\s\((\d{2}:\d{2}:\d{2})\):/gm;

  // Also match continuation timestamps like "(00:01:27):" without speaker name
  const continuationRegex = /^\((\d{2}:\d{2}:\d{2})\):/gm;

  let match: RegExpExecArray | null;
  const matches: Array<{ speaker: string | null; timestamp: string; index: number; lineNumber: number; isContinuation: boolean }> = [];

  // First, collect all speaker matches
  while ((match = speakerRegex.exec(content)) !== null) {
    const lineNumber = content.substring(0, match.index).split('\n').length;
    matches.push({
      speaker: match[1].trim(),
      timestamp: match[2],
      index: match.index,
      lineNumber,
      isContinuation: false
    });
  }

  // Then, collect continuation timestamp matches
  while ((match = continuationRegex.exec(content)) !== null) {
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Only add if this isn't already captured by speakerRegex
    const alreadyMatched = matches.some(m => m.index === match.index);
    if (!alreadyMatched) {
      matches.push({
        speaker: null, // Will inherit from previous section
        timestamp: match[1],
        index: match.index,
        lineNumber,
        isContinuation: true
      });
    }
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Track the current speaker for continuations
  let currentSpeaker = '';

  // Extract text between matches
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    // Update current speaker if this is not a continuation
    if (!current.isContinuation && current.speaker) {
      currentSpeaker = current.speaker;
    }

    const startIndex = current.index + content.substring(current.index).indexOf(':') + 1;
    const endIndex = next ? next.index : content.length;

    let text = content.substring(startIndex, endIndex).trim();

    // Remove duplicate timestamp at the beginning of text (e.g., "00:00):")
    text = text.replace(/^\d{2}:\d{2}\):\s*/, '');

    if (text) {
      const lineEnd = next ? next.lineNumber - 1 : lines.length;

      sections.push({
        speaker: current.isContinuation ? currentSpeaker : (current.speaker || currentSpeaker),
        timestamp: current.timestamp,
        text,
        lineStart: current.lineNumber,
        lineEnd
      });
    }
  }

  return sections;
}

export function formatTimestamp(timestamp: string): string {
  const parts = timestamp.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
