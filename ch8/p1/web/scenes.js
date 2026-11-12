// 第 8 章 P1《速通：弧长、侧面积与压力》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A341 三张公式卡 · A342 三种微元并排（斜边 ds、转一圈的环带、一小条压力） · A343 算不出原函数 → 辛普森
const SC = {};
const TITLES = [['recall', '第 6 章三个公式'], ['idea', '同一个想法'], ['trap', '算不出原函数'], ['quiz', '随堂一题'], ['outro', '小结']];

const FORM1 = [['弧长', SQ.K.col, 'L = ∫ₐᵇ √(1 + f′(x)²) dx', 'K02'], ['侧面积', SQ.G.col, 'S = ∫ₐᵇ 2πf(x)√(1 + f′(x)²) dx', 'K03'], ['压力', CYAN, 'F = ∫ ρg·h(y)·w(y) dy', 'K04']];

// ======================= 三张公式卡（A341） =======================
SC.recall = t => {
  starfield(t); blueprint(0.3, 80);
  label('第 6 章 · 三个公式', 860, 240, 38, SQ.K.col, ap(t, 'K01', 0.2), { bold: true });
  FORM1.forEach(([n, c, e, id], k) => answerCard(860, 360 + k * 120, 740, n, c, e, t, P(id, 0.15), { size: 29, shake: S('D01') }));
  if (t > S('D01')) label('长得都不一样？', 860, 760, 34, SQ.D.col, ap(t, 'D01', 0.3), { bold: true });
};

// ======================= 三种微元（A342） =======================
const PX1 = [610, 890, 1170], PW1 = 250, PY1 = 580, PH1 = 340;
function miniPanel1(k, t, t0, title, col) {
  const p = eOut(prog(t, t0, 0.4)); if (p <= 0) return 0;
  panel(PX1[k] - PW1 / 2, PY1 - PH1 / 2, PW1, PH1, col, p); label(title, PX1[k], PY1 - PH1 / 2 - 26, 26, col, p, { bold: true }); return p;
}
const MF1 = u => 0.35 + 0.25 * Math.sin(2.4 * u + 0.4);   // 面板内的小曲线，u ∈ [0, 1]
SC.idea = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['切一小块  →  ', CR], ['写贡献', GOLD], ['  →  加起来', CR]], 860, 250, 36, t, P('C01', 0.15), { upright: true });
  // 面板 1：斜边 ds
  if (t > S('C02') - 0.1) {
    const a = miniPanel1(0, t, P('C02', 0), '弧长：ds', SQ.K.col); const X0 = PX1[0] - 105, W = 210, Y0 = PY1 + 150, H = 420;
    const pt = u => [X0 + u * W, Y0 - MF1(u) * H];
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CYAN; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const [x, y] = pt(i / 60); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.stroke(); ctx.restore();
    const [ax, ay] = pt(0.42), [bx, by] = pt(0.66), q = ap(t, 'C02', 0.35);
    seg(ax, ay, bx, by, GOLD, q * a, 5); seg(ax, ay, bx, ay, CR, q * a, 2, [6, 5]); seg(bx, ay, bx, by, CR, q * a, 2, [6, 5]);
    mathText('dx', (ax + bx) / 2 - 12, ay + 28, 22, CR, { alpha: q * a }); mathText('dy', bx + 8, (ay + by) / 2 + 8, 22, CR, { alpha: q * a }); mathText('ds', (ax + bx) / 2 - 34, (ay + by) / 2 - 6, 24, GOLD, { alpha: q * a });
  }
  // 面板 2：转一圈的环带 2πf·ds
  if (t > S('C03') - 0.1) {
    const a = miniPanel1(1, t, P('C03', 0), '侧面积：2πf ds', SQ.G.col); const X0 = PX1[1] - 105, W = 210, AX = PY1 + 10, R = 180;
    const yy = u => AX - MF1(u) * R * 1.4, q = ap(t, 'C03', 0.35);
    seg(X0 - 5, AX, X0 + W + 5, AX, CR, a * 0.6, 2, [8, 6]);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = SQ.G.col; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 60; i++) ctx[i ? 'lineTo' : 'moveTo'](X0 + i / 60 * W, yy(i / 60)); ctx.stroke();
    ctx.globalAlpha = a * 0.5; ctx.beginPath(); for (let i = 0; i <= 60; i++) ctx[i ? 'lineTo' : 'moveTo'](X0 + i / 60 * W, 2 * AX - yy(i / 60)); ctx.stroke(); ctx.restore();
    [0.42, 0.62].forEach((u, j) => { const x = X0 + u * W, r = AX - yy(u); ctx.save(); ctx.globalAlpha *= a * q; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, AX, 14, r, 0, 0, 7); ctx.stroke(); ctx.restore(); });
    ctx.save(); ctx.globalAlpha *= a * q * 0.35; ctx.fillStyle = GOLD; ctx.beginPath(); const xa = X0 + 0.42 * W, xb = X0 + 0.62 * W; ctx.moveTo(xa, yy(0.42)); ctx.lineTo(xb, yy(0.62)); ctx.lineTo(xb, 2 * AX - yy(0.62)); ctx.lineTo(xa, 2 * AX - yy(0.42)); ctx.fill(); ctx.restore();
    mathText('f', X0 + 0.52 * W + 6, AX - 40, 22, GOLD, { alpha: a * q });
  }
  // 面板 3：一小条压力
  if (t > S('G01') - 0.1) {
    const a = miniPanel1(2, t, P('G01', 0), '压力：ρg h dA', CYAN); const X0 = PX1[2] - 90, W = 180, Y0 = PY1 - 120, H = 260, q = ap(t, 'G01', 0.35);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(92,200,232,0.22)'; ctx.fillRect(X0, Y0 + 20, W, H - 20); ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.strokeRect(X0, Y0, W, H); ctx.restore();
    seg(X0, Y0 + 20, X0 + W, Y0 + 20, CYAN, a, 2);
    const ys = Y0 + 160; ctx.save(); ctx.globalAlpha *= a * q; ctx.fillStyle = hexA(GOLD, 0.6); ctx.fillRect(X0 + 2, ys, W - 4, 14); ctx.restore();
    arrow(X0 + W + 18, Y0 + 22, X0 + W + 18, ys, GOLD, a * q, 2.5); mathText('h', X0 + W + 26, (Y0 + ys) / 2 + 10, 24, GOLD, { alpha: a * q });
    mathText('dA', X0 + W / 2 - 16, ys + 40, 22, GOLD, { alpha: a * q });
  }
};

