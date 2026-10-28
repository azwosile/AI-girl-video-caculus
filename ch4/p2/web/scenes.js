// 第 4 章 P2《极值与最值》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A127 最值定理三反例逐个打叉 · A128 山峰山谷：局部 vs 整体 · A129 临界点探测器（驻点绿、尖点红） · A130 候选值擂台
const SC = {};
const TITLES = [['evt', '最值定理'], ['local', '极值 vs 最值'], ['fermat', '费马定理与临界点'], ['arena', '闭区间法'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 最值定理三反例（A127） =======================
const PX = [630, 870, 1110], PW = 220;
const mini = i => ({ cx: PX[i] + 30, cy: 640, ux: 160, uy: 160, x0: 0, x1: 1.15, y0: 0, y1: 1.3 });
const mini3 = { cx: PX[2] + 110, cy: 520, ux: 80, uy: 22, x0: -1.2, x1: 1.2, y0: -5.5, y1: 5.5 };
SC.evt = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C03') + 0.2) {
    const fa = fadeOut(t, S('C03'), 0.35);
    ctx.save(); ctx.globalAlpha *= fa;
    termCard('Extreme Value Theorem', '最值定理（同济补充）', CX, 300, t, P('C02', 0.05));
    richReveal([['f 在 ', CR], ['[a, b]', GOLD], [' 上连续', RED]], CX, 470, 40, t, P('C02', 0.35), { upright: true });
    richReveal([['⇒ 有界，且取得到 ', CR], ['最大值 M', GOLD], [' 与 ', CR], ['最小值 m', CYAN]], CX, 550, 40, t, P('C02', 0.6), { upright: true });
    if (t > S('D01')) { slab('闭区间？', 820, 680, 30, t, P('D01', 0.3), { bg: GOLD, c: COL.ink }); slab('连续？', 1140, 680, 30, t, P('D01', 0.5), { bg: RED }); }
    ctx.restore(); if (t < S('C03')) return;
  }
  const heads = [['开区间', 'C03', 0.05], ['有断点', 'C04', 0.02], ['无界', 'C04', 0.5]];
  heads.forEach(([h, id, f], i) => {
    const a = ap(t, id, f); if (a <= 0) return; panel(PX[i], 300, PW, 400, i === 0 ? GOLD : RED, a); label(h, PX[i] + PW / 2, 335, 26, i === 0 ? GOLD : RED, a, { bold: true });
    ctx.save(); ctx.globalAlpha *= a;
    if (i < 2) { const G = mini(i); gAxes(G, 1, { grid: false }); gH(G, 1, CR, 0.4, { xa: 0, xb: 1.1, dash: [6, 6] }); mathText('1', G.cx - 14, gy(G, 1) + 8, 20, CR, { align: 'right', alpha: 0.7 }); }
    if (i === 0) { const G = mini(0); gPlot(G, x => x, RED, { xa: 0, xb: 1, p: eIO(prog(t, P('C03', 0.2), 0.8)), noHead: true }); gDot(G, 0, 0, RED, 1, true); gDot(G, 1, 1, RED, 1, true); const q = ap(t, 'C03', 0.55); if (q > 0) { const xx = 0.6 + 0.38 * (1 - Math.exp(-(t - P('C03', 0.55)) * 0.9)); gDot(G, xx, xx, GOLD, q); label('够不着 1', PX[0] + PW / 2, 400, 22, GOLD, q, { bold: true }); } }
    if (i === 1) { const G = mini(1); gPlot(G, x => x, RED, { xa: 0, xb: 1, noHead: true }); gDot(G, 0, 0, RED, 1); gDot(G, 1, 1, RED, 1, true); gDot(G, 1, 0.2, RED, 1); label('最高点被挖掉', PX[1] + PW / 2, 400, 22, GOLD, ap(t, 'C04', 0.25), { bold: true }); }
    if (i === 2) { const G = mini3; gAxes(G, 1, { grid: false }); gPlot(G, x => 1 / x, RED, { xa: 0.05, xb: 1.2 }); gPlot(G, x => 1 / x, RED, { xa: -1.2, xb: -0.05 }); arrowV(gx(G, 0.2), gy(G, 3.5), gy(G, 5.2), GOLD, ap(t, 'C04', 0.7)); label('→ ∞', gx(G, 0.2) + 40, gy(G, 5), 22, GOLD, ap(t, 'C04', 0.7), { bold: true }); }
    ctx.restore();
    crossMark(PX[i] + PW - 30, 335, 30, COL.red, t, P(id, f + 0.3));
  });
  if (t > S('C05')) { slab('闭区间', 820, 790, 32, t, P('C05', 0.2), { bg: GOLD, c: COL.ink }); slab('连续', 1140, 790, 32, t, P('C05', 0.3), { bg: RED }); glowText('缺一不可', CX, 880, 40, CR, t, P('C05', 0.55)); }
};

