// 第 2 章 P7《导数：差商的极限》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A69 差商公式和图上的 h 同步收缩 · A70 切线方程的三个零件拼装 · A71 P0 测速仪回放、读数锁定（MiniMax 慢镜头）
const SC = {};
const TITLES = [['slow', '慢镜头：平均 → 瞬时'], ['def', '导数的定义'], ['tangent', '切线方程'], ['rate', '导数 = 变化率'], ['quiz', '随堂一题'], ['outro', '小结']];
const L10 = Math.log10;
const sb = t => 5 * t * t;

// ======================= slow：A71 =======================
const GS = { cx: 660, cy: 880, ux: 270, uy: 22, x0: 0, x1: 2.25, y0: 0, y1: 26 };
const HH = t => Math.pow(10, kf(t, 0, [[P('C02', 0.3), -1, 0.8], [P('N02', 0.18), -2, 0.6], [P('N02', 0.42), -3, 0.6]]));
function filmStrip(a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(0,0,0,0.55)';
  [180, 905].forEach(y => { ctx.fillRect(600, y, 780, 34); ctx.fillStyle = 'rgba(237,230,216,0.55)'; for (let x = 615; x < 1370; x += 42) ctx.fillRect(x, y + 9, 22, 16); ctx.fillStyle = 'rgba(0,0,0,0.55)'; });
  ctx.restore();
}
SC.slow = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('C01')) { kinetic('0 米 ÷ 0 秒 = ？', CX, 470, 66, t, P('D01', 0.2), { col: CR }); return; }
  const h = HH(t), ga = ap(t, 'C01', 0.15, 0.5);
  filmStrip(win(t, S('N01'), E('N02') + 0.2) * 0.9);
  gAxes(GS, ga, { grid: false, ticks: { x: [[1, '1'], [2, '2']], y: [[5, '5'], [20, '20']] }, xl: 't', yl: 's' });
  gPlot(GS, sb, RED, { a: ga });
  mathText('s = 5t^2', gx(GS, 1.55), gy(GS, 21), 32, RED, { align: 'right', glow: 10, alpha: ga, upright: true });
  const sa = ap(t, 'C01', 0.6);
  if (sa > 0) {
    const m = (sb(1 + h) - sb(1)) / h;
    ctx.save(); gClip(GS); gLine(GS, m, 1, 5, GS.x0, GS.x1, INV, sa, 3); ctx.restore();
    gDot(GS, 1, 5, GOLD, sa); gDot(GS, 1 + h, sb(1 + h), INV, sa);
    if (h > 0.02) { seg(gx(GS, 1), gy(GS, 5) + 30, gx(GS, 1 + h), gy(GS, 5) + 30, CYAN, sa, 3); label('h', gx(GS, 1 + h / 2), gy(GS, 5) + 56, 28, CYAN, sa, { font: F_MATH }); }
    panel(680, 230, 440, 120, CYAN, sa);
    const ht = h > 0.5 ? '1' : h > 0.05 ? '0.1' : h > 0.005 ? '0.01' : '0.001';
    mathText(`h = ${ht} s`, 710, 280, 32, CYAN, { alpha: sa, upright: true });
    mathText(`平均速度 = ${m.toFixed(h < 0.005 ? 3 : h < 0.05 ? 2 : 1)} m/s`, 710, 330, 32, GOLD, { alpha: sa, upright: true });
  }
  if (t > S('N01') - 0.1 && t < E('N02') + 0.3) {
    kinetic('咔！慢镜头 ×10', 830, 530, 44, t, P('N01', 0.05), { col: SQ.N.col, out: E('N01') });
    if (t > S('N02')) kinetic('×10', 900, 440, 54, t, P('N02', 0.18), { col: SQ.N.col, out: P('N02', 0.4) });
    if (t > P('N02', 0.42)) kinetic('×10', 900, 440, 54, t, P('N02', 0.42), { col: SQ.N.col, out: E('N02') + 0.1 });
  }
  if (t > S('N02')) stampMark(1260, 770, 54, t, P('N02', 0.75), { text: '锁定 10', rot: -0.15, col: GOLD, alpha: fadeOut(t, S('C03'), 0.4) });
  if (t > S('C03') - 0.1) {
    richReveal([['[5(1 + h)^2 − 5] / h', RED], [' = ', CR], ['10 + 5h', GOLD]], 900, 430, 36, t, P('C03', 0.1), { upright: true });
    richReveal([['h → 0  ⇒  ', CYAN], ['10', GOLD]], 900, 500, 36, t, P('C03', 0.6), { upright: true });
  }
  if (t > S('C04')) stampMark(1270, 770, 56, t, P('C04', 0.2), { text: '导数', rot: -0.15, col: GRN });
};

