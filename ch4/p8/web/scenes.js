// 第 4 章 P8《洛必达续：∞/∞ 与增长赛跑》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A149 赛道：ln x、√x、x、x²、eˣ 赛跑，镜头不断拉远 · A150 连用两次洛必达，分母 x² 逐层剥掉 · A151 反例：1 + cos x 振荡，原式稳稳趋于 1
const SC = {};
const TITLES = [['inf', '∞/∞ 型'], ['race', '增长赛跑'], ['cond', '使用条件'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= ∞/∞（A150） =======================
SC.inf = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('G01') - 0.1) {
    const a = ap(t, 'C01', 0);
    richReveal([['∞/∞', GOLD], ['  同样适用', CR]], CX, 210, 40, t, P('C01', 0.3), { upright: true });
    // 三层：x² → 2x → 2（A150）
    const st = [[0, 'x^2', 'C02', 0.05], [1, '2x', 'C02', 0.4], [2, '2', 'C02', 0.75]];
    st.forEach(([i, den, id, f]) => {
      const p = ap(t, id, f); if (p <= 0) return; const x = 720 + i * 230, y = 470;
      mathText('e^x', x, y - 20, 44, GOLD, { align: 'center', alpha: p, upright: true, glow: 10 }); seg(x - 60, y, x + 60, y, CR, p, 3);
      mathText(den, x, y + 56, 44, i === 2 ? GRN : CYAN, { align: 'center', alpha: p, upright: true, glow: 10 });
      if (i) { arrowH(x - 175, x - 85, y, CR, p); label("上下求导", x - 130, y - 36, 18, hexA(CR, 0.7), p); }
      if (i < 2) label('∞/∞', x, y + 110, 22, hexA(GOLD, 0.8), p, { font: F_MATH });
    });
    if (t > P('C02', 0.8)) { richReveal([['→ ∞', RED]], 1260, 482, 44, t, P('C02', 0.85), { upright: true }); }
    if (t > S('D01')) { const d = ap(t, 'D01', 0.1); [[720, 'x²'], [950, '2x']].forEach(([x, s], k) => { ctx.save(); ctx.globalAlpha *= d; ctx.strokeStyle = COL.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 40, 530 + 0); ctx.lineTo(x + 40, 510); ctx.stroke(); ctx.restore(); }); glowText('分母一层一层被剥掉', CX, 720, 34, GOLD, t, P('D01', 0.3)); }
    return;
  }
  const g = ap(t, 'G01', 0);
  panel(620, 220, 740, 560, SQ.G.col, g * 0.8); label('课件练习', 990, 255, 24, SQ.G.col, g, { bold: true });
  richReveal([['lim', CR], ['  tan x / tan 3x', RED], ['   (x → π/2)', CR]], 990, 330, 34, t, P('G01', 0.1), { upright: true });
  richReveal([['∞/∞，直接求导很乱', hexA(CR, 0.75)]], 990, 395, 26, t, P('G01', 0.35), { upright: true });
  richReveal([['= lim  cot 3x / cot x', CYAN], ['   (0/0)', GOLD]], 990, 465, 32, t, P('G01', 0.6), { upright: true });
  if (t > S('G02') - 0.1) {
    richReveal([['= lim  (−3csc²3x) / (−csc²x)', CYAN]], 990, 540, 30, t, P('G02', 0.05), { upright: true });
    richReveal([['= lim  3sin²x / sin²3x', GRN]], 990, 610, 32, t, P('G02', 0.3), { upright: true });
    richReveal([['= 3 · 1 / 1 = ', CR], ['3', GOLD]], 990, 690, 38, t, P('G02', 0.65), { upright: true });
    if (t > P('G02', 0.85)) burst(t, P('G02', 0.85), 1110, 678, GOLD, 70, 10);
  }
};

// ======================= 增长赛跑（A149） =======================
const RUN = [['ln x', x => Math.log(x), SQ.L.col], ['√x', x => Math.sqrt(x), CYAN], ['x', x => x, GRN], ['x²', x => x * x, GOLD], ['eˣ', x => Math.exp(x), RED]];
function raceX(t) { return lerp(1.6, 14, eIO(prog(t, P('L01', 0.0), E('C06') - P('L01', 0)))); }
SC.race = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C03', 0.2), X = raceX(t), vals = RUN.map(r => Math.max(0, r[1](X))), mx = Math.max(...vals);
  const x0 = 700, x1 = 1330, y0 = 300, dy = 92;
  panel(620, 240, 740, 520, CR, a * 0.5);
  RUN.forEach(([s, f, c], i) => {
    const y = y0 + i * dy, p = vals[i] / mx;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.18)'; ctx.lineWidth = 2; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(x0, y + 26); ctx.lineTo(x1, y + 26); ctx.stroke(); ctx.restore();
    label(s, 660, y, 28, c, a, { font: F_MATH, bold: true });
    const px = lerp(x0, x1, p); seg(x0, y, px, y, c, a * 0.6, 6);
    glowDot(px, y, 11, c, a);
    if (i === 0 && t > S('L01')) label('慢慢来～', px + 70, y - 2, 20, c, ap(t, 'L01', 0.1), { bold: true });
  });
  // 镜头读数
  mathText(`x = ${X.toFixed(1)}`, 1240, 285, 24, CR, { align: 'center', alpha: a, upright: true });
  label(`镜头宽度 ≈ ${mx < 1e4 ? mx.toFixed(0) : mx.toExponential(1)}`, 900, 285, 20, hexA(CR, 0.7), a);
  if (t > S('C04') - 0.1 && t < S('C06')) richReveal([['ln x / x^n → 1/(nx^n) → 0', SQ.L.col]], CX, 820, 30, t, P('C04', 0.1), { upright: true, out: S('C05') - 0.1 });
  if (t > S('C05') - 0.1 && t < S('C06')) richReveal([['x^n / e^x → … → n!/e^x → 0', GOLD]], CX, 820, 30, t, P('C05', 0.1), { upright: true, out: S('C06') - 0.1 });
  if (t > S('C06') - 0.1) { richReveal([['ln x', SQ.L.col], ['  ≪  ', CR], ['x^n', GOLD], ['  ≪  ', CR], ['e^x', RED]], CX, 830, 44, t, P('C06', 0.1), { upright: true }); }
  if (t > S('L02')) { slab('第一名', x1 - 10, y0 + 4 * dy - 50, 22, t, P('L02', 0.2), { bg: RED }); slab('陪跑', 800, y0 - 46, 22, t, P('L02', 0.5), { bg: SQ.L.col, c: COL.ink }); }
};

