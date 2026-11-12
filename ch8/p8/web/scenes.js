// 第 8 章 P8《引力与转动惯量》（2026-11-12）：数学画面全部原创 Canvas 绘制。同济补充（微元法）。
// A362 细棒切片各自吸引小球 · A363 两根同样的棒：绕端点 vs 绕中点旋转 · A364 Ml²/3 对 Ml²/12
const SC = {};
const TITLES = [['grav', '棒的引力'], ['inertia', '转动惯量'], ['quiz', '随堂一题'], ['outro', '小结']];

function rodP8(x0, y0, x1, y1, a, w = 16, col = '#9AA4B8') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
}
function pivotP8(x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fill(); ctx.restore(); }

// ======================= 棒的引力（A362） =======================
const RL8 = 560, RR8 = 900, RY8 = 600, BX8 = 1110;
SC.grav = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'X01', 0.1); rodP8(RL8, RY8, RR8, RY8, a, 18, SQ.X.col);
  glowDot(BX8, RY8, 22, CYAN, a); label('m', BX8, RY8 + 1, 22, '#10131c', a, { bold: true }); label('M，长 l', (RL8 + RR8) / 2, RY8 + 46, 26, SQ.X.col, a, { bold: true });
  // a 与 l 的标注
  const qa = ap(t, 'X01', 0.4); seg(RR8, RY8 + 90, BX8, RY8 + 90, CR, qa, 2); seg(RR8, RY8 + 80, RR8, RY8 + 100, CR, qa, 2); seg(BX8, RY8 + 80, BX8, RY8 + 100, CR, qa, 2); label('a', (RR8 + BX8) / 2, RY8 + 116, 26, CR, qa, { bold: true });
  if (t > S('C01') && t < S('C02')) { const q = ap(t, 'C01', 0.3); [0.1, 0.5, 0.9].forEach(k => { const X = lerp(RL8, RR8, k); arrow(X, RY8 - 30, BX8 - 30, RY8 - 30 - 0 * k, RED, q * (0.3 + 0.7 * k), 2); });
    label('距离各不相同', 830, 470, 30, RED, q, { bold: true }); }
  if (t > S('C02')) {
    const q = ap(t, 'C02', 0.2), xs = 0.55, Xs = RR8 - xs * (RR8 - RL8), w = 22;
    ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.fillRect(Xs - w / 2, RY8 - 14, w, 28); ctx.restore();
    label('dm = (M/l)dx', Xs, RY8 - 48, 26, GOLD, q, { bold: true });
    seg(Xs, RY8 + 140, BX8, RY8 + 140, CYAN, ap(t, 'C02', 0.5), 2); label('a + x', (Xs + BX8) / 2, RY8 + 166, 24, CYAN, ap(t, 'C02', 0.5), { bold: true });
    richReveal([['把一小段 dx 当成一个点', CR]], 870, 250, 32, t, P('C02', 0.15), { upright: true });
  }
  if (t > S('G01')) { arrow(RR8 - 0.55 * (RR8 - RL8) + 14, RY8 - 26, BX8 - 26, RY8 - 26, RED, ap(t, 'G01', 0.3), 3);
    richReveal([['dF = G m dm / (a + x)²，  ', CR], ['∫₀ˡ', GOLD]], 870, 310, 30, t, P('G01', 0.15), { upright: true }); }
  if (t > S('C03')) { goldBox(870, 375, 400, 58, 'F = GMm / (a(a + l))', 30, ap(t, 'C03', 0.1)); label('l → 0 ⇒ GMm/a²', 870, 440, 26, CYAN, ap(t, 'C03', 0.55), { bold: true }); }
};

