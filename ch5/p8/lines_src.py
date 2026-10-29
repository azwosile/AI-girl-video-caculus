# -*- coding: utf-8 -*-
# 第 5 章 P8《变限积分求导》台词源（10-29，Stewart 5.3 例 4 + 同济 变限积分的极限）。客串：MiMo（T）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('T01', 'hook', 't_base', '上限要是不老实呢？比如，换成 x⁴？', '上限要是不老实呢？比如，换成 x 的四次方。'),
 ('C01', 'chain', 'c_explain', '上限跑到 x⁴ 处。x 动一点，上限动得更快，面积也长得更快。', '上限跑到 x 的四次方。x 动一点，上限动得更快，面积也长得更快。'),
 ('C02', 'chain', 'c_point', '令 u = x⁴：d/dx ∫₁^(x⁴) sec t dt = sec u · du/dx = sec(x⁴)·4x³。', '令 u 等于 x 的四次方，用链式法则：结果是正割 x 四次方，再乘以四 x 立方。'),
 ('G01', 'chain', 'gp_explain', '一般地：d/dx ∫ₐ^v(x) f(t) dt = f(v(x))·v′(x)。上限代进去，再乘上限的导数。', '一般地：把上限代进去，再乘上限的导数。'),
 ('C03', 'both', 'c_explain', '上下限都在动：下限 u(x)、上限 v(x)，d/dx ∫ᵤᵛ f(t) dt = f(v)v′ − f(u)u′。', '上下限都在动：上限代入乘上限导数，减去下限代入乘下限导数。'),
 ('T02', 'both', 't_base', '右边进来的面积加上，左边溜走的减掉。', None),
 ('C04', 'lim', 'c_point', '同济常考：lim(x→0) [∫ 从 cos x 到 1 的 e^(−t²) dt] / x²，是 0/0 型。', '同济常考这种极限：分子是变限积分，分母是 x 平方，零比零型。'),
 ('D01', 'lim', 'd_think', '零比零……第 4 章的洛必达！', '零比零……第四章的洛必达！'),
 ('C05', 'lim', 'c_explain', '分子求导：−e^(−cos²x)·(−sin x) = sin x · e^(−cos²x)；分母求导：2x。', '分子求导，得到正弦 x 乘以 e 的负余弦平方次方；分母求导，是二 x。'),
 ('C06', 'lim', 'c_ok', 'sin x / x → 1，所以极限 = 1/(2e)。', '正弦 x 比 x 趋于一，所以极限是二 e 分之一。'),
 ('C07', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', 'd/dx ∫₀^(x²) cos t dt = ？', '余弦 t，从零积到 x 平方，对 x 求导？'),
 ('D02', 'quiz', 'd_sparkle', 'cos(x²)·2x！', '余弦 x 平方，再乘以二 x！'),
 ('C09', 'outro', 'c_ok', '对。这一段：上限代入，乘上限的导数；下限同理，再减去。', None),
 ('C10', 'outro', 'c_cool', '下一段：牛顿–莱布尼茨公式。', '下一段：牛顿莱布尼茨公式。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
