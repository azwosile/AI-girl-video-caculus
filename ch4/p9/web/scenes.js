// 第 4 章 P9《其他未定式与第二个重要极限》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A152 七种未定式卡牌 · A153 复利结算次数滑块，金额逼近 e · A154 取对数“降幂”：指数掉下来变成乘数 · A155 xˣ 在 0⁺ 附近趋于 1
const SC = {};
const TITLES = [['cards', '七种未定式'], ['money', '千问的复利'], ['log', '取对数降幂'], ['more', '更多幂指型'], ['quiz', '随堂一题'], ['outro', '小结']];
const CARDS = ['0/0', '∞/∞', '0·∞', '∞−∞', '1^∞', '0^0', '∞^0'];
function drawCards(t, y, a, hi) {
  CARDS.forEach((s, i) => {
    const x = 630 + i * 104, p = a * eIO(prog(t, P('C01', 0.08 + i * 0.07), 0.35)); if (p <= 0) return;
    const direct = i < 2, c = direct ? GRN : SQ.Q.col, on = hi === i;
    ctx.save(); ctx.globalAlpha *= p; ctx.translate(x + 46, y + 60); const s0 = on ? 1.12 : 1; ctx.scale(s0, s0);
    rr(-46, -60, 92, 120, 12); ctx.fillStyle = on ? hexA(c, 0.28) : 'rgba(20,24,40,0.85)'; ctx.fill(); ctx.lineWidth = on ? 4 : 2; ctx.strokeStyle = c; ctx.stroke(); ctx.restore();
    mathText(s, x + 46, y + 60, 30, c, { align: 'center', alpha: p, upright: true, glow: on ? 12 : 4 });
  });
  label('直接用', 630 + 98, y + 150, 20, GRN, a * ap(t, 'C01', 0.55)); label('先变形', 630 + 104 * 4.5, y + 150, 20, SQ.Q.col, a * ap(t, 'C01', 0.75));
}

// ======================= 七种未定式（A152） =======================
SC.cards = t => {
  starfield(t); blueprint(0.4, 80);
  const hi = t > S('C03') ? 3 : t > S('C02') ? 2 : -1;
  drawCards(t, 200, 1, hi);
  if (t > S('C02') - 0.1 && t < S('C03')) {
    const o = S('C03') - 0.1;
    richReveal([['lim', CR], ['  x · sin(2/x)', RED], ['   (x → ∞)', CR]], CX, 480, 34, t, P('C02', 0.1), { upright: true, out: o });
    richReveal([['= lim  sin(2/x) / (1/x)', CYAN], ['   0/0', GOLD]], CX, 570, 34, t, P('C02', 0.45), { upright: true, out: o });
    richReveal([['= lim  2cos(2/x) = ', CYAN], ['2', GOLD]], CX, 660, 38, t, P('C02', 0.75), { upright: true, out: o });
  }
  if (t > S('C03') - 0.1) {
    richReveal([['lim', CR], ['  1/sin x − 1/x', RED], ['   (x → 0)', CR]], CX, 480, 34, t, P('C03', 0.1), { upright: true });
    richReveal([['= lim  (x − sin x) / (x sin x)', CYAN], ['   0/0', GOLD]], CX, 570, 34, t, P('C03', 0.4), { upright: true });
    richReveal([['= lim  (1 − cos x) / (sin x + x cos x) = ', CYAN], ['0', GOLD]], CX, 660, 32, t, P('C03', 0.7), { upright: true });
  }
};

// ======================= 复利（A153） =======================
const GM = { cx: 660, cy: 1444, ux: 165, uy: 380, x0: 0, x1: 4, y0: 1.8, y1: 2.9 };
const NS = [1, 2, 4, 12, 52, 365, 10000];
SC.money = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('Q02') - 0.1) {
    const a = ap(t, 'Q01', 0.05);
    richReveal([['本金 ¥1', CR], ['   ×   (1 + 100%)', SQ.Q.col], ['   =   ¥2', GOLD]], CX, 420, 44, t, P('Q01', 0.35), { upright: true });
    label('一年结算一次', CX, 520, 26, hexA(CR, 0.7), ap(t, 'Q01', 0.6));
    if (t > P('Q01', 0.1)) slab('千问请客', CX, 300, 26, t, P('Q01', 0.1), { bg: SQ.Q.col, c: COL.ink });
    return;
  }
  const a = ap(t, 'Q02', 0);
  gAxes(GM, a, { grid: false, ticks: { x: [[0, '1'], [1, '10'], [2, '100'], [3, '1000'], [4, '10⁴']], y: [[2, '2'], [2.5, '2.5']] }, xl: 'n' });
  gH(GM, Math.E, GOLD, a * 0.75, { dash: [10, 8] }); label('e ≈ 2.718', 1290, gy(GM, Math.E) - 26, 22, GOLD, a, { font: F_MATH });
  richReveal([['(1 + 1/n)^n', SQ.Q.col]], 800, 250, 36, t, P('Q02', 0.05), { upright: true });
  let last = -1;
  NS.forEach((n, i) => {
    const f = 0.22 + i * 0.09, p = ap(t, 'Q02', f); if (p <= 0) return; last = i;
    const v = Math.pow(1 + 1 / n, n), X = Math.log10(n);
    gDot(GM, X, v, SQ.Q.col, p);
    if (i) { const n0 = NS[i - 1], v0 = Math.pow(1 + 1 / n0, n0); gLine(GM, (v - v0) / (X - Math.log10(n0)), Math.log10(n0), v0, Math.log10(n0), X, hexA(SQ.Q.col, 0.6), p * 0.6, 2.5); }
  });
  if (last >= 0) { const n = NS[last], v = Math.pow(1 + 1 / n, n); mathText(`n = ${n}   →   ¥${v.toFixed(4)}`, 1150, 250, 28, CR, { align: 'center', alpha: a, upright: true }); }
  if (t > S('D01') - 0.1) { const d = ap(t, 'D01', 0.05); panel(820, 560, 360, 120, RED, d); richReveal([['1^∞ = 1 ？', RED]], 1000, 620, 44, t, P('D01', 0.1), { upright: true }); }
};

