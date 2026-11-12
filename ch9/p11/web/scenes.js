// 第 9 章 P11《伯努利方程》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 7.4。
// A416 骑士“变身”：yⁿ 被盾牌罩住，变成 z = y^(1−n) · A417 例题推导 + 解族 y = 1/(1+Ceˣ) · A418 logistic 也是伯努利
const SC = {};
const TITLES = [['def', '骑士变身'], ['ex', '例题'], ['link', '回看 logistic'], ['quiz', '随堂一题'], ['outro', '小结']];

const GB11 = { cx: 560, cy: 760, ux: 105, uy: 300, x0: 0, x1: 6, y0: 0, y1: 1.25 };
const CS11 = [0.05, 0.3, 1, 4];
const LP11 = t => 1000 / (1 + 9 * Math.exp(-0.08 * t));
const GL11 = { cx: 600, cy: 760, ux: 6.5, uy: 0.27, x0: 0, x1: 90, y0: 0, y1: 1150 };

// 一面简单的盾牌徽记（原创几何）
function shield11(x, y, s, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-40, -46); ctx.lineTo(40, -46); ctx.lineTo(40, 0); ctx.quadraticCurveTo(36, 36, 0, 54); ctx.quadraticCurveTo(-36, 36, -40, 0); ctx.closePath();
  ctx.fillStyle = 'rgba(255,138,61,0.16)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(0, 40); ctx.moveTo(-28, -8); ctx.lineTo(28, -8); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
}

// ======================= 骑士变身（A416） =======================
SC.def = t => {
  starfield(t); blueprint(0.3, 80);
  const RC = SQ.R.col;
  if (t > S('C01') - 0.1) goldBox(870, 250, 520, 66, 'y′ + P(x)y = Q(x)yⁿ', 34, ap(t, 'C01', 0.1));
  if (t > S('C01')) label('n ≠ 0, 1', 870, 320, 26, GOLD, ap(t, 'C01', 0.6), { bold: true });
  if (t > S('R02') - 0.1) {
    const k = ap(t, 'R02', 0.1), sp = prog(t, P('R02', 0.1), 0.8);
    shield11(870, 450, 1.0 + 0.15 * Math.sin(sp * Math.PI), RC, k);
    for (let i = 0; i < 10; i++) { const ang = i * Math.PI / 5 + t * 0.6, r = 80 + 30 * sp; gDotRaw(870 + r * Math.cos(ang), 450 + r * Math.sin(ang), 3, RC, k * (1 - sp * 0.6)); }
    glowText('z = y¹⁻ⁿ', 870, 580, 40, RC, t, P('R02', 0.4));
  }
  if (t > S('C02')) {
    const k = ap(t, 'C02', 0.1); panel(600, 640, 540, 90, CYAN, k);
    mathText('dz/dx + (1−n)P z = (1−n)Q', 870, 695, 32, CR, { alpha: k, upright: true, align: 'center' });
    label('一阶线性 ✓', 870, 765, 24, GRN, ap(t, 'C02', 0.5), { bold: true });
  }
};
function gDotRaw(x, y, r, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); }

// ======================= 例题（A417） =======================
SC.ex = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C03', 0) * fadeOut(t, S('R03'), 0.4);
  if (ga > 0) {
    richReveal([['y′ + y = y²', CR], ['，n = 2  ⇒  ', CR], ['z = 1/y', SQ.R.col]], 870, 250, 34, t, P('C03', 0.1), { upright: true, alpha: ga });
    if (t > S('G01')) richReveal([['z′ = −y′/y²  ⇒  ', CR], ['z′ − z = −1', CYAN]], 870, 350, 34, t, P('G01', 0.1), { upright: true, alpha: ga });
    if (t > S('C04')) { richReveal([['z = 1 + Ceˣ', CR]], 870, 440, 34, t, P('C04', 0.1), { upright: true, alpha: ga }); goldBox(870, 540, 380, 66, 'y = 1/(1 + Ceˣ)', 34, ap(t, 'C04', 0.55) * ga); }
  }
  if (t > S('R03') - 0.1) {
    const a = ap(t, 'R03', 0);
    gAxes(GB11, a * 0.75, { grid: false, ticks: { x: [[2, '2'], [4, '4'], [6, '6']], y: [[1, '1']] } });
    goldBox(1000, 240, 360, 60, 'y = 1/(1 + Ceˣ)', 30, a);
    gH(GB11, 1, GOLD, a * 0.5, { dash: [8, 6] });
    CS11.forEach((C, i) => gPlot(GB11, x => 1 / (1 + C * Math.exp(x)), [SQ.R.col, GOLD, CYAN, GRN][i], { a, w: 4, p: prog(t, P('R03', 0.1 + 0.12 * i), 0.7) }));
    label('C 越大，滑得越早', 1020, 330, 26, SQ.R.col, ap(t, 'R03', 0.6), { bold: true });
  }
};

