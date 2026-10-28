// 第 3 章 P6《对数函数与对数求导法》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A105 eˣ 与 ln x 关于 y = x 对称，切线斜率互为倒数 · A106 对数把乘除“打折”成加减 · A107 xˣ 图像与最低点 x = 1/e · A108 幂法则 n 滑块连续变化
const SC = {};
const TITLES = [['ln', '(ln x)′ 从哪来'], ['logdiff', '对数求导法'], ['xx', 'x 的 x 次方'], ['power', '幂法则：任意实数 n'], ['quiz', '随堂一题'], ['outro', '小结']];
const ZC = SQ.Z.col;
function tagPrice(x, y, w, h, txt, col, a, o = {}) {   // 价签
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot || 0);
  ctx.fillStyle = 'rgba(12,18,38,0.92)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.moveTo(-w / 2 + 26, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2 + 26, h / 2); ctx.lineTo(-w / 2, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(-w / 2 + 22, 0, 6, 0, 7); ctx.stroke(); ctx.restore();
  label(txt, x + 10, y, o.size || 30, col, a, { bold: true });
}

// ======================= ln（A105） =======================
const GL = { cx: 1000, cy: 640, ux: 72, uy: 72, x0: -3.2, x1: 4.6, y0: -3.0, y1: 4.4 };
SC.ln = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01')) { kinetic('(ln x)′ = 1/x', CX, 460, 76, t, P('D01', 0.15), { col: GOLD, font: F_MATH }); stampMark(1240, 560, 60, t, P('D01', 0.6), { text: '从哪来？', col: INV, rot: -0.2 }); return; }
  const pa = fadeOut(t, S('G01'), 0.35);
  if (pa > 0) {
    richReveal([['y = ln x', GOLD], ['  ⟺  ', CR], ['e^y = x', OUTER]], 980, 280, 46, t, P('C01', 0.2), { alpha: pa, upright: true });
    if (t > P('C01', 0.6)) label('隐函数：两边对 x 求导', 980, 370, 26, CR, ap(t, 'C01', 0.6) * pa, { bold: true });
    if (t > S('C02')) {
      richReveal([['e^y', OUTER], [' · ', PROD], ['y′', INNER], [' = 1', CR]], 980, 470, 44, t, P('C02', 0.05), { alpha: pa, upright: true });
      richReveal([['y′ = 1 / e^y = ', CR], ['1/x', GRN]], 980, 580, 48, t, P('C02', 0.5), { alpha: pa, upright: true });
      if (t > P('C02', 0.85)) checkMark(1280, 568, 26, GRN, t, P('C02', 0.85), pa);
    }
  }
  const ga = win(t, S('G01') - 0.1, S('C03'), 0.35);
  if (ga > 0) {
    gAxes(GL, ga, { grid: false, xl: 'x', yl: 'y' }); gLine(GL, 1, 0, 0, GL.x0, GL.x1, 'rgba(237,230,216,0.55)', ga, 2, [8, 8]);
    gPlot(GL, Math.exp, OUTER, { a: ga }); gPlot(GL, Math.log, GOLD, { a: ga, xa: 0.03 });
    mathText('e^x', gx(GL, 1.25), gy(GL, 4.0), 30, OUTER, { alpha: ga, glow: 10 }); mathText('ln x', gx(GL, 3.6), gy(GL, 1.75), 30, GOLD, { alpha: ga, glow: 10, upright: true });
    const u = 0.25 + 0.6 * Math.sin((t - S('G01')) * 1.1), m = Math.exp(u), ta = ap(t, 'G01', 0.35);
    if (ta > 0) {
      tanAt(GL, u, m, m, OUTER, ta); tanAt(GL, m, u, 1 / m, GOLD, ta);
      seg(gx(GL, u), gy(GL, m), gx(GL, m), gy(GL, u), 'rgba(237,230,216,0.5)', ta, 1.5, [5, 6]);
      ratioTag('斜率 ' + m.toFixed(2), 760, 260, OUTER, ta, { size: 26 }); ratioTag('斜率 ' + (1 / m).toFixed(2), 1240, 260, GOLD, ta, { size: 26 });
    }
    label('互为倒数', 1000, 190, 28, CR, ap(t, 'G01', 0.6) * ga, { bold: true });
  }
  if (t > S('C03') - 0.1) {
    const a = ap(t, 'C03', 0.05);
    panel(660, 300, 640, 120, GOLD, a); mathText('(log_a x)′ =', 700, 376, 40, GOLD, { alpha: a }); frac([['1', GOLD]], [['x ln a', GOLD]], 700 + mathW('(log_a x)′ = ', 40), 364, 36, a);
    const b = ap(t, 'C03', 0.5); panel(660, 480, 640, 130, INNER, b);
    mathRich([['(ln ', OUTER], ['g(x)', INNER], [')′ =', OUTER]], 700, 560, 40, { alpha: b, glow: 10 }); frac([['g′(x)', INNER]], [['g(x)', INNER]], 700 + mathW('(ln g(x))′ = ', 40), 548, 36, b);
    label('链式法则', 1190, 545, 24, PROD, ap(t, 'C03', 0.65), { bold: true });
  }
};
function tanAt(G, x, y, m, col, a, L = 1.2) { const dx = L / Math.sqrt(1 + m * m); gLine(G, m, x, y, x - dx, x + dx, col, a, 3.5); gDot(G, x, y, col, a); }

