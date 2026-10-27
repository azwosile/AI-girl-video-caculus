// 第 2 章 P2《极限是什么》（2026-10-27）：数学画面全部原创 Canvas 绘制；公用小件见 scenes0_kit.js（ch2/shared/c2kit.js）。
// A46 双向探针 · A47 挖洞 / 换点 / 正常三函数 · A48 左右极限（阶跃）· A49 sin(π/x) 振荡放大 · A50 打表陷阱代码窗
const SC = {};
const TITLES = [['intro', '直观定义'], ['hole', '不看那一点'], ['side', '左极限与右极限'], ['dne', '极限不存在的三种样子'], ['table', '打表陷阱'], ['quiz', '随堂一题'], ['outro', '小结']];
const sq = x => x * x;

// ======================= intro：A46 双向探针 =======================
const GI = { cx: 680, cy: 860, ux: 200, uy: 62, x0: 0, x1: 3.2, y0: 0, y1: 9.6 };
const xL = t => kf(t, 1.0, [[P('C02', 0.12), 1.6, 0.5], [P('C02', 0.32), 1.9, 0.45], [P('C02', 0.5), 1.99, 0.4], [P('C02', 0.66), 1.999, 0.4]]);
const xR = t => kf(t, 3.0, [[P('C02', 0.12), 2.4, 0.5], [P('C02', 0.32), 2.1, 0.45], [P('C02', 0.5), 2.01, 0.4], [P('C02', 0.66), 2.001, 0.4]]);
function probe(G, x, f, col, a) {
  if (a <= 0) return; const y = f(x);
  seg(gx(G, x), gy(G, 0), gx(G, x), gy(G, y), col, 0.6 * a, 2, [5, 6]); seg(gx(G, x), gy(G, y), gx(G, 0), gy(G, y), GOLD, 0.5 * a, 2, [5, 6]);
  glowDot(gx(G, x), gy(G, 0), 8, col, a); glowDot(gx(G, x), gy(G, y), 8, col, a); glowDot(gx(G, 0), gy(G, y), 7, GOLD, a);
}
SC.intro = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C01')) { kinetic('极限', CX - 60, 420, 120, t, P('D01', 0.1), { col: GOLD }); kinetic('是什么？', CX + 150, 450, 60, t, P('D01', 0.35), { col: CR }); return; }
  const ga = ap(t, 'C01', 0, 0.5);
  gAxes(GI, ga, { ticks: { x: [[1, '1'], [2, '2'], [3, '3']], y: [[4, '4'], [9, '9']] } });
  gPlot(GI, sq, RED, { p: prog(t, P('C01', 0.05), 0.9), a: ga });
  mathText('y = x^2', gx(GI, 2.85), gy(GI, 8.4) + 10, 34, RED, { align: 'right', glow: 10, alpha: ga * ap(t, 'C01', 0.3) });
  const ta = ap(t, 'C01', 0.4);
  gV(GI, 2, CYAN, 0.35 * ta, { yb: 4, dash: [6, 6] }); gH(GI, 4, GOLD, 0.35 * ta, { xb: 2, dash: [6, 6] }); gDot(GI, 2, 4, GOLD, ta, true);
  richReveal([['lim_{x→2} ', GOLD], ['x^2', RED], [' = ', CR], ['4', GOLD]], CX, 222, 50, t, P('C01', 0.55), { out: P('C02', 0.84), upright: true });
  richReveal([['lim_{x→a} ', GOLD], ['f(x)', RED], [' = ', CR], ['L', GOLD]], CX, 222, 50, t, P('C02', 0.88), { upright: true });
  const pa = ap(t, 'C02', 0.05);
  probe(GI, xL(t), sq, CYAN, pa); probe(GI, xR(t), sq, GRN, pa);
  if (pa > 0) {
    panel(720, 300, 300, 110, CYAN, pa);
    label('左', 750, 330, 24, CYAN, pa); label('右', 750, 380, 24, GRN, pa);
    mathText(`x = ${xL(t).toFixed(3)}  →  ${sq(xL(t)).toFixed(3)}`, 775, 340, 26, CR, { alpha: pa, upright: true });
    mathText(`x = ${xR(t).toFixed(3)}  →  ${sq(xR(t)).toFixed(3)}`, 775, 390, 26, CR, { alpha: pa, upright: true });
  }
};

