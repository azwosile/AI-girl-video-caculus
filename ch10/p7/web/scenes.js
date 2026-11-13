// 第 10 章 P7《极坐标》（2026-11-13）：数学画面全部原创 Canvas 绘制。Stewart 10.3 例 2、例 3。
// A455 月亮的“方向 + 距离”与极坐标网格 · A456 直角 ↔ 极坐标换算（两个 tan 解选象限） · A457 同一点多种写法：θ + 2π、负 r 倒退
const SC = {};
const TITLES = [['def', '极坐标'], ['ex', '换算'], ['multi', '多种写法'], ['quiz', '随堂一题'], ['outro', '小结']];
const OX7 = 860, OY7 = 560;
function angArc7(r, q0, q1, col, a, lab) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(OX7, OY7, r, -q0, -q1, q1 > q0); ctx.stroke(); ctx.restore();
  if (lab) { const qm = (q0 + q1) / 2; label(lab, OX7 + (r + 30) * Math.cos(qm), OY7 - (r + 30) * Math.sin(qm), 24, col, a, { bold: true }); }
}
function moon7(x, y, R, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#F4EBC8'; ctx.shadowColor = '#F4EBC8'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(x + R * 0.45, y - R * 0.2, R * 0.85, 0, TAU); ctx.fill(); ctx.restore(); }

// ======================= 极坐标（A455） =======================
SC.def = t => {
  starfield(t); blueprint(0.3, 80);
  const a = ap(t, 'K01', 0); polarGrid(OX7, OY7, 300, 4, a);
  label('极点 O', OX7 - 40, OY7 + 30, 22, CR, a * 0.8); label('极轴', OX7 + 330, OY7 - 22, 22, CR, a * 0.8);
  const q = Math.PI / 6, R = 260 * eOut(prog(t, P('K01', 0.3), 0.8)), X = OX7 + R * Math.cos(q), Y = OY7 - R * Math.sin(q);
  seg(OX7, OY7, X, Y, GOLD, a, 4); moon7(X, Y, 26, ap(t, 'K01', 0.5));
  angArc7(70, 0, q * prog(t, P('K01', 0.2), 0.6), CYAN, a, '30°');
  label('38 万 km', (OX7 + X) / 2 - 10, (OY7 + Y) / 2 - 30, 24, GOLD, ap(t, 'K01', 0.6), { bold: true });
  if (t > S('C01')) { const k = ap(t, 'C01', 0.2); label('r：距离', 1250, 300, 30, GOLD, k, { bold: true }); label('θ：转角', 1250, 350, 30, CYAN, ap(t, 'C01', 0.45), { bold: true }); goldBox(1250, 420, 160, 60, '(r, θ)', 32, ap(t, 'C01', 0.6)); }
  if (t > S('C02')) { const k = ap(t, 'C02', 0.1); seg(X, Y, X, OY7, CYAN, k * 0.8, 2.5, [6, 5]); seg(X, Y, OX7, Y, GOLD, k * 0.8, 2.5, [6, 5]);
    label('r cos θ', (OX7 + X) / 2, OY7 + 30, 24, CYAN, k, { bold: true }); label('r sin θ', X + 60, (OY7 + Y) / 2, 24, GOLD, k, { bold: true });
    richReveal([['x = r cos θ，y = r sin θ', CR]], 980, 230, 32, t, P('C02', 0.1), { upright: true });
    richReveal([['r² = x² + y²，tan θ = y/x', CYAN]], 980, 860, 30, t, P('C02', 0.55), { upright: true }); }
};

// ======================= 换算（A456） =======================
const U7 = 110;
SC.ex = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'C03', 0); polarGrid(OX7, OY7, 300, 3, a * 0.8);
  const pre = t < S('G01'), k1 = a * (pre ? 1 : 0.35);
  const q1 = Math.PI / 3, [X1, Y1] = polXY(OX7, OY7, U7, 2, q1);
  seg(OX7, OY7, X1, Y1, GOLD, k1, 4); glowDot(X1, Y1, 10, GOLD, k1); angArc7(60, 0, q1, CYAN, k1, 'π/3');
  seg(X1, Y1, X1, OY7, CYAN, k1 * 0.7, 2, [6, 5]); label('(2, π/3) → (1, √3)', X1 + 140, Y1 - 20, 26, GOLD, k1, { bold: true });
  richReveal([['x = 2 cos(π/3) = 1，', CYAN], ['y = 2 sin(π/3) = √3', GOLD]], 980, 230, 30, t, P('C03', 0.3), { upright: true, alpha: pre ? 1 : 0.4 });
  if (t > S('G01')) {
    const k = ap(t, 'G01', 0.1), [X2, Y2] = [OX7 + U7, OY7 + U7]; seg(OX7, OY7, X2, Y2, SQ.G.col, k, 4); glowDot(X2, Y2, 10, SQ.G.col, k);
    label('(1, −1)', X2 + 50, Y2 + 20, 26, SQ.G.col, k, { bold: true }); label('r = √2', (OX7 + X2) / 2 + 40, (OY7 + Y2) / 2 - 16, 24, SQ.G.col, ap(t, 'G01', 0.3), { bold: true });
    angArc7(80, 0, 7 * Math.PI / 4, CYAN, ap(t, 'G01', 0.5), '7π/4'); angArc7(100, 0, -Math.PI / 4, GRN, ap(t, 'G01', 0.8), '−π/4');
  }
  if (t > S('C04')) { const k = ap(t, 'C04', 0.2); const [X3, Y3] = [OX7 - U7, OY7 - U7]; seg(OX7, OY7, X3, Y3, RED, k * 0.7, 3, [8, 6]); glowDot(X3, Y3, 9, RED, k);
    label('3π/4 ？', X3 - 40, Y3 - 30, 24, RED, k, { bold: true }); crossMark(X3 - 110, Y3 - 30, 16, RED, t, P('C04', 0.4));
    panel(1110, 760, 250, 60, GOLD, k); label('tan θ = −1：看象限', 1235, 790, 24, GOLD, k, { bold: true }); }
};

