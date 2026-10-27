// 第 2 章 P9《收束 · 出口票》（2026-10-27）：数学画面全部原创 Canvas 绘制。
// A77 全章概念链 · A78 出口票揭晓（豆包主持）· A79 全章术语墙 + 第 3 章复合管道预告 · A80 片尾星图 + 全员合影
const SC = {};
const TITLES = [['chain', '全章一条链'], ['q1', '出口票 ①'], ['q2', '出口票 ②'], ['q3', '出口票 ③'], ['next', '下一章预告'], ['group', '合影']];
SIDE.D.dy = t => (t > S('C06') - 0.5 ? 2000 : 0);   // 合影时大肥鱼站进队伍，不再从右侧客串

// ======================= chain：A77 =======================
const NODES = [['0/0', 'P0 芝诺', INV], ['极限', 'P2–P4、P6', GOLD], ['连续', 'P5', CYAN], ['导数', 'P7–P8', GRN]];
SC.chain = t => {
  starfield(t); blueprint(0.45, 80);
  NODES.forEach(([h, s, c], k) => {
    const f = [0.1, 0.3, 0.55, 0.8][k], p = eBack(prog(t, P('C01', f), 0.4)); if (p <= 0) return; const x = 700 + 190 * k, y = 520;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); panel(-75, -60, 150, 120, c, 1); ctx.restore();
    label(h, x, y - 5, 40, c, clamp(p), { bold: true, font: k ? F_FANCY : F_MATH }); label(s, x, y + 90, 22, CR, clamp(p));
    if (k) arrowH(x - 190 + 80, x - 80, y, CR, ap(t, 'C01', f - 0.05), 3);
  });
  if (t > S('D01')) { burst(t, P('D01', 0.15), 700, 520, INV, 90); glowText('0/0 → 看它怎么趋于 0', CX, 330, 40, GOLD, t, P('D01', 0.3)); }
};

// ======================= 出口票 =======================
function ticket(t, n, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(30,22,12,0.85)'; ctx.strokeStyle = hexA(SQ.B.col, 0.9); ctx.lineWidth = 3; ctx.setLineDash([10, 8]); rr(640, 210, 700, 680, 18); ctx.fill(); ctx.stroke(); ctx.restore();
  label(`出口票 · 第 ${n} 题`, CX, 260, 34, SQ.B.col, a, { bold: true });
}
function qCountdown(t) { ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => { if (t >= b.vo - 0.08 && t <= b.vo + b.d + 0.18) countdown(t, b.vo, 1240, 760, 80); }); }
SC.q1 = t => {
  starfield(t); blueprint(0.45, 80);
  if (t < S('B02')) { kinetic('出口票来啦！', CX, 480, 70, t, P('B01', 0.1), { col: SQ.B.col }); kinetic('三道题 · 不糊弄', CX, 580, 40, t, P('B01', 0.5), { col: CR }); return; }
  ticket(t, 1, ap(t, 'B02', 0)); qCountdown(t);
  richReveal([['lim_{x→0} ', GOLD], ['sin 2x / x', RED], [' = ？', CR]], CX, 400, 52, t, P('B02', 0.2), { upright: true });
  if (t > S('D02')) { richReveal([['= 2 · ', CR], ['sin 2x / 2x', RED], ['  →  ', CR], ['2', GOLD]], CX, 520, 46, t, P('D02', 0.15), { upright: true }); checkMark(CX, 660, 44, GRN, t, P('D02', 0.7)); }
};
const GQ2 = { cx: 980, cy: 690, ux: 1100, uy: 1700, x0: -0.25, x1: 0.25, y0: -0.07, y1: 0.07 };
SC.q2 = t => {
  starfield(t); blueprint(0.45, 80);
  ticket(t, 2, 1); qCountdown(t);
  richReveal([['f(x) = x^2 sin(1/x)', RED], ['，', CR], ['f(0) = 0', GOLD]], CX, 350, 40, t, P('B03', 0.15), { upright: true });
  label('在 0 处连续吗？', CX, 420, 34, CR, ap(t, 'B03', 0.5), { bold: true });
  if (t > S('C02')) {
    const ga = ap(t, 'C02', 0.05); gAxes(GQ2, ga * 0.7, { grid: false });
    gPlot(GQ2, x => x * x, GOLD, { a: ga, w: 2.5, dash: [8, 6] }); gPlot(GQ2, x => -x * x, GOLD, { a: ga, w: 2.5, dash: [8, 6] });
    gPlot(GQ2, x => x * x * Math.sin(1 / x), RED, { a: ga, n: 3000, w: 2.2 }); gDot(GQ2, 0, 0, GRN, ap(t, 'C02', 0.6));
    label('连续 ✓', 1200, 820, 34, GRN, ap(t, 'C02', 0.7), { bold: true });
  }
};
const GQ3 = { cx: 720, cy: 830, ux: 170, uy: 34, x0: -0.3, x1: 2, y0: -1.2, y1: 8 };
SC.q3 = t => {
  starfield(t); blueprint(0.45, 80);
  const ta = fadeOut(t, S('B05'), 0.4);
  ticket(t, 3, ta); qCountdown(t);
  if (ta > 0) {
    richReveal([['y = x^3', RED], ['  在 (1, 1) 处的切线？', CR]], CX, 350, 42, t, P('B04', 0.15), { alpha: ta, upright: true });
    if (t > S('C03')) {
      const ga = ap(t, 'C03', 0.05) * ta; gAxes(GQ3, ga, { grid: false, ticks: { x: [[1, '1']], y: [[1, '1']] } });
      gPlot(GQ3, x => x * x * x, RED, { a: ga, xb: 1.95 }); gDot(GQ3, 1, 1, GOLD, ga);
      ctx.save(); gClip(GQ3); gLine(GQ3, 3, 1, 1, GQ3.x0, GQ3.x1, GRN, ga * ap(t, 'C03', 0.4), 3.5); ctx.restore();
      richReveal([['斜率 3  ⇒  ', CR], ['y = 3x − 2', GRN]], 1120, 450, 36, t, P('C03', 0.45), { alpha: ta, upright: true });
    }
  }
  if (t > S('B05')) { kinetic('全对的家人们，点赞！', CX, 470, 54, t, P('B05', 0.1), { col: SQ.B.col }); label('错了就回看对应那一段', CX, 580, 32, CR, ap(t, 'B05', 0.55), { bold: true }); }
};

