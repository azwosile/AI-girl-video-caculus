// 第 2 章 P6《无穷远处：渐近线》段配置（10-27）。Llama 立绘 l_base 为本课新生成差分（原设定 ZipZipPipe）。
window.SEG = {
  tag: 'P6', short: '渐近线', title: 'AI娘微积分课 · 第2章 · 无穷远处：渐近线', chap: 2,
  fontWarm: '一上下不与业两为之乐习享人仅优会但作使依值做允元克再准函分创利到参口可台右号各合同名后品商善回地堂声多大头娘子学官定导小尹尾峰左差巴平幻开式归形往微心想成指按据授放数斜方无时明有本权材极标样根次段母比水法混渐源滑片理生用由的真社秒积称究立章符第等米系素紫纵线终经结绘统缩考者肥自芝视许设诀证说诺课象赢路轴近野阱限除陷隆随集非音项题首高鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','l_base'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, l_base:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('L01'), V('C01'), V('C02'), BEAT('horiz', 0.5),
    V('C03'), V('C04'), V('L02'), BEAT('rational', 0.4),
    V('C05'), V('C06'), V('D02'), BEAT('trap', 0.4),
    V('C07'), V('C08'), BEAT('slant', 0.4),
    V('C09'), V('L03'), BEAT('growth', 0.4),
    V('C10'), V('C11'), BEAT('quiz', 2.9), V('L04'),
    V('C12'), V('C13'), BEAT('outro', 5)
  ]
};
