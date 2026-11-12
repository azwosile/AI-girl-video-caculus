// 第 6 章 P2《曲线间的面积》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.1 例 1、例 2。
// A251 两条曲线之间的长条扫过 · A252 上下交错、分段相减 · A253 豆包算出负面积的翻车演示
const SC = {};
const TITLES = [['formula', '上减下'], ['flop', '谁在上面'], ['cross', '中途交叉'], ['quiz', '随堂一题'], ['outro', '小结']];
const UPC = GRN, LOC = RED;

// ======================= 上减下（A251） =======================
const G0 = { cx: 680, cy: 770, ux: 270, uy: 140, x0: -0.15, x1: 2.55, y0: -0.3, y1: 3.3 };
const F0 = x => 2.3 + 0.5 * Math.sin(1.7 * x + 0.3), H0 = x => 0.7 + 0.35 * Math.sin(2.1 * x + 1.2);
const G1 = { cx: 700, cy: 770, ux: 470, uy: 140, x0: -0.1, x1: 1.35, y0: -0.3, y1: 3.2 };
SC.formula = t => {
  starfield(t); blueprint(0.35, 80);
  const sw = ap(t, 'G01', 0, 0.6), a0 = ap(t, 'C01', 0) * (1 - sw);
  if (a0 > 0) {
    gAxes(G0, a0, { grid: false, xl: 'x' });
    const fill = eIO(prog(t, P('C03', 0.1), 1.4));
    gBetween(G0, F0, H0, 0.2, 2.3, a0 * 0.8, { p: fill, col: 'rgba(92,200,232,0.25)' });
    gPlot(G0, F0, UPC, { a: a0, xa: 0.05, xb: 2.45 }); gPlot(G0, H0, LOC, { a: a0, xa: 0.05, xb: 2.45 });
    label('y = f(x)', gx(G0, 2.45), gy(G0, F0(2.45)) - 30, 26, UPC, a0, { bold: true }); label('y = g(x)', gx(G0, 2.45), gy(G0, H0(2.45)) + 34, 26, LOC, a0, { bold: true });
    [0.2, 2.3].forEach((x, i) => { seg(gx(G0, x), gy(G0, 0), gx(G0, x), gy(G0, F0(x)), CR, a0 * 0.5, 1.5, [6, 5]); mathText(['a', 'b'][i], gx(G0, x), gy(G0, 0) + 34, 26, CR, { align: 'center', alpha: a0 }); });
    if (t > S('C02') && t < S('G01') + 0.6) {
      const u = prog(t, P('C02', 0.1), D('C02') * 0.9), x = 0.5 + 1.4 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), sa = ap(t, 'C02', 0.1) * a0 * (1 - fill * 0.6);
      gStrip(G0, x, 0.09, F0, H0, GOLD, sa);
      label('y上 − y下', gx(G0, x) + 90, gy(G0, (F0(x) + H0(x)) / 2), 26, GOLD, sa, { bold: true }); mathText('dx', gx(G0, x), gy(G0, H0(x)) + 30, 24, GOLD, { align: 'center', alpha: sa });
    }
    if (t > S('C03')) richReveal([['A = ', CR], ['∫', GOLD], ['ₐᵇ [ ', CR], ['f(x)', UPC], [' − ', CR], ['g(x)', LOC], [' ] dx', CR]], CX, 250, 42, t, P('C03', 0.3), { upright: true, alpha: 1 - sw });
  }
  if (sw > 0) {
    gAxes(G1, sw, { grid: false, xl: 'x' });
    gBetween(G1, Math.exp, x => x, 0, 1, sw * 0.8, { p: eIO(prog(t, P('G02', 0.05), 1.2)), col: 'rgba(92,200,232,0.28)' });
    gPlot(G1, Math.exp, UPC, { a: sw, xa: -0.05, xb: 1.15 }); gPlot(G1, x => x, LOC, { a: sw, xa: -0.05, xb: 1.3 });
    label('y = eˣ', gx(G1, 1.15) + 50, gy(G1, Math.exp(1.15)), 28, UPC, sw, { bold: true }); label('y = x', gx(G1, 1.3) + 10, gy(G1, 1.3) + 36, 28, LOC, sw, { bold: true });
    seg(gx(G1, 1), gy(G1, 0), gx(G1, 1), gy(G1, Math.E), CR, sw * 0.6, 1.5, [6, 5]); mathText('1', gx(G1, 1), gy(G1, 0) + 34, 26, CR, { align: 'center', alpha: sw });
    if (t > S('G02')) richReveal([['∫', GOLD], ['₀¹ (eˣ − x) dx = e − 1 − 1/2 = ', CR], ['e − 1.5', GOLD]], CX, 250, 40, t, P('G02', 0.25), { upright: true });
  }
};

