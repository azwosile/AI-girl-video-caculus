// 第 10 章 P6《Bézier 曲线：字体的秘密》（2026-11-13）：数学画面全部原创 Canvas 绘制；字形轮廓取自得意黑（SIL OFL 1.1）控制点。Stewart 10.2 实验课。
// A452 二次 Bézier 的 de Casteljau 作图（t 滑动） · A453 三次 Bézier 例题 B(1/2) = (2, 3/2) · A454 拖动“鲸”字一段曲线的控制点，笔画实时变形
const SC = {};
const TITLES = [['quad', '二次 Bézier'], ['cubic', '三次 Bézier'], ['edit', '改字'], ['quiz', '随堂一题'], ['outro', '小结']];
const QP6 = [[690, 760], [900, 330], [1250, 720]];

// ======================= 二次（A452） =======================
SC.quad = t => {
  starfield(t); blueprint(0.3, 80);
  const glyph = t > S('N02') - 0.1, a = ap(t, 'N01', 0) * (glyph ? fadeOut(t, S('N02') - 0.1, 0.4) : 1);
  if (a > 0) {
    const ts = t > S('C02') ? 0.5 - 0.5 * Math.cos((t - S('C02')) * 1.3) : null;
    bezierCast(QP6, SQ.N.col, { a, p: t > S('C01') ? prog(t, P('C01', 0.3), 1.2) : 0, cast: ts, names: ['P₀', 'P₁', 'P₂'], ndy: [36, -30, 36] });
    if (ts != null) label(`t = ${ts.toFixed(2)}`, 1250, 330, 28, GOLD, a, { bold: true });
    if (t > S('C01')) richReveal([['B(t) = (1 − t)²', CR], ['P₀', INV], [' + 2t(1 − t)', CR], ['P₁', INV], [' + t²', CR], ['P₂', INV]], 980, 230, 32, t, P('C01', 0.1), { upright: true, alpha: a });
    if (t > S('C03')) { const k = ap(t, 'C03', 0.3); arrow(QP6[0][0], QP6[0][1], lerp(QP6[0][0], QP6[1][0], 0.55), lerp(QP6[0][1], QP6[1][1], 0.55), GRN, k * a, 5); label('起点切线 → P₁', 640, 520, 26, GRN, k * a, { bold: true }); }
  }
  if (glyph) { const k = ap(t, 'N02', 0); glyphDraw('线', 760, 830, 0.62, { a: k, fill: CR, fillA: 0.12, stroke: CYAN, hiCurve: GOLD, ctrl: true, ctrlA: ap(t, 'N02', 0.3), w: 3 });
    label('二次曲线 × 53', 1300, 360, 28, GOLD, ap(t, 'N02', 0.3), { bold: true }); label('直线 × 25', 1300, 410, 28, CYAN, ap(t, 'N02', 0.4), { bold: true }); }
};

// ======================= 三次（A453） =======================
const GB6 = { cx: 700, cy: 760, ux: 130, uy: 130, x0: -0.3, x1: 4.6, y0: -0.3, y1: 2.6 };
const CP6 = [[0, 0], [1, 2], [3, 2], [4, 0]];
SC.cubic = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C04', 0), px = CP6.map(([x, y]) => [gx(GB6, x), gy(GB6, y)]);
  if (t > S('G01')) gAxes(GB6, ap(t, 'G01', 0) * 0.55, { grid: true, ticks: { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], y: [[1, '1'], [2, '2']] } });
  const ts = t > S('G01') ? lerp(0.15, 0.5, eIO(prog(t, P('G01', 0.4), 1))) : 0.5 - 0.5 * Math.cos((t - S('C04')) * 1.2);
  bezierCast(px, SQ.N.col, { a, p: prog(t, P('C04', 0.2), 1.2), cast: ts, names: ['P₀', 'P₁', 'P₂', 'P₃'], ndy: [36, -30, -30, 36] });
  if (t > S('C05')) richReveal([['(1 − t)³', CR], ['P₀', INV], [' + 3t(1 − t)²', CR], ['P₁', INV], [' + 3t²(1 − t)', CR], ['P₂', INV], [' + t³', CR], ['P₃', INV]], 980, 230, 28, t, P('C05', 0.05), { upright: true });
  if (t > S('C05')) label('系数 1 · 3 · 3 · 1', 1250, 300, 26, GOLD, ap(t, 'C05', 0.5), { bold: true });
  if (t > S('G01')) { const k = ap(t, 'G01', 0.75); goldBox(1220, 420, 250, 66, 'B(1/2) = (2, 3/2)', 28, k); label('(2, 1.5)', gx(GB6, 2) + 70, gy(GB6, 1.5) + 30, 24, GOLD, k, { bold: true }); }
};

