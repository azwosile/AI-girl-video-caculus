// P4《复合与反函数》段配置（10-27 重置后重做）。Kimi 立绘在 sprites_local/，按非商用署名，见 docs/素材与授权.md。
window.SEG = {
  tag: 'P4', short: '复合与反函数', title: 'AI娘微积分课 · 第1章 · 复合与反函数',
  fontWarm: '复合函数定义域外层内层串联机器掉下去筛选顺序交换半圆射线拆链从里往外反函数箭头反向一一对应单射双射水平线检验严格单调可逆翻折对调写解换三步双曲正弦随堂小结反三角函数',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_happy','d_think','d_sparkle','d_ok','gp_explain','gp_point','k_base','k_read'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_happy:0.55, d_think:0.7, d_sparkle:0.6, d_ok:0.58, gp_explain:0.54, gp_point:0.54, k_base:0.62, k_read:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'),
    V('C03'), V('C04'), V('D02'), V('C05'), V('C06'), V('C07'), V('G01'),
    V('C08'), V('C09'),
    V('C10'), V('K01'), V('K02'), V('C11'),
    V('D03'), V('C12'), V('C13'), V('C14'), V('C15'), V('G02'),
    V('C16'), V('C17'), V('C18'), V('C19'),
    V('C20'), V('C21'),
    V('C22'), V('C23'), V('C24'), V('C25'), V('D04'),
    V('C26'), V('C27'), BEAT('quiz', 2.9), V('C28'),
    V('C29'), BEAT('quiz', 2.9), V('D05'),
    V('C30'), V('C31'), BEAT('outro', 5)
  ]
};
