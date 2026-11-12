// 第 8 章 P5《矩与质心：跷跷板》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.3。
// A353 跷跷板平衡 m₁d₁ = m₂d₂ · A354 数轴质点与 x̄ 指针 · A355 平面质点组的十字质心
const SC = {};
const TITLES = [['seesaw', '杠杆'], ['axis', '数轴上的质心'], ['plane', '平面'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 跷跷板（A353） =======================
SC.seesaw = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'L01', 0.1);
  // 开始失衡（右重），C01 时大肥鱼往里挪 → 平衡
  const k = prog(t, P('C01', 0.2), 1.4), d2 = lerp(300, 200, k), tq = 60 * 200 - 40 * 300;   // 左 40@300，右 60@d2
  const ang = clamp((60 * d2 - 40 * 300) / 6000, -1, 1) * 0.16 * (1 - 0.0 * k);
  seesaw(870, 620, 700, ang, [{ d: -300, m: 40, col: SQ.L.col, txt: '40' }, { d: d2, m: 60, col: SQ.D.col, txt: '60' }], a);
  if (t > S('C01')) {
    const q = ap(t, 'C01', 0.7); seg(870, 700, 570, 700, SQ.L.col, q, 3); seg(870, 700, 870 + d2, 700, SQ.D.col, q, 3);
    label('d₁ = 3', 720, 728, 26, SQ.L.col, q, { bold: true }); label('d₂ = 2', 870 + d2 / 2, 728, 26, SQ.D.col, q, { bold: true });
    richReveal([['m₁d₁ = m₂d₂', GOLD], ['   40 × 3 = 60 × 2', CR]], 870, 260, 34, t, P('C01', 0.4), { upright: true });
  }
  if (t > S('D01')) label('重的坐近一点', 870, 340, 30, CYAN, ap(t, 'D01', 0.3), { bold: true });
};

// ======================= 数轴（A354） =======================
const GA5 = { cx: 720, cy: 560, ux: 80, uy: 80, x0: -2.5, x1: 6.2, y0: -0.4, y1: 0.4 };
const MS5 = [{ x: -1, m: 4, col: CYAN }, { x: 2, m: 6, col: GRN }, { x: 5, m: 2, col: SQ.Q.col }];
SC.axis = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C02', 0.05); seg(gx(GA5, -2.4), GA5.cy, gx(GA5, 6.1), GA5.cy, CR, a, 2.5);
  for (let i = -2; i <= 6; i++) { seg(gx(GA5, i), GA5.cy - 7, gx(GA5, i), GA5.cy + 7, CR, a, 2); label(String(i), gx(GA5, i), GA5.cy + 30, 22, CR, a * 0.8); }
  if (t < S('C04')) { const k = clamp((t - P('C02', 0.3)) / 0.8); massDots(GA5, [{ x: -2, m: 3, col: CYAN }, { x: 1, m: 5, col: GRN }, { x: 4, m: 4, col: SQ.Q.col }], a, { t: k });
    if (k > 0.5) { label('m₁', gx(GA5, -2), GA5.cy - 50, 24, CYAN, a); label('m₂', gx(GA5, 1), GA5.cy - 54, 24, GRN, a); label('m₃', gx(GA5, 4), GA5.cy - 52, 24, SQ.Q.col, a); } }
  else massDots(GA5, MS5, ap(t, 'C04', 0.1), { t: clamp((t - P('C04', 0.3)) / 0.8) });
  if (t > S('C03')) richReveal([['M = Σmᵢxᵢ，  ', CR], ['x̄ = M / m', GOLD]], 870, 260, 34, t, P('C03', 0.1), { upright: true });
  if (t > S('G01')) label('按质量加权的平均位置', 870, 320, 30, CYAN, ap(t, 'G01', 0.3) * (t < S('C04') ? 1 : 0.6), { bold: true });
  if (t > S('C05')) {
    const q = ap(t, 'C05', 0.1); richReveal([['M = −4 + 12 + 10 = 18，m = 12  ⇒  ', CR], ['x̄ = 1.5', GOLD]], 870, 390, 28, t, P('C05', 0.1), { upright: true });
    const X = gx(GA5, 1.5), k = prog(t, P('C05', 0.5), 0.6);   // 支点三角从下方升起
    ctx.save(); ctx.globalAlpha *= q * k; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(X, GA5.cy + 12); ctx.lineTo(X - 22, GA5.cy + 52); ctx.lineTo(X + 22, GA5.cy + 52); ctx.closePath(); ctx.fill(); ctx.restore();
    label('x̄', X, GA5.cy + 78, 28, GOLD, q * k, { bold: true });
  }
};

