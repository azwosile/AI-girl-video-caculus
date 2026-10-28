// 第 3 章 P4《链式法则》段配置（10-28）。豆包立绘 b_proud / b_sorry 沿用 Git 课素材（ZipZipPipe 的 Seed/豆包拟人设定）。
window.SEG = {
  tag: 'P4', short: '链式法则', title: 'AI娘微积分课 · 第3章 · 链式法则', chap: 3,
  fontWarm: '一三上下不与业两中串为主么之乐乘也习了于享亮人什仅代件优但位体余作使例依便保倍倒允元克全公共其内再写准几出函分切列则创利到制刻前剥割加动包区半原参又变可台号各合同名后向品商啮善回圆圈在地坐块基堂声处复外大套始娘字学官定客容对导小少尹尾层展差师带幂幕平幻度开弄式弧归形往径微怎想成打把拟拼按据授接推收效数文方无时明最本权杆材条果标样根案槽模次段毂每比求法洋混清滑漏点照片版牌独现珠理生用由画的盘直相看真码础社秒积称移窗立竖章符第等答签算糊系素紫红约线组经结绘统绿缩署翻考者联肥能自色节葱行角触计让记讲许设证误说课豆象走起跳车转轮载辐辑返这连逐速逻邻部都配里金链附隆随隐集青非面音顶项题颜飞高鱼鹭齿？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','gp_explain','gp_point','d_curious','d_think','d_sparkle','b_proud','b_sorry'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, gp_explain:0.54, gp_point:0.54, d_curious:0.55, d_think:0.7, d_sparkle:0.6, b_proud:0.6, b_sorry:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('theorem', 0.5),
    V('B01'), V('C03'), V('B02'), V('G01'), V('G02'), BEAT('onion', 0.4),
    V('C04'), V('C05'), V('D02'), V('C06'), BEAT('power', 0.4),
    V('G03'), V('G04'), BEAT('proof', 0.5),
    V('C07'), V('C08'), BEAT('quiz', 2.9), V('D03'), V('C09'), BEAT('quiz', 2.9), V('B03'),
    V('C10'), V('C11'), BEAT('outro', 5)
  ]
};
