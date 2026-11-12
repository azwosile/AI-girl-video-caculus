// 第 8 章 P9《消费者剩余》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.4。
// A365 奶茶需求曲线 + 售价线 · A366 每杯省下的钱竖条 → 面积 · A367 课本例题曲线需求
const SC = {};
const TITLES = [['demand', '需求曲线'], ['cs', '消费者剩余'], ['book', '课本例题'], ['quiz', '随堂一题'], ['outro', '小结']];

const PD9 = x => 30 - x / 50;
const GD9 = { cx: 600, cy: 770, ux: 0.375, uy: 12.5, x0: 0, x1: 1600, y0: 0, y1: 33 };
function axesD9(a) {
  gAxes(GD9, a * 0.75, { grid: false, ticks: { x: [[600, '600'], [1500, '1500']], y: [[18, '18'], [30, '30']] } });
  label('x（杯）', gx(GD9, 1600) + 10, GD9.cy + 34, 22, CR, a * 0.8); label('p（元）', GD9.cx - 10, gy(GD9, 33) - 18, 22, CR, a * 0.8);
}

// ======================= 需求曲线（A365） =======================
SC.demand = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'Q01', 0.1); axesD9(a);
  const pa = ap(t, 'C01', 0.1); gPlot(GD9, PD9, SQ.Q.col, { a: pa, xa: 0, xb: 1500, w: 4, p: prog(t, P('C01', 0.15), 1.4) });
  if (t > S('Q01') && t < S('C01')) label('有人愿意出 30', gx(GD9, 0) + 120, gy(GD9, 30), 28, SQ.Q.col, a, { bold: true });
  if (t > S('C01')) { const q = ap(t, 'C01', 0.5); [150, 450, 900, 1200].forEach(x => { glowDot(gx(GD9, x), gy(GD9, PD9(x)), 7, GOLD, q); seg(gx(GD9, x), gy(GD9, PD9(x)), gx(GD9, x), GD9.cy, GOLD, q * 0.5, 1.5, [4, 4]); });
    richReveal([['p(x)：第 x 杯，愿意付的最高价', CR]], 870, 250, 30, t, P('C01', 0.2), { upright: true }); }
  if (t > S('C02')) richReveal([['p = 30 − x/50', SQ.Q.col]], 870, 305, 32, t, P('C02', 0.1), { upright: true });
  if (t > S('G01')) { const q = ap(t, 'G01', 0.1); seg(gx(GD9, 0), gy(GD9, 18), gx(GD9, 1550), gy(GD9, 18), CYAN, q, 3, [10, 6]); label('售价 P = 18', gx(GD9, 1350), gy(GD9, 18) - 24, 26, CYAN, q, { bold: true });
    seg(gx(GD9, 600), gy(GD9, 18), gx(GD9, 600), GD9.cy, CYAN, ap(t, 'G01', 0.4), 2, [6, 5]); glowDot(gx(GD9, 600), gy(GD9, 18), 9, CYAN, ap(t, 'G01', 0.4)); label('X = 600', gx(GD9, 600) + 70, GD9.cy - 40, 26, CYAN, ap(t, 'G01', 0.4), { bold: true }); }
};

// ======================= 消费者剩余（A366） =======================
SC.cs = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0.05); axesD9(a); gPlot(GD9, PD9, SQ.Q.col, { a, xa: 0, xb: 1500, w: 4 }); seg(gx(GD9, 0), gy(GD9, 18), gx(GD9, 1550), gy(GD9, 18), CYAN, a, 3, [10, 6]);
  if (t < S('C04')) { const q = ap(t, 'C03', 0.3), x = 200; ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = 'rgba(255,200,60,0.8)'; ctx.fillRect(gx(GD9, x) - 8, gy(GD9, PD9(x)), 16, (PD9(x) - 18) * GD9.uy); ctx.restore();
    label('省 p(x) − 18', gx(GD9, x) + 100, gy(GD9, (PD9(x) + 18) / 2), 26, GOLD, q, { bold: true }); }
  else gBetween(GD9, PD9, () => 18, 0, 600, ap(t, 'C04', 0.1), { col: 'rgba(255,200,60,0.45)', p: prog(t, P('C04', 0.1), 1.2) });
  if (t > S('C04')) richReveal([['CS = ', CR], ['∫₀ˣ (p(x) − P) dx', GOLD]], 870, 250, 34, t, P('C04', 0.3), { upright: true });
  if (t > S('G02')) { richReveal([['∫₀⁶⁰⁰ (12 − x/50) dx', CR]], 870, 305, 30, t, P('G02', 0.1), { upright: true }); goldBox(1060, 470, 260, 56, 'CS = 3600 元', 30, ap(t, 'G02', 0.4)); }
  if (t > S('Q02')) label('= 大家的开心', 1060, 530, 28, SQ.Q.col, ap(t, 'Q02', 0.3), { bold: true });
};

