// 第 5 章 P3《距离问题：速度表算路程》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A196 速度表指针 + 读数照片 · A197 v–t 图上每 5 秒一个长条 · A198 长条变细，面积 = 路程
const SC = {};
const TITLES = [['hook', '只剩速度表'], ['est', '每 5 秒当匀速'], ['area', '路程 = 面积'], ['quiz', '随堂一题'], ['outro', '小结']];
const VR = [7.6, 9.4, 10.7, 13.1, 14.3, 14.0, 12.5];
// 光滑速度曲线：过 7 个读数点的分段三次（Catmull-Rom）
function vAt(s) {
  const u = clamp(s / 5, 0, 6 - 1e-9), i = Math.floor(u), f = u - i, p = k => VR[clamp(k, 0, 6)];
  const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
  return 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
}
const GV = { cx: 640, cy: 810, ux: 24, uy: 26, x0: -1, x1: 33, y0: -0.6, y1: 16.5 };
function vtAxes(a) { gAxes(GV, a, { grid: false, xl: 't (s)', yl: 'v (m/s)', ticks: { x: [0, 5, 10, 15, 20, 25, 30].map(v => [v, String(v)]), y: [[5, '5'], [10, '10'], [15, '15']] } }); }
function photos(t, a, hiL, hiR) {
  VR.forEach((v, i) => { const p = a * clamp(prog(t, S('X01') + 0.6 + i * 0.25, 0.3)); if (p <= 0) return; const x = 560 + i * 132, y = 250;
    panel(x, y, 112, 92, (hiL && i < 6) ? GRN : (hiR && i > 0) ? INV : CYAN, p);
    label(`${i * 5} s`, x + 56, y + 24, 18, CR, p, { font: F_MATH }); label(v.toFixed(1), x + 56, y + 62, 30, GOLD, p, { font: F_MATH, bold: true }); });
}

SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'X01', 0), ts = clamp((t - S('X01')) * 2.2, 0, 30);
  gauge(860, 600, 170, vAt(ts) * 3.6, a, { vmax: 60, step: 10 });
  label(`${vAt(ts).toFixed(1)} m/s`, 860, 830, 34, GOLD, a, { font: F_MATH, bold: true });
  panel(1100, 520, 280, 150, RED, ap(t, 'X01', 0.3)); label('里程表', 1240, 560, 26, RED, ap(t, 'X01', 0.3), { bold: true }); label('— — — —', 1240, 615, 36, RED, ap(t, 'X01', 0.3) * (0.5 + 0.5 * Math.sin(t * 8)), { font: F_MATH });
  photos(t, a);
  if (t > S('D01')) label('速度一直在变', 1240, 760, 30, SQ.D.col, ap(t, 'D01', 0.2), { bold: true });
};

SC.est = t => {
  starfield(t); blueprint(0.4, 80);
  const hiL = t > S('C02') && t < S('G01'), hiR = t > S('G01');
  photos(t, fadeOut(t, S('C02'), 0.4), hiL, hiR);
  vtAxes(1); gPlot(GV, vAt, hexA(RED, 0.5), { xa: 0, xb: 30, w: 2.5, dash: [8, 6] });
  VR.forEach((v, i) => gDot(GV, i * 5, v, GOLD, 1));
  if (t < S('C02') - 0.1) { const c = ap(t, 'C01', 0.4); richReveal([['路程 = 速度 × 时间', GOLD]], CX, 380, 30, t, P('C01', 0.1), { upright: true }); return; }
  const fr = Array(6).fill(0);
  if (hiL) gRects(GV, s => VR[Math.round(s / 5)] ?? 0, 0, 30, 6, 0, GRN, ap(t, 'C02', 0), { k: 6 * prog(t, P('C02', 0.1), 1.2), fa: 0.3 });
  if (hiR) gRects(GV, s => VR[Math.round(s / 5)] ?? 0, 0, 30, 6, 1, INV, ap(t, 'G01', 0), { k: 6 * prog(t, P('G01', 0.1), 1.0), fa: 0.3 });
  richReveal([['开头读数：5 × (7.6 + … + 14.0) = ', GRN], ['345.5 m', GOLD]], CX, 250, 28, t, P('C02', 0.3), { upright: true });
  if (hiR) richReveal([['结尾读数：5 × (9.4 + … + 12.5) = ', INV], ['370 m', GOLD]], CX, 300, 28, t, P('G01', 0.3), { upright: true });
  if (t > S('X02')) label('这是真的吗？', 1300, 350, 30, SQ.X.col, ap(t, 'X02', 0.1), { bold: true });
};

