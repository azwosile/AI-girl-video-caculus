// 第 9 章 P16《收束 · 奶茶小测》（2026-11-12）：数学画面全部原创 Canvas 绘制。片尾全员合影。
// A431 全章地图（中心 = 进来的 − 出去的） · A432 奶茶小测两题 · A433 合影与第 10 章预告
const SC = {};
const TITLES = [['map', '全章地图'], ['q1', '小测 ①'], ['q2', '小测 ②'], ['next', '下一章预告'], ['group', '合影']];

// ======================= 全章地图（A431） =======================
const ONE16 = [['方向场', 'P2'], ['欧拉法', 'P3'], ['分离变量', 'P4'], ['一阶线性', 'P7'], ['齐次', 'P10'], ['伯努利', 'P11']];
const TWO16 = [['降阶', 'P12'], ['特征方程', 'P13'], ['待定系数', 'P14'], ['振动', 'P15']];
const APPS16 = [['排队', SQ.D.col], ['混合', CYAN], ['冷却', SQ.Q.col], ['人口', SQ.B.col], ['电路', SQ.X.col], ['兔与狼', SQ.T.col], ['弹簧', GRN]];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const cx = 870, cy = 520;
  label('第 9 章 · 微分方程', cx, 215, 40, GOLD, ap(t, 'C01', 0.05), { bold: true, glow: 14 });
  const hp = eBack(prog(t, P('C01', 0.3), 0.45));
  if (hp > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(hp, hp); panel(-120, -50, 240, 100, GOLD, 1, 'rgba(40,30,8,0.9)'); ctx.restore();
    label('dy/dt =', cx, cy - 14, 26, GOLD, clamp(hp), { bold: true }); label('进来的 − 出去的', cx, cy + 22, 24, GOLD, clamp(hp), { bold: true }); }
  label('一阶', 640, 360, 26, CYAN, ap(t, 'C02', 0.05), { bold: true }); label('二阶', 1100, 390, 26, SQ.Z.col, ap(t, 'C02', 0.5), { bold: true });
  ONE16.forEach(([s, tag], k) => { const p = eBack(prog(t, P('C02', 0.08 + 0.06 * k), 0.35)); if (p <= 0) return; const x = 640, y = 410 + k * 55;
    seg(x + 70, y, cx - 120, cy, CYAN, 0.3 * clamp(p), 1.5, [5, 5]); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-75, -22, 150, 44, CYAN, 1); ctx.restore(); label(s, x - 8, y + 8, 22, CR, clamp(p), { bold: true }); label(tag, x + 52, y + 7, 15, CYAN, clamp(p) * 0.8); });
  TWO16.forEach(([s, tag], k) => { const p = eBack(prog(t, P('C02', 0.55 + 0.07 * k), 0.35)); if (p <= 0) return; const x = 1100, y = 440 + k * 60;
    seg(x - 70, y, cx + 120, cy, SQ.Z.col, 0.3 * clamp(p), 1.5, [5, 5]); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-75, -22, 150, 44, SQ.Z.col, 1); ctx.restore(); label(s, x - 8, y + 8, 22, CR, clamp(p), { bold: true }); label(tag, x + 52, y + 7, 15, SQ.Z.col, clamp(p) * 0.8); });
  APPS16.forEach(([s, c], k) => { const p = eBack(prog(t, P('G01', 0.1 + 0.08 * k), 0.35)); if (p <= 0) return; const x = 600 + k * 90, y = 285;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-40, -20, 80, 40, c, 1); ctx.restore(); label(s, x, y + 7, 20, c, clamp(p), { bold: true }); });
};

// ======================= 小测 ①：排队从 500 开始 =======================
const GQ16 = { cx: 600, cy: 760, ux: 13, uy: 0.72, x0: 0, x1: 45, y0: 0, y1: 560 };
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  label('奶茶小测 ①', 870, 230, 40, SQ.Q.col, ap(t, 'Q01', 0.05), { bold: true, glow: 14 });
  if (t < S('Q02')) return;
  if (t < S('D01')) quizCountdown(t, 1300, 330);
  richReveal([['dN/dt = 30 − 0.1N，', CR], ['N(0) = 500', GOLD]], 870, 300, 32, t, P('Q02', 0.05), { upright: true });
  const a = ap(t, 'Q02', 0.2);
  gAxes(GQ16, a * 0.75, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [40, '40']], y: [[300, '300'], [500, '500']] } });
  gH(GQ16, 300, GOLD, a * 0.6, { dash: [8, 6] });
  gPlot(GQ16, s => 300 * (1 - Math.exp(-0.1 * s)), SQ.D.col, { a: a * 0.35, w: 3 }); label('P0：从 0 开始', gx(GQ16, 30), gy(GQ16, 240), 20, SQ.D.col, a * 0.6);
  gDot(GQ16, 0, 500, GOLD, a);
  if (t > S('D01')) { const k = ap(t, 'D01', 0.1); gPlot(GQ16, s => 300 + 200 * Math.exp(-0.1 * s), SQ.Q.col, { a: k, w: 5, p: prog(t, P('D01', 0.1), 0.8) });
    goldBox(1020, 390, 360, 58, 'N = 300 + 200e^{−0.1t}', 28, ap(t, 'D01', 0.4)); checkMark(1220, 390, 18, GRN, t, P('D01', 0.85)); }
};