// ======================= 取对数降幂（A154） =======================
SC.log = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C04', 0);
  slab('1^∞ 也是未定式', CX, 220, 28, t, P('C04', 0.05), { bg: RED });
  // 降幂动画
  const q = eIO(prog(t, P('C04', 0.5), 1.0)), y = 360;
  if (t < S('G01') - 0.1) {
    mathText('ln', lerp(CX - 150, CX - 205, q), y, 44, CYAN, { align: 'center', alpha: a * ap(t, 'C04', 0.4), upright: true, glow: 8 });
    mathText('(1 + 1/x)', CX + 10, y, 44, SQ.Q.col, { align: 'center', alpha: a, upright: true, glow: 8 });
    const ex = lerp(CX + 115, CX - 140, q), ey = lerp(y - 34, y, q), es = lerp(30, 44, q);
    mathText('x', ex, ey, es, GOLD, { align: 'center', alpha: a, glow: 14 });
    if (q > 0.95) mathText('·', CX - 112, y, 44, CR, { align: 'center', alpha: a, upright: true });
    if (q > 0 && q < 1) seg(CX + 115, y - 34, ex, ey, hexA(GOLD, 0.5), a * 0.6, 2, [6, 6]);
    label('指数掉下来，变成乘数', CX, y + 70, 24, GOLD, ap(t, 'C04', 0.75));
  }
  if (t > S('C05') - 0.1 && t < S('G01') - 0.1) {
    const o = S('G01') - 0.1;
    richReveal([['∞ · 0', GOLD], ['  →  ', CR], ['ln(1 + 1/x) / (1/x)', CYAN], ['   0/0', GOLD]], CX, 540, 32, t, P('C05', 0.1), { upright: true, out: o });
    richReveal([['洛必达  →  ', CR], ['1', GRN]], CX, 630, 36, t, P('C05', 0.45), { upright: true, out: o });
    richReveal([['原式  →  e^1 = ', CR], ['e', GOLD]], CX, 720, 40, t, P('C05', 0.75), { upright: true, out: o });
  }
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0);
    panel(640, 330, 720, 400, GOLD, g * 0.9); label('第二个重要极限（同济）', CX, 375, 26, GOLD, g, { bold: true });
    richReveal([['lim', CR], ['  (1 + 1/x)^x', SQ.Q.col], ['  =  e', GOLD], ['   (x → ∞)', CR]], CX, 480, 42, t, P('G01', 0.15), { upright: true });
    richReveal([['lim', CR], ['  (1 + x)^{1/x}', SQ.Q.col], ['  =  e', GOLD], ['   (x → 0)', CR]], CX, 610, 42, t, P('G01', 0.6), { upright: true });
    if (t > P('G01', 0.3)) burst(t, P('G01', 0.3), CX + 130, 470, GOLD, 70, 10);
  }
};

