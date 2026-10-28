// 第 3 章 P1《高中速通：求导公式》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A85 三关进度条 + Kimi 公式卷轴逐行点亮 · A86 “四步一圈”导数轮盘（月相）· A87 里层系数被提到外面 · A88 “为什么？”与 sin(x²) 问号
const SC = {};
const TITLES = [['map', '三关地图'], ['exp', '第一关 · 指数与对数'], ['trig', '第二关 · 三角函数'], ['comp', '第三关 · 简单复合'], ['quiz', '随堂两题'], ['why', '只有结论，没有理由'], ['outro', '小结']];
const KC = SQ.K.col, MOON = '#DDE6FF';

// ---------- 三关进度条 ----------
const STAGES = ['指数与对数', '三角函数', '简单复合'];
function stageBar(t, cur, a = 1, t0 = 0) {
  if (a <= 0) return; const y = 170, xs = [760, 1010, 1260];
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(237,230,216,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xs[0], y); ctx.lineTo(xs[2], y); ctx.stroke();
  if (cur > 0) glowPath(() => { ctx.moveTo(xs[0], y); ctx.lineTo(xs[Math.min(cur, 2)], y); }, GOLD, 3, 0.8);
  xs.forEach((x, k) => {
    const st = k < cur ? GOLD : k === cur ? CYAN : 'rgba(237,230,216,0.35)', r = k === cur ? 15 + 2 * Math.sin(t * 5) : 11;
    ctx.save(); ctx.fillStyle = k === cur ? CYAN : k < cur ? GOLD : '#1a2240'; ctx.strokeStyle = st; ctx.lineWidth = 3; ctx.shadowColor = st; ctx.shadowBlur = k === cur ? 18 : 0;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    label(STAGES[k], x, y + 36, 22, k === cur ? CYAN : k < cur ? GOLD : 'rgba(237,230,216,0.55)', 1, { bold: k === cur });
  });
  ctx.restore();
}
// ---------- 公式卷轴 ----------
const ROWS = [
  { g: 0, s: '(e^x)′ = e^x' }, { g: 0, s: '(a^x)′ = a^x ln a' }, { g: 0, s: '(ln x)′ = 1/x' }, { g: 0, s: '(log_a x)′ = 1/(x ln a)' },
  { g: 1, s: '(sin x)′ = cos x' }, { g: 1, s: '(cos x)′ = −sin x' },
  { g: 2, s: '[f(kx + b)]′ = k f′(kx + b)' },
];
const GCOL = [GOLD, RED, CYAN];
// scroll(t, x, y, w, rows, lit(i) → 0..1, a, open 0..1)
function scroll(t, x, y, w, rows, lit, a, open = 1, o = {}) {
  if (a <= 0) return; const lh = o.lh || 58, h = (rows.length * lh + 40) * open, sz = o.sz || 34;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(14,20,44,0.88)'; ctx.fillRect(x, y, w, h);
  const g = ctx.createLinearGradient(x, y, x + w, y); g.addColorStop(0, 'rgba(221,230,255,0.10)'); g.addColorStop(0.5, 'rgba(221,230,255,0.02)'); g.addColorStop(1, 'rgba(221,230,255,0.10)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  [y, y + h].forEach(yy => { ctx.save(); ctx.fillStyle = '#2b3350'; ctx.strokeStyle = MOON; ctx.lineWidth = 2; ctx.shadowColor = MOON; ctx.shadowBlur = 12; rr(x - 18, yy - 11, w + 36, 22, 11); ctx.fill(); ctx.stroke(); ctx.restore(); });
  ctx.save(); ctx.beginPath(); ctx.rect(x, y + 12, w, Math.max(0, h - 24)); ctx.clip();
  rows.forEach((r, i) => {
    const yy = y + 52 + i * lh, L = lit(i, r);
    if (L <= 0.02) { ctx.fillStyle = 'rgba(237,230,216,0.14)'; rr(x + 30, yy - 22, w * 0.62, 20, 10); ctx.fill(); return; }
    if (L > 0.5) { ctx.save(); ctx.globalAlpha *= (L - 0.5) * 0.5; ctx.fillStyle = GCOL[r.g]; rr(x + 10, yy - 38, w - 20, 50, 10); ctx.fill(); ctx.restore(); }
    mathText(r.s, x + 34, yy, sz, L > 0.5 ? GCOL[r.g] : COL.cream, { alpha: lerp(0.35, 1, L), glow: L > 0.5 ? 12 : 0, upright: o.upright });
  });
  ctx.restore(); ctx.restore();
}

// ======================= map（A85 上） =======================
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('K01')) { kinetic('高中求导公式 · 速通', CX, 470, 60, t, P('D01', 0.15), { col: CR }); return; }
  stageBar(t, -1, ap(t, 'C01', 0.1));
  const open = eIO(prog(t, P('K01', 0.05), 0.9));
  scroll(t, 680, 270, 600, ROWS, (i) => prog(t, P('K01', 0.45) + i * 0.12, 0.25) * 0.45, 1, open, { lh: 72, sz: 36 });
  label('Kimi · 过目不忘', 980, 250, 24, MOON, ap(t, 'K01', 0.2), { bold: true });
  if (t > S('C01')) { ratioTag('每关 30 秒', 1250, 900, GOLD, ap(t, 'C01', 0.6), { size: 28 }); }
};

