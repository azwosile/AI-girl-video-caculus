// 第 4 章 P14《优化问题》（2026-10-28）：数学画面全部原创 Canvas 绘制。
// A171 易拉罐形状随 r 变化、S(r) 同步描点 · A172 球内接圆柱剖面、h 滑块与体积读数 · A173 穷举表 vs 导数解 · A174 优化四步流程卡
const SC = {};
const TITLES = [['goal', '目标函数'], ['can', '千问的奶茶罐'], ['ball', '球内接圆柱'], ['flow', '优化四步'], ['quiz', '随堂一题'], ['outro', '小结']];
const VOL = 330, Sfun = r => 2 * Math.PI * r * r + 2 * VOL / r, R0 = Math.cbrt(VOL / (2 * Math.PI));
function drawCan(cx, by, r, h, k, col, a, lab) {
  if (a <= 0) return; const w = r * k, H = h * k, e = w * 0.28;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10;
  const g = ctx.createLinearGradient(cx - w, 0, cx + w, 0); g.addColorStop(0, hexA(col, 0.15)); g.addColorStop(0.4, hexA(col, 0.45)); g.addColorStop(1, hexA(col, 0.1));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - w, by - H); ctx.lineTo(cx - w, by); ctx.ellipse(cx, by, w, e, 0, Math.PI, 0, true); ctx.lineTo(cx + w, by - H); ctx.ellipse(cx, by - H, w, e, 0, 0, Math.PI, false); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, by - H, w, e, 0, 0, 7); ctx.fillStyle = hexA(col, 0.3); ctx.fill(); ctx.stroke(); ctx.restore();
  if (lab) label(lab, cx, by + e + 30, 20, col, a);
}

// ======================= 目标函数 =======================
SC.goal = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C01', 0.3);
  [['① 建立目标函数', SQ.Q.col], ['② 求最值', GOLD]].forEach(([s, c], i) => { const p = ap(t, 'C01', 0.4 + i * 0.25); if (p <= 0) return; panel(700 + i * 330, 330, 280, 110, c, p); label(s, 840 + i * 330, 385, 30, c, p, { bold: true }); });
  if (a > 0) arrowH(985, 1025, 385, CR, ap(t, 'C01', 0.6));
  if (t > S('Q01') - 0.1) { const q = ap(t, 'Q01', 0.1); drawCan(CX, 760, 3.7, 7.5, 24, SQ.Q.col, q, '容积固定'); slab('千问请客', CX, 540, 26, t, P('Q01', 0.2), { bg: SQ.Q.col, c: COL.ink }); }
};

// ======================= 奶茶罐（A171） =======================
const GS = { cx: 900, cy: 820, ux: 60, uy: 0.9, x0: 1, x1: 7.5, y0: 0, y1: 500 };
function canR(t) {
  if (t < P('C02', 0.4)) return 2.4;
  if (t < E('C02')) return lerp(2.4, 6, eIO(prog(t, P('C02', 0.4), E('C02') - P('C02', 0.4))));
  return lerp(6, R0, eIO(prog(t, S('C03'), Math.min(2.5, E('C03') - S('C03')))));
}
SC.can = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'C02', 0), r = canR(t), h = VOL / (Math.PI * r * r);
  richReveal([['S(r) = 2πr^2 + 2V/r', SQ.Q.col], ['   V = 330 mL', CR]], CX, 225, 30, t, P('C02', 0.15), { upright: true });
  if (t < S('D01') - 0.1) {
    drawCan(760, 800, r, h, 20, SQ.Q.col, a, `r = ${r.toFixed(2)}   h = ${h.toFixed(2)}`);
    gAxes(GS, a, { grid: false, ticks: { x: [[2, '2'], [4, '4'], [6, '6']], y: [[200, '200'], [400, '400']] }, xl: 'r' });
    gPlot(GS, Sfun, SQ.Q.col, { a, xa: 1.4, xb: 7.5, p: eIO(prog(t, P('C02', 0.3), 1.2)), n: 300 });
    if (t > P('C02', 0.4)) { gDot(GS, r, Sfun(r), GOLD, a); label(`S ≈ ${Sfun(r).toFixed(0)}`, gx(GS, r), gy(GS, Sfun(r)) - 30, 20, GOLD, a, { font: F_MATH }); }
    if (t > P('C03', 0.6)) { const c = ap(t, 'C03', 0.6); gV(GS, R0, GRN, c * 0.7, { dash: [6, 6], ya: 0, yb: Sfun(R0) }); richReveal([['h = 2r', GRN], ['  高 = 直径', CR]], 1150, 330, 30, t, P('C03', 0.65), { upright: true }); }
    if (t > S('Q02') - 0.1) { richReveal([['r ≈ 3.7 cm,  h ≈ 7.5 cm', GOLD]], 1150, 400, 26, t, P('Q02', 0.45), { upright: true }); slab('最小值', gx(GS, R0), gy(GS, Sfun(R0)) + 50, 22, t, P('Q02', 0.15), { bg: GRN, c: COL.ink }); }
    return;
  }
  // 对比：最省料 vs 真实罐
  const b = ap(t, 'D01', 0);
  drawCan(820, 790, R0, 2 * R0, 26, GRN, b, '最省料：h = 2r');
  drawCan(1180, 790, 3.3, VOL / (Math.PI * 3.3 * 3.3), 26, SQ.Q.col, b * ap(t, 'D01', 0.3), '超市的罐：更瘦更高');
  if (t > S('C04') - 0.1) { richReveal([['顶盖更厚、要好拿 ⇒ 目标函数变了', CR]], CX, 300, 28, t, P('C04', 0.1), { upright: true }); richReveal([['最优解也会变', GOLD]], CX, 360, 30, t, P('C04', 0.55), { upright: true }); }
};

