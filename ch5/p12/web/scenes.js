// 第 5 章 P12《定积分换元与对称性》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A228 x 轴到 u 轴的区间映射 · A229 偶函数两边面积相等 · A230 奇函数正负抵消
const SC = {};
const TITLES = [['hook', '换价签'], ['sub', '换元换限'], ['sym', '对称区间'], ['quiz', '随堂一题'], ['outro', '小结']];
function tag(x, y, txt, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(12,18,38,0.9)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 110, y - 50); ctx.lineTo(x + 80, y - 50); ctx.lineTo(x + 130, y); ctx.lineTo(x + 80, y + 50); ctx.lineTo(x - 110, y + 50); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 80, y, 9, 0, 7); ctx.stroke(); ctx.restore(); mathText(txt, x - 10, y + 12, 38, col, { align: 'center', alpha: a, upright: true });
}
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'Z01', 0), p = eIO(prog(t, P('Z01', 0.35), 0.6));
  tag(820, 420, 'x ∈ [0, 4]', CYAN, a * (1 - p)); tag(820, 420 + (1 - p) * 20, 'u ∈ [1, 9]', GOLD, a * p);
  label('变量换了 → 上下限也换', 1060, 600, 32, SQ.Z.col, ap(t, 'Z01', 0.6), { bold: true });
};
SC.sub = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['∫₀⁴ √(2x + 1) dx', CR]], CX, 260, 40, t, P('C01', 0.05), { upright: true });
  richReveal([['u = 2x + 1，  du = 2 dx', CYAN]], CX, 330, 30, t, P('C01', 0.5), { upright: true });
  const yx = 450, yu = 600, X = v => 600 + v * 100, U = v => 600 + (v - 1) * 100, a = ap(t, 'C02', 0);
  if (a > 0) {
    seg(X(-0.3), yx, X(8.3), yx, hexA(CR, 0.4), a, 2); seg(U(0.7), yu, U(9.3), yu, hexA(CR, 0.4), a, 2); label('x', X(8.5), yx + 8, 24, CR, a); label('u', U(9.5), yu + 8, 24, CR, a);
    seg(X(0), yx, X(4), yx, CYAN, a, 6); seg(U(1), yu, U(9), yu, GOLD, a, 6);
    for (let v = 0; v <= 4; v++) { const p = ap(t, 'C02', 0.1 + v * 0.07); mathText(String(v), X(v), yx - 18, 22, CYAN, { align: 'center', alpha: a, upright: true }); mathText(String(2 * v + 1), U(2 * v + 1), yu + 36, 22, GOLD, { align: 'center', alpha: p, upright: true }); seg(X(v), yx + 6, lerp(X(v), U(2 * v + 1), p), lerp(yx + 6, yu - 6, p), hexA(GOLD, 0.6), p, 2, [5, 5]); }
    richReveal([['= ∫₁⁹ (1/2)√u du = (1/3)u^(3/2) |₁⁹ = ', CR], ['26/3', GOLD]], CX, 720, 32, t, P('C02', 0.6), { upright: true });
  }
  if (t > S('Z02') - 0.1) label('不用换回 x', 1300, 800, 28, SQ.Z.col, ap(t, 'Z02', 0.2), { bold: true });
};
const ODD = x => Math.tan(x) / (1 + x * x + x * x * x * x);
SC.sym = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C03') - 0.1) { const a = ap(t, 'D01', 0); seg(600, 600, 1360, 600, CR, a, 3); seg(CX, 300, CX, 800, CR, a, 3); mathText('−a', 760, 640, 30, CYAN, { align: 'center', alpha: a, upright: true }); mathText('a', 1200, 640, 30, CYAN, { align: 'center', alpha: a, upright: true }); arrowH(CX - 20, 770, 560, CYAN, ap(t, 'D01', 0.3)); arrowH(CX + 20, 1190, 560, CYAN, ap(t, 'D01', 0.3)); return; }
  const GL = { cx: 720, cy: 560, ux: 110, uy: 110, x0: -1.8, x1: 1.8, y0: -1.6, y1: 2.2 }, GR = { cx: 1180, cy: 560, ux: 110, uy: 110, x0: -1.8, x1: 1.8, y0: -1.6, y1: 2.2 };
  const fe = x => 1.6 - 0.45 * x * x, fo = x => 0.5 * x * x * x - 0.3 * x;
  const a = ap(t, 'C03', 0), b = ap(t, 'C04', 0);
  panel(520, 300, 400, 420, CYAN, a); gAxes(GL, a, { grid: false, ticks: { x: [[-1.5, '−a'], [1.5, 'a']] } }); gArea(GL, fe, -1.5, 0, a * 0.8, { pos: GRN }); gArea(GL, fe, 0, 1.5, a * 0.8, { pos: GRN }); gPlot(GL, fe, RED, { a, xa: -1.7, xb: 1.7 });
  label('偶：2∫₀ᵃ f', 760, 690, 26, CYAN, a, { bold: true });
  if (b > 0) { panel(980, 300, 400, 420, GOLD, b); gAxes(GR, b, { grid: false, ticks: { x: [[-1.5, '−a'], [1.5, 'a']] } }); gArea(GR, fo, -1.5, 1.5, b * 0.8); gPlot(GR, fo, RED, { a: b, xa: -1.6, xb: 1.6 }); label('奇：= 0', 1220, 690, 26, GOLD, b, { bold: true }); }
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0); panel(520, 220, 860, 70, INV, g); richReveal([['∫₋₁¹ tan x / (1 + x² + x⁴) dx = ', CR], ['0', GOLD]], CX, 255, 28, t, P('G01', 0.1), { upright: true });
  }
  if (t > S('Z03') - 0.1) label('省下一页草稿纸', CX, 800, 30, SQ.Z.col, ap(t, 'Z03', 0.2), { bold: true });
};
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['∫₋₂² x³ cos x dx = ？', CR]], 820, 330, 46, t, P('C06', 0.1), { upright: true });
  if (t > S('D02')) { const G = { cx: 820, cy: 640, ux: 110, uy: 30, x0: -2.3, x1: 2.3, y0: -5, y1: 5 }, f = x => x * x * x * Math.cos(x), d = ap(t, 'D02', 0); gAxes(G, d, { grid: false, ticks: { x: [[-2, '−2'], [2, '2']] } }); gArea(G, f, -2, 2, d); gPlot(G, f, RED, { a: d, xa: -2.2, xb: 2.2 }); richReveal([['= ', CR], ['0', GOLD]], 1200, 640, 52, t, P('D02', 0.6), { upright: true }); }
};
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) { richReveal([['换元 → 换上下限', GOLD]], CX, 380, 44, t, P('C07', 0.1), { upright: true, alpha: ga }); richReveal([['对称区间：偶 ×2，奇 = 0', CYAN]], CX, 470, 40, t, P('C07', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C08') - 0.1) { glowText('下一段：三角代换', CX, 500, 52, CR, t, P('C08', 0.15)); glowText('Mistral：骑士绕圆', CX, 590, 32, SQ.R.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 5 章 · P12 定积分换元与对称性', '下一段：三角代换', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM5('GLM')]);
};
SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Z01', 0.35, 'stamp', 0.22); s('Z01', 0.6, 'pop', 0.16);
  s('C01', 0.05, 'type', 0.12); s('C01', 0.5, 'type', 0.12); for (let v = 0; v <= 4; v++) s('C02', 0.1 + v * 0.07, 'marimba', 0.12); s('C02', 0.6, 'ding', 0.22); s('Z02', 0.2, 'check', 0.2);
  s('D01', 0.3, 'whoosh', 0.14); s('C03', 0.1, 'pop', 0.16); s('C04', 0.1, 'pop', 0.16); s('G01', 0.1, 'type', 0.12); s('G01', 0.6, 'ding_hi', 0.24); s('Z03', 0.2, 'pop', 0.16);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.6, 'ding_hi', 0.28);
  s('C07', 0.1, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