// ======================= 回看 logistic（A418） =======================
SC.link = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['dP/dt = kP − ', CR], ['(k/M)P²', GOLD]], 870, 250, 36, t, P('C05', 0.1), { upright: true });
  if (t > S('D01')) { const k = ap(t, 'D01', 0.2); panel(720, 300, 300, 60, GOLD, k); label('n = 2 的伯努利！', 870, 340, 28, GOLD, k, { bold: true }); }
  if (t > S('C06') - 0.1) {
    const a = ap(t, 'C06', 0);
    richReveal([['z = 1/P  ⇒  ', SQ.R.col], ['P = M/(1 + Ae^{−kt})', CR]], 870, 405, 32, t, P('C06', 0.05), { upright: true });
    gAxes(GL11, a * 0.75, { grid: false, ticks: { x: [[30, '30'], [60, '60'], [90, '90']], y: [[1000, '1000']] } });
    gH(GL11, 1000, GOLD, a * 0.5, { dash: [8, 6] });
    gPlot(GL11, LP11, SQ.B.col, { a, w: 5, p: prog(t, P('C06', 0.2), 0.7) });
    checkMark(1190, 405, 24, GRN, t, P('C06', 0.7));
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['y′ + y = y³', CR], ['  z = ?', GOLD]], 860, 260, 40, t, P('C08', 0.05), { upright: true });
  if (t > S('D02')) { richReveal([['n = 3  ⇒  ', CR], ['z = y⁻²', GOLD]], 860, 370, 40, t, P('D02', 0.15), { upright: true }); checkMark(1080, 370, 26, GRN, t, P('D02', 0.5)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) richReveal([['z = y¹⁻ⁿ  ⇒  ', CR], ['一阶线性', GOLD]], CX, 400, 48, t, P('C09', 0.05), { upright: true, alpha: ga });
  if (t > S('C10') - 0.1) { glowText('下一段：可降阶的高阶方程', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Kimi：把 y′ 记成 p', CX, 610, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 9 章 · P11 伯努利方程', '下一段：可降阶', [...CREDIT_BASE, ...CREDIT_GEN('Mistral '), ...CREDIT_END, CREDIT_TM9('Mistral')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('R01', 0.05, 'sting', 0.2); s('C01', 0.1, 'ding', 0.2); s('C01', 0.6, 'pop', 0.14); s('R02', 0.1, 'warp', 0.2); s('R02', 0.4, 'shimmer', 0.18); s('C02', 0.1, 'pop', 0.16); s('C02', 0.5, 'check', 0.18);
  s('C03', 0.1, 'pop', 0.16); s('G01', 0.1, 'pop', 0.16); s('C04', 0.1, 'pop', 0.16); s('C04', 0.55, 'ding', 0.2); s('R03', 0.1, 'swoosh_in', 0.16); s('R03', 0.6, 'sparkle', 0.14);
  s('C05', 0.1, 'pop', 0.16); s('D01', 0.05, 'impact', 0.18); s('D01', 0.2, 'ding_hi', 0.18); s('C06', 0.05, 'pop', 0.16); s('C06', 0.7, 'check', 0.2);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'whoosh', 0.14); s('D02', 0.5, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
