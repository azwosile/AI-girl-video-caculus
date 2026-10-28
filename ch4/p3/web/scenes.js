// 第 4 章 P3《罗尔与拉格朗日》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A131 罗尔：水平线从高处下落切到山顶 · A132 三个条件的反例逐个失效 · A133 “斜过来”：剪切变换把罗尔图变成拉格朗日图 · A134 割线平移扫描，读出 c
const SC = {};
const TITLES = [['rolle', '罗尔定理'], ['cond', '条件缺一不可'], ['lag', '拉格朗日中值定理'], ['ex', '验证一例'], ['app', '用罗尔证明有根'], ['quiz', '随堂一题'], ['outro', '小结']];

// ---------- 罗尔曲线与剪切 ----------
const GR = { cx: 655, cy: 780, ux: 70, uy: 52, x0: -0.5, x1: 6.6, y0: 0, y1: 8.4 };
const rF = x => 1 + 0.3 * x * (6 - x) * (1 + 0.1 * x);
const RC = (() => { let b = 0, bx = 0; for (let i = 1; i < 600; i++) { const x = i / 100, y = rF(x); if (y > b) { b = y; bx = x; } } return bx; })();
const K = 0.5;   // 斜过来后的割线斜率
function rolleView(t, s, a, o = {}) {
  const f = x => rF(x) + K * s * x;
  gAxes(GR, a, { grid: false, ticks: { x: [[0, 'a'], [6, 'b']] } });
  gPlot(GR, f, RED, { a, xa: 0, xb: 6, p: o.p ?? 1 });
  gDot(GR, 0, f(0), RED, a); gDot(GR, 6, f(6), RED, a);
  gV(GR, 0, CR, a * 0.3, { ya: 0, yb: f(0), dash: [5, 6] }); gV(GR, 6, CR, a * 0.3, { ya: 0, yb: f(6), dash: [5, 6] });
  return f;
}
SC.rolle = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'R01', 0);
  const f = rolleView(t, 0, a, { p: eIO(prog(t, P('R01', 0.15), 1.4)) });
  // 两端等高
  if (t > P('R01', 0.55)) { const e = ap(t, 'R01', 0.55); gH(GR, rF(0), GOLD, e * 0.7, { xa: -0.2, xb: 6.3, dash: [8, 8] }); label('一样高', gx(GR, 6.3), gy(GR, rF(0)) - 24, 22, GOLD, e, { bold: true, align: 'right' }); }
  // 水平线下落，切到山顶（A131）
  const dp = eIO(prog(t, P('R01', 0.7), D('R01') * 0.3 + 0.6)), yl = lerp(8.2, rF(RC), dp);
  if (dp > 0) { gH(GR, yl, SEC, a, { xa: 0.2, xb: 5.8, w: 3.5 }); if (dp >= 1) { gDot(GR, RC, rF(RC), GOLD, 1); label('c', gx(GR, RC), gy(GR, 0) + 34, 26, GOLD, 1, { font: F_MATH }); gV(GR, RC, GOLD, 0.5, { ya: 0, yb: rF(RC), dash: [6, 6] }); } }
  if (t > S('C02') - 0.1) {
    const fa = fadeOut(t, S('C03'), 0.3);
    panel(640, 170, 720, 150, SQ.R.col, ap(t, 'C02', 0) * fa);
    richReveal([['[a, b] 上连续', RED], ['，', CR], ['(a, b) 内可导', GRN], ['，', CR], ['f(a) = f(b)', GOLD]], 1000, 225, 30, t, P('C02', 0.1), { upright: true, alpha: fa });
    richReveal([["⇒ 存在 c ∈ (a, b)，f'(c) = 0", SEC]], 1000, 285, 32, t, P('C02', 0.6), { upright: true, alpha: fa });
  }
  if (t > S('C03') - 0.1) {
    [['最值定理：有最高点', GOLD, 0.1], ['两端等高 → 最高点在中间', CR, 0.35], ["费马定理：f'(c) = 0", SEC, 0.7]].forEach(([s, c, k], i) => richReveal([[s, c]], 660, 210 + i * 50, 28, t, P('C03', k), { align: 'left', upright: true }));
    const q = ap(t, 'C03', 0.15); if (q > 0) { ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(gx(GR, RC), gy(GR, rF(RC)), 22, 0, 7); ctx.stroke(); ctx.restore(); }
  }
};

