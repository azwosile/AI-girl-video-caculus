# -*- coding: utf-8 -*-
# 第 5 章 P13《三角代换》台词源（10-29，同济 第二类换元法 + Stewart 7.3 例 2 椭圆面积）。客串：Mistral（R）。
# 读法：θ 读“西塔”；π 读“派”。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('R01', 'hook', 'r_point', '骑士绕圆巡逻：令 x = sin θ，根号里的 1 − x² 就变成 cos²θ，根号一下子消失了。', '骑士绕着圆巡逻：令 x 等于正弦西塔，根号里的一减 x 平方，就变成余弦平方，根号一下子消失了。'),
 ('C01', 'ex', 'c_explain', '算 ∫₀¹ √(1 − x²) dx：x = sin θ，dx = cos θ dθ，θ 从 0 到 π/2。', '来算根号一减 x 平方，从零积到一。令 x 等于正弦西塔，d x 等于余弦西塔 d 西塔，西塔从零到二分之派。'),
 ('C02', 'ex', 'c_point', '= ∫₀^(π/2) cos²θ dθ = ∫₀^(π/2) (1 + cos 2θ)/2 dθ = π/4。', '原式变成余弦平方的积分，用二倍角公式降次，结果是四分之派。'),
 ('R02', 'ex', 'r_base', '和 P4 用几何算出的四分之一圆，一模一样。', '和第四段用几何算出的四分之一圆，一模一样。'),
 ('C03', 'three', 'c_explain', '三种根号，三种代换：√(a² − x²) → x = a sin θ；√(a² + x²) → x = a tan θ；√(x² − a²) → x = a sec θ。', '三种根号，对应三种代换。a 平方减 x 平方，用正弦。a 平方加 x 平方，用正切。x 平方减 a 平方，用正割。'),
 ('G01', 'three', 'gp_explain', '记法：画个直角三角形，用勾股定理一看就知道该用哪个。', None),
 ('R03', 'three', 'r_point', '同济把它叫第二类换元法：直接把 x 换成新变量。', None),
 ('C04', 'ell', 'c_explain', '例：椭圆 x²/a² + y²/b² = 1 的面积。上半边 y = (b/a)√(a² − x²)，令 x = a sin θ，面积 = πab。', '再来一个：椭圆的面积。上半边是 a 分之 b，乘根号 a 平方减 x 平方。令 x 等于 a 正弦西塔，算出面积是派 a b。'),
 ('D01', 'ell', 'd_happy', 'a = b 时，就是圆面积 πr²！', 'a 等于 b 的时候，就是圆面积，派 r 平方！'),
 ('C05', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C06', 'quiz', 'c_explain', '∫₀² √(4 − x²) dx = ？', '根号四减 x 平方，从零积到二，等于多少？'),
 ('D02', 'quiz', 'd_sparkle', '半径 2 的四分之一圆：π！', '半径为二的四分之一圆：等于派！'),
 ('C07', 'outro', 'c_ok', '对。这一段：见到 √(a² − x²)、√(a² + x²)、√(x² − a²)，就用三角代换消根号。', '对。这一段：见到这三种根号，就用三角代换，把根号消掉。'),
 ('C08', 'outro', 'c_cool', '下一段：分部积分。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
