const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Import episode data from allEpisodes (299 episodes)
const episodesPath = path.join(__dirname, '../lib/allEpisodes.ts');
const episodesContent = fs.readFileSync(episodesPath, 'utf-8');

// Parse episodes array from TypeScript file
const episodesMatch = episodesContent.match(/export const allEpisodes: Episode\[\] = (\[[\s\S]*?\n\]);/);
if (!episodesMatch) {
  console.error('Could not parse episodes from allEpisodes.ts');
  process.exit(1);
}

// Clean and parse the episodes
const episodesString = episodesMatch[1]
  .replace(/\/\/[^\n]*/g, '') // Remove comments
  .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments

let episodes;
try {
  episodes = eval(episodesString);
} catch (error) {
  console.error('Error parsing episodes:', error);
  process.exit(1);
}

// Create output directory
const outputDir = path.join(__dirname, '../public/og');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to wrap text for multi-line display
function wrapText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  return lines.slice(0, 3); // Max 3 lines
}

// Function to generate OG image
async function generateOGImage(episode) {
  const width = 1200;
  const height = 630;
  
  // Adjust guest name wrapping based on whether it's a multi-guest episode
  const isMultiGuest = episode.guest && (episode.guest.includes('+') || episode.guest.includes('&'));
  const guestLines = wrapText(episode.guest, isMultiGuest ? 50 : 40);

  // Extract first meaningful sentence from description
  const titleText = episode.description
    ? episode.description.split(/[.!?]/)[0].trim() + '.'
    : episode.title || `Listen to ${episode.guest}`;
  const titleLines = wrapText(titleText, 50);

  // Calculate vertical positioning with adjusted sizing for multi-guest episodes
  const guestFontSize = isMultiGuest ? 55 : 70;
  const guestY = 180;
  const guestLineHeight = isMultiGuest ? 65 : 80;
  const titleStartY = guestY + (guestLines.length * guestLineHeight) + 60;
  const titleLineHeight = 50;
  
  // Create SVG with terminal aesthetic
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
      <rect x="80" y="60" width="300" height="50" fill="#ffb347" opacity="0.1"/>
      <text x="230" y="95" font-family="monospace" font-size="24" 
            fill="#ffb347" text-anchor="middle" font-weight="bold">
        LENNY'S PODCAST
      </text>
      
      <!-- Guest name (wrapped) -->
      ${guestLines.map((line, i) => `
        <text x="600" y="${guestY + (i * guestLineHeight)}"
              font-family="monospace" font-size="${guestFontSize}" font-weight="bold"
              fill="#ffb347" text-anchor="middle">
          ${escapeXml(line.toUpperCase())}
        </text>
      `).join('')}
      
      <!-- Episode title (wrapped) -->
      ${titleLines.map((line, i) => `
        <text x="600" y="${titleStartY + (i * titleLineHeight)}" 
              font-family="monospace" font-size="36"
              fill="#cccccc" text-anchor="middle">
          ${escapeXml(line)}
        </text>
      `).join('')}
      
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
  
  // Generate PNG from SVG
  const outputPath = path.join(outputDir, `${episode.slug}.png`);
  
  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error generating image for ${episode.slug}:`, error.message);
    return false;
  }
}

// Helper to escape XML special characters
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Main generation function
async function generateAllImages() {
  console.log(`Generating OG images for ${episodes.length} episodes...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes[i];
    process.stdout.write(`\rProgress: ${i + 1}/${episodes.length} - ${episode.slug}`);
    
    const success = await generateOGImage(episode);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n\nComplete!`);
  console.log(`✓ ${successCount} images generated successfully`);
  if (failCount > 0) {
    console.log(`✗ ${failCount} images failed`);
  }
  console.log(`\nImages saved to: ${outputDir}`);
}

// Run generation
generateAllImages().catch(console.error);
