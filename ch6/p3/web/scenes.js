// 第 6 章 P3《换个方向：对 y 积分》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.1 例 6。
// A254 竖切要分两块 · A255 横切一块搞定 · A256 左右边界 x_L、x_R 用颜色标注
const SC = {};
const TITLES = [['vert', '竖着切'], ['horiz', '横过来切'], ['quiz', '随堂一题'], ['outro', '小结']];
const G = { cx: 900, cy: 590, ux: 68, uy: 56, x0: -3.7, x1: 6.2, y0: -3.1, y1: 5 };
const XR = y => y + 1, XL = y => y * y / 2 - 3, PUP = x => Math.sqrt(Math.max(0, 2 * x + 6)), LINE3 = x => x - 1;
const RC = GRN, LC = RED;
function regionY(a, col) { // 横向区域：y 从 −2 到 4，右 XR、左 XL
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); const n = 120;
  for (let i = 0; i <= n; i++) { const y = -2 + 6 * i / n; ctx[i ? 'lineTo' : 'moveTo'](gx(G, XR(y)), gy(G, y)); }
  for (let i = n; i >= 0; i--) { const y = -2 + 6 * i / n; ctx.lineTo(gx(G, XL(y)), gy(G, y)); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
}
function base(t, a, hi) {
  gAxes(G, a, { grid: false, xl: 'x' });
  regionY(a * 0.8, 'rgba(92,200,232,0.16)');
  gPlotY(G, XL, hi ? LC : CYAN, { a, ya: -2.95, yb: 4.6 }); gPlot(G, LINE3, hi ? RC : GOLD, { a, xa: -2.2, xb: 5.9 });
  [[-1, -2], [5, 4]].forEach(([x, y]) => { glowDot(gx(G, x), gy(G, y), 8, CR, a); mathText(`(${x}, ${y})`, gx(G, x) + (x > 0 ? 70 : -70), gy(G, y) + (x > 0 ? 0 : 26), 22, CR, { align: 'center', alpha: a }); });
}

// ======================= 竖着切（A254） =======================
SC.vert = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C01', 0);
  base(t, a, false);
  label('y² = 2x + 6', gx(G, XL(4.6)) - 30, gy(G, 4.6) - 20, 24, CYAN, a, { bold: true }); label('y = x − 1', gx(G, 5.9) - 10, gy(G, 4.9) - 18, 24, GOLD, a, { bold: true });
  if (t > S('G01')) {
    const p = eIO(prog(t, P('G01', 0.2), 1.0)); const n1 = 8;
    for (let k = 0; k < n1; k++) { const q = clamp(p * n1 - k); if (q > 0) { const x = -3 + 2 * (k + 0.5) / n1; gStrip(G, x, 0.2, PUP, x => -PUP(x), CYAN, q * 0.8, { fa: 0.35 }); } }
    label('①', gx(G, -2), gy(G, 0) - 6, 34, CYAN, ap(t, 'G01', 0.6), { bold: true });
  }
  if (t > S('C02')) {
    const c = ap(t, 'C02', 0.05); seg(gx(G, -1), gy(G, -2.9), gx(G, -1), gy(G, 4.6), GOLD, c, 2, [8, 6]); mathText('x = −1', gx(G, -1), gy(G, -2.9) + 30, 22, GOLD, { align: 'center', alpha: c });
    const p = eIO(prog(t, P('C02', 0.3), 1.2)), n2 = 14;
    for (let k = 0; k < n2; k++) { const q = clamp(p * n2 - k); if (q > 0) { const x = -1 + 6 * (k + 0.5) / n2; gStrip(G, x, 0.32, PUP, LINE3, GOLD, q * 0.8, { fa: 0.35 }); } }
    label('②', gx(G, 2), gy(G, 1.6), 34, GOLD, ap(t, 'C02', 0.7), { bold: true });
    richReveal([['A = ', CR], ['∫', GOLD], ['₋₃^{−1} 2√(2x+6) dx', CYAN], [' + ', CR], ['∫', GOLD], ['₋₁⁵ [√(2x+6) − (x − 1)] dx', GOLD]], CX, 250, 30, t, P('C02', 0.5), { upright: true });
  }
  if (t > S('D01')) label('两块 + 根号 = 麻烦', CX, 320, 30, SQ.D.col, ap(t, 'D01', 0.1) * fadeOut(t, S('X01')), { bold: true });
  if (t > S('X01')) { const x = ap(t, 'X01', 0.2); panel(780, 290, 400, 76, SQ.X.col, x, 'rgba(40,10,10,0.88)'); label('横过来切！', CX, 330, 42, '#FF5A4E', x, { bold: true }); }
};

