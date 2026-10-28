// 第 3 章 P4《链式法则》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A97 定理三色公式 + 剥洋葱 · A98 豆包漏乘里层（sin(x²)）与 sin²x 的层次对照 · A99 幂套一层、三层齿轮、2ˣ = e^{x ln 2} · A100 误差项证明（Δx → 0 误差条收缩）
const SC = {};
const TITLES = [['theorem', '链式法则'], ['onion', '一层也不能少'], ['power', '套几层都行'], ['proof', '为什么成立'], ['quiz', '随堂两题'], ['outro', '小结']];
const BC = SQ.B.col;
// 洋葱：layers = [[文字, 颜色], ...] 由外到内；peel 0..1 让最外层飞走
function onion(x, y, R, layers, a, o = {}) {
  if (a <= 0) return; const n = layers.length;
  layers.forEach(([s, col], i) => {
    const r = R * (n - i) / n, pe = i === 0 ? (o.peel || 0) : 0;
    ctx.save(); ctx.globalAlpha *= a * (1 - pe); ctx.translate(x + pe * 160, y - pe * 120); ctx.rotate(pe * 0.6);
    ctx.fillStyle = hexA(col, 0.14); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(0, -r * 1.15); ctx.bezierCurveTo(r * 1.0, -r * 0.6, r * 1.0, r * 0.95, 0, r * 0.95); ctx.bezierCurveTo(-r * 1.0, r * 0.95, -r * 1.0, -r * 0.6, 0, -r * 1.15); ctx.fill(); ctx.stroke();
    ctx.restore();
    if (s) mathText(s, x + (i === n - 1 ? 0 : 0) + pe * 160, y - pe * 120 + (i === n - 1 ? 14 : -r * 0.72 + R / n * 0.5), i === n - 1 ? 34 : 28, col, { align: 'center', alpha: a * (1 - pe), glow: 10, upright: true });
  });
}

// ======================= theorem（A97） =======================
SC.theorem = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01')) { const ch = gearChain(880, 520, [{ n: 30, col: OUTER }, { n: 15, col: INNER }, { n: 10, col: PROD }], 6, [0, 0]); drawChain(ch, t * 0.8, 6, ap(t, 'D01', 0)); kinetic('怎么写？', CX, 800, 56, t, P('D01', 0.4), { col: CR }); return; }
  const up = eIO(prog(t, S('C02'), 0.6)), y = lerp(330, 250, up), sz = lerp(52, 44, up);
  richReveal([['[f(', OUTER], ['g(x)', INNER], [')]′ = ', OUTER]], 640, y, sz, t, P('C01', 0.3), { align: 'left' });
  const x1 = 640 + mathW('[f(g(x))]′ = ', sz);
  richReveal([['f′(', OUTER], ['g(x)', INNER], [')', OUTER]], x1, y, sz, t, P('C01', 0.62), { align: 'left' });
  const x2 = x1 + mathW('f′(g(x))', sz);
  richReveal([[' · ', PROD], ['g′(x)', INNER]], x2, y, sz, t, P('C01', 0.86), { align: 'left' });
  if (t > P('C01', 0.15)) label('y = f(u)，u = g(x)', 980, y - 80, 28, CR, ap(t, 'C01', 0.15) * (1 - up), { font: F_MATH });
  if (t > P('C01', 0.68)) { label('外层在里层处的导数', x1 + mathW('f′(g(x))', sz) / 2, y + 56, 22, OUTER, ap(t, 'C01', 0.68), { bold: true }); }
  if (t > P('C01', 0.9)) { label('里层的导数', x2 + mathW(' · g′(x)', sz) / 2 + 10, y + 56, 22, INNER, ap(t, 'C01', 0.9), { bold: true }); }
  // C02：剥洋葱
  if (t > S('C02')) {
    const a = ap(t, 'C02', 0.1), pe = eIO(prog(t, P('C02', 0.45), 0.6));
    onion(820, 640, 210, [['f  外层', OUTER], ['g(x)', INNER]], a, { peel: pe * 0.0 });
    // 外层“剥下”变成 f′，里层原样
    const s1 = ['外层求导', OUTER, 0.25], s2 = ['里层不动', INNER, 0.45], s3 = ['× 里层导数', PROD, 0.65];
    [s1, s2, s3].forEach(([s, c, f], k) => { if (t > P('C02', f)) { panel(1090, 520 + k * 100, 260, 76, c, ap(t, 'C02', f)); label(s, 1220, 558 + k * 100, 30, c, ap(t, 'C02', f), { bold: true }); } });
    if (pe > 0) { ctx.save(); ctx.globalAlpha *= a * pe; ctx.strokeStyle = OUTER; ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(820, 640, 250, -2.2, -0.6); ctx.stroke(); ctx.restore(); label('一层一层往里剥', 820, 380, 26, CR, a * pe, { bold: true }); }
  }
};

