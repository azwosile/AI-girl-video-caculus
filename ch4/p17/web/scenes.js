// 第 4 章 P17《收束 · 出口票》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A182 全章概念图（中值定理居中）· A183 出口票三题揭晓 · A184 “核实通过”印章 · A185 片尾星图与合影（接第 3 章 A120）
const SC = {};
const TITLES = [['map', '全章一张图'], ['q1', '出口票 ①'], ['q2', '出口票 ②'], ['q3', '出口票 ③'], ['next', '下一章预告'], ['group', '合影']];
const XC = SQ.X.col;
SIDE.D.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);   // 合影时大肥鱼站进队伍
SIDE.G.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);

// ======================= map（A182） =======================
const NODES = [
  { id: 'mvt', x: 990, y: 520, s: '中值定理 P3', c: GOLD, t: () => P('C01', 0.55), big: true },
  { id: 'ext', x: 990, y: 330, s: '极值与最值 P1 P2', c: RED, t: () => P('C01', 0.2) },
  { id: 'mono', x: 730, y: 400, s: '单调凹凸 P5', c: SQ.T.col, t: () => P('C02', 0.05) },
  { id: 'ineq', x: 730, y: 560, s: '恒等式不等式 P4', c: SQ.H.col, t: () => P('C02', 0.15) },
  { id: 'cau', x: 1250, y: 330, s: '柯西→洛必达 P7', c: SQ.M.col, t: () => P('C02', 0.4) },
  { id: 'ind', x: 1250, y: 450, s: '未定式 P8 P9', c: SQ.Q.col, t: () => P('C02', 0.55) },
  { id: 'eq', x: 1250, y: 570, s: '等价无穷小 P11', c: SQ.K.col, t: () => P('C02', 0.7) },
  { id: 'tay', x: 1250, y: 690, s: '泰勒 P12', c: SQ.Z.col, t: () => P('C02', 0.85) },
  { id: 'draw', x: 720, y: 820, s: '作图 P13', c: SQ.M.col, t: () => P('G01', 0.2), sm: true },
  { id: 'opt', x: 900, y: 860, s: '优化 P14', c: SQ.Q.col, t: () => P('G01', 0.3), sm: true },
  { id: 'nwt', x: 1080, y: 860, s: '牛顿法 P15', c: SQ.B.col, t: () => P('G01', 0.4), sm: true },
  { id: 'anti', x: 1260, y: 820, s: '原函数 P16', c: SQ.H.col, t: () => P('G01', 0.65), sm: true },
];
const EDGES = [['ext', 'mvt'], ['mvt', 'mono'], ['mvt', 'ineq'], ['mvt', 'cau'], ['cau', 'ind'], ['ind', 'eq'], ['eq', 'tay'], ['mvt', 'draw'], ['mvt', 'opt'], ['mvt', 'nwt'], ['mvt', 'anti']];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const N = {}; NODES.forEach(n => N[n.id] = n);
  EDGES.forEach(([a, b]) => { const A = N[a], B = N[b], p = eOut(prog(t, B.t(), 0.4)); if (p <= 0) return; seg(A.x, A.y, lerp(A.x, B.x, p), lerp(A.y, B.y, p), B.c, 0.55, 2.5, b === 'anti' ? [8, 6] : null); });
  NODES.forEach(n => { const p = eBack(prog(t, n.t(), 0.45)); if (p <= 0) return; const w = n.big ? 260 : n.sm ? 160 : 220, h = n.big ? 84 : 58; ctx.save(); ctx.translate(n.x, n.y); ctx.scale(p, p); panel(-w / 2, -h / 2, w, h, n.c, 1); ctx.restore(); label(n.s, n.x, n.y, n.big ? 32 : n.sm ? 21 : 22, n.c, clamp(p), { bold: true }); });
  if (t > P('G01', 0.65)) label('反过来', 1300, 760, 18, SQ.H.col, ap(t, 'G01', 0.65));
};