// ======================= logdiff（A106） =======================
SC.logdiff = t => {
  starfield(t); blueprint(0.4, 80);
  // Z01：折扣价签
  const za = fadeOut(t, S('C04'), 0.35);
  if (za > 0) {
    tagPrice(820, 430, 260, 110, '×  ÷  幂', RED, ap(t, 'Z01', 0.1) * za, { rot: -0.08, size: 34 });
    if (t > P('Z01', 0.5)) { const p = ap(t, 'Z01', 0.5); seg(700, 440, 950, 420, RED, p * za, 5); arrowH(990, 1060, 430, ZC, p * za); tagPrice(1180, 430, 230, 110, '+  −', GRN, p * za, { rot: 0.06, size: 40 }); label('先取对数，打个折', 1000, 580, 32, ZC, p * za, { bold: true }); }
  }
  if (t > S('C04') - 0.1) {
    const a = ap(t, 'C04', 0.1), y0 = 300, sz = 36;
    mathText('y =', 640, y0 + 10, sz, CR, { alpha: a });
    frac([['x^{3/4}', OUTER], [' √(x^2 + 1)', INNER]], [['(3x + 2)^5', PROD]], 640 + mathW('y = ', sz), y0, sz, a);
    if (t > S('C05')) {
      const b = ap(t, 'C05', 0.05);
      mathText('ln y =', 640, 470, sz, CR, { alpha: b });
      const x1 = 640 + mathW('ln y = ', sz);
      richReveal([['¾ ln x', OUTER]], x1, 470, sz, t, P('C05', 0.15), { align: 'left' });
      richReveal([[' + ½ ln(x^2 + 1)', INNER]], x1 + mathW('¾ ln x', sz), 470, sz, t, P('C05', 0.35), { align: 'left' });
      richReveal([[' − 5 ln(3x + 2)', PROD]], x1 + 20, 535, sz, t, P('C05', 0.55), { align: 'left' });
      [['乘 → 加', 0.2], ['除 → 减', 0.4], ['次方 → 系数', 0.6]].forEach(([s, f], k) => tagPrice(760 + k * 220, 620, 190, 64, s, ZC, ap(t, 'C05', f), { size: 24 }));
    }
    if (t > S('C06')) {
      const c = ap(t, 'C06', 0.05), y2 = 740;
      frac([['y′', GRN]], [['y', CR]], 640, y2, 34, c);
      richReveal([[' = ', CR], ['3/(4x)', OUTER], [' + ', CR], ['x/(x^2 + 1)', INNER], [' − ', CR], ['15/(3x + 2)', PROD]], 640 + 50, y2 + 12, 32, t, P('C06', 0.12), { align: 'left' });
      if (t > P('C06', 0.6)) { mathText('y′ = ', 640, y2 + 120, 36, GRN, { alpha: ap(t, 'C06', 0.6), glow: 10 }); mathText('y', 640 + mathW('y′ = ', 36), y2 + 120, 36, GOLD, { alpha: ap(t, 'C06', 0.6), glow: 16 }); mathText(' · (  …  )', 640 + mathW('y′ = y', 36), y2 + 120, 36, CR, { alpha: ap(t, 'C06', 0.6) }); }
    }
    if (t > S('Z02')) stampMark(1220, 840, 64, t, P('Z02', 0.3), { text: '乘回 y', col: ZC, rot: -0.12 });
  }
};

