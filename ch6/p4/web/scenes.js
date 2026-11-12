// 第 6 章 P4《切片法求体积》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 6.2 定义、例 1、例 7。
// A257 CT 逐层扫描（同时画出 A(x) 曲线）· A258 球的圆盘近似（三档 n 的数值表）· A259 四棱锥的截面随 x 放大
const SC = {};
const TITLES = [['def', 'CT 扫描'], ['sphere', '验证：球'], ['pyr', '四棱锥'], ['quiz', '随堂一题'], ['outro', '小结']];
const OX = { axis: 'x', at: 0, e: 0.3 };

// ======================= CT 扫描（A257） =======================
const GD = { cx: 650, cy: 470, ux: 105, uy: 78, x0: -0.2, x1: 6.4, y0: -2, y1: 2 };
const RB = x => 0.75 + 0.55 * Math.sin(0.9 * x + 0.2) + 0.25 * Math.sin(2.1 * x), XB = 6;
const GA = { cx: 650, cy: 770, ux: 105, uy: 14, x0: -0.2, x1: 6.4, y0: 0, y1: 9 };
const AB = x => Math.PI * RB(x) ** 2;
function recDot(t, a) { if (a <= 0) return; glowDot(1330, 222, 9, '#FF3B3B', a * (0.55 + 0.45 * Math.sin(t * 6))); label('REC', 1385, 222, 22, '#FF6B6B', a, { bold: true }); }
SC.def = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'N01', 0), fillN = t > S('C02') ? eIO(prog(t, P('C02', 0.05), 1.4)) : 0;
  recDot(t, a * fadeOut(t, S('G01')));
  revSolid(GD, { ...OX, R: RB, t0: 0, t1: XB, col: CYAN, a: a * (1 - 0.5 * fillN), Rmax: 1.6, rings: 8 });
  // A(x) 小图
  seg(gx(GA, 0), gy(GA, 0), gx(GA, XB + 0.3), gy(GA, 0), CR, a * 0.7, 2); mathText('A(x)', gx(GA, 0) - 70, gy(GA, 6), 24, GOLD, { alpha: a });
  const u = clamp(prog(t, P('N01', 0.3), D('N01') * 0.65 + D('C01')));
  const xs = XB * u;
  if (u > 0) {
    gPlot(GA, AB, GOLD, { a, xa: 0, xb: Math.max(0.01, xs), w: 3 });
    if (t < S('C02')) { revSlab(GD, { ...OX, R: RB }, Math.max(0.05, xs), 0.12, GOLD, a); seg(gx(GD, xs), gy(GD, 1.9), gx(GA, xs), gy(GA, 0), GOLD, a * 0.5, 1.5, [5, 5]); glowDot(gx(GA, xs), gy(GA, AB(xs)), 6, GOLD, a); }
  }
  if (t > S('C01')) richReveal([['薄片体积 ≈ ', CR], ['A(x)', GOLD], [' · Δx', CYAN]], CX, 250, 38, t, P('C01', 0.3), { upright: true, alpha: 1 - fillN });
  if (fillN > 0) {
    const n = 14; for (let k = 0; k < n; k++) { const q = clamp(fillN * n - k); if (q > 0) revSlab(GD, { ...OX, R: RB }, XB * (k + 0.5) / n, XB / n * 0.88, GOLD, q * 0.85, { fa: 0.4 }); }
    gBetween(GA, AB, () => 0, 0, XB, fillN * 0.7, { col: 'rgba(255,200,60,0.25)' });
    richReveal([['V = ', CR], ['∫', GOLD], ['ₐᵇ ', CR], ['A(x)', GOLD], [' dx', CR]], CX, 250, 46, t, P('C02', 0.3), { upright: true });
  }
  if (t > S('G01')) label('A(x) 一样 ⇒ 体积一样（祖暅）', 1180, 320, 28, SQ.G.col, ap(t, 'G01', 0.2), { bold: true });
};

