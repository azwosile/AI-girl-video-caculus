// 第 10 章 P13《曲率与曲率半径》（2026-11-13）：数学画面全部原创 Canvas 绘制。同济 3.7。
// A473 动点切线转角 / 弧长，实时读数 κ；直线 κ = 0；大小圆 κ = 1/R · A474 GLM 公式表 · A475 y = x² 密切圆滑动、椭圆两端密切圆、砂轮选半径
const SC = {};
const TITLES = [['idea', '弯多厉害'], ['table', '公式表'], ['ex', '密切圆'], ['app', '砂轮'], ['quiz', '随堂一题'], ['outro', '小结']];
const GI13 = { cx: 600, cy: 560, ux: 70, uy: 70, x0: 0, x1: 8.6, y0: -2.6, y1: 2.6 };
const f13 = x => 1.6 * Math.sin(0.8 * x), f13p = x => 1.28 * Math.cos(0.8 * x), f13pp = x => -1.024 * Math.sin(0.8 * x);

// ======================= 弯多厉害（A473） =======================
SC.idea = t => {
  starfield(t); blueprint(0.3, 80);
  const late = t > S('D01') - 0.05, a = ap(t, 'C01', 0) * (late ? fadeOut(t, S('D01') - 0.05, 0.4) : 1);
  if (a > 0) { gAxes(GI13, a * 0.5, { grid: false });
    paramTrace(GI13, s => s, f13, 0.1, 8.4, SQ.Z.col, { a, p: prog(t, P('C01', 0.05), 1.2), w: 4 });
    const x = 0.6 + 7.2 * (0.5 - 0.5 * Math.cos((t - S('C01')) * 0.45)), k = ap(t, 'C01', 0.4) * a;
    gTangent(GI13, x, f13(x), f13p(x), 120, GOLD, k); glowDot(gx(GI13, x), gy(GI13, f13(x)), 9, GOLD, k);
    const kap = Math.abs(f13pp(x)) / Math.pow(1 + f13p(x) ** 2, 1.5);
    richReveal([['往哪弯 → ', CR], ['弯多厉害？', GOLD]], 980, 220, 36, t, P('C01', 0.3), { upright: true, alpha: t > S('C02') ? 0 : a });
    if (t > S('C02')) { richReveal([['κ = |dα / ds|', GOLD]], 980, 220, 38, t, P('C02', 0.1), { upright: true, alpha: a });
      label(`κ = ${kap.toFixed(2)}`, 1300, 330, 30, GOLD, k * ap(t, 'C02', 0.4), { bold: true }); label('Δα：切线转角', 1300, 380, 22, CR, k * ap(t, 'C02', 0.5)); label('Δs：走过的弧长', 1300, 412, 22, CR, k * ap(t, 'C02', 0.6)); }
  }
  if (late) { const k = ap(t, 'D01', 0); seg(560, 380, 1200, 380, CYAN, k, 4); label('直线：κ = 0', 1300, 380, 26, CYAN, k, { bold: true });
    if (t > S('C03')) { const z = ap(t, 'C03', 0.2); [[700, 620, 150, 'R = 2', 'κ = ½'], [1080, 620, 75, 'R = 1', 'κ = 1']].forEach(([x, y, r, s1, s2], i) => { const zz = ap(t, 'C03', 0.2 + 0.25 * i);
      ctx.save(); ctx.globalAlpha *= zz; ctx.strokeStyle = i ? RED : SQ.Z.col; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
      label(s1, x, y + 8, 24, CR, zz, { bold: true }); label(s2, x, y + r + 36, 28, i ? RED : SQ.Z.col, zz, { bold: true }); });
      richReveal([['圆：κ = 1/R', GOLD]], 980, 220, 38, t, P('C03', 0.1), { upright: true }); } }
};

// ======================= 公式表（A474） =======================
SC.table = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'Z01', 0.1); panel(540, 270, 860, 420, SQ.Z.col, a); label('曲率公式表 · GLM 整理', 970, 312, 30, SQ.Z.col, a, { bold: true });
  seg(570, 340, 1370, 340, SQ.Z.col, a * 0.5, 2);
  const rows = [['显式 y = f(x)', 'κ = |y″| / (1 + y′^{2})^{3/2}', 'C04', 0.1], ['参数 (x(t), y(t))', 'κ = |x′y″ − x″y′| / (x′^{2} + y′^{2})^{3/2}', 'C05', 0.05], ['圆', 'κ = 1/R', 'Z01', 0.5], ['曲率半径', 'ρ = 1/κ', 'C05', 0.7]];
  rows.forEach(([n, f, id, fr], i) => { const k = t > S(id) ? ap(t, id, fr) : 0, y = 400 + i * 78;
    label(n, 690, y, 26, CR, k, { bold: true }); mathText(f, 830, y + 10, 30, i < 2 ? GOLD : CYAN, { alpha: k, upright: true }); });
};

