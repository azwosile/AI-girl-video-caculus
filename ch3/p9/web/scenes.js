// 第 3 章 P9《线性化与微分》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A116 局部放大：曲线变直线 · A118 近似值 vs 真值误差表 · A117 dy（走切线）与 Δy（走曲线）的直角三角形对照
const SC = {};
const TITLES = [['zoom', '走近一点看'], ['approx', '用切线估算'], ['diff', '微分 dy 与增量 Δy'], ['quiz', '随堂一题'], ['outro', '小结']];
const LC = SQ.L.col;
SIDE.L.dy = t => -6 * Math.abs(Math.sin(t * 5));
const f = x => Math.sqrt(x + 3), Lin = x => 2 + (x - 1) / 4;

// ======================= zoom（A116） =======================
SC.zoom = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('L01')) { kinetic('√4.05 = ?', CX, 460, 90, t, P('D01', 0.1), { col: GOLD, font: F_MATH }); label('不许按计算器', CX, 590, 32, CR, ap(t, 'D01', 0.55), { bold: true }); return; }
  // 放大倍数：L01 开始指数放大，C01 中段回到原尺寸并画出公式
  const zIn = prog(t, P('L01', 0.2), D('L01') * 0.75 + D('C01') * 0.25), zOut = eIO(prog(t, P('C01', 0.3), 0.8));
  const Z = Math.pow(60, eIO(zIn)) * (1 - zOut) + 1 * zOut, U0 = 130, G = { cx: 980 - 1 * U0 * Z, cy: 600 + 2 * U0 * Z, ux: U0 * Z, uy: U0 * Z, x0: 1 - 2.6 / Z, x1: 1 + 2.6 / Z, y0: 2 - 2.3 / Z, y1: 2 + 2.3 / Z };
  const a = ap(t, 'L01', 0.05);
  ctx.save(); ctx.beginPath(); ctx.rect(620, 280, 720, 620); ctx.clip();
  if (Z < 3) gAxes(G, a * clamp(3 - Z), { grid: false });
  gPlot(G, f, GOLD, { a, w: 5, xa: Math.max(-3, G.x0), xb: G.x1 });
  gLine(G, 0.25, 1, 2, G.x0, G.x1, INV, a * ap(t, 'L01', 0.3), 3, [12, 8]);
  gDot(G, 1, 2, GOLD, a);
  ctx.restore();
  panel(620, 280, 720, 620, LC, a * 0.6, 'rgba(0,0,0,0)');
  ratioTag('放大 ×' + Math.round(Z), 1230, 330, LC, a, { size: 26 });
  if (Z > 15) label('曲线和切线分不开了', 980, 840, 28, LC, clamp((Z - 15) / 10) * a, { bold: true });
  if (t > P('C01', 0.55)) { panel(660, 160, 640, 90, INV, ap(t, 'C01', 0.55)); mathRich([['L(x) = f(a) + ', CR], ['f′(a)', GRN], ['(x − a)', CYAN]], 980, 220, 36, { align: 'center', alpha: ap(t, 'C01', 0.55), glow: 10 }); }
  if (t > P('C01', 0.3)) label('线性化 = 切线', 760, 330, 26, INV, ap(t, 'C01', 0.3), { bold: true });
};

