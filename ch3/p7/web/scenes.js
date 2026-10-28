// 第 3 章 P7《指数增长与衰减》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A109 斜率场：每一点的斜率等于 k 乘高度 · A110 人口曲线拟合两个数据点并外推 · A111 半衰期阶梯（16 个原子逐次减半）· 千问的连续复利金币
const SC = {};
const TITLES = [['law', '变化率 ∝ 大小'], ['people', '世界人口'], ['decay', '衰减与半衰期'], ['money', '连续复利'], ['quiz', '随堂一题'], ['outro', '小结']];
const QC = SQ.Q.col;

// ======================= law（A109） =======================
const GW = { cx: 680, cy: 850, ux: 110, uy: 85, x0: -0.1, x1: 6.2, y0: -0.2, y1: 7.0 };
function slopeField(G, k, a) {
  if (a <= 0) return;
  for (let i = 0; i <= 12; i++) for (let j = 1; j <= 13; j++) {
    const x = 0.25 + i * 0.5, y = j * 0.5, m = k * y, L = 0.17, dx = L / Math.sqrt(1 + (m * G.uy / G.ux) ** 2);
    seg(gx(G, x - dx), gy(G, y - m * dx), gx(G, x + dx), gy(G, y + m * dx), 'rgba(92,200,232,0.55)', a, 2);
  }
}
SC.law = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01')) { [['细菌', 760], ['利息', 1180]].forEach(([s, x], k) => { const p = ap(t, 'D01', 0.1 + k * 0.4); label(s + ' ↑ → 增长更快', x, 460, 32, k ? GOLD : GRN, p, { bold: true }); }); kinetic('有公式吗？', CX, 640, 56, t, P('D01', 0.75), { col: CR }); return; }
  const k = lerp(0.5, -0.5, eIO(prog(t, P('C02', 0.35), 0.8))), a = ap(t, 'C01', 0.05);
  gAxes(GW, a, { grid: false, xl: 't', yl: 'y' });
  slopeField(GW, k, ap(t, 'C01', 0.4));
  [0.5, 1, 2, 3.5].forEach((y0, i) => gPlot(GW, x => y0 * Math.exp(k * x), k > 0 ? GRN : RED, { a: ap(t, 'C01', 0.55 + i * 0.08), w: 3.5, p: prog(t, P('C01', 0.55 + i * 0.08), 0.6) }));
  richReveal([['dy/dt = ky', GOLD]], 1150, 280, 44, t, P('C01', 0.1), { upright: false });
  richReveal([['y = y₀ e^{kt}', GOLD]], 1150, 370, 44, t, P('C01', 0.55));
  if (t > S('C02')) { ratioTag('k = ' + k.toFixed(2), 1150, 480, k > 0 ? GRN : RED, ap(t, 'C02', 0.05), { size: 32 }); label(k > 0 ? '增长' : '衰减', 1150, 560, 34, k > 0 ? GRN : RED, ap(t, 'C02', 0.05), { bold: true }); label('斜率 = k × 高度', 1150, 640, 26, CYAN, ap(t, 'C02', 0.7), { bold: true }); }
};

// ======================= people（A110） =======================
const GPOP = { cx: 640, cy: 860, ux: 8.2, uy: 6.2, x0: 0, x1: 85, y0: 0, y1: 98 };   // x = 年份 − 1950，y = 亿
const KP = Math.log(30.4 / 25.6) / 10, pop = s => 25.6 * Math.exp(KP * s);
SC.people = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C03', 0.02);
  gAxes(GPOP, a, { grid: false, ticks: { x: [[0, '1950'], [30, '1980'], [70, '2020']], y: [[25.6, '25.6'], [50, '50'], [85, '85']] } });
  label('世界人口（亿）', gx(GPOP, 2), gy(GPOP, 96), 22, CR, a * 0.8, { align: 'left' });
  if (t > P('C03', 0.3)) gDot(GPOP, 0, 25.6, GOLD, ap(t, 'C03', 0.3));
  if (t > P('C03', 0.7)) gDot(GPOP, 10, 30.4, GOLD, ap(t, 'C03', 0.7));
  if (t > S('C04')) {
    gPlot(GPOP, pop, GRN, { a: ap(t, 'C04', 0.1), xa: 0, xb: 10, p: prog(t, P('C04', 0.1), 0.5), w: 5 });
    richReveal([['30.4 / 25.6 = 1.1875', CR]], 860, 300, 32, t, P('C04', 0.1), { upright: true });
    richReveal([['k = ln 1.1875 / 10 ≈ 0.017', GOLD]], 860, 370, 32, t, P('C04', 0.45), { upright: true });
    ratioTag('每年 ≈ 1.7%', 860, 450, GRN, ap(t, 'C04', 0.8), { size: 30 });
  }
  if (t > S('G01')) {
    gPlot(GPOP, pop, GRN, { a: ap(t, 'G01', 0.05), xa: 10, xb: 75, p: prog(t, P('G01', 0.05), 0.9), w: 3.5, dash: [10, 8] });
    if (t > P('G01', 0.3)) { gDot(GPOP, 70, pop(70), GRN, ap(t, 'G01', 0.3)); label('预测 ≈ 85 亿', gx(GPOP, 70) - 20, gy(GPOP, pop(70)) - 34, 24, GRN, ap(t, 'G01', 0.3), { bold: true, align: 'right' }); }
    if (t > P('G01', 0.6)) { gDot(GPOP, 70, 78, RED, ap(t, 'G01', 0.6)); label('真实 ≈ 78 亿', gx(GPOP, 70) + 20, gy(GPOP, 78) + 30, 24, RED, ap(t, 'G01', 0.6), { bold: true, align: 'left' }); }
    if (t > P('G01', 0.8)) label('模型只是近似', 860, 530, 30, CR, ap(t, 'G01', 0.8), { bold: true });
  }
};

