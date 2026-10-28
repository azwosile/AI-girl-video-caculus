// 第 3 章 P2《为什么是 e》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A89 定义推出“自己 × 常数” · A90 底数滑杆与斜率仪表（介值定理夹出 e）· A91 Gemini 猜 2.5 → GPT 二分法 · A92 eˣ 与导数重合、切线平行 y = 2x
const SC = {};
const TITLES = [['def', '指数函数的导数'], ['slope', '斜率等于 1 的底数'], ['gemini', '猜一猜，再二分'], ['ex', 'e 的 x 次方'], ['quiz', '随堂一题'], ['outro', '小结']];
const MC = SQ.M.col, LN2 = Math.log(2), EE = Math.E;
// 指数曲线 + x = 0 处切线
function expWithTangent(G, b, col, a, o = {}) {
  if (a <= 0) return; const k = Math.log(b);
  gPlot(G, x => Math.pow(b, x), col, { a, w: o.w || 4.5 });
  if (o.tan !== false) { gLine(G, k, 0, 1, G.x0, G.x1, INV, a * (o.ta ?? 1), 3.5); gDot(G, 0, 1, GOLD, a); }
}

// ======================= def（A89） =======================
const GD = { cx: 1120, cy: 860, ux: 95, uy: 52, x0: -2.2, x1: 2.4, y0: 0, y1: 5.6 };
SC.def = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01')) { kinetic('e ≈ 2.718…？', CX, 470, 84, t, P('D01', 0.2), { col: GOLD, font: F_MATH }); label('为什么偏偏是它', CX, 580, 34, CR, ap(t, 'D01', 0.5), { bold: true }); return; }
  const up = eIO(prog(t, S('C02'), 0.6)), y0 = lerp(300, 230, up), sz = lerp(44, 36, up);
  // 第一行：定义
  richReveal([['(a^x)′ = lim ', CR], ['  ', CR]], 640, y0, sz, t, P('C01', 0.05), { align: 'left' });
  const xl = 640 + mathW('(a^x)′ = lim ', sz) + 10;
  if (t > P('C01', 0.12)) {
    const fa = ap(t, 'C01', 0.12);
    frac([['a^{x+h} − a^x', OUTER]], [['h', CR]], xl, y0 - sz * 0.2, sz * 0.82, fa);
    label('h→0', xl - mathW(' lim ', sz) * 0.55, y0 + sz * 0.62, sz * 0.42, CR, fa, { font: F_MATH });
  }
  // 第二行：提出 aˣ
  if (t > P('C01', 0.42)) {
    const y1 = y0 + sz * 2.4, fa = ap(t, 'C01', 0.42);
    mathText('= ', 640 + mathW('(a^x)′ ', sz), y1, sz, CR, { alpha: fa });
    const x2 = 640 + mathW('(a^x)′ = ', sz);
    mathText('a^x', x2, y1, sz, GOLD, { alpha: fa, glow: 12 });
    const x3 = x2 + mathW('a^x', sz) + 8; mathText('·  lim', x3, y1, sz, CR, { alpha: ap(t, 'C01', 0.55) });
    frac([['a^h − 1', INNER]], [['h', CR]], x3 + mathW('·  lim', sz) + 10, y1 - sz * 0.2, sz * 0.82, ap(t, 'C01', 0.55));
    label('自己', x2 + mathW('a^x', sz) / 2, y1 + sz * 1.05, 24, GOLD, ap(t, 'C01', 0.62), { bold: true });
    const cxk = x3 + mathW('·  lim', sz) + 10 + fracW([['a^h − 1', INNER]], [['h', CR]], sz * 0.82) / 2;
    label('常数（只和 a 有关）', cxk, y1 + sz * 1.9, 24, INNER, ap(t, 'C01', 0.78), { bold: true });
    if (t > P('C01', 0.78)) { const pa = ap(t, 'C01', 0.78) * (1 - up * 0.4); ctx.save(); ctx.globalAlpha *= pa; ctx.strokeStyle = INNER; ctx.lineWidth = 2.5; ctx.shadowColor = INNER; ctx.shadowBlur = 10; rr(cxk - 110, y1 - sz * 1.15, 220, sz * 2.45, 12); ctx.stroke(); ctx.restore(); }
  }
  // C02：常数 = x = 0 处切线斜率
  const ga = ap(t, 'C02', 0.15); if (ga > 0) {
    gAxes(GD, ga, { grid: false, xl: 'x', yl: 'y' });
    expWithTangent(GD, 2, OUTER, ga, { ta: ap(t, 'C02', 0.45) });
    mathText('y = a^x', gx(GD, 1.05), gy(GD, 4.9), 30, OUTER, { alpha: ga, glow: 10 });
    if (t > P('C02', 0.5)) { ratioTag('斜率 = 这个常数', gx(GD, -0.9), gy(GD, 2.6), INNER, ap(t, 'C02', 0.55), { size: 26 }); arrowQ(gx(GD, -0.6), gy(GD, 2.25), gx(GD, -0.05), gy(GD, 1.15), INNER, prog(t, P('C02', 0.6), 0.4), 1); }
    mathText('x = 0', gx(GD, 0.1), gy(GD, 0) + 34, 24, CR, { alpha: ap(t, 'C02', 0.45) });
  }
};

