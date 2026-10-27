# -*- coding: utf-8 -*-
# P1《高中速通》台词源：id, 块, 立绘, 字幕稿, 朗读稿（None = 同字幕）。运行后写 script.json / web/lines.js / web/lines.json
import json, re
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 # ---- intro ----
 ('D01', 'intro', 'd_raise', '高中的函数还要再讲一遍？我可都会！', None),
 ('C01', 'intro', 'c_cool', '那就速通：五关，每关半分钟，过一关盖一个章。', None),
 # ---- 第1关 定义域（A08）----
 ('C02', 'domain', 'c_explain', '第一关，定义域。没写定义域时，默认取让式子有意义的最大集合，叫自然定义域。', '第一关，定义域。题目没写定义域时，默认取让式子有意义的最大集合，叫自然定义域。'),
 ('C03', 'domain', 'c_point', '根号下 ≥ 0：x ≤ 4；分母 ≠ 0：x ≠ 1；对数里 > 0：x > −2。', '根号下不能为负，x 小于等于四；分母不能为零，x 不等于一；对数里面要大于零，x 大于负二。'),
 ('C04', 'domain', 'c_ok', '三条取交集：(−2, 1) ∪ (1, 4]。', '三个条件取交集：负二到四，左开右闭，再挖掉一。'),
 # ---- 第2关 表示法（A05）+ 千问 ----
 ('C05', 'rep', 'c_explain', '第二关，表示法。同一个平方函数，可以用文字、表格、图像、公式四种方式来写。', None),
 ('G01', 'rep', 'gp_point', '还有第五种：代码。x => x * x，也是它。', '还有第五种，代码。x 映射到 x 乘 x，也是它。'),
 ('Q01', 'rep', 'q_point', '我来归档！文字给人读，表格存数据，图像看趋势，公式能推导，代码能运行。', None),
 ('Q02', 'rep', 'q_tea', '五张名片，背后是同一个对应关系。', None),
 ('C06', 'rep', 'c_point', '判断一条曲线是不是函数图像，用竖线检验：每条竖线最多碰到一个点。', None),
 # ---- 第3关 基本初等函数（A06）----
 ('C07', 'family', 'c_explain', '第三关，基本初等函数。一次、二次、三次、根号、反比例，', None),
 ('C08', 'family', 'c_explain', '然后是指数、对数，正弦、余弦、正切。', None),
 ('D02', 'family', 'd_think', '这么多，记不住怎么办？', None),
 ('G02', 'family', 'gp_explain', '只看三件事：过哪个定点，往哪边增长，有没有渐近线。', None),
 # ---- 第4关 图像变换（A07）----
 ('C09', 'trans', 'c_explain', '第四关，图像变换。f(x − h)：右移 h；f(x) + k：上移 k。', '第四关，图像变换。f 括号里 x 减去 h，图像向右平移 h 个单位；f x 再加上 k，图像向上平移 k 个单位。'),
 ('C10', 'trans', 'c_point', 'f(x) 前面乘 a（a > 1）：竖着拉伸；x 乘 b（b > 1）：横着压缩；前面加负号：上下翻过来。', 'f x 前面乘上 A，A 大于一时，曲线竖着拉伸；括号里的 x 乘上 B，B 大于一时，横着压缩；前面再加负号，就上下翻过来。'),
 ('D03', 'trans', 'd_panic', '等等，减 h 为什么反而往右？', '等等，为什么减 h，反而往右？'),
 ('C11', 'trans', 'c_explain', '原来在 x = 0 的点，现在要 x = h，括号里才等于 0：整条曲线晚 h 格出现，就是右移。', '原来在 x 等于零的点，现在要 x 等于 h，括号里才等于零。所以整条曲线要晚 h 格才出现，也就是向右平移。'),
 # ---- 第5关 指数与对数 ----
 ('C12', 'explog', 'c_explain', '第五关，指数与对数。同底相乘，指数相加；乘方再乘方，指数相乘。', '第五关，指数与对数。同底数相乘，指数相加；乘方再乘方，指数相乘。'),
 ('C13', 'explog', 'c_point', '对数把乘法变成加法：log(xy) = log x + log y。', '对数把乘法变成加法：x y 的对数，等于 x 的对数加 y 的对数。'),
 ('G03', 'explog', 'gp_proud', '一句话记住：对数就是指数倒过来。为什么能倒过来，后面讲反函数（P4）时再说。', '一句话记住：对数就是指数倒过来。为什么能倒过来，后面讲反函数时再说。'),
 # ---- 随堂三连 ----
 ('C14', 'quiz', 'c_cool', '随堂三连，每道题三秒。', None),
 ('C15', 'quiz', 'c_point', '第一题：y = 1/√(x − 3)，定义域是什么？', '第一题：一除以根号下 x 减三，定义域是什么？'),
 ('C16', 'quiz', 'c_ok', 'x > 3。根号下要非负，又不能让分母为零，所以严格大于三。', 'x 大于三。根号下要非负，又不能让分母为零，所以严格大于三。'),
 ('C17', 'quiz', 'c_point', '第二题：y = (x + 2)²，抛物线往哪边移？', '第二题：y 等于，x 加二，整体的平方。抛物线往哪边移？'),
 ('D04', 'quiz', 'd_happy', '往左两格！刚学的，括号里加就往左。', None),
 ('C18', 'quiz', 'c_point', '第三题：log₂8 等于几？', '第三题：以二为底八的对数，等于几？'),
 ('D05', 'quiz', 'd_sparkle', '三！因为 2³ = 8。', '三！因为二的三次方等于八。'),
 # ---- 收束 ----
 ('C19', 'outro', 'c_cool', '五关全过，高中部分到此为止。', None),
 ('C20', 'outro', 'c_explain', '但我们一直在说“对应关系”，它到底是什么？下一段，用大学的语言重新定义函数：映射。', None),
]
if __name__ == '__main__':
    lines = [dict(id=i, b=b, spk=i[0], pose=p, sub=s, tts=t or s) for i, b, p, s, t in L]
    (EP / 'script.json').write_text(json.dumps({l['id']: [l['tts']] for l in lines}, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.json').write_text(json.dumps(lines, ensure_ascii=False, indent=1), encoding='utf-8')
    (EP / 'web' / 'lines.js').write_text('// 由 p1/lines_src.py 生成的台词表（字幕稿）\nwindow.LINES = ' + json.dumps(lines, ensure_ascii=False) + ';\n', encoding='utf-8')
    n = sum(len(re.sub(r'[\s，。、？！：；“”（）()·,.?!:;—]', '', l['sub'])) for l in lines)
    print(len(lines), 'lines', n, 'chars (subtitle, no punct)', '≈', round(n / 330, 2), 'min @330')
