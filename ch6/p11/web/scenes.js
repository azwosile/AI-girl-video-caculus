// 第 6 章 P11《变力做功与弹簧》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.4 例 1–3。
// A278 力–位移图下的面积就是功 · A279 弹簧伸长与力 · A280 MiMo 踩弹簧
const SC = {};
const TITLES = [['var', '变力做功'], ['spring', '胡克定律'], ['trap', '陷阱'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 变力做功（A278） =======================
const GF = { cx: 660, cy: 770, ux: 150, uy: 26, x0: -0.1, x1: 3.8, y0: -0.5, y1: 17 };
const FF = x => x * x + 2 * x;
function book(x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#B5523B'; ctx.fillRect(x - 50, y - 22, 100, 44); ctx.fillStyle = '#F2E6C9'; ctx.fillRect(x - 44, y + 14, 92, 6); ctx.restore(); }
SC.var = t => {
  starfield(t); blueprint(0.35, 80);
  const a0 = ap(t, 'C01', 0) * fadeOut(t, S('C02'));
  if (a0 > 0) {
    const h = eIO(prog(t, P('C01', 0.35), 1.2)); book(CX, 700 - 220 * h, a0); arrow(CX + 90, 700 - 220 * h + 20, CX + 90, 700 - 220 * h - 80, RED, a0); mathText('F', CX + 106, 700 - 220 * h - 40, 28, RED, { alpha: a0 });
    seg(CX - 120, 724, CX + 120, 724, CR, a0 * 0.6, 2); seg(CX - 140, 724, CX - 140, 724 - 220, CYAN, a0 * h, 2, [6, 5]); mathText('d = 0.7 m', CX - 150, 600, 24, CYAN, { align: 'right', alpha: a0 * h, upright: true });
    richReveal([['W = Fd ≈ 1.2 × 9.8 × 0.7 ≈ ', CR], ['8.2 J', GOLD]], CX, 260, 38, t, P('C01', 0.4), { upright: true, alpha: a0 });
  }
  const g = ap(t, 'C02', 0); if (g <= 0) return;
  gAxes(GF, g, { grid: false, xl: 'x' }); mathText('f(x)', gx(GF, 0) + 12, gy(GF, 16.5), 24, CR, { alpha: g });
  gPlot(GF, FF, RED, { a: g, xa: 0, xb: 3.4 });
  if (t < S('C03')) { const u = prog(t, P('C02', 0.3), D('C02') * 0.6), x = 0.8 + 2 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)); gStrip(GF, x, 0.12, FF, () => 0, GOLD, ap(t, 'C02', 0.3)); mathText('f(x)dx', gx(GF, x) + 20, gy(GF, FF(x) / 2), 24, GOLD, { alpha: ap(t, 'C02', 0.3) }); }
  if (t > S('C03')) { const xa = t > S('G01') ? 1 : 0.3, xb = t > S('G01') ? 3 : 3.2; gBetween(GF, FF, () => 0, xa, xb, ap(t, 'C03', 0.1), { col: 'rgba(255,200,60,0.30)', p: eIO(prog(t, P(t > S('G01') ? 'G01' : 'C03', 0.1), 1)) }); }
  if (t > S('C03') && t < S('G01')) richReveal([['W = ', CR], ['∫', GOLD], ['ₐᵇ f(x) dx', CR], ['  = 面积', GOLD]], CX, 260, 40, t, P('C03', 0.2), { upright: true });
  if (t > S('G01')) { richReveal([['∫', GOLD], ['₁³ (x² + 2x) dx = 18 − 4/3 = ', CR], ['50/3 J', GOLD]], CX, 260, 38, t, P('G01', 0.3), { upright: true }); [1, 3].forEach(x => mathText(String(x), gx(GF, x), gy(GF, 0) + 30, 24, CR, { align: 'center', alpha: g })); }
};

// ======================= 胡克定律（A279、A280） =======================
const WALL = 620, SY = 400, PX = 3000; // 每米像素（弹簧示意）
const GK = { cx: 700, cy: 780, ux: 5600, uy: 2.4, x0: -0.004, x1: 0.105, y0: -2, y1: 90 };
function springRig(t, ext, a, col = SQ.T.col) { // ext：伸长量（米，可负 = 压缩）
  if (a <= 0) return; const L0 = 0.10 * PX, xe = WALL + L0 + ext * PX;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(200,200,220,0.25)'; ctx.fillRect(WALL - 24, SY - 70, 24, 140); ctx.restore();
  spring(WALL, xe, SY, 11, 26, col, a, 3); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(GOLD, 0.7); ctx.fillRect(xe, SY - 34, 50, 68); ctx.restore();
  if (Math.abs(ext) > 0.002) arrow(xe + 50, SY, xe + 50 + Math.sign(ext) * (30 + Math.abs(ext) * 1600), SY, RED, a, 3);
  seg(WALL + L0, SY + 54, WALL + L0, SY + 80, CR, a * 0.7, 2, [4, 3]); mathText('自然长度', WALL + L0, SY + 104, 20, CR, { align: 'center', alpha: a * 0.8, upright: true });
}
SC.spring = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'T01', 0);
  let ext = -0.04 * (0.5 - 0.5 * Math.cos(clamp(prog(t, P('T01', 0.1), D('T01') * 0.9)) * 4 * Math.PI));
  if (t > S('C05')) ext = lerp(0, 0.05, eIO(prog(t, P('C05', 0.3), 0.8)));
  if (t > S('G02')) ext = lerp(0.05, 0.08, eIO(prog(t, P('G02', 0.3), 1.0)));
  springRig(t, ext, a);
  if (t < S('C05')) label(ext < -0.005 ? '越压越费劲！' : '', 1260, SY - 90, 28, SQ.T.col, a, { bold: true });
  if (t > S('C04')) {
    richReveal([['f(x) = ', CR], ['k', GOLD], ['x', CYAN], ['   x = 伸长量', CR]], CX, 250, 38, t, P('C04', 0.2), { upright: true, alpha: fadeOut(t, S('C05')) });
    const g = ap(t, 'C04', 0.4); gAxes(GK, g * 0.8, { grid: false }); gPlot(GK, x => 800 * x, RED, { a: g, xa: 0, xb: 0.1 });
    mathText('x（m）', gx(GK, 0.1) + 20, GK.cy + 30, 20, CR, { alpha: g, upright: true });
  }
  if (t > S('C05')) { richReveal([['40 = k × 0.05  ⇒  ', CR], ['k = 800 N/m', GOLD]], CX, 250, 38, t, P('C05', 0.4), { upright: true, alpha: fadeOut(t, S('G02')) }); glowDot(gx(GK, 0.05), gy(GK, 40), 8, GOLD, ap(t, 'C05', 0.5)); mathText('(0.05, 40)', gx(GK, 0.05) - 130, gy(GK, 40) - 6, 20, GOLD, { alpha: ap(t, 'C05', 0.5), upright: true }); }
  if (t > S('G02')) {
    gBetween(GK, x => 800 * x, () => 0, 0.05, 0.08, ap(t, 'G02', 0.4), { col: 'rgba(255,200,60,0.35)' });
    richReveal([['W = ', CR], ['∫', GOLD], ['_{0.05}^{0.08} 800x dx = ', CR], ['1.56 J', GOLD]], CX, 250, 38, t, P('G02', 0.45), { upright: true });
  }
};

