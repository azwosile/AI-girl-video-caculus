#!/usr/bin/env bash
# P7：同步共享内核 → 生成台词表 → 处理实测配音 → 逐帧渲染 → 混音与编码。
set -eo pipefail
cd "$(dirname "$0")"
PY=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
export EP_DIR="$(cd .. && (pwd -W 2>/dev/null || pwd))"
export PYTHONIOENCODING=utf-8
"$PY" ../lines_src.py
cp ../../shared/core.js core.js
cp ../../shared/kit.js kit.js
mkdir -p out sprites fonts
cp -f ../../p2/web/sprites/*.webp sprites/
# 豆包立绘（Seed 拟人，ZipZipPipe）已复制进本项目 sprites_local/（复制自 AI娘 Git 课 ep5，不跨课程目录引用）；来源见 docs/素材与授权.md。
cp -f sprites_local/*.webp sprites/
cp -f ../../web/fonts/* fonts/
[ "${SKIP_PREP:-0}" = 1 ] || "$PY" ../../web/prep.py
uv run --quiet --with playwright --with pillow python render.py --channel chrome "$@" 2>&1 | grep -v "GET /"
"$PY" ../../web/mix.py
OUT="out/AI娘微积分课_第1章_P7_收束.mp4"
ffmpeg -loglevel error -y -i out/video.mp4 -i out/mix.wav -c:v copy -c:a aac -b:a 192k -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -shortest "$OUT"
ffmpeg -loglevel error -y -i "$OUT" -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k out/preview_720p.mp4
ls -lh out