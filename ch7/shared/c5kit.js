// 第 5 章共用：积分画面组件（10-29）。面积着色、黎曼长条、积分记号、区间括号。
const C5 = { pos: 'rgba(92,200,232,0.30)', neg: 'rgba(232,85,58,0.30)', L: GRN, R: INV, M: GOLD };
// 曲线与 x 轴之间的面积：上方淡青、下方淡红；o.p 从 xa 向右扫出；o.pos / o.neg 改颜色
function gArea(G, f, xa, xb, a, o = {}) {
  if (a <= 0) return; const p = clamp(o.p ?? 1); if (p <= 0) return; const xe = lerp(xa, xb, p), n = o.n || 200;
  const path = () => { ctx.beginPath(); ctx.moveTo(gx(G, xa), gy(G, 0)); for (let i = 0; i <= n; i++) { const x = xa + (xe - xa) * i / n; ctx.lineTo(gx(G, x), gy(G, clamp(f(x), G.y0 - 1, G.y1 + 1))); } ctx.lineTo(gx(G, xe), gy(G, 0)); ctx.closePath(); };
  ctx.save(); ctx.globalAlpha *= a; gClip(G);
  [[o.pos || C5.pos, gy(G, G.y1) - 10, gy(G, 0)], [o.neg || C5.neg, gy(G, 0), gy(G, G.y0) + 10]].forEach(([c, y0, y1]) => { ctx.save(); ctx.beginPath(); ctx.rect(0, y0, W, y1 - y0); ctx.clip(); path(); ctx.fillStyle = c; ctx.fill(); ctx.restore(); });
  ctx.restore();
}
// 黎曼长条：mode 'L' 左端点、'R' 右端点、'M' 中点、或 0–1 之间的数（样本点位置）；o.k 只画前 k 条；o.fa 填充透明度
function gRects(G, f, xa, xb, n, mode, col, a, o = {}) {
  if (a <= 0) return; const dx = (xb - xa) / n, fr = mode === 'L' ? 0 : mode === 'R' ? 1 : mode === 'M' ? 0.5 : mode, k = o.k ?? n;
  ctx.save(); ctx.globalAlpha *= a; gClip(G);
  for (let i = 0; i < Math.min(n, Math.ceil(k)); i++) {
    const x0 = xa + i * dx, fs = Array.isArray(fr) ? fr[i] : fr, h = f(x0 + fs * dx), al = clamp(k - i);
    const X = gx(G, x0), Y = gy(G, Math.max(h, 0)), Wd = dx * G.ux, Hh = Math.abs(h) * G.uy;
    ctx.globalAlpha = a * al; ctx.fillStyle = hexA(col, o.fa ?? 0.22); ctx.fillRect(X, h >= 0 ? Y : gy(G, 0), Wd, Hh);
    ctx.strokeStyle = hexA(col, 0.9); ctx.lineWidth = n > 60 ? 1 : 2; ctx.strokeRect(X, h >= 0 ? Y : gy(G, 0), Wd, Hh);
    if (o.dots) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(gx(G, x0 + fs * dx), gy(G, h), 5, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}
// 区间下方的括号与文字（x 轴下）
function gBrace(G, xa, xb, text, col, a, dy = 46) {
  if (a <= 0) return; const y = gy(G, 0) + dy, X0 = gx(G, xa), X1 = gx(G, xb);
  seg(X0, y - 10, X0, y, col, a, 2); seg(X1, y - 10, X1, y, col, a, 2); seg(X0, y, X1, y, col, a, 2);
  mathText(text, (X0 + X1) / 2, y + 26, 22, col, { align: 'center', alpha: a, upright: true });
}
// 黎曼和数值
function riemann(f, xa, xb, n, mode) { const dx = (xb - xa) / n, fr = mode === 'L' ? 0 : mode === 'R' ? 1 : 0.5; let s = 0; for (let i = 0; i < n; i++) s += f(xa + (i + fr) * dx); return s * dx; }
const CREDIT_TM5 = (names) => `Claude、DeepSeek、${names} 等名称与商标归各自权利人；本片为非官方、非商业学习作品。`;
// ---------- 第 5 章客串署名（与第 3、4 章措辞一致） ----------
const VOICE_CLONE = (who) => `${who}声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。`;
const CREDIT_M = ['Gemini 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', VOICE_CLONE('Gemini ')];
const CREDIT_Q = ['千问娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', VOICE_CLONE('千问')];
const CREDIT_B = ['豆包娘立绘：ZipZipPipe 的 Seed/豆包拟人设定，复制自本系列 AI娘 Git 课素材。', VOICE_CLONE('豆包')];
const CREDIT_T = ['MiMo 娘立绘：依据 甶丶 的 MiMo 拟人设定（CC BY-NC）由 AI 生成的本课差分。', VOICE_CLONE('MiMo ')];
