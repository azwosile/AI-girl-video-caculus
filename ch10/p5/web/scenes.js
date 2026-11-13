// 第 10 章 P5《旋转曲面面积》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.2。
// A449 曲线绕 x 轴转出奶茶杯，窄带 2πy·ds · A450 半圆转成珍珠：4πr² · A451 摆线拱旋转、“到轴的距离”绕 y 轴换成 x
const SC = {};
const TITLES = [['formula', '公式'], ['pearl', '珍珠'], ['cyc', '摆线拱'], ['quiz', '随堂一题'], ['outro', '小结']];

// 绕 x 轴旋转的曲面示意：沿曲线画 n 个椭圆截面（透视压扁），p 为旋转进度（0–1，画出的弧角）
function revX(G, fx, fy, ta, tb, n, col, a, p = 1, o = {}) {
  if (a <= 0) return; const sq = o.sq ?? 0.28;
  for (let i = 0; i <= n; i++) { const s = ta + (tb - ta) * i / n, X = gx(G, fx(s)), R = Math.abs(fy(s)) * G.uy; if (R < 0.5) continue;
    ctx.save(); ctx.globalAlpha *= a * 0.55; ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(X, G.cy, R * sq, R, 0, -Math.PI / 2, -Math.PI / 2 + TAU * p); ctx.stroke(); ctx.restore(); }
  // 下半轮廓（镜像）
  if (p > 0.45) { ctx.save(); ctx.globalAlpha *= a * Math.min(1, (p - 0.45) * 3); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const s = ta + (tb - ta) * i / 120; ctx[i ? 'lineTo' : 'moveTo'](gx(G, fx(s)), G.cy + Math.abs(fy(s)) * G.uy); } ctx.stroke(); ctx.restore(); }
}
function band(G, fx, fy, s, ds, col, a) {
  if (a <= 0) return; const X0 = gx(G, fx(s)), X1 = gx(G, fx(s + ds)), R0 = Math.abs(fy(s)) * G.uy, R1 = Math.abs(fy(s + ds)) * G.uy;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.5); ctx.strokeStyle = col; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(X0, G.cy, R0 * 0.28, R0, 0, -Math.PI / 2, Math.PI / 2); ctx.lineTo(X1, G.cy + R1); ctx.ellipse(X1, G.cy, R1 * 0.28, R1, 0, Math.PI / 2, -Math.PI / 2, true); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}

// ======================= 公式（A449） =======================
const GF5 = { cx: 640, cy: 560, ux: 120, uy: 120, x0: -0.2, x1: 5.5, y0: -2, y1: 2 };
const fx5 = s => s, fy5 = s => 0.9 + 0.12 * s + 0.12 * Math.sin(1.5 * s);
SC.formula = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'Q01', 0), p = eIO(prog(t, P('Q01', 0.2), 1.8));
  seg(600, GF5.cy, 1340, GF5.cy, CR, a * 0.6, 2, [8, 6]); label('x 轴', 1330, GF5.cy + 30, 22, CR, a * 0.7);
  paramTrace(GF5, fx5, fy5, 0.3, 5, SQ.Q.col, { a, w: 4, dot: false });
  revX(GF5, fx5, fy5, 0.3, 5, 14, SQ.Q.col, a, p);
  if (t > S('C01')) { richReveal([['S = ∫ ', CR], ['2πy', GOLD], [' ds', CYAN]], 980, 230, 40, t, P('C01', 0.1), { upright: true });
    const k = ap(t, 'C01', 0.4); band(GF5, fx5, fy5, 2.6, 0.35, GOLD, k); label('周长 2πy', gx(GF5, 2.8), gy(GF5, fy5(2.8)) - 40, 24, GOLD, k, { bold: true }); label('宽 ds', gx(GF5, 3.2) + 60, GF5.cy + 20, 24, CYAN, k, { bold: true }); }
  if (t > S('C02')) goldBox(980, 860, 560, 66, 'ds = √((dx/dt)² + (dy/dt)²) dt', 30, ap(t, 'C02', 0.2));
};

// ======================= 珍珠（A450） =======================
const GP5 = { cx: 880, cy: 560, ux: 190, uy: 190, x0: -1.4, x1: 1.4, y0: -1.3, y1: 1.3 };
SC.pearl = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C03', 0); seg(600, GP5.cy, 1200, GP5.cy, CR, a * 0.6, 2, [8, 6]);
  richReveal([['x = r cos t，y = r sin t，', CR], ['0 ≤ t ≤ π', CYAN]], 980, 230, 32, t, P('C03', 0.05), { upright: true });
  paramTrace(GP5, Math.cos, Math.sin, 0, Math.PI, SQ.Q.col, { a, w: 5, p: prog(t, P('C03', 0.2), 1), arrows: [1.5] });
  const p = eIO(prog(t, P('C03', 0.6), 1.6)); revX(GP5, Math.cos, Math.sin, 0.05, Math.PI - 0.05, 16, SQ.Q.col, a, p);
  if (t > S('C04')) { richReveal([['ds = r dt，S = ∫₀^π 2π · r sin t · r dt = ', CR], ['4πr²', GOLD]], 980, 300, 30, t, P('C04', 0.1), { upright: true });
    const k = ap(t, 'C04', 0.6); ctx.save(); ctx.globalAlpha *= k; const g = ctx.createRadialGradient(GP5.cx - 50, GP5.cy - 60, 10, GP5.cx, GP5.cy, 190); g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.5, hexA(SQ.Q.col, 0.25)); g.addColorStop(1, hexA(SQ.Q.col, 0.05)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(GP5.cx, GP5.cy, 190, 0, TAU); ctx.fill(); ctx.restore(); }
  if (t > S('Q02')) stampMark(1250, 520, 44, t, P('Q02', 0.2), { text: '球面 4πr²', col: GOLD, rot: -0.1 });
};

