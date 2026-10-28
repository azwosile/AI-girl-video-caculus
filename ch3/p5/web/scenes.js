// 第 3 章 P5《隐函数求导》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A101 圆上滑动切线，斜率读数 −x/y · A102 y 身上的隐藏齿轮（y′）· A103 笛卡尔叶形线与 (3, 3) 处切线 · A104 sin 翻折成 arcsin，斜率互为倒数
const SC = {};
const TITLES = [['circle', '不是函数的曲线'], ['hidden', '把 y 当成 x 的函数'], ['folium', '笛卡尔叶形线'], ['inverse', '反三角函数的导数'], ['quiz', '随堂一题'], ['outro', '小结']];
const RC = SQ.R.col, PI = Math.PI;
function circleXY(G, a, o = {}) {   // 圆 x² + y² = 25
  if (a <= 0) return; const p = o.p ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.split) {
    glowPath(() => ctx.arc(gx(G, 0), gy(G, 0), 5 * G.ux, PI, PI + PI * p), GOLD, 4.5, 1);
    glowPath(() => ctx.arc(gx(G, 0), gy(G, 0), 5 * G.ux, 0, PI * p), CYAN, 4.5, 1);
  } else glowPath(() => ctx.arc(gx(G, 0), gy(G, 0), 5 * G.ux, -PI / 2, -PI / 2 + 2 * PI * p), o.col || OUTER, 4.5, 1);
  ctx.restore();
}
function tanAt(G, x, y, m, col, a, L = 2.6) { if (!isFinite(m)) { gV(G, x, col, a, { ya: y - L, yb: y + L, w: 3.5 }); return; } const dx = L / Math.sqrt(1 + m * m); gLine(G, m, x, y, x - dx, x + dx, col, a, 3.5); gDot(G, x, y, GOLD, a); }

// ======================= circle（A101 上） =======================
const GC = { cx: 1000, cy: 590, ux: 48, uy: 48, x0: -6.5, x1: 6.5, y0: -6.2, y1: 6.2 };
SC.circle = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'D01', 0.05);
  gAxes(GC, a, { grid: false, xl: 'x', yl: 'y' });
  const sp = ap(t, 'C01', 0.2);
  circleXY(GC, a * (1 - sp), { p: prog(t, P('D01', 0.05), 0.8) }); circleXY(GC, sp, { split: true });
  mathText('x^2 + y^2 = 25', gx(GC, 2.6), gy(GC, 5.6), 34, CR, { alpha: a, glow: 10, upright: true });
  if (t > P('D01', 0.45)) { const va = ap(t, 'D01', 0.45) * fadeOut(t, P('C01', 0.2), 0.3); gV(GC, 3, INV, va, { ya: -6, yb: 6, dash: [8, 6] }); gDot(GC, 3, 4, GOLD, va); gDot(GC, 3, -4, GOLD, va); label('一个 x，两个 y', gx(GC, 3) + 120, gy(GC, 0) - 30, 26, INV, va, { bold: true }); }
  if (sp > 0) { label('上半圆 y = √(25 − x²)', gx(GC, -3.6), gy(GC, 5.6), 24, GOLD, sp, { bold: true, font: F_MATH }); label('下半圆 y = −√(25 − x²)', gx(GC, -3.6), gy(GC, -5.7), 24, CYAN, sp, { bold: true, font: F_MATH }); }
  if (t > P('C01', 0.55)) stampMark(gx(GC, 0), gy(GC, 0), 66, t, P('C01', 0.6), { text: '不用拆开', col: RED, rot: -0.15 });
};

