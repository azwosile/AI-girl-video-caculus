// P6《指数、e 与增长》（2026-10-27）：所有数学画面为原创 Canvas 绘制；沿用共享时间轴与组件，画风对齐 P1–P5。
// 版面约定：讲师占 x<540；主内容区 x 600–1460（GPT / 大肥鱼在右侧时不越界）；公式 44–64px；字幕区 y≥964 不放内容。
// 配色（制作规范“颜色语义”）：x = 青，y / 数值 = 金，函数 f = 红，第二个函数 g = 绿，反函数 / 切线等辅助 = 紫，正确 = 绿。
const SC = {};
const TITLES = [
  ['hook','利滚利能滚多少'], ['rules','回忆：运算法则'], ['e','调底数，找 e'], ['compound','复利逼近 e'],
  ['race','增长赛跑'], ['mirror','指数与对数：镜像'], ['model','用残差挑模型'], ['window','窗口陷阱'], ['quiz','随堂一题']
];
const TAU = Math.PI * 2, PI = Math.PI, EE = Math.E, CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv;
const QUIZ_BEATS = ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz');
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sci = v => { const k = Math.floor(Math.log10(v)), m = v / Math.pow(10, k); return (m < 1.05 ? '' : m.toFixed(1) + '×') + '10' + String(k).split('').map(c => SUP[c]).join(''); };
// ---------- 坐标系（与 P3 相同的独立 x/y 比例实现） ----------
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
function gClip(G) { ctx.beginPath(); ctx.rect(gx(G, G.x0) - 6, gy(G, G.y1) - 6, (G.x1 - G.x0) * G.ux + 12, (G.y1 - G.y0) * G.uy + 12); ctx.clip(); }
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
function gPlot(G, f, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  let xa = o.xa ?? G.x0, xb = o.xb ?? G.x1;
  if (o.rev) xa = lerp(xb, xa, p); else xb = lerp(xa, xb, p);
  const segs = gSegs(G, f, xa, xb, Math.max(8, Math.round((o.n || 400) * Math.max(p, 0.05))), o.jump || (G.y1 - G.y0) * 0.6);
  ctx.save(); gClip(G);
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
  if (a <= 0) return; ctx.save(); ctx.fillStyle = hexA(col, 0.12 * a);
  ctx.fillRect(gx(G, xa), gy(G, hi), (xb - xa) * G.ux, (hi - lo) * G.uy); ctx.restore();
}
// y = x 虚线
function gDiag(G, a = 1, col = CR) {
  if (a <= 0) return; const lo = Math.max(G.x0, G.y0), hi = Math.min(G.x1, G.y1);
  ctx.save(); gClip(G); ctx.setLineDash([10, 9]); glowPath(() => { ctx.moveTo(gx(G, lo), gy(G, lo)); ctx.lineTo(gx(G, hi), gy(G, hi)); }, col, 2.2, 0.55 * a); ctx.restore();
}
// 沿 y = x 的"立体翻折"：th 从 0 到 π，垂直于 y = x 的分量按 cos th 收缩再翻到另一侧
function foldXY(x, y, th) { const m = (x + y) / 2, d = (x - y) / 2 * Math.cos(th); return [m + d, m - d]; }
function foldCurve(G, f, xa, xb, th, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const pts = []; for (let i = 0; i <= 200; i++) { const x = xa + (xb - xa) * i / 200, [X, Y] = foldXY(x, f(x), th); pts.push([gx(G, X), gy(G, Y)]); }
  ctx.save(); gClip(G); if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, (o.w || 4.5) * (0.75 + 0.25 * Math.abs(Math.cos(th))), a);
  ctx.restore();
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
function partSpan(parts, i, cx, size) { const xs = rowX(parts.map(p => p[0]), size, cx); return [xs[i], xs[i] + mathW(parts[i][0], size)]; }
// 中文 + 公式同一行（中文用标题字体，公式用数学字体）
function zhMath(zh, m, cx, y, size, cz, cm, t, t0, o = {}) {
  ctx.save(); ctx.font = `bold ${size}px ${F_FANCY}`; const wz = ctx.measureText(zh).width; ctx.restore();
  const ms = size * 1.12, wm = mathW(m, ms), gap = 16, x0 = cx - (wz + gap + wm) / 2;
  glowText(zh, x0, y, size, cz, t, t0, { align: 'left', out: o.out });
  glowMath(m, x0 + wz + gap, y + ms * 0.34, ms, cm, t, t0 + 0.12, { out: o.out });
}
// 术语首次出现：中英对照一行
function term(en, zh, x, y, t, t0, o = {}) {
  glowText(`${zh} · ${en}`, x, y, o.size || 32, o.col || CYAN, t, t0, { bold: false, out: o.out });
}

// 通用：圆角卡片
function card(x, y, w, h, col, a = 1, r = 18) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(11,16,34,0.78)'; rr(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = hexA(col, 0.8); ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 14; rr(x, y, w, h, r); ctx.stroke(); ctx.restore();
}
// 通用：任意坐标映射的折线（自带裁剪框）
function plotMap(fx, xa, xb, n, map, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return null;
  const xe = lerp(xa, xb, p), pts = [];
  for (let i = 0; i <= n; i++) { const x = lerp(xa, xe, i / n), y = fx(x); if (!isFinite(y)) continue; const q = map(x, y); if (q) pts.push(q); }
  if (pts.length < 2) return null;
  ctx.save(); if (o.clip) { ctx.beginPath(); ctx.rect(...o.clip); ctx.clip(); } if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => pts.forEach(([X, Y], i) => i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)), col, o.w || 4.5, a); ctx.restore();
  return pts[pts.length - 1];
}

