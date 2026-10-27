// P4《复合与反函数》v2（2026-10-27 重做）：所有数学画面为原创 Canvas 绘制；沿用共享时间轴与组件，画风对齐 P3。
// 版面约定：讲师占 x<540；主内容区 x 600–1460（客串角色在右侧时不越界）；公式 44–64px；字幕区 y≥964 不放内容。
// 配色（制作规范“颜色语义”，10-27 统一）：f / 外层 = 红，g / 内层 = 绿，反函数 = 紫，x / 定义域 = 青，y / 值域 = 金，正确 = 绿，出错 = 红。拆链一段按“层”配色，不涉及 f/g。
const SC = {};
const TITLES = [
  ['hook','接起来，倒回去'], ['comp','复合与定义域'], ['order','顺序不能换'], ['chain','拆复合链'],
  ['inv','把箭头倒过来'], ['test','判断可逆'], ['graph','沿 y = x 翻折'], ['find','三步求反函数'], ['quiz','随堂两题']
];
const TAU = Math.PI * 2, CR = COL.cream, RED = COL.red, GRN = COL.g, INV = COL.inv;
const QUIZ_BEATS = ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz');
const ap = (t, id, f = 0, d = 0.4) => eOut(prog(t, P(id, f), d));
const fadeOut = (t, t0, d = 0.35) => 1 - eIn(prog(t, t0, d));
const sinh = x => (Math.exp(x) - Math.exp(-x)) / 2;
const mfmt = v => (Math.abs(v) < 0.05 ? '0' : (v < 0 ? '−' : '') + (+Math.abs(v).toFixed(1)).toString());

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
// 函数"机器"：圆角盒 + 左右接口；label 可在两个之间淡入淡出
function machine(cx, cy, w, h, col, a = 1, o = {}) {
  if (a <= 0) return; const pu = o.pulse || 0;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = hexA(col, 0.09 + 0.16 * pu); rr(cx - w / 2, cy - h / 2, w, h, 20); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 3 + 2 * pu; ctx.shadowColor = col; ctx.shadowBlur = 16 + 22 * pu; ctx.stroke();
  ctx.shadowBlur = 8; ctx.fillStyle = col;
  ctx.fillRect(cx - w / 2 - 12, cy - 13, 12, 26); ctx.fillRect(cx + w / 2, cy - 13, 12, 26);
  ctx.restore();
  (o.labels || []).forEach(([s, al, sz0]) => {
    if (al <= 0) return; let sz = sz0 || 46; if (mathW(s, sz) > w - 26) sz = sz * (w - 26) / mathW(s, sz);
    mathText(s, cx, cy + sz * 0.33, sz, col, { align: 'center', glow: 12, alpha: a * al });
  });
}

// ======================= hook =======================
// D01：大肥鱼以为“接起来 = 相乘”；C01：划掉，换成两台串联的机器；C02：两件事 —— 接起来（∘），倒回去（⁻¹）
const HK = { y: 640, xin: 640, g: 850, f: 1150, xout: 1380, w: 190, h: 112 };
function hookPipe(t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const q = ap(t, 'C01', 0.12, 0.5);
  seg(HK.xin, HK.y, lerp(HK.xin, HK.xout, q), HK.y, CR, 0.35, 2.5);
  const tr = prog(t, P('C01', 0.3), (D('C01') * 0.55)), px = lerp(HK.xin, HK.xout, eIO(tr));
  machine(HK.g, HK.y, HK.w, HK.h, GRN, ap(t, 'C01', 0.14, 0.4), { labels: [['g', 1, 56]], pulse: Math.abs(px - HK.g) < HK.w / 2 ? 1 : 0 });
  machine(HK.f, HK.y, HK.w, HK.h, RED, ap(t, 'C01', 0.22, 0.4), { labels: [['f', 1, 56]], pulse: Math.abs(px - HK.f) < HK.w / 2 ? 1 : 0 });
  if (tr > 0) {
    const lab = px < HK.g ? ['x', CR] : px < HK.f ? ['g(x)', GRN] : ['f(g(x))', RED];
    glowDot(px, HK.y, 11, lab[1]);
    if (tr < 1) mathText(lab[0], px, HK.y - 78, 40, lab[1], { align: 'center', glow: 12 });
  }
  if (tr >= 1) { mathText('f(g(x))', HK.xout + 10, HK.y + 14, 42, RED, { glow: 12 }); }
  arrowH(HK.xout - 30, HK.xout, HK.y, CR, q * 0.6);
  ctx.restore();
}
SC.hook = t => {
  starfield(t); blueprint(ap(t, 'D01', 0, 0.7), 72);
  const a1 = fadeOut(t, S('C02') + 0.02, 0.4);
  if (a1 > 0) {
    ctx.save(); ctx.globalAlpha *= a1;
    glowMath('f(u) = √u', 820, 300, 54, RED, t, P('D01', 0.08), { align: 'center' });
    glowMath('g(x) = 1 − x^2', 1260, 300, 54, GRN, t, P('D01', 0.2), { align: 'center' });
    const pa = ap(t, 'D01', 0.5, 0.35);
    if (pa > 0) {
      richReveal([['f', RED], [' · ', CR], ['g', GRN], ['  =  ', CR], ['√x', RED], [' · ', CR], ['(1 − x^2)', GRN]], 1040, 450, 50, t, P('D01', 0.5));
      kinetic('？', 1400, 432, 64, t, P('D01', 0.72), { col: GOLD });
      // C01：红线划掉
      const st = eOut(prog(t, P('C01', 0.03), 0.3)), w = mathW('f · g  =  √x · (1 − x^2)', 50) + 20;
      if (st > 0) { seg(1040 - w / 2, 437, 1040 - w / 2 + w * st, 437, RED, 1, 5); }
      if (t > P('C01', 0.1)) crossMark(1460, 435, 40, RED, t, P('C01', 0.1));
    }
    hookPipe(t, ap(t, 'C01', 0.1, 0.4));
    kinetic('串联，不是相乘', 1010, 860, 50, t, P('C01', 0.62), { col: CR });
    ctx.restore();
  }
  if (t > S('C02') - 0.1) {
    const cy = 540;
    // ① 接起来：两段箭头首尾相接
    const aL = ap(t, 'C02', 0.15, 0.35);
    if (aL > 0) {
      ctx.save(); ctx.globalAlpha *= aL;
      richReveal([['f', RED], [' ∘ ', CR], ['g', GRN]], 820, cy, 110, t, P('C02', 0.15), { dur: 0.4 });
      const q = eOut(prog(t, P('C02', 0.25), 0.5));
      arrowH(700, lerp(700, 815, clamp(q * 2)), 680, GRN, aL); if (q > 0.5) arrowH(825, lerp(825, 940, clamp(q * 2 - 1)), 680, RED, aL);
      glowDot(820, 680, 7, '#ffffff', q > 0.5 ? 1 : 0);
      glowText('① 接起来', 820, 760, 46, GOLD, t, P('C02', 0.22));
      ctx.restore();
      burst(t, P('C02', 0.15) + 0.35, 820, cy - 30, GOLD, 150, 20);
    }
    // ② 倒回去：箭头翻转方向
    const aR = ap(t, 'C02', 0.55, 0.35);
    if (aR > 0) {
      ctx.save(); ctx.globalAlpha *= aR;
      richReveal([['f', RED], ['^{−1}', INV]], 1260, cy, 110, t, P('C02', 0.55), { dur: 0.4 });
      const e = eIO(prog(t, P('C02', 0.7), 0.55));
      arrowH(lerp(1150, 1370, e), lerp(1370, 1150, e), 680, e < 0.5 ? RED : INV, aR);
      glowText('② 倒回去', 1260, 760, 46, INV, t, P('C02', 0.62));
      ctx.restore();
      burst(t, P('C02', 0.55) + 0.35, 1260, cy - 30, INV, 150, 20);
    }
  }
};