// ======================= def：A69 =======================
const GD = { cx: 660, cy: 880, ux: 130, uy: 70, x0: 0, x1: 5.2, y0: 0, y1: 6.6 };
const fd = x => 0.6 + 0.25 * x * x - 0.02 * x * x * x + 0.5 * Math.sin(x);
const dfd = x => 0.5 * x - 0.06 * x * x + 0.5 * Math.cos(x);
SC.def = t => {
  starfield(t); blueprint(0.45, 80);
  richReveal([["f′(a)", GRN], [' = lim_{h→0} ', CR], ['[f(a + h) − f(a)]', RED], [' / ', CR], ['h', CYAN]], CX, 250, 44, t, P('C05', 0.1), { upright: true });
  const ga = ap(t, 'C05', 0.4), a = 1.6;
  gAxes(GD, ga, { grid: false, ticks: { x: [[a, 'a']] } });
  gPlot(GD, fd, RED, { a: ga });
  const h = Math.max(0.0005, kf(t, 2.6, [[P('C06', 0.15), 0.02, 2.4]])), m = (fd(a + h) - fd(a)) / h;
  const sa = ap(t, 'C05', 0.55);
  if (sa > 0) {
    ctx.save(); gClip(GD); gLine(GD, m, a, fd(a), GD.x0, GD.x1, h < 0.05 ? GRN : INV, sa, 3.5); ctx.restore();
    gDot(GD, a, fd(a), GOLD, sa); gDot(GD, a + h, fd(a + h), INV, sa);
    gV(GD, a + h, INV, 0.4 * sa, { yb: fd(a + h), dash: [5, 6] });
    if (h > 0.15) { seg(gx(GD, a), gy(GD, 0) - 20, gx(GD, a + h), gy(GD, 0) - 20, CYAN, sa, 3); label('h', gx(GD, a + h / 2), gy(GD, 0) - 44, 28, CYAN, sa, { font: F_MATH }); }
    label(h < 0.05 ? '切线：斜率 = f′(a)' : '割线', 1180, 360, 32, h < 0.05 ? GRN : INV, sa * ap(t, 'C05', 0.6), { bold: true });
  }
};

// ======================= tangent：A70 =======================
const GT = { cx: 660, cy: 880, ux: 270, uy: 22, x0: 0, x1: 2.25, y0: 0, y1: 26 };
SC.tangent = t => {
  starfield(t); blueprint(0.45, 80);
  const parts = [['切点', GOLD, 700], ['斜率 k', GRN, 960], ['点斜式', CYAN, 1200]];
  const merge = eIO(prog(t, P('C08', 0.45), 0.5));
  parts.forEach(([s, c, x], k) => { const a = ap(t, 'C07', 0.15 + 0.15 * k) * (1 - merge); if (a <= 0) return; const xx = lerp(x, CX, merge); panel(xx - 105, 220, 210, 70, c, a); label(s, xx, 255, 28, c, a, { bold: true }); });
  if (t > S('C07') && merge < 1) richReveal([['s − s_0 = k (t − t_0)', CR]], CX, 350, 38, t, P('C07', 0.65), { alpha: 1 - merge, upright: true });
  if (t > S('C08') - 0.1) {
    const vals = [['(1, 5)', GOLD, 700], ['k = 10', GRN, 960]];
    vals.forEach(([s, c, x], k) => { const a = ap(t, 'C08', 0.08 + 0.15 * k) * (1 - merge); mathText(s, lerp(x, CX, merge), 320, 30, c, { align: 'center', alpha: a, upright: true }); });
    richReveal([['s − 5 = 10(t − 1)', GRN]], CX, 260, 46, t, P('C08', 0.7), { upright: true });
  }
  const ga = ap(t, 'D02', 0.05, 0.5);
  gAxes(GT, ga, { grid: false, ticks: { x: [[1, '1']], y: [[5, '5']] }, xl: 't', yl: 's' });
  gPlot(GT, sb, RED, { a: ga });
  if (ga > 0) gDot(GT, 1, 5, GOLD, ga);
  const la = ap(t, 'C08', 0.6);
  if (la > 0) { ctx.save(); gClip(GT); gLine(GT, 10, 1, 5, GT.x0, GT.x1, GRN, la, 3.5); ctx.restore(); }
};

