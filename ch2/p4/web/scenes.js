// 第 2 章 P4《ε-δ：讨价还价的定义》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A56 ε 带与 δ 带联动（随 ε 缩小自动放大）· A57 出价 / 还价计分板 · A58 阶跃函数还不出价 · A59 M-δ 竖直带
const SC = {};
const TITLES = [['game', '你出 ε，我还 δ'], ['def', 'ε-δ 定义'], ['fail', '还不出价的时候'], ['inf', '无穷极限：M 与 δ'], ['history', '谁写下了这个定义'], ['quiz', '随堂一题'], ['outro', '小结']];
const L10 = Math.log10;
function hband(G, yc, h, col, a) { if (a <= 0) return; ctx.save(); gClip(G); gBand(G, G.x0, G.x1, yc - h, yc + h, hexA(col, 0.16), a); gH(G, yc + h, col, 0.8 * a, { dash: [8, 6] }); gH(G, yc - h, col, 0.8 * a, { dash: [8, 6] }); ctx.restore(); }
function vband(G, xc, w, col, a, ya, yb) { if (a <= 0) return; ctx.save(); gClip(G); gBand(G, xc - w, xc + w, ya ?? G.y0, yb ?? G.y1, hexA(col, 0.16), a); gV(G, xc - w, col, 0.8 * a, { dash: [8, 6], ya, yb }); gV(G, xc + w, col, 0.8 * a, { dash: [8, 6], ya, yb }); ctx.restore(); }

// ======================= game：A56 / A57 =======================
const EPS = t => Math.pow(10, kf(t, L10(1.5), [[P('Z02', 0.45), -1, 1.0], [P('Z03', 0.45), -3, 1.2]]));
const DEL = t => Math.pow(10, kf(t, L10(0.375), [[P('C03', 0.72), L10(0.025), 0.6], [P('C04', 0.25), L10(0.00025), 0.6]]));
const fl = x => 4 * x + 1;
function zoomG(z) { const uy = 50 * z, ux = 200 * z; return { cx: 960 - 2 * ux, cy: 620 + 9 * uy, ux, uy, x0: 2 - 330 / ux, x1: 2 + 330 / ux, y0: 9 - 270 / uy, y1: 9 + 280 / uy }; }
SC.game = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C01')) { kinetic('多近才算近？', CX, 470, 66, t, P('D01', 0.2), { col: CR }); return; }
  const eps = EPS(t), del = DEL(t), z = 1.5 / eps, G = zoomG(z);
  const ga = ap(t, 'C01', 0.1, 0.5);
  gAxes(G, ga * 0.7, { grid: false });
  hband(G, 9, eps, GOLD, ap(t, 'Z01', 0.2));
  gPlot(G, fl, RED, { a: ga, w: 4 });
  const da = ap(t, 'C02', 0.2);
  if (da > 0) {
    vband(G, 2, del, CYAN, da);
    const xs = [2 - del, 2 + del];   // δ 带内的那段函数：落在 ε 带里为绿，越出为红
    const inside = 4 * del <= eps * 1.0001;
    ctx.save(); gClip(G); glowPath(() => { ctx.moveTo(gx(G, xs[0]), gy(G, fl(xs[0]))); ctx.lineTo(gx(G, xs[1]), gy(G, fl(xs[1]))); }, inside ? GRN : RED, 7, da); ctx.restore();
  }
  gDot(G, 2, 9, GOLD, ga);
  label('(2, 9)', gx(G, 2) + 30, gy(G, 9) + 34, 26, GOLD, ga, { align: 'left', font: F_MATH });
  if (t > S('Z01')) label('ε', G.cx + G.ux * G.x1 - 30, gy(G, 9 + eps) - 22, 34, GOLD, ap(t, 'Z01', 0.3), { font: F_MATH, bold: true });
  if (da > 0) label('δ', gx(G, 2 + del) + 22, gy(G, G.y0) - 30, 34, CYAN, da, { font: F_MATH, bold: true, align: 'left' });
  if (z > 1.5) label(`放大 ×${z < 100 ? z.toFixed(0) : Math.round(z / 10) * 10}`, 1340, 870, 26, CR, 0.75, { align: 'right' });
  // 计分板
  const sa = ap(t, 'Z01', 0.05);
  if (sa > 0) {
    panel(640, 205, 680, 84, GOLD, sa);
    const eTxt = t < P('Z02', 0.3) ? 'ε' : t < P('Z03', 0.3) ? 'ε = 0.1' : 'ε = 0.001';
    const dTxt = t < S('C02') ? '' : t < P('C03', 0.7) ? (t < S('Z02') ? 'δ' : 'δ = ？') : t < P('C04', 0.2) ? 'δ = 0.025' : 'δ = ε/4';
    label('GLM 出价', 720, 247, 26, SQ.Z.col, sa, { bold: true }); mathText(eTxt, 800, 257, 34, GOLD, { glow: 10, alpha: sa, upright: true });
    if (dTxt) { label('Claude 还价', 1075, 247, 26, SQ.C.col, ap(t, 'C02', 0.1), { bold: true }); mathText(dTxt, 1150, 257, 34, CYAN, { glow: 10, alpha: ap(t, 'C02', 0.1), upright: true }); }
  }
  if (t > S('C03')) richReveal([['|4x + 1 − 9| = ', CR], ['4', GOLD], ['|x − 2|', CYAN]], 980, 340, 34, t, P('C03', 0.1), { out: S('Z03'), upright: true });
  if (t > S('C04')) glowText('多小都还得出', 980, 340, 36, GRN, t, P('C04', 0.55));
};

