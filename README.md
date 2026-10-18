# AMZ Data Software — landing starter v0.1

Foundation-first starter for the institutional AMZ website. **Not a final approved design or website.**

## Stack
- Astro + TypeScript (static site)
- Motion.dev 14.3.0 (`animate`, `inView`, `scroll`)
- Three.js 0.186.1 (subtle shader-based atmosphere; CSS fallback)
- Vanilla CSS design tokens. No React, Tailwind, GSAP, Lenis or Rive.

## Run
```bash
npm install
npm run dev
# open http://localhost:4321
npm run check
npm run build
```

## Routes
- `/` — initial institutional page structure.
- `/design-system` — visual component/tokens style guide.

## Key folders
- `src/styles/tokens.css` — source of truth for colors, type, spacing and motion.
- `src/styles/global.css` — global resets, shared editorial classes, accessibility.
- `src/components/ui` — shared brand mark and button.
- `src/components/sections` — independent editorial sections.
- `src/components/graphics/Atmosphere.astro` — WebGL layer with static CSS fallback.
- `src/scripts/pageMotion.ts` — motion and native scroll progress.
- `src/config/site.ts` — safe single source for navigation and official data.
- `docs/` — design system, decisions, content checklist.

## Local validation
- `npm install` — dependencies installed from the existing manifest; no animation library was added.
- `npm run check` — passed with no errors or warnings.
- `npm run build` — passed and generated both routes. Vite reports the lazy Three.js atmosphere chunk at about 515 kB (130 kB gzip), above its 500 kB advisory threshold.
- `npm run dev` — serves the project at `http://localhost:4321/`; Astro watches source files for live updates.

The global atmosphere is loaded only where its canvas is present. It uses the existing Three.js dependency, follows Motion scroll progress, and retains a CSS fallback. The separate `preview.html` files are visual snapshots, not the source of either Astro route.

The brand mark is temporary, and solution media, process copy, institutional messaging, and project evidence remain placeholders for later validation. Do not publish unchanged.
