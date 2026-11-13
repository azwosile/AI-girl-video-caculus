// 第 10 章 P11《极坐标面积、交点与弧长》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.4。
// A467 扇形逐片扫过玫瑰一瓣（π/8） · A468 圆 r = 3 sin θ 与心形线之间的草地（π），交点与原点 · A469 交点陷阱 cos 2θ = ±1/2（8 个）与心形线弧长 8
const SC = {};
const TITLES = [['area', '扇形面积'], ['grass', '草地'], ['trap', '交点陷阱'], ['len', '弧长'], ['quiz', '随堂一题'], ['outro', '小结']];
const ros11 = q => Math.cos(2 * q), cir11 = q => 3 * Math.sin(q), car11 = q => 1 + Math.sin(q);

// ======================= 扇形面积（A467） =======================
SC.area = t => {
  starfield(t); blueprint(0.3, 80);
  const OX = 880, OY = 560, u = 280, a = ap(t, 'T01', 0); polarGrid(OX, OY, 300, 3, a * 0.7);
  polarCurve(OX, OY, u, ros11, 0, TAU, SQ.T.col, a, 4, { n: 400 });
  if (t > S('C01')) { const k = ap(t, 'C01', 0.2), n = Math.round(4 + 20 * prog(t, P('C01', 0.3), E('C01') - P('C01', 0.3)));
    sectorFan(OX, OY, u, ros11, -Math.PI / 4, Math.PI / 4, n, GOLD, k * (t > S('C02') ? 0.5 : 1));
    richReveal([['A = ∫ ½ r² dθ', GOLD]], 980, 220, 38, t, P('C01', 0.1), { upright: true }); }
  if (t > S('C02')) { polarFill(OX, OY, u, ros11, -Math.PI / 4, -Math.PI / 4 + Math.PI / 2 * prog(t, P('C02', 0.2), 1.2), hexA(GOLD, 0.45), ap(t, 'C02', 0.2));
    goldBox(1260, 780, 300, 64, '一瓣 = π/8', 30, ap(t, 'C02', 0.6)); }
};

// ======================= 草地（A468） =======================
SC.grass = t => {
  starfield(t); blueprint(0.34, 80);
  const OX = 880, OY = 720, u = 135, a = ap(t, 'C03', 0); polarGrid(OX, OY, 420, 3, a * 0.5);
  polarCurve(OX, OY, u, cir11, 0, Math.PI, CYAN, a, 4, { n: 300 }); polarCurve(OX, OY, u, car11, 0, TAU, SQ.T.col, ap(t, 'C03', 0.3), 4, { n: 300 });
  label('r = 3 sin θ', 1180, 300, 26, CYAN, a, { bold: true }); label('r = 1 + sin θ', 1180, 340, 26, SQ.T.col, ap(t, 'C03', 0.3), { bold: true });
  const q0 = Math.PI / 6, q1 = 5 * Math.PI / 6;
  if (t > S('C04')) { const k = ap(t, 'C04', 0.4); [q0, q1].forEach(q => { const [X, Y] = polXY(OX, OY, u, cir11(q), q); glowDot(X, Y, 9, GOLD, k); seg(OX, OY, X, Y, GOLD, k * 0.6, 2, [6, 6]); });
    label('π/6', OX + 250, OY - 60, 24, GOLD, k, { bold: true }); label('5π/6', OX - 250, OY - 60, 24, GOLD, k, { bold: true }); }
  if (t > S('G01')) { polarBetween(OX, OY, u, cir11, car11, q0, q0 + (q1 - q0) * prog(t, P('G01', 0.1), 1.5), hexA(GRN, 0.45), ap(t, 'G01', 0.1));
    richReveal([['A = ½∫', CR], ['(9 sin²θ − (1 + sin θ)²)', GOLD], [' dθ = ', CR], ['π', GRN]], 980, 220, 30, t, P('G01', 0.15), { upright: true }); }
  if (t > S('T02')) { const k = ap(t, 'T02', 0.2); label('MiMo 开饭！', OX, OY - 160, 30, SQ.T.col, k, { bold: true }); }
};

// ======================= 交点陷阱（A469a） =======================
SC.trap = t => {
  starfield(t); blueprint(0.34, 80);
  const sideB = t > S('D01') - 0.05, a = ap(t, 'C05', 0) * (sideB ? fadeOut(t, S('D01') - 0.05, 0.4) : 1);
  if (a > 0) { const OX = 880, OY = 560, u = 280; polarGrid(OX, OY, 300, 3, a * 0.6);
    polarCurve(OX, OY, u, ros11, 0, TAU, SQ.T.col, a, 4, { n: 400 }); polarCurve(OX, OY, u, () => 0.5, 0, TAU, CYAN, a, 3);
    richReveal([['同一个 θ 同时到达', GOLD]], 980, 220, 34, t, P('C05', 0.1), { upright: true, alpha: a });
    if (t > S('C06')) { 
      const A = [Math.PI / 6, 5 * Math.PI / 6, 7 * Math.PI / 6, 11 * Math.PI / 6], B = [Math.PI / 3, 2 * Math.PI / 3, 4 * Math.PI / 3, 5 * Math.PI / 3];
      A.forEach((q, i) => { const [X, Y] = polXY(OX, OY, u, 0.5, q); glowDot(X, Y, 9, GRN, a * ap(t, 'C06', 0.2 + 0.06 * i)); });
      B.forEach((q, i) => { const [X, Y] = polXY(OX, OY, u, 0.5, q); glowDot(X, Y, 9, RED, a * ap(t, 'C06', 0.6 + 0.06 * i)); });
      label('解出 4 个', 1260, 330, 28, GRN, a * ap(t, 'C06', 0.3), { bold: true }); label('r = −½ 再来 4 个', 1260, 380, 28, RED, a * ap(t, 'C06', 0.65), { bold: true }); }
  }
  if (sideB) { const OX = 880, OY = 720, u = 135, k = ap(t, 'D01', 0);
    polarCurve(OX, OY, u, cir11, 0, Math.PI, CYAN, k, 4, { n: 300 }); polarCurve(OX, OY, u, car11, 0, TAU, SQ.T.col, k, 4, { n: 300 });
    const z = ap(t, 'D01', 0.4); glowDot(OX, OY, 12, RED, z); ctx.save(); ctx.globalAlpha *= z; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(OX, OY, 30, 0, TAU); ctx.stroke(); ctx.restore();
    label('圆：θ = 0 到原点', 1220, 330, 26, CYAN, z, { bold: true }); label('心形线：θ = 3π/2 到原点', 1220, 370, 26, SQ.T.col, z, { bold: true });
    if (t > S('C07')) goldBox(980, 230, 420, 70, '先画图，再找交点', 34, ap(t, 'C07', 0.2)); }
};

