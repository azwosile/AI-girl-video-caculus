// 第 6 章 P12《拉缆绳与抽水》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.4 例 4、例 5（公制）。
// A281 缆绳分段上升 · A282 水箱分层，每层标出上升距离 · A283 每层功的柱状图
const SC = {};
const TITLES = [['cable', '拉缆绳'], ['tank', '抽水'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 拉缆绳（A281） =======================
const BX = 760, BT = 300, MPX = 4.4; // 楼顶 y、每米像素
function building(a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(120,140,180,0.22)'; ctx.fillRect(BX - 150, BT, 130, 480); ctx.strokeStyle = 'rgba(180,200,240,0.7)'; ctx.lineWidth = 2; ctx.strokeRect(BX - 150, BT, 130, 480);
  for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) { ctx.fillStyle = 'rgba(255,220,140,0.35)'; ctx.fillRect(BX - 132 + c * 58, BT + 20 + r * 50, 36, 26); }
  ctx.restore(); seg(BX - 160, BT, BX + 30, BT, CR, a, 3); glowDot(BX, BT, 9, CR, a);
}
const GW = { cx: 1000, cy: 760, ux: 3.2, uy: 1.9, x0: -3, x1: 112, y0: -5, y1: 215 };
SC.cable = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'D01', 0); building(a);
  const wind = t > S('K01') ? eIO(prog(t, P('K01', 0.1), D('K01') * 0.9)) : 0, Lc = 100 * (1 - wind);
  seg(BX, BT, BX, BT + Lc * MPX, GOLD, a, 4);
  if (Lc > 1) glowDot(BX, BT + Lc * MPX, 6, GOLD, a);
  ctx.save(); ctx.globalAlpha *= a * fadeOut(t, S('K01')); for (let k = 0; k <= 100; k += 20) { mathText(`${k} m`, BX + 20, BT + k * MPX + 7, 18, CR, { upright: true }); } ctx.restore();
  if (t > S('C02') && t < S('K01') + 0.3) {
    const u = prog(t, P('C02', 0.1), D('C02') * 0.85), x = 25 + 55 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), c = ap(t, 'C02', 0.1);
    seg(BX, BT + x * MPX - 7, BX, BT + x * MPX + 7, RED, c, 9); arrow(BX + 60, BT + x * MPX, BX + 60, BT + 4, CYAN, c, 2.5);
    mathText('抬 x 米', BX + 72, BT + x * MPX / 2, 22, CYAN, { alpha: c, upright: true }); mathText('2dx 牛', BX - 100, BT + x * MPX + 7, 22, RED, { align: 'right', alpha: c, upright: true });
    richReveal([['dW = ', CR], ['2dx', RED], [' × ', CR], ['x', CYAN]], CX, 250, 40, t, P('C02', 0.4), { upright: true });
  }
  if (t > S('C01')) { const g = ap(t, 'C01', 0.4); gAxes(GW, g * 0.7, { grid: false }); gPlot(GW, x => 2 * x, RED, { a: g, xa: 0, xb: 100, w: 3 }); mathText('2x', gx(GW, 100) + 10, gy(GW, 200), 22, RED, { alpha: g }); mathText('100', gx(GW, 100), GW.cy + 30, 20, CR, { align: 'center', alpha: g, upright: true }); }
  if (t > S('K01')) { gBetween(GW, x => 2 * x, () => 0, 0, 100, ap(t, 'K01', 0.1), { p: wind, col: 'rgba(255,200,60,0.32)' }); richReveal([['W = ', CR], ['∫', GOLD], ['₀¹⁰⁰ 2x dx = ', CR], ['10000 J', GOLD]], CX, 250, 40, t, P('K01', 0.1), { upright: true }); }
  if (t < S('C02')) richReveal([['长 100 m，每米 2 N', CR]], CX, 250, 38, t, P('C01', 0.15), { upright: true });
};

