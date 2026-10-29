# -*- coding: utf-8 -*-
# 第 5 章 P14《分部积分》台词源（10-29，同济 + Stewart 7.1 例 1/2/5）。客串：豆包（B，先糊弄、笑着道歉）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('C01', 'rule', 'c_explain', '乘积法则倒过来：(uv)′ = u′v + uv′，两边积分：∫ u dv = uv − ∫ v du。', '把乘积法则倒过来，两边积分，就得到分部积分公式：u d v 的积分，等于 u v，减去 v d u 的积分。'),
 ('B01', 'try', 'b_proud', '家人们，∫ x sin x dx 我来！u = sin x，dv = x dx……', '家人们，x 乘正弦 x 的积分，我来！u 选正弦 x，d v 选 x d x……'),
 ('B02', 'try', 'b_proud', '= (x²/2) sin x − ∫ (x²/2) cos x dx……咦，怎么越积越难？', '等于二分之 x 平方乘正弦 x，再减去……咦，怎么越积越难了？'),
 ('B03', 'try', 'b_sorry', '刚才随手选的，对不起啦！', None),
 ('C02', 'try', 'c_explain', '换过来：u = x，dv = sin x dx，于是 du = dx，v = −cos x。', '换过来：u 选 x，d v 选正弦 x d x。'),
 ('C03', 'try', 'c_point', '= −x cos x + ∫ cos x dx = −x cos x + sin x + C。', '结果是负 x 余弦 x，加上正弦 x，再加 C。'),
 ('G01', 'try', 'gp_explain', '选 u 的顺口溜：反、对、幂、三、指——排在前面的优先当 u。', '选 u 有个顺口溜：反、对、幂、三、指，排在前面的，优先当 u。'),
 ('C04', 'more', 'c_explain', '∫ ln x dx：u = ln x，dv = dx，= x ln x − x + C。', '自然对数 x 的积分：u 选自然对数 x，d v 选 d x，结果是 x 乘自然对数 x，减 x，加 C。'),
 ('C05', 'more', 'c_point', '定积分也能分部：∫₀¹ arctan x dx = [x arctan x]₀¹ − ∫₀¹ x/(1 + x²) dx = π/4 − (1/2) ln 2。', '定积分也能分部：反正切 x 从零积到一，结果是四分之派，减去二分之一乘二的自然对数。'),
 ('B04', 'more', 'b_wave', '需要我帮你把这个顺口溜做成表情包吗？', None),
 ('C06', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', '∫ x eˣ dx = ？', 'x 乘 e 的 x 次方，积分是多少？'),
 ('D01', 'quiz', 'd_sparkle', 'u = x，dv = eˣ dx：x eˣ − eˣ + C = (x − 1)eˣ + C！', 'u 选 x：结果是 x 减一，乘 e 的 x 次方，加 C！'),
 ('C08', 'outro', 'c_ok', '对。这一段：∫ u dv = uv − ∫ v du，选 u 看“反对幂三指”。', '对。这一段：分部积分，u d v 等于 u v 减 v d u；选 u，看反对幂三指。'),
 ('C09', 'outro', 'c_cool', '下一段：反常积分初步。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
