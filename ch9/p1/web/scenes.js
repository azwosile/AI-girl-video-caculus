// 第 9 章 P1《什么是微分方程》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.1。
// A386 定义与阶（弹簧小动画） · A387 通解一族 y = x² + C，初始条件挑出一条 · A388 代入验证 e^(2x)
const SC = {};
const TITLES = [['def', '定义与阶'], ['family', '通解与初值'], ['verify', '验证解'], ['quiz', '随堂一题'], ['outro', '小结']];

const GF1 = { cx: 880, cy: 720, ux: 120, uy: 70, x0: -2.4, x1: 2.4, y0: -1.5, y1: 5.6 };

// ======================= 定义与阶（A386） =======================
SC.def = t => {
  starfield(t); blueprint(0.3, 80);
  label('微分方程', 870, 230, 52, GOLD, ap(t, 'K01', 0.05), { bold: true });
  richReveal([['含 ', CR], ['未知函数', RED], [' 及其 ', CR], ['导数', CYAN], [' 的方程', CR]], 870, 310, 34, t, P('K01', 0.3), { upright: true });
  if (t > S('C01')) label('阶 = 最高阶导数的阶数', 870, 390, 32, CR, ap(t, 'C01', 0.2), { bold: true });
  if (t > S('C02')) {
    const a1 = ap(t, 'C02', 0.05), a2 = ap(t, 'C02', 0.5);
    panel(560, 450, 400, 90, CYAN, a1); mathText('dP/dt = kP', 700, 495, 34, CR, { alpha: a1, upright: true }); label('一阶', 900, 495, 30, CYAN, a1, { bold: true });
    panel(560, 570, 400, 90, GOLD, a2); mathText('m x″ = −kx', 700, 615, 34, CR, { alpha: a2, upright: true }); label('二阶', 900, 615, 30, GOLD, a2, { bold: true });
    springMass(1100, 450, 150, 40 * Math.sin((t - P('C02', 0.5)) * 5), a2, { m: 'm', coils: 7, amp: 16 });
  }
};

// ======================= 通解与初值（A387） =======================
SC.family = t => {
  starfield(t); blueprint(0.35, 80);
  label('解 = 代进去使方程成立的函数', 870, 230, 32, CR, ap(t, 'C03', 0.1), { bold: true });
  if (t > S('G01')) {
    const a = ap(t, 'G01', 0.05);
    gAxes(GF1, a * 0.7, { grid: false });
    richReveal([["y′ = 2x  ⇒  ", CR], ['y = x² + C', CYAN]], 870, 290, 34, t, P('G01', 0.1), { upright: true });
    [-1, 0, 1, 2, 3].forEach((c, i) => gPlot(GF1, x => x * x + c, CYAN, { a: a * 0.55 * ap(t, 'G01', 0.3 + 0.08 * i) * (t > S('K02') ? 0.6 : 1), w: 3 }));
    label('一整族：通解', gx(GF1, 1.9) + 60, gy(GF1, 5), 26, CYAN, ap(t, 'G01', 0.7), { bold: true });
  }
  if (t > S('K02')) {
    const a = ap(t, 'K02', 0.3);
    gDot(GF1, 0, 1, GOLD, a); label('y(0) = 1', gx(GF1, 0) + 80, gy(GF1, 1) + 30, 28, GOLD, a, { bold: true });
    gPlot(GF1, x => x * x + 1, GOLD, { a: ap(t, 'K02', 0.55), w: 5, p: prog(t, P('K02', 0.55), 0.8) });
  }
  if (t > S('C04')) goldBox(880, 772, 300, 52, 'y = x² + 1', 30, ap(t, 'C04', 0.3));
};

// ======================= 验证解（A388） =======================
SC.verify = t => {
  starfield(t); blueprint(0.35, 80);
  label('代进去，看两边是否相等', 870, 240, 34, CR, ap(t, 'C05', 0.1), { bold: true });
  if (t > S('D01')) richReveal([['y = e^{2x}', SQ.D.col], ['  是  ', CR], ["y′ = 2y", GOLD], [' 的解吗？', CR]], 870, 320, 34, t, P('D01', 0.1), { upright: true });
  if (t > S('C06')) {
    richReveal([['左边  ', CR], ["y′ = 2e^{2x}", CYAN]], 870, 410, 34, t, P('C06', 0.05), { upright: true });
    richReveal([['右边  ', CR], ['2y = 2e^{2x}', CYAN]], 870, 475, 34, t, P('C06', 0.35), { upright: true });
    checkMark(1150, 440, 30, GRN, t, P('C06', 0.7));
  }
  if (t > S('G02')) {
    const a1 = ap(t, 'G02', 0.1), a2 = ap(t, 'G02', 0.45);
    panel(600, 560, 540, 70, GOLD, a1); label('一阶 → 一个常数 C', 870, 595, 30, GOLD, a1, { bold: true });
    panel(600, 650, 540, 70, CYAN, a2); label('二阶 → 两个常数 C₁、C₂', 870, 685, 30, CYAN, a2, { bold: true });
  }
};

// ======================= 随堂 =======================
const Q1 = [['eˣ', true], ['x²', false], ['3eˣ', true]];
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['哪些是 ', CR], ["y′ = y", GOLD], [' 的解？', CR]], 860, 250, 38, t, P('C08', 0.05), { upright: true });
  Q1.forEach(([f, ok], i) => { const a = ap(t, 'C08', 0.3 + 0.15 * i), X = 650 + i * 220;
    panel(X - 90, 380, 180, 100, ok ? CYAN : RED, a); mathText(f, X, 430, 40, CR, { alpha: a, upright: true });
    if (t > S('D02')) (ok ? checkMark : crossMark)(X, 540, 26, ok ? GRN : RED, t, P('D02', 0.1 + 0.15 * i)); });
  if (t > S('D02')) label("(x²)′ = 2x ≠ x²", 870, 640, 30, RED, ap(t, 'D02', 0.6), { bold: true });
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([['方程 + 初始条件 = ', CR], ['唯一一条曲线', GOLD]], CX, 400, 46, t, P('C09', 0.05), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：方向场', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Gemini 的风向图', CX, 610, 32, SQ.M.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 9 章 · P1 基本概念', '下一段：方向场', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM9('Kimi')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.05, 'shimmer', 0.18); s('K01', 0.3, 'type', 0.14); s('C01', 0.2, 'pop', 0.18); s('C02', 0.05, 'pop', 0.18); s('C02', 0.5, 'pop', 0.18); s('C02', 0.55, 'hum', 0.1);
  s('C03', 0.1, 'pop', 0.16); s('G01', 0.1, 'swell', 0.12); [0.3, 0.38, 0.46, 0.54, 0.62].forEach(f => s('G01', f, 'marimba', 0.1)); s('K02', 0.3, 'ding', 0.2); s('K02', 0.55, 'riser', 0.12); s('C04', 0.3, 'ding_hi', 0.24);
  s('C05', 0.1, 'pop', 0.16); s('D01', 0.1, 'tick', 0.18); s('C06', 0.05, 'pop', 0.16); s('C06', 0.35, 'pop', 0.16); s('C06', 0.7, 'check', 0.24); s('G02', 0.1, 'pop', 0.18); s('G02', 0.45, 'pop', 0.18);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); [0.1, 0.25, 0.4].forEach((f, i) => s('D02', f, i === 1 ? 'buzz' : 'check', 0.2)); s('D02', 0.6, 'ding_hi', 0.24);
  s('C09', 0.05, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
