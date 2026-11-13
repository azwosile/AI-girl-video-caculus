// 第 10 章 P14《极坐标圆锥曲线与行星轨道》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.6。
// A476 焦点–准线统一定义，e 连续变化（椭圆 → 抛物线 → 双曲线） · A477 r = 10/(3 − 2cos θ) 与 r = 12/(2 + 4sin θ)（r < 0 另一支） · A478 Grok 骑火箭绕日：近日点 / 远日点，地球轨道几乎是圆
const SC = {};
const TITLES = [['def', '统一定义'], ['ex', '两个例子'], ['orbit', '行星轨道'], ['quiz', '随堂一题'], ['outro', '小结']];
// 极坐标曲线 r = rf(θ)，只画 sg·r > 0 且 |r|·u < lim 的部分（自动断开）
function conic14(OX, OY, u, rf, col, a, o = {}) {
  if (a <= 0) return; const sg = o.sg || 1, lim = o.lim || 520, n = o.n || 720; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = o.w || 4; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); let pen = false; for (let i = 0; i <= n; i++) { const q = TAU * i / n, r = rf(q); if (!isFinite(r) || sg * r <= 0 || Math.abs(r) * u > lim) { pen = false; continue; }
    const X = OX + r * u * Math.cos(q), Y = OY - r * u * Math.sin(q); if (pen) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); pen = true; } }
  ctx.stroke(); ctx.restore();
}
function kf14(t, K) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) return K[i - 1][1] + (K[i][1] - K[i - 1][1]) * eIO((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])); return K[K.length - 1][1]; }

// ======================= 统一定义（A476） =======================
SC.def = t => {
  starfield(t); blueprint(0.3, 80);
  if (t < S('C01')) { const k = ap(t, 'X01', 0.1); orbit(980, 540, 230, 0.55, (t - S('X01')) * 1.3, SQ.X.col, k, { pr: 4 });
    const q = (t - S('X01')) * 1.3, r = 230 * (1 - 0.55 ** 2) / (1 + 0.55 * Math.cos(q)); rocketIcon(980 + r * Math.cos(q), 540 - r * Math.sin(q), 0.9, q + Math.PI / 2, SQ.X.col, k, t); return; }
  const OX = 980, OY = 560, u = 80, d = 2, a = ap(t, 'C01', 0);
  const e = kf14(t, [[S('C01'), 0.5], [P('C02', 0.15), 0.5], [P('C02', 0.45), 1], [P('C02', 0.8), 1.5]]);
  const rf = q => e * d / (1 - e * Math.cos(q)); const xD = OX - d * u;
  seg(xD, 260, xD, 860, CYAN, a, 3, [10, 7]); label('准线', xD - 40, 290, 22, CYAN, a, { bold: true });
  conic14(OX, OY, u, rf, SQ.X.col, a, { lim: 330 }); glowDot(OX, OY, 10, GOLD, a); label('F', OX + 18, OY + 30, 24, GOLD, a, { bold: true });
  const q = 1.2 + 0.9 * Math.sin((t - S('C01')) * 0.8), r = rf(q);
  if (r > 0 && r * u < 400) { const X = OX + r * u * Math.cos(q), Y = OY - r * u * Math.sin(q), k = ap(t, 'C01', 0.3); seg(X, Y, OX, OY, GOLD, k, 3); seg(X, Y, xD, Y, CYAN, k, 3); glowDot(X, Y, 9, SQ.X.col, k);
    label(`|PF| ÷ |PD| = ${(r * u / (X - xD)).toFixed(2)}`, 1300, 330, 26, GOLD, k, { bold: true }); }
  label(`e = ${e.toFixed(2)}`, 1300, 380, 30, SQ.X.col, a, { bold: true });
  if (t > S('C02')) label(e < 0.98 ? '椭圆' : e < 1.02 ? '抛物线' : '双曲线', 1300, 430, 32, CR, ap(t, 'C02', 0.1), { bold: true });
  if (t > S('C03')) goldBox(980, 220, 620, 70, 'r = ed / (1 ± e cos θ)　或　r = ed / (1 ± e sin θ)', 26, ap(t, 'C03', 0.2));
  else richReveal([['|PF| = ', CR], ['e', SQ.X.col], [' · |PD|', CR]], 980, 220, 38, t, P('C01', 0.15), { upright: true });
};

