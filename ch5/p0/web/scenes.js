// 第 5 章 P0《阿基米德切抛物线》（2026-10-29）：数学画面全部原创 Canvas 绘制。
// A186 抛物线弓形里三角形逐层填入 · A187 面积条 1、1/4、1/16… 累加逼近 4/3 · A188 本章地图
const SC = {};
const TITLES = [['hook', '弯曲的边'], ['tri', '一层层三角形'], ['sum', '加起来'], ['map', '本章地图'], ['quiz', '随堂一题'], ['outro', '小结']];
const PF = x => 4 - x * x;
const GP = { cx: 1000, cy: 760, ux: 165, uy: 105, x0: -2.7, x1: 2.7, y0: -0.4, y1: 4.7 };
const TRI_COL = [GOLD, CYAN, GRN, INV, '#FF8A3D', '#FF6FA8'];
function chords(k) { let L = [[-2, 2]]; for (let i = 0; i < k; i++) L = L.flatMap(([a, b]) => { const m = (a + b) / 2; return [[a, m], [m, b]]; }); return L; }
function drawLevel(k, a, o = {}) {
  if (a <= 0) return; const c = TRI_COL[k % TRI_COL.length];
  ctx.save(); ctx.globalAlpha *= a;
  chords(k).forEach(([p, q]) => {
    const m = (p + q) / 2; ctx.beginPath(); ctx.moveTo(gx(GP, p), gy(GP, PF(p))); ctx.lineTo(gx(GP, m), gy(GP, PF(m))); ctx.lineTo(gx(GP, q), gy(GP, PF(q))); ctx.closePath();
    ctx.fillStyle = hexA(c, o.hi ? 0.5 : 0.3); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = k > 3 ? 1 : 2.2; ctx.shadowColor = c; ctx.shadowBlur = o.hi ? 14 : 6; ctx.stroke();
  });
  ctx.restore();
}
function parabolaScene(t, a) {
  gAxes(GP, a, { grid: false, xl: 'x' });
  gArea(GP, PF, -2, 2, a * 0.6, { pos: 'rgba(92,200,232,0.16)' });
  gPlot(GP, PF, RED, { a, xa: -2.4, xb: 2.4, w: 4.5 });
  seg(gx(GP, -2), gy(GP, 0), gx(GP, 2), gy(GP, 0), CR, a, 3);
}

// ======================= 弯曲的边 =======================
SC.hook = t => {
  starfield(t); blueprint(0.4, 80);
  if (t < S('C01') - 0.1) {
    const a = ap(t, 'D01', 0);
    // 直边图形：矩形、三角形、多边形
    const shp = [[640, '长方形'], [900, '三角形'], [1160, '多边形']];
    shp.forEach(([x, s], i) => {
      const p = ap(t, 'D01', 0.05 + i * 0.1); if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p; ctx.strokeStyle = CYAN; ctx.fillStyle = 'rgba(92,200,232,0.15)'; ctx.lineWidth = 3; ctx.beginPath();
      if (i === 0) ctx.rect(x - 90, 400, 180, 120); else if (i === 1) { ctx.moveTo(x - 100, 520); ctx.lineTo(x + 100, 520); ctx.lineTo(x - 20, 390); ctx.closePath(); } else { for (let k = 0; k < 6; k++) { const th = k * Math.PI / 3; ctx.lineTo(x + 95 * Math.cos(th), 460 + 70 * Math.sin(th)); } ctx.closePath(); }
      ctx.fill(); ctx.stroke(); ctx.restore(); label(s, x, 575, 26, CYAN, p, { bold: true }); checkMark(x + 80, 380, 16, GRN, t, P('D01', 0.15 + i * 0.1));
    });
    const q = ap(t, 'D01', 0.55);
    if (q > 0) { const G = { cx: 1420, cy: 560, ux: 60, uy: 40, x0: -2.4, x1: 2.4, y0: -0.3, y1: 4.5 }; gArea(G, PF, -2, 2, q); gPlot(G, PF, RED, { a: q, xa: -2.3, xb: 2.3 }); seg(gx(G, -2), gy(G, 0), gx(G, 2), gy(G, 0), CR, q, 3); label('？', 1420, 470, 64, GOLD, q * (0.7 + 0.3 * Math.sin(t * 5)), { bold: true }); }
    return;
  }
  const a = ap(t, 'C01', 0);
  parabolaScene(t, a);
  label('公元前 3 世纪 · 阿基米德', CX, 210, 30, SQ.Z.col, ap(t, 'C01', 0.3), { bold: true });
  if (t > S('Z01')) { drawLevel(0, ap(t, 'Z01', 0.4), { hi: true }); label('第一个三角形', gx(GP, 0), gy(GP, 1.4), 26, GOLD, ap(t, 'Z01', 0.6), { bold: true }); }
};

