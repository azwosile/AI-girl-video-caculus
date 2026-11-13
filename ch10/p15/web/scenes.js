// 第 10 章 P15《收束 · 月下小测》（2026-11-13）：数学画面全部原创 Canvas 绘制。片尾全员合影。
// A479 全章地图（中心 = 点在运动） · A480 月下小测两题 + “曲线”二字缩回字幕 · A481 第 11 章预告（sin x 的多项式逼近）与合影
const SC = {};
const TITLES = [['map', '全章地图'], ['q1', '小测 ①'], ['q2', '小测 ②'], ['back', '回到开头'], ['next', '下一章预告'], ['group', '合影']];
const PAR15 = [['作图', 'P1'], ['切线', 'P3'], ['面积', 'P4'], ['弧长', 'P4'], ['旋转曲面', 'P5'], ['Bézier', 'P6'], ['曲率', 'P13']];
const POL15 = [['作图', 'P7'], ['切线', 'P9'], ['曲线族', 'P10'], ['面积', 'P11'], ['交点', 'P11'], ['弧长', 'P11']];
const CON15 = [['统一定义', 'P14'], ['离心率', 'P14'], ['椭圆 / 双曲线', 'P12'], ['行星轨道', 'P14']];
const box15 = (x, y, w, s, tag, col, p) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-w / 2, -21, w, 42, col, 1); ctx.restore(); label(s, x - 10, y + 8, 21, CR, clamp(p), { bold: true }); label(tag, x + w / 2 - 22, y + 7, 14, col, clamp(p) * 0.8); };

// ======================= 全章地图（A479） =======================
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const cx = 880, cy = 500;
  label('第 10 章 · 参数方程与极坐标', cx, 215, 40, GOLD, ap(t, 'C01', 0.05), { bold: true, glow: 14 });
  const hp = eBack(prog(t, P('C01', 0.35), 0.45));
  if (hp > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(hp, hp); panel(-115, -50, 230, 100, GOLD, 1, 'rgba(40,30,8,0.9)'); ctx.restore();
    label('曲线 =', cx, cy - 12, 26, GOLD, clamp(hp), { bold: true }); label('点在运动', cx, cy + 24, 26, GOLD, clamp(hp), { bold: true });
    const q = t * 1.4; glowDot(cx + 150 * Math.cos(q), cy - 75 * Math.sin(q), 6, CYAN, clamp(hp) * 0.8); }
  label('参数方程', 640, 300, 26, CYAN, ap(t, 'C02', 0.05), { bold: true }); label('极坐标', 1120, 330, 26, SQ.K.col, ap(t, 'G01', 0.05), { bold: true });
  PAR15.forEach(([s, tag], k) => { const p = eBack(prog(t, P('C02', 0.1 + 0.08 * k), 0.35)), y = 345 + k * 50; if (p > 0) seg(640 + 75, y, cx - 115, cy, CYAN, 0.3 * clamp(p), 1.5, [5, 5]); box15(640, y, 150, s, tag, CYAN, p); });
  POL15.forEach(([s, tag], k) => { const p = eBack(prog(t, P('G01', 0.08 + 0.06 * k), 0.35)), y = 375 + k * 50; if (p > 0) seg(1120 - 75, y, cx + 115, cy, SQ.K.col, 0.3 * clamp(p), 1.5, [5, 5]); box15(1120, y, 150, s, tag, SQ.K.col, p); });
  CON15.forEach(([s, tag], k) => { const p = eBack(prog(t, P('G01', 0.55 + 0.08 * k), 0.35)), x = 700 + k * 120 + (k > 1 ? 30 : 0), w = k === 2 ? 170 : 115; box15(x, 730, w, s, tag, SQ.X.col, p); });
};