// ======================= xx（A107） =======================
const GX = { cx: 700, cy: 840, ux: 260, uy: 150, x0: -0.08, x1: 2.25, y0: -0.2, y1: 4.2 };
const xx = x => Math.pow(x, x), IE = 1 / Math.E;
SC.xx = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'D02', 0.05);
  gAxes(GX, a, { grid: false, xl: 'x', yl: 'y', ticks: { x: [[1, '1'], [2, '2']], y: [[1, '1']] } });
  gPlot(GX, xx, GOLD, { a, xa: 0.005, p: prog(t, P('D02', 0.1), 0.9) });
  mathText('y = x^x', 1250, 330, 34, GOLD, { alpha: a, glow: 12 });
  if (t < S('C07')) { [['幂法则？', 0.45], ['指数法则？', 0.65]].forEach(([s, f], k) => { if (t > P('D02', f)) { label(s, 900, 330 + k * 80, 30, CR, ap(t, 'D02', f), { bold: true }); crossMark(1040, 320 + k * 80, 28, RED, t, P('D02', f) + 0.2); } }); }
  if (t > S('C07')) {
    richReveal([['ln y = x ln x', CR]], 900, 310, 38, t, P('C07', 0.05), { upright: true });
    if (t > P('C07', 0.5)) { frac([['y′', GRN]], [['y', CR]], 760, 400, 34, ap(t, 'C07', 0.5)); richReveal([[' = ln x + 1', CR]], 810, 412, 38, t, P('C07', 0.55), { align: 'left', upright: true }); label('积法则', 1075, 400, 22, GOLD, ap(t, 'C07', 0.7), { bold: true }); }
  }
  if (t > S('C08')) {
    panel(690, 480, 370, 100, GRN, ap(t, 'C08', 0.05)); mathRich([['y′ = x^x', GRN], ['(ln x + 1)', CR]], 875, 546, 38, { align: 'center', alpha: ap(t, 'C08', 0.05), glow: 10 });
    const m = ap(t, 'C08', 0.6); if (m > 0) { gH(GX, xx(IE), INV, m, { xa: IE - 0.4, xb: IE + 0.4, w: 3.5 }); gDot(GX, IE, xx(IE), GOLD, m); gV(GX, IE, GOLD, m * 0.6, { ya: 0, yb: xx(IE), dash: [6, 6] }); mathText('x = 1/e', gx(GX, IE) - 20, gy(GX, 0) + 40, 26, GOLD, { alpha: m, upright: true }); label('最低点：导数 = 0', gx(GX, IE) + 150, gy(GX, xx(IE)) - 60, 24, GOLD, m, { bold: true }); }
  }
};

// ======================= power（A108） =======================
const GP = { cx: 700, cy: 820, ux: 170, uy: 120, x0: -0.05, x1: 2.4, y0: -0.2, y1: 4.8 };
SC.power = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G02', 0.02), u = prog(t, P('G02', 0.2), D('G02') * 0.7);
  const n = u < 0.5 ? lerp(0.5, 3, eIO(u * 2)) : lerp(3, Math.PI, eIO((u - 0.5) * 2));
  gAxes(GP, a, { grid: false, xl: 'x', yl: 'y', ticks: { x: [[1, '1'], [2, '2']] } });
  gPlot(GP, x => Math.pow(x, n), GOLD, { a, xa: 0.001 }); gPlot(GP, x => n * Math.pow(x, n - 1), GRN, { a: a * ap(t, 'G02', 0.3), w: 3, dash: [10, 8], xa: 0.01 });
  richReveal([['ln y = n ln x', CR]], 1195, 290, 36, t, P('G02', 0.12), { upright: true });
  richReveal([['(x^n)′ = n x^{n−1}', GRN]], 1195, 380, 42, t, P('G02', 0.4));
  // 滑块
  const sx0 = 1090, sx1 = 1330, sy = 520; panel(1065, 470, 290, 110, GOLD, a);
  seg(sx0, sy, sx1, sy, 'rgba(237,230,216,0.5)', a, 4); const kx = lerp(sx0, sx1, (n - 0.5) / 2.8);
  glowDot(kx, sy, 11, GOLD, a); label('n = ' + n.toFixed(2), 1210, 555, 26, GOLD, a, { font: F_MATH, bold: true });
  [[0.5, '½'], [1, '1'], [2, '2'], [3, '3']].forEach(([v, s]) => label(s, lerp(sx0, sx1, (v - 0.5) / 2.8), sy - 26, 20, CR, a * 0.8, { font: F_MATH }));
  if (n > 3.1) label('n = π 也成立', 1155, 640, 28, GRN, ap(t, 'G02', 0.9), { bold: true });
};

