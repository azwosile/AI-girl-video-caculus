// ================= 段间接力（10-28）=================
// 每段开头 = “接棒卡”，结尾 = “接力卡”，两张卡共用同一条章节路线图；上一段最后一帧 = 下一段第一帧。
// 合集无损拼接时画面自然相接；单独看某一段，开头就能看出自己在第几段。
// 实现方式是在 finalize 里做时间重映射：u = t − LEAD 是原时间轴；TE 之后冻结原画面并叠加接力卡。
// 原片尾（字幕卡 / 署名卡）因此不再出现；人声和音效统一平移 LEAD。各段的 scenes.js 不需要改。
// 章末段：TE 取原署名开始前（保留全员合影），完整署名改由接力卡显示（自动捕获该段 credits() 的参数）。
/*__CHAPTER__*/
window.RELAY_ON = true;
const RELAY = (() => {
  const cur = parseInt(String(SEG.tag).replace(/\D/g, '')) || 0, last = cur === CHAPTER.segs.length - 1;
  const lastV = ENTRIES.filter(e => e.k === 'v').pop();
  const lead = cur === 0 ? 2.0 : 1.5, te = lastV.vo + lastV.dur + 0.15, out = last ? 7.0 : 3.6;
  return { cur, last, lead, te, out, total: lead + te + out, cred: CHAPTER.credits || null };
})();
function relayInit() {   // 章末段：捕获原片尾 credits() 的起点与署名行
  if (!RELAY.last || typeof credits !== 'function') return;
  const orig = credits; let cap = null;
  credits = (t, t0, head, next, lines) => { cap = { t0, lines }; };
  ctx.save(); try { drawFrame(TOTAL - 1e-3); } catch (e) { } ctx.restore(); credits = orig;
  if (cap) { RELAY.te = Math.max(RELAY.te, cap.t0 - 0.05); RELAY.cred = cap.lines; }
  RELAY.total = RELAY.lead + RELAY.te + RELAY.out;
}
const REL_SP = Math.min(175, 1700 / (CHAPTER.segs.length + 1));
const REL_X = i => 960 + (i - (CHAPTER.segs.length - 1) / 2) * REL_SP, REL_Y = 520;
function relayCheck(x, y, s, a) { glowPath(() => { ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.1, y + s * 0.35); ctx.lineTo(x + s * 0.5, y - s * 0.35); }, COL.ink, 4, a); }
function relayFit(s, sz, maxW, bold, font) { ctx.font = `${bold ? 'bold ' : ''}${sz}px ${font}`; const w = ctx.measureText(s).width; if (w > maxW) ctx.font = `${bold ? 'bold ' : ''}${Math.floor(sz * maxW / w)}px ${font}`; }
// done = 已完成段数（下标 < done 的点为金色）；lit = 高亮点；comet = [from, to, p]；nx = 下一章节点透明度（只在章末接力卡淡入）
function relayRail(t, done, lit, comet, k, pulse = 0, nx = 0) {
  const n = CHAPTER.segs.length, nodes = nx > 0 ? n + 1 : n, rr = Math.min(16, REL_SP * 0.18);
  ctx.save(); ctx.globalAlpha *= k;
  for (let i = 0; i < nodes - 1; i++) {
    const x0 = REL_X(i) + rr + 4, x1 = REL_X(i + 1) - rr - 4, gold = i + 1 < done || (i + 1 === done && i + 1 <= lit);
    ctx.save(); if (i + 1 === n) ctx.globalAlpha *= nx;
    glowPath(() => { ctx.moveTo(x0, REL_Y); ctx.lineTo(x1, REL_Y); }, gold ? GOLD : 'rgba(237,230,216,0.22)', gold ? 3 : 2, gold ? 0.9 : 1); ctx.restore();
  }
  if (comet) {
    const [f, to, p] = comet, x0 = REL_X(f) + rr + 4, x = lerp(x0, REL_X(to) - rr - 4, eIO(p));
    if (p > 0) { glowPath(() => { ctx.moveTo(x0, REL_Y); ctx.lineTo(x, REL_Y); }, CYAN, 3.5, 1); if (p < 1) glowDot(x, REL_Y, 9, '#ffffff', 1); }
  }
  for (let i = 0; i < nodes; i++) {
    const x = REL_X(i), isNext = i === n, on = i === lit, ok = i < done, r = on ? rr + 6 + 8 * pulse : rr;
    ctx.save(); if (isNext) ctx.globalAlpha *= nx;
    if (ok) { ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, REL_Y, rr, 0, 7); ctx.fill(); ctx.shadowBlur = 0; relayCheck(x, REL_Y, rr * 1.1, 1); }
    else { ctx.strokeStyle = on ? CYAN : 'rgba(237,230,216,0.35)'; ctx.lineWidth = on ? 4 : 2.5; ctx.shadowColor = CYAN; ctx.shadowBlur = on ? 22 : 0;
      if (isNext) ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(x, REL_Y, r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      if (on) { ctx.fillStyle = hexA(CYAN, 0.25); ctx.fill(); } }
    ctx.restore();
    ctx.save(); if (isNext) ctx.globalAlpha *= nx; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    relayFit(isNext ? CHAPTER.next.tag : `P${i}`, 26, REL_SP - 6, on, F_FANCY); ctx.fillStyle = on ? CYAN : ok ? GOLD : 'rgba(237,230,216,0.45)';
    ctx.fillText(isNext ? CHAPTER.next.tag : `P${i}`, x, REL_Y - 52);
    const nm = isNext ? CHAPTER.next.name : CHAPTER.segs[i];
    relayFit(nm, 22, REL_SP - 10, on, F_BODY); ctx.fillStyle = on ? COL.cream : ok ? 'rgba(237,230,216,0.8)' : 'rgba(237,230,216,0.4)';
    ctx.fillText(nm, x, REL_Y + 54);
    ctx.restore();
  }
  ctx.restore();
}
function relayCard(t, o) {
  const { bg, done, lit, comet, label, labelA = 1, title, ta, pulse = 0, rise = 0, credits: cr = 0, nx = 0 } = o;
  ctx.save(); ctx.globalAlpha = bg; ctx.fillStyle = '#05070f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  if (bg <= 0.01) return;
  ctx.save(); ctx.globalAlpha *= bg; ctx.translate(0, -rise);
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 10;
  ctx.fillText(`AI娘微积分课 · 第 ${CHAPTER.n} 章 · ${CHAPTER.title}`, 960, 300); ctx.restore();
  relayRail(t, done, lit, comet, 1, pulse, nx);
  if (label && labelA > 0) { ctx.save(); ctx.globalAlpha *= labelA; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `30px ${F_BODY}`; ctx.fillStyle = CYAN; ctx.fillText(label, 960, 690); ctx.restore(); }
  if (title) glowText(title, 960, 775, 64, COL.cream, t, ta, { align: 'center' });
  const CL = RELAY.cred || [];
  if (cr > 0 && CL.length) { ctx.save(); ctx.globalAlpha *= cr; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(237,230,216,0.78)';
    CL.forEach((s, i) => { relayFit(s, 19, 1800, false, F_BODY); ctx.fillText(s, 960, 852 + i * 27); }); ctx.restore(); }
  const FL = [].concat(CHAPTER.footer);
  ctx.save(); ctx.globalAlpha *= 1 - cr; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(237,230,216,0.55)';
  FL.forEach((s, i) => { relayFit(s, 20, 1820, false, F_BODY); ctx.fillText(s, 960, 1006 - (FL.length - 1 - i) * 32); }); ctx.restore();
  ctx.restore();
}
const relayTitle = i => i >= CHAPTER.segs.length ? `${CHAPTER.next.tag}　${CHAPTER.next.name}` : `P${i}　${(CHAPTER.full || CHAPTER.segs)[i]}`;
function relayOverlay(t) {
  const R = RELAY, c = R.cur;
  if (t < R.lead + 0.3) {   // 接棒卡：第一帧与上一段最后一帧一致，然后淡出露出本段
    const bg = 1 - eIO(prog(t, R.lead - 0.6, 0.9));
    relayCard(t, { bg, done: c, lit: c, comet: c ? [c - 1, c, 1] : null, label: c ? '下一段' : '', labelA: 1 - prog(t, 0.25, 0.4), title: relayTitle(c), ta: c ? -9 : 0.15,
      pulse: Math.sin(Math.PI * prog(t, 0.35, 0.6)), rise: 40 * eIn(prog(t, R.lead - 0.6, 0.9)) });
    if (c === 0) glowText('开始', 960, 690, 30, CYAN, t, 0.5, { out: R.lead - 0.7, bold: false, font: F_BODY, align: 'center' });
    return;
  }
  const v = t - R.lead - R.te; if (v < 0) return;   // 接力卡
  const to = c + 1, bg = eOut(prog(v, 0, 0.5));
  if (v < 0.4) warp(t, 0.25 * prog(v, 0, 0.4), W / 2, H / 2, 1.2); else if (v < 1.8) warp(t, 0.25 * (1 - prog(v, 1.2, 0.6)), W / 2, H / 2, 1.2);
  relayCard(t, { bg, done: c + (v >= 0.55 ? 1 : 0), lit: v >= 1.6 ? to : -1, comet: [c, to, prog(v, 0.8, 0.8)],
    label: R.last ? '下一章' : '下一段', labelA: prog(v, 1.6, 0.3), title: relayTitle(to), ta: t - v + 1.7,
    pulse: v >= 1.6 ? Math.sin(Math.PI * prog(v, 1.6, 0.6)) : 0, credits: R.last ? prog(v, 2.6, 0.6) : 0, nx: R.last ? eOut(prog(v, 0.2, 0.5)) : 0 });
  if (v >= 0.55 && v < 0.9) flash(t, t - v + 0.55, 0.15, 0.3);
}
function relaySfx() {
  const R = RELAY, a = R.lead + R.te, keep = SFX.filter(e => e.t <= R.te + 0.05).map(e => ({ t: e.t + R.lead, name: e.name, gain: e.gain }));
  const add = (t, name, gain) => keep.push({ t, name, gain });
  add(0.35, 'pluck', 0.22); add(R.lead - 0.6, 'swoosh_in', 0.28);
  add(a + 0.05, 'swoosh_soft', 0.26); add(a + 0.55, 'check', 0.32); add(a + 0.8, 'whoosh', 0.22); add(a + 1.6, 'marimba_hi', 0.36); add(a + 1.62, 'sparkle', 0.22);
  if (R.last) add(a + 2.6, 'swell', 0.26);
  return keep.sort((x, y) => x.t - y.t);
}
function relayExport() {
  const L = RELAY.lead;
  window.TIMELINE = { total: RELAY.total, seq: ENTRIES.filter(e => e.k === 'v').map(e => ({ id: e.id, t0: e.t0 + L, vo: e.vo + L, dur: e.dur, t1: e.t1 + L })), blocks: BLOCKS.map(b => ({ b: b.b, t0: b.t0 + L, t1: b.t1 + L })), sfx: relaySfx(), relay: { lead: L, te: RELAY.te, out: RELAY.out } };
}
function finalize() {   // scenes.js 最后调用：导出时间轴、渲染入口（含段间接力的时间重映射）
  SFX.sort((a, b) => a.t - b.t);
  relayExport();
  window.renderAt = function (t) {
    const R = RELAY;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
    const u = Math.min(Math.max(t - R.lead, 0), R.te);
    ctx.clearRect(0, 0, W, H); computePulse(u); drawFrame(u);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalCompositeOperation = 'source-over';
    relayOverlay(t);
  };
  window.ready = (async () => {
    await Promise.all(SPR_NAMES.map(loadImg));
    await document.fonts.load(`80px "Smiley"`, (SEG.fontWarm || '高中速通映射') + CHAPTER.segs.join('') + CHAPTER.next.name + '开始下一段章'); await document.fonts.ready;
    relayInit(); relayExport();
    window.renderAt(0); return true;
  })();
  if (!window.__EXPORT__) window.ready.then(() => { const t0 = performance.now(); (function loop() { window.renderAt(((performance.now() - t0) / 1000) % RELAY.total); requestAnimationFrame(loop); })(); });
}