// ======================= 弧长（A469b） =======================
SC.len = t => {
  starfield(t); blueprint(0.34, 80);
  const OX = 880, OY = 640, u = 140, a = ap(t, 'C08', 0); polarGrid(OX, OY, 300, 2, a * 0.6);
  const p = prog(t, P('C08', 0.4), E('C08') - P('C08', 0.4)), q = -Math.PI / 2 + TAU * eIO(p);
  polarCurve(OX, OY, u, car11, -Math.PI / 2, TAU - Math.PI / 2, SQ.T.col, a * 0.35, 3, { n: 300 });
  if (q > -Math.PI / 2 + 1e-3) polarCurve(OX, OY, u, car11, -Math.PI / 2, q, GOLD, a, 5, { n: 300 });
  let L = 0; const N = 200; for (let i = 0; i < N; i++) { const a0 = -Math.PI / 2 + (q + Math.PI / 2) * i / N, d = (q + Math.PI / 2) / N, m = a0 + d / 2; L += Math.sqrt(car11(m) ** 2 + Math.cos(m) ** 2) * d; }
  richReveal([['L = ∫ √(r² + (dr/dθ)²) dθ', GOLD]], 980, 220, 34, t, P('C08', 0.05), { upright: true });
  label(`L = ${L.toFixed(2)}`, 1260, 360, 32, GOLD, a, { bold: true });
  if (p >= 1) goldBox(1260, 440, 240, 60, '全长 = 8', 30, 1);
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = 2：', CR], ['A = ？', GOLD]], 880, 240, 38, t, P('C10', 0.05), { upright: true });
  const a = ap(t, 'C10', 0.2), OX = 880, OY = 570; polarCurve(OX, OY, 110, () => 2, 0, TAU, SQ.T.col, a, 4);
  if (t > S('D02')) { polarFill(OX, OY, 110, () => 2, 0, TAU * prog(t, P('D02', 0.05), 1.2), hexA(GOLD, 0.4), 1);
    richReveal([['½ ∫₀^{2π} 4 dθ = ', CR], ['4π', GOLD]], 880, 830, 32, t, P('D02', 0.3), { upright: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) {
    richReveal([['面积：', CR], ['½ ∫ r² dθ', GOLD]], CX, 320, 40, t, P('C11', 0.05), { upright: true, alpha: ga });
    richReveal([['交点：', CR], ['先画图', RED]], CX, 410, 40, t, P('C11', 0.35), { upright: true, alpha: ga });
    richReveal([['弧长：', CR], ['∫ √(r² + r′²) dθ', CYAN]], CX, 500, 40, t, P('C11', 0.6), { upright: true, alpha: ga });
  }
  if (t > S('C12') - 0.1) { glowText('下一段：圆锥曲线', CX, 520, 50, CR, t, P('C12', 0.15)); glowText('Gemini：哪里有椭圆？', CX, 610, 32, SQ.M.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 10 章 · P11 极坐标面积', '下一段：圆锥曲线', [...CREDIT_BASE, ...CREDIT_T, ...CREDIT_END, CREDIT_TM10('MiMo')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('T01', 0.1, 'pop', 0.18); s('C01', 0.1, 'ding', 0.18); s('C01', 0.3, 'swell', 0.12); s('C02', 0.2, 'swell', 0.14); s('C02', 0.6, 'ding_hi', 0.2);
  s('C03', 0.05, 'pop', 0.16); s('C03', 0.3, 'pop', 0.16); s('C04', 0.4, 'marimba', 0.14); s('G01', 0.1, 'swell', 0.14); s('G01', 0.6, 'ding', 0.2); s('T02', 0.2, 'sparkle', 0.18);
  s('C05', 0.1, 'sting', 0.16); s('C06', 0.2, 'marimba', 0.13); s('C06', 0.6, 'buzz', 0.14); s('D01', 0.4, 'impact', 0.2); s('C07', 0.2, 'stamp', 0.22);
  s('C08', 0.05, 'pop', 0.16); s('C08', 0.4, 'swell', 0.14); sfx(E('C08') + 0.05, 'ding_hi', 0.22);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'swell', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C11', 0.05, 'pop', 0.18); s('C11', 0.35, 'pop', 0.18); s('C11', 0.6, 'pop', 0.18); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
