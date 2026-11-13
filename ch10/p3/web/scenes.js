// 第 10 章 P3《参数曲线的切线与凹凸》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.2 例 1、例 2。
// A443 运动点 + 速度分量 (dx/dt, dy/dt) 合成切线 · A444 自交点两条切线、水平 / 竖直切线 · A445 凹凸着色 + 错误公式对比；摆线 θ = π/3 切线与尖点
const SC = {};
const TITLES = [['rule', '斜率公式'], ['ex', '例 1'], ['conc', '凹凸'], ['cyc', '摆线'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 斜率公式（A443） =======================
const GR3 = { cx: 900, cy: 600, ux: 150, uy: 150, x0: -1.6, x1: 1.6, y0: -1.3, y1: 1.3 };
const rx3 = s => 1.3 * Math.cos(s), ry3 = s => Math.sin(2 * s) * 0.9;
SC.rule = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'M01', 0), s = 0.4 + (t - S('M01')) * 0.55;
  paramTrace(GR3, rx3, ry3, 0, TAU, SQ.M.col, { a: a * 0.8, w: 4, dot: false });
  const X = gx(GR3, rx3(s)), Y = gy(GR3, ry3(s)), h = 1e-3, dx = (rx3(s + h) - rx3(s - h)) / (2 * h), dy = (ry3(s + h) - ry3(s - h)) / (2 * h);
  const k = 70; arrow(X, Y, X + dx * k, Y, CYAN, a, 4); arrow(X, Y, X, Y - dy * k, GOLD, a, 4); arrow(X, Y, X + dx * k, Y - dy * k, GRN, a, 4);
  gTangent(GR3, rx3(s), ry3(s), dy / dx, 220, GRN, a * 0.6, { dash: [8, 7] }); glowDot(X, Y, 9, SQ.M.col, a);
  label('dx/dt', X + dx * k + (dx > 0 ? 40 : -40), Y + 22, 22, CYAN, a, { bold: true }); label('dy/dt', X - 46, Y - dy * k, 22, GOLD, a, { bold: true });
  if (t > S('C01')) goldBox(980, 230, 520, 84, 'dy/dx = (dy/dt) / (dx/dt)', 36, ap(t, 'C01', 0.15));
  if (t > S('C02')) { const k2 = ap(t, 'C02', 0.1); panel(620, 800, 340, 70, GOLD, k2); label('dy/dt = 0 → 水平', 790, 835, 26, GOLD, k2, { bold: true });
    const k3 = ap(t, 'C02', 0.5); panel(1000, 800, 340, 70, CYAN, k3); label('dx/dt = 0 → 竖直', 1170, 835, 26, CYAN, k3, { bold: true }); }
};

