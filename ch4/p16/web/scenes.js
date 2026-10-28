// 第 4 章 P16《原函数与不定积分》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A178 一族平行的原函数曲线，+C 平移，过 (3, 1) 的那条被选中 · A179 求导表 ↔ 积分表翻面 · A180 不定积分记号标注 · A181 a、v、s 逐层“往上积”
const SC = {};
const TITLES = [['anti', '原函数'], ['table', '积分公式表'], ['curve', '由斜率找曲线'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 原函数（A178 / A180） =======================
const GA = { cx: 990, cy: 650, ux: 150, uy: 25, x0: -2, x1: 2, y0: -6, y1: 14 };
SC.anti = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C03') - 0.1) {
    const a = ap(t, 'C02', 0);
    richReveal([["F′ = f  ⇒  F 是 f 的原函数", GOLD]], CX, 220, 32, t, P('C01', 0.4), { upright: true });
    gAxes(GA, a, { grid: false, xl: 'x' });
    gPlot(GA, x => 3 * x * x, SQ.H.col, { a, p: eIO(prog(t, P('C02', 0.5), 0.8)), w: 5 });
    label('3x²', gx(GA, 1.75), gy(GA, 3 * 1.75 * 1.75) - 16, 22, SQ.H.col, ap(t, 'C02', 0.6), { font: F_MATH });
    if (t > S('G01') - 0.1) {
      const g = ap(t, 'G01', 0);
      [1, -5, 4, -3, 7].forEach((c, i) => { const p = ap(t, 'G01', 0.05 + i * 0.1); gPlot(GA, x => 3 * x * x + c, i < 2 ? GOLD : hexA(SQ.H.col, 0.5), { a: p, w: i < 2 ? 3.5 : 2 }); });
      label('3x² + 1', gx(GA, -1.6), gy(GA, 3 * 2.56 + 1) - 20, 20, GOLD, ap(t, 'G01', 0.05), { font: F_MATH }); label('3x² − 5', gx(GA, 1.6), gy(GA, 3 * 2.56 - 5) + 24, 20, GOLD, ap(t, 'G01', 0.15), { font: F_MATH });
      if (t > P('G01', 0.6)) { const p = ap(t, 'G01', 0.6); arrowV(gx(GA, 0) + 40, gy(GA, -5) - 6, gy(GA, 1) + 6, GOLD, p); label('只差常数', gx(GA, 0) + 110, gy(GA, -2), 22, GOLD, p, { bold: true }); }
    }
    return;
  }
  // 记号标注（A180）
  const y = 470;
  richReveal([['∫', GOLD], [' f(x) ', CYAN], ['dx', CR], [' = ', CR], ['F(x)', SQ.H.col], [' + ', CR], ['C', GRN]], CX, y, 64, t, P('C03', 0.05), { upright: true });
  const L3 = [[CX - 205, '积分号', GOLD, 0.35, -1], [CX - 105, '被积函数', CYAN, 0.55, 1], [CX + 225, '积分常数', GRN, 0.8, -1]];
  L3.forEach(([x, s, c, f, dir]) => { const p = ap(t, 'C03', f); if (p <= 0) return; const y1 = y + dir * 60, y2 = y + dir * 120; seg(x, y1, x, y2, c, p, 2); label(s, x, y2 + dir * 24, 24, c, p, { bold: true }); });
  label('不定积分', CX, 260, 30, CR, ap(t, 'C03', 0.1), { bold: true });
};

// ======================= 积分表翻面（A179） =======================
const ROWS = [["(xⁿ⁺¹/(n+1))′ = xⁿ", "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C"], ["(ln|x|)′ = 1/x", "∫ 1/x dx = ln|x| + C"], ["(eˣ)′ = eˣ", "∫ eˣ dx = eˣ + C"], ["(−cos x)′ = sin x", "∫ sin x dx = −cos x + C"], ["(sin x)′ = cos x", "∫ cos x dx = sin x + C"], ["(arctan x)′ = 1/(1+x²)", "∫ 1/(1+x²) dx = arctan x + C"], ["(arcsin x)′ = 1/√(1−x²)", "∫ 1/√(1−x²) dx = arcsin x + C"]];
SC.table = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'H01', 0);
  const fl = prog(t, P('H01', 0.35), 0.8), sx = Math.abs(Math.cos(fl * Math.PI)), back = fl > 0.5;
  label(back ? '积分公式表' : '求导表（第 3 章）', CX, 210, 28, back ? SQ.H.col : CYAN, a, { bold: true });
  ctx.save(); ctx.translate(CX, 0); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-CX, 0);
  panel(660, 240, 680, 540, back ? SQ.H.col : CYAN, a * 0.8);
  ROWS.forEach(([d, i], k) => {
    const y = 290 + k * 68, hi = (k === 0 && ap(t, 'C04', 0.05) > 0 && t < P('C04', 0.4)) || (k === 1 && t > P('C04', 0.4) && t < P('C04', 0.65)) || ((k === 3 || k === 4) && t > P('C04', 0.65) && t < S('C05')) || ((k === 5 || k === 6) && t > S('C05'));
    mathText(back ? i : d, CX, y, 26, hi ? GOLD : (back ? SQ.H.col : CYAN), { align: 'center', alpha: a, upright: true, glow: hi ? 14 : 4 });
    if (back && ap(t, 'H01', 0.6 + k * 0.05) > 0 && !hi) checkMark(1300, y, 12, GRN, t, P('H01', 0.6 + k * 0.05), 0.8);
  });
  ctx.restore();
  if (t > S('C05') - 0.1) {
    const c = ap(t, 'C05', 0); panel(640, 800, 720, 90, GOLD, c);
    richReveal([['∫ (3/(1+x²) − 2/√(1−x²)) dx = ', CR], ['3 arctan x − 2 arcsin x + C', GOLD]], CX, 845, 24, t, P('C05', 0.3), { upright: true });
  }
};

