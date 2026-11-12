// 第 7 章 P9《有理化代换与万能代换》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.4 例 9 + 同济。
// A317 单位圆上 t = tan(x/2) · A318 换装转场 · A319 繁 vs 简对比
const SC = {};
const TITLES = [['root', '有理化代换'], ['wtan', '万能代换'], ['demo', '例题与提醒'], ['quiz', '随堂一题'], ['outro', '小结']];

// 换装转场：旧式子缩小旋转消失，新式子带闪光出现
function costume(x, y, from, to, t, t0, o = {}) {
  const p = clamp(prog(t, t0, 0.8)), sz = o.size || 32, c = o.col || SQ.N.col;
  if (p < 0.5) { const q = p * 2; ctx.save(); ctx.translate(x, y); ctx.rotate(q * 0.6); ctx.scale(1 - q, 1 - q); mathText(from, 0, 0, sz, CR, { align: 'center', upright: true }); ctx.restore(); }
  else { const q = eBack((p - 0.5) * 2); ctx.save(); ctx.translate(x, y); ctx.scale(q, q); mathText(to, 0, 0, sz, c, { align: 'center', upright: true }); ctx.restore(); }
  if (p > 0.3 && p < 0.8) for (let i = 0; i < 10; i++) { const an = i * 0.628 + t * 2, r = 40 + (p - 0.3) * 160; glowDot(x + r * Math.cos(an), y - 10 + r * 0.5 * Math.sin(an), 4, c, 1 - (p - 0.3) * 2); }
}

// ======================= 有理化（A318） =======================
SC.root = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C01')) { kinetic('变装：→ 有理函数', 860, 420, 50, t, P('N01', 0.1), { col: SQ.N.col }); return; }
  mathText('∫ √(x + 4) / x dx', 860, 260, 34, CR, { align: 'center', alpha: ap(t, 'C01', 0.05), upright: true });
  richReveal([['u = √(x + 4)', GOLD], ['   x = u² − 4,  dx = 2u du', CR]], 860, 340, 26, t, P('C01', 0.35), { upright: true });
  if (t > S('C02')) {
    costume(860, 450, '√(x + 4) / x', '∫ 2u² / (u² − 4) du', t, P('C02', 0.02), { size: 32 });
    richReveal([['= ∫ (2 + ', CR], ['8/(u² − 4)', SQ.Z.col], [') du', CR]], 860, 540, 30, t, P('C02', 0.45), { upright: true });
    label('部分分式 ← P7', 860, 600, 22, SQ.Z.col, ap(t, 'C02', 0.75), { bold: true });
  }
  if (t > S('G01')) { darkBox(540, 640, 660, 100, ap(t, 'G01', 0.05)); mathText('2√(x+4) + 2 ln|(√(x+4) − 2)/(√(x+4) + 2)| + C', 870, 700, 24, GOLD, { align: 'center', alpha: ap(t, 'G01', 0.1), upright: true }); }
};

// ======================= 万能代换几何（A317） =======================
SC.wtan = t => {
  starfield(t); blueprint(0.35, 80);
  richReveal([['万能钥匙：', CR], ['t = tan(x/2)', GOLD]], 860, 245, 34, t, P('C03', 0.2), { upright: true });
  const ox = 700, oy = 520, R = 170, x = 1.1 + 0.25 * Math.sin(t * 0.6), a = ap(t, 'C03', 0.5);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = hexA(CR, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ox, oy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox - R - 30, oy); ctx.lineTo(ox + R + 30, oy); ctx.moveTo(ox, oy - R - 30); ctx.lineTo(ox, oy + R + 30); ctx.stroke(); ctx.restore();
    const px = ox + R * Math.cos(x), py = oy - R * Math.sin(x);
    seg(ox, oy, px, py, CYAN, a, 3); seg(ox - R, oy, px, py, GOLD, a, 3);   // 从 (−1,0) 出发的弦，斜率 = tan(x/2)
    glowDot(px, py, 7, CYAN, a); glowDot(ox - R, oy, 6, GOLD, a);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CYAN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ox, oy, 36, -x, 0); ctx.stroke(); ctx.strokeStyle = GOLD; ctx.beginPath(); ctx.arc(ox - R, oy, 50, -x / 2, 0); ctx.stroke(); ctx.restore();
    label('x', ox + 50, oy - 18, 22, CYAN, a, {}); label('x/2', ox - R + 72, oy - 14, 20, GOLD, a, {});
    mathText('斜率 = t', ox - R + 40, oy + 40, 22, GOLD, { alpha: a, upright: true });
  }
  if (t > S('C04')) {
    const rows = [['sin x = 2t / (1 + t²)', 0.05], ['cos x = (1 − t²) / (1 + t²)', 0.35], ['dx = 2 dt / (1 + t²)', 0.68]];
    rows.forEach(([s, f], k) => mathText(s, 920, 420 + k * 64, 28, k === 2 ? CYAN : CR, { alpha: ap(t, 'C04', f), upright: true }));
  }
  if (t > S('N02')) stampMark(1080, 650, 52, t, P('N02', 0.2), { text: '全是有理式', col: SQ.N.col, rot: -0.1 });
};

