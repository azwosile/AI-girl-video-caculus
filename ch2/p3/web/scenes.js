// 第 2 章 P3《算极限：法则、0/0 与夹逼》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A51 法则拼装 · A52 零因子抵消 · A53 夹逼带收紧 · A54 单位圆三面积 · A55 sin x / x 的洞被填上（呼应第 1 章 A36）
const SC = {};
const TITLES = [['laws', '极限法则'], ['zero', '0/0：约掉零因子'], ['squeeze', '夹逼定理'], ['sinx', '重要极限 sin x / x'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= laws：A51 =======================
const LAWS = [
  [['lim (f + g) = lim f + lim g', CR]],
  [['lim (f − g) = lim f − lim g', CR]],
  [['lim (f · g) = lim f · lim g', CR]],
  [['lim (f / g) = lim f / lim g', CR], ['   (lim g ≠ 0)', GOLD]],
  [['lim f^n = (lim f)^n', CR]],
  [['lim √f = √(lim f)', CR]],
];
const NAMES = ['和', '差', '积', '商', '乘方', '开方'];
SC.laws = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C01')) { kinetic('总不能每次都打表？', CX, 470, 60, t, P('D01', 0.2), { col: CR }); return; }
  const la = fadeOut(t, S('C02'), 0.4);
  LAWS.forEach((r, k) => {
    const t0 = P('C01', 0.22 + 0.1 * k), y = 250 + 84 * k;
    label(NAMES[k], 700, y - 8, 30, GOLD, ap(t, 'C01', 0.22 + 0.1 * k) * la, { bold: true });
    if (la > 0) richReveal(r, 760, y, 34, t, t0, { align: 'left', alpha: la, upright: true });
  });
  if (t > S('C02') - 0.1) {
    richReveal([['lim_{x→2} ', GOLD], ['(x^2 + 1)/(x + 3)', RED]], CX, 360, 48, t, P('C02', 0.15), { upright: true });
    richReveal([['= (4 + 1)/(2 + 3)', CR]], CX, 470, 48, t, P('C02', 0.5), { upright: true });
    richReveal([['= 1', GOLD]], CX, 580, 52, t, P('C02', 0.72), { upright: true });
    label('直接代入', CX, 690, 34, CYAN, ap(t, 'C02', 0.6), { bold: true });
  }
};

// ======================= zero：A52 零因子抵消 =======================
const GZ = { cx: 660, cy: 880, ux: 80, uy: 48, x0: 0, x1: 5.2, y0: 0, y1: 6.6 };
function strike(x0, x1, y, t, t0, col = RED) { const p = eOut(prog(t, t0, 0.3)); if (p <= 0) return; seg(x0, y + 12, lerp(x0, x1, p), y - 18 + 30 * (1 - p) * 0, col, 0.95, 4); }
SC.zero = t => {
  starfield(t); blueprint(0.45, 80);
  const fx = 'lim_{x→3} (x^2 − 2x − 3)/(x − 3)';
  richReveal([[fx, RED]], CX, 250, 44, t, P('C03', 0.35), { upright: true });
  if (t > P('C03', 0.2)) stampMark(1300, 340, 44, t, P('C03', 0.25), { text: '0/0', rot: -0.15, alpha: fadeOut(t, S('C04'), 0.4) });
  // C04：因式分解 → 约掉
  const pre = '= (x + 1)·', w1 = mathW(pre, 44), w2 = mathW('(x − 3)/(x − 3)', 44), x0 = CX - (w1 + w2) / 2;
  if (t > S('C04') - 0.1) {
    richReveal([[pre, CR], ['(x − 3)/(x − 3)', CYAN]], CX, 340, 44, t, P('C04', 0.08), { upright: true });
    const st = P('C04', 0.42); strike(x0 + w1, x0 + w1 + w2, 340, t, st);
    richReveal([['= x + 1', CR], ['  →  4', GOLD]], CX, 430, 44, t, P('C04', 0.62), { upright: true });
  }
  const ga = ap(t, 'C04', 0.55);
  gAxes(GZ, ga, { grid: false, ticks: { x: [[3, '3']], y: [[4, '4']] } });
  gPlot(GZ, x => x + 1, RED, { a: ga, w: 4 }); gDot(GZ, 3, 4, RED, ga, true);
  gV(GZ, 3, CYAN, 0.35 * ga, { yb: 4, dash: [6, 6] }); gH(GZ, 4, GOLD, 0.35 * ga, { xb: 3, dash: [6, 6] });
  if (t > S('D02')) label('x ≠ 3，才能约', gx(GZ, 3), 520, 30, CYAN, ap(t, 'D02', 0.3), { bold: true });
  const tools = [['① 约零因子', GOLD], ['② 有理化', CYAN], ['③ 拆绝对值，分左右', GRN]];
  tools.forEach(([s, c], k) => { const a = ap(t, 'C05', 0.4 + 0.15 * k); if (a > 0) { panel(1080, 560 + 82 * k, 280, 62, c, a); label(s, 1220, 591 + 82 * k, 28, c, a, { bold: true }); } });
};

// ======================= squeeze：A53 夹逼带收紧 =======================
const fq = x => x * x * Math.sin(1 / x);
SC.squeeze = t => {
  starfield(t); blueprint(0.45, 80);
  const s = kf(t, 0.3, [[P('C07', 0.55), 0.06, 2.2]]), G = { cx: 980, cy: 640, ux: 330 / s, uy: 200 / (s * s), x0: -s, x1: s, y0: -s * s, y1: s * s };
  G.y0 = -1.0 * s * s; G.y1 = 1.0 * s * s;
  const ga = ap(t, 'C06', 0.05, 0.5);
  gAxes(G, ga, { grid: false });
  const ba = ap(t, 'C07', 0.05);
  if (ba > 0) {   // ±x² 之间的金色带
    ctx.save(); ctx.globalAlpha *= 0.14 * ba; ctx.fillStyle = GOLD; ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const x = -s + 2 * s * i / 120; ctx.lineTo(gx(G, x), gy(G, x * x)); }
    for (let i = 120; i >= 0; i--) { const x = -s + 2 * s * i / 120; ctx.lineTo(gx(G, x), gy(G, -x * x)); }
    ctx.fill(); ctx.restore();
    gPlot(G, x => x * x, GOLD, { a: ba, w: 3, dash: [10, 8] }); gPlot(G, x => -x * x, GOLD, { a: ba, w: 3, dash: [10, 8] });
    label('x²', gx(G, s) + 10, gy(G, s * s) + 30, 30, GOLD, ba, { align: 'left', font: F_MATH });
    label('−x²', gx(G, s) + 10, gy(G, -s * s) - 30, 30, GOLD, ba, { align: 'left', font: F_MATH });
  }
  gPlot(G, fq, RED, { a: ga, n: 4000, w: 2.6, p: prog(t, P('C06', 0.05), 0.9) });
  richReveal([['x^2 sin(1/x)', RED]], CX, 270, 44, t, P('C06', 0.15), { out: S('C07'), upright: true });
  if (t > S('C06') + 0.1) label('sin(1/x) 没有极限 → 乘积法则用不上', CX, 340, 28, CR, ap(t, 'C06', 0.55) * fadeOut(t, S('C07')), { bold: true });
  richReveal([['−x^2', GOLD], ['  ≤  ', CR], ['x^2 sin(1/x)', RED], ['  ≤  ', CR], ['x^2', GOLD]], CX, 270, 42, t, P('C07', 0.1), { upright: true });
  if (t > P('C07', 0.4)) richReveal([['0', GOLD], ['  ←  ', CR], ['中间也 → 0', RED], ['  →  ', CR], ['0', GOLD]], CX, 340, 34, t, P('C07', 0.4), { upright: true });
  if (t > S('H01')) {
    label('上界：0', 770, 470, 30, GOLD, ap(t, 'H01', 0.2), { bold: true });
    label('下界：0', 770, 812, 30, GOLD, ap(t, 'H01', 0.4), { bold: true });
    stampMark(1190, 478, 44, t, P('H01', 0.75), { text: '对账', rot: -0.15, col: SQ.H.col });
  }
};

