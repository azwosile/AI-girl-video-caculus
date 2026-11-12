// 第 9 章 P7《一阶线性方程与积分因子》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.5 例 1。揭晓 P0。
// A404 “滤镜”扫过：y′ + Py 变成 (Iy)′ · A405 例 1 三步推导 · A406 排队解 N = 300(1 − e^(−0.1t))：190 人、11 分钟、永远 < 300
const SC = {};
const TITLES = [['idea', '积分因子'], ['ex', '例 1'], ['queue', '解开排队'], ['quiz', '随堂一题'], ['outro', '小结']];

const N7 = t => 300 * (1 - Math.exp(-0.1 * t));
const G7 = { cx: 610, cy: 790, ux: 14, uy: 1.45, x0: 0, x1: 42, y0: 0, y1: 340 };
function filterSweep7(x, y, w, h, p, a) {   // MiniMax 色的滤镜光带从左扫到右
  if (a <= 0 || p <= 0 || p >= 1) return; const X = x + w * p;
  ctx.save(); ctx.globalAlpha *= a; const g = ctx.createLinearGradient(X - 80, 0, X + 20, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.8, hexA(SQ.N.col, 0.55)); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(X - 80, y, 100, h); ctx.restore();
}

// ======================= 积分因子（A404） =======================
SC.idea = t => {
  starfield(t); blueprint(0.3, 80);
  label('滤镜 ×I', 870, 230, 40, SQ.N.col, ap(t, 'N01', 0.1), { bold: true });
  if (t > S('C01')) richReveal([["y′ + P(x)y", RED], [' = ', CR], ['Q(x)', CYAN]], 870, 320, 40, t, P('C01', 0.2), { upright: true });
  if (t > S('C02')) {
    richReveal([['I = e^{∫P dx}', GOLD]], 870, 400, 36, t, P('C02', 0.1), { upright: true });
    const p = prog(t, P('C02', 0.4), 1.0);
    panel(560, 450, 620, 100, SQ.N.col, ap(t, 'C02', 0.35));
    if (p < 1) mathText("I·y′ + I·P·y", 870, 500, 38, CR, { alpha: ap(t, 'C02', 0.35) * (1 - p), upright: true });
    if (p > 0) mathText("(I · y)′", 870, 500, 42, GOLD, { alpha: p, upright: true });
    filterSweep7(560, 450, 620, 100, p, 1);
  }
  if (t > S('G01')) { label('乘积法则倒过来用', 870, 600, 28, CYAN, ap(t, 'G01', 0.1), { bold: true }); goldBox(870, 680, 360, 64, 'I y = ∫ I Q dx', 34, ap(t, 'G01', 0.5)); }
};

// ======================= 例 1（A405） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([["y′ + 3x²y = 6x²", CR]], 870, 250, 38, t, P('C03', 0.05), { upright: true });
  if (t > S('C03')) richReveal([['P = 3x²  ⇒  ', CR], ['I = e^{x³}', GOLD]], 870, 330, 34, t, P('C03', 0.5), { upright: true });
  if (t > S('C04')) { richReveal([["(e^{x³} y)′", GOLD], [' = 6x² e^{x³}', CR]], 870, 420, 34, t, P('C04', 0.05), { upright: true });
    richReveal([['e^{x³} y = ', CR], ['2e^{x³} + C', CYAN]], 870, 500, 34, t, P('C04', 0.5), { upright: true }); }
  if (t > S('N02')) { goldBox(870, 610, 380, 70, 'y = 2 + Ce^{−x³}', 36, ap(t, 'N02', 0.1)); stampMark(1110, 600, 40, t, P('N02', 0.6), { text: '满分', col: SQ.N.col, rot: -0.14 }); }
};

