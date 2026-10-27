// AI娘微积分课 · 第1章 P0 预览样片《画不出来的函数》—— renderAt(t) 纯函数，逐帧确定性导出
// 管线沿用 AI娘Git课（mg-styles-15 的 renderAt 思路）；画风：深空星图 L0 + 发光数学 L1 + 构成主义卡片 L2 + 玻璃代码窗 L3 + 贴纸立绘 L4
'use strict';
const W = 1920, H = 1080;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const F_FANCY = '"Smiley", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Serif CJK SC", sans-serif';
const F_BODY = '"Microsoft YaHei", "Noto Sans CJK SC", "Noto Serif CJK SC", sans-serif';
const F_CODE = 'Consolas, "Cascadia Mono", "DejaVu Sans Mono", "Microsoft YaHei", monospace';
const F_MATH = '"Cambria Math", Cambria, "Times New Roman", "DejaVu Serif", serif';
// 颜色规范（制作规范.md）
const COL = { x: '#5CC8E8', y: '#FFD25A', f: '#E8553A', g: '#7BD389', inv: '#B79CFF', text: '#EDE6D8', red: '#E8553A', cream: '#EDE6D8', ink: '#16130F', bg0: '#0A0F1F', bg1: '#131B34' };
const GOLD = COL.y, CYAN = COL.x;

// ================= 素材 =================
const SPR = {};
const SPR_NAMES = ['c_ok', 'c_cool', 'c_explain', 'c_point', 'gp_point', 'gp_proud', 'gp_explain', 'd_happy', 'd_think', 'd_shock'];
const SPRC = { c_ok: 0.58, c_cool: 0.58, c_explain: 0.56, c_point: 0.56, gp_point: 0.54, gp_proud: 0.54, gp_explain: 0.54, d_happy: 0.55, d_think: 0.7, d_shock: 0.82 };
const loadImg = n => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'sprites/' + n + '.webp'; SPR[n] = im; });

// ================= 台词 =================
const LN = {}; (window.LINES || []).forEach(l => LN[l.id] = l);
const SQ = { C: { n: 'Claude小姐', col: '#E8553A' }, G: { n: 'GPT', col: '#B79CFF' }, D: { n: '大肥鱼', col: '#5CC8E8' } };
const DUR = Object.assign({}, window.DUR || {});

// ================= 时间轴 =================
const V = id => ({ k: 'v', b: LN[id].b, id, pose: LN[id].pose });
const BEAT = (b, d) => ({ k: 'beat', b, d });
const PLAN = [
  V('D01'), V('C01'), V('C02'), V('D02'),
  V('C03'), V('C04'), BEAT('zoom', 0.7), V('C05'), V('C06'), V('C07'), BEAT('zoom', 0.35), V('D03'),
  V('G01'), V('G02'), V('G03'), BEAT('history', 1.0), V('G04'), V('G05'),
  V('G06'), V('G07'),
  V('C08'), V('C09'), V('C10'), BEAT('outro', 2.4),
];
const GAP_SAME = 0.2, GAP_SWITCH = 0.25, GAP_BLOCK = 0.18;
const U = {}, BLOCKS = [], ENTRIES = [];
(function build() {
  let T = 0, prev = null;
  PLAN.forEach(e => {
    const en = Object.assign({}, e);
    let gap = 0.5;
    if (prev) {
      if (prev.b !== en.b) gap = GAP_BLOCK;
      else if (en.k === 'v' && prev.k === 'v') gap = prev.id[0] !== en.id[0] ? GAP_SWITCH : GAP_SAME;
      else gap = 0.05;
    }
    en.t0 = T; T += gap; en.vo = T;
    en.dur = en.k === 'v' ? (DUR[en.id] || [...LN[en.id].tts].length * 0.165) : en.d;
    T += en.dur; en.t1 = T;
    if (en.k === 'v') U[en.id] = en;
    ENTRIES.push(en);
    let blk = BLOCKS[BLOCKS.length - 1];
    if (!blk || blk.b !== en.b) { blk = { b: en.b, t0: en.t0, entries: [] }; BLOCKS.push(blk); }
    blk.entries.push(en); blk.t1 = en.t1;
    prev = en;
  });
})();
const TOTAL = BLOCKS[BLOCKS.length - 1].t1;
const S = id => U[id].vo, E = id => U[id].vo + U[id].dur, D = id => U[id].dur;
const P = (id, f) => U[id].vo + U[id].dur * f;
const BK = {}; BLOCKS.forEach(b => BK[b.b] = b);

// ================= 音效表 =================
const SFX = [];
const sfx = (t, name, gain = 1) => SFX.push({ t: +Math.max(0, t).toFixed(3), name, gain });
function typeSfx(t, n, dur, g = 0.22) { const k = Math.min(n, 16); for (let i = 0; i < k; i++) sfx(t + i * dur / k, 'type', g); }

// ================= 工具 =================
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const prog = (t, a, d) => clamp((t - a) / d);
const eOut = x => 1 - Math.pow(1 - x, 3);
const eIn = x => x * x * x;
const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eBack = x => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
function rnd(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise(t, seed) { return Math.sin(t * 23.1 + seed) * .5 + Math.sin(t * 37.7 + seed * 2.1) * .3 + Math.sin(t * 61.3 + seed * 3.7) * .2; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function shake(t, t0, amp, d) { const p = prog(t, t0, d); if (p <= 0 || p >= 1) return [0, 0]; const k = (1 - p) * (1 - p) * amp; return [noise(t, 1) * k, noise(t, 5) * k]; }
const win01 = (t, a, b, fi = 0.25, fo = 0.25) => Math.min(eOut(prog(t, a, fi)), 1 - eIn(prog(t, b - fo, fo)));   // a..b 区间可见度

// ================= L0 深空星图 =================
const STARS = Array.from({ length: 230 }, (_, i) => ({ x: rnd(i + 1) * (W + 400) - 200, y: rnd(i + 501) * (H + 400) - 200, z: 0.25 + rnd(i + 1001) * 0.75, r: 0.5 + Math.pow(rnd(i + 1501), 3) * 2.0, tw: rnd(i + 2001) * 6.28, hue: rnd(i + 2501) }));
let CAM = { x: 0, y: 0, z: 1 };   // 场景可改：星空视差 / 拉远
function starfield(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, COL.bg0); g.addColorStop(1, COL.bg1);
  ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  // 稀疏星云
  [[1450, 260, 700, '#3b2a78', 0.16], [380, 820, 640, '#0f5a6a', 0.13], [960, 540, 1100, '#1a2550', 0.10]].forEach(([x, y, r, c, a], i) => {
    const xx = x + Math.sin(t * 0.05 + i) * 30, rg = ctx.createRadialGradient(xx, y, 0, xx, y, r);
    rg.addColorStop(0, hexA(c, a)); rg.addColorStop(1, hexA(c, 0)); ctx.fillStyle = rg; ctx.fillRect(-200, -200, W + 400, H + 400);
  });
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(CAM.z, CAM.z); ctx.translate(-W / 2, -H / 2);
  for (const s of STARS) {
    let x = ((s.x - t * 6 * s.z - CAM.x * s.z) % (W + 400) + (W + 400)) % (W + 400) - 200;
    let y = s.y - CAM.y * s.z;
    const tw = 0.55 + 0.45 * Math.sin(t * (0.8 + s.z) + s.tw);
    ctx.globalAlpha = (0.25 + 0.6 * s.z) * tw;
    ctx.fillStyle = s.hue > 0.85 ? '#ffd9a8' : s.hue > 0.7 ? '#a8d8ff' : '#e8ecff';
    ctx.beginPath(); ctx.arc(x, y, s.r * (0.6 + s.z * 0.6), 0, 7); ctx.fill();
    if (s.r > 1.8) { ctx.globalAlpha *= 0.5; ctx.fillRect(x - 7 * s.z, y - 0.5, 14 * s.z, 1); ctx.fillRect(x - 0.5, y - 7 * s.z, 1, 14 * s.z); }
  }
  ctx.restore(); ctx.globalAlpha = 1;
}
function blueprint(a, step = 60) {   // L3 蓝图细网格
  if (a <= 0) return;
  ctx.save(); ctx.strokeStyle = `rgba(92,200,232,${0.06 * a})`; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
}

// ================= L1 发光数学 =================
function glowPath(build, col, w = 4, a = 1) {   // build(ctx) 只负责 moveTo/lineTo
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
  [[w * 5, 0.07], [w * 2.4, 0.18], [w, 0.9]].forEach(([lw, al]) => { ctx.beginPath(); build(); ctx.lineWidth = lw; ctx.strokeStyle = hexA(col, al * a); ctx.stroke(); });
  ctx.beginPath(); build(); ctx.lineWidth = Math.max(1, w * 0.35); ctx.strokeStyle = `rgba(255,255,255,${0.55 * a})`; ctx.stroke();
  ctx.restore();
}
function glowDot(x, y, r, col, a = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = hexA(col, 0.12 * a); ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 7); ctx.fill();
  ctx.fillStyle = hexA(col, 0.9 * a); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.fillStyle = `rgba(255,255,255,${0.7 * a})`; ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, 7); ctx.fill();
  ctx.restore();
}
// 数学文本：x^2、2^{55}、_2 ；斜体衬线 + 可选发光
function mathW(str, size) {
  let w = 0; ctx.font = `italic ${size}px ${F_MATH}`;
  for (const tk of mathTokens(str)) { ctx.font = `italic ${tk.s ? size * 0.62 : size}px ${F_MATH}`; w += ctx.measureText(tk.t).width; }
  return w;
}
function mathTokens(str) {
  const out = []; let i = 0;
  while (i < str.length) {
    const c = str[i];
    if (c === '^' || c === '_') {
      let j = i + 1, t = '';
      if (str[j] === '{') { const k = str.indexOf('}', j); t = str.slice(j + 1, k); i = k + 1; } else { t = str[j]; i = j + 1; }
      out.push({ t, s: c });
    } else { let j = i; while (j < str.length && str[j] !== '^' && str[j] !== '_') j++; out.push({ t: str.slice(i, j) }); i = j; }
  }
  return out;
}
function mathText(str, x, y, size, col = COL.text, o = {}) {
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  let cx = o.align === 'center' ? x - mathW(str, size) / 2 : o.align === 'right' ? x - mathW(str, size) : x;
  if (o.glow) { ctx.shadowColor = col; ctx.shadowBlur = o.glow; }
  ctx.globalAlpha = o.alpha ?? 1;
  for (const tk of mathTokens(str)) {
    const sz = tk.s ? size * 0.62 : size; ctx.font = `${o.upright ? '' : 'italic '}${sz}px ${F_MATH}`;
    ctx.fillStyle = tk.c || col;
    const dy = tk.s === '^' ? -size * 0.42 : tk.s === '_' ? size * 0.18 : 0;
    ctx.fillText(tk.t, cx, y + dy); cx += ctx.measureText(tk.t).width;
  }
  ctx.restore(); return cx;
}

