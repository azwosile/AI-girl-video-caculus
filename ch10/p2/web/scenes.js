// 第 10 章 P2《摆线、星形线、渐开线》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.1 例 7 + 同济。
// A440 滚轮画摆线（圆心走 rθ、点转 θ） · A441 倒摆线滑道：三个高度的小球同时到底 · A442 小圆内滚画星形线、线轴解绳画渐开线
const SC = {};
const TITLES = [['roll', '摆线'], ['iso', '等时性'], ['astro', '星形线'], ['invol', '渐开线'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 摆线（A440） =======================
const G2 = { cx: 650, cy: 760, ux: 92, uy: 92, x0: -0.2, x1: 7.2, y0: 0, y1: 2.6 };
SC.roll = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'L01', 0); gAxes(G2, a * 0.6, { grid: false, ticks: { x: [[Math.PI, 'πr'], [TAU, '2πr']], y: [[2, '2r']] } });
  const th = TAU * eIO(prog(t, P('L01', 0.2), E('C01') - P('L01', 0.2))) + (t > S('C02') ? 0 : 0);
  const thH = t > S('C02') ? lerp(TAU, 2.1, eIO(prog(t, S('C02'), 0.8))) : th;
  const thF = t > S('G01') ? lerp(2.1, Math.PI, eIO(prog(t, S('G01'), 0.8))) : thH;
  rollWheel(G2, 1, Math.max(1e-3, thF), SQ.L.col, { a, angle: t > S('C02') });
  if (t > S('C02') - 0.1) paramTrace(G2, s => s - Math.sin(s), s => 1 - Math.cos(s), 0, TAU, SQ.L.col, { a: a * 0.35, w: 3, dot: false, dash: [8, 8] });
  if (t > S('C02')) { const k = ap(t, 'C02', 0.3); seg(gx(G2, 0), G2.cy + 34, gx(G2, thF), G2.cy + 34, GOLD, k, 3); label('rθ', gx(G2, thF / 2), G2.cy + 62, 26, GOLD, k, { bold: true }); label('θ', gx(G2, thF) + 26, gy(G2, 1) - 40, 26, GOLD, k, { bold: true }); }
  if (t > S('C03')) goldBox(980, 230, 640, 74, 'x = r(θ − sin θ)，y = r(1 − cos θ)', 34, ap(t, 'C03', 0.1));
  if (t > S('G01')) { const k = ap(t, 'G01', 0.6); seg(gx(G2, Math.PI) + 40, gy(G2, 2), gx(G2, Math.PI) + 40, G2.cy, CYAN, k, 3); label('2r', gx(G2, Math.PI) + 70, gy(G2, 1), 28, CYAN, k, { bold: true }); }
};

// ======================= 等时性（A441） =======================
const GI2 = { cx: 690, cy: 330, ux: 95, uy: 95, x0: -0.2, x1: 6.6, y0: -2.3, y1: 0.3 };
SC.iso = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C04', 0);
  paramTrace(GI2, s => s - Math.sin(s), s => -(1 - Math.cos(s)), 0, TAU, SQ.L.col, { a, w: 5, dot: false, p: prog(t, P('C04', 0.05), 0.8) });
  seg(gx(GI2, 0) - 20, GI2.cy, gx(GI2, TAU) + 20, GI2.cy, CR, a * 0.5, 2);
  label('倒过来的摆线', 980, 800, 28, SQ.L.col, ap(t, 'C04', 0.3), { bold: true });
  if (t > S('D01')) {
    const T0 = P('D01', 0.25), w = Math.PI / 2 / 2.2, tt = Math.max(0, t - T0), ph = Math.min(Math.PI / 2, w * tt);
    [[0.35, RED], [1.1, GOLD], [2.1, CYAN]].forEach(([q0, c], i) => {
      const cc = Math.cos(q0 / 2) * Math.cos(ph), q = 2 * Math.acos(clamp(cc, -1, 1));
      const X = gx(GI2, q - Math.sin(q)), Y = gy(GI2, -(1 - Math.cos(q))) - 13; glowDot(X, Y, 13, c, ap(t, 'D01', 0.1));
      if (t < T0 + 0.1) label(['高', '中', '低'][i], X, Y - 36, 24, c, ap(t, 'D01', 0.1), { bold: true });
    });
    if (ph >= Math.PI / 2 - 1e-6) { stampMark(gx(GI2, Math.PI), gy(GI2, -2) + 80, 46, t, T0 + 2.25, { text: '同时到！', col: GOLD, rot: -0.1 }); }
  }
  if (t > S('C05')) { const k = ap(t, 'C05', 0.2); panel(640, 640, 300, 110, GOLD, k); label('等时曲线', 790, 672, 30, GOLD, k, { bold: true }); label('惠更斯摆钟（1673）', 790, 716, 22, CR, k);
    const k2 = ap(t, 'C05', 0.55); panel(1000, 640, 300, 110, CYAN, k2); label('最速降线', 1150, 672, 30, CYAN, k2, { bold: true }); label('伯努利问题（1696）', 1150, 716, 22, CR, k2); }
};

