// P5《反三角函数》（2026-10-27）：所有数学画面为原创 Canvas 绘制；沿用共享时间轴与组件，画风对齐 P1–P4。
// 版面约定：讲师占 x<540；主内容区 x 600–1460（客串角色在右侧时不越界）；公式 44–64px；字幕区 y≥964 不放内容。
// 配色（制作规范“颜色语义”）：x / 定义域 = 青，y / 值域 = 金，原函数 sin/cos/tan/cot = 红，反函数 = 紫，正确 = 绿，辅助线 = 米白虚线。
const SC = {};
const TITLES = [
  ['hook','倒不回去，就先剪'], ['arcsin','剪下 · 翻折：反正弦'], ['circle','单位圆上找角'], ['others','另外三个'],
  ['saw','复合的两个方向'], ['tri','画三角形'], ['quiz','随堂两题']
];
SIDE.X = { x: 1780, h: 560 };   // Grok 客串位（kit.js 的 SIDE 没有 X，这里补上，不改共享内核）
const TAU = Math.PI * 2, PI = Math.PI, HP = Math.PI / 2, CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv;
const QUIZ_BEATS = ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz');
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
const cot = x => Math.cos(x) / Math.sin(x), acot = x => HP - Math.atan(x);
const saw = x => Math.asin(Math.sin(x));
// ---------- 坐标系（与 P3 相同的独立 x/y 比例实现） ----------
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
  ctx.restore();
}
function gClip(G) { ctx.beginPath(); ctx.rect(gx(G, G.x0) - 6, gy(G, G.y1) - 6, (G.x1 - G.x0) * G.ux + 12, (G.y1 - G.y0) * G.uy + 12); ctx.clip(); }
function gSegs(G, f, xa, xb, n, jump) {
  const segs = []; let cur = null, py = null;
  for (let i = 0; i <= n; i++) {
    const x = xa + (xb - xa) * i / n, y = f(x);
    const ok = isFinite(y) && y > G.y0 - 3 && y < G.y1 + 3 && (py == null || Math.abs(y - py) < jump);
    if (ok) { if (!cur) { cur = []; segs.push(cur); } cur.push([gx(G, x), gy(G, clamp(y, G.y0 - 2, G.y1 + 2))]); } else cur = null;
    py = isFinite(y) ? y : null;
  }
  return segs;
}
function gPlot(G, f, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  let xa = o.xa ?? G.x0, xb = o.xb ?? G.x1;
  if (o.rev) xa = lerp(xb, xa, p); else xb = lerp(xa, xb, p);
  const segs = gSegs(G, f, xa, xb, Math.max(8, Math.round((o.n || 400) * Math.max(p, 0.05))), o.jump || (G.y1 - G.y0) * 0.6);
  ctx.save(); gClip(G);
  const path = s => () => s.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  if (o.dash) { ctx.setLineDash(o.dash); segs.forEach(s => { if (s.length > 1) glowPath(path(s), col, o.w || 2.4, 0.7 * a); }); }
  else segs.forEach(s => { if (s.length > 1) glowPath(path(s), col, o.w || 4.5, a); });
  ctx.restore();
  if (p < 1 && !o.noHead) { const x = o.rev ? xa : xb, y = f(x); if (isFinite(y) && y > G.y0 && y < G.y1) glowDot(gx(G, x), gy(G, y), 7, col, a); }
}
function gH(G, y, col, a = 1, o = {}) {
  if (a <= 0) return; const Y = gy(G, y);
  ctx.save(); ctx.setLineDash(o.dash || [12, 10]);
  glowPath(() => { ctx.moveTo(gx(G, o.xa ?? G.x0), Y); ctx.lineTo(gx(G, o.xb ?? G.x1), Y); }, col, o.w || 2.6, a); ctx.restore();
}
function gFill(G, xa, xb, lo, hi, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.fillStyle = hexA(col, 0.12 * a);
  ctx.fillRect(gx(G, xa), gy(G, hi), (xb - xa) * G.ux, (hi - lo) * G.uy); ctx.restore();
}
// y = x 虚线
function gDiag(G, a = 1, col = CR) {
  if (a <= 0) return; const lo = Math.max(G.x0, G.y0), hi = Math.min(G.x1, G.y1);
  ctx.save(); gClip(G); ctx.setLineDash([10, 9]); glowPath(() => { ctx.moveTo(gx(G, lo), gy(G, lo)); ctx.lineTo(gx(G, hi), gy(G, hi)); }, col, 2.2, 0.55 * a); ctx.restore();
}
// 沿 y = x 的"立体翻折"：th 从 0 到 π，垂直于 y = x 的分量按 cos th 收缩再翻到另一侧
function foldXY(x, y, th) { const m = (x + y) / 2, d = (x - y) / 2 * Math.cos(th); return [m + d, m - d]; }
function foldCurve(G, f, xa, xb, th, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const pts = []; for (let i = 0; i <= 200; i++) { const x = xa + (xb - xa) * i / 200, [X, Y] = foldXY(x, f(x), th); pts.push([gx(G, X), gy(G, Y)]); }
  ctx.save(); gClip(G); if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, (o.w || 4.5) * (0.75 + 0.25 * Math.abs(Math.cos(th))), a);
  ctx.restore();
}
function seg(x0, y0, x1, y1, col, a = 1, w = 3, dash) {
  if (a <= 0) return; ctx.save(); if (dash) ctx.setLineDash(dash);
  glowPath(() => { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }, col, w, a); ctx.restore();
}
function arrowH(x0, x1, y, col, a = 1, w = 3.5) {
  if (a <= 0 || Math.abs(x1 - x0) < 2) return; const s = Math.sign(x1 - x0), hd = Math.min(16, Math.abs(x1 - x0) * 0.45);
  glowPath(() => { ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x1 - s * hd, y - hd * 0.6); ctx.lineTo(x1, y); ctx.lineTo(x1 - s * hd, y + hd * 0.6); }, col, w, a);
}
function ring(x, y, r, col, a = 1, p = 1) {
  if (a <= 0 || p <= 0) return; glowPath(() => ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * p), col, 3, a);
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
function rowX(strs, size, cx) { const ws = strs.map(s => mathW(s, size)), tot = ws.reduce((a, b) => a + b, 0); let x = cx - tot / 2; return ws.map(w => { const v = x; x += w; return v; }); }
function tok(str, x, y, size, col, a = 1, sy = 1, sc = 1) {
  if (a <= 0 || sy <= 0.02) return; const w = mathW(str, size), mx = x + w / 2, my = y - size * 0.32;
  ctx.save(); ctx.translate(mx, my); ctx.scale(sc, sy * sc); ctx.translate(-mx, -my);
  mathText(str, x, y, size, col, { glow: 14, alpha: a }); ctx.restore();
}
function flipRow(A, B, cx, y, size, t, times, a = 1) {
  const xa = rowX(A.map(p => p[0]), size, cx), xb = rowX(B.map(p => p[0]), size, cx);
  const ts = times.filter(v => v != null), t0 = Math.min(...ts), t1 = Math.max(...ts) + 0.45, eR = eIO(prog(t, t0, t1 - t0));
  A.forEach((pa, i) => {
    const x = lerp(xa[i], xb[i], eR);
    if (times[i] == null) { tok(pa[0], x, y, size, pa[1], a); return; }
    const e = eIO(prog(t, times[i], 0.45)), sy = Math.abs(Math.cos(Math.PI * e)), pb = B[i];
    tok(e < 0.5 ? pa[0] : pb[0], x, y, size, e < 0.5 ? pa[1] : pb[1], a, sy, 1 + 0.25 * Math.sin(Math.PI * e));
  });
  return { xa, xb };
}
function partSpan(parts, i, cx, size) { const xs = rowX(parts.map(p => p[0]), size, cx); return [xs[i], xs[i] + mathW(parts[i][0], size)]; }
// 中文 + 公式同一行（中文用标题字体，公式用数学字体）
function zhMath(zh, m, cx, y, size, cz, cm, t, t0, o = {}) {
  ctx.save(); ctx.font = `bold ${size}px ${F_FANCY}`; const wz = ctx.measureText(zh).width; ctx.restore();
  const ms = size * 1.12, wm = mathW(m, ms), gap = 16, x0 = cx - (wz + gap + wm) / 2;
  glowText(zh, x0, y, size, cz, t, t0, { align: 'left', out: o.out });
  glowMath(m, x0 + wz + gap, y + ms * 0.34, ms, cm, t, t0 + 0.12, { out: o.out });
}
// 术语首次出现：中英对照一行
function term(en, zh, x, y, t, t0, o = {}) {
  glowText(`${zh} · ${en}`, x, y, o.size || 32, o.col || CYAN, t, t0, { bold: false, out: o.out });
}

