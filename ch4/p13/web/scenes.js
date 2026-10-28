// 第 4 章 P13《描绘曲线：渐近线与作图六步》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A167 作图六步进度轨 · A168 斜渐近线：差值条缩到 0 · A169 同一函数在两个窗口下的“骗人图” · A170 完成图关键点逐个亮起
const SC = {};
const TITLES = [['steps', '作图六步'], ['asym', '斜渐近线'], ['full', '完整作图'], ['quiz', '随堂一题'], ['outro', '小结']];
const STEPS = ['定义域', '截距', '渐近线', '单调极值', '凹凸拐点', '列表画图'];
const fq = x => x * x / (x - 1);
function rail(t, lit, a) {
  if (a <= 0) return;
  seg(660, 215, 1310, 215, hexA(CR, 0.35), a, 3);
  STEPS.forEach((s, i) => {
    const x = 660 + i * 130, on = lit[i] ?? 0, c = on > 0 ? SQ.M.col : hexA(CR, 0.5);
    if (on > 0) glowDot(x, 215, 12, SQ.M.col, a * on); else { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, 215, 10, 0, 7); ctx.stroke(); ctx.restore(); }
    label(s, x, 250, 19, c, a, { bold: on > 0 });
  });
}

// ======================= 六步 + 骗人图（A167 / A169） =======================
const GL = { cx: 800, cy: 520, ux: 1.7, uy: 1.7, x0: -100, x1: 100, y0: -100, y1: 100 };
const GR = { cx: 1137.5, cy: 539, ux: 42.5, uy: 18.9, x0: -3, x1: 5, y0: -8, y1: 10 };
SC.steps = t => {
  starfield(t); blueprint(0.4, 80);
  rail(t, STEPS.map((s, i) => ap(t, 'C01', 0.1 + i * 0.14)), ap(t, 'C01', 0));
  if (t > S('M01') - 0.1 && t < S('C02') - 0.1) { const m = ap(t, 'M01', 0.1); panel(760, 380, 480, 300, SQ.M.col, m); label('搜索中……', CX, 470, 30, SQ.M.col, m, { bold: true }); label('一搜就出来！', CX, 580, 34, GOLD, ap(t, 'M01', 0.45), { bold: true }); }
  if (t > S('C02') - 0.1) {
    const a = ap(t, 'C02', 0);
    panel(630, 350, 340, 340, SQ.M.col, a * 0.8); label('窗口 [−100, 100]', 800, 720, 22, SQ.M.col, a);
    gAxes(GL, a, { grid: false }); gPlot(GL, fq, SQ.M.col, { a, n: 80, p: eIO(prog(t, P('C02', 0.5), 0.8)) });
    if (t > P('C02', 0.85)) label('像一条直线？', 800, 400, 22, GOLD, ap(t, 'C02', 0.85), { bold: true });
    if (t > S('M02') - 0.1) {
      const b = ap(t, 'M02', 0);
      panel(1010, 350, 340, 340, GOLD, b * 0.8); label('窗口 [−3, 5]', 1180, 720, 22, GOLD, b);
      gAxes(GR, b, { grid: false }); gV(GR, 1, RED, b * 0.8, { dash: [6, 6] });
      gPlot(GR, fq, GOLD, { a: b, xa: -3, xb: 0.995, n: 200 }); gPlot(GR, fq, GOLD, { a: b, xa: 1.005, xb: 5, n: 200 });
      label('竖直渐近线藏在这里', 1180, 395, 20, RED, ap(t, 'M02', 0.15), { bold: true });
      richReveal([['用导数确认关键点', CR]], CX, 790, 30, t, P('M02', 0.55), { upright: true });
    }
  }
};