// ======================= 一层层三角形（A186） =======================
const LV_T = [0, 0.1, 0.45, 0.7, 0.85, 0.95];
SC.tri = t => {
  starfield(t); blueprint(0.4, 80);
  parabolaScene(t, 1);
  const lv = k => k === 0 ? 1 : ap(t, 'Z02', LV_T[k], 0.5);
  const hiK = t > S('C02') && t < E('C02') ? 1 : -1;
  for (let k = 0; k <= 5; k++) drawLevel(k, lv(k), { hi: k === hiK || (hiK === 1 && k === 0) });
  // 层数与面积
  const AREA = ['8', '2', '1/2', '1/8', '1/32', '1/128'];
  // 每层面积：横排一行（第 k 层 → 面积）
  for (let k = 0; k <= 5; k++) { const p = lv(k); if (p <= 0) continue; const x = 600 + k * 160; mathText(`第 ${k} 层`, x, 270, 20, TRI_COL[k], { align: 'center', alpha: p, upright: true }); mathText(AREA[k], x, 305, 28, TRI_COL[k], { align: 'center', alpha: p, upright: true }); if (k) label('×1/4', x - 80, 290, 18, GOLD, ap(t, 'C02', 0.3) * p, { font: F_MATH }); }
  if (t > S('C02')) richReveal([['每层面积 = 上一层 × 1/4', GOLD]], CX, 205, 34, t, P('C02', 0.2), { upright: true });
  if (t > S('D02')) { const d = ap(t, 'D02', 0); label('无穷多层 → 面积无穷大？', CX, 870, 32, SQ.D.col, d * fadeOut(t, S('G01') + 0.2), { bold: true }); }
  if (t > S('G01')) { richReveal([['1 + 1/4 + 1/16 + 1/64 + …', CR], ['  越加越少，有上限', GRN]], CX, 870, 30, t, P('G01', 0.2), { upright: true }); }
};

// ======================= 加起来（A187） =======================
SC.sum = t => {
  starfield(t); blueprint(0.4, 80);
  const X0 = 560, U = 660, Y = 470, a = ap(t, 'C03', 0);
  label('以第一个三角形的面积为 1', CX, 260, 28, CR, a, { bold: true });
  let x = X0; const n = 9, sp = eIO(prog(t, P('C03', 0.05), 2.2));
  for (let k = 0; k < n; k++) {
    const w = U * Math.pow(0.25, k), p = clamp(sp * n - k); if (p <= 0) break; const c = TRI_COL[k % TRI_COL.length];
    ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = hexA(c, 0.55); ctx.fillRect(x, Y - 40, w * p, 80); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, Y - 40, w * p, 80); ctx.restore();
    if (k < 3) mathText(['1', '1/4', '1/16'][k], x + w / 2, Y + 70, 26, c, { align: 'center', alpha: p, upright: true });
    x += w;
  }
  const xe = X0 + U * 4 / 3; seg(xe, Y - 80, xe, Y + 60, GOLD, a, 3, [10, 8]); mathText('4/3', xe, Y - 105, 34, GOLD, { align: 'center', alpha: ap(t, 'C03', 0.5), upright: true });
  richReveal([['1 + 1/4 + 1/16 + … = ', CR], ['1/(1 − 1/4)', CYAN], [' = ', CR], ['4/3', GOLD]], CX, 650, 40, t, P('C03', 0.35), { upright: true });
  if (t > S('Z03') - 0.1) richReveal([['弓形面积 = ', CR], ['4/3', GOLD], [' × 第一个三角形', CR]], CX, 760, 36, t, P('Z03', 0.2), { upright: true });
  if (t > S('C04') - 0.1) { const c = ap(t, 'C04', 0.3); panel(560, 830, 840, 90, GOLD, c); label('穷竭法：切细 → 求和 → 取极限', CX, 875, 36, GOLD, c, { bold: true }); }
};

