// 第 4 章 P15《牛顿法》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A175 切线一次次落到 x 轴、点逐步逼近根 · A176 牛顿法 vs 二分法有效数字赛跑表 · A177 失败案例：切线几乎水平飞出画面；0 ↔ 1 来回振荡
const SC = {};
const TITLES = [['idea', '切线追根'], ['ex', '牛顿的例子'], ['fail', '翻车现场'], ['quiz', '随堂一题'], ['outro', '小结']];
const f1 = x => x * x * x - 2 * x - 5, d1 = x => 3 * x * x - 2;
const G1 = { cx: 50, cy: 652, ux: 400, uy: 22, x0: 1.5, x1: 3.2, y0: -6, y1: 16 };
function newtonSteps(f, d, x0, n) { const xs = [x0]; for (let i = 0; i < n; i++) { const x = xs[xs.length - 1]; xs.push(x - f(x) / d(x)); } return xs; }

// ======================= 切线追根（A175） =======================
SC.idea = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01') - 0.1) { const b = ap(t, 'B01', 0.1); slab('先糊弄 → 再改', CX, 420, 40, t, P('B01', 0.35), { bg: SQ.B.col, c: COL.ink }); label('家人们～', CX, 540, 30, SQ.B.col, b, { bold: true }); return; }
  const a = ap(t, 'C01', 0);
  gAxes(G1, a, { grid: false, ticks: { x: [[2, '2'], [3, '3']], y: [[10, '10']] }, xl: 'x' });
  gPlot(G1, f1, SQ.B.col, { a, n: 300 });
  const xs = newtonSteps(f1, d1, 3, 3);
  for (let i = 0; i < 3; i++) {
    const t0 = P('C01', 0.3) + i * 1.6, p = clamp((t - t0) / 1.2); if (p <= 0) break;
    const x = xs[i], y = f1(x), xn = xs[i + 1];
    gDot(G1, x, y, GOLD, 1); gV(G1, x, hexA(CR, 0.5), 1, { dash: [4, 6], ya: 0, yb: y });
    const xe = lerp(x, xn, eIO(p)); gLine(G1, d1(x), x, y, Math.min(x, xe) - 0.02, Math.max(x, xe) + 0.02, CYAN, 1, 3);
    if (p >= 1) { gDot(G1, xn, 0, GRN, 1); label(`x${'₀₁₂₃'[i + 1]}`, gx(G1, xn), gy(G1, 0) + 30, 22, GRN, 1, { font: F_MATH }); }
    if (i === 0) label('x₀', gx(G1, x), gy(G1, 0) + 30, 22, GOLD, 1, { font: F_MATH });
  }
  if (t > S('C02') - 0.1) { const c = ap(t, 'C02', 0); panel(650, 200, 460, 80, GOLD, c); richReveal([["xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)", GOLD]], 880, 240, 30, t, P('C02', 0.05), { upright: true }); label('每一步 = 线性化', 880, 310, 22, CYAN, ap(t, 'C02', 0.6), { bold: true }); }
};

