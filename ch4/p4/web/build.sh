#!/usr/bin/env bash
# 第 4 章 P4：同步共享内核 → 生成台词表 → 处理实测配音 → 逐帧渲染 → 混音与编码。
set -eo pipefail
cd "$(dirname "$0")"
PY=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
export EP_DIR="$(cd .. && (pwd -W 2>/dev/null || pwd))"
export PYTHONIOENCODING=utf-8
"$PY" ../lines_src.py
cp ../../shared/core.js core.js
cp ../../shared/kit.js kit.js
cat ../../shared/c2kit.js ../../shared/c3kit.js ../../shared/c4kit.js > scenes0_kit.js
cp ../../shared/render.py render.py
mkdir -p out sprites fonts
cp -f ../../sprites/*.webp sprites/
cp -f ../../web/fonts/* fonts/
[ "${SKIP_PREP:-0}" = 1 ] || "$PY" ../../web/prep.py
uv run --quiet --with playwright --with pillow python render.py --channel chrome "$@" 2>&1 | grep -v "GET /"
[ -n "$*" ] && exit 0   # 带参数（如 --sheet）时只出联系表
"$PY" ../../web/mix.py
OUT="out/AI娘微积分课_第4章_P4_恒等式与不等式.mp4"
ffmpeg -loglevel error -y -i out/video.mp4 -i out/mix.wav -c:v copy -c:a aac -b:a 192k -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -shortest "$OUT"
ffmpeg -loglevel error -y -i "$OUT" -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k out/preview_720p.mp4
ls -lh out