// ======================= hook =======================
// D01 sin x = 1/2 → π/6？ → C01 水平线交出无数个点（不是单射）→ C02 只留 [−π/2, π/2]：剪刀线 + “剪 → 翻折”
const GH = { cx: 1195, cy: 610, ux: 58, uy: 150, x0: -10.2, x1: 10.4, y0: -1.45, y1: 1.6 };
const SOLS = [[PI / 6, 'π/6'], [5 * PI / 6, '5π/6'], [13 * PI / 6, '13π/6'], [PI / 6 - TAU, ''], [5 * PI / 6 - TAU, ''], [17 * PI / 6, ''], [5 * PI / 6 - 2 * TAU, '']];
SC.hook = t => {
  starfield(t); blueprint(ap(t, 'D01', 0, 0.7), 72);
  const cut = ap(t, 'C02', 0.12, 0.5);
  gAxes(GH, ap(t, 'D01', 0.05, 0.4), { gx: PI / 2, gy: 0.5, ticks: { x: [[-PI, '−π'], [PI, 'π'], [-2 * PI, '−2π'], [2 * PI, '2π'], [-3 * PI, '−3π'], [3 * PI, '3π']], y: [[1, '1'], [-1, '−1']] } });
  // 整条正弦（C02 后，区间外的部分变暗）
  const pS = prog(t, P('D01', 0.12), 0.9);
  gPlot(GH, Math.sin, RED, { p: pS, a: 1 - 0.75 * cut });
  if (cut > 0) gPlot(GH, Math.sin, RED, { xa: -HP, xb: HP, w: 6, a: cut });
  mathText('y = sin x', gx(GH, 8.2), gy(GH, 1.35), 38, RED, { glow: 10, alpha: ap(t, 'D01', 0.3) * (1 - cut) });
  glowMath('sin x = 1/2 ,   x = ?', 1195, 285, 56, CR, t, P('D01', 0.3), { align: 'center', out: P('C01', 0.55) });
  // 水平线 y = 1/2
  const lh = ap(t, 'D01', 0.55, 0.5);
  if (lh > 0) { gH(GH, 0.5, GOLD, lh * (1 - 0.6 * cut), { xb: lerp(GH.x0, GH.x1, lh) }); mathText('y = 1/2', gx(GH, GH.x1) - 4, gy(GH, 0.5) - 14, 30, GOLD, { align: 'right', glow: 8, alpha: lh * (1 - cut) }); }
  // D01 末：π/6 吧！
  if (t > P('D01', 0.8) && t < S('C01') + 0.2) kinetic('π/6 ？', gx(GH, PI / 6) + 20, gy(GH, 0.5) - 70, 44, t, P('D01', 0.8), { col: GOLD, font: F_MATH, bold: false });
  // C01：交点一个个亮起
  SOLS.forEach(([x, lab], i) => {
    const t0 = P('C01', 0.05 + i * 0.075), a = eOut(prog(t, t0, 0.25)) * (1 - 0.7 * cut); if (a <= 0) return;
    glowDot(gx(GH, x), gy(GH, 0.5), 9, GOLD, a);
    if (prog(t, t0, 0.3) < 1) { ctx.save(); ctx.globalAlpha *= 1 - prog(t, t0, 0.3); ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx(GH, x), gy(GH, 0.5), 9 + 40 * prog(t, t0, 0.3), 0, 7); ctx.stroke(); ctx.restore(); }
    if (lab) { seg(gx(GH, x), gy(GH, 0.5), gx(GH, x), gy(GH, 0), CYAN, 0.55 * a, 2, [5, 6]); mathText(lab, gx(GH, x), gy(GH, 0) + 72, 30, CYAN, { align: 'center', glow: 8, alpha: a }); }
  });
  glowText('一个 y，无数个 x', 1195, 290, 50, GOLD, t, P('C01', 0.62), { out: S('C02') + 0.05 });
  glowText('正弦不是单射 → 倒不回去', 1195, 880, 38, RED, t, P('C01', 0.7), { out: S('C02') + 0.05 });
  // C02：剪刀线
  if (cut > 0) {
    [-HP, HP].forEach(x => { const q = eOut(prog(t, P('C02', 0.12), 0.45)); seg(gx(GH, x), gy(GH, 1.55), gx(GH, x), lerp(gy(GH, 1.55), gy(GH, -1.4), q), CR, 0.9, 2.5, [10, 8]); });
    mathText('−π/2', gx(GH, -HP), gy(GH, -1.4) + 34, 28, CYAN, { align: 'center', glow: 8, alpha: cut });
    mathText('π/2', gx(GH, HP), gy(GH, -1.4) + 34, 28, CYAN, { align: 'center', glow: 8, alpha: cut });
    sparks(t, P('C02', 0.12) + 0.45, gx(GH, -HP), gy(GH, -1.4), { col: [CR, '#ffffff'], n: 10, speed: 200 });
    sparks(t, P('C02', 0.12) + 0.45, gx(GH, HP), gy(GH, -1.4), { col: [CR, '#ffffff'], n: 10, speed: 200 });
    kinetic('剪', gx(GH, -HP) - 60, gy(GH, 1.3), 46, t, P('C02', 0.15), { col: CR });
    const row = [['① 剪下一段一一对应', RED], ['② 沿 y = x 翻折', INV], ['③ 反三角函数', GOLD]];
    row.forEach(([s, col], k) => glowText(s, 760 + k * 400, 300, 40, col, t, P('C02', 0.35 + k * 0.17)));
    if (t > P('C02', 0.35) + 0.4) arrowH(965, 1020, 300, CR, ap(t, 'C02', 0.45), 3);
    if (t > P('C02', 0.52) + 0.4) arrowH(1355, 1410, 300, CR, ap(t, 'C02', 0.62), 3);
  }
};

