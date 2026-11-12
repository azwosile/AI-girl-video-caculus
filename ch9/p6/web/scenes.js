// 第 9 章 P6《从指数增长到 logistic》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.4 例 2。
// A401 梗的传播树：1 → 2 → 4 → 8 · A402 指数曲线撞上限 M，logistic 方向场 · A403 S 形解 P = 1000/(1 + 9e^(−0.08t))，拐点 500
const SC = {};
const TITLES = [['exp', '指数爆炸'], ['logi', '加个刹车'], ['solve', '解出 S 形'], ['quiz', '随堂一题'], ['outro', '小结']];

const P6 = t => 1000 / (1 + 9 * Math.exp(-0.08 * t)), E6 = t => 100 * Math.exp(0.08 * t), F6 = (t, p) => 0.08 * p * (1 - p / 1000);
const G6 = { cx: 620, cy: 790, ux: 5.6, uy: 0.44, x0: 0, x1: 105, y0: 0, y1: 1150 };
function axes6(a) { gAxes(G6, a * 0.75, { grid: false, ticks: { x: [[20, '20'], [40, '40'], [60, '60'], [80, '80'], [100, '100']], y: [[500, '500'], [1000, '1000']] } });
  label('t', gx(G6, 105) + 20, G6.cy + 30, 24, CR, a); label('P', gx(G6, 0) - 30, gy(G6, 1120), 26, CR, a, { bold: true }); }

// ======================= 指数爆炸（A401） =======================
SC.exp = t => {
  starfield(t); blueprint(0.3, 80);
  const ga = fadeOut(t, S('G01') + 0.3, 0.5);
  if (ga > 0) {   // 传播树
    for (let lv = 0; lv < 5; lv++) { const n = 2 ** lv, k = ap(t, 'B01', 0.1 + 0.15 * lv) * ga; if (k <= 0) continue;
      for (let i = 0; i < n; i++) { const X = 870 + (i - (n - 1) / 2) * (560 / Math.max(n, 2)) * (lv ? 1 : 0), Y = 260 + lv * 100;
        if (lv) { const pi = Math.floor(i / 2), pn = n / 2, PX = 870 + (pi - (pn - 1) / 2) * (560 / Math.max(pn, 2)) * (lv > 1 ? 1 : 0); seg(PX, Y - 100 + 14, X, Y - 14, SQ.B.col, k * 0.6, 2); }
        glowDot(X, Y, 10, SQ.B.col, k); } }
    if (t > S('C01')) richReveal([['dP/dt = kP  ⇒  ', CR], ['指数爆炸', RED]], 870, 780, 34, t, P('C01', 0.3), { upright: true, alpha: ga });
  }
  if (t > S('G01')) {
    const a = ap(t, 'G01', 0.2); axes6(a); gPlot(G6, E6, RED, { a, w: 4, xa: 0, xb: 40, p: prog(t, P('G01', 0.3), 0.8) });
    gH(G6, 1000, GOLD, ap(t, 'G01', 0.6), { w: 3, dash: [12, 8] }); label('上限 M：所有人都听过了', 900, gy(G6, 1000) - 26, 26, GOLD, ap(t, 'G01', 0.6), { bold: true });
  }
};

// ======================= 加个刹车（A402） =======================
SC.logi = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C02', 0); axes6(a);
  slopeField(G6, F6, a * 0.55, { sx: 7, sy: 100, len: 26, p: prog(t, P('C02', 0.3), 1.2) });
  goldBox(960, 240, 420, 64, 'dP/dt = kP (1 − P/M)', 32, ap(t, 'C02', 0.1));
  if (t > S('C03')) { label('P 小：括号 ≈ 1 → 像指数', 960, gy(G6, 150), 26, CYAN, ap(t, 'C03', 0.1), { bold: true }); label('P → M：括号 → 0 → 停', 960, gy(G6, 880), 26, RED, ap(t, 'C03', 0.5), { bold: true }); }
  if (t > S('C04')) { gH(G6, 1000, GOLD, ap(t, 'C04', 0.1), { w: 4 }); gH(G6, 0.01, GOLD, ap(t, 'C04', 0.1), { w: 6 });
    label('P = M', gx(G6, 100) + 10, gy(G6, 1000) - 24, 26, GOLD, ap(t, 'C04', 0.2), { bold: true }); label('P = 0', gx(G6, 100) + 10, gy(G6, 0) - 24, 26, GOLD, ap(t, 'C04', 0.2), { bold: true }); }
};

