import { ZoneId } from './types';

export interface ContradictionSide {
  position: string;
  quoteId?: string; // Reference to verified quote
  quote?: string; // Legacy, will be removed
  guest: string;
  company: string;
  episode: string;
  episodeSlug?: string;
}

export interface Contradiction {
  id: string;
  topic: string;
  icon: string;
  sideA: ContradictionSide;
  sideB: ContradictionSide;
  relevantZones: ZoneId[];
}

export const contradictions: Contradiction[] = [
  {
    id: 'speed',
    topic: 'Ship Fast vs Ship Perfect',
    icon: '⚡',
    sideA: {
      position: 'Speed Compounds',
      quoteId: 'rahul-vohra-q005',
      guest: 'Rahul Vohra',
      company: 'Superhuman',
      episode: 'Superhuman\'s secret to success',
      episodeSlug: 'rahul-vohra'
    },
    sideB: {
      position: 'Details Create Brand',
      quoteId: 'brian-chesky-q003',
      guest: 'Brian Chesky',
      company: 'Airbnb',
      episode: 'Brian Chesky\'s new playbook',
      episodeSlug: 'brian-chesky'
    },
    relevantZones: ['velocity', 'perfection', 'chaos']
  }
];

export function getRelevantContradictions(zone: ZoneId, count: number = 5): Contradiction[] {
  return contradictions
    .filter(c => c.relevantZones.includes(zone))
    .slice(0, count);
}

export function getAllContradictions(): Contradiction[] {
  return contradictions;
}

export type Selection = 'a' | 'b' | 'both';

export interface ContradictionSelections {
  [contradictionId: string]: Selection;
}
