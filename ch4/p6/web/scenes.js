// 第 4 章 P6《求导补充：参数方程与莱布尼茨公式》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A142 时间码滑块驱动圆上的点，dx/dt、dy/dt 两个速度箭头 · A143 二阶导的“错误示范”被盖章 · A144 杨辉三角与莱布尼茨系数对齐
const SC = {};
const TITLES = [['param', '参数方程求导'], ['second', '二阶导数：常见错误'], ['leib', '莱布尼茨公式'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 参数方程（A142） =======================
const O = { x: 850, y: 580, R: 230 };
function tNow(t) {   // 时间码：N01 期间转大半圈，C03 起停到 π/4
  const run = eIO(prog(t, P('N01', 0.2), D('N01') * 0.75)) * Math.PI * 1.6;
  const back = eIO(prog(t, P('C03', 0.75), 0.9));
  return lerp(run, Math.PI / 4 + 2 * Math.PI * 0, back);
}
function film(x, y, w, h, a) {   // 胶片边框
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = hexA(SQ.N.col, 0.7); ctx.lineWidth = 3; rr(x, y, w, h, 10); ctx.stroke();
  ctx.fillStyle = hexA(SQ.N.col, 0.5); for (let i = 0; i < Math.floor(w / 36); i++) { ctx.fillRect(x + 12 + i * 36, y + 8, 18, 10); ctx.fillRect(x + 12 + i * 36, y + h - 18, 18, 10); } ctx.restore();
}
SC.param = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'N01', 0);
  if (t < S('N01')) { richReveal([['x = x(t)', CYAN], ['，  ', CR], ['y = y(t)', GOLD]], CX, 480, 48, t, P('C01', 0.6), { upright: true }); return; }
  film(620, 300, 470, 560, a);
  // 坐标轴 + 圆
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(O.x - 270, O.y); ctx.lineTo(O.x + 270, O.y); ctx.moveTo(O.x, O.y + 260); ctx.lineTo(O.x, O.y - 260); ctx.stroke(); ctx.restore();
  const tt = tNow(t), px = O.x + O.R * Math.cos(tt), py = O.y - O.R * Math.sin(tt);
  ctx.save(); ctx.globalAlpha *= a; glowPath(() => { ctx.arc(O.x, O.y, O.R, 0, -tt, true); }, RED, 4.5); ctx.globalAlpha *= 0.25; glowPath(() => ctx.arc(O.x, O.y, O.R, 0, 7), RED, 2); ctx.restore();
  // 两个“演员”：x 在横轴上、y 在纵轴上
  seg(px, py, px, O.y, CYAN, a * 0.5, 2, [5, 6]); seg(px, py, O.x, py, GOLD, a * 0.5, 2, [5, 6]);
  glowDot(px, O.y, 8, CYAN, a); glowDot(O.x, py, 8, GOLD, a); glowDot(px, py, 9, CR, a);
  // 速度箭头（C02 起）
  const va = ap(t, 'C02', 0.1), vx = -Math.sin(tt), vy = Math.cos(tt), L = 120;
  if (va > 0) { arrowH(px, px + vx * L, O.y + 34, CYAN, va); arrowV(O.x - 34, py, py - vy * L, GOLD, va); label("x'(t)", px + vx * L / 2, O.y + 64, 22, CYAN, va, { font: F_MATH }); label("y'(t)", O.x - 90, py - vy * L / 2, 22, GOLD, va, { font: F_MATH }); }
  if (va > 0) { const m = vy / vx; if (Math.abs(vx) > 0.05) { const d = 150 / Math.sqrt(1 + m * m); seg(px - d, py + m * d, px + d, py - m * d, SEC, va, 3.5); } }
  // 时间码面板
  panel(1120, 300, 235, 330, SQ.N.col, a); label('时间码', 1237, 330, 22, SQ.N.col, a, { bold: true });
  const k = (tt % (2 * Math.PI)) / (2 * Math.PI); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(237,230,216,0.2)'; ctx.fillRect(1140, 362, 195, 8); ctx.fillStyle = SQ.N.col; ctx.fillRect(1140, 362, 195 * k, 8); ctx.restore(); glowDot(1140 + 195 * k, 366, 8, SQ.N.col, a);
  mathText(`t = ${tt.toFixed(2)}`, 1237, 410, 28, CR, { align: 'center', alpha: a, upright: true });
  mathText(`x' = ${vx.toFixed(2)}`, 1237, 460, 26, CYAN, { align: 'center', alpha: va, upright: true });
  mathText(`y' = ${vy.toFixed(2)}`, 1237, 505, 26, GOLD, { align: 'center', alpha: va, upright: true });
  const sl = Math.abs(vx) > 0.02 ? (vy / vx).toFixed(2) : '∞'; mathText(`dy/dx = ${sl}`, 1237, 560, 26, SEC, { align: 'center', alpha: va, upright: true });
  richReveal([['dy/dx = ', SEC], ["y'(t)", GOLD], [' / ', CR], ["x'(t)", CYAN]], 1000, 220, 34, t, P('C02', 0.3), { upright: true, out: S('C03') });
  if (t > S('C03') - 0.1) richReveal([['x = cos t', CYAN], ['，', CR], ['y = sin t', GOLD], ['  ⇒  dy/dx = −cot t', SEC]], 1000, 220, 30, t, P('C03', 0.1), { upright: true });
  if (t > S('D01')) { label('t = π/4：斜率 −1', px + 40, py - 50, 26, GOLD, ap(t, 'D01', 0.2), { bold: true, align: 'left' }); burst(t, P('D01', 0.2), px, py, GOLD, 70, 10); }
};