// ======================= slope（A90） =======================
const GS = { cx: 760, cy: 820, ux: 70, uy: 46, x0: -1.9, x1: 2.6, y0: 0, y1: 8.6 };
const MS = { x: 1010, y: 300, w: 320, h: 470 };   // 斜率仪表：竖轴 0.6–1.2
const mY = m => MS.y + MS.h - (m - 0.6) / 0.6 * MS.h;
function meter(t, marks, a) {
  if (a <= 0) return; panel(MS.x - 20, MS.y - 60, MS.w + 40, MS.h + 110, GOLD, a);
  label('x = 0 处的斜率', MS.x + MS.w / 2, MS.y - 30, 24, GOLD, a, { bold: true });
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(MS.x + 70, MS.y); ctx.lineTo(MS.x + 70, MS.y + MS.h); ctx.stroke(); ctx.restore();
  [0.6, 0.8, 1.0, 1.2].forEach(m => { label(m.toFixed(1), MS.x + 40, mY(m), 22, CR, a * 0.8, { font: F_MATH }); seg(MS.x + 62, mY(m), MS.x + 78, mY(m), CR, a * 0.6, 2); });
  marks.forEach(([m, txt, col, aa]) => { if (aa <= 0) return; seg(MS.x + 70, mY(m), MS.x + 130, mY(m), col, a * aa, 3); glowDot(MS.x + 70, mY(m), 8, col, a * aa); label(txt, MS.x + 220, mY(m), 26, col, a * aa, { font: F_MATH, bold: true }); });
}
SC.slope = t => {
  starfield(t); blueprint(0.4, 80);
  const ga = ap(t, 'C03', 0.02);
  gAxes(GS, ga, { grid: false, xl: 'x' });
  const a2 = ap(t, 'C03', 0.1), a3 = ap(t, 'C03', 0.55), ae = ap(t, 'C04', 0.6);
  expWithTangent(GS, 2, hexA(OUTER, 1), a2 * (1 - 0.5 * ae)); expWithTangent(GS, 3, RED, a3 * (1 - 0.5 * ae), { tan: true });
  mathText('2^x', gx(GS, 2.05), gy(GS, 3.7), 30, OUTER, { alpha: a2, glow: 10, upright: true });
  mathText('3^x', gx(GS, 1.25), gy(GS, 7.6), 30, OUTER, { alpha: a3, glow: 10, upright: true });
  if (ae > 0) { gPlot(GS, x => Math.exp(x), GOLD, { a: ae, w: 5.5 }); gLine(GS, 1, 0, 1, GS.x0, GS.x1, GOLD, ae, 3, [10, 8]); mathText('e^x', gx(GS, 1.62), gy(GS, 6.6), 32, GOLD, { alpha: ae, glow: 14 }); }
  const marks = [[Math.log(2), '底数 2 → 0.69', OUTER, a2], [Math.log(3), '底数 3 → 1.10', OUTER, a3]];
  // D02：介值定理——指针在 2 与 3 之间来回扫
  const sweep = ap(t, 'D02', 0.05), base = t < S('C04') ? 2.5 + 0.5 * Math.sin((t - S('D02')) * 2.6) : lerp(2.5 + 0.5 * Math.sin((S('C04') - S('D02')) * 2.6), EE, eIO(prog(t, P('C04', 0.4), 0.8)));
  if (sweep > 0) { marks.push([Math.log(base), '', CYAN, sweep * (1 - ae)]); label('扫描：底数 ' + base.toFixed(2) + ' → 斜率 ' + Math.log(base).toFixed(2), MS.x + MS.w / 2, MS.y + MS.h + 28, 22, CYAN, ga * sweep * (1 - ae), { font: F_MATH, bold: true }); }
  if (t > P('D02', 0.4)) { seg(MS.x + 70, mY(1), MS.x + MS.w, mY(1), GRN, ap(t, 'D02', 0.4), 2.5, [8, 6]); label('= 1 ？', MS.x + MS.w - 10, mY(1) - 26, 24, GRN, ap(t, 'D02', 0.4) * (1 - ae), { bold: true, align: 'right' }); }
  if (ae > 0) marks.push([1, '底数 e → 1', GOLD, ae]);
  meter(t, marks, ga);
  if (t > P('C04', 0.15)) label('介值定理：一定有一个底数，斜率恰好是 1', 980, 905, 26, CR, ap(t, 'C04', 0.15) * 0.95, { bold: true });
  if (t > P('C04', 0.6)) stampMark(1240, 820, 62, t, P('C04', 0.62), { text: 'e', col: GOLD, rot: -0.15 });
};

