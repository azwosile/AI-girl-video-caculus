// 第 7 章 P15《收束 · 擂台决赛》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A335 工具箱地图 · A336 决赛三题 · A337 全员合影
const SC = {};
const TITLES = [['map', '全章工具箱'], ['q1', '决赛 ①'], ['q2', '决赛 ②'], ['q3', '决赛 ③'], ['next', '下一章预告'], ['group', '合影']];
const XC = SQ.X.col;
SIDE.D.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);   // 合影时大肥鱼站进队伍
SIDE.G.dy = t => (t > S('C05') - 0.5 ? 2000 : 0);

// ======================= 工具箱地图（A335） =======================
const NODES = [
  { id: 'root', x: 870, y: 270, s: '∫ f(x) dx', c: GOLD, t: () => P('C01', 0.3), big: true },
  { id: 'anti', x: 690, y: 400, s: '求原函数', c: CYAN, t: () => P('C02', 0.02) },
  { id: 'num', x: 1050, y: 400, s: '求数值', c: SQ.Q.col, t: () => P('G01', 0.02) },
  { id: 'ibp', x: 580, y: 520, s: '分部 P2 P3', c: SQ.B.col, t: () => P('C02', 0.1), sm: true },
  { id: 'trig', x: 780, y: 520, s: '三角 P4 P5', c: SQ.H.col, t: () => P('C02', 0.22), sm: true },
  { id: 'sub', x: 580, y: 620, s: '三角代换 P6', c: SQ.R.col, t: () => P('C02', 0.36), sm: true },
  { id: 'pf', x: 780, y: 620, s: '部分分式 P7 P8', c: SQ.Z.col, t: () => P('C02', 0.5), sm: true },
  { id: 'wt', x: 680, y: 720, s: '万能代换 P9', c: SQ.N.col, t: () => P('C02', 0.7), sm: true },
  { id: 'tm', x: 990, y: 520, s: '梯形 · 中点 P12', c: SQ.H.col, t: () => P('G01', 0.2), sm: true },
  { id: 'simp', x: 1150, y: 620, s: '辛普森 P13', c: SQ.Q.col, t: () => P('G01', 0.35), sm: true },
  { id: 'cmp', x: 990, y: 720, s: '比较判别 P14', c: SQ.K.col, t: () => P('G01', 0.65), sm: true },
];
const EDGES = [['root', 'anti'], ['root', 'num'], ['anti', 'ibp'], ['anti', 'trig'], ['anti', 'sub'], ['anti', 'pf'], ['anti', 'wt'], ['num', 'tm'], ['num', 'simp'], ['num', 'cmp']];
function toolMap(t, a0 = 1) {
  const N = {}; NODES.forEach(n => N[n.id] = n);
  EDGES.forEach(([a, b]) => { const A = N[a], B = N[b], p = eOut(prog(t, B.t(), 0.4)); if (p <= 0) return; seg(A.x, A.y, lerp(A.x, B.x, p), lerp(A.y, B.y, p), B.c, 0.5 * a0, 2.5); });
  NODES.forEach(n => { const p = eBack(prog(t, n.t(), 0.45)); if (p <= 0) return; const w = n.big ? 240 : n.sm ? 180 : 200, h = n.big ? 70 : 54; ctx.save(); ctx.translate(n.x, n.y); ctx.scale(p, p); panel(-w / 2, -h / 2, w, h, n.c, a0); ctx.restore(); (n.big ? (s, x, y, z, c, a) => mathText(s, x, y + 10, z, c, { align: 'center', alpha: a, upright: true }) : (s, x, y, z, c, a) => label(s, x, y, z, c, a, { bold: true }))(n.s, n.x, n.y, n.big ? 30 : n.sm ? 19 : 24, n.c, clamp(p) * a0); });
}
SC.map = t => { starfield(t); blueprint(0.4, 80); toolMap(t); label('策略 P10 · 积分表 P11', 870, 790, 22, SQ.X.col, ap(t, 'G01', 0.85), { bold: true }); };

