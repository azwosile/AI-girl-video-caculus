#!/bin/bash
# relay_chap.sh N : 第 N 章段间接力全段重出 → 首尾抽帧 → 接缝 PSNR → 合集
N=$1; cd /e/AI/AI娘课程/AI娘微积分课; Q=ch$N/qa; mkdir -p $Q/seam; L=$Q/relay_build.log; [ -n "$SKIP" ] || : > $L
for d in $(ls -d ch$N/p[0-9]* | sort -V); do p=$(basename $d); [[ " $SKIP " == *" $p "* ]] && continue; bash $d/web/build.sh > $Q/relay_$p.log 2>&1; echo "$p build $? $(date +%T)" >> $L; done
bash tools/edges.sh $N >> $L 2>&1
F=($(ls ch$N/p*/web/out/AI娘微积分课_第${N}章_P*.mp4 | sort -V))
for i in $(seq 0 $((${#F[@]}-1))); do d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${F[$i]}"); echo "P$i dur $d $(stat -c %y "${F[$i]}" | cut -c1-16)" >> $L
  ffmpeg -loglevel error -y -sseof -0.05 -i "${F[$i]}" -frames:v 1 $Q/seam/last$i.png; ffmpeg -loglevel error -y -i "${F[$i]}" -frames:v 1 $Q/seam/first$i.png; done
for i in $(seq 1 $((${#F[@]}-1))); do j=$((i-1)); echo "seam P$j>P$i $(ffmpeg -i $Q/seam/last$j.png -i $Q/seam/first$i.png -lavfi psnr -f null - 2>&1 | grep -o 'average:[0-9.inf]*')" >> $L; done
PYTHONIOENCODING=utf-8 python tools/concat_release.py $N >> $L 2>&1; echo "concat $?" >> $L
echo RELAYDONE >> $L
