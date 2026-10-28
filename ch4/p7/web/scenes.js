// 第 4 章 P7《柯西中值定理与洛必达法则》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A145 “0/0 = ?” 轮盘 · A146 参数曲线上的柯西割线与切线 · A147 两条过同一零点的曲线放大成直线，比值 → 斜率之比 · A148 “上下分别求导”拆装
const SC = {};
const TITLES = [['flop', '0/0 = 1 ?'], ['cauchy', '柯西中值定理'], ['lhop', '洛必达法则'], ['ex', '例题与条件'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 轮盘（A145） =======================
const WH = ['1', '2', '3', '∞', '0', '½', '?', '−1'], WC = [SQ.M.col, GOLD, GRN, RED, CYAN, SEC, CR, '#FF8A3D'];
function wheelAngle(t) {   // 每句停在一个格子：M01→1，C01→2，D01→3，M02→“?”
  const stops = [['M01', 0], ['C01', 1], ['D01', 2], ['M02', 6]]; let ang = 0;
  stops.forEach(([id, k], i) => { const target = -k * (2 * Math.PI / 8) - 2 * Math.PI * (i + 1) * 2; const p = eIO(prog(t, P(id, 0.05), 1.3)); ang = lerp(ang, target, p); });
  return ang;
}
SC.flop = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'M01', 0), cx = 860, cy = 560, R = 210, ang = wheelAngle(t);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.rotate(ang - Math.PI / 2 - Math.PI / 8);
  WH.forEach((s, k) => {
    const a0 = k * Math.PI / 4, a1 = a0 + Math.PI / 4; ctx.fillStyle = hexA(WC[k], 0.28); ctx.strokeStyle = hexA(WC[k], 0.9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a0, a1); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.rotate(a0 + Math.PI / 8); ctx.translate(R * 0.68, 0); ctx.rotate(Math.PI / 2); ctx.font = `bold 44px ${F_MATH}`; ctx.fillStyle = WC[k]; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = WC[k]; ctx.shadowBlur = 10; ctx.fillText(s, 0, 0); ctx.restore();
  });
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(10,14,30,0.95)'; ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 62, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  mathText('0/0', cx, cy + 14, 40, CR, { align: 'center', alpha: a, upright: true, glow: 10 });
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(cx, cy - R + 18); ctx.lineTo(cx - 18, cy - R - 26); ctx.lineTo(cx + 18, cy - R - 26); ctx.fill(); ctx.restore();
  // 右侧：反例
  const ex = [['M01', '“0/0 = 1”', SQ.M.col, 0.4], ['C01', '(x² − 1)/(x − 1) → 2', GOLD, 0.5], ['D01', 'sin 3x / x → 3', GRN, 0.5]];
  ex.forEach(([id, s, c, f], i) => { if (t < S(id)) return; const p = ap(t, id, f); panel(1110, 250 + i * 110, 250, 80, c, p); label(s, 1235, 290 + i * 110, 24, c, p, { font: F_MATH, bold: true }); if (i === 0) crossMark(1335, 265, 22, COL.red, t, P('C01', 0.3)); });
  if (t > S('C02')) { stampMark(cx, cy, 120, t, P('C02', 0.1), { text: '未定式', col: COL.red, alpha: 0.85 }); glowText('谁趋于零更快？', CX, 900, 36, GOLD, t, P('C02', 0.5)); }
};

