// 第 4 章 P5《单调、凹凸与拐点》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A138 f、f′、f″ 三层符号条带 · A139 盛水的碗 / 洒水的碗随曲线翻转 · A140 拐点处切线穿过曲线 · A141 兔子沿曲线跑，坡度计实时读数
const SC = {};
const TITLES = [['mono', '单调性：为什么'], ['first', '一阶导数判别法'], ['conc', '凹凸与拐点'], ['second', '二阶导数判别法'], ['quiz', '随堂一题'], ['outro', '小结']];
Object.assign(SIDE.T, { dy: t => { const e = ENTRIES.find(e => e.k === 'v' && e.id[0] === 'T' && t >= e.vo && t <= e.vo + e.dur); return e ? -Math.abs(Math.sin((t - e.vo) * 5)) * 16 : 0; } });

// ---------- 小兔子 + 坡度计（A141） ----------
function bunny(x, y, s, a = 1, hop = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - hop); ctx.scale(s, s);
  ctx.fillStyle = '#fff4f8'; ctx.strokeStyle = SQ.T.col; ctx.lineWidth = 2.5; ctx.shadowColor = SQ.T.col; ctx.shadowBlur = 10;
  [[-7, -38, -0.25], [7, -38, 0.25]].forEach(([ex, ey, r]) => { ctx.save(); ctx.translate(ex, ey); ctx.rotate(r); ctx.beginPath(); ctx.ellipse(0, 0, 5.5, 15, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); });
  ctx.beginPath(); ctx.ellipse(0, -12, 17, 14, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(-6, -15, 2.2, 0, 7); ctx.arc(6, -15, 2.2, 0, 7); ctx.fill();
  ctx.fillStyle = SQ.T.col; ctx.beginPath(); ctx.arc(0, -9, 2, 0, 7); ctx.fill();
  ctx.restore();
}
function slopeMeter(x, y, m, a) {
  if (a <= 0) return; panel(x - 90, y - 46, 180, 92, SQ.T.col, a);
  label('坡度', x - 50, y, 22, CR, a, { bold: true });
  mathText((m >= 0 ? '+' : '−') + Math.abs(m).toFixed(2), x + 34, y + 12, 32, m >= 0 ? GRN : RED, { align: 'center', alpha: a, upright: true, glow: 10 });
}
function onCurve(G, f, x) { return [gx(G, x), gy(G, f(x))]; }
// 符号条带
function strip(G, y, label0, col, segs, a, t0s, t) {
  if (a <= 0) return; mathText(label0, gx(G, G.x0) - 14, y + 9, 26, col, { align: 'right', alpha: a, upright: false });
  segs.forEach(([xa, xb, sg], i) => {
    const p = eOut(prog(t, t0s[i] ?? t0s[0], 0.35)); if (p <= 0) return; const c = sg > 0 ? GRN : RED;
    ctx.save(); ctx.globalAlpha *= a * p; ctx.fillStyle = hexA(c, 0.25); ctx.strokeStyle = c; ctx.lineWidth = 1.5; rr(gx(G, xa) + 2, y - 16, (xb - xa) * G.ux - 4, 32, 8); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText(sg > 0 ? '+' : '−', gx(G, (xa + xb) / 2), y + 10, 28, c, { align: 'center', alpha: a * p, upright: true });
  });
}

