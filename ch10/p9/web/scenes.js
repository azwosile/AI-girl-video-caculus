// 第 10 章 P9《极坐标曲线的切线》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.3 例 9。
// A461 θ 当参数：r(θ) 转成 (x(θ), y(θ)) · A462 心形线 θ = π/3 切线与 6 处水平 / 竖直切线（尖点用极限） · A463 过极点的切线 = 射线（玫瑰线 ±π/4）
const SC = {};
const TITLES = [['rule', '斜率公式'], ['ex', '心形线'], ['pole', '过极点'], ['quiz', '随堂一题'], ['outro', '小结']];
const OX9 = 880, OY9 = 610, U9 = 150, card9 = q => 1 + Math.sin(q);
// 极坐标曲线在 θ 处的切线（像素），半长 L
function polTan(OX, OY, u, rf, q, L, col, a, o = {}) {
  if (a <= 0) return; const h = 1e-4, r = rf(q), rp = (rf(q + h) - rf(q - h)) / (2 * h);
  let dx = rp * Math.cos(q) - r * Math.sin(q), dy = rp * Math.sin(q) + r * Math.cos(q); const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
  const X = OX + r * u * Math.cos(q), Y = OY - r * u * Math.sin(q); seg(X - dx * L, Y + dy * L, X + dx * L, Y - dy * L, col, a, o.w || 4); glowDot(X, Y, 8, o.dot || GOLD, a);
}

// ======================= 斜率公式（A461） =======================
SC.rule = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'H01', 0); polarGrid(OX9, OY9, 320, 2, a * 0.8);
  polarCurve(OX9, OY9, U9, card9, 0, TAU, SQ.H.col, a * 0.8, 4, { n: 300 });
  const q = 0.6 + (t - S('H01')) * 0.35; polarSweep(OX9, OY9, U9, card9, q, q, SQ.H.col, { a, ray: true });
  polTan(OX9, OY9, U9, card9, q, 140, GRN, a * 0.8);
  if (t > S('C01')) { richReveal([['x = r(θ) cos θ，', CYAN], ['y = r(θ) sin θ', GOLD]], 980, 230, 32, t, P('C01', 0.15), { upright: true }); }
  if (t > S('C02')) goldBox(980, 860, 640, 70, 'dy/dx = (r′ sin θ + r cos θ) / (r′ cos θ − r sin θ)', 28, ap(t, 'C02', 0.1));
};

// ======================= 心形线（A462） =======================
SC.ex = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C03', 0); polarGrid(OX9, OY9, 320, 2, a * 0.8);
  polarCurve(OX9, OY9, U9, card9, 0, TAU, SQ.H.col, a, 4, { n: 300 });
  richReveal([['r = 1 + sin θ', SQ.H.col]], 980, 230, 36, t, P('C03', 0.05), { upright: true });
  const late = t > S('C04'), k1 = ap(t, 'C03', 0.4) * (late ? 0.35 : 1);
  polTan(OX9, OY9, U9, card9, Math.PI / 3, 150, GRN, k1);
  if (t > S('H02')) { label('m = −1', 1240, 330, 32, GRN, ap(t, 'H02', 0.4) * (late ? 0.4 : 1), { bold: true }); }
  if (late) [Math.PI / 2, 7 * Math.PI / 6, 11 * Math.PI / 6].forEach((q, i) => { const k = ap(t, 'C04', 0.4 + 0.12 * i), [X, Y] = polXY(OX9, OY9, U9, card9(q), q); seg(X - 60, Y, X + 60, Y, GOLD, k, 4); glowDot(X, Y, 8, GOLD, k); });
  if (late) label('水平 × 3', 1250, 400, 28, GOLD, ap(t, 'C04', 0.6), { bold: true });
  if (t > S('C05')) [Math.PI / 6, 5 * Math.PI / 6].forEach((q, i) => { const k = ap(t, 'C05', 0.4 + 0.12 * i), [X, Y] = polXY(OX9, OY9, U9, card9(q), q); seg(X, Y - 60, X, Y + 60, CYAN, k, 4); glowDot(X, Y, 8, CYAN, k); });
  if (t > S('C05')) label('竖直 × 3', 1250, 450, 28, CYAN, ap(t, 'C05', 0.6), { bold: true });
  if (t > S('G01')) { const k = ap(t, 'G01', 0.2); seg(OX9, OY9 - 70, OX9, OY9 + 70, CYAN, k, 4); glowDot(OX9, OY9, 10, RED, k); label('尖点：0/0 → 极限', OX9 + 150, OY9 + 60, 26, RED, k, { bold: true }); }
};

