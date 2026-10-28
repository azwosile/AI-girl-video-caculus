// 第 4 章 P10《数列极限：ε-N 与单调有界》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A156 点列与 ε 带：N 之后的点全部落进带里 · A157 骑士决斗：ε 越出越小，N 越回越大 · A158 (1 + 1/n)ⁿ 点列爬升、被上界 3 拦住
const SC = {};
const TITLES = [['def', 'ε-N 定义'], ['duel', '骑士决斗'], ['mono', '单调有界'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 定义（A156） =======================
const GD = { cx: 650, cy: 760, ux: 17, uy: 230, x0: 0, x1: 40, y0: 0, y1: 2 };
const an = n => 1 + ((n % 2) ? -1 : 1) / n;
SC.def = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(GD, a, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30']], y: [[1, 'A']] }, xl: 'n', yl: 'aₙ' });
  const eps = t < S('C02') ? 0 : lerp(0.55, 0.16, eIO(prog(t, P('C02', 0.35), 2.2))), Nn = eps ? Math.floor(1 / eps) : 99;
  const ea = ap(t, 'C02', 0.2);
  if (eps) { gBand(GD, 0, 40, 1 - eps, 1 + eps, 'rgba(92,200,232,0.12)', ea); gH(GD, 1 + eps, CYAN, ea * 0.7, { dash: [8, 6] }); gH(GD, 1 - eps, CYAN, ea * 0.7, { dash: [8, 6] }); label('ε', gx(GD, 40) + 22, gy(GD, 1 + eps / 2), 26, CYAN, ea, { font: F_MATH }); }
  gH(GD, 1, GOLD, a * 0.5, { dash: [4, 6] });
  for (let n = 1; n <= 38; n++) {
    const p = a * eIO(prog(t, P('C01', 0.15 + n * 0.02), 0.3)); if (p <= 0) continue;
    const inb = eps && n > Nn; gDot(GD, n, an(n), inb ? GRN : (eps ? hexA(RED, 0.9) : SQ.Q.col), p);
  }
  if (eps) { gV(GD, Nn + 0.5, GOLD, ea, { dash: [6, 6], ya: 0, yb: 2 }); label(`N = ${Nn}`, gx(GD, Nn + 0.5), gy(GD, 2) - 20, 24, GOLD, ea, { font: F_MATH, bold: true }); label('之后全部落进带里', gx(GD, 30), gy(GD, 0.35), 22, GRN, ea * ap(t, 'C02', 0.6)); }
  richReveal([['∀ε > 0, ∃N,  n > N ⇒ |aₙ − A| < ε', CR]], CX, 230, 32, t, P('C02', 0.1), { upright: true });
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0); panel(820, 840, 380, 80, SQ.G.col, g);
    richReveal([['δ → N', GOLD], ['   足够近 → 足够靠后', CR]], CX + 10, 880, 26, t, P('G01', 0.3), { upright: true });
  }
};

// ======================= 骑士决斗（A157） =======================
const GV = { cx: 650, cy: 670, ux: 17, uy: 600, x0: 0, x1: 40, y0: -0.15, y1: 0.6 };
SC.duel = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'R01', 0);
  // 双方卡牌
  const row = (y, l, r, c0, t0, t1) => {
    const p = ap(t, t0[0], t0[1]); if (p > 0) { panel(640, y - 34, 260, 68, SQ.D.col, p); mathText(l, 770, y, 30, SQ.D.col, { align: 'center', alpha: p, upright: true }); }
    const q = ap(t, t1[0], t1[1]); if (q > 0) { panel(1100, y - 34, 260, 68, SQ.R.col, q); mathText(r, 1230, y, 30, SQ.R.col, { align: 'center', alpha: q, upright: true }); seg(905, y, 1095, y, hexA(CR, 0.5), q, 2, [6, 6]); }
  };
  label('大肥鱼出 ε', 770, 240, 24, SQ.D.col, a, { bold: true }); label('Mistral 回 N', 1230, 240, 24, SQ.R.col, a, { bold: true });
  richReveal([['aₙ = 1/n  →  0', CR]], CX, 300, 30, t, P('R01', 0.5), { upright: true });
  if (t < S('D02') - 0.1) {
    row(380, 'ε = 1/10', 'N = 10', 0, ['D01', 0.1], ['R02', 0.05]);
    if (t > S('R02') - 0.1) {
      const b = ap(t, 'R02', 0); const G = Object.assign({}, GV, { cy: 820, uy: 800, y1: 0.45 });
      gAxes(G, b, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30']] }, xl: 'n' });
      gBand(G, 0, 40, -0.1, 0.1, 'rgba(92,200,232,0.12)', b); gH(G, 0.1, CYAN, b * 0.7, { dash: [8, 6] });
      for (let n = 1; n <= 38; n++) { const p = b * eIO(prog(t, P('R02', 0.15 + n * 0.015), 0.25)); if (p > 0) gDot(G, n, 1 / n, n > 10 ? GRN : hexA(RED, 0.9), p); }
      gV(G, 10.5, GOLD, b, { dash: [6, 6], ya: 0, yb: 0.42 }); label('N = 10', gx(G, 10.5), gy(G, 0.42) - 18, 22, GOLD, b, { font: F_MATH, bold: true });
    }
    return;
  }
  row(380, 'ε = 1/10', 'N = 10', 0, ['D01', 0], ['R02', 0]);
  row(470, 'ε = 1/1000', 'N = 1000', 0, ['D02', 0.05], ['R03', 0.05]);
  const r = ap(t, 'R03', 0.35);
  if (r > 0) { row(560, 'ε = …', 'N = ⌈1/ε⌉', 0, ['R03', 0.35], ['R03', 0.4]); }
  if (t > P('R03', 0.7)) { stampMark(CX, 700, 60, t, P('R03', 0.7), { text: '接住', col: SQ.R.col }); burst(t, P('R03', 0.7), CX, 700, SQ.R.col, 90, 12); }
};

