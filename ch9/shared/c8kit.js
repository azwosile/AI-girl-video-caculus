// c8kit.js —— 第 8 章《积分的更多应用》专用：服务器排队、跷跷板、扇形 / 圆环微元、摆线车轮、概率曲线、需求曲线。（11-12）
const CREDIT_TM8 = CREDIT_TM5;

// ---------- 服务器繁忙 ----------
// 弹窗：标题栏 + 正文 + 转圈；o.col 边框色，o.spin 是否转圈，o.alpha
function busyWin(x, y, w, h, title, msg, t, t0, o = {}) {
  const p = eBack(prog(t, t0, 0.45)); if (p <= 0) return; const a = clamp(p) * (o.alpha ?? 1), col = o.col || RED;
  const [sx, sy] = o.shake ? shake(t, o.shake, 9, 0.5) : [0, 0];
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + sx, y + sy); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(14,18,36,0.94)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 18; rr(-w / 2, -h / 2, w, h, 14); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = hexA(col, 0.85); rr(-w / 2, -h / 2, w, 44, 14); ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + 30, w, 14);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-w / 2 + 24 + i * 22, -h / 2 + 22, 7, 0, 7); ctx.fill(); });
  if (o.spin !== false) { ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); const r0 = t * 5; ctx.arc(-w / 2 + 70, 22, 24, r0, r0 + 4.2); ctx.stroke(); }
  ctx.restore();
  label(title, x + sx + 30, y + sy - h / 2 + 22, 22, '#0B1022', a, { bold: true });
  label(msg, x + sx + (o.spin !== false ? 40 : 0), y + sy + 22, o.size || 34, CR, a, { bold: true });
}
// 排队小人：从 (x, y) 往右排 n 个；k 为当前显示个数（可为小数，渐入）
function queueMen(x, y, n, k, col, a = 1, o = {}) {
  const gap = o.gap || 46, s = o.s || 1;
  for (let i = 0; i < n; i++) {
    const al = clamp(k - i) * a; if (al <= 0) continue; const X = x + i * gap, bob = Math.sin(i * 1.7 + (o.t || 0) * 3) * 2;
    ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = hexA(col, 0.85);
    ctx.beginPath(); ctx.arc(X, y - 44 * s + bob, 11 * s, 0, 7); ctx.fill();
    rr(X - 13 * s, y - 30 * s + bob, 26 * s, 32 * s, 9 * s); ctx.fill(); ctx.restore();
  }
}

// ---------- 极坐标 ----------
// 极坐标曲线 r = rf(θ)，极点 (cx, cy)，单位 u 像素；θ 从 ta 到 tb（逆时针为正）
function polarCurve(cx, cy, u, rf, ta, tb, col, a = 1, w = 4, o = {}) {
  if (a <= 0 || tb <= ta) return; const n = o.n || 240;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = o.glow ?? 10;
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const q = ta + (tb - ta) * i / n, r = rf(q) * u; ctx[i ? 'lineTo' : 'moveTo'](cx + r * Math.cos(q), cy - r * Math.sin(q)); } ctx.stroke(); ctx.restore();
}
// 填充 r = rf(θ) 在 [ta, tb] 扫过的区域（扇形微元的总和）
function polarFill(cx, cy, u, rf, ta, tb, col, a = 1, n = 160) {
  if (a <= 0 || tb <= ta) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx, cy);
  for (let i = 0; i <= n; i++) { const q = ta + (tb - ta) * i / n, r = rf(q) * u; ctx.lineTo(cx + r * Math.cos(q), cy - r * Math.sin(q)); } ctx.closePath(); ctx.fill(); ctx.restore();
}
// 极坐标网格：同心圆 + 射线
function polarGrid(cx, cy, R, rings, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(92,200,232,0.14)'; ctx.lineWidth = 1.2;
  for (let k = 1; k <= rings; k++) { ctx.beginPath(); ctx.arc(cx, cy, R * k / rings, 0, 7); ctx.stroke(); }
  for (let k = 0; k < 12; k++) { const q = k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(q), cy - R * Math.sin(q)); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(237,230,216,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R + 20, cy); ctx.stroke(); ctx.restore();
}

