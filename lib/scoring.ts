import { QuizAnswers, ZoneScores, ZoneId } from './types';
import { zones } from './zones';

// Scoring matrix: question -> answer -> zone scores
const scoringMatrix: Record<string, Record<string, Partial<ZoneScores>>> = {
  q1: {
    a: { velocity: 3, chaos: 1 },
    b: { perfection: 3, focus: 1 },
    c: { velocity: 1, perfection: 1, alignment: 1 }
  },
  q2: {
    a: { data: 3 },
    b: { intuition: 3 },
    c: { data: 1, intuition: 1, discovery: 1 }
  },
  q3: {
    a: { discovery: 3 },
    b: { intuition: 2, focus: 2 },
    c: { alignment: 3 }
  },
  q4: {
    a: { velocity: 3 },
    b: { perfection: 3, focus: 2 },
    c: { velocity: 1, perfection: 1 }
  },
  q5: {
    a: { data: 2, alignment: 2 },
    b: { chaos: 3, velocity: 1 },
    c: { velocity: 2, focus: 1 }
  },
  q6: {
    a: { intuition: 2, velocity: 1 },
    b: { alignment: 3 },
    c: { focus: 2 }
  },
  q7: {
    a: { focus: 3 },
    b: { discovery: 2, alignment: 1 },
    c: { focus: 1, velocity: 1, data: 1 }
  }
};

export function calculateZoneScores(answers: QuizAnswers): ZoneScores {
  const scores: ZoneScores = {
    velocity: 0,
    perfection: 0,
    discovery: 0,
    data: 0,
    intuition: 0,
    alignment: 0,
    chaos: 0,
    focus: 0
  };

  // Calculate scores for each answer
  Object.entries(answers).forEach(([questionId, answerId]) => {
    const questionScores = scoringMatrix[questionId]?.[answerId];
    if (questionScores) {
      Object.entries(questionScores).forEach(([zone, points]) => {
        if (points !== undefined) {
          scores[zone] = (scores[zone] || 0) + points;
        }
      });
    }
  });

  return scores;
}

export function getPrimaryZone(scores: ZoneScores): ZoneId {
  let maxScore = 0;
  let primaryZone: ZoneId = 'velocity';

  Object.entries(scores).forEach(([zone, score]) => {
    if (score > maxScore) {
      maxScore = score;
      primaryZone = zone as ZoneId;
    }
  });

  return primaryZone;
}

export function getZonePercentages(scores: ZoneScores): Record<ZoneId, number> {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages: Record<string, number> = {};

  Object.entries(scores).forEach(([zone, score]) => {
    percentages[zone] = total > 0 ? Math.round((score / total) * 100) : 0;
  });

  return percentages as Record<ZoneId, number>;
}

export function getTopZones(scores: ZoneScores, count: number = 3): Array<{ zone: ZoneId; score: number; percentage: number }> {
  const percentages = getZonePercentages(scores);

  return Object.entries(scores)
    .map(([zone, score]) => ({
      zone: zone as ZoneId,
      score,
      percentage: percentages[zone as ZoneId]
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
