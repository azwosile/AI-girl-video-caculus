// 第 2 章 P3《算极限：法则、0/0 与夹逼》段配置（10-27）。豆包立绘 b_* 复制自 Git 课；混元立绘 h_* 为本课新生成差分（原设定 ZipZipPipe）。
window.SEG = {
  tag: 'P3', short: '算极限', title: 'AI娘微积分课 · 第2章 · 算极限：法则、0/0 与夹逼', chap: 2,
  fontWarm: '一三上下不与业中为义乐乘也习享人仅代价优但位作你使依值允元克入再准出分列则创利制包化单参可台右各合同名和品商善因圆地堂声复大夹娘子学官定对小就尹左差平幻开式归形微总想成我才打拆拟按据授掉接数方无明有本权材极标次段每没法混片理生用由界的盘直真社秒积称立章第等算系素紫约经结绘绝统考者肥能自表要讨许设证说课豆象账还逼都重间限隆随集零非面音题鱼鹭？！～，。：；、·→…（）《》“”',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','d_sparkle','b_proud','b_sorry','h_base','h_calc'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, d_sparkle:0.6, b_proud:0.6, b_sorry:0.62, h_base:0.62, h_calc:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('laws', 0.5),
    V('C03'), V('C04'), V('D02'), V('C05'), BEAT('zero', 0.4),
    V('C06'), V('C07'), V('H01'), BEAT('squeeze', 0.4),
    V('B01'), V('C08'), V('B02'), V('H02'), V('C09'), V('C10'), V('D03'), V('C11'), BEAT('sinx', 0.4),
    V('C12'), V('C13'), BEAT('quiz', 2.9), V('H03'),
    V('C14'), V('C15'), BEAT('outro', 5)
  ]
};
