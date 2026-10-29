// 第 5 章 P16《收束 · 出口票》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A242 全章地图 · A243 出口票三题 · A244 全员合影
const SC = {};
const TITLES = [['map', '全章一张图'], ['q1', '出口票 ①'], ['q2', '出口票 ②'], ['q3', '出口票 ③'], ['next', '下一章预告'], ['group', '合影']];
const XC = SQ.X.col;
SIDE.D.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);   // 合影时大肥鱼站进队伍
SIDE.G.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);

// ======================= map（A242） =======================
const NODES = [
  { id: 'cut', x: 640, y: 330, s: '切细求和 P1–P3', c: CYAN, t: () => P('C01', 0.35) },
  { id: 'def', x: 930, y: 330, s: '定积分 P4–P6', c: GOLD, t: () => P('C01', 0.7), big: true },
  { id: 'ftc1', x: 780, y: 520, s: '基本定理（一）P7 P8', c: SQ.M.col, t: () => P('C02', 0.25) },
  { id: 'ftc2', x: 1080, y: 520, s: '牛–莱公式 P9 P10', c: SQ.Q.col, t: () => P('C02', 0.6) },
  { id: 'sub', x: 660, y: 720, s: '换元 P11–P13', c: SQ.K.col, t: () => P('G01', 0.15), sm: true },
  { id: 'ibp', x: 930, y: 720, s: '分部 P14', c: SQ.B.col, t: () => P('G01', 0.3), sm: true },
  { id: 'imp', x: 1200, y: 720, s: '反常积分 P15', c: SQ.M.col, t: () => P('G01', 0.65), sm: true },
];
const EDGES = [['cut', 'def'], ['def', 'ftc1'], ['def', 'ftc2'], ['ftc1', 'ftc2'], ['ftc2', 'sub'], ['ftc2', 'ibp'], ['ftc2', 'imp']];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const N = {}; NODES.forEach(n => N[n.id] = n);
  EDGES.forEach(([a, b]) => { const A = N[a], B = N[b], p = eOut(prog(t, B.t(), 0.4)); if (p <= 0) return; seg(A.x, A.y, lerp(A.x, B.x, p), lerp(A.y, B.y, p), B.c, 0.55, 2.5, b === 'imp' ? [8, 6] : null); });
  NODES.forEach(n => { const p = eBack(prog(t, n.t(), 0.45)); if (p <= 0) return; const w = n.big ? 250 : n.sm ? 200 : 240, h = n.big ? 80 : 60; ctx.save(); ctx.translate(n.x, n.y); ctx.scale(p, p); panel(-w / 2, -h / 2, w, h, n.c, 1); ctx.restore(); label(n.s, n.x, n.y, n.big ? 28 : n.sm ? 21 : 22, n.c, clamp(p), { bold: true }); });
  if (t > P('C02', 0.6)) label('∫ₐᵇ f = F(b) − F(a)', 930, 610, 22, GOLD, ap(t, 'C02', 0.7), { font: F_MATH });
};

// ======================= 出口票（A243） =======================
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
  ticket(t, '①', [['y = x²', GOLD], ['，[0, 3] 上的面积？', CR]], P('X02', 0.1)); qcd(t);
  const G = { cx: 620, cy: 840, ux: 110, uy: 40, x0: 0, x1: 3.4, y0: 0, y1: 10 }, a = ap(t, 'X02', 0.4);
  gAxes(G, a, { grid: false, ticks: { x: [[3, '3']], y: [[9, '9']] } }); gPlot(G, x => x * x, GOLD, { a, xa: 0, xb: 3.2 });
  if (t > S('D01')) { gArea(G, x => x * x, 0, 3, ap(t, 'D01', 0.05)); richReveal([['x³/3 |₀³ = ', CR], ['9', GRN]], 1100, 560, 44, t, P('D01', 0.2), { upright: true }); checkMark(1260, 550, 26, GRN, t, P('D01', 0.85)); }
};
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X03', 0.25)) { verified(t, S('X03') - 0.05, 980, 500); return; }
  ticket(t, '②', [['d/dx ∫₀^(sin x) √(1 + t²) dt', CR]], P('X03', 0.3)); qcd(t);
  if (t > S('C03')) {
    richReveal([['f(上限) · (上限)′', CYAN]], 980, 500, 32, t, P('C03', 0.1), { upright: true });
    richReveal([['√(1 + sin²x) · ', CR], ['cos x', GRN]], 980, 600, 42, t, P('C03', 0.5), { upright: true });
    checkMark(1250, 590, 24, GRN, t, P('C03', 0.85));
  }
};
SC.q3 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X04', 0.2)) { verified(t, S('X04') - 0.05, 980, 500); return; }
  ticket(t, '③', [['∫₀^(π/2) x cos x dx = ？', CR]], P('X04', 0.25)); qcd(t);
  if (t > S('G02')) { richReveal([['u = x，dv = cos x dx', CYAN]], 900, 480, 28, t, P('G02', 0.1), { upright: true }); richReveal([['[x sin x + cos x]₀^(π/2) = ', CR], ['π/2 − 1', GRN]], 900, 570, 34, t, P('G02', 0.4), { upright: true }); checkMark(1250, 560, 24, GRN, t, P('G02', 0.85)); }
  if (t > S('X05')) { verified(t, P('X05', 0.1), 1170, 760); label('三道全对', 980, 860, 34, XC, ap(t, 'X05', 0.3), { bold: true }); }
};

