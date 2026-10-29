// 第 5 章 P10《不定积分与净变化定理》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A221 不定积分（曲线族）↔ 定积分（一个数） · A222 水箱进水速率与水位 · A223 v(t) 正负面积、来回的路线
const SC = {};
const TITLES = [['hook', '来回散步'], ['indef', '函数族 vs 数'], ['net', '净变化定理'], ['walk', '位移与路程'], ['quiz', '随堂一题'], ['outro', '小结']];
const V10 = t => t * t - t - 6, S10 = t => (t * t * t / 3 - t * t / 2 - 6 * t) - (1 / 3 - 1 / 2 - 6);
// 走廊：位置 s ∈ [−7.6, 0.6] → 屏幕 x
const HX = s => 1380 + (s - 0.4) * 100;
function corridor(t, a, y, tt) {
  seg(HX(-7.6), y, HX(0.6), y, hexA(CR, 0.6), a, 3); gDot({ cx: 0, cy: 0, ux: 1, uy: -1 }, HX(0), -y, CR, a, true); label('出发点', HX(0), y + 32, 20, CR, a);
  const n = 60; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = hexA(SQ.L.col, 0.8); ctx.lineWidth = 3; ctx.beginPath();
  for (let k = 0; k <= n; k++) { const u = 1 + (tt - 1) * k / n, yy = y - 14 - 22 * (k / n); k ? ctx.lineTo(HX(S10(u)), yy) : ctx.moveTo(HX(S10(u)), yy); } ctx.stroke(); ctx.restore();
  gDot({ cx: 0, cy: 0, ux: 1, uy: -1 }, HX(S10(tt)), -(y - 36), SQ.L.col, a);
}
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'L01', 0), tt = lerp(1, 4, clamp((t - P('L01', 0.15)) / 4));
  corridor(t, a, 520, tt);
  label('走了多远？', CX, 330, 40, SQ.L.col, ap(t, 'L01', 0.5), { bold: true });
};

SC.indef = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0);
  panel(540, 215, 440, 470, CYAN, a); panel(1020, 215, 440, 470, GOLD, ap(t, 'C01', 0.45));
  label('不定积分：一族函数', 760, 250, 26, CYAN, a, { bold: true }); label('定积分：一个数', 1240, 250, 26, GOLD, ap(t, 'C01', 0.45), { bold: true });
  const GL = { cx: 760, cy: 520, ux: 80, uy: 26, x0: -2.4, x1: 2.4, y0: -5.5, y1: 5.5 };
  for (let C = -4; C <= 4; C += 2) gPlot(GL, x => x * x * x / 3 - x + C * 0.8, C ? hexA(CYAN, 0.6) : CYAN, { a, xa: -2.3, xb: 2.3, w: C ? 2 : 3.5 });
  mathText('F(x) + C', 760, 640, 28, CYAN, { align: 'center', alpha: a, upright: true });
  const GR = { cx: 1080, cy: 600, ux: 110, uy: 20, x0: -0.1, x1: 3.3, y0: -7, y1: 7 }, b = ap(t, 'C01', 0.5), f = x => x * x * x - 6 * x;
  ctx.save(); gClip(GR); gArea(GR, f, 0, 3, b); gPlot(GR, f, RED, { a: b, xa: 0, xb: 3.1 }); ctx.restore(); gAxes(GR, b * 0.8, { grid: false });
  mathText('−6.75', 1240, 640, 32, GOLD, { align: 'center', alpha: b, upright: true });
  if (t > S('C02') - 0.1) { panel(560, 720, 880, 100, GRN, ap(t, 'C02', 0)); richReveal([['[x⁴/4 − 3x²]₀³ = 81/4 − 27 = ', CR], ['−6.75', GOLD]], CX, 770, 32, t, P('C02', 0.2), { upright: true }); checkMark(1400, 770, 18, GRN, t, P('C02', 0.8)); }
};

SC.net = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['∫ₐᵇ F′(x) dx = F(b) − F(a)', GOLD]], CX, 260, 40, t, P('C03', 0.1), { upright: true });
  label('变化率的积分 = 总变化量', CX, 330, 30, CYAN, ap(t, 'C03', 0.5), { bold: true });
  // 水箱
  const a = ap(t, 'C03', 0.3), X = 620, Y = 420, W = 240, H = 330, lv = clamp((t - P('C03', 0.4)) / 6) * 0.8;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = CR; ctx.lineWidth = 4; ctx.strokeRect(X, Y, W, H); ctx.fillStyle = hexA(CYAN, 0.5); ctx.fillRect(X + 2, Y + H - H * lv, W - 4, H * lv - 2);
  ctx.fillStyle = hexA(CYAN, 0.8); ctx.fillRect(X + W / 2 - 6, Y - 60, 12, 60 + H - H * lv); ctx.restore();
  label('速率 r(t)', X + W / 2, Y - 80, 24, CYAN, a, { bold: true }); label('水量 = ∫ r(t) dt', X + W / 2, Y + H + 36, 24, GOLD, a, { bold: true });
  if (t > S('G01') - 0.1) [['进水速率', '水量', CYAN], ['人口增长率', '人口变化', GRN], ['边际成本', '总成本', GOLD]].forEach(([u, v, c], i) => {
    const p = ap(t, 'G01', 0.1 + i * 0.25); if (p <= 0) return; const y = 470 + i * 100;
    label(u, 1030, y, 28, c, p, { bold: true }); arrowH(1120, 1240, y, c, p); label(v, 1340, y, 28, c, p, { bold: true }); });
};

