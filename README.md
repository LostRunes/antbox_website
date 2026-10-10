# AntBox — story site

Vite + React + TypeScript + Motion (Framer Motion) + Lenis.

```bash
npm install
npm run dev      # http://localhost:5173 (also exposed on your LAN for phone testing)
npm run build && npm run preview
```

## Sections
1. Preloader: counter, logo pop, five-panel curtain wipe
2. Hero: split-text reveal, rotating word, parallax product chips, ants carrying boxes along a trail
3. Velocity marquee (skews/reverses with scroll speed)
4. **The story**: a thick purple path draws with scroll (`src/components/story/StorySection.tsx`), an ant rides the tip, and 5 illustrated scenes pop in when the line reaches them. Chapter 3 lets visitors type their name onto the AntBox screen; the footer greets them too.
5. Journey: pinned horizontal scroll through the 4 sprint steps
6. Stats with counters and the 88% readiness dial
7. Students / corporates toggle with 3D tilt cards
8. "Why AntBox" swipeable card deck
9. Tribe-analytics dashboard that tilts flat as it scrolls in
10. Footer: rotating Foundation Day badge, cursor-reactive wordmark

Characters are hand-built SVG (`story/Person.tsx` is a small poseable rig), so no image assets are needed.
Looping scene animations are CSS and pause while off-screen; everything animates transform/opacity only.
