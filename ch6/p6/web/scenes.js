// 第 6 章 P6《垫圈法》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.2 例 4、例 5。
// A263 垫圈截面（铜钱 → 圆环）· A264 换转轴 y = 2 后内外半径重新量 · A265 错误公式与正确公式的面积对比
const SC = {};
const TITLES = [['coin', '外圆减内孔'], ['ex4', '绕 x 轴'], ['trap', '陷阱'], ['axis', '绕 y = 2'], ['quiz', '随堂一题'], ['outro', '小结']];
const BRZ = '#D9A441';
function ring(cx, cy, R, r, col, a, o = {}) { // 正视圆环（r 为 0 时实心）；o.sq 方孔
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  if (o.sq) { ctx.moveTo(cx - o.sq, cy - o.sq); ctx.lineTo(cx - o.sq, cy + o.sq); ctx.lineTo(cx + o.sq, cy + o.sq); ctx.lineTo(cx + o.sq, cy - o.sq); ctx.closePath(); }
  else if (r > 0) { ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, -2 * Math.PI, true); }
  ctx.fillStyle = hexA(col, o.fa ?? 0.45); ctx.fill('evenodd'); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
}

// ======================= 外圆减内孔（A263） =======================
SC.coin = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'H01', 0), m = eIO(prog(t, P('C01', 0.2), 0.8));
  ring(CX, 560, 190, 0, BRZ, a * (1 - m), { sq: 62, fa: 0.55 });
  if (m < 1) { ['乾', '隆', '通', '宝'].forEach((c, i) => { const ang = -Math.PI / 2 + i * Math.PI / 2; label(c, CX + 125 * Math.cos(ang), 560 + 125 * Math.sin(ang) + 4, 44, '#5A3A00', a * (1 - m), { bold: true }); }); }
  if (t > S('H01') + 0.4 && m < 1) richReveal([['铜 = 外圆 − 方孔', BRZ]], CX, 260, 40, t, P('H01', 0.4), { upright: true, alpha: 1 - m });
  if (m > 0) {
    ring(CX, 560, 190, 90, CYAN, m);
    if (t > S('C02')) { const c = ap(t, 'C02', 0.1); seg(CX, 560, CX + 190 * 0.707, 560 - 190 * 0.707, GOLD, c, 3); mathText('R', CX + 80, 560 - 110, 32, GOLD, { alpha: c }); seg(CX, 560, CX - 90, 560, RED, c, 3); mathText('r', CX - 52, 548, 32, RED, { alpha: c }); }
    richReveal([['垫圈：', CR], ['A = π(', CR], ['R²', GOLD], [' − ', CR], ['r²', RED], [')', CR]], CX, 260, 42, t, P('C02', 0.3), { upright: true, alpha: m });
  }
};

// ======================= 绕 x 轴（例 4） =======================
const G4 = { cx: 650, cy: 580, ux: 560, uy: 200, x0: -0.08, x1: 1.25, y0: -1.2, y1: 1.25 };
const O4 = { axis: 'x', at: 0, e: 0.32, R: x => x, r: x => x * x, t0: 0.0005, t1: 1 };
SC.ex4 = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0), th = 2 * Math.PI * eIO(prog(t, P('C03', 0.5), Math.max(1.2, D('C03') * 0.5)));
  seg(gx(G4, -0.06), gy(G4, 0), gx(G4, 1.22), gy(G4, 0), CR, a * 0.8, 2); mathText('x', gx(G4, 1.24), gy(G4, 0) + 8, 26, CR, { alpha: a });
  if (th < 0.05) gBetween(G4, x => x, x => x * x, 0, 1, a, { col: 'rgba(61,139,255,0.35)' });
  revSolid(G4, { ...O4, th: Math.max(0.0001, th), col: SQ.H.col, a, Rmax: 1, rings: 5 });
  gPlot(G4, x => x, GRN, { a, xa: 0, xb: 1.12 }); gPlot(G4, x => x * x, RED, { a, xa: 0, xb: 1.08 });
  label('y = x', gx(G4, 1.12) + 44, gy(G4, 1.12), 24, GRN, a, { bold: true }); label('y = x²', gx(G4, 1.08) + 50, gy(G4, 1.08 * 1.08) + 26, 24, RED, a, { bold: true });
  if (t > S('G01')) {
    const x = 0.62, c = ap(t, 'G01', 0.1); revSlab(G4, O4, x, 0.035, GOLD, c);
    seg(gx(G4, x) + 3, gy(G4, 0), gx(G4, x) + 3, gy(G4, x), GRN, c, 3); seg(gx(G4, x) - 3, gy(G4, 0), gx(G4, x) - 3, gy(G4, x * x), RED, c, 3);
    mathText('R = x', gx(G4, x) + 40, gy(G4, x) - 14, 24, GRN, { alpha: c }); mathText('r = x²', gx(G4, x) - 110, gy(G4, x * x / 2), 24, RED, { alpha: c });
    richReveal([['A(x) = π(', CR], ['x²', GRN], [' − ', CR], ['x⁴', RED], [')', CR]], CX, 250, 40, t, P('G01', 0.4), { upright: true, alpha: fadeOut(t, S('C04')) });
  }
  if (t > S('C04')) richReveal([['V = ', CR], ['∫', GOLD], ['₀¹ π(x² − x⁴) dx = π(1/3 − 1/5) = ', CR], ['2π/15', GOLD]], CX, 250, 36, t, P('C04', 0.15), { upright: true });
};

