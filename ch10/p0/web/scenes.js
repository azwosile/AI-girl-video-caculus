// 第 10 章 P0《字母里的曲线》（2026-11-13）：数学画面全部原创 Canvas 绘制；字形轮廓取自得意黑（SmileySans，OFL）控制点。
// A434 放大字幕“曲线”：光滑轮廓，“曲”几乎全是直线、“线”一大半是曲线 · A435 O 与 S 不是函数图像（竖线交点） · A436 点沿 S 轮廓走：x(t)、y(t) 两条函数
const SC = {};
const TITLES = [['zoom', '放大字幕'], ['parts', '轮廓'], ['nofunc', '不是函数'], ['param', '让点走'], ['quiz', '随堂一题'], ['outro', '小结']];

const BIG0 = { s: 0.40, x: 610, y: 700 }, SMALL0 = { s: 0.05, x: 940, y: 618 };
function zoomK0(t) { return eIO(prog(t, P('N01', 0.45), 1.8)); }
function videoWin0(t, a) {
  if (a <= 0) return; panel(640, 240, 680, 420, SQ.N.col, a, 'rgba(10,14,30,0.9)');
  label('● REC', 700, 272, 22, SQ.N.col, a * (0.6 + 0.4 * Math.sin(t * 6)), { bold: true });
  ctx.save(); ctx.globalAlpha *= a * 0.5; for (let i = 0; i < 5; i++) { ctx.fillStyle = hexA([CYAN, GOLD, INV, GRN, RED][i], 0.35); ctx.beginPath(); ctx.arc(760 + i * 110, 430 + 30 * Math.sin(t * 1.3 + i), 34, 0, TAU); ctx.fill(); } ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(0,0,0,0.55)'; rr(890, 580, 180, 54, 8); ctx.fill(); ctx.restore();
}
function bigGlyphs0(t, o) {
  const k = zoomK0(t), s = lerp(SMALL0.s, BIG0.s, k), x = lerp(SMALL0.x, BIG0.x, k), y = lerp(SMALL0.y, BIG0.y, k), adv = 800 * s;
  const fa = o.fillA ?? 1;
  glyphDraw('曲', x, y, s, { a: o.a, fill: CR, fillA: fa, stroke: o.st1, hiLine: o.hl1, hiCurve: o.hc1, p: o.p1 ?? 1, w: 3, ctrl: o.ctrl1 });
  glyphDraw('线', x + adv, y, s, { a: o.a, fill: CR, fillA: fa, stroke: o.st2, hiLine: o.hl2, hiCurve: o.hc2, p: o.p2 ?? 1, w: 3, ctrl: o.ctrl2, ctrlA: o.ctrlA2 });
}

// ======================= 放大字幕（A434） =======================
SC.zoom = t => {
  starfield(t); blueprint(0.3, 80);
  const k = zoomK0(t); videoWin0(t, ap(t, 'N01', 0) * (1 - k));
  const pOut = prog(t, P('C01', 0.25), 1.4);
  bigGlyphs0(t, { a: ap(t, 'N01', 0, 0.3), fillA: 1 - 0.8 * pOut, st1: t > S('C01') ? CYAN : null, st2: t > S('C01') ? CYAN : null, p1: pOut, p2: pOut });
  if (t > S('N01')) label('× 20', 1345, 330, 40, SQ.N.col, ap(t, 'N01', 0.7), { bold: true });
  if (t > S('D01')) { label('依旧光滑', 1345, 400, 30, GOLD, ap(t, 'D01', 0.3), { bold: true }); crossMark(1345, 470, 20, RED, t, P('D01', 0.6)); label('像素格', 1345, 520, 24, RED, ap(t, 'D01', 0.6), { bold: true }); }
  if (t > S('C01')) label('字体文件：存轮廓线，不存像素', 980, 800, 30, CYAN, ap(t, 'C01', 0.2), { bold: true });
};

