// 第 6 章 P8《微元法：怎么选》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.3 例 4 + 同济 6.1 元素法。
// A269 元素法三步卡片 · A270 绕 x = 2 的柱壳 · A271 微元对照表
const SC = {};
const TITLES = [['steps', '元素法三步'], ['table', '微元对照表'], ['choose', '怎么选'], ['ex', '绕 x = 2'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 元素法三步（A269） =======================
const STEP = [['①', '取一小段', '[x, x + dx]', CYAN, 'Z02', 0.05], ['②', '写微元', 'dU ≈ f(x) dx', GOLD, 'Z02', 0.5], ['③', '积分', 'U = ∫ₐᵇ f(x) dx', GRN, 'Z03', 0.1]];
const GS = { cx: 640, cy: 790, ux: 110, uy: 60, x0: -0.1, x1: 6.4, y0: 0, y1: 2.6 };
const FS = x => 1.2 + 0.6 * Math.sin(0.9 * x) + 0.12 * x;
SC.steps = t => {
  starfield(t); blueprint(0.35, 80);
  glowText('元素法（微元法）', CX, 250, 52, SQ.Z.col, t, P('Z01', 0.1));
  STEP.forEach(([n, s, f, c, id, fr], i) => {
    const a = ap(t, id, fr); if (a <= 0) return; const x = 610 + i * 260;
    panel(x, 320, 230, 180, c, a); label(n, x + 115, 362, 36, c, a, { bold: true }); label(s, x + 115, 412, 28, CR, a, { bold: true });
    mathText(f, x + 115, 466, 23, c, { align: 'center', alpha: a, upright: true });
    if (i) arrowH(x - 26, x - 6, 410, c, a);
  });
  const g = ap(t, 'Z02', 0.05); seg(gx(GS, 0), gy(GS, 0), gx(GS, 6.2), gy(GS, 0), CR, g * 0.6, 1.5); gPlot(GS, FS, CYAN, { a: g, xa: 0, xb: 6.2 });
  if (t > S('Z02')) gStrip(GS, 3.2, 0.3, FS, () => 0, GOLD, ap(t, 'Z02', 0.15) * fadeOut(t, P('Z03', 0.1)));
  if (t > S('Z03')) gBetween(GS, FS, () => 0, 0.4, 6, ap(t, 'Z03', 0.1), { p: eIO(prog(t, P('Z03', 0.1), 1.0)), col: 'rgba(110,220,140,0.30)' });
  if (t > S('C01')) label('面积 · 体积 · 弧长 · 功 · 压力：同一个套路', CX, 560, 30, GOLD, ap(t, 'C01', 0.2), { bold: true });
};

// ======================= 微元对照表（A271） =======================
const TAB = [['面积', '(y上 − y下) dx', 'P2–P3', CYAN, 'C02', 0.05], ['圆盘', 'πR² dx', 'P5', SQ.M.col, 'C02', 0.35], ['垫圈', 'π(R² − r²) dx', 'P6', SQ.H.col, 'C02', 0.65],
  ['柱壳', '2πx · h(x) dx', 'P7', SQ.L.col, 'C03', 0.05], ['弧长', 'ds = √(1 + y′²) dx', 'P9', GRN, 'C03', 0.45], ['功', 'F(x) dx', 'P11–P12', RED, 'C03', 0.6], ['压力', 'ρg · h · w dy', 'P13', INV, 'C03', 0.75]];
SC.table = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C02', 0); panel(620, 230, 740, 530, GOLD, a);
  label('量', 720, 270, 26, GOLD, a, { bold: true }); label('微元', 980, 270, 26, GOLD, a, { bold: true }); label('出处', 1260, 270, 26, GOLD, a, { bold: true });
  seg(640, 296, 1340, 296, GOLD, a * 0.6, 1.5);
  TAB.forEach(([q, f, p, c, id, fr], i) => {
    const r = ap(t, id, fr); if (r <= 0) return; const y = 340 + i * 60, later = i >= 4;
    label(q, 720, y, 28, c, r * (later ? 0.75 : 1), { bold: true }); mathText(f, 980, y + 9, 26, later ? hexA(c, 0.85) : CR, { align: 'center', alpha: r, upright: true }); label(p, 1260, y, 22, CR, r * 0.8, { font: F_MATH });
  });
  if (t > S('C03')) seg(640, 340 + 3.5 * 60, 1340, 340 + 3.5 * 60, CR, ap(t, 'C03', 0.4) * 0.4, 1.5, [8, 6]);
};

// ======================= 怎么选 =======================
const GL = { cx: 650, cy: 600, ux: 120, uy: 70 }, GR = { cx: 1180, cy: 760, ux: 70, uy: 120 };
const RL = x => 0.8 + 0.5 * Math.sin(1.2 * x + 0.4);
SC.choose = t => {
  starfield(t); blueprint(0.35, 80);
  const la = ap(t, 'Z04', 0.05), ra = ap(t, 'Z04', 0.5);
  revSolid(GL, { axis: 'x', at: 0, e: 0.3, R: RL, t0: 0, t1: 2.6, col: SQ.M.col, a: la * 0.6, Rmax: 1.3, rings: 0 });
  [0.5, 1.1, 1.7, 2.2].forEach((x, i) => revSlab(GL, { axis: 'x', at: 0, e: 0.3, R: RL }, x, 0.1, GOLD, la * ap(t, 'Z04', 0.1 + i * 0.05)));
  seg(gx(GL, -0.3), GL.cy, gx(GL, 2.9), GL.cy, CR, la, 2, [8, 6]);
  label('⊥ 转轴切', gx(GL, 1.3), 400, 30, GOLD, la, { bold: true }); label('→ 圆盘 / 垫圈', gx(GL, 1.3), 830 - 30, 28, CR, la, { bold: true });
  const OY = { axis: 'y', at: 0, e: 0.3 };
  seg(GR.cx, GR.cy + 20, GR.cx, gy(GR, 3.2), CR, ra, 2, [8, 6]);
  [0.7, 1.4, 2.1].forEach((x, i) => revShell(GR, OY, x, 0.12, 0, 2.6 - 0.5 * x, i % 2 ? GOLD : SQ.L.col, ra * ap(t, 'Z04', 0.55 + i * 0.08)));
  label('∥ 转轴切', GR.cx, 400, 30, GOLD, ra, { bold: true }); label('→ 柱壳', GR.cx, 830 - 30, 28, CR, ra, { bold: true });
  if (t > S('C04')) { const c = ap(t, 'C04', 0.1); panel(700, 230, 560, 70, GRN, c); label('半径、边界好写 → 选它', CX, 266, 32, GRN, c, { bold: true }); }
};

// ======================= 绕 x = 2（A270） =======================
const GE = { cx: 640, cy: 740, ux: 180, uy: 900, x0: -0.1, x1: 4.2, y0: -0.05, y1: 0.4 };
const FE = x => x - x * x, OE = { axis: 'y', at: 2, dir: -1, e: 0.3 };
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0);
  seg(gx(GE, -0.05), GE.cy, gx(GE, 4.15), GE.cy, CR, a * 0.6, 2);
  seg(gx(GE, 2), GE.cy + 30, gx(GE, 2), gy(GE, 0.36), GOLD, a, 2.5, [12, 8]); label('x = 2', gx(GE, 2), gy(GE, 0.36) - 22, 26, GOLD, a, { bold: true });
  gArea(GE, FE, 0, 1, a, { pos: 'rgba(201,195,230,0.35)' }); gPlot(GE, FE, SQ.Z.col, { a, xa: 0, xb: 1 });
  label('y = x − x²', gx(GE, 0.5), gy(GE, 0.25) - 26, 24, SQ.Z.col, a, { bold: true, font: F_MATH });
  const m = ap(t, 'C05', 0.5); // 镜像轮廓（转一圈后的剖面）
  if (m > 0) { ctx.save(); ctx.globalAlpha *= m * 0.7; ctx.setLineDash([6, 5]); ctx.strokeStyle = SQ.Z.col; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = i / 40; ctx[i ? 'lineTo' : 'moveTo'](gx(GE, 4 - x), gy(GE, FE(x))); } ctx.stroke(); ctx.restore(); }
  if (t > S('G01')) {
    const x = 0.55, c = ap(t, 'G01', 0.1); revShell(GE, OE, x, 0.06, 0, FE(x), GOLD, c);
    seg(gx(GE, x), GE.cy + 14, gx(GE, 2), GE.cy + 14, '#ffffff', c, 2.5); mathText('2 − x', gx(GE, (x + 2) / 2), GE.cy + 44, 24, '#ffffff', { align: 'center', alpha: c });
    mathText('x − x²', gx(GE, x) - 96, gy(GE, FE(x) / 2), 22, GOLD, { alpha: c });
  }
  if (t > S('C06')) richReveal([['V = ', CR], ['∫', GOLD], ['₀¹ 2π(2 − x)(x − x²) dx = ', CR], ['π/2', GOLD]], CX, 250, 38, t, P('C06', 0.15), { upright: true });
  else if (t > S('G01')) richReveal([['柱壳：半径 ', CR], ['2 − x', '#ffffff'], ['，高 ', CR], ['x − x²', GOLD]], CX, 250, 38, t, P('G01', 0.3), { upright: true });
  if (t > S('Z05')) { label('¥', 1300, 400, 70, SQ.Z.col, ap(t, 'Z05', 0.2) * (0.7 + 0.3 * Math.sin(t * 6)), { bold: true }); label('本来要收费', 1300, 470, 26, SQ.Z.col, ap(t, 'Z05', 0.3), { bold: true }); }
};

