# The PM Philosophy Map 🌌

*"A Fire Upon the Deep for Product Managers"*

Every PM is lost somewhere in the Product Universe. This interactive experience helps you discover your product philosophy by:

1. **Answering 7 existential product questions**
2. **Getting placed in the cosmic Product Universe map**
3. **Facing contradictions from world-class PMs**
4. **Receiving your unique Philosophy Profile (shareable)**

**Inspired by:** Lenny's love of sci-fi space opera
**Built from:** 303 episodes of Lenny's Podcast transcripts
**Aesthetic:** Blade Runner × No Man's Sky × Figma

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## 🎨 Tech Stack

### Core
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**

### Magic Libraries
- `framer-motion` - Smooth animations
- `@react-three/fiber` + `@react-three/drei` - 3D starfield
- `react-zoom-pan-pinch` - Map zoom/pan
- `lucide-react` - Icons
- `html2canvas` - Screenshot generation

### Color Palette (Synthwave Sci-Fi)
- **Deep Space:** `#0a0e27`
- **Cyan Glow:** `#00d4ff`
- **Purple Nebula:** `#9d4edd`
- **Hot Pink:** `#ff006e`
- **Neon Green:** `#06ffa5`
- **Electric Yellow:** `#ffd60a`

---

## 📁 Project Structure

```
pm-philosophy-map/
├── app/
│   ├── page.tsx                 # Landing page with 3D starfield
│   ├── quiz/page.tsx            # Question flow (7 questions)
│   ├── map/page.tsx             # Cosmic map reveal
│   ├── contradictions/page.tsx  # PM debates & contradictions
│   ├── results/page.tsx         # Final philosophy card
│   └── layout.tsx               # Root layout
├── components/
│   ├── StarField.tsx            # 3D animated background
│   ├── QuizCard.tsx             # (To be built)
│   ├── MapCanvas.tsx            # (To be built)
│   ├── ContradictionCard.tsx    # (To be built)
│   └── PhilosophyCard.tsx       # (To be built)
├── lib/
│   ├── questions.ts             # (To be built)
│   ├── zones.ts                 # (To be built)
│   ├── contradictions.ts        # (To be built)
│   ├── scoring.ts               # (To be built)
│   └── types.ts                 # TypeScript types
└── public/
```

---

## 🌟 The 8 Cosmic Zones

1. **⚡ The Velocity Nebula** - Ship fast, iterate constantly
2. **✨ Perfection Peak** - Craft experiences users will never forget
3. **🔬 Discovery Station** - Talk to users, validate everything
4. **📊 Data Constellation** - Metrics guide every decision
5. **🎯 Intuition Vortex** - Trust your gut, move on instinct
6. **🤝 Alignment Galaxy** - Bring everyone along on the journey
7. **🌪️ Chaos Cluster** - Embrace uncertainty, adapt constantly
8. **🎯 Focus Singularity** - Say no to everything but the one thing

---

## 🛠️ Development Roadmap

### ✅ Session 1: Foundation (COMPLETE)
- [x] Clone lenny-transcripts data (303 episodes)
- [x] Next.js 15 setup with TypeScript
- [x] Tailwind CSS with cosmic theme
- [x] 3D StarField background component
- [x] Animated landing page
- [x] Placeholder pages

### 🚧 Session 2: Quiz Flow (NEXT)
- [ ] Create 7 existential product questions
- [ ] Build quiz UI with smooth transitions
- [ ] Implement progress tracking
- [ ] Add answer state management

### 🔮 Session 3: Map Canvas
- [ ] Create 8 cosmic zones data
- [ ] Build interactive map with zoom/pan
- [ ] Implement scoring algorithm
- [ ] Add zone reveal animation

### 🤝 Session 4: Contradictions
- [ ] Create 15 PM debates from transcripts
- [ ] Build contradiction cards
- [ ] Add selection UI
- [ ] Refine philosophy based on selections

### 🎭 Session 5: Philosophy Card
- [ ] Generate unique philosophy profiles
- [ ] Create shareable card design
- [ ] Add Twitter/download sharing
- [ ] Implement html2canvas export

### 🚀 Session 6: Polish & Deploy
- [ ] Add loading states
- [ ] Error handling
- [ ] Performance optimization
- [ ] Deploy to Vercel

---

## 🎯 Design Philosophy

- **Zero API costs** - Everything runs client-side
- **Mobile-first** - Responsive from the start
- **Sci-fi aesthetic** - Honors Lenny's love of space opera
- **Shareable** - Built for virality and discussion
- **Nuanced** - Respects that product has no "right answers"

---

## 🌌 Inspiration

> "Every PM is lost somewhere in the Product Universe"

This project was inspired by:
- Lenny's Podcast (303 episodes of PM wisdom)
- *A Fire Upon the Deep* by Vernor Vinge (Lenny's favorite sci-fi)
- The nuance and contradictions in product thinking
- The need for PMs to discover their own philosophy

---

## 📝 License

MIT License - Feel free to use this as inspiration for your own PM tools!

---

## 🙏 Credits

Built with love for the PM community.

Special thanks to:
- **Lenny Rachitsky** for 303 incredible podcast episodes
- All the world-class PMs who shared their wisdom
- The open-source community for amazing tools

---

**Ready to discover your PM philosophy?**

Run `npm run dev` and begin your journey through the Product Universe 🚀