// ======================= 单调有界（A158） =======================
const GM = { cx: 660, cy: 1336, ux: 22, uy: 320, x0: 0, x1: 30, y0: 1.8, y1: 3.2 };
SC.mono = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C05') - 0.1) {
    richReveal([['极限是多少不知道，怎么判断存在？', CR]], CX, 360, 34, t, P('C03', 0.1), { upright: true });
    if (t > S('C04') - 0.1) { const c = ap(t, 'C04', 0); panel(680, 450, 640, 180, GOLD, c); label('单调有界准则（同济）', CX, 490, 24, GOLD, c, { bold: true }); richReveal([['单调递增 + 有上界  ⇒  ', CR], ['有极限', GOLD]], CX, 570, 38, t, P('C04', 0.15), { upright: true }); }
    return;
  }
  const a = ap(t, 'C05', 0) * fadeOut(t, S('C06'), 0.4);
  if (a > 0) {
    gAxes(GM, a, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30']], y: [[2, '2'], [3, '3']] }, xl: 'n' });
    richReveal([['(1 + 1/n)^n', SQ.R.col]], 800, 250, 34, t, P('C05', 0.05), { upright: true, alpha: a });
    const ca = ap(t, 'C05', 0.6) * a; gH(GM, 3, RED, ca, { w: 4 }); label('上界 3', gx(GM, 27), gy(GM, 3) - 24, 24, RED, ca, { bold: true });
    for (let n = 1; n <= 29; n++) { const p = a * eIO(prog(t, P('C05', 0.08 + n * 0.025), 0.3)); if (p > 0) gDot(GM, n, Math.pow(1 + 1 / n, n), SQ.R.col, p); }
    if (t > S('G02') - 0.1) { const g = ap(t, 'G02', 0) * a; gH(GM, Math.E, GOLD, g, { dash: [10, 8] }); label('e ≈ 2.718', gx(GM, 27), gy(GM, Math.E) + 26, 24, GOLD, g, { font: F_MATH }); richReveal([['lim  (1 + 1/n)^n  =  ', CR], ['e', GOLD]], 1120, 250, 32, t, P('G02', 0.2), { upright: true, alpha: a }); }
  }
  if (t > S('C06') - 0.1) {
    const c = ap(t, 'C06', 0.05);
    panel(660, 380, 300, 140, CYAN, c); label('函数极限', 810, 450, 32, CYAN, c, { bold: true });
    panel(1040, 380, 300, 140, SQ.R.col, c * ap(t, 'C06', 0.4)); label('数列极限', 1190, 450, 32, SQ.R.col, ap(t, 'C06', 0.4), { bold: true });
    arrowH(970, 1030, 450, GOLD, ap(t, 'C06', 0.3)); label('n 取正整数', 1000, 560, 22, hexA(CR, 0.75), ap(t, 'C06', 0.4));
    richReveal([['存在  ⇒  存在，且相等', GOLD]], CX, 640, 34, t, P('C06', 0.6), { upright: true });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['aₙ = 1/n,  ε = 1/100', RED]], 860, 300, 42, t, P('C08', 0.1), { upright: true });
  richReveal([['N 至少取多少？', CR]], 860, 380, 32, t, P('C08', 0.5), { upright: true });
  if (t > S('D03')) { richReveal([['1/n < 1/100  ⇔  n > 100', CYAN]], 900, 500, 36, t, P('D03', 0.1), { upright: true }); richReveal([['N = ', CR], ['100', GOLD]], 900, 610, 52, t, P('D03', 0.6), { upright: true }); }
  if (t > S('R04')) stampMark(1150, 700, 46, t, P('R04', 0.1), { text: '漂亮', col: SQ.R.col });
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['ε-N：', GOLD], ['足够靠后', CR]], CX, 420, 42, t, P('C09', 0.15), { upright: true, alpha: ga }); richReveal([['单调有界  ⇒  ', CR], ['收敛', GOLD]], CX, 520, 42, t, P('C09', 0.55), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：等价无穷小', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('Kimi 客串', CX, 590, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 4 章 · P10 数列极限', '下一段：等价无穷小', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM4('Mistral')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.15, 'tinkle', 0.16); s('C02', 0.1, 'type', 0.16); s('C02', 0.35, 'hum', 0.14); s('C02', 0.6, 'ding', 0.2); s('G01', 0.3, 'pluck', 0.2);
  s('R01', 0.0, 'slap', 0.22); s('R01', 0.5, 'type', 0.14); s('D01', 0.1, 'pop', 0.22); s('R02', 0.05, 'zap', 0.22); s('R02', 0.5, 'ding', 0.2);
  s('D02', 0.05, 'pop', 0.24); s('R03', 0.05, 'zap', 0.24); s('R03', 0.4, 'pluck', 0.2); s('R03', 0.7, 'stamp', 0.3);
  s('C03', 0.1, 'type', 0.14); s('C04', 0.15, 'slam', 0.24); s('C05', 0.1, 'marimba', 0.16); s('C05', 0.6, 'thud', 0.24); s('G02', 0.2, 'shimmer', 0.22);
  s('C06', 0.05, 'pop', 0.2); s('C06', 0.3, 'whoosh', 0.18); s('C06', 0.6, 'ding_hi', 0.24);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.1, 'type', 0.14); s('D03', 0.6, 'ding_hi', 0.28); s('R04', 0.1, 'stamp', 0.26);
  s('C09', 0.15, 'pop', 0.22); s('C09', 0.55, 'shimmer', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
