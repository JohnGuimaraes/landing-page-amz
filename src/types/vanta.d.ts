declare module 'three' { const THREE: Record<string, unknown>; export = THREE; }
declare module 'p5' { const p5: unknown; export default p5; }
declare module 'vanta/src/_p5Base.js' { class P5Base { initThree(): void; resize(): void; initP5(p: { pixelDensity(value: number): void }): void; } export default P5Base; }
declare module 'vanta/src/vanta.topology.js' { const create: (options: Record<string, unknown>) => { destroy(): void }; export default create; }
declare module 'vanta/dist/vanta.halo.min.js' {
  const create: (options: Record<string, unknown>) => { destroy(): void; bufferTarget?: { dispose(): void }; bufferFeedback?: { dispose(): void }; renderer?: { dispose(): void; forceContextLoss(): void } };
  export default create;
}