// ======================= gemini（A91） =======================
const BIS = (() => { let lo = 2.5, hi = 3; const st = []; for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2, s = Math.log(m); st.push({ lo, hi, m, s, right: s < 1 }); if (s < 1) lo = m; else hi = m; } return st; })();
const NL = { x0: 660, x1: 1300, y: 330 };   // 数轴 2.5 … 3
const nx = v => lerp(NL.x0, NL.x1, (v - 2.5) / 0.5);
const GG = { cx: 690, cy: 880, ux: 80, uy: 52, x0: -1.0, x1: 2.4, y0: 0, y1: 5.2 };
SC.gemini = t => {
  starfield(t); blueprint(0.4, 80);
  // M01 / C05：猜 2.5 → 验算
  const pa = fadeOut(t, S('G01'), 0.4);
  if (pa > 0) {
    if (t < S('C05') + 0.2) {
      const p = eBack(prog(t, P('M01', 0.45), 0.5)); ctx.save(); ctx.translate(980, 470); ctx.scale(p, p); mathText('2.5', 0, 40, 150, MC, { align: 'center', glow: 30, upright: true }); ctx.restore();
      if (t > P('M01', 0.1)) label('你的问题非常好！', 980, 300, 40, MC, ap(t, 'M01', 0.1) * fadeOut(t, S('C05'), 0.3), { bold: true });
      sparks(t, P('M01', 0.5), 980, 440, { col: [MC, '#ffffff'], n: 18 });
    }
    const ca = ap(t, 'C05', 0.1) * pa;
    if (ca > 0) {
      gAxes(GG, ca, { grid: false }); expWithTangent(GG, 2.5, MC, ca, { ta: ap(t, 'C05', 0.35) });
      gLine(GG, 1, 0, 1, GG.x0, GG.x1, GOLD, ca * 0.6, 2.5, [10, 8]);
      mathText('2.5^x', gx(GG, 1.2), gy(GG, 4.6), 30, MC, { alpha: ca, glow: 10, upright: true });
      label('斜率 1 的参考线', gx(GG, 1.6), gy(GG, 1.9), 22, GOLD, ca * 0.8);
      ratioTag('斜率 ≈ 0.92', 1180, 480, INV, ap(t, 'C05', 0.4), { size: 36 });
      label('< 1，还不够', 1180, 560, 30, RED, ap(t, 'C05', 0.6), { bold: true });
      if (t > P('C05', 0.65)) crossMark(1180, 660, 40, RED, t, P('C05', 0.65), pa);
    }
  }
  // G01 / G02：二分法
  if (t > S('G01') - 0.15) {
    const a = ap(t, 'G01', 0, 0.4);
    const t0 = P('G01', 0.35), t1 = P('G02', 0.55), n = Math.min(BIS.length, Math.floor(clamp((t - t0) / (t1 - t0)) * BIS.length * 0.999) + (t > t0 ? 1 : 0));
    const cur = BIS[Math.max(0, n - 1)], nxt = n < BIS.length ? BIS[n] : null;
    // 数轴
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.6)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(NL.x0 - 20, NL.y); ctx.lineTo(NL.x1 + 20, NL.y); ctx.stroke(); ctx.restore();
    [2.5, 2.6, 2.7, 2.8, 2.9, 3].forEach(v => { seg(nx(v), NL.y - 8, nx(v), NL.y + 8, CR, a * 0.7, 2); label(v.toFixed(1), nx(v), NL.y + 32, 22, CR, a * 0.8, { font: F_MATH }); });
    // 区间括号
    const lo = n ? (cur.right ? cur.m : cur.lo) : 2.5, hi = n ? (cur.right ? cur.hi : cur.m) : 3;
    ctx.save(); ctx.globalAlpha *= a * 0.28; ctx.fillStyle = GOLD; ctx.fillRect(nx(lo), NL.y - 22, Math.max(2, nx(hi) - nx(lo)), 44); ctx.restore();
    seg(nx(lo), NL.y - 30, nx(lo), NL.y + 30, GOLD, a, 3.5); seg(nx(hi), NL.y - 30, nx(hi), NL.y + 30, GOLD, a, 3.5);
    if (n) { glowDot(nx(cur.m), NL.y, 8, cur.right ? CYAN : RED, a); }
    // 步骤表（最近 6 步）
    const rows = BIS.slice(0, n).slice(-6), y0 = 440;
    label('第几步   中点        斜率        往哪走', 980, y0 - 6, 24, CR, a * 0.8, { bold: true });
    rows.forEach((r, i) => {
      const k = BIS.indexOf(r) + 1, y = y0 + 50 + i * 50, col = r.right ? CYAN : RED;
      label(String(k), 720, y, 26, CR, a, { font: F_MATH }); label(r.m.toFixed(5), 880, y, 26, GOLD, a, { font: F_MATH });
      label(r.s.toFixed(4), 1060, y, 26, col, a, { font: F_MATH }); label(r.right ? '< 1 → 往右' : '> 1 ← 往左', 1240, y, 24, col, a, { bold: true });
    });
    // G02：读数定格
    if (t > P('G02', 0.55)) {
      const p = eBack(prog(t, P('G02', 0.6), 0.5)); panel(760, 790, 440, 120, GOLD, clamp(p));
      ctx.save(); ctx.translate(980, 868); ctx.scale(p, p); mathText('e = 2.71828…', 0, 0, 58, GOLD, { align: 'center', glow: 22, upright: true }); ctx.restore();
    }
    if (t > S('M02')) { ratioTag('2.5  vs  2.718：差 0.2', 1160, 255, MC, ap(t, 'M02', 0.1), { size: 26 }); }
  }
};

