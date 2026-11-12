// 第 8 章 P3《参数方程的弧长：摆线》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济补充。
// A347 参数曲线上的动点与 ds 三角 · A348 车轮滚出摆线 · A349 8a 对 2πa
const SC = {};
const TITLES = [['param', '参数方程'], ['cyc', '摆线'], ['quiz', '随堂一题'], ['outro', '小结']];

function traceP3(fx, fy, ta, tb, col, a, w = 4, n = 160) {
  if (a <= 0 || tb <= ta) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 10;
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const s = ta + (tb - ta) * i / n; ctx[i ? 'lineTo' : 'moveTo'](fx(s), fy(s)); } ctx.stroke(); ctx.restore();
}
function wheelP3(x, y, r, ang, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.lineWidth = 2; ctx.shadowBlur = 0;
  for (let k = 0; k < 6; k++) { const q = ang + k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r * Math.cos(q), y + r * Math.sin(q)); ctx.stroke(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); ctx.restore();
}

// ======================= 参数曲线（A347） =======================
const LX3 = s => 870 + 250 * Math.sin(s), LY3 = s => 560 - 150 * Math.sin(2 * s);
SC.param = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('G01')) {
    richReveal([['x = x(t)，  ', CYAN], ['y = y(t)', CYAN]], 870, 250, 36, t, P('C01', 0.15), { upright: true });
    const a = ap(t, 'C01', 0.2), te = Math.min(2 * Math.PI, 2 * Math.PI * clamp((t - P('C01', 0.25)) / 3)), tc = t > S('C02') ? 0.85 : te;
    traceP3(LX3, LY3, 0, 2 * Math.PI, CR, a * 0.25, 2); traceP3(LX3, LY3, 0, te, CYAN, a, 4);
    glowDot(LX3(tc), LY3(tc), 9, GOLD, a); mathText(`t = ${tc.toFixed(2)}`, LX3(tc) + 18, LY3(tc) - 14, 24, GOLD, { alpha: a, upright: true });
    if (t > S('C02')) {
      const q = ap(t, 'C02', 0.3), d = 0.22, X0 = LX3(tc), Y0 = LY3(tc), X1 = LX3(tc + d), Y1 = LY3(tc + d);
      seg(X0, Y0, X1, Y0, CR, q, 2, [6, 5]); seg(X1, Y0, X1, Y1, CR, q, 2, [6, 5]); seg(X0, Y0, X1, Y1, GOLD, q, 5);
      mathText('x′dt', (X0 + X1) / 2 - 22, Y0 + 30, 22, CR, { alpha: q }); mathText('y′dt', X1 + 10, (Y0 + Y1) / 2 + 8, 22, CR, { alpha: q });
      richReveal([['ds = ', CR], ['√(x′(t)² + y′(t)²) dt', GOLD]], 870, 320, 34, t, P('C02', 0.45), { upright: true });
    }
    return;
  }
  // 圆的检验
  const a = ap(t, 'G01', 0), cx = 860, cy = 580, r = 170, te = 2 * Math.PI * clamp((t - P('G01', 0.3)) / 2.6);
  richReveal([['x = r cos t，y = r sin t  ⇒  ', CR], ['√(r²) = r', GOLD]], 870, 250, 32, t, P('G01', 0.05), { upright: true });
  ctx.save(); ctx.globalAlpha *= a * 0.3; ctx.strokeStyle = CR; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore();
  traceP3(s => cx + r * Math.cos(s), s => cy - r * Math.sin(s), 0, te, GOLD, a, 6);
  seg(cx, cy, cx + r * Math.cos(te), cy - r * Math.sin(te), CYAN, a, 2); glowDot(cx + r * Math.cos(te), cy - r * Math.sin(te), 9, GOLD, a); mathText('r', cx + 60, cy + 30, 26, CYAN, { alpha: a });
  if (te >= 2 * Math.PI - 1e-6) richReveal([['L = ∫₀^{2π} r dt = ', CR], ['2πr', GOLD]], 870, 320, 34, t, P('G01', 0.3) + 2.6, { upright: true });
};