// ======================= 本章地图（A188） =======================
const MAP5 = [['面积与路程', 'P2–P3', CYAN, 'C06', 0.05], ['定积分', 'P4–P6', GOLD, 'C06', 0.25], ['基本定理', 'P7–P10', RED, 'C06', 0.5], ['积分方法', 'P11–P14', GRN, 'G02', 0.15], ['反常积分', 'P15', INV, 'G02', 0.55]];
SC.map = t => {
  starfield(t); blueprint(0.4, 80);
  glowText('第 5 章 · 积分', CX, 250, 60, GOLD, t, P('C05', 0.05));
  richReveal([['切细、求和、取极限  ⇒  ', CR], ['∫', GOLD]], CX, 350, 38, t, P('C05', 0.4), { upright: true });
  MAP5.forEach(([s, sub, c, id, f], i) => {
    const p = ap(t, id, f); if (p <= 0) return; const x = 560 + i * 225, y = 560;
    if (i) arrowH(x - 150, x - 76, y, hexA(c, 0.8), p);
    ctx.save(); ctx.globalAlpha *= p; ctx.beginPath(); ctx.arc(x, y, 72, 0, 7); ctx.fillStyle = hexA(c, 0.16); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.shadowColor = c; ctx.shadowBlur = 14; ctx.stroke(); ctx.restore();
    label(s, x, y - 6, 24, c, p, { bold: true }); label(sub, x, y + 30, 20, CR, p, { font: F_MATH });
  });
  if (t > P('C06', 0.55)) { const p = ap(t, 'C06', 0.6); label('导数 ⟷ 积分  互为逆运算', CX + 0, 720, 32, RED, p, { bold: true }); }
  if (t > S('D03')) label('本鲸准备好了！', CX, 820, 36, SQ.D.col, ap(t, 'D03', 0.2), { bold: true });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['1 + 1/4 + 1/16 + 1/64 + … = ？', CR]], 800, 330, 42, t, P('C08', 0.1), { upright: true });
  if (t > S('D04')) { richReveal([['首项 1，公比 1/4', CYAN]], 800, 470, 34, t, P('D04', 0.1), { upright: true }); richReveal([['= ', CR], ['4/3', GOLD]], 800, 580, 52, t, P('D04', 0.55), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { drawLevel(0, ga * 0.8); for (let k = 1; k <= 4; k++) drawLevel(k, ga * 0.8); gPlot(GP, PF, RED, { a: ga, xa: -2.3, xb: 2.3 }); richReveal([['弯曲的面积 ≈ 无穷多块直边图形', GOLD]], CX, 250, 40, t, P('C09', 0.15), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：高中速通 · 求和与 Σ', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('Kimi 背公式', CX, 590, 32, SQ.K.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 5 章 · P0 阿基米德切抛物线', '下一段：高中速通', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM5('GLM')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  [0.15, 0.25, 0.35].forEach(f => s('D01', f, 'check', 0.12)); s('D01', 0.55, 'pop', 0.18);
  s('C01', 0.3, 'shimmer', 0.18); s('Z01', 0.4, 'slam', 0.2);
  LV_T.slice(1).forEach(f => s('Z02', f, 'pluck', 0.14)); s('C02', 0.2, 'ding', 0.2); s('G01', 0.2, 'type', 0.14);
  s('C03', 0.05, 'whoosh', 0.16); s('C03', 0.5, 'ding_hi', 0.24); s('Z03', 0.2, 'type', 0.14); s('C04', 0.3, 'swell', 0.22);
  s('C05', 0.05, 'shimmer', 0.2); MAP5.forEach(([, , , id, f]) => s(id, f, 'pop', 0.16)); s('D03', 0.2, 'sparkle', 0.2);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D04', 0.1, 'type', 0.14); s('D04', 0.55, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