// ======================= hook =======================
// D01 存 1 块，年利率 100%：一年结一次 → 2；天天结？ → C01 柱子越长越慢，贴住 e → C02 本段三件事
const HB = [[1, '1', 2], [2, '2', 2.25], [4, '4', 2.4414], [12, '12', 2.6130], [365, '365', 2.7146]];
const HY0 = 820, HU = 150, hbx = i => 760 + i * 150;
SC.hook = t => {
  starfield(t); blueprint(ap(t, 'D01', 0, 0.7), 72);
  const dim = 1 - 0.6 * ap(t, 'C02', 0.05, 0.5);
  glowText('存 1 块 · 年利率 100% · 一年结 n 次', 1060, 270, 40, CR, t, P('D01', 0.05), { out: S('C02') });
  // 底线与 n 轴
  const ax = ap(t, 'D01', 0.1, 0.5);
  seg(700, HY0, 1430, HY0, CR, 0.6 * ax * dim, 2);
  glowText('每年结息次数 n', 1060, 900, 26, CYAN, t, P('D01', 0.2), { bold: false, alpha: dim });
  HB.forEach(([n, lab, v], i) => {
    const t0 = i === 0 ? P('D01', 0.32) : P('C01', 0.04 + (i - 1) * 0.1), g = eOut(prog(t, t0, 0.55)), x = hbx(i);
    glowText(lab, x, HY0 + 38, 30, CYAN, t, P('D01', 0.2), { font: F_MATH, bold: false, alpha: dim });
    if (g <= 0) { if (i > 0 && t > P('D01', 0.68)) kinetic('?', x, HY0 - 120, 52, t, P('D01', 0.68 + i * 0.04), { col: GOLD, out: t0 }); return; }
    const h = HU * v * g;
    ctx.save(); ctx.globalAlpha *= dim; ctx.fillStyle = hexA(GOLD, 0.22); ctx.fillRect(x - 36, HY0 - h, 72, h); ctx.restore();
    glowPath(() => { ctx.moveTo(x - 36, HY0); ctx.lineTo(x - 36, HY0 - h); ctx.lineTo(x + 36, HY0 - h); ctx.lineTo(x + 36, HY0); }, GOLD, 3, dim);
    mathText(v.toFixed(i ? (i > 2 ? 4 : 2) : 0), x, i > 2 ? HY0 - h + 40 : HY0 - h - 18, i > 2 ? 22 : 28, GOLD, { align: 'center', glow: 8, alpha: g * dim });
  });
  if (t > P('D01', 0.32) + 0.5 && t < S('C01')) kinetic('× 2', hbx(0) + 70, HY0 - 340, 40, t, P('D01', 0.32) + 0.5, { col: GOLD, font: F_MATH, bold: false });
  // C01：e 这条线
  const el = ap(t, 'C01', 0.55, 0.6);
  if (el > 0) {
    ctx.save(); ctx.setLineDash([12, 9]); glowPath(() => { ctx.moveTo(700, HY0 - HU * EE); ctx.lineTo(lerp(700, 1430, el), HY0 - HU * EE); }, GOLD, 2.6, el); ctx.restore();
    mathText('e = 2.71828…', 705, HY0 - HU * EE - 16, 34, GOLD, { align: 'left', glow: 12, alpha: el * (t < S('C02') ? 1 : 0.7) });
  }
  if (t > P('C01', 0.08) && t < S('C02')) glowText('结得越勤，增幅越小', 1060, 340, 34, CR, t, P('C01', 0.3), { bold: false });
  // C02：三件事
  [['① e 从哪来', GOLD], ['② 谁增长得更快', GRN], ['③ 看图、看数据的陷阱', RED]].forEach(([s, col], k) => {
    const x = [770, 1000, 1290][k], a = ap(t, 'C02', 0.15 + k * 0.2, 0.4); if (a <= 0) return;
    ctx.save(); ctx.font = `bold 34px ${F_FANCY}`; const w = ctx.measureText(s).width; ctx.restore();
    card(x - w / 2 - 22, 255, w + 44, 70, col, a, 14);
    glowText(s, x, 302, 34, col, t, P('C02', 0.15 + k * 0.2));
  });
};

// ======================= rules（GPT 回忆卡） =======================
const RULES = [
  [[['a^x · a^y', CR], ['  =  ', CR], ['a^{x+y}', GOLD]], '同底相乘，指数相加'],
  [[['(a^x)^y', CR], ['  =  ', CR], ['a^{xy}', GOLD]], '乘方再乘方，指数相乘'],
  [[['(ab)^x', CR], ['  =  ', CR], ['a^x b^x', GOLD]], '积的乘方 = 乘方的积']
];
const GR0 = { cx: 1000, cy: 860, ux: 105, uy: 72, x0: -3.2, x1: 3.2, y0: -0.3, y1: 4.4 };
SC.rules = t => {
  starfield(t); blueprint(ap(t, 'G01', 0, 0.5), 74);
  const c = ap(t, 'G01', 0.02, 0.4), sh = ap(t, 'G02', 0.0, 0.5);
  ctx.save(); ctx.translate(0, -40 * sh); ctx.globalAlpha *= 1 - 0.35 * sh;
  card(640, 205, 800, 300, GOLD, c);
  glowText('高中回忆卡', 690, 250, 28, GOLD, t, P('G01', 0.04), { align: 'left' });
  RULES.forEach(([parts, zh], i) => {
    const t0 = P('G01', 0.12 + i * 0.25), y = 318 + i * 70;
    richReveal(parts, 690, y, 42, t, t0, { align: 'left' });
    glowText(zh, 1410, y - 12, 28, CYAN, t, t0 + 0.3, { align: 'right', bold: false });
  });
  ctx.restore();
  // G02：几条 aˣ 都过 (0, 1)
  if (sh > 0) {
    gAxes(GR0, sh, { grid: false, ticks: { x: [[-2, '−2'], [2, '2']], y: [[1, '1'], [4, '4']] } });
    const curves = [[x => Math.pow(2, x), '2^x', RED, 1, 0.0], [x => Math.pow(3, x), '3^x', RED, 0.75, 0.12], [x => Math.pow(0.5, x), '(1/2)^x', RED, 0.55, 0.28]];
    curves.forEach(([f, lab, col, al, d], i) => {
      gPlot(GR0, f, col, { p: prog(t, P('G02', 0.08 + d), 0.9), a: al, dash: i === 2 ? [10, 8] : null, w: i === 2 ? 3 : 4.5 });
      const lx = [1.95, 1.2, -2.2][i];
      mathText(lab, gx(GR0, lx) + (i === 2 ? -14 : 14), gy(GR0, Math.min(4.1, f(lx))) + 8, 30, col, { align: i === 2 ? 'right' : 'left', glow: 8, alpha: al * ap(t, 'G02', 0.3 + d) });
    });
    const pa = ap(t, 'G02', 0.6, 0.4);
    if (pa > 0) { glowDot(gx(GR0, 0), gy(GR0, 1), 11, GOLD, pa); mathText('(0, 1)', gx(GR0, 0) + 18, gy(GR0, 1) + 36, 30, GOLD, { glow: 8, alpha: pa }); burst(t, P('G02', 0.6), gx(GR0, 0), gy(GR0, 1), GOLD, 90, 12); }
    glowText('a > 1 递增　·　0 < a < 1 递减', 1040, 512, 28, RED, t, P('G02', 0.3), { bold: false });
  }
};