// ======================= 两个例子（A477） =======================
SC.ex = t => {
  starfield(t); blueprint(0.34, 80);
  const two = t > S('C05') - 0.05, a = ap(t, 'G01', 0) * (two ? fadeOut(t, S('C05') - 0.05, 0.4) : 1);
  if (a > 0) { const OX = 880, OY = 580, u = 28; polarGrid(OX, OY, 300, 3, a * 0.4);
    conic14(OX, OY, u, q => 10 / (3 - 2 * Math.cos(q)), SQ.X.col, a); glowDot(OX, OY, 9, GOLD, a);
    richReveal([['r = 10 / (3 − 2cos θ) = ', CR], ['(10/3) / (1 − ⅔ cos θ)', GOLD]], 980, 220, 30, t, P('G01', 0.1), { upright: true, alpha: a });
    label('e = ⅔ < 1：椭圆', 1290, 330, 28, SQ.X.col, a * ap(t, 'G01', 0.6), { bold: true });
    if (t > S('C04')) { const k = ap(t, 'C04', 0.1) * a; glowDot(OX + 280, OY, 9, CYAN, k); label('(10, 0)', OX + 280, OY + 34, 22, CYAN, k, { bold: true });
      glowDot(OX - 56, OY, 9, CYAN, ap(t, 'C04', 0.3) * a); label('(2, π)', OX - 56, OY - 26, 22, CYAN, ap(t, 'C04', 0.3) * a, { bold: true });
      const xD = OX - 5 * u; seg(xD, 320, xD, 840, CYAN, ap(t, 'C04', 0.6) * a, 3, [10, 7]); label('x = −5', xD, 300, 22, CYAN, ap(t, 'C04', 0.6) * a, { bold: true }); } }
  if (two) { const OX = 880, OY = 640, u = 34, rf = q => 6 / (1 + 2 * Math.sin(q)), k = ap(t, 'C05', 0);
    seg(560, OY - 3 * u, 1200, OY - 3 * u, CYAN, k, 3, [10, 7]); label('y = 3', 1230, OY - 3 * u, 22, CYAN, k, { bold: true });
    conic14(OX, OY, u, rf, SQ.X.col, k, { lim: 300 }); glowDot(OX, OY, 9, GOLD, k); glowDot(OX, OY - 2 * u, 8, CYAN, k);
    richReveal([['r = 12 / (2 + 4 sin θ) = 6 / (1 + 2 sin θ)：', CR], ['e = 2', SQ.X.col]], 980, 220, 30, t, P('C05', 0.1), { upright: true });
    if (t > S('D01')) { const z = ap(t, 'D01', 0.2), q = 1.5 * Math.PI; seg(OX, OY, OX, OY + 6 * u * 0.5, RED, z, 3, [6, 6]); label('θ = 3π/2，r = −6', OX + 150, OY + 90, 24, RED, z, { bold: true }); }
    if (t > S('C06')) { const z = ap(t, 'C06', 0.1); conic14(OX, OY, u, rf, RED, z, { sg: -1, lim: 300 }); glowDot(OX, OY - 6 * u, 10, RED, z); label('(0, 6)', OX + 50, OY - 6 * u, 22, RED, z, { bold: true }); label('另一支', 1290, 330, 28, RED, z, { bold: true }); } }
};

