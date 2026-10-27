// 第 2 章 P5《连续与介值定理》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A60 三条件逐个点亮 · A61 间断点图鉴（四种）· A62 补点修复可去间断 · A63 介值定理水平线必穿过 · A64 二分法代码窗
const SC = {};
const TITLES = [['def', '连续：三关'], ['types', '间断点图鉴'], ['comp', '连续函数的运算'], ['ivt', '介值定理'], ['bisect', '二分法找根'], ['quiz', '随堂一题'], ['outro', '小结']];
SIDE.T.dy = t => { let y = 0; [[P('T01', 0.25), 170], [P('T02', 0.6), 90]].forEach(([t0, h]) => { const u = (t - t0) / 0.55; if (u > 0 && u < 1) y -= h * Math.sin(Math.PI * u); }); return y; };

// ======================= def：A60 =======================
const GC = { cx: 1010, cy: 800, ux: 80, uy: 60, x0: 0, x1: 4.2, y0: 0, y1: 5.4 };
const fc = x => 1 + 0.9 * x - 0.12 * x * x + 0.35 * Math.sin(2 * x);
SC.def = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C01')) { kinetic('连续 = ？', CX, 470, 72, t, P('D01', 0.3), { col: CR }); return; }
  richReveal([['lim_{x→c} f(x)', GOLD], [' = ', CR], ['f(c)', RED]], CX, 240, 48, t, P('C01', 0.05), { upright: true });
  const items = [[['① ', CR], ['f(c)', RED], [' 有定义', CR]], [['② ', CR], ['lim_{x→c} f(x)', GOLD], [' 存在', CR]], [['③ 两者相等', CR]]];
  items.forEach((r, k) => {
    const f = 0.32 + 0.2 * k, y = 400 + 110 * k;
    if (t > P('C01', f) - 0.05) { panel(630, y - 45, 350, 84, [RED, GOLD, GRN][k], ap(t, 'C01', f)); richReveal(r, 650, y + 6, 30, t, P('C01', f), { align: 'left', upright: true }); checkMark(945, y, 22, GRN, t, P('C01', f + 0.12)); }
  });
  const ga = ap(t, 'C01', 0.25);
  gAxes(GC, ga, { grid: false, ticks: { x: [[2, 'c']] } });
  const p = t < S('C02') ? 1 : prog(t, P('C02', 0.05), 0.5);
  gPlot(GC, fc, RED, { a: ga, p });
  if (t > S('C02') && p < 1) { const x = lerp(GC.x0, GC.x1, p); label('✎', gx(GC, x) + 14, gy(GC, fc(x)) - 22, 34, GOLD, 1); }
  gV(GC, 2, CYAN, 0.35 * ga * ap(t, 'C01', 0.45), { yb: fc(2), dash: [6, 6] }); gDot(GC, 2, fc(2), GOLD, ap(t, 'C01', 0.4));
  if (t > S('C02')) { label('笔不离纸', 1180, 330, 34, GOLD, ap(t, 'C02', 0.3), { bold: true }); label('左连续 · 右连续', 1180, 900, 28, CYAN, ap(t, 'C02', 0.65), { bold: true }); }
};