// ======================= 决赛（A336） =======================
function ticket(t, n, q, t0, a = 1) {
  if (a <= 0) return; const p = eBack(prog(t, t0, 0.45));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(880, 290); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = XC; ctx.lineWidth = 3; ctx.shadowColor = XC; ctx.shadowBlur = 14; rr(-330, -80, 660, 160, 16); ctx.fill(); ctx.stroke();
  ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(-210, -80); ctx.lineTo(-210, 80); ctx.stroke(); ctx.restore();
  label('决赛 ' + n, 880 - 270, 290, 26, XC, clamp(p) * a, { bold: true });
  mathRich(q, 880 + 60, 302, 32, { align: 'center', alpha: clamp(p) * a, glow: 10, upright: true });
}
const qcd = t => ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1290, 560, 86); });
function verified(t, t0, x = 1100, y = 740) { stampMark(x, y, 66, t, t0, { text: '核实通过', col: XC, rot: -0.14 }); }
const GQ1 = { cx: 580, cy: 760, ux: 190, uy: 230, x0: -0.05, x1: 1.7, y0: -0.05, y1: 1.15 };
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('X02')) { ringBanner(870, 380, '擂台决赛', t, P('X01', 0.05), { w: 300, size: 44 }); kinetic('这是真的吗？', 870, 540, 66, t, P('X01', 0.35), { col: XC }); return; }
  ticket(t, '①', [['∫₀^{π/2} sin²x dx = ？', CR]], P('X02', 0.1)); qcd(t);
  const a = ap(t, 'X02', 0.4); seg(gx(GQ1, 0), gy(GQ1, 0), gx(GQ1, 1.65), gy(GQ1, 0), CR, a * 0.6, 2); gPlot(GQ1, x => Math.sin(x) ** 2, SQ.H.col, { a, xa: 0, xb: Math.PI / 2, w: 4 });
  if (t > S('D01')) { gBetween(GQ1, x => Math.sin(x) ** 2, () => 0, 0, Math.PI / 2, ap(t, 'D01', 0.05), { col: 'rgba(61,139,255,0.35)' }); richReveal([['½∫₀^{π/2}(1 − cos 2x) dx = ', CR], ['π/4', GRN]], 1050, 520, 30, t, P('D01', 0.2), { upright: true }); checkMark(1050, 600, 24, GRN, t, P('D01', 0.85)); }
};
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X03', 0.25)) { verified(t, S('X03') - 0.05, 870, 480); return; }
  ticket(t, '②', [['∫₀¹ x / (x + 1) dx = ？', CR]], P('X03', 0.3)); qcd(t);
  if (t > S('C03')) {
    richReveal([['x/(x + 1) = 1 − 1/(x + 1)', CYAN]], 870, 470, 32, t, P('C03', 0.1), { upright: true });
    richReveal([['= ', CR], ['1 − ln 2', GRN], ['  ≈ 0.3069', CR]], 870, 570, 40, t, P('C03', 0.5), { upright: true });
    checkMark(1180, 560, 24, GRN, t, P('C03', 0.85));
  }
};
SC.q3 = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < P('X04', 0.2)) { verified(t, S('X04') - 0.05, 870, 480); return; }
  ticket(t, '③', [['∫₀^{π/2} sin³x dx = ？', CR]], P('X04', 0.25)); qcd(t);
  if (t > S('G02')) { richReveal([['华里士：', SQ.T.col], ['(2/3) × 1', CR]], 870, 470, 32, t, P('G02', 0.1), { upright: true }); richReveal([['= ', CR], ['2/3', GRN]], 870, 560, 44, t, P('G02', 0.45), { upright: true }); checkMark(1060, 550, 24, GRN, t, P('G02', 0.85)); }
  if (t > S('X05')) { codeWin(t, 560, 620, 360, [[[['S₁₀ ≈ 0.666646', SQ.Q.col]], P('X05', 0.25), 0.5]], P('X05', 0.15), { sz: 22 }); verified(t, P('X05', 0.55), 1100, 690); }
};

