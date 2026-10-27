> **注**：本文件写于第 1 章样片阶段（10-26），记录的是 `ch1/web/` 早期样片工程，那套工程已被 `ch1/p0/` 取代。当前目录结构和制作流程见根目录 [README.md](../README.md)。

# 第 1 章 · 样片工程（P0《画不出来的函数》）

管线沿用 AI娘Git课：`renderAt(t)` 网页引擎 → Playwright 逐帧导出 → numpy 混音 → ffmpeg 响度统一。

| 路径 | 作用 |
|---|---|
| `script.json` | 朗读稿（送 TTS，数字已写成汉字）；由 `gen/make_script.py` 生成 |
| `tts_gen.py` | GPT-SoVITS v5 配音；声线直接引用 Git 课参考音（G07_01 / c_ref / dwg_*），`OVERRIDE` 记录逐句换种子 |
| `qa/qa_asr.py` | 逐句 ASR 审核 → `qa/qa_asr.txt`（相似度 < 0.85 标 ⚠） |
| `audio/sfx_calc.py` | 新音效（riser、hum、tinkle、thud、slam、slap、sting、tick、ding_hi/lo、shimmer）+ 深空 BGM |
| `audio/sfx/` | 音效源（Git 课复制 11 个 + 新合成），`prep.py` 转成 `audio/sfx48/` |
| `web/engine.js` | 画面引擎：深空星图 + 发光数学 + 构成主义卡片 + 玻璃代码窗 + 贴纸立绘；A01 无限放大、A02 本轮拼方波、A03 概念史卡片、A04 代码窗、A09 映射粒子流预演 |
| `web/lines.js` | 字幕稿（由 lines.json 生成） |
| `web/build.sh` | 一键：prep → render → mix → 成片 `web/out/AI娘微积分课_第1章_P0预览.mp4` |
| `tools/sheet_local.js` | 无浏览器时用 @napi-rs/canvas 出联系表（仅检查用） |

```bash
PY=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
$PY tts_gen.py && $PY qa/qa_asr.py          # 配音 + 审核（需先启动 api_v2.py，日志重定向到文件）
bash web/build.sh                           # 出片；只改画面时 SKIP_PREP=1 bash web/build.sh
cd web && uv run --with playwright --with pillow python render.py --channel chrome --sheet   # 联系表
```

样片 v1 实测（10-26）：82.2 s · 401 字 · 293 字/分 · 静音 10.4% · 最长空拍 1.1 s · −16.2 LUFS · 20 句 ASR 全部 ≥ 0.91。
