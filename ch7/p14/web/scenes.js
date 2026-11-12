// 第 7 章 P14《反常积分进阶：比较判别法》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.8 例 9、例 10。
// A332 两条曲线一上一下、面积计数器 · A333 方向箭头 ✓/✗ · A334 钟形曲线面积收敛到 √π/2
const SC = {};
const TITLES = [['rule', '比较判别法'], ['gauss', '高斯积分'], ['div', '发散的例子'], ['quiz', '随堂一题'], ['outro', '小结']];

// 规则卡：上下两行，大 f / 小 g
function ruleCard(t, t0, a0 = 1, y0 = 260) {
  const a = clamp(prog(t, t0, 0.3)) * a0; if (a <= 0) return;
  darkBox(540, y0, 660, 210, a);
  mathText('0 ≤ g(x) ≤ f(x)', 870, y0 + 50, 28, CR, { align: 'center', alpha: a, upright: true });
  richReveal([['∫ f 收敛', GOLD], ['  ⇒  ', CR], ['∫ g 收敛', GOLD]], 870, y0 + 110, 28, t, t0 + 0.6, { upright: true, alpha: a0 });
  richReveal([['∫ g 发散', RED], ['  ⇒  ', CR], ['∫ f 发散', RED]], 870, y0 + 170, 28, t, t0 + 1.2, { upright: true, alpha: a0 });
}

// ======================= 规则 + 标尺（A332） =======================
const GK = { cx: 470, cy: 720, ux: 120, uy: 200, x0: 0.6, x1: 6, y0: -0.05, y1: 1.2 };
SC.rule = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C02')) { kinetic('算不出 → 比一比', 860, 420, 54, t, P('C01', 0.3), { col: GOLD }); return; }
  ruleCard(t, P('C02', 0.05), fadeOut(t, S('K01'), 0.3));
  if (t > S('K01')) {
    const a = ap(t, 'K01', 0.05); seg(gx(GK, 0.8), gy(GK, 0), gx(GK, 5.8), gy(GK, 0), CR, a * 0.6, 2);
    [[0.5, '#8FA3C8', 'p = ½  发散'], [1, RED, 'p = 1  发散'], [2, GRN, 'p = 2  收敛']].forEach(([p, c, s], k) => { const q = ap(t, 'K01', 0.2 + 0.15 * k); gPlot(GK, x => x ** -p, c, { a: q, xa: 1, xb: 5.8, w: 3 }); label(s, 1000, 380 + k * 40, 22, c, q, { bold: true }); });
    mathText('∫₁^∞ dx / xᵖ', 860, 280, 32, SQ.K.col, { align: 'center', alpha: a, upright: true });
  }
};

// ======================= 高斯（A332 + A334） =======================
const GG = { cx: 560, cy: 700, ux: 150, uy: 330, x0: -0.05, x1: 4.2, y0: -0.05, y1: 1.12 };
SC.gauss = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0.05); seg(gx(GG, 0), gy(GG, 0), gx(GG, 4.1), gy(GG, 0), CR, a * 0.6, 2); seg(gx(GG, 0), gy(GG, 0), gx(GG, 0), gy(GG, 1.1), CR, a * 0.6, 2);
  gPlot(GG, x => Math.exp(-x * x), CYAN, { a, xa: 0, xb: 4, w: 4 });
  gPlot(GG, x => Math.exp(-x), GOLD, { a: a * ap(t, 'C03', 0.4), xa: 1, xb: 4, w: 3 });
  seg(gx(GG, 1), gy(GG, 0), gx(GG, 1), gy(GG, 1), CR, a * 0.4, 1.5); label('1', gx(GG, 1), gy(GG, 0) + 22, 20, CR, a, {});
  mathText('e^{−x²}', gx(GG, 0.55) + 10, gy(GG, 0.78), 24, CYAN, { alpha: a, upright: true }); mathText('e^{−x}', gx(GG, 1.9), gy(GG, 0.25) - 16, 24, GOLD, { alpha: a * ap(t, 'C03', 0.4), upright: true });
  richReveal([['[1, ∞)：  x² ≥ x  ⇒  ', CR], ['e^{−x²} ≤ e^{−x}', GOLD]], 860, 260, 26, t, P('C03', 0.3), { upright: true, alpha: fadeOut(t, S('G01'), 0.3) });
  if (t > S('C04')) {
    gBetween(GG, x => Math.exp(-x), () => 0, 1, 4, ap(t, 'C04', 0.05) * fadeOut(t, S('G01'), 0.3), { col: 'rgba(255,200,60,0.25)' });
    richReveal([['∫₁^∞ e^{−x} dx = 1/e', GOLD], ['  收敛 ⇒ 小的也收敛 ', CR], ['✓', GRN]], 860, 330, 24, t, P('C04', 0.2), { upright: true, alpha: fadeOut(t, S('G01'), 0.3) });
  }
  if (t > S('G01')) {
    const xe = 0.01 + 3.99 * eIO(prog(t, P('G01', 0.05), 1.8)); let v = 0; const n = 80; for (let i = 0; i < n; i++) { const u = (i + 0.5) * xe / n; v += Math.exp(-u * u) * xe / n; }
    gBetween(GG, x => Math.exp(-x * x), () => 0, 0, xe, ap(t, 'G01', 0.05), { col: 'rgba(92,200,232,0.35)' });
    mathText(`面积 → ${v.toFixed(4)}`, 1080, 300, 30, CR, { align: 'center', alpha: ap(t, 'G01', 0.05), upright: true });
    goldBox(1080, 380, 300, 64, '√π / 2 ≈ 0.8862', 28, ap(t, 'G01', 0.6));
  }
};