// ======================= arcsin（A26：剪下、翻折） =======================
// C03 只留 [−π/2, π/2]：严格递增、取遍 [−1, 1] → C04 沿 y = x 翻折成 arcsin → C05 定义域 / 值域 / 主值 → G01 sin⁻¹x ≠ 1/sin x
const GA = { cx: 1030, cy: 600, ux: 125, uy: 125, x0: -2.1, x1: 2.1, y0: -2.05, y1: 2.05 };
const TK_A = { x: [[-HP, '−π/2'], [HP, 'π/2'], [-1, '−1'], [1, '1']], y: [[-HP, '−π/2'], [HP, 'π/2'], [-1, '−1'], [1, '1']] };
function bracketX(G, a, b, col, al, o = {}) {   // x 轴上的区间条
  if (al <= 0) return; const y = gy(G, 0);
  ctx.save(); ctx.globalAlpha *= al; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = hexA(col, 0.85); ctx.fillRect(gx(G, a), y - 5, (b - a) * G.ux, 10); ctx.restore();
  (o.open ? openDot : glowDot)(gx(G, a), y, 8, col, al); (o.open ? openDot : glowDot)(gx(G, b), y, 8, col, al);
}
function bracketY(G, a, b, col, al, o = {}) {   // y 轴上的区间条
  if (al <= 0) return; const x = gx(G, 0);
  ctx.save(); ctx.globalAlpha *= al; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = hexA(col, 0.85); ctx.fillRect(x - 5, gy(G, b), 10, (b - a) * G.uy); ctx.restore();
  (o.open ? openDot : glowDot)(x, gy(G, a), 8, col, al); (o.open ? openDot : glowDot)(x, gy(G, b), 8, col, al);
}
SC.arcsin = t => {
  starfield(t); blueprint(ap(t, 'C03', 0, 0.5), 72);
  const dim = 1 - 0.93 * ap(t, 'G01', 0.02, 0.4);
  ctx.save(); ctx.globalAlpha *= dim;
  gAxes(GA, ap(t, 'C03', 0, 0.4), { gx: 0.5, gy: 0.5, ticks: TK_A });
  // C03：整条 sin 淡显，[−π/2, π/2] 那段加亮
  const rest = ap(t, 'C03', 0.05, 0.4) * (1 - eOut(prog(t, P('C04', 0.05), 0.35)));
  gPlot(GA, Math.sin, RED, { a: 0.3 * rest, w: 3 });
  const th = PI * eIO(prog(t, P('C04', 0.3), 1.3));
  const seg03 = prog(t, P('C03', 0.12), 0.8);
  if (th <= 0) gPlot(GA, Math.sin, RED, { xa: -HP, xb: HP, p: seg03, w: 6 });
  else {
    gPlot(GA, Math.sin, RED, { xa: -HP, xb: HP, w: 3, a: 0.35, dash: [8, 8] });
    foldCurve(GA, Math.sin, -HP, HP, th, th > PI / 2 ? INV : RED, { w: 6 });
  }
  if (seg03 >= 1 && th <= 0) { glowDot(gx(GA, -HP), gy(GA, -1), 8, RED); glowDot(gx(GA, HP), gy(GA, 1), 8, RED); }
  bracketY(GA, -1, 1, GOLD, ap(t, 'C03', 0.55, 0.4) * (1 - ap(t, 'C04', 0.05, 0.3)));
  gDiag(GA, ap(t, 'C04', 0.2, 0.4));
  mathText('y = x', gx(GA, 1.45) + 14, gy(GA, 1.3), 30, CR, { glow: 6, alpha: ap(t, 'C04', 0.25) * 0.8 });
  // 剪：两刀
  if (t > P('C04', 0.03) && t < P('C04', 0.3)) [-HP, HP].forEach(x => seg(gx(GA, x), gy(GA, 2), gx(GA, x), gy(GA, -2), CR, 1 - prog(t, P('C04', 0.03), 0.6), 2.5, [10, 8]));
  if (th >= PI) {
    mathText('arcsin x', gx(GA, 1) + 16, gy(GA, HP) + 6, 40, INV, { glow: 12 });
    burst(t, P('C04', 0.3) + 1.3, gx(GA, 0), gy(GA, 0), INV, 160, 20);
  }
  // C05：定义域、值域贴到坐标轴上
  bracketX(GA, -1, 1, CYAN, ap(t, 'C05', 0.05, 0.4));
  bracketY(GA, -HP, HP, GOLD, ap(t, 'C05', 0.3, 0.4));
  ctx.restore();
  // 右栏文字
  const R0 = 1335;
  glowMath('y = sin x', R0, 410, 44, RED, t, P('C03', 0.08), { out: S('C04') + 0.05 });
  glowMath('x ∈ [−π/2, π/2]', R0, 470, 40, CYAN, t, P('C03', 0.2), { out: S('C04') + 0.05 });
  glowText('严格递增 ↗', R0, 545, 38, GRN, t, P('C03', 0.35), { align: 'left', out: S('C04') + 0.05 });
  glowText('取遍 [−1, 1]：一一对应 ✓', R0, 605, 34, GOLD, t, P('C03', 0.6), { align: 'left', out: S('C04') + 0.05, bold: false });
  if (t > S('G01') - 0.1) return drawG01(t);
  term('arcsine', '反正弦', R0 + 150, 395, t, P('C04', 0.75), { col: INV, size: 34 });
  richReveal([['y = arcsin x', INV]], R0, 460, 44, t, P('C04', 0.8), { align: 'left' });
  richReveal([['   = sin^{−1}x', INV]], R0, 520, 44, t, P('C04', 0.9), { align: 'left' });
  glowText('定义域 [−1, 1]', R0, 610, 36, CYAN, t, P('C05', 0.05), { align: 'left' });
  glowText('值域 [−π/2, π/2]', R0, 670, 36, GOLD, t, P('C05', 0.3), { align: 'left' });
  term('principal value', '主值', R0 + 160, 760, t, P('C05', 0.62), { col: GOLD, size: 32 });
  if (t > P('C05', 0.6)) glowText('输出只落在这个区间里', R0 + 160, 812, 28, CR, t, P('C05', 0.66), { bold: false });
};
function drawG01(t) {
  glowText('上一段：', 900, 330, 32, CR, t, P('G01', 0.03), { bold: false, align: 'right' }); glowMath('f^{−1} ≠ 1/f', 910, 342, 36, CR, t, P('G01', 0.08));
  richReveal([['sin^{−1}x', INV], ['   ≠   ', CR], ['1 / sin x', RED]], 1000, 500, 74, t, P('G01', 0.12), { dur: 0.6 });
  glowText('反函数', 790, 580, 34, INV, t, P('G01', 0.3));
  glowText('倒数', 1205, 580, 34, RED, t, P('G01', 0.3));
  const k = ap(t, 'G01', 0.55, 0.4);
  if (k > 0) {
    richReveal([['1 / sin x', RED], [' = ', CR], ['csc x', RED]], 1000, 720, 56, t, P('G01', 0.55));
    term('cosecant', '余割', 1000, 800, t, P('G01', 0.68), { col: CR, size: 34 });
  }
}

