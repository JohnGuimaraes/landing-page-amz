import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  server: { host: '0.0.0.0' },
  // Prebundle lazy UMD dependencies up front in dev; avoids stale optimized URLs
  // when the contact effect is reached for the first time. Production stays lazy.
  vite: { optimizeDeps: {
    include: ['p5', 'three', 'vanta/dist/vanta.halo.min.js'],
    exclude: ['vanta/src/vanta.topology.js', 'vanta/src/_p5Base.js'],
  } },
});
