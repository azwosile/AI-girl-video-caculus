// 第 10 章 P12《圆锥曲线》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.5。
// A470 生活中的椭圆 + 平面切圆锥 · A471 抛物线焦点–准线等距（动点 + 距离条） · A472 椭圆距离和 / 双曲线距离差与渐近线
const SC = {};
const TITLES = [['cone', '切圆锥'], ['para', '抛物线'], ['ell', '椭圆'], ['hyp', '双曲线'], ['quiz', '随堂一题'], ['outro', '小结']];
const d12 = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);

// ======================= 切圆锥（A470） =======================
SC.cone = t => {
  starfield(t); blueprint(0.3, 80);
  const ga = ap(t, 'M01', 0) * fadeOut(t, S('C01') - 0.05, 0.4);
  if (ga > 0) {
    const k1 = ap(t, 'M01', 0.15) * ga; orbit(680, 470, 110, 0.5, t * 1.2, SQ.M.col, k1); label('行星轨道', 640, 640, 26, CR, k1, { bold: true });
    const k2 = ap(t, 'M01', 0.4) * ga; ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(960, 470, 100, 34 + 30 * (0.5 + 0.5 * Math.sin(t * 1.5)), 0, 0, TAU); ctx.stroke(); ctx.restore(); label('斜着看的圆盘', 960, 640, 26, CR, k2, { bold: true });
    const k3 = ap(t, 'M01', 0.7) * ga; ctx.save(); ctx.globalAlpha *= k3; const g = ctx.createLinearGradient(1180, 360, 1260, 520); g.addColorStop(0, hexA(GOLD, 0.6)); g.addColorStop(1, hexA(GOLD, 0.05)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(1180, 360); ctx.lineTo(1190, 360); ctx.lineTo(1320, 520); ctx.lineTo(1180, 520); ctx.closePath(); ctx.fill();
    ctx.fillStyle = hexA(GOLD, 0.45); ctx.beginPath(); ctx.ellipse(1250, 525, 72, 22, 0, 0, TAU); ctx.fill(); ctx.restore(); label('手电筒光斑', 1250, 640, 26, CR, k3, { bold: true });
  }
  if (t > S('C01') - 0.05) [['circle', '圆'], ['ellipse', '椭圆'], ['parabola', '抛物线'], ['hyperbola', '双曲线']].forEach(([k, n], i) => coneSlice(640 + i * 220, 470, 0.9, k, ap(t, 'C01', 0.15 + 0.15 * i), { name: n, col: [CYAN, GOLD, GRN, RED][i] }));
};

// ======================= 抛物线（A471） =======================
const GP12 = { cx: 880, cy: 640, ux: 38, uy: 38, x0: -8, x1: 8, y0: -3, y1: 7 };
SC.para = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C02', 0); gAxes(GP12, a * 0.6, { grid: false });
  paramTrace(GP12, s => s, s => s * s / 8, -7, 7, GRN, { a, p: prog(t, P('C02', 0.05), 1.2), w: 4 });
  const F = [gx(GP12, 0), gy(GP12, 2)], yD = gy(GP12, -2); seg(gx(GP12, -8), yD, gx(GP12, 8), yD, CYAN, a, 3, [10, 7]);
  glowDot(F[0], F[1], 9, GOLD, a); label('F', F[0] + 22, F[1] - 10, 24, GOLD, a, { bold: true }); label('准线', gx(GP12, 7.2), yD + 28, 22, CYAN, a, { bold: true });
  const s = 5 * Math.sin((t - S('C02')) * 0.8), X = gx(GP12, s), Y = gy(GP12, s * s / 8), k = ap(t, 'C02', 0.4);
  seg(X, Y, F[0], F[1], GOLD, k, 3); seg(X, Y, X, yD, CYAN, k, 3); glowDot(X, Y, 9, GRN, k);
  const d1 = d12(X, Y, F[0], F[1]), d2 = yD - Y; distBars(1250, 300, d1 * 0.6, d2 * 0.6, GOLD, CYAN, '到焦点', '到准线', k);
  if (t > S('G01')) { richReveal([['y = x²/8 ⇒ x² = 8y ⇒ ', CR], ['焦点 (0, 2)', GOLD], ['，准线 y = −2', CYAN]], 980, 220, 30, t, P('G01', 0.1), { upright: true }); }
  else richReveal([['x² = 4py：焦点 (0, p)，准线 y = −p', CR]], 980, 220, 30, t, P('C02', 0.3), { upright: true });
};

