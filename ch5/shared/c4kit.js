// 第 4 章公用小件（10-28 起）。build.sh 把 c2kit.js + c3kit.js + c4kit.js 拼成 web/scenes0_kit.js。
// 配色沿用制作规范：f 红、f′ 绿、x 青、y 金、割线 / 切线 紫（INV）。
const SEC = COL.inv;
// ---------- 速度表（A121/A122 起用）：v 当前读数，vmax 满刻度，lim 限速红线 ----------
function gauge(x, y, R, v, a = 1, o = {}) {
  if (a <= 0) return; const vmax = o.vmax || 180, lim = o.lim, a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;
  const ang = u => lerp(a0, a1, clamp(u / vmax));
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(10,14,30,0.88)'; ctx.strokeStyle = hexA(CYAN, 0.7); ctx.lineWidth = 3; ctx.shadowColor = CYAN; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  if (lim) { ctx.strokeStyle = hexA(COL.red, 0.85); ctx.lineWidth = R * 0.08; ctx.beginPath(); ctx.arc(x, y, R * 0.86, ang(lim), a1); ctx.stroke(); }
  ctx.font = `${Math.round(R * 0.16)}px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let u = 0; u <= vmax + 1e-6; u += o.step || 20) {
    const an = ang(u), big = u % 40 === 0; ctx.strokeStyle = 'rgba(237,230,216,0.75)'; ctx.lineWidth = big ? 3 : 1.5;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * R * (big ? 0.72 : 0.78), y + Math.sin(an) * R * (big ? 0.72 : 0.78)); ctx.lineTo(x + Math.cos(an) * R * 0.84, y + Math.sin(an) * R * 0.84); ctx.stroke();
    if (big) { ctx.fillStyle = 'rgba(237,230,216,0.8)'; ctx.fillText(String(u), x + Math.cos(an) * R * 0.56, y + Math.sin(an) * R * 0.56); }
  }
  const an = ang(v), col = o.col || (lim && v > lim + 0.5 ? COL.red : GOLD);
  glowPath(() => { ctx.moveTo(x - Math.cos(an) * R * 0.12, y - Math.sin(an) * R * 0.12); ctx.lineTo(x + Math.cos(an) * R * 0.8, y + Math.sin(an) * R * 0.8); }, col, 5);
  glowDot(x, y, R * 0.07, col);
  ctx.font = `bold ${Math.round(R * 0.24)}px ${F_MATH}`; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fillText(Math.round(v), x, y + R * 0.42);
  ctx.font = `${Math.round(R * 0.12)}px ${F_MATH}`; ctx.fillStyle = 'rgba(237,230,216,0.7)'; ctx.shadowBlur = 0; ctx.fillText(o.unit || 'km/h', x, y + R * 0.64);
  ctx.restore();
}
// ---------- 限速牌 ----------
function limitSign(x, y, r, n, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = '#f4f1ea'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = COL.red; ctx.lineWidth = r * 0.2; ctx.shadowColor = COL.red; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, r * 0.88, 0, 7); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = COL.ink; ctx.font = `bold ${Math.round(r * 0.8)}px ${F_MATH}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), x, y + r * 0.05);
  ctx.restore();
}
// ---------- 第 4 章署名附加 ----------
const CREDIT_X = ['Grok 娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。',
  'Grok 声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。'];
const CREDIT_GEN = (who) => [`${who}娘立绘：依据 ZipZipPipe 设定由 AI 生成的本课差分。`,
  `${who}声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。`];
const CREDIT_TM4 = (names) => `Claude、DeepSeek、${names} 等名称与商标归各自权利人；本片为非官方、非商业学习作品。`;
