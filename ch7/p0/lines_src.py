# -*- coding: utf-8 -*-
# 第 7 章 P0《积分擂台》台词源（11-12，按大纲 v1 直接制作，不审）。客串：Grok（X，擂台主持）。
# 核算（sympy）：½sin²x、−½cos²x、−¼cos2x 的导数都是 sin x cos x；½sin²x − (−½cos²x) = ½；−¼cos2x = ½sin²x − ¼。∫₀¹ e^(−x²) dx ≈ 0.7468。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('X01', 'ring', 'x_force', '积分擂台，开打！第一题：∫ sin x cos x dx，谁先答？', '积分擂台，开打！第一题：正弦 x 乘余弦 x，积分是多少？谁先答？'),
 ('D01', 'ring', 'd_sparkle', '本鲸先来！令 u = sin x，答案是 ½sin²x + C！', '本鲸先来！令 u 等于正弦 x。答案是二分之一正弦方 x，加 C！'),
 ('G01', 'ring', 'gp_point', '我令 u = cos x，得 −½cos²x + C。', '我令 u 等于余弦 x，得到负二分之一余弦方 x，加 C。'),
 ('C01', 'ring', 'c_explain', '我用二倍角：sin x cos x = ½sin 2x，得 −¼cos 2x + C。', '我用二倍角公式。正弦乘余弦，等于二分之一正弦二 x。积分得负四分之一余弦二 x，加 C。'),
 ('X02', 'ring', 'x_angry', '三个答案三个样，这是真的吗？', None),
 ('C02', 'check', 'c_point', '画出来看：三条曲线形状一样，只是上下平移。', '画出来看。三条曲线形状一样，只是上下平移。'),
 ('C03', 'check', 'c_explain', '因为 sin²x + cos²x = 1，它们只差常数——加上 C，三个都对。', '因为正弦方加余弦方等于一，它们之间只差一个常数。加上 C，三个都对。'),
 ('X03', 'check', 'x_thumb', '求导验算：三个导数都是 sin x cos x。核实通过！', '求导验算，三个导数都是正弦 x 乘余弦 x。核实通过！'),
 ('D02', 'more', 'd_think', '那以后的题，是不是随便怎么做都行？', None),
 ('C04', 'more', 'c_point', '思路可以不同，但工具得够用。比如：∫ sin³x dx。', '思路可以不同，但工具得够用。比如下一题，正弦 x 的三次方，怎么积？'),
 ('G02', 'more', 'gp_explain', '还有 ∫ dx/(x² − 1)，得先把分式拆开。', '还有 x 方减一分之一，得先把分式拆开。'),
 ('X04', 'more', 'x_force', '压轴题：∫ e^(−x²) dx！', '压轴题：e 的负 x 平方次方，这个积分是多少？'),
 ('D03', 'more', 'd_shock', '这……本鲸写不出来！', None),
 ('C05', 'more', 'c_explain', '这道题谁都写不出初等的答案。不过它的面积，照样能算。', '这道题，谁都写不出初等的答案。不过它下面的面积，我们照样能算。'),
 ('C06', 'more', 'c_ok', '这一章，就往工具箱里一件件加工具。', None),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', '½sin²x 和 −½cos²x 相差多少？', '二分之一正弦方 x，和负二分之一余弦方 x，相差多少？'),
 ('D04', 'quiz', 'd_sparkle', '相差 ½！因为 sin²x + cos²x = 1。', '相差二分之一！因为正弦方加余弦方等于一。'),
 ('C09', 'outro', 'c_ok', '答案长得不一样不要紧，求导一致就都对。', None),
 ('C10', 'outro', 'c_explain', '下一段：Kimi 带大家速通基本积分表。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
