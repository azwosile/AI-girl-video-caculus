// 第 3 章 P0《齿轮链：变化率相乘》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A81 齿轮链（按真实齿数比啮合）· A82 放大器管道 · A83 莱布尼茨“假约分” · A84 外层 / 里层拆盒拼装
const SC = {};
const TITLES = [['gears', '齿轮链'], ['pipe', '从齿轮到导数'], ['leibniz', '莱布尼茨记号'], ['example', '一个例子'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 齿轮链（A81） =======================
const GM = 8;   // 模数：大 48 齿 R192，中 16 齿 R64，小 8 齿 R32
const CH = gearChain(760, 640, [{ n: 48, col: CYAN }, { n: 16, col: GOLD }, { n: 8, col: RED }], GM, [-0.25, -0.25]);
const W0 = 0.22;   // 平时的慢速转动（弧度/秒，大齿轮）
function turnWin() { return [P('H01', 0.08), D('H01') * 0.8]; }
function th1(t) {   // 大齿轮转角：H01 期间停下慢转，正好转满一圈
  const [a, d] = turnWin(); return W0 * Math.min(t, a) + 2 * Math.PI * eIO(prog(t, a, d)) + W0 * Math.max(0, t - a - d);
}
function shopWindow(t, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(980, 560, 60, 980, 560, 520); g.addColorStop(0, 'rgba(255,190,110,0.16)'); g.addColorStop(1, 'rgba(255,190,110,0)');
  ctx.fillStyle = g; ctx.fillRect(560, 160, 840, 800);
  ctx.strokeStyle = 'rgba(255,205,140,0.55)'; ctx.lineWidth = 6; ctx.shadowColor = 'rgba(255,190,110,0.8)'; ctx.shadowBlur = 18; rr(620, 190, 720, 700, 18); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(980, 190); ctx.lineTo(980, 890); ctx.stroke();
  ctx.restore();
  // 橱窗里的一串小齿轮（装饰）
  const dec = gearChain(720, 760, [{ n: 24, col: GOLD }, { n: 12, col: CYAN }, { n: 30, col: GOLD }, { n: 10, col: RED }, { n: 18, col: CYAN }], 6, [-0.9, 0.2, -1.1, 0.4]);
  drawChain(dec, t * 0.6, 6, a * 0.55);
  // 一只钟面
  ctx.save(); ctx.globalAlpha *= a * 0.8; ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.shadowColor = CR; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(1170, 380, 110, 0, 7); ctx.stroke();
  for (let k = 0; k < 12; k++) { const an = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(1170 + Math.cos(an) * 92, 380 + Math.sin(an) * 92); ctx.lineTo(1170 + Math.cos(an) * 104, 380 + Math.sin(an) * 104); ctx.stroke(); }
  const hm = t * 0.08 - 1.2, mm = t * 0.9 - 1.6; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1170, 380); ctx.lineTo(1170 + Math.cos(hm) * 55, 380 + Math.sin(hm) * 55); ctx.stroke();
  ctx.lineWidth = 3.5; ctx.strokeStyle = GOLD; ctx.shadowColor = GOLD; ctx.beginPath(); ctx.moveTo(1170, 380); ctx.lineTo(1170 + Math.cos(mm) * 85, 380 + Math.sin(mm) * 85); ctx.stroke();
  ctx.restore();
}
const GN = ['大齿轮 · 48 齿', '中 · 16 齿', '小 · 8 齿'];
SC.gears = t => {
  starfield(t); blueprint(0.4, 80);
  const wa = fadeOut(t, S('C01'), 0.5); shopWindow(t, wa);
  if (t < S('C01')) { kinetic('钟表店的橱窗', CX, 140 + 0, 46, t, P('D01', 0.05), { col: CR }); return; }
  const za = ap(t, 'C01', 0, 0.6), z = lerp(0.6, 1, za);
  ctx.save(); ctx.translate(CX, 560); ctx.scale(z, z); ctx.translate(-CX, -560);
  drawChain(CH, th1(t), GM, za);
  ctx.restore();
  // 齿数标签
  [[CH[0].x - 60, CH[0].y + 228], [CH[1].x, CH[1].y - 105], [CH[2].x + 60, CH[2].y + 50]].forEach(([x, y], k) => label(GN[k], x, y, 24, CH[k].col, ap(t, 'C01', 0.1 + 0.08 * k), { bold: true }));
  // 比例牌 ×3 / ×2，H01 后合成 ×6
  const merge = eIO(prog(t, P('H01', 0.75), 0.6));
  const ta3 = ap(t, 'C01', 0.35) , ta2 = ap(t, 'C01', 0.8);
  const p3 = [lerp(960, 1040, merge), lerp(712, 380, merge)], p2 = [lerp(1130, 1040, merge), lerp(455, 380, merge)];
  if (merge < 1) { ratioTag('×3', p3[0], p3[1], GOLD, ta3 * (1 - merge)); ratioTag('×2', p2[0], p2[1], RED, ta2 * (1 - merge)); }
  if (merge > 0) { ratioTag('×6', 1040, 380, PROD, merge, { size: 48, s: eBack(merge) }); if (merge > 0.6) burst(t, P('H01', 0.75) + 0.45, 1040, 380, GOLD, 110, 14); }
  // 圈数计数器（H01 起）
  if (t > S('H01') - 0.1) {
    const [a0, d0] = turnWin(), k = eIO(prog(t, a0, d0)), ca = ap(t, 'H01', 0);
    panel(1150, 680, 210, 170, CYAN, ca);
    [[`大  ${k.toFixed(2)} 圈`, CYAN, 1], [`中  ${(3 * k).toFixed(2)} 圈`, GOLD, 3], [`小  ${(6 * k).toFixed(2)} 圈`, RED, 6]].forEach(([s, c], i) => label(s, 1255, 715 + i * 50, 28, c, ca, { font: F_MATH, bold: true }));
    abacus(t, 600, 160, 260, 280, [[3, '3', GOLD, P('H01', 0.2)], [2, '×2', RED, P('H01', 0.45)], [6, '=6', PROD, P('H01', 0.72)]], ap(t, 'H01', 0) * fadeOut(t, S('C03') + 0.4, 0.4));
  }
  if (t > S('C03')) glowText('一级一级传下去：倍数相乘', CX, 925, 36, GOLD, t, P('C03', 0.2));
};

// ======================= 管道（A82） =======================
const PN = { x: 650, g: 790, u: 960, f: 1130, y: 1290, cy: 560 };
function pipeView(t, a, o = {}) {
  if (a <= 0) return; const cy = o.cy ?? PN.cy;
  ctx.save(); ctx.globalAlpha *= a;
  // 玻璃管
  [[PN.g, INNER, o.gl || 'g'], [PN.f, OUTER, o.fl || 'f']].forEach(([x, c, l]) => {
    ctx.save(); ctx.fillStyle = hexA(c, 0.12); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.shadowColor = c; ctx.shadowBlur = 16; rr(x - 70, cy - 60, 140, 120, 22); ctx.fill(); ctx.stroke();
    ctx.globalAlpha *= 0.35; ctx.fillStyle = '#fff'; rr(x - 58, cy - 50, 116, 14, 7); ctx.fill(); ctx.restore();
    mathText(l, x, cy + 16, 50, c, { align: 'center', glow: 14 });
  });
  arrowH(PN.x + 26, PN.g - 76, cy, CR, 0.8); arrowH(PN.g + 76, PN.u - 26, cy, CR, 0.8); arrowH(PN.u + 26, PN.f - 76, cy, CR, 0.8); arrowH(PN.f + 76, PN.y - 26, cy, CR, 0.8);
  [['x', PN.x, CYAN], [o.ul || 'u', PN.u, INNER], ['y', PN.y, GOLD]].forEach(([s, x, c]) => mathText(s, x, cy + 14, 42, c, { align: 'center', glow: 12 }));
  ctx.restore();
}
// 脉冲：在 x0 → x1 间移动的竖条，高度 h0 → h1
function pulse(t, t0, d, x0, x1, h0, h1, col0, col1, cy = PN.cy, tHide = 1e9) {
  const p = prog(t, t0, d); if (p <= 0 || t > tHide) return;
  const e = eIO(p), x = lerp(x0, x1, e), h = lerp(h0, h1, eIO(prog(p, 0.35, 0.4))), c = p < 0.55 ? col0 : col1, y = cy - 110;
  ctx.save(); ctx.fillStyle = hexA(c, 0.85); ctx.shadowColor = c; ctx.shadowBlur = 18; ctx.fillRect(x - 7, y - h, 14, h); ctx.restore();
}
SC.pipe = t => {
  starfield(t); blueprint(0.42, 80);
  // D02：椭圆齿轮，倍数忽大忽小
  const ea = fadeOut(t, S('C04'), 0.45);
  if (ea > 0) {
    const wob = 1 + 0.18 * Math.sin(t * 3.1);
    ctx.save(); ctx.translate(980, 560); ctx.scale(1.06 * wob, 0.82 / wob); ctx.translate(-980, -560); drawChain(CH, W0 * t + 0.6 * Math.sin(t * 2.2), GM, ea); ctx.restore();
    const r1 = 3 + 1.4 * Math.sin(t * 4.3), r2 = 2 + 0.9 * Math.sin(t * 5.1 + 1);
    ratioTag('×' + r1.toFixed(1), 960, 740, GOLD, ea * ap(t, 'D02', 0.15)); ratioTag('×' + r2.toFixed(1), 1150, 440, RED, ea * ap(t, 'D02', 0.25));
    label('倍数一会儿大、一会儿小', CX, 250, 34, CR, ea * ap(t, 'D02', 0.3), { bold: true });
  }
  // C04：每一瞬间的倍数 = 导数
  const ia = ap(t, 'C04', 0.05) * fadeOut(t, S('C05'), 0.4);
  if (ia > 0) {
    const G = { cx: 700, cy: 820, ux: 150, uy: 120, x0: 0, x1: 4.2, y0: 0, y1: 4.4 }, f = x => 0.25 * x * x + 0.4;
    gAxes(G, ia, { grid: false }); gPlot(G, f, RED, { a: ia });
    const x0 = 2.2, h = lerp(1.4, 0.05, eIO(prog(t, P('C04', 0.3), D('C04') * 0.45)));
    gDot(G, x0, f(x0), GOLD, ia); gDot(G, x0 + h, f(x0 + h), CYAN, ia);
    gLine(G, (f(x0 + h) - f(x0)) / h, x0, f(x0), 0.6, 4.1, INV, ia, 3);
    seg(gx(G, x0), gy(G, f(x0)), gx(G, x0 + h), gy(G, f(x0)), CYAN, ia, 3); seg(gx(G, x0 + h), gy(G, f(x0)), gx(G, x0 + h), gy(G, f(x0 + h)), GOLD, ia, 3);
    label('挪一点点', gx(G, x0 + h / 2), gy(G, f(x0)) + 30, 24, CYAN, ia, { bold: true });
    label('跟着挪', gx(G, x0 + h) + 64, gy(G, (f(x0) + f(x0 + h)) / 2), 24, GOLD, ia, { bold: true });
    label(`倍数 ${((f(x0 + h) - f(x0)) / h).toFixed(2)}`, 820, 340, 34, INV, ia, { font: F_MATH, bold: true });
    if (t > P('C04', 0.75)) glowText('瞬间的倍数 = 导数', 860, 260, 38, GRN, t, P('C04', 0.75));
  }
  // C05–C07：复合管道
  if (t > S('C05') - 0.1) {
    const pa = ap(t, 'C05', 0);
    pipeView(t, pa);
    label('第一章 · 复合管道', CX, 300, 28, CR, pa * 0.8, { bold: true });
    label('中间量', PN.u, PN.cy + 60, 24, INNER, ap(t, 'C05', 0.5), { bold: true });
    if (t > S('C06')) {
      const d1 = D('C06') * 0.38;
      pulse(t, P('C06', 0.02), d1, PN.x, PN.u, 30, 60, CYAN, INNER, PN.cy, P('C06', 0.5));
      pulse(t, P('C06', 0.5), d1, PN.u, PN.y, 60, 150, INNER, GOLD);
      ratioTag('× g′', PN.g, PN.cy + 130, INNER, ap(t, 'C06', 0.3) * (1 - eIO(prog(t, P('C07', 0.15), 0.5))));
      ratioTag('× f′', PN.f, PN.cy + 130, OUTER, ap(t, 'C06', 0.8) * (1 - eIO(prog(t, P('C07', 0.15), 0.5))));
      label('Δx', PN.x, PN.cy - 180, 28, CYAN, ap(t, 'C06', 0.02), { font: F_MATH }); label('Δu', PN.u, PN.cy - 200, 28, INNER, ap(t, 'C06', 0.4), { font: F_MATH }); label('Δy', PN.y, PN.cy - 290, 28, GOLD, ap(t, 'C06', 0.9), { font: F_MATH });
    }
    if (t > S('C07')) {
      const m = eIO(prog(t, P('C07', 0.15), 0.5));
      if (m < 1) { ratioTag('× g′', lerp(PN.g, CX - 60, m), PN.cy + 130, INNER, m); ratioTag('× f′', lerp(PN.f, CX + 60, m), PN.cy + 130, OUTER, m); }
      if (m >= 1) ratioTag('× f′ · g′', CX, PN.cy + 130, PROD, 1, { size: 40, s: eBack(prog(t, P('C07', 0.15) + 0.5, 0.35)) });
      termCard('chain rule', '链式法则', CX, 860, t, P('C07', 0.6));
    }
  }
};

// ======================= 莱布尼茨（A83） =======================
SC.leibniz = t => {
  starfield(t); blueprint(0.42, 80);
  const s = 70, y = 470, a = ap(t, 'G01', 0.05);
  const dy = [['dy', GOLD]], dx = [['dx', CYAN]], du = [['du', INNER]], duG = [['du', '#ffffff']];
  const wA = fracW(dy, dx, s), wB = fracW(dy, du, s), wC = fracW(du, dx, s), eq = mathW(' = ', s), dot = mathW(' · ', s), tot = wA + eq + wB + dot + wC;
  let x = CX - tot / 2;
  const glow = win(t, P('G01', 0.55), S('G02') + 0.4, 0.3);
  frac(dy, dx, x, y, s, a); x += wA; mathText(' = ', x, y + s * 0.3, s, CR, { alpha: a, upright: true }); x += eq;
  const xB = x; frac(dy, glow > 0.5 ? duG : du, x, y, s, ap(t, 'G01', 0.25)); x += wB;
  mathText(' · ', x, y + s * 0.3, s, CR, { alpha: ap(t, 'G01', 0.35), upright: true }); x += dot;
  const xC = x; frac(glow > 0.5 ? duG : du, dx, x, y, s, ap(t, 'G01', 0.4));
  if (glow > 0) { [[xB + wB / 2, y + s * 0.75], [xC + wC / 2, y - s * 0.55]].forEach(([cx, cy]) => { ctx.save(); ctx.globalAlpha *= glow * 0.5; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 30; ctx.beginPath(); ctx.ellipse(cx, cy, 52, 40, 0, 0, 7); ctx.fill(); ctx.restore(); }); }
  // “约分”斜线（D03 时闪两下）
  const sl = eOut(prog(t, P('G01', 0.75), 0.4)) * (t > S('D03') ? (0.65 + 0.35 * Math.cos((t - S('D03')) * 14)) : 1);
  [[xB + wB / 2, y + s * 0.75], [xC + wC / 2, y - s * 0.55]].forEach(([cx, cy]) => seg(cx - 44 * sl, cy + 34 * sl, cx + 44 * sl, cy - 34 * sl, RED, sl > 0 ? 1 : 0, 5));
  label('约分？', xB + wB + dot / 2, y + 170, 30, RED, ap(t, 'G01', 0.8), { bold: true });
  label('读作：y 对 x 的导数 = y 对 u 的导数 × u 对 x 的导数', CX, 290, 26, CR, ap(t, 'G01', 0.2) * 0.85, { bold: false, font: F_BODY });
  if (t > S('G02')) {
    stampMark(CX, y + 30, 120, t, P('G02', 0.15), { text: '不是约分', rot: -0.18 });
    glowText('导数不是真的分数 · 证明见“链式法则”一段', CX, 800, 32, CYAN, t, P('G02', 0.5));
  }
};

// ======================= 例子（A84） =======================
function boxR(x, y, w, h, col, a, fill = 0.1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, fill); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 14; rr(x, y, w, h, 16); ctx.fill(); ctx.stroke(); ctx.restore(); }
SC.example = t => {
  starfield(t); blueprint(0.42, 80);
  if (t > S('D04') - 0.3) drawChain(CH.map(g => Object.assign({}, g, { x: g.x + 40, y: g.y - 40 })), W0 * t, GM, 0.16 * ap(t, 'D04', 0, 0.6));
  richReveal([['y = ', GOLD], ['(', OUTER], ['2x + 1', INNER], [')^3', OUTER]], CX, 230, 52, t, P('C08', 0.05));
  // 嵌套盒子
  const oa = ap(t, 'C08', 0.45), ia = ap(t, 'C08', 0.75), pop = t > S('C09') ? Math.sin(Math.PI * prog(t, P('C09', 0.02), 0.4)) * 10 : 0;
  boxR(700 - pop, 300 - pop, 560 + 2 * pop, 190 + 2 * pop, OUTER, oa); label('外层：立方', 790, 330, 26, OUTER, oa, { bold: true, align: 'left' });
  mathText('(', 760, 440, 70, OUTER, { alpha: oa, glow: 12, upright: true }); mathText(')^3', 1150, 440, 70, OUTER, { alpha: oa, glow: 12, upright: true });
  boxR(830, 360, 300, 110, INNER, ia, 0.14); label('里层', 980, 380, 22, INNER, ia, { bold: true });
  mathText('2x + 1', 980, 442, 56, INNER, { align: 'center', alpha: ia, glow: 12 });
  if (t > S('C09')) {
    const y = 600;
    richReveal([['3(', OUTER], ['2x + 1', INNER], [')^2', OUTER]], 700, y, 46, t, P('C09', 0.08), { align: 'left' });
    label('外层求导，里层不动', 810, y + 50, 22, OUTER, ap(t, 'C09', 0.2), { bold: true });
    richReveal([['× ', CR], ['2', INNER]], 960, y, 46, t, P('C09', 0.5), { align: 'left' });
    label('里层的导数', 995, y + 50, 22, INNER, ap(t, 'C09', 0.55), { bold: true });
    richReveal([['= 6(2x + 1)^2', PROD]], 1050, y, 46, t, P('C09', 0.78), { align: 'left' });
  }
  if (t > S('H02') - 0.1) {
    const a = ap(t, 'H02', 0);
    panel(660, 690, 700, 200, SQ.H.col, a); label('混元 · 展开验算', 1010, 715, 22, SQ.H.col, a, { bold: true });
    richReveal([['(2x + 1)^3 = 8x^3 + 12x^2 + 6x + 1', CR]], 690, 775, 34, t, P('H02', 0.12), { align: 'left' });
    richReveal([['求导 → 24x^2 + 24x + 6 = ', CR], ['6(2x + 1)^2', PROD]], 690, 845, 34, t, P('H02', 0.45), { align: 'left' });
    checkMark(1320, 830, 30, GRN, t, P('H02', 0.85));
  }
  if (t > S('D04')) glowText('求导的背后，也是一串齿轮', CX, 940 - 0, 30, GOLD, t, P('D04', 0.2), { out: E('D04') + 0.5 });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.42, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 300);
  const a = ap(t, 'C11', 0);
  pipeView(t, a, { cy: 600, gl: '×2', fl: '×5', ul: 'u' });
  richReveal([['du/dx = 2', INNER], ['，  ', CR], ['dy/du = 5', OUTER]], 900, 300, 40, t, P('C11', 0.1), { upright: true });
  richReveal([['dy/dx = ?', GOLD]], 900, 380, 44, t, P('C11', 0.7), { upright: true });
  const q = quizBeats()[0];
  if (q) { pulse(t, q.vo, 1.4, PN.x, PN.u, 24, 48, CYAN, INNER, 600, q.vo + 1.5); pulse(t, q.vo + 1.5, 1.4, PN.u, PN.y, 48, 240, INNER, GOLD, 600); }
  if (t > S('D05')) { ratioTag('×10', CX, 780, PROD, 1, { size: 52, s: eBack(prog(t, P('D05', 0.2), 0.35)) }); burst(t, P('D05', 0.3), CX, 780, GOLD, 120, 16); }
};

