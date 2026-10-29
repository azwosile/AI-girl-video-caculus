# -*- coding: utf-8 -*-
# 第 5 章 P7《基本定理（一）：面积函数》台词源（10-29，Stewart 5.3 FTC1，例 1/2/3 菲涅耳函数）。客串：Gemini（M）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('D01', 'g', 'd_curious', '如果积分的上限不固定，让它变成 x 呢？', None),
 ('C01', 'g', 'c_explain', '那积分就成了 x 的函数：g(x) = ∫ₐˣ f(t) dt，叫面积函数。', '那积分就成了 x 的函数，叫面积函数：从 a 积到 x。'),
 ('C02', 'g', 'c_point', '右边界往右推，面积跟着变：f 为正时 g 增加，f 为负时 g 减少。', None),
 ('D02', 'g', 'd_think', '那 g 长得多快？', None),
 ('C03', 'deriv', 'c_explain', '右边界多推一点点 h，多出一条细长条：面积 ≈ f(x)·h。', '右边界多推一点点 h，就多出一条细长条，面积大约是 f 在 x 的值，乘以 h。'),
 ('C04', 'deriv', 'c_point', '所以 g′(x) = lim [g(x + h) − g(x)]/h = f(x)。', '所以 g 的导数，正好等于 f。'),
 ('M01', 'deriv', 'm_cheeky', '面积函数的导数就是原来的函数！这是一个极其漂亮的结论！', None),
 ('C05', 'deriv', 'c_ok', '这次你说对了。这就是微积分基本定理第一部分：f 连续，则 g′(x) = f(x)。', '这次你说对了。这就是微积分基本定理的第一部分：只要 f 连续，g 的导数就是 f。'),
 ('C06', 'ex', 'c_explain', '例：d/dx ∫₀ˣ √(1 + t²) dt = √(1 + x²)，直接把 t 换成 x。', '例如：根号一加 t 平方，从零积到 x，对 x 求导，就是根号一加 x 平方，直接把 t 换成 x。'),
 ('M02', 'ex', 'm_base', '菲涅耳函数 S(x) = ∫₀ˣ sin(πt²/2) dt 没有初等原函数，导数照样是 sin(πx²/2)！', '还有菲涅耳函数，它没有初等的原函数，可导数照样能写出来：正弦二分之派 x 平方！'),
 ('C07', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', 'd/dx ∫₁ˣ (t³ + 1) dt = ？', 't 的立方加一，从一积到 x，对 x 求导等于多少？'),
 ('D03', 'quiz', 'd_sparkle', 'x³ + 1！', 'x 的立方加一！'),
 ('C09', 'outro', 'c_ok', '对。这一段：面积函数的导数就是被积函数，g′(x) = f(x)。', '对。这一段：面积函数的导数，就是被积函数。'),
 ('C10', 'outro', 'c_cool', '下一段：变限积分求导。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
