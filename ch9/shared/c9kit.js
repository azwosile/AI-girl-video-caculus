// c9kit.js —— 第 9 章《微分方程》专用：方向场、解曲线（RK4）、欧拉折线、水箱、温度计、奶茶杯、RL 电路、相图、兔与狼、竖直弹簧、特征根平面。（11-12）
const CREDIT_TM9 = CREDIT_TM5;

// ---------- 数值积分 ----------
// RK4：y' = F(x, y)，从 (x0, y0) 积到 x1，n 步；返回 [[x, y], ...]
function rk4(F, x0, y0, x1, n = 200) {
  const h = (x1 - x0) / n, pts = [[x0, y0]]; let x = x0, y = y0;
  for (let i = 0; i < n; i++) {
    const k1 = F(x, y), k2 = F(x + h / 2, y + h * k1 / 2), k3 = F(x + h / 2, y + h * k2 / 2), k4 = F(x + h, y + h * k3);
    y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h; if (!isFinite(y) || Math.abs(y) > 1e6) break; pts.push([x, y]);
  }
  return pts;
}
// 方程组 x' = f(x, y)，y' = g(x, y)（自变量 t），返回 [[x, y], ...]
function rk4sys(f, g, x0, y0, T, n = 600) {
  const h = T / n, pts = [[x0, y0]]; let x = x0, y = y0;
  for (let i = 0; i < n; i++) {
    const a1 = f(x, y), b1 = g(x, y), a2 = f(x + h * a1 / 2, y + h * b1 / 2), b2 = g(x + h * a1 / 2, y + h * b1 / 2);
    const a3 = f(x + h * a2 / 2, y + h * b2 / 2), b3 = g(x + h * a2 / 2, y + h * b2 / 2), a4 = f(x + h * a3, y + h * b3), b4 = g(x + h * a3, y + h * b3);
    x += h * (a1 + 2 * a2 + 2 * a3 + a4) / 6; y += h * (b1 + 2 * b2 + 2 * b3 + b4) / 6; pts.push([x, y]);
  }
  return pts;
}
// 画坐标点列（G 为 c2kit 坐标系），p ∈ [0,1] 画出比例；超出 y 范围的点截断
function gPath(G, pts, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0 || pts.length < 2) return;
  const m = Math.max(2, Math.round(pts.length * p)); const ylo = o.ylo ?? G.y0 - (G.y1 - G.y0) * 0.02, yhi = o.yhi ?? G.y1 + (G.y1 - G.y0) * 0.02;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = o.w || 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = o.glow ?? 10;
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); let pen = false;
  for (let i = 0; i < m; i++) { const [x, y] = pts[i]; if (y < ylo || y > yhi || x < G.x0 - 1e-9 || x > G.x1 + 1e-9) { pen = false; continue; } ctx[pen ? 'lineTo' : 'moveTo'](gx(G, x), gy(G, y)); pen = true; }
  ctx.stroke(); ctx.restore();
  if (o.head) { const [x, y] = pts[m - 1]; if (y >= ylo && y <= yhi) glowDot(gx(G, x), gy(G, y), 7, col, a); }
}

