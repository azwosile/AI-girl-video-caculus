// 第 3 章 P2《为什么是 e》段配置（10-28）。Gemini 立绘 m_base / m_cheeky 沿用 Git 课素材（ZipZipPipe）。
window.SEG = {
  tag: 'P2', short: '为什么是e', title: 'AI娘微积分课 · 第3章 · 为什么是 e', chap: 3,
  fontWarm: '一三上下不与业个中串为主么义之乐乘习了二于享亮人什仅介代仪件优但位体余作你使例依便保倒值偏允元克全公共关其内再准几出函分切列创利制刻前割加动区半原参变只可台右号各合同名后向和品哪商啮善回圆圈在地坐块基堂声处复外够大夹好始娘字学它完官定客容对导小尹尾层左差己师带常幕平幻底度开式弧归形往径微恰想成打扫把括拼指按据授接推提效数斜方无时明是曲最有本权杆材来果标样根格槽模次步段毂每比法混清滑点片版牌独猜率现珠理生用由画的盘直相看真码础社秒积称移窗立竖章符第等签算系素紫红约线组经结绘统绿署考者联肥自色节行表角触计记讲许设证说读课象走起跳转轮轴载辐辑近返还这连逐速逻邻部配里重金针链问间附隆随集青非面音顶题颜验骤鱼鹭齿？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','gp_explain','gp_point','d_curious','d_think','d_sparkle','d_happy','m_base','m_cheeky'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, gp_explain:0.54, gp_point:0.54, d_curious:0.55, d_think:0.7, d_sparkle:0.6, d_happy:0.55, m_base:0.62, m_cheeky:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('def', 0.5),
    V('C03'), V('D02'), V('C04'), BEAT('slope', 0.5),
    V('M01'), V('C05'), V('G01'), V('G02'), V('M02'), BEAT('gemini', 0.4),
    V('C06'), V('C07'), V('C08'), V('D03'), BEAT('ex', 0.4),
    V('C09'), V('C10'), BEAT('quiz', 2.9), V('D04'),
    V('C11'), V('C12'), BEAT('outro', 5)
  ]
};
