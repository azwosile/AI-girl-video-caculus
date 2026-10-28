# AI娘微积分课

用 AI 娘角色讲微积分的系列动画课。主讲 **Claude**，辅讲 **GPT**，学生 **大肥鱼（DeepSeek 娘）**，其他 AI 娘按知识点客串。

- **教材主线**：Stewart《Calculus: Early Transcendentals》第 7 版；同济《高等数学》第 7 版的差异单独标注。
- **画面**：网页 Canvas 逐帧引擎（`renderAt(t)`）+ 贴纸立绘。底图是深色星空，上面叠加发光数学矢量（3B1B 式）、卡片和代码窗。每个知识点配一个原创的招牌数学动画。
- **声音**：GPT-SoVITS 本地克隆配音。逐句做 ASR 复核，字幕与朗读逐句对应。
- **成片**：在 [Releases](https://github.com/azwosile/AI-girl-video-caculus/releases) 下载（每章一个合集，另附各分段视频）。

## 成片

| 章 | Release | 段数 | 时长 |
|---|---|---|---|
| 第 1 章 · 函数与模型 | [ch1-v1.0](https://github.com/azwosile/AI-girl-video-caculus/releases/tag/ch1-v1.0) | 8（P0–P7） | 27′50″（1669.7 s） |
| 第 2 章 · 极限与导数 | [ch2-v1.0](https://github.com/azwosile/AI-girl-video-caculus/releases/tag/ch2-v1.0) | 10（P0–P9） | 18′16″（1096.3 s） |
| 第 3 章 · 求导法则 | [ch3-v1.0](https://github.com/azwosile/AI-girl-video-caculus/releases/tag/ch3-v1.0) | 11（P0–P10） | 18′23″（1102.7 s） |
| 第 4 章 · 导数的应用 | [ch4-v1.0](https://github.com/azwosile/AI-girl-video-caculus/releases/tag/ch4-v1.0) | 18（P0–P17） | 31′23″（1883.4 s） |

<details><summary>分段明细</summary>

| 段 | 第 1 章 | 时长 | 第 2 章 | 时长 | 第 3 章 | 时长 |
|---|---|---|---|---|---|---|
| P0 | 画不出来的函数 | 84.8 s | 芝诺悖论 | 136.7 s | 齿轮链 | 122.2 s |
| P1 | 高中速通 | 157.7 s | 高中速通：导数 | 129.2 s | 高中速通：求导公式 | 117.5 s |
| P2 | 映射 | 349.8 s | 极限是什么 | 114.7 s | 为什么是 e | 101.2 s |
| P3 | 函数性质 | 306.2 s | 算极限 | 124.8 s | 三角函数的导数 | 93.2 s |
| P4 | 复合与反函数 | 238.1 s | 讨价还价的定义（ε-δ） | 110.2 s | 链式法则 | 119.6 s |
| P5 | 反三角函数 | 180.5 s | 连续与介值定理 | 118.1 s | 隐函数求导 | 107.4 s |
| P6 | 指数、e 与增长 | 198.9 s | 渐近线 | 98.8 s | 对数求导法 | 112.5 s |
| P7 | 收束 | 153.6 s | 导数 | 88.6 s | 指数增长与衰减 | 77.8 s |
| P8 | | | 导函数与可导性 | 98.3 s | 相关变化率 | 91.6 s |
| P9 | | | 收束与出口票 | 77.0 s | 线性化与微分 | 80.7 s |
| P10 | | | | | 收束与出口票 | 78.9 s |

**第 4 章**

| 段 | 内容 | 时长 |
|---|---|---|
| P0 | 区间测速 | 106.6 s |
| P1 | 高中速通 | 95.9 s |
| P2 | 极值与最值 | 118.0 s |
| P3 | 罗尔与拉格朗日 | 116.9 s |
| P4 | 恒等式与不等式 | 105.3 s |
| P5 | 单调凹凸与拐点 | 99.9 s |
| P6 | 参数方程与莱布尼茨公式 | 102.1 s |
| P7 | 柯西中值定理与洛必达法则 | 118.7 s |
| P8 | ∞/∞ 与增长赛跑 | 115.5 s |
| P9 | 其他未定式与第二个重要极限 | 120.4 s |
| P10 | 数列极限 | 89.1 s |
| P11 | 等价无穷小 | 120.2 s |
| P12 | 泰勒公式初步 | 130.6 s |
| P13 | 描绘曲线 | 105.4 s |
| P14 | 优化问题 | 89.6 s |
| P15 | 牛顿法 | 73.1 s |
| P16 | 原函数与不定积分 | 99.1 s |
| P17 | 收束与出口票 | 76.8 s |

</details>

## 目录结构

```
AI娘微积分课/
├─ README.md                 本文件
├─ docs/                     全部文档（导航见 docs/README.md）
│  ├─ 制作规范.md            技术栈、节奏、视觉、数学动画、配音、质检
│  ├─ 课程大纲_第1章.md      8 段分段详案 + 招牌动画 A01–A40（已按实测回填）
│  ├─ 课程大纲_第2章.md      10 段分段详案 + 招牌动画 A41–A80（已按实测回填）
│  ├─ 课程大纲_第3章.md      11 段分段详案 + 招牌动画 A81–A120（已按实测回填）
│  ├─ 课程大纲_第4章.md      18 段分段详案 + 招牌动画 A121–A185
│  ├─ 反馈与决策记录.md      每轮反馈与对应改动
│  ├─ 素材与授权.md          形象、声音、字体、音乐、代码的来源与许可
│  └─ 第1章/                 第 1 章早期文稿
├─ ch1/                      第 1 章工程
│  ├─ shared/                引擎内核 core.js / kit.js
│  ├─ pN/                    分段：lines_src.py（台词源）、script.json、tts_override.json、web/（scenes、build.sh、render.py）
│  ├─ p2/web/sprites/        第 1 章公用立绘
│  ├─ audio/                 音效源（sfx/）与 BGM（music/）
│  ├─ tts_gen.py             配音脚本（两章共用）
│  ├─ qa/                    逐句 ASR 复核（qa_asr.py）与结果、数手抽帧
│  ├─ tools/                 种子比对、联系表、截图等小工具
│  └─ web/                   早期样片工程（已被 p0 取代，留档）
├─ ch2/                      第 2 章工程
│  ├─ shared/                引擎内核 + 第 2 章扩展 c2kit.js
│  ├─ pN/                    分段工程 + PN_台词稿.md（定稿台词、配音后修改）
│  ├─ sprites/               第 2 章公用立绘（含 6 位新角色）
│  ├─ sprites_src/           新角色立绘的参考原图
│  ├─ audio/ref/             新角色参考音 + refs.json
│  ├─ web/                   prep.py（配音转 48k、测时长）、mix.py（混音）、字体
│  └─ qa/                    配音 / ASR / 渲染批处理脚本
├─ ch3/                      第 3 章工程（结构同第 2 章；shared/ 多一个 c3kit.js：齿轮链、分式排版）
│  ├─ pN/                    分段工程 + PN_台词稿.md
│  └─ qa/                    配音、补配、联系表、出片的批处理脚本
├─ ch4/                      第 4 章工程（结构同第 3 章；shared/ 多一个 c4kit.js：速度表、限速牌、第 4 章署名；qa/ 里有批处理脚本）
└─ tools/
   ├─ concat_release.py      把各段成片拼成每章合集（无损，带章节标记）；用法 concat_release.py 3
   └─ gh_release.py          创建 Release 并上传合集与分段；用法 gh_release.py 3
```

**仓库里没有的东西**（见 `.gitignore`）：
- 教材 PDF / PPT：有版权。
- 渲染输出与成片：成片发在 Releases。
- 生成的配音 `vo/`：可以用 `tts_gen.py` 加参考音重新生成。
- 旧版和备份、日志、`build.sh` 每次自动复制的副本。

## 制作流程

每段的流程相同（在 Windows + Git Bash 下）：

```bash
PY=/path/to/GPT-SoVITS/runtime/python.exe
# 1. 台词：lines_src.py → script.json / web/lines.js / web/lines.json
$PY ch2/p3/lines_src.py
# 2. 配音：先启动 GPT-SoVITS api_v2.py（端口 9880；豆包用自训练模型，端口 9881）
cd ch1 && $PY tts_gen.py --ep ../ch2/p3            # 可加 --only ID1 ID2 --force --seed S
# 3. 逐句 ASR 复核（CPU）
QA_DEVICE=cpu $PY qa/qa_asr.py --ep ../ch2/p3     # → ch2/p3/qa_asr.txt
# 4. 出片：先出联系表检查，再完整渲染（Playwright + Chrome 逐帧 → 混音 → ffmpeg）
cd ../ch2/p3/web && bash build.sh --sheet && SKIP_PREP=1 bash build.sh
# 5. 拼合集
$PY tools/concat_release.py 3                       # → release/AI娘微积分课_第3章_合集.mp4
```

依赖：GPT-SoVITS v2Pro、funasr（ASR）、ffmpeg、uv + Playwright（Chrome），以及 Node.js（可选，用于本地预览工具）。

**参考音**：
- 第 2 章新角色（混元、GLM、Mistral、MiMo、Llama、MiniMax）的参考音在 `ch2/audio/ref/`。
- Claude、GPT、大肥鱼、千问、Gemini、Grok、Kimi 的参考音来自同系列的 **AI娘 Git 课** 工程（`tts_gen.py` 按相对路径 `../AI娘GIt课/audio/` 引用）。
- 豆包使用另行训练的 GPT-SoVITS 模型。

## 素材与许可

角色形象、声音、字体、音乐的来源和许可见 [docs/素材与授权.md](docs/素材与授权.md)。要点：
- 角色形象主要来自 [shuaizenge/ai-girls](https://github.com/shuaizenge/ai-girls) 收录的 ZipZipPipe 原作（作者说明允许分享与再创作，没有统一的标准许可证）。DeepSeek 娘设计为 CC BY-NC-SA 4.0，MiMo 娘设计为 CC BY-NC。**因此本项目整体按非商用处理，成片按 CC BY-NC-SA 4.0 分享。**
- 大肥鱼声音来自 ModelScope `YinZilu/da-fei-yu-girl-voice-zh`（CC BY-NC 4.0）。其余声音为平台 TTS 合成的参考音经本地克隆，不使用真人声优的声音。
- BGM：“Easy Lemon” Kevin MacLeod（incompetech.com），CC BY 4.0。字体：得意黑 Smiley Sans，SIL OFL 1.1。
- Claude、GPT、DeepSeek、Gemini 等名称与商标归各自权利人所有。片中是社区同人形象，不代表厂商官方。
