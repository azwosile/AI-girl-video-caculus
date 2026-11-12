// 第 6 章 P14《收束 · 出口票》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A287 全章地图 · A288 出口票三题 · A289 全员合影
const SC = {};
const TITLES = [['map', '全章一张图'], ['q1', '出口票 ①'], ['q2', '出口票 ②'], ['q3', '出口票 ③'], ['next', '下一章预告'], ['group', '合影']];
const XC = SQ.X.col;
SIDE.D.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);   // 合影时大肥鱼站进队伍
SIDE.G.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);

// ======================= map（A287） =======================
const NODES = [
  { id: 'cut', x: 930, y: 300, s: '微元：dA dV dW', c: GOLD, t: () => P('C01', 0.45), big: true },
  { id: 'area', x: 600, y: 470, s: '面积 P2 P3', c: CYAN, t: () => P('C02', 0.05) },
  { id: 'vol', x: 820, y: 470, s: '体积 P4–P8', c: SQ.Q.col, t: () => P('C02', 0.15) },
  { id: 'arc', x: 1040, y: 470, s: '弧长 P9', c: SQ.R.col, t: () => P('C02', 0.4), sm: true },
  { id: 'surf', x: 1260, y: 470, s: '侧面积 P10', c: SQ.B.col, t: () => P('C02', 0.5), sm: true },
  { id: 'work', x: 720, y: 660, s: '功 P11 P12', c: SQ.T.col, t: () => P('C02', 0.7) },
  { id: 'pres', x: 980, y: 660, s: '压力 P13', c: SQ.N.col, t: () => P('C02', 0.82) },
  { id: 'avg', x: 1240, y: 660, s: '平均值（第 5 章）', c: SQ.H.col, t: () => P('G01', 0.1), sm: true },
];
const EDGES = [['cut', 'area'], ['cut', 'vol'], ['cut', 'arc'], ['cut', 'surf'], ['cut', 'work'], ['cut', 'pres'], ['area', 'avg']];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const N = {}; NODES.forEach(n => N[n.id] = n);
  EDGES.forEach(([a, b]) => { const A = N[a], B = N[b], p = eOut(prog(t, B.t(), 0.4)); if (p <= 0) return; seg(A.x, A.y, lerp(A.x, B.x, p), lerp(A.y, B.y, p), B.c, 0.55, 2.5, b === 'avg' ? [8, 6] : null); });
  NODES.forEach(n => { const p = eBack(prog(t, n.t(), 0.45)); if (p <= 0) return; const w = n.big ? 250 : n.sm ? 200 : 240, h = n.big ? 80 : 60; ctx.save(); ctx.translate(n.x, n.y); ctx.scale(p, p); panel(-w / 2, -h / 2, w, h, n.c, 1); ctx.restore(); label(n.s, n.x, n.y, n.big ? 28 : n.sm ? 21 : 22, n.c, clamp(p), { bold: true }); });
  if (t > S('G01')) label('f_ave = ∫ₐᵇ f dx ÷ (b − a)', 1240, 740, 24, SQ.H.col, ap(t, 'G01', 0.3), { font: F_MATH });
};

// ======================= 出口票（A288） =======================
function ticket(t, n, q, t0, a = 1) {
  if (a <= 0) return; const p = eBack(prog(t, t0, 0.45));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(980, 300); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = XC; ctx.lineWidth = 3; ctx.shadowColor = XC; ctx.shadowBlur = 14; rr(-360, -90, 720, 180, 16); ctx.fill(); ctx.stroke();
  ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(-250, -90); ctx.lineTo(-250, 90); ctx.stroke(); ctx.restore();
  label('出口票 ' + n, 980 - 305, 300, 26, XC, clamp(p) * a, { bold: true });
  mathRich(q, 980 + 55, 312, 32, { align: 'center', alpha: clamp(p) * a, glow: 10, upright: true });
}
const qcd = t => ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1290, 560, 86); });
function verified(t, t0, x = 1180, y = 760) { stampMark(x, y, 70, t, t0, { text: '核实通过', col: XC, rot: -0.14 }); }
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('X02')) { kinetic('这是真的吗？', CX, 460, 76, t, P('X01', 0.1), { col: XC }); label('三道题 · 逐题核实', CX, 580, 32, CR, ap(t, 'X01', 0.5), { bold: true }); return; }
  ticket(t, '①', [['y = x²', GOLD], [' 与 ', CR], ['y = 4', CYAN], [' 围成的面积？', CR]], P('X02', 0.1)); qcd(t);
  const G = { cx: 620, cy: 860, ux: 62, uy: 50, x0: -2.6, x1: 2.6, y0: 0, y1: 5 }, a = ap(t, 'X02', 0.4);
  gAxes(G, a, { grid: false }); gPlot(G, x => x * x, GOLD, { a, xa: -2.2, xb: 2.2 }); gPlot(G, () => 4, CYAN, { a, xa: -2.5, xb: 2.5 });
  if (t > S('D01')) { gBetween(G, () => 4, x => x * x, -2, 2, ap(t, 'D01', 0.05), { col: 'rgba(255,200,60,0.35)' }); richReveal([['∫₋₂² (4 − x²) dx = ', CR], ['32/3', GRN]], 1100, 560, 40, t, P('D01', 0.2), { upright: true }); checkMark(1330, 550, 26, GRN, t, P('D01', 0.85)); }
};
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X03', 0.25)) { verified(t, S('X03') - 0.05, 980, 500); return; }
  ticket(t, '②', [['y = √x', GOLD], ['，[0, 4] 绕 x 轴：V = ？', CR]], P('X03', 0.3)); qcd(t);
  if (t > S('C03')) {
    const G = { cx: 560, cy: 640, ux: 110, uy: 90, x0: 0, x1: 4.4, y0: -2.3, y1: 2.3 }, a = ap(t, 'C03', 0.05);
    revSolid(G, { axis: 'x', at: 0, R: x => Math.sqrt(x), t0: 0, t1: 4, col: GOLD, a: a * 0.9, Rmax: 2, rings: 6, th: Math.max(0.0001, 2 * Math.PI * eIO(prog(t, P('C03', 0.05), 1.2))) });
    richReveal([['π∫₀⁴ (√x)² dx = π∫₀⁴ x dx', CYAN]], 1180, 500, 30, t, P('C03', 0.15), { upright: true });
    richReveal([['= ', CR], ['8π', GRN]], 1180, 600, 46, t, P('C03', 0.5), { upright: true });
    checkMark(1310, 590, 24, GRN, t, P('C03', 0.85));
  }
};
SC.q3 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X04', 0.2)) { verified(t, S('X04') - 0.05, 980, 500); return; }
  ticket(t, '③', [['k = 50 N/m，拉长 0.4 m：W = ？', CR]], P('X04', 0.25)); qcd(t);
  if (t > S('G02')) { richReveal([['∫₀^{0.4} 50x dx = ½ · 50 · 0.4²', CYAN]], 900, 480, 30, t, P('G02', 0.1), { upright: true }); richReveal([['= ', CR], ['4 J', GRN]], 900, 570, 44, t, P('G02', 0.4), { upright: true }); checkMark(1250, 560, 24, GRN, t, P('G02', 0.85)); }
  if (t > S('X05')) { verified(t, P('X05', 0.1), 1170, 760); label('三道全对', 980, 860, 34, XC, ap(t, 'X05', 0.3), { bold: true }); }
};

