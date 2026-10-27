// 第 2 章 P8《导函数与可导性》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A72 斜率追踪器边走边画 f′ · A73 可导性放大镜（Grok 一斧劈出尖角）· A74 三种不可导图鉴 · A75 积法则面积矩形 · A76 位置-速度-加速度三联图
const SC = {};
const TITLES = [['deriv', '导函数'], ['diff', '可导与不可导'], ['high', '高阶导数'], ['rules', '求导法则：为什么'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= deriv：A72 =======================
const TOP = { cx: 660, cy: 440, ux: 105, uy: 110, x0: 0, x1: 6.5, y0: -1.4, y1: 1.4 };
const BOT = { cx: 660, cy: 780, ux: 105, uy: 110, x0: 0, x1: 6.5, y0: -1.4, y1: 1.4 };
const f1 = x => Math.sin(x), d1 = x => Math.cos(x);
SC.deriv = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C01')) { kinetic('把每一点的斜率连起来', CX, 470, 54, t, P('D01', 0.2), { col: CR }); return; }
  const ta = ap(t, 'C01', 0.05), ba = ap(t, 'C01', 0.4);
  gAxes(TOP, ta, { grid: false }); gPlot(TOP, f1, RED, { a: ta });
  label('f(x)', 1330, 300, 30, RED, ta, { align: 'right', font: F_MATH });
  gAxes(BOT, ba, { grid: false }); label('f′(x)', 1330, 650, 30, GRN, ba, { align: 'right', font: F_MATH });
  richReveal([["f′(x)", GRN], ['  =  ', CR], ['dy/dx', GRN]], CX, 232, 34, t, P('C01', 0.55), { upright: true });
  const p = t < S('C02') ? 0 : prog(t, P('C02', 0.2), Math.max(1, E('C03') - P('C02', 0.2) - 0.3)), x = lerp(0.05, 6.45, p);
  if (t > S('C02')) {
    gPlot(BOT, d1, GRN, { a: ba, xa: 0.05, xb: x, noHead: true });
    const m = d1(x), dx = 0.7; ctx.save(); gClip(TOP); seg(gx(TOP, x - dx), gy(TOP, f1(x) - m * dx), gx(TOP, x + dx), gy(TOP, f1(x) + m * dx), INV, 1, 3.5); ctx.restore();
    gDot(TOP, x, f1(x), INV, 1); gDot(BOT, x, m, GRN, 1);
    seg(gx(TOP, x), gy(TOP, f1(x)), gx(BOT, x), gy(BOT, m), CR, 0.25, 1.5, [4, 6]);
    label(`斜率 ${m.toFixed(2)}`, gx(TOP, x), gy(TOP, f1(x)) - 40, 24, INV, 1, { bold: true });
  }
  if (t > S('C03')) {
    [Math.PI / 2, 3 * Math.PI / 2].forEach((xx, k) => { const a = ap(t, 'C03', 0.6 + 0.1 * k); gDot(TOP, xx, f1(xx), GOLD, a); gDot(BOT, xx, 0, GOLD, a); label(k ? '山谷' : '山顶', gx(TOP, xx), gy(TOP, f1(xx)) + (k ? 40 : -40), 24, GOLD, a, { bold: true }); });
    label('上坡 → 上方', gx(BOT, 0.8), gy(BOT, 1.25), 24, GRN, ap(t, 'C03', 0.1), { bold: true }); label('下坡 → 下方', gx(BOT, 3.1), gy(BOT, -1.25), 24, GRN, ap(t, 'C03', 0.35), { bold: true });
  }
};

// ======================= diff：A73 / A74 =======================
const GD = { cx: 870, cy: 820, ux: 110, uy: 110, x0: -2.1, x1: 2.1, y0: -0.2, y1: 2.6 };
const EPS = t => kf(t, 0.9, [[P('X01', 0.45), 0, 0.12]]);
const fs = (x, e) => Math.sqrt(x * x + e * e) - e + 0.3;
function lens(t, e, a) {
  if (a <= 0) return; const cx = 1210, cy = 460, R = 140, k = 6;   // 放大 6 倍看 x = 0 附近
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = 'rgba(8,12,26,0.92)'; ctx.fill(); ctx.clip();
  ctx.strokeStyle = 'rgba(237,230,216,0.15)'; ctx.lineWidth = 1; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx + i * 45, cy - R); ctx.lineTo(cx + i * 45, cy + R); ctx.stroke(); }
  glowPath(() => { for (let i = 0; i <= 80; i++) { const x = -0.35 + 0.7 * i / 80, y = fs(x, e) - fs(0, e); const X = cx + x * 110 * k, Y = cy + 40 - y * 110 * k; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, RED, 4, 1);
  ctx.restore(); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
  label('放大 ×6', cx, cy + R + 28, 24, GOLD, a, { bold: true });
}
const MINI = [
  { name: '尖角 |x|', f: x => Math.abs(x) },
  { name: '尖点 x 的 2/3 次方', f: x => Math.cbrt(x * x) },
  { name: '竖直切线 ∛x', f: x => Math.cbrt(x) },
];
SC.diff = t => {
  starfield(t); blueprint(0.45, 80);
  const e = EPS(t), ma = fadeOut(t, S('C06'), 0.4);
  if (ma > 0) {
    gAxes(GD, ma, { grid: false });
    gPlot(GD, x => fs(x, e), RED, { a: ma, n: 600 });
    lens(t, e, ma * ap(t, 'C04', 0.3));
    if (t < S('X01')) label('光滑 → 放大像直线', 1210, 270, 28, GRN, ap(t, 'C04', 0.5), { bold: true });
    // 斧光
    const sl = prog(t, P('X01', 0.4), 0.18), fl = win(t, P('X01', 0.4), P('X01', 0.4) + 0.5, 0.12);
    if (fl > 0) { ctx.save(); ctx.globalAlpha *= fl; ctx.strokeStyle = '#fff'; ctx.shadowColor = SQ.X.col; ctx.shadowBlur = 30; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(gx(GD, -0.9), gy(GD, 2.5)); ctx.lineTo(lerp(gx(GD, -0.9), gx(GD, 0.9), sl), lerp(gy(GD, 2.5), gy(GD, -0.1), sl)); ctx.stroke(); ctx.restore(); }
    if (t > S('X02')) label('放大还是尖角', 1210, 270, 28, RED, ap(t, 'X02', 0.3), { bold: true });
    if (t > S('C05')) {
      label('斜率 −1', gx(GD, -1.2) - 10, gy(GD, 1.5), 28, CYAN, ap(t, 'C05', 0.3), { bold: true }); label('斜率 1', gx(GD, 1.2) + 10, gy(GD, 1.5), 28, GRN, ap(t, 'C05', 0.4), { bold: true });
      stampMark(gx(GD, 0), gy(GD, 0.3) + 70, 44, t, P('C05', 0.6), { text: '不可导', rot: -0.15 });
    }
  }
  if (t > S('C06') - 0.1) {
    MINI.forEach((d, k) => {
      const a = ap(t, 'C06', [0, 0.2, 0.62][k]) * fadeOut(t, S('C07'), 0.4); if (a <= 0) return;
      const x = 640 + 240 * k, G = { cx: x + 110, cy: 560, ux: 70, uy: 90, x0: -1.5, x1: 1.5, y0: k === 2 ? -1.3 : -0.2, y1: 1.4 };
      panel(x, 250, 220, 420, k ? INV : RED, a, 'rgba(12,18,38,0.6)');
      gAxes(G, a * 0.7, { grid: false }); gPlot(G, d.f, RED, { a, n: 600 });
      if (k === 2) gV(G, 0, GOLD, a, { ya: -1, yb: 1, dash: [6, 6], w: 3 });
      label(d.name, x + 110, 290, 22, CR, a, { bold: true });
    });
  }
  if (t > S('C07') - 0.1) {
    const a = ap(t, 'C07', 0.05);
    ctx.save(); ctx.globalAlpha *= a; ctx.lineWidth = 3;
    ctx.strokeStyle = CYAN; ctx.shadowColor = CYAN; ctx.shadowBlur = 10; ctx.beginPath(); ctx.ellipse(980, 560, 330, 230, 0, 0, 7); ctx.stroke();
    ctx.strokeStyle = GRN; ctx.shadowColor = GRN; ctx.beginPath(); ctx.ellipse(1000, 600, 170, 120, 0, 0, 7); ctx.stroke(); ctx.restore();
    label('连续', 980, 380, 34, CYAN, a, { bold: true }); label('可导', 1000, 600, 34, GRN, ap(t, 'C07', 0.15), { bold: true });
    label('|x|', 780, 560, 30, RED, ap(t, 'C07', 0.4), { font: F_MATH }); label('不连续 → 不可导', 980, 840, 28, INV, ap(t, 'C07', 0.7), { bold: true });
    if (t > S('X03')) label('劈开了也还连着', 800, 660, 24, SQ.X.col, ap(t, 'X03', 0.3), { bold: true });
  }
};

// ======================= high：A76 =======================
const HP = [{ n: '位置 s', f: x => 3 * x * x - x * x * x, c: RED, y0: -1, y1: 4.6 }, { n: '速度 v = s′', f: x => 6 * x - 3 * x * x, c: GRN, y0: -9.5, y1: 3.8 }, { n: '加速度 a = s″', f: x => 6 - 6 * x, c: CYAN, y0: -12.5, y1: 6.5 }];
SC.high = t => {
  starfield(t); blueprint(0.45, 80);
  HP.forEach((d, k) => {
    const a = ap(t, 'C08', 0.1 + 0.25 * k); if (a <= 0) return; const x = 630 + 250 * k;
    const G = { cx: x + 20, cy: 0, ux: 60, uy: 300 / (d.y1 - d.y0), x0: 0, x1: 3.2, y0: d.y0, y1: d.y1 }; G.cy = 760 + G.uy * d.y0;
    panel(x, 360, 230, 440, d.c, a, 'rgba(12,18,38,0.6)');
    gAxes(G, a * 0.7, { grid: false }); gPlot(G, d.f, d.c, { a, p: prog(t, P('C08', 0.1 + 0.25 * k), 0.6) });
    label(d.n, x + 115, 400, 26, d.c, a, { bold: true });
    if (k) label('求导 →', x - 10, 330, 22, CR, a, { bold: true });
  });
  label('二阶导数：导数的导数', CX, 270, 36, GOLD, ap(t, 'C08', 0.75), { bold: true });
};

// ======================= rules：A75 =======================
SC.rules = t => {
  starfield(t); blueprint(0.45, 80);
  const x0 = 700, y0 = 820, U = 360, V = 260, g = eOut(prog(t, P('C09', 0.55), 0.6)) * 70, ra = ap(t, 'C09', 0.3) * fadeOut(t, S('C11'), 0.4);
  if (ra > 0) {
    ctx.save(); ctx.globalAlpha *= ra;
    ctx.fillStyle = hexA(GOLD, 0.18); ctx.fillRect(x0, y0 - V, U, V); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.strokeRect(x0, y0 - V, U, V);
    ctx.fillStyle = hexA(CYAN, 0.3); ctx.fillRect(x0 + U, y0 - V, g, V);
    ctx.fillStyle = hexA(GRN, 0.3); ctx.fillRect(x0, y0 - V - g, U, g);
    ctx.fillStyle = hexA(INV, 0.5); ctx.fillRect(x0 + U, y0 - V - g, g, g);
    ctx.restore();
    label('u · v', x0 + U / 2, y0 - V / 2, 40, GOLD, ra, { font: F_MATH, bold: true });
    label('长 u', x0 + U / 2, y0 + 30, 30, CR, ra, { bold: true }); label('宽 v', x0 - 44, y0 - V / 2, 30, CR, ra, { bold: true });
    if (g > 5) { label('v·Δu', x0 + U + g + 60, y0 - V / 2, 28, CYAN, ra, { font: F_MATH, bold: true }); label('u·Δv', x0 + U / 2, y0 - V - g - 26, 28, GRN, ra, { font: F_MATH, bold: true }); label('ΔuΔv', x0 + U + g + 50, y0 - V - g - 20, 24, INV, ra, { font: F_MATH }); }
    if (t > S('C10')) {
      richReveal([['Δ(uv) ≈ ', GOLD], ['u·Δv', GRN], [' + ', CR], ['v·Δu', CYAN]], CX, 260, 40, t, P('C10', 0.1), { upright: true });
      richReveal([['(uv)′ = ', GOLD], ['u v′', GRN], [' + ', CR], ['v u′', CYAN]], CX, 340, 40, t, P('C10', 0.65), { upright: true });
      const xa = ap(t, 'C10', 0.45); if (xa > 0) { seg(x0 + U, y0 - V - g, x0 + U + g, y0 - V, RED, xa, 4); seg(x0 + U + g, y0 - V - g, x0 + U, y0 - V, RED, xa, 4); }
    }
  }
  if (t > S('C11') - 0.1) {
    richReveal([['(u/v)′ = ', GOLD], ['(u′v − uv′) / v^2', CR]], CX, 400, 44, t, P('C11', 0.1), { upright: true });
    label('← 由乘积法则推出', CX, 480, 28, CYAN, ap(t, 'C11', 0.25), { bold: true });
    richReveal([['(x^n)′ = ', GOLD], ['n x^{n−1}', GRN]], CX, 620, 48, t, P('C11', 0.55), { upright: true });
  }
};

// ======================= quiz =======================
const GQ = { cx: 760, cy: 840, ux: 110, uy: 110, x0: -1, x1: 3.2, y0: -0.2, y1: 2.4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C12', 0, 0.5) * 0.45, 78);
  if (t < S('C13')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C12') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 360);
  richReveal([['|x − 1|', RED], ['  在 x = 1 处可导吗？', CR]], CX - 60, 280, 46, t, P('C13', 0.1), { upright: true });
  if (t > S('X04')) {
    const ga = ap(t, 'X04', 0.05); gAxes(GQ, ga, { grid: false, ticks: { x: [[1, '1']] } }); gPlot(GQ, x => Math.abs(x - 1), RED, { a: ga });
    label('−1', gx(GQ, 0.2), gy(GQ, 1.2), 28, CYAN, ap(t, 'X04', 0.3), { font: F_MATH, bold: true }); label('1', gx(GQ, 2.2), gy(GQ, 1.6), 28, GRN, ap(t, 'X04', 0.4), { font: F_MATH, bold: true });
    stampMark(1220, 640, 54, t, P('X04', 0.7), { text: '不可导', rot: -0.15 });
  }
};

// ======================= outro =======================
const CARDS = [['导函数', '斜率连成线', GRN], ['可导 ⇒ 连续', '反过来不行', CYAN], ['不可导', '尖角 · 尖点 · 竖直', RED]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C15'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C14', 0.1 + 0.25 * k), 0.4)) * ca; if (p <= 0) return; const x = 720 + 260 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-115, -100, 230, 200, c, 1); ctx.restore();
    label(h, x, 495, 30, c, clamp(p), { bold: true }); label(s, x, 560, 22, CR, clamp(p));
  });
  if (t > S('C15') - 0.1) { glowText('下一段：全章收束 · 出口票', CX, 500, 54, CR, t, P('C15', 0.15)); glowText('豆包主持', CX, 590, 32, SQ.B.col, t, P('C15', 0.45), { bold: false }); }
  credits(t, E('C15') + 0.38, 'AI娘微积分课 · 第 2 章 · P8 导函数与可导性', '下一段：全章收束', [...CREDIT_BASE,
    'Grok 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
    'Grok 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、DeepSeek、Grok 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C15') + 0.25) lecturer(t, 'C', 255, -5, E('C15') + 0.48, { h: 710 }); };
