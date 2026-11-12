// 第 8 章 P4《极坐标下的面积》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济补充。
// A350 心形线与扇形微元 · A351 扇形扫满 = ½∫r²dθ、和圆比大小 · A352 三叶玫瑰算两遍的陷阱
const SC = {};
const TITLES = [['heart', '心形线'], ['trap', '区间陷阱'], ['quiz', '随堂一题'], ['outro', '小结']];

const CAR4 = q => 1 + Math.cos(q), ROSE4 = q => Math.cos(3 * q);
const PX4 = 720, PY4 = 610, U4 = 150;

// ======================= 心形线（A350–A351） =======================
SC.heart = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'B01', 0.1); polarGrid(PX4, PY4, 330, 4, a * 0.8);
  polarCurve(PX4, PY4, U4, CAR4, 0, 2 * Math.PI * prog(t, P('B01', 0.15), 1.6), SQ.B.col, a, 5);
  if (t > S('C01')) richReveal([['心形线  ', SQ.B.col], ['r = a(1 + cos θ)', CR]], 870, 250, 34, t, P('C01', 0.2), { upright: true });
  // 扇形微元
  if (t > S('C02') && t < S('G01') + 0.3) {
    const q = ap(t, 'C02', 0.3) * fadeOut(t, S('G01'), 0.3), t0 = 0.7, dq = 0.16;
    polarFill(PX4, PY4, U4, CAR4, t0, t0 + dq, 'rgba(255,200,60,0.65)', q);
    const r = CAR4(t0 + dq / 2) * U4; mathText('dθ', PX4 + 70 * Math.cos(t0 + 0.08) + 6, PY4 - 70 * Math.sin(t0 + 0.08), 22, GOLD, { alpha: q });
    mathText('r', PX4 + r * 0.55 * Math.cos(t0 + dq + 0.12), PY4 - r * 0.55 * Math.sin(t0 + dq + 0.12), 24, GOLD, { alpha: q });
    richReveal([['扇形微元  ', CR], ['dA = ½ r² dθ', GOLD]], 870, 310, 32, t, P('C02', 0.45), { upright: true });
  }
  if (t > S('G01')) {
    const sw = 2 * Math.PI * prog(t, P('G01', 0.1), 1.6); polarFill(PX4, PY4, U4, CAR4, 0, sw, 'rgba(255,200,60,0.22)', ap(t, 'G01', 0.1));
    if (t < S('C03')) richReveal([['A = ½∫ r² dθ', GOLD], ['   圆：½a²·2π = πa²', CR]], 870, 310, 30, t, P('G01', 0.2), { upright: true });
  }
  if (t > S('C03')) richReveal([['A = ½∫₀^{2π} a²(1 + cos θ)² dθ', CR]], 870, 310, 30, t, P('C03', 0.1), { upright: true });
  if (t > S('C04') && t < S('G02')) richReveal([['降幂：cos²θ = (1 + cos 2θ)/2', CYAN]], 870, 370, 28, t, P('C04', 0.2), { upright: true });
  if (t > S('G02')) {
    goldBox(870, 372, 420, 56, 'A = 3πa²/2', 32, ap(t, 'G02', 0.1));
    const q = ap(t, 'G02', 0.4); polarCurve(PX4, PY4, U4, () => 1, 0, 2 * Math.PI, CYAN, q, 3, { dash: [10, 8] });
    label('圆 πa²', PX4 - 40, PY4 + U4 + 30, 26, CYAN, q, { bold: true });
  }
  if (t > S('B02')) label('= 1.5 个圆', 1170, 600, 34, SQ.B.col, ap(t, 'B02', 0.3), { bold: true });
};

