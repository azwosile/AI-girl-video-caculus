# -*- coding: utf-8 -*-
# 第 7 章 P2《分部积分进阶：表格法与循环》台词源（11-12，不审）。客串：豆包（B）。Stewart 7e §7.1 例 3、例 4。
# 核算（sympy）：∫x²eˣ = eˣ(x²−2x+2)；∫eˣ sin x = ½eˣ(sin x − cos x)；∫eˣ cos x = ½eˣ(sin x + cos x)。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('B01', 'tab', 'b_proud', '家人们，∫x²eˣ dx，要分部两次，我有一步写完的办法！', '家人们，x 方乘 e 的 x 次方，积分要分部两次。我有一步写完的办法！'),
 ('C01', 'tab', 'c_explain', '表格法：左列 x² 一直求导到 0，右列 eˣ 一直积分。', '这叫表格法。左边一列，把 x 方一直求导，直到零。右边一列，把 e 的 x 次方一直积分。'),
 ('C02', 'tab', 'c_point', '斜着相乘，正负交替：x²eˣ − 2xeˣ + 2eˣ。', '然后斜着相乘，正负交替。第一项是正的 x 方 e 的 x 次方。第二项是负的二 x e 的 x 次方。第三项是正的二 e 的 x 次方。'),
 ('G01', 'tab', 'gp_explain', '合起来：eˣ(x² − 2x + 2) + C。求导验算，正好回到 x²eˣ。', '合起来是 e 的 x 次方，乘括号 x 方减二 x 加二，再加 C。求导验算，正好回到原式。'),
 ('B02', 'loop', 'b_sorry', '家人们，∫eˣ sin x dx 分部两次，又回到自己了！', '家人们，这道更怪！e 的 x 次方，再乘上正弦，分部两次以后，结果又绕回了它自己！'),
 ('C03', 'loop', 'c_explain', '别慌，把它叫做 I。两次分部得到：I = eˣ sin x − eˣ cos x − I。', '别慌。把这个积分叫做 I。两次分部以后，等式右边有三项。第一项，e 的 x 次方乘正弦。第二项，减去 e 的 x 次方乘余弦。第三项，再减一个 I。'),
 ('C04', 'solve', 'c_point', '把 I 移到左边：2I = eˣ(sin x − cos x)。', '把 I 移到左边，二 I 等于 e 的 x 次方，乘括号正弦减余弦。'),
 ('C05', 'solve', 'c_ok', '所以 I = ½eˣ(sin x − cos x) + C。绕回来不是失败，是方程。', '所以 I 等于二分之一 e 的 x 次方，乘括号正弦减余弦，加 C。绕回来不是失败，是一个方程。'),
 ('G02', 'solve', 'gp_point', '注意：第二次分部要和第一次选同类的 u，否则一步退回原式。', '注意，第二次分部，要和第一次选同一类函数当 u。否则会一步退回原式。'),
 ('C06', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', '∫eˣ cos x dx = ？', 'e 的 x 次方乘余弦 x，积分是多少？'),
 ('B03', 'quiz', 'b_proud', '家人们，同样绕一圈：½eˣ(sin x + cos x) + C！', '家人们，同样绕一圈，得二分之一 e 的 x 次方，乘括号正弦加余弦，加 C！'),
 ('C08', 'outro', 'c_ok', '表格法省步骤，循环分部解方程。', None),
 ('C09', 'outro', 'c_explain', '下一段：MiMo 带大家走递推公式的台阶。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
