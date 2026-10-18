import { animate, inView, scroll } from 'motion';

export function initPageMotion(): void {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (reduced) return;

  const cleanups: Array<() => void> = [];
  // The page stays completely visible if JS or Motion fails.
  const observer = inView('[data-reveal]', (element) => {
    animate(element, { opacity: [0, 1], y: [20, 0] }, { duration: .72, ease: [0.22, 1, 0.36, 1] });
  }, { margin: '0px 0px -60px 0px' });
  cleanups.push(() => observer());
  if (progress) cleanups.push(scroll(animate(progress, { scaleX: [0, 1] }, { ease: 'linear' })));

  document.querySelectorAll<HTMLElement>('[data-chapter-step]').forEach((step) => {
    const card = step.querySelector<HTMLElement>('.chapter-card');
    if (!card) return;
    cleanups.push(scroll(
      animate(card, { opacity: [.66, 1], scale: [.93, 1], y: [32, 0] }, { ease: 'linear' }),
      { target: step, offset: ['start end', 'center center'] },
    ));
  });

  window.addEventListener('pagehide', () => cleanups.forEach((cleanup) => cleanup()), { once: true });
}
