// 第 9 章 P9《捕食者与猎物》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 9.6 例 1。
// A410 兔群与狼群互相牵制 · A411 平衡点 (1000, 80) · A412 相平面闭合轨道 + R(t)、W(t) 周期振荡（狼峰滞后）
const SC = {};
const TITLES = [['two', '两个未知函数'], ['eq', '平衡点'], ['phase', '相平面'], ['quiz', '随堂一题'], ['outro', '小结']];

const fR9 = (R, W) => 0.08 * R - 0.001 * R * W, fW9 = (R, W) => -0.02 * W + 0.00002 * R * W;
const GP9 = { cx: 620, cy: 790, ux: 0.19, uy: 3.2, x0: 0, x1: 3000, y0: 0, y1: 150 };
const ORB9 = rk4sys(fR9, fW9, 1000, 40, 172, 1400);
const TS9 = (() => { const out = [[0, 1000, 40]]; let R = 1000, W = 40; const h = 0.25; for (let i = 1; i <= 1400; i++) { const p = rk4sys(fR9, fW9, R, W, h, 1)[1]; R = p[0]; W = p[1]; out.push([i * h, R, W]); } return out; })();
const GTR9 = { cx: 600, cy: 790, ux: 1.6, uy: 0.15, x0: 0, x1: 350, y0: 0, y1: 3000 }, GTW9 = { cx: 600, cy: 790, ux: 1.6, uy: 3.0, x0: 0, x1: 350, y0: 0, y1: 150 };
function axesP9(a) { gAxes(GP9, a * 0.75, { grid: false, ticks: { x: [[1000, '1000'], [2000, '2000'], [3000, '3000']], y: [[40, '40'], [80, '80'], [120, '120']] } });
  label('R（兔）', gx(GP9, 3000) - 20, GP9.cy + 42, 24, SQ.T.col, a, { bold: true }); label('W（狼）', gx(GP9, 0) + 10, gy(GP9, 150) - 22, 24, RED, a, { bold: true }); }

// ======================= 两个未知函数（A410） =======================
SC.two = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'T01', 0.05), ph = Math.sin(t * 1.2);
  for (let i = 0; i < 12; i++) bunnyIcon(600 + (i % 6) * 50, 330 + Math.floor(i / 6) * 70 + 4 * Math.sin(t * 4 + i), 0.8, SQ.T.col, a * clamp(0.6 + 0.4 * ph + (i < 6 ? 0.4 : 0)));
  for (let i = 0; i < 5; i++) wolfIcon(960 + (i % 3) * 70, 320 + Math.floor(i / 3) * 80, 0.9, RED, ap(t, 'T01', 0.3) * clamp(0.6 - 0.4 * ph + (i < 3 ? 0.4 : 0)));
  if (t > S('C01')) { label('R(t)', 720, 470, 32, SQ.T.col, ap(t, 'C01', 0.2), { bold: true }); label('W(t)', 1030, 470, 32, RED, ap(t, 'C01', 0.4), { bold: true }); arrow(800, 470, 960, 470, CR, ap(t, 'C01', 0.5), 3); arrow(960, 490, 800, 490, CR, ap(t, 'C01', 0.6), 3); }
  if (t > S('C02')) { richReveal([['dR/dt = ', CR], ['kR', SQ.T.col], [' − ', CR], ['aRW', GOLD]], 870, 580, 34, t, P('C02', 0.05), { upright: true });
    richReveal([['dW/dt = ', CR], ['−rW', RED], [' + ', CR], ['bRW', GOLD]], 870, 650, 34, t, P('C02', 0.5), { upright: true }); }
  if (t > S('G01')) label('RW ∝ 相遇次数', 870, 730, 30, GOLD, ap(t, 'G01', 0.2), { bold: true });
};

// ======================= 平衡点（A411） =======================
SC.eq = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['k = 0.08，a = 0.001，r = 0.02，b = 0.00002', CR]], 870, 240, 28, t, P('C03', 0.1), { upright: true });
  if (t > S('C04')) {
    richReveal([['0.08 − 0.001W = 0  ⇒  ', CR], ['W = 80', RED]], 870, 330, 32, t, P('C04', 0.05), { upright: true });
    richReveal([['−0.02 + 0.00002R = 0  ⇒  ', CR], ['R = 1000', SQ.T.col]], 870, 400, 32, t, P('C04', 0.45), { upright: true });
  }
  if (t > S('T02')) { const k = ap(t, 'T02', 0.1); for (let i = 0; i < 10; i++) bunnyIcon(640 + i * 34, 540, 0.6, SQ.T.col, k * ap(t, 'T02', 0.1 + 0.03 * i)); wolfIcon(1060, 530, 0.8, RED, k); label('× 1000', 810, 610, 28, SQ.T.col, k, { bold: true }); label('× 80', 1060, 610, 28, RED, k, { bold: true });
    stampMark(1200, 440, 40, t, P('T02', 0.5), { text: '平衡', col: GOLD, rot: -0.12 }); }
};

