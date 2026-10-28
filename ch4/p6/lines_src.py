# -*- coding: utf-8 -*-
# 第 4 章 P6《求导补充：参数方程与莱布尼茨公式》台词源（10-28，按大纲 v1 直接制作；第 3 章大纲答应的同济补充）。客串：MiniMax（N，导演，“咔！”）。
# 读法：cot 读“余切”，π/4 读“四分之派”；eˣ 读“自然常数的 x 次方”；朗读不说“y 撇撇”，说“二阶导数”。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('C01', 'param', 'c_explain', '先补两样求导工具，都是同济教材要求的。第一样：参数方程。', None),
 ('N01', 'param', 'n_base', '咔！看这个镜头：时间码 t 一走，x 和 y 两个演员各走各的，合起来画出一条曲线。', None),
 ('C02', 'param', 'c_point', '斜率 dy/dx，就是两个演员的速度之比：y′(t) ÷ x′(t)。', '曲线的斜率，就是两个演员的速度之比：y 对 t 的导数，除以 x 对 t 的导数。'),
 ('C03', 'param', 'c_explain', '例子：单位圆 x = cos t，y = sin t。斜率是 cos t ÷ (−sin t) = −cot t。', '例子：单位圆，x 等于余弦 t，y 等于正弦 t。斜率是余弦 t 除以负正弦 t，也就是负余切 t。'),
 ('D01', 'param', 'd_sparkle', 't = π/4 时，斜率是 −1！', 't 等于四分之派时，斜率是负一！'),
 ('G01', 'second', 'gp_explain', '二阶导数最容易错：它不是 y″(t) ÷ x″(t)。', '二阶导数最容易错：它可不是，两个二阶导数直接相除。'),
 ('G02', 'second', 'gp_point', '正确做法：把一阶导数 −cot t 再对 t 求导，再除以 x′(t)。π/4 处得 −2√2，错误做法却得 1。',
  '正确做法：把一阶导数负余切 t 再对 t 求导，然后再除以 x 对 t 的导数。在四分之派处，得负二倍根号二；错误做法却得到一。'),
 ('N02', 'second', 'n_base', '这条镜头作废，重拍！', None),
 ('C04', 'leib', 'c_explain', '第二样：莱布尼茨公式，求乘积的 n 阶导数。', None),
 ('C05', 'leib', 'c_point', '(uv)⁽ⁿ⁾ 展开后，系数正好是杨辉三角，和 (a + b)ⁿ 一模一样。', '两个函数乘积的 n 阶导数，展开后，系数正好是杨辉三角，和二项式展开一模一样。'),
 ('N03', 'leib', 'n_base', '同一套系数，两部戏通用，剧本省了一半！', None),
 ('C06', 'leib', 'c_explain', '例子：(x²eˣ)⁽ⁿ⁾。x² 求导三次就变成 0，所以只剩三项。', '例子：x 平方乘自然常数的 x 次方，求 n 阶导数。x 平方求导三次就变成零，所以只剩三项。'),
 ('C07', 'leib', 'c_cool', '结果是 eˣ(x² + 2nx + n(n − 1))。', '结果是：自然常数的 x 次方，乘以 x 平方加二 n x，再加 n 乘 n 减一。'),
 ('C08', 'quiz', 'c_cool', '随堂一题，三秒。', None),
 ('C09', 'quiz', 'c_explain', 'x = t²，y = t³，在 t = 1 处，dy/dx 是多少？', 'x 等于 t 平方，y 等于 t 的立方，在 t 等于一处，斜率是多少？'),
 ('D02', 'quiz', 'd_sparkle', '3t² ÷ 2t = 3t/2，t = 1 时是 3/2！', '三 t 平方除以二 t，等于二分之三 t；t 等于一时，是二分之三！'),
 ('C10', 'outro', 'c_ok', '对。这一段：参数方程看速度之比，乘积的高阶导数看杨辉三角。', None),
 ('N04', 'outro', 'n_base', '两个演员的速度之比，下一段还要出场！', None),
 ('C11', 'outro', 'c_cool', '下一段：柯西中值定理，和洛必达法则。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
