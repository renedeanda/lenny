const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateHomeOGImage() {
  const width = 1200;
  const height = 630;

  // Create SVG with terminal aesthetic for home page
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
      <rect x="80" y="60" width="360" height="50" fill="#ffb347" opacity="0.1"/>
      <text x="260" y="95" font-family="monospace" font-size="24"
            fill="#ffb347" text-anchor="middle" font-weight="bold">
        LENNY'S PODCAST
      </text>

      <!-- Main title -->
      <text x="600" y="240" font-family="monospace" font-size="72"
            fill="#ffb347" text-anchor="middle" font-weight="bold">
        DISCOVER YOUR
      </text>
      <text x="600" y="320" font-family="monospace" font-size="72"
            fill="#ffffff" text-anchor="middle" font-weight="bold">
        PRODUCT
      </text>
      <text x="600" y="400" font-family="monospace" font-size="72"
            fill="#ffb347" text-anchor="middle" font-weight="bold" opacity="0.8">
        PHILOSOPHY
      </text>

      <!-- Subtitle -->
      <text x="600" y="480" font-family="monospace" font-size="28"
            fill="#999999" text-anchor="middle">
        10-question quiz • 295 episodes • Verified quotes
      </text>

      <!-- Bottom brand -->
      <rect x="${width - 520}" y="${height - 90}" width="440" height="40" fill="#ffb347" opacity="0.1"/>
      <text x="${width - 300}" y="${height - 60}" font-family="monospace" font-size="20"
            fill="#ffb347" text-anchor="middle" font-weight="bold">
        LENNY.PRODUCTBUILDER.NET
      </text>
    </svg>
  `;

  try {
    const outputPath = path.join(__dirname, '../public/og-image.png');

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(`✓ Generated: og-image.png (${Math.round(stats.size / 1024)}K)`);
    console.log(`  Dimensions: ${width}x${height}px`);
    console.log(`  Location: ${outputPath}`);
  } catch (error) {
    console.error('Error generating home OG image:', error);
    process.exit(1);
  }
}

generateHomeOGImage();