// ======================= 相平面（A412） =======================
SC.phase = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C05', 0) * fadeOut(t, S('G02'), 0.4);
  if (ga > 0) {
    axesP9(ga); sysField(GP9, fR9, fW9, ga * 0.5, { sx: 300, sy: 15, ox: 150, oy: 7.5, len: 22 });
    gDot(GP9, 1000, 80, GOLD, ga); label('(1000, 80)', gx(GP9, 1000) + 70, gy(GP9, 80) - 6, 22, GOLD, ga, { bold: true });
    if (t > S('C06')) { gDot(GP9, 1000, 40, SQ.T.col, ap(t, 'C06', 0.2) * ga); gPath(GP9, ORB9, SQ.T.col, { a: ap(t, 'C06', 0.2) * ga, w: 4, p: prog(t, P('C06', 0.25), 2.2), head: true }); label('逆时针', gx(GP9, 2400), gy(GP9, 130), 26, SQ.T.col, ap(t, 'C06', 0.6) * ga, { bold: true }); }
  }
  if (t > S('G02') - 0.1) {
    const a = ap(t, 'G02', 0); gAxes(GTR9, a * 0.75, { grid: false, ticks: { x: [[100, '100'], [200, '200'], [300, '300']] } }); label('t（月）', gx(GTR9, 350) - 10, GTR9.cy + 40, 22, CR, a * 0.8);
    const p = prog(t, P('G02', 0.1), 1.8);
    gPath(GTR9, TS9.map(r => [r[0], r[1]]), SQ.T.col, { a, w: 3.5, p }); gPath(GTW9, TS9.map(r => [r[0], r[2]]), RED, { a, w: 3.5, p });
    label('兔 R(t)', gx(GTR9, 60), gy(GTR9, 2950), 26, SQ.T.col, a, { bold: true }); label('狼 W(t)', gx(GTR9, 140), gy(GTW9, 150) + 6, 26, RED, a, { bold: true });
    if (t > P('G02', 0.5)) label('狼峰滞后', 1000, 280, 30, GOLD, ap(t, 'G02', 0.5), { bold: true });
    if (t > S('C07')) label('雪兔与猞猁：周期约 10 年', 900, 230, 30, CR, ap(t, 'C07', 0.2), { bold: true });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['R = 1000，W = 40：', CR], ['兔子增还是减？', GOLD]], 860, 250, 36, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.3); axesP9(a * 0.8); gDot(GP9, 1000, 40, SQ.T.col, a); gDot(GP9, 1000, 80, GOLD, a * 0.6);
  if (t > S('D01')) { richReveal([['80 − 40 = ', CR], ['40 > 0  增加', GOLD]], 860, 330, 36, t, P('D01', 0.1), { upright: true }); arrow(gx(GP9, 1000), gy(GP9, 40), gx(GP9, 1600), gy(GP9, 40), GOLD, ap(t, 'D01', 0.4), 5); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) richReveal([['联立方程 → ', CR], ['相平面上的闭合圈', GOLD]], CX, 400, 46, t, P('C10', 0.05), { upright: true, alpha: ga });
  if (t > S('C11') - 0.1) { glowText('下一段：齐次方程', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('同济补充 · 混元换元', CX, 610, 32, SQ.H.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 9 章 · P9 兔子与狼', '下一段：齐次方程', [...CREDIT_BASE, ...CREDIT_T, ...CREDIT_END, CREDIT_TM9('MiMo')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('T01', 0.05, 'pop', 0.16); s('T01', 0.3, 'thud', 0.16); s('C01', 0.2, 'pop', 0.16); s('C01', 0.5, 'whoosh', 0.12); s('C02', 0.05, 'pop', 0.16); s('C02', 0.5, 'pop', 0.16); s('G01', 0.2, 'ding', 0.18);
  s('C03', 0.1, 'type', 0.12); s('C04', 0.05, 'pop', 0.16); s('C04', 0.45, 'pop', 0.16); s('T02', 0.1, 'sparkle', 0.16); s('T02', 0.5, 'stamp', 0.26);
  s('C05', 0.1, 'swell', 0.12); s('C06', 0.25, 'riser', 0.14); s('G02', 0.1, 'swoosh_in', 0.14); s('G02', 0.5, 'tick', 0.16); s('C07', 0.2, 'pop', 0.16);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28); s('D01', 0.4, 'whoosh', 0.14);
  s('C10', 0.05, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