// ======================= exp（A85 下） =======================
const GE = { cx: 1170, cy: 860, ux: 78, uy: 46, x0: -2.4, x1: 2.4, y0: 0, y1: 7.5 };
SC.exp = t => {
  starfield(t); blueprint(0.4, 80);
  stageBar(t, 0);
  const rows = ROWS.filter(r => r.g === 0);
  const litT = [P('K02', 0.15), P('C02', 0.15), P('K02', 0.6), P('C02', 0.6)];
  scroll(t, 630, 250, 410, rows, (i) => 0.45 + 0.55 * prog(t, litT[i], 0.3), 1, 1, { lh: 58, sz: 32 });
  // 右下小图：eˣ 与导数重合；C02 换成 2ˣ
  const ga = ap(t, 'K02', 0.2); if (ga > 0) {
    const G = GE, sw = eIO(prog(t, P('C02', 0.1), 0.6)), base = lerp(Math.E, 2, sw), k = Math.log(base);
    gAxes(G, ga, { grid: false });
    gPlot(G, x => Math.pow(base, x), GOLD, { a: ga, w: 5 });
    gPlot(G, x => k * Math.pow(base, x), GRN, { a: ga, w: 3.5, dash: [10, 8] });
    mathText(sw < 0.5 ? 'y = e^x' : 'y = 2^x', gx(G, -2.2), gy(G, 6.8) + 10, 30, GOLD, { alpha: ga, glow: 10 });
    label('导数（虚线）', gx(G, -2.2), gy(G, 5.9), 24, GRN, ga, { align: 'left', bold: true });
    if (sw > 0.6) ratioTag('× 0.69', gx(G, 1.6), gy(G, 2.2), GRN, ap(t, 'C02', 0.6), { size: 30 });
    if (sw < 0.4) label('完全重合', gx(G, 1.2), gy(G, 1.6), 26, GRN, ga * (1 - sw * 2.5), { bold: true });
  }
  if (t > S('D02')) stampMark(1240, 330, 70, t, P('D02', 0.2), { text: '为什么？', col: INV, rot: -0.2 });
};