// ======================= 局部 vs 整体（A128） =======================
const GL = { cx: 650, cy: 760, ux: 66, uy: 70, x0: 0, x1: 10, y0: 0, y1: 6.4 };
const mF = x => 2.6 + 1.3 * Math.sin(1.35 * x + 0.4) + 0.35 * Math.sin(2.9 * x) + 0.6 * Math.exp(-((x - 5.2) ** 2));
const EXT = (() => { const r = []; for (let i = 1; i < 999; i++) { const x = i / 100, a = mF(x - 0.01), b = mF(x), c = mF(x + 0.01); if (b > a && b > c) r.push([x, b, 1]); if (b < a && b < c) r.push([x, b, -1]); } return r; })();
const GMAX = EXT.concat([[0, mF(0), 0], [10, mF(10), 0]]).reduce((m, e) => e[1] > m[1] ? e : m), GMIN = EXT.concat([[0, mF(0), 0], [10, mF(10), 0]]).reduce((m, e) => e[1] < m[1] ? e : m);
SC.local = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C06', 0);
  gAxes(GL, a, { grid: false, xl: 'x', yl: 'y' });
  gPlot(GL, mF, RED, { a, p: eIO(prog(t, P('C06', 0.0), 1.3)) });
  EXT.forEach(([x, y, k], i) => { const p = ap(t, 'C06', k > 0 ? 0.25 + 0.04 * i : 0.4 + 0.04 * i); if (p <= 0) return; gDot(GL, x, y, k > 0 ? GOLD : CYAN, p); label(k > 0 ? '极大' : '极小', gx(GL, x), gy(GL, y) + (k > 0 ? -32 : 34), 20, k > 0 ? GOLD : CYAN, p, { bold: true }); });
  const g = ap(t, 'C06', 0.75);
  if (g > 0) {
    ctx.save(); ctx.globalAlpha *= g; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(gx(GL, GMAX[0]), gy(GL, GMAX[1]), 20, 0, 7); ctx.stroke(); ctx.restore();
    slab('最大值', gx(GL, GMAX[0]), gy(GL, GMAX[1]) - 72, 26, t, P('C06', 0.75), { bg: GOLD, c: COL.ink });
    ctx.save(); ctx.globalAlpha *= g; ctx.strokeStyle = CYAN; ctx.lineWidth = 3; ctx.shadowColor = CYAN; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(gx(GL, GMIN[0]), gy(GL, GMIN[1]), 20, 0, 7); ctx.stroke(); ctx.restore();
    slab('最小值', gx(GL, GMIN[0]) + 40, gy(GL, GMIN[1]) + 62, 26, t, P('C06', 0.85), { bg: CYAN, c: COL.ink });
  }
  if (t > S('Z01')) {
    const loc = EXT.find(e => e[2] > 0 && e !== GMAX) || EXT[0];
    const za = ap(t, 'Z01', 0.1);
    gBand(GL, loc[0] - 0.8, loc[0] + 0.8, 0, 6.4, 'rgba(201,195,230,0.08)', za);
    label('“这个月”最高', gx(GL, loc[0]), 230, 24, SQ.Z.col, za, { bold: true });
    label('“全年”最贵', gx(GL, GMAX[0]), 300, 24, GOLD, ap(t, 'Z01', 0.55), { bold: true });
  }
};

