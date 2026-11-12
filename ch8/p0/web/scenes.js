// 第 8 章 P0《服务器繁忙，请稍后再试》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A338 服务器繁忙弹窗与排队 · A339 等待时间直方图 → 概率密度曲线 · A340 本章应用地图
const SC = {};
const TITLES = [['busy', '服务器繁忙'], ['ask', '要等多久？'], ['idea', '概率 = 面积'], ['quiz', '随堂一题'], ['outro', '小结']];

const F0 = x => 0.2 * Math.exp(-0.2 * x);
const GP0 = { cx: 600, cy: 740, ux: 48, uy: 1400, x0: 0, x1: 12, y0: 0, y1: 0.24 };
const TK0 = { x: [[1, '1'], [5, '5'], [10, '10']] };

// ======================= 服务器繁忙（A338） =======================
SC.busy = t => {
  starfield(t); blueprint(0.3, 80);
  const n = 1 + 14 * clamp((t - S('D01')) / 3.5);
  queueMen(560, 800, 15, n, SQ.D.col, 1, { t, gap: 44 });
  label(`排队中：${Math.floor(n) * 137} 人`, 880, 840, 26, SQ.D.col, ap(t, 'D01', 0.1));
  busyWin(860, 430, 620, 230, 'DeepSeek', '服务器繁忙，请稍后再试', t, P('D01', 0.05), { shake: P('D01', 0.6) });
  if (t > S('Q01')) {
    busyWin(1000, 640, 460, 150, '千问 · 外包通道', '接单中～ 奶茶我请', t, P('Q01', 0.2), { col: SQ.Q.col, spin: false, size: 30 });
    arrow(760, 560, 900, 610, SQ.Q.col, ap(t, 'Q01', 0.5), 3);
  }
};

// ======================= 要等多久？直方图（A339） =======================
SC.ask = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['平均等待  ', CR], ['μ = 5 分钟', GOLD]], 870, 240, 40, t, P('C01', 0.2), { upright: true });
  if (t > S('C02')) {
    questionCard(870, 340, 520, 76, '问一', 'P(T ≤ 1) = ？', t, P('C02', 0.05), { size: 32, col: CYAN });
    questionCard(870, 436, 520, 76, '问二', 'P(T > 5) = ？', t, P('C02', 0.5), { size: 32, col: RED });
  }
  if (t > S('D02')) {
    mathText('= 1/5 ?', 1150, 352, 32, SQ.D.col, { alpha: ap(t, 'D02', 0.4), upright: true });
    if (t > S('G01')) crossMark(1250, 340, 22, RED, t, P('G01', 0.05));
  }
  if (t > S('G01')) {   // 等待时间直方图：短的多、长的少
    const a = ap(t, 'G01', 0.2), base = 800, X0 = 600, bw = 46;
    for (let i = 0; i < 12; i++) {
      const h = 220 * Math.exp(-0.2 * (i + 0.5)) / Math.exp(-0.1), k = clamp((t - P('G01', 0.25)) / 0.08 - i);
      if (k <= 0) continue; ctx.save(); ctx.globalAlpha *= a * k; ctx.fillStyle = hexA(CYAN, 0.35); ctx.strokeStyle = CYAN; ctx.lineWidth = 2;
      ctx.fillRect(X0 + i * bw, base - h * k, bw - 6, h * k); ctx.strokeRect(X0 + i * bw, base - h * k, bw - 6, h * k); ctx.restore();
    }
    seg(X0 - 10, base, X0 + 12 * bw + 10, base, CR, a * 0.7, 2);
    label('等待时间 →', X0 + 12 * bw - 60, base + 26, 22, CR, a * 0.8);
    label('等得短的多', 690, 548, 26, CYAN, ap(t, 'G01', 0.55), { bold: true });
    label('等得长的少', 1080, 700, 26, CYAN, ap(t, 'G01', 0.75), { bold: true });
  }
};

