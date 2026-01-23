import { QuizAnswers, ZoneId, ZoneScores, Quote, EpisodeEnrichment } from './types';
import { calculateZoneScores, getZonePercentages } from './scoring';
import { getEpisodeEnrichment, getVerifiedEpisodeSlugs } from './verifiedQuotes';
import { allEpisodes } from './allEpisodes';

/**
 * User's philosophy profile derived from quiz answers
 */
export interface UserProfile {
  zoneScores: ZoneScores;
  zonePercentages: Record<ZoneId, number>;
  primaryZone: ZoneId;
  secondaryZone: ZoneId;
  blindSpotZone: ZoneId;
}

/**
 * Episode with alignment score and matching quotes
 */
export interface EpisodeAlignment {
  slug: string;
  guest: string;
  title: string;
  alignmentScore: number;        // 0-100
  matchingQuotes: Quote[];       // Quotes that match user's philosophy
  matchReason: string;           // Human-readable explanation
  episodeZones: Record<ZoneId, number>; // Episode's zone influence
}

/**
 * Complete recommendation set for a user
 */
export interface Recommendations {
  userProfile: UserProfile;
  primary: EpisodeAlignment[];     // Top matching episodes
  contrarian: EpisodeAlignment[];  // Challenging perspectives
}

/**
 * Calculate user profile from quiz answers
 */
export function calculateUserProfile(answers: QuizAnswers): UserProfile {
  const zoneScores = calculateZoneScores(answers);
  const zonePercentages = getZonePercentages(zoneScores);

  // Get primary zone (highest score)
  const sortedZones = Object.entries(zonePercentages)
    .sort((a, b) => b[1] - a[1]);

  const primaryZone = sortedZones[0][0] as ZoneId;
  const secondaryZone = sortedZones[1][0] as ZoneId;
  const blindSpotZone = sortedZones[sortedZones.length - 1][0] as ZoneId;

  return {
    zoneScores,
    zonePercentages,
    primaryZone,
    secondaryZone,
    blindSpotZone,
  };
}

/**
 * Calculate alignment score between user and episode
 * Returns normalized score (0-100) relative to best possible match
 */
function calculateAlignmentScore(
  userProfile: UserProfile,
  episodeZones: Record<ZoneId, number>
): number {
  let alignmentScore = 0;

  // For each zone, multiply user percentage by episode influence
  const allZones: ZoneId[] = [
    'velocity',
    'perfection',
    'discovery',
    'data',
    'intuition',
    'alignment',
    'chaos',
    'focus',
  ];

  // Calculate raw alignment (dot product)
  for (const zone of allZones) {
    const userStrength = userProfile.zonePercentages[zone] / 100; // Convert to 0-1
    const episodeStrength = episodeZones[zone] || 0;
    alignmentScore += userStrength * episodeStrength;
  }

  // Boost score for matching primary/secondary zones
  const primaryBoost = episodeZones[userProfile.primaryZone] || 0;
  const secondaryBoost = episodeZones[userProfile.secondaryZone] || 0;

  // Add significant bonus for episodes that match user's top zones
  alignmentScore += primaryBoost * 0.5; // 50% bonus for primary zone match
  alignmentScore += secondaryBoost * 0.25; // 25% bonus for secondary zone match

  // Normalize to 0-100 scale with boosted range
  // This ensures top matches score 70-100% even with limited data
  return Math.min(100, Math.round(alignmentScore * 100));
}

/**
 * Find quotes that match user's strong zones
 */
function findMatchingQuotes(
  userProfile: UserProfile,
  episode: EpisodeEnrichment,
  maxQuotes: number = 2
): Quote[] {
  const matchingQuotes: Quote[] = [];
  const topZones = Object.entries(userProfile.zonePercentages)
    .filter(([_, percentage]) => percentage > 15) // Only zones with >15% strength
    .map(([zone, _]) => zone as ZoneId);

  for (const quote of episode.quotes ?? []) {
    // Check if quote has zones that match user's top zones
    const hasMatchingZone = quote.zones.some(zoneId =>
      topZones.includes(zoneId as ZoneId)
    );

    if (hasMatchingZone) {
      matchingQuotes.push(quote);
    }

    if (matchingQuotes.length >= maxQuotes) {
      break;
    }
  }

  return matchingQuotes;
}

