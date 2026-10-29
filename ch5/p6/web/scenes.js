// 第 5 章 P6《积分中值定理与平均值》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A207 曲线下面积“流平”成等面积矩形 · A208 矩形顶边与曲线的交点 c · A209 两个中值定理对照
const SC = {};
const TITLES = [['hook', '平均值'], ['ave', '连续的平均'], ['mvt', '积分中值定理'], ['cmp', '两个中值定理'], ['quiz', '随堂一题'], ['outro', '小结']];
const F6 = x => 1 + x * x;
const gSeg = (G, x1, y1, x2, y2, col, a, o = {}) => seg(gx(G, x1), gy(G, y1), gx(G, x2), gy(G, y2), col, a, o.w || 3, o.dash);
const G6 = { cx: 830, cy: 820, ux: 200, uy: 90, x0: -1.4, x1: 2.3, y0: -0.3, y1: 5.6 };
const REV = Array.from({ length: 30 }, (_, i) => 40 + 25 * rnd(i * 13 + 5) + 10 * Math.sin(i / 3));
const RAVE = REV.reduce((s, v) => s + v, 0) / 30;

SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('H02') - 0.1) {
    const a = ap(t, 'H01', 0); panel(560, 230, 900, 560, CYAN, a * 0.6);
    REV.forEach((v, i) => { const p = a * clamp(prog(t, S('H01') + 0.2 + i * 0.05, 0.3)); if (p <= 0) return; const x = 600 + i * 28, h = v * 6; ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = hexA(SQ.H.col, 0.7); ctx.fillRect(x, 760 - h, 20, h); ctx.restore(); });
    const m = ap(t, 'H01', 0.6); seg(590, 760 - RAVE * 6, 1440, 760 - RAVE * 6, GOLD, m, 4); label('平均每天', 1360, 760 - RAVE * 6 - 26, 26, GOLD, m, { bold: true });
    richReveal([['总账 ÷ 30 天', GOLD]], CX, 280, 36, t, P('H01', 0.3), { upright: true });
    return;
  }
  const G = { cx: 600, cy: 760, ux: 34, uy: 16, x0: 0, x1: 24.5, y0: 0, y1: 28 }, a = ap(t, 'H02', 0), T = h => 14 + 8 * Math.sin((h - 9) * Math.PI / 12);
  gAxes(G, a, { grid: false, xl: '时', yl: '°C', ticks: { x: [[0, '0'], [6, '6'], [12, '12'], [18, '18'], [24, '24']], y: [[10, '10'], [20, '20']] } });
  gPlot(G, T, RED, { a, xa: 0, xb: 24, w: 4, p: prog(t, P('H02', 0.1), 1.2) });
  label('平均气温 = ？', 1240, 300, 34, SQ.H.col, ap(t, 'H02', 0.5), { bold: true });
};

function area6(a, lvl, p = 0) { // p: 0 曲线 → 1 拉平成高度 lvl 的矩形
  gArea(G6, x => lerp(F6(x), lvl, p), -1, 2, a);
}
SC.ave = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(G6, a, { grid: false, xl: 'x', ticks: { x: [[-1, '−1'], [1, '1'], [2, '2']], y: [[1, '1'], [2, '2'], [5, '5']] } });
  if (t > S('C03') - 0.1) area6(ap(t, 'C03', 0.2), 2, 0);
  gPlot(G6, F6, RED, { a, xa: -1.3, xb: 2.15, w: 4 }); mathText('y = 1 + x²', gx(G6, 1.75), gy(G6, F6(1.75)) - 10, 26, RED, { align: 'right', alpha: a, upright: true });
  richReveal([['求和 → 积分     天数 → 区间长', CYAN]], CX, 250, 30, t, P('C01', 0.2), { upright: true });
  if (t > S('C02') - 0.1) { panel(560, 330, 380, 90, GOLD, ap(t, 'C02', 0)); richReveal([['f_ave = (1/(b − a)) ∫ₐᵇ f dx', GOLD]], 750, 375, 24, t, P('C02', 0.1), { upright: true }); }
  if (t > S('C03') - 0.1) { richReveal([['∫₋₁² (1 + x²) dx = 6', CR]], 750, 470, 26, t, P('C03', 0.3), { upright: true }); richReveal([['f_ave = 6 ÷ 3 = ', CR], ['2', GOLD]], 750, 520, 28, t, P('C03', 0.6), { upright: true }); }
};

SC.mvt = t => {
  starfield(t); blueprint(0.4, 80);
  gAxes(G6, 1, { grid: false, xl: 'x', ticks: { x: [[-1, '−1'], [1, '1'], [2, '2']], y: [[2, '2'], [5, '5']] } });
  const p = t < S('D01') ? 0 : eIO(prog(t, P('D01', 0.3), 1.6));
  area6(1, 2, p);
  gPlot(G6, F6, RED, { xa: -1.3, xb: 2.15, w: 4 });
  panel(560, 220, 900, 90, GOLD, ap(t, 'C04', 0)); richReveal([['∃ c ∈ [a, b]：  ∫ₐᵇ f(x) dx = f(c)(b − a)', GOLD]], CX, 265, 30, t, P('C04', 0.15), { upright: true });
  if (p > 0.95 || t > S('C05')) {
    const c = t > S('C05') ? ap(t, 'C05', 0.1) : 1; gSeg(G6, -1.3, 2, 2.15, 2, GOLD, c, { dash: [8, 6] });
    if (t > S('C05')) { const d = ap(t, 'C05', 0.6); [-1, 1].forEach(v => { gDot(G6, v, 2, GOLD, d); gV(G6, v, CYAN, d * 0.8, { ya: 0, yb: 2, dash: [5, 5] }); mathText(v < 0 ? 'c = −1' : 'c = 1', gx(G6, v), gy(G6, 2) - 30, 24, GOLD, { align: 'center', alpha: d, upright: true }); }); label('高 = f_ave = 2', 1300, 620, 28, GOLD, ap(t, 'C05', 0.2), { bold: true }); }
  }
  if (t > S('D01')) label('等面积矩形', 1300, 560, 30, CYAN, ap(t, 'D01', 0.4), { bold: true });
};

