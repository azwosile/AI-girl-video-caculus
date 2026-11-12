// 第 8 章 P7《帕普斯定理》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 8.3。
// A359 圆片绕轴扫出甜甜圈，形心轨道 2πR · A360 V = A·2πd · A361 半圆 → 球 反验
const SC = {};
const TITLES = [['donut', '甜甜圈'], ['sphere', '反过来验证'], ['quiz', '随堂一题'], ['outro', '小结']];

function axisP7(x, y0, y1, a, lab = '轴') {
  seg(x, y0, x, y1, CR, a * 0.8, 2, [10, 6]); label(lab, x, y0 - 20, 24, CR, a * 0.8, { bold: true });
}

// ======================= 甜甜圈（A359–A360） =======================
const AX7 = 850, AY7 = 640, RR7 = 230, rr7 = 70;
SC.donut = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'N01', 0.05); axisP7(AX7, 430, 830, a, '');
  const p = prog(t, P('N01', 0.35), 2.2);
  if (p <= 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,79,110,0.55)'; ctx.strokeStyle = SQ.N.col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(AX7 + RR7, AY7, rr7, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  else ringSweep(AX7, AY7, RR7, rr7, p, SQ.N.col, a);
  if (t > S('C01')) richReveal([['V = ', CR], ['面积 × 形心走过的路程', GOLD]], 870, 250, 34, t, P('C01', 0.2), { upright: true });
  if (t > S('G01')) { richReveal([['V = A · 2πd', GOLD]], 870, 310, 34, t, P('G01', 0.1), { upright: true });
    const q = ap(t, 'G01', 0.4); seg(AX7, AY7 + 140, AX7 + RR7, AY7 + 140, CYAN, q, 3); seg(AX7 + RR7, AY7 + 128, AX7 + RR7, AY7 + 152, CYAN, q, 3); label('d', AX7 + RR7 / 2, AY7 + 166, 28, CYAN, q, { bold: true }); }
  if (t > S('C02')) { const q = ap(t, 'C02', 0.2); label('A = πr²', AX7 + RR7, AY7 - rr7 - 30, 28, SQ.N.col, q, { bold: true }); label('2πR', AX7 - RR7 + 30, AY7 - 110, 30, GOLD, ap(t, 'C02', 0.55), { bold: true }); }
  if (t > S('C03')) goldBox(870, 372, 420, 58, 'V = 2π²Rr²', 34, ap(t, 'C03', 0.2));
  if (t > S('N02')) label('上一段的形心派上用场', 1060, 450, 28, CYAN, ap(t, 'N02', 0.3), { bold: true });
};

// ======================= 半圆 → 球（A361） =======================
const SX7 = 760, SY7 = 600, SR7 = 220;
SC.sphere = t => {
  starfield(t); blueprint(0.35, 80);
  const a = ap(t, 'C04', 0.05); axisP7(SX7, 340, 860, a, '直径');
  const p = prog(t, P('C04', 0.4), 1.8), yb = 4 / (3 * Math.PI) * SR7;
  // 球轮廓随扫过比例淡入
  ctx.save(); ctx.globalAlpha *= a * p; ctx.strokeStyle = CYAN; ctx.lineWidth = 3; ctx.shadowColor = CYAN; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(SX7, SY7, SR7, 0, 7); ctx.stroke();
  ctx.globalAlpha = a * p * 0.5; ctx.beginPath(); ctx.ellipse(SX7, SY7, SR7, SR7 * 0.3, 0, 0, 7); ctx.stroke(); ctx.restore();
  // 半圆（右侧）
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,79,110,0.45)'; ctx.strokeStyle = SQ.N.col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(SX7, SY7 - SR7); ctx.arc(SX7, SY7, SR7, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  // 形心与轨道
  const q = ap(t, 'G02', 0.1); glowDot(SX7 + yb, SY7, 9, GOLD, Math.max(q, a * p));
  ctx.save(); ctx.globalAlpha *= a * p; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.ellipse(SX7, SY7, yb, yb * 0.3, 0, 0, 2 * Math.PI * p); ctx.stroke(); ctx.restore();
  if (t > S('G02')) { seg(SX7, SY7 + 30, SX7 + yb, SY7 + 30, GOLD, q, 3); label('4R/(3π)', SX7 + yb / 2 + 10, SY7 + 58, 24, GOLD, q, { bold: true });
    richReveal([['(πR²/2) · 2π · 4R/(3π) = ', CR], ['4πR³/3', GOLD]], 870, 260, 32, t, P('G02', 0.35), { upright: true }); }
  if (t > S('D01')) stampMark(1130, 430, 46, t, P('D01', 0.2), { text: '球!', col: GRN, rot: -0.12 });
};