// ======================= def =======================
const GD = { cx: 680, cy: 900, ux: 110, uy: 70, x0: 0, x1: 5.6, y0: 0, y1: 5.2 };
const fd = x => 1 + 0.55 * x + 0.25 * Math.sin(1.6 * x);
SC.def = t => {
  starfield(t); blueprint(0.45, 80);
  const pa = ap(t, 'C05', 0.05);
  if (pa > 0) {
    panel(640, 200, 680, 170, GOLD, pa);
    richReveal([['∀ ε > 0', GOLD], ['，', CR], ['∃ δ > 0', CYAN], ['：', CR]], 980, 252, 38, t, P('C05', 0.12), { upright: true });
    richReveal([['0 < |x − a| < δ', CYAN], ['  ⇒  ', CR], ['|f(x) − L| < ε', GOLD]], 980, 322, 38, t, P('C05', 0.4), { upright: true });
  }
  const ga = ap(t, 'C05', 0.3) * fadeOut(t, S('C06'), 0.4);
  if (ga > 0) {
    gAxes(GD, ga, { grid: false, ticks: { x: [[3, 'a']], y: [[fd(3), 'L']] } });
    const e = 0.55, d = kf(t, 0.9, [[P('C05', 0.6), 0.5, 0.6]]);
    hband(GD, fd(3), e, GOLD, ga); vband(GD, 3, d, CYAN, ga * ap(t, 'C05', 0.55));
    gPlot(GD, fd, RED, { a: ga }); gDot(GD, 3, fd(3), GOLD, ga, true);
  }
  if (t > S('C06') - 0.1) {
    const y = 560, a = ap(t, 'C06', 0.1);
    panel(700, y - 50, 180, 100, GOLD, a); label('先 ∀ε', 790, y, 40, GOLD, a, { bold: true });
    arrowH(895, 1060, y, CR, ap(t, 'C06', 0.25));
    panel(1080, y - 50, 180, 100, CYAN, ap(t, 'C06', 0.3)); label('再 ∃δ', 1170, y, 40, CYAN, ap(t, 'C06', 0.3), { bold: true });
    label('δ 可以跟着 ε 变', CX, 680, 32, CR, ap(t, 'C06', 0.45), { bold: true });
    label('第 1 章 · 量词游戏', CX, 780, 30, GRN, ap(t, 'C06', 0.7), { bold: true });
  }
};

