// 第 7 章 P0《积分擂台》（2026-11-12）：数学画面全部原创 Canvas 绘制。致敬 MIT Integration Bee。
// A290 擂台计分板 · A291 三条原函数曲线平移重合 · A292 工具箱打开
const SC = {};
const TITLES = [['ring', '积分擂台'], ['check', '这是真的吗？'], ['more', '后面的题'], ['quiz', '随堂一题'], ['outro', '小结']];

const F1 = x => 0.5 * Math.sin(x) ** 2, F2 = x => -0.5 * Math.cos(x) ** 2, F3 = x => -0.25 * Math.cos(2 * x);
const ANS = [['大肥鱼', SQ.D.col, '½ sin²x + C', 'D01'], ['GPT', SQ.G.col, '−½ cos²x + C', 'G01'], ['Claude', SQ.C.col, '−¼ cos 2x + C', 'C01']];

// ======================= 擂台（A290） =======================
SC.ring = t => {
  starfield(t); blueprint(0.3, 80); focusLines(t, 0.12 * fadeOut(t, S('D01')), CX, 400);
  ringBanner(CX, 225, '积分擂台 · 第一轮', t, P('X01', 0.05));
  questionCard(900, 340, 580, 100, '第一题', '∫ sin x cos x dx = ？', t, P('X01', 0.35));
  ANS.forEach(([n, c, e, id], k) => answerCard(900, 480 + k * 100, 580, n, c, e, t, P(id, 0.25), { shake: S('X02') }));
  if (t > S('X02')) {
    const a = ap(t, 'X02', 0.1); ['≠', '≠'].forEach((s, k) => label(s, 900, 530 + k * 100, 34, RED, a, { bold: true }));
    kinetic('这是真的吗？', 900, 790, 46, t, P('X02', 0.25), { col: SQ.X.col });
  }
};

// ======================= 平移重合（A291） =======================
const GC = { cx: 900, cy: 580, ux: 85, uy: 260, x0: -3.4, x1: 3.4, y0: -0.75, y1: 0.75 };
SC.check = t => {
  starfield(t); blueprint(0.35, 80);
  const g = ap(t, 'C02', 0); gAxes(GC, g * 0.75, { grid: false, xl: 'x' });
  const sh = t > S('C03') ? eIO(prog(t, P('C03', 0.25), 1.2)) : 0;   // 平移：F2 上移 ½，F3 上移 ¼
  const curves = [[F1, SQ.D.col, 0, '½ sin²x'], [F2, SQ.G.col, 0.5, '−½ cos²x'], [F3, SQ.C.col, 0.25, '−¼ cos 2x']];
  curves.forEach(([f, c, d, s], k) => {
    const a = g * ap(t, 'C02', 0.1 + 0.15 * k); gPlot(GC, x => f(x) + d * sh, c, { a, xa: -3.3, xb: 3.3, w: k ? 3 : 5 });
    mathText(s, 600 + k * 230, 320, 26, c, { alpha: a * (1 - sh * 0.5), upright: true });
  });
  if (t > S('C02') && sh < 1) { const a = ap(t, 'C02', 0.6) * (1 - sh); [[0.5, SQ.G.col], [0.25, SQ.C.col]].forEach(([d, c], k) => { const x = -1.6 + k * 3.2, y0 = (k ? F3 : F2)(x); arrow(gx(GC, x), gy(GC, y0), gx(GC, x), gy(GC, y0 + d) + 6, c, a, 2.5); mathText(`+${d === 0.5 ? '½' : '¼'}`, gx(GC, x) + 12, gy(GC, y0 + d / 2), 24, c, { alpha: a, upright: true }); }); }
  if (t > S('C03')) richReveal([['sin²x + cos²x = 1  ⇒  ', CR], ['只差常数', GOLD]], 900, 245, 38, t, P('C03', 0.1), { upright: true, alpha: fadeOut(t, S('X03')) });
  if (t > S('X03')) {
    richReveal([['(·)′ = sin x cos x', GRN], ['  × 3', CR]], 900, 245, 38, t, P('X03', 0.1), { upright: true });
    [0, 1, 2].forEach(k => checkMark(600 + k * 230 + 175, 312, 14, GRN, t, P('X03', 0.3 + 0.12 * k)));
    stampMark(1060, 760, 60, t, P('X03', 0.7), { text: '核实通过', col: SQ.X.col, rot: -0.14 });
  }
};

// ======================= 后面的题 + 工具箱（A292） =======================
const GB = { cx: 870, cy: 760, ux: 130, uy: 230, x0: -2.4, x1: 2.4, y0: -0.05, y1: 1.15 };
const TOOLS = [['分部进阶', SQ.B.col], ['递推公式', SQ.T.col], ['三角积分', SQ.H.col], ['tan 与 sec', SQ.M.col], ['三角代换', SQ.R.col],
  ['部分分式', SQ.Z.col], ['万能代换', SQ.N.col], ['积分策略', SQ.X.col], ['积分表', SQ.M.col], ['数值积分', SQ.Q.col]];
