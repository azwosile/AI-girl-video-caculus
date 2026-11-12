// 第 7 章 P3《递推公式与华里士公式》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.1 例 6 + 同济。
// A299 递推台阶 · A300 华里士连乘逐项点亮 · A301 sin⁴x 曲线下面积数值核对
const SC = {};
const TITLES = [['rec', '递推公式'], ['wallis', '华里士公式'], ['num', '数值核对'], ['quiz', '随堂一题'], ['outro', '小结']];
SIDE.T.dy = t => (t > S('T01') && t < E('T01')) || (t > S('T03') && t < E('T03')) ? -Math.abs(Math.sin((t - S('T01')) * 6)) * 28 : 0;   // MiMo 蹦台阶

// ======================= 台阶（A299） =======================
const STEPS7 = ['sin⁶x', 'sin⁴x', 'sin²x', 'sin⁰x = 1'];
function stairs(x0, y0, sw, sh, t, t0, o = {}) {
  const n = STEPS7.length, a0 = o.alpha ?? 1;
  for (let i = 0; i < n; i++) {
    const a = clamp(prog(t, t0 + i * 0.15, 0.3)) * a0; if (a <= 0) continue; const x = x0 + i * sw, y = y0 + i * sh;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(SQ.T.col, 0.14 + 0.06 * i); ctx.strokeStyle = SQ.T.col; ctx.lineWidth = 2.5; ctx.fillRect(x, y, sw, y0 + n * sh - y); ctx.strokeRect(x, y, sw, 8); ctx.restore();
    mathText(`∫ ${STEPS7[i]} dx`, x + sw / 2, y - 18, 24, i === n - 1 ? GOLD : CR, { align: 'center', alpha: a, upright: true });
  }
}
SC.rec = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C02') + 0.2) questionCard(860, 300, 420, 90, '', '∫ sinⁿx dx', t, P('C01', 0.1), { col: SQ.T.col, size: 36, alpha: fadeOut(t, S('C02') + 0.1) });
  if (t > S('C02')) {
    const a = ap(t, 'C02', 0.05); panel(530, 228, 680, 120, GOLD, a * 0.8);
    mathText('∫ sinⁿx dx = −(1/n) cos x sinⁿ⁻¹x', 560, 278, 26, CR, { alpha: a, upright: true });
    mathText('+ ((n−1)/n) ∫ sinⁿ⁻²x dx', 760, 328, 26, GOLD, { alpha: ap(t, 'C02', 0.45), upright: true });
  }
  if (t > S('T01') - 0.1) {
    stairs(560, 430, 160, 80, t, P('T01', 0));
    const k = clamp(prog(t, P('T01', 0.25), 2.2)) * 3, i = Math.floor(Math.min(k, 2.999)), f = k - i;   // 小球沿台阶蹦
    const xb = 560 + (i + f) * 160 + 80, yb = 430 + (i + (f > 0.5 ? 1 : 0)) * 80 - 30 - Math.sin(f * Math.PI) * 60;
    if (t < E('G01')) glowDot(xb, k >= 2.999 ? 430 + 3 * 80 - 30 : yb, 12, SQ.T.col, ap(t, 'T01', 0.2));
    ['−2', '−2', '−2'].forEach((s, j) => label(s, 560 + (j + 1) * 160 + 10, 430 + j * 80 + 40, 22, SQ.T.col, clamp(prog(t, P('T01', 0.3) + j * 0.7, 0.3)), { bold: true }));
  }
  if (t > S('G01')) {
    const a = ap(t, 'G01', 0.3); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,28,0.9)'; rr(560, 700, 640, 90, 14); ctx.fill(); ctx.restore();
    mathText('n = 0 : ∫ dx = x', 590, 735, 24, CYAN, { alpha: a, upright: true });
    mathText('n = 1 : ∫ sin x dx = −cos x', 590, 775, 24, CYAN, { alpha: ap(t, 'G01', 0.55), upright: true });
  }
};