// ======================= 算不出原函数 → 辛普森（A343） =======================
const FT1 = x => Math.sqrt(1 + Math.cos(x) ** 2);
const GT1 = { cx: 640, cy: 800, ux: 150, uy: 230, x0: 0, x1: 3.4, y0: 0, y1: 1.6 };
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  questionCard(870, 300, 560, 92, '', '∫₀^π √(1 + cos²x) dx = ？', t, P('G02', 0.2), { size: 36, col: SQ.G.col });
  const a = ap(t, 'G02', 0.4); gAxes(GT1, a * 0.7, { grid: false, ticks: { x: [[Math.PI, 'π']] } }); gPlot(GT1, FT1, CYAN, { a, xa: 0, xb: Math.PI, w: 4 });
  if (t > S('D02') && t < S('C04') + 0.4) stampMark(1080, 520, 62, t, P('D02', 0.1), { text: '无初等原函数', col: RED, rot: 0.1, alpha: fadeOut(t, S('C04'), 0.4) });
  if (t > S('C04')) {
    gSimpson(GT1, FT1, 0, Math.PI, 10, GOLD, ap(t, 'C04', 0.1), { fa: 0.25 });
    richReveal([['辛普森 S₁₀ ≈ ', CR], ['3.8202', GOLD]], 900, 405, 36, t, P('C04', 0.35), { upright: true });
  }
};

// ======================= 随堂 =======================
const GQ1 = { cx: 700, cy: 780, ux: 300, uy: 300, x0: 0, x1: 1.25, y0: 0, y1: 1.25 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['y = x，从 0 到 1，', CR], ['弧长 = ？', GOLD]], 860, 260, 38, t, P('C06', 0.05), { upright: true });
  const a = ap(t, 'C06', 0.3); gAxes(GQ1, a * 0.7, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } }); gLine(GQ1, 1, 0, 0, 0, 1, CYAN, a, 5);
  if (t > S('D03')) {
    const q = ap(t, 'D03', 0.1); seg(gx(GQ1, 0), gy(GQ1, 0), gx(GQ1, 1), gy(GQ1, 0), CR, q, 2, [6, 5]); seg(gx(GQ1, 1), gy(GQ1, 0), gx(GQ1, 1), gy(GQ1, 1), CR, q, 2, [6, 5]);
    mathText('√2', gx(GQ1, 0.5) - 50, gy(GQ1, 0.5) - 10, 34, GOLD, { alpha: q, upright: true });
    richReveal([['∫₀¹ √(1 + 1²) dx = ', CR], ['√2', GOLD]], 1080, 420, 34, t, P('D03', 0.35), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) { ['切微元', '写贡献', '再积分'].forEach((s, k) => { glowText(s, 640 + k * 260, 420, 48, k === 2 ? GOLD : CR, t, P('C07', 0.1 + 0.25 * k)); if (k) arrowH(640 + k * 260 - 190, 640 + k * 260 - 80, 420, CYAN, ga * ap(t, 'C07', 0.25 * k), 3); }); }
  if (t > S('C08') - 0.1) { glowText('下一段：弧长函数与弧长比赛', CX, 520, 50, CR, t, P('C08', 0.15)); glowText('Grok 主持', CX, 610, 32, SQ.X.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 8 章 · P1 速通', '下一段：弧长比赛', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM8('Kimi')]);
};

SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.2, 'shimmer', 0.16); s('K02', 0.15, 'pop', 0.2); s('K03', 0.15, 'pop', 0.2); s('K04', 0.15, 'pop', 0.2); s('D01', 0.05, 'buzz', 0.14);
  s('C01', 0.15, 'swell', 0.14); s('C02', 0.0, 'pop', 0.18); s('C02', 0.35, 'zap', 0.14); s('C03', 0.0, 'pop', 0.18); s('C03', 0.35, 'warp', 0.14); s('G01', 0.0, 'pop', 0.18); s('G01', 0.35, 'thud', 0.16);
  s('G02', 0.2, 'whoosh', 0.16); s('D02', 0.1, 'stamp', 0.26); s('C04', 0.1, 'riser', 0.14); s('C04', 0.35, 'ding', 0.2);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.1, 'whoosh', 0.14); s('D03', 0.35, 'ding_hi', 0.28);
  s('C07', 0.1, 'pop', 0.2); s('C07', 0.35, 'pop', 0.2); s('C07', 0.6, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
