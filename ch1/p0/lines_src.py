# -*- coding: utf-8 -*-
# P0《画不出来的函数》台词源（10-27 按新标准重做：台词与配音沿用已通过的 v2/v3，只重写画面）。
# 字段：id, 块, 立绘, 字幕稿, 朗读稿（None = 同字幕）。运行后写 script.json / web/lines.js / web/lines.json
# 朗读稿规则（制作规范 4.3）：数学符号全部写成中文读法；配音前跑 qa/tts_lint.py
import json, re
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 # ---- open：冷开场 ----
 ('D01', 'open', 'd_happy', '函数？高中早学过啦，不就是 y = x² 那种曲线嘛！', '函数？高中早学过啦，不就是 y 等于 x 平方那种曲线嘛！'),
 ('C01', 'open', 'c_ok', '那你帮我画一个函数。', None),
 ('C02', 'open', 'c_explain', 'x 是有理数，D(x) = 1；x 是无理数，D(x) = 0。', 'x 是有理数，输出一；x 是无理数，输出零。'),
 ('D02', 'open', 'd_think', '这还不简单？在 1 和 0 两条线上点点不就好了。', '这还不简单？在一和零两条线上点点不就好了。'),
 # ---- zoom：A01 无限放大 ----
 ('C03', 'zoom', 'c_point', '那我们放大看看。', None),
 ('C04', 'zoom', 'c_explain', '放大十倍，两条线上都是点；放大一百万倍，还是挤得满满的。', None),
 ('C05', 'zoom', 'c_explain', '任何一小段里，有理数和无理数都密密麻麻，你永远连不成一条线。', None),
 ('C06', 'zoom', 'c_explain', '比如 1 和 1.0001 之间，既有 1.00005 这样的分数，也有 1 + √2/100000 这样的无理数。', '比如一和一点零零零一之间，既有一点零零零零五这样的分数，也有一加十万分之根号二这样的无理数。'),
 ('C07', 'zoom', 'c_cool', '可每个 x 都有唯一的输出。所以，它确实是函数。', None),
 ('D03', 'zoom', 'd_shock', '函数……居然可以画不出来？！', None),
 # ---- history：A02–A03 概念史 ----
 ('G01', 'history', 'gp_proud', '两百多年前，数学家也为这个吵过。', None),
 ('G02', 'history', 'gp_point', '欧拉那时候，函数就是一个解析式。', None),
 ('G03', 'history', 'gp_point', '后来傅里叶发现，无穷多个正弦波叠起来，能拼出带棱角的方波。', None),
 ('G04', 'history', 'gp_explain', '一个式子，居然画出了折角。那“函数”到底该怎么定义？', None),
 ('G05', 'history', 'gp_explain', '狄利克雷干脆说：只要每个 x 对应唯一的 y，就是函数。', None),
 # ---- code：A04 代码窗 ----
 ('G06', 'code', 'gp_point', '顺便说一句，这个函数连电脑都写不出来。', None),
 ('G07', 'code', 'gp_proud', '因为浮点数全是有理数，连 0.1 存进电脑，也是一个分数。', '因为浮点数全是有理数，连零点一存进电脑，也是一个分数。'),
 # ---- outro：收束：映射 ----
 ('C08', 'outro', 'c_explain', '所以在大学里，函数不再是一条曲线，也不只是一个公式，而是一个映射。', None),
 ('C09', 'outro', 'c_point', '映射只关心两件事：输入从哪里来，每个输入去哪里。', None),
 ('C10', 'outro', 'c_cool', '接下来，先把高中学过的速通一遍，再进入真正的大学内容。', None),
]
if __name__ == '__main__':
    lines = [dict(id=i, b=b, spk=i[0], pose=p, sub=s, tts=t or s) for i, b, p, s, t in L]
    (EP / 'web').mkdir(exist_ok=True)
    (EP / 'script.json').write_text(json.dumps({l['id']: [l['tts']] for l in lines}, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.json').write_text(json.dumps(lines, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.js').write_text('// 由 p0/lines_src.py 生成的台词表（字幕稿）\nwindow.LINES = ' + json.dumps(lines, ensure_ascii=False) + ';\n', encoding='utf-8')
    n = sum(len(re.findall(r'[\u4e00-\u9fff]', l['tts'])) for l in lines)
    print(len(lines), 'lines', n, '汉字（朗读稿）≈', round(n / 276, 2), 'min 人声 @276')
