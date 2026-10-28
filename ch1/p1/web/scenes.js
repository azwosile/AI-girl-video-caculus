// P1《高中速通》场景：五关速通（A05 五面棱柱 · A06 初等函数连续变形 · A07 变换滑杆 · A08 定义域自动挖除）+ 随堂三连
// 依赖 core.js（时间轴 S/E/P/D、文字组件、特效库）。音效规则：重击每段 ≤ 2（本段只在“通关”用 1 次 slam），其余用柔和音色组。
const SC = {};
const BEATS = ENTRIES.filter(e => e.k === 'beat');
const QB = BEATS.filter(e => e.b === 'quiz');   // 三个 3 秒倒计时
const LV = [['定义域', 'domain'], ['表示法', 'rep'], ['初等函数', 'family'], ['图像变换', 'trans'], ['指数对数', 'explog']];
const DONE = [E('C04') + 0.15, E('C06') + 0.15, E('G02') + 0.15, E('C11') + 0.15, E('G03') + 0.15];
const HUDX = i => 780 + i * 150, HUDY = 92;
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// 分色数学式：[[str, col], ...]
function mathRich(parts, x, y, size, o = {}) {
  const tot = parts.reduce((s, [str]) => s + mathW(str, size), 0);
  let cx = o.align === 'center' ? x - tot / 2 : x;
  parts.forEach(([str, col]) => { cx = mathText(str, cx, y, size, col, { glow: o.glow ?? 10, alpha: o.alpha ?? 1, upright: o.upright }); });
  return tot;
}
// 关键帧：从 v0 出发，依次缓动到各目标值
function kf(t, v0, steps) { let v = v0; for (const [t1, v1, d] of steps) { const e = eIO(prog(t, t1, d)); v = lerp(v, v1, e); } return v; }
// 坐标轴 + 函数绘制（NaN / 越界 / 跳变处断开）
function axes(A, a, o = {}) {
  if (a <= 0) return;
  const { cx, cy, u } = A, X0 = cx + A.x0 * u, X1 = cx + A.x1 * u, Y0 = cy - A.y1 * u, Y1 = cy - A.y0 * u;
  ctx.save(); ctx.globalAlpha = a;
  if (o.grid !== false) { ctx.strokeStyle = 'rgba(92,200,232,0.07)'; ctx.lineWidth = 1; for (let i = Math.ceil(A.x0); i <= A.x1; i++) { ctx.beginPath(); ctx.moveTo(cx + i * u, Y0); ctx.lineTo(cx + i * u, Y1); ctx.stroke(); } for (let j = Math.ceil(A.y0); j <= A.y1; j++) { ctx.beginPath(); ctx.moveTo(X0, cy - j * u); ctx.lineTo(X1, cy - j * u); ctx.stroke(); } }
  ctx.strokeStyle = 'rgba(237,230,216,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, cy); ctx.lineTo(X1, cy); ctx.moveTo(cx, Y1); ctx.lineTo(cx, Y0); ctx.stroke();
  ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.beginPath(); ctx.moveTo(X1 + 12, cy); ctx.lineTo(X1, cy - 6); ctx.lineTo(X1, cy + 6); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx, Y0 - 12); ctx.lineTo(cx - 6, Y0); ctx.lineTo(cx + 6, Y0); ctx.fill();
  if (o.ticks !== false) { ctx.font = `20px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(237,230,216,0.45)'; for (let i = Math.ceil(A.x0); i <= A.x1; i++) { if (!i || i % (o.step || 1)) continue; ctx.fillRect(cx + i * u - 1, cy - 5, 2, 10); ctx.fillText(String(i).replace('-', '−'), cx + i * u, cy + 9); } }
  ctx.restore();
}
function plotSegs(A, f, xa = A.x0, xb = A.x1, n = 320) {
  const segs = []; let cur = null, py = null;
  for (let i = 0; i <= n; i++) {
    const x = xa + (xb - xa) * i / n, y = f(x), ok = isFinite(y) && y > A.y0 - 1.5 && y < A.y1 + 1.5 && (py == null || Math.abs(y - py) < 3.5);
    if (ok) { if (!cur) { cur = []; segs.push(cur); } cur.push([A.cx + x * A.u, A.cy - clamp(y, A.y0 - 0.6, A.y1 + 0.6) * A.u]); } else cur = null;
    py = isFinite(y) ? y : null;
  }
  return segs;
}
function plot(A, f, col, w = 4, a = 1, o = {}) {
  if (a <= 0) return;
  const segs = plotSegs(A, f, o.xa ?? A.x0, o.xb ?? A.x1, o.n || 320);
  ctx.save(); ctx.beginPath(); ctx.rect(A.cx + A.x0 * A.u - 4, A.cy - A.y1 * A.u - 4, (A.x1 - A.x0) * A.u + 8, (A.y1 - A.y0) * A.u + 8); ctx.clip();
  if (o.dash) { ctx.setLineDash(o.dash); ctx.strokeStyle = hexA(col, 0.45 * a); ctx.lineWidth = 2.5; segs.forEach(s => { ctx.beginPath(); s.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }); ctx.setLineDash([]); }
  else segs.forEach(s => { if (s.length > 1) glowPath(() => s.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, w, a); });
  ctx.restore();
}
const ax2px = (A, x, y) => [A.cx + x * A.u, A.cy - y * A.u];
// 小勾 ✓ / 叉 ✗（光笔画出）
function checkMark(x, y, s, col, t, t0, a = 1) {
  const p = eOut(prog(t, t0, 0.3)); if (p <= 0) return;
  const pts = [[-0.5, 0], [-0.15, 0.38], [0.6, -0.45]];
  glowPath(() => { ctx.moveTo(x + pts[0][0] * s, y + pts[0][1] * s); const k = p * 2; if (k <= 1) ctx.lineTo(x + lerp(pts[0][0], pts[1][0], k) * s, y + lerp(pts[0][1], pts[1][1], k) * s); else { ctx.lineTo(x + pts[1][0] * s, y + pts[1][1] * s); ctx.lineTo(x + lerp(pts[1][0], pts[2][0], k - 1) * s, y + lerp(pts[1][1], pts[2][1], k - 1) * s); } }, col, Math.max(3, s * 0.12), a);
}
function crossMark(x, y, s, col, t, t0) {
  const p = eOut(prog(t, t0, 0.3)); if (p <= 0) return;
  glowPath(() => { ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x - s / 2 + s * Math.min(1, p * 2), y - s / 2 + s * Math.min(1, p * 2)); if (p > 0.5) { const q = (p - 0.5) * 2; ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + s / 2 - s * q, y - s / 2 + s * q); } }, col, Math.max(3, s * 0.12));
}
// “已学”印记：红色双环 + 字（不是卡片，不用重击音）
function stampMark(x, y, r, t, t0, o = {}) {
  const p = prog(t, t0, 0.35); if (p <= 0) return;
  const s = lerp(1.7, 1, eOut(p)), al = clamp(p * 3) * (o.alpha ?? 1);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.25); ctx.scale(s, s); ctx.globalAlpha = al;
  ctx.shadowColor = COL.red; ctx.shadowBlur = 14; ctx.strokeStyle = COL.red; ctx.lineWidth = r * 0.09; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = COL.red; ctx.font = `bold ${r * 0.62}px ${F_FANCY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.text || '已学', 0, 2);
  ctx.restore();
}
// ---------- 顶部“五关”进度 ----------
function hud(t) {
  const a = win01(t, P('C01', 0.15), P('C19', 0.25), 0.3, 0.25); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const nDone = DONE.filter(d => t >= d).length;
  ctx.strokeStyle = 'rgba(237,230,216,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(HUDX(0), HUDY); ctx.lineTo(HUDX(4), HUDY); ctx.stroke();
  if (nDone > 1) { glowPath(() => { ctx.moveTo(HUDX(0), HUDY); ctx.lineTo(Math.max(HUDX(0), HUDX(nDone - 1)), HUDY); }, GOLD, 3); }
  LV.forEach(([nm, b], i) => {
    const x = HUDX(i), pop = eBack(prog(t, P('C01', 0.2 + i * 0.06), 0.3)); if (pop <= 0) return;
    const done = t >= DONE[i], act = !done && BK[b] && t >= BK[b].t0 && t < BK[b].t1;
    ctx.save(); ctx.translate(x, HUDY); ctx.scale(pop, pop);
    if (done) { ctx.shadowColor = GOLD; ctx.shadowBlur = 18; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, 0, 15, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
    else { ctx.strokeStyle = act ? CYAN : 'rgba(237,230,216,0.45)'; ctx.lineWidth = act ? 4 : 2.5; ctx.beginPath(); ctx.arc(0, 0, act ? 15 + 2 * Math.sin(t * 6) : 13, 0, 7); ctx.stroke(); if (act) { ctx.fillStyle = hexA(CYAN, 0.25); ctx.fill(); } }
    ctx.restore();
    if (done) checkMark(x, HUDY, 22, COL.ink, t, DONE[i] + 0.05);
    ctx.font = `24px ${F_FANCY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = done ? GOLD : act ? CYAN : 'rgba(237,230,216,0.55)'; ctx.globalAlpha = a * clamp(pop); ctx.fillText(nm, x, HUDY + 36); ctx.globalAlpha = a;
    if (done) { burst(t, DONE[i], x, HUDY, GOLD, 70, 12); stampMark(x + 40, HUDY - 4, 22, t, DONE[i], { alpha: 1 - prog(t, DONE[i] + 1.2, 0.5) * 0.65 }); }
  });
  ctx.restore();
}
// ---------- 右侧角色（GPT / 千问 / 大肥鱼）：按台词连续段滑入滑出 ----------
const SIDE = { G: { x: 1680, h: 700, flip: true }, Q: { x: 1700, h: 640 }, D: { x: 1735, h: 500 } };
const RUNS = (() => {
  const vs = ENTRIES.filter(e => e.k === 'v' && e.id[0] !== 'C'), out = [];
  vs.forEach(e => { const w = e.id[0], last = out.filter(r => r.w === w).pop(); if (last && e.vo - last.t1 < 2.2 && !ENTRIES.some(x => x.k === 'v' && x.id[0] !== 'C' && x.id[0] !== w && x.vo > last.t1 && x.vo < e.vo)) { last.t1 = e.t1; last.ids.push(e); } else out.push({ w, t0: e.vo, t1: e.t1, ids: [e] }); });
  return out;
})();
function sideChars(t) {
  RUNS.forEach(r => {
    const pi = eOut(prog(t, r.t0 - 0.45, 0.4)), po = eIn(prog(t, r.t1 + 0.25, 0.35)); if (pi <= 0 || po >= 1) return;
    const cfg = SIDE[r.w]; let cur = r.ids[0], prv = null; for (const e of r.ids) if (e.vo - 0.12 <= t) { prv = cur; cur = e; }
    const dx = (1 - pi) * 650 + po * 650, k = prv && prv.pose !== cur.pose ? eOut(prog(t, cur.vo - 0.12, 0.18)) : 1, by = H + (r.w === 'D' ? 30 : 20);
    if (k < 1) sprite(prv.pose, cfg.x + dx, by, cfg.h, { flip: cfg.flip, alpha: 1 - k });
    sprite(cur.pose, cfg.x + dx, by, cfg.h, { flip: cfg.flip, alpha: k, rim: r.w === 'D' ? 'rgba(92,200,232,0.5)' : undefined });
  });
}
// ================= 块 intro =================
SC.intro = (t) => {
  starfield(t);
  particleText(t, S('D01') + 0.1, '高中速通', 1000, 420, 160, COL.red, { n: 850, dur: 0.6, spread: 0.25, fill: COL.red, out: P('C01', 0.12) });
  glowText('High-school speed run', 1000, 545, 40, CYAN, t, S('D01') + 1.1, { font: F_MATH, bold: false, out: P('C01', 0.12) });
  // 每关半分钟：计时环
  const ta = win01(t, P('C01', 0.4), E('C01') + 0.35, 0.3, 0.25);
  if (ta > 0) {
    const cx = 1000, cy = 470, R = 120 * eBack(prog(t, P('C01', 0.4), 0.4)), sw = ((t - P('C01', 0.4)) * 0.9) % 1;
    ctx.save(); ctx.globalAlpha = ta;
    ctx.strokeStyle = 'rgba(237,230,216,0.2)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    glowPath(() => ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + sw * 6.283), CYAN, 8);
    for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; ctx.fillStyle = 'rgba(237,230,216,0.5)'; ctx.fillRect(cx + Math.cos(an) * (R - 26) - 2, cy + Math.sin(an) * (R - 26) - 2, 4, 4); }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = ta; mathText('30 s', cx, cy + 18, 58, COL.cream, { align: 'center', glow: 14, upright: true }); ctx.restore();
    glowText('每关', cx - 230, cy, 44, COL.cream, t, P('C01', 0.42), { out: E('C01') + 0.1 });
    stampMark(cx + 230, cy, 62, t, P('C01', 0.78), { alpha: 1 - prog(t, E('C01') + 0.1, 0.25) });
  }
  lecturer(t, 'C', 255, S('C01') - 0.3, null);
};
// ================= 块 domain：A08 定义域自动挖除 =================
const DM = { y: 590, x0: 520, x1: 1600, v0: -4, v1: 6 };
const dmx = v => lerp(DM.x0, DM.x1, (v - DM.v0) / (DM.v1 - DM.v0));
const FPARTS = [['f(x) = ', COL.text], ['√(4 − x)', CYAN], [' / ', COL.text], ['(x − 1)', COL.inv], [' + ', COL.text], ['ln(x + 2)', GOLD]];
SC.domain = (t, blk) => {
  starfield(t);
  const fy = 300, fs = 64, tot = FPARTS.reduce((s, [str]) => s + mathW(str, fs), 0), fx0 = 1010 - tot / 2;
  const fa = prog(t, S('C02') + 0.3, 0.5);
  const xs = []; { let cx = fx0; FPARTS.forEach(([str]) => { xs.push([cx, mathW(str, fs)]); cx += mathW(str, fs); }); }
  // 三个条件的时刻
  const TC = [[P('C03', 0.02), P('C03', 0.2), 1], [P('C03', 0.36), P('C03', 0.52), 3], [P('C03', 0.68), P('C03', 0.84), 5]];
  TC.forEach(([th, , pi]) => {   // 公式片段依次亮框
    const a = win01(t, th, th + 1.5, 0.2, 0.4); if (a <= 0) return;
    const [x, w] = xs[pi], col = FPARTS[pi][1];
    ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.strokeStyle = col; ctx.lineWidth = 3; rr(x - 10, fy - fs * 0.85, w + 20, fs * 1.2, 12); ctx.stroke(); ctx.restore();
    shock(t, th, x + w / 2, fy - fs * 0.25, 120, col, { ry: 0.45, w: 5 });
  });
  if (fa > 0) { ctx.save(); ctx.beginPath(); ctx.rect(fx0 - 20, fy - 100, (tot + 40) * eOut(fa), 160); ctx.clip(); mathRich(FPARTS, fx0, fy, fs, { glow: 12 }); ctx.restore(); if (fa < 1) glowDot(fx0 - 20 + (tot + 40) * eOut(fa), fy - 20, 6, CYAN); }
  glowText('让式子有意义的最大集合', 1010, 420, 40, COL.cream, t, P('C02', 0.5), { bold: false, out: S('C03') + 0.2 });
  // 数轴 + 允许区间（实数带）
  const la = eOut(prog(t, P('C02', 0.6), 0.6));
  if (la > 0) {
    ctx.save(); ctx.strokeStyle = 'rgba(237,230,216,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(DM.x0 - 20, DM.y); ctx.lineTo(lerp(DM.x0 - 20, DM.x1 + 20, la), DM.y); ctx.stroke();
    ctx.font = `24px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(237,230,216,0.6)';
    for (let v = DM.v0; v <= DM.v1; v++) { const x = dmx(v); if (x > lerp(DM.x0 - 20, DM.x1 + 20, la)) break; ctx.fillRect(x - 1, DM.y - 7, 2, 14); ctx.fillText(String(v).replace('-', '−'), x, DM.y + 50); }
    ctx.restore();
    // 允许带：被三个条件逐步挖掉
    const cutR = prog(t, TC[0][1], 0.5), cutL = prog(t, TC[2][1], 0.5), hole = prog(t, TC[1][1], 0.3);
    const L = lerp(DM.v0 - 0.3, -2, eOut(cutL)), R = lerp(DM.v1 + 0.3, 4, eOut(cutR));
    const gold = prog(t, S('C04'), 0.5), bandCol = gold > 0.5 ? GOLD : CYAN;
    const bandA = la * (0.55 + 0.25 * gold);
    ctx.save(); ctx.globalAlpha = bandA; ctx.shadowColor = bandCol; ctx.shadowBlur = 16; ctx.fillStyle = hexA(bandCol, 0.8);
    const xL = dmx(L), xR = Math.min(dmx(R), lerp(DM.x0 - 20, DM.x1 + 20, la)), xh = dmx(1);
    if (hole > 0) { ctx.fillRect(xL, DM.y - 9, Math.max(0, xh - 12 * hole - xL), 18); ctx.fillRect(xh + 12 * hole, DM.y - 9, Math.max(0, xR - xh - 12 * hole), 18); } else ctx.fillRect(xL, DM.y - 9, Math.max(0, xR - xL), 18);
    ctx.restore();
    // 挖掉的部分碎成粒子落下
    [[TC[0][1], 4, DM.v1 + 0.3, CYAN], [TC[2][1], DM.v0 - 0.3, -2, GOLD]].forEach(([tc, a, b, col], j) => {
      const p = prog(t, tc, 0.9); if (p <= 0 || p >= 1) return;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 70; i++) { const v = lerp(a, b, h32(i, j, 31)), x = dmx(v), dl = Math.abs(v - (j ? -2 : 4)) / 3 * 0.25, q = clamp((p - dl) / 0.75); if (q <= 0) { continue; } const y = DM.y + q * q * 260 + (h32(i, j, 32) - 0.5) * 18, xx = x + (h32(i, j, 33) - 0.5) * 80 * q; ctx.fillStyle = hexA(col, (1 - q) * 0.9); ctx.fillRect(xx - 3, y - 3, 6, 6); }
      ctx.restore();
    });
    // 端点：4 实心（含）、1 与 −2 空心（不含）
    [[TC[0][1], 4, true, 'x ≤ 4', CYAN], [TC[1][1], 1, false, 'x ≠ 1', COL.inv], [TC[2][1], -2, false, 'x > −2', GOLD]].forEach(([tc, v, closed, lbl, col], j) => {
      const p = eBack(prog(t, tc, 0.3)); if (p <= 0) return;
      const x = dmx(v);
      ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = closed ? col : '#0B1022'; ctx.beginPath(); ctx.arc(x, DM.y, 12 * p, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      shock(t, tc, x, DM.y, 90, col, { w: 5 }); sparks(t, tc, x, DM.y, { col: [col, '#fff'], n: 14, speed: 300, life: 0.5 });
      const ly = DM.y - 66 - (j === 1 ? 46 : 0);
      ctx.save(); ctx.globalAlpha = clamp(p) * (1 - 0.4 * prog(t, S('C04'), 0.4)); mathText(lbl, x, ly, 40, col, { align: 'center', glow: 12, upright: true }); ctx.restore();
    });
    // 结果
    if (t > S('C04')) {
      glowMath('(−2, 1) ∪ (1, 4]', 1010, DM.y + 160, 66, GOLD, t, P('C04', 0.35), { align: 'center', upright: true });
      const pulse = prog(t, P('C04', 0.1), 0.8); if (pulse > 0 && pulse < 1) { const x = lerp(dmx(-2), dmx(4), pulse); glowDot(x, DM.y, 10, '#ffffff', 1 - pulse * 0.5); }
      glowText('natural domain', 870, DM.y + 250, 34, CYAN, t, P('C04', 0.6), { font: F_MATH, bold: false });
      glowText('自然定义域', 1170, DM.y + 252, 34, GOLD, t, P('C04', 0.7), { bold: false });
    }
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= 块 rep：A05 五面棱柱 → 千问归档 → 竖线检验 =================
const PR = { cx: 1000, cy: 505, w: 360, h: 290, f: 1500 };
const ROLE = [['文字', 'words', '给人读', COL.cream], ['表格', 'table', '存数据', CYAN], ['图像', 'graph', '看趋势', GOLD], ['公式', 'formula', '能推导', COL.f], ['代码', 'code', '能运行', COL.inv]];
let FACE_CV = null;
function faceCanvases() {
  if (FACE_CV) return FACE_CV;
  FACE_CV = ROLE.map(([zh, en, , col], k) => {
    const c = mkCanvas(PR.w, PR.h), g = c.getContext('2d'), w = PR.w, h = PR.h;
    g.fillStyle = 'rgba(12,18,38,0.94)'; g.beginPath(); g.roundRect(3, 3, w - 6, h - 6, 16); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.stroke();
    g.fillStyle = col; g.font = `30px ${F_FANCY}`; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText(zh, 22, 32);
    g.font = `italic 22px ${F_MATH}`; g.globalAlpha = 0.6; g.fillText(en, 22 + g.measureText(zh).width + 60, 34); g.globalAlpha = 1;
    g.textAlign = 'center';
    if (k === 0) { g.fillStyle = COL.cream; g.font = `48px ${F_FANCY}`; g.fillText('把输入的数', w / 2, 128); g.fillStyle = GOLD; g.font = `66px ${F_FANCY}`; g.fillText('平方', w / 2, 205); }
    if (k === 1) { const xs = ['x', '−2', '−1', '0', '1', '2'], ys = ['y', '4', '1', '0', '1', '4']; g.font = `30px ${F_MATH}`; g.strokeStyle = 'rgba(92,200,232,0.5)'; g.lineWidth = 1.5; for (let i = 0; i < 6; i++) { const x = 40 + i * 56; g.fillStyle = i ? COL.cream : CYAN; g.fillText(xs[i], x, 118); g.fillStyle = i ? GOLD : GOLD; g.fillText(ys[i], x, 188); } g.beginPath(); g.moveTo(20, 153); g.lineTo(w - 20, 153); g.moveTo(68, 90); g.lineTo(68, 220); g.stroke(); }
    if (k === 2) { g.strokeStyle = 'rgba(237,230,216,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(40, 240); g.lineTo(w - 40, 240); g.moveTo(w / 2, 255); g.lineTo(w / 2, 70); g.stroke(); g.strokeStyle = GOLD; g.lineWidth = 5; g.shadowColor = GOLD; g.shadowBlur = 12; g.beginPath(); for (let i = 0; i <= 40; i++) { const x = -1.6 + 3.2 * i / 40, X = w / 2 + x * 80, Y = 240 - x * x * 62; i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke(); g.shadowBlur = 0; }
    if (k === 3) { g.fillStyle = COL.cream; g.font = `italic 92px ${F_MATH}`; g.shadowColor = COL.f; g.shadowBlur = 16; g.fillText('y = x²', w / 2, 170); g.shadowBlur = 0; }
    if (k === 4) { g.textAlign = 'left'; g.font = `32px ${F_CODE}`; g.fillStyle = '#c792ea'; g.fillText('const', 30, 120); g.fillStyle = '#82aaff'; g.fillText(' f', 30 + g.measureText('const').width, 120); g.fillStyle = '#89ddff'; g.fillText(' =', 30 + g.measureText('const f').width, 120); g.fillStyle = '#f78c6c'; g.fillText('  x', 30, 180); g.fillStyle = '#c792ea'; g.fillText(' =>', 30 + g.measureText('  x').width, 180); g.fillStyle = COL.cream; g.fillText(' x * x;', 30 + g.measureText('  x =>').width, 180); }
    return c;
  });
  return FACE_CV;
}
const ROT_T = () => [P('C05', 0.53), P('C05', 0.61), P('C05', 0.69), P('G01', 0.28)];
function prismTheta(t) { let th = 0; ROT_T().forEach(tt => { th -= 72 * eIO(prog(t, tt, 0.4)); }); return (th + 7 * Math.sin(t * 0.9)) * Math.PI / 180; }
function prism(t, a, sc = 1) {
  if (a <= 0) return;
  const FC = faceCanvases(), th = prismTheta(t), R = PR.w / (2 * Math.sin(Math.PI / 5)), half = Math.PI / 5, N = 44;
  const faces = ROLE.map((_, k) => ({ k, phi: th + k * 2 * Math.PI / 5 })).filter(f => Math.cos(f.phi) > 0.02).sort((A, B) => Math.cos(A.phi) - Math.cos(B.phi));
  ctx.save(); ctx.translate(PR.cx, PR.cy); ctx.scale(sc, sc); ctx.translate(-PR.cx, -PR.cy); ctx.globalAlpha = a;
  faces.forEach(({ k, phi }) => {
    const p1 = phi - half, p2 = phi + half, X1 = R * Math.sin(p1), Z1 = R * Math.cos(p1) - R, X2 = R * Math.sin(p2), Z2 = R * Math.cos(p2) - R;
    const proj = u => { const X = lerp(X1, X2, u), Z = lerp(Z1, Z2, u), s = PR.f / (PR.f - Z); return [PR.cx + X * s, PR.h * s]; };
    for (let i = 0; i < N; i++) { const [xa, ha] = proj(i / N), [xb, hb] = proj((i + 1) / N); if (xb - xa < 0.2) continue; const hh = (ha + hb) / 2; ctx.drawImage(FC[k], i / N * PR.w, 0, PR.w / N + 0.6, PR.h, xa, PR.cy - hh / 2, xb - xa + 0.8, hh); }
    const [xa, ha] = proj(0), [xb, hb] = proj(1), shade = (1 - Math.cos(phi)) * 0.75;
    ctx.fillStyle = `rgba(4,6,14,${shade})`; ctx.beginPath(); ctx.moveTo(xa, PR.cy - ha / 2); ctx.lineTo(xb, PR.cy - hb / 2); ctx.lineTo(xb, PR.cy + hb / 2); ctx.lineTo(xa, PR.cy + ha / 2); ctx.closePath(); ctx.fill();
    if (Math.cos(phi) > 0.97) glowPath(() => { ctx.moveTo(xa, PR.cy - ha / 2); ctx.lineTo(xb, PR.cy - hb / 2); ctx.lineTo(xb, PR.cy + hb / 2); ctx.lineTo(xa, PR.cy + ha / 2); ctx.closePath(); }, ROLE[k][3], 2.5, 0.8);
  });
  ctx.restore();
  // 底部倒影光
  ctx.save(); ctx.globalAlpha = a * 0.5; const g = ctx.createRadialGradient(PR.cx, PR.cy + PR.h * 0.62, 10, PR.cx, PR.cy + PR.h * 0.62, 320); g.addColorStop(0, 'rgba(92,200,232,0.35)'); g.addColorStop(1, 'rgba(92,200,232,0)'); ctx.fillStyle = g; ctx.fillRect(PR.cx - 340, PR.cy + PR.h * 0.45, 680, 120); ctx.restore();
}
const ROW = i => [590 + i * 200, 540];
SC.rep = (t, blk) => {
  starfield(t);
  const tq = S('Q01') - 0.15, tC6 = S('C06');
  kinetic('一个函数，五张名片', 1000, 250, 50, t, S('C05') + 0.25, { col: COL.cream, out: tq });
  // 棱柱阶段
  const pa = prog(t, S('C05') + 0.1, 0.5) * (1 - prog(t, tq, 0.3));
  prism(t, pa, lerp(0.6, 1, eOut(prog(t, S('C05') + 0.1, 0.6))) * lerp(1, 0.6, eIn(prog(t, tq, 0.3))));
  ROT_T().forEach((tt, i) => { if (t > tt - 0.05 && t < tt + 0.6) { const k = i + 1; glowText(ROLE[k][0], PR.cx, PR.cy + PR.h / 2 + 62, 40, ROLE[k][3], t, tt + 0.2, { out: tt + 0.55 }); } });
  if (t < P('C05', 0.53) + 0.1) glowText('文字', PR.cx, PR.cy + PR.h / 2 + 62, 40, COL.cream, t, P('C05', 0.42), { out: P('C05', 0.53) + 0.1 });
  if (t > P('G01', 0.28)) { shock(t, P('G01', 0.28) + 0.4, PR.cx, PR.cy, 330, COL.inv, { ry: 0.85, w: 8 }); glowMath('x => x * x', PR.cx, PR.cy + PR.h / 2 + 70, 44, COL.inv, t, P('G01', 0.45), { align: 'center', upright: true, out: tq }); }
  // 千问归档：五面飞成一排
  const FC = faceCanvases(), ca = 1 - prog(t, tC6 - 0.1, 0.35);
  if (t > tq && ca > 0) {
    ROLE.forEach(([zh, , role, col], i) => {
      const t0 = tq + i * 0.06, [rx, ry] = ROW(i);
      const drawAt = (tt, al) => { const p = eOut(prog(tt, t0, 0.55)), x = lerp(PR.cx, rx, p), y = lerp(PR.cy, ry, p) - Math.sin(p * Math.PI) * 90, s = lerp(0.75, 0.5, p); const tagT = P('Q01', 0.18 + i * 0.16), bump = 1 + 0.08 * Math.sin(Math.PI * prog(tt, tagT, 0.3)); ctx.save(); ctx.globalAlpha = al * ca; ctx.translate(x, y); ctx.scale(s * bump, s * bump); ctx.drawImage(FC[i], -PR.w / 2, -PR.h / 2); ctx.restore(); };
      ghosts(t, drawAt, 3, 0.035);
      const tagT = P('Q01', 0.18 + i * 0.16);
      ctx.save(); ctx.globalAlpha = ca; glowText(role, rx, ry + 112, 36, col, t, tagT, { dur: 0.25 }); ctx.restore();
      sparks(t, tagT, rx, ry - 80, { col: [col, '#fff'], n: 10, speed: 220, life: 0.45, grav: 120 });
    });
    // 五张名片 → 同一个对应关系
    const qa = prog(t, S('Q02'), 0.4) * ca;
    if (qa > 0) {
      const nx = 990, ny = 290;
      ROLE.forEach(([, , , col], i) => {
        const [rx, ry] = ROW(i), x0 = rx, y0 = ry - 80, lp = eOut(prog(t, S('Q02') + i * 0.05, 0.4));
        ctx.save(); ctx.globalAlpha = qa; glowPath(() => { ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, nx, lp), lerp(y0, ny + 30, lp)); }, col, 2, 0.7); ctx.restore();
        const ph = ((t - S('Q02')) * 1.3 + i * 0.2) % 1; if (lp >= 1) glowDot(lerp(x0, nx, ph), lerp(y0, ny + 30, ph), 5, col, qa);
      });
      ctx.save(); ctx.globalAlpha = qa; const r = 58 * eBack(prog(t, S('Q02') + 0.3, 0.4)); ctx.shadowColor = COL.f; ctx.shadowBlur = 24; ctx.strokeStyle = COL.f; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(12,18,38,0.85)'; ctx.beginPath(); ctx.arc(nx, ny, Math.max(1, r), 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha = qa * prog(t, S('Q02') + 0.4, 0.3); mathText('f', nx, ny + 16, 56, COL.f, { align: 'center', glow: 14 }); ctx.restore();
      shock(t, S('Q02') + 0.35, nx, ny, 160, COL.f, { w: 6 });
      glowText('同一个对应关系', nx + 250, ny, 36, COL.cream, t, P('Q02', 0.5), { align: 'left', bold: false });
    }
  }
  // 竖线检验
  if (t > tC6 - 0.1) {
    const a = prog(t, tC6, 0.4), boxes = [[780, 560, 'p'], [1240, 560, 'c']], s0 = P('C06', 0.36), s1 = P('C06', 0.86), scan = eIO(prog(t, s0, s1 - s0));
    boxes.forEach(([bx, by, kind], j) => {
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(237,230,216,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx - 180, by + 120); ctx.lineTo(bx + 180, by + 120); ctx.moveTo(bx, by + 150); ctx.lineTo(bx, by - 170); ctx.stroke(); ctx.restore();
      const dp = eOut(prog(t, tC6 + 0.1 + j * 0.15, 0.6));
      if (kind === 'p') glowPath(() => { const n = Math.floor(60 * dp); for (let i = 0; i <= n; i++) { const x = -1.5 + 3 * i / 60, X = bx + x * 105, Y = by + 120 - x * x * 120; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, GOLD, 4, a);
      else glowPath(() => ctx.arc(bx, by - 10, 115, -Math.PI / 2, -Math.PI / 2 + dp * 6.283), CYAN, 4, a);
      if (t > s0 && t < s1 + 0.4) {
        const X = bx - 170 + 340 * scan, al = 1 - prog(t, s1, 0.4);
        glowPath(() => { ctx.moveTo(X, by - 190); ctx.lineTo(X, by + 160); }, '#ff6b81', 2.5, al);
        const dx = (X - bx);
        if (kind === 'p') { const x = dx / 105; if (Math.abs(x) <= 1.5) glowDot(X, by + 120 - x * x * 120, 9, COL.g, al); }
        else if (Math.abs(dx) < 115) { const dy = Math.sqrt(115 * 115 - dx * dx); glowDot(X, by - 10 - dy, 9, COL.red, al); glowDot(X, by - 10 + dy, 9, COL.red, al); if (Math.abs(dx) < 90) { ctx.save(); ctx.globalAlpha = al * 0.6; ctx.strokeStyle = COL.red; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(X + 16, by - 10 - dy); ctx.lineTo(X + 16, by - 10 + dy); ctx.stroke(); ctx.restore(); } }
      }
      if (kind === 'p') { checkMark(bx, by - 230, 50, COL.g, t, s1 + 0.05); glowText('是函数', bx, by + 190, 34, COL.g, t, s1 + 0.15, { bold: false }); }
      else { crossMark(bx, by - 230, 44, COL.red, t, s1 + 0.05); glowText('不是函数', bx, by + 190, 34, '#ff8c7a', t, s1 + 0.15, { bold: false }); }
    });
    burst(t, s1 + 0.05, 780, 330, COL.g, 80, 12); shock(t, s1 + 0.05, 1240, 330, 80, COL.red, { w: 5 });
    glowText('vertical line test', 870, 840, 32, CYAN, t, P('C06', 0.3), { font: F_MATH, bold: false });
    glowText('竖线检验', 1130, 842, 32, GOLD, t, P('C06', 0.36), { bold: false });
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= 块 family：A06 基本初等函数连续变形 =================
const AXF = { cx: 1000, cy: 600, u: 70, x0: -6.5, x1: 6.5, y0: -3.6, y1: 4.6 };
const FAM = [
  ['一次', 'y = x', x => x, COL.g], ['二次', 'y = x^2', x => x * x, GOLD], ['三次', 'y = x^3', x => x * x * x, '#FFB36B'],
  ['根号', 'y = √x', x => x >= 0 ? Math.sqrt(x) : NaN, CYAN], ['反比例', 'y = 1/x', x => Math.abs(x) < 1e-3 ? NaN : 1 / x, COL.inv],
  ['指数', 'y = 2^x', x => Math.pow(2, x), GOLD], ['对数', 'y = log_2 x', x => x > 0 ? Math.log2(x) : NaN, CYAN],
  ['正弦', 'y = sin x', Math.sin, COL.g], ['余弦', 'y = cos x', Math.cos, '#7FB2FF'], ['正切', 'y = tan x', Math.tan, COL.f],
];
const TF = () => [P('C07', 0.38), P('C07', 0.5), P('C07', 0.61), P('C07', 0.72), P('C07', 0.83), P('C08', 0.14), P('C08', 0.3), P('C08', 0.47), P('C08', 0.63), P('C08', 0.79)];
const SLOT = j => [612 + j * 86, 880];
function famIndex(t) { const T = TF(); let i = -1; T.forEach((tt, k) => { if (t >= tt) i = k; }); return i; }
function thumb(j, x, y, s, a) {
  const [, , f, col] = FAM[j]; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = hexA(col, 0.7); ctx.lineWidth = 2; ctx.fillStyle = 'rgba(12,18,38,0.7)'; rr(-38, -28, 76, 56, 8); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(-36, -26, 72, 52); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); let pen = false, py = null;
  for (let i = 0; i <= 60; i++) { const x = -3 + 6 * i / 60, y = f(x), ok = isFinite(y) && Math.abs(y) < 6 && (py == null || Math.abs(y - py) < 3); if (ok) { const X = x * 11, Y = -y * 7; pen ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); pen = true; } else pen = false; py = isFinite(y) ? y : null; }
  ctx.stroke(); ctx.restore();
}
SC.family = (t, blk) => {
  starfield(t);
  const tG = S('G02'), aa = prog(t, S('C07') - 0.05, 0.5);
  axes(AXF, aa, { step: 2 });
  kinetic('基本初等函数', 1000, 255, 54, t, S('C07') + 0.1, { col: COL.cream, out: TF()[0] - 0.05 });
  const i = famIndex(t), T = TF();
  const ma = 1 - prog(t, tG - 0.15, 0.3);
  if (i >= 0 && ma > 0) {
    const e = eIO(prog(t, T[i], 0.42)), fa = i > 0 ? FAM[i - 1][2] : null, fb = FAM[i][2], col = FAM[i][3];
    if (!fa) plot(AXF, fb, col, 4.5, e * ma);
    else {
      plot(AXF, x => { const A = fa(x), B = fb(x); return isFinite(A) && isFinite(B) ? lerp(A, B, e) : NaN; }, col, 4.5, ma);
      plot(AXF, x => isFinite(fa(x)) ? NaN : fb(x), col, 4.5, e * ma);
      plot(AXF, x => isFinite(fb(x)) ? NaN : fa(x), FAM[i - 1][3], 4.5, (1 - e) * ma);
    }
    // 名字 + 公式（左上空白区）
    const lt = T[i];
    ctx.save(); ctx.globalAlpha = ma; kinetic(FAM[i][0], 700, 345, 58, t, lt, { col, align: 'left', out: T[i + 1] ? T[i + 1] - 0.02 : tG - 0.15, stagger: 0.03, fy: -60 }); ctx.restore();
    glowMath(FAM[i][1], 700, 420, 46, COL.cream, t, lt + 0.1, { out: T[i + 1] ? T[i + 1] - 0.02 : tG - 0.15, upright: false, dur: 0.25 });
  }
  // 缩略图：每个函数定型后飞到底部一排
  FAM.forEach((_, j) => {
    const t0 = T[j] + 0.45; if (t < t0) return;
    const p = eOut(prog(t, t0, 0.5)), [sx, sy] = SLOT(j), x = lerp(AXF.cx, sx, p), y = lerp(AXF.cy, sy, p) - Math.sin(p * Math.PI) * 120;
    const wave = t > S('D02') && t < E('D02') + 0.3 ? Math.max(0, Math.sin((t - S('D02')) * 9 - j * 0.6)) * 14 : 0;
    thumb(j, x, y - wave, lerp(2.2, 1, p), clamp(p * 2) * (1 - 0.5 * prog(t, tG, 0.4)));
    if (p >= 1) sparks(t, t0 + 0.5, sx, sy, { col: FAM[j][3], n: 6, speed: 150, life: 0.35, grav: 0 });
  });
  if (t > S('D02') - 0.1) glowText('10 个！', 1460, 880, 36, GOLD, t, S('D02') + 0.2, { out: tG + 0.2 });
  // GPT：三件事
  const ga = prog(t, tG - 0.05, 0.4);
  if (ga > 0) {
    const F3 = [[FAM[5][2], GOLD], [FAM[6][2], CYAN], [FAM[4][2], COL.inv]];
    F3.forEach(([f, c], k) => plot(AXF, f, c, 4, ga * 0.9));
    const HD = [['① 过哪个定点', P('G02', 0.08)], ['② 往哪边长', P('G02', 0.4)], ['③ 有没有渐近线', P('G02', 0.68)]];
    HD.forEach(([s, tt], k) => glowText(s, 620, 340 + k * 54, 36, [GOLD, CYAN, COL.inv][k], t, tt, { align: 'left', dur: 0.3 }));
    // ① 定点
    [[0, 1, GOLD, '(0, 1)'], [1, 0, CYAN, '(1, 0)']].forEach(([x, y, c, l], k) => { const tt = P('G02', 0.12 + k * 0.08); if (t < tt) return; const [X, Y] = ax2px(AXF, x, y), r = 14 + 3 * Math.sin(t * 6); ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.shadowColor = c; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(X, Y, r, 0, 7); ctx.stroke(); ctx.restore(); glowDot(X, Y, 6, c); shock(t, tt, X, Y, 70, c, { w: 4 }); mathText(l, X + (k ? 14 : -18), Y + (k ? 40 : -22), 30, c, { align: k ? 'left' : 'right', upright: true, alpha: prog(t, tt, 0.2) }); });
    // ② 生长方向：沿曲线流动的彗星
    if (t > P('G02', 0.42)) [[FAM[5][2], GOLD, -4, 2.2], [FAM[6][2], CYAN, 0.08, 6]].forEach(([f, c, xa, xb], k) => { for (let m = 0; m < 3; m++) { const ph = ((t - P('G02', 0.42)) * 0.55 + m / 3) % 1, x = lerp(xa, xb, ph); for (let q = 0; q < 8; q++) { const xx = lerp(xa, xb, Math.max(0, ph - q * 0.012)), y = f(xx); if (!isFinite(y)) continue; const [X, Y] = ax2px(AXF, xx, y); glowDot(X, Y, q ? 3 : 7, q ? c : '#ffffff', (1 - q / 8) * prog(t, P('G02', 0.42), 0.3)); } } });
    // ③ 渐近线
    const ap = eOut(prog(t, P('G02', 0.72), 0.5));
    if (ap > 0) {
      ctx.save(); ctx.setLineDash([10, 9]); ctx.lineWidth = 3;
      ctx.strokeStyle = hexA(GOLD, 0.9); ctx.beginPath(); ctx.moveTo(AXF.cx, AXF.cy + 4); ctx.lineTo(AXF.cx + AXF.x0 * AXF.u * ap, AXF.cy + 4); ctx.stroke();
      ctx.strokeStyle = hexA(CYAN, 0.9); ctx.beginPath(); ctx.moveTo(AXF.cx + 4, AXF.cy); ctx.lineTo(AXF.cx + 4, AXF.cy - AXF.y0 * AXF.u * ap); ctx.stroke();
      ctx.restore();
      glowText('asymptote', 700, 640, 30, COL.inv, t, P('G02', 0.8), { font: F_MATH, bold: false, align: 'left' });
      glowText('渐近线', 850, 642, 30, GOLD, t, P('G02', 0.85), { bold: false, align: 'left' });
    }
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= 块 trans：A07 变换滑杆 =================
const AXT = { cx: 900, cy: 610, u: 68, x0: -6, x1: 6, y0: -3.6, y1: 4.2 };
const fB = x => 2.2 * Math.exp(-x * x / 1.4);
function params(t) {
  const h = kf(t, 0, [[P('C09', 0.3), 2, 0.6], [S('C10') - 0.05, 0, 0.3], [P('C11', 0.3), 2, 1.3]]);
  const k = kf(t, 0, [[P('C09', 0.68), 1.5, 0.6], [S('C10') - 0.05, 0, 0.3]]);
  const a = kf(t, 1, [[P('C10', 0.18), 2, 0.6], [P('C10', 0.4), 1, 0.3], [P('C10', 0.78), -1, 0.8], [S('D03') - 0.1, 1, 0.3]]);
  const b = kf(t, 1, [[P('C10', 0.5), 2, 0.6], [P('C10', 0.7), 1, 0.3]]);
  return { h, k, a, b };
}
const SL = [['h', -3, 3, CYAN], ['k', -2, 2, GOLD], ['a', -2, 2, COL.f], ['b', 0, 3, COL.g]];
SC.trans = (t, blk) => {
  starfield(t);
  const aa = prog(t, S('C09') - 0.05, 0.5);
  axes(AXT, aa, { step: 2 });
  const pr = params(t), pr2 = params(t - 0.05), f = x => pr.a * fB(pr.b * (x - pr.h)) + pr.k;
  plot(AXT, fB, COL.cream, 2, aa, { dash: [8, 8] });
  if (aa > 0) mathText('f(x)', AXT.cx - 60, AXT.cy - 2.2 * AXT.u - 14, 30, 'rgba(237,230,216,0.6)', { align: 'right' });
  const moving = Math.abs(pr.h - pr2.h) + Math.abs(pr.k - pr2.k) + Math.abs(pr.a - pr2.a) + Math.abs(pr.b - pr2.b) > 0.004;
  if (moving) ghosts(t, (tt, al) => { if (al > 0.9) return; const q = params(tt); plot(AXT, x => q.a * fB(q.b * (x - q.h)) + q.k, GOLD, 3, al * aa); }, 3, 0.05);
  plot(AXT, f, GOLD, 5, aa);
  // 峰值点跟踪
  const [px, py] = ax2px(AXT, pr.h, pr.a * 2.2 + pr.k); if (aa > 0) glowDot(px, py, 8, '#ffffff', aa);
  mathRich([['y = ', COL.text], ['a', COL.f], [' · f( ', COL.text], ['b', COL.g], ['(x − ', COL.text], ['h', CYAN], [') ) + ', COL.text], ['k', GOLD]], 930, 300, 54, { align: 'center', alpha: prog(t, S('C09') + 0.2, 0.4) });
  // 滑杆
  const sa = prog(t, S('C09') + 0.1, 0.4);
  if (sa > 0) SL.forEach(([n, lo, hi, c], i) => {
    const v = pr[n], v2 = pr2[n], act = Math.abs(v - v2) > 0.001, y = 380 + i * 70, x0 = 1390, x1 = 1560, kx = lerp(x0, x1, (v - lo) / (hi - lo));
    ctx.save(); ctx.globalAlpha = sa * (act ? 1 : 0.7);
    mathText(n, 1350, y + 12, 38, c, { align: 'center', glow: act ? 18 : 6 });
    ctx.strokeStyle = 'rgba(237,230,216,0.3)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    glowPath(() => { ctx.moveTo(lerp(x0, x1, (0 - lo) / (hi - lo)), y); ctx.lineTo(kx, y); }, c, 4, 0.8);
    glowDot(kx, y, act ? 11 : 8, c); ctx.font = `28px ${F_CODE}`; ctx.fillStyle = c; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(v.toFixed(1).replace('-', '−'), x1 + 18, y);
    ctx.restore();
  });
  // 说明字
  [[P('C09', 0.3), '向右 h', CYAN, P('C09', 0.62)], [P('C09', 0.68), '向上 k', GOLD, S('C10')], [P('C10', 0.18), '竖着拉伸 (a > 1)', COL.f, P('C10', 0.4)], [P('C10', 0.5), '横着压缩 (b > 1)', COL.g, P('C10', 0.7)], [P('C10', 0.78), '上下翻折', COL.f, S('D03')]].forEach(([t0, s, c, t1]) => { if (t > t0 - 0.05 && t < t1 + 0.3) kinetic(s, 700, 400, 46, t, t0, { col: c, out: t1, align: 'left', stagger: 0.03 }); });
  // D03 → C11：为什么减 h 是右移
  if (t > S('D03')) {
    const q = prog(t, S('C11'), 0.3);
    // 原峰 x=0
    const [ox, oy] = ax2px(AXT, 0, 2.2); ctx.save(); ctx.globalAlpha = q; ctx.strokeStyle = COL.cream; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(ox, oy, 15, 0, 7); ctx.stroke(); ctx.restore();
    if (q > 0) mathText('x = 0', ox, oy - 26, 30, COL.cream, { align: 'center', alpha: q, upright: true });
    // 输入游标：x 从 0 走到 h
    const xin = pr.h, [ix] = ax2px(AXT, xin, 0), ia = prog(t, P('C11', 0.25), 0.3);
    if (ia > 0) {
      ctx.save(); ctx.globalAlpha = ia; ctx.fillStyle = CYAN; ctx.beginPath(); ctx.moveTo(ix, AXT.cy + 8); ctx.lineTo(ix - 10, AXT.cy + 26); ctx.lineTo(ix + 10, AXT.cy + 26); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = ia; mathRich([['x − h = ', COL.text], [(xin - pr.h).toFixed(1).replace('-', '−').replace('−0.0', '0.0'), GOLD]], ix, AXT.cy + 70, 32, { align: 'center', upright: true }); ctx.restore();
      if (xin > 0.05) { glowPath(() => { ctx.moveTo(ox, AXT.cy + 100); ctx.lineTo(ix, AXT.cy + 100); }, CYAN, 3, ia); ctx.save(); ctx.globalAlpha = ia; mathText('+h →', (ox + ix) / 2, AXT.cy + 140, 30, CYAN, { align: 'center', upright: true }); ctx.restore(); }
    }
    glowText('括号里 = 0 的位置，晚了 h', 1000, 870, 36, GOLD, t, P('C11', 0.62), { bold: false });
    burst(t, P('C11', 0.3) + 1.3, px, py, GOLD, 90, 14);
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= 块 explog：指数方块 → 计算尺 → 指数/对数镜像 =================
const TILE = 62;
function tile(x, y, label, col, s = 1, a = 1) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = hexA(col, 0.22); ctx.strokeStyle = col; ctx.lineWidth = 3; rr(-TILE / 2, -TILE / 2, TILE, TILE, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.font = `italic 38px ${F_MATH}`; ctx.fillStyle = COL.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2); ctx.restore();
}
const RU = { x0: 520, L: 960, y: 470 };
const rux = v => RU.x0 + RU.L * Math.log10(v);
function ruler(y, off, col, a, lab) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(off, 0);
  ctx.fillStyle = 'rgba(12,18,38,0.85)'; ctx.strokeStyle = hexA(col, 0.8); ctx.lineWidth = 2; rr(RU.x0 - 20, y - 26, RU.L + 40, 52, 8); ctx.fill(); ctx.stroke();
  ctx.font = `22px ${F_MATH}`; ctx.textAlign = 'center'; ctx.fillStyle = COL.cream;
  for (let v = 1; v <= 10; v++) { const x = rux(v); ctx.fillRect(x - 1, lab === 'top' ? y + 8 : y - 26, 2, 18); ctx.textBaseline = lab === 'top' ? 'bottom' : 'top'; ctx.fillText(String(v), x, lab === 'top' ? y + 4 : y - 4); for (let m = 1; m < 10 && v < 10; m++) { const xx = rux(v + m / 10); ctx.fillRect(xx - 0.5, lab === 'top' ? y + 16 : y - 26, 1, 10); } }
  ctx.restore();
}
const AXE = { cx: 1050, cy: 610, u: 60, x0: -5, x1: 6.5, y0: -4.2, y1: 5.2 };
SC.explog = (t, blk) => {
  starfield(t);
  // —— 规则一：aᵐ · aⁿ = aᵐ⁺ⁿ ——
  const r1 = P('C12', 0.3), r1m = P('C12', 0.48), r2 = P('C12', 0.63), end12 = S('C13') - 0.05;
  const a1 = 1 - prog(t, r2 - 0.1, 0.3), a2 = 1 - prog(t, end12, 0.3);
  glowMath('a^m · a^n = a^{m+n}', 640, 280, 54, COL.cream, t, r1, { out: end12 });
  glowMath('(a^m)^n = a^{mn}', 1110, 280, 54, COL.cream, t, r2, { out: end12 });
  if (t > r1 && a1 > 0) {
    const mj = eIO(prog(t, r1m, 0.5));
    for (let i = 0; i < 5; i++) {
      const gold = i < 3, x0 = gold ? 640 + i * 74 : 960 + (i - 3) * 74, x1 = 852 + i * 74, y0 = 450, y1 = 500;
      const pop = eBack(prog(t, (gold ? r1 : r1 + 0.25) + (i % 3) * 0.07, 0.3));
      tile(lerp(x0, x1, mj), lerp(y0, y1, mj), 'a', gold ? GOLD : CYAN, pop, a1);
    }
    ctx.save(); ctx.globalAlpha = a1 * (1 - mj); mathText('·', 905, 462, 50, COL.cream, { align: 'center' }); mathText('a^3', 714, 390, 40, GOLD, { align: 'center', alpha: prog(t, r1 + 0.2, 0.2) }); mathText('a^2', 997, 390, 40, CYAN, { align: 'center', alpha: prog(t, r1 + 0.45, 0.2) }); ctx.restore();
    if (mj > 0.5) { ctx.save(); ctx.globalAlpha = a1; mathRich([['a^{3+2}', COL.cream], [' = ', COL.text], ['a^5', GOLD]], 1000, 610, 54, { align: 'center', glow: 14, alpha: prog(t, r1m + 0.4, 0.3) }); ctx.restore(); }
    burst(t, r1m + 0.5, 1000, 500, GOLD, 120, 16);
  }
  // —— 规则二：(aᵐ)ⁿ = aᵐⁿ ——
  if (t > r2 - 0.1 && a2 > 0) {
    const dup = eOut(prog(t, r2 + 0.45, 0.5));
    for (let r = 0; r < 2; r++) for (let i = 0; i < 3; i++) {
      const x = 926 + i * 74, y = r ? lerp(470, 544, dup) : 470, pop = r ? clamp(dup * 3) : eBack(prog(t, r2 + i * 0.07, 0.3));
      tile(x, y, 'a', r ? COL.f : GOLD, pop, a2);
    }
    ctx.save(); ctx.globalAlpha = a2; mathText('×2', 1150, 525, 40, COL.f, { alpha: dup }); ctx.restore();
    if (dup > 0.6) { ctx.save(); ctx.globalAlpha = a2; mathRich([['(a^3)^2', COL.cream], [' = ', COL.text], ['a^{3·2}', COL.cream], [' = ', COL.text], ['a^6', GOLD]], 1000, 660, 52, { align: 'center', glow: 14, alpha: prog(t, r2 + 0.9, 0.3) }); ctx.restore(); }
  }
  // —— 计算尺：log 把乘法变加法 ——
  const tc = S('C13'), ra = prog(t, tc, 0.4) * (1 - prog(t, S('G03') - 0.1, 0.3));
  if (ra > 0) {
    const off = RU.L * Math.log10(2) * eIO(prog(t, P('C13', 0.32), 0.6));
    ruler(RU.y, 0, GOLD, ra, 'top'); ruler(RU.y + 56, off, CYAN, ra, 'bot');
    glowMath('log(xy) = log x + log y', 1000, 330, 58, COL.cream, t, P('C13', 0.4), { align: 'center', upright: true, out: S('G03') - 0.1 });
    const rd = P('C13', 0.62);
    if (t > rd) {
      const x6 = rux(6), x2 = rux(2), q = eOut(prog(t, rd, 0.4));
      ctx.save(); ctx.globalAlpha = ra; glowPath(() => { ctx.moveTo(x6, RU.y - 40); ctx.lineTo(x6, RU.y + 96); }, '#ff6b81', 2.5, q); ctx.restore();
      glowDot(x6, RU.y - 8, 9, GOLD, ra * q); glowDot(x6, RU.y + 64, 9, CYAN, ra * q); shock(t, rd + 0.1, x6, RU.y + 28, 90, COL.inv, { w: 5 });
      const by = RU.y + 120;
      ctx.save(); ctx.globalAlpha = ra * q;
      glowPath(() => { ctx.moveTo(RU.x0, by); ctx.lineTo(x2, by); }, GOLD, 5); glowPath(() => { ctx.moveTo(x2, by + 4); ctx.lineTo(x6, by + 4); }, CYAN, 5); glowPath(() => { ctx.moveTo(RU.x0, by + 34); ctx.lineTo(x6, by + 34); }, COL.inv, 5);
      mathText('log 2', (RU.x0 + x2) / 2, by - 14, 28, GOLD, { align: 'center', upright: true }); mathText('log 3', (x2 + x6) / 2, by - 14, 28, CYAN, { align: 'center', upright: true }); mathText('log 6', (RU.x0 + x6) / 2, by + 74, 28, COL.inv, { align: 'center', upright: true });
      ctx.restore();
      glowMath('2 × 3 = 6', 1290, by + 10, 40, COL.cream, t, rd + 0.3, { upright: true, out: S('G03') - 0.1 });
    }
  }
  // —— GPT：对数 = 指数倒过来（关于 y = x 的镜像）——
  const tg = S('G03'), ga = prog(t, tg - 0.05, 0.4);
  if (ga > 0) {
    axes(AXE, ga, { step: 2 });
    plot(AXE, x => Math.pow(2, x), GOLD, 4.5, ga);
    const lp = eOut(prog(t, P('G03', 0.12), 0.5));
    if (lp > 0) { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = hexA(COL.inv, 0.8); ctx.lineWidth = 2.5; const [a0, b0] = ax2px(AXE, -4, -4), [a1, b1] = ax2px(AXE, lerp(-4, 5.2, lp), lerp(-4, 5.2, lp)); ctx.beginPath(); ctx.moveTo(a0, b0); ctx.lineTo(a1, b1); ctx.stroke(); ctx.restore(); mathText('y = x', ax2px(AXE, 4.6, 5)[0], ax2px(AXE, 4.6, 5)[1], 30, COL.inv, { alpha: lp }); }
    const m0 = P('G03', 0.2), m1 = P('G03', 0.5);
    if (t > m0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 46; i++) { const x = -4 + 6.3 * i / 45, y = Math.pow(2, x); if (y > AXE.y1) continue; const q = eIO(clamp((t - m0 - i / 45 * (m1 - m0) * 0.7) / 0.45)); if (q <= 0) continue; const [X, Y] = ax2px(AXE, lerp(x, y, q), lerp(y, x, q)); ctx.fillStyle = hexA(q < 1 ? '#ffffff' : CYAN, q < 1 ? 0.9 : 0.0); ctx.beginPath(); ctx.arc(X, Y, 3.5, 0, 7); ctx.fill(); }
      ctx.restore();
      const lp2 = clamp((t - m0) / (m1 - m0 + 0.45)); plot(AXE, x => x > 0 ? Math.log2(x) : NaN, CYAN, 4.5, ga, { xa: 0.03, xb: lerp(0.03, AXE.x1, lp2) });
    }
    kinetic('对数 = 指数倒过来', 1000, 255, 50, t, P('G03', 0.08), { col: COL.cream, stagger: 0.03 });
    mathText('y = 2^x', ax2px(AXE, 1.2, 4.6)[0], ax2px(AXE, 1.2, 4.6)[1], 32, GOLD, { alpha: ga, align: 'right' });
    mathText('y = log_2 x', ax2px(AXE, 5.2, 2.6)[0], ax2px(AXE, 5.2, 2.6)[1], 32, CYAN, { alpha: prog(t, m1, 0.3), align: 'center' });
    glowText('→ P4 反函数', 760, 760, 36, COL.inv, t, P('G03', 0.7), { align: 'left' });
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= 块 quiz：随堂三连（3 秒倒计时，画面始终在动） =================
function countdown(t, t0, cx, cy) {
  const p = prog(t, t0, 3.0), a = win01(t, t0 - 0.1, t0 + 3.25, 0.2, 0.25); if (a <= 0) return;
  const R = 105 * eBack(prog(t, t0 - 0.1, 0.35));
  ctx.save(); ctx.globalAlpha = a;
  ctx.strokeStyle = 'rgba(237,230,216,0.15)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  glowPath(() => ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + (1 - p) * 6.283), p < 0.67 ? CYAN : COL.red, 9);
  for (let i = 0; i < 24; i++) { const an = i / 24 * 6.283 + t * 1.2; ctx.fillStyle = hexA(COL.cream, 0.15 + 0.35 * (i % 3 === 0)); ctx.fillRect(cx + Math.cos(an) * (R + 22) - 2, cy + Math.sin(an) * (R + 22) - 2, 4, 4); }
  for (let i = 0; i < 6; i++) { const an = t * 2.2 + i * 1.047; glowDot(cx + Math.cos(an) * (R - 28), cy + Math.sin(an) * (R - 28), 3, i % 2 ? GOLD : CYAN, 0.8); }
  ctx.restore();
  for (let k = 0; k < 3; k++) { const tk = t0 + k; if (t >= tk && t < tk + 1) kinetic(String(3 - k), cx, cy + 4, 120, t, tk, { col: k === 2 ? COL.red : COL.cream, font: F_MATH, bold: false, s0: 2.6, fy: 0, out: tk + 0.82 }); shock(t, tk, cx, cy, R + 40, k === 2 ? COL.red : CYAN, { w: 4, d: 0.5 }); }
}
SC.quiz = (t, blk) => {
  starfield(t);
  // 开场：随堂三连
  kinetic('随堂三连', 1000, 400, 96, t, S('C14') + 0.05, { col: GOLD, out: S('C15') - 0.05 });
  [1, 2, 3].forEach((n, i) => { const tt = P('C14', 0.45 + i * 0.12), x = 860 + i * 140, y = 545, p = eBack(prog(t, tt, 0.3)), o = 1 - prog(t, S('C15') - 0.1, 0.25); if (p <= 0 || o <= 0) return; ctx.save(); ctx.globalAlpha = o; ctx.translate(x, y); ctx.scale(p, p); ctx.shadowColor = [CYAN, GOLD, COL.f][i]; ctx.shadowBlur = 18; ctx.strokeStyle = [CYAN, GOLD, COL.f][i]; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.stroke(); ctx.restore(); ctx.save(); ctx.globalAlpha = o * clamp(p); mathText(String(n), x, y + 17, 50, COL.cream, { align: 'center', upright: true, glow: 10 }); ctx.restore(); shock(t, tt, x, y, 80, [CYAN, GOLD, COL.f][i], { w: 4 }); });
  // —— 第 1 题 ——
  const q1 = [S('C15'), S('C17') - 0.1];
  if (t > q1[0] - 0.1 && t < q1[1] + 0.3) {
    const a = win01(t, q1[0], q1[1], 0.2, 0.3);
    ctx.save(); ctx.globalAlpha = a; glowMath('y = 1/√(x − 3)', 1000, 300, 72, COL.cream, t, q1[0] + 0.15, { align: 'center' }); ctx.restore();
    glowText('定义域？', 1000, 390, 40, CYAN, t, P('C15', 0.6), { out: q1[1] });
    countdown(t, QB[0].vo, 1000, 580);
    const tA = S('C16');
    if (t > tA) {
      const nl = { x0: 600, x1: 1400, y: 600 }, nx = v => lerp(nl.x0, nl.x1, (v + 1) / 8);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(237,230,216,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nl.x0 - 20, nl.y); ctx.lineTo(nl.x1 + 20, nl.y); ctx.stroke(); ctx.font = `24px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(237,230,216,0.6)'; for (let v = -1; v <= 7; v++) { ctx.fillRect(nx(v) - 1, nl.y - 7, 2, 14); ctx.fillText(String(v).replace('-', '−'), nx(v), nl.y + 18); } ctx.restore();
      const bp = eOut(prog(t, tA + 0.15, 0.6));
      ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = GOLD; ctx.shadowBlur = 16; ctx.fillStyle = hexA(GOLD, 0.8); ctx.fillRect(nx(3) + 12, nl.y - 8, (nl.x1 + 10 - nx(3) - 12) * bp, 16); ctx.beginPath(); const ex = nx(3) + 12 + (nl.x1 + 10 - nx(3) - 12) * bp; ctx.moveTo(ex + 24, nl.y); ctx.lineTo(ex, nl.y - 16); ctx.lineTo(ex, nl.y + 16); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = 4; ctx.strokeStyle = GOLD; ctx.fillStyle = '#0B1022'; ctx.beginPath(); ctx.arc(nx(3), nl.y, 12, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      shock(t, tA + 0.1, nx(3), nl.y, 100, GOLD, { w: 5 }); sparks(t, tA + 0.1, nx(3), nl.y, { col: [GOLD, '#fff'], n: 16, speed: 320 });
      ctx.save(); ctx.globalAlpha = a; glowMath('x > 3', 1000, 720, 64, GOLD, t, tA + 0.1, { align: 'center', upright: true }); ctx.restore();
      ctx.save(); ctx.globalAlpha = a; glowText('根号下 ≥ 0', 800, 500, 30, CYAN, t, P('C16', 0.3), { bold: false }); glowText('分母 ≠ 0', 1200, 500, 30, COL.inv, t, P('C16', 0.5), { bold: false }); ctx.restore();
      checkMark(1290, 300, 50, COL.g, t, tA + 0.15, a);
    }
  }
  // —— 第 2 题 ——
  const q2 = [S('C17'), S('C18') - 0.1];
  if (t > q2[0] - 0.1 && t < q2[1] + 0.3) {
    const a = win01(t, q2[0], q2[1], 0.2, 0.3), A = { cx: 1000, cy: 700, u: 48, x0: -6.5, x1: 6.5, y0: -0.8, y1: 6 };
    ctx.save(); ctx.globalAlpha = a; glowMath('y = (x + 2)^2', 1000, 300, 72, COL.cream, t, q2[0] + 0.15, { align: 'center', upright: false }); ctx.restore();
    glowText('往哪边移？', 1000, 390, 40, CYAN, t, P('C17', 0.6), { out: q2[1] });
    const tA = S('D04'), sh = eIO(prog(t, tA + 0.1, 0.8));
    if (t > QB[1].vo + 3.1) { axes(A, a * prog(t, QB[1].vo + 3.1, 0.3), { step: 2 }); plot(A, x => x * x, COL.cream, 2, a, { dash: [8, 8] }); if (sh > 0 && sh < 1) ghosts(t, (tt, al) => { const s2 = eIO(prog(tt, tA + 0.1, 0.8)); plot(A, x => (x + 2 * s2) ** 2, GOLD, 3, al * a); }, 3, 0.05); plot(A, x => (x + 2 * sh) ** 2, GOLD, 5, a); const [vx_, vy_] = ax2px(A, -2 * sh, 0); glowDot(vx_, vy_, 8, '#ffffff', a); if (sh >= 1) { mathText('(−2, 0)', vx_ - 14, vy_ + 44, 30, GOLD, { align: 'right', upright: true, alpha: a }); glowText('← 2', vx_ + 70, vy_ - 40, 36, GOLD, t, tA + 0.9); } }
    else countdown(t, QB[1].vo, 1000, 580);
    checkMark(1330, 300, 50, COL.g, t, tA + 0.9, a); burst(t, tA + 0.9, 1330, 300, COL.g, 70, 12);
  }
  // —— 第 3 题 ——
  const q3 = [S('C18'), E('D05') + 0.3];
  if (t > q3[0] - 0.1 && t < q3[1] + 0.4) {
    const a = win01(t, q3[0], q3[1], 0.2, 0.35);
    ctx.save(); ctx.globalAlpha = a; glowMath('log_2 8 = ?', 1000, 300, 72, COL.cream, t, q3[0] + 0.15, { align: 'center', upright: true }); ctx.restore();
    countdown(t, QB[2].vo, 1000, 580);
    const tA = S('D05');
    if (t > tA - 0.05) {
      const xs = [700, 900, 1100, 1300], vals = ['1', '2', '4', '8'];
      xs.forEach((x, i) => { const tt = tA + i * 0.28, p = eBack(prog(t, tt, 0.3)); if (p <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, 590); ctx.scale(p, p); ctx.shadowColor = i === 3 ? GOLD : CYAN; ctx.shadowBlur = 16; ctx.strokeStyle = i === 3 ? GOLD : CYAN; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(12,18,38,0.85)'; ctx.beginPath(); ctx.arc(0, 0, 46, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); ctx.save(); ctx.globalAlpha = a * clamp(p); mathText(vals[i], x, 606, 48, COL.cream, { align: 'center', upright: true }); ctx.restore(); if (i) { const hp = eOut(prog(t, tt - 0.25, 0.3)); glowPath(() => { for (let k = 0; k <= 20 * hp; k++) { const s = k / 20, X = lerp(xs[i - 1] + 40, x - 40, s), Y = 540 - Math.sin(s * Math.PI) * 60; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, GOLD, 3, a); ctx.save(); ctx.globalAlpha = a * hp; mathText('×2', (xs[i - 1] + x) / 2, 462, 30, GOLD, { align: 'center', upright: true }); mathText(`${i}`, (xs[i - 1] + x) / 2, 690, 28, 'rgba(237,230,216,0.6)', { align: 'center', upright: true }); ctx.restore(); } });
      ctx.save(); ctx.globalAlpha = a; glowMath('log_2 8 = 3', 1000, 790, 64, GOLD, t, tA + 1.0, { align: 'center', upright: true }); ctx.restore();
      burst(t, tA + 1.0, 1300, 590, GOLD, 120, 18); checkMark(1300, 300, 50, COL.g, t, tA + 1.0, a);
    }
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= 块 outro：通关 → 预告“映射” =================
SC.outro = (t, blk) => {
  starfield(t);
  const t0 = S('C19'), tb = P('C19', 0.45);
  // 五个关卡点飞到中央绕圈
  LV.forEach(([nm], i) => {
    const p = eIO(prog(t, P('C19', 0.05) + i * 0.04, 0.6)), an = i / 5 * 6.283 + (t - t0) * 1.6, R = lerp(0, 150, p) * (1 - eIn(prog(t, tb, 0.25)));
    const x = lerp(HUDX(i), 1000 + Math.cos(an) * R, p), y = lerp(HUDY, 470 + Math.sin(an) * R * 0.6, p), al = 1 - prog(t, tb, 0.25);
    if (al <= 0) return; glowDot(x, y, 14, GOLD, al); checkMark(x, y, 20, COL.ink, t, -1, al);
  });
  flash(t, tb, 0.35, 0.3, '255,220,120');
  particleText(t, tb - 0.35, '通关', 1000, 460, 180, GOLD, { n: 800, dur: 0.5, spread: 0.15, out: S('C20') + 0.1 });
  shock(t, tb + 0.4, 1000, 460, 560, GOLD, { ry: 0.45, w: 14 }); sparks(t, tb + 0.4, 1000, 460, { col: [GOLD, COL.red, '#fff'], n: 44, speed: 800, life: 0.9 });
  stampMark(1210, 380, 70, t, tb + 0.55, { text: '高中', alpha: 1 - prog(t, S('C20'), 0.3) });
  // 对应关系 → 映射
  const tc = S('C20'), ma = prog(t, tc + 0.1, 0.4);
  if (ma > 0) {
    const X = { x: 800, y: 600 }, Y = { x: 1200, y: 600 };
    ctx.save(); ctx.globalAlpha = ma;
    [[X, CYAN, 'X'], [Y, GOLD, 'Y']].forEach(([m, c, n]) => { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.shadowColor = c; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(m.x, m.y, 110, 160, 0, 0, 7); ctx.stroke(); ctx.shadowBlur = 0; mathText(n, m.x, m.y - 180, 54, c, { align: 'center', glow: 10 }); });
    for (let i = 0; i < 9; i++) {
      const sx = X.x + (h32(i, 1, 5) - 0.5) * 120, sy = X.y + (h32(i, 2, 5) - 0.5) * 220, j = Math.floor(h32(i, 3, 5) * 5), ex = Y.x + (h32(j, 4, 5) - 0.5) * 110, ey = Y.y + (j - 2) * 55;
      glowDot(sx, sy, 5, CYAN, 0.9); glowDot(ex, ey, 6, GOLD, 0.9);
      const lp = eOut(prog(t, tc + 0.3 + i * 0.07, 0.5)), cxp = (sx + ex) / 2, cyp = Math.min(sy, ey) - 90;
      glowPath(() => { ctx.moveTo(sx, sy); for (let k = 1; k <= 24 * lp; k++) { const [a_, b_] = bez([sx, sy], [cxp, cyp], [ex, ey], k / 24); ctx.lineTo(a_, b_); } }, COL.inv, 2, 0.75);
      if (lp >= 1) { const ph = ((t - tc) * 0.8 + i / 9) % 1, [a_, b_] = bez([sx, sy], [cxp, cyp], [ex, ey], ph); glowDot(a_, b_, 4, '#ffffff', 0.9); }
    }
    ctx.restore();
    kinetic('对应关系 = ？', 1000, 330, 56, t, P('C20', 0.12), { col: COL.cream, out: P('C20', 0.78) });
    particleText(t, P('C20', 0.8), '映射', 1000, 330, 110, COL.cream, { n: 600, dur: 0.55, spread: 0.2 });
    glowText('mapping', 1000, 405, 36, CYAN, t, P('C20', 0.92), { font: F_MATH, bold: false });
  }
  // 片尾
  const te = E('C20') + 0.2;
  if (t > te) {
    const a = prog(t, te, 0.5);
    ctx.save(); ctx.globalAlpha = a * 0.92; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
    warp(t, 0.45 * a * (1 - prog(t, te + 0.4, 1.2)), W / 2, H / 2, 1.4);
    glowText('第 1 章 · P1 高中速通　✓', 960, 330, 44, GOLD, t, te + 0.2);
    glowText('下一段 · P2　函数的大学定义：映射', 960, 470, 64, COL.cream, t, te + 0.5);
    glowText('Function = mapping', 960, 560, 40, CYAN, t, te + 0.9, { font: F_MATH, bold: false });
    ctx.save(); ctx.globalAlpha = prog(t, te + 1.0, 0.4); ctx.font = `24px ${F_BODY}`; ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('立绘设定：ZipZipPipe / ai-girls　·　BGM：“Easy Lemon” Kevin MacLeod (incompetech.com) CC BY 4.0　·　仅供非商业学习交流', 960, 1010); ctx.restore();
  }
  flash(t, te, 0.4, 0.35);
  lecturer(t, 'C', 255, -9, E('C20') + 0.15);
};
// ================= 合成 =================
function drawFrame(t) {
  const blk = BLOCKS.find(b => t >= b.t0 && t < b.t1) || BLOCKS[BLOCKS.length - 1];
  CAM = { x: 0, y: 0, z: 1 };
  ctx.save(); (SC[blk.b] || (() => { }))(t, blk); ctx.restore();
  // 块切换：柔和横扫光带
  BLOCKS.forEach((b, i) => { if (!i) return; const p = prog(t, b.t0 - 0.12, 0.42); if (p <= 0 || p >= 1) return; const x = lerp(-300, W + 300, eIO(p)); const g = ctx.createLinearGradient(x - 260, 0, x + 260, 0); g.addColorStop(0, 'rgba(92,200,232,0)'); g.addColorStop(0.5, `rgba(180,225,255,${0.22 * Math.sin(p * Math.PI)})`); g.addColorStop(1, 'rgba(92,200,232,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); });
  sideChars(t);
  hud(t);
  if (t < E('C20') + 0.2) chapterTag(t, SEG.tag, SEG.title);
  subtitle(t);
  if (window.RELAY_ON) return;   // 段间接力接管首尾
  const fi = prog(t, 0, 0.5); if (fi < 1) { ctx.fillStyle = `rgba(5,7,15,${1 - fi})`; ctx.fillRect(0, 0, W, H); }
  const fo = prog(t, TOTAL - 0.6, 0.6); if (fo > 0) { ctx.fillStyle = `rgba(5,7,15,${fo})`; ctx.fillRect(0, 0, W, H); }
}
// ================= 音效（柔和为主；重击只有“通关”1 次） =================
(function regSfx() {
  sfx(S('D01') + 0.1, 'shimmer', 0.6); sfx(S('D01') + 0.9, 'bell_soft', 0.5);
  sfx(P('C01', 0.12), 'swoosh_soft', 0.6); ['marimba_lo', 'marimba', 'marimba', 'marimba_hi', 'marimba_hi'].forEach((n, i) => sfx(P('C01', 0.2 + i * 0.06), n, 0.4)); sfx(P('C01', 0.4), 'tick2', 0.4); sfx(P('C01', 0.78), 'check', 0.6);
  DONE.forEach(d => { sfx(d, 'check', 0.65); sfx(d + 0.05, 'sparkle', 0.35); });
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.1, 'swoosh_soft', 0.45); });
  // domain
  sfx(S('C02') + 0.3, 'swell', 0.4); typeSfx(S('C02') + 0.35, 10, 0.5, 0.12); sfx(P('C02', 0.6), 'swoosh_soft', 0.4);
  [[0.02, 0.2], [0.36, 0.52], [0.68, 0.84]].forEach(([a, b], i) => { sfx(P('C03', a), 'pluck', 0.4); sfx(P('C03', b), i === 1 ? 'pop' : 'tinkle', i === 1 ? 0.45 : 0.4); sfx(P('C03', b) + 0.02, 'soft_hit', 0.5); });
  sfx(P('C04', 0.1), 'swell', 0.4); sfx(P('C04', 0.35), 'marimba_hi', 0.5); sfx(P('C04', 0.6), 'sparkle', 0.35);
  // rep
  sfx(S('C05') + 0.1, 'swell', 0.45); ROT_T().forEach((tt, i) => { sfx(tt, 'swoosh_soft', 0.45); sfx(tt + 0.38, i === 3 ? 'bell_soft' : 'marimba', 0.4); });
  sfx(S('Q01') - 0.15, 'whoosh', 0.35); ROLE.forEach((_, i) => sfx(P('Q01', 0.18 + i * 0.16), ['marimba_lo', 'marimba', 'marimba', 'marimba_hi', 'marimba_hi'][i], 0.45));
  sfx(S('Q02') + 0.35, 'bell_soft', 0.55); sfx(S('Q02') + 0.05, 'shimmer', 0.35);
  sfx(P('C06', 0.36), 'riser', 0.25); sfx(P('C06', 0.86) + 0.05, 'check', 0.5); sfx(P('C06', 0.86) + 0.1, 'buzz', 0.25);
  // family
  sfx(S('C07') + 0.1, 'swell', 0.4); TF().forEach((tt, i) => sfx(tt, ['marimba_lo', 'marimba', 'marimba_hi'][i % 3], 0.4)); TF().forEach((tt, i) => sfx(tt + 0.9, 'tick', 0.25));
  sfx(S('D02') + 0.05, 'tick2', 0.4); [0.08, 0.4, 0.68].forEach(f => sfx(P('G02', f), 'pluck', 0.45)); sfx(P('G02', 0.12), 'soft_hit', 0.45); sfx(P('G02', 0.2), 'soft_hit', 0.4); sfx(P('G02', 0.72), 'swoosh_soft', 0.4);
  // trans
  sfx(S('C09') + 0.1, 'swell', 0.4); [[P('C09', 0.3)], [P('C09', 0.68)], [P('C10', 0.18)], [P('C10', 0.5)], [P('C10', 0.78)]].forEach(([tt], i) => { sfx(tt, 'swoosh_soft', 0.4); sfx(tt + 0.55, 'marimba', 0.35); });
  sfx(S('D03') - 0.05, 'sting', 0.4); sfx(P('C11', 0.3), 'riser', 0.25); sfx(P('C11', 0.3) + 1.3, 'bell_soft', 0.5); sfx(P('C11', 0.62), 'sparkle', 0.35);
  // explog
  sfx(P('C12', 0.3), 'marimba', 0.4); sfx(P('C12', 0.3) + 0.25, 'pop', 0.3); sfx(P('C12', 0.48), 'swoosh_soft', 0.3); sfx(P('C12', 0.48) + 0.5, 'bell_soft', 0.5); sfx(P('C12', 0.63), 'marimba_lo', 0.4); sfx(P('C12', 0.63) + 0.45, 'swoosh_soft', 0.4); sfx(P('C12', 0.63) + 0.9, 'marimba_hi', 0.45);
  sfx(S('C13'), 'swoosh_soft', 0.4); sfx(P('C13', 0.32), 'swoosh_soft', 0.45); sfx(P('C13', 0.62) + 0.1, 'bell_soft', 0.5); sfx(P('C13', 0.4), 'shimmer', 0.3);
  sfx(S('G03'), 'swell', 0.4); sfx(P('G03', 0.2), 'shimmer', 0.5); sfx(P('G03', 0.7), 'pluck', 0.4);
  // quiz
  sfx(S('C14') + 0.05, 'swell', 0.45); [0.45, 0.57, 0.69].forEach((f, i) => sfx(P('C14', f), ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.45));
  QB.forEach(q => { for (let k = 0; k < 3; k++) sfx(q.vo + k, 'count', 0.5); sfx(q.vo + 3, 'count_go', 0.45); });
  sfx(S('C16') + 0.1, 'soft_hit', 0.5); sfx(S('C16') + 0.15, 'check', 0.5);
  sfx(S('D04') + 0.1, 'swoosh_soft', 0.45); sfx(S('D04') + 0.9, 'check', 0.5);
  [0, 1, 2, 3].forEach(i => sfx(S('D05') + i * 0.28, ['marimba_lo', 'marimba', 'marimba_hi', 'marimba_hi'][i], 0.4)); sfx(S('D05') + 1.0, 'check', 0.55);
  // outro
  sfx(P('C19', 0.05), 'riser', 0.35); sfx(P('C19', 0.45) - 0.35, 'shimmer', 0.6); sfx(P('C19', 0.45) + 0.4, 'slam', 0.6); sfx(P('C19', 0.45) + 0.55, 'check', 0.5);
  sfx(S('C20') + 0.3, 'swell', 0.35); sfx(P('C20', 0.8), 'shimmer', 0.55); sfx(P('C20', 0.92), 'bell_soft', 0.45);
  sfx(E('C20') + 0.2, 'swoosh_soft', 0.5); sfx(E('C20') + 0.7, 'sparkle', 0.4);
})();
finalize();
