#!/usr/bin/env bash
# 微积分课 ch1 一键：裁音 → 渲染 → 混音 → 成片
set -e
cd "$(dirname "$0")"
PY=/e/AI/TTS/GPT-SoVITS-v2pro-20261006nvidia50x0/runtime/python.exe
[ "$SKIP_PREP" = 1 ] || $PY prep.py
uv run --quiet --with playwright --with pillow python render.py --channel chrome "$@" 2>&1 | grep -v "GET /"
$PY mix.py
ffmpeg -loglevel error -y -i out/video.mp4 -i out/mix.wav -c:v copy -c:a aac -b:a 192k -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -shortest "out/AI娘微积分课_第1章_P0预览.mp4"
ls -l out