// ======================= 陷阱（A265） =======================
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'D01', 0), U = 88, Y = 560;
  ring(760, Y, 2 * U, U, GRN, ap(t, 'H02', 0.3));
  ring(1190, Y, U, 0, RED, a);
  label('π(R − r)²', 1190, Y + 2 * U + 50, 30, RED, a, { bold: true, font: F_MATH });
  if (t > S('H02')) { label('π(R² − r²)', 760, Y + 2 * U + 50, 30, GRN, ap(t, 'H02', 0.3), { bold: true, font: F_MATH }); label('≠', 975, Y, 70, GOLD, ap(t, 'H02', 0.5), { bold: true }); }
  if (t > S('H02')) richReveal([['差的平方 ≠ 平方的差', GOLD]], CX, 260, 40, t, P('H02', 0.4), { upright: true, alpha: fadeOut(t, S('C05')) });
  if (t > S('C05')) {
    richReveal([['R = 2，r = 1：', CR], ['3π', GRN], ['  vs  ', CR], ['π', RED]], CX, 260, 40, t, P('C05', 0.15), { upright: true });
    label('3π', 760, Y - 2 * U - 30, 32, GRN, ap(t, 'C05', 0.4), { bold: true }); label('π', 1190, Y - U - 30, 32, RED, ap(t, 'C05', 0.6), { bold: true });
    crossMark(1270, Y - 70, 22, RED, t, P('C05', 0.7));
  }
};

// ======================= 绕 y = 2（A264） =======================
const G5 = { cx: 650, cy: 720, ux: 540, uy: 92, x0: -0.08, x1: 1.25, y0: -0.2, y1: 4.2 };
const O5 = { axis: 'x', at: 2, dir: -1, e: 0.32, R: x => 2 - x * x, r: x => 2 - x, t0: 0.0005, t1: 1 };
SC.axis = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C06', 0), th = 2 * Math.PI * eIO(prog(t, P('C06', 0.6), Math.max(1.2, D('C06') * 0.4)));
  seg(gx(G5, -0.06), gy(G5, 0), gx(G5, 1.22), gy(G5, 0), CR, a * 0.6, 2);
  seg(gx(G5, -0.06), gy(G5, 2), gx(G5, 1.24), gy(G5, 2), GOLD, a, 2.5, [12, 8]); label('y = 2', gx(G5, 1.24) + 50, gy(G5, 2), 26, GOLD, a, { bold: true });
  if (th < 0.05) gBetween(G5, x => x, x => x * x, 0, 1, a, { col: 'rgba(61,139,255,0.35)' });
  revSolid(G5, { ...O5, th: Math.max(0.0001, th), col: SQ.H.col, a, Rmax: 2, rings: 5 });
  gPlot(G5, x => x, GRN, { a, xa: 0, xb: 1.1 }); gPlot(G5, x => x * x, RED, { a, xa: 0, xb: 1.05 });
  if (t > S('G02')) {
    const x = 0.55, c = ap(t, 'G02', 0.1); revSlab(G5, O5, x, 0.035, GOLD, c * 0.9);
    seg(gx(G5, x) - 4, gy(G5, 2), gx(G5, x) - 4, gy(G5, x * x), RED, c, 3.5); seg(gx(G5, x) + 4, gy(G5, 2), gx(G5, x) + 4, gy(G5, x), GRN, c, 3.5);
    mathText('R = 2 − x²', gx(G5, x) - 190, gy(G5, 1.15), 24, RED, { alpha: c }); mathText('r = 2 − x', gx(G5, x) + 26, gy(G5, 1.6), 24, GRN, { alpha: c });
    richReveal([['外：', CR], ['2 − x²', RED], ['   内：', CR], ['2 − x', GRN]], CX, 250, 40, t, P('G02', 0.35), { upright: true, alpha: fadeOut(t, S('C07')) });
  }
  if (t > S('C07')) richReveal([['V = π', CR], ['∫', GOLD], ['₀¹ [(2 − x²)² − (2 − x)²] dx = ', CR], ['8π/15', GOLD]], CX, 250, 34, t, P('C07', 0.15), { upright: true });
};

