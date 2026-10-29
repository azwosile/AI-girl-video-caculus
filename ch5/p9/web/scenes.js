// 第 5 章 P9《基本定理（二）：牛顿–莱布尼茨公式》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A217 P2 的长条极限与 F(1) − F(0) 并排 · A218 F(b) − F(a) 的“刷卡结账” · A219 ∫₀^π sin x 的拱形面积 2 · A220 1/x² 反例的断裂
const SC = {};
const TITLES = [['ftc', '原函数之差'], ['pay', '刷卡结账'], ['ex', '再来两个'], ['trap', '前提：连续'], ['quiz', '随堂一题'], ['outro', '小结']];
const F9 = x => 0.8 + 0.6 * Math.sin(1.3 * x);
const g9 = x => { let s = 0; const n = 80, d = x / n; for (let i = 0; i < n; i++) s += F9((i + 0.5) * d) * d; return s; };
const G9 = { cx: 580, cy: 820, ux: 150, uy: 75, x0: 0, x1: 5.6, y0: -0.3, y1: 6.6 };
const A9 = 1, B9 = 4;

SC.ftc = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(G9, a, { grid: false, xl: 'x', ticks: { x: [[A9, 'a'], [B9, 'b']] } });
  gPlot(G9, g9, GOLD, { a, xa: 0, xb: 5.4, n: 120, w: 4 }); mathText('g(x)', gx(G9, 5.4), gy(G9, g9(5.4)) + 28, 24, GOLD, { align: 'center', alpha: a, upright: true });
  if (t > S('C02') - 0.1) {
    const c = ap(t, 'C02', 0.1);
    [1.2, 2.4].forEach((C, i) => { const p = c * clamp(prog(t, P('C02', 0.1 + i * 0.15), 0.6)); gPlot(G9, x => g9(x) + C, i ? INV : CYAN, { a: p, xa: 0, xb: 5.4, n: 120, w: 2.5, dash: [8, 6] }); });
    const d = ap(t, 'C02', 0.5); [0, 1.2, 2.4].forEach((C, i) => { const col = [GOLD, CYAN, INV][i]; gV(G9, B9 + 0.12 * (i - 1), col, d, { ya: g9(A9) + C, yb: g9(B9) + C, w: 4 }); gV(G9, A9, hexA(CR, 0.5), d, { dash: [4, 6] }); });
    label('三条一样长', gx(G9, B9) + 110, gy(G9, 4.2), 26, GOLD, d, { bold: true });
    mathText('F = g + C', 1250, 260, 30, CYAN, { align: 'center', alpha: c, upright: true });
  }
  if (t > S('C03') - 0.1) { panel(640, 215, 470, 100, GOLD, ap(t, 'C03', 0)); richReveal([['∫ₐᵇ f(x) dx = ', CR], ['F(b) − F(a)', GOLD]], 875, 265, 32, t, P('C03', 0.15), { upright: true }); }
};

SC.pay = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'Q01', 0);
  // 小票
  const X = 980, Y = 240, W = 440, H = 420; panel(X, Y, W, H, SQ.Q.col, a);
  label('— 收 据 —', X + W / 2, Y + 40, 26, SQ.Q.col, a, { bold: true });
  for (let k = 0; k < 4; k++) seg(X + 30, Y + 90 + k * 70, X + W - 30, Y + 90 + k * 70, hexA(CR, 0.25), a, 1.5, [6, 6]);
  richReveal([['F(b) − F(a)', GOLD]], X + W / 2, Y + 130, 40, t, P('Q01', 0.5), { upright: true });
  if (t > S('Q02') - 0.1) { richReveal([['∫₀¹ x² dx = x³/3 |₀¹', CR]], X + W / 2, Y + 210, 28, t, P('Q02', 0.1), { upright: true }); richReveal([['= 1/3', GOLD]], X + W / 2, Y + 280, 40, t, P('Q02', 0.45), { upright: true }); }
  // 刷卡
  const sw = prog(t, P('Q01', 0.6), 0.6), cx = lerp(X - 60, X + W + 40, eIO(sw)), ca = a * (sw > 0 && sw < 1 ? 1 : 0.0);
  if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; ctx.fillStyle = GOLD; ctx.fillRect(cx - 70, Y + H - 70, 140, 86); ctx.fillStyle = '#222'; ctx.fillRect(cx - 70, Y + H - 52, 140, 14); ctx.restore(); }
  if (t > P('Q01', 0.8)) checkMark(X + W / 2, Y + H - 40, 40, GRN, t, P('Q01', 0.8));
  // 左：P2 的极限
  if (t > S('Q02') - 0.1) {
    const G = { cx: 590, cy: 640, ux: 330, uy: 330, x0: 0, x1: 1.1, y0: 0, y1: 1.1 }, b = ap(t, 'Q02', 0);
    gAxes(G, b, { grid: false, ticks: { x: [[1, '1']] } }); gRects(G, x => x * x, 0, 1, 40, 'R', CYAN, b, { fa: 0.3 }); gPlot(G, x => x * x, RED, { a: b, xa: 0, xb: 1.05 });
    mathText('P2：lim Rₙ = 1/3', 760, 270, 26, CYAN, { align: 'center', alpha: b, upright: true });
  }
  if (t > S('D01') - 0.1) label('切了一千条！', 760, 330, 30, SQ.D.col, ap(t, 'D01', 0.2), { bold: true });
};

SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['∫₁³ eˣ dx = eˣ |₁³ = ', CR], ['e³ − e', GOLD]], CX, 380, 40, t, P('C04', 0.1), { upright: true });
  richReveal([['∫₃⁶ (1/x) dx = ln x |₃⁶ = ln 6 − ln 3 = ', CR], ['ln 2', GOLD]], CX, 500, 36, t, P('C04', 0.5), { upright: true });
};

const R2 = x => 1 / (x * x);
SC.trap = t => {
  starfield(t); blueprint(0.4, 80);
  const G = { cx: 760, cy: 800, ux: 160, uy: 50, x0: -1.3, x1: 3.3, y0: -0.4, y1: 10.5 }, a = ap(t, 'G01', 0);
  gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[-1, '−1'], [1, '1'], [3, '3']] } });
  if (t > S('D02') - 0.1) { const d = ap(t, 'D02', 0.1); ctx.save(); gClip(G); gArea(G, x => Math.min(R2(x), 10.5), -1, -0.02, d); gArea(G, x => Math.min(R2(x), 10.5), 0.02, 3, d); ctx.restore(); label('面积全为正', 1280, 470, 28, CYAN, d, { bold: true }); }
  ctx.save(); gClip(G); gPlot(G, R2, RED, { a, xa: -1.25, xb: -0.25, w: 4 }); gPlot(G, R2, RED, { a, xa: 0.25, xb: 3.2, w: 4 }); ctx.restore();
  mathText('y = 1/x²', gx(G, 1.6), gy(G, R2(1.6)) - 40, 26, RED, { align: 'center', alpha: a, upright: true });
  panel(1000, 215, 460, 90, INV, a); richReveal([['∫₋₁³ (1/x²) dx = ', CR], ['−4/3 ？', INV]], 1230, 260, 30, t, P('G01', 0.4), { upright: true });
  if (t > S('C05') - 0.1) { const c = ap(t, 'C05', 0.1); crossMark(1440, 260, 30, RED, t, P('C05', 0.1)); gV(G, 0, RED, c * (0.6 + 0.4 * Math.sin(t * 6)), { ya: -0.4, yb: 10.5, w: 3, dash: [8, 8] }); label('x = 0 处不连续', 1230, 360, 30, RED, c, { bold: true }); label('→ P15 反常积分', 1230, 410, 24, CR, ap(t, 'C05', 0.6)); }
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫₀^π sin x dx = ？', CR]], 820, 330, 46, t, P('C07', 0.1), { upright: true });
  const G = { cx: 600, cy: 760, ux: 150, uy: 200, x0: 0, x1: 3.5, y0: -0.1, y1: 1.2 }, b = ap(t, 'C07', 0.4);
  gAxes(G, b, { grid: false, ticks: { x: [[Math.PI, 'π']] } }); gPlot(G, Math.sin, RED, { a: b, xa: 0, xb: Math.PI });
  if (t > S('D03')) { gArea(G, Math.sin, 0, Math.PI, ap(t, 'D03', 0.1)); richReveal([['−cos π + cos 0 = ', CR], ['2', GOLD]], 1200, 620, 40, t, P('D03', 0.3), { upright: true }); }
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['∫ₐᵇ f(x) dx = F(b) − F(a)', GOLD]], CX, 400, 52, t, P('C08', 0.15), { upright: true, alpha: ga }); label('前提：f 在 [a, b] 上连续', CX, 490, 32, CYAN, ap(t, 'C08', 0.6) * ga, { bold: true }); }
  if (t > S('C09') - 0.1) { glowText('下一段：不定积分与净变化定理', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('Llama：来回散步走了多远', CX, 590, 32, SQ.L.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 5 章 · P9 牛顿–莱布尼茨公式', '下一段：不定积分与净变化定理', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM5('千问（Qwen）')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C02', 0.1, 'pluck', 0.14); s('C02', 0.25, 'pluck', 0.14); s('C02', 0.5, 'ding', 0.2); s('C03', 0.15, 'slam', 0.22);
  s('Q01', 0.5, 'type', 0.14); s('Q01', 0.6, 'swoosh_in', 0.2); s('Q01', 0.8, 'check', 0.26); s('Q02', 0.45, 'ding_hi', 0.24); s('D01', 0.1, 'impact', 0.18);
  s('C04', 0.1, 'type', 0.14); s('C04', 0.5, 'type', 0.14);
  s('G01', 0.4, 'ding', 0.18); s('D02', 0.1, 'buzz', 0.18); s('C05', 0.1, 'crack', 0.22);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.3, 'ding_hi', 0.28);
  s('C08', 0.15, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