// ======================= 牛顿的例子 + 赛跑表（A176） =======================
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['x^3 − 2x − 5 = 0', SQ.B.col]], CX, 220, 34, t, P('G01', 0.1), { upright: true });
  if (t < S('B02') - 0.1) {
    const xs = newtonSteps(f1, d1, 2, 3);
    panel(720, 290, 560, 330, SQ.G.col, ap(t, 'G01', 0.2) * 0.8);
    label('n', 800, 330, 24, CR, ap(t, 'G01', 0.2), { font: F_MATH }); label('xₙ', 1010, 330, 24, CR, ap(t, 'G01', 0.2), { font: F_MATH }); label('f(xₙ)', 1180, 330, 24, CR, ap(t, 'G01', 0.2), { font: F_MATH });
    xs.forEach((x, i) => { const p = ap(t, 'G01', 0.3 + i * 0.13); if (p <= 0) return; const y = 390 + i * 60; mathText(`${i}`, 800, y, 26, CR, { align: 'center', alpha: p, upright: true }); mathText(x.toFixed(6), 1010, y, 26, i >= 2 ? GOLD : CR, { align: 'center', alpha: p, upright: true }); mathText(f1(x).toExponential(1), 1180, y, 22, hexA(CR, 0.75), { align: 'center', alpha: p, upright: true }); });
    if (t > P('G01', 0.75)) slab('两步：小数点后四位', CX, 700, 26, t, P('G01', 0.75), { bg: GOLD, c: COL.ink });
    return;
  }
  // √2 赛跑表
  const b = ap(t, 'B02', 0);
  const nw = [1, 1.5, 1.4166667, 1.4142157, 1.4142136], bi = [1.5, 1.25, 1.375, 1.4375, 1.40625];
  const good = (x) => { const s = x.toFixed(7), r = '1.4142136'; let k = 0; while (k < s.length && s[k] === r[k]) k++; return Math.max(0, k - 1); };
  panel(640, 290, 340, 400, SQ.B.col, b * 0.8); panel(1010, 290, 340, 400, CYAN, b * 0.8);
  label('牛顿法', 810, 325, 26, SQ.B.col, b, { bold: true }); label('二分法', 1180, 325, 26, CYAN, b, { bold: true });
  for (let i = 0; i < 5; i++) {
    const p = ap(t, 'B02', 0.1 + i * 0.14); if (p <= 0) continue; const y = 385 + i * 62;
    mathText(nw[i].toFixed(7), 780, y, 24, good(nw[i]) >= 6 ? GOLD : CR, { align: 'center', alpha: p, upright: true }); label(`${good(nw[i])} 位`, 930, y, 18, SQ.B.col, p);
    mathText(bi[i].toFixed(5), 1150, y, 24, CR, { align: 'center', alpha: p, upright: true }); label(`${good(bi[i])} 位`, 1300, y, 18, CYAN, p);
  }
  richReveal([['√2 = 1.41421356…', GOLD]], CX, 740, 30, t, P('B02', 0.8), { upright: true });
};