// ======================= 出口票（A183 / A184） =======================
function ticket(t, n, q, t0, a = 1) {
  if (a <= 0) return; const p = eBack(prog(t, t0, 0.45));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(980, 300); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = XC; ctx.lineWidth = 3; ctx.shadowColor = XC; ctx.shadowBlur = 14; rr(-360, -90, 720, 180, 16); ctx.fill(); ctx.stroke();
  ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(-250, -90); ctx.lineTo(-250, 90); ctx.stroke(); ctx.restore();
  label('出口票 ' + n, 980 - 305, 300, 26, XC, clamp(p) * a, { bold: true });
  mathRich(q, 980 + 55, 312, 34, { align: 'center', alpha: clamp(p) * a, glow: 10, upright: true });
}
const qcd = t => ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1290, 560, 86); });
function verified(t, t0, x = 1180, y = 760) { stampMark(x, y, 70, t, t0, { text: '核实通过', col: XC, rot: -0.14 }); }
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('X02')) { kinetic('这是真的吗？', CX, 460, 76, t, P('X01', 0.1), { col: XC }); label('三道题 · 逐题核实', CX, 580, 32, CR, ap(t, 'X01', 0.5), { bold: true }); return; }
  ticket(t, '①', [['lim (e^x − 1 − x)/x^2', GOLD], ['  (x → 0)', CR]], P('X02', 0.1)); qcd(t);
  if (t > S('D01')) {
    richReveal([['e^x = 1 + x + ', CR], ['x^2/2', GOLD], [' + …', CR]], 960, 520, 36, t, P('D01', 0.1), { upright: true });
    richReveal([['答案  ', CR], ['1/2', GRN]], 960, 640, 46, t, P('D01', 0.55), { upright: true });
    checkMark(1150, 630, 26, GRN, t, P('D01', 0.85));
  }
};
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X03', 0.25)) { verified(t, S('X03') - 0.05, 980, 500); return; }
  ticket(t, '②', [['f(x) = x e^{−x}', CR], ['，[0, 2] 上最大值？', CR]], P('X03', 0.3)); qcd(t);
  const G = { cx: 680, cy: 840, ux: 150, uy: 500, x0: 0, x1: 2.2, y0: 0, y1: 0.45 }, a = ap(t, 'X03', 0.45);
  gAxes(G, a, { grid: false, ticks: { x: [[1, '1'], [2, '2']] } }); gPlot(G, x => x * Math.exp(-x), GOLD, { a, xb: 2 });
  if (t > S('C03')) {
    richReveal([["f′ = (1 − x)e^{−x}", CR], ['   驻点 1', GOLD]], 1100, 470, 28, t, P('C03', 0.1), { upright: true });
    [[0, 0, 0.35], [1, 1 / Math.E, 0.5], [2, 2 / Math.E / Math.E, 0.65]].forEach(([x, y, f]) => { const p = ap(t, 'C03', f); if (p > 0) gDot(G, x, y, x === 1 ? GRN : CR, p); });
    richReveal([['最大值  ', CR], ['1/e', GRN]], 1100, 580, 40, t, P('C03', 0.75), { upright: true });
    checkMark(1290, 570, 24, GRN, t, P('C03', 0.85));
  }
};
SC.q3 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X04', 0.2)) { verified(t, S('X04') - 0.05, 980, 500); return; }
  ticket(t, '③', [['牛顿法求 ', CR], ['√5', GOLD], ['：x₀ = 2，x₁ = ？', CR]], P('X04', 0.25)); qcd(t);
  const G = { cx: 660 - 1.5 * 280, cy: 760, ux: 280, uy: 50, x0: 1.5, x1: 2.7, y0: -3, y1: 2.5 }, a = ap(t, 'X04', 0.4);
  gAxes(G, a, { grid: false, ticks: { x: [[2, '2']] } }); gPlot(G, x => x * x - 5, SQ.B.col, { a });
  gDot(G, 2, -1, GOLD, a);
  if (t > S('G02')) { gLine(G, 4, 2, -1, 1.9, 2.4, CYAN, ap(t, 'G02', 0.2), 3); gDot(G, 2.25, 0, GRN, ap(t, 'G02', 0.5)); richReveal([['2 − (4 − 5)/4 = ', CR], ['2.25', GRN]], 1120, 520, 36, t, P('G02', 0.3), { upright: true }); checkMark(1300, 510, 24, GRN, t, P('G02', 0.85)); }
  if (t > S('X05')) { verified(t, P('X05', 0.1), 1170, 760); label('三道全对', 980, 870, 34, XC, ap(t, 'X05', 0.3), { bold: true }); }
};

