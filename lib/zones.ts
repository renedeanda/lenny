import { ZoneId } from './types';

export interface Zone {
  id: ZoneId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  coordinates: { x: number; y: number };
  icon: string;
  quote: string;
  quoteAuthor: string;
  episode: string;
  associatedGuests: string[];
  episodeCount: number;
}

export const zones: Record<ZoneId, Zone> = {
  velocity: {
    id: 'velocity',
    name: 'The Velocity Nebula',
    tagline: 'Ship fast, iterate constantly',
    description: 'You believe speed compounds. Every week without shipping is a week of lost learning. You might skip polish for velocity, but you know when to slow down for what matters.',
    color: '#ffb347',
    coordinates: { x: 150, y: 150 },
    icon: '⚡',
    quote: 'Speed compounds. When I look at the most successful founders, what I see time and time again is velocity of shipping.',
    quoteAuthor: 'Rahul Vohra',
    episode: 'Superhuman CEO on building product taste',
    associatedGuests: ['Rahul Vohra (Superhuman)', 'Elena Verna', 'Guillermo Rauch (Vercel)'],
    episodeCount: 42
  },
  perfection: {
    id: 'perfection',
    name: 'Perfection Peak',
    tagline: 'Leaders are in the details',
    description: 'You believe first impressions matter eternally. Details compound into brand. Leaders who care are in the details. You ship slower but create moments users never forget.',
    color: '#9d4edd',
    coordinates: { x: 650, y: 150 },
    icon: '✨',
    quote: 'Leaders are in the details. How do you know people are doing a good job if you\'re not in the details? We wanted a company where a thousand people could work, but it\'ll look like 10 people did it.',
    quoteAuthor: 'Brian Chesky',
    episode: 'Airbnb CEO on founder mode',
    associatedGuests: ['Brian Chesky (Airbnb)', 'Dylan Field (Figma)', 'Tobi Lütke (Shopify)'],
    episodeCount: 38
  },
  discovery: {
    id: 'discovery',
    name: 'Discovery Station',
    tagline: 'Talk to users, validate everything',
    description: 'You believe building without users is guessing. Customer research is non-negotiable. You might over-validate, but you never build the wrong thing.',
    color: '#06ffa5',
    coordinates: { x: 150, y: 650 },
    icon: '🔬',
    quote: 'The teams that win are those who talk to customers constantly. You can\'t build great products in a vacuum.',
    quoteAuthor: 'Marty Cagan',
    episode: 'Transformed: Moving to product-led org',
    associatedGuests: ['Marty Cagan (SVPG)', 'Teresa Torres', 'April Dunford'],
    episodeCount: 35
  },
  data: {
    id: 'data',
    name: 'Data Constellation',
    tagline: 'Metrics guide every decision',
    description: 'You believe numbers reveal truth. Every hypothesis needs an experiment. You might over-analyze, but you never fly blind.',
    color: '#00d4ff',
    coordinates: { x: 650, y: 650 },
    icon: '📊',
    quote: 'Data removes bias and politics. The teams that ship fastest are those with the best data infrastructure.',
    quoteAuthor: 'Reforge Instructors',
    episode: 'Growth frameworks compilation',
    associatedGuests: ['Casey Winters (Pinterest)', 'Elena Verna', 'Brian Balfour (Reforge)'],
    episodeCount: 47
  },
  intuition: {
    id: 'intuition',
    name: 'Intuition Vortex',
    tagline: 'Trust your gut, move on instinct',
    description: 'You believe taste beats data. The best products come from vision, not validation. You might miss user signals, but you create category-defining experiences.',
    color: '#ff006e',
    coordinates: { x: 400, y: 100 },
    icon: '🎯',
    quote: 'If I asked people what they wanted, they would have said faster horses. Vision must come from somewhere deeper than user requests.',
    quoteAuthor: 'Steve Jobs School',
    episode: 'Founder mode philosophy',
    associatedGuests: ['Amjad Masad (Replit)', 'Paul Graham', 'Jason Fried (37signals)'],
    episodeCount: 29
  },
  alignment: {
    id: 'alignment',
    name: 'Alignment Galaxy',
    tagline: 'Bring everyone along',
    description: 'You believe great products need great buy-in. Stakeholder management IS product management. You might move slower for consensus, but you ship with conviction.',
    color: '#ffd60a',
    coordinates: { x: 100, y: 400 },
    icon: '🤝',
    quote: 'The hardest part of product isn\'t the building, it\'s getting everyone aligned on what to build and why.',
    quoteAuthor: 'Gokul Rajaram',
    episode: 'The dream team playbook',
    associatedGuests: ['Gokul Rajaram (Coinbase)', 'Claire Hughes Johnson (Stripe)', 'Shreyas Doshi'],
    episodeCount: 41
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos Cluster',
    tagline: 'Embrace uncertainty, adapt constantly',
    description: 'You believe plans are fiction. The best strategy is speed + learning. You might frustrate process-lovers, but you thrive in zero-to-one environments.',
    color: '#dc143c',
    coordinates: { x: 700, y: 400 },
    icon: '🌪️',
    quote: 'Planning is guessing. Just start shipping. You\'ll learn more in a week of shipping than a month of planning.',
    quoteAuthor: 'Amjad Masad',
    episode: 'AI-first product development',
    associatedGuests: ['Amjad Masad (Replit)', 'Guillermo Rauch (Vercel)', 'Anton Osika (Lovable)'],
    episodeCount: 33
  },
  focus: {
    id: 'focus',
    name: 'Focus Singularity',
    tagline: 'Do one thing perfectly',
    description: 'You believe constraints breed creativity. The best products do one thing incredibly well. You might miss adjacent opportunities, but you never dilute your vision.',
    color: '#9d4edd',
    coordinates: { x: 400, y: 700 },
    icon: '🎯',
    quote: 'We say no to literally thousands of things to make sure we don\'t get on the wrong track or try to do too much.',
    quoteAuthor: 'Linear Team Philosophy',
    episode: 'Building focused products',
    associatedGuests: ['Karri Saarinen (Linear)', 'Jason Fried (37signals)', 'Rahul Vohra (Superhuman)'],
    episodeCount: 36
  }
};

export function getZone(zoneId: ZoneId): Zone {
  return zones[zoneId];
}

export function getAllZones(): Zone[] {
  return Object.values(zones);
}

// Total episodes analyzed
export const TOTAL_EPISODES = 303;

// Get percentage of episodes that cover this zone's philosophy
export function getZoneEpisodePercentage(zone: Zone): number {
  return Math.round((zone.episodeCount / TOTAL_EPISODES) * 100);
}