// ======================= 例 1（A444） =======================
const G3 = { cx: 820, cy: 540, ux: 92, uy: 82, x0: -0.4, x1: 4.8, y0: -3, y1: 3 };
const ex3 = s => s * s, ey3 = s => s ** 3 - 3 * s, m3 = s => 3 * (s * s - 1) / (2 * s);
SC.ex = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C03', 0); gAxes(G3, a * 0.55, { grid: false, ticks: { x: [[1, '1'], [3, '3']], y: [[2, '2'], [-2, '−2']] } });
  richReveal([['x = t²，', CYAN], ['y = t³ − 3t', GOLD]], 1150, 230, 32, t, P('C03', 0.05), { upright: true });
  paramTrace(G3, ex3, ey3, -2.15, 2.15, SQ.M.col, { a, p: prog(t, P('C03', 0.2), 2.4), w: 4, arrows: [-1.6, -0.4, 0.6, 1.8] });
  if (t > P('C03', 0.6)) { glowDot(gx(G3, 3), gy(G3, 0), 10, GOLD, ap(t, 'C03', 0.6)); label('t = ±√3', gx(G3, 3) + 70, gy(G3, 0) + 34, 24, GOLD, ap(t, 'C03', 0.6), { bold: true }); }
  if (t > S('C04')) {
    const r3 = Math.sqrt(3); gTangent(G3, 3, 0, r3, 200, GRN, ap(t, 'C04', 0.35), { w: 4 }); gTangent(G3, 3, 0, -r3, 200, RED, ap(t, 'C04', 0.55), { w: 4 });
    label('m = √3', gx(G3, 3) + 170, gy(G3, 0) - 150, 26, GRN, ap(t, 'C04', 0.35), { bold: true }); label('m = −√3', gx(G3, 3) + 170, gy(G3, 0) + 150, 26, RED, ap(t, 'C04', 0.55), { bold: true });
    richReveal([['dy/dx = ', CR], ['(3t² − 3)/(2t)', GOLD]], 1150, 290, 30, t, P('C04', 0.05), { upright: true });
  }
  if (t > S('M02')) stampMark(1310, 470, 40, t, P('M02', 0.2), { text: '两条都对', col: SQ.M.col, rot: -0.12 });
  if (t > S('G01')) { const k = ap(t, 'G01', 0.1);
    [[1, -2], [1, 2]].forEach(([x, y]) => { seg(gx(G3, x) - 70, gy(G3, y), gx(G3, x) + 70, gy(G3, y), GOLD, k, 3.5); glowDot(gx(G3, x), gy(G3, y), 8, GOLD, k); });
    const k2 = ap(t, 'G01', 0.5); seg(gx(G3, 0), gy(G3, 0) - 70, gx(G3, 0), gy(G3, 0) + 70, CYAN, k2, 3.5); glowDot(gx(G3, 0), gy(G3, 0), 8, CYAN, k2);
    label('水平：t = ±1', 650, 800, 24, GOLD, k, { bold: true, align: 'left' }); label('竖直：t = 0', 650, 835, 24, CYAN, k2, { bold: true, align: 'left' }); }
};

// ======================= 凹凸（A445） =======================
SC.conc = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C05', 0);
  richReveal([['d²y/dx² = ', CR], ['d/dt(dy/dx)', GOLD], [' ÷ ', CR], ['dx/dt', CYAN]], 980, 230, 34, t, P('C05', 0.1), { upright: true });
  if (t > S('C06')) {
    richReveal([['= 3(t² + 1)/(4t³)', GOLD]], 980, 300, 34, t, P('C06', 0.05), { upright: true });
    const k = ap(t, 'C06', 0.3), G = { ...G3, cx: 760, cy: 610, ux: 70, uy: 60 };
    gAxes(G, k * 0.5, { grid: false, ticks: { x: [], y: [] } });
    paramTrace(G, ex3, ey3, 0.02, 2.15, GRN, { a: k, w: 5, dot: false }); paramTrace(G, ex3, ey3, -2.15, -0.02, RED, { a: k, w: 5, dot: false });
    label('t > 0：上凹 ∪', 1060, 470, 26, GRN, ap(t, 'C06', 0.5), { bold: true, align: 'left' }); label('t < 0：下凹 ∩', 1060, 520, 26, RED, ap(t, 'C06', 0.7), { bold: true, align: 'left' });
  }
  if (t > S('D01')) { const k = ap(t, 'D01', 0.2); panel(1040, 600, 320, 70, RED, k); label('y″(t) / x″(t) ？', 1200, 635, 28, RED, k, { bold: true }); }
  if (t > S('C07')) { const k = ap(t, 'C07', 0.2);
    label('t = 1：正确 3/2', 1200, 720, 26, GRN, k, { bold: true }); checkMark(1370, 720, 18, GRN, t, P('C07', 0.3));
    label('6 / 2 = 3', 1200, 770, 26, RED, ap(t, 'C07', 0.55), { bold: true }); crossMark(1370, 770, 18, RED, t, P('C07', 0.6)); }
};

