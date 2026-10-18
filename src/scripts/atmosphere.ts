import { scroll } from 'motion';
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three';

/** One lightweight scene whose only animated input is native scroll progress. */
export function initAtmosphere(): void {
  if (typeof window === 'undefined') return;
  const canvas = document.querySelector<HTMLCanvasElement>('[data-ambient-canvas]');
  if (!canvas) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = window.matchMedia('(max-width: 640px)');
  if (reducedMotion.matches || smallScreen.matches) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    return; // Keep the CSS atmosphere visible when WebGL is unavailable.
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uProgress: { value: 0 }, uSize: { value: [1, 1] } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.);}',
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform float uProgress;
      uniform vec2 uSize;
      void main(){
        float p=clamp(uProgress,0.0,1.0);
        float aspect=uSize.x/max(uSize.y,1.0);
        vec2 uv=vUv;
        float drift=mix(-.12,.12,smoothstep(0.0,1.0,p));
        float chapter=sin(p*6.2831853);
        vec2 center=vec2(aspect*(.78+drift),.56+.12*chapter);
        vec2 q=(uv-center)*vec2(.72,1.0);
        float glow=exp(-5.0*length(q));
        float bend=.37+.13*sin(p*6.2831853+uv.x*2.4);
        float ribbon=exp(-pow((uv.y-bend-.06*sin(uv.x*3.0+p*3.14159))*4.8,2.0));
        float reveal=smoothstep(-.25,.8,uv.x+drift);
        vec3 blue=vec3(.16,.43,.67);
        vec3 teal=vec3(.14,.49,.43);
        vec3 color=mix(blue,teal,clamp(.24+.32*p+.2*uv.y,0.0,1.0));
        float alpha=(glow*.17+ribbon*.045)*reveal;
        gl_FragColor=vec4(color,clamp(alpha,0.0,.19));
      }`,
  });
  const mesh = new Mesh(new PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const render = () => renderer.render(scene, camera);
  const resize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    renderer.setSize(width, height, false);
    material.uniforms.uSize.value = [width, height];
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(document.documentElement);
  resize();

  let stopScroll = () => {};
  const handleScroll = (progress: number) => {
    material.uniforms.uProgress.value = progress;
    if (!document.hidden) render();
  };
  stopScroll = scroll(handleScroll);
  const onVisibility = () => { if (!document.hidden) render(); };
  const onMotionPreference = () => {
    if (reducedMotion.matches) {
      stopScroll();
      material.uniforms.uProgress.value = 0;
      render();
    } else stopScroll = scroll(handleScroll);
  };
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', onMotionPreference);

  window.addEventListener('pagehide', () => {
    stopScroll();
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reducedMotion.removeEventListener('change', onMotionPreference);
    mesh.geometry.dispose();
    material.dispose();
    renderer.dispose();
  }, { once: true });
}