// ======================= 发散 + 方向（A333） =======================
SC.div = t => {
  starfield(t); blueprint(0.35, 80);
  const f2 = fadeOut(t, S('G02'), 0.3);
  if (f2 > 0) {
    const a = ap(t, 'C05', 0.05) * f2; seg(gx(GK, 0.8), gy(GK, 0), gx(GK, 5.8), gy(GK, 0), CR, a * 0.6, 2);
    gPlot(GK, x => (1 + Math.exp(-x)) / x, GOLD, { a, xa: 1, xb: 5.8, w: 4 }); gPlot(GK, x => 1 / x, RED, { a: a * ap(t, 'C05', 0.4), xa: 1, xb: 5.8, w: 3 });
    gBetween(GK, x => 1 / x, () => 0, 1, 5.8, a * ap(t, 'C05', 0.5), { col: 'rgba(255,90,90,0.18)' });
    mathText('(1 + e^{−x}) / x', 860, 280, 30, GOLD, { align: 'center', alpha: a, upright: true });
    label('> 1/x', 1100, 280, 26, RED, a * ap(t, 'C05', 0.4), { bold: true });
    if (t > S('K02')) stampMark(1040, 480, 56, t, P('K02', 0.2), { text: 'p = 1 发散', col: RED, rot: -0.1 });
  }
  if (t > S('G02')) {
    const rows = [['大 收敛 ⇒ 小 收敛', GRN, 1], ['小 发散 ⇒ 大 发散', GRN, 1], ['小 收敛 ⇒ 大 收敛 ？', RED, 0], ['大 发散 ⇒ 小 发散 ？', RED, 0]];
    rows.forEach(([s, c, ok], k) => { const y = 300 + k * 100, f = 0.05 + 0.2 * k, q = ap(t, 'G02', f); label(s, 830, y, 30, c, q, { bold: true }); (ok ? checkMark : crossMark)(1110, y, 18, c, t, P('G02', f + 0.1)); });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 500, 100, '', '∫₁^∞ dx / (x² + 1) = ？', t, P('C07', 0.05), { size: 34 });
  if (t > S('K03')) {
    richReveal([['1/(x² + 1) < 1/x²', CR], ['  收敛', GRN]], 820, 530, 30, t, P('K03', 0.05), { upright: true });
    richReveal([['π/2 − π/4 = ', CR], ['π/4', GOLD]], 820, 620, 36, t, P('K03', 0.5), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { ruleCard(t, P('C08', 0.02) - 1.2, fa, 300); }
  if (t > S('C09') - 0.1) { glowText('下一段：擂台决赛 · 全章收束', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('Grok：这是真的吗？', CX, 610, 32, SQ.X.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P14 比较判别法', '下一段：收束', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM7('Kimi')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.3, 'pop', 0.2); s('C02', 0.05, 'pop', 0.16); sfx(P('C02', 0.05) + 0.6, 'ding', 0.16); sfx(P('C02', 0.05) + 1.2, 'ding', 0.16); [0.2, 0.35, 0.5].forEach(f => s('K01', f, 'marimba', 0.13));
  s('C03', 0.4, 'swell', 0.14); s('C04', 0.2, 'check', 0.22); s('G01', 0.05, 'riser', 0.14); s('G01', 0.6, 'ding_hi', 0.26);
  s('C05', 0.4, 'pop', 0.16); s('K02', 0.2, 'stamp', 0.26); [0, 1, 2, 3].forEach(k => s('G02', 0.15 + 0.2 * k, k < 2 ? 'check' : 'buzz', 0.18));
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('K03', 0.5, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
