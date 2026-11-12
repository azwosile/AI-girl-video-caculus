# -*- coding: utf-8 -*-
# 第 7 章 P4《三角积分（一）：正弦与余弦的幂》台词源（11-12，不审）。客串：混元（H，按计算器）。Stewart 7e §7.2 例 1–4。
# 核算（sympy）：∫cos³ = sin x − ⅓sin³x；∫sin⁵cos² = −⅓cos³ + ⅖cos⁵ − ⅐cos⁷；∫₀^π sin² = π/2；∫sin⁴ = 3x/8 − ¼sin2x + sin4x/32；∫₀^(π/2) sin x cos²x = 1/3。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('H01', 'odd', 'h_calc', '∫cos³x dx，计算器上没有这个键。', '余弦 x 的三次方，积分怎么算？计算器上可没有这个键。'),
 ('C01', 'odd', 'c_explain', '奇次幂：剥出一个 cos x 留给 dx，剩下的 cos²x 换成 1 − sin²x。', '奇次幂，先剥出一个余弦 x，和 dx 配成 d 正弦 x。剩下的余弦平方，换成一减正弦平方。'),
 ('C02', 'odd', 'c_point', '令 u = sin x：∫(1 − u²) du = sin x − ⅓sin³x + C。', '令 u 等于正弦 x，就变成一减 u 方的积分。结果是正弦 x，减三分之一正弦三次方 x，加 C。'),
 ('G01', 'odd', 'gp_explain', '∫sin⁵x cos²x dx 也一样：剥一个 sin x，令 u = cos x。', '正弦五次方乘余弦平方，也一样。剥出一个正弦 x，令 u 等于余弦 x。'),
 ('H02', 'even', 'h_base', '那 ∫sin²x dx 呢？两个都是偶数，没得剥。', '那正弦平方的积分呢？次数是偶数，没得剥了。'),
 ('C03', 'even', 'c_explain', '偶次幂就降幂：sin²x = (1 − cos 2x)/2。', '偶次幂，就用降幂公式。正弦平方，等于二分之一，括号一减余弦二 x。'),
 ('C04', 'even', 'c_point', '∫₀^π sin²x dx = π/2：曲线在 ½ 上下对称，面积正好是矩形的一半。', '所以正弦平方从零积到派，等于二分之派。曲线在二分之一上下对称，面积正好是矩形的一半。'),
 ('G02', 'even', 'gp_point', 'sin⁴x 降两次：3x/8 − ¼sin 2x + (1/32)sin 4x + C。', '正弦四次方，就降两次幂。得八分之三 x，减四分之一正弦二 x，加三十二分之一正弦四 x，再加 C。'),
 ('H03', 'tree', 'h_calc', '我记成一句：偶次就降幂，奇次就剥一个。', None),
 ('C05', 'tree', 'c_ok', '先看谁是奇次，剥谁；都是偶次，就降幂。', None),
 ('C06', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', '∫₀^(π/2) sin x cos²x dx = ？', '正弦 x 乘余弦平方，从零积到二分之派，等于多少？'),
 ('H04', 'quiz', 'h_calc', 'sin x 是奇次，令 u = cos x，得 1/3！', '正弦是奇次，令 u 等于余弦 x，得三分之一！'),
 ('C08', 'outro', 'c_ok', '奇次剥一个，偶次降幂。', None),
 ('C09', 'outro', 'c_explain', '下一段：Gemini 来看 tan、sec 和积化和差。', '下一段：Gemini 来看正切、正割，和积化和差。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