// ======================= 摆线拱（A451） =======================
const GC5 = { cx: 640, cy: 560, ux: 95, uy: 95, x0: -0.2, x1: 6.8, y0: -2.3, y1: 2.3 };
const cx5 = s => s - Math.sin(s), cy5 = s => 1 - Math.cos(s);
SC.cyc = t => {
  starfield(t); blueprint(0.34, 80);
  const pre = t < S('C06'), a = ap(t, 'C05', 0) * (pre ? 1 : 1 - 0.65 * ap(t, 'C06', 0));
  seg(600, GC5.cy, 1300, GC5.cy, CR, a * 0.6, 2, [8, 6]);
  paramTrace(GC5, cx5, cy5, 0, TAU, SQ.L.col, { a, w: 4, dot: false });
  revX(GC5, cx5, cy5, 0.05, TAU - 0.05, 18, SQ.L.col, a, eIO(prog(t, P('C05', 0.2), 1.6)));
  goldBox(980, 230, 360, 70, 'S = 64πr²/3', 34, ap(t, 'C05', 0.4));
  if (t > S('D01')) { label('绕 y 轴？', 1250, 330, 30, RED, ap(t, 'D01', 0.2), { bold: true }); }
  if (t > S('C06')) { const k = ap(t, 'C06', 0.1);
    panel(780, 690, 400, 140, GOLD, k); label('y = 到旋转轴的距离', 980, 725, 28, GOLD, k, { bold: true });
    richReveal([['绕 x 轴：2πy  ·  ', GOLD], ['绕 y 轴：2πx', CYAN]], 980, 790, 28, t, P('C06', 0.45), { upright: true });
    const X = gx(GC5, cx5(2)), Y = gy(GC5, cy5(2)); seg(X, Y, X, GC5.cy, GOLD, k, 4); label('y', X + 22, (Y + GC5.cy) / 2, 26, GOLD, k, { bold: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['r = 2 的球面：', CR], ['S = ？', GOLD]], 880, 240, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.2); ctx.save(); ctx.globalAlpha *= a; const g = ctx.createRadialGradient(840, 480, 10, 880, 540, 170); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(1, hexA(SQ.Q.col, 0.12)); ctx.fillStyle = g; ctx.strokeStyle = SQ.Q.col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(880, 560, 170, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  seg(880, 560, 1050, 560, GOLD, a, 3); label('2', 965, 535, 28, GOLD, a, { bold: true });
  if (t > S('D02')) { richReveal([['4π · 2² = ', CR], ['16π', GOLD]], 880, 310, 38, t, P('D02', 0.2), { upright: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) {
    richReveal([['S = ∫ 2π · ', CR], ['（到轴的距离）', GOLD], [' · ds', CYAN]], CX, 340, 44, t, P('C09', 0.05), { upright: true, alpha: ga });
    richReveal([['ds = √(x′² + y′²) dt', CYAN]], CX, 440, 40, t, P('C09', 0.45), { upright: true, alpha: ga });
  }
  if (t > S('C10') - 0.1) { glowText('下一段：Bézier 曲线', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('MiniMax 揭晓字体的秘密', CX, 610, 32, SQ.N.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 10 章 · P5 旋转曲面', '下一段：Bézier 曲线', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM10('千问')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Q01', 0.2, 'warp', 0.16); s('C01', 0.1, 'ding', 0.2); s('C01', 0.4, 'pop', 0.16); s('C02', 0.2, 'ding', 0.18);
  s('C03', 0.2, 'whoosh', 0.12); s('C03', 0.6, 'warp', 0.14); s('C04', 0.1, 'pop', 0.16); s('C04', 0.6, 'shimmer', 0.2); s('Q02', 0.2, 'stamp', 0.26);
  s('C05', 0.2, 'warp', 0.14); s('C05', 0.4, 'ding', 0.2); s('D01', 0.2, 'pop', 0.16); s('C06', 0.1, 'pop', 0.16); s('C06', 0.45, 'ding', 0.2);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.2, 'whoosh', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C09', 0.05, 'pop', 0.2); s('C09', 0.45, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
