// 第 5 章 P7《基本定理（一）：面积函数》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A210 右边界滑动，面积函数同步画出 · A211 多出的细长条放大 · A212 f 的零点 = g 的极值 · A213 菲涅耳函数
const SC = {};
const TITLES = [['g', '面积函数'], ['deriv', 'g′ = f'], ['ex', '直接换 x'], ['quiz', '随堂一题'], ['outro', '小结']];
const F7 = t => Math.sin(1.1 * t) + 0.35;
const cum = (f, a, N = 600) => { const xs = [], ys = []; return (b) => { let s = 0; const n = Math.max(2, Math.ceil(Math.abs(b - a) * 60)), d = (b - a) / n; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * d) * d; return s; }; };
const G7 = cum(F7, 0);
const GT = { cx: 580, cy: 470, ux: 140, uy: 85, x0: 0, x1: 6.3, y0: -0.9, y1: 1.6 };
const GB = { cx: 580, cy: 830, ux: 140, uy: 85, x0: 0, x1: 6.3, y0: -0.4, y1: 2.6 };
const Z1 = (Math.PI + Math.asin(0.35)) / 1.1, Z2 = (2 * Math.PI - Math.asin(0.35)) / 1.1; // f 的两个零点

SC.g = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'D01', 0);
  gAxes(GT, a, { grid: false, xl: 't', ticks: { x: [[0, 'a']] } }); gPlot(GT, F7, RED, { a, xa: 0, xb: 6.2, w: 3.5 }); mathText('y = f(t)', gx(GT, 1.5), gy(GT, F7(1.5)) - 26, 24, RED, { align: 'center', alpha: a, upright: true });
  const x = t < S('C01') ? 0.01 : lerp(0.01, 6.1, eIO(prog(t, P('C01', 0.2), (E('C02') - P('C01', 0.2)) * 0.95)));
  if (t > S('C01')) {
    gArea(GT, F7, 0, x, 1); gV(GT, x, GOLD, 1, { ya: -0.9, yb: 1.6, w: 3 }); mathText('x', gx(GT, x), gy(GT, -0.9) + 26, 26, GOLD, { align: 'center', upright: true });
    gAxes(GB, 1, { grid: false, xl: 'x', ticks: { x: [[0, 'a']] } }); gPlot(GB, G7, GOLD, { xa: 0, xb: x, w: 4 }); gDot(GB, x, G7(x), GOLD, 1);
    mathText('g(x) = ∫ₐˣ f(t) dt', 820, gy(GB, 2.3), 28, GOLD, { align: 'center', alpha: ap(t, 'C01', 0.3), upright: true });
  }
  if (t > S('D02') - 0.1) { const d = ap(t, 'D02', 0); [Z1, Z2].forEach((z, i) => { gV(GT, z, CYAN, d, { ya: -0.9, yb: 1.6, dash: [5, 5] }); gV(GB, z, CYAN, d, { ya: -0.4, yb: 2.6, dash: [5, 5] }); gDot(GB, z, G7(z), CYAN, d); }); label('f = 0 ⇔ g 的极值', 1250, 250, 26, CYAN, d, { bold: true }); }
};

