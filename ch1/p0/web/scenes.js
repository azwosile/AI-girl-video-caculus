// P0《画不出来的函数》（10-27 按新标准重做）：所有数学画面为原创 Canvas 绘制；改用共享内核（core.js + kit.js），画风对齐 P1–P7。
// 版面约定：讲师占 x<540；主内容区 x 600–1460（GPT / 大肥鱼在右侧时不越界）；字幕区 y≥964 不放内容。
// 配色（制作规范“颜色语义”）：函数 / 函数图像 = 红，x = 青，y / 函数值 = 金，辅助（本轮、无理点）= 紫，正确 = 绿。
// 狄利克雷函数的两类点都是函数值：有理点（值 1）金、无理点（值 0）紫，避开表示 x 的青。
const SC = {};
const TITLES = [['open', '画一个函数'], ['zoom', '无限放大'], ['history', '函数概念简史'], ['code', '电脑写不出来'], ['outro', '函数是映射']];
const TAU = Math.PI * 2, PI = Math.PI, CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv;
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
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

const zhW = (s, sz, bold = true, font = F_FANCY) => { ctx.save(); ctx.font = `${bold ? 'bold ' : ''}${sz}px ${font}`; const w = ctx.measureText(s).width; ctx.restore(); return w; };
// 一行多色中文（按段落依次揭示）：parts = [[文字, 颜色], ...]
function zhRow(parts, cx, y, sz, t, t0, o = {}) {
  const ws = parts.map(([s]) => zhW(s, sz, o.bold !== false)), tot = ws.reduce((a, b) => a + b, 0); let x = cx - tot / 2;
  parts.forEach(([s, col], i) => { glowText(s, x, y, sz, col, t, t0 + i * (o.st ?? 0.12), { align: 'left', bold: o.bold, out: o.out }); x += ws[i]; });
}

// ======================= open：画一个函数 =======================
const G0 = { cx: 1030, cy: 830, ux: 92, uy: 62, x0: -4, x1: 4, y0: -0.4, y1: 8.4 };
const NL = { L: 660, R: 1420, Y1: 540, Y0: 770, x0: 0.6, x1: 3.4 };   // D02 的数轴（y = 1 与 y = 0 两层）
const nlx = x => lerp(NL.L, NL.R, (x - NL.x0) / (NL.x1 - NL.x0));
function defBlock(t, a) {   // D(x) 分段定义（发光字，无卡片）
  if (a <= 0) return; const t0 = P('C02', 0.04);
  ctx.save(); ctx.globalAlpha *= a;
  glowMath('D(x) =', 640, 572, 64, RED, t, t0);
  const bp = eOut(prog(t, t0 + 0.25, 0.35));
  if (bp > 0) glowPath(() => { const x = 872, y0 = 470, y1 = 640, m = (y0 + y1) / 2; ctx.moveTo(x + 18, y0); ctx.quadraticCurveTo(x, y0, x, y0 + 30); ctx.lineTo(x, m - 14); ctx.quadraticCurveTo(x, m, x - 16, m); ctx.quadraticCurveTo(x, m, x, m + 14); ctx.lineTo(x, y1 - 30); ctx.quadraticCurveTo(x, y1, x + 18, y1); }, CR, 3.5, bp);
  glowMath('1', 915, 520, 60, GOLD, t, P('C02', 0.12), { upright: true }); glowText('，x 是有理数', 955, 500, 40, CR, t, P('C02', 0.18), { align: 'left' });
  glowMath('0', 915, 640, 60, INV, t, P('C02', 0.55), { upright: true }); glowText('，x 是无理数', 955, 620, 40, CR, t, P('C02', 0.6), { align: 'left' });
  ctx.restore();
}
SC.open = t => {
  starfield(t); blueprint(ap(t, 'D01', 0, 0.6), 70);
  // D01：大肥鱼的 y = x²
  const pa = ap(t, 'D01', 0.02, 0.4) * fadeOut(t, S('C01') + 0.1, 0.45);
  if (pa > 0) {
    ctx.save(); ctx.globalAlpha *= pa;
    gAxes(G0, 1, { grid: false });
    gPlot(G0, x => x * x, RED, { p: prog(t, P('D01', 0.08), 1.1) });
    glowMath('y = x^2', 1040, 330, 60, RED, t, P('D01', 0.3), { align: 'center' });
    glowText('早学过了～', 1300, 420, 30, GOLD, t, P('D01', 0.6), { bold: false });
    ctx.restore();
  }
  if (t > S('C01') && t < S('C02') + 0.3) {
    glowText('画一个函数？', 1040, 520, 60, CR, t, P('C01', 0.15), { out: S('C02') - 0.05 });
    flash(t, S('C01'), 0.12, 0.3);
  }
  // C02：定义；D02 时缩到上方当板书
  if (t > S('C02')) {
    const m = eIO(prog(t, S('D02') - 0.1, 0.5)), sc = lerp(1, 0.5, m);
    ctx.save(); ctx.translate(lerp(0, 60, m), lerp(0, -265, m)); ctx.translate(640, 470); ctx.scale(sc, sc); ctx.translate(-640, -470);
    defBlock(t, 1); ctx.restore();
    glowText('狄利克雷函数 · Dirichlet function', 1040, 390, 34, CYAN, t, P('C02', 0.85), { bold: false, out: S('D02') - 0.1 });
  }
  // D02：在 y = 1 和 y = 0 两条线上点点
  if (t > S('D02')) {
    const a = ap(t, 'D02', 0.05, 0.4);
    ctx.save(); ctx.globalAlpha *= a;
    seg(NL.L - 20, NL.Y0, NL.R + 30, NL.Y0, CR, 0.7, 2);
    ctx.save(); ctx.setLineDash([12, 10]); glowPath(() => { ctx.moveTo(NL.L - 20, NL.Y1); ctx.lineTo(NL.R + 20, NL.Y1); }, GOLD, 2.2, 0.55); ctx.restore();
    mathText('y = 1', NL.R + 30, NL.Y1 + 9, 26, GOLD, { glow: 6 }); mathText('y = 0', NL.R + 30, NL.Y0 - 14, 26, INV, { glow: 6 });
    [1, 2, 3].forEach(v => { seg(nlx(v), NL.Y0 - 7, nlx(v), NL.Y0 + 7, CR, 0.7, 2); mathText(String(v), nlx(v), NL.Y0 + 42, 26, CR, { align: 'center', alpha: 0.75 }); });
    ctx.restore();
    const DOTS = [[1.5, 1, '3/2'], [2, 1, '2'], [Math.SQRT2, 0, '√2'], [2.5, 1, '5/2'], [Math.PI - 0.6, 0, 'π − 0.6']];
    DOTS.forEach(([x, v, l], i) => {
      const t0 = P('D02', 0.3 + i * 0.12), g = eBack(prog(t, t0, 0.3)); if (g <= 0) return;
      const X = nlx(x), Y = v ? NL.Y1 : NL.Y0, col = v ? GOLD : INV;
      glowDot(X, Y, 9 * g, col); mathText(l, X, Y + (v ? -24 : -22), 24, col, { align: 'center', glow: 6, alpha: clamp(g), upright: true });
      sparks(t, t0, X, Y, { col: [col, '#ffffff'], n: 8, speed: 200 });
    });
    glowText('点几个点不就好了？', 1040, 880, 30, CR, t, P('D02', 0.55), { bold: false });
  }
};

