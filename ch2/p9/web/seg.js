// 第 2 章 P9《收束 · 出口票》段配置（10-27）。片尾合影用到全章所有角色立绘。
window.SEG = {
  tag: 'P9', short: '收束与出口票', title: 'AI娘微积分课 · 第2章 · 收束与出口票', chap: 2,
  fontWarm: '一三上下不与业中丶为么乐习了二于享人仅介们优但作使依值允元克全再准出函分切列则创利制包化千参变口可台右各合名吗告品商啦善回在地声处复大夹娘学它完官定家对导就尹左差平幻应弄式归形影微怎想成按据授收数文斜断新方无明智本权材束条来极标段求法混渐点片率现理生用由甶的看真社票积称立章第等算管糊系素紫线经绘统续考者肥自色芝角许设证说诺课谱豆象赞趋近连通速逼道那链错问间阶限隆集非音预题鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_happy','d_sparkle','b_wave','b_proud','b_sorry',
            'gp_proud','q_point','m_base','x_thumb','k_base','h_base','z_deal','r_point','t_base','l_base','n_base'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_happy:0.55, d_sparkle:0.6, b_wave:0.62, b_proud:0.6, b_sorry:0.62,
          gp_proud:0.54, q_point:0.6, m_base:0.62, x_thumb:0.6, k_base:0.62, h_base:0.62, z_deal:0.62, r_point:0.62, t_base:0.62, l_base:0.62, n_base:0.62 },
  plan: (V, BEAT) => [
    V('C01'), V('D01'), BEAT('chain', 0.5),
    V('B01'), V('B02'), BEAT('q1', 2.9), V('D02'), V('B03'), BEAT('q2', 2.9), V('C02'), V('B04'), BEAT('q3', 2.9), V('C03'), V('B05'), BEAT('q3', 0.4),
    V('C04'), V('D03'), V('C05'), BEAT('next', 0.4),
    V('C06'), V('D04'), BEAT('group', 6)
  ]
};
