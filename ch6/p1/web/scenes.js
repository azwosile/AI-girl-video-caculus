// 第 6 章 P1《高中速通：体积公式》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A248 公式卡片墙（四种立体伪 3D 图标）· A249 锥体切薄片、截面按 x² 增长 · A250 三棱柱拆成三个等积三棱锥
const SC = {};
const TITLES = [['wall', '公式墙'], ['prism', '拼三棱柱'], ['slice', '薄片积分'], ['quiz', '随堂一题'], ['outro', '小结']];
const OY = { axis: 'y', at: 0, e: 0.3 };
const ICONS = [
  ['柱体', 'V = Sh', CYAN, { R: () => 1.4, t0: 0, t1: 2 }],
  ['锥体', 'V = Sh/3', GOLD, { R: t => 1.4 * (1 - t / 2.2), t0: 0, t1: 2.2 }],
  ['台体', 'V = h(S + √(SS′) + S′)/3', GRN, { R: t => 1.4 - 0.32 * t, t0: 0, t1: 2 }],
  ['球', 'V = 4πR³/3   S = 4πR²', INV, { R: t => Math.sqrt(Math.max(0, 1.21 - (t - 1.1) ** 2)), t0: 0.001, t1: 2.199 }],
];
const CARD = [[630, 250], [1000, 250], [630, 520], [1000, 520]], CWd = 340, CHt = 250;
function iconCard(i, a, hi = 0) {
  if (a <= 0) return; const [x, y] = CARD[i], [nm, f, c, o] = ICONS[i];
  panel(x, y, CWd, CHt, c, a, hi ? 'rgba(40,32,8,0.88)' : undefined);
  const G = { cx: x + CWd / 2, cy: y + 160, ux: 42, uy: 42 };
  revSolid(G, { ...OY, ...o, col: c, a, Rmax: 1.4, rings: 3 });
  label(nm, x + 52, y + 34, 26, c, a, { bold: true });
  mathText(f, x + CWd / 2, y + 222, i === 2 ? 23 : i === 3 ? 22 : 28, CR, { align: 'center', alpha: a, upright: true });
}

// ======================= 公式墙（A248） =======================
SC.wall = t => {
  starfield(t); blueprint(0.35, 80);
  const al = [ap(t, 'K01', 0.05), ap(t, 'K01', 0.45), ap(t, 'K02', 0.05), ap(t, 'K03', 0.05)];
  const hi = t > S('D01') ? 1 : 0;
  al.forEach((a, i) => iconCard(i, a * (hi && i !== 1 ? 0.45 : 1), hi && i === 1));
  if (hi) { label('为什么是 1/3？', 1170, 228, 30, GOLD, ap(t, 'D01', 0.2) * (0.75 + 0.25 * Math.sin(t * 5)), { bold: true }); }
};

// ======================= 拼三棱柱（A250） =======================
const PU = 105, PC = [930, 720];
const pj = ([x, y, z]) => [PC[0] + (x + 0.55 * z) * PU, PC[1] - (y + 0.38 * z) * PU];
const PA = [0, 0, 0], PB = [2.4, 0, 0], PCc = [0.5, 0, 1.4], PA2 = [0, 2.6, 0], PB2 = [2.4, 2.6, 0], PC2 = [0.5, 2.6, 1.4];
const TET = [[PA2, PA, PB, PCc], [PA2, PB, PCc, PB2], [PA2, PCc, PB2, PC2]], TCOL = [CYAN, GOLD, GRN], TOFF = [[-2.2, -0.2, 0], [0, 0.25, 0], [2.2, 0.15, 0]];
function tetra(V, off, col, a) {
  if (a <= 0) return; const P = V.map(v => pj([v[0] + off[0], v[1] + off[1], v[2] + off[2]]));
  ctx.save(); ctx.globalAlpha *= a; [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].forEach(f => {
    ctx.beginPath(); ctx.moveTo(...P[f[0]]); ctx.lineTo(...P[f[1]]); ctx.lineTo(...P[f[2]]); ctx.closePath(); ctx.fillStyle = hexA(col, 0.16); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.stroke();
  }); ctx.restore();
}
SC.prism = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C01', 0), ex = eIO(prog(t, P('C01', 0.45), 1.2));
  TET.forEach((V, i) => tetra(V, TOFF[i].map(v => v * ex), ex > 0.02 ? TCOL[i] : CR, a));
  label('三棱柱', CX - 50, 250, 34, CR, a * (1 - ex), { bold: true });
  if (ex > 0.5) ['①', '②', '③'].forEach((s, i) => { const [x, y] = pj([1 + TOFF[i][0], 3.2, 0.5]); label(['V₁', 'V₂', 'V₃'][i], x, y, 30, TCOL[i], ap(t, 'C01', 0.7), { bold: true }); });
  if (t > S('G01')) {
    richReveal([['V₁ = V₂ = V₃  ⇒  每块 = ', CR], ['Sh/3', GOLD]], CX, 250, 40, t, P('G01', 0.45), { upright: true });
    label('两两同底等高 · 祖暅原理', CX, 330, 28, SQ.G.col, ap(t, 'G01', 0.15), { bold: true });
  }
};