// ======================= sinx：A54 / A55 =======================
const O = { x: 700, y: 840 }, R = 340, TH = 0.7;
function unitCircle(t, a) {
  if (a <= 0) return; const c = Math.cos(TH), s = Math.sin(TH), tn = Math.tan(TH);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(237,230,216,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(O.x, O.y, R, -Math.PI / 2, 0); ctx.stroke();
  seg(O.x, O.y, O.x + R + 60, O.y, CR, 0.6, 2); seg(O.x, O.y, O.x, O.y - R - 40, CR, 0.6, 2);
  const A = [O.x + R, O.y], Pp = [O.x + R * c, O.y - R * s], T = [O.x + R, O.y - R * tn];
  const fill = (pts, col, al) => { ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const a3 = ap(t, 'C09', 0.72), a2 = ap(t, 'C09', 0.55), a1 = ap(t, 'C09', 0.38);
  if (a3 > 0) { fill([[O.x, O.y], A, T], CYAN, 0.16 * a3); glowPath(() => { ctx.moveTo(O.x, O.y); ctx.lineTo(...T); ctx.lineTo(...A); }, CYAN, 3, a3); }
  if (a2 > 0) { ctx.save(); ctx.globalAlpha *= 0.22 * a2; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.arc(O.x, O.y, R, -TH, 0); ctx.closePath(); ctx.fill(); ctx.restore(); glowPath(() => ctx.arc(O.x, O.y, R, -TH, 0), GOLD, 4, a2); }
  if (a1 > 0) { fill([[O.x, O.y], A, Pp], INV, 0.3 * a1); glowPath(() => { ctx.moveTo(O.x, O.y); ctx.lineTo(...Pp); ctx.lineTo(...A); ctx.closePath(); }, INV, 3, a1); }
  glowDot(...Pp, 7, CR, 1); glowDot(...A, 6, CR, 1);
  label('x', O.x + 70, O.y - 24, 28, GOLD, 1, { font: F_MATH });
  label('1', O.x + R / 2, O.y + 30, 26, CR, 0.8, { font: F_MATH });
  ctx.restore();
}
const GS2 = { cx: 980, cy: 800, ux: 55, uy: 300, x0: -6.5, x1: 6.5, y0: -0.3, y1: 1.15 };
const sx = x => (Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x);
SC.sinx = t => {
  starfield(t); blueprint(0.45, 80);
  // B01 / C08：豆包糊弄式约分
  const ba = fadeOut(t, S('H02'), 0.35);
  if (ba > 0 && t < S('H02') + 0.4) {
    const y = 460, f = 'sin x / x', w = mathW(f, 84), x0 = CX - w / 2;
    ctx.save(); ctx.globalAlpha *= ba; mathRich([['sin x / x', RED]], x0, y, 84, { glow: 14, alpha: ap(t, 'B01', 0.1), upright: true }); ctx.restore();
    const xs = [x0 + mathW('sin ', 84), x0 + mathW('sin x / ', 84)];
    xs.forEach((x, i) => { const p = eOut(prog(t, P('B01', 0.45 + 0.08 * i), 0.25)) * ba; if (p > 0) seg(x - 6, y + 14, x - 6 + (mathW('x', 84) + 12) * p, y - 50, SQ.B.col, p, 6); });
    label('= sin ？', CX + w / 2 + 120, y - 20, 56, SQ.B.col, ap(t, 'B01', 0.75) * ba, { bold: true });
    if (t > S('C08')) {
      ['s', 'i', 'n'].forEach((c, k) => label(c + (k < 2 ? ' ×' : ''), CX - 120 + 110 * k, 640, 48, CR, ap(t, 'C08', 0.3) * ba, { font: F_MATH }));
      stampMark(CX + 230, 640, 64, t, P('C08', 0.55), { text: '不能约', rot: -0.15, alpha: ba });
    }
  }
  // H02：混元的算盘
  const ha = ap(t, 'H02', 0.05) * fadeOut(t, S('C09'), 0.4);
  if (ha > 0) codeWin(t, 700, 330, 560, [
    [[['x = 0.1     →  ', CR], ['0.99833', GOLD]], P('H02', 0.2), 0.5],
    [[['x = 0.01    →  ', CR], ['0.9999833', GOLD]], P('H02', 0.55), 0.5],
    [[['x = 0.001   →  ', CR], ['0.999999833', GOLD]], P('H02', 0.72), 0.5],
  ], P('H02', 0.1), { a: ha, title: '混元的算盘：sin x / x' });
  // C09 / C10：单位圆三面积
  const ua = ap(t, 'C09', 0.25) * fadeOut(t, S('D03'), 0.4);
  unitCircle(t, ua);
  const rows = [[['sin x / 2', INV]], [['≤  x / 2', GOLD]], [['≤  tan x / 2', CYAN]]];
  rows.forEach((r, k) => { if (ua > 0) richReveal(r, 1130, 560 + 70 * k, 36, t, P('C09', 0.38 + 0.17 * k), { align: 'left', alpha: ua, upright: true }); });
  if (t > S('C10') - 0.1) {
    const fa = fadeOut(t, S('C11'), 0.35);
    richReveal([['cos x', CYAN], ['  ≤  ', CR], ['sin x / x', RED], ['  ≤  ', CR], ['1', GOLD]], CX, 270, 46, t, P('C10', 0.3), { out: S('C11'), upright: true });
    richReveal([['lim_{x→0} sin x / x = ', CR], ['1', GOLD]], CX, 360, 44, t, P('C10', 0.75), { out: S('C11'), upright: true });
  }
  // D03：洞被填上
  const ga = ap(t, 'D03', 0.0, 0.5);
  if (ga > 0) {
    gAxes(GS2, ga, { grid: false, ticks: { y: [[1, '1']] } });
    gPlot(GS2, sx, RED, { a: ga, n: 600 });
    const fill = prog(t, P('D03', 0.45), 0.3);
    gDot(GS2, 0, 1, RED, ga * (1 - fill), true); if (fill > 0) glowDot(gx(GS2, 0), gy(GS2, 1), 9, GOLD, fill * ga);
    burst(t, P('D03', 0.45), gx(GS2, 0), gy(GS2, 1), GOLD, 90);
    mathText('y = sin x / x', gx(GS2, 6.3), gy(GS2, 1.05), 30, RED, { align: 'right', glow: 8, alpha: ga, upright: true });
  }
  if (t > S('C11') - 0.1) richReveal([['sin 3x / x', RED], [' = ', CR], ['sin 3x / 3x', RED], [' · 3  →  ', CR], ['3', GOLD]], CX, 300, 44, t, P('C11', 0.2), { upright: true });
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C12', 0, 0.5) * 0.45, 78);
  if (t < S('C13')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C12') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 620);
  richReveal([['lim_{x→0} ', GOLD], ['sin 5x / x', RED], [' = ？', CR]], CX - 60, 420, 56, t, P('C13', 0.1), { upright: true });
  if (t > S('H03')) {
    richReveal([['= 5 · ', CR], ['sin 5x / 5x', RED], ['  →  ', CR], ['5', GOLD]], CX - 60, 540, 48, t, P('H03', 0.15), { upright: true });
    checkMark(CX - 60, 680, 44, GRN, t, P('H03', 0.6));
  }
};

// ======================= outro =======================
const CARDS = [['能代就代', '法则 + 代入', CYAN], ['0/0', '约掉零因子', RED], ['夹逼', '上下界同极限', GOLD], ['sin x / x → 1', '单位圆三面积', GRN]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C15'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C14', 0.06 + 0.2 * k), 0.4)) * ca; if (p <= 0) return; const x = 680 + 200 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-90, -100, 180, 200, c, 1); ctx.restore();
    label(h, x, 495, k === 3 ? 26 : 34, c, clamp(p), { bold: true }); label(s, x, 560, 22, CR, clamp(p));
  });
  if (t > S('C15') - 0.1) { glowText('下一段：讨价还价的定义', CX, 500, 54, CR, t, P('C15', 0.15)); glowText('ε-δ：你出 ε，我还 δ', CX, 590, 32, GOLD, t, P('C15', 0.45), { bold: false }); }
  credits(t, E('C15') + 0.38, 'AI娘微积分课 · 第 2 章 · P3 算极限', '下一段：讨价还价的定义', [...CREDIT_BASE,
    '豆包娘立绘：ZipZipPipe 的 Seed/豆包拟人设定，复制自本系列 AI娘 Git 课素材。',
    '混元娘立绘：依据 ZipZipPipe 设定（Pixiv 150718881）由 AI 生成的本课差分。',
    '豆包、混元声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、DeepSeek、豆包、混元等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C15') + 0.25) lecturer(t, 'C', 255, -5, E('C15') + 0.48, { h: 710 }); };
