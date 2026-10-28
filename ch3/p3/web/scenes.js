// 第 3 章 P3《三角函数的导数》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A93 和角公式 + 两个极限证 (sin x)′ = cos x · A94 斜率记录仪：sin 的斜率连成 cos · A95 商法则推 tan 与六函数表 · A96 MiMo 的兔子四格循环（27 阶）
const SC = {};
const TITLES = [['proof', '用定义证明'], ['graph', '图上验证'], ['table', '六个三角函数'], ['cycle', '四步一圈'], ['quiz', '随堂一题'], ['outro', '小结']];
const TC = SQ.T.col, PI = Math.PI;
SIDE.T.dy = t => { let y = 0; [[P('T01', 0.2), 120], [P('T02', 0.15), 80], [P('T03', 0.6), 110]].forEach(([t0, h]) => { const u = (t - t0) / 0.5; if (u > 0 && u < 1) y -= h * Math.sin(PI * u); }); return y; };

// ======================= proof（A93） =======================
SC.proof = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01')) { kinetic('(sin x)′ = cos x', CX, 460, 76, t, P('D01', 0.1), { col: OUTER, font: F_MATH }); stampMark(1240, 560, 60, t, P('D01', 0.55), { text: '凭什么？', col: INV, rot: -0.2 }); return; }
  const sz = 36, x0 = 620;
  // 第 1 行：定义
  const y1 = 250; richReveal([['(sin x)′ = lim', CR]], x0, y1, sz, t, P('C01', 0.03), { align: 'left' });
  const xf = x0 + mathW('(sin x)′ = lim', sz) + 12;
  frac([['sin(x + h) − sin x', OUTER]], [['h', CR]], xf, y1 - 8, sz * 0.86, ap(t, 'C01', 0.12));
  label('h→0', x0 + mathW('(sin x)′ = ', sz) + 34, y1 + 30, 18, CR, ap(t, 'C01', 0.12), { font: F_MATH });
  // 和角公式便签
  if (t > P('C01', 0.4)) {
    const a = ap(t, 'C01', 0.4) * fadeOut(t, P('C02', 0.6), 0.4); panel(760, 320, 600, 70, GOLD, a);
    mathText('sin(x + h) = sin x cos h + cos x sin h', 1060, 366, 28, GOLD, { align: 'center', alpha: a, glow: 8 });
    label('和角公式', 700, 355, 22, GOLD, a, { bold: true });
  }
  // 第 2 行：拆成两项
  const y2 = 470, f1 = [['cos h − 1', INNER]], f2 = [['sin h', INNER]], dn = [['h', CR]], fs = sz * 0.86;
  if (t > S('C02')) {
    mathText('= sin x ·', x0, y2, sz, CR, { alpha: ap(t, 'C02', 0.05) });
    const xa = x0 + mathW('= sin x · ', sz); frac(f1, dn, xa, y2 - 8, fs, ap(t, 'C02', 0.15));
    const xb = xa + fracW(f1, dn, fs) + 14; mathText('+ cos x ·', xb, y2, sz, CR, { alpha: ap(t, 'C02', 0.5) });
    const xc = xb + mathW('+ cos x · ', sz); frac(f2, dn, xc, y2 - 8, fs, ap(t, 'C02', 0.6));
    // C03：两个极限
    const lim = [[xa + fracW(f1, dn, fs) / 2, '→ 0', P('C03', 0.45)], [xc + fracW(f2, dn, fs) / 2, '→ 1', P('C03', 0.7)]];
    lim.forEach(([cx, s, t0]) => {
      if (t < t0) return; const a = eOut(prog(t, t0, 0.35));
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GRN; ctx.lineWidth = 2.5; ctx.shadowColor = GRN; ctx.shadowBlur = 10; rr(cx - 95, y2 - 50, 190, 112, 12); ctx.stroke(); ctx.restore();
      arrowV(cx, y2 + 70, y2 + 120, GRN, a); mathText(s, cx, y2 + 165, 40, GRN, { align: 'center', alpha: a, glow: 12, upright: true });
    });
    if (t > P('C03', 0.1)) label('上一章见过的两个极限', 980, 720, 26, GRN, ap(t, 'C03', 0.1), { bold: true });
  }
  // C04：只剩 cos x
  if (t > S('C04')) {
    const p = eBack(prog(t, P('C04', 0.3), 0.5)); panel(700, 770, 560, 120, OUTER, clamp(p));
    ctx.save(); ctx.translate(980, 848); ctx.scale(p, p); mathRich([['(sin x)′ = ', OUTER], ['cos x', GRN]], 0, 0, 54, { align: 'center', glow: 18, upright: true }); ctx.restore();
  }
};

