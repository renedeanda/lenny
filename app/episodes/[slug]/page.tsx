'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Calendar, Play, Search, Share2, Hash, X, Lightbulb, MessageSquare, Target, Quote as QuoteIcon } from 'lucide-react';
import { getEpisodeBySlug, allEpisodes, Episode } from '@/lib/allEpisodes';
import { episodeInsights, EpisodeInsights } from '@/lib/insightsData';
import { getEpisodeEnrichment } from '@/lib/verifiedQuotes';
import VerifiedQuotes from '@/components/VerifiedQuotes';
import TopNav from '@/components/TopNav';

// Client-side transcript loading
async function loadTranscript(slug: string) {
  try {
    const response = await fetch(`/api/transcripts/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading transcript:', error);
    return null;
  }
}

interface TranscriptSection {
  speaker: string;
  timestamp: string;
  text: string;
  lineStart: number;
  lineEnd: number;
}

interface TranscriptContent {
  slug: string;
  metadata: any;
  content: string;
  sections: TranscriptSection[];
}

export default function EpisodePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const episode = getEpisodeBySlug(slug);
  
  // Update document title dynamically
  useEffect(() => {
    if (episode) {
      document.title = `${episode.guest} | Lenny's Podcast Philosophy`;
    } else {
      document.title = 'Episode Not Found | Lenny\'s Podcast Philosophy';
    }
  }, [episode]);
  const verifiedEnrichment = useMemo(() => getEpisodeEnrichment(slug), [slug]);
  
  const insights = useMemo(() => {
    const raw = episodeInsights.find(i => i.slug === slug);
    if (!raw) return null;
    
    // Filter out bad data
    return {
      ...raw,
      quotableMoments: raw.quotableMoments.filter(m => 
        m.quote.length >= 50 && 
        m.quote.length <= 300 &&
        m.timestamp !== '00:00:00' &&
        !m.speaker.includes('#') &&
        !m.speaker.includes('##') &&
        !m.quote.startsWith('And ') &&
        !m.quote.includes('...')
      ),
      contrarianViews: raw.contrarianViews.filter(v =>
        v.timestamp !== '00:00:00' &&
        !v.quote.endsWith('...') &&
        v.quote.length >= 100
      )
    };
  }, [slug]);
  
  const [transcript, setTranscript] = useState<TranscriptSection[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [showAllContrarian, setShowAllContrarian] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights'>('transcript');
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const youtubePlayerRef = useRef<any>(null);

  useEffect(() => {
    async function loadTranscript() {
      if (!episode) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/transcripts/${slug}`);
        if (response.ok) {
          const data: TranscriptContent = await response.json();
          setTranscript(data.sections);
        } else {
          console.error('Failed to load transcript');
          setTranscript([]);
        }
      } catch (error) {
        console.error('Error loading transcript:', error);
        setTranscript([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadTranscript();
  }, [episode, slug]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!episode?.videoId) return;

    const initializePlayer = () => {
      if (!(window as any).YT || !(window as any).YT.Player) {
        // API not ready yet, wait for callback
        return;
      }

      try {
        youtubePlayerRef.current = new (window as any).YT.Player('youtube-player', {
          videoId: episode.videoId,
          playerVars: {
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onError: (event: any) => {
              console.error('YouTube player error:', event.data);
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error);
      }
    };

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      initializePlayer();
    } else {
      // Load YouTube IFrame API script if not already loaded
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.onerror = () => {
          console.error('Failed to load YouTube IFrame API');
        };
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Set up callback for when API is ready
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (youtubePlayerRef.current?.destroy) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying YouTube player:', error);
        }
      }
    };
  }, [episode?.videoId]);

  const relatedEpisodes = useMemo(() => {
    if (!episode) return [];

    return allEpisodes
      .filter(ep => {
        if (ep.slug === episode.slug) return false;
        // Find episodes with overlapping keywords
        const overlap = ep.keywords.filter(kw => episode.keywords.includes(kw));
        return overlap.length >= 2;
      })
      .slice(0, 3);
  }, [episode]);

  // Find other episodes with the same guest (for multi-time guests)
  const otherGuestEpisodes = useMemo(() => {
    if (!episode) return [];

    // Extract base guest name (remove version numbers like "2.0", "3.0", etc.)
    const baseGuestName = episode.guest.replace(/\s+\d+\.0.*$/i, '').trim();

    return allEpisodes
      .filter(ep => {
        if (ep.slug === episode.slug) return false;
        // Match if guest name starts with the same base name
        const epBaseGuestName = ep.guest.replace(/\s+\d+\.0.*$/i, '').trim();
        return epBaseGuestName === baseGuestName;
      })
      .sort((a, b) => {
        // Sort by publish date (newest first)
        const dateA = new Date(a.publishDate || 0).getTime();
        const dateB = new Date(b.publishDate || 0).getTime();
        return dateB - dateA;
      });
  }, [episode]);

  const filteredSections = useMemo(() => {
    if (!transcript || !searchQuery) return transcript?.map((section, idx) => ({ section, originalIndex: idx })) || [];

    const query = searchQuery.toLowerCase();
    return transcript
      .map((section, idx) => ({ section, originalIndex: idx }))
      .filter(({ section }) =>
        section.speaker.toLowerCase().includes(query) ||
        section.text.toLowerCase().includes(query)
      );
  }, [transcript, searchQuery]);

  const jumpToTimestamp = (index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSelectedSection(index);
      setTimeout(() => setSelectedSection(null), 2000);

      // Also jump to video timestamp if YouTube player is loaded
      if (youtubePlayerRef.current && transcript && transcript[index]) {
        jumpToVideoTimestamp(transcript[index].timestamp);
      }
    }
  };

  const shareQuote = (section: TranscriptSection) => {
    const quoteText = `"${section.text.substring(0, 280)}..."\n\n— ${section.speaker}\nLenny's Podcast\n\n${window.location.href}#${section.timestamp}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(quoteText);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const timestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':').map(p => parseInt(p, 10));
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const jumpToVideoTimestamp = (timestamp: string) => {
    if (!youtubePlayerRef.current?.seekTo) return;

    const seconds = timestampToSeconds(timestamp);

    // Seek to timestamp
    youtubePlayerRef.current.seekTo(seconds, true);

    // Ensure video starts playing (works even if currently paused)
    setTimeout(() => {
      if (youtubePlayerRef.current?.playVideo) {
        youtubePlayerRef.current.playVideo();
      }
    }, 100);

    // Scroll to video
    const videoElement = document.getElementById('youtube-player');
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!episode) {
    return (
      <div className="min-h-screen bg-void text-ash font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber mb-4">Episode Not Found</h1>
          <Link href="/explore" className="text-ash-dark hover:text-amber transition-colors">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-ash font-mono">
      <TopNav />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20 opacity-5">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffb347_2px,#ffb347_4px)]" />
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-8 right-8 z-50 px-6 py-3 bg-amber text-void font-bold"
        >
          ✓ Quote copied to clipboard!
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 pt-20 pb-8 md:pt-24 md:pb-12">
        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-4">
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

              {/* YouTube Embed Section - Sticky */}
              {episode.videoId && (
                <div className="mb-0 sticky top-16 md:top-20 z-20 bg-void">
                  <div className="relative w-full aspect-video bg-void-light border-2 border-crimson">
                    <div
                      id="youtube-player"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Tabs - Sticky below video */}
              <div className="lg:hidden mb-6 border-b-2 border-ash-darker sticky top-[calc(4rem+100vw*9/16)] md:top-[calc(5rem+100vw*9/16)] z-21 bg-void pb-2">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`pb-3 px-2 font-bold text-sm tracking-wider transition-colors ${
                      activeTab === 'transcript'
                        ? 'text-amber border-b-2 border-amber -mb-[2px]'
                        : 'text-ash-dark hover:text-amber'
                    }`}
                  >
                    TRANSCRIPT
                  </button>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`pb-3 px-2 font-bold text-sm tracking-wider transition-colors ${
                      activeTab === 'insights'
                        ? 'text-amber border-b-2 border-amber -mb-[2px]'
                        : 'text-ash-dark hover:text-amber'
                    }`}
                  >
                    INSIGHTS & MORE
                  </button>
                </div>
              </div>

              {/* Transcript Content - Mobile Tab / Desktop Always Visible */}
              <div className={`${activeTab === 'transcript' ? 'block' : 'hidden'} lg:block`}>
                {/* Search Transcript */}
                <div className="mb-6 relative z-10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transcript..."
                    className="w-full bg-void-light border-2 border-ash-darker text-ash pl-12 pr-12 py-3
                             focus:border-amber focus:outline-none transition-colors
                             placeholder:text-ash-dark"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ash-dark hover:text-amber transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-sm text-ash-dark mt-2">
                    {filteredSections.length} result{filteredSections.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>

              {/* Transcript */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-amber">TRANSCRIPT</h3>
                  <div className="text-sm text-ash-dark">
                    {isLoading ? 'Loading...' : `${filteredSections.length} segments`}
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-12 text-ash-dark">
                    <div className="animate-pulse">Loading transcript...</div>
                  </div>
                ) : filteredSections.length > 0 ? (
                  filteredSections.map(({ section, originalIndex }) => (
                    <div
                      key={originalIndex}
                      ref={el => { sectionRefs.current[originalIndex] = el; }}
                      className={`group hover:bg-void-light transition-colors p-4 -mx-4 ${
                        selectedSection === originalIndex ? 'bg-amber/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            jumpToTimestamp(originalIndex);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="flex-shrink-0 w-20 text-xs font-mono text-ash-dark hover:text-amber transition-colors flex items-center gap-1 select-none cursor-pointer"
                          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                          title="Jump to timestamp"
                        >
                          <Hash className="w-3 h-3" />
                          {section.timestamp}
                        </button>
                        <div className="flex-1">
                          <div className="font-bold text-amber text-sm mb-2">
                            {section.speaker}
                          </div>
                          <div className="text-ash-dark leading-relaxed">
                            {searchQuery ? (
                              <span dangerouslySetInnerHTML={{
                                __html: section.text.replace(
                                  new RegExp(`(${searchQuery})`, 'gi'),
                                  '<mark class="bg-amber/30 text-ash">$1</mark>'
                                )
                              }} />
                            ) : (
                              section.text
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => shareQuote(section)}
                          className="flex-shrink-0 p-2 text-ash-dark hover:text-amber transition-colors opacity-0 group-hover:opacity-100"
                          title="Share quote"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-ash-dark">
                    <p className="mb-2">
                      {searchQuery ? 'No results found' : 'Transcript loading...'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-amber hover:text-amber-dark transition-colors"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Sidebar - 1 column (Mobile: shown in Insights tab, Desktop: always visible) */}
            <div className={`lg:col-span-1 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pl-4 lg:border-l lg:border-ash-darker/30 ${
              activeTab === 'insights' ? 'block' : 'hidden'
            } lg:block`}>
              <div className="space-y-8 pb-8">
                {/* Key Takeaways - Priority Section */}
                {verifiedEnrichment && verifiedEnrichment.takeaways && verifiedEnrichment.takeaways.length > 0 && (
                  <div className="border-2 border-amber bg-void-light p-6">
                    <h3 className="text-lg font-bold text-amber mb-4">🎯 KEY TAKEAWAYS</h3>
                    <div className="space-y-3">
                      {verifiedEnrichment.takeaways.map((takeaway, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-amber font-bold text-sm flex-shrink-0">{i + 1}.</span>
                          <p className="text-ash-dark text-sm leading-relaxed">{takeaway}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Quotes Section */}
                {verifiedEnrichment && (
                  <div>
                    <VerifiedQuotes
                      enrichment={verifiedEnrichment}
                      onJumpToTranscript={(lineStart, quoteTimestamp) => {
                        if (!transcript) return;

                        // Find transcript section containing this line number
                        const sectionIndex = transcript.findIndex(section =>
                          lineStart >= section.lineStart && lineStart <= section.lineEnd
                        );

                        if (sectionIndex !== -1) {
                          // Switch to transcript tab on mobile
                          setActiveTab('transcript');

                          // Scroll to the transcript section
                          const section = sectionRefs.current[sectionIndex];
                          if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setSelectedSection(sectionIndex);
                            setTimeout(() => setSelectedSection(null), 2000);
                          }

                          // Jump to video using the quote's actual timestamp (not the section's timestamp)
                          if (youtubePlayerRef.current && quoteTimestamp) {
                            jumpToVideoTimestamp(quoteTimestamp);
                          }
                        }
                      }}
                    />
                  </div>
                )}

                {/* Contrarian Views */}
                {insights && insights.contrarianViews.length > 0 && (
                  <div className="border-2 border-crimson/30 bg-void-light p-6">
                    <h3 className="text-lg font-bold text-crimson mb-4">🔥 CONTRARIAN TAKES</h3>
                    <div className="space-y-4">
                      {insights.contrarianViews.slice(0, showAllContrarian ? undefined : 2).map((view, i) => (
                        <div key={i} className="border-l-2 border-crimson/50 pl-3">
                          <p className="text-sm text-ash italic mb-2">"{view.quote.substring(0, 200)}{view.quote.length > 200 ? '...' : ''}"
                          </p>
                          <div className="flex items-center gap-2 text-xs text-ash-dark">
                            <span className="text-crimson font-bold">{view.speaker}</span>
                            <span>•</span>
                            <span>{view.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {insights.contrarianViews.length > 2 && (
                      <button
                        onClick={() => setShowAllContrarian(!showAllContrarian)}
                        className="mt-4 text-xs text-crimson hover:text-crimson/80 transition-colors"
                      >
                        {showAllContrarian ? '▲ Show Less' : `▼ Show ${insights.contrarianViews.length - 2} More`}
                      </button>
                    )}
                  </div>
                )}

                {/* Other Episodes with Same Guest */}
                {otherGuestEpisodes.length > 0 && (
                  <div className="border-2 border-amber bg-void-light p-6">
                    <h3 className="text-lg font-bold text-amber mb-4">
                      🎙️ MORE FROM {episode?.guest.replace(/\s+\d+\.0.*$/i, '').trim().toUpperCase()}
                    </h3>
                    <div className="space-y-4">
                      {otherGuestEpisodes.map((other) => (
                        <Link
                          key={other.slug}
                          href={`/episodes/${other.slug}`}
                          className="block group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="text-sm font-bold text-amber group-hover:text-amber/80 transition-colors mb-1">
                                {other.guest}
                              </div>
                              <div className="text-xs text-ash-dark line-clamp-2 mb-1">
                                {other.title}
                              </div>
                              {other.publishDate && (
                                <div className="text-xs text-ash-darker">
                                  {new Date(other.publishDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Episodes */}
                {relatedEpisodes.length > 0 && (
                  <div className="border-2 border-ash-darker bg-void-light p-6">
                    <h3 className="text-lg font-bold text-amber mb-4">RELATED EPISODES</h3>
                    <div className="space-y-4">
                      {relatedEpisodes.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/episodes/${related.slug}`}
                          className="block group"
                        >
                          <div className="text-sm font-bold text-ash group-hover:text-amber transition-colors mb-1">
                            {related.guest}
                          </div>
                          <div className="text-xs text-ash-dark line-clamp-2">
                            {related.title}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {related.keywords.filter(kw => episode.keywords.includes(kw)).slice(0, 3).map(kw => (
                              <span key={kw} className="text-xs text-amber">{kw}</span>
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