// ======================= 解开排队（A406） =======================
SC.queue = t => {
  starfield(t); blueprint(0.35, 80);
  const fa = ap(t, 'D01', 0) * fadeOut(t, S('G02'), 0.4);
  if (fa > 0) {
    busyWin(870, 280, 460, 120, '排队方程', "N′ + 0.1N = 30", t, P('D01', 0.05), { col: SQ.D.col, size: 32, spin: false, alpha: fa });
    if (t > S('C05')) richReveal([['I = e^{0.1t}', GOLD]], 870, 410, 34, t, P('C05', 0.5), { upright: true, alpha: fa });
    if (t > S('C06')) { richReveal([['N = 300 + Ce^{−0.1t}', CR]], 870, 490, 34, t, P('C06', 0.05), { upright: true, alpha: fa });
      richReveal([['N(0) = 0  ⇒  ', CR], ['C = −300', GOLD]], 870, 570, 34, t, P('C06', 0.55), { upright: true, alpha: fa }); }
  }
  if (t > S('G02') - 0.1) {
    const a = ap(t, 'G02', 0);
    gAxes(G7, a * 0.75, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30'], [40, '40']], y: [[100, '100'], [200, '200'], [300, '300']] } });
    label('t（分钟）', gx(G7, 42) - 10, G7.cy + 40, 22, CR, a * 0.8); label('N', gx(G7, 0) - 30, gy(G7, 330), 26, CR, a, { bold: true });
    richReveal([['N = 300(1 − e^{−0.1t})', GOLD]], 960, 240, 32, t, P('G02', 0.05), { upright: true });
    gPlot(G7, N7, SQ.D.col, { a, w: 5, xa: 0, xb: 42, p: prog(t, P('G02', 0.15), 1.2) });
    if (t > P('G02', 0.5)) { const k = ap(t, 'G02', 0.5); gDot(G7, 10, N7(10), CYAN, k); label('10 分钟 ≈ 190 人', gx(G7, 10) + 120, gy(G7, N7(10)) + 34, 24, CYAN, k, { bold: true }); }
    if (t > P('G02', 0.75)) { const k = ap(t, 'G02', 0.75); gH(G7, 200, RED, k * 0.6, { dash: [8, 6], xb: 11 }); gDot(G7, 11, 200, RED, k); label('≈ 11 分钟到 200', gx(G7, 11) - 20, gy(G7, 200) - 30, 24, RED, k, { bold: true }); }
    if (t > S('D02')) { gH(G7, 300, GOLD, ap(t, 'D02', 0.1), { w: 3, dash: [12, 8] }); label('永远 < 300', gx(G7, 34), gy(G7, 300) - 26, 28, GOLD, ap(t, 'D02', 0.2), { bold: true }); }
    if (t > S('C07')) stampMark(1130, 480, 46, t, P('C07', 0.1), { text: '已解决', col: GRN, rot: -0.14 });
  }
};

// ======================= 随堂 =======================
const GQZ7 = { cx: 620, cy: 780, ux: 200, uy: 110, x0: 0, x1: 3, y0: 0, y1: 4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([["y′ + 2y = 4，", CR], ['x → ∞ 时 y → ？', GOLD]], 860, 250, 36, t, P('C09', 0.05), { upright: true });
  if (t > S('D03')) {
    richReveal([['y = 2 + Ce^{−2x}  →  ', CR], ['2', GOLD]], 860, 330, 36, t, P('D03', 0.15), { upright: true });
    const a = ap(t, 'D03', 0.35); gAxes(GQZ7, a * 0.6, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[2, '2']] } });
    [3, 1.5, -1.5].forEach((c, i) => gPlot(GQZ7, x => 2 + c * Math.exp(-2 * x), CYAN, { a: a * 0.8, w: 3, p: prog(t, P('D03', 0.4 + 0.08 * i), 0.8) }));
    gH(GQZ7, 2, GOLD, a, { w: 4, dash: [10, 6] });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { richReveal([['× e^{∫P}  ⇒  ', CR], ['(I y)′ = I Q', GOLD]], CX, 360, 46, t, P('C10', 0.05), { upright: true, alpha: ga }); richReveal([['一步 ', CR], ['积出来', CYAN]], CX, 460, 40, t, P('C10', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：RL 电路', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('Grok 一拉电闸', CX, 610, 32, SQ.X.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P7 一阶线性', '下一段：RL 电路', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM9('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.1, 'sparkle', 0.18); s('C01', 0.2, 'pop', 0.18); s('C02', 0.1, 'pop', 0.16); s('C02', 0.4, 'swoosh_in', 0.18); s('C02', 0.9, 'shimmer', 0.16); s('G01', 0.5, 'ding', 0.22);
  s('C03', 0.05, 'pop', 0.16); s('C03', 0.5, 'pop', 0.16); s('C04', 0.05, 'pop', 0.16); s('C04', 0.5, 'pop', 0.16); s('N02', 0.1, 'ding', 0.22); s('N02', 0.6, 'stamp', 0.26);
  s('D01', 0.05, 'pop', 0.18); s('C05', 0.5, 'pop', 0.16); s('C06', 0.05, 'pop', 0.16); s('C06', 0.55, 'ding', 0.2); s('G02', 0.15, 'riser', 0.14); s('G02', 0.5, 'tick', 0.18); s('G02', 0.75, 'tick', 0.18); s('D02', 0.1, 'ding_hi', 0.26); s('C07', 0.1, 'stamp', 0.28);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.15, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C10', 0.5, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