// ======================= comp =======================
// C03 定义 + 机器流水线 → C04 例子 → C05–C06 一串 x 进机器，g 吐出负数的在 f 门口掉下去（A19）
// → C07 数轴上只剩 [−1, 1] → G01 从外往里反推
const DEF = [['(f∘g)(x) = ', CR], ['f', RED], ['(', CR], ['g(x)', GRN], [')', CR]];
const XS = Array.from({ length: 13 }, (_, i) => -2 + i / 3);
function compGeo(t) {
  const dx = -110 * eIO(prog(t, S('G01') - 0.6, 0.6));
  return { y: 545, xin: 640 + dx, g: 830 + dx, f: 1110 + dx, xout: 1290 + dx, w: 190, h: 110, nl: 775, nc: 975 + dx, nu: 145 };
}
SC.comp = t => {
  starfield(t); blueprint(ap(t, 'C03', 0, 0.5), 72);
  const K = compGeo(t), LX = x => K.nc + x * K.nu;
  // ---- 公式行 ----
  richReveal(DEF, 1040, 228, 54, t, P('C03', 0.03), { dur: 1.0 });
  richReveal([['f(u) = √u', RED], [' ,   ', CR], ['g(x) = 1 − x^2', GRN]], 1040, 305, 44, t, P('C04', 0.04), { out: S('C06') });
  richReveal([['D_{f∘g} = { x ∈ D_g  :  ', CR], ['g(x) ∈ D_f', GRN], [' }', CR]], 1040, 305, 44, t, P('C06', 0.08));
  richReveal([['(f∘g)(x) = ', CR], ['√(1 − x^2)', RED]], 1040, 378, 44, t, P('C04', 0.55), { out: S('C07') });
  richReveal([['1 − x^2 ≥ 0', GRN], ['   ⇒   ', CR], ['−1 ≤ x ≤ 1', CYAN]], 1040, 378, 44, t, P('C07', 0.04));
  term('composite function', '复合函数', 1040, 895, t, P('C03', 0.2), { out: S('C04') });
  // ---- 流水线 ----
  const pa = ap(t, 'C03', 0.2, 0.5);
  if (pa > 0) {
    ctx.save(); ctx.globalAlpha *= pa;
    seg(K.xin, K.y, K.xout, K.y, CR, 0.3, 2.5); arrowH(K.xout - 30, K.xout, K.y, CR, 0.6);
    const ex = eIO(prog(t, P('C04', 0.3), 0.6));
    let tokX = null;
    const run = (t0, dur, labs) => {
      const r = (t - t0) / dur; if (r <= 0 || r >= 1.25) return;
      const px = lerp(K.xin, K.xout, eIO(Math.min(r, 1))), al = r > 1 ? 1 - (r - 1) * 4 : 1;
      const L = px < K.g ? labs[0] : px < K.f ? labs[1] : labs[2]; tokX = px;
      glowDot(px, K.y, 11, L[1], al); mathText(L[0], px, K.y - 76, 36, L[1], { align: 'center', glow: 12, alpha: al });
    };
    run(P('C03', 0.5), D('C03') * 0.45, [['x', CR], ['g(x)', GRN], ['f(g(x))', RED]]);
    run(P('C04', 0.6), D('C04') * 0.38, [['x', CR], ['1 − x^2', GRN], ['√(1 − x^2)', RED]]);
    const pul = x => tokX != null && Math.abs(tokX - x) < K.w / 2 ? 1 : 0;
    machine(K.g, K.y, K.w, K.h, GRN, 1, { labels: [['g', 1 - ex, 56], ['1 − x^2', ex, 42]], pulse: pul(K.g) });
    machine(K.f, K.y, K.w, K.h, RED, 1, { labels: [['f', 1 - ex, 56], ['√u', ex, 46]], pulse: pul(K.f) });
    glowText('① 先算里面', K.g, K.y + 92, 30, GRN, t, P('C03', 0.55), { out: S('C05') });
    glowText('② 再算外面', K.f, K.y + 92, 30, RED, t, P('C03', 0.72), { out: S('C05') });
    ctx.restore();
  }
  // ---- C05–C07：一串 x 进机器 ----
  const nA = ap(t, 'C05', 0.05, 0.5);
  if (nA > 0) {
    ctx.save(); ctx.globalAlpha *= nA;
    seg(LX(-2.25), K.nl, LX(2.25), K.nl, CR, 0.6, 2);
    for (let k = -2; k <= 2; k++) { seg(LX(k), K.nl - 8, LX(k), K.nl + 8, CR, 0.7, 2); mathText(k < 0 ? `−${-k}` : `${k}`, LX(k), K.nl + 42, 26, CR, { align: 'center', alpha: 0.8 }); }
    const T0 = P('C05', 0.15), T1 = P('C06', 0.55), dt = (T1 - T0) / (XS.length - 1), TR = 2.0;
    XS.forEach((x, i) => {
      const ts = T0 + i * dt, u = (t - ts) / TR; if (u < 0) return;
      const v = 1 - x * x, ok = v > -1e-9, X = LX(x);
      if (u < 1) {
        let px, py = K.y, col = CR, lab = null, al = 1;
        if (u < 0.3) { px = lerp(K.xin - 30, K.g, u / 0.3); lab = mfmt(x); }
        else if (u < 0.6) { px = lerp(K.g, K.f - K.w / 2 - 14, (u - 0.3) / 0.3); col = ok ? GRN : RED; lab = mfmt(v); }
        else if (!ok) { const k = (u - 0.6) / 0.4; px = K.f - K.w / 2 - 14 + 40 * k; py = K.y + 460 * k * k; col = RED; al = 1 - k; lab = mfmt(v); }
        else if (u < 0.8) { px = lerp(K.f - K.w / 2, K.xout, (u - 0.6) / 0.2); col = CYAN; }
        else { const k = eIO((u - 0.8) / 0.2); px = lerp(K.xout, X, k); py = lerp(K.y, K.nl, k) - Math.sin(Math.PI * k) * 70; col = CYAN; }
        glowDot(px, py, 9, col, al);
        if (lab) mathText(lab, px, py - 24, 26, col, { align: 'center', glow: 6, alpha: al });
      }
      if (ok && u >= 1) glowDot(X, K.nl, 8, CYAN);
      if (!ok && u >= 0.62) openDot(X, K.nl, 8, RED, clamp((u - 0.62) * 5));
      if (ok) sparks(t, ts + TR, X, K.nl, { col: [CYAN, '#ffffff'], n: 8, speed: 200 });
    });
    zhMath('外层只吃', 'u ≥ 0', 1000, 880, 36, CR, RED, t, P('C05', 0.55), { out: S('C06') });
    // C07：[−1, 1] 亮起
    const h = ap(t, 'C07', 0.35, 0.5);
    if (h > 0) {
      seg(LX(-1), K.nl, LX(-1 + 2 * h), K.nl, CYAN, 1, 8);
      kinetic('[−1, 1]', LX(0), K.nl - 62, 50, t, P('C07', 0.45), { col: CYAN });
      burst(t, P('C07', 0.45), LX(0), K.nl, CYAN, 160, 20);
    }
    ctx.restore();
  }
  // ---- G01：从外往里查 ----
  if (t > S('G01')) {
    const q = eOut(prog(t, P('G01', 0.12), 0.7));
    arrowQ(K.f, K.y - K.h / 2 - 6, K.g, K.y - K.h / 2 - 6, RED, q, 1, { bend: 70, w: 3.5, hs: 16 });
    glowText('① 外层要什么', K.f + 10, K.y + 92, 30, RED, t, P('G01', 0.2));
    glowText('② 反推 x', K.g, K.y + 92, 30, CYAN, t, P('G01', 0.5));
    glowText('快招：从外往里查', 900, 890, 40, CR, t, P('G01', 0.06));
  }
};

// ======================= order =======================
// C08 g∘f 流程 + 射线；C09 半圆 vs 射线，f∘g ≠ g∘f（A21）
const GO = { cx: 1010, cy: 770, ux: 118, uy: 118, x0: -1.5, x1: 3.2, y0: -1.25, y1: 1.3 };
SC.order = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5), 72);
  richReveal([['f∘g', RED], ['  :   x  →  ', CR], ['1 − x^2', GRN], ['  →  ', CR], ['√(1 − x^2)', RED]], 1030, 240, 44, t, P('C08', 0.03));
  richReveal([['g∘f', GRN], ['  :   x  →  ', CR], ['√x', RED], ['  →  ', CR], ['1 − (√x)^2 = 1 − x', GRN], ['   (x ≥ 0)', RED]], 1030, 318, 44, t, P('C08', 0.25), { dur: 1.2 });
  gAxes(GO, ap(t, 'C08', 0.05, 0.5), { ticks: { x: [[-1, '−1'], [1, '1']], y: [[1, '1']] } });
  gPlot(GO, x => Math.sqrt(Math.max(0, 1 - x * x)), RED, { xa: -1, xb: 1, p: prog(t, P('C08', 0.1), 0.9), n: 300 });
  gPlot(GO, x => 1 - x, GRN, { xa: 0, xb: 2.25, p: prog(t, P('C08', 0.62), 0.9) });
  if (t > P('C08', 0.62)) { glowDot(gx(GO, 0), gy(GO, 1), 8, GRN); }
  // x < 0 的部分：g∘f 根本没有定义
  const nA = ap(t, 'C08', 0.8, 0.4);
  if (nA > 0) { ctx.save(); ctx.fillStyle = hexA(RED, 0.08 * nA); ctx.fillRect(gx(GO, GO.x0), gy(GO, GO.y1), -GO.x0 * GO.ux, (GO.y1 - GO.y0) * GO.uy); ctx.restore();
    glowText('x < 0：g∘f 没有定义', gx(GO, -0.75), gy(GO, -0.75), 26, RED, t, P('C08', 0.8), { bold: false }); }
  glowText('半圆', gx(GO, -0.95), gy(GO, 1.08), 34, RED, t, P('C09', 0.05));
  glowText('射线', gx(GO, 2.15), gy(GO, -0.75), 34, GRN, t, P('C09', 0.2));
  if (t > P('C09', 0.42)) {
    const s = 1 + 0.3 * (1 - eOut(prog(t, P('C09', 0.42), 0.35))), a = ap(t, 'C09', 0.42, 0.2);
    ctx.save(); ctx.translate(1040, 445); ctx.scale(s, s);
    mathRich([['f∘g', RED], ['  ≠  ', CR], ['g∘f', GRN]], -mathW('f∘g  ≠  g∘f', 64) / 2, 0, 64, { glow: 18, alpha: a });
    ctx.restore();
    burst(t, P('C09', 0.42) + 0.05, 1040, 425, RED, 170, 22);
  }
  glowText('复合一般不能交换', 1040, 520, 34, CR, t, P('C09', 0.7), { bold: false });
};

