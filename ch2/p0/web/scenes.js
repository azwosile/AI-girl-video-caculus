// 第 2 章 P0《芝诺悖论：追不上的乌龟》（2026-10-27）：数学画面全部原创 Canvas 绘制；沿用共享内核 core.js / kit.js，画风对齐第 1 章。
// 版面：讲师占 x<540；主内容 x 600–1460（右侧客串在场时不超过 1360）；字幕区 y≥964 不放内容。
// 配色（制作规范 + 第 2 章补充）：时间 / 位置 = 青，路程 / 数值 / 极限值 = 金，函数曲线 = 红，割线 / 切线 = 紫，正确 = 绿；Grok 光点 = 青，大肥鱼光点 = 金。
const SC = {};
const TITLES = [['achilles', '阿喀琉斯追乌龟'], ['sum', '无穷多段，有限时间'], ['arrow', '飞矢不动'], ['velocity', '一小段 → 一瞬间'], ['tangent', '割线 → 切线'], ['outro', '0 ÷ 0 往哪儿去']];
SIDE.X = { x: 1760, h: 600 };   // Grok 客串位（kit.js 的 SIDE 没有 X，这里补上，不改共享内核）
const CR = COL.cream, RED = COL.f, GRN = COL.g, INV = COL.inv;
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));

