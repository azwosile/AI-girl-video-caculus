// 第 3 章 P8《相关变化率》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A112 梯子滑落，两端速度箭头 · A113 气球膨胀：体积匀速、半径越涨越慢 · A115 “对 t 求导”把几个量串成齿轮链 · MiniMax 的胶片慢镜头框
const SC = {};
const TITLES = [['method', '几个量一起变'], ['ladder', '梯子滑落'], ['balloon', '气球膨胀'], ['quiz', '随堂一题'], ['outro', '小结']];
const NC = SQ.N.col, PI = Math.PI;
// 梯子：墙角 (WX, WY)，每米 LU 像素
const WX = 680, WY = 840, LU = 52;
function ladderScene(x, a, o = {}) {
  if (a <= 0) return; const y = Math.sqrt(Math.max(0, 100 - x * x));
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(237,230,216,0.08)'; ctx.fillRect(WX - 30, WY - 560, 30, 560); ctx.fillRect(WX - 30, WY, 640, 20);
  ctx.restore();
  seg(WX, WY - 560, WX, WY, CR, a, 3); seg(WX, WY, WX + 610, WY, CR, a, 3);
  const bx = WX + x * LU, ty = WY - y * LU;
  // 梯子两根边 + 横档
  const nx = (WX - bx) / (10 * LU), ny = (ty - WY) / (10 * LU), px = -ny * 9, py = nx * 9;
  seg(bx + px, WY + py, WX + px, ty + py, GOLD, a, 4); seg(bx - px, WY - py, WX - px, ty - py, GOLD, a, 4);
  for (let i = 1; i < 10; i++) { const X = lerp(bx, WX, i / 10), Y = lerp(WY, ty, i / 10); seg(X + px, Y + py, X - px, Y - py, GOLD, a * 0.8, 2.5); }
  if (o.labels) { label('x', (WX + bx) / 2, WY + 40, 30, CYAN, a, { font: F_MATH, bold: true }); label('y', WX - 50, (WY + ty) / 2, 30, CYAN, a, { font: F_MATH, bold: true }); label('10', (WX + bx) / 2 + 26, (WY + ty) / 2 - 20, 26, GOLD, a, { font: F_MATH, bold: true }); }
  if (o.vel) { const vx = 1, vy = x / Math.max(0.3, y); arrowH(bx, bx + vx * 60, WY + 70, GRN, a, 4); arrowV(WX + 40, ty, ty + Math.min(320, vy * 60), RED, a, 4); if (o.vlab) { label(o.vlab[0], bx + 40, WY + 104, 24, GRN, a, { bold: true }); label(o.vlab[1], WX + 140, ty + 30, 24, RED, a, { bold: true }); } }
  return y;
}
// 胶片框
function filmFrame(t, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = NC; ctx.lineWidth = 4; ctx.shadowColor = NC; ctx.shadowBlur = 16; rr(610, 180, 750, 740, 10); ctx.stroke();
  ctx.fillStyle = 'rgba(8,10,20,0.9)'; ctx.fillRect(610, 180, 40, 740); ctx.fillRect(1320, 180, 40, 740);
  ctx.fillStyle = hexA(NC, 0.8); for (let i = 0; i < 12; i++) { const y = 200 + ((i * 62 + t * 30) % 720); ctx.fillRect(620, y, 20, 28); ctx.fillRect(1330, y, 20, 28); }
  ctx.restore();
  label('● REC  慢镜头 ×0.25', 990, 215, 24, NC, a * (0.6 + 0.4 * Math.sin(t * 6)), { bold: true, font: F_BODY });
}

