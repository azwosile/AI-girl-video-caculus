// 第 2 章 P1《高中速通：导数》段配置（10-27）。千问立绘在 ch2/sprites（q_point / q_tea，第 1 章 P1 用过，已数手），作者 ZipZipPipe，见 docs/素材与授权.md。
window.SEG = {
  tag: 'P1', short: '高中速通', title: 'AI娘微积分课 · 第2章 · 高中速通：导数', chap: 2,
  fontWarm: '',   // 由下方 FONT_TEXT 自动补齐
  sprites: ['c_ok','c_cool','c_explain','c_point','d_happy','d_think','d_sparkle','d_shock','gp_point','gp_explain','q_point','q_tea'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_happy:0.55, d_think:0.7, d_sparkle:0.6, d_shock:0.82, gp_point:0.54, gp_explain:0.54, q_point:0.6, q_tea:0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), BEAT('intro', 0.4),
    V('C02'), V('C03'), V('D02'), BEAT('rate', 0.3),
    V('C04'), V('C05'), V('G01'), BEAT('tangent', 0.4),
    V('C06'), V('Q01'), V('Q02'), V('Q03'), V('D03'), BEAT('table', 0.4),
    V('C07'), V('C08'), V('G02'), V('C09'), BEAT('rules', 0.5),
    V('C10'), V('C11'), BEAT('quiz', 2.9), V('D04'),
    V('C12'), BEAT('quiz', 2.9), V('Q04'),
    V('G03'), V('D05'), V('C13'), V('C14'), BEAT('outro', 5)
  ]
};
window.SEG.fontWarm = '高中速通导数四关每关半分钟平均变化率瞬时求导公式运算法则单调性增量割线切线斜率几何意义过切点该点方程回顾上一段从定义算太慢常用直接记住表全包再买就是了一份大方千问姐姐和差积商前导后不导加减除以下的平方递增递减函数随堂两题第一二题代入多少是趋于什么意思漏洞高中从来没有无限靠近直觉说清楚这一章任务极限下记号单侧素材与授权说明？！～，。：；、·→…（）《》“”';
