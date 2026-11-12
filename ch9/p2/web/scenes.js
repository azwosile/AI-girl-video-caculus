// 第 9 章 P2《方向场》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.2 例 1。
// A389 风向图 → 方向场逐列扫出 · A390 y′ = x² + y² − 1：等斜线单位圆 + 过原点的解曲线 · A391 排队方程的方向场与平衡解 N = 300
const SC = {};
const TITLES = [['field', '方向场'], ['ex', '例 1'], ['queue', '排队的方向场'], ['quiz', '随堂一题'], ['outro', '小结']];

const F2 = (x, y) => x * x + y * y - 1;
const GS2 = { cx: 880, cy: 530, ux: 125, uy: 125, x0: -2.2, x1: 2.2, y0: -2.1, y1: 2.1 };
const FQ2 = (t, N) => 30 - 0.1 * N;
const GQ2 = { cx: 610, cy: 800, ux: 15, uy: 1.15, x0: 0, x1: 40, y0: 0, y1: 460 };
function unitCircle2(a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(GS2.cx, GS2.cy, GS2.ux, 0, 7); ctx.stroke(); ctx.restore(); }

// ======================= 方向场（A389） =======================
SC.field = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'M01', 0.05);
  gAxes(GS2, a * 0.6, { grid: false });
  if (t < S('C02')) {   // 风向图：几支飘动的小箭头
    for (let i = 0; i < 14; i++) { const x = -2 + 4 * rnd(i * 5 + 1), y = -1.9 + 3.8 * rnd(i * 5 + 2), m = F2(x, y), ang = Math.atan2(m, 1) + 0.08 * Math.sin(t * 3 + i);
      const X = gx(GS2, x), Y = gy(GS2, y), k = ap(t, 'M01', 0.2 + 0.03 * i); arrow(X - 22 * Math.cos(ang), Y + 22 * Math.sin(ang), X + 22 * Math.cos(ang), Y - 22 * Math.sin(ang), SQ.M.col, k, 3); }
  }
  if (t > S('C01')) { richReveal([["y′ = F(x, y)", GOLD], ['  = 每一点的斜率', CR]], 870, 230, 34, t, P('C01', 0.15), { upright: true });
    if (t < S('C02') + 0.4) { const X = gx(GS2, 1), Y = gy(GS2, 1); glowDot(X, Y, 8, GOLD, ap(t, 'C01', 0.5)); seg(X - 30, Y + 30 * 0.8, X + 30, Y - 30 * 0.8, GOLD, ap(t, 'C01', 0.5), 4); } }
  if (t > S('C02')) slopeField(GS2, F2, ap(t, 'C02', 0), { sx: 0.4, sy: 0.4, p: prog(t, P('C02', 0.1), 1.6), len: 34 });
};

// ======================= 例 1（A390） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  gAxes(GS2, 0.6, { grid: false });
  const hi = t > S('C04') ? (x, y) => Math.abs(F2(x, y)) < 0.17 : null;
  slopeField(GS2, F2, 1, { sx: 0.4, sy: 0.4, len: 34, hi, dim: t > S('M02') ? 0.55 : 1 });
  richReveal([["y′ = ", CR], ['x² + y² − 1', GOLD]], 870, 230, 36, t, P('C03', 0.1), { upright: true });
  if (t > S('C04')) { unitCircle2(ap(t, 'C04', 0.2)); label('斜率 0', gx(GS2, 0.75) + 50, gy(GS2, 0.75) - 26, 26, GOLD, ap(t, 'C04', 0.3), { bold: true }); }
  if (t > S('M02')) solCurve(GS2, F2, 0, 0, SQ.M.col, { a: ap(t, 'M02', 0.1), w: 5, p: prog(t, P('M02', 0.2), 1.6), xa: -2.2, xb: 2.2, n: 300 });
  if (t > S('G01')) label('先降、过圆后上翘', gx(GS2, 1.4), gy(GS2, -1.7), 28, SQ.M.col, ap(t, 'G01', 0.3), { bold: true });
};

