// c6kit.js —— 第 6 章《积分的应用》专用：曲线间面积、伪 3D 旋转体（圆盘 / 垫圈 / 柱壳）、硬币摞、弹簧、水箱。（11-12）
// 伪 3D 约定：转轴水平（axis 'x'）时，垂直于轴的圆投影成椭圆，竖半轴 = ρ·uy，横半轴 = ρ·uy·e（e 默认 0.3）。
// 转轴竖直（axis 'y'）时，横半轴 = ρ·ux，竖半轴 = ρ·ux·e。点 (t, ρ, φ)：φ = 0 在纸面内（原平面区域），φ 增大转向观众。
const C6 = { solid: CYAN, wash: GOLD, shell: '#FF8A3D', hole: 'rgba(6,10,24,0.92)', e: 0.3 };
const CREDIT_TM6 = CREDIT_TM5;

// ---------- 曲线间面积 ----------
function gBetween(G, f, g, xa, xb, a, o = {}) {
  if (a <= 0) return; const p = clamp(o.p ?? 1); if (p <= 0) return; const xe = lerp(xa, xb, p), n = o.n || 160;
  ctx.save(); ctx.globalAlpha *= a; gClip(G); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const x = xa + (xe - xa) * i / n; ctx[i ? 'lineTo' : 'moveTo'](gx(G, x), gy(G, f(x))); }
  for (let i = n; i >= 0; i--) { const x = xa + (xe - xa) * i / n; ctx.lineTo(gx(G, x), gy(G, g(x))); }
  ctx.closePath(); ctx.fillStyle = o.col || 'rgba(92,200,232,0.28)'; ctx.fill(); ctx.restore();
}
// 竖直窄条（典型长条）：x 处，从 g(x) 到 f(x)，宽 dx
function gStrip(G, x, dx, f, g, col, a, o = {}) {
  if (a <= 0) return; const y1 = gy(G, f(x)), y0 = gy(G, g(x)), x0 = gx(G, x - dx / 2), w = dx * G.ux;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, o.fa ?? 0.55); ctx.fillRect(x0, Math.min(y0, y1), w, Math.abs(y0 - y1));
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.strokeRect(x0, Math.min(y0, y1), w, Math.abs(y0 - y1)); ctx.restore();
}
// 水平窄条：y 处，从 xl(y) 到 xr(y)，高 dy
function gStripH(G, y, dy, xr, xl, col, a, o = {}) {
  if (a <= 0) return; const X1 = gx(G, xr(y)), X0 = gx(G, xl(y)), y0 = gy(G, y + dy / 2), h = dy * G.uy;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(col, o.fa ?? 0.55); ctx.fillRect(Math.min(X0, X1), y0, Math.abs(X1 - X0), h);
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.strokeRect(Math.min(X0, X1), y0, Math.abs(X1 - X0), h); ctx.restore();
}
// 曲线 x = h(y) 的画法（对 y 积分时用）
function gPlotY(G, h, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const ya = o.ya ?? G.y0, yb = o.yb ?? G.y1, n = o.n || 200;
  ctx.save(); ctx.globalAlpha *= a; gClip(G); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const y = ya + (yb - ya) * i / n; ctx[i ? 'lineTo' : 'moveTo'](gx(G, h(y)), gy(G, y)); }
  ctx.strokeStyle = col; ctx.lineWidth = o.w || 4; ctx.shadowColor = col; ctx.shadowBlur = 12; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); ctx.restore();
}

