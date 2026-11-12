// 第 8 章 P6《平面薄片的形心》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.3。
// A356 薄片顶在指尖上 · A357 竖条质心 (x, f/2) 汇成积分 · A358 半圆形心低于一半
const SC = {};
const TITLES = [['balance', '形心'], ['strip', '竖条'], ['example', '例题'], ['semi', '半圆'], ['quiz', '随堂一题'], ['outro', '小结']];

function fingerP6(x, y, a) {   // 指尖：圆头竖条
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#f2d2b6'; ctx.strokeStyle = '#c99a7a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 20, y + 200); ctx.lineTo(x - 20, y + 18); ctx.arc(x, y + 18, 20, Math.PI, 0); ctx.lineTo(x + 20, y + 200); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}
function rectStripP6(G, x, w, lo, hi, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10;
  ctx.fillRect(gx(G, x - w / 2), gy(G, hi), w * G.ux, (hi - lo) * G.uy); ctx.restore();
}

// ======================= 指尖平衡（A356） =======================
const GB6 = { cx: 640, cy: 560, ux: 460, uy: 300, x0: 0, x1: 1, y0: 0, y1: 1 };
const FB6 = x => 0.35 + 0.9 * Math.sqrt(x) - 0.35 * x;
SC.balance = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'Z01', 0.1), wob = 0.05 * Math.sin(t * 3) * Math.exp(-Math.max(0, t - P('Z01', 0.1)) * 0.6);
  // 求形心（数值）
  let A = 0, Mx = 0, My = 0; for (let i = 0; i < 200; i++) { const x = (i + 0.5) / 200, f = FB6(x); A += f; Mx += x * f; My += f * f / 2; }
  const xb = Mx / A, yb = My / A, X = gx(GB6, xb), Y = gy(GB6, yb);
  ctx.save(); ctx.translate(X, Y); ctx.rotate(wob); ctx.translate(-X, -Y);
  gBetween(GB6, FB6, () => 0, 0, 1, a * 0.8, { col: 'rgba(201,195,230,0.55)' }); gPlot(GB6, FB6, SQ.Z.col, { a, xa: 0, xb: 1, w: 4 });
  seg(gx(GB6, 0), GB6.cy, gx(GB6, 1), GB6.cy, SQ.Z.col, a, 4); seg(gx(GB6, 0), GB6.cy, gx(GB6, 0), gy(GB6, FB6(0)), SQ.Z.col, a, 4); seg(gx(GB6, 1), GB6.cy, gx(GB6, 1), gy(GB6, FB6(1)), SQ.Z.col, a, 4);
  glowDot(X, Y, 10, GOLD, a * ap(t, 'Z01', 0.5)); ctx.restore();
  fingerP6(X, GB6.cy + 4, a);
  seg(X, Y, X, GB6.cy, GOLD, a * ap(t, 'Z01', 0.5) * 0.7, 2, [6, 5]);
  if (t > S('C01')) richReveal([['密度均匀  ⇒  质心 = ', CR], ['形心', GOLD], ['（只看形状）', CYAN]], 870, 250, 34, t, P('C01', 0.2), { upright: true });
};