// ======================= decay（A111） =======================
const GDC = { cx: 660, cy: 820, ux: 120, uy: 440, x0: -0.05, x1: 5.3, y0: -0.05, y1: 1.15 };
SC.decay = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C05', 0.02);
  gAxes(GDC, a, { grid: false, xl: '半衰期数', ticks: { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], y: [[1, '1'], [0.5, '½']] } });
  gPlot(GDC, x => Math.pow(0.5, x), RED, { a, w: 3.5, p: prog(t, P('C05', 0.2), 0.8) });
  const st = [P('C05', 0.6), P('D02', 0.1), P('D02', 0.35), P('D02', 0.6)].reduce((s, t0) => s + eIO(prog(t, t0, 0.35)), 0);
  // 阶梯
  for (let k = 0; k < 5; k++) { const p = clamp(st - k + 1); if (k && p <= 0) continue; const h = Math.pow(0.5, k); ctx.save(); ctx.globalAlpha *= a * (k ? p : 1) * 0.35; ctx.fillStyle = GOLD; ctx.fillRect(gx(GDC, k), gy(GDC, h), GDC.ux * 0.92, h * GDC.uy); ctx.restore(); gH(GDC, h, GOLD, a * (k ? p : 1), { xa: k, xb: k + 0.92, w: 3 }); }
  // 16 个原子
  const n = Math.round(16 * Math.pow(0.5, st)), bx = 1080, by = 300;
  panel(bx - 30, by - 50, 300, 300, CR, a);
  for (let i = 0; i < 16; i++) { const r = i / 4 | 0, c = i % 4, x = bx + 30 + c * 60, y = by + 30 + r * 60, live = i < Math.max(1, 16 * Math.pow(0.5, st)); glowDot(x, y, 14, live ? GOLD : '#3a3a48', a * (live ? 1 : 0.6)); }
  label('剩 ' + (st < 0.5 ? '1' : '1/' + Math.round(Math.pow(2, Math.round(st)))), bx + 120, by + 290, 30, GOLD, a, { bold: true, font: F_MATH });
  if (t > S('D02')) label('一半 → 一半 → 再一半', 1170, 680, 28, RED, ap(t, 'D02', 0.1), { bold: true });
};

