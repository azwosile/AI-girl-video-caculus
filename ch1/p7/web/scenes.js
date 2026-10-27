// P7《收束》（2026-10-27）：所有数学画面为原创 Canvas 绘制；沿用共享时间轴与组件，画风对齐 P1–P6。
// 版面约定：讲师占 x<540；主内容区 x 600–1460（GPT / 大肥鱼 / 豆包在右侧时不越界）；公式 44–64px；字幕区 y≥964 不放内容。
// 配色（制作规范“颜色语义”）：x / 定义域 = 青，y / 值域 = 金，函数 = 红，第二个函数 = 绿，反函数 / 割线等辅助 = 紫，正确 = 绿。
const SC = {};
const TITLES = [
  ['hook','第一章回顾'], ['elem','初等函数'], ['limit','洞与逼近'], ['secant','割线转切线'], ['ticket','出口票'], ['wall','术语墙 · 星图']
];
SIDE.B = { x: 1745, h: 600 };   // 豆包主持位（kit.js 的 SIDE 没有 B，这里补上，不改共享内核）
const TAU = Math.PI * 2, PI = Math.PI, HP = Math.PI / 2, CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv;
const TICKET_BEATS = ENTRIES.filter(e => e.k === 'beat' && e.b === 'ticket');
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
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

// 通用：圆角卡片
function card(x, y, w, h, col, a = 1, r = 18) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(11,16,34,0.78)'; rr(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = hexA(col, 0.8); ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 14; rr(x, y, w, h, r); ctx.stroke(); ctx.restore();
}
// 通用：任意坐标映射的折线（自带裁剪框）
function plotMap(fx, xa, xb, n, map, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return null;
  const xe = lerp(xa, xb, p), pts = [];
  for (let i = 0; i <= n; i++) { const x = lerp(xa, xe, i / n), y = fx(x); if (!isFinite(y)) continue; const q = map(x, y); if (q) pts.push(q); }
  if (pts.length < 2) return null;
  ctx.save(); if (o.clip) { ctx.beginPath(); ctx.rect(...o.clip); ctx.clip(); } if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => pts.forEach(([X, Y], i) => i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)), col, o.w || 4.5, a); ctx.restore();
  return pts[pts.length - 1];
}

function zhW(s, sz, bold = true) { ctx.save(); ctx.font = `${bold ? 'bold ' : ''}${sz}px ${F_FANCY}`; const w = ctx.measureText(s).width; ctx.restore(); return w; }

// ======================= hook：P1–P6 时间线 =======================
const PARTS = [['P1', '高中速通'], ['P2', '映射'], ['P3', '性质的严格语言'], ['P4', '复合与反函数'], ['P5', '反三角函数'], ['P6', '指数、e 与增长']];
const partXY = i => [760 + (i % 3) * 280, 420 + Math.floor(i / 3) * 190];
SC.hook = t => {
  starfield(t); blueprint(ap(t, 'C01', 0, 0.6), 72);
  glowText('第一章 · 函数', 1040, 260, 52, GOLD, t, S('C01') + 0.05);
  PARTS.forEach(([tag, s], i) => {
    const t0 = P('C01', 0.12 + i * 0.1), e = eBack(prog(t, t0, 0.5)), [x, y] = partXY(i); if (e <= 0) return;
    const yy = lerp(y + 260, y, e), a = clamp(e);
    card(x - 125, yy - 62, 250, 124, [CYAN, GOLD, GRN, RED, INV, GOLD][i], a, 16);
    glowText(tag, x, yy - 18, 30, GOLD, t, t0, { font: F_MATH, bold: false });
    glowText(s, x, yy + 30, s.length > 6 ? 26 : 32, CR, t, t0);
    if (i < 5 && prog(t, t0, 0.5) >= 1 && i % 3 !== 2) arrowH(x + 132, x + 150, yy, CR, 0.6, 2.5);
  });
};

