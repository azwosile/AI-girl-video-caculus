#!/bin/bash
# vsheet.sh pN : 从成片每 5 秒抽一帧拼成 4 列联系表 → ch8/qa/pN_vsheet.jpg
cd /e/AI/AI娘课程/AI娘微积分课/ch8
f=$(ls $1/web/out/AI娘*.mp4 | head -1)
ffmpeg -loglevel error -y -i "$f" -vf "fps=1/5,scale=320:-1,tile=4x5:padding=4" -frames:v 1 -q:v 7 qa/$1_vsheet.jpg && echo ok