// ======================= 课本例题（A367） =======================
const PB9 = x => 1200 - 0.2 * x - 0.0001 * x * x;
const GB9 = { cx: 600, cy: 770 + 900 * 1.2, ux: 0.75, uy: 1.2, x0: 0, x1: 800, y0: 900, y1: 1250 };
SC.book = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0.05); gAxes(GB9, a * 0.75, { grid: false, ticks: { x: [[500, '500']], y: [[1075, '1075'], [1200, '1200']] } });
  gPlot(GB9, PB9, SQ.Q.col, { a, xa: 0, xb: 800, w: 4, p: prog(t, P('C05', 0.2), 1.2) });
  richReveal([['p = 1200 − 0.2x − 0.0001x²', SQ.Q.col]], 870, 250, 30, t, P('C05', 0.15), { upright: true });
  if (t > S('G03')) { const q = ap(t, 'G03', 0.1); seg(gx(GB9, 0), gy(GB9, 1075), gx(GB9, 780), gy(GB9, 1075), CYAN, q, 3, [10, 6]); label('P = 1075', gx(GB9, 720), gy(GB9, 1075) + 30, 26, CYAN, q, { bold: true });
    gBetween(GB9, PB9, () => 1075, 0, 500, ap(t, 'G03', 0.3), { col: 'rgba(255,200,60,0.45)', p: prog(t, P('G03', 0.3), 1.0) });
    richReveal([['CS = 100000/3 ≈ ', CR], ['33333', GOLD]], 870, 305, 30, t, P('G03', 0.5), { upright: true }); }
};

// ======================= 随堂 =======================
const GQ9 = { cx: 640, cy: 770, ux: 2.6, uy: 18, x0: 0, x1: 215, y0: 0, y1: 21 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['p = 20 − x/10，售价 10，', CR], ['CS = ？', GOLD]], 860, 260, 36, t, P('C07', 0.05), { upright: true });
  const a = ap(t, 'C07', 0.3); gAxes(GQ9, a * 0.75, { grid: false, ticks: { x: [[100, '100'], [200, '200']], y: [[10, '10'], [20, '20']] } });
  gPlot(GQ9, x => 20 - x / 10, SQ.Q.col, { a, xa: 0, xb: 200, w: 4 }); seg(gx(GQ9, 0), gy(GQ9, 10), gx(GQ9, 210), gy(GQ9, 10), CYAN, a, 3, [10, 6]);
  if (t > S('D01')) { gBetween(GQ9, x => 20 - x / 10, () => 10, 0, 100, ap(t, 'D01', 0.1), { col: 'rgba(255,200,60,0.5)' }); richReveal([['½ × 100 × 10 = ', CR], ['500', GOLD]], 860, 340, 34, t, P('D01', 0.2), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['CS = ', CR], ['∫₀ˣ (p(x) − P) dx', GOLD]], CX, 330, 46, t, P('C08', 0.1), { upright: true, alpha: ga }); label('需求曲线与售价线之间的面积', CX, 420, 32, CYAN, ga * ap(t, 'C08', 0.5), { bold: true }); }
  if (t > S('C09') - 0.1) { glowText('下一段：血流与心输出量', CX, 520, 50, CR, t, P('C09', 0.15)); glowText('MiMo 讲泊肃叶定律', CX, 610, 32, SQ.T.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 8 章 · P9 消费者剩余', '下一段：血流', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM8('千问')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Q01', 0.1, 'pop', 0.18); s('C01', 0.15, 'riser', 0.12); s('C01', 0.5, 'marimba', 0.16); s('C02', 0.1, 'pop', 0.16); s('G01', 0.1, 'zap', 0.14); s('G01', 0.4, 'ding', 0.2);
  s('C03', 0.3, 'pop', 0.16); s('C04', 0.1, 'swell', 0.14); s('C04', 0.3, 'pop', 0.16); s('G02', 0.4, 'ding_hi', 0.24); s('Q02', 0.3, 'sparkle', 0.18);
  s('C05', 0.2, 'pop', 0.16); s('G03', 0.1, 'zap', 0.14); s('G03', 0.5, 'ding', 0.22);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.2, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
