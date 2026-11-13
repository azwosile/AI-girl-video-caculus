// 第 10 章公用小件（11-13）：参数曲线描点、滚轮（摆线 / 星形线）、解绳渐开线、Bézier 与 de Casteljau、得意黑字形轮廓、极坐标扫描、扇形微元、密切圆、圆锥切面、轨道。
// 版面沿用：讲师 x<540；主内容 600–1360；字幕区 y≥964。配色：x/参数 t 青、y 金、曲线主色按客串、控制点 紫、切线 绿、曲率 红。
const CREDIT_TM10 = CREDIT_TM5;
const TAU = Math.PI * 2;

// ---------- 参数曲线 ----------
// 采样 (fx(t), fy(t))，t ∈ [ta, tb]
function pSample(fx, fy, ta, tb, n = 360) { const pts = []; for (let i = 0; i <= n; i++) { const s = ta + (tb - ta) * i / n; pts.push([fx(s), fy(s)]); } return pts; }
// 在坐标系 G 上描参数曲线到进度 p，带运动的点、方向箭头、t 刻度
// o: {a, p, w, dot, arrows:[t...], ticks:[[t,'文字']...], dash, glow, n}
function paramTrace(G, fx, fy, ta, tb, col, o = {}) {
  const a = o.a ?? 1, p = clamp(o.p ?? 1); if (a <= 0 || p <= 0) return;
  const te = ta + (tb - ta) * p, n = Math.max(8, Math.round((o.n || 360) * p));
  ctx.save(); if (o.dash) ctx.setLineDash(o.dash);
  glowPath(() => { for (let i = 0; i <= n; i++) { const s = ta + (te - ta) * i / n; const X = gx(G, fx(s)), Y = gy(G, fy(s)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } }, col, o.w || 4, a);
  ctx.restore();
  (o.arrows || []).forEach(s => { if (s > te) return; const h = (tb - ta) * 0.004; const x0 = gx(G, fx(s - h)), y0 = gy(G, fy(s - h)), x1 = gx(G, fx(s + h)), y1 = gy(G, fy(s + h)); dirHead(gx(G, fx(s)), gy(G, fy(s)), Math.atan2(y1 - y0, x1 - x0), col, a, 16); });
  (o.ticks || []).forEach(([s, txt, dx = 0, dy = -30]) => { if (s > te + 1e-9) return; const X = gx(G, fx(s)), Y = gy(G, fy(s)); glowDot(X, Y, 5, CYAN, a); label(txt, X + dx, Y + dy, o.tickSize || 22, CYAN, a, { bold: true }); });
  if (o.dot !== false) glowDot(gx(G, fx(te)), gy(G, fy(te)), o.dotR || 9, o.dotCol || col, a);
}
// 小三角箭头
function dirHead(x, y, ang, col, a = 1, s = 14) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(s * 0.7, 0); ctx.lineTo(-s * 0.5, -s * 0.5); ctx.lineTo(-s * 0.2, 0); ctx.lineTo(-s * 0.5, s * 0.5); ctx.closePath(); ctx.fill(); ctx.restore();
}
// 坐标系里过 (x0,y0)、斜率 m 的切线段（半长 L 像素，按真实像素方向）
function gTangent(G, x0, y0, m, L, col, a = 1, o = {}) {
  if (a <= 0) return; const dx = 1 * G.ux, dy = -(isFinite(m) ? m : 1e6) * G.uy, k = L / Math.hypot(dx, dy);
  const X = gx(G, x0), Y = gy(G, y0); seg(X - dx * k, Y - dy * k, X + dx * k, Y + dy * k, col, a, o.w || 3.5, o.dash);
}

