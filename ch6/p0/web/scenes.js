// 第 6 章 P0《祖暅原理》（2026-11-12）：数学画面全部原创 Canvas 绘制。
// A245 两摞金币一正一斜、逐层截面对照 · A246 半球与“圆柱挖倒锥”逐层截面对照 · A247 本章地图
const SC = {};
const TITLES = [['hook', '两摞金币'], ['zu', '祖暅原理'], ['ball', '球的体积'], ['map', '本章地图'], ['quiz', '随堂一题'], ['outro', '小结']];
const COIN = '#E8B830', NC = 16, CW = 200, CH = 18;
const shearOf = s => k => s * (k * 7.5 + 22 * Math.sin(k / NC * Math.PI));
function stacks(t, x1, x2, y, s, a, o = {}) {
  coinStack(x1, y, NC, CW * (o.sc || 1), CH * (o.sc || 1), () => 0, COIN, a);
  coinStack(x2, y, NC, CW * (o.sc || 1), CH * (o.sc || 1), k => shearOf(s)(k) * (o.sc || 1), COIN, a);
}
// 某一层硬币的高亮（扫描线）
function coinHi(x, y, k, sh, col, a, sc = 1) {
  if (a <= 0) return; const cx = x + sh, cy = y - k * CH * sc - CH * sc;
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.ellipse(cx, cy, CW * sc / 2 + 4, CW * sc * 0.16 + 3, 0, 0, 2 * Math.PI);
  ctx.fillStyle = hexA(col, 0.55); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.stroke(); ctx.restore();
}

// ======================= 两摞金币（A245） =======================
const HX1 = 760, HX2 = 1180, HY = 770;
SC.hook = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'Q01', 0), s = eIO(prog(t, P('Q01', 0.45), 1.0));
  stacks(t, HX1, HX2, HY, s, a);
  label('码正', HX1, HY + 70, 28, CR, a, { bold: true }); label('推歪', HX2 + 60 * s, HY + 70, 28, CR, ap(t, 'Q01', 0.5), { bold: true });
  if (t > S('Q02') && t < S('D01')) label('？', CX + 10, 520, 90, GOLD, ap(t, 'Q02', 0.2) * (0.75 + 0.25 * Math.sin(t * 5)), { bold: true });
  if (t > S('D01')) { label('=', CX + 10, 600, 86, GRN, ap(t, 'D01', 0.3), { bold: true }); label('硬币没变', CX + 10, 680, 26, GRN, ap(t, 'D01', 0.4), { bold: true }); }
  if (t > S('C01')) {
    // 扫描线从下往上走两趟，两边同一层的硬币同时高亮
    const u = prog(t, P('C01', 0.25), Math.max(1, D('C01') * 0.7)), k = Math.min(NC - 1, Math.floor((0.5 - 0.5 * Math.cos(u * 2 * Math.PI)) * NC * 0.999));
    const ya = HY - k * CH - CH / 2, ca = ap(t, 'C01', 0.2);
    seg(600, ya, 1380, ya, GOLD, ca * 0.9, 2.5, [12, 8]);
    coinHi(HX1, HY, k, 0, GOLD, ca); coinHi(HX2, HY, k, shearOf(1)(k), GOLD, ca);
    richReveal([['每个高度：截面 = 同一枚硬币', GOLD]], CX, 250, 36, t, P('C01', 0.35), { upright: true });
  }
};

