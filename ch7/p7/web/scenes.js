// 第 7 章 P7《部分分式（一）：一次因式》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.4 例 1、例 2。
// A311 长除法竖式 · A312 分式拆成三块 · A313 掩盖法手掌盖住因子
const SC = {};
const TITLES = [['div', '先做除法'], ['split', '拆成三块'], ['cover', '掩盖法'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 长除法（A311） =======================
SC.div = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['分子次数 ≥ 分母次数  ⇒  ', CR], ['先除', GOLD]], 860, 245, 32, t, P('C01', 0.4), { upright: true });
  if (t > S('C02') - 0.2) {
    const X = 620, Y = 360, A = f => ap(t, 'C02', f), fs = 28;
    // 竖式：商 / 除式)被除式 / 逐行相减
    ctx.save(); ctx.globalAlpha *= A(0); ctx.strokeStyle = CR; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X + 110, Y + 50); ctx.quadraticCurveTo(X + 125, Y + 25, X + 110, Y + 2); ctx.lineTo(X + 520, Y + 2); ctx.stroke(); ctx.restore();
    mathText('x − 1', X, Y + 38, fs, CYAN, { alpha: A(0), upright: true });
    mathText('x³ + 0x² + x + 0', X + 135, Y + 38, fs, CR, { alpha: A(0), upright: true });
    mathText('x² + x + 2', X + 135, Y - 14, fs, GOLD, { alpha: A(0.3), upright: true });
    const rows = [['x³ − x²', 0.2, 1], ['x² + x', 0.35, 0], ['x² − x', 0.45, 1], ['2x + 0', 0.6, 0], ['2x − 2', 0.68, 1], ['2', 0.8, 0]];
    rows.forEach(([s, f, sub], k) => { const a = A(f), y = Y + 85 + k * 44, xo = X + 135 + Math.floor(k / 2) * 52; mathText(s, xo + (k === 5 ? 50 : 0), y, 24, k === 5 ? RED : CR, { alpha: a, upright: true }); if (sub) seg(xo - 10, y + 12, xo + 170, y + 12, CR, a * 0.5, 1.5); });
    richReveal([['= x² + x + 2 + ', GOLD], ['2/(x − 1)', RED]], 1160, 450, 28, t, P('C02', 0.85), { upright: true, alpha: fadeOut(t, S('G01'), 0.3) });
  }
  if (t > S('G01')) goldBox(880, 745, 600, 62, 'x³/3 + x²/2 + 2x + 2 ln|x − 1| + C', 26, ap(t, 'G01', 0.05));
};

// ======================= 拆成三块（A312） =======================
function bigFrac(x, y, num, den, col, a, size = 30) { if (a <= 0) return; const w = Math.max(num.length, den.length) * size * 0.5 + 20; mathText(num, x, y - 12, size, CR, { align: 'center', alpha: a, upright: true }); seg(x - w / 2, y, x + w / 2, y, col, a, 2.5); mathText(den, x, y + size + 6, size, CR, { align: 'center', alpha: a, upright: true }); return w; }
SC.split = t => {
  starfield(t); blueprint(0.35, 80);
  const sp = eIO(prog(t, P('C04', 0.2), 0.9));
  bigFrac(860, 330, 'x² + 2x − 1', t > P('C03', 0.4) ? 'x (2x − 1)(x + 2)' : '2x³ + 3x² − 2x', SQ.Z.col, ap(t, 'C03', 0.05) * (1 - sp * 0.4), 32);
  if (t > S('C03') && t < P('C03', 0.5)) label('分解', 1150, 365, 26, SQ.Z.col, ap(t, 'C03', 0.3), { bold: true });
  if (t > S('C04')) {
    const parts = [['A', 'x', CYAN], ['B', '2x − 1', GOLD], ['C', 'x + 2', SQ.Z.col]];
    parts.forEach(([n, d, c], k) => {
      const x = lerp(860, 640 + k * 230, sp), y = lerp(360, 540, sp), a = sp;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(c, 0.12); ctx.strokeStyle = c; ctx.lineWidth = 2.5; rr(x - 90, y - 60, 180, 130, 14); ctx.fill(); ctx.stroke(); ctx.restore();
      bigFrac(x, y, n, d, c, a, 32); if (k < 2) label('+', x + 115, y + 6, 34, CR, a, { bold: true });
    });
    label('三个不同的一次因式 → 三块', 860, 700, 28, CR, clamp(prog(t, P('C04', 0.2) + 0.9, 0.3)), { bold: true });
  }
};