// ======================= 平面（A355） =======================
const GP5 = { cx: 640, cy: 760, ux: 95, uy: 95, x0: 0, x1: 6, y0: 0, y1: 4.8 };
const MP5 = [{ x: 1, y: 1, m: 3, col: CYAN }, { x: 4, y: 1, m: 1, col: GRN }, { x: 2, y: 3, m: 2, col: SQ.Q.col }, { x: 5, y: 4, m: 2, col: SQ.L.col }];
SC.plane = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'G02', 0.05); gAxes(GP5, a * 0.8, { grid: true, ticks: { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']], y: [[1, '1'], [2, '2'], [3, '3'], [4, '4']] } });
  massDots(GP5, MP5, a, { t: clamp((t - P('G02', 0.15)) / 0.8) });
  richReveal([['x̄ = Σmᵢxᵢ / m，  ȳ = Σmᵢyᵢ / m', CR]], 870, 250, 30, t, P('G02', 0.2), { upright: true });
  const k = prog(t, P('G02', 0.55), 0.8), X = gx(GP5, 21 / 8), Y = gy(GP5, 9 / 4);
  if (k > 0) { seg(X, gy(GP5, 0), X, gy(GP5, 4.5), GOLD, a * k * 0.7, 2, [8, 6]); seg(gx(GP5, 0), Y, gx(GP5, 5.6), Y, GOLD, a * k * 0.7, 2, [8, 6]);
    glowDot(X, Y, 11, GOLD, a * k); label('(21/8, 9/4)', X + 86, Y - 28, 28, GOLD, a * k, { bold: true }); }
  if (t > S('L02')) { const q = ap(t, 'L02', 0.2); ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, Y, 26 + 6 * Math.sin(t * 5), 0, 7); ctx.stroke(); ctx.restore(); label('支点放这里，稳稳的', 1150, 330, 28, SQ.L.col, q, { bold: true }); }
};

// ======================= 随堂 =======================
const GQ5 = { cx: 640, cy: 600, ux: 85, uy: 85, x0: 0, x1: 7, y0: -0.4, y1: 0.4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['2 在 x = 1，3 在 x = 6，', CR], ['x̄ = ？', GOLD]], 860, 260, 38, t, P('C07', 0.05), { upright: true });
  const a = ap(t, 'C07', 0.3); seg(gx(GQ5, -0.3), GQ5.cy, gx(GQ5, 7), GQ5.cy, CR, a, 2.5);
  for (let i = 0; i <= 7; i++) { seg(gx(GQ5, i), GQ5.cy - 7, gx(GQ5, i), GQ5.cy + 7, CR, a, 2); label(String(i), gx(GQ5, i), GQ5.cy + 30, 22, CR, a * 0.8); }
  massDots(GQ5, [{ x: 1, m: 2, col: CYAN }, { x: 6, m: 3, col: GRN }], a);
  if (t > S('D02')) { const q = ap(t, 'D02', 0.1), X = gx(GQ5, 4); ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(X, GQ5.cy + 12); ctx.lineTo(X - 22, GQ5.cy + 52); ctx.lineTo(X + 22, GQ5.cy + 52); ctx.closePath(); ctx.fill(); ctx.restore();
    richReveal([['(2·1 + 3·6) / 5 = ', CR], ['4', GOLD]], 860, 340, 34, t, P('D02', 0.1), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['x̄ = ', CR], ['Σmᵢxᵢ / Σmᵢ', GOLD]], CX, 340, 48, t, P('C08', 0.1), { upright: true, alpha: ga }); seesaw(CX, 520, 420, 0, [{ d: -180, m: 40, col: SQ.L.col, txt: '' }, { d: 120, m: 60, col: SQ.D.col, txt: '' }], ga * 0.8); }
  if (t > S('C09') - 0.1) { glowText('下一段：平面薄片的形心', CX, 520, 50, CR, t, P('C09', 0.15)); glowText('GLM 把书顶在指尖', CX, 610, 32, SQ.Z.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 8 章 · P5 跷跷板', '下一段：形心', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM8('Llama')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('L01', 0.1, 'thud', 0.2); s('C01', 0.2, 'swoosh_in', 0.14); sfx(P('C01', 0.2) + 1.4, 'ding', 0.2); s('C01', 0.4, 'pop', 0.16); s('D01', 0.3, 'pop', 0.16);
  s('C02', 0.3, 'marimba', 0.16); s('C03', 0.1, 'pop', 0.18); s('G01', 0.3, 'shimmer', 0.14); s('C04', 0.3, 'marimba', 0.16); s('C05', 0.1, 'pop', 0.16); s('C05', 0.5, 'ding', 0.24);
  s('G02', 0.15, 'marimba', 0.16); s('G02', 0.55, 'zap', 0.14); s('L02', 0.2, 'sparkle', 0.18);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