// ======================= next =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 7 章 · 积分技巧', CX, 260, 50, GOLD, ap(t, 'C04', 0.05), { bold: true, glow: 16 });
  [['三角积分', CYAN], ['部分分式', SQ.Q.col], ['数值积分', SQ.X.col]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C04', 0.3 + 0.18 * k), 0.4)); if (p <= 0) return; const x = 760 + k * 220, y = 450;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-95, -50, 190, 100, c, 1); ctx.restore(); label(s, x, y, 26, c, clamp(p), { bold: true });
  });
  if (t > S('D02')) {   // 回扣 P0：两摞硬币
    const a = ap(t, 'D02', 0.1), sh = 0.35 * eIO(prog(t, P('D02', 0.3), 1.0));
    coinStack(820, 760, 12, 150, 14, () => 0, GOLD, a); coinStack(1140, 760, 12, 150, 14, k => 60 * sh * Math.sin(k * 0.5), GOLD, a);
    label('V 相等', 980, 600, 28, CYAN, ap(t, 'D02', 0.55), { bold: true });
  }
};

// ======================= group（A289） =======================
const STARS5 = [[700, 170, 'P0 祖暅'], [840, 240, 'P2 曲线间面积'], [980, 160, 'P5 圆盘'], [1120, 230, 'P7 柱壳'], [1260, 150, 'P9 弧长'], [1400, 250, 'P10 号角'], [1540, 160, 'P11 做功'], [1680, 250, 'P13 压力'], [1820, 170, 'P14 出口票']];
const LINEUP = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_point', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C05', 0.0, 0.6);
  STARS5.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C05', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS5[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C05') - 0.2;
  LINEUP.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C05', 0.6), 110 + 130 * 7, 560, SQ.D.col, 100);
  label('第 6 章 · 完', CX, 420, 54, GOLD, ap(t, 'C05', 0.3), { bold: true, glow: 18 });
  credits(t, E('C05') + 2.6, 'AI娘微积分课 · 第 6 章 · P14 收束与出口票', '下一章：积分技巧', [...CREDIT_BASE,
    '混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C05') - 0.2) lecturer(t, 'C', 255, -5, S('C05') - 0.3, { h: 710 }); };
SC.__noTag = E('C05') + 2.5;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C05') + 2.6); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  NODES.forEach(n => sfx(n.t(), n.big ? 'ding' : 'marimba', 0.16));
  s('X01', 0.1, 'slam', 0.3); s('X01', 0.12, 'zap', 0.16); s('X02', 0.1, 'whoosh', 0.18);
  ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.05, 'whoosh', 0.14); s('D01', 0.2, 'type', 0.14); s('D01', 0.85, 'check', 0.3); sfx(S('X03') - 0.05, 'stamp', 0.3); s('X03', 0.3, 'whoosh', 0.18);
  s('C03', 0.1, 'type', 0.14); s('C03', 0.5, 'ding', 0.2); s('C03', 0.85, 'check', 0.3); sfx(S('X04') - 0.05, 'stamp', 0.3); s('X04', 0.25, 'whoosh', 0.18);
  s('G02', 0.1, 'type', 0.14); s('G02', 0.4, 'ding', 0.2); s('G02', 0.85, 'check', 0.3); s('X05', 0.1, 'stamp', 0.3); s('X05', 0.3, 'sparkle', 0.24);
  s('C04', 0.05, 'swoosh_in', 0.18); [0, 1, 2].forEach(k => s('C04', 0.3 + 0.18 * k, 'pop', 0.18)); s('D02', 0.1, 'shimmer', 0.18); s('D02', 0.3, 'warp', 0.16); s('D02', 0.55, 'ding', 0.18);
  s('C05', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C05') - 0.2 + 0.07 * k, 'pop', 0.16); s('C05', 0.6, 'sparkle', 0.3);
})();
finalize();