SC.more = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C04')) { kinetic('思路可以不同……', 880, 420, 54, t, P('D02', 0.15), { col: SQ.D.col }); return; }
  const fa = fadeOut(t, S('C06'), 0.4);
  if (fa > 0) {
    questionCard(700, 300, 320, 90, '', '∫ sin³x dx', t, P('C04', 0.4), { alpha: fa, col: SQ.H.col, size: 34 });
    questionCard(1040, 300, 340, 90, '', '∫ dx / (x² − 1)', t, P('G02', 0.2), { alpha: fa, col: SQ.Z.col, size: 34 });
    if (t > S('X04')) {
      questionCard(870, 430, 440, 96, '压轴', '∫ e^{−x²} dx', t, P('X04', 0.15), { alpha: fa, col: RED, size: 38 });
      const a = ap(t, 'X04', 0.4) * fa; gPlot(GB, x => Math.exp(-x * x), CYAN, { a, xa: -2.3, xb: 2.3, w: 4 }); seg(gx(GB, -2.4), gy(GB, 0), gx(GB, 2.4), gy(GB, 0), CR, a * 0.6, 2);
      if (t > S('D03') && t < S('C05')) stampMark(1080, 640, 58, t, P('D03', 0.15), { text: '写不出', col: RED, rot: 0.12 });
      if (t > S('C05')) { gBetween(GB, x => Math.exp(-x * x), () => 0, 0, 1, ap(t, 'C05', 0.4) * fa, { col: 'rgba(255,200,60,0.40)' }); richReveal([['∫₀¹ e^{−x²} dx ≈ ', CR], ['0.7468', GOLD]], 1180, 600, 30, t, P('C05', 0.55), { upright: true, alpha: fa }); }
    }
  }
  if (t > S('C06') - 0.1) { label('本章工具箱', CX, 250, 40, GOLD, ap(t, 'C06', 0), { bold: true }); toolGrid(CX, 480, TOOLS, 5, t, TOOLS.map((_, i) => P('C06', 0.1) + i * 0.1), { cw: 190, ch: 74, size: 23 }); }
};

// ======================= 随堂 =======================
const GQ = { cx: 860, cy: 600, ux: 80, uy: 300, x0: -3.3, x1: 3.3, y0: -0.65, y1: 0.65 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['½ sin²x', SQ.D.col], ['  与  ', CR], ['−½ cos²x', SQ.G.col], ['  相差多少？', CR]], 860, 260, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); gAxes(GQ, a * 0.7, { grid: false }); gPlot(GQ, F1, SQ.D.col, { a, xa: -3.2, xb: 3.2, w: 4 }); gPlot(GQ, F2, SQ.G.col, { a, xa: -3.2, xb: 3.2, w: 4 });
  if (t > S('D04')) { const q = ap(t, 'D04', 0.1); [-2.2, 0, 2.2].forEach(x => { arrow(gx(GQ, x), gy(GQ, F2(x)), gx(GQ, x), gy(GQ, F1(x)) + 4, GOLD, q, 2.5); }); richReveal([['F₁ − F₂ = ½(sin²x + cos²x) = ', CR], ['½', GOLD]], 860, 850 - 80, 32, t, P('D04', 0.4), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { gAxes(GC, ga * 0.6, { grid: false }); [[F1, SQ.D.col, 0], [F2, SQ.G.col, 0.5], [F3, SQ.C.col, 0.25]].forEach(([f, c, d], k) => gPlot(GC, x => f(x) + d, c, { a: ga, xa: -3.3, xb: 3.3, w: 5 - k * 1.2 })); richReveal([['F′ 相同  ⇒  ', CR], ['F 只差常数', GOLD]], CX, 250, 42, t, P('C09', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：速通基本积分表', CX, 520, 52, CR, t, P('C10', 0.15)); glowText('Kimi 过目不忘', CX, 610, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 7 章 · P0 积分擂台', '下一段：速通', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM7('Grok')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('X01', 0.05, 'slam', 0.3); s('X01', 0.35, 'whoosh', 0.18); s('D01', 0.25, 'pop', 0.2); s('G01', 0.25, 'pop', 0.2); s('C01', 0.25, 'pop', 0.2); s('X02', 0.0, 'buzz', 0.2); s('X02', 0.25, 'zap', 0.16);
  s('C02', 0.1, 'swell', 0.14); s('C03', 0.25, 'warp', 0.16); s('X03', 0.3, 'check', 0.24); s('X03', 0.42, 'check', 0.2); s('X03', 0.54, 'check', 0.2); s('X03', 0.7, 'stamp', 0.3);
  s('C04', 0.4, 'pop', 0.18); s('G02', 0.2, 'pop', 0.18); s('X04', 0.15, 'impact', 0.24); s('D03', 0.15, 'stamp', 0.24); s('C05', 0.4, 'shimmer', 0.18);
  TOOLS.forEach((_, i) => sfx(P('C06', 0.1) + i * 0.1, 'marimba', 0.12));
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D04', 0.1, 'whoosh', 0.14); s('D04', 0.4, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