// ======================= elem（A35：初等函数生成树） =======================
const ROOTS = [['常数', 'c'], ['幂', 'x^a'], ['指数', 'a^x'], ['对数', 'log_a x'], ['三角', 'sin x'], ['反三角', 'arcsin x']];
const rootX = i => 660 + i * 136, RY = 830, JX = 1040, JY = 600;
const FRUITS = [['√(1 − x^2)', 720], ['ln(4 − x^2)', 930], ['arcsin 2x', 1150], ['x · sin x', 1360]];
SC.elem = t => {
  starfield(t); blueprint(ap(t, 'C02', 0, 0.5), 74);
  const dim = 1 - 0.55 * ap(t, 'D01', 0.0, 0.4) * (1 - ap(t, 'G01', 0.6, 0.5));
  ctx.save(); ctx.globalAlpha *= dim;
  // 根：六类基本初等函数
  ROOTS.forEach(([zh, m], i) => {
    const t0 = P('C02', 0.08 + i * 0.1), a = ap(t, 'C02', 0.08 + i * 0.1, 0.35); if (a <= 0) return;
    const x = rootX(i);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(GOLD, 0.1); ctx.beginPath(); ctx.arc(x, RY, 52, 0, 7); ctx.fill(); ctx.restore();
    ring(x, RY, 52, GOLD, 0.8 * a);
    glowText(zh, x, RY - 4, 26, GOLD, t, t0);
    mathText(m, x, RY + 34, 20, CR, { align: 'center', alpha: a });
  });
  glowText('基本初等函数', 1040, 925, 28, GOLD, t, P('C02', 0.7), { bold: false });
  // 树枝：四则运算 + 复合
  const br = eIO(prog(t, P('C03', 0.05), 1.2));
  if (br > 0) {
    ROOTS.forEach((_, i) => { const x0 = rootX(i); glowPath(() => { ctx.moveTo(x0, RY - 52); ctx.quadraticCurveTo(x0, lerp(RY - 52, JY, 0.6), lerp(x0, JX, br), lerp(RY - 52, JY, br)); }, GRN, 3, 0.7); });
    if (br >= 1) {
      card(JX - 150, JY - 38, 300, 76, GRN, ap(t, 'C03', 0.3, 0.3), 14);
      mathText('+  −  ×  ÷   ∘', JX, JY + 14, 40, GRN, { align: 'center', glow: 12, alpha: ap(t, 'C03', 0.3, 0.3), upright: true });
      glowText('有限次', JX, JY + 66, 24, CR, t, P('C03', 0.5), { bold: false });
    }
  }
  // 果子：初等函数
  FRUITS.forEach(([m, x], i) => {
    const t0 = P('C04', 0.1 + i * 0.15), g = eOut(prog(t, t0, 0.45)); if (g <= 0) return;
    const y = 400;
    glowPath(() => { ctx.moveTo(JX, JY - 38); ctx.quadraticCurveTo(JX, lerp(JY, y, 0.5), lerp(JX, x, g), lerp(JY - 38, y + 40, g)); }, GRN, 2.5, 0.6);
    const w = mathW(m, 34) + 40;
    card(x - w / 2, y - 36, w, 72, RED, g, 36);
    mathText(m, x, y + 12, 34, RED, { align: 'center', glow: 10, alpha: g });
  });
  if (t > P('C04', 0.75)) glowText('初等函数', 1040, 300, 40, RED, t, P('C04', 0.75), { out: S('D01') });
  ctx.restore();
  // D01–C05：狄利克雷函数挂不上树
  const da = ap(t, 'D01', 0.1, 0.4) * (1 - ap(t, 'G01', 0.0, 0.35));
  if (da > 0) {
    const bounce = t > S('C05') ? Math.sin(prog(t, P('C05', 0.1), 0.6) * PI) * 60 : 0, X = 1040, Y = 262 - bounce;
    card(X - 230, Y - 80, 460, 160, CYAN, da, 16);
    ctx.save(); ctx.globalAlpha *= da;
    for (let k = 0; k < 34; k++) { const x = X - 200 + k * 12; glowDot(x, Y - 30, 3, GOLD, 0.9); glowDot(x + 6, Y + 30, 3, CYAN, 0.9); }
    ctx.restore();
    mathText('D(x)', X - 210, Y - 52, 28, CR, { glow: 6, alpha: da });
    glowText('有理点 → 1　无理点 → 0', X, Y + 66, 24, CR, t, P('D01', 0.2), { bold: false });
    if (t > P('C05', 0.1)) { crossMark(X + 250, Y - 40, 40, RED, t, P('C05', 0.1)); glowText('写不成有限步运算与复合', X, 495, 30, RED, t, P('C05', 0.35)); }
  }
  // G01：|x| = √(x²)
  if (t > S('G01')) {
    const m = ap(t, 'G01', 0.15, 0.6);
    const xl = lerp(820, 940, m), xr = lerp(1260, 1140, m);
    card(xl - 80, 200, 160, 80, CYAN, ap(t, 'G01', 0.02), 14); card(xr - 80, 200, 160, 80, CYAN, ap(t, 'G01', 0.08), 14);
    mathText('|x|', xl, 253, 40, CYAN, { align: 'center', glow: 10, alpha: ap(t, 'G01', 0.02) });
    mathText('√(x^2)', xr, 253, 40, CYAN, { align: 'center', glow: 10, alpha: ap(t, 'G01', 0.08) });
    if (m >= 1) { mathText('=', 1040, 253, 40, CR, { align: 'center', glow: 6 }); checkMark(1270, 230, 34, GRN, t, P('G01', 0.4)); }
    glowText('大多数分段函数不是初等函数', 1040, 322, 28, RED, t, P('G01', 0.6), { bold: false });
  }
};

