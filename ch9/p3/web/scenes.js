// 第 9 章 P3《欧拉法》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.2 例 3。
// A392 沿切线走一步、再看斜率（h = 0.5 大步演示） · A393 例 3 放大：1.1、1.22、1.362 对 1.3997 · A394 误差随步长减半 + 排队方程走 40 步逼近 300
const SC = {};
const TITLES = [['idea', '一步一步走'], ['ex', '例 3'], ['err', '误差与排队'], ['quiz', '随堂一题'], ['outro', '小结']];

const F3 = (x, y) => x + y, Y3 = x => 2 * Math.exp(x) - x - 1;
const GE3 = { cx: 620, cy: 790, ux: 400, uy: 75, x0: 0, x1: 1.5, y0: 0, y1: 6.7 };
const GZ3 = { cx: 640, cy: 1640, ux: 1700, uy: 900, x0: 0, x1: 0.3, y0: 0.95, y1: 1.45 };
const GQ3 = { cx: 620, cy: 800, ux: 14, uy: 1.4, x0: 0, x1: 42, y0: 0, y1: 340 };
function axesE3(a) { gAxes(GE3, a * 0.7, { grid: false, ticks: { x: [[0.5, '0.5'], [1, '1'], [1.5, '1.5']], y: [[2, '2'], [4, '4'], [6, '6']] } }); }

// ======================= 一步一步走（A392） =======================
SC.idea = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'L01', 0.05); axesE3(a);
  slopeField(GE3, F3, a * 0.35, { sx: 0.15, sy: 0.6, len: 26 });
  gPlot(GE3, Y3, CR, { a: a * 0.6, w: 3, dash: [10, 8] }); label('真解', gx(GE3, 1.42), gy(GE3, Y3(1.42)) - 26, 24, CR, a * 0.7);
  const k = t < S('L01') ? 0 : clamp((t - P('L01', 0.4)) / 1.2) + clamp((t - P('C01', 0.2)) / 1.2) * 2;
  eulerPath(GE3, F3, 0, 1, 0.5, 3, k, SQ.L.col, a, { w: 5 });
  if (t > S('C02')) goldBox(1000, 260, 520, 70, 'yₙ₊₁ = yₙ + h · F(xₙ, yₙ)', 32, ap(t, 'C02', 0.2));
  if (t > S('G01')) label('= 第 4 章线性近似，一段段接起来', 1000, 340, 26, CYAN, ap(t, 'G01', 0.2), { bold: true });
};