// ================= L4 立绘（贴纸，不抖动） =================
function sprite(name, x, by, h, o = {}) {
  const im = SPR[name]; if (!im || !im.width) return;
  const sh = im.height * (SPRC[name] || 1); const w = h * im.width / sh;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(x, by);
  if (o.rot) ctx.rotate(o.rot);
  const s = o.scale ?? 1; ctx.scale(s * (o.flip ? -1 : 1), s);
  // 深底轮廓光
  ctx.shadowColor = o.rim || 'rgba(150,180,255,0.45)'; ctx.shadowBlur = 26;
  ctx.drawImage(im, 0, 0, im.width, sh, -w / 2, -h, w, h); ctx.restore();
}
// 讲解者：t 时刻按 PLAN 中该角色最近的 pose 交叉淡化
function lecturer(t, who, x, enterT, exitT, o = {}) {
  const pi = eOut(prog(t, enterT, 0.45)), po = exitT ? eIn(prog(t, exitT, 0.35)) : 0;
  if (pi <= 0 || po >= 1) return;
  const vs = ENTRIES.filter(e => e.k === 'v' && e.id[0] === who);
  let cur = vs[0], prv = null;
  for (const e of vs) { if (e.vo - 0.12 <= t) { prv = cur; cur = e; } }
  const side = x < W / 2 ? -1 : 1, dx = side * ((1 - pi) * 700 + po * 700);
  const h = o.h || 700, by = H + 20;
  const k = prv && prv.pose !== cur.pose ? eOut(prog(t, cur.vo - 0.12, 0.18)) : 1;
  if (k < 1) sprite(prv.pose, x + dx, by, h, { flip: o.flip, alpha: 1 - k });
  sprite(cur.pose, x + dx, by, h, { flip: o.flip, alpha: k });
}
function cameo(t, name, t0, t1, x = 1730, h = 470) {
  const pi = eOut(prog(t, t0 - 0.15, 0.32)), po = eIn(prog(t, t1, 0.28)); if (pi <= 0 || po >= 1) return;
  sprite(name, x, H + 30 + (1 - pi) * 520 + po * 520, h, { rot: -0.05, rim: 'rgba(92,200,232,0.5)' });
}

// ================= 文本组件 =================
function fancy(text, x, y, size, t, t0, o = {}) {
  const chars = [...text];
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  ctx.font = `${size}px ${o.font || F_FANCY}`; ctx.textBaseline = 'middle';
  const widths = chars.map(c => ctx.measureText(c).width * (o.spacing || 1));
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? 0 : -total / 2;
  const out = o.out ? clamp(1 - (t - o.out) / 0.2) : 1;
  chars.forEach((c, i) => {
    const p = prog(t, t0 + i * (o.stagger ?? 0.035), 0.3);
    if (p <= 0 || out <= 0) { cx += widths[i]; return; }
    const sc = eBack(p) * out;
    ctx.save(); ctx.translate(cx + widths[i] / 2, 0); ctx.scale(sc, sc);
    ctx.textAlign = 'center'; ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.26; ctx.strokeStyle = o.outer || COL.ink; ctx.strokeText(c, 0, 0);
    ctx.fillStyle = o.c || COL.cream; ctx.fillText(c, 0, 0); ctx.restore();
    cx += widths[i];
  });
  ctx.restore();
}
// 构成主义标签块：斜放色块 + 反白字
function slab(text, x, y, size, t, t0, o = {}) {
  const p = eBack(prog(t, t0, 0.32)); if (p <= 0) return;
  const out = o.out ? 1 - eIn(prog(t, o.out, 0.2)) : 1; if (out <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.08); ctx.scale(p * out, p * out);
  ctx.font = `${o.bold === false ? '' : 'bold '}${size}px ${o.font || F_FANCY}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  const w = ctx.measureText(text).width + size * 0.9, h = size * 1.45;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
  ctx.fillStyle = o.bg || COL.red; ctx.fillRect(-w / 2, -h / 2, w, h);
  if (o.bar !== false) { ctx.fillStyle = o.barc || COL.ink; ctx.fillRect(-w / 2, h / 2 - size * 0.14, w, size * 0.14); }
  ctx.fillStyle = o.c || COL.cream; ctx.fillText(text, 0, 2);
  ctx.restore();
}
// 术语卡（英文术语 + 中文）
function termCard(en, zh, x, y, t, t0, o = {}) {
  const p = eBack(prog(t, t0, 0.3)); if (p <= 0) return;
  const out = o.out ? 1 - eIn(prog(t, o.out, 0.2)) : 1; if (out <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.06); ctx.scale(p * out, p * out);
  ctx.font = `italic bold 34px ${F_MATH}`; const w1 = ctx.measureText(en).width;
  ctx.font = `30px ${F_FANCY}`; const w2 = ctx.measureText(zh).width;
  const w = Math.max(w1, w2) + 56, h = 104;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-w / 2 + 7, -h / 2 + 9, w, h);
  ctx.fillStyle = COL.ink; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = COL.red; ctx.fillRect(-w / 2, -h / 2, 12, h);
  ctx.fillStyle = COL.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `italic bold 34px ${F_MATH}`; ctx.fillText(en, 6, -18);
  ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = GOLD; ctx.fillText(zh, 6, 26);
  ctx.restore();
}
// 构成主义卡片（米白纸 + 红色页眉条 + 黑粗线）
function card(x, y, w, h, head, o = {}) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x + 12, y + 16, w, h);
  ctx.fillStyle = COL.cream; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = o.hc || COL.red; ctx.fillRect(x, y, w, o.hh || 70);
  ctx.fillStyle = COL.ink; ctx.fillRect(x, y + (o.hh || 70), w, 6);
  // 角落红三角
  ctx.fillStyle = o.hc || COL.red; ctx.beginPath(); ctx.moveTo(x + w, y + h); ctx.lineTo(x + w - 70, y + h); ctx.lineTo(x + w, y + h - 70); ctx.fill();
  if (head) { ctx.fillStyle = COL.cream; ctx.font = `bold ${o.hs || 38}px ${F_FANCY}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(head, x + 28, y + (o.hh || 70) / 2 + 2); }
  ctx.restore();
}
function inCard(x, y, w, h, s, rot, fn) { ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.translate(-w / 2, -h / 2); fn(); ctx.restore(); }

// ================= 字幕 =================
function subtitle(t) {
  const en = ENTRIES.find(e => e.k === 'v' && t >= e.vo - 0.05 && t < e.t1 + 0.22);
  if (!en) return;
  const p = eOut(prog(t, en.vo - 0.05, 0.14)) * clamp((en.t1 + 0.22 - t) / 0.12);
  const sp = SQ[en.id[0]], text = LN[en.id].sub;
  ctx.save();
  let fs = 44; ctx.font = `bold ${fs}px ${F_BODY}`; let tw = ctx.measureText(text).width;
  if (tw > 1560) { fs = Math.floor(44 * 1560 / tw); ctx.font = `bold ${fs}px ${F_BODY}`; tw = ctx.measureText(text).width; }
  const bw = tw + 84, bh = 84, bx = W / 2 - bw / 2, by = H - 116 + (1 - p) * 24;
  ctx.globalAlpha = p;
  ctx.fillStyle = 'rgba(8,12,26,0.82)'; rr(bx, by, bw, bh, 10); ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = hexA(sp.col, 0.9); ctx.stroke();
  ctx.fillStyle = sp.col; ctx.fillRect(bx, by + bh - 5, bw * 0.22, 5);
  // 名牌：斜切色块
  ctx.font = `30px ${F_FANCY}`; const nw = ctx.measureText(sp.n).width + 44;
  ctx.save(); ctx.translate(bx + 26, by - 14);
  ctx.fillStyle = sp.col; ctx.beginPath(); ctx.moveTo(10, -22); ctx.lineTo(nw + 10, -22); ctx.lineTo(nw, 22); ctx.lineTo(0, 22); ctx.fill();
  ctx.fillStyle = COL.ink; ctx.textBaseline = 'middle'; ctx.fillText(sp.n, 22, 1); ctx.restore();
  ctx.font = `bold ${fs}px ${F_BODY}`; ctx.fillStyle = COL.text; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, by + bh / 2 + 2);
  ctx.restore();
}

