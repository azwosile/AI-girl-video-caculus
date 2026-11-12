// 第 6 章 P9《弧长》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 6.2 / Stewart 8.1。
// A272 折线逼近曲线（n 逐步加倍）· A273 弧长微元三角形 ds² = dx² + dy² · A274 圆周长参数积分
const SC = {};
const TITLES = [['poly', '折线逼近'], ['ds', '弧长微元'], ['ex', '算一条'], ['param', '参数式'], ['quiz', '随堂一题'], ['outro', '小结']];
const G = { cx: 640, cy: 780, ux: 165, uy: 55, x0: -0.1, x1: 4.3, y0: -0.2, y1: 8.8 };
const F9 = x => Math.pow(Math.max(0, x), 1.5);
const NS = [[1, '8.944'], [2, '9.009'], [4, '9.045'], [8, '9.063']];
function poly(n, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath();
  for (let i = 0; i <= n; i++) { const x = 4 * i / n; ctx[i ? 'lineTo' : 'moveTo'](gx(G, x), gy(G, F9(x))); }
  ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.stroke(); ctx.restore();
  for (let i = 0; i <= n; i++) { const x = 4 * i / n; glowDot(gx(G, x), gy(G, F9(x)), 6, col, a); }
}
function axes9(a) { gAxes(G, a * 0.8, { grid: false, xl: 'x' }); mathText('4', gx(G, 4), gy(G, 0) + 32, 24, CR, { align: 'center', alpha: a }); }

// ======================= 折线逼近（A272） =======================
SC.poly = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'R01', 0); axes9(a);
  gPlot(G, F9, GOLD, { a: a * 0.9, xa: 0, xb: 4.15, w: 5 });
  label('马道', gx(G, 3.6) + 60, gy(G, F9(3.6)), 28, GOLD, a, { bold: true });
  let k = 0;
  if (t > S('G01')) k = Math.min(3, Math.floor((t - S('G01')) / Math.max(0.8, D('G01') / 4)));
  const pa = ap(t, 'R01', 0.45);
  if (t < S('G01')) poly(2, SQ.R.col, pa); else poly(NS[k][0], SQ.R.col, 1);
  if (t > S('C01') && t < S('G01') + 0.3) { // 一小段的勾股三角形
    const c = ap(t, 'C01', 0.15), x0 = 2, x1 = 4, X0 = gx(G, x0), X1 = gx(G, x1), Y0 = gy(G, F9(x0)), Y1 = gy(G, F9(x1));
    seg(X0, Y0, X1, Y0, CYAN, c, 2.5); seg(X1, Y0, X1, Y1, GRN, c, 2.5);
    mathText('Δx', (X0 + X1) / 2, Y0 + 32, 26, CYAN, { align: 'center', alpha: c }); mathText('Δy', X1 + 16, (Y0 + Y1) / 2, 26, GRN, { alpha: c });
    richReveal([['一段 = √(', CR], ['Δx²', CYAN], [' + ', CR], ['Δy²', GRN], [')', CR]], CX, 250, 40, t, P('C01', 0.4), { upright: true });
  }
  if (t > S('G01')) {
    const ta = ap(t, 'G01', 0.05); panel(690, 300, 280, 250, SQ.R.col, ta);
    NS.forEach(([n, v], i) => { const on = i <= k; mathText(`n = ${n}`, 715, 350 + i * 50, 26, on ? SQ.R.col : CR, { alpha: ta * (on ? 1 : 0.4), upright: true }); mathText(v, 945, 350 + i * 50, 26, on ? GOLD : CR, { align: 'right', alpha: ta * (on ? 1 : 0.4), upright: true }); });
    richReveal([['y = x^{3/2}，0 ≤ x ≤ 4', CR]], CX, 250, 36, t, P('G01', 0.05), { upright: true });
  }
  if (t > S('R02')) label('→ 真实长度', 830, 540, 26, GRN, ap(t, 'R02', 0.2), { bold: true });
};

// ======================= 弧长微元（A273） =======================
SC.ds = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C02', 0), A = [680, 720], B = [1120, 720], C = [1120, 400];
  seg(...A, ...B, CYAN, a, 3); seg(...B, ...C, GRN, a, 3);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.moveTo(...A); ctx.quadraticCurveTo(960, 640, ...C); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
  seg(...A, ...C, SQ.R.col, ap(t, 'C02', 0.3), 2, [8, 6]);
  mathText('dx', 900, 760, 32, CYAN, { align: 'center', alpha: a }); mathText('dy', 1140, 570, 32, GRN, { alpha: a }); mathText('ds', 860, 545, 34, GOLD, { align: 'center', alpha: a });
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CR; ctx.lineWidth = 2; ctx.strokeRect(1096, 696, 24, 24); ctx.restore();
  richReveal([['ds² = ', GOLD], ['dx²', CYAN], [' + ', CR], ['dy²', GRN]], CX, 250, 44, t, P('C02', 0.45), { upright: true, alpha: fadeOut(t, S('C03') + 0.2) });
  if (t > S('C03')) {
    richReveal([['ds = √(1 + f′(x)²) dx', GOLD]], CX, 250, 40, t, P('C03', 0.1), { upright: true });
    const c = ap(t, 'C03', 0.5); panel(640, 300, 680, 84, GOLD, c);
    richReveal([['L = ', CR], ['∫', GOLD], ['ₐᵇ √(1 + f′(x)²) dx', CR]], CX, 356, 42, t, P('C03', 0.55), { upright: true });
  }
};

