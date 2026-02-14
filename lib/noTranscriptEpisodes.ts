// Episodes that have a transcript.md file with only YAML frontmatter
// and no real transcript content (< 50 lines).
// These are multi-visit guests whose 1.0 episodes don't have transcripts yet.
// Updated: 2026-02-14
export const noTranscriptSlugs = new Set([
  'april-dunford',
  'elena-verna',
  'julie-zhuo',
  'madhavan-ramanujam',
  'marty-cagan',
  'nicole-forsgren',
  'wes-kao',
]);