// ======================= zoom（A01 无限放大） =======================
const ZB = { L: 640, R: 1440, Y1: 470, Y0: 730, c: Math.PI };
const zoomK = t => 6 * eIO(prog(t, P('C03', 0.5), Math.max(1, E('C04') + 0.55 - P('C03', 0.5))));
const fmtInt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const SUPD = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function dust(t, k, a, o = {}) {   // 两层稠密点：随倍率外扩，每过一个数量级补一层新点
  if (a <= 0) return; const d = Math.floor(k + 1e-9), f = k - d, s = Math.pow(10, f), cx = (ZB.L + ZB.R) / 2, hw = (ZB.R - ZB.L) / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(ZB.L - 10, 0, ZB.R - ZB.L + 20, H); ctx.clip();
  [[d, s, Math.sqrt(1 - f)], [d + 1, s / 10, Math.sqrt(f)]].forEach(([seed, sc, al]) => {
    if (al <= 0.01) return;
    for (let i = 0; i < 64; i++) { const u = rnd(seed * 977 + i * 3 + 1) * 2 - 1, x = cx + u * sc * hw; if (x < ZB.L - 8 || x > ZB.R + 8) continue; glowDot(x, ZB.Y1 + (rnd(seed * 31 + i) - 0.5) * 3, 4.2, GOLD, a * al * 0.95); }
    for (let i = 0; i < 120; i++) { const u = rnd(seed * 613 + i * 7 + 5) * 2 - 1, x = cx + u * sc * hw; if (x < ZB.L - 8 || x > ZB.R + 8) continue; glowDot(x, ZB.Y0 + (rnd(seed * 17 + i) - 0.5) * 6, 2.4, INV, a * al * 0.85); }
  });
  ctx.restore();
}
function zoomAxis(t, k, a) {
  if (a <= 0) return; const cx = (ZB.L + ZB.R) / 2, hw = 2 / Math.pow(10, k), dig = Math.max(2, Math.ceil(k) + 2);
  ctx.save(); ctx.globalAlpha *= a;
  seg(ZB.L - 20, ZB.Y0 + 60, ZB.R + 20, ZB.Y0 + 60, CR, 0.6, 2);
  [-0.5, 0, 0.5].forEach(u => { const X = cx + u * (ZB.R - ZB.L) / 2 * 1.0, v = ZB.c + u * hw; seg(X, ZB.Y0 + 53, X, ZB.Y0 + 67, CR, 0.7, 2); mathText(v.toFixed(dig), X, ZB.Y0 + 100, 24, CR, { align: 'center', alpha: 0.8, upright: true }); });
  glowText('有理点 → 1', ZB.L, ZB.Y1 - 46, 28, GOLD, t, S('C03'), { align: 'left', bold: false });
  glowText('无理点 → 0', ZB.L, ZB.Y0 - 46, 28, INV, t, S('C03') + 0.1, { align: 'left', bold: false });
  ctx.restore();
}
// C06 视图：1 到 1.0001
const V6 = { a: 0.99998, b: 1.00012 }, v6x = x => lerp(ZB.L, ZB.R, (x - V6.a) / (V6.b - V6.a));
SC.zoom = t => {
  starfield(t); blueprint(0.7, 70);
  const pull = eIO(prog(t, S('D03'), 0.8)), sh = (t > E('C07') - 0.45) ? shake(t, E('C07') - 0.3, 9, 0.4) : [0, 0];
  ctx.save(); ctx.translate(sh[0], sh[1]); ctx.translate(1040, 600); ctx.scale(1 - 0.12 * pull, 1 - 0.12 * pull); ctx.translate(-1040, -600);
  const k = t < S('C06') ? zoomK(t) : 6, v1 = fadeOut(t, S('C06'), 0.4), v2 = eOut(prog(t, S('C06'), 0.4));
  dust(t, t < S('C06') ? k : 6 + 0.35 * prog(t, S('C06'), 8), t < S('C06') ? 1 : 0.35);
  zoomAxis(t, k, v1);
  if (t < S('C06') + 0.4) {
    const mag = Math.pow(10, k), ra = ap(t, 'C03', 0.45, 0.3) * v1;
    if (ra > 0) { glowText('放大倍率', 1360, 300, 24, CR, t, P('C03', 0.45), { bold: false, alpha: ra }); mathText('×' + fmtInt(mag), 1440, 352, 40, GOLD, { align: 'right', glow: 12, alpha: ra, upright: true }); }
    if (t > S('C04') && t < S('C05')) glowText(k < 1.5 ? '放大 10 倍：两条线上都是点' : '放大 100 万倍：还是挤得满满的', 1000, 300, 32, CR, t, k < 1.5 ? P('C04', 0.05) : P('C04', 0.5), { bold: false });
  }
  // C05：任意小区间 (a, b) 里两色都在；试着连线 → 断成碎片
  if (t > S('C05') && t < S('C06') + 0.3) {
    const a = ap(t, 'C05', 0.02, 0.3) * v1, w = lerp(330, 110, eIO(prog(t, P('C05', 0.05), D('C05') * 0.55))), cx = 1040;
    mathText('(', cx - w - 30, ZB.Y0 + 75, 380, CR, { glow: 10, alpha: a, upright: true }); mathText(')', cx + w - 40, ZB.Y0 + 75, 380, CR, { glow: 10, alpha: a, upright: true });
    mathText('a', cx - w, ZB.Y0 + 150, 28, CYAN, { align: 'center', glow: 6, alpha: a }); mathText('b', cx + w, ZB.Y0 + 150, 28, CYAN, { align: 'center', glow: 6, alpha: a });
    const lp = prog(t, P('C05', 0.62), 0.6), br = P('C05', 0.62) + 0.65;
    if (lp > 0 && t < br) seg(cx - w, ZB.Y1, lerp(cx - w, cx + w, eOut(lp)), ZB.Y1, RED, a, 4);
    if (t >= br) { for (let i = 0; i < 9; i++) { const q = prog(t, br, 0.7), x0 = lerp(cx - w, cx + w, i / 9), dx = (rnd(i + 3) - 0.5) * 80 * q, dy = (rnd(i + 9) - 0.2) * 120 * q * q; seg(x0 + dx, ZB.Y1 + dy, x0 + dx + 2 * w / 9 * (1 - q * 0.5), ZB.Y1 + dy + (rnd(i) - 0.5) * 30 * q, RED, a * (1 - q), 4); } sparks(t, br, cx, ZB.Y1, { col: [RED, '#ffffff'], n: 18, speed: 320 }); }
    glowText('连不成一条线', 1040, 300, 36, RED, t, br, { out: S('C06') - 0.1 });
  }
  // C06：1 与 1.0001 之间
  if (t > S('C06')) {
    ctx.save(); ctx.globalAlpha *= v2;
    seg(ZB.L - 20, ZB.Y0 + 60, ZB.R + 20, ZB.Y0 + 60, CR, 0.6, 2);
    [[1, '1'], [1.0001, '1.0001']].forEach(([v, l]) => { const X = v6x(v); seg(X, ZB.Y0 + 50, X, ZB.Y0 + 70, CR, 0.9, 2.5); mathText(l, X, ZB.Y0 + 104, 28, CR, { align: 'center', upright: true }); });
    ctx.restore();
    const X1 = v6x(1.00005), X2 = v6x(1.0000141), g1 = eBack(prog(t, P('C06', 0.35), 0.35)), g2 = eBack(prog(t, P('C06', 0.72), 0.35));
    if (g1 > 0) { seg(X1, ZB.Y1, X1, ZB.Y0 + 60, GOLD, 0.35 * clamp(g1), 1.5, [5, 6]); glowDot(X1, ZB.Y1, 11 * g1, GOLD); glowMath('1.00005 = 20001 / 20000', X1, ZB.Y1 - 60, 34, GOLD, t, P('C06', 0.4), { align: 'center', upright: true }); glowText('分数 · 有理数', X1, ZB.Y1 - 120, 26, GOLD, t, P('C06', 0.45), { bold: false }); }
    if (g2 > 0) { seg(X2, ZB.Y0, X2, ZB.Y0 + 60, INV, 0.5 * clamp(g2), 1.5, [5, 6]); glowDot(X2, ZB.Y0, 11 * g2, INV); glowMath('1 + √2 / 100000 ≈ 1.0000141', X2 - 20, ZB.Y0 - 48, 32, INV, t, P('C06', 0.76), { upright: true }); glowText('无理数', X2 + 60, ZB.Y0 - 100, 26, INV, t, P('C06', 0.8), { bold: false, align: 'left' }); }
  }
  // C07：探针 —— 每个 x 只点亮一个高度；句尾盖章
  if (t > S('C07')) {
    const u = eIO(prog(t, P('C07', 0.05), D('C07') * 0.6)), xs = [1.00005, 1.0000141], xv = lerp(xs[0], xs[1], u), X = v6x(xv);
    seg(X, ZB.Y1 - 70, X, ZB.Y0 + 60, CYAN, ap(t, 'C07', 0.02, 0.3), 3);
    mathText('x', X, ZB.Y1 - 82, 30, CYAN, { align: 'center', glow: 8, alpha: ap(t, 'C07', 0.02, 0.3) });
    const onR = u < 0.5; ring(X, onR ? ZB.Y1 : ZB.Y0, 22, onR ? GOLD : INV, 0.9 * ap(t, 'C07', 0.04, 0.3));
    glowText('每个 x 只有一个输出', 1040, 300, 36, CYAN, t, P('C07', 0.1), { bold: false });
    const ts = E('C07') - 0.3;
    if (t > ts) { stampMark(1392, 590, 80, t, ts, { text: '是函数', col: RED }); shock(t, ts + 0.05, 1392, 590, 160, RED); }
  }
  ctx.restore();
  if (t > S('D03')) warp(t, 0.18 * (1 - prog(t, P('D03', 0.6), 0.6)), 1040, 600, 0.8);
};

