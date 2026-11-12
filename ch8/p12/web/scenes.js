// 第 8 章 P12《均值、中位数与指数分布》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.5。揭晓 P0。
// A374 指数密度曲线 + 平衡点 μ = 5 · A375 18% 与 37% 两块面积 · A376 中位数 3.47 对均值 5
const SC = {};
const TITLES = [['expo', '指数分布'], ['answer', '揭晓答案'], ['median', '中位数'], ['quiz', '随堂一题'], ['outro', '小结']];

const F12 = t => t < 0 ? 0 : 0.2 * Math.exp(-0.2 * t);
const GE12 = { cx: 600, cy: 780, ux: 30, uy: 1900, x0: 0, x1: 20.5, y0: 0, y1: 0.215 };
function axesE12(a) {
  gAxes(GE12, a * 0.75, { grid: false, ticks: { x: [[1, '1'], [5, '5'], [10, '10'], [15, '15'], [20, '20']], y: [[0.2, '0.2']] } });
  label('t（分钟）', gx(GE12, 20.5) + 10, GE12.cy + 34, 22, CR, a * 0.8);
}
function vlineE12(x, col, a, txt, dy = 0) {
  if (a <= 0) return; seg(gx(GE12, x), GE12.cy, gx(GE12, x), gy(GE12, 0.205), col, a, 2.5, [8, 6]); if (txt) label(txt, gx(GE12, x) + 6, gy(GE12, 0.205) - 18 + dy, 24, col, a, { bold: true });
}
function fulcrumE12(x, a) { if (a <= 0) return; const X = gx(GE12, x), Y = GE12.cy + 34; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - 20, Y + 36); ctx.lineTo(X + 20, Y + 36); ctx.closePath(); ctx.fill(); ctx.restore(); }

// ======================= 指数分布（A374） =======================
SC.expo = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'M01', 0.05); axesE12(a);
  gPlot(GE12, F12, SQ.M.col, { a, xa: 0, xb: 20, w: 5, p: prog(t, P('M01', 0.3), 1.4) });
  if (t > S('C01')) richReveal([['f(t) = ', CR], ['(1/μ) e^(−t/μ)', GOLD], ['，t ≥ 0', CR]], 870, 250, 32, t, P('C01', 0.15), { upright: true });
  if (t > S('C02')) richReveal([['μ = 5：  ', CR], ['f(t) = 0.2e^(−0.2t)', SQ.M.col]], 870, 305, 30, t, P('C02', 0.15), { upright: true });
  if (t > S('G01')) { gBetween(GE12, F12, () => 0, 0, 20.5, ap(t, 'G01', 0.15) * 0.8, { col: 'rgba(127,178,255,0.35)', p: prog(t, P('G01', 0.15), 1.2) });
    label('∫₀^∞ f = 1', gx(GE12, 9), gy(GE12, 0.08), 32, '#ffffff', ap(t, 'G01', 0.4), { bold: true }); arrow(gx(GE12, 17), GE12.cy - 24, gx(GE12, 20.4), GE12.cy - 24, CR, ap(t, 'G01', 0.4), 2); }
  if (t > S('C03')) { fulcrumE12(5, ap(t, 'C03', 0.3)); goldBox(1060, 400, 300, 56, 'μ = ∫ t f dt = 5', 28, ap(t, 'C03', 0.5)); }
};

// ======================= 揭晓答案（A375） =======================
SC.answer = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'D01', 0.05); axesE12(a); gPlot(GE12, F12, SQ.M.col, { a, xa: 0, xb: 20, w: 4 });
  if (t > S('D01') && t < S('C04') + 0.6) { const q = ap(t, 'D01', 0.3) * fadeOut(t, S('C04') + 0.2, 0.4); label('1/5 = 20% ？', 870, 260, 36, SQ.D.col, q, { bold: true }); }
  if (t > S('C04')) { gBetween(GE12, F12, () => 0, 0, 1, ap(t, 'C04', 0.1), { col: 'rgba(255,200,60,0.7)' });
    crossMark(1060, 260, 22, RED, t, P('C04', 0.15));
    richReveal([['P(T ≤ 1) = 1 − e^(−0.2) ≈ ', CR], ['18%', GOLD]], 870, 310, 30, t, P('C04', 0.3), { upright: true });
    label('18%', gx(GE12, 0.5) + 40, gy(GE12, 0.2) - 10, 30, GOLD, ap(t, 'C04', 0.5), { bold: true }); }
  if (t > S('G02')) { gBetween(GE12, F12, () => 0, 5, 20.5, ap(t, 'G02', 0.1), { col: 'rgba(92,200,232,0.55)' });
    richReveal([['P(T > 5) = e⁻¹ ≈ ', CR], ['37%', CYAN]], 870, 365, 30, t, P('G02', 0.2), { upright: true });
    label('37%', gx(GE12, 9), gy(GE12, 0.06) - 10, 30, CYAN, ap(t, 'G02', 0.4), { bold: true }); }
};