// ======================= 陷阱 =======================
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'D01', 0); springRig(t, 0.08, a * 0.8);
  // 刻度尺：弹簧长度 cm
  const y = 560, x0 = WALL; seg(x0, y, x0 + 0.20 * PX, y, CR, a, 2);
  [0, 5, 10, 15, 18].forEach(c => { const x = x0 + c / 100 * PX; seg(x, y - 10, x, y + 10, CR, a, 2); mathText(`${c}`, x, y + 36, 22, c >= 15 ? RED : CR, { align: 'center', alpha: a, upright: true }); });
  mathText('长度（cm）', x0 + 0.2 * PX + 20, y + 8, 20, CR, { alpha: a, upright: true });
  if (t < S('C06')) richReveal([['∫', GOLD], ['₁₅¹⁸ 800x dx ？', RED]], CX, 260, 40, t, P('D01', 0.2), { upright: true });
  if (t > S('C06')) {
    crossMark(1115, 512, 22, RED, t, P('C06', 0.05));
    const c = ap(t, 'C06', 0.2), y2 = 660; seg(x0 + 0.10 * PX, y2, x0 + 0.20 * PX, y2, GRN, c, 2.5);
    [[10, '0'], [15, '0.05'], [18, '0.08']].forEach(([cm, s]) => { const x = x0 + cm / 100 * PX; seg(x, y2 - 10, x, y2 + 10, GRN, c, 2); mathText(s, x, y2 + 36, 22, GRN, { align: 'center', alpha: c, upright: true }); });
    mathText('伸长量（m）', x0 + 0.2 * PX + 20, y2 + 8, 20, GRN, { alpha: c, upright: true });
    richReveal([['x 从自然长度量，单位：米  ⇒  ', CR], ['∫', GOLD], ['_{0.05}^{0.08}', GRN]], CX, 260, 34, t, P('C06', 0.4), { upright: true });
  }
  if (t > S('T02')) label('从自然长度开始量！', CX, 340, 32, SQ.T.col, ap(t, 'T02', 0.15), { bold: true });
};