// ======================= 密切圆（A475a） =======================
const GX13 = { cx: 880, cy: 740, ux: 110, uy: 110, x0: -2.4, x1: 2.4, y0: -0.2, y1: 3.8 };
const GE13 = { cx: 880, cy: 540, ux: 60, uy: 60, x0: -4, x1: 4, y0: -3, y1: 3 };
SC.ex = t => {
  starfield(t); blueprint(0.34, 80);
  const late = t > S('C08') - 0.05, a = ap(t, 'C06', 0) * (late ? fadeOut(t, S('C08') - 0.05, 0.4) : 1);
  if (a > 0) { gAxes(GX13, a * 0.5, { grid: false }); paramTrace(GX13, s => s, s => s * s, -1.9, 1.9, SQ.Z.col, { a, w: 4 });
    richReveal([['y = x²：κ = 2 / (1 + 4x²)^{3/2}', CR]], 980, 220, 30, t, P('C06', 0.05), { upright: true, alpha: a });
    const s = t < S('C07') ? 0 : 0.7 * Math.sin((t - S('C07')) * 0.9) ** 2 * Math.sign(Math.sin((t - S('C07')) * 0.45) || 1);
    const kap = paramOsc(GX13, u => u, u => u * u, s, GOLD, ap(t, 'C06', 0.3) * a);
    label(`κ = ${kap.toFixed(2)}`, 1290, 330, 30, GOLD, ap(t, 'C06', 0.3) * a, { bold: true }); label(`ρ = ${(1 / kap).toFixed(2)}`, 1290, 375, 30, CYAN, ap(t, 'C06', 0.3) * a, { bold: true });
    if (t > S('C06')) label('x = 1：κ ≈ 0.179', 1290, 430, 24, CR, ap(t, 'C06', 0.6) * a, { bold: true });
    if (t > S('C07')) label('密切圆', 1290, 480, 28, GOLD, ap(t, 'C07', 0.2) * a, { bold: true }); }
  if (late) { const k = ap(t, 'C08', 0); gAxes(GE13, k * 0.5, { grid: false }); paramTrace(GE13, s => 3 * Math.cos(s), s => 2.4 * Math.sin(s), 0, TAU, SQ.Z.col, { a: k, w: 4 });
    paramOsc(GE13, s => 3 * Math.cos(s), s => 2.4 * Math.sin(s), 0, GOLD, ap(t, 'C08', 0.15)); paramOsc(GE13, s => 3 * Math.cos(s), s => 2.4 * Math.sin(s), Math.PI / 2, CYAN, ap(t, 'C08', 0.35), { dash: [8, 6] });
    label('κ = a/b²（最弯）', 1300, 330, 26, GOLD, ap(t, 'C08', 0.15), { bold: true }); label('κ = b/a²', 1300, 375, 26, CYAN, ap(t, 'C08', 0.35), { bold: true });
    richReveal([['x = a cos t，y = b sin t', CR]], 980, 220, 30, t, P('C08', 0.05), { upright: true }); label('摆线拱顶：ρ = 4r', 1300, 440, 24, CR, ap(t, 'C08', 0.75), { bold: true }); }
};

