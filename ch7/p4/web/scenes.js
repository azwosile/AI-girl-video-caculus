// 第 7 章 P4《三角积分（一）：正弦与余弦的幂》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.2 例 1–4。
// A302 剥一个因子 · A303 sin²x 与 ½ 线、面积对半 · A304 决策树
const SC = {};
const TITLES = [['odd', '奇次：剥一个'], ['even', '偶次：降幂'], ['tree', '决策树'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 剥一个（A302） =======================
SC.odd = t => {
  starfield(t); blueprint(0.35, 80);
  questionCard(860, 250, 380, 80, '', '∫ cos³x dx', t, P('H01', 0.1), { col: SQ.H.col, size: 34 });
  if (t > S('C01')) {
    const sp = eIO(prog(t, P('C01', 0.1), 0.8));     // 三个 cos 方块，最右一个被“剥”下去
    for (let k = 0; k < 3; k++) {
      const x = 640 + k * 130 + (k === 2 ? sp * 120 : 0), y = 380 + (k === 2 ? sp * 100 : 0), c = k === 2 ? GOLD : CYAN;
      ctx.save(); ctx.fillStyle = hexA(c, 0.18); ctx.strokeStyle = c; ctx.lineWidth = 2.5; rr(x - 55, y - 32, 110, 64, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      mathText('cos x', x, y + 9, 26, c, { align: 'center', upright: true });
    }
    if (sp > 0.6) { mathText('· dx  =  d(sin x)', 1010, 489, 26, GOLD, { alpha: clamp(prog(t, P('C01', 0.4), 0.3)), upright: true }); }
    if (t > P('C01', 0.6)) { const a = clamp(prog(t, P('C01', 0.6), 0.3)); seg(585, 420, 835, 420, CYAN, a, 2); mathText('cos²x = 1 − sin²x', 710, 455, 24, CYAN, { align: 'center', alpha: a, upright: true }); }
  }
  if (t > S('C02')) {
    const a = ap(t, 'C02', 0.1) * fadeOut(t, S('G01'), 0.3);
    richReveal([['u = sin x :  ', CYAN], ['∫ (1 − u²) du', CR]], 860, 590, 30, t, P('C02', 0.05), { upright: true, alpha: fadeOut(t, S('G01'), 0.3) });
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,200,60,0.12)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; rr(560, 640, 600, 74, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText('= sin x − ⅓ sin³x + C', 860, 688, 32, GOLD, { align: 'center', alpha: a, upright: true });
  }
  if (t > S('G01')) {
    const a = ap(t, 'G01', 0.05); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,28,0.92)'; rr(560, 560, 640, 170, 14); ctx.fill(); ctx.restore();
    mathText('∫ sin⁵x cos²x dx', 860, 610, 30, CR, { align: 'center', alpha: a, upright: true });
    richReveal([['剥一个 sin x', GOLD], ['  ·  u = cos x', CYAN]], 860, 680, 28, t, P('G01', 0.45), { upright: true });
  }
};

// ======================= 降幂（A303） =======================
const GE = { cx: 600, cy: 700, ux: 150, uy: 330, x0: -0.1, x1: 3.5, y0: -0.05, y1: 1.15 };
SC.even = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C03')) { questionCard(860, 400, 380, 90, '', '∫ sin²x dx', t, P('H02', 0.1), { col: SQ.H.col, size: 36 }); stampMark(1060, 500, 50, t, P('H02', 0.55), { text: '没得剥', col: RED, rot: 0.12 }); return; }
  richReveal([['sin²x = ', CR], ['(1 − cos 2x) / 2', GOLD]], 860, 250, 36, t, P('C03', 0.1), { upright: true, alpha: fadeOut(t, S('G02'), 0.3) });
  const a = ap(t, 'C03', 0.4) * fadeOut(t, S('G02'), 0.3);
  if (a > 0) {
    gAxes(GE, a * 0.75, { grid: false, xl: 'x' });
    const fill = ap(t, 'C04', 0.2); ctx.save(); ctx.globalAlpha *= a * fill * 0.6; ctx.strokeStyle = CR; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.strokeRect(gx(GE, 0), gy(GE, 1), gx(GE, Math.PI) - gx(GE, 0), gy(GE, 0) - gy(GE, 1)); ctx.restore();
    gBetween(GE, x => Math.sin(x) ** 2, () => 0, 0, Math.PI, a * fill, { col: 'rgba(61,139,255,0.35)' });
    gPlot(GE, x => Math.sin(x) ** 2, SQ.H.col, { a, xa: 0, xb: Math.PI, w: 4 });
    seg(gx(GE, 0), gy(GE, 0.5), gx(GE, Math.PI), gy(GE, 0.5), GOLD, a * ap(t, 'C03', 0.6), 2.5); label('½', gx(GE, 0) - 22, gy(GE, 0.5), 24, GOLD, a, {});
    label('π', gx(GE, Math.PI), gy(GE, 0) + 26, 22, CR, a, {}); label('1', gx(GE, 0) - 22, gy(GE, 1), 22, CR, a * fill, {});
    if (t > S('C04')) { richReveal([['∫₀^π sin²x dx = ', CR], ['π/2', GOLD]], 1160, 380, 30, t, P('C04', 0.15), { upright: true, alpha: fadeOut(t, S('G02'), 0.3) }); richReveal([['= 矩形 π × 1 的一半', CR]], 1160, 440, 24, t, P('C04', 0.55), { upright: true, alpha: fadeOut(t, S('G02'), 0.3) }); }
  }
  if (t > S('G02')) {
    const q = ap(t, 'G02', 0.05); mathText('∫ sin⁴x dx', 860, 330, 34, CR, { align: 'center', alpha: q, upright: true });
    ['降幂 ①', '降幂 ②'].forEach((s, k) => { const b = ap(t, 'G02', 0.15 + 0.15 * k); label(s, 760 + k * 200, 420, 26, SQ.H.col, b, { bold: true }); if (b > 0) arrow(700 + k * 200, 450, 820 + k * 200, 450, SQ.H.col, b, 2.5); });
    ctx.save(); ctx.globalAlpha *= ap(t, 'G02', 0.5); ctx.fillStyle = 'rgba(255,200,60,0.12)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; rr(530, 520, 660, 80, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText('3x/8 − ¼ sin 2x + (1/32) sin 4x + C', 860, 571, 28, GOLD, { align: 'center', alpha: ap(t, 'G02', 0.5), upright: true });
  }
};

// ======================= 决策树（A304） =======================
function node7(x, y, w, h, s, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(12,18,38,0.9)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5; rr(x - w / 2, y - h / 2, w, h, 12); ctx.fill(); ctx.stroke(); ctx.restore(); mathText(s, x, y + 9, 24, col, { align: 'center', alpha: a, upright: true }); }
SC.tree = t => {
  starfield(t); blueprint(0.35, 80);
  const T0 = P('H03', 0.05), A = i => clamp(prog(t, T0 + i * 0.35, 0.35));
  node7(860, 270, 340, 64, '∫ sinᵐx cosⁿx dx', CR, A(0));
  const br = [[620, 'cos 奇次', '剥 cos · u = sin x', CYAN], [860, 'sin 奇次', '剥 sin · u = cos x', GOLD], [1100, '都偶次', '降幂公式', SQ.H.col]];
  br.forEach(([x, q, r, c], k) => {
    const a = A(1 + k); if (a > 0) { seg(860, 302, lerp(860, x, a), lerp(302, 400, a), c, a * 0.8, 2.5); }
    node7(x, 430, 200, 60, q, c, a); if (a > 0) arrow(x, 462, x, 520, c, A(2 + k), 2.5); node7(x, 560, 220, 70, r, c, A(2 + k));
  });
  if (t > S('C05')) kinetic('偶次就降幂，奇次就剥一个', 860, 700, 34, t, P('C05', 0.1), { col: SQ.H.col });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 520, 100, '', '∫₀^{π/2} sin x cos²x dx = ？', t, P('C07', 0.05), { size: 34 });
  if (t > S('H04')) {
    richReveal([['u = cos x :  ', CYAN], ['∫₀¹ u² du', CR]], 820, 530, 32, t, P('H04', 0.15), { upright: true });
    richReveal([['= ', CR], ['1/3', GOLD]], 820, 620, 40, t, P('H04', 0.55), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { richReveal([['奇次', GOLD], [' → 剥一个', CR]], 860, 380, 46, t, P('C08', 0.05), { alpha: fa }); richReveal([['偶次', SQ.H.col], [' → 降幂', CR]], 860, 480, 46, t, P('C08', 0.4), { alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：tan、sec 与积化和差', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('Gemini：极其漂亮的结论！', CX, 610, 32, SQ.M.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P4 正弦与余弦的幂', '下一段：tan 与 sec', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM7('混元（Hunyuan）')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('H01', 0.1, 'pop', 0.22); s('C01', 0.1, 'whoosh', 0.18); s('C01', 0.6, 'pop', 0.14); s('C02', 0.1, 'ding', 0.2); s('G01', 0.05, 'pop', 0.18);
  s('H02', 0.1, 'pop', 0.2); s('H02', 0.55, 'stamp', 0.24); s('C03', 0.1, 'whoosh', 0.16); s('C04', 0.2, 'swell', 0.16); s('C04', 0.15, 'ding', 0.2); s('G02', 0.5, 'ding_hi', 0.24);
  [0, 1, 2, 3, 4].forEach(i => sfx(P('H03', 0.05) + i * 0.35, 'marimba', 0.13)); s('C05', 0.1, 'shimmer', 0.16);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('H04', 0.55, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C08', 0.4, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