// ======================= hole：A47 只看过程，不看那一点 =======================
const HP = [720, 980, 1240].map(c => ({ cx: c - 110, cy: 700, ux: 60, uy: 36, x0: 0, x1: 3.6, y0: 0, y1: 6.2 }));
const HL = [['(x^2 − 4)/(x − 2)', '2 处没有定义'], ['g(2) = 1', '2 处另外定义'], ['x + 2', '2 处正常']];
SC.hole = t => {
  starfield(t); blueprint(0.45, 80);
  // C03：数轴上，2 被遮住
  const na = ap(t, 'C03', 0.05) * fadeOut(t, S('C04') + 0.1);
  if (na > 0) {
    const y = 560; seg(660, y, 1300, y, CR, 0.6 * na, 2.5);
    label('2', CX, y + 40, 32, CYAN, na, { font: F_MATH });
    const d = 300 * Math.pow(0.5, Math.max(0, (t - P('C03', 0.2)) / 0.45));
    glowDot(CX - d, y, 9, CYAN, na); glowDot(CX + d, y, 9, GRN, na);
    ctx.save(); ctx.globalAlpha *= na * ap(t, 'C03', 0.55); ctx.setLineDash([6, 6]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, y, 26, 0, 7); ctx.stroke(); ctx.restore();
    label('不看这一点', CX, y - 70, 34, RED, na * ap(t, 'C03', 0.6), { bold: true });
    glowText('只看靠近的过程', CX, 380, 40, GOLD, t, P('C03', 0.3), { out: S('C04') });
  }
  // C04：三个函数
  HP.forEach((G, k) => {
    const a = ap(t, 'C04', 0.08 + 0.17 * k, 0.4); if (a <= 0) return;
    gAxes(G, a, { grid: false, ticks: { x: [[2, '2']], y: [[4, '4']] } });
    gPlot(G, x => x + 2, RED, { a, w: 4 });
    if (k < 2) gDot(G, 2, 4, RED, a, true); else gDot(G, 2, 4, RED, a);
    if (k === 1) gDot(G, 2, 1, GOLD, a);
    mathText(HL[k][0], G.cx + 110, 752, 26, RED, { align: 'center', glow: 8, alpha: a, upright: true });
    label(HL[k][1], G.cx + 110, 796, 24, CR, a);
    const pa = ap(t, 'C04', 0.72); if (pa > 0) { const d = 1.2 * Math.pow(0.5, Math.max(0, (t - P('C04', 0.72)) / 0.4)); [2 - d, 2 + d].forEach((x, i) => gDot(G, x, x + 2, i ? GRN : CYAN, pa)); }
    label('极限 = 4', G.cx + 110, 450, 28, GOLD, ap(t, 'C04', 0.85), { bold: true });
  });
  if (t > S('D02')) { label('挖掉？', HP[0].cx + 160, 560, 28, CYAN, ap(t, 'D02', 0.2), { bold: true }); label('换掉？', HP[1].cx + 160, 600, 28, CYAN, ap(t, 'D02', 0.45), { bold: true }); }
  if (t > S('C05')) kinetic('去哪儿 ≠ 在哪儿', CX, 330, 54, t, P('C05', 0.3), { col: GOLD });
};

