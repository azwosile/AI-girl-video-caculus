// 第 9 章 P12《可降阶的高阶方程》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 7.5。
// A419 三类可降阶方程卡片 · A420 例题：p = y′ 两步积分 + 曲线 y = x³ + 3x + 1 · A421 陷阱：积分常数 C₁、C₂ 的楼梯
const SC = {};
const TITLES = [['types', '三类降阶'], ['ex', '例题'], ['trap', '别丢常数'], ['quiz', '随堂一题'], ['outro', '小结']];

const Y12 = x => x * x * x + 3 * x + 1;
const GE12 = { cx: 820, cy: 560, ux: 140, uy: 26, x0: -1.6, x1: 1.6, y0: -8, y1: 9 };

function typeCard12(x, y, w, h, n, head, body, col, a, hi) {
  if (a <= 0) return;
  panel(x, y, w, h, col, a * (hi ? 1 : 0.7));
  label(n, x + 34, y + 40, 34, col, a, { bold: true });
  label(head, x + w / 2 + 16, y + 40, 26, CR, a, { bold: true });
  mathText(body, x + w / 2, y + 100, 26, hi ? GOLD : CR, { alpha: a, upright: true, align: 'center' });
}

// ======================= 三类降阶（A419） =======================
SC.types = t => {
  starfield(t); blueprint(0.3, 80);
  kinetic('y″ → 降一阶 → 一阶方程', 870, 200, 40, t, P('C01', 0.1), { col: GOLD });
  const K = SQ.K.col;
  const cur = t > S('C03') ? 3 : t > S('K01') ? 2 : t > S('C02') ? 1 : 0;
  typeCard12(560, 270, 620, 140, '①', 'y″ = f(x)', '积分两次', CYAN, ap(t, 'C02', 0.05), cur === 1);
  typeCard12(560, 430, 620, 140, '②', '不含 y：y″ = f(x, y′)', 'p = y′  ⇒  p′ = f(x, p)', K, ap(t, 'K01', 0.05), cur === 2);
  typeCard12(560, 590, 620, 140, '③', '不含 x：y″ = f(y, y′)', 'p = y′，y″ = p·dp/dy', SQ.Z.col, ap(t, 'C03', 0.05), cur === 3);
  if (cur === 1) label('y″ = 6x  ⇒  y′ = 3x²  ⇒  y = x³', 870, 760, 26, CYAN, ap(t, 'C02', 0.5), { bold: true });
};

// ======================= 例题（A420） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C04', 0) * fadeOut(t, S('K03'), 0.4);
  if (ga > 0) {
    richReveal([['(1 + x²)y″ = 2xy′，', CR], ['y(0) = 1，y′(0) = 3', GOLD]], 870, 240, 32, t, P('C04', 0.1), { upright: true, alpha: ga });
    if (t > S('K02')) richReveal([['p = y′  ⇒  ', SQ.K.col], ['(1 + x²)p′ = 2xp', CR]], 870, 330, 32, t, P('K02', 0.2), { upright: true, alpha: ga });
    if (t > S('C05')) richReveal([['dp/p = 2x dx/(1 + x²)  ⇒  ', CR], ['p = 3(1 + x²)', CYAN]], 870, 420, 32, t, P('C05', 0.1), { upright: true, alpha: ga });
    if (t > S('G01')) richReveal([['y = x³ + 3x + C₂，', CR], ['C₂ = 1', GOLD]], 870, 510, 32, t, P('G01', 0.1), { upright: true, alpha: ga });
    if (t > S('K02')) { const k = ap(t, 'K02', 0.05) * ga; label('2 阶', 640, 620, 30, CR, k, { bold: true }); arrow(690, 620, 790, 620, SQ.K.col, k, 3); label('1 阶', 840, 620, 30, SQ.K.col, k, { bold: true }); arrow(890, 620, 990, 620, CYAN, ap(t, 'G01', 0.1) * ga, 3); label('积分', 1040, 620, 30, CYAN, ap(t, 'G01', 0.1) * ga, { bold: true }); }
  }
  if (t > S('K03') - 0.1) {
    const a = ap(t, 'K03', 0);
    gAxes(GE12, a * 0.75, { grid: false, ticks: { x: [[-1, '−1'], [1, '1']], y: [[5, '5'], [-5, '−5']] } });
    goldBox(1000, 230, 340, 60, 'y = x³ + 3x + 1', 30, a);
    gPlot(GE12, Y12, SQ.K.col, { a, w: 5, p: prog(t, P('K03', 0.1), 0.9) });
    gDot(GE12, 0, 1, GOLD, a); label('(0, 1)，斜率 3', gx(GE12, 0) - 150, gy(GE12, 1) - 50, 24, GOLD, ap(t, 'K03', 0.4), { bold: true });
    seg(gx(GE12, -0.5), gy(GE12, -0.5), gx(GE12, 0.5), gy(GE12, 2.5), GOLD, ap(t, 'K03', 0.4) * 0.8, 2.5, [6, 5]);
  }
};

