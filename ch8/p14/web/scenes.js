// 第 8 章 P14《收束 · 奶茶小测》（2026-11-12）：数学画面全部原创 Canvas 绘制。片尾全员合影。
// A380 全章应用地图（中心 = 切微元 · 求和） · A381 奶茶小测两题 · A382 合影与第 9 章预告
const SC = {};
const TITLES = [['map', '全章地图'], ['q1', '小测 ①'], ['q2', '小测 ②'], ['next', '下一章预告'], ['group', '合影']];

// ======================= 全章地图（A380） =======================
const APPS14 = [['弧长 · 摆线', SQ.X.col, 'P1–P3'], ['极坐标面积', SQ.B.col, 'P4'], ['质心 · 形心', SQ.L.col, 'P5–P6'], ['帕普斯', SQ.N.col, 'P7'],
  ['引力 · 惯量', SQ.X.col, 'P8'], ['消费者剩余', SQ.Q.col, 'P9'], ['血流', SQ.T.col, 'P10'], ['概率分布', SQ.M.col, 'P11–P13']];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  const cx = 870, cy = 560, a0 = ap(t, 'C01', 0.05);
  APPS14.forEach(([s, c, tag], k) => {
    const q = -Math.PI / 2 + k * Math.PI / 4, x = cx + 275 * Math.cos(q), y = cy + 210 * Math.sin(q), p = eBack(prog(t, P('C01', 0.25 + 0.07 * k), 0.4)); if (p <= 0) return;
    seg(cx, cy, x, y, c, 0.35 * clamp(p), 2, [6, 5]);
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-88, -34, 176, 68, c, 1); ctx.restore();
    label(s, x, y - 6, 24, c, clamp(p), { bold: true }); label(tag, x, y + 20, 16, CR, clamp(p) * 0.7);
  });
  const hp = eBack(prog(t, P('C02', 0.1), 0.45));
  if (hp > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(hp, hp); panel(-110, -46, 220, 92, GOLD, 1, 'rgba(40,30,8,0.9)'); ctx.restore();
    label('∫ 切一小块', cx, cy - 14, 26, GOLD, clamp(hp), { bold: true }); label('→ 加起来', cx, cy + 20, 24, GOLD, clamp(hp), { bold: true }); }
  label('第 8 章 · 积分的更多应用', cx, 250, 40, GOLD, a0, { bold: true, glow: 14 });
  if (t > S('G01')) richReveal([['x̄ = ∫x f / ∫f   ⟺   μ = ∫ x f(x) dx', CYAN]], cx, 305, 28, t, P('G01', 0.3), { upright: true });
};

// ======================= 小测 ①：帕普斯 =======================
SC.q1 = t => {
  starfield(t); blueprint(0.4, 80);
  label('奶茶小测 ①', 870, 250, 40, SQ.Q.col, ap(t, 'Q01', 0.05), { bold: true, glow: 14 });
  if (t < S('Q02')) return;
  if (t < S('D01')) quizCountdown(t, 1300, 330);
  richReveal([['半径 1 的圆片，圆心离轴 3，', CR], ['V = ？', GOLD]], 870, 310, 32, t, P('Q02', 0.05), { upright: true });
  const a = ap(t, 'Q02', 0.2), p = t > S('D01') ? prog(t, P('D01', 0.05), 1.6) : 0;
  seg(830, 420, 830, 800, CR, a * 0.8, 2, [10, 6]);
  if (p <= 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,79,110,0.55)'; ctx.strokeStyle = SQ.N.col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(830 + 230, 620, 70, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    seg(830, 720, 1060, 720, CYAN, a, 3); label('3', 945, 746, 26, CYAN, a, { bold: true }); }
  else ringSweep(830, 620, 230, 70, p, SQ.N.col, a);
  if (t > S('D01')) { goldBox(1060, 410, 300, 58, 'π × 6π = 6π²', 30, ap(t, 'D01', 0.4)); checkMark(1240, 410, 18, GRN, t, P('D01', 0.85)); }
};

