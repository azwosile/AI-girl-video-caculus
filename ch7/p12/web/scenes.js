// 第 7 章 P12《梯形法则与中点法则》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.7 例 1、例 2。
// A326 梯形与中点矩形对比 · A327 误差柱状图（n 翻倍 → 1/4） · A328 凹函数上梯形偏大、中点偏小
const SC = {};
const TITLES = [['rules', '两条法则'], ['calc', '按计算器'], ['bound', '误差界'], ['quiz', '随堂一题'], ['outro', '小结']];
const INV12 = x => 1 / x, LN2 = Math.log(2);

// ======================= 两条法则（A326） =======================
const GL = { cx: 336, cy: 690, ux: 240, uy: 330, x0: 0.85, x1: 2.15, y0: -0.05, y1: 1.12 };   // 左图
const GR = { cx: 696, cy: 690, ux: 240, uy: 330, x0: 0.85, x1: 2.15, y0: -0.05, y1: 1.12 };   // 右图（x 平移）
const shift = (G, dx) => Object.assign({}, G, { cx: G.cx + dx });
SC.rules = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C02')) { kinetic('矩形 → 升级', 860, 420, 54, t, P('C01', 0.3), { col: SQ.H.col }); return; }
  const g1 = shift(GL, 0), g2 = shift(GR, 0);
  const a1 = ap(t, 'C02', 0.05), a2 = ap(t, 'G01', 0.05);
  [[g1, a1], [g2, a2]].forEach(([G, a]) => { if (a <= 0) return; seg(gx(G, 0.9), gy(G, 0), gx(G, 2.1), gy(G, 0), CR, a * 0.6, 2); gPlot(G, INV12, CYAN, { a, xa: 0.9, xb: 2.1, w: 3 }); });
  gTrap(g1, INV12, 1, 2, 5, GOLD, a1 * ap(t, 'C02', 0.2), { fa: 0.22 });
  gRects(g2, INV12, 1, 2, 5, 'M', SQ.H.col, a2 * ap(t, 'G01', 0.2));
  if (a2 > 0) for (let i = 0; i < 5; i++) { const xm = 1.1 + i * 0.2; glowDot(gx(g2, xm), gy(g2, INV12(xm)), 5, SQ.H.col, a2 * ap(t, 'G01', 0.4)); }
  label('梯形 Tₙ', gx(g1, 1.5), 280, 28, GOLD, a1, { bold: true }); label('中点 Mₙ', gx(g2, 1.5), 280, 28, SQ.H.col, a2, { bold: true });
  mathText('(Δx/2)(f₀ + 2f₁ + … + 2fₙ₋₁ + fₙ)', gx(g1, 1.5), 330, 18, CR, { align: 'center', alpha: ap(t, 'C02', 0.5), upright: true });
  mathText('Δx (f(x̄₁) + … + f(x̄ₙ))', gx(g2, 1.5), 330, 18, CR, { align: 'center', alpha: ap(t, 'G01', 0.5), upright: true });
};

// ======================= 计算器 + 误差柱（A327） =======================
function bar12(x, base, h, col, a, lab) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.6); ctx.strokeStyle = col; ctx.lineWidth = 2; const y = h > 0 ? base - h : base; ctx.fillRect(x - 24, y, 48, Math.abs(h)); ctx.strokeRect(x - 24, y, 48, Math.abs(h)); ctx.restore(); if (lab) label(lab, x, h > 0 ? base - h - 18 : base - h + 18, 18, col, a, {}); }
SC.calc = t => {
  starfield(t); blueprint(0.35, 80);
  codeWin(t, 560, 240, 420, [[[['T₅ = 0.695635', GOLD]], P('H01', 0.45), 0.5], [[['M₅ = 0.691908', SQ.H.col]], P('H01', 0.75), 0.5], [[['ln 2 = 0.693147', CR]], P('C03', 0.05), 0.5]], P('H01', 0.1), { title: '∫₁² dx/x · n = 5', sz: 24 });
  if (t > S('C03')) {
    const base = 600, sc = 30000, a = ap(t, 'C03', 0.4);
    seg(1010, base, 1290, base, CR, a * 0.7, 2); label('误差', 1150, 400, 22, CR, a, { bold: true });
    bar12(1070, base, -0.002488 * sc, GOLD, a, 'E_T −0.0025'); bar12(1150, base, 0.001239 * sc, SQ.H.col, ap(t, 'C03', 0.6), 'E_M +0.0012');
    if (t > S('C04')) {
      const b = ap(t, 'C04', 0.5); bar12(1230, base, -0.000624 * sc, hexA(GOLD, 0.8), b, ''); bar12(1290, base, 0.000312 * sc, hexA(SQ.H.col, 0.8), b, '');
      label('n = 10', 1260, base + 110, 18, CR, b, {});
      richReveal([['|E_M| ≈ ½|E_T|', SQ.H.col], ['   符号相反', CR]], 770, 520, 26, t, P('C04', 0.1), { upright: true });
      richReveal([['n × 2  ⇒  误差 × ', CR], ['¼', GOLD]], 770, 600, 28, t, P('C04', 0.55), { upright: true });
    }
  }
};