// ======================= limit（A36：sin x / x 的洞） =======================
const GLm = { cx: 1040, cy: 700, ux: 40, uy: 300, x0: -10, x1: 10, y0: -0.3, y1: 1.15 };
const sinc = x => Math.abs(x) < 1e-9 ? NaN : Math.sin(x) / x;
SC.limit = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5), 76);
  gAxes(GLm, ap(t, 'C06', 0.02, 0.4), { grid: false, gx: PI, gy: 0.5, ticks: { x: [[-2 * PI, '−2π'], [2 * PI, '2π']], y: [[1, '1']] } });
  glowMath('y = sin x / x', 1040, 265, 54, RED, t, P('C06', 0.1), { align: 'center' });
  const pc = prog(t, P('C06', 0.3), 1.0);
  gPlot(GLm, x => sinc(x) * 1, RED, { xa: -10, xb: -0.02, p: pc, n: 400 });
  gPlot(GLm, x => sinc(x) * 1, RED, { xa: 0.02, xb: 10, p: pc, n: 400, rev: true });
  // 洞
  const ha = ap(t, 'C07', 0.2, 0.4);
  if (ha > 0) {
    const R = 10 + 10 * Math.max(0, 1 - prog(t, P('C07', 0.2), 0.6));
    openDot(gx(GLm, 0), gy(GLm, 1), R, RED, ha);
    glowText('x = 0：0 / 0，没有定义', gx(GLm, 0) + 30, gy(GLm, 1) - 70, 30, RED, t, P('C07', 0.3), { align: 'left', out: S('C08') });
  }
  // 两颗小球逼近
  if (t > S('C08')) {
    gH(GLm, 1, GOLD, ap(t, 'C08', 0.05, 0.4), { w: 2 });
    const u = eIO(prog(t, P('C08', 0.08), Math.max(2.5, D('C08') * 0.75))), x = Math.exp(lerp(Math.log(6), Math.log(0.03), u));
    [-1, 1].forEach(s => glowDot(gx(GLm, s * x), gy(GLm, sinc(s * x)), 10, GOLD));
    card(1150, 340, 300, 150, GOLD, ap(t, 'C08', 0.1, 0.3), 14);
    mathText('x = ' + x.toFixed(x < 0.1 ? 3 : 2), 1300, 400, 32, CYAN, { align: 'center', glow: 6, alpha: ap(t, 'C08', 0.1, 0.3) });
    mathText('y = ' + sinc(x).toFixed(5), 1300, 455, 32, GOLD, { align: 'center', glow: 6, alpha: ap(t, 'C08', 0.1, 0.3) });
  }
  if (t > S('D02')) glowText('到不了 0，却知道往哪去', 1040, 880, 32, CR, t, P('D02', 0.05), { out: S('C09') });
  if (t > S('C09')) {
    glowText('不问“那一点等于几”，只问“靠近时往哪去”', 1040, 880, 34, GOLD, t, P('C09', 0.2));
    burst(t, P('C09', 0.2), gx(GLm, 0), gy(GLm, 1), GOLD, 120, 16);
  }
};