// ======================= ex（A92） =======================
const GX = { cx: 900, cy: 820, ux: 120, uy: 70, x0: -2.4, x1: 2.6, y0: -0.6, y1: 7.6 };
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  const ga = ap(t, 'C06', 0.02);
  gAxes(GX, ga, { grid: false, xl: 'x', yl: 'y' });
  gPlot(GX, Math.exp, GOLD, { a: ga, w: 6, p: prog(t, P('C06', 0.05), 0.8) });
  const da = ap(t, 'C06', 0.45);
  gPlot(GX, Math.exp, GRN, { a: da, w: 3, dash: [12, 10], p: prog(t, P('C06', 0.45), 0.8), noHead: true });
  mathText('y = e^x', gx(GX, -2.2), gy(GX, 6.9), 34, GOLD, { alpha: ga, glow: 12 });
  mathText('y′ = e^x', gx(GX, -2.2), gy(GX, 6.0), 30, GRN, { alpha: da, glow: 10 });
  if (t > P('C06', 0.7)) label('完全重合', gx(GX, -1.1), gy(GX, 2.2), 30, GRN, ap(t, 'C06', 0.7) * fadeOut(t, S('C07'), 0.3), { bold: true });
  // C07：y = 2x 与滑动切线
  if (t > S('C07')) {
    const la = ap(t, 'C07', 0.3); gLine(GX, 2, 0, 0, GX.x0, GX.x1, INV, la, 3, [10, 8]); mathText('y = 2x', gx(GX, 1.9), gy(GX, 2 * 1.9) + 40, 28, INV, { alpha: la, glow: 8 });
    const xs = t < P('C08', 0.45) ? 0.69 + 1.2 * Math.sin((t - P('C07', 0.5)) * 1.8) * clamp((t - P('C07', 0.5)) / 0.6) : lerp(0.69 + 1.2 * Math.sin((P('C08', 0.45) - P('C07', 0.5)) * 1.8), LN2, eIO(prog(t, P('C08', 0.45), 0.6)));
    const ta = ap(t, 'C07', 0.5); if (ta > 0) {
      const m = Math.exp(xs), ok = Math.abs(xs - LN2) < 0.02; gLine(GX, m, xs, m, xs - 1.3, xs + 1.3, ok ? GOLD : CYAN, ta, 3.5); gDot(GX, xs, m, ok ? GOLD : CYAN, ta);
      ratioTag('斜率 ' + m.toFixed(2), 1240, 330, ok ? GOLD : CYAN, ta, { size: 28 });
    }
  }
  if (t > S('C08')) {
    const steps = [['e^x = 2', 0.1], ['x = ln 2', 0.35], ['切点 (ln 2, 2)', 0.65]];
    steps.forEach(([s, f], k) => { if (t > P('C08', f)) mathText(s, 1150, 420 + k * 58, 30, k === 2 ? GOLD : CR, { alpha: ap(t, 'C08', f), glow: 10, upright: k === 2 }); });
    if (t > P('C08', 0.7)) { gV(GX, LN2, GOLD, ap(t, 'C08', 0.7) * 0.6, { ya: 0, yb: 2, dash: [6, 6] }); gH(GX, 2, GOLD, ap(t, 'C08', 0.7) * 0.6, { xa: 0, xb: LN2, dash: [6, 6] }); }
  }
  if (t > S('D03')) stampMark(1220, 800, 70, t, P('D03', 0.3), { text: '斜率 = 1', col: GOLD, rot: -0.15 });
};