// ======================= 祖暅原理 =======================
SC.zu = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['同一高度截面积处处相等  ', CR], ['⇒', GOLD], ['  体积相等', GOLD]], CX, 240, 38, t, P('C02', 0.1), { upright: true });
  const sa = ap(t, 'C02', 0) * 0.85; stacks(t, 920, 1060, 760, 1, sa * fadeOut(t, S('G01'), 0.4), { sc: 0.6 });
  if (t > S('G01') - 0.1) {
    const g = ap(t, 'G01', 0.35); panel(600, 340, 760, 150, GOLD, g);
    glowText('幂势既同，则积不容异', CX, 400, 54, GOLD, t, P('G01', 0.4));
    label('幂 = 截面积 · 势 = 高 · 积 = 体积', CX, 462, 24, CR, ap(t, 'G01', 0.7));
  }
  if (t > S('G01')) { // 时间轴
    const ta = ap(t, 'G01', 0.15), Y = 650, xa = 640, xb = 1300; seg(xa - 20, Y, xb + 40, Y, CR, ta * 0.7, 2.5); arrowH(xb + 20, xb + 50, Y, CR, ta * 0.7);
    glowDot(xa + 40, Y, 10, SQ.G.col, ta); label('祖冲之、祖暅父子', xa + 40, Y - 42, 24, SQ.G.col, ta, { bold: true }); label('公元 5–6 世纪', xa + 40, Y + 40, 22, CR, ta);
    const ca = ap(t, 'C03', 0.2); glowDot(xb - 40, Y, 10, CYAN, ca); label('卡瓦列里', xb - 40, Y - 42, 24, CYAN, ca, { bold: true }); label('1635 年', xb - 40, Y + 40, 22, CR, ca);
    if (ca > 0) { label('早了约 1100 年', (xa + xb) / 2, Y - 42, 28, GOLD, ap(t, 'C03', 0.5), { bold: true }); }
  }
};