// ======================= 小测 ②：指数分布 =======================
const F14 = x => 0.2 * Math.exp(-0.2 * x);
const GQ14 = { cx: 620, cy: 790, ux: 28, uy: 1700, x0: 0, x1: 20.5, y0: 0, y1: 0.215 };
SC.q2 = t => {
  starfield(t); blueprint(0.4, 80);
  label('奶茶小测 ②', 870, 250, 40, SQ.Q.col, ap(t, 'Q03', 0.05), { bold: true, glow: 14 });
  if (t < S('G02')) quizCountdown(t, 1300, 330);
  richReveal([['μ = 5，', CR], ['P(T < 5) = ？', GOLD]], 870, 310, 32, t, P('Q03', 0.3), { upright: true });
  const a = ap(t, 'Q03', 0.4); gAxes(GQ14, a * 0.75, { grid: false, ticks: { x: [[5, '5'], [10, '10'], [20, '20']], y: [] } }); gPlot(GQ14, F14, SQ.M.col, { a, xa: 0, xb: 20, w: 4 });
  if (t > S('G02')) { gBetween(GQ14, F14, () => 0, 0, 5, ap(t, 'G02', 0.1), { col: 'rgba(255,200,60,0.6)' }); label('63%', gx(GQ14, 2.3), gy(GQ14, 0.06), 32, '#ffffff', ap(t, 'G02', 0.2), { bold: true });
    goldBox(1060, 430, 300, 58, '1 − e⁻¹ ≈ 63%', 28, ap(t, 'G02', 0.3)); }
  if (t > S('Q04')) { checkMark(1240, 430, 18, GRN, t, P('Q04', 0.1)); label('奶茶管够～', 1060, 510, 32, SQ.Q.col, ap(t, 'Q04', 0.3), { bold: true }); }
};

// ======================= 下一章预告 =======================
SC.next = t => {
  starfield(t); blueprint(0.4, 80);
  label('第 9 章 · 微分方程', 870, 260, 46, GOLD, ap(t, 'C03', 0.05), { bold: true, glow: 16 });
  [['人口增长', GRN], ['方向场', CYAN], ['捕食者与猎物', SQ.X.col]].forEach(([s, c], k) => {
    const p = eBack(prog(t, P('C03', 0.35 + 0.15 * k), 0.4)); if (p <= 0) return; const x = 650 + k * 220, y = 430;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-100, -50, 200, 100, c, 1); ctx.restore(); label(s, x, y, 26, c, clamp(p), { bold: true });
  });
  if (t > S('C03')) richReveal([['未知数：', CR], ['一个函数 y(t)', GOLD]], 870, 560, 34, t, P('C03', 0.75), { upright: true });
  if (t > S('D02')) busyWin(870, 680, 440, 120, '排队人数 N(t)', 'dN/dt = ？', t, P('D02', 0.2), { col: SQ.D.col, size: 30, spin: false });
};

// ======================= 合影（A382） =======================
const STARS14 = [[700, 170, 'P0 服务器'], [840, 240, 'P2 弧长'], [980, 160, 'P3 摆线'], [1120, 230, 'P4 极坐标'], [1260, 150, 'P5 质心'], [1400, 250, 'P7 帕普斯'], [1540, 160, 'P9 奶茶'], [1680, 250, 'P10 血流'], [1820, 170, 'P12 排队']];
const LINEUP14 = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_tea', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C04', 0.0, 0.6);
  STARS14.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C04', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS14[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C04') - 0.2;
  LINEUP14.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  burst(t, P('C04', 0.6), 110 + 130 * 5, 560, SQ.Q.col, 100);
  label('第 8 章 · 完', CX, 420, 54, GOLD, ap(t, 'C04', 0.3), { bold: true, glow: 18 });
  credits(t, E('C04') + 2.6, 'AI娘微积分课 · 第 8 章 · P14 收束：奶茶小测', '下一章：微分方程', [...CREDIT_BASE,
    '混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。',
    '例题与数据依据 Stewart《Calculus》第 7 版第 8 章，并补充同济版的引力、极坐标面积与参数方程弧长。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C04') - 0.2) lecturer(t, 'C', 255, -5, S('C04') - 0.3, { h: 710 }); };
SC.__noTag = E('C04') + 2.5;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C04') + 2.6); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  for (let k = 0; k < 8; k++) s('C01', 0.25 + 0.07 * k, 'pop', 0.12); s('C02', 0.1, 'impact', 0.2); s('G01', 0.3, 'shimmer', 0.14);
  s('Q01', 0.05, 'slam', 0.24); s('Q02', 0.05, 'whoosh', 0.16);
  ENTRIES.filter(e => e.k === 'beat' && /^q[12]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D01', 0.05, 'riser', 0.14); s('D01', 0.4, 'ding', 0.22); s('D01', 0.85, 'check', 0.3);
  s('Q03', 0.05, 'whoosh', 0.16); s('G02', 0.1, 'swell', 0.12); s('G02', 0.3, 'ding', 0.22); s('Q04', 0.1, 'check', 0.3); s('Q04', 0.3, 'sparkle', 0.24);
  s('C03', 0.05, 'swoosh_in', 0.18); [0, 1, 2].forEach(k => s('C03', 0.35 + 0.15 * k, 'pop', 0.18)); s('D02', 0.2, 'glitch', 0.16);
  s('C04', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C04') - 0.2 + 0.07 * k, 'pop', 0.16); s('C04', 0.6, 'sparkle', 0.3);
})();
finalize();
