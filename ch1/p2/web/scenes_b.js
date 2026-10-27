// P2 场景 B：x2 / equal / special / vlt / quiz / outro + 合成 + 音效
TIPS.floor = { title: '取整函数', zh: '设 x 为任一实数，不超过 x 的⟨最大整数⟩称为 x 的整数部分，记作 [x]。', en: 'The ⟨greatest integer function⟩ is defined by ⟦x⟧ = the largest integer that is less than or equal to x.   (floor:  ⌊x⌋ = max{ n ∈ ℤ : n ≤ x })', enSrc: 'English · Stewart §2.3 Example 10' };
TIPS.vlt = { title: '竖线检验', zh: '平面上一条曲线是某个函数 y = f(x) 的图像，⟨当且仅当⟩每条竖直线与它⟨至多交于一点⟩——这正是映射定义中的“唯一”。', zhSrc: '中文表述（同济未单列此名称）', en: 'The Vertical Line Test: A curve in the xy-plane is the graph of a function of x ⟨if and only if⟩ no vertical line intersects the curve ⟨more than once⟩.', enSrc: 'English · Stewart §1.1' };
TIPS.eq = { title: '函数相等', zh: '构成函数的要素是：⟨定义域⟩ D_f 及⟨对应法则⟩ f。如果两个函数的定义域相同，对应法则也相同，那么这两个函数就是相同的，否则就是不同的。', en: 'Two functions f and g are ⟨equal⟩ if they have the same domain and f(x) = g(x) for every x in that domain.', enSrc: 'English · 通用表述' };
// 项目里没有同济 PDF，无法逐字核对：标成“参照”而不是原文引用
Object.values(TIPS).forEach(o => { if (!o.zhSrc) o.zhSrc = '中文表述（参照同济《高等数学》第七版）'; });
// ================= x2：同一个 x² 换定义域/陪域 =================
SC.x2 = (t) => {
  starfield(t);
  const A = { cx: 860, cy: 650, u: 62, x0: -4, x1: 4, y0: -3, y1: 5.2 }, a = prog(t, S('C23'), 0.4);
  glowMath('同一个法则  x ↦ x^2', 860, 215, 46, COL.cream, t, P('C23', 0.1), { align: 'center' });
  axes(A, a, { step: 2, grid: true });
  const cod = eIO(prog(t, P('C25', 0.15), 0.7)), dom = eIO(prog(t, P('C26', 0.15), 0.7));
  const [x0p, y0p] = ax2px(A, 0, 0), yTop = A.cy - A.y1 * A.u, yBot = A.cy - A.y0 * A.u, xL = A.cx + A.x0 * A.u, xR = A.cx + A.x1 * A.u;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowBlur = 14;
  ctx.shadowColor = GOLD; ctx.fillStyle = hexA(GOLD, 0.6); ctx.fillRect(x0p - 5, yTop, 10, lerp(yBot, y0p, cod) - yTop);
  ctx.shadowColor = CYAN; ctx.fillStyle = hexA(CYAN, 0.6); ctx.fillRect(lerp(xL, x0p, dom), y0p - 5, xR - lerp(xL, x0p, dom), 10);
  ctx.restore();
  // 曲线：左半边在 C26 碎掉下落
  plotP(A, x => x * x, COL.f, eOut(prog(t, P('C23', 0.3), 0.7)), 4.5, a, { xa: 0, xb: 2.25 });
  const fall = prog(t, P('C26', 0.2), 0.9);
  if (fall < 1) { if (fall <= 0) plotP(A, x => x * x, COL.f, eOut(prog(t, P('C23', 0.3), 0.7)), 4.5, a, { xa: 0, xb: -2.25 }); else for (let k = 0; k < 28; k++) { const x = -k / 27 * 2.25, [px, py] = ax2px(A, x, x * x), d = fall * fall * (300 + h32(k, 3, 7) * 300); glowDot(px + (h32(k, 1, 7) - 0.5) * 60 * fall, py + d, 3.5, COL.f, a * (1 - fall)); } }
  // 撞车：y = 4 处 ±2
  const crashOn = t > P('C24', 0.2) && t < P('C26', 0.25);
  if (crashOn) { const [, py] = ax2px(A, 0, 4), ca = win01(t, P('C24', 0.2), P('C26', 0.25), 0.3, 0.3); glowPath(() => { ctx.moveTo(xL, py); ctx.lineTo(xR, py); }, '#ff6b81', 2, ca * 0.7); [[-2, 4], [2, 4]].forEach(([x, y]) => { const [px] = ax2px(A, x, y); glowDot(px, py, 9, COL.red, ca); }); glowText('撞车', ax2px(A, 2, 4)[0] + 24, py - 26, 30, '#ff8c7a', t, P('C24', 0.25), { bold: false, align: 'left', out: P('C26', 0.2) }); }
  if (t > P('C24', 0.55) && t < P('C25', 0.3)) { const ha = win01(t, P('C24', 0.55), P('C25', 0.3), 0.3, 0.3); ctx.save(); ctx.globalAlpha = ha; ctx.strokeStyle = hexA(COL.red, 0.8); ctx.lineWidth = 2; for (let yy = y0p + 12; yy < yBot; yy += 14) { ctx.beginPath(); ctx.moveTo(x0p - 9, yy); ctx.lineTo(x0p + 9, yy - 8); ctx.stroke(); } ctx.restore(); glowText('没人射中', x0p + 20, (y0p + yBot) / 2, 28, '#ff8c7a', t, P('C24', 0.6), { bold: false, align: 'left', out: P('C25', 0.25) }); }
  if (t > P('C26', 0.85)) burst(t, P('C26', 0.85), ax2px(A, 1.5, 2.25)[0], ax2px(A, 1.5, 2.25)[1], COL.g, 110, 16);
  // 右侧状态表
  const ROWS = [['ℝ → ℝ', 0, 0, 'C24'], ['ℝ → [0, +∞)', 0, 1, 'C25'], ['[0, +∞) → [0, +∞)', 1, 1, 'C26']];
  glowText('单射    满射', 1500, 330, 30, COL.cream, t, P('C24', 0.1), { bold: false, align: 'left' });
  ROWS.forEach(([s, inj, sur, id], i) => {
    const y = 410 + i * 110, t0 = P(id, 0.12), ra = prog(t, t0, 0.3); if (ra <= 0) return;
    const cur = (i === 0 && t < S('C25')) || (i === 1 && t >= S('C25') && t < S('C26')) || (i === 2 && t >= S('C26'));
    if (cur) { ctx.save(); ctx.globalAlpha = ra * 0.5; ctx.fillStyle = 'rgba(92,200,232,0.12)'; rr(1240, y - 40, 600, 80, 12); ctx.fill(); ctx.restore(); }
    mathText(s, 1475, y + 12, 32, COL.cream, { align: 'right', upright: true, alpha: ra * (cur ? 1 : 0.6) });
    (inj ? checkMark : crossMark)(1535, y, 30, inj ? COL.g : COL.red, t, P(id, 0.55), ra);
    (sur ? checkMark : crossMark)(1655, y, 30, sur ? COL.g : COL.red, t, P(id, 0.7), ra);
    if (i === 2) glowText('双射', 1745, y, 32, COL.g, t, P(id, 0.88), { align: 'left' });
  });
  if (t > S('C27')) kinetic('先说清：从哪里 → 到哪里', 960, 860, 44, t, P('C27', 0.45), { col: GOLD });
  lecturer(t, 'C', 255, -9, null);
};
// ================= equal：函数相等 =================
SC.equal = (t) => {
  starfield(t);
  const fa = 1 - prog(t, S('C29') - 0.1, 0.35);
  if (fa > 0) {
    ctx.save(); ctx.globalAlpha = fa;
    // 整体左移，给右上角“函数相等”小贴士让位（原来 g(x) 被小贴士盖住）
    glowMath('f(x) = x', 690, 330, 56, CYAN, t, S('D04') + 0.2, { align: 'center' });
    glowMath('g(x) = x^2/x', 1000, 330, 56, COL.f, t, S('D04') + 0.6, { align: 'center' });
    const ct = P('D04', 0.45); if (t > ct) { glowPath(() => { const p = eOut(prog(t, ct, 0.3)); ctx.moveTo(1010, 345); ctx.lineTo(1010 + 90 * p, 300); }, COL.cream, 3, 1); kinetic('= ?', 845, 450, 60, t, ct + 0.2, { col: COL.cream }); }
    glowText('定义域相同', 690, 640, 42, CYAN, t, P('C28', 0.45)); glowText('对应法则相同', 1000, 640, 42, GOLD, t, P('C28', 0.62)); mathText('+', 845, 656, 48, COL.cream, { align: 'center', alpha: prog(t, P('C28', 0.55), 0.3) });
    checkMark(690, 720, 40, COL.g, t, P('C28', 0.7)); checkMark(1000, 720, 40, COL.g, t, P('C28', 0.8));
    ctx.restore();
  }
  const tipOn = win01(t, S('C28') + 0.1, E('C29') + 0.3, 0.5, 0.5);
  // 洞
  const ga = win01(t, S('C29'), S('C30') + 0.1, 0.4, 0.35);
  if (ga > 0) {
    const A = { cx: lerp(900, 760, eIO(tipOn)), cy: 620, u: 70, x0: -3.2, x1: 3.2, y0: -3, y1: 3 };
    axes(A, ga, { step: 1 });
    plot(A, x => x, COL.f, 4, ga);
    const [ox, oy] = ax2px(A, 0, 0); openDot(ox, oy, 9, COL.f, ga * prog(t, P('C29', 0.2), 0.3));
    const lz = eBack(prog(t, P('C29', 0.5), 0.5)) * ga;
    if (lz > 0) {
      const lx = A.cx + 210, ly = A.cy - 170, R = 110 * lz;
      glowPath(() => { ctx.moveTo(ox + 10, oy - 10); ctx.lineTo(lx - R * 0.7, ly + R * 0.7); }, COL.cream, 1.5, ga * 0.6);
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.fillStyle = 'rgba(8,12,28,0.92)'; ctx.fill(); ctx.clip();
      glowPath(() => { ctx.moveTo(lx - R, ly + R); ctx.lineTo(lx - 22, ly + 22); }, COL.f, 7, ga); glowPath(() => { ctx.moveTo(lx + 22, ly - 22); ctx.lineTo(lx + R, ly - R); }, COL.f, 7, ga);
      openDot(lx, ly, 22, COL.f, ga); ctx.restore();
      ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = COL.cream; ctx.lineWidth = 4; ctx.shadowColor = COL.cream; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 7); ctx.stroke(); ctx.restore();
      glowText('x = 0 处没有定义', lx, ly + R + 40, 30, COL.f, t, P('C29', 0.62), { bold: false });
    }
    glowMath('g(x) = x^2/x', A.cx - 200, 230, 44, COL.f, t, S('C29') + 0.1);
    if (t > P('C29', 0.8)) { glowMath('f ≠ g', A.cx + 360, A.cy + 140, 60, COL.f, t, P('C29', 0.8), { align: 'center', upright: true }); sparks(t, P('C29', 0.82), A.cx + 360, A.cy + 120, { col: COL.f, n: 14, speed: 260, life: 0.5 }); }
  }
  tip(t, S('C28') + 0.25, E('C29') + 0.3, Object.assign({ w: 740 }, TIPS.eq));
  // |x| 与 √(x²)
  const ha = prog(t, S('C30') + 0.05, 0.4);
  if (ha > 0) {
    const A = { cx: 1000, cy: 680, u: 80, x0: -3.5, x1: 3.5, y0: -0.8, y1: 3.6 };
    axes(A, ha, { step: 1 });
    plotP(A, x => Math.abs(x), CYAN, eOut(prog(t, P('C30', 0.15), 0.6)), 8, ha * 0.55, { xa: -3.4, xb: 3.4 });
    plotP(A, x => Math.sqrt(x * x), COL.f, eOut(prog(t, P('C30', 0.4), 0.6)), 3, ha, { xa: -3.4, xb: 3.4 });
    glowMath('|x|', 640, 330, 52, CYAN, t, P('C30', 0.12), { align: 'center', upright: true });
    glowMath('√(x^2)', 1360, 330, 52, COL.f, t, P('C30', 0.38), { align: 'center', upright: true });
    if (t > P('C30', 0.75)) { kinetic('=', 1000, 320, 72, t, P('C30', 0.75), { col: COL.g }); burst(t, P('C30', 0.78), 1000, 320, COL.g, 90, 14); glowText('同一个函数', 1000, 420, 40, COL.g, t, P('C30', 0.82)); }
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= special：特殊函数 =================
SC.special = (t) => {
  starfield(t);
  // sgn
  const sa = win01(t, S('C31') - 0.1, S('C32') + 0.1, 0.35, 0.35);
  if (sa > 0) {
    const A = { cx: 1000, cy: 600, u: 80, x0: -4, x1: 4, y0: -2, y1: 2 };
    axes(A, sa, { step: 1 }); glowMath('sgn x', 1000, 300, 54, COL.cream, t, P('C31', 0.3), { align: 'center', upright: true });
    const p1 = eOut(prog(t, P('C31', 0.5), 0.5)), p0 = prog(t, P('C31', 0.68), 0.3), pm = eOut(prog(t, P('C31', 0.82), 0.5));
    plotP(A, () => 1, GOLD, p1, 5, sa, { xa: 0.12, xb: 3.9 }); if (p1 > 0) openDot(...ax2px(A, 0, 1), 9, GOLD, sa);
    if (p0 > 0) { glowDot(...ax2px(A, 0, 0), 10 * eBack(p0), COL.cream, sa); }
    plotP(A, () => -1, CYAN, pm, 5, sa, { xa: -0.12, xb: -3.9 }); if (pm > 0) openDot(...ax2px(A, 0, -1), 9, CYAN, sa);
    [['1', 1, GOLD, p1], ['−1', -1, CYAN, pm]].forEach(([s, y, c, p]) => mathText(s, A.cx - 20, ax2px(A, 0, y)[1] + 12, 30, c, { align: 'right', upright: true, alpha: sa * clamp(p * 2) }));
  }
  // 取整：台阶落下
  const fa = win01(t, S('C32'), S('C33') + 0.1, 0.35, 0.35);
  if (fa > 0) {
    const A = { cx: 760, cy: 600, u: 58, x0: -3.6, x1: 3.6, y0: -3.6, y1: 3.4 };
    axes(A, fa, { step: 1 }); glowMath('⌊x⌋', A.cx - 160, 240, 54, COL.cream, t, P('C32', 0.05), { align: 'center', upright: true });
    for (let k = -3; k <= 2; k++) {
      const p = eBack(prog(t, P('C32', 0.22) + (k + 3) * 0.07, 0.4)); if (p <= 0) continue;
      const dy = (1 - p) * -220, [x0, y0] = ax2px(A, k, k), [x1] = ax2px(A, k + 1, k);
      glowPath(() => { ctx.moveTo(x0, y0 + dy); ctx.lineTo(x1 - 8, y0 + dy); }, GOLD, 5, fa * clamp(p * 2));
      glowDot(x0, y0 + dy, 7, GOLD, fa * clamp(p * 2)); openDot(x1, y0 + dy, 7, GOLD, fa * clamp(p * 2));
    }
    [[2.7, 2, 0.6], [-2.7, -3, 0.8]].forEach(([x, k, f]) => {
      const tt = P('C32', f), q = prog(t, tt, 0.5); if (q <= 0) return;
      const [px, py0] = ax2px(A, x, 0), [, pk] = ax2px(A, x, k), yy = lerp(py0, pk, eOut(q));
      glowDot(px, py0, 7, CYAN, fa); ctx.save(); ctx.globalAlpha = fa; ctx.setLineDash([5, 5]); ctx.strokeStyle = CYAN; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py0); ctx.lineTo(px, yy); ctx.stroke(); ctx.restore(); glowDot(px, yy, 8, '#ffffff', fa);
      glowMath(`⌊${x < 0 ? '−2.7' : '2.7'}⌋ = ${k < 0 ? '−3' : k}`, x > 0 ? A.cx + 20 : A.cx - 330, x > 0 ? 300 : 880, 38, CYAN, t, tt + 0.4, { upright: true });
    });
  }
  tip(t, S('C32') + 0.3, E('C32') + 0.25, Object.assign({ w: 760 }, TIPS.floor));
  // |x| 分段
  const aa = win01(t, S('C33'), S('C34') + 0.05, 0.35, 0.35);
  if (aa > 0) {
    const A = { cx: 1000, cy: 700, u: 85, x0: -4, x1: 4, y0: -0.8, y1: 4 };
    axes(A, aa, { step: 1 }); glowMath('|x|', 1000, 260, 54, COL.cream, t, P('C33', 0.05), { align: 'center', upright: true });
    plotP(A, x => x, CYAN, eOut(prog(t, P('C33', 0.4), 0.5)), 5, aa, { xa: 0, xb: 3.6 });
    plotP(A, x => -x, COL.f, eOut(prog(t, P('C33', 0.68), 0.5)), 5, aa, { xa: 0, xb: -3.6 });
    glowMath('x  (x ≥ 0)', 1240, 420, 36, CYAN, t, P('C33', 0.45)); glowMath('−x  (x < 0)', 560, 420, 36, COL.f, t, P('C33', 0.72));
  }
  // x = sgn x · |x|
  const ma = win01(t, S('C34'), S('G03') + 0.1, 0.35, 0.35);
  if (ma > 0) {
    const MINI = [[620, x => Math.sign(x), GOLD, 'sgn x'], [1000, x => Math.abs(x), CYAN, '|x|'], [1380, x => x, COL.g, 'x']];
    MINI.forEach(([cx, f, c, nm], i) => { const p = prog(t, P('C34', 0.25 + i * 0.15), 0.4); if (p <= 0) return; const A = { cx, cy: 560, u: 36, x0: -3, x1: 3, y0: -3, y1: 3 }; axes(A, ma * p, { step: 1, grid: false }); plot(A, f, c, 4, ma * p, { jump: 1.5 }); mathText(nm, cx, 720, 38, c, { align: 'center', upright: nm !== 'x', alpha: ma * p }); });
    mathText('×', 810, 575, 52, COL.cream, { align: 'center', upright: true, alpha: ma * prog(t, P('C34', 0.4), 0.3) }); mathText('=', 1190, 575, 52, COL.cream, { align: 'center', upright: true, alpha: ma * prog(t, P('C34', 0.55), 0.3) });
    ctx.save(); ctx.globalAlpha = ma; mathRich([['x', COL.g], [' = ', COL.cream], ['sgn x', GOLD], [' · ', COL.cream], ['|x|', CYAN]], 1000, 330, 56, { align: 'center', upright: true, glow: 14, alpha: prog(t, P('C34', 0.7), 0.4) }); ctx.restore();
    if (t > P('C34', 0.75)) burst(t, P('C34', 0.75), 1000, 310, GOLD, 120, 16);
  }
  // GPT：记号
  const ga = win01(t, S('G03') - 0.1, S('C35') + 0.1, 0.35, 0.35);
  if (ga > 0) {
    const N = [['[x]', '同济', 0.18], ['⟦x⟧', 'Stewart', 0.38], ['floor(x)', '编程', 0.58]];
    N.forEach(([s, who, f], i) => { const p = eBack(prog(t, P('G03', f), 0.4)); if (p <= 0) return; const y = 370 + i * 130, x = 900 + (1 - p) * -300; ctx.save(); ctx.globalAlpha = ga * clamp(p); mathText(s, x, y + 16, 54, GOLD, { align: 'right', upright: true, glow: 12 }); ctx.font = `30px ${F_FANCY}`; ctx.fillStyle = COL.cream; ctx.textBaseline = 'middle'; ctx.fillText(who, x + 40, y); ctx.restore(); });
    const bp = eOut(prog(t, P('G03', 0.8), 0.4)); if (bp > 0) { glowPath(() => { ctx.moveTo(1120, 340); ctx.quadraticCurveTo(1170, 340, 1170, 400); ctx.lineTo(1170, 460); ctx.lineTo(1200, 500); ctx.lineTo(1170, 540); ctx.lineTo(1170, 600); ctx.quadraticCurveTo(1170, 660, 1120, 660); }, COL.cream, 3, ga * bp); glowText('同一个函数', 1220, 500, 40, COL.g, t, P('G03', 0.85), { align: 'left' }); }
  }
  // 狄利克雷回归
  const da = prog(t, S('C35') - 0.05, 0.4);
  if (da > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 200; i++) { const x = 600 + h32(i, 1, 9) * 800, row = h32(i, 2, 9) < 0.5, tw = 0.5 + 0.5 * Math.sin(t * 7 + i), y = row ? 470 : 650, p = prog(t, S('C35') + h32(i, 3, 9) * 1.2, 0.2); ctx.fillStyle = hexA(row ? GOLD : CYAN, da * p * (0.35 + 0.6 * tw)); ctx.fillRect(x - 2, y - 2, 4, 4); }
    ctx.restore();
    glowMath('D(x) = 1,  x ∈ ℚ', 1000, 300, 42, GOLD, t, P('C35', 0.4), { align: 'center' });
    glowMath('D(x) = 0,  x ∉ ℚ', 1000, 820, 42, CYAN, t, P('C35', 0.55), { align: 'center' });
    glowText('分段交错 · 到处都是', 1000, 900, 30, COL.cream, t, P('C35', 0.75), { bold: false });
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= vlt：竖线检验 =================
SC.vlt = (t) => {
  starfield(t);
  const tipOn = win01(t, S('C36') + 0.2, E('C37') + 0.3, 0.5, 0.5), cx = lerp(1000, 760, eIO(tipOn));
  const A = { cx, cy: 580, u: 70, x0: -3.4, x1: 3.4, y0: -3, y1: 3 }, a = prog(t, S('C36'), 0.4);
  axes(A, a, { step: 1 });
  const fA = 1 - prog(t, S('C38'), 0.35), f = x => 0.9 * Math.sin(1.3 * x) + 0.25 * x;
  if (fA > 0) {
    plotP(A, f, COL.g, eOut(prog(t, P('C36', 0.1), 0.6)), 4.5, a * fA);
    const sx = lerp(A.x0 + 0.2, A.x1 - 0.2, clamp((t - P('C36', 0.45)) / (E('C37') - P('C36', 0.45)))), on = t > P('C36', 0.45);
    if (on) { const [px] = ax2px(A, sx, 0); glowPath(() => { ctx.moveTo(px, A.cy - A.y1 * A.u); ctx.lineTo(px, A.cy - A.y0 * A.u); }, '#ff6b81', 2.5, a * fA); glowDot(...ax2px(A, sx, f(sx)), 9, COL.g, a * fA); }
    if (t > S('C37')) { glowText('一个 x → 唯一一个 y', A.cx, 230, 40, COL.g, t, P('C37', 0.3)); }
  }
  // 圆：一刀两点 → 拆成上下两半
  const cA = prog(t, S('C38') - 0.05, 0.4);
  if (cA > 0) {
    const sp = eIO(prog(t, P('C39', 0.2), 0.6)) * 0.9, dp = eOut(prog(t, P('C38', 0.15), 0.8));
    const half = (sgn, col, off) => { const pts = []; for (let i = 0; i <= 80 * dp; i++) { const th = Math.PI * i / 80; pts.push(ax2px(A, 2 * Math.cos(th), sgn * 2 * Math.sin(th) + sgn * off)); } if (pts.length > 1) glowPath(() => pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)), col, 4.5, cA); };
    half(1, sp > 0 ? GOLD : COL.f, sp * 0.5); half(-1, sp > 0 ? CYAN : COL.f, sp * 0.5);
    glowMath('x^2 + y^2 = 4', A.cx + 170, 240, 40, COL.f, t, P('C38', 0.1), { out: S('C39') + 0.2 });
    const cut = P('C38', 0.55), cp = prog(t, cut, 0.35);
    if (cp > 0 && t < S('C39') + 0.2) {
      const [px] = ax2px(A, 0.9, 0), top = A.cy - A.y1 * A.u, bot = A.cy - A.y0 * A.u;
      glowPath(() => { ctx.moveTo(px, top); ctx.lineTo(px, lerp(top, bot, eOut(cp))); }, '#ff6b81', 3, cA);
      if (cp > 0.5) { const yv = Math.sqrt(4 - 0.81); [yv, -yv].forEach(y => glowDot(...ax2px(A, 0.9, y), 10, COL.red, cA)); crossMark(A.cx + 280, A.cy - 230, 44, COL.red, t, cut + 0.3); }
    }
    if (t > S('C39')) { glowMath('y = √(4 − x^2)', A.cx + 240, A.cy - 200, 36, GOLD, t, P('C39', 0.45), { upright: true }); glowMath('y = −√(4 − x^2)', A.cx + 240, A.cy + 230, 36, CYAN, t, P('C39', 0.7), { upright: true }); checkMark(A.cx - 250, A.cy - 200, 36, COL.g, t, P('C39', 0.55)); checkMark(A.cx - 250, A.cy + 210, 36, COL.g, t, P('C39', 0.8)); }
  }
  tip(t, S('C36') + 0.3, E('C37') + 0.3, Object.assign({ w: 760 }, TIPS.vlt));
  lecturer(t, 'C', 255, -9, null);
};
// ================= quiz：随堂两题 =================
SC.quiz = (t) => {
  starfield(t);
  if (t < S('C41')) { kinetic('随堂两题', 1000, 440, 80, t, S('C40') + 0.1, { col: COL.cream, out: S('C41') - 0.15 }); [1, 2].forEach((n, i) => circleNum(n, 900 + i * 200, 600, 40, i ? GOLD : CYAN, t, P('C40', 0.4 + i * 0.12), 1 - prog(t, S('C41') - 0.15, 0.2))); }
  const A = { cx: 1000, cy: 610, u: 120, x0: -2.2, x1: 2.2, y0: -1.9, y1: 1.9 }, f = x => x * x * x - x, a = prog(t, S('C41'), 0.4);
  if (a > 0) {
    axes(A, a, { step: 1 }); plotP(A, f, COL.f, eOut(prog(t, P('C41', 0.2), 0.7)), 4.5, a);
    glowMath('f(x) = x^3 − x,   ℝ → ℝ', 1000, 230, 44, COL.cream, t, P('C41', 0.05), { align: 'center' });
    const q1 = t < S('C43'); glowText(q1 ? '单射？' : '满射？', 1000, 305, 42, q1 ? CYAN : GOLD, t, q1 ? P('C41', 0.6) : S('C43') + 0.1);
    countdown(t, QB[0].vo, 1560, 420, 90); countdown(t, QB[1].vo, 1560, 420, 90);
    if (t > S('C42') && t < S('C43') + 0.2) {
      const [xl, y0] = ax2px(A, A.x0, 0), [xr] = ax2px(A, A.x1, 0); glowPath(() => { ctx.moveTo(xl, y0); ctx.lineTo(xr, y0); }, '#ff6b81', 3, a);
      [-1, 0, 1].forEach((x, i) => { const tt = P('C42', 0.3 + i * 0.1); const p = eBack(prog(t, tt, 0.3)); if (p <= 0) return; const [px] = ax2px(A, x, 0); glowDot(px, y0, 11 * p, COL.red, a); sparks(t, tt, px, y0, { col: COL.red, n: 10, speed: 260, life: 0.45 }); });
      crossMark(1380, 300, 44, COL.red, t, P('C42', 0.1)); glowText('三人撞同一座', 1000, 860, 34, '#ff8c7a', t, P('C42', 0.6), { bold: false });
    }
    if (t > S('D05')) {
      const yv = lerp(-1.8, 1.8, (Math.sin((t - S('D05')) * 2.2 - 1.57) + 1) / 2), [xl, py] = ax2px(A, A.x0, yv), [xr] = ax2px(A, A.x1, yv);
      glowPath(() => { ctx.moveTo(xl, py); ctx.lineTo(xr, py); }, GOLD, 2.5, a * 0.8);
      for (let x = A.x0; x < A.x1; x += 0.005) { if ((f(x) - yv) * (f(x + 0.005) - yv) <= 0) glowDot(ax2px(A, x, yv)[0], py, 8, GOLD, a); }
      glowText('↓ −∞', ax2px(A, -1.9, 0)[0], A.cy + 260, 30, CYAN, t, S('D05') + 0.3, { bold: false }); glowText('↑ +∞', ax2px(A, 1.9, 0)[0], A.cy - 270, 30, CYAN, t, S('D05') + 0.6, { bold: false });
    }
    if (t > S('C44')) { checkMark(1380, 300, 48, COL.g, t, S('C44') + 0.1); glowText('介值定理 IVT · 第 2 章严格证明', 1000, 860, 32, COL.inv, t, P('C44', 0.45), { bold: false }); }
  }
  lecturer(t, 'C', 255, -9, null);
};
// ================= outro =================
SC.outro = (t) => {
  starfield(t);
  const ts = S('C45');
  // 两件事分开说：单射/满射看“定义域 + 陪域”；函数相等看“定义域 + 对应法则”（与小贴士里的同济定义一致）
  const ROWS = [['判断单射 / 满射', [['定义域', CYAN], ['陪域', GOLD]], 330, 0.05], ['判断函数相等', [['定义域', CYAN], ['对应法则', COL.red]], 560, 0.5]];
  ROWS.forEach(([head, parts, y, f]) => {
    glowText(head, 1000, y, 40, COL.cream, t, P('C45', f), { bold: false, out: S('C46') });
    parts.forEach(([s, c], i) => { const tt = P('C45', f + 0.08 + i * 0.1); kinetic(s, 840 + i * 320, y + 95, 56, t, tt, { col: c, out: S('C46') }); });
    mathText('+', 1000, y + 112, 50, COL.cream, { align: 'center', upright: true, alpha: prog(t, P('C45', f + 0.12), 0.3) * (1 - prog(t, S('C46'), 0.25)) });
  });
  if (t > S('C46')) {
    const Q = ['∀', '∃'];
    Q.forEach((q, i) => { const p = eBack(prog(t, P('C46', 0.1 + i * 0.1), 0.45)); if (p <= 0) return; ctx.save(); ctx.translate(880 + i * 240, 470); ctx.scale(p, p); mathText(q, 0, 50, 150, i ? GOLD : CYAN, { align: 'center', upright: true, glow: 30 }); ctx.restore(); });
    ['有界', '奇偶', '周期'].forEach((s, i) => glowText(s, 760 + i * 240, 700, 40, COL.cream, t, P('C46', 0.35 + i * 0.08)));
  }
  const te = E('C46') + 0.2; SC.__noTag = te;
  endCard(t, te, '下一段 · P3　函数性质：用量词说清楚', 'Bounded · Even/Odd · Periodic');
  flash(t, te, 0.4, 0.35);
  lecturer(t, 'C', 255, -9, E('C46') + 0.15);
};
// ================= 合成 =================
const TITLES = [['hook', '函数 ≠ 式子'], ['def', '映射'], ['sets', '三个集合'], ['inj', '单射 · 满射 · 双射'], ['proof', '证明双射'], ['x2', '同一个 x²'], ['equal', '函数相等'], ['special', '特殊函数'], ['vlt', '竖线检验'], ['quiz', '随堂两题'], ['outro', '小结']];
SC.__noTag = E('C46') + 0.2;
function drawFrame(t) { composeFrame(t, SC, TITLES); }
// ================= 音效（柔和为主；重击 ≤ 2：证毕印章、随堂答案揭晓） =================
(function regSfx() {
  BLOCKS.forEach((b, i) => { if (i) sfx(b.t0 - 0.1, 'swoosh_soft', 0.4); });
  sfx(S('D01') + 0.2, 'shimmer', 0.45); sfx(P('C01', 0.25), 'swoosh_soft', 0.45); sfx(P('C01', 0.6), 'soft_hit', 0.5);
  [0.25, 0.5, 0.78].forEach((f, i) => sfx(P('C02', f), ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.4));
  [0, 1, 2, 3, 4].forEach(i => sfx(P('C03', 0.42 + i * 0.05), 'tick', 0.22)); [0, 1, 2, 3, 4].forEach(i => sfx(P('C03', 0.62 + i * 0.06), 'pluck', 0.3));
  sfx(S('C04') + 0.25, 'swell', 0.35); sfx(P('C05', 0.3), 'marimba', 0.4); sfx(P('C05', 0.65), 'marimba_hi', 0.4);
  sfx(P('C06', 0.15), 'tick2', 0.4); sfx(P('C06', 0.7), 'tick2', 0.4); sfx(P('C07', 0.2), 'check', 0.45);
  sfx(P('C08', 0.5), 'swoosh_soft', 0.35);
  [0.25, 0.45, 0.65].forEach(f => { sfx(P('G01', f) + 0.45, 'soft_hit', 0.35); sfx(P('G01', f) + 0.55, 'tinkle', 0.35); });
  sfx(P('C09', 0.5), 'bell_soft', 0.45);
  sfx(P('C10', 0.62), 'shimmer', 0.35); sfx(P('C11', 0.5), 'riser', 0.25); sfx(P('C11', 0.75), 'bell_soft', 0.4); sfx(P('C12', 0.5), 'swoosh_soft', 0.3);
  PAN.forEach((p, i) => sfx(P(p.id, 0.25), ['marimba_lo', 'marimba', 'marimba_hi'][i], 0.45));
  sfx(S('D03') + 0.05, 'swoosh_soft', 0.4); sfx(P('G02', 0.2) + 0.6, 'soft_hit', 0.5); sfx(P('G02', 0.58) + 0.75, 'check', 0.45);
  sfx(P('C17', 0.5), 'tick2', 0.35); sfx(P('C17', 0.98), 'check', 0.45);
  sfx(P('C19', 0.58) + 0.2, 'tinkle', 0.35); sfx(P('C19', 0.92), 'check', 0.45); sfx(P('C20', 0.5), 'swoosh_soft', 0.35); sfx(P('C21', 0.45), 'marimba', 0.35);
  sfx(P('C22', 0.15), 'slam', 0.5); sfx(P('C22', 0.15) + 0.1, 'sparkle', 0.35);
  ['C24', 'C25', 'C26'].forEach(id => { sfx(P(id, 0.55), 'tick', 0.3); sfx(P(id, 0.7), 'tick', 0.3); }); sfx(P('C26', 0.2), 'swoosh_soft', 0.35); sfx(P('C26', 0.85), 'bell_soft', 0.45);
  sfx(P('D04', 0.45), 'tick2', 0.35); sfx(P('C28', 0.7), 'check', 0.4); sfx(P('C29', 0.5), 'swell', 0.3); sfx(P('C30', 0.75), 'bell_soft', 0.45);
  [0.5, 0.68, 0.82].forEach((f, i) => sfx(P('C31', f), ['marimba_hi', 'marimba', 'marimba_lo'][i], 0.4));
  for (let k = 0; k < 6; k++) sfx(P('C32', 0.22) + k * 0.07 + 0.25, 'pluck', 0.25);
  sfx(P('C34', 0.75), 'shimmer', 0.4); [0.18, 0.38, 0.58].forEach(f => sfx(P('G03', f), 'pluck', 0.35)); sfx(P('G03', 0.85), 'bell_soft', 0.4);
  sfx(S('C35') + 0.1, 'shimmer', 0.35);
  sfx(P('C38', 0.55), 'swoosh_soft', 0.45); sfx(P('C39', 0.2), 'swell', 0.3); sfx(P('C39', 0.55), 'check', 0.35);
  QB.forEach(q => countdownSfx(q.vo));
  [0.3, 0.4, 0.5].forEach(f => sfx(P('C42', f), 'tick2', 0.35)); sfx(S('C44') + 0.1, 'slam', 0.45); sfx(S('C44') + 0.15, 'check', 0.45);
  sfx(P('C46', 0.1), 'shimmer', 0.4); sfx(E('C46') + 0.2, 'bell_soft', 0.5);
})();
finalize();