// ======================= 翻车（A177） =======================
const G2 = { cx: 990, cy: 520, ux: 300, uy: 30, x0: -1.1, x1: 1.2, y0: -8, y1: 4 };
const f2 = x => x * x * x - 2 * x + 2, d2 = x => 3 * x * x - 2;
const G3 = { cx: 990, cy: 640, ux: 160, uy: 45, x0: -2.1, x1: 2.1, y0: -3, y1: 7 };
SC.fail = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C03') - 0.1) {
    const a = ap(t, 'G02', 0), x0 = Math.sqrt(2 / 3) + 0.004;
    gAxes(G2, a, { grid: false, ticks: { x: [[1, '1']] } }); gPlot(G2, f1, SQ.B.col, { a, n: 200 });
    gDot(G2, x0, f1(x0), GOLD, a); label('x₀：导数 ≈ 0', gx(G2, x0), gy(G2, f1(x0)) + 34, 22, GOLD, a, { bold: true });
    const p = eIO(prog(t, P('G02', 0.45), 0.8)); gLine(G2, d1(x0), x0, f1(x0), -1.1, lerp(x0, 1.2, p), CYAN, a, 3);
    if (p >= 1) { arrowH(1300, 1350, gy(G2, f1(x0)), RED, ap(t, 'G02', 0.75)); label(`x₁ ≈ ${(x0 - f1(x0) / d1(x0)).toFixed(0)}，飞出画面！`, 1150, gy(G2, f1(x0)) - 50, 24, RED, ap(t, 'G02', 0.75), { bold: true }); }
    return;
  }
  const a = ap(t, 'C03', 0);
  gAxes(G3, a, { grid: false, ticks: { x: [[1, '1'], [-1, '−1']] }, xl: 'x' }); gPlot(G3, f2, SQ.B.col, { a, n: 300 });
  mathText('x^3 − 2x + 2', 700, 300, 26, SQ.B.col, { alpha: a, upright: true });
  const ph = Math.max(0, t - P('C03', 0.35)), k = Math.floor(ph / 0.9), fr = (ph % 0.9) / 0.9;
  if (ph > 0) {
    const xa = k % 2 ? 1 : 0, xb = k % 2 ? 0 : 1;
    gDot(G3, xa, f2(xa), GOLD, a); gLine(G3, d2(xa), xa, f2(xa), Math.min(xa, xb), Math.max(xa, xb), CYAN, a * (1 - fr * 0.3), 3);
    gDot(G3, 0, 0, hexA(GRN, 0.8), a); gDot(G3, 1, 0, hexA(GRN, 0.8), a);
    label(`第 ${k + 1} 步：${xa} → ${xb}`, 1180, 330, 24, GOLD, a, { bold: true });
    if (k >= 2) label('永远不收敛', CX, 820, 30, RED, clamp((ph - 1.8) / 0.4), { bold: true });
  }
  if (t > S('B03')) slab('笑着道歉，换初值', 1180, 420, 24, t, P('B03', 0.3), { bg: SQ.B.col, c: COL.ink });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C04', 0, 0.5) * 0.42, 78);
  if (t < S('C05')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C04') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['f(x) = x^2 − 2,   x₀ = 1', RED]], 860, 300, 38, t, P('C05', 0.2), { upright: true });
  richReveal([['x₁ = ？', CR]], 860, 380, 36, t, P('C05', 0.6), { upright: true });
  if (t > S('D01')) { richReveal([['x₁ = 1 − (−1)/2', CYAN]], 900, 500, 36, t, P('D01', 0.1), { upright: true }); richReveal([['= ', CR], ['3/2 = 1.5', GOLD]], 900, 610, 46, t, P('D01', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C06', 0) * fadeOut(t, S('C07'), 0.4);
  if (ga > 0) { richReveal([['切线逼近根：快', GOLD]], CX, 420, 42, t, P('C06', 0.15), { upright: true, alpha: ga }); richReveal([['但要选好初值', RED]], CX, 530, 38, t, P('C06', 0.6), { upright: true, alpha: ga }); }
  if (t > S('C07') - 0.1) { glowText('下一段：原函数与不定积分', CX, 500, 52, CR, t, P('C07', 0.15)); glowText('混元客串', CX, 590, 32, SQ.H.col, t, P('C07', 0.45), { bold: false }); }
  credits(t, E('C07') + 0.38, 'AI娘微积分课 · 第 4 章 · P15 牛顿法', '下一段：原函数与不定积分', [...CREDIT_BASE, '豆包娘立绘：ZipZipPipe 的 Seed/豆包拟人设定，复制自本系列 AI娘 Git 课素材。', '豆包声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END, CREDIT_TM4('豆包')]);
};

SC.__overlay = t => { if (t < E('C07') + 0.25) lecturer(t, 'C', 255, -5, E('C07') + 0.48, { h: 710 }); };
SC.__noTag = E('C07') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C07') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('B01', 0.35, 'slap', 0.22); [0, 1, 2].forEach(i => { sfx(P('C01', 0.3) + i * 1.6, 'swoosh_soft', 0.2); sfx(P('C01', 0.3) + i * 1.6 + 1.2, 'pluck', 0.2); });
  s('C02', 0.05, 'type', 0.16); s('C02', 0.6, 'ding', 0.2);
  s('G01', 0.1, 'type', 0.14); [0, 1, 2, 3].forEach(i => s('G01', 0.3 + i * 0.13, 'tick', 0.16)); s('G01', 0.75, 'ding_hi', 0.26);
  [0, 1, 2, 3, 4].forEach(i => s('B02', 0.1 + i * 0.14, 'marimba', 0.16)); s('B02', 0.8, 'shimmer', 0.2);
  s('G02', 0.45, 'whoosh', 0.2); s('G02', 0.75, 'glitch', 0.2); s('C03', 0.35, 'pluck', 0.16); s('C03', 0.6, 'pluck', 0.16); s('B03', 0.3, 'pop', 0.22);
  s('C04', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'type', 0.14); s('D01', 0.55, 'ding_hi', 0.28);
  s('C06', 0.15, 'pop', 0.2); s('C06', 0.6, 'thud', 0.2); s('C07', 0.15, 'swell', 0.3);
})();
finalize();
