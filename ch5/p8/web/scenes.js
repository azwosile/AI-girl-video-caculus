// 第 5 章 P8《变限积分求导》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A214 上限 x⁴ 在 t 轴上加速奔跑 · A215 两端同时移动的面积 · A216 洛必达分子分母同时求导
const SC = {};
const TITLES = [['hook', '上限是 x⁴'], ['chain', '链式法则'], ['both', '两端都动'], ['lim', '变限积分的极限'], ['quiz', '随堂一题'], ['outro', '小结']];
const F8 = t => 1.2 + 0.5 * Math.sin(1.7 * t) + 0.25 * t;
const G8 = { cx: 560, cy: 770, ux: 260, uy: 115, x0: 0, x1: 3.5, y0: -0.3, y1: 3.4 };
function runner(G, x, col, a, tag, ears) {
  const X = gx(G, x), Y = gy(G, 0); gDot(G, x, 0, col, a);
  if (ears) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(X - 7, Y - 24, 4, 13, -0.2, 0, 7); ctx.ellipse(X + 7, Y - 24, 4, 13, 0.2, 0, 7); ctx.stroke(); ctx.restore(); }
  mathText(tag, X, Y + 38, 24, col, { align: 'center', alpha: a, upright: true });
}
function chainScene(t, a, xv) {
  gAxes(G8, a, { grid: false, xl: 't', ticks: { x: [[1, '1']] } });
  const v = Math.pow(xv, 4);
  gArea(G8, F8, 1, v, a * 0.8); gPlot(G8, F8, RED, { a, xa: 0.1, xb: 3.4, w: 3.5 }); mathText('f(t)', gx(G8, 3.3), gy(G8, F8(3.3)) - 26, 24, RED, { align: 'center', alpha: a, upright: true });
  runner(G8, xv, CYAN, a, 'x', false); runner(G8, v, GOLD, a, 'x⁴', true);
}
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'T01', 0), xv = lerp(1, 1.32, 0.5 - 0.5 * Math.cos(Math.max(0, t - P('T01', 0.3)) * 1.6));
  chainScene(t, a, xv);
  richReveal([['∫₁^(x⁴) f(t) dt', GOLD]], 1220, 280, 38, t, P('T01', 0.4), { upright: true });
};
SC.chain = t => {
  starfield(t); blueprint(0.4, 80);
  const xv = lerp(1, 1.32, 0.5 - 0.5 * Math.cos((t - S('C01')) * 1.6));
  chainScene(t, 1, xv);
  if (t < S('C02')) { label('x 慢 · x⁴ 快', 1220, 290, 30, GOLD, ap(t, 'C01', 0.4), { bold: true }); return; }
  panel(1000, 220, 470, 170, GOLD, ap(t, 'C02', 0));
  richReveal([['d/dx ∫₁^(x⁴) sec t dt', CR]], 1235, 260, 28, t, P('C02', 0.1), { upright: true });
  richReveal([['= sec(x⁴) · ', CR], ['4x³', GOLD]], 1235, 335, 32, t, P('C02', 0.5), { upright: true });
  if (t > S('G01') - 0.1) { panel(1000, 410, 470, 90, INV, ap(t, 'G01', 0)); richReveal([['f(v(x)) · ', CR], ["v′(x)", GOLD]], 1235, 455, 32, t, P('G01', 0.2), { upright: true }); }
};
SC.both = t => {
  starfield(t); blueprint(0.4, 80);
  const s = Math.max(0, t - S('C03')), u = 0.6 + 0.25 * s / 4, v = 1.8 + 0.6 * s / 4, h = 0.12;
  gAxes(G8, 1, { grid: false, xl: 't' });
  gArea(G8, F8, u, v, 0.8); gPlot(G8, F8, RED, { xa: 0.1, xb: 3.4, w: 3.5 });
  const T2 = ap(t, 'T02', 0);
  if (T2 > 0) { gBand(G8, v, v + h, 0, F8(v), hexA(GRN, 0.7), T2); gBand(G8, u - h, u, 0, F8(u), hexA(RED, 0.6), T2); label('+ 进来', gx(G8, v) + 40, gy(G8, F8(v)) - 30, 26, GRN, T2, { bold: true }); label('− 溜走', gx(G8, u) - 10, gy(G8, F8(u)) - 30, 26, RED, T2, { bold: true }); }
  runner(G8, u, CYAN, 1, 'u(x)', false); runner(G8, v, GOLD, 1, 'v(x)', false);
  panel(860, 220, 610, 90, GOLD, ap(t, 'C03', 0)); richReveal([["d/dx ∫ᵤᵛ f(t) dt = ", CR], ["f(v)v′", GRN], [' − ', CR], ["f(u)u′", RED]], 1165, 265, 30, t, P('C03', 0.2), { upright: true });
};
SC.lim = t => {
  starfield(t); blueprint(0.4, 80);
  panel(560, 220, 900, 140, CYAN, ap(t, 'C04', 0));
  richReveal([['lim(x→0)  ', CR], ['∫_cos x^1 e^(−t²) dt', GOLD], ['  /  ', CR], ['x²', INV]], CX, 270, 34, t, P('C04', 0.1), { upright: true });
  label('0/0 型', CX, 330, 26, CYAN, ap(t, 'C04', 0.6), { bold: true });
  if (t > S('D01') - 0.1) label('洛必达！', 1240, 430, 40, SQ.D.col, ap(t, 'D01', 0.3), { bold: true });
  if (t > S('C05') - 0.1) {
    richReveal([['分子′ = −e^(−cos²x)·(−sin x) = ', CR], ['sin x · e^(−cos²x)', GOLD]], CX, 530, 30, t, P('C05', 0.1), { upright: true });
    richReveal([['分母′ = ', CR], ['2x', INV]], CX, 600, 30, t, P('C05', 0.6), { upright: true });
    label('下限在动：减号', 700, 470, 22, CYAN, ap(t, 'C05', 0.2), { bold: true });
  }
  if (t > S('C06') - 0.1) { panel(700, 680, 560, 110, GOLD, ap(t, 'C06', 0)); richReveal([['= lim (sin x / x) · e^(−cos²x)/2 = ', CR], ['1/(2e)', GOLD]], CX, 735, 30, t, P('C06', 0.2), { upright: true }); }
};
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['d/dx ∫₀^(x²) cos t dt = ？', CR]], 820, 360, 46, t, P('C08', 0.1), { upright: true });
  if (t > S('D02')) richReveal([['= cos(x²) · ', CR], ['2x', GOLD]], 820, 520, 52, t, P('D02', 0.15), { upright: true });
};
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([["d/dx ∫ᵤ⁽ˣ⁾^v⁽ˣ⁾ f(t) dt = f(v)v′ − f(u)u′", GOLD]], CX, 430, 44, t, P('C09', 0.15), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：牛顿–莱布尼茨公式', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('千问：直接刷卡结账', CX, 590, 32, SQ.Q.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 5 章 · P8 变限积分求导', '下一段：牛顿–莱布尼茨公式', [...CREDIT_BASE, ...CREDIT_T, ...CREDIT_END, CREDIT_TM5('MiMo')]);
};
SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('T01', 0.3, 'whoosh', 0.16); s('T01', 0.4, 'type', 0.12); s('C01', 0.4, 'pop', 0.16);
  s('C02', 0.1, 'type', 0.14); s('C02', 0.5, 'ding', 0.22); s('G01', 0.2, 'ding_hi', 0.24);
  s('C03', 0.2, 'type', 0.14); s('T02', 0.05, 'pop', 0.18); s('T02', 0.3, 'pop', 0.16);
  s('C04', 0.1, 'type', 0.14); s('D01', 0.3, 'sting', 0.2); s('C05', 0.1, 'type', 0.12); s('C05', 0.6, 'type', 0.12); s('C06', 0.2, 'ding_hi', 0.26);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