// ======================= circle（A27：单位圆与 arcsin 图像联动） =======================
// C06 arcsin x = θ 的意思 → C07 水平线交圆两点，只取右半圆，θ 同步画到图像上 → C08 sin⁻¹(1/2) = π/6
const UC = { x: 800, y: 610, r: 185 };
const GC = { cx: 1250, cy: 610, ux: 105, uy: 105, x0: -1.35, x1: 1.45, y0: -1.9, y1: 1.9 };
function circVal(t) {   // 当前输入 x（圆上的高度）
  const sw = eIO(prog(t, P('C07', 0.3), Math.max(1.2, D('C07') * 0.55)));
  const v7 = lerp(-0.92, 0.92, sw);
  return t < S('C08') ? v7 : lerp(0.92, 0.5, eIO(prog(t, S('C08') + 0.05, 0.7)));
}
SC.circle = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5), 72);
  // 顶部定义
  const out6 = S('C08') + 0.02;
  richReveal([['arcsin ', INV], ['x', CYAN], ['  =  ', CR], ['θ', GOLD]], 1000, 290, 58, t, P('C06', 0.05), { out: out6 });
  glowText('θ ∈ [−π/2, π/2]，并且 sin θ = x', 1000, 360, 36, CR, t, P('C06', 0.3), { out: out6 });
  // 单位圆
  const ca = ap(t, 'C06', 0.45, 0.5); if (ca <= 0) return;
  ctx.save(); ctx.globalAlpha *= ca;
  seg(UC.x - UC.r - 40, UC.y, UC.x + UC.r + 40, UC.y, CR, 0.4, 2); seg(UC.x, UC.y - UC.r - 40, UC.x, UC.y + UC.r + 40, CR, 0.4, 2);
  glowPath(() => ctx.arc(UC.x, UC.y, UC.r, 0, TAU), CR, 2.5, 0.45);
  const rh = ap(t, 'C07', 0.08, 0.6);
  if (rh > 0) glowPath(() => ctx.arc(UC.x, UC.y, UC.r, -HP, -HP + PI * rh), GOLD, 6, 1);
  glowText('只取右半圆', UC.x, UC.y + UC.r + 62, 32, GOLD, t, P('C07', 0.2));
  ctx.restore();
  // 图像
  const ga = ap(t, 'C06', 0.6, 0.5);
  gAxes(GC, ga, { gx: 0.5, gy: 0.5, ticks: { x: [[-1, '−1'], [1, '1']], y: [[-HP, '−π/2'], [HP, 'π/2']] } });
  mathText('y = arcsin x', gx(GC, 0.12), gy(GC, -1.9) + 46, 30, INV, { glow: 8, alpha: ga });
  if (t < P('C07', 0.15)) return;
  const v = circVal(t), th = Math.asin(v), py = UC.y - v * UC.r, px = UC.x + Math.sqrt(1 - v * v) * UC.r, qx = UC.x - Math.sqrt(1 - v * v) * UC.r;
  const la = ap(t, 'C07', 0.15, 0.4);
  ctx.save(); ctx.globalAlpha *= la;
  seg(UC.x - UC.r - 30, py, UC.x + UC.r + 30, py, CYAN, 0.9, 2.5);
  if (t < S('C08') + 0.3) mathText('x', UC.x - UC.r - 44, py + 10, 32, CYAN, { align: 'right', glow: 8, alpha: 1 - ap(t, 'C08', 0.0, 0.3) });
  // 左交点：不要
  glowDot(qx, py, 8, RED, 0.7); crossMark(qx, py - 30, 22, RED, t, P('C07', 0.4));
  // 右交点 + 角 θ
  seg(UC.x, UC.y, px, py, GOLD, 1, 3);
  glowPath(() => ctx.arc(UC.x, UC.y, 52, 0, -th, th > 0), GOLD, 3.5, 1);
  mathText('θ', UC.x + 64, UC.y - Math.sin(th / 2) * 66 + 10, 30, GOLD, { glow: 8, alpha: 1 - ap(t, 'C08', 0.15, 0.3) });
  glowDot(px, py, 10, GOLD);
  // 图像上同步描点
  const v0 = -0.92, vmax = t < S('C08') ? v : 0.92;
  if (vmax > v0 + 0.01) gPlot(GC, Math.asin, INV, { xa: v0, xb: vmax, w: 5, noHead: true });
  if (t > S('C08')) gPlot(GC, Math.asin, INV, { xa: -1, xb: 1, w: 5, a: 0.9 });
  seg(gx(GC, v), gy(GC, 0), gx(GC, v), gy(GC, th), CYAN, 0.7, 2, [5, 6]);
  seg(gx(GC, 0), gy(GC, th), gx(GC, v), gy(GC, th), GOLD, 0.7, 2, [5, 6]);
  glowDot(gx(GC, v), gy(GC, th), 10, INV);
  ctx.restore();
  // C08：sin⁻¹(1/2) = π/6
  if (t > S('C08')) {
    const k = ap(t, 'C08', 0.25, 0.4);
    mathText('1/2', UC.x - UC.r - 44, py + 10, 30, CYAN, { align: 'right', glow: 8, alpha: k });
    mathText('π/6', UC.x + 70, UC.y - 22, 30, GOLD, { glow: 8, alpha: k });
    mathText('5π/6', qx - 6, py + 44, 28, RED, { align: 'center', glow: 6, alpha: k });
    glowText('不在区间', qx - 6, py + 76, 24, RED, t, P('C08', 0.75), { bold: false });
    mathText('π/6', gx(GC, 0) - 14, gy(GC, PI / 6) + 10, 28, GOLD, { align: 'right', glow: 8, alpha: k });
    mathText('1/2', gx(GC, 0.5), gy(GC, 0) + 34, 28, CYAN, { align: 'center', glow: 8, alpha: k });
    richReveal([['sin^{−1}', INV], ['(1/2)', CYAN], ['  =  ', CR], ['π/6', GOLD]], 1000, 300, 58, t, P('C08', 0.1));
    glowText('sin(π/6) = 1/2，π/6 在主值区间里', 1000, 370, 32, GRN, t, P('C08', 0.55), { bold: false });
    checkMark(1300, 284, 44, GRN, t, P('C08', 0.6));
  }
};

