# -*- coding: utf-8 -*-
# 第 6 章 P7《柱壳法》台词源（11-12，按大纲 v1 直接制作，不审）。客串：Llama（L，慢悠悠：树的年轮）。Stewart 6.3 例 1。
# 读法：π 读“派”；分数读“几分之几”。核算：2π∫₀² (2x³ − x⁴) dx = 2π(8 − 32/5) = 16π/5；∫₀¹ 2πx² dx = 2π/3。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('C01', 'hard', 'c_explain', '新题：y = 2x² − x³ 和 x 轴围成的区域，绕 y 轴转。', '新题：y 等于二 x 方减 x 立方，和 x 轴围成的区域，绕 y 轴转。'),
 ('C02', 'hard', 'c_point', '横着切垫圈？内外半径要从 y = 2x² − x³ 里解出 x：三次方程。', '如果横着切垫圈，内外半径得从这个式子里解出 x，要解三次方程。'),
 ('D01', 'hard', 'd_shock', '三次方程？！求根公式我可不会。', None),
 ('L01', 'shell', 'l_base', '别急。看看树的年轮，一圈一圈，慢慢长。', None),
 ('C03', 'shell', 'c_explain', '顺着转轴切：在 x 处取一层薄壳，半径 x，高 f(x)，厚 dx。', '顺着转轴的方向切。在 x 处取一层薄壳，半径是 x，高是 f x，厚是 d x。'),
 ('L02', 'shell', 'l_base', '把壳剪开、压平，就是一块薄板：长 2πx，高 f(x)，厚 dx。', '把这层壳剪开、压平，就是一块薄板：长是二派 x，高是 f x，厚是 d x。'),
 ('C04', 'shell', 'c_point', '壳的体积 ≈ 2πx·f(x)·dx，加起来：V = ∫ₐᵇ 2πx f(x) dx。', '壳的体积约等于二派 x 乘 f x 乘 d x。加起来，就是二派 x 乘 f x，从 a 积到 b。'),
 ('G01', 'calc', 'gp_explain', 'V = ∫₀² 2πx(2x² − x³) dx = 2π∫₀² (2x³ − x⁴) dx。', '代进去：二派乘以二 x 立方减 x 的四次方，从零积到二。'),
 ('C05', 'calc', 'c_ok', '= 2π(8 − 32/5) = 16π/5。不用解任何方程。', '等于二派乘以八减五分之三十二，也就是五分之十六派。不用解任何方程。'),
 ('L03', 'calc', 'l_base', '一层一层，不慌不忙，就到了。', None),
 ('C06', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', 'y = x 下方、0 ≤ x ≤ 1 的区域绕 y 轴转，用柱壳法怎么写？', 'y 等于 x 下方、x 从零到一的区域，绕 y 轴转，用柱壳法怎么写？'),
 ('D02', 'quiz', 'd_sparkle', '∫₀¹ 2πx·x dx = 2π/3！', '二派 x 乘 x，从零积到一，等于三分之二派！'),
 ('C08', 'outro', 'c_ok', '柱壳法：周长 × 高 × 厚，顺着转轴切。', '柱壳法：周长乘高乘厚，顺着转轴切。'),
 ('C09', 'outro', 'c_explain', '圆盘还是柱壳，怎么选？下一段 GLM 来总结。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
