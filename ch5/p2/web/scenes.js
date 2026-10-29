// 第 5 章 P2《面积问题：上和与下和》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A192 4 → 8 → n 条长条夹住面积 · A193 Lₙ、Rₙ 数值表 · A194 Rₙ 的代数化简 · A195 上和减下和 = 最右一条
const SC = {};
const TITLES = [['hook', '弯边下的面积'], ['r4', '4 个长条'], ['more', '切得更细'], ['lim', '取极限'], ['quiz', '随堂一题'], ['outro', '小结']];
const F2 = x => x * x;
const GA = { cx: 690, cy: 790, ux: 560, uy: 540, x0: -0.06, x1: 1.12, y0: -0.05, y1: 1.08 };
function base(t, G, a, o = {}) {
  gAxes(G, a, { grid: false, xl: 'x', ticks: o.ticks || { x: [[1, '1']], y: [[1, '1']] } });
  if (o.area !== false) gArea(G, F2, 0, 1, a * (o.areaA ?? 1));
  gPlot(G, F2, RED, { a, xa: 0, xb: 1.08, w: 4 });
  if (o.lab !== false) mathText('y = x²', gx(G, 1.02), gy(G, 1.02) - 34, 26, RED, { align: 'center', alpha: a, upright: true });
}

// ======================= 弯边下的面积 =======================
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'D01', 0); base(t, GA, a);
  label('A = ？', gx(GA, 0.72), gy(GA, 0.18), 40, GOLD, ap(t, 'D01', 0.4), { bold: true });
  if (t > S('B01')) { const b = ap(t, 'B01', 0.3) * fadeOut(t, S('C01') + 0.3); label('大概 0.5？', 1300, 330, 38, SQ.B.col, b, { bold: true }); }
  if (t > S('C01')) gRects(GA, F2, 0, 1, 4, 'R', INV, ap(t, 'C01', 0.5), { k: 4 * prog(t, P('C01', 0.5), 0.6), fa: 0.08 });
};

// ======================= 4 个长条（A192） =======================
SC.r4 = t => {
  starfield(t); blueprint(0.4, 80);
  base(t, GA, 1, { areaA: 0.7 });
  const showR = t < S('G01') || t > S('C03'), showL = t > S('G01');
  if (showR) gRects(GA, F2, 0, 1, 4, 'R', INV, 1, { k: t < S('G01') ? 4 * prog(t, P('C02', 0.1), 1.2) : 4, dots: true, fa: 0.18 });
  if (showL) gRects(GA, F2, 0, 1, 4, 'L', GRN, ap(t, 'G01', 0), { k: 4 * prog(t, P('G01', 0.1), 0.9), dots: true, fa: 0.3 });
  [0.25, 0.5, 0.75].forEach(v => mathText(['¼', '½', '¾'][Math.round(v * 4) - 1], gx(GA, v), gy(GA, 0) + 30, 24, CR, { align: 'center', alpha: 0.8, upright: true }));
  richReveal([['R₄ = 15/32 = ', INV], ['0.46875', INV]], 1280, 280, 30, t, P('C02', 0.6), { upright: true });
  if (showL) richReveal([['L₄ = 7/32 = ', GRN], ['0.21875', GRN]], 1280, 340, 30, t, P('G01', 0.4), { upright: true });
  if (t > S('C03') - 0.1) { panel(1050, 400, 440, 80, GOLD, ap(t, 'C03', 0)); richReveal([['0.21875 < ', GRN], ['A', GOLD], [' < 0.46875', INV]], 1270, 440, 30, t, P('C03', 0.15), { upright: true }); }
  if (t > S('B02')) { const b = ap(t, 'B02', 0); label('0.5', 1270, 530, 34, SQ.B.col, b, { font: F_MATH, bold: true }); crossMark(1270, 530, 28, RED, t, P('B02', 0.2)); }
};

// ======================= 切得更细（A192 / A195） =======================
SC.more = t => {
  starfield(t); blueprint(0.4, 80);
  base(t, GA, 1, { areaA: 0.5 });
  const nn = t < S('G02') ? (t < P('C04', 0.35) ? 8 : Math.round(8 * Math.pow(2, Math.min(3, 3 * prog(t, P('C04', 0.4), 2.0))))) : 16;
  gRects(GA, F2, 0, 1, nn, 'R', INV, 1, { fa: 0.12 }); gRects(GA, F2, 0, 1, nn, 'L', GRN, 1, { fa: 0.3 });
  label(`n = ${nn}`, 1300, 260, 36, GOLD, 1, { font: F_MATH, bold: true });
  const fR = riemann(F2, 0, 1, nn, 'R'), fL = riemann(F2, 0, 1, nn, 'L');
  mathText(`${fL.toFixed(4)} < A < ${fR.toFixed(4)}`, 1290, 330, 28, CR, { align: 'center', upright: true });
  if (t > S('G02')) {
    // 上和比下和多出的小块：全部右移拼成最右边的一列
    const g = ap(t, 'G02', 0), mv = eIO(prog(t, P('G02', 0.25), 1.2)), dx = 1 / 16;
    ctx.save(); ctx.globalAlpha *= g;
    for (let i = 0; i < 16; i++) { const x0 = i * dx, ya = F2(x0), yb = F2(x0 + dx), X = lerp(gx(GA, x0), gx(GA, 1 + 0.06), mv); ctx.fillStyle = hexA(GOLD, 0.6); ctx.fillRect(X, gy(GA, yb), dx * GA.ux, (yb - ya) * GA.uy); }
    ctx.restore();
    if (mv > 0.9) { label('上和 − 下和 = 1 × 1/n', 1310, 420, 30, GOLD, ap(t, 'G02', 0.7), { bold: true }); label('→ 0', 1310, 470, 30, GOLD, ap(t, 'G02', 0.8), { font: F_MATH }); }
  }
};