// ---------- 通用小件 ----------
function seg(x0, y0, x1, y1, col, a = 1, w = 3, dash) {
  if (a <= 0) return; ctx.save(); if (dash) ctx.setLineDash(dash);
  glowPath(() => { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }, col, w, a); ctx.restore();
}
function arrowH(x0, x1, y, col, a = 1, w = 3.5) {
  if (a <= 0 || Math.abs(x1 - x0) < 2) return; const s = Math.sign(x1 - x0), hd = Math.min(16, Math.abs(x1 - x0) * 0.45);
  glowPath(() => { ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.moveTo(x1 - s * hd, y - hd * 0.6); ctx.lineTo(x1, y); ctx.lineTo(x1 - s * hd, y + hd * 0.6); }, col, w, a);
}
function label(text, x, y, size, col, a = 1, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `${o.bold ? 'bold ' : ''}${size}px ${o.font || F_FANCY}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = col; ctx.shadowBlur = o.glow ?? 8; ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore();
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
// 中文 + 公式同一行
function zhMath(zh, m, cx, y, size, cz, cm, t, t0, o = {}) {
  ctx.save(); ctx.font = `bold ${size}px ${F_FANCY}`; const wz = ctx.measureText(zh).width; ctx.restore();
  const ms = size * 1.12, wm = mathW(m, ms), gap = 18, x0 = cx - (wz + gap + wm) / 2;
  glowText(zh, x0, y, size, cz, t, t0, { align: 'left', out: o.out });
  glowMath(m, x0 + wz + gap, y + ms * 0.34, ms, cm, t, t0 + 0.12, { out: o.out, upright: o.upright });
}
function typedSegs(t, segs, x, y, t0, dur, sz) {
  const tot = segs.reduce((s, [str]) => s + str.length, 0), n = Math.floor(clamp((t - t0) / dur) * tot); let k = 0, cx = x;
  ctx.save(); ctx.font = `${sz}px ${F_CODE}`; ctx.textBaseline = 'middle';
  segs.forEach(([str, col]) => { const w = ctx.measureText(str).width; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6; ctx.fillText(str.slice(0, Math.max(0, n - k)), cx, y); cx += w; k += str.length; });
  if (n < tot && t > t0 && Math.floor(t * 3) % 2 === 0) { ctx.fillStyle = CR; ctx.fillRect(x + ctx.measureText(segs.map(s => s[0]).join('').slice(0, n)).width + 2, y - sz * 0.5, 3, sz); }
  ctx.restore();
}
// 水平括线（区间长度）：两端短竖线 + 中间标注
function bracket(x0, x1, y, col, a, text, o = {}) {
  if (a <= 0 || x1 - x0 < 2) return;
  const h = o.h ?? 12;
  glowPath(() => { ctx.moveTo(x0, y - h); ctx.lineTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1, y - h); }, col, 2.4, a);
  if (text && x1 - x0 > (o.minW ?? 40)) label(text, (x0 + x1) / 2, y + 26, o.size || 26, col, a, { font: F_MATH });
}
// 小鲸鱼图标（大肥鱼的光点）
function whale(x, y, s, col, a = 1, t = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(0, 0, 22, 13, 0, 0, 7); ctx.fill();
  const wag = Math.sin(t * 8) * 0.25; ctx.save(); ctx.translate(-20, -2); ctx.rotate(wag);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-14, -11); ctx.lineTo(-10, 0); ctx.lineTo(-14, 10); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.shadowBlur = 0; ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(10, -3, 2.6, 0, 7); ctx.fill();
  ctx.restore();
}
// 箭（飞矢）
function drawArrow(x, y, len, col, a = 1) {
  if (a <= 0) return;
  glowPath(() => { ctx.moveTo(x - len, y); ctx.lineTo(x - 14, y); }, col, 3.2, a);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(x + 6, y); ctx.lineTo(x - 18, y - 11); ctx.lineTo(x - 13, y); ctx.lineTo(x - 18, y + 11); ctx.closePath(); ctx.fill();
  ctx.fillStyle = hexA(col, 0.8);
  [0, 14].forEach(d => { ctx.beginPath(); ctx.moveTo(x - len + d, y); ctx.lineTo(x - len + d - 14, y - 12); ctx.lineTo(x - len + d - 6, y); ctx.lineTo(x - len + d - 14, y + 12); ctx.closePath(); ctx.fill(); });
  ctx.restore();
}
// ---------- 独立 x / y 比例的坐标系（同第 1 章 P3/P5） ----------
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
  if (o.xl) mathText(o.xl, X1 + 10, oy + 34, 28, o.xc || CYAN, { glow: 8 });
  if (o.yl) mathText(o.yl, ox + 14, Y0 - 4, 28, o.yc || GOLD, { glow: 8 });
  ctx.restore();
}
function gClip(G) { ctx.beginPath(); ctx.rect(gx(G, G.x0) - 6, gy(G, G.y1) - 6, (G.x1 - G.x0) * G.ux + 12, (G.y1 - G.y0) * G.uy + 12); ctx.clip(); }
function gPlot(G, f, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  const xa = o.xa ?? G.x0, xb = lerp(xa, o.xb ?? G.x1, p), n = 240, pts = [];
  for (let i = 0; i <= n; i++) { const x = xa + (xb - xa) * i / n, y = f(x); if (isFinite(y)) pts.push([gx(G, x), gy(G, clamp(y, G.y0 - 2, G.y1 + 2))]); }
  ctx.save(); gClip(G); if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, o.w || 4.5, a); ctx.restore();
  if (p < 1 && !o.noHead) { const y = f(xb); if (y > G.y0 && y < G.y1) glowDot(gx(G, xb), gy(G, y), 7, col, a); }
}

// ======================= achilles（A41 上：追赶，每段放大十倍） =======================
// D01 标题 → K01 书名 → C01 跑道：Grok 0 m（10 m/s），大肥鱼 100 m（1 m/s）→ C02 第一段 → C03 第二、三、四段，镜头十倍十倍放大 → X02 定格抖动
const TRK = { y: 610, x0: 640, x1: 1440 };
const RUNS = [   // [t0, t1, Grok 起, Grok 止, 鱼 起, 鱼 止, 段长标注, 用时标注]
  [P('C02', 0.12), P('C02', 0.52), 0, 100, 100, 110, '100 m', '10 s'],
  [P('C03', 0.06), P('C03', 0.32), 100, 110, 110, 111, '10 m', '1 s'],
  [P('C03', 0.47), P('C03', 0.62), 110, 111, 111, 111.1, '1 m', '0.1 s'],
  [P('C03', 0.70), P('C03', 0.82), 111, 111.1, 111.1, 111.11, '0.1 m', '0.01 s'],
];
function racePos(t) {
  let g = 0, f = 100, mv = 0;
  RUNS.forEach(([t0, t1, g0, g1, f0, f1]) => { if (t < t0) return; const q = clamp((t - t0) / (t1 - t0)); g = lerp(g0, g1, q); f = lerp(f0, f1, q); if (q > 0 && q < 1) mv = 1; });
  return { g, f, mv };
}
function raceView(t) {   // 视窗中心 c、宽度 w（米）：宽度按对数插值，每段放大约十倍
  const z0 = S('C03') - 0.35;
  const c = kf(t, 55, [[z0, 105.5, 0.7], [P('C03', 0.38), 110.6, 0.6], [P('C03', 0.64), 111.06, 0.5]]);
  const lw = kf(t, Math.log(124), [[z0, Math.log(15), 0.7], [P('C03', 0.38), Math.log(1.9), 0.6], [P('C03', 0.64), Math.log(0.23), 0.5]]);
  return { c, w: Math.exp(lw) };
}
const mX = (V, m) => 1040 + (m - V.c) / V.w * (TRK.x1 - TRK.x0);
function niceStep(w) { const r = w / 5, p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m < 1.6 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
function fmtM(v, st) { const d = Math.max(0, -Math.floor(Math.log10(st) + 1e-9)); return v.toFixed(d); }
function drawTrack(t, a) {
  if (a <= 0) return; const V = raceView(t), y = TRK.y;
  ctx.save(); ctx.globalAlpha *= a;
  glowPath(() => { ctx.moveTo(TRK.x0 - 20, y); ctx.lineTo(TRK.x1 + 20, y); }, CR, 2.2, 0.55);
  ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.beginPath(); ctx.moveTo(TRK.x1 + 34, y); ctx.lineTo(TRK.x1 + 20, y - 7); ctx.lineTo(TRK.x1 + 20, y + 7); ctx.fill();
  const st = niceStep(V.w), lo = Math.ceil((V.c - V.w * 0.56) / st), hi = Math.floor((V.c + V.w * 0.56) / st);
  ctx.font = `22px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let i = lo; i <= hi; i++) {
    const v = i * st, X = mX(V, v); if (X < TRK.x0 - 10 || X > TRK.x1 + 10) continue;
    const ed = Math.min(1, (X - TRK.x0 + 10) / 40, (TRK.x1 + 10 - X) / 40);
    ctx.globalAlpha = a * ed; ctx.fillStyle = 'rgba(237,230,216,0.55)'; ctx.fillRect(X - 1, y - 6, 2, 12);
    ctx.fillStyle = hexA(CYAN, 0.75); ctx.fillText(fmtM(v, st), X, y + 12);
  }
  ctx.globalAlpha = a; mathText('m', TRK.x1 + 30, y + 34, 24, hexA(CYAN, 0.75), {});
  ctx.restore();
}
function drawRunners(t, a) {
  if (a <= 0) return; const V = raceView(t), y = TRK.y, { g, f, mv } = racePos(t);
  const ag = a * ap(t, 'C01', 0.22, 0.35), af = a * ap(t, 'C01', 0.55, 0.35);
  ctx.save(); ctx.beginPath(); ctx.rect(TRK.x0 - 30, 300, TRK.x1 - TRK.x0 + 60, 520); ctx.clip();
  // 乌龟（大肥鱼）在每段开始时的位置：金色虚线标记
  RUNS.forEach(([t0, , , g1], k) => { const al = eOut(prog(t, t0 - 0.2, 0.3)); if (al <= 0) return; const X = mX(V, g1); seg(X, y - 70, X, y + 18, GOLD, 0.45 * al * a, 2, [6, 6]); if (!k) label('大肥鱼起点', X, y - 116, 22, GOLD, 0.7 * al * a * fadeOut(t, S('C03') - 0.3)); });
  // 本段括线：Grok 起点 → 乌龟当时位置
  RUNS.forEach(([t0, t1, g0, g1, , , dl], k) => { const al = eOut(prog(t, t0, 0.3)) * (k === RUNS.length - 1 ? 1 : fadeOut(t, RUNS[k + 1][0] + 0.4, 0.4)); bracket(mX(V, g0), mX(V, g1), y + 66, GOLD, al * a, dl); });
  // C01 领先 100 m
  bracket(mX(V, 0), mX(V, 100), y + 66, GOLD, a * ap(t, 'C01', 0.62) * fadeOut(t, S('C02') + 0.1), '领先 100 m', { size: 28 });
  // Grok：青色光点 + 火焰拖尾
  const gX = mX(V, g), fX = mX(V, f);
  if (ag > 0) {
    const flame = mv ? 1 : (t > S('X01') && t < P('C02', 0.12)) ? 0.55 + 0.25 * Math.sin(t * 30) : 0;
    for (let i = 8; i >= 1 && flame > 0; i--) glowDot(gX - i * 11 - Math.sin(t * 40 + i) * 2, y + Math.sin(t * 33 + i * 1.7) * 3, 12 * (1 - i / 10), i < 4 ? GOLD : RED, ag * flame * (1 - i / 9) * 0.6);
    glowDot(gX, y, 13, CYAN, ag);
    label('Grok', gX, y - 40, 26, CYAN, ag, { bold: true });
    label('10 m/s', gX - 40, y - 40, 22, CYAN, ag * 0.8 * fadeOut(t, S('C03')), { font: F_MATH, align: 'right' });
  }
  if (af > 0) {
    const bob = t > S('D02') && t < E('D02') ? Math.abs(Math.sin((t - S('D02')) * 9)) * 10 : 0;
    whale(fX, y - 6 - bob, 1, GOLD, af, t);
    label('大肥鱼', fX, y - 78 - bob, 26, GOLD, af, { bold: true });
    label('1 m/s', fX + 50, y - 78, 22, GOLD, af * 0.8 * fadeOut(t, S('C03')), { font: F_MATH, align: 'left' });
  }
  ctx.restore();
}
SC.achilles = t => {
  starfield(t); blueprint(0.5, 80);
  const [sx, sy] = shake(t, S('X02') + 0.05, 9, 0.55);
  ctx.save(); ctx.translate(sx, sy);
  // D01：标题
  if (t < S('C01') + 0.6) {
    kinetic('阿喀琉斯', 830, 330, 64, t, P('D01', 0.15), { col: CYAN, out: S('C01') + 0.1 });
    kinetic('追得上', 1040, 330, 44, t, P('D01', 0.4), { col: CR, out: S('C01') + 0.1 });
    kinetic('乌龟吗？', 1250, 330, 64, t, P('D01', 0.6), { col: GOLD, out: S('C01') + 0.1 });
  }
  // K01：出处
  if (t > S('K01') - 0.1 && t < S('C01') + 0.6) {
    const a = ap(t, 'K01', 0.05, 0.4) * fadeOut(t, S('C01') + 0.05);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(1040, 470);   // 打开的书
    ctx.fillStyle = 'rgba(237,230,216,0.10)'; ctx.strokeStyle = hexA(GOLD, 0.9); ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(0, -38); ctx.quadraticCurveTo(-60, -52, -120, -40); ctx.lineTo(-120, 40); ctx.quadraticCurveTo(-60, 28, 0, 42); ctx.quadraticCurveTo(60, 28, 120, 40); ctx.lineTo(120, -40); ctx.quadraticCurveTo(60, -52, 0, -38); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -38); ctx.lineTo(0, 42); ctx.stroke();
    ctx.restore();
    glowText('亚里士多德《物理学》第六卷', 1040, 570, 40, GOLD, t, P('K01', 0.4), { out: S('C01') + 0.05 });
    glowText('芝诺 · 约公元前 490 — 前 430', 1040, 630, 30, CYAN, t, P('K01', 0.55), { bold: false, out: S('C01') + 0.05 });
  }
  // 跑道与选手
  const ta = ap(t, 'C01', 0.0, 0.5);
  drawTrack(t, ta); drawRunners(t, ta);
  // 每段用时芯片
  if (t > RUNS[0][0]) {
    label('每段用时', 700, 300, 30, CR, ap(t, 'C02', 0.15), { align: 'center' });
    RUNS.forEach(([t0, , , , , , , tl], k) => { const p = eBack(prog(t, t0 + 0.1, 0.35)); if (p <= 0) return; const x = 850 + k * 140; ctx.save(); ctx.translate(x, 300); ctx.scale(p, p); ctx.fillStyle = 'rgba(12,18,38,0.85)'; ctx.strokeStyle = CYAN; ctx.lineWidth = 2; ctx.shadowColor = CYAN; ctx.shadowBlur = 12; rr(-58, -26, 116, 52, 12); ctx.fill(); ctx.stroke(); ctx.restore(); label(tl, x, 302, 28, CYAN, clamp(p), { font: F_MATH }); if (k) label('+', x - 70, 302, 28, CR, clamp(p)); });
    const pd = ap(t, 'C03', 0.86, 0.3); if (pd > 0) { label('+', 1340, 302, 28, CR, pd); label('……', 1395, 300, 34, CR, pd * (0.6 + 0.4 * Math.sin(t * 6))); }
  }
  // C03 末：前面总还有下一段
  glowText('每追上一段，前面总还有下一段', 1040, 840, 34, CR, t, P('C03', 0.84), { out: S('X02') });
  // X02：定格 + 无穷多段？！
  if (t > S('X02')) {
    focusLines(t, 0.5 * ap(t, 'X02', 0, 0.2) * fadeOut(t, E('X02') + 0.3), 1040, TRK.y);
    kinetic('无穷多段？！', 1040, 830, 62, t, P('X02', 0.05), { col: RED });
  }
  ctx.restore();
};

