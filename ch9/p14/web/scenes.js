// 第 9 章 P14《待定系数法》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 7.8。
// A425 通解 = Y + y*，“照样子猜”对照卡 · A426 例 1 比较系数 + 解族贴近特解直线 · A427 例 2 撞上特征根：不乘 x 全消掉
const SC = {};
const TITLES = [['idea', '通解结构'], ['ex1', '例 1'], ['ex2', '撞上特征根'], ['quiz', '随堂一题'], ['outro', '小结']];

const YP14 = x => -x + 1 / 3;
const GE14 = { cx: 600, cy: 520, ux: 80, uy: 55, x0: -1, x1: 6.5, y0: -6.2, y1: 4.5 };
const C214 = [-2, 2, 4];

// ======================= 通解结构（A425） =======================
SC.idea = t => {
  starfield(t); blueprint(0.3, 80);
  goldBox(870, 230, 480, 64, 'y″ + py′ + qy = f(x)', 34, ap(t, 'C01', 0.1));
  if (t > S('C02')) {
    richReveal([['y = ', CR], ['Y', CYAN], [' + ', CR], ['y*', GOLD]], 870, 340, 46, t, P('C02', 0.05), { upright: true });
    label('齐次通解（上一段）', 760, 400, 24, CYAN, ap(t, 'C02', 0.3), { bold: true }); label('一个特解（靠猜）', 1000, 400, 24, GOLD, ap(t, 'C02', 0.5), { bold: true });
  }
  if (t > S('M01')) {
    const rows = [['f = 多项式', '猜多项式 ax + b …'], ['f = e^{λx}', '猜 Ae^{λx}'], ['f = cos ωx', '猜 A cos ωx + B sin ωx']];
    rows.forEach((r, i) => { const k = ap(t, 'M01', 0.15 + 0.15 * i), y = 470 + i * 95; panel(560, y, 620, 78, SQ.M.col, k); mathText(r[0], 700, y + 48, 28, CR, { alpha: k, upright: true, align: 'center' }); arrow(810, y + 39, 880, y + 39, SQ.M.col, k, 3); mathText(r[1], 1030, y + 48, 28, GOLD, { alpha: k, upright: true, align: 'center' }); });
  }
};

// ======================= 例 1（A426） =======================
SC.ex1 = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C03', 0) * fadeOut(t, S('G01'), 0.4);
  if (ga > 0) {
    richReveal([['y″ − 2y′ − 3y = ', CR], ['3x + 1', GOLD]], 870, 240, 36, t, P('C03', 0.1), { upright: true, alpha: ga });
    if (t > S('M02')) richReveal([['猜 ', SQ.M.col], ['y* = ax + b', GOLD]], 870, 330, 36, t, P('M02', 0.2), { upright: true, alpha: ga });
    if (t > S('C04')) {
      richReveal([['−3a', CYAN], ['x + ', CR], ['(−2a − 3b)', RED], [' = ', CR], ['3', CYAN], ['x + ', CR], ['1', RED]], 870, 420, 34, t, P('C04', 0.05), { upright: true, alpha: ga });
      richReveal([['a = −1', CYAN], ['，', CR], ['b = 1/3', RED]], 870, 500, 34, t, P('C04', 0.5), { upright: true, alpha: ga });
    }
    if (t > S('M03')) { goldBox(870, 600, 340, 62, 'y* = −x + 1/3', 32, ap(t, 'M03', 0.05) * ga); checkMark(1080, 600, 24, GRN, t, P('M03', 0.2)); }
  }
  if (t > S('G01') - 0.1) {
    const a = ap(t, 'G01', 0);
    gAxes(GE14, a * 0.75, { grid: false, ticks: { x: [[2, '2'], [4, '4'], [6, '6']], y: [[2, '2'], [-4, '−4']] } });
    richReveal([['y = C₁e^{3x} + C₂e^{−x}', CR], [' − x + 1/3', GOLD]], 870, 210, 30, t, P('G01', 0.05), { upright: true });
    C214.forEach((c, i) => gPlot(GE14, x => c * Math.exp(-x) + YP14(x), [CYAN, SQ.M.col, GRN][i], { a: a * 0.85, w: 3, p: prog(t, P('G01', 0.2 + 0.1 * i), 0.6) }));
    gPlot(GE14, YP14, GOLD, { a, w: 5, p: prog(t, P('G01', 0.1), 0.6) });
    label('C₁ = 0：都贴向特解直线', 1000, 660, 26, GOLD, ap(t, 'G01', 0.6), { bold: true });
  }
};