// ======================= e（A30：调底数找 e） =======================
// C03 a = 2，(0, 1) 处的切线 → C04 斜率 0.69 → 拖到 3：1.10 → C05 来回找，停在 e：斜率 1.00 → C06 自然指数 / 自然对数 → D02 为什么是 1 → C07 eˣ 的斜率 = 高度
const GE = { cx: 880, cy: 770, ux: 150, uy: 100, x0: -1.75, x1: 2.25, y0: -0.4, y1: 4.25 };
function baseA(t) {
  if (t < P('C04', 0.45)) return 2;
  if (t < S('C05')) return lerp(2, 3, eIO(prog(t, P('C04', 0.45), 1.0)));
  const u = prog(t, P('C05', 0.05), 2.0);
  return EE + (3 - EE) * Math.cos(u * 2.6 * PI) * Math.exp(-3.2 * u) * (1 - u);
}
const SL = { x0: 720, x1: 1240, y: 300, a0: 1.6, a1: 3.4 };
const slX = a => lerp(SL.x0, SL.x1, (a - SL.a0) / (SL.a1 - SL.a0));
SC.e = t => {
  starfield(t); blueprint(ap(t, 'C03', 0, 0.5), 76);
  const late = ap(t, 'C06', 0.0, 0.5), a = t < S('C06') ? baseA(t) : EE, k = Math.log(a), hit = Math.abs(k - 1) < 0.006 && t > P('C05', 0.05);
  gAxes(GE, ap(t, 'C03', 0.02, 0.4), { gx: 1, gy: 1, ticks: { x: [[-1, '−1'], [1, '1'], [2, '2']], y: [[1, '1'], [2, '2'], [3, '3'], [4, '4']] } });
  gPlot(GE, x => Math.pow(a, x), RED, { p: prog(t, P('C03', 0.05), 0.9), n: 300 });
  mathText(t < S('C06') ? 'y = a^x' : 'y = e^x', gx(GE, 1.55) + 10, gy(GE, 2.4), 36, RED, { glow: 10, alpha: ap(t, 'C03', 0.25) });
  // 切线（C03–C06）
  const ta = ap(t, 'C03', 0.35, 0.5) * (1 - ap(t, 'C07', 0.0, 0.3));
  if (ta > 0) {
    const col = hit ? GRN : INV;
    seg(gx(GE, -1.3), gy(GE, 1 - 1.3 * k), gx(GE, 1.6), gy(GE, 1 + 1.6 * k), col, ta, 3.2);
    glowDot(gx(GE, 0), gy(GE, 1), 10, GOLD, ta);
  }
  // 斜率读数
  const ra = ap(t, 'C03', 0.55, 0.4) * (1 - late);
  if (ra > 0) {
    card(1265, 420, 185, 150, hit ? GRN : INV, ra, 14);
    glowText('切线斜率', 1357, 462, 26, CR, t, P('C03', 0.55), { bold: false, alpha: 1 - late });
    mathText(k.toFixed(2), 1357, 540, 54, hit ? GRN : INV, { align: 'center', glow: 14, alpha: ra, upright: true });
  }
  if (t > P('C04', 0.12) && t < P('C04', 0.45)) glowText('0.69 < 1', 1357, 620, 30, INV, t, P('C04', 0.12), { bold: false });
  if (t > P('C04', 0.45) + 1.0 && t < S('C05')) glowText('1.10 > 1', 1357, 620, 30, INV, t, P('C04', 0.45) + 1.0, { bold: false });
  // 底数滑块
  const sa = ap(t, 'C03', 0.1, 0.4) * (1 - late);
  if (sa > 0) {
    ctx.save(); ctx.globalAlpha *= sa;
    seg(SL.x0, SL.y, SL.x1, SL.y, CR, 0.5, 4);
    [[2, '2'], [3, '3']].forEach(([v, l]) => { seg(slX(v), SL.y - 10, slX(v), SL.y + 10, CR, 0.6, 2); mathText(l, slX(v), SL.y + 44, 28, CR, { align: 'center', glow: 4 }); });
    if (t > P('C05', 0.05)) { seg(slX(EE), SL.y - 14, slX(EE), SL.y + 14, GOLD, 0.9, 3); mathText('e', slX(EE), SL.y + 44, 30, GOLD, { align: 'center', glow: 8 }); }
    glowDot(slX(a), SL.y, 14, hit ? GRN : GOLD);
    mathText('a = ' + a.toFixed(2), SL.x0 - 20, SL.y + 10, 32, GOLD, { align: 'right', glow: 8 });
    ctx.restore();
  }
  glowText('底数 a 不同，(0, 1) 处的斜率就不同', 1060, 230, 30, CR, t, P('C03', 0.45), { bold: false, out: P('C04', 0.4) });
  // C05：停在 e
  if (t > P('C05', 0.05)) gPlot(GE, x => 1 + x, CR, { xa: -1.3, xb: 1.6, dash: [8, 8], a: 0.5 * (1 - late) });
  if (t > P('C05', 0.05) + 2.0) {
    burst(t, P('C05', 0.05) + 2.0, gx(GE, 0), gy(GE, 1), GRN, 130, 18);
    glowMath('e ≈ 2.71828', 1060, 238, 50, GOLD, t, P('C05', 0.05) + 2.0, { align: 'center', out: S('C06') });
  }
  // C06：两张名片
  if (late > 0) {
    card(625, 815, 380, 110, RED, late, 14); card(1040, 815, 410, 110, INV, ap(t, 'C06', 0.45, 0.4), 14);
    glowMath('e^x', 690, 885, 44, RED, t, P('C06', 0.05)); glowText('自然指数函数', 990, 880, 30, CR, t, P('C06', 0.15), { align: 'right', bold: false });
    glowMath('ln x = log_e x', 1065, 885, 40, INV, t, P('C06', 0.45)); glowText('自然对数', 1430, 880, 30, CR, t, P('C06', 0.55), { align: 'right', bold: false });
    term('natural exponential / natural logarithm', '自然指数 / 自然对数', 1040, 240, t, P('C06', 0.6), { size: 28, out: S('D02') });
  }
  if (t > S('D02') && t < S('C07') + 0.2) kinetic('为什么非要斜率 = 1？', 1040, 250, 48, t, S('D02') + 0.05, { col: GOLD });
  // C07：斜率 = 高度
  if (t > S('C07')) {
    const u = eIO(prog(t, P('C07', 0.08), Math.max(2.4, D('C07') * 0.7))), x = lerp(-1.4, 1.3, u), y = Math.exp(x), a7 = ap(t, 'C07', 0.05, 0.3);
    seg(gx(GE, x), gy(GE, 0), gx(GE, x), gy(GE, y), GOLD, a7, 4);
    ctx.save(); gClip(GE); seg(gx(GE, x - 0.9), gy(GE, y - 0.9 * y), gx(GE, x + 0.9), gy(GE, y + 0.9 * y), INV, a7, 3); ctx.restore();
    glowDot(gx(GE, x), gy(GE, y), 10, GOLD, a7);
    card(1265, 420, 185, 190, GOLD, a7, 14);
    glowText('高度', 1357, 458, 24, GOLD, t, P('C07', 0.05), { bold: false }); mathText(y.toFixed(2), 1357, 505, 40, GOLD, { align: 'center', glow: 10, alpha: a7, upright: true });
    glowText('斜率', 1357, 548, 24, INV, t, P('C07', 0.05), { bold: false }); mathText(y.toFixed(2), 1357, 595, 40, INV, { align: 'center', glow: 10, alpha: a7, upright: true });
    glowMath('(e^x)′ = e^x', 1040, 250, 54, GRN, t, P('C07', 0.35), { align: 'center' });
    glowText('学导数时会证明', 1040, 310, 28, CYAN, t, P('C07', 0.6), { bold: false });
  }
};

