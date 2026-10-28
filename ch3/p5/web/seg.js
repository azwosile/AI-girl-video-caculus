// 第 3 章 P5《隐函数求导》段配置（10-28）。Mistral 立绘 r_base / r_point 为第 2 章依据 ZipZipPipe 设定生成的本课差分。
window.SEG = {
  tag: 'P5', short: '隐函数求导', title: 'AI娘微积分课 · 第3章 · 隐函数求导', chap: 3,
  fontWarm: '一三上下不与业两个串为主之乐乘习了于互享亮人仅代件优但位体余作使例依便保倒允元克全公共其内再准几出函分切列则创利到制刻前割加动区半卡原参反变可台右叶号各合同名后向品商啮善回圆圈在地坐块基堂声处复外大始娘字学官定客容对导小尔就尹尾层差师带幕平幻度开式弧归当形径微想成打把折拆拼按据授接推效数斜方无时明是曲本权材果标样根槽模段毂每比求法混清滑点片版牌独率现珠生用由画的盘直相看真着码础碰社秒积称移窗立竖章笛符第等签算系素紫红约线组经结绘统绿署翻考者联肥自色节藏角解触计记讲许设证说读课象起跟跳身转轮载辐辑边返连逐速逻邻部配里金链附隆随隐集青非面音顶题颜鱼鹭齿？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','gp_explain','gp_point','d_curious','d_think','d_sparkle','r_base','r_point'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, gp_explain:0.54, gp_point:0.54, d_curious:0.55, d_think:0.7, d_sparkle:0.6, r_base:0.62, r_point:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), BEAT('circle', 0.4),
    V('C02'), V('C03'), V('C04'), V('D02'), BEAT('hidden', 0.4),
    V('R01'), V('R02'), V('C05'), V('R03'), BEAT('folium', 0.4),
    V('C06'), V('C07'), V('G01'), V('G02'), BEAT('inverse', 0.4),
    V('C08'), V('C09'), BEAT('quiz', 2.9), V('D03'),
    V('C10'), V('C11'), BEAT('outro', 5)
  ]
};