// ======================= 随堂 =======================
const GQ = { cx: 700, cy: 760, ux: 1800, uy: 9, x0: -0.01, x1: 0.26, y0: -1, y1: 28 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['k = 100 N/m，拉长 0.2 m：W = ？', CR]], 800, 300, 40, t, P('C08', 0.05), { upright: true });
  const ga = ap(t, 'C08', 0.3); gAxes(GQ, ga * 0.7, { grid: false }); gPlot(GQ, x => 100 * x, RED, { a: ga, xa: 0, xb: 0.24 });
  if (t > S('D02')) { gBetween(GQ, x => 100 * x, () => 0, 0, 0.2, ap(t, 'D02', 0.1), { col: 'rgba(255,200,60,0.35)' }); richReveal([['½ · 100 · 0.2²', CYAN]], 1090, 470, 36, t, P('D02', 0.2), { upright: true }); richReveal([['= ', CR], ['2 J', GOLD]], 1090, 570, 52, t, P('D02', 0.6), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { springRig(t, 0.05 + 0.02 * Math.sin(t * 3), ga); richReveal([['dW = f(x) dx  ⇒  W = ', CR], ['∫', GOLD], [' f(x) dx', GOLD]], CX, 250, 42, t, P('C09', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：拉缆绳与抽水', CX, 600, 52, CR, t, P('C10', 0.15)); glowText('Kimi × 大肥鱼的鱼缸', CX, 690, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 6 章 · P11 变力做功与弹簧', '下一段：拉缆绳与抽水', [...CREDIT_BASE, ...CREDIT_T, ...CREDIT_END, CREDIT_TM6('MiMo')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.35, 'riser', 0.16); s('C01', 0.4, 'type', 0.14); s('C02', 0.05, 'pop', 0.16); s('C02', 0.3, 'whoosh', 0.14); s('C03', 0.1, 'swell', 0.16); s('G01', 0.3, 'ding_hi', 0.24);
  [0.15, 0.4, 0.65].forEach(f => s('T01', f, 'thud', 0.16)); s('C04', 0.2, 'pop', 0.16); s('C05', 0.3, 'whoosh', 0.14); s('C05', 0.5, 'ding', 0.2); s('G02', 0.3, 'whoosh', 0.14); s('G02', 0.45, 'ding_hi', 0.24);
  s('D01', 0.2, 'pop', 0.16); s('C06', 0.05, 'buzz', 0.2); s('C06', 0.4, 'ding', 0.2); s('T02', 0.15, 'sparkle', 0.16);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.2, 'type', 0.14); s('D02', 0.6, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
