// 第 10 章 P4《参数曲线的面积与弧长》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.2 例 3 + 同济星形线。
// A446 摆线一拱下的面积 = 3 个滚动圆 · A447 弧长卷尺沿摆线展开成 8r · A448 星形线四分之一 × 4、|sin t cos t| 正负抵消陷阱
const SC = {};
const TITLES = [['area', '面积'], ['len', '弧长'], ['astro', '星形线'], ['quiz', '随堂一题'], ['outro', '小结']];
const cx4 = s => s - Math.sin(s), cy4 = s => 1 - Math.cos(s);
function cycFill(G, ta, tb, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(gx(G, cx4(ta)), G.cy);
  for (let i = 0; i <= 120; i++) { const s = ta + (tb - ta) * i / 120; ctx.lineTo(gx(G, cx4(s)), gy(G, cy4(s))); } ctx.lineTo(gx(G, cx4(tb)), G.cy); ctx.closePath(); ctx.fill(); ctx.restore();
}

// ======================= 面积（A446） =======================
const G4 = { cx: 640, cy: 760, ux: 88, uy: 88, x0: -0.2, x1: 6.8, y0: 0, y1: 2.4 };
SC.area = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'H01', 0); gAxes(G4, a * 0.55, { grid: false, ticks: { x: [[TAU, '2πr']], y: [[2, '2r']] } });
  paramTrace(G4, cx4, cy4, 0, TAU, SQ.H.col, { a, w: 4, dot: false });
  if (t > S('C01')) { richReveal([['A = ∫ y dx = ', CR], ['∫ g(t) f′(t) dt', GOLD]], 980, 230, 34, t, P('C01', 0.15), { upright: true });
    const p = prog(t, P('C01', 0.4), 1.6); for (let i = 0; i < 14 * p; i++) { const s0 = TAU * i / 14, s1 = TAU * (i + 1) / 14, xm = (s0 + s1) / 2; ctx.save(); ctx.globalAlpha *= 0.55; ctx.fillStyle = hexA(SQ.H.col, 0.45); ctx.strokeStyle = SQ.H.col; ctx.lineWidth = 1.2;
      const X0 = gx(G4, cx4(s0)), X1 = gx(G4, cx4(s1)), Y = gy(G4, cy4(xm)); ctx.fillRect(X0, Y, X1 - X0, G4.cy - Y); ctx.strokeRect(X0, Y, X1 - X0, G4.cy - Y); ctx.restore(); } }
  if (t > S('C02')) label('θ: 0 → 2π', 1240, 700, 26, CYAN, ap(t, 'C02', 0.2), { bold: true });
  if (t > S('C03')) {
    cycFill(G4, 0, TAU, hexA(GOLD, 0.25), ap(t, 'C03', 0.05));
    richReveal([['∫₀^{2π} r²(1 − cos θ)² dθ = ', CR], ['3πr²', GOLD]], 980, 300, 32, t, P('C03', 0.1), { upright: true });
    [0, 1, 2].forEach(i => { const k = ap(t, 'C03', 0.45 + 0.12 * i); ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = hexA(GOLD, 0.3); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(720 + i * 190, 430, 80, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); label('πr²', 720 + i * 190, 430, 28, GOLD, k, { bold: true }); });
    label('= 3 个圆', 1270, 430, 32, GOLD, ap(t, 'C03', 0.8), { bold: true });
  }
  if (t > S('G01')) label('伽利略：剪纸称重', 1240, 520, 24, SQ.G.col, ap(t, 'G01', 0.2), { bold: true });
};

// ======================= 弧长（A447） =======================
SC.len = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C04', 0); gAxes(G4, a * 0.55, { grid: false, ticks: { x: [[TAU, '2πr']], y: [[2, '2r']] } });
  goldBox(980, 230, 560, 74, 'L = ∫ √((dx/dt)² + (dy/dt)²) dt', 32, ap(t, 'C04', 0.05));
  const p = eIO(prog(t, P('C04', 0.3), 2.2)), th = TAU * p;
  paramTrace(G4, cx4, cy4, 0, TAU, SQ.H.col, { a: a * 0.35, w: 3, dot: false, dash: [8, 8] });
  paramTrace(G4, cx4, cy4, 0, Math.max(1e-3, th), GOLD, { a, w: 5 });
  const Lp = 4 * (1 - Math.cos(th / 2)); // r = 1 时已走弧长
  seg(640, 360, 640 + Lp * 70, 360, GOLD, a, 8); for (let k = 0; k <= 8; k++) { seg(640 + k * 70, 344, 640 + k * 70, 376, CR, a * 0.5, 2); if (k % 2 === 0) label(`${k}r`, 640 + k * 70, 400, 20, CR, a * 0.7); }
  label(`已走 ${Lp.toFixed(2)} r`, 980, 300, 26, GOLD, a, { bold: true });
  if (p >= 0.999) stampMark(1260, 520, 44, t, P('C04', 0.3) + 2.3, { text: '8r', col: GOLD, rot: -0.1 });
};

