import { animate, inView, scroll } from 'motion';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeSmoothstep = (value: number) => value * value * (3 - 2 * value);
const easeEditorial = [0.22, 1, 0.36, 1] as const;

/** One reversible Motion scroll timeline coordinates the page's editorial cues. */
export function initPageMotion(): void {
  if (typeof window === 'undefined') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stackedPrints = window.matchMedia('(max-width: 760px)');
  const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  const track = document.querySelector<HTMLElement>('[data-chapter-track]');
  const deck = document.querySelector<HTMLElement>('[data-chapter-deck]');
  const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-step]'));
  const markers = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-marker]'));
  const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-scene]'));
  const ecosystemPanel = scenes.find((scene) => scene.dataset.scrollScene === 'ecosystem')?.querySelector<HTMLElement>('.ecosystem-panel');
  const ecosystemRadius = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius-lg')) || 24;
  const editorialItems = Array.from(document.querySelectorAll<HTMLElement>('[data-editorial-item]'));
  const journeySteps = Array.from(document.querySelectorAll<HTMLElement>('[data-journey-step]'));
  const projectsScene = scenes.find((scene) => scene.dataset.scrollScene === 'projects');
  const scrollRevealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'));
  const editorialPrints = Array.from(document.querySelectorAll<HTMLElement>('[data-editorial-print]'));
  const showcaseComposition = projectsScene?.querySelector<HTMLElement>('.showcase-composition');
  const cleanups: Array<() => void> = [];
  const maskAnimations = new Map<HTMLElement, ReturnType<typeof animate>>();
  let markerTops: number[] = [];
  let trackTop = 0;
  let trackBottom = 0;
  let deckHeight = 0;
  let stickyTop = 0;
  let sceneMetrics: Array<{ element: HTMLElement; top: number; height: number }> = [];
  let staticStackApplied = false;
  const editorialGroups = new Map<HTMLElement, HTMLElement[]>();

  editorialItems.forEach((item) => {
    const section = item.closest<HTMLElement>('[data-scroll-scene]');
    if (!section) return;
    const group = editorialGroups.get(section) ?? [];
    group.push(item);
    editorialGroups.set(section, group);
  });

  const measureStack = () => {
    const scrollY = window.scrollY;
    markerTops = markers.map((marker) => marker.getBoundingClientRect().top + scrollY);
    if (track) {
      const rect = track.getBoundingClientRect();
      trackTop = rect.top + scrollY;
      trackBottom = rect.bottom + scrollY;
    }
    if (deck) {
      deckHeight = deck.offsetHeight;
      stickyTop = Number.parseFloat(getComputedStyle(deck).top) || window.innerHeight * .06;
    }
    sceneMetrics = scenes.map((element) => {
      const rect = element.getBoundingClientRect();
      return { element, top: rect.top + scrollY, height: rect.height };
    });
  };

  const setStaticStack = () => {
    if (staticStackApplied) return;
    steps.forEach((step) => {
      step.dataset.visible = 'true';
      step.dataset.active = 'true';
      step.style.opacity = '1';
      step.style.visibility = 'visible';
      step.style.setProperty('--stack-y', '0px');
      step.dataset.depth = '0';
      step.style.zIndex = '';
      step.style.setProperty('--deck-exit-y', '0px');
    });
    staticStackApplied = true;
  };

  const stackEntryRange = (index: number) => {
    const viewport = Math.max(1, window.innerHeight);
    return {
      start: index === 0
        ? trackTop - stickyTop - viewport * .48
        : (markerTops[index - 1] ?? trackTop) - viewport * .32,
      duration: viewport * (index === 0 ? .48 : .54),
    };
  };

  const updateStack = (scrollY: number) => {
    if (reducedMotion.matches || window.innerWidth <= 700 || !track || !deck || !steps.length) {
      setStaticStack();
      return;
    }
    staticStackApplied = false;

    const viewport = Math.max(1, window.innerHeight);
    const entry = steps.map((_, index) => {
      const { start, duration } = stackEntryRange(index);
      return easeSmoothstep(clamp01((scrollY - start) / Math.max(1, duration)));
    });

    // Card 01 is the base of the stack as soon as this scene begins.
    entry[0] = 1;
    let activeIndex = 0;
    entry.forEach((value, index) => {
      if (value > .005) activeIndex = index;
    });
    const entryOffset = Math.max(0, viewport - stickyTop);
    const layerOffset = window.innerWidth <= 960 ? 26 : 28;

    steps.forEach((step, index) => {
      // Keep cards in the DOM; future cards wait below the viewport and rise with their own scroll progress.
      const visible = true;
      if (step.dataset.visible !== String(visible)) step.dataset.visible = String(visible);
      const activeValue = String(index === activeIndex);
      if (step.dataset.active !== activeValue) step.dataset.active = activeValue;
      if (step.style.opacity !== '1') step.style.opacity = '1';
      if (step.style.visibility !== 'visible') step.style.visibility = 'visible';
      const ownProgress = index === 0 ? 1 : entry[index] ?? 0;
      const priorProgress = entry.slice(0, index).reduce((sum, value) => sum + value, 0);
      const stackY = `${Math.round((index === 0 ? 0 : entryOffset * (1 - ownProgress)) + priorProgress * layerOffset)}px`;
      if (step.style.getPropertyValue('--stack-y') !== stackY) step.style.setProperty('--stack-y', stackY);
      const depth = entry.slice(index + 1).filter((value) => value >= .995).length;
      if (step.dataset.depth !== String(Math.min(3, depth))) step.dataset.depth = String(Math.min(3, depth));
      step.style.zIndex = String(index + 1);
    });

    const stackRelease = trackBottom - deckHeight - stickyTop;
    const exitDuration = viewport * (window.innerWidth <= 700 ? .24 : .28);
    const exitStart = stackRelease - exitDuration;
    const exit = clamp01((scrollY - exitStart) / Math.max(1, stackRelease - exitStart));
    steps.forEach((step) => {
      const exitY = `${Math.round(-viewport * (window.innerWidth <= 700 ? .12 : .14) * exit * 10) / 10}px`;
      if (step.style.getPropertyValue('--deck-exit-y') !== exitY) step.style.setProperty('--deck-exit-y', exitY);
    });
  };

  const getProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp01(window.scrollY / max) : 0;
  };

  const sceneProgress = (scene: HTMLElement, top: number, height: number, scrollY: number, viewport: number) => {
    const offset = top - scrollY;
    const kind = scene.dataset.scrollScene;
    if (kind === 'hero') return clamp01(-offset / Math.max(1, height * .56));
    if (kind === 'ecosystem') return clamp01((viewport - offset) / Math.max(1, viewport));
    return clamp01((viewport - offset) / Math.max(1, viewport + height));
  };

  const updateEditorialItems = () => {
    editorialGroups.forEach((items, section) => {
      const progress = Number(section.style.getPropertyValue('--scene-progress')) || 0;
      items.forEach((item, index) => {
        const itemProgress = clamp01((progress - index * .12) / .62);
        const value = reducedMotion.matches ? '1' : itemProgress.toFixed(3);
        if (item.style.getPropertyValue('--editorial-progress') !== value) item.style.setProperty('--editorial-progress', value);
      });
    });

    const compositionRect = !reducedMotion.matches && !stackedPrints.matches
      ? showcaseComposition?.getBoundingClientRect()
      : undefined;
    const compositionCenter = compositionRect ? compositionRect.top + compositionRect.height / 2 : window.innerHeight;
    const centerProgress = clamp01((window.innerHeight * 1.04 - compositionCenter) / (window.innerHeight * .54));
    // Read all mobile geometry before writing styles; desktop keeps its shared timeline.
    const printCenters = !reducedMotion.matches && stackedPrints.matches
      ? editorialPrints.map((print) => {
        const rect = print.getBoundingClientRect();
        return rect.top + rect.height / 2;
      })
      : [];
    editorialPrints.forEach((print, index) => {
      const stagger = index * .06;
      const entry = reducedMotion.matches ? 1 : stackedPrints.matches
        ? clamp01((window.innerHeight * .98 - printCenters[index]) / (window.innerHeight * .46))
        : clamp01((centerProgress - stagger) / (1 - stagger));
      const printProgress = easeSmoothstep(entry);
      const value = reducedMotion.matches ? '1' : printProgress.toFixed(3);
      if (print.style.getPropertyValue('--print-progress') !== value) print.style.setProperty('--print-progress', value);
    });

    scrollRevealItems.forEach((item) => {
      const section = item.closest<HTMLElement>('[data-scroll-scene]');
      const progress = Number(section?.style.getPropertyValue('--scene-progress')) || 0;
      const revealProgress = easeSmoothstep(clamp01((progress - .015) / .28));
      const value = reducedMotion.matches ? '1' : revealProgress.toFixed(3);
      if (item.style.getPropertyValue('--scroll-reveal-progress') !== value) item.style.setProperty('--scroll-reveal-progress', value);
    });
  };

  const updateJourney = () => {
    const section = journeySteps[0]?.closest<HTMLElement>('[data-scroll-scene]');
    const progress = Number(section?.style.getPropertyValue('--scene-progress')) || 0;
    journeySteps.forEach((step, index) => {
      const stepProgress = easeSmoothstep(clamp01((progress - index * .065) / .34));
      const iconProgress = easeSmoothstep(clamp01((stepProgress - .16) / .66));
      const value = reducedMotion.matches ? '1' : stepProgress.toFixed(3);
      if (step.style.getPropertyValue('--journey-progress') !== value) step.style.setProperty('--journey-progress', value);
      const iconValue = reducedMotion.matches ? '1' : iconProgress.toFixed(3);
      if (step.style.getPropertyValue('--icon-progress') !== iconValue) step.style.setProperty('--icon-progress', iconValue);
      const active = String(reducedMotion.matches || stepProgress >= .72);
      if (step.dataset.active !== active) step.dataset.active = active;
    });

  };

  const updateFromScroll = (progress: number) => {
    const normalized = clamp01(progress);
    const scrollY = window.scrollY;
    const viewport = Math.max(1, window.innerHeight);
    if (progressBar) progressBar.style.transform = `scaleX(${normalized})`;

    sceneMetrics.forEach(({ element: scene, top, height }) => {
      const value = reducedMotion.matches ? 1 : sceneProgress(scene, top, height, scrollY, viewport);
      const progressValue = value.toFixed(3);
      if (scene.style.getPropertyValue('--scene-progress') !== progressValue) scene.style.setProperty('--scene-progress', progressValue);
      if (scene.dataset.scrollScene === 'ecosystem') {
        const radius = `${ecosystemRadius * (1 - value)}px`;
        if (ecosystemPanel?.style.getPropertyValue('--scene-radius') !== radius) ecosystemPanel?.style.setProperty('--scene-radius', radius);
      }
    });

    updateStack(scrollY);
    updateJourney();
    updateEditorialItems();
  };

  measureStack();
  updateFromScroll(getProgress());
  cleanups.push(scroll(updateFromScroll));

  // Transformed sticky cards are not stable native fragment-scroll destinations.
  // Navigate to the point where the requested card has completed its existing entry.
  let chapterNavigationFrame = 0;
  const navigateChapter = (hash: string, behavior: ScrollBehavior, focus = false) => {
    if (reducedMotion.matches || window.innerWidth <= 700 || !track || !deck) return false;
    const index = steps.findIndex(step => `#${step.id}` === hash);
    if (index < 0) return false;
    measureStack();
    const { start, duration } = stackEntryRange(index);
    const top = index === 0 ? trackTop - stickyTop : start + duration + 1;
    window.scrollTo({ top: Math.max(0, top), behavior });
    if (focus) {
      const target = steps[index];
      const hadTabindex = target.hasAttribute('tabindex');
      if (!hadTabindex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (!hadTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    return true;
  };
  const onChapterLink = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    if (!navigateChapter(url.hash, 'smooth', true)) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
  };
  const restoreChapterFragment = () => {
    cancelAnimationFrame(chapterNavigationFrame);
    chapterNavigationFrame = requestAnimationFrame(() => navigateChapter(location.hash, 'instant'));
  };
  document.addEventListener('click', onChapterLink);
  window.addEventListener('hashchange', restoreChapterFragment);
  restoreChapterFragment();
  cleanups.push(() => {
    cancelAnimationFrame(chapterNavigationFrame);
    document.removeEventListener('click', onChapterLink);
    window.removeEventListener('hashchange', restoreChapterFragment);
  });

  const heroLines = Array.from(document.querySelectorAll<HTMLElement>('.hero .hero-line'));
  const heroMark = document.querySelector<HTMLElement>('.hero .hero-mark');
  const heroAccent = document.querySelector<HTMLElement>('.hero .hero-accent');
  const heroDescription = document.querySelector<HTMLElement>('.hero .hero-description');
  const heroActions = Array.from(document.querySelectorAll<HTMLElement>('.hero .hero-actions > *'));
  const heroAnimationCleanups: Array<() => void> = [];
  if (!reducedMotion.matches) {
    heroLines.forEach((element, index) => {
      const animation = animate(element, { y: ['0.16em', '0em'], opacity: [0, 1] }, {
        duration: .72,
        delay: index * .15,
        ease: easeEditorial,
      });
      heroAnimationCleanups.push(() => animation.stop());
    });
    if (heroAccent) {
      const animation = animate(heroAccent, { scaleX: [0, 1], opacity: [0, 1] }, {
        duration: .36,
        delay: .88,
        ease: easeEditorial,
      });
      heroAnimationCleanups.push(() => animation.stop());
    }
    if (heroMark) {
      const animation = animate(heroMark, { opacity: [0, .98], y: [8, 0], scale: [.985, 1] }, {
        duration: .72,
        delay: .08,
        ease: easeEditorial,
      });
      heroAnimationCleanups.push(() => animation.stop());
    }
    if (heroDescription) {
      const animation = animate(heroDescription, { opacity: [0, 1], y: [10, 0] }, {
        duration: .5,
        delay: .35,
        ease: easeEditorial,
      });
      heroAnimationCleanups.push(() => animation.stop());
    }
    heroActions.forEach((element, index) => {
      const animation = animate(element, { opacity: [0, 1], y: [10, 0] }, {
        duration: .48,
        delay: .55 + index * .08,
        ease: easeEditorial,
      });
      heroAnimationCleanups.push(() => animation.stop());
    });
    cleanups.push(...heroAnimationCleanups);

    document.querySelectorAll<HTMLElement>('[data-reveal-mask]').forEach((element) => {
      const stopObserving = inView(element, () => {
        if (reducedMotion.matches) { element.style.clipPath = 'none'; return; }
        const animation = animate(element, { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] }, {
          duration: .7,
          ease: easeEditorial,
        });
        maskAnimations.set(element, animation);
        return () => {
          animation.stop();
          element.style.clipPath = 'none';
          maskAnimations.delete(element);
        };
      }, { margin: '0px 0px -120px 0px' });
      cleanups.push(stopObserving);
    });
  }

  const onResize = () => {
    measureStack();
    updateFromScroll(getProgress());
  };
  const traceObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(onResize);
  if (traceObserver) {
    if (projectsScene) traceObserver.observe(projectsScene);
    const showcase = projectsScene?.querySelector<HTMLElement>('.showcase-composition');
    if (showcase) traceObserver.observe(showcase);
    cleanups.push(() => traceObserver.disconnect());
  }
  const onMotionPreference = () => {
    if (reducedMotion.matches) {
      maskAnimations.forEach((animation, element) => {
        animation.stop();
        element.style.clipPath = 'none';
      });
      maskAnimations.clear();
      heroAnimationCleanups.forEach((stop) => stop());
      heroLines.forEach((element) => { element.style.transform = 'none'; });
      heroLines.forEach((element) => { element.style.opacity = '1'; });
      if (heroMark) { heroMark.style.opacity = '1'; heroMark.style.transform = 'none'; }
      if (heroAccent) { heroAccent.style.opacity = '1'; heroAccent.style.transform = 'none'; }
      if (heroDescription) { heroDescription.style.opacity = '1'; heroDescription.style.transform = 'none'; }
      heroActions.forEach((element) => { element.style.opacity = '1'; element.style.transform = 'none'; });
    }
    measureStack();
    updateFromScroll(getProgress());
  };

  window.addEventListener('resize', onResize, { passive: true });
  document.fonts?.ready.then(onResize);
  reducedMotion.addEventListener('change', onMotionPreference);
  stackedPrints.addEventListener('change', onResize);
  cleanups.push(() => window.removeEventListener('resize', onResize));
  cleanups.push(() => reducedMotion.removeEventListener('change', onMotionPreference));
  cleanups.push(() => stackedPrints.removeEventListener('change', onResize));
  cleanups.push(() => { maskAnimations.forEach((animation) => animation.stop()); maskAnimations.clear(); });
  window.addEventListener('pagehide', () => cleanups.forEach((cleanup) => cleanup()), { once: true });
}
