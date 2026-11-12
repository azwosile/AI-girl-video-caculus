// 第 9 章 P5《混合问题与冷却定律》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.3 例 6。
// A398 盐水箱：流入 0.75、流出 y/200 · A399 y = 150 − 130e^(−t/200) 趋于 150 · A400 奶茶冷却曲线：60°C@10 分钟，40°C@22.4 分钟
const SC = {};
const TITLES = [['mix', '混合问题'], ['cool', '冷却定律'], ['quiz', '随堂一题'], ['outro', '小结']];

const Y5 = t => 150 - 130 * Math.exp(-t / 200);
const GM5 = { cx: 620, cy: 790, ux: 0.72, uy: 2.9, x0: 0, x1: 800, y0: 0, y1: 170 };
const K5 = Math.log(7 / 4) / 10, T5 = t => 20 + 70 * Math.exp(-K5 * t);
const GC5 = { cx: 620, cy: 790, ux: 13, uy: 4.8, x0: 0, x1: 45, y0: 0, y1: 100 };
function axesC5(a) { gAxes(GC5, a * 0.75, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30'], [40, '40']], y: [[20, '20'], [40, '40'], [60, '60'], [90, '90']] } });
  label('t（分钟）', gx(GC5, 45) - 10, GC5.cy + 40, 22, CR, a * 0.8); label('T（°C）', gx(GC5, 0) - 10, gy(GC5, 100) - 20, 24, CR, a * 0.8, { bold: true }); }

// ======================= 混合问题（A398–A399） =======================
SC.mix = t => {
  starfield(t); blueprint(0.3, 80);
  const ta = ap(t, 'C01', 0.05) * fadeOut(t, S('C04'), 0.4);
  if (ta > 0) {
    const conc = t > S('C02') ? 0.15 + 0.25 * clamp((t - S('C02')) / 12) : 0.15;
    tank(760, 560, 300, 280, 0.82, conc, t, ta, { inLab: t > S('C02') ? '25 L/min · 0.03 kg/L' : '', outLab: t > S('C02') ? '25 L/min' : '', mid: '5000 L · 20 kg 盐', ls: 22, ms: 26 });
    if (t > S('G01')) { richReveal([['流入 ', GOLD], ['0.03 × 25 = 0.75', CR]], 1050, 330, 28, t, P('G01', 0.05), { upright: true, alpha: ta });
      richReveal([['流出 ', CYAN], ['(y/5000) × 25 = y/200', CR]], 1050, 400, 28, t, P('G01', 0.5), { upright: true, alpha: ta }); }
    if (t > S('C03')) { goldBox(1050, 500, 330, 64, 'dy/dt = 0.75 − y/200', 28, ap(t, 'C03', 0.1) * ta); label('≈ dN/dt = 30 − 0.1N', 1050, 570, 26, SQ.D.col, ap(t, 'C03', 0.5) * ta, { bold: true }); }
  }
  if (t > S('C04') - 0.1) {
    const a = ap(t, 'C04', 0);
    gAxes(GM5, a * 0.75, { grid: false, ticks: { x: [[200, '200'], [400, '400'], [600, '600'], [800, '800']], y: [[50, '50'], [100, '100'], [150, '150']] } });
    label('t（分钟）', gx(GM5, 800) - 10, GM5.cy + 40, 22, CR, a * 0.8); label('y（kg）', gx(GM5, 0) - 10, gy(GM5, 170) - 16, 24, CR, a, { bold: true });
    richReveal([['y = 150 − 130e^{−t/200}', GOLD]], 960, 240, 32, t, P('C04', 0.05), { upright: true });
    gPlot(GM5, Y5, GOLD, { a, w: 4.5, xa: 0, xb: 800, p: prog(t, P('C04', 0.2), 1.4) });
    gH(GM5, 150, CR, a * 0.6, { dash: [10, 8] }); label('150', gx(GM5, 800) + 30, gy(GM5, 150), 24, CR, a * 0.8, { bold: true });
    if (t > P('C04', 0.55)) { gDot(GM5, 30, Y5(30), CYAN, ap(t, 'C04', 0.6)); label('y(30) ≈ 38.1', gx(GM5, 30) + 100, gy(GM5, Y5(30)) + 26, 26, CYAN, ap(t, 'C04', 0.6), { bold: true }); }
  }
};

// ======================= 冷却定律（A400） =======================
SC.cool = t => {
  starfield(t); blueprint(0.35, 80);
  const tt = t > S('C06') ? clamp((t - P('C06', 0.2)) / 6) * 23 : 0, Tn = T5(tt);
  teaCup(1080, 360, 0.75, clamp((Tn - 40) / 50), t, ap(t, 'Q01', 0.05));
  thermo(1175, 330, 160, Tn, 0, 100, ap(t, 'Q01', 0.2), { size: 24 });
  if (t > S('C05')) { richReveal([['dT/dt = ', CR], ['−k(T − 20)', GOLD]], 820, 240, 34, t, P('C05', 0.1), { upright: true }); axesC5(ap(t, 'C05', 0.3)); gH(GC5, 20, CYAN, ap(t, 'C05', 0.5) * 0.7, { dash: [10, 8] }); label('室温 20', gx(GC5, 40), gy(GC5, 20) - 20, 22, CYAN, ap(t, 'C05', 0.5), { bold: true }); }
  if (t > S('C06')) {
    richReveal([['T − 20 = 70e^{−kt}', GOLD]], 820, 300, 30, t, P('C06', 0.05), { upright: true });
    gPlot(GC5, T5, SQ.Q.col, { a: ap(t, 'C06', 0.1), w: 4.5, xa: 0, xb: Math.max(0.01, tt) });
    if (t > P('C06', 0.55)) { gDot(GC5, 10, 60, GOLD, ap(t, 'C06', 0.6)); label('(10, 60)', gx(GC5, 10) + 60, gy(GC5, 60) - 10, 24, GOLD, ap(t, 'C06', 0.6), { bold: true }); label('k = ln(7/4)/10 ≈ 0.056', 820, 355, 26, CR, ap(t, 'C06', 0.7), { bold: true }); }
  }
  if (t > S('Q02')) { gH(GC5, 40, RED, ap(t, 'Q02', 0.2) * 0.7, { dash: [8, 6], xb: 22.4 }); }
  if (t > S('C07')) { gV(GC5, 22.4, RED, ap(t, 'C07', 0.1) * 0.8, { ya: 0, yb: 40, dash: [8, 6] }); gDot(GC5, 22.4, 40, RED, ap(t, 'C07', 0.1)); label('t ≈ 22.4 分钟', gx(GC5, 22.4) + 90, gy(GC5, 40) - 26, 28, RED, ap(t, 'C07', 0.3), { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['t → ∞ 时，', CR], ['T → ？', GOLD]], 860, 250, 38, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.3); axesC5(a); gPlot(GC5, T5, SQ.Q.col, { a, w: 4 });
  if (t > S('D01')) { gH(GC5, 20, GOLD, ap(t, 'D01', 0.1), { w: 4 }); label('T → 20°C', gx(GC5, 36), gy(GC5, 20) - 28, 32, GOLD, ap(t, 'D01', 0.2), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { inOutCard(CX, 360, 560, '恒定', '∝ 当前量', t, P('C10', 0.05), { alpha: ga }); richReveal([['→ 趋于 ', CR], ['平衡值', GOLD]], CX, 490, 44, t, P('C10', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：从指数增长到 logistic', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('豆包的梗传播', CX, 610, 32, SQ.B.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P5 混合与冷却', '下一段：logistic', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM9('千问')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.05, 'pop', 0.18); s('C02', 0.1, 'hum', 0.1); s('G01', 0.05, 'pop', 0.16); s('G01', 0.5, 'pop', 0.16); s('C03', 0.1, 'ding', 0.22); s('C03', 0.5, 'sparkle', 0.14);
  s('C04', 0.05, 'swoosh_in', 0.14); s('C04', 0.2, 'riser', 0.12); s('C04', 0.6, 'ding', 0.2);
  s('Q01', 0.05, 'pop', 0.18); s('C05', 0.1, 'pop', 0.16); s('C06', 0.05, 'pop', 0.16); s('C06', 0.6, 'tick', 0.18); s('Q02', 0.2, 'tick', 0.16); s('C07', 0.1, 'ding_hi', 0.24);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C10', 0.5, 'ding', 0.18); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