// ======================= 球内接圆柱（A172 / A173） =======================
const GB = { cx: 1140, cy: 760, ux: 200, uy: 110, x0: 0, x1: 1, y0: 0, y1: 2.6 };
const Vb = h => 2 * Math.PI * h * (1 - h * h), HB = 1 / Math.sqrt(3);
function ballH(t) {
  if (t < P('G02', 0.2)) return 0.75;
  if (t < S('C05')) return 0.55 + 0.35 * Math.sin((t - P('G02', 0.2)) * 1.6);
  return lerp(0.55 + 0.35 * Math.sin((S('C05') - P('G02', 0.2)) * 1.6), HB, eIO(prog(t, S('C05'), 1.2)));
}
SC.ball = t => {
  starfield(t); blueprint(0.4, 80);
  const a = ap(t, 'G01', 0), cx = 860, cy = 560, Rp = 220, h = ballH(t), r = Math.sqrt(1 - h * h);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CYAN; ctx.lineWidth = 3; ctx.shadowColor = CYAN; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(cx, cy, Rp, 0, 7); ctx.stroke();
  ctx.fillStyle = hexA(GOLD, 0.22); ctx.strokeStyle = GOLD; ctx.fillRect(cx - r * Rp, cy - h * Rp, 2 * r * Rp, 2 * h * Rp); ctx.strokeRect(cx - r * Rp, cy - h * Rp, 2 * r * Rp, 2 * h * Rp); ctx.restore();
  if (t > S('G02') - 0.1) {
    const g = ap(t, 'G02', 0);
    seg(cx, cy, cx + r * Rp, cy - h * Rp, RED, g, 3); seg(cx, cy, cx, cy - h * Rp, GRN, g, 3); seg(cx, cy - h * Rp, cx + r * Rp, cy - h * Rp, SQ.Q.col, g, 3);
    label('R', cx + r * Rp / 2 + 18, cy - h * Rp / 2 + 14, 22, RED, g, { font: F_MATH }); label('h', cx - 18, cy - h * Rp / 2, 22, GRN, g, { font: F_MATH }); label('r', cx + r * Rp / 2, cy - h * Rp - 18, 22, SQ.Q.col, g, { font: F_MATH });
    richReveal([['V = 2πh(R^2 − h^2)', GOLD]], CX, 225, 32, t, P('G02', 0.6), { upright: true });
    if (t < S('Q03') - 0.1) {
      gAxes(GB, g, { grid: false, ticks: { x: [[HB, 'R/√3'], [1, 'R']] }, xl: 'h' });
      gPlot(GB, Vb, GOLD, { a: g, n: 200 }); gDot(GB, h, Vb(h), RED, g);
      label(`V ≈ ${Vb(h).toFixed(2)} R³`, 1240, 440, 22, GOLD, g, { font: F_MATH });
    }
  }
  if (t > S('C05') - 0.1 && t < S('Q03') - 0.1) { richReveal([['h = R/√3,   V_max = 4πR^3/(3√3)', GRN]], CX, 290, 28, t, P('C05', 0.35), { upright: true }); }
  if (t > S('Q03') - 0.1) {
    const q = ap(t, 'Q03', 0); panel(1110, 380, 250, 420, SQ.Q.col, q * 0.85); label('穷举表', 1235, 410, 22, SQ.Q.col, q, { bold: true });
    [0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8].forEach((hh, i) => { const p = ap(t, 'Q03', 0.05 + i * 0.06); if (p <= 0) return; const best = hh === 0.6; mathText(`h = ${hh.toFixed(2)}   V = ${Vb(hh).toFixed(3)}`, 1235, 450 + i * 42, 18, best ? GOLD : hexA(CR, 0.75), { align: 'center', alpha: p, upright: true }); });
    const d = ap(t, 'Q03', 0.6); if (d > 0) { panel(1110, 810, 250, 60, GRN, d); mathText('导数：h = 0.577…  一步到', 1235, 840, 18, GRN, { align: 'center', alpha: d, upright: true }); }
    richReveal([['V_max = 4πR^3/(3√3) ≈ 2.418 R^3', GRN]], CX, 290, 28, t, P('Q03', 0.05), { upright: true });
  }
};

