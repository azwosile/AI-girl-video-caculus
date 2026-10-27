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
    ctx.globalAlpha = Math.min(1, (0.25 + 0.6 * s.z) * tw * (1 + 0.8 * PULSE));
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

// ================= FX 特效库（v2：减卡片、加动效） =================
function bez(p0, p1, p2, s) { const u = 1 - s; return [u * u * p0[0] + 2 * u * s * p1[0] + s * s * p2[0], u * u * p0[1] + 2 * u * s * p1[1] + s * s * p2[1]]; }
// 火花爆发：带拖尾的粒子，减速 + 重力
function sparks(t, t0, x, y, o = {}) {
  const life = o.life || 0.75, tau = t - t0; if (tau <= 0 || tau >= life) return;
  const n = o.n || 22, seed = o.seed ?? (Math.round(t0 * 997) % 100000), sp = o.speed || 480, g = o.grav ?? 380;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = (o.dir ?? 0) + (o.spread ?? 6.283) * (h32(i, seed, 1) - 0.5), v = sp * (0.3 + 0.7 * h32(i, seed, 2)), L = life * (0.5 + 0.5 * h32(i, seed, 3));
    if (tau > L) continue;
    const pos = tt => { const d = v * L * 0.5 * (1 - Math.pow(1 - tt / L, 2)); return [x + Math.cos(a) * d, y + Math.sin(a) * d + 0.5 * g * tt * tt]; };
    const [x1, y1] = pos(tau), [x0, y0] = pos(Math.max(0, tau - 0.05));
    const al = Math.pow(1 - tau / L, 1.3), col = Array.isArray(o.col) ? o.col[i % o.col.length] : (o.col || GOLD);
    ctx.strokeStyle = hexA(col, al); ctx.lineWidth = o.w || 2.6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${al * 0.8})`; ctx.fillRect(x1 - 1, y1 - 1, 2, 2);
  }
  ctx.restore();
}
// 冲击波：双环
function shock(t, t0, x, y, R, col = '#ffffff', o = {}) {
  [0, 0.09].forEach((dl, j) => {
    const p = prog(t, t0 + dl, o.d || 0.6); if (p <= 0 || p >= 1) return;
    const r = R * (j ? 0.7 : 1) * eOut(p);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = hexA(col, (1 - p) * (j ? 0.45 : 0.85)); ctx.lineWidth = (o.w || 10) * (1 - p) + 1;
    ctx.beginPath(); if (o.ry) ctx.ellipse(x, y, r, r * o.ry, 0, 0, 7); else ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.restore();
  });
}
function burst(t, t0, x, y, col, R = 120, n = 20) { shock(t, t0, x, y, R, col); sparks(t, t0, x, y, { col: [col, '#ffffff'], n, speed: R * 4.2 }); }
function flash(t, t0, a = 0.5, d = 0.3, rgb = '255,255,255') { const p = prog(t, t0, d); if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${rgb},${a * (1 - p) * (1 - p)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// 曲速星流
function warp(t, a, cx = W / 2, cy = H / 2, spd = 1.2) {
  if (a <= 0.01) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 0; i < 240; i++) {
    const ang = rnd(i + 3000) * 6.283, ph = (rnd(i + 3300) + t * spd * (0.6 + rnd(i + 3600))) % 1;
    const r = 30 + ph * ph * 1300, len = (10 + ph * 420) * a, c = Math.cos(ang), s = Math.sin(ang);
    ctx.strokeStyle = (i % 6 ? 'rgba(200,220,255,' : 'rgba(255,210,90,') + (ph * 0.9 * a).toFixed(3) + ')'; ctx.lineWidth = 0.8 + ph * 2.6;
    ctx.beginPath(); ctx.moveTo(cx + c * r, cy + s * r); ctx.lineTo(cx + c * (r + len), cy + s * (r + len)); ctx.stroke();
  }
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 560); g.addColorStop(0, `rgba(170,190,255,${0.28 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
// 集中线（放大时）
function focusLines(t, a, cx, cy) {
  if (a <= 0.02) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const fr = Math.floor(t * 24);
  for (let i = 0; i < 110; i++) {
    if (h32(i, fr, 21) > 0.5) continue;
    const ang = (i / 110) * 6.283 + h32(i, fr, 22) * 0.04, r0 = 480 + h32(i, fr, 23) * 300, wd = 0.003 + h32(i, fr, 24) * 0.006;
    ctx.fillStyle = `rgba(200,230,255,${(0.2 * a).toFixed(3)})`;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(cx + Math.cos(ang + wd) * 1700, cy + Math.sin(ang + wd) * 1700); ctx.lineTo(cx + Math.cos(ang - wd) * 1700, cy + Math.sin(ang - wd) * 1700); ctx.fill();
  }
  ctx.restore();
}
// 文字采样成点（粒子组字）
const TP_CACHE = {};
function textPoints(text, font, n) {
  const key = text + '|' + font + '|' + n; if (TP_CACHE[key]) return TP_CACHE[key];
  const c = document.createElement('canvas'); c.width = 1600; c.height = 500; const g = c.getContext('2d');
  g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText(text, 800, 250);
  const d = g.getImageData(0, 0, 1600, 500).data, pts = [];
  for (let y = 0; y < 500; y += 3) for (let x = 0; x < 1600; x += 3) if (d[(y * 1600 + x) * 4 + 3] > 140) pts.push([x - 800, y - 250]);
  const out = []; for (let i = 0; i < n && pts.length; i++) out.push(pts[Math.floor(h32(i, pts.length, 7) * pts.length)]);
  return TP_CACHE[key] = out;
}
function particleText(t, t0, text, x, y, size, col, o = {}) {
  if (t < t0) return;
  const n = o.n || 700, font = `${o.bold === false ? '' : 'bold '}${size}px ${o.font || F_FANCY}`, pts = textPoints(text, font, n);
  const dur = o.dur || 0.85, spread = o.spread ?? 0.35, solid = prog(t, t0 + dur + spread * 0.7, 0.3), out = o.out != null ? prog(t, o.out, 0.6) : 0;
  if (out >= 1) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < pts.length; i++) {
    const d0 = h32(i, 3, 11) * spread, e = eIO(clamp((t - t0 - d0) / dur)); if (e <= 0) continue;
    const X = x + pts[i][0], Y = y + pts[i][1];
    let sx, sy; if (o.from) [sx, sy] = o.from(i); else { const a = h32(i, 5, 11) * 6.283, r = 450 + h32(i, 6, 11) * 700; sx = x + Math.cos(a) * r; sy = y + Math.sin(a) * r * 0.6; }
    let [px, py] = bez([sx, sy], [(sx + X) / 2 + (h32(i, 8, 11) - 0.5) * 320, (sy + Y) / 2 - 160], [X, Y], e);
    if (out > 0) { const a = h32(i, 9, 11) * 6.283, v = 250 + h32(i, 10, 11) * 650; px += Math.cos(a) * v * eOut(out); py += Math.sin(a) * v * eOut(out) + 240 * out * out; }
    const al = (e < 1 ? 0.3 + 0.7 * e : 1 - solid * 0.8) * (1 - out);
    ctx.fillStyle = hexA(i % 7 ? col : '#ffffff', al); ctx.fillRect(px - 1.7, py - 1.7, 3.4, 3.4);
  }
  ctx.restore();
  if (solid > 0) { ctx.save(); ctx.globalAlpha = solid * (1 - out); ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 26; ctx.fillStyle = o.fill || col; ctx.fillText(text, x, y); ctx.restore(); }
}
// 动势字：逐字飞入 + 回弹 + 运动拖影
function kinetic(text, x, y, size, t, t0, o = {}) {
  const chars = [...text]; ctx.save(); ctx.font = `${o.bold === false ? '' : 'bold '}${size}px ${o.font || F_FANCY}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  const ws = chars.map(c => ctx.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? x : x - tot / 2;
  const out = o.out != null ? eIn(prog(t, o.out, 0.25)) : 0;
  chars.forEach((c, i) => {
    const t1 = t0 + i * (o.stagger ?? 0.04), mid = cx + ws[i] / 2; cx += ws[i];
    for (let g = 3; g >= 0; g--) {
      const p = prog(t - g * 0.028, t1, o.dur || 0.36); if (p <= 0) continue;
      const e = eBack(p), sc = lerp(o.s0 ?? 2.0, 1, eOut(p)), rot = (1 - eOut(p)) * (h32(i, 1, 3) - 0.5) * 1.2;
      ctx.save(); ctx.translate(mid + (1 - e) * (o.fx ?? 0), y + (1 - e) * (o.fy ?? -110) - out * 50); ctx.rotate(rot + (o.rot || 0)); ctx.scale(sc, sc);
      ctx.globalAlpha = (g ? 0.2 / g : 1) * clamp(p * 3) * (1 - out);
      if (!g) { ctx.shadowColor = o.glow || o.col || COL.cream; ctx.shadowBlur = 20; }
      ctx.fillStyle = o.col || COL.cream; ctx.fillText(c, 0, 0); ctx.restore();
    }
  });
  ctx.restore();
}
// 发光字：光笔揭示 + 字面光扫
function glowText(text, x, y, size, col, t, t0, o = {}) {
  const font = `${o.bold === false ? '' : 'bold '}${size}px ${o.font || F_FANCY}`;
  ctx.save(); ctx.font = font; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const w = ctx.measureText(text).width, x0 = o.align === 'left' ? x : o.align === 'right' ? x - w : x - w / 2;
  const dur = o.dur || Math.max(0.25, w / 1500), p = eOut(prog(t, t0, dur)), out = o.out != null ? prog(t, o.out, 0.25) : 0;
  if (p <= 0 || out >= 1) { ctx.restore(); return w; }
  ctx.globalAlpha = (o.alpha ?? 1) * (1 - out);
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10, y - size, (w + 20) * p, size * 2); ctx.clip();
  ctx.shadowColor = col; ctx.shadowBlur = o.blur ?? 16; ctx.fillStyle = o.fill || col; ctx.fillText(text, x0, y);
  ctx.shadowBlur = 0;
  const sp = prog(t, t0 + dur, 0.55);
  if (sp > 0 && sp < 1) { const bx = lerp(x0 - 120, x0 + w + 120, sp), g = ctx.createLinearGradient(bx - 70, 0, bx + 70, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillText(text, x0, y); }
  ctx.restore(); ctx.restore();
  if (p < 1) glowDot(x0 - 10 + (w + 20) * p, y, 5, col, 1 - out);
  return w;
}
// 发光数学式揭示（mathText 版）
function glowMath(str, x, y, size, col, t, t0, o = {}) {
  const w = mathW(str, size), x0 = o.align === 'center' ? x - w / 2 : x, dur = o.dur || Math.max(0.25, w / 1500);
  const p = eOut(prog(t, t0, dur)), out = o.out != null ? prog(t, o.out, 0.25) : 0; if (p <= 0 || out >= 1) return w;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10, y - size * 1.3, (w + 20) * p, size * 2); ctx.clip();
  mathText(str, x0, y, size, col, { glow: o.glow ?? 14, alpha: (o.alpha ?? 1) * (1 - out), upright: o.upright }); ctx.restore();
  if (p < 1) glowDot(x0 - 10 + (w + 20) * p, y - size * 0.3, 5, col);
  return w;
}
// 运动拖影：drawAt(t', alpha) 在过去几个时刻重画
function ghosts(t, drawAt, n = 4, dt = 0.03) { for (let i = n; i >= 1; i--) drawAt(t - i * dt, 0.14 * (n - i + 1) / n); drawAt(t, 1); }
// 节拍脉冲：重音音效时刻让星空和辉光亮一下
let PULSE = 0;

// ================= 场景（v2） =================
const SC = {};
// ---------- 块 open：抛物线（光笔+网格涟漪）→ 粒子重组成定义式 → 两个输出球砸出两条线 → 大肥鱼点点 ----------
const PB = { ox: 1180, oy: 800, u: 105 };
const pbPt = x => [PB.ox + x * PB.u, PB.oy - x * x * PB.u];
const FM = { x: 640, y: 330, ax: 1180, ay: 330, bx: 990, o1: [1075, 262], o0: [1075, 412] };
function fmT(t) { const k = eIO(prog(t, S('D02') - 0.05, 0.5)); return { k, s: lerp(1, 0.5, k), dx: lerp(0, 1250 - FM.ax, k), dy: lerp(0, 140 - FM.ay, k) }; }
function fmMap(t, px, py) { const f = fmT(t); return [FM.ax + (px - FM.ax) * f.s + f.dx, FM.ay + (py - FM.ay) * f.s + f.dy]; }
function gridRipple(t, a) {
  if (a <= 0) return;
  const R = eOut(prog(t, S('D01') - 0.2, 1.4)) * 1700, { ox, oy, u } = PB;
  ctx.save(); ctx.lineWidth = 1;
  for (let i = -9; i <= 9; i++) {
    [[ox + i * u, null], [null, oy - i * u]].forEach(([x, y]) => {
      const d = x != null ? Math.abs(x - ox) : Math.abs(y - oy); if (d > R) return;
      const front = Math.exp(-Math.pow((R - d) / 90, 2));
      ctx.strokeStyle = `rgba(92,200,232,${(0.07 + 0.35 * front) * a})`; ctx.beginPath();
      if (x != null) { ctx.moveTo(x, oy - 760); ctx.lineTo(x, oy + 140); } else { ctx.moveTo(ox - 900, y); ctx.lineTo(ox + 900, y); }
      ctx.stroke();
    });
  }
  ctx.strokeStyle = `rgba(237,230,216,${0.55 * a})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 420, oy); ctx.lineTo(ox + 420, oy); ctx.moveTo(ox, oy + 60); ctx.lineTo(ox, oy - 700); ctx.stroke();
  ctx.restore();
}
function parabola2(t, uCut, a) {
  if (a <= 0) return;
  const p = clamp((t - S('D01') - 0.15) / 1.5), n0 = Math.floor(uCut * 160), n1 = Math.floor(160 * p);
  if (n1 > n0) glowPath(() => { for (let i = n0; i <= n1; i++) { const [X, Y] = pbPt(-2.45 + 4.9 * i / 160); i > n0 ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, GOLD, 5, a);
  if (p > 0 && p < 1) {   // 光笔彗星头 + 拖尾
    const [hx, hy] = pbPt(-2.45 + 4.9 * p); glowDot(hx, hy, 9, '#ffffff'); glowDot(hx, hy, 16, GOLD, 0.5);
    for (let k = 1; k < 14; k++) { const q = p - k * 0.012; if (q < 0) break; const [x, y] = pbPt(-2.45 + 4.9 * q); glowDot(x + (h32(k, Math.floor(t * 30), 2) - 0.5) * 10, y + 8 + k * 2, 2.5, GOLD, 0.6 * (1 - k / 14)); }
  }
  // 标出几个点：一条“熟悉的曲线”
  [-2, -1, 1, 2].forEach((x, i) => {
    const t0 = P('D01', 0.5 + i * 0.08); if (t < t0 || uCut > (x + 2.45) / 4.9) return;
    const [X, Y] = pbPt(x); glowDot(X, Y, 7 * eBack(prog(t, t0, 0.25)), GOLD, a); shock(t, t0, X, Y, 60, GOLD, { w: 5 });
    mathText(`(${x}, ${x * x})`, X + (x < 0 ? -18 : 18), Y - 18, 30, COL.text, { align: x < 0 ? 'right' : 'left', alpha: a * prog(t, t0 + 0.1, 0.2), upright: true });
  });
  if (p > 0.75) glowMath('y = x^2', PB.ox + 200, PB.oy - 500, 66, GOLD, t, S('D01') + 1.35, { out: S('C01') + 0.1 });
}
const DIS = { n: 220 };
function dissolve(t) {   // C01：抛物线碎成金粉，飞去组成 “D(x) =”
  const t0 = S('C01') + 0.1; if (t < t0 || t > S('C02') + 0.8) return;
  const pts = textPoints('D(x) =', `italic 84px ${F_MATH}`, DIS.n), w = mathW('D(x) =', 84);
  const cx = FM.x + w / 2, cy = FM.y - 26;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < DIS.n; i++) {
    const u = i / DIS.n, tl = t0 + 0.55 * u, dur = 0.85 + 0.3 * h32(i, 1, 5), e = eIO(clamp((t - tl) / dur)); if (t < tl) continue;
    const [sx, sy] = pbPt(-2.45 + 4.9 * u), [tx, ty] = [cx + pts[i][0], cy + pts[i][1]];
    const sw = (h32(i, 2, 5) - 0.5) * 500, [px, py] = bez([sx, sy], [(sx + tx) / 2 + sw, Math.min(sy, ty) - 200 - h32(i, 3, 5) * 200], [tx, ty], e);
    const al = e < 1 ? 0.9 : 1 - prog(t, tl + dur, 0.3);
    ctx.fillStyle = hexA(e < 0.6 ? GOLD : COL.cream, al); ctx.fillRect(px - 2, py - 2, 4, 4);
    if (e < 1) { ctx.fillStyle = hexA(GOLD, 0.25 * al); ctx.beginPath(); ctx.arc(px, py, 7, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}
function orb(x, y, r, col, label, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, col); g.addColorStop(1, hexA(col, 0.25));
  ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  if (label) mathText(label, x, y + r * 0.42, r * 1.25, COL.ink, { align: 'center', upright: true });
  ctx.restore();
}
function formula(t) {   // 发光定义式（无卡片）
  const tIn = S('C02') - 0.25; if (t < tIn) return;
  const f = fmT(t), tr1 = S('C02') + 0.05, tr2 = P('C02', 0.5);
  ctx.save(); ctx.translate(FM.ax + f.dx, FM.ay + f.dy); ctx.scale(f.s, f.s); ctx.translate(-FM.ax, -FM.ay);
  mathText('D(x) =', FM.x, FM.y, 84, COL.cream, { glow: 18, alpha: prog(t, tIn, 0.35) });
  // 大括号：发光笔画
  const bp = eIO(prog(t, S('C02') - 0.1, 0.4));
  if (bp > 0) glowPath(() => { const x = FM.bx, n = Math.floor(60 * bp); for (let i = 0; i <= n; i++) { const s = i / 60, yy = lerp(205, 470, s), k = s < 0.5 ? s * 2 : (1 - s) * 2, xx = x + 26 - 30 * Math.pow(k, 6) - 10 * Math.sin(s * Math.PI); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } }, COL.cream, 4);
  [[tr1, P('C02', 0.45), FM.o1, GOLD, '1', 'x ∈ ℚ', '有理数'], [tr2, P('C02', 0.95), FM.o0, CYAN, '0', 'x ∉ ℚ', '无理数']].forEach(([a0, a1, [ox, oy], col, v, cond, zh], i) => {
    const pr = prog(t, a0, 0.35); if (pr <= 0) return;
    const dropped = t > S('D02') + 0.02;
    if (!dropped) orb(ox, oy, 38 * eBack(pr), col, v);
    else { ctx.save(); ctx.globalAlpha = 0.35; orb(ox, oy, 38, col, v); ctx.restore(); }
    shock(t, a0 + 0.1, ox, oy, 90, col, { w: 6 });
    glowMath(cond, ox + 62, oy + 22, 60, COL.cream, t, a0 + 0.15, { dur: 0.35 });
    glowText(zh, ox + 255, oy + 2, 44, col, t, a0 + 0.35, { dur: 0.3, align: 'left' });
  });
  ctx.restore();
  // 术语：发光细字 + 下划光线（不再用术语卡）
  const tt = P('C02', 0.85), [lx, ly] = fmMap(t, 1000, 545);
  if (t > tt) {
    ctx.save(); const s = fmT(t).s; ctx.translate(lx, ly); ctx.scale(s, s);
    glowText('Dirichlet function', -150, 0, 40, CYAN, t, tt, { font: F_MATH, bold: false, align: 'left', dur: 0.35 });
    glowText('狄利克雷函数', 220, 2, 38, GOLD, t, tt + 0.2, { align: 'left', dur: 0.3 });
    const up = eOut(prog(t, tt + 0.1, 0.5)); glowPath(() => { ctx.moveTo(-150, 34); ctx.lineTo(-150 + 620 * up, 34); }, CYAN, 1.5, 0.7);
    ctx.restore();
  }
}
// D02：两个输出球落下，砸出 y=1 / y=0 两条线
const LAND = { g: [1000, Y1], c: [1480, Y0] };
function dropOrbs(t) {
  const td = S('D02') + 0.02; if (t < td) return { g: 0, c: 0 };
  const res = {};
  [['g', FM.o1, GOLD, '1', 0], ['c', FM.o0, CYAN, '0', 0.12]].forEach(([k, o0, col, v, dl]) => {
    const [ox, oy] = fmMap(td, o0[0], o0[1]);
    const p = prog(t, td + dl, 0.5), [lx, ly] = LAND[k];
    if (p < 1) { const e = eIn(p), x = lerp(ox, lx, eOut(p)), y = lerp(oy, ly, e) - Math.sin(p * Math.PI) * 120; ghosts(t, (tt, al) => { const pp = prog(tt, td + dl, 0.5), xx = lerp(ox, lx, eOut(pp)), yy = lerp(oy, ly, eIn(pp)) - Math.sin(pp * Math.PI) * 120; orb(xx, yy, lerp(38, 14, pp), col, al > 0.9 ? v : '', al); }, 4, 0.035); }
    else glowDot(lx, ly, 9, col);
    const tl = td + dl + 0.5; shock(t, tl, lx, ly, 160, col, { ry: 0.35, w: 8 }); sparks(t, tl, lx, ly, { col: [col, '#fff'], n: 26, dir: -Math.PI / 2, spread: 2.6, speed: 520 });
    res[k] = eOut(prog(t, tl, 0.5));
  });
  return res;
}
function unrollLine(y, col, xl, p, lbl) {
  if (p <= 0) return;
  const a = lerp(xl, XL, p), b = lerp(xl, XR, p);
  ctx.save(); ctx.setLineDash([10, 12]); ctx.lineWidth = 2; ctx.strokeStyle = hexA(col, 0.4); ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.stroke(); ctx.restore();
  if (p < 1) { glowDot(a, y, 6, col); glowDot(b, y, 6, col); }
  if (p >= 1) mathText(lbl, XR - 6, y - 16, 30, col, { align: 'right', alpha: 0.85 });
}
SC.open = (t, blk) => {
  starfield(t);
  const tC = S('C01'), uCut = clamp((t - tC - 0.1) / 0.55);
  gridRipple(t, 1 - prog(t, tC + 0.1, 0.6));
  parabola2(t, uCut, 1);
  dissolve(t);
  formula(t);
  const dr = dropOrbs(t);
  if (t > S('D02')) {
    unrollLine(Y1, GOLD, LAND.g[0], dr.g || 0, 'y = 1'); unrollLine(Y0, CYAN, LAND.c[0], dr.c || 0, 'y = 0');
    axisTicks({ c: Math.PI, k: 0 }, prog(t, S('D02') + 0.7, 0.4));
  }
  d02Dots2(t, 1);
  // Claude 入场：光流
  const ls = prog(t, tC - 0.05, 0.5);
  if (ls > 0 && ls < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const y = 300 + h32(i, 1, 9) * 700, x = lerp(-300, 900, eOut(ls)) - h32(i, 2, 9) * 300, l = 200 + h32(i, 3, 9) * 400; ctx.strokeStyle = hexA(i % 3 ? '#ffffff' : COL.red, 0.5 * (1 - ls)); ctx.lineWidth = 2 + h32(i, 4, 9) * 3; ctx.beginPath(); ctx.moveTo(x - l, y); ctx.lineTo(x, y); ctx.stroke(); } ctx.restore(); }
  lecturer(t, 'C', 255, tC + 0.05, null);
  fancy('早学过了～', 1690, 560, 54, t, P('D01', 0.42), { rot: -0.1, c: GOLD, out: E('D01') + 0.1 });
};
function d02Dots2(t, a, view = { c: Math.PI, k: 0 }, labelA = 1) {
  DOTS.forEach(([v, top, lbl], i) => {
    const t0 = P('D02', 0.3 + i * 0.085); const p = prog(t, t0, 0.18); if (p <= 0) return;
    const x = vx(v, view), y = top ? Y1 : Y0, col = top ? GOLD : CYAN;
    if (x < XL - 20 || x > XR + 20) return;
    glowDot(x, y, 8 * eBack(p), col, a);
    if (labelA >= 1) { shock(t, t0, x, y, 46, col, { w: 4, d: 0.4 }); sparks(t, t0, x, y, { col, n: 8, speed: 220, life: 0.4, grav: 0 }); }
    if (labelA > 0) mathText(lbl, x, y - 26, 36, col, { align: 'center', alpha: a * labelA * p, upright: lbl.length > 1 && lbl[0] !== '√' });
  });
  const tp0 = P('D02', 0.22), tp1 = P('D02', 0.98);
  if (t > tp0 && t < tp1 + 0.3 && labelA >= 1) {
    const f = clamp((t - P('D02', 0.3)) / (0.085 * D('D02'))), i = Math.min(7, Math.floor(f)), fr = f - i;
    const [v1, a1] = DOTS[i], [v2, a2] = DOTS[Math.min(7, i + 1)], e = eIO(clamp(fr * 1.6 - 0.6));
    const x = lerp(vx(v1, view), vx(v2, view), e), y = lerp(a1 ? Y1 : Y0, a2 ? Y1 : Y0, e) - Math.sin(e * Math.PI) * 50;
    const al = Math.min(prog(t, tp0, 0.2), 1 - prog(t, tp1, 0.3));
    ctx.save(); ctx.globalAlpha = al; ctx.translate(x + 6, y - 6); ctx.rotate(0.7);
    ctx.fillStyle = COL.cream; ctx.fillRect(-7, -70, 14, 56); ctx.fillStyle = COL.red; ctx.beginPath(); ctx.moveTo(-7, -14); ctx.lineTo(7, -14); ctx.lineTo(0, 0); ctx.fill(); ctx.restore();
    glowDot(x, y, 4, '#ffffff', al);
  }
}
// ---------- 块 zoom：放大拖影 + 集中线 + 倍率冲击 → 区间夹逼 → 穿越切换 → 落点爆闪 → 激光探针 + 印章 ----------
const ZCROSS = [];  // 每跨过一个数量级的时刻
function zcross() { if (ZCROSS.length) return ZCROSS; let last = 0; for (let tt = P('C03', 0.5); tt < S('C06'); tt += 1 / 120) { const k = Math.floor(zoomK(tt) + 1e-6); if (k > last && k <= 7) { ZCROSS.push(tt); last = k; } } return ZCROSS; }
function viewAt2(t) { return t < S('C06') ? { c: Math.PI, k: zoomK(t) } : VIEW2; }
function labelGlow(text, x, y, col, t, t0, t1) { const a = win01(t, t0, t1, 0.3, 0.2); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; glowText(text, x, y, 32, col, t, t0, { align: 'left', dur: 0.3 }); ctx.restore(); }
function bracket2(t, a, xa, xb, view) {
  if (a <= 0) return;
  const pin = eOut(prog(t, S('C05') - 0.05, 0.4)), my = (Y1 + Y0) / 2;
  [[xa, '(', -1], [xb, ')', 1]].forEach(([x, ch, s]) => {
    const xx = x + s * (1 - pin) * 700;
    for (let g = 3; g >= 0; g--) { const pp = eOut(prog(t - g * 0.03, S('C05') - 0.05, 0.4)), xg = x + s * (1 - pp) * 700; ctx.save(); ctx.globalAlpha = a * (g ? 0.15 / g : 1); ctx.font = `300px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = COL.cream; ctx.shadowBlur = g ? 0 : 22; ctx.fillStyle = COL.cream; ctx.fillText(ch, xg, my); ctx.restore(); }
    sparks(t, S('C05') + 0.35, xx, my, { col: COL.cream, n: 12, dir: s > 0 ? 0 : Math.PI, spread: 1.6, speed: 300, grav: 100 });
  });
  ctx.save(); ctx.globalAlpha = a;
  mathText('a', xa, Y0 + 70, 40, COL.cream, { align: 'center' }); mathText('b', xb, Y0 + 70, 40, COL.cream, { align: 'center' });
  const ppu = PPU0 * Math.pow(10, view.k), wv = (xb - xa) / ppu;
  mathText('b − a ≈ ' + wv.toExponential(1).replace(/e-(\d+)/, (m, d) => ' × 10^{−' + d + '}'), XC, 274, 40, COL.cream, { align: 'center', upright: true, glow: 12 });
  ctx.restore();
}
function dropDot2(t, t0, x, y, col, label, ly) {
  const p = prog(t, t0, 0.42); if (p <= 0) return;
  ghosts(t, (tt, al) => { const pp = prog(tt, t0, 0.42); if (pp <= 0 || pp >= 1) return; glowDot(x, lerp(y - 320, y, eIn(pp)), 9, col, al); }, 4, 0.03);
  if (p >= 1) glowDot(x, y, 10, col);
  const tl = t0 + 0.42; shock(t, tl, x, y, 130, col); sparks(t, tl, x, y, { col: [col, '#fff'], n: 24, dir: -Math.PI / 2, spread: 2.8, speed: 420 }); flash(t, tl, 0.12, 0.2);
  const la = prog(t, tl, 0.25); if (la <= 0) return;
  ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = hexA(col, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + (ly < y ? -16 : 16)); ctx.lineTo(x, ly + (ly < y ? 14 : -40)); ctx.stroke(); ctx.restore();
  const w = mathW(label, 40), lx = clamp(x - w / 2, XL + 40, XR - w - 20);
  glowMath(label, lx, ly + 6, 40, col, t, tl, { upright: true, dur: 0.35 });
}
SC.zoom = (t, blk) => {
  const pull = eIO(prog(t, S('D03') - 0.1, 0.8));
  CAM.z = 1 - 0.12 * pull; starfield(t); CAM.z = 1;
  const v = viewAt2(t), k = v.k, dk = t < S('C06') ? (zoomK(t) - zoomK(t - 0.05)) * 20 : 0;
  const zs = S('C06'), thr = prog(t, zs - 0.3, 0.3), arr = eOut(prog(t, zs, 0.45));
  const [shx, shy] = shake(t, E('C07') - 0.4, 16, 0.45);
  ctx.save(); ctx.translate(shx, shy);
  ctx.translate(XC, 520); ctx.scale(1 - 0.08 * pull, 1 - 0.08 * pull);
  if (t < zs) { const s = 1 + 2.2 * eIn(thr); ctx.scale(s, s); } else { const s = lerp(0.55, 1, arr); ctx.scale(s, s); }
  ctx.translate(-XC, -520);
  ctx.save(); ctx.globalAlpha = t < zs ? 1 - thr : arr;
  const dA = t < zs ? prog(t, P('C03', 0.55), 0.7) : 0.55;
  guideLines(t < zs ? lerp(1, 0.35, prog(t, P('C03', 0.5), 1)) : 0.35);
  axisTicks(v, 1);
  if (dk > 0.05 && t < zs) { dust({ c: v.c, k: k - dk * 0.035 }, dA * 0.35, t); dust({ c: v.c, k: k - dk * 0.07 }, dA * 0.18, t); }   // 放大拖影
  dust(v, dA, t);
  if (t < zs) {
    d02Dots2(t, 1, v, 1 - prog(t, P('C03', 0.5), 0.5));
    const pa = prog(t, P('C03', 0.6), 0.4);
    if (pa > 0) { glowDot(XC, Y0, 10 + 3 * Math.sin(t * 6), CYAN); mathText('π = 3.14159265358979…', XC + 22, Y0 + 56, 32, CYAN, { alpha: pa * (1 - prog(t, S('C05'), 0.3)), upright: true }); }
    zcross().forEach(tc => { shock(t, tc, XC, Y0, 240, CYAN, { w: 6, d: 0.5 }); sparks(t, tc, XC, Y0, { col: [CYAN, GOLD], n: 14, speed: 380, grav: 0, life: 0.5 }); });
    const ba = win01(t, S('C05') - 0.05, zs, 0.2, 0.15);
    bracket2(t, ba, XC - 300, XC + 300, v);
    labelGlow('有理数 · 处处稠密', 640, Y1 - 60, GOLD, t, P('C05', 0.15), zs - 0.1);
    labelGlow('无理数 · 处处稠密', 640, Y0 + 62, CYAN, t, P('C05', 0.3), zs - 0.1);
    brokenLine(t, XC - 290, XC + 290, Y1, P('C05', 0.55), P('C05', 0.8));
    sparks(t, P('C05', 0.8), XC, Y1, { col: ['#ffffff', GOLD], n: 34, speed: 600 }); shock(t, P('C05', 0.8), XC, Y1, 200, '#ffffff', { w: 6 });
  } else {
    const ma = prog(t, zs, 0.4);
    ctx.save(); ctx.globalAlpha = ma; ctx.strokeStyle = hexA(COL.cream, 0.8); ctx.lineWidth = 4;
    const bx0 = XL + 10, bx1 = XR - 10, by0 = 250, by1 = 820, L_ = 46;
    [[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x + sx * L_, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * L_); ctx.stroke(); });
    ctx.restore();
    glowText('放大镜：1 到 1.0001 之间', bx0 + 60, by0, 28, COL.cream, t, zs + 0.15, { align: 'left', bold: false });
    const xr = vx(1.00005, VIEW2), xi = vx(1 + SQ2 / 1e5, VIEW2);
    dropDot2(t, P('C06', 0.33), xr, Y1, GOLD, '1.00005 = 20001/20000', Y1 - 70);
    dropDot2(t, P('C06', 0.72), xi, Y0, CYAN, '1 + √2/100000 ≈ 1.0000141', Y0 + 80);
    const PR = [[1 + SQ2 / 1e5, 0, '1.0000141…'], [1.00005, 1, '1.00005'], [1.000026, 1, '1.000026']];
    const tp = [S('C07'), P('C07', 0.28), P('C07', 0.52)];
    if (t > S('C07') - 0.1) {
      let i = 0; tp.forEach((tt, j) => { if (t >= tt) i = j; });
      const fr = i > 0 ? eIO(prog(t, tp[i], 0.3)) : 1, x = i > 0 ? lerp(vx(PR[i - 1][0], VIEW2), vx(PR[i][0], VIEW2), fr) : vx(PR[0][0], VIEW2);
      const pa = Math.min(prog(t, S('C07') - 0.1, 0.25), 1 - prog(t, E('C07') - 0.5, 0.3));
      if (pa > 0) {
        ctx.save(); ctx.globalAlpha = pa;
        const fl = 0.8 + 0.2 * Math.sin(t * 40);
        glowPath(() => { ctx.moveTo(x, 290); ctx.lineTo(x, 790); }, '#ff6b81', 3, fl);
        const [vv, out, lbl] = PR[i];
        if (fr > 0.95) {
          const y = out ? Y1 : Y0, c = out ? GOLD : CYAN, yo = out ? Y0 : Y1, th = tp[i] + (i ? 0.3 : 0);
          glowDot(x, y, 12, c); shock(t, th, x, y, 80, c, { w: 5 }); sparks(t, th, x, y, { col: c, n: 12, speed: 300 });
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = hexA(c, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.lineTo(x + 40, y); ctx.moveTo(x, y - 40); ctx.lineTo(x, y + 40); ctx.stroke(); ctx.restore();
          ctx.strokeStyle = 'rgba(237,230,216,0.35)'; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.arc(x, yo, 16, 0, 7); ctx.stroke(); ctx.setLineDash([]);
          mathText(`x = ${lbl}   ↦   D(x) = ${out}`, XC, 215, 44, c, { align: 'center', glow: 16 });
        }
        ctx.restore();
      }
    }
  }
  ctx.restore();
  // 印章「它是函数」：唯一的屏震
  const ts = E('C07') - 0.45;
  slab('它是函数', XC, 520, 120, t, ts, { rot: -0.14, bg: COL.red });
  shock(t, ts + 0.1, XC, 520, 520, COL.red, { w: 18, d: 0.7 }); sparks(t, ts + 0.1, XC, 520, { col: [COL.red, GOLD, '#fff'], n: 40, speed: 900, life: 0.9 });
  ctx.restore();
  focusLines(t, clamp(dk * 1.4) * (t < zs ? 1 : 0), XC, Y0);
  flash(t, zs - 0.02, 0.55, 0.35); flash(t, ts + 0.1, 0.3, 0.25, '255,120,90');
  hud(t, k, win01(t, P('C03', 0.35), zs, 0.3, 0.2));
  if (t < zs) {
    kinetic('×10', 1690, 225, 64, t, P('C04', 0.28), { col: GOLD, out: P('C04', 0.6) });
    const tm = E('C04') + 0.2;
    particleText(t, tm - 0.55, '×1,000,000', XC, 175, 110, GOLD, { n: 650, dur: 0.6, spread: 0.2, out: S('C05') + 0.1, from: i => { const x = XL + h32(i, 1, 4) * (XR - XL); return [x, h32(i, 2, 4) > 0.5 ? Y1 : Y0]; } });
    shock(t, tm, XC, 175, 420, GOLD, { ry: 0.4, w: 12 }); flash(t, tm, 0.25, 0.25, '255,220,120');
  }
  lecturer(t, 'C', 255, -9, E('D03') + 0.3);
  fancy('画不出来？！', 1480, 180, 76, t, P('D03', 0.45), { c: '#ff8c7a', rot: -0.08 });
};
// ---------- 块 history：曲速倒带 → 欧拉：一条曲线三次变形 → 傅里叶：本轮 + 谐波落叠 → 时间冻结 + 粒子问号 → 狄利克雷：任意对应 + 竖线扫描 ----------
const TL = { x0: 70, y0: 250, x1: 1250, y1: 165 };
const tlPt = f => [lerp(TL.x0, TL.x1, f), lerp(TL.y0, TL.y1, f)];
const NODES = [[0.15, '1748', '欧拉', () => S('G02') - 0.1, COL.cream], [0.5, '1807', '傅里叶', () => S('G03') - 0.05, COL.cream], [0.83, '1837', '狄利克雷', () => S('G05') + 0.2, COL.red]];
const EPI = { cx: 400, cy: 650, A: 120, w: 2 * Math.PI * 0.42, wx0: 700, wx1: 1220 };
function epiK(t) { const a = P('G03', 0.32), b = E('G03') + 0.8; if (t < a) return 1; return Math.min(25, 1 + Math.floor(24 * Math.pow(prog(t, a, b - a), 1.6))); }
function sqSum(th, K) { let s = 0; for (let j = 0; j < K; j++) { const n = 2 * j + 1; s += Math.sin(n * th) / n; } return s * 4 / Math.PI; }
function odometer(t, v, x, y, size, a) {   // 滚轮年份：每位数字像里程表一样滚动
  ctx.save(); ctx.globalAlpha = a; ctx.font = `${size}px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const dw = size * 0.56, n = 4;
  ctx.beginPath(); ctx.rect(x - dw * n / 2 - 20, y - size * 0.6, dw * n + 40, size * 1.2); ctx.clip();
  ctx.shadowColor = COL.cream; ctx.shadowBlur = 28; ctx.fillStyle = COL.cream;
  for (let d = 0; d < n; d++) {
    const place = Math.pow(10, n - 1 - d), q = v / place, base = Math.floor(q) % 10;
    const frac = d === n - 1 ? q - Math.floor(q) : clamp(((v % place) / place - 0.8) / 0.2);
    const cx = x - dw * n / 2 + dw * (d + 0.5);
    ctx.fillText(String(base), cx, y + frac * size * 1.1); ctx.fillText(String((base + 1) % 10), cx, y - (1 - frac) * size * 1.1);
  }
  ctx.restore();
}
function timeline2(t) {
  const p = eIO(prog(t, P('G01', 0.05), 0.9));
  ctx.save(); glowPath(() => { ctx.moveTo(TL.x0, TL.y0); const [ex, ey] = tlPt(p); ctx.lineTo(ex, ey); }, COL.cream, 3, 0.8); ctx.restore();
  if (p > 0 && p < 1) { const [ex, ey] = tlPt(p); glowDot(ex, ey, 7, '#ffffff'); }
  NODES.forEach(([f, yr, nm, tf, col], i) => {
    if (p < f) return; const [x, y] = tlPt(f), ton = tf();
    const lit = t > ton, pul = lit ? 1 + 0.25 * Math.sin((t - ton) * 5) : 0.7;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.shadowColor = col; ctx.shadowBlur = lit ? 24 : 0; ctx.fillStyle = lit ? col : 'rgba(237,230,216,0.45)'; ctx.fillRect(-11 * pul, -11 * pul, 22 * pul, 22 * pul); ctx.restore();
    if (lit) { burst(t, ton, x, y, col, 90, 14); glowText(yr + ' · ' + nm, x, y + 44, 30, col, t, ton + 0.05, { bold: false }); }
  });
  if (p >= 0.98) { const [x, y] = tlPt(1); glowText('今天', x + 46, y, 28, COL.cream, t, P('G01', 0.05) + 0.9, { bold: false }); }
}
const AX = { cx: 640, cy: 640, u: 80 };
function morphCurve(t, a) {   // 欧拉：x² → sin x → eˣ，一条曲线连续变形
  if (a <= 0) return;
  const F = [x => x * x / 2.2, x => 1.8 * Math.sin(1.3 * x), x => Math.exp(x * 0.9) / 2.2];
  const C = [GOLD, CYAN, COL.g], L = ['y = x^2', 'y = sin x', 'y = e^x'];
  const k1 = eIO(prog(t, P('G02', 0.42), 0.35)), k2 = eIO(prog(t, P('G02', 0.72), 0.35)), k3 = eIO(prog(t, S('G03') - 0.05, 0.35));
  const f = x => { let y = lerp(F[0](x), F[1](x), k1); y = lerp(y, F[2](x), k2); return lerp(y, 1.6 * Math.sin(1.3 * x), k3); };
  const col = k2 > 0.5 ? C[2] : k1 > 0.5 ? C[1] : C[0];
  const dp = eOut(prog(t, S('G02') + 0.05, 0.6));
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(237,230,216,0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(AX.cx - 470 * dp, AX.cy); ctx.lineTo(AX.cx + 470 * dp, AX.cy); ctx.moveTo(AX.cx, AX.cy + 180); ctx.lineTo(AX.cx, AX.cy - 260 * dp); ctx.stroke();
  glowPath(() => { let pen = false; const n = Math.floor(160 * dp); for (let i = 0; i <= n; i++) { const x = -5.6 + 11.2 * i / 160, y = f(x), ok = y > -2.3 && y < 3.3; if (ok && pen) ctx.lineTo(AX.cx + x * AX.u, AX.cy - y * AX.u); else if (ok) ctx.moveTo(AX.cx + x * AX.u, AX.cy - y * AX.u); pen = ok; } }, col, 4.5);
  [[S('G02') + 0.3, 0], [P('G02', 0.42), 1], [P('G02', 0.72), 2]].forEach(([tt, i], j, arr) => {
    const nx = arr[j + 1] ? arr[j + 1][0] : S('G03') - 0.05;
    if (t < tt || t > nx + 0.25) return;
    kinetic(L[i] === 'y = x^2' ? 'y = x²' : L[i] === 'y = e^x' ? 'y = eˣ' : 'y = sin x', AX.cx + 330, AX.cy + 130, 60, t, tt + (j ? 0.22 : 0), { font: F_MATH, bold: false, col: C[i], out: nx, stagger: 0.03 });
    if (j) { shock(t, tt, AX.cx, AX.cy, 300, C[i], { ry: 0.5, w: 5 }); }
  });
  ctx.restore();
}
function epicycles2(t, a) {
  if (a <= 0) return null;
  const tf = Math.min(t, S('G04') + 0.05), K = epiK(tf), th0 = EPI.w * tf, span = 4 * Math.PI;
  const grow = eOut(prog(t, P('G03', 0.18), 0.4));
  ctx.save(); ctx.globalAlpha = a;
  const tip = (tt, KK) => { let x = EPI.cx, y = EPI.cy; const th = EPI.w * tt; for (let j = 0; j < KK; j++) { const n = 2 * j + 1, r = EPI.A * 4 / (Math.PI * n) * grow; x += r * Math.cos(n * th); y -= r * Math.sin(n * th); } return [x, y]; };
  // 笔尖拖尾（同一 K 下的过去 0.9 s）
  if (t < S('G04')) glowPath(() => { for (let i = 0; i <= 40; i++) { const [x, y] = tip(tf - 0.9 * (1 - i / 40), K); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, COL.inv, 2, 0.55);
  let x = EPI.cx, y = EPI.cy;
  for (let j = 0; j < K; j++) {
    const n = 2 * j + 1, r = EPI.A * 4 / (Math.PI * n) * grow, hue = j / 8;
    ctx.strokeStyle = j ? hexA(j % 2 ? CYAN : COL.inv, 0.28) : 'rgba(237,230,216,0.45)'; ctx.lineWidth = j ? 1.3 : 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
    const nx = x + r * Math.cos(n * th0), ny = y - r * Math.sin(n * th0);
    ctx.strokeStyle = j ? hexA(GOLD, 0.75) : GOLD; ctx.lineWidth = j ? 1.6 : 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
    x = nx; y = ny;
  }
  glowDot(x, y, 7, '#ffffff');
  const waveY = th => EPI.cy - EPI.A * sqSum(th, K) * grow;
  ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(237,230,216,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(EPI.wx0, waveY(th0)); ctx.stroke(); ctx.setLineDash([]);
  // 新谐波：从上方落下叠进总波形
  const kPrev = epiK(tf - 0.3);
  for (let kk = kPrev + 1; kk <= K; kk++) {
    let tk = tf; while (epiK(tk - 1 / 60) >= kk && tk > tf - 0.3) tk -= 1 / 60;
    const p = clamp((tf - tk) / 0.3), n = 2 * kk - 1, r = EPI.A * 4 / (Math.PI * n), oy = -170 * (1 - eIn(p));
    glowPath(() => { for (let i = 0; i <= 160; i++) { const xx = EPI.wx0 + (EPI.wx1 - EPI.wx0) * i / 160, th = th0 - span * i / 160, yy = EPI.cy + oy - r * Math.sin(n * th) * 1.6; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } }, COL.inv, 1.6, 1 - p * 0.7);
    if (kk <= 12) sparks(t, tk, EPI.wx0, EPI.cy, { col: [COL.inv, '#fff'], n: 8, speed: 260, life: 0.45, grav: 0 });
  }
  glowPath(() => { for (let i = 0; i <= 420; i++) { const xx = EPI.wx0 + (EPI.wx1 - EPI.wx0) * i / 420, th = th0 - span * i / 420; i ? ctx.lineTo(xx, waveY(th)) : ctx.moveTo(xx, waveY(th)); } }, CYAN, 3.5);
  ctx.font = `28px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText('已叠加', EPI.wx1 - 250, EPI.cy + 215); ctx.font = `bold 44px ${F_CODE}`; ctx.fillStyle = GOLD; ctx.fillText(String(K).padStart(2, ' '), EPI.wx1 - 158, EPI.cy + 213);
  ctx.font = `28px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.fillText('个正弦波', EPI.wx1 - 98, EPI.cy + 215);
  const terms = ['sin x', ' + ', 'sin 3x', '/3', ' + ', 'sin 5x', '/5', ' + ', 'sin 7x', '/7', ' + …'], show = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5];
  let s = 'f(x) = 4/π · ( '; terms.forEach((tm, i) => { if (K >= show[i]) s += tm; }); if (K >= 5) s += ' )';
  mathText(s, 120, 395, 44, COL.text, { glow: 10, alpha: 1 - prog(t, S('G04'), 0.3) });
  if (t > E('G03') + 0.2) {
    const ga = prog(t, E('G03') + 0.2, 0.3), peak = EPI.cy - EPI.A * 1.18;
    ctx.globalAlpha = a * ga; ctx.strokeStyle = COL.red; ctx.lineWidth = 2; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(EPI.wx0, EPI.cy - EPI.A); ctx.lineTo(EPI.wx1, EPI.cy - EPI.A); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = `26px ${F_FANCY}`; ctx.fillStyle = '#ff9b8a'; ctx.fillText('吉布斯过冲 ≈ 9%', EPI.wx1 - 220, peak - 30);
  }
  ctx.restore();
  return { th0, K, waveY };
}
function lens2(t, a, st) {
  if (a <= 0 || !st) return;
  const { th0, K } = st, span = 4 * Math.PI;
  let best = null;
  for (let i = 60; i <= 420; i++) { const th = th0 - span * i / 420, m = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (m < span / 420 * 1.01) { best = EPI.wx0 + (EPI.wx1 - EPI.wx0) * i / 420; break; } }
  if (!best) best = (EPI.wx0 + EPI.wx1) / 2;
  const cx = best, cy = EPI.cy, R = 100 * eBack(a), Z = 2.6, waveY = th => EPI.cy - EPI.A * sqSum(th, K), lx = cx + 40, ly = cy - 210;
  ctx.save();
  ctx.strokeStyle = COL.cream; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 24, cy - 24); ctx.lineTo(lx - R * 0.7, ly + R * 0.7); ctx.stroke();
  ctx.fillStyle = 'rgba(8,12,26,0.92)'; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.clip();
  glowPath(() => { for (let i = -60; i <= 60; i++) { const dx = i / 60 * (100 / Z), xx = cx + dx, th = th0 - span * (xx - EPI.wx0) / (EPI.wx1 - EPI.wx0); const X = lx + dx * Z, Y = ly + (waveY(th) - cy) * Z * 0.5; i > -60 ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, CYAN, 3);
  ctx.restore();
  ctx.shadowColor = COL.cream; ctx.shadowBlur = 20; ctx.strokeStyle = COL.cream; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.stroke();
  ctx.restore();
  glowText('折角！', lx, ly + R + 36, 30, COL.cream, t, P('G04', 0.2), { bold: false });
  return [cx, cy];
}
// 狄利克雷：任意对应（每列一个点）+ 竖线扫描
const DIR = { x0: 150, x1: 1180, base: 840, top: 450, n: 46 };
function dirichletScatter(t, a) {
  if (a <= 0) return;
  const t0 = P('G05', 0.05), t1 = P('G05', 0.45), sc0 = P('G05', 0.55), sc1 = P('G05', 0.97);
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(237,230,216,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(DIR.x0 - 30, DIR.base); ctx.lineTo(DIR.x1 + 30, DIR.base); ctx.stroke();
  mathText('x', DIR.x1 + 46, DIR.base + 12, 40, COL.cream); mathText('y', DIR.x0 - 40, DIR.top - 10, 40, COL.cream);
  const scx = lerp(DIR.x0 - 20, DIR.x1 + 20, eIO(prog(t, sc0, sc1 - sc0)));
  for (let i = 0; i < DIR.n; i++) {
    const x = lerp(DIR.x0, DIR.x1, (i + 0.5) / DIR.n), hh = h32(i, 4, 77), y = lerp(DIR.base - 30, DIR.top, hh);
    const ti = lerp(t0, t1, h32(i, 5, 77)), p = prog(t, ti, 0.22); if (p <= 0) continue;
    const col = [GOLD, CYAN, COL.inv, COL.g][i % 4];
    if (p < 1) glowPath(() => { ctx.moveTo(x, DIR.base); ctx.lineTo(x, lerp(DIR.base, y, eOut(p))); }, col, 2, 1 - p * 0.5);
    else { ctx.strokeStyle = hexA(col, 0.12); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, DIR.base); ctx.lineTo(x, y); ctx.stroke(); }
    glowDot(x, lerp(DIR.base, y, eOut(p)), 6, col);
    if (p >= 1 && t < ti + 0.6) sparks(t, ti + 0.22, x, y, { col, n: 6, speed: 160, life: 0.4, grav: 0 });
    if (t > sc0 && scx >= x) { const ft = sc0 + (x - DIR.x0 + 20) / (DIR.x1 - DIR.x0 + 40) * (sc1 - sc0); shock(t, ft, x, y, 34, col, { w: 3, d: 0.45 }); }
  }
  if (t > sc0 && t < sc1 + 0.3) { const al = 1 - prog(t, sc1, 0.3); glowPath(() => { ctx.moveTo(scx, DIR.top - 60); ctx.lineTo(scx, DIR.base + 20); }, '#ff6b81', 3, al); }
  ctx.restore();
}
SC.history = (t, blk) => {
  starfield(t);
  const ws = blk.t0; warp(t, 0.9 * (1 - prog(t, P('G01', 0.7), 0.45)), 640, 560, 1.4);
  timeline2(t);
  // 年份滚轮 2026 → 1748，最后飞进 1748 节点
  const ya = win01(t, ws, S('G02') + 0.1, 0.2, 0.15);
  if (ya > 0) {
    const yr = lerp(2026, 1748, eIO(prog(t, P('G01', 0.08), 0.68 * D('G01'))));
    const fly = eIO(prog(t, P('G01', 0.84), S('G02') - P('G01', 0.84) + 0.05)), [nx, ny] = tlPt(0.15);
    const x = lerp(640, nx, fly), y = lerp(560, ny, fly), s = lerp(1, 0.15, fly);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); odometer(t, yr, 0, 0, 230, ya); ctx.restore();
    if (fly < 0.05) glowText('函数这个词，还在长大', 640, 720, 44, GOLD, t, P('G01', 0.3), { bold: false });
  }
  // 欧拉
  const ea = prog(t, S('G02') - 0.05, 0.3) * (1 - prog(t, P('G03', 0.25), 0.3));
  if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; kinetic('欧拉：函数 = 一个解析式', 640, 340, 56, t, S('G02') + 0.05, { col: COL.cream, out: S('G03') - 0.1 }); ctx.restore(); }
  morphCurve(t, ea);
  // 傅里叶
  const pa = prog(t, P('G03', 0.15), 0.3), dimD = prog(t, S('G05') - 0.05, 0.35);
  // 本轮整体在 G05 缩进 1807 节点
  const [n2x, n2y] = tlPt(0.5), shrink = eIO(dimD);
  ctx.save(); ctx.translate(lerp(660, n2x, shrink), lerp(650, n2y, shrink)); ctx.scale(lerp(1, 0.08, shrink), lerp(1, 0.08, shrink)); ctx.translate(-660, -650);
  const st = epicycles2(t, pa * (1 - shrink * 0.6));
  const lc = lens2(t, prog(t, P('G04', 0.05), 0.35) * (1 - prog(t, S('G05') - 0.1, 0.2)), st);
  ctx.restore();
  if (shrink > 0 && shrink < 1) { const [hx, hy] = [lerp(660, n2x, shrink), lerp(650, n2y, shrink)]; glowDot(hx, hy, 10, CYAN, 1 - shrink); }
  // 时间冻结：边框闪 + 冲击 + 粒子问号
  const tz = S('G04');
  if (t > tz && t < S('G05')) { const fa = (1 - prog(t, tz, 0.5)) * 0.8; if (fa > 0) { ctx.save(); ctx.strokeStyle = hexA(CYAN, fa); ctx.lineWidth = 14; ctx.strokeRect(7, 7, W - 14, H - 14); ctx.restore(); } }
  if (lc) shock(t, P('G04', 0.05), lc[0], lc[1], 260, CYAN, { w: 8 });
  particleText(t, P('G04', 0.45), '？', 400, 470, 300, COL.red, { n: 520, dur: 0.6, spread: 0.25, out: S('G05') - 0.05, fill: COL.red, from: i => st ? [EPI.wx0 + (EPI.wx1 - EPI.wx0) * h32(i, 1, 2), st.waveY(st.th0 - 4 * Math.PI * h32(i, 1, 2))] : [700, 650] });
  // 狄利克雷
  const da = prog(t, S('G05') - 0.05, 0.3);
  if (da > 0) {
    ctx.save(); ctx.font = `bold 54px ${F_FANCY}`; ctx.textBaseline = 'middle';
    const tH = S('G05') + 0.05, hy = 390;
    kinetic('狄利克雷：每个', 360, hy, 54, t, tH, { col: COL.cream, stagger: 0.03 });
    mathText('x', 600, hy + 18, 62, CYAN, { glow: 14, alpha: prog(t, tH + 0.2, 0.2) });
    kinetic('对应', 690, hy, 54, t, tH + 0.25, { col: COL.cream });
    const hl = prog(t, P('G05', 0.78), 0.2);
    kinetic('唯一', 820, hy, 64, t, tH + 0.32, { col: hl > 0.5 ? GOLD : COL.cream, glow: GOLD });
    if (hl > 0) { burst(t, P('G05', 0.78), 820, hy, GOLD, 150, 26); flash(t, P('G05', 0.78), 0.12, 0.2, '255,220,120'); }
    kinetic('的', 920, hy, 54, t, tH + 0.4, { col: COL.cream }); mathText('y', 965, hy + 18, 62, GOLD, { glow: 14, alpha: prog(t, tH + 0.45, 0.2) });
    ctx.restore();
    dirichletScatter(t, da);
    glowText('每一竖列：恰好一个点', 1000, 900, 30, '#ff9bab', t, P('G05', 0.6), { bold: false });
  }
  shock(t, S('G05') + 0.25, 660, 650, 700, COL.red, { w: 14, d: 0.6, ry: 0.6 }); flash(t, S('G05') + 0.25, 0.15, 0.25);
  lecturer(t, 'G', 1680, S('G01') - 0.15, null, { flip: true });
};
// ---------- 块 code：玻璃代码窗（A04）+ 报错故障 + 二进制雨 ----------
const CODE = [
  { s: [['// 狄利克雷函数', '#6f8a7a']] },
  { s: [['const ', '#c792ea'], ['D', '#82aaff'], [' = ', '#89ddff'], ['x', '#f78c6c'], [' => ', '#c792ea'], ['isRational', '#ffcb6b'], ['(', '#89ddff'], ['x', '#f78c6c'], [') ? ', '#89ddff'], ['1', GOLD], [' : ', '#89ddff'], ['0', CYAN], [';', '#89ddff']] },
];
function typed(t, segs, x, y, t0, dur) {
  const all = segs.map(s => s[0]).join(''), n = [...all].length, k = Math.floor(clamp((t - t0) / dur) * n);
  if (k <= 0) return null;
  let cx = x, used = 0;
  for (const [s, c] of segs) { const cs = [...s], take = Math.min(cs.length, k - used); if (take <= 0) break; const str = cs.slice(0, take).join(''); ctx.fillStyle = c; ctx.fillText(str, cx, y); cx += ctx.measureText(str).width; used += take; }
  if (k < n) { ctx.save(); ctx.shadowColor = CYAN; ctx.shadowBlur = 14; ctx.fillStyle = '#ffffff'; ctx.fillRect(cx + 2, y - 22, 4, 44); ctx.restore(); glowDot(cx + 4, y, 6, CYAN, 0.5); }
  return cx;
}
function scramble(t, target, t0, dur, seed) { const cs = [...target], n = cs.length, k = Math.floor(clamp((t - t0) / dur) * n); return cs.map((c, i) => i < k || !/[0-9]/.test(c) ? c : (i < k + 8 ? String(Math.floor(h32(i, Math.floor(t * 24), seed) * 10)) : ' ')).join(''); }
SC.code = (t, blk) => {
  starfield(t); blueprint(prog(t, blk.t0, 0.4));
  const wa = eBack(prog(t, S('G06') - 0.05, 0.35)), terr = P('G06', 0.78);
  const x = 80, y = 150, w = 1200, h = 660;
  const [ex, ey] = shake(t, terr, 10, 0.35);
  ctx.save(); ctx.translate(x + w / 2 + ex, y + h / 2 + ey); ctx.scale(wa, wa); ctx.translate(-x - w / 2, -y - h / 2);
  const errA = (1 - prog(t, terr, 0.6)) * (t > terr ? 1 : 0);
  ctx.shadowColor = errA > 0 ? hexA('#ff5c5c', 0.6) : hexA(CYAN, 0.35); ctx.shadowBlur = 40; ctx.fillStyle = 'rgba(12,18,38,0.9)'; rr(x, y, w, h, 18); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = errA > 0.05 ? '#ff5c5c' : hexA(CYAN, 0.8); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(92,200,232,0.1)'; rr(x, y, w, 56, [18, 18, 0, 0]); ctx.fill();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 32 + i * 28, y + 28, 8, 0, 7); ctx.fill(); });
  ctx.font = `26px ${F_CODE}`; ctx.fillStyle = 'rgba(237,230,216,0.75)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('dirichlet.js', x + w / 2, y + 29);
  ctx.textAlign = 'left'; ctx.font = `40px ${F_CODE}`;
  const LX = x + 50, LH = 64; let ly = y + 120;
  ctx.fillStyle = 'rgba(237,230,216,0.25)'; for (let i = 0; i < 8; i++) ctx.fillText(String(i + 1), x + 14, y + 120 + i * LH);
  typed(t, CODE[0].s, LX + 20, ly, S('G06') + 0.05, 0.45); ly += LH;
  if (errA > 0) { ctx.fillStyle = hexA('#ff5c5c', 0.25 * errA); ctx.fillRect(x + 6, ly - 30, w - 12, 60); }
  typed(t, CODE[1].s, LX + 20, ly, P('G06', 0.12), 0.5 * D('G06'));
  const sq = prog(t, terr, 0.25);
  if (sq > 0) {
    ctx.font = `40px ${F_CODE}`; const x0 = LX + 20 + ctx.measureText('const D = x => ').width, x1 = x0 + ctx.measureText('isRational').width;
    ctx.save(); ctx.shadowColor = '#ff5c5c'; ctx.shadowBlur = 10; ctx.strokeStyle = '#ff5c5c'; ctx.lineWidth = 3; ctx.beginPath();
    for (let xx = x0; xx <= lerp(x0, x1, sq); xx += 2) { const yy = ly + 26 + Math.sin((xx - x0) / 5) * 4; xx === x0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); } ctx.stroke(); ctx.restore();
    sparks(t, terr, (x0 + x1) / 2, ly + 26, { col: ['#ff5c5c', '#ffb3b3'], n: 16, speed: 300, life: 0.5 });
    const ta = eBack(prog(t, P('G06', 0.85), 0.3));
    if (ta > 0) { ctx.save(); ctx.translate(x0, ly + 54); ctx.scale(ta, ta); ctx.fillStyle = '#2a1016'; rr(0, 0, 640, 64, 10); ctx.fill(); ctx.strokeStyle = '#ff5c5c'; ctx.lineWidth = 2; ctx.stroke(); ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = '#ffb3b3'; ctx.textBaseline = 'middle'; ctx.fillText('✗ 写不出来：电脑分不出无理数', 22, 33); ctx.restore(); }
  }
  ly += LH * 2.3; ctx.font = `40px ${F_CODE}`;
  if (t > S('G07') - 0.1) {
    typed(t, [['> ', CYAN], ['0.1', COL.cream]], LX + 20, ly, S('G07'), 0.3); ly += LH;
    const b0 = P('G07', 0.1), b1 = P('G07', 0.52), bin = '0.0001100110011001100110011001100110011…';
    if (t > b0) {   // 二进制雨：每一位从窗口顶部落到位
      const cs = [...bin], cw = ctx.measureText('0').width;
      cs.forEach((c, i) => {
        const ti = lerp(b0, b1, i / cs.length), p = prog(t, ti, 0.35), cx = LX + 60 + i * cw;
        if (p <= 0) return;
        if (p < 1) { for (let k = 0; k < 4; k++) { const yy = lerp(y + 70, ly, eIn(p)) - k * 34; if (yy < y + 64) continue; ctx.fillStyle = hexA(CYAN, (1 - k / 4) * 0.7); ctx.fillText(String(h32(i, Math.floor(t * 20) + k, 3) > 0.5 ? 1 : 0), cx, yy); } }
        else { ctx.fillStyle = hexA(CYAN, 0.95); ctx.fillText(c, cx, ly); }
      });
      if (t > b1 + 0.3) mathText('_2', LX + 60 + cs.length * cw, ly + 6, 40, CYAN);
    }
    ly += LH;
    const f0 = P('G07', 0.58);
    if (t > f0) {
      const s = scramble(t, '3602879701896397', f0, 0.45, 7);
      ctx.fillStyle = COL.cream; ctx.fillText('= ' + s + ' / ', LX + 40, ly);
      const fx = LX + 40 + ctx.measureText('= 3602879701896397 / ').width, pa = prog(t, f0 + 0.45, 0.3);
      if (pa > 0) {
        const pulse = 0.5 + 0.5 * Math.sin((t - f0) * 7);
        ctx.fillStyle = hexA(GOLD, 0.18 + 0.12 * pulse * pa); rr(fx - 8, ly - 34, 110, 64, 8); ctx.fill();
        mathText('2^{55}', fx, ly + 14, 48, GOLD, { upright: true, glow: 16 * pa });
        burst(t, f0 + 0.45, fx + 45, ly, GOLD, 110, 18);
      }
      ctx.font = `28px ${F_CODE}`; ctx.fillStyle = hexA(COL.cream, 0.45 * prog(t, f0 + 0.5, 0.3)); ctx.fillText('= 0.1000000000000000055511151231257827…', LX + 40, ly + 50); ctx.font = `40px ${F_CODE}`;
    }
    ly += LH * 1.6;
    typed(t, [['// 每个浮点数都是分数 → D(x) 永远等于 1', '#9fd3a8']], LX + 20, ly, P('G07', 0.86), 0.5);
  }
  ctx.restore();
  // 报错时的错位故障（只在代码窗区域）
  if (errA > 0.3) for (let k = 0; k < 6; k++) { const yy = y + h32(k, Math.floor(t * 30), 9) * h, hh = 10 + h32(k, 3, 9) * 40, off = (h32(k, Math.floor(t * 30), 4) - 0.5) * 60 * errA; ctx.drawImage(cv, x, yy, w, hh, x + off, yy, w, hh); ctx.fillStyle = hexA(k % 2 ? CYAN : '#ff5c5c', 0.18 * errA); ctx.fillRect(x, yy, w, hh * 0.3); }
  lecturer(t, 'G', 1680, -9, null, { flip: true });
};
// ---------- 块 outro：旧观念飘入 → 激光切开 → 内爆成粒子 → 映射（A09 预演）→ 粒子组字 → 高中速通快进 → 片尾 ----------
const MX = { x: 900, y: 610, rx: 150, ry: 215 }, MY = { x: 1500, y: 610, rx: 150, ry: 215 };
const SRC = Array.from({ length: 30 }, (_, i) => { const a = rnd(i + 11) * 6.283, r = Math.sqrt(rnd(i + 31)) * 0.78; return [MX.x + Math.cos(a) * MX.rx * r, MX.y + Math.sin(a) * MX.ry * r]; });
const DST = Array.from({ length: 12 }, (_, i) => { const a = rnd(i + 51) * 6.283, r = Math.sqrt(rnd(i + 71)) * 0.75; return [MY.x + Math.cos(a) * MY.rx * r, MY.y + Math.sin(a) * MY.ry * r]; });
const MAP = SRC.map((_, i) => Math.floor(rnd(i + 91) * DST.length));
const HL = 7;
function ctrl(a, b) { return [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 120 - Math.abs(a[1] - b[1]) * 0.2]; }
const OBJ = [['曲线', 760], ['公式', 1040], ['方波', 1320], ['代码', 1600]];
function objDraw(i, x, y, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  if (i === 0) glowPath(() => { for (let k = 0; k <= 40; k++) { const u = -1 + 2 * k / 40; k ? ctx.lineTo(u * 80, 50 - u * u * 100) : ctx.moveTo(u * 80, 50 - u * u * 100); } }, GOLD, 4);
  if (i === 1) mathText('f(x) = x^2+1', 0, 14, 46, COL.text, { align: 'center', glow: 12 });
  if (i === 2) glowPath(() => { for (let k = 0; k <= 80; k++) { const X = -90 + k * 2.25, Y = -36 * sqSum(k / 80 * 4 * Math.PI, 9); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, CYAN, 3);
  if (i === 3) { ctx.font = `bold 60px ${F_CODE}`; ctx.fillStyle = '#c792ea'; ctx.shadowColor = '#c792ea'; ctx.shadowBlur = 16; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('{ ; }', 0, 0); }
  ctx.restore();
}
SC.outro = (t, blk) => {
  starfield(t);
  const T0 = S('C08'), tShat = P('C08', 0.6);
  OBJ.forEach(([nm, ox], i) => {
    const t0 = T0 - 0.15 + i * 0.09, y = 300;
    if (t >= tShat || t < t0) return;
    const cut = i < 2 ? P('C08', i === 0 ? 0.2 : 0.42) : 9e9;
    const drawAt = (tt, al) => { const p = eOut(prog(tt, t0, 0.5)); objDraw(i, lerp(ox + (i % 2 ? 600 : -600), ox, p), y + Math.sin(tt * 1.5 + i) * 6, al * clamp(p * 2)); };
    if (t < cut) { ghosts(t, drawAt, 3, 0.04); glowText(nm, ox, y + 105, 28, COL.cream, t, t0 + 0.3, { bold: false }); }
    else {   // 激光切开：上下两半错开
      const sp = eOut(prog(t, cut, 0.5));
      const polys = [[[ox - 220, y - 220], [ox + 220, y - 220], [ox + 220, y + 44], [ox - 220, y - 44]], [[ox - 220, y - 44], [ox + 220, y + 44], [ox + 220, y + 220], [ox - 220, y + 220]]];
      polys.forEach((pg, j) => { const s = j ? 1 : -1; ctx.save(); ctx.beginPath(); pg.forEach(([a, b], k) => k ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.clip(); ctx.translate(s * sp * 40, s * sp * 26); objDraw(i, ox, y, 1 - sp * 0.4); ctx.restore(); });
      const lp = prog(t, cut - 0.08, 0.2);
      if (lp > 0 && lp < 1) glowPath(() => { ctx.moveTo(ox - 220, y - 44); ctx.lineTo(lerp(ox - 220, ox + 220, lp), lerp(y - 44, y + 44, lp)); }, '#ff5c5c', 5);
      sparks(t, cut, ox, y, { col: ['#ff5c5c', '#ffd25a', '#fff'], n: 26, speed: 520, dir: 0.2, spread: 3.4 });
      glowText(nm + '？', ox, y + 105, 28, '#ff9b8a', t, cut, { bold: false });
    }
  });
  flash(t, tShat, 0.25, 0.25);
  const ps = prog(t, tShat, 1.0);
  if (ps > 0 && ps < 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 90; i++) {
      const ti = i % 4, sx = OBJ[ti][1] + (h32(i, 1, 6) - 0.5) * 220, sy = 300 + (h32(i, 2, 6) - 0.5) * 150, [tx, ty] = SRC[i % SRC.length];
      const e = eIO(clamp(ps * 1.3 - h32(i, 3, 6) * 0.3)), sw = (h32(i, 4, 6) - 0.5) * 2;
      const [px, py] = bez([sx, sy], [lerp(sx, tx, 0.5) + sw * 260, sy - 220 + sw * 80], [tx, ty], e);
      const col = [GOLD, COL.text, CYAN, '#c792ea'][ti];
      ctx.fillStyle = hexA(col, 0.9 - e * 0.4); ctx.fillRect(px - 2.5, py - 2.5, 5, 5); ctx.fillStyle = hexA(col, 0.15); ctx.beginPath(); ctx.arc(px, py, 9, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  const ma = prog(t, tShat + 0.5, 0.4) * (1 - 0.88 * prog(t, S('C10'), 0.35));
  if (ma > 0) {
    ctx.save(); ctx.globalAlpha = ma;
    const xg = prog(t, S('C09'), 0.3);
    [[MX, CYAN, 'X', xg], [MY, GOLD, 'Y', 0]].forEach(([m, c, n, g]) => {
      ctx.strokeStyle = hexA(c, 0.5 + 0.5 * g); ctx.lineWidth = 3 + 4 * g; ctx.shadowColor = c; ctx.shadowBlur = 10 + 20 * g;
      ctx.beginPath(); ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, 7); ctx.stroke(); ctx.shadowBlur = 0;
      mathText(n, m.x, m.y - m.ry - 24, 64, c, { align: 'center', glow: 12 });
    });
    shock(t, S('C09') + 0.05, MX.x, MX.y, 260, CYAN, { ry: 1.4, w: 8 });
    mathText('f', 1200, 345, 64, COL.f, { align: 'center', glow: 14 });
    SRC.forEach(p => glowDot(p[0], p[1], 5, CYAN, 0.8)); DST.forEach(p => glowDot(p[0], p[1], 6, GOLD, 0.85));
    SRC.forEach((p, i) => {
      const q = DST[MAP[i]], c = ctrl(p, q), per = 2.2, ph = ((t - tShat) / per + rnd(i + 13)) % 1;
      if (i === HL && t > P('C09', 0.5)) return;
      ctx.strokeStyle = hexA(COL.text, 0.08); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(c[0], c[1], q[0], q[1]); ctx.stroke();
      if (t < tShat + 0.6) return;
      const head = bez(p, c, q, eIO(ph)), tail = bez(p, c, q, eIO(Math.max(0, ph - 0.14)));
      ctx.strokeStyle = hexA(COL.inv, 0.75); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tail[0], tail[1]); ctx.lineTo(head[0], head[1]); ctx.stroke();
      glowDot(head[0], head[1], 4, COL.inv, 0.9);
      if (ph > 0.96) glowDot(q[0], q[1], 10, GOLD, 0.6);
    });
    const hp = prog(t, P('C09', 0.5), 0.5);
    if (hp > 0) {
      const p = SRC[HL], q = DST[MAP[HL]], c = ctrl(p, q);
      glowPath(() => { ctx.moveTo(p[0], p[1]); for (let k = 1; k <= 40 * hp; k++) { const [a, b] = bez(p, c, q, k / 40); ctx.lineTo(a, b); } }, GOLD, 4);
      const pp = ((t - P('C09', 0.5)) / 0.9) % 1, [ax, ay] = bez(p, c, q, pp); if (hp >= 1) glowDot(ax, ay, 8, '#ffffff');
      glowDot(p[0], p[1], 9, '#ffffff'); if (hp >= 1) glowDot(q[0], q[1], 11, GOLD);
      burst(t, P('C09', 0.5) + 0.5, q[0], q[1], GOLD, 90, 16);
    }
    ctx.restore();
    glowText('从哪来：定义域', MX.x, MX.y + MX.ry + 52, 32, CYAN, t, S('C09') + 0.05, { out: S('C10') });
    glowText('去哪里：唯一的像', MY.x, MY.y + MY.ry + 52, 32, GOLD, t, P('C09', 0.55), { out: S('C10') });
  }
  particleText(t, E('C08') - 0.75, '映射', 1200, 205, 96, COL.cream, { n: 520, dur: 0.6, spread: 0.2, out: S('C10') - 0.1, from: i => SRC[i % SRC.length] });
  glowText('mapping', 1200, 275, 36, CYAN, t, E('C08') - 0.1, { font: F_MATH, bold: false, out: S('C10') - 0.1 });
  // C10：高中速通（快进）
  if (t > S('C10') - 0.1) {
    const tc = S('C10'), ff = win01(t, tc, E('C10') + 0.1, 0.2, 0.3);
    if (ff > 0) {   // 高中知识点高速掠过
      const W_ = ['一次函数', '二次函数', '幂函数', '指数函数', '对数函数', '三角函数', '反比例', '定义域', '值域', '单调性', '奇偶性', '周期'];
      ctx.save(); ctx.font = `40px ${F_FANCY}`; ctx.textBaseline = 'middle';
      W_.forEach((wd, i) => {
        const yy = 380 + (i % 6) * 70 + (h32(i, 1, 8) - 0.5) * 30, sp = 1500 + h32(i, 2, 8) * 900, ph = (t - tc) * sp + h32(i, 3, 8) * 2400;
        const xx = W + 200 - (ph % (W + 900));
        for (let g = 4; g >= 0; g--) { ctx.globalAlpha = ff * (g ? 0.1 : 0.55); ctx.fillStyle = i % 3 ? COL.cream : CYAN; ctx.fillText(wd, xx + g * 40, yy); }
      });
      ctx.restore();
      for (let k = 0; k < 3; k++) { const ph = ((t - tc) * 2 + k / 3) % 1; kinetic('≫', 1650 + ph * 120, 640, 80, t, tc, { col: hexA(COL.red, 1), bold: true }); }
    }
    particleText(t, P('C10', 0.04), '高中速通', 1180, 470, 150, COL.red, { n: 800, dur: 0.55, spread: 0.2, fill: COL.red });
    shock(t, P('C10', 0.04) + 0.75, 1180, 470, 600, COL.red, { ry: 0.35, w: 14 }); flash(t, P('C10', 0.04) + 0.75, 0.2, 0.25, '255,120,90');
    const ba = prog(t, P('C10', 0.3), 0.3);
    if (ba > 0) {
      ctx.save(); ctx.globalAlpha = ba;
      ctx.fillStyle = 'rgba(12,18,38,0.85)'; rr(820, 640, 760, 54, 27); ctx.fill(); ctx.strokeStyle = hexA(COL.cream, 0.6); ctx.lineWidth = 2; ctx.stroke();
      const fp = clamp((t - P('C10', 0.3)) / 2.4) * 0.92; ctx.shadowColor = COL.red; ctx.shadowBlur = 18; ctx.fillStyle = COL.red; rr(826, 646, 748 * fp, 42, 21); ctx.fill(); ctx.shadowBlur = 0;
      glowDot(826 + 748 * fp, 667, 8, '#ffffff');
      ctx.restore();
      glowText('约 5 分钟', 840, 735, 30, COL.cream, t, P('C10', 0.32), { align: 'left', bold: false });
    }
    const gp = prog(t, P('C10', 0.6), 0.5);
    if (gp > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 3; k++) { const r = 60 + ((t * 0.8 + k / 3) % 1) * 90; ctx.strokeStyle = hexA(CYAN, gp * (1 - ((t * 0.8 + k / 3) % 1))); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(1640, 820, r, r * 0.45, 0, 0, 7); ctx.stroke(); } ctx.restore(); }
    glowText('→ 然后是真正的大学内容', 1240, 820, 50, CYAN, t, P('C10', 0.6));
  }
  lecturer(t, 'C', 255, S('C08') - 0.15, null);
  const te = E('C10') + 0.15;
  if (t > te) { endCard(t, prog(t, te + 0.1, 0.4)); }
  flash(t, te, 0.7, 0.4); shock(t, te, W / 2, H / 2, 1200, '#ffffff', { w: 20, d: 0.7 });
};
function endCard(t, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; CAM.z = 1; starfield(t); ctx.restore();
  const te = E('C10') + 0.15;
  warp(t, 0.5 * (1 - prog(t, te, 1.2)), W / 2, H / 2, 1.6);
  dust({ c: 0.5 + t * 0.002, k: 2.2 + (t - te) * 0.25 }, 0.5 * a, t);
  glowText('第 1 章 · P0', 960, 300, 40, COL.red, t, te + 0.4);
  particleText(t, te + 0.3, '画不出来的函数', 960, 470, 130, COL.cream, { n: 900, dur: 0.7, spread: 0.3 });
  glowText('AI娘微积分课 · 函数与模型', 960, 820, 40, COL.cream, t, te + 1.1, { bold: false });
  ctx.save(); ctx.globalAlpha = prog(t, te + 1.3, 0.4); ctx.font = `24px ${F_BODY}`; ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('立绘设定：ZipZipPipe / ai-girls　·　BGM：“Easy Lemon” Kevin MacLeod (incompetech.com) CC BY 4.0　·　仅供非商业学习交流', 960, 1010); ctx.restore();
}

// ================= 合成 =================
const CAMEOS = [['d_happy', S('D01'), E('D01') + 0.05], ['d_think', S('D02'), E('D02') + 0.05], ['d_shock', S('D03'), E('D03') + 0.2]];
function chapterTag(t) {
  ctx.save(); ctx.font = `26px ${F_FANCY}`; ctx.textBaseline = 'middle';
  ctx.fillStyle = COL.red; ctx.fillRect(36, 30, 52, 40); ctx.fillStyle = COL.cream; ctx.fillText('P0', 46, 51);
  ctx.fillStyle = 'rgba(237,230,216,0.7)'; ctx.fillText('AI娘微积分课 · 第1章', 100, 51); ctx.restore();
}
let HITS = null;
function drawFrame(t) {
  if (!HITS) HITS = SFX.filter(e => ['slam', 'stamp', 'thud', 'impact', 'ding_hi', 'ding_lo', 'zap', 'warp', 'laser', 'soft_hit', 'marimba', 'marimba_hi', 'marimba_lo', 'bell_soft', 'check', 'swell'].includes(e.name)).map(e => [e.t, e.gain]);
  PULSE = 0; for (const [ht, g] of HITS) { if (t >= ht && t < ht + 1.2) PULSE += g * Math.exp(-(t - ht) * 5); }
  PULSE = Math.min(1.2, PULSE);
  const blk = BLOCKS.find(b => t >= b.t0 && t < b.t1) || BLOCKS[BLOCKS.length - 1];
  const en = blk.entries.find(e => t >= e.t0 && t < e.t1);
  CAM = { x: 0, y: 0, z: 1 };
  ctx.save(); (SC[blk.b] || (() => { }))(t, blk, en); ctx.restore();
  // 块切换：曲速（→history）/ 故障切（→code）/ 白闪冲击（→outro）
  const hb = BK.history.t0, ob = BK.outro.t0, cb = BK.code.t0;
  if (t > hb - 0.35 && t < hb) warp(t, prog(t, hb - 0.35, 0.35), 640, 560, 1.4);
  flash(t, hb - 0.03, 0.6, 0.35, '200,220,255');
  if (t > cb - 0.08 && t < cb + 0.25) { const p = prog(t, cb - 0.08, 0.33); for (let k = 0; k < 9; k++) { const y = h32(k, Math.floor(t * 30), 9) * H, hh = 20 + h32(k, 3, 9) * 90, off = (h32(k, Math.floor(t * 30), 4) - 0.5) * 220 * (1 - p); ctx.drawImage(cv, 0, y, W, hh, off, y, W, hh); ctx.fillStyle = hexA(k % 2 ? CYAN : COL.red, 0.25 * (1 - p)); ctx.fillRect(0, y, W, hh * 0.3); } }
  flash(t, ob - 0.05, 0.55, 0.35); shock(t, ob - 0.05, W / 2, H / 2, 1300, COL.red, { w: 24, d: 0.6 });
  CAMEOS.forEach(c => { if (t > c[1] - 0.3 && t < c[2] + 0.4) cameo(t, c[0], c[1], c[2]); });
  if (t < E('C10') + 0.15) chapterTag(t);
  subtitle(t);
  const fi = prog(t, 0, 0.5); if (fi < 1) { ctx.fillStyle = `rgba(5,7,15,${1 - fi})`; ctx.fillRect(0, 0, W, H); }
  const fo = prog(t, TOTAL - 0.6, 0.6); if (fo > 0) { ctx.fillStyle = `rgba(5,7,15,${fo})`; ctx.fillRect(0, 0, W, H); }
}

// ================= 音效登记（与画面同一套时间） =================
(function regSfx() {
  sfx(S('D01') + 0.1, 'swoosh_in', 0.35); [-2, -1, 1, 2].forEach((x, i) => sfx(P('D01', 0.5 + i * 0.08), 'tick', 0.45)); sfx(P('D01', 0.42), 'pop', 0.6);
  sfx(S('C01') - 0.08, 'whoosh', 0.6); sfx(S('C01') + 0.15, 'shimmer', 0.6);
  sfx(S('C02') + 0.15, 'marimba', 0.6); sfx(P('C02', 0.5) + 0.1, 'marimba_lo', 0.6); typeSfx(S('C02') + 0.2, 10, D('C02') * 0.8, 0.15); sfx(P('C02', 0.85), 'sparkle', 0.5);
  sfx(S('D02') + 0.52, 'soft_hit', 0.7); sfx(S('D02') + 0.64, 'soft_hit', 0.6); sfx(S('D02') + 0.55, 'whoosh', 0.3);
  DOTS.forEach((_, i) => sfx(P('D02', 0.3 + i * 0.085), i % 2 ? 'tick2' : 'tick', 0.55));
  sfx(P('C03', 0.45), 'riser', 0.55); sfx(P('C04', 0.25), 'riser', 0.6);
  zcross().forEach((tc, i) => sfx(tc, i % 2 ? 'marimba_hi' : 'marimba', 0.3));
  sfx(P('C04', 0.28), 'pop', 0.5); sfx(E('C04') - 0.35, 'shimmer', 0.5); sfx(E('C04') + 0.2, 'bell_soft', 0.7);
  sfx(S('C05') - 0.05, 'whoosh', 0.45); sfx(S('C05') + 0.35, 'click', 0.5); sfx(P('C05', 0.8), 'tinkle', 0.8); sfx(P('C05', 0.8), 'crack', 0.5);
  sfx(S('C06') - 0.95, 'warp', 0.4); sfx(S('C06') - 0.02, 'swoosh_soft', 0.6);
  sfx(P('C06', 0.33) + 0.42, 'ding_hi', 0.7); sfx(P('C06', 0.72) + 0.42, 'ding_lo', 0.7);
  sfx(S('C07') - 0.1, 'laser', 0.4); [P('C07', 0.28), P('C07', 0.52)].forEach(tt => sfx(tt, 'laser', 0.3)); [S('C07'), P('C07', 0.28) + 0.3, P('C07', 0.52) + 0.3].forEach(tt => sfx(tt, 'click', 0.5));
  sfx(E('C07') - 0.4, 'stamp', 1.0); 
  sfx(S('D03') - 0.05, 'sting', 0.7);
  sfx(BK.history.t0 - 0.7, 'warp', 0.75);
  for (let i = 0; i < 12; i++) sfx(P('G01', 0.08) + i * 0.057 * D('G01'), 'tick2', 0.3);
  sfx(P('G01', 0.86), 'whoosh', 0.4); sfx(S('G02') - 0.05, 'pluck', 0.5);
  sfx(P('G02', 0.42), 'swoosh_in', 0.4); sfx(P('G02', 0.72), 'swoosh_in', 0.4);
  sfx(S('G03') - 0.05, 'pluck', 0.5); sfx(P('G03', 0.2), 'hum', 0.5); sfx(P('G03', 0.6), 'hum', 0.4);
  { let last = 1; for (let tt = P('G03', 0.32); tt < S('G04'); tt += 1 / 60) { const k = epiK(tt); if (k > last) { if (k <= 10 || k % 3 === 0) sfx(tt, 'tick', 0.3); last = k; } } }
  sfx(S('G04') + 0.02, 'soft_hit', 0.6); sfx(P('G04', 0.05), 'pop', 0.5); sfx(P('G04', 0.45), 'shimmer', 0.6);
  sfx(S('G05') + 0.25, 'swell', 0.7); sfx(S('G05') + 0.25, 'bell_soft', 0.5); for (let i = 0; i < 10; i++) sfx(lerp(P('G05', 0.05), P('G05', 0.45), i / 9), 'tick2', 0.22); sfx(P('G05', 0.55), 'laser', 0.3); sfx(P('G05', 0.78), 'sparkle', 0.6);
  sfx(BK.code.t0 - 0.05, 'glitch', 0.5); typeSfx(S('G06') + 0.05, 6, 0.45); typeSfx(P('G06', 0.12), 16, 0.5 * D('G06')); sfx(P('G06', 0.78), 'buzz', 0.6); sfx(P('G06', 0.78), 'glitch', 0.3);
  typeSfx(S('G07'), 4, 0.3); for (let i = 0; i < 14; i++) sfx(P('G07', 0.1) + i * 0.03 * D('G07'), 'tick2', 0.22); sfx(P('G07', 0.58) + 0.45, 'ding', 0.6); typeSfx(P('G07', 0.86), 10, 0.5);
  sfx(BK.outro.t0 - 0.1, 'swoosh_soft', 0.7); sfx(BK.outro.t0 - 0.05, 'whoosh', 0.5);
  sfx(P('C08', 0.2) - 0.08, 'laser', 0.7); sfx(P('C08', 0.42) - 0.08, 'laser', 0.7); sfx(P('C08', 0.6), 'crack', 0.6); sfx(P('C08', 0.62), 'shimmer', 0.7); sfx(E('C08') - 0.75, 'shimmer', 0.5);
  sfx(S('C09') + 0.05, 'pluck', 0.4); sfx(P('C09', 0.5) + 0.5, 'ding_hi', 0.5);
  sfx(S('C10') - 0.05, 'whoosh', 0.5); sfx(P('C10', 0.04) + 0.75, 'slam', 0.6); sfx(P('C10', 0.6), 'swoosh_in', 0.5);
  sfx(E('C10') + 0.15, 'bell_soft', 0.6); sfx(E('C10') + 0.3, 'shimmer', 0.6); sfx(E('C10') + 1.0, 'sparkle', 0.5);
})();
SFX.sort((a, b) => a.t - b.t);

window.TIMELINE = { total: TOTAL, seq: ENTRIES.filter(e => e.k === 'v').map(e => ({ id: e.id, t0: e.t0, vo: e.vo, dur: e.dur, t1: e.t1 })), blocks: BLOCKS.map(b => ({ b: b.b, t0: b.t0, t1: b.t1 })), sfx: SFX };
window.renderAt = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, W, H); drawFrame(Math.min(t, TOTAL - 1e-3));
};
window.ready = (async () => {
  await Promise.all(SPR_NAMES.map(loadImg));
  await document.fonts.load(`80px "Smiley"`, '画不出来的函数映射高中速通'); await document.fonts.ready;
  window.renderAt(0); return true;
})();
if (!window.__EXPORT__) window.ready.then(() => { const t0 = performance.now(); (function loop() { window.renderAt(((performance.now() - t0) / 1000) % TOTAL); requestAnimationFrame(loop); })(); });