// ======================= 随堂 =======================
const GQ = { cx: 720, cy: 760, ux: 300, uy: 150, x0: -0.08, x1: 1.25, y0: -0.1, y1: 2.4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['绕 y = 2：外半径是 2 − x 还是 2 − x²？', CR]], 800, 300, 34, t, P('C09', 0.05), { upright: true });
  const ga = ap(t, 'C09', 0.3); gAxes(GQ, ga * 0.7, { grid: false });
  gBetween(GQ, x => x, x => x * x, 0, 1, ga, { col: 'rgba(61,139,255,0.30)' }); gPlot(GQ, x => x, GRN, { a: ga, xa: 0, xb: 1.1 }); gPlot(GQ, x => x * x, RED, { a: ga, xa: 0, xb: 1.05 });
  seg(gx(GQ, -0.05), gy(GQ, 2), gx(GQ, 1.2), gy(GQ, 2), GOLD, ga, 2.5, [12, 8]);
  if (t > S('D02')) { const d = ap(t, 'D02', 0.1), x = 0.5; seg(gx(GQ, x), gy(GQ, 2), gx(GQ, x), gy(GQ, x * x), RED, d, 4); richReveal([['外半径 = ', CR], ['2 − x²', RED]], 1060, 470, 42, t, P('D02', 0.4), { upright: true }); label('离轴更远的那条', 1060, 540, 28, CR, ap(t, 'D02', 0.6), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { ring(CX, 560, 170, 80, CYAN, ga); richReveal([['A = π(R² − r²)，半径从转轴量', GOLD]], CX, 260, 40, t, P('C10', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：柱壳法', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('Llama 的年轮', CX, 590, 32, SQ.L.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 6 章 · P6 垫圈法', '下一段：柱壳法', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM6('混元')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('H01', 0.05, 'marimba', 0.18); s('H01', 0.4, 'type', 0.14); s('C01', 0.2, 'warp', 0.18); s('C02', 0.1, 'pop', 0.16); s('C02', 0.3, 'ding', 0.2);
  s('C03', 0.5, 'warp', 0.2); s('G01', 0.1, 'whoosh', 0.14); s('G01', 0.4, 'type', 0.14); s('C04', 0.15, 'ding_hi', 0.24);
  s('D01', 0.05, 'pop', 0.16); s('H02', 0.3, 'slam', 0.2); s('H02', 0.5, 'buzz', 0.14); s('C05', 0.15, 'type', 0.14); s('C05', 0.7, 'buzz', 0.18);
  s('C06', 0.6, 'warp', 0.2); s('G02', 0.1, 'whoosh', 0.14); s('G02', 0.35, 'type', 0.14); s('C07', 0.15, 'ding_hi', 0.24);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'zap', 0.16); s('D02', 0.4, 'ding_hi', 0.28);
  s('C10', 0.15, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