// ======================= 摆线（A348–A349） =======================
const AW3 = 80, X03 = 580, GY3 = 790;
const CYX3 = s => X03 + AW3 * (s - Math.sin(s)), CYY3 = s => GY3 - AW3 * (1 - Math.cos(s));
SC.cyc = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'R01', 0); seg(X03 - 40, GY3, X03 + 2 * Math.PI * AW3 + 60, GY3, CR, a * 0.7, 2);
  const tr = 2 * Math.PI * clamp((t - P('R01', 0.15)) / 3.6);   // 车轮滚动参数
  wheelP3(X03 + AW3 * tr, GY3 - AW3, AW3, tr, SQ.R.col, a * (t < S('R02') ? 1 : 0.35));
  traceP3(CYX3, CYY3, 0, tr, GOLD, a, 5); glowDot(CYX3(tr), CYY3(tr), 10, GOLD, a);
  if (t > S('C03')) richReveal([['x = a(t − sin t)，  y = a(1 − cos t)', CYAN]], 870, 250, 32, t, P('C03', 0.1), { upright: true, alpha: fadeOut(t, S('R02'), 0.4) });
  if (t > S('C04') && t < S('R02') + 0.4) richReveal([['√(x′² + y′²) = a√(2 − 2cos t)', CR]], 870, 310, 30, t, P('C04', 0.1), { upright: true, alpha: fadeOut(t, S('R02'), 0.4) });
  if (t > S('C05') && t < S('R02') + 0.4) richReveal([['= 2a sin(t/2)', GOLD]], 870, 360, 30, t, P('C05', 0.2), { upright: true, alpha: fadeOut(t, S('R02'), 0.4) });
  if (t > S('G02')) goldBox(870, t < S('R02') ? 430 : 260, 420, 60, '一拱：L = 8a', 34, ap(t, 'G02', 0.4));
  if (t > S('R02')) {   // 8a 对 2πa
    const q = ap(t, 'R02', 0.1); seg(X03, GY3 + 22, X03 + 2 * Math.PI * AW3, GY3 + 22, CYAN, q, 6);
    label('车轮滚过 2πa ≈ 6.28a', X03 + Math.PI * AW3, GY3 + 56, 26, CYAN, q, { bold: true });
    label('轮缘一点走 8a', X03 + Math.PI * AW3, GY3 - 2 * AW3 - 34, 28, GOLD, ap(t, 'R02', 0.5), { bold: true });
  }
  if (t > S('C06')) { const q = ap(t, 'C06', 0.2); arrow(X03 + 1.2 * AW3, GY3 - 10, X03 + 1.2 * AW3, GY3 - 1.5 * AW3, GRN, q, 3); arrow(X03 + 2 * Math.PI * AW3 - 1.2 * AW3, GY3 - 1.5 * AW3, X03 + 2 * Math.PI * AW3 - 1.2 * AW3, GY3 - 10, GRN, q, 3); label('上下翻一个大弧', 1240, 560, 28, GRN, q, { bold: true }); }
};

// ======================= 随堂 =======================
const GQ3 = { cx: 700, cy: 780, ux: 300, uy: 300, x0: 0, x1: 1.25, y0: 0, y1: 1.2 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['x = t²，y = t³，0 ≤ t ≤ 1，', CR], ['弧长 = ？', GOLD]], 860, 260, 36, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); gAxes(GQ3, a * 0.7, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } });
  traceP3(s => gx(GQ3, s * s), s => gy(GQ3, s ** 3), 0, prog(t, P('C08', 0.35), 1), CYAN, a, 5);
  if (t > S('D02')) richReveal([['∫₀¹ t√(4 + 9t²) dt = (13√13 − 8)/27 ≈ ', CR], ['1.44', GOLD]], 860, 340, 30, t, P('D02', 0.1), { upright: true });
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['ds = ', CR], ['√(x′² + y′²) dt', GOLD]], CX, 360, 46, t, P('C09', 0.1), { upright: true, alpha: ga }); traceP3(CYX3, s => CYY3(s) - 180, 0, 2 * Math.PI, GOLD, ga * 0.6, 3); }
  if (t > S('C10') - 0.1) { glowText('下一段：极坐标下的面积', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('豆包画一颗心', CX, 610, 32, SQ.B.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P3 摆线', '下一段：极坐标面积', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM8('Mistral')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.15, 'pop', 0.18); s('C01', 0.25, 'riser', 0.12); s('C02', 0.3, 'zap', 0.14); s('C02', 0.45, 'ding', 0.18); s('G01', 0.3, 'swell', 0.14); sfx(P('G01', 0.3) + 2.6, 'ding_hi', 0.22);
  s('R01', 0.15, 'whoosh', 0.2); s('R01', 0.5, 'hum', 0.1); s('C03', 0.1, 'pop', 0.18); s('C04', 0.1, 'pop', 0.16); s('C05', 0.2, 'shimmer', 0.16); s('G02', 0.4, 'ding', 0.24);
  s('R02', 0.1, 'zap', 0.16); s('R02', 0.5, 'sparkle', 0.18); s('D01', 0.1, 'tick', 0.16); s('C06', 0.2, 'swoosh_in', 0.16);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'ding_hi', 0.28);
  s('C09', 0.1, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
