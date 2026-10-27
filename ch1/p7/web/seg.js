// P7《收束》段配置。豆包立绘在 sprites_local/（复制自 Git 课 ep5，Seed 拟人形象，作者 ZipZipPipe），按非商用署名，见 docs/素材与授权.md。
window.SEG = {
  tag: 'P7', short: '收束', title: 'AI娘微积分课 · 第1章 · 收束',
  fontWarm: '第一章回顾初等函数基本常数幂指数对数三角反三角四则运算复合狄利克雷有理点无理点分段绝对值极限洞逼近靠近割线切线斜率重合出口票家人们单射满射定义域开区间主值区间锯齿恭喜术语墙值域有界奇偶周期反函数增长阶星图下一章见署名',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','d_sparkle','gp_point','gp_proud','b_base','b_wave','b_proud'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, d_sparkle:0.6, gp_point:0.54, gp_proud:0.54, b_base:1.0, b_wave:0.62, b_proud:0.6 },
  plan: (V, BEAT) => [
    V('C01'),
    V('C02'), V('C03'), V('C04'), V('D01'), V('C05'), V('G01'),
    V('C06'), V('C07'), V('C08'), V('D02'), V('C09'),
    V('C10'), V('C11'), V('C12'),
    V('B01'), V('B02'), BEAT('ticket', 4.9), V('C13'), V('B03'), BEAT('ticket', 4.9), V('C14'), V('B04'), BEAT('ticket', 4.9), V('C15'), V('B05'),
    V('C16'), V('C17'), V('G02'), V('D03'),
    V('C18'), BEAT('outro', 5)
  ]
};
