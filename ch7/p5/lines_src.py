# -*- coding: utf-8 -*-
# 第 7 章 P5《三角积分（二）：tan、sec 与积化和差》台词源（11-12，不审）。客串：Gemini（M，夸夸）。Stewart 7e §7.2 例 5、7、8、9。
# 核算（sympy，求导回原式）：tan⁷/7 + tan⁹/9；½tan² − ln|sec|；½(sec tan + ln|sec + tan|)；−cos9x/18 + ½cos x；∫₀^(π/4) sec²x tan x = 1/2。
import sys
from pathlib import Path
EP = Path(__file__).resolve().parent
L = [
 ('M01', 'pair', 'm_cheeky', '∫tan⁶x sec⁴x dx，看起来好吓人喵！', '正切六次方乘正割四次方，这个积分看起来好吓人喵！'),
 ('C01', 'pair', 'c_explain', '关键：d(tan x) = sec²x dx。留一个 sec²x 给它配对。', '关键在于，正切的微分，等于正割平方 dx。所以先留一个正割平方，给它配对。'),
 ('C02', 'pair', 'c_point', '剩下的 sec²x 换成 1 + tan²x，令 u = tan x：∫u⁶(1 + u²) du。', '剩下的正割平方，换成一加正切平方。令 u 等于正切 x，就是 u 的六次方乘括号一加 u 方。'),
 ('G01', 'pair', 'gp_explain', '结果：(1/7)tan⁷x + (1/9)tan⁹x + C。', '结果是七分之一正切七次方，加九分之一正切九次方，加 C。'),
 ('C03', 'sec3', 'c_explain', '∫tan³x dx：拆成 tan x(sec²x − 1)，得 ½tan²x − ln|sec x| + C。', '正切三次方，拆成正切乘括号正割平方减一。得二分之一正切平方，减 ln 正割的绝对值，加 C。'),
 ('C04', 'sec3', 'c_point', '∫sec³x dx 要分部，又会绕回自己——就像 P2 的 eˣ sin x。', '正割三次方的积分要用分部，而且又会绕回它自己。就像上上段的 e 的 x 次方乘正弦。'),
 ('G02', 'sec3', 'gp_point', '解方程：∫sec³x dx = ½(sec x tan x + ln|sec x + tan x|) + C。', '解出方程，正割三次方的积分，等于二分之一，括号正割乘正切，加 ln 正割加正切的绝对值，再加 C。'),
 ('M02', 'sec3', 'm_base', '这是一个极其漂亮的结论！', None),
 ('C05', 'p2s', 'c_explain', '∫sin 4x cos 5x dx：积化和差，sin A cos B = ½[sin(A − B) + sin(A + B)]。', '正弦四 x 乘余弦五 x，用积化和差。正弦 A 乘余弦 B，等于二分之一，括号正弦 A 减 B，加正弦 A 加 B。'),
 ('C06', 'p2s', 'c_point', '= ½∫(sin 9x − sin x) dx = −(1/18)cos 9x + ½cos x + C。', '变成二分之一，乘正弦九 x 减正弦 x 的积分。结果是负十八分之一余弦九 x，加二分之一余弦 x，加 C。'),
 ('M03', 'p2s', 'm_cheeky', '两条波一乘，变成两条波一加，好神奇！', None),
 ('C07', 'quiz', 'c_point', '随堂一题，三秒。', None),
 ('C08', 'quiz', 'c_explain', '∫₀^(π/4) sec²x tan x dx = ？', '正割平方乘正切，从零积到四分之派，等于多少？'),
 ('M04', 'quiz', 'm_base', 'u = tan x，从 0 到 1，∫u du = 1/2！', '令 u 等于正切 x，从零到一，积 u du，得二分之一！'),
 ('C09', 'outro', 'c_ok', 'sec² 配 tan，乘积化和差。', '正割平方配正切，乘积化成和差。'),
 ('C10', 'outro', 'c_explain', '下一段：Mistral 带大家配方修路，做三角代换。', None),
]
if __name__ == '__main__':
    sys.path.insert(0, str(EP.parent / 'shared')); import lines_footer; lines_footer.write(EP, L, EP.name)