// ======================= quiz =======================
const GQ = { cx: 860, cy: 760, ux: 110, uy: 85, x0: -2.4, x1: 2.0, y0: -1.2, y1: 4.8 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C09', 0, 0.5) * 0.4, 78);
  if (t < S('C10')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C09') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 360);
  richReveal([['y = e^x', GOLD], ['  在 x = 0 处的切线？', CR]], CX - 60, 250, 44, t, P('C10', 0.1), { upright: true });
  const ga = ap(t, 'C10', 0.3); gAxes(GQ, ga, { grid: false, xl: 'x', yl: 'y' }); gPlot(GQ, Math.exp, GOLD, { a: ga, w: 5 });
  if (ga > 0) gDot(GQ, 0, 1, GOLD, ga);
  if (t > S('D04')) {
    const la = ap(t, 'D04', 0.45); gLine(GQ, 1, 0, 1, GQ.x0, GQ.x1, INV, la, 4);
    mathText('(0, 1)', gx(GQ, 0.12), gy(GQ, 1) + 36, 28, GOLD, { alpha: ap(t, 'D04', 0.15), upright: true });
    richReveal([['y = x + 1', INV]], 1180, 560, 50, t, P('D04', 0.6), { upright: true });
    checkMark(1180, 650, 30, GRN, t, P('D04', 0.85));
  }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C12'), 0.4);
  const rows = [[[['(a^x)′ = a^x · ', CR], ['常数', INNER]], 0.1], [[['常数 = 1', GOLD], [' 的底数  →  ', CR], ['e', GOLD]], 0.45], [[['(e^x)′ = e^x', GOLD]], 0.7]];
  rows.forEach(([parts, f], k) => richReveal(parts, CX, 380 + k * 120, 48, t, P('C11', f), { alpha: pa, upright: k === 1 }));
  if (pa > 0 && t > P('C11', 0.45)) { ctx.save(); ctx.globalAlpha *= pa * ap(t, 'C11', 0.45); panel(700, 450, 560, 130, GOLD, 1); ctx.restore(); richReveal([['常数 = 1', GOLD], [' 的底数  →  ', CR], ['e', GOLD]], CX, 500, 48, t, P('C11', 0.45), { alpha: pa, upright: true }); }
  if (t > S('C12') - 0.1) {
    const a = ap(t, 'C12', 0.2), G = { cx: 980, cy: 480, ux: 60, uy: 60, x0: -4, x1: 4, y0: -1.3, y1: 1.3 };
    gPlot(G, Math.sin, OUTER, { a, w: 5, p: prog(t, P('C12', 0.2), 0.8) }); gPlot(G, Math.cos, GRN, { a: ap(t, 'C12', 0.5), w: 3.5, dash: [10, 8], p: prog(t, P('C12', 0.5), 0.6), noHead: true });
    glowText('下一段：三角函数的导数', CX, 650, 48, CR, t, P('C12', 0.3));
  }
  credits(t, E('C12') + 0.38, 'AI娘微积分课 · 第 3 章 · P2 为什么是 e', '下一段：三角函数的导数', [...CREDIT_BASE,
    'Gemini 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
    'Gemini 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、Gemini 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C12') + 0.25) lecturer(t, 'C', 255, -5, E('C12') + 0.48, { h: 710 }); };
SC.__noTag = E('C12') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C12') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.2, 'pop', 0.24); s('C01', 0.05, 'type', 0.16); s('C01', 0.42, 'swoosh_in', 0.16); s('C01', 0.78, 'ding', 0.22); s('C02', 0.15, 'whoosh', 0.18); s('C02', 0.55, 'pluck', 0.24);
  s('C03', 0.1, 'marimba_lo', 0.24); s('C03', 0.55, 'marimba', 0.24); s('D02', 0.05, 'riser', 0.12); s('C04', 0.6, 'ding_hi', 0.26); s('C04', 0.62, 'stamp', 0.28);
  s('M01', 0.45, 'sparkle', 0.24); s('M01', 0.1, 'pop', 0.22); s('C05', 0.4, 'pluck', 0.22); s('C05', 0.65, 'buzz', 0.2);
  { const t0 = P('G01', 0.35), t1 = P('G02', 0.55); for (let k = 0; k < BIS.length; k++) sfx(t0 + (t1 - t0) * k / BIS.length, k % 2 ? 'tick' : 'tick2', 0.12); }
  s('G02', 0.6, 'ding_hi', 0.28); s('G02', 0.62, 'shimmer', 0.18); s('M02', 0.1, 'pop', 0.2);
  s('C06', 0.05, 'whoosh', 0.18); s('C06', 0.7, 'shimmer', 0.2); s('C07', 0.3, 'swoosh_in', 0.16); s('C08', 0.45, 'click', 0.24); s('C08', 0.65, 'ding', 0.24); s('D03', 0.3, 'stamp', 0.28);
  s('C09', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D04', 0.45, 'swoosh_in', 0.16); s('D04', 0.85, 'check', 0.28);
  s('C11', 0.1, 'type', 0.14); s('C11', 0.45, 'ding', 0.22); s('C11', 0.7, 'ding_hi', 0.24); s('C12', 0.3, 'swell', 0.3);
})();
finalize();
