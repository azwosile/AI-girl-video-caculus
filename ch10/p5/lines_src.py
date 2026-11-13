# -*- coding: utf-8 -*-
# 第 10 章 P5《旋转曲面面积》台词源（11-13，不审）。客串：千问（Q）。Stewart 10.2 例 6（编号待第九版核对，台词不念编号）。
# 核对：半圆 x = r cos t，y = r sin t，0 ≤ t ≤ π：ds = r dt，S = ∫2πr sin t · r dt = 4πr²；摆线一拱绕 x 轴 64πr²/3；半径 2 ⇒ 16π（verify10.py）。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('Q01', 'formula', 'q_tea', '把曲线绕轴转一圈，就能做出奶茶杯和珍珠～', '把曲线绕着轴转一圈，就能做出奶茶杯和珍珠啦。'),
 ('C01', 'formula', 'c_explain', '第 8 章的旋转曲面面积：S = ∫2πy ds。', '第八章学过旋转曲面的面积：二派 y 乘以弧长微元，再积分。'),
 ('C02', 'formula', 'c_point', '参数形式只要换掉 ds：ds = √((dx/dt)² + (dy/dt)²) dt。', '参数形式里，只要把弧长微元，换成速度乘以 dt。'),
 ('C03', 'pearl', 'c_explain', '半圆 x = r cos t，y = r sin t，t 从 0 到 π，绕 x 轴转一圈。', '取一个半圆，参数从零走到派，绕横轴转一圈。'),
 ('C04', 'pearl', 'c_point', 'ds = r dt，S = ∫(0→π) 2π·r sin t·r dt = 4πr²：正是球面面积。', '弧长微元是 r 乘 dt。积出来是四派 r 方，正好是球面的面积。'),
 ('Q02', 'pearl', 'q_point', '一颗珍珠的表面积，算出来啦！', '一颗珍珠的表面积，算出来啦！'),
 ('C05', 'cyc', 'c_explain', '摆线一拱绕 x 轴转一圈：S = 64πr²/3。', '摆线的一拱，绕横轴转一圈，面积是三分之六十四派 r 方。'),
 ('D01', 'cyc', 'd_think', '如果绕 y 轴转呢？', '那如果绕纵轴转呢？'),
 ('C06', 'cyc', 'c_ok', '2πy 里的 y 是“到旋转轴的距离”。绕 y 轴转，就换成 2πx。', '二派 y 里面的 y，是到旋转轴的距离。绕纵轴转，就换成二派 x。'),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', '半径为 2 的球面，面积是多少？', '半径为二的球面，面积是多少？'),
 ('D02', 'quiz', 'd_sparkle', '4π 乘 2²，等于 16π！', '四派乘以二的平方，等于十六派！'),
 ('C09', 'outro', 'c_ok', 'S = ∫2π ×（到轴的距离）× ds，ds 用参数写。', '旋转曲面面积，是二派乘到轴的距离，乘弧长微元。弧长微元用参数来写。'),
 ('C10', 'outro', 'c_explain', '下一段：MiniMax 揭晓字体的秘密，Bézier 曲线。', '下一段，MiniMax 揭晓字体的秘密，贝塞尔曲线。'),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
