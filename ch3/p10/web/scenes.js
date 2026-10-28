// 第 3 章 P10《收束 · 出口票》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A119 全章概念链（齿轮 → 链式法则 → 各应用）+ 出口票逐题“核实” · A120 片尾星图 + 全员合影（接第 2 章 A80）
const SC = {};
const TITLES = [['map', '全章一条链'], ['q1', '出口票 ①'], ['q2', '出口票 ②'], ['q3', '出口票 ③'], ['next', '下一章预告'], ['group', '合影']];
const XC = SQ.X.col;
SIDE.D.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);   // 合影时大肥鱼站进队伍
SIDE.G.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);

// ======================= map（A119 上） =======================
const NODES = [
  { id: 'gear', x: 760, y: 300, s: '齿轮链 P0', c: CR, t: () => P('C01', 0.3) },
  { id: 'chain', x: 980, y: 470, s: '链式法则 P4', c: GOLD, t: () => P('C02', 0.05), big: true },
  { id: 'e', x: 720, y: 600, s: 'e 与三角 P2 P3', c: OUTER, t: () => P('C02', 0.2) },
  { id: 'imp', x: 1240, y: 330, s: '隐函数 P5', c: INNER, t: () => P('C02', 0.45) },
  { id: 'log', x: 1270, y: 520, s: '对数求导 P6', c: INNER, t: () => P('C02', 0.6) },
  { id: 'exp', x: 820, y: 760, s: '增长衰减 P7', c: GRN, t: () => P('C02', 0.7) },
  { id: 'rate', x: 1180, y: 720, s: '相关变化率 P8', c: INNER, t: () => P('C02', 0.75) },
  { id: 'lin', x: 980, y: 860, s: '线性化 P9', c: LC0(), t: () => P('G01', 0.15) },
];
function LC0() { return SQ.L.col; }
const EDGES = [['gear', 'chain'], ['chain', 'e'], ['chain', 'imp'], ['chain', 'log'], ['chain', 'exp'], ['chain', 'rate'], ['chain', 'lin']];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const N = {}; NODES.forEach(n => N[n.id] = n);
  const ch = gearChain(700, 300, [{ n: 18, col: CYAN }, { n: 12, col: GOLD }, { n: 9, col: RED }], 3.5, [0, 0]);
  drawChain(ch, t * 1.0, 3.5, ap(t, 'C01', 0.05) * 0.9);
  if (t > P('C01', 0.6)) ratioTag('转速比一路相乘', 860, 220, GOLD, ap(t, 'C01', 0.6), { size: 24 });
  EDGES.forEach(([a, b]) => { const A = N[a], B = N[b], p = eOut(prog(t, B.t(), 0.4)); if (p <= 0) return; seg(A.x, A.y, lerp(A.x, B.x, p), lerp(A.y, B.y, p), B.c, 0.6, 2.5, b === 'lin' ? [8, 6] : null); });
  NODES.forEach(n => { if (n.id === 'gear') return; const p = eBack(prog(t, n.t(), 0.45)); if (p <= 0) return; const w = n.big ? 250 : 210, h = n.big ? 80 : 62; ctx.save(); ctx.translate(n.x, n.y); ctx.scale(p, p); panel(-w / 2, -h / 2, w, h, n.c, 1); ctx.restore(); label(n.s, n.x, n.y, n.big ? 32 : 24, n.c, clamp(p), { bold: true }); });
  if (t > P('G01', 0.4)) label('导数的“近看”', 1200, 860, 24, SQ.L.col, ap(t, 'G01', 0.4), { bold: true });
};