// ======================= 下一章 =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 8 章 · 积分的更多应用', 870, 260, 46, GOLD, ap(t, 'C04', 0.05), { bold: true, glow: 16 });
  [['质心', CYAN], ['概率', SQ.Q.col], ['物理应用', SQ.X.col]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C04', 0.35 + 0.18 * k), 0.4)); if (p <= 0) return; const x = 650 + k * 220, y = 430;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-95, -50, 190, 100, c, 1); ctx.restore(); label(s, x, y, 26, c, clamp(p), { bold: true });
  });
  if (t > S('D02')) { const T = [['分部', SQ.B.col], ['三角', SQ.H.col], ['代换', SQ.R.col], ['分式', SQ.Z.col], ['万能', SQ.N.col], ['策略', SQ.X.col], ['查表', SQ.M.col], ['数值', SQ.Q.col], ['比较', SQ.K.col]]; toolGrid(870, 640, T, 9, t, T.map((_, i) => P('D02', 0.1) + i * 0.08), { cw: 66, ch: 54, gap: 8, size: 18 }); }
};

// ======================= 合影（A337） =======================
const STARS7 = [[700, 170, 'P0 擂台'], [840, 240, 'P2 分部'], [980, 160, 'P4 三角'], [1120, 230, 'P7 分式'], [1260, 150, 'P9 万能'], [1400, 250, 'P10 策略'], [1540, 160, 'P13 辛普森'], [1680, 250, 'P14 比较'], [1820, 170, 'P15 决赛']];
const LINEUP = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_point', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C05', 0.0, 0.6);
  STARS7.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C05', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS7[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C05') - 0.2;
  LINEUP.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C05', 0.6), 110 + 130 * 7, 560, SQ.D.col, 100);
  label('第 7 章 · 完', CX, 420, 54, GOLD, ap(t, 'C05', 0.3), { bold: true, glow: 18 });
  credits(t, E('C05') + 2.6, 'AI娘微积分课 · 第 7 章 · P15 收束：擂台决赛', '下一章：积分的更多应用', [...CREDIT_BASE,
    '混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。',
    '「积分擂台」致敬 MIT Integration Bee；题目与解法依据 Stewart《Calculus》第 7 版第 7 章。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C05') - 0.2) lecturer(t, 'C', 255, -5, S('C05') - 0.3, { h: 710 }); };
SC.__noTag = E('C05') + 2.5;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C05') + 2.6); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  NODES.forEach(n => sfx(n.t(), n.big ? 'ding' : 'marimba', 0.15));
  s('X01', 0.05, 'slam', 0.3); s('X01', 0.35, 'zap', 0.16); s('X02', 0.1, 'whoosh', 0.18);
  ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.05, 'whoosh', 0.14); s('D01', 0.2, 'type', 0.14); s('D01', 0.85, 'check', 0.3); sfx(S('X03') - 0.05, 'stamp', 0.3); s('X03', 0.3, 'whoosh', 0.18);
  s('C03', 0.1, 'type', 0.14); s('C03', 0.5, 'ding', 0.2); s('C03', 0.85, 'check', 0.3); sfx(S('X04') - 0.05, 'stamp', 0.3); s('X04', 0.25, 'whoosh', 0.18);
  s('G02', 0.1, 'type', 0.14); s('G02', 0.45, 'ding', 0.2); s('G02', 0.85, 'check', 0.3); s('X05', 0.25, 'type', 0.14); s('X05', 0.55, 'stamp', 0.3); s('X05', 0.7, 'sparkle', 0.24);
  s('C04', 0.05, 'swoosh_in', 0.18); [0, 1, 2].forEach(k => s('C04', 0.35 + 0.18 * k, 'pop', 0.18)); for (let i = 0; i < 9; i++) sfx(P('D02', 0.1) + i * 0.08, 'marimba', 0.1);
  s('C05', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C05') - 0.2 + 0.07 * k, 'pop', 0.16); s('C05', 0.6, 'sparkle', 0.3);
})();
finalize();