// ---------- 方向场 ----------
// y' = F(x, y) 的方向场：网格步长 o.sx、o.sy，线段长 o.len 像素；o.p 从左到右扫出；o.hi(x, y) 返回 true 的点高亮
function slopeField(G, F, a, o = {}) {
  if (a <= 0) return; const sx = o.sx || 1, sy = o.sy || 1, L = o.len || Math.min(sx * G.ux, sy * G.uy) * 0.62, p = o.p ?? 1, col = o.col || 'rgba(92,200,232,0.75)';
  ctx.save(); ctx.lineCap = 'round';
  for (let x = Math.ceil(G.x0 / sx) * sx + (o.ox || 0); x <= G.x1 + 1e-9; x += sx) {
    const k = clamp(((p * (G.x1 - G.x0 + 2 * sx)) - (x - G.x0)) / sx); if (k <= 0) continue;
    for (let y = Math.ceil(G.y0 / sy) * sy + (o.oy || 0); y <= G.y1 + 1e-9; y += sy) {
      const m = F(x, y); if (!isFinite(m)) continue; const X = gx(G, x), Y = gy(G, y);
      const dx = G.ux, dy = -m * G.uy, n = Math.hypot(dx, dy), ux = dx / n * L / 2, uy = dy / n * L / 2, hl = o.hi && o.hi(x, y);
      ctx.globalAlpha = a * k * (hl ? 1 : (o.dim ?? 1)); ctx.strokeStyle = hl ? (o.hiCol || GOLD) : col; ctx.lineWidth = hl ? 3.5 : (o.w || 2.4);
      ctx.beginPath(); ctx.moveTo(X - ux, Y - uy); ctx.lineTo(X + ux, Y + uy); ctx.stroke();
    }
  }
  ctx.restore();
}
// 方程组的方向场（相平面）：箭头方向 (f, g)，按像素归一化
function sysField(G, f, g, a, o = {}) {
  if (a <= 0) return; const sx = o.sx, sy = o.sy, L = o.len || 26, col = o.col || 'rgba(92,200,232,0.7)';
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
  for (let x = Math.ceil(G.x0 / sx) * sx + (o.ox || 0); x <= G.x1 + 1e-9; x += sx) for (let y = Math.ceil(G.y0 / sy) * sy + (o.oy || 0); y <= G.y1 + 1e-9; y += sy) {
    const u = f(x, y) * G.ux, v = -g(x, y) * G.uy, n = Math.hypot(u, v); if (!(n > 0)) continue; const X = gx(G, x), Y = gy(G, y), ex = u / n * L / 2, ey = v / n * L / 2;
    ctx.beginPath(); ctx.moveTo(X - ex, Y - ey); ctx.lineTo(X + ex, Y + ey); ctx.stroke();
    const ang = Math.atan2(ey, ex); ctx.beginPath(); ctx.moveTo(X + ex, Y + ey); ctx.lineTo(X + ex - 8 * Math.cos(ang - 0.45), Y + ey - 8 * Math.sin(ang - 0.45)); ctx.lineTo(X + ex - 8 * Math.cos(ang + 0.45), Y + ey - 8 * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
// 过 (x0, y0) 的解曲线：向右积到 G.x1、向左积到 o.xa（默认 G.x0）；p 为画出比例
function solCurve(G, F, x0, y0, col, o = {}) {
  const R = rk4(F, x0, y0, o.xb ?? G.x1, o.n || 240), Lp = (o.xa ?? G.x0) < x0 ? rk4(F, x0, y0, o.xa ?? G.x0, o.n || 240) : [];
  gPath(G, R, col, o); if (Lp.length > 1) gPath(G, Lp, col, o);
  if (o.dot !== false) gDot(G, x0, y0, col, o.a ?? 1);
}
// 欧拉折线：从 (x0, y0) 步长 h 走 n 步；k 为已显示步数（可为小数）；o.tan 显示每步的切线方向延长；返回各点
function eulerPts(F, x0, y0, h, n) { const pts = [[x0, y0]]; let x = x0, y = y0; for (let i = 0; i < n; i++) { y += h * F(x, y); x += h; pts.push([x, y]); } return pts; }
function eulerPath(G, F, x0, y0, h, n, k, col, a = 1, o = {}) {
  if (a <= 0) return; const pts = eulerPts(F, x0, y0, h, n);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = o.w || 4; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(gx(G, x0), gy(G, y0));
  for (let i = 1; i <= n; i++) { const f = clamp(k - (i - 1)); if (f <= 0) break; const [xa, ya] = pts[i - 1], [xb, yb] = pts[i]; ctx.lineTo(gx(G, xa + (xb - xa) * f), gy(G, ya + (yb - ya) * f)); }
  ctx.stroke(); ctx.restore();
  for (let i = 0; i <= n; i++) { if (k < i - 0.02) break; gDot(G, pts[i][0], pts[i][1], col, a); if (o.labels && i > 0 && o.labels[i]) label(o.labels[i], gx(G, pts[i][0]) + (o.lx ?? -12), gy(G, pts[i][1]) + (o.ly ?? -26), o.ls || 22, col, a * clamp(k - i + 1), { bold: true }); }
  return pts;
}

// ---------- 水箱（混合问题） ----------
// 中心 (x, y)，宽 w，高 h；lvl 水位 0–1；conc 浓度 0–1（越大越偏金色）；t 用于水流动画；o.inLab/o.outLab 进出口文字
function tank(x, y, w, h, lvl, conc, t, a = 1, o = {}) {
  if (a <= 0) return; const L = x - w / 2, T = y - h / 2, B = y + h / 2, wl = B - h * lvl;
  ctx.save(); ctx.globalAlpha *= a;
  const c0 = [92, 200, 232], c1 = [255, 200, 60], cc = c0.map((v, i) => Math.round(v + (c1[i] - v) * clamp(conc)));
  ctx.fillStyle = `rgba(${cc[0]},${cc[1]},${cc[2]},0.42)`; ctx.fillRect(L, wl, w, B - wl);
  ctx.strokeStyle = `rgba(${cc[0]},${cc[1]},${cc[2]},0.9)`; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i <= 40; i++) { const X = L + w * i / 40; ctx[i ? 'lineTo' : 'moveTo'](X, wl + 4 * Math.sin(i * 0.7 + t * 3)); } ctx.stroke();
  // 盐粒
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; const ns = Math.round(10 + 50 * clamp(conc));
  for (let i = 0; i < ns; i++) { const px = L + 12 + (w - 24) * rnd(i * 3 + 1), py = wl + 10 + (B - wl - 20) * ((rnd(i * 3 + 2) + t * 0.05 * (0.5 + rnd(i))) % 1); ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 7); ctx.fill(); }
  // 箱壁
  ctx.strokeStyle = CR; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(L + w, B); ctx.lineTo(L + w, T); ctx.stroke();
  // 进水管（左上）与出水管（右下）
  ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(237,230,216,0.7)'; ctx.beginPath(); ctx.moveTo(L - 90, T + 10); ctx.lineTo(L + 24, T + 10); ctx.lineTo(L + 24, T + 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(L + w, B - 18); ctx.lineTo(L + w + 90, B - 18); ctx.stroke();
  // 流动的水滴
  ctx.fillStyle = GOLD; for (let i = 0; i < 4; i++) { const f = (t * 0.9 + i / 4) % 1; ctx.beginPath(); ctx.arc(L - 90 + 114 * f, T + 10, 4, 0, 7); ctx.fill(); }
  ctx.fillStyle = `rgb(${cc[0]},${cc[1]},${cc[2]})`; for (let i = 0; i < 4; i++) { const f = (t * 0.9 + i / 4) % 1; ctx.beginPath(); ctx.arc(L + w + 90 * f, B - 18, 4, 0, 7); ctx.fill(); }
  ctx.restore();
  if (o.inLab) label(o.inLab, L - 40, T - 26, o.ls || 22, GOLD, a, { bold: true });
  if (o.outLab) label(o.outLab, L + w + 50, B + 22, o.ls || 22, CYAN, a, { bold: true });
  if (o.mid) label(o.mid, x, y + h * 0.22, o.ms || 28, '#ffffff', a, { bold: true });
}

// ---------- 温度计 / 奶茶杯 ----------
function thermo(x, y, h, T, Tmin, Tmax, a = 1, o = {}) {
  if (a <= 0) return; const f = clamp((T - Tmin) / (Tmax - Tmin)), top = y - h / 2, bot = y + h / 2, col = o.col || RED;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(237,230,216,0.12)'; ctx.strokeStyle = CR; ctx.lineWidth = 3;
  rr(x - 13, top, 26, h, 13); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, bot + 16, 24, 0, 7); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; rr(x - 7, top + 8 + (h - 16) * (1 - f), 14, (h - 16) * f + 12, 7); ctx.fill(); ctx.restore();
  label(`${Math.round(T)}°C`, x + 34, top + 8 + (h - 16) * (1 - f), o.size || 28, col, a, { bold: true, align: 'left' });
}
function teaCup(x, y, s, steam, t, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(214,170,120,0.9)'; ctx.strokeStyle = CR; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, -60); ctx.lineTo(50, -60); ctx.lineTo(38, 60); ctx.lineTo(-38, 60); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2618'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-26 + 9 * i, 46 - 6 * (i % 2), 6, 0, 7); ctx.fill(); }
  ctx.strokeStyle = SQ.Q.col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(14, -95); ctx.lineTo(4, 40); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(-54, -70, 108, 12);
  if (steam > 0) { ctx.strokeStyle = `rgba(255,255,255,${0.5 * steam})`; ctx.lineWidth = 4; for (let k = -1; k <= 1; k++) { ctx.beginPath(); for (let i = 0; i <= 20; i++) { const yy = -80 - i * 4, xx = k * 22 + 7 * Math.sin(i * 0.5 + t * 4 + k); ctx[i ? 'lineTo' : 'moveTo'](xx, yy); } ctx.stroke(); } }
  ctx.restore();
}

