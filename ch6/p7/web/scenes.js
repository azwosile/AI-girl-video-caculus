// 第 6 章 P7《柱壳法》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.3 例 1。
// A266 横切卡在三次方程 · A267 一层壳剥下来压平成薄板 · A268 壳层逐层叠成立体
const SC = {};
const TITLES = [['hard', '横切卡住'], ['shell', '年轮'], ['calc', '算出来'], ['quiz', '随堂一题'], ['outro', '小结']];
const F7 = x => 2 * x * x - x * x * x, XM = 4 / 3;
function bis(y, lo, hi, inc) { for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if ((F7(m) < y) === inc) lo = m; else hi = m; } return (lo + hi) / 2; }
const XLy = y => bis(y, 0, XM, true), XRy = y => bis(y, XM, 2, false);
const G = { cx: 960, cy: 740, ux: 165, uy: 230, x0: -2.3, x1: 2.4, y0: -0.2, y1: 1.5 };
const OY = { axis: 'y', at: 0, e: 0.3 };
function solidSil(a, col) { // 旋转体：剖面（左右镜像）+ 若干水平圆环
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  [1, -1].forEach(s => { ctx.beginPath(); for (let i = 0; i <= 80; i++) { const x = 2 * i / 80; ctx[i ? 'lineTo' : 'moveTo'](gx(G, s * x), gy(G, F7(x))); } ctx.closePath(); ctx.fillStyle = hexA(col, 0.22); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke(); });
  ctx.restore();
  [0.25, 0.55, 0.85, 1.1].forEach(y => { rvRing(G, OY, y, XRy(y), hexA(col, 0.7), 1.5); rvRing(G, OY, y, XLy(y), hexA(col, 0.45), 1.2, 0, 2 * Math.PI, [5, 4]); });
  rvRing(G, OY, 0, 2, hexA(col, 0.7), 1.8);
}
function axisY(a) { seg(G.cx, gy(G, -0.15), G.cx, gy(G, 1.45), CR, a * 0.8, 2); mathText('y', G.cx + 12, gy(G, 1.45), 26, CR, { alpha: a }); seg(gx(G, -2.2), G.cy, gx(G, 2.3), G.cy, CR, a * 0.5, 1.5); }

// ======================= 横切卡住（A266） =======================
SC.hard = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C01', 0), r = ap(t, 'C01', 0.5);
  axisY(a);
  gArea(G, F7, 0, 2, a * (1 - 0.5 * r), { pos: 'rgba(88,214,168,0.32)' }); gPlot(G, F7, GOLD, { a, xa: 0, xb: 2.08 });
  label('y = 2x² − x³', gx(G, 1.9) + 40, gy(G, 1.15), 26, GOLD, a, { bold: true, font: F_MATH });
  solidSil(r * 0.8, SQ.L.col);
  if (t > S('C02')) {
    const c = ap(t, 'C02', 0.15), y = 0.75; seg(gx(G, -2.2), gy(G, y), gx(G, 2.3), gy(G, y), RED, c, 2, [10, 7]);
    glowDot(gx(G, XLy(y)), gy(G, y), 8, RED, c); glowDot(gx(G, XRy(y)), gy(G, y), 8, RED, c);
    label('x内 = ？', gx(G, XLy(y)) - 20, gy(G, y) - 34, 24, RED, c, { bold: true }); label('x外 = ？', gx(G, XRy(y)) + 30, gy(G, y) - 34, 24, RED, c, { bold: true });
    richReveal([['2x² − x³ = y  ⇒  x = ', CR], ['？', RED]], CX, 260, 42, t, P('C02', 0.45), { upright: true });
  }
  if (t > S('D01')) { label('三次方程！', CX, 340, 38, SQ.D.col, ap(t, 'D01', 0.1), { bold: true }); }
};