// ======================= compound（A31：复利逼近 e） =======================
const CN = [[1, '年'], [2, '半年'], [4, '季'], [12, '月'], [52, '周'], [365, '天'], [8760, '时'], [525600, '分']];
const cX = n => 700 + Math.log10(n) * 118, cY = v => 840 - (v - 1.9) * 500;
const cV = n => Math.pow(1 + 1 / n, n);
SC.compound = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5), 78);
  const ax = ap(t, 'C08', 0.3, 0.5);
  ctx.save(); ctx.globalAlpha *= ax;
  seg(680, 860, 1440, 860, CR, 0.6, 2); seg(680, 860, 680, 380, CR, 0.6, 2);
  [[1, '1'], [10, '10'], [100, '100'], [1000, '10³'], [1e4, '10⁴'], [1e5, '10⁵'], [1e6, '10⁶']].forEach(([n, l]) => { seg(cX(n), 853, cX(n), 867, CR, 0.6, 2); mathText(l, cX(n), 898, 24, CR, { align: 'center', glow: 0, alpha: 0.75 }); });
  [[2, '2'], [2.5, '2.5']].forEach(([v, l]) => { seg(673, cY(v), 687, cY(v), CR, 0.6, 2); mathText(l, 664, cY(v) + 8, 24, CR, { align: 'right', alpha: 0.75 }); });
  glowText('n（对数刻度）', 1440, 935, 24, CYAN, t, P('C08', 0.3), { align: 'right', bold: false });
  ctx.restore();
  richReveal([['每次利率 1/n  ⇒  一年后：', CR], ['(1 + 1/n)^n', GOLD]], 1060, 270, 44, t, P('C08', 0.05), { out: S('C10') });
  // e 线
  const el = ap(t, 'C10', 0.08, 0.6);
  if (el > 0) { ctx.save(); ctx.setLineDash([12, 9]); glowPath(() => { ctx.moveTo(680, cY(EE)); ctx.lineTo(lerp(680, 1440, el), cY(EE)); }, GOLD, 2.6, el); ctx.restore(); mathText('e', 1446, cY(EE) + 10, 38, GOLD, { glow: 12, alpha: el }); }
  // 点列：C08 n = 1；C09 2、4、12、365；C10 其余
  const tOf = i => [P('C08', 0.55), P('C09', 0.05), P('C09', 0.15), P('C09', 0.3), P('C10', 0.2), P('C09', 0.62), P('C10', 0.32), P('C10', 0.44)][i];
  let prev = null;
  CN.forEach(([n, l], i) => {
    const a = eOut(prog(t, tOf(i), 0.35)); if (a <= 0) return;
    const X = cX(n), Y = cY(cV(n));
    if (prev) seg(prev[0], prev[1], X, Y, GOLD, 0.35 * a, 2, [5, 6]);
    glowDot(X, Y, 9, GOLD, a);
    glowText(l, X, Y + 38, 24, CYAN, t, tOf(i), { bold: false });
    if ([0, 3, 5].includes(i)) mathText(cV(n).toFixed(i ? (i === 3 ? 3 : 4) : 0), X, Y - 22, 30, GOLD, { align: 'center', glow: 8, alpha: a });
    prev = [X, Y];
  });
  if (t > S('C10')) {
    richReveal([['n → ∞ ：', CR], ['(1 + 1/n)^n', GOLD], ['  →  ', CR], ['e', GOLD]], 1060, 270, 46, t, P('C10', 0.04));
    glowText('越来越近，但永远越不过 e', 1060, 335, 30, CR, t, P('C10', 0.55), { bold: false });
  }
  if (t > S('D03')) kinetic('利滚利的上限 ≈ 2.718 倍', 1060, 640, 44, t, S('D03') + 0.05, { col: GOLD });
};

// ======================= race（A32：增长赛跑 + 对数纵轴） =======================
// C11 ln x / x² / 2ˣ 一起跑 → C12 交点 2、4，过了 4 一路甩开 → C13 纵轴换对数刻度：指数变直线 → C14 ln x ≪ xᵖ ≪ aˣ → G03
const RB = { L: 690, R: 1410, T: 380, B: 840, x1: 10, y1: 70 };
const rLog = y => y > 0 ? (Math.log10(y) + 1) * 17.5 : -20;
function rMap(m) { return (x, y) => { const Y = lerp(y, rLog(y), m); if (!isFinite(Y)) return null; return [RB.L + x / RB.x1 * (RB.R - RB.L), RB.B - clamp(Y, -12, RB.y1 + 12) / RB.y1 * (RB.B - RB.T)]; }; }
const RF = [[x => Math.log(x), 'ln x', INV], [x => x * x, 'x^2', RED], [x => Math.pow(2, x), '2^x', GRN]];
SC.race = t => {
  starfield(t); blueprint(ap(t, 'C11', 0, 0.5), 80);
  const m = eIO(prog(t, P('C13', 0.12), 1.2)), map = rMap(m), ax = ap(t, 'C11', 0.02, 0.4);
  const clip = [RB.L - 4, RB.T - 30, RB.R - RB.L + 30, RB.B - RB.T + 34];
  // 坐标轴
  ctx.save(); ctx.globalAlpha *= ax;
  seg(RB.L, RB.B, RB.R + 10, RB.B, CR, 0.6, 2); seg(RB.L, RB.B + 6, RB.L, RB.T - 20, CR, 0.6, 2);
  [2, 4, 6, 8, 10].forEach(v => { const X = RB.L + v / RB.x1 * (RB.R - RB.L); seg(X, RB.B - 6, X, RB.B + 6, CR, 0.6, 2); mathText(String(v), X, RB.B + 34, 24, CR, { align: 'center', alpha: 0.75 }); });
  [[20, '20'], [40, '40'], [60, '60']].forEach(([v, l]) => { const Y = RB.B - v / RB.y1 * (RB.B - RB.T); mathText(l, RB.L - 12, Y + 8, 24, CR, { align: 'right', alpha: 0.75 * (1 - m) }); seg(RB.L - 6, Y, RB.L + 6, Y, CR, 0.6 * (1 - m), 2); });
  [[0.1, '0.1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']].forEach(([v, l]) => { const Y = RB.B - rLog(v) / RB.y1 * (RB.B - RB.T); mathText(l, RB.L - 12, Y + 8, 24, CYAN, { align: 'right', alpha: 0.85 * m }); seg(RB.L - 6, Y, RB.R, Y, CYAN, 0.18 * m, 1); });
  ctx.restore();
  // 三条曲线
  const p = eIO(prog(t, P('C11', 0.15), 3.2));
  RF.forEach(([f, lab, col], i) => {
    const head = plotMap(f, i === 0 ? 0.35 : 0.02, 10, 400, map, col, { p, clip, w: 4.5 });
    if (head && head[1] < RB.T) { let lo = 0.5, hi = 10; for (let k = 0; k < 40; k++) { const md = (lo + hi) / 2, q = map(md, f(md)); if (q && q[1] < RB.T) hi = md; else lo = md; } const q = map(lo, f(lo)); mathText(lab, q[0] + (i === 1 ? 14 : -14), RB.T - 8, 32, col, { glow: 10, align: i === 1 ? 'left' : 'right' }); }
    else if (head) { const hy = Math.max(head[1], RB.T + 6); glowDot(head[0], hy, 8, col, head[1] > RB.T - 10 ? 1 : 0); mathText(lab, Math.min(head[0] + 14, 1400), hy - 12, 32, col, { glow: 10, upright: i === 0 }); }
  });
  // C12：交点 2、4
  const c2 = ap(t, 'C12', 0.05, 0.4);
  if (c2 > 0) {
    [[2, 4], [4, 16]].forEach(([x, y], k) => {
      const q = map(x, y), a = ap(t, 'C12', 0.05 + k * 0.25, 0.4); if (!q || a <= 0) return;
      glowDot(q[0], q[1], 10, GOLD, a); seg(q[0], q[1], q[0], RB.B, GOLD, 0.5 * a, 2, [5, 6]);
      mathText(`x = ${x}`, q[0], RB.B + 62, 26, GOLD, { align: 'center', glow: 6, alpha: a * (1 - m) });
    });
    glowText('2 到 4：x² 领先', 1060, 300, 32, RED, t, P('C12', 0.15), { out: P('C12', 0.5), bold: false });
    glowText('过了 4：指数一路甩开', 1060, 300, 32, GRN, t, P('C12', 0.55), { out: S('C13'), bold: false });
  }
  // C13：对数纵轴
  if (t > S('C13')) {
    glowText('纵轴换成对数刻度', 1060, 290, 34, CYAN, t, P('C13', 0.04), { out: S('C14') });
    if (m >= 1) { glowText('指数 → 直线', 1250, 470, 30, GRN, t, P('C13', 0.12) + 1.2, { bold: false }); glowText('幂 → 越来越平', 1250, 640, 30, RED, t, P('C13', 0.12) + 1.5, { bold: false }); }
  }
  if (t > S('C14')) {
    richReveal([['ln x', INV], ['  ≪  ', CR], ['x^p', RED], ['  ≪  ', CR], ['a^x', GRN]], 1050, 275, 58, t, P('C14', 0.08), { upright: false });
    glowText('（x 足够大；p > 0，a > 1）', 1050, 335, 28, CR, t, P('C14', 0.45), { bold: false, out: S('G03') });
    burst(t, P('C14', 0.3), 1050, 260, GOLD, 160, 20);
  }
  if (t > S('G03')) kinetic('求极限时反复用到', 1050, 335, 36, t, S('G03') + 0.15, { col: GOLD });
};