// ======================= money（千问） =======================
const GM = { cx: 660, cy: 840, ux: 26, uy: 120, x0: -0.5, x1: 26, y0: -0.1, y1: 4.6 };
function coin(x, y, r, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#E8B84A'; ctx.strokeStyle = '#FFE08A'; ctx.lineWidth = 2; ctx.shadowColor = GOLD; ctx.shadowBlur = 10; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.38, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
SC.money = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'Q01', 0.02), r = 0.06, p = prog(t, P('Q01', 0.2), D('Q01') * 0.75 + D('Q02') * 0.5);
  gAxes(GM, a, { grid: false, xl: '年', ticks: { x: [[10, '10'], [20, '20']], y: [[1, '本金']] } });
  gPlot(GM, x => Math.exp(r * x), GOLD, { a, w: 5, xa: 0, xb: 25, p });
  // 金币柱：每 2.5 年一根
  for (let i = 0; i <= 10; i++) { const x = i * 2.5; if (x > 25 * p) break; const h = Math.exp(r * x), nC = Math.round(h * 6); for (let c = 0; c < nC; c++) coin(gx(GM, x), gy(GM, 0) - 8 - c * (h * GM.uy - 8) / nC, 16, a * 0.9); }
  richReveal([['A = A₀ e^{rt}', GOLD]], 1150, 290, 46, t, P('Q01', 0.15));
  if (t > P('Q01', 0.6)) label('钱生钱的速度 = 钱 × r', 850, 330, 28, QC, ap(t, 'Q01', 0.6), { bold: true });
  if (t > S('Q02')) { label('第 1 章 · 复利与 e', 850, 395, 26, CR, ap(t, 'Q02', 0.1), { bold: true }); stampMark(860, 500, 60, t, P('Q02', 0.6), { text: '再买就是了～', col: QC, rot: -0.12 }); }
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.4, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 320);
  label('半衰期 10 年，40 年后还剩多少？', CX - 60, 240, 40, CR, ap(t, 'C07', 0.1), { bold: true });
  const a = ap(t, 'C07', 0.3), G = { cx: 680, cy: 840, ux: 140, uy: 420, x0: -0.05, x1: 4.6, y0: -0.05, y1: 1.15 };
  gAxes(G, a, { grid: false, ticks: { x: [[1, '10'], [2, '20'], [3, '30'], [4, '40']] } });
  const st = t > S('D03') ? [0.1, 0.25, 0.4, 0.55].reduce((s, f) => s + eIO(prog(t, P('D03', f), 0.2)), 0) : 0;
  for (let k = 0; k <= 4; k++) { if (k > st + 0.01) break; const h = Math.pow(0.5, k); gH(G, h, GOLD, a, { xa: k, xb: k + 0.92, w: 4 }); label(k ? '1/' + (1 << k) : '1', gx(G, k + 0.46), gy(G, h) - 24, 24, GOLD, a, { font: F_MATH, bold: true }); }
  if (t > P('D03', 0.7)) { richReveal([['(1/2)^4 = 1/16', GRN]], 1150, 560, 44, t, P('D03', 0.7), { upright: true }); checkMark(1150, 650, 28, GRN, t, P('D03', 0.9)); }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C09'), 0.4);
  if (pa > 0) {
    richReveal([['dy/dt = ky  ⟹  y = y₀ e^{kt}', GOLD]], CX, 380, 46, t, P('C08', 0.1), { alpha: pa });
    [['k > 0  增长', GRN, 800], ['k < 0  衰减', RED, 1160]].forEach(([s, c, x], i) => { const p = eBack(prog(t, P('C08', 0.5 + 0.2 * i), 0.4)) * pa; if (p <= 0) return; ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-140, -50, 280, 100, c, 1); ctx.restore(); label(s, x, 520, 30, c, clamp(p), { bold: true, font: F_MATH }); });
  }
  if (t > S('C09') - 0.1) {
    const a = ap(t, 'C09', 0.2), x0 = 760, y0 = 600, th = Math.PI / 2 - 0.35 - 0.25 * eIO(prog(t, P('C09', 0.3), 1.2));   // 梯子
    seg(700, y0, 1000, y0, CR, a, 3); seg(x0, 330, x0, y0, CR, a, 3);
    seg(x0 + Math.cos(th) * 270, y0, x0, y0 - Math.sin(th) * 270, GOLD, a, 6);
    glowText('下一段：相关变化率', CX + 100, 760, 48, CR, t, P('C09', 0.3));
  }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 3 章 · P7 指数增长与衰减', '下一段：相关变化率', [...CREDIT_BASE,
    '千问娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
    '千问声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、千问 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'pop', 0.22); s('D01', 0.5, 'pop', 0.22); s('C01', 0.1, 'type', 0.14); s('C01', 0.4, 'shimmer', 0.16); s('C01', 0.55, 'ding', 0.22); s('C02', 0.35, 'warp', 0.16);
  s('C03', 0.3, 'pluck', 0.22); s('C03', 0.7, 'pluck', 0.22); s('C04', 0.1, 'type', 0.14); s('C04', 0.45, 'type', 0.14); s('C04', 0.8, 'ding', 0.22); s('G01', 0.05, 'whoosh', 0.16); s('G01', 0.3, 'ding_hi', 0.22); s('G01', 0.6, 'buzz', 0.16);
  s('C05', 0.2, 'swoosh_in', 0.14); [P('C05', 0.6), P('D02', 0.1), P('D02', 0.35), P('D02', 0.6)].forEach(t0 => sfx(t0, 'marimba_lo', 0.24));
  s('Q01', 0.15, 'type', 0.14); for (let i = 0; i < 8; i++) sfx(P('Q01', 0.2) + i * 0.55, 'tinkle', 0.1); s('Q02', 0.6, 'stamp', 0.28); s('Q02', 0.65, 'sparkle', 0.2);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); [0.1, 0.25, 0.4, 0.55].forEach(f => s('D03', f, 'marimba_lo', 0.2)); s('D03', 0.9, 'check', 0.28);
  s('C08', 0.1, 'type', 0.14); s('C08', 0.5, 'pop', 0.2); s('C08', 0.7, 'pop', 0.2); s('C09', 0.3, 'swell', 0.3);
})();
finalize();
