# -*- coding: utf-8 -*-
# 第 8 章 P6《平面薄片的形心》台词源（11-12，不审）。客串：GLM（Z，书卷气）。Stewart 8.3 Example 4、6。
# 核算（sympy）：半圆 ȳ = 4R/(3π) ≈ 0.424R；y = x 与 y = x² 之间：A = 1/6，(x̄, ȳ) = (1/2, 2/5)；随堂 y = x²，0 ≤ x ≤ 1：x̄ = 3/4（ȳ = 3/10）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('Z01', 'balance', 'z_base', '一本书顶在指尖上，不倒。指尖下面那一点，就是形心。', None),
 ('C01', 'balance', 'c_explain', '密度均匀的薄片，质心只由形状决定，叫形心。', '密度均匀的薄片，质心只由形状决定，叫做形心。'),
 ('C02', 'strip', 'c_point', '切成竖条：宽 dx，高 f(x)，面积 f(x)dx。', '把它切成竖条。宽是 dx，高是 f x，面积是 f x 乘 dx。'),
 ('C03', 'strip', 'c_explain', '每一条的质心在它的正中间：(x, f(x)/2)。', '每一条的质心，就在它的正中间。横坐标是 x，纵坐标是 f x 的一半。'),
 ('G01', 'strip', 'gp_point', '于是 x̄ = (1/A)∫ x f(x) dx，ȳ = (1/A)∫ ½f(x)² dx。', '于是，横坐标是 x 乘 f x 的积分除以面积。纵坐标是二分之一 f 方的积分除以面积。'),
 ('Z02', 'strip', 'z_deal', '离散的求和，换成积分。和上一段一模一样。', None),
 ('C04', 'example', 'c_explain', '例：y = x 和 y = x² 围成的区域。', '例如，y 等于 x，和 y 等于 x 方围成的区域。'),
 ('C05', 'example', 'c_point', '面积 1/6。两条曲线之间，竖条高 x − x²。', '面积是六分之一。两条曲线之间，竖条的高是 x 减 x 方。'),
 ('G02', 'example', 'gp_explain', '算出形心 (1/2, 2/5)。注意，它不在对称的正中间。', '算出形心，是二分之一，五分之二。注意，它不在上下的正中间。'),
 ('Z03', 'semi', 'z_base', '再看半圆：对称，所以 x̄ = 0。', '再看半圆。它左右对称，所以横坐标是零。'),
 ('C06', 'semi', 'c_explain', 'ȳ = 4R/(3π) ≈ 0.42R，比一半低：底部更宽更重。', '纵坐标是三派分之四 R，大约零点四二 R。比一半低，因为底部更宽。'),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', 'y = x² 下方，0 ≤ x ≤ 1 的区域，x̄ = ？', 'y 等于 x 方下方，从零到一的区域，形心横坐标是多少？'),
 ('D01', 'quiz', 'd_sparkle', '∫x³ / ∫x² = (1/4)/(1/3) = 3/4！偏向右边。', '四分之一除以三分之一，等于四分之三！偏向右边。'),
 ('C09', 'outro', 'c_ok', '形心：竖条加权平均，ȳ 用 ½f²。', '形心，就是竖条的加权平均。纵坐标用二分之一 f 方。'),
 ('C10', 'outro', 'c_explain', '下一段：MiniMax 转一个甜甜圈，帕普斯定理。', '下一段，MiniMax 转一个甜甜圈，讲帕普斯定理。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
