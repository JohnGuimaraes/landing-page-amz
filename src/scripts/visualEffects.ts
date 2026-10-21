import { visualPalettes } from '../config/visualPalettes';

type Effect = { destroy(): void; bufferTarget?: { dispose(): void }; bufferFeedback?: { dispose(): void }; renderer?: { dispose(): void; forceContextLoss(): void }; p5?: { frameRate(value: number): void } };

export function initVisualEffects(): void {
  const surfaces = [...document.querySelectorAll<HTMLElement>('[data-vanta-effect]')];
  if (!surfaces.length) return;
  const palette = visualPalettes[Math.floor(Math.random() * visualPalettes.length)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Both engines are intentionally skipped on small screens and data-saving connections.
  const small = matchMedia('(max-width: 767px)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const topologyModules = surfaces.some(el => el.dataset.vantaEffect === 'topology')
    && !reduced.matches && !small.matches && !connection?.saveData
    ? Promise.all([import('p5'), import('../lib/vantaTopology')])
    : null;
  // p5 1.x defers setup until load. Construct it only afterwards so destroy()
  // always owns the created sketch, including very fast scroll-away scenarios.
  const pageReady = document.readyState === 'complete' ? Promise.resolve() : new Promise<void>(resolve => {
    window.addEventListener('load', () => resolve(), { once: true });
  });
  const records = surfaces.map(el => ({ el, instance: null as Effect | null, visible: false, generation: 0, failed: false, width: el.clientWidth, height: el.clientHeight, resizeTimer: 0 }));
  let stopped = false;

  const dispose = (instance: Effect) => {
    // HALO's upstream destroy does not dispose its two feedback render targets.
    instance.bufferTarget?.dispose();
    instance.bufferFeedback?.dispose();
    const renderer = instance.renderer;
    instance.destroy();
    renderer?.dispose();
    renderer?.forceContextLoss();
  };
  const update = async (record: typeof records[number]) => {
    const generation = ++record.generation;
    const allowed = !stopped && !document.hidden && record.visible && !reduced.matches && !small.matches && !connection?.saveData && !record.failed;
    if (!allowed) {
      window.clearTimeout(record.resizeTimer);
      record.resizeTimer = 0;
      if (record.instance) dispose(record.instance);
      record.instance = null;
      record.el.dataset.effectState = record.failed ? 'fallback' : 'static';
      return;
    }
    if (record.instance) return;
    record.el.dataset.effectState = 'loading';
    const current = () => generation === record.generation && !stopped;
    try {
      let create: (options: Record<string, unknown>) => Effect;
      let engine: Record<string, unknown>;
      if (record.el.dataset.vantaEffect === 'halo') {
        const [three, effect] = await Promise.all([import('three'), import('vanta/dist/vanta.halo.min.js')]);
        create = effect.default;
        engine = { THREE: three };
      } else {
        const [p5, effect] = await (topologyModules ?? Promise.all([import('p5'), import('../lib/vantaTopology')]));
        await pageReady;
        create = effect.default;
        engine = { p5: p5.default };
      }
      if (!current()) return;
      const instance = create({
        el: record.el, ...engine, mouseControls: false, touchControls: false, gyroControls: false,
        minHeight: 100, minWidth: 100, scale: 2, scaleMobile: 2,
        backgroundColor: palette.background,
        ...(record.el.dataset.vantaEffect === 'halo'
          ? { baseColor: palette.base, color2: palette.haloAccent, size: 1.4, amplitudeFactor: .4, speed: .16, xOffset: .1, yOffset: -.18 }
          : { color: palette.accent }),
      });
      if (!current()) { dispose(instance); return; }
      record.instance = instance;
      if (typeof instance.p5?.frameRate === 'function') instance.p5.frameRate(30);
      record.el.dataset.effectState = 'active';
    } catch (error) {
      if (!current()) return;
      if (record.instance) dispose(record.instance);
      record.instance = null;
      if (import.meta.env.DEV) console.warn('Decorative effect could not initialize:', error);
      record.failed = true;
      record.el.dataset.effectState = 'fallback';
      // The decorative layer is expendable; the static composition remains readable.
    }
  };
  records.forEach(({ el }) => {
    el.dataset.palette = palette.name;
    el.style.setProperty('--effect-bg', `#${palette.background.toString(16).padStart(6, '0')}`);
    const accent = el.dataset.vantaEffect === 'halo' ? palette.haloAccent : palette.accent;
    el.style.setProperty('--effect-accent', `#${accent.toString(16).padStart(6, '0')}`);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const record = records.find(item => item.el === entry.target)!;
      record.visible = entry.isIntersecting;
      void update(record);
    });
  }, { threshold: 0, rootMargin: '0px' });
  records.forEach(record => observer.observe(record.el));
  // TOPOLOGY captures its flow-grid dimensions in setup. Recreate after a
  // settled resize rather than stretching the old field into the new surface.
  const sizes = new ResizeObserver(entries => entries.forEach(entry => {
    const record = records.find(item => item.el === entry.target)!;
    const width = record.el.clientWidth;
    const height = record.el.clientHeight;
    const changed = Math.abs(width - record.width) > 2 || Math.abs(height - record.height) > 2;
    record.width = width;
    record.height = height;
    if (!changed || record.el.dataset.vantaEffect !== 'topology' || (!record.instance && !record.resizeTimer)) return;
    ++record.generation;
    if (record.instance) dispose(record.instance);
    record.instance = null;
    record.el.dataset.effectState = 'static';
    window.clearTimeout(record.resizeTimer);
    record.resizeTimer = window.setTimeout(() => { record.resizeTimer = 0; void update(record); }, 180);
  }));
  records.forEach(record => sizes.observe(record.el));
  const refresh = () => records.forEach(record => void update(record));
  reduced.addEventListener('change', refresh);
  small.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', refresh);
  // BFCache restores the same palette and observer without orphaned loops.
  const onHide = () => { stopped = true; refresh(); };
  const onShow = () => { stopped = false; refresh(); };
  window.addEventListener('pagehide', onHide);
  window.addEventListener('pageshow', onShow);
}