// ======================= 斜率找曲线 + a/v/s（A178 / A181） =======================
const GC = { cx: 990, cy: 540, ux: 85, uy: 24, x0: -4, x1: 4, y0: -10, y1: 10 };
SC.curve = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('H02') - 0.1) {
    const a = ap(t, 'G02', 0);
    richReveal([["y′ = 2x,  过 (3, 1)", CR]], CX, 225, 30, t, P('G02', 0.05), { upright: true });
    gAxes(GC, a, { grid: false, ticks: { x: [[3, '3']], y: [[1, '1']] }, xl: 'x' });
    const C = lerp(4, -8, eIO(prog(t, P('G02', 0.4), 1.6)));
    [-6, -2, 2, 6].forEach(c => gPlot(GC, x => x * x + c, hexA(SQ.H.col, 0.35), { a, w: 2 }));
    gPlot(GC, x => x * x + C, GOLD, { a, w: 4.5 });
    gDot(GC, 3, 1, RED, a); label('(3, 1)', gx(GC, 3) + 50, gy(GC, 1), 22, RED, a, { font: F_MATH });
    label(`C = ${C.toFixed(1)}`, 1250, 330, 24, GOLD, a, { font: F_MATH });
    if (t > P('G02', 0.8)) { richReveal([['y = x^2 − 8', GOLD]], 1180, 400, 32, t, P('G02', 0.8), { upright: true }); checkMark(gx(GC, 3) + 20, gy(GC, 1) - 30, 16, GRN, t, P('G02', 0.85)); }
    return;
  }
  if (t < S('C06') - 0.1) {
    const PN = [['a = 9.8', t2 => 9.8, CYAN, 0.1, 12], ['v = 9.8t + 1', t2 => 9.8 * t2 + 1, GRN, 0.3, 22], ['s = 4.9t² + t', t2 => 4.9 * t2 * t2 + t2, GOLD, 0.5, 22]];
    PN.forEach(([s, f, c, k, ym], i) => {
      const p = ap(t, 'H02', k); if (p <= 0) return; const x0 = 640 + i * 245;
      const G = { cx: x0 + 20, cy: 700, ux: 90, uy: 300 / ym, x0: 0, x1: 2, y0: 0, y1: ym };
      panel(x0, 340, 220, 400, c, p * 0.6); gAxes(G, p, { grid: false, xl: 't' }); gPlot(G, f, c, { a: p, p: eIO(prog(t, P('H02', k), 0.8)) });
      mathText(s, x0 + 110, 380, 22, c, { align: 'center', alpha: p, upright: true });
      if (i) { const q = ap(t, 'H02', k); arrowH(x0 - 22, x0 - 4, 540, CR, q); label('积', x0 - 13, 510, 18, CR, q); }
    });
    label('一层层往上积', CX, 800, 26, SQ.H.col, ap(t, 'H02', 0.7), { bold: true });
    return;
  }
  glowText('原函数  ⟷  面积？', CX, 470, 52, GOLD, t, P('C06', 0.1));
  glowText('第 5 章：微积分基本定理', CX, 570, 34, CR, t, P('C06', 0.45), { bold: false });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['f(x) = 3x^2,   F(0) = 1', RED]], 860, 300, 40, t, P('C08', 0.1), { upright: true });
  richReveal([['F(x) = ？', CR]], 860, 380, 36, t, P('C08', 0.5), { upright: true });
  if (t > S('D01')) { richReveal([['x^3 + C,   C = 1', CYAN]], 900, 500, 36, t, P('D01', 0.1), { upright: true }); richReveal([['F(x) = ', CR], ['x^3 + 1', GOLD]], 900, 610, 48, t, P('D01', 0.6), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['原函数：只差常数 C', GOLD]], CX, 420, 42, t, P('C09', 0.15), { upright: true, alpha: ga }); richReveal([['求导表 ⟲ 积分表', SQ.H.col]], CX, 530, 38, t, P('C09', 0.6), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：第 4 章收束 · 出口票', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('Grok 主持', CX, 590, 32, SQ.X.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 4 章 · P16 原函数与不定积分', '下一段：出口票', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM4('混元')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.4, 'type', 0.16); s('C02', 0.5, 'whoosh', 0.16); [0, 1, 2, 3, 4].forEach(i => s('G01', 0.05 + i * 0.1, 'pluck', 0.14)); s('G01', 0.6, 'ding', 0.2);
  s('C03', 0.05, 'slam', 0.22); [0.35, 0.55, 0.8].forEach(f => s('C03', f, 'pop', 0.18));
  s('H01', 0.35, 'warp', 0.2); ROWS.forEach((r, k) => s('H01', 0.6 + k * 0.05, 'check', 0.1)); s('C04', 0.05, 'click', 0.16); s('C04', 0.4, 'click', 0.16); s('C04', 0.65, 'click', 0.16); s('C05', 0.3, 'type', 0.14); s('C05', 0.8, 'ding_hi', 0.24);
  s('G02', 0.05, 'type', 0.14); s('G02', 0.4, 'hum', 0.14); s('G02', 0.8, 'ding_hi', 0.26);
  [0.1, 0.3, 0.5].forEach(f => s('H02', f, 'swoosh_in', 0.18)); s('C06', 0.1, 'swell', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'type', 0.14); s('D01', 0.6, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C09', 0.6, 'shimmer', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
