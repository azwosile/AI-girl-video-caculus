# -*- coding: utf-8 -*-
# 第 8 章 P3《参数方程的弧长：摆线》台词源（11-12，不审）。客串：Mistral（R，骑士车轮）。同济补充。
# 核算（sympy）：摆线 x = a(t − sin t)，y = a(1 − cos t)：√(x′² + y′²) = 2a sin(t/2)（0 ≤ t ≤ 2π），一拱 8a；
# 圆 2πr；x = t²，y = t³（0 ≤ t ≤ 1）：∫ t√(4 + 9t²) dt = (13√13 − 8)/27 ≈ 1.440。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('C01', 'param', 'c_explain', '曲线也可以用参数写：x = x(t)，y = y(t)。', '曲线也可以用参数来写。x 是 t 的函数，y 也是 t 的函数。'),
 ('C02', 'param', 'c_point', '这时一小段弧长 ds = √(x′(t)² + y′(t)²) dt。', '这时，一小段弧长 ds，等于根号下 x 撇方加 y 撇方，再乘 dt。'),
 ('G01', 'param', 'gp_point', '先检验：圆 x = r cos t，y = r sin t，根号里是 r²，积一圈得 2πr。', '先检验一下。圆的参数方程，根号里正好是 r 方。积一圈，得到二派 r。'),
 ('R01', 'cyc', 'r_point', '骑士的车轮滚一圈，轮缘上这一点画出的曲线，叫摆线！', '骑士的车轮滚一圈。轮缘上这一点，画出的曲线叫摆线！'),
 ('C03', 'cyc', 'c_explain', '摆线：x = a(t − sin t)，y = a(1 − cos t)。', '摆线的方程是，x 等于 a 乘 t 减正弦 t，y 等于 a 乘一减余弦 t。'),
 ('C04', 'cyc', 'c_point', '√(x′² + y′²) = a√(2 − 2cos t)。', '根号里，是 a 方乘二减二余弦 t。'),
 ('C05', 'cyc', 'c_explain', '半角公式：开出来是 2a sin(t/2)。', '用半角公式，开出来是二 a 乘正弦二分之 t。'),
 ('G02', 'cyc', 'gp_explain', '一拱：L = ∫₀^{2π} 2a sin(t/2) dt = 8a。', '一拱的弧长，从零积到二派，等于八 a。'),
 ('R02', 'cyc', 'r_base', '车轮周长才 2πa ≈ 6.28a，轮缘上一点却走了 8a！', '车轮周长才二派 a，大约六点二八 a。轮缘上的一点，却走了八 a！'),
 ('D01', 'cyc', 'd_curious', '这个点走的路，比车轮滚过的路还长？', None),
 ('C06', 'cyc', 'c_ok', '对。它不光往前走，还要上下翻一个大弧。', None),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', 'x = t²，y = t³，t 从 0 到 1 的弧长？', 'x 等于 t 方，y 等于 t 的三次方。t 从零到一，弧长是多少？'),
 ('D02', 'quiz', 'd_sparkle', '提出 t：∫₀¹ t√(4 + 9t²) dt = (13√13 − 8)/27 ≈ 1.44！', '根号里提出一个 t，再换元。答案大约是一点四四！'),
 ('C09', 'outro', 'c_ok', '参数方程：ds = √(x′² + y′²) dt。', '参数方程的弧长，ds 等于根号下 x 撇方加 y 撇方，乘 dt。'),
 ('C10', 'outro', 'c_explain', '下一段：豆包画一颗心，讲极坐标下的面积。', '下一段，豆包画一颗心，讲极坐标下的面积。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