// ======================= 费马定理 + 临界点（A129） =======================
const GF = { cx: 650, cy: 760, ux: 46, uy: 56, x0: 0, x1: 7, y0: 0, y1: 8 };
const pk = x => 6.4 - 0.45 * (x - 3.5) * (x - 3.5);
const GX3 = { cx: 1170, cy: 380, ux: 70, uy: 36, x0: -1.7, x1: 1.7, y0: -3, y1: 3 };
const GCU = { cx: 1170, cy: 780, ux: 70, uy: 60, x0: -1.7, x1: 1.7, y0: 0, y1: 2.6 };
SC.fermat = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G01', 0);
  panel(610, 220, 380, 600, SQ.G.col, a * 0.6);
  gAxes(GF, a, { grid: false });
  gPlot(GF, pk, RED, { a });
  label('费马定理', 800, 255, 28, SQ.G.col, a, { bold: true });
  // G02：两侧割线收拢成水平切线
  if (t > S('G02') - 0.1) {
    const h = lerp(2.5, 0.05, eIO(prog(t, P('G02', 0.1), D('G02') * 0.7))), ga = ap(t, 'G02', 0) * fadeOut(t, E('G03') + 0.3, 0.3);
    const xl = 3.5 - h, xr = 3.5 + h, ml = (pk(3.5) - pk(xl)) / h, mr = (pk(xr) - pk(3.5)) / h;
    gLine(GF, ml, 3.5, pk(3.5), xl - 0.4, 3.5 + 0.6, GRN, ga, 3); gLine(GF, mr, 3.5, pk(3.5), 3.5 - 0.6, xr + 0.4, SEC, ga, 3);
    gDot(GF, xl, pk(xl), GRN, ga); gDot(GF, xr, pk(xr), SEC, ga);
    label('左割线 ≥ 0', 720, 330, 22, GRN, ga, { bold: true, align: 'left' }); label('右割线 ≤ 0', 980 - 10, 330, 22, SEC, ga, { bold: true, align: 'right' });
    const fa = ap(t, 'G02', 0.8);
    if (fa > 0) { gH(GF, pk(3.5), GOLD, fa, { xa: 2, xb: 5, w: 3.5 }); richReveal([["f'(c) = 0", GOLD]], 800, 870, 34, t, P('G02', 0.8), { upright: true }); }
    gDot(GF, 3.5, pk(3.5), GOLD, a);
  }
  // G03：x³ 反例
  if (t > S('G03') - 0.1) {
    const b = ap(t, 'G03', 0); panel(1010, 220, 330, 330, GOLD, b);
    gAxes(GX3, b, { grid: false }); gPlot(GX3, x => x * x * x, RED, { a: b }); gH(GX3, 0, GOLD, ap(t, 'G03', 0.35), { xa: -1, xb: 1, w: 3 });
    label('y = x³', 1080, 255, 24, RED, b, { font: F_MATH }); crossMark(1305, 255, 26, COL.red, t, P('G03', 0.6)); label('不是极值', 1250, 520, 22, COL.red, ap(t, 'G03', 0.6), { bold: true });
  }
  // C07：尖点
  if (t > S('C07') - 0.1) {
    const c = ap(t, 'C07', 0); panel(1010, 580, 330, 300, RED, c);
    gAxes(GCU, c, { grid: false }); gPlot(GCU, x => Math.abs(x), CYAN, { a: c }); gPlot(GCU, x => Math.cbrt(x * x), RED, { a: c * ap(t, 'C07', 0.35) });
    label('|x|', 1050, 610, 22, CYAN, c, { font: F_MATH, align: 'left' }); label('x^(2/3)', 1300, 610, 22, RED, ap(t, 'C07', 0.35), { font: F_MATH, align: 'right' });
  }
  // C08：探测器扫描（驻点绿、尖点红）+ 术语
  if (t > S('C08') - 0.1) {
    const sp = prog(t, P('C08', 0.05), D('C08') * 0.55);
    if (sp > 0 && sp < 1) { const x = lerp(1010, 1340, sp); seg(x, 230, x, 870, CYAN, 0.7, 2); }
    if (sp > 0.5) { glowDot(gx(GX3, 0), gy(GX3, 0), 10, GRN); glowDot(gx(GCU, 0), gy(GCU, 0), 10, COL.red); }
    if (sp > 0.5) { label('驻点', gx(GX3, 0) + 50, gy(GX3, 0) + 32, 22, GRN, ap(t, 'C08', 0.35), { bold: true }); label('不可导点', gx(GCU, 0) + 70, gy(GCU, 0) - 18, 22, COL.red, ap(t, 'C08', 0.35), { bold: true }); }
    termCard('critical number', '临界点 = 驻点 + 不可导点', 800, 930 - 20, t, P('C08', 0.6));
  }
};