// ======================= next：A79 =======================
const TERMS = ['极限', '左极限', '右极限', 'ε-δ', '夹逼', '0/0', '连续', '间断', '介值定理', '渐近线', '导数', '切线', '导函数', '可导', '二阶导数', '变化率'];
SC.next = t => {
  starfield(t); blueprint(0.45, 80);
  const wa = fadeOut(t, P('C04', 0.4), 0.4);
  TERMS.forEach((s, k) => { const a = ap(t, 'C04', 0.0 + 0.012 * k, 0.25) * wa; if (a <= 0) return; const x = 700 + 190 * (k % 4), y = 300 + 120 * Math.floor(k / 4); label(s, x, y, 32, [GOLD, CYAN, GRN, INV][k % 4], a, { bold: true }); });
  const pa = ap(t, 'C04', 0.45);
  if (pa > 0) {
    const y = 500, box = (x, s, c) => { panel(x - 70, y - 50, 140, 100, c, pa); label(s, x, y, 40, c, pa, { font: F_MATH, bold: true }); };
    label('x', 680, y, 40, CR, pa, { font: F_MATH }); arrowH(705, 800, y, CR, pa); box(880, 'g', CYAN); arrowH(955, 1040, y, CR, pa); box(1120, 'f', RED); arrowH(1195, 1260, y, CR, pa);
    label('f(g(x))', 1310, y, 30, GOLD, pa, { font: F_MATH });
    label('第 1 章 · 复合管道', CX, 360, 30, GRN, pa, { bold: true });
    const fl = (t * 0.8) % 1; glowDot(lerp(690, 1290, fl), y - 70, 6, GOLD, pa * 0.8);
  }
  if (t > S('C05') - 0.1) richReveal([['(f(g(x)))′ = ', GOLD], ['f′(g(x))', RED], [' · ', CR], ['g′(x)', CYAN]], CX, 680, 44, t, P('C05', 0.2), { upright: true });
  if (t > S('C05')) label('第 3 章 · 链式法则', CX, 780, 34, CR, ap(t, 'C05', 0.6), { bold: true });
};