// ======================= sum（A41 下：无穷多段的时间加起来） =======================
// C04 时间条：10、1、0.1、0.01 依次拼接（下方放大镜头）→ C05 部分和 → 100/9 金线 → G01 两条位移–时间直线交于 100/9 → X03 追上 → C06 极限
const BAR = { x0: 660, y: 400, k: 760 / (100 / 9) }, ZB = { x0: 660, y: 560, a: 9.8, b: 11.3 };
ZB.k = 760 / (ZB.b - ZB.a);
const SUMS = ['10', '11', '11.1', '11.11', '11.111'];
const blockT = i => i < 4 ? P('C04', 0.14 + 0.17 * i) : P('C04', 0.82) + 0.06 * (i - 4);
function timeBlocks(t, x0, y, k, from, a, o = {}) {
  let s = 0;
  for (let i = 0; i < 12; i++) {
    const d = 10 * Math.pow(0.1, i), p = eOut(prog(t, blockT(i), 0.3));
    const xa = x0 + (s - from) * k, w = d * k * p; s += d;
    if (p <= 0) continue; if (xa > o.clipR) continue;
    const ww = Math.min(w, o.clipR - xa);
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = hexA(CYAN, i % 2 ? 0.28 : 0.5); ctx.fillRect(xa, y - 22, Math.max(ww, 0.8), 44);
    ctx.strokeStyle = hexA(CYAN, 0.9); ctx.lineWidth = 1.5; if (ww > 3) ctx.strokeRect(xa, y - 22, ww, 44);
    ctx.restore();
    if (o.labels && o.labels[i] && p > 0.5) { const cx = xa + d * k / 2, big = d * k > 60, dx = big ? 0 : (o.dx && o.dx[i]) || 0, la = a * eOut(prog(t, blockT(i) + 0.15, 0.25)); label(o.labels[i], cx + dx, big ? y : y - 56, 28, CR, la, { font: F_MATH }); if (!big) seg(cx, y - 24, cx + dx, y - 40, CR, 0.5 * la, 1.5); }
  }
}
const GS = { cx: 690, cy: 860, ux: 46, uy: 4.1, x0: 0, x1: 14, y0: 0, y1: 150 };
const TM = 100 / 9;
SC.sum = t => {
  starfield(t); blueprint(0.45, 80);
  const aBar = fadeOut(t, S('G01') - 0.05, 0.4);
  if (aBar > 0) {
    glowMath('10 + 1 + 0.1 + 0.01 + …', 1040, 270, 54, CR, t, P('C04', 0.1), { align: 'center', alpha: aBar, upright: true });
    timeBlocks(t, BAR.x0, BAR.y, BAR.k, 0, aBar, { clipR: 1500, labels: { 0: '10', 1: '1' } });
    label('秒', BAR.x0 - 22, BAR.y, 26, CYAN, 0.8 * aBar * ap(t, 'C04', 0.1));
    // 放大镜头
    const za = aBar * ap(t, 'C04', 0.42, 0.45);
    if (za > 0) {
      const xa = BAR.x0 + ZB.a * BAR.k, xb = BAR.x0 + ZB.b * BAR.k;
      ctx.save(); ctx.globalAlpha *= za; ctx.strokeStyle = hexA(CR, 0.5); ctx.setLineDash([5, 6]); ctx.lineWidth = 1.5;
      ctx.strokeRect(xa, BAR.y - 30, xb - xa, 60);
      ctx.beginPath(); ctx.moveTo(xa, BAR.y + 30); ctx.lineTo(ZB.x0, ZB.y - 32); ctx.moveTo(xb, BAR.y + 30); ctx.lineTo(ZB.x0 + 760, ZB.y - 32); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(ZB.x0, ZB.y - 80, 760, 140); ctx.clip();
      timeBlocks(t, ZB.x0, ZB.y, ZB.k, ZB.a, za, { clipR: ZB.x0 + 760, labels: { 1: '1', 2: '0.1', 3: '0.01' }, dx: { 2: -10, 3: 56 } });
      ctx.restore();
      label('放大看末尾', ZB.x0 + 760 + 16, ZB.y, 24, CR, 0.7 * za, { align: 'left' });
    }
    // 100/9 金色刻线（两处）
    const la = aBar * ap(t, 'C05', 0.55, 0.4);
    if (la > 0) {
      const x1 = BAR.x0 + TM * BAR.k, x2 = ZB.x0 + (TM - ZB.a) * ZB.k;
      seg(x1, BAR.y - 44, x1, BAR.y + 30, GOLD, la, 3); seg(x2, ZB.y - 40, x2, ZB.y + 40, GOLD, la, 3);
      mathText('100/9', x1, BAR.y - 54, 28, GOLD, { align: 'center', glow: 10, alpha: la, upright: true });
    }
    // C05：部分和
    let sx0 = 660; SUMS.forEach((s, i) => { const w = mathW(s, 36), t0 = P('C05', 0.04 + i * 0.08), a = eOut(prog(t, t0, 0.3)) * aBar; if (a > 0) { mathText(s, sx0, 735, 36, GOLD, { glow: 10, alpha: a, upright: true }); if (i) arrowH(sx0 - 54, sx0 - 14, 723, CR, 0.6 * a, 2.5); } sx0 += w + 70; });
    if (t > P('C05', 0.42)) { const a = ap(t, 'C05', 0.42) * aBar; arrowH(sx0 - 54, sx0 - 14, 723, CR, 0.6 * a, 2.5); label('…', sx0 + 14, 728, 36, CR, a); }
    label('部分和', 640, 690, 26, CR, 0.75 * ap(t, 'C05', 0.02) * aBar, { align: 'left' });
    if (t > P('C05', 0.55)) richReveal([['和', CR], [' → ', CR], ['100/9 ≈ 11.11 秒', GOLD]], 1040, 850, 48, t, P('C05', 0.6), { alpha: aBar, upright: true });
  }
  // G01：位移–时间图
  const ga = ap(t, 'G01', 0.0, 0.45) * (1 - 0.88 * ap(t, 'C06', 0.0, 0.5));
  if (ga > 0) {
    gAxes(GS, ga, { gx: 1, gy: 10, ticks: { x: [[5, '5'], [10, '10']], y: [[50, '50'], [100, '100']] }, xl: 't / s', yl: 's / m' });
    const pl = prog(t, P('G01', 0.08), Math.max(1.2, D('G01') * 0.4));
    gPlot(GS, x => 10 * x, CYAN, { p: pl, a: ga, xb: 13.5, w: 4 });
    gPlot(GS, x => 100 + x, GOLD, { p: pl, a: ga, xb: 13.5, w: 4 });
    mathText('s = 10t', gx(GS, 12.6), gy(GS, 140), 30, CYAN, { align: 'right', glow: 10, alpha: ga * clamp(pl * 2 - 1) });
    mathText('s = 100 + t', gx(GS, 4.0), gy(GS, 116), 30, GOLD, { align: 'center', glow: 10, alpha: ga * clamp(pl * 2 - 1), upright: false });
    label('Grok', gx(GS, 13.2), gy(GS, 126), 22, CYAN, ga * clamp(pl * 2 - 1), { align: 'left' });
    label('大肥鱼', gx(GS, 13.2), gy(GS, 105), 22, GOLD, ga * clamp(pl * 2 - 1), { align: 'left' });
    const ia = ga * ap(t, 'G01', 0.55, 0.35);
    if (ia > 0) {
      const X = gx(GS, TM), Y = gy(GS, 100 + TM);
      seg(X, Y, X, gy(GS, 0), CR, 0.5 * ia, 2, [6, 6]);
      glowDot(X, Y, 10, GRN, ia); mathText('100/9', X, gy(GS, 0) + 66, 28, GOLD, { align: 'center', glow: 10, alpha: ia, upright: true });
    }
    richReveal([['100 ÷ (10 − 1) = ', CR], ['100/9', GOLD], [' 秒', CR]], 1010, 200, 44, t, P('G01', 0.45), { out: S('C06') + 0.1, upright: true });
    if (t > S('X03')) { kinetic('追上！', gx(GS, TM) - 90, gy(GS, 100 + TM) - 60, 46, t, P('X03', 0.05), { col: GRN, out: S('C06') }); burst(t, P('X03', 0.08), gx(GS, TM), gy(GS, 100 + TM), GRN, 90, 16); }
  }
  // C06：极限
  if (t > S('C06') - 0.1) {
    glowText('无穷多步  →  有限时间', 1040, 420, 54, CR, t, P('C06', 0.05));
    termCard('limit', '极限', 1040, 580, t, P('C06', 0.62));
    glowText('越来越接近一个确定的数', 1040, 730, 36, GOLD, t, P('C06', 0.5));
  }
};