// ======================= 出口票（A119 下） =======================
function ticket(t, n, q, t0, a = 1) {
  if (a <= 0) return; const p = eBack(prog(t, t0, 0.45));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(980, 300); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = XC; ctx.lineWidth = 3; ctx.shadowColor = XC; ctx.shadowBlur = 14; rr(-360, -90, 720, 180, 16); ctx.fill(); ctx.stroke();
  ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(-250, -90); ctx.lineTo(-250, 90); ctx.stroke(); ctx.restore();
  label('出口票 ' + n, 980 - 305, 300, 26, XC, clamp(p) * a, { bold: true });
  mathRich(q, 980 + 55, 312, 38, { align: 'center', alpha: clamp(p) * a, glow: 10, upright: true });
}
const qcd = t => ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1290, 560, 86); });
function verified(t, t0, x = 1180, y = 760) { stampMark(x, y, 70, t, t0, { text: '核实通过', col: XC, rot: -0.14 }); }
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('X02')) { kinetic('这是真的吗？', CX, 460, 76, t, P('X01', 0.1), { col: XC }); label('三道题 · 逐题核实', CX, 580, 32, CR, ap(t, 'X01', 0.5), { bold: true }); return; }
  ticket(t, '①', [['(e^{sin x})′ = ?', GOLD]], P('X02', 0.1)); qcd(t);
  const G = { cx: 700, cy: 700, ux: 50, uy: 70, x0: -0.2, x1: 7.4, y0: -0.2, y1: 2.9 }, a = ap(t, 'X02', 0.4);
  gAxes(G, a, { grid: false }); gPlot(G, x => Math.exp(Math.sin(x)), GOLD, { a, w: 4 });
  if (t > S('D01')) { gPlot(G, x => Math.cos(x) * Math.exp(Math.sin(x)), GRN, { a: ap(t, 'D01', 0.5), w: 3, dash: [10, 8], p: prog(t, P('D01', 0.5), 0.6), noHead: true }); richReveal([['= ', CR], ['cos x', INNER], [' · ', PROD], ['e^{sin x}', OUTER]], 1120, 520, 40, t, P('D01', 0.45)); checkMark(1300, 610, 26, GRN, t, P('D01', 0.85)); }
};
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X03', 0.25)) { verified(t, S('X03') - 0.05, 980, 500); return; }
  ticket(t, '②', [['x^2 + xy + y^2 = 7', CR], ['，(1, 2) 处 y′ = ?', CR]], P('X03', 0.3)); qcd(t);
  if (t > S('C03')) {
    richReveal([['2x + ', CR], ['(y + x · y′)', GOLD], [' + 2y · y′ = 0', CR]], 960, 520, 36, t, P('C03', 0.1));
    label('xy 用积法则', 1000, 580, 24, GOLD, ap(t, 'C03', 0.3), { bold: true });
    richReveal([['2 + 2 + y′ + 4y′ = 0  ⟹  ', CR], ['y′ = −4/5', GRN]], 960, 680, 36, t, P('C03', 0.55), { upright: true });
    checkMark(1300, 670, 26, GRN, t, P('C03', 0.85));
  }
};
SC.q3 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X04', 0.2)) { verified(t, S('X04') - 0.05, 980, 500); return; }
  ticket(t, '③', [['用线性化估算 ', CR], ['∛8.1', GOLD]], P('X04', 0.25)); qcd(t);
  const G = { cx: 660, cy: 860, ux: 52, uy: 130, x0: -0.2, x1: 11.5, y0: 0, y1: 2.5 }, a = ap(t, 'X04', 0.4);
  gAxes(G, a, { grid: false, ticks: { x: [[8, '8']], y: [[2, '2']] } }); gPlot(G, Math.cbrt, GOLD, { a, xa: 0 }); gDot(G, 8, 2, GOLD, a);
  if (t > S('G02')) { gLine(G, 1 / 12, 8, 2, 3, 11.5, INV, ap(t, 'G02', 0.2), 3.5); richReveal([['斜率 1/12', INV]], 1150, 470, 32, t, P('G02', 0.2), { upright: true }); richReveal([['2 + 0.1/12 ≈ 2.0083', GRN]], 1120, 550, 36, t, P('G02', 0.55), { upright: true }); checkMark(1150, 630, 26, GRN, t, P('G02', 0.85)); }
  if (t > S('X05')) { verified(t, P('X05', 0.1), 1170, 780); label('三道全对', 980, 860, 34, XC, ap(t, 'X05', 0.3), { bold: true }); }
};