// ======================= graph（A94） =======================
const G1 = { cx: 700, cy: 400, ux: 82, uy: 105, x0: -0.2, x1: 7.6, y0: -1.3, y1: 1.3 };
const G2 = { cx: 700, cy: 760, ux: 82, uy: 105, x0: -0.2, x1: 7.6, y0: -1.3, y1: 1.3 };
SC.graph = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G01', 0.02);
  gAxes(G1, a, { grid: false, xl: 'x' }); gAxes(G2, a, { grid: false, xl: 'x' });
  gPlot(G1, Math.sin, OUTER, { a, w: 5 });
  mathText('y = sin x', gx(G1, 5.2), gy(G1, 1.15), 30, OUTER, { alpha: a, glow: 10, upright: true });
  label('每一点的斜率', gx(G2, 5.6), gy(G2, 1.25), 24, GRN, a, { bold: true });
  const p = prog(t, P('G01', 0.15), D('G01') * 0.6), xs = lerp(0, 7.4, p);
  if (p > 0) {
    const m = Math.cos(xs); gLine(G1, m, xs, Math.sin(xs), xs - 0.9, xs + 0.9, INV, a, 3.5); gDot(G1, xs, Math.sin(xs), GOLD, a);
    seg(gx(G1, xs), gy(G1, Math.sin(xs)), gx(G2, xs), gy(G2, m), 'rgba(237,230,216,0.5)', a * 0.6, 1.5, [5, 6]);
    gPlot(G2, Math.cos, GRN, { a, w: 4.5, xa: 0, xb: 7.4, p });
    ratioTag('斜率 ' + m.toFixed(2), 1290, 250, INV, a * (p < 1 ? 1 : 0.6), { size: 26 });
  }
  if (t > P('G01', 0.8)) { gPlot(G2, Math.cos, CYAN, { a: ap(t, 'G01', 0.8) * 0.9, w: 2, dash: [8, 8], noHead: true }); glowText('正好是 cos x', gx(G2, 4.0), gy(G2, -1.15) + 70, 34, GRN, t, P('G01', 0.82), { out: E('G01') + 1.0 }); }
};

// ======================= table（A95） =======================
const TROWS = [['(sin x)′ = cos x', OUTER], ['(cos x)′ = −sin x', OUTER], ['(tan x)′ = sec^2 x', GOLD], ['(cot x)′ = −csc^2 x', CR], ['(sec x)′ = sec x tan x', CR], ['(csc x)′ = −csc x cot x', CR]];
SC.table = t => {
  starfield(t); blueprint(0.4, 80);
  const tabX = 640, tabY = 250, lh = 66, move = eIO(prog(t, S('C06'), 0.6));
  const litT = [S('C05') - 0.2, P('C05', 0.1), P('C05', 0.85), P('C06', 0.3), P('C06', 0.45), P('C06', 0.6)];
  panel(tabX - 20, tabY - 50, lerp(380, 500, move), 6 * lh + 40, CR, ap(t, 'C05', 0, 0.3));
  TROWS.forEach(([s, c], i) => { if (t < litT[i]) return; mathText(s, tabX, tabY + i * lh, 32, c, { alpha: eOut(prog(t, litT[i], 0.35)), glow: 8 }); });
  // 商法则推 tan（C05 中段，C06 时淡出）
  const qa = ap(t, 'C05', 0.3) * fadeOut(t, P('C06', 0.15), 0.4);
  if (qa > 0) {
    const x = 1060, y = 330, sz = 30;
    mathText('tan x = ', x, y, sz, CR, { alpha: qa }); frac([['sin x', OUTER]], [['cos x', OUTER]], x + mathW('tan x = ', sz), y - 6, sz * 0.86, qa);
    label('商法则', x + 100, y + 80, 22, GOLD, ap(t, 'C05', 0.45) * qa, { bold: true });
    if (t > P('C05', 0.5)) { mathText('(tan x)′ =', x, y + 170, sz, CR, { alpha: ap(t, 'C05', 0.5) * qa }); frac([['cos^2 x + sin^2 x', CR]], [['cos^2 x', CR]], x, y + 230, sz * 0.8, ap(t, 'C05', 0.55) * qa); }
    if (t > P('C05', 0.72)) { mathText('= sec^2 x', x + 60, y + 340, 40, GOLD, { alpha: ap(t, 'C05', 0.72) * qa, glow: 14 }); label('分子 = 1', x + 230, y + 250, 22, GRN, ap(t, 'C05', 0.65) * qa, { bold: true }); }
  }
  if (t > P('C06', 0.3)) { label('推法一样：写成 sin、cos 的商', 1180, 700, 24, CR, ap(t, 'C06', 0.3), { bold: true }); [3, 4, 5].forEach(i => checkMark(tabX + 480, tabY + i * lh - 10, 18, GRN, t, litT[i] + 0.2)); }
};