// ======================= mirror（A33：eˣ 与 ln x 镜像） =======================
const GM = { cx: 880, cy: 630, ux: 66, uy: 66, x0: -3.2, x1: 6.8, y0: -3.7, y1: 4.7 };
SC.mirror = t => {
  starfield(t); blueprint(ap(t, 'C15', 0, 0.5), 82);
  const z = ap(t, 'C16', 0.0, 0.45), a1 = 1 - z;
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    gAxes(GM, ap(t, 'C15', 0.02, 0.4), { gx: 1, gy: 1, ticks: { x: [[1, '1'], [EE, 'e']], y: [[1, '1'], [EE, 'e']] } });
    gDiag(GM, ap(t, 'C15', 0.2, 0.4)); mathText('y = x', gx(GM, 4.5) + 10, gy(GM, 4.5), 30, CR, { glow: 6, alpha: ap(t, 'C15', 0.2) });
    gPlot(GM, Math.exp, RED, { xa: -3.2, xb: 1.55, p: prog(t, P('C15', 0.05), 0.8) });
    mathText('e^x', gx(GM, 1.45) + 14, gy(GM, 4.3), 36, RED, { glow: 10, alpha: ap(t, 'C15', 0.2) });
    const th = PI * eIO(prog(t, P('C15', 0.35), 1.4));
    if (th > 0 && th < PI) foldCurve(GM, Math.exp, -3.2, 1.55, th, INV, { a: 0.9 });
    if (th >= PI) {
      gPlot(GM, Math.log, INV, { xa: 0.03, xb: 6.8, n: 400 });
      mathText('ln x', gx(GM, 6.0), gy(GM, Math.log(6)) + 40, 36, INV, { glow: 10, upright: true });
      const pa = ap(t, 'C15', 0.75, 0.4);
      glowDot(gx(GM, 1), gy(GM, EE), 9, GOLD, pa); glowDot(gx(GM, EE), gy(GM, 1), 9, GOLD, pa);
      seg(gx(GM, 1), gy(GM, EE), gx(GM, EE), gy(GM, 1), GOLD, 0.6 * pa, 2, [5, 6]);
      mathText('(1, e)', gx(GM, 1) - 14, gy(GM, EE) - 10, 26, GOLD, { align: 'right', glow: 6, alpha: pa });
      mathText('(e, 1)', gx(GM, EE) + 14, gy(GM, 1) + 30, 26, GOLD, { glow: 6, alpha: pa });
    }
    glowText('互为反函数 · 关于 y = x 对称', 1060, 260, 34, INV, t, P('C15', 0.5));
    ctx.restore();
  }
  // C16：横轴一路放大，ln x 才爬到 10
  if (z > 0) {
    ctx.save(); ctx.globalAlpha *= z;
    const u = eIO(prog(t, P('C16', 0.1), Math.max(2.6, D('C16') * 0.62))), X = Math.exp(lerp(Math.log(8), Math.log(25000), u));
    const L = 690, R = 1410, B = 840, T = 400, mx = x => L + x / X * (R - L), my = y => B - y / 11 * (B - T);
    seg(L, B, R + 10, B, CR, 0.6, 2); seg(L, B + 6, L, T - 20, CR, 0.6, 2);
    [2, 4, 6, 8, 10].forEach(v => { seg(L - 6, my(v), L + 6, my(v), CR, 0.6, 2); mathText(String(v), L - 12, my(v) + 8, 24, CR, { align: 'right', alpha: 0.75 }); });
    const step = Math.pow(10, Math.floor(Math.log10(X / 2)));
    for (let v = step; v < X; v += step) { const xx = mx(v); seg(xx, B - 6, xx, B + 6, CR, 0.5, 2); }
    mathText('x 轴右端：' + Math.round(X).toLocaleString('en-US'), R, B + 44, 28, CYAN, { align: 'right', glow: 6 });
    plotMap(Math.log, X / 3000, X, 500, (x, y) => [mx(x), my(Math.max(y, -0.4))], INV, { clip: [L, T - 30, R - L + 20, B - T + 34] });
    const xp = Math.min(X, 22026.47), q = [mx(xp), my(Math.log(xp))];
    glowDot(q[0], q[1], 10, GOLD);
    mathText('ln x = ' + Math.log(xp).toFixed(2), q[0] - 16, q[1] - 22, 30, GOLD, { align: 'right', glow: 8 });
    if (u >= 1) { gH({ cx: 0, cy: B, ux: 1, uy: (B - T) / 11, x0: L, x1: R }, 10, GOLD, 0.6); glowMath('ln x = 10  ⇔  x = e^{10} ≈ 22026', 1050, 300, 42, GOLD, t, P('C16', 0.1) + Math.max(2.6, D('C16') * 0.62), { align: 'center' }); }
    else glowText('一个极快，一个极慢', 1050, 300, 36, CR, t, P('C16', 0.05));
    ctx.restore();
  }
};