// ======================= method（A112 引子 + A115） =======================
SC.method = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C01'), 0.35);
  if (pa > 0) {
    const slow = t > S('N01') ? 0.25 : 1, tt = t < S('N01') ? t : S('N01') + (t - S('N01')) * 0.25;
    const x = 2 + ((tt * 1.3) % 7);
    ladderScene(x, pa, { vel: t > P('D01', 0.4), labels: false });
    filmFrame(t, ap(t, 'N01', 0.05) * pa);
    if (t < S('N01')) label('底端匀速 → 顶端也匀速？', 1030, 300, 30, CR, ap(t, 'D01', 0.3), { bold: true });
    if (t > S('N01')) label('几个量同时在变', 1060, 300, 30, NC, ap(t, 'N01', 0.4) * pa, { bold: true });
  }
  if (t > S('C01') - 0.1) {
    const ca = fadeOut(t, S('C02'), 0.35) * 0.65 + 0.35;
    [['① 写出关系', CR], ['② 两边对 t 求导', GOLD], ['③ 代入瞬时值', GRN]].forEach(([s, c], k) => { const p = eBack(prog(t, P('C01', 0.08 + 0.28 * k), 0.4)); if (p <= 0) return; const y = 300 + k * 110; ctx.save(); ctx.translate(980, y); ctx.scale(p, p); panel(-230, -42, 460, 84, c, ca); ctx.restore(); label(s, 980, y, 32, c, clamp(p) * ca, { bold: true }); });
  }
  if (t > S('C02') - 0.1) {
    const a = ap(t, 'C02', 0.05), ch = gearChain(820, 760, [{ n: 22, col: CR }, { n: 14, col: CYAN }], 5, [0]);
    drawChain(ch, t * 1.0, 5, a);
    const g3 = gearChain(820, 760, [{ n: 22, col: CR }, { n: 14, col: RED }], 5, [PI]); drawChain([g3[1]], t * 1.0, 5, a);
    label('t', 820, 760, 30, CR, a, { font: F_MATH, bold: true }); label('x(t)', ch[0].x + ch[0].R + ch[1].R, 760 + 90, 26, CYAN, a, { font: F_MATH, bold: true }); label('y(t)', 820 - ch[0].R - g3[1].R, 760 + 90, 26, RED, a, { font: F_MATH, bold: true });
    label('每个量都是 t 的函数 → 链式法则', 1120, 650, 26, GOLD, ap(t, 'C02', 0.4), { bold: true });
  }
};

// ======================= ladder（A112） =======================
SC.ladder = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C03', 0.02);
  // x 随时间：C03–C04 在 3 附近缓移；G01 停在 6；D02 继续滑到 9.6
  const x = t < S('G01') ? 3 + 0.6 * clamp((t - S('C03')) / (S('G01') - S('C03'))) : t < S('D02') ? lerp(3.6, 6, eIO(prog(t, S('G01'), 0.8))) : lerp(6, 9.6, eIO(prog(t, P('D02', 0.05), D('D02') * 0.85)));
  const y = ladderScene(x, a, { labels: true, vel: t > S('G01'), vlab: t > S('G01') && t < S('D02') + 0.3 ? ['1 m/s', '0.75 m/s'] : null });
  richReveal([['x^2 + y^2 = 100', CR]], 1180, 290, 38, t, P('C03', 0.6));
  if (t > S('C04')) { richReveal([['2x · x′ + 2y · y′ = 0', GOLD]], 1150, 380, 32, t, P('C04', 0.05)); richReveal([['y′ = −(x / y) · x′', GRN]], 1150, 460, 38, t, P('C04', 0.6)); }
  if (t > S('G01')) { const g = ap(t, 'G01', 0.2); panel(1000, 520, 340, 120, GRN, g); mathText('x = 6, y = 8', 1170, 566, 28, CR, { align: 'center', alpha: g }); mathText('y′ = −(6/8) · 1 = −0.75', 1170, 616, 26, GRN, { align: 'center', alpha: ap(t, 'G01', 0.5) }); }
  if (t > S('D02')) { ratioTag('顶端速度 ' + (x / Math.max(0.3, y)).toFixed(2) + ' m/s', 1170, 720, RED, ap(t, 'D02', 0.1), { size: 26 }); }
};

