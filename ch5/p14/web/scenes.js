// 第 5 章 P14《分部积分》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A234 乘积法则 ↔ 分部积分 · A235 u、dv 选择的两条路 · A236 uv 矩形面积分解 · A237 选 u 顺序条
const SC = {};
const TITLES = [['rule', '乘积法则倒过来'], ['try', '选 u'], ['more', '再练两个'], ['quiz', '随堂一题'], ['outro', '小结']];
SC.rule = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([["(uv)′ = u′v + uv′", CYAN]], 760, 270, 34, t, P('C01', 0.05), { upright: true });
  arrowV(760, 300, 360, GOLD, ap(t, 'C01', 0.3));
  panel(540, 370, 440, 90, GOLD, ap(t, 'C01', 0.4)); richReveal([['∫ u dv = uv − ∫ v du', GOLD]], 760, 415, 32, t, P('C01', 0.45), { upright: true });
  // A236：矩形 uv = ∫u dv + ∫v du
  const G = { cx: 1030, cy: 760, ux: 360, uy: 360, x0: 0, x1: 1.15, y0: 0, y1: 1.15 }, a = ap(t, 'C01', 0.5), cu = v => Math.pow(v, 0.55);
  gAxes(G, a, { grid: false, xl: 'v', yl: 'u' });
  gArea(G, cu, 0, 1, a * 0.8, { pos: CYAN });
  ctx.save(); ctx.globalAlpha = a * 0.55; ctx.fillStyle = hexA(INV, 0.7); ctx.beginPath(); ctx.moveTo(gx(G, 0), gy(G, 0)); for (let k = 0; k <= 40; k++) { const v = k / 40; ctx.lineTo(gx(G, v), gy(G, cu(v))); } ctx.lineTo(gx(G, 0), gy(G, 1)); ctx.closePath(); ctx.fill(); ctx.restore();
  gPlot(G, cu, RED, { a, xa: 0, xb: 1 }); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.strokeRect(gx(G, 0), gy(G, 1), G.ux, G.uy); ctx.restore();
  label('∫ u dv', gx(G, 0.68), gy(G, 0.35), 26, CR, a, { font: F_MATH, bold: true }); label('∫ v du', gx(G, 0.2), gy(G, 0.82), 24, CR, a, { font: F_MATH, bold: true });
  label('整块 = uv', gx(G, 0.5), gy(G, 1) - 26, 24, GOLD, a, { bold: true });
};
function road(x, yb, wb, wt, col, a, grow) {
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.18); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(x - wb / 2, yb); ctx.lineTo(x - wt / 2, yb - 300); ctx.lineTo(x + wt / 2, yb - 300); ctx.lineTo(x + wb / 2, yb); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
SC.try = t => {
  starfield(t); blueprint(0.4, 80);
  const pre = t < S('G01') - 0.1;
  if (pre) {
    richReveal([['∫ x sin x dx', CR]], CX, 250, 40, t, P('B01', 0.05), { upright: true });
    const a = ap(t, 'B01', 0.3); road(760, 720, 120, 360, RED, a); label('u = sin x', 760, 750, 24, RED, a, { font: F_MATH, bold: true });
    richReveal([['(x²/2) sin x − ∫ (x²/2) cos x dx', RED]], 760, 380, 22, t, P('B02', 0.1), { upright: true });
    if (t > S('B02')) label('越积越难', 760, 470, 30, RED, ap(t, 'B02', 0.6), { bold: true });
    if (t > S('B03')) crossMark(760, 560, 30, RED, t, P('B03', 0.1));
    const b = ap(t, 'C02', 0); road(1200, 720, 360, 100, GRN, b); label('u = x', 1200, 750, 24, GRN, b, { font: F_MATH, bold: true });
    if (t > S('C02')) richReveal([['du = dx，v = −cos x', GRN]], 1200, 380, 22, t, P('C02', 0.3), { upright: true });
    if (t > S('C03') - 0.1) { richReveal([['−x cos x + ∫ cos x dx', CR]], 1200, 460, 24, t, P('C03', 0.05), { upright: true }); richReveal([['= −x cos x + sin x + C', GOLD]], 1200, 530, 26, t, P('C03', 0.45), { upright: true }); checkMark(1200, 610, 22, GRN, t, P('C03', 0.8)); }
    return;
  }
  const W = ['反', '对', '幂', '三', '指'], N = ['反三角', '对数', '幂函数', '三角', '指数'], C = [INV, CYAN, GRN, GOLD, RED];
  W.forEach((w, i) => { const p = ap(t, 'G01', 0.1 + i * 0.1); if (p <= 0) return; const x = 640 + i * 170; panel(x - 70, 380, 140, 140, C[i], p); label(w, x, 470, 56, C[i], p, { bold: true }); label(N[i], x, 560, 22, CR, p); });
  const q = ap(t, 'G01', 0.65); arrowH(1360, 620, 640, GOLD, q); label('越靠前，越优先当 u', CX, 690, 28, GOLD, q, { bold: true });
};
SC.more = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['∫ ln x dx', CR]], CX, 260, 38, t, P('C04', 0.05), { upright: true });
  richReveal([['u = ln x，dv = dx  ⇒  ', CR], ['x ln x − x + C', GOLD]], CX, 330, 30, t, P('C04', 0.4), { upright: true });
  if (t > S('C05') - 0.1) { richReveal([['∫₀¹ arctan x dx = [x arctan x]₀¹ − ∫₀¹ x/(1 + x²) dx', CR]], CX, 450, 28, t, P('C05', 0.05), { upright: true }); richReveal([['= π/4 − (1/2) ln 2', GOLD]], CX, 520, 36, t, P('C05', 0.5), { upright: true }); }
  if (t > S('B04') - 0.1) { const b = ap(t, 'B04', 0); panel(800, 620, 360, 150, SQ.B.col, b); label('反 对 幂 三 指', CX, 680, 40, SQ.B.col, b, { bold: true }); label('（表情包版）', CX, 735, 22, CR, b); }
};
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫ x eˣ dx = ？', CR]], 820, 360, 48, t, P('C07', 0.1), { upright: true });
  if (t > S('D01')) { richReveal([['u = x，dv = eˣ dx', CYAN]], 820, 460, 30, t, P('D01', 0.05), { upright: true }); richReveal([['= ', CR], ['(x − 1)eˣ + C', GOLD]], 820, 550, 46, t, P('D01', 0.45), { upright: true }); }
};
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['∫ u dv = uv − ∫ v du', GOLD]], CX, 400, 52, t, P('C08', 0.1), { upright: true, alpha: ga }); richReveal([['选 u：反 对 幂 三 指', CYAN]], CX, 490, 36, t, P('C08', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：反常积分初步', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('Gemini：无限长，面积一定无限？', CX, 590, 32, SQ.M.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 5 章 · P14 分部积分', '下一段：反常积分初步', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM5('豆包')]);
};
SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.05, 'type', 0.12); s('C01', 0.45, 'ding', 0.2); s('C01', 0.5, 'whoosh', 0.14);
  s('B01', 0.3, 'pop', 0.16); s('B02', 0.1, 'type', 0.12); s('B02', 0.6, 'glitch', 0.18); s('B03', 0.1, 'buzz', 0.18);
  s('C02', 0.05, 'swoosh_in', 0.16); s('C03', 0.05, 'type', 0.12); s('C03', 0.45, 'ding', 0.2); s('C03', 0.8, 'check', 0.26);
  [0.1, 0.2, 0.3, 0.4, 0.5].forEach(f => s('G01', f, 'marimba', 0.12)); s('G01', 0.65, 'ding_hi', 0.22);
  s('C04', 0.05, 'type', 0.12); s('C04', 0.4, 'ding', 0.2); s('C05', 0.05, 'type', 0.12); s('C05', 0.5, 'ding_hi', 0.22); s('B04', 0.1, 'sparkle', 0.2);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.45, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