// ======================= 排队的方向场（A391） =======================
SC.queue = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0.05);
  gAxes(GQ2, a * 0.75, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30'], [40, '40']], y: [[100, '100'], [200, '200'], [300, '300'], [400, '400']] } });
  label('t', gx(GQ2, 40) + 20, GQ2.cy + 30, 24, CR, a); label('N', gx(GQ2, 0) - 30, gy(GQ2, 450), 26, CR, a, { bold: true });
  const hi = t > S('C06') ? (x, y) => (y < 300 && y > 0) : null;
  slopeField(GQ2, FQ2, a, { sx: 4, sy: 50, len: 30, p: prog(t, P('C05', 0.2), 1.2), hi: t > S('C06') && t < S('D01') ? hi : null, hiCol: CYAN });
  richReveal([['dN/dt = 30 − 0.1N', GOLD]], 960, 230, 34, t, P('C05', 0.1), { upright: true });
  if (t > S('C06')) { label('N < 300：往上', 1040, gy(GQ2, 120), 26, CYAN, ap(t, 'C06', 0.1), { bold: true }); label('N > 300：往下', 1040, gy(GQ2, 420), 26, RED, ap(t, 'C06', 0.5), { bold: true }); }
  if (t > S('D01')) {
    gH(GQ2, 300, GOLD, ap(t, 'D01', 0.1), { w: 5 }); label('N = 300', gx(GQ2, 33), gy(GQ2, 300) - 24, 28, GOLD, ap(t, 'D01', 0.2), { bold: true });
    [0, 120, 450].forEach((n0, i) => solCurve(GQ2, FQ2, 0, n0, SQ.D.col, { a: ap(t, 'D01', 0.35 + 0.1 * i), w: 3.5, p: prog(t, P('D01', 0.35 + 0.1 * i), 1.2), xa: 0, glow: 6 }));
  }
  if (t > S('C07')) stampMark(1130, 340, 44, t, P('C07', 0.2), { text: '平衡解', col: GOLD, rot: -0.12 });
};

// ======================= 随堂 =======================
const FQ = (x, y) => x + y, GQZ2 = { cx: 820, cy: 560, ux: 110, uy: 110, x0: -2, x1: 2, y0: -1.8, y1: 1.8 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([["y′ = x + y", GOLD], ['，在 (1, 1) 处斜率 = ？', CR]], 860, 250, 36, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.3); gAxes(GQZ2, a * 0.6, { grid: false }); slopeField(GQZ2, FQ, a * 0.6, { sx: 0.4, sy: 0.4, len: 28 });
  gDot(GQZ2, 1, 1, GOLD, a);
  if (t > S('D02')) { const X = gx(GQZ2, 1), Y = gy(GQZ2, 1), k = ap(t, 'D02', 0.1); seg(X - 30, Y + 60, X + 30, Y - 60, GOLD, k, 5); label('斜率 = 1 + 1 = 2', 1080, 420, 32, GOLD, k, { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { richReveal([['方向场：先看 ', CR], ['走向', GOLD], [' 和 ', CR], ['平衡', CYAN]], CX, 400, 46, t, P('C10', 0.05), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：欧拉法', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('Llama 一步一步走', CX, 610, 32, SQ.L.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P2 方向场', '下一段：欧拉法', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM9('Gemini')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.05, 'whoosh', 0.16); s('M01', 0.2, 'sparkle', 0.14); s('C01', 0.15, 'pop', 0.18); s('C01', 0.5, 'tick', 0.18); s('C02', 0.1, 'riser', 0.14);
  s('C03', 0.1, 'pop', 0.18); s('C04', 0.2, 'shimmer', 0.18); s('M02', 0.2, 'swell', 0.14); s('G01', 0.3, 'pop', 0.16);
  s('C05', 0.1, 'pop', 0.18); s('C05', 0.2, 'riser', 0.12); s('C06', 0.1, 'tick', 0.16); s('C06', 0.5, 'tick', 0.16); s('D01', 0.1, 'ding', 0.22); s('D01', 0.35, 'whoosh', 0.14); s('C07', 0.2, 'stamp', 0.26);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