// ---------- 跷跷板 / 质点 ----------
// 跷跷板：支点 (x, y)，板长 len，倾角 ang（弧度，正 = 右端下沉）；items: [{d, m, col, txt}] d 为相对支点的像素位置
function seesaw(x, y, len, ang, items, a = 1, o = {}) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = o.fulcrum || GOLD; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30, y + 52); ctx.lineTo(x + 30, y + 52); ctx.closePath(); ctx.fill();
  ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = o.board || '#8a6a48'; ctx.strokeStyle = CR; ctx.lineWidth = 2;
  ctx.fillRect(-len / 2, -9, len, 12); ctx.strokeRect(-len / 2, -9, len, 12);
  (items || []).forEach(it => { const s = 18 + 7 * Math.sqrt(it.m); ctx.fillStyle = it.col || CYAN; ctx.shadowColor = it.col || CYAN; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(it.d, -9 - s, s, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#10131c'; ctx.font = `bold ${Math.round(s * 0.9)}px ${F_FANCY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it.txt ?? String(it.m), it.d, -9 - s + 1); });
  ctx.restore();
}
// 数轴上的质点：G 为 c2kit 坐标系；ms: [{x, m, col}]
function massDots(G, ms, a = 1, o = {}) {
  if (a <= 0) return; ms.forEach((p, i) => { const k = o.t === undefined ? 1 : clamp((o.t - i * 0.25) / 0.4); if (k <= 0) return;
    const X = gx(G, p.x), Y = gy(G, p.y || 0), s = (14 + 6 * Math.sqrt(p.m)) * (0.6 + 0.4 * k);
    ctx.save(); ctx.globalAlpha *= a * k; ctx.fillStyle = p.col || CYAN; ctx.shadowColor = p.col || CYAN; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(X, Y, s, 0, 7); ctx.fill(); ctx.restore();
    label(String(p.m), X, Y + 1, Math.round(s * 1.0), '#10131c', a * k, { bold: true }); });
}

// ---------- 旋转体（斜视）：截面沿椭圆轨道扫一圈 ----------
// 轴为竖直线 x = ax；截面中心离轴 R 像素，截面半径 r 像素；p ∈ [0,1] 扫过比例；tilt 椭圆扁率
function ringSweep(ax, ay, R, r, p, col, a = 1, o = {}) {
  if (a <= 0) return; const tilt = o.tilt ?? 0.32, n = Math.max(2, Math.round(60 * p));
  ctx.save(); ctx.globalAlpha *= a;
  // 外、内轮廓
  ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha *= 0.9;
  for (const rr of [R + r, R - r]) { ctx.beginPath(); for (let i = 0; i <= n; i++) { const q = -Math.PI / 2 + 2 * Math.PI * p * i / n; ctx[i ? 'lineTo' : 'moveTo'](ax + rr * Math.cos(q + Math.PI / 2), ay + rr * tilt * Math.sin(q + Math.PI / 2)); } ctx.stroke(); }
  // 截面幽灵
  ctx.fillStyle = col; for (let i = 0; i <= n; i += Math.max(1, Math.round(n / 12))) { const q = 2 * Math.PI * p * i / n, cx = ax + R * Math.cos(q), cy = ay + R * tilt * Math.sin(q);
    ctx.globalAlpha = a * 0.12; ctx.beginPath(); ctx.ellipse(cx, cy, r * (0.35 + 0.65 * Math.abs(Math.cos(q))), r, 0, 0, 7); ctx.fill(); }
  // 形心轨道
  ctx.globalAlpha = a; ctx.strokeStyle = o.path || GOLD; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const q = 2 * Math.PI * p * i / n; ctx[i ? 'lineTo' : 'moveTo'](ax + R * Math.cos(q), ay + R * tilt * Math.sin(q)); } ctx.stroke(); ctx.setLineDash([]);
  // 当前截面
  const q = 2 * Math.PI * p, cx = ax + R * Math.cos(q), cy = ay + R * tilt * Math.sin(q);
  ctx.fillStyle = o.fill || 'rgba(255,79,110,0.55)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, r * (0.35 + 0.65 * Math.abs(Math.cos(q))), r, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill();
  ctx.restore();
}