// ======================= 算一条 =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  axes9(1); gPlot(G, F9, GOLD, { a: 1, xa: 0, xb: 4.15, w: 5 }); poly(8, SQ.R.col, 0.45);
  richReveal([['y′ = (3/2)√x，1 + y′² = 1 + 9x/4', CR]], CX, 250, 36, t, P('G02', 0.1), { upright: true, alpha: fadeOut(t, S('C04')) });
  if (t > S('C04')) {
    richReveal([['L = ', CR], ['∫', GOLD], ['₀⁴ √(1 + 9x/4) dx = (8/27)(10√10 − 1)', CR]], CX, 250, 34, t, P('C04', 0.1), { upright: true });
    const c = ap(t, 'C04', 0.6); panel(690, 320, 280, 80, GOLD, c); label('≈ 9.073', 830, 360, 38, GOLD, c, { bold: true });
  }
  if (t > S('R03')) { label('折线 n = 8：9.063', 830, 450, 28, SQ.R.col, ap(t, 'R03', 0.1), { bold: true }); checkMark(1000, 450, 18, GRN, t, P('R03', 0.4)); }
};

// ======================= 参数式（A274） =======================
SC.param = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0), cx = 860, cy = 580, R = 170;
  richReveal([['L = ', CR], ['∫', GOLD], [' √(x′(t)² + y′(t)²) dt', CR]], CX, 250, 40, t, P('C05', 0.15), { upright: true });
  seg(cx - R - 40, cy, cx + R + 40, cy, CR, a * 0.5, 1.5); seg(cx, cy + R + 30, cx, cy - R - 30, CR, a * 0.5, 1.5);
  const u = t > S('G03') ? eIO(prog(t, P('G03', 0.3), D('G03') * 0.6)) : 0, th = u * 2 * Math.PI;
  ctx.save(); ctx.globalAlpha *= a * 0.35; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.strokeStyle = CR; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  if (th > 0.01) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, -th, true); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore(); }
  if (t > S('G03')) {
    const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th), c = ap(t, 'G03', 0.1);
    seg(cx, cy, px, py, CR, c, 2); glowDot(px, py, 9, GOLD, c); mathText('r', (cx + px) / 2 + 8, (cy + py) / 2 - 8, 26, CR, { alpha: c });
    const vx = -Math.sin(th) * 90, vy = -Math.cos(th) * 90; arrow(px, py, px + vx, py + vy, CYAN, c, 3); mathText('速率 = r', px + vx + 10, py + vy, 22, CYAN, { alpha: c, upright: true });
    richReveal([['√(r²sin²t + r²cos²t) = r  ⇒  ', CR], ['∫', GOLD], ['₀^{2π} r dt = ', CR], ['2πr', GOLD]], CX, 320, 32, t, P('G03', 0.4), { upright: true });
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 700, cy: 780, ux: 100, uy: 55, x0: -0.2, x1: 3.5, y0: -0.2, y1: 7.6 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['y = 2x + 1，0 ≤ x ≤ 3：L = ？', CR]], 800, 300, 40, t, P('C07', 0.05), { upright: true });
  const ga = ap(t, 'C07', 0.3); gAxes(GQ, ga * 0.7, { grid: false }); gPlot(GQ, x => 2 * x + 1, GOLD, { a: ga, xa: 0, xb: 3 });
  if (t > S('D01')) { richReveal([['∫', GOLD], ['₀³ √(1 + 2²) dx', CYAN]], 1060, 470, 36, t, P('D01', 0.15), { upright: true }); richReveal([['= ', CR], ['3√5', GOLD]], 1060, 570, 52, t, P('D01', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { axes9(ga * 0.6); gPlot(G, F9, GOLD, { a: ga, xa: 0, xb: 4.15, w: 5 }); poly(8, SQ.R.col, ga * 0.5); richReveal([['ds = √(1 + y′²) dx  ← 勾股定理', GOLD]], CX, 250, 40, t, P('C08', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：侧面积 + 加百列号角', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('豆包：表面积肯定也有限吧？', CX, 590, 32, SQ.B.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 6 章 · P9 弧长', '下一段：侧面积与加百列号角', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM6('Mistral')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('R01', 0.05, 'sting', 0.16); s('R01', 0.45, 'pop', 0.16); s('C01', 0.15, 'pluck', 0.14); s('C01', 0.4, 'type', 0.14);
  for (let k = 0; k < 4; k++) sfx(S('G01') + k * Math.max(0.8, D('G01') / 4), 'tick', 0.18); s('R02', 0.2, 'ding', 0.2);
  s('C02', 0.05, 'pop', 0.16); s('C02', 0.45, 'type', 0.14); s('C03', 0.1, 'type', 0.14); s('C03', 0.55, 'ding_hi', 0.24);
  s('G02', 0.1, 'type', 0.14); s('C04', 0.1, 'type', 0.14); s('C04', 0.6, 'ding_hi', 0.24); s('R03', 0.4, 'check', 0.24);
  s('C05', 0.15, 'pop', 0.16); s('G03', 0.3, 'whoosh', 0.18); s('G03', 0.4, 'type', 0.14);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.15, 'type', 0.14); s('D01', 0.55, 'ding_hi', 0.28);
  s('C08', 0.15, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