// ======================= 行星轨道（A478） =======================
SC.orbit = t => {
  starfield(t); blueprint(0.34, 80);
  const real = t > S('C07') - 0.05, OX = 1010, OY = 560;
  if (!real) { const a = ap(t, 'X02', 0), e = 0.6, A = 200, q = (t - S('X02')) * 1.1; orbit(OX, OY, A, e, q, SQ.X.col, a, { pr: 4 });
    const r = A * (1 - e * e) / (1 + e * Math.cos(q)); rocketIcon(OX + r * Math.cos(q), OY - r * Math.sin(q), 0.9, q + Math.PI / 2, SQ.X.col, a, t);
    const k = ap(t, 'X02', 0.5); glowDot(OX + A * (1 - e), OY, 8, GRN, k); label('近日点 a(1 − e)', OX + A * (1 - e), OY + 34, 22, GRN, k, { bold: true });
    glowDot(OX - A * (1 + e), OY, 8, RED, k); label('远日点 a(1 + e)', OX - A * (1 + e) + 30, OY + 34, 22, RED, k, { bold: true });
    richReveal([['r = a(1 − e²) / (1 + e cos θ)', GOLD]], 980, 220, 34, t, P('X02', 0.1), { upright: true }); return; }
  const a = ap(t, 'C07', 0), e = 0.017, A = 260, q = (t - S('C07')) * 0.8;
  orbit(OX, OY, A, e, q, CYAN, a, { pr: 8, pcol: CYAN }); label('地球', OX + (A * (1 - e * e) / (1 + e * Math.cos(q))) * Math.cos(q) + 30, OY - (A * (1 - e * e) / (1 + e * Math.cos(q))) * Math.sin(q), 22, CYAN, a, { bold: true });
  richReveal([['a ≈ 1.496 × 10⁸ km，', CR], ['e ≈ 0.017', GOLD]], 980, 220, 32, t, P('C07', 0.05), { upright: true });
  label('近日点 ≈ 1.47 亿 km', 1330, 330, 24, GRN, ap(t, 'C07', 0.6), { bold: true }); label('远日点 ≈ 1.52 亿 km', 1330, 370, 24, RED, ap(t, 'C07', 0.75), { bold: true });
  if (t > S('X03')) stampMark(1330, 470, 44, t, P('X03', 0.2), { text: '这是真的吗？', col: SQ.X.col, rot: -0.12 });
  if (t > S('C08')) { const z = ap(t, 'C08', 0.3), Cx = OX - A * e; seg(Cx - 10, OY - 10, Cx + 10, OY + 10, CR, z, 2); seg(Cx - 10, OY + 10, Cx + 10, OY - 10, CR, z, 2);
    label('中心', Cx, OY + 40, 20, CR, z, { bold: true }); label('太阳在焦点（偏离中心 c = ae）', 1010, 860, 24, GOLD, z, { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.42, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = 4 / (1 + cos θ)：', CR], ['什么曲线？', GOLD]], 880, 240, 36, t, P('C10', 0.05), { upright: true });
  const a = ap(t, 'C10', 0.2), OX = 960, OY = 580; polarGrid(OX, OY, 260, 3, a * 0.5); glowDot(OX, OY, 9, GOLD, a);
  if (t > S('D02')) { const k = ap(t, 'D02', 0.05); conic14(OX, OY, 40, q => 4 / (1 + Math.cos(q)), SQ.X.col, k, { lim: 380 });
    label('e = 1：抛物线', 1250, 760, 30, GOLD, ap(t, 'D02', 0.4), { bold: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C11', 0) * fadeOut(t, S('C12'), 0.4);
  if (ga > 0) {
    richReveal([['r = ed / (1 ± ', CR], ['e', SQ.X.col], [' cos θ)', CR]], CX, 330, 44, t, P('C11', 0.05), { upright: true, alpha: ga });
    [[0.5, '椭圆'], [1, '抛物线'], [1.5, '双曲线']].forEach(([e, n], i) => { const k = ap(t, 'C11', 0.3 + 0.15 * i) * ga, x = 700 + i * 280;
      conic14(x, 480, 30, q => e * 2 / (1 - e * Math.cos(q)), SQ.X.col, k, { lim: 110, w: 3 }); glowDot(x, 480, 5, GOLD, k); label(`e = ${e}：${n}`, x, 600, 24, CR, k, { bold: true }); });
  }
  if (t > S('C12') - 0.1) { glowText('下一段：月下小测', CX, 520, 50, CR, t, P('C12', 0.15)); glowText('Kimi · 全章收束', CX, 610, 32, SQ.K.col, t, P('C12', 0.45), { bold: false }); }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 10 章 · P14 行星轨道', '下一段：月下小测', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM10('Grok')]);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('X01', 0.05, 'riser', 0.18); s('X01', 0.4, 'whoosh', 0.16); s('C01', 0.15, 'pop', 0.16); s('C01', 0.3, 'pluck', 0.14); [0.15, 0.45, 0.8].forEach(f => s('C02', f, 'warp', 0.12)); s('C03', 0.2, 'ding', 0.2);
  s('G01', 0.1, 'pop', 0.16); s('G01', 0.6, 'ding', 0.18); s('C04', 0.1, 'marimba', 0.14); s('C04', 0.3, 'marimba', 0.14); s('C04', 0.6, 'pluck', 0.14);
  s('C05', 0.1, 'swell', 0.14); s('D01', 0.2, 'impact', 0.2); s('C06', 0.1, 'zap', 0.16);
  s('X02', 0.05, 'whoosh', 0.18); s('X02', 0.5, 'pop', 0.16); s('C07', 0.05, 'swell', 0.14); s('C07', 0.6, 'tick', 0.16); s('C07', 0.75, 'tick', 0.16); s('X03', 0.2, 'stamp', 0.24); s('C08', 0.3, 'ding', 0.18);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'swell', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C11', 0.05, 'pop', 0.18); s('C11', 0.3, 'pop', 0.16); s('C11', 0.45, 'pop', 0.16); s('C11', 0.6, 'pop', 0.16); s('C12', 0.15, 'swell', 0.3);
})();
finalize();
