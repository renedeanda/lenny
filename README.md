# PM Philosophy Recommendations

> Discover your product management philosophy through an interactive quiz powered by 299 episodes of Lenny's Podcast

🔗 **Live:** [lenny.productbuilder.net](https://lenny.productbuilder.net)

---

## 🎯 What is this?

PM Philosophy Recommendations helps product managers discover their unique approach to building products through a dark sci-fi quiz experience. Every insight, quote, and recommendation is grounded in real transcript data from Lenny's Podcast.

**Key Features:**
- 🧭 **10-question philosophy quiz** with AI-focused questions
- 🎨 **Dark sci-fi aesthetic** with 3D starfield and terminal vibes
- 📊 **8 philosophy zones** (Velocity, Perfection, Discovery, Data, Intuition, Alignment, Chaos, Focus)
- 🎙️ **299 episodes** with searchable transcripts
- ✨ **20 curated episodes** with 235 verified quotes
- 🎯 **Personalized recommendations** based on your philosophy
- 🔍 **Smart search & filtering** across all episodes

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **3D Graphics:** Three.js + React Three Fiber
- **Analytics:** Google Analytics 4
- **Deployment:** Vercel

---

## 🚀 Getting Started

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

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run build:verified   # Validate curated episode data
npm run stats            # Show coverage statistics
```

---

## 📁 Project Structure

```
/lenny
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Landing page (3D starfield)
│   ├── quiz/                    # 10-question philosophy quiz
│   ├── results/                 # Philosophy profile & recommendations
│   ├── episodes/[slug]/         # Individual episode pages
│   └── explore/                 # Browse all 299 episodes
├── components/                  # React components
│   ├── InteractiveSpace.tsx     # 3D starfield background
│   ├── VerifiedQuotes.tsx       # Curated quote display
│   ├── EpisodeRecommendationCard.tsx
│   └── PhilosophyInsightCard.tsx
├── lib/                         # Core business logic
│   ├── allEpisodes.ts           # 303 episode metadata
│   ├── zones.ts                 # 8 philosophy zones
│   ├── questions.ts             # Quiz questions
│   ├── scoring.ts               # Quiz → philosophy calculation
│   ├── recommendations.ts       # Recommendation engine
│   └── verifiedQuotes.ts        # Quote loading system
├── data/verified/               # Curated episode JSON files
│   └── verified-content.json    # Master registry
├── episodes/                    # Raw transcript markdown files
├── scripts/                     # Build and curation tools
└── .claude/                     # Claude AI skills
```

---

## 🎨 Design System

### Colors

- **Void:** `#000000` (background)
- **Amber:** `#ffb347` (primary accent)
- **Crimson:** `#dc143c` (highlights)
- **Ash:** `#cccccc` (text)

### Typography

- **Font:** Monospace (terminal aesthetic)
- **Style:** Bold, uppercase labels with tight tracking

### Effects

- Scanlines overlay (5% opacity)
- Glitch effect on titles
- Mouse-reactive 3D starfield
- Custom cursor with spring physics

---

## 📊 Current Status

### Episode Coverage

- **Total Episodes:** 302
- **Curated Episodes:** 20 (6.6%)
- **Verified Quotes:** 235
- **Avg Quotes/Episode:** 11.8

### Zone Coverage (All zones at 16+ episodes)

- Focus: 20 episodes ✓
- Alignment: 18 episodes ✓
- Perfection: 17 episodes ✓
- Discovery: 17 episodes ✓
- Velocity: 16 episodes ✓
- Data: 16 episodes ✓
- Intuition: 16 episodes ✓
- Chaos: 16 episodes ✓

---

## 🛠️ Key Features

### 1. Interactive Quiz

10 carefully crafted questions that map to 8 philosophy zones:
- Classic PM trade-offs (speed vs perfection, data vs intuition)
- Modern AI adoption approaches
- Decision-making philosophies

### 2. Personalized Recommendations

After completing the quiz, users get:
- **5 primary recommendations** that match their philosophy
- **3 contrarian recommendations** to expand their perspective
- Verified quotes explaining why each episode matches
- Direct links to episode pages with timestamps

### 3. Episode Pages

Each episode includes:
- Full searchable transcript
- YouTube video embed with timestamp sync
- Curated quotes with theme filtering
- Key takeaways
- Related episodes

### 4. Smart Explore Page

Browse all 299 episodes with:
- Full-text search
- Keyword filtering (130+ topics)
- Multiple sort options
- Personalized recommendations section (if quiz completed)
- Pagination (24 episodes per page)

---

## 🔧 Development

### Adding Curated Episodes

Use the Claude AI skill to curate new episodes:

```bash
# In Claude Code CLI
/curate-episode
```

This will:
1. Extract 10-12 best quotes from the transcript
2. Tag quotes with themes and zones
3. Generate key takeaways
4. Calculate zone_influence scores
5. Output to `data/verified/[slug].json`

### Validation

```bash
npm run build:verified
```

This validates:
- All quotes reference real transcript lines
- No duplicates
- Proper zone mappings
- Quote quality (length, timestamps)

---

## 📝 Contributing

This is a personal project, but issues and suggestions are welcome!

### Quality Standards

- **TypeScript:** Strict mode enabled
- **Styling:** Tailwind only (no custom CSS)
- **Commits:** Conventional commits (feat, fix, docs, refactor)
- **Data:** All quotes must be verified with transcript line numbers

---

## 🙏 Credits

- **Podcast:** [Lenny's Podcast](https://www.lennyspodcast.com) by Lenny Rachitsky
- **Transcripts:** [ChatPRD/lennys-podcast-transcripts](https://github.com/ChatPRD/lennys-podcast-transcripts)
- **Developer:** [René DeAnda](https://github.com/renedeanda)

---

## 📄 License

MIT License - feel free to use this code for your own projects!

---

## 🔗 Links

- **Live Site:** https://lenny.productbuilder.net
- **Repository:** https://github.com/renedeanda/lenny
- **Lenny's Podcast:** https://www.lennyspodcast.com
- **Twitter:** [@lennysan](https://twitter.com/lennysan)

---

Built with ❤️ for the PM community
