import json
F1 = ['立绘：ZipZipPipe（ai-girls）；DeepSeek 娘：上善无形 + ZipZipPipe（CC BY-NC-SA 4.0）；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）',
      'BGM：“Easy Lemon” Kevin MacLeod (incompetech.com) CC BY 4.0；名称与商标归各自权利人；非官方、非商业学习作品，完整署名见章末']
F2 = ['立绘：ZipZipPipe（ai-girls）；MiMo 娘：甶丶（CC BY-NC）；DeepSeek 娘：上善无形 + ZipZipPipe（CC BY-NC-SA 4.0）；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）',
      'BGM：“Easy Lemon” Kevin MacLeod (incompetech.com) CC BY 4.0；名称与商标归各自权利人；非官方、非商业学习作品，完整署名见章末']
CH = {
 1: dict(n=1, title='函数与模型', segs=['画不出来的函数', '高中速通', '映射', '函数性质', '复合与反函数', '反三角函数', '指数、e 与增长', '收束'],
         next={'tag': '第 2 章', 'name': '极限与导数'}, footer=F1,
         credits=['Claude / GPT 等 AI 娘形象：ZipZipPipe（Pixiv 148186519）；DeepSeek 娘：上善无形 + ZipZipPipe；Gemini 娘立绘：ZipZipPipe。',
                  '作者说明允许分享与再创作，但无统一标准许可证；本片仅按非商用方式使用。',
                  'DeepSeek 娘形象 CC BY-NC-SA 4.0；大肥鱼声音：尹紫鹭幻想社数据集（CC BY-NC 4.0）。',
                  '音乐：“Easy Lemon” Kevin MacLeod (incompetech.com)，Licensed under CC BY 4.0。',
                  'Claude、GPT、Gemini 等名称与商标归各自权利人；本片为非官方、非商业学习作品。']),
 2: dict(n=2, title='极限与导数', segs=['芝诺悖论', '高中速通', '极限是什么', '算极限', 'ε-δ 定义', '连续与介值', '渐近线', '导数', '导函数', '收束'],
         full=['芝诺悖论', '高中速通：导数', '极限是什么', '算极限', '讨价还价的定义（ε-δ）', '连续与介值定理', '渐近线', '导数', '导函数与可导性', '收束与出口票'],
         next={'tag': '第 3 章', 'name': '求导法则'}, footer=F2),
 3: dict(n=3, title='求导法则', segs=['齿轮链', '高中速通', '为什么是 e', '三角导数', '链式法则', '隐函数', '对数求导', '指数增减', '相关变化率', '线性化', '收束'],
         full=['齿轮链', '高中速通：求导公式', '为什么是 e', '三角函数的导数', '链式法则', '隐函数求导', '对数求导法', '指数增长与衰减', '相关变化率', '线性化与微分', '收束与出口票'],
         next={'tag': '第 4 章', 'name': '导数的应用'}, footer=F2),
 4: dict(n=4, title='导数的应用', segs=['区间测速', '高中速通', '极值最值', '中值定理', '证不等式', '单调凹凸', '参数方程', '洛必达', '增长赛跑', '未定式', '数列极限', '等价代换', '泰勒公式', '描绘曲线', '优化问题', '牛顿法', '原函数', '收束'],
         full=['区间测速', '高中速通', '极值与最值', '罗尔与拉格朗日', '恒等式与不等式', '单调、凹凸与拐点', '参数方程与莱布尼茨公式', '柯西中值定理与洛必达法则', '∞/∞ 与增长赛跑', '其他未定式与第二个重要极限',
               '数列极限', '等价无穷小', '泰勒公式初步', '描绘曲线', '优化问题', '牛顿法', '原函数与不定积分', '收束与出口票'],
         next={'tag': '第 5 章', 'name': '积分'}, footer=F2),
 5: dict(n=5, title='积分', segs=['切抛物线', '高中速通', '上和下和', '速度路程', '定积分', '中点性质', '积分中值', '面积函数', '变限求导', '牛-莱公式', '净变化', '凑微分', '定积分换元', '三角代换', '分部积分', '反常积分', '收束'],
         full=['阿基米德切抛物线', '高中速通', '上和与下和', '速度表算路程', '定积分的定义', '中点法则与积分性质', '积分中值定理', '面积函数', '变限积分求导', '牛顿–莱布尼茨公式', '不定积分与净变化', '换元法：凑微分', '定积分换元与对称性', '三角代换', '分部积分', '反常积分初步', '收束与出口票'],
         next={'tag': '第 6 章', 'name': '积分的应用'}, footer=F2, src=4),
}
M = open('relay_module.js', encoding='utf-8').read()
import sys, os
for n, c in CH.items():
    # 源是接力前的内核（提交 b852583 的 chN/shared/core.js），可用 git show 导出后把 SRC_ROOT 指向该目录
    src = open(f"{os.environ.get('SRC_ROOT', '.')}/ch{c.get('src', n)}/shared/core.js", encoding='utf-8').read()
    i = src.index('function finalize() {'); head = src[:i]
    tail = src[i:]; assert tail.rstrip().endswith('}') and tail.count('\nfunction ') == 0, n
    block = '// 章节信息：路线图节点名（segs）、大标题全名（full，可省）、下一章、页脚署名（每段都有）、章末完整署名（credits，可省：省略时取章末段 credits() 的参数）\nconst CHAPTER = ' + json.dumps({k: v for k, v in c.items() if k != 'src'}, ensure_ascii=False, indent=1) + ';'
    open(f'core_ch{n}.js', 'w', encoding='utf-8').write(head + M.replace('/*__CHAPTER__*/', block))
    print(n, len(c['segs']), round(min(175, 1700 / (len(c['segs']) + 1)), 1))