// ======================= arrow（A42 上：飞矢不动） =======================
// K02 箭飞过 → 每一瞬间的定格残影 → C07 放大一个瞬间：0 米 ÷ 0 秒 → G02 代码窗 0/0 = NaN
const AR = { y: 430, xs: [700, 860, 1020, 1180, 1340] };
const CWN = { x: 650, y: 300, w: 690, h: 300 };
SC.arrow = t => {
  starfield(t); blueprint(0.5, 80);
  const aA = fadeOut(t, S('G02') - 0.05, 0.4);
  if (aA > 0) {
    // 时间轴
    const axA = ap(t, 'K02', 0.4) * aA;
    if (axA > 0) { seg(640, 560, 1420, 560, CR, 0.5 * axA, 2); AR.xs.forEach((x, i) => { const a = eOut(prog(t, P('K02', 0.45 + 0.07 * i), 0.25)) * aA; if (a <= 0) return; seg(x, 552, x, 568, CYAN, a, 2); mathText(`t_${i + 1}`, x, 600, 28, CYAN, { align: 'center', glow: 8, alpha: a }); }); mathText('t', 1440, 570, 28, CYAN, { glow: 8, alpha: axA }); }
    // 飞行
    const fp = prog(t, P('K02', 0.05), Math.max(0.9, D('K02') * 0.3));
    if (fp > 0 && fp < 1) ghosts(t, (tt, al) => { const q = eIO(prog(tt, P('K02', 0.05), Math.max(0.9, D('K02') * 0.3))); drawArrow(lerp(560, 1420, q), AR.y, 150, CR, al * aA); }, 5, 0.025);
    // 定格残影
    const focus = ap(t, 'C07', 0.0, 0.5);
    AR.xs.forEach((x, i) => {
      const a = eOut(prog(t, P('K02', 0.45 + 0.07 * i), 0.25)) * aA * (i === 2 ? 1 : 1 - 0.8 * focus); if (a <= 0) return;
      drawArrow(x + 60, AR.y, 130, CR, a * (i === 2 ? 1 : 0.55));
      seg(x, AR.y + 30, x, 545, CYAN, 0.35 * a, 1.5, [4, 5]);
    });
    glowText('每一瞬间：都停在一个位置', 1030, 300, 40, GOLD, t, P('K02', 0.5), { out: S('C07') });
    glowText('所以箭根本没在动？', 1030, 690, 38, RED, t, P('K02', 0.78), { out: S('C07') });
    // C07：放大一个瞬间
    if (focus > 0) {
      const R = 150 * eBack(focus);
      ctx.save(); ctx.globalAlpha *= aA; ring2(1050, AR.y, R, CYAN, focus); ctx.restore();
      label('走了 0 米', 820, 690, 36, GOLD, ap(t, 'C07', 0.3) * aA, { bold: true });
      label('用了 0 秒', 1260, 690, 36, CYAN, ap(t, 'C07', 0.45) * aA, { bold: true });
      richReveal([['0 m', GOLD], [' ÷ ', CR], ['0 s', CYAN], [' = ?', RED]], 1040, 820, 60, t, P('C07', 0.65), { alpha: aA, upright: true });
    }
  }
  // G02：代码窗
  const cw = eBack(prog(t, S('G02') + 0.02, 0.4));
  if (cw > 0) {
    const a = clamp(cw), { x, y, w, h } = CWN;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(lerp(0.92, 1, a), lerp(0.92, 1, a)); ctx.translate(-x - w / 2, -y - h / 2); ctx.globalAlpha *= a;
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(9,14,32,0.9)'; rr(x, y, w, h, 16); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = hexA(CYAN, 0.55); ctx.lineWidth = 2; rr(x, y, w, h, 16); ctx.stroke();
    ctx.fillStyle = 'rgba(237,230,216,0.06)'; rr(x, y, w, 46, 16); ctx.fill();
    [RED, GOLD, GRN].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 28 + i * 24, y + 23, 7, 0, 7); ctx.fill(); });
    ctx.font = `20px ${F_CODE}`; ctx.fillStyle = 'rgba(237,230,216,0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('console', x + w / 2, y + 23);
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= a;
    typedSegs(t, [['// 一瞬间的速度 = 位移 ÷ 时间', 'rgba(237,230,216,0.45)']], x + 40, y + 100, S('G02') + 0.1, 0.5, 26);
    typedSegs(t, [['> ', 'rgba(237,230,216,0.5)'], ['0 / 0', CR]], x + 40, y + 170, P('G02', 0.18), 0.35, 40);
    if (t > P('G02', 0.4)) {
      const [jx, jy] = shake(t, P('G02', 0.4), 7, 0.5), sc = lerp(1.6, 1, eOut(prog(t, P('G02', 0.4), 0.3)));
      ctx.save(); ctx.translate(x + 120 + jx, y + 240 + jy); ctx.scale(sc, sc); ctx.font = `bold 52px ${F_CODE}`; ctx.textBaseline = 'middle'; ctx.fillStyle = RED; ctx.shadowColor = RED; ctx.shadowBlur = 18; ctx.fillText('NaN', -40, 0); ctx.restore();
    }
    ctx.restore();
    glowText('NaN = Not a Number：不是一个数', 995, 690, 38, RED, t, P('G02', 0.6));
    crossMark(1000, 810, 60, RED, t, P('G02', 0.75));
    glowText('一瞬间，算不出速度', 1000, 900, 32, CR, t, P('G02', 0.8));
  }
};
function ring2(x, y, r, col, a) { if (a <= 0 || r <= 0) return; glowPath(() => ctx.arc(x, y, r, 0, 7), col, 3, a); }

