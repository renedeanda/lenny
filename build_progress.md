# Lenny's PM Philosophy Map - Build Progress

## Current Status (January 2026)

### Episode Coverage
- **Current:** 8/303 episodes curated (2.6%)
- **Target:** 100+ episodes (33%)
- **Curated Episodes:**
  - chaos zone: 4 episodes (need 6 more for 10)
  - data zone: 5 episodes (need 5 more for 10)
  - perfection, discovery, alignment: 6 episodes each (need 4 more each for 10)

### Verified Quotes
- **Total:** 91 verified quotes across 8 episodes
- **Quality:** Timestamps verified, no quotes from first 5 minutes

---

## High Priority Quality Fixes (IN PROGRESS)

### 🐛 Critical Bugs
- [ ] **Transcript search index bug**: Clicking search results navigates to wrong transcript segment (goes to actual 4th segment instead of 4th search result)
- [ ] **Dynamic sitemap domain**: Currently using `localhost` instead of `lenny.productbuilder.net`

### 🎨 UX Improvements
- [ ] **Make YouTube video sticky**: Transcript should scroll behind video instead of scrolling video up
- [ ] **Remove/downplay 3D map**: Currently confusing, doesn't add value
- [ ] **Remove zone reference tags**: Zone tags on verified quotes in episode pages are confusing

### 🔍 SEO & Analytics
- [ ] **Fix SEO metadata**: Audit all pages for outdated/bad SEO, ensure using correct domain
- [ ] **Add Google Analytics**: Implement GA4 using `NEXT_PUBLIC_GA_ID` env variable
- [ ] **Sitemap domain fix**: Update all references from localhost to lenny.productbuilder.net

---

## Major Feature Redesign (PLANNED)

### Philosophy Quiz Results Transformation
Current system just shows zone name - needs complete rethink.

**New Vision: Podcast Recommendation Engine**
1. **Primary Recommendations**: Show 3-5 podcast episodes that match user's philosophy
   - Include specific verified quotes that align with their answers
   - Show guest names and episode titles
   - Link to /explore episode pages
   - Make results shareable

2. **Contrarian Recommendations**: Show podcast episodes that challenge their worldview
   - "These episodes offer different perspectives to help you grow"
   - 2-3 episodes with opposing viewpoints
   - Encourage intellectual diversity

3. **Personal Insights**: Fun shareable insights
   - "You think like Brian Chesky (85% match)" with quote evidence
   - Philosophy strengths
   - Growth areas

4. **Quote-Based Evidence**:
   - Map quiz answers directly to specific verified quotes
   - Show actual PM wisdom instead of abstract zone names
   - Build trust through concrete examples

**Requirements:**
- Quiz results must be very accurate for recommendations to work
- Need robust quote-matching algorithm
- Integrate with /explore section seamlessly

---

## Data Quality Improvements (NEXT PHASE)

### Before Curating More Episodes
1. **Timestamp Accuracy Audit**
   - Validate all 8 curated episodes
   - Ensure timestamps match actual transcript locations
   - Cross-reference with YouTube player

2. **Quote Quality Standards**
   - Remove any quotes from first 5 minutes (if any remain)
   - Evaluate if line numbers add value (consider removing)
   - Ensure all quotes are substantive PM insights

3. **Metadata Consistency**
   - Standardize guest names
   - Verify episode titles
   - Check YouTube URLs

### Quote-Matching System Design
- [ ] Design algorithm to match quiz answers to quotes
- [ ] Build scoring system for quote relevance
- [ ] Create "contrarian" detection logic
- [ ] Test with existing 91 quotes

---

## Curation Pipeline (AFTER QUALITY FIXES)

### Target: 100+ Episodes

**Priority Zones (need more coverage):**
- Chaos zone: +6 episodes (currently 4)
- Data zone: +5 episodes (currently 5)
- Perfection zone: +4 episodes (currently 6)
- Discovery zone: +4 episodes (currently 6)
- Alignment zone: +4 episodes (currently 6)

**Quality Standards:**
- No quotes from first 5 minutes
- All timestamps verified
- Minimum 8-15 quotes per episode
- Diverse guest perspectives

---

## Developer Experience Improvements

### Claude Skills to Create
Following `/skills/curate-episode/skill.yaml` format:

1. **verify-seo skill**: Check SEO metadata across site
   - Validate meta tags
   - Check OG images
   - Verify canonical URLs
   - Scan for outdated domain references

2. **verify-sitemap skill**: Validate sitemap.xml
   - Check for localhost references
   - Validate all URLs are reachable
   - Ensure proper lastmod dates

3. **update-og-images skill**: Update OpenGraph images
   - Generate new OG images
   - Update metadata
   - Validate image paths

**Folder Structure:**
```
/skills/
  verify-seo/
    skill.yaml
  verify-sitemap/
    skill.yaml
  update-og-images/
    skill.yaml
  curate-episode/
    skill.yaml (existing)
```

---

## Technical Debt

- [ ] Remove unused 3D visualization code
- [ ] Clean up zone reference tag components
- [ ] Refactor results calculation logic
- [ ] Optimize transcript search indexing

---

## Future Enhancements (BACKLOG)

### Phase 2 Ideas
- Guest alignment matching system
- Philosophy comparison with friends
- Time-series: "How your philosophy evolves"
- Episode bookmarking
- Custom playlists based on philosophy

### Analytics & Insights
- Track most popular quiz paths
- Identify most influential quotes
- A/B test different recommendation algorithms
- Measure engagement with contrarian recommendations

---

## Notes

**Design Philosophy:**
- Quote-based evidence > Abstract concepts
- Podcast discovery > Static results
- Intellectual growth > Echo chambers
- Simplicity > Feature bloat

**Success Metrics:**
- Quiz completion rate
- Episode click-through from results
- Social shares of results
- Return visits to /explore

---

## Recent Wins ✅

- ✅ Fixed YouTube embeds on episode pages
- ✅ Fixed verified quotes timestamp accuracy
- ✅ Improved quote display on results page
- ✅ Enhanced zone exploration UX
- ✅ Removed contradictions UI (confusing)
- ✅ Created curate-episode skill for efficient quote extraction
- ✅ 91 verified quotes across 8 episodes

---

**Last Updated:** January 22, 2026
**Current Branch:** claude/rethink-philosophy-calculation-3wgE6