// ======================= 多种写法（A457） =======================
SC.multi = t => {
  starfield(t); blueprint(0.34, 80);
  const a = ap(t, 'K02', 0); polarGrid(OX7, OY7, 300, 3, a * 0.8);
  const q = Math.PI / 4, [X, Y] = polXY(OX7, OY7, U7, 2, q);
  const pre = t < S('D01');
  if (pre) { seg(OX7, OY7, X, Y, GOLD, a, 4); glowDot(X, Y, 10, GOLD, a);
    const names = ['(2, π/4)', '(2, 9π/4)', '(2, −7π/4)', '(−2, 5π/4)']; names.forEach((s, i) => label(s, 1250, 300 + i * 50, 28, i === 3 ? RED : GOLD, ap(t, 'K02', 0.2 + 0.15 * i), { bold: true }));
    if (t > S('C05')) { const sp = prog(t, P('C05', 0.1), 1.2); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CYAN; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 120 * sp; i++) { const qq = q * 0 + (q + TAU) * i / 120, rr = 40 + 30 * i / 120; ctx.lineTo(OX7 + rr * Math.cos(qq), OY7 - rr * Math.sin(qq)); } ctx.stroke(); ctx.restore(); label('+2π', OX7 + 90, OY7 + 70, 24, CYAN, ap(t, 'C05', 0.4), { bold: true });
      richReveal([['(−r, θ) = ', RED], ['(r, θ + π)', GOLD]], 980, 230, 34, t, P('C05', 0.5), { upright: true }); } }
  else {
    const k = ap(t, 'D01', 0); label('(−2, π/4) ？', 980, 230, 36, RED, k, { bold: true });
    const [Xf, Yf] = polXY(OX7, OY7, U7, 2.6, q); seg(OX7, OY7, Xf, Yf, CYAN, k * 0.6, 2.5, [6, 6]); dirHead(Xf, Yf, -q, CYAN, k * 0.8, 16); label('朝 π/4', Xf + 40, Yf - 10, 24, CYAN, k, { bold: true });
    if (t > S('C06')) { const p = eIO(prog(t, P('C06', 0.2), 1.2)), [Xb, Yb] = polXY(OX7, OY7, U7, -2 * p, q); seg(OX7, OY7, Xb, Yb, RED, 1, 4); glowDot(Xb, Yb, 11, RED, 1);
      label('倒退 2', (OX7 + Xb) / 2 - 50, (OY7 + Yb) / 2 + 10, 24, RED, ap(t, 'C06', 0.3), { bold: true });
      if (p > 0.98) { label('= (2, 5π/4)', Xb - 30, Yb + 46, 28, GOLD, ap(t, 'C06', 0.7), { bold: true }); label('第三象限', 1250, 720, 28, GOLD, ap(t, 'C06', 0.7), { bold: true }); } }
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  richReveal([['(3, π/2)  →  ', CR], ['(x, y) = ？', GOLD]], 880, 240, 38, t, P('C08', 0.05), { upright: true });
  const a = ap(t, 'C08', 0.2); polarGrid(OX7, OY7 + 60, 300, 3, a * 0.8);
  if (t > S('D02')) { const k = ap(t, 'D02', 0.1), p = eOut(prog(t, P('D02', 0.1), 0.6)); seg(OX7, OY7 + 60, OX7, OY7 + 60 - 300 * p, GOLD, k, 4); glowDot(OX7, OY7 + 60 - 300 * p, 11, GOLD, k);
    label('(0, 3)', OX7 + 70, OY7 - 240, 32, GOLD, ap(t, 'D02', 0.5), { bold: true }); checkMark(1300, 520, 22, GRN, t, P('D02', 0.6)); }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const ga = ap(t, 'C09', 0) * fadeOut(t, S('C10'), 0.4);
  if (ga > 0) {
    richReveal([['极坐标 = ', CR], ['方向 θ', CYAN], [' + ', CR], ['距离 r', GOLD]], CX, 340, 48, t, P('C09', 0.05), { upright: true, alpha: ga });
    richReveal([['x = r cos θ，y = r sin θ', CR]], CX, 440, 40, t, P('C09', 0.45), { upright: true, alpha: ga });
  }
  if (t > S('C10') - 0.1) { glowText('下一段：心形线与玫瑰线', CX, 520, 50, CR, t, P('C10', 0.15)); glowText('Mistral 献上一朵玫瑰', CX, 610, 32, SQ.R.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 10 章 · P7 极坐标', '下一段：心形与玫瑰', [...CREDIT_BASE, ...CREDIT_K, ...CREDIT_END, CREDIT_TM10('Kimi')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('K01', 0.3, 'whoosh', 0.14); s('K01', 0.5, 'shimmer', 0.2); s('C01', 0.2, 'pop', 0.16); s('C01', 0.45, 'pop', 0.16); s('C01', 0.6, 'ding', 0.18); s('C02', 0.1, 'pop', 0.14); s('C02', 0.55, 'ding', 0.18);
  s('C03', 0.3, 'ding', 0.2); s('G01', 0.1, 'pop', 0.16); s('G01', 0.5, 'pluck', 0.16); s('G01', 0.8, 'pluck', 0.16); s('C04', 0.4, 'buzz', 0.16);
  s('K02', 0.2, 'marimba', 0.12); s('K02', 0.35, 'marimba', 0.12); s('K02', 0.5, 'marimba', 0.12); s('K02', 0.65, 'marimba', 0.12); s('C05', 0.1, 'swell', 0.12); s('C05', 0.5, 'ding', 0.2);
  s('D01', 0.1, 'pop', 0.16); s('C06', 0.2, 'whoosh', 0.14); s('C06', 0.7, 'ding_hi', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('D02', 0.1, 'whoosh', 0.14); s('D02', 0.6, 'check', 0.24);
  s('C09', 0.05, 'pop', 0.2); s('C09', 0.45, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
