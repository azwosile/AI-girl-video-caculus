// c7kit.js —— 第 7 章《积分技巧》专用：擂台答案卡、工具箱、表格法、梯形 / 中点 / 辛普森逼近。（11-12）
const CREDIT_TM7 = CREDIT_TM5;

// ---------- 擂台 ----------
// 擂台横幅：title 居中，两侧小三角旗
function ringBanner(x, y, title, t, t0, o = {}) {
  const p = eBack(prog(t, t0, 0.5)); if (p <= 0) return; const a = clamp(p) * (o.alpha ?? 1), col = o.col || SQ.X.col, w = o.w || 420;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(p, 1);
  ctx.fillStyle = 'rgba(40,10,14,0.88)'; ctx.strokeStyle = '#E8553A'; ctx.lineWidth = 3; ctx.shadowColor = '#E8553A'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.moveTo(-w / 2 - 30, -30); ctx.lineTo(w / 2 + 30, -30); ctx.lineTo(w / 2, 0); ctx.lineTo(w / 2 + 30, 30); ctx.lineTo(-w / 2 - 30, 30); ctx.lineTo(-w / 2, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  label(title, x, y, o.size || 34, col === SQ.X.col ? GOLD : col, a, { bold: true });
}
// 答案卡：左侧名字色块 + 右侧公式；o.shake 抖动时刻，o.ok 打勾时刻
function answerCard(x, y, w, name, col, expr, t, t0, o = {}) {
  const p = eOut(prog(t, t0, 0.4)); if (p <= 0) return; const a = clamp(p) * (o.alpha ?? 1); const h = o.h || 74;
  const dx = (1 - p) * 160 + (o.shake ? shake(t, o.shake, 7, 0.5)[0] : 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(dx, 0);
  ctx.fillStyle = 'rgba(12,18,38,0.88)'; ctx.strokeStyle = hexA(col, 0.9); ctx.lineWidth = 2.5; rr(x - w / 2, y - h / 2, w, h, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = hexA(col, 0.85); rr(x - w / 2, y - h / 2, 128, h, 12); ctx.fill();
  ctx.restore();
  label(name, x - w / 2 + 64 + dx, y, 24, '#0B1022', a, { bold: true });
  mathText(expr, x - w / 2 + 150 + dx, y + 10, o.size || 32, CR, { alpha: a, upright: true });
  if (o.ok !== undefined) checkMark(x + w / 2 - 40 + dx, y, 20, GRN, t, o.ok, a);
}
// 题卡（大号）：∫… = ？
function questionCard(x, y, w, h, head, expr, t, t0, o = {}) {
  const p = eBack(prog(t, t0, 0.45)); if (p <= 0) return; const a = clamp(p) * (o.alpha ?? 1), col = o.col || GOLD;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 14; rr(-w / 2, -h / 2, w, h, 16); ctx.fill(); ctx.stroke(); ctx.restore();
  if (head) label(head, x - w / 2 + 70, y, 22, col, a, { bold: true });
  mathText(expr, x + (head ? 40 : 0), y + 12, o.size || 38, CR, { align: 'center', alpha: a, upright: true });
}

// ---------- 工具箱 ----------
// tools: [[文字, 颜色], ...]；按列排布，t0s[i] 为第 i 件点亮的时刻
function toolGrid(x, y, tools, cols, t, t0s, o = {}) {
  const cw = o.cw || 210, chh = o.ch || 72, gap = o.gap || 18, rows = Math.ceil(tools.length / cols);
  const X0 = x - (cols * cw + (cols - 1) * gap) / 2, Y0 = y - (rows * chh + (rows - 1) * gap) / 2;
  tools.forEach(([s, c], i) => {
    const p = eBack(prog(t, t0s[i] ?? t0s[0] + i * 0.12, 0.4)); if (p <= 0) return;
    const cx = X0 + (i % cols) * (cw + gap) + cw / 2, cy = Y0 + Math.floor(i / cols) * (chh + gap) + chh / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p); panel(-cw / 2, -chh / 2, cw, chh, c, (o.alpha ?? 1)); ctx.restore();
    label(s, cx, cy, o.size || 24, c, clamp(p) * (o.alpha ?? 1), { bold: true });
  });
}

// ---------- 表格法（分部积分） ----------
// D：逐次求导列（字符串），I：逐次积分列；斜箭头配 + − 交替
function tabular(x, y, D, I, t, t0, o = {}) {
  const dy = o.dy || 64, cw = o.cw || 230, a0 = o.alpha ?? 1, sz = o.size || 30;
  label('求导 u', x - cw / 2, y - dy * 0.85, 22, CYAN, clamp(prog(t, t0, 0.3)) * a0, { bold: true });
  label('积分 dv', x + cw / 2, y - dy * 0.85, 22, GOLD, clamp(prog(t, t0, 0.3)) * a0, { bold: true });
  const n = Math.max(D.length, I.length);
  for (let i = 0; i < n; i++) {
    const ti = t0 + 0.25 + i * (o.step || 0.45), a = clamp(prog(t, ti, 0.3)) * a0; if (a <= 0) continue;
    if (D[i]) mathText(D[i], x - cw / 2, y + i * dy + 10, sz, CYAN, { align: 'center', alpha: a, upright: true });
    if (I[i]) mathText(I[i], x + cw / 2, y + i * dy + 10, sz, GOLD, { align: 'center', alpha: a, upright: true });
    if (i < n - 1 && D[i] && I[i + 1] && D[i] !== '0') {
      const q = eOut(prog(t, ti + 0.2, 0.35)); if (q <= 0) continue;
      const xa = x - cw / 2 + 60, ya = y + i * dy + 6, xb = x + cw / 2 - 70, yb = y + (i + 1) * dy - 4;
      seg(xa, ya, lerp(xa, xb, q), lerp(ya, yb, q), i % 2 ? RED : GRN, a * 0.85, 2.5);
      label(i % 2 ? '−' : '+', (xa + xb) / 2, (ya + yb) / 2 - 16, 26, i % 2 ? RED : GRN, a * q, { bold: true });
    }
  }
}

// ---------- 数值积分 ----------
// 梯形：n 个梯形；中点：mode 'mid' 用 gRects（c5kit）
function gTrap(G, f, xa, xb, n, col, a, o = {}) {
  if (a <= 0) return; const h = (xb - xa) / n; ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < n; i++) {
    const x0 = xa + i * h, x1 = x0 + h; ctx.beginPath(); ctx.moveTo(gx(G, x0), gy(G, 0)); ctx.lineTo(gx(G, x0), gy(G, f(x0))); ctx.lineTo(gx(G, x1), gy(G, f(x1))); ctx.lineTo(gx(G, x1), gy(G, 0)); ctx.closePath();
    ctx.fillStyle = hexA(col, o.fa ?? 0.28); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = o.w || 2; ctx.stroke();
  }
  ctx.restore();
}
// 辛普森：每两段一条过三点的抛物线（n 为偶数）
function gSimpson(G, f, xa, xb, n, col, a, o = {}) {
  if (a <= 0) return; const h = (xb - xa) / n; ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < n; i += 2) {
    const x0 = xa + i * h, x1 = x0 + h, x2 = x0 + 2 * h, y0 = f(x0), y1 = f(x1), y2 = f(x2);
    const P = x => y0 * (x - x1) * (x - x2) / (2 * h * h) - y1 * (x - x0) * (x - x2) / (h * h) + y2 * (x - x0) * (x - x1) / (2 * h * h);
    ctx.beginPath(); ctx.moveTo(gx(G, x0), gy(G, 0));
    for (let k = 0; k <= 24; k++) { const x = x0 + 2 * h * k / 24; ctx.lineTo(gx(G, x), gy(G, P(x))); }
    ctx.lineTo(gx(G, x2), gy(G, 0)); ctx.closePath(); ctx.fillStyle = hexA(col, o.fa ?? 0.28); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = o.w || 2; ctx.stroke();
    [x0, x1, x2].forEach(x => glowDot(gx(G, x), gy(G, f(x)), 4, col, 1));
  }
  ctx.restore();
}
const trapRule = (f, a, b, n) => { const h = (b - a) / n; let s = (f(a) + f(b)) / 2; for (let i = 1; i < n; i++) s += f(a + i * h); return s * h; };
const midRule = (f, a, b, n) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h); return s * h; };
const simpRule = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return s * h / 3; };