// ======================= 小测 ①：椭圆 =======================
const GQ15 = { cx: 880, cy: 580, ux: 62, uy: 62, x0: -3.2, x1: 3.2, y0: -3.6, y1: 3.6 };
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  label('月下小测 ①', 880, 215, 40, SQ.K.col, ap(t, 'K01', 0.05), { bold: true, glow: 14 });
  ctx.save(); ctx.globalAlpha *= 0.5 * ap(t, 'K01', 0.1); glowDot(1330, 260, 26, '#F4EBC8', 1); ctx.restore();
  if (t < S('K02')) return;
  if (t < S('D01')) quizCountdown(t, 1300, 330);
  richReveal([['x = 2cos t，', CYAN], ['y = 3sin t', GOLD]], 880, 280, 32, t, P('K02', 0.05), { upright: true });
  const a = ap(t, 'K02', 0.2); gAxes(GQ15, a * 0.5, { grid: false });
  const tt = (t - S('K02')) * 1.2; paramTrace(GQ15, s => 2 * Math.cos(s), s => 3 * Math.sin(s), 0, Math.min(TAU, tt + 0.01), SQ.K.col, { a, w: 4 });
  glowDot(gx(GQ15, 2 * Math.cos(tt)), gy(GQ15, 3 * Math.sin(tt)), 8, GOLD, a);
  if (t > S('D01')) { const k = ap(t, 'D01', 0.2); ctx.save(); ctx.globalAlpha *= k * 0.35; ctx.fillStyle = SQ.K.col; ctx.beginPath(); ctx.ellipse(GQ15.cx, GQ15.cy, 2 * 62, 3 * 62, 0, 0, TAU); ctx.fill(); ctx.restore();
    goldBox(1200, 640, 300, 64, 'A = πab = 6π', 30, ap(t, 'D01', 0.5)); label('x²/4 + y²/9 = 1', 1200, 720, 26, CR, ap(t, 'D01', 0.3), { bold: true }); checkMark(1380, 640, 18, GRN, t, P('D01', 0.85)); }
};

// ======================= 小测 ②：抛物线 =======================
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  label('月下小测 ②', 880, 215, 40, SQ.K.col, ap(t, 'K03', 0.05), { bold: true, glow: 14 });
  if (t < S('G02')) quizCountdown(t, 1300, 330);
  richReveal([['r = 2 / (1 + cos θ)', GOLD]], 880, 280, 32, t, P('K03', 0.3), { upright: true });
  const a = ap(t, 'K03', 0.4), OX = 980, OY = 580; polarGrid(OX, OY, 260, 3, a * 0.5); glowDot(OX, OY, 9, GOLD, a);
  if (t > S('G02')) { const k = ap(t, 'G02', 0.2); ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = SQ.K.col; ctx.lineWidth = 5; ctx.shadowColor = SQ.K.col; ctx.shadowBlur = 10; ctx.beginPath(); let pen = false;
      for (let i = 0; i <= 600; i++) { const q = -Math.PI + TAU * i / 600, r = 2 / (1 + Math.cos(q)) * 65; if (!isFinite(r) || r > 330) { pen = false; continue; } const X = OX + r * Math.cos(q), Y = OY - r * Math.sin(q); pen ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); pen = true; } ctx.stroke(); ctx.restore();
    seg(OX + 130, 300, OX + 130, 860, CYAN, k, 3, [10, 7]); label('准线', OX + 170, 330, 22, CYAN, k, { bold: true });
    goldBox(700, 420, 240, 60, 'e = 1：抛物线', 26, ap(t, 'G02', 0.5)); }
  if (t > S('K04')) { checkMark(840, 420, 18, GRN, t, P('K04', 0.1)); ctx.save(); ctx.globalAlpha *= ap(t, 'K04', 0.3); glowDot(1330, 260, 30, '#F4EBC8', 1); ctx.restore(); }
};

// ======================= 回到开头：“曲线”缩回字幕 =======================
SC.back = t => {
  starfield(t); blueprint(0.3, 80);
  const k = eIO(prog(t, P('D02', 0.45), 1.1)), s = 0.36 + (0.03 - 0.36) * k, x = 600 + (930 - 600) * k, y = 700 + (885 - 700) * k, a = ap(t, 'D02', 0) * (1 - 0.6 * k);
  glyphDraw('曲', x, y, s, { a, fill: CR, fillA: 0.18, stroke: GOLD, w: 3 }); glyphDraw('线', x + 800 * s, y, s, { a, fill: CR, fillA: 0.18, stroke: GOLD, w: 3 });
  label('每一笔都是参数曲线', 980, 260, 32, GOLD, ap(t, 'D02', 0.1) * (1 - k), { bold: true });
};