// ======================= rate =======================
const RC = [['速度', 'm / s', '米每秒'], ['边际成本', '元 / 件', '多生产一件'], ['降温速度', '°C / min', '每分钟降几度']];
SC.rate = t => {
  starfield(t); blueprint(0.45, 80);
  label('导数 = 变化率', CX, 280, 46, GOLD, ap(t, 'C09', 0.05), { bold: true });
  RC.forEach(([h, u, s], k) => { const p = eBack(prog(t, P('C09', 0.15 + 0.12 * k), 0.4)); if (p <= 0) return; const x = 720 + 260 * k;
    ctx.save(); ctx.translate(x, 500); ctx.scale(p, p); panel(-115, -100, 230, 200, [CYAN, GRN, INV][k], 1); ctx.restore();
    label(h, x, 450, 34, [CYAN, GRN, INV][k], clamp(p), { bold: true }); mathText(u, x, 515, 30, CR, { align: 'center', alpha: clamp(p), upright: true }); label(s, x, 560, 22, CR, clamp(p) * 0.8); });
  if (t > P('C09', 0.6)) richReveal([['单位 = ', CR], ['y 的单位', GOLD], [' / ', CR], ['x 的单位', CYAN]], CX, 700, 36, t, P('C09', 0.6), { upright: true });
  if (t > S('N03')) stampMark(1250, 760, 56, t, P('N03', 0.3), { text: '过！', rot: -0.15, col: SQ.N.col });
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.45, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1260, 620);
  richReveal([['f(x) = x^2', RED], ['，', CR], ['f′(3) = ？', GRN]], CX - 60, 360, 48, t, P('C11', 0.1), { upright: true });
  if (t > S('N04')) {
    richReveal([['[(3 + h)^2 − 9] / h', RED], [' = ', CR], ['6 + h', GOLD]], CX - 60, 480, 40, t, P('N04', 0.1), { upright: true });
    richReveal([['h → 0  ⇒  ', CYAN], ['6', GOLD]], CX - 60, 570, 44, t, P('N04', 0.55), { upright: true });
    checkMark(CX + 120, 570, 34, GRN, t, P('N04', 0.75));
  }
};

// ======================= outro =======================
const CARDS = [['差商的极限', '0/0 的答案', GOLD], ['切线斜率', '割线转切线', GRN], ['瞬时变化率', '单位 = y / x', CYAN]];
SC.outro = t => {
  starfield(t); blueprint(0.45, 80);
  const ca = fadeOut(t, S('C13'), 0.4);
  CARDS.forEach(([h, s, c], k) => {
    const p = eBack(prog(t, P('C12', 0.1 + 0.25 * k), 0.4)) * ca; if (p <= 0) return; const x = 720 + 260 * k;
    ctx.save(); ctx.translate(x, 520); ctx.scale(p, p); panel(-115, -100, 230, 200, c, 1); ctx.restore();
    label(h, x, 495, 32, c, clamp(p), { bold: true }); label(s, x, 560, 24, CR, clamp(p));
  });
  if (t > S('C13') - 0.1) { glowText('下一段：导函数与可导性', CX, 500, 54, CR, t, P('C13', 0.15)); glowText('每一点的斜率连起来', CX, 590, 32, GRN, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 2 章 · P7 导数', '下一段：导函数与可导性', [...CREDIT_BASE,
    'MiniMax 娘立绘：依据 ZipZipPipe 设定（Pixiv 148186519）由 AI 生成的本课差分。',
    'MiniMax 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、DeepSeek、MiniMax 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.2, 'pop', 0.24); s('C01', 0.15, 'swoosh_in', 0.2); s('C01', 0.6, 'type', 0.16);
  s('N01', 0.03, 'stamp', 0.3); s('N01', 0.1, 'warp', 0.18); s('C02', 0.3, 'tick2', 0.22);
  s('N02', 0.03, 'stamp', 0.28); s('N02', 0.18, 'tick2', 0.22); s('N02', 0.42, 'tick2', 0.22); s('N02', 0.75, 'ding_hi', 0.3);
  s('C03', 0.1, 'type', 0.16); s('C03', 0.6, 'ding', 0.26); s('C04', 0.2, 'stamp', 0.3);
  s('C05', 0.1, 'type', 0.16); s('C06', 0.15, 'riser', 0.14); sfx(P('C06', 0.15) + 2.2, 'ding_hi', 0.28);
  [0.15, 0.3, 0.45].forEach(f => s('C07', f, 'pop', 0.22)); s('C07', 0.65, 'type', 0.16);
  s('D02', 0.1, 'swoosh_in', 0.2); s('C08', 0.45, 'whoosh', 0.2); s('C08', 0.7, 'ding_hi', 0.28);
  [0.15, 0.27, 0.39].forEach(f => s('C09', f, 'pop', 0.22)); s('N03', 0.03, 'stamp', 0.28); s('N03', 0.3, 'tinkle', 0.24);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('N04', 0.75, 'check', 0.34);
  [0.1, 0.35, 0.6].forEach(f => s('C12', f, 'pop', 0.24)); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