// ======================= secant（A37：割线转切线） =======================
const GSc = { cx: 720, cy: 850, ux: 125, uy: 95, x0: -0.4, x1: 5.6, y0: -0.3, y1: 5.2 };
const fS = x => 0.16 * x * x + 0.35, dfS = x => 0.32 * x, PX = 1.6;
SC.secant = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5), 78);
  gAxes(GSc, ap(t, 'C10', 0.02, 0.4), { grid: false, gx: 1, gy: 1 });
  gPlot(GSc, fS, RED, { p: prog(t, P('C10', 0.05), 0.8) });
  const h = t < S('C11') ? 3.2 : Math.max(0, lerp(3.2, 0, eIO(prog(t, P('C11', 0.1), Math.max(2.4, D('C11') * 0.75))))), qx = PX + h;
  const at = ap(t, 'C10', 0.3, 0.4), P0 = [gx(GSc, PX), gy(GSc, fS(PX))], Q0 = [gx(GSc, qx), gy(GSc, fS(qx))];
  const k = h > 1e-3 ? (fS(qx) - fS(PX)) / h : dfS(PX), tang = h < 0.05;
  if (at > 0) {
    ctx.save(); gClip(GSc);
    seg(gx(GSc, PX - 1.5), gy(GSc, fS(PX) - 1.5 * k), gx(GSc, PX + 4.2), gy(GSc, fS(PX) + 4.2 * k), tang ? GRN : INV, at, 3.2);
    ctx.restore();
    if (h > 0.08) {
      seg(P0[0], P0[1], Q0[0], P0[1], CYAN, at, 3, [6, 5]); seg(Q0[0], P0[1], Q0[0], Q0[1], GOLD, at, 3, [6, 5]);
      mathText('Δx', (P0[0] + Q0[0]) / 2, P0[1] + 34, 28, CYAN, { align: 'center', glow: 6, alpha: at * Math.min(1, h) });
      mathText('Δy', Q0[0] + 12, (P0[1] + Q0[1]) / 2 + 8, 28, GOLD, { glow: 6, alpha: at * Math.min(1, h) });
      glowDot(Q0[0], Q0[1], 10, INV, at); mathText('Q', Q0[0] + 14, Q0[1] - 14, 28, INV, { glow: 6, alpha: at });
    }
    glowDot(P0[0], P0[1], 10, GOLD, at); mathText('P', P0[0] - 16, P0[1] - 14, 28, GOLD, { align: 'right', glow: 6, alpha: at });
    card(800, 330, 270, 130, tang ? GRN : INV, at, 14);
    glowText(tang ? '切线斜率' : '割线斜率 Δy / Δx', 935, 372, 24, CR, t, P('C10', 0.3), { bold: false });
    mathText(k.toFixed(3), 935, 432, 44, tang ? GRN : INV, { align: 'center', glow: 12, alpha: at, upright: true });
  }
  if (t > S('C11') && !tang) glowText('Q 向 P 靠近', 1040, 260, 34, INV, t, P('C11', 0.05));
  if (t > S('C12')) {
    glowMath('Δx = 0  ⇒  0 / 0 ?', 1040, 265, 46, RED, t, P('C12', 0.04), { align: 'center', out: P('C12', 0.55) });
    if (t > P('C12', 0.55)) {
      glowText('又要靠极限', 1040, 265, 40, GOLD, t, P('C12', 0.55));
      card(1150, 700, 300, 110, GRN, ap(t, 'C12', 0.65, 0.4), 14);
      glowText('P6 回顾', 1300, 736, 22, CR, t, P('C12', 0.65), { bold: false });
      glowMath('e^x 在 (0, 1) 处斜率 = 1', 1300, 780, 26, GRN, t, P('C12', 0.7), { align: 'center' });
    }
  }
};

