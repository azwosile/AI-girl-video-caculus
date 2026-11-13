// 第 10 章 P8《极坐标作图：心形线与玫瑰线》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.3 例 6–8。
// A458 旋转射线描出 r = 2cos θ（圆） · A459 θ–r 直角图与极坐标图同步“卷起来”画心形线 · A460 玫瑰线 cos 2θ（负 r 画到对面）与花瓣规律、对称
const SC = {};
const TITLES = [['sweep', '转射线'], ['heart', '心形线'], ['rose', '玫瑰线'], ['quiz', '随堂一题'], ['outro', '小结']];
const rose8 = n => q => Math.cos(n * q);

// ======================= 转射线（A458） =======================
SC.sweep = t => {
  starfield(t); blueprint(0.3, 80);
  if (t < S('C01')) { const a = ap(t, 'R01', 0.1); polarCurve(980, 540, 230, rose8(2), 0, TAU * prog(t, P('R01', 0.1), 1.6), SQ.R.col, a, 4, { n: 400 }); label('r = cos 2θ', 980, 830, 30, SQ.R.col, ap(t, 'R01', 0.5), { bold: true }); return; }
  const OX = 760, OY = 560, u = 140, a = ap(t, 'C01', 0); polarGrid(OX, OY, 320, 4, a * 0.9);
  const th = Math.PI * eIO(prog(t, P('C01', 0.3), E('C02') - P('C01', 0.3) - 0.2));
  polarSweep(OX, OY, u, q => 2 * Math.cos(q), 0, Math.max(1e-3, th), SQ.R.col, { a, w: 5 });
  label(`θ = ${(th / Math.PI).toFixed(2)}π`, 1250, 330, 28, CYAN, a, { bold: true }); label(`r = ${(2 * Math.cos(th)).toFixed(2)}`, 1250, 380, 28, GOLD, a, { bold: true });
  if (t > S('C02')) richReveal([['r = 2 cos θ', SQ.R.col]], 980, 230, 38, t, P('C02', 0.05), { upright: true });
  if (t > S('G01')) { richReveal([['r² = 2r cos θ ⇒ x² + y² = 2x ⇒ ', CR], ['(x − 1)² + y² = 1', GOLD]], 980, 860, 28, t, P('G01', 0.1), { upright: true });
    glowDot(OX + u, OY, 7, GOLD, ap(t, 'G01', 0.5)); label('圆心 (1, 0)', OX + u, OY + 34, 22, GOLD, ap(t, 'G01', 0.5), { bold: true }); }
};

// ======================= 心形线（A459） =======================
const GH8 = { cx: 610, cy: 700, ux: 52, uy: 80, x0: 0, x1: TAU + 0.3, y0: 0, y1: 2.3 };
SC.heart = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C03', 0), rf = q => 1 + Math.sin(q), th = TAU * eIO(prog(t, P('C03', 0.35), E('C03') - P('C03', 0.35) + 1.2));
  richReveal([['r = 1 + sin θ', SQ.R.col]], 980, 230, 38, t, P('C03', 0.05), { upright: true });
  gAxes(GH8, a * 0.55, { grid: false, ticks: { x: [[Math.PI / 2, 'π/2'], [Math.PI, 'π'], [1.5 * Math.PI, '3π/2'], [TAU, '2π']], y: [[1, '1'], [2, '2']] } });
  label('θ', gx(GH8, TAU + 0.3) + 16, GH8.cy, 24, CYAN, a); label('r', GH8.cx - 22, gy(GH8, 2.3), 24, GOLD, a);
  gPlot(GH8, rf, SQ.R.col, { a, xa: 0, xb: Math.max(0.01, th), w: 4 });
  const Xc = gx(GH8, th), Yc = gy(GH8, rf(th)); seg(Xc, GH8.cy, Xc, Yc, GOLD, a, 3); glowDot(Xc, Yc, 8, SQ.R.col, a);
  const OX = 1170, OY = 560, u = 130; polarGrid(OX, OY, 280, 2, a * 0.8);
  polarSweep(OX, OY, u, rf, 0, Math.max(1e-3, th), SQ.R.col, { a, w: 5 });
  arrow(1010, 470, 1060, 470, CR, a * 0.6, 3); label('卷起来', 1035, 440, 22, CR, a * 0.7, { bold: true });
  if (t > S('D01')) { const k = ap(t, 'D01', 0.1); polarFill(OX, OY, u, rf, 0, TAU, hexA(RED, 0.3), k); stampMark(1300, 760, 40, t, P('D01', 0.3), { text: '♥', col: RED, rot: -0.1 }); }
};

