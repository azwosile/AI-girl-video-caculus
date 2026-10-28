// 第 4 章 P11《等价无穷小》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A159 放大镜下 sin x、tan x、ln(1 + x) 与 y = x 重合 · A160 等价表逐行点亮 · A161 “加减乱换”陷阱被打叉、正确拆法 · A162 洛必达 vs 等价替换计时赛
const SC = {};
const TITLES = [['cmp', '无穷小的比较'], ['table', '等价无穷小表'], ['use', '乘除整体换'], ['trap', '加减陷阱'], ['race', '计时赛'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 比较 + 放大镜（A159） =======================
SC.cmp = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C02') - 0.1) {
    const rows = [['α/β → 0', '高阶', 0.12, CYAN], ['α/β → c ≠ 0', '同阶', 0.4, GRN], ['α/β → 1', '等价  α ~ β', 0.68, GOLD]];
    rows.forEach(([f, n, k, c], i) => { const p = ap(t, 'C01', k); if (p <= 0) return; const y = 340 + i * 130; panel(660, y - 45, 680, 90, c, p * 0.8); mathText(f, 830, y, 32, c, { align: 'center', alpha: p, upright: true }); label(n, 1160, y, 32, c, p, { bold: true }); });
    return;
  }
  const a = ap(t, 'C02', 0), z = eIO(prog(t, P('C02', 0.3), 2.6)), w = lerp(1.5, 0.12, z);
  const G = { cx: 990, cy: 560, ux: 290 / w, uy: 290 / w, x0: -w, x1: w, y0: -w, y1: w };
  panel(690, 260, 600, 600, CR, a * 0.4);
  gAxes(G, a, { grid: false });
  gPlot(G, x => x, CR, { a, w: 3, n: 50 });
  gPlot(G, Math.sin, CYAN, { a, n: 200 });
  gPlot(G, Math.tan, RED, { a, xa: Math.max(-w, -1.45), xb: Math.min(w, 1.45), n: 300 });
  gPlot(G, x => Math.log(1 + x), SQ.K.col, { a, xa: Math.max(-w, -0.9), n: 300 });
  [['y = x', CR], ['sin x', CYAN], ['tan x', RED], ['ln(1 + x)', SQ.K.col]].forEach(([s, c], i) => mathText(s, 720, 300 + i * 40, 24, c, { alpha: a, upright: true }));
  label(`放大 ×${(1.5 / w).toFixed(1)}`, 1210, 300, 24, GOLD, a, { bold: true });
  if (z > 0.95) label('贴在一起', 1150, 800, 28, GOLD, ap(t, 'C02', 0.9), { bold: true });
};

// ======================= 等价表（A160） =======================
const TAB = [['sin x ~ x', 'K01', 0.45], ['tan x ~ x', 'K01', 0.55], ['arcsin x ~ x', 'K01', 0.65], ['arctan x ~ x', 'K01', 0.75], ['ln(1 + x) ~ x', 'K02', 0.05],
  ['e^x − 1 ~ x', 'K02', 0.35], ['a^x − 1 ~ x ln a', 'K02', 0.7], ['1 − cos x ~ x^2/2', 'K03', 0.3], ['ⁿ√(1 + x) − 1 ~ x/n', 'K03', 0.7]];
function drawTab(t, dim) {
  TAB.forEach(([s, id, f], i) => {
    const col = i < 5 ? 0 : 1, r = i < 5 ? i : i - 5, x = col ? 1180 : 820, y = 270 + r * 100;
    const on = ap(t, id, f), base = 0.35 * ap(t, 'K01', 0, 0.6);
    const c = i >= 7 ? GOLD : SQ.K.col, a = Math.max(base, on) * (dim ?? 1);
    panel(x - 165, y - 36, 330, 72, on > 0 ? c : hexA(CR, 0.4), a);
    mathText(s, x, y, 27, on > 0 ? c : hexA(CR, 0.5), { align: 'center', alpha: a, upright: true, glow: on > 0 ? 10 : 0 });
  });
}
SC.table = t => {
  starfield(t); blueprint(0.4, 80);
  label('x → 0（课件 4.4 第 7 页）', CX, 195, 24, hexA(CR, 0.75), ap(t, 'K01', 0));
  drawTab(t);
  if (t > P('K01', 0.1) && t < P('K01', 0.45)) label('一口气背完～', 1180, 770, 26, SQ.K.col, ap(t, 'K01', 0.1), { bold: true });
};

