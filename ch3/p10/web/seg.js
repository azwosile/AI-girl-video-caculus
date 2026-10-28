// 第 3 章 P10《收束 · 出口票》段配置（10-28）。片尾合影用到全章所有角色立绘。
window.SEG = {
  tag: 'P10', short: '收束与出口票', title: 'AI娘微积分课 · 第3章 · 收束与出口票', chap: 3,
  fontWarm: '一三上下不与业中串丶为主之乐乘习了于享亮人仅代件伍优估但位体余作使例依便保倒值允元充克全公共关其内再准减几出函分切列则创利制刻前割加包化区千半原参变口可台号各合同名后向吗告员品商啮善回图圆圈在地坐块基堂增声处复外大始娘字学完官定实客容对导小尹尾层差师带幕平幻应度开式弧归形影径微必念性想成打把拼按据授接收效数文斜方无时明星是智本权材束条极果标样核根概槽模毂每比求法洛济混清点片版牌独率现珠理生用由甶画的盘直相看真码础社票积称移窗立竖站章符第等签算系素紫红约线组经结绘统绿署考者联肥自色节补衰角触计记讲许设证说课谱豆象起路跳转轮载辐辑达过近返这进连逐通速逻道邻部配里金链长问队附隆随隐集青非面音顶预题颜鱼鹭齿？！～，。：；、·→…（）《》“”',
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
