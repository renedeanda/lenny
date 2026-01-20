import { NextRequest, NextResponse } from 'next/server';
import { getTranscriptBySlug } from '@/lib/transcriptLoader';

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