// ======================= 验证：球（A258） =======================
const RS = 1.5, GS = { cx: 800, cy: 560, ux: 120, uy: 120 }, OS = { ...OX, R: x => Math.sqrt(Math.max(0, RS * RS - x * x)), t0: -RS + 0.001, t1: RS - 0.001 };
const NV = [[5, '4.2726'], [10, '4.2097'], [20, '4.1940']];
SC.sphere = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0), dk = t > S('N02');
  if (!dk) {
    revSolid(GS, { ...OS, col: CYAN, a, Rmax: RS, rings: 7 });
    const u = prog(t, P('C03', 0.25), D('C03') * 0.7 + D('C04')), x = RS * 0.8 * Math.sin(u * 2 * Math.PI), rr = OS.R(x), c = ap(t, 'C03', 0.25);
    revSlab(GS, OS, x, 0.06, GOLD, c);
    seg(gx(GS, x), gy(GS, 0), gx(GS, x), gy(GS, rr), GOLD, c, 2.5); mathText('√(r² − x²)', gx(GS, x) + 16, gy(GS, rr / 2), 22, GOLD, { alpha: c });
    seg(gx(GS, 0), gy(GS, 0), gx(GS, x), gy(GS, rr), CR, c * 0.7, 1.5, [5, 4]); mathText('r', gx(GS, x / 2) - 22, gy(GS, rr / 2) - 6, 24, CR, { alpha: c });
    seg(gx(GS, -RS - 0.3), gy(GS, 0), gx(GS, RS + 0.4), gy(GS, 0), CR, a * 0.6, 1.5, [6, 6]); mathText('x', gx(GS, RS + 0.5), gy(GS, 0) + 8, 24, CR, { alpha: a });
    if (t > S('C04')) richReveal([['A(x) = π(r² − x²)  ⇒  V = ', CR], ['∫', GOLD], ['₋ᵣʳ π(r² − x²) dx = ', CR], ['4πr³/3', GOLD]], CX, 250, 34, t, P('C04', 0.2), { upright: true });
  } else {
    const k = t < S('G02') ? 0 : Math.min(2, Math.floor((t - S('G02')) / Math.max(0.6, D('G02') / 3))), n = NV[k][0];
    revSolid(GS, { ...OS, col: CYAN, a: 0.25, Rmax: RS, rings: 0 });
    for (let i = 0; i < n; i++) { const x = -RS + (i + 0.5) * 2 * RS / n; revSlab(GS, OS, x, 2 * RS / n * 0.94, i % 2 ? GOLD : '#FFB347', ap(t, 'N02', 0.3), { fa: 0.45 }); }
    label(`n = ${n}`, GS.cx, gy(GS, -RS) + 70, 30, GOLD, 1, { bold: true });
    const ta = ap(t, 'N02', 0.5); panel(1060, 400, 330, 270, GOLD, ta);
    label('r = 1 时', 1225, 432, 24, CR, ta, { bold: true });
    NV.forEach(([nn, v], i) => { const on = t > S('G02') && i <= k; mathText(`n = ${nn}`, 1090, 486 + i * 52, 26, on ? GOLD : CR, { alpha: ta * (on ? 1 : 0.45), upright: true }); mathText(v, 1360, 486 + i * 52, 26, on ? GOLD : CR, { align: 'right', alpha: ta * (on ? 1 : 0.45), upright: true }); });
    seg(1080, 628 - 14, 1370, 628 - 14, CR, ta * 0.5, 1.5); mathText('4π/3 ≈ 4.1888', 1225, 652, 26, GRN, { align: 'center', alpha: ap(t, 'G02', 0.75), upright: true });
  }
};

