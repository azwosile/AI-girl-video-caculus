// 第 9 章 P4《可分离变量方程》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.3 例 1。
// A395 两摞书：y 的归左、x 的归右 · A396 例 1 推导 + 解曲线叠回方向场 · A397 推出指数增长，补回丢掉的 y = 0
const SC = {};
const TITLES = [['sep', '分离变量'], ['ex', '例 1'], ['exp', '指数增长'], ['quiz', '随堂一题'], ['outro', '小结']];

const F4 = (x, y) => x * x / (y * y), Y4 = x => Math.cbrt(x * x * x + 8);
const GS4 = { cx: 900, cy: 780, ux: 135, uy: 140, x0: -2.1, x1: 2.1, y0: 0, y1: 3.3 };
function books4(x, y, n, col, txt, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < n; i++) { ctx.fillStyle = hexA(col, 0.35 + 0.1 * (i % 3)); ctx.strokeStyle = col; ctx.lineWidth = 2; rr(x - 90 + (i % 2) * 8, y - 26 * (i + 1), 180, 22, 5); ctx.fill(); ctx.stroke(); }
  ctx.restore(); label(txt, x, y + 30, 30, col, a, { bold: true });
}

// ======================= 分离变量（A395） =======================
SC.sep = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'Z01', 0.1);
  books4(700, 720, 5, RED, 'y 的', a); books4(1040, 720, 5, CYAN, 'x 的', ap(t, 'Z01', 0.4));
  if (t > S('C01')) richReveal([['dy/dx = ', CR], ['g(x)', CYAN], [' · ', CR], ['f(y)', RED]], 870, 260, 40, t, P('C01', 0.2), { upright: true });
  if (t > S('C02')) {
    richReveal([['dy / f(y)', RED], ['  =  ', CR], ['g(x) dx', CYAN]], 870, 350, 40, t, P('C02', 0.15), { upright: true });
    richReveal([['∫ dy / f(y)', RED], ['  =  ', CR], ['∫ g(x) dx', CYAN]], 870, 440, 40, t, P('C02', 0.55), { upright: true });
  }
};

// ======================= 例 1（A396） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C03', 0) * fadeOut(t, S('G01'), 0.4);
  if (ga > 0) {
    richReveal([['dy/dx = x²/y²，', CR], ['y(0) = 2', GOLD]], 870, 250, 36, t, P('C03', 0.1), { upright: true, alpha: ga });
    if (t > S('C04')) { richReveal([['y² dy', RED], [' = ', CR], ['x² dx', CYAN]], 870, 340, 36, t, P('C04', 0.1), { upright: true, alpha: ga });
      richReveal([['y³/3', RED], [' = ', CR], ['x³/3 + C', CYAN]], 870, 420, 36, t, P('C04', 0.55), { upright: true, alpha: ga }); }
    if (t > S('Z02')) { richReveal([['y(0) = 2  ⇒  ', CR], ['C = 8/3', GOLD]], 870, 500, 34, t, P('Z02', 0.1), { upright: true, alpha: ga });
      goldBox(870, 600, 360, 70, 'y = ∛(x³ + 8)', 38, ap(t, 'Z02', 0.5) * ga); }
  }
  if (t > S('G01') - 0.1) {
    const a = ap(t, 'G01', 0);
    gAxes(GS4, a * 0.6, { grid: false, ticks: { x: [[-2, '−2'], [-1, '−1'], [1, '1'], [2, '2']], y: [[1, '1'], [2, '2'], [3, '3']] } });
    slopeField(GS4, F4, a * 0.7, { sx: 0.3, sy: 0.3, len: 26, oy: 0.3 });
    gPlot(GS4, Y4, SQ.Z.col, { a, xa: -1.999, xb: 2.1, w: 5, p: prog(t, P('G01', 0.2), 1.2) }); gDot(GS4, 0, 2, GOLD, a);
    label('y = ∛(x³ + 8)', 1080, 300, 30, SQ.Z.col, ap(t, 'G01', 0.4), { bold: true });
  }
};