// ======================= 华里士（A300） =======================
SC.wallis = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['∫₀^{π/2}', CR], [' : 第一项 = 0', GRN]], 860, 250, 34, t, P('C03', 0.15), { upright: true });
  if (t > S('C03')) mathText('∫₀^{π/2} sinⁿx dx = ((n−1)/n)·((n−3)/(n−2))·…', 860, 345, 30, CR, { align: 'center', alpha: ap(t, 'C03', 0.55), upright: true });
  if (t > S('C04')) {
    const F = [['3/4', 'n = 4'], ['1/2', 'n = 2'], ['π/2', 'n = 0']];
    F.forEach(([s, n], k) => {
      const t0 = P('C04', 0.08 + 0.17 * k), p = eBack(prog(t, t0, 0.4)); if (p <= 0) return; const x = 640 + k * 190;
      ctx.save(); ctx.translate(x, 470); ctx.scale(p, p); panel(-75, -55, 150, 110, k === 2 ? GOLD : SQ.T.col, 1); ctx.restore();
      mathText(s, x, 482, 38, k === 2 ? GOLD : CR, { align: 'center', alpha: clamp(p), upright: true });
      label(n, x, 555, 20, SQ.T.col, clamp(p), {});
      if (k < 2) label('×', x + 95, 470, 34, CR, clamp(p), { bold: true });
    });
    richReveal([['= ', CR], ['3π/16', GOLD]], 1220, 470, 40, t, P('C04', 0.6), { upright: true });
    const a = ap(t, 'C04', 0.75); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,28,0.9)'; rr(560, 620, 640, 110, 14); ctx.fill(); ctx.restore();
    richReveal([['偶数结尾 → × ', CR], ['π/2', GOLD]], 860, 660, 28, t, P('C04', 0.75), { upright: true });
    richReveal([['奇数结尾 → × ', CR], ['1', GOLD]], 860, 705, 28, t, P('C04', 0.85), { upright: true });
  }
};

// ======================= 数值核对（A301） =======================
const GN = { cx: 600, cy: 720, ux: 330, uy: 380, x0: -0.05, x1: 1.75, y0: -0.05, y1: 1.15 };
const S4 = x => Math.sin(x) ** 4;
SC.num = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'G02', 0); gAxes(GN, a * 0.75, { grid: false, xl: 'x' });
  gPlot(GN, Math.sin, hexA(CYAN, 0.5), { a: a * 0.6, xa: 0, xb: Math.PI / 2, w: 2 }); gPlot(GN, S4, SQ.T.col, { a, xa: 0, xb: Math.PI / 2, w: 4 });
  const sw = eIO(prog(t, P('G02', 0.15), 1.6)), xe = sw * Math.PI / 2;
  gBetween(GN, S4, () => 0, 0, Math.max(xe, 0.001), a, { col: 'rgba(255,111,168,0.35)' });
  label('π/2', gx(GN, Math.PI / 2), gy(GN, 0) + 26, 22, CR, a, {}); mathText('sin⁴x', gx(GN, 1.45) - 90, gy(GN, 0.9), 24, SQ.T.col, { alpha: a, upright: true });
  const v = sw > 0 ? (3 * xe / 8 - Math.sin(2 * xe) / 4 + Math.sin(4 * xe) / 32) : 0;   // ∫₀^xe sin⁴
  mathText(`面积 ≈ ${v.toFixed(4)}`, 1180, 380, 32, CR, { align: 'center', alpha: a, upright: true });
  if (sw >= 1) { richReveal([['3π/16 ≈ ', CR], ['0.5890', GOLD]], 1180, 450, 32, t, P('G02', 0.15) + 1.6, { upright: true }); checkMark(1180, 520, 22, GRN, t, P('G02', 0.15) + 1.9); }
  if (t > S('C05')) kinetic('大问题 → 一级一级的小问题', 1100, 640, 30, t, P('C05', 0.1), { col: SQ.T.col });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 500, 100, '', '∫₀^{π/2} sin⁵x dx = ？', t, P('C07', 0.05), { size: 36 });
  if (t > S('T03')) {
    richReveal([['4/5 × 2/3 × ', CR], ['1', SQ.T.col]], 820, 540, 36, t, P('T03', 0.1), { upright: true });
    richReveal([['= ', CR], ['8/15', GOLD]], 820, 630, 40, t, P('T03', 0.6), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { stairs(600, 420, 150, 70, t, P('C08', 0.05), { alpha: fa }); richReveal([['递推：降两级', SQ.T.col], ['   华里士：连乘', GOLD]], 880, 300, 36, t, P('C08', 0.3), { alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：正弦与余弦的幂', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('混元按计算器 · 奇剥偶降', CX, 610, 32, SQ.H.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P3 递推公式', '下一段：正余弦幂', [...CREDIT_BASE, ...CREDIT_T, ...CREDIT_END, CREDIT_TM7('MiMo')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'pop', 0.2); s('C02', 0.05, 'whoosh', 0.16); [0, 1, 2].forEach(j => sfx(P('T01', 0.3) + j * 0.7, 'marimba', 0.14)); s('G01', 0.3, 'pop', 0.16);
  s('C03', 0.15, 'ding', 0.18); [0, 1, 2].forEach(k => s('C04', 0.08 + 0.17 * k, 'pop', 0.18)); s('C04', 0.6, 'ding_hi', 0.26);
  s('G02', 0.15, 'warp', 0.14); sfx(P('G02', 0.15) + 1.9, 'check', 0.24); s('C05', 0.1, 'shimmer', 0.16);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('T03', 0.6, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
