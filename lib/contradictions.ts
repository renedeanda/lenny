import { ZoneId } from './types';

export interface Contradiction {
  id: string;
  topic: string;
  icon: string;
  sideA: {
    position: string;
    quote: string;
    guest: string;
    company: string;
    episode: string;
    episodeSlug?: string;
  };
  sideB: {
    position: string;
    quote: string;
    guest: string;
    company: string;
    episode: string;
    episodeSlug?: string;
  };
  relevantZones: ZoneId[];
}

export const contradictions: Contradiction[] = [
  {
    id: 'details',
    topic: 'Leaders in the Details vs Empowerment',
    icon: '🔍',
    sideA: {
      position: 'Leaders Must Be in the Details',
      quote: 'Leaders are in the details. How do you know people are doing a good job if you\'re not in the details? There\'s this negative term called micromanagement. I think there\'s a difference between micromanagement and being in the details.',
      guest: 'Brian Chesky',
      company: 'Airbnb',
      episode: 'Founder mode and being in the details',
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
      quote: 'We ship every week. Speed compounds. You learn more from shipping than thinking. The teams that win are those that ship fastest.',
      guest: 'Rahul Vohra',
      company: 'Superhuman',
      episode: 'Building product taste through velocity',
      episodeSlug: 'rahul-vohra'
    },
    sideB: {
      position: 'Details Create Brand',
      quote: 'We wanted a company where a thousand people could work, but it\'ll look like 10 people did it. We spent months on just the homepage. Details matter. First impressions last forever.',
      guest: 'Brian Chesky',
      company: 'Airbnb',
      episode: 'Crafting experiences that last',
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
