// P3《性质的严格语言》段配置。Gemini 娘使用 AI娘 Git 课已核验的 ZipZipPipe 立绘；仅非商用并署名。
window.SEG = {
  tag: 'P3', short: '函数性质', title: 'AI娘微积分课 · 第1章 · 函数的严格语言',
  fontWarm: '函数有界无界上界下界单调增加递减奇偶周期性量词任意存在定义域实数集正弦指数双曲余弦导数随堂复合反函数',
  sprites: ['c_ok','c_cool','c_explain','c_point','d_happy','d_think','d_shock','d_ok','gp_explain','gp_point','gp_proud','m_base','m_cheeky'],
  sprc: { c_ok:0.58, c_cool:0.58, c_explain:0.56, c_point:0.56, d_happy:0.58, d_think:0.7, d_shock:0.58, d_ok:0.58, gp_explain:0.54, gp_point:0.54, gp_proud:0.54, m_base:0.62, m_cheeky:0.62 },
  plan: (V, BEAT) => [
    V('D01'), V('C01'), V('C02'),
    V('C03'), V('C04'), V('C05'), V('C06'), V('G01'),
    V('C07'), V('C08'), V('C09'), V('C10'), V('C11'), V('C12'),
    V('M01'), V('C13'), V('C14'), V('M02'), V('C15'),
    V('C16'),
    V('C22'), V('C23'), V('D03'), V('C24'), V('C25'), V('C26'), V('C27'), V('C28'),
    V('C29'), V('C30'), V('C31'), V('C32'), V('G03'), V('C33'),
    V('C34'), V('C35'), BEAT('quiz',2.9), V('M03'),
    V('C36'), BEAT('quiz',2.9), V('D04'),
    V('C37'), BEAT('quiz',2.9), V('C38'),
    V('C39'), V('C40'), BEAT('outro',5)
  ]
};