// ======================= 轮廓（A434） =======================
SC.parts = t => {
  starfield(t); blueprint(0.32, 80);
  const on2 = t > S('C03'), c1 = glyphCount('曲'), c2 = glyphCount('线');
  bigGlyphs0(t, { a: 1, fillA: 0.12, st1: CYAN, st2: CYAN, hl1: t > S('C02') ? CYAN : null, hc1: t > S('C02') ? GOLD : null,
    hc2: on2 ? GOLD : null, hl2: CYAN, ctrl2: t > S('C04'), ctrlA2: ap(t, 'C04', 0.15) });
  if (t > S('C02')) { const a = ap(t, 'C02', 0.3);
    richReveal([['直线 ', CYAN], [`${c1.L}`, CYAN], ['  曲线 ', GOLD], [`${c1.Q}`, GOLD]], 770, 790, 30, t, P('C02', 0.3), { upright: true });
    if (t > S('D02')) stampMark(770, 330, 46, t, P('D02', 0.2), { text: '不弯', col: RED, rot: -0.15 }); }
  if (on2) richReveal([['直线 ', CYAN], [`${c2.L}`, CYAN], ['  曲线 ', GOLD], [`${c2.Q}`, GOLD]], 1090, 790, 30, t, P('C03', 0.3), { upright: true });
  if (t > S('C04')) { label('■ 端点', 1280, 330, 24, CR, ap(t, 'C04', 0.35), { bold: true, align: 'left' }); label('● 控制点', 1280, 370, 24, INV, ap(t, 'C04', 0.55), { bold: true, align: 'left' }); }
};

// ======================= 不是函数（A435） =======================
const GO0 = { s: 0.5, x: 650, y: 720 }, GS0 = { s: 0.5, x: 1030, y: 720 };
SC.nofunc = t => {
  starfield(t); blueprint(0.34, 80);
  if (t < S('C05')) { richReveal([['y = f(x) ？', GOLD]], 980, 460, 64, t, P('D03', 0.1), { upright: true }); return; }
  glyphDraw('O', GO0.x, GO0.y, GO0.s, { a: ap(t, 'C05', 0), fill: CR, fillA: 0.15, stroke: GOLD, w: 3 });
  const X0 = GO0.x + 270 * GO0.s, sw = eOut(prog(t, P('C05', 0.35), 0.7)), yl = lerp(260, 800, sw);
  if (t > P('C05', 0.3)) { seg(X0, 260, X0, yl, RED, 0.9, 3, [10, 7]); glyphHits('O', 270).forEach(y => { const Y = GO0.y - y * GO0.s; if (Y < yl) glowDot(X0, Y, 8, RED, 1); }); label('x = 常数', X0, 236, 24, RED, ap(t, 'C05', 0.4), { bold: true }); }
  if (t > S('C06')) { label('一个 x → 不止一个 y', 790, 820, 28, RED, ap(t, 'C06', 0.1), { bold: true }); crossMark(940, 236, 18, RED, t, P('C06', 0.5)); }
  if (t > S('G01')) {
    glyphDraw('S', GS0.x, GS0.y, GS0.s, { a: ap(t, 'G01', 0), fill: CR, fillA: 0.15, stroke: SQ.G.col, w: 3 });
    const X1 = GS0.x + 240 * GS0.s, s2 = eOut(prog(t, P('G01', 0.3), 0.8)), y2 = lerp(260, 800, s2), hs = glyphHits('S', 240);
    seg(X1, 260, X1, y2, RED, 0.9, 3, [10, 7]); let n = 0; hs.forEach(y => { const Y = GS0.y - y * GS0.s; if (Y < y2) { glowDot(X1, Y, 8, RED, 1); n++; } });
    label(`交点 ${n} 个`, 1300, 470, 30, RED, ap(t, 'G01', 0.3), { bold: true });
  }
};

