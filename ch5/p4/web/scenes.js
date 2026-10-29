// 第 5 章 P4《定积分的定义》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A199 样本点随意跳动、黎曼和收敛 · A200 定积分记号标注 · A201 x³ − 6x 正负面积 · A202 四分之一圆与三角形
const SC = {};
const TITLES = [['def', '黎曼和'], ['sym', '积分记号'], ['sign', '净面积'], ['geo', '用几何算'], ['quiz', '随堂一题'], ['outro', '小结']];
const FD = x => 1.6 + 0.9 * Math.sin(1.1 * x - 0.6) + 0.18 * x;
const GD = { cx: 540, cy: 800, ux: 135, uy: 140, x0: -0.2, x1: 6.2, y0: -0.3, y1: 3.9 };
const A0 = 0.6, B0 = 5.6;
// 真值（数值积分）
const IFD = (() => { let s = 0; const N = 4000, d = (B0 - A0) / N; for (let i = 0; i < N; i++) s += FD(A0 + (i + 0.5) * d); return s * d; })();

SC.def = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(GD, a, { grid: false, xl: 'x', ticks: { x: [[A0, 'a'], [B0, 'b']] } });
  gArea(GD, FD, A0, B0, a * 0.5);
  gPlot(GD, FD, RED, { a, xa: 0, xb: 6, w: 4 }); mathText('y = f(x)', gx(GD, 5.9), gy(GD, FD(5.9)) - 32, 24, RED, { align: 'center', alpha: a, upright: true });
  if (t < S('C02')) return;
  const n = t < S('C04') ? 6 : Math.round(6 * Math.pow(2, 3 * prog(t, P('C04', 0.1), 1.6)));
  const jump = t > S('R01') && t < E('R01') + 0.3, k = Math.floor(t * 2.5);
  const fr = Array.from({ length: n }, (_, i) => jump ? rnd(i * 7 + k * 131) : 0.5);
  gRects(GD, FD, A0, B0, n, fr, GOLD, ap(t, 'C02', 0.2), { k: t < S('C03') ? n * prog(t, P('C02', 0.3), 1) : n, dots: n <= 24, fa: 0.2 });
  if (n <= 12) gBrace(GD, A0, A0 + (B0 - A0) / n, 'Δx', CYAN, ap(t, 'C02', 0.4), 54);
  if (t > S('C03') - 0.1) {
    panel(1030, 220, 450, 210, GOLD, ap(t, 'C03', 0));
    richReveal([['∫ₐᵇ f(x) dx', GOLD]], 1255, 270, 36, t, P('C03', 0.1), { upright: true });
    richReveal([['= lim Σ f(xᵢ*) Δx', CR]], 1255, 330, 32, t, P('C03', 0.3), { upright: true });
    const sum = riemann(FD, A0, B0, n, 'M'); let sj = 0; if (jump) { const d = (B0 - A0) / n; fr.forEach((f, i) => sj += FD(A0 + (i + f) * d) * d); }
    mathText(`n = ${n}：  Σ = ${(jump ? sj : sum).toFixed(4)}`, 1255, 395, 24, CYAN, { align: 'center', alpha: ap(t, 'C03', 0.5), upright: true });
  }
  if (jump) label('任取样本点', 1255, 480, 28, SQ.R.col, ap(t, 'R01', 0.1), { bold: true });
  if (t > S('C04')) label('f 连续 ⇒ 极限存在', 1255, 480, 30, GRN, ap(t, 'C04', 0.3), { bold: true });
};

SC.sym = t => {
  starfield(t); blueprint(0.4, 80);
  const y = 480;
  richReveal([['∫', GOLD], ['ₐᵇ', CYAN], [' f(x) ', RED], ['dx', GRN]], CX, y, 96, t, P('C05', 0.05), { upright: true });
  const LB = [[CX - 150, -1, '积分号（拉长的 S）', GOLD, 0.15], [CX - 75, 1, '下限 a · 上限 b', CYAN, 0.35], [CX + 30, -1, '被积函数', RED, 0.55], [CX + 160, 1, '对 x 积分', GRN, 0.75]];
  LB.forEach(([x, d, s, c, f]) => { const p = ap(t, 'C05', f); if (p <= 0) return; seg(x, y + d * 80, x, y + d * 150, c, p, 2); label(s, x, y + d * 180, 26, c, p, { bold: true }); });
  if (t > S('G01') - 0.1) { panel(600, 820, 760, 90, INV, ap(t, 'G01', 0)); richReveal([['∫ₐᵇ f(x) dx = ∫ₐᵇ f(t) dt', INV]], CX, 865, 34, t, P('G01', 0.15), { upright: true }); }
};