// ======================= 单调性（拉格朗日证明） =======================
const GM = { cx: 660, cy: 800, ux: 80, uy: 70, x0: 0, x1: 7.2, y0: 0, y1: 7.6 };
const mF = x => 0.8 + 0.9 * x - 0.08 * x * x + 0.35 * Math.sin(1.4 * x), mD = x => 0.9 - 0.16 * x + 0.49 * Math.cos(1.4 * x);
SC.mono = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  gAxes(GM, a, { grid: false });
  gPlot(GM, mF, RED, { a, p: eIO(prog(t, P('C01', 0.2), 1.2)) });
  richReveal([["f' > 0  ⇒  递增 ?", GRN]], 1000, 200, 36, t, P('C01', 0.4), { upright: true, out: S('C02') });
  if (t > S('C02') - 0.1) {
    const x1 = 1.4, x2 = 5.4, b = ap(t, 'C02', 0.05), m = (mF(x2) - mF(x1)) / (x2 - x1);
    let c = 3, best = 9; for (let i = 0; i <= 400; i++) { const x = x1 + (x2 - x1) * i / 400, d = Math.abs(mD(x) - m); if (d < best) { best = d; c = x; } }
    gDot(GM, x1, mF(x1), CYAN, b); gDot(GM, x2, mF(x2), CYAN, b); gLine(GM, m, x1, mF(x1), x1, x2, SEC, b, 3);
    mathText('x_1', gx(GM, x1), gy(GM, 0) + 34, 24, CYAN, { align: 'center', alpha: b }); mathText('x_2', gx(GM, x2), gy(GM, 0) + 34, 24, CYAN, { align: 'center', alpha: b });
    const ca = ap(t, 'C02', 0.35); gLine(GM, mD(c), c, mF(c), c - 1.3, c + 1.3, GOLD, ca, 3.5); gDot(GM, c, mF(c), GOLD, ca);
    richReveal([['f(x_2) − f(x_1) = ', CR], ["f'(c)", GRN], ['(x_2 − x_1)', CYAN]], 1000, 200, 32, t, P('C02', 0.2), { upright: true });
    richReveal([['正', GRN], [' × ', CR], ['正', CYAN], [' = 正', GOLD]], 1000, 262, 32, t, P('C02', 0.7), { upright: true });
  }
  if (t > S('T01') - 0.1) {
    const r = eIO(prog(t, P('T01', 0.1), D('T01') * 0.8)), x = lerp(0.3, 6.9, r), [px, py] = onCurve(GM, mF, x);
    bunny(px, py - 4, 1.1, ap(t, 'T01', 0), Math.abs(Math.sin(t * 9)) * 10);
    slopeMeter(1250, 380, mD(x), ap(t, 'T01', 0));
  }
};

// ======================= 一阶导数判别法 =======================
const GF = { cx: 725, cy: 346, ux: 70, uy: 12, x0: -1.5, x1: 5.5, y0: -34, y1: 8 };
const fF = x => x * x * x - 6 * x * x + 1;
SC.first = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C03', 0);
  richReveal([['f(x) = x^3 − 6x^2 + 1', RED]], 1080, 190, 32, t, P('C03', 0.4), { upright: true });
  gAxes(GF, a, { grid: false, ticks: { x: [[4, '4']], y: [[-31, '−31']] } });
  gPlot(GF, fF, RED, { a, xa: -1.2, xb: 5.3, p: eIO(prog(t, P('C03', 0.5), 1)) });
  if (t > S('C04') - 0.1) {
    richReveal([["f'(x) = 3x(x − 4)", GRN]], 1080, 245, 30, t, P('C04', 0.05), { upright: true });
    strip(GF, 815, "f'", GRN, [[-1.5, 0, 1], [0, 4, -1], [4, 5.5, 1]], ap(t, 'C04', 0.2), [P('C04', 0.2), P('C04', 0.3), P('C04', 0.4)], t);
    const p1 = ap(t, 'C04', 0.45), p2 = ap(t, 'C04', 0.75);
    gDot(GF, 0, 1, GOLD, p1); label('极大 f(0) = 1', gx(GF, 0) + 10, gy(GF, 1) - 34, 24, GOLD, p1, { bold: true, align: 'left' });
    gDot(GF, 4, -31, CYAN, p2); label('极小 f(4) = −31', gx(GF, 4) - 20, gy(GF, -31) + 40, 24, CYAN, p2, { bold: true });
  }
};

