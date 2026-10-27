// P2《函数的大学定义：映射》场景 A：hook / def / sets / inj / proof
const SC = {};
const QB = ENTRIES.filter(e => e.k === 'beat' && e.b === 'quiz');
// ---------- 映射图公共数据 ----------
const MX = { x: 820, y: 600, rx: 110, ry: 190 }, MY = { x: 1190, y: 600, rx: 110, ry: 190 };
const XD = [[-30, -115], [35, -55], [-40, 5], [30, 65], [-15, 128]], YD = [[-25, -122], [30, -62], [-35, 0], [25, 60], [-20, 122]];
const F_MAP = [1, 0, 1, 3, 4];   // f：x_i → y_F[i]（x0、x2 同像；y2 无原像）
function mapPos(dx) { return { X: XD.map(([a, b]) => [MX.x + dx + a, MX.y + b]), Y: YD.map(([a, b]) => [MY.x + dx + a, MY.y + b]) }; }
function drawDots(pts, col, t, t0, a = 1, o = {}) {
  pts.forEach(([x, y], i) => { const p = eBack(prog(t, t0 + i * 0.06, 0.3)); if (p <= 0) return; const c = (o.cols && o.cols[i]) || col, r = (o.r || 9) * p * (1 + (o.pulse && o.pulse(i)) * 0.6); glowDot(x, y, r, c, a * (o.alpha ? o.alpha(i) : 1)); });
}
const TIPS = {
  map: { title: '映射的定义', zh: '设 X、Y 是两个非空集合，如果存在一个法则 f，使得对 X 中⟨每个⟩元素 x，按法则 f，在 Y 中有⟨唯一确定⟩的元素 y 与之对应，那么称 f 为从 X 到 Y 的映射，记作 f : X → Y。', en: 'A function f is a rule that assigns to ⟨each⟩ element x in a set D ⟨exactly one⟩ element, called f(x), in a set E.', enSrc: 'English · Stewart, Calculus ET 7e §1.1' },
  sets: { title: '三个集合', zh: 'X 称为映射 f 的⟨定义域⟩；X 中所有元素的像组成的集合称为 f 的⟨值域⟩，记作 f(X)，它是 Y 的子集。', en: 'The set D is called the ⟨domain⟩ of the function. The ⟨range⟩ of f is the set of all possible values of f(x) as x varies throughout the domain.', enSrc: 'English · Stewart §1.1（陪域 codomain 为通用术语，Stewart 不单列）' },
  inj: { title: '单射 · 满射 · 双射', zh: '若 f(X) = Y，称 f 为⟨满射⟩；若对 X 中任意两个不同元素 x₁ ≠ x₂，有 f(x₁) ≠ f(x₂)，称 f 为⟨单射⟩；既是单射又是满射，称为⟨一一映射⟩（双射）。', en: 'A function f is called a ⟨one-to-one⟩ function if it never takes on the same value twice; that is, f(x₁) ≠ f(x₂) whenever x₁ ≠ x₂.  (injective · surjective · bijective)', enSrc: 'English · Stewart §1.6' },
};
// ================= hook =================
const FLOAT = ['x^2 + 1', 'sin x', '√x', '2x − 3', 'log x', '1/x', 'e^x', '|x|', 'x^3 − x', 'cos 2x'];
SC.hook = (t) => {
  starfield(t);
  const fo = 1 - prog(t, P('C01', 0.25), 0.5);
  FLOAT.forEach((s, i) => {   // 漂浮的式子
    const a = prog(t, 0.3 + i * 0.12, 0.5) * fo; if (a <= 0) return;
    const an = i / FLOAT.length * 6.283 + t * 0.12, x = 1000 + Math.cos(an) * (300 + 60 * Math.sin(i)), y = 520 + Math.sin(an) * 230;
    ctx.save(); ctx.globalAlpha = a * 0.75; mathText(s, x, y, 34 + (i % 3) * 6, [CYAN, GOLD, COL.inv, COL.g][i % 4], { align: 'center', glow: 12 }); ctx.restore();
    if (fo < 1) sparks(t, P('C01', 0.25) + i * 0.03, x, y, { col: COL.red, n: 6, speed: 160, life: 0.4 });
  });
  kinetic('函数 = 式子？', 1000, 520, 70, t, S('D01') + 0.5, { col: COL.cream, out: P('C01', 0.2) });
  // 狄利克雷：两排闪烁点
  const da = win01(t, P('C01', 0.3), P('C02', 0.15), 0.4, 0.4);
  if (da > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 160; i++) { const x = 600 + h32(i, 1, 9) * 800, row = h32(i, 2, 9) < 0.5, tw = 0.5 + 0.5 * Math.sin(t * 7 + i), y = row ? 450 : 640; ctx.fillStyle = hexA(row ? GOLD : CYAN, da * (0.35 + 0.6 * tw)); ctx.fillRect(x - 2, y - 2, 4, 4); }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = da; mathText('1', 570, 462, 34, GOLD, { align: 'right', upright: true }); mathText('0', 570, 652, 34, CYAN, { align: 'right', upright: true }); mathText('D(x)', 1000, 360, 52, COL.cream, { align: 'center', glow: 12 }); ctx.restore();
    glowText('写不出像样的式子', 1290, 360, 38, COL.red, t, P('C01', 0.6), { bold: false, alpha: da });   // 不用印章：整段只留“证毕”一个；也不说“没有式子”（D(x) 有极限式）
  }
  // 三样东西
  const ta = prog(t, P('C02', 0.15), 0.5);
  if (ta > 0) {
    setBlob(MX.x, MX.y, MX.rx * eBack(prog(t, P('C02', 0.25), 0.5)), MX.ry, CYAN, ta, 'X');
    setBlob(MY.x, MY.y, MY.rx * eBack(prog(t, P('C02', 0.5), 0.5)), MY.ry, GOLD, prog(t, P('C02', 0.45), 0.4), 'Y');
    const ap = eOut(prog(t, P('C02', 0.72), 0.6)); arrowQ(MX.x + 60, MX.y - 170, MY.x - 60, MY.y - 170, COL.red, ap, 1, { bend: 90, w: 4, hs: 18 });
    if (ap > 0.5) mathText('f', 1005, 330, 54, COL.red, { align: 'center', glow: 14, alpha: prog(t, P('C02', 0.8), 0.3) });
    glowText('出发的集合', MX.x, 845, 34, CYAN, t, P('C02', 0.3), { bold: false });
    glowText('到达的集合', MY.x, 845, 34, GOLD, t, P('C02', 0.52), { bold: false });
    glowText('对应法则', 1005, 270, 34, COL.red, t, P('C02', 0.78), { bold: false });
  }
  lecturer(t, 'C', 255, S('C01') - 0.35, null);
};
// ================= def：映射（A09） =================
function mapScene(t, dx, arrowsAlpha, o = {}) {
  const { X, Y } = mapPos(dx);
  setBlob(MX.x + dx, MX.y, MX.rx, MX.ry, CYAN, o.ba ?? 1, o.xl ?? 'X');
  setBlob(MY.x + dx, MY.y, MY.rx, MY.ry, GOLD, o.ba ?? 1, o.yl ?? 'Y');
  return { X, Y };
}
SC.def = (t) => {
  starfield(t);
  const tipOn = win01(t, S('C04') + 0.1, E('C05') + 0.35, 0.5, 0.5), dx = -200 * eIO(tipOn);
  const ga = 1 - prog(t, S('G01') - 0.3, 0.35), back = prog(t, S('C09') - 0.1, 0.4), ma = Math.max(ga, back);
  if (ma > 0) {
    ctx.save(); ctx.globalAlpha = ma;
    const ex = t > S('C08') - 0.1 && t < S('C09'), exA = ex ? prog(t, S('C08'), 0.3) : 0;
    const xl = back > 0 ? 'X ⊆ ℝ' : 'X', yl = back > 0 ? 'Y ⊆ ℝ' : 'Y';
    const { X, Y } = mapScene(t, dx, 1, { xl, yl });
    const dotA = 1 - exA;   // 例子阶段换成图标
    const pulse = i => { const tt = P('C03', 0.42 + i * 0.05); return Math.max(0, 1 - Math.abs(t - tt) / 0.18); };
    drawDots(X, CYAN, t, P('C03', 0.08), dotA * (1 - back), { pulse, cols: X.map((_, i) => (t > P('C06', 0.12) && t < P('C06', 0.48) && i === 2) || (t > P('C06', 0.58) && t < E('C06') + 0.1 && i === 3) ? COL.red : null) });
    drawDots(Y, GOLD, t, P('C03', 0.22), dotA * (1 - back));
    // 箭头 f
    if (t < S('C08') + 0.3 || back > 0) {
      const fa = (1 - prog(t, S('C08') - 0.05, 0.25)) * (1 - back);
      F_MAP.forEach((j, i) => {
        let p = eOut(prog(t, P('C03', 0.62 + i * 0.06), 0.45));
        if (i === 2) p *= 1 - eIO(prog(t, P('C06', 0.02), 0.35)) * (1 - eOut(prog(t, P('C06', 0.48), 0.35)));
        const green = t > P('C07', 0.1) && (i === 0 || i === 2), col = green ? COL.g : COL.red;
        arrowQ(X[i][0], X[i][1], Y[j][0], Y[j][1], col, p, fa, { bend: 30 + i * 4, w: green ? 3.5 : 2.5, pulse: true, pulseT: t + i * 0.3 });
      });
      // 一箭双雕（违规）：x3 → y3 和 y2
      const dp = eOut(prog(t, P('C06', 0.56), 0.4)) * (1 - prog(t, E('C06') + 0.05, 0.3));
      if (dp > 0) arrowQ(X[3][0], X[3][1], Y[2][0], Y[2][1], COL.red, dp, fa, { bend: -20, w: 3.5 });
      if (t > P('C06', 0.1) && t < P('C06', 0.5)) { crossMark(X[2][0] - 60, X[2][1], 30, COL.red, t, P('C06', 0.15)); glowText('没有像', X[2][0] - 60, X[2][1] + 42, 26, '#ff8c7a', t, P('C06', 0.18), { bold: false, out: P('C06', 0.46) }); }
      if (t > P('C06', 0.62) && t < E('C06') + 0.2) { crossMark(X[3][0] - 60, X[3][1], 30, COL.red, t, P('C06', 0.7)); glowText('两个像', X[3][0] - 60, X[3][1] + 42, 26, '#ff8c7a', t, P('C06', 0.72), { bold: false, out: E('C06') }); }
      if (t > P('C07', 0.1) && t < E('C07') + 0.2) { checkMark(Y[1][0] + 60, Y[1][1], 36, COL.g, t, P('C07', 0.2)); glowText('多对一 ✓', Y[1][0] + 70, Y[1][1] + 46, 28, COL.g, t, P('C07', 0.25), { bold: false, align: 'left', out: E('C07') }); burst(t, P('C07', 0.2), Y[1][0], Y[1][1], COL.g, 70, 10); }
      // 像 / 原像
      if (t > P('C04', 0.5) && t < S('C06')) { glowText('像 f(x)', Y[1][0] + 30, Y[1][1] - 36, 28, GOLD, t, P('C04', 0.55), { align: 'left', bold: false, out: S('C06') - 0.2 }); glowText('原像', X[0][0] - 30, X[0][1] - 36, 28, CYAN, t, P('C04', 0.75), { align: 'right', bold: false, out: S('C06') - 0.2 }); }
    }
    // C08 例子：学生→学号；三角形→面积
    if (exA > 0 && ex) {
      const sw = prog(t, P('C08', 0.5), 0.3), phase1 = 1 - sw;
      X.forEach(([x, y], i) => { ctx.save(); ctx.globalAlpha = exA * phase1; ctx.fillStyle = CYAN; ctx.shadowColor = CYAN; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y - 9, 7, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + 8, 10, 8, 0, Math.PI, 0); ctx.fill(); ctx.restore(); });
      Y.forEach(([x, y], i) => { ctx.save(); ctx.globalAlpha = exA * phase1; ctx.font = `22px ${F_CODE}`; ctx.fillStyle = GOLD; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('No.' + (i + 1), x, y); ctx.restore(); });
      X.forEach(([x, y], i) => { const s = 9 + i * 1.5; ctx.save(); ctx.globalAlpha = exA * sw; ctx.strokeStyle = CYAN; ctx.lineWidth = 2.5; ctx.shadowColor = CYAN; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * (0.8 + (i % 2) * 0.4), y + s * 0.7); ctx.lineTo(x - s, y + s * 0.7); ctx.closePath(); ctx.stroke(); ctx.restore(); });
      const AREAS = ['6', '7.5', '10', '12', '15'], H2 = [0, 0, 1, 2, 3];
      Y.forEach(([x, y], i) => { if (i > 3) return; ctx.save(); ctx.globalAlpha = exA * sw; mathText(AREAS[i], x, y + 10, 28, GOLD, { align: 'center', upright: true }); ctx.restore(); });
      for (let i = 0; i < 5; i++) { const p1 = eOut(prog(t, S('C08') + 0.1 + i * 0.07, 0.4)); arrowQ(X[i][0], X[i][1], Y[i][0], Y[i][1], COL.red, p1, exA * phase1, { bend: 18, w: 2.2 }); const p2 = eOut(prog(t, P('C08', 0.55) + i * 0.07, 0.4)); arrowQ(X[i][0], X[i][1], Y[H2[i]][0], Y[H2[i]][1], COL.red, p2, exA * sw, { bend: 24, w: 2.2 }); }
      ctx.restore(); ctx.save(); ctx.globalAlpha = ma;
      glowText(sw < 0.5 ? '学生' : '三角形', MX.x + dx, 845, 32, CYAN, t, sw < 0.5 ? S('C08') + 0.1 : P('C08', 0.52), { bold: false });
      glowText(sw < 0.5 ? '学号' : '面积', MY.x + dx, 845, 32, GOLD, t, sw < 0.5 ? S('C08') + 0.2 : P('C08', 0.58), { bold: false });
    }
    // C09：实数集之间的映射 = 函数
    if (back > 0) {
      const NX = ['−1', '0.5', '2', '3'], NY = ['1', '0.25', '4', '9'];
      const { X: X2, Y: Y2 } = mapPos(0);
      [0, 1, 2, 3].forEach(i => { mathText(NX[i], X2[i][0], X2[i][1] + 10, 28, CYAN, { align: 'center', upright: true, alpha: back }); mathText(NY[i], Y2[i][0], Y2[i][1] + 10, 28, GOLD, { align: 'center', upright: true, alpha: back }); arrowQ(X2[i][0] + 22, X2[i][1], Y2[i][0] - 22, Y2[i][1], COL.red, eOut(prog(t, P('C09', 0.1) + i * 0.08, 0.4)), back, { bend: 22, w: 2.5 }); });
      mathText('x ↦ x^2', 1005, 330, 40, COL.red, { align: 'center', glow: 12, alpha: prog(t, P('C09', 0.3), 0.3) });
      glowText('映射  →  函数', 1005, 860, 44, COL.cream, t, P('C09', 0.5));
    }
    ctx.restore();
  }
  // 记号与关键词
  glowMath('f : X → Y', 820 + dx * 0.6 + 185, 225, 50, COL.cream, t, P('C04', 0.08), { align: 'center', upright: true, out: S('C06') - 0.2 });
  glowMath('x ↦ y = f(x)', 820 + dx * 0.6 + 185, 300, 40, COL.cream, t, P('C04', 0.3), { align: 'center', out: S('C06') - 0.2 });
  if (t > S('C05') && t < E('C05') + 0.5) { kinetic('每一个', MX.x + dx, 370, 52, t, P('C05', 0.3), { col: CYAN, out: E('C05') + 0.25 }); kinetic('唯一', MY.x + dx, 370, 52, t, P('C05', 0.65), { col: GOLD, out: E('C05') + 0.25 }); }
  tip(t, S('C04') + 0.2, E('C05') + 0.3, Object.assign({ w: 760 }, TIPS.map));
  // GPT：函数机器
  const mA = win01(t, S('G01') - 0.2, S('C09') + 0.1, 0.35, 0.35);
  if (mA > 0) {
    const cx = 1000, cy = 540;
    ctx.save(); ctx.globalAlpha = mA; ctx.shadowColor = COL.inv; ctx.shadowBlur = 22; ctx.fillStyle = 'rgba(16,20,44,0.92)'; ctx.strokeStyle = COL.inv; ctx.lineWidth = 3; rr(cx - 160, cy - 110, 320, 220, 22); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    [[-60, 0, 46, 1], [55, -20, 34, -1.4]].forEach(([gx, gy, R, sp]) => { ctx.save(); ctx.translate(cx + gx, cy + gy); ctx.rotate(t * sp * 1.6); ctx.strokeStyle = hexA(COL.inv, 0.8); ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k < 24; k++) { const an = k / 24 * 6.283, rr2 = R + (k % 2 ? 0 : 9); k ? ctx.lineTo(Math.cos(an) * rr2, Math.sin(an) * rr2) : ctx.moveTo(Math.cos(an) * rr2, Math.sin(an) * rr2); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, R * 0.35, 0, 7); ctx.stroke(); ctx.restore(); });
    mathText('f', cx + 100, cy + 70, 56, COL.red, { align: 'center', glow: 14 });
    ctx.fillStyle = hexA(COL.inv, 0.5); ctx.beginPath(); ctx.moveTo(cx - 60, cy - 190); ctx.lineTo(cx + 60, cy - 190); ctx.lineTo(cx + 20, cy - 110); ctx.lineTo(cx - 20, cy - 110); ctx.fill();
    ctx.restore();
    const IN = ['2', '−2', '3'], OUT = ['4', '4', '9'];
    IN.forEach((s, i) => {
      const t0 = P('G01', 0.25 + i * 0.2), pIn = prog(t, t0, 0.45), pOut = prog(t, t0 + 0.55, 0.5);
      if (pIn > 0 && pIn < 1) { ctx.save(); ctx.globalAlpha = mA; mathText(s, cx, lerp(cy - 260, cy - 110, eIn(pIn)), 44, CYAN, { align: 'center', upright: true, glow: 12 }); ctx.restore(); }
      if (pOut > 0) { const x = lerp(cx + 160, cx + 300 + i * 60, eOut(pOut)), y = cy + 60 - Math.sin(pOut * Math.PI) * 50; ctx.save(); ctx.globalAlpha = mA; mathText(OUT[i], x, y, 44, GOLD, { align: 'center', upright: true, glow: 12 }); ctx.restore(); sparks(t, t0 + 0.55, cx + 160, cy + 60, { col: GOLD, n: 10, speed: 260, life: 0.4, dir: 0, spread: 1.2 }); }
    });
    ctx.save(); ctx.globalAlpha = mA; glowText('投进一个 x  →  吐出唯一结果', cx, 820, 36, COL.cream, t, P('G01', 0.5), { bold: false }); ctx.restore();
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= sets：定义域 / 陪域 / 值域 =================
const AXS = { cx: 1000, cy: 640, u: 58, x0: -5, x1: 5, y0: -3.6, y1: 5 };
SC.sets = (t) => {
  starfield(t);
  const tg = S('C11'), da = 1 - prog(t, tg - 0.1, 0.4);
  if (da > 0) {   // 映射图 + 值域子集
    ctx.save(); ctx.globalAlpha = da;
    const { X, Y } = mapScene(t, 0, 1);
    drawDots(X, CYAN, t, -1, 1); drawDots(Y, GOLD, t, -1, 1, { alpha: i => i === 2 ? 0.35 : 1 });
    F_MAP.forEach((j, i) => arrowQ(X[i][0], X[i][1], Y[j][0], Y[j][1], COL.red, 1, 1, { bend: 30 + i * 4, pulse: true, pulseT: t + i * 0.3 }));
    const rp = eOut(prog(t, P('C10', 0.62), 0.6));
    if (rp > 0) { ctx.save(); ctx.setLineDash([8, 7]); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 14; ctx.beginPath(); ctx.ellipse(MY.x + 2, MY.y, 62 * rp, 175 * rp, 0, 0, 7); ctx.stroke(); ctx.restore(); }
    glowText('定义域 domain', MX.x, 845, 30, CYAN, t, P('C10', 0.18), { bold: false });
    glowText('陪域 codomain', MY.x, 845, 30, COL.cream, t, P('C10', 0.32), { bold: false });
    glowText('值域 f(X)', MY.x + 140, 470, 30, GOLD, t, P('C10', 0.7), { bold: false, align: 'left' });
    if (rp > 0) { mathText('?', Y[2][0] - 40, Y[2][1] + 12, 34, 'rgba(237,230,216,0.6)', { align: 'center', upright: true }); }
    ctx.restore();
  }
  const gA = prog(t, tg, 0.45);
  if (gA > 0) {
    const tipOn = win01(t, S('C13') + 0.1, E('C13') + 1.0, 0.5, 0.4), A = Object.assign({}, AXS, { cx: AXS.cx - 200 * eIO(tipOn) });
    axes(A, gA, { step: 2 });
    // 陪域：整条 y 轴（金）
    const [x0, yTop] = ax2px(A, 0, A.y1), [, yBot] = ax2px(A, 0, A.y0), [, y0p] = ax2px(A, 0, 0);
    const negDim = prog(t, P('C11', 0.7), 0.4);
    ctx.save(); ctx.globalAlpha = gA; ctx.shadowColor = COL.cream; ctx.shadowBlur = 10;
    ctx.fillStyle = hexA(COL.cream, 0.4); ctx.fillRect(x0 - 5, yTop, 10, y0p - yTop); ctx.fillStyle = hexA(COL.cream, 0.4 - 0.25 * negDim); ctx.fillRect(x0 - 5, y0p, 10, yBot - y0p); ctx.restore();
    mathText('陪域 ℝ', x0 - 16, yTop + 6, 28, COL.cream, { align: 'right', alpha: gA, upright: true });
    plotP(A, x => x * x, COL.f, eOut(prog(t, P('C11', 0.2), 0.8)), 4.5, gA, { xa: -2.3, xb: 2.3 });
    // 投影光束 → 值域
    const pp = prog(t, P('C11', 0.5), 0.9);
    if (pp > 0) {
      for (let k = 0; k < 9; k++) { const x = -2.2 + 4.4 * k / 8, y = x * x; if (y > A.y1) continue; const q = clamp((pp - k * 0.05) / 0.5); if (q <= 0) continue; const [px, py] = ax2px(A, x, y); const hx = lerp(px, x0, eOut(q)); glowPath(() => { ctx.moveTo(px, py); ctx.lineTo(hx, py); }, COL.f, 1.5, gA * 0.6 * (1 - q * 0.5)); glowDot(hx, py, 4, '#ffffff', gA * (1 - q * 0.3)); }
      const rh = eOut(pp);
      ctx.save(); ctx.globalAlpha = gA; ctx.shadowColor = GOLD; ctx.shadowBlur = 18; ctx.fillStyle = GOLD; ctx.fillRect(x0 - 3, lerp(y0p, yTop, rh), 6, (y0p - yTop) * rh); ctx.restore();
      glowMath('值域 [0, +∞)', x0 + 142, yTop + 40, 32, GOLD, t, P('C11', 0.75), { upright: true });
    }
    if (negDim > 0) { ctx.save(); ctx.globalAlpha = gA * negDim; ctx.strokeStyle = hexA(COL.red, 0.7); ctx.lineWidth = 2; for (let yy = y0p + 12; yy < yBot; yy += 14) { ctx.beginPath(); ctx.moveTo(x0 - 9, yy); ctx.lineTo(x0 + 9, yy - 8); ctx.stroke(); } ctx.restore(); glowText('没人射中', x0 + 22, (y0p + yBot) / 2, 28, '#ff8c7a', t, P('C11', 0.8), { bold: false, align: 'left' }); }
    // 满射：值域能不能填满陪域
    if (t > S('C12')) {
      kinetic('满射  ⇔  值域 = 陪域', A.cx, 230, 46, t, P('C12', 0.3), { col: COL.cream, out: S('C13') - 0.1 });
      const tries = prog(t, P('C12', 0.5), 1.2), dip = Math.sin(tries * Math.PI) * 0.45 * (1 - tries * 0.3);
      if (tries > 0 && tries < 1) { ctx.save(); ctx.globalAlpha = gA; ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 16; ctx.fillRect(x0 - 3, y0p, 6, (yBot - y0p) * dip); ctx.restore(); }
    }
    if (t > S('C13')) { glowMath('f(X) ⊆ Y', A.cx, 230, 44, COL.cream, t, P('C13', 0.15), { align: 'center', upright: true }); }
  }
  tip(t, S('C13') + 0.2, E('C13') + 0.95, Object.assign({ w: 760 }, TIPS.sets));
  lecturer(t, 'C', 255, -9, null);
};
// ================= inj：单射 / 满射 / 双射（A10） =================
const PAN = [
  { name: '单射', en: 'injective', nx: 3, ny: 4, map: [0, 2, 3], col: CYAN, id: 'C14' },
  { name: '满射', en: 'surjective', nx: 4, ny: 3, map: [0, 1, 1, 2], col: GOLD, id: 'C15' },
  { name: '双射', en: 'bijective', nx: 3, ny: 3, map: [0, 1, 2], col: COL.g, id: 'C16' },
];
function panel(t, k, cx, cy, a) {
  const pn = PAN[k], t0 = P(pn.id, 0.25); if (t < t0 - 0.05 || a <= 0) return;
  const pa = prog(t, t0, 0.4) * a, col = (n, h) => Array.from({ length: n }, (_, i) => cy + (i - (n - 1) / 2) * h);
  const xs = col(pn.nx, 70), ys = col(pn.ny, 70);
  ctx.save(); ctx.globalAlpha = pa; ctx.strokeStyle = hexA(pn.col, 0.5); ctx.lineWidth = 2; rr(cx - 140, cy - 170, 280, 340, 18); ctx.stroke(); ctx.restore();
  xs.forEach(y => glowDot(cx - 75, y, 8, CYAN, pa)); ys.forEach((y, j) => glowDot(cx + 75, y, 8, GOLD, pa * (pn.map.includes(j) ? 1 : 0.3)));
  pn.map.forEach((j, i) => arrowQ(cx - 75, xs[i], cx + 75, ys[j], pn.col, eOut(prog(t, t0 + 0.2 + i * 0.1, 0.4)), pa, { bend: 14, w: 2.5, pulse: k === 2, pulseT: t }));
  ctx.save(); ctx.globalAlpha = a; kinetic(pn.name, cx, cy - 215, 48, t, t0, { col: pn.col }); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; glowText(pn.en, cx, cy + 210, 28, pn.col, t, t0 + 0.3, { font: F_MATH, bold: false }); ctx.restore();
}
SC.inj = (t) => {
  starfield(t);
  const tg = S('G02') - 0.1, pa = 1 - prog(t, tg, 0.35);
  if (pa > 0) {
    const sh = eIO(prog(t, S('D03'), 0.5)) * (1 - eIO(prog(t, E('D03') - 0.1, 0.4)));
    const SX = [680, 1000, 1320];
    [0, 1, 2].forEach(k => { const x = lerp(SX[k], SX[(k + 1) % 3], sh), y = 580 - Math.sin(sh * Math.PI) * (k % 2 ? 40 : -40); panel(t, k, x, y, pa); });
    glowText('不同 x → 不同 y', 680, 850, 28, COL.cream, t, P('C14', 0.6), { bold: false, out: S('D03') });
    glowText('每个 y 都被射中', 1000, 850, 28, COL.cream, t, P('C15', 0.6), { bold: false, out: S('D03') });
    glowText('一一配对', 1320, 850, 28, COL.cream, t, P('C16', 0.6), { bold: false, out: S('D03') });
  }
  // GPT：撞车 / 满座
  const ga = win01(t, tg, S('C17') + 0.1, 0.35, 0.35);
  if (ga > 0) {
    ctx.save(); ctx.globalAlpha = ga;
    // 撞车
    const cx = 780, cy = 560, c1 = eIO(prog(t, P('G02', 0.2), 0.6));
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = GOLD; ctx.shadowBlur = 12; rr(cx - 32, cy - 26, 64, 52, 10); ctx.stroke(); ctx.shadowBlur = 0;
    [[-200, -90], [-200, 90]].forEach(([ox, oy], i) => { const x = cx + ox * (1 - c1) + (i ? 8 : -8) * c1, y = cy + oy * (1 - c1); glowDot(x, y, 14, i ? COL.inv : CYAN); });
    if (c1 >= 1) { sparks(t, P('G02', 0.2) + 0.6, cx, cy, { col: [COL.red, '#fff'], n: 20, speed: 380 }); crossMark(cx, cy - 90, 40, COL.red, t, P('G02', 0.2) + 0.6); }
    // 满座
    const sx = 1180;
    for (let i = 0; i < 4; i++) { const y = 440 + i * 80, q = eOut(prog(t, P('G02', 0.58) + i * 0.08, 0.45)), lit = q >= 1; ctx.strokeStyle = lit ? COL.g : GOLD; ctx.lineWidth = 3; ctx.shadowColor = lit ? COL.g : GOLD; ctx.shadowBlur = lit ? 18 : 8; rr(sx + 120 - 30, y - 24, 60, 48, 10); ctx.stroke(); ctx.shadowBlur = 0; glowDot(lerp(sx - 80, sx + 120, q), y, 13, CYAN); }
    checkMark(sx + 120, 360, 40, COL.g, t, P('G02', 0.58) + 0.75);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = ga; glowText('撞车 → 不是单射', cx, 760, 34, '#ff8c7a', t, P('G02', 0.3), { bold: false }); glowText('满座 → 满射', sx + 20, 760, 34, COL.g, t, P('G02', 0.65), { bold: false }); ctx.restore();
  }
  // 水平线检验
  const ha = prog(t, S('C17') - 0.05, 0.4);
  if (ha > 0) {
    const A = { cx: 780, cy: 680, u: 52, x0: -4, x1: 4, y0: -1.2, y1: 6.2 };
    axes(A, ha, { step: 2 });
    const m = eIO(prog(t, P('C17', 0.58), 0.6)), f = x => lerp(x * x * 0.7, 0.18 * x * x * x + 2.5, m);
    plot(A, f, m < 0.5 ? COL.f : COL.g, 4.5, ha);
    const sweep = (t0, t1) => clamp((t - t0) / (t1 - t0));
    const s1 = sweep(P('C17', 0.15), P('C17', 0.5)), s2 = sweep(P('C17', 0.68), P('C17', 0.98));
    const yv = m < 0.5 ? lerp(0.6, 5.5, s1) : lerp(0.3, 5.8, s2), on = m < 0.5 ? (s1 > 0 && s1 < 1) : (s2 > 0 && s2 < 1);
    if (on) {
      const [, py] = ax2px(A, 0, yv); glowPath(() => { ctx.moveTo(A.cx + A.x0 * A.u, py); ctx.lineTo(A.cx + A.x1 * A.u, py); }, '#ff6b81', 2.5, ha);
      for (let x = A.x0; x <= A.x1; x += 0.01) { const a1 = f(x) - yv, a2 = f(x + 0.01) - yv; if (a1 * a2 <= 0) { const [px] = ax2px(A, x, yv); glowDot(px, py, 8, m < 0.5 ? COL.red : COL.g, ha); } }
    }
    if (t > P('C17', 0.5) && m < 0.5) crossMark(A.cx + 150, A.cy - 300, 36, COL.red, t, P('C17', 0.5));
    if (t > P('C17', 0.98)) checkMark(A.cx + 150, A.cy - 300, 40, COL.g, t, P('C17', 0.98));
    glowText('水平线检验', A.cx, 270, 36, COL.cream, t, P('C17', 0.1), { bold: false });
  }
  tip(t, S('C17') + 0.45, S('C18') + 1.0, Object.assign({ w: 760 }, TIPS.inj));
  lecturer(t, 'C', 255, -9, null);
};
// ================= proof：证明模板 =================
function mathPartsX(parts, size) { const xs = []; let x = 0; parts.forEach(([s]) => { xs.push(x); x += mathW(s, size); }); return { xs, tot: x }; }
SC.proof = (t) => {
  starfield(t);
  glowMath('证明：f(x) = 2x + 1 是 ℝ → ℝ 的双射', 620, 215, 44, COL.cream, t, P('C18', 0.5), { upright: true });
  // 单射（左栏）
  const L = 620, fs = 46;
  glowMath('单射：设 f(x_1) = f(x_2)', L, 320, fs, CYAN, t, P('C19', 0.06));
  const P2 = [['2x_1', COL.cream], [' + 1', GOLD], [' = ', COL.text], ['2x_2', COL.cream], [' + 1', GOLD]];
  const a2 = prog(t, P('C19', 0.3), 0.3);
  if (a2 > 0) {
    const fly = prog(t, P('C19', 0.58), 0.5), { xs } = mathPartsX(P2, fs);
    P2.forEach(([s, c], i) => { const isOne = i === 1 || i === 4; const yy = 400 - (isOne ? eIn(fly) * 60 : 0), al = a2 * (isOne ? 1 - fly : 1); mathText(s, L + xs[i], yy, fs, c, { glow: 10, alpha: al }); if (isOne) sparks(t, P('C19', 0.58) + 0.2, L + xs[i] + 30, 380, { col: GOLD, n: 10, speed: 200, life: 0.5 }); });
    if (fly > 0) glowText('两边 − 1', L + 470, 392, 26, GOLD, t, P('C19', 0.6), { bold: false, align: 'left' });
  }
  glowMath('2x_1 = 2x_2', L, 480, fs, COL.cream, t, P('C19', 0.7));
  if (t > P('C19', 0.78)) glowText('两边 ÷ 2', L + 470, 472, 26, GOLD, t, P('C19', 0.78), { bold: false, align: 'left' });
  glowMath('x_1 = x_2', L, 560, fs + 4, GOLD, t, P('C19', 0.88));
  if (t > P('C19', 0.9)) { checkMark(L + 220, 545, 36, COL.g, t, P('C19', 0.92)); burst(t, P('C19', 0.92), L + 220, 545, COL.g, 60, 10); }
  // 逆否
  if (t > S('C20')) {
    const a = prog(t, S('C20'), 0.3), sw = eIO(prog(t, P('C20', 0.5), 0.8));
    ctx.save(); ctx.globalAlpha = a * 0.55; mathText('定义：x_1 ≠ x_2  ⇒  f(x_1) ≠ f(x_2)', L, 670, 34, COL.cream, { upright: false }); ctx.restore();
    const A1 = 'x_1 = x_2', B1 = 'f(x_1) = f(x_2)', yA = 750, xL = L + 90, xR = L + 470;
    if (sw > 0) {
      const p1 = [lerp(xL, xR, sw), yA - Math.sin(sw * Math.PI) * 50], p2 = [lerp(xR, xL, sw), yA + Math.sin(sw * Math.PI) * 50];
      mathText(B1, p2[0], p2[1], 36, GOLD, { glow: 12, alpha: a }); mathText(A1, p1[0], p1[1], 36, GOLD, { glow: 12, alpha: a });
      mathText('⇒', L + 380, yA, 36, COL.cream, { alpha: a * prog(t, P('C20', 0.5), 0.3) });
      glowText('逆否命题 contrapositive', L, 820, 28, COL.inv, t, P('C20', 0.7), { bold: false, align: 'left' });
    }
  }
  // 满射（右栏）：任给 y，解出 x
  if (t > S('C21') - 0.1) {
    const A = { cx: 1340, cy: 690, u: 44, x0: -3.5, x1: 5, y0: -2, y1: 6.5 }, a = prog(t, S('C21'), 0.4);   // 下移：标题与直线不再重叠
    glowMath('满射：任意给定 y', 1340, 320, fs, GOLD, t, P('C21', 0.05));
    axes(A, a, { step: 2, labels: true });
    plot(A, x => 2 * x + 1, COL.g, 4, a);
    const yv = kf(t, 5, [[P('C21', 0.3), -1, 0.7], [P('C21', 0.55), 6, 0.7], [P('C21', 0.8), 3, 0.5]]), xv = (yv - 1) / 2;
    const [yx, yy] = ax2px(A, 0, yv), [px] = ax2px(A, xv, yv), [, x0y] = ax2px(A, xv, 0);
    if (t > P('C21', 0.15)) {
      ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([6, 6]); ctx.strokeStyle = hexA(GOLD, 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(yx, yy); ctx.lineTo(px, yy); ctx.stroke(); ctx.strokeStyle = hexA(CYAN, 0.8); ctx.beginPath(); ctx.moveTo(px, yy); ctx.lineTo(px, x0y); ctx.stroke(); ctx.restore();
      glowDot(yx, yy, 8, GOLD, a); glowDot(px, yy, 7, '#ffffff', a); glowDot(px, x0y, 8, CYAN, a);
    }
    glowMath('x = (y − 1)/2', 1340, 845, 44, CYAN, t, P('C21', 0.45));
  }
  // 结论 + 模板
  if (t > S('C22')) {
    stampMark(1700, 225, 58, t, P('C22', 0.15), { text: '证毕', col: COL.g });
    glowText('第一步 · 单射：设相等 ⇒ 推相等', 860, 895, 34, CYAN, t, P('C22B', 0.12), { bold: false });
    glowText('第二步 · 满射：任给 y ⇒ 解出 x', 1400, 895, 34, GOLD, t, P('C22C', 0.12), { bold: false });
  }
  tip(t, -1, -0.5, {});   // 占位
  lecturer(t, 'C', 255, -9, null);
};
