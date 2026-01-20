import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, Eye, Calendar, Play } from 'lucide-react';
import { getTranscriptBySlug } from '@/lib/transcriptLoader';
import { getEpisodeBySlug, allEpisodes } from '@/lib/allEpisodes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allEpisodes.map((episode) => ({
    slug: episode.slug,
  }));
}

export default async function EpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  const transcript = await getTranscriptBySlug(slug);

  if (!episode || !transcript) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">BACK TO EXPLORE</span>
          </Link>

          {/* Header */}
          <div className="mb-8 pb-8 border-b-2 border-ash-darker">
            <h1 className="text-3xl md:text-5xl font-bold text-amber mb-4 leading-tight">
              {episode.guest}
            </h1>
            <h2 className="text-xl md:text-2xl text-ash-dark mb-6 leading-relaxed">
              {episode.title}
            </h2>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-ash-dark">
              {episode.publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(episode.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {episode.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{episode.duration}</span>
                </div>
              )}
              {episode.viewCount && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{episode.viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {episode.youtubeUrl && (
                <a
                  href={episode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-void hover:bg-amber-dark transition-colors font-bold"
                >
                  <Play className="w-4 h-4" />
                  WATCH ON YOUTUBE
                </a>
              )}
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber text-amber hover:bg-amber hover:text-void transition-all font-bold"
              >
                TAKE THE QUIZ
              </Link>
            </div>

            {/* Keywords */}
            {episode.keywords && episode.keywords.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-amber tracking-wider mb-2">TOPICS</p>
                <div className="flex flex-wrap gap-2">
                  {episode.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 text-xs border border-ash-darker text-ash-dark bg-void-light"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-amber">TRANSCRIPT</h3>
              <div className="text-sm text-ash-dark">
                {transcript.sections.length} segments
              </div>
            </div>

            {transcript.sections.map((section, index) => (
              <div
                key={index}
                className="group hover:bg-void-light transition-colors p-4 -mx-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 text-xs font-mono text-ash-dark">
                    {section.timestamp}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-amber text-sm mb-2">
                      {section.speaker}
                    </div>
                    <div className="text-ash-dark leading-relaxed">
                      {section.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {transcript.sections.length === 0 && (
              <div className="text-center py-12 text-ash-dark">
                <p>Transcript parsing in progress...</p>
                <p className="text-sm mt-2">Check back soon for full transcript.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t-2 border-ash-darker text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-amber hover:text-amber-dark transition-colors font-bold"
            >
              ← EXPLORE MORE EPISODES
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
