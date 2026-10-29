# -*- coding: utf-8 -*-
# 第 5 章 P11《换元法：凑微分》台词源（10-29，Stewart 5.5 例 1/2/3/4 + 同济 第一类换元法）。客串：Kimi（K）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('K01', 'hook', 'k_read', '我读积分，就像读长篇小说：先找伏笔。被积式里藏着里层函数的导数，那就是伏笔。', None),
 ('C01', 'rule', 'c_explain', '链式法则倒过来：∫ f(g(x)) g′(x) dx = ∫ f(u) du，其中 u = g(x)。', '把链式法则倒过来用：令 u 等于里层函数，被积式就变成 f u d u。'),
 ('C02', 'rule', 'c_point', '关键一步：du = g′(x) dx，把 g′(x) dx 整块“凑”成 du。', '关键一步：d u 等于 g 导 x 乘 d x，把这一整块，凑成 d u。'),
 ('K02', 'ex', 'k_base', '看：∫ 2x√(1 + x²) dx。2x 正是 1 + x² 的导数。', '看这个：二 x 乘根号一加 x 平方。二 x，正是一加 x 平方的导数。'),
 ('C03', 'ex', 'c_explain', '令 u = 1 + x²，du = 2x dx：∫ √u du = (2/3)u^(3/2) + C = (2/3)(1 + x²)^(3/2) + C。', '令 u 等于一加 x 平方，原式变成根号 u 的积分，等于三分之二 u 的二分之三次方，再把 u 换回去。'),
 ('G01', 'ex', 'gp_explain', '验算：对结果求导，(2/3)·(3/2)(1 + x²)^(1/2)·2x = 2x√(1 + x²)。', '验算一下：对结果求导，正好回到二 x 乘根号一加 x 平方。'),
 ('C04', 'more', 'c_point', '缺个常数也能凑：∫ x³ cos(x⁴ + 2) dx，du = 4x³ dx，= (1/4) sin(x⁴ + 2) + C。', '少个常数也能凑：x 立方乘余弦 x 四次方加二。d u 是四 x 立方 d x，结果是四分之一正弦 x 四次方加二。'),
 ('C05', 'more', 'c_explain', '∫ tan x dx = ∫ (sin x / cos x) dx，令 u = cos x，= −ln|cos x| + C。', '正切 x 写成正弦比余弦，令 u 等于余弦 x，结果是负的余弦 x 绝对值的自然对数。'),
 ('K03', 'more', 'k_base', '同济把这叫第一类换元法，也叫凑微分法。', None),
 ('C06', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', '∫ e^(3x) dx = ？', 'e 的三 x 次方，积分是多少？'),
 ('D01', 'quiz', 'd_sparkle', 'u = 3x，du = 3 dx：e^(3x)/3 + C！', '令 u 等于三 x，结果是三分之一 e 的三 x 次方，加 C！'),
 ('C08', 'outro', 'c_ok', '对。这一段：找到里层函数和它的导数，凑成 du，最后换回 x。', None),
 ('C09', 'outro', 'c_cool', '下一段：定积分换元与对称性。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
