// 第 2 章 P8《导函数与可导性》段配置（10-27）。Grok 立绘 x_* 沿用（第 2 章 P0 同款，源自 Git 课，作者 ZipZipPipe）。
window.SEG = {
  tag: 'P8', short: '导函数与可导性', title: 'AI娘微积分课 · 第2章 · 导函数与可导性', chap: 2,
  fontWarm: '一上下不与业为主么乐乘也习了二享人什仅优但位作使像允元光克全再准出函分切列则创利制劈加包参反口可台各合名吗品商善在地坡堂声处复大娘学官导小尖尹山平幻度开式归形微性想成把持按据授推收放数斜方无明是本权材束来标次段每求法混滑点片率用由的直真着社票秒积称立竖章第等系素紫线经结绘统续置考者肥自行角许证说课谷豆象起过还连速阶隆随集非音顶题高鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','x_base','x_force','x_angry','x_thumb'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, x_base:0.6, x_force:0.6, x_angry:0.6, x_thumb:0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), V('C03'), BEAT('deriv', 0.5),
    V('C04'), V('X01'), V('X02'), V('C05'), V('C06'), V('C07'), V('X03'), BEAT('diff', 0.4),
    V('C08'), BEAT('high', 0.4),
    V('C09'), V('C10'), V('C11'), BEAT('rules', 0.4),
    V('C12'), V('C13'), BEAT('quiz', 2.9), V('X04'),
    V('C14'), V('C15'), BEAT('outro', 5)
  ]
};