// ======================= others（cos / tan / cot） =======================
// C09 cos：[−π/2, π/2] 不单调 ✗ → 改取 [0, π] → 翻折成 arccos；C10–C11 tan：渐近线一起翻成水平线；C12 cot；D02 + C13 口诀：右半圆 / 上半圆
const GB = { cx: 790, cy: 760, ux: 95, uy: 95, x0: -1.4, x1: 3.6, y0: -1.3, y1: 3.6 };
const GT = { cx: 960, cy: 610, ux: 58, uy: 58, x0: -4.3, x1: 4.3, y0: -4.2, y1: 4.2 };
function foldLine(G, x0, y0, x1, y1, th, col, a) {
  if (a <= 0) return; const [X0, Y0] = foldXY(x0, y0, th), [X1, Y1] = foldXY(x1, y1, th);
  ctx.save(); gClip(G); seg(gx(G, X0), gy(G, Y0), gx(G, X1), gy(G, Y1), col, a, 2.2, [9, 8]); ctx.restore();
}
function sideCol(t, rows, x, y0, t0s, out) {
  rows.forEach(([s, col, isText], k) => { const f = isText ? glowText : glowMath; f(s, x, y0 + k * 62, isText ? 34 : 40, col, t, t0s[k], isText ? { align: 'left', out, bold: false } : { out }); });
}
function drawCos(t) {
  gAxes(GB, ap(t, 'C09', 0, 0.4), { gx: HP / 2, gy: HP / 2, ticks: { x: [[-1, '−1'], [1, '1'], [PI, 'π']], y: [[1, '1'], [PI, 'π']] } });
  const ph1 = ap(t, 'C09', 0.05, 0.4), ph2 = ap(t, 'C09', 0.32, 0.4);
  gPlot(GB, Math.cos, RED, { a: 0.28, w: 3 });
  if (ph2 < 1) gPlot(GB, Math.cos, RED, { xa: -HP, xb: HP, w: 6, a: ph1 * (1 - ph2) });
  if (ph1 > 0 && ph2 < 1) { crossMark(gx(GB, 0), gy(GB, 1) - 50, 34, RED, t, P('C09', 0.18), 1 - ph2); glowText('先升后降：不单调', gx(GB, 0), gy(GB, 1) - 100, 30, RED, t, P('C09', 0.18), { out: P('C09', 0.32) }); }
  const th = PI * eIO(prog(t, P('C09', 0.5), 1.2));
  if (ph2 > 0) {
    if (th <= 0) gPlot(GB, Math.cos, RED, { xa: 0, xb: PI, w: 6, a: ph2 });
    else { gPlot(GB, Math.cos, RED, { xa: 0, xb: PI, w: 3, a: 0.35, dash: [8, 8] }); foldCurve(GB, Math.cos, 0, PI, th, th > HP ? INV : RED, { w: 6 }); }
    if (th <= 0) glowText('严格递减 ✓', gx(GB, HP) + 30, gy(GB, 0) - 60, 30, GRN, t, P('C09', 0.36), { align: 'left' });
  }
  gDiag(GB, ap(t, 'C09', 0.45, 0.4));
  if (th >= PI) { mathText('arccos x', gx(GB, 0.2), gy(GB, 2.55), 36, INV, { glow: 10 }); bracketY(GB, 0, PI, GOLD, ap(t, 'C09', 0.78, 0.4)); bracketX(GB, -1, 1, CYAN, ap(t, 'C09', 0.72, 0.4)); }
  sideCol(t, [['y = cos x', RED], ['x ∈ [0, π]', CYAN], ['y = arccos x', INV], ['值域 [0, π]', GOLD, true]], 1240, 470, [P('C09', 0.05), P('C09', 0.32), P('C09', 0.72), P('C09', 0.8)]);
}
function drawTanCot(t, isCot) {
  const id = isCot ? 'C12' : 'C10', f = isCot ? cot : Math.tan, xa = isCot ? 0.235 : -1.33, xb = isCot ? PI - 0.235 : 1.33;
  const as = isCot ? [0, PI] : [-HP, HP];
  gAxes(GT, ap(t, id, 0, 0.4), { gx: 1, gy: 1, ticks: { x: isCot ? [[PI, 'π']] : [[-HP, '−π/2'], [HP, 'π/2']], y: isCot ? [[PI, 'π']] : [[-HP, '−π/2'], [HP, 'π/2']] } });
  gPlot(GT, f, RED, { xa, xb, w: 6, p: prog(t, P(id, 0.06), 0.7) });
  const th = PI * eIO(prog(t, P(id, isCot ? 0.4 : 0.42), 1.25));
  as.forEach(x => foldLine(GT, x, GT.y0, x, GT.y1, th, CR, 0.75 * ap(t, id, 0.15, 0.4)));
  gDiag(GT, ap(t, id, 0.3, 0.4));
  if (th > 0) foldCurve(GT, f, xa, xb, th, th > HP ? INV : RED, { w: 6 });
  if (th >= PI) {
    mathText(isCot ? 'arccot x' : 'arctan x', gx(GT, isCot ? -4.1 : 1.9), gy(GT, isCot ? 2.1 : 0.55), 36, INV, { glow: 10 });
    burst(t, P(id, isCot ? 0.4 : 0.42) + 1.25, gx(GT, 0), gy(GT, isCot ? HP : 0), INV, 140, 16);
  }
}
SC.others = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5), 72);
  const aC = fadeOut(t, S('C10'), 0.35), aT = ap(t, 'C10', 0, 0.35) * fadeOut(t, S('C12'), 0.35), aK = ap(t, 'C12', 0, 0.35) * fadeOut(t, S('D02'), 0.4);
  if (aC > 0) { ctx.save(); ctx.globalAlpha *= aC; drawCos(t); ctx.restore(); }
  if (aT > 0) {
    ctx.save(); ctx.globalAlpha *= aT; drawTanCot(t, false);
    // C11（台词第二句）：定义域 ℝ、值域开区间、两条水平渐近线
    const k = ap(t, 'C11', 0.05, 0.4);
    if (k > 0) {
      ctx.save(); ctx.globalAlpha *= k; ctx.shadowColor = CYAN; ctx.shadowBlur = 12; ctx.fillStyle = hexA(CYAN, 0.8); ctx.fillRect(gx(GT, GT.x0), gy(GT, 0) - 4, (GT.x1 - GT.x0) * GT.ux, 8); ctx.restore();
      bracketY(GT, -HP, HP, GOLD, ap(t, 'C11', 0.25, 0.4), { open: true });
      mathText('y = π/2', gx(GT, -4.2), gy(GT, HP) - 12, 28, GOLD, { glow: 6, alpha: ap(t, 'C11', 0.5) });
      mathText('y = −π/2', gx(GT, 4.2), gy(GT, -HP) + 34, 28, GOLD, { align: 'right', glow: 6, alpha: ap(t, 'C11', 0.5) });
    }
    sideCol(t, [['y = tan x', RED], ['x ∈ (−π/2, π/2)', CYAN], ['y = arctan x', INV], ['定义域 ℝ', CYAN, true], ['值域 (−π/2, π/2)', GOLD, true], ['两条水平渐近线', CR, true]], 1270, 440,
      [P('C10', 0.05), P('C10', 0.15), P('C10', 0.75), P('C10', 0.82), P('C11', 0.25), P('C11', 0.5)]);
    ctx.restore();
  }
  if (aK > 0) {
    ctx.save(); ctx.globalAlpha *= aK; drawTanCot(t, true);
    bracketY(GT, 0, PI, GOLD, ap(t, 'C12', 0.75, 0.4), { open: true });
    sideCol(t, [['y = cot x', RED], ['x ∈ (0, π)', CYAN], ['y = arccot x', INV], ['值域 (0, π)', GOLD, true]], 1270, 470, [P('C12', 0.05), P('C12', 0.15), P('C12', 0.7), P('C12', 0.78)]);
    ctx.restore();
  }
  if (t > S('D02') - 0.3) drawMnemonic(t);
};
// D02 + C13：四个区间乱飞 → 落进两个圆：sin、tan 右半圆；cos、cot 上半圆
const CH4 = [['[−π/2, π/2]', 'sin', 0], ['[0, π]', 'cos', 1], ['(−π/2, π/2)', 'tan', 0], ['(0, π)', 'cot', 1]];
const MC = [{ x: 790, y: 520 }, { x: 1230, y: 520 }], MR = 130;
function drawMnemonic(t) {
  const a = ap(t, 'D02', 0, 0.4); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const fly = eIO(prog(t, P('C13', 0.15), 0.8));
  // 两个圆
  const ca = ap(t, 'C13', 0.05, 0.4);
  MC.forEach((c, i) => {
    if (ca <= 0) return; ctx.save(); ctx.globalAlpha *= ca;
    seg(c.x - MR - 30, c.y, c.x + MR + 30, c.y, CR, 0.35, 2); seg(c.x, c.y - MR - 30, c.x, c.y + MR + 30, CR, 0.35, 2);
    glowPath(() => ctx.arc(c.x, c.y, MR, 0, TAU), CR, 2, 0.35);
    const k = ap(t, 'C13', 0.3 + i * 0.25, 0.5), a0 = i === 0 ? -HP : -PI;
    ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = hexA(GOLD, 0.13); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.arc(c.x, c.y, MR, a0, a0 + PI); ctx.closePath(); ctx.fill(); ctx.restore();
    if (k > 0) glowPath(() => ctx.arc(c.x, c.y, MR, a0, a0 + PI * k), GOLD, 6, 1);
    glowText(i === 0 ? 'sin、tan：右半圆' : 'cos、cot：上半圆', c.x, c.y - MR - 52, 38, GOLD, t, P('C13', 0.35 + i * 0.25));
    ctx.restore();
  });
  CH4.forEach(([iv, nm, g], k) => {
    const t0 = P('D02', 0.05 + k * 0.1), p = eBack(prog(t, t0, 0.35)); if (p <= 0) return;
    const sx = 760 + (k % 2) * 480 + Math.sin(t * 1.7 + k * 2) * 18 * (1 - fly), sy = 430 + Math.floor(k / 2) * 300 + Math.cos(t * 1.3 + k) * 14 * (1 - fly);
    const slot = CH4.filter(c => c[2] === g).indexOf(CH4[k]);
    const tx = MC[g].x, ty = MC[g].y + MR + 70 + slot * 84;
    const x = lerp(sx, tx, fly), y = lerp(sy, ty, fly);
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
    ctx.fillStyle = 'rgba(12,18,38,0.82)'; rr(-130, -34, 260, 68, 18); ctx.fill(); ctx.strokeStyle = hexA(GOLD, 0.7); ctx.lineWidth = 2; ctx.stroke();
    mathText(nm, -112, 12, 30, RED, { glow: 6, upright: true }); mathText(iv, 112, 12, 30, GOLD, { align: 'right', glow: 6 });
    ctx.restore();
  });
  if (t < S('C13') + 0.2) kinetic('？？', 1010, 590, 70, t, P('D02', 0.5), { col: CR, out: S('C13') });
  ctx.restore();
}