// ======================= 三个反例（A132） =======================
const PX = [630, 870, 1110], PW = 220;
const mini = i => ({ cx: PX[i] + 25, cy: 650, ux: 34, uy: 40, x0: 0, x1: 5.5, y0: 0, y1: 6 });
SC.cond = t => {
  starfield(t); blueprint(0.4, 80);
  const heads = [['断开', 0.03], ['尖点', 0.33], ['两端不等高', 0.62]];
  if (t > S('R02')) [['连续', RED], ['可导', GRN], ['两端等高', GOLD]].forEach(([s, c], i) => slab(s, PX[i] + PW / 2, 230, 26, t, P('R02', 0.2 + 0.15 * i), { bg: c, c: i ? COL.ink : CR, rot: 0 }));
  heads.forEach(([h, f], i) => {
    const a = ap(t, 'C04', f); if (a <= 0) return; const G = mini(i);
    panel(PX[i], 300, PW, 400, RED, a); label(h, PX[i] + PW / 2, 335, 26, RED, a, { bold: true });
    ctx.save(); ctx.globalAlpha *= a; gAxes(G, 1, { grid: false });
    if (i === 0) { gPlot(G, x => 1 + 0.6 * x, RED, { xa: 0, xb: 4.8, noHead: true }); gDot(G, 0, 1, RED, 1); gDot(G, 4.8, 3.88, RED, 1, true); gDot(G, 4.8, 1, RED, 1); }
    if (i === 1) { gPlot(G, x => 4.6 - 1.4 * Math.abs(x - 2.4), RED, { xa: 0, xb: 4.8 }); glowDot(gx(G, 2.4), gy(G, 4.6), 9, COL.red); }
    if (i === 2) { gPlot(G, x => 1 + 0.12 * x * x + 0.3 * x, RED, { xa: 0, xb: 4.8 }); gH(G, 1, GOLD, 0.6, { xa: 0, xb: 4.8, dash: [6, 6] }); }
    ctx.restore();
    crossMark(PX[i] + PW - 30, 335, 28, COL.red, t, P('C04', f + 0.2));
    label('找不到水平切线', PX[i] + PW / 2, 740, 20, hexA(CR, 0.75), ap(t, 'C04', f + 0.22));
  });
};

// ======================= 斜过来：拉格朗日（A133） =======================
SC.lag = t => {
  starfield(t); blueprint(0.4, 80);
  const s = eIO(prog(t, P('C05', 0.2), D('C05') * 0.7)), a = 1;
  const f = rolleView(t, s, a);
  const yT = rF(RC) + K * s * RC;
  // 原水平线跟着剪切成平行于割线的切线
  gLine(GR, K * s, RC, yT, RC - 2.4, RC + 2.4, GOLD, 1, 3.5); gDot(GR, RC, yT, GOLD, 1);
  label('c', gx(GR, RC), gy(GR, 0) + 34, 26, GOLD, 1, { font: F_MATH });
  const sa = ap(t, 'C05', 0.55); gLine(GR, K * s, 0, f(0), 0, 6, SEC, sa, 3.5);
  if (t > S('C06') - 0.1) {
    termCard('Mean Value Theorem', '拉格朗日中值定理', 1000, 230, t, P('C06', 0.1), { out: S('G01') });
    const fa = ap(t, 'C06', 0.5) * fadeOut(t, S('G01'), 0.3);
    if (fa > 0) { mathText("f'(c) =", 800, 372, 34, GOLD, { alpha: fa, upright: true, glow: 10 }); frac([['f(b) − f(a)', SEC]], [['b − a', SEC]], 935, 362, 32, fa, SEC); }
  }
  // G01：减去割线 → 两端为 0 → 罗尔（小窗）
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0.1), Gm = { cx: 1090, cy: 420, ux: 40, uy: 40, x0: -0.3, x1: 6.4, y0: -0.5, y1: 4.6 };
    panel(1060, 180, 300, 300, GRN, g * fadeOut(t, S('R03') + 0.5, 0.4));
    ctx.save(); ctx.globalAlpha *= g * fadeOut(t, S('R03') + 0.5, 0.4);
    label('g = f − 割线', 1210, 210, 22, GRN, 1, { bold: true });
    gAxes(Gm, 1, { grid: false }); gPlot(Gm, x => rF(x) - rF(0), GRN, { xa: 0, xb: 6, p: eIO(prog(t, P('G01', 0.3), 0.8)) });
    gDot(Gm, 0, 0, GRN, 1); gDot(Gm, 6, 0, GRN, 1); gDot(Gm, RC, rF(RC) - rF(0), GOLD, ap(t, 'G01', 0.75));
    label('两端都是 0 → 罗尔', 1210, 455, 20, CR, ap(t, 'G01', 0.6), { bold: true });
    ctx.restore();
  }
  if (t > S('R03')) { label('都灵 → 巴黎', 1000, 250, 28, SQ.R.col, ap(t, 'R03', 0.2) * fadeOut(t, S('D01'), 0.3), { bold: true }); }
  if (t > S('D01')) { gauge(1220, 330, 95, 120, ap(t, 'D01', 0.2), { lim: 100 }); glowText('平均速度 = 某一刻的瞬时速度', 980, 930, 30, GOLD, t, P('D01', 0.35)); }
};

