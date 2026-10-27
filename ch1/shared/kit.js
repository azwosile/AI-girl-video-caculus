// AI娘微积分课 · 场景工具包 kit.js（P2 起；在 core.js 之后、scenes.js 之前加载）
// 坐标轴 / 函数绘制 / 勾叉 / 印章 / 倒计时 / 右侧角色 / 映射图 / 小贴士面板 / 块标题
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// 分色数学式：[[str, col], ...]
function mathRich(parts, x, y, size, o = {}) {
  const tot = parts.reduce((s, [str]) => s + mathW(str, size), 0);
  let cx = o.align === 'center' ? x - tot / 2 : o.align === 'right' ? x - tot : x;
  parts.forEach(([str, col]) => { cx = mathText(str, cx, y, size, col, { glow: o.glow ?? 10, alpha: o.alpha ?? 1, upright: o.upright }); });
  return tot;
}
function kf(t, v0, steps) { let v = v0; for (const [t1, v1, d] of steps) { const e = eIO(prog(t, t1, d)); v = lerp(v, v1, e); } return v; }
// ---------- 坐标系 ----------
function axes(A, a, o = {}) {
  if (a <= 0) return;
  const { cx, cy, u } = A, X0 = cx + A.x0 * u, X1 = cx + A.x1 * u, Y0 = cy - A.y1 * u, Y1 = cy - A.y0 * u;
  ctx.save(); ctx.globalAlpha *= a;
  if (o.grid !== false) { ctx.strokeStyle = 'rgba(92,200,232,0.07)'; ctx.lineWidth = 1; for (let i = Math.ceil(A.x0); i <= A.x1; i++) { ctx.beginPath(); ctx.moveTo(cx + i * u, Y0); ctx.lineTo(cx + i * u, Y1); ctx.stroke(); } for (let j = Math.ceil(A.y0); j <= A.y1; j++) { ctx.beginPath(); ctx.moveTo(X0, cy - j * u); ctx.lineTo(X1, cy - j * u); ctx.stroke(); } }
  ctx.strokeStyle = 'rgba(237,230,216,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, cy); ctx.lineTo(X1, cy); ctx.moveTo(cx, Y1); ctx.lineTo(cx, Y0); ctx.stroke();
  ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.beginPath(); ctx.moveTo(X1 + 12, cy); ctx.lineTo(X1, cy - 6); ctx.lineTo(X1, cy + 6); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx, Y0 - 12); ctx.lineTo(cx - 6, Y0); ctx.lineTo(cx + 6, Y0); ctx.fill();
  if (o.ticks !== false) { ctx.font = `20px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(237,230,216,0.45)'; const st = o.step || 1; for (let i = Math.ceil(A.x0); i <= A.x1; i++) { if (!i || i % st) continue; ctx.fillRect(cx + i * u - 1, cy - 5, 2, 10); ctx.fillText(String(i).replace('-', '−'), cx + i * u, cy + 9); } ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; for (let j = Math.ceil(A.y0); j <= A.y1; j++) { if (!j || j % st) continue; ctx.fillRect(cx - 5, cy - j * u - 1, 10, 2); ctx.fillText(String(j).replace('-', '−'), cx - 10, cy - j * u); } }
  if (o.labels !== false) { mathText('x', X1 + 8, cy + 30, 26, 'rgba(237,230,216,0.6)'); mathText('y', cx + 14, Y0 - 2, 26, 'rgba(237,230,216,0.6)'); }
  ctx.restore();
}
function plotSegs(A, f, xa = A.x0, xb = A.x1, n = 320, jump = 3.5) {
  const segs = []; let cur = null, py = null;
  for (let i = 0; i <= n; i++) {
    const x = xa + (xb - xa) * i / n, y = f(x), ok = isFinite(y) && y > A.y0 - 1.5 && y < A.y1 + 1.5 && (py == null || Math.abs(y - py) < jump);
    if (ok) { if (!cur) { cur = []; segs.push(cur); } cur.push([A.cx + x * A.u, A.cy - clamp(y, A.y0 - 0.6, A.y1 + 0.6) * A.u]); } else cur = null;
    py = isFinite(y) ? y : null;
  }
  return segs;
}
function plot(A, f, col, w = 4, a = 1, o = {}) {
  if (a <= 0) return;
  const segs = plotSegs(A, f, o.xa ?? A.x0, o.xb ?? A.x1, o.n || 320, o.jump || 3.5);
  ctx.save(); ctx.beginPath(); ctx.rect(A.cx + A.x0 * A.u - 4, A.cy - A.y1 * A.u - 4, (A.x1 - A.x0) * A.u + 8, (A.y1 - A.y0) * A.u + 8); ctx.clip();
  if (o.dash) { ctx.setLineDash(o.dash); ctx.strokeStyle = hexA(col, 0.5 * a); ctx.lineWidth = 2.5; segs.forEach(s => { ctx.beginPath(); s.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }); ctx.setLineDash([]); }
  else segs.forEach(s => { if (s.length > 1) glowPath(() => s.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, w, a); });
  ctx.restore();
}
// 进度描线：p ∈ [0,1] 只画到 xa + (xb − xa)·p
function plotP(A, f, col, p, w = 4, a = 1, o = {}) { if (p <= 0) return; const xa = o.xa ?? A.x0, xb = o.xb ?? A.x1; plot(A, f, col, w, a, Object.assign({}, o, { xa, xb: lerp(xa, xb, clamp(p)) })); if (p < 1) { const x = lerp(xa, xb, p), y = f(x); if (isFinite(y) && y > A.y0 && y < A.y1) glowDot(A.cx + x * A.u, A.cy - y * A.u, 6, col, a); } }
const ax2px = (A, x, y) => [A.cx + x * A.u, A.cy - y * A.u];
function openDot(x, y, r, col, a = 1, fill = '#0B1022') { ctx.save(); ctx.globalAlpha *= a; ctx.lineWidth = 3.5; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
// ---------- 勾 / 叉 / 印章 ----------
function checkMark(x, y, s, col, t, t0, a = 1) {
  const p = eOut(prog(t, t0, 0.3)); if (p <= 0) return;
  const pts = [[-0.5, 0], [-0.15, 0.38], [0.6, -0.45]];
  glowPath(() => { ctx.moveTo(x + pts[0][0] * s, y + pts[0][1] * s); const k = p * 2; if (k <= 1) ctx.lineTo(x + lerp(pts[0][0], pts[1][0], k) * s, y + lerp(pts[0][1], pts[1][1], k) * s); else { ctx.lineTo(x + pts[1][0] * s, y + pts[1][1] * s); ctx.lineTo(x + lerp(pts[1][0], pts[2][0], k - 1) * s, y + lerp(pts[1][1], pts[2][1], k - 1) * s); } }, col, Math.max(3, s * 0.12), a);
}
function crossMark(x, y, s, col, t, t0, a = 1) {
  const p = eOut(prog(t, t0, 0.3)); if (p <= 0) return;
  glowPath(() => { ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x - s / 2 + s * Math.min(1, p * 2), y - s / 2 + s * Math.min(1, p * 2)); if (p > 0.5) { const q = (p - 0.5) * 2; ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + s / 2 - s * q, y - s / 2 + s * q); } }, col, Math.max(3, s * 0.12), a);
}
function stampMark(x, y, r, t, t0, o = {}) {
  const p = prog(t, t0, 0.35); if (p <= 0) return;
  const s = lerp(1.7, 1, eOut(p)), al = clamp(p * 3) * (o.alpha ?? 1), col = o.col || COL.red;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.25); ctx.scale(s, s); ctx.globalAlpha *= al;
  ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.strokeStyle = col; ctx.lineWidth = r * 0.09; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.font = `bold ${r * 0.62}px ${F_FANCY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.text || '已学', 0, 2);
  ctx.restore();
}
// 圆圈序号（不用 ①②③ 字符，避免字体缺字）
function circleNum(n, x, y, r, col, t, t0, a = 1) {
  const p = eBack(prog(t, t0, 0.3)); if (p <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(p, p); ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.fillStyle = 'rgba(12,18,38,0.85)'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a * clamp(p); mathText(String(n), x, y + r * 0.42, r * 1.2, COL.cream, { align: 'center', upright: true, glow: 8 }); ctx.restore();
}
// ---------- 3 秒倒计时（画面不停） ----------
function countdown(t, t0, cx, cy, R0 = 105) {
  const p = prog(t, t0, 3.0), a = win01(t, t0 - 0.1, t0 + 3.25, 0.2, 0.25); if (a <= 0) return;
  const R = R0 * eBack(prog(t, t0 - 0.1, 0.35));
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(237,230,216,0.15)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  glowPath(() => ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + (1 - p) * 6.283), p < 0.67 ? CYAN : COL.red, 9);
  for (let i = 0; i < 24; i++) { const an = i / 24 * 6.283 + t * 1.2; ctx.fillStyle = hexA(COL.cream, 0.15 + 0.35 * (i % 3 === 0)); ctx.fillRect(cx + Math.cos(an) * (R + 22) - 2, cy + Math.sin(an) * (R + 22) - 2, 4, 4); }
  for (let i = 0; i < 6; i++) { const an = t * 2.2 + i * 1.047; glowDot(cx + Math.cos(an) * (R - 28), cy + Math.sin(an) * (R - 28), 3, i % 2 ? GOLD : CYAN, 0.8); }
  ctx.restore();
  for (let k = 0; k < 3; k++) { const tk = t0 + k; if (t >= tk && t < tk + 1) kinetic(String(3 - k), cx, cy + 4, R0 * 1.15, t, tk, { col: k === 2 ? COL.red : COL.cream, font: F_MATH, bold: false, s0: 2.6, fy: 0, out: tk + 0.82 }); shock(t, tk, cx, cy, R + 40, k === 2 ? COL.red : CYAN, { w: 4, d: 0.5 }); }
}
function countdownSfx(t0) { for (let k = 0; k < 3; k++) sfx(t0 + k, 'count', 0.5); sfx(t0 + 3, 'count_go', 0.45); }
// ---------- 右侧角色：按台词连续段滑入滑出 ----------
let SIDE = { G: { x: 1680, h: 700, flip: true }, Q: { x: 1700, h: 640 }, D: { x: 1735, h: 500 }, M: { x: 1700, h: 640 }, K: { x: 1680, h: 640, flip: true } };
let _RUNS = null;
function sideRuns() {
  if (_RUNS) return _RUNS;
  const vs = ENTRIES.filter(e => e.k === 'v' && e.id[0] !== 'C'), out = [];
  vs.forEach(e => { const w = e.id[0], last = out.filter(r => r.w === w).pop(); if (last && e.vo - last.t1 < 2.2 && !ENTRIES.some(x => x.k === 'v' && x.id[0] !== 'C' && x.id[0] !== w && x.vo > last.t1 && x.vo < e.vo)) { last.t1 = e.t1; last.ids.push(e); } else out.push({ w, t0: e.vo, t1: e.t1, ids: [e] }); });
  return _RUNS = out;
}
function sideActive(t, pad = 0.6) { return sideRuns().some(r => t > r.t0 - 0.45 - pad && t < r.t1 + 0.6 + pad); }
function sideChars(t) {
  sideRuns().forEach(r => {
    const pi = eOut(prog(t, r.t0 - 0.45, 0.4)), po = eIn(prog(t, r.t1 + 0.25, 0.35)); if (pi <= 0 || po >= 1) return;
    const cfg = SIDE[r.w]; let cur = r.ids[0], prv = null; for (const e of r.ids) if (e.vo - 0.12 <= t) { prv = cur; cur = e; }
    const dx = (1 - pi) * 650 + po * 650, k = prv && prv.pose !== cur.pose ? eOut(prog(t, cur.vo - 0.12, 0.18)) : 1, by = H + (r.w === 'D' ? 30 : 20);
    if (k < 1) sprite(prv.pose, cfg.x + dx, by, cfg.h, { flip: cfg.flip, alpha: 1 - k });
    sprite(cur.pose, cfg.x + dx, by, cfg.h, { flip: cfg.flip, alpha: k, rim: r.w === 'D' ? 'rgba(92,200,232,0.5)' : undefined });
  });
}
// ---------- 映射图：集合椭圆 + 箭头 ----------
function setBlob(cx, cy, rx, ry, col, a, label, o = {}) {
  if (a <= 0) return;
  // Back-easing can produce a tiny negative radius at the exact start frame.
  // CanvasRenderingContext2D.ellipse rejects any negative radius, even -1e-14.
  const rxSafe = Number.isFinite(rx) ? Math.max(0, rx) : 0;
  const rySafe = Number.isFinite(ry) ? Math.max(0, ry) : 0;
  if (rxSafe <= 1e-6 || rySafe <= 1e-6) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rxSafe, rySafe)); g.addColorStop(0, hexA(col, 0.10)); g.addColorStop(1, hexA(col, 0.02)); ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(cx, cy, rxSafe, rySafe, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = o.w || 3; ctx.shadowColor = col; ctx.shadowBlur = 16; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
  ctx.restore();
  if (label) { ctx.save(); ctx.globalAlpha *= a; mathText(label, cx, cy - rySafe - 22, o.ls || 46, col, { align: 'center', glow: 10, upright: o.upright }); ctx.restore(); }
}
// 二次贝塞尔箭头：p 为生长进度；bend 为弯曲量（正数向上拱）
function arrowQ(x0, y0, x1, y1, col, p = 1, a = 1, o = {}) {
  if (p <= 0 || a <= 0) return;
  const bend = o.bend ?? 50, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const C = o.ctrl || [mx, my - bend];
  const s0 = o.r0 || 10, s1 = o.r1 || 12, N = 30, pe = clamp(p);
  const pts = []; for (let i = 0; i <= N; i++) { const s = i / N * pe; pts.push(bez([x0, y0], C, [x1, y1], s)); }
  // 裁掉起止圆点半径
  const keep = pts.filter(([x, y]) => Math.hypot(x - x0, y - y0) > s0 && Math.hypot(x - x1, y - y1) > s1 - 2);
  if (keep.length > 1) {
    glowPath(() => keep.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, o.w || 2.5, a);
    if (pe > 0.6) { const [hx, hy] = keep[keep.length - 1], [px, py] = keep[Math.max(0, keep.length - 4)], an = Math.atan2(hy - py, hx - px), hs = o.hs || 13; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(hx + Math.cos(an) * 3, hy + Math.sin(an) * 3); ctx.lineTo(hx - Math.cos(an - 0.45) * hs, hy - Math.sin(an - 0.45) * hs); ctx.lineTo(hx - Math.cos(an + 0.45) * hs, hy - Math.sin(an + 0.45) * hs); ctx.fill(); ctx.restore(); }
  }
  if (pe < 1 && pe > 0) { const [hx, hy] = pts[pts.length - 1]; glowDot(hx, hy, 5, '#ffffff', a); }
  if (o.pulse && pe >= 1) { const ph = ((o.pulseT || 0) * 0.9) % 1, [qx, qy] = bez([x0, y0], C, [x1, y1], ph); glowDot(qx, qy, 3.5, '#ffffff', a * 0.9); }
}
// ---------- 小贴士面板（官方中文 + 英文定义） ----------
// tip(t, t0, t1, {tag, title, zh, zhSrc, en, enSrc, x, y, w})；⟨…⟩ 内为高亮关键词
const F_TIPZH = '"Microsoft YaHei", "Noto Sans CJK SC", "Cambria Math", sans-serif';
const F_TIPEN = 'Cambria, "Cambria Math", "Times New Roman", "DejaVu Serif", serif';
function richUnits(text) {   // → [{s, hi, sp}]：中文按字、英文按词
  const out = []; let hi = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '⟨') { hi = true; i++; continue; } if (c === '⟩') { hi = false; i++; continue; }
    if (/[A-Za-z0-9.,;:()'’\-]/.test(c)) { let j = i; while (j < text.length && /[A-Za-z0-9.,;:()'’\-]/.test(text[j])) j++; out.push({ s: text.slice(i, j), hi }); i = j; }
    else if (c === ' ') { out.push({ s: ' ', hi, sp: true }); i++; }
    else { out.push({ s: c, hi }); i++; }
  }
  return out;
}
function wrapRich(text, font, maxW) {
  ctx.save(); ctx.font = font; const U = richUnits(text), lines = [[]]; let w = 0;
  U.forEach(u => { const uw = ctx.measureText(u.s).width; if (w + uw > maxW && !u.sp && lines[lines.length - 1].length) { lines.push([]); w = 0; } if (u.sp && w === 0) return; lines[lines.length - 1].push(Object.assign({ w: uw }, u)); w += uw; });
  ctx.restore(); return lines;
}
const TIP_CACHE = {};
function tip(t, t0, t1, o) {
  const a = win01(t, t0, t1, 0.35, 0.35); if (a <= 0) return;
  const w = o.w || 780, x = o.x ?? (1880 - w), y = o.y ?? 150, pad = 28;
  const zs = o.zs || 28, es = o.es || 27, zf = `${zs}px ${F_TIPZH}`, ef = `italic ${es}px ${F_TIPEN}`;
  const key = o.title + w;
  if (!TIP_CACHE[key]) TIP_CACHE[key] = { zl: o.zh ? wrapRich(o.zh, zf, w - pad * 2) : [], el: o.en ? wrapRich(o.en, ef, w - pad * 2) : [] };
  const { zl, el } = TIP_CACHE[key];
  const lhz = zs * 1.5, lhe = es * 1.42, hHead = 64;
  const hZ = zl.length ? 30 + zl.length * lhz : 0, hE = el.length ? 40 + el.length * lhe : 0, h = hHead + hZ + hE + 22;
  const pin = eOut(prog(t, t0, 0.45)), sc = lerp(0.94, 1, pin), dy = (1 - pin) * 30;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + w / 2, y + dy); ctx.scale(sc, sc); ctx.translate(-w / 2, 0);
  // 玻璃底
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(9,14,32,0.9)'; rr(0, 0, w, h, 16); ctx.fill(); ctx.shadowBlur = 0;
  const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, hexA(o.col || CYAN, 0.9)); g.addColorStop(0.5, 'rgba(183,156,255,0.5)'); g.addColorStop(1, hexA(GOLD, 0.8));
  ctx.strokeStyle = g; ctx.lineWidth = 2; rr(0, 0, w, h, 16); ctx.stroke();
  ctx.fillStyle = hexA(o.col || CYAN, 0.9); ctx.fillRect(0, 18, 5, h - 36);
  // 标头
  ctx.font = `bold 24px ${F_FANCY}`; const tagW = ctx.measureText(o.tag || '小贴士').width + 30;
  ctx.fillStyle = o.col || CYAN; rr(pad - 4, 18, tagW, 34, 8); ctx.fill(); ctx.fillStyle = COL.ink; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(o.tag || '小贴士', pad + 11, 36);
  ctx.font = `bold 28px ${F_TIPZH}`; ctx.fillStyle = COL.cream; ctx.fillText(o.title, pad + tagW + 10, 36);
  // 正文：逐行揭示
  const drawLines = (lines, font, y0, lh, col, hiCol, tStart) => {
    lines.forEach((ln, i) => {
      const lp = eOut(prog(t, tStart + i * 0.16, 0.35)); if (lp <= 0) return;
      ctx.save(); ctx.globalAlpha *= lp; let cx = pad; ctx.font = font; ctx.textBaseline = 'middle';
      ctx.beginPath(); const lw = ln.reduce((s, u) => s + u.w, 0); ctx.rect(pad - 4, y0 + i * lh - lh / 2, (lw + 10) * lp, lh); ctx.clip();
      ln.forEach(u => { if (u.hi) { ctx.fillStyle = hexA(hiCol, 0.16); ctx.fillRect(cx - 1, y0 + i * lh - lh * 0.36, u.w + 2, lh * 0.72); ctx.fillStyle = hiCol; ctx.shadowColor = hiCol; ctx.shadowBlur = 10; } else { ctx.fillStyle = col; ctx.shadowBlur = 0; } ctx.fillText(u.s, cx, y0 + i * lh); cx += u.w; });
      ctx.restore();
    });
  };
  let yy = hHead + 8;
  if (zl.length) {
    ctx.font = `20px ${F_TIPZH}`; ctx.fillStyle = 'rgba(237,230,216,0.5)'; ctx.textBaseline = 'middle'; ctx.fillText(o.zhSrc || '中文教材（同济《高等数学》第七版）', pad, yy + 6);
    drawLines(zl, zf, yy + 22 + lhz / 2, lhz, COL.cream, GOLD, t0 + 0.3); yy += hZ;
  }
  if (el.length) {
    ctx.strokeStyle = 'rgba(237,230,216,0.15)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, yy + 4); ctx.lineTo(w - pad, yy + 4); ctx.stroke();
    ctx.font = `20px ${F_TIPZH}`; ctx.fillStyle = 'rgba(237,230,216,0.5)'; ctx.fillText(o.enSrc || 'English · Stewart, Calculus ET 7e', pad, yy + 22);
    drawLines(el, ef, yy + 40 + lhe / 2, lhe, '#CFE6F2', CYAN, t0 + 0.5 + zl.length * 0.16); yy += hE;
  }
  // 扫光
  const sp = prog(t, t0 + 0.35, 0.9); if (sp > 0 && sp < 1) { const bx = lerp(-200, w + 200, sp), gg = ctx.createLinearGradient(bx - 120, 0, bx + 120, 0); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(0.5, 'rgba(255,255,255,0.08)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gg; rr(0, 0, w, h, 16); ctx.fill(); }
  ctx.restore();
  return h;
}
// ---------- 块标题（顶部中间：§ 序号 + 名称） ----------
function blockTitle(t, list) {   // list: [[block, '标题'], ...]
  const blk = BLOCKS.find(b => t >= b.t0 && t < b.t1); if (!blk) return;
  const i = list.findIndex(([b]) => b === blk.b); if (i < 0) return;
  const [, title] = list[i], p = eOut(prog(t, blk.t0 + 0.05, 0.4)), o = 1 - prog(t, blk.t1 - 0.2, 0.2);
  ctx.save(); ctx.globalAlpha = p * o; ctx.font = `28px ${F_FANCY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const s = `§${i + 1}  ${title}`, w = ctx.measureText(s).width; ctx.fillStyle = 'rgba(237,230,216,0.8)'; ctx.fillText(s, 1010, 78 - (1 - p) * 14);
  ctx.restore();
  glowPath(() => { ctx.moveTo(1010 - w / 2 * p, 100); ctx.lineTo(1010 + w / 2 * p, 100); }, CYAN, 2, 0.7 * p * o);
  // 进度点
  ctx.save(); ctx.globalAlpha = 0.8 * p * o; list.forEach((_, k) => { ctx.fillStyle = k < i ? GOLD : k === i ? CYAN : 'rgba(237,230,216,0.25)'; ctx.beginPath(); ctx.arc(1010 + (k - (list.length - 1) / 2) * 16, 118, k === i ? 4 : 3, 0, 7); ctx.fill(); }); ctx.restore();
}
// ---------- 公共合成 ----------
function blockSweep(t) {
  BLOCKS.forEach((b, i) => { if (!i) return; const p = prog(t, b.t0 - 0.12, 0.42); if (p <= 0 || p >= 1) return; const x = lerp(-300, W + 300, eIO(p)); const g = ctx.createLinearGradient(x - 260, 0, x + 260, 0); g.addColorStop(0, 'rgba(92,200,232,0)'); g.addColorStop(0.5, `rgba(180,225,255,${0.22 * Math.sin(p * Math.PI)})`); g.addColorStop(1, 'rgba(92,200,232,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); });
}
function endCard(t, te, next, nextEn) {
  if (t <= te) return;
  const a = prog(t, te, 0.5);
  ctx.save(); ctx.globalAlpha = a * 0.92; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.45 * a * (1 - prog(t, te + 0.4, 1.2)), W / 2, H / 2, 1.4);
  glowText(`第 1 章 · ${SEG.tag} ${SEG.short || ''}　✓`, 960, 330, 44, GOLD, t, te + 0.2);
  glowText(next, 960, 470, 60, COL.cream, t, te + 0.5);
  if (nextEn) glowText(nextEn, 960, 560, 38, CYAN, t, te + 0.9, { font: F_MATH, bold: false });
  ctx.save(); ctx.globalAlpha = prog(t, te + 1.0, 0.4); ctx.font = `24px ${F_BODY}`; ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('立绘设定：ZipZipPipe / ai-girls　·　BGM：“Easy Lemon” Kevin MacLeod (incompetech.com) CC BY 4.0　·　仅供非商业学习交流', 960, 1010); ctx.restore();
  flash(t, te, 0.4, 0.35);
}
function composeFrame(t, SC, titles) {
  const blk = BLOCKS.find(b => t >= b.t0 && t < b.t1) || BLOCKS[BLOCKS.length - 1];
  CAM = { x: 0, y: 0, z: 1 };
  ctx.save(); (SC[blk.b] || (() => { starfield(t); }))(t, blk); ctx.restore();
  blockSweep(t);
  sideChars(t);
  if (SC.__overlay) SC.__overlay(t);
  if (titles) blockTitle(t, titles);
  if (!SC.__noTag || t < SC.__noTag) chapterTag(t, SEG.tag, SEG.title);
  subtitle(t);
  const fi = prog(t, 0, 0.5); if (fi < 1) { ctx.fillStyle = `rgba(5,7,15,${1 - fi})`; ctx.fillRect(0, 0, W, H); }
  const fo = prog(t, TOTAL - 0.6, 0.6); if (fo > 0) { ctx.fillStyle = `rgba(5,7,15,${fo})`; ctx.fillRect(0, 0, W, H); }
}