// ======================= 指数增长（A397） =======================
SC.exp = t => {
  starfield(t); blueprint(0.35, 80);
  label('第 3 章：y = y₀eᵏᵗ（直接给结论）', 870, 240, 30, CR, ap(t, 'C05', 0.1), { bold: true });
  if (t > S('C06')) {
    const rows = [[['dy/dt = ky', GOLD]], [['dy / y', RED], [' = ', CR], ['k dt', CYAN]], [['ln|y| = kt + C', CR]], [['y = y₀ e^{kt}', GOLD]]];
    rows.forEach((r, i) => richReveal(r, 870, 320 + i * 80, 36, t, P('C06', 0.05 + 0.22 * i), { upright: true }));
  }
  if (t > S('D01')) { const a = ap(t, 'D01', 0.2); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RED; ctx.lineWidth = 3; rr(760, 375, 110, 50, 10); ctx.stroke(); ctx.restore(); label('y = 0 ？', 1080, 400, 32, RED, a, { bold: true }); }
  if (t > S('C07')) { goldBox(870, 680, 420, 64, '另补：y ≡ 0 也是解', 32, ap(t, 'C07', 0.3)); checkMark(1110, 680, 24, GRN, t, P('C07', 0.5)); }
};

// ======================= 随堂 =======================
const GQZ4 = { cx: 880, cy: 780, ux: 150, uy: 70, x0: -2, x1: 2, y0: 0, y1: 7.6 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['dy/dx = xy，y(0) = 1  ⇒  ', CR], ['y = ？', GOLD]], 860, 250, 36, t, P('C09', 0.05), { upright: true });
  if (t > S('D02')) {
    richReveal([['dy/y = x dx  ⇒  ', CR], ['y = e^{x²/2}', GOLD]], 860, 330, 36, t, P('D02', 0.2), { upright: true });
    const a = ap(t, 'D02', 0.4); gAxes(GQZ4, a * 0.6, { grid: false, ticks: { x: [[-1, '−1'], [1, '1']], y: [[1, '1']] } });
    gPlot(GQZ4, x => Math.exp(x * x / 2), GOLD, { a, w: 4, p: prog(t, P('D02', 0.5), 0.8) }); gDot(GQZ4, 0, 1, GOLD, a);
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) richReveal([['y 归左', RED], [' · ', CR], ['x 归右', CYAN], [' · 两边积分', GOLD]], CX, 400, 46, t, P('C10', 0.05), { upright: true, alpha: ga });
  if (t > S('C11') - 0.1) { glowText('下一段：混合问题与冷却定律', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('千问的奶茶多久能喝', CX, 610, 32, SQ.Q.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P4 分离变量', '下一段：混合与冷却', [...CREDIT_BASE, ...CREDIT_GEN('GLM '), ...CREDIT_END, CREDIT_TM9('GLM')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Z01', 0.1, 'thud', 0.18); s('Z01', 0.4, 'thud', 0.18); s('C01', 0.2, 'pop', 0.18); s('C02', 0.15, 'swoosh_in', 0.16); s('C02', 0.55, 'ding', 0.2);
  s('C03', 0.1, 'pop', 0.18); s('C04', 0.1, 'pop', 0.16); s('C04', 0.55, 'pop', 0.16); s('Z02', 0.1, 'pop', 0.16); s('Z02', 0.5, 'ding_hi', 0.24); s('G01', 0.2, 'riser', 0.14); s('G01', 0.4, 'check', 0.2);
  s('C05', 0.1, 'pop', 0.16); [0.05, 0.27, 0.49, 0.71].forEach(f => s('C06', f, 'marimba', 0.14)); s('D01', 0.2, 'buzz', 0.18); s('C07', 0.3, 'ding', 0.22); s('C07', 0.5, 'check', 0.2);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.2, 'whoosh', 0.14); s('D02', 0.4, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
