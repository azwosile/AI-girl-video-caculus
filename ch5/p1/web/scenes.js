// 第 5 章 P1《高中速通：求和与 Σ》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A189 Σ 记号标注 · A190 两个阶梯拼成矩形 · A191 平方和方块堆
const SC = {};
const TITLES = [['sig', 'Σ 记号'], ['ar', '等差求和'], ['sq', '平方和'], ['geo', '等比求和'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= Σ 记号（A189） =======================
SC.sig = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'K01', 0), x = 760, y = 430;
  glowText('Σ', x, y, 150, GOLD, t, P('K01', 0.05));
  mathText('n', x, y - 120, 36, CYAN, { align: 'center', alpha: ap(t, 'K01', 0.3), upright: true });
  mathText('i = 1', x, y + 110, 32, GRN, { align: 'center', alpha: ap(t, 'K01', 0.3), upright: true });
  mathText('aᵢ', x + 110, y + 6, 54, CR, { align: 'center', alpha: ap(t, 'K01', 0.4), upright: true });
  richReveal([['= a₁ + a₂ + a₃ + … + aₙ', CR]], 1150, y + 6, 40, t, P('K01', 0.55), { upright: true });
  const c = ap(t, 'C02', 0.1);
  if (c > 0) { label('上限', x - 110, y - 120, 24, CYAN, c, { bold: true }); label('下限', x - 120, y + 110, 24, GRN, c, { bold: true }); label('求和变量 i（换成 j、k 一样）', x + 40, y + 175, 24, GRN, ap(t, 'C02', 0.3), { bold: true }); }
  if (t > S('K02') - 0.1) { panel(560, 690, 840, 170, SQ.K.col, ap(t, 'K02', 0)); richReveal([['Σ c·aᵢ = c·Σ aᵢ', GOLD]], CX, 740, 34, t, P('K02', 0.1), { upright: true }); richReveal([['Σ (aᵢ + bᵢ) = Σ aᵢ + Σ bᵢ', CYAN]], CX, 810, 34, t, P('K02', 0.5), { upright: true }); }
};

// ======================= 等差：阶梯拼矩形（A190） =======================
SC.ar = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['1 + 2 + … + n = ', CR], ['n(n + 1)/2', GOLD]], CX, 230, 40, t, P('K03', 0.1), { upright: true });
  const n = 6, u = 62, X0 = CX - (n + 1) * u / 2, Y0 = 760, a = ap(t, 'K03', 0.3);
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { const p = clamp(prog(t, P('K03', 0.3), 0.9) * n - i); if (p <= 0) continue; ctx.save(); ctx.globalAlpha *= p * a; ctx.fillStyle = hexA(CYAN, 0.4); ctx.strokeStyle = CYAN; ctx.lineWidth = 2; ctx.fillRect(X0 + j * u, Y0 - (i + 1) * u, u - 4, u - 4); ctx.strokeRect(X0 + j * u, Y0 - (i + 1) * u, u - 4, u - 4); ctx.restore(); }
  // 第二个阶梯：从右上方转进来
  const g = eIO(prog(t, P('G01', 0.1), 1.0)), ga = ap(t, 'G01', 0);
  if (ga > 0) for (let i = 0; i < n; i++) for (let j = 0; j < n - i; j++) {
    const tx = X0 + (n - j) * u, ty = Y0 - (i + 1) * u, sx = tx + 260 * (1 - g), sy = ty - 200 * (1 - g);
    ctx.save(); ctx.globalAlpha *= ga; ctx.fillStyle = hexA(GOLD, 0.4); ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.fillRect(sx, sy, u - 4, u - 4); ctx.strokeRect(sx, sy, u - 4, u - 4); ctx.restore();
  }
  if (t > P('G01', 0.55)) { const p = ap(t, 'G01', 0.55); gBraceH(X0, X0 + (n + 1) * u - 4, Y0 + 20, 'n + 1', p); seg(X0 - 20, Y0, X0 - 20, Y0 - n * u, CR, p, 2); mathText('n', X0 - 50, Y0 - n * u / 2, 28, CR, { align: 'center', alpha: p, upright: true }); label('取一半', X0 + (n + 1) * u + 120, Y0 - n * u / 2, 30, GOLD, ap(t, 'G01', 0.75), { bold: true }); }
};
function gBraceH(x0, x1, y, s, a) { seg(x0, y, x1, y, CR, a, 2); seg(x0, y - 8, x0, y + 8, CR, a, 2); seg(x1, y - 8, x1, y + 8, CR, a, 2); mathText(s, (x0 + x1) / 2, y + 30, 28, CR, { align: 'center', alpha: a, upright: true }); }

