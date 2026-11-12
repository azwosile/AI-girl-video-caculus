// 第 7 章 P13《辛普森法则》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.7 例 4、例 5。
// A329 每两段配一条抛物线 · A330 系数 1 4 2 4 … 4 1 节拍点亮 · A331 三种方法误差对数尺对比
const SC = {};
const TITLES = [['para', '用抛物线'], ['coef', '辛普森法则'], ['err', '误差'], ['use', '没有原函数也不怕'], ['quiz', '随堂一题'], ['outro', '小结']];
const W13 = x => 1 + 0.5 * Math.sin(1.6 * x) + 0.2 * x;
const GP = { cx: 560, cy: 720, ux: 150, uy: 220, x0: -0.1, x1: 4.2, y0: -0.05, y1: 2.1 };

// ======================= 抛物线（A329） =======================
SC.para = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'Q01', 0.1); seg(gx(GP, 0), gy(GP, 0), gx(GP, 4.1), gy(GP, 0), CR, a * 0.6, 2);
  gPlot(GP, W13, CYAN, { a, xa: 0, xb: 4, w: 4 });
  const tr = fadeOut(t, S('C01') + 0.2, 0.5); gTrap(GP, W13, 0, 4, 4, '#8FA3C8', a * tr * ap(t, 'Q01', 0.4), { fa: 0.15 });
  if (t < S('C01') + 0.6) label('直线：寒酸', gx(GP, 2), 290, 26, '#8FA3C8', a * tr * ap(t, 'Q01', 0.4), { bold: true });
  if (t > S('C01')) {
    const p1 = ap(t, 'C01', 0.3), p2 = ap(t, 'C01', 0.6);
    gSimpson(GP, W13, 0, 2, 2, SQ.Q.col, p1, { fa: 0.3 }); gSimpson(GP, W13, 2, 4, 2, GOLD, p2, { fa: 0.3 });
    label('抛物线 ①', gx(GP, 1), 300, 22, SQ.Q.col, p1, { bold: true }); label('抛物线 ②', gx(GP, 3), 300, 22, GOLD, p2, { bold: true });
  }
  if (t > S('C02')) { darkBox(900, 330, 300, 90, ap(t, 'C02', 0.1)); label('第 5 章 · 阿基米德', 1050, 360, 22, GOLD, ap(t, 'C02', 0.1), { bold: true }); label('抛物线弓形 = 4/3 三角形', 1050, 395, 18, CR, ap(t, 'C02', 0.3), {}); }
};

// ======================= 系数节拍（A330） =======================
const CO13 = [1, 4, 2, 4, 2, 4, 2, 4, 2, 4, 1];
SC.coef = t => {
  starfield(t); blueprint(0.35, 80);
  mathText('Sₙ = (Δx/3) (f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4fₙ₋₁ + fₙ)', 860, 270, 28, CR, { align: 'center', alpha: ap(t, 'G01', 0.05), upright: true });
  richReveal([['n 必须是偶数', RED]], 860, 330, 26, t, P('G01', 0.7), { upright: true });
  const t0 = P('Q02', 0.0), beat = 0.28;
  CO13.forEach((c, i) => {
    const x = 600 + i * 52, ti = t0 + i * beat, a = ap(t, 'G01', 0.3), hit = t > ti ? Math.exp(-(t - ti) * 4) : 0, col = c === 4 ? SQ.Q.col : c === 2 ? CYAN : GOLD;
    const r = 20 + 10 * hit; glowDot(x, 470, r * 0.35, col, a * (0.4 + 0.6 * (t > ti ? 1 : 0)));
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, 470, r, 0, 7); ctx.stroke(); ctx.restore();
    label(String(c), x, 470, 22 + 8 * hit, col, a, { bold: true }); label('f' + (i < 10 ? '₀₁₂₃₄₅₆₇₈₉'[i] : '₁₀'), x, 525, 16, CR, a * 0.7, {});
  });
  label('1 · 4 · 2 · 4 · … · 4 · 1', 860, 600, 30, SQ.Q.col, ap(t, 'Q02', 0.6), { bold: true });
};

