// 第 8 章 P10《血流与心输出量》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.4。
// A368 血管纵剖面 + 抛物线速度剖面 · A369 横截面圆环微元 2πr dr · A370 染料浓度曲线下面积
const SC = {};
const TITLES = [['flow', '层流'], ['ring', '泊肃叶定律'], ['heart', '心输出量'], ['quiz', '随堂一题'], ['outro', '小结']];

const VX0 = 560, VX1 = 1180, VYC = 590, VR = 140;
function vesselP10(t, a, o = {}) {   // 纵剖面：管壁 + 流动粒子 + 速度箭头
  if (a <= 0) return; const R = o.R || VR;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(200,40,60,0.18)'; ctx.fillRect(VX0, VYC - R, VX1 - VX0, 2 * R); ctx.restore();
  seg(VX0, VYC - R, VX1, VYC - R, SQ.T.col, a, 5); seg(VX0, VYC + R, VX1, VYC + R, SQ.T.col, a, 5);
  // 粒子：速度 ∝ 1 − (r/R)²
  for (let i = 0; i < 26; i++) { const rr = ((i * 0.6180339) % 1) * 2 - 1, v = 1 - rr * rr, x = VX0 + (((i * 0.37 + t * 0.35 * v * (o.speed || 1)) % 1 + 1) % 1) * (VX1 - VX0);
    glowDot(x, VYC + rr * R * 0.95, 4, '#ff8a9a', a * 0.8); }
  if (o.profile) {   // 抛物线速度剖面箭头
    const xp = 700, q = o.profile; for (let k = -6; k <= 6; k++) { const rr = k / 6.6, v = 1 - rr * rr; if (v > 0.02) arrow(xp, VYC + rr * R, xp + v * 260, VYC + rr * R, CYAN, a * q, 2); }
    ctx.save(); ctx.globalAlpha *= a * q; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i <= 60; i++) { const rr = -1 + 2 * i / 60; ctx[i ? 'lineTo' : 'moveTo'](xp + (1 - rr * rr) * 260, VYC + rr * R); } ctx.stroke(); ctx.restore();
    seg(xp, VYC - R, xp, VYC + R, CR, a * q * 0.6, 2, [6, 5]);
  }
}

// ======================= 层流（A368） =======================
SC.flow = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'T01', 0.05); vesselP10(t, a, { profile: ap(t, 'C01', 0.4) });
  if (t > S('C01')) richReveal([['v(r) = ', CR], ['P(R² − r²) / (4ηl)', GOLD]], 870, 250, 34, t, P('C01', 0.15), { upright: true });
  if (t > S('C02')) { const q = ap(t, 'C02', 0.2); label('中心最快', 1040, VYC, 28, GOLD, q, { bold: true }); label('贴壁 v = 0', 760, VYC - VR - 30, 26, CYAN, q, { bold: true });
    label('抛物线剖面', 870, 320, 30, GOLD, ap(t, 'C02', 0.5), { bold: true }); }
};

// ======================= 圆环微元（A369） =======================
const RCX = 760, RCY = 600, RRad = 200;
SC.ring = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'G01', 0.05);
  ctx.save(); ctx.globalAlpha *= a; const gr = ctx.createRadialGradient(RCX, RCY, 0, RCX, RCY, RRad); gr.addColorStop(0, 'rgba(255,200,60,0.55)'); gr.addColorStop(1, 'rgba(200,40,60,0.15)');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(RCX, RCY, RRad, 0, 7); ctx.fill(); ctx.strokeStyle = SQ.T.col; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(RCX, RCY, RRad, 0, 7); ctx.stroke(); ctx.restore();
  label('越亮越快', RCX, RCY + RRad + 34, 24, GOLD, a * 0.8, { bold: true });
  // 一圈一圈的圆环
  const k = prog(t, P('G01', 0.3), 1.2); for (let i = 1; i <= 8; i++) if (i / 8 <= k + 1e-6) { ctx.save(); ctx.globalAlpha *= a * 0.5; ctx.strokeStyle = CR; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(RCX, RCY, RRad * i / 8, 0, 7); ctx.stroke(); ctx.restore(); }
  if (t > S('C03')) { const q = ap(t, 'C03', 0.1), r = RRad * 0.6, dr = 18;
    ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = CYAN; ctx.lineWidth = dr; ctx.shadowColor = CYAN; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(RCX, RCY, r, 0, 7); ctx.stroke(); ctx.restore();
    seg(RCX, RCY, RCX + r * Math.cos(-0.6), RCY + r * Math.sin(-0.6), GOLD, q, 3); label('r', RCX + 0.45 * r * Math.cos(-0.6) - 4, RCY + 0.45 * r * Math.sin(-0.6) - 18, 26, GOLD, q, { bold: true });
    label('dr', RCX + r + 34, RCY + 8, 24, CYAN, q, { bold: true });
    richReveal([['dA ≈ 2πr dr，  ', CR], ['dF = 2πr v(r) dr', GOLD]], 870, 250, 32, t, P('C03', 0.3), { upright: true }); }
  if (t > S('C04')) goldBox(1060, 400, 300, 60, 'F = πPR⁴/(8ηl)', 30, ap(t, 'C04', 0.2));
  if (t > S('T02')) label('R⁴ ！', 1060, 480, 46, RED, ap(t, 'T02', 0.2), { bold: true });
};