// ======================= next =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 5 章 · 积分', CX, 260, 50, GOLD, ap(t, 'C04', 0.05), { bold: true, glow: 16 });
  [['原函数', SQ.H.col], ['面积', CYAN], ['微积分基本定理', GOLD]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C04', 0.25 + 0.18 * k), 0.4)); if (p <= 0) return; const x = 740 + k * 250, y = 450;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-115, -55, 230, 110, c, 1); ctx.restore(); label(s, x, y, k === 2 ? 24 : 30, c, clamp(p), { bold: true });
  });
  if (t > S('D02')) { const G = { cx: 700, cy: 820, ux: 120, uy: 60, x0: 0, x1: 5, y0: 0, y1: 3.5 }, a = ap(t, 'D02', 0.1); ctx.save(); ctx.globalAlpha *= a * 0.35; ctx.fillStyle = CYAN; ctx.beginPath(); ctx.moveTo(gx(G, 1), gy(G, 0)); const xe = 1 + 3 * eIO(prog(t, P('D02', 0.2), 0.8)); for (let x = 1; x <= xe; x += 0.05) ctx.lineTo(gx(G, x), gy(G, 1 + 0.5 * Math.sin(x * 1.3) + x * 0.3)); ctx.lineTo(gx(G, xe), gy(G, 0)); ctx.closePath(); ctx.fill(); ctx.restore(); gPlot(G, x => 1 + 0.5 * Math.sin(x * 1.3) + x * 0.3, GOLD, { a }); }
};

// ======================= group（A185） =======================
const STARS4 = [[700, 170, 'P0 测速'], [840, 240, 'P2 最值'], [980, 160, 'P3 中值'], [1120, 230, 'P5 凹凸'], [1260, 150, 'P7 洛必达'], [1400, 250, 'P11 等价'], [1540, 160, 'P12 泰勒'], [1660, 250, 'P13 作图'], [1770, 160, 'P14 优化'], [1860, 250, 'P16 原函数']];
const LINEUP = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_point', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C05', 0.0, 0.6);
  STARS4.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C05', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS4[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C05') - 0.2;
  LINEUP.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C05', 0.6), 110 + 130 * 7, 560, SQ.D.col, 100);
  label('第 4 章 · 完', CX, 420, 54, GOLD, ap(t, 'C05', 0.3), { bold: true, glow: 18 });
  credits(t, E('C05') + 2.6, 'AI娘微积分课 · 第 4 章 · P17 收束与出口票', '下一章：积分', [...CREDIT_BASE,
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
  NODES.forEach(n => sfx(n.t(), n.big ? 'ding' : 'marimba', 0.16));
  s('X01', 0.1, 'slam', 0.3); s('X01', 0.12, 'zap', 0.16); s('X02', 0.1, 'whoosh', 0.18);
  ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.1, 'type', 0.14); s('D01', 0.85, 'check', 0.3); sfx(S('X03') - 0.05, 'stamp', 0.3); s('X03', 0.3, 'whoosh', 0.18);
  s('C03', 0.1, 'type', 0.14); s('C03', 0.75, 'ding', 0.2); s('C03', 0.85, 'check', 0.3); sfx(S('X04') - 0.05, 'stamp', 0.3); s('X04', 0.25, 'whoosh', 0.18);
  s('G02', 0.2, 'pluck', 0.2); s('G02', 0.3, 'type', 0.14); s('G02', 0.85, 'check', 0.3); s('X05', 0.1, 'stamp', 0.3); s('X05', 0.3, 'sparkle', 0.24);
  s('C04', 0.05, 'swoosh_in', 0.18); [0, 1, 2].forEach(k => s('C04', 0.25 + 0.18 * k, 'pop', 0.18)); s('D02', 0.1, 'shimmer', 0.18);
  s('C05', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C05') - 0.2 + 0.07 * k, 'pop', 0.16); s('C05', 0.6, 'sparkle', 0.3);
})();
finalize();
