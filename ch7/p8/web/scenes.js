// 第 7 章 P8《部分分式（二）：重因式与二次因式》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.4 例 4、例 5。
// A314 四种情形模板卡 · A315 待定系数比较方程组 · A316 漏项 ✗ 与写全 ✓ 对照
const SC = {};
const TITLES = [['cases', '四种情形'], ['rep', '重因式'], ['quad', '二次因式'], ['quiz', '随堂一题'], ['outro', '小结']];

// ======================= 模板卡（A314） =======================
const CASES8 = [['① 不同一次', '(x − a)', 'A/(x − a)', CYAN], ['② 重复一次', '(x − a)²', 'A/(x − a) + B/(x − a)²', GOLD], ['③ 不可约二次', '(x² + bx + c)', '(Ax + B)/(x² + bx + c)', SQ.L.col], ['④ 重复二次', '(x² + bx + c)²', '… + (Cx + D)/(…)²', SQ.Z.col]];
function caseCards(t, t0, a0 = 1, hi = -1) {
  CASES8.forEach(([h, f, tpl, c], k) => {
    const x = 700 + (k % 2) * 340, y = 360 + Math.floor(k / 2) * 190, p = eBack(prog(t, t0 + k * 0.45, 0.4)); if (p <= 0) return; const a = clamp(p) * a0 * (hi < 0 || hi === k ? 1 : 0.35);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(p, p); panel(-155, -75, 310, 150, c, 1); ctx.restore();
    label(h, x, y - 45, 24, c, a, { bold: true }); mathText(f, x, y + 2, 24, CR, { align: 'center', alpha: a, upright: true }); mathText(tpl, x, y + 48, 20, c, { align: 'center', alpha: a, upright: true });
  });
}
SC.cases = t => {
  starfield(t); blueprint(0.35, 80);
  label('分母分解后的因子', 870, 230, 32, CR, ap(t, 'C01', 0.1), { bold: true });
  caseCards(t, P('C02', 0.02));
  if (t > S('L01')) kinetic('一项一项写全', 870, 760, 34, t, P('L01', 0.1), { col: SQ.L.col });
};

// ======================= 重因式（A316） =======================
SC.rep = t => {
  starfield(t); blueprint(0.35, 80);
  mathText('1 / (x (x − 1)²)', 870, 260, 34, CR, { align: 'center', alpha: ap(t, 'C03', 0.05), upright: true });
  const yA = 380, yB = 480;
  if (t > S('C03')) { mathText('= A/x + B/(x − 1) + C/(x − 1)²', 860, yA, 30, CR, { align: 'center', alpha: ap(t, 'C03', 0.5), upright: true }); }
  if (t > S('G01')) {
    mathText('= A/x + B/(x − 1)²', 800, yB, 30, hexA(RED, 0.9), { align: 'center', alpha: ap(t, 'G01', 0.05), upright: true });
    crossMark(1080, yB - 10, 20, RED, t, P('G01', 0.35)); checkMark(1190, yA - 10, 20, GRN, t, P('G01', 0.45));
    label('漏项 → 无解', 800, yB + 50, 24, RED, ap(t, 'G01', 0.55), {});
  }
  if (t > S('C04')) {
    darkBox(540, 590, 660, 160, ap(t, 'C04', 0.05));
    richReveal([['A = 1,  B = −1,  C = 1', CYAN]], 870, 630, 28, t, P('C04', 0.05), { upright: true });
    mathText('ln|x| − ln|x − 1| − 1/(x − 1) + C', 870, 700, 28, GOLD, { align: 'center', alpha: ap(t, 'C04', 0.5), upright: true });
  }
};

