// 第 5 章 P16《收束 · 出口票》段配置（10-29）。片尾合影用到全章所有角色立绘。
window.SEG = {
  tag: 'P16', short: '收束与出口票', title: 'AI娘微积分课 · 第5章 · 收束与出口票', chap: 5,
  fontWarm: '一三上下不与业中串丶为主之乐乘习了于享亮人仅从代件伍优但位体余作使例依便保倒值做允元充克全公共其内再准几出函分切列创利制刻前割功加包区千半原参反变口只可台右号各合同名后向吗告员和品商啮善回图圆圈在地均坐块基堂填声复外大始娘字学完官定实客容对小尹尾层左差师带常幕平幻应度开式弓张弧归当形影径微德想成或打扣扫把抛拟括拼按换据授接措收改数文方旋无时明是智曲曼本权材束条果标样核根槽模毂每比求沿淡混清满点片版牌牛物独现珠理生用由甶画的盘直相看真着码础社票积称移窗立竖站章端符第等签算米系素紫红约线组细经结绘统绿置署考者联肥自致色节范莱表规角触计记讲许设证说读课谱豆象起跳转轮轴载辐辑辞过返这进连透逐通速逻道邻部配里金链长问间队阿附限隆随集青非面音顶预题颜鱼鹭黎齿？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','gp_explain','gp_point','d_happy','d_sparkle','x_force','x_base','x_thumb',
            'gp_proud','q_point','m_base','k_base','h_base','z_deal','r_point','t_base','l_base','n_base','b_wave'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, gp_explain:0.54, gp_point:0.54, d_happy:0.55, d_sparkle:0.6, x_force:0.6, x_base:0.6, x_thumb:0.6,
          gp_proud:0.54, q_point:0.6, m_base:0.62, k_base:0.62, h_base:0.62, z_deal:0.62, r_point:0.62, t_base:0.62, l_base:0.62, n_base:0.62, b_wave:0.62 },
  plan: (V, BEAT) => [
    V('C01'), V('C02'), V('G01'), BEAT('map', 0.5),
    V('X01'), V('X02'), BEAT('q1', 2.9), V('D01'),
    V('X03'), BEAT('q2', 2.9), V('C03'),
    V('X04'), BEAT('q3', 2.9), V('G02'), V('X05'), BEAT('q3', 0.4),
    V('C04'), V('D02'), BEAT('next', 0.4),
    V('C05'), BEAT('group', 6)
  ]
};