// ======================= 横过来切（A255、A256） =======================
SC.horiz = t => {
  starfield(t); blueprint(0.35, 80);
  base(t, 1, true);
  const la = ap(t, 'X02', 0.15), ra = ap(t, 'X02', 0.55);
  mathText('x_L = y²/2 − 3', gx(G, XL(4.6)) - 40, gy(G, 4.6) - 12, 28, LC, { align: 'center', alpha: la, glow: 8 });
  mathText('x_R = y + 1', gx(G, 5.9) + 10, gy(G, 4.9) - 10, 28, RC, { align: 'center', alpha: ra, glow: 8 });
  const show = t > S('C03');
  if (show && t < S('G02')) {
    const u = prog(t, P('C03', 0.1), D('C03') + D('C04') * 0.6), y = -1.5 + 5 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), c = ap(t, 'C03', 0.1);
    gStripH(G, y, 0.22, XR, XL, GOLD, c);
    arrowH(gx(G, XL(y)), gx(G, XR(y)), gy(G, y) - 28, GOLD, c, 2.5); label('右 − 左', gx(G, (XL(y) + XR(y)) / 2), gy(G, y) - 48, 24, GOLD, c, { bold: true });
    mathText('dy', gx(G, XR(y)) + 34, gy(G, y) + 8, 24, GOLD, { alpha: c });
  }
  if (t > S('G02')) { const p = eIO(prog(t, P('G02', 0.05), 1.2)), n = 16; for (let k = 0; k < n; k++) { const q = clamp(p * n - k); if (q > 0) { const y = -2 + 6 * (k + 0.5) / n; gStripH(G, y, 0.33, XR, XL, GOLD, q * 0.8, { fa: 0.35 }); } } }
  if (t > S('C04') && t < S('G02')) richReveal([['y + 1 = y²/2 − 3  ⇒  ', CR], ['y = −2, 4', GOLD]], CX, 250, 36, t, P('C04', 0.2), { upright: true });
  if (t > S('G02')) richReveal([['A = ', CR], ['∫', GOLD], ['₋₂⁴ [(y + 1) − (y²/2 − 3)] dy = ', CR], ['18', GOLD]], CX, 250, 36, t, P('G02', 0.2), { upright: true });
  if (t > S('X03')) stampMark(1290, 470, 62, t, P('X03', 0.1), { col: SQ.X.col, text: '一刀' });
  if (t > S('C05')) {
    const c = ap(t, 'C05', 0.1); panel(600, 300, 760, 110, GOLD, c);
    label('竖切：上 − 下，对 x 积', CX, 336, 30, CYAN, c, { bold: true }); label('横切：右 − 左，对 y 积', CX, 380, 30, GOLD, ap(t, 'C05', 0.5), { bold: true });
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 700, cy: 780, ux: 110, uy: 110, x0: -0.2, x1: 4.6, y0: -0.2, y1: 2.5 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['y = √x，y = 0，x = 4：对 y 积分 = ？', CR]], 800, 300, 36, t, P('C07', 0.1), { upright: true });
  const ga = ap(t, 'C07', 0.3); gAxes(GQ, ga * 0.8, { grid: false });
  gBetween(GQ, Math.sqrt, () => 0, 0, 4, ga * 0.7, { col: 'rgba(92,200,232,0.22)' }); gPlot(GQ, Math.sqrt, CYAN, { a: ga, xa: 0, xb: 4.4 }); seg(gx(GQ, 4), gy(GQ, 0), gx(GQ, 4), gy(GQ, 2.2), GRN, ga, 3);
  if (t > S('D02')) {
    const d = ap(t, 'D02', 0.1); gStripH(GQ, 1.2, 0.12, () => 4, y => y * y, GOLD, d);
    label('x = y²', gx(GQ, 1.44) - 70, gy(GQ, 1.2) - 10, 22, RED, d, { bold: true }); label('x = 4', gx(GQ, 4) + 50, gy(GQ, 2.1), 22, GRN, d, { bold: true });
    richReveal([['∫', GOLD], ['₀² (4 − y²) dy = ', CR], ['16/3', GOLD]], 860, 420, 40, t, P('D02', 0.5), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { base(t, ga * 0.7, true); richReveal([['边界不换的方向 → 就沿它切', GOLD]], CX, 250, 40, t, P('C08', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：切片法求体积', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('MiniMax 拍 CT', CX, 590, 32, SQ.N.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 6 章 · P3 换个方向：对 y 积分', '下一段：切片法求体积', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM6('Grok')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'pop', 0.16); s('G01', 0.2, 'riser', 0.14); s('C02', 0.05, 'zap', 0.14); s('C02', 0.3, 'riser', 0.14); s('C02', 0.5, 'type', 0.14); s('D01', 0.1, 'buzz', 0.16); s('X01', 0.2, 'slam', 0.26);
  s('X02', 0.15, 'pop', 0.16); s('X02', 0.55, 'pop', 0.16); s('C03', 0.1, 'whoosh', 0.14); s('C04', 0.2, 'type', 0.14); s('G02', 0.05, 'riser', 0.16); s('G02', 0.2, 'ding_hi', 0.24); s('X03', 0.1, 'stamp', 0.26); s('C05', 0.1, 'ding', 0.2);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.5, 'ding_hi', 0.28);
  s('C08', 0.15, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