// ======================= 中位数（A376） =======================
const MED12 = 5 * Math.log(2);
SC.median = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'M02', 0.05); axesE12(a); gPlot(GE12, F12, SQ.M.col, { a, xa: 0, xb: 20, w: 4 });
  if (t > S('C05')) { gBetween(GE12, F12, () => 0, 0, MED12, ap(t, 'C05', 0.15), { col: 'rgba(255,200,60,0.55)', p: prog(t, P('C05', 0.15), 0.8) });
    vlineE12(MED12, GOLD, ap(t, 'C05', 0.4), 'm ≈ 3.47'); label('½', gx(GE12, 1.6), gy(GE12, 0.06), 34, '#ffffff', ap(t, 'C05', 0.4), { bold: true });
    richReveal([['1 − e^(−m/5) = ½  ⇒  ', CR], ['m = 5 ln 2 ≈ 3.47', GOLD]], 870, 260, 30, t, P('C05', 0.3), { upright: true }); }
  if (t > S('C06')) { vlineE12(5, CYAN, ap(t, 'C06', 0.1), 'μ = 5', 34); label('长尾把均值拉高 →', gx(GE12, 13), gy(GE12, 0.05), 28, CYAN, ap(t, 'C06', 0.4), { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['μ = 5，', CR], ['P(T > 10) = ？', GOLD]], 860, 260, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); axesE12(a); gPlot(GE12, F12, SQ.M.col, { a, xa: 0, xb: 20, w: 4 });
  if (t > S('D02')) { gBetween(GE12, F12, () => 0, 10, 20.5, ap(t, 'D02', 0.1), { col: 'rgba(255,200,60,0.7)' });
    richReveal([['e⁻² ≈ ', CR], ['0.135', GOLD]], 860, 340, 36, t, P('D02', 0.2), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { busyWin(CX, 330, 520, 150, '服务器繁忙', '18% · 37% · 中位数 3.5 分钟', t, P('C09', 0.05), { col: SQ.D.col, alpha: ga, size: 30, spin: false });
    stampMark(CX + 230, 290, 44, t, P('C09', 0.5), { text: '已解决', col: GRN, rot: -0.15, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：正态分布', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Kimi 讲钟形曲线', CX, 610, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P12 指数分布', '下一段：正态分布', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM8('Gemini')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.05, 'type', 0.14); s('M01', 0.3, 'riser', 0.12); s('C01', 0.15, 'pop', 0.18); s('C02', 0.15, 'pop', 0.16); s('G01', 0.15, 'swell', 0.12); s('G01', 0.4, 'check', 0.2); s('C03', 0.3, 'thud', 0.18); s('C03', 0.5, 'ding', 0.22);
  s('D01', 0.3, 'pop', 0.16); s('C04', 0.1, 'zap', 0.14); s('C04', 0.15, 'buzz', 0.12); s('C04', 0.3, 'ding_hi', 0.24); s('G02', 0.1, 'whoosh', 0.14); s('G02', 0.2, 'ding', 0.22);
  s('M02', 0.1, 'sparkle', 0.16); s('C05', 0.15, 'swell', 0.12); s('C05', 0.3, 'ding', 0.22); s('C06', 0.1, 'tick', 0.14); s('C06', 0.4, 'pop', 0.16);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.2, 'ding_hi', 0.28);
  s('C09', 0.05, 'glitch', 0.16); s('C09', 0.5, 'stamp', 0.26); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
