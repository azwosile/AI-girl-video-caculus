#!/bin/bash
# 第 1 章段间接力：8 段重出 → 首尾抽帧 → 接缝 PSNR
cd /e/AI/AI娘课程/AI娘微积分课; Q=ch1/qa; L=$Q/relay_build.log; : > $L
for p in p0 p1 p2 p3 p4 p5 p6 p7; do bash ch1/$p/web/build.sh > $Q/relay_$p.log 2>&1; echo "$p build $? $(date +%T)" >> $L; done
bash tools/edges.sh 1 >> $L 2>&1
F=($(ls ch1/p*/web/out/AI娘微积分课_第1章_P*.mp4 | sort -V)); mkdir -p $Q/seam
for i in $(seq 0 $((${#F[@]}-1))); do d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${F[$i]}"); echo "P$i dur $d" >> $L
  ffmpeg -loglevel error -y -sseof -0.05 -i "${F[$i]}" -frames:v 1 $Q/seam/last$i.png; ffmpeg -loglevel error -y -i "${F[$i]}" -frames:v 1 $Q/seam/first$i.png; done
for i in $(seq 1 $((${#F[@]}-1))); do j=$((i-1)); echo "seam P$j>P$i $(ffmpeg -i $Q/seam/last$j.png -i $Q/seam/first$i.png -lavfi psnr -f null - 2>&1 | grep -o 'average:[0-9.inf]*')" >> $L; done
echo RELAYDONE >> $L