// ======================= history（A02 本轮拼方波 · A03 概念史时间轴） =======================
const TL = { x0: 660, y0: 300, x1: 1420, y1: 256 };
const tlPt = f => [lerp(TL.x0, TL.x1, f), lerp(TL.y0, TL.y1, f)];
const NODES = [[0.12, '1748', '欧拉', 'G02'], [0.5, '1807', '傅里叶', 'G03'], [0.86, '1837', '狄利克雷', 'G05']];
const GH = { cx: 1040, cy: 690, ux: 62, uy: 58, x0: -6, x1: 6, y0: -2.3, y1: 3.6 };
const FX = [x => x * x / 3, x => Math.sin(x) * 1.6, x => Math.exp(x) / 6];
const EPI = { cx: 740, cy: 640, A: 105, wx0: 900, wx1: 1340 };
function epiK(t) { const a = P('G03', 0.3), b = E('G03') + 0.9; if (t < a) return 1; return Math.min(25, 1 + Math.floor(24 * Math.pow(prog(t, a, b - a), 1.5))); }
function sqSum(th, K) { let s = 0; for (let j = 0; j < K; j++) { const n = 2 * j + 1; s += Math.sin(n * th) / n; } return s * 4 / PI; }
SC.history = t => {
  starfield(t); blueprint(0.6, 76);
  // 时间轴
  const lp = eIO(prog(t, P('G01', 0.1), 0.9));
  if (lp > 0) { glowPath(() => { ctx.moveTo(TL.x0, TL.y0); const [x, y] = tlPt(lp); ctx.lineTo(x, y); }, CR, 2.5, 0.75); if (lp >= 1) { arrowH(TL.x1 - 6, TL.x1 + 18, TL.y1, CR, 0.75, 2.5); glowText('今天', TL.x1 + 10, TL.y1 - 30, 22, CR, t, P('G01', 0.6), { bold: false }); } }
  NODES.forEach(([f, yr, nm, id]) => {
    const t0 = S(id) - 0.05, g = eBack(prog(t, t0, 0.35)); if (g <= 0) return;
    const [x, y] = tlPt(f), hot = id === 'G05' && t > S('G05');
    glowDot(x, y, 9 * g, hot ? RED : GOLD); glowText(yr, x, y - 34, 28, GOLD, t, t0, { font: F_MATH, bold: false }); glowText(nm, x, y + 32, 26, hot ? RED : CR, t, t0 + 0.08);
  });
  glowText('两百多年前的争论', 1040, 470, 40, CR, t, P('G01', 0.25), { out: S('G02') });
  // G02：函数 = 解析式（x² → sin x → eˣ 连续变形）
  const ga = ap(t, 'G02', 0.05, 0.4) * fadeOut(t, S('G03') + 0.05, 0.4);
  if (ga > 0) {
    ctx.save(); ctx.globalAlpha *= ga;
    gAxes(GH, 1, { grid: false });
    const m = clamp((t - P('G02', 0.25)) / Math.max(0.6, D('G02') * 0.35)), i = Math.min(1, Math.floor(m * 2)), w = eIO(clamp(m * 2 - i));
    const f = x => lerp(FX[i](x), FX[Math.min(2, i + 1)](x), m >= 1 ? 1 : w);
    gPlot(GH, f, RED, { p: prog(t, P('G02', 0.08), 0.5) });
    ['x^2', 'sin x', 'e^x'].forEach((s, k) => mathText(s, 820 + k * 220, 470, 40, k === Math.round(m * 2) ? RED : hexA(CR, 0.5), { align: 'center', glow: 8, alpha: ap(t, 'G02', 0.2 + k * 0.15, 0.3) }));
    glowText('函数 = 解析式', 1040, 400, 36, CR, t, P('G02', 0.15));
    ctx.restore();
  }
  // G03–G04：本轮链叠出方波
  const fa = ap(t, 'G03', 0.05, 0.4) * fadeOut(t, S('G05'), 0.4);
  if (fa > 0) {
    const K = epiK(t), frz = t > S('G04') ? S('G04') : t, th0 = frz * 2.4;
    ctx.save(); ctx.globalAlpha *= fa;
    let x = EPI.cx, y = EPI.cy;
    for (let j = 0; j < K; j++) { const n = 2 * j + 1, r = EPI.A * 4 / PI / n; ctx.save(); ctx.strokeStyle = hexA(INV, j ? 0.35 : 0.6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); const nx = x + r * Math.cos(n * th0), ny = y - r * Math.sin(n * th0); seg(x, y, nx, ny, INV, 0.8, 2); x = nx; y = ny; }
    glowDot(x, y, 5, RED); seg(x, y, EPI.wx0, y, CR, 0.35, 1.5, [4, 5]);
    // 波形：笔尖在左端，历史向右推
    const pts = []; for (let i = 0; i <= 260; i++) { const s = i / 260, th = th0 - s * 4.2 * PI; pts.push([lerp(EPI.wx0, EPI.wx1, s), EPI.cy - EPI.A * sqSum(th, K)]); }
    glowPath(() => pts.forEach(([X, Y], i) => i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)), RED, 3.5, 1);
    glowText(`已叠加 ${K} 个正弦波`, 1120, 845, 28, CR, t, P('G03', 0.3), { bold: false });
    glowMath('(4/π)(sin x + sin 3x / 3 + sin 5x / 5 + …)', 1040, 420, 32, RED, t, P('G03', 0.1), { align: 'center', out: S('G04') + 0.2 });
    ctx.restore();
    if (t > S('G04')) {   // 定格：圈出折角，抛出问题
      let cx = null; for (let i = 1; i < pts.length; i++) if (pts[i - 1][1] - pts[i][1] > EPI.A * 1.2 && pts[i][0] > 1050) { cx = pts[i]; break; }
      if (cx) { ring(cx[0], EPI.cy - EPI.A, 40, GOLD, ap(t, 'G04', 0.05, 0.3) * fa, prog(t, P('G04', 0.05), 0.4)); glowText('折角', cx[0] + 52, EPI.cy - EPI.A - 46, 28, GOLD, t, P('G04', 0.2), { align: 'left', bold: false }); }
      kinetic('“函数”到底是什么？', 1040, 410, 50, t, P('G04', 0.5), { col: CR, out: S('G05') - 0.1 });
    }
  }
  // G05：狄利克雷 —— 每个 x 对应唯一的 y
  if (t > S('G05')) {
    zhRow([['每个 ', CR], ['x', CYAN], [' 对应 ', CR], ['唯一', RED], [' 的 ', CR], ['y', GOLD]], 1040, 520, 56, t, P('G05', 0.25));
    const ua = ap(t, 'G05', 0.75, 0.3); if (ua > 0) { const w = zhW('唯一', 56); seg(1040 + 18, 560, 1040 + 18 + w * ua, 560, RED, ua, 4); }
    glowText('就是函数', 1040, 640, 40, GOLD, t, P('G05', 0.55));
    const da = ap(t, 'G05', 0.5, 0.5); for (let i = 0; i < 46; i++) { const x = 700 + i * 15.5; glowDot(x, 780, 3.5, GOLD, da * 0.8); glowDot(x + 7, 850, 2.5, INV, da * 0.8); }
  }
};

