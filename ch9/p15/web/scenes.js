// 第 9 章 P15《弹簧振动》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e 17.3。
// A428 弹簧 + 受力 → mx″ + kx = 0 · A429 简谐 x = 0.2 cos 8t（慢放）与时间图同步 · A430 三种阻尼曲线 + 共振 t·sin t
const SC = {};
const TITLES = [['model', '建模'], ['shm', '简谐振动'], ['damp', '三种阻尼'], ['res', '共振'], ['quiz', '随堂一题'], ['outro', '小结']];

const SLOW15 = 0.3;                                   // 慢放倍率
const X15 = s => 0.2 * Math.cos(8 * s);
const GS15 = { cx: 780, cy: 470, ux: 170, uy: 650, x0: 0, x1: 2.4, y0: -0.25, y1: 0.25 };
const R1 = -5 + Math.sqrt(21), R2 = -5 - Math.sqrt(21);
const OV15 = s => (R2 * Math.exp(R1 * s) - R1 * Math.exp(R2 * s)) / (R2 - R1);
const CR15 = s => (1 + 2 * s) * Math.exp(-2 * s);
const UN15 = s => Math.exp(-s / 2) * (Math.cos(Math.sqrt(15) / 2 * s) + Math.sin(Math.sqrt(15) / 2 * s) / Math.sqrt(15));
const GD15 = { cx: 580, cy: 500, ux: 70, uy: 200, x0: 0, x1: 8.5, y0: -0.7, y1: 1.15 };
const EX15 = s => 0.05 * (Math.exp(-4 * s) - Math.exp(-16 * s));
const GR15 = { cx: 580, cy: 570, ux: 30, uy: 15, x0: 0, x1: 20, y0: -11, y1: 11 };

// ======================= 建模（A428） =======================
SC.model = t => {
  starfield(t); blueprint(0.3, 80);
  const t0 = P('X01', 0.25), s = Math.max(0, t - t0);
  const d = t < t0 ? 0 : 70 * Math.exp(-0.25 * s) * Math.sin(5 * s);
  springMass(700, 220, 200, d, ap(t, 'X01', 0), { col: CYAN, boxCol: SQ.X.col });
  if (t > t0 && t < t0 + 0.4) label('啪！', 800, 470, 40, RED, 1 - (t - t0) / 0.4, { bold: true });
  if (t > S('C01')) {
    const k = ap(t, 'C01', 0.1); arrow(760, 540 + d, 760, 470 + d - Math.sign(d || 1) * 0, RED, k * 0.9, 4);
    richReveal([['F = −kx', RED], ['，', CR], ['F = mx″', CYAN]], 1000, 330, 34, t, P('C01', 0.15), { upright: true });
  }
  if (t > S('C02')) { goldBox(1000, 470, 320, 66, 'mx″ + kx = 0', 36, ap(t, 'C02', 0.1)); label('二阶常系数齐次 ✓', 1000, 545, 26, GRN, ap(t, 'C02', 0.5), { bold: true }); }
};

// ======================= 简谐振动（A429） =======================
SC.shm = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['m = 2，k = 128，', CR], ['x(0) = 0.2，x′(0) = 0', GOLD]], 870, 210, 30, t, P('C03', 0.1), { upright: true });
  const t0 = P('C03', 0.4), s = Math.max(0, t - t0) * SLOW15;
  springMass(610, 270, 170, 300 * X15(s), ap(t, 'C03', 0.2), { col: CYAN, boxCol: SQ.X.col });
  label(`慢放 ×${SLOW15}`, 610, 700, 22, CR, ap(t, 'C03', 0.4) * 0.7);
  if (t > S('G01')) {
    const a = ap(t, 'G01', 0);
    gAxes(GS15, a * 0.75, { grid: false, ticks: { x: [[Math.PI / 4, 'π/4'], [Math.PI / 2, 'π/2']], y: [[0.2, '0.2'], [-0.2, '−0.2']] } });
    const sd = Math.min(s, 2.4); gPlot(GS15, X15, SQ.X.col, { a, w: 4, xa: 0, xb: Math.max(0.01, sd) }); gDot(GS15, sd, X15(sd), GOLD, a);
    richReveal([['r = ±8i  ⇒  ', CR], ['x = 0.2 cos 8t', GOLD]], 980, 300, 30, t, P('G01', 0.2), { upright: true });
  }
  if (t > S('C04')) { const k = ap(t, 'C04', 0.3); seg(gx(GS15, 0), gy(GS15, -0.235), gx(GS15, Math.PI / 4), gy(GS15, -0.235), GOLD, k, 3); label('周期 π/4 秒', gx(GS15, Math.PI / 8), gy(GS15, -0.235) + 32, 24, GOLD, k, { bold: true }); }
};