// ================= 场景公共：数轴 + 稠密点云（A01） =================
const XC = 1230, XL = 600, XR = 1870, Y1 = 400, Y0 = 640, AXY = 730, PPU0 = 315;   // 每单位像素（k=0）
const SQ2 = Math.SQRT2;
function h32(a, b, s) {   // 整数哈希 → [0,1)
  let x = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul((b | 0) + s * 7919, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
}
function vx(v, view) { return XC + (v - view.c) * PPU0 * Math.pow(10, view.k); }
function dust(view, a, t) {
  if (a <= 0) return;
  const ppu = PPU0 * Math.pow(10, view.k);
  const vmin = view.c - (XC - XL + 40) / ppu, vmax = view.c + (XR - XC + 40) / ppu;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let L = -1; L <= 13; L++) {
    const u = Math.pow(10, -L), sp = u * ppu; if (sp < 2.6 || sp > 4000) continue;
    const la = clamp((sp - 2.6) / 26) * a;
    const m0 = Math.floor(vmin / u), m1 = Math.ceil(vmax / u);
    for (let m = m0; m <= m1; m++) {
      const mh = m % 1000000007, ml = Math.floor(m / 1000000007);
      for (const [yy, col, seed, r] of [[Y1, GOLD, 1, 3.3], [Y0, CYAN, 2, 2.7]]) {
        const hx = h32(mh, ml * 31 + L, seed), x = XC + ((m + hx) * u - view.c) * ppu;
        if (x < XL || x > XR) continue;
        const edge = Math.min(clamp((x - XL) / 60), clamp((XR - x) / 60));
        const big = h32(mh, L, seed + 5) > 0.86 ? 1.5 : 1;
        const tw = 0.75 + 0.25 * Math.sin(t * 3 + hx * 40);
        ctx.globalAlpha = la * edge * tw;
        ctx.fillStyle = hexA(col, 0.16); ctx.beginPath(); ctx.arc(x, yy, r * 2.6 * big, 0, 7); ctx.fill();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, yy, r * big * 0.8, 0, 7); ctx.fill();
      }
    }
  }
  ctx.restore();
}
function fmtNum(v, dec) { let s = v.toFixed(dec); if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s; }
function axisTicks(view, a) {
  if (a <= 0) return;
  const ppu = PPU0 * Math.pow(10, view.k);
  const d = Math.pow(10, Math.ceil(Math.log10(190 / ppu))), dec = Math.max(0, -Math.round(Math.log10(d)));
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(237,230,216,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XL, AXY); ctx.lineTo(XR, AXY); ctx.stroke();
  const vmin = view.c - (XC - XL) / ppu, vmax = view.c + (XR - XC) / ppu;
  for (let m = Math.ceil(vmin / d); m <= Math.floor(vmax / d); m++) {
    const v = m * d, x = vx(v, view), edge = Math.min(clamp((x - XL) / 80), clamp((XR - x) / 80));
    ctx.globalAlpha = a * edge; ctx.fillStyle = COL.text; ctx.fillRect(x - 1.5, AXY - 12, 3, 24);
    mathText(fmtNum(v, dec + 1 > 12 ? 12 : dec), x, AXY + 52, 34, COL.text, { align: 'center', upright: true, alpha: a * edge });
    for (let j = 1; j < 10; j++) { const xx = vx(v + j * d / 10, view); if (xx > XL && xx < XR) { ctx.globalAlpha = a * 0.5 * edge; ctx.fillRect(xx - 1, AXY - 6, 2, 12); } }
  }
  ctx.restore();
}
function guideLines(a) {
  if (a <= 0) return;
  ctx.save(); ctx.setLineDash([10, 12]); ctx.lineWidth = 2;
  [[Y1, GOLD, 'y = 1'], [Y0, CYAN, 'y = 0']].forEach(([y, c, s]) => {
    ctx.strokeStyle = hexA(c, 0.32 * a); ctx.beginPath(); ctx.moveTo(XL, y); ctx.lineTo(XR, y); ctx.stroke();
    mathText(s, XR - 6, y - 16, 30, c, { align: 'right', alpha: a * 0.85 });
  });
  ctx.restore();
}
// 大肥鱼 D02 点的点（k=0 视图）
const DOTS = [[1.5, 1, '3/2'], [Math.sqrt(3), 0, '√3'], [2, 1, '2'], [Math.E, 0, 'e'], [2.5, 1, '5/2'], [Math.PI, 0, 'π'], [4, 1, '4'], [Math.sqrt(17), 0, '√17']];
const ZOOM_K = [];  // 预计算：每帧的放大参数
function zoomK(t) {
  const a0 = P('C03', 0.5), a1 = P('C04', 0.3), a2 = E('C04') + 0.6, a3 = E('C05');
  if (t < a0) return 0;
  if (t < a1) return eIO(prog(t, a0, a1 - a0));
  if (t < a2) return 1 + 5 * eIO(prog(t, a1, a2 - a1));
  return 6 + 1.4 * prog(t, a2, a3 - a2);
}
const VIEW2 = { c: 1.00005, k: Math.log10(9.6e6 / PPU0) };
function viewAt(t) { return t < S('C06') - 0.05 ? { c: Math.PI, k: zoomK(t) } : VIEW2; }
function hud(t, k, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const x = 1500, y = 54, w = 370, h = 118;
  ctx.fillStyle = 'rgba(10,16,34,0.78)'; rr(x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = hexA(CYAN, 0.7); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = hexA(CYAN, 0.9); ctx.font = `26px ${F_FANCY}`; ctx.textBaseline = 'middle'; ctx.fillText('放大倍率', x + 22, y + 30);
  const n = Math.round(Math.pow(10, k));
  ctx.font = `bold 46px ${F_CODE}`; ctx.fillStyle = COL.text; ctx.textAlign = 'right';
  ctx.fillText('×' + n.toLocaleString('en-US'), x + w - 22, y + 74);
  ctx.textAlign = 'left';
  for (let i = 0; i < 7; i++) { ctx.fillStyle = k >= i + 0.5 ? GOLD : 'rgba(237,230,216,0.18)'; ctx.fillRect(x + 160 + i * 28, y + 22, 22, 12); }
  ctx.restore();
}
function numberLayer(t, view, o = {}) {
  const ga = o.guide ?? 1;
  guideLines(ga);
  axisTicks(view, o.ticks ?? 1);
  dust(view, o.dust ?? 0, t);
}
// 碎裂的连线（C05）
function brokenLine(t, x0, x1, y, tDraw, tBreak) {
  const pd = prog(t, tDraw, tBreak - tDraw); if (pd <= 0) return;
  const pb = prog(t, tBreak, 0.9);
  if (pb <= 0) { glowPath(() => { ctx.moveTo(x0, y); for (let i = 1; i <= 40 * pd; i++) { const xx = x0 + (x1 - x0) * i / 40; ctx.lineTo(xx, y + Math.sin(i * 1.7) * 9); } }, '#ffffff', 3, 0.9); return; }
  for (let i = 0; i < 14; i++) {
    const a = x0 + (x1 - x0) * i / 14, b = x0 + (x1 - x0) * (i + 1) / 14, mx = (a + b) / 2;
    const vx_ = (rnd(i + 70) - 0.5) * 420, vy = -200 - rnd(i + 90) * 260, e = eOut(pb);
    const cx = mx + vx_ * e, cy = y + vy * e + 520 * pb * pb, rot = (rnd(i + 30) - 0.5) * 6 * e;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha = 1 - pb;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-(b - a) / 2 + 4, 0); ctx.lineTo((b - a) / 2 - 4, 0); ctx.stroke(); ctx.restore();
  }
}
function bracketPair(t, a, xa, xb, view) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  [[xa, '('], [xb, ')']].forEach(([x, ch]) => {
    ctx.font = `300px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = COL.cream; ctx.shadowBlur = 18; ctx.fillStyle = hexA(COL.cream, 0.9); ctx.fillText(ch, x, (Y1 + Y0) / 2);
  });
  ctx.shadowBlur = 0;
  mathText('a', xa, Y0 + 70, 40, COL.cream, { align: 'center' }); mathText('b', xb, Y0 + 70, 40, COL.cream, { align: 'center' });
  const ppu = PPU0 * Math.pow(10, view.k), wv = (xb - xa) / ppu;
  const lbl = 'b − a ≈ ' + wv.toExponential(1).replace(/e-(\d+)/, (m, d) => ' × 10^{−' + d + '}');
  ctx.fillStyle = 'rgba(10,16,34,0.75)'; rr(XC - 230, 228, 460, 66, 10); ctx.fill();
  mathText(lbl, XC, 274, 38, COL.cream, { align: 'center', upright: true });
  ctx.restore();
}
function chip(text, x, y, col, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = `30px ${F_FANCY}`; const w = ctx.measureText(text).width + 30;
  ctx.fillStyle = hexA(col, 0.18); rr(x, y - 24, w, 48, 24); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = col; ctx.textBaseline = 'middle'; ctx.fillText(text, x + 15, y + 1); ctx.restore();
}
function dropDot(t, t0, x, y, col, label, ly, o = {}) {
  const p = prog(t, t0, 0.42); if (p <= 0) return;
  const yy = lerp(y - 260, y, eOut(p) ** 1.0);
  const ring = prog(t, t0 + 0.35, 0.6);
  if (ring > 0 && ring < 1) { ctx.save(); ctx.globalAlpha = 1 - ring; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 10 + ring * 70, 0, 7); ctx.stroke(); ctx.restore(); }
  glowDot(x, yy, 9, col);
  const la = prog(t, t0 + 0.3, 0.25); if (la <= 0) return;
  ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = hexA(col, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + (ly < y ? -16 : 16)); ctx.lineTo(x, ly + (ly < y ? 14 : -40)); ctx.stroke();
  const w = mathW(label, 40) + 36, lx = clamp(x - w / 2, XL + 40, XR - w);
  ctx.fillStyle = 'rgba(10,16,34,0.82)'; rr(lx, ly - 36, w, 56, 10); ctx.fill(); ctx.strokeStyle = col; ctx.stroke();
  mathText(label, lx + 18, ly + 6, 40, col, { upright: o.upright }); ctx.restore();
}

// ================= 场景 =================
const SC = {};
// ---- 块 open：抛物线 → 狄利克雷函数定义 → 大肥鱼点点 ----
function parabola(t, a, cut) {
  if (a <= 0) return;
  const ox = 1180, oy = 800, u = 105, p = clamp((t - S('D01') + 0.3) / 1.4);
  ctx.save(); ctx.globalAlpha = a;
  if (cut != null) { ctx.beginPath(); ctx.rect(cut, -10, W, H + 20); ctx.clip(); }
  ctx.strokeStyle = 'rgba(237,230,216,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(ox - 380, oy); ctx.lineTo(ox + 380, oy); ctx.moveTo(ox, oy + 40); ctx.lineTo(ox, oy - 680); ctx.stroke();
  glowPath(() => { const n = Math.floor(120 * p); for (let i = 0; i <= n; i++) { const x = -2.45 + 4.9 * i / 120; const X = ox + x * u, Y = oy - x * x * u; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, GOLD, 5);
  if (p > 0.7) mathText('y = x^2', ox + 190, oy - 470, 64, GOLD, { glow: 18, alpha: prog(p, 0.7, 0.3) });
  ctx.restore();
}
function defCard(t, x, y, s, a) {
  if (a <= 0 || s <= 0) return;
  const w = 880, h = 380;
  ctx.save(); ctx.globalAlpha = a;
  inCard(x, y, w, h, s, -0.025, () => {
    card(0, 0, w, h, '狄利克雷函数 · 定义');
    const t1 = S('C02') + 0.05, t2 = P('C02', 0.5), tE = P('C02', 0.48);
    mathText('D(x) =', 46, 222, 70, COL.ink);
    ctx.font = `200px ${F_MATH}`; ctx.fillStyle = COL.ink; ctx.textBaseline = 'alphabetic'; ctx.fillText('{', 262, 268);
    [[t1, tE - t1, '1', GOLD, 'x 是有理数', 170], [t2, P('C02', 0.95) - t2, '0', CYAN, 'x 是无理数', 290]].forEach(([ts, td, v, c, txt, yy]) => {
      const p = prog(t, ts, td); if (p <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(330, yy - 80, 520 * p, 110); ctx.clip();
      ctx.fillStyle = c; ctx.fillRect(338, yy - 58, 62, 74); mathText(v, 369, yy, 68, COL.ink, { align: 'center', upright: true });
      ctx.font = `bold 52px ${F_BODY}`; ctx.fillStyle = COL.ink; ctx.textBaseline = 'alphabetic'; ctx.fillText('，若 ' , 410, yy);
      mathText('x', 520, yy, 58, COL.ink); ctx.font = `bold 52px ${F_BODY}`; ctx.fillStyle = COL.ink; ctx.fillText(txt.slice(1), 552, yy);
      ctx.restore();
      if (p < 1) { ctx.fillStyle = COL.red; ctx.fillRect(330 + 520 * p, yy - 54, 6, 64); }
    });
  });
  ctx.restore();
}
SC.open = (t, blk) => {
  starfield(t);
  const tC = S('C01');
  const band = prog(t, tC - 0.1, 0.55), bx = lerp(-700, W + 900, eIO(band));
  parabola(t, 1, band > 0 ? bx - 300 : null);
  // 定义卡：C02 弹出，D02 缩到左上
  const pin = eBack(prog(t, S('C02') - 0.15, 0.35)), shrink = eIO(prog(t, S('D02') - 0.1, 0.5));
  const cx = lerp(740, 640, shrink), cy = lerp(150, 26, shrink), cs = pin * lerp(1, 0.48, shrink);
  // 大肥鱼的点点（坐标系）
  const pa = prog(t, S('D02') + 0.05, 0.4);
  if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; numberLayer(t, { c: Math.PI, k: 0 }, { dust: 0 }); ctx.restore(); }
  defCard(t, cx - (1 - 1) * 0, cy, cs, 1);
  termCard('Dirichlet function', '狄利克雷函数', lerp(1520, 1440, shrink), lerp(520, 190, shrink), t, P('C02', 0.88), { rot: -0.07 });
  d02Dots(t, 1);
  // 讲解者 Claude（红斜台）
  const pl = eOut(prog(t, tC, 0.45));
  if (pl > 0) { ctx.save(); ctx.translate(-700 * (1 - pl), 0); ctx.fillStyle = COL.red; ctx.beginPath(); ctx.moveTo(-40, 930); ctx.lineTo(640, 860); ctx.lineTo(640, 930); ctx.lineTo(-40, 1000); ctx.fill(); ctx.fillStyle = COL.ink; ctx.fillRect(-40, 1000, 700, 8); ctx.restore(); }
  lecturer(t, 'C', 255, tC + 0.05, null);
  // 红色斜带擦除
  if (band > 0 && band < 1) [[COL.red, 0], [COL.cream, 160]].forEach(([c, off]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(bx - off - 260, 0); ctx.lineTo(bx - off, 0); ctx.lineTo(bx - off - 420, H); ctx.lineTo(bx - off - 680, H); ctx.fill(); });
  fancy('早学过了～', 1690, 560, 54, t, P('D01', 0.55), { rot: -0.1, c: GOLD, out: E('D01') + 0.1 });
};
function d02Dots(t, a, view = { c: Math.PI, k: 0 }, labelA = 1) {
  DOTS.forEach(([v, top, lbl], i) => {
    const t0 = P('D02', 0.3 + i * 0.085); const p = prog(t, t0, 0.18); if (p <= 0) return;
    const x = vx(v, view), y = top ? Y1 : Y0, col = top ? GOLD : CYAN;
    if (x < XL - 20 || x > XR + 20) return;
    glowDot(x, y, 8 * eBack(p), col, a);
    if (labelA > 0) mathText(lbl, x, y - 26, 36, col, { align: 'center', alpha: a * labelA * p, upright: lbl.length > 1 && lbl[0] !== '√' });
  });
  // 笔尖
  const tp0 = P('D02', 0.22), tp1 = P('D02', 0.98);
  if (t > tp0 && t < tp1 + 0.3) {
    const f = clamp((t - P('D02', 0.3)) / (0.085 * D('D02'))), i = Math.min(7, Math.floor(f)), fr = f - i;
    const [v1, tp1_] = DOTS[Math.max(0, i)], [v2, tp2] = DOTS[Math.min(7, i + 1)];
    const x = lerp(vx(v1, view), vx(v2, view), eIO(clamp(fr * 1.6 - 0.6))), y = lerp(tp1_ ? Y1 : Y0, tp2 ? Y1 : Y0, eIO(clamp(fr * 1.6 - 0.6)));
    const al = Math.min(prog(t, tp0, 0.2), 1 - prog(t, tp1, 0.3));
    ctx.save(); ctx.globalAlpha = al; ctx.translate(x + 6, y - 6); ctx.rotate(0.7);
    ctx.fillStyle = COL.cream; ctx.fillRect(-7, -70, 14, 56); ctx.fillStyle = COL.red; ctx.beginPath(); ctx.moveTo(-7, -14); ctx.lineTo(7, -14); ctx.lineTo(0, 0); ctx.fill(); ctx.restore();
  }
}
// ---- 块 zoom：无限放大 → 区间 → 具体例子 → 探针 + 印章 ----
SC.zoom = (t, blk) => {
  const pull = eIO(prog(t, S('D03') - 0.1, 0.8));
  CAM.z = 1 - 0.12 * pull;
  starfield(t); CAM.z = 1;
  const v = viewAt(t), k = v.k;
  const sw = prog(t, S('C06') - 0.3, 0.6);   // 换视图闪切
  const fade = sw > 0 && sw < 1 ? Math.abs(sw - 0.5) * 2 : 1;
  const [shx, shy] = shake(t, E('C07') - 0.4, 16, 0.45);
  ctx.save(); ctx.translate(shx, shy);
  ctx.translate(XC, 520); ctx.scale(1 - 0.08 * pull, 1 - 0.08 * pull); ctx.translate(-XC, -520);
  ctx.save(); ctx.globalAlpha = fade;
  const dA = t < S('C06') ? prog(t, P('C03', 0.55), 0.7) : 0.55;
  numberLayer(t, v, { dust: dA, guide: t < S('C06') ? lerp(1, 0.35, prog(t, P('C03', 0.5), 1)) : 0.35 });
  if (t < S('C06')) {
    d02Dots(t, 1, v, 1 - prog(t, P('C03', 0.5), 0.5));
    // π 锚点
    const pa = prog(t, P('C03', 0.6), 0.4);
    if (pa > 0) { glowDot(XC, Y0, 10, CYAN); mathText('π = 3.14159265358979…', XC + 22, Y0 + 56, 32, CYAN, { alpha: pa * (1 - prog(t, S('C05'), 0.3)), upright: true }); }
    // C05：区间 + 图例 + 尝试连线
    const ba = win01(t, S('C05') - 0.05, S('C06'), 0.35, 0.2);
    bracketPair(t, ba, XC - 300, XC + 300, v);
    chip('有理数 · 稠密', 640, Y1 - 60, GOLD, win01(t, P('C05', 0.15), S('C06'), 0.3, 0.2));
    chip('无理数 · 稠密', 640, Y0 + 60, CYAN, win01(t, P('C05', 0.3), S('C06'), 0.3, 0.2));
    brokenLine(t, XC - 290, XC + 290, Y1, P('C05', 0.55), P('C05', 0.8));
  } else {
    // C06 / C07：放大镜视图 [1, 1.0001]
    const ma = prog(t, S('C06') - 0.05, 0.4);
    ctx.save(); ctx.globalAlpha = ma; ctx.strokeStyle = hexA(COL.cream, 0.8); ctx.lineWidth = 4;
    const bx0 = XL + 10, bx1 = XR - 10, by0 = 250, by1 = 820, L_ = 46;
    [[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x + sx * L_, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * L_); ctx.stroke(); });
    ctx.font = `28px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textBaseline = 'middle'; ctx.fillText('放大镜：1 到 1.0001 之间', bx0 + 60, by0); ctx.restore();
    const xr = vx(1.00005, VIEW2), xi = vx(1 + SQ2 / 1e5, VIEW2);
    dropDot(t, P('C06', 0.33), xr, Y1, GOLD, '1.00005 = 20001/20000', Y1 - 70, { upright: true });
    dropDot(t, P('C06', 0.72), xi, Y0, CYAN, '1 + √2/100000 ≈ 1.0000141', Y0 + 80, { upright: true });
    // C07 探针
    const PR = [[1 + SQ2 / 1e5, 0, '1.0000141…'], [1.00005, 1, '1.00005'], [1.000026, 1, '1.000026']];
    const tp = [S('C07'), P('C07', 0.28), P('C07', 0.52)];
    if (t > S('C07') - 0.1) {
      let i = 0; tp.forEach((tt, j) => { if (t >= tt) i = j; });
      const fr = i > 0 ? eIO(prog(t, tp[i], 0.3)) : 1, x = i > 0 ? lerp(vx(PR[i - 1][0], VIEW2), vx(PR[i][0], VIEW2), fr) : vx(PR[0][0], VIEW2);
      const pa = Math.min(prog(t, S('C07') - 0.1, 0.25), 1 - prog(t, E('C07') - 0.5, 0.3));
      if (pa > 0) {
        ctx.save(); ctx.globalAlpha = pa;
        glowPath(() => { ctx.moveTo(x, 300); ctx.lineTo(x, 780); }, '#ffffff', 2, 0.8);
        const [vv, out, lbl] = PR[i];
        if (fr > 0.95) {
          const y = out ? Y1 : Y0, c = out ? GOLD : CYAN, yo = out ? Y0 : Y1;
          ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.stroke(); glowDot(x, y, 9, c);
          ctx.strokeStyle = 'rgba(237,230,216,0.35)'; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.arc(x, yo, 16, 0, 7); ctx.stroke(); ctx.setLineDash([]);
          const s = `x = ${lbl}   ↦   D(x) = ${out}`, w = mathW(s, 42) + 50;
          ctx.fillStyle = 'rgba(10,16,34,0.85)'; rr(XC - w / 2, 170, w, 70, 12); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke();
          mathText(s, XC, 220, 42, COL.text, { align: 'center' });
        }
        ctx.restore();
      }
    }
  }
  ctx.restore();
  // 印章「是函数」
  slab('它是函数', XC, 520, 120, t, E('C07') - 0.45, { rot: -0.14, bg: COL.red });
  ctx.restore();
  hud(t, k, win01(t, P('C03', 0.35), S('C06'), 0.3, 0.3));
  if (t < S('C06')) {
    fancy('×10', 1690, 220, 60, t, P('C04', 0.28), { c: GOLD, out: P('C04', 0.6), rot: -0.08 });
    slab('×1,000,000', 1230, 170, 72, t, E('C04') + 0.25, { rot: -0.06, bg: GOLD, c: COL.ink, out: S('C05') + 0.3 });
  }
  lecturer(t, 'C', 255, -9, E('D03') + 0.3);
  fancy('画不出来？！', 1480, 180, 76, t, P('D03', 0.45), { c: '#ff8c7a', rot: -0.08 });
};
// ---- 块 history：年份倒转 → 欧拉卡 → 傅里叶本轮（A02）→ 折角放大 → 狄利克雷卡（A03） ----
const TL = { x0: 70, y0: 250, x1: 1250, y1: 165 };
const tlPt = f => [lerp(TL.x0, TL.x1, f), lerp(TL.y0, TL.y1, f)];
const NODES = [[0.15, '1748', '欧拉'], [0.5, '1807', '傅里叶'], [0.83, '1837', '狄利克雷']];
const EPI = { cx: 400, cy: 640, A: 125, w: 2 * Math.PI * 0.42, wx0: 700, wx1: 1220 };
function epiK(t) {   // 已叠加的奇次谐波个数
  const a = P('G03', 0.32), b = E('G03') + 0.8;
  if (t < a) return 1;
  return Math.min(25, 1 + Math.floor(24 * Math.pow(prog(t, a, b - a), 1.6)));
}
function sqSum(th, K) { let s = 0; for (let j = 0; j < K; j++) { const n = 2 * j + 1; s += Math.sin(n * th) / n; } return s * 4 / Math.PI; }
function epicycles(t, a) {
  if (a <= 0) return;
  const tf = Math.min(t, S('G04') + 0.05), K = epiK(tf), th0 = EPI.w * tf;
  ctx.save(); ctx.globalAlpha = a;
  let x = EPI.cx, y = EPI.cy;
  for (let j = 0; j < K; j++) {
    const n = 2 * j + 1, r = EPI.A * 4 / (Math.PI * n);
    ctx.strokeStyle = `rgba(237,230,216,${j ? 0.18 : 0.35})`; ctx.lineWidth = j ? 1.2 : 2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
    const nx = x + r * Math.cos(n * th0), ny = y - r * Math.sin(n * th0);
    ctx.strokeStyle = j ? hexA(GOLD, 0.7) : GOLD; ctx.lineWidth = j ? 1.6 : 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
    x = nx; y = ny;
  }
  glowDot(x, y, 6, '#ffffff');
  const waveY = th => EPI.cy - EPI.A * sqSum(th, K);
  ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(237,230,216,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(EPI.wx0, waveY(th0)); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(237,230,216,0.25)'; ctx.beginPath(); ctx.moveTo(EPI.wx0, EPI.cy); ctx.lineTo(EPI.wx1, EPI.cy); ctx.stroke();
  const span = 4 * Math.PI;
  // 新加入的谐波（细线闪现）
  const kPrev = epiK(tf - 0.25);
  if (K > kPrev || K === 1) {
    const n = 2 * K - 1, r = EPI.A * 4 / (Math.PI * n);
    glowPath(() => { for (let i = 0; i <= 200; i++) { const xx = EPI.wx0 + (EPI.wx1 - EPI.wx0) * i / 200, th = th0 - span * i / 200; i ? ctx.lineTo(xx, EPI.cy - r * Math.sin(n * th)) : ctx.moveTo(xx, EPI.cy - r * Math.sin(n * th)); } }, COL.inv, 1.5, 0.6);
  }
  glowPath(() => { for (let i = 0; i <= 420; i++) { const xx = EPI.wx0 + (EPI.wx1 - EPI.wx0) * i / 420, th = th0 - span * i / 420; i ? ctx.lineTo(xx, waveY(th)) : ctx.moveTo(xx, waveY(th)); } }, CYAN, 3.5);
  // 读数 + 公式
  ctx.font = `28px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText('已叠加', EPI.wx1 - 250, EPI.cy + 215);
  ctx.font = `bold 44px ${F_CODE}`; ctx.fillStyle = GOLD; ctx.fillText(String(K).padStart(2, ' '), EPI.wx1 - 158, EPI.cy + 213);
  ctx.font = `28px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.fillText('个正弦波', EPI.wx1 - 98, EPI.cy + 215);
  const terms = ['sin x', ' + ', 'sin 3x', '/3', ' + ', 'sin 5x', '/5', ' + ', 'sin 7x', '/7', ' + …'];
  const show = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5];
  let s = 'f(x) = 4/π · ( '; terms.forEach((tm, i) => { if (K >= show[i]) s += tm; }); if (K >= 5) s += ' )';
  mathText(s, 120, 400, 44, COL.text, { glow: 10, alpha: 1 - prog(t, P('G04', 0.0), 0.3) });
  if (t > E('G03') + 0.2) {   // 吉布斯过冲
    const ga = prog(t, E('G03') + 0.2, 0.3);
    const peak = EPI.cy - EPI.A * 1.18;
    ctx.globalAlpha = a * ga; ctx.strokeStyle = COL.red; ctx.lineWidth = 2; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(EPI.wx0, EPI.cy - EPI.A); ctx.lineTo(EPI.wx1, EPI.cy - EPI.A); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = `26px ${F_FANCY}`; ctx.fillStyle = '#ff9b8a'; ctx.fillText('吉布斯过冲 ≈ 9%', EPI.wx1 - 220, peak - 30);
  }
  ctx.restore();
  return { th0, K };
}
function lens(t, a, st) {
  if (a <= 0 || !st) return;
  const { th0, K } = st, span = 4 * Math.PI;
  // 找可见区内一个向上的跳变点 θ ≡ 0 (mod 2π)
  let best = null;
  for (let i = 0; i <= 420; i++) { const th = th0 - span * i / 420, m = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (m < span / 420 * 1.01 && i > 60) { best = EPI.wx0 + (EPI.wx1 - EPI.wx0) * i / 420; break; } }
  if (!best) best = (EPI.wx0 + EPI.wx1) / 2;
  const cx = best, cy = EPI.cy, R = 100, Z = 2.6, waveY = th => EPI.cy - EPI.A * sqSum(th, K);
  const lx = cx + 40, ly = cy - 200;   // 镜片放到上方，连线指向折角
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = COL.cream; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 24, cy - 24); ctx.lineTo(lx - R * 0.7, ly + R * 0.7); ctx.stroke();
  ctx.fillStyle = 'rgba(8,12,26,0.92)'; ctx.beginPath(); ctx.arc(lx, ly, R * eBack(a), 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R * eBack(a), 0, 7); ctx.clip();
  glowPath(() => { for (let i = -60; i <= 60; i++) { const dx = i / 60 * (R / Z), xx = cx + dx, th = th0 - span * (xx - EPI.wx0) / (EPI.wx1 - EPI.wx0); const X = lx + dx * Z, Y = ly + (waveY(th) - cy) * Z * 0.5; i > -60 ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, CYAN, 3);
  ctx.restore();
  ctx.strokeStyle = COL.cream; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lx, ly, R * eBack(a), 0, 7); ctx.stroke();
  ctx.font = `28px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textAlign = 'center'; ctx.fillText('折角！', lx, ly + R + 34);
  ctx.restore();
}
function miniPlot(x, y, w, h, f, x0, x1, y0, y1, col, label) {
  ctx.save(); ctx.fillStyle = '#0d1428'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(237,230,216,0.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 10, y + h - (0 - y0) / (y1 - y0) * h); ctx.lineTo(x + w - 10, y + h - (0 - y0) / (y1 - y0) * h); ctx.stroke();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  glowPath(() => { for (let i = 0; i <= 80; i++) { const xx = lerp(x0, x1, i / 80), X = x + w * i / 80, Y = y + h - (f(xx) - y0) / (y1 - y0) * h; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, col, 3);
  ctx.restore();
  mathText(label, x + w / 2, y + h + 46, 38, COL.ink, { align: 'center' });
}
function smallCard(i, t, a, jolt) {
  if (a <= 0) return;
  const [f, yr, nm] = NODES[i], [nx, ny] = tlPt(f);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(nx, ny + 24); ctx.rotate(-0.06 + jolt * (i % 2 ? 0.12 : -0.1));
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-100 + 6, 8, 200, 92);
  ctx.fillStyle = COL.cream; ctx.fillRect(-100, 0, 200, 92); ctx.fillStyle = i === 2 ? COL.ink : COL.red; ctx.fillRect(-100, 0, 200, 36);
  ctx.fillStyle = COL.cream; ctx.font = `bold 28px ${F_CODE}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(yr, 0, 19);
  ctx.fillStyle = COL.ink; ctx.font = `32px ${F_FANCY}`; ctx.fillText(nm, 0, 64);
  ctx.restore();
}
function timeline(t, a) {
  if (a <= 0) return;
  const p = eIO(prog(t, P('G01', 0.05), 0.9));
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = COL.cream; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(TL.x0, TL.y0); const [ex, ey] = tlPt(p); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.fillStyle = COL.red; ctx.fillRect(TL.x0 - 8, TL.y0 - 30, 16, 60);
  NODES.forEach(([f, yr], i) => { if (p < f) return; const [x, y] = tlPt(f); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = i === 2 ? COL.red : COL.cream; ctx.fillRect(-11, -11, 22, 22); ctx.restore(); });
  if (p >= 0.98) { const [x, y] = tlPt(1); ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textBaseline = 'middle'; ctx.fillText('今天', x + 18, y); }
  ctx.restore();
}
SC.history = (t, blk) => {
  starfield(t);
  timeline(t, 1);
  // G01 年份倒转 2026 → 1748
  const ya = win01(t, S('G01'), P('G02', 0.05), 0.2, 0.25);
  if (ya > 0) {
    const yr = Math.round(lerp(2026, 1748, eIO(prog(t, P('G01', 0.1), 0.7 * D('G01')))));
    const fly = eIO(prog(t, P('G02', -0.25 / D('G02')), 0.35)), [nx, ny] = tlPt(0.15);
    ctx.save(); ctx.globalAlpha = ya; ctx.translate(lerp(640, nx, fly), lerp(600, ny, fly)); ctx.scale(lerp(1, 0.2, fly), lerp(1, 0.2, fly));
    mathText(String(yr), 0, 70, 240, COL.cream, { align: 'center', upright: true, glow: 30 });
    ctx.font = `46px ${F_FANCY}`; ctx.fillStyle = hexA(GOLD, 0.9); ctx.textAlign = 'center'; ctx.fillText('函数这个词，还在长大', 0, 160);
    ctx.restore();
  }
  // 小卡片（节点下方）
  const jolt = Math.sin(clamp((t - S('G05') - 0.2) / 0.5) * Math.PI) * (t > S('G05') ? 1 : 0) * Math.exp(-3 * Math.max(0, t - S('G05') - 0.2));
  smallCard(0, t, prog(t, S('G03') + 0.2, 0.2), jolt);
  smallCard(1, t, prog(t, P('G03', 0.3), 0.2), jolt);
  smallCard(2, t, prog(t, E('G05') - 0.1, 0.2), 0);
  // 欧拉大卡
  const eIn_ = eBack(prog(t, S('G02') - 0.1, 0.4)), eOut_ = eIO(prog(t, S('G03') - 0.05, 0.35));
  if (eIn_ > 0 && eOut_ < 1) {
    const [nx, ny] = tlPt(0.15), w = 1000, h = 470;
    const x = lerp(lerp(-1100, 160, eIn_), nx - w / 2, eOut_), y = lerp(330, ny, eOut_), s = lerp(1, 0.2, eOut_);
    ctx.save(); ctx.globalAlpha = 1 - eOut_ * 0.6;
    inCard(x, y, w, h, s, lerp(-0.04, -0.06, eOut_), () => {
      card(0, 0, w, h, '1748 · 欧拉 Euler');
      ctx.font = `bold 60px ${F_FANCY}`; ctx.fillStyle = COL.ink; ctx.textBaseline = 'middle'; ctx.fillText('函数 = 一个解析式', 40, 128);
      [[(x_) => x_ * x_, -2, 2, -0.5, 4.5, GOLD, 'x^2'], [Math.sin, -6.5, 6.5, -1.6, 1.6, CYAN, 'sin x'], [Math.exp, -3, 1.6, -0.5, 5.2, COL.g, 'e^x']].forEach((pp, i) => {
        const ap = eBack(prog(t, P('G02', 0.3 + i * 0.16), 0.3)); if (ap <= 0) return;
        ctx.save(); ctx.translate(40 + i * 312 + 140, 300); ctx.scale(ap, ap); ctx.translate(-140, -90);
        miniPlot(0, 0, 280, 150, pp[0], pp[1], pp[2], pp[3], pp[4], pp[5], pp[6]); ctx.restore();
      });
    });
    ctx.restore();
  }
  // 傅里叶大卡（闪现后缩到节点）
  const fIn = eBack(prog(t, S('G03') - 0.05, 0.3)), fOut = eIO(prog(t, P('G03', 0.22), 0.35));
  if (fIn > 0 && fOut < 1) {
    const [nx, ny] = tlPt(0.5), w = 760, h = 300;
    const x = lerp(lerp(1400, 260, fIn), nx - w / 2, fOut), y = lerp(380, ny, fOut), s = lerp(1, 0.26, fOut);
    ctx.save(); ctx.globalAlpha = 1 - fOut * 0.6;
    inCard(x, y, w, h, s, 0.03, () => {
      card(0, 0, w, h, '1807 · 傅里叶 Fourier');
      ctx.font = `bold 52px ${F_FANCY}`; ctx.fillStyle = COL.ink; ctx.textBaseline = 'middle'; ctx.fillText('无穷多个正弦波，叠起来！', 40, 150);
      glowPath(() => { for (let i = 0; i <= 120; i++) { const X = 40 + i * 5.6, Y = 235 - 28 * sqSum(i / 120 * 4 * Math.PI, 6); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, COL.red, 2.5);
    });
    ctx.restore();
  }
  // 本轮
  const ea = prog(t, P('G03', 0.22), 0.35) * (1 - 0.75 * prog(t, S('G05'), 0.3));
  const st = epicycles(t, ea);
  lens(t, prog(t, P('G04', 0.05), 0.35) * (1 - prog(t, S('G05'), 0.25)), st);
  slab('“函数”到底该怎么定义？', 470, 395, 50, t, P('G04', 0.55), { rot: -0.07, out: S('G05') + 0.1 });
  // 狄利克雷大卡（重落）
  const dIn = prog(t, S('G05') - 0.05, 0.32);
  if (dIn > 0) {
    const w = 1060, h = 470, x = 130, y = lerp(-600, 340, eIn(dIn) * 0.6 + eOut(dIn) * 0.4);
    const [shx, shy] = shake(t, S('G05') + 0.27, 6, 0.25);
    inCard(x + shx, y + shy, w, h, 1, -0.02, () => {
      card(0, 0, w, h, '1837 · 狄利克雷 Dirichlet', { hc: COL.ink });
      ctx.textBaseline = 'middle';
      ctx.font = `bold 54px ${F_FANCY}`; ctx.fillStyle = COL.ink;
      let cx = 44; const yy = 150;
      const seg = (s, f) => { if (f) f(cx); else { ctx.font = `bold 54px ${F_FANCY}`; ctx.fillStyle = COL.ink; ctx.fillText(s, cx, yy); } cx += ctx.measureText(s).width; };
      seg('只要每个 '); mathText('x', cx, yy + 18, 60, COL.ink); cx += 34;
      seg(' 对应');
      const hl = prog(t, P('G05', 0.78), 0.2);
      ctx.font = `bold 54px ${F_FANCY}`; const uw = ctx.measureText('唯一').width;
      ctx.fillStyle = COL.red; ctx.fillRect(cx - 6, yy - 36, (uw + 12) * hl, 72);
      ctx.fillStyle = hl > 0.5 ? COL.cream : COL.ink; ctx.fillText('唯一', cx, yy); cx += uw;
      ctx.fillStyle = COL.ink; ctx.fillText('的 ', cx, yy); cx += ctx.measureText('的 ').width; mathText('y', cx, yy + 18, 60, COL.ink); cx += 34;
      ctx.font = `bold 54px ${F_FANCY}`; ctx.fillStyle = COL.ink; ctx.fillText('，', cx, yy);
      ctx.font = `bold 76px ${F_FANCY}`; ctx.fillText('就是函数。', 44, 260);
      // 迷你映射图
      const XS = [[640, 220], [640, 290], [640, 360], [640, 430]].map(([a, b]) => [a - 40, b - 30]), YS = [[960, 240], [960, 320], [960, 400]];
      ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(600, 295, 60, 130, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(960, 320, 60, 120, 0, 0, 7); ctx.stroke();
      const TG = [0, 2, 1, 2];
      XS.forEach(([a, b], i) => {
        ctx.fillStyle = CYAN; ctx.beginPath(); ctx.arc(a, b, 11, 0, 7); ctx.fill();
        const ap = eOut(prog(t, P('G05', 0.3 + i * 0.1), 0.25)); if (ap <= 0) return;
        const [c, d] = YS[TG[i]], ex = lerp(a + 14, c - 16, ap), ey = lerp(b, d, ap);
        ctx.strokeStyle = COL.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a + 14, b); ctx.lineTo(ex, ey); ctx.stroke();
        const an = Math.atan2(d - b, c - 16 - a - 14); ctx.fillStyle = COL.red; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 16 * Math.cos(an - 0.4), ey - 16 * Math.sin(an - 0.4)); ctx.lineTo(ex - 16 * Math.cos(an + 0.4), ey - 16 * Math.sin(an + 0.4)); ctx.fill();
      });
      YS.forEach(([a, b]) => { ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(a, b, 11, 0, 7); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.stroke(); });
      mathText('x', 600, 470, 40, COL.ink, { align: 'center' }); mathText('y', 960, 470, 40, COL.ink, { align: 'center' });
    });
  }
  lecturer(t, 'G', 1680, S('G01') - 0.15, null, { flip: true });
};
// ---- 块 code：玻璃代码窗（A04） ----
const CODE = [
  { s: [['// 狄利克雷函数', '#6f8a7a']] },
  { s: [['const ', '#c792ea'], ['D', '#82aaff'], [' = ', '#89ddff'], ['x', '#f78c6c'], [' => ', '#c792ea'], ['isRational', '#ffcb6b'], ['(', '#89ddff'], ['x', '#f78c6c'], [') ? ', '#89ddff'], ['1', GOLD], [' : ', '#89ddff'], ['0', CYAN], [';', '#89ddff']] },
];
function typed(t, segs, x, y, t0, dur) {
  const all = segs.map(s => s[0]).join(''), n = [...all].length, k = Math.floor(clamp((t - t0) / dur) * n);
  if (k <= 0) return null;
  let cx = x, used = 0;
  for (const [s, c] of segs) {
    const cs = [...s], take = Math.min(cs.length, k - used); if (take <= 0) break;
    const str = cs.slice(0, take).join(''); ctx.fillStyle = c; ctx.fillText(str, cx, y); cx += ctx.measureText(str).width; used += take;
  }
  if (k < n) { ctx.fillStyle = COL.cream; ctx.fillRect(cx + 2, y - 22, 3, 44); }
  return cx;
}
function scramble(t, target, t0, dur, seed) {   // 数字滚动：从左到右逐位定格
  const cs = [...target], n = cs.length, k = Math.floor(clamp((t - t0) / dur) * n);
  return cs.map((c, i) => i < k || !/[0-9]/.test(c) ? c : (i < k + 8 ? String(Math.floor(h32(i, Math.floor(t * 24), seed) * 10)) : ' ')).join('');
}
SC.code = (t, blk) => {
  starfield(t); blueprint(prog(t, blk.t0, 0.4));
  const wa = eBack(prog(t, S('G06') - 0.05, 0.35));
  const x = 80, y = 150, w = 1200, h = 660;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(wa, wa); ctx.translate(-x - w / 2, -y - h / 2);
  ctx.shadowColor = hexA(CYAN, 0.35); ctx.shadowBlur = 40; ctx.fillStyle = 'rgba(12,18,38,0.88)'; rr(x, y, w, h, 18); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = hexA(CYAN, 0.8); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(92,200,232,0.1)'; rr(x, y, w, 56, [18, 18, 0, 0]); ctx.fill();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 32 + i * 28, y + 28, 8, 0, 7); ctx.fill(); });
  ctx.font = `26px ${F_CODE}`; ctx.fillStyle = 'rgba(237,230,216,0.75)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('dirichlet.js', x + w / 2, y + 29);
  ctx.textAlign = 'left'; ctx.font = `40px ${F_CODE}`;
  const LX = x + 50, LH = 64; let ly = y + 120;
  ctx.fillStyle = 'rgba(237,230,216,0.25)'; for (let i = 0; i < 8; i++) ctx.fillText(String(i + 1), x + 14, y + 120 + i * LH);
  typed(t, CODE[0].s, LX + 20, ly, S('G06') + 0.05, 0.45); ly += LH;
  typed(t, CODE[1].s, LX + 20, ly, P('G06', 0.12), 0.5 * D('G06'));
  // 红色波浪线 + 提示
  const sq = prog(t, P('G06', 0.78), 0.25);
  if (sq > 0) {
    ctx.font = `40px ${F_CODE}`; const x0 = LX + 20 + ctx.measureText('const D = x => ').width, x1 = x0 + ctx.measureText('isRational').width;
    ctx.strokeStyle = '#ff5c5c'; ctx.lineWidth = 3; ctx.beginPath();
    for (let xx = x0; xx <= lerp(x0, x1, sq); xx += 2) { const yy = ly + 26 + Math.sin((xx - x0) / 5) * 4; xx === x0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); } ctx.stroke();
    const ta = eBack(prog(t, P('G06', 0.85), 0.3));
    if (ta > 0) {
      ctx.save(); ctx.translate(x0, ly + 54); ctx.scale(ta, ta);
      ctx.fillStyle = '#2a1016'; rr(0, 0, 640, 64, 10); ctx.fill(); ctx.strokeStyle = '#ff5c5c'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = '#ffb3b3'; ctx.textBaseline = 'middle'; ctx.fillText('✗ 写不出来：电脑分不出无理数', 22, 33); ctx.restore();
    }
  }
  ly += LH * 2.3;
  ctx.font = `40px ${F_CODE}`;
  // G07：0.1 的真面目
  if (t > S('G07') - 0.1) {
    typed(t, [['> ', CYAN], ['0.1', COL.cream]], LX + 20, ly, S('G07'), 0.3); ly += LH;
    const b0 = P('G07', 0.12), b1 = P('G07', 0.5);
    if (t > b0) {
      const bin = '0.0001100110011001100110011001100110011…';
      ctx.fillStyle = hexA(CYAN, 0.9); const s = scramble(t, bin, b0, b1 - b0, 3);
      ctx.fillText(s, LX + 60, ly); const bw = ctx.measureText(bin).width; if (t > b1) mathText('_2', LX + 60 + bw, ly + 6, 40, CYAN);
    }
    ly += LH;
    const f0 = P('G07', 0.58);
    if (t > f0) {
      const s = scramble(t, '3602879701896397', f0, 0.45, 7);
      ctx.fillStyle = COL.cream; ctx.fillText('= ' + s + ' / ', LX + 40, ly);
      const fx = LX + 40 + ctx.measureText('= 3602879701896397 / ').width;
      const pa = prog(t, f0 + 0.45, 0.3);
      if (pa > 0) {
        const pulse = 0.5 + 0.5 * Math.sin((t - f0) * 7);
        ctx.fillStyle = hexA(GOLD, 0.18 + 0.1 * pulse * pa); rr(fx - 8, ly - 34, 110, 64, 8); ctx.fill();
        mathText('2^{55}', fx, ly + 14, 48, GOLD, { upright: true, glow: 14 * pa });
      }
      ctx.font = `28px ${F_CODE}`; ctx.fillStyle = hexA(COL.cream, 0.45 * prog(t, f0 + 0.5, 0.3));
      ctx.fillText('= 0.1000000000000000055511151231257827…', LX + 40, ly + 50); ctx.font = `40px ${F_CODE}`;
    }
    ly += LH * 1.6;
    typed(t, [['// 每个浮点数都是分数 → D(x) 永远等于 1', '#6f8a7a']], LX + 20, ly, P('G07', 0.86), 0.5);
  }
  ctx.restore();
  lecturer(t, 'G', 1680, -9, null, { flip: true });
};
// ---- 块 outro：碎成粒子 → 映射（A09 预演）→ 高中速通 → 片尾卡 ----
const MX = { x: 900, y: 600, rx: 150, ry: 215 }, MY = { x: 1500, y: 600, rx: 150, ry: 215 };
const SRC = Array.from({ length: 30 }, (_, i) => { const a = rnd(i + 11) * 6.283, r = Math.sqrt(rnd(i + 31)) * 0.78; return [MX.x + Math.cos(a) * MX.rx * r, MX.y + Math.sin(a) * MX.ry * r]; });
const DST = Array.from({ length: 12 }, (_, i) => { const a = rnd(i + 51) * 6.283, r = Math.sqrt(rnd(i + 71)) * 0.75; return [MY.x + Math.cos(a) * MY.rx * r, MY.y + Math.sin(a) * MY.ry * r]; });
const MAP = SRC.map((_, i) => Math.floor(rnd(i + 91) * DST.length));
const HL = 7;   // C09 高亮的那一颗
function bez(p0, p1, p2, s) { const u = 1 - s; return [u * u * p0[0] + 2 * u * s * p1[0] + s * s * p2[0], u * u * p0[1] + 2 * u * s * p1[1] + s * s * p2[1]]; }
function ctrl(a, b) { return [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 120 - Math.abs(a[1] - b[1]) * 0.2]; }
const TILES = [['曲线', 0], ['公式', 1], ['方波', 2], ['代码', 3]];
function tile(i, x, y, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.fillStyle = 'rgba(12,18,38,0.85)'; rr(-110, -80, 220, 160, 12); ctx.fill(); ctx.strokeStyle = 'rgba(237,230,216,0.5)'; ctx.lineWidth = 2; ctx.stroke();
  if (i === 0) glowPath(() => { for (let k = 0; k <= 40; k++) { const u = -1 + 2 * k / 40; k ? ctx.lineTo(u * 70, 40 - u * u * 90) : ctx.moveTo(u * 70, 40 - u * u * 90); } }, GOLD, 3);
  if (i === 1) mathText('f(x) = x^2+1', 0, 14, 40, COL.text, { align: 'center' });
  if (i === 2) glowPath(() => { for (let k = 0; k <= 80; k++) { const X = -80 + k * 2, Y = -30 * sqSum(k / 80 * 4 * Math.PI, 9); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, CYAN, 2.5);
  if (i === 3) { ctx.font = `bold 54px ${F_CODE}`; ctx.fillStyle = '#c792ea'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('{ ; }', 0, 0); }
  ctx.font = `26px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(TILES[i][0], 0, 108);
  ctx.restore();
}
SC.outro = (t, blk) => {
  starfield(t);
  const T0 = S('C08'), tShat = P('C08', 0.6);
  // 四个小图块
  TILES.forEach((tl, i) => {
    const x = 760 + i * 280, y = 300, ap = eBack(prog(t, T0 - 0.1 + i * 0.08, 0.3));
    if (t < tShat && ap > 0) {
      tile(i, x, y, 1); 
      const sl = prog(t, P('C08', i === 0 ? 0.2 : 0.42), 0.18);
      if (i < 2 && sl > 0) { ctx.save(); ctx.strokeStyle = COL.red; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 100, y - 70); ctx.lineTo(lerp(x - 100, x + 100, sl), lerp(y - 70, y + 70, sl)); ctx.stroke(); ctx.restore(); }
    }
  });
  // 碎片 → 集合 X
  const ps = prog(t, tShat, 0.9);
  if (ps > 0 && ps < 1) {
    for (let i = 0; i < 48; i++) {
      const ti = i % 4, sx = 760 + ti * 280 + (rnd(i + 3) - 0.5) * 200, sy = 300 + (rnd(i + 5) - 0.5) * 140, [tx, ty] = SRC[i % SRC.length];
      const e = eIO(clamp(ps * 1.3 - rnd(i + 7) * 0.3)), [px, py] = bez([sx, sy], [lerp(sx, tx, 0.5) + (rnd(i) - 0.5) * 300, sy - 160], [tx, ty], e);
      glowDot(px, py, 4, [GOLD, COL.text, CYAN, '#c792ea'][ti], 1 - e * 0.3);
    }
  }
  // 映射图
  const ma = prog(t, tShat + 0.5, 0.4) * (1 - 0.55 * prog(t, S('C10'), 0.35));
  if (ma > 0) {
    ctx.save(); ctx.globalAlpha = ma;
    const xg = prog(t, S('C09'), 0.3), yg = 0;
    [[MX, CYAN, 'X', xg], [MY, GOLD, 'Y', yg]].forEach(([m, c, n, g]) => {
      ctx.strokeStyle = hexA(c, 0.5 + 0.5 * g); ctx.lineWidth = 3 + 4 * g; ctx.shadowColor = c; ctx.shadowBlur = 10 + 20 * g;
      ctx.beginPath(); ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, 7); ctx.stroke(); ctx.shadowBlur = 0;
      mathText(n, m.x, m.y - m.ry - 24, 64, c, { align: 'center', glow: 12 });
    });
    mathText('f', 1200, 330, 64, COL.f, { align: 'center', glow: 14 });
    SRC.forEach((p, i) => glowDot(p[0], p[1], 5, CYAN, 0.8));
    DST.forEach((p, j) => glowDot(p[0], p[1], 6, GOLD, 0.85));
    // 彗星：每颗只去一个位置
    SRC.forEach((p, i) => {
      const q = DST[MAP[i]], c = ctrl(p, q), per = 2.2, ph = ((t - tShat) / per + rnd(i + 13)) % 1;
      if (i === HL && t > P('C09', 0.5)) return;
      ctx.strokeStyle = hexA(COL.text, 0.08); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(c[0], c[1], q[0], q[1]); ctx.stroke();
      if (t < tShat + 0.6) return;
      const head = bez(p, c, q, eIO(ph)), tail = bez(p, c, q, eIO(Math.max(0, ph - 0.12)));
      ctx.strokeStyle = hexA(COL.inv, 0.7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tail[0], tail[1]); ctx.lineTo(head[0], head[1]); ctx.stroke();
      glowDot(head[0], head[1], 4, COL.inv, 0.9);
    });
    // C09：高亮一条
    const hp = prog(t, P('C09', 0.5), 0.5);
    if (hp > 0) {
      const p = SRC[HL], q = DST[MAP[HL]], c = ctrl(p, q);
      glowPath(() => { ctx.moveTo(p[0], p[1]); for (let k = 1; k <= 40 * hp; k++) { const [a, b] = bez(p, c, q, k / 40); ctx.lineTo(a, b); } }, GOLD, 4);
      glowDot(p[0], p[1], 9, '#ffffff'); if (hp >= 1) glowDot(q[0], q[1], 11, GOLD);
    }
    ctx.restore();
    chip('从哪来：定义域', MX.x - 120, MX.y + MX.ry + 46, CYAN, prog(t, S('C09') + 0.05, 0.3) * (1 - prog(t, S('C10'), 0.3)));
    chip('去哪里：唯一的像', MY.x - 135, MY.y + MY.ry + 46, GOLD, prog(t, P('C09', 0.55), 0.3) * (1 - prog(t, S('C10'), 0.3)));
  }
  termCard('mapping', '映射', 1220, 190, t, E('C08') - 0.4, { rot: -0.05, out: S('C10') });
  // C10：高中速通
  if (t > S('C10') - 0.1) {
    slab('高中速通', 1180, 470, 130, t, P('C10', 0.06), { rot: -0.21 });
    const ba = prog(t, P('C10', 0.3), 0.3);
    if (ba > 0) {
      ctx.save(); ctx.globalAlpha = ba;
      ctx.fillStyle = 'rgba(12,18,38,0.85)'; rr(820, 660, 760, 54, 27); ctx.fill(); ctx.strokeStyle = hexA(COL.cream, 0.6); ctx.lineWidth = 2; ctx.stroke();
      const fp = clamp((t - P('C10', 0.3)) / 2.4) * 0.92;
      ctx.fillStyle = COL.red; rr(826, 666, 748 * fp, 42, 21); ctx.fill();
      ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textBaseline = 'middle'; ctx.fillText('约 5 分钟', 840, 740 + 14);
      ctx.restore();
    }
    fancy('→ 然后是真正的大学内容', 1290, 800, 54, t, P('C10', 0.6), { c: CYAN });
  }
  lecturer(t, 'C', 255, S('C08') - 0.15, null);
  // 片尾卡
  const eb = prog(t, E('C10') + 0.15, 0.6);
  if (eb > 0) {
    const bx = lerp(-900, W + 1100, eIO(eb));
    if (eb >= 0.55) endCard(t, prog(t, E('C10') + 0.45, 0.4));
    if (eb < 1) [[COL.red, 0], [COL.cream, 170]].forEach(([c, off]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(bx - off - 300, 0); ctx.lineTo(bx - off, 0); ctx.lineTo(bx - off - 460, H); ctx.lineTo(bx - off - 760, H); ctx.fill(); });
  }
};
function endCard(t, a) {
  CAM.z = 1; starfield(t);
  dust({ c: 0.5 + t * 0.002, k: 2.2 + (t - E('C10')) * 0.25 }, 0.5 * a, t);
  ctx.save(); ctx.globalAlpha = a;
  slab('第 1 章 · P0', 960, 300, 44, t, E('C10') + 0.5, { rot: -0.05 });
  fancy('画不出来的函数', 960, 470, 130, t, E('C10') + 0.55, { c: COL.cream, stagger: 0.05 });
  ctx.font = `40px ${F_FANCY}`; ctx.fillStyle = hexA(COL.cream, 0.85); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('AI娘微积分课 · 函数与模型', 960, 820);
  ctx.font = `24px ${F_BODY}`; ctx.fillStyle = 'rgba(237,230,216,0.55)';
  ctx.fillText('立绘设定：ZipZipPipe / ai-girls　·　仅供非商业学习交流', 960, 1010);
  ctx.restore();
}

// ================= 合成 =================
const WIPE = { history: [CYAN, COL.cream], outro: [COL.red, COL.cream] };
const CAMEOS = [['d_happy', S('D01'), E('D01') + 0.05], ['d_think', S('D02'), E('D02') + 0.05], ['d_shock', S('D03'), E('D03') + 0.2]];
function chapterTag(t) {
  ctx.save(); ctx.font = `26px ${F_FANCY}`; ctx.textBaseline = 'middle';
  ctx.fillStyle = COL.red; ctx.fillRect(36, 30, 52, 40); ctx.fillStyle = COL.cream; ctx.fillText('P0', 46, 51);
  ctx.fillStyle = 'rgba(237,230,216,0.7)'; ctx.fillText('AI娘微积分课 · 第1章', 100, 51); ctx.restore();
}
function drawFrame(t) {
  const blk = BLOCKS.find(b => t >= b.t0 && t < b.t1) || BLOCKS[BLOCKS.length - 1];
  const en = blk.entries.find(e => t >= e.t0 && t < e.t1);
  CAM = { x: 0, y: 0, z: 1 };
  ctx.save(); (SC[blk.b] || (() => { }))(t, blk, en); ctx.restore();
  // 块切换：斜带擦除 / 故障切
  BLOCKS.forEach((b, i) => {
    if (i === 0) return;
    const wc = WIPE[b.b];
    if (wc) {
      const p = prog(t, b.t0 - 0.2, 0.42); if (p <= 0 || p >= 1) return;
      [0, 1].forEach(j => { const e = eIO(clamp(p * 1.15 - j * 0.12)); const x = lerp(-W * 0.9, W * 1.9, e); ctx.fillStyle = wc[j]; ctx.beginPath(); ctx.moveTo(x - 700, 0); ctx.lineTo(x + 300, 0); ctx.lineTo(x - 100, H); ctx.lineTo(x - 1100, H); ctx.fill(); });
    } else if (b.b === 'code') {
      const p = prog(t, b.t0 - 0.08, 0.3); if (p <= 0 || p >= 1) return;
      for (let k = 0; k < 9; k++) { const y = h32(k, Math.floor(t * 30), 9) * H, hh = 20 + h32(k, 3, 9) * 90, off = (h32(k, Math.floor(t * 30), 4) - 0.5) * 220 * (1 - p); ctx.drawImage(cv, 0, y, W, hh, off, y, W, hh); ctx.fillStyle = hexA(k % 2 ? CYAN : COL.red, 0.25 * (1 - p)); ctx.fillRect(0, y, W, hh * 0.3); }
    }
  });
  CAMEOS.forEach(c => { if (t > c[1] - 0.3 && t < c[2] + 0.4) cameo(t, c[0], c[1], c[2]); });
  if (t < E('C10') + 0.4) chapterTag(t);
  subtitle(t);
  // 片头淡入
  const fi = prog(t, 0, 0.5); if (fi < 1) { ctx.fillStyle = `rgba(5,7,15,${1 - fi})`; ctx.fillRect(0, 0, W, H); }
  const fo = prog(t, TOTAL - 0.6, 0.6); if (fo > 0) { ctx.fillStyle = `rgba(5,7,15,${fo})`; ctx.fillRect(0, 0, W, H); }
}

// ================= 音效登记（与画面同一套时间） =================
(function regSfx() {
  sfx(P('D01', 0.55), 'pop', 0.7);
  sfx(S('C01') - 0.12, 'whoosh', 0.6);
  sfx(S('C02') - 0.12, 'pop', 0.5); typeSfx(S('C02') + 0.05, 14, D('C02') * 0.9); sfx(P('C02', 0.88), 'slap', 0.8);
  DOTS.forEach((_, i) => sfx(P('D02', 0.3 + i * 0.085), i % 2 ? 'tick2' : 'tick', 0.55));
  sfx(P('C03', 0.45), 'riser', 0.55); sfx(P('C04', 0.25), 'riser', 0.6);
  { let last = 0; for (let tt = P('C03', 0.5); tt < S('C05'); tt += 1 / 60) { const k = Math.floor(zoomK(tt) + 1e-6); if (k > last) { sfx(tt, 'tick', 0.45); last = k; } } }
  sfx(P('C04', 0.28), 'pop', 0.5); sfx(E('C04') + 0.25, 'slam', 0.6);
  sfx(S('C05'), 'whoosh', 0.3); sfx(P('C05', 0.8), 'tinkle', 0.8);
  sfx(S('C06') - 0.2, 'swoosh_in', 0.45); sfx(P('C06', 0.33) + 0.35, 'ding_hi', 0.7); sfx(P('C06', 0.72) + 0.35, 'ding_lo', 0.7);
  [S('C07'), P('C07', 0.28), P('C07', 0.52)].forEach(tt => sfx(tt + 0.3, 'click', 0.5));
  sfx(E('C07') - 0.4, 'stamp', 1.0); sfx(E('C07') - 0.4, 'impact', 0.55);
  sfx(S('D03') - 0.05, 'sting', 0.7);
  sfx(BK.history.t0 - 0.15, 'whoosh', 0.55);
  for (let i = 0; i < 10; i++) sfx(P('G01', 0.1) + i * 0.07 * D('G01'), 'tick2', 0.3);
  sfx(S('G02') - 0.05, 'slap', 0.8); [0.3, 0.46, 0.62].forEach(f => sfx(P('G02', f), 'pop', 0.4));
  sfx(S('G03') - 0.05, 'slap', 0.7); sfx(P('G03', 0.25), 'hum', 0.5); sfx(P('G03', 0.6), 'hum', 0.4);
  { let last = 1; for (let tt = P('G03', 0.32); tt < S('G04'); tt += 1 / 60) { const k = epiK(tt); if (k > last) { if (k <= 10 || k % 3 === 0) sfx(tt, 'tick', 0.3); last = k; } } }
  sfx(P('G04', 0.05), 'pop', 0.5); sfx(P('G04', 0.55), 'pop', 0.7);
  sfx(S('G05') + 0.25, 'thud', 1.0); sfx(P('G05', 0.78), 'slap', 0.6);
  sfx(BK.code.t0 - 0.05, 'glitch', 0.5); typeSfx(S('G06') + 0.05, 6, 0.45); typeSfx(P('G06', 0.12), 16, 0.5 * D('G06')); sfx(P('G06', 0.8), 'buzz', 0.6);
  typeSfx(S('G07'), 4, 0.3); for (let i = 0; i < 12; i++) sfx(P('G07', 0.12) + i * 0.032 * D('G07'), 'tick2', 0.25); sfx(P('G07', 0.58) + 0.45, 'ding', 0.6); typeSfx(P('G07', 0.86), 10, 0.5);
  sfx(BK.outro.t0 - 0.15, 'whoosh', 0.55); sfx(P('C08', 0.2), 'click', 0.5); sfx(P('C08', 0.42), 'click', 0.5); sfx(P('C08', 0.6), 'tinkle', 0.6); sfx(P('C08', 0.68), 'shimmer', 0.7); sfx(E('C08') - 0.4, 'slap', 0.8);
  sfx(S('C09') + 0.05, 'tick', 0.5); sfx(P('C09', 0.55), 'tick2', 0.6);
  sfx(P('C10', 0.06), 'slam', 0.9); sfx(P('C10', 0.6), 'pop', 0.5);
  sfx(E('C10') + 0.15, 'whoosh', 0.6); sfx(E('C10') + 0.55, 'sparkle', 0.6);
})();
SFX.sort((a, b) => a.t - b.t);

window.TIMELINE = { total: TOTAL, seq: ENTRIES.filter(e => e.k === 'v').map(e => ({ id: e.id, t0: e.t0, vo: e.vo, dur: e.dur, t1: e.t1 })), blocks: BLOCKS.map(b => ({ b: b.b, t0: b.t0, t1: b.t1 })), sfx: SFX };
window.renderAt = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, W, H); drawFrame(Math.min(t, TOTAL - 1e-3));
};
window.ready = (async () => {
  await Promise.all(SPR_NAMES.map(loadImg));
  await document.fonts.load(`80px "Smiley"`, '画不出来的函数'); await document.fonts.ready;
  window.renderAt(0); return true;
})();
if (!window.__EXPORT__) window.ready.then(() => { const t0 = performance.now(); (function loop() { window.renderAt(((performance.now() - t0) / 1000) % TOTAL); requestAnimationFrame(loop); })(); });
