// 第 2 章 P6《无穷远处：渐近线》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A65 镜头飞向无穷远，曲线贴线 · A66 次数比较天平 · A67 多项式除法分离出斜渐近线 · A68 √(x²) = |x| 的符号翻转
const SC = {};
const TITLES = [['horiz', '水平渐近线'], ['rational', '有理函数：比次数'], ['trap', '根号的符号陷阱'], ['slant', '斜渐近线'], ['growth', '指数终究会赢'], ['quiz', '随堂一题'], ['outro', '小结']];
SIDE.L.dy = t => -6 * Math.abs(Math.sin(t * 5));   // 羊驼慢悠悠地走：轻微上下颠
function walker(x, y, a) { if (a <= 0) return; label('∞', x, y, 44, SQ.L.col, a, { font: F_MATH, bold: true, glow: 14 }); }

// ======================= horiz：A65 =======================
SC.horiz = t => {
  starfield(t); blueprint(0.45, 80);
  const fly = Math.pow(10, kf(t, L10(8), [[P('L01', 0.1), L10(800), 2.6]])), G = { cx: 660, cy: 760, ux: 660 / fly, uy: 140, x0: 0, x1: fly, y0: -0.5, y1: 3.3 };
  const a1 = ap(t, 'D01', 0.1) * fadeOut(t, S('C02'), 0.4);
  if (a1 > 0) {
    gAxes(G, a1, { grid: false });
    gPlot(G, x => 1 / x, RED, { a: a1, xa: 0.3, n: 2000 });
    label(`x 的视野：0 ~ ${Math.round(fly)}`, 1340, 300, 26, CR, a1 * 0.8, { align: 'right' });
    const wx = lerp(680, 1300, prog(t, S('L01'), Math.max(0.5, E('C01') - S('L01'))));
    walker(wx, gy(G, 0) - 40 - 6 * Math.abs(Math.sin(t * 5)), a1 * ap(t, 'L01', 0));
    const ha = ap(t, 'C01', 0.55); gH(G, 0, GOLD, a1 * ha, { w: 4, dash: [12, 8] });
    if (ha > 0) { label('水平渐近线  y = 0', 1000, gy(G, 0) + 50, 32, GOLD, a1 * ha, { bold: true }); mathText('y = 1/x', 760, 420, 34, RED, { glow: 10, alpha: a1 * ap(t, 'C01', 0.1), upright: true }); }
  }
  if (t > S('C02') - 0.1) {
    const A = { cx: 820, cy: 600, ux: 30, uy: 70, x0: -5.5, x1: 5.5, y0: -2, y1: 2 }, B = { cx: 1230, cy: 740, ux: 40, uy: 75, x0: -5, x1: 1.6, y0: -0.3, y1: 4.2 };
    const aa = ap(t, 'C02', 0.05), ba = ap(t, 'C02', 0.55);
    gAxes(A, aa, { grid: false }); gH(A, Math.PI / 2, GOLD, 0.8 * aa, { dash: [8, 6] }); gH(A, -Math.PI / 2, GOLD, 0.8 * aa, { dash: [8, 6] });
    gPlot(A, Math.atan, RED, { a: aa }); label('arctan x', 820, 420, 30, RED, aa, { font: F_MATH });
    label('π/2', gx(A, 5.5) + 8, gy(A, Math.PI / 2), 24, GOLD, aa, { align: 'left', font: F_MATH }); label('−π/2', gx(A, 5.5) + 8, gy(A, -Math.PI / 2), 24, GOLD, aa, { align: 'left', font: F_MATH });
    gAxes(B, ba, { grid: false }); gH(B, 0, GOLD, ba, { w: 4, dash: [10, 6] }); gPlot(B, Math.exp, RED, { a: ba, xb: 1.4 }); label('指数函数', 1230, 420, 30, RED, ba, { bold: true });
    label('往左 → 0', gx(B, -3.5), gy(B, 0) + 36, 26, GOLD, ba, { bold: true });
  }
};
const L10 = Math.log10;