// ======================= 掩盖法（A313） =======================
function palm(x, y, w, h, a) {      // 半透明手掌：掌心 + 四指
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a * 0.92; ctx.fillStyle = '#F2C9A0'; ctx.strokeStyle = '#B5835A'; ctx.lineWidth = 2;
  rr(x - w / 2, y - h / 2, w, h, 18); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { rr(x - w / 2 + 6 + i * (w - 12) / 4, y - h / 2 - 44 + Math.abs(i - 1.5) * 8, (w - 12) / 4 - 6, 52, 9); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
SC.cover = t => {
  starfield(t); blueprint(0.35, 80);
  // 分母三因子固定位置
  const Y = 360, fx = [700, 860, 1040], fs = ['x', '(2x − 1)', '(x + 2)'];
  mathText('x² + 2x − 1', 870, Y - 20, 32, CR, { align: 'center', alpha: 1, upright: true }); seg(620, Y, 1130, Y, SQ.Z.col, 1, 2.5);
  fs.forEach((s, k) => mathText(s, fx[k], Y + 40, 32, CR, { align: 'center', alpha: 1, upright: true }));
  const steps = [['Z01', 0.35, 0, 'x = 0', 'A = −1 / ((−1)(2)) = ½', CYAN], ['Z02', 0.2, 1, 'x = ½', 'B = 1/5', GOLD], ['Z02', 0.6, 2, 'x = −2', 'C = −1/10', SQ.Z.col]];
  let k0 = -1; steps.forEach(([id, f], k) => { if (t > P(id, f)) k0 = k; });
  if (k0 >= 0 && t < S('C05')) {
    const [id, f, k, sub, res, c] = steps[k0], p = eOut(prog(t, P(id, f), 0.35));
    palm(fx[k], Y + 30 + (1 - p) * 220, k ? 150 : 80, 60, p);
    richReveal([['代 ' + sub, c]], 870, 520, 28, t, P(id, f) + 0.2, { upright: true });
  }
  steps.forEach(([id, f, k, sub, res, c], j) => { if (t > P(id, f) + 0.3) mathText(res, 870, 600 + j * 50, 28, c, { align: 'center', alpha: clamp(prog(t, P(id, f) + 0.3, 0.3)) * fadeOut(t, S('C05'), 0.3), upright: true }); });
  if (t > S('C05')) {
    darkBox(540, 560, 660, 150, ap(t, 'C05', 0.05));
    mathText('½ ln|x| + (1/10) ln|2x − 1|', 870, 615, 28, GOLD, { align: 'center', alpha: ap(t, 'C05', 0.1), upright: true });
    mathText('− (1/10) ln|x + 2| + C', 870, 670, 28, GOLD, { align: 'center', alpha: ap(t, 'C05', 0.5), upright: true });
  }
  if (t > S('Z03')) { const a = ap(t, 'Z03', 0.1); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(1010, 605, 120, 30, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); richReveal([['(1/5) × ½ = 1/10', RED]], 1010, 760, 26, t, P('Z03', 0.4), { upright: true }); }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C06', 0, 0.5) * 0.42, 78);
  if (t < S('C07')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C06') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 460, 100, '', '∫ dx / (x² − 1) = ？', t, P('C07', 0.05), { size: 36 });
  if (t > S('Z04')) {
    richReveal([['½/(x − 1) − ½/(x + 1)', CR]], 820, 530, 32, t, P('Z04', 0.05), { upright: true });
    richReveal([['= ', CR], ['½ ln|(x − 1)/(x + 1)| + C', GOLD]], 820, 620, 34, t, P('Z04', 0.5), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C09'), 0.4);
  if (fa > 0) { richReveal([['假分式', CR], [' → 先除', GOLD]], 860, 330, 44, t, P('C08', 0.05), { alpha: fa }); richReveal([['一次因式', CR], [' → 拆开', SQ.Z.col]], 860, 420, 44, t, P('C08', 0.3), { alpha: fa }); richReveal([['系数', CR], [' → 掩盖法', CYAN]], 860, 510, 44, t, P('C08', 0.55), { alpha: fa }); }
  if (t > S('C09') - 0.1) { glowText('下一段：部分分式（二）', CX, 520, 52, CR, t, P('C09', 0.15)); glowText('Llama：一项一项写全', CX, 610, 32, SQ.L.col, t, P('C09', 0.45), { bold: false }); }
  credits(t, E('C09') + 0.38, 'AI娘微积分课 · 第 7 章 · P7 部分分式（一）', '下一段：部分分式二', [...CREDIT_BASE, ...CREDIT_GEN('GLM（智谱）'), ...CREDIT_END, CREDIT_TM7('GLM')]);
};

SC.__overlay = t => { if (t < E('C09') + 0.25) lecturer(t, 'C', 255, -5, E('C09') + 0.48, { h: 710 }); };
SC.__noTag = E('C09') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C09') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.4, 'pop', 0.2); [0.2, 0.35, 0.45, 0.6, 0.68, 0.8].forEach(f => s('C02', f, 'marimba', 0.11)); s('C02', 0.85, 'ding', 0.18); s('G01', 0.05, 'ding_hi', 0.24);
  s('C03', 0.4, 'warp', 0.16); s('C04', 0.2, 'whoosh', 0.2);
  s('Z01', 0.35, 'slam', 0.18); s('Z02', 0.2, 'slam', 0.18); s('Z02', 0.6, 'slam', 0.18); s('C05', 0.1, 'ding_hi', 0.24); s('Z03', 0.1, 'buzz', 0.14);
  s('C06', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('Z04', 0.5, 'ding_hi', 0.28);
  s('C08', 0.05, 'pop', 0.2); s('C08', 0.3, 'pop', 0.2); s('C08', 0.55, 'pop', 0.2); s('C09', 0.15, 'swell', 0.3);
})();
finalize();