// ======================= 谁在上面（A253） =======================
const G2 = { cx: 780, cy: 720, ux: 420, uy: 380, x0: -0.15, x1: 1.4, y0: -0.15, y1: 1.2 };
const SQx = x => x * x, TOPx = x => 2 * x - x * x;
SC.flop = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'B01', 0);
  gAxes(G2, a, { grid: false, xl: 'x' });
  const wrong = t > S('B02') && t < S('C04'), ok = t > S('C05');
  gBetween(G2, TOPx, SQx, 0, 1, a * 0.8, { col: wrong ? 'rgba(232,85,58,0.30)' : 'rgba(92,200,232,0.25)' });
  gPlot(G2, TOPx, UPC, { a, xa: -0.05, xb: 1.35 }); gPlot(G2, SQx, LOC, { a, xa: -0.1, xb: 1.08 });
  label('y = 2x − x²', gx(G2, 1.35) + 30, gy(G2, TOPx(1.35)) + 40, 26, UPC, a, { bold: true }); label('y = x²', gx(G2, 1.08) + 50, gy(G2, 1.08 ** 2) - 6, 26, LOC, a, { bold: true });
  [0, 1].forEach((x, i) => { glowDot(gx(G2, x), gy(G2, SQx(x)), 9, GOLD, ap(t, 'B01', 0.6 + 0.15 * i)); mathText(`(${x}, ${x})`, gx(G2, x) + (i ? 60 : -60), gy(G2, SQx(x)) - 18, 22, GOLD, { align: 'center', alpha: ap(t, 'B01', 0.6 + 0.15 * i) }); });
  if (wrong) {
    const w = ap(t, 'B02', 0.05); gStrip(G2, 0.5, 0.06, TOPx, SQx, RED, w);
    arrowV(gx(G2, 0.5) + 40, gy(G2, TOPx(0.5)), gy(G2, SQx(0.5)), RED, w);
    richReveal([['∫', GOLD], ['₀¹ [x² − (2x − x²)] dx = ', CR], ['−1/3', RED]], CX, 250, 40, t, P('B02', 0.2), { upright: true });
    if (t > S('D01')) label('面积为负？！', CX, 330, 36, SQ.D.col, ap(t, 'D01', 0.1), { bold: true });
  }
  if (t > S('C04')) {
    const c = ap(t, 'C04', 0.4); gStrip(G2, 0.5, 0.06, TOPx, SQx, GOLD, c);
    label('上', gx(G2, 0.5) + 44, gy(G2, TOPx(0.5)) - 6, 28, UPC, c, { bold: true }); label('下', gx(G2, 0.5) + 44, gy(G2, SQx(0.5)) + 10, 28, LOC, c, { bold: true });
    if (t > S('C04') + 0.1 && t < S('C05')) richReveal([['先画图：', CR], ['2x − x²', UPC], [' 在上', CR]], CX, 250, 40, t, P('C04', 0.3), { upright: true });
  }
  if (ok) {
    richReveal([['∫', GOLD], ['₀¹ (2x − 2x²) dx = 1 − 2/3 = ', CR], ['1/3', GOLD]], CX, 250, 40, t, P('C05', 0.15), { upright: true });
    checkMark(1340, 240, 22, GRN, t, P('C05', 0.7));
  }
};

