# -*- coding: utf-8 -*-
# P7《收束》台词源：id, 块, 立绘, 字幕稿, 朗读稿（None = 同字幕）。运行后写 script.json / web/lines.js / web/lines.json
# 朗读稿规则（制作规范 4.3）：数学符号全部写成中文读法；英文名写中文；句首不放单字母 a/o/e；
# 字母 f 后面不要紧跟“复 / 负”（会连读吞字，见 P4 决策记录）；配音前跑 qa/tts_lint.py
import json, re
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 # ---- hook：一章串起来 ----
 ('C01', 'hook', 'c_cool', '第一章最后一段。先把前面串起来：函数、性质、复合与反函数、反三角、指数。', None),
 # ---- elem：初等函数生成树（A35）----
 ('C02', 'elem', 'c_explain', '常数、幂、指数、对数、三角、反三角，这六类叫基本初等函数。', None),
 ('C03', 'elem', 'c_point', '用它们做有限次四则运算和复合，得到的函数都叫初等函数。', None),
 ('C04', 'elem', 'c_ok', '比如 √(1 − x²)、ln(4 − x²)、arcsin 2x、x · sin x，都是初等函数。', '比如根号下一减 x 的平方、自然对数四减 x 的平方、反正弦二 x、x 乘正弦 x，都是初等函数。'),
 ('D01', 'elem', 'd_think', '那第三段的狄利克雷函数呢？', None),
 ('C05', 'elem', 'c_explain', '它不是：有理点取 1，无理点取 0，没法用有限步运算和复合写出来。', '它不是：有理点取一，无理点取零，没法用有限步运算和复合写出来。'),
 ('G01', 'elem', 'gp_point', '分段函数要小心：|x| = √(x²) 是初等函数，但大多数分段函数不是。', '分段函数要小心：x 的绝对值等于根号下 x 的平方，是初等函数；但大多数分段函数不是。'),
 # ---- limit：sin x / x 的洞（A36）----
 ('C06', 'limit', 'c_point', '下一章讲极限。先看一个例子：sin x / x。', '下一章讲极限。先看一个例子：正弦 x 除以 x。'),
 ('C07', 'limit', 'c_explain', 'x = 0 时分母为 0，函数没有定义，图像上有一个洞。', 'x 等于零时，分母为零，函数没有定义，图像上有一个洞。'),
 ('C08', 'limit', 'c_point', '可是 x 越靠近 0，函数值越接近 1：x = 0.1 时约 0.9983，x = 0.01 时约 0.99998。', '可是 x 越靠近零，函数值越接近一：x 等于零点一时，约零点九九八三；零点零一时，约零点九九九九八。'),
 ('D02', 'limit', 'd_curious', '到不了 0，却知道它要往哪儿去？', '到不了零，却知道它要往哪儿去？'),
 ('C09', 'limit', 'c_ok', '对，这正是极限要回答的：不问那一点等于几，只问靠近时往哪去。', None),
 # ---- secant：割线转切线（A37）----
 ('C10', 'secant', 'c_explain', '再看切线：曲线上取两点连成割线，斜率是 Δy / Δx。', '再看切线：曲线上取两点连成割线，斜率是纵坐标的变化除以横坐标的变化。'),
 ('C11', 'secant', 'c_point', '让第二个点不断靠近第一个点，割线就慢慢转成切线。', None),
 ('C12', 'secant', 'c_ok', '可两点合成一点时 Δx = 0，斜率算不出来，又要靠极限。上一段 e 的“斜率为 1”，就是这么来的。', '可两点合成一点时，横坐标的变化等于零，斜率算不出来，又要靠极限。上一段自然常数的斜率为一，就是这么来的。'),
 # ---- ticket：出口票（A38，豆包主持）----
 ('B01', 'ticket', 'b_wave', '家人们！出口票时间到！三道题，每题先自己作答，再揭晓！', None),
 ('B02', 'ticket', 'b_base', '第一题：f(x) = x³ − x，从 ℝ 到 ℝ，是单射吗？是满射吗？', '第一题：f x 等于 x 的三次方减 x，从实数集到实数集，是单射吗？是满射吗？'),
 ('C13', 'ticket', 'c_ok', '不是单射：x = −1、0、1 都映到 0。是满射：曲线两头冲向正负无穷，每个 y 都取得到。', '不是单射：负一、零、一，都映到零。是满射：曲线两头冲向正负无穷，每个 y 都取得到。'),
 ('B03', 'ticket', 'b_base', '第二题：ln(4 − x²) 的定义域是什么？', '第二题：自然对数四减 x 的平方，定义域是什么？'),
 ('C14', 'ticket', 'c_ok', '4 − x² > 0，所以是 (−2, 2)，两端都不取。', '四减 x 的平方大于零，所以是负二到二的开区间，两端都不取。'),
 ('B04', 'ticket', 'b_base', '第三题：arcsin(sin 2) 等于多少？需要我帮你生成答案吗？', '第三题：反正弦套正弦二，等于多少？需要我帮你生成答案吗？'),
 ('C15', 'ticket', 'c_cool', '不用，自己想。2 不在主值区间里，答案是 π − 2。', '不用，自己想。二不在主值区间里，答案是派减二。'),
 ('B05', 'ticket', 'b_proud', '三题全对的家人们，恭喜！错了也没关系，笑着改过来就好～', None),
 # ---- wall：全章术语墙 + 星图（A39、A40）----
 ('C16', 'wall', 'c_explain', '回头看这一墙术语：定义域、值域、单射、满射、有界、奇偶、周期、复合、反函数、主值、e、增长阶。', '回头看这一墙术语：定义域、值域、单射、满射、有界、奇偶、周期、复合、反函数、主值、自然常数、增长阶。'),
 ('C17', 'wall', 'c_point', '每一个，都会在后面的极限、导数、积分里再见到。', None),
 ('G02', 'wall', 'gp_proud', '第一章，我已经稳稳地接住了。', None),
 ('D03', 'wall', 'd_sparkle', '我……我先回去把出口票再做一遍！', '我，我先回去把出口票再做一遍！'),
 # ---- outro ----
 ('C18', 'outro', 'c_cool', '下一章：极限。我们下一章见。', None),
]
if __name__ == '__main__':
    lines = [dict(id=i, b=b, spk=i[0], pose=p, sub=s, tts=t or s) for i, b, p, s, t in L]
    (EP / 'web').mkdir(exist_ok=True)
    (EP / 'script.json').write_text(json.dumps({l['id']: [l['tts']] for l in lines}, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.json').write_text(json.dumps(lines, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.js').write_text('// 由 p7/lines_src.py 生成的台词表（字幕稿）\nwindow.LINES = ' + json.dumps(lines, ensure_ascii=False) + ';\n', encoding='utf-8')
    n = sum(len(re.findall(r'[\u4e00-\u9fff]', l['tts'])) for l in lines)
    print(len(lines), 'lines', n, '汉字（朗读稿）≈', round(n / 276, 2), 'min 人声 @276')
