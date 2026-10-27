// 第 2 章 P1《高中速通：导数》（2026-10-27）：数学画面全部原创 Canvas 绘制；沿用共享内核 core.js / kit.js，画风对齐第 1 章与第 2 章 P0。
// 版面：讲师占 x<540；主内容 x 600–1360（本段右侧客串多，全段按 1360 收）；字幕区 y≥964 不放内容。
// 配色（制作规范 + 第 2 章补充）：函数 f = 红，g = 绿，导数 f′ = 绿，Δx / x 方向 = 青，Δy / 数值 = 金，割线 / 切线 = 紫。
const SC = {};
const TITLES = [['intro', '四关速通'], ['rate', '第一关 · 平均变化率'], ['tangent', '第二关 · 瞬时变化率'], ['table', '第三关 · 求导公式'], ['rules', '第四关 · 运算法则'], ['quiz', '随堂两题'], ['outro', '“趋于”是什么？']];
const CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv;
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
const CX = 980;

// ---------- 通用小件（同 P0） ----------
function seg(x0, y0, x1, y1, col, a = 1, w = 3, dash) {
  if (a <= 0) return; ctx.save(); if (dash) ctx.setLineDash(dash);
  glowPath(() => { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }, col, w, a); ctx.restore();
}
function arrowH(x0, x1, y, col, a = 1, w = 3.5) {
  if (a <= 0 || Math.abs(x1 - x0) < 2) return; const s = Math.sign(x1 - x0), hd = Math.min(16, Math.abs(x1 - x0) * 0.45);
  glowPath(() => { ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x1 - s * hd, y - hd * 0.6); ctx.lineTo(x1, y); ctx.lineTo(x1 - s * hd, y + hd * 0.6); }, col, w, a);
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
function zhMath(zh, m, cx, y, size, cz, cm, t, t0, o = {}) {
  ctx.save(); ctx.font = `bold ${size}px ${F_FANCY}`; const wz = ctx.measureText(zh).width; ctx.restore();
  const ms = size * 1.12, wm = mathW(m, ms), gap = 18, x0 = cx - (wz + gap + wm) / 2;
  glowText(zh, x0, y, size, cz, t, t0, { align: 'left', out: o.out });
  glowMath(m, x0 + wz + gap, y + ms * 0.34, ms, cm, t, t0 + 0.12, { out: o.out, upright: o.upright });
}
function panel(x, y, w, h, col, a, fill = 'rgba(12,18,38,0.82)') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = fill; ctx.strokeStyle = hexA(col, 0.75); ctx.lineWidth = 2; rr(x, y, w, h, 14); ctx.fill(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.stroke(); ctx.restore();
}
// ---------- 独立 x / y 比例的坐标系（同 P0） ----------
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
function gPlot(G, f, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  const xa = o.xa ?? G.x0, xb = lerp(xa, o.xb ?? G.x1, p), n = 240, pts = [];
  for (let i = 0; i <= n; i++) { const x = xa + (xb - xa) * i / n, y = f(x); if (isFinite(y)) pts.push([gx(G, x), gy(G, clamp(y, G.y0 - 2, G.y1 + 2))]); }
  ctx.save(); gClip(G); if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, o.w || 4.5, a); ctx.restore();
  if (p < 1 && !o.noHead) { const y = f(xb); if (y > G.y0 && y < G.y1) glowDot(gx(G, xb), gy(G, y), 7, col, a); }
}
function gLine(G, m, x0, y0, xa, xb, col, a, w = 3.5) { if (a <= 0) return; ctx.save(); gClip(G); seg(gx(G, xa), gy(G, y0 + m * (xa - x0)), gx(G, xb), gy(G, y0 + m * (xb - x0)), col, a, w); ctx.restore(); }

// ---------- 关卡进度条（四关） ----------
const LV = ['平均变化率', '瞬时变化率', '求导公式', '运算法则'];
const LVX = k => 700 + k * 180;
function hud(t, cur, a) {
  if (a <= 0) return;
  LV.forEach((s, k) => {
    const x = LVX(k), y = 160, st = k < cur ? 0 : k === cur ? 1 : 2, col = [GRN, GOLD, CR][st];
    ctx.save(); ctx.globalAlpha *= a * [0.8, 1, 0.35][st];
    ctx.fillStyle = st === 1 ? 'rgba(40,34,12,0.9)' : 'rgba(12,18,38,0.7)'; ctx.strokeStyle = hexA(col, st === 1 ? 0.95 : 0.6); ctx.lineWidth = st === 1 ? 2.5 : 1.5;
    rr(x - 84, y - 22, 168, 44, 22); ctx.fill();
    if (st === 1) { ctx.shadowColor = GOLD; ctx.shadowBlur = 12 + 6 * Math.sin(t * 5); }
    ctx.stroke(); ctx.restore();
    label(String(k + 1), x - 62, y + 1, 24, col, a * [0.8, 1, 0.4][st], { font: F_MATH });
    label(s, x + 10, y + 1, 22, col, a * [0.8, 1, 0.4][st]);
    if (k < 3) seg(x + 86, y, x + 94, y, CR, 0.3 * a, 2);
  });
}

