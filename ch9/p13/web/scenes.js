// 第 9 章 P13《二阶常系数齐次方程》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 7.6–7.7。
// A422 猜 e^(rx) → 特征方程 · A423 三种情形表（每行配根平面 + 小曲线）· A424 重根例题 y = (4 + 2x)e^(−x)
const SC = {};
const TITLES = [['guess', '猜指数'], ['table', '三种情形'], ['ex', '重根例题'], ['quiz', '随堂一题'], ['outro', '小结']];

const Y13 = x => (4 + 2 * x) * Math.exp(-x);
const GE13 = { cx: 600, cy: 760, ux: 95, uy: 95, x0: 0, x1: 6, y0: 0, y1: 4.6 };

// 小曲线：在矩形 (x, y, w, h) 内画函数 f 在 [a, b] 上的图像，纵向按 [lo, hi] 映射
function mini13(x, y, w, h, f, a0, b0, lo, hi, col, a, p = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.4)'; ctx.lineWidth = 1.5;
  const zy = y + h - (0 - lo) / (hi - lo) * h; ctx.beginPath(); ctx.moveTo(x, clamp(zy, y, y + h)); ctx.lineTo(x + w, clamp(zy, y, y + h)); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.beginPath();
  const n = 120; for (let i = 0; i <= n * p; i++) { const u = a0 + (b0 - a0) * i / n, v = clamp(f(u), lo, hi); const X = x + w * i / n, Y = y + h - (v - lo) / (hi - lo) * h; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.stroke(); ctx.restore();
}

// ======================= 猜指数（A422） =======================
SC.guess = t => {
  starfield(t); blueprint(0.3, 80);
  goldBox(870, 240, 440, 64, 'y″ + py′ + qy = 0', 34, ap(t, 'C01', 0.1));
  if (t > S('C02')) {
    richReveal([['y = e^{rx}：', SQ.Z.col], ['y′ = re^{rx}，y″ = r²e^{rx}', CR]], 870, 340, 30, t, P('C02', 0.05), { upright: true });
    richReveal([['(r² + pr + q)', GOLD], [' · e^{rx} = 0', CR]], 870, 410, 32, t, P('C02', 0.5), { upright: true });
  }
  if (t > S('G01')) { const k = ap(t, 'G01', 0.1); panel(620, 450, 500, 80, GOLD, k); mathText('r² + pr + q = 0', 870, 502, 34, GOLD, { alpha: k, upright: true, align: 'center' }); label('特征方程', 870, 560, 26, GOLD, ap(t, 'G01', 0.4), { bold: true }); }
  if (t > S('C03')) richReveal([['y = ', CR], ['C₁y₁ + C₂y₂', CYAN]], 870, 650, 34, t, P('C03', 0.2), { upright: true });
};

// ======================= 三种情形（A423） =======================
const ROWS13 = [
  { id: 'Z01', h: '两个不等实根', f: 'C₁e^{r₁x} + C₂e^{r₂x}', ex: 'r = 2, 3', roots: [[2, 0, CYAN], [3, 0, CYAN]], col: CYAN, g: x => Math.exp(2 * x) + 0.3 * Math.exp(3 * x), a0: -2, b0: 0.8, lo: -1, hi: 9 },
  { id: 'Z02', h: '重根 r', f: '(C₁ + C₂x)e^{rx}', ex: 'r = −1（二重）', roots: [[-1, 0, GOLD]], col: GOLD, g: Y13, a0: 0, b0: 6, lo: -0.5, hi: 4.6 },
  { id: 'C05', h: '共轭复根 α ± βi', f: 'e^{αx}(C₁cos βx + C₂sin βx)', ex: 'r = 1 ± 2i', roots: [[1, 2, SQ.Z.col], [1, -2, SQ.Z.col]], col: SQ.Z.col, g: x => Math.exp(x) * Math.cos(2 * x), a0: -3, b0: 2.2, lo: -8, hi: 8 },
];
SC.table = t => {
  starfield(t); blueprint(0.35, 80);
  ROWS13.forEach((r, i) => {
    const k = ap(t, r.id, 0.05); if (k <= 0) return; const y = 220 + i * 175;
    panel(540, y, 660, 155, r.col, k);
    label(r.h, 700, y + 38, 26, r.col, k, { bold: true });
    mathText(r.f, 700, y + 88, 23, CR, { alpha: k, upright: true, align: 'center' });
    label(r.ex, 700, y + 132, 22, GOLD, ap(t, r.id, 0.4));
    rootPlane(940, y + 78, 17, r.roots, k, { R: 3.6, t: (t - P(r.id, 0.2)) * 2 });
    const ex = r.id === 'Z01' ? 'C04' : r.id === 'C05' ? 'Z03' : 'Z02';
    mini13(1030, y + 20, 150, 115, r.g, r.a0, r.b0, r.lo, r.hi, r.col, ap(t, ex, 0.1), prog(t, P(ex, 0.15), 0.8));
  });
};