// ======================= 抽水（A282、A283） =======================
const TX = 820, TT = 330, TU = 44; // 顶 y、每米像素
const tankY = x => TT + x * TU, tankR = x => 0.4 * (10 - x) * TU;
function tank(a, wl = 2) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.moveTo(TX - tankR(wl), tankY(wl)); ctx.lineTo(TX, tankY(10)); ctx.lineTo(TX + tankR(wl), tankY(wl)); ctx.ellipse(TX, tankY(wl), tankR(wl), tankR(wl) * 0.22, 0, 0, Math.PI, false); ctx.closePath();
  ctx.fillStyle = 'rgba(92,170,232,0.35)'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.ellipse(TX, tankY(wl), tankR(wl), tankR(wl) * 0.22, 0, 0, 2 * Math.PI); ctx.strokeStyle = 'rgba(140,210,255,0.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  seg(TX - tankR(0), TT, TX, tankY(10), CR, a, 3); seg(TX + tankR(0), TT, TX, tankY(10), CR, a, 3);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.ellipse(TX, TT, tankR(0), tankR(0) * 0.22, 0, 0, 2 * Math.PI); ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
}
const LW = x => 1568 * Math.PI * x * (10 - x) ** 2; // 每米层的功（J/m）
SC.tank = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0), drain = t > S('C05') ? eIO(prog(t, P('C05', 0.1), D('C05') * 0.9)) : 0;
  tank(a, 2 + 8 * drain * 0.98);
  mathText('4 m', TX + tankR(0) / 2, TT - 22, 22, CR, { align: 'center', alpha: a, upright: true }); seg(TX + tankR(0) + 26, TT, TX + tankR(0) + 26, tankY(10), CR, a * 0.6, 1.5, [5, 4]); mathText('10 m', TX + tankR(0) + 36, (TT + tankY(10)) / 2, 22, CR, { alpha: a, upright: true });
  mathText('水深 8 m', TX - tankR(0) - 20, tankY(6), 22, CYAN, { align: 'right', alpha: a, upright: true });
  if (t > S('C04') && t < S('C05')) {
    const u = prog(t, P('C04', 0.15), D('C04') + D('K02') * 0.7), x = 3 + 5 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), c = ap(t, 'C04', 0.15), y = tankY(x), r = tankR(x);
    ctx.save(); ctx.globalAlpha *= c; ctx.beginPath(); ctx.ellipse(TX, y, r, r * 0.22, 0, 0, 2 * Math.PI); ctx.fillStyle = hexA(GOLD, 0.6); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
    seg(TX, y, TX + r, y, '#ffffff', c, 2); mathText('r', TX + r / 2, y - 8, 22, '#ffffff', { align: 'center', alpha: c });
    if (t > S('K02')) { arrow(TX - r - 40, y, TX - r - 40, TT + 4, SQ.K.col, c, 2.5); mathText('抬 x', TX - r - 52, (y + TT) / 2, 22, SQ.K.col, { align: 'right', alpha: c, upright: true }); }
    richReveal([['r = (2/5)(10 − x)，', CR], ['dV = πr²dx', GOLD]], CX, 250, 36, t, P('C04', 0.4), { upright: true, alpha: fadeOut(t, S('K02')) });
    if (t > S('K02')) richReveal([['dW = ', CR], ['9800πr²dx', GOLD], [' × ', CR], ['x', SQ.K.col]], CX, 250, 38, t, P('K02', 0.2), { upright: true, alpha: fadeOut(t, S('G01')) });
  }
  if (t > S('G01') && t < S('C05')) { const c = ap(t, 'G01', 0.1); seg(TX - tankR(0) - 30, TT, TX - tankR(0) - 30, tankY(2), RED, c, 3); mathText('空 2 m', TX - tankR(0) - 42, (TT + tankY(2)) / 2 + 8, 24, RED, { align: 'right', alpha: c, upright: true }); richReveal([['下限 = 2，不是 0', RED]], CX, 250, 38, t, P('G01', 0.2), { upright: true }); }
  // 每层功的柱状图
  if (t > S('K02')) {
    const g = ap(t, 'K02', 0.5), X0 = 1110, Y0 = 760, mx = LW(10 / 3);
    seg(X0 - 10, Y0, X0 + 270, Y0, CR, g * 0.7, 2); label('每层的功', X0 + 130, 470, 22, GOLD, g, { bold: true });
    for (let i = 0; i < 8; i++) { const x = 2.5 + i, h = 230 * LW(x) / mx, q = g * clamp(prog(t, P('K02', 0.5) + i * 0.08, 0.3)); ctx.save(); ctx.globalAlpha *= q * (1 - drain * (i < Math.floor(drain * 8.5) ? 0.75 : 0)); ctx.fillStyle = hexA(GOLD, 0.6); ctx.fillRect(X0 + i * 33, Y0 - h, 26, h); ctx.restore(); mathText(String(Math.round(x - 0.5)), X0 + i * 33 + 13, Y0 + 24, 16, CR, { align: 'center', alpha: g, upright: true }); }
    mathText('x（m）', X0 + 290, Y0 + 6, 18, CR, { alpha: g, upright: true });
  }
  if (t > S('C05')) richReveal([['W = ', CR], ['∫', GOLD], ['₂¹⁰ 1568πx(10 − x)² dx ≈ ', CR], ['3.4 × 10⁶ J', GOLD]], CX, 250, 36, t, P('C05', 0.15), { upright: true });
  if (t > S('D02')) label('三百多万焦耳！', 1240, 330, 30, SQ.D.col, ap(t, 'D02', 0.1), { bold: true });
};