// ======================= side：A48 左右极限（阶跃函数） =======================
const GS = { cx: 980, cy: 760, ux: 120, uy: 220, x0: -2.6, x1: 2.6, y0: -0.3, y1: 1.4 };
SC.side = t => {
  starfield(t); blueprint(0.45, 80);
  const ga = ap(t, 'C06', 0, 0.5);
  gAxes(GS, ga, { grid: false, ticks: { x: [[-2, '−2'], [2, '2']], y: [[1, '1']] } });
  gPlot(GS, x => 0, RED, { xa: GS.x0, xb: -0.02, a: ga, noHead: true }); gPlot(GS, x => 1, RED, { xa: 0, xb: GS.x1, a: ga, noHead: true });
  gDot(GS, 0, 0, RED, ga, true); gDot(GS, 0, 1, RED, ga);
  label('阶跃函数 H(x)', gx(GS, 1.4), gy(GS, 1) - 40, 28, RED, ga, { bold: true });
  const d = 2.2 * Math.pow(0.5, Math.max(0, (t - P('C06', 0.15)) / 0.5)), la = ap(t, 'C06', 0.1), ra = ap(t, 'C06', 0.55);
  gDot(GS, -d, 0, CYAN, la); arrowH(gx(GS, -d) - 60, gx(GS, -d) - 16, gy(GS, 0) - 30, CYAN, la, 3);
  label('左极限', gx(GS, -1.4), gy(GS, 0) + 50, 30, CYAN, la, { bold: true });
  const dr = 2.2 * Math.pow(0.5, Math.max(0, (t - P('C06', 0.6)) / 0.5));
  gDot(GS, dr, 1, GRN, ra); arrowH(gx(GS, dr) + 60, gx(GS, dr) + 16, gy(GS, 1) + 30, GRN, ra, 3);
  label('右极限', gx(GS, 1.4), gy(GS, 1) + 60, 30, GRN, ra, { bold: true });
  // C07：定理
  const ka = ap(t, 'C07', 0.05);
  if (ka > 0) { panel(640, 200, 680, 110, GOLD, ka); richReveal([['极限存在  ⇔  ', CR], ['左极限', CYAN], [' = ', CR], ['右极限', GRN]], CX, 268, 40, t, P('C07', 0.1), { upright: true }); }
  // G01：0 ≠ 1
  if (t > S('G01')) {
    richReveal([['lim_{x→0−} H(x) = ', CYAN], ['0', GOLD]], 790, 360, 30, t, P('G01', 0.45), { upright: true });
    richReveal([['lim_{x→0+} H(x) = ', GRN], ['1', GOLD]], 1170, 360, 30, t, P('G01', 0.6), { upright: true });
    stampMark(1215, 650, 58, t, P('G01', 0.8), { text: '不存在', rot: -0.15 });
  }
};

// ======================= dne：三种不存在 =======================
const DP = [
  { G: { cx: 720, cy: 640, ux: 70, uy: 120, x0: -1.6, x1: 1.6, y0: -0.4, y1: 1.5 }, f: x => (x < 0 ? 0 : 1), name: '左右对不上', s: () => P('C08', 0.12) },
  { G: { cx: 980, cy: 760, ux: 70, uy: 42, x0: -1.6, x1: 1.6, y0: 0, y1: 6 }, f: x => 1 / (x * x), name: '冲向无穷', s: () => P('C08', 0.45) },
  { G: { cx: 1240, cy: 640, ux: 100, uy: 80, x0: -1.1, x1: 1.1, y0: -1.4, y1: 1.4 }, f: x => Math.sin(1 / x), name: '来回振荡', s: () => P('C08', 0.82) },
];
SC.dne = t => {
  starfield(t); blueprint(0.45, 80);
  DP.forEach((d, k) => {
    const a = eOut(prog(t, d.s(), 0.4)); if (a <= 0) return; const G = d.G;
    const hl = k === 1 ? ap(t, 'C09', 0.05) : 0, dim = t > S('C09') && k !== 1 ? 0.45 : 1;
    if (hl > 0) panel(G.cx - 130, 300, 260, 560, GOLD, hl, 'rgba(40,34,12,0.35)');
    gAxes(G, a * dim, { grid: false });
    if (k === 0) { gPlot(G, () => 0, RED, { xa: G.x0, xb: -0.02, a: a * dim, noHead: true }); gPlot(G, () => 1, RED, { xa: 0, a: a * dim, noHead: true }); gDot(G, 0, 0, RED, a * dim, true); gDot(G, 0, 1, RED, a * dim); }
    else gPlot(G, d.f, RED, { a: a * dim, n: k === 2 ? 3000 : 400, w: k === 2 ? 2.5 : 4 });
    label(d.name, G.cx, 880, 30, CR, a * dim, { bold: true });
    mathText(['H(x)', '1/x^2', 'sin(1/x)'][k], G.cx, 360, 30, RED, { align: 'center', glow: 8, alpha: a * dim, upright: true });
  });
  if (t > S('C09')) { const G = DP[1].G; gV(G, 0, GOLD, ap(t, 'C09', 0.3), { dash: [8, 8], w: 3 }); label('垂直渐近线', G.cx, 420, 28, GOLD, ap(t, 'C09', 0.45), { bold: true }); mathText('x = 0', G.cx + 14, 470, 28, GOLD, { glow: 8, alpha: ap(t, 'C09', 0.55), upright: true }); }
};

