// 第 7 章 P11《积分表、CAS 与算不出来的积分》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.6 + §7.5 末尾。
// A323 积分表翻页 · A324 e^(−x²) 钟形曲线与“没有公式”印章 · A325 面积函数照常画出来
const SC = {};
const TITLES = [['table', '查积分表'], ['cas', 'CAS'], ['none', '算不出来的积分'], ['area', '原函数仍然存在'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 积分表翻页（A323） =======================
const TAB11 = ['17  ∫ du/(a² + u²) = (1/a) arctan(u/a) + C', '18  ∫ du/(a² − u²) = (1/2a) ln|(u+a)/(u−a)| + C', '19  ∫ du/√(a² − u²) = arcsin(u/a) + C', '20  ∫ √(a² + u²) du = …'];
SC.table = t => {
  starfield(t); blueprint(0.35, 80);
  const flip = clamp(prog(t, P('M01', 0.3), 1.2));
  // 书本 + 翻页
  const bx = 560, by = 270, bw = 640, bh = 300;
  ctx.save(); ctx.globalAlpha *= ap(t, 'M01', 0.1); ctx.fillStyle = 'rgba(240,232,214,0.10)'; ctx.strokeStyle = hexA(SQ.M.col, 0.8); ctx.lineWidth = 2.5; rr(bx, by, bw, bh, 10); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { const p = clamp(flip * 4 - i); if (p <= 0 || p >= 1) continue; const w = (bw / 2) * Math.cos(p * Math.PI); ctx.fillStyle = 'rgba(240,232,214,0.16)'; ctx.fillRect(bx + bw / 2, by + 6, w, bh - 12); }
  ctx.restore();
  label('积分表 · 1–120', bx + 90, by + 26, 20, SQ.M.col, ap(t, 'M01', 0.1), { bold: true });
  TAB11.forEach((s, k) => mathText(s, bx + 30, by + 80 + k * 54, 22, k === 0 && t > S('C01') ? GOLD : CR, { alpha: clamp(prog(t, P('M01', 0.3) + 1.2, 0.4)), upright: true }));
  if (t > S('C01')) { const a = ap(t, 'C01', 0.4); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; rr(bx + 20, by + 56, bw - 40, 40, 8); ctx.stroke(); ctx.restore(); richReveal([['∫ dx / (4 + 9x²)', CR], ['  →  对齐成  ', CR], ['a² + u²', GOLD]], 860, 640, 28, t, P('C01', 0.1), { upright: true }); }
  if (t > S('C02')) { darkBox(540, 600, 660, 160, ap(t, 'C02', 0.02)); richReveal([['u = 3x,  a = 2,  du = 3 dx', CYAN]], 860, 650, 26, t, P('C02', 0.05), { upright: true }); goldBox(860, 715, 440, 60, '(1/6) arctan(3x/2) + C', 28, ap(t, 'C02', 0.6)); }
};

// ======================= CAS =======================
SC.cas = t => {
  starfield(t); blueprint(0.35, 80);
  codeWin(t, 560, 260, 640, [[[['>>> integrate(sin(x)*cos(x), x)', CYAN]], P('G01', 0.15), 0.8], [[['−cos(x)²/2', GOLD]], P('G01', 0.55), 0.4], [[['>>> integrate(1/x, x)', CYAN]], P('C03', 0.5), 0.6], [[['log(x)', GOLD]], P('C03', 0.75), 0.3]], P('G01', 0.05), { title: 'CAS', sz: 24 });
  if (t > S('C03')) {
    richReveal([['手算：', CR], ['½ sin²x', SQ.D.col], ['  ⇔  只差常数 ', CR], ['✓', GRN]], 880, 560, 28, t, P('C03', 0.1), { upright: true });
    richReveal([['log(x)  →  应为 ', CR], ['ln|x|', RED]], 880, 640, 28, t, P('C03', 0.85), { upright: true });
  }
};

// ======================= 算不出来（A324） =======================
const GB11 = { cx: 860, cy: 640, ux: 140, uy: 260, x0: -2.6, x1: 2.6, y0: -0.05, y1: 1.15 };
SC.none = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'M02', 0.1); gPlot(GB11, x => Math.exp(-x * x), CYAN, { a, xa: -2.5, xb: 2.5, w: 4 }); seg(gx(GB11, -2.6), gy(GB11, 0), gx(GB11, 2.6), gy(GB11, 0), CR, a * 0.6, 2);
  mathText('∫ e^{−x²} dx = ？', 860, 270, 34, CR, { align: 'center', alpha: a, upright: true });
  if (t > P('M02', 0.6) && t < S('C04') + 0.3) codeWin(t, 980, 300, 300, [[[['搜索中…', SQ.M.col]], P('M02', 0.6), 0.4], [[['0 条结果', RED]], P('M02', 0.85), 0.3]], P('M02', 0.6), { sz: 22, a: fadeOut(t, S('C04'), 0.3) * ap(t, 'M02', 0.6) });
  if (t > S('C04')) {
    ['∫ e^{−x²} dx', '∫ sin x / x dx', '∫ √(1 + x³) dx'].forEach((s, k) => { mathText(s, 640 + k * 220, 350, 24, CR, { align: 'center', alpha: ap(t, 'C04', 0.05 + 0.12 * k), upright: true }); crossMark(640 + k * 220 + 90, 340, 12, RED, t, P('C04', 0.15 + 0.12 * k)); });
    stampMark(860, 500, 70, t, P('C04', 0.55), { text: '没有初等公式', col: RED, rot: -0.12 });
    label('刘维尔定理', 860, 590, 24, GOLD, ap(t, 'C04', 0.8), { bold: true });
  }
};