// ======================= 二阶导数（A143） =======================
SC.second = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G01', 0.1);
  panel(620, 240, 340, 330, RED, a); label('错误示范', 790, 275, 26, RED, a, { bold: true });
  richReveal([['d²y/dx² = ', CR], ["y''/x''", RED]], 790, 350, 30, t, P('G01', 0.3), { upright: true });
  richReveal([['= (−sin t)/(−cos t)', RED]], 790, 410, 26, t, P('G01', 0.55), { upright: true });
  richReveal([['= tan t → 1', RED]], 790, 465, 28, t, P('G01', 0.75), { upright: true });
  if (t > S('G02') - 0.1) {
    const b = ap(t, 'G02', 0); panel(990, 240, 370, 430, GRN, b); label('正确做法', 1175, 275, 26, GRN, b, { bold: true });
    richReveal([['d/dt (−cot t) = csc²t', GRN]], 1175, 345, 26, t, P('G02', 0.15), { upright: true });
    richReveal([["÷ x'(t) = ÷ (−sin t)", CYAN]], 1175, 405, 26, t, P('G02', 0.35), { upright: true });
    richReveal([['= −1/sin³t', GOLD]], 1175, 470, 30, t, P('G02', 0.5), { upright: true });
    richReveal([['t = π/4：−2√2 ≈ −2.83', GOLD]], 1175, 540, 26, t, P('G02', 0.68), { upright: true });
    richReveal([['错误做法：1', RED]], 1175, 610, 26, t, P('G02', 0.88), { upright: true });
  }
  if (t > S('N02')) { stampMark(790, 470, 70, t, P('N02', 0.15), { text: '重拍', col: COL.red }); crossMark(910, 275, 30, COL.red, t, P('N02', 0.1)); }
  if (t > P('G02', 0.5)) checkMark(1320, 470, 34, GRN, t, P('G02', 0.55));
  glowText('先对 t 求导，再除以 x′(t)', CX, 800, 32, GOLD, t, P('G02', 0.3), { out: E('N02') + 0.3 });
};