// ======================= approx（A118） =======================
const GA = { cx: 640, cy: 860, ux: 160, uy: 190, x0: -0.25, x1: 2.6, y0: 0, y1: 2.9 };
SC.approx = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C02', 0.02);
  gAxes(GA, a, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[2, '2']] } });
  gPlot(GA, f, GOLD, { a, w: 4.5, xa: -0.2 }); mathText('y = √(x + 3)', gx(GA, 1.6), gy(GA, 2.65), 28, GOLD, { alpha: a, glow: 8, upright: true });
  if (t > P('C02', 0.5)) { gLine(GA, 0.25, 1, 2, -0.2, 2.5, INV, ap(t, 'C02', 0.5), 3.5); gDot(GA, 1, 2, GOLD, ap(t, 'C02', 0.5)); label('斜率 1/4', gx(GA, 1.3), gy(GA, 2.3), 24, INV, ap(t, 'C02', 0.7), { bold: true }); }
  if (t > S('C03')) richReveal([['L(x) = 2 + (x − 1)/4', INV]], 1140, 250, 32, t, P('C03', 0.05));
  // 误差表
  const rows = [['√4.05', 1.05, P('C03', 0.6)], ['√3.98', 0.98, P('G01', 0.25)], ['√5', 2, P('G01', 0.6)]];
  const tx = 1000, ty = 640; panel(tx - 20, ty - 34, 380, 60 + rows.length * 56, CR, ap(t, 'C03', 0.5));
  ['', 'L(x)', '真值'].forEach((h, k) => label(h, tx + 50 + k * 130, ty, 24, CR, ap(t, 'C03', 0.5) * 0.85, { bold: true }));
  rows.forEach(([s, x, t0], i) => {
    if (t < t0) return; const p = eOut(prog(t, t0, 0.35)), y = ty + 56 + i * 56, err = Math.abs(Lin(x) - f(x));
    label(s, tx + 50, y, 26, CR, p, { font: F_MATH }); label(Lin(x).toFixed(4), tx + 180, y, 26, INV, p, { font: F_MATH });
    const show = i > 0 || t > S('L02'); if (show) label(f(x).toFixed(4), tx + 310, y, 26, err > 0.005 ? RED : GRN, p, { font: F_MATH });
    gV(GA, x, err > 0.005 ? RED : GRN, p * 0.6, { ya: 0, yb: Lin(x), dash: [5, 6] });
  });
  if (t > P('G01', 0.6)) label('离切点越远，误差越大', 1170, 555, 28, RED, ap(t, 'G01', 0.7), { bold: true });
  if (t > S('L02')) ratioTag('只差 0.00004', 1170, 555, GRN, ap(t, 'L02', 0.4) * fadeOut(t, S('G01'), 0.3), { size: 26 });
};

// ======================= diff（A117） =======================
const GD = { cx: 360, cy: 980, ux: 290, uy: 52, x0: 0.9, x1: 2.3, y0: 0, y1: 14 };
const g3 = x => x * x * x + x * x - 2 * x + 1, dg3 = x => 3 * x * x + 2 * x - 2;
SC.diff = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C04', 0.02), x0 = 1.6, DX = 0.6 * (1 - 0.85 * eIO(prog(t, P('C05', 0.5), 0.9)));   // 示意用的 dx，先大后小
  gAxes(GD, a, { grid: false }); gPlot(GD, g3, GOLD, { a, xa: 1.0, xb: 2.5 });
  const m = dg3(x0), y0 = g3(x0), x1 = x0 + DX;
  gLine(GD, m, x0, y0, x0 - 0.4, x1 + 0.15, INV, a, 3.2); gDot(GD, x0, y0, GOLD, a);
  // dx
  seg(gx(GD, x0), gy(GD, y0), gx(GD, x1), gy(GD, y0), CYAN, a, 4); label('dx', gx(GD, (x0 + x1) / 2), gy(GD, y0) + 26, 26, CYAN, a, { font: F_MATH, bold: true });
  // dy（到切线）
  const dyA = ap(t, 'C04', 0.4); seg(gx(GD, x1), gy(GD, y0), gx(GD, x1), gy(GD, y0 + m * DX), GRN, dyA, 5); label('dy', gx(GD, x1) - 34, gy(GD, y0 + m * DX / 2), 26, GRN, dyA, { font: F_MATH, bold: true });
  // Δy（到曲线）
  const DyA = ap(t, 'C05', 0.05); seg(gx(GD, x1) + 14, gy(GD, y0), gx(GD, x1) + 14, gy(GD, g3(x1)), RED, DyA, 5); label('Δy', gx(GD, x1) + 52, gy(GD, (y0 + g3(x1)) / 2), 26, RED, DyA, { font: F_MATH, bold: true }); gDot(GD, x1, g3(x1), RED, DyA);
  richReveal([['dy = ', GRN], ['f′(x)', GRN], [' dx', CYAN]], 1200, 260, 40, t, P('C04', 0.05));
  if (t > P('C04', 0.5)) label('dy：沿切线走', 1200, 330, 26, GRN, ap(t, 'C04', 0.5), { bold: true });
  if (t > S('C05')) label('Δy：沿曲线走（真实改变）', 1200, 380, 26, RED, ap(t, 'C05', 0.05), { bold: true });
  if (t > S('G02')) {
    const b = ap(t, 'G02', 0.1); panel(1040, 440, 320, 210, CR, b);
    mathText('y = x³ + x² − 2x + 1', 1200, 486, 26, GOLD, { align: 'center', alpha: b, upright: true }); mathText('x：2 → 2.05', 1200, 530, 26, CYAN, { align: 'center', alpha: b, upright: true });
    mathText('Δy = 0.717625', 1200, 582, 28, RED, { align: 'center', alpha: ap(t, 'G02', 0.5), upright: true }); mathText('dy = 14 × 0.05 = 0.7', 1200, 628, 28, GRN, { align: 'center', alpha: ap(t, 'G02', 0.7), upright: true });
  }
  if (t > S('C06')) { panel(1040, 690, 320, 90, INV, ap(t, 'C06', 0.1)); label('一元函数：可微 ⟺ 可导', 1200, 735, 26, INV, ap(t, 'C06', 0.1), { bold: true }); }
};