// ======================= hidden（A101 下 + A102） =======================
const GH = { cx: 1170, cy: 600, ux: 34, uy: 34, x0: -6.2, x1: 5.6, y0: -6, y1: 6 };
SC.hidden = t => {
  starfield(t); blueprint(0.4, 80);
  const x0 = 620, sz = 34;
  // 推导
  richReveal([['x^2', CR], [' + ', CR], ['y^2', INNER], [' = 25', CR]], x0, 260, sz, t, P('C02', 0.02), { align: 'left' });
  if (t > P('C02', 0.35)) {
    richReveal([['(y^2)′ = ', INNER], ['2y', OUTER], [' · ', PROD], ['y′', INNER]], x0, 340, sz, t, P('C02', 0.4), { align: 'left' });
    label('链式法则', x0 + 340, 335, 22, GOLD, ap(t, 'C02', 0.75), { bold: true, align: 'left' });
  }
  if (t > S('C03')) { richReveal([['2x + 2y · y′ = 0', CR]], x0, 430, sz, t, P('C03', 0.05), { align: 'left' }); richReveal([['y′ = −x / y', GRN]], x0, 520, 44, t, P('C03', 0.6), { align: 'left' }); }
  // 右：圆与滑动切线
  const ga = ap(t, 'C02', 0.1);
  gAxes(GH, ga, { grid: false }); circleXY(GH, ga, { col: OUTER });
  if (ga > 0) {
    const th = t < S('C04') ? 0.6 + (t - S('C02')) * 0.55 : lerp(0.6 + (S('C04') - S('C02')) * 0.55, Math.atan2(4, 3) + 2 * PI * Math.ceil(((0.6 + (S('C04') - S('C02')) * 0.55) - Math.atan2(4, 3)) / (2 * PI)), eIO(prog(t, S('C04'), 0.7)));
    const x = 5 * Math.cos(th), y = 5 * Math.sin(th), m = -x / y, on = t > P('C03', 0.6);
    tanAt(GH, x, y, m, INV, ga);
    if (on) ratioTag('y′ = −x/y = ' + (Math.abs(m) > 99 ? '∞' : m.toFixed(2)), 1170, 225, GRN, ap(t, 'C03', 0.6), { size: 26 });
  }
  if (t > S('C04')) { const a = ap(t, 'C04', 0.6); mathText('(3, 4)', gx(GH, 3) + 14, gy(GH, 4) - 14, 26, GOLD, { alpha: a, upright: true }); richReveal([['斜率 −3/4', GOLD]], x0, 610, 34, t, P('C04', 0.3), { align: 'left', upright: true }); richReveal([['3x + 4y = 25', INV]], x0, 680, 34, t, P('C04', 0.65), { align: 'left' }); }
  // D02：隐藏齿轮
  if (t > S('D02') - 0.1) {
    const a = ap(t, 'D02', 0), ch = gearChain(720, 840, [{ n: 20, col: CYAN }, { n: 14, col: INNER }], 4.2, [0]);
    panel(620, 770, 420, 150, INNER, a * 0.9); drawChain(ch, t * 1.2, 4.2, a);
    label('x', ch[0].x, ch[0].y, 26, CR, a, { font: F_MATH, bold: true }); label('y', ch[1].x, ch[1].y, 26, CR, a, { font: F_MATH, bold: true });
    label('y 跟着 x 转 → 乘 y′', 920, 845, 24, INNER, ap(t, 'D02', 0.35), { bold: true });
  }
};

// ======================= folium（A103） =======================
const GF = { cx: 880, cy: 690, ux: 44, uy: 44, x0: -5.2, x1: 7.0, y0: -4.6, y1: 6.2 };
const fol = tt => [6 * tt / (1 + tt * tt * tt), 6 * tt * tt / (1 + tt * tt * tt)];
function folium(G, col, a, p = 1) {
  if (a <= 0) return; ctx.save(); gClip(G);
  const runs = [[-0.62, 40], [-40, -1.62]];   // t ∈ (−1, ∞) 与 (−∞, −1)
  runs.forEach(([t0, t1], k) => { const n = 400, m = Math.floor(n * clamp(p)); if (m < 2) return; glowPath(() => { for (let i = 0; i <= m; i++) { let u = i / n; const tt = k === 0 ? (u < 0.5 ? lerp(t0, 1, u * 2) : 1 / lerp(1, 1 / t1, (u - 0.5) * 2)) : -1 / lerp(1 / 40, 1 / 1.62, u); const [x, y] = fol(tt); i ? ctx.lineTo(gx(G, x), gy(G, y)) : ctx.moveTo(gx(G, x), gy(G, y)); } }, col, 4.5, a); });
  ctx.restore();
}
SC.folium = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'R01', 0.05);
  gAxes(GF, a, { grid: false, xl: 'x', yl: 'y' });
  folium(GF, RC, a, prog(t, P('R01', 0.3), 1.2));
  richReveal([['x^3 + y^3 = 6xy', RC]], 760, 230, 40, t, P('R01', 0.45), { upright: false });
  label('笛卡尔 · 1638', 760, 170, 24, RC, ap(t, 'R01', 0.2), { bold: true });
  gLine(GF, -1, 0, -2, GF.x0, GF.x1, 'rgba(237,230,216,0.5)', ap(t, 'R01', 0.8) * 0.5, 2, [6, 8]);
  if (t > S('R02')) {
    const fa = fadeOut(t, S('C05'), 0.4) * 0.6 + 0.4;
    richReveal([['3x^2 + 3y^2 · y′', CR], [' = ', CR], ['6y + 6x · y′', CR]], 1110, 330, 30, t, P('R02', 0.1), { alpha: fa });
    label('右边用积法则', 1250, 380, 22, GOLD, ap(t, 'R02', 0.45) * fa, { bold: true });
    if (t > P('R02', 0.7)) { const w = fracW([['2y − x^2', CR]], [['y^2 − 2x', CR]], 32); mathText('y′ =', 1180, 500, 28, GRN, { alpha: ap(t, 'R02', 0.7) }); frac([['2y − x^2', GRN]], [['y^2 − 2x', GRN]], 1236, 492, 28, ap(t, 'R02', 0.75)); }
  }
  if (t > S('C05')) {
    const ta = ap(t, 'C05', 0.3); tanAt(GF, 3, 3, -1, INV, ta, 4);
    mathText('(3, 3)', gx(GF, 3) + 16, gy(GF, 3) - 16, 26, GOLD, { alpha: ta, upright: true });
    ratioTag('斜率 −1', 1272, 600, GOLD, ap(t, 'C05', 0.3), { size: 30 }); richReveal([['x + y = 6', INV]], 1272, 672, 34, t, P('C05', 0.65), { upright: true });
  }
  if (t > S('R03')) stampMark(1272, 790, 62, t, P('R03', 0.7), { text: '解不出 y', col: RC, rot: -0.14 });
};