// ---------- 通用小件 ----------
// 金框结论条
function goldBox(x, y, w, h, s, size, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,200,60,0.12)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; rr(x - w / 2, y - h / 2, w, h, 14); ctx.fill(); ctx.stroke(); ctx.restore(); mathText(s, x, y + size * 0.3, size, GOLD, { align: 'center', alpha: a, upright: true }); }
// 暗底说明板
function darkBox(x, y, w, h, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,28,0.92)'; rr(x, y, w, h, 14); ctx.fill(); ctx.restore(); }
// 直角三角形（直角在右下）：labs = [斜边, 对边(竖), 邻边(横)]，p = 绘制进度
function rightTri(x, y, w, h, labs, col, a, p = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = hexA(col, 0.12 * p);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * Math.min(1, p * 3), y); if (p > 0.33) ctx.lineTo(x + w, y - h * Math.min(1, (p - 0.33) * 3)); if (p > 0.66) ctx.lineTo(lerp(x + w, x, Math.min(1, (p - 0.66) * 3)), lerp(y - h, y, Math.min(1, (p - 0.66) * 3))); ctx.fill(); ctx.stroke();
  if (p >= 1) { ctx.strokeRect(x + w - 16, y - 16, 16, 16); ctx.beginPath(); ctx.arc(x, y, 40, -Math.atan2(h, w), 0); ctx.stroke(); }
  ctx.restore(); if (p < 1) return;
  label('θ', x + 60, y - 16, 24, col, a, {});
  mathText(labs[0], x + w / 2 - 20, y - h / 2 - 20, 26, CR, { align: 'right', alpha: a, upright: true });
  mathText(labs[1], x + w + 14, y - h / 2 + 9, 26, CR, { alpha: a, upright: true });
  mathText(labs[2], x + w / 2, y + 36, 26, CR, { align: 'center', alpha: a, upright: true });
}