// ======================= intro：四关地图 =======================
const GHOST = [['f′(x)', 720, 560, -0.12], ['(x^n)′', 1010, 650, 0.08], ['sin x', 1250, 540, -0.05], ['lim', 860, 720, 0.1]];
SC.intro = t => {
  starfield(t); blueprint(0.45, 80);
  kinetic('高中导数', 900, 300, 78, t, P('D01', 0.08), { col: CR });
  kinetic('速通', 1150, 300, 78, t, P('D01', 0.22), { col: GOLD });
  // D01：记忆里的公式慢慢褪色（“忘得差不多了”）
  if (t < S('C01') + 0.4) GHOST.forEach(([s, x, y, r], i) => {
    const a = ap(t, 'D01', 0.15 + 0.08 * i, 0.4) * (1 - eIn(prog(t, P('D01', 0.62) + 0.08 * i, 0.7)));
    if (a <= 0) return; ctx.save(); ctx.translate(x + Math.sin(t * 2 + i) * 6, y - (t - S('D01')) * 10); ctx.rotate(r);
    mathText(s, 0, 0, 52, hexA(CYAN, 0.8), { align: 'center', glow: 10, alpha: a * 0.7, upright: s === 'lim' }); ctx.restore();
  });
  // C01：四关
  const lineA = ap(t, 'C01', 0.25, 0.8);
  if (lineA > 0) { ctx.save(); ctx.setLineDash([8, 10]); glowPath(() => { ctx.moveTo(LVX(0), 560); ctx.lineTo(lerp(LVX(0), LVX(3), lineA), 560); }, CR, 2, 0.35); ctx.restore(); }
  LV.forEach((s, k) => {
    const t0 = P('C01', 0.25 + 0.13 * k), p = eBack(prog(t, t0, 0.4)); if (p <= 0) return;
    const x = LVX(k), y = 560;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = 'rgba(12,18,38,0.88)'; ctx.strokeStyle = hexA(GOLD, 0.85); ctx.lineWidth = 2.5; rr(-80, -80, 160, 160, 18); ctx.fill(); ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
    label(String(k + 1), x, y - 28, 60, GOLD, clamp(p), { font: F_MATH });
    label(s, x, y + 44, 26, CR, clamp(p), { bold: true });
  });
  glowText('每关 ≈ 30 秒', CX, 730, 36, CYAN, t, P('C01', 0.78));
};

