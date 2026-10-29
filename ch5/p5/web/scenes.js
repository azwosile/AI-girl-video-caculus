// 第 5 章 P5《中点法则与积分性质》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A203 取景框中心 → 中点 · A204 1/x 的 M₅ 与 L₅/R₅ 对比（误差一多一少抵消） · A205 性质卡片 · A206 e^(−x²) 夹在两矩形之间
const SC = {};
const TITLES = [['hook', '取中间'], ['mid', '中点法则'], ['prop', '积分性质'], ['cmp', '比较与估值'], ['quiz', '随堂一题'], ['outro', '小结']];
const INV1 = x => 1 / x;
const GM = { cx: 90, cy: 800, ux: 520, uy: 480, x0: 0.92, x1: 2.12, y0: -0.05, y1: 1.12 };

SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'N01', 0), x = 640, y = 260, w = 680, h = 420;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = CR; ctx.lineWidth = 4;
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, sx, sy]) => { ctx.beginPath(); ctx.moveTo(px + sx * 60, py); ctx.lineTo(px, py); ctx.lineTo(px, py + sy * 60); ctx.stroke(); });
  ctx.strokeStyle = hexA(CR, 0.25); ctx.lineWidth = 1.5; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + w * k / 3, y); ctx.lineTo(x + w * k / 3, y + h); ctx.moveTo(x, y + h * k / 3); ctx.lineTo(x + w, y + h * k / 3); ctx.stroke(); }
  ctx.restore();
  const c = ap(t, 'N01', 0.3); seg(x + w / 2 - 30, y + h / 2, x + w / 2 + 30, y + h / 2, SQ.N.col, c, 3); seg(x + w / 2, y + h / 2 - 30, x + w / 2, y + h / 2 + 30, SQ.N.col, c, 3);
  label('REC ●', x + w - 70, y + 30, 22, RED, a * (0.6 + 0.4 * Math.sin(t * 6)), { bold: true });
  const p = ap(t, 'N01', 0.6); if (p > 0) { panel(x + 220, y + h + 40, 240, 120, GOLD, p); gDot({ cx: 0, cy: 0, ux: 1, uy: -1 }, x + 340, -(y + h + 40), GOLD, p); label('高 = 中点的值？', x + 340, y + h + 200, 28, GOLD, p, { bold: true }); }
};

function errPatch(G, xa, xb, a) {
  const xm = (xa + xb) / 2, h = INV1(xm);
  [[xa, xm, RED], [xm, xb, GRN]].forEach(([u, v, col]) => {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = hexA(col, 0.75); ctx.beginPath(); ctx.moveTo(gx(G, u), gy(G, h));
    for (let k = 0; k <= 30; k++) { const s = u + (v - u) * k / 30; ctx.lineTo(gx(G, s), gy(G, INV1(s))); } ctx.lineTo(gx(G, v), gy(G, h)); ctx.closePath(); ctx.fill(); ctx.restore();
  });
}
SC.mid = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(GM, a, { grid: false, xl: 'x', ticks: { x: [[1, '1'], [1.5, '1.5'], [2, '2']], y: [[0.5, '0.5'], [1, '1']] } });
  gRects(GM, INV1, 1, 2, 5, 'M', GOLD, a, { k: t < S('C02') ? 5 * prog(t, P('C01', 0.4), 1) : 5, dots: true, fa: 0.25 });
  gPlot(GM, INV1, RED, { a, xa: 0.95, xb: 2.1, w: 4 }); mathText('y = 1/x', gx(GM, 1.1), gy(GM, INV1(1.1)) - 50, 26, RED, { alpha: a, upright: true });
  if (t > S('C03') - 0.1) errPatch(GM, 1.0, 1.2, ap(t, 'C03', 0.2) * (0.6 + 0.4 * Math.sin(t * 5)));
  if (t > S('C02') - 0.1) {
    const rows = [['L₅', riemann(INV1, 1, 2, 5, 'L'), CR], ['R₅', riemann(INV1, 1, 2, 5, 'R'), CR], ['M₅', riemann(INV1, 1, 2, 5, 'M'), GOLD], ['ln 2', Math.log(2), GRN]];
    panel(1080, 230, 380, 250, CYAN, ap(t, 'C02', 0.3));
    rows.forEach(([k, v, c], i) => { const p = i < 3 ? ap(t, 'C02', 0.35 + i * 0.15) : ap(t, 'N02', 0.1); if (p > 0) mathText(`${k} ≈ ${v.toFixed(4)}`, 1270, 280 + i * 52, 30, c, { align: 'center', alpha: p, upright: true }); });
  }
  if (t > S('C03') - 0.1) { label('多一点 · 少一点', 1330, 560, 30, CR, ap(t, 'C03', 0.3), { bold: true }); label('误差抵消', 1330, 610, 30, GOLD, ap(t, 'C03', 0.5), { bold: true }); }
};