// ======================= 闭区间法擂台（A130） =======================
const GA = { cx: 678, cy: 754, ux: 72, uy: 28, x0: -0.8, x1: 4.3, y0: -4, y1: 18 };
const aF = x => x * x * x - 3 * x * x + 1;
const CAND = [[-0.5, '1/8', 0.125, '−1/2', 0.42], [0, '1', 1, '0', 0.55], [2, '−3', -3, '2', 0.7], [4, '17', 17, '4', 0.85]];
SC.arena = t => {
  starfield(t); blueprint(0.4, 80);
  const steps = [['临界点', GRN], ['+ 端点', GOLD], ['算值', CYAN], ['比大小', RED]];
  if (t < S('Z02') + 0.2) steps.forEach(([s, c], i) => { ctx.save(); ctx.globalAlpha *= fadeOut(t, S('Z02'), 0.3); slab(s, 720 + i * 180, 480, 30, t, P('C09', 0.15 + 0.17 * i), { bg: c, c: COL.ink, rot: 0 }); ctx.restore(); });
  if (t < S('Z02')) return;
  const a = ap(t, 'Z02', 0);
  richReveal([['f(x) = x^3 − 3x^2 + 1', RED], ['，  ', CR], ['[−1/2, 4]', GOLD]], 660, 200, 32, t, P('Z02', 0.15), { align: 'left', upright: true });
  gAxes(GA, a, { grid: false, ticks: { x: [[2, '2'], [4, '4']], y: [[17, '17'], [-3, '−3']] } });
  gBand(GA, -0.5, 4, -4, 18, 'rgba(255,210,90,0.06)', a);
  gPlot(GA, aF, RED, { a, xa: -0.75, xb: 4.15, p: eIO(prog(t, P('Z02', 0.3), 1)) });
  if (t > S('C10')) richReveal([["f'(x) = 3x^2 − 6x = 3x(x − 2)", GRN]], 660, 255, 28, t, P('C10', 0.05), { align: 'left', upright: true });
  // 擂台柱
  const base = 640, k = 18, bw = 50;
  const ra = ap(t, 'C10', 0.35); panel(1050, 230, 300, 620, GOLD, ra * 0.8); label('候选值擂台', 1200, 262, 24, GOLD, ra, { bold: true });
  if (ra > 0) seg(1065, base, 1335, base, CR, ra * 0.5, 2);
  CAND.forEach(([x, s, v, xs, f], i) => {
    const p = ap(t, 'C10', f); if (p <= 0) return; gDot(GA, x, v, x === 0 || x === 2 ? GRN : GOLD, p);
    const bx = 1085 + i * 65, h = v * k * eOut(p), win = t > S('D03') + 0.1 && (v === 17 || v === -3);
    const col = v === 17 && t > S('Z03') ? GOLD : v === -3 && t > S('D03') ? CYAN : x === 0 || x === 2 ? GRN : hexA(GOLD, 0.7);
    ctx.save(); ctx.fillStyle = hexA(col, 0.75); ctx.shadowColor = col; ctx.shadowBlur = win ? 22 : 8; ctx.fillRect(bx, Math.min(base, base - h), bw, Math.abs(h) || 2); ctx.restore();
    mathText(s, bx + bw / 2, v >= 0 ? base - h - 12 : base - h + 32, 24, CR, { align: 'center', alpha: p, upright: true });
    mathText(xs, bx + bw / 2, 800, 20, hexA(CR, 0.7), { align: 'center', alpha: p, upright: true });
  });
  if (ra > 0) label('x =', 1062, 793, 18, hexA(CR, 0.7), ra, { align: 'left' });
  if (t > S('Z03')) { stampMark(gx(GA, 4) - 70, gy(GA, 17) + 40, 44, t, P('Z03', 0.15), { text: '端点', col: GOLD }); burst(t, P('Z03', 0.1), 1085 + 3 * 65 + 25, base - 17 * k, GOLD, 80, 10); }
  if (t > S('D03')) { label('最大 17', 1200, 300, 26, GOLD, ap(t, 'D03', 0.2), { bold: true }); label('最小 −3', 1200, 760, 24, CYAN, ap(t, 'D03', 0.55), { bold: true }); }
};

