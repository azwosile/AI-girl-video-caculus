# -*- coding: utf-8 -*-
# 第 2 章 P1《高中速通：导数》台词源（10-27 用户授权“不用审，直接做完”；按大纲 P1：四关速通 + 千问客串 + 随堂 + GPT 点破“趋于”）。
# 字段：id, 块, 立绘, 字幕稿, 朗读稿（None = 同字幕）。运行后写 script.json / web/lines.js / web/lines.json
# 朗读稿规则（制作规范 4.3）：数学符号全部写成中文读法；避开单独字母 e、a 和“f”开头的读法。
import json, re
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 # ---- intro：四关地图 ----
 ('D01', 'intro', 'd_happy', '高中导数本鲸学过！就是……忘得差不多了。', None),
 ('C01', 'intro', 'c_explain', '那就速通一遍：四关，每关半分钟。', None),
 # ---- rate：第一关 平均变化率 ----
 ('C02', 'rate', 'c_explain', '第一关，平均变化率：y 的增量除以 x 的增量。', None),
 ('C03', 'rate', 'c_point', '比如 y = x²，x 从 1 走到 3，y 从 1 涨到 9，平均变化率是 8 ÷ 2 = 4。',
  '比如 y 等于 x 平方，x 从一走到三，y 从一涨到九，平均变化率是八除以二，等于四。'),
 ('D02', 'rate', 'd_think', '就是两点连成的割线的斜率嘛。', None),
 # ---- tangent：第二关 瞬时变化率与几何意义 ----
 ('C04', 'tangent', 'c_explain', '第二关，瞬时变化率：让 x 的增量趋于 0，平均变化率逼近的值，就是这一点的导数。',
  '第二关，瞬时变化率：让 x 的增量趋于零，平均变化率逼近的值，就是这一点的导数。'),
 ('C05', 'tangent', 'c_point', '几何上，导数就是切线的斜率：y = x² 在 x = 1 处导数是 2，切线 y = 2x − 1，上一段刚见过。',
  '几何上，导数就是切线的斜率：y 等于 x 平方，在 x 等于一处导数是二，切线是 y 等于二 x 减一，上一段刚见过。'),
 ('G01', 'tangent', 'gp_explain', '切线方程一句话：过切点，斜率等于该点的导数。', None),
 # ---- table：第三关 求导公式（A44） ----
 ('C06', 'table', 'c_explain', '第三关，求导公式。每次都从定义算太慢，常用的要直接记住。', None),
 ('Q01', 'table', 'q_point', '公式表我全包了！常数的导数是 0；x 的 n 次方，导数是 n 乘 x 的 n − 1 次方。',
  '公式表我全包了！常数的导数是零；x 的 n 次方，导数是 n 乘 x 的 n 减一次方。'),
 ('Q02', 'table', 'q_point', '正弦求导得余弦，余弦求导得负正弦；自然指数函数的导数还是它自己；自然对数的导数是 1/x。',
  '正弦求导得余弦，余弦求导得负正弦；自然指数函数的导数还是它自己；自然对数的导数是 x 分之一。'),
 ('Q03', 'table', 'q_tea', '一般的指数函数、对数函数也都在表上。不够的话，再买就是了～', None),
 ('D03', 'table', 'd_sparkle', '千问姐姐好大方！本鲸也要一份！', None),
 # ---- rules：第四关 运算法则与单调性 ----
 ('C07', 'rules', 'c_explain', '第四关，运算法则。和与差的导数，等于导数的和与差。', None),
 ('C08', 'rules', 'c_point', '乘积：前导后不导，加前不导后导。商：上导下不导，减上不导下导，再除以下的平方。', None),
 ('G02', 'rules', 'gp_point', '导数还能看单调：导数大于 0，函数递增；小于 0，函数递减。',
  '导数还能看单调：导数大于零，函数递增；小于零，函数递减。'),
 ('C09', 'rules', 'c_ok', '比如 y = x³ − 3x，求导得到 3x² − 3，在 −1 到 1 之间小于 0，函数在这一段下降。',
  '比如 y 等于 x 的三次方减三 x，求导得到三 x 平方减三，在负一到一之间小于零，函数在这一段下降。'),
 # ---- quiz：随堂两题 ----
 ('C10', 'quiz', 'c_cool', '随堂两题，每题三秒。', '随堂两道题，每道题三秒。'),
 ('C11', 'quiz', 'c_point', '第一题：x³ 在 x = 2 处的导数是多少？', '第一题：x 的三次方，在 x 等于二处的导数是多少？'),
 ('D04', 'quiz', 'd_happy', '导数是 3x²，代入 2，是 12！', '导数是三 x 平方，代入二，是十二！'),
 ('C12', 'quiz', 'c_point', '第二题：y = x² 在 x = 3 处的切线斜率是多少？', '第二题：y 等于 x 平方，在 x 等于三处的切线斜率是多少？'),
 ('Q04', 'quiz', 'q_tea', '导数是 2x，代入 3，斜率是 6～', '导数是二 x，代入三，斜率是六～'),
 # ---- outro：“趋于”从没定义过（A45） ----
 ('G03', 'outro', 'gp_explain', '不过有个漏洞：第二关说 x 的增量趋于 0，可“趋于”到底是什么意思，高中从来没定义过。',
  '不过有个漏洞：第二关说 x 的增量趋于零，可“趋于”到底是什么意思，高中从来没定义过。'),
 ('D05', 'outro', 'd_shock', '啊？本鲸一直以为，趋于就是无限靠近……', None),
 ('C13', 'outro', 'c_cool', '“无限靠近”还只是直觉。把它说清楚，就是这一章的任务。', None),
 ('C14', 'outro', 'c_ok', '下一段，我们来讲：极限到底是什么。', None),
]
if __name__ == '__main__':
    lines = [dict(id=i, b=b, spk=i[0], pose=p, sub=s, tts=t or s) for i, b, p, s, t in L]
    (EP / 'web').mkdir(exist_ok=True)
    (EP / 'script.json').write_text(json.dumps({l['id']: [l['tts']] for l in lines}, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.json').write_text(json.dumps(lines, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.js').write_text('// 由 ch2/p1/lines_src.py 生成的台词表（字幕稿）\nwindow.LINES = ' + json.dumps(lines, ensure_ascii=False) + ';\n', encoding='utf-8')
    n = sum(len(re.findall(r'[\u4e00-\u9fff]', l['tts'])) for l in lines)
    print(len(lines), 'lines', n, '汉字（朗读稿）≈', round(n / 276, 2), 'min 人声 @276')