// ======================= 星形线（A442） =======================
const GA2 = { cx: 900, cy: 560, ux: 155, uy: 155, x0: -1.25, x1: 1.25, y0: -1.25, y1: 1.25 };
SC.astro = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'L02', 0), th = TAU * eIO(prog(t, P('L02', 0.15), E('C06') - P('L02', 0.15)));
  gAxes(GA2, a * 0.45, { grid: false, ticks: { x: [[1, 'a']], y: [[1, 'a']] } });
  hypoWheel(GA2, 1, Math.max(1e-3, th), SQ.L.col, { a });
  if (t > S('C06')) { goldBox(1250, 330, 260, 110, '', 30, ap(t, 'C06', 0.2)); label('x = a cos³t', 1250, 308, 30, CYAN, ap(t, 'C06', 0.2), { bold: true }); label('y = a sin³t', 1250, 354, 30, GOLD, ap(t, 'C06', 0.3), { bold: true }); }
  if (t > S('C07')) richReveal([['x^{2/3} + y^{2/3} = ', CR], ['a^{2/3}', GOLD]], 980, 240, 38, t, P('C07', 0.2), { upright: true });
  if (t > S('C07')) [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([x, y], i) => { const k = ap(t, 'C07', 0.5 + 0.08 * i); glowDot(gx(GA2, x), gy(GA2, y), 8, RED, k); });
  if (t > S('C07')) label('四个尖点', 1250, 760, 26, RED, ap(t, 'C07', 0.6), { bold: true });
};

// ======================= 渐开线（A442） =======================
const GV2 = { cx: 880, cy: 560, ux: 72, uy: 72, x0: -4.2, x1: 4.2, y0: -4, y1: 4 };
SC.invol = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'L03', 0), th = 4.6 * eIO(prog(t, P('L03', 0.2), E('C08') - P('L03', 0.2)));
  unwind(GV2, 0.8, Math.max(1e-3, th), SQ.L.col, { a, turns: 1.2 });
  if (t > S('C08')) { const k = ap(t, 'C08', 0.1);
    goldBox(1200, 250, 330, 104, '', 26, k); label('x = a(cos t + t sin t)', 1200, 228, 24, CYAN, k, { bold: true }); label('y = a(sin t − t cos t)', 1200, 272, 24, GOLD, k, { bold: true });
    label('绳长 = 解开的弧长 at', 1200, 830, 26, GOLD, ap(t, 'C08', 0.5), { bold: true }); }
  if (t > S('G02')) {
    const k = ap(t, 'G02', 0.1), cx = 1240, cy = 560, R = 70, n = 10, rot = t * 0.6;
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = GRN; ctx.lineWidth = 3; ctx.shadowColor = GRN; ctx.shadowBlur = 8; ctx.beginPath();
    for (let i = 0; i < n; i++) { const q0 = rot + i * TAU / n; for (let j = 0; j <= 8; j++) { const u = j / 8 * 0.6, s = q0 + u * 0.35; const r = R * Math.hypot(1, u); ctx.lineTo(cx + r * Math.cos(s), cy + r * Math.sin(s)); }
      for (let j = 8; j >= 0; j--) { const u = j / 8 * 0.6, s = q0 + TAU / n * 0.55 - u * 0.35; const r = R * Math.hypot(1, u); ctx.lineTo(cx + r * Math.cos(s), cy + r * Math.sin(s)); } }
    ctx.closePath(); ctx.stroke(); ctx.restore(); label('渐开线齿形', cx, cy + 130, 26, GRN, k, { bold: true });
  }
};

