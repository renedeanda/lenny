const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Output directory
const outputDir = path.join(__dirname, '../public/og/topics');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Parse topic slug/name pairs from topics.ts without importing the full module
 * (avoids pulling in verifiedQuotes, allEpisodes, and JSON data dependencies)
 */
function parseTopics() {
  const content = fs.readFileSync(path.join(__dirname, '../lib/topics.ts'), 'utf-8');
  const topics = [];
  const regex = /slug:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    topics.push({ slug: match[1], name: match[2] });
  }
  return topics;
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Wrap text into lines of at most maxLength characters, splitting on word boundaries.
 * Returns at most maxLines lines; longer text is truncated with ellipsis on the last line.
 */
function wrapText(text, maxLength, maxLines = 2) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? currentLine + ' ' + word : word;
    if (candidate.length <= maxLength) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Truncate to maxLines; add ellipsis if we dropped content
  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    const last = truncated[maxLines - 1];
    // Trim last line to fit ellipsis within maxLength
    if (last.length + 3 > maxLength) {
      truncated[maxLines - 1] = last.slice(0, maxLength - 3).trimEnd() + '...';
    } else {
      truncated[maxLines - 1] = last + '...';
    }
    return truncated;
  }

  return lines;
}

/**
 * Pick a font size that guarantees the text stays inside the safe content area.
 * Safe width = 1200 - 2*80 = 1040px. Monospace char width ≈ 0.6 * fontSize.
 */
function pickFontSize(textUpper, preferred, min) {
  const safeWidth = 1040;
  for (let size = preferred; size >= min; size -= 2) {
    const charWidth = size * 0.6;
    if (textUpper.length * charWidth <= safeWidth) return size;
  }
  return min;
}

async function generateTopicOGImage(topic) {
  const width = 1200;
  const height = 630;

  const nameUpper = topic.name.toUpperCase();

  // Wrap at 24 chars max per line, max 2 lines
  const nameLines = wrapText(nameUpper, 24, 2);

  // Dynamically size: prefer 70, shrink if longest line overflows
  const longestLine = nameLines.reduce((a, b) => (a.length > b.length ? a : b), '');
  const nameFontSize = pickFontSize(longestLine, 70, 40);
  const nameLineHeight = nameFontSize + 12;

  // Vertical layout — name block centered around y=240
  const nameBlockHeight = nameLines.length * nameLineHeight;
  const nameStartY = 240 - nameBlockHeight / 2 + nameFontSize;

  // Elements below the name — clamped so they never overlap the name
  const afterNameY = nameStartY + (nameLines.length - 1) * nameLineHeight;
  const subtitleY = Math.max(afterNameY + 60, 340);
  const dividerY = subtitleY + 35;
  const sourceY = dividerY + 45;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffb347;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#dc143c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffb347;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="#000000"/>

      <!-- Scanlines effect -->
      <pattern id="scanlines" patternUnits="userSpaceOnUse" width="${width}" height="4">
        <rect width="${width}" height="2" fill="#000000"/>
        <rect y="2" width="${width}" height="2" fill="#ffb347" opacity="0.02"/>
      </pattern>
      <rect width="${width}" height="${height}" fill="url(#scanlines)"/>

      <!-- Border -->
      <rect x="40" y="40" width="${width - 80}" height="${height - 80}"
            fill="none" stroke="url(#borderGrad)" stroke-width="3"/>

      <!-- Top badge -->
      <rect x="80" y="60" width="140" height="50" fill="#dc143c" opacity="0.15"/>
      <text x="150" y="95" font-family="monospace" font-size="24"
            fill="#dc143c" text-anchor="middle" font-weight="bold">
        TOPIC
      </text>

      <!-- Topic name (wrapped, dynamically sized) -->
      ${nameLines.map((line, i) => `
        <text x="600" y="${nameStartY + i * nameLineHeight}"
              font-family="monospace" font-size="${nameFontSize}" font-weight="bold"
              fill="#ffb347" text-anchor="middle">
          ${escapeXml(line)}
        </text>
      `).join('')}

      <!-- Subtitle -->
      <text x="600" y="${subtitleY}"
            font-family="monospace" font-size="28"
            fill="#cccccc" text-anchor="middle">
        Curated Insights &amp; Quotes
      </text>

      <!-- Divider line -->
      <line x1="400" y1="${dividerY}" x2="800" y2="${dividerY}"
            stroke="#ffb347" stroke-width="1" opacity="0.3"/>

      <!-- Source label -->
      <text x="600" y="${sourceY}"
            font-family="monospace" font-size="22"
            fill="#888888" text-anchor="middle">
        From Lenny&apos;s Podcast Episodes
      </text>

      <!-- Bottom branding -->
      <text x="600" y="${height - 80}" font-family="monospace" font-size="28"
            fill="#ffb347" text-anchor="middle" opacity="0.6">
        LENNY.PRODUCTBUILDER.NET
      </text>

      <!-- Decorative stars -->
      <circle cx="140" cy="140" r="3" fill="#ffb347"/>
      <circle cx="1060" cy="140" r="3" fill="#ffb347"/>
      <circle cx="140" cy="490" r="3" fill="#dc143c"/>
      <circle cx="1060" cy="490" r="3" fill="#dc143c"/>
    </svg>
  `;

  const outputPath = path.join(outputDir, `${topic.slug}.png`);

  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error generating image for ${topic.slug}:`, error.message);
    return false;
  }
}

async function main() {
  const topics = parseTopics();
  console.log(`\n🎨 Generating OG images for ${topics.length} topics...\n`);

  let generated = 0;
  let failed = 0;

  for (const topic of topics) {
    const success = await generateTopicOGImage(topic);
    if (success) {
      generated++;
    } else {
      failed++;
    }
  }

  console.log(`✅ Generation complete!`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${topics.length}\n`);
}

main();
