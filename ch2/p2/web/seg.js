// 第 2 章 P2《极限是什么》段配置（10-27）。Gemini 立绘 m_base / m_cheeky 复制自第 1 章 P3（源自 Git 课，作者 ZipZipPipe）。
window.SEG = {
  tag: 'P2', short: '极限是什么', title: 'AI娘微积分课 · 第2章 · 极限是什么', chap: 2,
  fontWarm: '一三上下不与业为么义乐习享人什仅优但作使儿允克再冲准函分列则创利制去参另只可台右各合名向吗品哪商善回在地垂堂声处复外大夹娘子存学官定对小尹左常平幻式归形微想成才打按挖振换据授掉数方无明是有本权材来极标样正段没法渐点片猜理用的直相盾看真矛社种秒积称程穷立章第等算系素紫线组经结绘统考者肥能自荡表观许证说课象跃跳过近这逼那阱阶限陷隆随集非靠音题鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','d_sparkle','gp_point','gp_explain','m_base','m_cheeky'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, d_sparkle:0.6, gp_point:0.54, gp_explain:0.54, m_base:0.62, m_cheeky:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('intro', 0.5),
    V('C03'), V('C04'), V('D02'), V('C05'), BEAT('hole', 0.4),
    V('C06'), V('C07'), V('G01'), BEAT('side', 0.4),
    V('C08'), V('C09'), BEAT('dne', 0.4),
    V('M01'), V('M02'), V('G02'), V('C10'), V('M03'), V('C11'), BEAT('table', 0.4),
    V('C12'), V('C13'), BEAT('quiz', 2.9), V('D03'),
    V('C14'), V('C15'), BEAT('outro', 5)
  ]
};
