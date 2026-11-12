// 第 8 章 P11《概率密度函数》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.5。
// A371 直方图越分越细 → 密度曲线 · A372 概率 = 面积（4 到 8 秒） · A373 均值 = 平衡点（回扣质心）
const SC = {};
const TITLES = [['pdf', '密度函数'], ['prob', '概率是面积'], ['mean', '均值'], ['quiz', '随堂一题'], ['outro', '小结']];

const F11 = x => (x < 0 || x > 10) ? 0 : 0.006 * x * (10 - x);
const GF11 = { cx: 620, cy: 780, ux: 56, uy: 2600, x0: 0, x1: 10.8, y0: 0, y1: 0.17 };
function axesF11(a) {
  gAxes(GF11, a * 0.75, { grid: false, ticks: { x: [[2, '2'], [4, '4'], [5, '5'], [6, '6'], [8, '8'], [10, '10']], y: [[0.15, '0.15']] } });
  label('x（秒）', gx(GF11, 10.8) + 14, GF11.cy + 34, 22, CR, a * 0.8);
}
function fulcrumP11(x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 22, y + 40); ctx.lineTo(x + 22, y + 40); ctx.closePath(); ctx.fill(); ctx.restore(); }

// ======================= 密度函数（A371） =======================
SC.pdf = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'H01', 0.05); axesF11(a);
  const ns = [5, 10, 20, 40], k = Math.min(3, Math.floor(Math.max(0, t - P('C01', 0.05)) / 0.9)), n = t < S('C01') ? 5 : ns[k];
  const ra = a * (t < S('C02') ? 1 : 1 - 0.7 * ap(t, 'C02', 0));
  gRects(GF11, F11, 0, 10, n, 'M', SQ.H.col, ra * 0.85);
  if (t > S('C01')) gPlot(GF11, F11, GOLD, { a: ap(t, 'C01', 0.6), xa: 0, xb: 10, w: 5 });
  if (t > S('C01')) richReveal([['概率密度函数 ', CR], ['f(x)', GOLD]], 870, 250, 34, t, P('C01', 0.2), { upright: true });
  if (t > S('C02')) { gBetween(GF11, F11, () => 0, 0, 10, ap(t, 'C02', 0.4) * 0.6, { col: 'rgba(255,200,60,0.35)' }); richReveal([['f(x) ≥ 0，  ', CR], ['∫ f(x) dx = 1', GOLD]], 870, 310, 32, t, P('C02', 0.15), { upright: true }); }
  if (t > S('G01')) { richReveal([['f(x) = 0.006x(10 − x)', SQ.H.col]], 870, 370, 30, t, P('G01', 0.1), { upright: true }); label('总面积 = 1 ✓', gx(GF11, 5), gy(GF11, 0.06), 34, '#ffffff', ap(t, 'G01', 0.6), { bold: true }); }
};

// ======================= 概率是面积（A372） =======================
SC.prob = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0.05); axesF11(a); gPlot(GF11, F11, GOLD, { a, xa: 0, xb: 10, w: 4 });
  richReveal([['P(a ≤ X ≤ b) = ', CR], ['∫ₐᵇ f(x) dx', GOLD]], 870, 250, 32, t, P('C03', 0.15), { upright: true });
  if (t > S('H02')) gBetween(GF11, F11, () => 0, 4, 8, ap(t, 'H02', 0.2), { col: 'rgba(61,139,255,0.5)', p: prog(t, P('H02', 0.3), 1.0) });
  if (t > S('G02')) { richReveal([['∫₄⁸ 0.006x(10 − x) dx = ', CR], ['0.544', GOLD]], 870, 310, 30, t, P('G02', 0.1), { upright: true }); label('≈ 54%', gx(GF11, 6), gy(GF11, 0.07), 34, '#ffffff', ap(t, 'G02', 0.5), { bold: true }); }
  if (t > S('C04')) { const q = ap(t, 'C04', 0.15), X = gx(GF11, 9); seg(X, GF11.cy, X, gy(GF11, F11(9)), RED, q, 4); label('P(X = 9) = 0', X + 20, gy(GF11, F11(9)) - 40, 26, RED, q, { bold: true });
    label('f 是密度，不是概率', 1080, 440, 28, CYAN, ap(t, 'C04', 0.5), { bold: true }); }
};

// ======================= 均值（A373） =======================
SC.mean = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0.05), wob = 0.06 * Math.sin(t * 3) * Math.exp(-Math.max(0, t - P('C06', 0.1)) * 0.8) * (t > S('C06') ? 1 : 0);
  ctx.save(); const X = gx(GF11, 5); ctx.translate(X, GF11.cy); ctx.rotate(wob); ctx.translate(-X, -GF11.cy);
  axesF11(a); gBetween(GF11, F11, () => 0, 0, 10, a * 0.7, { col: 'rgba(61,139,255,0.45)' }); gPlot(GF11, F11, GOLD, { a, xa: 0, xb: 10, w: 4 }); ctx.restore();
  richReveal([['μ = ', CR], ['∫ x f(x) dx', GOLD]], 870, 250, 34, t, P('C05', 0.15), { upright: true });
  if (t > S('D01')) richReveal([['质心：x̄ = Σmᵢxᵢ / m  →  ∫ x f dx', CYAN]], 870, 310, 28, t, P('D01', 0.2), { upright: true });
  if (t > S('C06')) { fulcrumP11(gx(GF11, 5), GF11.cy + 34, ap(t, 'C06', 0.1)); goldBox(1090, 420, 200, 56, 'μ = 5', 32, ap(t, 'C06', 0.5)); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['同一个 f，', CR], ['P(X ≤ 5) = ？', GOLD]], 860, 260, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); axesF11(a); gPlot(GF11, F11, GOLD, { a, xa: 0, xb: 10, w: 4 });
  if (t > S('D02')) { gBetween(GF11, F11, () => 0, 0, 5, ap(t, 'D02', 0.1), { col: 'rgba(61,139,255,0.5)' }); seg(gx(GF11, 5), GF11.cy, gx(GF11, 5), gy(GF11, 0.16), CYAN, ap(t, 'D02', 0.1), 2, [8, 6]);
    richReveal([['左右对称  ⇒  ', CR], ['0.5', GOLD]], 860, 340, 34, t, P('D02', 0.2), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['面积 = 概率', GOLD]], CX - 200, 360, 44, t, P('C09', 0.1), { upright: true, alpha: ga }); richReveal([['平衡点 = 均值', CYAN]], CX + 200, 360, 44, t, P('C09', 0.4), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：指数分布', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Gemini 揭晓排队的答案', CX, 610, 32, SQ.M.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P11 概率密度', '下一段：指数分布', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM8('混元')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('H01', 0.05, 'type', 0.14); [0, 1, 2, 3].forEach(k => sfx(P('C01', 0.05) + 0.9 * k, 'tick', 0.14)); s('C01', 0.6, 'shimmer', 0.16); s('C02', 0.15, 'pop', 0.16); s('C02', 0.4, 'swell', 0.12); s('G01', 0.1, 'pop', 0.16); s('G01', 0.6, 'check', 0.2);
  s('C03', 0.15, 'pop', 0.16); s('H02', 0.3, 'whoosh', 0.14); s('G02', 0.1, 'pop', 0.16); s('G02', 0.5, 'ding', 0.22); s('C04', 0.15, 'buzz', 0.12);
  s('C05', 0.15, 'pop', 0.16); s('D01', 0.2, 'sparkle', 0.16); s('C06', 0.1, 'thud', 0.18); s('C06', 0.5, 'ding_hi', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.2, 'ding_hi', 0.28);
  s('C09', 0.1, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