// ======================= chain =======================
// C10 复杂式子；K01 Kimi 从里往外读，三台“代码机器”依次点亮（A20）；K02 写成 u、v、y + 更长的链一口气拆完；C11 链式法则伏笔
const CH = [['sin', GOLD], ['^2', GRN], ['(', CR], ['3x + 1', CYAN], [')', CR]];
const CODES = [['x => 3*x + 1', CYAN, '2.5'], ['Math.sin', GOLD, '0.598'], ['v => v * v', GRN, '0.358']];
function codeBoxes(t) {
  ctx.save(); ctx.font = `30px ${F_CODE}`; const ws = CODES.map(c => ctx.measureText(c[0]).width + 46); ctx.restore();
  const gap = 66, tot = ws.reduce((a, b) => a + b, 0) + gap * 2; let x = 1000 - tot / 2;
  return ws.map(w => { const b = { x, w }; x += w + gap; return b; });
}
const LONG = ['ln(', '1 + ', 'cos', '^2', '(', '√(', 'x^2 + 1', ')', ')', ')'];
const LONG_LAYER = [6, 5, 3, 4, 3, 2, 1, 2, 3, 6];   // 每个片段属于第几层（1 = 最里层）
const LAYER_COL = [CYAN, GOLD, GRN, INV, CYAN, GOLD];
SC.chain = t => {
  starfield(t); blueprint(ap(t, 'C10', 0, 0.5), 72);
  const FY = 262, FS = 66, FC = 1000;
  richReveal(CH, FC, FY, FS, t, P('C10', 0.45), { dur: 0.6 });
  const xs = rowX(CH.map(p => p[0]), FS, FC);
  const B = codeBoxes(t), BY = 470, BH = 84;
  const lit = [P('K01', 0.22), P('K01', 0.48), P('K01', 0.72)];
  // 公式里对应层的下划线
  [[3, 0], [0, 1], [1, 2]].forEach(([pi, k]) => {
    const q = eOut(prog(t, lit[k], 0.35)); if (q <= 0) return;
    const x0 = xs[pi] - 4, x1 = xs[pi] + mathW(CH[pi][0], FS) + 4, col = CODES[k][1];
    seg(x0, FY + 20 + k * 2, lerp(x0, x1, q), FY + 20 + k * 2, col, 1, 5);
    circleNum(k + 1, (x0 + x1) / 2, FY + 62, 18, col, t, lit[k], fadeOut(t, S('C11'), 0.3));
  });
  // 代码机器
  const ba = ap(t, 'K01', 0.1, 0.45);
  if (ba > 0) {
    ctx.save(); ctx.globalAlpha *= ba;
    const runT = prog(t, lit[0] - 0.2, lit[2] - lit[0] + 0.9), x0 = B[0].x - 70, x1 = B[2].x + B[2].w + 60;
    seg(x0, BY, x1, BY, CR, 0.3, 2.5);
    for (let k = 0; k < 2; k++) arrowH(B[k].x + B[k].w + 8, B[k + 1].x - 8, BY, CR, 0.7, 3);
    const px = lerp(x0, x1, runT);
    CODES.forEach(([s, col, out], k) => {
      const b = B[k], on = t > lit[k] ? 1 : 0, pu = Math.max(0, 1 - Math.abs(px - (b.x + b.w / 2)) / (b.w / 2 + 10));
      ctx.save(); ctx.fillStyle = hexA(col, 0.06 + 0.12 * on + 0.15 * pu); rr(b.x, BY - BH / 2, b.w, BH, 14); ctx.fill();
      ctx.strokeStyle = on ? col : hexA(col, 0.4); ctx.lineWidth = 3 + 2 * pu; ctx.shadowColor = col; ctx.shadowBlur = on ? 18 + 20 * pu : 0; ctx.stroke();
      ctx.font = `30px ${F_CODE}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowBlur = on ? 10 : 0; ctx.fillStyle = on ? col : hexA(CR, 0.55); ctx.fillText(s, b.x + b.w / 2, BY + 2);
      // 运行值
      if (px > b.x + b.w) { ctx.font = `28px ${F_CODE}`; ctx.fillStyle = col; ctx.shadowBlur = 8; ctx.fillText('→ ' + out, b.x + b.w / 2, BY + 78); }
      ctx.restore();
    });
    if (runT > 0 && runT < 1) glowDot(px, BY, 10, '#ffffff');
    ctx.save(); ctx.font = `28px ${F_CODE}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = CR; ctx.globalAlpha *= fadeOut(t, S('C11'), 0.3) * ap(t, 'K01', 0.18);
    ctx.fillText('x = 0.5', B[0].x, BY - 78); ctx.restore();
    ctx.restore();
  }
  // K02：写成三层
  const rows = [['u = 3x + 1', CYAN], ['v = sin u', GOLD], ['y = v^2', GRN]];
  rows.forEach(([s, col], k) => {
    const y = 640 + k * 64, t0 = P('K02', 0.04 + k * 0.1);
    glowMath(s, 790, y, 44, col, t, t0);
    circleNum(k + 1, 750, y - 14, 18, col, t, t0);
  });
  // K02 后半：更长的链，一层层从里往外上色
  const la = ap(t, 'K02', 0.5, 0.4) * fadeOut(t, S('C11'), 0.35);
  if (la > 0) {
    const LS = 44, lx = rowX(LONG, LS, 980);
    const step = (P('K02', 0.92) - P('K02', 0.58)) / 6;
    const lev = clamp(Math.floor((t - P('K02', 0.58)) / step) + 1, 0, 6);
    LONG.forEach((s, i) => { const L = LONG_LAYER[i], on = L <= lev; mathText(s, lx[i], 862, LS, on ? LAYER_COL[L - 1] : CR, { glow: on ? 12 : 0, alpha: la * (on ? 1 : 0.45) }); });
    if (lev >= 6) glowText('6 层，一层不漏 ✓', 980, 918, 30, GRN, t, P('K02', 0.92));
  }
  // C11：沿链反向求导（伏笔）
  if (t > S('C11')) {
    const q = eOut(prog(t, P('C11', 0.1), 1.0)), xr = B[2].x + B[2].w, xl = B[0].x;
    arrowH(xr, lerp(xr, xl, q), 398, INV, 1, 4);
    glowText('d/dx：沿着链，一层层往回', (xl + xr) / 2, 360, 30, INV, t, P('C11', 0.3), { bold: false });
    term('chain rule', '链式法则（第 3 章）', 1040, 880, t, P('C11', 0.15), { col: INV, size: 38 });
  }
};

// ======================= inv =======================
// D03 eˣ ⇄ ln x ？ → C12 箭头全部反向（A22）→ C13 两种失败：撞车 / 没箭头 → C14 一一对应 → C15 定义、域互换 → G02 f⁻¹ ≠ 1/f
const MX = { xL: 820, xR: 1240, cy: 610, rx: 115, ry: 215 };
const PYS = [470, 563, 656, 749], MAP = [2, 0, 3, 1];
function mainMap(t, a, mode) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  setBlob(MX.xL, MX.cy, MX.rx, MX.ry, CYAN, 1, 'X', { ls: 44 });
  setBlob(MX.xR, MX.cy, MX.rx, MX.ry, GOLD, 1, 'Y', { ls: 44 });
  PYS.forEach((y, i) => {
    glowDot(MX.xL, y, 8, CYAN); mathText(`x_${i + 1}`, MX.xL - 26, y + 10, 30, CYAN, { align: 'right', glow: 6 });
    glowDot(MX.xR, y, 8, GOLD); mathText(`y_${i + 1}`, MX.xR + 26, y + 10, 30, GOLD, { glow: 6 });
  });
  PYS.forEach((y, i) => {
    const yb = PYS[MAP[i]];
    if (mode.fwd > 0) arrowQ(MX.xL, y, MX.xR, yb, RED, mode.fwdP ?? 1, mode.fwd, { bend: 36, w: 2.8 });
    if (mode.back > 0) arrowQ(MX.xR, yb, MX.xL, y, INV, mode.backP ?? 1, mode.back, { bend: 36, w: 2.8 });
  });
  ctx.restore();
}
function miniMap(cxL, cxR, xsY, ysY, pairs, a) {
  setBlob(cxL, 610, 72, 150, CYAN, a); setBlob(cxR, 610, 72, 150, GOLD, a);
  xsY.forEach(y => glowDot(cxL, y, 7, CYAN, a)); ysY.forEach(y => glowDot(cxR, y, 7, GOLD, a));
}
SC.inv = t => {
  starfield(t); blueprint(ap(t, 'D03', 0, 0.5), 72);
  // D03
  const aD = fadeOut(t, S('C12'), 0.35);
  if (aD > 0) {
    ctx.save(); ctx.globalAlpha *= aD;
    richReveal([['e^x', RED], ['   ⇄   ', CR], ['ln x', INV]], 1020, 470, 96, t, P('D03', 0.1), { dur: 0.6 });
    glowText('第一段：对数 = 指数倒过来', 1020, 330, 40, CR, t, P('D03', 0.05), { bold: false });
    kinetic('为什么能倒过来？', 1020, 640, 52, t, P('D03', 0.55), { col: GOLD });
    ctx.restore();
  }
  // C12：箭头反向
  const aM = ap(t, 'C12', 0, 0.4) * fadeOut(t, S('C13'), 0.35);
  if (aM > 0) {
    const flip = eIO(prog(t, P('C12', 0.5), 0.8));
    mainMap(t, aM, { fwd: 1 - flip, fwdP: prog(t, P('C12', 0.06), 0.9), back: flip, backP: flip });
    ctx.save(); ctx.globalAlpha *= aM;
    glowText('原来：x 射向 y', 1030, 300, 40, RED, t, P('C12', 0.06), { out: P('C12', 0.5) });
    glowText('现在：y 射回 x', 1030, 300, 40, INV, t, P('C12', 0.58));
    term('inverse function', '反函数', 1030, 900, t, P('C12', 0.62));
    ctx.restore();
  }
  // C13：两种失败
  const aF = ap(t, 'C13', 0, 0.4) * fadeOut(t, S('C14'), 0.35);
  if (aF > 0) {
    ctx.save(); ctx.globalAlpha *= aF;
    glowText('反过来，还得是函数', 1040, 290, 42, CR, t, P('C13', 0.03));
    // 左：撞车（两个 x 射到同一个 y）
    const L = { a: 700, b: 930 }, lx = [520, 610, 700], ly = [560, 680];
    miniMap(L.a, L.b, lx, ly, null, 1);
    const fl = eIO(prog(t, P('C13', 0.12), 0.5)), bl = eIO(prog(t, P('C13', 0.32), 0.5));
    [[0, 0], [1, 0], [2, 1]].forEach(([i, j]) => arrowQ(L.a, lx[i], L.b, ly[j], RED, fl, 1 - 0.7 * bl, { bend: 26, w: 2.6 }));
    [0, 1].forEach(i => arrowQ(L.b, ly[0], L.a, lx[i], RED, bl, 1, { bend: -26, w: 2.8 }));
    if (bl >= 1) { crossMark(815, 430, 34, RED, t, P('C13', 0.32) + 0.5); glowText('射回两个 x', 815, 820, 34, RED, t, P('C13', 0.4)); }
    // 右：没箭头（某个 y 没人射到）
    const R = { a: 1140, b: 1370 }, rx = [560, 680], ry = [520, 610, 700];
    miniMap(R.a, R.b, rx, ry, null, ap(t, 'C13', 0.48, 0.3));
    const fr = eIO(prog(t, P('C13', 0.52), 0.5));
    if (fr > 0) { arrowQ(R.a, rx[0], R.b, ry[0], RED, fr, 1, { bend: 26, w: 2.6 }); arrowQ(R.a, rx[1], R.b, ry[2], RED, fr, 1, { bend: 26, w: 2.6 }); }
    if (t > P('C13', 0.68)) {
      const pu = 0.5 + 0.5 * Math.sin((t - P('C13', 0.68)) * 8);
      ring(R.b, ry[1], 18 + 6 * pu, RED, 0.9); kinetic('?', R.b + 46, ry[1], 40, t, P('C13', 0.68), { col: RED });
      glowText('没有箭头', 1255, 820, 34, RED, t, P('C13', 0.72));
      crossMark(1255, 430, 34, RED, t, P('C13', 0.75));
    }
    ctx.restore();
  }
  // C14–C15：一一对应 → 定义
  const aB = ap(t, 'C14', 0, 0.4) * fadeOut(t, S('G02'), 0.35);
  if (aB > 0) {
    const bk = eIO(prog(t, P('C15', 0.25), 0.7));
    mainMap(t, aB, { fwd: 1, fwdP: prog(t, P('C14', 0.04), 0.7), back: bk, backP: bk });
    ctx.save(); ctx.globalAlpha *= aB;
    kinetic('一一对应 = 双射', 1030, 300, 54, t, P('C14', 0.3), { col: GOLD, out: S('C15') });
    if (t < S('C15')) burst(t, P('C14', 0.3) + 0.2, 1030, 300, GOLD, 170, 22);
    glowText('单射  +  陪域取成值域', 1030, 890, 38, CR, t, P('C14', 0.45), { out: S('C15') });
    term('one-to-one · bijection', '单射 · 双射', 1030, 236, t, P('C14', 0.5), { out: S('C15') });
    richReveal([['f^{−1}(y) = x', INV], ['   ⇔   ', CR], ['f(x) = y', RED]], 1030, 290, 54, t, P('C15', 0.04));
    // 定义域、值域互换
    const la = ap(t, 'C15', 0.5, 0.4);
    if (la > 0) {
      mathText('D_f', MX.xL, 880, 36, CYAN, { align: 'center', glow: 8, alpha: la });
      mathText('R_f', MX.xR, 880, 36, GOLD, { align: 'center', glow: 8, alpha: la });
      const e = eIO(prog(t, P('C15', 0.6), 0.9));
      const fly = (s, xa, xb) => { const x = lerp(xa, xb, e), y = 925 - Math.sin(Math.PI * e) * 130; mathText(s, x, y, 34, INV, { align: 'center', glow: 10, alpha: la }); };
      fly('= R_{f⁻¹}', MX.xR, MX.xL); fly('= D_{f⁻¹}', MX.xL, MX.xR);
      if (e >= 1) sparks(t, P('C15', 0.6) + 0.9, (MX.xL + MX.xR) / 2, 900, { col: [INV, '#ffffff'], n: 14 });
    }
    ctx.restore();
  }
  // G02：f⁻¹ ≠ 1/f
  const aG = ap(t, 'G02', 0, 0.4);
  if (aG > 0) {
    ctx.save(); ctx.globalAlpha *= aG;
    const s = 1 + 0.3 * (1 - eOut(prog(t, P('G02', 0.05), 0.35)));
    ctx.save(); ctx.translate(930, 320); ctx.scale(s, s);
    mathRich([['f^{−1}', INV], ['  ≠  ', CR], ['1/f', RED]], -mathW('f^{−1}  ≠  1/f', 76) / 2, 0, 76, { glow: 18 }); ctx.restore();
    burst(t, P('G02', 0.1), 930, 300, RED, 160, 20);
    glowMath('f(x) = 2x', 930, 470, 46, CR, t, P('G02', 0.25), { align: 'center' });
    glowMath('f^{−1}(x) = x / 2', 870, 560, 46, INV, t, P('G02', 0.35), { align: 'center' });
    glowMath('1 / f(x) = 1 / (2x)', 870, 650, 46, RED, t, P('G02', 0.48), { align: 'center' });
    if (t > P('G02', 0.42)) checkMark(1140, 545, 34, GRN, t, P('G02', 0.42));
    glowText('倒数', 1150, 640, 30, RED, t, P('G02', 0.55), { bold: false });
    kinetic('上标 −1 ＝ 反过来，不是倒数', 930, 800, 42, t, P('G02', 0.62), { col: CR });
    ctx.restore();
  }
};

// ======================= test =======================
// C16 x² 被水平线扫到两次 → C17 严格单调：每条线一次 → C18 剪掉左半，x ≥ 0 可逆，反函数 √x → C19 1/x：不单调但单射，反函数是自己（A24）
const GT = { cx: 1000, cy: 800, ux: 74, uy: 74, x0: -4.4, x1: 4.4, y0: -1.0, y1: 5.9 };
const G19 = { cx: 1010, cy: 620, ux: 78, uy: 78, x0: -4.2, x1: 4.2, y0: -3.3, y1: 3.3 };
const sq = x => x * x, fexp = x => Math.exp(0.42 * x);
function sweep(G, t, t0, dur, lo, hi, solve, a = 1) {
  const p = prog(t, t0, dur); if (p <= 0 || p >= 1 || a <= 0) return;
  const c = lerp(lo, hi, 0.5 - 0.5 * Math.cos(TAU * p * 0.999)), xs = solve(c).filter(x => x >= G.x0 && x <= G.x1);
  const col = xs.length > 1 ? RED : xs.length === 1 ? GRN : CR;
  gH(G, c, col, 0.9 * a, { dash: [1, 0], w: 2.6 });
  xs.forEach(x => glowDot(gx(G, x), gy(G, c), 10, col, a));
  mathText(`${xs.length} 个交点`, gx(G, G.x1) + 16, gy(G, c) + 10, 28, col, { glow: 6, alpha: a, upright: true });
}
SC.test = t => {
  starfield(t); blueprint(ap(t, 'C16', 0, 0.5), 72);
  const aA = fadeOut(t, S('C19'), 0.4);
  if (aA > 0) {
    ctx.save(); ctx.globalAlpha *= aA;
    gAxes(GT, ap(t, 'C16', 0, 0.4), { ticks: { x: [[1, '1'], [2, '2'], [-2, '−2']] } });
    // C16：x² 失败
    const pA = fadeOut(t, S('C17'), 0.35) + ap(t, 'C18', 0, 0.35);
    const cut = eIO(prog(t, P('C18', 0.2), 0.6));
    gPlot(GT, sq, RED, { xa: -2.4, xb: 0, p: prog(t, P('C16', 0.05), 0.5), rev: true, a: Math.min(1, pA) * (1 - 0.8 * cut), noHead: true });
    gPlot(GT, sq, t > S('C18') ? RED : RED, { xa: 0, xb: 2.4, p: prog(t, P('C16', 0.05), 0.5), a: Math.min(1, pA), noHead: true });
    glowText('水平线检验：每条水平线至多交一次', 1000, 250, 42, CR, t, P('C16', 0.04), { out: S('C17') });
    sweep(GT, t, P('C16', 0.35), D('C16') * 0.62, 0.4, 5.0, c => c > 0 ? [-Math.sqrt(c), Math.sqrt(c)] : [], fadeOut(t, S('C17'), 0.2));
    if (t > P('C16', 0.5) && t < S('C17') + 0.3) crossMark(1380, 330, 38, RED, t, P('C16', 0.5), fadeOut(t, S('C17'), 0.3));
    // C17：严格单调
    const aM = ap(t, 'C17', 0, 0.35) * fadeOut(t, S('C18'), 0.35);
    if (aM > 0) {
      gPlot(GT, fexp, RED, { xa: -4.4, xb: 4.2, p: prog(t, P('C17', 0.03), 0.7), a: aM });
      richReveal([['x_1 < x_2', CYAN], ['   ⇒   ', CR], ['f(x_1) < f(x_2)', GOLD]], 1000, 250, 48, t, P('C17', 0.08), { out: S('C18') });
      const x1 = -3.2, x2 = 1.5, q = ap(t, 'C17', 0.3, 0.5) * aM;
      [[x1, 'x_1'], [x2, 'x_2']].forEach(([x, l]) => {
        seg(gx(GT, x), gy(GT, 0), gx(GT, x), gy(GT, fexp(x)), CYAN, 0.8 * q, 2.4, [6, 6]); glowDot(gx(GT, x), gy(GT, fexp(x)), 9, RED, q);
        mathText(l, gx(GT, x), gy(GT, 0) + 42, 30, CYAN, { align: 'center', glow: 6, alpha: q });
      });
      sweep(GT, t, P('C17', 0.45), D('C17') * 0.5, 0.35, 5.2, c => [Math.log(c) / 0.42], aM);
      kinetic('严格单调  ⇒  单射', 1000, 900, 44, t, P('C17', 0.62), { col: GRN, out: S('C18') });
    }
    // C18：只取 x ≥ 0，反函数 √x
    if (t > S('C18')) {
      if (cut > 0 && cut < 1) seg(gx(GT, 0), gy(GT, 5.6), gx(GT, 0), gy(GT, -0.8), RED, 1 - cut, 4, [10, 8]);
      zhMath('在 ℝ 上：', 'x^2', 1000, 250, 38, RED, RED, t, P('C18', 0.04), { out: P('C18', 0.5) });
      glowText('不可逆', 1300, 250, 38, RED, t, P('C18', 0.12), { out: P('C18', 0.5) });
      richReveal([['x^2  (x ≥ 0)', RED], ['   ⇄   ', CR], ['√x', INV]], 1000, 262, 52, t, P('C18', 0.55));
      gDiag(GT, ap(t, 'C18', 0.55, 0.4));
      const th = Math.PI * eIO(prog(t, P('C18', 0.62), 0.9));
      if (th > 0) foldCurve(GT, sq, 0, 2.4, th, th > Math.PI / 2 ? INV : RED, { a: 0.95 });
      if (th >= Math.PI) { mathText('√x', gx(GT, 4.1), gy(GT, 2.02) - 14, 38, INV, { glow: 10 }); sparks(t, P('C18', 0.62) + 0.9, gx(GT, 2.5), gy(GT, 2.5), { col: [INV, '#ffffff'], n: 14 }); }
      mathText('x^2', gx(GT, 2.4) + 14, gy(GT, 5.6) + 14, 38, RED, { glow: 10, alpha: ap(t, 'C18', 0.3) });
    }
    ctx.restore();
  }
  // C19：1/x
  const aR = ap(t, 'C19', 0, 0.4);
  if (aR > 0) {
    ctx.save(); ctx.globalAlpha *= aR;
    gAxes(G19, 1, { ticks: { x: [[-1, '−1'], [1, '1']], y: [[1, '1'], [-1, '−1']] } });
    const inv = x => 1 / x;
    gPlot(G19, inv, RED, { xa: -4.2, xb: -0.24, p: prog(t, P('C19', 0.04), 0.5) });
    gPlot(G19, inv, RED, { xa: 0.24, xb: 4.2, p: prog(t, P('C19', 0.1), 0.5) });
    mathText('y = 1/x', gx(G19, 1.6), gy(G19, 2.4), 40, RED, { glow: 10, alpha: ap(t, 'C19', 0.1) });
    // 两个点：−1 < 1 但 f(−1) < f(1)，所以并不递减
    const q = ap(t, 'C19', 0.2, 0.4);
    if (q > 0) {
      glowDot(gx(G19, -1), gy(G19, -1), 10, GOLD, q); glowDot(gx(G19, 1), gy(G19, 1), 10, GOLD, q);
      seg(gx(G19, -1), gy(G19, -1), gx(G19, 1), gy(G19, 1), GOLD, 0.8 * q, 2.5, [7, 7]);
    }
    richReveal([['f(−1) = −1', GOLD], ['  <  ', RED], ['1 = f(1)', GOLD]], 1010, 250, 48, t, P('C19', 0.2));
    glowText('并不递减', 1010, 318, 34, RED, t, P('C19', 0.36), { out: P('C19', 0.6) });
    sweep(G19, t, P('C19', 0.42), D('C19') * 0.32, -3.0, 3.0, c => Math.abs(c) > 1e-3 ? [1 / c] : [], 1);
    glowText('但每条水平线至多交一次 → 单射 ✓', 1010, 318, 34, GRN, t, P('C19', 0.62));
    gDiag(G19, ap(t, 'C19', 0.75, 0.4));
    const th = Math.PI * eIO(prog(t, P('C19', 0.78), 0.8));
    if (th > 0 && th < Math.PI) { foldCurve(G19, inv, 0.3, 4.2, th, INV, { a: 0.8, w: 3 }); foldCurve(G19, inv, -4.2, -0.3, th, INV, { a: 0.8, w: 3 }); }
    kinetic('反函数就是它自己', 1010, 905, 44, t, P('C19', 0.82), { col: GOLD });
    if (th >= Math.PI) burst(t, P('C19', 0.78) + 0.8, gx(G19, 1), gy(G19, 1), INV, 150, 18);
    ctx.restore();
  }
};

// ======================= graph =======================
// C20：沿 y = x 立体翻折，(2, 5) → (5, 2)（A23）；C21：eˣ 翻成 ln x
const GG = { cx: 870, cy: 840, ux: 70, uy: 70, x0: -0.9, x1: 6.6, y0: -0.9, y1: 6.5 };
const fq = x => x * x + 1;
SC.graph = t => {
  starfield(t); blueprint(ap(t, 'C20', 0, 0.5), 72);
  gAxes(GG, ap(t, 'C20', 0, 0.4), { ticks: { x: [[2, '2'], [5, '5']], y: [[2, '2'], [5, '5']] } });
  gDiag(GG, ap(t, 'C20', 0.1, 0.4));
  mathText('y = x', gx(GG, 6.1), gy(GG, 6.1) - 14, 34, CR, { glow: 8, alpha: ap(t, 'C20', 0.15) });
  // C20
  const a20 = fadeOut(t, S('C21'), 0.4);
  if (a20 > 0) {
    ctx.save(); ctx.globalAlpha *= a20;
    glowMath('(x, y)   →   (y, x)', 1060, 255, 54, CR, t, P('C20', 0.04), { align: 'center' });
    gPlot(GG, fq, RED, { xa: 0, xb: 2.33, p: prog(t, P('C20', 0.08), 0.7) });
    mathText('f', gx(GG, 2.33) + 14, gy(GG, 6.4) + 20, 40, RED, { glow: 10, alpha: ap(t, 'C20', 0.2) });
    const P0 = ap(t, 'C20', 0.22, 0.3);
    if (P0 > 0) { glowDot(gx(GG, 2), gy(GG, 5), 10, RED, P0); mathText('(2, 5)', gx(GG, 2) - 18, gy(GG, 5) - 6, 32, RED, { align: 'right', glow: 8, alpha: P0 }); }
    const th = Math.PI * eIO(prog(t, P('C20', 0.4), 1.4));
    if (th > 0) {
      const col = th > Math.PI / 2 ? INV : RED;
      foldCurve(GG, fq, 0, 2.33, th, col, { a: 0.95 });
      const [X, Y] = foldXY(2, 5, th);
      seg(gx(GG, 2), gy(GG, 5), gx(GG, X), gy(GG, Y), CR, 0.6, 2, [6, 6]);
      glowDot(gx(GG, X), gy(GG, Y), 10, col);
    }
    if (th >= Math.PI) {
      mathText('(5, 2)', gx(GG, 5) + 18, gy(GG, 2) + 40, 32, INV, { glow: 8 });
      mathText('f^{−1}', gx(GG, 6.3), gy(GG, Math.sqrt(5.3)) - 16, 40, INV, { glow: 10 });
      // 垂直记号（在 (3.5, 3.5) 处）
      { const k = 0.2 * Math.SQRT1_2, P1 = [3.5 + k, 3.5 + k], P2 = [3.5 + 2 * k, 3.5], P3 = [3.5 + k, 3.5 - k];
        glowPath(() => { ctx.moveTo(gx(GG, P1[0]), gy(GG, P1[1])); ctx.lineTo(gx(GG, P2[0]), gy(GG, P2[1])); ctx.lineTo(gx(GG, P3[0]), gy(GG, P3[1])); }, CR, 2, 0.6); }
      sparks(t, P('C20', 0.4) + 1.4, gx(GG, 5), gy(GG, 2), { col: [INV, '#ffffff'], n: 14 });
      glowText('横纵坐标对调', 1390, 520, 38, INV, t, P('C20', 0.4) + 1.3, { align: 'left' });
    }
    ctx.restore();
  }
  // C21
  const a21 = ap(t, 'C21', 0, 0.4);
  if (a21 > 0) {
    ctx.save(); ctx.globalAlpha *= a21;
    richReveal([['y = e^x', RED], ['    ⇄    ', CR], ['y = ln x', INV]], 1060, 255, 54, t, P('C21', 0.05));
    glowText('第一段那句话的答案', 1060, 325, 32, CR, t, P('C21', 0.08), { bold: false });
    gPlot(GG, Math.exp, RED, { xa: -0.9, xb: 1.86, p: prog(t, P('C21', 0.12), 0.7) });
    mathText('e^x', gx(GG, 1.86) + 14, gy(GG, 6.3) + 20, 40, RED, { glow: 10, alpha: ap(t, 'C21', 0.2) });
    glowText('严格递增 ⇒ 可逆', 1390, 460, 34, RED, t, P('C21', 0.25), { bold: false, align: 'left' });
    const th = Math.PI * eIO(prog(t, P('C21', 0.45), 1.2));
    if (th > 0) foldCurve(GG, Math.exp, -0.9, 1.86, th, th > Math.PI / 2 ? INV : RED, { a: 0.95 });
    if (th >= Math.PI) {
      mathText('ln x', gx(GG, 6.25), gy(GG, Math.log(6.25)) - 18, 40, INV, { glow: 10 });
      burst(t, P('C21', 0.45) + 1.2, gx(GG, 1), gy(GG, 1), INV, 160, 22);
      kinetic('关于 y = x 对称', 1560, 560, 42, t, P('C21', 0.45) + 1.25, { col: GOLD });
    }
    ctx.restore();
  }
};

// ======================= find =======================
// C22 三步芯片 → C23 写 y、换元、整理成二次方程 → C24 只取正根、解出 x → C25 交换 x、y：翻牌（A25）→ D04
const STEPS = [['① 写 y = f(x)', 770], ['② 解出 x', 1020], ['③ 交换 x、y', 1270]];
function stepIdx(t) {
  if (t < S('C23')) return t < P('C22', 0.36) ? 0 : t < P('C22', 0.62) ? 1 : 2;
  if (t < S('C24')) return t < P('C23', 0.32) ? 0 : 1;
  if (t < S('C25')) return 1;
  if (t < S('D04')) return 2;
  return -1;
}
const L5A = [['x', CYAN], [' = ln(', CR], ['y', GOLD], [' + √(', CR], ['y', GOLD], ['^2 + 1))', CR]];
const L5B = [['y', GOLD], [' = ln(', CR], ['x', CYAN], [' + √(', CR], ['x', CYAN], ['^2 + 1))', CR]];
SC.find = t => {
  starfield(t); blueprint(ap(t, 'C22', 0, 0.5), 72);
  const cur = stepIdx(t);
  STEPS.forEach(([s, x], i) => {
    const a = ap(t, 'C22', 0.05 + i * 0.28, 0.35); if (a <= 0) return;
    const on = cur === i || cur === -1, pu = cur === -1 ? 0.5 + 0.5 * Math.sin((t - S('D04')) * 7 + i) : 0;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.font = `bold 30px ${F_FANCY}`; const w = ctx.measureText(s).width + 44;
    ctx.fillStyle = hexA(on ? GOLD : CR, on ? 0.14 + 0.1 * pu : 0.04); rr(x - w / 2, 222, w, 58, 29); ctx.fill();
    ctx.strokeStyle = on ? GOLD : hexA(CR, 0.35); ctx.lineWidth = on ? 3 : 2; ctx.shadowColor = GOLD; ctx.shadowBlur = on ? 16 + 12 * pu : 0; ctx.stroke();
    ctx.restore();
    glowText(s, x, 251, 30, on ? GOLD : CR, t, P('C22', 0.05 + i * 0.28), { alpha: on ? 1 : 0.55 });
  });
  richReveal([['y = f(x)', CR], ['   →   ', CR], ['x = f^{−1}(y)', CYAN], ['   →   ', CR], ['y = f^{−1}(x)', INV]], 1020, 520, 50, t, P('C22', 0.12), { dur: D('C22') * 0.7, out: S('C23') - 0.1 });
  const dim = t > S('C25') ? 1 - 0.55 * ap(t, 'C25', 0, 0.5) : 1;
  const CX = 1000, note = (s, y, t0, col = CYAN) => glowText(s, 1300, y - 12, 28, col, t, t0, { align: 'left', bold: false });
  ctx.save(); ctx.globalAlpha *= dim;
  glowMath('y = (e^x − e^{−x}) / 2', CX, 350, 46, CR, t, P('C23', 0.05), { align: 'center' });
  glowText('sinh x', 680, 338, 30, RED, t, P('C23', 0.05), { bold: false });
  glowMath('2y = t − 1 / t', CX, 428, 46, CR, t, P('C23', 0.42), { align: 'center' });
  note('令 t = eˣ', 428, P('C23', 0.42));
  glowMath('t^2 − 2yt − 1 = 0', CX, 506, 46, CR, t, P('C23', 0.72), { align: 'center' });
  note('两边同乘 t', 506, P('C23', 0.72));
  // C24：± → +
  if (t > P('C24', 0.08)) {
    const A4 = [['t = y ', CR], ['±', RED], [' √(y^2 + 1)', CR]], B4 = [['t = y ', CR], ['+', GRN], [' √(y^2 + 1)', CR]];
    const a = ap(t, 'C24', 0.08, 0.35);
    flipRow(A4, B4, CX, 584, 46, t, [null, P('C24', 0.35), null], a);
    note('t > 0：只取正根', 584, P('C24', 0.3), GRN);
  }
  ctx.restore();
  // 解出 x（C24 后半）→ 交换（C25）
  if (t > P('C24', 0.62)) {
    const a = ap(t, 'C24', 0.62, 0.35);
    if (t < S('C25')) { ctx.save(); ctx.globalAlpha *= a; mathRich(L5A, CX - L5A.reduce((s, p) => s + mathW(p[0], 50), 0) / 2, 672, 50, { glow: 14 }); ctx.restore(); }
    else {
      const t0 = P('C25', 0.04);
      flipRow(L5A, L5B, CX, 672, 50, t, [t0, null, t0 + 0.12, null, t0 + 0.22, null], 1);
      // 交换时的弧形箭头提示
      const e = eIO(prog(t, t0 - 0.05, 0.8));
      if (e > 0 && e < 1) { const xs = rowX(L5A.map(p => p[0]), 50, CX); arrowQ(xs[0] + 12, 622, xs[2] + 12, 622, GOLD, e, 1 - e, { bend: 46 }); }
    }
  }
  // C25：最终结果
  const fa = ap(t, 'C25', 0.32, 0.4);
  if (fa > 0) {
    const parts = [['arsinh x', INV], [' = ln(x + √(x^2 + 1))', CR]], w = mathW('arsinh x = ln(x + √(x^2 + 1))', 54);
    ctx.save(); ctx.globalAlpha *= fa; ctx.strokeStyle = INV; ctx.lineWidth = 3; ctx.shadowColor = INV; ctx.shadowBlur = 20;
    rr(CX - w / 2 - 30, 742, w + 60, 88, 18); ctx.stroke(); ctx.fillStyle = hexA(INV, 0.07); ctx.fill(); ctx.restore();
    richReveal(parts, CX, 805, 54, t, P('C25', 0.34));
    burst(t, P('C25', 0.34) + 0.5, CX, 786, INV, 190, 26);
  }
  glowText('sinh 严格递增 ⇒ arsinh 在整个 ℝ 上有定义', CX, 885, 32, CYAN, t, P('C25', 0.68), { bold: false, out: S('D04') });
  kinetic('写 · 解 · 换', CX, 890, 52, t, P('D04', 0.08), { col: GOLD });
};

// ======================= quiz =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C26', 0, 0.5), 78);
  const q = t < S('C29') ? 0 : 1, id = ['C27', 'C29'][q];
  if (t < S('C27')) { kinetic('随堂两题 · 每题 3 秒', 1000, 520, 60, t, S('C26') + 0.05, { col: GOLD }); return; }
  if (q === 0) {
    const G = { cx: 960, cy: 730, ux: 95, uy: 50, x0: -3.2, x1: 3.2, y0: -2.6, y1: 4.9 };
    ctx.save(); ctx.globalAlpha *= ap(t, 'C27', 0, 0.35);
    richReveal([['f(x) = ln x', RED], [' ,   ', CR], ['g(x) = 4 − x^2', GRN]], 900, 335, 42, t, P('C27', 0.12));
    gAxes(G, 1, { grid: false, ticks: { x: [[-2, '−2'], [2, '2']] } });
    gPlot(G, x => 4 - x * x, GRN, { p: prog(t, P('C27', 0.45), 1.0) });
    mathText('4 − x^2', gx(G, 1.25) + 20, gy(G, 4 - 1.56) - 6, 34, GRN, { glow: 8, alpha: ap(t, 'C27', 0.6) });
    if (t > S('C28')) {
      const h = ap(t, 'C28', 0.05, 0.6);
      ctx.save(); ctx.globalAlpha *= h; ctx.fillStyle = hexA(GRN, 0.16); ctx.beginPath(); ctx.moveTo(gx(G, -2), gy(G, 0));
      for (let x = -2; x <= 2.001; x += 0.05) ctx.lineTo(gx(G, x), gy(G, 4 - x * x)); ctx.closePath(); ctx.fill(); ctx.restore();
      seg(gx(G, -2), gy(G, 0), gx(G, -2 + 4 * h), gy(G, 0), CYAN, 1, 8);
      openDot(gx(G, -2), gy(G, 0), 9, CYAN, h); openDot(gx(G, 2), gy(G, 0), 9, CYAN, h);
      checkMark(1380, 335, 52, GRN, t, S('C28') + 0.1); kinetic('(−2, 2)', 1380, 415, 46, t, S('C28') + 0.2, { col: GRN });
      glowText('ln 只吃正数 → 两端不取', 960, 900, 34, CR, t, P('C28', 0.55), { bold: false });
    }
    ctx.restore();
  } else {
    const G = { cx: 960, cy: 640, ux: 92, uy: 92, x0: -2.9, x1: 2.9, y0: -2.7, y1: 2.7 }, cube = x => x * x * x;
    ctx.save(); ctx.globalAlpha *= ap(t, 'C29', 0, 0.35);
    gAxes(G, 1, { grid: false });
    gPlot(G, cube, RED, { xa: -1.38, xb: 1.38, p: prog(t, P('C29', 0.3), 0.9) });
    mathText('x^3', gx(G, 1.38) + 12, gy(G, 2.55) + 10, 38, RED, { glow: 10, alpha: ap(t, 'C29', 0.45) });
    if (t > S('D05')) {
      gDiag(G, ap(t, 'D05', 0, 0.3));
      const th = Math.PI * eIO(prog(t, P('D05', 0.1), 0.8));
      foldCurve(G, cube, -1.38, 1.38, th, th > Math.PI / 2 ? INV : RED, { a: 0.95 });
      if (th >= Math.PI) mathText('∛x', gx(G, 2.6), gy(G, Math.cbrt(2.6)) - 16, 38, INV, { glow: 10, upright: true });
      checkMark(1380, 335, 52, GRN, t, S('D05') + 0.1); kinetic('有：∛x', 1380, 415, 46, t, S('D05') + 0.2, { col: GRN });
    }
    ctx.restore();
  }
  const title = ['f∘g 的定义域是？', 'x³ 有反函数吗？'][q];
  glowText(title, 960, 250, 46, CR, t, P(id, 0.04));
  circleNum(q + 1, 700, 250, 30, GOLD, t, P(id, 0.02));
  QUIZ_BEATS.forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1520, 600, 92); });
};