// ---------- 伪 3D 投影 ----------
function rvPt(G, o, t, rho, phi) {
  const e = o.e ?? C6.e, d = o.dir || 1; // dir = −1：φ = 0 的母线落在转轴的负侧（区域在轴下方 / 左方时用）
  if ((o.axis || 'x') === 'x') return [gx(G, t) + rho * G.uy * e * Math.sin(phi), gy(G, (o.at || 0) + d * rho * Math.cos(phi))];
  return [gx(G, (o.at || 0) + d * rho * Math.cos(phi)), gy(G, t) + rho * G.ux * e * Math.sin(phi)];
}
// 一个圆（或其弧）：t 处半径 rho，φ 从 p0 到 p1
function rvRing(G, o, t, rho, col, a, w = 2, p0 = 0, p1 = 2 * Math.PI, dash) {
  if (a <= 0 || rho <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath();
  const n = 48; for (let i = 0; i <= n; i++) { const [x, y] = rvPt(G, o, t, rho, lerp(p0, p1, i / n)); ctx[i ? 'lineTo' : 'moveTo'](x, y); }
  ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.restore();
}
// 旋转体。o = { axis:'x'|'y', at, R(t) 外半径, r(t) 内半径(可省), t0, t1, th 已转过的角(默认 2π), col, a, e, rings, fa }
// 半径函数 R(t) 必须 ≥ 0（调用方传“到转轴的距离”）。
function revSolid(G, o) {
  const a = o.a ?? 1; if (a <= 0) return; const th = o.th ?? 2 * Math.PI, col = o.col || C6.solid, n = o.n || 80, t0 = o.t0, t1 = o.t1;
  const R = o.R, r = o.r, T = i => lerp(t0, t1, i / n);
  ctx.save(); ctx.globalAlpha *= a;
  if (th >= 2 * Math.PI - 1e-6) {
    // 完整立体：上下包络之间填充（φ = 0 与 φ = π 两条母线）+ 竖向渐变
    const top = [], bot = [];
    for (let i = 0; i <= n; i++) { top.push(rvPt(G, o, T(i), R(T(i)), 0)); bot.push(rvPt(G, o, T(i), R(T(i)), Math.PI)); }
    ctx.beginPath(); top.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x, y)); for (let i = n; i >= 0; i--) ctx.lineTo(...bot[i]); ctx.closePath();
    const isX = (o.axis || 'x') === 'x', [cx0, cy0] = rvPt(G, o, (t0 + t1) / 2, 0, 0);
    const gr = isX ? ctx.createLinearGradient(0, cy0 - (o.Rmax || 2) * G.uy, 0, cy0 + (o.Rmax || 2) * G.uy) : ctx.createLinearGradient(cx0 - (o.Rmax || 2) * G.ux, 0, cx0 + (o.Rmax || 2) * G.ux, 0);
    gr.addColorStop(0, hexA(col, (o.fa ?? 0.34) * 0.55)); gr.addColorStop(0.35, hexA(col, (o.fa ?? 0.34) * 1.25)); gr.addColorStop(1, hexA(col, (o.fa ?? 0.34) * 0.35));
    ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
    const k = o.rings ?? 7; for (let i = 1; i < k; i++) { const t = lerp(t0, t1, i / k); rvRing(G, o, t, R(t), hexA(col, 0.55), 1.4, -Math.PI / 2, Math.PI / 2); }
    rvRing(G, o, t1, R(t1), col, 2.5); rvRing(G, o, t0, R(t0), hexA(col, 0.6), 1.6, 0, 2 * Math.PI, [6, 5]);
    if (r) { // 垫圈：端面上的孔 + 内壁虚线
      const ctr = (tt) => { ctx.beginPath(); const m = 48; for (let i = 0; i <= m; i++) { const [x, y] = rvPt(G, o, tt, r(tt), 2 * Math.PI * i / m); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.closePath(); };
      ctr(t1); ctx.fillStyle = 'rgba(6,10,24,0.45)'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
      ctx.setLineDash([9, 6]); ctx.strokeStyle = o.rcol || '#ffffff'; ctx.lineWidth = 2.4; ctx.shadowColor = o.rcol || '#ffffff'; ctx.shadowBlur = 8;
      [0, Math.PI].forEach(ph => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = rvPt(G, o, T(i), r(T(i)), ph); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.stroke(); }); ctx.setLineDash([]);
    }
  } else if (th > 0) {
    // 转动中：把 φ ∈ [0, th] 的曲面画成一条条母线 + 截面弧
    const m = Math.max(2, Math.ceil(th / (Math.PI / 10)));
    for (let j = 0; j < m; j++) {
      const pa = th * j / m, pb = th * (j + 1) / m; ctx.beginPath();
      for (let i = 0; i <= n; i++) ctx[i ? 'lineTo' : 'moveTo'](...rvPt(G, o, T(i), R(T(i)), pa));
      for (let i = n; i >= 0; i--) ctx.lineTo(...rvPt(G, o, T(i), R(T(i)), pb));
      ctx.closePath(); ctx.fillStyle = hexA(col, 0.10 + 0.12 * Math.abs(Math.cos((pa + pb) / 2))); ctx.fill();
    }
    [0, th].forEach((ph, k) => { ctx.beginPath(); for (let i = 0; i <= n; i++) ctx[i ? 'lineTo' : 'moveTo'](...rvPt(G, o, T(i), R(T(i)), ph)); ctx.strokeStyle = k ? col : hexA(col, 0.7); ctx.lineWidth = k ? 3 : 2; ctx.stroke(); });
    if (r) [0, th].forEach(ph => { ctx.beginPath(); for (let i = 0; i <= n; i++) ctx[i ? 'lineTo' : 'moveTo'](...rvPt(G, o, T(i), r(T(i)), ph)); ctx.strokeStyle = hexA(col, 0.7); ctx.lineWidth = 2; ctx.stroke(); });
    const k = o.rings ?? 6; for (let i = 0; i <= k; i++) { const t = lerp(t0, t1, i / k); rvRing(G, o, t, R(t), hexA(col, 0.6), 1.4, 0, th); if (r) rvRing(G, o, t, r(t), hexA(col, 0.45), 1.2, 0, th); }
  }
  ctx.restore();
}
// 一片圆盘 / 垫圈薄片（t 处，厚 dt）：两个端面椭圆 + 侧面
function revSlab(G, o, t, dt, col, a, o2 = {}) {
  if (a <= 0) return; const Rr = o.R(t), rr = o.r ? o.r(t) : 0, ta = t - dt / 2, tb = t + dt / 2;
  ctx.save(); ctx.globalAlpha *= a;
  const ell = (tt, rho) => { ctx.beginPath(); const m = 48; for (let i = 0; i <= m; i++) { const [x, y] = rvPt(G, o, tt, rho, 2 * Math.PI * i / m); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.closePath(); };
  // 侧面：两条母线 φ = 0、π 之间的带
  const p = (tt, ph) => rvPt(G, o, tt, Rr, ph); ctx.beginPath(); ctx.moveTo(...p(ta, 0)); ctx.lineTo(...p(tb, 0)); ctx.lineTo(...p(tb, Math.PI)); ctx.lineTo(...p(ta, Math.PI)); ctx.closePath();
  ctx.fillStyle = hexA(col, o2.fa ?? 0.5); ctx.fill();
  ell(tb, Rr); ctx.fillStyle = hexA(col, 0.75); ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
  if (rr > 0) { ell(tb, rr); ctx.fillStyle = C6.hole; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); }
  ctx.restore();
}
// 柱壳（转轴竖直，at = 轴的 x 坐标）：半径 x、高 y0→y1、厚 dx；u ∈ [0,1] 为“展开成薄板”的进度
function revShell(G, o, x, dx, y0, y1, col, a, u = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const rho = Math.abs(x - (o.at || 0)), e = o.e ?? C6.e;
  if (u <= 0) {
    const ring = (yy, ph0, ph1, rr) => { ctx.beginPath(); const m = 40; for (let i = 0; i <= m; i++) { const [px, py] = rvPt(G, o, yy, rr, lerp(ph0, ph1, i / m)); ctx[i ? 'lineTo' : 'moveTo'](px, py); } };
    // 外壁（前半面实，后半面淡）
    const [l0] = rvPt(G, o, y0, rho, Math.PI), [r0] = rvPt(G, o, y0, rho, 0);
    ctx.fillStyle = hexA(col, 0.28); ctx.fillRect(Math.min(l0, r0), gy(G, y1), Math.abs(r0 - l0), gy(G, y0) - gy(G, y1));
    ring(y1, 0, 2 * Math.PI, rho); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
    ring(y1, 0, 2 * Math.PI, rho + dx); ctx.strokeStyle = hexA(col, 0.8); ctx.lineWidth = 1.5; ctx.stroke();
    ring(y0, 0, Math.PI, rho); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke(); ring(y0, Math.PI, 2 * Math.PI, rho); ctx.setLineDash([6, 5]); ctx.strokeStyle = hexA(col, 0.5); ctx.stroke(); ctx.setLineDash([]);
    [Math.PI, 0].forEach(ph => { const [px, py] = rvPt(G, o, y0, rho, ph), [qx, qy] = rvPt(G, o, y1, rho, ph); seg(px, py, qx, qy, col, 1, 2.5); });
  } else {
    // 展开：宽度从 2ρ(直径投影) 过渡到周长 2πρ，高不变，厚度画成右侧细边
    const cx = gx(G, o.at || 0), wC = 2 * Math.PI * rho * G.ux, w = lerp(2 * rho * G.ux, wC, eIO(u)) * (o.uscale || 1);
    const yT = gy(G, y1), yB = gy(G, y0), x0 = (o.ux0 ?? cx) - w / 2;
    ctx.fillStyle = hexA(col, 0.35); ctx.fillRect(x0, yT, w, yB - yT); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.strokeRect(x0, yT, w, yB - yT);
    ctx.fillStyle = hexA(col, 0.8); ctx.fillRect(x0 + w, yT, Math.max(4, dx * G.ux * 0.6), yB - yT);
  }
  ctx.restore();
}