// ======================= 年轮（A267） =======================
function treeRings(t, cx, cy, a) {
  if (a <= 0) return; const n = Math.floor(clamp(prog(t, P('L01', 0.1), D('L01') * 0.8)) * 7);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(cx, cy, 120, 0, 7); ctx.fillStyle = 'rgba(150,100,50,0.35)'; ctx.fill();
  for (let k = 1; k <= n; k++) { ctx.beginPath(); ctx.arc(cx, cy, 120 * k / 7, 0, 7); ctx.strokeStyle = k === n ? '#FFD38A' : '#C08A50'; ctx.lineWidth = k === n ? 4 : 2.5; ctx.stroke(); }
  ctx.restore();
}
SC.shell = t => {
  starfield(t); blueprint(0.35, 80);
  const a = 1, xs = 1.15, dx = 0.12;
  axisY(a); gPlot(G, F7, GOLD, { a: 0.8, xa: 0, xb: 2.05 });
  solidSil(0.35, SQ.L.col);
  treeRings(t, 1250, 430, ap(t, 'L01', 0) * fadeOut(t, S('C03')));
  if (t > S('C03')) {
    const c = ap(t, 'C03', 0.15), u = t > S('L02') ? eIO(prog(t, P('L02', 0.2), 1.4)) : 0;
    revShell(G, OY, xs, dx, 0, F7(xs), GOLD, c * (1 - u * 0.6));
    if (u < 0.5) { seg(G.cx, G.cy - 8, gx(G, xs), G.cy - 8, '#ffffff', c, 2.5); mathText('x', gx(G, xs / 2), G.cy - 18, 26, '#ffffff', { align: 'center', alpha: c }); mathText('f(x)', gx(G, xs) + 18, gy(G, F7(xs) / 2), 26, GOLD, { alpha: c }); mathText('dx', gx(G, xs + dx / 2), G.cy + 30, 24, GOLD, { align: 'center', alpha: c }); }
    if (u > 0) {
      revShell(G, { ...OY, ux0: 1130, uscale: 0.42 }, xs, dx, 0, F7(xs), GOLD, u, Math.max(0.01, u));
      const w = 2 * Math.PI * xs * G.ux * 0.42; label('2πx', 1130, G.cy + 34, 28, GOLD, u, { bold: true, font: F_MATH }); label('f(x)', 1130 - w / 2 - 50, gy(G, F7(xs) / 2), 26, GOLD, u, { bold: true, font: F_MATH });
    }
  }
  if (t > S('C04')) richReveal([['V = ', CR], ['∫', GOLD], ['ₐᵇ ', CR], ['2πx', GOLD], [' · ', CR], ['f(x)', GOLD], [' dx', CR]], CX, 250, 46, t, P('C04', 0.4), { upright: true });
  else if (t > S('L02')) richReveal([['薄板 = 长 2πx × 高 f(x) × 厚 dx', CR]], CX, 250, 36, t, P('L02', 0.4), { upright: true });
};

// ======================= 算出来（A268） =======================
SC.calc = t => {
  starfield(t); blueprint(0.35, 80);
  axisY(1);
  const p = eIO(prog(t, P('G01', 0.05), D('G01') * 0.9)), n = 9;
  for (let k = n - 1; k >= 0; k--) { const q = clamp(p * n - (n - 1 - k)); const x = 2 * (k + 0.5) / n; if (q > 0) revShell(G, OY, x, 2 / n * 0.85, 0, F7(x), k % 2 ? GOLD : SQ.L.col, q * 0.85); }
  gPlot(G, F7, GOLD, { a: 0.8, xa: 0, xb: 2.05 });
  richReveal([['V = ', CR], ['∫', GOLD], ['₀² 2πx(2x² − x³) dx', CR]], CX, 250, 38, t, P('G01', 0.1), { upright: true });
  if (t > S('C05')) { richReveal([['= 2π(8 − 32/5) = ', CR], ['16π/5', GOLD]], CX, 320, 40, t, P('C05', 0.1), { upright: true }); checkMark(1300, 320, 20, GRN, t, P('C05', 0.6)); label('不用解方程', 1300, 380, 26, GRN, ap(t, 'C05', 0.6), { bold: true }); }
};

// ======================= 随堂 =======================
const GQ = { cx: 760, cy: 760, ux: 220, uy: 220, x0: -1.25, x1: 1.3, y0: -0.1, y1: 1.25 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['y = x 下方，0 ≤ x ≤ 1，绕 y 轴：柱壳积分？', CR]], 800, 300, 34, t, P('C07', 0.05), { upright: true });
  const ga = ap(t, 'C07', 0.3); gAxes(GQ, ga * 0.7, { grid: false });
  gArea(GQ, x => x, 0, 1, ga, { pos: 'rgba(88,214,168,0.30)' }); gPlot(GQ, x => x, GOLD, { a: ga, xa: 0, xb: 1.1 });
  if (t > S('D02')) { revShell(GQ, OY, 0.6, 0.08, 0, 0.6, GOLD, ap(t, 'D02', 0.1)); richReveal([['∫', GOLD], ['₀¹ 2πx · x dx = ', CR], ['2π/3', GOLD]], 1060, 470, 40, t, P('D02', 0.4), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { axisY(ga); revShell(G, OY, 1.15, 0.12, 0, F7(1.15), GOLD, ga); revShell(G, { ...OY, ux0: 1150, uscale: 0.42 }, 1.15, 0.12, 0, F7(1.15), GOLD, ga, 1); richReveal([['壳 = 周长 2πx × 高 × 厚', GOLD]], CX, 250, 42, t, P('C08', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：微元法 · 怎么选', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('GLM 捧书总结', CX, 590, 32, SQ.Z.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 6 章 · P7 柱壳法', '下一段：微元法', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM6('Llama')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.5, 'warp', 0.18); s('C02', 0.15, 'zap', 0.14); s('C02', 0.45, 'buzz', 0.16); s('D01', 0.1, 'glitch', 0.18);
  s('L01', 0.1, 'marimba', 0.16); s('C03', 0.15, 'pop', 0.16); s('L02', 0.2, 'whoosh', 0.18); s('C04', 0.4, 'ding_hi', 0.24);
  s('G01', 0.05, 'riser', 0.18); s('G01', 0.1, 'type', 0.14); s('C05', 0.1, 'type', 0.14); s('C05', 0.6, 'check', 0.24); s('L03', 0.2, 'pluck', 0.14);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'pop', 0.16); s('D02', 0.4, 'ding_hi', 0.28);
  s('C08', 0.15, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