function drawCredits(t) {
  const t0 = E('C31') + 0.38; if (t < t0) return;
  const a = eOut(prog(t, t0, 0.5)), T = (s, y, sz, col, d, o = {}) => glowText(s, 960, y, sz, col, t, t0 + d, Object.assign({ align: 'center' }, o));
  ctx.save(); ctx.globalAlpha *= 0.93 * a; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  warp(t, 0.06 * a, W / 2, H / 2, 0.45);
  const B = { font: F_BODY, bold: false };
  T('AI娘微积分课 · 第 1 章', 215, 34, GOLD, 0.08);
  T('下一段：反三角函数', 310, 52, CR, 0.28);
  T('素材与授权说明', 450, 28, CYAN, 0.56, B);
  T('Claude / GPT 形象：ZipZipPipe（Pixiv ID 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe。', 505, 20, CR, 0.72, B);
  T('Kimi 娘立绘：ZipZipPipe（Pixiv 148186519；Bilibili 动态 1236803362705375305）。', 548, 20, CR, 0.94, B);
  T('作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用，不标 CC0/MIT。', 591, 20, CR, 1.16, B);
  T('DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。', 634, 20, CR, 1.38, B);
  T('Kimi 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', 677, 20, CR, 1.60, B);
  T('音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。', 720, 20, CR, 1.82, B);
  T('Claude、GPT、DeepSeek、Kimi 等名称与商标归各自权利人；本片为非官方、非商业学习作品。', 763, 20, CR, 2.04, B);
}