// ======================= types：A61 / A62 =======================
const TP = [
  { x: 640, y: 240, name: '可去间断', G: { cx: 680, cy: 520, ux: 70, uy: 55, x0: 0, x1: 4.1, y0: 0, y1: 4.6 }, f: x => 0.8 + 0.6 * x },
  { x: 1010, y: 240, name: '跳跃间断', G: { cx: 1050, cy: 520, ux: 70, uy: 55, x0: 0, x1: 4.1, y0: 0, y1: 4.6 }, f: x => Math.floor(x) + 0.5 },
  { x: 640, y: 590, name: '无穷间断', G: { cx: 805, cy: 870, ux: 70, uy: 40, x0: -1.75, x1: 2.3, y0: 0, y1: 6.4 }, f: x => 1 / Math.abs(x - 0.25) },
  { x: 1010, y: 590, name: '振荡间断', G: { cx: 1175, cy: 760, ux: 75, uy: 75, x0: -2.2, x1: 2.2, y0: -1.4, y1: 1.4 }, f: x => Math.sin(1.4 / x) },
];
SC.types = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C04')) { glowText('有一关没过 → 间断点', CX, 500, 52, GOLD, t, P('C03', 0.2)); return; }
  TP.forEach((d, k) => {
    const a = ap(t, 'C04', [0.02, 0.22, 0.48, 0.72][k]); if (a <= 0) return; const G = d.G;
    const hl = (k === 1 && t > S('T01') && t < S('D02')) ? 1 : 0;
    panel(d.x, d.y, 330, 330, hl ? SQ.T.col : CYAN, a * (0.6 + 0.4 * hl), 'rgba(12,18,38,0.6)');
    label(d.name, d.x + 165, d.y + 32, 28, hl ? SQ.T.col : CR, a, { bold: true });
    gAxes(G, a * 0.8, { grid: false });
    if (k === 0) { gPlot(G, d.f, RED, { a, w: 4 }); const fix = prog(t, P('C05', 0.75), 0.4); gDot(G, 2, d.f(2), RED, a * (1 - fix), true); gDot(G, 2, 3.8, GOLD, a * (1 - fix)); if (fix > 0) { gDot(G, 2, d.f(2), GOLD, fix); } }
    if (k === 1) {
      for (let n = 0; n < 4; n++) { gPlot(G, d.f, RED, { a, xa: n, xb: Math.min(n + 0.995, G.x1), noHead: true, w: 4 }); if (n) { gDot(G, n, n + 0.5, RED, a); gDot(G, n, n - 0.5, RED, a, true); } }
      if (t > S('T01')) { const p = prog(t, P('T01', 0.25), 0.55); ctx.save(); ctx.setLineDash([5, 7]); ctx.strokeStyle = SQ.T.col; ctx.lineWidth = 3; ctx.globalAlpha *= a; ctx.beginPath(); for (let i = 0; i <= 30 * p; i++) { const u = i / 30, x = 1.6 + 0.8 * u, y = 1.5 + u + 1.1 * Math.sin(Math.PI * u); i ? ctx.lineTo(gx(G, x), gy(G, y)) : ctx.moveTo(gx(G, x), gy(G, y)); } ctx.stroke(); ctx.restore(); }
      if (t > S('C05')) { const fa = ap(t, 'C05', 0.75); gDot(G, 2, 2, GOLD, fa); label('补点也连不上', d.x + 165, d.y + 300, 24, RED, fa, { bold: true }); }
    }
    if (k === 2) { gPlot(G, d.f, RED, { a, xb: 0.24, noHead: true, w: 4 }); gPlot(G, d.f, RED, { a, xa: 0.26, noHead: true, w: 4 }); gV(G, 0.25, GOLD, 0.6 * a, { dash: [6, 6] }); }
    if (k === 3) gPlot(G, d.f, RED, { a, n: 3000, w: 2.4 });
    if (k === 0 && t > S('C05')) label('补一个点 ✓', d.x + 165, d.y + 300, 24, GRN, ap(t, 'C05', 0.85), { bold: true });
    if (t > S('C06')) { const first = k < 2, ta = ap(t, 'C06', first ? 0.1 : 0.6); stampMark(d.x + 290, d.y + 80, 34, t, P('C06', first ? 0.1 : 0.6), { text: first ? '第一类' : '第二类', rot: -0.2, col: first ? GOLD : INV }); }
  });
  if (t > S('D02') && t < S('C06')) label('同济：第一类 / 第二类？', CX, 945 - 20, 28, CR, ap(t, 'D02', 0.2) * fadeOut(t, S('C06')), { bold: true });
};