// ======================= 随堂 =======================
const QA7 = 620, QB7 = 700, QU7 = 120;
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C05', 0, 0.5) * 0.42, 78);
  if (t < S('C06')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C05') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['正方形 2 ≤ x ≤ 3，0 ≤ y ≤ 1，绕 y 轴：', CR], ['V = ？', GOLD]], 860, 260, 32, t, P('C06', 0.05), { upright: true });
  const a = ap(t, 'C06', 0.3); axisP7(QA7, 400, 780, a, 'y 轴'); seg(QA7 - 40, QB7, QA7 + 3.5 * QU7, QB7, CR, a, 2);
  [1, 2, 3].forEach(i => label(String(i), QA7 + i * QU7, QB7 + 26, 22, CR, a));
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,79,110,0.45)'; ctx.strokeStyle = SQ.N.col; ctx.lineWidth = 3; ctx.fillRect(QA7 + 2 * QU7, QB7 - QU7, QU7, QU7); ctx.strokeRect(QA7 + 2 * QU7, QB7 - QU7, QU7, QU7); ctx.restore();
  if (t > S('D02')) { const q = ap(t, 'D02', 0.1), X = QA7 + 2.5 * QU7, Y = QB7 - QU7 / 2; glowDot(X, Y, 9, GOLD, q);
    ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.ellipse(QA7, Y, 2.5 * QU7, 2.5 * QU7 * 0.3, 0, 0, 2 * Math.PI * prog(t, P('D02', 0.15), 1)); ctx.stroke(); ctx.restore();
    richReveal([['1 × 2π × 2.5 = ', CR], ['5π', GOLD]], 860, 340, 34, t, P('D02', 0.2), { upright: true }); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C07', 0) * fadeOut(t, S('C08'), 0.4);
  if (ga > 0) { richReveal([['V = ', CR], ['A · 2πd', GOLD]], CX, 330, 50, t, P('C07', 0.1), { upright: true, alpha: ga }); ringSweep(CX, 560, 170, 50, 1, SQ.N.col, ga * 0.8); }
  if (t > S('C08') - 0.1) { glowText('下一段：引力与转动惯量', CX, 520, 50, CR, t, P('C08', 0.15)); glowText('Grok 抡起大斧', CX, 610, 32, SQ.X.col, t, P('C08', 0.45), { bold: false }); }
  credits(t, E('C08') + 0.38, 'AI娘微积分课 · 第 8 章 · P7 帕普斯定理', '下一段：引力与转动惯量', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM8('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C08') + 0.25) lecturer(t, 'C', 255, -5, E('C08') + 0.48, { h: 710 }); };
SC.__noTag = E('C08') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C08') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.1, 'pop', 0.18); s('N01', 0.35, 'riser', 0.14); sfx(P('N01', 0.35) + 2.2, 'ding', 0.2); s('C01', 0.2, 'pop', 0.18); s('G01', 0.1, 'pop', 0.16); s('G01', 0.4, 'tick', 0.14);
  s('C02', 0.2, 'pop', 0.16); s('C02', 0.55, 'pop', 0.16); s('C03', 0.2, 'ding_hi', 0.24); s('N02', 0.3, 'sparkle', 0.18);
  s('C04', 0.4, 'whoosh', 0.18); s('G02', 0.1, 'tick', 0.14); s('G02', 0.35, 'pop', 0.16); s('D01', 0.2, 'stamp', 0.26);
  s('C05', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.15, 'swoosh_in', 0.14); s('D02', 0.2, 'ding_hi', 0.28);
  s('C07', 0.1, 'pop', 0.2); s('C08', 0.15, 'swell', 0.3);
})();
finalize();
