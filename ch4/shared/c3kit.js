// 第 3 章公用小件（10-28 起）。build.sh 把 c2kit.js + c3kit.js 拼成 web/scenes0_kit.js。
// 本章配色约定：外层函数红（RED）、里层函数青（CYAN）、相乘结果金（GOLD）；f′ 绿；切线紫。
const OUTER = COL.f, INNER = COL.x, PROD = COL.y;
// ---------- 齿轮 ----------
// gear(x, y, n 齿, m 模数, θ, col, a)：节圆半径 R = m·n/2，齿顶 R + m，齿根 R − 1.2m
function gear(x, y, n, m, th, col, a = 1, o = {}) {
  if (a <= 0) return; const R = m * n / 2, Ro = R + m, Rr = R - 1.2 * m, p = 2 * Math.PI / n;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(th);
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const c = i * p;
    ctx.lineTo(Math.cos(c - 0.5 * p) * Rr, Math.sin(c - 0.5 * p) * Rr);
    ctx.lineTo(Math.cos(c - 0.3 * p) * Rr, Math.sin(c - 0.3 * p) * Rr);
    ctx.lineTo(Math.cos(c - 0.17 * p) * Ro, Math.sin(c - 0.17 * p) * Ro);
    ctx.lineTo(Math.cos(c + 0.17 * p) * Ro, Math.sin(c + 0.17 * p) * Ro);
    ctx.lineTo(Math.cos(c + 0.3 * p) * Rr, Math.sin(c + 0.3 * p) * Rr);
  }
  ctx.closePath();
  ctx.fillStyle = hexA(col, o.fill ?? 0.16); ctx.fill();
  ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.strokeStyle = col; ctx.lineWidth = o.w || 3; ctx.stroke();
  // 轮辐与轮毂
  const hub = Math.max(8, R * 0.18), sp = R > 50 ? 5 : 3;
  ctx.shadowBlur = 6; ctx.lineWidth = 2; ctx.strokeStyle = hexA(col, 0.7);
  ctx.beginPath(); ctx.arc(0, 0, Rr * 0.78, 0, 7); ctx.stroke();
  for (let k = 0; k < sp; k++) { const an = k * 2 * Math.PI / sp; ctx.beginPath(); ctx.moveTo(Math.cos(an) * hub, Math.sin(an) * hub); ctx.lineTo(Math.cos(an) * Rr * 0.78, Math.sin(an) * Rr * 0.78); ctx.stroke(); }
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, hub, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(8,12,26,0.9)'; ctx.beginPath(); ctx.arc(0, 0, hub * 0.45, 0, 7); ctx.fill();
  // 记号齿：一根亮线，方便看清转了几圈
  ctx.strokeStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 10; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(hub, 0); ctx.lineTo(Rr * 0.95, 0); ctx.stroke();
  ctx.restore();
}
// 啮合链：gs = [{n, x?, y?}]，m 模数，dir 相邻连线方向（弧度）；返回带 x, y, R, th(θ1) 的数组
function gearChain(x0, y0, gs, m, dirs) {
  const out = []; let x = x0, y = y0;
  gs.forEach((g, i) => {
    const R = m * g.n / 2;
    if (i) { const pr = out[i - 1], d = pr.R + R, a = dirs[i - 1]; x = pr.x + Math.cos(a) * d; y = pr.y + Math.sin(a) * d; }
    out.push({ n: g.n, R, x, y, col: g.col });
  });
  // 相位：保证每对齿轮在接触点一齿一槽
  out[0].ph = dirs[0]; out[0].k = 1;
  for (let i = 1; i < out.length; i++) {
    const a = out[i - 1], b = out[i], phi = dirs[i - 1], pa = 2 * Math.PI / a.n, pb = 2 * Math.PI / b.n;
    b.k = -a.k * a.n / b.n;   // 角速度比（带符号）
    const fa = (((phi - a.ph) / pa) % 1 + 1) % 1;
    b.ph = phi + Math.PI - pb * (0.5 - fa);
  }
  return out;
}
function drawChain(ch, th, m, a = 1, o = {}) { ch.forEach((g, i) => gear(g.x, g.y, g.n, m, g.ph + g.k * th, g.col, a * (o.alphas ? o.alphas[i] : 1), o)); }
// 比例牌
function ratioTag(text, x, y, col, a, o = {}) {
  if (a <= 0) return; const s = o.s ?? 1; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  ctx.font = `bold ${o.size || 34}px ${F_MATH}`; const w = ctx.measureText(text).width + 30, h = (o.size || 34) * 1.45;
  ctx.fillStyle = 'rgba(8,12,26,0.88)'; rr(-w / 2, -h / 2, w, h, 10); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2); ctx.restore();
}
// ---------- 混元的算盘：digits = [[数字, 标签, 颜色, 出现时刻], ...] ----------
function abacus(t, x, y, w, h, digits, a = 1, title = '混元 · 算盘') {
  if (a <= 0) return; panel(x, y, w, h, SQ.H ? SQ.H.col : CYAN, a);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.font = `22px ${F_FANCY}`; ctx.fillStyle = hexA(COL.cream, 0.75); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, x + w / 2, y + 24);
  const top = y + 52, bot = y + h - 48, beam = top + (bot - top) * 0.32, n = digits.length, dx = w / (n + 1);
  ctx.fillStyle = 'rgba(237,230,216,0.55)'; ctx.fillRect(x + 16, beam - 3, w - 32, 6);
  digits.forEach(([d, lab, col, t0], i) => {
    const cx = x + dx * (i + 1); ctx.strokeStyle = 'rgba(237,230,216,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx, bot); ctx.stroke();
    const p = eOut(prog(t, t0, 0.45)), up = d >= 5 ? 1 : 0, lo = d % 5, bw = Math.min(46, dx * 0.7), bh = 11;
    // 上珠（5）
    const yU = lerp(top + bh, beam - bh - 3, up * p);
    bead(cx, yU, bw, bh, up && p > 0.02 ? col : '#6b6458');
    for (let k = 0; k < 4; k++) {
      const act = k < lo, yRest = bot - bh - (3 - k) * (bh * 2 + 2), yAct = beam + bh + 3 + k * (bh * 2 + 2);
      bead(cx, act ? lerp(yRest, yAct, p) : yRest, bw, bh, act && p > 0.02 ? col : '#6b6458');
    }
    if (p > 0) label(lab, cx, y + h - 22, 26, col, p, { font: F_MATH, bold: true });
  });
  ctx.restore();
  function bead(cx, cy, bw, bh, col) { ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = col === '#6b6458' ? 0 : 10; ctx.beginPath(); ctx.ellipse(cx, cy, bw / 2, bh, 0, 0, 7); ctx.fill(); ctx.restore(); }
}
// ---------- 分式（数学字体）：parts 为 [[str, col], ...] ----------
function fracW(num, den, size) { return Math.max(...[num, den].map(ps => ps.reduce((s, [str]) => s + mathW(str, size), 0))) + size * 0.4; }
function frac(num, den, x, y, size, a = 1, col = COL.cream) {
  if (a <= 0) return 0; const w = fracW(num, den, size);
  ctx.save(); ctx.globalAlpha *= a;
  mathRich(num, x + w / 2, y - size * 0.32, size, { align: 'center', upright: true });
  mathRich(den, x + w / 2, y + size * 0.98, size, { align: 'center', upright: true });
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.fillRect(x, y + size * 0.06, w, Math.max(2, size * 0.06));
  ctx.restore(); return w;
}
// ---------- 第 3 章署名附加 ----------
const CREDIT_H = ['混元娘立绘：依据 ZipZipPipe 设定（Pixiv 150718881）由 AI 生成的本课差分。',
  '混元声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。'];
const CREDIT_K = ['Kimi 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
  'Kimi 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。'];
const CREDIT_TM = 'Claude、DeepSeek、混元、Kimi 等名称与商标归各自权利人；本片为非官方、非商业学习作品。';