// ======================= 面积函数（A325） =======================
const GA11 = { cx: 620, cy: 700, ux: 160, uy: 330, x0: -0.1, x1: 3.3, y0: -0.05, y1: 1.15 };
function erfA(x) { let s = 0; const n = 60, h = x / n; for (let i = 0; i < n; i++) { const u = (i + 0.5) * h; s += Math.exp(-u * u); } return s * h; }   // ∫₀ˣ e^(−t²)dt（中点法）
SC.area = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0.05); gAxes(GA11, a * 0.7, { grid: false, xl: 'x' });
  gPlot(GA11, x => Math.exp(-x * x), hexA(CYAN, 0.8), { a, xa: 0, xb: 3.2, w: 3 });
  const xe = 0.05 + 2.95 * eIO(prog(t, P('C05', 0.3), 2.2));
  gBetween(GA11, x => Math.exp(-x * x), () => 0, 0, xe, a, { col: 'rgba(92,200,232,0.25)' });
  gPlot(GA11, erfA, GOLD, { a: a * ap(t, 'C05', 0.3), xa: 0, xb: xe, w: 4 }); glowDot(gx(GA11, xe), gy(GA11, erfA(xe)), 7, GOLD, a);
  mathText('F(x) = ∫₀ˣ e^{−t²} dt', 1060, 300, 28, GOLD, { alpha: a, upright: true });
  mathText('e^{−x²}', gx(GA11, 1.1), gy(GA11, 0.42), 22, CYAN, { alpha: a, upright: true });
  label('第 5 章 P7：变上限积分', 1180, 360, 20, CR, ap(t, 'C05', 0.6), {});
  if (t > S('G02')) { const q = ap(t, 'G02', 0.05); seg(gx(GA11, 1), gy(GA11, 0), gx(GA11, 1), gy(GA11, erfA(1)), GOLD, q, 2); goldBox(1100, 480, 320, 60, 'F(1) ≈ 0.7468', 28, ap(t, 'G02', 0.3)); label('→ 数值积分', 1100, 550, 24, SQ.H.col, ap(t, 'G02', 0.6), { bold: true }); }
  if (t > S('M03')) stampMark(1100, 640, 50, t, P('M03', 0.1), { text: '非常敏锐！', col: SQ.M.col, rot: -0.1 });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  answerCard(820, 330, 560, 'CAS', CYAN, '−½ cos²x + C', t, P('C07', 0.05));
  answerCard(820, 430, 560, '手算', SQ.D.col, '½ sin²x + C', t, P('C07', 0.4));
  label('谁错了？', 820, 520, 32, CR, ap(t, 'C07', 0.6), { bold: true });
  if (t > S('M04')) { checkMark(1060, 330, 18, GRN, t, P('M04', 0.1)); checkMark(1060, 430, 18, GRN, t, P('M04', 0.25)); richReveal([['都对：相差 ', CR], ['½', GOLD]], 820, 620, 34, t, P('M04', 0.4), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { richReveal([['查表', CR], [' → 先对齐', GOLD]], 860, 330, 42, t, P('C08', 0.05), { alpha: fa }); richReveal([['CAS', CR], [' → 要核对', CYAN]], 860, 420, 42, t, P('C08', 0.3), { alpha: fa }); richReveal([['写不出公式', CR], [' → 原函数仍在', SQ.M.col]], 860, 510, 42, t, P('C08', 0.55), { alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：梯形法则与中点法则', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('混元按计算器', CX, 610, 32, SQ.H.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P11 积分表与 CAS', '下一段：梯形与中点', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM7('Gemini')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  [0, 1, 2, 3].forEach(i => sfx(P('M01', 0.3) + i * 0.3, 'swoosh_soft', 0.14)); s('C01', 0.4, 'ding', 0.16); s('C02', 0.6, 'ding_hi', 0.24);
  s('G01', 0.15, 'type', 0.14); s('G01', 0.55, 'pop', 0.16); s('C03', 0.1, 'check', 0.2); s('C03', 0.5, 'type', 0.12); s('C03', 0.85, 'buzz', 0.14);
  s('M02', 0.6, 'type', 0.12); s('M02', 0.85, 'buzz', 0.18); [0, 1, 2].forEach(k => s('C04', 0.15 + 0.12 * k, 'pop', 0.14)); s('C04', 0.55, 'stamp', 0.28);
  s('C05', 0.3, 'swell', 0.16); s('G02', 0.3, 'ding', 0.2); s('M03', 0.1, 'stamp', 0.22);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('M04', 0.1, 'check', 0.22); s('M04', 0.25, 'check', 0.22); s('M04', 0.4, 'ding_hi', 0.26);
  s('C08', 0.05, 'pop', 0.2); s('C08', 0.3, 'pop', 0.2); s('C08', 0.55, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