// ======================= 球的体积（A246） =======================
const R0 = 2, GLH = { cx: 800, cy: 740, ux: 90, uy: 90 }, GRH = { cx: 1190, cy: 740, ux: 90, uy: 90 };
const OH = { axis: 'y', at: 0, e: 0.28 };
function discAt(G, h, rOut, rIn, col, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath();
  const m = 60; for (let i = 0; i <= m; i++) { const [x, y] = rvPt(G, OH, h, rOut, 2 * Math.PI * i / m); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.closePath();
  if (rIn > 0.01) { for (let i = m; i >= 0; i--) { const [x, y] = rvPt(G, OH, h, rIn, 2 * Math.PI * i / m); ctx[i === m ? 'moveTo' : 'lineTo'](x, y); } ctx.closePath(); }
  ctx.fillStyle = hexA(col, 0.7); ctx.fill('evenodd'); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.stroke(); ctx.restore();
}
const hemiR = h => Math.sqrt(Math.max(0, R0 * R0 - h * h));
SC.ball = t => {
  starfield(t); blueprint(0.35, 80);
  const la = ap(t, 'C04', 0.15), ra = ap(t, 'C05', 0.1);
  revSolid(GLH, { ...OH, R: hemiR, t0: 0, t1: R0 * 0.999, col: CYAN, a: la, Rmax: R0, rings: 5 });
  label('半球', GLH.cx, GLH.cy + 70, 28, CYAN, la, { bold: true });
  if (ra > 0) {
    revSolid(GRH, { ...OH, R: () => R0, r: h => h, t0: 0, t1: R0, col: GRN, a: ra, Rmax: R0, rings: 5 });
    label('圆柱 − 倒圆锥', GRH.cx, GRH.cy + 70, 28, GRN, ra, { bold: true });
  }
  mathText('r', GLH.cx + R0 * GLH.ux / 2, GLH.cy + 18, 26, CR, { align: 'center', alpha: la });
  // 高度 h 处的截面（C06 起，扫上扫下）
  const ca = ap(t, 'C06', 0.1) * fadeOut(t, S('C07'));
  if (ca > 0) {
    const u = prog(t, P('C06', 0.1), D('C06') + D('G02') + D('D02')), h = R0 * (0.25 + 0.55 * (0.5 - 0.5 * Math.cos(u * 3 * Math.PI)));
    const y = gy(GLH, h); seg(590, y, 1400, y, GOLD, ca, 2, [10, 8]); mathText('h', 1420, y + 9, 26, GOLD, { alpha: ca });
    discAt(GLH, h, hemiR(h), 0, GOLD, ca);
    if (t > S('G02')) discAt(GRH, h, R0, h, GOLD, ca * ap(t, 'G02', 0.1));
    richReveal([['π(r² − h²)', GOLD]], GLH.cx, 300, 36, t, P('C06', 0.5), { upright: true, alpha: ca });
    if (t > S('G02')) richReveal([['πr² − πh² = ', CR], ['π(r² − h²)', GOLD]], GRH.cx, 300, 34, t, P('G02', 0.4), { upright: true, alpha: ca });
    if (t > S('D02')) label('每一层都相等！', CX, 380, 34, SQ.D.col, ap(t, 'D02', 0.15), { bold: true });
  }
  if (t > S('C07') - 0.1) {
    richReveal([['V半球 = πr³ − ', CR], ['πr³/3', GRN], [' = ', CR], ['2πr³/3', GOLD]], CX, 260, 40, t, P('C07', 0.2), { upright: true });
    if (t > S('C08')) { const c = ap(t, 'C08', 0.2); panel(720, 320, 520, 84, GOLD, c); richReveal([['V球 = 4πr³/3', GOLD]], CX, 362, 44, t, P('C08', 0.25), { upright: true }); }
  }
};

// ======================= 本章地图（A247） =======================
const MAP6 = [['面积', 'P2–P3', CYAN, 'C10', 0.0], ['体积', 'P4–P8', GOLD, 'C10', 0.12], ['弧长 · 侧面积', 'P9–P10', GRN, 'C10', 0.35], ['做功', 'P11–P12', RED, 'C10', 0.6], ['压力', 'P13', INV, 'C10', 0.78]];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  glowText('第 6 章 · 积分的应用', CX, 240, 58, GOLD, t, P('C09', 0.05));
  richReveal([['每层截面积 A(x)  ⇒  V = ', CR], ['∫', GOLD], [' A(x) dx', CR]], CX, 345, 38, t, P('C09', 0.4), { upright: true });
  MAP6.forEach(([s, sub, c, id, f], i) => {
    const p = ap(t, id, f); if (p <= 0) return; const x = 590 + i * 195, y = 570;
    if (i) arrowH(x - 125, x - 72, y, hexA(c, 0.8), p);
    ctx.save(); ctx.globalAlpha *= p; ctx.beginPath(); ctx.arc(x, y, 66, 0, 7); ctx.fillStyle = hexA(c, 0.16); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.shadowColor = c; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
    label(s, x, y - 6, s.length > 3 ? 19 : 26, c, p, { bold: true }); label(sub, x, y + 30, 19, CR, p, { font: F_MATH });
  });
  if (t > S('C10')) label('同一招：切细 → 求和 → 取极限', CX, 710, 30, CR, ap(t, 'C10', 0.85), { bold: true });
  if (t > S('Q03')) label('十五段，本小姐包场～', CX, 810, 34, SQ.Q.col, ap(t, 'Q03', 0.15), { bold: true });
};