// ======================= quiz =======================
const GQ = { cx: 640, cy: 860, ux: 120, uy: 230, x0: -0.2, x1: 5.6, y0: 0, y1: 2.6 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.4, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 330);
  richReveal([['用线性化估算 ', CR], ['√4.1', GOLD]], CX - 60, 240, 46, t, P('C08', 0.1), { upright: true });
  const a = ap(t, 'C08', 0.3); gAxes(GQ, a, { grid: false, ticks: { x: [[4, '4']], y: [[2, '2']] } }); gPlot(GQ, Math.sqrt, GOLD, { a, xa: 0 }); gDot(GQ, 4, 2, GOLD, a);
  if (t > S('D02')) { gLine(GQ, 0.25, 4, 2, 1.5, 5.6, INV, ap(t, 'D02', 0.2), 3.5); richReveal([['斜率 1/4', INV]], 1150, 470, 34, t, P('D02', 0.25), { upright: true }); richReveal([['2 + 0.1/4 ≈ 2.025', GRN]], 1130, 550, 38, t, P('D02', 0.6), { upright: true }); checkMark(1150, 640, 28, GRN, t, P('D02', 0.85)); }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C10'), 0.4);
  if (pa > 0) {
    richReveal([['凑近看：曲线 ≈ 切线', LC]], CX, 380, 44, t, P('C09', 0.1), { alpha: pa, upright: true });
    richReveal([['dy', GRN], [' 走切线 · ', CR], ['Δy', RED], [' 走曲线', CR]], CX, 500, 40, t, P('C09', 0.5), { alpha: pa, upright: true });
  }
  if (t > S('C10') - 0.1) {
    const a = ap(t, 'C10', 0.15), ch = gearChain(820, 520, [{ n: 24, col: CYAN }, { n: 16, col: GOLD }, { n: 12, col: RED }], 5, [0, 0]); drawChain(ch, t * 0.7, 5, a);
    glowText('下一段：全章收束 · 出口票', CX, 740, 46, CR, t, P('C10', 0.3));
  }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 3 章 · P9 线性化与微分', '下一段：全章收束 · 出口票', [...CREDIT_BASE,
    'Llama 娘立绘：依据 ZipZipPipe 设定由 AI 生成的本课差分。',
    'Llama 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、Llama 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'pop', 0.24); s('L01', 0.2, 'riser', 0.14); s('L01', 0.9, 'shimmer', 0.18); s('C01', 0.3, 'warp', 0.14); s('C01', 0.55, 'ding', 0.22);
  s('C02', 0.5, 'pluck', 0.22); s('C03', 0.05, 'type', 0.14); s('C03', 0.6, 'tick', 0.18); s('L02', 0.05, 'ding_hi', 0.22); s('G01', 0.25, 'tick', 0.18); s('G01', 0.6, 'tick', 0.18); s('G01', 0.7, 'buzz', 0.14);
  s('C04', 0.05, 'type', 0.14); s('C04', 0.4, 'pluck', 0.22); s('C05', 0.05, 'pluck', 0.22); s('C05', 0.5, 'swoosh_soft', 0.16); s('G02', 0.5, 'tick', 0.16); s('G02', 0.7, 'ding', 0.22); s('C06', 0.1, 'stamp', 0.24);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.2, 'swoosh_in', 0.14); s('D02', 0.85, 'check', 0.28);
  s('C09', 0.1, 'type', 0.14); s('C09', 0.5, 'type', 0.14); s('C10', 0.15, 'hum', 0.14); s('C10', 0.3, 'swell', 0.3);
})();
finalize();
