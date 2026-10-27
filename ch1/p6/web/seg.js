// P6《指数、e 与增长》段配置。只用 Claude / GPT / 大肥鱼的共享立绘，没有客串。
window.SEG = {
  tag: 'P6', short: '指数、e 与增长', title: 'AI娘微积分课 · 第1章 · 指数、e 与增长',
  fontWarm: '指数自然常数对数增长利滚利复利年利率结息按月按天上限底数切线斜率导数证明运算法则同底相乘相加乘方积递增递减回忆卡赛跑领先甩开对数纵轴刻度幂次远小于镜像翻折反函数残差拟合直线弧弯曲规律随机模型示例数据扰动窗口陷阱反超一飞冲天随堂谁大小结收束第一章署名',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_curious','d_think','d_sparkle','gp_point'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_curious:0.55, d_think:0.7, d_sparkle:0.6, gp_point:0.54 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'),
    V('G01'), V('G02'),
    V('C03'), V('C04'), V('C05'), V('C06'), V('D02'), V('C07'),
    V('C08'), V('C09'), V('C10'), V('D03'),
    V('C11'), V('C12'), V('C13'), V('C14'), V('G03'),
    V('C15'), V('C16'),
    V('C17'), V('C18'), V('C19'), V('G04'),
    V('C20'), V('C21'), V('C22'),
    V('C23'), V('C24'), BEAT('quiz', 2.9), V('D04'), V('C25'), V('C26'),
    V('C27'), V('C28'), BEAT('outro', 5)
  ]
};