// ======================= 撞上特征根（A427） =======================
SC.ex2 = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['y″ − 5y′ + 6y = ', CR], ['xe^{2x}', GOLD]], 870, 230, 36, t, P('C05', 0.1), { upright: true });
  if (t > S('C05')) { richReveal([['r = 2', RED], ['，3', CR]], 870, 300, 30, t, P('C05', 0.5), { upright: true }); }
  if (t > S('D01')) {
    const k = ap(t, 'D01', 0.05), fall = prog(t, P('D01', 0.5), 0.6);
    panel(580, 350, 560, 90, RED, k * (1 - 0.4 * fall)); mathText('(ax + b)e^{2x}', 860, 405, 32, CR, { alpha: k * (1 - 0.7 * fall), upright: true, align: 'center' });
    if (fall > 0) label('代入后左边全消成 0，凑不出 xe²ˣ', 860, 475, 26, RED, fall, { bold: true });
    crossMark(1100, 395, 30, RED, t, P('D01', 0.6));
  }
  if (t > S('C06')) {
    const k = ap(t, 'C06', 0.05);
    panel(580, 520, 560, 90, GRN, k); mathText('x(ax + b)e^{2x}', 860, 575, 32, GOLD, { alpha: k, upright: true, align: 'center' });
    label('单根 ×x，重根 ×x²', 860, 650, 26, GRN, ap(t, 'C06', 0.5), { bold: true });
  }
  if (t > S('G02')) goldBox(870, 740, 440, 60, 'y* = −(x²/2 + x)e^{2x}', 30, ap(t, 'G02', 0.4));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['y″ + y = eˣ', CR], ['  y* = ?', GOLD]], 860, 260, 40, t, P('C08', 0.05), { upright: true });
  if (t > S('D02')) { richReveal([['Aeˣ + Aeˣ = eˣ  ⇒  ', CR], ['y* = eˣ/2', GOLD]], 860, 370, 36, t, P('D02', 0.15), { upright: true }); checkMark(1180, 370, 26, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([['照样子猜 · ', CR], ['撞上特征根就 ×x', GOLD]], CX, 400, 46, t, P('C09', 0.05), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：弹簧振动', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Grok：这是真的吗？', CX, 610, 32, SQ.X.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 9 章 · P14 待定系数法', '下一段：弹簧振动', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM9('Gemini')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'ding', 0.2); s('C02', 0.05, 'pop', 0.16); s('C02', 0.5, 'pop', 0.14); s('M01', 0.05, 'sparkle', 0.16); s('M01', 0.15, 'pluck', 0.14); s('M01', 0.3, 'pluck', 0.14); s('M01', 0.45, 'pluck', 0.14);
  s('C03', 0.1, 'pop', 0.16); s('M02', 0.2, 'click', 0.18); s('C04', 0.05, 'pop', 0.16); s('C04', 0.5, 'ding_lo', 0.16); s('M03', 0.05, 'ding', 0.2); s('M03', 0.2, 'check', 0.2); s('G01', 0.1, 'swoosh_in', 0.16);
  s('C05', 0.1, 'pop', 0.16); s('C05', 0.5, 'tick', 0.16); s('D01', 0.05, 'pop', 0.16); s('D01', 0.5, 'glitch', 0.18); s('D01', 0.6, 'buzz', 0.16); s('C06', 0.05, 'pop', 0.16); s('C06', 0.5, 'ding', 0.18); s('G02', 0.4, 'ding_hi', 0.18);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'whoosh', 0.14); s('D02', 0.6, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
