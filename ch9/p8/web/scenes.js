// 第 9 章 P8《RL 电路》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.5 例 4、例 5。
// A407 拉闸：电流点由慢到快 · A408 I = 5(1 − e^(−3t))，4.75 A、→ 5 A · A409 交流电源下的正弦电流 + 三条“趋于平衡”曲线并列
const SC = {};
const TITLES = [['law', '基尔霍夫'], ['ex', '例 4'], ['ac', '交流与对照'], ['quiz', '随堂一题'], ['outro', '小结']];

const I8 = t => 5 * (1 - Math.exp(-3 * t)), IA8 = t => (5 / 101) * (Math.sin(30 * t) - 10 * Math.cos(30 * t)) + (50 / 101) * Math.exp(-3 * t);
const G8 = { cx: 620, cy: 790, ux: 220, uy: 75, x0: 0, x1: 2.6, y0: 0, y1: 6.2 };
const GA8 = { cx: 620, cy: 600, ux: 220, uy: 260, x0: 0, x1: 2.6, y0: -0.75, y1: 0.75 };
function axes8(a) { gAxes(G8, a * 0.75, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[5, '5']] } }); label('t（秒）', gx(G8, 2.6) - 10, G8.cy + 40, 22, CR, a * 0.8); label('I（A）', gx(G8, 0) - 10, gy(G8, 6.2) - 18, 24, CR, a, { bold: true }); }

// ======================= 基尔霍夫（A407） =======================
SC.law = t => {
  starfield(t); blueprint(0.3, 80);
  const on = clamp((t - P('X01', 0.15)) / 0.3), tt = Math.max(0, t - P('X01', 0.3));
  let ph = 0; { const n = 60; for (let i = 0; i < n; i++) { const s = tt * i / n; ph += 260 * (I8(s) / 5) * tt / n; } }
  circuitRL(860, 500, 460, 320, t, ap(t, 'X01', 0.05), { on, I: I8(tt * 0.5) / 5, phase: ph * 0.5 });
  label(`I = ${(I8(tt * 0.5)).toFixed(2)} A`, 860, 500, 34, GOLD, ap(t, 'X01', 0.3), { bold: true });
  if (t > S('C01')) label('电感：阻碍电流变化', 860, 290, 28, CYAN, ap(t, 'C01', 0.2), { bold: true });
  if (t > S('C02')) goldBox(860, 760, 460, 64, 'L dI/dt + R I = E(t)', 32, ap(t, 'C02', 0.2));
};

// ======================= 例 4（A408） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['R = 12 Ω，L = 4 H，E = 60 V，', CR], ['I(0) = 0', GOLD]], 900, 230, 30, t, P('C03', 0.1), { upright: true });
  if (t > S('G01')) richReveal([["I′ + 3I = 15", CR], ['，I = e^{3t}', GOLD]], 900, 285, 30, t, P('G01', 0.1), { upright: true });
  if (t > S('C04')) {
    const a = ap(t, 'C04', 0); axes8(a);
    richReveal([['I = 5(1 − e^{−3t})', GOLD]], 900, 340, 32, t, P('C04', 0.05), { upright: true });
    gPlot(G8, I8, SQ.X.col, { a, w: 5, xa: 0, xb: 2.6, p: prog(t, P('C04', 0.15), 1.2) });
    gH(G8, 5, CR, a * 0.6, { dash: [10, 8] });
    if (t > P('C04', 0.5)) { const k = ap(t, 'C04', 0.5); gDot(G8, 1, I8(1), CYAN, k); label('I(1) ≈ 4.75', gx(G8, 1) + 20, gy(G8, I8(1)) + 40, 26, CYAN, k, { bold: true }); }
  }
  if (t > S('X02')) { label('5 A = E/R = 60/12', gx(G8, 2.0), gy(G8, 5) - 30, 28, GOLD, ap(t, 'X02', 0.1), { bold: true }); checkMark(gx(G8, 2.5), gy(G8, 5) - 30, 20, GRN, t, P('X02', 0.5)); }
};

// ======================= 交流与对照（A409） =======================
SC.ac = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C05', 0) * fadeOut(t, S('G02'), 0.4);
  if (ga > 0) {
    gAxes(GA8, ga * 0.75, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[0.5, '0.5'], [-0.5, '−0.5']] } });
    richReveal([['E = 60 sin 30t', GOLD], ['  →  电流跟着振荡', CR]], 900, 260, 32, t, P('C05', 0.1), { upright: true, alpha: ga });
    gPlot(GA8, IA8, SQ.X.col, { a: ga, w: 3.5, xa: 0, xb: 2.6, n: 900, p: prog(t, P('C05', 0.3), 1.6) });
  }
  if (t > S('G02') - 0.1) {
    const C3 = [['排队人数', 'N → 300', SQ.D.col], ['盐的含量', 'y → 150', GOLD], ['电流', 'I → 5', SQ.X.col]];
    C3.forEach(([n, v, c], i) => { const k = ap(t, 'G02', 0.1 + 0.2 * i), X = 640 + i * 230, Y = 560;
      panel(X - 100, 300, 200, 300, c, k); label(n, X, 340, 26, c, k, { bold: true });
      ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); for (let j = 0; j <= 40; j++) { const s = j / 40; ctx[j ? 'lineTo' : 'moveTo'](X - 80 + 160 * s, Y - 160 * (1 - Math.exp(-4 * s)) * (i === 1 ? 0.85 : 1) - (i === 1 ? 24 : 0) * Math.exp(-4 * s)); } ctx.stroke(); ctx.restore();
      seg(X - 80, Y - 160, X + 80, Y - 160, CR, k * 0.5, 2, [6, 5]); label(v, X, 640, 28, c, k, { bold: true }); });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['L = 2 H，R = 10 Ω，E = 20 V：', CR], ['I → ？', GOLD]], 860, 250, 34, t, P('C07', 0.05), { upright: true });
  circuitRL(860, 520, 380, 260, t, ap(t, 'C07', 0.3), { on: 1, I: t > S('D01') ? 0.8 : 0.3 });
  if (t > S('D01')) goldBox(860, 520, 300, 64, 'E/R = 2 A', 34, ap(t, 'D01', 0.1));
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) richReveal([['电感：电流慢慢爬到 ', CR], ['E/R', GOLD]], CX, 400, 46, t, P('C08', 0.05), { upright: true, alpha: ga });
  if (t > S('C09') - 0.1) { glowText('下一段：捕食者与猎物', CX, 520, 50, CR, t, P('C09', 0.15)); glowText('MiMo 的兔子遇上狼', CX, 610, 32, SQ.T.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 9 章 · P8 RL 电路', '下一段：兔子与狼', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM9('Grok')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('X01', 0.15, 'slam', 0.24); s('X01', 0.3, 'hum', 0.14); s('C01', 0.2, 'pop', 0.16); s('C02', 0.2, 'ding', 0.22);
  s('C03', 0.1, 'pop', 0.16); s('G01', 0.1, 'pop', 0.16); s('C04', 0.15, 'riser', 0.12); s('C04', 0.5, 'tick', 0.18); s('X02', 0.1, 'ding', 0.2); s('X02', 0.5, 'check', 0.22);
  s('C05', 0.3, 'warp', 0.12); [0.1, 0.3, 0.5].forEach(f => s('G02', f, 'marimba', 0.14));
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