// ======================= velocity（A42 下：一小段的平均速度 → 一瞬间） =======================
// C08 s = 5t²，区间 [1, 1 + h] 阴影 + 割线 → C09 h = 0.1、0.01、0.001，表格逐行 → D03 → 10 → C10 瞬时速度 10 m/s，箭重新飞起 → K03 时间线
const GV = { cx: 680, cy: 860, ux: 300, uy: 42, x0: 0, x1: 1.6, y0: 0, y1: 13 };
const HS = [[0.1, '0.1', '10.5'], [0.01, '0.01', '10.05'], [0.001, '0.001', '10.005']];
const hT = i => P('C09', [0.06, 0.4, 0.7][i]);
function curH(t) { return Math.exp(kf(t, Math.log(0.5), HS.map((r, i) => [hT(i), Math.log(r[0]), 0.6]))); }
SC.velocity = t => {
  starfield(t); blueprint(0.5, 80);
  const dim = 1 - 0.92 * ap(t, 'K03', 0.0, 0.5);
  const ga = ap(t, 'C08', 0.25, 0.5) * dim;
  richReveal([['路程  ', CR], ['s', GOLD], [' = 5', CR], ['t', CYAN], ['^2', CYAN]], 920, 250, 50, t, P('C08', 0.45), { alpha: dim, out: S('C10') });
  label('（取 g = 10 m/s²）', 1180, 245, 22, CR, 0.6 * ap(t, 'C08', 0.6) * dim * fadeOut(t, S('C10')), { align: 'left', font: F_BODY });
  if (ga > 0) {
    gAxes(GV, ga, { gx: 0.2, gy: 1, ticks: { x: [[1, '1']], y: [[5, '5'], [10, '10']] }, xl: 't', yl: 's' });
    gPlot(GV, x => 5 * x * x, RED, { p: prog(t, P('C08', 0.3), 0.9), a: ga, xb: 1.6 });
    const ha = ap(t, 'C08', 0.7, 0.4) * dim;
    if (ha > 0) {
      const h = curH(t), x1 = 1 + h, y1 = 5 * x1 * x1, m = (y1 - 5) / h;
      ctx.save(); ctx.globalAlpha *= ha; ctx.fillStyle = hexA(CYAN, 0.16); ctx.fillRect(gx(GV, 1), gy(GV, GV.y1), Math.max(1.5, h * GV.ux), GV.y1 * GV.uy); ctx.restore();
      ctx.save(); gClip(GV); seg(gx(GV, 0.45), gy(GV, 5 + m * (0.45 - 1)), gx(GV, 1.55), gy(GV, 5 + m * 0.55), INV, ha, 3); ctx.restore();
      glowDot(gx(GV, 1), gy(GV, 5), 8, GOLD, ha); glowDot(gx(GV, x1), gy(GV, y1), 7, GOLD, ha);
      bracket(gx(GV, 1), gx(GV, x1), gy(GV, 0) + 34, CYAN, ha * (h > 0.05 ? 1 : 0.6), null);
      mathText('h', gx(GV, 1) + Math.max(10, h * GV.ux / 2), gy(GV, 0) + 64, 28, CYAN, { align: 'center', glow: 8, alpha: ha });
    }
  }
  // 表格
  const ta = ap(t, 'C09', 0.0, 0.4) * dim;
  if (ta > 0) {
    const cx1 = 1235, cx2 = 1385;
    mathText('h', cx1, 345, 34, CYAN, { align: 'center', glow: 8, alpha: ta }); label('平均速度', cx2, 333, 30, GOLD, ta, { bold: true });
    seg(1160, 368, 1460, 368, CR, 0.45 * ta, 1.5);
    HS.forEach(([, hs, vs], i) => { const a = eOut(prog(t, hT(i) + 0.15, 0.3)) * dim; if (a <= 0) return; const y = 420 + i * 66; mathText(hs, cx1, y, 34, CYAN, { align: 'center', glow: 8, alpha: a, upright: true }); mathText(vs, cx2, y, 34, GOLD, { align: 'center', glow: 10, alpha: a, upright: true }); });
    const da = ap(t, 'D03', 0.1) * dim;
    if (da > 0) { richReveal([['→ ', CR], ['10', GOLD]], 1385, 640, 50, t, P('D03', 0.1), { alpha: dim, upright: true }); sparks(t, P('D03', 0.3), 1410, 625, { col: [GOLD, '#ffffff'], n: 14, speed: 260 }); }
    if (t > P('C10', 0.1)) richReveal([['平均速度 = 10 + 5', CR], ['h', CYAN]], 1300, 720, 32, t, P('C10', 0.1), { alpha: dim, upright: true });
  }
  // C10：瞬时速度 + 箭重新飞起
  if (t > S('C10')) {
    const ca = dim;
    ctx.save(); ctx.globalAlpha *= ca; zhMath('第 1 秒的瞬时速度', 'v = 10 m/s', 1040, 250, 40, CR, GOLD, t, P('C10', 0.3), { upright: true }); ctx.restore();
    const fp = prog(t, P('C10', 0.62), Math.max(1.0, D('C10') * 0.32));
    if (fp > 0 && fp < 1) ghosts(t, (tt, al) => { const q = eIO(prog(tt, P('C10', 0.62), Math.max(1.0, D('C10') * 0.32))); drawArrow(lerp(600, 1440, q), 180, 140, CR, al * ca); label('v = 10 m/s', lerp(600, 1440, q) - 70, 145, 24, GOLD, al * ca, { font: F_MATH }); }, 5, 0.025);
  }
  // K03：两千年的时间线
  const ka = ap(t, 'K03', 0.1, 0.5);
  if (ka > 0) {
    const y = 520; glowPath(() => { ctx.moveTo(680, y); ctx.lineTo(680 + 640 * eOut(prog(t, P('K03', 0.1), 0.8)), y); }, CR, 2.5, 0.7 * ka);
    glowDot(700, y, 10, CYAN, ka); label('芝诺', 700, y - 46, 34, CYAN, ka, { bold: true }); label('公元前 5 世纪', 700, y + 44, 24, CR, ka);
    const kb = ap(t, 'K03', 0.55, 0.4); glowDot(1300, y, 10, GOLD, kb); label('柯西、魏尔斯特拉斯', 1300, y - 46, 30, GOLD, kb, { bold: true }); label('19 世纪：极限的严格定义', 1300, y + 44, 24, CR, kb);
    label('两千多年', 1000, y - 30, 30, CR, ap(t, 'K03', 0.4), { bold: true });
  }
};