// ======================= 例题 + 繁简对比（A319） =======================
SC.demo = t => {
  starfield(t); blueprint(0.35, 80);
  const f1 = fadeOut(t, S('G02'), 0.3);
  if (f1 > 0) {
    mathText('∫₀^{π/2} dx / (1 + sin x + cos x)', 860, 270, 32, CR, { align: 'center', alpha: ap(t, 'C05', 0.05) * f1, upright: true });
    richReveal([['x: 0 → π/2   ⇒   ', CR], ['t: 0 → 1', GOLD]], 860, 350, 28, t, P('C05', 0.55), { upright: true, alpha: f1 });
    if (t > S('C06')) {
      costume(860, 450, '(1 + t²) 全约掉', '∫₀¹ dt / (1 + t)', t, P('C06', 0.05), { size: 32 });
      goldBox(860, 560, 300, 70, '= ln 2', 34, ap(t, 'C06', 0.6) * f1);
    }
  }
  if (t > S('G02')) {
    mathText('∫ sin x cos x dx', 860, 260, 32, CR, { align: 'center', alpha: ap(t, 'G02', 0.05), upright: true });
    const a1 = ap(t, 'G02', 0.25), a2 = ap(t, 'G02', 0.55);
    panel(540, 320, 330, 340, RED, a1); panel(900, 320, 300, 340, GRN, a2);
    label('万能代换', 705, 355, 24, RED, a1, { bold: true }); label('凑微分', 1050, 355, 24, GRN, a2, { bold: true });
    ['∫ 4t(1 − t²)/(1 + t²)³ dt', '= …… 部分分式', '= …… 再回代', '= ……'].forEach((s, k) => mathText(s, 705, 410 + k * 56, 20, CR, { align: 'center', alpha: a1 * clamp(prog(t, P('G02', 0.25) + k * 0.25, 0.3)), upright: true }));
    mathText('u = sin x', 1050, 440, 24, CR, { align: 'center', alpha: a2, upright: true }); mathText('= ½ sin²x + C', 1050, 500, 26, GOLD, { align: 'center', alpha: a2, upright: true });
    crossMark(705, 620, 18, RED, t, P('G02', 0.8)); checkMark(1050, 620, 18, GRN, t, P('G02', 0.8));
  }
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 460, 100, '', '∫₀¹ dx / (1 + √x) = ？', t, P('C08', 0.05), { size: 36 });
  if (t > S('N03')) {
    richReveal([['u = √x :  ', GOLD], ['∫₀¹ 2u/(1 + u) du', CR]], 820, 530, 30, t, P('N03', 0.05), { upright: true });
    richReveal([['= ', CR], ['2 − 2 ln 2', GOLD]], 820, 620, 38, t, P('N03', 0.55), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C10'), 0.4);
  if (fa > 0) { richReveal([['根号', CR], [' → 换元有理化', GOLD]], 860, 350, 42, t, P('C09', 0.05), { alpha: fa }); richReveal([['三角有理式', CR], [' → t = tan(x/2)', SQ.N.col]], 860, 440, 42, t, P('C09', 0.35), { alpha: fa }); richReveal([['能简则简', GRN]], 860, 530, 40, t, P('C09', 0.65), { alpha: fa }); }
  if (t > S('C10') - 0.1) { glowText('下一段：积分策略 · 擂台第二轮', CX, 520, 52, CR, t, P('C10', 0.15)); glowText('Grok：只说招式，不算', CX, 610, 32, SQ.X.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 7 章 · P9 有理化与万能代换', '下一段：积分策略', [...CREDIT_BASE, ...CREDIT_GEN('MiniMax '), ...CREDIT_END, CREDIT_TM7('MiniMax')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('N01', 0.1, 'shimmer', 0.2); s('C01', 0.35, 'pop', 0.18); s('C02', 0.02, 'warp', 0.2); s('C02', 0.45, 'pop', 0.16); s('G01', 0.1, 'ding_hi', 0.24);
  s('C03', 0.2, 'ding', 0.2); [0.05, 0.35, 0.68].forEach(f => s('C04', f, 'pop', 0.15)); s('N02', 0.2, 'stamp', 0.24);
  s('C05', 0.55, 'pop', 0.16); s('C06', 0.05, 'warp', 0.2); s('C06', 0.6, 'ding_hi', 0.26); s('G02', 0.8, 'buzz', 0.14); s('G02', 0.82, 'check', 0.22);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('N03', 0.55, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C09', 0.35, 'pop', 0.2); s('C09', 0.65, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