// ======================= 下一章预告（A481a） =======================
const GN15 = { cx: 880, cy: 600, ux: 52, uy: 110, x0: -6.3, x1: 6.3, y0: -1.7, y1: 1.7 };
function taylor15(x, n) { let s = 0, term = x; for (let k = 0; k < n; k++) { s += term; term *= -x * x / ((2 * k + 2) * (2 * k + 3)); } return s; }
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 11 章 · 无穷数列与级数', 880, 230, 44, GOLD, ap(t, 'C03', 0.05), { bold: true, glow: 16 });
  const a = ap(t, 'C03', 0.2); gAxes(GN15, a * 0.5, { grid: false });
  gPlot(GN15, Math.sin, CR, { a: a * 0.8, w: 4, n: 300 });
  const n = 1 + Math.min(6, Math.floor(prog(t, P('C03', 0.35), E('C03') - P('C03', 0.35) + 0.5) * 7));
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.lineWidth = 3.5; ctx.shadowColor = GOLD; ctx.shadowBlur = 10; ctx.beginPath(); let pen = false;
  for (let i = 0; i <= 400; i++) { const x = -6.3 + 12.6 * i / 400, y = taylor15(x, n); if (Math.abs(y) > 1.7) { pen = false; continue; } pen ? ctx.lineTo(gx(GN15, x), gy(GN15, y)) : ctx.moveTo(gx(GN15, x), gy(GN15, y)); pen = true; } ctx.stroke(); ctx.restore();
  const terms = ['x', ' − x³/3!', ' + x⁵/5!', ' − x⁷/7!', ' + x⁹/9!', ' − …', ''].slice(0, n).join('');
  label(`sin x ≈ ${terms}`, 880, 320, 28, GOLD, a, { bold: true });
};

// ======================= 合影（A481b） =======================
const STARS15 = [[700, 170, 'P0 字形'], [840, 240, 'P2 摆线'], [980, 160, 'P6 Bézier'], [1120, 230, 'P8 玫瑰'], [1260, 150, 'P10 曲线族'], [1400, 250, 'P12 圆锥'], [1540, 160, 'P13 曲率'], [1680, 250, 'P14 轨道'], [1820, 170, 'P15 月下']];
const LINEUP15 = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_tea', 0], ['c_ok', 0], ['k_base', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C04', 0.0, 0.6);
  STARS15.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C04', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS15[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C04') - 0.2;
  LINEUP15.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C04', 0.6), 110 + 130 * 7, 560, SQ.K.col, 100);
  label('第 10 章 · 完', CX, 420, 54, GOLD, ap(t, 'C04', 0.3), { bold: true, glow: 18 });
  credits(t, E('C04') + 2.6, 'AI娘微积分课 · 第 10 章 · P15 收束：月下小测', '下一章：无穷数列与级数', [...CREDIT_BASE,
    '混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。',
    '例题与数据依据 Stewart《Calculus》第 7 版第 10 章（含两个实验课），并补充同济版的曲率、星形线与渐开线。',
    '字形轮廓：得意黑 Smiley Sans（atelier-anchor，SIL OFL 1.1），仅读取控制点作图。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C04') - 0.2) lecturer(t, 'C', 255, -5, S('C04') - 0.3, { h: 710 }); };
SC.__noTag = E('C04') + 2.5;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C04') + 2.6); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.35, 'impact', 0.2); for (let k = 0; k < 7; k++) s('C02', 0.1 + 0.08 * k, 'pop', 0.12); for (let k = 0; k < 6; k++) s('G01', 0.08 + 0.06 * k, 'pop', 0.12); for (let k = 0; k < 4; k++) s('G01', 0.55 + 0.08 * k, 'pluck', 0.1);
  s('K01', 0.05, 'shimmer', 0.2); s('K02', 0.05, 'whoosh', 0.16);
  ENTRIES.filter(e => e.k === 'beat' && /^q[12]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.2, 'swell', 0.14); s('D01', 0.5, 'ding', 0.22); s('D01', 0.85, 'check', 0.3);
  s('K03', 0.05, 'whoosh', 0.16); s('G02', 0.2, 'swell', 0.12); s('G02', 0.5, 'ding', 0.22); s('K04', 0.1, 'check', 0.3); s('K04', 0.3, 'shimmer', 0.24);
  s('D02', 0.1, 'sparkle', 0.18); s('D02', 0.45, 'warp', 0.16);
  s('C03', 0.05, 'swoosh_in', 0.18); for (let k = 1; k < 7; k++) s('C03', 0.35 + k * (E('C03') - P('C03', 0.35) + 0.5) / 7 / (E('C03') - S('C03')), 'tick', 0.12);
  s('C04', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C04') - 0.2 + 0.07 * k, 'pop', 0.16); s('C04', 0.6, 'sparkle', 0.3);
})();
finalize();
