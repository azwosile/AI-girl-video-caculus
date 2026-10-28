// 第 4 章 P0《区间测速：平均与瞬时》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A121 区间测速龙门架 + 计时 · A122 位移曲线：割线平移成切线，速度表同步 · A123 本章地图
const SC = {};
const TITLES = [['hook', '区间测速'], ['curve', '割线与切线'], ['cond', '前提条件'], ['map', '本章地图'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 区间测速（A121） =======================
const RD = { x0: 660, x1: 1300, y: 640 };
function gantry(x, lab, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(237,230,216,0.8)'; ctx.lineWidth = 6; ctx.shadowColor = CYAN; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(x - 60, RD.y + 40); ctx.lineTo(x - 60, RD.y - 190); ctx.lineTo(x + 60, RD.y - 190); ctx.lineTo(x + 60, RD.y + 40); ctx.stroke();
  ctx.fillStyle = 'rgba(20,60,120,0.9)'; ctx.shadowBlur = 0; rr(x - 70, RD.y - 250, 140, 56, 8); ctx.fill(); ctx.strokeStyle = CYAN; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = `bold 24px ${F_FANCY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, x, RD.y - 222);
  // 摄像头
  [x - 30, x + 30].forEach(cx => { ctx.fillStyle = '#2a3350'; rr(cx - 14, RD.y - 186, 28, 22, 4); ctx.fill(); glowDot(cx, RD.y - 175, 4, COL.red, 0.8); });
  ctx.restore();
}
function road(a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(40,44,60,0.9)'; ctx.fillRect(RD.x0 - 60, RD.y - 10, RD.x1 - RD.x0 + 120, 70);
  ctx.strokeStyle = 'rgba(237,230,216,0.7)'; ctx.lineWidth = 3; ctx.setLineDash([26, 22]); ctx.beginPath(); ctx.moveTo(RD.x0 - 60, RD.y + 25); ctx.lineTo(RD.x1 + 60, RD.y + 25); ctx.stroke();
  ctx.restore();
}
function rocketCar(x, y, t, a = 1, fl = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  // 尾焰
  const L = 46 + 18 * Math.sin(t * 40) * fl; const g = ctx.createLinearGradient(-40 - L, 0, -40, 0); g.addColorStop(0, 'rgba(255,90,40,0)'); g.addColorStop(1, 'rgba(255,200,80,0.95)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-40, -12); ctx.lineTo(-40 - L * fl, 0); ctx.lineTo(-40, 12); ctx.fill();
  ctx.fillStyle = '#1b1b22'; ctx.strokeStyle = COL.red; ctx.lineWidth = 3; ctx.shadowColor = COL.red; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.moveTo(-42, 10); ctx.lineTo(-42, -14); ctx.lineTo(-6, -16); ctx.lineTo(14, -32); ctx.lineTo(34, -30); ctx.lineTo(48, -8); ctx.lineTo(56, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(120,200,255,0.8)'; ctx.beginPath(); ctx.moveTo(16, -28); ctx.lineTo(32, -27); ctx.lineTo(42, -10); ctx.lineTo(10, -12); ctx.fill();
  ctx.fillStyle = GOLD; ctx.font = `bold 15px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('X', -14, -2);
  [-24, 36].forEach(wx => { ctx.fillStyle = '#0a0a0e'; ctx.beginPath(); ctx.arc(wx, 12, 11, 0, 7); ctx.fill(); ctx.strokeStyle = '#888'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(wx, 12, 5, 0, 7); ctx.stroke(); });
  ctx.restore();
}
function timerPanel(x, y, sec, a) {
  if (a <= 0) return; panel(x, y, 250, 100, GOLD, a);
  const mm = Math.floor(sec / 60), ss = Math.floor(sec % 60);
  label('用时', x + 50, y + 50, 26, CR, a, { bold: true });
  label(`${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, x + 160, y + 52, 46, GOLD, a, { font: F_MATH, bold: true });
}
SC.hook = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'X01', 0, 0.5);
  road(a); gantry(RD.x0, '区间起点', a); gantry(RD.x1, '区间终点', a);
  // 距离标注
  if (t > P('X01', 0.3)) { const da = ap(t, 'X01', 0.3); arrowH(CX, RD.x0 + 4, RD.y + 100, CYAN, da); arrowH(CX, RD.x1 - 4, RD.y + 100, CYAN, da); label('20 km', CX, RD.y + 100, 30, CYAN, da, { font: F_MATH, bold: true, glow: 12 }); }
  // 车：X01 后半程驶过区间
  const run = eIO(prog(t, P('X01', 0.35), D('X01') * 0.6)), cx = lerp(RD.x0 - 40, RD.x1 + 30, run);
  rocketCar(cx, RD.y + 10, t, a, run > 0 && run < 1 ? 1 : 0.3);
  timerPanel(700, 200, 600 * run, ap(t, 'X01', 0.35));
  // D01：平均速度 vs 限速
  if (t > S('D01')) {
    const b = ap(t, 'D01', 0);
    panel(990, 180, 340, 140, CYAN, b);
    richReveal([['20 km ÷ 10 min', CR]], 1160, 230, 30, t, P('D01', 0.05), { upright: true });
    richReveal([['= 120 km/h', GOLD]], 1160, 285, 36, t, P('D01', 0.35), { upright: true });
    const la = ap(t, 'D01', 0.7); limitSign(1150, 430, 46 * eBack(clamp(la)), 100, la);
    if (t > P('D01', 0.75)) flash(t, P('D01', 0.75), 0.18, 0.3, '232,85,58');
  }
  // X02：她声称的速度表（指针在 100 以下晃）
  if (t > S('X02') - 0.1) {
    const ga = ap(t, 'X02', 0) * fadeOut(t, E('X03') + 0.3, 0.3);
    const v = 88 + 8 * Math.sin(t * 3.1) + 3 * Math.sin(t * 7.3);
    gauge(800, 420, 105, v, ga, { lim: 100 }); label('Grok 自称的读数', 800, 552, 24, SQ.X.col, ga, { bold: true });
  }
  if (t > S('D02')) kinetic('这是真的吗？', CX + 40, 880, 52, t, P('D02', 0.0), { col: GOLD });
  if (t > S('X03')) stampMark(990, 470, 70, t, P('X03', 0.3), { text: '待核实', col: COL.red });
};

// ======================= 割线 → 切线（A122） =======================
const GC = { cx: 640, cy: 850, ux: 46, uy: 27, x0: 0, x1: 10.4, y0: 0, y1: 22.5 };
const A1 = 1.2, sF = x => 2 * x + A1 * Math.sin(2 * Math.PI * x / 10), vF = x => 60 * (2 + A1 * 2 * Math.PI / 10 * Math.cos(2 * Math.PI * x / 10));
const TC = 2.5;   // 切点：s − 2t 在 t = 2.5 取最大
SC.curve = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0, 0.5);
  gAxes(GC, a, { grid: true, gx: 1, gy: 2, ticks: { x: [[5, '5'], [10, '10']], y: [[10, '10'], [20, '20']] }, xl: 't / min', yl: 's / km' });
  // C01：边画曲线边走车点，速度表跟随
  const dp = eIO(prog(t, P('C01', 0.25), D('C01') * 0.7));
  gPlot(GC, sF, RED, { p: dp, a });
  // 车点位置：C01 走完全程；C04 起回到切点
  let tc = 10 * dp; const back = eIO(prog(t, P('C03', 0.85), 0.9)); tc = lerp(tc, TC, back);
  const ga = ap(t, 'C01', 0.2);
  gauge(1250, 560, 105, dp > 0 ? vF(tc) : 0, ga, { lim: 100 });
  label('瞬时速度', 1250, 430, 24, CR, ga, { bold: true });
  if (dp > 0) gDot(GC, tc, sF(tc), GOLD, a);
  // C02：割线
  const sa = ap(t, 'C02', 0.05);
  if (sa > 0) {
    gDot(GC, 0, 0, SEC, sa); gDot(GC, 10, 20, SEC, sa);
    const k = A1 * eIO(prog(t, P('C03', 0.15), D('C03') * 0.75));
    if (k > 0.01) gLine(GC, 2, 0, 0, -0.3, 10.4, SEC, sa * 0.4, 2.5, [10, 8]);   // 原割线留虚影
    gLine(GC, 2, 0, k, -0.3, 10.4, SEC, sa, 4);
    richReveal([['割线斜率 = 20 ÷ ', CR], ['1/6', CR], [' = 120', GOLD]], 660, 200, 32, t, P('C02', 0.35), { align: 'left', upright: true });
    if (k > 0.01) { const mx = 5.6, my = 2 * mx + k; arrowV(gx(GC, mx), gy(GC, 2 * mx) - 6, gy(GC, my) + 8, SEC, sa * (1 - prog(t, E('C03'), 0.4))); }
  }
  // C04：切点高亮，速度表指 120
  if (t > S('C04') - 0.1) {
    const ca = ap(t, 'C04', 0);
    burst(t, S('C04') + 0.05, gx(GC, TC), gy(GC, sF(TC)), GOLD, 90, 12);
    gV(GC, TC, GOLD, ca * 0.6, { ya: 0, yb: sF(TC), dash: [6, 6] });
    label('这一刻', gx(GC, TC), gy(GC, 0) + 34, 22, GOLD, ca, { bold: true });
    richReveal([['切线斜率 = 120', GOLD]], 660, 258, 32, t, P('C04', 0.4), { align: 'left', upright: true });
  }
  if (t > S('D03')) stampMark(1050, 760, 66, t, P('D03', 0.15), { text: '超速', col: COL.red });
  if (t > S('X05')) checkMark(1200, 760, 50, GRN, t, P('X05', 0.6));
};

// ======================= 前提条件 =======================
const GJ = { cx: 650, cy: 520, ux: 36, uy: 22, x0: 0, x1: 8, y0: 0, y1: 10 }, GK = { cx: 1010, cy: 520, ux: 36, uy: 22, x0: 0, x1: 8, y0: 0, y1: 10 };
SC.cond = t => {
  starfield(t); blueprint(0.4, 80);
  const a1 = ap(t, 'G01', 0.15), a2 = ap(t, 'G01', 0.55);
  [[GJ, a1, '瞬移'], [GK, a2, '速度突变']].forEach(([G, a, lab], i) => {
    if (a <= 0) return; panel(G.cx - 30, G.cy - 270, 330, 320, i ? GRN : RED, a);
    gAxes(G, a, { grid: false });
    if (!i) { gPlot(G, x => 0.6 * x, RED, { a, xa: 0, xb: 4 }); gPlot(G, x => 0.6 * x + 3.5, RED, { a, xa: 4, xb: 8 }); gDot(G, 4, 2.4, RED, a); gDot(G, 4, 5.9, RED, a, true); }
    else { gPlot(G, x => 0.3 * x, GRN, { a, xa: 0, xb: 4 }); gPlot(G, x => 1.2 + 1.3 * (x - 4), GRN, { a, xa: 4, xb: 7.5 }); gDot(G, 4, 1.2, GOLD, a); }
    label(lab, G.cx + 135, G.cy - 238, 26, i ? GRN : RED, a, { bold: true });
    crossMark(G.cx + 255, G.cy - 238, 30, COL.red, t, i ? P('G01', 0.75) : P('G01', 0.35));
  });
  if (t > S('G02') - 0.1) {
    const b = ap(t, 'G02', 0);
    slab('连续', 805, 660, 30, t, P('G02', 0.15), { bg: RED, rot: -0.04 }); slab('可导', 1160, 660, 30, t, P('G02', 0.25), { bg: GRN, c: COL.ink, rot: 0.04 });
    termCard('Mean Value Theorem', '拉格朗日中值定理', 980, 790, t, P('G02', 0.45));
    richReveal([["f'(c) = ", GRN], ['[f(b) − f(a)] / (b − a)', SEC]], 980, 900, 36, t, P('G02', 0.62));
  }
};

// ======================= 本章地图（A123） =======================
const MAP = [['极值', GOLD, 'C06', 0.05], ['中值', SEC, 'C05', 0.4], ['形状', GRN, 'C06', 0.4], ['未定式', RED, 'C06', 0.7],
  ['作图', CYAN, 'C07', 0.1], ['优化', GOLD, 'C07', 0.3], ['牛顿法', GRN, 'C07', 0.55], ['原函数', SEC, 'C07', 0.82]];
SC.map = t => {
  starfield(t); blueprint(0.42, 80);
  const a = ap(t, 'C05', 0); const cx = CX, cy = 510;
  // 中心节点
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(12,18,38,0.9)'; ctx.strokeStyle = GRN; ctx.lineWidth = 4; ctx.shadowColor = GRN; ctx.shadowBlur = 22 + 8 * Math.sin(t * 3);
  ctx.beginPath(); ctx.arc(cx, cy, 80, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  mathText("f'(x)", cx, cy + 16, 46, GRN, { align: 'center', alpha: a, glow: 14 });
  MAP.forEach(([s, c, id, f], k) => {
    const an = -Math.PI / 2 + k * Math.PI / 4, x = cx + Math.cos(an) * 300, y = cy + Math.sin(an) * 250, p = eOut(prog(t, P(id, f), 0.35));
    seg(cx + Math.cos(an) * 84, cy + Math.sin(an) * 84, lerp(cx + Math.cos(an) * 84, x - Math.cos(an) * 70, p), lerp(cy + Math.sin(an) * 84, y - Math.sin(an) * 40, p), c, 0.6 * a, 2.5);
    ctx.save(); ctx.globalAlpha *= a * (0.25 + 0.75 * p); slab(s, x, y, 30, t, S('C05') + 0.08 * k, { bg: p > 0.5 ? c : '#2a3350', c: p > 0.5 ? COL.ink : CR, rot: 0 }); ctx.restore();
    if (p > 0 && p < 1) burst(t, P(id, f), x, y, c, 70, 8);
  });
  if (t > S('D04')) glowText('导数能告诉我们什么？', cx, 880, 40, GOLD, t, P('D04', 0.1));
};

// ======================= 随堂 =======================
const GQ = { cx: 660, cy: 820, ux: 210, uy: 2.6, x0: 0, x1: 2.1, y0: 0, y1: 200 };
const qF = x => 90 * x + 25 * Math.sin(Math.PI * x), QT = 0.5;   // 切点：cos(πx) = 0 → x = 0.5
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 300);
  const a = ap(t, 'C09', 0);
  gAxes(GQ, a, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[90, '90'], [180, '180']] }, xl: 't / h', yl: 's / km' });
  gPlot(GQ, qF, RED, { a, p: eIO(prog(t, P('C09', 0.1), 1.2)) });
  const sa = ap(t, 'C09', 0.55); gLine(GQ, 90, 0, 0, 0, 2.05, SEC, sa, 3.5); gDot(GQ, 0, 0, SEC, sa); gDot(GQ, 2, 180, SEC, sa);
  richReveal([['180 km ÷ 2 h = 90 km/h', SEC]], 690, 240, 32, t, P('C09', 0.6), { align: 'left', upright: true });
  if (t > S('D05')) {
    const d = ap(t, 'D05', 0.2), k = 25 * Math.sin(Math.PI * QT);
    gLine(GQ, 90, 0, k, 0, 1.4, GOLD, d, 4); gDot(GQ, QT, qF(QT), GOLD, d);
    richReveal([['某一刻 v = 90', GOLD]], 690, 300, 32, t, P('D05', 0.3), { align: 'left', upright: true });
    checkMark(1050, 300, 44, GRN, t, P('D05', 0.5));
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) {
    ctx.save(); ctx.globalAlpha *= ga;
    const G = { cx: 700, cy: 720, ux: 50, uy: 22, x0: 0, x1: 10.4, y0: 0, y1: 22.5 };
    gAxes(G, 1, { grid: false }); gPlot(G, sF, RED, {}); gLine(G, 2, 0, 0, 0, 10, SEC, 0.6, 3, [10, 8]); gLine(G, 2, 0, A1, 0.5, 5, GOLD, 1, 4); gDot(G, TC, sF(TC), GOLD, 1);
    ctx.restore();
    glowText('平均速度 = 某一刻的瞬时速度', CX, 210, 44, GOLD, t, P('C10', 0.3), { out: S('C11') });
  }
  if (t > S('C11') - 0.1) { glowText('下一段：高中速通 · 单调、极值、最值', CX, 500, 50, CR, t, P('C11', 0.15)); glowText('Kimi 客串', CX, 590, 32, SQ.K.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 4 章 · P0 区间测速', '下一段：高中速通', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM4('Grok')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('X01', 0.05, 'swoosh_in', 0.2); s('X01', 0.35, 'whoosh', 0.32); s('X01', 0.6, 'hum', 0.18); s('X01', 0.95, 'ding', 0.22);
  s('D01', 0.05, 'type', 0.16); s('D01', 0.35, 'pop', 0.24); s('D01', 0.75, 'buzz', 0.22);
  s('X02', 0.05, 'slap', 0.22); s('D02', 0.05, 'glitch', 0.18); s('X03', 0.3, 'stamp', 0.32);
  s('C01', 0.0, 'swoosh_in', 0.2); s('C01', 0.25, 'riser', 0.12); s('C02', 0.05, 'pop', 0.22); s('C02', 0.35, 'type', 0.16);
  s('C03', 0.15, 'swell', 0.2); s('C04', 0.0, 'ding_hi', 0.3); s('C04', 0.4, 'shimmer', 0.18);
  s('D03', 0.15, 'stamp', 0.34); s('X05', 0.6, 'check', 0.3);
  s('G01', 0.35, 'buzz', 0.2); s('G01', 0.75, 'buzz', 0.2); s('G02', 0.15, 'pop', 0.22); s('G02', 0.25, 'pop', 0.22); s('G02', 0.45, 'slam', 0.28); s('G02', 0.62, 'type', 0.16);
  MAP.forEach(([, , id, f]) => s(id, f, 'marimba', 0.2)); s('D04', 0.1, 'shimmer', 0.18);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D05', 0.2, 'ding_hi', 0.3); s('D05', 0.5, 'check', 0.26);
  s('C10', 0.3, 'shimmer', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