// ======================= 竖条（A357） =======================
const GS6 = { cx: 600, cy: 760, ux: 520, uy: 360, x0: 0, x1: 1.1, y0: 0, y1: 1.3 };
SC.strip = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C02', 0.05); gAxes(GS6, a * 0.7, { grid: false, ticks: { x: [[1, 'b']], y: [] } });
  gBetween(GS6, FB6, () => 0, 0, 1, a * 0.35, { col: 'rgba(201,195,230,0.5)' }); gPlot(GS6, FB6, SQ.Z.col, { a, xa: 0, xb: 1, w: 4 });
  label('y = f(x)', gx(GS6, 1) + 70, gy(GS6, FB6(1)) - 10, 26, SQ.Z.col, a, { bold: true });
  const xs = 0.62, w = 0.07, h = FB6(xs), q = ap(t, 'C02', 0.3);
  rectStripP6(GS6, xs, w, 0, h, 'rgba(255,200,60,0.75)', q);
  label('dx', gx(GS6, xs), GS6.cy + 26, 24, GOLD, q, { bold: true }); label('f(x)', gx(GS6, xs) - 62, gy(GS6, h / 2), 24, GOLD, q, { bold: true });
  if (t > S('C02')) richReveal([['dA = f(x) dx', GOLD]], 870, 250, 32, t, P('C02', 0.4), { upright: true });
  if (t > S('C03')) { const k = ap(t, 'C03', 0.3); glowDot(gx(GS6, xs), gy(GS6, h / 2), 9, RED, k); label('(x, f(x)/2)', gx(GS6, xs) + 92, gy(GS6, h / 2), 24, RED, k, { bold: true }); }
  if (t > S('G01')) { richReveal([['x̄ = (1/A)∫ x f(x) dx', CR]], 870, 310, 30, t, P('G01', 0.15), { upright: true }); richReveal([['ȳ = (1/A)∫ ½ f(x)² dx', CR]], 870, 360, 30, t, P('G01', 0.55), { upright: true }); }
  if (t > S('Z02')) label('Σ  →  ∫', 870, 412, 36, SQ.Z.col, ap(t, 'Z02', 0.2), { bold: true });
};

// ======================= 例题（A358 前半） =======================
const GE6 = { cx: 620, cy: 770, ux: 470, uy: 440, x0: 0, x1: 1.15, y0: 0, y1: 1.15 };
SC.example = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C04', 0.05); gAxes(GE6, a * 0.7, { grid: false, ticks: { x: [[0.5, '½'], [1, '1']], y: [[1, '1']] } });
  gPlot(GE6, x => x, CYAN, { a, xa: 0, xb: 1.08, w: 4 }); gPlot(GE6, x => x * x, GRN, { a, xa: 0, xb: 1.05, w: 4 });
  label('y = x', gx(GE6, 1.08) + 50, gy(GE6, 1.08), 24, CYAN, a, { bold: true }); label('y = x²', gx(GE6, 1.05) + 56, gy(GE6, 1.0) + 30, 24, GRN, a, { bold: true });
  richReveal([['y = x 与 y = x² 之间', CR]], 870, 250, 32, t, P('C04', 0.2), { upright: true });
  if (t > S('C05')) { const q = ap(t, 'C05', 0.1); gBetween(GE6, x => x, x => x * x, 0, 1, q * 0.5, { col: 'rgba(201,195,230,0.6)' });
    rectStripP6(GE6, 0.62, 0.05, 0.62 * 0.62, 0.62, 'rgba(255,200,60,0.8)', ap(t, 'C05', 0.4)); richReveal([['A = 1/6，竖条高 x − x²', CR]], 870, 310, 30, t, P('C05', 0.2), { upright: true }); }
  if (t > S('G02')) { const q = ap(t, 'G02', 0.2); glowDot(gx(GE6, 0.5), gy(GE6, 0.4), 11, GOLD, q); goldBox(870, 372, 380, 56, '(x̄, ȳ) = (1/2, 2/5)', 30, q);
    seg(gx(GE6, 0), gy(GE6, 0.5), gx(GE6, 1.05), gy(GE6, 0.5), RED, ap(t, 'G02', 0.55), 2, [8, 6]); label('y = ½', gx(GE6, 1.05) + 46, gy(GE6, 0.5), 24, RED, ap(t, 'G02', 0.55), { bold: true }); }
};