// ======================= ticket（A38：豆包主持出口票） =======================
const GQ1 = { cx: 1020, cy: 640, ux: 130, uy: 80, x0: -2.1, x1: 2.1, y0: -2.6, y1: 2.6 };
const GQ2 = { cx: 1040, cy: 760, ux: 120, uy: 80, x0: -3, x1: 3, y0: -1.2, y1: 4.6 };
const GQ3 = { cx: 1040, cy: 640, ux: 60, uy: 100, x0: -6.4, x1: 6.6, y0: -2.1, y1: 2.1 };
function ticketHead(q, title, t, t0) {
  glowMath(title, 1040, 268, 44, CR, t, t0, { align: 'center', upright: true });
  circleNum(q, 1040 - mathW(title, 44) / 2 - 50, 252, 28, GOLD, t, t0);
}
SC.ticket = t => {
  starfield(t); blueprint(ap(t, 'B01', 0, 0.5), 80);
  if (t < S('B02')) {
    kinetic('出口票', 1040, 380, 72, t, S('B01') + 0.05, { col: GOLD });
    [0, 1, 2].forEach(i => { const a = ap(t, 'B01', 0.3 + i * 0.15, 0.4), x = 800 + i * 240; card(x - 95, 520, 190, 240, [RED, CYAN, INV][i], a, 16); glowText(['①', '②', '③'][i], x, 620, 60, [RED, CYAN, INV][i], t, P('B01', 0.3 + i * 0.15), { font: F_MATH, bold: false }); glowText('先作答', x, 715, 26, CR, t, P('B01', 0.4 + i * 0.15), { bold: false }); });
    return;
  }
  const q = t < S('B03') ? 1 : t < S('B04') ? 2 : 3;
  if (q === 1) {
    ticketHead(1, 'f(x) = x^3 − x ,  ℝ → ℝ', t, P('B02', 0.04));
    glowText('单射？满射？', 1040, 332, 32, CR, t, P('B02', 0.4), { bold: false });
    gAxes(GQ1, ap(t, 'B02', 0.1, 0.4), { grid: false, ticks: { x: [[-1, '−1'], [1, '1']] } });
    gPlot(GQ1, x => x * x * x - x, RED, { p: prog(t, P('B02', 0.2), 0.9) });
    if (t > S('C13')) {
      gH(GQ1, 0, GOLD, ap(t, 'C13', 0.05, 0.4), { w: 2.5 });
      [-1, 0, 1].forEach((x, i) => { const a = ap(t, 'C13', 0.1 + i * 0.06, 0.3); glowDot(gx(GQ1, x), gy(GQ1, 0), 10, GOLD, a); });
      glowText('三个 x → 同一个 0：不是单射', 860, 905, 28, RED, t, P('C13', 0.2), { bold: false }); crossMark(1050, 905, 22, RED, t, P('C13', 0.3));
      const ua = ap(t, 'C13', 0.55, 0.4);
      if (ua > 0) { const xt = 1.75; glowDot(gx(GQ1, xt), gy(GQ1, 2.5), 8, GRN, ua); glowDot(gx(GQ1, -xt), gy(GQ1, -2.5), 8, GRN, ua);
        mathText('→ +∞', gx(GQ1, 1.85), gy(GQ1, 2.45), 26, GRN, { glow: 6, alpha: ua }); mathText('→ −∞', gx(GQ1, -1.85), gy(GQ1, -2.45) + 20, 26, GRN, { align: 'right', glow: 6, alpha: ua }); }
      glowText('两头冲向 ±∞：是满射', 1250, 905, 28, GRN, t, P('C13', 0.6), { bold: false }); if (t > P('C13', 0.7)) checkMark(1410, 900, 26, GRN, t, P('C13', 0.7));
    }
  } else if (q === 2) {
    ticketHead(2, 'ln(4 − x^2) 的定义域？', t, P('B03', 0.04));
    gAxes(GQ2, ap(t, 'B03', 0.1, 0.4), { grid: false, ticks: { x: [[-2, '−2'], [2, '2']], y: [[4, '4']] } });
    gPlot(GQ2, x => 4 - x * x, GRN, { p: prog(t, P('B03', 0.2), 0.9) });
    mathText('4 − x^2', gx(GQ2, -1.2) - 16, gy(GQ2, 3.4), 30, GRN, { align: 'right', glow: 8, alpha: ap(t, 'B03', 0.5) });
    if (t > S('C14')) {
      const a = ap(t, 'C14', 0.1, 0.5);
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(GRN, 0.14); ctx.beginPath(); ctx.moveTo(gx(GQ2, -2), gy(GQ2, 0));
      for (let x = -2; x <= 2.001; x += 0.05) ctx.lineTo(gx(GQ2, x), gy(GQ2, 4 - x * x)); ctx.closePath(); ctx.fill(); ctx.restore();
      seg(gx(GQ2, -2), gy(GQ2, 0), gx(GQ2, -2 + 4 * a), gy(GQ2, 0), CYAN, 1, 8);
      openDot(gx(GQ2, -2), gy(GQ2, 0), 10, CYAN, a); openDot(gx(GQ2, 2), gy(GQ2, 0), 10, CYAN, a);
      glowText('4 − x² > 0', 1040, 332, 32, GRN, t, P('C14', 0.05), { bold: false });
      kinetic('(−2, 2)', 1360, 520, 50, t, P('C14', 0.4), { col: CYAN, font: F_MATH, bold: false }); checkMark(1360, 440, 40, GRN, t, P('C14', 0.4));
    }
  } else {
    ticketHead(3, 'arcsin(sin 2) = ?', t, P('B04', 0.04));
    gAxes(GQ3, ap(t, 'B04', 0.1, 0.4), { grid: false, ticks: { x: [[2, '2'], [PI, 'π']], y: [[HP, 'π/2'], [-HP, '−π/2']] } });
    if (t > S('C15')) {
      gPlot(GQ3, x => Math.asin(Math.sin(x)), INV, { p: prog(t, P('C15', 0.05), 0.8), n: 600 });
      const a = ap(t, 'C15', 0.35, 0.4), y = PI - 2;
      seg(gx(GQ3, 2), gy(GQ3, 0), gx(GQ3, 2), gy(GQ3, y), CYAN, a, 2.5, [5, 6]); seg(gx(GQ3, 0), gy(GQ3, y), gx(GQ3, 2), gy(GQ3, y), GOLD, a, 2.5, [5, 6]);
      glowDot(gx(GQ3, 2), gy(GQ3, y), 10, GOLD, a);
      mathText('π − 2 ≈ 1.14', gx(GQ3, 2) + 18, gy(GQ3, y) - 16, 30, GOLD, { glow: 8, alpha: a });
      kinetic('π − 2', 1360, 420, 50, t, P('C15', 0.5), { col: GRN, font: F_MATH, bold: false }); checkMark(1360, 340, 40, GRN, t, P('C15', 0.5));
    } else glowText('需要我帮你生成答案吗？', 1040, 360, 34, COL.inv, t, P('B04', 0.55), { bold: false });
    if (t > S('B05')) { kinetic('全对的家人们，恭喜！', 1040, 880, 44, t, S('B05') + 0.05, { col: GOLD }); sparks(t, S('B05') + 0.2, 1040, 860, { col: [GOLD, GRN, '#ffffff'], n: 30, speed: 420 }); }
  }
  TICKET_BEATS.forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1370, 420, 82); });
};

