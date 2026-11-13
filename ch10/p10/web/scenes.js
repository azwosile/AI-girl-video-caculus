// 第 10 章 P10《极坐标曲线族》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.3 实验课。
// A464 r = 1 + c sin θ：c 连续调大（圆 → 凸 → 酒窝 → 心形 → 蜗线），r < 0 段标红 · A465 r = sin nθ，n = 1…6 · A466 r = 1 + c sin nθ 混搭
const SC = {};
const TITLES = [['fam', '一家人'], ['sine', '正弦一家'], ['mix', '混搭'], ['quiz', '随堂一题'], ['outro', '小结']];
const lim10 = c => q => 1 + c * Math.sin(q);
function kf10(t, K) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) return K[i - 1][1] + (K[i][1] - K[i - 1][1]) * eIO((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])); return K[K.length - 1][1]; }
function negPart10(OX, OY, u, c, col, a) { if (c <= 1 || a <= 0) return; const q0 = Math.PI + Math.asin(1 / c), q1 = TAU - Math.asin(1 / c); polarCurve(OX, OY, u, lim10(c), q0, q1, col, a, 6, { n: 120 }); }

// ======================= 一家人（A464） =======================
SC.fam = t => {
  starfield(t); blueprint(0.3, 80);
  const OX = 880, OY = 560, u = 105, a = ap(t, 'B01', 0);
  const c = kf10(t, [[S('B01'), 0.5], [P('C01', 0.1), 0.5], [P('C01', 0.5), 0], [P('C02', 0.4), 0], [P('C02', 0.9), 0.4], [P('C03', 0.6), 0.75], [P('B02', 0.3), 1], [P('C04', 0.5), 1.6]]);
  polarGrid(OX, OY, 300, 3, a * 0.7);
  polarCurve(OX, OY, u, lim10(c), 0, TAU, SQ.B.col, a, 5, { n: 400 });
  richReveal([['r = 1 + ', CR], ['c', GOLD], [' sin θ', CR]], 980, 220, 40, t, P('B01', 0.2), { upright: true });
  // 滑块
  const k = ap(t, 'C01', 0.2), x0 = 1180, x1 = 1420, y = 330, X = x0 + (x1 - x0) * c / 2;
  seg(x0, y, x1, y, CR, k * 0.6, 4); [[0, '0'], [0.5, '½'], [1, '1'], [2, '2']].forEach(([v, s]) => { const xx = x0 + (x1 - x0) * v / 2; seg(xx, y - 8, xx, y + 8, CR, k * 0.6, 2); label(s, xx, y + 32, 20, CR, k * 0.7); });
  glowDot(X, y, 10, GOLD, k); label(`c = ${c.toFixed(2)}`, 1300, y - 34, 28, GOLD, k, { bold: true });
  const name = c < 0.02 ? '圆' : c <= 0.5 ? '凸' : c < 0.98 ? '酒窝' : c < 1.02 ? '心形线' : '蜗线（内环）';
  label(name, 1300, 420, 34, SQ.B.col, k, { bold: true });
  if (t > S('G01')) { const z = ap(t, 'G01', 0.3); negPart10(OX, OY, u, c, RED, z); label('r < 0', OX, OY - 105, 26, RED, z, { bold: true }); }
};

// ======================= 正弦一家（A465） =======================
SC.sine = t => {
  starfield(t); blueprint(0.34, 80);
  richReveal([['r = sin ', CR], ['n', GOLD], ['θ', CR]], 980, 200, 38, t, P('C05', 0.05), { upright: true });
  const P10 = [1, 4, 3, 8, 5, 12];
  for (let n = 1; n <= 6; n++) { const i = n - 1, x = 700 + (i % 3) * 230, y = 390 + Math.floor(i / 3) * 250, k = ap(t, 'C05', 0.12 + 0.11 * i), p = prog(t, P('C05', 0.12 + 0.11 * i), 1.0), col = n % 2 ? GOLD : SQ.B.col;
    polarCurve(x, n === 1 ? y + 45 : y, n === 1 ? 90 : 95, q => Math.sin(n * q), 0, (n % 2 ? Math.PI : TAU) * p + 1e-3, col, k, 3.5, { n: 400 });
    label(`n = ${n}`, x, y + 118, 22, CR, k, { bold: true }); label(`${P10[i]} 瓣`, x, y + 148, 24, col, k, { bold: true }); }
  if (t > S('D01')) stampMark(1360, 420, 44, t, P('D01', 0.2), { text: '奇 n 偶 2n', col: GOLD, rot: -0.12 });
};