// ======================= comp =======================
SC.comp = t => {
  starfield(t); blueprint(0.45, 80);
  const ops = ['+', '−', '×', '÷', '∘'];
  const ca = fadeOut(t, S('C08'), 0.4);
  ops.forEach((o, k) => { const p = eBack(prog(t, P('C07', 0.08 + 0.07 * k), 0.35)) * ca; if (p <= 0) return; const x = 700 + 80 * k; ctx.save(); ctx.translate(x, 380); ctx.scale(p, p); panel(-32, -32, 64, 64, CYAN, 1); ctx.restore(); label(o, x, 380, 40, CYAN, clamp(p), { font: F_MATH, bold: true }); });
  if (ca > 0) { arrowH(1110, 1190, 380, CR, ap(t, 'C07', 0.45) * ca); label('还连续', 1270, 380, 36, GRN, ap(t, 'C07', 0.5) * ca, { bold: true }); }
  const fams = ['多项式', '有理函数', '三角函数', '指数', '对数', '幂'];
  fams.forEach((s, k) => label(s, 760 + 220 * (k % 3), 520 + (k > 2 ? 70 : 0), 30, CR, ap(t, 'C07', 0.6 + 0.04 * k) * ca, { bold: true }));
  if (ca > 0 && t > P('C07', 0.8)) glowText('初等函数：定义域内处处连续', CX, 700, 40, GOLD, t, P('C07', 0.8));
  if (t > S('C08') - 0.1) {
    richReveal([['lim_{x→0} ', GOLD], ['ln', CYAN], ['(sin x / x)', RED]], CX, 330, 46, t, P('C08', 0.25), { upright: true });
    richReveal([['= ', CR], ['ln', CYAN], ['(lim_{x→0} sin x / x)', RED]], CX, 440, 46, t, P('C08', 0.45), { upright: true });
    richReveal([['= ', CR], ['ln', CYAN], [' 1 = 0', GOLD]], CX, 550, 46, t, P('C08', 0.75), { upright: true });
    label('极限穿过连续的 ln', CX, 680, 32, CYAN, ap(t, 'C08', 0.35), { bold: true });
  }
};

// ======================= ivt：A63 =======================
const GV = { cx: 680, cy: 830, ux: 150, uy: 95, x0: 0, x1: 4.3, y0: 0, y1: 5.6 };
const fv = x => 0.7 + 0.95 * x + 0.8 * Math.sin(1.7 * x);
const GY = { cx: 700, cy: 800, ux: 150, uy: 210, x0: 0, x1: 4.2, y0: -0.4, y1: 2.3 };   // 纵轴 = 年份 − 2024
const fy = x => 0.5 * x - 0.25 * Math.sin(1.9 * x);
SC.ivt = t => {
  starfield(t); blueprint(0.45, 80);
  const a1 = ap(t, 'C09', 0.05) * fadeOut(t, S('M01') + 0.2, 0.4);
  if (a1 > 0) {
    gAxes(GV, a1, { grid: false, ticks: { x: [[0.5, 'a'], [3.8, 'b']] } });
    gPlot(GV, fv, RED, { xa: 0.5, xb: 3.8, a: a1, p: prog(t, P('C09', 0.05), 0.6) });
    const lo = fv(0.5), hi = fv(3.8), N = lerp(lo + 0.2, hi - 0.2, 0.5 + 0.5 * Math.sin((t - P('C09', 0.4)) * 1.6)), na = a1 * ap(t, 'C09', 0.35);
    gH(GV, lo, CR, 0.3 * na, { dash: [4, 6] }); gH(GV, hi, CR, 0.3 * na, { dash: [4, 6] });
    if (na > 0) { gH(GV, N, GOLD, na, { w: 3 }); label('N', gx(GV, 4.15), gy(GV, N), 28, GOLD, na, { font: F_MATH });
      let x = 0.5; for (let i = 0; i < 400; i++) { const u = 0.5 + 3.3 * i / 400; if ((fv(u) - N) * (fv(0.5) - N) <= 0) { x = u; break; } } gDot(GV, x, N, GOLD, na); gV(GV, x, GOLD, 0.4 * na, { yb: N, dash: [5, 5] }); }
    if (t > P('C09', 0.6)) richReveal([['f(a) < N < f(b)  ⇒  ∃ c，f(c) = N', CR]], CX, 260, 36, t, P('C09', 0.55), { upright: true });
  }
  const a2 = ap(t, 'M01', 0.1);
  if (a2 > 0) {
    gAxes(GY, a2, { grid: false, ticks: { y: [[1, '2025'], [2, '2026']] } });
    gPlot(GY, fy, RED, { a: a2, p: t < S('G01') ? 0.03 : prog(t, P('G01', 0.15), 0.7) });
    label('Gemini：现在是 2024', gx(GY, 0.3), gy(GY, 0) + 40, 26, SQ.M.col, a2, { align: 'left', bold: true });
    const la = ap(t, 'G01', 0.55); gH(GY, 1, GOLD, la, { w: 3 });
    if (la > 0) { let x = 0; for (let i = 0; i < 400; i++) { const u = 4.2 * i / 400; if (fy(u) >= 1) { x = u; break; } } gDot(GY, x, 1, GOLD, la); label('一定经过 2025', gx(GY, x) + 20, gy(GY, 1) - 36, 30, GOLD, ap(t, 'G01', 0.7), { align: 'left', bold: true }); }
    if (t > S('M02')) stampMark(1230, 640, 54, t, P('M02', 0.3), { text: '错过一年', rot: -0.15, col: SQ.M.col });
  }
};