// ---------- 道具 ----------
// 一摞硬币：底心 (x, y)，n 枚，每枚宽 w、厚 h；shear(k) 返回第 k 枚的水平偏移（推斜）
function coinStack(x, y, n, w, h, shear, col, a, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const cx = x + shear(k), cy = y - k * h, ry = w * 0.16;
    ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, ry, 0, 0, Math.PI); ctx.lineTo(cx - w / 2, cy - h); ctx.ellipse(cx, cy - h, w / 2, ry, 0, Math.PI, 0, true); ctx.closePath();
    ctx.fillStyle = k % 2 ? hexA(col, 0.78) : hexA(col, 0.62); ctx.fill(); ctx.strokeStyle = 'rgba(60,40,0,0.55)'; ctx.lineWidth = 1; ctx.stroke();
    if (k === n - 1 || o.tops) { ctx.beginPath(); ctx.ellipse(cx, cy - h, w / 2, ry, 0, 0, 2 * Math.PI); ctx.fillStyle = hexA('#FFF1B8', 0.9); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  ctx.restore();
}
// 水平弹簧：从 x0 到 x1，中线 y，圈数 coils，振幅 amp
function spring(x0, x1, y, coils, amp, col, a = 1, w = 3) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); const lead = 18, L = x1 - x0 - 2 * lead, n = coils * 16;
  ctx.moveTo(x0, y); ctx.lineTo(x0 + lead, y);
  for (let i = 0; i <= n; i++) ctx.lineTo(x0 + lead + L * i / n, y - amp * Math.sin(2 * Math.PI * coils * i / n));
  ctx.lineTo(x1, y); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.stroke(); ctx.restore();
}
// 力箭头（任意方向）
function arrow(x0, y0, x1, y1, col, a = 1, w = 3) {
  if (a <= 0) return; const ang = Math.atan2(y1 - y0, x1 - x0), hl = 14;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - hl * 0.6 * Math.cos(ang), y1 - hl * 0.6 * Math.sin(ang)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - hl * Math.cos(ang - 0.4), y1 - hl * Math.sin(ang - 0.4)); ctx.lineTo(x1 - hl * Math.cos(ang + 0.4), y1 - hl * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill(); ctx.restore();
}
