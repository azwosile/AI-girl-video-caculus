import sys, os
os.chdir(r'E:/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0')
sys.path.insert(0, 'GPT_SoVITS'); sys.path.insert(0, '.')
from text.chinese2 import g2p, text_normalize
for s in ['剪下这一段，沿 y 等于 x 翻折，就得到反正弦函数', '看残差：数据点到拟合曲线的竖直距离。', '直线拟合：残差两头正、中间负', '指数拟合：残差在零上下随机跳']:
    n = text_normalize(s); ph, w2 = g2p(n); print(n); print(' '.join(ph))