// ======================= 例 3（A393） =======================
const LAB3 = [null, '1.1', '1.22', '1.362'];
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0.05);
  gAxes(GZ3, a * 0.7, { grid: false, ticks: { x: [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3']], y: [[1, '1'], [1.2, '1.2'], [1.4, '1.4']] } });
  richReveal([["y′ = x + y，y(0) = 1，", CR], ['h = 0.1', GOLD]], 900, 240, 32, t, P('C03', 0.1), { upright: true });
  gPlot(GZ3, Y3, CR, { a: a * 0.6, w: 3, dash: [10, 8], xa: 0, xb: 0.3 });
  const k = (t > S('C04') ? clamp((t - P('C04', 0.4)) / 0.8) : 0) + (t > S('L02') ? clamp((t - P('L02', 0.4)) / 0.8) : 0) + (t > S('C05') ? clamp((t - P('C05', 0.1)) / 0.8) : 0);
  eulerPath(GZ3, F3, 0, 1, 0.1, 3, k, SQ.L.col, a, { w: 5, labels: LAB3, lx: 0, ly: 34, ls: 26 });
  if (t > S('C05')) { gDot(GZ3, 0.3, Y3(0.3), CR, ap(t, 'C05', 0.5)); label('1.3997', gx(GZ3, 0.3) - 60, gy(GZ3, Y3(0.3)) - 24, 26, CR, ap(t, 'C05', 0.5), { bold: true }); }
  if (t > S('G02')) { label('曲线上弯 → 切线在下方 → 偏低', 900, 310, 28, GOLD, ap(t, 'G02', 0.2), { bold: true }); }
};

// ======================= 误差与排队（A394） =======================
const ERR3 = [['h = 0.1', '误差 0.038'], ['h = 0.05', '误差 0.020'], ['h = 0.025', '误差 0.010']];
SC.err = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C06', 0) * fadeOut(t, S('D01'), 0.4);
  if (ga > 0) { label('x = 0.3 处的误差', 870, 260, 34, CR, ga, { bold: true });
    ERR3.forEach(([h, e], i) => { const k = ap(t, 'C06', 0.1 + 0.18 * i) * ga; panel(600, 320 + i * 100, 540, 80, i ? CYAN : GOLD, k); label(h, 720, 360 + i * 100, 30, CR, k, { bold: true }); label(e, 980, 360 + i * 100, 30, GOLD, k, { bold: true }); });
    label('步长减半 → 误差约减半', 870, 650, 32, CYAN, ap(t, 'C06', 0.7) * ga, { bold: true }); }
  if (t > S('D01') - 0.1) {
    const a = ap(t, 'D01', 0);
    gAxes(GQ3, a * 0.75, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30'], [40, '40']], y: [[100, '100'], [200, '200'], [300, '300']] } });
    label('t（分钟）', gx(GQ3, 42) - 10, GQ3.cy + 40, 22, CR, a * 0.8); label('N', gx(GQ3, 0) - 30, gy(GQ3, 330), 26, CR, a, { bold: true });
    richReveal([['Nₙ₊₁ = Nₙ + 1 × (30 − 0.1Nₙ)', GOLD]], 960, 240, 30, t, P('D01', 0.1), { upright: true });
    const k = clamp((t - P('D01', 0.3)) / 4) * 40;
    eulerPath(GQ3, (x, N) => 30 - 0.1 * N, 0, 0, 1, 40, k, SQ.D.col, a, { w: 3.5, labels: { 1: '30', 2: '57', 3: '81', 10: '195' }, ls: 22, lx: 26, ly: 10 });
    if (t > S('C07')) { gH(GQ3, 300, GOLD, ap(t, 'C07', 0.1), { w: 3, dash: [12, 8] }); label('→ 300', gx(GQ3, 40) + 10, gy(GQ3, 300) - 26, 28, GOLD, ap(t, 'C07', 0.2), { bold: true }); }
  }
};

// ======================= 随堂 =======================
const GQZ3 = { cx: 640, cy: 760, ux: 900, uy: 300, x0: 0, x1: 0.6, y0: 0, y1: 1.8 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([["y′ = y，y(0) = 1，h = 0.5：", CR], ['y(0.5) ≈ ？', GOLD]], 860, 250, 34, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.3); gAxes(GQZ3, a * 0.6, { grid: false, ticks: { x: [[0.5, '0.5']], y: [[1, '1'], [1.5, '1.5']] } });
  gPlot(GQZ3, x => Math.exp(x), CR, { a: a * 0.5, w: 3, dash: [10, 8] }); gDot(GQZ3, 0, 1, SQ.L.col, a);
  if (t > S('D02')) { eulerPath(GQZ3, (x, y) => y, 0, 1, 0.5, 1, clamp((t - P('D02', 0.05)) / 0.6), SQ.L.col, 1, { w: 5, labels: [null, '1.5'], lx: 40, ly: 0, ls: 30 }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { richReveal([['欧拉法 = ', CR], ['方向场的数值版', GOLD]], CX, 360, 46, t, P('C10', 0.05), { upright: true, alpha: ga }); richReveal([['一小步一小步 ', CR], ['走切线', CYAN]], CX, 450, 40, t, P('C10', 0.45), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：可分离变量方程', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('GLM 把书分两摞', CX, 610, 32, SQ.Z.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P3 欧拉法', '下一段：分离变量', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM9('Llama')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('L01', 0.4, 'pluck', 0.18); s('C01', 0.2, 'pluck', 0.18); s('C01', 0.35, 'pluck', 0.18); s('C02', 0.2, 'ding', 0.22); s('G01', 0.2, 'pop', 0.16);
  s('C03', 0.1, 'pop', 0.18); s('C04', 0.4, 'pluck', 0.2); s('L02', 0.4, 'pluck', 0.2); s('C05', 0.1, 'pluck', 0.2); s('C05', 0.5, 'ding', 0.2); s('G02', 0.2, 'buzz', 0.14);
  [0.1, 0.28, 0.46].forEach(f => s('C06', f, 'marimba', 0.14)); s('C06', 0.7, 'pop', 0.16); s('D01', 0.1, 'pop', 0.16); for (let i = 0; i < 10; i++) sfx(P('D01', 0.3) + i * 0.4, 'tick', 0.08); s('C07', 0.1, 'ding', 0.22);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'pluck', 0.2); s('D02', 0.4, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C10', 0.45, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