// ======================= table：A49 / A50 打表陷阱 =======================
const sp = x => Math.sin(Math.PI / x);
const GT = { cx: 640, cy: 650, ux: 700, uy: 170, x0: 0, x1: 1.0, y0: -1.25, y1: 1.25 };
SC.table = t => {
  starfield(t); blueprint(0.45, 80);
  const wa = fadeOut(t, S('C10'), 0.4);
  if (wa > 0) {
    codeWin(t, 610, 250, 380, [
      [[['x = 1     → ', CR], ['0', RED]], P('M01', 0.42), 0.5],
      [[['x = 0.1   → ', CR], ['0', RED]], P('M01', 0.58), 0.5],
      [[['x = 0.01  → ', CR], ['0', RED]], P('M01', 0.74), 0.5],
    ], P('M01', 0.3), { a: ap(t, 'M01', 0.25) * wa, title: 'Gemini：sin(π/x)' });
    if (t > S('M02')) { kinetic('极限 = 0 ！', 800, 520, 50, t, P('M02', 0.4), { col: RED, out: S('C10') }); }
    codeWin(t, 1020, 250, 330, [
      [[['x = 2/5   → ', CR], ['1', GRN]], P('G02', 0.35), 0.5],
      [[['x = 2/9   → ', CR], ['1', GRN]], P('G02', 0.52), 0.5],
      [[['x = 2/13  → ', CR], ['1', GRN]], P('G02', 0.7), 0.5],
    ], P('G02', 0.25), { a: ap(t, 'G02', 0.15) * wa, title: 'GPT：换一组 x' });
    if (t > P('G02', 0.85)) kinetic('极限 = 1 ？', 1185, 520, 46, t, P('G02', 0.85), { col: GRN, out: S('C10') });
    if (t > S('G02')) stampMark(CX, 650, 66, t, P('G02', 0.92), { text: '矛盾', rot: -0.12 });
  }
  // C10：图像放大
  const ga = ap(t, 'C10', 0.05, 0.5);
  if (ga > 0) {
    const x1 = kf(t, 1.0, [[P('C10', 0.35), 0.25, 1.4]]), G = Object.assign({}, GT, { x1, ux: 700 / x1 });
    gAxes(G, ga, { grid: false, ticks: { y: [[1, '1'], [-1, '−1']] } });
    gPlot(G, sp, RED, { a: ga, n: 4000, w: 2.6, xa: 0.012, p: prog(t, P('C10', 0.05), 0.8) });
    [1, 0.1, 0.01].forEach(x => { if (x <= x1) gDot(G, x, 0, RED, ga * ap(t, 'C10', 0.3)); });
    [2 / 5, 2 / 9, 2 / 13].forEach(x => { if (x <= x1) gDot(G, x, 1, GRN, ga * ap(t, 'C10', 0.3)); });
    mathText('y = sin(π/x)', 1330, 410, 32, RED, { align: 'right', glow: 10, alpha: ga, upright: true });
    gH(G, 1, CR, 0.25 * ga, { dash: [4, 8] }); gH(G, -1, CR, 0.25 * ga, { dash: [4, 8] });
  }
  if (t > S('M03')) stampMark(1150, 300, 64, t, P('M03', 0.3), { text: '打表陷阱', rot: -0.15 });
  glowText('打表只能猜，不能证', 900, 300, 40, GOLD, t, P('C11', 0.15));
};