// ======================= next =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 4 章 · 导数的应用', CX, 260, 46, GOLD, ap(t, 'C04', 0.05), { bold: true, glow: 16 });
  [['极值', RED], ['中值定理', CYAN], ['画图', GRN], ['洛必达法则', INV], ['同济补充', GOLD]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C04', 0.2 + 0.12 * k), 0.4)); if (p <= 0) return; const x = 700 + (k % 3) * 260 + (k >= 3 ? 130 : 0), y = k < 3 ? 430 : 590;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-115, -55, 230, 110, c, 1); ctx.restore(); label(s, x, y, 30, c, clamp(p), { bold: true });
  });
  if (t > S('D02')) { const G = { cx: 980, cy: 860, ux: 90, uy: 60, x0: -2.6, x1: 2.6, y0: -1.6, y1: 1.6 }; gPlot(G, x => x * x * x / 3 - x, GOLD, { a: ap(t, 'D02', 0.1), p: prog(t, P('D02', 0.1), 0.8) }); gDot(G, -1, 2 / 3, RED, ap(t, 'D02', 0.6)); gDot(G, 1, -2 / 3, RED, ap(t, 'D02', 0.7)); }
};

// ======================= group：A120 =======================
const STARS3 = [[700, 170, 'P0 齿轮链'], [840, 240, 'P1 速通'], [980, 160, 'P2 e'], [1120, 230, 'P3 三角'], [1260, 150, 'P4 链式'], [1400, 250, 'P5 隐函数'], [1540, 160, 'P6 对数'], [1660, 250, 'P7 增长'], [1770, 160, 'P8 变化率'], [1860, 250, 'P9 线性化']];
const LINEUP = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_point', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C05', 0.0, 0.6);
  STARS3.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C05', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS3[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C05') - 0.2;
  LINEUP.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C05', 0.6), 110 + 130 * 7, 560, SQ.D.col, 100);
  label('第 3 章 · 完', CX, 420, 54, GOLD, ap(t, 'C05', 0.3), { bold: true, glow: 18 });
  credits(t, E('C05') + 2.6, 'AI娘微积分课 · 第 3 章 · P10 收束与出口票', '下一章：导数的应用', [...CREDIT_BASE,
    '混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C05') - 0.2) lecturer(t, 'C', 255, -5, S('C05') - 0.3, { h: 710 }); };
SC.__noTag = E('C05') + 2.5;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C05') + 2.6); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.05, 'hum', 0.16); s('C01', 0.6, 'pop', 0.2); NODES.forEach(n => { if (n.id !== 'gear') sfx(n.t(), 'marimba', 0.16); });
  s('X01', 0.1, 'slam', 0.3); s('X01', 0.12, 'zap', 0.16); s('X02', 0.1, 'whoosh', 0.18);
  ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.45, 'type', 0.14); s('D01', 0.85, 'check', 0.3); sfx(S('X03') - 0.05, 'stamp', 0.3); s('X03', 0.3, 'whoosh', 0.18);
  s('C03', 0.1, 'type', 0.14); s('C03', 0.55, 'type', 0.14); s('C03', 0.85, 'check', 0.3); sfx(S('X04') - 0.05, 'stamp', 0.3); s('X04', 0.25, 'whoosh', 0.18);
  s('G02', 0.2, 'pluck', 0.2); s('G02', 0.55, 'ding', 0.22); s('G02', 0.85, 'check', 0.3); s('X05', 0.1, 'stamp', 0.3); s('X05', 0.3, 'sparkle', 0.24);
  s('C04', 0.05, 'swoosh_in', 0.18); [0, 1, 2, 3, 4].forEach(k => s('C04', 0.2 + 0.12 * k, 'pop', 0.18)); s('D02', 0.1, 'shimmer', 0.18);
  s('C05', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C05') - 0.2 + 0.07 * k, 'pop', 0.16); s('C05', 0.6, 'sparkle', 0.3);
})();
finalize();
