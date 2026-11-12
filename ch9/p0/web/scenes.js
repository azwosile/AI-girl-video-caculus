// 第 9 章 P0《排队人数会爆吗？》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A383 排队：进 30 人/分、出 10%/分 · A384 dN/dt = 30 − 0.1N（进来的 − 出去的） · A385 错误的直线 30t 对比“越来越慢”
const SC = {};
const TITLES = [['queue', '排队人数'], ['model', '写成方程'], ['wrong', '直线？'], ['quiz', '随堂一题'], ['outro', '小结']];

const N0 = t => 300 * (1 - Math.exp(-0.1 * t));
const G0 = { cx: 610, cy: 790, ux: 15, uy: 1.45, x0: 0, x1: 40, y0: 0, y1: 360 };
function axes0(a) {
  gAxes(G0, a * 0.75, { grid: false, ticks: { x: [[10, '10'], [20, '20'], [30, '30'], [40, '40']], y: [[100, '100'], [200, '200'], [300, '300']] } });
  label('t（分钟）', gx(G0, 40) + 4, G0.cy + 40, 22, CR, a * 0.8); label('N', gx(G0, 0) - 30, gy(G0, 350), 26, CR, a * 0.8, { bold: true });
}

// ======================= 排队（A383） =======================
SC.queue = t => {
  starfield(t); blueprint(0.3, 80);
  busyWin(1000, 300, 520, 150, 'DeepSeek', '服务器繁忙', t, P('D01', 0.05), { col: SQ.D.col, size: 32 });
  const n = 3 + 11 * clamp((t - S('D01')) / 6);
  queueMen(590, 640, 14, n, SQ.D.col, ap(t, 'D01', 0.1), { t, gap: 44 });
  label(`N = ${Math.round(n * 9)} 人`, 900, 700, 30, SQ.D.col, ap(t, 'D01', 0.2), { bold: true });
  if (t > S('Q01')) { arrow(540, 520, 640, 580, GOLD, ap(t, 'Q01', 0.3), 4); label('+30 人 / 分钟', 600, 490, 30, GOLD, ap(t, 'Q01', 0.3), { bold: true }); }
  if (t > S('Q02')) { arrow(1180, 580, 1080, 390, CYAN, ap(t, 'Q02', 0.3), 4); label('−10% × N / 分钟', 1060, 780, 30, CYAN, ap(t, 'Q02', 0.4), { bold: true }); }
};

// ======================= 写成方程（A384） =======================
SC.model = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['N(t) = ', CR], ['？', RED]], 870, 250, 44, t, P('C01', 0.1), { upright: true });
  if (t > S('C01')) richReveal([['dN/dt = ', GOLD], ['变化有多快', CR]], 870, 330, 34, t, P('C01', 0.5), { upright: true });
  if (t > S('C02')) {
    inOutCard(870, 470, 560, '30', '0.1N', t, P('C02', 0.1));
    goldBox(870, 610, 480, 80, 'dN/dt = 30 − 0.1N', 40, ap(t, 'C02', 0.55));
  }
  if (t > S('C03')) {
    label('未知：一个函数 N(t)', 760, 720, 28, RED, ap(t, 'C03', 0.1), { bold: true });
    label('方程里有它的导数', 1000, 770, 28, CYAN, ap(t, 'C03', 0.35), { bold: true });
    stampMark(1150, 610, 44, t, P('C03', 0.7), { text: '微分方程', col: GOLD, rot: -0.12 });
  }
};