// ======================= onion（A98） =======================
SC.onion = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('G01'), 0.4);
  if (pa > 0) {
    panel(640, 230, 700, 120, BC, ap(t, 'B01', 0.15) * pa);
    label('豆包的答案', 720, 205, 24, BC, ap(t, 'B01', 0.15) * pa, { bold: true });
    mathRich([['(sin(', OUTER], ['x^2', INNER], ['))′ = cos(', OUTER], ['x^2', INNER], [')', OUTER]], 990, 308, 44, { align: 'center', alpha: ap(t, 'B01', 0.4) * pa, glow: 12, upright: true });
    if (t > S('C03')) {
      crossMark(1300, 290, 34, RED, t, P('C03', 0.05), pa); label('少乘了一层', 1210, 380, 26, RED, ap(t, 'C03', 0.05) * pa, { bold: true });
      onion(800, 640, 190, [['sin', OUTER], ['x^2', INNER]], ap(t, 'C03', 0.2) * pa);
      const a2 = ap(t, 'C03', 0.45) * pa;
      if (a2 > 0) { mathRich([['(', CR], ['x^2', INNER], [')′ = ', CR], ['2x', INNER]], 1160, 560, 40, { align: 'center', alpha: a2, glow: 10, upright: true }); arrowQ(980, 600, 1070, 590, INNER, prog(t, P('C03', 0.45), 0.4), pa); }
      richReveal([['= ', CR], ['2x', INNER], [' · ', PROD], ['cos(', OUTER], ['x^2', INNER], [')', OUTER]], 1160, 700, 46, t, P('C03', 0.7), { alpha: pa, upright: true });
      if (t > P('C03', 0.85)) checkMark(1330, 690, 26, GRN, t, P('C03', 0.85), pa);
    }
    if (t > S('B02')) label('又糊弄翻车了～', 1180, 860, 28, BC, ap(t, 'B02', 0.1) * pa, { bold: true });
  }
  // G01 / G02：sin(x²) 与 (sin x)² 对照
  if (t > S('G01') - 0.1) {
    const a = ap(t, 'G01', 0.05);
    onion(780, 560, 170, [['sin', OUTER], ['x^2', INNER]], a * 0.55); mathText('sin(x^2)', 780, 800, 36, CR, { align: 'center', alpha: a * 0.55, upright: true }); label('外层 sin，里层 x²', 780, 850, 22, CR, a * 0.55);
    const b = ap(t, 'G01', 0.35);
    onion(1180, 560, 170, [['(  )^2', OUTER], ['sin x', INNER]], b); mathText('sin^2 x = (sin x)^2', 1180, 800, 36, GOLD, { align: 'center', alpha: b, glow: 10, upright: true }); label('外层平方，里层 sin x', 1180, 850, 22, GOLD, b, { bold: true });
    if (t > S('G02')) { panel(760, 250, 600, 110, PROD, ap(t, 'G02', 0.1)); richReveal([['((sin x)^2)′ = ', CR], ['2 sin x', OUTER], [' · ', PROD], ['cos x', INNER]], 1060, 322, 42, t, P('G02', 0.15), { upright: true }); }
  }
};

