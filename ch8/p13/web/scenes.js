// 第 8 章 P13《正态分布》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.5。回扣第 7 章高斯积分与辛普森法则。
// A377 钟形曲线 σ 变胖变瘦 · A378 总面积 1 ← √π · A379 IQ 68% / 2.3% 与 68-95-99.7
const SC = {};
const TITLES = [['bell', '钟形曲线'], ['iq', 'IQ 例题'], ['quiz', '随堂一题'], ['outro', '小结']];

const nf13 = (mu, sg) => x => Math.exp(-((x - mu) ** 2) / (2 * sg * sg)) / (sg * Math.sqrt(2 * Math.PI));
const FN13 = nf13(100, 15);
const GN13 = { cx: 620 - 40 * 4.6, cy: 780, ux: 4.6, uy: 13500, x0: 40, x1: 162, y0: 0, y1: 0.03 };
function axesN13(a, ticks) {
  gAxes(GN13, a * 0.75, { grid: false, ticks: { x: ticks || [[100, 'μ']], y: [] } });
}
function bracketN13(x0, x1, y, col, a, txt) {
  if (a <= 0) return; const X0 = gx(GN13, x0), X1 = gx(GN13, x1); seg(X0, y, X1, y, col, a, 2.5); seg(X0, y - 8, X0, y + 8, col, a, 2.5); seg(X1, y - 8, X1, y + 8, col, a, 2.5);
  label(txt, X1 + 46, y, 24, col, a, { bold: true });
}

// ======================= 钟形曲线（A377–A378） =======================
SC.bell = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'K01', 0.05); axesN13(a);
  const sg = t > S('C02') && t < S('G01') ? 15 + 7 * Math.sin((t - P('C02', 0.2)) * 1.6) * ap(t, 'C02', 0.2) : 15;
  const f = nf13(100, sg); gPlot(GN13, f, SQ.K.col, { a, xa: 40, xb: 160, w: 5, p: prog(t, P('K01', 0.2), 1.4) });
  if (t > S('C01')) richReveal([['f(x) = ', CR], ['1/(σ√(2π)) · e^(−(x − μ)²/(2σ²))', GOLD]], 870, 250, 30, t, P('C01', 0.15), { upright: true });
  if (t > S('C02') && t < S('G01') + 0.3) { const q = ap(t, 'C02', 0.2) * fadeOut(t, S('G01'), 0.3); seg(gx(GN13, 100), GN13.cy, gx(GN13, 100), gy(GN13, 0.029), CYAN, q, 2, [8, 6]);
    label('μ：中心', gx(GN13, 100) + 60, gy(GN13, 0.0285), 26, CYAN, q, { bold: true }); label(`σ = ${sg.toFixed(0)}`, 1110, 470, 30, GOLD, q, { bold: true }); }
  if (t > S('G01')) { gBetween(GN13, FN13, () => 0, 40, 160, ap(t, 'G01', 0.1) * 0.8, { col: 'rgba(154,164,184,0.35)' }); label('面积 = 1', gx(GN13, 100), gy(GN13, 0.01), 32, '#ffffff', ap(t, 'G01', 0.2), { bold: true });
    goldBox(870, 330, 380, 56, '∫ e^(−x²) dx = √π', 28, ap(t, 'G01', 0.45)); label('第 7 章', 1120, 330, 24, CYAN, ap(t, 'G01', 0.6), { bold: true }); }
  if (t > S('D01')) stampMark(1110, 470, 40, t, P('D01', 0.2), { text: '用上了', col: GRN, rot: -0.12 });
};