// ======================= 取极限（A193 / A194） =======================
const TBL = [[10, '0.2850000', '0.3850000'], [30, '0.3168519', '0.3501852'], [100, '0.3283500', '0.3383500'], [1000, '0.3328335', '0.3338335']];
SC.lim = t => {
  starfield(t); blueprint(0.4, 80);
  const G = { cx: 580, cy: 760, ux: 300, uy: 290, x0: -0.05, x1: 1.1, y0: -0.05, y1: 1.08 };
  base(t, G, 1, { areaA: 0.5, lab: false }); gRects(G, F2, 0, 1, 40, 'R', INV, 0.9, { fa: 0.15 });
  richReveal([['Rₙ = ', CR], ['(1/n)·Σ (i/n)²', INV], [' = ', CR], ['(1/n³)·Σ i²', CYAN]], 1170, 250, 32, t, P('C05', 0.1), { upright: true });
  if (t > S('C06') - 0.1) { richReveal([['= (1/n³)·n(n + 1)(2n + 1)/6', CYAN]], 1170, 320, 30, t, P('C06', 0.1), { upright: true }); richReveal([['= (n + 1)(2n + 1)/(6n²)  →  ', CR], ['1/3', GOLD]], 1170, 390, 32, t, P('C06', 0.5), { upright: true }); }
  if (t > S('D02') - 0.1) {
    const a = ap(t, 'D02', 0); panel(960, 450, 420, 230, SQ.D.col, a);
    mathText('n         Lₙ              Rₙ', 1170, 480, 22, CR, { align: 'center', alpha: a, upright: true });
    TBL.forEach(([n, l, r], i) => { const p = ap(t, 'D02', 0.1 + i * 0.12); mathText(`${n}`, 1010, 520 + i * 40, 22, GOLD, { align: 'left', alpha: p, upright: true }); mathText(l, 1150, 520 + i * 40, 22, GRN, { align: 'center', alpha: p, upright: true }); mathText(r, 1300, 520 + i * 40, 22, INV, { align: 'center', alpha: p, upright: true }); });
  }
  if (t > S('C07') - 0.1) { panel(700, 840, 760, 80, GOLD, ap(t, 'C07', 0)); richReveal([['A = lim Rₙ = lim Σ f(xᵢ)Δx', GOLD]], 1080, 880, 32, t, P('C07', 0.1), { upright: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  const G = { cx: 620, cy: 760, ux: 380, uy: 370, x0: -0.05, x1: 1.1, y0: -0.05, y1: 1.08 };
  base(t, G, ap(t, 'C09', 0), { lab: false }); gRects(G, F2, 0, 1, 2, 'R', INV, ap(t, 'C09', 0.4), { dots: true });
  richReveal([['2 个右端点长条：R₂ = ？', CR]], 1180, 450, 34, t, P('C09', 0.1), { upright: true });
  if (t > S('D03')) { richReveal([['½·¼ + ½·1 = ', CR], ['5/8', GOLD]], 1180, 560, 40, t, P('D03', 0.2), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { base(t, GA, ga * 0.8); gRects(GA, F2, 0, 1, 12, 'R', INV, ga * 0.8, { fa: 0.1 }); gRects(GA, F2, 0, 1, 12, 'L', GRN, ga * 0.8, { fa: 0.25 }); richReveal([['下和 < A < 上和  ⟶  取极限 = A', GOLD]], CX, 230, 38, t, P('C10', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：距离问题 · 速度表算路程', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('Grok 的里程表坏了', CX, 590, 32, SQ.X.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 5 章 · P2 上和与下和', '下一段：速度表算路程', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM5('豆包')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.4, 'pop', 0.18); s('B01', 0.3, 'pop', 0.18); s('C01', 0.5, 'whoosh', 0.16);
  [0.1, 0.4, 0.7, 1.0].forEach(f => s('C02', 0.1 + f * 0.3, 'pluck', 0.12)); s('C02', 0.6, 'type', 0.14); s('G01', 0.1, 'whoosh', 0.16); s('G01', 0.4, 'type', 0.14);
  s('C03', 0.15, 'ding', 0.2); s('B02', 0.2, 'buzz', 0.2);
  s('C04', 0.4, 'warp', 0.18); s('G02', 0.25, 'whoosh', 0.18); s('G02', 0.7, 'ding', 0.2);
  s('C05', 0.1, 'type', 0.14); s('C06', 0.1, 'type', 0.14); s('C06', 0.5, 'ding_hi', 0.24); TBL.forEach((r, i) => s('D02', 0.1 + i * 0.12, 'tick', 0.12)); s('C07', 0.1, 'swell', 0.22);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.2, 'ding_hi', 0.28);
  s('C10', 0.15, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