// ======================= 小测 ②：y = cos 3x =======================
const GQ16b = { cx: 600, cy: 600, ux: 95, uy: 120, x0: 0, x1: 6.2, y0: -1.3, y1: 1.3 };
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  label('奶茶小测 ②', 870, 230, 40, SQ.Q.col, ap(t, 'Q03', 0.05), { bold: true, glow: 14 });
  if (t < S('G02')) quizCountdown(t, 1300, 330);
  richReveal([['y″ + 9y = 0，', CR], ['y(0) = 1，y′(0) = 0', GOLD]], 870, 300, 32, t, P('Q03', 0.3), { upright: true });
  const a = ap(t, 'Q03', 0.4); gAxes(GQ16b, a * 0.75, { grid: false, ticks: { x: [[Math.PI, 'π'], [2 * Math.PI, '2π']], y: [[1, '1'], [-1, '−1']] } }); gDot(GQ16b, 0, 1, GOLD, a);
  if (t > S('G02')) { gPlot(GQ16b, x => Math.cos(3 * x), SQ.Q.col, { a: ap(t, 'G02', 0.2), w: 5, p: prog(t, P('G02', 0.3), 0.8), n: 300 });
    goldBox(1050, 400, 260, 58, 'y = cos 3x', 30, ap(t, 'G02', 0.6)); }
  if (t > S('Q04')) { checkMark(1210, 400, 18, GRN, t, P('Q04', 0.1)); label('奶茶管够～', 1050, 475, 32, SQ.Q.col, ap(t, 'Q04', 0.3), { bold: true }); }
};

// ======================= 下一章预告 =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 10 章 · 参数方程与极坐标', 870, 250, 44, GOLD, ap(t, 'C03', 0.05), { bold: true, glow: 16 });
  [['参数曲线', CYAN], ['极坐标', SQ.B.col], ['圆锥曲线', SQ.Z.col]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C03', 0.35 + 0.15 * k), 0.4)); if (p <= 0) return; const x = 650 + k * 220, y = 400;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-100, -50, 200, 100, c, 1); ctx.restore(); label(s, x, y + 8, 26, c, clamp(p), { bold: true });
  });
  if (t > S('D02')) {   // 摆线与心形线（第 8 章回顾）
    const k = ap(t, 'D02', 0.1), p = prog(t, P('D02', 0.1), 1.0);
    ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = SQ.X.col; ctx.lineWidth = 4; ctx.shadowColor = SQ.X.col; ctx.shadowBlur = 8; ctx.beginPath();
    for (let i = 0; i <= 200 * p; i++) { const th = 4 * Math.PI * i / 200, X = 560 + 22 * (th - Math.sin(th)), Y = 700 - 22 * (1 - Math.cos(th)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.stroke(); ctx.strokeStyle = SQ.B.col; ctx.shadowColor = SQ.B.col; ctx.beginPath();
    for (let i = 0; i <= 200 * p; i++) { const th = 2 * Math.PI * i / 200, r = 55 * (1 + Math.cos(th)), X = 1040 + r * Math.cos(th), Y = 630 - r * Math.sin(th); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.stroke(); ctx.restore();
    label('摆线（第 8 章）', 700, 740, 22, SQ.X.col, k); label('心形线（第 8 章）', 1060, 740, 22, SQ.B.col, k);
  }
};

// ======================= 合影（A433） =======================
const STARS16 = [[700, 170, 'P0 排队'], [840, 240, 'P2 方向场'], [980, 160, 'P3 欧拉法'], [1120, 230, 'P6 logistic'], [1260, 150, 'P8 电路'], [1400, 250, 'P9 兔与狼'], [1540, 160, 'P13 特征根'], [1680, 250, 'P15 弹簧'], [1820, 170, 'P16 奶茶']];
const LINEUP16 = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_tea', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C04', 0.0, 0.6);
  STARS16.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C04', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS16[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C04') - 0.2;
  LINEUP16.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C04', 0.6), 110 + 130 * 5, 560, SQ.Q.col, 100);
  label('第 9 章 · 完', CX, 420, 54, GOLD, ap(t, 'C04', 0.3), { bold: true, glow: 18 });
  credits(t, E('C04') + 2.6, 'AI娘微积分课 · 第 9 章 · P16 收束：奶茶小测', '下一章：参数方程与极坐标', [...CREDIT_BASE,
    '混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。',
    '例题与数据依据 Stewart《Calculus》第 7 版第 9 章与 17.3 节，并补充同济版的齐次、伯努利、可降阶与二阶常系数线性方程。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C04') - 0.2) lecturer(t, 'C', 255, -5, S('C04') - 0.3, { h: 710 }); };
SC.__noTag = E('C04') + 2.5;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C04') + 2.6); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.3, 'impact', 0.2); for (let k = 0; k < 6; k++) s('C02', 0.08 + 0.06 * k, 'pop', 0.12); for (let k = 0; k < 4; k++) s('C02', 0.55 + 0.07 * k, 'pop', 0.12); for (let k = 0; k < 7; k++) s('G01', 0.1 + 0.08 * k, 'pluck', 0.1);
  s('Q01', 0.05, 'slam', 0.24); s('Q02', 0.05, 'whoosh', 0.16);
  ENTRIES.filter(e => e.k === 'beat' && /^q[12]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.1, 'riser', 0.14); s('D01', 0.4, 'ding', 0.22); s('D01', 0.85, 'check', 0.3);
  s('Q03', 0.05, 'whoosh', 0.16); s('G02', 0.3, 'swell', 0.12); s('G02', 0.6, 'ding', 0.22); s('Q04', 0.1, 'check', 0.3); s('Q04', 0.3, 'sparkle', 0.24);
  s('C03', 0.05, 'swoosh_in', 0.18); [0, 1, 2].forEach(k => s('C03', 0.35 + 0.15 * k, 'pop', 0.18)); s('D02', 0.1, 'shimmer', 0.16);
  s('C04', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C04') - 0.2 + 0.07 * k, 'pop', 0.16); s('C04', 0.6, 'sparkle', 0.3);
})();
finalize();
