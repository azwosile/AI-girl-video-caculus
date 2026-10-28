// 第 4 章 P1《高中速通：单调、极值、最值》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A124 三关进度条 + 符号表逐格点亮 · A125 f′ 正负条带与曲线升降同步 · A126 三个“为什么？”盖章
const SC = {};
const TITLES = [['intro', '高中的套路'], ['gate1', '第一关 · 单调'], ['gate2', '第二关 · 极值'], ['gate3', '第三关 · 闭区间最值'], ['why', '三个为什么'], ['quiz', '随堂一题'], ['outro', '小结']];
const fF = x => x * x * x - 3 * x * x, dF = x => 3 * x * x - 6 * x;

// ---------- 三关进度条（A124） ----------
const GATES = [['单调', 'gate1'], ['极值', 'gate2'], ['最值', 'gate3']];
function gateBar(t, a) {
  if (a <= 0) return; const xs = [770, 990, 1210], y = 140;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(237,230,216,0.2)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(xs[0], y); ctx.lineTo(xs[2], y); ctx.stroke();
  const tt = [BK.gate1.t0, BK.gate2.t0, BK.gate3.t0, BK.gate3.t1];
  let fill = 0; for (let i = 0; i < 2; i++) fill += clamp((t - tt[i + 1] + 0.6) / 0.6);
  if (fill > 0) glowPath(() => { ctx.moveTo(xs[0], y); ctx.lineTo(lerp(xs[0], xs[2], fill / 2), y); }, GOLD, 6);
  GATES.forEach(([s], i) => {
    const on = t >= tt[i] + 0.1, done = t >= tt[i + 1] - 0.05, c = done ? GRN : on ? GOLD : '#3a4566';
    ctx.save(); ctx.fillStyle = 'rgba(12,18,38,0.95)'; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.shadowColor = c; ctx.shadowBlur = on ? 16 : 0;
    ctx.beginPath(); ctx.arc(xs[i], y, 26, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    label(String(i + 1), xs[i], y + 1, 26, c, 1, { font: F_MATH, bold: true });
    label(s, xs[i], y + 50, 24, on ? CR : hexA(CR, 0.45), 1, { bold: true, glow: on ? 8 : 0 });
    if (done) checkMark(xs[i] + 30, y - 24, 22, GRN, t, tt[i + 1] - 0.05);
  });
  ctx.restore();
}

// ---------- 图像与符号表（A125） ----------
const G12 = { cx: 778, cy: 365, ux: 106, uy: 46, x0: -1.3, x1: 3.4, y0: -5, y1: 2.5 };
const G3 = { cx: 672, cy: 731, ux: 106, uy: 29.5, x0: -0.3, x1: 4.4, y0: -5, y1: 17 };
const mixG = m => { const o = {}; for (const k in G12) o[k] = lerp(G12[k], G3[k], m); return o; };
const COLS = [[-0.75, '(−∞, 0)'], [0, '0'], [1, '(0, 2)'], [2, '2'], [2.8, '(2, +∞)']];
function signTable(t, G, a) {
  if (a <= 0) return; const ys = [660, 725, 800], hx = 628;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(237,230,216,0.35)'; ctx.lineWidth = 1.5;
  [ys[0] - 32, ys[1] - 32, ys[2] - 36, ys[2] + 38].forEach(y => { ctx.beginPath(); ctx.moveTo(600, y); ctx.lineTo(1140, y); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(656, ys[0] - 32); ctx.lineTo(656, ys[2] + 38); ctx.stroke(); ctx.restore();
  mathText('x', hx, ys[0] + 9, 28, CYAN, { align: 'center', alpha: a }); mathText("f'", hx, ys[1] + 9, 28, GRN, { align: 'center', alpha: a }); mathText('f', hx, ys[2] + 9, 28, RED, { align: 'center', alpha: a });
  COLS.forEach(([x, s], i) => mathText(s, gx(G, x), ys[0] + 8, 22, CYAN, { align: 'center', alpha: a, upright: true }));
  // f′ 行：K02 逐格点亮
  const fs = ['+', '0', '−', '0', '+'], kf = [0.3, 0.12, 0.5, 0.12, 0.7];
  COLS.forEach(([x], i) => { const p = ap(t, 'K02', kf[i]); if (p > 0) mathText(fs[i], gx(G, x), ys[1] + 10, 32, fs[i] === '−' ? RED : GRN, { align: 'center', alpha: a * p, upright: true, glow: 10 }); });
  // f 行：箭头（K02 末）+ 极值（K03）
  [[0, '↗'], [2, '↘'], [4, '↗']].forEach(([i, s]) => { const p = ap(t, 'K02', 0.85); if (p > 0) label(s, gx(G, COLS[i][0]), ys[2], 34, i === 2 ? RED : GRN, a * p, { font: F_MATH, bold: true }); });
  [[1, '极大 0', GOLD, 0.15], [3, '极小 −4', CYAN, 0.6]].forEach(([i, s, c, f]) => { const p = ap(t, 'K03', f); if (p > 0) label(s, gx(G, COLS[i][0]), ys[2], 22, c, a * p, { bold: true }); });
}
function view(t) {
  starfield(t); blueprint(0.4, 80);
  gateBar(t, ap(t, 'C01', 0.1));
  // intro：Kimi 的四步套路
  if (t < BK.gate1.t0 + 0.4) {
    const fa = fadeOut(t, BK.gate1.t0 - 0.1, 0.4);
    [['求导', CYAN], ['令导数为零', GRN], ['列表', GOLD], ['比较', RED]].forEach(([s, c], i) => {
      const x = 700 + i * 200; ctx.save(); ctx.globalAlpha *= fa; slab(s, x, 520, 30, t, P('K01', 0.42 + 0.13 * i), { bg: c, c: COL.ink, rot: i % 2 ? 0.05 : -0.05 }); ctx.restore();
      if (i < 3 && t > P('K01', 0.48 + 0.13 * i)) arrowH(x + 70, x + 120, 600, CR, fa * 0.7);
    });
    if (t > S('K01')) glowText('Kimi 的高中笔记（三年，一次读完）', CX, 380, 30, SQ.K.col, t, P('K01', 0.05), { bold: false, out: BK.gate1.t0 - 0.2 });
    return;
  }
  const m = eIO(prog(t, S('C06') - 0.2, 0.9)), G = mixG(m), a = ap(t, 'C03', 0.05);
  const ticks = m < 0.5 ? { x: [[2, '2']] } : { x: [[1, '1'], [2, '2'], [4, '4']], y: [[16, '16'], [-4, '−4']] };
  gAxes(G, a, { grid: false, ticks, xl: 'x', yl: 'y' });
  // C03：一般规律
  if (t < S('C04') + 0.2) { const r = ap(t, 'C03', 0.2) * fadeOut(t, S('C04'), 0.3); panel(890, 210, 400, 120, GRN, r); richReveal([["f' > 0  ↗ 上升", GRN]], 1090, 250, 30, t, P('C03', 0.25), { upright: true }); richReveal([["f' < 0  ↘ 下降", RED]], 1090, 300, 30, t, P('C03', 0.6), { upright: true }); }
  // C04：函数与导数
  if (t > S('C04') - 0.1) {
    const fa = fadeOut(t, S('C06'), 0.3);
    richReveal([['f(x) = x^3 − 3x^2', RED]], 1150, 230, 32, t, P('C04', 0.1), { upright: true, alpha: fa });
    richReveal([["f'(x) = 3x(x − 2)", GRN]], 1150, 285, 32, t, P('C04', 0.55), { upright: true, alpha: fa });
  }
  // f′ 正负条带（K02）
  const ba = ap(t, 'K02', 0.1) * (1 - m);
  if (ba > 0) { const y0 = gy(G, 0); [[G.x0, 0, GRN], [0, 2, RED], [2, G.x1, GRN]].forEach(([xa, xb, c], i) => { const p = ap(t, 'K02', 0.3 + 0.2 * i); if (p > 0) { ctx.save(); ctx.globalAlpha *= ba * p * 0.28; ctx.fillStyle = c; ctx.fillRect(gx(G, xa), y0 - 8, (xb - xa) * G.ux, 16); ctx.restore(); } }); }
  // 曲线
  gPlot(G, fF, RED, { a, p: eIO(prog(t, P('C04', 0.1), 1.2)) });
  if (t > P('K02', 0.05)) { const z = ap(t, 'K02', 0.05); gDot(G, 0, 0, CYAN, z * (1 - m)); gDot(G, 2, 0, CYAN, z * (1 - m)); }
  signTable(t, G, ap(t, 'K02', 0) * fadeOut(t, S('C06') - 0.2, 0.4));
  // 第二关：极值点
  if (t > S('C05')) {
    const ea = ap(t, 'C05', 0.3);
    if (t < S('K03')) { richReveal([["f' = 0  且两侧变号", GOLD]], 1150, 340, 30, t, P('C05', 0.3), { upright: true, alpha: fadeOut(t, S('C06'), 0.3) }); }
    const p1 = ap(t, 'K03', 0.15), p2 = ap(t, 'K03', 0.6);
    if (p1 > 0) { gDot(G, 0, 0, GOLD, p1); label('极大', gx(G, 0), gy(G, 0) - 36, 22, GOLD, p1 * (1 - m), { bold: true }); }
    if (p2 > 0) { gDot(G, 2, -4, CYAN, p2); label('极小', gx(G, 2) + 46, gy(G, -4) + 4, 22, CYAN, p2 * (1 - m), { bold: true }); }
    if (ea > 0 && t < S('K03')) { burst(t, P('C05', 0.4), gx(G, 0), gy(G, 0), GOLD, 60, 8); }
  }
  // 第三关：闭区间 [1, 4]
  if (t > S('C06') - 0.1) {
    const c = ap(t, 'C06', 0.5);
    gBand(G, 1, 4, G.y0, G.y1, 'rgba(255,210,90,0.07)', c); gV(G, 1, GOLD, c * 0.6, { dash: [6, 6] }); gV(G, 4, GOLD, c * 0.6, { dash: [6, 6] });
    label('[1, 4]', gx(G, 2.5), gy(G, 16) - 10, 28, GOLD, c, { font: F_MATH, bold: true });
    const vals = [[1, -2, '端点', 0.1], [2, -4, '极小', 0.35], [4, 16, '端点', 0.6]];
    panel(1170, 300, 185, 250, GOLD, ap(t, 'K04', 0));
    vals.forEach(([x, y, k, f], i) => {
      const p = ap(t, 'K04', f); if (p <= 0) return; gDot(G, x, y, x === 2 ? CYAN : GOLD, p);
      mathText(`f(${x}) = ${y < 0 ? '−' + (-y) : y}`, 1262, 352 + i * 62, 28, CR, { align: 'center', alpha: p, upright: true });
      label(k, 1262, 378 + i * 62, 18, hexA(CR, 0.6), p);
    });
    const mx = ap(t, 'K04', 0.82); if (mx > 0) { label('最大 16', 1262, 525, 24, GOLD, mx, { bold: true }); }
    if (t > S('D01')) { burst(t, P('D01', 0.1), gx(G, 4), gy(G, 16), GOLD, 90, 12); stampMark(gx(G, 4) - 90, gy(G, 16) + 70, 48, t, P('D01', 0.2), { text: '端点', col: GOLD }); }
    if (t > S('C07')) glowText('最值 = 比较“极值 + 端点值”', 900, 930, 30, GOLD, t, P('C07', 0.2));
  }
}
SC.intro = view; SC.gate1 = view; SC.gate2 = view; SC.gate3 = view;

// ======================= 三个为什么（A126） =======================
const WHY = [['最值一定存在吗？', 0.12, '下一段'], ['极值点的导数为什么是 0？', 0.4, '下一段'], ["f' > 0 凭什么就单调？", 0.72, '中值定理']];
SC.why = t => {
  starfield(t); blueprint(0.4, 80);
  glowText('高中没讲的三个“为什么”', CX, 190, 38, CR, t, P('G01', 0.2));
  WHY.forEach(([q, f, tag], i) => {
    const y = 330 + i * 165, p = ap(t, 'G02', f); if (p <= 0) return;
    panel(620, y - 55, 720, 110, SQ.G.col, p); circleNum(i + 1, 675, y, 28, SQ.G.col, t, P('G02', f));
    richReveal([[q, CR]], 725, y + 10, 32, t, P('G02', f + 0.03), { align: 'left', upright: true });
    stampMark(1255, y, 46, t, P('G02', f + 0.12), { text: '为什么', col: COL.red });
    if (t > S('C08')) slab(tag, 1170, y - 52, 22, t, P('C08', i < 2 ? 0.3 + 0.1 * i : 0.7), { bg: i < 2 ? GOLD : SEC, c: COL.ink, rot: 0.04 });
  });
};

// ======================= 随堂 =======================
const GQ = { cx: 900, cy: 600, ux: 120, uy: 60, x0: -2.2, x1: 2.2, y0: -3, y1: 3 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['f(x) = x^3 − 3x', RED], ['，极大值 = ?', CR]], 900, 240, 40, t, P('C10', 0.1), { upright: true });
  if (t > S('D02')) {
    const a = ap(t, 'D02', 0);
    gAxes(GQ, a, { grid: false, ticks: { x: [[-1, '−1'], [1, '1']], y: [[2, '2']] } });
    gPlot(GQ, x => x * x * x - 3 * x, RED, { a, p: eIO(prog(t, P('D02', 0.05), 1)) });
    richReveal([["f'(x) = 3x^2 − 3", GRN]], 900, 310, 30, t, P('D02', 0.1), { upright: true });
    const p = ap(t, 'D02', 0.75); gDot(GQ, -1, 2, GOLD, p); gDot(GQ, 1, -2, CYAN, p * 0.6);
    if (p > 0) { label('极大值 2', gx(GQ, -1), gy(GQ, 2) - 34, 26, GOLD, p, { bold: true }); burst(t, P('D02', 0.75), gx(GQ, -1), gy(GQ, 2), GOLD, 80, 10); }
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) {
    gateBar(BK.gate3.t1 + 1, ga);
    [['求导', CYAN], ['找零点', GRN], ['列表', GOLD], ['比较', RED]].forEach(([s, c], i) => { ctx.save(); ctx.globalAlpha *= ga; slab(s, 700 + i * 200, 480, 30, t, P('C11', 0.2 + 0.12 * i), { bg: c, c: COL.ink, rot: 0 }); ctx.restore(); });
  }
  if (t > S('C12') - 0.1) { glowText('下一段：极值与最值（含最值定理）', CX, 500, 50, CR, t, P('C12', 0.15)); glowText('GLM 客串', CX, 590, 32, SQ.Z.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 4 章 · P1 高中速通', '下一段：极值与最值', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM4('Kimi')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'swoosh_in', 0.2); [0.42, 0.55, 0.68, 0.81].forEach(f => s('K01', f, 'pop', 0.22));
  [BK.gate1.t0, BK.gate2.t0, BK.gate3.t0].forEach(x => sfx(x + 0.1, 'ding', 0.22)); [BK.gate1.t1, BK.gate2.t1, BK.gate3.t1].forEach(x => sfx(x - 0.05, 'check', 0.22));
  s('C03', 0.25, 'pluck', 0.2); s('C03', 0.6, 'pluck', 0.2); s('C04', 0.1, 'type', 0.16); s('C04', 0.55, 'type', 0.16);
  [0.12, 0.3, 0.5, 0.7].forEach(f => s('K02', f, 'marimba', 0.2)); s('K02', 0.85, 'shimmer', 0.16);
  s('C05', 0.4, 'sparkle', 0.2); s('K03', 0.15, 'ding_hi', 0.24); s('K03', 0.6, 'ding_lo', 0.24);
  s('C06', 0.2, 'warp', 0.16); [0.1, 0.35, 0.6].forEach(f => s('K04', f, 'pop', 0.22)); s('K04', 0.82, 'ding_hi', 0.26); s('D01', 0.2, 'stamp', 0.3); s('C07', 0.2, 'shimmer', 0.18);
  WHY.forEach(([, f]) => { s('G02', f, 'pop', 0.22); s('G02', f + 0.12, 'stamp', 0.28); }); [0.3, 0.4, 0.7].forEach(f => s('C08', f, 'slap', 0.18));
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.75, 'ding_hi', 0.3);
  [0.2, 0.32, 0.44, 0.56].forEach(f => s('C11', f, 'pop', 0.2)); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