// ======================= 莱布尼茨公式（A144） =======================
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
SC.leib = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C04', 0.1);
  richReveal([['(uv)^{(n)} = Σ C(n,k) u^{(n−k)} v^{(k)}', GOLD]], CX, 210, 34, t, P('C04', 0.3), { upright: true });
  // 杨辉三角
  const ta = ap(t, 'C05', 0.1), cx0 = 790, y0 = 320;
  for (let n = 0; n <= 4; n++) for (let k = 0; k <= n; k++) {
    const p = ap(t, 'C05', 0.1 + 0.08 * n); if (p <= 0) continue; const hi = n === 3 && t > P('C05', 0.55);
    const x = cx0 + (k - n / 2) * 62, y = y0 + n * 56;
    ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = hi ? hexA(GOLD, 0.25) : 'rgba(12,18,38,0.85)'; ctx.strokeStyle = hi ? GOLD : hexA(CR, 0.4); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText(String(binom(n, k)), x, y + 9, 24, hi ? GOLD : CR, { align: 'center', alpha: p, upright: true });
  }
  if (t > P('C05', 0.5)) {
    const r = ap(t, 'C05', 0.55);
    richReveal([['(a + b)^3 = ', CR], ['1', GOLD], ['a^3 + ', CR], ['3', GOLD], ['a^2b + ', CR], ['3', GOLD], ['ab^2 + ', CR], ['1', GOLD], ['b^3', CR]], 1080, 360, 26, t, P('C05', 0.55), { upright: true });
    richReveal([["(uv)''' = ", CR], ['1', GOLD], ["u'''v + ", CR], ['3', GOLD], ["u''v' + ", CR], ['3', GOLD], ["u'v'' + ", CR], ['1', GOLD], ["uv'''", CR]], 1080, 430, 26, t, P('C05', 0.75), { upright: true });
    seg(cx0 + 120, y0 + 3 * 56, 900, 395, GOLD, r * 0.5, 2, [5, 5]);
  }
  if (t > S('N03')) slab('同一套系数', 1150, 500, 26, t, P('N03', 0.2), { bg: SQ.N.col, rot: 0.04 });
  if (t > S('C06') - 0.1) {
    const c = ap(t, 'C06', 0); panel(620, 600, 740, 300, CYAN, c);
    richReveal([['u = e^x', GOLD], ['（各阶都是 e^x）', CR], ['，  v = x^2', CYAN]], 650, 650, 26, t, P('C06', 0.1), { align: 'left', upright: true });
    const der = [['x^2', 0.35], ['2x', 0.45], ['2', 0.55], ['0', 0.65]];
    der.forEach(([s, f], i) => { const p = ap(t, 'C06', f); if (p <= 0) return; mathText(i ? `v${"'".repeat(i)} = ${s}` : `v = ${s}`, 680 + i * 170, 715, 26, i === 3 ? COL.red : CYAN, { alpha: p, upright: true }); });
    if (t > P('C06', 0.65)) crossMark(1300, 705, 24, COL.red, t, P('C06', 0.7));
    if (t > S('C07') - 0.1) {
      richReveal([['= ', CR], ['1', GOLD], ['·e^x·x^2 + ', CR], ['n', GOLD], ['·e^x·2x + ', CR], ['n(n−1)/2', GOLD], ['·e^x·2', CR]], 650, 785, 26, t, P('C07', 0.05), { align: 'left', upright: true });
      richReveal([['= e^x(x^2 + 2nx + n(n − 1))', GOLD]], 650, 855, 32, t, P('C07', 0.5), { align: 'left', upright: true });
    }
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 760, cy: 760, ux: 150, uy: 110, x0: -0.3, x1: 2.6, y0: -0.3, y1: 4.2 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 300);
  richReveal([['x = t^2', CYAN], ['，', CR], ['y = t^3', GOLD], ['，  t = 1 处 dy/dx = ?', CR]], 900, 220, 36, t, P('C09', 0.1), { upright: true });
  const a = ap(t, 'C09', 0.4); gAxes(GQ, a, { grid: false });
  gPlot(GQ, x => Math.pow(x, 1.5), RED, { a, xa: 0, xb: 2.4 });
  if (t > S('D02')) {
    const d = ap(t, 'D02', 0.6); gLine(GQ, 1.5, 1, 1, 0.2, 2, SEC, d, 4); gDot(GQ, 1, 1, GOLD, d);
    richReveal([['3t^2 / 2t = 3t/2 → 3/2', GOLD]], 900, 290, 32, t, P('D02', 0.1), { upright: true });
    if (d > 0) label('斜率 3/2', gx(GQ, 1) + 70, gy(GQ, 1) + 40, 26, GOLD, d, { bold: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; slab("参数方程：y'(t) / x'(t)", 820, 420, 30, t, P('C10', 0.2), { bg: SEC, c: COL.ink, rot: 0 }); slab('乘积 n 阶导：杨辉三角', 1120, 530, 30, t, P('C10', 0.6), { bg: GOLD, c: COL.ink, rot: 0 }); ctx.restore(); }
  if (t > S('N04')) glowText('两个演员的速度之比 → 柯西', CX, 680, 34, SQ.N.col, t, P('N04', 0.2), { out: S('C11') });
  if (t > S('C11') - 0.1) { glowText('下一段：柯西中值定理与洛必达法则', CX, 500, 50, CR, t, P('C11', 0.15)); glowText('Gemini 客串', CX, 590, 32, SQ.M.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 4 章 · P6 参数方程与莱布尼茨公式', '下一段：柯西中值定理与洛必达法则', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM4('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.6, 'type', 0.16); s('N01', 0.02, 'slap', 0.26); s('N01', 0.2, 'riser', 0.12);
  s('C02', 0.1, 'zap', 0.16); s('C02', 0.3, 'type', 0.16); s('C03', 0.1, 'type', 0.16); s('C03', 0.75, 'whoosh', 0.16); s('D01', 0.2, 'ding_hi', 0.28);
  s('G01', 0.3, 'type', 0.16); s('G01', 0.75, 'buzz', 0.18); [0.15, 0.35, 0.5, 0.68, 0.88].forEach(f => s('G02', f, 'type', 0.14)); s('G02', 0.55, 'check', 0.24);
  s('N02', 0.02, 'slap', 0.26); s('N02', 0.15, 'stamp', 0.32);
  s('C04', 0.3, 'type', 0.16); [0.1, 0.18, 0.26, 0.34, 0.42].forEach(f => s('C05', f, 'marimba', 0.18)); s('C05', 0.55, 'ding', 0.22); s('C05', 0.75, 'type', 0.16);
  s('N03', 0.2, 'pop', 0.22); s('C06', 0.1, 'type', 0.16); [0.35, 0.45, 0.55, 0.65].forEach(f => s('C06', f, 'pluck', 0.18)); s('C06', 0.7, 'buzz', 0.16);
  s('C07', 0.05, 'type', 0.16); s('C07', 0.5, 'ding_hi', 0.26);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.6, 'ding_hi', 0.3);
  s('C10', 0.2, 'pop', 0.22); s('C10', 0.6, 'pop', 0.22); s('N04', 0.2, 'shimmer', 0.18); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
