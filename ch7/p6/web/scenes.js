// 第 7 章 P6《三角代换进阶与配方》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.3 例 3、例 7。
// A308 直角三角形标 x、2、√(x²+4) · A309 抛物线配方平移 · A310 回代动画
const SC = {};
const TITLES = [['tan', 'x = 2 tan θ'], ['back', '三角形换回'], ['square', '先配方修路'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= tan 代换 =======================
SC.tan = t => {
  starfield(t); blueprint(0.35, 80);
  questionCard(860, 250, 480, 84, '', '∫ dx / (x² √(x² + 4))', t, P('C01', 0.05), { col: SQ.R.col, size: 32 });
  richReveal([['x² + a²  ⇒  ', CR], ['x = 2 tan θ', GOLD]], 860, 360, 32, t, P('C01', 0.6), { upright: true });
  if (t > S('C02')) {
    const rows = [['√(x² + 4) = 2 sec θ', 0.05], ['dx = 2 sec²θ dθ', 0.3], ['= ¼ ∫ cos θ / sin²θ dθ', 0.6]];
    rows.forEach(([s, f], k) => mathText(s, 860, 450 + k * 60, 30, k === 2 ? CYAN : CR, { align: 'center', alpha: ap(t, 'C02', f), upright: true }));
  }
  if (t > S('G01')) { richReveal([['u = sin θ  :  ', CYAN]], 700, 650, 28, t, P('G01', 0.05), { upright: true }); goldBox(980, 650, 340, 64, '−1 / (4 sin θ) + C', 28, ap(t, 'G01', 0.4)); }
};

// ======================= 换回 x（A308 + A310） =======================
SC.back = t => {
  starfield(t); blueprint(0.35, 80);
  const p = eIO(prog(t, P('C03', 0.15), 1.4));
  rightTri(600, 560, 300, 230, ['√(x² + 4)', 'x', '2'], SQ.R.col, ap(t, 'C03', 0.1), p);
  if (p >= 1) mathText('tan θ = x / 2', 750, 650, 26, CYAN, { align: 'center', alpha: clamp(prog(t, P('C03', 0.15) + 1.4, 0.3)), upright: true });
  if (t > S('C04')) {
    mathText('sin θ = x / √(x² + 4)', 1080, 360, 30, CR, { align: 'center', alpha: ap(t, 'C04', 0.05), upright: true });
    const mv = eIO(prog(t, P('C04', 0.3), 0.7));            // sin θ 飞入答案
    mathText('−1 / (4 sin θ)', 1080, 450, 30, CR, { align: 'center', alpha: ap(t, 'C04', 0.2) * (1 - mv), upright: true });
    if (mv > 0) arrow(1080, 470, 1080, 520, GOLD, mv, 2.5);
    goldBox(1060, 570, 400, 70, '−√(x² + 4) / (4x) + C', 30, mv);
    richReveal([['求导 ✓', GRN]], 1060, 650, 26, t, P('C04', 0.8), { upright: true });
  }
};

// ======================= 配方（A309） =======================
const GS = { cx: 790, cy: 640, ux: 70, uy: 60, x0: -4.2, x1: 2.6, y0: -0.5, y1: 4.6 };
SC.square = t => {
  starfield(t); blueprint(0.35, 80);
  questionCard(860, 250, 460, 80, '', '∫ x dx / √(3 − 2x − x²)', t, P('R01', 0.05), { col: SQ.R.col, size: 30 });
  if (t < S('C05')) { stampMark(900, 470, 60, t, P('R01', 0.5), { text: '路不平', col: SQ.R.col, rot: -0.1 }); return; }
  const a = ap(t, 'C05', 0); gAxes(GS, a * 0.7, { grid: false });
  const sh = eIO(prog(t, P('C05', 0.4), 1.0));        // 4 − (x+1)² 平移成 4 − u²
  gPlot(GS, x => 3 - 2 * x - x * x, hexA(SQ.R.col, 0.4 + 0.6 * (1 - sh)), { a, xa: -3.2, xb: 1.2, w: 3 });
  if (sh > 0) gPlot(GS, x => 4 - (x + 1 - sh) ** 2 - 0 * x, GOLD, { a: a * sh, xa: -3.2 + sh, xb: 1.2 + sh, w: 3.5 });
  glowDot(gx(GS, -1 + sh), gy(GS, 4), 7, sh > 0.5 ? GOLD : SQ.R.col, a); if (sh > 0 && sh < 1) arrow(gx(GS, -1), gy(GS, 4) - 20, gx(GS, -1 + sh), gy(GS, 4) - 20, GOLD, a, 2);
  richReveal([['3 − 2x − x² = ', CR], ['4 − (x + 1)²', GOLD]], 1180, 380, 26, t, P('C05', 0.15), { upright: true });
  if (t > S('C06')) {
    richReveal([['x + 1 = 2 sin θ', GOLD]], 1180, 450, 28, t, P('C06', 0.05), { upright: true });
    darkBox(560, 700, 640, 80, ap(t, 'C06', 0.4));
    mathText('−√(3 − 2x − x²) − arcsin((x + 1)/2) + C', 880, 750, 26, GOLD, { align: 'center', alpha: ap(t, 'C06', 0.4), upright: true });
  }
  if (t > S('R02')) checkMark(1180, 530, 24, GRN, t, P('R02', 0.1));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 500, 100, '', '∫ dx / (x² + 2x + 5) = ？', t, P('C08', 0.05), { size: 34 });
  if (t > S('R03')) {
    richReveal([['x² + 2x + 5 = ', CR], ['(x + 1)² + 4', SQ.R.col]], 820, 530, 32, t, P('R03', 0.05), { upright: true });
    richReveal([['= ', CR], ['½ arctan((x + 1)/2) + C', GOLD]], 820, 620, 34, t, P('R03', 0.5), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C10'), 0.4);
  if (fa > 0) { rightTri(640, 520, 220, 170, ['√(x² + 4)', 'x', '2'], SQ.R.col, ap(t, 'C09', 0.05) * fa, 1); richReveal([['不规整', CR], [' → 先配方', GOLD]], 1080, 440, 38, t, P('C09', 0.45), { alpha: fa }); }
  if (t > S('C10') - 0.1) { glowText('下一段：部分分式（一）', CX, 520, 52, CR, t, P('C10', 0.15)); glowText('GLM 的掩盖法', CX, 610, 32, SQ.Z.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 7 章 · P6 三角代换进阶与配方', '下一段：部分分式一', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM7('Mistral')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.05, 'pop', 0.22); s('C01', 0.6, 'ding', 0.18); [0.05, 0.3, 0.6].forEach(f => s('C02', f, 'pop', 0.14)); s('G01', 0.4, 'ding_hi', 0.24);
  s('C03', 0.15, 'warp', 0.16); s('C04', 0.3, 'whoosh', 0.18); s('C04', 0.8, 'check', 0.22);
  s('R01', 0.05, 'pop', 0.2); s('R01', 0.5, 'stamp', 0.26); s('C05', 0.4, 'whoosh', 0.2); s('C06', 0.4, 'ding_hi', 0.24); s('R02', 0.1, 'check', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('R03', 0.5, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