// ======================= 斜渐近线（A168） =======================
const GA = { cx: 990, cy: 580, ux: 58, uy: 50, x0: -6, x1: 6, y0: -5, y1: 5 };
SC.asym = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['y = kx + b', GOLD], ['：  k = lim f(x)/x,   b = lim [f(x) − kx]', CR]], CX, 220, 30, t, P('G01', 0.15), { upright: true });
  if (t < S('G02') - 0.1) return;
  const a = ap(t, 'G02', 0);
  gAxes(GA, a, { grid: false, ticks: { x: [[-4, '−4'], [4, '4']] } });
  const f = x => x * x * x / (x * x + 1);
  gLine(GA, 1, 0, 0, -6, 6, CYAN, a * 0.8, 3, [10, 8]); mathText('y = x', gx(GA, 4.6), gy(GA, 4.6) + 34, 24, CYAN, { alpha: a, upright: true });
  gPlot(GA, f, SQ.M.col, { a, p: eIO(prog(t, P('G02', 0.2), 1.2)), n: 300 });
  mathText('x^3/(x^2 + 1)', 700, 300, 26, SQ.M.col, { alpha: a, upright: true });
  [0.8, 1.5, 2.5, 3.5, 4.5, 5.5].forEach((x, i) => { const p = ap(t, 'G02', 0.55 + i * 0.05); if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = hexA(GOLD, 0.7); const y1 = gy(GA, f(x)), y2 = gy(GA, x); ctx.fillRect(gx(GA, x) - 4, y2, 8, y1 - y2); ctx.fillRect(gx(GA, -x) - 4, gy(GA, f(-x)), 8, gy(GA, -x) - gy(GA, f(-x))); ctx.restore(); });
  if (t > P('G02', 0.85)) label('差值 → 0', gx(GA, 4.4), gy(GA, 2.4), 24, GOLD, ap(t, 'G02', 0.85), { bold: true });
};