// ======================= bisect：A64 =======================
const fb = x => x * x * x + x - 1;
const GB = { cx: 660, cy: 640, ux: 300, uy: 150, x0: 0, x1: 1.05, y0: -1.15, y1: 1.15 };
const STEPS = [[0, 1], [0.5, 1], [0.5, 0.75], [0.625, 0.75], [0.625, 0.6875], [0.65625, 0.6875]];
SC.bisect = t => {
  starfield(t); blueprint(0.45, 80);
  const ga = ap(t, 'C10', 0.05, 0.5);
  richReveal([['f(x) = x^3 + x − 1', RED]], 820, 260, 40, t, P('C10', 0.05), { upright: true });
  gAxes(GB, ga, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1'], [-1, '−1']] } });
  gPlot(GB, fb, RED, { a: ga, xa: 0, xb: 1.05 });
  gDot(GB, 0, -1, INV, ap(t, 'C10', 0.3)); gDot(GB, 1, 1, GRN, ap(t, 'C10', 0.45));
  label('−', gx(GB, 0) + 26, gy(GB, -1), 34, INV, ap(t, 'C10', 0.3), { bold: true }); label('+', gx(GB, 1) - 26, gy(GB, 1), 34, GRN, ap(t, 'C10', 0.45), { bold: true });
  const k = t < S('C11') ? 0 : Math.min(5, Math.floor((t - P('C11', 0.2)) / ((E('C11') - P('C11', 0.2)) / 6)) + 1);
  const [lo, hi] = STEPS[Math.max(0, k)], ba = ap(t, 'C10', 0.6);
  if (ba > 0) { gBand(GB, lo, hi, GB.y0, GB.y1, hexA(CYAN, 0.14), ba); gV(GB, lo, CYAN, ba, { w: 2.5 }); gV(GB, hi, CYAN, ba, { w: 2.5 }); }
  if (t > S('C11')) codeWin(t, 1000, 300, 360, [
    [[['m = 0.5     ', CR], ['f < 0', INV]], P('C11', 0.2), 0.4],
    [[['m = 0.75    ', CR], ['f > 0', GRN]], P('C11', 0.33), 0.4],
    [[['m = 0.625   ', CR], ['f < 0', INV]], P('C11', 0.46), 0.4],
    [[['m = 0.6875  ', CR], ['f > 0', GRN]], P('C11', 0.59), 0.4],
    [[['m = 0.65625 ', CR], ['f < 0', INV]], P('C11', 0.72), 0.4],
    [[['…  10 次 → ', CR], ['0.682', GOLD]], P('C11', 0.86), 0.4],
  ], P('C11', 0.1), { title: 'bisect.py · 区间每次减半', sz: 22, lh: 42 });
  if (t > S('D03')) { const r = 0.6823; gDot(GB, r, 0, GOLD, ap(t, 'D03', 0.1)); burst(t, P('D03', 0.15), gx(GB, r), gy(GB, 0), GOLD, 70); label('x ≈ 0.682', gx(GB, r), gy(GB, 0) + 46, 30, GOLD, ap(t, 'D03', 0.2), { font: F_MATH, bold: true }); }
};

// ======================= quiz =======================
const GQ = { cx: 1000, cy: 880, ux: 50, uy: 40, x0: 0, x1: 6, y0: 0, y1: 9 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C12', 0, 0.5) * 0.45, 78);
  if (t < S('C13')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C12') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 360);
  richReveal([['(x^2 − 9)/(x − 3)', RED], ['  在 3 处补几？', CR]], CX - 60, 290, 46, t, P('C13', 0.1), { upright: true });
  if (t > S('T02')) {
    richReveal([['= x + 3  →  ', CR], ['6', GOLD]], CX - 60, 390, 46, t, P('T02', 0.15), { upright: true });
    const ga = ap(t, 'T02', 0.3); gAxes(GQ, ga, { grid: false, ticks: { x: [[3, '3']], y: [[6, '6']] } });
    gPlot(GQ, x => x + 3, RED, { a: ga, w: 4 }); const fill = prog(t, P('T02', 0.6), 0.3); gDot(GQ, 3, 6, RED, ga * (1 - fill), true); if (fill > 0) gDot(GQ, 3, 6, GOLD, fill);
    checkMark(1250, 640, 36, GRN, t, P('T02', 0.75));
  }
};

// ======================= outro =======================
const CARDS = [['连续', '三关全过', GRN], ['间断', '四种 · 两类', RED], ['介值定理', '保证有根', GOLD], ['二分法', '把根找出来', CYAN]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C15'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C14', 0.06 + 0.2 * k), 0.4)) * ca; if (p <= 0) return; const x = 680 + 200 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-90, -100, 180, 200, c, 1); ctx.restore();
    label(h, x, 495, 32, c, clamp(p), { bold: true }); label(s, x, 560, 22, CR, clamp(p));
  });
  if (t > S('C15') - 0.1) { glowText('下一段：无穷远处 · 渐近线', CX, 500, 54, CR, t, P('C15', 0.15)); glowText('x → ∞', CX, 590, 34, CYAN, t, P('C15', 0.45), { bold: false, font: F_MATH }); }
  credits(t, E('C15') + 0.38, 'AI娘微积分课 · 第 2 章 · P5 连续与介值定理', '下一段：无穷远处 · 渐近线', [...CREDIT_BASE,
    'MiMo 娘立绘：依据 甶丶 的 MiMo 拟人设定（CC BY-NC）由 AI 生成的本课差分。',
    'Gemini 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
    'MiMo、Gemini 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、Gemini、MiMo 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C15') + 0.25) lecturer(t, 'C', 255, -5, E('C15') + 0.48, { h: 710 }); };