// ======================= power（A99） =======================
SC.power = t => {
  starfield(t); blueprint(0.4, 80);
  const a1 = fadeOut(t, S('C05'), 0.35);
  if (a1 > 0) {
    richReveal([['[(', OUTER], ['x^3 − 1', INNER], [')^{100}]′', OUTER]], 980, 300, 50, t, P('C04', 0.1), { alpha: a1, upright: true });
    richReveal([['= 100(', OUTER], ['x^3 − 1', INNER], [')^{99}', OUTER]], 860, 440, 46, t, P('C04', 0.45), { alpha: a1, upright: true });
    richReveal([[' · ', PROD], ['3x^2', INNER]], 1180, 440, 46, t, P('C04', 0.8), { alpha: a1, upright: true });
    if (t > P('C04', 0.9)) { panel(700, 520, 560, 100, PROD, ap(t, 'C04', 0.9) * a1); mathRich([['= 300x^2(x^3 − 1)^{99}', PROD]], 980, 586, 42, { align: 'center', alpha: ap(t, 'C04', 0.9) * a1, glow: 14, upright: true }); }
    if (t > P('C04', 0.3)) label('不用展开 100 次方', 980, 700, 26, CR, ap(t, 'C04', 0.3) * a1, { bold: true });
  }
  const a2 = win(t, S('C05') - 0.1, S('C06'), 0.35);
  if (a2 > 0) {
    const ch = gearChain(820, 560, [{ n: 30, col: OUTER }, { n: 20, col: INNER }, { n: 14, col: PROD }], 6, [0, 0]);
    drawChain(ch, t * 0.7, 6, a2);
    [['sin', 0], ['cos', 1], ['tan', 2]].forEach(([s, i]) => label(s, ch[i].x, ch[i].y + ch[i].R + 34, 28, ch[i].col, a2, { font: F_MATH, bold: true }));
    richReveal([['sin(', OUTER], ['cos(', INNER], ['tan x', PROD], ['))', CR]], 980, 280, 46, t, P('C05', 0.1), { alpha: a2, upright: true });
    const parts = [['cos(cos(tan x))', OUTER, 0.45], [' · (−sin(tan x))', INNER, 0.6], [' · sec^2 x', PROD, 0.75]];
    let x = 980 - (mathW('cos(cos(tan x)) · (−sin(tan x)) · sec^2 x', 32)) / 2;
    parts.forEach(([s, c, f]) => { if (t > P('C05', f)) mathText(s, x, 380, 32, c, { alpha: ap(t, 'C05', f) * a2, glow: 10, upright: true }); x += mathW(s, 32); });
    if (t > S('D02')) ratioTag('倍数连乘', 1240, 760, GOLD, ap(t, 'D02', 0.2) * a2, { size: 32 });
  }
  if (t > S('C06') - 0.1) {
    const a = ap(t, 'C06', 0.05);
    richReveal([['2^x = e^{x ln 2}', GOLD]], 980, 300, 54, t, P('C06', 0.12), { upright: true });
    label('高中公式，现在能推了', 980, 210, 26, CR, a, { bold: true });
    if (t > P('C06', 0.45)) { richReveal([['(2^x)′ = ', CR], ['e^{x ln 2}', OUTER], [' · ', PROD], ['ln 2', INNER]], 980, 450, 46, t, P('C06', 0.5), { upright: true }); label('里层 x ln 2 的导数', 1150, 520, 22, INNER, ap(t, 'C06', 0.6), { bold: true }); }
    if (t > P('C06', 0.8)) { panel(760, 580, 440, 100, PROD, ap(t, 'C06', 0.8)); mathText('= 2^x ln 2', 980, 646, 46, PROD, { align: 'center', alpha: ap(t, 'C06', 0.8), glow: 14, upright: true }); }
  }
};