// ======================= rational：A66 =======================
function balance(t, tilt, a) {
  if (a <= 0) return; const px = 980, py = 470, Lb = 200;
  ctx.save(); ctx.globalAlpha *= a;
  seg(px, py, px, py + 150, CR, 0.7, 4); seg(px - 60, py + 150, px + 60, py + 150, CR, 0.7, 4);
  ctx.translate(px, py); ctx.rotate(tilt);
  seg(-Lb, 0, Lb, 0, GOLD, 1, 5);
  [-1, 1].forEach(s => { seg(s * Lb, 0, s * Lb - 40, 70, CR, 0.5, 2); seg(s * Lb, 0, s * Lb + 40, 70, CR, 0.5, 2);
    ctx.save(); ctx.translate(s * Lb, 70); ctx.rotate(-tilt); panel(-60, 0, 120, 44, s < 0 ? RED : CYAN, 1); label(s < 0 ? '分子' : '分母', 0, 22, 26, s < 0 ? RED : CYAN, 1, { bold: true }); ctx.restore(); });
  ctx.restore(); glowDot(px, py, 7, GOLD, a);
}
SC.rational = t => {
  starfield(t); blueprint(0.45, 80);
  const fa = fadeOut(t, S('L02'), 0.4);
  if (fa > 0) {
    richReveal([['(4x^2 + x)/(2x^2 − 3)', RED]], CX, 300, 48, t, P('C03', 0.3), { alpha: fa, upright: true });
    label('÷ x²', CX, 390, 34, GOLD, ap(t, 'C03', 0.6) * fa, { bold: true });
    if (t > S('C04') - 0.1) {
      const g = ap(t, 'C04', 0.45), dim = lerp(1, 0.25, g);
      ctx.save(); ctx.globalAlpha *= fa;
      richReveal([['= (4 + ', CR], ['1/x', hexA(CYAN, dim)], [')/(2 − ', CR], ['3/x^2', hexA(CYAN, dim)], [')', CR]], CX, 490, 46, t, P('C04', 0.2), { upright: true });
      ctx.restore();
      if (g > 0) { const z = 46, W = ['= (4 + ', '1/x', ')/(2 − ', '3/x^2', ')'].reduce((s, q) => s + mathW(q, z), 0), x0 = CX - W / 2;
        const c1 = x0 + mathW('= (4 + ', z) + mathW('1/x', z) / 2, c2 = x0 + mathW('= (4 + ', z) + mathW('1/x', z) + mathW(')/(2 − ', z) + mathW('3/x^2', z) / 2;
        label('→ 0', c1, 560, 26, CYAN, g * fa, { bold: true }); label('→ 0', c2, 560, 26, CYAN, g * fa, { bold: true }); }
      richReveal([['→  4/2 = ', CR], ['2', GOLD]], CX, 660, 50, t, P('C04', 0.7), { alpha: fa, upright: true });
    }
  }
  if (t > S('L02') - 0.1) {
    const u = (t - S('L02')) / D('L02'), tilt = u < 0.42 ? -0.22 : u < 0.68 ? 0 : 0.22;
    const tl = kf(t, -0.22, [[P('L02', 0.42), 0, 0.3], [P('L02', 0.68), 0.22, 0.3]]);
    balance(t, -tl, ap(t, 'L02', 0.05));
    const rows = [['分母次数高', '→ 0', 0.25], ['一样高', '→ 首项系数比', 0.45], ['分子次数高', '→ ∞', 0.7]];
    rows.forEach(([l, r, f], k) => { const a = ap(t, 'L02', f), y = 720 + 62 * k, on = (k === 0 && u < 0.42) || (k === 1 && u >= 0.42 && u < 0.68) || (k === 2 && u >= 0.68); label(l, 900, y, 30, on ? GOLD : CR, a, { bold: true, align: 'right' }); label(r, 930, y, 30, on ? GOLD : CR, a, { bold: true, align: 'left' }); });
    label('Llama 的开源口诀', CX, 300, 34, SQ.L.col, ap(t, 'L02', 0.1), { bold: true });
  }
};

