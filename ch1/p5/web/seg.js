// P5《反三角函数》段配置。Grok 立绘在 sprites_local/（复制自 Git 课 ep5，作者 ZipZipPipe），按非商用署名，见 docs/素材与授权.md。
window.SEG = {
  tag: 'P5', short: '反三角函数', title: 'AI娘微积分课 · 第1章 · 反三角函数',
  fontWarm: '反三角函数正弦余弦正切余切反正弦反余弦反正切反余切单射一一对应剪下翻折主值区间定义域值域单位圆右半圆上半圆水平渐近线锯齿反弹复合三角形斜边对边邻边余割课本习题随堂小结指数增长绕弯子行吧',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','d_sparkle','gp_point','x_base','x_angry'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, d_sparkle:0.6, gp_point:0.54, x_base:0.6, x_angry:0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'),
    V('C03'), V('C04'), V('C05'), V('G01'),
    V('C06'), V('C07'), V('C08'),
    V('C09'), V('C10'), V('C11'), V('C12'), V('D02'), V('C13'),
    V('C14'), V('C15'), V('X01'), V('C16'), V('C17'), V('C18'), V('X02'), V('C19'),
    V('C20'), V('C21'), V('C22'), V('C23'),
    V('C24'), V('C25'), BEAT('quiz', 2.9), V('C26'),
    V('C27'), BEAT('quiz', 2.9), V('D03'),
    V('C28'), V('C29'), BEAT('outro', 5)
  ]
};
