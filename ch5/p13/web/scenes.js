// 第 5 章 P13《三角代换》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A231 单位圆上 θ 转动、x = sin θ 投影 · A232 三种代换的直角三角形 · A233 圆压扁成椭圆
const SC = {};
const TITLES = [['hook', '绕圆巡逻'], ['ex', 'x = sin θ'], ['three', '三种代换'], ['ell', '椭圆面积'], ['quiz', '随堂一题'], ['outro', '小结']];
// 单位圆：θ 从竖直轴量起，x = sin θ 为水平投影，cos θ = √(1 − x²) 为竖直高
function circleTri(cx, cy, R, th, a, o = {}) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = hexA(CYAN, 0.6); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
  seg(cx - R - 20, cy, cx + R + 20, cy, hexA(CR, 0.5), a, 2); seg(cx, cy + R + 20, cx, cy - R - 20, hexA(CR, 0.5), a, 2);
  const px = cx + R * Math.sin(th), py = cy - R * Math.cos(th);
  seg(cx, cy, px, py, SQ.R.col, a, 4); seg(px, py, px, cy, GOLD, a, 4); seg(cx, cy, px, cy, CYAN, a, 4);
  gDot({ cx: 0, cy: 0, ux: 1, uy: -1 }, px, -py, SQ.R.col, a);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = SQ.R.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 46, -Math.PI / 2, -Math.PI / 2 + th); ctx.stroke(); ctx.restore();
  mathText('θ', cx + 60 * Math.sin(th / 2), cy - 60 * Math.cos(th / 2), 24, SQ.R.col, { align: 'center', alpha: a, upright: true });
  mathText('x = sin θ', (cx + px) / 2, cy + 34, 24, CYAN, { align: 'center', alpha: a, upright: true });
  if (!o.noCos) mathText('√(1 − x²) = cos θ', px + 16, (cy + py) / 2, 24, GOLD, { alpha: a, upright: true });
  mathText('1', (cx + px) / 2 - 18, (cy + py) / 2 - 8, 24, SQ.R.col, { align: 'center', alpha: a, upright: true });
}
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'R01', 0), th = 0.35 + 0.5 * (0.5 - 0.5 * Math.cos((t - S('R01')) * 1.3));
  circleTri(820, 560, 250, th, a);
  richReveal([['1 − sin²θ = cos²θ', GOLD]], 1240, 300, 32, t, P('R01', 0.5), { upright: true });
};
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  const G = { cx: 600, cy: 800, ux: 300, uy: 300, x0: -0.05, x1: 1.15, y0: -0.05, y1: 1.12 }, a = ap(t, 'C01', 0), f = x => Math.sqrt(Math.max(0, 1 - x * x));
  gAxes(G, a, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } }); gArea(G, f, 0, 1, a * (t > S('R02') ? 1 : 0.5)); gPlot(G, f, RED, { a, xa: 0, xb: 1, n: 300 });
  richReveal([['∫₀¹ √(1 − x²) dx', CR]], 1180, 260, 34, t, P('C01', 0.05), { upright: true });
  richReveal([['x = sin θ，dx = cos θ dθ', CYAN]], 1180, 320, 28, t, P('C01', 0.4), { upright: true });
  richReveal([['θ：0 → π/2', CYAN]], 1180, 370, 28, t, P('C01', 0.7), { upright: true });
  if (t > S('C02') - 0.1) { richReveal([['= ∫₀^(π/2) cos²θ dθ', CR]], 1180, 450, 30, t, P('C02', 0.05), { upright: true }); richReveal([['= ∫₀^(π/2) (1 + cos 2θ)/2 dθ', CR]], 1180, 510, 28, t, P('C02', 0.35), { upright: true }); richReveal([['= π/4', GOLD]], 1180, 580, 40, t, P('C02', 0.7), { upright: true }); }
  if (t > S('R02') - 0.1) label('P4：四分之一圆', gx(G, 0.4), gy(G, 0.4), 26, GOLD, ap(t, 'R02', 0.2), { bold: true });
};
function tri(x, y, w, h, a, hyp, leg1, leg2, col, th) {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y - h); ctx.closePath(); ctx.stroke();
  ctx.strokeRect(x + w - 16, y - 16, 16, 16); ctx.restore();
  mathText(hyp, x + w / 2 - 30, y - h / 2 - 14, 22, GOLD, { align: 'center', alpha: a, upright: true });
  mathText(leg1, x + w + 12, y - h / 2 + 6, 22, CR, { alpha: a, upright: true });
  mathText(leg2, x + w / 2, y + 30, 22, CR, { align: 'center', alpha: a, upright: true });
  mathText(th, x + 40, y - 10, 20, SQ.R.col, { alpha: a, upright: true });
}
SC.three = t => {
  starfield(t); blueprint(0.4, 80);
  const rows = [['√(a² − x²)', 'x = a sin θ', 'a', 'x', '√(a² − x²)'], ['√(a² + x²)', 'x = a tan θ', '√(a² + x²)', 'x', 'a'], ['√(x² − a²)', 'x = a sec θ', 'x', '√(x² − a²)', 'a']];
  rows.forEach(([r, s, h, l1, l2], i) => {
    const p = ap(t, 'C03', 0.12 + i * 0.27); if (p <= 0) return; const x = 560 + i * 310;
    panel(x, 230, 280, 470, [CYAN, GOLD, INV][i], p);
    label(r, x + 140, 280, 28, CR, p, { font: F_MATH, bold: true }); label(s, x + 140, 330, 26, [CYAN, GOLD, INV][i], p, { font: F_MATH, bold: true });
    if (t > S('G01') - 0.1) tri(x + 40, 600, 160, 150, ap(t, 'G01', 0.1 + i * 0.15), h, l1, l2, [CYAN, GOLD, INV][i], 'θ');
  });
  if (t > S('R03') - 0.1) { panel(700, 740, 560, 80, SQ.R.col, ap(t, 'R03', 0)); label('同济：第二类换元法', CX, 782, 30, SQ.R.col, ap(t, 'R03', 0.1), { bold: true }); }
};
SC.ell = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C04', 0), p = eIO(prog(t, P('C04', 0.15), 1.2)), q = t > S('D01') ? eIO(prog(t, P('D01', 0.1), 0.8)) : 0;
  const A = 300, B = lerp(220, 150, p), Bq = lerp(B, A * 0.73, 0) , cx = 860, cy = 560, rx = A * 0.73, ry = lerp(B, rx, q);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = hexA(GOLD, 0.25); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy, rx, q > 0 ? ry : B, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  seg(cx, cy, cx + rx, cy, CYAN, a, 3); seg(cx, cy, cx, cy - (q > 0 ? ry : B), INV, a, 3); mathText('a', cx + rx / 2, cy + 30, 26, CYAN, { align: 'center', alpha: a, upright: true }); mathText(q > 0.5 ? 'a' : 'b', cx - 20, cy - (q > 0 ? ry : B) / 2, 26, INV, { align: 'center', alpha: a, upright: true });
  richReveal([['x²/a² + y²/b² = 1', CR]], 1250, 260, 30, t, P('C04', 0.05), { upright: true });
  richReveal([['y = (b/a)√(a² − x²)', CR]], 1250, 320, 26, t, P('C04', 0.3), { upright: true });
  richReveal([['S = ', CR], ['πab', GOLD]], 1250, 400, 40, t, P('C04', 0.75), { upright: true });
  if (t > S('D01') - 0.1) richReveal([['a = b = r：  S = ', CR], ['πr²', GOLD]], 1250, 480, 32, t, P('D01', 0.3), { upright: true });
};
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫₀² √(4 − x²) dx = ？', CR]], 820, 330, 46, t, P('C06', 0.1), { upright: true });
  if (t > S('D02')) { const G = { cx: 700, cy: 780, ux: 160, uy: 160, x0: -0.1, x1: 2.3, y0: -0.1, y1: 2.2 }, f = x => Math.sqrt(Math.max(0, 4 - x * x)), d = ap(t, 'D02', 0); gAxes(G, d, { grid: false, ticks: { x: [[2, '2']], y: [[2, '2']] } }); gArea(G, f, 0, 2, d); gPlot(G, f, RED, { a: d, xa: 0, xb: 2, n: 300 }); richReveal([['= ', CR], ['π', GOLD]], 1200, 620, 54, t, P('D02', 0.4), { upright: true }); }
};
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) [['√(a² − x²)  →  a sin θ', CYAN], ['√(a² + x²)  →  a tan θ', GOLD], ['√(x² − a²)  →  a sec θ', INV]].forEach(([s, c], i) => richReveal([[s, c]], CX, 340 + i * 80, 40, t, P('C07', 0.1 + i * 0.2), { upright: true, alpha: ga }));
  if (t > S('C08') - 0.1) { glowText('下一段：分部积分', CX, 500, 52, CR, t, P('C08', 0.15)); glowText('豆包：先糊弄，再道歉', CX, 590, 32, SQ.B.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 5 章 · P13 三角代换', '下一段：分部积分', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM5('Mistral')]);
};
SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('R01', 0.1, 'hum', 0.12); s('R01', 0.5, 'shimmer', 0.2);
  s('C01', 0.05, 'type', 0.12); s('C01', 0.4, 'type', 0.12); s('C02', 0.05, 'type', 0.12); s('C02', 0.7, 'ding_hi', 0.24); s('R02', 0.2, 'check', 0.2);
  [0.12, 0.39, 0.66].forEach(f => s('C03', f, 'pop', 0.16)); [0.1, 0.25, 0.4].forEach(f => s('G01', f, 'pluck', 0.14)); s('R03', 0.1, 'pop', 0.16);
  s('C04', 0.15, 'warp', 0.18); s('C04', 0.75, 'ding', 0.22); s('D01', 0.1, 'swoosh_in', 0.16); s('D01', 0.3, 'ding_hi', 0.24);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.4, 'ding_hi', 0.28);
  s('C07', 0.1, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