// ======================= fail：A58 =======================
const GF = { cx: 980, cy: 820, ux: 150, uy: 400, x0: -2, x1: 2, y0: -0.3, y1: 1.35 };
SC.fail = t => {
  starfield(t); blueprint(0.45, 80);
  const ga = ap(t, 'Z04', 0.05, 0.5);
  gAxes(GF, ga, { grid: false, ticks: { y: [[1, '1'], [0.5, '0.5']] } });
  hband(GF, 0.5, 0.3, GOLD, ap(t, 'Z04', 0.6));
  if (t > P('Z04', 0.6)) label('ε = 0.3', gx(GF, 1.95), gy(GF, 0.8) - 20, 28, GOLD, ap(t, 'Z04', 0.6), { align: 'right', font: F_MATH });
  const d = t > S('C07') ? Math.pow(10, kf(t, L10(1.2), [[P('C07', 0.1), L10(0.5), 0.5], [P('C07', 0.3), L10(0.18), 0.5], [P('C07', 0.5), L10(0.06), 0.5]])) : 0;
  const da = ap(t, 'C07', 0.05);
  if (da > 0) vband(GF, 0, d, CYAN, da);
  gPlot(GF, () => 0, RED, { xa: GF.x0, xb: -0.005, a: ga, noHead: true }); gPlot(GF, () => 1, RED, { xa: 0, a: ga, noHead: true });
  if (da > 0) { ctx.save(); [[-d, -0.002, 0], [0, d, 1]].forEach(([a, b, y]) => glowPath(() => { ctx.moveTo(gx(GF, a), gy(GF, y)); ctx.lineTo(gx(GF, b), gy(GF, y)); }, INV, 7, da)); ctx.restore(); }
  gDot(GF, 0, 0, RED, ga, true); gDot(GF, 0, 1, RED, ga);
  gH(GF, 0.5, GOLD, 0.6 * ap(t, 'Z04', 0.4), { dash: [3, 6] });
  if (t > S('C07')) { label('0 和 1 都在带子外', gx(GF, -1), gy(GF, 1.15), 28, INV, ap(t, 'C07', 0.55), { bold: true }); stampMark(1250, 330, 50, t, P('C07', 0.8), { text: '不存在', rot: -0.15 }); }
};

// ======================= inf：A59 =======================
const GN = { cx: 700, cy: 880, ux: 300, uy: 45, x0: 0, x1: 2, y0: 0, y1: 12 };
const fi = x => 1 / ((x - 1) * (x - 1));
SC.inf = t => {
  starfield(t); blueprint(0.45, 80);
  const ga = ap(t, 'C08', 0.05, 0.5);
  gAxes(GN, ga, { grid: false, ticks: { x: [[1, '1']] } });
  gV(GN, 1, CR, 0.3 * ga, { dash: [4, 8] });
  gPlot(GN, fi, RED, { a: ga, xa: GN.x0, xb: 0.995, noHead: true }); gPlot(GN, fi, RED, { a: ga, xa: 1.005, noHead: true });
  const M = kf(t, 3, [[P('C09', 0.35), 6, 0.6], [P('C09', 0.62), 10, 0.6]]), d = 1 / Math.sqrt(M), ma = ap(t, 'C08', 0.5);
  if (ma > 0) { gH(GN, M, GOLD, ma, { w: 3 }); label(`M = ${M.toFixed(1)}`, gx(GN, 1.98), gy(GN, M) - 24, 28, GOLD, ma, { align: 'right', font: F_MATH }); }
  const da = ap(t, 'C09', 0.2);
  if (da > 0) {
    vband(GN, 1, d * 0.97, CYAN, da, M, GN.y1);
    [[1 - d * 0.97, 0.995], [1.005, 1 + d * 0.97]].forEach(([a, b]) => gPlot(GN, fi, GRN, { xa: a, xb: b, a: da, w: 6, noHead: true }));
    label('δ', gx(GN, 1 + d) + 18, gy(GN, M) + 30, 30, CYAN, da, { font: F_MATH, bold: true, align: 'left' });
  }
  richReveal([['lim_{x→1} 1/(x − 1)^2 = ∞', RED]], 980, 240, 38, t, P('C08', 0.2), { upright: true });
  if (t > S('C08')) label('ε  →  M', 1250, 300, 30, GOLD, ap(t, 'C08', 0.55), { bold: true, font: F_MATH });
};