// ======================= IQ（A379） =======================
const TK13 = [[70, '70'], [85, '85'], [100, '100'], [115, '115'], [130, '130'], [145, '145']];
SC.iq = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0.05); axesN13(a, TK13); gPlot(GN13, FN13, SQ.K.col, { a, xa: 40, xb: 160, w: 4 });
  richReveal([['IQ：μ = 100，σ = 15', CR]], 870, 250, 32, t, P('C03', 0.15), { upright: true });
  if (t > S('C04') && t < S('G02') + 0.3) { const q = ap(t, 'C04', 0.3) * fadeOut(t, S('G02'), 0.3); gSimpson(GN13, FN13, 85, 115, 6, GOLD, q);
    richReveal([['没有初等原函数 → ', CR], ['辛普森法则', GOLD]], 870, 305, 30, t, P('C04', 0.15), { upright: true, alpha: fadeOut(t, S('G02'), 0.3) }); }
  if (t > S('G02')) { gBetween(GN13, FN13, () => 0, 85, 115, ap(t, 'G02', 0.1), { col: 'rgba(255,200,60,0.55)' }); label('68%', gx(GN13, 100), gy(GN13, 0.01), 34, '#ffffff', ap(t, 'G02', 0.2), { bold: true });
    gBetween(GN13, FN13, () => 0, 130, 162, ap(t, 'G02', 0.55), { col: 'rgba(255,90,90,0.85)' }); label('2.3%', gx(GN13, 140), gy(GN13, 0.006), 28, RED, ap(t, 'G02', 0.6), { bold: true });
    if (t < S('K02')) richReveal([['P(85 ≤ X ≤ 115) ≈ 68%，  P(X > 130) ≈ 2.3%', CR]], 870, 305, 28, t, P('G02', 0.1), { upright: true }); }
  if (t > S('K02')) { bracketN13(85, 115, 330, GOLD, ap(t, 'K02', 0.05), '68%'); bracketN13(70, 130, 370, CYAN, ap(t, 'K02', 0.3), '95%'); bracketN13(55, 145, 410, GRN, ap(t, 'K02', 0.55), '99.7%'); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['IQ ~ N(100, 15²)，', CR], ['P(X > 140) ≈ ？', GOLD]], 860, 260, 36, t, P('C06', 0.05), { upright: true });
  const a = ap(t, 'C06', 0.3); axesN13(a, [[100, '100'], [130, '130'], [140, '140']]); gPlot(GN13, FN13, SQ.K.col, { a, xa: 40, xb: 160, w: 4 });
  if (t > S('D02')) { gBetween(GN13, FN13, () => 0, 140, 162, ap(t, 'D02', 0.1), { col: 'rgba(255,200,60,0.9)' }); arrow(gx(GN13, 150), gy(GN13, 0.008), gx(GN13, 146), gy(GN13, 0.002), GOLD, ap(t, 'D02', 0.2), 3);
    richReveal([['≈ ', CR], ['0.38%', GOLD], ['（约千分之四）', CR]], 860, 340, 32, t, P('D02', 0.2), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) { richReveal([['总面积 ← ', CR], ['√π', GOLD], ['   概率 ← ', CR], ['数值积分', CYAN]], CX, 340, 42, t, P('C07', 0.1), { upright: true, alpha: ga });
    const G = { cx: CX - 100 * 4, cy: 560, ux: 4, uy: 4500, x0: 40, x1: 160, y0: 0, y1: 0.03 }; gPlot(G, FN13, SQ.K.col, { a: ga * 0.8, xa: 40, xb: 160, w: 3 }); }
  if (t > S('C08') - 0.1) { glowText('下一段：第 8 章收束', CX, 520, 50, CR, t, P('C08', 0.15)); glowText('千问请全员喝奶茶', CX, 610, 32, SQ.Q.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 8 章 · P13 正态分布', '下一段：收束', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM8('Kimi')]);
};

SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.2, 'swell', 0.12); s('C01', 0.15, 'pop', 0.18); s('C02', 0.2, 'warp', 0.12); s('G01', 0.1, 'shimmer', 0.14); s('G01', 0.45, 'ding_hi', 0.24); s('D01', 0.2, 'stamp', 0.24);
  s('C03', 0.15, 'pop', 0.16); s('C04', 0.3, 'marimba', 0.16); s('G02', 0.1, 'ding', 0.22); s('G02', 0.55, 'zap', 0.14); s('K02', 0.05, 'pluck', 0.16); s('K02', 0.3, 'pluck', 0.16); s('K02', 0.55, 'pluck', 0.18);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.2, 'ding_hi', 0.28);
  s('C07', 0.1, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