// ======================= 让点走（A436） =======================
const GP0 = { s: 0.62, x: 700, y: 770 }, NS0 = 31;
const GX0 = { cx: 1070, cy: 450, ux: 9, uy: 0.17, x0: 0, x1: 31, y0: 0, y1: 520 }, GY0 = { cx: 1070, cy: 720, ux: 9, uy: 0.27, x0: 0, x1: 31, y0: -60, y1: 800 };
SC.param = t => {
  starfield(t); blueprint(0.34, 80);
  const T = NS0 * eIO(prog(t, P('C07', 0.25), (E('C08') - P('C07', 0.25)) * 0.98));
  glyphDraw('S', GP0.x, GP0.y, GP0.s, { a: 1, fill: CR, fillA: 0.08, stroke: SQ.N.col, p: T / NS0, w: 4 });
  const [px, py] = glyphPt('S', T); const X = GP0.x + px * GP0.s, Y = GP0.y - py * GP0.s; glowDot(X, Y, 10, GOLD, ap(t, 'C07', 0.2));
  if (t > S('C07')) {
    const a = ap(t, 'C07', 0.2);
    seg(X, Y, X, GP0.y + 40, CYAN, a * 0.5, 2, [5, 6]); seg(X, Y, GP0.x - 30, Y, GOLD, a * 0.5, 2, [5, 6]);
    gAxes(GX0, a * 0.6, { grid: false, ticks: { x: [], y: [] } }); gAxes(GY0, a * 0.6, { grid: false, ticks: { x: [], y: [] } });
    const sx = [], sy = []; for (let i = 0; i <= 200; i++) { const s = T * i / 200, q = glyphPt('S', s); sx.push([s, q[0]]); sy.push([s, q[1]]); }
    gPath(GX0, sx, CYAN, { a, w: 3 }); gPath(GY0, sy, GOLD, { a, w: 3 });
    label('x(t)', GX0.cx - 40, gy(GX0, 470), 26, CYAN, a, { bold: true }); label('y(t)', GY0.cx - 40, gy(GY0, 760), 26, GOLD, a, { bold: true });
    label('t', gx(GX0, 31) + 18, GX0.cy, 24, CR, a); label('t', gx(GY0, 31) + 18, GY0.cy, 24, CR, a);
    label(`t = ${T.toFixed(1)}`, 1200, 300, 28, CR, a, { bold: true, align: 'left' });
  }
  if (t > S('C08')) goldBox(980, 215, 520, 70, 'x = f(t)，y = g(t)', 38, ap(t, 'C08', 0.3));
  if (t > S('N02')) label('像录屏：每一帧记下点的位置', 980, 850, 28, SQ.N.col, ap(t, 'N02', 0.2) * fadeOut(t, S('C09')), { bold: true });
  if (t > S('C09')) { [['参数方程', SQ.N.col, 'P1–P6'], ['极坐标', SQ.K.col, 'P7–P11'], ['圆锥曲线与轨道', SQ.X.col, 'P12–P14']].forEach(([s, c, r], i) => {
    const k = ap(t, 'C09', 0.1 + 0.2 * i); panel(620 + i * 250, 820, 230, 76, c, k); label(s, 735 + i * 250, 846, 26, c, k, { bold: true }); label(r, 735 + i * 250, 878, 20, CR, k); }); }
};

