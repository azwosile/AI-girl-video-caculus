// 第 7 章 P10《积分策略：擂台第二轮》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.5。
// A320 四步流程图 · A321 题卡飞进分类箱 · A322 绕路 vs 捷径
const SC = {};
const TITLES = [['steps', '四步策略'], ['round', '擂台第二轮'], ['trap', '绕路与捷径'], ['quiz', '随堂一题'], ['outro', '小结']];

const STEP10 = [['① 化简', '代数 / 三角恒等式', CYAN], ['② 找明显换元', 'u 的导数在不在？', GOLD], ['③ 按类型分类', '三角 · 有理 · 分部 · 根式', SQ.Z.col], ['④ 再试一次', '换元 · 分部 · 变形 · 组合', SQ.X.col]];
function flow10(t, t0, a0 = 1, x0 = 860) {
  STEP10.forEach(([h, sub, c], k) => {
    const y = 300 + k * 120, p = eBack(prog(t, t0 + k * 0.5, 0.4)); if (p <= 0) return; const a = clamp(p) * a0;
    ctx.save(); ctx.translate(x0, y); ctx.scale(p, p); panel(-220, -45, 440, 90, c, a); ctx.restore();
    label(h, x0 - 90, y, 28, c, a, { bold: true }); label(sub, x0 + 90, y, 20, CR, a, {});
    if (k < 3) arrow(x0, y + 48, x0, y + 72, c, a * clamp(prog(t, t0 + k * 0.5 + 0.3, 0.3)), 2.5);
  });
  const la = clamp(prog(t, t0 + 2.2, 0.4)) * a0;   // ④ → ② 回环
  if (la > 0) { ctx.save(); ctx.globalAlpha *= la; ctx.strokeStyle = SQ.X.col; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); ctx.lineDashOffset = -t * 25; ctx.beginPath(); ctx.moveTo(x0 + 220, 660); ctx.lineTo(x0 + 280, 660); ctx.lineTo(x0 + 280, 420); ctx.lineTo(x0 + 230, 420); ctx.stroke(); ctx.restore(); arrow(x0 + 250, 420, x0 + 224, 420, SQ.X.col, la, 3); }
}

// ======================= 四步（A320） =======================
SC.steps = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C02')) { kinetic('先用哪一件？', 860, 440, 54, t, P('C01', 0.3), { col: GOLD }); return; }
  flow10(t, P('C02', 0.02));
};

// ======================= 题卡分类（A321） =======================
const PROB10 = [['∫ tan³x dx', '三角', SQ.H.col, 'G01', 0.05], ['∫ x ln x dx', '分部', GOLD, 'G01', 0.4], ['∫ √(4 − x²) dx', '三角代换', SQ.R.col, 'G01', 0.7],
  ['∫ e^{√x} dx', '换元 + 分部', SQ.B.col, 'C03', 0.05], ['∫ dx/(x² − 5x + 6)', '部分分式', SQ.Z.col, 'C03', 0.6]];
SC.round = t => {
  starfield(t); blueprint(0.35, 80);
  ringBanner(860, 228, '擂台第二轮 · 只说招式', t, P('X01', 0.05), { w: 380, size: 30 });
  PROB10.forEach(([q, m, c, id, f], k) => {
    const x = 640 + (k % 3) * 230, y = 360 + Math.floor(k / 3) * 230, ti = P(id, f);
    const a = ap(t, 'X01', 0.3 + 0.08 * k); if (a <= 0) return;
    const fl = eBack(prog(t, ti, 0.45));
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = fl > 0 ? c : '#5A6A90'; ctx.lineWidth = 2.5; rr(x - 105, y - 50, 210, 100, 12); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText(q, x, y - 6, 22, CR, { align: 'center', alpha: a, upright: true });
    if (fl > 0) { ctx.save(); ctx.translate(x, y + 30); ctx.scale(fl, fl); ctx.fillStyle = hexA(c, 0.85); rr(-70, -16, 140, 32, 16); ctx.fill(); ctx.restore(); label(m, x, y + 30, 20, '#0B1022', clamp(fl), { bold: true }); }
  });
  const x6 = 640 + 2 * 230, y6 = 590, a6 = ap(t, 'X01', 0.7);
  if (a6 > 0) { ctx.save(); ctx.globalAlpha *= a6; ctx.fillStyle = 'rgba(14,20,44,0.92)'; ctx.strokeStyle = RED; ctx.setLineDash([6, 5]); ctx.lineWidth = 2.5; rr(x6 - 105, y6 - 50, 210, 100, 12); ctx.fill(); ctx.stroke(); ctx.restore(); mathText('∫ x/(x² − 1) dx', x6, y6 - 6, 22, CR, { align: 'center', alpha: a6, upright: true }); label('？', x6, y6 + 30, 26, RED, a6, { bold: true }); }
};

