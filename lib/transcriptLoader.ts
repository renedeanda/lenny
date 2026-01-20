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
  
  // Match speaker patterns like "Lenny Rachitsky (00:00:00):" or "Brian Chesky (00:05:04):"
  const speakerRegex = /^(.+?)\s\((\d{2}:\d{2}:\d{2})\):/gm;
  
  let match;
  const matches: Array<{ speaker: string; timestamp: string; index: number }> = [];
  
  while ((match = speakerRegex.exec(content)) !== null) {
    matches.push({
      speaker: match[1].trim(),
      timestamp: match[2],
      index: match.index
    });
  }
  
  // Extract text between matches
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    
    const startIndex = current.index + content.substring(current.index).indexOf(':') + 1;
    const endIndex = next ? next.index : content.length;
    
    const text = content.substring(startIndex, endIndex).trim();
    
    if (text) {
      sections.push({
        speaker: current.speaker,
        timestamp: current.timestamp,
        text
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
