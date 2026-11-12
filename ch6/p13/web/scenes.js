// 第 6 章 P13《液体的压力》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济 6.3 / Stewart 8.3。
// A284 压强随深度渐变（颜色）· A285 水平窄条受力箭头 · A286 闸门下沉对比
const SC = {};
const TITLES = [['press', '压强与深度'], ['strip', '水平窄条'], ['trap', '梯形闸门'], ['quiz', '随堂一题'], ['outro', '小结']];

const WS = 470, MU = 90; // 水面 y、每米像素
const dep = h => WS + h * MU;
function water(a, x0 = 560, x1 = 1060, hmax = 4.4) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, WS, 0, dep(hmax)); g.addColorStop(0, 'rgba(110,190,240,0.25)'); g.addColorStop(1, 'rgba(20,60,160,0.75)');
  ctx.fillStyle = g; ctx.fillRect(x0, WS, x1 - x0, hmax * MU); ctx.restore();
  seg(x0, WS, x1, WS, '#9fd8ff', a, 2.5);
}
function dam(a, x = 1060) { // 坝体：上窄下宽
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.moveTo(x, WS - 60); ctx.lineTo(x + 50, WS - 60); ctx.lineTo(x + 220, dep(4.4)); ctx.lineTo(x, dep(4.4)); ctx.closePath();
  ctx.fillStyle = 'rgba(170,170,185,0.55)'; ctx.fill(); ctx.strokeStyle = 'rgba(220,220,235,0.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
function depthAxis(a, x = 540, n = 4) { seg(x, WS, x, dep(n), CR, a, 2); for (let h = 0; h <= n; h++) { seg(x - 8, dep(h), x, dep(h), CR, a, 2); mathText(`${h}`, x - 14, dep(h) + 7, 20, CR, { align: 'right', alpha: a, upright: true }); } mathText('h（m）', x - 10, dep(n) + 36, 20, CR, { align: 'right', alpha: a, upright: true }); }
function pressArrows(a, x, hs, k = 22) { hs.forEach(h => { const L = 12 + h * k; arrow(x - L, dep(h), x, dep(h), RED, a, 2.5); }); }

// ======================= 压强与深度（A284） =======================
SC.press = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'N01', 0); water(a); dam(a); depthAxis(ap(t, 'C01', 0));
  if (t > S('C01')) { pressArrows(ap(t, 'C01', 0.3), 1060, [0.5, 1.5, 2.5, 3.5]); richReveal([['p = ', CR], ['ρ', CYAN], ['g', CR], ['h', GOLD], ['   越深越大', CR]], CX, 260, 40, t, P('C01', 0.2), { upright: true, alpha: fadeOut(t, S('C02')) }); }
  if (t > S('C02')) { richReveal([['F = pA', CR], ['  只在压强处处相同时成立', RED]], CX, 260, 36, t, P('C02', 0.1), { upright: true }); [0.6, 1.8, 3.0].forEach((h, i) => label(`p = ${(9.8 * h).toFixed(1)} kPa`, 1350, dep(h) + 8, 22, CR, ap(t, 'C02', 0.4 + i * 0.1), { bold: false })); }
};

// ======================= 水平窄条（A285） =======================
const GX0 = 700, GW = 4 * 70; // 闸门左 x、宽（4 m）
function gate(a, top = 0, H = 3, wfun = null) { // wfun(h) 宽度（m），以 GX0+GW/2 居中
  if (a <= 0) return; const c = GX0 + GW / 2, w = wfun || (() => 4);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.moveTo(c - w(0) * 35, dep(top)); ctx.lineTo(c + w(0) * 35, dep(top)); ctx.lineTo(c + w(H) * 35, dep(top + H)); ctx.lineTo(c - w(H) * 35, dep(top + H)); ctx.closePath();
  ctx.fillStyle = 'rgba(255,220,140,0.18)'; ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
}
SC.strip = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C03', 0); water(a, 560, 1120); depthAxis(a); gate(a);
  const c = GX0 + GW / 2;
  if (t < S('C05')) {
    const u = prog(t, P('C03', 0.2), D('C03') + D('C04') * 0.8), h = 0.4 + 2.2 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), q = ap(t, 'C03', 0.2);
    ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = hexA(GOLD, 0.75); ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.fillRect(GX0, dep(h), GW, 0.14 * MU); ctx.restore();
    for (let i = 0; i < 5; i++) arrow(GX0 + 28 + i * 56, dep(h) - 40 - h * 10, GX0 + 28 + i * 56, dep(h) - 2, RED, q * ap(t, 'C04', 0.2), 2);
    seg(GX0 + GW + 30, WS, GX0 + GW + 30, dep(h), CYAN, q, 2, [5, 4]); mathText('h', GX0 + GW + 42, (WS + dep(h)) / 2, 26, CYAN, { alpha: q });
    if (t > S('C04')) { mathText('dh', GX0 - 16, dep(h) + 14, 22, GOLD, { align: 'right', alpha: q }); mathText('w(h)', c, dep(h) + 0.14 * MU + 30, 22, GOLD, { align: 'center', alpha: q }); richReveal([['dF = ', CR], ['ρg', CYAN], ['·', CR], ['h', CYAN], ['·', CR], ['w(h) dh', GOLD]], CX, 260, 42, t, P('C04', 0.3), { upright: true, alpha: fadeOut(t, S('G01')) }); }
  }
  if (t > S('G01')) {
    const g = ap(t, 'G01', 0.2); seg(GX0, dep(3) + 26, GX0 + GW, dep(3) + 26, CR, g, 2); mathText('4 m', c, dep(3) + 56, 24, CR, { align: 'center', alpha: g, upright: true }); mathText('3 m', GX0 - 16, dep(1.5), 24, CR, { align: 'right', alpha: g, upright: true });
    if (t < S('C05')) richReveal([['矩形：', CR], ['w(h) = 4', GOLD]], CX, 260, 40, t, P('G01', 0.3), { upright: true });
  }
  if (t > S('C05')) {
    const n = Math.floor(lerp(1, 12, eIO(prog(t, P('C05', 0.05), D('C05') * 0.6))));
    for (let i = 0; i < n; i++) { const h = (i + 0.5) * 0.25; ctx.save(); ctx.globalAlpha *= 0.25 + 0.6 * h / 3; ctx.fillStyle = GOLD; ctx.fillRect(GX0, dep(i * 0.25) + 1, GW, 0.25 * MU - 2); ctx.restore(); }
    richReveal([['F = ', CR], ['∫', GOLD], ['₀³ 1000·9.8·h·4 dh = ', CR], ['176400 N', GOLD]], CX, 260, 38, t, P('C05', 0.2), { upright: true });
  }
  if (t > S('N02')) label('≈ 18 吨重！', 960, 345, 32, SQ.N.col, ap(t, 'N02', 0.1), { bold: true });
};

