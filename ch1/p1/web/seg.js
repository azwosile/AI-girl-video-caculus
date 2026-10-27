// P1《高中速通》段配置：立绘表 + 台词计划（core.js 读取）
window.SEG = {
  tag: 'P1', title: 'AI娘微积分课 · 第1章 · 高中速通',
  fontWarm: '高中速通五关定义域表示法初等函数图像变换指数对数已学通关映射随堂三连',
  sprites: ['c_ok', 'c_cool', 'c_explain', 'c_point', 'gp_point', 'gp_proud', 'gp_explain', 'd_happy', 'd_think', 'd_raise', 'd_panic', 'd_sparkle', 'q_point', 'q_tea'],
  sprc: { c_ok: 0.58, c_cool: 0.58, c_explain: 0.56, c_point: 0.56, gp_point: 0.54, gp_proud: 0.54, gp_explain: 0.54, d_happy: 0.55, d_think: 0.7, d_raise: 0.72, d_panic: 0.55, d_sparkle: 0.6, q_point: 0.6, q_tea: 0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), BEAT('intro', 0.3),
    V('C02'), V('C03'), V('C04'), BEAT('domain', 0.55),
    V('C05'), V('G01'), V('Q01'), V('Q02'), V('C06'), BEAT('rep', 0.5),
    V('C07'), V('C08'), V('D02'), V('G02'), BEAT('family', 0.5),
    V('C09'), V('C10'), V('D03'), V('C11'), BEAT('trans', 0.5),
    V('C12'), V('C13'), V('G03'), BEAT('explog', 0.55),
    V('C14'), V('C15'), BEAT('quiz', 2.9), V('C16'), V('C17'), BEAT('quiz', 2.9), V('D04'), V('C18'), BEAT('quiz', 2.9), V('D05'),
    V('C19'), V('C20'), BEAT('outro', 2.6),
  ],
};