// ======================= 概率 = 面积 + 本章地图（A339–A340） =======================
const MAP0 = [['平衡点', SQ.L.col], ['省下的钱', SQ.Q.col], ['血管流量', SQ.T.col], ['等待时间', SQ.D.col]];
SC.idea = t => {
  starfield(t); blueprint(0.35, 80);
  const ga = ap(t, 'C03', 0) * fadeOut(t, S('G02'), 0.4);
  if (ga > 0) {
    gAxes(GP0, ga * 0.75, { grid: false, ticks: TK0 });
    label('t（分钟）', gx(GP0, 12) + 10, gy(GP0, 0) + 46, 22, CR, ga * 0.8);
    gPlot(GP0, F0, CYAN, { a: ga * ap(t, 'C03', 0.2), xa: 0, xb: 12, w: 4 });
    mathText('f(t)', gx(GP0, 0.5), gy(GP0, 0.21), 28, CYAN, { alpha: ga * ap(t, 'C03', 0.4) });
    if (t > S('C04')) {
      gBetween(GP0, F0, () => 0, 0, 1, ga * ap(t, 'C04', 0.55), { col: 'rgba(255,200,60,0.55)', p: prog(t, P('C04', 0.55), 0.6) });
      richReveal([['P(T ≤ 1) = ', CR], ['这一段的面积', GOLD]], 1000, 300, 34, t, P('C04', 0.7), { upright: true, alpha: ga });
    }
    if (t > S('Q02')) gRects(GP0, F0, 0, 12, 24, 'M', SQ.Q.col, ga * ap(t, 'Q02', 0.1), { k: 24 * prog(t, P('Q02', 0.15), 1.2) });
    if (t > S('C05')) richReveal([['P(a ≤ T ≤ b) = ', CR], ['∫ₐᵇ f(t) dt', GOLD]], 1000, 380, 34, t, P('C05', 0.1), { upright: true, alpha: ga });
  }
  if (t > S('G02') - 0.1) {
    label('第 8 章：积分算“总量”与“平均”', 870, 260, 38, GOLD, ap(t, 'G02', 0), { bold: true });
    toolGrid(870, 500, MAP0, 2, t, MAP0.map((_, i) => P('G02', 0.15 + 0.17 * i)), { cw: 280, ch: 110, gap: 30, size: 32 });
    if (t > S('C06')) stampMark(1175, 520, 40, t, P('C06', 0.3), { text: 'P12', col: SQ.D.col, rot: -0.14 });
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['整条曲线下的面积  ', CR], ['∫₀^∞ f(t) dt = ？', GOLD]], 860, 260, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3); gAxes(GP0, a * 0.7, { grid: false, ticks: TK0 }); gPlot(GP0, F0, CYAN, { a, xa: 0, xb: 12, w: 4 });
  gBetween(GP0, F0, () => 0, 0, 12, a, { col: 'rgba(92,200,232,0.30)', p: prog(t, P('C08', 0.4), 1.4) });
  if (t > S('D03')) { richReveal([['∫₀^∞ f(t) dt = ', CR], ['1', GOLD]], 860, 340, 40, t, P('D03', 0.1), { upright: true }); label('所有可能加起来 = 100%', 1080, 470, 30, GOLD, ap(t, 'D03', 0.5), { bold: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) {
    richReveal([['概率 = ', CR], ['面积', GOLD]], CX, 330, 48, t, P('C09', 0.05), { upright: true, alpha: ga });
    richReveal([['平均 = ', CR], ['加权求和', GOLD]], CX, 430, 48, t, P('C09', 0.35), { upright: true, alpha: ga });
    richReveal([['都是 ', CR], ['∫', CYAN]], CX, 530, 48, t, P('C09', 0.65), { upright: true, alpha: ga });
  }
  if (t > S('C10') - 0.1) { glowText('下一段：速通弧长、侧面积与压力', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Kimi 过目不忘', CX, 610, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P0 服务器繁忙', '下一段：速通', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM8('千问')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.05, 'glitch', 0.26); s('D01', 0.6, 'buzz', 0.2); s('Q01', 0.2, 'pop', 0.22); s('Q01', 0.5, 'whoosh', 0.14);
  s('C01', 0.2, 'pop', 0.18); s('C02', 0.05, 'pop', 0.18); s('C02', 0.5, 'pop', 0.18); s('D02', 0.4, 'tick', 0.2); s('G01', 0.05, 'buzz', 0.18);
  for (let i = 0; i < 12; i++) sfx(P('G01', 0.25) + i * 0.08, 'marimba', 0.07);
  s('C03', 0.2, 'swell', 0.14); s('C04', 0.55, 'shimmer', 0.18); s('Q02', 0.15, 'riser', 0.14); s('C05', 0.1, 'ding', 0.18);
  MAP0.forEach((_, i) => s('G02', 0.15 + 0.17 * i, 'marimba', 0.14)); s('C06', 0.3, 'stamp', 0.26);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.1, 'whoosh', 0.14); s('D03', 0.5, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C09', 0.35, 'pop', 0.2); s('C09', 0.65, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
