// 第 4 章 P4《中值定理的用法：恒等式与不等式》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A135 导数为 0 的曲线被压平；导数相同的两条曲线平移重合 · A136 拉格朗日“三明治”：c 落在 0 和 x 之间 · A137 三条曲线夹逼图 + 数值表
const SC = {};
const TITLES = [['cor', '推论：导数为零 ⇒ 常数'], ['ineq', '证明不等式'], ['sand', '三明治：ln(1 + x)'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 推论（A135） =======================
const GC = { cx: 650, cy: 640, ux: 62, uy: 50, x0: 0, x1: 11, y0: 0, y1: 7 };
const GA = { cx: 980, cy: 760, ux: 170, uy: 120, x0: -1.25, x1: 1.25, y0: -1.8, y1: 3.4 };
SC.cor = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C03') - 0.05) {
    const fa = fadeOut(t, S('C03') - 0.4, 0.35); const a = ap(t, 'C01', 0) * fa;
    gAxes(GC, a, { grid: false });
    // C01–C02：起伏被压平
    const amp = 1.6 * (1 - eIO(prog(t, P('C02', 0.2), D('C02') * 0.7)));
    const f1 = x => 3.6 + amp * Math.sin(1.1 * x) * Math.cos(0.37 * x);
    if (t < S('G01') + 0.3) {
      const ga = a * fadeOut(t, S('G01'), 0.3);
      gPlot(GC, f1, RED, { a: ga });
      richReveal([["f'(x) ≡ 0", GRN]], 1180, 250, 36, t, P('C01', 0.4), { upright: true, alpha: ga });
      if (t > S('C02')) { const x1 = 2.5, x2 = 8.5; gDot(GC, x1, f1(x1), GOLD, ga); gDot(GC, x2, f1(x2), GOLD, ga); richReveal([["f(x_2) − f(x_1) = f'(c)(x_2 − x_1) = 0", CR]], 1000, 320, 28, t, P('C02', 0.15), { upright: true, alpha: ga }); }
      if (amp < 0.02) label('常数', gx(GC, 10), gy(GC, 3.6) - 30, 26, GOLD, ga, { bold: true });
    }
    // G01：两条导数相同的曲线，一条平移下来重合
    if (t > S('G01') - 0.1) {
      const g = ap(t, 'G01', 0) * fa, base = x => 1.6 + 0.9 * Math.sin(0.8 * x) + 0.12 * x, dy = 3 * (1 - eIO(prog(t, P('G01', 0.45), D('G01') * 0.45)));
      gPlot(GC, base, CYAN, { a: g }); gPlot(GC, x => base(x) + dy, RED, { a: g });
      richReveal([["F' = G'  ⇒  F = G + C", GOLD]], 1000, 250, 34, t, P('G01', 0.2), { upright: true, alpha: g });
      if (dy > 0.1) arrowV(gx(GC, 9.5), gy(GC, base(9.5) + dy) + 12, gy(GC, base(9.5)) - 12, GOLD, g * 0.8);
      label('C', gx(GC, 9.5) + 26, gy(GC, base(9.5) + dy / 2), 28, GOLD, g * (dy > 0.1 ? 1 : 0), { font: F_MATH });
    }
    return;
  }
  // C03–C04：arcsin + arccos = π/2
  const a = ap(t, 'C03', 0);
  richReveal([['arcsin x', RED], [' + ', CR], ['arccos x', CYAN], [' = π/2 ?', GOLD]], 980, 210, 38, t, P('C03', 0.2), { upright: true });
  gAxes(GA, a, { grid: false, ticks: { x: [[-1, '−1'], [1, '1']], y: [[Math.PI / 2, 'π/2']] } });
  gPlot(GA, Math.asin, RED, { a: a * 0.8, xa: -1, xb: 1 }); gPlot(GA, Math.acos, CYAN, { a: a * 0.8, xa: -1, xb: 1 });
  if (t > S('D01')) {
    richReveal([['1/√(1 − x^2)', RED], [' − ', CR], ['1/√(1 − x^2)', CYAN], [' = 0', GRN]], 980, 280, 30, t, P('D01', 0.1), { upright: true });
    const p = eIO(prog(t, P('D01', 0.6), 0.9)); gPlot(GA, x => Math.asin(x) + Math.acos(x), GOLD, { a: ap(t, 'D01', 0.6), xa: -1, xb: lerp(-1, 1, p), w: 5 });
  }
  if (t > S('C04')) { gDot(GA, 0, Math.PI / 2, GOLD, ap(t, 'C04', 0.2)); label('x = 0：0 + π/2', gx(GA, 0) + 120, gy(GA, Math.PI / 2) - 40, 26, GOLD, ap(t, 'C04', 0.2), { font: F_MATH, bold: true }); checkMark(1300, 210, 40, GRN, t, P('C04', 0.7)); }
};