// ======================= trap：A68 =======================
const GT = { cx: 980, cy: 620, ux: 52, uy: 110, x0: -6.4, x1: 6.4, y0: -2.4, y1: 2.4 };
const ft = x => Math.sqrt(x * x + 1) / x;
SC.trap = t => {
  starfield(t); blueprint(0.45, 80);
  richReveal([['√(x^2 + 1) / x', RED]], CX, 260, 46, t, P('C05', 0.1), { upright: true });
  const ga = ap(t, 'C05', 0.3);
  gAxes(GT, ga, { grid: false, ticks: { y: [[1, '1'], [-1, '−1']] } });
  gPlot(GT, ft, RED, { a: ga, xb: -0.06, noHead: true }); gPlot(GT, ft, RED, { a: ga, xa: 0.06, noHead: true });
  const la = ap(t, 'C06', 0.55), ra = ap(t, 'C06', 0.45);
  gH(GT, 1, GOLD, ra, { xa: 0.3, dash: [10, 6], w: 3 }); gH(GT, -1, CYAN, la, { xb: -0.3, dash: [10, 6], w: 3 });
  if (t > S('C06')) {
    richReveal([['√(x^2) = |x|', GOLD], ['，x < 0 时 = ', CR], ['−x', CYAN]], CX, 340, 34, t, P('C06', 0.1), { upright: true });
    label('往右 → 1', gx(GT, 4), gy(GT, 1) - 34, 30, GOLD, ra, { bold: true }); label('往左 → −1', gx(GT, -4), gy(GT, -1) + 40, 30, CYAN, la, { bold: true });
  }
  if (t > S('D02')) stampMark(1240, 800, 50, t, P('D02', 0.3), { text: '两头不同', rot: -0.15, col: INV });
};

// ======================= slant：A67 =======================
const GS = { cx: 980, cy: 640, ux: 52, uy: 34, x0: -6.4, x1: 6.4, y0: -7.5, y1: 7.5 };
const fs = x => (x * x + 1) / x;
SC.slant = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C08')) { glowText('分子高一次 → 多项式除法', CX, 300, 44, GOLD, t, P('C07', 0.2)); }
  const ga = ap(t, 'C07', 0.4);
  gAxes(GS, ga * 0.8, { grid: false });
  gPlot(GS, fs, RED, { a: ga, xb: -0.1, noHead: true }); gPlot(GS, fs, RED, { a: ga, xa: 0.1, noHead: true });
  if (t > S('C08')) {
    richReveal([['(x^2 + 1)/x = ', RED], ['x', GOLD], [' + ', CR], ['1/x', CYAN]], CX, 290, 44, t, P('C08', 0.1), { upright: true });
    const la = ap(t, 'C08', 0.6); gPlot(GS, x => x, GOLD, { a: la, w: 3, dash: [12, 8] });
    label('斜渐近线 y = x', gx(GS, 3.2) + 20, gy(GS, 3.2) + 50, 30, GOLD, la, { bold: true, align: 'left' });
    if (ap(t, 'C08', 0.4) > 0) label('尾巴 → 0', CX + 150, 360, 26, CYAN, ap(t, 'C08', 0.4), { bold: true });
  }
};