SC.cmp = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G01', 0), b = ap(t, 'G01', 0.45);
  panel(540, 230, 430, 470, CYAN, a); panel(1010, 230, 450, 470, GOLD, b);
  label('拉格朗日（第 4 章）', 755, 270, 26, CYAN, a, { bold: true }); label('积分中值定理', 1235, 270, 26, GOLD, b, { bold: true });
  const GL = { cx: 600, cy: 640, ux: 110, uy: 110, x0: 0, x1: 3.3, y0: 0, y1: 2.9 }, fL = x => 0.4 + 0.7 * x - 0.13 * x * x * x + 0.35 * x * x;
  gPlot(GL, fL, RED, { a, xa: 0.1, xb: 3.2 }); gSeg(GL, 0.4, fL(0.4), 3, fL(3), CYAN, a); const m = (fL(3) - fL(0.4)) / 2.6;
  let cL = 1.7; for (let i = 0; i < 40; i++) { const d = (fL(cL + 1e-4) - fL(cL - 1e-4)) / 2e-4; cL -= (d - m) / 0.5 * 0.3; } gSeg(GL, cL - 0.9, fL(cL) - 0.9 * m, cL + 0.9, fL(cL) + 0.9 * m, GOLD, a, { dash: [6, 5] }); gDot(GL, cL, fL(cL), GOLD, a);
  mathText("f′(c) = 平均变化率", 755, 670, 24, CR, { align: 'center', alpha: a, upright: true });
  const GR = { cx: 1070, cy: 640, ux: 110, uy: 110, x0: 0, x1: 3.4, y0: 0, y1: 2.9 }, fR = x => 0.9 + 0.5 * Math.sin(1.8 * x) + 0.25 * x;
  gArea(GR, fR, 0.2, 3.2, b * 0.5); gPlot(GR, fR, RED, { a: b, xa: 0.1, xb: 3.3 });
  const av = (() => { let s = 0; for (let i = 0; i < 300; i++) s += fR(0.2 + (i + 0.5) * 0.01); return s * 0.01 / 3; })(); gBand(GR, 0.2, 3.2, 0, av, hexA(GOLD, 0.2), b); gSeg(GR, 0.2, av, 3.2, av, GOLD, b, { dash: [6, 5] });
  mathText('f(c) = 平均值', 1235, 670, 24, CR, { align: 'center', alpha: b, upright: true });
  if (t > S('H03')) label('同一个思想', CX, 800, 40, SQ.H.col, ap(t, 'H03', 0.1), { bold: true });
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['f(x) = x，[0, 4] 上的平均值？', CR]], 820, 320, 40, t, P('C07', 0.1), { upright: true });
  const G = { cx: 640, cy: 780, ux: 80, uy: 60, x0: 0, x1: 4.6, y0: 0, y1: 4.6 }, a = ap(t, 'C07', 0.5);
  gAxes(G, a, { grid: false, ticks: { x: [[4, '4']], y: [[2, '2'], [4, '4']] } }); gArea(G, x => x, 0, 4, a * 0.6); gPlot(G, x => x, RED, { a, xa: 0, xb: 4.4 });
  if (t > S('D02')) { const d = ap(t, 'D02', 0.2); gBand(G, 0, 4, 0, 2, hexA(GOLD, 0.25), d); gSeg(G, 0, 2, 4, 2, GOLD, d, { dash: [8, 6] }); richReveal([['8 ÷ 4 = ', CR], ['2', GOLD]], 1150, 620, 48, t, P('D02', 0.3), { upright: true }); }
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['f_ave = (1/(b − a)) ∫ₐᵇ f dx', GOLD]], CX, 380, 44, t, P('C08', 0.1), { upright: true, alpha: ga }); richReveal([['∫ₐᵇ f dx = f(c)(b − a)', CYAN]], CX, 480, 40, t, P('C08', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：基本定理（一）：面积函数', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('Gemini：这是一个极其漂亮的结论！', CX, 590, 32, SQ.M.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 5 章 · P6 积分中值定理与平均值', '下一段：基本定理（一）：面积函数', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM5('混元')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  for (let i = 0; i < 30; i += 3) sfx(S('H01') + 0.2 + i * 0.05, 'tick2', 0.1); s('H01', 0.6, 'ding', 0.2); s('H02', 0.1, 'whoosh', 0.14); s('H02', 0.5, 'pop', 0.16);
  s('C01', 0.2, 'pop', 0.16); s('C02', 0.1, 'type', 0.14); s('C03', 0.2, 'whoosh', 0.14); s('C03', 0.6, 'ding_hi', 0.24);
  s('C04', 0.15, 'slam', 0.2); s('D01', 0.3, 'warp', 0.2); s('C05', 0.6, 'ding', 0.22);
  s('G01', 0.05, 'pop', 0.16); s('G01', 0.45, 'pop', 0.16); s('H03', 0.1, 'shimmer', 0.2);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.3, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