// ======================= inverse（A104） =======================
const GI = { cx: 1010, cy: 600, ux: 120, uy: 120, x0: -2.0, x1: 2.4, y0: -2.0, y1: 2.4 };
SC.inverse = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('G01'), 0.35);
  if (pa > 0) {
    richReveal([['y = arcsin x', GOLD], ['  ⟺  ', CR], ['sin y = x', OUTER]], 980, 230, 40, t, P('C06', 0.15), { alpha: pa, upright: true });
    if (t > S('C07')) {
      richReveal([['cos y · y′ = 1', CR]], 980, 330, 38, t, P('C07', 0.03), { alpha: pa, upright: true });
      richReveal([['y′ = 1 / cos y', CR]], 980, 420, 38, t, P('C07', 0.35), { alpha: pa, upright: true });
      if (t > P('C07', 0.62)) { const w = mathW('y′ = ', 46); mathText('y′ = ', 820, 560, 46, GRN, { alpha: ap(t, 'C07', 0.62) * pa, upright: true }); frac([['1', GRN]], [['√(1 − x^2)', GRN]], 820 + w, 548, 42, ap(t, 'C07', 0.66) * pa); }
      label('（y 在 −π/2 到 π/2，cos y ≥ 0）', 980, 690, 22, CR, ap(t, 'C07', 0.7) * pa * 0.85, { font: F_MATH });
    }
  }
  if (t > S('G01') - 0.1) {
    const qa = fadeOut(t, S('G02'), 0.35);
    if (qa > 0) { richReveal([['(arctan x)′ = ', GOLD], ['1 / (1 + x^2)', GRN]], 980, 300, 46, t, P('G01', 0.2), { alpha: qa, upright: true }); const G = { cx: 980, cy: 560, ux: 70, uy: 70, x0: -4, x1: 4, y0: -2, y1: 2 }; gAxes(G, ap(t, 'G01', 0.3) * qa, { grid: false }); gPlot(G, Math.atan, GOLD, { a: ap(t, 'G01', 0.3) * qa, p: prog(t, P('G01', 0.3), 0.6) }); gPlot(G, x => 1 / (1 + x * x), GRN, { a: ap(t, 'G01', 0.55) * qa, w: 3, dash: [10, 8] }); }
  }
  if (t > S('G02') - 0.1) {
    const a = ap(t, 'G02', 0), fl = eIO(prog(t, P('G02', 0.45), 0.6));
    gAxes(GI, a, { grid: false }); gLine(GI, 1, 0, 0, GI.x0, GI.x1, 'rgba(237,230,216,0.6)', a, 2, [8, 8]); mathText('y = x', gx(GI, 1.9), gy(GI, 2.15), 24, CR, { alpha: a * 0.8 });
    gPlot(GI, Math.sin, OUTER, { a, xa: -PI / 2, xb: PI / 2 }); mathText('sin x', gx(GI, 1.25), gy(GI, 0.62), 28, OUTER, { alpha: a, upright: true });
    // 翻折：把 sin 曲线上的点 (u, sin u) 移到 (sin u, u)
    if (fl > 0) { ctx.save(); gClip(GI); glowPath(() => { for (let i = 0; i <= 120; i++) { const u = -PI / 2 + PI * i / 120, X = lerp(u, Math.sin(u), fl), Y = lerp(Math.sin(u), u, fl); i ? ctx.lineTo(gx(GI, X), gy(GI, Y)) : ctx.moveTo(gx(GI, X), gy(GI, Y)); } }, GOLD, 4.5, a); ctx.restore(); }
    if (fl >= 1) mathText('arcsin x', gx(GI, 0.55), gy(GI, 1.75), 28, GOLD, { alpha: a, upright: true });
    if (t > P('G02', 0.75)) {
      const u = 0.6, m = Math.cos(u), sa = ap(t, 'G02', 0.75);
      tanAt(GI, u, Math.sin(u), m, OUTER, sa, 0.8); tanAt(GI, Math.sin(u), u, 1 / m, GOLD, sa, 0.8);
      ratioTag('斜率 ' + m.toFixed(2), gx(GI, 1.6), gy(GI, -0.3), OUTER, sa, { size: 24 }); ratioTag('斜率 ' + (1 / m).toFixed(2), gx(GI, -1.0), gy(GI, 1.3), GOLD, sa, { size: 24 });
    }
    label('反函数的导数 = 原函数导数的倒数', 980, 210, 28, CR, ap(t, 'G02', 0.1), { bold: true });
  }
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.4, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 300);
  richReveal([['x^2 + y^2 = 25', CR], ['  在 (3, −4) 处的切线斜率？', CR]], CX - 40, 230, 40, t, P('C09', 0.1));
  const ga = ap(t, 'C09', 0.3); gAxes(GH, ga, { grid: false }); circleXY(GH, ga, { col: OUTER }); gDot(GH, 3, -4, GOLD, ga);
  mathText('(3, −4)', gx(GH, 3) + 14, gy(GH, -4) + 34, 26, GOLD, { alpha: ga, upright: true });
  if (t > S('D03')) { const a = ap(t, 'D03', 0.4); tanAt(GH, 3, -4, 0.75, INV, a); richReveal([['y′ = −3 / (−4) = 3/4', GRN]], 800, 560, 40, t, P('D03', 0.3)); checkMark(800, 650, 28, GRN, t, P('D03', 0.85)); }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C11'), 0.4);
  if (pa > 0) {
    [['y 当成 x 的函数', INNER], ['两边对 x 求导', CR], ['碰到 y 就乘 y′', GOLD]].forEach(([s, c], k) => { const p = eBack(prog(t, P('C10', 0.12 + 0.2 * k), 0.4)) * pa; if (p <= 0) return; const x = 720 + 260 * k; ctx.save(); ctx.translate(x, 470); ctx.scale(p, p); panel(-120, -60, 240, 120, c, 1); ctx.restore(); label(s, x, 470, 26, c, clamp(p), { bold: true }); });
  }
  if (t > S('C11') - 0.1) { const a = ap(t, 'C11', 0.2), G = { cx: 800, cy: 560, ux: 70, uy: 70, x0: -0.4, x1: 7, y0: -2.2, y1: 2.2 }; gAxes(G, a, { grid: false }); gPlot(G, Math.log, GOLD, { a, xa: 0.1, p: prog(t, P('C11', 0.2), 0.8) }); mathText('y = ln x', gx(G, 4.6), gy(G, 1.9), 32, GOLD, { alpha: a, glow: 10, upright: true }); glowText('下一段：对数求导法', CX, 760, 48, CR, t, P('C11', 0.3)); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 3 章 · P5 隐函数求导', '下一段：对数函数与对数求导法', [...CREDIT_BASE,
    'Mistral 娘立绘：依据 ZipZipPipe 设定由 AI 生成的本课差分。',
    'Mistral 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、Mistral 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.05, 'whoosh', 0.18); s('D01', 0.45, 'pluck', 0.22); s('C01', 0.2, 'shimmer', 0.18); s('C01', 0.6, 'stamp', 0.28);
  s('C02', 0.02, 'type', 0.14); s('C02', 0.4, 'type', 0.14); s('C02', 0.75, 'ding', 0.22); s('C03', 0.05, 'type', 0.14); s('C03', 0.6, 'ding_hi', 0.24); s('C04', 0.3, 'pop', 0.2); s('C04', 0.65, 'ding', 0.22); s('D02', 0.05, 'hum', 0.16);
  s('R01', 0.2, 'swoosh_in', 0.16); s('R01', 0.45, 'type', 0.14); s('R02', 0.1, 'type', 0.14); s('R02', 0.7, 'ding', 0.22); s('C05', 0.3, 'pluck', 0.24); s('C05', 0.65, 'ding_hi', 0.24); s('R03', 0.7, 'stamp', 0.28);
  s('C06', 0.15, 'type', 0.14); s('C07', 0.03, 'type', 0.14); s('C07', 0.62, 'ding_hi', 0.24); s('G01', 0.2, 'swoosh_in', 0.16); s('G02', 0.45, 'warp', 0.16); s('G02', 0.75, 'pop', 0.22);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.4, 'swoosh_in', 0.16); s('D03', 0.85, 'check', 0.28);
  s('C10', 0.12, 'pop', 0.22); s('C10', 0.32, 'pop', 0.22); s('C10', 0.52, 'pop', 0.22); s('C11', 0.3, 'swell', 0.3);
})();
finalize();