// ---------- RL 电路 ----------
// 矩形回路，左边电池、上边开关、右边电阻、下边电感；I 当前电流（0–1 归一）控制电流点速度和亮度；o.on 开关闭合程度 0–1
function circuitRL(x, y, w, h, t, a = 1, o = {}) {
  if (a <= 0) return; const L = x - w / 2, R = x + w / 2, T = y - h / 2, B = y + h / 2, on = clamp(o.on ?? 1), I = clamp(o.I ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CR; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(L, y - 30); ctx.lineTo(L, T); ctx.lineTo(x - 50, T); ctx.moveTo(x + 40, T); ctx.lineTo(R, T); ctx.lineTo(R, y - 60);
  ctx.moveTo(R, y + 60); ctx.lineTo(R, B); ctx.lineTo(x + 80, B); ctx.moveTo(x - 80, B); ctx.lineTo(L, B); ctx.lineTo(L, y + 30); ctx.stroke();
  // 电池
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(L - 28, y - 30); ctx.lineTo(L + 28, y - 30); ctx.stroke(); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(L - 14, y + 30); ctx.lineTo(L + 14, y + 30); ctx.stroke();
  // 开关
  ctx.lineWidth = 4; const ang = -0.6 * (1 - on); ctx.beginPath(); ctx.moveTo(x - 50, T); ctx.lineTo(x - 50 + 90 * Math.cos(ang), T + 90 * Math.sin(ang)); ctx.stroke(); glowDot(x - 50, T, 6, CR, 1); glowDot(x + 40, T, 6, CR, 1);
  // 电阻（锯齿）
  ctx.strokeStyle = GOLD; ctx.beginPath(); ctx.moveTo(R, y - 60); for (let i = 1; i <= 8; i++) ctx.lineTo(R + (i % 2 ? 16 : -16), y - 60 + 15 * i); ctx.lineTo(R, y + 60); ctx.stroke();
  // 电感（线圈）
  ctx.strokeStyle = CYAN; ctx.beginPath(); for (let i = 0; i < 4; i++) ctx.arc(x - 60 + 40 * i, B, 20, Math.PI, 0, false); ctx.stroke();
  ctx.restore();
  label('E', L - 50, y, 30, CR, a, { bold: true }); label('R', R + 44, y, 30, GOLD, a, { bold: true }); label('L', x, B + 46, 30, CYAN, a, { bold: true });
  // 电流点
  if (I > 0.01 && on > 0.98) {
    const per = 2 * (w + h), pos = s => { s = ((s % per) + per) % per; if (s < h) return [L, B - s]; s -= h; if (s < w) return [L + s, T]; s -= w; if (s < h) return [R, T + s]; s -= h; return [R - s, B]; };
    ctx.save(); ctx.globalAlpha *= a * (0.3 + 0.7 * I); ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 10;
    const off = (o.phase ?? t * 260 * I); for (let k = 0; k < 18; k++) { const [px, py] = pos(off + k * per / 18); ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill(); }
    ctx.restore();
  }
}

// ---------- 兔与狼（简笔图标） ----------
function bunnyIcon(x, y, s, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(-8, -30, 6, 18, -0.15, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(8, -30, 6, 18, 0.15, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 26, 20, 16, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#10131c'; ctx.beginPath(); ctx.arc(-6, -2, 2.6, 0, 7); ctx.arc(6, -2, 2.6, 0, 7); ctx.fill(); ctx.restore();
}
function wolfIcon(x, y, s, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(-20, -8); ctx.lineTo(-16, -34); ctx.lineTo(-4, -16); ctx.lineTo(4, -16); ctx.lineTo(16, -34); ctx.lineTo(20, -8); ctx.lineTo(10, 12); ctx.lineTo(0, 20); ctx.lineTo(-10, 12); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 40, 22, 18, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffdd66'; ctx.beginPath(); ctx.arc(-7, -4, 2.8, 0, 7); ctx.arc(7, -4, 2.8, 0, 7); ctx.fill(); ctx.restore();
}

// ---------- 竖直弹簧振子 ----------
// 天花板在 (x, y0)，平衡位置弹簧长 L0 像素，位移 d 像素（向下为正）；o.m 质量块文字
function springMass(x, y0, L0, d, a = 1, o = {}) {
  if (a <= 0) return; const y1 = y0 + L0 + d, coils = o.coils || 10, amp = o.amp || 22;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 90, y0); ctx.lineTo(x + 90, y0); ctx.stroke();
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(x - 84 + i * 28, y0); ctx.lineTo(x - 100 + i * 28, y0 - 16); ctx.stroke(); }
  ctx.strokeStyle = o.col || CYAN; ctx.lineWidth = 3.5; ctx.shadowColor = o.col || CYAN; ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + 16);
  const n = coils * 2; for (let i = 1; i < n; i++) ctx.lineTo(x + (i % 2 ? amp : -amp), y0 + 16 + (y1 - y0 - 32) * i / n); ctx.lineTo(x, y1 - 16); ctx.lineTo(x, y1); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = o.boxCol || SQ.X.col; ctx.strokeStyle = CR; ctx.lineWidth = 3; rr(x - 46, y1, 92, 70, 10); ctx.fill(); ctx.stroke(); ctx.restore();
  label(o.m || 'm', x, y1 + 36, 32, '#10131c', a, { bold: true });
  if (o.eq !== undefined) seg(x - 130, y0 + L0 + 35, x + 130, y0 + L0 + 35, GOLD, a * 0.6, 2, [8, 6]);
}