// ======================= 转动惯量（A363–A364） =======================
const PA8 = [720, 630], PB8 = [1070, 630], LR8 = 190;
SC.inertia = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'X02', 0.1), tt = Math.max(0, t - P('X02', 0.2));
  // 同样的力矩：角加速度与 I 成反比，A 慢 4 倍
  const sp8 = u => (u < 4 ? 0.175 * u * u : 2.8 + 1.4 * (u - 4)), thA = 0.25 * sp8(tt), thB = sp8(tt);
  [[PA8, thA, 0, 1], [PB8, thB, -0.5, 0.5]].forEach(([p, th, k0, k1]) => {
    ctx.save(); ctx.globalAlpha *= a * 0.25; ctx.strokeStyle = CR; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(p[0], p[1], LR8 * Math.max(Math.abs(k0), Math.abs(k1)), 0, 7); ctx.stroke(); ctx.restore();
    const c = Math.cos(th), s = Math.sin(th); rodP8(p[0] + LR8 * k0 * c, p[1] + LR8 * k0 * s, p[0] + LR8 * k1 * c, p[1] + LR8 * k1 * s, a, 14, SQ.X.col); pivotP8(p[0], p[1], a);
  });
  label('绕端点', PA8[0], 870 - 60, 28, CR, a, { bold: true }); label('绕中点', PB8[0], 870 - 60, 28, CR, a, { bold: true });
  if (t > S('C04')) richReveal([['I = Σ mᵢ rᵢ²', CR], ['（离轴越远越难转）', CYAN]], 870, 250, 32, t, P('C04', 0.15), { upright: true });
  if (t > S('C05')) richReveal([['I = ∫ r² dm', GOLD]], 870, 305, 32, t, P('C05', 0.15), { upright: true });
  if (t > S('G02')) goldBox(PA8[0], 380, 260, 54, 'I = Ml²/3', 30, ap(t, 'G02', 0.3));
  if (t > S('C06')) goldBox(PB8[0], 380, 260, 54, 'I = Ml²/12', 30, ap(t, 'C06', 0.4));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['I_端 / I_中 = ', CR], ['？', GOLD]], 860, 260, 40, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.3);
  rodP8(640, 520, 900, 520, a, 14, SQ.X.col); pivotP8(640, 520, a); label('Ml²/3', 770, 570, 28, CR, a, { bold: true });
  rodP8(640, 680, 900, 680, a, 14, SQ.X.col); pivotP8(770, 680, a); label('Ml²/12', 770, 730, 28, CR, a, { bold: true });
  if (t > S('D01')) { richReveal([['(1/3) ÷ (1/12) = ', CR], ['4', GOLD]], 860, 340, 36, t, P('D01', 0.1), { upright: true }); stampMark(1080, 600, 50, t, P('D01', 0.3), { text: '×4', col: GOLD, rot: -0.1 }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) { kinetic('切小段 → 当成点 → 积分', CX, 360, 48, t, P('C09', 0.1), { col: GOLD, out: S('C10') - 0.3 }); rodP8(CX - 200, 500, CX + 200, 500, ga, 16, SQ.X.col);
    for (let i = 0; i < 8; i++) seg(CX - 200 + 50 * i + 25, 488, CX - 200 + 50 * i + 25, 512, '#10131c', ga, 2); }
  if (t > S('C10') - 0.1) { glowText('下一段：消费者剩余', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('千问请喝奶茶', CX, 610, 32, SQ.Q.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 8 章 · P8 引力与转动惯量', '下一段：消费者剩余', [...CREDIT_BASE, ...CREDIT_X, ...CREDIT_END, CREDIT_TM8('Grok')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('X01', 0.1, 'slam', 0.2); s('X01', 0.4, 'tick', 0.14); s('C01', 0.3, 'zap', 0.14); s('C02', 0.2, 'pop', 0.18); s('C02', 0.5, 'tick', 0.14); s('G01', 0.15, 'pop', 0.16); s('C03', 0.1, 'ding', 0.24); s('C03', 0.55, 'pop', 0.14);
  s('X02', 0.2, 'whoosh', 0.2); s('C04', 0.15, 'pop', 0.16); s('C05', 0.15, 'pop', 0.16); s('G02', 0.3, 'ding', 0.22); s('C06', 0.4, 'ding_hi', 0.22); s('X03', 0.2, 'sparkle', 0.16);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D01', 0.1, 'ding_hi', 0.28); s('D01', 0.3, 'stamp', 0.24);
  s('C09', 0.1, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