// ======================= 随堂 =======================
function pyramidPic(x, y, a) { // 正四棱锥
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const A = [x, y - 180], B = [[x - 90, y + 10], [x + 70, y + 10], [x + 110, y - 25], [x - 50, y - 25]];
  ctx.fillStyle = hexA(CYAN, 0.18); ctx.beginPath(); ctx.moveTo(...B[0]); B.forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = CYAN; ctx.lineWidth = 2.5; [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.moveTo(...B[i]); ctx.lineTo(...B[i + 1]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B[i]); ctx.stroke(); });
  ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(...B[3]); ctx.lineTo(...B[0]); ctx.moveTo(...B[3]); ctx.lineTo(...B[2]); ctx.moveTo(...A); ctx.lineTo(...B[3]); ctx.stroke(); ctx.restore();
}
function slantConePic(x, y, a) { // 斜圆锥
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const A = [x + 110, y - 180];
  ctx.beginPath(); ctx.ellipse(x, y - 8, 90, 24, 0, 0, 2 * Math.PI); ctx.fillStyle = hexA(GRN, 0.18); ctx.fill();
  ctx.strokeStyle = GRN; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y - 8, 90, 24, 0, 0, Math.PI); ctx.stroke();
  ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.ellipse(x, y - 8, 90, 24, 0, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x - 90, y - 8); ctx.lineTo(...A); ctx.lineTo(x + 90, y - 8); ctx.stroke(); ctx.restore();
}
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C11', 0, 0.5) * 0.42, 78);
  if (t < S('C12')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C11') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['正四棱锥 vs 斜圆锥', CR]], 800, 290, 40, t, P('C12', 0.05), { upright: true });
  richReveal([['底面积相同、高相同，谁的体积大？', CR]], 800, 360, 32, t, P('C12', 0.3), { upright: true });
  const pa = ap(t, 'C12', 0.2); pyramidPic(700, 700, pa); slantConePic(960, 700, pa);
  if (t > S('D03')) {
    const y = 610; seg(590, y, 1150, y, GOLD, ap(t, 'D03', 0.1), 2, [10, 8]);
    richReveal([['同高截面积都相等  ⇒  ', CR], ['体积相等', GOLD]], 860, 470, 36, t, P('D03', 0.35), { upright: true });
    stampMark(1240, 650, 70, t, P('D03', 0.6), { col: GRN, text: '相等' });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C13', 0) * fadeOut(t, S('C14'), 0.4);
  if (ga > 0) { stacks(t, 780, 1180, 760, 1, ga * 0.85); richReveal([['切成薄片，一层一层比', GOLD]], CX, 260, 42, t, P('C13', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C14') - 0.1) { glowText('下一段：高中速通 · 体积公式', CX, 500, 52, CR, t, P('C14', 0.15)); glowText('Kimi 背公式', CX, 590, 32, SQ.K.col, t, P('C14', 0.45), { bold: false }); }
  credits(t, E('C14') + 0.38, 'AI娘微积分课 · 第 6 章 · P0 祖暅原理', '下一段：高中速通', [...CREDIT_BASE, ...CREDIT_Q, ...CREDIT_END, CREDIT_TM6('千问（Qwen）')]);
};

SC.__overlay = t => { if (t < E('C14') + 0.25) lecturer(t, 'C', 255, -5, E('C14') + 0.48, { h: 710 }); };
SC.__noTag = E('C14') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C14') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('Q01', 0.05, 'shimmer', 0.18); s('Q01', 0.45, 'whoosh', 0.16); s('Q02', 0.2, 'pop', 0.18); s('D01', 0.3, 'ding', 0.2); s('C01', 0.3, 'pluck', 0.14);
  s('C02', 0.1, 'swell', 0.2); s('G01', 0.4, 'slam', 0.2); s('C03', 0.2, 'pop', 0.16); s('C03', 0.5, 'ding_hi', 0.2);
  s('C04', 0.15, 'pop', 0.16); s('C05', 0.1, 'pop', 0.16); s('C06', 0.1, 'whoosh', 0.16); s('G02', 0.1, 'ding', 0.18); s('D02', 0.15, 'sparkle', 0.18);
  s('C07', 0.2, 'type', 0.14); s('C08', 0.25, 'ding_hi', 0.26);
  s('C09', 0.05, 'shimmer', 0.2); MAP6.forEach(([, , , id, f]) => s(id, f, 'pop', 0.16)); s('Q03', 0.15, 'sparkle', 0.2);
  s('C11', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D03', 0.35, 'type', 0.14); s('D03', 0.6, 'ding_hi', 0.28);
  s('C13', 0.15, 'pop', 0.2); s('C14', 0.15, 'swell', 0.3);
})();
finalize();