// ======================= 使用条件（A151） =======================
const GK = { cx: 630, cy: 714, ux: 22, uy: 180, x0: 0, x1: 32, y0: -0.2, y1: 2.3 };
SC.cond = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([["lim f'/g' 必须存在", GOLD]], CX, 200, 34, t, P('G03', 0.3), { upright: true });
  if (t < S('C07') - 0.1) return;
  const a = ap(t, 'C07', 0);
  gAxes(GK, a, { grid: false, ticks: { y: [[1, '1'], [2, '2']] } });
  richReveal([['(x + sin x)/x', RED], ['  →  上下求导  →  ', CR], ['1 + cos x', GRN]], CX, 260, 28, t, P('C07', 0.1), { upright: true });
  gPlot(GK, x => 1 + Math.cos(x), GRN, { a, xa: 0.2, xb: 32, p: eIO(prog(t, P('C07', 0.5), 1.4)), n: 600 });
  if (t > P('C07', 0.85)) { label('来回振荡：没有极限', gx(GK, 22), gy(GK, 2.2) - 4, 22, GRN, ap(t, 'C07', 0.85), { bold: true }); }
  if (t > S('C08') - 0.1) {
    gPlot(GK, x => (x + Math.sin(x)) / x, RED, { a: ap(t, 'C08', 0), xa: 0.5, xb: 32, p: eIO(prog(t, P('C08', 0.15), 1.2)), n: 600, w: 5 });
    gH(GK, 1, GOLD, ap(t, 'C08', 0.5) * 0.7, { dash: [8, 8] });
    richReveal([['= 1 + sin x / x  →  1', RED]], 1000, 860 - 0, 30, t, P('C08', 0.3), { upright: true });
    stampMark(1240, 600, 56, t, P('C08', 0.7), { text: '失效', col: GOLD });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['lim', CR], ['  x / e^x', RED], ['   (x → ∞)', CR]], 880, 300, 46, t, P('C10', 0.1), { upright: true });
  if (t > S('D02')) { slab('∞/∞ 型', 760, 460, 30, t, P('D02', 0.05), { bg: GOLD, c: COL.ink }); richReveal([['→  1 / e^x  →  ', GRN], ['0', GOLD]], 900, 580, 44, t, P('D02', 0.35), { upright: true }); label('指数赢了', 900, 680, 32, RED, ap(t, 'D02', 0.75), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; slab('∞/∞ 也能用', 780, 420, 32, t, P('C11', 0.15), { bg: GOLD, c: COL.ink, rot: 0 }); ctx.restore(); richReveal([['ln x', SQ.L.col], ['  ≪  ', CR], ['x^n', GOLD], ['  ≪  ', CR], ['e^x', RED]], 1080, 540, 40, t, P('C11', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C12') - 0.1) { glowText('下一段：其他未定式与第二个重要极限', CX, 500, 48, CR, t, P('C12', 0.15)); glowText('千问客串', CX, 590, 32, SQ.Q.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 4 章 · P8 ∞/∞ 与增长赛跑', '下一段：其他未定式与第二个重要极限', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM4('Llama')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.3, 'type', 0.16); [0.05, 0.4, 0.75].forEach(f => s('C02', f, 'pluck', 0.2)); s('C02', 0.85, 'ding_hi', 0.26); s('D01', 0.1, 'slap', 0.2); s('D01', 0.3, 'shimmer', 0.18);
  [0.1, 0.35, 0.6].forEach(f => s('G01', f, 'type', 0.14)); [0.05, 0.3, 0.65].forEach(f => s('G02', f, 'type', 0.14)); s('G02', 0.85, 'ding_hi', 0.28);
  s('C03', 0.2, 'riser', 0.14); s('L01', 0.0, 'whoosh', 0.2); s('L01', 0.1, 'tinkle', 0.16); s('C04', 0.1, 'type', 0.16); s('C05', 0.1, 'type', 0.16); s('C06', 0.1, 'slam', 0.26);
  s('L02', 0.2, 'pop', 0.22); s('L02', 0.5, 'pop', 0.22);
  s('G03', 0.3, 'type', 0.16); s('C07', 0.1, 'type', 0.16); s('C07', 0.5, 'glitch', 0.16); s('C08', 0.15, 'pluck', 0.2); s('C08', 0.7, 'stamp', 0.3);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'pop', 0.22); s('D02', 0.35, 'ding_hi', 0.28);
  s('C11', 0.15, 'pop', 0.22); s('C11', 0.5, 'shimmer', 0.18); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