// ======================= 乘除整体换 =======================
SC.use = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['lim', CR], ['  (e^x − sin x − 1)', RED], [' / ', CR], ['(arcsin x)^2', CYAN], ['   (x → 0)', CR]], CX, 280, 34, t, P('C03', 0.1), { upright: true });
  if (t > P('C03', 0.65)) {
    const p = ap(t, 'C03', 0.65); seg(1010, 320, 1180, 320, CYAN, p, 3); label('乘积：整体换', 1095, 355, 22, CYAN, p);
    richReveal([['= lim  (e^x − sin x − 1) / ', CR], ['x^2', CYAN]], CX, 440, 34, t, P('C03', 0.8), { upright: true });
  }
  if (t > S('C04') - 0.1) {
    richReveal([['= lim  (e^x − cos x) / ', CR], ['2x', GOLD]], CX, 540, 34, t, P('C04', 0.15), { upright: true });
    richReveal([['= lim  (e^x + sin x) / ', CR], ['2', GOLD]], CX, 640, 34, t, P('C04', 0.4), { upright: true });
    richReveal([['= ', CR], ['1/2', GOLD]], CX, 750, 48, t, P('C04', 0.7), { upright: true });
    if (t > P('C04', 0.8)) burst(t, P('C04', 0.8), CX + 40, 740, GOLD, 70, 10);
  }
};

// ======================= 加减陷阱（A161） =======================
SC.trap = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['lim', CR], ['  (tan x − sin x) / x^3', RED], ['   (x → 0)', CR]], CX, 250, 36, t, P('D01', 0.05), { upright: true });
  const wa = (t < S('G01') - 0.1) ? 1 : 0.35;
  richReveal([['= (x − x) / x^3 = 0 ？', hexA(SQ.D.col, wa)]], CX, 360, 32, t, P('D01', 0.5), { upright: true });
  if (t > S('C05')) { crossMark(1250, 360, 34, RED, t, P('C05', 0.05)); label('加减里不能乱换', CX, 430, 26, RED, ap(t, 'C05', 0.3) * wa, { bold: true }); }
  if (t > S('G01') - 0.1) {
    richReveal([['= lim  ', CR], ['tan x', CYAN], [' · ', CR], ['(1 − cos x)', GOLD], [' / x^3', CR]], CX, 530, 34, t, P('G01', 0.05), { upright: true });
    richReveal([['= lim  ', CR], ['x', CYAN], [' · ', CR], ['x^2/2', GOLD], [' / x^3', CR]], CX, 630, 34, t, P('G01', 0.4), { upright: true });
    richReveal([['= ', CR], ['1/2', GOLD]], CX, 735, 46, t, P('G01', 0.75), { upright: true });
    if (t > P('G01', 0.85)) checkMark(CX + 120, 730, 30, GRN, t, P('G01', 0.85));
  }
  if (t > S('K04') - 0.1) { const k = ap(t, 'K04', 0.1); panel(680, 800, 640, 80, SQ.K.col, k); richReveal([['乘除：整体换 ✓', GRN], ['    加减：不能换 ✗', RED]], CX, 840, 28, t, P('K04', 0.2), { upright: true }); }
};