// ======================= 解出 S 形（A403） =======================
SC.solve = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0); axes6(a); gH(G6, 1000, GOLD, a * 0.6, { dash: [12, 8] });
  richReveal([['P = M / (1 + Ae^{−kt})', GOLD]], 960, 240, 32, t, P('C05', 0.3), { upright: true });
  if (t > S('G02')) { richReveal([['P = 1000 / (1 + 9e^{−0.08t})', SQ.B.col]], 960, 300, 30, t, P('G02', 0.2), { upright: true });
    gPlot(G6, P6, SQ.B.col, { a: ap(t, 'G02', 0.3), w: 5, xa: 0, xb: 105, p: prog(t, P('G02', 0.3), 1.4) }); gDot(G6, 0, 100, SQ.B.col, ap(t, 'G02', 0.3)); }
  if (t > S('B02')) [[40, '≈ 732', 0.05], [80, '≈ 985', 0.3]].forEach(([x, s, f]) => { const k = ap(t, 'B02', f); gDot(G6, x, P6(x), CYAN, k); label(s, gx(G6, x) + 50, gy(G6, P6(x)) + 30, 26, CYAN, k, { bold: true }); });
  if (t > S('B02')) { const k = ap(t, 'B02', 0.6); gH(G6, 900, RED, k * 0.6, { dash: [8, 6], xb: 54.9 }); gV(G6, 54.9, RED, k * 0.6, { ya: 0, yb: 900, dash: [8, 6] }); label('t ≈ 54.9', gx(G6, 54.9), G6.cy + 60, 24, RED, k, { bold: true }); }
  if (t > S('C06')) { const k = ap(t, 'C06', 0.2), x0 = Math.log(9) / 0.08; gDot(G6, x0, 500, GOLD, k); seg(gx(G6, x0 - 14), gy(G6, 500 - 20 * 14), gx(G6, x0 + 14), gy(G6, 500 + 20 * 14), GOLD, k, 4); label('拐点 P = M/2', gx(G6, x0) - 120, gy(G6, 500), 26, GOLD, k, { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['M = 1000，', CR], ['P = ？ 时增长最快', GOLD]], 860, 240, 36, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); axes6(a); gPlot(G6, P6, SQ.B.col, { a, w: 4 });
  if (t > S('D01')) { const x0 = Math.log(9) / 0.08; gH(G6, 500, GOLD, ap(t, 'D01', 0.1), { dash: [10, 6] }); gDot(G6, x0, 500, GOLD, ap(t, 'D01', 0.1)); label('P = 500', gx(G6, 90), gy(G6, 500) - 26, 32, GOLD, ap(t, 'D01', 0.2), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([['先 ', CR], ['指数', RED], [' → 后被 ', CR], ['上限', GOLD], [' 刹住 = S 形', CR]], CX, 400, 44, t, P('C09', 0.05), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：一阶线性方程与积分因子', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('MiniMax 的滤镜 · 排队的答案', CX, 610, 32, SQ.N.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 9 章 · P6 logistic', '下一段：一阶线性', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM9('豆包')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  [0.1, 0.25, 0.4, 0.55, 0.7].forEach(f => s('B01', f, 'pop', 0.14)); s('C01', 0.3, 'riser', 0.14); s('G01', 0.3, 'whoosh', 0.14); s('G01', 0.6, 'thud', 0.2);
  s('C02', 0.1, 'ding', 0.2); s('C02', 0.3, 'shimmer', 0.12); s('C03', 0.1, 'pop', 0.16); s('C03', 0.5, 'pop', 0.16); s('C04', 0.1, 'ding', 0.2);
  s('C05', 0.3, 'pop', 0.18); s('G02', 0.2, 'pop', 0.16); s('G02', 0.3, 'riser', 0.12); s('B02', 0.05, 'marimba', 0.14); s('B02', 0.3, 'marimba', 0.14); s('B02', 0.6, 'tick', 0.18); s('C06', 0.2, 'ding_hi', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
