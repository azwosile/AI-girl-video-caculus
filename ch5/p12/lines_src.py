# -*- coding: utf-8 -*-
# 第 5 章 P12《定积分换元与对称性》台词源（10-29，Stewart 5.5 例 7、对称性与例 11）。客串：GLM（Z）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('Z01', 'hook', 'z_deal', '换了货币，就得换价签。换元换了变量，上下限也得跟着换。', None),
 ('C01', 'sub', 'c_explain', '例：∫₀⁴ √(2x + 1) dx。令 u = 2x + 1，du = 2 dx。', '例如：根号二 x 加一，从零积到四。令 u 等于二 x 加一，d u 等于二 d x。'),
 ('C02', 'sub', 'c_point', 'x = 0 时 u = 1，x = 4 时 u = 9：= ∫₁⁹ (1/2)√u du = (1/3)u^(3/2) |₁⁹ = 26/3。', 'x 等于零时，u 等于一；x 等于四时，u 等于九。原式变成二分之一根号 u，从一积到九，结果是三分之二十六。'),
 ('Z02', 'sub', 'z_base', '换完上下限，就不用再换回 x 了，直接结账。', None),
 ('D01', 'sym', 'd_curious', '那积分区间要是关于原点对称呢？', None),
 ('C03', 'sym', 'c_explain', '偶函数 f(−x) = f(x)：∫₋ₐᵃ f dx = 2∫₀ᵃ f dx，两边面积一样。', '如果 f 是偶函数，左右两边面积一样，积分等于零到 a 的两倍。'),
 ('C04', 'sym', 'c_point', '奇函数 f(−x) = −f(x)：∫₋ₐᵃ f dx = 0，正负抵消。', '如果 f 是奇函数，左右正负抵消，积分等于零。'),
 ('G01', 'sym', 'gp_point', '所以 ∫₋₁¹ tan x / (1 + x² + x⁴) dx = 0：分子奇、分母偶，整体是奇函数。', '所以这个吓人的积分，直接等于零：分子正切是奇函数，分母是偶函数，整体是奇函数。'),
 ('Z03', 'sym', 'z_deal', '一眼看出奇偶，省下一整页草稿纸。', None),
 ('C05', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C06', 'quiz', 'c_explain', '∫₋₂² x³ cos x dx = ？', '来看这道：x 的立方，乘余弦 x。从负二积到二，等于多少？'),
 ('D02', 'quiz', 'd_sparkle', 'x³ 奇、cos x 偶，乘积是奇函数：0！', 'x 立方是奇函数，余弦是偶函数，乘积是奇函数：等于零！'),
 ('C07', 'outro', 'c_ok', '对。这一段：定积分换元要换上下限；对称区间先看奇偶。', None),
 ('C08', 'outro', 'c_cool', '下一段：三角代换。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