// ======================= 更多幂指型（A155） =======================
const GX = { cx: 680, cy: 700, ux: 380, uy: 220, x0: 0, x1: 1.6, y0: 0, y1: 1.8 };
SC.more = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C07') - 0.1) {
    const a = ap(t, 'C06', 0);
    gAxes(GX, a, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] }, xl: 'x' });
    gPlot(GX, x => Math.pow(x, x), SQ.Q.col, { a, xa: 0.003, xb: 1.55, p: eIO(prog(t, P('C06', 0.15), 1.4)), n: 400 });
    gH(GX, 1, GOLD, a * 0.5, { dash: [8, 8] });
    if (t > P('C06', 0.7)) { const k = 0.5 + 0.5 * Math.sin(t * 4); gDot(GX, 0, 1, GOLD, ap(t, 'C06', 0.7), true); label('→ 1', gx(GX, 0) + 50, gy(GX, 1) - 30, 24, GOLD, ap(t, 'C06', 0.7) * (0.6 + 0.4 * k), { font: F_MATH }); }
    richReveal([['0^0', GOLD], ['：  x^x  →  ln：x ln x → 0  →  ', CR], ['1', GOLD]], CX, 210, 32, t, P('C06', 0.3), { upright: true });
    mathText('y = x^x', 1240, 290, 28, SQ.Q.col, { align: 'center', alpha: a, upright: true });
    return;
  }
  if (t < S('Q03') - 0.1) {
    const o = S('Q03') - 0.1;
    richReveal([['1^∞', GOLD], ['：  lim', CR], ['  x^{1/(1−x)}', SQ.Q.col], ['   (x → 1)', CR]], CX, 300, 36, t, P('C07', 0.05), { upright: true, out: o });
    richReveal([['ln：  ln x / (1 − x)', CYAN], ['   0/0', GOLD]], CX, 410, 34, t, P('C07', 0.35), { upright: true, out: o });
    richReveal([['洛必达：  (1/x) / (−1)  →  −1', CYAN]], CX, 510, 34, t, P('C07', 0.55), { upright: true, out: o });
    richReveal([['原式  →  e^{−1} = ', CR], ['1/e', GOLD]], CX, 620, 40, t, P('C07', 0.8), { upright: true, out: o });
    return;
  }
  const q = ap(t, 'Q03', 0);
  panel(630, 240, 740, 600, SQ.Q.col, q * 0.8); label('课件同类题', CX, 275, 24, SQ.Q.col, q, { bold: true });
  richReveal([['① ', CR], ['(sin 2/x + cos 1/x)^x', SQ.Q.col], ['  (x → ∞)', CR]], CX, 340, 28, t, P('Q03', 0.08), { upright: true });
  richReveal([['令 t = 1/x：ln(sin 2t + cos t)/t  →  2', CYAN]], CX, 400, 25, t, P('Q03', 0.18), { upright: true });
  richReveal([['答案  ', CR], ['e^2', GOLD]], CX, 460, 32, t, P('Q03', 0.28), { upright: true });
  richReveal([['② ', CR], ['(cot x)^{1/ln x}', SQ.Q.col], ['  (x → 0⁺)', CR]], CX, 570, 28, t, P('Q03', 0.42), { upright: true });
  richReveal([['ln cot x / ln x  →  −x/(sin x cos x)  →  −1', CYAN]], CX, 630, 25, t, P('Q03', 0.52), { upright: true });
  richReveal([['答案  ', CR], ['1/e', GOLD]], CX, 690, 32, t, P('Q03', 0.62), { upright: true });
  if (t > P('Q03', 0.75)) slab('再算一遍就是了～', CX, 790, 26, t, P('Q03', 0.75), { bg: SQ.Q.col, c: COL.ink });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['lim', CR], ['  (1 + 2/x)^x', RED], ['   (x → ∞)', CR]], 880, 300, 46, t, P('C09', 0.1), { upright: true });
  if (t > S('D02')) { richReveal([['ln：  x ln(1 + 2/x)  →  2', CYAN]], 900, 470, 34, t, P('D02', 0.1), { upright: true }); richReveal([['答案  ', CR], ['e^2', GOLD]], 900, 590, 48, t, P('D02', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; drawCards(t, 300, 1, -1); ctx.restore(); richReveal([['幂指型：先取对数', GOLD]], CX, 560, 40, t, P('C10', 0.5), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：数列极限', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('ε-N 与单调有界 · Mistral 客串', CX, 590, 32, SQ.R.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 4 章 · P9 其他未定式与第二个重要极限', '下一段：数列极限', [...CREDIT_BASE, '千问娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', '千问声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END, CREDIT_TM4('千问（Qwen）')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  CARDS.forEach((c, i) => s('C01', 0.08 + i * 0.07, 'click', 0.16));
  [0.1, 0.45].forEach(f => s('C02', f, 'type', 0.14)); s('C02', 0.75, 'ding_hi', 0.24); [0.1, 0.4].forEach(f => s('C03', f, 'type', 0.14)); s('C03', 0.7, 'ding_hi', 0.24);
  s('Q01', 0.1, 'pop', 0.24); s('Q01', 0.35, 'tinkle', 0.2);
  NS.forEach((n, i) => s('Q02', 0.22 + i * 0.09, 'marimba', 0.16)); s('D01', 0.1, 'buzz', 0.16);
  s('C04', 0.05, 'slam', 0.24); s('C04', 0.5, 'warp', 0.2); s('C05', 0.1, 'type', 0.14); s('C05', 0.45, 'pluck', 0.2); s('C05', 0.75, 'ding_hi', 0.26);
  s('G01', 0.15, 'type', 0.16); s('G01', 0.3, 'shimmer', 0.22); s('G01', 0.6, 'type', 0.16);
  s('C06', 0.15, 'whoosh', 0.18); s('C06', 0.7, 'ding', 0.22); [0.05, 0.35, 0.55].forEach(f => s('C07', f, 'type', 0.14)); s('C07', 0.8, 'ding_hi', 0.26);
  [0.08, 0.42].forEach(f => s('Q03', f, 'type', 0.14)); [0.28, 0.62].forEach(f => s('Q03', f, 'ding', 0.2)); s('Q03', 0.75, 'pop', 0.22);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'type', 0.14); s('D02', 0.55, 'ding_hi', 0.28);
  s('C10', 0.5, 'shimmer', 0.18); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
