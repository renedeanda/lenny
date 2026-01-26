#!/usr/bin/env node
/**
 * Restores lost fields from original legacy format while keeping the fixed structure.
 *
 * Fields to restore:
 * - Top-level: guest, episode_title, verification_date, verified_by
 * - Quote-level: context, verified
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const verifiedDir = path.join(__dirname, '../data/verified');

// Files that were migrated and need fields restored
const legacyFiles = [
  'aishwarya-naresh-reganti-kiriti-badam.json',
  'amjad-masad.json',
  'annie-duke.json',
  'april-dunford-20.json',
  'ben-horowitz.json',
  'boz.json',
  'casey-winters-20.json',
  'casey-winters.json',
  'dalton-caldwell.json',
  'dylan-field-20.json',
  'elena-verna-30.json',
  'gokul-rajaram.json',
  'guillermo-rauch.json',
  'jason-fried.json',
  'julie-zhuo-20.json',
  'marty-cagan-20.json',
  'nikita-bier.json',
  'shreyas-doshi.json',
  'stewart-butterfield.json',
  'tobi-lutke.json'
];

let restoredCount = 0;

legacyFiles.forEach(filename => {
  const filepath = path.join(verifiedDir, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`Skipping ${filename} - file not found`);
    return;
  }

  // Get original content from git history (before migration)
  let originalContent;
  try {
    const gitOutput = execSync(`git show HEAD~2:data/verified/${filename}`, { encoding: 'utf8' });
    originalContent = JSON.parse(gitOutput);
  } catch (e) {
    console.log(`Skipping ${filename} - couldn't get original from git`);
    return;
  }

  // Read current (migrated) content
  const currentContent = JSON.parse(fs.readFileSync(filepath, 'utf8'));

  console.log(`Restoring fields in ${filename}...`);

  // Restore top-level fields
  const restored = {
    slug: currentContent.slug,
    guest: originalContent.guest || null,
    episode_title: originalContent.episode_title || null,
    verification_date: originalContent.verification_date || null,
    verified_by: originalContent.verified_by || null,
    quotes: currentContent.quotes.map((quote, index) => {
      const originalQuote = originalContent.quotes[index];
      return {
        ...quote,
        context: originalQuote?.context || null,
        verified: originalQuote?.verified ?? true
      };
    }),
    themes: currentContent.themes,
    takeaways: currentContent.takeaways,
    zone_influence: currentContent.zone_influence,
    contrarian_candidates: currentContent.contrarian_candidates,
    guest_metadata: currentContent.guest_metadata
  };

  // Remove null values
  Object.keys(restored).forEach(key => {
    if (restored[key] === null) delete restored[key];
  });

  // Clean up quote null values
  restored.quotes = restored.quotes.map(quote => {
    const cleaned = { ...quote };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null) delete cleaned[key];
    });
    return cleaned;
  });

  // Write back
  fs.writeFileSync(filepath, JSON.stringify(restored, null, 2) + '\n');
  restoredCount++;
  console.log(`  ✓ Restored fields for ${originalContent.quotes.length} quotes`);
});

console.log(`\nDone! Restored fields in ${restoredCount} files.`);