// ======================= code（A04 代码窗） =======================
const CW = { x: 620, y: 250, w: 840, h: 520 };
const CODE = [[['const', INV], [' D = x => ', CR], ['isRational', CR], ['(x) ? ', CR], ['1', GOLD], [' : ', CR], ['0', INV], [';', CR]]];
function typedSegs(t, segs, x, y, t0, dur, sz) {
  const tot = segs.reduce((s, [str]) => s + str.length, 0), n = Math.floor(clamp((t - t0) / dur) * tot); let k = 0, cx = x, pos = {};
  ctx.save(); ctx.font = `${sz}px ${F_CODE}`; ctx.textBaseline = 'middle';
  segs.forEach(([str, col], i) => { const w = ctx.measureText(str).width; pos[i] = [cx, w]; const sh = str.slice(0, Math.max(0, n - k)); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.fillText(sh, cx, y); cx += w; k += str.length; });
  if (n < tot && t > t0 && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = CR; ctx.fillRect(x + ctx.measureText(segs.map(s => s[0]).join('').slice(0, n)).width + 2, y - sz * 0.5, 3, sz); }
  ctx.restore(); return pos;
}
function scramble(t, target, t0, dur, seed) { const cs = [...target], n = cs.length, k = Math.floor(clamp((t - t0) / dur) * n); return cs.map((c, i) => i < k || !/[0-9]/.test(c) ? c : (i < k + 8 ? String(Math.floor(h32(i, Math.floor(t * 24), seed) * 2)) : ' ')).join(''); }
SC.code = t => {
  starfield(t); blueprint(0.6, 78);
  const a = eBack(prog(t, S('G06') + 0.02, 0.4)); if (a <= 0) return;
  ctx.save(); ctx.translate(CW.x + CW.w / 2, CW.y + CW.h / 2); ctx.scale(lerp(0.92, 1, clamp(a)), lerp(0.92, 1, clamp(a))); ctx.translate(-CW.x - CW.w / 2, -CW.y - CW.h / 2); ctx.globalAlpha *= clamp(a);
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(9,14,32,0.88)'; rr(CW.x, CW.y, CW.w, CW.h, 16); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = hexA(CYAN, 0.55); ctx.lineWidth = 2; rr(CW.x, CW.y, CW.w, CW.h, 16); ctx.stroke();
  ctx.fillStyle = 'rgba(237,230,216,0.06)'; rr(CW.x, CW.y, CW.w, 46, 16); ctx.fill();
  [RED, GOLD, GRN].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(CW.x + 28 + i * 24, CW.y + 23, 7, 0, 7); ctx.fill(); });
  ctx.font = `20px ${F_CODE}`; ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('dirichlet.js', CW.x + CW.w / 2, CW.y + 23); ctx.textAlign = 'left';
  ctx.font = `22px ${F_CODE}`; ctx.fillStyle = 'rgba(237,230,216,0.3)'; for (let i = 1; i <= 7; i++) ctx.fillText(String(i), CW.x + 22, CW.y + 50 + i * 54);
  ctx.restore();
  const X = CW.x + 64, LY = i => CW.y + 50 + i * 54, al = clamp(a);
  ctx.save(); ctx.globalAlpha *= al;
  typedSegs(t, [['// 狄利克雷函数', 'rgba(237,230,216,0.45)']], X, LY(1), S('G06') + 0.15, 0.4, 28);
  const pos = typedSegs(t, CODE[0], X, LY(2), S('G06') + 0.5, Math.max(1.0, D('G06') * 0.45), 30);
  const wv = prog(t, P('G06', 0.72), 0.35);
  if (wv > 0) { const [x0, w] = pos[2]; ctx.save(); ctx.beginPath(); ctx.rect(x0 - 2, LY(2) + 10, (w + 4) * wv, 20); ctx.clip(); glowPath(() => { for (let x = 0; x <= w; x += 2) { const y = LY(2) + 22 + Math.sin(x * 0.45) * 4; x ? ctx.lineTo(x0 + x, y) : ctx.moveTo(x0 + x, y); } }, RED, 2.5, 1); ctx.restore();
    crossMark(X + 18, LY(3), 22, RED, t, P('G06', 0.8)); glowText('写不出来：电脑分不出有理数和无理数', X + 46, LY(3), 26, RED, t, P('G06', 0.82), { align: 'left', bold: false }); }
  if (t > S('G07')) {
    typedSegs(t, [['> ', 'rgba(237,230,216,0.5)'], ['0.1', CR]], X, LY(4), S('G07') + 0.05, 0.25, 30);
    const bin = '0.0001100110011001100110011001100…';
    if (t > P('G07', 0.15)) { ctx.save(); ctx.font = `28px ${F_CODE}`; ctx.textBaseline = 'middle'; ctx.fillStyle = CYAN; ctx.shadowColor = CYAN; ctx.shadowBlur = 6; ctx.fillText('  ' + scramble(t, bin, P('G07', 0.15), 0.9, 7), X, LY(5)); ctx.restore(); }
    if (t > P('G07', 0.55)) {
      const s = '= 3602879701896397 / '; ctx.save(); ctx.font = `30px ${F_CODE}`; ctx.textBaseline = 'middle'; const w = ctx.measureText('  ' + s).width; ctx.globalAlpha *= ap(t, 'G07', 0.55, 0.3); ctx.fillStyle = CR; ctx.fillText('  ' + scramble(t, s, P('G07', 0.55), 0.5, 3), X, LY(6)); ctx.restore();
      mathText('2^{55}', X + w + 4, LY(6) + 11, 34, GOLD, { glow: 12, alpha: ap(t, 'G07', 0.7, 0.3), upright: true });
    }
  }
  ctx.restore();
  glowText('浮点数都是有理数：0.1 存进电脑也是分数', 1040, 840, 32, GOLD, t, P('G07', 0.75));
};