// ======================= 随堂 =======================
const GQ = { cx: 720, cy: 760, ux: 150, uy: 200, x0: -0.1, x1: 2.4, y0: -0.1, y1: 1.5 };
const F7 = x => 2 * x * x - x * x * x;
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['P7：y = 2x² − x³ 绕 y 轴，横着切要先做什么？', CR]], 800, 300, 32, t, P('C08', 0.05), { upright: true });
  const ga = ap(t, 'C08', 0.3); gAxes(GQ, ga * 0.7, { grid: false }); gArea(GQ, F7, 0, 2, ga, { pos: 'rgba(88,214,168,0.28)' }); gPlot(GQ, F7, GOLD, { a: ga, xa: 0, xb: 2.05 });
  seg(gx(GQ, 0), gy(GQ, 0.75), gx(GQ, 2.2), gy(GQ, 0.75), RED, ga, 2, [10, 7]);
  if (t > S('D01')) { richReveal([['解 2x² − x³ = y 求 x', RED]], 1080, 470, 34, t, P('D01', 0.2), { upright: true }); label('三次方程，太难 → 用柱壳', 1080, 540, 28, CR, ap(t, 'D01', 0.55), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) STEP.forEach(([n, s, f, c], i) => { const x = 610 + i * 260, q = ga * ap(t, 'C09', 0.1 + i * 0.2); panel(x, 300, 230, 150, c, q); label(n + ' ' + s, x + 115, 350, 28, c, q, { bold: true }); mathText(f, x + 115, 410, 22, CR, { align: 'center', alpha: q, upright: true }); });
  if (t > S('C10') - 0.1) { glowText('下一段：弧长', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('Mistral 骑马量马道', CX, 590, 32, SQ.R.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 6 章 · P8 微元法：怎么选', '下一段：弧长', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM6('GLM')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Z01', 0.1, 'shimmer', 0.18); STEP.forEach(([, , , , id, f]) => s(id, f, 'pop', 0.18)); s('Z03', 0.1, 'riser', 0.14); s('C01', 0.2, 'ding', 0.2);
  TAB.forEach(([, , , , id, f]) => s(id, f, 'tick', 0.16));
  s('Z04', 0.05, 'pop', 0.16); s('Z04', 0.5, 'pop', 0.16); s('C04', 0.1, 'ding_hi', 0.24);
  s('C05', 0.1, 'pop', 0.16); s('G01', 0.1, 'whoosh', 0.14); s('C06', 0.15, 'type', 0.14); s('C06', 0.6, 'ding_hi', 0.24); s('Z05', 0.2, 'marimba', 0.16);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.2, 'buzz', 0.16); s('D01', 0.55, 'ding', 0.22);
  s('C09', 0.1, 'pop', 0.18); s('C09', 0.3, 'pop', 0.18); s('C09', 0.5, 'pop', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