// ======================= 随堂 =======================
const GQ = { cx: 720, cy: 720, ux: 120, uy: 60, x0: -0.4, x1: 3.4, y0: -1.6, y1: 4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C11', 0, 0.5) * 0.42, 78);
  if (t < S('C12')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C11') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['f(x) = x^2 − 2x', RED], ['，  ', CR], ['[0, 3]', GOLD], [' 上最大值 = ?', CR]], 900, 230, 36, t, P('C12', 0.1), { upright: true });
  if (t > S('D04')) {
    const a = ap(t, 'D04', 0);
    gAxes(GQ, a, { grid: false, ticks: { x: [[1, '1'], [3, '3']], y: [[3, '3']] } });
    gPlot(GQ, x => x * x - 2 * x, RED, { a, xa: 0, xb: 3 });
    [[1, -1, 0.1, CYAN], [0, 0, 0.4, GOLD], [3, 3, 0.65, GOLD]].forEach(([x, y, f, c]) => { const p = ap(t, 'D04', f); gDot(GQ, x, y, c, p); if (p > 0) label(String(y).replace('-', '−'), gx(GQ, x) + 30, gy(GQ, y) - 20, 24, c, p, { font: F_MATH, bold: true }); });
    const w = ap(t, 'D04', 0.82); if (w > 0) { label('最大值 3（端点）', gx(GQ, 3) - 60, gy(GQ, 3) - 60, 26, GOLD, w, { bold: true }); burst(t, P('D04', 0.82), gx(GQ, 3), gy(GQ, 3), GOLD, 80, 10); }
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C13', 0) * fadeOut(t, S('C14'), 0.4);
  if (ga > 0) {
    [['最值定理', '保证存在', GOLD, 0.1], ['费马定理', '缩小范围', GRN, 0.4], ['闭区间法', '逐个比较', RED, 0.7]].forEach(([h, s, c, f], i) => {
      const x = 720 + i * 260; ctx.save(); ctx.globalAlpha *= ga; slab(h, x, 420, 30, t, P('C13', f), { bg: c, c: COL.ink, rot: 0 }); ctx.restore();
      label(s, x, 500, 26, c, ga * ap(t, 'C13', f + 0.05), { bold: true }); if (i < 2) arrowH(x + 90, x + 165, 420, CR, ga * ap(t, 'C13', f + 0.2));
    });
  }
  if (t > S('C14') - 0.1) { glowText('下一段：罗尔与拉格朗日中值定理', CX, 500, 50, CR, t, P('C14', 0.15)); glowText('Mistral 客串', CX, 590, 32, SQ.R.col, t, P('C14', 0.45), { bold: false }); }
  credits(t, E('C14') + 0.38, 'AI娘微积分课 · 第 4 章 · P2 极值与最值', '下一段：罗尔与拉格朗日', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM4('GLM')]);
};

SC.__overlay = t => { if (t < E('C14') + 0.25) lecturer(t, 'C', 255, -5, E('C14') + 0.48, { h: 710 }); };
SC.__noTag = E('C14') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C14') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C02', 0.05, 'slam', 0.26); s('C02', 0.35, 'type', 0.16); s('C02', 0.6, 'type', 0.16); s('D01', 0.3, 'pop', 0.22); s('D01', 0.5, 'pop', 0.22);
  s('C03', 0.05, 'swoosh_in', 0.2); s('C03', 0.35, 'buzz', 0.2); s('C04', 0.02, 'pop', 0.2); s('C04', 0.32, 'buzz', 0.2); s('C04', 0.5, 'pop', 0.2); s('C04', 0.8, 'buzz', 0.2);
  s('C05', 0.2, 'slap', 0.2); s('C05', 0.3, 'slap', 0.2); s('C05', 0.55, 'shimmer', 0.2);
  s('C06', 0.25, 'marimba', 0.2); s('C06', 0.4, 'marimba_lo', 0.2); s('C06', 0.75, 'ding_hi', 0.26); s('Z01', 0.1, 'tinkle', 0.2); s('Z01', 0.55, 'ding', 0.22);
  s('G02', 0.1, 'riser', 0.12); s('G02', 0.8, 'ding_hi', 0.28); s('G03', 0.35, 'pluck', 0.2); s('G03', 0.6, 'buzz', 0.22);
  s('C07', 0.05, 'pop', 0.2); s('C07', 0.35, 'pop', 0.2); s('C08', 0.05, 'laser', 0.16); s('C08', 0.33, 'ding', 0.24); s('C08', 0.6, 'slam', 0.26);
  [0.15, 0.32, 0.49, 0.66].forEach(f => s('C09', f, 'pop', 0.2)); s('Z02', 0.15, 'type', 0.16);
  CAND.forEach(c => s('C10', c[4], 'marimba', 0.22)); s('Z03', 0.15, 'stamp', 0.3); s('D03', 0.2, 'ding_hi', 0.28); s('D03', 0.55, 'ding_lo', 0.24);
  s('C11', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D04', 0.82, 'ding_hi', 0.3);
  [0.1, 0.4, 0.7].forEach(f => s('C13', f, 'pop', 0.22)); s('C14', 0.15, 'swell', 0.3);
})();
finalize();