// ======================= history =======================
SC.history = t => {
  starfield(t); blueprint(0.45, 80);
  const y = 560, a = ap(t, 'R01', 0.05);
  seg(660, y, 1320, y, CR, 0.6 * a, 3);
  const node = (x, yr, name, sub, col, t0) => { const p = eBack(prog(t, t0, 0.4)); if (p <= 0) return; glowDot(x, y, 10 * clamp(p, 0, 1.2), col, clamp(p)); label(yr, x, y + 44, 30, col, clamp(p), { font: F_MATH, bold: true }); label(name, x, y - 90, 36, col, clamp(p), { bold: true }); label(sub, x, y - 44, 24, CR, clamp(p)); };
  node(780, '1821', '柯西（法国）', '《分析教程》用文字讲清极限', SQ.R.col, P('R01', 0.3));
  node(1180, '19 世纪中后期', '魏尔斯特拉斯（德国）', '写成 ε-δ 形式', CYAN, P('R02', 0.3));
  if (t > S('R02')) richReveal([['∀ε ∃δ', GOLD]], 1180, 700, 40, t, P('R02', 0.6), { upright: true });
  if (t > S('Z05')) {
    const p = eBack(prog(t, P('Z05', 0.2), 0.4)); ctx.save(); ctx.translate(980, 780); ctx.rotate(-0.06); ctx.scale(p, p);
    panel(-150, -45, 300, 90, SQ.Z.col, 1); ctx.restore();
    label('定义 · 下次涨价', 980, 780, 30, SQ.Z.col, clamp(p), { bold: true });
  }
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.45, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 620);
  richReveal([['lim_{x→3} (2x − 1) = 5', RED]], CX - 60, 360, 46, t, P('C11', 0.1), { upright: true });
  richReveal([['ε = 0.1', GOLD], ['，δ 最大 = ？', CYAN]], CX - 60, 450, 42, t, P('C11', 0.55), { upright: true });
  if (t > S('R03')) {
    richReveal([['|(2x − 1) − 5| = 2|x − 3| < 0.1', CR]], CX - 60, 560, 38, t, P('R03', 0.1), { upright: true });
    richReveal([['δ = 0.05', CYAN]], CX - 60, 650, 46, t, P('R03', 0.55), { upright: true });
    checkMark(CX + 140, 650, 36, GRN, t, P('R03', 0.75));
  }
};

// ======================= outro =======================
const CARDS = [['GLM 出 ε', '任意小', GOLD], ['Claude 还 δ', '总能找到', CYAN], ['还不出', '极限不存在', RED]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C13'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C12', 0.1 + 0.25 * k), 0.4)) * ca; if (p <= 0) return; const x = 720 + 260 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-115, -100, 230, 200, c, 1); ctx.restore();
    label(h, x, 495, 32, c, clamp(p), { bold: true }); label(s, x, 560, 24, CR, clamp(p));
  });
  if (t > S('C13') - 0.1) { glowText('下一段：连续与介值定理', CX, 500, 54, CR, t, P('C13', 0.15)); glowText('极限 = 函数值', CX, 590, 32, GOLD, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 2 章 · P4 讨价还价的定义', '下一段：连续与介值定理', [...CREDIT_BASE,
    'GLM（智谱）娘、Mistral 娘立绘：依据 ZipZipPipe 设定（Pixiv 148186519）由 AI 生成的本课差分。',
    '智谱、Mistral 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GLM、Mistral 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.2, 'pop', 0.26); s('C01', 0.1, 'swoosh_in', 0.2);
  s('Z01', 0.05, 'ding', 0.26); s('Z01', 0.2, 'swell', 0.18); s('C02', 0.1, 'ding_lo', 0.26); s('C02', 0.2, 'swell', 0.18);
  s('Z02', 0.3, 'stamp', 0.26); s('Z02', 0.45, 'warp', 0.18); s('C03', 0.1, 'type', 0.16); s('C03', 0.72, 'ding_hi', 0.28);
  s('Z03', 0.3, 'stamp', 0.28); s('Z03', 0.45, 'warp', 0.2); s('C04', 0.25, 'ding_hi', 0.28); s('C04', 0.55, 'sparkle', 0.24);
  s('C05', 0.12, 'type', 0.16); s('C05', 0.4, 'type', 0.16); s('C06', 0.1, 'pop', 0.24); s('C06', 0.3, 'pop', 0.24); s('C06', 0.7, 'bell_soft', 0.24);
  s('Z04', 0.05, 'swoosh_in', 0.2); s('Z04', 0.6, 'swell', 0.18); [0.1, 0.3, 0.5].forEach(f => s('C07', f, 'tick2', 0.22)); s('C07', 0.8, 'stamp', 0.32);
  s('C08', 0.2, 'type', 0.16); s('C08', 0.5, 'ding', 0.24); s('C09', 0.35, 'riser', 0.12); s('C09', 0.62, 'riser', 0.14);
  s('R01', 0.3, 'impact', 0.26); s('R02', 0.3, 'ding_hi', 0.26); s('Z05', 0.2, 'stamp', 0.28); s('Z05', 0.25, 'sparkle', 0.2);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('R03', 0.75, 'check', 0.34);
  [0.1, 0.35, 0.6].forEach(f => s('C12', f, 'pop', 0.24)); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
