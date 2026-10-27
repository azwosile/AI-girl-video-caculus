// P3《性质的严格语言》v2（2026-10-27 重做）：所有数学画面为原创 Canvas 绘制；沿用共享时间轴与组件。
// 版面约定：讲师占 x<540；主内容区 x 600–1460（客串角色在右侧时不越界）；公式 44–60px；字幕区 y≥964 不放内容。
// 配色（制作规范“颜色语义”，10-27 统一）：函数曲线 f = 红，第二个函数 g = 绿，x / ∀x = 青，y 方向的界 M、K = 金，辅助 / 镜像 = 紫；三条曲线同屏时第三条用金色（cosh、sin x + sin √2x），属规范例外。
const SC = {};
const TITLES = [
  ['hook','看图为什么不够'], ['quant','任意与存在'], ['bound','有界与无界'],
  ['gem','图像之外的反例'], ['mono','单调要看区间'], ['parity','奇偶与分解'],
  ['period','周期与最小正周期'], ['quiz','随堂三题']
];
const TAU = Math.PI * 2, CR = COL.cream, RED = COL.red, GRN = COL.g, INV = COL.inv;
const QUIZ_BEATS = ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz');
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
const cosh = x => (Math.exp(x) + Math.exp(-x)) / 2, sinh = x => (Math.exp(x) - Math.exp(-x)) / 2;

// ---------- 独立 x/y 比例的坐标系（1/x、x sin x 等需要不同纵横比） ----------
const gx = (G, x) => G.cx + x * G.ux, gy = (G, y) => G.cy - y * G.uy;
function gAxes(G, a, o = {}) {
  if (a <= 0) return;
  const X0 = gx(G, G.x0), X1 = gx(G, G.x1), Y0 = gy(G, G.y1), Y1 = gy(G, G.y0);
  const ox = gx(G, clamp(0, G.x0, G.x1)), oy = gy(G, clamp(0, G.y0, G.y1));
  ctx.save(); ctx.globalAlpha *= a;
  if (o.grid !== false) {
    ctx.strokeStyle = 'rgba(92,200,232,0.08)'; ctx.lineWidth = 1;
    const sx = o.gx || 1, sy = o.gy || 1;
    for (let i = Math.ceil(G.x0 / sx) * sx; i <= G.x1 + 1e-9; i += sx) { ctx.beginPath(); ctx.moveTo(gx(G, i), Y0); ctx.lineTo(gx(G, i), Y1); ctx.stroke(); }
    for (let j = Math.ceil(G.y0 / sy) * sy; j <= G.y1 + 1e-9; j += sy) { ctx.beginPath(); ctx.moveTo(X0, gy(G, j)); ctx.lineTo(X1, gy(G, j)); ctx.stroke(); }
  }
  ctx.strokeStyle = 'rgba(237,230,216,0.62)'; ctx.fillStyle = 'rgba(237,230,216,0.62)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(X0, oy); ctx.lineTo(X1, oy); ctx.moveTo(ox, Y1); ctx.lineTo(ox, Y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X1 + 14, oy); ctx.lineTo(X1, oy - 7); ctx.lineTo(X1, oy + 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(ox, Y0 - 14); ctx.lineTo(ox - 7, Y0); ctx.lineTo(ox + 7, Y0); ctx.fill();
  if (o.ticks) {
    ctx.font = `italic 24px ${F_MATH}`; ctx.fillStyle = 'rgba(237,230,216,0.7)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    (o.ticks.x || []).forEach(([v, l]) => { ctx.fillRect(gx(G, v) - 1, oy - 7, 2, 14); ctx.fillText(l, gx(G, v), oy + 10); });
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    (o.ticks.y || []).forEach(([v, l]) => { ctx.fillRect(ox - 7, gy(G, v) - 1, 14, 2); ctx.fillText(l, ox - 14, gy(G, v)); });
  }
  ctx.restore();
}
function gSegs(G, f, xa, xb, n, jump) {
  const segs = []; let cur = null, py = null;
  for (let i = 0; i <= n; i++) {
    const x = xa + (xb - xa) * i / n, y = f(x);
    const ok = isFinite(y) && y > G.y0 - 3 && y < G.y1 + 3 && (py == null || Math.abs(y - py) < jump);
    if (ok) { if (!cur) { cur = []; segs.push(cur); } cur.push([gx(G, x), gy(G, clamp(y, G.y0 - 2, G.y1 + 2))]); } else cur = null;
    py = isFinite(y) ? y : null;
  }
  return segs;
}
// o: a, p(0..1 进度), xa, xb, rev(从右往左画), n, jump, dash, w, noHead
function gPlot(G, f, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  let xa = o.xa ?? G.x0, xb = o.xb ?? G.x1;
  if (o.rev) xa = lerp(xb, xa, p); else xb = lerp(xa, xb, p);
  const segs = gSegs(G, f, xa, xb, Math.max(8, Math.round((o.n || 400) * Math.max(p, 0.05))), o.jump || (G.y1 - G.y0) * 0.6);
  ctx.save(); ctx.beginPath(); ctx.rect(gx(G, G.x0) - 6, gy(G, G.y1) - 6, (G.x1 - G.x0) * G.ux + 12, (G.y1 - G.y0) * G.uy + 12); ctx.clip();
  const path = s => () => s.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  if (o.dash) { ctx.setLineDash(o.dash); segs.forEach(s => { if (s.length > 1) glowPath(path(s), col, o.w || 2.4, 0.7 * a); }); }
  else segs.forEach(s => { if (s.length > 1) glowPath(path(s), col, o.w || 4.5, a); });
  ctx.restore();
  if (p < 1 && !o.noHead) { const x = o.rev ? xa : xb, y = f(x); if (isFinite(y) && y > G.y0 && y < G.y1) glowDot(gx(G, x), gy(G, y), 7, col, a); }
}
function gH(G, y, col, a = 1, o = {}) {
  if (a <= 0) return; const Y = gy(G, y);
  ctx.save(); ctx.setLineDash(o.dash || [12, 10]);
  glowPath(() => { ctx.moveTo(gx(G, o.xa ?? G.x0), Y); ctx.lineTo(gx(G, o.xb ?? G.x1), Y); }, col, o.w || 2.6, a); ctx.restore();
}
function gFill(G, xa, xb, lo, hi, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.fillStyle = hexA(col, 0.10 * a);
  ctx.fillRect(gx(G, xa), gy(G, hi), (xb - xa) * G.ux, (hi - lo) * G.uy); ctx.restore();
}
function seg(x0, y0, x1, y1, col, a = 1, w = 3, dash) {
  if (a <= 0) return; ctx.save(); if (dash) ctx.setLineDash(dash);
  glowPath(() => { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }, col, w, a); ctx.restore();
}
function arrowH(x0, x1, y, col, a = 1, w = 3.5) {
  if (a <= 0 || Math.abs(x1 - x0) < 2) return; const s = Math.sign(x1 - x0), hd = Math.min(16, Math.abs(x1 - x0) * 0.45);
  glowPath(() => { ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x1 - s * hd, y - hd * 0.6); ctx.lineTo(x1, y); ctx.lineTo(x1 - s * hd, y + hd * 0.6); }, col, w, a);
}
function ring(x, y, r, col, a = 1, p = 1) {
  if (a <= 0 || p <= 0) return; glowPath(() => ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * p), col, 3, a);
}
// 彩色公式整行揭示
function richReveal(parts, x, y, size, t, t0, o = {}) {
  const w = parts.reduce((s, [str]) => s + mathW(str, size), 0), x0 = o.align === 'left' ? x : x - w / 2;
  const dur = o.dur || Math.max(0.35, w / 1300), p = eOut(prog(t, t0, dur)), out = o.out != null ? prog(t, o.out, 0.3) : 0;
  if (p <= 0 || out >= 1) return w;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 12, y - size * 1.4, (w + 24) * p, size * 2.1); ctx.clip();
  mathRich(parts, x0, y, size, { glow: o.glow ?? 14, alpha: (o.alpha ?? 1) * (1 - out), upright: o.upright }); ctx.restore();
  if (p < 1) glowDot(x0 - 12 + (w + 24) * p, y - size * 0.3, 5, parts[0][1]);
  return w;
}
function rowX(strs, size, cx) { const ws = strs.map(s => mathW(s, size)), tot = ws.reduce((a, b) => a + b, 0); let x = cx - tot / 2; return ws.map(w => { const v = x; x += w; return v; }); }
function tok(str, x, y, size, col, a = 1, sy = 1, sc = 1) {
  if (a <= 0 || sy <= 0.02) return; const w = mathW(str, size), mx = x + w / 2, my = y - size * 0.32;
  ctx.save(); ctx.translate(mx, my); ctx.scale(sc, sy * sc); ctx.translate(-mx, -my);
  mathText(str, x, y, size, col, { glow: 14, alpha: a }); ctx.restore();
}
// 逐个翻牌：A、B 为同长度 [str,col] 数组；times[i] 为该格翻转起点（null = 不变）
function flipRow(A, B, cx, y, size, t, times, a = 1) {
  const xa = rowX(A.map(p => p[0]), size, cx), xb = rowX(B.map(p => p[0]), size, cx);
  const ts = times.filter(v => v != null), t0 = Math.min(...ts), t1 = Math.max(...ts) + 0.45, eR = eIO(prog(t, t0, t1 - t0));
  A.forEach((pa, i) => {
    const x = lerp(xa[i], xb[i], eR);
    if (times[i] == null) { tok(pa[0], x, y, size, pa[1], a); return; }
    const e = eIO(prog(t, times[i], 0.45)), sy = Math.abs(Math.cos(Math.PI * e)), pb = B[i];
    tok(e < 0.5 ? pa[0] : pb[0], x, y, size, e < 0.5 ? pa[1] : pb[1], a, sy, 1 + 0.25 * Math.sin(Math.PI * e));
  });
  return { xa, xb };
}
function tokCenter(parts, i, cx, size) { const xs = rowX(parts.map(p => p[0]), size, cx); return xs[i] + mathW(parts[i][0], size) / 2; }