// ======================= 证明不等式 =======================
const GT = { cx: 900, cy: 600, ux: 90, uy: 150, x0: -3.2, x1: 3.2, y0: -1.7, y1: 1.7 };
SC.ineq = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C06')) {
    slab('两点之差', 760, 420, 32, t, P('C05', 0.4), { bg: CYAN, c: COL.ink }); slab('函数值之差', 1200, 420, 32, t, P('C05', 0.55), { bg: RED });
    if (t > P('C05', 0.75)) { arrowV(760, 470, 560, CR, ap(t, 'C05', 0.75)); arrowV(1200, 470, 560, CR, ap(t, 'C05', 0.75)); }
    termCard('Mean Value Theorem', '想到拉格朗日', CX, 640, t, P('C05', 0.78));
    return;
  }
  const a = ap(t, 'C06', 0);
  gAxes(GT, a, { grid: false, ticks: { y: [[1, '1']] } });
  gPlot(GT, Math.atan, RED, { a });
  const xa = -0.6, xb = 1.8, ca = ap(t, 'C06', 0.15);
  gDot(GT, xa, Math.atan(xa), CYAN, ca); gDot(GT, xb, Math.atan(xb), CYAN, ca); gLine(GT, (Math.atan(xb) - Math.atan(xa)) / (xb - xa), xa, Math.atan(xa), xa, xb, SEC, ca, 3.5);
  mathText('a', gx(GT, xa), gy(GT, 0) + 34, 24, CYAN, { align: 'center', alpha: ca }); mathText('b', gx(GT, xb), gy(GT, 0) + 34, 24, CYAN, { align: 'center', alpha: ca });
  // 斜率 1 的参照线
  const r = ap(t, 'C06', 0.6); gLine(GT, 1, 0, 0, -1.6, 1.6, GOLD, r * 0.6, 2.5, [8, 8]); label('斜率 1', gx(GT, 1.25) + 50, gy(GT, 1.25), 22, GOLD, r, { bold: true });
  richReveal([['arctan b − arctan a = ', RED], ['(b − a)', CYAN], [' · 1/(1 + c^2)', GRN]], 980, 230, 30, t, P('C06', 0.2), { upright: true });
  richReveal([['1/(1 + c^2) ≤ 1', GRN]], 980, 290, 30, t, P('C06', 0.65), { upright: true });
  if (t > S('G02')) { panel(700, 820, 560, 80, GOLD, ap(t, 'G02', 0.1)); richReveal([['|arctan b − arctan a| ≤ |b − a|', GOLD]], 980, 872, 34, t, P('G02', 0.15), { upright: true }); }
};