// ======================= group：A80 =======================
const STARS2 = [[700, 170, 'P0 芝诺'], [860, 240, 'P1 速通'], [1010, 160, 'P2 极限'], [1160, 230, 'P3 算极限'], [1320, 150, 'P4 ε-δ'], [1460, 250, 'P5 连续'], [1600, 160, 'P6 渐近线'], [1730, 260, 'P7 导数'], [1850, 170, 'P8 导函数']];
const LINEUP = [['n_base', 1], ['l_base', 1], ['r_point', 1], ['h_base', 1], ['gp_proud', 0], ['q_point', 0], ['c_ok', 0], ['d_happy', 0], ['m_base', 0], ['x_thumb', 0], ['k_base', 0], ['b_wave', 0], ['z_deal', 0], ['t_base', 0]];
SC.group = t => {
  starfield(t);
  const sa = ap(t, 'C06', 0.0, 0.6);
  STARS2.forEach(([x, y, s], k) => {
    const a = sa * ap(t, 'C06', 0.05 * k, 0.3); if (a <= 0) return; const sx = x - 620;
    if (k) { const [px, py] = STARS2[k - 1]; seg(px - 620, py, sx, y, CYAN, 0.4 * a, 1.5); }
    glowDot(sx, y, 6, GOLD, a); label(s, sx, y + 28, 20, CR, a * 0.85);
  });
  const t0 = S('C06') - 0.2;
  LINEUP.forEach(([n, flip], k) => {
    const p = eBack(prog(t, t0 + 0.07 * Math.abs(k - 7), 0.4)); if (p <= 0) return;
    const x = 110 + 130 * k, h = k === 7 ? 500 : 450, by = 1100 + (k % 2) * 20;
    sprite(n, x, by, h * p, { flip: !!flip, alpha: clamp(p) });
  });
  if (t > S('D04')) burst(t, P('D04', 0.3), 110 + 130 * 7, 560, SQ.D.col, 100);
  label('第 2 章 · 完', CX, 420, 54, GOLD, ap(t, 'C06', 0.3), { bold: true, glow: 18 });
  credits(t, E('D04') + 1.2, 'AI娘微积分课 · 第 2 章 · P9 收束与出口票', '下一章：求导法则', [...CREDIT_BASE,
    '本章新角色：混元、GLM（智谱）、Mistral、Llama、MiniMax 娘立绘依据 ZipZipPipe 设定由 AI 生成差分；MiMo 娘依据 甶丶 设定（CC BY-NC）生成差分。',
    '豆包、千问、Gemini、Grok、Kimi 娘立绘：ZipZipPipe，复制自本系列 AI娘 Git 课素材。',
    '各角色声音：平台 TTS 合成的参考音，经 GPT-SoVITS 本地克隆；不使用真人声优的声音。', ...CREDIT_END,
    '文中出现的 AI 名称与商标归各自权利人；本片为非官方、非商业学习作品。']);
};

SC.__overlay = t => { if (t < S('C06') - 0.2) lecturer(t, 'C', 255, -5, S('C06') - 0.3, { h: 710 }); };
SC.__noTag = E('D04') + 1.1;
function drawFrame(t) { drawFrameStd(t, SC, TITLES, E('D04') + 1.2); }

// ======================= 音效 =======================
(function () {
  const s = (id, f, n, g) => sfx(P(id, f), n, g);
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.08, 'swoosh_soft', 0.32); });
  [0.1, 0.3, 0.55, 0.8].forEach((f, i) => s('C01', f, ['marimba_lo', 'marimba', 'marimba', 'marimba_hi'][i], 0.26)); s('D01', 0.15, 'sparkle', 0.28);
  s('B01', 0.1, 'pop', 0.28); s('B01', 0.5, 'tinkle', 0.22); s('B02', 0.2, 'type', 0.16);
  ENTRIES.filter(e => e.k === 'beat' && /^q[123]$/.test(e.b) && e.d > 2).forEach(b => countdownSfx(b.vo));
  s('D02', 0.7, 'check', 0.34); s('B03', 0.15, 'type', 0.16); s('C02', 0.05, 'swoosh_in', 0.2); s('C02', 0.7, 'check', 0.34);
  s('B04', 0.15, 'type', 0.16); s('C03', 0.4, 'ding_hi', 0.28); s('B05', 0.1, 'sparkle', 0.26);
  s('C04', 0.0, 'shimmer', 0.2); s('C04', 0.45, 'swoosh_in', 0.2); s('D03', 0.2, 'pluck', 0.22); s('C05', 0.2, 'type', 0.16); s('C05', 0.6, 'ding', 0.24);
  s('C06', 0.0, 'swell', 0.3); for (let k = 0; k < 8; k++) sfx(S('C06') - 0.2 + 0.07 * k, 'pop', 0.16); s('D04', 0.3, 'sparkle', 0.3);
})();
finalize();