// ======================= balloon（A113） =======================
const r0 = 6;   // 起始半径（画面单位）
function balloon(x, y, R, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const g = ctx.createRadialGradient(x - R * 0.35, y - R * 0.4, R * 0.1, x, y, R);
  g.addColorStop(0, '#ffd0dc'); g.addColorStop(0.5, NC); g.addColorStop(1, '#5a0f22'); ctx.fillStyle = g; ctx.shadowColor = NC; ctx.shadowBlur = 24;
  ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(237,230,216,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + R); ctx.quadraticCurveTo(x - 20, y + R + 60, x + 6, y + R + 120); ctx.stroke(); ctx.restore();
}
SC.balloon = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C05', 0.02), T0 = S('C05'), T1 = E('G02'), u = clamp((t - T0) / (T1 - T0));
  const V = lerp(0.15, 1, u), R = 175 * Math.cbrt(V);   // 体积匀速
  const pa = fadeOut(t, S('N02'), 0.4) * 0.7 + 0.3;
  balloon(820, 520, R, a);
  if (t > P('C05', 0.6)) { seg(820, 520, 820 + R, 520, CR, a, 2.5, [6, 5]); label('r', 820 + R / 2, 500, 28, CR, a, { font: F_MATH, bold: true }); }
  richReveal([['dV/dt = 100 cm³/s', NC]], 1180, 260, 32, t, P('C05', 0.2), { alpha: pa });
  richReveal([['直径 50 → r = 25', CR]], 1180, 320, 30, t, P('C05', 0.6), { alpha: pa, upright: true });
  if (t > S('C06')) { richReveal([['V = (4/3)πr³', CR]], 1180, 400, 34, t, P('C06', 0.05), { alpha: pa, upright: true }); richReveal([['V′ = 4πr² · r′', GOLD]], 1180, 470, 34, t, P('C06', 0.5), { alpha: pa }); }
  if (t > S('C07')) { panel(1010, 520, 340, 120, GRN, ap(t, 'C07', 0.2) * pa); mathText('r′ = 1 / (25π)', 1180, 570, 32, GRN, { align: 'center', alpha: ap(t, 'C07', 0.2) * pa, upright: true }); mathText('≈ 0.013 cm/s', 1180, 620, 28, GRN, { align: 'center', alpha: ap(t, 'C07', 0.5) * pa, upright: true }); }
  // N02：回放曲线 V(t) 与 r(t)
  if (t > S('N02') - 0.1) {
    const b = ap(t, 'N02', 0.05) * fadeOut(t, S('G02'), 0.35), G = { cx: 1030, cy: 900, ux: 300, uy: 200, x0: 0, x1: 1.05, y0: 0, y1: 1.2 }, pp = prog(t, P('N02', 0.1), 0.7 * D('N02'));
    panel(1000, 650, 360, 280, NC, b * 0.9); gAxes(G, b, { grid: false });
    gPlot(G, s => lerp(0.15, 1, s), NC, { a: b, xa: 0, xb: 1, p: pp, w: 3.5 }); gPlot(G, s => Math.cbrt(lerp(0.15, 1, s)), CYAN, { a: b, xa: 0, xb: 1, p: pp, w: 3.5 });
    label('V 匀速', 1110, 690, 22, NC, b, { bold: true }); label('r 越涨越慢', 1260, 720, 22, CYAN, b, { bold: true });
  }
  if (t > S('G02') - 0.1) {
    const g = ap(t, 'G02', 0.05), ch = gearChain(1090, 790, [{ n: 18, col: CR }, { n: 12, col: CYAN }, { n: 24, col: NC }], 4.5, [0, 0]);
    drawChain(ch, t * 1.1, 4.5, g); [['t', 0], ['r', 1], ['V', 2]].forEach(([s, i]) => label(s, ch[i].x, ch[i].y, 24, CR, g, { font: F_MATH, bold: true }));
    ratioTag('× 4πr²', (ch[1].x + ch[2].x) / 2, 690, GOLD, g, { size: 24 });
  }
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.4, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 58, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1290, 330);
  label('边长每秒 +2 cm，边长 5 cm 时，面积增长多快？', CX - 40, 230, 32, CR, ap(t, 'C09', 0.1), { bold: true });
  const a = ap(t, 'C09', 0.3), s = 5 + 0.35 * Math.sin((t - S('C09')) * 2), px = 44, x0 = 660, y0 = 860;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(GOLD, 0.18); ctx.fillRect(x0, y0 - s * px, s * px, s * px); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.strokeRect(x0, y0 - s * px, s * px, s * px); ctx.restore();
  label('s', x0 + s * px / 2, y0 + 30, 28, CYAN, a, { font: F_MATH, bold: true });
  if (t > S('D03')) { richReveal([['A = s²', CR]], 1150, 430, 38, t, P('D03', 0.1), { upright: true }); richReveal([['A′ = 2s · s′ = 2 × 5 × 2', GOLD]], 1120, 510, 32, t, P('D03', 0.35)); richReveal([['= 20 cm²/s', GRN]], 1150, 590, 40, t, P('D03', 0.7), { upright: true }); checkMark(1300, 580, 26, GRN, t, P('D03', 0.85)); }
};

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(0.4, 80);
  const pa = fadeOut(t, S('C11'), 0.4);
  if (pa > 0) [['写关系', CR], ['对 t 求导', GOLD], ['代瞬时值', GRN]].forEach(([s, c], k) => { const p = eBack(prog(t, P('C10', 0.1 + 0.18 * k), 0.4)) * pa; if (p <= 0) return; const x = 720 + 260 * k; ctx.save(); ctx.translate(x, 460); ctx.scale(p, p); panel(-110, -55, 220, 110, c, 1); ctx.restore(); label(s, x, 460, 30, c, clamp(p), { bold: true }); if (k < 2) arrowH(x + 118, x + 142, 460, CR, clamp(p)); });
  if (pa > 0) label('几个变化率，靠链式法则连在一起', CX, 600, 28, CR, ap(t, 'C10', 0.7) * pa, { bold: true });
  if (t > S('C11') - 0.1) {
    const a = ap(t, 'C11', 0.2), G = { cx: 760, cy: 640, ux: 85, uy: 85, x0: -0.3, x1: 5.4, y0: -0.3, y1: 3.2 }, z = eIO(prog(t, P('C11', 0.3), 1.2));
    gAxes(G, a, { grid: false }); gPlot(G, x => Math.sqrt(x), GOLD, { a }); gLine(G, 0.25, 4, 2, 2.4, 5.4, INV, a * z, 3); gDot(G, 4, 2, GOLD, a * z);
    glowText('下一段：线性化与微分', CX + 80, 780, 46, CR, t, P('C11', 0.3));
  }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 3 章 · P8 相关变化率', '下一段：线性化与微分', [...CREDIT_BASE,
    'MiniMax 娘立绘：依据 ZipZipPipe 设定由 AI 生成的本课差分。',
    'MiniMax 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    'Claude、GPT、DeepSeek、MiniMax 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.1, 'whoosh', 0.16); s('N01', 0.02, 'slam', 0.3); s('N01', 0.05, 'warp', 0.18); [0, 1, 2].forEach(k => s('C01', 0.08 + 0.28 * k, 'pop', 0.22)); s('C02', 0.05, 'hum', 0.16); s('C02', 0.4, 'ding', 0.2);
  s('C03', 0.6, 'type', 0.14); s('C04', 0.05, 'type', 0.14); s('C04', 0.6, 'ding', 0.22); s('G01', 0.2, 'click', 0.24); s('G01', 0.5, 'ding_hi', 0.24); s('D02', 0.05, 'riser', 0.14); s('D02', 0.9, 'thud', 0.26);
  s('C05', 0.2, 'swoosh_in', 0.14); s('C06', 0.05, 'type', 0.14); s('C06', 0.5, 'type', 0.14); s('C07', 0.2, 'ding_hi', 0.24); s('N02', 0.02, 'slam', 0.24); s('N02', 0.1, 'riser', 0.12); s('G02', 0.05, 'hum', 0.16);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.35, 'type', 0.14); s('D03', 0.85, 'check', 0.28);
  s('C10', 0.1, 'pop', 0.22); s('C10', 0.28, 'pop', 0.22); s('C10', 0.46, 'pop', 0.22); s('C11', 0.3, 'swell', 0.3);
})();
finalize();