// ======================= 小结 =======================
const KW = [['指数', GOLD], ['三角', RED], ['隐函数', CYAN], ['相关变化率', GRN]];
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C12', 0) * fadeOut(t, S('C14'), 0.4);
  if (ga > 0) {
    drawChain(CH, W0 * t * 1.6, GM, ga);
    ratioTag('×3', 960, 712, GOLD, ga * 0.8); ratioTag('×2', 1130, 455, RED, ga * 0.8);
    termCard('chain rule', '链式法则', 1180, 250, t, P('C12', 0.4), { out: S('C14') });
    const th = W0 * t * 1.6;
    KW.forEach(([s, c], k) => {
      const g = CH[0], an = th + k * Math.PI / 2 + 0.4, r = 110;
      const p = eBack(prog(t, P('C13', 0.1 + 0.15 * k), 0.35)); if (p <= 0) return;
      ctx.save(); ctx.globalAlpha *= ga; slab(s, g.x + Math.cos(an) * r, g.y + Math.sin(an) * r, 26, t, P('C13', 0.1 + 0.15 * k), { bg: c, c: COL.ink, rot: 0 }); ctx.restore();
    });
  }
  if (t > S('C14') - 0.1) { glowText('下一段：高中速通 · 求导公式', CX, 500, 54, CR, t, P('C14', 0.15)); glowText('Kimi 客串', CX, 590, 32, SQ.K.col, t, P('C14', 0.45), { bold: false }); }
  credits(t, E('C14') + 0.38, 'AI娘微积分课 · 第 3 章 · P0 齿轮链', '下一段：高中速通', [...CREDIT_BASE, ...CREDIT_H, ...CREDIT_END, CREDIT_TM]);
};