SC.area = t => {
  starfield(t); blueprint(0.4, 80);
  vtAxes(1);
  const n = t < S('C04') ? 6 : Math.round(6 * Math.pow(2, 4 * prog(t, P('C04', 0.1), 1.8)));
  if (t < S('C04')) gRects(GV, s => VR[Math.round(s / 5)] ?? 0, 0, 30, 6, 0, GRN, 1, { fa: 0.3 });
  else gRects(GV, vAt, 0, 30, n, 'L', GRN, 1, { fa: 0.3 });
  gPlot(GV, vAt, RED, { xa: 0, xb: 30, w: 4, a: ap(t, 'C04', 0) });
  if (t < S('C04')) { const c = ap(t, 'C03', 0.4); seg(gx(GV, 10), gy(GV, 0) - 22, gx(GV, 15), gy(GV, 0) - 22, CR, c, 2); label('5 s', gx(GV, 12.5), gy(GV, 0) - 42, 22, CR, c, { bold: true }); label('高 = 速度', gx(GV, 12.5), gy(GV, 13.1) - 30, 22, GOLD, c, { bold: true }); label('面积 = 这 5 秒的路程', CX, 270, 30, GOLD, ap(t, 'C03', 0.6), { bold: true }); }
  else if (t < S('G02') - 0.1) { label(`${n} 个长条`, CX, 240, 28, GRN, 1, { bold: true }); if (t > P('C04', 0.6)) richReveal([['路程 = 速度曲线下的面积', GOLD]], CX, 300, 32, t, P('C04', 0.6), { upright: true }); }
  if (t > S('G02') - 0.1) { const g = ap(t, 'G02', 0); panel(700, 215, 560, 125, INV, g); label('P2：x² 下的面积', 840, 255, 24, CR, g, { bold: true }); label('P3：v(t) 下的路程', 1120, 255, 24, CR, g, { bold: true }); label('同一个极限', CX, 305, 30, GOLD, ap(t, 'G02', 0.5), { bold: true }); }
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['0 s：7.6     5 s：9.4     10 s：10.7', CYAN]], 850, 330, 32, t, P('C06', 0.1), { upright: true });
  richReveal([['前 10 秒 ≈ ？（开头读数）', CR]], 850, 420, 34, t, P('C06', 0.4), { upright: true });
  if (t > S('D02')) richReveal([['5 × (7.6 + 9.4) = ', CR], ['85 m', GOLD]], 850, 560, 44, t, P('D02', 0.2), { upright: true });
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) { vtAxes(ga); gArea(GV, vAt, 0, 30, ga); gPlot(GV, vAt, RED, { xa: 0, xb: 30, a: ga }); richReveal([['路程 = 速度曲线下的面积', GOLD]], 1100, 260, 40, t, P('C07', 0.2), { upright: true, alpha: ga }); }
  if (t > S('C08') - 0.1) { glowText('下一段：定积分的定义', CX, 500, 52, CR, t, P('C08', 0.15)); glowText('Mistral 讲严谨的定义', CX, 590, 32, SQ.R.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 5 章 · P3 速度表算路程', '下一段：定积分的定义', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM5('Grok')]);
};

SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  VR.forEach((v, i) => sfx(S('X01') + 0.6 + i * 0.25, 'click', 0.14)); s('X01', 0.3, 'buzz', 0.16); s('D01', 0.2, 'pop', 0.16);
  s('C01', 0.1, 'type', 0.14); s('C02', 0.3, 'type', 0.14); s('C02', 0.8, 'ding', 0.2); s('G01', 0.3, 'type', 0.14); s('G01', 0.8, 'ding', 0.2); s('X02', 0.1, 'slam', 0.2);
  s('C03', 0.6, 'pop', 0.18); s('C04', 0.1, 'warp', 0.18); s('C04', 0.6, 'ding_hi', 0.24); s('G02', 0.5, 'shimmer', 0.2); s('X03', 0.1, 'pop', 0.16);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.2, 'ding_hi', 0.28);
  s('C07', 0.2, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