SC.__noTag = E('C15') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C15') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.2, 'pop', 0.24); s('C01', 0.05, 'swoosh_in', 0.2); s('C01', 0.55, 'type', 0.16);
  s('C02', 0.2, 'riser', 0.12); s('C03', 0.6, 'ding', 0.24); s('C03', 0.7, 'ding_lo', 0.24);
  s('C04', 0.3, 'swoosh_in', 0.2); s('X01', 0.4, 'zap', 0.3); s('X01', 0.42, 'impact', 0.34); s('X02', 0.3, 'glitch', 0.18);
  s('C05', 0.3, 'pop', 0.22); s('C05', 0.4, 'pop', 0.22); s('C05', 0.6, 'stamp', 0.3);
  s('C06', 0.0, 'marimba_lo', 0.26); s('C06', 0.2, 'marimba', 0.26); s('C06', 0.62, 'marimba_hi', 0.26);
  s('C07', 0.05, 'swell', 0.2); s('C07', 0.7, 'buzz', 0.16); s('X03', 0.2, 'pluck', 0.22);
  [0.1, 0.35, 0.6].forEach(f => s('C08', f, 'pop', 0.22)); s('C08', 0.75, 'ding', 0.24);
  s('C09', 0.3, 'swoosh_in', 0.2); s('C09', 0.55, 'shimmer', 0.18); s('C10', 0.1, 'type', 0.16); s('C10', 0.45, 'zap', 0.18); s('C10', 0.65, 'ding_hi', 0.28);
  s('C11', 0.1, 'type', 0.16); s('C11', 0.55, 'type', 0.16);
  s('C12', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('X04', 0.7, 'stamp', 0.32);
  [0.1, 0.35, 0.6].forEach(f => s('C14', f, 'pop', 0.24)); s('C15', 0.15, 'swell', 0.3);
})();
finalize();
