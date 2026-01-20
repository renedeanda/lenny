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
    id: 'details',
    topic: 'Leaders in the Details vs Empowerment',
    icon: '🔍',
    sideA: {
      position: 'Leaders Must Be in the Details',
      quoteId: 'brian-chesky-q001',
      guest: 'Brian Chesky',
      company: 'Airbnb',
      episode: 'Brian Chesky\'s new playbook',
      episodeSlug: 'brian-chesky'
    },
    sideB: {
      position: 'Hire Great People and Empower Them',
      quote: 'The best thing you can do as a leader is hire incredible people and then get out of their way. Trust them to do their jobs. Micromanagement kills creativity and ownership.',
      guest: 'Product Leadership Philosophy',
      company: 'Delegation School',
      episode: 'Building autonomous teams'
    },
    relevantZones: ['perfection', 'alignment', 'focus']
  },
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
  },
  {
    id: 'users',
    topic: 'User Research vs Vision',
    icon: '🎯',
    sideA: {
      position: 'Talk to Users Constantly',
      quote: 'The teams that win are those who talk to customers constantly. You can\'t build great products in a vacuum. Customer research is non-negotiable.',
      guest: 'Marty Cagan',
      company: 'SVPG',
      episode: 'Transformed product orgs',
      episodeSlug: 'marty-cagan'
    },
    sideB: {
      position: 'Vision Beats Validation',
      quote: 'We built Figma for 2 years before showing anyone. Sometimes vision needs protection. If you ask users what they want, they\'ll say faster horses.',
      guest: 'Dylan Field',
      company: 'Figma',
      episode: 'Building with conviction',
      episodeSlug: 'dylan-field'
    },
    relevantZones: ['discovery', 'intuition', 'focus']
  },
  {
    id: 'data',
    topic: 'Data-Driven vs Intuition-Led',
    icon: '📊',
    sideA: {
      position: 'Data Removes Bias',
      quote: 'Data removes bias and politics. Every decision needs an experiment. The best teams have the best data infrastructure.',
      guest: 'Growth Leaders',
      company: 'Reforge',
      episode: 'Experimentation at scale'
    },
    sideB: {
      position: 'Taste Beats Metrics',
      quote: 'Data shows you what happened, not what to do next. The best products come from taste and conviction, not A/B tests.',
      guest: 'Product Intuition School',
      company: 'Vision-First PMs',
      episode: 'Building with taste'
    },
    relevantZones: ['data', 'intuition', 'discovery']
  },
  {
    id: 'planning',
    topic: 'Planning vs Executing',
    icon: '📋',
    sideA: {
      position: 'Planning Creates Clarity',
      quote: 'Roadmaps create alignment and clarity. Planning prevents chaos. Everyone needs to know where we\'re going.',
      guest: 'Product Ops Leaders',
      company: 'Process School',
      episode: 'Scaling product organizations'
    },
    sideB: {
      position: 'Planning is Guessing',
      quote: 'Planning is guessing. Just start shipping. You\'ll learn more in a week of shipping than a month of planning. Plans change anyway.',
      guest: 'Amjad Masad',
      company: 'Replit',
      episode: 'AI-first product development',
      episodeSlug: 'amjad-masad'
    },
    relevantZones: ['alignment', 'chaos', 'velocity']
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