// ======================= 误差界 + 凹性（A328） =======================
const GZ = { cx: -1300, cy: 1554, ux: 1500, uy: 1423, x0: 1.18, x1: 1.62, y0: 0.6, y1: 0.86 };   // 放大 [1.2,1.6]
SC.bound = t => {
  starfield(t); blueprint(0.35, 80);
  const f1 = fadeOut(t, S('C05'), 0.3);
  if (f1 > 0) {
    darkBox(540, 260, 660, 180, ap(t, 'G02', 0.05) * f1);
    mathText('|E_T| ≤ K(b − a)³ / (12n²)', 870, 320, 30, GOLD, { align: 'center', alpha: ap(t, 'G02', 0.1) * f1, upright: true });
    mathText('|E_M| ≤ K(b − a)³ / (24n²)', 870, 385, 30, SQ.H.col, { align: 'center', alpha: ap(t, 'G02', 0.45) * f1, upright: true });
    richReveal([['K ≥ |f″(x)|', CYAN]], 870, 500, 28, t, P('G02', 0.75), { upright: true, alpha: f1 });
  }
  if (t > S('C05')) {
    const a = ap(t, 'C05', 0.05), G = Object.assign({}, GZ, { cx: 560 - 1.2 * 1500 + 30 });
    gPlot(G, INV12, CYAN, { a, xa: 1.2, xb: 1.6, w: 4 });
    // 梯形：一段 [1.2,1.6] 的斜边
    seg(gx(G, 1.2), gy(G, INV12(1.2)), gx(G, 1.6), gy(G, INV12(1.6)), GOLD, a, 3.5);
    // 中点矩形顶
    const ym = INV12(1.4); seg(gx(G, 1.2), gy(G, ym), gx(G, 1.6), gy(G, ym), SQ.H.col, a * ap(t, 'C05', 0.5), 3.5);
    label('梯形：偏大', gx(G, 1.4) + 20, gy(G, (INV12(1.2) + INV12(1.6)) / 2) - 26, 22, GOLD, a, { bold: true });
    label('中点：偏小', gx(G, 1.4), gy(G, ym) + 30, 22, SQ.H.col, ap(t, 'C05', 0.5), { bold: true });
    label('凹向上', gx(G, 1.25), gy(G, 0.62), 20, CYAN, a, {});
  }
  if (t > S('H02')) goldBox(1060, 300, 360, 64, 'K = 2,  |E_T| ≤ 0.0067', 26, ap(t, 'H02', 0.2));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 560, 100, 'n = ?', '|E_T| < 0.0001', t, P('C07', 0.05), { size: 34 });
  if (t > S('H03')) {
    richReveal([['2 / (12n²) < 0.0001', CR]], 820, 530, 32, t, P('H03', 0.05), { upright: true });
    richReveal([['n > 40.8  ⇒  ', CR], ['n = 41', GOLD]], 820, 620, 36, t, P('H03', 0.5), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { const g1 = shift(GL, 60), a = ap(t, 'C08', 0.05) * fa; gPlot(g1, INV12, CYAN, { a, xa: 0.9, xb: 2.1, w: 3 }); gTrap(g1, INV12, 1, 2, 5, GOLD, a * 0.8, { fa: 0.18 }); gRects(g1, INV12, 1, 2, 5, 'M', SQ.H.col, a * 0.6); richReveal([['梯形偏大 · 中点偏小', CR]], 1080, 360, 32, t, P('C08', 0.3), { alpha: fa }); richReveal([['|E_M| ≈ ½|E_T|', GOLD]], 1080, 440, 32, t, P('C08', 0.55), { upright: true, alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：辛普森法则', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('千问：直线太寒酸，用抛物线', CX, 610, 32, SQ.Q.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P12 梯形与中点', '下一段：辛普森', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM7('混元（Hunyuan）')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.3, 'pop', 0.2); s('C02', 0.2, 'swell', 0.14); s('G01', 0.2, 'swell', 0.14); s('G01', 0.4, 'marimba', 0.12);
  s('H01', 0.45, 'type', 0.14); s('H01', 0.75, 'type', 0.14); s('C03', 0.05, 'type', 0.12); s('C03', 0.4, 'pop', 0.16); s('C04', 0.5, 'pop', 0.16); s('C04', 0.55, 'ding', 0.18);
  s('G02', 0.1, 'pop', 0.16); s('G02', 0.45, 'pop', 0.16); s('C05', 0.05, 'warp', 0.14); s('H02', 0.2, 'ding_hi', 0.24);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('H03', 0.5, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