// ======================= model（A34 上：残差） =======================
// 示例数据：y = 3·1.32ˣ ·（1 + 扰动），x = 0…10；扰动用固定种子生成，每次渲染一致
const MD = (() => { let s = 20261027; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648 * 2 - 1;
  const pts = []; for (let x = 0; x <= 10; x++) pts.push([x, 3 * Math.pow(1.32, x) * (1 + 0.07 * rnd())]);
  const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const fit = ys => { const my = ys.reduce((s, v) => s + v, 0) / n; let sxy = 0, sxx = 0; pts.forEach((p, i) => { sxy += (p[0] - mx) * (ys[i] - my); sxx += (p[0] - mx) ** 2; }); const b = sxy / sxx; return [my - b * mx, b]; };
  const lin = fit(pts.map(p => p[1])), le = fit(pts.map(p => Math.log(p[1])));
  return { pts, lin, le, fl: x => lin[0] + lin[1] * x, fe: x => Math.exp(le[0] + le[1] * x) }; })();
const GD = { cx: 700, cy: 740, ux: 64, uy: 7.4, x0: -0.3, x1: 10.6, y0: -4, y1: 52 };
const GL = { cx: 700, cy: 740, ux: 64, uy: 100, x0: -0.3, x1: 10.6, y0: 0, y1: 4.0 };
SC.model = t => {
  starfield(t); blueprint(ap(t, 'C17', 0, 0.5), 84);
  const lin = ap(t, 'C18', 0.05, 0.5) * (1 - ap(t, 'C19', 0.02, 0.4)), ex = ap(t, 'C19', 0.05, 0.5), lg = eIO(prog(t, P('G04', 0.15), 1.1));
  const yOf = (x, y) => lerp(gy(GD, y), gy(GL, Math.log(y)), lg);
  // 轴
  const ax = ap(t, 'C17', 0.02, 0.4);
  ctx.save(); ctx.globalAlpha *= ax;
  seg(gx(GD, 0), gy(GD, 0), gx(GD, 10.6), gy(GD, 0), CR, 0.6, 2); seg(gx(GD, 0), gy(GD, 0) + 6, gx(GD, 0), gy(GD, 52), CR, 0.6, 2);
  mathText('y', gx(GD, 0) - 14, gy(GD, 50), 30, GOLD, { align: 'right', glow: 6, alpha: 1 - lg }); mathText('ln y', gx(GD, 0) - 14, gy(GD, 50), 30, GOLD, { align: 'right', glow: 6, alpha: lg });
  mathText('x', gx(GD, 10.6) + 10, gy(GD, 0) + 8, 30, CYAN, { glow: 6 });
  ctx.restore();
  glowText('示例数据（按指数规律生成，加了随机扰动）', 1050, 285, 26, CR, t, P('C17', 0.1), { bold: false, out: S('C18') });
  // 拟合曲线
  if (lin > 0) { gPlot(GD, MD.fl, RED, { xa: 0, xb: 10.4, p: prog(t, P('C18', 0.05), 0.6), a: lin * (1 - lg) }); mathText('直线', gx(GD, 10.4), gy(GD, MD.fl(10.4)) + 40, 28, RED, { align: 'right', alpha: lin }); }
  if (ex > 0) {
    if (lg < 1) gPlot(GD, MD.fe, GRN, { xa: 0, xb: 10.4, p: prog(t, P('C19', 0.05), 0.6), a: ex * (1 - lg) });
    if (lg > 0) gPlot(GL, x => MD.le[0] + MD.le[1] * x, GRN, { xa: 0, xb: 10.4, a: lg });
  }
  // 点 + 残差竖线
  MD.pts.forEach(([x, y], i) => {
    const a = eOut(prog(t, P('C17', 0.15 + i * 0.035), 0.3)); if (a <= 0) return;
    const X = gx(GD, x), Y = yOf(x, y);
    if (lin > 0) seg(X, Y, X, gy(GD, MD.fl(x)), RED, 0.8 * lin * (1 - lg), 2.2, [4, 4]);
    if (ex > 0 && lg < 1) seg(X, Y, X, gy(GD, MD.fe(x)), GRN, 0.8 * ex * (1 - lg), 2.2, [4, 4]);
    glowDot(X, Y, 8, GOLD, a);
  });
  // 残差条（底部）
  const B0 = 880, sc = 7;
  if ((lin > 0 || ex > 0) && lg < 1) {
    ctx.save(); ctx.globalAlpha *= (1 - lg);
    seg(gx(GD, -0.2), B0, gx(GD, 10.5), B0, CR, 0.4, 1.5);
    glowText('残差', gx(GD, -0.2) - 12, B0 + 10, 24, CR, t, P('C17', 0.55), { align: 'right', bold: false });
    const rl = MD.pts.map(([x, y]) => y - MD.fl(x)), re = MD.pts.map(([x, y]) => y - MD.fe(x));
    MD.pts.forEach(([x], i) => {
      const X = gx(GD, x);
      if (lin > 0) { const h = rl[i] * sc * lin; ctx.save(); ctx.fillStyle = hexA(RED, 0.75 * lin); ctx.fillRect(X - 10, Math.min(B0, B0 - h), 20, Math.abs(h)); ctx.restore(); }
      if (ex > 0) { const h = re[i] * sc * ex; ctx.save(); ctx.fillStyle = hexA(GRN, 0.8 * ex); ctx.fillRect(X - 10, Math.min(B0, B0 - h), 20, Math.abs(h)); ctx.restore(); }
    });
    if (lin > 0.5) plotMap(x => { const i = Math.round(x); return rl[clamp(i, 0, 10)]; }, 0, 10, 10, (x, r) => [gx(GD, x), B0 - r * sc], INV, { dash: [7, 6], w: 2.5, a: ap(t, 'C18', 0.45) * lin });
    ctx.restore();
  }
  // 文字
  if (t > S('C17') && t < S('C18')) glowText('残差 = 数据点到曲线的竖直距离', 1050, 340, 30, CR, t, P('C17', 0.5), { bold: false });
  if (t > S('C18') && t < S('C19')) { glowText('两头正、中间负：排成一条弧', 1050, 290, 32, RED, t, P('C18', 0.3)); glowText('→ 模型漏掉了弯曲', 1050, 340, 28, RED, t, P('C18', 0.6), { bold: false }); }
  if (t > S('C19') && t < S('G04')) { glowText('随机、没有规律：模型合适', 1050, 290, 32, GRN, t, P('C19', 0.4)); checkMark(1320, 340, 40, GRN, t, P('C19', 0.55)); }
  if (t > S('G04')) { glowText('对 y 取对数：ln y 和 x 接近一条直线', 1050, 290, 32, GRN, t, P('G04', 0.1)); glowText('→ 适合用指数模型', 1050, 340, 28, GRN, t, P('G04', 0.6), { bold: false }); }
};