// ======================= 二次因式（A315） =======================
SC.quad = t => {
  starfield(t); blueprint(0.35, 80);
  if (t < S('C05')) {
    mathText('x² + 4 = (x − ?)(x − ?)', 870, 380, 34, CR, { align: 'center', alpha: ap(t, 'L02', 0.1), upright: true });
    stampMark(900, 500, 56, t, P('L02', 0.5), { text: '分不开', col: SQ.L.col, rot: -0.1 }); return;
  }
  mathText('(2x² − x + 4) / (x (x² + 4))', 870, 250, 30, CR, { align: 'center', alpha: 1, upright: true });
  richReveal([['= A/x + ', CR], ['(Bx + C)', SQ.L.col], ['/(x² + 4)', CR]], 870, 320, 30, t, P('C05', 0.4), { upright: true });
  if (t > S('C06') && t < S('G02') + 0.3) {
    const a = ap(t, 'C06', 0.05) * fadeOut(t, S('G02'), 0.3);
    const rows = [['x² :', 'A + B = 2'], ['x :', 'C = −1'], ['1 :', '4A = 4']];
    rows.forEach(([l, r], k) => { mathText(l, 700, 420 + k * 50, 26, CYAN, { alpha: a * clamp(prog(t, P('C06', 0.1 + 0.15 * k), 0.3)), upright: true }); mathText(r, 780, 420 + k * 50, 26, CR, { alpha: a * clamp(prog(t, P('C06', 0.1 + 0.15 * k), 0.3)), upright: true }); });
    richReveal([['⇒  A = 1, B = 1, C = −1', GOLD]], 1060, 470, 26, t, P('C06', 0.6), { upright: true, alpha: a });
  }
  if (t > S('G02')) {
    const a = ap(t, 'G02', 0.05) * fadeOut(t, S('C07'), 0.3);
    mathText('∫ x/(x² + 4) dx = ½ ln(x² + 4)', 870, 440, 28, CR, { align: 'center', alpha: a, upright: true });
    mathText('∫ 1/(x² + 4) dx = ½ arctan(x/2)', 870, 510, 28, CR, { align: 'center', alpha: a * ap(t, 'G02', 0.5), upright: true });
  }
  if (t > S('C07')) goldBox(870, 480, 680, 76, 'ln|x| + ½ ln(x² + 4) − ½ arctan(x/2) + C', 26, ap(t, 'C07', 0.1));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C08', 0, 0.5) * 0.42, 78);
  if (t < S('C09')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C08') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 560, 100, '拆项', '(x + 1) / ((x − 2)²(x² + 1))', t, P('C09', 0.05), { size: 28 });
  if (t > S('L03')) {
    richReveal([['A/(x − 2)', CYAN], [' + ', CR], ['B/(x − 2)²', GOLD]], 820, 520, 28, t, P('L03', 0.05), { upright: true }); if (t > S('L04')) richReveal([['+ (Cx + D)/(x² + 1)', SQ.L.col]], 820, 570, 28, t, P('L04', 0.05), { upright: true });
    richReveal([['4 个系数', CR]], 820, 620, 30, t, P('L04', 0.6), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C11'), 0.4);
  if (fa > 0) caseCards(t, P('C10', 0.02) - 1, fa);
  if (t > S('C11') - 0.1) { glowText('下一段：有理化与万能代换', CX, 520, 52, CR, t, P('C11', 0.15)); glowText('MiniMax 变装：t = tan(x/2)', CX, 610, 32, SQ.N.col, t, P('C11', 0.45), { bold: false }); }
  credits(t, E('C11') + 0.38, 'AI娘微积分课 · 第 7 章 · P8 部分分式（二）', '下一段：万能代换', [...CREDIT_BASE, ...CREDIT_GEN('Llama '), ...CREDIT_END, CREDIT_TM7('Llama')]);
};

SC.__overlay = t => { if (t < E('C11') + 0.25) lecturer(t, 'C', 255, -5, E('C11') + 0.48, { h: 710 }); };
SC.__noTag = E('C11') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C11') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('C01', 0.1, 'pop', 0.2); [0, 1, 2, 3].forEach(k => sfx(P('C02', 0.02) + k * 0.45, 'pop', 0.16)); s('L01', 0.1, 'shimmer', 0.14);
  s('C03', 0.5, 'pop', 0.18); s('G01', 0.35, 'buzz', 0.18); s('G01', 0.45, 'check', 0.22); s('C04', 0.5, 'ding_hi', 0.24);
  s('L02', 0.5, 'stamp', 0.24); s('C05', 0.4, 'pop', 0.18); [0, 1, 2].forEach(k => s('C06', 0.1 + 0.15 * k, 'marimba', 0.12)); s('C06', 0.6, 'ding', 0.18); s('G02', 0.05, 'pop', 0.16); s('C07', 0.1, 'ding_hi', 0.26);
  s('C08', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('L03', 0.05, 'ding_hi', 0.28);
  s('C10', 0.05, 'pop', 0.2); s('C11', 0.15, 'swell', 0.3);
})();
finalize();