// ======================= 砂轮（A475b） =======================
const GA13 = { cx: 880, cy: 760, ux: 95, uy: 95, x0: -3.4, x1: 3.4, y0: -0.3, y1: 4.4 };
SC.app = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'Z02', 0), trap = t > S('C09') - 0.05, aa = a * (trap ? 0.3 : 1);
  ctx.save(); ctx.globalAlpha *= aa; ctx.fillStyle = 'rgba(160,150,135,0.22)'; ctx.beginPath(); ctx.moveTo(gx(GA13, -3.2), gy(GA13, -0.3)); for (let i = 0; i <= 80; i++) { const x = -3.2 + 6.4 * i / 80; ctx.lineTo(gx(GA13, x), gy(GA13, 0.4 * x * x)); } ctx.lineTo(gx(GA13, 3.2), gy(GA13, -0.3)); ctx.closePath(); ctx.fill(); ctx.restore();
  paramTrace(GA13, s => s, s => 0.4 * s * s, -3.2, 3.2, SQ.Z.col, { a: aa, w: 4 }); label('工件', gx(GA13, 2.6), gy(GA13, 0.6), 24, CR, aa, { bold: true });
  const k1 = ap(t, 'Z02', 0.5) * (trap ? 0.3 : 1), r1 = 1.25 * GA13.ux; ctx.save(); ctx.globalAlpha *= k1; ctx.strokeStyle = GRN; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(gx(GA13, 0), gy(GA13, 1.25), r1, 0, TAU); ctx.stroke(); ctx.restore();
  label('ρ = 1.25 ✓', gx(GA13, 0), gy(GA13, 1.25), 26, GRN, k1, { bold: true });
  const k2 = ap(t, 'Z02', 0.75) * (trap ? 0.3 : 1), r2 = 2 * GA13.ux; ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); ctx.beginPath(); ctx.arc(gx(GA13, 0), gy(GA13, 2), r2, 0, TAU); ctx.stroke(); ctx.restore();
  label('太大：磨坏两侧 ✗', gx(GA13, 0), gy(GA13, 4.15), 26, RED, k2, { bold: true });
  richReveal([['y = 0.4x²：κ(0) = 0.8，', CR], ['ρ = 1.25', GOLD]], 980, 220, 32, t, P('Z02', 0.2), { upright: true, alpha: trap ? 0 : 1 });
  if (trap) { const z = ap(t, 'C09', 0); panel(560, 300, 820, 200, RED, z); label('y = x² 在 x = 1：', 760, 360, 28, CR, z, { bold: true }); label('y″ = 2，但 κ ≈ 0.18', 1110, 360, 28, GOLD, z, { bold: true });
    mathText('κ = |y″| / (1 + y′^{2})^{3/2}', 970, 440, 34, RED, { align: 'center', alpha: z, upright: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.42, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['R = 5：', CR], ['κ = ？', GOLD]], 880, 240, 38, t, P('C11', 0.05), { upright: true });
  const a = ap(t, 'C11', 0.2); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = SQ.Z.col; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(880, 580, 200, 0, TAU); ctx.stroke(); ctx.restore();
  seg(880, 580, 1080, 580, GOLD, a, 3); label('5', 980, 560, 26, GOLD, a, { bold: true });
  if (t > S('D02')) { goldBox(880, 600, 220, 70, 'κ = 1/5', 34, ap(t, 'D02', 0.1)); checkMark(1300, 520, 22, GRN, t, P('D02', 0.5)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C12', 0) * fadeOut(t, S('C13'), 0.4);
  if (ga > 0) {
    richReveal([['曲率 = ', CR], ['切线转角 ÷ 弧长', GOLD]], CX, 330, 42, t, P('C12', 0.05), { upright: true, alpha: ga });
    richReveal([['圆：', CR], ['κ = 1/R', CYAN]], CX, 420, 42, t, P('C12', 0.4), { upright: true, alpha: ga });
    richReveal([['密切圆：', CR], ['贴着曲线一起弯', SQ.Z.col]], CX, 510, 42, t, P('C12', 0.7), { upright: true, alpha: ga });
  }
  if (t > S('C13') - 0.1) { glowText('下一段：极坐标圆锥曲线与行星轨道', CX, 520, 50, CR, t, P('C13', 0.15)); glowText('Grok 骑火箭绕太阳', CX, 610, 32, SQ.X.col, t, P('C13', 0.45), { bold: false }); }
  credits(t, E('C13') + 0.38, 'AI娘微积分课 · 第 10 章 · P13 曲率', '下一段：行星轨道', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM10('GLM')]);
};

SC.__overlay = t => { if (t < E('C13') + 0.25) lecturer(t, 'C', 255, -5, E('C13') + 0.48, { h: 710 }); };
SC.__noTag = E('C13') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C13') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.05, 'swell', 0.14); s('C01', 0.4, 'pop', 0.14); s('C02', 0.1, 'ding', 0.2); s('D01', 0.1, 'pop', 0.16); s('C03', 0.2, 'pluck', 0.16); s('C03', 0.45, 'pluck', 0.16);
  s('Z01', 0.1, 'swoosh_in', 0.18); s('Z01', 0.5, 'tick', 0.16); s('C04', 0.1, 'type', 0.16); s('C05', 0.05, 'type', 0.16); s('C05', 0.7, 'tick', 0.16);
  s('C06', 0.05, 'swell', 0.14); s('C06', 0.3, 'pop', 0.16); s('C07', 0.2, 'shimmer', 0.16); s('C08', 0.15, 'pop', 0.16); s('C08', 0.35, 'pop', 0.16);
  s('Z02', 0.5, 'hum', 0.14); s('Z02', 0.75, 'buzz', 0.14); s('C09', 0.05, 'sting', 0.18);
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'ding_hi', 0.2); s('D02', 0.5, 'check', 0.24);
  s('C12', 0.05, 'pop', 0.18); s('C12', 0.4, 'pop', 0.18); s('C12', 0.7, 'pop', 0.18); s('C13', 0.15, 'swell', 0.3);
})();
finalize();
