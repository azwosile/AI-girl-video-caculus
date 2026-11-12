// 第 6 章 P10《旋转体侧面积与加百列号角》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 6.2 / Stewart 8.2。
// A275 一圈带子展开（周长 × 斜高）· A276 号角无限延伸：体积数字收敛、面积数字发散 · A277 油漆悖论
const SC = {};
const TITLES = [['band', '一圈带子'], ['sphere', '验算球面'], ['horn', '加百列号角'], ['quiz', '随堂一题'], ['outro', '小结']];
const OX = { axis: 'x', at: 0, e: 0.3 };
function band(G, o, xa, xb, col, a) { // 旋转带（正面半圈）
  if (a <= 0) return; const n = 32; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath();
  for (let i = 0; i <= n; i++) ctx[i ? 'lineTo' : 'moveTo'](...rvPt(G, o, xa, o.R(xa), Math.PI * i / n));
  for (let i = n; i >= 0; i--) ctx.lineTo(...rvPt(G, o, xb, o.R(xb), Math.PI * i / n));
  ctx.closePath(); ctx.fillStyle = hexA(col, 0.6); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
  rvRing(G, o, xa, o.R(xa), col, 2); rvRing(G, o, xb, o.R(xb), col, 2);
}

// ======================= 一圈带子（A275） =======================
const GB = { cx: 640, cy: 620, ux: 160, uy: 120, x0: -0.1, x1: 4.3, y0: -2, y1: 2 };
const FB = x => 0.7 + 0.12 * x + 0.35 * Math.sin(1.1 * x), OB = { ...OX, R: FB }, XA = 2.0, XB = 2.45;
SC.band = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C01', 0);
  revSolid(GB, { ...OB, t0: 0.2, t1: 4, col: CYAN, a: a * 0.45, Rmax: 1.6, rings: 6 });
  gPlot(GB, FB, GOLD, { a, xa: 0.2, xb: 4, w: 3 });
  band(GB, OB, XA, XB, GOLD, ap(t, 'C01', 0.35));
  if (t > S('C02')) {
    const c = ap(t, 'C02', 0.2), w = 2 * Math.PI * FB(2.2) * GB.uy * 0.42, h = 46, x0 = 1050 - w / 2, y0 = 320;
    ctx.save(); ctx.globalAlpha *= c; ctx.fillStyle = hexA(GOLD, 0.5); ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; ctx.shadowColor = GOLD; ctx.shadowBlur = 12; ctx.strokeRect(x0, y0, w, h); ctx.restore();
    label('长 = 2πf(x)', 1050, y0 - 26, 26, GOLD, c, { bold: true, font: F_MATH }); label('宽 = ds', x0 + w + 64, y0 + h / 2, 26, GOLD, c, { bold: true, font: F_MATH });
  }
  if (t > S('C03')) richReveal([['S = ', CR], ['∫', GOLD], ['ₐᵇ 2πf(x) · ', CR], ['√(1 + f′(x)²)', GOLD], [' dx', CR]], CX, 250, 38, t, P('C03', 0.2), { upright: true });
  if (t > S('G01')) {
    const c = ap(t, 'G01', 0.1), P1 = [gx(GB, XA), gy(GB, FB(XA))], P2 = [gx(GB, XB), gy(GB, FB(XB))];
    seg(...P1, ...P2, GRN, c, 4); seg(P1[0], P1[1], P2[0], P1[1], RED, c, 3, [6, 4]);
    mathText('ds ✓', P2[0] + 14, P2[1] - 22, 24, GRN, { alpha: c, upright: true }); mathText('dx ✗', (P1[0] + P2[0]) / 2 - 20, P1[1] + 30, 24, RED, { alpha: c, upright: true });
  }
};

// ======================= 验算球面 =======================
const RS = 1.6, GS = { cx: 820, cy: 580, ux: 120, uy: 120 }, OS = { ...OX, R: x => Math.sqrt(Math.max(0, RS * RS - x * x)) };
SC.sphere = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C04', 0);
  revSolid(GS, { ...OS, t0: -RS + 0.001, t1: RS - 0.001, col: CYAN, a: a * 0.6, Rmax: RS, rings: 6 });
  const u = prog(t, P('C04', 0.2), D('C04') + D('C05') * 0.6), x = RS * 0.75 * Math.sin(u * 2 * Math.PI);
  band(GS, OS, x - 0.09, x + 0.09, GOLD, ap(t, 'C04', 0.2));
  richReveal([['f · √(1 + f′²) = √(r² − x²) · r/√(r² − x²) = ', CR], ['r', GOLD]], CX, 250, 30, t, P('C04', 0.4), { upright: true, alpha: fadeOut(t, S('C05')) });
  if (t > S('C05')) {
    richReveal([['S = ', CR], ['∫', GOLD], ['₋ᵣʳ 2πr dx = ', CR], ['4πr²', GOLD]], CX, 250, 42, t, P('C05', 0.15), { upright: true });
    label('每条等宽的带子面积都一样！', 1180, 400, 26, GRN, ap(t, 'C05', 0.6), { bold: true });
  }
};

