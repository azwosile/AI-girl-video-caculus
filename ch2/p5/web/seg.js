// 第 2 章 P5《连续与介值定理》段配置（10-27）。MiMo 立绘 t_base 为本课新生成差分（原设定 甶丶，CC BY-NC）；Gemini m_*、GPT gp_* 沿用。
window.SEG = {
  tag: 'P5', short: '连续与介值定理', title: 'AI娘微积分课 · 第2章 · 连续与介值定理', chap: 2,
  fontWarm: '一三上下不与业两个丶为义乐也习二享人仅介优但作使依保值允元克全关内再准减几出函分列创初利制区半去参可台右各合同名品商善四图在地域堂声处复多大娘存学官定对小尹左差幂平年幻式归形微想成找把拟指按振据授数断方无明是有本权材来极标根次段每没法济混渐点片现理生用由甶的相真社离种秒积称穷穿立章笔第等算类系素紫纸线经结绘统续考者肥自荡补角许设证说课象跃跳过运近还远连鉴错间限隆随集非音项题鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','d_sparkle','t_base','m_cheeky','gp_point'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, d_sparkle:0.6, t_base:0.62, m_cheeky:0.62, gp_point:0.54 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('def', 0.5),
    V('C03'), V('C04'), V('T01'), V('C05'), V('D02'), V('C06'), BEAT('types', 0.4),
    V('C07'), V('C08'), BEAT('comp', 0.4),
    V('C09'), V('M01'), V('G01'), V('M02'), BEAT('ivt', 0.4),
    V('C10'), V('C11'), V('D03'), BEAT('bisect', 0.4),
    V('C12'), V('C13'), BEAT('quiz', 2.9), V('T02'),
    V('C14'), V('C15'), BEAT('outro', 5)
  ]
};
