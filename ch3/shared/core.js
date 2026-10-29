// AI娘微积分课 · 公共内核 core.js（P1 起）：时间轴、星空、立绘、字幕、文字组件、特效库、音效登记、渲染入口
// 由 P0 v2 engine.js 抽出；每段提供 seg.js（台词计划 / 立绘表）+ scenes.js（场景 drawFrame + 音效）
'use strict';
const W = 1920, H = 1080;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const F_FANCY = '"Smiley", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Serif CJK SC", sans-serif';
const F_BODY = '"Microsoft YaHei", "Noto Sans CJK SC", "Noto Serif CJK SC", sans-serif';
const F_CODE = 'Consolas, "Cascadia Mono", "DejaVu Sans Mono", "Microsoft YaHei", monospace';
const F_MATH = '"Cambria Math", Cambria, "Times New Roman", "DejaVu Serif", "Microsoft YaHei", "Noto Sans CJK SC", serif';
// 颜色规范（制作规范.md）
const COL = { x: '#5CC8E8', y: '#FFD25A', f: '#E8553A', g: '#7BD389', inv: '#B79CFF', text: '#EDE6D8', red: '#E8553A', cream: '#EDE6D8', ink: '#16130F', bg0: '#0A0F1F', bg1: '#131B34' };
const GOLD = COL.y, CYAN = COL.x;

// ================= 素材 =================
const SPR = {};
const SEG = window.SEG;   // 每段的 seg.js：title / tag / sprites / sprc / plan
const SPR_NAMES = SEG.sprites;
const SPRC = SEG.sprc || {};
const loadImg = n => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'sprites/' + n + '.webp'; SPR[n] = im; });

// ================= 台词 =================
const LN = {}; (window.LINES || []).forEach(l => LN[l.id] = l);
const SQ = { C: { n: 'Claude小姐', col: '#E8553A' }, G: { n: 'GPT', col: '#B79CFF' }, D: { n: '大肥鱼', col: '#5CC8E8' }, Q: { n: '千问', col: '#F5A3C7' }, M: { n: 'Gemini', col: '#7FB2FF' }, K: { n: 'Kimi', col: '#9AA4B8' }, X: { n: 'Grok', col: '#D0D0D0' }, B: { n: '豆包', col: '#FFB36B' } };
const DUR = Object.assign({}, window.DUR || {});

// ================= 时间轴 =================
const V = id => ({ k: 'v', b: LN[id].b, id, pose: LN[id].pose });
const BEAT = (b, d) => ({ k: 'beat', b, d });
const PLAN = SEG.plan(V, BEAT);
const GAP_SAME = SEG.gapSame ?? 0.2, GAP_SWITCH = SEG.gapSwitch ?? 0.25, GAP_BLOCK = SEG.gapBlock ?? 0.18;
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
  ctx.globalAlpha *= o.alpha ?? 1;
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
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.translate(x, by);
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