// ======================= outro：函数是映射 =======================
const MX = { x: 820, y: 640, rx: 135, ry: 190 }, MY = { x: 1270, y: 640, rx: 135, ry: 190 };
const SRC = Array.from({ length: 26 }, (_, i) => { const a = rnd(i + 11) * TAU, r = Math.sqrt(rnd(i + 31)) * 0.75; return [MX.x + Math.cos(a) * MX.rx * r, MX.y + Math.sin(a) * MX.ry * r]; });
const DST = Array.from({ length: 10 }, (_, i) => { const a = rnd(i + 51) * TAU, r = Math.sqrt(rnd(i + 71)) * 0.7; return [MY.x + Math.cos(a) * MY.rx * r, MY.y + Math.sin(a) * MY.ry * r]; });
const MAP = SRC.map((_, i) => Math.floor(rnd(i + 91) * DST.length)), HL = 7;
const OBJ = [['曲线', 760], ['公式', 950], ['方波', 1140], ['代码', 1330]];
function objIcon(i, x, y, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  if (i === 0) glowPath(() => { for (let k = 0; k <= 20; k++) { const u = k / 20 * 2 - 1; k ? ctx.lineTo(x + u * 46, y + 30 - u * u * 56) : ctx.moveTo(x + u * 46, y + 30 - u * u * 56); } }, RED, 3.5, 1);
  if (i === 1) mathText('f(x)', x, y + 14, 40, RED, { align: 'center', glow: 10 });
  if (i === 2) glowPath(() => { ctx.moveTo(x - 48, y + 22); ctx.lineTo(x - 24, y + 22); ctx.lineTo(x - 24, y - 22); ctx.lineTo(x + 24, y - 22); ctx.lineTo(x + 24, y + 22); ctx.lineTo(x + 48, y + 22); }, RED, 3.5, 1);
  if (i === 3) { ctx.font = `bold 36px ${F_CODE}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = INV; ctx.shadowColor = INV; ctx.shadowBlur = 10; ctx.fillText('</>', x, y); }
  ctx.restore();
}
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5), 80);
  const endA = fadeOut(t, S('C10') + 0.1, 0.5);
  // C08：曲线 / 公式 / 方波 / 代码碎成粒子
  const brk = P('C08', 0.3);
  OBJ.forEach(([nm, x], i) => { const t0 = S('C08') + 0.05 + i * 0.08, a = eOut(prog(t, t0, 0.3)) * fadeOut(t, brk + i * 0.05, 0.2); objIcon(i, x, 330, a); if (a > 0) glowText(nm, x, 395, 22, CR, t, t0, { bold: false }); sparks(t, brk + i * 0.05, x, 330, { col: [RED, CYAN, '#ffffff'], n: 16, speed: 300 }); });
  ctx.save(); ctx.globalAlpha *= endA;
  const ba = ap(t, 'C08', 0.38, 0.4);
  setBlob(MX.x, MX.y, MX.rx * clamp(ba * 1.02), MX.ry, CYAN, ba, 'X'); setBlob(MY.x, MY.y, MY.rx * clamp(ba * 1.02), MY.ry, GOLD, ba, 'Y');
  if (ba > 0) mathText('f', (MX.x + MY.x) / 2, MX.y - MX.ry - 30, 48, RED, { align: 'center', glow: 12, alpha: ba });
  SRC.forEach((s, i) => {
    const d = DST[MAP[i]], t0 = P('C08', 0.45) + i * 0.035, p = eIO(prog(t, t0, 0.9));
    const C = [(s[0] + d[0]) / 2, Math.min(s[1], d[1]) - 90 - Math.abs(s[1] - d[1]) * 0.2], hi = i === HL && t > P('C09', 0.5);
    glowDot(s[0], s[1], 4, CYAN, ba * 0.9);
    if (p > 0) { if (p >= 1) { ctx.save(); ctx.globalAlpha *= hi ? 0.9 : 0.18; ctx.strokeStyle = hi ? GOLD : RED; ctx.lineWidth = hi ? 3 : 1.4; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.quadraticCurveTo(C[0], C[1], d[0], d[1]); ctx.stroke(); ctx.restore(); }
      const [x, y] = bez(s, C, d, p); glowDot(x, y, hi ? 7 : 4.5, p >= 1 ? GOLD : '#ffffff', 1); }
  });
  DST.forEach(d => glowDot(d[0], d[1], 5, GOLD, ba * 0.7));
  if (t > S('C09')) {
    setBlob(MX.x, MX.y, MX.rx + 8, MX.ry + 8, CYAN, 0.6 * ap(t, 'C09', 0.05, 0.3) * (0.6 + 0.4 * Math.sin(t * 6)), null, { w: 2 });
    glowText('从哪来：定义域', MX.x, 880, 30, CYAN, t, P('C09', 0.1));
    glowText('去哪里：唯一的像', MY.x, 880, 30, GOLD, t, P('C09', 0.55));
  }
  glowText('映射 · mapping', 1040, 300, 40, CR, t, E('C08') - 0.5, { out: S('C10') });
  ctx.restore();
  if (t > S('C10') && t < E('C10') + 0.8) {
    ctx.save(); ctx.globalAlpha *= 1 - prog(t, E('C10') + 0.2, 0.4);
    kinetic('下一段：高中速通', 1040, 520, 64, t, P('C10', 0.2), { col: GOLD });
    glowText('先速通高中，再进入大学内容', 1040, 630, 32, CR, t, P('C10', 0.55), { bold: false });
    ctx.restore();
  }
  drawCredits(t);
};
function drawCredits(t) {
  const t0 = E('C10') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 1 章', 235, 34, GOLD, 0.08);
  T('下一段：高中速通', 330, 52, CR, 0.28);
  T('素材与授权说明', 485, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 545, 20, CR, 0.72, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 590, 20, CR, 0.94, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 635, 20, CR, 1.16, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 680, 20, CR, 1.38, B);
  T('Claude、GPT、DeepSeek 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 725, 20, CR, 1.60, B);
}

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, S('C01') - 0.35, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { composeFrame(t, SC, TITLES); }

(function registerP0Sfx() {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('D01', 0.02, 'swell', 0.26); s('D01', 0.6, 'pop', 0.24);
  s('C01', 0.0, 'whoosh', 0.22); s('C02', 0.04, 'type', 0.18); s('C02', 0.12, 'pluck', 0.24); s('C02', 0.55, 'pluck', 0.22); s('C02', 0.85, 'soft_hit', 0.22);
  [0.3, 0.42, 0.54, 0.66, 0.78].forEach(f => s('D02', f, 'tick', 0.22));
  s('C03', 0.45, 'riser', 0.2); s('C04', 0.05, 'shimmer', 0.18); s('C04', 0.5, 'shimmer', 0.2);
  sfx(P('C05', 0.62) + 0.65, 'glitch', 0.2);
  s('C06', 0.35, 'ding', 0.3); s('C06', 0.72, 'ding_lo', 0.3);
  s('C07', 0.05, 'swoosh_soft', 0.2); sfx(E('C07') - 0.3, 'stamp', 0.34);
  s('D03', 0.05, 'warp', 0.24);
  s('G01', 0.1, 'swoosh_soft', 0.22); NODES.forEach(([, , , id]) => sfx(S(id) - 0.05, 'marimba', 0.26));
  s('G02', 0.25, 'pluck', 0.2); s('G03', 0.3, 'riser', 0.14);
  s('G04', 0.05, 'soft_hit', 0.24); s('G04', 0.5, 'pop', 0.26); s('G05', 0.25, 'bell_soft', 0.28); s('G05', 0.75, 'pluck', 0.24);
  s('G06', 0.02, 'swoosh_soft', 0.22); s('G06', 0.5, 'type', 0.18); s('G06', 0.72, 'buzz', 0.22);
  s('G07', 0.05, 'type', 0.16); s('G07', 0.15, 'tick2', 0.16); s('G07', 0.7, 'ding_hi', 0.3);
  s('C08', 0.3, 'sparkle', 0.24); s('C08', 0.45, 'shimmer', 0.22); s('C09', 0.1, 'tick', 0.22); s('C09', 0.55, 'tick', 0.24);
  s('C10', 0.2, 'impact', 0.28); s('C10', 0.4, 'swell', 0.3);
})();
finalize();