// ======================= 玫瑰线（A460） =======================
SC.rose = t => {
  starfield(t); blueprint(0.34, 80);
  const many = t > S('R02') - 0.05, a = ap(t, 'C04', 0) * (many ? fadeOut(t, S('R02') - 0.05, 0.4) : 1);
  if (a > 0) {
    const OX = 900, OY = 560, u = 270, th = TAU * eIO(prog(t, P('C04', 0.2), E('C04') - P('C04', 0.2) - 0.1));
    polarGrid(OX, OY, 290, 3, a * 0.8); richReveal([['r = cos 2θ', SQ.R.col]], 980, 230, 38, t, P('C04', 0.05), { upright: true, alpha: a });
    polarSweep(OX, OY, u, rose8(2), 0, Math.max(1e-3, th), SQ.R.col, { a, w: 5, n: 360 });
    if (Math.cos(2 * th) < 0) label('r < 0：画在对面', 1250, 330, 28, RED, a, { bold: true });
  }
  if (many) {
    const k = ap(t, 'R02', 0); [[2, 4], [3, 3], [4, 8], [5, 5]].forEach(([n, p], i) => { const x = 700 + i * 180, y = 470, kk = ap(t, 'R02', 0.1 + 0.15 * i);
      polarCurve(x, y, 75, rose8(n), 0, TAU, n % 2 ? GOLD : SQ.R.col, kk * k, 3, { n: 500 }); label(`cos ${n}θ`, x, y + 110, 24, CR, kk * k, { bold: true }); label(`${p} 瓣`, x, y + 145, 26, n % 2 ? GOLD : SQ.R.col, kk * k, { bold: true }); });
    richReveal([['n 奇：', GOLD], ['n 瓣', GOLD], ['    n 偶：', SQ.R.col], ['2n 瓣', SQ.R.col]], 980, 260, 34, t, P('R02', 0.6), { upright: true });
    if (t > S('C05')) { const kk = ap(t, 'C05', 0.2), x = 700, y = 470; seg(x - 110, y, x + 110, y, CYAN, kk, 3, [8, 6]); label('θ → −θ 不变：关于极轴对称', 980, 790, 28, CYAN, kk, { bold: true }); }
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = cos 3θ：', CR], ['几瓣？', GOLD]], 880, 240, 38, t, P('C07', 0.05), { upright: true });
  const a = ap(t, 'C07', 0.2); polarGrid(880, 580, 260, 3, a * 0.8);
  if (t > S('D02')) { const p = prog(t, P('D02', 0.05), 1.4); polarCurve(880, 580, 250, rose8(3), 0, Math.PI * p, GOLD, 1, 5, { n: 300 }); label('3 瓣', 1180, 760, 34, GOLD, ap(t, 'D02', 0.5), { bold: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) {
    [[q => 2 * Math.cos(q), Math.PI, '圆'], [q => 1 + Math.sin(q), TAU, '心形线'], [rose8(2), TAU, '玫瑰线']].forEach(([f, e, n], i) => { const k = ap(t, 'C08', 0.05 + 0.15 * i) * ga;
      polarCurve(720 + i * 260, 420, i === 0 ? 55 : (i === 1 ? 65 : 110), f, 0, e, SQ.R.col, k, 4, { n: 300 }); label(n, 720 + i * 260 + (i === 0 ? 55 : 0), 560, 28, CR, k, { bold: true }); });
  }
  if (t > S('C09') - 0.1) { glowText('下一段：极坐标曲线的切线', CX, 520, 50, CR, t, P('C09', 0.15)); glowText('混元按计算器', CX, 610, 32, SQ.H.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 10 章 · P8 心形与玫瑰', '下一段：极坐标切线', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM10('Mistral')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('R01', 0.1, 'shimmer', 0.2); s('R01', 0.5, 'pop', 0.16); s('C01', 0.3, 'swell', 0.14); s('C02', 0.05, 'pop', 0.16); s('G01', 0.1, 'ding', 0.2); s('G01', 0.5, 'pop', 0.14);
  s('C03', 0.05, 'pop', 0.16); s('C03', 0.35, 'swell', 0.14); s('D01', 0.1, 'sparkle', 0.2); s('D01', 0.3, 'stamp', 0.24);
  s('C04', 0.05, 'pop', 0.16); s('C04', 0.2, 'swell', 0.14); [0.1, 0.25, 0.4, 0.55].forEach(f => s('R02', f, 'marimba', 0.13)); s('R02', 0.6, 'ding', 0.2); s('C05', 0.2, 'pluck', 0.18);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'swell', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C08', 0.05, 'pop', 0.18); s('C08', 0.2, 'pop', 0.18); s('C08', 0.35, 'pop', 0.18); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