// ======================= growth =======================
const GW = { cx: 660, cy: 820, ux: 1.6, uy: 460, x0: 0, x1: 420, y0: 0, y1: 1.15 };
const lnPeak = 10 * Math.log(10 / Math.log(1.1)) - (10 / Math.log(1.1)) * Math.log(1.1);
const fw = x => (x <= 0 ? 0 : Math.exp(10 * Math.log(x) - x * Math.log(1.1) - lnPeak));
SC.growth = t => {
  starfield(t); blueprint(0.45, 80);
  richReveal([['x^{10} / 1.1^x', RED], ['  →  0', GOLD]], CX, 270, 46, t, P('C09', 0.2), { upright: true });
  const ga = ap(t, 'C09', 0.3);
  gAxes(GW, ga, { grid: false, ticks: { x: [[105, '105'], [400, '400']] } });
  gPlot(GW, fw, RED, { a: ga, n: 800, p: prog(t, P('C09', 0.3), 1.6) });
  label('峰值之后一路下滑', gx(GW, 105) + 30, gy(GW, 1) - 30, 26, CR, ga * ap(t, 'C09', 0.6), { align: 'left', bold: true });
  label('（纵轴按峰值缩放）', 1340, 860, 22, CR, ga * 0.7, { align: 'right' });
  if (t > S('L03') - 0.3) walker(lerp(gx(GW, 160), gx(GW, 400), prog(t, S('L03') - 0.3, D('L03') + 0.3)), gy(GW, 0) - 40 - 6 * Math.abs(Math.sin(t * 5)), ap(t, 'L03', 0));
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.45, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 620);
  richReveal([['lim_{x→∞} ', GOLD], ['(3x^2 − x)/(2x^2 + 5)', RED], [' = ？', CR]], CX - 60, 400, 46, t, P('C11', 0.1), { upright: true });
  if (t > S('L04')) { richReveal([['次数一样高  →  ', CR], ['3/2', GOLD]], CX - 60, 520, 46, t, P('L04', 0.2), { upright: true }); checkMark(CX - 60, 650, 40, GRN, t, P('L04', 0.7)); }
};

// ======================= outro =======================
const CARDS = [['水平渐近线', 'x → ±∞ 的极限', GOLD], ['有理函数', '比次数', RED], ['根号', '小心符号', CYAN], ['斜渐近线', '高一次 · 做除法', GRN]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C13'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C12', 0.06 + 0.2 * k), 0.4)) * ca; if (p <= 0) return; const x = 680 + 200 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-90, -100, 180, 200, c, 1); ctx.restore();
    label(h, x, 495, 28, c, clamp(p), { bold: true }); label(s, x, 560, 22, CR, clamp(p));
  });
  if (t > S('C13') - 0.1) { glowText('下一段：导数', CX, 500, 56, CR, t, P('C13', 0.15)); glowText('回到芝诺：0 米 / 0 秒', CX, 590, 32, GOLD, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 2 章 · P6 渐近线', '下一段：导数', [...CREDIT_BASE,
    'Llama 娘立绘：依据 ZipZipPipe 设定（Pixiv 148186519）由 AI 生成的本课差分。',
    'Llama 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、DeepSeek、Llama 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'pop', 0.24); s('L01', 0.1, 'warp', 0.2); s('L01', 0.2, 'riser', 0.12); s('C01', 0.55, 'ding', 0.26);
  s('C02', 0.05, 'swoosh_in', 0.2); s('C02', 0.55, 'swoosh_in', 0.2);
  s('C03', 0.3, 'type', 0.16); s('C03', 0.6, 'pop', 0.22); s('C04', 0.2, 'type', 0.16); s('C04', 0.45, 'shimmer', 0.18); s('C04', 0.7, 'ding_hi', 0.28);
  s('L02', 0.05, 'swell', 0.2); [0.25, 0.45, 0.7].forEach(f => s('L02', f, 'soft_hit', 0.24));
  s('C05', 0.1, 'type', 0.16); s('C06', 0.1, 'type', 0.16); s('C06', 0.45, 'ding', 0.24); s('C06', 0.55, 'ding_lo', 0.24); s('D02', 0.3, 'stamp', 0.28);
  s('C07', 0.2, 'swoosh_in', 0.2); s('C08', 0.1, 'type', 0.16); s('C08', 0.6, 'ding_hi', 0.28);
  s('C09', 0.2, 'type', 0.16); s('C09', 0.3, 'riser', 0.12); s('L03', 0.1, 'pluck', 0.22);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('L04', 0.7, 'check', 0.34);
  [0.06, 0.26, 0.46, 0.66].forEach(f => s('C12', f, 'pop', 0.24)); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