// ======================= wall（A39 术语墙 + A40 星图） =======================
const TERMS = [['定义域', 'domain'], ['值域', 'range'], ['单射', 'injective'], ['满射', 'surjective'], ['有界', 'bounded'], ['奇偶', 'even / odd'],
  ['周期', 'period'], ['复合', 'composition'], ['反函数', 'inverse'], ['主值', 'principal value'], ['e', 'natural base'], ['增长阶', 'order of growth']];
const STAR7 = (() => { let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; const a = []; for (let i = 0; i < 40; i++) { const th = i * 0.62, rad = 70 + i * 8.2; a.push([1040 + rad * Math.cos(th) * 1.25 + (r() - 0.5) * 30, 590 + rad * Math.sin(th) * 0.78 + (r() - 0.5) * 24]); } return a; })();
function drawStars(t, t0, t1, a) {
  if (a <= 0) return; const c = eIO(prog(t, t1, 1.4)), pr = prog(t, t0, 2.6);
  const pos = STAR7.map(([x, y]) => [lerp(x, 1040, c), lerp(y, 590, c)]);
  ctx.save(); ctx.globalAlpha *= a * (1 - c);
  const n = Math.floor(pr * 40);
  for (let i = 1; i <= n && i < 40; i++) seg(pos[i - 1][0], pos[i - 1][1], pos[i][0], pos[i][1], CYAN, 0.35, 1.5);
  pos.forEach(([x, y], i) => { if (i > n) return; glowDot(x, y, i % 5 === 0 ? 6 : 4, [GOLD, CYAN, RED, GRN, INV][i % 5], 0.95); if (i % 5 === 0) mathText('A' + String(i + 1).padStart(2, '0'), x + 10, y - 8, 16, CR, { alpha: 0.7 }); });
  ctx.restore();
}
SC.wall = t => {
  starfield(t); blueprint(ap(t, 'C16', 0, 0.5), 82);
  const out = ap(t, 'G02', 0.0, 0.5);
  TERMS.forEach(([zh, en], i) => {
    const c = i % 4, r = Math.floor(i / 4), x = 735 + c * 200, y = 400 + r * 135, t0 = P('C16', 0.12 + i * 0.065), a = eOut(prog(t, t0, 0.3)) * (1 - out); if (a <= 0) return;
    const yy = lerp(y - 40, y, eBack(prog(t, t0, 0.35)));
    card(x - 92, yy - 50, 184, 100, [CYAN, GOLD, RED, GRN][(c + r) % 4], a, 10);
    glowText(zh, x, yy - 4, zh === 'e' ? 36 : 32, CR, t, t0, { font: zh === 'e' ? F_MATH : undefined, bold: zh !== 'e', alpha: 1 - out });
    glowText(en, x, yy + 32, 18, CYAN, t, t0 + 0.1, { bold: false, alpha: 1 - out });
  });
  if (t > S('C17') && t < S('G02') + 0.4) glowText('极限 · 导数 · 积分 里再见', 1040, 820, 36, GOLD, t, P('C17', 0.3), { out: S('G02') });
  drawStars(t, S('G02'), S('D03') + Math.max(0.5, D('D03') * 0.6), out);
  if (t > S('G02')) glowText('第一章 · 40 个招牌动画', 1040, 270, 32, CYAN, t, P('G02', 0.2), { bold: false });
  const tc = S('D03') + Math.max(0.5, D('D03') * 0.6) + 1.2;
  if (t > tc) { burst(t, tc, 1040, 590, GOLD, 140, 22); kinetic('第 2 章 · 极限', 1040, 590, 60, t, tc, { col: GOLD }); }
};