// ======================= 绕路 vs 捷径（A322） =======================
SC.trap = t => {
  starfield(t); blueprint(0.35, 80);
  mathText('∫ x / (x² − 1) dx', 860, 250, 34, CR, { align: 'center', alpha: 1, upright: true });
  // 左：绕路
  const aL = ap(t, 'D01', 0.1); panel(530, 300, 330, 420, SQ.D.col, aL);
  label('部分分式（绕路）', 695, 335, 22, SQ.D.col, aL, { bold: true });
  ['x/(x² − 1) = A/(x−1) + B/(x+1)', 'x = A(x+1) + B(x−1)', 'A = ½,  B = ½', '½ln|x−1| + ½ln|x+1|'].forEach((s, k) => mathText(s, 695, 395 + k * 70, 18, CR, { align: 'center', alpha: aL * clamp(prog(t, P('D01', 0.25) + k * 0.5, 0.3)), upright: true }));
  // 绕路路径
  if (aL > 0) { ctx.save(); ctx.globalAlpha *= aL * 0.7; ctx.strokeStyle = SQ.D.col; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const yy = 370 + i * 8; ctx.lineTo(560 + 18 * Math.sin(i * 0.7), yy); } ctx.stroke(); ctx.restore(); }
  if (t > S('X02')) stampMark(695, 520, 54, t, P('X02', 0.1), { text: '绕远了', col: SQ.X.col, rot: -0.15 });
  // 右：捷径
  if (t > S('C04')) {
    const aR = ap(t, 'C04', 0.05); panel(900, 300, 310, 420, GRN, aR);
    label('凑微分（捷径）', 1055, 335, 22, GRN, aR, { bold: true });
    richReveal([['(x² − 1)′ = 2x', CYAN]], 1055, 400, 22, t, P('C04', 0.1), { upright: true });
    richReveal([['u = x² − 1', GOLD]], 1055, 470, 24, t, P('C04', 0.4), { upright: true });
    richReveal([['½ ln|x² − 1| + C', GOLD]], 1055, 560, 24, t, P('C04', 0.65), { upright: true });
    const p = eOut(prog(t, P('C04', 0.4), 0.6)); if (p > 0) arrow(1055, 600, 1055, lerp(600, 680, p), GRN, aR, 3);
    checkMark(1055, 690, 20, GRN, t, P('C04', 0.85));
  }
  if (t > S('C05')) kinetic('能凑微分，先凑', 860, 770, 30, t, P('C05', 0.1), { col: GOLD });
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 500, 100, '用哪招', '∫ sin x / (1 + cos²x) dx', t, P('C07', 0.05), { size: 30 });
  if (t > S('X03')) {
    richReveal([['u = cos x', GOLD], ['  ⇒  −∫ du/(1 + u²)', CR]], 820, 530, 30, t, P('X03', 0.05), { upright: true });
    richReveal([['= ', CR], ['−arctan(cos x) + C', GOLD]], 820, 620, 34, t, P('X03', 0.4), { upright: true });
    stampMark(1080, 700, 50, t, P('X03', 0.75), { text: '核实通过', col: SQ.X.col, rot: -0.12 });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) flow10(t, P('C08', 0.02) - 0.5, fa);
  if (t > S('C09') - 0.1) { glowText('下一段：积分表、CAS 与算不出来的积分', CX, 520, 48, CR, t, P('C09', 0.15)); glowText('Gemini：让我搜一下！', CX, 610, 32, SQ.M.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P10 积分策略', '下一段：积分表', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM7('Grok')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.3, 'pop', 0.2); [0, 1, 2, 3].forEach(k => sfx(P('C02', 0.02) + k * 0.5, 'pop', 0.16)); sfx(P('C02', 0.02) + 2.2, 'warp', 0.14);
  s('X01', 0.05, 'slam', 0.28); PROB10.forEach(([, , , id, f]) => s(id, f, 'marimba', 0.14));
  s('D01', 0.1, 'pop', 0.18); s('X02', 0.1, 'stamp', 0.28); s('C04', 0.05, 'whoosh', 0.16); s('C04', 0.85, 'check', 0.24); s('C05', 0.1, 'shimmer', 0.16);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('X03', 0.4, 'ding_hi', 0.28); s('X03', 0.75, 'stamp', 0.24);
  s('C08', 0.05, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