// ======================= saw（A28：复合的两个方向 · 锯齿；Grok 客串） =======================
// C14 sin(arcsin x) = x（只在 [−1, 1]）→ C15 arcsin(sin x) = x 只在 [−π/2, π/2] → X01 “不就是 2！” → C16 2 出界 → C17 镜像到 π − 2 → C18 结论 → X02 → C19 整条锯齿
const GS = { cx: 1010, cy: 600, ux: 66, uy: 105, x0: -6.4, x1: 6.6, y0: -2.15, y1: 2.25 };
const TK_S = { x: [[-PI, '−π'], [PI, 'π'], [-2 * PI, '−2π'], [2 * PI, '2π'], [2, '2']], y: [[HP, 'π/2'], [-HP, '−π/2']] };
SC.saw = t => {
  starfield(t); blueprint(ap(t, 'C14', 0, 0.5), 72);
  gAxes(GS, ap(t, 'C14', 0, 0.4), { gx: HP, gy: HP / 2, ticks: TK_S });
  // C14
  const a14 = fadeOut(t, S('C15'), 0.35);
  if (a14 > 0) {
    ctx.save(); ctx.globalAlpha *= a14;
    richReveal([['sin', RED], ['(', CR], ['arcsin x', INV], [')  =  x', CR]], 1010, 285, 56, t, P('C14', 0.06));
    gPlot(GS, x => x, GRN, { xa: -1, xb: 1, w: 6, p: prog(t, P('C14', 0.3), 0.6) });
    gPlot(GS, x => x, CR, { xa: 1, xb: 2.2, w: 2.4, dash: [6, 8], a: 0.5 * ap(t, 'C14', 0.55) });
    gPlot(GS, x => x, CR, { xa: -2.2, xb: -1, w: 2.4, dash: [6, 8], a: 0.5 * ap(t, 'C14', 0.55) });
    bracketX(GS, -1, 1, CYAN, ap(t, 'C14', 0.4, 0.4));
    glowText('x ∈ [−1, 1] 时成立 ✓', 1010, 870, 36, GRN, t, P('C14', 0.5));
    glowText('|x| > 1：arcsin x 没有定义', 1300, 470, 28, RED, t, P('C14', 0.7), { bold: false });
    ctx.restore();
  }
  if (t < S('C15') - 0.1) return;
  // C15 起：y = x 虚线 + 值域带 ±π/2
  const a15 = ap(t, 'C15', 0, 0.4), a19 = ap(t, 'C19', 0.02, 0.4);
  gPlot(GS, x => x, CR, { xa: -2.2, xb: 2.3, w: 2.4, dash: [6, 8], a: 0.5 * a15 * (1 - a19) });
  [HP, -HP].forEach(y => gH(GS, y, GOLD, 0.8 * a15, { dash: [10, 8], w: 2.2 }));
  const band = ap(t, 'C16', 0.08, 0.4);
  gFill(GS, GS.x0, GS.x1, -HP, HP, GOLD, band);
  gPlot(GS, saw, GRN, { xa: -HP, xb: HP, w: 6, p: prog(t, P('C15', 0.35), 0.5), a: 1 - a19 });
  // 顶部公式轮换
  const top = (parts, id, f, out) => richReveal(parts, 1010, 285, 54, t, P(id, f), { out });
  top([['arcsin', INV], ['(', CR], ['sin x', RED], [')  =  x', CR]], 'C15', 0.05, S('X01'));
  if (t < S('X01')) glowText('只在 [−π/2, π/2] 上成立', 1010, 350, 34, GRN, t, P('C15', 0.4), { out: S('X01') });
  top([['arcsin', INV], ['(', CR], ['sin 2', RED], [')  =  2 ？', CR]], 'X01', 0.12, S('C17'));
  top([['sin 2', RED], ['  =  ', CR], ['sin(π − 2)', RED]], 'C17', 0.05, S('C18'));
  top([['arcsin', INV], ['(', CR], ['sin 2', RED], [')  =  ', CR], ['π − 2', GRN]], 'C18', 0.05, S('C19'));
  if (t > S('C18')) checkMark(1010 + mathW('arcsin(sin 2)  =  π − 2', 54) / 2 + 48, 268, 46, GRN, t, P('C18', 0.45), 1 - a19);
  // x = 2：竖线
  const a2 = ap(t, 'X01', 0.3, 0.4) * (1 - a19);
  if (a2 > 0) {
    seg(gx(GS, 2), gy(GS, 0), gx(GS, 2), gy(GS, 2), CYAN, 0.8 * a2, 2.5, [6, 6]);
    glowDot(gx(GS, 2), gy(GS, 2), 10, RED, a2);
    mathText('(2, 2)', gx(GS, 2) + 16, gy(GS, 2) - 8, 30, RED, { glow: 8, alpha: a2 });
  }
  if (t > S('C16') && a19 < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - a19;
    mathText('π/2 ≈ 1.57', gx(GS, GS.x1) - 6, gy(GS, HP) - 12, 28, GOLD, { align: 'right', glow: 8, alpha: band });
    crossMark(gx(GS, 2) + 40, gy(GS, 2) - 46, 28, RED, t, P('C16', 0.45));
    glowText('出界了', gx(GS, 2) + 120, gy(GS, 2) - 44, 30, RED, t, P('C16', 0.5), { align: 'left' });
    ctx.restore();
  }
  // C17：关于 y = π/2 镜像到 π − 2
  const mr = eIO(prog(t, P('C17', 0.4), 0.8));
  if (mr > 0 && a19 < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - a19;
    const y = lerp(2, PI - 2, mr);
    arrowQ(gx(GS, 2) - 10, gy(GS, 2), gx(GS, 2) - 10, gy(GS, PI - 2), CR, mr, 0.8, { ctrl: [gx(GS, 2) - 70, gy(GS, HP)] });
    glowDot(gx(GS, 2), gy(GS, y), 11, mr >= 1 ? GRN : CR);
    if (mr >= 1) { mathText('π − 2 ≈ 1.14', gx(GS, 2) + 18, gy(GS, PI - 2) + 34, 30, GRN, { glow: 8 }); sparks(t, P('C17', 0.4) + 0.8, gx(GS, 2), gy(GS, PI - 2), { col: [GRN, '#ffffff'], n: 12 }); }
    ctx.restore();
  }
  // C19：整条锯齿，小球在 ±π/2 之间来回反弹
  if (t > S('C19') - 0.05) {
    const p = eIO(prog(t, P('C19', 0.08), Math.max(1.6, D('C19') * 0.7))), xb = lerp(GS.x0, GS.x1, p);
    gPlot(GS, saw, INV, { xa: GS.x0, xb, w: 5, n: 600, jump: 9, noHead: true, a: a19 });
    glowDot(gx(GS, xb), gy(GS, saw(xb)), 12, '#ffffff', a19);
    mathText('y = arcsin(sin x)', gx(GS, -6.2), gy(GS, 2.15) + 6, 30, INV, { glow: 8, alpha: a19 });
    kinetic('一出界，就被反弹回来', 1010, 880, 40, t, P('C19', 0.5), { col: GOLD });
  }
};

