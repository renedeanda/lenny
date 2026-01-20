const fs = require('fs');
const path = require('path');

// Simple SVG favicon with terminal aesthetic
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" fill="#000000"/>
  
  <!-- Amber border -->
  <rect x="32" y="32" width="448" height="448" fill="none" stroke="#ffb347" stroke-width="8"/>
  
  <!-- PM letters in terminal style -->
  <text x="256" y="320" font-family="monospace" font-size="180" font-weight="bold" fill="#ffb347" text-anchor="middle">PM</text>
  
  <!-- Small stars -->
  <circle cx="100" cy="100" r="4" fill="#ffb347" opacity="0.6"/>
  <circle cx="412" cy="100" r="4" fill="#ffb347" opacity="0.6"/>
  <circle cx="100" cy="412" r="4" fill="#ffb347" opacity="0.6"/>
  <circle cx="412" cy="412" r="4" fill="#ffb347" opacity="0.6"/>
  <circle cx="256" cy="80" r="3" fill="#ffb347" opacity="0.4"/>
  <circle cx="80" cy="256" r="3" fill="#ffb347" opacity="0.4"/>
  <circle cx="432" cy="256" r="3" fill="#ffb347" opacity="0.4"/>
</svg>`;

// Save SVG
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgPath = path.join(publicDir, 'favicon.svg');
fs.writeFileSync(svgPath, svgContent);
console.log('✓ Generated favicon.svg');

// For PNG generation, we'd need a library like sharp or canvas
// For now, just output instructions
console.log('\nTo generate PNG favicons:');
console.log('1. Install: npm install sharp');
console.log('2. Run: node scripts/generate-favicon-png.js');
console.log('\nOr use an online tool like https://realfavicongenerator.net/ with the SVG');