SC.deriv = t => {
  starfield(t); blueprint(0.4, 80);
  const G = { cx: 560, cy: 760, ux: 100, uy: 160, x0: 0, x1: 5.6, y0: -0.4, y1: 1.7 }, x = 1.9, h = lerp(0.6, 0.12, eIO(prog(t, P('C03', 0.5), 1.5)));
  gAxes(G, 1, { grid: false, xl: 't', ticks: { x: [[0, 'a'], [x, 'x']] } });
  gArea(G, F7, 0, x, 0.6); gPlot(G, F7, RED, { xa: 0, xb: 5.5, w: 3.5 });
  if (t > S('C03') - 0.1) {
    const c = ap(t, 'C03', 0.15); ctx.save(); ctx.globalAlpha = c; ctx.fillStyle = hexA(GOLD, 0.8); ctx.beginPath(); ctx.moveTo(gx(G, x), gy(G, 0)); for (let k = 0; k <= 20; k++) { const s = x + h * k / 20; ctx.lineTo(gx(G, s), gy(G, F7(s))); } ctx.lineTo(gx(G, x + h), gy(G, 0)); ctx.closePath(); ctx.fill(); ctx.restore();
    gBrace(G, x, x + h, 'h', GOLD, c, 50);
    panel(1130, 230, 340, 300, GOLD, c); const X0 = 1230, Y0 = 470, W = 140, H = 200 * F7(x) / 1.4;
    ctx.save(); ctx.globalAlpha = c; ctx.fillStyle = hexA(GOLD, 0.35); ctx.fillRect(X0, Y0 - H, W, H); ctx.restore(); seg(X0, Y0 - H, X0 + W, Y0 - H * F7(x + h) / F7(x), RED, c, 3);
    mathText('h', X0 + W / 2, Y0 + 26, 24, GOLD, { align: 'center', alpha: c, upright: true }); mathText('f(x)', X0 - 40, Y0 - H / 2, 24, RED, { align: 'center', alpha: c, upright: true });
    label('面积 ≈ f(x)·h', 1300, 270, 26, GOLD, c, { bold: true });
  }
  if (t > S('C04') - 0.1) { panel(560, 220, 540, 80, CYAN, ap(t, 'C04', 0)); richReveal([["g′(x) = lim [g(x + h) − g(x)]/h = ", CR], ['f(x)', GOLD]], 830, 260, 24, t, P('C04', 0.15), { upright: true }); }
  if (t > S('M01') - 0.1) label('极其漂亮！', 1300, 600, 36, SQ.M.col, ap(t, 'M01', 0.1), { bold: true });
  if (t > S('C05') - 0.1) { panel(1050, 680, 420, 120, GRN, ap(t, 'C05', 0)); label('基本定理（一）', 1260, 715, 26, GRN, ap(t, 'C05', 0.1), { bold: true }); richReveal([['d/dx ∫ₐˣ f(t) dt = f(x)', GOLD]], 1260, 765, 28, t, P('C05', 0.4), { upright: true }); }
};

const FR = x => Math.sin(Math.PI * x * x / 2), SF = cum(FR, 0);
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  const fa = fadeOut(t, S('M02'), 0.3);
  if (fa > 0) { richReveal([['d/dx ∫₀ˣ √(1 + ', CR], ['t', GOLD], ['²) dt = √(1 + ', CR], ['x', GOLD], ['²)', CR]], CX, 420, 44, t, P('C06', 0.1), { upright: true, alpha: fa }); label('t → x', CX, 520, 34, GOLD, ap(t, 'C06', 0.6) * fa, { bold: true }); }
  if (t < S('M02') - 0.1) return;
  const a = ap(t, 'M02', 0), G = { cx: 580, cy: 640, ux: 195, uy: 200, x0: 0, x1: 4.2, y0: -1.1, y1: 1.2 };
  gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4']] } });
  gPlot(G, FR, hexA(RED, 0.6), { a, xa: 0, xb: 4, n: 600, w: 2.5 }); gPlot(G, SF, GOLD, { a, xa: 0, xb: lerp(0, 4, prog(t, P('M02', 0.1), 1.5)), n: 300, w: 4 });
  mathText('S(x) = ∫₀ˣ sin(πt²/2) dt', CX, 260, 30, GOLD, { align: 'center', alpha: a, upright: true });
  richReveal([["S′(x) = ", CR], ['sin(πx²/2)', RED]], CX, 330, 30, t, P('M02', 0.6), { upright: true });
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['d/dx ∫₁ˣ (t³ + 1) dt = ？', CR]], 820, 360, 46, t, P('C08', 0.1), { upright: true });
  if (t > S('D03')) richReveal([['= ', CR], ['x³ + 1', GOLD]], 820, 520, 54, t, P('D03', 0.15), { upright: true });
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([['d/dx ∫ₐˣ f(t) dt = f(x)', GOLD]], CX, 430, 52, t, P('C09', 0.15), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：变限积分求导', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('MiMo：上限不是 x 怎么办', CX, 590, 32, SQ.T.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 5 章 · P7 基本定理（一）', '下一段：变限积分求导', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM5('Gemini')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.2, 'pop', 0.16); s('C01', 0.2, 'riser', 0.16); s('C01', 0.3, 'type', 0.12); s('D02', 0.05, 'ding', 0.2);
  s('C03', 0.15, 'pop', 0.18); s('C03', 0.5, 'warp', 0.16); s('C04', 0.15, 'type', 0.14); s('M01', 0.1, 'sparkle', 0.24); s('C05', 0.4, 'ding_hi', 0.26);
  s('C06', 0.1, 'type', 0.14); s('C06', 0.6, 'ding', 0.2); s('M02', 0.1, 'whoosh', 0.16); s('M02', 0.6, 'ding_hi', 0.24);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.15, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
