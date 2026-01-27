/**
 * Favorites system using localStorage
 * Supports favoriting quotes and episodes
 */

const FAVORITE_QUOTES_KEY = 'lenny-favorite-quotes';
const FAVORITE_EPISODES_KEY = 'lenny-favorite-episodes';

export interface FavoriteQuote {
  quoteId: string;
  text: string;
  speaker: string;
  episodeSlug: string;
  timestamp?: string;
  addedAt: string;
}

export interface FavoriteEpisode {
  slug: string;
  guest: string;
  addedAt: string;
}

// Quote Favorites
export function getFavoriteQuotes(): FavoriteQuote[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FAVORITE_QUOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading favorite quotes:', e);
    return [];
  }
}

export function addFavoriteQuote(quote: Omit<FavoriteQuote, 'addedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteQuotes();
    const exists = favorites.some(f => f.quoteId === quote.quoteId);

    if (!exists) {
      favorites.unshift({
        ...quote,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(FAVORITE_QUOTES_KEY, JSON.stringify(favorites));
    }
  } catch (e) {
    console.error('Error saving favorite quote:', e);
  }
}

export function removeFavoriteQuote(quoteId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteQuotes();
    const filtered = favorites.filter(f => f.quoteId !== quoteId);
    localStorage.setItem(FAVORITE_QUOTES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error removing favorite quote:', e);
  }
}

export function isQuoteFavorited(quoteId: string): boolean {
  const favorites = getFavoriteQuotes();
  return favorites.some(f => f.quoteId === quoteId);
}

export function toggleFavoriteQuote(quote: Omit<FavoriteQuote, 'addedAt'>): boolean {
  if (isQuoteFavorited(quote.quoteId)) {
    removeFavoriteQuote(quote.quoteId);
    return false;
  } else {
    addFavoriteQuote(quote);
    return true;
  }
}

// Episode Favorites
export function getFavoriteEpisodes(): FavoriteEpisode[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FAVORITE_EPISODES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading favorite episodes:', e);
    return [];
  }
}

export function addFavoriteEpisode(episode: Omit<FavoriteEpisode, 'addedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteEpisodes();
    const exists = favorites.some(f => f.slug === episode.slug);

    if (!exists) {
      favorites.unshift({
        ...episode,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(FAVORITE_EPISODES_KEY, JSON.stringify(favorites));
    }
  } catch (e) {
    console.error('Error saving favorite episode:', e);
  }
}

export function removeFavoriteEpisode(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteEpisodes();
    const filtered = favorites.filter(f => f.slug !== slug);
    localStorage.setItem(FAVORITE_EPISODES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error removing favorite episode:', e);
  }
}

export function isEpisodeFavorited(slug: string): boolean {
  const favorites = getFavoriteEpisodes();
  return favorites.some(f => f.slug === slug);
}

export function toggleFavoriteEpisode(episode: Omit<FavoriteEpisode, 'addedAt'>): boolean {
  if (isEpisodeFavorited(episode.slug)) {
    removeFavoriteEpisode(episode.slug);
    return false;
  } else {
    addFavoriteEpisode(episode);
    return true;
  }
}

// Get counts
export function getFavoriteQuotesCount(): number {
  return getFavoriteQuotes().length;
}

export function getFavoriteEpisodesCount(): number {
  return getFavoriteEpisodes().length;
}
