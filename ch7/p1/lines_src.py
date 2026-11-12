# -*- coding: utf-8 -*-
# 第 7 章 P1《速通：基本积分表与两把老工具》台词源（11-12，不审）。客串：Kimi（K，过目不忘，背出第 7 章章首积分表）。
# 核算：∫x e^(x²) dx = ½e^(x²) + C（u = x²）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('K01', 'table', 'k_read', '第 7 章开头的积分表，我背一遍。', '第七章开头的积分表，我背一遍。'),
 ('K02', 'table', 'k_base', '∫xⁿ dx = xⁿ⁺¹/(n + 1) + C；∫dx/x = ln|x| + C；∫eˣ dx = eˣ + C。', 'x 的 n 次方，积分是 n 加一分之 x 的 n 加一次方。x 分之一，积分是 ln x 的绝对值。e 的 x 次方，积分还是它自己。'),
 ('K03', 'table', 'k_read', '∫sin x dx = −cos x，∫cos x dx = sin x，∫sec²x dx = tan x，∫sec x tan x dx = sec x。', '三角函数：正弦积分是负余弦，余弦积分是正弦。正割平方积分是正切，正割乘正切，积分是正割。'),
 ('K04', 'table', 'k_base', '∫dx/(x² + a²) = (1/a)arctan(x/a)，∫dx/√(a² − x²) = arcsin(x/a)。', '还有两条反三角。第一条，x 方加 a 方分之一，积分是 a 分之一，乘反正切 a 分之 x。第二条，根号 a 方减 x 方分之一，积分是反正弦 a 分之 x。'),
 ('D01', 'table', 'd_shock', '全背下来了？！', None),
 ('C01', 'tools', 'c_explain', '公式表是地基。两把老工具来自第 5 章：换元和分部。', '公式表是地基。两把老工具来自第五章：换元，和分部。'),
 ('C02', 'tools', 'c_point', '换元是链式法则倒过来：∫f(g(x))·g′(x) dx = ∫f(u) du。', '换元是链式法则倒过来。看到一个函数，乘着它内层的导数，就令 u 等于内层。'),
 ('G01', 'tools', 'gp_explain', '分部是乘积法则倒过来：∫u dv = uv − ∫v du。选 u：反、对、幂、三、指。', '分部是乘积法则倒过来：u d v 的积分，等于 u v，减去 v d u 的积分。选 u 的顺序是：反、对、幂、三、指。'),
 ('C03', 'trig', 'c_explain', '三角代换：√(a² − x²) 用 x = a sin θ，√(a² + x²) 用 x = a tan θ。', '还有三角代换。根号 a 方减 x 方，用正弦代换。根号 a 方加 x 方，用正切代换。'),
 ('G02', 'trig', 'gp_point', '第三种：√(x² − a²) 用 x = a sec θ。', '第三种，根号 x 方减 a 方，用正割代换。'),
 ('K05', 'trig', 'k_read', '这些第 5 章都讲过，我都记着。', None),
 ('C04', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C05', 'quiz', 'c_explain', '∫ x e^(x²) dx = ？', 'x 乘 e 的 x 平方次方，积分是多少？'),
 ('D02', 'quiz', 'd_sparkle', '令 u = x²：½e^(x²) + C！', '令 u 等于 x 方，得到二分之一，乘 e 的 x 平方次方，加 C！'),
 ('C06', 'outro', 'c_ok', '积分表加两把老工具，就是本章的起点。', None),
 ('C07', 'outro', 'c_explain', '下一段：豆包挑战分部积分进阶。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