// ======================= 椭圆（A472a） =======================
const GE12 = { cx: 880, cy: 570, ux: 55, uy: 55, x0: -5.5, x1: 5.5, y0: -4, y1: 4 };
SC.ell = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C03', 0), c = Math.sqrt(7); gAxes(GE12, a * 0.55, { grid: false });
  paramTrace(GE12, s => 4 * Math.cos(s), s => 3 * Math.sin(s), 0, TAU, GOLD, { a, p: prog(t, P('C03', 0.05), 1.4), w: 4 });
  const F1 = [gx(GE12, -c), gy(GE12, 0)], F2 = [gx(GE12, c), gy(GE12, 0)]; [F1, F2].forEach(F => glowDot(F[0], F[1], 9, RED, a));
  const s = 0.6 + (t - S('C03')) * 0.7, X = gx(GE12, 4 * Math.cos(s)), Y = gy(GE12, 3 * Math.sin(s)), k = ap(t, 'C03', 0.3);
  seg(X, Y, F1[0], F1[1], CYAN, k, 3); seg(X, Y, F2[0], F2[1], GRN, k, 3); glowDot(X, Y, 9, GOLD, k);
  const d1 = d12(X, Y, ...F1) / 55, d2 = d12(X, Y, ...F2) / 55; distBars(1240, 300, d1 * 22, d2 * 22, CYAN, GRN, d1.toFixed(2), d2.toFixed(2), k);
  label(`和 = ${(d1 + d2).toFixed(2)} = 2a`, 1330, 410, 26, GOLD, k, { bold: true });
  richReveal([['c² = a² − b²', GOLD]], 980, 220, 34, t, P('C03', 0.6), { upright: true, alpha: t > S('C04') ? 0 : 1 });
  if (t > S('C04')) { richReveal([['9x² + 16y² = 144 ⇒ a = 4，b = 3，', CR], ['c = √7', RED]], 980, 220, 30, t, P('C04', 0.1), { upright: true });
    label('(−√7, 0)', F1[0], F1[1] + 34, 22, RED, ap(t, 'C04', 0.6), { bold: true }); label('(√7, 0)', F2[0], F2[1] + 34, 22, RED, ap(t, 'C04', 0.6), { bold: true }); }
};