// ======================= 四棱锥（A259） =======================
const PU = 95, PO = [960, 330], HP = 4.4, LP = 3.2;
const pj = ([x, y, z]) => [PO[0] + (x + 0.5 * z) * PU, PO[1] + (y - 0.3 * z) * PU]; // y 向下为正（离顶点的距离）
function sq(d, col, a, fill) { // 离顶点 d 处的正方形截面
  if (a <= 0) return; const s = LP * d / HP / 2, P = [[-s, d, -s], [s, d, -s], [s, d, s], [-s, d, s]].map(pj);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); P.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](...p)); ctx.closePath();
  if (fill) { ctx.fillStyle = hexA(col, 0.6); ctx.fill(); } ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = fill ? 14 : 0; ctx.stroke(); ctx.restore();
}
SC.pyr = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0), s = LP / 2, apx = pj([0, 0, 0]), B = [[-s, HP, -s], [s, HP, -s], [s, HP, s], [-s, HP, s]].map(pj);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(INV, 0.12); ctx.beginPath(); ctx.moveTo(...apx); ctx.lineTo(...B[0]); ctx.lineTo(...B[3]); ctx.lineTo(...B[2]); ctx.lineTo(...B[1]); ctx.closePath(); ctx.fill(); ctx.restore();
  [0, 1, 2, 3].forEach(i => seg(...apx, ...B[i], INV, a * (i === 0 ? 0.45 : 1), 2.5, i === 0 ? [6, 5] : undefined));
  sq(HP, INV, a, false);
  mathText('L', (B[3][0] + B[2][0]) / 2, B[3][1] + 40, 28, INV, { align: 'center', alpha: a }); seg(apx[0], apx[1], apx[0], pj([0, HP, 0])[1], CR, a * 0.6, 1.5, [6, 5]); mathText('h', apx[0] - 30, (apx[1] + pj([0, HP, 0])[1]) / 2, 28, CR, { alpha: a });
  if (t > S('C06')) {
    const u = prog(t, P('C06', 0.15), D('C06') * 0.8), d = HP * (0.25 + 0.6 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI))), c = ap(t, 'C06', 0.15) * fadeOut(t, S('C07') + 0.5);
    sq(d, GOLD, c, true); mathText('x', apx[0] + 12, (apx[1] + pj([0, d, 0])[1]) / 2, 26, GOLD, { alpha: c });
    richReveal([['截面边长 = ', CR], ['Lx/h', GOLD], ['  ⇒  A(x) = L²x²/h²', CR]], CX, 250, 36, t, P('C06', 0.4), { upright: true, alpha: fadeOut(t, S('C07')) });
  }
  if (t > S('C07')) {
    const p = eIO(prog(t, P('C07', 0.05), 1.2)), n = 10; for (let k = 0; k < n; k++) { const q = clamp(p * n - k); if (q > 0) sq(HP * (k + 1) / n, GOLD, q * 0.8, true); }
    richReveal([['V = ', CR], ['∫', GOLD], ['₀ʰ L²x²/h² dx = ', CR], ['L²h/3', GOLD]], CX, 250, 40, t, P('C07', 0.2), { upright: true });
  }
  if (t > S('N03')) stampMark(1300, 640, 66, t, P('N03', 0.15), { col: SQ.N.col, text: '一遍过' });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['截面：边长 x 的正方形，0 ≤ x ≤ 3', CR]], 800, 300, 36, t, P('C09', 0.05), { upright: true }); richReveal([['V = ？', CR]], 800, 370, 40, t, P('C09', 0.4), { upright: true });
  [0.6, 1.2, 1.8, 2.4, 3].forEach((x, i) => { const c = ap(t, 'C09', 0.3 + i * 0.08), w = x * 52, cx = 640 + i * 120 + x * 10; ctx.save(); ctx.globalAlpha *= c; ctx.strokeStyle = CYAN; ctx.fillStyle = hexA(CYAN, 0.15); ctx.lineWidth = 2.5; ctx.fillRect(cx - w / 2, 720 - w, w, w); ctx.strokeRect(cx - w / 2, 720 - w, w, w); ctx.restore(); mathText(`x = ${x}`, cx, 754, 20, CR, { align: 'center', alpha: c, upright: true }); });
  if (t > S('D01')) { richReveal([['∫', GOLD], ['₀³ x² dx = 27/3', CYAN]], 800, 460, 36, t, P('D01', 0.2), { upright: true }); richReveal([['= ', CR], ['9', GOLD]], 1080, 460, 52, t, P('D01', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { revSolid(GD, { ...OX, R: RB, t0: 0, t1: XB, col: CYAN, a: ga * 0.6, Rmax: 1.6, rings: 8 }); richReveal([['V = ', CR], ['∫', GOLD], [' A(x) dx', GOLD]], CX, 250, 48, t, P('C10', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：圆盘法', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('Gemini：转起来！', CX, 590, 32, SQ.M.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 6 章 · P4 切片法求体积', '下一段：圆盘法', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM6('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.05, 'click', 0.22); s('N01', 0.3, 'hum', 0.14); s('C01', 0.3, 'type', 0.14); s('C02', 0.05, 'riser', 0.18); s('C02', 0.3, 'ding_hi', 0.24); s('G01', 0.2, 'pop', 0.16);
  s('C03', 0.25, 'whoosh', 0.14); s('C04', 0.2, 'type', 0.14); s('C04', 0.6, 'ding', 0.2); s('N02', 0.05, 'click', 0.22); s('N02', 0.3, 'marimba', 0.16);
  for (let k = 0; k < 3; k++) s('G02', k / 3, 'pop', 0.18); s('G02', 0.75, 'ding_hi', 0.24);
  s('C05', 0.05, 'pop', 0.16); s('C06', 0.15, 'whoosh', 0.14); s('C07', 0.05, 'riser', 0.16); s('C07', 0.2, 'ding_hi', 0.24); s('N03', 0.15, 'stamp', 0.28);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.2, 'type', 0.14); s('D01', 0.55, 'ding_hi', 0.28);
  s('C10', 0.15, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