// ======================= 梯形闸门 =======================
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C06', 0), wt = h => 6 - 2 * h / 3; water(a, 560, 1120); depthAxis(a);
  const m = eIO(prog(t, P('C06', 0.2), 1.0)); gate(a, 0, 3, h => lerp(4, wt(h), m));
  const c = GX0 + GW / 2;
  if (t > S('C06')) { const u = prog(t, P('C06', 0.4), D('C06') * 0.5 + D('C07')), h = 0.3 + 2.4 * (0.5 - 0.5 * Math.cos(u * 2 * Math.PI)), w = wt(h) * 35; ctx.save(); ctx.globalAlpha *= ap(t, 'C06', 0.4) * m; ctx.fillStyle = hexA(GOLD, 0.75); ctx.fillRect(c - w, dep(h), 2 * w, 0.14 * MU); ctx.restore(); seg(c - w, dep(h) - 14, c + w, dep(h) - 14, CYAN, ap(t, 'C06', 0.4) * m, 2); mathText('w(h)', c, dep(h) - 22, 22, CYAN, { align: 'center', alpha: ap(t, 'C06', 0.4) * m }); }
  if (t > S('C07')) {
    const g = ap(t, 'C07', 0.1); mathText('6 m', c, WS - 16, 22, CR, { align: 'center', alpha: g, upright: true }); mathText('4 m', c, dep(3) + 34, 22, CR, { align: 'center', alpha: g, upright: true });
    richReveal([['w(h) = 6 − (2/3)h', CYAN]], CX, 240, 38, t, P('C07', 0.3), { upright: true });
    richReveal([['F = ', CR], ['∫', GOLD], ['₀³ ρg·h·', CR], ['(6 − (2/3)h)', CYAN], [' dh', CR]], CX, 320, 36, t, P('C07', 0.55), { upright: true });
  } else richReveal([['只换 ', CR], ['w(h)', CYAN], ['，积分照旧', CR]], CX, 260, 38, t, P('C06', 0.3), { upright: true });
};

// ======================= 随堂（A286） =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['闸门再下沉 1 m：F 变大还是变小？', CR]], 800, 300, 38, t, P('C09', 0.05), { upright: true });
  const a = ap(t, 'C09', 0.2), sink = t > S('N03') ? eIO(prog(t, P('N03', 0.05), 0.9)) : 0;
  water(a, 560, 1120, 4.4); depthAxis(a, 540, 4); gate(a * 0.35); gate(a, sink, 3);
  if (t > S('N03')) {
    pressArrows(ap(t, 'N03', 0.2), GX0, [0.5 + sink, 1.5 + sink, 2.5 + sink]);
    richReveal([['h → h + 1：', CR], ['∫', GOLD], ['₁⁴ 39200h dh = ', CR], ['294000 N', GOLD]], 1160, 450, 30, t, P('N03', 0.35), { upright: true });
    label('变大！', 1160, 530, 46, GOLD, ap(t, 'N03', 0.1), { bold: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C10', 0) * fadeOut(t, S('C11'), 0.4);
  if (ga > 0) { water(ga, 560, 1120); gate(ga); for (let i = 0; i < 12; i++) { ctx.save(); ctx.globalAlpha *= ga * (0.2 + 0.5 * i / 12); ctx.fillStyle = GOLD; ctx.fillRect(GX0, dep(i * 0.25) + 1, GW, 0.25 * MU - 2); ctx.restore(); } richReveal([['F = ', CR], ['∫', GOLD], [' ρg·h·w(h) dh', GOLD]], CX, 260, 42, t, P('C10', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C11') - 0.1) { glowText('下一段：收束 · 出口票', CX, 500, 52, CR, t, P('C11', 0.15)); glowText('Grok：这是真的吗？', CX, 590, 32, SQ.X.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 6 章 · P13 液体的压力', '下一段：收束 · 出口票', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM6('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.1, 'pop', 0.16); s('C01', 0.2, 'type', 0.14); s('C01', 0.3, 'whoosh', 0.14); s('C02', 0.1, 'buzz', 0.14);
  s('C03', 0.2, 'whoosh', 0.14); s('C04', 0.3, 'type', 0.14); s('G01', 0.2, 'pop', 0.16); s('C05', 0.05, 'riser', 0.18); s('C05', 0.2, 'ding_hi', 0.24); s('N02', 0.1, 'impact', 0.18);
  s('C06', 0.2, 'warp', 0.16); s('C07', 0.3, 'type', 0.14); s('C07', 0.55, 'ding', 0.2);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('N03', 0.05, 'whoosh', 0.14); s('N03', 0.35, 'ding_hi', 0.28);
  s('C10', 0.15, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