// ======================= rate：第一关 平均变化率（y = x²，x 从 1 到 3） =======================
const GR = { cx: 700, cy: 860, ux: 150, uy: 52, x0: 0, x1: 3.6, y0: 0, y1: 10.5 };
const sq = x => x * x;
function rateGraph(t, a) {
  gAxes(GR, a, { gy: 1, ticks: { x: [[1, '1'], [2, '2'], [3, '3']], y: [[1, '1'], [4, '4'], [9, '9']] } });
  gPlot(GR, sq, RED, { p: prog(t, P('C02', 0.35), 1.0), a });
  mathText('y = x^2', gx(GR, 3.3), gy(GR, 7.2), 36, RED, { align: 'left', glow: 10, alpha: a * ap(t, 'C02', 0.7) });
}
// Δx（青，水平）与 Δy（金，竖直），从 (1,1) 到 (q, q²)
function deltas(t, q, a, o = {}) {
  if (a <= 0) return; const y1 = 1, y2 = q * q;
  seg(gx(GR, 1), gy(GR, y1), gx(GR, q), gy(GR, y1), CYAN, a, 3, [7, 6]);
  seg(gx(GR, q), gy(GR, y1), gx(GR, q), gy(GR, y2), GOLD, a, 3, [7, 6]);
  if (q > 1.25) { label(o.dx || 'Δx', gx(GR, (1 + q) / 2), gy(GR, y1) + 24, 28, CYAN, a, { font: F_MATH }); label(o.dy || 'Δy', gx(GR, q) + 14, gy(GR, (y1 + y2) / 2), 28, GOLD, a, { font: F_MATH, align: 'left' }); }
}
SC.rate = t => {
  starfield(t); blueprint(0.45, 80);
  hud(t, 0, ap(t, 'C02', 0, 0.4));
  zhMath('平均变化率', '= Δy / Δx', CX, 234, 40, CR, GOLD, t, P('C02', 0.1), { upright: true });
  const ga = ap(t, 'C02', 0.25, 0.5); rateGraph(t, ga);
  // C03：两点与增量
  const pa = ap(t, 'C03', 0.22), pb = ap(t, 'C03', 0.42);
  deltas(t, 3, ap(t, 'C03', 0.55), { dx: 'Δx = 2', dy: 'Δy = 8' });
  glowDot(gx(GR, 1), gy(GR, 1), 9, GOLD, pa); label('(1, 1)', gx(GR, 1) - 14, gy(GR, 1) - 28, 26, GOLD, pa, { font: F_MATH, align: 'right' });
  glowDot(gx(GR, 3), gy(GR, 9), 9, GOLD, pb); label('(3, 9)', gx(GR, 3) - 20, gy(GR, 9) - 10, 26, GOLD, pb, { font: F_MATH, align: 'right' });
  richReveal([['Δy / Δx = ', CR], ['8', GOLD], [' ÷ ', CR], ['2', CYAN], [' = ', CR], ['4', GRN]], CX - 40, 304, 40, t, P('C03', 0.78), { upright: true });
  // D02：割线
  const sa = ap(t, 'D02', 0.1, 0.5);
  if (sa > 0) {
    ctx.save(); gClip(GR); const xb = lerp(1, 3.35, sa); seg(gx(GR, 0.6), gy(GR, 4 * 0.6 - 3), gx(GR, xb), gy(GR, 4 * xb - 3), INV, sa, 3.5); ctx.restore();
    label('割线', gx(GR, 1.2) - 30, gy(GR, 3.2) - 6, 32, INV, ap(t, 'D02', 0.4), { bold: true, align: 'right' });
    label('斜率 = 4', gx(GR, 1.2) - 30, gy(GR, 3.2) + 36, 26, INV, ap(t, 'D02', 0.55), { align: 'right' });
  }
};

// ======================= tangent：第二关 Δx → 0，割线转切线 =======================
const qT = [0.22, 0.4, 0.56, 0.7];
function curQ(t) { return kf(t, 3, [[P('C04', qT[0]), 2, 0.5], [P('C04', qT[1]), 1.5, 0.45], [P('C04', qT[2]), 1.1, 0.45], [P('C04', qT[3]), 1.01, 0.4], [P('C05', 0.1), 1.0, 0.5]]); }
SC.tangent = t => {
  starfield(t); blueprint(0.45, 80);
  hud(t, 1, 1);
  rateGraph(t, 1);
  const q = curQ(t), tg = ap(t, 'C05', 0.1, 0.6), m = lerp(q + 1, 2, tg);
  // 割线 / 切线
  gLine(GR, m, 1, 1, 0.3, 3.3, INV, 1, 3.5 + 2 * tg);
  deltas(t, q, 1 - tg);
  if (q > 1.004) glowDot(gx(GR, q), gy(GR, q * q), 9, CYAN, 1 - tg);
  glowDot(gx(GR, 1), gy(GR, 1), 9, GOLD, 1);
  // 斜率读数（左上角空白处）
  panel(720, 330, 250, 84, INV, 1);
  label(tg > 0.5 ? '切线斜率' : '割线斜率', 790, 372, 26, INV, 1, { bold: true });
  mathText(m.toFixed(m > 2.05 ? 2 : 3).replace(/0+$/, '').replace(/\.$/, ''), 950, 386, 40, tg > 0.5 ? GRN : INV, { align: 'right', glow: 10, upright: true });
  // C04：导数定义
  const out = S('G01');
  richReveal([['f′(x_0)', GRN], [' = ', CR], ['lim_{Δx→0}', GOLD], [' Δy / Δx', CR]], CX, 240, 44, t, P('C04', 0.1), { out, upright: true });
  if (t > P('C04', 0.75) && t < S('C05') + 0.6) glowText('Δx → 0', gx(GR, 1.6), gy(GR, 1) + 60, 30, CYAN, t, P('C04', 0.75), { font: F_MATH, bold: false, out: S('C05') + 0.2 });
  // C05：切线 y = 2x − 1（上一段 P0 见过）
  if (tg > 0) {
    burst(t, P('C05', 0.1) + 0.5, gx(GR, 1), gy(GR, 1), INV, 90, 14);
    mathText('y = 2x − 1', gx(GR, 3) + 10, gy(GR, 5) + 46, 32, INV, { glow: 12, alpha: ap(t, 'C05', 0.5) });
    label('切线', gx(GR, 3) + 60, gy(GR, 5) + 92, 28, INV, ap(t, 'C05', 0.5), { bold: true });
    label('P0 见过', 1300, 760, 22, CYAN, ap(t, 'C05', 0.8) * fadeOut(t, S('G01')), { bold: false });
  }
  // G01：切线方程
  if (t > S('G01') - 0.1) {
    richReveal([['y − ', CR], ['f(x_0)', RED], [' = ', CR], ['f′(x_0)', GRN], ['(x − x_0)', CR]], CX, 240, 44, t, P('G01', 0.05), { upright: true });
    glowText('过切点 + 斜率 = 导数', CX, 304, 30, CR, t, P('G01', 0.4), { bold: false });
    label('切点', gx(GR, 1) + 24, gy(GR, 1) + 32, 26, GOLD, ap(t, 'G01', 0.3), { align: 'left' });
  }
};

