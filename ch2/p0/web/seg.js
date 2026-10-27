// 第 2 章 P0《芝诺悖论》段配置（10-27）。Grok / Kimi 立绘在 sprites_local/（复制自 Git 课，作者 ZipZipPipe），按非商用署名，见 docs/素材与授权.md。
window.SEG = {
  tag: 'P0', short: '芝诺悖论', title: 'AI娘微积分课 · 第2章 · 芝诺悖论', chap: 2,
  fontWarm: '阿喀琉斯与乌龟追不上芝诺悖论亚里士多德物理学第六卷约前年无穷多段有限时间飞矢动一瞬间小段平均速度瞬时割线切线斜率极限导数领先每秒米追回正好出头冲了这是真的吗终点出发犯规往哪儿去分子分母趋于不是一个数电脑算箭停在位置原来如此缺道理两千后才工具下一段高中速通素材授权说明本鲸拜拜啦起点放大十倍越短越靠近取同件事画图上点连成靠近转方程速度和比值所以没有答案而要看它严格定义叫再用？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_happy','d_sparkle','d_think','gp_point','gp_proud','gp_explain','k_base','k_read','x_base','x_angry','x_force','x_thumb'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_happy:0.55, d_sparkle:0.6, d_think:0.7, gp_point:0.54, gp_proud:0.54, gp_explain:0.54, k_base:0.62, k_read:0.62, x_base:0.6, x_angry:0.6, x_force:0.6, x_thumb:0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('K01'), V('C01'), V('D02'), V('X01'), V('C02'), V('C03'), V('X02'), BEAT('achilles', 0.5),
    V('C04'), V('C05'), BEAT('sum', 0.4), V('G01'), V('X03'), V('C06'), BEAT('sum', 0.5),
    V('K02'), V('C07'), V('G02'),
    V('C08'), V('C09'), V('D03'), V('C10'), V('K03'),
    V('C11'), V('C12'), V('C13'), BEAT('tangent', 0.6),
    V('G03'), V('D04'), V('C14'), V('X04'), V('C15'), BEAT('outro', 5)
  ]
};