// ======================= 例：x³ − x（A134） =======================
const GE = { cx: 677, cy: 760, ux: 190, uy: 48, x0: -0.3, x1: 2.3, y0: -1, y1: 10 };
const eF = x => x * x * x - x, eD = x => 3 * x * x - 1, EC = 2 / Math.sqrt(3);
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C07', 0);
  richReveal([['f(x) = x^3 − x', RED], ['，  [0, 2]', GOLD]], 660, 200, 32, t, P('C07', 0.2), { align: 'left', upright: true });
  gAxes(GE, a, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[3, '3'], [6, '6']] } });
  gPlot(GE, eF, RED, { a, xa: -0.25, xb: 2.15, p: eIO(prog(t, P('C07', 0.3), 1)) });
  if (t > S('C08') - 0.1) {
    const sa = ap(t, 'C08', 0.05); gLine(GE, 3, 0, 0, 0, 2, SEC, sa, 3.5); gDot(GE, 0, 0, SEC, sa); gDot(GE, 2, 6, SEC, sa);
    // 扫描点：切线斜率读数逐渐逼近 3
    const sx = lerp(0.2, EC, eIO(prog(t, P('C08', 0.3), D('C08') * 0.55)));
    const ka = ap(t, 'C08', 0.3);
    if (ka > 0) { gLine(GE, eD(sx), sx, eF(sx), sx - 0.6, sx + 0.6, GOLD, ka, 3.5); gDot(GE, sx, eF(sx), GOLD, ka); }
    panel(1150, 260, 205, 210, GOLD, ap(t, 'C08', 0.05));
    label('割线斜率', 1252, 295, 22, SEC, sa, { bold: true }); mathText('3', 1252, 345, 40, SEC, { align: 'center', alpha: sa, upright: true, glow: 10 });
    label('切线斜率', 1252, 385, 22, GOLD, ka, { bold: true }); mathText(eD(sx).toFixed(3), 1252, 440, 40, Math.abs(eD(sx) - 3) < 0.01 ? GRN : GOLD, { align: 'center', alpha: ka, upright: true, glow: 10 });
    richReveal([['3c^2 − 1 = 3  ⇒  c = 2/√3 ≈ 1.155', GOLD]], 660, 255, 30, t, P('C08', 0.55), { align: 'left', upright: true });
    if (t > P('C08', 0.85)) { gV(GE, EC, GOLD, 0.6, { ya: 0, yb: eF(EC), dash: [6, 6] }); label('c ≈ 1.155', gx(GE, EC), gy(GE, 0) + 50, 22, GOLD, ap(t, 'C08', 0.85), { font: F_MATH, bold: true }); }
  }
  if (t > S('R04')) { gBand(GE, 0, 2, -1, 10, 'rgba(255,138,61,0.07)', ap(t, 'R04', 0.1)); checkMark(1252, 540, 44, GRN, t, P('R04', 0.4)); }
};

