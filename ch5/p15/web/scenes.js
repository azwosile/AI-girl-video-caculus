// 第 5 章 P15《反常积分初步》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A238 1/x² 与 1/x 两条尾巴向右延伸、面积计数器 · A239 部分积分表 t = 10、100、1000 · A240 p 的分界线 · A241 1/√x 在 0 附近的无界尖峰
const SC = {};
const TITLES = [['inf', '无穷区间'], ['p', 'p 积分'], ['unb', '无界函数'], ['quiz', '随堂一题'], ['outro', '小结']];
const GI = { cx: 480, cy: 790, ux: 85, uy: 330, x0: 0.7, x1: 11.2, y0: -0.05, y1: 1.25 };
const I2 = x => 1 / (x * x), I1 = x => 1 / x;
SC.inf = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'M01', 0);
  gAxes(GI, a, { grid: false, xl: 'x', ticks: { x: [[1, '1'], [5, '5'], [10, '10']], y: [[1, '1']] } });
  const show1 = t > S('C03') - 0.1;
  const T = t < S('C02') ? 1.001 : lerp(1.001, 10.8, clamp((t - P('C02', 0.1)) / 3.5));
  const T1 = show1 ? lerp(1.001, 10.8, clamp((t - P('C03', 0.1)) / 3)) : 0;
  if (show1) gArea(GI, I1, 1, T1, ap(t, 'C03', 0) * 0.5, { pos: RED });
  gArea(GI, I2, 1, T, 0.8, { pos: CYAN });
  gPlot(GI, I2, CYAN, { a, xa: 0.9, xb: 11, w: 4 }); mathText('1/x²', gx(GI, 2.6), gy(GI, I2(2.6)) + 30, 24, CYAN, { align: 'center', alpha: a, upright: true });
  if (show1) { gPlot(GI, I1, RED, { a: ap(t, 'C03', 0), xa: 0.9, xb: 11, w: 4 }); mathText('1/x', gx(GI, 7), gy(GI, I1(7)) - 24, 24, RED, { align: 'center', alpha: ap(t, 'C03', 0), upright: true }); }
  if (t > S('C01') - 0.1 && t < S('C02')) label('先截到 t，再 t → ∞', 1100, 300, 30, GOLD, ap(t, 'C01', 0.3), { bold: true });
  if (t > S('C02') - 0.1) {
    gV(GI, T, GOLD, 0.9, { ya: 0, yb: 1.2, dash: [6, 5] }); mathText('t', gx(GI, T), gy(GI, 0) + 30, 24, GOLD, { align: 'center', upright: true });
    panel(940, 210, 520, 210, CYAN, ap(t, 'C02', 0)); mathText('t        ∫₁ᵗ 1/x²' + (show1 ? '        ∫₁ᵗ 1/x' : ''), 1200, 250, 24, CR, { align: 'center', alpha: ap(t, 'C02', 0), upright: true });
    [10, 100, 1000].forEach((v, i) => { const p = ap(t, 'C02', 0.35 + i * 0.15); if (p <= 0) return; mathText(`${v}          ${(1 - 1 / v).toFixed(3)}` + (show1 ? `          ${Math.log(v).toFixed(2)}` : ''), 1200, 295 + i * 40, 24, CR, { align: 'center', alpha: p * (show1 && t < S('C03') + 0.4 ? 1 : 1), upright: true }); });
    richReveal([['→ ', CR], ['1', GOLD]], 1060, 460, 34, t, P('C02', 0.8), { upright: true });
  }
  if (show1) richReveal([['→ ', CR], ['∞ 发散', RED]], 1330, 460, 30, t, P('C03', 0.6), { upright: true });
  if (t > S('M02') - 0.1 && t < S('C03')) label('无限长，面积 = 1', 1200, 530, 30, SQ.M.col, ap(t, 'M02', 0.1), { bold: true });
};
SC.p = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['∫₁^∞ (1/xᵖ) dx', CR]], CX, 280, 44, t, P('G01', 0.05), { upright: true });
  const a = ap(t, 'G01', 0.3), y = 520, X = p => 640 + (p - 0) * 230;
  seg(X(-0.3), y, X(2.9), y, hexA(CR, 0.5), a, 3);
  seg(X(-0.3), y, X(1), y, RED, a, 10); seg(X(1), y, X(2.9), y, GRN, a, 10);
  gDot({ cx: 0, cy: 0, ux: 1, uy: -1 }, X(1), -y, RED, a);
  [0, 1, 2].forEach(v => mathText(String(v), X(v), y + 44, 26, CR, { align: 'center', alpha: a, upright: true })); mathText('p', X(2.9) + 30, y + 8, 28, CR, { alpha: a, upright: true });
  label('p ≤ 1：发散', X(0.35), y - 50, 32, RED, ap(t, 'G01', 0.5), { bold: true }); label('p > 1：收敛', X(2), y - 50, 32, GRN, ap(t, 'G01', 0.7), { bold: true });
  mathText('1/x', X(1), y + 90, 24, RED, { align: 'center', alpha: ap(t, 'G01', 0.8), upright: true }); mathText('1/x²', X(2), y + 90, 24, GRN, { align: 'center', alpha: ap(t, 'G01', 0.8), upright: true });
};
SC.unb = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('D01') - 0.1) {
    const G = { cx: 620, cy: 800, ux: 560, uy: 75, x0: -0.05, x1: 1.2, y0: -0.2, y1: 7.2 }, a = ap(t, 'C04', 0), f = x => 1 / Math.sqrt(x);
    const tt = lerp(0.6, 0.005, clamp((t - P('C04', 0.4)) / 3));
    gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[1, '1']], y: [[2, '2'], [6, '6']] } });
    ctx.save(); gClip(G); gArea(G, x => Math.min(f(x), 7.2), tt, 1, a * 0.8); gPlot(G, f, RED, { a, xa: 0.018, xb: 1.15, n: 400, w: 4 }); ctx.restore();
    gV(G, tt, GOLD, a, { ya: 0, yb: 7.2, dash: [6, 5] }); mathText('t', gx(G, tt) + 14, gy(G, 0) + 30, 24, GOLD, { alpha: a, upright: true });
    mathText('y = 1/√x', gx(G, 0.45), gy(G, f(0.45)) - 24, 24, RED, { alpha: a, upright: true });
    richReveal([['∫ₜ¹ 1/√x dx = 2 − 2√t', CR]], 1210, 300, 28, t, P('C04', 0.3), { upright: true });
    richReveal([['t → 0⁺：  ', CR], ['2', GOLD]], 1210, 370, 36, t, P('C04', 0.75), { upright: true });
    return;
  }
  const G = { cx: 760, cy: 800, ux: 160, uy: 50, x0: -1.3, x1: 3.3, y0: -0.4, y1: 10.5 }, a = ap(t, 'D01', 0);
  gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[-1, '−1'], [3, '3']] } });
  ctx.save(); gClip(G); gArea(G, x => Math.min(I2(x), 10.5), -1, -0.02, a * 0.6); gArea(G, x => Math.min(I2(x), 10.5), 0.02, 3, a * 0.6); gPlot(G, I2, RED, { a, xa: -1.25, xb: -0.25, w: 4 }); gPlot(G, I2, RED, { a, xa: 0.25, xb: 3.2, w: 4 }); ctx.restore();
  panel(1000, 215, 460, 90, INV, a); richReveal([['P9：∫₋₁³ (1/x²) dx = −4/3 ？', INV]], 1230, 260, 26, t, P('D01', 0.2), { upright: true });
  if (t > S('C05') - 0.1) { const c = ap(t, 'C05', 0); richReveal([['= ∫₋₁⁰ + ∫₀³', CR]], 1230, 360, 30, t, P('C05', 0.15), { upright: true }); richReveal([['∫₀³ (1/x²) dx = ∞  ⇒  ', CR], ['发散', RED]], 1230, 420, 28, t, P('C05', 0.5), { upright: true }); crossMark(1470, 260, 22, RED, t, P('C05', 0.7)); }
};
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫₁^∞ (1/x³) dx = ？', CR]], 820, 360, 48, t, P('C07', 0.1), { upright: true });
  if (t > S('D02')) { richReveal([['lim (1/2)(1 − 1/t²)', CYAN]], 820, 460, 32, t, P('D02', 0.05), { upright: true }); richReveal([['= ', CR], ['1/2', GOLD]], 820, 550, 50, t, P('D02', 0.5), { upright: true }); }
};
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['∫ₐ^∞ f dx = lim(t→∞) ∫ₐᵗ f dx', GOLD]], CX, 380, 44, t, P('C08', 0.1), { upright: true, alpha: ga }); richReveal([['p > 1 收敛，p ≤ 1 发散', CYAN]], CX, 470, 38, t, P('C08', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：收束 · 出口票', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('Grok 主持，全员合影', CX, 590, 32, SQ.X.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 5 章 · P15 反常积分初步', '下一段：收束 · 出口票', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM5('Gemini')]);
};
SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.1, 'sparkle', 0.22); s('C01', 0.1, 'buzz', 0.14); s('C02', 0.1, 'riser', 0.16); [0.35, 0.5, 0.65].forEach(f => s('C02', f, 'tick', 0.14)); s('C02', 0.8, 'ding_hi', 0.24);
  s('M02', 0.1, 'pop', 0.16); s('C03', 0.1, 'riser', 0.16); s('C03', 0.6, 'thud', 0.2);
  s('G01', 0.3, 'whoosh', 0.14); s('G01', 0.5, 'buzz', 0.14); s('G01', 0.7, 'ding', 0.2);
  s('C04', 0.4, 'warp', 0.16); s('C04', 0.75, 'ding_hi', 0.24); s('D01', 0.2, 'pop', 0.16); s('C05', 0.5, 'crack', 0.2);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.5, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
