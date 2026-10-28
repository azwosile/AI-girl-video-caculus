// 第 4 章 P17《收束 · 出口票》段配置（10-28）。片尾合影用到全章所有角色立绘。
window.SEG = {
  tag: 'P17', short: '收束与出口票', title: 'AI娘微积分课 · 第4章 · 收束与出口票', chap: 4,
  fontWarm: '一三上下不与业中串丶为主之乐乘习了于享亮人仅代件价伍优但位体余作使例依便保倒值允元克全公共其内再准几凸凹出函分切列创利制刻前割加勒包化区千半单印原参反变口可台号各合同名后向吗告品商啮善回图圆圈在地坐块基堂声复外大始娘字学完官定实客容对小尹尾层居差师带幕平幻度开式张弧归当形影径微必念恒想成打把拼按据授接揭收效数文方无时明星是晓智最未本权材束来极果柯标样核根案概槽模毂每比求沿法泰洛测混清满点片版牌牛独现珠理生用由甶画的盘直相看真码础社票积称移穷窗立竖站章符第等答签算系素紫红约线组经结绘统绿署考者联肥自色节范表西规角触计记讲许设证说读课调谱豆象起跳转轮载辐辑达过返这进连逐通速逻道邻部配里金链问队附限隆随集青非面音顶顿预题颜驻鱼鹭齿？！～，。：；、·→…（）《》“”',
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
