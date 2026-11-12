// 第 7 章 P2《分部积分进阶：表格法与循环》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.1 例 3、例 4。
// A296 表格法两列 + 斜箭头 · A297 积分绕一圈回到 I · A298 I 移项解方程
const SC = {};
const TITLES = [['tab', '表格法'], ['loop', '绕回自己'], ['solve', '把 I 当未知数'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 表格法（A296） =======================
SC.tab = t => {
  starfield(t); blueprint(0.35, 80);
  questionCard(860, 250, 420, 80, '', '∫ x² eˣ dx', t, P('B01', 0.1), { col: SQ.B.col, size: 34 });
  if (t > S('C01')) tabular(760, 400, ['x²', '2x', '2', '0'], ['eˣ', 'eˣ', 'eˣ', 'eˣ'], t, P('C01', 0.1), { step: 0.55, cw: 260, dy: 70 });
  if (t > S('C02')) {
    const terms = [['+ x²eˣ', GRN], ['− 2x eˣ', RED], ['+ 2eˣ', GRN]];
    terms.forEach(([s, c], k) => mathText(s, 1010, 480 + k * 70, 30, c, { alpha: clamp(prog(t, P('C02', 0.3 + 0.17 * k), 0.3)) * fadeOut(t, S('G01') + 0.2), upright: true }));
  }
  if (t > S('G01')) {
    const a = ap(t, 'G01', 0.05); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,200,60,0.12)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; rr(560, 690, 640, 74, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText('= eˣ (x² − 2x + 2) + C', 880, 738, 34, GOLD, { align: 'center', alpha: a, upright: true });
    richReveal([['求导 ✓', GRN]], 1080, 480, 30, t, P('G01', 0.6), { upright: true });
  }
};

// ======================= 绕回自己（A297） =======================
SC.loop = t => {
  starfield(t); blueprint(0.35, 80);
  const cx = 860, cy = 520, R = 190;
  questionCard(cx, 250, 440, 80, 'I =', '∫ eˣ sin x dx', t, P('B02', 0.05), { col: SQ.B.col, size: 32 });
  const nodes = [['∫ eˣ sin x dx', -Math.PI / 2, SQ.B.col], ['−eˣ cos x + ∫ eˣ cos x dx', Math.PI / 6, CYAN], ['… − ∫ eˣ sin x dx', 5 * Math.PI / 6, SQ.B.col]];
  const t0 = P('B02', 0.25), sweep = eIO(prog(t, t0, 2.2));
  if (sweep > 0) {
    ctx.save(); ctx.strokeStyle = hexA(GOLD, 0.8); ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.lineDashOffset = -t * 30;
    ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + sweep * 2 * Math.PI * 0.98); ctx.stroke(); ctx.restore();
    const ang = -Math.PI / 2 + sweep * 2 * Math.PI * 0.98; glowDot(cx + R * Math.cos(ang), cy + R * Math.sin(ang), 9, GOLD, 1);
  }
  nodes.forEach(([s, an, c], k) => {
    const a = clamp(prog(t, t0 + k * 0.7, 0.3)); const x = cx + R * Math.cos(an), y = cy + R * Math.sin(an);
    glowDot(x, y, 7, c, a); mathText(s, x + (k === 1 ? 18 : k === 2 ? -18 : 0), y + (k ? 8 : -18), 24, c, { align: k === 1 ? 'left' : k === 2 ? 'right' : 'center', alpha: a, upright: true });
  });
  if (sweep > 0.3 && t < S('C03')) label('分部 ×2', cx, cy, 30, CR, clamp(prog(t, t0 + 0.8, 0.3)), { bold: true });
  if (t > S('C03')) {
    label('I', cx, cy, 80, GOLD, ap(t, 'C03', 0.05), { bold: true });
    richReveal([['I = eˣ sin x − eˣ cos x ', CR], ['− I', RED]], cx, 790 - 20, 32, t, P('C03', 0.5), { upright: true });
  }
};

// ======================= 移项解方程（A298） =======================
SC.solve = t => {
  starfield(t); blueprint(0.35, 80);
  const mv = eIO(prog(t, P('C04', 0.1), 0.9));       // −I 从右边飞到左边，变成 +I
  mathText('I', 600, 330, 36, CR, { alpha: 1, upright: true });
  mathText(mv > 0.5 ? '+ I' : '− I', lerp(1160, 640, mv), 330 - Math.sin(mv * Math.PI) * 60, 36, mv > 0.5 ? GRN : RED, { alpha: 1, upright: true });
  mathText('= eˣ sin x − eˣ cos x', lerp(640, 720, mv), 330, 36, CR, { alpha: 1, upright: true });
  if (t > S('C04')) richReveal([['2I = eˣ (sin x − cos x)', CR]], 860, 450, 38, t, P('C04', 0.55), { upright: true });
  if (t > S('C05')) {
    const a = ap(t, 'C05', 0.05); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,200,60,0.12)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5; rr(540, 520, 640, 84, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    mathText('I = ½ eˣ (sin x − cos x) + C', 860, 574, 36, GOLD, { align: 'center', alpha: a, upright: true });
    kinetic('绕回来 = 方程', 860, 680, 36, t, P('C05', 0.55), { col: SQ.B.col });
  }
  if (t > S('G02')) {
    const a = ap(t, 'G02', 0.1), y = 700;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,28,0.92)'; rr(540, 620, 640, 180, 14); ctx.fill(); ctx.restore();
    mathText('第 2 次：u = eˣ', 620, y - 30, 28, CR, { alpha: a, upright: true }); checkMark(1000, y - 40, 16, GRN, t, P('G02', 0.3));
    mathText('第 2 次：u = cos x', 620, y + 40, 28, CR, { alpha: ap(t, 'G02', 0.4), upright: true }); crossMark(1000, y + 30, 16, RED, t, P('G02', 0.55));
    label('→ 退回原式', 1110, y + 30, 22, RED, ap(t, 'G02', 0.6), {});
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 500, 100, '', '∫ eˣ cos x dx = ？', t, P('C07', 0.05), { size: 38 });
  if (t > S('B03')) {
    richReveal([['2I = eˣ (sin x + cos x)', CR]], 820, 530, 32, t, P('B03', 0.2), { upright: true });
    richReveal([['I = ', CR], ['½ eˣ (sin x + cos x) + C', GOLD]], 820, 620, 34, t, P('B03', 0.45), { upright: true });
    richReveal([['求导 ✓', GRN]], 820, 700, 28, t, P('B03', 0.75), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { richReveal([['表格法', GOLD], ['：省步骤', CR]], 860, 380, 46, t, P('C08', 0.05), { alpha: fa }); richReveal([['循环分部', SQ.B.col], ['：解方程', CR]], 860, 480, 46, t, P('C08', 0.4), { alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：递推公式', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('MiMo 下台阶 · 华里士公式', CX, 610, 32, SQ.T.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P2 分部积分进阶', '下一段：递推公式', [...CREDIT_BASE, ...CREDIT_B, ...CREDIT_END, CREDIT_TM7('豆包')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('B01', 0.1, 'pop', 0.22); [0, 1, 2, 3].forEach(i => sfx(P('C01', 0.1) + 0.25 + i * 0.55, 'marimba', 0.12)); [0, 1, 2].forEach(k => s('C02', 0.3 + 0.17 * k, 'pop', 0.16)); s('G01', 0.05, 'ding', 0.2); s('G01', 0.6, 'check', 0.22);
  s('B02', 0.05, 'pop', 0.2); s('B02', 0.25, 'warp', 0.2); s('C03', 0.05, 'impact', 0.2);
  s('C04', 0.1, 'whoosh', 0.2); s('C04', 0.55, 'pop', 0.18); s('C05', 0.05, 'ding_hi', 0.26); s('G02', 0.3, 'check', 0.2); s('G02', 0.55, 'buzz', 0.18);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('B03', 0.45, 'ding_hi', 0.28); s('B03', 0.75, 'check', 0.22);
  s('C08', 0.05, 'pop', 0.2); s('C08', 0.4, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
