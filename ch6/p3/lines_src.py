# -*- coding: utf-8 -*-
# 第 6 章 P3《换个方向：对 y 积分》台词源（11-12，按大纲 v1 直接制作，不审）。客串：Grok（X，“横过来切！”）。Stewart 6.1 例 6。
# 读法：y² 读“y 方”；分数读“几分之几”。核算：竖切 16/3 + 38/3 = 18；横切 ∫₋₂⁴ (−y²/2 + y + 4) dy = 18。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('C01', 'vert', 'c_explain', '课本例 6：直线 y = x − 1 和抛物线 y² = 2x + 6 围成的区域。', '课本例六：直线 y 等于 x 减一，和抛物线 y 方等于二 x 加六，围成的区域。'),
 ('G01', 'vert', 'gp_explain', '竖着切：最左边一段，上下边界都是抛物线。', '竖着切的话，最左边一段，上下边界都是抛物线。'),
 ('C02', 'vert', 'c_point', '过了 x = −1，下边界换成直线。只能拆成两块，分别积分。', '过了 x 等于负一，下边界换成了直线。只能拆成两块，分别积分。'),
 ('D01', 'vert', 'd_think', '两块还都带根号……好麻烦。', None),
 ('X01', 'vert', 'x_angry', '麻烦就别竖着切！横过来切！', None),
 ('X02', 'horiz', 'x_force', '把 x 写成 y 的函数：右边 x = y + 1，左边 x = y²/2 − 3。', '把 x 写成 y 的函数：右边是 x 等于 y 加一，左边是 x 等于二分之 y 方减三。'),
 ('C03', 'horiz', 'c_explain', '横条长 = 右 − 左，宽 = dy。一个式子管到底。', '横条的长度是右减左，宽是 d y。一个式子管到底。'),
 ('C04', 'horiz', 'c_point', '交点：y + 1 = y²/2 − 3，解得 y = −2 和 4。', '交点：令两边相等，解得 y 等于负二和四。'),
 ('G02', 'horiz', 'gp_point', 'A = ∫₋₂⁴ [(y + 1) − (y²/2 − 3)] dy = 18。', '从负二积到四，右减左，结果是十八。'),
 ('X03', 'horiz', 'x_thumb', '一刀搞定。这才叫效率。', None),
 ('C05', 'horiz', 'c_ok', '口诀：竖切上减下，对 x 积；横切右减左，对 y 积。', None),
 ('C06', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C07', 'quiz', 'c_explain', 'y = √x、y = 0、x = 4 围成的区域，对 y 积分怎么写？', 'y 等于根号 x、y 等于零、x 等于四，围成的区域，对 y 积分怎么写？'),
 ('D02', 'quiz', 'd_sparkle', '右边 x = 4，左边 x = y²：∫₀² (4 − y²) dy = 16/3！', '右边是四，左边是 y 方，从零积到二，等于三分之十六！'),
 ('C08', 'outro', 'c_ok', '哪个方向的边界不换，就沿哪个方向切。', None),
 ('C09', 'outro', 'c_explain', '下一段进入体积：MiniMax 像拍 CT 一样，把立体切成薄片。', '下一段进入体积。MiniMax 像拍 CT 一样，把立体切成薄片。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
