// 第 2 章公用小件（10-27 起 P2–P9 共用；P0/P1 内联了同样的函数）。build.sh 复制为 web/scenes0_kit.js，在 scenes.js 之前加载。
// 版面：讲师 x<540；主内容 600–1360；字幕区 y≥964。配色：f 红、g/f′ 绿、x/δ 青、y/L/ε 金、割线/切线 紫。
const CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv, CX = 980;
Object.assign(SIDE, { X: { x: 1760, h: 600 }, B: { x: 1720, h: 620 }, H: { x: 1730, h: 640 }, Z: { x: 1730, h: 640 }, R: { x: 1730, h: 650 }, T: { x: 1730, h: 610 }, L: { x: 1740, h: 640 }, N: { x: 1720, h: 640 }, M: { x: 1700, h: 640 } });
Object.assign(SQ, { H: { n: '混元', col: '#3D8BFF' }, Z: { n: 'GLM', col: '#C9C3E6' }, R: { n: 'Mistral', col: '#FF8A3D' }, T: { n: 'MiMo', col: '#FF6FA8' }, L: { n: 'Llama', col: '#58D6A8' }, N: { n: 'MiniMax', col: '#FF4F6E' } });
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
const win = (t, a, b, d = 0.35) => eOut(prog(t, a, d)) * (1 - eIn(prog(t, b, d)));
function seg(x0, y0, x1, y1, col, a = 1, w = 3, dash) {
  if (a <= 0) return; ctx.save(); if (dash) ctx.setLineDash(dash);
  glowPath(() => { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }, col, w, a); ctx.restore();
}
function arrowH(x0, x1, y, col, a = 1, w = 3.5) {
  if (a <= 0 || Math.abs(x1 - x0) < 2) return; const s = Math.sign(x1 - x0), hd = Math.min(16, Math.abs(x1 - x0) * 0.45);
  glowPath(() => { ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x1 - s * hd, y - hd * 0.6); ctx.lineTo(x1, y); ctx.lineTo(x1 - s * hd, y + hd * 0.6); }, col, w, a);
}
function arrowV(x, y0, y1, col, a = 1, w = 3.5) {
  if (a <= 0 || Math.abs(y1 - y0) < 2) return; const s = Math.sign(y1 - y0), hd = Math.min(16, Math.abs(y1 - y0) * 0.45);
  glowPath(() => { ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.moveTo(x - hd * 0.6, y1 - s * hd); ctx.lineTo(x, y1); ctx.lineTo(x + hd * 0.6, y1 - s * hd); }, col, w, a);
}
function label(text, x, y, size, col, a = 1, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `${o.bold ? 'bold ' : ''}${size}px ${o.font || F_FANCY}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = o.glow ?? 8; ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore();
}
function richReveal(parts, x, y, size, t, t0, o = {}) {
  const w = parts.reduce((s, [str]) => s + mathW(str, size), 0), x0 = o.align === 'left' ? x : x - w / 2;
  const dur = o.dur || Math.max(0.35, w / 1300), p = eOut(prog(t, t0, dur)), out = o.out != null ? prog(t, o.out, 0.3) : 0;
  if (p <= 0 || out >= 1) return w;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 12, y - size * 1.4, (w + 24) * p, size * 2.1); ctx.clip();
  mathRich(parts, x0, y, size, { glow: o.glow ?? 14, alpha: (o.alpha ?? 1) * (1 - out), upright: o.upright }); ctx.restore();
  if (p < 1) glowDot(x0 - 12 + (w + 24) * p, y - size * 0.3, 5, parts[0][1]);
  return w;
}
function panel(x, y, w, h, col, a, fill = 'rgba(12,18,38,0.82)') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = fill; ctx.strokeStyle = hexA(col, 0.75); ctx.lineWidth = 2; rr(x, y, w, h, 14); ctx.fill(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.stroke(); ctx.restore();
}
// ---------- 坐标系：独立 x / y 比例 ----------
const gx = (G, x) => G.cx + x * G.ux, gy = (G, y) => G.cy - y * G.uy;
function gAxes(G, a, o = {}) {
  if (a <= 0) return;
  const X0 = gx(G, G.x0), X1 = gx(G, G.x1), Y0 = gy(G, G.y1), Y1 = gy(G, G.y0);
  const ox = gx(G, clamp(0, G.x0, G.x1)), oy = gy(G, clamp(0, G.y0, G.y1));
  ctx.save(); ctx.globalAlpha *= a;
  if (o.grid !== false) {
    ctx.strokeStyle = 'rgba(92,200,232,0.08)'; ctx.lineWidth = 1;
    const sx = o.gx || 1, sy = o.gy || 1;
    for (let i = Math.ceil(G.x0 / sx) * sx; i <= G.x1 + 1e-9; i += sx) { ctx.beginPath(); ctx.moveTo(gx(G, i), Y0); ctx.lineTo(gx(G, i), Y1); ctx.stroke(); }
    for (let j = Math.ceil(G.y0 / sy) * sy; j <= G.y1 + 1e-9; j += sy) { ctx.beginPath(); ctx.moveTo(X0, gy(G, j)); ctx.lineTo(X1, gy(G, j)); ctx.stroke(); }
  }
  ctx.strokeStyle = 'rgba(237,230,216,0.62)'; ctx.fillStyle = 'rgba(237,230,216,0.62)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X0, oy); ctx.lineTo(X1, oy); ctx.moveTo(ox, Y1); ctx.lineTo(ox, Y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X1 + 14, oy); ctx.lineTo(X1, oy - 7); ctx.lineTo(X1, oy + 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(ox, Y0 - 14); ctx.lineTo(ox - 7, Y0); ctx.lineTo(ox + 7, Y0); ctx.fill();
  if (o.ticks) {
    ctx.font = `italic 24px ${F_MATH}`; ctx.fillStyle = 'rgba(237,230,216,0.7)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    (o.ticks.x || []).forEach(([v, l]) => { ctx.fillRect(gx(G, v) - 1, oy - 7, 2, 14); ctx.fillText(l, gx(G, v), oy + 10); });
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    (o.ticks.y || []).forEach(([v, l]) => { ctx.fillRect(ox - 7, gy(G, v) - 1, 14, 2); ctx.fillText(l, ox - 14, gy(G, v)); });
  }
  if (o.xl) mathText(o.xl, X1 + 6, oy + 34, 26, CR, { glow: 6, alpha: 0.8 });
  if (o.yl) mathText(o.yl, ox + 12, Y0 - 2, 26, CR, { glow: 6, alpha: 0.8 });
  ctx.restore();
}
function gClip(G) { ctx.beginPath(); ctx.rect(gx(G, G.x0) - 6, gy(G, G.y1) - 6, (G.x1 - G.x0) * G.ux + 12, (G.y1 - G.y0) * G.uy + 12); ctx.clip(); }
function gPlot(G, f, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  const xa = o.xa ?? G.x0, xb = lerp(xa, o.xb ?? G.x1, p), n = o.n || 300; let pts = [], runs = [];
  for (let i = 0; i <= n; i++) {
    const x = xa + (xb - xa) * i / n, y = f(x);
    if (!isFinite(y) || y > G.y1 + 3 || y < G.y0 - 3) { if (pts.length) runs.push(pts); pts = []; if (isFinite(y)) pts.push([gx(G, x), gy(G, clamp(y, G.y0 - 3, G.y1 + 3))]); continue; }
    pts.push([gx(G, x), gy(G, y)]);
  }
  if (pts.length) runs.push(pts);
  ctx.save(); gClip(G); if (o.dash) ctx.setLineDash(o.dash);
  runs.forEach(r => { if (r.length > 1) glowPath(() => r.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, o.w || 4.5, a); }); ctx.restore();
  if (p < 1 && !o.noHead) { const y = f(xb); if (y > G.y0 && y < G.y1) glowDot(gx(G, xb), gy(G, y), 7, col, a); }
}
function gLine(G, m, x0, y0, xa, xb, col, a, w = 3.5, dash) { if (a <= 0) return; ctx.save(); gClip(G); seg(gx(G, xa), gy(G, y0 + m * (xa - x0)), gx(G, xb), gy(G, y0 + m * (xb - x0)), col, a, w, dash); ctx.restore(); }
function gH(G, y, col, a, o = {}) { if (a <= 0) return; seg(gx(G, o.xa ?? G.x0), gy(G, y), gx(G, o.xb ?? G.x1), gy(G, y), col, a, o.w || 2, o.dash); }
function gV(G, x, col, a, o = {}) { if (a <= 0) return; seg(gx(G, x), gy(G, o.ya ?? G.y0), gx(G, x), gy(G, o.yb ?? G.y1), col, a, o.w || 2, o.dash); }
function gDot(G, x, y, col, a, open) { if (a <= 0) return; if (open) openDot(gx(G, x), gy(G, y), 8, col, a); else glowDot(gx(G, x), gy(G, y), 8, col, a); }
function gBand(G, xa, xb, ya, yb, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.fillRect(gx(G, xa), gy(G, yb), (xb - xa) * G.ux, (yb - ya) * G.uy); ctx.restore(); }
// ---------- 代码窗（逐字打出） ----------
function codeWin(t, x, y, w, rows, t0, o = {}) {
  const a = o.a ?? eOut(prog(t, t0 - 0.2, 0.3)); if (a <= 0) return; const lh = o.lh || 44, h = 60 + rows.length * lh;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,26,0.92)'; ctx.strokeStyle = hexA(CYAN, 0.6); ctx.lineWidth = 2; rr(x, y, w, h, 12); ctx.fill(); ctx.stroke();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 22 + i * 20, y + 20, 6, 0, 7); ctx.fill(); });
  if (o.title) { ctx.font = `20px ${F_CODE}`; ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.title, x + w / 2, y + 20); }
  ctx.restore();
  rows.forEach((r, i) => { const [segs, tr, dur] = r; ctx.save(); ctx.globalAlpha *= a; typedSegs(t, segs, x + 24, y + 62 + i * lh, tr, dur || 0.6, o.sz || 26); ctx.restore(); });
}
function typedSegs(t, segs, x, y, t0, dur, sz) {
  const tot = segs.reduce((s, [str]) => s + str.length, 0), n = Math.floor(clamp((t - t0) / dur) * tot); let k = 0, cx = x; if (n <= 0) return;
  ctx.save(); ctx.font = `${sz}px ${F_CODE}`; ctx.textBaseline = 'middle';
  segs.forEach(([str, col]) => { const w = ctx.measureText(str).width; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.fillText(str.slice(0, Math.max(0, n - k)), cx, y); cx += w; k += str.length; });
  ctx.restore();
}
// ---------- 随堂倒计时 ----------
function quizBeats() { return ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz'); }
function quizCountdown(t, x = 1240, y = 620) { quizBeats().forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, x, y, 92); }); }
// ---------- 片尾署名（块标题在署名开始后不再画） ----------
function credits(t, t0, head, next, lines) {
  if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T(head, 215, 34, GOLD, 0.08); if (next) T(next, 310, 52, CR, 0.28);
  T('素材与授权说明', 450, 28, CYAN, 0.56, B);
  lines.forEach((s, i) => T(s, 505 + i * 43, 20, CR, 0.72 + i * 0.2, B));
}
const CREDIT_BASE = [
  'Claude / GPT 等 AI 娘形象：ZipZipPipe（Pixiv 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。',
  '作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。',
  'DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。',
];
const CREDIT_END = [
  '音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。',
];
function drawFrameStd(t, SC, TITLES, tEnd) { composeFrame(t, SC, t < tEnd ? TITLES : null); }
// ---------- 客串立绘：在 kit.js 的 sideChars 基础上加 cfg.dy(t)（竖直位移，用于 MiMo 跳一跳等），其余逻辑不变 ----------
function sideChars(t) {
  sideRuns().forEach(r => {
    const pi = eOut(prog(t, r.t0 - 0.45, 0.4)), po = eIn(prog(t, r.t1 + 0.25, 0.35)); if (pi <= 0 || po >= 1) return;
    const cfg = SIDE[r.w]; let cur = r.ids[0], prv = null; for (const e of r.ids) if (e.vo - 0.12 <= t) { prv = cur; cur = e; }
    const dx = (1 - pi) * 650 + po * 650, k = prv && prv.pose !== cur.pose ? eOut(prog(t, cur.vo - 0.12, 0.18)) : 1, by = H + (r.w === 'D' ? 30 : 20) + (cfg.dy ? cfg.dy(t) : 0);
    if (k < 1) sprite(prv.pose, cfg.x + dx, by, cfg.h, { flip: cfg.flip, alpha: 1 - k });
    sprite(cur.pose, cfg.x + dx, by, cfg.h, { flip: cfg.flip, alpha: k, rim: r.w === 'D' ? 'rgba(92,200,232,0.5)' : undefined });
  });
}
