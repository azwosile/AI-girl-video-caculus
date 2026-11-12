// 第 8 章 P2《弧长函数与弧长比赛》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A344 弧长函数：动点量长度 · A345 弧长比赛三选手 · A346 尖角费长度、抛物线夺冠
const SC = {};
const TITLES = [['func', '弧长函数'], ['race', '弧长比赛'], ['quiz', '随堂一题'], ['outro', '小结']];

const FF2 = x => x * x - Math.log(x) / 8, SF2 = x => x * x + Math.log(x) / 8 - 1;
const GF2 = { cx: 620, cy: 820, ux: 220, uy: 78, x0: 0, x1: 2.3, y0: 0, y1: 4.8 };
function arcRun2(G, xa, xb, col, a, w = 7) {   // 把 [xa, xb] 一段曲线描成粗亮线
  if (a <= 0 || xb <= xa) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 14;
  ctx.beginPath(); for (let i = 0; i <= 80; i++) { const x = xa + (xb - xa) * i / 80; ctx[i ? 'lineTo' : 'moveTo'](gx(G, x), gy(G, FF2(x))); } ctx.stroke(); ctx.restore();
}

// ======================= 弧长函数（A344） =======================
SC.func = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C01', 0.1);
  gAxes(GF2, a * 0.7, { grid: false, ticks: { x: [[1, '1'], [2, '2']] } });
  gPlot(GF2, FF2, CYAN, { a, xa: 0.22, xb: 2.2, w: 3 });
  const xe = 1 + clamp((t - P('C01', 0.3)) / 4.5);   // 动点从 1 走到 2
  arcRun2(GF2, 1, xe, GOLD, a); gDot(GF2, 1, FF2(1), CR, a); gDot(GF2, xe, FF2(xe), GOLD, a);
  if (t < S('G01')) richReveal([['s(x) = ', CR], ['∫ₐˣ √(1 + f′(t)²) dt', GOLD]], 870, 250, 34, t, P('C01', 0.2), { upright: true });
  if (t > S('C02') && t < S('G01')) {
    richReveal([['ds² = dx² + dy²', CYAN]], 870, 320, 32, t, P('C02', 0.4), { upright: true });
    const x0 = 1.45, x1 = 1.75, q = ap(t, 'C02', 0.3), X0 = gx(GF2, x0), X1 = gx(GF2, x1), Y0 = gy(GF2, FF2(x0)), Y1 = gy(GF2, FF2(x1));
    seg(X0, Y0, X1, Y0, CR, q, 2, [6, 5]); seg(X1, Y0, X1, Y1, CR, q, 2, [6, 5]);
    mathText('dx', (X0 + X1) / 2 - 12, Y0 + 28, 24, CR, { alpha: q }); mathText('dy', X1 + 10, (Y0 + Y1) / 2 + 8, 24, CR, { alpha: q }); mathText('ds', (X0 + X1) / 2 - 44, (Y0 + Y1) / 2, 26, GOLD, { alpha: q });
  }
  if (t > S('G01')) richReveal([['y = x² − ⅛ ln x', CYAN], ['，从 x = 1 量起', CR]], 870, 250, 32, t, P('G01', 0.15), { upright: true });
  if (t > S('G02')) richReveal([['1 + y′² = ', CR], ['(2x + 1/(8x))²', GOLD]], 870, 315, 32, t, P('G02', 0.2), { upright: true });
  if (t > S('C03')) goldBox(870, 385, 480, 60, 's(x) = x² + ⅛ ln x − 1', 32, ap(t, 'C03', 0.2));
  if (t > P('C01', 0.3)) mathText(`s ≈ ${SF2(xe).toFixed(2)}`, gx(GF2, xe) + 16, gy(GF2, FF2(xe)) + 6, 26, GOLD, { alpha: a, upright: true });
};

