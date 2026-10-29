// 第 5 章 P11《换元法：凑微分》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A224 链式法则与换元的双向箭头 · A225 g′(x) dx 高亮“凑”成 du · A226 u 的替换动画 · A227 求导验算
const SC = {};
const TITLES = [['hook', '找伏笔'], ['rule', '链式法则倒过来'], ['ex', '凑微分'], ['more', '再练两个'], ['quiz', '随堂一题'], ['outro', '小结']];
// 交叉淡变：两段文字在同一位置互换
function morph(partsA, partsB, x, y, size, p, o = {}) {
  if (p < 1) richReveal(partsA, x, y, size, 1e9, 0, { upright: true, alpha: 1 - p, ...o });
  if (p > 0) richReveal(partsB, x, y + (1 - p) * 14, size, 1e9, 0, { upright: true, alpha: p, ...o });
}
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'K01', 0);
  panel(600, 260, 370, 460, SQ.K.col, a); panel(990, 260, 370, 460, SQ.K.col, a);
  for (let k = 0; k < 7; k++) { seg(640, 330 + k * 52, 930, 330 + k * 52, hexA(CR, 0.18), a, 6); if (k !== 3) seg(1030, 330 + k * 52, 1320, 330 + k * 52, hexA(CR, 0.18), a, 6); }
  richReveal([['∫ ', CR], ['2x', GOLD], [' √(1 + x²) dx', CR]], 1175, 486, 34, t, P('K01', 0.3), { upright: true });
  const h = ap(t, 'K01', 0.55); if (h > 0) { ctx.save(); ctx.globalAlpha = h * (0.6 + 0.4 * Math.sin(t * 5)); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; const w0 = mathW('∫ ', 34), w1 = mathW('2x', 34), wt = w0 + w1 + mathW(' √(1 + x²) dx', 34), hx = 1175 - wt / 2 + w0; ctx.strokeRect(hx - 8, 456, w1 + 16, 50); ctx.restore(); label('伏笔', hx + w1 / 2, 560, 30, GOLD, h, { bold: true }); }
};
SC.rule = t => {
  starfield(t); blueprint(0.4, 80);
  panel(560, 240, 900, 110, CYAN, ap(t, 'C01', 0)); label('链式法则', 650, 295, 24, CYAN, ap(t, 'C01', 0), { bold: true });
  richReveal([['d/dx F(g(x)) = F′(g(x)) · g′(x)', CR]], 1060, 295, 30, t, P('C01', 0.05), { upright: true });
  const ar = ap(t, 'C01', 0.3); arrowV && arrowV(CX - 30, 370, 450, GOLD, ar); arrowV && arrowV(CX + 30, 450, 370, GOLD, ar);
  panel(560, 470, 900, 110, GOLD, ap(t, 'C01', 0.4)); label('换元', 650, 525, 24, GOLD, ap(t, 'C01', 0.4), { bold: true });
  const p = t < S('C02') ? 0 : eIO(prog(t, P('C02', 0.4), 0.8));
  morph([['∫ f(g(x)) ', CR], ["g′(x) dx", GOLD]], [['∫ f(u) ', CR], ['du', GOLD]], 1060, 525, 32, p);
  if (t > S('C01') && p === 0) label('u = g(x)', 1060, 620, 26, CYAN, ap(t, 'C01', 0.6), { bold: true });
  if (t > S('C02') - 0.1) { const b = ap(t, 'C02', 0.1); ctx.save(); ctx.globalAlpha = b * (1 - p) * (0.6 + 0.4 * Math.sin(t * 6)); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; { const w1 = mathW('∫ f(g(x)) ', 32), w2 = mathW('g′(x) dx', 32), x0 = 1060 - (w1 + w2) / 2; ctx.strokeRect(x0 + w1 - 8, 492, w2 + 16, 50); } ctx.restore(); richReveal([["du = g′(x) dx", GOLD]], CX, 680, 38, t, P('C02', 0.15), { upright: true }); }
};
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  const p = t < S('C03') ? 0 : eIO(prog(t, P('C03', 0.1), 0.9));
  morph([['∫ ', CR], ['2x', GOLD], [' √(', CR], ['1 + x²', CYAN], [') ', CR], ['dx', GOLD]], [['∫ √', CR], ['u', CYAN], [' ', CR], ['du', GOLD]], CX, 280, 44, p);
  if (t > S('K02') && t < S('C03') + 0.3) label('2x = (1 + x²)′', CX, 350, 28, GOLD, ap(t, 'K02', 0.5) * fadeOut(t, S('C03'), 0.3), { bold: true });
  if (t > S('C03') - 0.1) {
    richReveal([['u = 1 + x²', CYAN], ['     du = 2x dx', GOLD]], CX, 370, 28, t, P('C03', 0.05), { upright: true });
    richReveal([['= (2/3) u^(3/2) + C', CR]], CX, 460, 36, t, P('C03', 0.45), { upright: true });
    richReveal([['= (2/3)(1 + x²)^(3/2) + C', GOLD]], CX, 540, 38, t, P('C03', 0.75), { upright: true });
  }
  if (t > S('G01') - 0.1) { panel(600, 610, 820, 100, GRN, ap(t, 'G01', 0)); richReveal([["d/dx：(2/3)·(3/2)(1 + x²)^(1/2)·2x = 2x√(1 + x²)", CR]], CX, 660, 26, t, P('G01', 0.1), { upright: true }); checkMark(1390, 660, 18, GRN, t, P('G01', 0.8)); }
};
SC.more = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['∫ ', CR], ['x³', GOLD], [' cos(', CR], ['x⁴ + 2', CYAN], [') dx', CR]], CX, 280, 38, t, P('C04', 0.05), { upright: true });
  richReveal([['u = x⁴ + 2，du = 4x³ dx  ⇒  ', CR], ['(1/4) sin(x⁴ + 2) + C', GOLD]], CX, 350, 28, t, P('C04', 0.5), { upright: true });
  if (t > S('C05') - 0.1) { richReveal([['∫ tan x dx = ∫ ', CR], ['sin x', GOLD], [' / ', CR], ['cos x', CYAN], [' dx', CR]], CX, 470, 38, t, P('C05', 0.05), { upright: true }); richReveal([['u = cos x，du = −sin x dx  ⇒  ', CR], ['−ln|cos x| + C', GOLD]], CX, 540, 28, t, P('C05', 0.45), { upright: true }); }
  if (t > S('K03') - 0.1) { panel(700, 640, 560, 100, SQ.K.col, ap(t, 'K03', 0)); label('同济：第一类换元法（凑微分）', CX, 690, 28, SQ.K.col, ap(t, 'K03', 0.1), { bold: true }); }
};
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫ e^(3x) dx = ？', CR]], 820, 360, 48, t, P('C07', 0.1), { upright: true });
  if (t > S('D01')) { richReveal([['u = 3x，du = 3 dx', CYAN]], 820, 460, 30, t, P('D01', 0.05), { upright: true }); richReveal([['= ', CR], ['e^(3x)/3 + C', GOLD]], 820, 550, 48, t, P('D01', 0.4), { upright: true }); }
};
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['∫ f(g(x)) g′(x) dx = ∫ f(u) du', GOLD]], CX, 400, 46, t, P('C08', 0.1), { upright: true, alpha: ga }); richReveal([['找里层 → 凑 du → 换回 x', CYAN]], CX, 490, 34, t, P('C08', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：定积分换元与对称性', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('GLM：换了货币要换价签', CX, 590, 32, SQ.Z.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 5 章 · P11 换元法：凑微分', '下一段：定积分换元与对称性', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM5('Kimi')]);
};
SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.05, 'swoosh_soft', 0.16); s('K01', 0.3, 'type', 0.12); s('K01', 0.55, 'shimmer', 0.2);
  s('C01', 0.05, 'type', 0.12); s('C01', 0.3, 'whoosh', 0.14); s('C02', 0.15, 'type', 0.12); s('C02', 0.4, 'warp', 0.2); s('C02', 0.7, 'ding', 0.2);
  s('K02', 0.5, 'pop', 0.16); s('C03', 0.1, 'warp', 0.2); s('C03', 0.45, 'type', 0.12); s('C03', 0.75, 'ding_hi', 0.24); s('G01', 0.1, 'type', 0.12); s('G01', 0.8, 'check', 0.26);
  s('C04', 0.05, 'type', 0.12); s('C04', 0.5, 'ding', 0.2); s('C05', 0.05, 'type', 0.12); s('C05', 0.45, 'ding', 0.2); s('K03', 0.1, 'pop', 0.18);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.4, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