// ======================= 用罗尔证明有根 =======================
const GP = { cx: 1030, cy: 700, ux: 280, uy: 120, x0: -0.08, x1: 1.12, y0: -1.2, y1: 1.4 };
const pF = x => 1.1 * Math.sin(Math.PI * x) * (1 - 1.3 * x) + 0.0;
SC.app = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C09', 0.1);
  panel(620, 170, 740, 175, CYAN, a);
  richReveal([['已知  ', CR], ['c_0 + c_1/2 + … + c_n/(n+1) = 0', GOLD]], 645, 225, 30, t, P('C09', 0.2), { align: 'left', upright: true });
  richReveal([['证明  ', CR], ['c_0 + c_1x + … + c_nx^n = 0', RED], [' 在 (0, 1) 内有根', CR]], 645, 295, 30, t, P('C09', 0.55), { align: 'left', upright: true });
  if (t > S('G02') - 0.1) {
    const b = ap(t, 'G02', 0);
    richReveal([['F(x) = c_0x + c_1x^2/2 + … + c_nx^{n+1}/(n+1)', GRN]], 645, 400, 28, t, P('G02', 0.1), { align: 'left', upright: true });
    richReveal([["F'(x) = 原多项式", RED]], 645, 455, 28, t, P('G02', 0.35), { align: 'left', upright: true });
    richReveal([['F(0) = 0', GOLD], ['，  ', CR], ['F(1) = 已知的和 = 0', GOLD]], 645, 510, 28, t, P('G02', 0.6), { align: 'left', upright: true });
    gAxes(GP, b, { grid: false, ticks: { x: [[1, '1']] } });
    gPlot(GP, pF, GRN, { a: b, xa: 0, xb: 1, p: eIO(prog(t, P('G02', 0.5), 1)) });
    gDot(GP, 0, 0, GOLD, ap(t, 'G02', 0.6)); gDot(GP, 1, 0, GOLD, ap(t, 'G02', 0.8));
  }
  if (t > S('C10') - 0.1) {
    let bx = 0, by = -9; for (let i = 1; i < 100; i++) { const x = i / 100; if (pF(x) > by) { by = pF(x); bx = x; } }
    const c = ap(t, 'C10', 0.3); gH(GP, by, SEC, c, { xa: bx - 0.25, xb: bx + 0.25, w: 3.5 }); gDot(GP, bx, by, GOLD, c);
    richReveal([["F'(c) = 0  →  c 就是根", SEC]], 645, 600, 30, t, P('C10', 0.45), { align: 'left', upright: true });
    if (t > P('C10', 0.45)) burst(t, P('C10', 0.45), gx(GP, bx), gy(GP, by), GOLD, 70, 10);
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 700, cy: 780, ux: 160, uy: 110, x0: -0.3, x1: 2.4, y0: -0.3, y1: 4.4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C11', 0, 0.5) * 0.42, 78);
  if (t < S('C12')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C11') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['f(x) = x^2', RED], ['，  [0, 2]', GOLD], ['，  c = ?', CR]], 900, 230, 36, t, P('C12', 0.1), { upright: true });
  const a = ap(t, 'C12', 0.3);
  gAxes(GQ, a, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[4, '4']] } });
  gPlot(GQ, x => x * x, RED, { a, xa: -0.2, xb: 2.1 }); gLine(GQ, 2, 0, 0, 0, 2, SEC, a, 3); gDot(GQ, 0, 0, SEC, a); gDot(GQ, 2, 4, SEC, a);
  if (t > S('D02')) { const d = ap(t, 'D02', 0.5); gLine(GQ, 2, 1, 1, 0.3, 1.8, GOLD, d, 4); gDot(GQ, 1, 1, GOLD, d); gV(GQ, 1, GOLD, d * 0.6, { ya: 0, yb: 1, dash: [6, 6] }); label('c = 1（中点）', gx(GQ, 1) + 10, gy(GQ, 0) + 50, 26, GOLD, d, { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C13', 0) * fadeOut(t, S('C14'), 0.4);
  if (ga > 0) {
    const s = eIO(prog(t, P('C13', 0.3), 1.2)), G = { cx: 760, cy: 640, ux: 60, uy: 40, x0: -0.3, x1: 6.4, y0: 0, y1: 8.4 }, f = x => rF(x) + K * s * x;
    ctx.save(); ctx.globalAlpha *= ga; gAxes(G, 1, { grid: false }); gPlot(G, f, RED, { xa: 0, xb: 6 }); gLine(G, K * s, RC, f(RC), RC - 2, RC + 2, GOLD, 1, 3.5); gDot(G, RC, f(RC), GOLD, 1); ctx.restore();
    slab(s < 0.5 ? '罗尔：平的' : '拉格朗日：斜的', 1180, 380, 30, t, P('C13', 0.1), { bg: s < 0.5 ? SEC : GOLD, c: COL.ink, rot: 0 });
    label('靠：最值定理 + 费马定理', 1180, 470, 24, CR, ga * ap(t, 'C13', 0.6), { bold: true });
  }
  if (t > S('C14') - 0.1) { glowText('下一段：中值定理的用法 · 恒等式与不等式', CX, 500, 46, CR, t, P('C14', 0.15)); glowText('混元客串', CX, 590, 32, SQ.H.col, t, P('C14', 0.45), { bold: false }); }
  credits(t, E('C14') + 0.38, 'AI娘微积分课 · 第 4 章 · P3 罗尔与拉格朗日', '下一段：恒等式与不等式', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM4('Mistral')]);
};

SC.__overlay = t => { if (t < E('C14') + 0.25) lecturer(t, 'C', 255, -5, E('C14') + 0.48, { h: 710 }); };
SC.__noTag = E('C14') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C14') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('R01', 0.15, 'riser', 0.12); s('R01', 0.55, 'pluck', 0.2); s('R01', 0.7, 'whoosh', 0.2); sfx(P('R01', 0.7) + D('R01') * 0.3 + 0.6, 'ding_hi', 0.28);
  s('C02', 0.1, 'type', 0.16); s('C02', 0.6, 'slam', 0.24); [0.1, 0.35, 0.7].forEach(f => s('C03', f, 'pop', 0.2));
  [0.2, 0.35, 0.5].forEach(f => s('R02', f, 'pop', 0.2)); [0.03, 0.33, 0.62].forEach(f => { s('C04', f, 'swoosh_in', 0.16); s('C04', f + 0.2, 'buzz', 0.2); });
  s('C05', 0.2, 'warp', 0.2); s('C05', 0.55, 'pluck', 0.2); s('C06', 0.1, 'slam', 0.28); s('C06', 0.5, 'type', 0.16);
  s('G01', 0.1, 'pop', 0.2); s('G01', 0.3, 'riser', 0.12); s('G01', 0.75, 'ding', 0.24); s('R03', 0.2, 'tinkle', 0.2); s('D01', 0.2, 'hum', 0.18); s('D01', 0.35, 'shimmer', 0.2);
  s('C07', 0.2, 'type', 0.16); s('C08', 0.05, 'pop', 0.2); s('C08', 0.3, 'riser', 0.12); s('C08', 0.55, 'type', 0.16); s('C08', 0.85, 'ding_hi', 0.28); s('R04', 0.4, 'check', 0.3);
  s('C09', 0.2, 'type', 0.16); s('C09', 0.55, 'type', 0.16); s('G02', 0.1, 'type', 0.16); s('G02', 0.6, 'pop', 0.2); s('G02', 0.8, 'pop', 0.2); s('C10', 0.45, 'ding_hi', 0.28);
  s('C11', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.5, 'ding_hi', 0.3);
  s('C13', 0.3, 'warp', 0.18); s('C14', 0.15, 'swell', 0.3);
})();
finalize();