// ======================= 三明治（A136 + A137） =======================
const GS = { cx: 650, cy: 800, ux: 150, uy: 150, x0: 0, x1: 3.1, y0: 0, y1: 3.1 };
const ROWS = [[1, '0.5', '0.693', '1', 0.3], [2, '0.667', '1.099', '2', 0.68]];
SC.sand = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C07', 0);
  richReveal([['x/(1 + x)', CYAN], ['  <  ', CR], ['ln(1 + x)', RED], ['  <  ', CR], ['x', GOLD], ['   (x > 0)', CR]], 1000, 200, 34, t, P('C07', 0.2), { upright: true });
  gAxes(GS, a, { grid: false, ticks: { x: [[1, '1'], [2, '2'], [3, '3']], y: [[1, '1'], [2, '2']] } });
  const dp = eIO(prog(t, P('C07', 0.4), 1.2));
  gPlot(GS, x => x, GOLD, { a, p: dp }); gPlot(GS, x => Math.log(1 + x), RED, { a, p: dp }); gPlot(GS, x => x / (1 + x), CYAN, { a, p: dp });
  // C08–C09：c 在 0 和 x 之间（数轴 + 分母夹逼）
  if (t > S('C08') - 0.1) {
    const b = ap(t, 'C08', 0);
    richReveal([['ln(1 + x) = x / (1 + c)', RED], ['，  0 < c < x', SEC]], 1000, 262, 30, t, P('C08', 0.3), { upright: true });
    const X = 2.4, cxp = lerp(0.3, 1.1, 0.5 + 0.5 * Math.sin(t * 1.6));
    const nl = { x0: 1140, x1: 1340, y: 380 }; panel(1100, 320, 260, 230, SEC, b);
    seg(nl.x0, nl.y, nl.x1, nl.y, CR, b * 0.7, 2.5);
    [[0, '0'], [X, 'x']].forEach(([v, s]) => { const px = lerp(nl.x0, nl.x1, v / X); seg(px, nl.y - 8, px, nl.y + 8, CR, b, 2.5); mathText(s, px, nl.y + 34, 22, CR, { align: 'center', alpha: b }); });
    glowDot(lerp(nl.x0, nl.x1, cxp / X), nl.y, 7, SEC, b); mathText('c', lerp(nl.x0, nl.x1, cxp / X), nl.y - 16, 22, SEC, { align: 'center', alpha: b });
    if (t > S('C09') - 0.1) {
      const q = ap(t, 'C09', 0.1);
      richReveal([['1 < 1 + c < 1 + x', SEC]], 1230, 465, 24, t, P('C09', 0.1), { upright: true });
      richReveal([['x/(1+x) < x/(1+c) < x', GOLD]], 1230, 515, 22, t, P('C09', 0.5), { upright: true });
      // 曲线之间的夹层高亮
      if (q > 0) { ctx.save(); gClip(GS); ctx.globalAlpha *= 0.18 * q; ctx.fillStyle = RED; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const x = 3 * i / 60; ctx.lineTo(gx(GS, x), gy(GS, x)); } for (let i = 60; i >= 0; i--) { const x = 3 * i / 60; ctx.lineTo(gx(GS, x), gy(GS, x / (1 + x))); } ctx.fill(); ctx.restore(); }
    }
  }
  // H01：混元的数值表
  if (t > S('H01') - 0.1) {
    const h = ap(t, 'H01', 0); panel(1100, 580, 260, 220, SQ.H.col, h);
    label('混元 · 逐行验算', 1230, 608, 20, SQ.H.col, h, { bold: true });
    [['x', CR], ['x/(1+x)', CYAN], ['ln(1+x)', RED], ['x', GOLD]].forEach(([s, c], j) => mathText(s, 1130 + j * 64, 648, 15, c, { align: 'center', alpha: h, upright: true }));
    ROWS.forEach(([x, l, m, r, f], i) => {
      const p = ap(t, 'H01', f); if (p <= 0) return; const y = 698 + i * 46;
      [[String(x), CR], [l, CYAN], [m, RED], [r, GOLD]].forEach(([s, c], j) => mathText(s, 1130 + j * 64, y, 20, c, { align: 'center', alpha: p, upright: true }));
      gV(GS, x, CR, p * 0.4, { ya: 0, yb: x, dash: [5, 6] }); [x / (1 + x), Math.log(1 + x), x].forEach((v, k) => gDot(GS, x, v, [CYAN, RED, GOLD][k], p));
    });
    if (t > S('H02')) checkMark(1310, 770, 30, GRN, t, P('H02', 0.3));
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 900, cy: 640, ux: 80, uy: 120, x0: -3.4, x1: 3.4, y0: -1.5, y1: 1.6 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.42, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 300);
  richReveal([['|sin b − sin a|', RED], ['  ?  ', CR], ['|b − a|', CYAN]], 880, 230, 40, t, P('C11', 0.1), { upright: true });
  const a = ap(t, 'C11', 0.3);
  gAxes(GQ, a, { grid: false }); gPlot(GQ, Math.sin, RED, { a });
  const xa = -0.5, xb = 1.4; gDot(GQ, xa, Math.sin(xa), CYAN, a); gDot(GQ, xb, Math.sin(xb), CYAN, a); gLine(GQ, (Math.sin(xb) - Math.sin(xa)) / (xb - xa), xa, Math.sin(xa), xa, xb, SEC, a, 3);
  if (t > S('D02')) {
    richReveal([["(sin x)' = cos x", GRN], ['，  |cos c| ≤ 1', GOLD]], 880, 860, 30, t, P('D02', 0.1), { upright: true });
    richReveal([['|sin b − sin a| ≤ |b − a|', GOLD]], 880, 300, 34, t, P('D02', 0.6), { upright: true });
    checkMark(1120, 290, 36, GRN, t, P('D02', 0.85));
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C12', 0) * fadeOut(t, S('C13'), 0.4);
  if (ga > 0) {
    ctx.save(); ctx.globalAlpha *= ga;
    slab("f' ≡ 0  ⇒  常数", 820, 400, 32, t, P('C12', 0.1), { bg: GRN, c: COL.ink, rot: 0 });
    slab("|f'| ≤ M  ⇒  |Δf| ≤ M|Δx|", 1080, 520, 32, t, P('C12', 0.5), { bg: GOLD, c: COL.ink, rot: 0 });
    ctx.restore();
  }
  if (t > S('C13') - 0.1) { glowText('下一段：单调、凹凸与拐点', CX, 500, 50, CR, t, P('C13', 0.15)); glowText('MiMo 客串', CX, 590, 32, SQ.T.col, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 4 章 · P4 恒等式与不等式', '下一段：单调、凹凸与拐点', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM4('混元')]);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i && b.b !== BLOCKS[i - 1].b) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.4, 'type', 0.16); s('C02', 0.15, 'type', 0.16); s('C02', 0.2, 'riser', 0.12); s('C02', 0.9, 'thud', 0.22);
  s('G01', 0.2, 'type', 0.16); s('G01', 0.45, 'whoosh', 0.18); s('G01', 0.9, 'ding', 0.22);
  s('C03', 0.2, 'type', 0.16); s('D01', 0.1, 'type', 0.16); s('D01', 0.6, 'shimmer', 0.18); s('C04', 0.2, 'pop', 0.22); s('C04', 0.7, 'check', 0.28);
  s('C05', 0.4, 'pop', 0.22); s('C05', 0.55, 'pop', 0.22); s('C05', 0.78, 'slam', 0.26);
  s('C06', 0.15, 'pluck', 0.2); s('C06', 0.2, 'type', 0.16); s('C06', 0.65, 'type', 0.16); s('G02', 0.15, 'ding_hi', 0.26);
  s('C07', 0.2, 'type', 0.16); s('C07', 0.4, 'riser', 0.12); s('C08', 0.3, 'type', 0.16); s('C09', 0.1, 'pluck', 0.2); s('C09', 0.5, 'shimmer', 0.2);
  ROWS.forEach(r => s('H01', r[4], 'click', 0.26)); s('H02', 0.3, 'check', 0.3);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.6, 'ding_hi', 0.28); s('D02', 0.85, 'check', 0.26);
  s('C12', 0.1, 'pop', 0.22); s('C12', 0.5, 'pop', 0.22); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