// ======================= next =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 6 章 · 积分的应用', CX, 260, 50, GOLD, ap(t, 'C04', 0.05), { bold: true, glow: 16 });
  [['曲线间面积', CYAN], ['旋转体体积', SQ.Q.col], ['做功', SQ.X.col], ['平均值', SQ.H.col]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C04', 0.25 + 0.15 * k), 0.4)); if (p <= 0) return; const x = 650 + k * 220, y = 450;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-95, -50, 190, 100, c, 1); ctx.restore(); label(s, x, y, 26, c, clamp(p), { bold: true });
  });
  if (t > S('D02')) {   // 抛物线弓形 → 旋转体（回扣 P0）
    const a = ap(t, 'D02', 0.1), cx = 980, cy = 655, w = 220, h = 115, sp = eIO(prog(t, P('D02', 0.3), 1.0));
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.fillStyle = hexA(GOLD, 0.25); ctx.beginPath(); ctx.moveTo(cx - w, cy);
    for (let k = 0; k <= 40; k++) { const u = -1 + 2 * k / 40; ctx.lineTo(cx + w * u, cy - h * (1 - u * u)); } ctx.closePath(); ctx.fill(); ctx.stroke();
    if (sp > 0) {
      ctx.globalAlpha = a * sp; ctx.strokeStyle = CYAN; ctx.lineWidth = 2.5; ctx.setLineDash([7, 6]); ctx.beginPath(); ctx.moveTo(cx - w, cy);
      for (let k = 0; k <= 40; k++) { const u = -1 + 2 * k / 40; ctx.lineTo(cx + w * u, cy + h * (1 - u * u)); } ctx.stroke(); ctx.setLineDash([]);
      [-0.6, -0.2, 0.2, 0.6].forEach(u => { ctx.beginPath(); ctx.ellipse(cx + w * u, cy, 6 + 16 * sp, h * (1 - u * u), 0, 0, 7); ctx.stroke(); });
    }
    ctx.restore();
  }
};

// ======================= group（A244） =======================
const STARS5 = [[700, 170, 'P0 阿基米德'], [840, 240, 'P2 上和下和'], [980, 160, 'P4 定积分'], [1120, 230, 'P7 基本定理'], [1260, 150, 'P9 牛–莱'], [1400, 250, 'P11 换元'], [1540, 160, 'P14 分部'], [1680, 250, 'P15 反常'], [1820, 170, 'P16 出口票']];
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
  label('第 5 章 · 完', CX, 420, 54, GOLD, ap(t, 'C05', 0.3), { bold: true, glow: 18 });
  credits(t, E('C05') + 2.6, 'AI娘微积分课 · 第 5 章 · P16 收束与出口票', '下一章：积分的应用', [...CREDIT_BASE,
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
  s('C04', 0.05, 'swoosh_in', 0.18); [0, 1, 2, 3].forEach(k => s('C04', 0.25 + 0.15 * k, 'pop', 0.18)); s('D02', 0.1, 'shimmer', 0.18); s('D02', 0.3, 'warp', 0.16);
  s('C05', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C05') - 0.2 + 0.07 * k, 'pop', 0.16); s('C05', 0.6, 'sparkle', 0.3);
})();
finalize();