// ======================= window（A34 下：窗口陷阱） =======================
const WB = { L: 700, R: 1400, T: 380, B: 840 };
SC.window = t => {
  starfield(t); blueprint(ap(t, 'C20', 0, 0.5), 86);
  const u = eIO(prog(t, P('C21', 0.06), 2.2)), Xw = lerp(15, 30, u), Yw = Math.exp(lerp(Math.log(8e5), Math.log(1.15e9), u));
  const map = (x, y) => [WB.L + x / Xw * (WB.R - WB.L), WB.B - Math.min(y / Yw, 1.06) * (WB.B - WB.T)], clip = [WB.L, WB.T - 26, WB.R - WB.L, WB.B - WB.T + 26];
  const ax = ap(t, 'C20', 0.02, 0.4);
  // 窗口框
  const flash = u > 0 && u < 1 ? 0.5 + 0.5 * Math.sin(t * 14) : 0;
  ctx.save(); ctx.globalAlpha *= ax; ctx.strokeStyle = flash ? hexA(RED, 0.5 + 0.4 * flash) : 'rgba(237,230,216,0.35)'; ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.strokeRect(WB.L, WB.T - 26, WB.R - WB.L, WB.B - WB.T + 26); ctx.restore();
  ctx.save(); ctx.globalAlpha *= ax;
  const st = Xw < 20 ? 5 : 10;
  for (let v = st; v <= Xw + 0.01; v += st) { const X = map(v, 0)[0]; seg(X, WB.B - 6, X, WB.B + 6, CR, 0.6, 2); mathText(String(v), X, WB.B + 34, 24, CR, { align: 'center', alpha: 0.75 }); }
  mathText('0', WB.L, WB.B + 34, 24, CR, { align: 'center', alpha: 0.75 });
  mathText('y 最高 ≈ ' + sci(Yw), WB.L + 10, WB.T - 40, 26, GOLD, { glow: 6 });
  ctx.restore();
  richReveal([['窗口 [0, ', CYAN], [String(Math.round(Xw)), CYAN], [']', CYAN]], 1050, 300, 40, t, P('C20', 0.05));
  const p = prog(t, P('C20', 0.15), 1.2);
  const h1 = plotMap(x => Math.pow(x, 5), 0, 30, 500, map, RED, { p: p * Xw / 30, clip });
  const h2 = plotMap(x => Math.pow(2, x), 0, 30, 500, map, GRN, { p: p * Xw / 30, clip });
  if (h1) mathText('x^5', Math.min(h1[0], WB.R - 60) + 12, Math.max(h1[1], WB.T) + 4, 32, RED, { glow: 10 });
  if (h2) mathText('2^x', Math.min(h2[0], WB.R - 60) + 12, Math.max(h2[1], WB.T + 40) + 30, 32, GRN, { glow: 10 });
  if (t > P('C20', 0.5) && t < S('C21')) glowText('五次方遥遥领先？', 1050, 360, 32, RED, t, P('C20', 0.5));
  if (u >= 1) {
    const q = map(22.44, Math.pow(22.44, 5));
    glowDot(q[0], q[1], 10, GOLD); mathText('x ≈ 22.4', q[0], q[1] - 22, 28, GOLD, { align: 'center', glow: 8 });
    glowText('指数反超，一飞冲天', 1050, 360, 32, GRN, t, P('C21', 0.06) + 2.2);
    burst(t, P('C21', 0.06) + 2.2, q[0], q[1], GOLD, 110, 14);
  }
  if (t > S('C22')) glowText('图只看一个窗口 → 谁最终更大，要看增长阶', 1050, 905, 32, GOLD, t, P('C22', 0.1));
};

// ======================= quiz =======================
const QC = [[840, 'x^{10}', RED], [1260, '1.1^x', GRN]];
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C23', 0, 0.5), 78);
  if (t < S('C24')) { kinetic('随堂一题 · 3 秒', 1000, 520, 60, t, S('C23') + 0.05, { col: GOLD }); return; }
  const up = ap(t, 'C25', 0.25, 0.5), cy = lerp(560, 400, up);
  glowText('x 足够大时，谁大？', 1050, 268, 44, CR, t, P('C24', 0.04));
  circleNum(1, 1050 - 230, 252, 30, GOLD, t, P('C24', 0.02));
  QC.forEach(([x, s, col], i) => {
    const a = ap(t, 'C24', 0.15 + i * 0.12, 0.4); if (a <= 0) return;
    card(x - 140, cy - 70, 280, 120, col, a, 18);
    mathText(s, x, cy + 12, 56, col, { align: 'center', glow: 14, alpha: a });
  });
  if (t > S('D04') && t < S('C25')) { ring(QC[0][0], cy - 10, 165, GOLD, 0.8, ap(t, 'D04', 0.1, 0.5)); }
  if (t > S('C25')) { crossMark(QC[0][0] + 150, cy - 60, 36, RED, t, S('C25') + 0.1); checkMark(QC[1][0] + 150, cy - 60, 44, GRN, t, S('C25') + 0.2); }
  // C25：对数纵轴上两条线
  if (up > 0) {
    const L = 700, R = 1400, B = 900, T = 520, mx = x => L + x / 1000 * (R - L), my = v => B - v / 32 * (B - T);
    ctx.save(); ctx.globalAlpha *= up;
    seg(L, B, R + 10, B, CR, 0.6, 2); seg(L, B + 6, L, T - 10, CR, 0.6, 2);
    [200, 400, 600, 800, 1000].forEach(v => { seg(mx(v), B - 6, mx(v), B + 6, CR, 0.6, 2); mathText(String(v), mx(v), B + 30, 22, CR, { align: 'center', alpha: 0.75 }); });
    [[10, '10¹⁰'], [20, '10²⁰'], [30, '10³⁰']].forEach(([v, l]) => mathText(l, L - 10, my(v) + 8, 22, CYAN, { align: 'right', alpha: 0.85 }));
    glowText('对数纵轴', L + 10, T - 10, 22, CYAN, t, P('C25', 0.3), { align: 'left', bold: false });
    const pp = prog(t, P('C25', 0.35), 1.2), clip = [L, T - 20, R - L + 20, B - T + 24];
    plotMap(x => 10 * Math.log10(x), 1, 1000, 300, (x, v) => [mx(x), my(Math.max(v, 0))], RED, { p: pp, clip });
    plotMap(x => x * Math.log10(1.1), 0, 1000, 100, (x, v) => [mx(x), my(Math.max(v, 0))], GRN, { p: pp, clip });
    ctx.restore();
    if (pp >= 1) {
      const X = mx(685.08), Y = my(28.357);
      glowDot(X, Y, 10, GOLD); seg(X, Y, X, B, GOLD, 0.6, 2, [5, 6]);
      mathText('x ≈ 685', X, B - 14, 26, GOLD, { align: 'right', glow: 6 });
      if (t > S('C26')) {
        mathText('≈ 2.3 × 10²⁸', X - 16, Y - 18, 30, GOLD, { align: 'right', glow: 8, alpha: ap(t, 'C26', 0.05) });
        const wa = ap(t, 'C26', 0.35, 0.4);
        ctx.save(); ctx.globalAlpha *= wa; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.setLineDash([7, 6]); ctx.strokeRect(L, my(20) , mx(100) - L, B - my(20)); ctx.restore();
        glowText('[0, 100] 的小窗口', mx(100) + 12, my(16), 24, RED, t, P('C26', 0.4), { align: 'left', bold: false });
      }
    }
  }
  QUIZ_BEATS.forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1540, 620, 92); });
};

