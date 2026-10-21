import P5Base from 'vanta/src/_p5Base.js';
import topology from 'vanta/src/vanta.topology.js';

// Vanta 0.5.24's p5 base inherits initThree() and emits a misleading warning.
// Override only the p5-specific base: no renderer, global THREE, extra engine,
// source copy or node_modules edits. HALO uses its separate published bundle.
P5Base.prototype.initThree = function () {};
// Upstream resizeCanvas() redraws against the old captured flow grid and can
// throw before ResizeObserver runs. The existing manager owns settled resize
// via destroy/recreate, so never resize this sketch's live grid in place.
P5Base.prototype.resize = function () {};
// The Hero is a larger surface. Keep one backing pixel per CSS pixel even on
// high-DPI screens; p5 does not use Vanta's Three-specific scale option.
const initP5 = P5Base.prototype.initP5;
P5Base.prototype.initP5 = function (p) {
  p.pixelDensity(1);
  initP5.call(this, p);
};
export default topology;