// ---------- 滚轮 ----------
// 摆线：半径 r 的轮子在 x 轴上滚过角 th；画轮子、辐条、轮缘点，并描出轨迹
function rollWheel(G, r, th, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const cx = gx(G, r * th), cy = gy(G, r), R = r * G.ux;
  if (o.trace !== false) paramTrace(G, s => r * (s - Math.sin(s)), s => r * (1 - Math.cos(s)), 0, Math.max(th, 1e-4), col, { a, w: o.w || 4, dot: false });
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(237,230,216,0.35)'; for (let k = 0; k < 6; k++) { const q = -th + k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.sin(q), cy + R * Math.cos(q)); ctx.stroke(); }
  ctx.restore();
  const px = gx(G, r * (th - Math.sin(th))), py = gy(G, r * (1 - Math.cos(th)));
  seg(cx, cy, px, py, GOLD, a * 0.9, 2.5); glowDot(cx, cy, 4, CR, a); glowDot(px, py, 9, col, a);
  if (o.angle) { ctx.save(); ctx.globalAlpha *= a * 0.9; ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.32, Math.PI / 2, Math.PI / 2 - th, true); ctx.stroke(); ctx.restore(); }
}
// 星形线：半径 A/4 的小圆在半径 A 的大圆内滚；th 为参数 t
function hypoWheel(G, A, th, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const r = A / 4, ox = gx(G, 0), oy = gy(G, 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.45)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(ox, oy, A * G.ux, 0, TAU); ctx.stroke(); ctx.restore();
  paramTrace(G, s => A * Math.cos(s) ** 3, s => A * Math.sin(s) ** 3, 0, Math.max(th, 1e-4), col, { a, w: o.w || 4, dot: false });
  const ccx = (A - r) * Math.cos(th), ccy = (A - r) * Math.sin(th);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.8)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(gx(G, ccx), gy(G, ccy), r * G.ux, 0, TAU); ctx.stroke(); ctx.restore();
  const px = A * Math.cos(th) ** 3, py = A * Math.sin(th) ** 3; seg(gx(G, ccx), gy(G, ccy), gx(G, px), gy(G, py), GOLD, a * 0.9, 2.5); glowDot(gx(G, px), gy(G, py), 9, col, a);
}
// 渐开线：半径 A 的线轴，绳子解开到参数 th（切点角）；画线轴、拉直的绳子与轨迹
function unwind(G, A, th, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const ox = gx(G, 0), oy = gy(G, 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(92,200,232,0.10)'; ctx.strokeStyle = 'rgba(237,230,216,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ox, oy, A * G.ux, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = hexA(GOLD, 0.9); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(ox, oy, A * G.ux, -th, -TAU * (o.turns || 1.6), true); ctx.stroke(); ctx.restore();
  paramTrace(G, s => A * (Math.cos(s) + s * Math.sin(s)), s => A * (Math.sin(s) - s * Math.cos(s)), 0, Math.max(th, 1e-4), col, { a, w: o.w || 4, dot: false });
  const tx = A * Math.cos(th), ty = A * Math.sin(th), px = A * (Math.cos(th) + th * Math.sin(th)), py = A * (Math.sin(th) - th * Math.cos(th));
  seg(gx(G, tx), gy(G, ty), gx(G, px), gy(G, py), GOLD, a, 3.5); glowDot(gx(G, tx), gy(G, ty), 5, GOLD, a); glowDot(gx(G, px), gy(G, py), 9, col, a);
}

// ---------- Bézier ----------
const lerp2 = (A, B, s) => [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s];
function bezPt(P, s) { let Q = P.slice(); while (Q.length > 1) { const R = []; for (let i = 0; i + 1 < Q.length; i++) R.push(lerp2(Q[i], Q[i + 1], s)); Q = R; } return Q[0]; }
// 像素坐标的控制点 P（2–4 个）；o: {a, p(曲线进度), cast(显示 de Casteljau 的 t，null 不显示), poly, names, col, ctrlCol, w}
function bezierCast(P, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const cc = o.ctrlCol || INV, p = clamp(o.p ?? 1);
  if (o.poly !== false) { ctx.save(); ctx.globalAlpha *= a * 0.8; ctx.setLineDash([8, 7]); ctx.strokeStyle = cc; ctx.lineWidth = 2; ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
  if (p > 0) glowPath(() => { const n = Math.max(4, Math.round(120 * p)); for (let i = 0; i <= n; i++) { const [x, y] = bezPt(P, p * i / n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, col, o.w || 5, a);
  if (o.cast != null) {
    const s = o.cast; let Q = P.slice(); const lv = [INV, CYAN, GRN, GOLD]; let k = 0;
    while (Q.length > 1) { const R = []; for (let i = 0; i + 1 < Q.length; i++) R.push(lerp2(Q[i], Q[i + 1], s)); if (R.length > 1) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = lv[(k + 1) % 4]; ctx.lineWidth = 2.5; ctx.beginPath(); R.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
      R.forEach(([x, y]) => glowDot(x, y, R.length === 1 ? 10 : 5, R.length === 1 ? GOLD : lv[(k + 1) % 4], a)); Q = R; k++; }
  }
  P.forEach(([x, y], i) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#0B1022'; ctx.strokeStyle = cc; ctx.lineWidth = 3; ctx.beginPath(); ctx.rect(x - 8, y - 8, 16, 16); ctx.fill(); ctx.stroke(); ctx.restore();
    if (o.names) label(o.names[i] ?? `P${'₀₁₂₃'[i]}`, x + (o.ndx?.[i] ?? 0), y + (o.ndy?.[i] ?? -30), 26, cc, a, { bold: true }); });
}

// ---------- 得意黑字形（fontTools 导出的 TrueType 二次轮廓，单位 1000/em，y 向上）----------
const GLYPH10 = {"upm":1000,"g":{"曲":{"adv":800,"ops":[["moveTo",[[741,627]]],["lineTo",[[667,-62]]],["lineTo",[[77,-62]]],["lineTo",[[159,716]]],["lineTo",[[327,716]]],["lineTo",[[345,888]]],["lineTo",[[431,888]]],["lineTo",[[413,716]]],["lineTo",[[492,716]]],["lineTo",[[510,888]]],["lineTo",[[596,888]]],["lineTo",[[578,716]]],["lineTo",[[669,716]]],["qCurveTo",[[708,716],[745,666],[741,627]]],["closePath",[]],["moveTo",[[214,383]]],["lineTo",[[300,383]]],["lineTo",[[325,624]]],["lineTo",[[239,624]]],["closePath",[]],["moveTo",[[379,383]]],["lineTo",[[457,383]]],["lineTo",[[482,624]]],["lineTo",[[404,624]]],["closePath",[]],["moveTo",[[536,383]]],["lineTo",[[625,383]]],["lineTo",[[651,624]]],["lineTo",[[561,624]]],["closePath",[]],["moveTo",[[177,31]]],["lineTo",[[263,31]]],["lineTo",[[291,299]]],["lineTo",[[205,299]]],["closePath",[]],["moveTo",[[342,31]]],["lineTo",[[420,31]]],["lineTo",[[448,299]]],["lineTo",[[370,299]]],["closePath",[]],["moveTo",[[499,31]]],["lineTo",[[588,31]]],["lineTo",[[617,299]]],["lineTo",[[527,299]]],["closePath",[]]]},"鲸":{"adv":800,"ops":[["moveTo",[[782,795]]],["lineTo",[[774,718]]],["lineTo",[[423,718]]],["lineTo",[[431,795]]],["lineTo",[[566,795]]],["lineTo",[[576,888]]],["lineTo",[[658,888]]],["lineTo",[[647,795]]],["closePath",[]],["moveTo",[[87,617]]],["qCurveTo",[[137,681],[202,818],[224,885]]],["lineTo",[[300,858]]],["qCurveTo",[[287,818],[270,779]]],["lineTo",[[313,779]]],["qCurveTo",[[350,779],[385,739],[371,700]]],["qCurveTo",[[363,677],[340,634],[326,612]]],["qCurveTo",[[362,611],[383,566],[381,542]]],["lineTo",[[337,132]]],["lineTo",[[71,132]]],["lineTo",[[119,591]]],["closePath",[]],["moveTo",[[179,612]]],["lineTo",[[247,612]]],["qCurveTo",[[259,633],[281,677],[291,699]]],["lineTo",[[232,699]]],["qCurveTo",[[208,654],[179,612]]],["closePath",[]],["moveTo",[[455,26]]],["qCurveTo",[[462,-3],[475,-3]]],["qCurveTo",[[481,-3],[490,15],[493,40]]],["lineTo",[[526,363]]],["lineTo",[[414,363]]],["lineTo",[[445,659]]],["lineTo",[[673,659]]],["qCurveTo",[[707,659],[741,620],[736,583]]],["lineTo",[[711,363]]],["lineTo",[[603,363]]],["lineTo",[[570,30]]],["qCurveTo",[[563,-38],[509,-86],[475,-86]]],["qCurveTo",[[443,-86],[399,-42],[389,-4]]],["closePath",[]],["moveTo",[[516,589]]],["lineTo",[[500,435]]],["lineTo",[[639,435]]],["lineTo",[[656,589]]],["closePath",[]],["moveTo",[[170,419]]],["lineTo",[[205,419]]],["lineTo",[[217,532]]],["lineTo",[[182,532]]],["closePath",[]],["moveTo",[[261,419]]],["lineTo",[[298,419]]],["lineTo",[[310,532]]],["lineTo",[[273,532]]],["closePath",[]],["moveTo",[[148,212]]],["lineTo",[[184,212]]],["lineTo",[[198,348]]],["lineTo",[[163,348]]],["closePath",[]],["moveTo",[[240,212]]],["lineTo",[[277,212]]],["lineTo",[[291,348]]],["lineTo",[[254,348]]],["closePath",[]],["moveTo",[[346,61]]],["qCurveTo",[[376,129],[415,257],[428,317]]],["lineTo",[[496,301]]],["qCurveTo",[[482,237],[443,103],[413,33]]],["closePath",[]],["moveTo",[[730,30]]],["lineTo",[[661,13]]],["qCurveTo",[[653,50],[638,150],[627,255],[624,297]]],["lineTo",[[692,309]]],["qCurveTo",[[695,266],[707,161],[723,63],[730,30]]],["closePath",[]],["moveTo",[[42,-38]]],["lineTo",[[34,42]]],["qCurveTo",[[112,47],[262,67],[331,83]]],["lineTo",[[345,6]]],["qCurveTo",[[274,-10],[122,-32],[42,-38]]],["closePath",[]]]},"线":{"adv":800,"ops":[["moveTo",[[272,28]]],["qCurveTo",[[328,49],[432,104],[478,136]]],["qCurveTo",[[474,164],[472,194]]],["qCurveTo",[[469,234],[466,319],[465,364]]],["lineTo",[[346,348]]],["lineTo",[[343,434]]],["lineTo",[[465,451]]],["qCurveTo",[[465,511],[467,577]]],["lineTo",[[385,567]]],["lineTo",[[382,653]]],["lineTo",[[470,664]]],["qCurveTo",[[473,718],[479,828],[483,881]]],["lineTo",[[568,881]]],["qCurveTo",[[565,829],[558,726],[556,674]]],["lineTo",[[756,698]]],["lineTo",[[759,611]]],["lineTo",[[552,587]]],["qCurveTo",[[551,555],[550,493],[550,462]]],["lineTo",[[763,491]]],["lineTo",[[766,404]]],["lineTo",[[550,375]]],["qCurveTo",[[551,330],[554,244],[558,204]]],["qCurveTo",[[558,201],[558,199]]],["qCurveTo",[[634,266],[685,342]]],["lineTo",[[741,296]]],["qCurveTo",[[705,243],[619,147],[569,105]]],["qCurveTo",[[578,55],[601,12],[614,12]]],["qCurveTo",[[628,12],[654,70],[658,131]]],["lineTo",[[737,125]]],["qCurveTo",[[728,26],[668,-87],[611,-87]]],["qCurveTo",[[569,-87],[512,-14],[495,49]]],["qCurveTo",[[451,19],[353,-30],[300,-49]]],["closePath",[]],["moveTo",[[80,212]]],["lineTo",[[71,290]]],["qCurveTo",[[82,291],[94,293]]],["qCurveTo",[[125,340],[180,438],[204,486]]],["qCurveTo",[[178,482],[120,475],[88,471]]],["lineTo",[[81,547]]],["qCurveTo",[[91,548],[100,549]]],["qCurveTo",[[139,629],[206,797],[234,879]]],["lineTo",[[309,856]]],["qCurveTo",[[282,782],[222,633],[185,560]]],["qCurveTo",[[199,562],[228,566],[243,568]]],["qCurveTo",[[255,597],[278,651],[287,676]]],["lineTo",[[357,646]]],["qCurveTo",[[322,557],[239,390],[189,309]]],["qCurveTo",[[246,321],[305,339]]],["lineTo",[[320,262]]],["qCurveTo",[[259,244],[141,220],[80,212]]],["closePath",[]],["moveTo",[[644,877]]],["qCurveTo",[[673,859],[725,812],[750,785]]],["lineTo",[[697,727]]],["qCurveTo",[[652,783],[595,820]]],["closePath",[]],["moveTo",[[52,6]]],["lineTo",[[31,89]]],["qCurveTo",[[105,106],[248,149],[315,178]]],["lineTo",[[343,102]]],["qCurveTo",[[205,42],[52,6]]],["closePath",[]]]},"O":{"adv":527,"ops":[["moveTo",[[222,-40]]],["qCurveTo",[[99,-40],[19,161],[47,372]]],["qCurveTo",[[76,587],[216,788],[328,788]]],["qCurveTo",[[453,788],[532,587],[503,372]]],["qCurveTo",[[475,161],[336,-40],[222,-40]]],["closePath",[]],["moveTo",[[232,55]]],["qCurveTo",[[301,55],[370,210],[395,372]]],["qCurveTo",[[420,536],[388,693],[320,693]]],["qCurveTo",[[251,693],[180,536],[155,372]]],["qCurveTo",[[130,210],[165,55],[232,55]]],["closePath",[]]]},"S":{"adv":472,"ops":[["moveTo",[[94,186]]],["qCurveTo",[[96,125],[149,53],[195,53]]],["qCurveTo",[[229,53],[284,105],[294,147]]],["qCurveTo",[[306,193],[278,270],[223,341],[158,411],[105,490],[84,584],[99,643]]],["qCurveTo",[[117,711],[220,788],[291,788]]],["qCurveTo",[[378,788],[472,680],[464,587]]],["lineTo",[[369,582]]],["qCurveTo",[[372,634],[331,694],[289,694]]],["qCurveTo",[[256,694],[209,655],[201,622]]],["qCurveTo",[[191,578],[219,504],[273,437],[336,368],[389,291],[413,198],[401,139]]],["qCurveTo",[[390,86],[328,5],[239,-40],[186,-40]]],["qCurveTo",[[96,-40],[-5,81],[-2,181]]],["closePath",[]]]}}};
// 展开为段列表：[{c: 轮廓号, L: [p0,p1]} 或 {c, Q: [p0, ctrl, p1]}]，补出 TrueType 隐含的中点
function glyphSegs(ch) {
  const g = GLYPH10.g[ch]; if (!g) return []; const out = []; let cur = null, start = null, c = -1;
  g.ops.forEach(([op, pts]) => {
    if (op === 'moveTo') { cur = pts[0]; start = cur; c++; }
    else if (op === 'lineTo') { out.push({ c, L: [cur, pts[0]] }); cur = pts[0]; }
    else if (op === 'qCurveTo') { const offs = pts.slice(0, -1), end = pts[pts.length - 1];
      for (let i = 0; i < offs.length; i++) { const e = i + 1 < offs.length ? [(offs[i][0] + offs[i + 1][0]) / 2, (offs[i][1] + offs[i + 1][1]) / 2] : end; out.push({ c, Q: [cur, offs[i], e] }); cur = e; } }
    else if (op === 'closePath') { if (cur && start && (cur[0] !== start[0] || cur[1] !== start[1])) out.push({ c, L: [cur, start] }); cur = start; }
  });
  return out;
}
const GSEG_CACHE = {};
// 画一个字：原点 (x, y) 为基线左端，s = 像素/单位。o: {a, fill, stroke, p(描边进度 0–1), hiCurve(曲线段高亮色), hiLine, ctrl(显示控制点与手柄), w}
function glyphDraw(ch, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; const S = GSEG_CACHE[ch] || (GSEG_CACHE[ch] = glyphSegs(ch)); const X = v => x + v[0] * s, Y = v => y - v[1] * s;
  if (o.fill) { ctx.save(); ctx.globalAlpha *= a * (o.fillA ?? 1); ctx.fillStyle = o.fill; ctx.beginPath(); let lc = -1;
    S.forEach(sg => { const P = sg.L || sg.Q; if (sg.c !== lc) { if (lc >= 0) ctx.closePath(); ctx.moveTo(X(P[0]), Y(P[0])); lc = sg.c; } if (sg.L) ctx.lineTo(X(P[1]), Y(P[1])); else ctx.quadraticCurveTo(X(P[1]), Y(P[1]), X(P[2]), Y(P[2])); });
    ctx.closePath(); ctx.fill('nonzero'); ctx.restore(); }
  const p = clamp(o.p ?? 1), m = Math.round(S.length * p); if (!o.stroke && !o.hiCurve && !o.hiLine) return;
  for (let i = 0; i < m; i++) { const sg = S[i]; const col = sg.Q ? (o.hiCurve || o.stroke) : (o.hiLine || o.stroke); if (!col) continue;
    glowPath(() => { const P = sg.L || sg.Q; ctx.moveTo(X(P[0]), Y(P[0])); if (sg.L) ctx.lineTo(X(P[1]), Y(P[1])); else ctx.quadraticCurveTo(X(P[1]), Y(P[1]), X(P[2]), Y(P[2])); }, col, o.w || 3, a); }
  if (o.ctrl) { const ca = a * (o.ctrlA ?? 1); for (let i = 0; i < m; i++) { const sg = S[i]; if (!sg.Q) continue; const [p0, c1, p1] = sg.Q;
      ctx.save(); ctx.globalAlpha *= ca * 0.8; ctx.strokeStyle = INV; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(X(p0), Y(p0)); ctx.lineTo(X(c1), Y(c1)); ctx.lineTo(X(p1), Y(p1)); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = INV; ctx.beginPath(); ctx.arc(X(c1), Y(c1), 4.5, 0, TAU); ctx.fill(); ctx.fillStyle = CR; ctx.fillRect(X(p1) - 3.5, Y(p1) - 3.5, 7, 7); ctx.restore(); } }
}
function glyphCount(ch) { const S = GSEG_CACHE[ch] || (GSEG_CACHE[ch] = glyphSegs(ch)); return { L: S.filter(s => s.L).length, Q: S.filter(s => s.Q).length }; }

// ---------- 极坐标 ----------
// 旋转射线描图：θ 从 ta 扫到 th，射线长 r(θ)（r<0 时朝反方向，画成虚线），尖端描出曲线
function polarSweep(cx, cy, u, rf, ta, th, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return; if (th > ta) polarCurve(cx, cy, u, rf, ta, th, col, a, o.w || 4, { n: o.n || Math.max(30, Math.round(240 * (th - ta) / TAU)) });
  if (o.ray === false) return; const r = rf(th), X = cx + r * u * Math.cos(th), Y = cy - r * u * Math.sin(th);
  seg(cx, cy, X, Y, r >= 0 ? GOLD : RED, a * 0.95, 3, r >= 0 ? null : [8, 6]);
  if (r < 0) seg(cx, cy, cx + 0.5 * u * Math.cos(th), cy - 0.5 * u * Math.sin(th), 'rgba(237,230,216,0.6)', a * 0.6, 2, [4, 5]);
  glowDot(X, Y, 8, col, a);
  if (o.angle !== false) { ctx.save(); ctx.globalAlpha *= a * 0.8; ctx.strokeStyle = CYAN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 36, 0, -((th % TAU) + TAU) % TAU, true); ctx.stroke(); ctx.restore(); }
}
// 扇形微元：把 [ta, tb] 等分 n 份，每份画一个扇形（半径取中点），交替色
function sectorFan(cx, cy, u, rf, ta, tb, n, col, a = 1, o = {}) {
  if (a <= 0) return; const d = (tb - ta) / n;
  for (let i = 0; i < n; i++) { const q0 = ta + i * d, r = Math.abs(rf(q0 + d / 2)) * u; ctx.save(); ctx.globalAlpha *= a * (i % 2 ? 0.55 : 0.8); ctx.fillStyle = hexA(col, 0.45); ctx.strokeStyle = hexA(col, 0.9); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -q0, -(q0 + d), true); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
}
// 极坐标下两曲线之间的填充：外 ro、内 ri，θ ∈ [ta, tb]
function polarBetween(cx, cy, u, ro, ri, ta, tb, col, a = 1, n = 160) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath();
  for (let i = 0; i <= n; i++) { const q = ta + (tb - ta) * i / n, r = ro(q) * u; ctx[i ? 'lineTo' : 'moveTo'](cx + r * Math.cos(q), cy - r * Math.sin(q)); }
  for (let i = n; i >= 0; i--) { const q = ta + (tb - ta) * i / n, r = ri(q) * u; ctx.lineTo(cx + r * Math.cos(q), cy - r * Math.sin(q)); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}
const polXY = (cx, cy, u, r, q) => [cx + r * u * Math.cos(q), cy - r * u * Math.sin(q)];

// ---------- 曲率 ----------
// 密切圆：曲线上点 (X,Y)（像素）、单位法向 (nx, ny)（像素方向，指向凹侧）、半径 R（像素）
function osculate(X, Y, nx, ny, R, col, a = 1, o = {}) {
  if (a <= 0 || !isFinite(R)) return; const cx = X + nx * R, cy = Y + ny * R;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = o.w || 3; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.setLineDash(o.dash || []); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.restore();
  seg(X, Y, cx, cy, col, a * 0.8, 2, [6, 6]); glowDot(cx, cy, 5, col, a); glowDot(X, Y, 7, GOLD, a);
  if (o.lab) label(o.lab, (X + cx) / 2 + (o.ldx ?? 40), (Y + cy) / 2 + (o.ldy ?? 0), 24, col, a, { bold: true });
}
// 参数曲线在 s 处的曲率与密切圆（G 需等比例 ux = uy）
function paramOsc(G, fx, fy, s, col, a = 1, o = {}) {
  const h = 1e-3, x1 = (fx(s + h) - fx(s - h)) / (2 * h), y1 = (fy(s + h) - fy(s - h)) / (2 * h), x2 = (fx(s + h) - 2 * fx(s) + fx(s - h)) / (h * h), y2 = (fy(s + h) - 2 * fy(s) + fy(s - h)) / (h * h);
  const sp = Math.hypot(x1, y1), k = (x1 * y2 - x2 * y1) / sp ** 3; if (Math.abs(k) < 1e-6) return 0;
  const R = 1 / Math.abs(k), sg = Math.sign(k), nx = -y1 / sp * sg, ny = x1 / sp * sg;   // 数学坐标的法向（指向凹侧）
  osculate(gx(G, fx(s)), gy(G, fy(s)), nx, -ny, R * G.ux, col, a, o); return Math.abs(k);
}

// ---------- 圆锥曲线 ----------
// 简化的双圆锥 + 切面示意。kind: 'circle' | 'ellipse' | 'parabola' | 'hyperbola'
function coneSlice(x, y, s, kind, a = 1, o = {}) {
  if (a <= 0) return; const H = 150 * s, R = 95 * s; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(237,230,216,0.8)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x - R, y - H); ctx.lineTo(x + R, y + H); ctx.moveTo(x + R, y - H); ctx.lineTo(x - R, y + H); ctx.stroke();
  [-H, H].forEach(dy => { ctx.beginPath(); ctx.ellipse(x, y + dy, R, R * 0.25, 0, 0, TAU); ctx.stroke(); });
  const col = o.col || GOLD, ang = { circle: 0, ellipse: -0.35, parabola: -Math.atan(H / R) * 1.0, hyperbola: -1.45 }[kind];
  ctx.translate(x, y + (kind === 'hyperbola' ? 0 : H * 0.45)); ctx.rotate(ang); ctx.fillStyle = hexA(col, 0.18); ctx.strokeStyle = hexA(col, 0.9); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(-R * 1.6, -R * 0.12, R * 3.2, R * 0.24); ctx.fill(); ctx.stroke(); ctx.restore();
  if (o.name) label(o.name, x, y + H + 50 * s, 28 * Math.max(0.8, s), col, a, { bold: true });
}
// 椭圆轨道：焦点（太阳）在 (cx, cy)，半长轴 A（像素），离心率 e；行星在极角 th 处；近日点在右
function orbit(cx, cy, A, e, th, col, a = 1, o = {}) {
  if (a <= 0) return; const rr = q => A * (1 - e * e) / (1 + e * Math.cos(q));
  polarCurve(cx, cy, 1, rr, 0, TAU, col, a * (o.pathA ?? 0.85), o.w || 3, { dash: o.dash });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34); g.addColorStop(0, hexA('#FFD25A', a)); g.addColorStop(1, hexA('#FF8A3D', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, TAU); ctx.fill(); ctx.restore();
  glowDot(cx, cy, 12, '#FFD25A', a);
  if (th != null) { const r = rr(th); glowDot(cx + r * Math.cos(th), cy - r * Math.sin(th), o.pr || 9, o.pcol || CYAN, a); }
}
// 小火箭图标（Grok 骑火箭用），朝向 ang（弧度，0 = 向右）
function rocketIcon(x, y, s, ang, col, a = 1, t = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(-ang); ctx.scale(s, s);
  ctx.fillStyle = hexA('#FF8A3D', 0.6 + 0.3 * Math.sin(t * 40)); ctx.beginPath(); ctx.moveTo(-22, -6); ctx.lineTo(-40 - 8 * Math.sin(t * 30), 0); ctx.lineTo(-22, 6); ctx.fill();
  ctx.fillStyle = col; ctx.strokeStyle = '#16130F'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(26, 0); ctx.quadraticCurveTo(10, -12, -22, -10); ctx.lineTo(-22, 10); ctx.quadraticCurveTo(10, 12, 26, 0); ctx.fill(); ctx.stroke();
  ctx.fillStyle = CYAN; ctx.beginPath(); ctx.arc(6, 0, 4.5, 0, TAU); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-14, -10); ctx.lineTo(-24, -20); ctx.lineTo(-22, -10); ctx.moveTo(-14, 10); ctx.lineTo(-24, 20); ctx.lineTo(-22, 10); ctx.fill(); ctx.restore();
}
// 两条距离的对比条（焦点–准线定义用）：在 (x, y) 画 |PF| 与 |PD| 两根条，长度像素 l1、l2
function distBars(x, y, l1, l2, c1, c2, t1, t2, a = 1) {
  if (a <= 0) return; [[l1, c1, t1], [l2, c2, t2]].forEach(([l, c, s], i) => { panel(x, y + i * 44, Math.max(8, l), 28, c, a, hexA(c, 0.35)); label(s, x - 14, y + 14 + i * 44, 22, c, a, { bold: true, align: 'right' }); });
}
// 竖线 x = xv 与字形轮廓的交点（字形单位），返回 y 数组（升序）
function glyphHits(ch, xv) {
  const S = GSEG_CACHE[ch] || (GSEG_CACHE[ch] = glyphSegs(ch)), ys = [];
  S.forEach(sg => {
    if (sg.L) { const [p, q] = sg.L; if ((p[0] - xv) * (q[0] - xv) <= 0 && p[0] !== q[0]) { const s = (xv - p[0]) / (q[0] - p[0]); ys.push(p[1] + s * (q[1] - p[1])); } return; }
    const [p0, p1, p2] = sg.Q, A = p0[0] - 2 * p1[0] + p2[0], B = 2 * (p1[0] - p0[0]), C = p0[0] - xv; let ss = [];
    if (Math.abs(A) < 1e-9) { if (Math.abs(B) > 1e-9) ss = [-C / B]; } else { const D = B * B - 4 * A * C; if (D >= 0) ss = [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)]; }
    ss.filter(s => s >= 0 && s < 1).forEach(s => ys.push((1 - s) ** 2 * p0[1] + 2 * s * (1 - s) * p1[1] + s * s * p2[1]));
  });
  return ys.sort((a, b) => a - b);
}
// 轮廓 c 上“时间” T（0 ≤ T ≤ 段数）处的点：整数部分 = 第几段，小数部分 = 段内参数
function glyphPt(ch, T, c = 0) {
  const S = (GSEG_CACHE[ch] || (GSEG_CACHE[ch] = glyphSegs(ch))).filter(s => s.c === c), n = S.length; if (!n) return [0, 0];
  const k = Math.min(n - 1, Math.floor(clamp(T, 0, n))), s = clamp(T, 0, n) - k, sg = S[k];
  if (sg.L) return lerp2(sg.L[0], sg.L[1], s); return bezPt(sg.Q, s);
}
const glyphN = (ch, c = 0) => (GSEG_CACHE[ch] || (GSEG_CACHE[ch] = glyphSegs(ch))).filter(s => s.c === c).length;