// ======================= 平方和（A191） =======================
SC.sq = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['1² + 2² + … + n² = ', CR], ['n(n + 1)(2n + 1)/6', GOLD]], CX, 230, 40, t, P('K04', 0.1), { upright: true });
  const u = 40, base = 700; let x = 600; const cols = [CYAN, GRN, GOLD, INV];
  for (let k = 1; k <= 4; k++) {
    const p = ap(t, 'K04', 0.25 + k * 0.1); if (p > 0) { for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) { ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = hexA(cols[k - 1], 0.4); ctx.strokeStyle = cols[k - 1]; ctx.lineWidth = 1.5; ctx.fillRect(x + j * u, base - (i + 1) * u, u - 3, u - 3); ctx.strokeRect(x + j * u, base - (i + 1) * u, u - 3, u - 3); ctx.restore(); } mathText(`${k}² = ${k * k}`, x + k * u / 2, base + 36, 26, cols[k - 1], { align: 'center', alpha: p, upright: true }); }
    x += k * u + 60;
  }
  if (t > S('C03') - 0.1) { panel(560, 800, 840, 100, GOLD, ap(t, 'C03', 0)); richReveal([['n = 3：  1 + 4 + 9 = 14', CYAN], ['   3·4·7/6 = 14', GOLD]], CX, 850, 32, t, P('C03', 0.15), { upright: true }); checkMark(1360, 850, 16, GRN, t, P('C03', 0.8)); }
};

// ======================= 等比 =======================
SC.geo = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['1 + r + r² + … + rⁿ⁻¹ = ', CR], ['(1 − rⁿ)/(1 − r)', GOLD]], CX, 300, 40, t, P('K05', 0.05), { upright: true });
  richReveal([['|r| < 1：  1 + r + r² + … = ', CR], ['1/(1 − r)', GOLD]], CX, 420, 40, t, P('K05', 0.55), { upright: true });
  if (t > S('D01') - 0.1) { const p = ap(t, 'D01', 0); panel(600, 540, 760, 200, SQ.D.col, p); label('P0 阿基米德：r = 1/4', CX, 590, 30, SQ.D.col, p, { bold: true }); richReveal([['1 + 1/4 + 1/16 + … = 1/(1 − 1/4) = ', CR], ['4/3', GOLD]], CX, 670, 32, t, P('D01', 0.3), { upright: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C04', 0, 0.5) * 0.42, 78);
  if (t < S('C05')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C04') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['Σᵢ₌₁⁴ i² = ？', CR]], 820, 330, 48, t, P('C05', 0.1), { upright: true });
  if (t > S('D02')) richReveal([['1 + 4 + 9 + 16 = ', CR], ['30', GOLD]], 820, 500, 48, t, P('D02', 0.15), { upright: true });
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C06', 0) * fadeOut(t, S('C07'), 0.4);
  if (ga > 0) { [['Σ 记号与线性', CYAN], ['1 + … + n = n(n + 1)/2', GRN], ['1² + … + n² = n(n + 1)(2n + 1)/6', GOLD], ['等比：1/(1 − r)', INV]].forEach(([s, c], i) => richReveal([[s, c]], CX, 330 + i * 90, 36, t, P('C06', 0.05 + i * 0.12), { upright: true, alpha: ga })); }
  if (t > S('C07') - 0.1) { glowText('下一段：面积问题 · 上和与下和', CX, 500, 52, CR, t, P('C07', 0.15)); glowText('豆包先糊弄一个答案', CX, 590, 32, SQ.B.col, t, P('C07', 0.45), { bold: false }); }
  credits(t, E('C07') + 0.38, 'AI娘微积分课 · 第 5 章 · P1 高中速通', '下一段：上和与下和', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM5('Kimi')]);
};

SC.__overlay = t => { if (t < E('C07') + 0.25) lecturer(t, 'C', 255, -5, E('C07') + 0.48, { h: 710 }); };
SC.__noTag = E('C07') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C07') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.05, 'slam', 0.2); s('K01', 0.55, 'type', 0.14); s('C02', 0.1, 'pop', 0.16); s('K02', 0.1, 'type', 0.14); s('K02', 0.5, 'type', 0.14);
  s('K03', 0.1, 'type', 0.14); s('K03', 0.3, 'pluck', 0.14); s('G01', 0.1, 'whoosh', 0.18); s('G01', 0.75, 'ding', 0.2);
  [1, 2, 3, 4].forEach(k => s('K04', 0.25 + k * 0.1, 'pluck', 0.12)); s('C03', 0.8, 'ding_hi', 0.24);
  s('K05', 0.05, 'type', 0.14); s('K05', 0.55, 'type', 0.14); s('D01', 0.3, 'sparkle', 0.2);
  s('C04', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'ding_hi', 0.28);
  s('C06', 0.05, 'pop', 0.2); s('C07', 0.15, 'swell', 0.3);
})();
finalize();