// ======================= 三叶玫瑰（A352） =======================
const RX4 = 870, RY4 = 600, RU4 = 210;
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0.1); polarGrid(RX4, RY4, 260, 3, a * 0.8);
  richReveal([['三叶玫瑰  ', SQ.B.col], ['r = cos 3θ', CR]], 870, 250, 34, t, P('C05', 0.15), { upright: true });
  const e1 = Math.PI * prog(t, P('C05', 0.3), 1.6); polarCurve(RX4, RY4, RU4, ROSE4, 0, e1, SQ.B.col, a, 5);
  if (t > S('B03')) {   // 第二遍：π 到 2π
    const e2 = Math.PI + Math.PI * prog(t, P('B03', 0.1), 1.6), q = ap(t, 'B03', 0.1);
    polarCurve(RX4, RY4, RU4, ROSE4, Math.PI, e2, RED, q, 3, { dash: [8, 6] });
    if (t < S('C06') + 0.4) richReveal([['½∫₀^{2π} cos²3θ dθ = π/2', RED]], 870, 310, 30, t, P('B03', 0.3), { upright: true, alpha: fadeOut(t, S('C06'), 0.4) });
    if (e2 > 2 * Math.PI - 0.01) stampMark(1130, 470, 44, t, P('B03', 0.1) + 1.6, { text: '×2', col: RED, rot: 0.12 });
  }
  if (t > S('C06')) {
    polarFill(RX4, RY4, RU4, ROSE4, 0, Math.PI * prog(t, P('C06', 0.15), 1.2), 'rgba(255,200,60,0.30)', ap(t, 'C06', 0.1));
    richReveal([['0 ≤ θ ≤ π 就画完  ⇒  ', CR], ['A = π/4', GOLD]], 870, 310, 30, t, P('C06', 0.55), { upright: true });
  }
};

// ======================= 随堂 =======================
const QX4 = 700, QY4 = 600, QU4 = 150;
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = 2cos θ ', CR], ['围成的面积 = ？', GOLD]], 860, 260, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); polarGrid(QX4, QY4, 330, 4, a * 0.7);
  polarCurve(QX4, QY4, QU4, q => 2 * Math.cos(q), -Math.PI / 2, -Math.PI / 2 + Math.PI * prog(t, P('C08', 0.35), 1.2), CYAN, a, 5);
  if (t > S('D01')) { const q = ap(t, 'D01', 0.1); polarFill(QX4, QY4, QU4, x => 2 * Math.cos(x), -Math.PI / 2, Math.PI / 2, 'rgba(255,200,60,0.28)', q); glowDot(QX4 + QU4, QY4, 8, GOLD, q); richReveal([['圆心 (1, 0)，半径 1  ⇒  A = ', CR], ['π', GOLD]], 860, 340, 32, t, P('D01', 0.3), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['A = ', CR], ['½∫ r² dθ', GOLD]], CX, 330, 48, t, P('C09', 0.1), { upright: true, alpha: ga }); label('区间要看图', CX, 430, 36, CYAN, ga * ap(t, 'C09', 0.6), { bold: true }); polarCurve(CX - 60, 600, 80, CAR4, 0, 2 * Math.PI, SQ.B.col, ga * 0.7, 3); }
  if (t > S('C10') - 0.1) { glowText('下一段：矩与质心', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Llama 坐跷跷板', CX, 610, 32, SQ.L.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P4 极坐标面积', '下一段：跷跷板', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM8('豆包')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('B01', 0.15, 'sparkle', 0.2); s('C01', 0.2, 'pop', 0.18); s('C02', 0.3, 'zap', 0.14); s('C02', 0.45, 'pop', 0.16); s('G01', 0.1, 'riser', 0.14); s('C03', 0.1, 'pop', 0.16); s('C04', 0.2, 'pop', 0.16); s('G02', 0.1, 'ding', 0.24); s('B02', 0.3, 'sparkle', 0.18);
  s('C05', 0.3, 'swell', 0.12); s('B03', 0.1, 'warp', 0.16); sfx(P('B03', 0.1) + 1.6, 'stamp', 0.26); s('C06', 0.15, 'shimmer', 0.16); s('C06', 0.55, 'ding', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'whoosh', 0.14); s('D01', 0.3, 'ding_hi', 0.28);
  s('C09', 0.1, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