// ======================= 误差对数尺（A331） =======================
SC.err = t => {
  starfield(t); blueprint(0.35, 80);
  codeWin(t, 560, 240, 420, [[[['S₁₀ = 0.693150', SQ.Q.col]], P('C03', 0.2), 0.5], [[['ln 2 = 0.693147', CR]], P('C03', 0.45), 0.5]], P('C03', 0.05), { title: '∫₁² dx/x · n = 10', sz: 24 });
  if (t > S('G02')) { mathText('|E_S| ≤ K(b − a)⁵ / (180n⁴)', 1100, 290, 24, GOLD, { align: 'center', alpha: ap(t, 'G02', 0.05), upright: true }); richReveal([['n × 2  ⇒  误差 × ', CR], ['1/16', GOLD]], 1100, 350, 24, t, P('G02', 0.6), { upright: true }); }
  if (t > S('C04')) {
    // 对数尺：10⁻² … 10⁻⁶
    const x0 = 600, x1 = 1180, y = 560, a = ap(t, 'C04', 0.05), lx = e => lerp(x0, x1, (-Math.log10(e) - 2) / 4);
    seg(x0, y, x1, y, CR, a * 0.7, 2);
    [2, 3, 4, 5, 6].forEach(k => { seg(lx(10 ** -k), y - 8, lx(10 ** -k), y + 8, CR, a * 0.7, 2); label(`10⁻${'⁰¹²³⁴⁵⁶'[k]}`, lx(10 ** -k), y + 30, 18, CR, a * 0.8, {}); });
    [['T₁₀', 6.24e-4, GOLD, 0.15], ['M₁₀', 3.12e-4, SQ.H.col, 0.3], ['S₁₀', 3.05e-6, SQ.Q.col, 0.5]].forEach(([n, e, c, f], k) => {
      const q = eOut(prog(t, P('C04', f), 0.6)), xe = lerp(x0, lx(e), q), yy = y - 50 - k * 40;
      seg(x0, yy, xe, yy, c, a, 8); label(n, x0 - 36, yy, 20, c, a * (q > 0 ? 1 : 0), { bold: true }); if (q >= 1) glowDot(xe, yy, 6, c, a);
    });
    label('误差越小 →', 1100, y + 70, 20, CR, a * 0.7, {});
  }
};

// ======================= 没有原函数也不怕 =======================
const GU = { cx: 600, cy: 720, ux: 480, uy: 150, x0: -0.05, x1: 1.1, y0: -0.05, y1: 2.9 };
SC.use = t => {
  starfield(t); blueprint(0.35, 80);
  mathText('∫₀¹ e^{x²} dx', 860, 270, 34, CR, { align: 'center', alpha: ap(t, 'Q03', 0.1), upright: true });
  const a = ap(t, 'Q03', 0.3), f = x => Math.exp(x * x);
  seg(gx(GU, 0), gy(GU, 0), gx(GU, 1.05), gy(GU, 0), CR, a * 0.6, 2); gPlot(GU, f, CYAN, { a, xa: 0, xb: 1, w: 4 });
  if (t > S('C05')) { gSimpson(GU, f, 0, 1, 10, SQ.Q.col, ap(t, 'C05', 0.1), { fa: 0.25, w: 1.5 }); goldBox(1000, 400, 320, 64, 'S₁₀ ≈ 1.462681', 28, ap(t, 'C05', 0.4)); label('← P11：写不出公式', 1000, 460, 20, SQ.M.col, ap(t, 'C05', 0.6), { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 520, 100, 'S₂', '∫₀² x³ dx ≈ ？', t, P('C07', 0.05), { size: 36 });
  if (t > S('Q04')) {
    richReveal([['(1/3)(0 + 4·1 + 8) = ', CR], ['4', GOLD]], 820, 530, 34, t, P('Q04', 0.05), { upright: true });
    richReveal([['真值 = 4 ', CR], ['✓ 三次多项式精确', GRN]], 820, 620, 30, t, P('Q04', 0.55), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { const a = ap(t, 'C08', 0.05) * fa; gPlot(GP, W13, CYAN, { a, xa: 0, xb: 4, w: 3 }); gSimpson(GP, W13, 0, 4, 4, SQ.Q.col, a * 0.8, { fa: 0.25 }); richReveal([['1/n²', '#8FA3C8'], ['  →  ', CR], ['1/n⁴', SQ.Q.col]], 860, 290, 44, t, P('C08', 0.3), { upright: true, alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：反常积分 · 比较判别法', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('Kimi 的 p 积分标尺', CX, 610, 32, SQ.K.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P13 辛普森法则', '下一段：比较判别', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM7('千问（Qwen）')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Q01', 0.4, 'pop', 0.18); s('C01', 0.3, 'swell', 0.16); s('C01', 0.6, 'swell', 0.16); s('C02', 0.1, 'shimmer', 0.16);
  s('G01', 0.05, 'pop', 0.18); s('G01', 0.7, 'buzz', 0.12); CO13.forEach((c, i) => sfx(P('Q02', 0) + i * 0.28, c === 4 ? 'marimba' : 'tick', 0.14));
  s('C03', 0.2, 'type', 0.14); s('C03', 0.45, 'type', 0.12); s('G02', 0.6, 'ding', 0.18); [0.15, 0.3, 0.5].forEach(f => s('C04', f, 'whoosh', 0.14));
  s('Q03', 0.3, 'pop', 0.18); s('C05', 0.1, 'swell', 0.16); s('C05', 0.4, 'ding_hi', 0.24);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('Q04', 0.05, 'ding_hi', 0.28); s('Q04', 0.55, 'check', 0.22);
  s('C08', 0.3, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