const FS = x => x * x * x - 6 * x;
const GS = { cx: 560, cy: 520, ux: 230, uy: 30, x0: -0.2, x1: 3.4, y0: -7.5, y1: 9.5 };
SC.sign = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'D01', 0);
  gAxes(GS, a, { grid: false, xl: 'x', ticks: { x: [[1, '1'], [2, '2'], [3, '3']] } });
  gPlot(GS, FS, RED, { a, xa: 0, xb: 3.25, w: 4 }); mathText('y = x³ − 6x', gx(GS, 2.75) - 90, gy(GS, FS(2.75)), 24, RED, { align: 'center', alpha: a, upright: true });
  if (t > S('C06') - 0.1) {
    gArea(GS, FS, 0, 3, ap(t, 'C06', 0.2), { p: prog(t, P('C06', 0.2), 1.0) });
    label('−', gx(GS, 1.2), gy(GS, -3), 54, RED, ap(t, 'C06', 0.5), { bold: true }); label('+', gx(GS, 2.75), gy(GS, 2.5), 54, CYAN, ap(t, 'C06', 0.5), { bold: true });
    richReveal([['定积分 = ', CR], ['上方面积', CYAN], [' − ', CR], ['下方面积', RED]], 830, 250, 30, t, P('C06', 0.6), { upright: true });
  }
  if (t > S('C07') - 0.1) { panel(600, 300, 460, 90, GOLD, ap(t, 'C07', 0)); richReveal([['∫₀³ (x³ − 6x) dx = ', CR], ['−6.75', GOLD]], 830, 345, 30, t, P('C07', 0.15), { upright: true }); }
};

SC.geo = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('G02') - 0.1) {
    const G = { cx: 700, cy: 820, ux: 520, uy: 520, x0: -0.1, x1: 1.15, y0: -0.05, y1: 1.12 }, a = ap(t, 'R02', 0), f = x => Math.sqrt(Math.max(0, 1 - x * x));
    gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[1, '1']], y: [[1, '1']] } });
    gArea(G, f, 0, 1, a, { p: prog(t, P('R02', 0.3), 1.0) }); gPlot(G, f, RED, { a, xa: 0, xb: 1, n: 400 });
    richReveal([['∫₀¹ √(1 − x²) dx = ', CR], ['π/4', GOLD]], 1240, 300, 34, t, P('R02', 0.5), { upright: true });
    label('四分之一个单位圆', 1240, 370, 28, CYAN, ap(t, 'R02', 0.6), { bold: true });
    return;
  }
  const G = { cx: 640, cy: 600, ux: 180, uy: 150, x0: -0.3, x1: 3.5, y0: -1.4, y1: 2.6 }, a = ap(t, 'G02', 0), f = x => x - 1;
  gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[1, '1'], [3, '3']] } });
  gArea(G, f, 0, 3, a); gPlot(G, f, RED, { a, xa: 0, xb: 3.3 });
  label('2', gx(G, 2.3), gy(G, 0.6), 34, CYAN, ap(t, 'G02', 0.3), { font: F_MATH, bold: true }); label('½', gx(G, 0.35), gy(G, -0.3), 30, RED, ap(t, 'G02', 0.3), { font: F_MATH, bold: true });
  richReveal([['∫₀³ (x − 1) dx = 2 − ½ = ', CR], ['3/2', GOLD]], 1220, 300, 32, t, P('G02', 0.5), { upright: true });
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫₋₁¹ x dx = ？', CR]], 820, 330, 48, t, P('C09', 0.1), { upright: true });
  if (t > S('D02')) { const G = { cx: 820, cy: 640, ux: 150, uy: 150, x0: -1.4, x1: 1.4, y0: -1.2, y1: 1.2 }, a = ap(t, 'D02', 0); gAxes(G, a, { grid: false }); gArea(G, x => x, -1, 1, a); gPlot(G, x => x, RED, { a, xa: -1.2, xb: 1.2 }); richReveal([['= ', CR], ['0', GOLD]], 1150, 640, 52, t, P('D02', 0.5), { upright: true }); }
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { richReveal([['∫ₐᵇ f(x) dx = lim Σ f(xᵢ*) Δx', GOLD]], CX, 400, 44, t, P('C10', 0.1), { upright: true, alpha: ga }); richReveal([['= 上方面积 − 下方面积', CYAN]], CX, 500, 38, t, P('C10', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：中点法则与积分性质', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('MiniMax：取景取中间', CX, 590, 32, SQ.N.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 5 章 · P4 定积分的定义', '下一段：中点法则与积分性质', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM5('Mistral')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C02', 0.3, 'pluck', 0.14); s('C03', 0.1, 'slam', 0.2); s('C03', 0.3, 'type', 0.14); for (let i = 0; i < 6; i++) s('R01', 0.1 + i * 0.14, 'tick', 0.1); s('C04', 0.1, 'warp', 0.18); s('C04', 0.3, 'ding', 0.2);
  [0.15, 0.35, 0.55, 0.75].forEach(f => s('C05', f, 'pop', 0.16)); s('G01', 0.15, 'type', 0.14);
  s('C06', 0.2, 'whoosh', 0.16); s('C06', 0.5, 'pop', 0.18); s('C07', 0.15, 'ding_hi', 0.24);
  s('R02', 0.3, 'whoosh', 0.16); s('R02', 0.5, 'ding', 0.2); s('G02', 0.3, 'pop', 0.16); s('G02', 0.5, 'ding_hi', 0.24);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.5, 'ding_hi', 0.28);
  s('C10', 0.1, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