function drawCredits(t) {
  const t0 = E('C18') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 1 章 · 完', 215, 34, GOLD, 0.08);
  T('下一章：极限', 310, 52, CR, 0.28);
  T('素材与授权说明', 450, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 505, 20, CR, 0.72, B);
  T('豆包（Seed 拟人）立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材；作者说明允许分享与再创作，本片按非商用使用。', 548, 20, CR, 0.94, B);
  T('豆包声音：用网络音频《豆包的封神语录》自训练的 GPT-SoVITS 模型；名称与声音归其权利人，权利人要求时替换。', 591, 20, CR, 1.16, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 634, 20, CR, 1.38, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 677, 20, CR, 1.60, B);
  T('Claude、GPT、DeepSeek、豆包 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 720, 20, CR, 1.82, B);
}

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.5, 82);
  kinetic('第 2 章 · 极限', 1040, 520, 72, t, S('C18') + 0.1, { col: GOLD });
  glowText('我们下一章见', 1040, 640, 40, CR, t, P('C18', 0.5));
  sparks(t, S('C18') + 0.3, 1040, 520, { col: [GOLD, CYAN, '#ffffff'], n: 30, speed: 380 });
  drawCredits(t);
};

SC.__overlay = t => { if (t < E('C18') + 0.25) lecturer(t, 'C', 255, -5, E('C18') + 0.48, { h: 710 }); };
SC.__noTag = E('C18') + 0.30;
function drawFrame(t) { composeFrame(t, SC, TITLES); }