// ======================= 星形线（A448） =======================
const GA4 = { cx: 820, cy: 560, ux: 150, uy: 150, x0: -1.25, x1: 1.25, y0: -1.25, y1: 1.25 };
const ax4 = s => Math.cos(s) ** 3, ay4 = s => Math.sin(s) ** 3;
SC.astro = t => {
  starfield(t); blueprint(0.34, 80);
  const pre = t < S('D01') - 0.05, a = ap(t, 'H02', 0) * (pre ? 1 : fadeOut(t, S('D01') - 0.05, 0.3));
  if (a > 0) {
    gAxes(GA4, a * 0.45, { grid: false, ticks: { x: [[1, 'a']], y: [[1, 'a']] } });
    paramTrace(GA4, ax4, ay4, 0, TAU, SQ.L.col, { a: a * 0.5, w: 3, dot: false });
    paramTrace(GA4, ax4, ay4, 0, Math.PI / 2, GOLD, { a: a * ap(t, 'H02', 0.3), w: 6, dot: false });
    label('× 4', 1000, 330, 40, GOLD, a * ap(t, 'H02', 0.5), { bold: true });
    if (t > S('C05')) { richReveal([['速度 = 3a sin t cos t', CR]], 1170, 470, 28, t, P('C05', 0.1), { upright: true, alpha: a });
      richReveal([['L = 4∫₀^{π/2} 3a sin t cos t dt = ', CR], ['6a', GOLD]], 980, 230, 30, t, P('C05', 0.45), { upright: true, alpha: a }); }
    if (t > S('C06')) { ctx.save(); ctx.globalAlpha *= a * ap(t, 'C06', 0.1) * 0.35; ctx.fillStyle = CYAN; ctx.beginPath(); for (let i = 0; i <= 200; i++) { const s = TAU * i / 200; ctx[i ? 'lineTo' : 'moveTo'](gx(GA4, ax4(s)), gy(GA4, ay4(s))); } ctx.fill(); ctx.restore();
      goldBox(1170, 560, 230, 64, 'A = 3πa²/8', 30, a * ap(t, 'C06', 0.3)); }
  }
  if (!pre) {
    const b = ap(t, 'D01', 0), G = { cx: 700, cy: 560, ux: 95, uy: 260, x0: 0, x1: 6.6, y0: -0.6, y1: 0.6 };
    richReveal([['∫₀^{2π} sin t cos t dt = ', CR], ['0', RED], [' ？', RED]], 980, 240, 34, t, P('D01', 0.1), { upright: true });
    gAxes(G, b * 0.5, { grid: false, ticks: { x: [[Math.PI / 2, 'π/2'], [Math.PI, 'π'], [TAU, '2π']], y: [] } });
    ctx.save(); ctx.globalAlpha *= b * 0.45; for (let i = 0; i < 160; i++) { const s = TAU * i / 160, y = Math.sin(s) * Math.cos(s); ctx.fillStyle = y >= 0 ? GRN : RED; const X = gx(G, s), Y = gy(G, y); ctx.fillRect(X, Math.min(Y, G.cy), TAU / 160 * G.ux + 0.6, Math.abs(Y - G.cy)); } ctx.restore();
    gPlot(G, s => Math.sin(s) * Math.cos(s), CR, { a: b, xa: 0, xb: TAU, w: 3 });
    if (t > S('C07')) { const k = ap(t, 'C07', 0.2); gPlot(G, s => Math.abs(Math.sin(s) * Math.cos(s)), GOLD, { a: k, xa: 0, xb: TAU, w: 4 });
      label('取绝对值 |sin t cos t|', 1060, 780, 28, GOLD, k, { bold: true }); label('+ − + − 抵消', 1250, 420, 26, RED, ap(t, 'C07', 0.5), { bold: true }); }
  }
};

// ======================= 随堂 =======================
const GQ4 = { cx: 860, cy: 560, ux: 170, uy: 170, x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['x = cos t，y = sin t，0 ≤ t ≤ 2π：', CR], ['L = ？', GOLD]], 880, 240, 34, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.2); gAxes(GQ4, a * 0.5, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } });
  const p = t > S('D02') ? prog(t, P('D02', 0.1), 1.4) : 0;
  paramTrace(GQ4, Math.cos, Math.sin, 0, TAU, SQ.H.col, { a: a * 0.4, w: 3, dot: false });
  if (p > 0) { paramTrace(GQ4, Math.cos, Math.sin, 0, TAU, GOLD, { p, w: 5 }); richReveal([['√(sin²t + cos²t) = 1  ⇒  ', CR], ['L = 2π', GOLD]], 880, 310, 32, t, P('D02', 0.2), { upright: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.7)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) {
    richReveal([['面积：', CR], ['∫ g(t) f′(t) dt', GOLD]], CX, 340, 44, t, P('C10', 0.05), { upright: true, alpha: ga });
    richReveal([['弧长：', CR], ['∫ √(x′² + y′²) dt', CYAN]], CX, 440, 44, t, P('C10', 0.45), { upright: true, alpha: ga });
  }
  if (t > S('C11') - 0.1) { glowText('下一段：旋转曲面面积', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('千问的珍珠奶茶', CX, 610, 32, SQ.Q.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 10 章 · P4 面积与弧长', '下一段：旋转曲面', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM10('混元')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('H01', 0.1, 'click', 0.2); s('H01', 0.3, 'click', 0.16); s('C01', 0.15, 'ding', 0.2); s('C01', 0.4, 'swell', 0.12); s('C02', 0.2, 'pop', 0.14); s('C03', 0.1, 'ding_hi', 0.22); [0.45, 0.57, 0.69].forEach(f => s('C03', f, 'pop', 0.16)); s('G01', 0.2, 'pop', 0.14);
  s('C04', 0.05, 'ding', 0.2); s('C04', 0.3, 'swell', 0.14); sfx(P('C04', 0.3) + 2.3, 'stamp', 0.26);
  s('H02', 0.1, 'click', 0.18); s('H02', 0.5, 'pop', 0.16); s('C05', 0.1, 'pop', 0.14); s('C05', 0.45, 'ding', 0.2); s('C06', 0.3, 'ding', 0.2); s('D01', 0.1, 'buzz', 0.16); s('C07', 0.2, 'pop', 0.16); s('C07', 0.5, 'buzz', 0.14);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.7, 'check', 0.24);
  s('C10', 0.05, 'pop', 0.2); s('C10', 0.45, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