// ======================= 随堂 =======================
const GQ0 = { cx: 880, cy: 560, ux: 200, uy: 200, x0: -1.4, x1: 1.4, y0: -1.4, y1: 1.4 };
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5) * 0.42, 78);
  if (t < S('C11')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C10') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['x² + y² = 1  →  ', CR], ['y = f(x) ？', GOLD]], 880, 230, 36, t, P('C11', 0.05), { upright: true });
  const a = ap(t, 'C11', 0.2); gAxes(GQ0, a * 0.6, { grid: false, ticks: { x: [[1, '1'], [-1, '−1']], y: [[1, '1'], [-1, '−1']] } });
  if (t < S('D04')) gPlot(GQ0, x => Math.sqrt(Math.max(0, 1 - x * x)), CR, { a: a * 0.8, xa: -1, xb: 1, w: 3 }), gPlot(GQ0, x => -Math.sqrt(Math.max(0, 1 - x * x)), CR, { a: a * 0.8, xa: -1, xb: 1, w: 3 });
  if (t > S('D04') - 0.05 && t < S('C12')) {
    const k = ap(t, 'D04', 0.1);
    gPlot(GQ0, x => Math.sqrt(Math.max(0, 1 - x * x)), GOLD, { a: k, xa: -1, xb: 1, w: 4, n: 400 }); gPlot(GQ0, x => -Math.sqrt(Math.max(0, 1 - x * x)), CYAN, { a: k, xa: -1, xb: 1, w: 4, n: 400 });
    label('y = √(1 − x²)', 1150, 400, 28, GOLD, k, { bold: true }); label('y = −√(1 − x²)', 1150, 720, 28, CYAN, k, { bold: true });
  }
  if (t > S('C12')) {
    const p = prog(t, P('C12', 0.3), 1.6), s = TAU * p;
    paramTrace(GQ0, q => Math.cos(q), q => Math.sin(q), 0, TAU, SQ.N.col, { p, w: 4, arrows: [0.8, 2.4, 4.0, 5.6] });
    const X = gx(GQ0, Math.cos(s)), Y = gy(GQ0, Math.sin(s)); seg(gx(GQ0, 0), gy(GQ0, 0), X, Y, GOLD, 0.8, 2.5);
    goldBox(1250, 520, 230, 100, '', 30, ap(t, 'C12', 0.2)); label('x = cos t', 1250, 500, 30, CYAN, ap(t, 'C12', 0.2), { bold: true }); label('y = sin t', 1250, 545, 30, GOLD, ap(t, 'C12', 0.2), { bold: true });
    checkMark(1395, 520, 22, GRN, t, P('C12', 0.6));
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C13', 0) * fadeOut(t, S('C14'), 0.4);
  if (ga > 0) {
    richReveal([['曲线 ≠ 只有 ', CR], ['y = f(x)', RED]], CX, 330, 46, t, P('C13', 0.05), { upright: true, alpha: ga });
    richReveal([['让点动起来：', CR], ['(x(t), y(t))', GOLD]], CX, 430, 46, t, P('C13', 0.45), { upright: true, alpha: ga });
    glyphDraw('S', 1260, 640, 0.22, { a: ga * ap(t, 'C13', 0.6), stroke: SQ.N.col, w: 3, p: prog(t, P('C13', 0.6), 1.2) });
  }
  if (t > S('C14') - 0.1) { glowText('下一段：参数曲线', CX, 520, 50, CR, t, P('C14', 0.15)); glowText('Kimi：让点动起来', CX, 610, 32, SQ.K.col, t, P('C14', 0.45), { bold: false }); }
  credits(t, E('C14') + 0.38, 'AI娘微积分课 · 第 10 章 · P0 字母里的曲线', '下一段：参数曲线', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), '字形轮廓：得意黑 Smiley Sans（atelier-anchor，SIL OFL 1.1），仅读取控制点作图。', ...CREDIT_END, CREDIT_TM10('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C14') + 0.25) lecturer(t, 'C', 255, -5, E('C14') + 0.48, { h: 710 }); };
SC.__noTag = E('C14') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C14') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.05, 'click', 0.2); s('N01', 0.45, 'warp', 0.2); s('N01', 0.7, 'pop', 0.18); s('D01', 0.3, 'sparkle', 0.18); s('D01', 0.6, 'buzz', 0.14); s('C01', 0.25, 'type', 0.14); s('C01', 0.2, 'ding', 0.16);
  s('C02', 0.1, 'tick', 0.16); s('C02', 0.3, 'pop', 0.18); s('D02', 0.2, 'stamp', 0.26); s('C03', 0.1, 'shimmer', 0.18); s('C03', 0.3, 'pop', 0.18); s('C04', 0.15, 'pluck', 0.18); s('C04', 0.35, 'pop', 0.14); s('C04', 0.55, 'pop', 0.14);
  s('D03', 0.1, 'riser', 0.14); s('C05', 0.0, 'pop', 0.16); s('C05', 0.35, 'zap', 0.16); s('C06', 0.1, 'pop', 0.16); s('C06', 0.5, 'buzz', 0.16); s('G01', 0.0, 'pop', 0.16); s('G01', 0.3, 'zap', 0.16); s('G01', 0.5, 'ding_lo', 0.2);
  s('C07', 0.2, 'whoosh', 0.14); s('C08', 0.3, 'ding_hi', 0.24); s('N02', 0.2, 'sparkle', 0.18); [0.1, 0.3, 0.5].forEach(f => s('C09', f, 'marimba', 0.14));
  s('C10', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D04', 0.1, 'whoosh', 0.14); s('D04', 0.2, 'ding', 0.2); s('C12', 0.3, 'swell', 0.16); s('C12', 0.6, 'check', 0.22);
  s('C13', 0.05, 'pop', 0.2); s('C13', 0.45, 'pop', 0.2); s('C14', 0.15, 'swell', 0.3);
})();
finalize();