// ======================= 凹凸与拐点（A139 + A140） =======================
const GK = { cx: 650, cy: 820, ux: 100, uy: 80, x0: 0, x1: 6.4, y0: 0, y1: 6.4 };
const kF = x => (x - 3) ** 3 / 4 - 1.5 * (x - 3) + 3.2, kD = x => 0.75 * (x - 3) ** 2 - 1.5, kD2 = x => 1.5 * (x - 3);
function bowl(x, y, up, a, t) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (!up) ctx.scale(1, -1);
  ctx.strokeStyle = up ? GRN : RED; ctx.lineWidth = 5; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(0, -40, 50, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  if (up) { ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(92,200,232,0.55)'; ctx.beginPath(); ctx.arc(0, -40, 46, 0.25 * Math.PI, 0.75 * Math.PI); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  if (!up) for (let i = 0; i < 5; i++) { const ph = (t * 1.3 + i * 0.2) % 1; glowDot(x - 40 + i * 20 + (i % 2 ? 6 : -6), y + 52 + ph * 70, 4, CYAN, a * (1 - ph)); }
}
SC.conc = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C05', 0);
  gAxes(GK, a, { grid: false });
  gPlot(GK, kF, RED, { a });
  // 盛水 / 洒水的碗（A139）
  bowl(gx(GK, 1.3), gy(GK, kF(1.3)) - 110, false, ap(t, 'C05', 0.6), t); label('下凹：会洒水', gx(GK, 1.3), gy(GK, kF(1.3)) - 205, 22, RED, ap(t, 'C05', 0.6), { bold: true });
  bowl(gx(GK, 4.8), gy(GK, kF(4.8)) + 140, true, ap(t, 'C05', 0.35), t); label('上凹：能盛水', gx(GK, 4.8), gy(GK, kF(4.8)) + 160, 22, GRN, ap(t, 'C05', 0.35), { bold: true });
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0) * fadeOut(t, S('T02'), 0.3);
    richReveal([["f'' > 0  上凹（同济：凹）", GRN]], 1000, 200, 28, t, P('G01', 0.1), { upright: true, alpha: g });
    richReveal([["f'' < 0  下凹（同济：凸）", RED]], 1000, 250, 28, t, P('G01', 0.35), { upright: true, alpha: g });
    strip(GK, 880, "f''", SEC, [[0, 3, -1], [3, 6.4, 1]], ap(t, 'G01', 0.2), [P('G01', 0.35), P('G01', 0.1)], t);
  }
  // T02：兔子跑过拐点，碗翻面
  if (t > S('T02') - 0.1) {
    const r = eIO(prog(t, P('T02', 0.05), D('T02') * 0.8)), x = lerp(0.6, 5.8, r), [px, py] = onCurve(GK, kF, x);
    bunny(px, py - 4, 1.1, ap(t, 'T02', 0) * fadeOut(t, S('C06') + 0.3, 0.3), Math.abs(Math.sin(t * 9)) * 10);
    const ia = ap(t, 'T02', 0.45); gDot(GK, 3, kF(3), GOLD, ia); label('拐点', gx(GK, 3) + 46, gy(GK, kF(3)) - 22, 26, GOLD, ia, { bold: true });
  }
  // C06：切线穿过曲线（A140）
  if (t > S('C06') - 0.1) {
    const c = ap(t, 'C06', 0.1), x = lerp(1.8, 3, eIO(prog(t, P('C06', 0.1), D('C06') * 0.5)));
    gLine(GK, kD(x), x, kF(x), x - 1.6, x + 1.6, GOLD, c, 3.5); gDot(GK, x, kF(x), GOLD, c);
    richReveal([['切线从下方穿到上方', GOLD]], 1000, 200, 28, t, P('C06', 0.6), { upright: true });
  }
};