// ======================= tri（A29：三角形代换） =======================
// C20 cos(arcsin x) = ? → C21 θ = arcsin x：斜边 1、对边 x、邻边 √(1 − x²) → C22 θ 在主值区间，cos ≥ 0 → C23 课本两题
const TA = [700, 800], TB = [1180, 800], TC = [1180, 440];
function grow(p0, p1, q) { return [lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q)]; }
SC.tri = t => {
  starfield(t); blueprint(ap(t, 'C20', 0, 0.5), 72);
  const dimT = 1 - 0.8 * ap(t, 'C23', 0.02, 0.4);
  const outTop = S('C22') + D('C22') * 0.6;
  richReveal([['cos', RED], ['(', CR], ['arcsin x', INV], [')  =  ?', CR]], 1000, 330, 54, t, P('C20', 0.35), { out: outTop });
  ctx.save(); ctx.globalAlpha *= dimT;
  const e1 = eOut(prog(t, P('C21', 0.3), 0.5)), e2 = eOut(prog(t, P('C21', 0.48), 0.5)), e3 = eOut(prog(t, P('C21', 0.7), 0.6));
  const pre = ap(t, 'C20', 0.55, 0.5);
  if (pre > 0 && e1 <= 0) { glowPath(() => { ctx.moveTo(...TA); ctx.lineTo(...TB); ctx.lineTo(...TC); ctx.closePath(); }, CR, 2.5, 0.45 * pre); }
  if (e1 > 0) seg(...TA, ...grow(TA, TC, e1), CR, 1, 4);
  if (e2 > 0) seg(...TB, ...grow(TB, TC, e2), CYAN, 1, 5);
  if (e3 > 0) seg(...TA, ...grow(TA, TB, e3), GRN, 1, 5);
  if (pre > 0) {   // 直角 + θ
    ctx.save(); ctx.globalAlpha *= pre; ctx.strokeStyle = hexA(CR, 0.7); ctx.lineWidth = 2; ctx.strokeRect(TB[0] - 30, TB[1] - 30, 30, 30); ctx.restore();
    glowPath(() => ctx.arc(TA[0], TA[1], 70, -Math.atan2(TA[1] - TC[1], TC[0] - TA[0]), 0), GOLD, 3.5, pre);
    mathText('θ', TA[0] + 86, TA[1] - 14, 34, GOLD, { glow: 8, alpha: pre });
  }
  mathText('1', (TA[0] + TC[0]) / 2 - 30, (TA[1] + TC[1]) / 2 - 18, 40, CR, { align: 'right', glow: 8, alpha: e1 });
  mathText('x', TB[0] + 22, (TB[1] + TC[1]) / 2 + 12, 40, CYAN, { glow: 8, alpha: e2 });
  mathText('√(1 − x^2)', (TA[0] + TB[0]) / 2, TB[1] + 52, 40, GRN, { align: 'center', glow: 10, alpha: e3, upright: true });
  ctx.restore();
  // 右栏
  const R0 = 1270, out23 = S('C23');
  richReveal([['θ', GOLD], [' = ', CR], ['arcsin x', INV]], R0, 470, 44, t, P('C21', 0.04), { align: 'left', out: out23 });
  richReveal([['sin θ', RED], [' = ', CR], ['x', CYAN], [' / ', CR], ['1', CR]], R0, 535, 44, t, P('C21', 0.15), { align: 'left', out: out23 });
  glowText('勾股：邻边 = √(1 − x²)', R0, 600, 30, GRN, t, P('C21', 0.75), { align: 'left', bold: false, out: out23 });
  richReveal([['cos θ', RED], [' = ', CR], ['邻边 / 斜边', CR]], R0, 680, 40, t, P('C22', 0.05), { align: 'left', out: out23 });
  glowText('θ ∈ [−π/2, π/2] ⇒ cos θ ≥ 0', R0, 745, 30, GOLD, t, P('C22', 0.3), { align: 'left', bold: false, out: out23 });
  // 结论框
  const kb = ap(t, 'C22', 0.6, 0.4) * fadeOut(t, S('C23'), 0.4);
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha *= kb; const w = mathW('cos(arcsin x) = √(1 − x^2)', 56) + 60;
    ctx.fillStyle = hexA(GRN, 0.1); rr(1000 - w / 2, 330 - 62, w, 86, 16); ctx.fill(); ctx.strokeStyle = GRN; ctx.lineWidth = 3; ctx.shadowColor = GRN; ctx.shadowBlur = 16; ctx.stroke(); ctx.restore();
    richReveal([['cos(arcsin x) = ', CR], ['√(1 − x^2)', GRN]], 1000, 330, 56, t, P('C22', 0.62), { upright: true });
    burst(t, P('C22', 0.62) + 0.4, 1000, 310, GRN, 170, 20);
  }
  // C23：课本两题
  if (t > S('C23') - 0.05) {
    [['sin^{−1}(√3/2) = π/3', 'Ex 1.6 · 63(a)', 0.08], ['arctan 1 = π/4', 'Ex 1.6 · 65(a)', 0.45]].forEach(([m, src, f], k) => {
      const y = 470 + k * 190, a = ap(t, 'C23', f, 0.4); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(12,18,38,0.85)'; rr(640, y - 70, 760, 140, 20); ctx.fill(); ctx.strokeStyle = hexA(INV, 0.8); ctx.lineWidth = 2.5; ctx.shadowColor = INV; ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
      richReveal([[m, INV]], 1010, y + 18, 54, t, P('C23', f + 0.05), { upright: true });
      glowText(src, 1380, y - 44, 24, CR, t, P('C23', f + 0.05), { align: 'right', bold: false });
      checkMark(1340, y + 4, 40, GRN, t, P('C23', f + 0.25));
    });
  }
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C24', 0, 0.5), 78);
  const q = t < S('C27') ? 0 : 1, id = ['C25', 'C27'][q];
  if (t < S('C25')) { kinetic('随堂两题 · 每题 3 秒', 1000, 520, 60, t, S('C24') + 0.05, { col: GOLD }); return; }
  if (q === 0) {
    const G = { cx: 960, cy: 640, ux: 72, uy: 72, x0: -4.2, x1: 4.2, y0: -2.3, y1: 2.3 };
    ctx.save(); ctx.globalAlpha *= ap(t, 'C25', 0, 0.35);
    gAxes(G, 1, { grid: false, ticks: { x: [[1, '1']], y: [[HP, 'π/2'], [-HP, '−π/2']] } });
    [HP, -HP].forEach(y => gH(G, y, GOLD, 0.7, { dash: [10, 8], w: 2 }));
    gPlot(G, Math.atan, INV, { p: prog(t, P('C25', 0.3), 0.9) });
    mathText('arctan x', gx(G, 2.6), gy(G, Math.atan(2.6)) - 18, 34, INV, { glow: 8, alpha: ap(t, 'C25', 0.5) });
    if (t > S('C26')) {
      const h = ap(t, 'C26', 0.02, 0.5), y = -PI / 4;
      seg(gx(G, -1), gy(G, 0), gx(G, -1), gy(G, y), CYAN, h, 2.5, [5, 6]); seg(gx(G, 0), gy(G, y), gx(G, -1), gy(G, y), GRN, h, 2.5, [5, 6]);
      glowDot(gx(G, -1), gy(G, y), 10, GRN, h);
      mathText('−π/4', gx(G, 0) + 14, gy(G, y) + 10, 30, GRN, { glow: 8, alpha: h });
      checkMark(1380, 335, 52, GRN, t, S('C26') + 0.1); kinetic('−π/4', 1380, 415, 46, t, S('C26') + 0.2, { col: GRN, font: F_MATH, bold: false });
      glowText('3π/4 不在 (−π/2, π/2) 里', 960, 880, 34, RED, t, P('C26', 0.6), { bold: false }); crossMark(1235, 880, 26, RED, t, P('C26', 0.7));
    }
    ctx.restore();
  } else {
    const A = [760, 780], B = [1160, 780], C = [1160, 480];
    ctx.save(); ctx.globalAlpha *= ap(t, 'C27', 0, 0.35);
    const g = ap(t, 'C27', 0.4, 0.5);
    glowPath(() => { ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); }, CR, 2.5, 0.5 * g);
    if (g > 0) { seg(...B, ...C, CYAN, g, 5); seg(...A, ...C, CR, g, 4); glowPath(() => ctx.arc(A[0], A[1], 64, -Math.atan2(300, 400), 0), GOLD, 3, g); }
    mathText('3', C[0] + 22, (B[1] + C[1]) / 2 + 12, 40, CYAN, { glow: 8, alpha: g });
    mathText('5', (A[0] + C[0]) / 2 - 24, (A[1] + C[1]) / 2 - 14, 40, CR, { align: 'right', glow: 8, alpha: g });
    mathText('θ', A[0] + 80, A[1] - 14, 32, GOLD, { glow: 8, alpha: g });
    glowText('sin θ = 3/5', 960, 880, 32, CR, t, P('C27', 0.55), { bold: false, out: S('D03') });
    if (t > S('D03')) {
      const h = ap(t, 'D03', 0.3, 0.5); seg(...A, ...grow(A, B, h), GRN, 1, 5);
      mathText('4', (A[0] + B[0]) / 2, B[1] + 50, 40, GRN, { align: 'center', glow: 8, alpha: h });
      checkMark(1380, 335, 52, GRN, t, S('D03') + 0.1); kinetic('4/5', 1380, 415, 46, t, P('D03', 0.7), { col: GRN, font: F_MATH, bold: false });
      glowText('cos θ = 4/5', 960, 880, 34, GRN, t, P('D03', 0.75));
    }
    ctx.restore();
  }
  const title = ['arctan(−1) = ?', 'cos(arcsin(3/5)) = ?'][q];
  glowMath(title, 960, 268, 50, CR, t, P(id, 0.04), { align: 'center', upright: true });
  circleNum(q + 1, 960 - mathW(title, 50) / 2 - 56, 252, 30, GOLD, t, P(id, 0.02));
  QUIZ_BEATS.forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1540, 620, 92); });
};