// ======================= tangent（A43：割线转成切线） =======================
// C11 y = x²，P(1, 1)，Q(2, 4)，割线 → C12 Q 滑向 P，斜率 3 → 2.5 → 2.1 → 2.01 → C13 切线 y = 2x − 1
const GT = { cx: 900, cy: 800, ux: 190, uy: 120, x0: -0.6, x1: 2.4, y0: -0.5, y1: 4.6 };
const QS = [[2, '3'], [1.5, '2.5'], [1.1, '2.1'], [1.01, '2.01']];
const qT = i => i ? P('C12', [0, 0.2, 0.4, 0.58][i]) : P('C11', 0.6);
function curQ(t) { return kf(t, 2, [[qT(1), 1.5, 0.6], [qT(2), 1.1, 0.6], [qT(3), 1.01, 0.5], [P('C13', 0.05), 1.0, 0.7]]); }
SC.tangent = t => {
  starfield(t); blueprint(0.5, 80);
  const ga = ap(t, 'C11', 0.05, 0.5);
  gAxes(GT, ga, { ticks: { x: [[1, '1'], [2, '2']], y: [[1, '1'], [2, '2'], [3, '3'], [4, '4']] } });
  gPlot(GT, x => x * x, RED, { p: prog(t, P('C11', 0.1), 0.9), a: ga });
  mathText('y = x^2', gx(GT, -0.55), gy(GT, 2.6), 40, RED, { glow: 10, alpha: ap(t, 'C11', 0.3) });
  const pa = ap(t, 'C11', 0.35);
  const q = curQ(t), qa = ap(t, 'C11', 0.6), tg = ap(t, 'C13', 0.15, 0.6);
  if (qa > 0) {
    const m = q === 1 ? 2 : (q * q - 1) / (q - 1), mm = lerp(m, 2, tg);
    ctx.save(); gClip(GT); seg(gx(GT, -0.6), gy(GT, 1 + mm * (-1.6)), gx(GT, 2.4), gy(GT, 1 + mm * 1.4), INV, qa, 3 + 2 * tg); ctx.restore();
    if (q > 1.004) { glowDot(gx(GT, q), gy(GT, q * q), 9, CYAN, qa * (1 - tg)); label('Q', gx(GT, q) + 26, gy(GT, q * q) + 4, 30, CYAN, qa * (1 - tg) * clamp((q - 1) * 20), { font: F_MATH }); }
    // 斜率读数
    ctx.save(); ctx.globalAlpha *= qa; ctx.fillStyle = 'rgba(12,18,38,0.8)'; ctx.strokeStyle = hexA(INV, 0.7); ctx.lineWidth = 2; rr(600, 250, 280, 80, 12); ctx.fill(); ctx.stroke(); ctx.restore();
    label('割线斜率', 670, 290, 26, INV, qa, { bold: true });
    mathText(mm.toFixed(mm > 2.05 ? 2 : 3).replace(/0+$/, '').replace(/\.$/, ''), 862, 302, 40, INV, { align: 'right', glow: 10, alpha: qa, upright: true });
  }
  glowDot(gx(GT, 1), gy(GT, 1), 9, GOLD, pa); label('P(1, 1)', gx(GT, 1) + 66, gy(GT, 1) + 30, 28, GOLD, pa, { font: F_MATH });
  // 斜率序列
  let qx = 1000; QS.forEach(([, s], i) => { const w = mathW(s, 36), t0 = i ? qT(i) + 0.45 : P('C12', 0.08), a = eOut(prog(t, t0, 0.3)); if (a > 0) { mathText(s, qx, 205, 36, INV, { glow: 10, alpha: a, upright: true }); if (i) arrowH(qx - 46, qx - 12, 194, CR, 0.6 * a, 2); } qx += w + 58; });
  if (t > P('C12', 0.8)) { const a = ap(t, 'C12', 0.8); arrowH(qx - 46, qx - 12, 194, CR, 0.6 * a, 2); mathText('2', qx, 207, 40, GOLD, { glow: 14, alpha: a, upright: true }); }
  // C13：切线
  if (tg > 0) {
    mathText('y = 2x − 1', gx(GT, 1.75), gy(GT, 1.7), 40, INV, { glow: 12, alpha: tg });
    label('切线', gx(GT, 2.0), gy(GT, 2.35), 32, INV, tg, { bold: true });
    burst(t, P('C13', 0.15) + 0.6, gx(GT, 1), gy(GT, 1), INV, 90, 14);
    richReveal([['割线斜率 = (x^2 − 1)/(x − 1) = x + 1 → ', CR], ['2', GOLD]], 1060, 905, 34, t, P('C13', 0.5), { upright: true });
  }
};

