// 第 10 章 P1《参数曲线：让点动起来》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.1。
// A437 时间轴滑块驱动点画出 8 字形 + 方向箭头与时刻记忆点 · A438 列表描点 x = t² − 2t，y = t + 1 → 抛物线 · A439 同一个圆两张时间表、圆周运动的影子、sin²/cos² 线段陷阱
const SC = {};
const TITLES = [['def', '参数曲线'], ['ex', '列表描点'], ['speed', '时间表'], ['trap', '消参陷阱'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 参数曲线（A437） =======================
const G1 = { cx: 960, cy: 500, ux: 170, uy: 170, x0: -2, x1: 2, y0: -1.3, y1: 1.3 };
const fx1 = s => 1.7 * Math.sin(s), fy1 = s => 1.05 * Math.sin(2 * s);
function slider1(x0, x1, y, p, a, lab) {
  if (a <= 0) return; seg(x0, y, x1, y, 'rgba(237,230,216,0.6)', a, 3);
  for (let k = 0; k <= 8; k++) { const X = lerp(x0, x1, k / 8); seg(X, y - 8, X, y + 8, CR, a * 0.6, 2); }
  glowDot(lerp(x0, x1, p), y, 11, CYAN, a); label(lab, lerp(x0, x1, p), y - 32, 24, CYAN, a, { bold: true });
  label('t', x1 + 26, y, 26, CYAN, a, { bold: true });
}
SC.def = t => {
  starfield(t); blueprint(0.3, 80);
  const p = eIO(prog(t, P('K01', 0.15), E('C02') - P('K01', 0.15) - 0.3)), s = TAU * p, a = ap(t, 'K01', 0);
  gAxes(G1, a * 0.5, { grid: false, ticks: { x: [], y: [] } });
  const marks = [0.5, 1.2, 2.0, 2.8, 3.6, 4.4, 5.2, 6.0];
  paramTrace(G1, fx1, fy1, 0, TAU, SQ.K.col, { a, p, w: 4, arrows: t > S('C02') ? [0.6, 2.2, 3.7, 5.4] : [], ticks: marks.filter(m => t > S('K01')).map(m => [m, `t=${m}`, 0, -28]), tickSize: 18 });
  slider1(660, 1260, 820, p, ap(t, 'K01', 0.1), `t = ${s.toFixed(1)}`);
  if (t > S('C01')) {
    goldBox(980, 215, 470, 70, 'x = f(t)，y = g(t)', 36, ap(t, 'C01', 0.1));
    const X = gx(G1, fx1(s)), Y = gy(G1, fy1(s)), k = ap(t, 'C01', 0.4);
    seg(X, Y, X, G1.cy, CYAN, k * 0.6, 2, [5, 6]); seg(X, Y, G1.cx, Y, GOLD, k * 0.6, 2, [5, 6]);
    label(`(${fx1(s).toFixed(2)}, ${fy1(s).toFixed(2)})`, X + 70, Y - 34, 22, CR, k, { bold: true });
  }
  if (t > S('C02')) label('箭头：t 增大的方向', 1240, 300, 26, SQ.K.col, ap(t, 'C02', 0.2), { bold: true });
};

// ======================= 列表描点（A438） =======================
const G1e = { cx: 960, cy: 720, ux: 40, uy: 62, x0: -1.5, x1: 9, y0: -1.5, y1: 5.8 };
const T1 = [-2, -1, 0, 1, 2, 3, 4], ex1 = s => s * s - 2 * s, ey1 = s => s + 1;
SC.ex = t => {
  starfield(t); blueprint(0.34, 80);
  richReveal([['x = t² − 2t，', CYAN], ['y = t + 1', GOLD]], 980, 230, 36, t, P('C03', 0.05), { upright: true });
  const a = ap(t, 'C03', 0.3);
  panel(600, 300, 230, 430, CR, a); [['t', CR], ['x', CYAN], ['y', GOLD]].forEach(([h, c], j) => label(h, 645 + j * 70, 330, 26, c, a, { bold: true }));
  T1.forEach((s, i) => { const k = ap(t, 'C03', 0.35 + 0.08 * i); [s, ex1(s), ey1(s)].forEach((v, j) => label(String(v).replace('-', '−'), 645 + j * 70, 380 + i * 50, 24, [CR, CYAN, GOLD][j], a * k, { bold: true })); });
  gAxes(G1e, a * 0.55, { grid: false, ticks: { x: [[4, '4'], [8, '8']], y: [[2, '2'], [4, '4']] } });
  T1.forEach((s, i) => { const k = ap(t, 'C03', 0.35 + 0.08 * i); if (k > 0) glowDot(gx(G1e, ex1(s)), gy(G1e, ey1(s)), 7, GOLD, a * k); });
  if (t > S('G01')) {
    const p = prog(t, P('G01', 0.15), 2.2);
    paramTrace(G1e, ex1, ey1, -2, 4, SQ.G.col, { p, w: 4, arrows: [-1.5, 0.5, 2.5, 3.5], ticks: [[-2, 't=−2', 30, 26], [1, 't=1', -46, 0], [4, 't=4', 40, 0]], tickSize: 20 });
  }
  if (t > S('C04')) {
    richReveal([['t = y − 1  ⇒  ', CR], ['x = y² − 4y + 3', GOLD]], 1060, 300, 32, t, P('C04', 0.1), { upright: true });
    label('开口向右的抛物线', 1230, 360, 26, SQ.G.col, ap(t, 'C04', 0.6), { bold: true });
  }
};

// ======================= 时间表（A439） =======================
const GA1 = { cx: 760, cy: 500, ux: 150, uy: 150, x0: -1.25, x1: 1.25, y0: -1.25, y1: 1.25 }, GB1 = { cx: 1170, cy: 500, ux: 150, uy: 150, x0: -1.25, x1: 1.25, y0: -1.25, y1: 1.25 };
SC.speed = t => {
  starfield(t); blueprint(0.34, 80);
  const shadow = t > S('D01') - 0.1, a = ap(t, 'K02', 0) * (shadow ? fadeOut(t, S('D01') - 0.1, 0.4) : 1);
  const t0 = P('K02', 0.3), tt = Math.max(0, t - t0), s = Math.min(TAU, tt * 1.15);
  if (a > 0) {
    [[GA1, 1, 'cos t, sin t', CYAN], [GB1, 2, 'cos 2t, sin 2t', GOLD]].forEach(([G, w, lab, c], i) => {
      gAxes(G, a * 0.4, { grid: false, ticks: { x: [], y: [] } });
      ctx.save(); ctx.globalAlpha *= a * 0.4; ctx.strokeStyle = CR; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(G.cx, G.cy, G.ux, 0, TAU); ctx.stroke(); ctx.restore();
      const q = w * s; paramTrace(G, v => Math.cos(v), v => Math.sin(v), 0, Math.max(1e-3, Math.min(q, TAU)), c, { a, w: 5, dot: false });
      glowDot(gx(G, Math.cos(q)), gy(G, Math.sin(q)), 10, c, a); seg(G.cx, G.cy, gx(G, Math.cos(q)), gy(G, Math.sin(q)), c, a * 0.7, 2.5);
      label(lab, G.cx, G.cy + 210, 28, c, ap(t, 'C05', 0.15 + 0.3 * i) * a, { bold: true });
      label(`${(q / TAU).toFixed(2)} 圈`, G.cx, G.cy - 210, 26, c, a * ap(t, 'K02', 0.3), { bold: true });
    });
    label(`t = ${s.toFixed(2)}`, 965, 280, 26, CR, a * ap(t, 'K02', 0.3), { bold: true });
    if (t > S('C06')) { stampMark(1330, 330, 40, t, P('C06', 0.5), { text: '快一倍', col: GOLD, rot: -0.12 }); }
  }
  if (shadow) {
    const b = ap(t, 'D01', 0), G = { cx: 900, cy: 440, ux: 160, uy: 160, x0: -1.3, x1: 1.3, y0: -1.3, y1: 1.3 }, q = (t - S('D01')) * 2.2;
    ctx.save(); ctx.globalAlpha *= b * 0.5; ctx.strokeStyle = CR; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(G.cx, G.cy, G.ux, 0, TAU); ctx.stroke(); ctx.restore();
    const X = gx(G, Math.cos(q)), Y = gy(G, Math.sin(q)); glowDot(X, Y, 10, SQ.K.col, b); seg(X, Y, X, 720, CYAN, b * 0.6, 2, [5, 6]);
    seg(G.cx - 200, 720, G.cx + 200, 720, CR, b * 0.6, 2); glowDot(X, 720, 10, CYAN, b); label('影子：x = cos t', G.cx, 770, 28, CYAN, b, { bold: true });
    if (t > S('C07')) { const k = ap(t, 'C07', 0.2); label('简谐振动', 1250, 330, 32, GOLD, k, { bold: true }); springMass(1250, 380, 200, Math.cos(q) * 60, k, {}); }
  }
};

// ======================= 消参陷阱（A439） =======================
const GT1 = { cx: 820, cy: 760, ux: 300, uy: 300, x0: -0.3, x1: 1.5, y0: -0.3, y1: 1.5 };
SC.trap = t => {
  starfield(t); blueprint(0.34, 80);
  richReveal([['x = sin²t，y = cos²t  ⇒  ', CR], ['x + y = 1', GOLD]], 980, 230, 34, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.4); gAxes(GT1, a * 0.55, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } });
  if (t > S('D02') - 0.05) { gPlot(GT1, x => 1 - x, t > S('C09') ? RED : GOLD, { a: ap(t, 'D02', 0) * (t > S('C09') ? 0.45 : 1), xa: -0.3, xb: 1.3, w: 4, dash: t > S('C09') ? [10, 8] : null }); label('整条直线？', 1200, 330, 30, t > S('C09') ? RED : GOLD, ap(t, 'D02', 0.2), { bold: true }); if (t > S('C09')) crossMark(1330, 330, 18, RED, t, P('C09', 0.05)); }
  if (t > S('C09')) {
    const k = ap(t, 'C09', 0.2); gPlot(GT1, x => 1 - x, GRN, { a: k, xa: 0, xb: 1, w: 7 });
    const q = (t - P('C09', 0.3)) * 2.4, X = Math.sin(q) ** 2; if (t > P('C09', 0.3)) glowDot(gx(GT1, X), gy(GT1, 1 - X), 11, GOLD, k);
    label('0 ≤ x ≤ 1：来回走的线段', 1150, 560, 30, GRN, ap(t, 'C09', 0.4), { bold: true }); checkMark(1150, 620, 22, GRN, t, P('C09', 0.6));
  }
};