// ======================= 心输出量（A370） =======================
const CF10 = x => 0.25 * x * (10 - x);
const GH10 = { cx: 620, cy: 780, ux: 52, uy: 52, x0: 0, x1: 11, y0: 0, y1: 7 };
SC.heart = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C05', 0.05); gAxes(GH10, a * 0.75, { grid: false, ticks: { x: [[5, '5'], [10, '10']], y: [[6.25, '6.25']] } });
  label('t (s)', gx(GH10, 11) + 10, GH10.cy + 34, 22, CR, a * 0.8); label('c (mg/L)', GH10.cx, gy(GH10, 7) - 18, 22, CR, a * 0.8);
  gPlot(GH10, CF10, SQ.T.col, { a, xa: 0, xb: 10, w: 4, p: prog(t, P('C05', 0.3), 1.6) });
  if (t < S('C06')) label('注入 A = 5 mg', 1080, 420, 28, SQ.T.col, a, { bold: true });
  if (t > S('C06')) { gBetween(GH10, CF10, () => 0, 0, 10, ap(t, 'C06', 0.3), { col: 'rgba(255,111,168,0.35)', p: prog(t, P('C06', 0.3), 1.0) });
    richReveal([['F = ', CR], ['A / ∫ c(t) dt', GOLD]], 870, 250, 34, t, P('C06', 0.1), { upright: true }); }
  if (t > S('G02')) richReveal([['c(t) = ¼t(10 − t)，∫₀¹⁰ c dt = ', CR], ['125/3', GOLD]], 870, 310, 30, t, P('G02', 0.15), { upright: true });
  if (t > S('C07')) goldBox(1050, 400, 300, 60, '7.2 L/min', 32, ap(t, 'C07', 0.3));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['半径 R → R/2，流量 F → ', CR], ['？', GOLD]], 860, 260, 38, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.3);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = SQ.T.col; ctx.lineWidth = 5; ctx.fillStyle = 'rgba(200,40,60,0.2)';
  ctx.beginPath(); ctx.arc(720, 580, 150, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(1020, 580, 75, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  arrow(890, 580, 930, 580, CR, a, 3); label('R', 720, 760, 28, CR, a, { bold: true }); label('R/2', 1020, 760, 28, CR, a, { bold: true });
  if (t > S('D01')) { richReveal([['(1/2)⁴ = ', CR], ['1/16', GOLD]], 860, 340, 36, t, P('D01', 0.1), { upright: true }); stampMark(1020, 580, 50, t, P('D01', 0.3), { text: '1/16', col: RED, rot: -0.1 }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { richReveal([['圆环切片  ⇒  ', CR], ['F ∝ R⁴', GOLD]], CX, 340, 48, t, P('C10', 0.1), { upright: true, alpha: ga });
    for (let i = 1; i <= 5; i++) { ctx.save(); ctx.globalAlpha *= ga * 0.5; ctx.strokeStyle = i % 2 ? CYAN : GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, 540, 22 * i, 0, 7); ctx.stroke(); ctx.restore(); } }
  if (t > S('C11') - 0.1) { glowText('下一段：概率密度函数', CX, 520, 50, CR, t, P('C11', 0.15)); glowText('混元登场', CX, 610, 32, SQ.H.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 8 章 · P10 血流', '下一段：概率密度', [...CREDIT_BASE, ...CREDIT_T, ...CREDIT_END, CREDIT_TM8('MiMo')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('T01', 0.05, 'hum', 0.12); s('C01', 0.15, 'pop', 0.18); s('C01', 0.4, 'swell', 0.12); s('C02', 0.2, 'pop', 0.16); s('C02', 0.5, 'shimmer', 0.14);
  s('G01', 0.3, 'riser', 0.12); s('C03', 0.1, 'zap', 0.14); s('C03', 0.3, 'pop', 0.16); s('C04', 0.2, 'ding_hi', 0.24); s('T02', 0.2, 'impact', 0.2);
  s('C05', 0.3, 'swell', 0.12); s('C06', 0.1, 'pop', 0.16); s('C06', 0.3, 'shimmer', 0.14); s('G02', 0.15, 'pop', 0.16); s('C07', 0.3, 'ding', 0.24);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28); s('D01', 0.3, 'stamp', 0.24);
  s('C10', 0.1, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