// ======================= 弧长比赛（A345–A346） =======================
const GR2 = { cx: 640, cy: 810, ux: 480, uy: 170, x0: 0, x1: 1.12, y0: 0, y1: 2.2 };
const RACE2 = [
  ['① 三角形（高 2）', '√17 ≈ 4.12', RED, x => (x < 0.5 ? 4 * x : 4 - 4 * x), 'X02'],
  ['② 正弦 (π/2) sin πx', '≈ 3.37', SQ.M.col, x => Math.PI / 2 * Math.sin(Math.PI * x), 'X03'],
  ['③ 抛物线 6x(1 − x)', '≈ 3.25', GOLD, x => 6 * x * (1 - x), 'X04'],
];
SC.race = t => {
  starfield(t); blueprint(0.35, 80);
  ringBanner(870, 225, '弧长比赛', t, P('X01', 0.05), { w: 300, size: 32 });
  const a = ap(t, 'X01', 0.3); gAxes(GR2, a * 0.7, { grid: false, ticks: { x: [[1, '1']] } });
  if (t < S('X02')) { RACE2.forEach(([, , c, f], k) => gBetween(GR2, f, () => 0, 0, 1, a * 0.5, { col: hexA(c, 0.12) })); label('面积都是 1', 880, 700, 30, CR, ap(t, 'X01', 0.6), { bold: true }); }
  RACE2.forEach(([n, len, c, f, id], k) => {
    if (t < S(id)) return; const q = ap(t, id, 0.1);
    gPlot(GR2, f, c, { a: q, xa: 0, xb: 1, w: k === 2 && t > S('X05') ? 7 : 4, p: prog(t, P(id, 0.1), 0.8) });
    richReveal([[n + '  ', c], [len, CR]], 780, 300 + k * 40, 24, t, P(id, 0.45), { upright: true, align: 'left' });
  });
  if (t > S('C04')) { const q = ap(t, 'C04', 0.1) * fadeOut(t, S('X05'), 0.4); [[0.5, 2], [0, 0], [1, 0]].forEach(([x, y]) => { ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(gx(GR2, x), gy(GR2, y), 26, 0, 7); ctx.stroke(); ctx.restore(); }); label('尖角费长度', 1210, 600, 30, RED, q, { bold: true }); }
  if (t > S('X05')) { checkMark(1150, 372, 14, GRN, t, P('X05', 0.4)); stampMark(gx(GR2, 0.5), gy(GR2, 0.75), 56, t, P('X05', 0.55), { text: '夺冠', col: GOLD, rot: -0.12 }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['s(x) = x² + ⅛ ln x − 1，', CR], ['从 1 到 2 = ？', GOLD]], 860, 260, 36, t, P('C06', 0.05), { upright: true });
  const a = ap(t, 'C06', 0.3); gAxes(GF2, a * 0.7, { grid: false, ticks: { x: [[1, '1'], [2, '2']] } }); gPlot(GF2, FF2, CYAN, { a, xa: 0.22, xb: 2.2, w: 3 }); arcRun2(GF2, 1, 2, GOLD, a);
  if (t > S('D02')) richReveal([['s(2) = 3 + ⅛ ln 2 ≈ ', CR], ['3.09', GOLD]], 860, 340, 36, t, P('D02', 0.1), { upright: true });
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) { richReveal([['s(x) = ∫ₐˣ √(1 + f′²) dt', GOLD]], CX, 360, 44, t, P('C07', 0.05), { upright: true, alpha: ga }); richReveal([['算不出原函数  →  ', CR], ['数值积分', CYAN]], CX, 460, 40, t, P('C07', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C08') - 0.1) { glowText('下一段：参数方程的弧长', CX, 520, 50, CR, t, P('C08', 0.15)); glowText('Mistral 的车轮', CX, 610, 32, SQ.R.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 8 章 · P2 弧长比赛', '下一段：摆线', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM8('Grok')]);
};

SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.2, 'pop', 0.18); s('C01', 0.3, 'riser', 0.12); s('C02', 0.3, 'zap', 0.14); s('G01', 0.15, 'pop', 0.18); s('G02', 0.2, 'shimmer', 0.18); s('C03', 0.2, 'ding', 0.22);
  s('X01', 0.05, 'slam', 0.3); s('X02', 0.1, 'whoosh', 0.16); s('X02', 0.45, 'pop', 0.18); s('X03', 0.1, 'whoosh', 0.16); s('X03', 0.45, 'pop', 0.18); s('X04', 0.1, 'whoosh', 0.16); s('X04', 0.45, 'pop', 0.18);
  s('C04', 0.1, 'buzz', 0.16); s('X05', 0.4, 'check', 0.24); s('X05', 0.55, 'stamp', 0.3);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'ding_hi', 0.28);
  s('C07', 0.05, 'pop', 0.2); s('C07', 0.5, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