// ======================= 随堂 =======================
const GQ1 = { cx: 880, cy: 560, ux: 60, uy: 60, x0: -4, x1: 4, y0: -4, y1: 4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.42, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['x = 3cos t，y = 3sin t  →  ', CR], ['？', GOLD]], 880, 230, 36, t, P('C11', 0.05), { upright: true });
  if (t > S('D03')) {
    const a = ap(t, 'D03', 0.1); gAxes(GQ1, a * 0.6, { grid: false, ticks: { x: [[3, '3'], [-3, '−3']], y: [[3, '3'], [-3, '−3']] } });
    paramTrace(GQ1, s => 3 * Math.cos(s), s => 3 * Math.sin(s), 0, TAU, GOLD, { a, p: prog(t, P('D03', 0.15), 1.2), w: 4, arrows: [1, 3, 5] });
    goldBox(1260, 560, 230, 70, 'x² + y² = 9', 34, ap(t, 'D03', 0.5));
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C12', 0) * fadeOut(t, S('C13'), 0.4);
  if (ga > 0) {
    richReveal([['参数曲线 = ', CR], ['形状', GOLD], [' + ', CR], ['时间表', CYAN]], CX, 340, 48, t, P('C12', 0.05), { upright: true, alpha: ga });
    richReveal([['消参：只剩形状，', CR], ['丢了方向和范围', RED]], CX, 440, 38, t, P('C12', 0.5), { upright: true, alpha: ga });
  }
  if (t > S('C13') - 0.1) { glowText('下一段：摆线、星形线、渐开线', CX, 520, 50, CR, t, P('C13', 0.15)); glowText('Llama 推着轮子慢慢走', CX, 610, 32, SQ.L.col, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 10 章 · P1 参数曲线', '下一段：摆线与星形线', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM10('Kimi')]);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.1, 'shimmer', 0.18); s('K01', 0.3, 'tick', 0.12); s('K01', 0.6, 'tick', 0.12); s('C01', 0.1, 'ding', 0.2); s('C01', 0.4, 'pop', 0.14); s('C02', 0.2, 'pluck', 0.18);
  s('C03', 0.05, 'pop', 0.16); [0.35, 0.43, 0.51, 0.59, 0.67, 0.75, 0.83].forEach(f => s('C03', f, 'marimba', 0.1)); s('G01', 0.15, 'whoosh', 0.14); s('C04', 0.1, 'pop', 0.16); s('C04', 0.6, 'ding_hi', 0.22);
  s('K02', 0.3, 'swell', 0.14); s('C05', 0.15, 'pop', 0.14); s('C05', 0.45, 'pop', 0.14); s('C06', 0.5, 'stamp', 0.24); s('D01', 0.1, 'click', 0.16); s('C07', 0.2, 'ding', 0.2);
  s('C08', 0.05, 'pop', 0.16); s('D02', 0.2, 'riser', 0.14); s('C09', 0.05, 'buzz', 0.18); s('C09', 0.4, 'pop', 0.16); s('C09', 0.6, 'check', 0.22);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.15, 'whoosh', 0.14); s('D03', 0.5, 'ding_hi', 0.28);
  s('C12', 0.05, 'pop', 0.2); s('C12', 0.5, 'pop', 0.2); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