// ======================= 加百列号角（A276、A277） =======================
const GH = { cx: 560, cy: 560, ux: 88, uy: 190, x0: 0, x1: 10, y0: -1.3, y1: 1.3 }, OH = { ...OX, R: x => 1 / x, e: 0.28 };
SC.horn = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C06', 0), bp = eIO(prog(t, P('C06', 0.3), D('C06') + D('G02'))), b = 1 + 8.9 * bp;
  if (b > 1.05) revSolid(GH, { ...OH, t0: 1, t1: b, col: GOLD, a, Rmax: 1, rings: Math.max(2, Math.round(b)) });
  seg(gx(GH, 0.6), GH.cy, gx(GH, 10.3), GH.cy, CR, a * 0.5, 1.5, [6, 6]);
  if (bp > 0.95) { arrowH(gx(GH, 9.9), gx(GH, 10.5), GH.cy, GOLD, a); label('∞', gx(GH, 10.4), GH.cy - 40, 34, GOLD, a, { bold: true }); }
  // 两个读数
  const B = t > S('G02') ? lerp(1, 1e6, Math.pow(clamp(prog(t, S('G02'), E('C07') - S('G02'))), 3)) : b;
  if (t > S('G02')) {
    const g = ap(t, 'G02', 0.2); panel(600, 300, 360, 130, CYAN, g);
    label('体积', 680, 336, 26, CYAN, g, { bold: true }); mathText(`π(1 − 1/b) = ${(Math.PI * (1 - 1 / B)).toFixed(4)}`, 940, 394, 24, CR, { align: 'right', alpha: g, upright: true });
    label('→ π  有限', 860, 336, 24, GRN, ap(t, 'G02', 0.7), { bold: true });
  }
  if (t > S('C07')) {
    const g = ap(t, 'C07', 0.1); panel(990, 300, 400, 130, RED, g);
    label('表面积', 1080, 336, 26, RED, g, { bold: true }); mathText(`≥ 2π ln b = ${(2 * Math.PI * Math.log(B)).toFixed(2)}`, 1370, 394, 24, CR, { align: 'right', alpha: g, upright: true });
    label('→ ∞', 1300, 336, 26, RED, ap(t, 'C07', 0.6), { bold: true });
  }
  if (t < S('G02')) richReveal([['y = 1/x，x ≥ 1，绕 x 轴', CR]], CX, 250, 38, t, P('C06', 0.2), { upright: true });
  if (t > S('B01') && t < S('C07')) label('表面积肯定也有限吧？', CX, 250, 34, SQ.B.col, ap(t, 'B01', 0.1), { bold: true });
  if (t > S('C07') && t < S('D01')) richReveal([['p = 1 → 发散', RED]], CX, 250, 36, t, P('C07', 0.5), { upright: true });
  if (t > S('D01')) { const d = ap(t, 'D01', 0.1); panel(700, 690, 560, 80, GOLD, d); label('装得满油漆，却刷不完外壁', CX, 730, 32, GOLD, d, { bold: true }); }
  if (t > S('C08')) richReveal([['油漆悖论 ← 第 5 章 p 积分', GOLD]], CX, 250, 36, t, P('C08', 0.1), { upright: true });
};

// ======================= 随堂 =======================
const GQ = { cx: 760, cy: 640, ux: 70, uy: 70 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['r = 2 的球：S = ？', CR]], 800, 300, 42, t, P('C10', 0.05), { upright: true });
  revSolid(GQ, { ...OX, R: x => Math.sqrt(Math.max(0, 4 - x * x)), t0: -1.999, t1: 1.999, col: CYAN, a: ap(t, 'C10', 0.3), Rmax: 2, rings: 5 });
  if (t > S('D02')) { richReveal([['4π · 2²', CYAN]], 1080, 470, 38, t, P('D02', 0.1), { upright: true }); richReveal([['= ', CR], ['16π', GOLD]], 1080, 570, 52, t, P('D02', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) { revSolid(GB, { ...OB, t0: 0.2, t1: 4, col: CYAN, a: ga * 0.45, Rmax: 1.6, rings: 6 }); band(GB, OB, XA, XB, GOLD, ga); richReveal([['dS = 2πf(x) · ds', GOLD]], CX, 250, 44, t, P('C11', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C12') - 0.1) { glowText('下一段：变力做功与弹簧', CX, 500, 52, CR, t, P('C12', 0.15)); glowText('MiMo 踩弹簧', CX, 590, 32, SQ.T.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 6 章 · P10 侧面积与加百列号角', '下一段：变力做功与弹簧', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM6('豆包')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.35, 'shimmer', 0.18); s('C02', 0.2, 'whoosh', 0.16); s('C03', 0.2, 'type', 0.14); s('C03', 0.6, 'ding', 0.2); s('G01', 0.1, 'buzz', 0.14);
  s('C04', 0.4, 'type', 0.14); s('C05', 0.15, 'ding_hi', 0.24); s('C05', 0.6, 'sparkle', 0.16);
  s('C06', 0.3, 'riser', 0.2); s('G02', 0.2, 'type', 0.14); s('G02', 0.7, 'ding', 0.2); s('B01', 0.1, 'pop', 0.16); s('C07', 0.1, 'type', 0.14); s('C07', 0.6, 'impact', 0.24);
  s('B02', 0.2, 'pluck', 0.14); s('D01', 0.1, 'sting', 0.2); s('C08', 0.1, 'ding_hi', 0.22);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'type', 0.14); s('D02', 0.55, 'ding_hi', 0.28);
  s('C11', 0.15, 'pop', 0.2); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