(function registerP7Sfx() {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.05, 'swell', 0.22); PARTS.forEach((_, i) => s('C01', 0.12 + i * 0.1, 'pop', 0.22));
  ROOTS.forEach((_, i) => s('C02', 0.08 + i * 0.1, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi', 'marimba', 'marimba_hi'][i], 0.24));
  s('C03', 0.05, 'riser', 0.16); s('C03', 0.3, 'ding', 0.28);
  FRUITS.forEach((_, i) => s('C04', 0.1 + i * 0.15, 'pluck', 0.24)); s('C04', 0.75, 'shimmer', 0.22);
  s('D01', 0.1, 'swoosh_soft', 0.22); s('C05', 0.1, 'buzz', 0.24); s('C05', 0.12, 'thud', 0.2);
  s('G01', 0.15, 'swoosh_in', 0.24); s('G01', 0.4, 'check', 0.3);
  s('C06', 0.1, 'type', 0.16); s('C06', 0.3, 'swoosh_soft', 0.2); s('C07', 0.2, 'glitch', 0.18);
  s('C08', 0.08, 'riser', 0.16); s('C09', 0.2, 'bell_soft', 0.3);
  s('C10', 0.05, 'swoosh_soft', 0.22); s('C10', 0.3, 'tick', 0.22); s('C11', 0.1, 'whoosh', 0.22);
  s('C12', 0.04, 'buzz', 0.2); s('C12', 0.55, 'ding_hi', 0.3);
  s('B01', 0.05, 'stamp', 0.3); [0.3, 0.45, 0.6].forEach(f => s('B01', f, 'pop', 0.24));
  TICKET_BEATS.forEach(b => countdownSfx(b.vo));
  ['C13', 'C14', 'C15'].forEach(id => sfx(S(id) + 0.3, 'check', 0.36));
  s('B05', 0.05, 'sparkle', 0.3); s('B05', 0.2, 'swell', 0.22);
  TERMS.forEach((_, i) => s('C16', 0.12 + i * 0.065, i % 3 ? 'tick' : 'pluck', 0.18));
  s('G02', 0.05, 'shimmer', 0.24); s('D03', 0.3, 'warp', 0.24); s('C18', 0.1, 'impact', 0.3); s('C18', 0.3, 'swell', 0.32);
})();
finalize();
