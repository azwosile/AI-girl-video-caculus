// 第 4 章 P12《泰勒公式初步》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A163 一次、二次、三次……多项式逐级贴上 eˣ · A164 系数“对表”：各阶导数逐个对齐 · A165 sin x 的展开项一层层加上去 · A166 误差条随项数增加缩短
const SC = {};
const TITLES = [['lin', '多项式贴函数'], ['coef', '系数对表'], ['four', '四个常用展开'], ['rem', '余项与误差'], ['back', '回收陷阱'], ['quiz', '随堂一题'], ['outro', '小结']];
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const expP = n => x => { let s = 0; for (let k = 0; k <= n; k++) s += Math.pow(x, k) / fact(k); return s; };
const sinP = n => x => { let s = 0; for (let k = 0; k <= n; k++) s += (k % 2 ? -1 : 1) * Math.pow(x, 2 * k + 1) / fact(2 * k + 1); return s; };

// ======================= 多项式贴 eˣ（A163） =======================
const GE = { cx: 1030, cy: 710, ux: 130, uy: 55, x0: -3, x1: 2.5, y0: -1, y1: 8 };
const EXS = [[1, 'C01', 0.3, CYAN, '1 + x'], [2, 'C02', 0.25, GRN, '+ x²/2!'], [3, 'C02', 0.5, SQ.Z.col, '+ x³/3!'], [4, 'C02', 0.75, RED, '+ x⁴/4!']];
SC.lin = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(GE, a, { grid: false, ticks: { x: [[-2, '−2'], [1, '1'], [2, '2']], y: [[4, '4']] }, xl: 'x' });
  gPlot(GE, Math.exp, GOLD, { a, w: 6 }); mathText('e^x', gx(GE, 2.05), gy(GE, 7.6), 28, GOLD, { alpha: a, upright: true });
  let cur = -1;
  EXS.forEach(([n, id, f, c, s], i) => {
    const p = ap(t, id, f); if (p <= 0) return; cur = i;
    const latest = i === EXS.length - 1 || ap(t, EXS[i + 1][1], EXS[i + 1][2]) <= 0;
    gPlot(GE, expP(n), c, { a: p * (latest ? 1 : 0.35), p: eIO(prog(t, P(id, f), 0.8)), w: latest ? 4.5 : 2.5 });
    mathText(s, 700 + i * 150, 230, 28, c, { alpha: p, upright: true });
  });
  if (t > P('C01', 0.6) && t < S('C02')) label('离 0 一远就不准', gx(GE, -2.1), gy(GE, 2.3), 24, CYAN, ap(t, 'C01', 0.6), { bold: true });
  if (t > S('Z01')) { slab('+1 项 = +1 分精度 = +1 分价钱', CX, 860, 26, t, P('Z01', 0.15), { bg: SQ.Z.col, c: COL.ink }); }
};

// ======================= 系数对表（A164） =======================
SC.coef = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G01', 0);
  label('在 x = 0 处', CX, 210, 24, hexA(CR, 0.75), a);
  label('函数 f', 780, 270, 26, GOLD, a, { bold: true }); label('多项式 a₀ + a₁x + a₂x² + a₃x³', 1170, 270, 24, SQ.Z.col, a, { bold: true });
  const R = [['f(0)', 'a₀', 'a₀ = f(0)'], ["f′(0)", 'a₁', 'a₁ = f′(0)'], ["f″(0)", '2a₂', 'a₂ = f″(0)/2!'], ["f‴(0)", '6a₃', 'a₃ = f‴(0)/3!']];
  R.forEach(([l, r, res], i) => {
    const y = 350 + i * 95, p = ap(t, 'G01', 0.15 + i * 0.18); if (p <= 0) return;
    mathText(l, 780, y, 30, GOLD, { align: 'center', alpha: p, upright: true }); mathText(r, 1000, y, 30, SQ.Z.col, { align: 'center', alpha: p, upright: true });
    seg(840, y, 950, y, hexA(CR, 0.6), p, 2, [6, 6]); mathText('=', 895, y - 2, 28, CR, { align: 'center', alpha: p });
    const q = ap(t, 'G01', 0.25 + i * 0.18); if (q > 0) { mathText(res, 1210, y, 26, GRN, { align: 'center', alpha: q, upright: true }); checkMark(1340, y, 16, GRN, t, P('G01', 0.25 + i * 0.18)); }
  });
  if (t > S('G02') - 0.1) {
    const g = ap(t, 'G02', 0); panel(660, 740, 680, 120, GOLD, g);
    richReveal([['f(x) ≈ Σ ', CR], ['f⁽ᵏ⁾(0)/k!', GOLD], [' · x^k', CR]], CX, 790, 36, t, P('G02', 0.1), { upright: true });
    label('麦克劳林公式 = 泰勒公式在 0 处', CX, 838, 20, hexA(CR, 0.75), ap(t, 'G02', 0.6));
  }
};