function drawCredits(t) {
  const t0 = E('C29') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 1 章', 215, 34, GOLD, 0.08);
  T('下一段：指数、e 与增长', 310, 52, CR, 0.28);
  T('素材与授权说明', 450, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 505, 20, CR, 0.72, B);
  T('Grok 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', 548, 20, CR, 0.94, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 591, 20, CR, 1.16, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 634, 20, CR, 1.38, B);
  T('Grok 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', 677, 20, CR, 1.60, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 720, 20, CR, 1.82, B);
  T('Claude、GPT、DeepSeek、Grok 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 763, 20, CR, 2.04, B);
}

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'C28', 0, 0.5), 82);
  const items = [['一一对应', '先剪', RED, true], ['y = x', '再翻折', INV], ['[−π/2, π/2]', '主值区间', GOLD, true], ['△', '画三角形', GRN, true]];
  items.forEach(([m, s, col, up], i) => {
    const x = 690 + i * 235, y = 500, a = ap(t, 'C28', 0.08 + i * 0.12, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.08); ctx.beginPath(); ctx.arc(x, y, 108, 0, 7); ctx.fill(); ctx.restore();
    ring(x, y, 108, col, 0.8 * a, a);
    const sz = mathW(m, 40) > 180 ? Math.floor(40 * 180 / mathW(m, 40)) : 40;
    if (m === '△') glowPath(() => { ctx.moveTo(x - 46, y + 34); ctx.lineTo(x + 46, y + 34); ctx.lineTo(x + 46, y - 36); ctx.closePath(); }, col, 4, a);
    else mathText(m, x, y + sz * 0.32, sz, col, { align: 'center', glow: 12, alpha: a, upright: up });
    glowText(s, x, y + 160, 40, CR, t, P('C28', 0.12 + i * 0.12));
    sparks(t, P('C28', 0.08 + i * 0.12) + 0.3, x, y, { col: [col, '#ffffff'], n: 12, speed: 260 });
  });
  glowText('先剪成一一对应，再翻折；答案必须落在主值区间里', 1040, 790, 40, CR, t, P('C28', 0.55));
  glowText('下一段：指数、e 与增长', 1040, 870, 34, CYAN, t, P('C29', 0.2));
  drawCredits(t);
};

SC.__overlay = t => { if (t < E('C29') + 0.25) lecturer(t, 'C', 255, -5, E('C29') + 0.48, { h: 710 }); };
SC.__noTag = E('C29') + 0.30;
function drawFrame(t) { composeFrame(t, SC, TITLES); }

(function registerP5Sfx() {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  // hook
  s('D01', 0.12, 'swoosh_soft', 0.24); typeSfx(P('D01', 0.3), 8, 0.5, 0.12); s('D01', 0.55, 'hum', 0.16); s('D01', 0.8, 'pop', 0.3);
  SOLS.forEach((_, i) => s('C01', 0.05 + i * 0.075, i < 3 ? ['marimba_lo', 'marimba', 'marimba_hi'][i] : 'tick2', 0.26));
  s('C01', 0.7, 'buzz', 0.18);
  s('C02', 0.12, 'crack', 0.28); s('C02', 0.15, 'slap', 0.22); [0.35, 0.52, 0.69].forEach(f => s('C02', f, 'pluck', 0.24));
  // arcsin
  s('C03', 0.12, 'swoosh_soft', 0.22); s('C03', 0.35, 'tick', 0.22); s('C03', 0.6, 'ding', 0.3);
  s('C04', 0.03, 'crack', 0.3); s('C04', 0.3, 'warp', 0.28); sfx(P('C04', 0.3) + 1.3, 'sparkle', 0.3); s('C04', 0.8, 'type', 0.16);
  s('C05', 0.05, 'pluck', 0.24); s('C05', 0.3, 'pluck', 0.26); s('C05', 0.62, 'bell_soft', 0.28);
  s('G01', 0.12, 'swoosh_in', 0.26); s('G01', 0.3, 'tick', 0.22); s('G01', 0.55, 'pop', 0.28); s('G01', 0.68, 'check', 0.3);
  // circle
  typeSfx(P('C06', 0.05), 6, 0.4, 0.12); s('C06', 0.45, 'shimmer', 0.22);
  s('C07', 0.08, 'swoosh_soft', 0.24); s('C07', 0.3, 'riser', 0.14); s('C07', 0.4, 'buzz', 0.16);
  s('C08', 0.1, 'type', 0.16); s('C08', 0.6, 'check', 0.34); s('C08', 0.75, 'tick', 0.2);
  // others
  s('C09', 0.18, 'buzz', 0.2); s('C09', 0.36, 'ding', 0.28); s('C09', 0.5, 'warp', 0.26); s('C09', 0.78, 'pluck', 0.24);
  s('C10', 0.06, 'swoosh_soft', 0.22); s('C10', 0.42, 'warp', 0.26); sfx(P('C10', 0.42) + 1.25, 'sparkle', 0.28);
  s('C11', 0.05, 'pluck', 0.24); s('C11', 0.25, 'pluck', 0.26); s('C11', 0.5, 'tick', 0.22);
  s('C12', 0.06, 'swoosh_soft', 0.22); s('C12', 0.4, 'warp', 0.26); sfx(P('C12', 0.4) + 1.25, 'sparkle', 0.28);
  [0.05, 0.15, 0.25, 0.35].forEach(f => s('D02', f, 'pop', 0.24)); s('D02', 0.5, 'glitch', 0.14);
  s('C13', 0.15, 'whoosh', 0.24); s('C13', 0.3, 'marimba', 0.3); s('C13', 0.55, 'marimba_hi', 0.3);
  // saw
  typeSfx(P('C14', 0.06), 8, 0.6, 0.12); s('C14', 0.3, 'swoosh_soft', 0.22); s('C14', 0.5, 'check', 0.28);
  typeSfx(P('C15', 0.05), 8, 0.6, 0.12); s('C15', 0.35, 'shimmer', 0.22);
  s('X01', 0.08, 'slam', 0.34); s('X01', 0.3, 'zap', 0.2);
  s('C16', 0.08, 'swell', 0.18); s('C16', 0.45, 'buzz', 0.24);
  s('C17', 0.05, 'type', 0.16); s('C17', 0.4, 'whoosh', 0.24); sfx(P('C17', 0.4) + 0.8, 'ding_hi', 0.32);
  s('C18', 0.45, 'check', 0.36); s('X02', 0.1, 'soft_hit', 0.22);
  s('C19', 0.08, 'riser', 0.16); for (let k = 0; k < 4; k++) sfx(P('C19', 0.08) + Math.max(1.6, D('C19') * 0.7) * (k + 0.6) / 4.2, 'tick2', 0.2); s('C19', 0.5, 'pop', 0.24);
  // tri
  typeSfx(P('C20', 0.35), 8, 0.6, 0.12); s('C20', 0.55, 'pluck', 0.22);
  s('C21', 0.04, 'type', 0.16); [0.3, 0.48, 0.7].forEach((f, i) => s('C21', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.28));
  s('C22', 0.05, 'type', 0.16); s('C22', 0.3, 'tick', 0.22); sfx(P('C22', 0.62) + 0.4, 'ding_hi', 0.36);
  s('C23', 0.08, 'pop', 0.26); s('C23', 0.33, 'check', 0.3); s('C23', 0.45, 'pop', 0.26); s('C23', 0.7, 'check', 0.3);
  // quiz
  s('C24', 0.05, 'pop', 0.3);
  QUIZ_BEATS.forEach(b => countdownSfx(b.vo));
  ['C26', 'D03'].forEach(id => sfx(S(id) + 0.1, 'check', 0.4)); s('D03', 0.3, 'swoosh_soft', 0.26);
  // outro
  [0.08, 0.2, 0.32, 0.44].forEach((f, i) => s('C28', f, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.3));
  s('C29', 0.3, 'swell', 0.32);
})();
finalize();
