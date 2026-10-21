# AMZ Data Software — landing starter v0.1

Foundation-first starter for the institutional AMZ website. **Not a final approved design or website.**

## Stack
- Astro + TypeScript (static site)
- Motion.dev 14.3.0 (`animate`, `inView`, `scroll`)
- CSS moderno com scroll nativo e animações reduzidas por `prefers-reduced-motion`
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
- `/` — provisional institutional narrative from Hero through final CTA.
- `/design-system` — visual component/tokens style guide.

## Key folders
- `src/styles/tokens.css` — source of truth for colors, type, spacing and motion.
- `src/styles/global.css` — global resets, shared editorial classes, accessibility.
- `src/components/ui` — shared brand mark and button.
- `src/components/sections` — editorial sections coordinated as one scroll narrative, including the atmosphere/ecosystem transition.
- `src/components/graphics/Atmosphere.astro` — CSS ambient layer linked to scroll progress.
- `src/scripts/pageMotion.ts` — shared reversible scroll progress, masked editorial reveals, Hero entrance, chapter stack, ambient flow, and journey cues.
- `src/config/site.ts` — safe single source for navigation and official data.
- `docs/` — design system, decisions, content checklist.

## Local validation
- `npm install` — dependencies installed from the existing manifest; no animation library was added.
- `npm run check` — passed with no errors or warnings.
- `npm run build` — run locally to validate the current routes.
- `npm run dev` — serves the project at `http://localhost:4321/`; Astro watches source files for live updates.

Motion.dev uses one `scroll()` subscription to coordinate progress, chapter stacking, atmosphere, the ecosystem connection lines, solution compositions, and the approach trajectory. The sequence is reversible and keeps native page scrolling. Reduced motion makes content static and returns chapter cards to normal document flow. The separate `preview.html` files are visual snapshots, not the source of either Astro route.

The brand mark is temporary, and solution media, process copy, institutional messaging, and project evidence remain placeholders for later validation. Do not publish unchanged.
