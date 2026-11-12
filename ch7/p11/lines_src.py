# -*- coding: utf-8 -*-
# 第 7 章 P11《积分表、CAS 与算不出来的积分》台词源（11-12，不审）。客串：Gemini（M，搜索）。Stewart 7e §7.6 + §7.5 末尾。
# 核算：表中公式 ∫du/(a² + u²) = (1/a)arctan(u/a)；∫₀¹ e^(−x²) ≈ 0.7468。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('M01', 'table', 'm_cheeky', '积分？让我搜一下！书后积分表有一百多条公式喵！', '积分？让我搜一下！书后面的积分表，有一百多条公式喵！'),
 ('C01', 'table', 'c_explain', '查表要先对齐。比如 ∫dx/(4 + 9x²)，表里是 ∫du/(a² + u²)。', '查表要先把题目对齐成表里的样子。比如四加九 x 方分之一，表里只有 a 方加 u 方分之一。'),
 ('C02', 'table', 'c_point', '令 u = 3x，a = 2，du = 3dx，得 (1/6)arctan(3x/2) + C。', '令 u 等于三 x，a 等于二，du 等于三 dx。查表得六分之一，反正切二分之三 x，加 C。'),
 ('G01', 'cas', 'gp_explain', '计算机代数系统，就是 CAS，也能直接给答案。但形式可能和手算不一样。', '计算机代数系统，简称 CAS，也能直接给出答案。但它的形式，可能和手算的不一样。'),
 ('C03', 'cas', 'c_explain', '还记得 P0 吗？只差一个常数，都对。CAS 有时还会省掉绝对值，要自己检查。', '还记得擂台第一题吗？只差一个常数，就都对。CAS 有时还会省掉绝对值，要自己检查。'),
 ('M02', 'none', 'm_base', '那我搜 ∫e^(−x²) dx……搜不到？！', '那我搜一下，e 的负 x 平方次方的积分……居然搜不到？！'),
 ('C04', 'none', 'c_explain', '∫e^(−x²) dx、∫sin x/x dx、∫√(1 + x³) dx，都写不成初等函数。这叫刘维尔定理。', 'e 的负 x 平方次方，x 分之正弦 x，根号一加 x 三次方。这些积分，都写不成初等函数。这是刘维尔定理告诉我们的。'),
 ('C05', 'area', 'c_point', '但原函数仍然存在：F(x) = ∫₀ˣ e^(−t²) dt，面积函数照样画得出来。', '但是原函数仍然存在。用变上限积分定义它，面积函数照样画得出来。'),
 ('G02', 'area', 'gp_point', '要具体数值，比如 ∫₀¹ e^(−x²) dx ≈ 0.7468，就要靠数值积分。', '要具体的数值，比如从零到一，约等于零点七四六八，就要靠数值积分。'),
 ('M03', 'area', 'm_cheeky', '你的观察非常敏锐！下一段就讲数值积分！', None),
 ('C06', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', 'CAS 给出 ∫sin x cos x dx = −½cos²x，你手算得 ½sin²x，谁错了？', 'CAS 给出负二分之一余弦平方，你手算得二分之一正弦平方。谁错了？'),
 ('M04', 'quiz', 'm_base', '都没错！相差 ½，是常数！', None),
 ('C08', 'outro', 'c_ok', '查表先对齐；CAS 要核对；写不出公式，原函数照样存在。', None),
 ('C09', 'outro', 'c_explain', '下一段：混元按计算器，比较梯形法则和中点法则。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