// ======================= 摆线（A445） =======================
const GC3 = { cx: 650, cy: 700, ux: 95, uy: 95, x0: -0.2, x1: 7, y0: 0, y1: 2.6 };
SC.cyc = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C08', 0); gAxes(GC3, a * 0.5, { grid: false, ticks: { x: [[TAU, '2πr']], y: [[2, '2r']] } });
  const cx = s => s - Math.sin(s), cy = s => 1 - Math.cos(s);
  paramTrace(GC3, cx, cy, 0, TAU, SQ.L.col, { a, w: 4, dot: false });
  richReveal([['dy/dx = ', CR], ['sin θ / (1 − cos θ)', GOLD]], 980, 240, 34, t, P('C08', 0.05), { upright: true });
  const q = Math.PI / 3, k = ap(t, 'C08', 0.3); gTangent(GC3, cx(q), cy(q), Math.sqrt(3), 160, GRN, k, { w: 4 }); glowDot(gx(GC3, cx(q)), gy(GC3, cy(q)), 9, GOLD, k);
  label('θ = π/3：m = √3', gx(GC3, cx(q)) + 150, gy(GC3, cy(q)) + 10, 26, GRN, k, { bold: true, align: 'left' });
  const k2 = ap(t, 'C08', 0.65); [0, TAU].forEach(v => { seg(gx(GC3, v), GC3.cy, gx(GC3, v), GC3.cy - 200, CYAN, k2, 3.5, [8, 6]); glowDot(gx(GC3, v), GC3.cy, 9, CYAN, k2); });
  label('尖点：竖直切线', gx(GC3, TAU) - 20, GC3.cy - 230, 26, CYAN, k2, { bold: true });
};

// ======================= 随堂 =======================
const GQ3 = { cx: 760, cy: 760, ux: 150, uy: 110, x0: -0.2, x1: 2.2, y0: -0.2, y1: 4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['x = t²，y = t³，t = 1：', CR], ['dy/dx = ？', GOLD]], 880, 240, 36, t, P('C10', 0.05), { upright: true });
  const a = ap(t, 'C10', 0.2); gAxes(GQ3, a * 0.5, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } });
  paramTrace(GQ3, s => s * s, s => s ** 3, 0, 1.45, SQ.M.col, { a, w: 4, dot: false });
  if (t > S('D02')) { const k = ap(t, 'D02', 0.3); richReveal([['3t² / 2t = ', CR], ['3/2', GOLD]], 880, 310, 36, t, P('D02', 0.1), { upright: true });
    gTangent(GQ3, 1, 1, 1.5, 200, GRN, k, { w: 4 }); glowDot(gx(GQ3, 1), gy(GQ3, 1), 9, GOLD, k); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) {
    richReveal([['dy/dx = ', CR], ['(dy/dt) ÷ (dx/dt)', GOLD]], CX, 340, 46, t, P('C11', 0.05), { upright: true, alpha: ga });
    richReveal([['d²y/dx² = ', CR], ['d/dt(dy/dx) ÷ (dx/dt)', CYAN]], CX, 440, 40, t, P('C11', 0.5), { upright: true, alpha: ga });
  }
  if (t > S('C12') - 0.1) { glowText('下一段：参数曲线的面积与弧长', CX, 520, 50, CR, t, P('C12', 0.15)); glowText('混元按计算器', CX, 610, 32, SQ.H.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 10 章 · P3 切线与凹凸', '下一段：面积与弧长', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM10('Gemini')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.05, 'sparkle', 0.2); s('C01', 0.15, 'ding', 0.22); s('C02', 0.1, 'pop', 0.16); s('C02', 0.5, 'pop', 0.16);
  s('C03', 0.2, 'whoosh', 0.12); s('C03', 0.6, 'ding', 0.18); s('C04', 0.35, 'zap', 0.16); s('C04', 0.55, 'zap', 0.16); s('M02', 0.2, 'stamp', 0.26); s('G01', 0.1, 'pop', 0.16); s('G01', 0.5, 'pop', 0.16);
  s('C05', 0.1, 'pop', 0.16); s('C06', 0.05, 'ding', 0.2); s('C06', 0.3, 'swell', 0.12); s('D01', 0.2, 'buzz', 0.16); s('C07', 0.3, 'check', 0.2); s('C07', 0.6, 'buzz', 0.16);
  s('C08', 0.05, 'pop', 0.16); s('C08', 0.3, 'zap', 0.16); s('C08', 0.65, 'pluck', 0.18);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.6, 'ding_hi', 0.28);
  s('C11', 0.05, 'pop', 0.2); s('C11', 0.5, 'pop', 0.2); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