// ======================= hook =======================
// D01：sin x 看起来有界；C01：镜头拉远，窗口外两种可能；C02：A 转 180° 成 ∀，E 镜像成 ∃。
SC.hook = t => {
  starfield(t); blueprint(ap(t, 'D01', 0, 0.7), 72);
  const gA = fadeOut(t, S('C02') + 0.05, 0.45);
  if (gA > 0) {
    const s = kf(t, 1, [[P('C01', 0.1), 0.5, 1.1]]);
    const G = { cx: 1040, cy: 560, ux: 92 * s, uy: 92 * s, x0: -4.2 / s, x1: 4.2 / s, y0: -2.6 / s, y1: 2.6 / s };
    ctx.save(); ctx.globalAlpha *= gA;
    gAxes(G, 1, { gx: 1, gy: 1 });
    gPlot(G, Math.sin, RED, { xa: -4.2, xb: 4.2, p: prog(t, S('D01') + 0.2, 3.0), n: 400 });
    [-1, 1].forEach(v => gH(G, v, GOLD, 0.55 * ap(t, 'D01', 0.55), { xa: -4.2, xb: 4.2 }));
    glowMath('y = sin x', 1040, 250, 56, RED, t, P('D01', 0.15), { align: 'center' });
    glowText('看起来：跑不出 [−1, 1]', 1040, 320, 36, GOLD, t, P('D01', 0.6), { out: S('C01') + 0.2 });
    if (t > S('C01')) {
      const a = ap(t, 'C01', 0.06, 0.4);
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.shadowColor = RED; ctx.shadowBlur = 14;
      ctx.strokeRect(gx(G, -4.2), gy(G, 2.4), 8.4 * G.ux, 4.8 * G.uy); ctx.restore();
      glowText('能画出来的只有这一段', 1040, gy(G, 2.4) - 30, 32, RED, t, P('C01', 0.2));
      // 窗口外：两种都"可能"的延续
      const q = ap(t, 'C01', 0.45, 0.6);
      [[-1, -9], [1, 9]].forEach(([sg, xe]) => {
        const xa = sg < 0 ? xe : 4.2, xb = sg < 0 ? -4.2 : xe;
        gPlot(G, Math.sin, RED, { xa, xb, dash: [8, 9], a: q, w: 2.4, n: 300 });
        gPlot(G, x => Math.sin(x) * (1 + 0.55 * Math.pow(Math.max(0, Math.abs(x) - 4.2), 1.4)), GRN, { xa, xb, dash: [8, 9], a: q, w: 2.4, n: 300 });
        kinetic('?', gx(G, sg * 6.8), gy(G, 3.6), 72, t, P('C01', 0.55 + (sg > 0 ? 0.08 : 0)), { col: GOLD });
      });
      glowText('窗口外：还在带子里？还是早跑出去了？', 1040, 905, 36, CR, t, P('C01', 0.62));
    }
    ctx.restore();
  }
  if (t > S('C02') - 0.1) {
    const cy = 500;
    [[0, 'A', '∀', 820, CYAN, 0.08, '任意 · for all'], [1, 'E', '∃', 1260, GOLD, 0.5, '存在 · there exists']].forEach(([k, src, dst, x, col, f, lab]) => {
      const a = ap(t, 'C02', f, 0.3); if (a <= 0) return;
      const e = eIO(prog(t, P('C02', f + 0.1), 0.65));
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, cy);
      if (k === 0) ctx.rotate(Math.PI * e); else ctx.scale(Math.cos(Math.PI * e), 1);
      ctx.font = `230px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.fillStyle = e < 1 ? CR : col; ctx.fillText(src, 0, 8);
      ctx.restore();
      if (e >= 1) burst(t, P('C02', f + 0.1) + 0.65, x, cy, col, 150, 22);
      glowText(lab, x, 700, 44, col, t, P('C02', f + 0.18));
      glowText(k ? '“反过来的 E”' : '“倒过来的 A”', x, 290, 32, CR, t, P('C02', f + 0.02), { bold: false });
    });
  }
};

// ======================= quant =======================
// C03 定义 → C04 游戏（先报 M，再挑 x）→ C05 顺序互换 → C06 每个 x 自带 M → G01 口诀
const QG0 = { cx: 1040, cy: 620, ux: 70, uy: 72, x0: -5.6, x1: 5.6, y0: -2.8, y1: 2.8 };
let QG = QG0;   // G01 时 GPT 娘从右侧进场：坐标系左移、缩窄，避免被立绘遮挡
const fB = x => 0.9 * Math.sin(1.25 * x) + 0.45 * Math.sin(2.9 * x + 0.6);
const fU = x => x * x / 3.2 - 0.4;
const QA = [['∃ M > 0', GOLD], [' ,  ', CR], ['∀ x ∈ X', CYAN], ['  :  |f(x)| ≤ M', CR]];
const QB = [['∀ x ∈ X', CYAN], [' ,  ', CR], ['∃ M', RED], ['  :  |f(x)| ≤ M', CR]];
function swapRow(t, e, y, size) {
  const xa = rowX(QA.map(p => p[0]), size, 1040), xb = rowX(QB.map(p => p[0]), size, 1040), lift = Math.sin(Math.PI * e) * 70;
  tok(QA[1][0], lerp(xa[1], xb[1], e), y, size, CR); tok(QA[3][0], lerp(xa[3], xb[3], e), y, size, CR);
  tok(QA[2][0], lerp(xa[2], xb[0], e), y + lift, size, CYAN);
  const x1 = lerp(xa[0], xb[2], e);
  tok(QA[0][0], x1, y - lift, size, GOLD, 1 - e); tok(QB[2][0], x1, y - lift, size, RED, e);
}
SC.quant = t => {
  starfield(t); blueprint(ap(t, 'C03', 0, 0.5), 72);
  const gs = eIO(prog(t, S('G01') - 0.55, 0.6));
  QG = Object.assign({}, QG0, { cx: lerp(1040, 890, gs), ux: lerp(70, 50, gs) });
  const Y = 250, SZ = 56;
  // 公式行
  if (t < S('C05')) richReveal(QA, 1040, Y, SZ, t, P('C03', 0.04), { dur: 1.3 });
  else if (t < S('G01')) swapRow(t, eIO(prog(t, P('C05', 0.06), 0.9)), Y, SZ);
  else swapRow(t, 1 - eIO(prog(t, P('G01', 0.02), 0.8)), Y, SZ);
  // 曲线：有界（C03–C04、G01）/ 无界（C05–C06）
  const uA = t < S('G01') ? eIO(prog(t, S('C05'), 0.6)) : 1 - eIO(prog(t, S('G01'), 0.6));
  gAxes(QG, ap(t, 'C03', 0.15, 0.5));
  gPlot(QG, fB, RED, { p: prog(t, P('C03', 0.3), 1.6), a: 1 - uA, n: 500 });
  gPlot(QG, fU, GRN, { p: prog(t, S('C05') + 0.3, 1.2), a: uA, n: 400 });
  // 带子 ±M
  const M = kf(t, 2.8, [[P('C04', 0.04), 1.7, 0.7]]), bA = ap(t, 'C04', 0.02, 0.3) * (1 - uA);
  if (bA > 0) {
    gFill(QG, QG.x0, QG.x1, -M, M, GOLD, bA); gH(QG, M, GOLD, bA); gH(QG, -M, GOLD, bA);
    mathText('M', gx(QG, QG.x1) + 22, gy(QG, M) + 12, 36, GOLD, { glow: 10, alpha: bA });
    mathText('−M', gx(QG, QG.x1) + 22, gy(QG, -M) + 12, 36, GOLD, { glow: 10, alpha: bA });
  }
  // C04：挑 x 的探针
  if (t > P('C04', 0.4) && t < S('C05') + 0.3) {
    const picks = [-4.6, 3.9, -1.3, 1.9, -3.1, 0.6], i0 = P('C04', 0.42), dt = (P('C04', 0.96) - i0) / picks.length;
    const k = clamp(Math.floor((t - i0) / dt), 0, picks.length - 1), e = eIO(prog(t, i0 + k * dt, dt * 0.45));
    const x = lerp(k ? picks[k - 1] : 0, picks[k], e), a = fadeOut(t, S('C05'), 0.3);
    seg(gx(QG, x), gy(QG, 0), gx(QG, x), gy(QG, fB(x)), CYAN, 0.8 * a, 2.5, [6, 6]);
    glowDot(gx(QG, x), gy(QG, fB(x)), 10, GRN, a); glowDot(gx(QG, x), gy(QG, 0), 6, CYAN, a);
    for (let j = 0; j <= k; j++) if (t > i0 + j * dt + dt * 0.45) glowDot(gx(QG, picks[j]), gy(QG, fB(picks[j])), 6, GRN, 0.6 * a);
    sparks(t, i0 + k * dt + dt * 0.45, gx(QG, picks[k]), gy(QG, fB(picks[k])), { col: [GRN, '#ffffff'], n: 10, speed: 260 });
  }
  if (t < S('C05') + 0.3) {
    const a = fadeOut(t, S('C05'), 0.3);
    ctx.save(); ctx.globalAlpha *= a;
    glowText('① 我先报 M', 820, 890, 40, GOLD, t, P('C04', 0.08));
    glowText('② 你随便挑 x', 1250, 890, 40, CYAN, t, P('C04', 0.38));
    if (t > P('C04', 0.97)) checkMark(1460, 330, 46, GRN, t, P('C04', 0.97));
    ctx.restore();
  }
  // C06：每个 x 临时造一个 M
  if (t > S('C06') - 0.1 && t < S('G01') + 0.4) {
    const a = fadeOut(t, S('G01'), 0.35), picks = [-2.6, -1.1, 0.8, 2.0, 2.8];
    ctx.save(); ctx.globalAlpha *= a;
    picks.forEach((x, i) => {
      const t0 = P('C06', 0.08 + i * 0.09), q = eOut(prog(t, t0, 0.35)); if (q <= 0) return;
      const y = Math.abs(fU(x)) + 0.05, X = gx(QG, x), Yp = gy(QG, y);
      seg(X, gy(QG, 0), X, gy(QG, fU(x)), CYAN, 0.7 * q, 2.2, [6, 6]); glowDot(X, gy(QG, fU(x)), 8, GRN, q);
      seg(X - 34 * q, Yp, X + 34 * q, Yp, RED, q, 4);
      mathText(`M_${i + 1}`, X, Yp - 14, 30, RED, { align: 'center', glow: 8, alpha: q });
    });
    kinetic('M 跟着 x 变 → 任何函数都满足', 1040, 890, 42, t, P('C06', 0.6), { col: RED });
    if (t > P('C06', 0.78)) crossMark(1500, 245, 44, RED, t, P('C06', 0.78));
    ctx.restore();
  }
  // G01：恢复正确顺序 + 全域扫描 + 口诀
  if (t > S('G01')) {
    const sw = prog(t, P('G01', 0.35), 1.6), xs = lerp(QG.x0, QG.x1, sw);
    if (sw > 0) {
      gFill(QG, QG.x0, xs, -1.7, 1.7, GRN, 0.8);
      seg(gx(QG, xs), gy(QG, 2.4), gx(QG, xs), gy(QG, -2.4), GRN, sw < 1 ? 0.9 : 0, 3);
    }
    const xa = rowX(QA.map(p => p[0]), SZ, 1040), u = ap(t, 'G01', 0.3, 0.6);
    if (u > 0) {
      const xL = xa[0], xR = xa[3] + mathW(QA[3][0], SZ);
      seg(xL, Y + 22, lerp(xL, xR, u), Y + 22, GOLD, 1, 4);
      glowText('先说出口', xL + mathW(QA[0][0], SZ) / 2, Y - 74, 32, GOLD, t, P('G01', 0.3));
      glowText('管住所有 x', xa[2] + mathW(QA[2][0], SZ) / 2, Y - 74, 32, CYAN, t, P('G01', 0.45));
    }
    glowText('先说出口的，要经得起后面所有的挑战', 900, 890, 40, CR, t, P('G01', 0.08));
  }
};

// ======================= bound =======================
// C07 上界/下界线滑入 → C08 整句翻牌否定 → C09 三条规则 → C10 1/x 逃出 M 带（A15）→ C11 [1,+∞) 有界 → C12 sin(1/x)
const G7 = { cx: 1040, cy: 610, ux: 76, uy: 72, x0: -5.3, x1: 5.3, y0: -2.6, y1: 2.6 };
const f7 = x => 0.55 + 0.85 * Math.sin(1.3 * x) + 0.32 * Math.sin(3.1 * x);
const NA = [['∃', GOLD], [' M > 0 ,  ', CR], ['∀', CYAN], [' x ∈ X  :  |f(x)| ', CR], ['≤', GOLD], [' M', CR]];
const NB = [['∀', CYAN], [' M > 0 ,  ', CR], ['∃', GOLD], [' x ∈ X  :  |f(x)| ', CR], ['>', RED], [' M', CR]];
function g10(t) {   // C10→C11：横向比例从 (0,1) 放大到 [0, 5.3]
  const e = eIO(prog(t, S('C11') + 0.05, 0.9));
  const x1 = lerp(1.15, 5.3, e);
  return { cx: 680, cy: 880, ux: 600 / x1 * 1.0, uy: 54, x0: 0, x1, y0: 0, y1: 10.5 };
}
SC.bound = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5), 72);
  // ---- C07 ----
  const a7 = fadeOut(t, S('C08') + 0.05, 0.4);
  if (a7 > 0) {
    ctx.save(); ctx.globalAlpha *= a7;
    gAxes(G7, ap(t, 'C07', 0, 0.4));
    gPlot(G7, f7, RED, { p: prog(t, P('C07', 0.04), 1.4), n: 500 });
    const K1 = kf(t, 2.6, [[P('C07', 0.2), 2.05, 0.8]]), K2 = kf(t, -2.6, [[P('C07', 0.55), -0.95, 0.8]]);
    const a1 = ap(t, 'C07', 0.18, 0.3), a2 = ap(t, 'C07', 0.53, 0.3);
    gH(G7, K1, GOLD, a1); gH(G7, K2, GRN, a2);
    mathText('K_1', gx(G7, G7.x1) + 20, gy(G7, K1) + 12, 36, GOLD, { glow: 10, alpha: a1 });
    mathText('K_2', gx(G7, G7.x1) + 20, gy(G7, K2) + 12, 36, GRN, { glow: 10, alpha: a2 });
    richReveal([['有上界：', GOLD], ['∃ K_1 ,  f(x) ≤ K_1', CR]], 640, 235, 44, t, P('C07', 0.18), { align: 'left', upright: false });
    richReveal([['有下界：', GRN], ['∃ K_2 ,  f(x) ≥ K_2', CR]], 640, 305, 44, t, P('C07', 0.5), { align: 'left' });
    kinetic('有界 ⇔ 有上界 且 有下界', 1040, 895, 44, t, P('C07', 0.74), { col: CR });
    if (t > P('C07', 0.74)) burst(t, P('C07', 0.74), gx(G7, 0), gy(G7, 0.55), GOLD, 110, 16);
    ctx.restore();
  }
  // ---- C08–C09：整句否定 ----
  const a8 = ap(t, 'C08', 0, 0.35) * fadeOut(t, S('C10'), 0.4);
  if (a8 > 0) {
    ctx.save(); ctx.globalAlpha *= a8;
    const ft = [P('C08', 0.3), null, P('C08', 0.42), null, P('C08', 0.56), null];
    glowText('有界', 1040, 300, 40, GOLD, t, P('C08', 0.02), { out: P('C08', 0.3) });
    glowText('无界 = 有界的否定', 1040, 300, 40, RED, t, P('C08', 0.62));
    flipRow(NA, NB, 1040, 420, 60, t, ft);
    ft.forEach((v, i) => { if (v) sparks(t, v + 0.22, tokCenter(NB, i, 1040, 60), 400, { col: [NB[i][1], '#ffffff'], n: 12, speed: 280 }); });
    // C09：三条规则逐条点亮
    const xs = rowX(NB.map(p => p[0]), 60, 1040);
    [[0, '∃ → ∀', CYAN, 0.05], [2, '∀ → ∃', GOLD, 0.3], [4, '≤ → >', RED, 0.6]].forEach(([i, s, col, f], k) => {
      const q = ap(t, 'C09', f, 0.35); if (q <= 0) return;
      const cx = xs[i] + mathW(NB[i][0], 60) / 2;
      ring(cx, 400, 44, col, q, q);
      seg(cx, 452, 760 + k * 280, 560, col, 0.6 * q, 2, [5, 6]);
      glowMath(s, 760 + k * 280, 640, 58, col, t, P('C09', f + 0.05), { align: 'center' });
      sparks(t, P('C09', f + 0.05), 760 + k * 280, 620, { col: [col, '#ffffff'], n: 14, speed: 300 });
    });
    glowText('否定 = 量词互换 + 不等式取反', 1040, 800, 40, CR, t, P('C09', 0.82));
    ctx.restore();
  }
  // ---- C10–C11：1/x ----
  const a10 = ap(t, 'C10', 0, 0.4) * fadeOut(t, S('C12'), 0.4);
  if (a10 > 0) {
    const G = g10(t), e11 = eIO(prog(t, S('C11') + 0.05, 0.9));
    ctx.save(); ctx.globalAlpha *= a10;
    gAxes(G, 1, { gx: e11 > 0.5 ? 1 : 0.25, gy: 2, ticks: { x: e11 > 0.5 ? [[1, '1']] : [[1, '1'], [0.5, '1/2']], y: [[2, '2'], [4, '4'], [6, '6'], [8, '8']] } });
    gPlot(G, x => 1 / x, RED, { xa: 0.096, xb: G.x1, p: prog(t, P('C10', 0.05), 1.0), n: 900, jump: 99 });
    richReveal([['例：', CR], ['f(x) = 1/x ,  x ∈ (0, 1)', RED]], 1040, 235, 50, t, P('C10', 0.02), { out: S('C11') + 0.1 });
    // 量词对战：M 不断加码，x = 1/(M+1) 总能逃出去
    const M = kf(t, 2, [[P('C10', 0.5), 4, 0.6], [P('C10', 0.66), 6, 0.6], [P('C10', 0.82), 8, 0.6]]);
    const qa = ap(t, 'C10', 0.3, 0.4) * fadeOut(t, S('C11'), 0.35);
    if (qa > 0) {
      ctx.save(); ctx.globalAlpha *= qa;
      gFill(G, 0, G.x1, 0, M, GOLD, 1); gH(G, M, GOLD, 1);
      const xw = 1 / (M + 1), X = gx(G, xw), Yw = gy(G, M + 1);
      seg(X, gy(G, 0), X, Yw, RED, 0.8, 2.5, [6, 6]); glowDot(X, Yw, 11, RED);
      [0.5, 0.66, 0.82].forEach(f => sparks(t, P('C10', f) + 0.6, X, Yw, { col: [RED, '#ffffff'], n: 14, speed: 320 }));
      const px = 1500;
      mathText(`M = ${M.toFixed(1)}`, px, 430, 46, GOLD, { glow: 12 });
      mathText('取 x = 1/(M + 1)', px, 510, 40, CYAN, { glow: 10 });
      mathText('1/x = M + 1 > M', px, 590, 40, RED, { glow: 10 });
      glowText('M 再大，也有点逃出带子', 1640, 680, 30, CR, t, P('C10', 0.7), { bold: false });
      ctx.restore();
    }
    // C11：[1, +∞) 上 M = 1 即可
    const c = ap(t, 'C11', 0.3, 0.4);
    if (c > 0) {
      gFill(G, 1, G.x1, 0, 1, GRN, 2 * c); gH(G, 1, GRN, c, { xa: 1 });
      seg(gx(G, 1), gy(G, 0), gx(G, 1), gy(G, 10), GRN, 0.5 * c, 2, [5, 7]);
      richReveal([['x ∈ [1, +∞) ：', GRN], ['取 M = 1 ，有界', CR]], 1040, 235, 50, t, P('C11', 0.3));
      if (t > P('C11', 0.6)) checkMark(gx(G, 3.2), gy(G, 2.6), 44, GRN, t, P('C11', 0.6));
    }
    ctx.restore();
  }
  // ---- C12：sin(1/x) ----
  const a12 = ap(t, 'C12', 0, 0.4);
  if (a12 > 0) {
    const G = { cx: 660, cy: 600, ux: 520, uy: 150, x0: 0, x1: 1.55, y0: -1.5, y1: 1.5 };
    ctx.save(); ctx.globalAlpha *= a12;
    gAxes(G, 1, { gx: 0.5, gy: 1, ticks: { y: [[1, '1'], [-1, '−1']] } });
    gPlot(G, x => Math.sin(1 / x), RED, { xa: 0.006, xb: 1.55, rev: true, p: prog(t, P('C12', 0.08), 2.4), n: 4000, jump: 99, w: 3 });
    const b = ap(t, 'C12', 0.5, 0.4);
    gFill(G, 0, G.x1, -1, 1, GOLD, b); gH(G, 1, GOLD, b); gH(G, -1, GOLD, b);
    glowMath('y = sin(1/x)', 1040, 235, 56, RED, t, P('C12', 0.02), { align: 'center' });
    glowText('靠近 0：疯狂振荡', gx(G, 0.04) + 10, 360, 32, CR, t, P('C12', 0.3), { align: 'left', bold: false });
    kinetic('看着吓人，其实有界：|f(x)| ≤ 1', 1040, 890, 42, t, P('C12', 0.62), { col: GRN });
    ctx.restore();
  }
};

// ======================= gem（Gemini 客串；立绘由 kit 的 sideChars 统一绘制） =======================
// M01 窗口内 x sin x 看似有界 → C13 镜头拉远 + M 加码，x_k = 2kπ+π/2 总在 M 之上 → C14 结论 → M02 更远 → C15 金句
function gemG(t) {
  const X = kf(t, 10.5, [[S('C13') + 0.1, 42, 1.8], [S('M02'), 90, 1.6]]);
  return { cx: 985, cy: 600, ux: 395 / X, uy: 245 / X, x0: -X, x1: X, y0: -X, y1: X };
}
SC.gem = t => {
  starfield(t); blueprint(ap(t, 'M01', 0, 0.5), 72);
  const [sx, sy] = shake(t, P('C14', 0.58), 7, 0.45); ctx.translate(sx, sy);
  const G = gemG(t), X = G.x1;
  gAxes(G, ap(t, 'M01', 0, 0.4), { grid: false });
  // 原窗口 [−10,10] 的框随镜头缩小
  const wA = ap(t, 'M01', 0.4, 0.4);
  if (wA > 0) { ctx.save(); ctx.globalAlpha *= wA * 0.9; ctx.strokeStyle = INV; ctx.setLineDash([10, 8]); ctx.lineWidth = 2.5; ctx.strokeRect(gx(G, -10), gy(G, 10), 20 * G.ux, 20 * G.uy); ctx.restore(); }
  gPlot(G, x => x * Math.sin(x), RED, { xa: -X, xb: X, p: t < S('C13') ? prog(t, P('M01', 0.1), 2.6) : 1, n: Math.round(60 * X), jump: 1e9, w: 3.6 });
  const env = ap(t, 'C13', 0.05, 0.5);
  gPlot(G, x => Math.abs(x), GOLD, { dash: [8, 8], a: env * 0.8, n: 60 }); gPlot(G, x => -Math.abs(x), GOLD, { dash: [8, 8], a: env * 0.8, n: 60 });
  glowMath('f(x) = x · sin x', 985, 220, 56, RED, t, P('M01', 0.05), { align: 'center' });
  glowText('[−10, 10] 内：最高不到 10', 985, 290, 34, INV, t, P('M01', 0.45), { out: S('C14') });
  // C13：M 加码，见证点跟着跳
  if (t > P('C13', 0.25)) {
    const M = kf(t, 6, [[P('C13', 0.4), 16, 0.7], [P('C13', 0.62), 26, 0.7], [P('C13', 0.84), 34, 0.6], [S('M02') + 0.3, 70, 1.4]]);
    const k = Math.max(0, Math.ceil((M - Math.PI / 2) / TAU)), xk = TAU * k + Math.PI / 2;
    const qa = ap(t, 'C13', 0.25, 0.4);
    ctx.save(); ctx.globalAlpha *= qa;
    gH(G, M, GOLD, 1, { dash: [14, 8], w: 3 });
    mathText('M', gx(G, X) + 18, gy(G, M) + 12, 36, GOLD, { glow: 10 });
    const Xp = gx(G, xk), Yp = gy(G, xk);
    seg(Xp, gy(G, 0), Xp, Yp, RED, 0.8, 2.5, [6, 6]); glowDot(Xp, Yp, 11, RED);
    [0.4, 0.62, 0.84].forEach(f => sparks(t, P('C13', f) + 0.5, Xp, Yp, { col: [RED, '#ffffff'], n: 16, speed: 320 }));
    const ro = fadeOut(t, P('C14', 0.55), 0.3);
    mathRich([['M = ' + M.toFixed(1), GOLD], ['    取 x = 2kπ + π/2 ≈ ' + xk.toFixed(1), RED], ['  > M', CR]], 985, 905, 40, { align: 'center', glow: 10, alpha: ro });
    ctx.restore();
  }
  // C14：sin x_k = 1 ⇒ f(x_k) = x_k > M；结论
  if (t > S('C14')) {
    richReveal([['sin x = 1  ⇒  ', CR], ['f(x) = x > M', RED]], 985, 290, 44, t, P('C14', 0.04));
    kinetic('x · sin x 在 ℝ 上无界', 985, 900, 50, t, P('C14', 0.58), { col: RED, out: S('C15') });
    if (t < S('C15')) burst(t, P('C14', 0.6), 985, 900, RED, 170, 26);
  }
  if (t > S('C15')) glowText('图只能看一段，定义管的是全部', 985, 900, 46, GOLD, t, P('C15', 0.05));
};

// ======================= mono（单调：只做提醒） =======================
const GM = { cx: 1040, cy: 610, ux: 140, uy: 95, x0: -2.6, x1: 2.6, y0: -2.5, y1: 2.5 };
const fM = x => (x * x * x - 3 * x) / 1.6;
SC.mono = t => {
  starfield(t); blueprint(ap(t, 'C16', 0, 0.5), 72);
  gAxes(GM, ap(t, 'C16', 0, 0.4), { ticks: { x: [[-1, '−1'], [1, '1']] } });
  gPlot(GM, fM, RED, { p: prog(t, P('C16', 0.05), 1.2), n: 300 });
  [[GM.x0, -1, GRN, '增', 0.3], [-1, 1, RED, '减', 0.45], [1, GM.x1, GRN, '增', 0.6]].forEach(([a, b, col, s, f]) => {
    const q = ap(t, 'C16', f, 0.35); if (q <= 0) return;
    seg(gx(GM, a), gy(GM, 0), gx(GM, lerp(a, b, q)), gy(GM, 0), col, 1, 8);
    glowText(s, gx(GM, (a + b) / 2), gy(GM, 0) + 50, 36, col, t, P('C16', f + 0.04));
  });
  const pr = prog(t, P('C16', 0.3), 2.0); if (pr > 0 && pr < 1) { const x = lerp(GM.x0 + 0.5, GM.x1 - 0.5, pr), d = 3 * x * x - 3; glowDot(gx(GM, x), gy(GM, fM(x)), 10, d > 0 ? GRN : RED); }
  glowText('讨论增减，必须说明区间 I', 1040, 235, 50, CR, t, P('C16', 0.12));
};

// ======================= parity =======================
// C22 定义域对称 → C23 偶：折叠；奇：旋转 180° → D03 eˣ → C24 拆分 → C25 镜像得 e^{−x}（A17）→ C26 偶部/奇部长出 → C27 cosh/sinh 公式 → C28 悬链线
const G23 = { cx: 1040, cy: 620, ux: 110, uy: 80, x0: -2.7, x1: 2.7, y0: -2.6, y1: 2.6 };
const GE = { cx: 1080, cy: 792, ux: 135, uy: 58, x0: -2.5, x1: 2.5, y0: -2.2, y1: 5.6 };
const fe = x => 0.42 * x * x, fo = x => 0.16 * x * x * x;
SC.parity = t => {
  starfield(t); blueprint(ap(t, 'C22', 0, 0.5), 72);
  // ---- C22 ----
  const a22 = fadeOut(t, S('C23'), 0.35);
  if (a22 > 0) {
    ctx.save(); ctx.globalAlpha *= a22;
    glowMath('x ∈ D  ⇒  −x ∈ D', 1040, 290, 58, CR, t, P('C22', 0.05), { align: 'center' });
    const y = 560, u = 110, q = ap(t, 'C22', 0.15, 0.6);
    seg(620, y, 1460, y, CR, 0.6, 2);
    seg(1040 - 3 * u * q, y, 1040 + 3 * u * q, y, CYAN, 1, 8);
    mathText('−a', 1040 - 3 * u, y + 52, 36, CYAN, { align: 'center', glow: 8, alpha: q }); mathText('a', 1040 + 3 * u, y + 52, 36, CYAN, { align: 'center', glow: 8, alpha: q });
    mathText('0', 1040, y + 52, 32, CR, { align: 'center', alpha: q });
    [0.8, 1.7, 2.6].forEach((v, i) => {
      const p = eIO(prog(t, P('C22', 0.3 + i * 0.1), 0.5)); if (p <= 0) return;
      glowDot(1040 + v * u, y, 8, GOLD); glowDot(1040 - v * u, y, 8 * p, GOLD, p);
      glowPath(() => { for (let k = 0; k <= 30 * p; k++) { const th = Math.PI * k / 30, X = 1040 + v * u * Math.cos(th), Y = y - v * 30 * Math.sin(th); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, GOLD, 2.4, 0.7);
    });
    glowText('反例：D = [−1, 2) 不对称 → 谈不上奇偶', 1040, 760, 34, RED, t, P('C22', 0.72), { bold: false });
    ctx.restore();
  }
  // ---- C23 ----
  const a23 = ap(t, 'C23', 0, 0.35) * fadeOut(t, S('D03'), 0.4);
  if (a23 > 0) {
    ctx.save(); ctx.globalAlpha *= a23;
    gAxes(G23, 1);
    // 偶：画右半 → 沿 y 轴折过去
    gPlot(G23, fe, RED, { xa: 0, xb: 2.5, p: prog(t, P('C23', 0.03), 0.6) });
    const ef = eIO(prog(t, P('C23', 0.14), 0.8));
    if (ef > 0) { ctx.save(); ctx.translate(G23.cx, 0); ctx.scale(lerp(1, -1, ef), 1); ctx.translate(-G23.cx, 0); gPlot(G23, fe, RED, { xa: 0, xb: 2.5, a: 0.5 + 0.5 * ef }); ctx.restore(); }
    if (ef >= 1) { const y = gy(G23, fe(1.6)); seg(gx(G23, -1.6), y, gx(G23, 1.6), y, GOLD, 0.6, 2, [6, 6]); glowDot(gx(G23, -1.6), y, 8, GOLD); glowDot(gx(G23, 1.6), y, 8, GOLD); }
    glowMath('f(−x) = f(x)', 820, 250, 46, RED, t, P('C23', 0.04), { align: 'center' });
    glowText('偶 · 关于 y 轴对称', 820, 315, 32, RED, t, P('C23', 0.25), { bold: false });
    // 奇：画右半 → 绕原点转 180°
    gPlot(G23, fo, GRN, { xa: 0, xb: 2.6, p: prog(t, P('C23', 0.5), 0.5) });
    const er = eIO(prog(t, P('C23', 0.6), 0.85));
    if (er > 0) { ctx.save(); ctx.translate(G23.cx, G23.cy); ctx.rotate(Math.PI * er); ctx.translate(-G23.cx, -G23.cy); gPlot(G23, fo, GRN, { xa: 0, xb: 2.6, a: 0.5 + 0.5 * er }); ctx.restore(); }
    if (er >= 1) { seg(gx(G23, -2.2), gy(G23, fo(-2.2)), gx(G23, 2.2), gy(G23, fo(2.2)), GRN, 0.6, 2, [6, 6]); glowDot(gx(G23, -2.2), gy(G23, fo(-2.2)), 8, GRN); glowDot(gx(G23, 2.2), gy(G23, fo(2.2)), 8, GRN); }
    glowMath('f(−x) = −f(x)', 1280, 250, 46, GRN, t, P('C23', 0.52), { align: 'center' });
    glowText('奇 · 关于原点对称', 1280, 315, 32, GRN, t, P('C23', 0.75), { bold: false });
    if (ef >= 1) sparks(t, P('C23', 0.14) + 0.8, G23.cx, gy(G23, 1), { col: [RED, '#ffffff'], n: 14 });
    if (er >= 1) sparks(t, P('C23', 0.6) + 0.85, G23.cx, G23.cy, { col: [GRN, '#ffffff'], n: 14 });
    ctx.restore();
  }
  // ---- D03–C27：eˣ 的分解 ----
  const aE = ap(t, 'D03', 0, 0.4) * fadeOut(t, S('C28'), 0.45);
  if (aE > 0) {
    ctx.save(); ctx.globalAlpha *= aE;
    gAxes(GE, 1, { gy: 1, ticks: { y: [[1, '1']] } });
    const m1 = eIO(prog(t, P('C26', 0.06), 1.3)), m2 = eIO(prog(t, P('C26', 0.3), 1.3)), dim = 1 - 0.6 * Math.max(m1, m2);
    gPlot(GE, Math.exp, RED, { xa: -2.5, xb: 1.75, p: prog(t, P('D03', 0.35), 1.0), a: dim });
    mathText('e^x', gx(GE, 1.75) + 14, gy(GE, 5.4), 40, RED, { glow: 10, alpha: ap(t, 'D03', 0.5) * dim });
    // C25：沿 y 轴镜像出 e^{−x}
    const mr = eIO(prog(t, P('C25', 0.04), 0.9));
    if (mr > 0) {
      ctx.save(); ctx.translate(GE.cx, 0); ctx.scale(lerp(1, -1, mr), 1); ctx.translate(-GE.cx, 0);
      gPlot(GE, Math.exp, INV, { xa: -2.5, xb: 1.75, dash: mr < 1 ? null : [10, 8], a: (0.6 + 0.4 * mr) * dim }); ctx.restore();
      mathText('e^{−x}', gx(GE, -1.75) - 14, gy(GE, 5.4), 40, INV, { align: 'right', glow: 10, alpha: mr * dim });
    }
    // C26：偶部、奇部从 eˣ 长出来
    if (m1 > 0) gPlot(GE, x => lerp(Math.exp(x), cosh(x), m1), GOLD, { xa: -2.5, xb: 2.5, n: 300, w: 5 });
    if (m2 > 0) gPlot(GE, x => lerp(Math.exp(x), sinh(x), m2), GRN, { xa: -2.5, xb: 2.5, n: 300, w: 5 });
    const nm = ap(t, 'C27', 0.3, 0.4);
    if (nm > 0) {
      mathText('cosh x', gx(GE, -2.0) - 14, gy(GE, cosh(2.0)) + 12, 38, GOLD, { align: 'right', glow: 10, alpha: nm });
      mathText('sinh x', gx(GE, 2.05) + 16, gy(GE, sinh(2.05)) + 8, 38, GRN, { glow: 10, alpha: nm });
    }
    kinetic('f = 偶 + 奇', 1080, 250, 60, t, P('C24', 0.15), { col: CR, out: S('C25') });
    if (t < S('C25')) burst(t, P('C24', 0.35), 1080, 250, GOLD, 140, 20);
    // 公式：E/O → cosh/sinh
    const sw = P('C27', 0.18);
    richReveal([['E(x) = ', GOLD], ['[ f(x) + f(−x) ] / 2', CR]], 1080, 230, 44, t, P('C25', 0.12), { out: sw });
    richReveal([['O(x) = ', GRN], ['[ f(x) − f(−x) ] / 2', CR]], 1080, 300, 44, t, P('C25', 0.55), { out: sw + 0.15 });
    richReveal([['cosh x = ', GOLD], ['( e^x + e^{−x} ) / 2', CR]], 1080, 230, 46, t, sw + 0.25);
    richReveal([['sinh x = ', GRN], ['( e^x − e^{−x} ) / 2', CR]], 1080, 300, 46, t, sw + 0.65);
    // C26 验证
    const vo = P('C27', 0.6);
    glowMath('E(−x) = E(x)', 800, 380, 36, GOLD, t, P('C26', 0.22), { align: 'center', out: vo });
    glowMath('O(−x) = −O(x)', 1080, 380, 36, GRN, t, P('C26', 0.45), { align: 'center', out: vo });
    glowMath('E + O = f', 1360, 380, 36, CR, t, P('C26', 0.72), { align: 'center', out: vo });
    if (t > vo) {
      richReveal([['e^x', RED], [' = ', CR], ['cosh x', GOLD], [' + ', CR], ['sinh x', GRN]], 1080, 385, 48, t, vo + 0.2);
      burst(t, vo + 0.6, 1080, 370, GOLD, 160, 24);
    }
    ctx.restore();
  }
  // ---- C28：悬链线 ----
  const a28 = ap(t, 'C28', 0.05, 0.5);
  if (a28 > 0) {
    ctx.save(); ctx.globalAlpha *= a28;
    const L = 760, R = 1320, top = 420, mid = (L + R) / 2, A = 220, half = (R - L) / 2;
    const tau = Math.max(0, t - P('C28', 0.45)), k = 1 - Math.exp(-3 * tau) * Math.cos(7 * tau);
    const yAt = x => top + k * A * (Math.cosh(half / A) - Math.cosh((x - mid) / A));
    [L, R].forEach(x => { seg(x, top - 30, x, 860, CR, 0.7, 6); glowDot(x, top, 9, CR); });
    glowPath(() => { for (let x = L; x <= R; x += 4) x === L ? ctx.moveTo(x, yAt(x)) : ctx.lineTo(x, yAt(x)); }, GOLD, 4.5, 1);
    for (let i = 1; i < 24; i++) { const x = L + (R - L) * i / 24; glowDot(x, yAt(x), 4.5, GOLD, 0.9); }
    glowMath('y = a cosh(x / a)', 1040, 760, 54, GOLD, t, P('C28', 0.5), { align: 'center' });
    glowText('悬链线 catenary', 1040, 835, 38, CR, t, P('C28', 0.62));
    glowText('同济：第一章　·　Stewart：§3.11', 1040, 280, 34, CYAN, t, P('C28', 0.05), { bold: false });
    ctx.restore();
  }
};

// ======================= period =======================
// C29 金色副本平移 T，到 2π 严丝合缝（A18）→ C30 4π 也行；最小正周期不一定存在 → C31 狄利克雷：T 越取越小
// → C32 常数函数 → G03 √2：两列刻度永远对不上 → C33
const GP = { cx: 1050, cy: 600, ux: 58, uy: 100, x0: -7.2, x1: 7.2, y0: -1.6, y1: 1.6 };
const PA = [['∃ T > 0', GOLD], [' ,  ', CR], ['∀ x ∈ D', CYAN], ['  :  f(x + T) = f(x)', CR]];
SC.period = t => {
  starfield(t); blueprint(ap(t, 'C29', 0, 0.5), 72);
  const hdr = fadeOut(t, S('C31'), 0.3);
  if (hdr > 0) { ctx.save(); ctx.globalAlpha *= hdr; richReveal(PA, 1050, 235, 50, t, P('C29', 0.03), { dur: 1.2 }); ctx.restore(); }
  // ---- C29–C30：正弦 + 平移副本 ----
  const aS = fadeOut(t, S('C31'), 0.4);
  if (aS > 0) {
    ctx.save(); ctx.globalAlpha *= aS;
    gAxes(GP, 1, { gx: Math.PI, gy: 1, ticks: { x: [[TAU, '2π'], [-TAU, '−2π']] } });
    gPlot(GP, Math.sin, RED, { p: prog(t, P('C29', 0.12), 1.2), n: 500 });
    const T = kf(t, 0, [[P('C29', 0.45), TAU, 2.4], [P('C30', 0.12), 2 * TAU, 1.8]]), cA = ap(t, 'C29', 0.4, 0.4);
    if (cA > 0) {
      const ok = Math.abs(T - TAU) < 0.03 || Math.abs(T - 2 * TAU) < 0.03;
      gPlot(GP, x => Math.sin(x - T), ok ? GRN : INV, { a: cA * 0.85, w: 3.4, n: 500 });
      const xa = -6.3, y = gy(GP, 1.32);
      arrowH(gx(GP, xa), gx(GP, xa + T), y, GOLD, cA);
      mathText('T', gx(GP, xa + T / 2), y - 14, 36, GOLD, { align: 'center', glow: 10, alpha: cA * (T > 0.6 ? 1 : 0) });
      [P('C29', 0.45) + 2.4, P('C30', 0.12) + 1.8].forEach((t0, i) => {
        burst(t, t0, gx(GP, 0), gy(GP, 0), GRN, 220, 22);
        glowText(i ? 'T = 4π ✓' : 'T = 2π ✓', i ? 1300 : 800, 330, 40, GRN, t, t0 - 0.05);
      });
    }
    glowText('平时说的周期 = 最小正周期：sin x 是 2π', 1050, 880, 38, CR, t, P('C30', 0.05), { out: P('C30', 0.62) });
    kinetic('最小正周期不一定存在', 1050, 880, 48, t, P('C30', 0.66), { col: RED });
    ctx.restore();
  }
  // ---- C31：狄利克雷 ----
  const aD = ap(t, 'C31', 0, 0.4) * fadeOut(t, S('C32'), 0.35);
  if (aD > 0) {
    ctx.save(); ctx.globalAlpha *= aD;
    richReveal([['D(x) = 1', GOLD], [' (x ∈ ℚ) ,  ', CR], ['0', CYAN], [' (x ∉ ℚ)', CR]], 1050, 235, 48, t, P('C31', 0.02));
    const y1 = 470, y0 = 660, xL = 640, xR = 1460;
    const dots = (y, col, ph, a) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = hexA(col, 0.85 * a); for (let x = xL + (ph % 7); x <= xR; x += 7) { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill(); } ctx.restore(); };
    gAxes({ cx: 1050, cy: y0, ux: 1, uy: 1, x0: -410, x1: 410, y0: -10, y1: 240 }, 0.5, { grid: false });
    dots(y1, GOLD, 0, 1); dots(y0, CYAN, 3, 1);
    glowText('有理点 → 1', xL, y1 - 40, 30, GOLD, t, P('C31', 0.1), { align: 'left', bold: false });
    glowText('无理点 → 0', xL, y0 - 40, 30, CYAN, t, P('C31', 0.1), { align: 'left', bold: false });
    const steps = [['2', 2, 0.25], ['1/2', 0.5, 0.42], ['1/10', 0.1, 0.58], ['1/1000', 0.001, 0.72]];
    let lab = null, len = 0;
    steps.forEach(([s, v, f]) => { if (t > P('C31', f)) { lab = s; len = v; } });
    if (lab) {
      const Tpx = kf(t, 220, steps.map(([s, v, f]) => [P('C31', f), Math.max(3, 110 * v), 0.4]));
      const sh = (t * 60) % 7;
      dots(y1 - 0, GRN, sh, 0.35);
      arrowH(980, 980 + Tpx, y1 - 60, GRN, 1); glowDot(980, y1 - 60, 5, GRN);
      mathText(`T = ${lab}   ✓`, 1250, y1 - 46, 40, GRN, { glow: 10 });
      steps.forEach(([s, v, f]) => sparks(t, P('C31', f) + 0.4, 980 + Math.max(3, 110 * v), y1 - 60, { col: [GRN, '#ffffff'], n: 10, speed: 240 }));
    }
    kinetic('所有正有理数都是周期，却没有最小的', 1050, 860, 42, t, P('C31', 0.8), { col: GOLD });
    ctx.restore();
  }
  // ---- C32：常数函数 ----
  const aC = ap(t, 'C32', 0, 0.35) * fadeOut(t, S('G03'), 0.35);
  if (aC > 0) {
    ctx.save(); ctx.globalAlpha *= aC;
    gAxes(GP, 1, { grid: false });
    gH(GP, 0.8, RED, 1, { dash: [1, 0], w: 4.5 });
    glowMath('f(x) = c', 1050, 235, 56, RED, t, P('C32', 0.02), { align: 'center' });
    [[3.1, 0.15], [1.2, 0.4], [0.35, 0.62]].forEach(([T, f], i) => { const q = ap(t, 'C32', f, 0.3); arrowH(gx(GP, -5 + i * 3.6), gx(GP, -5 + i * 3.6 + T * q), gy(GP, 1.25), GOLD, q); });
    glowText('任何 T > 0 都是周期', 1050, 880, 44, GOLD, t, P('C32', 0.35));
    ctx.restore();
  }
  // ---- G03–C33：sin x + sin(√2 x) ----
  const aG = ap(t, 'G03', 0, 0.4);
  if (aG > 0) {
    ctx.save(); ctx.globalAlpha *= aG;
    const G = { cx: 1040, cy: 560, ux: 58, uy: 70, x0: -7.2, x1: 7.2, y0: -2.3, y1: 2.3 };
    gAxes(G, 1, { grid: false });
    gPlot(G, Math.sin, RED, { p: prog(t, P('G03', 0.1), 1.0), w: 2.6, a: 0.75, n: 400 });
    gPlot(G, x => Math.sin(Math.SQRT2 * x), GRN, { p: prog(t, P('G03', 0.2), 1.0), w: 2.6, a: 0.75, n: 400 });
    gPlot(G, x => Math.sin(x) + Math.sin(Math.SQRT2 * x), GOLD, { p: prog(t, P('G03', 0.32), 1.2), w: 4.5, n: 600 });
    richReveal([['sin x', RED], [' + ', CR], ['sin(√2 x)', GRN], ['  不是周期函数', CR]], 1040, 235, 48, t, P('G03', 0.1));
    glowMath('2π : √2 π = √2 ∉ ℚ', 1040, 300, 38, GOLD, t, P('G03', 0.6), { align: 'center' });
    // 两列刻度：2πk 与 √2πm，永远不重合
    const y = 790, xL = 640, xR = 1440, span = 42, X = v => xL + (xR - xL) * v / span, q = ap(t, 'G03', 0.55, 0.4);
    seg(xL, y, xL + (xR - xL) * q, y, CR, 0.6, 2);
    for (let k = 1; TAU * k <= span; k++) { const a = ap(t, 'G03', 0.58 + k * 0.03, 0.2); seg(X(TAU * k), y, X(TAU * k), y - 34, RED, a, 3.5); }
    for (let m = 1; Math.SQRT2 * Math.PI * m <= span; m++) { const a = ap(t, 'G03', 0.6 + m * 0.025, 0.2); seg(X(Math.SQRT2 * Math.PI * m), y, X(Math.SQRT2 * Math.PI * m), y + 34, GRN, a, 3.5); }
    mathText('2πk', xL - 14, y - 10, 28, RED, { align: 'right', glow: 8, alpha: q }); mathText('√2πm', xL - 14, y + 34, 28, GRN, { align: 'right', glow: 8, alpha: q });
    kinetic('两种节奏永远对不齐', 1040, 890, 42, t, P('G03', 0.85), { col: CR, out: S('C33') });
    glowText('严格证明：学完连续和导数再回来补', 1040, 890, 40, CYAN, t, P('C33', 0.1));
    ctx.restore();
  }
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C34', 0, 0.5), 78);
  const q = t < S('C36') ? 0 : t < S('C37') ? 1 : 2, id = ['C35', 'C36', 'C37'][q];
  const fin = id => ap(t, id, 0, 0.35);
  if (q === 0) {
    const G = { cx: 960, cy: 620, ux: 27, uy: 19, x0: -11, x1: 11, y0: -11, y1: 11 }, a = fin('C34');
    ctx.save(); ctx.globalAlpha *= a; gAxes(G, 1, { grid: false });
    gPlot(G, x => x * Math.sin(x), RED, { p: prog(t, P('C35', 0.1), 2.2), n: 800, jump: 1e9 });
    if (t > S('M03')) { gPlot(G, x => Math.abs(x), GOLD, { dash: [8, 8], n: 50 }); checkMark(1330, 330, 52, GRN, t, S('M03') + 0.1); kinetic('无界', 1330, 400, 46, t, S('M03') + 0.2, { col: GRN }); }
    ctx.restore();
  } else if (q === 1) {
    const G = { cx: 960, cy: 650, ux: 55, uy: 90, x0: -5.4, x1: 5.4, y0: -1, y1: 2 };
    ctx.save(); ctx.globalAlpha *= fin('C36'); gAxes(G, 1, { grid: false });
    gH(G, 1.1, RED, 1, { dash: [1, 0], w: 4.5 }); mathText('f(x) = c', gx(G, 5.4) - 10, gy(G, 1.1) - 20, 36, RED, { align: 'right', glow: 10 });
    const Ts = [3, 1.5, 0.6, 0.2, 0.05], k = Math.floor(Math.max(0, t - P('C36', 0.5)) / 0.7) % Ts.length, T = Ts[k];
    if (t > P('C36', 0.5)) { arrowH(gx(G, -2), gx(G, -2 + T) + (T < 0.1 ? 4 : 0), gy(G, 1.6), GOLD); mathText(`T = ${T}`, gx(G, -2) - 16, gy(G, 1.6) + 12, 34, GOLD, { align: 'right', glow: 8 }); }
    if (t > S('D04')) { checkMark(1330, 330, 52, GRN, t, S('D04') + 0.1); kinetic('没有最小的', 1330, 400, 42, t, S('D04') + 0.2, { col: GRN }); }
    ctx.restore();
  } else {
    const G = { cx: 960, cy: 630, ux: 110, uy: 38, x0: -2.6, x1: 2.6, y0: -5.2, y1: 5.2 }, f = x => x * x * x + Math.sin(x);
    ctx.save(); ctx.globalAlpha *= fin('C37'); gAxes(G, 1, { grid: false });
    gPlot(G, f, RED, { xa: -1.75, xb: 1.75, p: prog(t, P('C37', 0.2), 1.2), n: 400 });
    const r = eIO(prog(t, P('C38', 0.3), 0.9));
    if (r > 0) { ctx.save(); ctx.translate(G.cx, G.cy); ctx.rotate(Math.PI * r); ctx.translate(-G.cx, -G.cy); gPlot(G, f, INV, { xa: 0, xb: 1.75, a: 0.8, dash: [10, 8] }); ctx.restore(); }
    if (t > S('C38')) { checkMark(1330, 330, 52, GRN, t, S('C38') + 0.1); kinetic('奇函数', 1330, 400, 42, t, S('C38') + 0.2, { col: GRN }); }
    glowMath('f(−x) = −x³ − sin x = −f(x)', 960, 900, 40, GOLD, t, P('C38', 0.2), { align: 'center' });
    ctx.restore();
  }
  const title = ['x · sin x 在 ℝ 上有界吗？', '常数函数有最小正周期吗？', 'x³ + sin x：奇函数还是偶函数？'][q];
  glowText(title, 960, 250, 46, CR, t, P(id, 0.08));
  circleNum(q + 1, 640, 250, 30, GOLD, t, P(id, 0.02));
  QUIZ_BEATS.forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1520, 600, 92); });
};

function drawCredits(t) {
  const t0 = E('C40') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 1 章', 235, 34, GOLD, 0.08);
  T('下一段：复合函数与反函数', 335, 52, CR, 0.28);
  T('素材与授权说明', 485, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 545, 20, CR, 0.72, B);
  T('Gemini 娘立绘：ZipZipPipe（Pixiv 148186519；Bilibili 动态 1236803362705375305）。', 590, 20, CR, 0.98, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 635, 20, CR, 1.24, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 680, 20, CR, 1.50, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 725, 20, CR, 1.76, B);
  T('Claude、GPT、Gemini 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 770, 20, CR, 2.02, B);
}

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'C39', 0, 0.5), 82);
  const items = [['∃M ∀x', '有界', GOLD], ['∀M ∃x', '无界', RED], ['f(−x) = ±f(x)', '奇偶', GRN], ['f(x+T) = f(x)', '周期', INV]];
  items.forEach(([m, s, col], i) => {
    const x = 690 + i * 235, y = 500, a = ap(t, 'C39', 0.08 + i * 0.1, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.08); ctx.beginPath(); ctx.arc(x, y, 108, 0, 7); ctx.fill(); ctx.restore();
    ring(x, y, 108, col, 0.8 * a, a);
    const sz = mathW(m, 40) > 190 ? Math.floor(40 * 190 / mathW(m, 40)) : 40;
    mathText(m, x, y + sz * 0.32, sz, col, { align: 'center', glow: 12, alpha: a });
    glowText(s, x, y + 160, 40, CR, t, P('C39', 0.12 + i * 0.1));
    sparks(t, P('C39', 0.08 + i * 0.1) + 0.3, x, y, { col: [col, '#ffffff'], n: 12, speed: 260 });
  });
  glowText('用 ∀ 和 ∃，把“看起来”变成“说得清”', 1040, 790, 44, CR, t, P('C39', 0.5));
  glowText('下一段：复合函数与反函数', 1040, 870, 36, CYAN, t, P('C40', 0.2));
  drawCredits(t);
};

SC.__overlay = t => { if (t < E('C40') + 0.25) lecturer(t, 'C', 255, -5, E('C40') + 0.48, { h: 710 }); };
SC.__noTag = E('C40') + 0.30;
function drawFrame(t) { composeFrame(t, SC, TITLES); }

(function registerP3Sfx() {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  // hook
  s('D01', 0.08, 'pluck', 0.3); s('D01', 0.6, 'tick', 0.25);
  s('C01', 0.08, 'swoosh_soft', 0.34); s('C01', 0.2, 'soft_hit', 0.32); s('C01', 0.55, 'pop', 0.3); s('C01', 0.63, 'pop', 0.3);
  s('C02', 0.18, 'swoosh_soft', 0.3); sfx(P('C02', 0.18) + 0.65, 'marimba', 0.38);
  s('C02', 0.6, 'swoosh_soft', 0.3); sfx(P('C02', 0.6) + 0.65, 'marimba_hi', 0.38);
  // quant
  typeSfx(P('C03', 0.04), 10, 1.3, 0.14); s('C03', 0.3, 'pluck', 0.26);
  s('C04', 0.04, 'soft_hit', 0.36);
  { const i0 = P('C04', 0.42), dt = (P('C04', 0.96) - i0) / 6; for (let k = 0; k < 6; k++) sfx(i0 + k * dt + dt * 0.45, 'tick', 0.28); }
  s('C04', 0.97, 'check', 0.36);
  s('C05', 0.06, 'swoosh_soft', 0.36); sfx(P('C05', 0.06) + 0.9, 'tick2', 0.32);
  for (let i = 0; i < 5; i++) s('C06', 0.08 + i * 0.09, 'pluck', 0.24);
  s('C06', 0.6, 'swoosh_in', 0.3); s('C06', 0.78, 'buzz', 0.22);
  s('G01', 0.02, 'swoosh_soft', 0.32); s('G01', 0.35, 'shimmer', 0.34); s('G01', 0.08, 'bell_soft', 0.34);
  // bound
  s('C07', 0.2, 'swoosh_soft', 0.3); s('C07', 0.55, 'swoosh_soft', 0.3); s('C07', 0.74, 'marimba', 0.36);
  [0.3, 0.42, 0.56].forEach(f => sfx(P('C08', f) + 0.22, 'tick2', 0.34));
  [0.05, 0.3, 0.6].forEach((f, i) => s('C09', f + 0.05, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.34));
  s('C10', 0.05, 'pluck', 0.28); [0.5, 0.66, 0.82].forEach(f => { sfx(P('C10', f) + 0.05, 'swoosh_soft', 0.2); sfx(P('C10', f) + 0.6, 'sparkle', 0.3); });
  sfx(S('C11') + 0.05, 'swoosh_soft', 0.3); s('C11', 0.6, 'check', 0.36);
  s('C12', 0.08, 'shimmer', 0.32); s('C12', 0.5, 'soft_hit', 0.3); s('C12', 0.62, 'pop', 0.28);
  // gem
  s('M01', 0.1, 'pluck', 0.28); sfx(S('C13') + 0.1, 'riser', 0.24);
  [0.4, 0.62, 0.84].forEach(f => sfx(P('C13', f) + 0.5, 'ding', 0.3));
  s('C14', 0.04, 'tick2', 0.3); s('C14', 0.58, 'slam', 0.42); sfx(S('M02'), 'swoosh_soft', 0.3); s('C15', 0.05, 'bell_soft', 0.36);
  // mono
  s('C16', 0.05, 'pluck', 0.26); s('C16', 0.3, 'marimba_lo', 0.3); s('C16', 0.45, 'marimba', 0.3); s('C16', 0.6, 'marimba_hi', 0.3);
  // parity
  s('C22', 0.05, 'tick', 0.26); [0.3, 0.4, 0.5].forEach(f => s('C22', f, 'tinkle', 0.2)); s('C22', 0.72, 'buzz', 0.18);
  s('C23', 0.14, 'swoosh_soft', 0.32); sfx(P('C23', 0.14) + 0.8, 'tinkle', 0.32); s('C23', 0.6, 'swoosh_soft', 0.32); sfx(P('C23', 0.6) + 0.85, 'tinkle', 0.32);
  s('D03', 0.35, 'pluck', 0.28); s('C24', 0.15, 'pop', 0.32); s('C24', 0.35, 'marimba', 0.3);
  s('C25', 0.04, 'swoosh_soft', 0.32); s('C26', 0.06, 'shimmer', 0.32); s('C26', 0.3, 'shimmer', 0.26);
  [0.22, 0.45, 0.72].forEach(f => s('C26', f, 'tick', 0.24));
  sfx(P('C27', 0.18) + 0.25, 'type', 0.2); sfx(P('C27', 0.6) + 0.6, 'ding_hi', 0.36); sfx(P('C27', 0.6) + 0.6, 'sparkle', 0.28);
  s('C28', 0.45, 'swoosh_soft', 0.28); s('C28', 0.5, 'soft_hit', 0.3);
  // period
  s('C29', 0.45, 'swoosh_soft', 0.28); sfx(P('C29', 0.45) + 2.4, 'ding', 0.36); sfx(P('C30', 0.12) + 1.8, 'ding_hi', 0.34); s('C30', 0.66, 'soft_hit', 0.34);
  [0.25, 0.42, 0.58, 0.72].forEach(f => s('C31', f, 'tick2', 0.3)); s('C31', 0.8, 'bell_soft', 0.32);
  [0.15, 0.4, 0.62].forEach(f => s('C32', f, 'pluck', 0.24));
  s('G03', 0.32, 'pluck', 0.26); s('G03', 0.6, 'tick', 0.22); s('G03', 0.85, 'buzz', 0.18); s('C33', 0.1, 'bell_soft', 0.3);
  // quiz
  QUIZ_BEATS.forEach(b => countdownSfx(b.vo));
  ['M03', 'D04', 'C38'].forEach(id => sfx(S(id) + 0.1, 'check', 0.4)); s('C38', 0.3, 'swoosh_soft', 0.28);
  // outro
  [0.08, 0.18, 0.28, 0.38].forEach((f, i) => s('C39', f, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.3));
  s('C40', 0.3, 'swell', 0.32);
})();
finalize();