// ======================= outro =======================
SC.outro = t => {
  starfield(t); blueprint(ap(t, 'C30', 0, 0.5), 82);
  const items = [['f∘g ≠ g∘f', '顺序', RED], ['g(x) ∈ D_f', '定义域', CYAN], ['一一对应', '可逆', GRN, true], ['写 · 解 · 换', '三步', INV, true]];
  items.forEach(([m, s, col, up], i) => {
    const x = 690 + i * 235, y = 500, a = ap(t, 'C30', 0.08 + i * 0.12, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, 0.08); ctx.beginPath(); ctx.arc(x, y, 108, 0, 7); ctx.fill(); ctx.restore();
    ring(x, y, 108, col, 0.8 * a, a);
    const sz = mathW(m, 40) > 180 ? Math.floor(40 * 180 / mathW(m, 40)) : 40;
    mathText(m, x, y + sz * 0.32, sz, col, { align: 'center', glow: 12, alpha: a, upright: up });
    glowText(s, x, y + 160, 40, CR, t, P('C30', 0.12 + i * 0.12));
    sparks(t, P('C30', 0.08 + i * 0.12) + 0.3, x, y, { col: [col, '#ffffff'], n: 12, speed: 260 });
  });
  glowText('复合看定义域和顺序；反函数先查一一对应', 1040, 790, 42, CR, t, P('C30', 0.55));
  glowText('下一段：三角函数怎么倒过来？—— 反三角函数', 1040, 870, 34, CYAN, t, P('C31', 0.2));
  drawCredits(t);
};

