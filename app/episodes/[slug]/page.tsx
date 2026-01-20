'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Calendar, Play, Search, Share2, Hash, X, Lightbulb, MessageSquare, Target } from 'lucide-react';
import { getEpisodeBySlug, allEpisodes, Episode } from '@/lib/allEpisodes';
import { episodeInsights, EpisodeInsights } from '@/lib/insightsData';

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
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

  const filteredSections = useMemo(() => {
    if (!transcript || !searchQuery) return transcript || [];
    
    const query = searchQuery.toLowerCase();
    return transcript.filter(section =>
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
      <div className="relative z-10 min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-ash-dark hover:text-amber transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">BACK TO EXPLORE</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-4">
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

              {/* Search Transcript */}
              <div className="mb-6">
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
                  filteredSections.map((section, index) => (
                    <div
                      key={index}
                      ref={el => { sectionRefs.current[index] = el; }}
                      className={`group hover:bg-void-light transition-colors p-4 -mx-4 ${
                        selectedSection === index ? 'bg-amber/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => jumpToTimestamp(index)}
                          className="flex-shrink-0 w-20 text-xs font-mono text-ash-dark hover:text-amber transition-colors flex items-center gap-1"
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

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pl-4 lg:border-l lg:border-ash-darker/30">
              <div className="space-y-8 pb-8">
                {/* Mobile: Sticky header */}
                <div className="lg:hidden sticky top-0 bg-void z-10 py-4 border-b border-ash-darker">
                  <h3 className="text-lg font-bold text-amber">INSIGHTS & MORE</h3>
                  <p className="text-xs text-ash-dark mt-1">Scroll down for extracted insights</p>
                </div>

                {/* Insights Stats */}
                {insights && (
                  <div className="border-2 border-ash-darker bg-void-light p-6">
                    <h3 className="text-lg font-bold text-amber mb-4">INSIGHTS</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-ash-dark flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Transcript Segments
                        </span>
                        <span className="text-amber font-bold">{transcript?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ash-dark flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Quotable Moments
                        </span>
                        <span className="text-amber font-bold">{insights.quotableMoments.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ash-dark flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Contrarian Views
                        </span>
                        <span className="text-amber font-bold">{insights.contrarianViews.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ash-dark flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Frameworks
                        </span>
                        <span className="text-amber font-bold">{insights.frameworks.length}</span>
                      </div>
                    </div>
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

                {/* Quotable Moments */}
                {insights && insights.quotableMoments.length > 0 && (
                  <div className="border-2 border-amber/30 bg-void-light p-6">
                    <h3 className="text-lg font-bold text-amber mb-4">💡 QUOTABLE MOMENTS</h3>
                    <div className="space-y-4">
                      {insights.quotableMoments.slice(0, showAllQuotes ? undefined : 3).map((moment, i) => (
                        <div key={i} className="border-l-2 border-amber/50 pl-3">
                          <p className="text-sm text-ash mb-2">"{moment.quote}"
                          </p>
                          <div className="flex items-center gap-2 text-xs text-ash-dark">
                            <span>{moment.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {insights.quotableMoments.length > 3 && (
                      <button
                        onClick={() => setShowAllQuotes(!showAllQuotes)}
                        className="mt-4 text-xs text-amber hover:text-amber/80 transition-colors"
                      >
                        {showAllQuotes ? '▲ Show Less' : `▼ Show ${insights.quotableMoments.length - 3} More`}
                      </button>
                    )}
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
