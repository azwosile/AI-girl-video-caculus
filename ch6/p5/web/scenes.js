// 第 6 章 P5《圆盘法》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.2 例 2、例 3。
// A260 平面区域转成立体（伪 3D 旋转）· A261 一片圆盘的半径就是函数值 · A262 外接圆柱估算检查
const SC = {};
const TITLES = [['spin', '转起来'], ['yaxis', '绕 y 轴'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 转起来（A260–A262） =======================
const G1 = { cx: 700, cy: 590, ux: 520, uy: 210, x0: -0.08, x1: 1.3, y0: -1.25, y1: 1.3 };
const O1 = { axis: 'x', at: 0, e: 0.32, R: x => Math.sqrt(Math.max(0, x)), t0: 0.0005, t1: 1 };
SC.spin = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'M01', 0), th = 2 * Math.PI * eIO(prog(t, P('M01', 0.35), D('M01') * 0.6 + 1.2));
  seg(gx(G1, -0.06), gy(G1, 0), gx(G1, 1.25), gy(G1, 0), CR, a * 0.8, 2); mathText('x', gx(G1, 1.28), gy(G1, 0) + 8, 26, CR, { alpha: a });
  if (th < 0.05) { gArea(G1, Math.sqrt, 0, 1, a, { pos: 'rgba(127,178,255,0.30)' }); }
  revSolid(G1, { ...O1, th: Math.max(0.0001, th), col: SQ.M.col, a, Rmax: 1, rings: 6 });
  gPlot(G1, Math.sqrt, GOLD, { a: a * (1 - 0.5 * clamp(th / 6.28)), xa: 0, xb: 1.15 }); label('y = √x', gx(G1, 1.15) + 50, gy(G1, Math.sqrt(1.15)) - 6, 26, GOLD, a, { bold: true });
  const fadeC = fadeOut(t, S('C03') + 0.3);
  if (t > S('C02')) {
    const u = prog(t, P('C02', 0.1), D('C02') * 0.85), x = 0.2 + 0.7 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), c = ap(t, 'C02', 0.1);
    revSlab(G1, O1, x, 0.035, GOLD, c * fadeC + c * 0.0);
    seg(gx(G1, x), gy(G1, 0), gx(G1, x), gy(G1, Math.sqrt(x)), '#ffffff', c * fadeC, 2.5); mathText('√x', gx(G1, x) + 14, gy(G1, Math.sqrt(x) / 2), 24, GOLD, { alpha: c * fadeC });
  }
  if (t > S('C03')) {
    const p = eIO(prog(t, P('C03', 0.1), 1.0)), n = 12; for (let k = 0; k < n; k++) { const q = clamp(p * n - k); if (q > 0) revSlab(G1, O1, (k + 0.5) / n, 0.9 / n, GOLD, q * 0.8 * fadeOut(t, S('G01')), { fa: 0.35 }); }
    richReveal([['A(x) = π(√x)² = πx  ⇒  V = ', CR], ['∫', GOLD], ['₀¹ πx dx = ', CR], ['π/2', GOLD]], CX, 250, 36, t, P('C03', 0.25), { upright: true });
  }
  if (t > S('G01')) {
    const g = ap(t, 'G01', 0.1); revSolid(G1, { axis: 'x', at: 0, e: 0.32, R: () => 1, t0: 0, t1: 1, col: CR, a: g * 0.35, Rmax: 1, rings: 2, fa: 0.08 });
    label('外接圆柱：π', gx(G1, 0.5), gy(G1, -1) + 50, 28, CR, g, { bold: true });
    richReveal([['π/2 = 圆柱的一半  ', CR], ['✓ 合理', GRN]], CX, 320, 32, t, P('G01', 0.55), { upright: true });
  }
  if (t > S('M02')) label('太敏锐了！', 1250, 420, 34, SQ.M.col, ap(t, 'M02', 0.15), { bold: true });
};