// ======================= 混搭（A466） =======================
SC.mix = t => {
  starfield(t); blueprint(0.34, 80);
  richReveal([['r = 1 + ', CR], ['c', GOLD], [' sin ', CR], ['n', CYAN], ['θ', CR]], 980, 200, 38, t, P('C06', 0.05), { upright: true });
  [[0.5, 3], [2, 2], [1, 4], [1.5, 5]].forEach(([c, n], i) => { const x = 720 + (i % 2) * 380, y = 400 + Math.floor(i / 2) * 270, k = ap(t, 'C06', 0.15 + 0.15 * i), p = prog(t, P('C06', 0.15 + 0.15 * i), 1.4);
    polarCurve(x, y, 42, q => 1 + c * Math.sin(n * q), 0, TAU * p + 1e-3, i % 2 ? SQ.B.col : GOLD, k, 3.5, { n: 600 });
    label(`c = ${c}, n = ${n}`, x + 150, y + 6, 24, CR, k, { bold: true, align: 'left' }); });
  if (t > S('B03')) stampMark(1360, 760, 44, t, P('B03', 0.3), { text: '再来一个？', col: SQ.B.col, rot: -0.1 });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = 1 + 2 sin θ：', CR], ['有内环吗？', GOLD]], 880, 240, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.2), OX = 880, OY = 560; polarGrid(OX, OY, 280, 3, a * 0.7);
  if (t > S('D02')) { const p = prog(t, P('D02', 0.05), 1.4); polarCurve(OX, OY, 85, lim10(2), 0, TAU * p + 1e-3, SQ.B.col, 1, 5, { n: 400 }); negPart10(OX, OY, 85, 2, RED, ap(t, 'D02', 0.5));
    label('c = 2 > 1 ⇒ 有', 1220, 760, 30, GOLD, ap(t, 'D02', 0.5), { bold: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) [0, 0.4, 0.75, 1, 1.6].forEach((c, i) => { const k = ap(t, 'C09', 0.05 + 0.1 * i) * ga, x = 600 + i * 190;
    polarCurve(x, 420, 42, lim10(c), 0, TAU, c > 1 ? RED : SQ.B.col, k, 3.5, { n: 300 }); label(`c = ${c}`, x, 545, 24, CR, k, { bold: true }); });
  if (t > S('C10') - 0.1) { glowText('下一段：极坐标面积、交点与弧长', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('MiMo 的草地', CX, 610, 32, SQ.T.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 10 章 · P10 曲线族', '下一段：极坐标面积', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM10('豆包')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('B01', 0.1, 'sparkle', 0.2); s('B01', 0.2, 'pop', 0.16); s('C01', 0.2, 'click', 0.16); s('C02', 0.4, 'warp', 0.12); s('C03', 0.3, 'warp', 0.12); s('B02', 0.2, 'ding_hi', 0.2); s('C04', 0.3, 'warp', 0.12); s('G01', 0.3, 'zap', 0.16);
  s('C05', 0.05, 'pop', 0.16); [0.12, 0.23, 0.34, 0.45, 0.56, 0.67].forEach(f => s('C05', f, 'marimba', 0.12)); s('D01', 0.2, 'stamp', 0.24);
  s('C06', 0.05, 'pop', 0.16); [0.15, 0.3, 0.45, 0.6].forEach(f => s('C06', f, 'pluck', 0.14)); s('B03', 0.3, 'stamp', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'swell', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C09', 0.05, 'pop', 0.18); s('C09', 0.25, 'pop', 0.18); s('C09', 0.45, 'pop', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