SC.__noTag = E('C15') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C15') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.3, 'pop', 0.26); s('C01', 0.05, 'type', 0.16);
  [0.32, 0.52, 0.72].forEach((f, i) => { s('C01', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.26); s('C01', f + 0.12, 'check', 0.22); });
  s('C02', 0.05, 'swoosh_soft', 0.2); s('C02', 0.65, 'tick', 0.2);
  s('C03', 0.2, 'buzz', 0.16); [0.02, 0.22, 0.48, 0.72].forEach(f => s('C04', f, 'pop', 0.24));
  s('T01', 0.25, 'whoosh', 0.26); s('T01', 0.8, 'soft_hit', 0.26);
  s('C05', 0.75, 'ding', 0.26); s('C05', 0.85, 'check', 0.26); s('D02', 0.2, 'pluck', 0.22); s('C06', 0.1, 'stamp', 0.28); s('C06', 0.6, 'stamp', 0.28);
  [0.08, 0.15, 0.22, 0.29, 0.36].forEach(f => s('C07', f, 'tick', 0.2)); s('C07', 0.8, 'bell_soft', 0.24);
  s('C08', 0.25, 'type', 0.16); s('C08', 0.45, 'type', 0.16); s('C08', 0.75, 'ding_hi', 0.28);
  s('C09', 0.05, 'swoosh_in', 0.2); s('C09', 0.35, 'swell', 0.18); s('M01', 0.1, 'sparkle', 0.24);
  s('G01', 0.15, 'riser', 0.14); s('G01', 0.55, 'ding_hi', 0.3); s('M02', 0.3, 'stamp', 0.28);
  s('C10', 0.05, 'type', 0.16); s('C10', 0.3, 'pop', 0.22); s('C10', 0.45, 'pop', 0.22);
  [0.2, 0.33, 0.46, 0.59, 0.72, 0.86].forEach(f => s('C11', f, 'type', 0.14)); s('D03', 0.15, 'tinkle', 0.3);
  s('C12', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('T02', 0.6, 'whoosh', 0.2); s('T02', 0.75, 'check', 0.34);
  [0.06, 0.26, 0.46, 0.66].forEach(f => s('C14', f, 'pop', 0.24)); s('C15', 0.15, 'swell', 0.3);
})();
finalize();
