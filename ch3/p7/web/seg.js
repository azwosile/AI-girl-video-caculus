// 第 3 章 P7《指数增长与衰减》段配置（10-28）。千问立绘 q_tea / q_point 沿用 Git 课素材（ZipZipPipe）。
window.SEG = {
  tag: 'P7', short: '指数增长与衰减', title: 'AI娘微积分课 · 第3章 · 指数增长与衰减', chap: 3,
  fontWarm: '一上下不与世业两个串为主之乐乘习买了于享亮人亿仅代件份优似但位体余作使例依便保倒允元克全公共关其内再准减几出函分切列创利制刻前剩割加化区千半原参变口只可台号各合同名后向吗品商啮善回圆圈在地场坐块型基堂增声复外多大始娘子字学官定实客容对小少就尹尾层差币师带幕平年并幻度开式弧归形径微快息想成打把拟拼指按据授接推效数斜方无时明是曲更有期本权材果柱标样根梯槽模次段毂每比测混清点片版牌独率现珠生用由画界的盘直相看真码础社秒积称移窗立竖章符第等签算系素紫红约线组细经结绘统续绿署考者联肥自色节菌衰角触计记讲许设证说课象起跳转轮载辐辑近返还连逐速逻邻部配里金钱链长问阶附隆随集青非面音顶预题颜高鱼鹭齿？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','gp_explain','gp_point','d_curious','d_shock','d_sparkle','q_tea','q_point'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, gp_explain:0.54, gp_point:0.54, d_curious:0.55, d_shock:0.82, d_sparkle:0.6, q_tea:0.6, q_point:0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('law', 0.5),
    V('C03'), V('C04'), V('G01'), BEAT('people', 0.5),
    V('C05'), V('D02'), BEAT('decay', 0.5),
    V('Q01'), V('Q02'), BEAT('money', 0.5),
    V('C06'), V('C07'), BEAT('quiz', 2.9), V('D03'),
    V('C08'), V('C09'), BEAT('outro', 5)
  ]
};