// ======================= quiz =======================
const GQ = { cx: 760, cy: 820, ux: 230, uy: 140, x0: -0.05, x1: 2.1, y0: -0.2, y1: 3.8 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.4, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 330);
  richReveal([['(x^x)′', GOLD], [' 在 x = 1 处 = ?', CR]], CX - 60, 240, 46, t, P('C10', 0.1));
  const ga = ap(t, 'C10', 0.3); gAxes(GQ, ga, { grid: false, ticks: { x: [[1, '1']] } }); gPlot(GQ, xx, GOLD, { a: ga, xa: 0.005 }); gDot(GQ, 1, 1, GOLD, ga);
  if (t > S('D03')) { const la = ap(t, 'D03', 0.4); gLine(GQ, 1, 1, 1, 0.3, 1.9, INV, la, 3.5); richReveal([['1^1 · (0 + 1) = 1', GRN]], 1150, 560, 40, t, P('D03', 0.3), { upright: true }); checkMark(1150, 650, 28, GRN, t, P('D03', 0.85)); }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C12'), 0.4);
  if (pa > 0) {
    richReveal([['(ln x)′ = 1/x', GOLD]], CX, 380, 50, t, P('C11', 0.1), { alpha: pa, upright: true });
    richReveal([['乘除幂指一大串 → ', CR], ['先取对数', ZC], [' → 求导 → ', CR], ['乘回 y', GOLD]], CX, 520, 34, t, P('C11', 0.45), { alpha: pa });
  }
  if (t > S('C12') - 0.1) { const a = ap(t, 'C12', 0.2), G = { cx: 760, cy: 640, ux: 120, uy: 40, x0: -0.2, x1: 4.6, y0: -0.3, y1: 7 }; gAxes(G, a, { grid: false }); gPlot(G, x => Math.exp(0.45 * x), GRN, { a, p: prog(t, P('C12', 0.2), 0.8) }); gPlot(G, x => 6 * Math.exp(-0.7 * x), RED, { a, p: prog(t, P('C12', 0.35), 0.8) }); glowText('下一段：指数增长与衰减', CX, 760, 46, CR, t, P('C12', 0.3)); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 3 章 · P6 对数函数与对数求导法', '下一段：指数增长与衰减', [...CREDIT_BASE,
    'GLM（智谱）娘立绘：依据 ZipZipPipe 设定由 AI 生成的本课差分。',
    'GLM 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、GLM、智谱 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.15, 'pop', 0.24); s('D01', 0.6, 'stamp', 0.28); s('C01', 0.2, 'type', 0.14); s('C02', 0.05, 'type', 0.14); s('C02', 0.5, 'ding', 0.22); s('C02', 0.85, 'check', 0.24);
  s('G01', 0.05, 'whoosh', 0.16); s('G01', 0.35, 'pluck', 0.2); s('C03', 0.05, 'pop', 0.2); s('C03', 0.5, 'pop', 0.2);
  s('Z01', 0.1, 'click', 0.24); s('Z01', 0.5, 'slap', 0.2); s('Z01', 0.55, 'marimba_hi', 0.22); s('C04', 0.1, 'type', 0.14);
  s('C05', 0.15, 'type', 0.12); s('C05', 0.35, 'type', 0.12); s('C05', 0.55, 'type', 0.12); [0.2, 0.4, 0.6].forEach(f => s('C05', f, 'tick', 0.16));
  s('C06', 0.12, 'type', 0.14); s('C06', 0.6, 'ding', 0.22); s('Z02', 0.3, 'stamp', 0.28);
  s('D02', 0.1, 'whoosh', 0.16); s('D02', 0.65, 'buzz', 0.16); s('C07', 0.05, 'type', 0.14); s('C07', 0.55, 'type', 0.14); s('C08', 0.05, 'ding', 0.22); s('C08', 0.6, 'pluck', 0.24);
  s('G02', 0.12, 'type', 0.14); s('G02', 0.4, 'ding', 0.22); s('G02', 0.2, 'riser', 0.12); s('G02', 0.9, 'ding_hi', 0.24);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.85, 'check', 0.28);
  s('C11', 0.1, 'type', 0.14); s('C11', 0.45, 'pop', 0.2); s('C12', 0.3, 'swell', 0.3);
})();
finalize();
