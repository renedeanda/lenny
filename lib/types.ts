export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10';

export type AnswerId = 'a' | 'b' | 'c';

export interface Answer {
  id: AnswerId;
  text: string;
  icon: string; // emoji
}

export interface Question {
  id: QuestionId;
  number: number;
  text: string;
  answers: Answer[];
}

export interface QuizAnswers {
  [key: string]: AnswerId;
}

export type ZoneId =
  | 'velocity'
  | 'perfection'
  | 'discovery'
  | 'data'
  | 'intuition'
  | 'alignment'
  | 'chaos'
  | 'focus';

export interface ZoneScores {
  [key: string]: number;
}

// Verified content types
export interface QuoteSource {
  slug: string;
  path: string;
  lineStart: number;
  lineEnd: number;
}

export interface Quote {
  id: string;
  speaker: string;
  text: string;
  timestamp?: string;
  source: QuoteSource;
  themes: string[];
  zones: ZoneId[];
}

export interface Evidence {
  quoteId: string;
  claim: string;
  strength: 'high' | 'medium' | 'low';
}

export interface EpisodeEnrichment {
  slug: string;
  quotes: Quote[];
  themes: string[];
  takeaways: string[];
  contradictionsRefs: string[];
  zoneInfluence: Record<ZoneId, number>; // TypeScript uses camelCase
  zone_influence?: Record<ZoneId, number>; // JSON uses snake_case (for compatibility)
}

export interface VerifiedContent {
  episodes: EpisodeEnrichment[];
  quotes: Quote[];
  lastUpdated: string;
}