// ======================= 优化四步（A174） =======================
SC.flow = t => {
  starfield(t); blueprint(0.4, 80);
  const C = [['设变量', CYAN], ['写目标函数', SQ.Q.col], ['求驻点', GOLD], ['验证最值', GRN]];
  C.forEach(([s, c], i) => { const f = 0.1 + i * 0.18, p = ap(t, 'C06', f); if (p <= 0) return; const x = 640 + i * 180; panel(x, 420, 150, 150, c, p); label(`${i + 1}`, x + 75, 465, 40, c, p, { bold: true, font: F_MATH }); label(s, x + 75, 530, 22, c, p, { bold: true }); if (i) arrowH(x - 26, x - 4, 495, CR, p); });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1250, 330);
  richReveal([['周长 20 的矩形，面积最大？', RED]], 860, 300, 36, t, P('C08', 0.1), { upright: true });
  if (t > S('D02')) {
    const p = ap(t, 'D02', 0.1), x = lerp(2, 5, eIO(prog(t, P('D02', 0.2), 1.0))), k = 26;
    ctx.save(); ctx.globalAlpha *= p; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.fillStyle = hexA(GOLD, 0.15); ctx.fillRect(700, 420, x * k, (10 - x) * k); ctx.strokeRect(700, 420, x * k, (10 - x) * k); ctx.restore();
    label(`${x.toFixed(1)} × ${(10 - x).toFixed(1)} = ${(x * (10 - x)).toFixed(1)}`, 780, 690, 22, GOLD, p, { font: F_MATH });
    richReveal([['A = x(10 − x)', CYAN]], 1100, 480, 32, t, P('D02', 0.15), { upright: true });
    richReveal([['x = 5', CR]], 1100, 560, 32, t, P('D02', 0.45), { upright: true });
    richReveal([['A_max = ', CR], ['25', GOLD]], 1100, 640, 40, t, P('D02', 0.75), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { richReveal([['目标函数  →  最值', GOLD]], CX, 420, 42, t, P('C09', 0.15), { upright: true, alpha: ga }); richReveal([['唯一驻点  ⇒  就是最值', CYAN]], CX, 530, 36, t, P('C09', 0.6), { upright: true, alpha: ga }); }
  if (t > S('C10') - 0.1) { glowText('下一段：牛顿法', CX, 500, 52, CR, t, P('C10', 0.15)); glowText('豆包客串', CX, 590, 32, SQ.B.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 4 章 · P14 优化问题', '下一段：牛顿法', [...CREDIT_BASE, '千问娘立绘：ZipZipPipe（Pixiv 148186519），复制自本系列 AI娘 Git 课素材。', '千问声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END, CREDIT_TM4('千问（Qwen）')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.4, 'pop', 0.2); s('C01', 0.65, 'pop', 0.2); s('Q01', 0.1, 'swoosh_in', 0.2); s('Q01', 0.2, 'tinkle', 0.2);
  s('C02', 0.15, 'type', 0.14); s('C02', 0.4, 'hum', 0.14); s('C03', 0.0, 'warp', 0.16); s('C03', 0.6, 'ding_hi', 0.26); s('Q02', 0.15, 'pop', 0.22); s('Q02', 0.45, 'type', 0.14);
  s('D01', 0.0, 'pop', 0.2); s('D01', 0.3, 'pop', 0.2); s('C04', 0.1, 'type', 0.14); s('C04', 0.55, 'ding', 0.2);
  s('G01', 0.0, 'whoosh', 0.18); s('G02', 0.0, 'pluck', 0.2); s('G02', 0.6, 'type', 0.16); s('C05', 0.0, 'warp', 0.16); s('C05', 0.35, 'ding_hi', 0.26);
  [0, 1, 2, 3, 4, 5, 6].forEach(i => s('Q03', 0.05 + i * 0.06, 'tick', 0.14)); s('Q03', 0.6, 'ding_hi', 0.26);
  [0, 1, 2, 3].forEach(i => s('C06', 0.1 + i * 0.18, 'click', 0.2)); s('C06', 0.75, 'shimmer', 0.18);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'type', 0.14); s('D02', 0.75, 'ding_hi', 0.28);
  s('C09', 0.15, 'pop', 0.2); s('C09', 0.6, 'shimmer', 0.18); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
