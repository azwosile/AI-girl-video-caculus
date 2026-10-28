// node smoke.js <webdir> : 用桩 canvas 跑一遍所有帧，查运行时错误
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = process.argv[2];
const noop = () => {}; const grad = { addColorStop: noop };
const ctx = new Proxy({}, { get: (o, k) => k in o ? o[k] : (k === 'measureText' ? (s => ({ width: String(s).length * 20 })) : (k.startsWith('create') ? () => grad : (k === 'getImageData' ? () => ({ data: [] }) : noop))), set: (o, k, v) => (o[k] = v, true) });
const canvas = { getContext: () => ctx, width: 1920, height: 1080, toDataURL: () => '' };
const sb = { window: {}, document: { getElementById: () => canvas, createElement: () => ({ getContext: () => ctx, width: 0, height: 0 }), fonts: { load: async () => {}, ready: Promise.resolve() } }, Image: function () { this.width = 100; this.height = 100; }, performance: { now: () => 0 }, requestAnimationFrame: noop, console, Math, Promise };
sb.window = sb; sb.window.__EXPORT__ = true; vm.createContext(sb);
const durf = path.join(dir, 'durations.json'); if (fs.existsSync(durf)) sb.DUR = JSON.parse(fs.readFileSync(durf));
for (const f of ['lines.js', 'seg.js', 'core.js', 'kit.js', 'scenes0_kit.js', 'scenes.js']) {
  const p = fs.existsSync(path.join(dir, f)) ? path.join(dir, f) : path.join(dir, '../../shared', f);
  vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: f });
}
const tl = sb.TIMELINE; let n = 0;
for (let t = 0; t < tl.total; t += 1 / 30) { sb.renderAt(t); n++; }
console.log('ok frames', n, 'total', tl.total.toFixed(2), 'blocks', tl.blocks.map(b => b.b + '@' + b.t0.toFixed(1)).join(' '));