// ======================= 中途交叉（A252） =======================
const G3 = { cx: 650, cy: 760, ux: 420, uy: 330, x0: -0.12, x1: 1.75, y0: -0.15, y1: 1.25 }, Q4 = Math.PI / 4, H2 = Math.PI / 2;
SC.cross = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C06', 0);
  gAxes(G3, a, { grid: false, xl: 'x' });
  const sp = t > S('C07') ? 1 : 0;
  gBetween(G3, Math.cos, Math.sin, 0, Q4, a * 0.8 * ap(t, 'C07', 0.15), { col: 'rgba(92,200,232,0.30)' });
  gBetween(G3, Math.sin, Math.cos, Q4, H2, a * 0.8 * ap(t, 'C07', 0.55), { col: 'rgba(255,200,60,0.30)' });
  gPlot(G3, Math.sin, RED, { a, xa: 0, xb: 1.7 }); gPlot(G3, Math.cos, CYAN, { a, xa: 0, xb: 1.7 });
  label('sin x', gx(G3, 1.7) + 50, gy(G3, Math.sin(1.7)), 26, RED, a, { bold: true }); label('cos x', gx(G3, 1.7) + 50, gy(G3, Math.cos(1.7)) + 6, 26, CYAN, a, { bold: true });
  mathText('π/2', gx(G3, H2), gy(G3, 0) + 34, 24, CR, { align: 'center', alpha: a });
  if (sp) {
    const c = ap(t, 'C07', 0.05); seg(gx(G3, Q4), gy(G3, 0), gx(G3, Q4), gy(G3, 1.15), GOLD, c, 2, [8, 6]); mathText('π/4', gx(G3, Q4), gy(G3, 0) + 34, 24, GOLD, { align: 'center', alpha: c });
    label('cos 在上', gx(G3, Q4 / 2), gy(G3, 0.62), 24, CYAN, ap(t, 'C07', 0.2), { bold: true }); label('sin 在上', gx(G3, (Q4 + H2) / 2), gy(G3, 0.62), 24, GOLD, ap(t, 'C07', 0.6), { bold: true });
  }
  if (t < S('G03')) richReveal([['x 从 0 到 π/2', CR]], CX, 250, 38, t, P('C06', 0.4), { upright: true });
  else {
    richReveal([['A = ', CR], ['∫', GOLD], ['₀^{π/2} |cos x − sin x| dx = ', CR], ['2√2 − 2', GOLD]], CX, 250, 38, t, P('G03', 0.1), { upright: true });
    label('≈ 0.83', CX + 300, 320, 30, GOLD, ap(t, 'G03', 0.7), { bold: true });
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 960, cy: 780, ux: 260, uy: 260, x0: -0.1, x1: 1.25, y0: -0.1, y1: 1.2 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['y = x 与 y = x² 围成的面积 = ？', CR]], 800, 300, 40, t, P('C09', 0.1), { upright: true });
  const ga = ap(t, 'C09', 0.3); gAxes(GQ, ga * 0.8, { grid: false });
  if (t > S('D02')) gBetween(GQ, x => x, SQx, 0, 1, ap(t, 'D02', 0.1), { col: 'rgba(92,200,232,0.30)' });
  gPlot(GQ, x => x, UPC, { a: ga, xa: 0, xb: 1.15 }); gPlot(GQ, SQx, LOC, { a: ga, xa: 0, xb: 1.08 });
  if (t > S('D02')) { richReveal([['1/2 − 1/3', CYAN]], 720, 440, 36, t, P('D02', 0.2), { upright: true }); richReveal([['= ', CR], ['1/6', GOLD]], 720, 540, 52, t, P('D02', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) [['① 先画图', CR, 0.05], ['② 上 − 下，再积分', GOLD, 0.3], ['③ 中途交叉就分段', CYAN, 0.6]].forEach(([s, c, f], i) => { const y = 330 + i * 110; label(s, CX, y, 40, c, ga * ap(t, 'C10', f), { bold: true }); });
  if (t > S('C11') - 0.1) { glowText('下一段：换个方向 · 对 y 积分', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('Grok：横过来切！', CX, 590, 32, SQ.X.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 6 章 · P2 曲线间的面积', '下一段：对 y 积分', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM6('豆包')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'pop', 0.16); s('C02', 0.1, 'whoosh', 0.14); s('C03', 0.1, 'riser', 0.16); s('C03', 0.3, 'ding', 0.2); s('G01', 0.05, 'swoosh_in', 0.18); s('G02', 0.25, 'ding_hi', 0.24);
  s('B01', 0.6, 'pop', 0.16); s('B01', 0.75, 'pop', 0.16); s('B02', 0.2, 'type', 0.14); s('B02', 0.6, 'buzz', 0.2); s('D01', 0.1, 'glitch', 0.18);
  s('C04', 0.3, 'whoosh', 0.14); s('C05', 0.15, 'type', 0.14); s('C05', 0.7, 'check', 0.24); s('B03', 0.2, 'pluck', 0.14);
  s('C06', 0.1, 'pop', 0.16); s('C07', 0.05, 'zap', 0.14); s('C07', 0.15, 'pop', 0.14); s('C07', 0.55, 'pop', 0.14); s('G03', 0.1, 'type', 0.14); s('G03', 0.7, 'ding_hi', 0.24);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.2, 'type', 0.14); s('D02', 0.55, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.18); s('C10', 0.3, 'pop', 0.18); s('C10', 0.6, 'pop', 0.18); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