const GW = { cx: 420, cy: 700, ux: 170, uy: 40, x0: 0.8, x1: 4.3, y0: -6.8, y1: 6.8 };
SC.walk = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C04', 0), abs = t > S('C05') ? eIO(prog(t, P('C05', 0.1), 1.2)) : 0;
  gAxes(GW, a, { grid: false, xl: 't', ticks: { x: [[1, '1'], [3, '3'], [4, '4']], y: [[6, '6'], [-6, '−6']] } });
  const fv = x => { const v = V10(x); return v < 0 ? lerp(v, -v, abs) : v; };
  gArea(GW, fv, 1, 4, a * 0.85); gPlot(GW, fv, RED, { a, xa: 1, xb: 4.2, w: 4 });
  mathText('v(t) = t² − t − 6', 1250, 470, 26, RED, { align: 'center', alpha: a, upright: true });
  if (abs < 0.5) { label('往回', gx(GW, 2), gy(GW, -2.5), 30, RED, a, { bold: true }); label('往前', gx(GW, 3.6), gy(GW, 1.5), 26, CYAN, a, { bold: true }); }
  corridor(t, a, 300, lerp(1, 4, clamp((t - P('C04', 0.2)) / 4)));
  richReveal([['位移 = ∫₁⁴ v dt = ', CR], ['−4.5 m', GOLD]], 1250, 530, 28, t, P('C04', 0.5), { upright: true });
  if (t > S('L02') - 0.1) label('停在出发点后面', HX(-4.5), 240, 24, SQ.L.col, ap(t, 'L02', 0.2), { bold: true });
  if (t > S('C05') - 0.1) richReveal([['路程 = ∫₁⁴ |v| dt = ', CR], ['61/6 ≈ 10.17 m', GOLD]], 1250, 590, 28, t, P('C05', 0.4), { upright: true });
};

SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r(t) = 2t 升/分，前 3 分钟流入？', CR]], 820, 320, 36, t, P('C07', 0.1), { upright: true });
  const G = { cx: 620, cy: 780, ux: 90, uy: 45, x0: 0, x1: 3.6, y0: 0, y1: 7 }, b = ap(t, 'C07', 0.5);
  gAxes(G, b, { grid: false, xl: 't', ticks: { x: [[3, '3']], y: [[6, '6']] } }); gPlot(G, x => 2 * x, CYAN, { a: b, xa: 0, xb: 3.4 });
  if (t > S('D01')) { gArea(G, x => 2 * x, 0, 3, ap(t, 'D01', 0.1)); richReveal([['∫₀³ 2t dt = ', CR], ['9 升', GOLD]], 1150, 640, 42, t, P('D01', 0.3), { upright: true }); }
};

SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C08', 0) * fadeOut(t, S('C09'), 0.4);
  if (ga > 0) { richReveal([['∫ f dx = F + C   （函数族）', CYAN]], CX, 350, 40, t, P('C08', 0.1), { upright: true, alpha: ga }); richReveal([['∫ₐᵇ f dx   （一个数）', GOLD]], CX, 430, 40, t, P('C08', 0.3), { upright: true, alpha: ga }); richReveal([['∫ₐᵇ F′ dx = F(b) − F(a)', GRN]], CX, 510, 40, t, P('C08', 0.6), { upright: true, alpha: ga }); }
  if (t > S('C09') - 0.1) { glowText('下一段：换元法 · 凑微分', CX, 500, 52, CR, t, P('C09', 0.15)); glowText('Kimi：一眼认出里面的导数', CX, 590, 32, SQ.K.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 5 章 · P10 不定积分与净变化定理', '下一段：换元法 · 凑微分', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM5('Llama')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('L01', 0.15, 'whoosh', 0.14); s('L01', 0.5, 'pop', 0.18);
  s('C01', 0.1, 'pop', 0.16); s('C01', 0.45, 'pop', 0.16); s('C02', 0.2, 'type', 0.14); s('C02', 0.8, 'check', 0.24);
  s('C03', 0.1, 'type', 0.14); s('C03', 0.4, 'hum', 0.12); [0.1, 0.35, 0.6].forEach(f => s('G01', f, 'pop', 0.16));
  s('C04', 0.2, 'whoosh', 0.14); s('C04', 0.5, 'ding', 0.2); s('L02', 0.2, 'pop', 0.16); s('C05', 0.1, 'warp', 0.18); s('C05', 0.4, 'ding_hi', 0.24);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.3, 'ding_hi', 0.28);
  s('C08', 0.1, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