SC.prop = t => {
  starfield(t); blueprint(0.4, 80);
  const cards = [
    ['C04', 0.1, [['∫ₐᵃ f(x) dx = 0', CYAN]], 230], ['C04', 0.5, [['∫ᵦᵃ f(x) dx = −∫ₐᵇ f(x) dx', CYAN]], 300],
    ['C05', 0.1, [['∫ₐᵇ (f ± g) = ∫ₐᵇ f ± ∫ₐᵇ g', GOLD]], 400], ['C05', 0.4, [['∫ₐᵇ cf = c ∫ₐᵇ f', GOLD]], 465], ['C05', 0.7, [['∫ₐᵇ c dx = c(b − a)', GOLD]], 530]];
  const dim = t > S('G01') ? 0.35 : 1;
  cards.forEach(([id, f, parts, y]) => { if (t > P(id, f) - 0.05) richReveal(parts, CX, y, 34, t, P(id, f), { upright: true, alpha: dim }); });
  if (t > S('C05') - 0.1) label('线性', 600, 465, 28, GOLD, ap(t, 'C05', 0.1) * dim, { bold: true });
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0), y = 720, X = [640, 1040, 1320];
    seg(600, y, 1360, y, CR, g, 3); ['a', 'c', 'b'].forEach((s, i) => { gDot({ cx: 0, cy: 0, ux: 1, uy: -1 }, X[i], -y, GOLD, g); mathText(s, X[i], y + 36, 28, CR, { align: 'center', alpha: g, upright: true }); });
    const arc = (x0, x1, col, p, up) => { ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, y, (x1 - x0) / 2, up, 0, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.restore(); };
    arc(X[0], X[1], CYAN, ap(t, 'G01', 0.2), 70); arc(X[1], X[2], INV, ap(t, 'G01', 0.4), 50); arc(X[0], X[2], GOLD, ap(t, 'G01', 0.6), 130);
    richReveal([['∫ₐᶜ f', CYAN], [' + ', CR], ['∫ᶜᵇ f', INV], [' = ', CR], ['∫ₐᵇ f', GOLD]], CX, 860, 36, t, P('G01', 0.6), { upright: true });
  }
};

