# PM Philosophy Map

**Discover your product management philosophy through an interactive quiz experience built from 295 episodes of Lenny's Podcast.**

[**Try the Live Experience**](https://lenny.productbuilder.net)

---

## What is PM Philosophy Map?

PM Philosophy Map is an interactive web experience where product managers discover their unique approach to building products through a dark sci-fi quiz. Every insight, quote, and recommendation is grounded in real transcript data from Lenny's Podcast - one of the most popular podcasts for product professionals.

Whether you're a Lenny's Podcast superfan looking to explore the archive in a new way, or a developer wanting to build a similar content experience for another podcast, this project has something for you.

---

## Features

### Interactive Philosophy Quiz
Take a 10-question quiz that maps your product philosophy across 8 dimensions:
- **Velocity** vs **Perfection** - Ship fast or polish relentlessly?
- **Data** vs **Intuition** - Trust the metrics or go with your gut?
- **Discovery** vs **Focus** - Explore widely or go deep?
- **Alignment** vs **Chaos** - Build consensus or move fast and break things?

### Personalized Podcast Recommendations
After completing the quiz, get personalized episode recommendations:
- **5 episodes that match your philosophy** - with quotes explaining why
- **3 contrarian episodes** - perspectives that challenge your worldview
- **Smart matching** based on 1,200+ verified quotes from 100+ curated episodes

### Episode Deep-Dives
Every episode page includes:
- Full searchable transcript with timestamp navigation
- Embedded YouTube video with timestamp sync
- Curated quotes with theme filtering
- Key takeaways and related episodes

### Beautiful Dark Sci-Fi Aesthetic
- 3D interactive starfield background
- Terminal-style typography and animations
- Custom cursor effects and smooth transitions
- Scanline overlays and glitch effects

---

## For Developers

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | App Router, SSR, dynamic routes |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Three.js + R3F** | 3D starfield graphics |
| **Google Analytics 4** | Usage analytics |

### Key Features for Reuse

This project demonstrates several patterns useful for content-heavy sites:

**Dynamic Sitemap Generation**
```
app/sitemap.ts → Generates 300+ URLs dynamically
```

**SEO-Optimized OG Images**
```
public/og/ → Auto-generated social preview images
scripts/generate-og-images.js → Batch generation
```

**Content Curation System**
```
data/verified/*.json → Structured quote data
lib/verifiedQuotes.ts → Quote loading utilities
```

**Recommendation Engine**
```
lib/recommendations.ts → Quiz-to-episode matching
lib/scoring.ts → Philosophy zone calculations
```

### Claude AI Skills

This project includes custom Claude Code skills for automated curation:

| Skill | Purpose |
|-------|---------|
| `/curate-episode` | Extract verified quotes from transcripts |
| `/verify-seo` | Audit SEO metadata across all pages |
| `/verify-sitemap` | Validate dynamic sitemap generation |
| `/update-og-images` | Manage OpenGraph social images |

Skills are defined in `.claude/skills/` and can be invoked in Claude Code CLI.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/renedeanda/lenny.git
cd lenny

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Project Structure

```
/lenny
├── app/                     # Next.js App Router
│   ├── page.tsx             # Landing page (3D starfield)
│   ├── quiz/                # 10-question philosophy quiz
│   ├── results/             # Philosophy profile & recommendations
│   ├── explore/             # Browse all episodes
│   ├── episodes/[slug]/     # Individual episode pages
│   ├── sitemap.ts           # Dynamic sitemap generation
│   └── layout.tsx           # Root layout + metadata
│
├── components/              # React components
│   ├── InteractiveSpace.tsx # 3D starfield background
│   ├── VerifiedQuotes.tsx   # Curated quote display
│   ├── GoogleAnalytics.tsx  # GA4 integration
│   └── CustomCursor.tsx     # Sci-fi cursor effect
│
├── lib/                     # Core business logic
│   ├── allEpisodes.ts       # Episode metadata (295 episodes)
│   ├── zones.ts             # 8 philosophy zones
│   ├── questions.ts         # Quiz questions
│   ├── scoring.ts           # Quiz → zone calculations
│   ├── recommendations.ts   # Episode matching algorithm
│   ├── verifiedQuotes.ts    # Quote loading system
│   └── types.ts             # TypeScript definitions
│
├── data/verified/           # Curated episode content
│   ├── brian-chesky.json    # Example curated episode
│   └── verified-content.json # Master registry
│
├── episodes/                # Raw transcript markdown files
│   └── [slug]/transcript.md # 295 episode transcripts
│
├── public/                  # Static assets
│   ├── og/                  # OG images for each episode
│   └── og-image.png         # Default OG image
│
├── scripts/                 # Build and automation tools
│   ├── generate-og-images.js
│   └── parse-all-episodes.js
│
└── .claude/                 # Claude AI configuration
    └── skills/              # Reusable Claude skills
```

---

## Content Statistics

| Metric | Count |
|--------|-------|
| Total Episodes | 295 |
| Curated Episodes | 105 (35.6%) |
| Verified Quotes | 1,224 |
| Philosophy Zones | 8 |
| Quiz Questions | 10 |

---

## Using This as a Template

Want to build a similar experience for a different podcast? Here's what you'd need to change:

1. **Episodes data** - Replace `episodes/` directory with your transcripts
2. **Episode metadata** - Update `lib/allEpisodes.ts` with your episode info
3. **Quiz questions** - Customize `lib/questions.ts` for your content themes
4. **Philosophy zones** - Adapt `lib/zones.ts` to your domain
5. **Branding** - Update colors in Tailwind config and component styles
6. **OG images** - Regenerate using scripts with your branding

The core architecture (transcript parsing, quote curation, recommendation engine) is reusable across any podcast content.

---

## Contributing

This is primarily a personal project, but contributions are welcome!

### Quality Standards

- **TypeScript** strict mode enabled
- **Tailwind** only for styling (no custom CSS files)
- **Commits** use conventional format (feat, fix, docs, refactor)
- **Quotes** must be verified with transcript line numbers

### Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/renedeanda/lenny/issues).

---

## Credits

- **Podcast**: [Lenny's Podcast](https://www.lennyspodcast.com) by Lenny Rachitsky
- **Transcripts**: [ChatPRD/lennys-podcast-transcripts](https://github.com/ChatPRD/lennys-podcast-transcripts)
- **Developer**: [Rene DeAnda](https://github.com/renedeanda)

---

## License

MIT License - feel free to use this code for your own projects.

---

## Links

- **Live Site**: [lenny.productbuilder.net](https://lenny.productbuilder.net)
- **Repository**: [github.com/renedeanda/lenny](https://github.com/renedeanda/lenny)
- **Lenny's Podcast**: [lennyspodcast.com](https://www.lennyspodcast.com)

---

Built with care for the PM community