// ======================= 绕 y 轴 =======================
const G2 = { cx: 940, cy: 770, ux: 78, uy: 50, x0: -2.7, x1: 2.9, y0: -0.4, y1: 8.8 };
const O2 = { axis: 'y', at: 0, e: 0.3, R: y => Math.cbrt(Math.max(0, y)), t0: 0.0005, t1: 8 };
SC.yaxis = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C04', 0), th = 2 * Math.PI * eIO(prog(t, P('C04', 0.55), Math.max(1.2, D('C04') * 0.45)));
  seg(gx(G2, 0), gy(G2, -0.3), gx(G2, 0), gy(G2, 8.7), CR, a * 0.8, 2); mathText('y', gx(G2, 0) + 12, gy(G2, 8.7), 26, CR, { alpha: a });
  if (th < 0.05) { // 平面区域：x 从 0 到 ∛y
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.moveTo(gx(G2, 0), gy(G2, 0)); for (let i = 0; i <= 60; i++) { const y = 8 * i / 60; ctx.lineTo(gx(G2, Math.cbrt(y)), gy(G2, y)); } ctx.lineTo(gx(G2, 0), gy(G2, 8)); ctx.closePath(); ctx.fillStyle = 'rgba(127,178,255,0.30)'; ctx.fill(); ctx.restore();
  }
  revSolid(G2, { ...O2, th: Math.max(0.0001, th), col: SQ.M.col, a, Rmax: 2, rings: 6 });
  gPlotY(G2, y => Math.cbrt(y), GOLD, { a: a * (1 - 0.5 * clamp(th / 6.28)), ya: 0, yb: 8.6 }); seg(gx(G2, 0), gy(G2, 8), gx(G2, 2.3), gy(G2, 8), GRN, a, 2.5);
  label('y = x³', gx(G2, 2.05) + 60, gy(G2, 7) + 30, 26, GOLD, a, { bold: true }); label('y = 8', gx(G2, 2.3) + 50, gy(G2, 8), 26, GRN, a, { bold: true });
  if (t > S('C05')) {
    const u = prog(t, P('C05', 0.15), D('C05') * 0.8 + D('G02') * 0.4), y = 1 + 6 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), c = ap(t, 'C05', 0.15) * fadeOut(t, S('G02') + 0.6);
    revSlab(G2, O2, y, 0.22, GOLD, c);
    seg(gx(G2, 0), gy(G2, y), gx(G2, Math.cbrt(y)), gy(G2, y), '#ffffff', c, 2.5); mathText('∛y', gx(G2, Math.cbrt(y)) + 16, gy(G2, y) - 10, 24, GOLD, { alpha: c });
  }
  if (t > S('G02')) {
    const p = eIO(prog(t, P('G02', 0.2), 1.0)), n = 12; for (let k = 0; k < n; k++) { const q = clamp(p * n - k); if (q > 0) revSlab(G2, O2, 8 * (k + 0.5) / n, 8 / n * 0.85, GOLD, q * 0.7, { fa: 0.35 }); }
    richReveal([['V = ', CR], ['∫', GOLD], ['₀⁸ π(∛y)² dy = ', CR], ['96π/5', GOLD]], CX, 250, 40, t, P('G02', 0.15), { upright: true });
  }
  if (t > S('C06')) {
    const c = ap(t, 'C06', 0.1); panel(1060, 330, 380, 120, GOLD, c);
    label('绕哪根轴', 1250, 368, 28, CR, c, { bold: true }); label('就垂直哪根轴切', 1250, 412, 28, GOLD, ap(t, 'C06', 0.4), { bold: true });
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 760, cy: 640, ux: 300, uy: 110, x0: -0.1, x1: 1.3, y0: -1.2, y1: 1.2 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['y = x，0 ≤ x ≤ 1，绕 x 轴：V = ？', CR]], 800, 300, 38, t, P('C08', 0.05), { upright: true });
  const ga = ap(t, 'C08', 0.3); seg(gx(GQ, -0.05), GQ.cy, gx(GQ, 1.25), GQ.cy, CR, ga * 0.7, 2);
  if (t < S('D02')) { gArea(GQ, x => x, 0, 1, ga, { pos: 'rgba(127,178,255,0.30)' }); gPlot(GQ, x => x, GOLD, { a: ga, xa: 0, xb: 1.1 }); }
  else { revSolid(GQ, { axis: 'x', at: 0, e: 0.32, R: x => x, t0: 0.001, t1: 1, th: 2 * Math.PI * eIO(prog(t, P('D02', 0.05), 0.9)) || 0.0001, col: SQ.M.col, a: 1, Rmax: 1, rings: 4 });
    richReveal([['∫', GOLD], ['₀¹ πx² dx = ', CR], ['π/3', GOLD]], 1060, 460, 44, t, P('D02', 0.4), { upright: true }); label('圆锥：Sh/3 ✓', 1060, 540, 28, GRN, ap(t, 'D02', 0.7), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) {
    revSolid(G1, { ...O1, col: SQ.M.col, a: ga * 0.7, Rmax: 1, rings: 6 });
    revSlab(G1, O1, 0.6, 0.04, GOLD, ga);
    richReveal([['圆盘：A = π · 半径²', GOLD]], CX, 250, 44, t, P('C09', 0.15), { upright: true, alpha: ga });
  }
  if (t > S('C10') - 0.1) { glowText('下一段：垫圈法', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('混元的铜钱：外圆减内孔', CX, 590, 32, SQ.H.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 6 章 · P5 圆盘法', '下一段：垫圈法', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM6('Gemini')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.35, 'warp', 0.2); s('C02', 0.1, 'whoosh', 0.14); s('C03', 0.1, 'riser', 0.16); s('C03', 0.25, 'type', 0.14); s('C03', 0.7, 'ding', 0.2); s('G01', 0.1, 'pop', 0.16); s('G01', 0.55, 'check', 0.24); s('M02', 0.15, 'sparkle', 0.2);
  s('C04', 0.55, 'warp', 0.2); s('C05', 0.15, 'whoosh', 0.14); s('G02', 0.15, 'type', 0.14); s('G02', 0.6, 'ding_hi', 0.24); s('C06', 0.1, 'pop', 0.18);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'warp', 0.18); s('D02', 0.4, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
