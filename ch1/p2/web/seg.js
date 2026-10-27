// P2《函数的大学定义：映射》段配置
window.SEG = {
  tag: 'P2', short: '映射', title: 'AI娘微积分课 · 第1章 · 函数的大学定义：映射',
  fontWarm: '映射定义域陪域值域单射满射双射撞车满座证明函数相等特殊函数符号取整绝对值竖线检验随堂两题小贴士同济每一个唯一',
  sprites: ['c_ok', 'c_cool', 'c_explain', 'c_point', 'gp_point', 'gp_proud', 'gp_explain', 'd_curious', 'd_think', 'd_panic', 'd_sparkle'],
  sprc: { c_ok: 0.58, c_cool: 0.58, c_explain: 0.56, c_point: 0.56, gp_point: 0.54, gp_proud: 0.54, gp_explain: 0.54, d_curious: 0.55, d_think: 0.7, d_panic: 0.55, d_sparkle: 0.6 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'), BEAT('hook', 0.4),
    V('C03'), V('C04'), V('C05'), V('C06'), V('C07'), V('C08'), V('G01'), V('C09'), BEAT('def', 0.5),
    V('C10'), V('C11'), V('D02'), V('C12'), V('C13'), BEAT('sets', 1.0),
    V('C14'), V('C15'), V('C16'), V('D03'), V('G02'), V('C17'), BEAT('inj', 0.8),
    V('C18'), V('C19'), V('C20'), V('C21'), V('C22'), V('C22B'), V('C22C'), BEAT('proof', 0.6),
    V('C23'), V('C24'), V('C25'), V('C26'), V('C27'), BEAT('x2', 0.5),
    V('D04'), V('C28'), V('C29'), V('C30'), BEAT('equal', 0.6),
    V('C31'), V('C32'), V('C33'), V('C34'), V('G03'), V('C35'), BEAT('special', 0.5),
    V('C36'), V('C37'), V('C38'), V('C39'), BEAT('vlt', 0.6),
    V('C40'), V('C41'), BEAT('quiz', 2.9), V('C42'), V('C43'), BEAT('quiz', 2.9), V('D05'), V('C44'),
    V('C45'), V('C46'), BEAT('outro', 2.6),
  ],
};