// ======================= cycle（A96） =======================
const CY = { x: 960, y: 560, R: 210 };
const CELLS = ['sin x', 'cos x', '−sin x', '−cos x'];
const cellXY = k => { const an = -PI / 2 + (k % 4) * PI / 2; return [CY.x + Math.cos(an) * CY.R * 1.25, CY.y + Math.sin(an) * CY.R]; };
function bunny(x, y, s, col, a = 1, flip = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * flip, s);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = col; ctx.lineWidth = 3 / s; ctx.shadowColor = col; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 20, 0, 0, 7); ctx.fill(); ctx.stroke();               // 身
  ctx.beginPath(); ctx.ellipse(22, -18, 15, 13, 0, 0, 7); ctx.fill(); ctx.stroke();            // 头
  [[16, -2.0], [27, -1.75]].forEach(([ex, r]) => { ctx.save(); ctx.translate(ex, -28); ctx.rotate(r + PI / 2); ctx.beginPath(); ctx.ellipse(0, -14, 5, 15, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }); // 耳
  ctx.beginPath(); ctx.arc(-26, -4, 7, 0, 7); ctx.fill(); ctx.stroke();                        // 尾
  ctx.shadowBlur = 0; ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(27, -20, 2.4, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(36, -15, 2.4, 0, 7); ctx.fill();
  ctx.restore();
}
// 兔子位置（格数，可为小数）：T01 演示一圈；T02 快转 6 圈；再跳 3 格
function hops(t) {
  let h = 0;
  [0.3, 0.45, 0.6, 0.75].forEach(f => h += eIO(prog(t, P('T01', f), 0.28)));
  h += 24 * eIO(prog(t, P('T02', 0.42), 0.32 * D('T02')));
  [0.78, 0.86, 0.94].forEach(f => h += eIO(prog(t, P('T02', f), 0.12 * D('T02'))));
  return h;
}
function cycleBoard(t, a, hl, start, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a * 0.5; ctx.strokeStyle = TC; ctx.lineWidth = 2.5; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.ellipse(CY.x, CY.y, CY.R * 1.25, CY.R, 0, 0, 7); ctx.stroke(); ctx.restore();
  CELLS.forEach((s, k) => {
    const [x, y] = cellXY(k), on = k === hl, st = k === start;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = on ? hexA(GOLD, 0.22) : 'rgba(12,18,38,0.92)'; ctx.strokeStyle = on ? GOLD : st ? GRN : hexA(TC, 0.8); ctx.lineWidth = on ? 4 : 2.5; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = on ? 22 : 8;
    rr(x - 100, y - 46, 200, 92, 16); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText(s, x, y + 12, 36, on ? GOLD : CR, { align: 'center', alpha: a, glow: on ? 14 : 4, upright: true });
    if (st && o.startLab) label('起点', x - 140, y, 22, GRN, a, { bold: true });
  });
  // 求导箭头
  for (let k = 0; k < 4; k++) { const an = -PI / 2 + k * PI / 2 + PI / 4, x = CY.x + Math.cos(an) * CY.R * 1.4, y = CY.y + Math.sin(an) * CY.R * 1.15; label('′', x, y, 40, GRN, a * 0.8, { font: F_MATH, bold: true }); }
}
SC.cycle = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('T01')) { kinetic('第 27 阶导数 = ?', CX, 470, 64, t, P('D02', 0.15), { col: GOLD }); [...Array(27)].forEach((_, i) => { const p = ap(t, 'D02', 0.4 + i * 0.015, 0.2); label('′', 640 + i * 26, 600, 40, GRN, p, { font: F_MATH }); }); return; }
  const a = ap(t, 'T01', 0.02), g2 = t > S('G02');
  const h = hops(t), cell = Math.floor(h + 1e-6) % 4, fr = h - Math.floor(h + 1e-6);
  // 兔子
  const startCell = g2 ? 1 : 0;
  let bx, by;
  if (!g2) {
    const [x0, y0] = cellXY(cell), [x1, y1] = cellXY(cell + 1); bx = lerp(x0, x1, fr); by = lerp(y0, y1, fr) - 70 - Math.sin(PI * fr) * 90;
  } else {
    const q = [0.35, 0.5, 0.65].reduce((s, f) => s + eIO(prog(t, P('G02', f), 0.18)), 0), c2 = 1 + Math.floor(q + 1e-6), f2 = q - Math.floor(q + 1e-6);
    const [x0, y0] = cellXY(c2), [x1, y1] = cellXY(c2 + 1); bx = lerp(x0, x1, f2); by = lerp(y0, y1, f2) - 70 - Math.sin(PI * f2) * 90;
  }
  const hl = g2 ? (t > P('G02', 0.75) ? 0 : -1) : (t > P('C07', 0.2) ? 3 : -1);
  cycleBoard(t, a, hl, t > P('T02', 0.2) ? startCell : -1, { startLab: true });
  bunny(bx, by, 1.1, TC, a);
  // 圈数与步数
  if (t > S('T02')) {
    const h2 = Math.max(0, h - 4), laps = Math.min(6, Math.floor(clamp(h2, 0, 24) / 4 + 1e-6)), done = h2 >= 26.99;
    mathText('27 = 4 × 6 + 3', CY.x, 240, 42, CR, { align: 'center', alpha: ap(t, 'T02', 0.05) * (g2 ? fadeOut(t, S('G02'), 0.3) : 1), glow: 10, upright: true });
    if (!g2) { label('第 ' + Math.max(0, Math.min(6, laps)) + ' 圈', CY.x, CY.y - 20, 34, TC, ap(t, 'T02', 0.42), { bold: true }); label('再跳 ' + (h2 > 24 ? Math.min(3, Math.floor(h2 - 24 + 0.5)) : 0) + ' 格', CY.x, CY.y + 30, 26, GOLD, ap(t, 'T02', 0.76), { bold: true }); }
    if (done && !g2 && t > P('C07', 0.2)) stampMark(CY.x, CY.y + 4, 64, t, P('C07', 0.55), { text: '−cos x', col: GOLD, rot: -0.12 });
  }
  if (g2) { richReveal([['课本：(cos x)^{(27)} = ', CR], ['sin x', GOLD]], CX, 240, 40, t, P('G02', 0.05), { upright: true }); label('从 cos x 起跳 3 格', CY.x, CY.y, 30, GRN, ap(t, 'G02', 0.2), { bold: true }); }
  if (t > S('D03')) glowText('跳格子 ≫ 求 27 次导', CX, 900, 34, TC, t, P('D03', 0.2));
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.4, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 300);
  richReveal([['(sin x)^{(6)}', OUTER], ['  = ?', CR]], CX - 60, 230, 50, t, P('C09', 0.1), { upright: true });
  const a = ap(t, 'C09', 0.3), q = [0.35, 0.55].reduce((s, f) => s + eIO(prog(t, P('T03', f), 0.2)), 0);
  const c = Math.floor(q + 1e-6), f = q - c, [x0, y0] = cellXY(c), [x1, y1] = cellXY(c + 1);
  cycleBoard(t, a, t > P('T03', 0.8) ? 2 : -1, 0, { startLab: true });
  bunny(lerp(x0, x1, f), lerp(y0, y1, f) - 70 - Math.sin(PI * f) * 90, 1.1, TC, a);
  if (t > S('T03')) { mathText('6 = 4 + 2', CY.x, CY.y + 12, 38, CR, { align: 'center', alpha: ap(t, 'T03', 0.1), glow: 10, upright: true }); checkMark(cellXY(2)[0] + 140, cellXY(2)[1], 26, GRN, t, P('T03', 0.85)); }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C11'), 0.4);
  if (pa > 0) {
    richReveal([['和角公式', GOLD], [' + ', CR], ['两个极限', GRN], ['  ⟹  (sin x)′ = cos x', OUTER]], CX, 360, 40, t, P('C10', 0.1), { alpha: pa, upright: true });
    const ca = ap(t, 'C10', 0.55) * pa;
    CELLS.forEach((s, k) => { const x = 700 + k * 175; panel(x - 75, 480, 150, 80, TC, ca); mathText(s, x, 532, 30, CR, { align: 'center', alpha: ca, upright: true }); if (k < 3) arrowH(x + 80, x + 98, 520, GRN, ca, 3); });
    label('四步一圈', CX, 640, 34, TC, ca, { bold: true });
  }
  if (t > S('C11') - 0.1) {
    const a = ap(t, 'C11', 0.15), ch = gearChain(900, 500, [{ n: 24, col: OUTER }, { n: 12, col: INNER }], 6, [0]);
    drawChain(ch, t * 0.6, 6, a);
    glowText('下一段：链式法则', CX, 720, 50, CR, t, P('C11', 0.3));
  }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 3 章 · P3 三角函数的导数', '下一段：链式法则', [...CREDIT_BASE,
    'MiMo 娘立绘：依据 甶丶 的 MiMo 拟人设定（CC BY-NC）由 AI 生成的本课差分。',
    'MiMo 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、MiMo 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'pop', 0.24); s('D01', 0.55, 'stamp', 0.28); s('C01', 0.03, 'type', 0.16); s('C01', 0.4, 'swoosh_in', 0.16);
  s('C02', 0.05, 'type', 0.14); s('C02', 0.6, 'type', 0.14); s('C03', 0.45, 'ding_lo', 0.22); s('C03', 0.7, 'ding', 0.22); s('C04', 0.3, 'ding_hi', 0.28);
  s('G01', 0.15, 'riser', 0.12); s('G01', 0.82, 'shimmer', 0.2);
  s('C05', 0.1, 'pop', 0.2); s('C05', 0.5, 'type', 0.14); s('C05', 0.72, 'ding', 0.24); s('C06', 0.3, 'tick', 0.16); s('C06', 0.45, 'tick', 0.16); s('C06', 0.6, 'tick', 0.16);
  s('D02', 0.15, 'pop', 0.24); [0.3, 0.45, 0.6, 0.75].forEach(f => s('T01', f + 0.1, 'marimba', 0.22));
  for (let k = 0; k < 6; k++) sfx(P('T02', 0.42) + (k + 0.9) * 0.32 * D('T02') / 6, 'tick2', 0.16);
  [0.78, 0.86, 0.94].forEach(f => s('T02', f + 0.05, 'marimba_hi', 0.24)); s('C07', 0.55, 'stamp', 0.3);
  [0.35, 0.5, 0.65].forEach(f => s('G02', f + 0.08, 'marimba', 0.22)); s('G02', 0.75, 'ding', 0.22); s('D03', 0.2, 'sparkle', 0.2);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); [0.35, 0.55].forEach(f => s('T03', f + 0.08, 'marimba', 0.22)); s('T03', 0.85, 'check', 0.28);
  s('C10', 0.1, 'type', 0.14); s('C10', 0.55, 'pop', 0.22); s('C11', 0.15, 'hum', 0.16); s('C11', 0.3, 'swell', 0.3);
})();
finalize();