// ======================= 双曲线（A472b） =======================
const GH12 = { cx: 880, cy: 570, ux: 44, uy: 44, x0: -7.5, x1: 7.5, y0: -5, y1: 5 };
SC.hyp = t => {
  starfield(t); blueprint(0.34, 80);
  const box = t > S('C07') - 0.05, a = ap(t, 'C05', 0) * (box ? 0.35 : 1); gAxes(GH12, a * 0.55, { grid: false });
  const pp = prog(t, P('C05', 0.05), 1.4);
  [1, -1].forEach(sg => paramTrace(GH12, u => sg * 4 * Math.cosh(u), u => 3 * Math.sinh(u), -1.25, 1.25, SQ.M.col, { a, p: pp, w: 4 }));
  const F1 = [gx(GH12, -5), gy(GH12, 0)], F2 = [gx(GH12, 5), gy(GH12, 0)]; [F1, F2].forEach(F => glowDot(F[0], F[1], 9, RED, a));
  const u = 0.9 * Math.sin((t - S('C05')) * 0.7), X = gx(GH12, 4 * Math.cosh(u)), Y = gy(GH12, 3 * Math.sinh(u)), k = ap(t, 'C05', 0.3) * (box ? 0.35 : 1);
  seg(X, Y, F1[0], F1[1], CYAN, k, 3); seg(X, Y, F2[0], F2[1], GRN, k, 3); glowDot(X, Y, 9, GOLD, k);
  const d1 = d12(X, Y, ...F1) / 44, d2 = d12(X, Y, ...F2) / 44; label(`|${d1.toFixed(2)} − ${d2.toFixed(2)}| = ${Math.abs(d1 - d2).toFixed(2)}`, 1270, 320, 26, GOLD, k, { bold: true });
  if (t > S('C06')) { const z = ap(t, 'C06', 0.3) * (box ? 0.35 : 1); [1, -1].forEach(sg => seg(gx(GH12, -7), gy(GH12, -sg * 5.25), gx(GH12, 7), gy(GH12, sg * 5.25), CR, z, 2, [8, 6]));
    label('y = ±¾x', gx(GH12, 6.2), gy(GH12, 5.2), 24, CR, z, { bold: true }); label('(±5, 0)', F2[0], F2[1] + 34, 22, RED, z, { bold: true }); }
  richReveal([['c² = a² + b²', SQ.M.col]], 980, 220, 34, t, P('C05', 0.6), { upright: true, alpha: box ? 0 : 1 });
  if (box) { const z = ap(t, 'C07', 0); panel(600, 330, 340, 130, GOLD, z); panel(1000, 330, 340, 130, SQ.M.col, z);
    label('椭圆', 770, 375, 28, GOLD, z, { bold: true }); label('双曲线', 1170, 375, 28, SQ.M.col, z, { bold: true });
    mathText('c^{2} = a^{2} − b^{2}', 770, 430, 30, GOLD, { align: 'center', alpha: z }); mathText('c^{2} = a^{2} + b^{2}', 1170, 430, 30, SQ.M.col, { align: 'center', alpha: z });
    if (t > S('M02')) stampMark(1360, 600, 44, t, P('M02', 0.3), { text: '一减一加', col: SQ.M.col, rot: -0.12 }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['x²/25 + y²/9 = 1：', CR], ['焦点？', GOLD]], 880, 240, 36, t, P('C09', 0.05), { upright: true });
  const G = { cx: 880, cy: 580, ux: 48, uy: 48, x0: -6, x1: 6, y0: -4, y1: 4 }, a = ap(t, 'C09', 0.2); gAxes(G, a * 0.5, { grid: false });
  paramTrace(G, s => 5 * Math.cos(s), s => 3 * Math.sin(s), 0, TAU, GOLD, { a, w: 4 });
  if (t > S('D01')) { const k = ap(t, 'D01', 0.3); [-4, 4].forEach(x => { glowDot(gx(G, x), gy(G, 0), 10, RED, k); label(`(${x > 0 ? '' : '−'}4, 0)`, gx(G, x), gy(G, 0) + 34, 24, RED, k, { bold: true }); });
    richReveal([['c² = 25 − 9 = 16', CR]], 880, 820, 30, t, P('D01', 0.2), { upright: true }); checkMark(1300, 520, 22, GRN, t, P('D01', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) {
    const G1 = { cx: 650, cy: 470, ux: 14, uy: 14 }, G2 = { cx: 980, cy: 420, ux: 22, uy: 22 }, G3 = { cx: 1310, cy: 420, ux: 16, uy: 16 };
    const k1 = ap(t, 'C10', 0.05) * ga, k2 = ap(t, 'C10', 0.35) * ga, k3 = ap(t, 'C10', 0.65) * ga;
    paramTrace(G1, s => s, s => s * s / 8, -7, 7, GRN, { a: k1, w: 4 }); label('抛物线：焦点 = 准线', 650, 540, 24, GRN, k1, { bold: true });
    paramTrace(G2, s => 4 * Math.cos(s), s => 3 * Math.sin(s), 0, TAU, GOLD, { a: k2, w: 4 }); label('椭圆：距离和', 980, 540, 24, GOLD, k2, { bold: true });
    [1, -1].forEach(sg => paramTrace(G3, u => sg * 4 * Math.cosh(u), u => 3 * Math.sinh(u), -1.2, 1.2, SQ.M.col, { a: k3, w: 4 })); label('双曲线：距离差', 1310, 540, 24, SQ.M.col, k3, { bold: true });
  }
  if (t > S('C11') - 0.1) { glowText('下一段：曲率与曲率半径', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('GLM 整理公式表', CX, 610, 32, SQ.Z.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 10 章 · P12 圆锥曲线', '下一段：曲率', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM10('Gemini')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.05, 'type', 0.16); s('M01', 0.15, 'pop', 0.16); s('M01', 0.4, 'pop', 0.16); s('M01', 0.7, 'pop', 0.16); [0.15, 0.3, 0.45, 0.6].forEach(f => s('C01', f, 'whoosh', 0.12));
  s('C02', 0.05, 'swell', 0.14); s('C02', 0.4, 'pluck', 0.16); s('G01', 0.1, 'ding', 0.2);
  s('C03', 0.05, 'swell', 0.14); s('C03', 0.3, 'pluck', 0.16); s('C04', 0.1, 'pop', 0.16); s('C04', 0.6, 'ding', 0.2);
  s('C05', 0.05, 'swell', 0.14); s('C06', 0.3, 'whoosh', 0.14); s('C06', 0.5, 'ding', 0.18); s('C07', 0.05, 'sting', 0.18); s('M02', 0.3, 'stamp', 0.22); s('M02', 0.4, 'sparkle', 0.16);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.3, 'ding_hi', 0.2); s('D01', 0.6, 'check', 0.24);
  s('C10', 0.05, 'pop', 0.18); s('C10', 0.35, 'pop', 0.18); s('C10', 0.65, 'pop', 0.18); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