// ======================= 薄片积分（A249） =======================
const HC = 4.4, RC = 1.3, GS = { cx: 660, cy: 600, ux: 140, uy: 140 }, OXc = { axis: 'x', at: 0, e: 0.3, R: x => RC * x / HC, t0: 0.001, t1: HC };
SC.slice = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C02', 0);
  revSolid(GS, { ...OXc, col: GOLD, a: a * (t > S('C04') ? 0.5 : 0.8), Rmax: RC, rings: 6 });
  seg(gx(GS, -0.2), GS.cy, gx(GS, HC + 0.35), GS.cy, CR, a * 0.6, 1.5, [6, 6]); mathText('x', gx(GS, HC + 0.45), GS.cy + 8, 26, CR, { alpha: a });
  label('顶点', gx(GS, 0) - 10, GS.cy + 50, 22, CR, a); label('底面 S', gx(GS, HC) + 20, GS.cy + RC * GS.uy + 40, 24, GOLD, a, { bold: true });
  if (t < S('C04')) {
    const u = prog(t, P('C02', 0.35), D('C02') * 0.65 + D('C03')), x = HC * (0.3 + 0.6 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)));
    revSlab(GS, OXc, x, 0.12, CYAN, ap(t, 'C02', 0.3));
    mathText('x', gx(GS, x), GS.cy + RC * GS.uy + 40, 26, CYAN, { align: 'center', alpha: ap(t, 'C02', 0.3) });
    if (t > S('C03')) richReveal([['A(x) = S · ', CR], ['(x/h)²', CYAN]], CX, 260, 40, t, P('C03', 0.5), { upright: true });
  } else {
    const n = 10, p = eIO(prog(t, P('C04', 0.05), 1.2));
    for (let k = 0; k < n; k++) { const q = clamp(p * n - k); if (q > 0) revSlab(GS, OXc, HC * (k + 0.5) / n, HC / n * 0.9, CYAN, q * 0.9); }
    richReveal([['V = ', CR], ['∫', GOLD], ['₀ʰ S x²/h² dx = (S/h²)·h³/3 = ', CR], ['Sh/3', GOLD]], CX, 260, 36, t, P('C04', 0.3), { upright: true });
    if (t > S('K04')) { const c = ap(t, 'K04', 0.1); panel(1040, 320, 420, 70, SQ.K.col, c); label('1/3  ⇐  ∫ x² dx', 1250, 356, 32, GOLD, c, { bold: true }); }
  }
};

// ======================= 随堂 =======================
const GQ = { cx: 1120, cy: 740, ux: 46, uy: 46 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['圆锥：r = 3，h = 4，V = ？', CR]], 800, 330, 42, t, P('C06', 0.1), { upright: true });
  const ca = ap(t, 'C06', 0.3); revSolid(GQ, { ...OY, R: y => 3 * (1 - y / 4), t0: 0, t1: 4, col: GOLD, a: ca, Rmax: 3, rings: 4 });
  mathText('3', GQ.cx + 1.5 * GQ.ux, GQ.cy + 34, 26, CR, { align: 'center', alpha: ca }); mathText('4', GQ.cx + 12, GQ.cy - 2 * GQ.uy, 26, CR, { alpha: ca });
  seg(GQ.cx, GQ.cy, GQ.cx + 3 * GQ.ux, GQ.cy, CR, ca, 2); seg(GQ.cx, GQ.cy, GQ.cx, GQ.cy - 4 * GQ.uy, CR, ca, 2, [6, 5]);
  if (t > S('D02')) { richReveal([['π · 3² · 4 / 3', CYAN]], 800, 470, 36, t, P('D02', 0.1), { upright: true }); richReveal([['= ', CR], ['12π', GOLD]], 800, 580, 52, t, P('D02', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) {
    ICONS.forEach(([nm, f, c, o], i) => { const G = { cx: 640 + i * 230, cy: 600, ux: 50, uy: 50 }; revSolid(G, { ...OY, ...o, col: c, a: ga * ap(t, 'C07', 0.1 + i * 0.1), Rmax: 1.4, rings: 3 }); label(nm, G.cx, 660, 28, c, ga * ap(t, 'C07', 0.1 + i * 0.1), { bold: true }); });
    richReveal([['锥体的 1/3 = ', CR], ['∫ x² dx', GOLD], [' 的 1/3', CR]], CX, 290, 40, t, P('C07', 0.6), { upright: true, alpha: ga });
  }
  if (t > S('C08') - 0.1) { glowText('下一段：曲线间的面积', CX, 500, 52, CR, t, P('C08', 0.15)); glowText('豆包上场', CX, 590, 32, SQ.B.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 6 章 · P1 高中速通：体积公式', '下一段：曲线间的面积', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM6('Kimi')]);
};

SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.05, 'pop', 0.18); s('K01', 0.45, 'pop', 0.18); s('K02', 0.05, 'pop', 0.18); s('K03', 0.05, 'pop', 0.18); s('D01', 0.2, 'buzz', 0.14);
  s('C01', 0.1, 'shimmer', 0.18); s('C01', 0.45, 'whoosh', 0.2); s('G01', 0.15, 'type', 0.14); s('G01', 0.45, 'ding_hi', 0.24);
  s('C02', 0.3, 'whoosh', 0.14); s('C03', 0.5, 'ding', 0.2); s('C04', 0.05, 'riser', 0.18); s('C04', 0.3, 'type', 0.14); s('K04', 0.1, 'ding_hi', 0.26);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'type', 0.14); s('D02', 0.55, 'ding_hi', 0.28);
  s('C07', 0.1, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
