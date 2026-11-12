# -*- coding: utf-8 -*-
# 第 7 章 P6《三角代换进阶与配方》台词源（11-12，不审）。客串：Mistral（R，修路）。Stewart 7e §7.3 例 3、例 7。
# 核算（sympy，求导回原式）：−√(x²+4)/(4x)；−√(3−2x−x²) − arcsin((x+1)/2)；½arctan((x+1)/2)。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('C01', 'tan', 'c_explain', '∫dx/(x²√(x² + 4))：根号里是 x² + a²，令 x = 2 tan θ。', '看这道题，x 方乘根号 x 方加四，分之一。根号里是 x 方加 a 方的样子，所以令 x 等于二正切西塔。'),
 ('C02', 'tan', 'c_point', '√(x² + 4) = 2 sec θ，dx = 2sec²θ dθ，化成 ¼∫cos θ/sin²θ dθ。', '这样根号 x 方加四，变成二正割西塔。dx 等于二正割平方 d 西塔。整理后，是四分之一，乘余弦除以正弦平方的积分。'),
 ('G01', 'tan', 'gp_explain', '令 u = sin θ，得 −1/(4 sin θ) + C。', '再令 u 等于正弦西塔，得到负的四倍正弦西塔分之一，加 C。'),
 ('C03', 'back', 'c_explain', '换回 x：画直角三角形，对边 x，邻边 2，斜边 √(x² + 4)。', '最后要换回 x。画一个直角三角形，对边是 x，邻边是二，斜边就是根号 x 方加四。'),
 ('C04', 'back', 'c_point', 'sin θ = x/√(x² + 4)，答案是 −√(x² + 4)/(4x) + C。', '正弦西塔等于 x 除以根号 x 方加四。所以答案是，负的四 x 分之根号 x 方加四，加 C。'),
 ('R01', 'square', 'r_point', '∫x dx/√(3 − 2x − x²)，根号里乱七八糟。路不平，先配方修路！', '这道题，根号里是三减二 x，再减 x 的平方，乱七八糟。路不平，先配方修路！'),
 ('C05', 'square', 'c_explain', '3 − 2x − x² = 4 − (x + 1)²。抛物线平移一下，就是 a² − u² 的形状。', '三减二 x，再减 x 的平方，可以写成四，减去括号 x 加一的平方。抛物线平移一下，就是 a 方减 u 方的形状。'),
 ('C06', 'square', 'c_point', '令 x + 1 = 2 sin θ，得 −√(3 − 2x − x²) − arcsin((x + 1)/2) + C。', '令 x 加一等于二正弦西塔。最后得到负根号三减二 x 减 x 方，减反正弦二分之 x 加一，加 C。'),
 ('R02', 'square', 'r_base', '修好路，车就开得动了。', None),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', '∫dx/(x² + 2x + 5) = ？', 'x 方加二 x 加五，分之一，积分是多少？'),
 ('R03', 'quiz', 'r_point', '配方：(x + 1)² + 4。得 ½arctan((x + 1)/2) + C！', '先配方，等于 x 加一的平方加四。得二分之一，反正切二分之 x 加一，加 C！'),
 ('C09', 'outro', 'c_ok', '三角代换靠三角形换回；根号不规整，先配方。', None),
 ('C10', 'outro', 'c_explain', '下一段：GLM 带大家拆部分分式。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
