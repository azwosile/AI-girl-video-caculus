// 第 9 章 P10《齐次方程》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 7.3。
// A413 齐次方程的方向场：同一条射线上斜率都相同 · A414 换元 u = y/x 四步推导 + 解曲线 · A415 判别：x、y 同乘 t 右边不变
const SC = {};
const TITLES = [['def', '齐次方程'], ['ex', '换元求解'], ['test', '怎么判断'], ['quiz', '随堂一题'], ['outro', '小结']];

const F10 = (x, y) => (Math.abs(x) < 0.05 || Math.abs(y) < 0.05) ? NaN : y / x + x / y;
const GD10 = { cx: 880, cy: 560, ux: 120, uy: 120, x0: -2.4, x1: 2.4, y0: -2.1, y1: 2.1 };
const Y10 = x => x * Math.sqrt(2 * Math.log(x) + 4);
const GE10 = { cx: 620, cy: 790, ux: 190, uy: 80, x0: 0, x1: 3, y0: 0, y1: 6.2 };

// ======================= 齐次方程（A413） =======================
SC.def = t => {
  starfield(t); blueprint(0.3, 80);
  goldBox(870, 230, 380, 64, 'dy/dx = φ(y/x)', 34, ap(t, 'C01', 0.1));
  const a = ap(t, 'C01', 0.3);
  gAxes(GD10, a * 0.6, { grid: false });
  const hi = t > S('H01') ? (x, y) => Math.abs(y - 0.6 * x) < 0.12 && x > 0 : null;
  slopeField(GD10, F10, a * 0.7, { sx: 0.4, sy: 0.4, len: 26, hi, dim: hi ? 0.5 : 1 });
  if (t > S('H01')) { const k = ap(t, 'H01', 0.2); seg(GD10.cx, GD10.cy, gx(GD10, 2.4), gy(GD10, 1.44), SQ.H.col, k * 0.8, 2.5, [8, 6]); label('u = y/x 不变 → 斜率不变', 1000, gy(GD10, 1.9), 26, SQ.H.col, k, { bold: true }); }
  if (t > S('C02')) { panel(600, 700, 540, 80, CYAN, ap(t, 'C02', 0.1)); mathText("y = ux  ⇒  y′ = u + x u′", 870, 750, 32, CR, { align: 'center', alpha: ap(t, 'C02', 0.1), upright: true }); }
};

// ======================= 换元求解（A414） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C03', 0) * fadeOut(t, S('H03'), 0.4);
  if (ga > 0) {
    richReveal([["y′ = y/x + x/y，", CR], ['y(1) = 2', GOLD]], 870, 240, 34, t, P('C03', 0.1), { upright: true, alpha: ga });
    if (t > S('H02')) richReveal([["u + x u′ = u + 1/u", CR], ['  ⇒  x u′ = 1/u', SQ.H.col]], 870, 330, 32, t, P('H02', 0.1), { upright: true, alpha: ga });
    if (t > S('C04')) richReveal([['u du = dx/x  ⇒  ', CR], ['u²/2 = ln x + C', CYAN]], 870, 410, 32, t, P('C04', 0.1), { upright: true, alpha: ga });
    if (t > S('G01')) { richReveal([['y² = x²(2 ln x + C)', CR]], 870, 490, 32, t, P('G01', 0.05), { upright: true, alpha: ga }); richReveal([['y(1) = 2  ⇒  ', CR], ['C = 4', GOLD]], 870, 560, 32, t, P('G01', 0.55), { upright: true, alpha: ga }); }
  }
  if (t > S('H03') - 0.1) {
    const a = ap(t, 'H03', 0); gAxes(GE10, a * 0.75, { grid: false, ticks: { x: [[1, '1'], [2, '2'], [3, '3']], y: [[2, '2'], [4, '4'], [6, '6']] } });
    goldBox(950, 250, 380, 64, 'y = x√(2 ln x + 4)', 32, ap(t, 'H03', 0.1));
    gPlot(GE10, Y10, SQ.H.col, { a, w: 5, xa: Math.exp(-2) + 1e-4, xb: 3, p: prog(t, P('H03', 0.2), 1.0) }); gDot(GE10, 1, 2, GOLD, a); label('(1, 2)', gx(GE10, 1) + 50, gy(GE10, 2) + 26, 24, GOLD, a, { bold: true });
    checkMark(1150, 250, 24, GRN, t, P('H03', 0.7));
  }
};

// ======================= 怎么判断（A415） =======================
SC.test = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['x → tx，', CYAN], ['y → ty', CYAN], ['：右边不变 ⇒ 齐次', GOLD]], 870, 280, 34, t, P('C05', 0.1), { upright: true });
  if (t > S('C05')) { const k = ap(t, 'C05', 0.5); panel(600, 360, 540, 90, CYAN, k); mathText('(ty)/(tx) + (tx)/(ty) = y/x + x/y', 870, 415, 30, CR, { align: 'center', alpha: k, upright: true }); checkMark(1110, 405, 22, GRN, t, P('C05', 0.8)); }
  if (t > S('G02')) {
    const k1 = ap(t, 'G02', 0.1), k2 = ap(t, 'G02', 0.4);
    panel(560, 520, 290, 150, SQ.H.col, k1); label('齐次方程', 705, 560, 30, SQ.H.col, k1, { bold: true }); mathText('y′ = φ(y/x)', 705, 630, 28, CR, { align: 'center', alpha: k1, upright: true });
    panel(890, 520, 290, 150, RED, k2); label('齐次线性方程', 1035, 560, 30, RED, k2, { bold: true }); mathText("y′ + P y = 0", 1035, 630, 28, CR, { align: 'center', alpha: k2, upright: true });
    label('≠', 870, 595, 44, GOLD, k2, { bold: true });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([["y′ = (x² + y²)/(xy)", CR], ['  齐次吗？', GOLD]], 860, 260, 38, t, P('C07', 0.05), { upright: true });
  if (t > S('D01')) { richReveal([['÷ x²  ⇒  ', CR], ['(1 + u²)/u', GOLD]], 860, 360, 38, t, P('D01', 0.15), { upright: true }); checkMark(1100, 360, 26, GRN, t, P('D01', 0.5)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) richReveal([['u = y/x  ⇒  ', CR], ['可分离', GOLD]], CX, 400, 48, t, P('C08', 0.05), { upright: true, alpha: ga });
  if (t > S('C09') - 0.1) { glowText('下一段：伯努利方程', CX, 520, 50, CR, t, P('C09', 0.15)); glowText('Mistral 骑士变身', CX, 610, 32, SQ.R.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 9 章 · P10 齐次方程', '下一段：伯努利', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM9('混元')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'ding', 0.2); s('C01', 0.3, 'riser', 0.1); s('H01', 0.05, 'click', 0.2); s('H01', 0.2, 'shimmer', 0.14); s('C02', 0.1, 'pop', 0.16);
  s('C03', 0.1, 'pop', 0.16); s('H02', 0.05, 'click', 0.2); s('H02', 0.1, 'pop', 0.16); s('C04', 0.1, 'pop', 0.16); s('G01', 0.05, 'pop', 0.16); s('G01', 0.55, 'ding', 0.18); s('H03', 0.1, 'click', 0.2); s('H03', 0.7, 'check', 0.22);
  s('C05', 0.1, 'pop', 0.16); s('C05', 0.8, 'check', 0.2); s('G02', 0.1, 'pop', 0.16); s('G02', 0.4, 'buzz', 0.14);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.15, 'whoosh', 0.14); s('D01', 0.5, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
