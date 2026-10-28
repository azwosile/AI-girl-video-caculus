// 第 3 章 P6《对数函数与对数求导法》段配置（10-28）。GLM 立绘 z_base / z_deal 为第 2 章依据 ZipZipPipe 设定生成的本课差分。
window.SEG = {
  tag: 'P6', short: '对数求导法', title: 'AI娘微积分课 · 第3章 · 对数函数与对数求导法', chap: 3,
  fontWarm: '一上下不与业两个串为主之乐乘也习了于互享亮人仅从代件价任优但位低体余作使例依便保倒像允元先克全公共关其内再准减几出函分切列则创利制刻前割加化区半原参取变可台号各合同名后向品哪商啮善回图圆圈在地坐块基堂增声处复外大始娘字学官定实客容对导小尹尾层差师带幂幕平幻度开式弧归形径微想意成打扣把折拼指按据授接效数斜方无时明智最本权材来果标样根槽模次段毂每比求法混清滑点片版牌独率现珠生用由画的盘直相看真码础社秒积称移窗立竖章符第等签算系素紫红约线组经结绘统续绿署考者联肥自色节衰角触计记讲许设证说课谱象起跳转轮载辐辑边返连逐速逻邻部配里金链长附除隆随隐集青非面音顶题颜鱼鹭齿？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','gp_explain','gp_point','d_curious','d_think','d_sparkle','z_base','z_deal'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, gp_explain:0.54, gp_point:0.54, d_curious:0.55, d_think:0.7, d_sparkle:0.6, z_base:0.62, z_deal:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), V('G01'), V('C03'), BEAT('ln', 0.4),
    V('Z01'), V('C04'), V('C05'), V('C06'), V('Z02'), BEAT('logdiff', 0.4),
    V('D02'), V('C07'), V('C08'), BEAT('xx', 0.4),
    V('G02'), BEAT('power', 0.6),
    V('C09'), V('C10'), BEAT('quiz', 2.9), V('D03'),
    V('C11'), V('C12'), BEAT('outro', 5)
  ]
};