// ======================= 计时赛（A162） =======================
const LH = ["分子求导：2sin x/(1 + 2x) + ln(1 + 2x)cos x", "分母求导：sin x", "还是 0/0……再求一次", "4cos x/(1 + 2x) − 4sin x/(1 + 2x)^2 − ln(1 + 2x)sin x", "分母：cos x", "代入 x = 0 …"];
SC.race = t => {
  starfield(t); blueprint(0.4, 80);
  richReveal([['lim', CR], ['  ln(1 + 2x) · sin x / (1 − cos x)', RED], ['   (x → 0)', CR]], CX, 230, 32, t, P('C06', 0.1), { upright: true });
  const a = ap(t, 'C06', 0.5);
  panel(630, 300, 330, 520, SQ.K.col, a * 0.85); panel(990, 300, 370, 520, SQ.G.col, a * 0.85);
  label('等价替换', 795, 335, 26, SQ.K.col, a, { bold: true }); label('洛必达', 1175, 335, 26, SQ.G.col, a, { bold: true });
  // 计时
  const t0 = S('K05'), tl = Math.max(0, Math.min(t, P('K05', 0.75)) - t0), tr = Math.max(0, t - t0);
  if (t > t0) { mathText(`${tl.toFixed(1)} s`, 795, 790, 26, SQ.K.col, { align: 'center', alpha: a, upright: true }); mathText(`${tr.toFixed(1)} s`, 1175, 790, 26, SQ.G.col, { align: 'center', alpha: a, upright: true }); }
  if (t > t0) {
    richReveal([['分子 ~ 2x · x = 2x^2', CR]], 795, 430, 24, t, P('K05', 0.1), { upright: true });
    richReveal([['分母 ~ x^2/2', CR]], 795, 500, 24, t, P('K05', 0.35), { upright: true });
    richReveal([['= ', CR], ['4', GOLD]], 795, 600, 52, t, P('K05', 0.6), { upright: true });
    if (t > P('K05', 0.75)) { checkMark(880, 600, 28, GRN, t, P('K05', 0.75)); slab('完成', 795, 700, 26, t, P('K05', 0.8), { bg: SQ.K.col, c: COL.ink }); }
    // 洛必达：越写越长，向上滚动
    ctx.save(); ctx.beginPath(); ctx.rect(1000, 365, 350, 395); ctx.clip();
    const sh = Math.max(0, (tr - 2.5) * 22);
    LH.forEach((s, i) => { const tt = t0 + 0.4 + i * 0.9; if (t < tt) return; const pa = clamp((t - tt) / 0.3); mathText(s, 1010, 400 + i * 62 - sh + 0, 17, hexA(CR, 0.85), { alpha: a * pa, upright: true }); });
    ctx.restore();
    if (t > S('G02')) { const k = 0.5 + 0.5 * Math.sin(t * 6); label('还在算……', 1175, 720, 24, SQ.G.col, ap(t, 'G02', 0.1) * (0.5 + 0.5 * k), { bold: true }); }
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['lim', CR], ['  (1 − cos x) / x^2', RED], ['   (x → 0)', CR]], 870, 300, 44, t, P('C08', 0.1), { upright: true });
  if (t > S('D02')) { richReveal([['1 − cos x  ~  x^2/2', CYAN]], 900, 470, 36, t, P('D02', 0.1), { upright: true }); richReveal([['答案  ', CR], ['1/2', GOLD]], 900, 590, 50, t, P('D02', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; drawTab(t, 0.75); ctx.restore(); }
  if (t > S('C10') - 0.1) { glowText('下一段：泰勒公式初步', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('GLM 客串', CX, 590, 32, SQ.Z.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 4 章 · P11 等价无穷小', '下一段：泰勒公式初步', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM4('Kimi')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  [0.12, 0.4, 0.68].forEach(f => s('C01', f, 'pluck', 0.18)); s('C02', 0.0, 'whoosh', 0.18); s('C02', 0.3, 'warp', 0.18); s('C02', 0.9, 'ding', 0.22);
  TAB.forEach(([x, id, f]) => s(id, f, 'click', 0.16)); s('K01', 0.1, 'tinkle', 0.16); s('K03', 0.3, 'ding', 0.18); s('K03', 0.7, 'ding', 0.18);
  s('C03', 0.1, 'type', 0.14); s('C03', 0.65, 'pluck', 0.2); s('C03', 0.8, 'type', 0.14); s('C04', 0.15, 'type', 0.14); s('C04', 0.4, 'type', 0.14); s('C04', 0.7, 'ding_hi', 0.26);
  s('D01', 0.5, 'pop', 0.2); s('C05', 0.05, 'buzz', 0.2); s('G01', 0.05, 'type', 0.14); s('G01', 0.4, 'type', 0.14); s('G01', 0.75, 'ding_hi', 0.26); s('G01', 0.85, 'check', 0.22); s('K04', 0.2, 'pluck', 0.2);
  s('C06', 0.1, 'type', 0.14); s('C06', 0.5, 'riser', 0.14); s('K05', 0.0, 'count', 0.2); s('K05', 0.6, 'ding_hi', 0.26); s('K05', 0.75, 'check', 0.24); s('G02', 0.1, 'tick', 0.16);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'type', 0.14); s('D02', 0.55, 'ding_hi', 0.28);
  s('C09', 0.1, 'shimmer', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