// ======================= 完整作图（A170） =======================
const GF = { cx: 922, cy: 612, ux: 68, uy: 26, x0: -4, x1: 6, y0: -8, y1: 12 };
SC.full = t => {
  starfield(t); blueprint(0.4, 80);
  const lit = [ap(t, 'C03', 0.3), ap(t, 'C03', 0.4), Math.max(ap(t, 'C03', 0.7) * 0.6, ap(t, 'C04', 0.6)), ap(t, 'C05', 0.4), ap(t, 'C06', 0.3), ap(t, 'C06', 0.7)];
  rail(t, lit, 1);
  const a = ap(t, 'C03', 0);
  gAxes(GF, a, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[4, '4']] }, xl: 'x' });
  // 竖直渐近线
  const va = ap(t, 'C03', 0.7); gV(GF, 1, RED, va * 0.85, { dash: [8, 6] }); if (va > 0) label('x = 1', gx(GF, 1) + 40, gy(GF, -7), 22, RED, va, { font: F_MATH });
  // 斜渐近线
  const oa = ap(t, 'C04', 0.6); gLine(GF, 1, 0, 1, -4, 6, CYAN, oa * 0.85, 3, [10, 8]); if (oa > 0) label('y = x + 1', gx(GF, 4.9), gy(GF, 5.9) + 40, 22, CYAN, oa, { font: F_MATH });
  // 曲线
  const cp = eIO(prog(t, P('C03', 0.2), 1.4));
  gPlot(GF, fq, SQ.M.col, { a, xa: -4, xb: 0.97, p: cp, n: 300 }); gPlot(GF, fq, SQ.M.col, { a, xa: 1.04, xb: 6, p: cp, n: 300 });
  // 关键点
  const k1 = ap(t, 'C05', 0.6), k2 = ap(t, 'C05', 0.8);
  if (k1 > 0) { gDot(GF, 0, 0, GOLD, k1); label('极大 (0, 0)', gx(GF, 0) - 70, gy(GF, 0) - 30, 20, GOLD, k1, { bold: true }); }
  if (k2 > 0) { gDot(GF, 2, 4, GRN, k2); label('极小 (2, 4)', gx(GF, 2) + 80, gy(GF, 4) + 26, 20, GRN, k2, { bold: true }); }
  const cc = ap(t, 'C06', 0.35); if (cc > 0) { label('下凹 ∩', gx(GF, -2.6), gy(GF, -6), 22, SQ.K.col, cc, { bold: true }); label('上凹 ∪', gx(GF, 3.6), gy(GF, 11), 22, SQ.K.col, cc, { bold: true }); }
  if (t > P('C06', 0.7)) { [[0, 0], [2, 4]].forEach(([x, y], i) => burst(t, P('C06', 0.72) + i * 0.15, gx(GF, x), gy(GF, y), GOLD, 50, 8)); }
  // 底部公式（逐行替换）
  const F = [['C03', 0.15, [['f(x) = x^2/(x − 1)', SQ.M.col], ['    x ≠ 1', CR]]], ['C04', 0.1, [['x^2/(x − 1) = ', CR], ['x + 1', CYAN], [' + 1/(x − 1)', CR]]],
    ['C05', 0.1, [["f′(x) = (x^2 − 2x)/(x − 1)^2", CR], ['   驻点 0, 2', GOLD]]], ['C06', 0.1, [["f″(x) = 2/(x − 1)^3", CR], ['   无拐点', SQ.K.col]]]];
  F.forEach(([id, f, parts], i) => { if (t < S(id) - 0.1) return; const nx = F[i + 1]; const out = nx ? S(nx[0]) - 0.1 : null; richReveal(parts, CX, 880, 28, t, P(id, f), { upright: true, out }); });
  if (t > S('M03')) slab('2024 年？', 1250, 330, 24, t, P('M03', 0.6), { bg: SQ.M.col, c: COL.ink });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['y = (2x^2 + 1)/x', RED]], 860, 300, 44, t, P('C08', 0.1), { upright: true });
  richReveal([['斜渐近线？', CR]], 860, 380, 32, t, P('C08', 0.5), { upright: true });
  if (t > S('D01')) { richReveal([['= 2x + ', CR], ['1/x', hexA(CR, 0.6)], ['   (1/x → 0)', CYAN]], 900, 500, 34, t, P('D01', 0.1), { upright: true }); richReveal([['y = ', CR], ['2x', GOLD]], 900, 610, 52, t, P('D01', 0.6), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { rail(t, STEPS.map(() => 1), ga); richReveal([['斜渐近线：先 k，后 b', CYAN]], CX, 450, 38, t, P('C09', 0.4), { upright: true, alpha: ga }); richReveal([['关键点：用导数确认', GOLD]], CX, 550, 38, t, P('C09', 0.7), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：优化问题', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('千问客串', CX, 590, 32, SQ.Q.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 4 章 · P13 描绘曲线', '下一段：优化问题', [...CREDIT_BASE, 'Gemini 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', ...CREDIT_END, CREDIT_TM4('Gemini')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  STEPS.forEach((x, i) => s('C01', 0.1 + i * 0.14, 'click', 0.16)); s('M01', 0.1, 'type', 0.16); s('M01', 0.45, 'sparkle', 0.2);
  s('C02', 0.5, 'whoosh', 0.16); s('C02', 0.85, 'pop', 0.2); s('M02', 0.0, 'glitch', 0.16); s('M02', 0.15, 'ding_lo', 0.2); s('M02', 0.55, 'pluck', 0.2);
  s('G01', 0.15, 'type', 0.16); s('G02', 0.2, 'whoosh', 0.16); [0, 1, 2, 3, 4, 5].forEach(i => s('G02', 0.55 + i * 0.05, 'tick', 0.12)); s('G02', 0.85, 'ding', 0.22);
  s('C03', 0.2, 'whoosh', 0.18); s('C03', 0.7, 'thud', 0.22); s('C04', 0.1, 'type', 0.14); s('C04', 0.6, 'swoosh_in', 0.2);
  s('C05', 0.1, 'type', 0.14); s('C05', 0.6, 'ding', 0.22); s('C05', 0.8, 'ding', 0.22); s('C06', 0.1, 'type', 0.14); s('C06', 0.35, 'pluck', 0.2); s('C06', 0.72, 'sparkle', 0.24); s('M03', 0.6, 'pop', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'type', 0.14); s('D01', 0.6, 'ding_hi', 0.28);
  s('C09', 0.15, 'shimmer', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