SC.__overlay = t => { if (t < E('C31') + 0.25) lecturer(t, 'C', 255, -5, E('C31') + 0.48, { h: 710 }); };
SC.__noTag = E('C31') + 0.30;
function drawFrame(t) { composeFrame(t, SC, TITLES); }

(function registerP4Sfx() {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  // hook
  s('D01', 0.08, 'pluck', 0.28); s('D01', 0.2, 'pluck', 0.26); s('D01', 0.72, 'pop', 0.3);
  s('C01', 0.03, 'swoosh_soft', 0.3); s('C01', 0.1, 'buzz', 0.2); s('C01', 0.14, 'click', 0.3); s('C01', 0.22, 'click', 0.3);
  sfx(P('C01', 0.3) + D('C01') * 0.2, 'tick', 0.24); sfx(P('C01', 0.3) + D('C01') * 0.45, 'tick', 0.24); s('C01', 0.62, 'soft_hit', 0.32);
  sfx(P('C02', 0.15) + 0.35, 'marimba', 0.36); sfx(P('C02', 0.55) + 0.35, 'marimba_hi', 0.36); s('C02', 0.7, 'swoosh_soft', 0.28);
  // comp
  typeSfx(P('C03', 0.03), 10, 1.0, 0.14); s('C03', 0.2, 'click', 0.28); s('C03', 0.55, 'tick', 0.22); s('C03', 0.72, 'tick', 0.22);
  s('C04', 0.04, 'pluck', 0.24); s('C04', 0.3, 'swoosh_soft', 0.24); s('C04', 0.55, 'pluck', 0.26);
  { const T0 = P('C05', 0.15), dt = (P('C06', 0.55) - T0) / 12;
    XS.forEach((x, i) => { const ts = T0 + i * dt; if (1 - x * x < -1e-9) sfx(ts + 1.25, 'thud', 0.14); else sfx(ts + 2.0, 'tinkle', 0.14); }); }
  s('C06', 0.08, 'type', 0.18); s('C07', 0.04, 'pluck', 0.24); s('C07', 0.45, 'ding', 0.36);
  s('G01', 0.12, 'swoosh_soft', 0.3); s('G01', 0.06, 'bell_soft', 0.3);
  // order
  typeSfx(P('C08', 0.03), 8, 0.8, 0.12); s('C08', 0.25, 'type', 0.16); s('C08', 0.1, 'pluck', 0.24); s('C08', 0.62, 'pluck', 0.26); s('C08', 0.8, 'buzz', 0.16);
  s('C09', 0.05, 'tick', 0.22); s('C09', 0.2, 'tick', 0.22); s('C09', 0.42, 'slam', 0.4);
  // chain
  s('C10', 0.45, 'shimmer', 0.28); s('K01', 0.1, 'click', 0.26);
  [0.22, 0.48, 0.72].forEach((f, i) => s('K01', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.32));
  [0.04, 0.14, 0.24].forEach(f => s('K02', f, 'type', 0.18));
  { const st = (P('K02', 0.92) - P('K02', 0.58)) / 6; for (let k = 0; k < 6; k++) sfx(P('K02', 0.58) + k * st, 'tick2', 0.22); }
  s('K02', 0.92, 'check', 0.34); s('C11', 0.1, 'swoosh_in', 0.28); s('C11', 0.15, 'bell_soft', 0.28);
  // inv
  s('D03', 0.1, 'pluck', 0.28); s('D03', 0.55, 'pop', 0.28);
  s('C12', 0.06, 'swoosh_soft', 0.28); s('C12', 0.5, 'warp', 0.24); s('C12', 0.62, 'shimmer', 0.26);
  s('C13', 0.12, 'swoosh_soft', 0.24); sfx(P('C13', 0.32) + 0.5, 'buzz', 0.2); s('C13', 0.52, 'swoosh_soft', 0.24); s('C13', 0.75, 'buzz', 0.2);
  s('C14', 0.04, 'swoosh_soft', 0.26); sfx(P('C14', 0.3) + 0.2, 'ding_hi', 0.36);
  typeSfx(P('C15', 0.04), 8, 0.9, 0.13); s('C15', 0.25, 'warp', 0.2); s('C15', 0.6, 'swoosh_soft', 0.26); sfx(P('C15', 0.6) + 0.9, 'sparkle', 0.28);
  s('G02', 0.1, 'impact', 0.34); s('G02', 0.42, 'check', 0.32); s('G02', 0.62, 'soft_hit', 0.3);
  // test
  s('C16', 0.05, 'pluck', 0.24); s('C16', 0.35, 'riser', 0.16); s('C16', 0.5, 'buzz', 0.2);
  s('C17', 0.03, 'pluck', 0.24); s('C17', 0.3, 'tick', 0.22); s('C17', 0.62, 'ding', 0.32);
  s('C18', 0.2, 'crack', 0.26); s('C18', 0.62, 'swoosh_soft', 0.28); sfx(P('C18', 0.62) + 0.9, 'sparkle', 0.28);
  s('C19', 0.04, 'pluck', 0.24); s('C19', 0.2, 'tick', 0.22); s('C19', 0.36, 'buzz', 0.16); s('C19', 0.62, 'check', 0.3); s('C19', 0.78, 'swoosh_soft', 0.26); sfx(P('C19', 0.78) + 0.8, 'ding_hi', 0.32);
  // graph
  s('C20', 0.08, 'pluck', 0.24); s('C20', 0.22, 'pop', 0.26); s('C20', 0.4, 'warp', 0.26); sfx(P('C20', 0.4) + 1.4, 'sparkle', 0.3);
  s('C21', 0.12, 'pluck', 0.24); s('C21', 0.45, 'warp', 0.26); sfx(P('C21', 0.45) + 1.2, 'ding_hi', 0.36);
  // find
  [0.05, 0.33, 0.61].forEach((f, i) => s('C22', f, ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.3));
  [0.05, 0.42, 0.72].forEach(f => typeSfx(P('C23', f), 6, 0.5, 0.12));
  s('C24', 0.08, 'type', 0.16); sfx(P('C24', 0.35) + 0.22, 'tick2', 0.32); s('C24', 0.62, 'type', 0.16);
  [0.04, 0.16, 0.26].forEach(f => sfx(P('C25', f) + 0.22, 'tick2', 0.3)); sfx(P('C25', 0.34) + 0.5, 'ding_hi', 0.38); sfx(P('C25', 0.34) + 0.5, 'sparkle', 0.28);
  s('D04', 0.08, 'pop', 0.3);
  // quiz
  s('C26', 0.05, 'pop', 0.3);
  QUIZ_BEATS.forEach(b => countdownSfx(b.vo));
  ['C28', 'D05'].forEach(id => sfx(S(id) + 0.1, 'check', 0.4)); s('D05', 0.1, 'swoosh_soft', 0.28);
  // outro
  [0.08, 0.2, 0.32, 0.44].forEach((f, i) => s('C30', f, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.3));
  s('C31', 0.3, 'swell', 0.32);
})();
finalize();