// ======================= 重根例题（A424） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['y″ + 2y′ + y = 0，', CR], ['y(0) = 4，y′(0) = −2', GOLD]], 870, 230, 32, t, P('C06', 0.1), { upright: true });
  if (t > S('G02')) richReveal([['(r + 1)² = 0  ⇒  ', CR], ['y = (C₁ + C₂x)e^{−x}', CYAN]], 870, 310, 32, t, P('G02', 0.1), { upright: true });
  if (t > S('C07')) {
    const a = ap(t, 'C07', 0);
    richReveal([['C₁ = 4，C₂ = 2', GOLD]], 870, 390, 32, t, P('C07', 0.05), { upright: true });
    gAxes(GE13, a * 0.75, { grid: false, ticks: { x: [[2, '2'], [4, '4'], [6, '6']], y: [[2, '2'], [4, '4']] } });
    gPlot(GE13, Y13, GOLD, { a, w: 5, p: prog(t, P('C07', 0.2), 0.8) });
    gDot(GE13, 0, 4, GOLD, a);
    goldBox(1020, 520, 340, 60, 'y = (4 + 2x)e^{−x}', 28, ap(t, 'C07', 0.5));
    checkMark(1210, 520, 22, GRN, t, P('C07', 0.8));
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['y″ + 4y = 0', CR], ['  通解？', GOLD]], 860, 260, 40, t, P('C09', 0.05), { upright: true });
  if (t > S('D01')) {
    richReveal([['r = ±2i  ⇒  ', CR], ['C₁cos 2x + C₂sin 2x', GOLD]], 860, 370, 36, t, P('D01', 0.15), { upright: true });
    rootPlane(860, 560, 40, [[0, 2, SQ.Z.col, '2i', 30], [0, -2, SQ.Z.col, '−2i', 34]], ap(t, 'D01', 0.3), { R: 2.8, t: (t - P('D01', 0.3)) * 2 });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) richReveal([['实根 · 重根 · 复根', GOLD]], CX, 400, 48, t, P('C10', 0.05), { upright: true, alpha: ga });
  if (t > S('C11') - 0.1) { glowText('下一段：待定系数法', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('Gemini：猜一个长得像的', CX, 610, 32, SQ.M.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P13 二阶常系数齐次方程', '下一段：待定系数', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM9('GLM')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'ding', 0.2); s('C02', 0.05, 'pop', 0.16); s('C02', 0.5, 'click', 0.16); s('G01', 0.1, 'shimmer', 0.16); s('G01', 0.4, 'ding_lo', 0.16); s('C03', 0.2, 'pop', 0.16);
  s('Z01', 0.05, 'swoosh_in', 0.16); s('C04', 0.15, 'pluck', 0.16); s('Z02', 0.05, 'swoosh_in', 0.16); s('Z02', 0.15, 'pluck', 0.16); s('C05', 0.05, 'swoosh_in', 0.16); s('Z03', 0.15, 'pluck', 0.16);
  s('C06', 0.1, 'pop', 0.16); s('G02', 0.1, 'pop', 0.16); s('C07', 0.05, 'pop', 0.16); s('C07', 0.5, 'ding', 0.18); s('C07', 0.8, 'check', 0.2);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.15, 'whoosh', 0.14); s('D01', 0.4, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
