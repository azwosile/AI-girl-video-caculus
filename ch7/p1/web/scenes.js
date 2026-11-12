// 第 7 章 P1《速通：基本积分表与两把老工具》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A293 公式墙逐条点亮 · A294 换元 / 分部双卡 · A295 三角代换三角形
const SC = {};
const TITLES = [['table', '基本积分表'], ['tools', '两把老工具'], ['trig', '三角代换'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 公式墙（A293） =======================
const ROWS = [
  ['K02', 0.08, '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C'], ['K02', 0.45, '∫ dx/x = ln|x| + C'], ['K02', 0.78, '∫ eˣ dx = eˣ + C'],
  ['K03', 0.1, '∫ sin x dx = −cos x + C'], ['K03', 0.3, '∫ cos x dx = sin x + C'], ['K03', 0.55, '∫ sec²x dx = tan x + C'], ['K03', 0.78, '∫ sec x tan x dx = sec x + C'],
  ['K04', 0.2, '∫ dx/(x²+a²) = (1/a) arctan(x/a) + C'], ['K04', 0.65, '∫ dx/√(a²−x²) = arcsin(x/a) + C']];
SC.table = t => {
  starfield(t); blueprint(0.35, 80);
  label('第 7 章 · 章首积分表', 860, 222, 36, SQ.K.col, ap(t, 'K01', 0.1), { bold: true });
  if (t < S('K02')) { const a = ap(t, 'K01', 0.3); panel(520, 290, 680, 470, SQ.K.col, a * 0.6); kinetic('过目不忘', 860, 525, 54, t, P('K01', 0.4), { col: SQ.K.col }); return; }
  panel(520, 268, 680, 520, SQ.K.col, 0.7);
  ROWS.forEach(([id, f, s], i) => {
    const t0 = P(id, f), a = clamp(prog(t, t0, 0.3)); if (a <= 0) return; const y = 310 + i * 54, glow = 1 - clamp(prog(t, t0 + 0.3, 0.8));
    if (glow > 0) { ctx.fillStyle = hexA(SQ.K.col, 0.22 * glow); ctx.fillRect(530, y - 25, 660, 46); }
    label(`${i + 1}`, 556, y, 22, SQ.K.col, a, { bold: true });
    mathText(s, 590, y + 9, 25, CR, { alpha: a, upright: true });
  });
  if (t > S('D01')) stampMark(1110, 300, 52, t, P('D01', 0.15), { text: '全背下', col: SQ.K.col, rot: -0.15 });
};

// ======================= 换元 / 分部（A294） =======================
SC.tools = t => {
  starfield(t); blueprint(0.35, 80);
  kinetic('积分表 = 地基', 880, 235, 40, t, P('C01', 0.05), { col: SQ.K.col });
  const cards = [['C02', '换元', CYAN, '∫ f(g(x)) g′(x) dx = ∫ f(u) du', '链式法则 ↩', 'u = g(x)'], ['G01', '分部', GOLD, '∫ u dv = uv − ∫ v du', '乘积法则 ↩', '反 对 幂 三 指']];
  cards.forEach(([id, h, c, f, s, tip], k) => {
    const x = 700 + k * 360, p = eBack(prog(t, k ? P('G01', 0.05) : P('C01', 0.55), 0.45)); if (p <= 0) return; const a = clamp(p);
    ctx.save(); ctx.translate(x, 500); ctx.scale(p, p); panel(-165, -190, 330, 380, c, 1); ctx.restore();
    label(h, x, 350, 40, c, a, { bold: true });
    const ia = ap(t, id, 0.15); mathText(f, x, 470, 20, CR, { align: 'center', alpha: ia, upright: true });
    label(s, x, 540, 26, c, ia, {}); 
    const ta = ap(t, id, 0.6); ctx.save(); ctx.globalAlpha *= ta; ctx.fillStyle = hexA(c, 0.18); rr(x - 140, 590, 280, 56, 12); ctx.fill(); ctx.restore(); label(tip, x, 618, 28, CR, ta, { bold: true });
  });
  if (t > S('G01')) { const q = ap(t, 'G01', 0.7); ['反', '对', '幂', '三', '指'].forEach((s, i) => { const e = eOut(prog(t, P('G01', 0.7) + i * 0.08, 0.3)); glowDot(940 + i * 50, 680, 4 + 6 * e, GOLD, q * e); }); }
};

// ======================= 三角代换（A295） =======================
function triPic(x, y, w, h, labs, col, a) {      // 直角三角形：labs = [斜边, 对边, 邻边]
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = hexA(col, 0.12);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y - h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeRect(x + w - 14, y - 14, 14, 14); ctx.beginPath(); ctx.arc(x, y, 34, -Math.atan2(h, w), 0); ctx.stroke(); ctx.restore();
  label('θ', x + 52, y - 14, 22, col, a, {});
  mathText(labs[0], x + w / 2 - 24, y - h / 2 - 22, 22, CR, { align: 'right', alpha: a, upright: true });
  mathText(labs[1], x + w + 10, y - h / 2 + 8, 22, CR, { alpha: a, upright: true });
  mathText(labs[2], x + w / 2, y + 32, 22, CR, { align: 'center', alpha: a, upright: true });
}
SC.trig = t => {
  starfield(t); blueprint(0.35, 80);
  const C3 = [['√(a² − x²)', 'x = a sin θ', ['a', 'x', '√(a²−x²)'], SQ.R.col], ['√(a² + x²)', 'x = a tan θ', ['√(a²+x²)', 'x', 'a'], SQ.M.col], ['√(x² − a²)', 'x = a sec θ', ['x', '√(x²−a²)', 'a'], SQ.H.col]];
  C3.forEach(([r, s, labs, c], k) => {
    const x = 620 + k * 260, t0 = k < 2 ? P('C03', 0.12 + 0.42 * k) : P('G02', 0.1), a = clamp(prog(t, t0, 0.35));
    mathText(r, x, 280, 30, c, { align: 'center', alpha: a, upright: true });
    if (a > 0) arrow(x, 305, x, 345, c, a, 2.5);
    mathText(s, x, 385, 28, CR, { align: 'center', alpha: clamp(prog(t, t0 + 0.12, 0.3)), upright: true });
    triPic(x - 90, 640, 180, 150, labs, c, clamp(prog(t, t0 + 0.2, 0.4)));
  });
  if (t > S('K05')) kinetic('第 5 章 · 已收入工具箱', 880, 760, 36, t, P('K05', 0.1), { col: SQ.K.col });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C04', 0, 0.5) * 0.42, 78);
  if (t < S('C05')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C04') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 520, 100, '', '∫ x e^{x²} dx = ？', t, P('C05', 0.05), { size: 38 });
  if (t > S('D02')) {
    richReveal([['u = x²', CYAN], [',  du = 2x dx', CR]], 820, 520, 32, t, P('D02', 0.05), { upright: true });
    richReveal([['= ½ ∫ eᵘ du = ', CR], ['½ e^{x²} + C', GOLD]], 820, 600, 34, t, P('D02', 0.35), { upright: true });
    richReveal([['求导 ✓', GRN]], 820, 680, 28, t, P('D02', 0.7), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C07'), 0.4);
  if (fa > 0) toolGrid(CX, 470, [['积分表', SQ.K.col], ['换元', CYAN], ['分部', GOLD], ['三角代换', SQ.R.col]], 4, t, [0, 1, 2, 3].map(i => P('C06', 0.1) + i * 0.12), { cw: 200, ch: 90, size: 28, alpha: fa });
  if (t > S('C07') - 0.1) { glowText('下一段：分部积分进阶', CX, 520, 52, CR, t, P('C07', 0.15)); glowText('豆包挑战 · 表格法与循环', CX, 610, 32, SQ.B.col, t, P('C07', 0.45), { bold: false }); }
  credits(t, E('C07') + 0.38, 'AI娘微积分课 · 第 7 章 · P1 速通', '下一段：分部进阶', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM7('Kimi')]);
};

SC.__overlay = t => { if (t < E('C07') + 0.25) lecturer(t, 'C', 255, -5, E('C07') + 0.48, { h: 710 }); };
SC.__noTag = E('C07') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C07') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.1, 'shimmer', 0.16); ROWS.forEach(([id, f]) => s(id, f, 'marimba', 0.12)); s('D01', 0.15, 'stamp', 0.26);
  s('C01', 0.55, 'pop', 0.2); s('G01', 0.05, 'pop', 0.2); s('C02', 0.6, 'ding', 0.14); s('G01', 0.6, 'ding', 0.14);
  s('C03', 0.12, 'pop', 0.18); s('C03', 0.54, 'pop', 0.18); s('G02', 0.1, 'pop', 0.18); s('K05', 0.1, 'shimmer', 0.16);
  s('C04', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.35, 'ding_hi', 0.28); s('D02', 0.7, 'check', 0.22);
  s('C06', 0.1, 'marimba', 0.14); s('C07', 0.15, 'swell', 0.3);
})();
finalize();