// ======================= quiz =======================
const GQ = { cx: 900, cy: 650, ux: 120, uy: 120, x0: -2.5, x1: 2.5, y0: -1.6, y1: 1.6 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C12', 0, 0.5) * 0.45, 78);
  if (t < S('C13')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C12') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 620);
  richReveal([['lim_{x→0} ', GOLD], ['|x| / x', RED], ['  存在吗？', CR]], CX, 300, 48, t, P('C13', 0.1), { upright: true });
  const ga = ap(t, 'C13', 0.6);
  gAxes(GQ, ga, { grid: false, ticks: { x: [[-2, '−2'], [2, '2']], y: [[1, '1'], [-1, '−1']] } });
  gPlot(GQ, () => -1, RED, { xa: GQ.x0, xb: -0.03, a: ga, noHead: true }); gPlot(GQ, () => 1, RED, { xa: 0.03, a: ga, noHead: true });
  gDot(GQ, 0, 1, RED, ga, true); gDot(GQ, 0, -1, RED, ga, true);
  if (t > S('D03')) {
    label('右 → 1', gx(GQ, 1.4), gy(GQ, 1) - 40, 30, GRN, ap(t, 'D03', 0.1), { bold: true });
    label('左 → −1', gx(GQ, -1.4), gy(GQ, -1) + 44, 30, CYAN, ap(t, 'D03', 0.35), { bold: true });
    stampMark(1240, 560, 70, t, P('D03', 0.7), { text: '不存在', rot: -0.15 });
  }
};

// ======================= outro =======================
const CARDS = [['看去向', '不看那一点', GOLD], ['左右相等', '极限才存在', CYAN], ['三种不存在', '跳跃 · 无穷 · 振荡', RED]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C15'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C14', 0.08 + 0.28 * k), 0.4)) * ca; if (p <= 0) return; const x = 720 + 260 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-115, -110, 230, 220, c, 1); ctx.restore();
    label(h, x, 490, 36, c, clamp(p), { bold: true }); label(s, x, 560, 24, CR, clamp(p));
  });
  if (t > S('C15') - 0.1) { glowText('下一段：算极限', CX, 500, 56, CR, t, P('C15', 0.15)); glowText('极限法则 · 0/0 · 夹逼定理 · sin x / x', CX, 590, 30, CYAN, t, P('C15', 0.4), { bold: false }); }
  credits(t, E('C15') + 0.38, 'AI娘微积分课 · 第 2 章 · P2 极限是什么', '下一段：算极限', [...CREDIT_BASE,
    'Gemini 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
    'Gemini 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、Gemini 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C15') + 0.25) lecturer(t, 'C', 255, -5, E('C15') + 0.48, { h: 710 }); };
SC.__noTag = E('C15') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C15') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'pop', 0.28); s('D01', 0.35, 'soft_hit', 0.22);
  s('C01', 0.05, 'swoosh_soft', 0.2); s('C01', 0.55, 'type', 0.16);
  [0.12, 0.32, 0.5, 0.66].forEach((f, i) => s('C02', f, ['tick', 'tick', 'tick2', 'tick2'][i], 0.22)); s('C02', 0.88, 'ding', 0.26);
  s('C03', 0.3, 'swoosh_in', 0.2); s('C03', 0.55, 'buzz', 0.16);
  [0.08, 0.25, 0.42].forEach((f, i) => s('C04', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.26)); s('C04', 0.85, 'ding_hi', 0.28);
  s('D02', 0.2, 'pluck', 0.22); s('D02', 0.45, 'pluck', 0.22); s('C05', 0.3, 'bell_soft', 0.3);
  s('C06', 0.1, 'whoosh', 0.2); s('C06', 0.55, 'whoosh', 0.2); s('C07', 0.1, 'swell', 0.22);
  s('G01', 0.45, 'pop', 0.24); s('G01', 0.6, 'pop', 0.24); s('G01', 0.8, 'stamp', 0.32);
  s('C08', 0.12, 'marimba_lo', 0.26); s('C08', 0.45, 'marimba', 0.26); s('C08', 0.82, 'marimba_hi', 0.26); s('C09', 0.3, 'tick2', 0.22);
  s('M01', 0.3, 'swoosh_in', 0.22); [0.42, 0.58, 0.74].forEach(f => s('M01', f, 'type', 0.16)); s('M02', 0.4, 'sparkle', 0.26);
  s('G02', 0.25, 'swoosh_in', 0.22); [0.35, 0.52, 0.7].forEach(f => s('G02', f, 'type', 0.16)); s('G02', 0.92, 'stamp', 0.32);
  s('C10', 0.05, 'warp', 0.2); s('C10', 0.35, 'riser', 0.14); s('M03', 0.3, 'stamp', 0.3); s('M03', 0.32, 'glitch', 0.16); s('C11', 0.15, 'bell_soft', 0.26);
  s('C12', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.7, 'stamp', 0.32); s('D03', 0.1, 'check', 0.3);
  [0.08, 0.36, 0.64].forEach(f => s('C14', f, 'pop', 0.24)); s('C15', 0.15, 'swell', 0.3);
})();
finalize();