// ======================= proof（A100） =======================
SC.proof = t => {
  starfield(t); blueprint(0.4, 80);
  const sz = 34, x0 = 630;
  richReveal([['Δu = ', CR], ['g′(a)', INNER], ['Δx + ', CR], ['ε₁', RED], ['Δx', CR]], x0, 260, sz, t, P('G03', 0.25), { align: 'left' });
  richReveal([['Δy = ', CR], ['f′(b)', OUTER], ['Δu + ', CR], ['ε₂', RED], ['Δu', CR]], x0, 330, sz, t, P('G03', 0.5), { align: 'left' });
  if (t > P('G03', 0.3)) label('误差 ε → 0', 1230, 290, 26, RED, ap(t, 'G03', 0.3), { bold: true });
  if (t > S('G04')) {
    mathText('Δy', x0 + 20, 450, sz, CR, { alpha: ap(t, 'G04', 0.03) });
    const fa = ap(t, 'G04', 0.03); ctx.save(); ctx.globalAlpha *= fa; ctx.fillStyle = CR; ctx.fillRect(x0, 464, 80, 3); ctx.restore(); mathText('Δx', x0 + 20, 510, sz, CR, { alpha: fa });
    richReveal([['= (', CR], ['f′(b)', OUTER], [' + ', CR], ['ε₂', RED], [')(', CR], ['g′(a)', INNER], [' + ', CR], ['ε₁', RED], [')', CR]], x0 + 100, 482, sz, t, P('G04', 0.1), { align: 'left' });
  }
  // Δx 缩小的滑杆 + 误差条
  const dx = 1 - eIO(prog(t, P('G04', 0.35), 0.35 * D('G04'))), a = ap(t, 'G04', 0.3);
  if (a > 0) {
    panel(640, 590, 700, 210, CR, a);
    label('Δx', 690, 640, 28, CYAN, a, { font: F_MATH }); seg(730, 640, 730 + 520 * Math.max(0.02, dx), 640, CYAN, a, 8);
    label('ε₁', 690, 700, 28, RED, a, { font: F_MATH }); seg(730, 700, 730 + 360 * dx * dx + 2, 700, RED, a, 8);
    label('ε₂', 690, 760, 28, RED, a, { font: F_MATH }); seg(730, 760, 730 + 300 * dx * dx + 2, 760, RED, a, 8);
  }
  if (t > P('G04', 0.7)) { panel(700, 830, 560, 100, PROD, ap(t, 'G04', 0.7)); mathRich([['→ ', CR], ['f′(b)', OUTER], [' · ', PROD], ['g′(a)', INNER]], 980, 896, 44, { align: 'center', alpha: ap(t, 'G04', 0.7), glow: 14, upright: true }); }
  if (t > P('G04', 0.85)) ratioTag('Δu = 0 也成立', 1230, 400, GRN, ap(t, 'G04', 0.85), { size: 26 });
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.4, 78);
  if (t < S('C08')) { kinetic('随堂两题 · 每题 3 秒', CX, 520, 58, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 300);
  const q1 = fadeOut(t, S('C09') - 0.1, 0.35);
  if (q1 > 0) {
    richReveal([['(cos(', OUTER], ['x^2', INNER], ['))′ = ?', OUTER]], CX - 60, 260, 50, t, P('C08', 0.15), { upright: true, alpha: q1 });
    onion(820, 600, 170, [['cos', OUTER], ['x^2', INNER]], ap(t, 'C08', 0.4) * q1);
    if (t > S('D03')) { richReveal([['−sin(x^2)', OUTER]], 1160, 520, 40, t, P('D03', 0.15), { alpha: q1, upright: true }); richReveal([['· ', PROD], ['2x', INNER]], 1160, 590, 40, t, P('D03', 0.45), { alpha: q1, upright: true }); richReveal([['= −2x sin(x^2)', PROD]], 1100, 700, 42, t, P('D03', 0.65), { alpha: q1, upright: true }); checkMark(1330, 690, 26, GRN, t, P('D03', 0.85), q1); }
  }
  if (t > S('C09') - 0.1) {
    richReveal([['((', OUTER], ['sin x', INNER], [')^3)′ = ?', OUTER]], CX - 60, 260, 50, t, P('C09', 0.15), { upright: true });
    onion(820, 600, 170, [['(  )^3', OUTER], ['sin x', INNER]], ap(t, 'C09', 0.4));
    if (t > S('B03')) { richReveal([['3 sin^2 x', OUTER], [' · ', PROD], ['cos x', INNER]], 1150, 560, 44, t, P('B03', 0.35), { upright: true }); checkMark(1150, 660, 28, GRN, t, P('B03', 0.85)); label('这次不糊弄', 1150, 740, 26, BC, ap(t, 'B03', 0.1), { bold: true }); }
  }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C11'), 0.4);
  if (pa > 0) {
    [['外层求导', OUTER], ['里层不动', INNER], ['× 里层导数', PROD]].forEach(([s, c], k) => {
      const p = eBack(prog(t, P('C10', 0.1 + 0.18 * k), 0.4)) * pa; if (p <= 0) return; const x = 720 + 260 * k;
      ctx.save(); ctx.translate(x, 450); ctx.scale(p, p); panel(-115, -60, 230, 120, c, 1); ctx.restore(); label(s, x, 450, 30, c, clamp(p), { bold: true });
    });
    richReveal([['[f(', OUTER], ['g(x)', INNER], [')]′ = f′(', OUTER], ['g(x)', INNER], [') · ', PROD], ['g′(x)', INNER]], CX, 640, 44, t, P('C10', 0.65), { alpha: pa, upright: true });
  }
  if (t > S('C11') - 0.1) {
    const a = ap(t, 'C11', 0.2), G = { cx: 980, cy: 470, ux: 34, uy: 34, x0: -6, x1: 6, y0: -5.5, y1: 5.5 }, p = prog(t, P('C11', 0.25), 0.9);
    if (p > 0) { ctx.save(); ctx.globalAlpha *= a; glowPath(() => ctx.arc(980, 470, 5 * 34, -PI2h(), -PI2h() + 2 * Math.PI * p), INV, 4.5, 1); ctx.restore(); }
    mathText('x^2 + y^2 = 25', 980, 480, 34, CR, { align: 'center', alpha: a, upright: true });
    glowText('下一段：隐函数求导', CX, 720, 50, CR, t, P('C11', 0.35));
  }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 3 章 · P4 链式法则', '下一段：隐函数求导', [...CREDIT_BASE,
    '豆包娘立绘：ZipZipPipe 的 Seed/豆包拟人设定，复制自本系列 AI娘 Git 课素材。',
    '豆包声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、豆包 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};
const PI2h = () => Math.PI / 2;

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.05, 'hum', 0.16); s('D01', 0.4, 'pop', 0.22); s('C01', 0.3, 'type', 0.14); s('C01', 0.62, 'type', 0.14); s('C01', 0.86, 'ding', 0.24);
  s('C02', 0.1, 'whoosh', 0.16); s('C02', 0.25, 'pop', 0.2); s('C02', 0.45, 'pop', 0.2); s('C02', 0.65, 'pop', 0.2);
  s('B01', 0.15, 'swoosh_in', 0.16); s('B01', 0.4, 'sparkle', 0.18); s('C03', 0.05, 'buzz', 0.22); s('C03', 0.45, 'pluck', 0.22); s('C03', 0.85, 'check', 0.26); s('B02', 0.1, 'slap', 0.16);
  s('G01', 0.05, 'whoosh', 0.16); s('G01', 0.35, 'pop', 0.2); s('G02', 0.15, 'ding', 0.24);
  s('C04', 0.1, 'type', 0.14); s('C04', 0.8, 'pop', 0.2); s('C04', 0.9, 'ding_hi', 0.24); s('C05', 0.1, 'hum', 0.16); [0.45, 0.6, 0.75].forEach(f => s('C05', f, 'marimba', 0.22)); s('D02', 0.2, 'sparkle', 0.2);
  s('C06', 0.12, 'swoosh_in', 0.16); s('C06', 0.5, 'type', 0.14); s('C06', 0.8, 'ding', 0.24);
  s('G03', 0.25, 'type', 0.14); s('G03', 0.5, 'type', 0.14); s('G04', 0.1, 'type', 0.14); s('G04', 0.35, 'riser', 0.12); s('G04', 0.7, 'ding_hi', 0.26); s('G04', 0.85, 'pluck', 0.2);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.85, 'check', 0.28); s('B03', 0.85, 'check', 0.28);
  s('C10', 0.1, 'pop', 0.22); s('C10', 0.28, 'pop', 0.22); s('C10', 0.46, 'pop', 0.22); s('C11', 0.25, 'swoosh_in', 0.16); s('C11', 0.35, 'swell', 0.3);
})();
finalize();