// ======================= outro：同一个比值 → 极限 → 导数 =======================
const FR = [{ x: 820, n: 'Δs', d: 'Δt', zh: '速度' }, { x: 1180, n: 'Δy', d: 'Δx', zh: '切线斜率' }];
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'G03', 0, 0.5) * 0.5, 82);
  const fa = ap(t, 'G03', 0.05) * fadeOut(t, S('C14'), 0.4);
  if (fa > 0) {
    const sh = kf(t, 1, [[P('G03', 0.55), 0.6, 0.8]]);
    FR.forEach((f, i) => {
      const a = fa * eOut(prog(t, P('G03', 0.05 + 0.15 * i), 0.4)); if (a <= 0) return;
      const y = 470; seg(f.x - 80, y, f.x + 80, y, CR, a, 3);
      ctx.save(); ctx.translate(f.x, y - 46); ctx.scale(sh, sh); mathText(f.n, 0, 0, 64, GOLD, { align: 'center', glow: 12, alpha: a, upright: true }); ctx.restore();
      ctx.save(); ctx.translate(f.x, y + 86); ctx.scale(sh, sh); mathText(f.d, 0, 0, 64, CYAN, { align: 'center', glow: 12, alpha: a, upright: true }); ctx.restore();
      label(f.zh, f.x, y + 160, 34, CR, a, { bold: true });
      const za = a * ap(t, 'G03', 0.6);
      mathText('→ 0', f.x + 100, y - 40, 34, RED, { glow: 10, alpha: za, upright: true }); mathText('→ 0', f.x + 100, y + 70, 34, RED, { glow: 10, alpha: za, upright: true });
    });
    if (t > S('D04')) { richReveal([['0 ÷ 0', CR], ['  →  ', CR]], 960, 790, 60, t, P('D04', 0.05), { out: S('C14'), upright: true }); kinetic('?', 1160, 772, 80, t, P('D04', 0.6), { col: RED, font: F_MATH, bold: false, out: S('C14') }); }
  }
  // C14：极限 → 导数
  if (t > S('C14') - 0.1) {
    const oa = fadeOut(t, S('X04') + 0.1, 0.4);
    if (oa > 0) {
      ctx.save(); ctx.globalAlpha *= oa;
      glowText('“往哪儿去”的严格定义', 1040, 330, 40, CR, t, P('C14', 0.1));
      termCard('limit', '极限', 860, 520, t, P('C14', 0.4));
      if (t > P('C14', 0.65)) arrowH(965, 1085, 520, CR, ap(t, 'C14', 0.62), 3.5);
      termCard('derivative', '导数', 1230, 520, t, P('C14', 0.75));
      glowText('这一章：先极限，再导数', 1040, 700, 34, GOLD, t, P('C14', 0.85));
      ctx.restore();
    }
  }
  // X04：从终点出发（犯规）
  if (t > S('X04') - 0.1) {
    const xa = ap(t, 'X04', 0.0) * fadeOut(t, S('C15') + 0.2, 0.4);
    if (xa > 0) {
      const y = 560; seg(680, y, 1340, y, CR, 0.5 * xa, 2.2);
      label('起点', 680, y + 40, 26, CR, xa); label('终点', 1320, y + 40, 26, CR, xa);
      ctx.save(); ctx.globalAlpha *= xa; ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1320, y); ctx.lineTo(1320, y - 80); ctx.stroke();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = (r + c) % 2 ? COL.ink : CR; ctx.fillRect(1320 + c * 14, y - 80 + r * 14, 14, 14); } ctx.restore();
      const jump = P('X04', 0.35), gX = t < jump ? 690 : 1290;
      glowDot(gX, y, 13, CYAN, xa); label('Grok', gX, y - 44, 24, CYAN, xa, { bold: true });
      burst(t, jump, 1290, y, CYAN, 110, 18);
      whale(760, y - 6, 1, GOLD, xa, t); label('大肥鱼', 760, y - 44, 24, GOLD, xa, { bold: true });
      stampMark(1060, 420, 78, t, P('X04', 0.6), { text: '犯规', rot: -0.2 });
    }
  }
  if (t > S('C15') - 0.1) { glowText('下一段：高中导数速通', 1040, 520, 56, CR, t, P('C15', 0.15)); glowText('derivative · 求导公式 · 切线', 1040, 610, 32, CYAN, t, P('C15', 0.4), { bold: false }); }
  drawCredits(t);
};
function drawCredits(t) {
  const t0 = E('C15') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 2 章 · P0 芝诺悖论', 215, 34, GOLD, 0.08);
  T('下一段：高中导数速通', 310, 52, CR, 0.28);
  T('素材与授权说明', 450, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 505, 20, CR, 0.72, B);
  T('Grok / Kimi 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', 548, 20, CR, 0.94, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 591, 20, CR, 1.16, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 634, 20, CR, 1.38, B);
  T('Grok / Kimi 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', 677, 20, CR, 1.60, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 720, 20, CR, 1.82, B);
  T('Claude、GPT、DeepSeek、Grok、Kimi 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 763, 20, CR, 2.04, B);
}

SC.__overlay = t => { if (t < E('C15') + 0.25) lecturer(t, 'C', 255, -5, E('C15') + 0.48, { h: 710 }); };
SC.__noTag = E('C15') + 0.30;
function drawFrame(t) { composeFrame(t, SC, t < E('C15') + 0.38 ? TITLES : null); }   // 片尾署名时不再叠块标题（10-27 P1 制作时发现，一并修正）

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  // achilles
  [0.15, 0.4, 0.6].forEach((f, i) => s('D01', f, ['pop', 'tick', 'pop'][i], 0.26));
  s('K01', 0.05, 'shimmer', 0.24); s('K01', 0.4, 'tinkle', 0.24);
  s('C01', 0.22, 'pop', 0.28); s('C01', 0.55, 'pop', 0.28); s('C01', 0.62, 'tick', 0.22);
  s('D02', 0.1, 'pluck', 0.24);
  s('X01', 0.08, 'slam', 0.3); s('X01', 0.4, 'zap', 0.18);
  RUNS.forEach(([t0, t1], k) => { sfx(t0, 'whoosh', 0.26 - k * 0.04); sfx(t1, ['ding_lo', 'ding', 'ding_hi', 'ding_hi'][k], 0.28); sfx(t0 + 0.1, 'pop', 0.2); });
  sfx(S('C03') - 0.35, 'warp', 0.2); sfx(P('C03', 0.38), 'warp', 0.18); sfx(P('C03', 0.64), 'warp', 0.16);
  s('X02', 0.05, 'impact', 0.34); s('X02', 0.1, 'glitch', 0.18);
  // sum
  for (let i = 0; i < 4; i++) sfx(blockT(i), ['marimba_lo', 'marimba', 'marimba_hi', 'tick'][i], 0.28);
  for (let i = 4; i < 9; i++) sfx(blockT(i), 'tick2', 0.14);
  s('C04', 0.42, 'swoosh_soft', 0.2);
  SUMS.forEach((_, i) => s('C05', 0.04 + i * 0.08, 'pluck', 0.22)); s('C05', 0.55, 'bell_soft', 0.3);
  s('G01', 0.08, 'swoosh_in', 0.24); s('G01', 0.45, 'type', 0.16); s('G01', 0.55, 'ding_hi', 0.32);
  s('X03', 0.08, 'check', 0.36); s('X03', 0.1, 'sparkle', 0.24);
  s('C06', 0.05, 'swell', 0.24); s('C06', 0.62, 'stamp', 0.3);
  // arrow
  s('K02', 0.05, 'whoosh', 0.3); for (let i = 0; i < 5; i++) s('K02', 0.45 + 0.07 * i, 'tick', 0.22); s('K02', 0.78, 'buzz', 0.16);
  s('C07', 0.0, 'warp', 0.22); s('C07', 0.3, 'pop', 0.24); s('C07', 0.45, 'pop', 0.24); s('C07', 0.65, 'soft_hit', 0.26);
  s('G02', 0.02, 'swoosh_in', 0.24); typeSfx(P('G02', 0.18), 5, 0.35, 0.14); s('G02', 0.4, 'glitch', 0.24); s('G02', 0.75, 'buzz', 0.2);
  // velocity
  s('C08', 0.3, 'swoosh_soft', 0.22); s('C08', 0.7, 'tick', 0.2);
  HS.forEach((_, i) => { sfx(hT(i), 'warp', 0.16); sfx(hT(i) + 0.15, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.28); });
  s('D03', 0.1, 'sparkle', 0.28); s('D03', 0.3, 'ding_hi', 0.3);
  s('C10', 0.3, 'bell_soft', 0.3); s('C10', 0.62, 'whoosh', 0.26);
  s('K03', 0.1, 'shimmer', 0.22); s('K03', 0.55, 'tinkle', 0.24);
  // tangent
  s('C11', 0.1, 'swoosh_soft', 0.22); s('C11', 0.35, 'pop', 0.24); s('C11', 0.6, 'pop', 0.24);
  QS.forEach((_, i) => { if (i) sfx(qT(i), 'tick2', 0.2); sfx(i ? qT(i) + 0.45 : P('C12', 0.08), ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.26); });
  s('C12', 0.8, 'ding', 0.28);
  s('C13', 0.15, 'riser', 0.14); sfx(P('C13', 0.15) + 0.6, 'ding_hi', 0.34); s('C13', 0.5, 'type', 0.14);
  // outro
  s('G03', 0.05, 'pop', 0.24); s('G03', 0.2, 'pop', 0.24); s('G03', 0.55, 'warp', 0.2);
  s('D04', 0.6, 'soft_hit', 0.28);
  s('C14', 0.4, 'stamp', 0.28); s('C14', 0.75, 'stamp', 0.3);
  s('X04', 0.35, 'zap', 0.3); s('X04', 0.6, 'stamp', 0.34); s('X04', 0.62, 'buzz', 0.16);
  s('C15', 0.15, 'swell', 0.3);
})();
finalize();
