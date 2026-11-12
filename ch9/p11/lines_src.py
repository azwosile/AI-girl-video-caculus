# -*- coding: utf-8 -*-
# 第 9 章 P11《伯努利方程》台词源（11-12，不审）。客串：Mistral（R）。同济《高等数学》第七章 7.4。
# 核算：y′ + y = y²，z = 1/y ⇒ z′ − z = −1 ⇒ z = 1 + Ceˣ ⇒ y = 1/(1 + Ceˣ)。y′ + y = y³ ⇒ z = y⁻²。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('R01', 'def', 'r_point', '骑士登场！这条方程右边多了个 yⁿ，看着不是线性的。', '骑士登场！这条方程的右边，多了一个 y 的 n 次方，看起来不是线性的。'),
 ('C01', 'def', 'c_explain', '伯努利方程：y′ + P(x)y = Q(x)yⁿ，n 不等于 0 和 1。', '这就是伯努利方程。y 的导数加 P 乘 y，右边等于 Q 乘以 y 的 n 次方。n 不等于零和一。'),
 ('R02', 'def', 'r_base', '看我变身：令 z = y^(1−n)！', '看我变身！令 z 等于 y 的一减 n 次方！'),
 ('C02', 'def', 'c_point', '两边除以 yⁿ 再换元，它就变成关于 z 的一阶线性方程。', '两边先除以 y 的 n 次方，再换元，它就变成了关于 z 的一阶线性方程。'),
 ('C03', 'ex', 'c_explain', '例：y′ + y = y²，这里 n = 2，令 z = 1/y。', '看例子。y 的导数加 y，等于 y 方。这里 n 等于二，令 z 等于 y 分之一。'),
 ('G01', 'ex', 'gp_explain', 'z′ = −y′/y²，代进去得 z′ − z = −1。', 'z 的导数等于负的 y 导数除以 y 方。代进去，得到 z 的导数减 z，等于负一。'),
 ('C04', 'ex', 'c_point', '用 P7 的积分因子：z = 1 + Ceˣ，所以 y = 1/(1 + Ceˣ)。', '用第七段的积分因子，解出 z 等于一加 C 倍 e 的 x 次方。所以 y 等于它的倒数。'),
 ('R03', 'ex', 'r_point', '一族反向的 S 形曲线，全都从 1 滑向 0！', '一族反过来的 S 形曲线，全都从一滑向零！'),
 ('C05', 'link', 'c_explain', '回看 P6：logistic 方程 dP/dt = kP − (k/M)P²。', '回看第六段的逻辑斯蒂方程。P 的变化率，等于 k 乘 P，减去 M 分之 k 乘 P 方。'),
 ('D01', 'link', 'd_shock', '右边有 P²，这不就是 n = 2 的伯努利方程吗？', '右边有 P 方！这不就是 n 等于二的伯努利方程吗？'),
 ('C06', 'link', 'c_ok', '对。令 z = 1/P，同样能解出那条 S 形曲线。', '对。令 z 等于 P 分之一，同样能解出那条 S 形曲线。'),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', 'y′ + y = y³，该令 z 等于什么？', 'y 的导数加 y，等于 y 的三次方。该令 z 等于什么？'),
 ('D02', 'quiz', 'd_sparkle', 'n = 3，所以 z = y^(1−3) = y⁻²！', 'n 等于三，所以 z 等于 y 的负二次方！'),
 ('C09', 'outro', 'c_ok', '伯努利：z = y^(1−n)，化成一阶线性。', '伯努利方程，令 z 等于 y 的一减 n 次方，就化成一阶线性方程。'),
 ('C10', 'outro', 'c_explain', '下一段：二阶也不怕，Kimi 教你降阶。', '下一段，二阶方程也不怕，Kimi 教你降阶。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