SC.__noTag = E('C15') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C15') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.2, 'pop', 0.26);
  for (let k = 0; k < 6; k++) s('C01', 0.22 + 0.1 * k, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi', 'marimba', 'marimba_hi'][k], 0.26);
  s('C02', 0.15, 'type', 0.16); s('C02', 0.5, 'tick', 0.2); s('C02', 0.72, 'ding', 0.26);
  s('C03', 0.25, 'stamp', 0.3); s('C03', 0.35, 'type', 0.16);
  s('C04', 0.08, 'swoosh_in', 0.2); s('C04', 0.42, 'zap', 0.2); s('C04', 0.62, 'ding_hi', 0.28);
  s('D02', 0.3, 'pluck', 0.22); [0.4, 0.55, 0.7].forEach(f => s('C05', f, 'pop', 0.22));
  s('C06', 0.05, 'swoosh_in', 0.2); s('C06', 0.55, 'buzz', 0.16);
  s('C07', 0.1, 'swell', 0.2); s('C07', 0.55, 'riser', 0.14);
  [0.2, 0.3, 0.4, 0.5].forEach(f => s('H01', f, 'tick', 0.22)); s('H01', 0.75, 'stamp', 0.3);
  s('B01', 0.1, 'pop', 0.26); s('B01', 0.45, 'zap', 0.2); s('B01', 0.53, 'zap', 0.2); s('B01', 0.75, 'sparkle', 0.24);
  s('C08', 0.3, 'buzz', 0.18); s('C08', 0.55, 'stamp', 0.32); s('B02', 0.2, 'glitch', 0.16);
  [0.2, 0.55, 0.72].forEach(f => s('H02', f, 'type', 0.16)); [0.25, 0.3, 0.35, 0.6, 0.65].forEach(f => s('H02', f, 'tick2', 0.18));
  s('C09', 0.25, 'swoosh_in', 0.2); [0.38, 0.55, 0.72].forEach((f, i) => s('C09', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.26));
  s('C10', 0.3, 'type', 0.16); s('C10', 0.75, 'ding_hi', 0.3);
  s('D03', 0.45, 'tinkle', 0.3); s('D03', 0.5, 'sparkle', 0.26); s('C11', 0.2, 'type', 0.16);
  s('C12', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('H03', 0.6, 'check', 0.34);
  [0.06, 0.26, 0.46, 0.66].forEach(f => s('C14', f, 'pop', 0.24)); s('C15', 0.15, 'swell', 0.3);
})();
finalize();