// ======================= 三种阻尼（A430 上） =======================
SC.damp = t => {
  starfield(t); blueprint(0.35, 80);
  goldBox(870, 210, 420, 60, 'mx″ + cx′ + kx = 0', 32, ap(t, 'C05', 0.1));
  const gs = ap(t, 'X02', 0) * fadeOut(t, S('C06'), 0.4);
  if (gs > 0) { const s0 = Math.max(0, t - S('X02')); springMass(870, 300, 180, 70 * Math.exp(-0.45 * s0) * Math.cos(5 * s0), gs, { col: CYAN, boxCol: SQ.X.col }); label('现实：越摆越小', 870, 700, 28, CYAN, gs, { bold: true }); }
  const ga = ap(t, 'C06', 0) * fadeOut(t, S('G02'), 0.4);
  if (ga > 0) {
    gAxes(GD15, ga * 0.75, { grid: false });
    const C = [[OV15, CYAN, 'c² − 4mk > 0 过阻尼', 0.1], [CR15, GRN, '= 0 临界阻尼', 0.35], [UN15, SQ.X.col, '< 0 欠阻尼', 0.6]];
    C.forEach(([f, col, txt, fr], i) => { const k = ap(t, 'C06', fr) * ga; gPlot(GD15, f, col, { a: k, w: i === 1 && t > S('X03') ? 6 : 4, p: prog(t, P('C06', fr), 0.5) }); label(txt, 1060, 300 + i * 46, 24, col, k, { bold: true }); });
    if (t > S('X03')) { const k = ap(t, 'X03', 0.3) * ga; label('汽车减震器 ✓', gx(GD15, 2.2), gy(GD15, 0.55), 24, GRN, k, { bold: true }); }
  }
  if (t > S('G02') - 0.1) {
    const a = ap(t, 'G02', 0), GE = { cx: 600, cy: 700, ux: 300, uy: 2600, x0: 0, x1: 1.9, y0: 0, y1: 0.17 };
    gAxes(GE, a * 0.75, { grid: false, ticks: { x: [[0.5, '0.5'], [1, '1'], [1.5, '1.5']], y: [[0.05, '0.05']] } });
    richReveal([['r = −4, −16  ⇒  ', CR], ['x = 0.05(e^{−4t} − e^{−16t})', GOLD]], 870, 290, 30, t, P('G02', 0.1), { upright: true });
    gPlot(GE, EX15, CYAN, { a, w: 5, p: prog(t, P('G02', 0.3), 0.6) });
    label('冲出去一点，慢慢回到 0', 1000, 420, 26, CYAN, ap(t, 'G02', 0.7), { bold: true });
  }
};

// ======================= 共振（A430 下） =======================
SC.res = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['x″ + x = ', CR], ['sin t', RED], ['  ⇒  ', CR], ['x* = −(t/2) cos t', GOLD]], 870, 220, 32, t, P('C07', 0.1), { upright: true });
  const a = ap(t, 'C07', 0.2);
  gAxes(GR15, a * 0.75, { grid: false });
  gPlot(GR15, s => s / 2, RED, { a: a * 0.5, w: 2, dash: [8, 6] }); gPlot(GR15, s => -s / 2, RED, { a: a * 0.5, w: 2, dash: [8, 6] });
  gPlot(GR15, s => -s / 2 * Math.cos(s), GOLD, { a, w: 4, p: prog(t, P('C07', 0.3), 1.2), n: 600 });
  label('振幅越来越大：共振', 870, 300, 28, RED, ap(t, 'C07', 0.6) * fadeOut(t, S('C08'), 0.3), { bold: true });
  if (t > S('C08')) { const k = ap(t, 'C08', 0.2); panel(690, 262, 360, 60, GOLD, k); label('撞上特征根 ±i ⇒ ×t', 870, 302, 26, GOLD, k, { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['m = 1，k = 4，c = 4', CR], ['  哪种？', GOLD]], 860, 260, 40, t, P('C10', 0.05), { upright: true });
  if (t > S('D01')) { richReveal([['16 − 16 = 0  ⇒  ', CR], ['临界阻尼', GRN]], 860, 370, 40, t, P('D01', 0.15), { upright: true }); checkMark(1120, 370, 26, GRN, t, P('D01', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) richReveal([['mx″ + cx′ + kx = 0', CR], ['  ·  看 c² − 4mk', GOLD]], CX, 400, 44, t, P('C11', 0.05), { upright: true, alpha: ga });
  if (t > S('C12') - 0.1) { glowText('最后一段：奶茶小测', CX, 520, 50, CR, t, P('C12', 0.15)); glowText('千姐请客，全章回顾', CX, 610, 32, SQ.Q.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 9 章 · P15 弹簧振动', '下一段：奶茶小测', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM9('Grok')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('X01', 0.25, 'slam', 0.26); s('X01', 0.3, 'pluck', 0.14); s('C01', 0.15, 'pop', 0.16); s('C02', 0.1, 'ding', 0.2); s('C02', 0.5, 'check', 0.18);
  s('C03', 0.1, 'pop', 0.16); s('C03', 0.4, 'pluck', 0.14); s('G01', 0.2, 'pop', 0.16); s('C04', 0.3, 'tick', 0.16);
  s('X02', 0.05, 'impact', 0.18); s('C05', 0.1, 'ding', 0.18); s('C06', 0.1, 'swoosh_in', 0.14); s('C06', 0.35, 'swoosh_in', 0.14); s('C06', 0.6, 'swoosh_in', 0.14); s('X03', 0.3, 'check', 0.2); s('G02', 0.1, 'pop', 0.16); s('G02', 0.7, 'ding_lo', 0.14);
  s('C07', 0.1, 'pop', 0.16); s('C07', 0.3, 'riser', 0.16); s('C07', 0.6, 'sting', 0.16); s('C08', 0.2, 'ding', 0.18);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.15, 'whoosh', 0.14); s('D01', 0.6, 'ding_hi', 0.28);
  s('C11', 0.05, 'pop', 0.2); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
