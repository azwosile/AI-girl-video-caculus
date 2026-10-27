// 第 2 章 P7《导数：差商的极限》段配置（10-27）。MiniMax 立绘 n_base 为本课新生成差分（原设定 ZipZipPipe）。
window.SEG = {
  tag: 'P7', short: '导数', title: 'AI娘微积分课 · 第2章 · 导数：差商的极限', chap: 2,
  fontWarm: '一上下不与业为义乐习产享人仅件优但位作使依允元克再准几函分切创利割化单参变可台各合名咔品商善地均堂声多大头娘学官定导小尹差平幻度式归形微性想慢成按据授数斜方无时明本权材来极标案段每混温点片率生用由的真瞬社秒积称程立章第等答米素紫线经结绘统考者肥自许设证说课象起转边过连速钟锁镜际降限隆随集非音题鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','n_base'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, n_base:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('N01'), V('C02'), V('N02'), V('C03'), V('C04'), BEAT('slow', 0.5),
    V('C05'), V('C06'), BEAT('def', 0.4),
    V('C07'), V('D02'), V('C08'), BEAT('tangent', 0.4),
    V('C09'), V('N03'), BEAT('rate', 0.4),
    V('C10'), V('C11'), BEAT('quiz', 2.9), V('N04'),
    V('C12'), V('C13'), BEAT('outro', 5)
  ]
};