function drawCredits(t) {
  const t0 = E('C28') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 1 章', 235, 34, GOLD, 0.08);
  T('下一段：第一章收束', 330, 52, CR, 0.28);
  T('素材与授权说明', 485, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 545, 20, CR, 0.72, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 590, 20, CR, 0.94, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 635, 20, CR, 1.16, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 680, 20, CR, 1.38, B);
  T('拟合用的是按指数规律生成的示例数据，不是真实数据集。', 725, 20, CR, 1.60, B);
  T('Claude、GPT、DeepSeek 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 770, 20, CR, 1.82, B);
}

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'C27', 0, 0.5), 82);
  const items = [['e', '(0, 1) 处斜率 = 1', GOLD, false], ['ln x ≪ x^p ≪ a^x', '增长阶', GRN, false], ['[0, X]', '换个窗口再看', CYAN, true]];
  items.forEach(([m, s, col, up], i) => {
    const x = 760 + i * 290, y = 500, a = ap(t, 'C27', 0.08 + i * 0.2, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.08); ctx.beginPath(); ctx.arc(x, y, 120, 0, 7); ctx.fill(); ctx.restore();
    ring(x, y, 120, col, 0.8 * a, a);
    const sz = mathW(m, 48) > 225 ? Math.max(30, Math.floor(48 * 225 / mathW(m, 48))) : 48;
    mathText(m, x, y + sz * 0.32, sz, col, { align: 'center', glow: 12, alpha: a, upright: up });
    glowText(s, x, y + 172, 34, CR, t, P('C27', 0.12 + i * 0.2));
    sparks(t, P('C27', 0.08 + i * 0.2) + 0.3, x, y, { col: [col, '#ffffff'], n: 12, speed: 260 });
  });
  glowText('下一段：第一章收束', 1050, 870, 34, CYAN, t, P('C28', 0.2));
  drawCredits(t);
};

SC.__overlay = t => { if (t < E('C28') + 0.25) lecturer(t, 'C', 255, -5, E('C28') + 0.48, { h: 710 }); };
SC.__noTag = E('C28') + 0.30;
function drawFrame(t) { composeFrame(t, SC, TITLES); }

(function registerP6Sfx() {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  // hook
  typeSfx(P('D01', 0.05), 8, 0.5, 0.12); s('D01', 0.32, 'pluck', 0.26); [0.72, 0.76, 0.8, 0.84].forEach(f => s('D01', f, 'pop', 0.18));
  [0, 1, 2, 3].forEach(i => s('C01', 0.04 + i * 0.1, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.26)); s('C01', 0.55, 'shimmer', 0.24);
  [0.15, 0.35, 0.55].forEach(f => s('C02', f, 'pop', 0.26));
  // rules
  s('G01', 0.02, 'swoosh_in', 0.26); [0.12, 0.37, 0.62].forEach(f => s('G01', f, 'type', 0.16));
  s('G02', 0.08, 'swoosh_soft', 0.22); s('G02', 0.6, 'ding', 0.3);
  // e
  s('C03', 0.05, 'swoosh_soft', 0.22); s('C03', 0.35, 'tick', 0.22); s('C03', 0.55, 'pop', 0.24);
  s('C04', 0.12, 'buzz', 0.16); s('C04', 0.45, 'riser', 0.14); sfx(P('C04', 0.45) + 1.0, 'buzz', 0.16);
  for (let k = 0; k < 4; k++) sfx(P('C05', 0.05) + k * 0.4, 'tick2', 0.18); sfx(P('C05', 0.05) + 2.0, 'ding_hi', 0.36); sfx(P('C05', 0.05) + 2.05, 'sparkle', 0.26);
  s('C06', 0.05, 'pop', 0.26); s('C06', 0.45, 'pop', 0.26);
  s('D02', 0.05, 'glitch', 0.14); s('C07', 0.08, 'whoosh', 0.2); s('C07', 0.35, 'bell_soft', 0.3);
  // compound
  s('C08', 0.05, 'type', 0.16); s('C08', 0.55, 'pluck', 0.24);
  [0.05, 0.15, 0.3, 0.62].forEach((f, i) => s('C09', f, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.26));
  s('C10', 0.08, 'shimmer', 0.24); s('C10', 0.2, 'tick2', 0.2); s('C10', 0.32, 'tick2', 0.2); s('C10', 0.44, 'tick2', 0.2);
  s('D03', 0.05, 'soft_hit', 0.22);
  // race
  s('C11', 0.15, 'riser', 0.16); s('C12', 0.05, 'ding_lo', 0.26); s('C12', 0.3, 'ding', 0.28); s('C12', 0.55, 'whoosh', 0.22);
  s('C13', 0.12, 'warp', 0.26); s('C14', 0.08, 'type', 0.16); s('C14', 0.3, 'impact', 0.26); s('G03', 0.15, 'pop', 0.24);
  // mirror
  s('C15', 0.05, 'swoosh_soft', 0.22); s('C15', 0.35, 'warp', 0.26); sfx(P('C15', 0.35) + 1.4, 'sparkle', 0.26);
  s('C16', 0.1, 'riser', 0.16); sfx(P('C16', 0.1) + Math.max(2.6, D('C16') * 0.62), 'ding_hi', 0.32);
  // model
  for (let i = 0; i <= 10; i += 2) s('C17', 0.15 + i * 0.035, 'tick', 0.16);
  s('C18', 0.05, 'swoosh_soft', 0.22); s('C18', 0.45, 'buzz', 0.2);
  s('C19', 0.05, 'swoosh_soft', 0.22); s('C19', 0.55, 'check', 0.32); s('G04', 0.15, 'warp', 0.24);
  // window
  s('C20', 0.15, 'swoosh_soft', 0.22); s('C21', 0.06, 'riser', 0.18); sfx(P('C21', 0.06) + 2.2, 'impact', 0.3); s('C22', 0.1, 'bell_soft', 0.28);
  // quiz
  s('C23', 0.05, 'pop', 0.3); s('C24', 0.15, 'pop', 0.24); s('C24', 0.27, 'pop', 0.24);
  QUIZ_BEATS.forEach(b => countdownSfx(b.vo));
  s('D04', 0.1, 'pluck', 0.22); sfx(S('C25') + 0.1, 'buzz', 0.2); sfx(S('C25') + 0.2, 'check', 0.4); s('C26', 0.35, 'tick', 0.22);
  // outro
  [0.08, 0.28, 0.48].forEach((f, i) => s('C27', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.3));
  s('C28', 0.3, 'swell', 0.32);
})();
finalize();