// ======================= 二阶导数判别法（A138） =======================
const GS = { cx: 880, cy: 450, ux: 38, uy: 3, x0: -7, x1: 5, y0: -55, y1: 70 };
const sF = x => x * x * x + 3 * x * x - 24 * x - 20;
const GG = { cx: 1210, cy: 780, ux: 55, uy: 70, x0: -0.3, x1: 4.3, y0: -1.6, y1: 1.6 };
SC.second = t => {
  starfield(t); blueprint(0.4, 80);
  const tw = t < S('T03') ? 1 : 0;
  if (tw) { richReveal([["f' = 0，  f'' < 0  ⇒  极大", GOLD]], CX, 380, 36, t, P('C07', 0.25), { upright: true }); richReveal([["f' = 0，  f'' > 0  ⇒  极小", CYAN]], CX, 460, 36, t, P('C07', 0.6), { upright: true }); return; }
  const a = ap(t, 'T03', 0);
  richReveal([['f(x) = x^3 + 3x^2 − 24x − 20', RED]], 640, 190, 30, t, P('T03', 0.25), { align: 'left', upright: true });
  gAxes(GS, a, { grid: false, ticks: { x: [[-4, '−4'], [2, '2']] } });
  gPlot(GS, sF, RED, { a, xa: -6.8, xb: 4.6, p: eIO(prog(t, P('T03', 0.3), 1)) });
  strip(GS, 680, "f'", GRN, [[-7, -4, 1], [-4, 2, -1], [2, 5, 1]], ap(t, 'T03', 0.7), [P('T03', 0.7), P('T03', 0.8), P('T03', 0.9)], t);
  if (t > S('C08') - 0.1) {
    richReveal([["f''(x) = 6x + 6", SEC]], 1355, 190, 30, t, P('C08', 0.05), { align: 'right', upright: true });
    strip(GS, 745, "f''", SEC, [[-7, -1, -1], [-1, 5, 1]], ap(t, 'C08', 0.1), [P('C08', 0.1), P('C08', 0.15)], t);
    const p1 = ap(t, 'C08', 0.3), p2 = ap(t, 'C08', 0.7);
    gDot(GS, -4, 60, GOLD, p1); label('f″(−4) = −18 → 极大 60', gx(GS, -4) + 10, gy(GS, 60) - 26, 22, GOLD, p1, { bold: true, align: 'left' });
    gDot(GS, 2, -48, CYAN, p2); label('f″(2) = 18 → 极小 −48', gx(GS, 2) - 10, gy(GS, -48) + 36, 22, CYAN, p2, { bold: true, align: 'right' });
  }
  if (t > S('G02') - 0.1) {
    const g = ap(t, 'G02', 0); panel(1080, 600, 280, 300, SEC, g);
    gAxes(GG, g, { grid: false, ticks: { x: [[2, '2']] } }); gPlot(GG, x => 1 - Math.cbrt((x - 2) ** 2), RED, { a: g, xa: -0.2, xb: 4.2 });
    glowDot(gx(GG, 2), gy(GG, 1), 8, GOLD, ap(t, 'G02', 0.4)); label("f″ 不存在", 1220, 640, 20, COL.red, ap(t, 'G02', 0.3), { bold: true });
    label('仍是极大 → 用一阶判别', 1220, 870, 20, GOLD, ap(t, 'G02', 0.7), { bold: true });
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 900, cy: 600, ux: 150, uy: 60, x0: -1.9, x1: 1.9, y0: -4, y1: 4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 300);
  richReveal([['f(x) = x^3', RED], [' 的拐点 = ?', CR]], 880, 220, 40, t, P('C10', 0.1), { upright: true });
  const a = ap(t, 'C10', 0.3); gAxes(GQ, a, { grid: false }); gPlot(GQ, x => x * x * x, RED, { a });
  if (t > S('D01')) {
    strip(GQ, 890, "f''", SEC, [[-1.9, 0, -1], [0, 1.9, 1]], ap(t, 'D01', 0.1), [P('D01', 0.15), P('D01', 0.3)], t);
    const p = ap(t, 'D01', 0.6); gDot(GQ, 0, 0, GOLD, p); label('拐点 (0, 0)', gx(GQ, 0) + 90, gy(GQ, 0) + 40, 26, GOLD, p, { bold: true });
    if (p > 0) burst(t, P('D01', 0.6), gx(GQ, 0), gy(GQ, 0), GOLD, 80, 10);
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; slab("f'：管升降", 800, 440, 34, t, P('C11', 0.3), { bg: GRN, c: COL.ink, rot: 0 }); slab("f''：管弯曲", 1160, 440, 34, t, P('C11', 0.6), { bg: SEC, c: COL.ink, rot: 0 }); ctx.restore(); }
  if (t > S('C12') - 0.1) { glowText('下一段：参数方程求导 · 莱布尼茨公式', CX, 500, 48, CR, t, P('C12', 0.15)); glowText('MiniMax 客串', CX, 590, 32, SQ.N.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 4 章 · P5 单调、凹凸与拐点', '下一段：参数方程与莱布尼茨公式', [...CREDIT_BASE,
    'MiMo 娘立绘：依据 甶丶 设定（CC BY-NC）由 AI 生成的本课差分。', 'MiMo 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END, CREDIT_TM4('MiMo')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.4, 'type', 0.16); s('C02', 0.05, 'pop', 0.2); s('C02', 0.2, 'type', 0.16); s('C02', 0.35, 'pluck', 0.2); s('C02', 0.7, 'ding', 0.24);
  [0.15, 0.35, 0.55, 0.75].forEach(f => s('T01', f, 'tinkle', 0.14));
  s('C03', 0.4, 'type', 0.16); s('C04', 0.05, 'type', 0.16); [0.2, 0.3, 0.4].forEach(f => s('C04', f, 'marimba', 0.2)); s('C04', 0.45, 'ding_hi', 0.24); s('C04', 0.75, 'ding_lo', 0.24);
  s('C05', 0.35, 'pop', 0.2); s('C05', 0.6, 'tinkle', 0.2); s('G01', 0.1, 'type', 0.16); s('G01', 0.35, 'type', 0.16);
  [0.15, 0.35, 0.55].forEach(f => s('T02', f, 'tinkle', 0.14)); s('T02', 0.45, 'ding_hi', 0.26); s('C06', 0.1, 'pluck', 0.2); s('C06', 0.6, 'shimmer', 0.2);
  s('C07', 0.25, 'type', 0.16); s('C07', 0.6, 'type', 0.16); s('T03', 0.25, 'type', 0.16); [0.7, 0.8, 0.9].forEach(f => s('T03', f, 'marimba', 0.2));
  s('C08', 0.1, 'marimba_lo', 0.2); s('C08', 0.3, 'ding_hi', 0.26); s('C08', 0.7, 'ding_lo', 0.26); s('G02', 0.3, 'buzz', 0.2); s('G02', 0.7, 'pop', 0.2);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.6, 'ding_hi', 0.3);
  s('C11', 0.3, 'pop', 0.22); s('C11', 0.6, 'pop', 0.22); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
