import { ZoneId } from './types';

export interface Zone {
  id: ZoneId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  coordinates: { x: number; y: number };
  icon: string;
  quoteId?: string; // Reference to verified quote ID
  quote?: string; // Legacy field, will be removed
  quoteAuthor?: string; // Legacy field, will be removed
  episode?: string; // Legacy field, will be removed
  associatedGuests: string[];
  episodeCount?: number; // Will be computed from verified quotes
}

export const zones: Record<ZoneId, Zone> = {
  velocity: {
    id: 'velocity',
    name: 'Velocity',
    tagline: 'Ship fast, iterate constantly',
    description: 'You believe speed compounds. Every week without shipping is a week of lost learning. You might skip polish for velocity, but you know when to slow down for what matters.',
    color: '#ffb347',
    coordinates: { x: 150, y: 150 },
    icon: '⚡',
    quoteId: 'rahul-vohra-q005', // "You have to pick something...speed became our position"
    associatedGuests: ['Rahul Vohra (Superhuman)', 'Elena Verna', 'Guillermo Rauch (Vercel)']
  },
  perfection: {
    id: 'perfection',
    name: 'Perfection',
    tagline: 'Leaders are in the details',
    description: 'You believe first impressions matter eternally. Details compound into brand. Leaders who care are in the details. You ship slower but create moments users never forget.',
    color: '#9d4edd',
    coordinates: { x: 650, y: 150 },
    icon: '✨',
    quoteId: 'brian-chesky-q001', // "Leaders are in the details..."
    associatedGuests: ['Brian Chesky (Airbnb)', 'Dylan Field (Figma)', 'Tobi Lütke (Shopify)']
  },
  discovery: {
    id: 'discovery',
    name: 'Discovery',
    tagline: 'Talk to users, validate everything',
    description: 'You believe building without users is guessing. Customer research is non-negotiable. You might over-validate, but you never build the wrong thing.',
    color: '#06ffa5',
    coordinates: { x: 150, y: 650 },
    icon: '🔬',
    quoteId: 'dylan-field-009', // Reached out to top designers for feedback
    associatedGuests: ['Marty Cagan (SVPG)', 'Teresa Torres', 'April Dunford', 'Dylan Field (Figma)']
  },
  data: {
    id: 'data',
    name: 'Data-Driven',
    tagline: 'Metrics guide every decision',
    description: 'You believe numbers reveal truth. Every hypothesis needs an experiment. You might over-analyze, but you never fly blind.',
    color: '#00d4ff',
    coordinates: { x: 650, y: 650 },
    icon: '📊',
    quoteId: 'elena-verna-30-002', // "Growth cannot function without data"
    associatedGuests: ['Casey Winters (Pinterest)', 'Elena Verna', 'Brian Balfour (Reforge)']
  },
  intuition: {
    id: 'intuition',
    name: 'Intuition',
    tagline: 'Trust your gut, move on instinct',
    description: 'You believe taste beats data. The best products come from vision, not validation. You might miss user signals, but you create category-defining experiences.',
    color: '#ff006e',
    coordinates: { x: 400, y: 100 },
    icon: '🎯',
    quoteId: 'dylan-field-002', // "Intuition is like a hypothesis generator"
    associatedGuests: ['Amjad Masad (Replit)', 'Paul Graham', 'Jason Fried (37signals)', 'Dylan Field (Figma)']
  },
  alignment: {
    id: 'alignment',
    name: 'Alignment',
    tagline: 'Bring everyone along',
    description: 'You believe great products need great buy-in. Stakeholder management IS product management. You might move slower for consensus, but you ship with conviction.',
    color: '#ffd60a',
    coordinates: { x: 100, y: 400 },
    icon: '🤝',
    quoteId: 'brian-chesky-q010', // "Everyone should row in the same direction"
    associatedGuests: ['Gokul Rajaram (Coinbase)', 'Claire Hughes Johnson (Stripe)', 'Shreyas Doshi']
  },
  chaos: {
    id: 'chaos',
    name: 'Adaptability',
    tagline: 'Embrace uncertainty, adapt constantly',
    description: 'You believe plans are fiction. The best strategy is speed + learning. You might frustrate process-lovers, but you thrive in zero-to-one environments.',
    color: '#dc143c',
    coordinates: { x: 700, y: 400 },
    icon: '🌪️',
    quoteId: 'amjad-masad-010', // "We slaughtered our roadmap...being able to switch priorities right away"
    associatedGuests: ['Amjad Masad (Replit)', 'Guillermo Rauch (Vercel)', 'Anton Osika (Lovable)']
  },
  focus: {
    id: 'focus',
    name: 'Focus',
    tagline: 'Do one thing perfectly',
    description: 'You believe constraints breed creativity. The best products do one thing incredibly well. You might miss adjacent opportunities, but you never dilute your vision.',
    color: '#9d4edd',
    coordinates: { x: 400, y: 700 },
    icon: '🎯',
    quoteId: 'brian-chesky-q009', // "Five teams should do one thing rather than one team do five things"
    associatedGuests: ['Karri Saarinen (Linear)', 'Jason Fried (37signals)', 'Rahul Vohra (Superhuman)']
  }
};

export function getZone(zoneId: ZoneId): Zone {
  return zones[zoneId];
}

export function getAllZones(): Zone[] {
  return Object.values(zones);
}

// Total episodes analyzed
export const TOTAL_EPISODES = 299;

// Get percentage of episodes that cover this zone's philosophy
export function getZoneEpisodePercentage(zone: Zone): number {
  const count = zone.episodeCount ?? 0;
  return Math.round((count / TOTAL_EPISODES) * 100);
}