// ======================= 随堂 =======================
const GQ2 = { cx: 680, cy: 700, ux: 85, uy: 85, x0: -0.2, x1: 7, y0: 0, y1: 2.4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['滚一圈，点前进 ', CR], ['？', GOLD]], 880, 250, 40, t, P('C10', 0.05), { upright: true });
  const a = ap(t, 'C10', 0.2); gAxes(GQ2, a * 0.5, { grid: false, ticks: { x: [[TAU, '2πr']], y: [] } });
  const th = t > S('D02') ? TAU * eIO(prog(t, P('D02', 0.05), 1.2)) : 0.001;
  rollWheel(GQ2, 1, th, SQ.L.col, { a });
  if (t > S('D02')) { const k = ap(t, 'D02', 0.5); seg(gx(GQ2, 0), GQ2.cy + 34, gx(GQ2, TAU), GQ2.cy + 34, GOLD, k, 4); label('2πr = 周长', gx(GQ2, Math.PI), GQ2.cy + 66, 30, GOLD, k, { bold: true }); checkMark(1330, 470, 22, GRN, t, P('D02', 0.7)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) {
    [['摆线', '轮子在直线上滚'], ['星形线', '小圆在大圆里滚'], ['渐开线', '绳子从线轴上解开']].forEach(([n, d], i) => { const k = ap(t, 'C11', 0.05 + 0.18 * i) * ga;
      panel(640 + i * 240, 330, 220, 150, SQ.L.col, k); label(n, 750 + i * 240, 375, 34, SQ.L.col, k, { bold: true }); label(d, 750 + i * 240, 430, 20, CR, k); });
  }
  if (t > S('C12') - 0.1) { glowText('下一段：参数曲线的切线与凹凸', CX, 520, 50, CR, t, P('C12', 0.15)); glowText('Gemini：两条切线都对！', CX, 610, 32, SQ.M.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 10 章 · P2 摆线与星形线', '下一段：切线与凹凸', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM10('Llama')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('L01', 0.2, 'swell', 0.14); s('C02', 0.3, 'pluck', 0.18); s('C03', 0.1, 'ding', 0.22); s('G01', 0.6, 'pop', 0.18);
  s('C04', 0.05, 'whoosh', 0.14); s('D01', 0.25, 'swoosh_in', 0.16); sfx(P('D01', 0.25) + 2.2, 'ding_hi', 0.26); sfx(P('D01', 0.25) + 2.25, 'stamp', 0.24); s('C05', 0.2, 'pop', 0.16); s('C05', 0.55, 'pop', 0.16);
  s('L02', 0.15, 'swell', 0.14); s('C06', 0.2, 'ding', 0.2); s('C07', 0.2, 'pop', 0.16); [0.5, 0.58, 0.66, 0.74].forEach(f => s('C07', f, 'marimba', 0.12));
  s('L03', 0.2, 'swell', 0.14); s('C08', 0.1, 'ding', 0.2); s('G02', 0.1, 'click', 0.16);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'whoosh', 0.14); s('D02', 0.7, 'check', 0.24);
  s('C11', 0.05, 'pop', 0.18); s('C11', 0.23, 'pop', 0.18); s('C11', 0.41, 'pop', 0.18); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
