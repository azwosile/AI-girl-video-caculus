# -*- coding: utf-8 -*-
# 第 9 章 P4《可分离变量方程》台词源（11-12，不审）。客串：GLM（Z）。Stewart 9.3 例 1。
# 核算：dy/dx = x²/y²，y(0) = 2 ⇒ y = ∛(x³ + 8)；dy/dt = ky ⇒ y = y₀e^(kt)；dy/dx = xy，y(0) = 1 ⇒ y = e^(x²/2)。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('Z01', 'sep', 'z_deal', 'y 归 y，x 归 x——先把书分成两摞。', 'y 的归 y，x 的归 x，先把书分成两摞。'),
 ('C01', 'sep', 'c_explain', '形如 dy/dx = g(x)·f(y) 的方程，叫可分离变量方程。', '如果导数能写成，只含x的部分，乘以只含y的部分，就叫可分离变量方程。'),
 ('C02', 'sep', 'c_point', '把 y 移到左边、x 移到右边：dy/f(y) = g(x)dx，两边分别积分。', '把含y的移到左边，含x的移到右边，然后两边分别积分。'),
 ('C03', 'ex', 'c_explain', 'Stewart 例 1：dy/dx = x²/y²，y(0) = 2。', '课本例一。导数等于 x 方除以 y 方，初值是二。'),
 ('C04', 'ex', 'c_point', '分离：y²dy = x²dx。积分：y³/3 = x³/3 + C。', '分离变量，y 方 dy，等于 x 方 dx。两边积分，得到三分之 y 立方，等于三分之 x 立方，加上常数。'),
 ('Z02', 'ex', 'z_base', '代入 y(0) = 2，C = 8/3，所以 y = ∛(x³ + 8)。', '代入初值，常数是三分之八。所以 y 等于 x 立方加八，再开立方。'),
 ('G01', 'ex', 'gp_point', '画到方向场上验证：曲线正好顺着小线段走。', None),
 ('C05', 'exp', 'c_explain', '第 3 章直接给过 y = y₀e^(kt)，现在可以自己推出来。', '第三章直接给过指数增长的公式。现在，我们可以自己推出来。'),
 ('C06', 'exp', 'c_point', 'dy/dt = ky ⇒ dy/y = k dt ⇒ ln|y| = kt + C ⇒ y = y₀e^(kt)。', '分离变量，dy 除以 y，等于 k dt。积分得到 ln y 等于 kt 加常数，所以 y 等于初值乘以 e 的 kt 次方。'),
 ('D01', 'exp', 'd_shock', '等等，除以 y 的时候，y = 0 怎么办？', '等等，除以 y 的时候，如果 y 等于零怎么办？'),
 ('C07', 'exp', 'c_ok', '好问题。y = 0 本身也是一个解，分离时要单独补上。', '好问题。y 恒等于零，本身也是一个解，分离的时候要单独补上。'),
 ('C08', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C09', 'quiz', 'c_explain', 'dy/dx = xy，y(0) = 1，解是什么？', '导数等于 x 乘 y，初值是一，解是什么？'),
 ('D02', 'quiz', 'd_sparkle', 'dy/y = x dx，ln y = x²/2，y = e^(x²/2)！', 'dy 除以 y 等于 x dx。积分得 ln y 等于二分之 x 方，所以 y 等于 e 的二分之 x 方次方！'),
 ('C10', 'outro', 'c_ok', '分离变量：y 归左，x 归右，两边积分。', '分离变量，y 归左边，x 归右边，两边积分。'),
 ('C11', 'outro', 'c_explain', '下一段：千问的奶茶多久能喝？混合问题与冷却定律。', '下一段，千问的奶茶要多久才能喝？我们讲混合问题，和冷却定律。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