// ======================= table：第三关 求导公式表（A44 逐格点亮） =======================
const ROWS = [
  [['(C)′', CR], [' = ', CR], ['0', GRN]],
  [['(x^n)′', CR], [' = ', CR], ['n x^{n−1}', GRN]],
  [['(sin x)′', CR], [' = ', CR], ['cos x', GRN]],
  [['(cos x)′', CR], [' = ', CR], ['−sin x', GRN]],
  [['(e^x)′', CR], [' = ', CR], ['e^x', GRN]],
  [['(ln x)′', CR], [' = ', CR], ['1/x', GRN]],
  [['(a^x)′', CR], [' = ', CR], ['a^x ln a', GRN]],
  [['(log_a x)′', CR], [' = ', CR], ['1/(x ln a)', GRN]],
];
const rowT = i => [P('Q01', 0.3), P('Q01', 0.62), P('Q02', 0.04), P('Q02', 0.22), P('Q02', 0.48), P('Q02', 0.74), P('Q03', 0.08), P('Q03', 0.26)][i];
const cell = i => ({ x: i < 4 ? 636 : 996, y: 360 + (i % 4) * 92, w: 348, h: 74 });
const COINS = Array.from({ length: 22 }, (_, i) => ({ x: 650 + ((i * 263) % 690), d: (i * 0.137) % 0.9, s: 0.7 + ((i * 7) % 5) * 0.08 }));
SC.table = t => {
  starfield(t); blueprint(0.45, 80);
  hud(t, 2, 1);
  // C06：每次从定义算？太慢
  if (t < S('Q01') + 0.5) {
    const o = S('Q01');
    glowText('每次都从定义算？', CX, 400, 36, CR, t, P('C06', 0.12), { out: o });
    richReveal([['lim_{Δx→0} ', GOLD], ['(f(x + Δx) − f(x)) / Δx', CR]], CX, 510, 42, t, P('C06', 0.25), { out: o, upright: true });
    if (t > P('C06', 0.5)) kinetic('太慢', CX, 640, 64, t, P('C06', 0.5), { col: RED, out: o });
  }
  // Q01 起：公式表
  const ta = ap(t, 'Q01', 0.0, 0.45);
  if (ta > 0) {
    panel(620, 290, 740, 400, GOLD, ta, 'rgba(12,18,38,0.78)');
    label('求导公式表', CX + 2, 252, 36, GOLD, ta, { bold: true });
    ROWS.forEach((r, i) => {
      const c = cell(i), lit = eOut(prog(t, rowT(i), 0.35));
      ctx.save(); ctx.globalAlpha *= ta;
      if (lit < 1) { ctx.globalAlpha *= 0.3 * (1 - lit); ctx.setLineDash([6, 6]); ctx.strokeStyle = CR; ctx.lineWidth = 1.5; rr(c.x, c.y - c.h / 2, c.w, c.h, 10); ctx.stroke(); ctx.setLineDash([]); ctx.font = `30px ${F_MATH}`; ctx.fillStyle = CR; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', c.x + c.w / 2, c.y); }
      ctx.restore();
      if (lit > 0) {
        ctx.save(); ctx.globalAlpha *= ta * lit; ctx.fillStyle = hexA(GOLD, 0.08 + 0.18 * (1 - lit)); ctx.strokeStyle = hexA(GOLD, 0.55); ctx.lineWidth = 1.5; rr(c.x, c.y - c.h / 2, c.w, c.h, 10); ctx.fill(); ctx.shadowColor = GOLD; ctx.shadowBlur = 16 * (1 - lit) + 4; ctx.stroke(); ctx.restore();
        richReveal(r, c.x + 18, c.y + 12, 32, t, rowT(i), { align: 'left', alpha: ta });
      }
    });
    stampMark(1300, 252, 56, t, P('Q01', 0.12), { text: '全包', rot: -0.18 });
  }
  // Q03：再买就是了～（金币雨）
  if (t > P('Q03', 0.5)) {
    const t0 = P('Q03', 0.5);
    COINS.forEach(c => {
      const u = (t - t0 - c.d) / 1.5; if (u < 0 || u > 1) return; const y = 270 + u * u * 470, a = Math.min(1, (1 - u) * 4);
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(c.x, y); ctx.scale(Math.cos(t * 7 + c.x) * c.s, c.s);
      ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fill();
      ctx.strokeStyle = hexA(COL.ink, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.stroke(); ctx.restore();
    });
    kinetic('再买就是了～', CX, 790, 54, t, P('Q03', 0.55), { col: GOLD });
  }
  // D03：本鲸也要一份
  if (t > S('D03')) { burst(t, P('D03', 0.15), CX, 490, GOLD, 160, 24); kinetic('+1 份', 1250, 790, 40, t, P('D03', 0.3), { col: CYAN, out: E('D03') + 0.3 }); }
};

// ======================= rules：第四关 运算法则 + 单调性 =======================
const RL = [
  { y: 300, t: () => P('C07', 0.25), p: [['(', CR], ['f', RED], [' ± ', CR], ['g', GRN], [')′ = ', CR], ['f′', RED], [' ± ', CR], ['g′', GRN]] },
  { y: 430, t: () => P('C08', 0.02), p: [['(', CR], ['f', RED], ['g', GRN], [')′ = ', CR], ['f′', RED], ['g', GRN], [' + ', CR], ['f', RED], ['g′', GRN]], m: '前导后不导 + 前不导后导', mt: () => P('C08', 0.12) },
  { y: 580, t: () => P('C08', 0.45), p: [['(', CR], ['f', RED], [' / ', CR], ['g', GRN], [')′ = (', CR], ['f′', RED], ['g', GRN], [' − ', CR], ['f', RED], ['g′', GRN], [') / ', CR], ['g^2', GRN]], m: '上导下不导 − 上不导下导，再除以下的平方', mt: () => P('C08', 0.58) },
];
const GC = { cx: 980, cy: 700, ux: 125, uy: 34, x0: -2.2, x1: 2.2, y0: -4.6, y1: 4.6 };
const cub = x => x * x * x - 3 * x;
SC.rules = t => {
  starfield(t); blueprint(0.45, 80);
  hud(t, 3, 1);
  const ra = fadeOut(t, S('G02') - 0.05, 0.4);
  if (ra > 0) {
    label('和差', 660, 300, 26, CYAN, ra * ap(t, 'C07', 0.2), { align: 'left' });
    label('乘积', 660, 430, 26, CYAN, ra * ap(t, 'C08', 0.0), { align: 'left' });
    label('商', 660, 580, 26, CYAN, ra * ap(t, 'C08', 0.42), { align: 'left' });
    RL.forEach(r => {
      richReveal(r.p, CX + 40, r.y + 14, 44, t, r.t(), { alpha: ra });
      if (r.m) glowText(r.m, CX + 40, r.y + 66, 26, CYAN, t, r.mt(), { bold: false, out: S('G02') - 0.05 });
    });
  }
  // G02：导数的正负 → 单调
  if (t > S('G02') - 0.1) {
    richReveal([['f′(x) > 0', GRN], ['  ⇒  递增 ↗', GRN]], CX, 290, 40, t, P('G02', 0.2), { upright: true });
    richReveal([['f′(x) < 0', RED], ['  ⇒  递减 ↘', RED]], CX, 358, 40, t, P('G02', 0.6), { upright: true });
  }
  // C09：y = x³ − 3x
  if (t > S('C09') - 0.1) {
    richReveal([['y = x^3 − 3x', RED], ['      ', CR], ['y′ = 3x^2 − 3', GRN]], CX, 462, 38, t, P('C09', 0.05), { upright: false });
    const ga = ap(t, 'C09', 0.0, 0.4), hl = ap(t, 'C09', 0.5, 0.5);
    gAxes(GC, ga, { gy: 2, ticks: { x: [[-1, '−1'], [1, '1']] } });
    if (hl > 0) { ctx.save(); ctx.globalAlpha *= hl; ctx.fillStyle = hexA(RED, 0.1); ctx.fillRect(gx(GC, -1), gy(GC, GC.y1), 2 * GC.ux, (GC.y1 - GC.y0) * GC.uy); ctx.restore(); }
    gPlot(GC, cub, CR, { p: prog(t, P('C09', 0.12), 0.9), a: ga * (1 - hl) + 0.25 * hl });
    if (hl > 0) {
      gPlot(GC, cub, GRN, { xa: GC.x0, xb: -1, a: hl, noHead: true }); gPlot(GC, cub, RED, { xa: -1, xb: 1, a: hl, w: 5.5, noHead: true }); gPlot(GC, cub, GRN, { xa: 1, xb: GC.x1, a: hl, noHead: true });
      [[-1.6, '+', GRN], [0, '−', RED], [1.6, '+', GRN]].forEach(([x, s, c], i) => label(s, gx(GC, x), 892, 34, c, eOut(prog(t, P('C09', 0.5 + 0.08 * i), 0.3)), { font: F_MATH }));
      mathText('y′', gx(GC, GC.x0) - 30, 902, 28, GRN, { align: 'right', glow: 8, alpha: hl });
      glowText('下降', gx(GC, 0) + 40, gy(GC, 0) - 46, 28, RED, t, P('C09', 0.75), { bold: true });
    }
  }
};

// ======================= quiz：随堂两题 =======================
const QUIZ_BEATS = ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz');
const QG1 = { cx: 700, cy: 860, ux: 130, uy: 21, x0: 0, x1: 2.6, y0: 0, y1: 20 };
const QG2 = { cx: 700, cy: 860, ux: 105, uy: 30, x0: 0, x1: 3.6, y0: 0, y1: 13.5 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.45, 78);
  if (t < S('C11')) { kinetic('随堂两题 · 每题 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  QUIZ_BEATS.forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1240, 620, 92); });
  if (t < S('C12')) {
    const a = ap(t, 'C11', 0, 0.35);
    label('第一题', 640, 240, 30, GOLD, a, { align: 'left', bold: true });
    richReveal([['x^3', RED], [' 在 ', CR], ['x = 2', CYAN], [' 处的导数 = ?', CR]], CX, 318, 44, t, P('C11', 0.1));
    gAxes(QG1, a, { gy: 4, ticks: { x: [[1, '1'], [2, '2']], y: [[8, '8']] } });
    gPlot(QG1, x => x * x * x, RED, { p: prog(t, P('C11', 0.3), 0.9), a });
    const pa = ap(t, 'C11', 0.6);
    seg(gx(QG1, 2), gy(QG1, 0), gx(QG1, 2), gy(QG1, 8), CYAN, 0.6 * pa, 2, [5, 6]); glowDot(gx(QG1, 2), gy(QG1, 8), 9, GOLD, pa);
    if (t < S('D04')) label('?', gx(QG1, 2) + 40, gy(QG1, 8) - 30, 44, RED, pa * (0.6 + 0.4 * Math.sin(t * 6)), { font: F_MATH });
    if (t > S('D04')) {
      const h = ap(t, 'D04', 0.05, 0.5);
      gLine(QG1, 12, 2, 8, 1.5, 2.45, INV, h, 3.5);
      richReveal([['3x^2', GRN], ['  →  3 × 2^2 = ', CR], ['12', GOLD]], CX, 400, 42, t, P('D04', 0.15));
      checkMark(1240, 560, 52, GRN, t, P('D04', 0.6)); kinetic('12', 1240, 650, 52, t, P('D04', 0.65), { col: GRN, font: F_MATH, bold: false });
    }
  } else {
    const a = ap(t, 'C12', 0, 0.35);
    label('第二题', 640, 240, 30, GOLD, a, { align: 'left', bold: true });
    richReveal([['y = x^2', RED], [' 在 ', CR], ['x = 3', CYAN], [' 处的切线斜率 = ?', CR]], CX, 318, 44, t, P('C12', 0.1));
    gAxes(QG2, a, { gy: 3, ticks: { x: [[1, '1'], [2, '2'], [3, '3']], y: [[9, '9']] } });
    gPlot(QG2, sq, RED, { p: prog(t, P('C12', 0.3), 0.9), a });
    const pa = ap(t, 'C12', 0.6);
    seg(gx(QG2, 3), gy(QG2, 0), gx(QG2, 3), gy(QG2, 9), CYAN, 0.6 * pa, 2, [5, 6]); glowDot(gx(QG2, 3), gy(QG2, 9), 9, GOLD, pa);
    if (t < S('Q04')) label('?', gx(QG2, 3) + 40, gy(QG2, 9) - 30, 44, RED, pa * (0.6 + 0.4 * Math.sin(t * 6)), { font: F_MATH });
    if (t > S('Q04')) {
      const h = ap(t, 'Q04', 0.05, 0.5);
      gLine(QG2, 6, 3, 9, 2.1, 3.55, INV, h, 3.5);
      richReveal([['y′ = 2x', GRN], ['  →  2 × 3 = ', CR], ['6', GOLD]], CX, 400, 42, t, P('Q04', 0.15));
      checkMark(1240, 560, 52, GRN, t, P('Q04', 0.6)); kinetic('6', 1240, 650, 52, t, P('Q04', 0.65), { col: GRN, font: F_MATH, bold: false });
    }
  }
};

// ======================= outro：A45 “趋于”被放大、打问号 → 极限 =======================
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'G03', 0, 0.5) * 0.45, 82);
  const fa = fadeOut(t, S('D05'), 0.4);
  // G03：定义式，框出 Δx→0
  const parts = [['f′(x_0) = ', GRN], ['lim_{Δx→0}', GOLD], ['  Δy / Δx', CR]], sz = 60;
  if (fa > 0) {
    const w = parts.reduce((s, [p]) => s + mathW(p, sz), 0), x0 = CX - w / 2, wa = mathW(parts[0][0], sz), wb = mathW(parts[1][0], sz);
    richReveal(parts, CX, 360, sz, t, P('G03', 0.03), { alpha: fa, upright: true });
    const ba = ap(t, 'G03', 0.28, 0.3) * fa;
    if (ba > 0) {
      ctx.save(); ctx.globalAlpha *= ba; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 14 + 8 * Math.sin(t * 6); rr(x0 + wa - 12, 360 - sz * 0.95, wb + 24, sz * 1.65, 12); ctx.stroke(); ctx.restore();
      seg(x0 + wa + wb / 2, 360 + sz * 0.72, CX, 520, GOLD, 0.6 * ba * ap(t, 'G03', 0.4), 2.5, [6, 6]);
    }
  }
  // 放大的“趋于” + 问号
  const zt = P('G03', 0.45);
  if (t > zt) {
    const up = ap(t, 'D05', 0.0, 0.6), y = lerp(640, 300, up), s = lerp(150, 76, up), ga = fadeOut(t, S('C14') - 0.05, 0.35);
    if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga;
    if (t < S('D05')) kinetic('趋于', CX, 640, 150, t, zt, { col: GOLD, s0: 3 });
    else label('趋于', CX, y, s, GOLD, 1, { bold: true, glow: 18 });
    const qa = eBack(prog(t, P('G03', 0.72), 0.4)), qx = CX + lerp(170, 100, up), qy = y - lerp(10, 6, up) + Math.sin(t * 5) * 6;
    if (qa > 0) { ctx.save(); ctx.translate(qx, qy); ctx.scale(qa, qa); ctx.rotate(0.12); label('?', 0, 0, lerp(130, 66, up), RED, 1, { font: F_MATH, glow: 16 }); ctx.restore(); }
    ctx.restore(); }
    glowText('高中从来没定义过', CX, 820, 34, CR, t, P('G03', 0.82), { bold: false, out: S('D05') });
  }
  // D05：无限靠近？（点一步步逼近目标）
  const na = ap(t, 'D05', 0.1, 0.4) * fadeOut(t, P('C13', 0.45), 0.4);
  if (na > 0) {
    const y = 620, X0 = 680, XT = 1280;
    seg(X0 - 20, y, XT + 50, y, CR, 0.5 * na, 2.2);
    glowDot(XT, y, 10, GOLD, na); label('目标', XT, y + 42, 24, GOLD, na);
    const k = Math.floor(Math.max(0, t - P('D05', 0.15)) / 0.32);
    for (let j = 0; j <= Math.min(k, 9); j++) { const x = XT - (XT - X0) * Math.pow(0.5, j); glowDot(x, y, j === Math.min(k, 9) ? 9 : 5, CYAN, na * (j === Math.min(k, 9) ? 1 : 0.35)); }
    label('无限靠近？', CX, 470, 46, CR, na, { bold: true });
    if (t > S('C13')) stampMark(1190, 455, 60, t, P('C13', 0.1), { text: '直觉', rot: -0.2 });
  }
  // C13：极限
  if (t > P('C13', 0.45)) {
    const oa = fadeOut(t, S('C14') - 0.05, 0.4);
    if (oa > 0) {
      ctx.save(); ctx.globalAlpha *= oa;
      ctx.save(); ctx.translate(CX, 600); ctx.scale(1.7, 1.7); termCard('limit', '极限', 0, 0, t, P('C13', 0.5)); ctx.restore();
      glowText('把“趋于”说清楚 = 这一章的任务', CX, 790, 34, GOLD, t, P('C13', 0.7));
      ctx.restore();
    }
  }
  // C14：下一段
  if (t > S('C14') - 0.1) {
    glowText('下一段：极限是什么', CX, 520, 56, CR, t, P('C14', 0.15));
    glowText('limit · 记号 · 单侧极限 · 不存在的三种方式', CX, 610, 30, CYAN, t, P('C14', 0.4), { bold: false });
  }
  drawCredits(t);
};
function drawCredits(t) {
  const t0 = E('C14') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 2 章 · P1 高中速通：导数', 215, 34, GOLD, 0.08);
  T('下一段：极限是什么', 310, 52, CR, 0.28);
  T('素材与授权说明', 450, 28, CYAN, 0.56, B);
  T('Claude / GPT / 千问 形象：ZipZipPipe（Pixiv 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 505, 20, CR, 0.72, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 548, 20, CR, 0.94, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 591, 20, CR, 1.16, B);
  T('千问声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', 634, 20, CR, 1.38, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 677, 20, CR, 1.60, B);
  T('Claude、GPT、DeepSeek、通义千问 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 720, 20, CR, 1.82, B);
}

SC.__overlay = t => { if (t < E('C14') + 0.25) lecturer(t, 'C', 255, -5, E('C14') + 0.48, { h: 710 }); };
SC.__noTag = E('C14') + 0.30;
function drawFrame(t) { composeFrame(t, SC, t < E('C14') + 0.38 ? TITLES : null); }   // 片尾署名时不再叠块标题

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  // intro
  s('D01', 0.08, 'pop', 0.26); s('D01', 0.22, 'pop', 0.28); s('D01', 0.62, 'shimmer', 0.18);
  for (let k = 0; k < 4; k++) s('C01', 0.25 + 0.13 * k, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][k], 0.28);
  s('C01', 0.78, 'tick', 0.22);
  // rate
  s('C02', 0.1, 'swoosh_in', 0.22); s('C02', 0.35, 'swoosh_soft', 0.2);
  s('C03', 0.22, 'pop', 0.26); s('C03', 0.42, 'pop', 0.26); s('C03', 0.55, 'tick2', 0.2); s('C03', 0.78, 'type', 0.16); s('C03', 0.9, 'ding', 0.28);
  s('D02', 0.1, 'whoosh', 0.22); s('D02', 0.4, 'pluck', 0.22);
  // tangent
  s('C04', 0.1, 'type', 0.16); qT.forEach((f, i) => s('C04', f, ['tick', 'tick', 'tick2', 'tick2'][i], 0.22)); s('C04', 0.75, 'warp', 0.16);
  s('C05', 0.1, 'riser', 0.14); sfx(P('C05', 0.1) + 0.5, 'ding_hi', 0.32);
  s('G01', 0.05, 'swoosh_in', 0.22); s('G01', 0.4, 'pluck', 0.22);
  // table
  s('C06', 0.25, 'type', 0.16); s('C06', 0.5, 'buzz', 0.18);
  s('Q01', 0.0, 'swell', 0.22); s('Q01', 0.12, 'stamp', 0.32);
  for (let i = 0; i < 8; i++) sfx(rowT(i), ['marimba_lo', 'marimba', 'marimba', 'marimba_hi', 'marimba', 'marimba_hi', 'bell_soft', 'bell_soft'][i], 0.26);
  s('Q03', 0.5, 'tinkle', 0.3); s('Q03', 0.62, 'sparkle', 0.26); s('Q03', 0.8, 'tinkle', 0.22);
  s('D03', 0.15, 'sparkle', 0.28); s('D03', 0.3, 'pop', 0.24);
  // rules
  s('C07', 0.25, 'swoosh_in', 0.22); s('C08', 0.02, 'swoosh_in', 0.22); s('C08', 0.45, 'swoosh_in', 0.22);
  s('G02', 0.2, 'ding', 0.24); s('G02', 0.6, 'ding_lo', 0.24);
  s('C09', 0.05, 'type', 0.16); s('C09', 0.12, 'swoosh_soft', 0.2); s('C09', 0.5, 'warp', 0.16); s('C09', 0.75, 'soft_hit', 0.24);
  // quiz
  s('C10', 0.05, 'pop', 0.26);
  QUIZ_BEATS.forEach(b => countdownSfx(b.vo));
  s('D04', 0.6, 'check', 0.34); s('Q04', 0.6, 'check', 0.34);
  // outro
  s('G03', 0.03, 'type', 0.16); s('G03', 0.28, 'zap', 0.2); s('G03', 0.45, 'impact', 0.3); s('G03', 0.72, 'glitch', 0.2);
  s('D05', 0.15, 'tick', 0.18); s('C13', 0.1, 'stamp', 0.32); s('C13', 0.5, 'stamp', 0.3); s('C13', 0.7, 'bell_soft', 0.26);
  s('C14', 0.15, 'swell', 0.3);
})();
finalize();
