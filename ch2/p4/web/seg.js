// 第 2 章 P4《ε-δ：讨价还价的定义》段配置（10-27）。GLM 立绘 z_*、Mistral 立绘 r_* 为本课新生成差分（原设定 ZipZipPipe）。
window.SEG = {
  tag: 'P4', short: '讨价还价的定义', title: 'AI娘微积分课 · 第2章 · ε-δ：讨价还价的定义', chap: 2,
  fontWarm: '一上下不与世业个中为义乐习了享人仅介以价任优但作你使依候值允元先克再写准出函分创利到参变可台各合名后和品商善国在地堂声外多大娘子字存学官定小尔尹差带平幻式归形得微德总想意戏成我才找拉按据授放教数文斯方无时明智最期本权材极析柯标次段法涨混清游片特理生用由的真着社秒积称程穷立章第等算素紫纪经结绘统续考者肥能自西讨讲许设证词说课谁谱象跟近还这连都量限隆随集非音题魏鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_think','z_base','z_deal','r_base','r_point'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_think:0.7, z_base:0.62, z_deal:0.62, r_base:0.62, r_point:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('Z01'), V('C02'), V('Z02'), V('C03'), V('Z03'), V('C04'), BEAT('game', 0.5),
    V('C05'), V('C06'), BEAT('def', 0.4),
    V('Z04'), V('C07'), BEAT('fail', 0.4),
    V('C08'), V('C09'), BEAT('inf', 0.4),
    V('R01'), V('R02'), V('Z05'), BEAT('history', 0.4),
    V('C10'), V('C11'), BEAT('quiz', 2.9), V('R03'),
    V('C12'), V('C13'), BEAT('outro', 5)
  ]
};