/**
 * Generate human-readable match reason
 */
function generateMatchReason(
  userProfile: UserProfile,
  episodeZones: Record<ZoneId, number>
): string {
  // Find top 2 shared zones
  const sharedZones = Object.entries(episodeZones)
    .filter(([zone, influence]) => {
      const userStrength = userProfile.zonePercentages[zone as ZoneId];
      return influence > 0.15 && userStrength > 15; // Both strong in this zone
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([zone, _]) => zone);

  if (sharedZones.length === 0) {
    return "This episode aligns with your overall philosophy";
  } else if (sharedZones.length === 1) {
    return `Both prioritize ${sharedZones[0]}`;
  } else {
    return `Both prioritize ${sharedZones[0]} and ${sharedZones[1]}`;
  }
}

/**
 * Calculate episode alignment for all verified episodes
 */
export function calculateEpisodeAlignment(
  userProfile: UserProfile,
  slug: string
): EpisodeAlignment | null {
  // Get episode enrichment data
  const episode = getEpisodeEnrichment(slug);
  if (!episode) return null;

  // Get episode metadata
  const episodeMetadata = allEpisodes.find(ep => ep.slug === slug);
  if (!episodeMetadata) return null;

  // Note: JSON uses snake_case (zone_influence) but TypeScript type expects camelCase
  // Access the data correctly from the JSON structure
  const episodeZones: Record<ZoneId, number> = (episode as any).zoneInfluence || (episode as any).zone_influence || {};

  // Calculate alignment
  const alignmentScore = calculateAlignmentScore(userProfile, episodeZones);

  // Find matching quotes
  const matchingQuotes = findMatchingQuotes(userProfile, episode, 2);

  // Generate match reason
  const matchReason = generateMatchReason(userProfile, episodeZones);

  return {
    slug,
    guest: episodeMetadata.guest,
    title: episodeMetadata.title,
    alignmentScore,
    matchingQuotes,
    matchReason,
    episodeZones,
  };
}

/**
 * Generate complete recommendations for a user
 */
export function generateRecommendations(answers: QuizAnswers): Recommendations {
  // Calculate user profile
  const userProfile = calculateUserProfile(answers);

  // Get all verified episode slugs
  const verifiedSlugs = getVerifiedEpisodeSlugs();

  // Calculate alignment for all episodes
  const allAlignments = verifiedSlugs
    .map(slug => calculateEpisodeAlignment(userProfile, slug))
    .filter((alignment): alignment is EpisodeAlignment => alignment !== null);

  // Primary recommendations: Top 5 matching episodes
  const primary = allAlignments
    .sort((a, b) => b.alignmentScore - a.alignmentScore)
    .slice(0, 5);

  // Contrarian recommendations: Episodes strong in user's blind spot zone
  const contrarian = allAlignments
    .map(ep => ({
      ...ep,
      blindSpotStrength: ep.episodeZones[userProfile.blindSpotZone] || 0,
    }))
    .filter(ep => ep.blindSpotStrength > 0.15) // Strong in blind spot
    .sort((a, b) => b.blindSpotStrength - a.blindSpotStrength)
    .slice(0, 3)
    .map(({ blindSpotStrength, ...rest }) => rest); // Remove temp field

  return {
    userProfile,
    primary,
    contrarian,
  };
}

/**
 * Get a short description of user's blind spot for contrarian recommendations
 */
export function getBlindSpotDescription(zoneId: ZoneId): string {
  const descriptions: Record<ZoneId, string> = {
    velocity: 'Explore the value of speed and rapid iteration',
    perfection: 'Consider the power of craft and attention to detail',
    discovery: 'Learn about user research and validation',
    data: 'Understand the role of metrics and experimentation',
    intuition: 'Appreciate the importance of vision and taste',
    alignment: 'See the value of consensus and stakeholder buy-in',
    chaos: 'Embrace uncertainty and adaptability',
    focus: 'Understand the power of ruthless prioritization',
  };

  return descriptions[zoneId];
}