SC.__overlay = t => { if (t < E('C14') + 0.25) lecturer(t, 'C', 255, -5, E('C14') + 0.48, { h: 710 }); };
SC.__noTag = E('C14') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C14') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.05, 'tick', 0.2); s('D01', 0.4, 'tick2', 0.2); s('D01', 0.75, 'tick', 0.2);
  s('C01', 0.0, 'swoosh_in', 0.22); s('C01', 0.35, 'pop', 0.24); s('C01', 0.8, 'pop', 0.24);
  s('H01', 0.2, 'click', 0.3); s('H01', 0.45, 'click', 0.3); s('H01', 0.72, 'click', 0.3); s('H01', 0.9, 'ding_hi', 0.28);
  s('C03', 0.2, 'shimmer', 0.18);
  s('D02', 0.15, 'glitch', 0.16); s('C04', 0.3, 'riser', 0.12); s('C04', 0.75, 'ding', 0.24);
  s('C05', 0.0, 'swoosh_in', 0.2); s('C06', 0.02, 'zap', 0.16); s('C06', 0.3, 'pop', 0.22); s('C06', 0.5, 'zap', 0.16); s('C06', 0.8, 'pop', 0.22);
  s('C07', 0.15, 'swell', 0.2); s('C07', 0.6, 'slam', 0.3);
  s('G01', 0.25, 'type', 0.16); s('G01', 0.55, 'shimmer', 0.2); s('G01', 0.75, 'slap', 0.18); s('D03', 0.1, 'sparkle', 0.2); s('G02', 0.15, 'stamp', 0.32);
  s('C08', 0.05, 'type', 0.16); s('C08', 0.45, 'pop', 0.22); s('C08', 0.75, 'pop', 0.22);
  s('C09', 0.08, 'type', 0.16); s('C09', 0.5, 'pluck', 0.22); s('C09', 0.78, 'ding_lo', 0.26);
  s('H02', 0.12, 'click', 0.24); s('H02', 0.45, 'click', 0.24); s('H02', 0.85, 'check', 0.3); s('D04', 0.2, 'shimmer', 0.18);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D05', 0.2, 'ding_hi', 0.3);
  s('C12', 0.4, 'slam', 0.26); [0.1, 0.25, 0.4, 0.55].forEach(f => s('C13', f, 'pop', 0.22)); s('C14', 0.15, 'swell', 0.3);
})();
finalize();
