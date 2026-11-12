// 第 7 章 P5《三角积分（二）：tan、sec 与积化和差》（2026-11-12）：数学画面全部原创 Canvas 绘制。Stewart 7e §7.2 例 5、7、8、9。
// A305 sec²x 与 d(tan x) 配对 · A306 ∫sec³x 的循环 · A307 两条波叠加成和差
const SC = {};
const TITLES = [['pair', 'sec² 配 tan'], ['sec3', '∫ sec³x'], ['p2s', '积化和差'], ['quiz', '随堂一题'], ['outro', '小结']];


// ======================= 配对（A305） =======================
SC.pair = t => {
  starfield(t); blueprint(0.35, 80);
  questionCard(860, 250, 440, 80, '', '∫ tan⁶x sec⁴x dx', t, P('M01', 0.1), { col: SQ.M.col, size: 34 });
  if (t > S('C01')) {
    const a = ap(t, 'C01', 0.05); mathText('d(tan x) = sec²x dx', 860, 360, 32, CYAN, { align: 'center', alpha: a, upright: true });
    const sp = eIO(prog(t, P('C01', 0.45), 0.8));   // sec⁴ 分成 sec² · sec²，右边那块飞去和 dx 配对
    [['tan⁶x', CR, 0], ['sec²x', CR, 1], ['sec²x', CYAN, 2]].forEach(([s, c, k]) => {
      const x = 640 + k * 160 + (k === 2 ? sp * 140 : 0), y = 470 + (k === 2 ? sp * 0 : 0);
      ctx.save(); ctx.globalAlpha *= ap(t, 'C01', 0.3); ctx.fillStyle = hexA(k === 2 ? CYAN : '#8FA3C8', 0.16); ctx.strokeStyle = k === 2 ? CYAN : '#8FA3C8'; ctx.lineWidth = 2; rr(x - 65, y - 32, 130, 64, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      mathText(s, x, y + 9, 26, c, { align: 'center', alpha: ap(t, 'C01', 0.3), upright: true });
    });
    if (sp > 0.5) mathText('dx', 1090, 479, 26, CYAN, { alpha: clamp(prog(t, P('C01', 0.75), 0.3)), upright: true });
  }
  if (t > S('C02')) {
    const a = ap(t, 'C02', 0.05); mathText('1 + tan²x', 800, 540, 24, GOLD, { align: 'center', alpha: a, upright: true }); if (a > 0) arrow(800, 515, 800, 505, GOLD, a, 2);
    richReveal([['u = tan x :  ', CYAN], ['∫ u⁶(1 + u²) du', CR]], 860, 620, 30, t, P('C02', 0.5), { upright: true });
  }
  if (t > S('G01')) goldBox(860, 710, 600, 70, '= (1/7) tan⁷x + (1/9) tan⁹x + C', 30, ap(t, 'G01', 0.05));
};

// ======================= ∫sec³ 循环（A306） =======================
SC.sec3 = t => {
  starfield(t); blueprint(0.35, 80);
  const f1 = fadeOut(t, S('C04'), 0.3);
  if (f1 > 0) {
    mathText('∫ tan³x dx = ∫ tan x (sec²x − 1) dx', 860, 330, 30, CR, { align: 'center', alpha: ap(t, 'C03', 0.05) * f1, upright: true });
    goldBox(860, 450, 560, 74, '= ½ tan²x − ln|sec x| + C', 32, ap(t, 'C03', 0.55) * f1);
  }
  if (t > S('C04')) {
    const cx = 860, cy = 470, R = 150, t0 = P('C04', 0.2), sw = eIO(prog(t, t0, 1.8));
    mathText('J = ∫ sec³x dx', cx, 260, 32, CR, { align: 'center', alpha: ap(t, 'C04', 0.05), upright: true });
    ctx.save(); ctx.strokeStyle = hexA(SQ.M.col, 0.85); ctx.lineWidth = 4; ctx.setLineDash([12, 8]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + sw * 2 * Math.PI * 0.97); ctx.stroke(); ctx.restore();
    if (sw > 0 && sw < 1) { const an = -Math.PI / 2 + sw * 2 * Math.PI * 0.97; glowDot(cx + R * Math.cos(an), cy + R * Math.sin(an), 9, SQ.M.col, 1); }
    label('J', cx, cy, 70, GOLD, clamp(prog(t, t0 + 1.6, 0.3)), { bold: true });
    label('u = sec x,  dv = sec²x dx', cx, cy + R + 40, 22, CR, ap(t, 'C04', 0.3) * fadeOut(t, S('G02'), 0.3), {});
    label('P2：eˣ sin x 同款', cx + 260, cy - 40, 22, SQ.B.col, ap(t, 'C04', 0.6) * fadeOut(t, S('G02'), 0.3), { bold: true });
  }
  if (t > S('G02')) {
    const a = ap(t, 'G02', 0.05); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(8,12,28,0.92)'; rr(540, 610, 640, 120, 14); ctx.fill(); ctx.restore();
    mathText('2J = sec x tan x + ln|sec x + tan x|', 860, 650, 26, CR, { align: 'center', alpha: a, upright: true });
    mathText('J = ½ (sec x tan x + ln|sec x + tan x|) + C', 860, 705, 26, GOLD, { align: 'center', alpha: ap(t, 'G02', 0.5), upright: true });
  }
  if (t > S('M02')) stampMark(1130, 290, 58, t, P('M02', 0.1), { text: '极其漂亮！', col: SQ.M.col, rot: -0.12 });
};

// ======================= 积化和差（A307） =======================
const GW = { cx: 560, cy: 0, ux: 100, uy: 55, x0: 0, x1: 6.3, y0: -1.1, y1: 1.1 };
function wave(f, cy, col, a, w = 3) { const G = Object.assign({}, GW, { cy }); gPlot(G, f, col, { a, xa: 0, xb: 6.28, w }); }
SC.p2s = t => {
  starfield(t); blueprint(0.35, 80);
  mathText('sin A cos B = ½ [sin(A − B) + sin(A + B)]', 860, 260, 28, CR, { align: 'center', alpha: ap(t, 'C05', 0.1), upright: true });
  const a1 = ap(t, 'C05', 0.3); wave(x => Math.sin(4 * x), 360, SQ.M.col, a1, 2.5); wave(x => Math.cos(5 * x), 360, hexA(CYAN, 0.7), a1, 2.5);
  label('sin 4x · cos 5x', 1240, 360, 20, CR, a1, {});
  const a2 = ap(t, 'C05', 0.55); wave(x => Math.sin(4 * x) * Math.cos(5 * x), 490, GOLD, a2, 3); label('乘积', 1240, 490, 20, GOLD, a2, {});
  const a3 = ap(t, 'C06', 0.05); wave(x => 0.5 * Math.sin(9 * x), 600, SQ.M.col, a3, 2.5); wave(x => -0.5 * Math.sin(x), 600, CYAN, a3, 3); label('½ sin 9x − ½ sin x', 1240, 600, 20, CR, a3, {});
  if (a3 > 0) { label('=', 520, 545, 34, GOLD, a3, { bold: true }); }
  if (t > S('C06')) goldBox(860, 720, 640, 66, '∫ = −(1/18) cos 9x + ½ cos x + C', 28, ap(t, 'C06', 0.5));
};

// ======================= 随堂 =======================
SC.quiz = t => {
  starfield(t); blueprint(ap(t, 'C07', 0, 0.5) * 0.42, 78);
  if (t < S('C08')) { kinetic('随堂一题 · 3 秒', CX, 520, 60, t, S('C07') + 0.05, { col: GOLD }); return; }
  quizCountdown(t, 1300, 330);
  questionCard(820, 380, 520, 100, '', '∫₀^{π/4} sec²x tan x dx = ？', t, P('C08', 0.05), { size: 34 });
  if (t > S('M04')) {
    richReveal([['u = tan x :  ', CYAN], ['∫₀¹ u du', CR]], 820, 530, 32, t, P('M04', 0.1), { upright: true });
    richReveal([['= ', CR], ['1/2', GOLD]], 820, 620, 40, t, P('M04', 0.6), { upright: true });
  }
};

// ======================= 小结 =======================
SC.outro = t => {
  starfield(t); blueprint(0.42, 80);
  const fa = fadeOut(t, S('C10'), 0.4);
  if (fa > 0) { richReveal([['sec²x', CYAN], [' 配 ', CR], ['d(tan x)', CYAN]], 860, 330, 42, t, P('C09', 0.05), { alpha: fa }); richReveal([['∫ sec³x', SQ.M.col], [' → 循环', CR]], 860, 420, 42, t, P('C09', 0.3), { alpha: fa }); richReveal([['积', GOLD], [' → 和差', CR]], 860, 510, 42, t, P('C09', 0.55), { alpha: fa }); }
  if (t > S('C10') - 0.1) { glowText('下一段：三角代换进阶与配方', CX, 520, 52, CR, t, P('C10', 0.15)); glowText('Mistral：路不平，先配方修路', CX, 610, 32, SQ.R.col, t, P('C10', 0.45), { bold: false }); }
  credits(t, E('C10') + 0.38, 'AI娘微积分课 · 第 7 章 · P5 tan、sec 与积化和差', '下一段：三角代换', [...CREDIT_BASE, ...CREDIT_M, ...CREDIT_END, CREDIT_TM7('Gemini')]);
};

SC.__overlay = t => { if (t < E('C10') + 0.25) lecturer(t, 'C', 255, -5, E('C10') + 0.48, { h: 710 }); };
SC.__noTag = E('C10') + 0.30;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('C10') + 0.38); }

(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  s('M01', 0.1, 'pop', 0.22); s('C01', 0.05, 'ding', 0.16); s('C01', 0.45, 'whoosh', 0.18); s('C02', 0.5, 'pop', 0.18); s('G01', 0.05, 'ding_hi', 0.24);
  s('C03', 0.55, 'ding', 0.2); s('C04', 0.2, 'warp', 0.2); s('G02', 0.5, 'ding_hi', 0.24); s('M02', 0.1, 'stamp', 0.26);
  s('C05', 0.3, 'swell', 0.14); s('C05', 0.55, 'pop', 0.16); s('C06', 0.05, 'pop', 0.16); s('C06', 0.5, 'ding', 0.2); s('M03', 0.1, 'shimmer', 0.14);
  s('C07', 0.05, 'pop', 0.26); quizBeats().forEach(b => countdownSfx(b.vo)); s('M04', 0.6, 'ding_hi', 0.28);
  s('C09', 0.05, 'pop', 0.2); s('C09', 0.3, 'pop', 0.2); s('C09', 0.55, 'pop', 0.2); s('C10', 0.15, 'swell', 0.3);
})();
finalize();