// ======================= 半圆（A358） =======================
const SX6 = 860, SY6 = 760, SR6 = 300;
SC.semi = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'Z03', 0.1), k = prog(t, P('Z03', 0.1), 1.0);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(201,195,230,0.32)'; ctx.strokeStyle = SQ.Z.col; ctx.lineWidth = 4; ctx.shadowColor = SQ.Z.col; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(SX6 + SR6, SY6); ctx.arc(SX6, SY6, SR6, 0, -Math.PI * k, true); ctx.lineTo(SX6, SY6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  seg(SX6 - SR6 - 20, SY6, SX6 + SR6 + 20, SY6, CR, a, 2);
  seg(SX6, SY6, SX6, SY6 - SR6 - 20, CYAN, a * ap(t, 'Z03', 0.5), 2, [8, 6]); label('对称 ⇒ x̄ = 0', SX6 + 290, SY6 - SR6 + 10, 26, CYAN, a * ap(t, 'Z03', 0.5), { bold: true });
  label('R', SX6 + SR6 / 2, SY6 + 26, 26, CR, a);
  if (t > S('C06')) { const q = ap(t, 'C06', 0.1), yb = 4 / (3 * Math.PI);
    seg(SX6 - SR6, SY6 - SR6 / 2, SX6 + SR6, SY6 - SR6 / 2, RED, q, 2, [8, 6]); label('R/2', SX6 - SR6 - 40, SY6 - SR6 / 2, 24, RED, q, { bold: true });
    glowDot(SX6, SY6 - yb * SR6, 11, GOLD, ap(t, 'C06', 0.25)); label('ȳ ≈ 0.42R', SX6 + 100, SY6 - yb * SR6 + 4, 26, GOLD, ap(t, 'C06', 0.25), { bold: true });
    richReveal([['ȳ = ', CR], ['4R/(3π)', GOLD], [' ≈ 0.424R < R/2', CR]], 870, 260, 32, t, P('C06', 0.2), { upright: true }); }
};

// ======================= 随堂 =======================
const GQ6 = { cx: 640, cy: 770, ux: 440, uy: 400, x0: 0, x1: 1.15, y0: 0, y1: 1.1 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['y = x² 下方，0 ≤ x ≤ 1，', CR], ['x̄ = ？', GOLD]], 860, 260, 36, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); gAxes(GQ6, a * 0.7, { grid: false, ticks: { x: [[0.5, '½'], [1, '1']], y: [[1, '1']] } });
  gBetween(GQ6, x => x * x, () => 0, 0, 1, a * 0.45, { col: 'rgba(92,200,232,0.5)' }); gPlot(GQ6, x => x * x, CYAN, { a, xa: 0, xb: 1.05, w: 4 });
  if (t > S('D01')) { const q = ap(t, 'D01', 0.1); glowDot(gx(GQ6, 0.75), gy(GQ6, 0.3), 10, GOLD, q); seg(gx(GQ6, 0.75), gy(GQ6, 0.3), gx(GQ6, 0.75), GQ6.cy, GOLD, q, 2, [6, 5]);
    richReveal([['(1/4) / (1/3) = ', CR], ['3/4', GOLD]], 860, 340, 34, t, P('D01', 0.1), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['x̄ = (1/A)∫ x f dx', GOLD]], CX, 330, 42, t, P('C09', 0.1), { upright: true, alpha: ga }); richReveal([['ȳ = (1/A)∫ ½ f² dx', GOLD]], CX, 410, 42, t, P('C09', 0.4), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：帕普斯定理', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('MiniMax 转出一个甜甜圈', CX, 610, 32, SQ.N.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P6 形心', '下一段：帕普斯定理', [...CREDIT_BASE, ...CREDIT_GEN('GLM '), ...CREDIT_END, CREDIT_TM8('GLM')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Z01', 0.1, 'thud', 0.18); s('Z01', 0.5, 'ding', 0.18); s('C01', 0.2, 'pop', 0.18);
  s('C02', 0.3, 'zap', 0.14); s('C02', 0.4, 'pop', 0.16); s('C03', 0.3, 'tick', 0.16); s('G01', 0.15, 'pop', 0.16); s('G01', 0.55, 'pop', 0.16); s('Z02', 0.2, 'shimmer', 0.16);
  s('C04', 0.2, 'pop', 0.16); s('C05', 0.1, 'swell', 0.12); s('C05', 0.4, 'zap', 0.14); s('G02', 0.2, 'ding', 0.24); s('G02', 0.55, 'tick', 0.14);
  s('Z03', 0.1, 'whoosh', 0.16); s('Z03', 0.5, 'pop', 0.16); s('C06', 0.1, 'tick', 0.14); s('C06', 0.25, 'ding', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28);
  s('C09', 0.1, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