// ======================= 四个常用展开（A165） =======================
const GS = { cx: 990, cy: 560, ux: 50, uy: 110, x0: -7, x1: 7, y0: -2.5, y1: 2.5 };
const FOUR = [['e^x = 1 + x + x^2/2! + x^3/3! + …', GOLD, 'C03', 0.1], ['sin x = x − x^3/3! + x^5/5! − …', CYAN, 'C03', 0.45], ['cos x = 1 − x^2/2! + x^4/4! − …', GRN, 'C03', 0.65], ['ln(1 + x) = x − x^2/2 + x^3/3 − …', SQ.Z.col, 'C04', 0.05]];
SC.four = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('D01') - 0.1) {
    FOUR.forEach(([s, c, id, f], i) => { richReveal([[s, c]], CX, 270 + i * 100, 32, t, P(id, f), { upright: true }); });
    if (t > P('C03', 0.45)) label('奇次', 1300, 370, 20, CYAN, ap(t, 'C03', 0.5)); if (t > P('C03', 0.65)) label('偶次', 1300, 470, 20, GRN, ap(t, 'C03', 0.7));
    if (t > S('C04') - 0.1) { const p = ap(t, 'C04', 0.5); panel(690, 680, 620, 110, GOLD, p); richReveal([['… + o(xⁿ)', GOLD], ['   佩亚诺余项', CR]], CX, 735, 34, t, P('C04', 0.55), { upright: true }); }
    return;
  }
  const a = ap(t, 'D01', 0);
  gAxes(GS, a, { grid: false, ticks: { x: [[-Math.PI, '−π'], [Math.PI, 'π']] } });
  gPlot(GS, Math.sin, GOLD, { a, w: 6, n: 400 });
  const layers = [[0, CYAN, 'x'], [1, GRN, '− x³/3!'], [2, SQ.Z.col, '+ x⁵/5!'], [3, RED, '− x⁷/7!']];
  layers.forEach(([n, c, s], i) => {
    const f = 0.08 + i * 0.2, p = ap(t, 'D01', f); if (p <= 0) return;
    const latest = i === 3 || ap(t, 'D01', 0.08 + (i + 1) * 0.2) <= 0;
    gPlot(GS, sinP(n), c, { a: p * (latest ? 1 : 0.3), w: latest ? 4.5 : 2.5, n: 400 });
    mathText(s, 700 + i * 150, 255, 26, c, { alpha: p, upright: true });
  });
  mathText('sin x', gx(GS, 5.3), gy(GS, -1.4), 26, GOLD, { alpha: a, upright: true });
};

// ======================= 余项与误差（A166） =======================
SC.rem = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('Z02') - 0.1) {
    const a = ap(t, 'C05', 0);
    panel(660, 230, 680, 150, SQ.G.col, a * 0.8); label('拉格朗日余项', CX, 265, 24, SQ.G.col, a, { bold: true });
    richReveal([['Rₙ(x) = ', CR], ['f⁽ⁿ⁺¹⁾(ξ)', GOLD], [' / (n + 1)! · ', CR], ['xⁿ⁺¹', CYAN]], CX, 330, 34, t, P('C05', 0.15), { upright: true });
    richReveal([['ξ 在 0 和 x 之间', hexA(CR, 0.75)]], CX, 420, 24, t, P('C05', 0.7), { upright: true });
    if (t > S('G03') - 0.1) {
      slab('n = 0', 760, 520, 28, t, P('G03', 0.05), { bg: GOLD, c: COL.ink });
      richReveal([["f(x) − f(0) = f′(ξ) · x", CYAN]], 1060, 520, 32, t, P('G03', 0.2), { upright: true });
      richReveal([['= P3 的拉格朗日中值定理', SQ.R.col]], CX, 620, 30, t, P('G03', 0.6), { upright: true });
      if (t > P('G03', 0.75)) stampMark(1240, 650, 48, t, P('G03', 0.75), { text: '回收', col: SQ.R.col });
    }
    return;
  }
  const a = ap(t, 'Z02', 0);
  richReveal([['e ≈ 1 + 1 + 1/2 + 1/6 + 1/24 ≈ ', CR], ['2.708', GOLD]], CX, 240, 32, t, P('Z02', 0.05), { upright: true });
  label('误差  e − Sₙ', 700, 320, 22, hexA(CR, 0.75), a, { align: 'left' });
  let S0 = 0; const bars = [];
  for (let n = 0; n <= 5; n++) { S0 += 1 / fact(n); bars.push([n, Math.E - S0]); }
  bars.slice(1).forEach(([n, err], i) => {
    const p = ap(t, 'Z02', 0.15 + i * 0.13); if (p <= 0) return; const y = 380 + i * 85, w = 520 * err / (Math.E - 2) * eIO(p);
    label(`${n + 1} 项`, 700, y, 22, CR, p, { align: 'left' });
    ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = hexA(i > 2 ? GRN : RED, 0.75); ctx.fillRect(790, y - 18, Math.max(3, w), 36); ctx.restore();
    mathText(err.toFixed(4), 800 + Math.max(3, w) + 14, y, 22, CR, { alpha: p, upright: true });
  });
};