function h32(a, b, s) {   // 整数哈希 → [0,1)
  let x = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul((b | 0) + s * 7919, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
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
  if (solid > 0) { ctx.save(); ctx.globalAlpha *= solid * (1 - out); ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = 26; ctx.fillStyle = o.fill || col; ctx.fillText(text, x, y); ctx.restore(); }
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
      ctx.globalAlpha *= (g ? 0.2 / g : 1) * clamp(p * 3) * (1 - out);
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
  ctx.globalAlpha *= (o.alpha ?? 1) * (1 - out);
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

// ================= 公共收尾 =================
function chapterTag(t, tag, title) {
  ctx.save(); ctx.font = `26px ${F_FANCY}`; ctx.textBaseline = 'middle';
  ctx.font = `26px ${F_FANCY}`; const w = ctx.measureText(tag).width + 22;
  ctx.fillStyle = COL.red; ctx.fillRect(36, 30, w, 40); ctx.fillStyle = COL.cream; ctx.fillText(tag, 47, 51);
  ctx.fillStyle = 'rgba(237,230,216,0.7)'; ctx.fillText(title, 50 + w, 51); ctx.restore();
}
function computePulse(t) {
  if (!computePulse.H) computePulse.H = SFX.filter(e => ['slam', 'stamp', 'thud', 'impact', 'ding_hi', 'ding_lo', 'zap', 'warp', 'laser', 'soft_hit', 'marimba', 'marimba_hi', 'marimba_lo', 'bell_soft', 'check', 'swell', 'count_go'].includes(e.name)).map(e => [e.t, e.gain]);
  let p = 0; for (const [ht, g] of computePulse.H) { if (t >= ht && t < ht + 1.2) p += g * Math.exp(-(t - ht) * 5); }
  PULSE = Math.min(1.2, p);
}
// ================= 段间接力（10-28）=================
// 每段开头 = “接棒卡”，结尾 = “接力卡”，两张卡共用同一条章节路线图；上一段最后一帧 = 下一段第一帧。
// 合集无损拼接时画面自然相接；单独看某一段，开头就能看出自己在第几段。
// 实现方式是在 finalize 里做时间重映射：u = t − LEAD 是原时间轴；TE 之后冻结原画面并叠加接力卡。
// 原片尾（字幕卡 / 署名卡）因此不再出现；人声和音效统一平移 LEAD。各段的 scenes.js 不需要改。
// 章末段：TE 取原署名开始前（保留全员合影），完整署名改由接力卡显示（自动捕获该段 credits() 的参数）。
// 章节信息：路线图节点名（segs）、大标题全名（full，可省）、下一章、页脚署名（每段都有）、章末完整署名（credits，可省：省略时取章末段 credits() 的参数）
const CHAPTER = {
 "n": 3,
 "title": "求导法则",
 "segs": [
  "齿轮链",
  "高中速通",
  "为什么是 e",
  "三角导数",
  "链式法则",
  "隐函数",
  "对数求导",
  "指数增减",
  "相关变化率",
  "线性化",
  "收束"
 ],
 "full": [
  "齿轮链",
  "高中速通：求导公式",
  "为什么是 e",
  "三角函数的导数",
  "链式法则",
  "隐函数求导",
  "对数求导法",
  "指数增长与衰减",
  "相关变化率",
  "线性化与微分",
  "收束与出口票"
 ],
 "next": {
  "tag": "第 4 章",
  "name": "导数的应用"
 },
 "footer": [
  "立绘：ZipZipPipe（ai-girls）；MiMo 娘：甶丶（CC BY-NC）；DeepSeek 娘：上善无形 + ZipZipPipe（CC BY-NC-SA 4.0）；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）",
  "BGM：“Easy Lemon” Kevin MacLeod (incompetech.com) CC BY 4.0；名称与商标归各自权利人；非官方、非商业学习作品，完整署名见章末"
 ]
};
window.RELAY_ON = true;
const RELAY = (() => {
  const cur = parseInt(String(SEG.tag).replace(/\D/g, '')) || 0, last = cur === CHAPTER.segs.length - 1;
  const lastV = ENTRIES.filter(e => e.k === 'v').pop();
  const lead = cur === 0 ? 2.0 : 1.5, te = lastV.vo + lastV.dur + 0.15, out = last ? 7.0 : 3.6;
  return { cur, last, lead, te, out, total: lead + te + out, cred: CHAPTER.credits || null };
})();
function relayInit() {   // 章末段：捕获原片尾 credits() 的起点与署名行
  if (!RELAY.last || typeof credits !== 'function') return;
  const orig = credits; let cap = null;
  credits = (t, t0, head, next, lines) => { cap = { t0, lines }; };
  ctx.save(); try { drawFrame(TOTAL - 1e-3); } catch (e) { } ctx.restore(); credits = orig;
  if (cap) { RELAY.te = Math.max(RELAY.te, cap.t0 - 0.05); RELAY.cred = cap.lines; }
  RELAY.total = RELAY.lead + RELAY.te + RELAY.out;
}
const REL_SP = Math.min(175, 1700 / (CHAPTER.segs.length + 1));
const REL_X = i => 960 + (i - (CHAPTER.segs.length - 1) / 2) * REL_SP, REL_Y = 520;
function relayCheck(x, y, s, a) { glowPath(() => { ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.1, y + s * 0.35); ctx.lineTo(x + s * 0.5, y - s * 0.35); }, COL.ink, 4, a); }
function relayFit(s, sz, maxW, bold, font) { ctx.font = `${bold ? 'bold ' : ''}${sz}px ${font}`; const w = ctx.measureText(s).width; if (w > maxW) ctx.font = `${bold ? 'bold ' : ''}${Math.floor(sz * maxW / w)}px ${font}`; }
// done = 已完成段数（下标 < done 的点为金色）；lit = 高亮点；comet = [from, to, p]；nx = 下一章节点透明度（只在章末接力卡淡入）
function relayRail(t, done, lit, comet, k, pulse = 0, nx = 0) {
  const n = CHAPTER.segs.length, nodes = nx > 0 ? n + 1 : n, rr = Math.min(16, REL_SP * 0.18);
  ctx.save(); ctx.globalAlpha *= k;
  for (let i = 0; i < nodes - 1; i++) {
    const x0 = REL_X(i) + rr + 4, x1 = REL_X(i + 1) - rr - 4, gold = i + 1 < done || (i + 1 === done && i + 1 <= lit);
    ctx.save(); if (i + 1 === n) ctx.globalAlpha *= nx;
    glowPath(() => { ctx.moveTo(x0, REL_Y); ctx.lineTo(x1, REL_Y); }, gold ? GOLD : 'rgba(237,230,216,0.22)', gold ? 3 : 2, gold ? 0.9 : 1); ctx.restore();
  }
  if (comet) {
    const [f, to, p] = comet, x0 = REL_X(f) + rr + 4, x = lerp(x0, REL_X(to) - rr - 4, eIO(p));
    if (p > 0) { glowPath(() => { ctx.moveTo(x0, REL_Y); ctx.lineTo(x, REL_Y); }, CYAN, 3.5, 1); if (p < 1) glowDot(x, REL_Y, 9, '#ffffff', 1); }
  }
  for (let i = 0; i < nodes; i++) {
    const x = REL_X(i), isNext = i === n, on = i === lit, ok = i < done, r = on ? rr + 6 + 8 * pulse : rr;
    ctx.save(); if (isNext) ctx.globalAlpha *= nx;
    if (ok) { ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, REL_Y, rr, 0, 7); ctx.fill(); ctx.shadowBlur = 0; relayCheck(x, REL_Y, rr * 1.1, 1); }
    else { ctx.strokeStyle = on ? CYAN : 'rgba(237,230,216,0.35)'; ctx.lineWidth = on ? 4 : 2.5; ctx.shadowColor = CYAN; ctx.shadowBlur = on ? 22 : 0;
      if (isNext) ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(x, REL_Y, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      if (on) { ctx.fillStyle = hexA(CYAN, 0.25); ctx.fill(); } }
    ctx.restore();
    ctx.save(); if (isNext) ctx.globalAlpha *= nx; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    relayFit(isNext ? CHAPTER.next.tag : `P${i}`, 26, REL_SP - 6, on, F_FANCY); ctx.fillStyle = on ? CYAN : ok ? GOLD : 'rgba(237,230,216,0.45)';
    ctx.fillText(isNext ? CHAPTER.next.tag : `P${i}`, x, REL_Y - 52);
    const nm = isNext ? CHAPTER.next.name : CHAPTER.segs[i];
    relayFit(nm, 22, REL_SP - 10, on, F_BODY); ctx.fillStyle = on ? COL.cream : ok ? 'rgba(237,230,216,0.8)' : 'rgba(237,230,216,0.4)';
    ctx.fillText(nm, x, REL_Y + 54);
    ctx.restore();
  }
  ctx.restore();
}
function relayCard(t, o) {
  const { bg, done, lit, comet, label, labelA = 1, title, ta, pulse = 0, rise = 0, credits: cr = 0, nx = 0 } = o;
  ctx.save(); ctx.globalAlpha = bg; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  if (bg <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= bg; ctx.translate(0, -rise);
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 10;
  ctx.fillText(`AI娘微积分课 · 第 ${CHAPTER.n} 章 · ${CHAPTER.title}`, 960, 300); ctx.restore();
  relayRail(t, done, lit, comet, 1, pulse, nx);
  if (label && labelA > 0) { ctx.save(); ctx.globalAlpha *= labelA; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `30px ${F_BODY}`; ctx.fillStyle = CYAN; ctx.fillText(label, 960, 690); ctx.restore(); }
  if (title) glowText(title, 960, 775, 64, COL.cream, t, ta, { align: 'center' });
  const CL = RELAY.cred || [];
  if (cr > 0 && CL.length) { ctx.save(); ctx.globalAlpha *= cr; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(237,230,216,0.78)';
    CL.forEach((s, i) => { relayFit(s, 19, 1800, false, F_BODY); ctx.fillText(s, 960, 852 + i * 27); }); ctx.restore(); }
  const FL = [].concat(CHAPTER.footer);
  ctx.save(); ctx.globalAlpha *= 1 - cr; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(237,230,216,0.55)';
  FL.forEach((s, i) => { relayFit(s, 20, 1820, false, F_BODY); ctx.fillText(s, 960, 1006 - (FL.length - 1 - i) * 32); }); ctx.restore();
  ctx.restore();
}
const relayTitle = i => i >= CHAPTER.segs.length ? `${CHAPTER.next.tag}　${CHAPTER.next.name}` : `P${i}　${(CHAPTER.full || CHAPTER.segs)[i]}`;
function relayOverlay(t) {
  const R = RELAY, c = R.cur;
  if (t < R.lead + 0.3) {   // 接棒卡：第一帧与上一段最后一帧一致，然后淡出露出本段
    const bg = 1 - eIO(prog(t, R.lead - 0.6, 0.9));
    relayCard(t, { bg, done: c, lit: c, comet: c ? [c - 1, c, 1] : null, label: c ? '下一段' : '', labelA: 1 - prog(t, 0.25, 0.4), title: relayTitle(c), ta: c ? -9 : 0.15,
      pulse: Math.sin(Math.PI * prog(t, 0.35, 0.6)), rise: 40 * eIn(prog(t, R.lead - 0.6, 0.9)) });
    if (c === 0) glowText('开始', 960, 690, 30, CYAN, t, 0.5, { out: R.lead - 0.7, bold: false, font: F_BODY, align: 'center' });
    return;
  }
  const v = t - R.lead - R.te; if (v < 0) return;   // 接力卡
  const to = c + 1, bg = eOut(prog(v, 0, 0.5));
  if (v < 0.4) warp(t, 0.25 * prog(v, 0, 0.4), W / 2, H / 2, 1.2); else if (v < 1.8) warp(t, 0.25 * (1 - prog(v, 1.2, 0.6)), W / 2, H / 2, 1.2);
  relayCard(t, { bg, done: c + (v >= 0.55 ? 1 : 0), lit: v >= 1.6 ? to : -1, comet: [c, to, prog(v, 0.8, 0.8)],
    label: R.last ? '下一章' : '下一段', labelA: prog(v, 1.6, 0.3), title: relayTitle(to), ta: t - v + 1.7,
    pulse: v >= 1.6 ? Math.sin(Math.PI * prog(v, 1.6, 0.6)) : 0, credits: R.last ? prog(v, 2.6, 0.6) : 0, nx: R.last ? eOut(prog(v, 0.2, 0.5)) : 0 });
  if (v >= 0.55 && v < 0.9) flash(t, t - v + 0.55, 0.15, 0.3);
}
function relaySfx() {
  const R = RELAY, a = R.lead + R.te, keep = SFX.filter(e => e.t <= R.te + 0.05).map(e => ({ t: e.t + R.lead, name: e.name, gain: e.gain }));
  const add = (t, name, gain) => keep.push({ t, name, gain });
  add(0.35, 'pluck', 0.22); add(R.lead - 0.6, 'swoosh_in', 0.28);
  add(a + 0.05, 'swoosh_soft', 0.26); add(a + 0.55, 'check', 0.32); add(a + 0.8, 'whoosh', 0.22); add(a + 1.6, 'marimba_hi', 0.36); add(a + 1.62, 'sparkle', 0.22);
  if (R.last) add(a + 2.6, 'swell', 0.26);
  return keep.sort((x, y) => x.t - y.t);
}
function relayExport() {
  const L = RELAY.lead;
  window.TIMELINE = { total: RELAY.total, seq: ENTRIES.filter(e => e.k === 'v').map(e => ({ id: e.id, t0: e.t0 + L, vo: e.vo + L, dur: e.dur, t1: e.t1 + L })), blocks: BLOCKS.map(b => ({ b: b.b, t0: b.t0 + L, t1: b.t1 + L })), sfx: relaySfx(), relay: { lead: L, te: RELAY.te, out: RELAY.out } };
}
function finalize() {   // scenes.js 最后调用：导出时间轴、渲染入口（含段间接力的时间重映射）
  SFX.sort((a, b) => a.t - b.t);
  relayExport();
  window.renderAt = function (t) {
    const R = RELAY;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
    const u = Math.min(Math.max(t - R.lead, 0), R.te);
    ctx.clearRect(0, 0, W, H); computePulse(u); drawFrame(u);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
    relayOverlay(t);
  };
  window.ready = (async () => {
    await Promise.all(SPR_NAMES.map(loadImg));
    await document.fonts.load(`80px "Smiley"`, (SEG.fontWarm || '高中速通映射') + CHAPTER.segs.join('') + CHAPTER.next.name + '开始下一段章'); await document.fonts.ready;
    relayInit(); relayExport();
    window.renderAt(0); return true;
  })();
  if (!window.__EXPORT__) window.ready.then(() => { const t0 = performance.now(); (function loop() { window.renderAt(((performance.now() - t0) / 1000) % RELAY.total); requestAnimationFrame(loop); })(); });
}