// ======================= 随堂 =======================
const GQ = { cx: 960, cy: 760, ux: 3, uy: 1.7, x0: -3, x1: 112, y0: -5, y1: 215 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['上面一半缆绳（0 ≤ x ≤ 50）做的功 = ？', CR]], 800, 300, 36, t, P('C07', 0.05), { upright: true });
  const ga = ap(t, 'C07', 0.3); gAxes(GQ, ga * 0.7, { grid: false }); gPlot(GQ, x => 2 * x, RED, { a: ga, xa: 0, xb: 100, w: 3 });
  if (t > S('D03')) { gBetween(GQ, x => 2 * x, () => 0, 0, 50, ap(t, 'D03', 0.1), { col: 'rgba(255,200,60,0.40)' }); gBetween(GQ, x => 2 * x, () => 0, 50, 100, ap(t, 'D03', 0.1) * 0.6, { col: 'rgba(92,200,232,0.18)' }); richReveal([['2500 J = ', GOLD], ['1/4', GOLD]], 760, 450, 44, t, P('D03', 0.4), { upright: true }); label('上半截离楼顶近，抬得少', 760, 520, 26, CR, ap(t, 'D03', 0.65), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { tank(ga); richReveal([['W = ', CR], ['∫', GOLD], [' 每层重量 × 上升距离', GOLD]], CX, 250, 40, t, P('C08', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：液体的压力', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('MiniMax 拍大坝', CX, 590, 32, SQ.N.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 6 章 · P12 拉缆绳与抽水', '下一段：液体的压力', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM6('Kimi')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'pop', 0.16); s('C01', 0.4, 'pop', 0.16); s('C02', 0.1, 'whoosh', 0.14); s('C02', 0.4, 'type', 0.14); s('K01', 0.1, 'riser', 0.18); s('K01', 0.5, 'ding_hi', 0.24);
  s('C03', 0.1, 'pop', 0.16); s('C04', 0.15, 'whoosh', 0.14); s('C04', 0.4, 'type', 0.14); s('K02', 0.2, 'type', 0.14); s('K02', 0.5, 'marimba', 0.16); s('G01', 0.1, 'buzz', 0.16);
  s('C05', 0.1, 'riser', 0.18); s('C05', 0.6, 'ding_hi', 0.24); s('D02', 0.1, 'sting', 0.2);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.1, 'whoosh', 0.14); s('D03', 0.4, 'ding_hi', 0.28);
  s('C08', 0.15, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