// ======================= 回收陷阱 =======================
SC.back = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['tan x = x + ', CR], ['x^3/3', CYAN], [' + …', CR]], CX, 280, 36, t, P('C06', 0.25), { upright: true });
  richReveal([['sin x = x − ', CR], ['x^3/6', CYAN], [' + …', CR]], CX, 370, 36, t, P('C06', 0.65), { upright: true });
  if (t > S('C07') - 0.1) {
    const p = ap(t, 'C07', 0.05); seg(700, 425, 1300, 425, CR, p, 2);
    richReveal([['tan x − sin x = ', CR], ['x^3/2', GOLD], [' + …', CR]], CX, 490, 36, t, P('C07', 0.1), { upright: true });
    richReveal([['(tan x − sin x)/x^3  →  ', CR], ['1/2', GOLD]], CX, 600, 38, t, P('C07', 0.35), { upright: true });
    if (t > P('C07', 0.55)) checkMark(1250, 600, 26, GRN, t, P('C07', 0.55));
    richReveal([['等价无穷小 = 展开式的第一项', SQ.K.col]], CX, 730, 32, t, P('C07', 0.7), { upright: true });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['lim', CR], ['  (cos x − 1 + x^2/2) / x^4', RED]], 860, 300, 38, t, P('C09', 0.15), { upright: true });
  label('x → 0', 860, 360, 24, CR, ap(t, 'C09', 0.3), { font: F_MATH });
  if (t > S('D02')) { richReveal([['cos x = 1 − x^2/2 + ', CR], ['x^4/24', GOLD], [' − …', CR]], 900, 480, 34, t, P('D02', 0.1), { upright: true }); richReveal([['答案  ', CR], ['1/24', GOLD]], 900, 600, 50, t, P('D02', 0.6), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { richReveal([['系数 = ', CR], ['f⁽ᵏ⁾(0)/k!', GOLD]], CX, 420, 42, t, P('C10', 0.15), { upright: true, alpha: ga }); richReveal([['加减里的高阶项：展开就看见', CYAN]], CX, 530, 36, t, P('C10', 0.55), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：描绘曲线', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('渐近线与作图六步 · Gemini 客串', CX, 590, 32, SQ.M.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 4 章 · P12 泰勒公式初步', '下一段：描绘曲线', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM4('GLM')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  EXS.forEach(([n, id, f]) => s(id, f, 'marimba', 0.18)); s('Z01', 0.15, 'tinkle', 0.2);
  [0, 1, 2, 3].forEach(i => { s('G01', 0.15 + i * 0.18, 'click', 0.16); s('G01', 0.25 + i * 0.18, 'check', 0.16); }); s('G02', 0.1, 'type', 0.16); s('G02', 0.4, 'shimmer', 0.2);
  FOUR.forEach(([x, c, id, f]) => s(id, f, 'type', 0.14)); s('C04', 0.55, 'ding', 0.2); [0, 1, 2, 3].forEach(i => s('D01', 0.08 + i * 0.2, 'swoosh_soft', 0.2)); s('D01', 0.75, 'sparkle', 0.2);
  s('C05', 0.15, 'type', 0.16); s('G03', 0.05, 'pop', 0.22); s('G03', 0.2, 'type', 0.14); s('G03', 0.75, 'stamp', 0.28);
  s('Z02', 0.05, 'type', 0.14); [0, 1, 2, 3, 4].forEach(i => s('Z02', 0.15 + i * 0.13, 'tick', 0.18));
  s('C06', 0.25, 'type', 0.14); s('C06', 0.65, 'type', 0.14); s('C07', 0.1, 'pluck', 0.2); s('C07', 0.35, 'ding_hi', 0.26); s('C07', 0.55, 'check', 0.22); s('C07', 0.7, 'shimmer', 0.18);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'type', 0.14); s('D02', 0.6, 'ding_hi', 0.28);
  s('C10', 0.15, 'pop', 0.2); s('C10', 0.55, 'shimmer', 0.18); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
