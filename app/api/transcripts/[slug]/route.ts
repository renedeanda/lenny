import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getTranscriptBySlug } from '@/lib/transcriptLoader';

// Built once per transcript (static export): /api/transcripts/<slug> is a JSON file on the CDN, at the same URL
// the episode page fetches. Unknown slugs get the static 404.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  const dir = path.join(process.cwd(), 'episodes');
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'transcript.md')))
    .map((entry) => ({ slug: entry.name }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const transcript = await getTranscriptBySlug(slug);
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(transcript);
  } catch (error) {
    console.error('Error loading transcript:', error);
    return NextResponse.json(
      { error: 'Failed to load transcript' },
      { status: 500 }
    );
  }
}