// ---------- 复平面上的特征根 ----------
function rootPlane(cx, cy, u, roots, a = 1, o = {}) {
  if (a <= 0) return; const R = o.R || 3; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.6)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - R * u, cy); ctx.lineTo(cx + R * u, cy); ctx.moveTo(cx, cy + R * u); ctx.lineTo(cx, cy - R * u); ctx.stroke(); ctx.restore();
  label('Re', cx + R * u + 22, cy + 22, 22, CR, a); label('Im', cx + 24, cy - R * u - 10, 22, CR, a);
  roots.forEach((r, i) => { const k = o.t === undefined ? 1 : clamp((o.t - i * 0.2) / 0.3); if (k <= 0) return; glowDot(cx + r[0] * u, cy - r[1] * u, 10, r[2] || GOLD, a * k); if (r[3]) label(r[3], cx + r[0] * u + (r[4] ?? 0), cy - r[1] * u - 28, 24, r[2] || GOLD, a * k, { bold: true }); });
}

// ---------- “进来的 − 出去的” 天平卡 ----------
function inOutCard(x, y, w, inTxt, outTxt, t, t0, o = {}) {
  const p = eBack(prog(t, t0, 0.45)); if (p <= 0) return; const a = clamp(p) * (o.alpha ?? 1), h = o.h || 120;
  panel(x - w / 2, y - h / 2, w, h, o.col || GOLD, a);
  label('进来的', x - w / 4, y - 26, 26, GOLD, a, { bold: true }); label('出去的', x + w / 4, y - 26, 26, CYAN, a, { bold: true });
  label(inTxt, x - w / 4, y + 22, o.size || 32, '#ffffff', a, { bold: true }); label(outTxt, x + w / 4, y + 22, o.size || 32, '#ffffff', a, { bold: true });
  label('−', x, y + 4, 44, CR, a, { bold: true });
}