// ======================= trig（A86） =======================
const WH = { x: 960, y: 590, R: 230 };
const TRIG = [['sin x', x => Math.sin(x)], ['cos x', x => Math.cos(x)], ['−sin x', x => -Math.sin(x)], ['−cos x', x => -Math.cos(x)]];
function moonIcon(x, y, r, phase, a) {   // phase 0 新月 · 1 上弦 · 2 满月 · 3 下弦
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = '#1a2240'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = hexA(MOON, 0.6); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = MOON; ctx.shadowColor = MOON; ctx.shadowBlur = 18;
  if (phase === 2) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  else if (phase === 1 || phase === 3) { const s = phase === 1 ? 1 : -1; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, s < 0); ctx.closePath(); ctx.fill(); }
  else { ctx.strokeStyle = MOON; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); }
  ctx.restore();
}
function trigStep(t) {   // 指针走过的格数（0..4）
  return [P('K03', 0.32), P('K03', 0.74), P('C03', 0.3), P('C03', 0.72)].reduce((s, t0) => s + eIO(prog(t, t0, 0.45)), 0);
}
SC.trig = t => {
  starfield(t); blueprint(0.4, 80);
  stageBar(t, 1);
  const a = ap(t, 'K03', 0.05), moon = win(t, P('K04', 0.1), E('K04') + 0.2, 0.35);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = hexA(MOON, 0.35); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(WH.x, WH.y, WH.R, 0, 7); ctx.stroke();
  ctx.restore();
  const step = trigStep(t), cur = Math.round(step) % 4;
  TRIG.forEach(([s, f], k) => {
    const an = -Math.PI / 2 + k * Math.PI / 2, x = WH.x + Math.cos(an) * WH.R, y = WH.y + Math.sin(an) * WH.R, on = k === cur;
    const ca = a * (1 - moon);
    ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = 'rgba(12,18,38,0.92)'; ctx.strokeStyle = on ? CYAN : hexA(RED, 0.7); ctx.lineWidth = on ? 4 : 2.5; ctx.shadowColor = on ? CYAN : RED; ctx.shadowBlur = on ? 22 : 8;
    rr(x - 95, y - 58, 190, 116, 16); ctx.fill(); ctx.stroke(); ctx.restore();
    if (ca > 0) {
      mathText(s, x, y - 14, 34, on ? CYAN : CR, { align: 'center', alpha: ca, glow: on ? 12 : 4, upright: true });
      ctx.save(); ctx.globalAlpha *= ca; glowPath(() => { for (let i = 0; i <= 40; i++) { const u = i / 40 * 2 * Math.PI, X = x - 70 + i * 3.5, Y = y + 28 - f(u) * 16; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, on ? CYAN : RED, 2.5, 0.9); ctx.restore();
    }
    moonIcon(x, y, 46, k, a * moon);
  });
  // 指针
  const pa = -Math.PI / 2 + step * Math.PI / 2;
  ctx.save(); ctx.globalAlpha *= a; glowPath(() => { ctx.moveTo(WH.x, WH.y); ctx.lineTo(WH.x + Math.cos(pa) * (WH.R - 75), WH.y + Math.sin(pa) * (WH.R - 75)); }, GOLD, 5, 1); ctx.restore();
  glowDot(WH.x, WH.y, 10, GOLD, a);
  // 每一步的“求导”弧箭头
  for (let k = 0; k < 4; k++) {
    const p = prog(t, [P('K03', 0.32), P('K03', 0.74), P('C03', 0.3), P('C03', 0.72)][k], 0.45); if (p <= 0) continue;
    const a0 = -Math.PI / 2 + k * Math.PI / 2 + 0.38, a1 = a0 + (Math.PI / 2 - 0.76) * eOut(p), R2 = WH.R + 70;
    glowPath(() => ctx.arc(WH.x, WH.y, R2, a0, a1), GRN, 3, a * 0.9);
    if (p > 0.6) label('求导', WH.x + Math.cos((a0 + a1) / 2) * (R2 + 28), WH.y + Math.sin((a0 + a1) / 2) * (R2 + 28), 22, GRN, a * (p - 0.6) * 2.5, { bold: true });
  }
  if (t > S('K04')) glowText('四步一圈', WH.x, WH.y + 4, 40, MOON, t, P('K04', 0.05), { out: E('K04') + 0.6 });
};

// ======================= comp（A87） =======================
SC.comp = t => {
  starfield(t); blueprint(0.4, 80);
  stageBar(t, 2);
  scroll(t, 640, 240, 720, ROWS.filter(r => r.g === 2), () => 0.45 + 0.55 * prog(t, P('K05', 0.3), 0.3), 1, eIO(prog(t, P('K05', 0.02), 0.5)), { lh: 60, sz: 34 });
  label('里层是一次函数：外层照常求导，再乘里层的系数', CX, 360, 26, CR, ap(t, 'K05', 0.5), { bold: true });
  // 例 1：sin 3x → 3cos 3x，“3” 被钩子提到最前
  if (t > S('C04')) {
    const y = 480, sz = 46, x0 = 650;
    const w1 = mathW('(sin ', sz), w3 = mathW('3', sz), wA = mathW('(sin 3x)′ = ', sz);
    richReveal([['(sin ', OUTER], ['3', INNER], ['x)′ = ', OUTER]], x0, y, sz, t, P('C04', 0.03), { align: 'left' });
    const hk = eIO(prog(t, P('C04', 0.35), 0.7)), xs = x0 + w1, xe = x0 + wA, ys = y, arc = Math.sin(hk * Math.PI) * 80;
    if (t > P('C04', 0.3)) {
      mathText('cos 3x', xe + w3 + 6, y, sz, OUTER, { alpha: ap(t, 'C04', 0.3), glow: 10 });
      const X = lerp(xs, xe, hk), Y = ys - arc;
      mathText('3', X, Y, sz, INNER, { glow: 16 });
      if (hk > 0 && hk < 1) { ctx.save(); ctx.strokeStyle = INNER; ctx.lineWidth = 3; ctx.shadowColor = INNER; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(X + w3 / 2, Y - sz * 0.8); ctx.lineTo(X + w3 / 2, Y - sz * 0.8 - 40); ctx.stroke(); ctx.beginPath(); ctx.arc(X + w3 / 2 + 8, Y - sz * 0.8, 8, Math.PI, 0, true); ctx.stroke(); ctx.restore(); }
      if (hk >= 1) label('系数被提到外面', xe + 120, y + 48, 22, INNER, ap(t, 'C04', 0.75), { bold: true });
    }
  }
  // 例 2：(3x − 1)² → 2(3x − 1) × 3 = 6(3x − 1)
  if (t > S('C05')) {
    const y = 640, sz = 42;
    richReveal([['[(3x − 1)^2]′ = ', CR]], 650, y, sz, t, P('C05', 0.03), { align: 'left' });
    richReveal([['2(3x − 1)', OUTER]], 650, y + 80, sz, t, P('C05', 0.3), { align: 'left' });
    richReveal([[' × ', CR], ['3', INNER]], 650 + mathW('2(3x − 1)', sz), y + 80, sz, t, P('C05', 0.55), { align: 'left' });
    richReveal([[' = 6(3x − 1)', PROD]], 650 + mathW('2(3x − 1) × 3', sz), y + 80, sz, t, P('C05', 0.75), { align: 'left' });
  }
  if (t > S('D03') - 0.1) {
    const a = ap(t, 'D03', 0), ch = gearChain(1250, 800, [{ n: 24, col: OUTER }, { n: 8, col: INNER }], 5, [0.6]);
    drawChain(ch, t * 0.5, 5, a);
    ratioTag('×3', 1310, 715, INNER, a, { size: 28 });
    if (t > S('C06')) label('倍数从来不变', 1220, 915, 26, INNER, ap(t, 'C06', 0.3), { bold: true });
  }
};

// ======================= quiz =======================
const GQ1 = { cx: 760, cy: 640, ux: 120, uy: 120, x0: -0.2, x1: 4.2, y0: -2.4, y1: 1.8 };
const GQ2 = { cx: 980, cy: 640, ux: 110, uy: 110, x0: -3.3, x1: 3.3, y0: -2.4, y1: 2.4 };
function slideTangent(G, f, df, x, col, a) { const m = df(x); gLine(G, m, x, f(x), x - 1.2, x + 1.2, INV, a, 3.5); gDot(G, x, f(x), col, a); }
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.4, 78);
  if (t < S('C08')) { kinetic('随堂两题 · 每题 3 秒', CX, 520, 58, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 330);
  const qb = quizBeats();
  const q1a = fadeOut(t, S('C09') - 0.1, 0.35);
  if (q1a > 0) {
    richReveal([['ln x', OUTER], ['  在 x = 1 处的导数？', CR]], CX - 80, 250, 44, t, P('C08', 0.1), { upright: true, alpha: q1a });
    const ga = ap(t, 'C08', 0.3) * q1a, f = x => Math.log(x), df = x => 1 / x;
    gAxes(GQ1, ga, { grid: false, ticks: { x: [[1, '1']] } }); gPlot(GQ1, f, OUTER, { a: ga, xa: 0.09 });
    const xs = t < S('D04') ? 1 + 0.9 * Math.sin((t - (qb[0] ? qb[0].vo : 0)) * 2.2) * clamp((t - S('C08')) / 1) : 1;
    if (ga > 0) slideTangent(GQ1, f, df, Math.max(0.35, xs), GOLD, ga);
    if (t > S('D04')) { label('斜率 1', gx(GQ1, 1.9), gy(GQ1, 1.2), 30, GOLD, ap(t, 'D04', 0.6) * q1a, { bold: true }); checkMark(gx(GQ1, 2.8), gy(GQ1, 1.2), 26, GRN, t, P('D04', 0.8), q1a); }
  }
  if (t > S('C09') - 0.1) {
    richReveal([['sin 2x', OUTER], ['  在 x = 0 处的导数？', CR]], CX - 80, 250, 44, t, P('C09', 0.1), { upright: true });
    const ga = ap(t, 'C09', 0.3), f = x => Math.sin(2 * x), df = x => 2 * Math.cos(2 * x);
    gAxes(GQ2, ga, { grid: false }); gPlot(GQ2, f, OUTER, { a: ga });
    const xs = t < S('D05') ? 1.2 * Math.sin((t - (qb[1] ? qb[1].vo : 0)) * 2.0) * clamp((t - S('C09')) / 1) : 0;
    if (ga > 0) slideTangent(GQ2, f, df, xs, GOLD, ga);
    if (t > S('D05')) { label('斜率 2', gx(GQ2, 1.4), gy(GQ2, 2.0), 30, GOLD, ap(t, 'D05', 0.5), { bold: true }); checkMark(gx(GQ2, 2.3), gy(GQ2, 2.0), 26, GRN, t, P('D05', 0.7)); }
  }
};

// ======================= why（A88） =======================
SC.why = t => {
  starfield(t); blueprint(0.4, 80);
  const dim = lerp(1, 0.55, ap(t, 'G01', 0.5));
  scroll(t, 660, 210, 560, ROWS, () => dim, 1, 1, { lh: 62, sz: 32 });
  const ys = [262, 510, 634];   // 第 1、5、7 行
  if (t > P('G01', 0.55)) [0, 1, 2].forEach(k => stampMark(1150 + (k === 2 ? 60 : 0), ys[k], 46, t, P('G01', 0.55) + k * 0.25, { text: '为什么？', col: INV, rot: -0.2 }));
  if (t > S('G02')) {
    const a = ap(t, 'G02', 0.55); panel(700, 720, 560, 150, RED, a);
    mathText('sin(x^2)', 760, 812, 52, OUTER, { alpha: a, glow: 12 });
    label('里层 x² 不是一次函数', 1080, 770, 24, CR, a, { bold: true });
    kinetic('?', 1180, 830, 70, t, P('G02', 0.8), { col: RED, font: F_MATH });
  }
  if (t > S('K06')) glowText('读懂它从哪里来，才能记一辈子', CX, 930, 32, MOON, t, P('K06', 0.4));
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C11'), 0.4);
  [['公式为什么成立', INV, 780], ['任意里层的链式法则', GOLD, 1180]].forEach(([s, c, x], k) => {
    const p = eBack(prog(t, P('C10', 0.45 + 0.2 * k), 0.4)) * pa; if (p <= 0) return;
    ctx.save(); ctx.translate(x, 460); ctx.scale(p, p); panel(-180, -70, 360, 140, c, 1); ctx.restore();
    label(s, x, 460, 30, c, clamp(p), { bold: true });
  });
  label('本章要补的两件事', CX, 320, 30, CR, ap(t, 'C10', 0.35) * pa, { bold: true });
  label('第 3 章 · P2 – P9', CX, 640, 26, CR, ap(t, 'C10', 0.8) * pa * 0.8);
  if (t > S('C11') - 0.1) {
    const p = eBack(prog(t, P('C11', 0.3), 0.5));
    ctx.save(); ctx.translate(CX, 470); ctx.scale(p, p); mathText('e ≈ 2.718', 0, 30, 110, GOLD, { align: 'center', glow: 30, upright: true }); ctx.restore();
    glowText('下一段：为什么是 e', CX, 650, 44, CR, t, P('C11', 0.55));
  }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 3 章 · P1 高中速通', '下一段：为什么是 e', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.15, 'pop', 0.24); s('K01', 0.05, 'whoosh', 0.2); [0, 1, 2, 3, 4, 5, 6].forEach(i => sfx(P('K01', 0.45) + i * 0.12, 'tick', 0.12)); s('C01', 0.6, 'pop', 0.22);
  s('K02', 0.15, 'ding', 0.22); s('K02', 0.6, 'ding', 0.22); s('C02', 0.15, 'ding_lo', 0.22); s('C02', 0.1, 'swoosh_in', 0.16); s('D02', 0.2, 'stamp', 0.3);
  [['K03', 0.32], ['K03', 0.74], ['C03', 0.3], ['C03', 0.72]].forEach(([id, f]) => s(id, f, 'marimba', 0.24)); s('K04', 0.1, 'tinkle', 0.24); s('K04', 0.3, 'shimmer', 0.18);
  s('K05', 0.02, 'whoosh', 0.18); s('C04', 0.03, 'type', 0.16); s('C04', 0.35, 'riser', 0.12); s('C04', 0.95, 'pluck', 0.24);
  s('C05', 0.03, 'type', 0.16); s('C05', 0.55, 'pop', 0.22); s('C05', 0.75, 'ding_hi', 0.26); s('D03', 0.1, 'sparkle', 0.2);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D04', 0.8, 'check', 0.28); s('D05', 0.7, 'check', 0.28);
  [0, 1, 2].forEach(k => sfx(P('G01', 0.55) + k * 0.25, 'stamp', 0.26)); s('G02', 0.55, 'swoosh_in', 0.18); s('G02', 0.8, 'buzz', 0.16); s('K06', 0.4, 'shimmer', 0.2);
  s('C10', 0.45, 'pop', 0.24); s('C10', 0.65, 'pop', 0.24); s('C11', 0.3, 'slam', 0.28); s('C11', 0.55, 'swell', 0.3);
})();
finalize();