// ======================= 过极点（A463） =======================
SC.pole = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C06', 0), OX = 880, OY = 560, u = 270; polarGrid(OX, OY, 290, 3, a * 0.8);
  polarCurve(OX, OY, u, q => Math.cos(2 * q), 0, TAU, SQ.R.col, a, 4, { n: 400 });
  richReveal([['r = cos 2θ：r = 0 ⇒ ', CR], ['θ = ±π/4', GOLD]], 980, 230, 34, t, P('C06', 0.1), { upright: true });
  const k = ap(t, 'C06', 0.5); [Math.PI / 4, -Math.PI / 4].forEach(q => seg(OX - 300 * Math.cos(q), OY + 300 * Math.sin(q), OX + 300 * Math.cos(q), OY - 300 * Math.sin(q), GOLD, k, 3.5, [10, 7]));
  glowDot(OX, OY, 10, GOLD, k);
  if (t > S('D01')) { const z = ap(t, 'D01', 0.2); ctx.save(); ctx.globalAlpha *= z; ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(OX, OY, 60, 0, TAU); ctx.stroke(); ctx.restore(); label('放大看', OX + 90, OY - 70, 24, CR, z, { bold: true }); }
  if (t > S('C07')) label('沿两条直线交叉', 1240, 800, 28, GOLD, ap(t, 'C07', 0.2), { bold: true });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = 3：切线 ', CR], ['⊥ ？', GOLD], [' 半径', CR]], 880, 240, 38, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.2), OX = 860, OY = 590; polarCurve(OX, OY, 80, () => 3, 0, TAU, SQ.H.col, a, 4);
  const q = 0.9; seg(OX, OY, OX + 240 * Math.cos(q), OY - 240 * Math.sin(q), GOLD, a, 3);
  if (t > S('D02')) { const k = ap(t, 'D02', 0.1); polTan(OX, OY, 80, () => 3, q, 160, GRN, k);
    const X = OX + 240 * Math.cos(q), Y = OY - 240 * Math.sin(q); ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); const s = 18, c = Math.cos(q), sn = Math.sin(q);
    ctx.moveTo(X - c * s, Y + sn * s); ctx.lineTo(X - c * s - sn * s, Y + sn * s - c * s); ctx.lineTo(X - sn * s, Y - c * s); ctx.stroke(); ctx.restore();
    richReveal([['r′ = 0 ⇒ dy/dx = ', CR], ['−cot θ', GOLD]], 880, 310, 32, t, P('D02', 0.3), { upright: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) {
    richReveal([['θ 当参数：', CR], ['x = r cos θ，y = r sin θ', GOLD]], CX, 340, 42, t, P('C10', 0.05), { upright: true, alpha: ga });
    richReveal([['dy/dx = (dy/dθ) ÷ (dx/dθ)', CYAN]], CX, 440, 40, t, P('C10', 0.45), { upright: true, alpha: ga });
  }
  if (t > S('C11') - 0.1) { glowText('下一段：极坐标曲线族', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('豆包：家人们，一家子曲线！', CX, 610, 32, SQ.B.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 10 章 · P9 极坐标切线', '下一段：曲线族', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM10('混元')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('H01', 0.1, 'click', 0.2); s('H01', 0.3, 'click', 0.16); s('C01', 0.15, 'pop', 0.16); s('C02', 0.1, 'ding', 0.22);
  s('C03', 0.05, 'pop', 0.16); s('C03', 0.4, 'zap', 0.14); s('H02', 0.1, 'click', 0.18); s('H02', 0.4, 'ding_hi', 0.22);
  [0.4, 0.52, 0.64].forEach(f => s('C04', f, 'marimba', 0.13)); [0.4, 0.52].forEach(f => s('C05', f, 'marimba', 0.13)); s('G01', 0.2, 'pluck', 0.18);
  s('C06', 0.1, 'pop', 0.16); s('C06', 0.5, 'zap', 0.16); s('D01', 0.2, 'pop', 0.14); s('C07', 0.2, 'ding', 0.2);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C10', 0.05, 'pop', 0.2); s('C10', 0.45, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