// ======================= 直线？（A385） =======================
SC.wrong = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'D02', 0.05) * fadeOut(t, S('C04'), 0.4);
  if (a > 0) {
    axes0(a);
    gPlot(G0, x => 30 * x, RED, { a: a * (t > S('G01') ? 0.45 : 1), xa: 0, xb: 12, w: 4, p: prog(t, P('D02', 0.2), 0.8), dash: [10, 8] });
    label('N = 30t ？', gx(G0, 11) + 64, gy(G0, 330), 28, RED, a * ap(t, 'D02', 0.5), { bold: true });
    if (t > S('G01')) {
      crossMark(gx(G0, 11) + 150, gy(G0, 330), 20, RED, t, P('G01', 0.05));
      const pts = [[0, 0], [7, N0(7)], [18, N0(18)], [32, N0(32)]];
      pts.forEach(([x, y], i) => { const k = ap(t, 'G01', 0.2 + 0.15 * i); if (k <= 0) return; const m = 30 - 0.1 * y, d = 3.2;
        seg(gx(G0, x - d), gy(G0, y - m * d), gx(G0, x + d), gy(G0, y + m * d), GOLD, a * k, 4); glowDot(gx(G0, x), gy(G0, y), 7, GOLD, a * k);
        label(`斜率 ${Math.round(m)}`, gx(G0, x) + 30, gy(G0, y) + 30, 22, GOLD, a * k, { bold: true }); });
      label('队伍越长，涨得越慢', 960, 300, 32, CYAN, ap(t, 'G01', 0.75) * a, { bold: true });
    }
  }
  if (t > S('C04') - 0.1) {
    questionCard(870, 300, 600, 76, '问一', '队伍会无限变长吗？', t, P('C04', 0.05), { size: 30, col: RED });
    questionCard(870, 396, 600, 76, '问二', '10 分钟后 N = ？', t, P('C04', 0.35), { size: 30, col: GOLD });
    questionCard(870, 492, 600, 76, '问三', '何时 N = 200？', t, P('C04', 0.65), { size: 30, col: CYAN });
  }
  if (t > S('C05')) [['P2 看图', SQ.M.col], ['P3 估算', SQ.L.col], ['P7 精确解', SQ.N.col]].forEach(([s, c], i) => {
    const k = ap(t, 'C05', 0.15 + 0.2 * i); panel(640 + i * 200, 610, 170, 70, c, k); label(s, 725 + i * 200, 645, 28, c, k, { bold: true }); });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['dN/dt = 30 − 0.1N，', CR], ['N = ？ 时不变', GOLD]], 860, 220, 36, t, P('C07', 0.05), { upright: true });
  if (t > S('D03')) {
    richReveal([['30 = 0.1N  ⇒  ', CR], ['N = 300', GOLD]], 860, 285, 38, t, P('D03', 0.15), { upright: true });
    const a = ap(t, 'D03', 0.3); axes0(a * 0.9);
    gH(G0, 300, GOLD, a, { w: 4, dash: [12, 8] }); label('平衡：N = 300', gx(G0, 28), gy(G0, 300) + 30, 28, GOLD, a, { bold: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) {
    richReveal([['微分方程：', CR], ['变化有多快', GOLD]], CX, 360, 48, t, P('C08', 0.05), { upright: true, alpha: ga });
    richReveal([['而不是 ', CR], ['现在是多少', CYAN]], CX, 460, 40, t, P('C08', 0.45), { upright: true, alpha: ga });
  }
  if (t > S('C09') - 0.1) { glowText('下一段：什么是微分方程', CX, 520, 50, CR, t, P('C09', 0.15)); glowText('Kimi 记住开头', CX, 610, 32, SQ.K.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 9 章 · P0 排队人数', '下一段：基本概念', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM9('千问')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.05, 'glitch', 0.24); s('D01', 0.2, 'pop', 0.16); s('Q01', 0.3, 'whoosh', 0.14); s('Q01', 0.35, 'ding', 0.18); s('Q02', 0.3, 'whoosh', 0.14); s('Q02', 0.4, 'ding_lo', 0.18);
  s('C01', 0.1, 'pop', 0.18); s('C01', 0.5, 'pop', 0.16); s('C02', 0.1, 'swell', 0.12); s('C02', 0.55, 'ding', 0.22); s('C03', 0.1, 'tick', 0.16); s('C03', 0.35, 'tick', 0.16); s('C03', 0.7, 'stamp', 0.26);
  s('D02', 0.2, 'riser', 0.14); s('G01', 0.05, 'buzz', 0.18); [0.2, 0.35, 0.5, 0.65].forEach(f => s('G01', f, 'marimba', 0.12));
  s('C04', 0.05, 'pop', 0.18); s('C04', 0.35, 'pop', 0.18); s('C04', 0.65, 'pop', 0.18); [0.15, 0.35, 0.55].forEach(f => s('C05', f, 'marimba', 0.14));
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.15, 'whoosh', 0.14); s('D03', 0.3, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C08', 0.45, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