// ======================= 柯西（A146） =======================
const GCY = { cx: 650, cy: 820, ux: 95, uy: 95, x0: 0, x1: 6.6, y0: 0, y1: 6.2 };
const gT = s => 0.6 + 1.9 * s - 0.18 * s * s, fT = s => 0.8 + 1.4 * Math.sin(1.25 * s) + 0.55 * s, gTd = s => 1.9 - 0.36 * s, fTd = s => 1.75 * Math.cos(1.25 * s) + 0.55;
const TA = 0.1, TB = 3.6, SL = (fT(TB) - fT(TA)) / (gT(TB) - gT(TA));
const TCc = (() => { let b = 9, c = 1; for (let i = 0; i <= 600; i++) { const s = TA + (TB - TA) * i / 600, d = Math.abs(fTd(s) / gTd(s) - SL); if (d < b && s > 0.5 && s < 2.5) { b = d; c = s; } } return c; })();
SC.cauchy = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C03', 0.3);
  gAxes(GCY, a, { grid: false, xl: 'g', yl: 'f' });
  if (t < S('C04')) { richReveal([['横坐标 g(t)', CYAN], ['，  ', CR], ['纵坐标 f(t)', GOLD]], 1000, 230, 32, t, P('C03', 0.5), { upright: true }); }
  const dp = eIO(prog(t, P('C04', 0.05), 1.4)), s1 = lerp(TA, TB, dp);
  if (dp > 0) {
    ctx.save(); gClip(GCY); glowPath(() => { for (let i = 0; i <= 120; i++) { const s = TA + (s1 - TA) * i / 120, X = gx(GCY, gT(s)), Y = gy(GCY, fT(s)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, RED, 4.5); ctx.restore();
    glowDot(gx(GCY, gT(s1)), gy(GCY, fT(s1)), 7, CR);
  }
  const sa = ap(t, 'C04', 0.4);
  if (sa > 0) {
    gDot(GCY, gT(TA), fT(TA), SEC, sa); gDot(GCY, gT(TB), fT(TB), SEC, sa); gLine(GCY, SL, gT(TA), fT(TA), gT(TA), gT(TB), SEC, sa, 3.5);
    richReveal([['割线斜率 = ', CR], ['[f(b) − f(a)] / [g(b) − g(a)]', SEC]], 1000, 220, 28, t, P('C04', 0.4), { upright: true });
    richReveal([["切线斜率 = f'(t) / g'(t)", GOLD]], 1000, 270, 28, t, P('C04', 0.7), { upright: true });
  }
  if (t > S('C05') - 0.1) {
    const c = ap(t, 'C05', 0.1), X = gT(TCc), Y = fT(TCc);
    gLine(GCY, SL, X, Y, X - 1.6, X + 1.6, GOLD, c, 3.5); gDot(GCY, X, Y, GOLD, c);
    label('t = c', gx(GCY, X), gy(GCY, Y) - 34, 24, GOLD, c, { font: F_MATH, bold: true });
    panel(860, 640, 500, 150, GOLD, ap(t, 'C05', 0.5));
    mathText('f(b) − f(a)', 960, 690, 26, SEC, { align: 'center', alpha: ap(t, 'C05', 0.5), upright: true }); mathText('g(b) − g(a)', 960, 745, 26, SEC, { align: 'center', alpha: ap(t, 'C05', 0.5), upright: true });
    seg(890, 704, 1030, 704, SEC, ap(t, 'C05', 0.5), 2.5); mathText('=', 1060, 715, 30, CR, { align: 'center', alpha: ap(t, 'C05', 0.5), upright: true });
    mathText("f'(c)", 1120, 690, 28, GOLD, { align: 'center', alpha: ap(t, 'C05', 0.5), upright: true }); mathText("g'(c)", 1120, 745, 28, GOLD, { align: 'center', alpha: ap(t, 'C05', 0.5), upright: true }); seg(1085, 704, 1155, 704, GOLD, ap(t, 'C05', 0.5), 2.5);
    termCard('Cauchy MVT', '柯西中值定理', 1260, 560, t, P('C05', 0.75));
  }
  if (t > S('G01')) richReveal([['g(t) = t  ⇒  拉格朗日', SQ.G.col]], 1110, 840, 28, t, P('G01', 0.3), { upright: true });
};

// ======================= 洛必达（A147 + A148） =======================
const lf = u => 2 * u + 0.9 * u * u, lg = u => u - 0.7 * u * u + 0.2 * u * u * u;
SC.lhop = t => {
  starfield(t); blueprint(0.4, 80);
  // 放大：窗口宽度 δ 从 1 缩到 0.04
  const z = eIO(prog(t, P('C07', 0.05), D('C07') * 0.8)), dl = lerp(1, 0.04, z), G = { cx: 850, cy: 560, ux: 230 / dl, uy: 230 / (2.6 * dl), x0: -dl, x1: dl, y0: -2.6 * dl, y1: 2.6 * dl };
  const a = ap(t, 'C06', 0);
  panel(610, 300, 480, 520, CYAN, a * 0.5);
  gAxes(G, a, { grid: false }); mathText('a', G.cx - 16, G.cy + 30, 24, CR, { align: 'center', alpha: a });
  gPlot(G, lf, GOLD, { a }); gPlot(G, lg, CYAN, { a });
  label('f', gx(G, 0.8 * dl) + 14, gy(G, lf(0.8 * dl)) - 10, 26, GOLD, a, { font: F_MATH }); label('g', gx(G, 0.85 * dl) + 14, gy(G, lg(0.85 * dl)) + 18, 26, CYAN, a, { font: F_MATH });
  const ux = 0.6 * dl; gV(G, ux, CR, a * 0.4, { ya: 0, yb: lf(ux), dash: [5, 5] });
  seg(gx(G, ux), gy(G, 0), gx(G, ux), gy(G, lf(ux)), GOLD, a, 5); seg(gx(G, ux) + 10, gy(G, 0), gx(G, ux) + 10, gy(G, lg(ux)), CYAN, a, 5);
  // 读数
  panel(1120, 300, 240, 200, GOLD, a);
  label('f(x) / g(x)', 1240, 335, 22, CR, a, { font: F_MATH });
  mathText((lf(ux) / lg(ux)).toFixed(3), 1240, 395, 40, GOLD, { align: 'center', alpha: a, upright: true, glow: 10 });
  label("f'(a) / g'(a) = 2", 1240, 455, 22, GRN, ap(t, 'C07', 0.6), { font: F_MATH, bold: true });
  if (t < S('C07')) richReveal([['f(a) = g(a) = 0  ⇒  ', CR], ['f(x)/g(x) = ', GOLD], ["f'(c)/g'(c)", GRN]], 980, 220, 28, t, P('C06', 0.4), { upright: true });
  else richReveal([['x → a  ⇒  c → a', SEC]], 980, 220, 30, t, P('C07', 0.1), { upright: true });
  label(z > 0.05 ? `放大 ×${(1 / dl).toFixed(0)}：两条曲线都像直线` : '', 850, 860, 24, CR, ap(t, 'C07', 0.3), { bold: true });
  // A148：上下分别求导
  if (t > S('G02') - 0.1) {
    const b = ap(t, 'G02', 0); ctx.save(); ctx.globalAlpha *= 0.92 * b; ctx.fillStyle = '#070a16'; ctx.fillRect(600, 160, 780, 780); ctx.restore();
    const sp = eIO(prog(t, P('G02', 0.2), 0.8));
    mathText('lim', 700, 470, 40, CR, { alpha: b, upright: true });
    mathText('f(x)', 850, 440 - sp * 50, 40, GOLD, { align: 'center', alpha: b, upright: true }); seg(790, 455, 910, 455, CR, b, 3); mathText('g(x)', 850, 510 + sp * 50, 40, CYAN, { align: 'center', alpha: b, upright: true });
    if (sp > 0.3) { arrowH(930, 1010, 440 - 50, GOLD, b); arrowH(930, 1010, 510 + 50 - 14, CYAN, b); label('求导', 970, 360, 22, GOLD, b, { bold: true }); label('求导', 970, 600, 22, CYAN, b, { bold: true }); }
    const q = ap(t, 'G02', 0.5); mathText('lim', 1040, 470, 40, CR, { alpha: q, upright: true }); mathText("f'(x)", 1180, 420, 40, GOLD, { align: 'center', alpha: q, upright: true }); seg(1120, 455, 1240, 455, CR, q, 3); mathText("g'(x)", 1180, 530, 40, CYAN, { align: 'center', alpha: q, upright: true });
    const w = ap(t, 'G02', 0.72); panel(760, 680, 460, 90, COL.red, w); richReveal([["不是  (f/g)'", RED]], 990, 738, 34, t, P('G02', 0.72), { upright: true }); crossMark(1180, 725, 30, COL.red, t, P('G02', 0.85));
  }
};

// ======================= 例题 =======================
SC.ex = t => {
  starfield(t); blueprint(0.4, 80);
  const cards = [['C08', [['lim', CR], ['  ln x / (x − 1)', RED], ['   (x → 1)', CR]], [["→  (1/x) / 1  →  1", GRN]]], ['C09', [['lim', CR], ['  sin x / (π − x)', RED], ['   (x → π)', CR]], [['→  cos x / (−1)  →  1', GRN]]]];
  cards.forEach(([id, l1, l2], i) => { if (t < S(id) - 0.1) return; const y = 220 + i * 170, a = ap(t, id, 0); panel(620, y - 50, 740, 145, i ? SQ.M.col : CYAN, a * (t > S('G03') ? 0.5 : 1)); richReveal(l1, 650, y + 5, 32, t, P(id, 0.1), { align: 'left', upright: true, alpha: t > S('G03') ? 0.5 : 1 }); richReveal(l2, 700, y + 65, 30, t, P(id, 0.55), { align: 'left', upright: true, alpha: t > S('G03') ? 0.5 : 1 }); checkMark(1320, y + 50, 30, GRN, t, P(id, 0.85)); });
  if (t > S('M03') - 0.1 && t < S('G03') + 0.3) {
    const m = ap(t, 'M03', 0) * fadeOut(t, S('G03'), 0.3); panel(900, 560, 460, 200, SQ.M.col, m); label('Gemini · 数值表', 1130, 590, 22, SQ.M.col, m, { bold: true });
    [['x', 'sin x / (π − x)'], ['3', '0.99666'], ['3.14', '0.9999996']].forEach(([u, v], j) => { const p = j ? ap(t, 'M03', 0.15 + 0.3 * (j - 1)) : m; mathText(u, 990, 640 + j * 40, 24, CR, { align: 'center', alpha: p * m, upright: true }); mathText(v, 1180, 640 + j * 40, 24, j ? GOLD : CR, { align: 'center', alpha: p * m, upright: true }); });
  }
  if (t > S('G03') - 0.1) {
    const g = ap(t, 'G03', 0); panel(620, 580, 740, 300, COL.red, g);
    richReveal([['只有 ', CR], ['0/0', GOLD], [' 和 ', CR], ['∞/∞', GOLD], [' 才能用', CR]], 990, 640, 32, t, P('G03', 0.05), { upright: true });
    richReveal([['lim (1 + x)/x  (x → 0)：', CR], ['1/0 型', RED]], 990, 710, 30, t, P('G03', 0.35), { upright: true });
    richReveal([['硬用洛必达 → 1', RED]], 820, 790, 30, t, P('G03', 0.6), { upright: true }); crossMark(970, 780, 26, COL.red, t, P('G03', 0.7));
    richReveal([['真实答案：∞', GRN]], 1170, 790, 30, t, P('G03', 0.8), { upright: true });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.42, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['lim', CR], ['  sin 2x / x', RED], ['   (x → 0)', CR]], 880, 300, 46, t, P('C11', 0.1), { upright: true });
  if (t > S('D02')) { slab('0/0 型', 760, 460, 30, t, P('D02', 0.05), { bg: GOLD, c: COL.ink }); richReveal([['→  2cos 2x / 1  →  ', GRN], ['2', GOLD]], 900, 580, 44, t, P('D02', 0.35), { upright: true }); burst(t, P('D02', 0.8), 1130, 565, GOLD, 80, 10); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C12', 0) * fadeOut(t, S('C13'), 0.4);
  if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; slab('柯西中值定理', 780, 440, 32, t, P('C12', 0.1), { bg: GOLD, c: COL.ink, rot: 0 }); slab('洛必达：上下分别求导', 1140, 440, 32, t, P('C12', 0.45), { bg: GRN, c: COL.ink, rot: 0 }); ctx.restore(); arrowH(880, 960, 440, CR, ga * ap(t, 'C12', 0.3)); }
  if (t > S('C13') - 0.1) { glowText('下一段：∞/∞ 与增长赛跑', CX, 500, 50, CR, t, P('C13', 0.15)); glowText('Llama 客串', CX, 590, 32, SQ.L.col, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 4 章 · P7 柯西中值定理与洛必达法则', '下一段：∞/∞ 与增长赛跑', [...CREDIT_BASE, 'Gemini 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
    'Gemini 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END, CREDIT_TM4('Gemini')]);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  ['M01', 'C01', 'D01', 'M02'].forEach(id => { s(id, 0.05, 'riser', 0.1); s(id, 0.05 + 1.3 / Math.max(1, D(id)), 'ding', 0.22); });
  s('C01', 0.3, 'buzz', 0.2); s('C02', 0.1, 'stamp', 0.32); s('C02', 0.5, 'shimmer', 0.18);
  s('C03', 0.5, 'type', 0.16); s('C04', 0.05, 'riser', 0.12); s('C04', 0.4, 'pluck', 0.2); s('C04', 0.7, 'type', 0.16);
  s('C05', 0.1, 'ding_hi', 0.26); s('C05', 0.5, 'type', 0.16); s('C05', 0.75, 'slam', 0.26); s('G01', 0.3, 'pop', 0.2);
  s('C06', 0.4, 'type', 0.16); s('C07', 0.05, 'warp', 0.2); s('C07', 0.6, 'ding', 0.24);
  s('G02', 0.0, 'swoosh_in', 0.2); s('G02', 0.2, 'zap', 0.16); s('G02', 0.5, 'pop', 0.22); s('G02', 0.72, 'buzz', 0.2); s('G02', 0.85, 'slap', 0.18);
  s('C08', 0.1, 'type', 0.16); s('C08', 0.55, 'pluck', 0.2); s('C08', 0.85, 'check', 0.26); s('C09', 0.1, 'type', 0.16); s('C09', 0.55, 'pluck', 0.2); s('C09', 0.85, 'check', 0.26);
  s('M03', 0.15, 'click', 0.22); s('M03', 0.45, 'click', 0.22); s('G03', 0.05, 'slam', 0.24); s('G03', 0.7, 'buzz', 0.2); s('G03', 0.8, 'ding', 0.22);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.05, 'pop', 0.22); s('D02', 0.8, 'ding_hi', 0.3);
  s('C12', 0.1, 'pop', 0.22); s('C12', 0.45, 'pop', 0.22); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