// ======================= 别丢常数（A421） =======================
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  const steps = [['y″ = 6x', CR], ['y′ = 3x² + C₁', CYAN], ['y = x³ + C₁x + C₂', GOLD]];
  steps.forEach((s, i) => {
    const k = ap(t, 'D01', 0.1 + 0.2 * i); const x = 620 + i * 190, y = 620 - i * 140;
    panel(x - 40, y - 50, 360, 80, s[1], k); mathText(s[0], x + 140, y + 2, 30, s[1], { alpha: k, upright: true, align: 'center' });
    if (i) label('∫', x - 70, y + 50, 40, s[1], k, { bold: true });
  });
  if (t > S('D01') && t < S('C06')) crossMark(1370, 330, 34, RED, t, P('D01', 0.6));
  if (t > S('C06')) { goldBox(870, 240, 440, 60, '二阶 ⇒ 两个任意常数', 30, ap(t, 'C06', 0.3)); checkMark(1370, 330, 26, GRN, t, P('C06', 0.5)); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['y″ = 0', CR], ['  通解？', GOLD]], 860, 260, 42, t, P('C08', 0.05), { upright: true });
  if (t > S('D02')) { richReveal([['y = ', CR], ['C₁x + C₂', GOLD]], 860, 370, 42, t, P('D02', 0.15), { upright: true }); checkMark(1060, 370, 26, GRN, t, P('D02', 0.5)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([['p = y′  ⇒  ', CR], ['二阶变一阶', GOLD]], CX, 400, 48, t, P('C09', 0.05), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：二阶常系数齐次方程', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('GLM：特征方程一张表', CX, 610, 32, SQ.Z.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 9 章 · P12 可降阶的高阶方程', '下一段：特征方程', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM9('Kimi')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'riser', 0.12); s('C02', 0.05, 'pop', 0.16); s('C02', 0.5, 'tick', 0.14); s('K01', 0.05, 'pop', 0.16); s('K01', 0.3, 'shimmer', 0.14); s('C03', 0.05, 'pop', 0.16);
  s('C04', 0.1, 'pop', 0.16); s('K02', 0.05, 'click', 0.18); s('K02', 0.2, 'pop', 0.16); s('C05', 0.1, 'pop', 0.16); s('G01', 0.1, 'pop', 0.16); s('K03', 0.1, 'swoosh_in', 0.16); s('K03', 0.4, 'ding', 0.18);
  s('D01', 0.1, 'pop', 0.14); s('D01', 0.3, 'pop', 0.14); s('D01', 0.5, 'pop', 0.14); s('D01', 0.6, 'buzz', 0.18); s('C06', 0.3, 'ding', 0.2); s('C06', 0.5, 'check', 0.2);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'whoosh', 0.14); s('D02', 0.5, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