const GE = { cx: 640, cy: 780, ux: 420, uy: 420, x0: -0.1, x1: 1.3, y0: -0.05, y1: 1.2 };
SC.cmp = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C07') - 0.1) {
    const G = { cx: 600, cy: 780, ux: 140, uy: 110, x0: -0.2, x1: 4.8, y0: -0.2, y1: 4 }, a = ap(t, 'C06', 0), f = x => 2.4 + 0.6 * Math.sin(x), g = x => 1 + 0.3 * Math.cos(1.5 * x);
    gAxes(G, a, { grid: false, xl: 'x', ticks: { x: [[0.5, 'a'], [4.2, 'b']] } });
    gArea(G, f, 0.5, 4.2, a * 0.35); gArea(G, g, 0.5, 4.2, a * 0.6, { pos: INV });
    gPlot(G, f, RED, { a, xa: 0, xb: 4.6 }); gPlot(G, g, INV, { a, xa: 0, xb: 4.6 });
    mathText('f', gx(G, 4.5), gy(G, f(4.5)) - 24, 28, RED, { align: 'center', alpha: a, upright: true }); mathText('g', gx(G, 4.5), gy(G, g(4.5)) - 24, 28, INV, { align: 'center', alpha: a, upright: true });
    richReveal([['f ≥ g  ⇒  ∫ₐᵇ f ≥ ∫ₐᵇ g', GOLD]], 1230, 300, 32, t, P('C06', 0.4), { upright: true });
    return;
  }
  const a = ap(t, 'C07', 0), f = x => Math.exp(-x * x), m = Math.exp(-1);
  gAxes(GE, a, { grid: false, xl: 'x', ticks: { x: [[1, '1']], y: [[1, '1'], [m, '1/e']] } });
  gBand(GE, 0, 1, 0, 1, hexA(CYAN, 0.12), ap(t, 'C07', 0.3)); gBand(GE, 0, 1, 0, m, hexA(GOLD, 0.3), ap(t, 'C07', 0.5));
  gArea(GE, f, 0, 1, a * 0.6, { pos: RED }); gPlot(GE, f, RED, { a, xa: 0, xb: 1.25 });
  richReveal([['m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a)', CR]], 1230, 280, 30, t, P('C07', 0.2), { upright: true });
  if (t > S('N03') - 0.1) { mathText('y = e^(−x²)', gx(GE, 1.15), gy(GE, f(1.15)) - 30, 26, RED, { align: 'center', alpha: ap(t, 'N03', 0), upright: true }); richReveal([['1/e ≤ ∫₀¹ e^(−x²) dx ≤ 1', GOLD]], 1230, 380, 32, t, P('N03', 0.5), { upright: true }); }
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫₀¹⁰ f = 17，  ∫₀⁸ f = 12', CR]], 820, 300, 38, t, P('C09', 0.1), { upright: true });
  richReveal([['∫₈¹⁰ f = ？', GOLD]], 820, 380, 42, t, P('C09', 0.5), { upright: true });
  const y = 560, X = v => 600 + v * 50, b = ap(t, 'C09', 0.6);
  seg(X(0), y, X(10), y, CR, b, 3); [0, 8, 10].forEach(v => { seg(X(v), y - 12, X(v), y + 12, CR, b, 3); mathText(String(v), X(v), y + 40, 26, CR, { align: 'center', alpha: b, upright: true }); });
  if (t > S('D01')) { const d = ap(t, 'D01', 0.1); panel(X(8), y - 50, X(10) - X(8), 40, GOLD, d); richReveal([['17 − 12 = ', CR], ['5', GOLD]], 820, 680, 44, t, P('D01', 0.2), { upright: true }); }
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) [['中点法则：更准', GOLD], ['线性 · 区间可拼接', CYAN], ['比较 · 估值', GRN]].forEach(([s, c], i) => richReveal([[s, c]], CX, 330 + i * 80, 40, t, P('C10', 0.1 + i * 0.25), { upright: true, alpha: ga }));
  if (t > S('C11') - 0.1) { glowText('下一段：积分中值定理与平均值', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('混元：平均气温怎么算', CX, 590, 32, SQ.H.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 5 章 · P5 中点法则与积分性质', '下一段：积分中值定理与平均值', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM5('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.1, 'click', 0.18); s('N01', 0.3, 'tick', 0.14); s('N01', 0.6, 'pop', 0.18);
  for (let i = 0; i < 5; i++) sfx(P('C01', 0.4) + i * 0.2, 'marimba', 0.12); s('C02', 0.35, 'type', 0.12); s('C02', 0.65, 'ding', 0.2); s('N02', 0.1, 'ding_hi', 0.24); s('C03', 0.3, 'shimmer', 0.18);
  s('C04', 0.1, 'pop', 0.16); s('C04', 0.5, 'pop', 0.16); s('C05', 0.1, 'pop', 0.16); s('C05', 0.4, 'pop', 0.16); s('C05', 0.7, 'pop', 0.16); s('G01', 0.6, 'ding', 0.2);
  s('C06', 0.4, 'ding', 0.2); s('C07', 0.3, 'whoosh', 0.14); s('N03', 0.5, 'ding_hi', 0.24);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.2, 'ding_hi', 0.28);
  s('C10', 0.1, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