// ======================= 改字（A454） =======================
const SJ6 = glyphSegs('鲸').map(s => ({ c: s.c, L: s.L && s.L.map(p => p.slice()), Q: s.Q && s.Q.map(p => p.slice()) }));
const IJ6 = (() => { let best = -1, bi = 0; SJ6.forEach((s, i) => { if (!s.Q) return; const [p0, c, p1] = s.Q, d = Math.hypot(c[0] - (p0[0] + p1[0]) / 2, c[1] - (p0[1] + p1[1]) / 2) + Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * 0.3; if (d > best) { best = d; bi = i; } }); return bi; })();
function drawJ6(x, y, s, off, a, hi) {
  const S = SJ6.map((sg, i) => i === IJ6 ? { c: sg.c, Q: [sg.Q[0], [sg.Q[1][0] + off[0], sg.Q[1][1] + off[1]], sg.Q[2]] } : sg), X = v => x + v[0] * s, Y = v => y - v[1] * s;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(CR, 0.85); ctx.beginPath(); let lc = -1;
  S.forEach(sg => { const P = sg.L || sg.Q; if (sg.c !== lc) { if (lc >= 0) ctx.closePath(); ctx.moveTo(X(P[0]), Y(P[0])); lc = sg.c; } if (sg.L) ctx.lineTo(X(P[1]), Y(P[1])); else ctx.quadraticCurveTo(X(P[1]), Y(P[1]), X(P[2]), Y(P[2])); });
  ctx.closePath(); ctx.fill('nonzero'); ctx.restore();
  if (hi > 0) { const [p0, c, p1] = S[IJ6].Q; glowPath(() => { ctx.moveTo(X(p0), Y(p0)); ctx.quadraticCurveTo(X(c), Y(c), X(p1), Y(p1)); }, GOLD, 4, hi);
    ctx.save(); ctx.globalAlpha *= hi; ctx.setLineDash([6, 6]); ctx.strokeStyle = INV; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(p0), Y(p0)); ctx.lineTo(X(c), Y(c)); ctx.lineTo(X(p1), Y(p1)); ctx.stroke(); ctx.restore();
    glowDot(X(c), Y(c), 10, INV, hi); [p0, p1].forEach(p => { ctx.save(); ctx.globalAlpha *= hi; ctx.fillStyle = CR; ctx.fillRect(X(p) - 6, Y(p) - 6, 12, 12); ctx.restore(); }); return [X(c), Y(c)]; }
}
SC.edit = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'D01', 0), d = t > P('D01', 0.4) ? eIO(prog(t, P('D01', 0.4), 1.2)) : 0, wob = t > S('C06') ? Math.sin((t - S('C06')) * 1.6) : 0;
  const off = [ -140 * d + 90 * wob, 160 * d - 60 * wob ];
  const hand = drawJ6(620, 840, 0.66, off, a, ap(t, 'D01', 0.2));
  if (hand && t > P('D01', 0.3)) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#16130F'; ctx.lineWidth = 2; ctx.beginPath(); const [hx, hy] = hand; ctx.moveTo(hx + 4, hy + 4); ctx.lineTo(hx + 4, hy + 34); ctx.lineTo(hx + 12, hy + 26); ctx.lineTo(hx + 20, hy + 40); ctx.lineTo(hx + 26, hy + 37); ctx.lineTo(hx + 18, hy + 23); ctx.lineTo(hx + 29, hy + 22); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
  if (t > S('C06')) { const k = ap(t, 'C06', 0.2);
    panel(1180, 330, 200, 290, GRN, k * 0.8); label('接缝光滑', 1280, 360, 26, GRN, k, { bold: true });
    bezierCast([[1200, 580], [1215, 450], [1280, 470]], GOLD, { a: k, poly: true, names: null }); bezierCast([[1280, 470], [1345, 490], [1360, 400]], CYAN, { a: k, poly: true });
    seg(1215, 450, 1345, 490, GRN, k * 0.9, 2.5, [6, 5]); label('把手共线', 1280, 600, 22, GRN, k, { bold: true }); }
  if (t > S('D02')) stampMark(1280, 720, 44, t, P('D02', 0.2), { text: '变弯了', col: GOLD, rot: -0.12 });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['t = 0：', CR], ['B(0) = ？', GOLD]], 880, 240, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.2), Ps = [[680, 760], [800, 380], [1050, 400], [1180, 740]];
  bezierCast(Ps, SQ.N.col, { a, names: ['P₀', 'P₁', 'P₂', 'P₃'], ndy: [36, -30, -30, 36], cast: t > S('D03') ? 0 : null });
  if (t > S('D03')) { const k = ap(t, 'D03', 0.2); glowDot(680, 760, 16, GOLD, k); label('起点 P₀', 680, 820, 30, GOLD, k, { bold: true }); checkMark(1300, 520, 22, GRN, t, P('D03', 0.5)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) {
    richReveal([['几个控制点', INV], [' → ', CR], ['光滑曲线', GOLD]], CX, 330, 48, t, P('C09', 0.05), { upright: true, alpha: ga });
    glyphDraw('曲', 760, 640, 0.18, { a: ga * ap(t, 'C09', 0.4), fill: CR, fillA: 0.8 }); glyphDraw('线', 920, 640, 0.18, { a: ga * ap(t, 'C09', 0.45), fill: CR, fillA: 0.8 });
    label('字体 · 矢量图 · 动画路径', 1180, 580, 26, CYAN, ga * ap(t, 'C09', 0.6), { bold: true });
  }
  if (t > S('C10') - 0.1) { glowText('下一段：极坐标', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Kimi：方向 + 距离', CX, 610, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 10 章 · P6 Bézier 曲线', '下一段：极坐标', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), '字形轮廓：得意黑 Smiley Sans（atelier-anchor，SIL OFL 1.1），仅读取控制点作图。', ...CREDIT_END, CREDIT_TM10('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.05, 'click', 0.18); s('C01', 0.1, 'pop', 0.16); s('C01', 0.3, 'swell', 0.14); s('C02', 0.05, 'pluck', 0.18); s('C03', 0.3, 'zap', 0.16); s('N02', 0.0, 'shimmer', 0.2); s('N02', 0.3, 'ding', 0.18);
  s('C04', 0.2, 'swell', 0.14); s('C05', 0.05, 'pop', 0.16); s('C05', 0.5, 'marimba', 0.14); s('G01', 0.0, 'pop', 0.14); s('G01', 0.75, 'ding_hi', 0.24);
  s('D01', 0.1, 'sparkle', 0.18); s('D01', 0.4, 'whoosh', 0.14); s('C06', 0.2, 'pop', 0.16); s('D02', 0.2, 'stamp', 0.26);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.2, 'ding_hi', 0.26); s('D03', 0.5, 'check', 0.22);
  s('C09', 0.05, 'pop', 0.2); s('C09', 0.4, 'pop', 0.16); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
